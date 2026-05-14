// POST /stripe-intent
//
// Mints (or reuses) a Stripe Customer + EphemeralKey + PaymentIntent for the caller,
// returning the shape the mobile PaymentSheet expects.
//
// Used on Android / web. iOS goes through RevenueCat (App Store IAP).
//
// Body: { amount: number (cents), currency: string (lowercase iso), sku: string }

import Stripe from 'npm:stripe@17';

import { handleCors, err, json } from '../_shared/cors.ts';
import { requireUser, serviceClient } from '../_shared/supabase.ts';

const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY')!;
const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2025-04-30.basil',
});

interface Body {
  amount: number;
  currency?: string;
  sku?: string;
}

Deno.serve(async (req) => {
  const cors = handleCors(req);
  if (cors) return cors;
  if (req.method !== 'POST') return err('method not allowed', 405);

  let auth: Awaited<ReturnType<typeof requireUser>>;
  try {
    auth = await requireUser(req);
  } catch (r) {
    return r as Response;
  }

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return err('invalid json body');
  }
  if (!Number.isFinite(body.amount) || body.amount < 50) return err('invalid amount');

  const svc = serviceClient();

  // Fetch or create the Stripe customer for this user.
  const { data: profile } = await svc
    .from('profiles')
    .select('id, stripe_customer_id, display_name')
    .eq('id', auth.user.id)
    .single();

  let customerId = profile?.stripe_customer_id ?? null;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: auth.user.email ?? undefined,
      name: profile?.display_name ?? undefined,
      metadata: { supabase_user_id: auth.user.id },
    });
    customerId = customer.id;
    await svc
      .from('profiles')
      .update({ stripe_customer_id: customer.id })
      .eq('id', auth.user.id);
  }

  const ephemeralKey = await stripe.ephemeralKeys.create(
    { customer: customerId },
    { apiVersion: '2025-04-30.basil' },
  );

  const intent = await stripe.paymentIntents.create({
    amount: Math.floor(body.amount),
    currency: (body.currency ?? 'usd').toLowerCase(),
    customer: customerId,
    automatic_payment_methods: { enabled: true },
    metadata: {
      supabase_user_id: auth.user.id,
      sku: body.sku ?? 'lifetime',
    },
  });

  return json({
    clientSecret: intent.client_secret,
    customerId,
    ephemeralKey: ephemeralKey.secret,
    customerName: profile?.display_name ?? auth.user.email ?? 'RHYTHMIX user',
  });
});
