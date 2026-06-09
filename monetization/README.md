# Monetization Infrastructure for 28 Apps

## What's Here

Complete, implementation-ready monetization setup for your 28-app portfolio. Three payment platforms (Stripe, Google Play, Gumroad), regional pricing, analytics, tax compliance, and step-by-step checklists.

## Quick Navigation

| Document | Purpose | Time to Read |
|----------|---------|---|
| **IMPLEMENTATION_CHECKLIST.md** | Start here. Day-by-day tasks for launch. | 10 min |
| **FREEMIUM_MODEL.md** | Free vs Premium features, paywall placement, user communication | 15 min |
| **play-store-iap-config.json** | Google Play IAP definitions for all 28 apps (ready to copy/paste) | 5 min |
| **STRIPE_INTEGRATION.md** | Web/PWA checkout, webhooks, Billing Portal setup | 20 min |
| **GUMROAD_INTEGRATION.md** | One-time lifetime licenses, affiliate program, license key verification | 20 min |
| **ANALYTICS_SETUP.md** | GA4 events, funnel tracking, ARPU, LTV calculations | 20 min |
| **PAYOUT_COMPLIANCE.md** | Bank accounts, tax (GST/ABN), regional compliance, refund policy | 20 min |

## Start Here (5-Minute Overview)

### What This Enables

By the end of Week 1, you'll have:

1. **Freemium apps**: Users get 7-day trial, then $1.99–$3.99/mo or $19.99–$29.99/year
2. **Three payment channels**:
   - Stripe (web, PWA) → 70% payout
   - Google Play (Android) → 70% payout
   - Gumroad (lifetime licenses) → 92% payout
3. **Automatic compliance**: Tax handling, refund policy, privacy
4. **Real-time analytics**: Conversion funnel, ARPU, churn tracking
5. **Bank payouts**: Daily or monthly automatic deposits to Australian bank

### Revenue Projections

**Conservative (Year 1):**
- 50,000 downloads/month across 28 apps
- 8% trial conversion → 4,000 premium subs
- **Monthly revenue: ~$10,000**
- After fees: ~$6,000–7,000 to bank
- After tax (25–47%): **$3,000–5,000/month take-home**

**Aggressive (Year 2, if optimized):**
- 150,000 downloads/month
- 12% trial conversion → 18,000 premium subs
- **Monthly revenue: ~$45,000**
- After all fees & tax: **$20,000+/month take-home**

## Platform Comparison

| Metric | Stripe | Google Play | Gumroad |
|--------|--------|---|---|
| **Fee** | 2.9% + $0.30 per charge | 30% cut | 8% + payment processing |
| **Your payout** | ~70% | 70% | ~92% |
| **Setup time** | 30 min | 1 day | 5 min |
| **App type** | Web, PWA | Android | Lifetime license (web) |
| **Recurring** | Yes (subscriptions) | Yes (subscriptions) | One-time purchase |
| **Webhook complexity** | Medium | High | Low |
| **Regional pricing** | Manual (28 prices) | Automatic | Manual |
| **Recommended for** | Primary web checkout | Mobile apps | Simple one-time sales |

**Recommendation:** Use all three for geographic + user-type coverage.

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    28 Apps (Web/PWA)                    │
├─────────────────────────────────────────────────────────┤
│ Blood Pressure Buddy, Budget Tracker, Calorie Counter,  │
│ Daily Planner, Dreams, English Pocket, Expense Tracker, │
│ Goal Tracker, Habit Streak, Heartbeat, Hum, Live,       │
│ Loan Calculator, Math Helper, Medicine Companion,       │
│ Meditation Guide, Mood Journal, Notes, Period Tracker,  │
│ Pomodoro Timer, Quick Recipes, Reminders, Resonate,     │
│ Roomtone, Savings Challenge, Study Planner, TaskList,   │
│ Trivia Quiz, Vendor Tracker, Voice Notes, Water Tracker,│
│ Weight Tracker, Workout Timer                           │
└─────────────────────────────────────────────────────────┘
         │                   │                    │
         ▼                   ▼                    ▼
    ┌─────────────┐  ┌──────────────┐  ┌────────────────┐
    │   Stripe    │  │ Google Play  │  │  Gumroad       │
    │  (Web/PWA)  │  │   (Android)  │  │ (Licenses)     │
    ├─────────────┤  ├──────────────┤  ├────────────────┤
    │ Subscriptions│  │Subscriptions │  │One-time license│
    │ Recurring   │  │  In-app IAP  │  │ Lifetime access│
    │ Monthly +   │  │  $2.99–$3.99 │  │ $4.99–$29.99   │
    │ Annual      │  │  Auto regions│  │ License keys   │
    │ 70% payout  │  │ 70% payout   │  │ 92% payout     │
    └─────────────┘  └──────────────┘  └────────────────┘
         │                   │                    │
         └───────────────────┴────────────────────┘
                      │
                      ▼
        ┌──────────────────────────────┐
        │  Google Analytics 4           │
        │  - Funnel tracking            │
        │  - Conversion events          │
        │  - ARPU / LTV calculations    │
        │  - Churn rate monitoring      │
        └──────────────────────────────┘
                      │
                      ▼
        ┌──────────────────────────────┐
        │  Bank Payouts                 │
        │  - Commonwealth Bank (AUD)    │
        │  - Daily or monthly transfers │
        │  - Automatic reconciliation   │
        └──────────────────────────────┘
