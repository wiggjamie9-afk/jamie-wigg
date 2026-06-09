# Monetization Implementation Checklist

## Quick Start (Week 1)

### Pre-Launch Tasks

#### Bank & Tax Setup (Day 1)
- [ ] Open business bank account (CBA recommended)
  - [ ] Collect: account number, BSB
  - [ ] Verify with 2 small deposits
- [ ] Confirm ABN (request from ABR if needed)
- [ ] Register GST (if turnover > $75k annually)
- [ ] Create Privacy Policy (legal template)
- [ ] Create Refund Policy (legal template)
- [ ] Create Terms of Service (include monetization terms)

#### Platform Setup (Day 1–2)

**Stripe:**
- [ ] Create Stripe account (stripe.com)
- [ ] Verify account (2–5 business days)
- [ ] Generate API keys (pk_live_, sk_live_)
- [ ] Link bank account
- [ ] Verify bank account (small deposits)
- [ ] Create 28 products (1 per app)
- [ ] Create 56 prices (monthly + annual per app)
- [ ] Set regional pricing (developed/emerging/least-developed)
- [ ] Enable Stripe Tax
- [ ] Enable multi-currency (AUD preferred)
- [ ] Configure webhook endpoint
- [ ] Test with pk_test_ keys

**Google Play Console:**
- [ ] Register Google Play account
- [ ] Set up merchant account
- [ ] Link bank account
- [ ] Verify business information
- [ ] Create in-app product definitions (SKUs)
  - [ ] app.premium.monthly (28 apps)
  - [ ] app.premium.annual (28 apps)
- [ ] Set pricing in console (auto-converts regions)
- [ ] Configure billing & refund policy

**Gumroad:**
- [ ] Create Gumroad account
- [ ] Verify account & add payout method
- [ ] Connect Stripe to Gumroad (or PayPal)
- [ ] Create 28 products (lifetime licenses)
- [ ] Set prices ($4.99–$29.99 per category)
- [ ] Enable license keys
- [ ] Test first purchase (refund immediately)

#### Analytics Setup (Day 2–3)
- [ ] Create Google Analytics 4 property
- [ ] Get Measurement ID (G-XXXXXXXXXX)
- [ ] Add gtag.js to all 28 apps
- [ ] Define custom events (trial_start, purchase, churn, etc.)
- [ ] Create GA4 conversion funnels
- [ ] Create dashboard (revenue, ARPU, retention)
- [ ] Set up GA4 alerts (purchase drops, errors)
- [ ] Export first baseline report

#### Code Implementation (Day 3–4)

**Frontend (all 28 apps):**
- [ ] Add paywall UI component
  - [ ] Trial badge in header
  - [ ] Premium feature lockout
  - [ ] Upgrade CTA buttons
- [ ] Implement trial countdown logic (localStorage)
- [ ] Add Stripe Checkout button (web apps)
- [ ] Add Gumroad embed (license entry)
- [ ] Add analytics event tracking (GA4)
- [ ] Add "Manage Subscription" link (Stripe Billing Portal)

**Backend (if server-side):**
- [ ] Create /api/create-checkout-session endpoint
- [ ] Create /api/verify-license endpoint
- [ ] Create /webhooks/stripe endpoint
- [ ] Create /api/verify-subscription endpoint
- [ ] Implement subscription status storage
- [ ] Implement license key verification
- [ ] Implement premium access control

---

## Week 1–2: Testing & Refinement

### Functional Testing

#### Stripe (Web) Testing
- [ ] Test checkout flow end-to-end with pk_test_ keys
- [ ] Test successful purchase (card: 4242 4242 4242 4242)
- [ ] Test failed payment (card: 4000 0000 0000 0002)
- [ ] Test 3D Secure payment (card: 4000 0025 0000 3155)
- [ ] Verify webhook fires on purchase
- [ ] Test refund flow (request + process)
- [ ] Test Billing Portal access & subscription management
- [ ] Verify success page shows correctly

