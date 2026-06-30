---
id: gtm-roles-revops-crm-hygiene-audit
name: "RevOps CRM Hygiene Audit"
description: "A collection of analytical prompts for RevOps practitioners running CRM data quality initiatives. Covers duplicate detection, stale-deal triage, field-completion enforcement, and stage-discipline checks."
category: marketing
group: roles
subcategory: revops
risk: none
license: MIT
tags: ["go-to-market", "role", "revops"]
---
# Reference: RevOps CRM Hygiene Audit Prompts

## Purpose
A collection of analytical prompts for RevOps practitioners running CRM data quality initiatives. Covers duplicate detection, stale-deal triage, field-completion enforcement, and stage-discipline checks. Calibrated for Salesforce and HubSpot environments but adaptable to any CRM. Not templates — starting points.

---

## Prompt 01 — Duplicate Account Detection
**Role:** RevOps
**Trigger:** Quarterly data audit or pre-system-migration review
**Structure:** List criteria → define merge logic → identify owner → document resolution steps
**Example output:** "Pull all accounts where [Name] fuzzy-matches within Levenshtein distance 2 AND [BillingPostalCode] matches. Flag pairs where both records have open opportunities — escalate to AE before merging. Auto-merge any pair where one record has zero activity in 18 months."
**Why it works:** Fuzzy name + postal code matching surfaces the most common duplicate pattern (reps creating accounts under slightly different spellings) without generating false positives from same-named companies in different markets.
**Word count:** N/A — analysis prompt
**Avg. score:** 84-92

---

## Prompt 02 — Stale Deal Flag Report
**Role:** RevOps
**Trigger:** Weekly pipeline review or forecast call prep
**Structure:** Define staleness threshold per stage → query → output owner-sorted table → attach to forecast deck
**Example output:** "Flag any opportunity where [Stage] has not changed in more than 21 days AND [Close Date] is within the current quarter. Export as owner-sorted CSV: Opp Name, Stage, Days Stale, ARR, Next Step (blank or populated)."
**Why it works:** Stage-movement staleness is a stronger signal than last-activity date alone — a rep can log a call note without actually advancing the deal, masking a stall.
**Word count:** N/A — analysis prompt
**Avg. score:** 87-94

---

## Prompt 03 — Missing Required Fields Report
**Role:** RevOps
**Trigger:** Before any forecast call, board prep, or commission run
**Structure:** List required fields by stage → identify gaps → assign remediation owner → set SLA for correction
**Example output:** "Generate a report of all open opportunities in Stage 3 or later that are missing any of: [Close Date], [ARR], [Champion Name], [Competitor]. Sort by ARR descending. Email AE + manager the list every Monday at 08:00."
**Why it works:** Gating field completion by stage (not universally) reduces rep friction while ensuring data integrity exactly where it matters for forecasting and handoffs.
**Word count:** N/A — analysis prompt
**Avg. score:** 82-90

---

## Prompt 04 — Stage-Discipline Check
**Role:** RevOps
**Trigger:** Monthly pipeline hygiene review or after a spate of forecast misses
**Structure:** Define exit criteria per stage → query deals that advanced without meeting criteria → surface to manager
**Example output:** "Identify all opportunities that moved from Stage 2 to Stage 3 in the last 30 days without a completed [Business Case Call] activity logged. Flag deal, AE, and date of advancement. Present to VP Sales in Tuesday sync."
**Why it works:** Prompts reps to treat stage advancement as a meaningful milestone rather than an optimistic gesture, which directly improves forecast accuracy.
**Word count:** N/A — analysis prompt
**Avg. score:** 85-93

---

## Prompt 05 — Contact Role Coverage Audit
**Role:** RevOps
**Trigger:** Pre-close forecast or late-stage deal review
**Structure:** List required contact roles per deal size → query coverage gaps → surface to AE + CSM
**Example output:** "For all opportunities over $50K ARR in Stage 4+, check that at minimum [Economic Buyer], [Champion], and [Technical Evaluator] contact roles are populated. Flag any deal missing two or more roles. Include [Account Executive] and [Expected Close Date] in the output."
**Why it works:** Multi-stakeholder coverage is one of the strongest predictors of deal close. Surfacing gaps early gives reps time to remediate before deals stall at legal or procurement.
**Word count:** N/A — analysis prompt
**Avg. score:** 86-93