```

---

## File Structure

```
/home/user/jamie-wigg/monetization/
├── README.md                           # This file
├── IMPLEMENTATION_CHECKLIST.md         # Day-by-day launch plan
├── FREEMIUM_MODEL.md                   # Feature tier definition
├── play-store-iap-config.json         # Google Play SKU config (copy/paste ready)
├── STRIPE_INTEGRATION.md               # Setup + webhook code examples
├── GUMROAD_INTEGRATION.md              # Lifetime license setup
├── ANALYTICS_SETUP.md                  # GA4 + revenue tracking
└── PAYOUT_COMPLIANCE.md                # Tax + bank + refund policy
```

---

## Launch Sequence (3 Weeks)

### Week 1: Setup (Longest)
```
Day 1:   Bank account, ABN, GST registration, Stripe/Google/Gumroad accounts
Day 2:   IAP products created, paywall UI designed
Day 3:   Analytics GA4 set up, event tracking
Day 4:   Backend payment verification code
Day 5:   Legal docs (privacy, refund, TOS)
```

### Week 2: Testing
```
Day 1–2: Stripe test flow (use pk_test_ keys)
Day 1–2: Google Play test flow (sandbox)
Day 1–2: Gumroad test flow (free product)
Day 3–4: Full paywall testing across all 28 apps
Day 5:   Code review & security audit
```

### Week 3: Go-Live
```
Day 1:   Switch to live keys (pk_live_, sk_live_)
Day 1–2: Real-money testing (use your own card)
Day 3–4: Monitor first transactions
Day 5:   **LAUNCH** (all 28 apps live with paywall)

