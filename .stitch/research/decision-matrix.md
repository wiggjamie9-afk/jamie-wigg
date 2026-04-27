# Decision matrix — trial→paid tactics

> Five conversion tactics scored on Cost, Implementation Time, Risk, and Expected ROI. Weights: Cost 30%, Time 20%, Risk 25%, ROI 25%. Scoring scale 1–10, higher = better on every dimension (so for Cost / Time / Risk, higher = cheaper / faster / safer).

## Matrix

| # | Option | Cost (30%) | Time (20%) | Risk (25%) | ROI (25%) | **Weighted** |
|---|---|---|---|---|---|---|
| 1 | Activation push: in-product nudges + onboarding sequence to get ≥3 team members logged in within 7 days | 8 | 8 | 9 | 9 | **8.50** |
| 2 | Day-10 loss-aversion email: "team data archives in 4 days unless you upgrade" | 10 | 10 | 7 | 7 | **8.50** |
| 3 | Three-tier pricing with decoy (top tier 2.2–2.5× middle) | 7 | 6 | 5 | 8 | **6.55** |
| 4 | Per-seat pricing with 10-seat team minimum | 7 | 6 | 6 | 9 | **7.05** |
| 5 | Sales-led demo motion (hire one AE for inbound) | 3 | 4 | 4 | 9 | **4.95** |

## Excel-paste version (tab-separated)

```
Option	Cost	Time	Risk	ROI	Weighted
Activation push	8	8	9	9	8.50
Day-10 loss-aversion email	10	10	7	7	8.50
Three-tier pricing with decoy	7	6	5	8	6.55
Per-seat with team minimum	7	6	6	9	7.05
Sales-led demo motion	3	4	4	9	4.95
```

## Recommendation

**Ship #1 then #2 in sequence (≈4–5 weeks total).**

They tie on weighted score but stack mechanically — activation creates the day-10 cohort that the loss-aversion email then converts, so the upside compounds rather than overlapping. Defer #4 (pricing) until after activation data tells you the real seat curve, and skip #5 until ARR justifies an AE hire (typically $300k+).

## Assumptions to sanity-check

- Engineering capacity: 1–2 ICs available
- 14-day trial length
- Self-serve checkout already exists
- "Cost" is dollars + opportunity cost, not just dollars

Override any of those and the ranking shifts — re-score with new assumptions before committing.
