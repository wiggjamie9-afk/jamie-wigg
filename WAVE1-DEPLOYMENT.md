# Wave 1 Deployment & Testing Guide

**Status**: All three Wave 1 products are code-complete on `claude/cybersecurity-skills-agents-70sxup` branch. This guide covers local testing, infrastructure setup, and production deployment.

---

## Products in Wave 1

1. **STARLIGHTMIX Studio** — AI music video generator (consumer, marketplace)
2. **Agent Builder (course-platform)** — Creator course marketplace (consumer, B2B)
3. **HerdCheck** — Livestock screening agent + SMS alerts (B2B, rural/institutional)

---

## Infrastructure Prerequisites

Before deploying, you'll need:

### 1. Supabase Project
- Create account at https://supabase.com
- Create new project (region: us-east-1 or eu-west-1)
- Save: **Project URL**, **Anon Key**, **Service Role Key**
- Deploy schema (see "Database Schema Deployment" below)

### 2. Stripe Account
- Create account at https://stripe.com
- Switch to **Test Mode**
- Create three products + prices:
  - **Pro**: $9.99/month (price_pro_monthly)
  - **Studio**: $99/month (price_studio_monthly)
  - **Course**: $99/month (price_course_monthly)
- Generate API keys: **Publishable Key** (pk_test_...), **Secret Key** (sk_test_...)
- Create webhook endpoint at production domain (or use Stripe CLI locally)

### 3. Twilio Account (for HerdCheck SMS)
- Create account at https://twilio.com
- Buy a phone number
- Save: **Account SID**, **Auth Token**, **Phone Number**

### 4. Cloudflare Account
- Create account at https://workers.dev (or use existing)
- Create KV namespace for rate limiting / SMS queue
- Deploy Workers for webhooks (see "Worker Deployment" below)

---

## Environment Setup

### 1. Local `.env.local`

Create `studio/.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...

# Stripe (test mode)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_test_...

# SMS (Twilio)
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1...
```

### 2. Course Platform `.env.local`

Create `course-platform/.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...

# Stripe (test mode)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_test_course_...
```

### 3. HerdCheck `.env.local`

Create `livestock/.env.local`:

```bash
# Twilio (for SMS)
VITE_TWILIO_ACCOUNT_SID=AC...
VITE_TWILIO_AUTH_TOKEN=...
VITE_TWILIO_PHONE_NUMBER=+1...

# SMS endpoint (local or Cloudflare Worker)
VITE_SMS_ENDPOINT=http://localhost:3001/api/sms/send
# Or production: https://sms-worker.your-domain.workers.dev/send
```

⚠️ **Never commit `.env.local` to git** — add to `.gitignore`.

---

## Database Schema Deployment

### Option A: Supabase Dashboard (Easy)

1. Go to **SQL Editor** in Supabase dashboard
2. Create new query
3. Copy schema from `INFRASTRUCTURE-SETUP.md` (Tables section)
4. Run each CREATE TABLE statement
5. Run RLS policy statements

### Option B: Supabase CLI (Recommended)

```bash
# Install CLI
npm install -g supabase

# Link to project
supabase link --project-id your-project-id

# Create migrations
supabase migration new create_wave1_schema

# Edit migration file, paste schema from INFRASTRUCTURE-SETUP.md
# Then push to remote
supabase db push
```

### Schema Tables

Required for all three products:

```
users
├── id (UUID, primary key)
├── email (text, unique)
├── subscription_tier (text: 'free', 'pro', 'studio')
├── credits_remaining (integer)
├── created_at (timestamp)

subscriptions
├── id (UUID)
├── user_id (UUID)
├── stripe_subscription_id (text)
├── stripe_customer_id (text)
├── tier (text)
├── status (text)
├── active (boolean)

courses (Agent Builder)
├── id (UUID)
├── creator_id (UUID)
├── title (text)
├── description (text)
├── price_cents (integer)
├── video_count (integer)
├── enrolled_count (integer)

enrollments
├── id (UUID)
├── user_id (UUID)
├── course_id (UUID)
├── enrolled_at (timestamp)

screening_results (HerdCheck)
├── id (UUID)
├── user_id (UUID)
├── animal_id (text)
├── check_type (text: 'lameness', 'mastitis', 'calving')
├── risk_tier (text: 'green', 'amber', 'red')
├── results (jsonb)
├── created_at (timestamp)

sent_actions (HerdCheck SMS audit)
├── id (UUID)
├── user_id (UUID)
├── animal_id (text)
├── action_type (text: 'sms', 'export', 'escalate')
├── recipient (text)
├── message (text)
├── status (text: 'queued', 'sent', 'failed')
├── created_at (timestamp)
```

---

## Local Testing

### Test 1: Studio Auth Flow

```bash
cd studio
pnpm install
pnpm dev
# Open http://localhost:3000

# 1. Sign up: email@example.com / password123
# 2. Verify: check Supabase users table (users.subscription_tier = 'free')
# 3. Sign in: use same credentials
# 4. Verify: redirected to /dashboard
# 5. Check tier display: shows "free"
```

### Test 2: Studio Stripe Checkout (Test Mode)

```bash
# Terminal 1: Dev server still running

# Terminal 2: Start Stripe CLI listener
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Terminal 3: Open Studio, click "Upgrade to Pro"
# 1. Opens Stripe Checkout
# 2. Use test card: 4242 4242 4242 4242 / 12/34 / any CVC
# 3. Complete payment
# 4. Verify webhook received: `stripe listen` output should show event
# 5. Check Supabase:
#    - subscriptions table has new row
#    - users.subscription_tier = 'pro'
# 6. Refresh dashboard: tier changed to "Pro", pricing hidden, "Create Video" shown
```

