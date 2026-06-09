# Freemium Model Definition

## Overview

This document defines the freemium monetization strategy for 28 core apps across health, finance, productivity, education, and lifestyle categories.

## Freemium Tier Structure

### Tier 1: Free (Basic Features)

All 28 apps follow one of two freemium patterns. Default: **7-day trial then paywall**

**Features in Free Tier:**
- Core functionality (primary use case)
- Basic history: 30 days of data retention
- Up to 5 custom entries (categories, reminders, recipes, etc.)
- Standard UI without advanced themes
- Optional ads (banner or interstitial, not video)
- Basic analytics (personal only, no export)
- Single device access

**Examples by app:**
- **Health trackers** (BP, Weight, Water, Period): Last 30 days visible, no trends
- **Finance trackers** (Budget, Expense, Savings): Last 30 days visible, no reports
- **Productivity** (Notes, Reminders, Tasks): 5 items, no syncing across devices
- **Meditation/Wellness**: 3 free sessions, watermarked meditation timer
- **Education** (Study Planner, English Pocket, Math Helper): 10 practice problems/day

### Tier 2: Premium

**Unlock Conditions:**
- 7-day free trial (no payment required during trial)
- After trial expires → paywall
- Alternative: after 5 active sessions within 7 days → reminder, paywall after session 6
- Users can subscribe during trial at any time (cancel within 7 days for refund)

**Premium Features:**
- Unlimited history (all-time data retention)
- Unlimited custom entries/items
- Advanced themes (dark mode, custom colors)
- No ads (completely ad-free)
- Advanced analytics & insights
  - Trends & predictions
  - Exportable reports (CSV/PDF)
  - Charts & visualizations
- Syncing across devices (cloud backup)
- API access for third-party integrations (power users)

**Pricing:**
- **Monthly**: $1.99–$3.99 (varies by app priority)
  - Fitness/Wellness (Meditation, Resonate, Roomtone): $3.99/mo
  - Music (Hum): $3.99/mo
  - Core productivity & health: $2.99/mo
  - Basic tools (Notes, Timer, Water): $1.99/mo
- **Annual**: 17% savings off monthly price (pay once/year)

**Subscription Details:**
- Auto-renews (clearly disclosed at purchase)
- Cancel anytime; access revoked at end of billing period
- Family sharing: Premium unlocks on primary account only (separate family plan tier for 2.0)

---

## Paywall Placement Strategy

### Timing Triggers

| Trigger | What Happens |
|---------|-------------|
| **Day 1–7** | Full feature access (trial mode) |
| **Day 7 (end of trial)** | Soft paywall: "Trial ended. Upgrade to continue." |
| **After 5 sessions** | If user has logged in 5 times within 7 days, show gentle reminder on session 6 |
| **Export attempt** | If user tries to export data → paywall ("Export premium feature") |
| **Advanced feature** | Trends, analytics, themes → paywall |

### Paywall UI Pattern

```
┌─────────────────────────────────────┐
│  Trial Ended                        │
├─────────────────────────────────────┤
│  Unlock Premium for unlimited access│
│                                     │
│  ◉ Monthly: $2.99/month             │
│    Cancel anytime                   │
│                                     │
│  ○ Annual: $29.99/year              │
│    Save 17% (billed once)           │
│                                     │
│  [7-day free trial button]          │
│  Not interested (Dismiss)           │
└─────────────────────────────────────┘
```

---

## Free-to-Premium Conversion Mechanics

### Nudges (Non-intrusive)

1. **Feature Lockout**: Attempting a premium feature → inline banner "Available in Premium"
2. **Data Limit**: After 30 days of history → "View full history with Premium"
3. **Export Prompt**: Click export → "Premium feature. Unlock now?"
4. **Interstitial (1 per session)**: After 3 free sessions, show paywall once per day

### No Dark Patterns

- Do NOT use aggressive countdown timers
- Do NOT show unrelated ads to Free users if they're on trial
- Do NOT limit free tier features during trial, only after expiration
- Do NOT require email/account to access free features

---

## App-Specific Freemium Variants

### Always Free (5 apps)

These apps are core utilities with no paywall:
- **Loan Calculator**: Calculate-only, no data saving
- **Pomodoro Timer**: Basic timer, no history
- **Reminders**: Basic reminders, no sync
- **TaskList**: Basic task management
- **Voice Notes**: Record-only, no export
- **Water Tracker**: Basic logging
- **Weight Tracker**: Basic logging
- **Savings Challenge**: Basic tracking
- **Notes**: Basic notes, no sync

