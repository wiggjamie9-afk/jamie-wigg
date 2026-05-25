/**
 * api/create-checkout.ts — Vercel serverless function (ES module)
 *
 * Creates a Stripe Checkout session for upgrading to Chapel Pro.
 * Called by the client when an admin clicks "Upgrade to Pro" after hitting
 * the free-tier member limit (R8).
 *
 * POST body: { orgId: string; userId: string }
 * Response:  { url: string }   — redirect to this URL to start Checkout
 *
 * Environment variables required in production:
 *   STRIPE_SECRET_KEY      — sk_live_… / sk_test_…
 *   STRIPE_PRICE_ID        — price_… recurring monthly price
 *   NEXT_PUBLIC_APP_URL or VITE_APP_URL  — base URL for success/cancel redirects
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'
import Stripe from 'stripe'

/** Resolve the app base URL from whichever env var is set. */
function getAppUrl(): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.VITE_APP_URL ??
    'http://localhost:5173'
  )
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  // Only accept POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    res.status(405).json({ error: 'Method Not Allowed' })
    return
  }

  const { orgId, userId } = req.body as { orgId?: string; userId?: string }

  if (!orgId || !userId) {
    res.status(400).json({ error: 'orgId and userId are required' })
    return
  }

  // Dev/test fallback: if STRIPE_SECRET_KEY is absent, return a mock URL so
  // the front-end doesn't crash during local development without a real key.
  if (!process.env.STRIPE_SECRET_KEY) {
    console.warn('[create-checkout] STRIPE_SECRET_KEY not set — returning mock URL')
    res.status(200).json({ url: '#' })
    return
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-04-30.basil',
  })

  const appUrl = getAppUrl()

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/members`,
      metadata: {
        orgId,
        userId,
      },
    })

    res.status(200).json({ url: session.url })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown Stripe error'
    console.error('[create-checkout] Stripe error:', message)
    res.status(500).json({ error: message })
  }
}
