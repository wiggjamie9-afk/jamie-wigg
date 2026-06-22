import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabase } from '@/lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const sig = request.headers.get('stripe-signature');

    if (!sig) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (error: any) {
      console.error('Webhook signature verification failed:', error.message);
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      );
    }

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  const tier = session.metadata?.tier;

  if (!userId || !tier) {
    console.error('Missing userId or tier in metadata');
    return;
  }

  // Update user subscription
  await supabase
    .from('users')
    .update({
      subscription_tier: tier,
      stripe_customer_id: session.customer as string,
    })
    .eq('id', userId);

  // Create user membership record
  await supabase
    .from('user_memberships')
    .insert([
      {
        user_id: userId,
        plan_tier: tier,
        active: true,
        stripe_subscription_id: session.subscription as string,
      },
    ]);

  console.log(`Subscription activated for user ${userId} - tier: ${tier}`);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId;

  if (!userId) {
    console.error('Missing userId in subscription metadata');
    return;
  }

  // Update subscription status
  const status = subscription.status === 'active' ? 'active' : 'past_due';

  await supabase
    .from('users')
    .update({
      subscription_status: status,
    })
    .eq('id', userId);

  console.log(`Subscription updated for user ${userId} - status: ${status}`);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId;

  if (!userId) {
    console.error('Missing userId in subscription metadata');
    return;
  }

  // Downgrade to free tier
  await supabase
    .from('users')
    .update({
      subscription_tier: 'free',
      subscription_status: 'cancelled',
    })
    .eq('id', userId);

  // Mark membership as ended
  await supabase
    .from('user_memberships')
    .update({
      active: false,
      ended_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id);

  console.log(`Subscription cancelled for user ${userId}`);
}

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  const userId = paymentIntent.metadata?.userId;
  const amount = paymentIntent.amount / 100; // Convert from cents

  if (!userId) {
    console.error('Missing userId in payment intent metadata');
    return;
  }

  // Record earning
  await supabase
    .from('earnings')
    .insert([
      {
        user_id: userId,
        method: 'membership',
        amount,
        currency: 'USD',
        stripe_transaction_id: paymentIntent.id,
        status: 'completed',
      },
    ]);

  console.log(`Payment succeeded for user ${userId} - amount: $${amount}`);
}
