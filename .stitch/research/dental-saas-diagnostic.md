# Dental SaaS — churn-first diagnostic

> Distinct from the remote-team-leader B2B SaaS in `trial-to-paid.md`. Different business, different numbers.

## Inputs

```
business_profile:
- SaaS for dental practices
- 18 months in market, $45K MRR
- Team of 8, mostly technical
- CAC: $280
- ARPU: $89/month
- Primary competitor: Dentrix (30x size)

current_challenge:
- Growth stalled at 500 customers
- Monthly churn: 8%
- Marketing budget: $3K/month
- Founder-led sales, no formal process

constraints:
- Can't hire full-time marketer yet
- Must see ROI within 60 days
- Technical team, limited marketing expertise
```

## The diagnosis: this is a churn problem, not a growth problem

| Metric | Value |
|---|---|
| Customers lost / month | 500 × 8% = **40** |
| Customers acquired / month at $3K budget | $3,000 / $280 = **~10.7** |
| Net change / month | **−29** |

CAC payback is fine: $280 / $89 = **3.1 months**. The acquisition unit economics aren't the problem. The retention unit economics are.

8% monthly churn ≈ 63% annual gross churn. Best-in-class SMB SaaS sits at 1–2% monthly; mediocre is 3–4%. The business is 2–4× worse than mediocre, not 20% worse — this is a strategic crisis, not an optimisation problem.

## 60-day plan: fix the leak before refilling the bucket

Reallocate the $3K/month and founder attention. Acquisition pauses.

| Week | Action | Owner |
|---|---|---|
| 1–2 | **Churn diagnostic.** Interview 20 customers who churned in the last 60 days. 30-min calls, $50 gift card incentive (≈$1K). Identify the top 2 reasons. | Founder + 1 engineer transcribing |
| 3–4 | **Fix the #1 leak.** Likely candidates for dental SaaS: missing PMS/imaging integration, onboarding incomplete in week 1, pricing mismatch with single-chair practices, Dentrix offering aggressive winback discounts. | Engineering, 2 weeks |
| 5–6 | **At-risk outreach.** Define "at-risk" = no login in 7 days OR onboarding incomplete after 14 days. Founder calls every at-risk customer personally. | Founder, ~5 hrs/week |
| 7–8 | **Measure.** Did monthly churn drop ≥1pp? If yes, systematise. If no, run another 20 interviews — wrong hypothesis. | All |

## ROI math in 60 days

If churn drops 8% → 6% (achievable from a single high-severity fix):

- 10 customers/month retained × $89 = **+$890 MRR every month, compounding**
- LTV per customer: $89 / 0.08 = $1,113 → $89 / 0.06 = $1,483. **+33%** across all 500 customers.

The single highest-ROI hour in the next 60 days is dialling a churned customer.

## Anti-patterns — explicitly do NOT

- **Don't hire a marketer.** Marketing has no fuel until retention works.
- **Don't out-feature Dentrix.** 30× your engineers; you'll lose. Pick a niche they ignore (solo practitioners, ortho, specific PMS) and own it.
- **Don't expand the trial or drop pricing.** Both attract less-committed customers — churn gets worse, not better.
- **Don't formalise sales process yet.** Founder-led at 8 people is a feature. Fix it after churn.

## What to measure, weekly

- Monthly logo churn (target: 8% → 6% by day 60, → 4% by day 120)
- % of new customers who complete onboarding in 14 days
- % of at-risk cohort the founder reached this week
- Net MRR change (should turn positive once churn drops below acquisition rate)
