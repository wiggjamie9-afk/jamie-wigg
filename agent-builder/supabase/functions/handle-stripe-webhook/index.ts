import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const stripe = await import('https://esm.sh/stripe@16.0.0?target=deno').then(
  (m) => new m.default(Deno.env.get('STRIPE_SECRET_KEY'))
);

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
    });
  }

  const signature = req.headers.get('stripe-signature');
  if (!signature) {
    return new Response(JSON.stringify({ error: 'Missing stripe-signature' }), {
      status: 400,
    });
  }

  try {
    const body = await req.text();
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      Deno.env.get('STRIPE_WEBHOOK_SECRET') || ''
    );

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    );

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const productId = session.metadata?.product_id;
        const tierId = session.metadata?.tier_id;
        const userEmail = session.customer_email || session.metadata?.email;

        if (!productId || !tierId || !userEmail) {
          return new Response(
            JSON.stringify({ error: 'Missing metadata' }),
            { status: 400 }
          );
        }

        // Find or create user
        let { data: user } = await supabase
          .from('app_users')
          .select('id')
          .eq('email', userEmail)
          .single();

        if (!user) {
          const { data: authData } = await supabase.auth.admin.createUser({
            email: userEmail,
            password: Math.random().toString(36),
            email_confirm: true,
          });

          if (!authData.user) throw new Error('Failed to create user');

          await supabase.from('app_users').insert({
            id: authData.user.id,
            email: userEmail,
          });

          user = { id: authData.user.id };
        }

        // Generate license key
        const licenseKey = `LIC-${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 11)
          .toUpperCase()}`;

        // Create purchase record
        await supabase.from('purchases').insert({
          id: `${productId}-${user.id}-${Date.now()}`,
          user_id: user.id,
          product_id: productId,
          tier_id: tierId,
          license_key: licenseKey,
          stripe_customer_id: session.customer,
          stripe_subscription_id: session.subscription,
          status: 'active',
          purchased_at: new Date().toISOString(),
        });

        // Get tier price for revenue tracking
        const { data: tier } = await supabase
          .from('pricing_tiers')
          .select('price_usd')
          .eq('id', tierId)
          .single();

        // Log revenue event
        await supabase.from('revenue_events').insert({
          id: `${productId}-${user.id}-${Date.now()}`,
          user_id: user.id,
          product_id: productId,
          purchase_id: `${productId}-${user.id}-${Date.now()}`,
          event_type: 'purchase',
          amount_usd: tier?.price_usd || 0,
          stripe_charge_id: session.payment_intent,
        });

        return new Response(JSON.stringify({ received: true }));
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        await supabase
          .from('purchases')
          .update({
            status: 'active',
            expires_at:
              subscription.current_period_end &&
              new Date(
                subscription.current_period_end * 1000
              ).toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', subscription.id);

        return new Response(JSON.stringify({ received: true }));
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        await supabase
          .from('purchases')
          .update({
            status: 'cancelled',
            cancelled_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', subscription.id);

        return new Response(JSON.stringify({ received: true }));
      }

      case 'charge.refunded': {
        const charge = event.data.object;
        const { data: purchase } = await supabase
          .from('purchases')
          .select('id, product_id, user_id')
          .eq('stripe_customer_id', charge.customer)
          .order('purchased_at', { ascending: false })
          .limit(1)
          .single();

        if (purchase) {
          await supabase.from('revenue_events').insert({
            id: `refund-${charge.id}`,
            user_id: purchase.user_id,
            product_id: purchase.product_id,
            purchase_id: purchase.id,
            event_type: 'refund',
            amount_usd: -(charge.amount_refunded / 100),
            stripe_charge_id: charge.id,
          });
        }

        return new Response(JSON.stringify({ received: true }));
      }

      default:
        return new Response(JSON.stringify({ received: true }));
    }
  } catch (err) {
    console.error('Webhook error:', err);
    return new Response(
      JSON.stringify({ error: 'Webhook processing failed' }),
      { status: 500 }
    );
  }
});
