# monetize-audience

Workflow for converting existing audience (YouTube subscribers, email list, social followers) into revenue.

## Trigger

User runs: `/monetize-audience` or loads this skill for converting fans into paying customers.

## What this skill does

Orchestrates monetization across 4-week pipeline:

**Week 1: Audience Analysis**
- Segment viewers by engagement (analytics-engineer agent)
- Identify highest-LTV cohorts (financial-forecaster agent)
- Analyze content performance (analytics-engineer agent)

**Week 2: Offer Design & Creative**
- Define 3 monetization offers (copywriter agent)
- Create landing page (funnel-architect agent)
- Produce demo video (video-producer agent)
- Design hero image (thumbnail-designer agent)

**Week 3: Funnel Activation**
- Email sequence writing (copywriter agent)
- Retargeting audience setup (paid-ads-strategist agent)
- Payment processing (Stripe integration)
- Customer onboarding flow (funnel-architect agent)

**Week 4: Measure & Iterate**
- Revenue dashboard (analytics-engineer agent)
- A/B testing email variants (copywriter agent)
- Ad performance optimization (paid-ads-strategist agent)
- Customer feedback collection (community-manager agent)

## Requires

- Existing audience (1000+ YouTube subscribers OR 10k+ email list)
- Stripe account (payment processing)
- Supabase project (customer data)
- Google Ads / Facebook Ads account
- Email platform (Mailchimp or Resend)

## Related docs

- `ECOSYSTEM.md` — Full agent roster
- `docs/workflows/monetization.md` — Detailed funnel strategy
- `sites/codex-of-reality/` — Reference: Codex funnel (working example)

## Agent chain

```
audience-data
  → analytics-engineer (segmentation)
  → financial-forecaster (LTV analysis)
  → copywriter (offer copy + email sequences)
  → funnel-architect (landing page + checkout)
  → video-producer (product demo video)
  → thumbnail-designer (hero image + social cards)
  → paid-ads-strategist (retargeting setup)
  → community-manager (launch announcement)
  → analytics-engineer (real-time revenue dashboard)
  → financial-forecaster (weekly P&L)
```

## Output artifacts

- Landing page (Supabase + Vercel)
- 5-email sequence (Mailchimp)
- Checkout flow (Stripe)
- Demo video (MP4)
- 3 hero image variants (PNG)
- Google Ads campaigns
- Real-time revenue dashboard
- Weekly metrics report (CAC, LTV, ROAS)

## Success metrics

- CAC (Customer Acquisition Cost) < 20% of LTV
- Email open rate > 30%
- Landing page conversion > 5%
- Ad ROAS > 3:1
