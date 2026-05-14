// POST /stripe-webhook
//
// Verifies the Stripe signature, then on payment_intent.succeeded:
//   - marks profiles.lifetime_unlocked = true for the user encoded in metadata
//   - inserts a payments row
//
// On charge.refunded:
//   - flips lifetime_unlocked back off
//   - marks the payment row as refunded
//
// Configure the endpoint in Stripe Dashboard → Developers → Webhooks
//   URL: https://<your-supabase-project>.supabase.co/functions/v1/stripe-webhook
//   Events: payment_intent.succeeded, charge.refunded

import Stripe from 'npm:stripe@17';

import { corsHeaders } from '../_shared/cors.ts';
import { serviceClient } from '../_shared/supabase.ts';

const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY')!;
const STRIPE_WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET')!;

const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2025-04-30.basil' });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return new Response('method not allowed', { status: 405 });

  const sig = req.headers.get('stripe-signature');
  if (!sig) return new Response('missing signature', { status: 400 });

  const raw = await req.text();
  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(raw, sig, STRIPE_WEBHOOK_SECRET);
  } catch (e) {
    return new Response(`invalid signature: ${e instanceof Error ? e.message : e}`, {
      status: 400,
    });
  }

  const svc = serviceClient();

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const pi = event.data.object as Stripe.PaymentIntent;
      const userId = (pi.metadata?.supabase_user_id ?? '') as string;
      if (!userId) break;

      await svc
        .from('payments')
        .insert({
          user_id: userId,
          provider: 'stripe',
          amount_cents: pi.amount_received,
          currency: pi.currency,
          external_id: pi.id,
          sku: pi.metadata?.sku ?? 'lifetime',
          status: 'succeeded',
          raw: event.data.object as unknown as Record<string, unknown>,
        });

      await svc
        .from('profiles')
        .update({
          lifetime_unlocked: true,
          unlocked_at: new Date().toISOString(),
          unlock_provider: 'stripe',
        })
        .eq('id', userId);
      break;
    }
    case 'charge.refunded': {
      const charge = event.data.object as Stripe.Charge;
      const piId = typeof charge.payment_intent === 'string' ? charge.payment_intent : null;
      if (!piId) break;
      const { data: payment } = await svc
        .from('payments')
        .select('user_id')
        .eq('provider', 'stripe')
        .eq('external_id', piId)
        .single();
      if (!payment) break;

      await svc
        .from('payments')
        .update({ status: 'refunded' })
        .eq('provider', 'stripe')
        .eq('external_id', piId);

      await svc
        .from('profiles')
        .update({
          lifetime_unlocked: false,
          unlocked_at: null,
          unlock_provider: null,
        })
        .eq('id', payment.user_id);
      break;
    }
    default:
      // No-op for unhandled events — Stripe expects a 2xx so it stops retrying.
      break;
  }

  return new Response('ok', { headers: corsHeaders });
});
