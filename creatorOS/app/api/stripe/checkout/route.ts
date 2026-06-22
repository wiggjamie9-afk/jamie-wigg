import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabase } from '@/lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

interface CheckoutRequest {
  userId: string;
  tier: 'pro' | 'studio';
  billingPeriod: 'monthly' | 'yearly';
}

export async function POST(request: NextRequest) {
  try {
    const body: CheckoutRequest = await request.json();
    const { userId, tier, billingPeriod } = body;

    if (!userId || !tier || !billingPeriod) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get user
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get subscription plan
    const { data: plan } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('tier', tier)
      .single();

    if (!plan) {
      return NextResponse.json(
        { error: 'Plan not found' },
        { status: 404 }
      );
    }

    const amount = billingPeriod === 'monthly' ? plan.monthly_price : plan.yearly_price;

    // Create or get customer
    let customerId = user.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: {
          userId,
        },
      });
      customerId = customer.id;

      // Save customer ID
      await supabase
        .from('users')
        .update({ stripe_customer_id: customerId })
        .eq('id', userId);
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `CreatorOS ${tier.charAt(0).toUpperCase() + tier.slice(1)}`,
              description: `${tier} plan subscription`,
            },
            unit_amount: Math.round(amount * 100),
            recurring: {
              interval: billingPeriod === 'monthly' ? 'month' : 'year',
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.VERCEL_URL || 'http://localhost:3000'}/dashboard?success=true&plan=${tier}`,
      cancel_url: `${process.env.VERCEL_URL || 'http://localhost:3000'}/dashboard/monetize`,
      metadata: {
        userId,
        tier,
      },
    });

    return NextResponse.json(
      {
        success: true,
        checkout_url: session.url,
        session_id: session.id,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: error.message || 'Checkout failed' },
      { status: 500 }
    );
  }
}
