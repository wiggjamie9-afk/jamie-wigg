# Wave 1 Quick Start — 90 Minutes to First Checkout

Follow this checklist to deploy all three Wave 1 products from code-complete to running production.

---

## ✓ Phase 1: Infrastructure (30 min)

- [ ] **Supabase Project**
  - [ ] Create account at https://supabase.com
  - [ ] Create new project (note Project URL, Anon Key, Service Role Key)
  - [ ] Run SQL schema from `INFRASTRUCTURE-SETUP.md` → SQL Editor
  - [ ] Verify: `select count(*) from users;` returns 0

- [ ] **Stripe Account**
  - [ ] Create account at https://stripe.com
  - [ ] Switch to Test Mode (toggle top-right)
  - [ ] Create 3 products:
    - [ ] "Pro" — $9.99/mo (save price ID as `price_pro_monthly`)
    - [ ] "Studio" — $99/mo (save price ID as `price_studio_monthly`)
    - [ ] "Course" — $99/mo (save price ID as `price_course_monthly`)
  - [ ] Get API keys: Publishable (pk_test_...), Secret (sk_test_...)
  - [ ] Save webhook signing secret (create endpoint later)

- [ ] **Twilio Account** (for HerdCheck SMS)
  - [ ] Create account at https://twilio.com
  - [ ] Buy a phone number (trial credit covers ~100 SMS)
  - [ ] Save: Account SID, Auth Token, Phone Number

---

## ✓ Phase 2: Local Environment (20 min)

### Studio

```bash
cd studio
cp .env.example .env.local
# Edit .env.local with your credentials:
NEXT_PUBLIC_SUPABASE_URL=<your-project-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_test_... (we'll add this later)

pnpm install
pnpm dev
# Open http://localhost:3000 → should load landing page
```

### Course Platform

```bash
cd course-platform
cp .env.example .env.local
# Same Supabase + Stripe keys as Studio

pnpm install
pnpm dev
# Open http://localhost:3001 → should load course listing page (empty)
```

### HerdCheck

```bash
cd livestock
# .env.local not needed yet (local testing uses mock API)

python3 -m http.server 8000 --bind 127.0.0.1 --directory .
# Open http://localhost:8000 → should load PWA
```

---

## ✓ Phase 3: Local Testing (25 min)

### Test Studio Auth + Stripe

```bash
# In browser: http://localhost:3000

1. Sign up: testuser@example.com / password123
2. Verify Supabase: SELECT * FROM users WHERE email='testuser@example.com'
   → subscription_tier should be 'free'

3. Click "Upgrade to Pro"
4. Stripe Checkout appears
5. Use test card: 4242 4242 4242 4242 / 12/34 / any CVC
6. Complete payment

7. Verify Supabase subscriptions table:
   → New row with user_id, tier='pro', status='active'

8. Refresh dashboard: tier changed to "Pro" ✓
```

### Test Agent Builder

```bash
# In browser: http://localhost:3001

1. Sign up: creator@example.com / password123
2. Navigate to /creator/dashboard
3. Should show "0 courses, 0 students, $0 revenue"
4. Verify Supabase users table: new creator entry ✓
```

### Test HerdCheck SMS (Mock)

```bash
# In browser: http://localhost:8000

1. Add animal: "Cow-001", species "Cattle"
2. Run lameness check (skip video, just tap continue)
3. Score: Sprecher 4 (red tier)
4. Enter vet phone: +1-555-0100
5. Click "Send alert to vet"
6. Open DevTools → Console → should see mock API response ✓
7. Open DevTools → Application → IndexedDB → livestock → sent_actions
   → Should have 1 record with status='queued' ✓
```

---

## ✓ Phase 4: Deploy Webhooks (15 min)

⚠️ **Critical**: Next.js 15 uses static export, so webhooks CANNOT run as API routes.
They must deploy as Cloudflare Workers.

### Create Stripe Webhook Worker

```bash
cd studio/workers/stripe-webhook
wrangler deploy

# Set secrets
wrangler secret put STRIPE_SECRET_KEY
# Paste: sk_test_...

wrangler secret put STRIPE_WEBHOOK_SECRET
# Paste: whsec_test_... (from Stripe, or generate new)

wrangler secret put SUPABASE_URL
wrangler secret put SUPABASE_SERVICE_KEY
```

### Register Webhook in Stripe Dashboard

- Developers → Webhooks → Add endpoint
- URL: `https://studio-webhook.your-domain.workers.dev/`
- Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
- Copy signing secret → Paste into `wrangler secret put STRIPE_WEBHOOK_SECRET`

---

## ✓ Phase 5: Production Deploy (30 min)

### Studio → Cloudflare Pages

```bash
cd studio
pnpm build

# Option A: Manual deploy
wrangler pages deploy out/

# Option B: Connect GitHub repo for auto-deploy
# → Cloudflare Pages dashboard → Connect Git → select repo → main branch
```

### Course Platform → Cloudflare Pages or Vercel

```bash
cd course-platform
pnpm build

# Vercel
vercel --prod

# Or Cloudflare Pages
wrangler pages deploy .next/
```

### HerdCheck → Already static, served at `/livestock/`

No deployment needed (or push to GitHub Pages as part of main repo deploy).

---

## ✓ Verification Checklist

After all deploys:

- [ ] **Studio**
  - [ ] Landing page loads at production URL
  - [ ] Sign up works
  - [ ] Stripe checkout works (test card 4242 4242 4242 4242)
  - [ ] Dashboard tier updates after payment
  - [ ] Webhook fired (check Stripe logs)

- [ ] **Course Platform**
  - [ ] Landing page loads
  - [ ] Sign up works
  - [ ] Creator dashboard loads

- [ ] **HerdCheck**
  - [ ] Landing page loads
  - [ ] Can add animals
  - [ ] Can run screening checks
  - [ ] SMS queue works (mock API in local, real Twilio in production)

---

## ⚠️ Critical Gotchas

1. **Static Export Limitation**
   - Studio uses `output: "export"` for Cloudflare Pages
   - API routes DON'T work in static export
   - Webhooks MUST be Cloudflare Workers

2. **Environment Variables**
   - `.env.local` NEVER committed (add to `.gitignore`)
   - Use `.env.example` as template
   - Cloudflare Workers use `wrangler secret put`

3. **Stripe Test Mode**
   - Use test API keys (pk_test_..., sk_test_...)
   - Test card: 4242 4242 4242 4242
   - Webhooks require test signing secret (whsec_test_...)

4. **Supabase RLS**
   - RLS policies must allow service_role for webhook writes
   - If webhook fails silently, check Supabase logs

---

## Support Matrix

| Issue | Command | Result |
|---|---|---|
| Stripe webhook not firing | `stripe logs` | Check for errors |
| Supabase not syncing | `select * from subscriptions;` | Verify schema exists |
| Studio won't load | `pnpm build` | Check build errors |
| SMS not sending | Check Twilio logs | Verify credentials |

---

## Next: After Wave 1 is Live

1. **Monitor for 48 hours**
   - Check Stripe logs for webhook failures
   - Monitor Supabase query performance
   - Test a few real checkouts with test cards

2. **Week 2: Wave 2 Kickoff**
   - Buddy Builder (creator marketplace)
   - Recovery iOS app
   - RHYTHMIX platform backend

3. **Week 3-4: Feature Completion**
   - Video generation pipeline (Studio)
   - Course video uploads (Agent Builder)
   - SMS delivery + re-check automation (HerdCheck)

---

**Estimated total time: 90 minutes**

Report any blockers in the repo issues or comment here.

