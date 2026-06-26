/**
 * Stripe Webhook Handler
 * Handles payment events: new purchases, subscriptions, refunds, etc.
 *
 * Environment variables needed:
 * STRIPE_SECRET_KEY - from Stripe dashboard
 * STRIPE_WEBHOOK_SECRET - from Stripe webhooks settings
 */

import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

/**
 * Generate unique license key
 */
function generateLicenseKey(): string {
  return `LIC-${Date.now()}-${Math.random().toString(36).substring(2, 11).toUpperCase()}`;
}

/**
 * Handle Stripe webhook events
 */
export async function handleStripeWebhook(
  body: string,
  signature: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );

    switch (event.type) {
      case 'checkout.session.completed':
        return await handleCheckoutComplete(
          event.data.object as Stripe.Checkout.Session
        );

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        return await handleSubscriptionUpdate(
          event.data.object as Stripe.Subscription
        );

      case 'customer.subscription.deleted':
        return await handleSubscriptionCancelled(
          event.data.object as Stripe.Subscription
        );

      case 'charge.refunded':
        return await handleRefund(event.data.object as Stripe.Charge);

      default:
        return { success: true }; // Ignore other event types
    }
  } catch (err) {
    console.error('Webhook error:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Webhook processing failed',
    };
  }
}

/**
 * Handle successful payment (one-time or subscription start)
 */
async function handleCheckoutComplete(
  session: Stripe.Checkout.Session
): Promise<{ success: boolean; error?: string }> {
  try {
    const productId = session.metadata?.product_id;
    const tierId = session.metadata?.tier_id;
    const userEmail = session.customer_email || session.metadata?.email;

    if (!productId || !tierId || !userEmail) {
      return {
        success: false,
        error: 'Missing product_id, tier_id, or email in metadata',
      };
    }

    // Find or create user by email
    let { data: user, error: userError } = await supabase
      .from('app_users')
      .select('id')
      .eq('email', userEmail)
      .single();

    if (userError || !user) {
      // Create new user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser(
        {
          email: userEmail,
          password: Math.random().toString(36),
          email_confirm: true,
        }
      );

      if (authError || !authData.user) {
        return {
          success: false,
          error: 'Failed to create user',
        };
      }

      // Insert into app_users
      const { error: insertError } = await supabase.from('app_users').insert({
        id: authData.user.id,
        email: userEmail,
      });

      if (insertError) {
        return {
          success: false,
          error: 'Failed to insert user',
        };
      }

      user = { id: authData.user.id };
    }

    // Create purchase record
    const licenseKey = generateLicenseKey();
    const { error: purchaseError } = await supabase
      .from('purchases')
      .insert({
        id: `${productId}-${user.id}-${Date.now()}`,
        user_id: user.id,
        product_id: productId,
        tier_id: tierId,
        license_key: licenseKey,
        stripe_customer_id: session.customer as string,
        stripe_subscription_id: session.subscription as string,
        status: 'active',
        purchased_at: new Date().toISOString(),
      });

    if (purchaseError) {
      return {
        success: false,
        error: 'Failed to create purchase',
      };
    }

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
      stripe_charge_id: session.payment_intent as string,
    });

    // TODO: Send email with license key to user.email

    return { success: true };
  } catch (err) {
    console.error('Checkout error:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Checkout processing failed',
    };
  }
}

/**
 * Handle subscription renewal or update
 */
async function handleSubscriptionUpdate(
  subscription: any
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('purchases')
      .update({
        status: 'active',
        expires_at:
          subscription.current_period_end &&
          new Date(subscription.current_period_end * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_subscription_id', subscription.id);

    if (error) {
      return {
        success: false,
        error: 'Failed to update subscription',
      };
    }

    return { success: true };
  } catch (err) {
    console.error('Subscription update error:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Subscription update failed',
    };
  }
}

/**
 * Handle subscription cancellation
 */
async function handleSubscriptionCancelled(
  subscription: any
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('purchases')
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_subscription_id', subscription.id);

    if (error) {
      return {
        success: false,
        error: 'Failed to cancel subscription',
      };
    }

    return { success: true };
  } catch (err) {
    console.error('Subscription cancellation error:', err);
    return {
      success: false,
      error:
        err instanceof Error ? err.message : 'Subscription cancellation failed',
    };
  }
}

/**
 * Handle refunds
 */
async function handleRefund(
  charge: Stripe.Charge
): Promise<{ success: boolean; error?: string }> {
  try {
    // Find purchase by stripe charge
    const { data: purchase, error: findError } = await supabase
      .from('purchases')
      .select('id, product_id, user_id')
      .eq('stripe_customer_id', charge.customer as string)
      .order('purchased_at', { ascending: false })
      .limit(1)
      .single();

    if (findError || !purchase) {
      return {
        success: false,
        error: 'Purchase not found for refund',
      };
    }

    // Log refund event
    await supabase.from('revenue_events').insert({
      id: `refund-${charge.id}`,
      user_id: purchase.user_id,
      product_id: purchase.product_id,
      purchase_id: purchase.id,
      event_type: 'refund',
      amount_usd: -(charge.amount_refunded / 100),
      stripe_charge_id: charge.id,
    });

    return { success: true };
  } catch (err) {
    console.error('Refund error:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Refund processing failed',
    };
  }
}