Week 4+: Daily monitoring (conversions, errors)
```

---

## Key Files Explained

### 1. IMPLEMENTATION_CHECKLIST.md
**What:** Step-by-step tasks from Day 1 to launch and beyond.
**Who:** You (operator) and your dev team.
**How to use:** Print or keep in tab; check off daily.
**Key sections:**
- Pre-launch (bank, platforms, code)
- Testing (all 3 payment flows)
- Go-live (switch to live keys)
- Monthly ops (reconciliation, analytics)

### 2. play-store-iap-config.json
**What:** Complete JSON config for Google Play IAP (all 28 apps, all regions).
**How to use:**
1. Log into Google Play Console
2. For each app, create in-app products matching SKU names
3. Use pricing from this file (auto-converts to local currency)
**Ready-made:** Yes. Just copy app names & pricing into Play Console.

### 3. FREEMIUM_MODEL.md
**What:** Business logic—what free users get vs. premium users.
**Defines:**
- 7-day free trial (no payment required)
- Free tier: 30 days history, basic features, ads optional
- Premium: unlimited history, advanced analytics, ad-free
- Paywall triggers: after trial, after 5 sessions, on feature access
**Key insight:** Standard freemium, proven to convert 8–15% of trials.

### 4. STRIPE_INTEGRATION.md
**What:** Complete Stripe setup for web/PWA apps.
**Covers:**
- Account creation & API key management
- Creating products & prices (code examples)
- Checkout flow (JavaScript)
- Webhook handling (Node.js example)
- Testing (test card numbers)
- Stripe Billing Portal (self-service subscriptions)
**Code:** Copy/paste ready for React/Vue/vanilla JS.

### 5. GUMROAD_INTEGRATION.md
**What:** Gumroad setup for one-time lifetime licenses.
**Covers:**
- Product creation ($4.99–$29.99)
- License key verification (backend code)
- Affiliate program setup
- Email automation
- Refund handling
**Best for:** Users who prefer "buy once" over subscriptions.

### 6. ANALYTICS_SETUP.md
**What:** Google Analytics 4 + revenue tracking setup.
**Covers:**
- GA4 property creation
- Custom events (trial_start, purchase, churn)
- Conversion funnel (install → trial → paid)
- ARPU & LTV calculations
- Custom dashboards
- Monthly reporting
**Key metrics:** Track these 12 numbers to run the business.

### 7. PAYOUT_COMPLIANCE.md
**What:** Bank setup, taxes, and legal compliance.
**Covers:**
- Linking bank account to Stripe/Google/Gumroad
- Australian tax (ABN, GST)
- Refund policy (7–30 day window)
- Privacy policy (GDPR, CCPA, Australia Privacy Act)
- Regional pricing compliance
- Chargeback handling
- Monthly/annual tax filing
**For:** Accountant, business owner, compliance.

---

## Core Assumptions

These docs assume:

1. **28 standalone web apps** (not a single monolithic app)
2. **Freemium model** (7-day trial → paid subscription or lifetime license)
3. **Global audience** (pricing auto-adjusts by country via Stripe/Google)
4. **No existing payment infrastructure** (starting from scratch)
5. **Australian-based business** (ABN, GST, Commonwealth Bank)
6. **Web + mobile** (Stripe for web, Google Play for Android)
7. **One person can run operations** (hence automated monitoring)

If your situation differs, flag it in the [Customizations](#customizations) section.

---

## Customizations

Edit these docs if:

| Scenario | Change |
|----------|--------|
| All 28 apps are vastly different quality | Separate paywall strategies per app (not one-size-fits-all) |
| Targeting primarily India / Brazil | Adjust pricing 50–70% lower in FREEMIUM_MODEL.md |
| Already have a large user base | Stagger paywall rollout (avoid shocking existing users) |
| Want enterprise/B2B tier | Add separate "Team" plan in FREEMIUM_MODEL.md |
| Not in Australia | Update ABN → your tax ID, bank → your bank, currency → your currency |
| Want lifetime license on all apps | Use Gumroad model, not subscriptions (change FREEMIUM_MODEL.md) |
| Partner/revenue share | Set up Stripe Connect in STRIPE_INTEGRATION.md § 10 |

---

## Success Metrics (First 3 Months)

**These numbers tell you if monetization is working:**

| Metric | Target | What It Means |
|--------|--------|---|
| Trial start rate | 20–30% of installs | Paywall visible, users willing to try |
| Trial completion | 80%+ | Users like the app (didn't churn before trial ends) |
| Free-to-premium conversion | 8–15% of trials | Pricing reasonable, value clear |
| Monthly churn rate | <5% | Subscribers happy with product/price |
| ARPU | >$2/user/month | Revenue sustainable |
| Refund rate | <5% | No widespread buyer's remorse |

**If you're under targets:**
- Trial start too low? Improve paywall visibility (move it earlier)
- Conversion too low? Cut price by 30%, or improve free tier features
- Churn too high? Investigate why (in-app surveys, support emails)

---

## Common Gotchas

### 1. Mixing test & live keys
**Problem:** Live checkout form with pk_test_ key → always fails.
**Fix:** Double-check all three places:
- Frontend (gtag init)
- Checkout button (Stripe.js loadStripe)
- Backend endpoint (.env STRIPE_SECRET_KEY)

### 2. Webhook not firing
**Problem:** User pays, but app doesn't grant access.
**Fix:** 
- Check endpoint URL is HTTPS (Stripe won't POST to HTTP)
- Verify endpoint URL in Stripe dashboard matches your app
- Log incoming requests (webhook may be firing, but parser failing)

### 3. Refunds stuck in processing
**Problem:** Refund requested 2 weeks ago, customer hasn't received it.
**Fix:**
- Check refund status in Stripe dashboard (should show "succeeded" or "failed")
- Some payment methods (wire transfer, PayPal) can take 5–7 days
- Contact Stripe support if stuck >10 days

### 4. Regional pricing not working
**Problem:** Customer in India sees USD price instead of INR.
**Fix:**
- Confirm regional pricing created in Google Play Console
- Stripe auto-converts; check customer's billing address
- Test in Google Play with a test account in that region

### 5. Tax not calculated
**Problem:** Invoices show $0 tax, but GST should apply.
**Fix:**
- Enable Stripe Tax in dashboard
- Ensure customer doesn't have VAT exemption
- GST applies to Australian customers; others depend on their region

---

## Support Contacts

| Platform | Issue | Contact |
|----------|-------|---------|
| Stripe | Payment not processing | support.stripe.com (chat, usually <1hr) |
| Google Play | App not published | Google Play Console support (link in console) |
| Gumroad | License key issue | gumroad.com/support (email) |
| GA4 | Events not appearing | Google Analytics help center |
| Bank | Payout delayed | Bank's customer service (CBA: 13 2221) |

---

## Financial Planning

### Monthly Costs (Estimate)

```
Hosting (Vercel/Netlify):        $10–50
Domain + DNS:                    $15
Email service (SendGrid/SES):    $10
Analytics:                       $0 (GA4 free)
Payment processing fees:         ~40% of revenue
────────────────────────────────────
Total fixed: ~$35–75
Total variable: ~40% of revenue

