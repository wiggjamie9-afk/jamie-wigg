/**
 * Payments are intentionally split:
 *
 *   iOS  → Apple StoreKit / RevenueCat (Apple's IAP rules require it for digital goods).
 *   Android → Stripe PaymentSheet (Google's User Choice Billing allows it).
 *   Web  → Stripe Checkout.
 *
 * This file exposes one entry point. Wire RevenueCat once the iOS storefront is configured.
 */

import { Platform } from 'react-native';
import { initPaymentSheet, presentPaymentSheet } from '@stripe/stripe-react-native';

import { buyLifetime } from './purchases';

export type CheckoutResult =
  | { status: 'completed'; provider: 'stripe' | 'iap' }
  | { status: 'cancelled' }
  | { status: 'error'; message: string };

const LIFETIME_PRICE_USD_CENTS = 14900; // $149 — matches the landing page.

export async function purchaseLifetime(): Promise<CheckoutResult> {
  if (Platform.OS === 'ios') {
    return purchaseIAP();
  }
  return purchaseStripe(LIFETIME_PRICE_USD_CENTS);
}

async function purchaseStripe(amountCents: number): Promise<CheckoutResult> {
  try {
    const intent = await fetchPaymentIntent(amountCents);

    const init = await initPaymentSheet({
      merchantDisplayName: 'RHYTHMIX',
      paymentIntentClientSecret: intent.clientSecret,
      customerId: intent.customerId,
      customerEphemeralKeySecret: intent.ephemeralKey,
      defaultBillingDetails: { name: intent.customerName },
      allowsDelayedPaymentMethods: false,
      returnURL: 'rhythmix://stripe-redirect',
      googlePay: {
        merchantCountryCode: 'US',
        testEnv: __DEV__,
      },
    });
    if (init.error) return { status: 'error', message: init.error.message };

    const present = await presentPaymentSheet();
    if (present.error) {
      if (present.error.code === 'Canceled') return { status: 'cancelled' };
      return { status: 'error', message: present.error.message };
    }
    return { status: 'completed', provider: 'stripe' };
  } catch (e) {
    return { status: 'error', message: e instanceof Error ? e.message : String(e) };
  }
}

async function purchaseIAP(): Promise<CheckoutResult> {
  const result = await buyLifetime();
  if (result.ok) return { status: 'completed', provider: 'iap' };
  if (result.reason === 'cancelled') return { status: 'cancelled' };
  return { status: 'error', message: result.reason };
}

async function fetchPaymentIntent(amountCents: number) {
  const url = process.env.EXPO_PUBLIC_STRIPE_INTENT_URL;
  if (!url) {
    throw new Error(
      'EXPO_PUBLIC_STRIPE_INTENT_URL is not set. Point it at a Supabase Edge Function or your API that returns { clientSecret, customerId, ephemeralKey, customerName }.',
    );
  }
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: amountCents, currency: 'usd', sku: 'lifetime' }),
  });
  if (!res.ok) throw new Error(`Stripe intent endpoint returned ${res.status}`);
  return (await res.json()) as {
    clientSecret: string;
    customerId: string;
    ephemeralKey: string;
    customerName: string;
  };
}
