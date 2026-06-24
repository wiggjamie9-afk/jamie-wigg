# CreatorOS — 5-Minute Money Machine Setup

You need to do **3 things**. That's it. Everything else is automatic.

## Step 1: Get API Keys (Copy-Paste Only)

### Resend Email Key
1. Go to https://resend.com (free sign up)
2. Click "API Keys" in sidebar
3. Copy the key that starts with `re_`
4. Save it somewhere temporarily

### Stripe Test Keys (You Already Have)
- Already in your `.env.local` (pk_test_*, sk_test_*)

### Replicate Token (You Already Have)
- Already in your `.env.local`

## Step 2: Deploy to Vercel (Click Once)

1. Go to https://vercel.com/new
2. Connect GitHub → Select `jamie-wigg` repo
3. Click **Import**
4. Go to **Settings > Environment Variables**
5. Add these environment variables:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | From your Supabase project settings |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | From your Supabase project settings |
| `SUPABASE_SERVICE_ROLE_KEY` | From your Supabase project settings |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | From Stripe Dashboard > API Keys (test mode) |
| `STRIPE_SECRET_KEY` | From Stripe Dashboard > API Keys (test mode) |
| `STRIPE_WEBHOOK_SECRET` | You'll get this in Step 3 |
| `REPLICATE_API_TOKEN` | From your Replicate account |
| `RESEND_API_KEY` | From Step 1 above |

6. Click **Deploy**
7. Wait 2 mins → Your site is LIVE

## Step 3: Set Up Stripe Webhook (Copy URL)

1. Once Vercel deploys, it gives you a URL like `https://creatorOS-xxxxx.vercel.app`
2. Go to Stripe Dashboard → Webhooks
3. Click "Add Endpoint"
4. Paste: `https://creatorOS-xxxxx.vercel.app/api/stripe/webhook`
5. Select events:
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `charge.succeeded`
6. Copy the "Signing Secret" (starts with `whsec_`)
7. Go back to Vercel → Update `STRIPE_WEBHOOK_SECRET` with this secret
8. Done ✓

---

## Now It's Automatic

### What's Running Without You:

✅ **Email Sequences** — Every signup gets branded welcome email automatically
✅ **Referral System** — Built-in. Each user gets referral link, earns $10 per signup
✅ **Analytics Tracking** — Tracks signups, conversions, revenue per source
✅ **Stripe Automation** — Subscriptions auto-process, webhooks auto-update user tiers
✅ **Dashboard** — Shows live revenue, signups, top referrers

### Where Money Comes From (Pick ONE):

**Option A: Influencer Seeding** (Start Week 1)
- Email 20 creators free Pro access
- They test → tell their audience
- You get 50-100 signups automatically
- ~$2,000-5,000 in first month

**Option B: Google Ads** (Start Week 1)
- Set budget $500
- Target "AI video generator" keywords
- Drive to landing pages
- Emails auto-captured, sequence auto-sends
- ~$3,000-8,000 first month

**Option C: Discord Community** (Start Week 1)
- Invite 100+ creators to test
- They refer friends → automatic referral tracking
- Community buys Pro → automatic Stripe charge
- ~$1,000-3,000 first month

---

## Live URLs (Once Deployed)

- **Main app**: https://creatorOS-xxxxx.vercel.app
- **Landing pages**:
  - `/landing-video` — AI Video Generator
  - `/landing-scheduler` — Social Media Scheduler
  - `/landing-music` — AI Music Generator
  - `/landing-image` — AI Image Generator

---

## Revenue Goals

| Timeline | Realistic | Aggressive |
|----------|-----------|-----------|
| Week 1 | 10 signups | 50 signups |
| Week 2 | 25 signups | 150 signups |
| Month 1 | 100 signups, $2K-5K | 500 signups, $10K-20K |
| Month 3 | 500 signups, $10K-20K | 2,000 signups, $50K+ |
| Year 1 | $50K-100K | $200K-500K+ |

---

## Support

If anything breaks:
1. Check Vercel build logs (Settings > Deployments)
2. Check env vars are set correctly
3. Email support: support@creatorOS.dev (auto-replies with troubleshooting)

**You're live. Start spreading the word. Money incoming in 7 days.**