#### Google Play Testing
- [ ] Enable test licence in Google Play Console
- [ ] Test app purchase flow with test account
- [ ] Verify purchase receipt validation
- [ ] Test refund in Play Console
- [ ] Test license key revocation

#### Gumroad Testing
- [ ] Create free product ($0 price)
- [ ] Complete checkout with test email
- [ ] Verify license key email sent
- [ ] Test license key verification endpoint
- [ ] Refund test purchase immediately
- [ ] Test license key expiry (if applicable)

#### Analytics Testing
- [ ] Verify GA4 events fire in browser (debug mode)
- [ ] Test trial_start event
- [ ] Test purchase event with revenue
- [ ] Test paywall impression
- [ ] Verify funnel visualization
- [ ] Check dashboard data appears

#### Paywall Testing (all 28 apps)
- [ ] Trial displays correctly (7 days)
- [ ] Paywall appears after trial
- [ ] Upgrade button works → checkout
- [ ] Success page after purchase
- [ ] Premium features unlock
- [ ] Ad-free experience activates
- [ ] History & export features available

### Content & Legal Review

- [ ] Privacy policy complete
- [ ] Refund policy complete
- [ ] Terms of Service complete
- [ ] In-app paywall copy accurate
- [ ] Email templates reviewed
- [ ] FAQ prepared (pricing, subscription, refund)

---

## Week 2–3: Go-Live Preparation

### Switch to Production Keys

#### Stripe Live
- [ ] Update .env with pk_live_, sk_live_ keys
- [ ] Deploy with live keys
- [ ] Configure live webhook endpoint
- [ ] Test with real card (use your own)
- [ ] Verify payout to bank account

#### Google Play Live
- [ ] Deploy Android app with live Google Play Billing key
- [ ] Test purchase flow in production app
- [ ] Verify purchase shows in Google Play Console

#### Gumroad Live
- [ ] Publish all 28 products
- [ ] Share product links (no pre-order, live immediately)
- [ ] Test purchase on live product

### Monitoring Setup

- [ ] Create Stripe alerts (failed payments, disputes)
- [ ] Create Google Play alerts (if available)
- [ ] Set up error logging (Sentry / LogRocket)
- [ ] Create revenue dashboard (Sheets or Data Studio)
- [ ] Schedule daily monitoring email
- [ ] Prepare on-call runbook (payment issues)

### Go-Live Checklist

- [ ] All 28 apps have paywall UI
- [ ] All pricing configured in all 3 platforms
- [ ] Analytics events firing correctly
- [ ] Privacy & refund policies live
- [ ] Support email configured (support@rhythmix.com)
- [ ] Refund request form created
- [ ] Billing Portal link working
- [ ] License key verification working
- [ ] No test keys in production

**Go-live date: _______________**

---

## Launch Week: Monitoring

### Daily (7am–6pm)

- [ ] Check Stripe dashboard (new purchases, failures)
- [ ] Check Google Play Console (new installs, reviews)
- [ ] Check Gumroad (new orders, refunds)
- [ ] Monitor error logs (payment processing errors)
- [ ] Monitor GA4 (funnel completion, events)
- [ ] Review email: any refund requests?
- [ ] Check social media: user feedback on pricing?

### Weekly

- [ ] Export revenue report (all 3 platforms)
- [ ] Calculate conversion funnel (installs → purchases)
- [ ] Review chargeback/dispute activity (should be ~0)
- [ ] Check for any payment failures (contact customers)
- [ ] Update monetization doc with real metrics

### First Month Targets

- [ ] 100+ trial starts
- [ ] 5–10% conversion to paid
- [ ] <5% churn rate (cancellations)
- [ ] Zero critical payment bugs
- [ ] 3–5 refunds processed (normal)
- [ ] ARPU emerges (should be $2–5/month)

---

## Ongoing: Monthly Operations

### 1st of Month

