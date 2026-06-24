import Stripe from 'stripe';
import { supabase } from './auth';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20',
});

/**
 * Verify Stripe webhook signature
 * Must be called before processing any webhook event
 *
 * @param body Raw request body as string
 * @param signature Stripe-Signature header value
 * @returns Parsed event object if valid
 * @throws Error if signature is invalid
 */
export function verifyWebhookSignature(body: string, signature: string): Stripe.Event {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

  if (!webhookSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET not configured');
  }

  try {
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    return event;
  } catch (error) {
    throw new Error(`Webhook signature verification failed: ${String(error)}`);
  }
}

/**
 * Map Stripe price IDs to subscription tiers
 * Must match the price IDs configured in PRICING_TIERS
 */
export function mapPriceToTier(priceId: string): 'pro' | 'studio' | null {
  const tierMap: Record<string, 'pro' | 'studio'> = {
    'price_pro_monthly': 'pro',
    'price_studio_monthly': 'studio',
  };
  return tierMap[priceId] || null;
}

/**
 * Sync Stripe subscription to Supabase
 * Called by webhook handler to update user tier and subscription record
 *
 * @param subscription Stripe subscription object
 * @throws Error if database update fails
 */
export async function syncSubscriptionToDatabase(subscription: Stripe.Subscription): Promise<void> {
  const userId = subscription.metadata?.user_id;
  if (!userId) {
    throw new Error('Subscription missing user_id in metadata');
  }

  const lineItem = subscription.items.data[0];
  if (!lineItem?.price?.id) {
    throw new Error('Subscription missing price information');
  }

  const tier = mapPriceToTier(lineItem.price.id);
  if (!tier) {
    throw new Error(`Unknown price ID: ${lineItem.price.id}`);
  }

  // Update user tier
  const { error: userError } = await supabase
    .from('users')
    .update({
      subscription_tier: tier,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  if (userError) {
    throw new Error(`Failed to update user tier: ${userError.message}`);
  }

  // Upsert subscription record
  const subscriptionData = {
    user_id: userId,
    stripe_subscription_id: subscription.id,
    stripe_customer_id: subscription.customer as string,
    tier,
    status: subscription.status,
    current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
    current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    cancel_at_period_end: subscription.cancel_at_period_end,
    active: subscription.status === 'active' || subscription.status === 'trialing',
    updated_at: new Date().toISOString(),
  };

  // Check if subscription exists
  const { data: existing } = await supabase
    .from('subscriptions')
    .select('id')
    .eq('stripe_subscription_id', subscription.id)
    .single();

  if (existing) {
    const { error: subError } = await supabase
      .from('subscriptions')
      .update(subscriptionData)
      .eq('id', existing.id);

    if (subError) {
      throw new Error(`Failed to update subscription: ${subError.message}`);
    }
  } else {
    const { error: subError } = await supabase
      .from('subscriptions')
      .insert([subscriptionData]);

    if (subError) {
      throw new Error(`Failed to create subscription: ${subError.message}`);
    }
  }
}

/**
 * Cancel user subscription and reset tier to free
 * Called by webhook when subscription.deleted event received
 *
 * @param subscription Stripe subscription object
 * @throws Error if database update fails
 */
export async function resetUserToFreeTier(subscription: Stripe.Subscription): Promise<void> {
  const userId = subscription.metadata?.user_id;
  if (!userId) {
    throw new Error('Subscription missing user_id in metadata');
  }

  // Reset user to free tier
  const { error: userError } = await supabase
    .from('users')
    .update({
      subscription_tier: 'free',
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  if (userError) {
    throw new Error(`Failed to reset user tier: ${userError.message}`);
  }

  // Mark subscription as inactive
  const { error: subError } = await supabase
    .from('subscriptions')
    .update({
      active: false,
      status: subscription.status,
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id);

  if (subError) {
    throw new Error(`Failed to mark subscription inactive: ${subError.message}`);
  }
}

export interface PricingTier {
  id: string;
  name: string;
  price: number;
  currency: string;
  features: string[];
  limit_videos?: number;
  limit_duration?: number;
}

export const PRICING_TIERS: Record<string, PricingTier> = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    currency: 'usd',
    features: [
      '1 video per month',
      'Up to 30 seconds',
      'Standard models',
      'Community support'
    ],
    limit_videos: 1,
    limit_duration: 30,
  },
  pro: {
    id: 'price_pro_monthly',
    name: 'Pro',
    price: 9.99,
    currency: 'usd',
    features: [
      'Unlimited videos',
      'Up to 120 seconds',
      'Premium models (FLUX 1.1 Pro)',
      'Priority support',
      'No watermark'
    ],
    limit_videos: null,
    limit_duration: 120,
  },
  studio: {
    id: 'price_studio_monthly',
    name: 'Studio',
    price: 99,
    currency: 'usd',
    features: [
      'Unlimited everything',
      '4K export',
      'Custom branding',
      'API access',
      'White-label option',
      'Dedicated support'
    ],
    limit_videos: null,
    limit_duration: null,
  },
};

export async function createCheckoutSession(
  userId: string,
  tierId: string,
  successUrl: string,
  cancelUrl: string
): Promise<{ url: string | null; error?: string }> {
  try {
    const tier = PRICING_TIERS[tierId];
    if (!tier || tier.price === 0) {
      return { url: null, error: 'Invalid tier' };
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: tier.id,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: userId,
      metadata: {
        user_id: userId,
        tier: tierId,
      },
    });

    return { url: session.url };
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return { url: null, error: String(error) };
  }
}

export async function cancelSubscription(subscriptionId: string): Promise<{ success: boolean; error?: string }> {
  try {
    await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });
    return { success: true };
  } catch (error) {
    console.error('Stripe cancellation error:', error);
    return { success: false, error: String(error) };
  }
}

export async function getSubscriptionDetails(subscriptionId: string) {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    return subscription;
  } catch (error) {
    console.error('Stripe retrieval error:', error);
    return null;
  }
}
