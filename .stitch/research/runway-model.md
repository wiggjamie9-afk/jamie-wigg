# Cash runway model

> **Question this answers:** How many months until you run out of cash, under three scenarios? Plan changes materially if runway is < 9 months.
>
> **You need to fill in five inputs.** Everything else computes.

## Inputs to fill in

| Variable | Symbol | Your value |
|---|---|---|
| Cash on hand today | `C0` | $______ |
| Monthly OpEx (salaries + tools + cloud + rent + everything) | `OPEX` | $______/mo |
| Gross margin (revenue minus COGS as a fraction; SaaS typically 0.75–0.85) | `GM` | 0.____ |
| Current MRR | `MRR0` | $45,000 |
| Net new MRR per month (current trajectory; can be negative) | `dMRR` | $______/mo |

Sanity-check `dMRR`: at 8% churn × 500 customers × $89 = **−$3,560/mo from churn alone**. Subtract gross new MRR/month to get net.

## The formula

Each month, cash changes by:

```
cash_flow_month_n = (MRR_n × GM) − OPEX
MRR_n+1 = MRR_n + dMRR
cash_n+1 = cash_n + cash_flow_month_n
```

Runway = the smallest `n` where `cash_n ≤ 0`.

## Scenario A — Status quo (do nothing)

- Churn stays at 8%
- Acquisition stays at $3K/mo budget × current CAC

```
dMRR_A = (gross_new_MRR_per_month) − (MRR_n × 0.08)

# Example with $1K gross new MRR/mo (≈11 customers × $89):
# dMRR at MRR=$45K → $1,000 − $3,600 = −$2,600/mo
# MRR shrinks; OpEx flat; cash drains faster each month
```

This is the bad scenario. MRR shrinks, gross profit shrinks, runway shortens non-linearly because both burn AND revenue compound the wrong way.

## Scenario B — Churn fix (8% → 4% by day 90)

- Day 0–90: same as A
- Day 90+: monthly churn drops to 4%
- Acquisition resumes at $3K/mo

```
dMRR_B (after day 90) = gross_new_MRR_per_month − (MRR_n × 0.04)
# With $1K gross new and MRR=$45K → $1,000 − $1,800 = −$800/mo
# Still shrinking, but slower; reaches positive when gross new > MRR×0.04
```

For `dMRR_B = 0` at MRR=$45K, you need gross new MRR = $1,800/mo (≈20 new customers/mo). That requires either CAC dropping to $150 or budget rising to $5,600/mo — both achievable post-niche pivot.

## Scenario C — Churn fix + niche pivot + $149 tier

- Churn 4% (Scenario B)
- Niche message lifts conversion → CAC drops 20% to $224
- 30% of new customers take the $149 tier
- Effective new MRR per dollar: ($89 × 0.7 + $149 × 0.3) / $224 = $107 / $224 = $0.48 per $1 spent
- $3K budget → $1,440 gross new MRR/mo

```
dMRR_C (after day 120) = $1,440 − (MRR × 0.04)
# At MRR=$45K → $1,440 − $1,800 = −$360/mo (still negative)
# Breaks positive once a few % of base upgrades to $149
```

Mid-2026, with the upgrade lift, this turns net positive.

## Build the spreadsheet

| Month | Starting MRR | dMRR | New MRR | Gross profit | Cash flow | Cash end |
|---|---|---|---|---|---|---|
| 0 | 45,000 | -2,600 | 42,400 | 42,400 × GM | minus OPEX | C0 + cash_flow |
| 1 | 42,400 | -2,600 | 39,800 | 39,800 × GM | minus OPEX | … |
| 2 | 39,800 | -2,600 | 37,200 | 37,200 × GM | minus OPEX | … |
| ... | ... | ... | ... | ... | ... | ... |

Build it in a spreadsheet. Three sheets: A, B, C. Same `C0` and `OPEX`; different `dMRR` curves.

## Decision rules from the output

| Scenario A runway | Action |
|---|---|
| > 18 months | Comfortable. Execute Scenarios B + C with full focus on retention. |
| 12–18 months | Tight but workable. Begin bridge conversations *now*; don't wait. |
| 9–12 months | Critical. Cut OpEx to extend; raise a bridge in 30–60 days. |
| < 9 months | Existential. Founder calls every customer, kill all non-essential spend, secure bridge in 30 days, and re-plan everything below. |

## What changes the math most

In order of leverage at this stage:

1. **Churn rate.** Halving churn nearly doubles LTV; effects compound monthly.
2. **Gross margin.** SaaS GMs are often inflated by treating customer success as OpEx not COGS. Be honest.
3. **OpEx.** Each $5K/mo cut adds ~1 month of runway per $5K of cash on hand.
4. **Pricing.** A 10% price increase on the 30% of customers willing to pay it = ~$1,350/mo new MRR with zero CAC.
5. **CAC.** Marginal here — $3K budget is small relative to OpEx. Move CAC after the others.

## Inputs to provide before this is actionable

`C0`, `OPEX`, `GM`, and current `dMRR` (or the gross-new-MRR/month figure to compute it). Without these, the model is a template; with them, it's a calendar.