- [ ] **Revenue Report**
  - [ ] Export Stripe statement (CSV)
  - [ ] Export Google Play statement (PDF)
  - [ ] Export Gumroad statement (CSV)
  - [ ] Reconcile with GA4 numbers
  - [ ] Create summary: total revenue, by app, by platform

- [ ] **Analytics**
  - [ ] Review funnel: installs → trial → purchase
  - [ ] Check churn rate (target: <5%)
  - [ ] Check retention (day 7, 30, 90)
  - [ ] Identify top-converting apps
  - [ ] Identify low-performing apps (consider pricing adjustment)

- [ ] **Operations**
  - [ ] Process any pending refunds
  - [ ] Review disputes (if any)
  - [ ] Verify all payouts completed
  - [ ] Backup financial records

### Weekly

- [ ] Monitor payment failures (try to auto-recover)
- [ ] Respond to refund requests (<48 hr SLA)
- [ ] Check error logs for payment issues
- [ ] Review new reviews/ratings (payment-related complaints)

### Quarterly (Every 3 Months)

- [ ] **Pricing Review**
  - [ ] Analyze LTV by app
  - [ ] Identify churn drivers
  - [ ] A/B test new pricing (if ARPU < $2)
  - [ ] Adjust regional pricing (if needed)

- [ ] **Product Review**
  - [ ] Feature parity audit (are all apps equal quality?)
  - [ ] Paywalls align with value? (trial, features, price)
  - [ ] Reduce friction: any failed purchases to investigate?
  - [ ] Expand: upsell opportunities (annual to monthly, etc.)

- [ ] **Tax & Compliance**
  - [ ] File GST return (if registered)
  - [ ] Reconcile income statement
  - [ ] Review expense deductions
  - [ ] Ensure record-keeping current

### Annually (End of Financial Year)

- [ ] **Audit**
  - [ ] Full financial reconciliation
  - [ ] ATO income tax return preparation
  - [ ] All receipts organized & categorized
  - [ ] Contract review (Stripe, Google, Gumroad terms)

- [ ] **Strategic Planning**
  - [ ] LTV analysis (which apps most profitable?)
  - [ ] CAC analysis (customer acquisition cost)
  - [ ] Funnel optimization roadmap
  - [ ] New monetization opportunities (family plan, bundle, etc.)

---

## Reference: File Locations

All monetization docs are at: `/home/user/jamie-wigg/monetization/`

| File | Purpose |
|------|---------|
| `play-store-iap-config.json` | Google Play IAP SKU definitions (28 apps) |
| `FREEMIUM_MODEL.md` | Paywall strategy, free vs premium tiers |
| `STRIPE_INTEGRATION.md` | Stripe setup, checkout, webhooks |
| `GUMROAD_INTEGRATION.md` | Gumroad product & license setup |
| `ANALYTICS_SETUP.md` | GA4 events, funnels, revenue tracking |
| `PAYOUT_COMPLIANCE.md` | Bank setup, tax, regional compliance |
| `IMPLEMENTATION_CHECKLIST.md` | This file—day-by-day tasks |

---

## Example Timeline

```
Week 1 (May 1–5)
├─ Day 1: Bank account, ABN, GST
├─ Day 1–2: Stripe account + products
├─ Day 1–2: Google Play setup
├─ Day 1–2: Gumroad setup
├─ Day 2–3: GA4 implementation
├─ Day 3–4: Frontend paywall code
├─ Day 4: Backend verification code
└─ Day 5: Legal docs (privacy, refund, TOS)

Week 2 (May 8–12)
├─ Day 1–2: Full Stripe test flow
├─ Day 1–2: Google Play test flow
├─ Day 1–2: Gumroad test flow
├─ Day 2–3: Analytics validation
├─ Day 3–4: Paywall refinement (all 28 apps)
├─ Day 4: Code review & security audit
└─ Day 5: Deploy to staging environment

Week 3 (May 15–19)
├─ Day 1: Switch to live keys
├─ Day 1–2: UAT with real payments
├─ Day 2: Error handling & edge cases
├─ Day 3: Monitoring setup
├─ Day 3–4: Marketing & announcement prep
└─ Day 5: LAUNCH

Week 4+ (May 22+)
├─ Daily: Monitor conversions & errors
├─ Weekly: Revenue review
└─ Monthly: Full reconciliation & strategy
```

