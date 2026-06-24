import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { verifyWebhookSignature, syncSubscriptionToDatabase, resetUserToFreeTier } from '@/lib/payments';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20',
});

/**
 * POST /api/webhooks/stripe
 *
 * Handles Stripe webhook events for subscription management.
 * All events are verified using the STRIPE_WEBHOOK_SECRET.
 *
 * Events handled:
 * - checkout.session.completed: subscription created -> sync to database
 * - customer.subscription.updated: subscription changes -> sync to database
 * - customer.subscription.deleted: subscription cancelled -> reset user tier
 *
 * On error:
 * - Returns 401 if signature verification fails
 * - Returns 400 if required headers missing
 * - Returns 500 if database operations fail
 * - Returns 200 on successful processing (even if event is skipped)
 */
export async function POST(request: NextRequest) {
  try {
    // Get raw body for signature verification (must be before JSON parsing)
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    // Validate signature header exists
    if (!signature) {
      console.error('Webhook: missing stripe-signature header');
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    // Verify webhook signature (throws if invalid)
    let event: Stripe.Event;
    try {
      event = verifyWebhookSignature(body, signature);
    } catch (error) {
      console.error('Webhook signature verification failed:', error);
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 401 }
      );
    }

    console.log(`Webhook received: ${event.type} (${event.id})`);

    // Handle specific event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const subscriptionId = session.subscription;

        if (typeof subscriptionId === 'string') {
          // Retrieve full subscription details from Stripe
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          await syncSubscriptionToDatabase(subscription);
          console.log(`Webhook: subscription created for user ${subscription.metadata?.user_id}`);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await syncSubscriptionToDatabase(subscription);
        console.log(`Webhook: subscription updated for user ${subscription.metadata?.user_id}`);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await resetUserToFreeTier(subscription);
        console.log(`Webhook: subscription deleted for user ${subscription.metadata?.user_id}`);
        break;
      }

      default:
        // Silently ignore unhandled event types
        console.log(`Webhook: ignoring unhandled event type ${event.type}`);
    }

    // Always return 200 on successful processing
    // This tells Stripe the webhook was received, even if we ignored the event type
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);

    // Return 500 for unexpected errors (Stripe will retry)
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
