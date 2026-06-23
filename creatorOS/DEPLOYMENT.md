# CreatorOS Deployment Guide

Deploy CreatorOS to Vercel in 5 minutes.

## Prerequisites

- Vercel account (free at https://vercel.com)
- GitHub account with this repo pushed
- API keys ready:
  - Supabase URL + keys
  - Stripe test keys (pk_test_*, sk_test_*)
  - Replicate API token
  - Resend API key (free at https://resend.com)

## Step 1: Push to GitHub

```bash
git add -A
git commit -m "Ready for deployment"
git push -u origin claude/postfox-ai-tool-1mkuiq
```

## Step 2: Deploy to Vercel

1. Go to https://vercel.com/new
2. Select **Import Git Repository**
3. Connect your GitHub account and select `jamie-wigg` repo
4. Click **Import**

## Step 3: Add Environment Variables

In the Vercel Dashboard, go to **Settings > Environment Variables** and add:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
STRIPE_SECRET_KEY=sk_test_your_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
REPLICATE_API_TOKEN=your_replicate_token
RESEND_API_KEY=re_your_resend_key
```

**Get these values from:**
- **Supabase**: Project Settings > API
- **Stripe**: Dashboard > API Keys (use test mode)
- **Replicate**: Account > API Tokens
- **Resend**: Dashboard > API Keys

## Step 4: Deploy

Click **Deploy**. Vercel will:
- Install dependencies
- Build the Next.js app
- Deploy to a live URL

## Step 5: Set Up Stripe Webhooks

1. Go to Stripe Dashboard > Webhooks
2. Add endpoint: `https://<your-vercel-url>/api/stripe/webhook`
3. Select events: `customer.subscription.updated`, `customer.subscription.deleted`, `charge.succeeded`
4. Copy the webhook secret to `STRIPE_WEBHOOK_SECRET` in Vercel

## Step 6: Test Landing Pages

Visit these URLs on your live Vercel domain:
- `https://<your-domain>/landing-video`
- `https://<your-domain>/landing-scheduler`
- `https://<your-domain>/landing-music`
- `https://<your-domain>/landing-image`

## Resend Setup (Email)

1. Sign up free at https://resend.com
2. Get your API key
3. Add to Vercel: `RESEND_API_KEY=re_xxxxx`
4. Verify your email domain (or use default `onboarding@creatorOS.dev`)

## Troubleshooting

**Build fails?**
- Check Node version: `node --version` (need 20+)
- Check dependencies: `pnpm install`

**Email not sending?**
- Verify `RESEND_API_KEY` is set in Vercel
- Check Resend dashboard for API key validity

**Landing pages not loading?**
- Verify rewrites in `vercel.json` are correct
- Check Vercel build logs for errors

## Next Steps (Phase 1)

Once deployed:
1. Share landing page links to 10 people
2. Measure clicks and email signups
3. Set up Discord server
4. Build referral system
5. Create email sequence

See `GROWTH_PLAN.md` for full 90-day roadmap.