---

## Success Metrics (First 3 Months)

### Targets

| Metric | Target | Reality |
|--------|--------|---------|
| Monthly active users | 5,000+ | ___ |
| Trial conversion | 25% of installs | ___ |
| Free-to-premium conversion | 8–15% of trials | ___ |
| Monthly revenue | $5,000+ | ___ |
| Churn rate | <5% | ___ |
| Average subscription length | 6+ months | ___ |
| Refund rate | <5% | ___ |

### Key Wins

- [ ] First $100 revenue (celebrate!)
- [ ] First 10 premium subscribers
- [ ] First month breakeven (costs covered)
- [ ] First 1,000 trial starts
- [ ] Churn rate stabilizes <5%

---

## Troubleshooting Quick Reference

| Problem | Solution | Doc |
|---------|----------|-----|
| Checkout not loading | Check pk_live_ key, whitelist domain in Stripe | STRIPE_INTEGRATION.md |
| Purchase succeeds but access not granted | Webhook not firing; check endpoint URL | STRIPE_INTEGRATION.md § 6 |
| GA4 events not appearing | Check Measurement ID, use GA Debug View | ANALYTICS_SETUP.md |
| Payout delayed >3 days | Check bank account verification; contact support | PAYOUT_COMPLIANCE.md |
| Refund request from user | Process in Stripe/Google/Gumroad console | PAYOUT_COMPLIANCE.md § 11 |
| Regional pricing seems wrong | Verify regional pricing in play-store-iap-config.json | play-store-iap-config.json |
| License key not verifying | Check product_id matches; test with invalid key first | GUMROAD_INTEGRATION.md § 6 |

---

## Support Escalation

**If something breaks:**

1. Check error logs (browser console + server logs)
2. Verify API keys are live (not test)
3. Check firewall / domain whitelist (Stripe only allows HTTPS)
4. Contact platform support:
   - Stripe: support.stripe.com (usually <1hr response)
   - Google Play: console.cloud.google.com/support
   - Gumroad: gumroad.com/support (email, slower)
5. Document issue for post-mortem

---

## Post-Launch: Growth Opportunities

Once live for 1+ month:

- [ ] A/B test paywall messaging (color, copy, timing)
- [ ] Launch affiliate program (via Gumroad)
- [ ] Create "family plan" bundle ($5.99/month, 6 users)
- [ ] Offer annual discount (20% off monthly × 12)
- [ ] Partner with influencers (lifetime license for review)
- [ ] Seasonal promotions (first month free, limited time)
- [ ] Retention emails (day 1, 7, 30 after purchase)
- [ ] Win-back campaign (refunded users get discount code)

---

## Notes for Self

**Key assumptions made in this plan:**
- 28 apps deployed on web + Play Store
- All apps have similar core functionality (hence standard freemium model)
- Primary market: English-speaking countries (US, UK, AU, CA, etc.)
- Revenue goal: $10k+/month within 6 months
- No existing payment infrastructure

**Custom adjustments needed for:**
- If apps are very different (educational vs. games): separate paywall strategies
- If targeting specific countries (India, Brazil): adjust pricing aggressively
- If already have user base: stagger rollout (avoid paywall shock)
- If want enterprise/B2B: add separate licensing tier

---

## Final Sign-off

**Implementation ready to begin:**

- Date: _______________
- Owner: Jamie Wigg
- Status: ☐ Ready for dev ☐ In progress ☐ Live

**Launch date target: _______________**
