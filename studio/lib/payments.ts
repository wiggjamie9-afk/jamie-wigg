import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20',
});

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
