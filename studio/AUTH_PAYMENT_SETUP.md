# STARLIGHTMIX Studio Week 1: Auth + Payment Setup Guide

Complete guide to configure and test the authentication and payment flow locally.

## Overview

- **Auth**: Supabase (email + password)
- **Payments**: Stripe (checkout + subscription management via webhooks)
- **Database**: Supabase PostgreSQL (users + subscriptions tables)
- **Webhook**: Stripe events → Supabase (updates user tier on purchase)

## Architecture

```
User Signs Up
    ↓
Supabase Auth + Profile Created (tier=free)
    ↓
User Clicks "Upgrade to Pro"
    ↓
Stripe Checkout Session Created
    ↓
User Completes Payment
    ↓
Stripe Webhook → /api/webhooks/stripe
    ↓
Database Updated (tier=pro)
    ↓
User Sees Dashboard with "Create Video" Button
```

## Prerequisites

### 1. Supabase Project

1. Create a new project at [supabase.com](https://supabase.com)
2. Note your **Project URL** and **Anon Key**
3. In the SQL Editor, run the schema setup (see below)

### 2. Stripe Account

1. Create account at [stripe.com](https://stripe.com)
2. In the Stripe Dashboard:
   - Create two price objects:
     - **Pro**: $9.99/month (ID: `price_pro_monthly`)
     - **Studio**: $99/month (ID: `price_studio_monthly`)
   - Copy your **Secret Key** (starts with `sk_live_` or `sk_test_`)
   - Generate a **Webhook Signing Secret** (see Local Testing below)

### 3. Environment Variables

Create `.env.local` in the `studio/` directory:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Stripe (test mode for local dev)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_test_...
```

**Never commit `.env.local` to git!**

## Database Schema

Run this SQL in your Supabase SQL Editor to create the tables:

```sql
-- Users table (extends auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'studio')),
  credits_remaining INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Subscriptions table (synced from Stripe webhooks)
CREATE TABLE IF NOT EXISTS subscriptions (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT NOT NULL UNIQUE,
  stripe_customer_id TEXT NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('pro', 'studio')),
  status TEXT NOT NULL,
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Enable RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only see their own data
CREATE POLICY "Users can read own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can read own subscriptions" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- Service role can bypass RLS (for webhook handler)
-- Note: Webhook uses service role key, which is configured in Stripe webhook endpoint
```

## Local Testing

### 1. Start Dev Server

```bash
cd studio
pnpm install
pnpm dev
```

Navigate to `http://localhost:3000`

### 2. Test Auth Flow

1. Click "New? Create account"
2. Enter:
   - Email: `test@example.com`
   - Password: `TestPassword123!`
3. Click "Create Account"
4. You should be redirected to `/dashboard`

### 3. Test Checkout Flow (Stripe CLI Required)

#### Install Stripe CLI

```bash
# macOS with Homebrew
brew install stripe/stripe-cli/stripe

# Or from: https://stripe.com/docs/stripe-cli
```

#### Start Stripe Webhook Listener

In a separate terminal:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

This outputs:
```
> Ready! Your webhook signing secret is: whsec_test_1234567890...
```

Copy this secret and update `.env.local`:
```bash
STRIPE_WEBHOOK_SECRET=whsec_test_1234567890...
```

#### Test Checkout

1. On dashboard, click "Unlock Premium Features"
2. Select "Pro" plan → "Upgrade to Pro"
3. You're redirected to Stripe Checkout
4. Use test card: `4242 4242 4242 4242`
   - Exp: Any future date
   - CVC: Any 3 digits
5. Click "Pay" → You're redirected to `/dashboard?success=true`
6. You should see the success message
7. Refresh page → Tier should now be "Pro"

#### Verify Webhook Updated Database

In Supabase SQL Editor:

```sql
SELECT * FROM users WHERE email = 'test@example.com';
SELECT * FROM subscriptions WHERE user_id = (SELECT id FROM users WHERE email = 'test@example.com');
```

Both should show the Pro subscription.

### 4. Test Cancellation

1. On `/settings` page, click "Cancel Subscription"
2. Confirm cancellation
3. Check Supabase: subscription `active` should be `false`, tier should reset to `free`

## File Structure

```
studio/
├── app/
│   ├── page.tsx                    # Auth UI + pricing cards
│   ├── dashboard/page.tsx          # Authenticated landing
│   ├── settings/page.tsx           # Account settings
│   ├── api/webhooks/stripe/route.ts # Webhook handler
│   └── ...
├── lib/
│   ├── auth.ts                     # Supabase auth helpers
│   └── payments.ts                 # Stripe + webhook helpers
├── middleware.ts                   # Route guards
└── .env.local                      # Secrets (not committed)
```

## Key Functions

### Auth (`lib/auth.ts`)

- `getCurrentUser()` - Get current user + tier from Supabase
- `signUp(email, password)` - Create account + profile with free tier
- `signIn(email, password)` - Sign in + ensure profile exists
- `signOut()` - Clear session
- `getSubscriptionStatus()` - Check if user has active subscription

### Payments (`lib/payments.ts`)

- `PRICING_TIERS` - Pricing structure (free/pro/studio)
- `createCheckoutSession(userId, tierId, successUrl, cancelUrl)` - Create Stripe session
- `verifyWebhookSignature(body, signature)` - Verify Stripe webhook
- `syncSubscriptionToDatabase(subscription)` - Update user tier on purchase
- `resetUserToFreeTier(subscription)` - Reset tier on cancellation
- `mapPriceToTier(priceId)` - Convert Stripe price ID to tier

### Webhook (`app/api/webhooks/stripe/route.ts`)

Handles three events:
- `checkout.session.completed` - User completes payment
- `customer.subscription.updated` - Subscription changes (e.g., plan upgrade)
- `customer.subscription.deleted` - User cancels subscription

## Testing Checklist

- [ ] Can sign up with new email
- [ ] Can sign in with existing credentials
- [ ] Signed-in users see dashboard with tier
- [ ] Free users see upgrade buttons
- [ ] Pro/Studio users see "Create Video" CTA
- [ ] Checkout redirects to Stripe
- [ ] Test card payment succeeds
- [ ] After payment, tier updates to "Pro"
- [ ] Can access `/settings` to manage subscription
- [ ] Can cancel subscription
- [ ] After cancellation, tier resets to "free"
- [ ] No TypeScript errors: `pnpm lint`
- [ ] No console errors in browser DevTools

## Production Deployment Notes

### Webhook Endpoint

The webhook handler uses Next.js API routes, but **Next.js static export doesn't support API routes**. For production:

**Option 1: Move to Cloudflare Worker** (Recommended)
- Deploy `app/api/webhooks/stripe/route.ts` as a Cloudflare Worker
- Worker can access Supabase to sync subscriptions
- Update Stripe webhook endpoint to point to Worker URL

**Option 2: Use a separate backend**
- Deploy a simple Node/Express server for the webhook
- Stripe → Express webhook endpoint → Supabase

See the planning agent's recommendations for architecture details.

### Environment Variables

Set in your deployment platform (Vercel, Cloudflare, etc.):
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

### Stripe Live Mode

When ready to launch:
1. Switch Stripe API keys from `sk_test_` to `sk_live_`
2. Generate new webhook signing secret from live mode
3. Test with real cards ($0.50 refunded charge)
4. Update Stripe webhook endpoint URL to production domain

## Troubleshooting

### "Webhook signature verification failed"

- Ensure `STRIPE_WEBHOOK_SECRET` matches the Stripe CLI output
- Restart dev server after updating `.env.local`
- Check Stripe webhook delivery logs in Dashboard

### "Failed to update user tier"

- Check Supabase SQL error logs
- Verify user exists in `users` table
- Ensure RLS policies allow webhook to update data
- Test manually: `UPDATE users SET subscription_tier = 'pro' WHERE id = '...'`

### "User not found" on sign in

- Check Supabase `auth.users` table
- Ensure profile creation works: profile should auto-create in `users` table
- If missing, run: `INSERT INTO users (id, email, subscription_tier) VALUES ('...', '...', 'free')`

### Webhook not triggering

- Ensure Stripe CLI is running: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
- Check Stripe webhook logs: Dashboard → Webhooks → Click endpoint → View events
- Verify `/api/webhooks/stripe` endpoint returns `200` or `500` (not 404)

## Next Steps (Phase 2)

Once auth + payments are stable:
1. Implement video generation API (`/api/generate`)
2. Wire "Create Video" button to generation flow
3. Add video history/library management
4. Integrate Replicate token input
5. Add usage tracking (videos remaining, credits used)

## References

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Stripe Checkout Docs](https://stripe.com/docs/checkout/quickstart)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
