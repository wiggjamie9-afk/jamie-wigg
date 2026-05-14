// POST /revenuecat-webhook
//
// RevenueCat sends events here when an iOS in-app purchase completes / refunds.
// We mirror the entitlement onto profiles.lifetime_unlocked.
//
// Configure in RevenueCat dashboard → Project settings → Integrations → Webhooks
//   URL: https://<your-supabase-project>.supabase.co/functions/v1/revenuecat-webhook
//   Auth: set Authorization header to a long random secret, mirror it in
//         the REVENUECAT_WEBHOOK_AUTH env var of this function.
//
// You MUST set RevenueCat's `app_user_id` to the Supabase user id at sign-in
// (see lib/purchases.ts → configurePurchases(userId)).

import { corsHeaders } from '../_shared/cors.ts';
import { serviceClient } from '../_shared/supabase.ts';

const REVENUECAT_WEBHOOK_AUTH = Deno.env.get('REVENUECAT_WEBHOOK_AUTH') ?? '';
const ENTITLEMENT_ID = Deno.env.get('REVENUECAT_ENTITLEMENT') ?? 'lifetime';

interface RcEvent {
  type: string;
  app_user_id: string;
  product_id?: string;
  transaction_id?: string;
  price_in_purchased_currency?: number;
  currency?: string;
  entitlement_ids?: string[];
  expiration_at_ms?: number | null;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return new Response('method not allowed', { status: 405 });

  if (REVENUECAT_WEBHOOK_AUTH) {
    if (req.headers.get('authorization') !== REVENUECAT_WEBHOOK_AUTH) {
      return new Response('unauthorized', { status: 401 });
    }
  }

  let body: { event: RcEvent };
  try {
    body = await req.json();
  } catch {
    return new Response('invalid json', { status: 400 });
  }
  const ev = body.event;
  if (!ev || !ev.app_user_id) return new Response('missing app_user_id', { status: 400 });

  const grants = ['INITIAL_PURCHASE', 'NON_RENEWING_PURCHASE', 'RENEWAL', 'PRODUCT_CHANGE'];
  const revokes = ['CANCELLATION', 'REFUND', 'EXPIRATION', 'SUBSCRIPTION_PAUSED'];

  const svc = serviceClient();

  if (grants.includes(ev.type) && ev.entitlement_ids?.includes(ENTITLEMENT_ID)) {
    await svc.from('payments').upsert(
      {
        user_id: ev.app_user_id,
        provider: 'iap',
        amount_cents: Math.round((ev.price_in_purchased_currency ?? 0) * 100),
        currency: (ev.currency ?? 'usd').toLowerCase(),
        external_id: ev.transaction_id ?? `rc_${Date.now()}`,
        sku: ev.product_id ?? 'lifetime',
        status: 'succeeded',
        raw: body as unknown as Record<string, unknown>,
      },
      { onConflict: 'provider,external_id' },
    );

    await svc
      .from('profiles')
      .update({
        lifetime_unlocked: true,
        unlocked_at: new Date().toISOString(),
        unlock_provider: 'iap',
      })
      .eq('id', ev.app_user_id);
  } else if (revokes.includes(ev.type) && ev.entitlement_ids?.includes(ENTITLEMENT_ID)) {
    if (ev.transaction_id) {
      await svc
        .from('payments')
        .update({ status: 'refunded' })
        .eq('provider', 'iap')
        .eq('external_id', ev.transaction_id);
    }
    await svc
      .from('profiles')
      .update({
        lifetime_unlocked: false,
        unlocked_at: null,
        unlock_provider: null,
      })
      .eq('id', ev.app_user_id);
  }

  return new Response('ok', { headers: corsHeaders });
});