---

## Prompt 06 — Data Quality Scorecard by Rep
**Role:** RevOps
**Trigger:** Monthly RevOps reporting or QBR prep
**Structure:** Define quality dimensions → weight each → score per rep → include in monthly RevOps pack
**Example output:** "Score each AE on five dimensions (field completion %, stage-discipline adherence, activity logging cadence, contact role coverage, forecast category accuracy) weighted 20% each. Output a league table with scores 0–100. Share in Slack #revenue-ops channel on the first Monday of each month."
**Why it works:** Making hygiene visible and attributable to individuals creates accountability without requiring a top-down mandate — reps self-correct when they can see their score relative to peers.
**Word count:** N/A — analysis prompt
**Avg. score:** 80-89

---

## Prompt 07 — Closed-Lost Reason Audit
**Role:** RevOps
**Trigger:** Quarterly loss analysis or ICP refinement exercise
**Structure:** Pull closed-lost opps → check reason field population → cluster reasons → surface top 3 to leadership
**Example output:** "Pull all opportunities closed-lost in the last 90 days. Flag any where [Closed Lost Reason] is blank or set to 'Other'. For populated reasons, cluster into buckets: Price, Competitor, No Decision, Timing, Feature Gap. Calculate % of ARR lost per bucket and present to Product + Sales leadership."
**Why it works:** 'Other' is a data graveyard. Forcing specificity — and then clustering — turns loss data into actionable product and positioning intelligence rather than a compliance checkbox.
**Word count:** N/A — analysis prompt
**Avg. score:** 83-91

---

## Prompt 08 — Orphaned Record Cleanup
**Role:** RevOps
**Trigger:** Post-rep-departure, quarterly audit, or before a CRM migration
**Structure:** Define orphaned record criteria → query → reassign or archive → document ownership logic
**Example output:** "Identify all open leads and opportunities where [Owner] is an inactive or deactivated user. Segment by value: opps over $10K ARR reassign to regional manager queue; opps under $10K ARR close as 'Orphaned — Reassigned'; leads without activity in 60+ days archive."
**Why it works:** Orphaned records silently distort pipeline reports and forecast accuracy. Proactive cleanup after rep churn prevents compounding data debt.
**Word count:** N/A — analysis prompt
**Avg. score:** 81-88

---

## Prompt 09 — Activity Logging Compliance Check
**Role:** RevOps
**Trigger:** Weekly ahead of pipeline review call
**Structure:** Define expected activity cadence per stage → query gaps → produce per-rep summary → review with managers
**Example output:** "For all opportunities in Stage 2–5, flag any deal with no logged activity (call, email, or meeting) in the past 14 days. Group by AE. For each flagged deal, show last activity date, deal value, and close date. Share with sales managers 24 hours before pipeline review."
**Why it works:** Activity gaps are leading indicators of stalled deals. Surfacing them before the pipeline call gives managers the context to coach rather than discover surprises live.
**Word count:** N/A — analysis prompt
**Avg. score:** 85-92

---

## Prompt 10 — ICP Fit Score Validation
**Role:** RevOps
**Trigger:** After an ICP refresh, or when win rates diverge sharply across segments
**Structure:** Resurface ICP criteria → backtest against won/lost deals → recalibrate scoring weights → push updated scores to CRM
**Example output:** "Re-run [ICP Fit Score] against the last 12 months of closed-won and closed-lost deals. Identify which scoring dimensions (company size, industry, tech stack match, geographic fit) have the highest correlation with close. Adjust dimension weights to reflect observed predictive power. Update all open opportunities and push new scores to [ICP Score] field."
**Why it works:** ICP scoring models drift silently as markets shift. Backtesting against real outcomes keeps scoring grounded in evidence rather than assumptions, improving AE prioritisation and SDR targeting.
**Word count:** N/A — analysis prompt
**Avg. score:** 83-91