**Alternative**: These offer limits instead of trial:
- 5 reminders (add more → upgrade)
- 100 tasks (add more → upgrade)
- 50 voice notes (add more → upgrade)

---

## Conversion Funnel Goals

### Target Metrics (monthly)

| Metric | Target |
|--------|--------|
| Trial starts (% of installs) | 25% |
| Trial completion rate | 40% |
| Free-to-Premium conversion | 8–15% |
| Churn rate (premium) | <5% /month |
| Lifetime value (avg premium user) | $50–150 |

**Calculation**: If 1,000 installs/month:
- 250 start trial (25%)
- 100 complete trial (40% of 250)
- 8–15 convert to premium (8–15% of 100)

---

## Revenue Projections (28 apps combined)

### Conservative Scenario (Year 1)

- **Total installs**: 50,000/month (all apps)
- **Trial conversion**: 8% → 4,000 premium subs
- **Monthly revenue**: 4,000 × $2.50 avg = **$10,000/month**
- **Annual revenue**: **$120,000** (before platform fees)

### After Platform Fees

- Google Play: 30% cut
- Payment processor: 2.9% + $0.30
- **Net to developer**: ~$83,000/year

---

## Implementation Checklist

### Frontend (Web/App)

- [ ] Add trial status badge to app header
- [ ] Track trial start date in localStorage/IndexedDB
- [ ] Implement paywall UI component
- [ ] Add "Upgrade" CTA buttons to premium features
- [ ] Track paywall impressions & conversion in analytics
- [ ] Implement "Cancel subscription" flow (link to Play/App Store)

### Backend (Server-side if needed)

- [ ] Validate receipts from Google Play / Apple (if web-to-app bridge)
- [ ] Store subscription status per user (email or anonymous ID)
- [ ] Auto-expire free tier access when trial ends
- [ ] Webhook listener for cancellations/refunds

### Analytics

- [ ] Track "Trial Start" event
- [ ] Track "Paywall Impression" per feature
- [ ] Track "Upgrade Click" & "Upgrade Confirmed"
- [ ] Funnel: Installs → Trial → Conversion
- [ ] Cohort analysis: retention by subscription type

---

## User Communication

### Email Templates (if using login/email)

#### Trial Started
```
Subject: Your 7-day free trial is active

Hi [Name],

Enjoy unlimited access to [App Name] for the next 7 days, no payment required. 
After the trial ends, you can upgrade to Premium for just $2.99/month.

Your trial ends: [Date]
Manage subscription: [Link]

Cheers!
```

#### Trial Ending Soon (Day 5)
```
Subject: Your trial ends in 2 days

Hi [Name],

Your 7-day trial of [App Name] ends in 2 days. After that, upgrade to 
Premium to keep all your data and enjoy unlimited features.

[Upgrade Now Button]

Your trial ends: [Date]
```

#### Trial Ended
```
Subject: Your trial has ended

Hi [Name],

Your trial of [App Name] has ended. Your data is still available for 7 more days.

Upgrade to Premium now to keep full access:
- Unlimited history
- No ads
- Advanced analytics

[Upgrade Now Button]
```

---

## Compliance & Legal

### Required Disclosures

- **Free trial terms**: "7-day free trial. Converts to paid subscription at $X.XX/month unless cancelled."
- **Cancellation**: "Cancel anytime in [App Store Settings / Play Store Billing]"
- **Privacy**: Link to privacy policy in paywall & settings
- **Accessibility**: Paywall must pass WCAG 2.1 AA tests (color contrast, keyboard nav)

### Refund Policy

- Users can request a refund **within 48 hours** of first purchase
- Automatic refund if cancelled within 7-day trial period
- After 7 days: refunds at developer discretion (recommend: 14-day money-back guarantee)

### Regional Pricing (Auto-adjusted by Play Store)

- **Developed markets** (US, UK, CA, AU, DE, FR, JP): Full price
- **Emerging markets** (IN, BR, MX, PH, ID, NG, PK): 67% discount
- **Least-developed markets** (BD, ET, MM, UG, YE): 83% discount

Play Store handles currency conversion & tax.

---

## Future Roadmap (Freemium 2.0)

- **Family Plan**: $5.99/month, 6 users, shared sync
- **Bundle**: All 28 apps for $9.99/month (net higher ARPU)
- **Loyalty**: 12-month discount (pay annual → 20% savings)
- **Seasonal Promotions**: First month free (limited time)
- **Ad-supported Free Tier**: Longer trial (14 days) if ads enabled