### Test 3: Agent Builder Course Listing

```bash
cd course-platform
pnpm install
pnpm dev
# Open http://localhost:3000

# 1. Sign up: creator@example.com / password123
# 2. Go to /creator/dashboard
# 3. Should show "0 courses, 0 students, $0 revenue"
# 4. (Create button would appear in Phase 2)
```

### Test 4: HerdCheck SMS (Mock API)

```bash
cd livestock
python3 -m http.server 8000 --bind 127.0.0.1 --directory .

# Open http://localhost:8000

# 1. Add animal: "Cow-001", species "Cattle"
# 2. Run lameness check: record 10-second walking video (or skip for testing)
# 3. Assign Sprecher score: 4 (high lameness)
# 4. Result: "Red tier - contact vet immediately"
# 5. Enter vet phone: +1-555-0123
# 6. Click "Send alert to vet"
# 7. Check browser console: should see mock API response
# 8. Verify IndexedDB: open DevTools → Application → IndexedDB → livestock → sent_actions
#    - Should have new record with status "queued" (ready for real SMS once online)
```

---

## Webhook Deployment (Cloudflare Workers)

Studio and course-platform both need webhook endpoints to sync Stripe events to Supabase.

### Deploy Studio Webhook

1. **Create Cloudflare Worker**

```bash
cd studio/workers/stripe-webhook
wrangler deploy
```

2. **Worker code** (`studio/workers/stripe-webhook/src/index.ts`):

```typescript
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' });
const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);

export default {
  async fetch(request, env) {
    const signature = request.headers.get('stripe-signature') || '';
    const body = await request.text();

    try {
      const event = stripe.webhooks.constructEvent(
        body,
        signature,
        env.STRIPE_WEBHOOK_SECRET
      );

      if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const userId = session.client_reference_id;

        // Fetch subscription
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription
        );

        // Map price to tier
        const priceId = subscription.items.data[0].price.id;
        const tier = priceId.includes('pro') ? 'pro' : 'studio';

        // Sync to Supabase
        await supabase.from('subscriptions').upsert({
          user_id: userId,
          stripe_subscription_id: subscription.id,
          stripe_customer_id: subscription.customer,
          tier,
          status: subscription.status,
          active: true,
          created_at: new Date().toISOString(),
        });

        await supabase
          .from('users')
          .update({ subscription_tier: tier })
          .eq('id', userId);
      }

      return new Response(JSON.stringify({ received: true }), { status: 200 });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }
  },
};
```

3. **Set Worker secrets**

```bash
wrangler secret put STRIPE_SECRET_KEY
# Paste sk_test_...

wrangler secret put STRIPE_WEBHOOK_SECRET
# Paste whsec_test_...

wrangler secret put SUPABASE_URL
# Paste https://your-project.supabase.co

wrangler secret put SUPABASE_SERVICE_KEY
# Paste service_role key from Supabase
```

4. **Update Stripe webhook endpoint**

In Stripe dashboard:
- Developers → Webhooks → Add endpoint
- URL: `https://studio-webhook.your-domain.workers.dev/webhooks/stripe`
- Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
- Copy webhook signing secret → `STRIPE_WEBHOOK_SECRET`

---

## Production Deployment

### Studio (Cloudflare Pages)

```bash
# Build
cd studio
pnpm build

# Deploy
wrangler pages deploy out/

# Or connect GitHub repo for auto-deploy on push to main
```

### Course Platform (Cloudflare Pages or Vercel)

```bash
# Build
cd course-platform
pnpm build

# Deploy to Vercel
vercel --prod

# Or Cloudflare Pages
wrangler pages deploy .next/
```

### HerdCheck (GitHub Pages or static host)

```bash
# Already static (no build needed)
# Serve from https://rhythmixapp.com.au/livestock/
```

---

## Stripe Webhook Testing (Local)

Without deploying Worker, test locally:

```bash
# Terminal 1: Studio dev server
cd studio && pnpm dev

# Terminal 2: Stripe CLI listener
stripe login
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Note: localhost won't work for production; use Stripe CLI to test locally only.
# For production, you MUST deploy webhook as Cloudflare Worker.
```

---

## Monitoring & Debugging

### Logs

- **Stripe**: Developers → Logs
- **Supabase**: Database → Logs
- **Cloudflare Workers**: Dashboard → Tail real-time logs

### Common Issues

| Issue | Cause | Fix |
|---|---|---|
| "STRIPE_WEBHOOK_SECRET not configured" | `.env.local` missing | Add `STRIPE_WEBHOOK_SECRET=whsec_...` |
| "Supabase connection failed" | Invalid URL or key | Verify URL and Anon Key in `.env.local` |
| "SMS sending failed (HerdCheck)" | Twilio not configured | Add Twilio credentials to `.env.local` |
| "Webhook doesn't fire" | Not deployed as Worker | Deploy using Cloudflare Workers |

---

## Next Steps

### Week 2 (After Wave 1 Deploy)

- [ ] Test full Studio checkout flow in production
- [ ] Test Agent Builder course enrollment and revenue sync
- [ ] Test HerdCheck SMS delivery with real Twilio number
- [ ] Set up Stripe test mode webhooks
- [ ] Document rollback procedures

### Week 3 (Wave 2 Kickoff)

- [ ] Start Buddy Builder (marketplace UI, creator registration)
- [ ] Start Recovery iOS app (Capacitor build + App Store setup)
- [ ] Start RHYTHMIX platform (video generation pipeline + Replicate integration)

---

## Support

For issues:
1. Check `.env.local` (all required keys present?)
2. Verify Supabase schema deployed
3. Test locally with Stripe CLI first
4. Check browser console (Frontend errors?)
5. Check Worker logs (Backend errors?)