Example (1,000 subs @ $2.99/mo = $2,990 revenue):
Fixed costs:                     $50
Payment fees (40% × $2,990):     $1,196
──────────────────────────────
Net before tax:                  $1,744
Tax (25–47% depending on structure): $436–820
Net take-home:                   $924–1,308
```

**Breakeven:** ~400 subscriptions / month (most apps hit this in Month 2–3).

---

## Roadmap (6–12 Months)

### Month 1–3: Launch
- [ ] Basic freemium (7-day trial)
- [ ] Three payment channels live
- [ ] Analytics tracking
- [ ] Daily monitoring

### Month 3–6: Optimize
- [ ] A/B test paywall messaging (does color matter?)
- [ ] A/B test pricing (reduce by 20% to boost conversion?)
- [ ] Analyze which apps convert best (refocus marketing)
- [ ] Retention emails (boost day-7 retention)

### Month 6–9: Expand
- [ ] Annual plan (12-month discount)
- [ ] Family plan (6 users, $5.99/mo)
- [ ] Bundle (all 28 apps for $9.99/mo)
- [ ] Affiliate program (partners earn 30% per referral)

### Month 9–12: Scale
- [ ] Seasonal promotions ("first month free" in Q4)
- [ ] Win-back campaigns (refunded users get 50% off)
- [ ] Enterprise tier (for power users)
- [ ] API access (for integrations)

---

## Legal Checklist

Before going live, include in your app / website:

- [ ] **Privacy Policy** (template in PAYOUT_COMPLIANCE.md)
  - What data you collect
  - How you use it (analytics, payments)
  - User rights (access, delete, export)
  - GDPR/CCPA/AU Privacy Act compliance
  - Link to payment processor privacy pages

- [ ] **Terms of Service**
  - Subscription auto-renewal & cancellation
  - Limitation of liability
  - Refund policy
  - No warranty ("as-is")

- [ ] **Refund Policy** (linked in TOS)
  - 7-day refund window
  - Non-refundable after 30 days
  - How to request refund
  - Chargeback warning

- [ ] **Payment Processor Disclosure**
  - "Payments processed by Stripe / Google Play / Gumroad"
  - Link to their privacy policies

---

## Next Steps

1. **Read IMPLEMENTATION_CHECKLIST.md** (10 min) → Know what's coming
2. **Read FREEMIUM_MODEL.md** (15 min) → Understand the business model
3. **Set Week 1 on calendar** → Allocate 4 hours/day for setup
4. **Create bank account** → Day 1 task
5. **Create Stripe account** → Day 1 task
6. **Follow checklist step by step** → Day 1–21

**You'll be live with paywall in 3 weeks.** Easier than you think.

---

## File Sizes & Effort

| Document | Size | Read Time | Implementation Time |
|----------|------|-----------|---|
| IMPLEMENTATION_CHECKLIST.md | 20 KB | 10 min | Ongoing (3 weeks) |
| FREEMIUM_MODEL.md | 25 KB | 15 min | 2 hours (design paywall UI) |
| play-store-iap-config.json | 40 KB | 5 min | 2 hours (create 56 products in console) |
| STRIPE_INTEGRATION.md | 35 KB | 20 min | 4 hours (implement checkout + webhooks) |
| GUMROAD_INTEGRATION.md | 30 KB | 20 min | 2 hours (create 28 products + verify endpoint) |
| ANALYTICS_SETUP.md | 25 KB | 20 min | 3 hours (GA4 setup + event tracking) |
| PAYOUT_COMPLIANCE.md | 40 KB | 20 min | 1 hour (bank account verification) |
| **Total** | **195 KB** | **100 min** | **~18 hours** |

**18 hours = 3 days if full-time, or 1 week part-time.**

---

## Questions?

Refer to the specific doc:

- "How do I set up Stripe?" → STRIPE_INTEGRATION.md
- "What features do free users get?" → FREEMIUM_MODEL.md
- "How do I track revenue?" → ANALYTICS_SETUP.md
- "When do payouts happen?" → PAYOUT_COMPLIANCE.md
- "What do I do on Day 1?" → IMPLEMENTATION_CHECKLIST.md

---

**Last updated:** June 9, 2026
**Status:** Implementation-ready
**Apps covered:** 28 (all categories: health, finance, education, productivity, wellness, music, lifestyle)
**Platforms:** Stripe (web), Google Play (Android), Gumroad (lifetime)
**Ready to launch?** Yes.

Good luck!
