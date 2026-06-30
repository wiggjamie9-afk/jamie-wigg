---
id: gtm-roles-sales-manager-forecasting
name: "Sales Manager Forecasting"
description: "A collection of prompts for Sales Managers preparing weekly forecast calls, rolling up team numbers, weighting deals, building scenario models, and presenting board-ready forecast narratives."
category: marketing
group: roles
subcategory: sales-manager
risk: none
license: MIT
tags: ["go-to-market", "role", "sales-manager"]
---
# Reference: Sales Manager Forecasting Prompts

## Purpose
A collection of prompts for Sales Managers preparing weekly forecast calls, rolling up team numbers, weighting deals, building scenario models, and presenting board-ready forecast narratives. Calibrated for managers who own a number and are accountable for forecast accuracy alongside revenue delivery — not just pipeline reporting. Each prompt is designed to produce a defensible, data-grounded call rather than an optimistic roll-up. Not templates — starting points.

---

## Prompt 01 — Weekly Forecast Roll-Up
**Role:** Sales Manager
**Trigger:** Preparing the Friday forecast submission to VP or CRO
**Structure:** Team deal list by category > close date > generate a structured roll-up narrative
**Example output:** "My team has: $340K in Commit (3 deals), $210K in Best Case (4 deals), $180K in Pipeline (6 deals). Q3 quota is $1.1M. Generate a weekly forecast narrative I can present to my VP — covering: (1) what I'm calling for the week and month, (2) what changed since last week, (3) the biggest risk to the number, and (4) the upside scenario if two Best Case deals close early."
**Why it works:** Structuring the narrative around change since last week forces the manager to actively track deal movement rather than reporting static totals — which is what VPs actually want to understand when they hear a forecast call.
**Word count:** Four-section narrative; max 250 words; specific dollar amounts in each section.
**Avg. score:** 86-93

---

## Prompt 02 — Deal Weighting Model
**Role:** Sales Manager
**Trigger:** Applying probability weights to a deal list that goes beyond CRM stage probabilities
**Structure:** Deal list > stage > qualitative signals > generate manager-adjusted probability weights
**Example output:** "CRM assigns 70% probability to Stage 4 deals. I have three Stage 4 deals: [Company A] where the champion is strong and legal is in flight (I believe 85%), [Company B] where we haven't met the economic buyer (I believe 45%), and [Company C] with a competitor re-entering (I believe 60%). Generate a weighted pipeline total with a brief rationale for each adjustment."
**Why it works:** Manager-adjusted weighting that departs from CRM stage probabilities is the single most accurate leading indicator of forecast outcome — it captures qualitative signals that a stage percentage can't.
**Word count:** Table with deal name, CRM weight, manager weight, rationale; total line at the bottom.
**Avg. score:** 84-92

---

## Prompt 03 — Three-Scenario Quarter Model
**Role:** Sales Manager
**Trigger:** Building a quarterly forecast with explicit upside and downside scenarios for leadership
**Structure:** Commit total > best case total > pipeline total > generate three-scenario model
**Example output:** "Q3 numbers: Commit $640K, Best Case $920K, Pipeline $1.4M. Quota is $1.1M. Build a three-scenario model — conservative (Commit only + 30% of Best Case), base (Commit + 60% of Best Case), and upside (Commit + 90% of Best Case + one pipeline pull-in) — with a narrative on what must be true for each scenario to land."
**Why it works:** Naming what must be true for each scenario makes the forecast falsifiable — leadership can track the conditions rather than just the number, which produces earlier warning when a scenario becomes unreachable.
**Word count:** Three-row table with scenario, dollar amount, and one-sentence condition; total 200 words.
**Avg. score:** 85-93

---

## Prompt 04 — Slip-Rate Adjustment
**Role:** Sales Manager
**Trigger:** Historical data shows your team's deals slip close dates at a predictable rate
**Structure:** Historical slip rate > current commit list > generate a slip-adjusted forecast
**Example output:** "Over the last 3 quarters, 22% of my team's Commit deals have slipped by an average of 18 days. My current Commit for Q3 close is $640K across 5 deals. Generate a slip-adjusted forecast that applies the 22% slip rate to produce a revised expected-close number for Q3 — and identify which of the five deals has the highest slip probability based on criteria I give you."
**Why it works:** Applying a historical slip rate to the current commit list is a simple but powerful correction that most managers skip — the result is a forecast that VPs trust because it accounts for known team behaviour rather than hoping for perfect execution.
**Word count:** Adjusted total with methodology note; ranked deal list by slip risk with one-line rationale each.
**Avg. score:** 84-91

---

## Prompt 05 — Call-the-Number Prompt
**Role:** Sales Manager
**Trigger:** Your VP asks "what's your number?" and you need to state a single figure with conviction
**Structure:** Deal landscape > your confidence level > generate a call-the-number statement with reasoning
**Example output:** "I have $640K in Commit and $280K in Best Case. My VP is going to ask me to call a number for Q3. I'm confident in four of my five Commit deals and one Best Case deal. Generate a statement I can make that names a single number with conviction, acknowledges the one Commit risk, and explains why I'm counting the Best Case deal — in under 60 seconds of spoken language."
**Why it works:** A call-the-number statement that names the risk explicitly is more credible than an unhedged number — managers who identify their own risk before being asked are perceived as trustworthy rather than optimistic.
**Word count:** Under 100 words; spoken-language pacing; one specific risk named; ends with the number.
**Avg. score:** 83-91

---

## Prompt 06 — Mid-Quarter Re-Forecast
**Role:** Sales Manager
**Trigger:** Six weeks into the quarter; original forecast is no longer achievable or has changed materially
**Structure:** Original call > current deal status > generate a re-forecast narrative for VP presentation
**Example output:** "I called $1.1M at the start of Q3. Two deals worth $180K slipped to Q4 and one $90K deal was lost to a competitor. I have one unexpected inbound deal at $95K now in late stage. Generate a re-forecast narrative: (1) what changed and why, (2) revised Q3 call ($860K), (3) what I'm doing to close the gap, and (4) what's now tracking for Q4."
**Why it works:** A re-forecast that leads with causation ("what changed and why") instead of just a revised number gives leadership the signal they need to determine whether this is a rep execution problem, a market problem, or a one-time event.
**Word count:** Four-section narrative; max 250 words; Q4 forward-look in the final section.
**Avg. score:** 85-92

---

## Prompt 07 — Board-Ready Forecast Narrative
**Role:** Sales Manager
**Trigger:** CRO or VP asks for a written forecast summary to share with the board or investors
**Structure:** Quarter > team quota > current call > generate a concise board-ready narrative
**Example output:** "Generate a one-page board-ready forecast narrative for Q3. Team quota: $1.1M. Current call: $990K (90% attainment). Commit: $640K, Best Case: $280K, Expected closes: $70K from pipeline. Include: executive summary sentence, deal composition summary, three key risks, two upside scenarios, and a one-line confidence statement from me as the Sales Manager."
**Why it works:** A board narrative needs to compress complexity into a form that supports fast, high-stakes decisions — a confidence statement from the accountable manager is what distinguishes a report from a commitment.
**Word count:** Five sections; max 350 words; no jargon; confidence statement under 25 words.
**Avg. score:** 84-92

---

## Prompt 08 — New Business vs. Renewal Forecast Split
**Role:** Sales Manager
**Trigger:** When quota includes both new business and renewal/expansion and the split matters for accuracy
**Structure:** New business pipeline > renewal pipeline > generate a split forecast with risk assessment
**Example output:** "My Q3 quota is $1.1M: $700K new business and $400K from renewals/expansion. New business is at 80% confidence ($565K). Renewals are at risk — one $120K account has a health score drop and hasn't engaged in 30 days. Generate a split forecast that separately calls new business and renewal numbers, with a risk scenario if the at-risk renewal churns."
**Why it works:** Blended forecasts hide renewal churn risk inside new business confidence — separating the two forces the manager to own both motions explicitly and gives CS teams the signal they need to intervene.
**Word count:** Two-column split (new business / renewal); churn scenario at the bottom; max 200 words.
**Avg. score:** 83-90

---

## Prompt 09 — Pipeline Coverage Projection
**Role:** Sales Manager
**Trigger:** Planning next quarter's pipeline build based on current quarter's conversion rates
**Structure:** Target quota > conversion rates by stage > current early-stage pipeline > generate coverage projection
**Example output:** "Q4 quota is $1.2M. My team converts: 25% of Discovery to Proposal, 55% of Proposal to Close. I currently have $800K in early-stage (Discovery and earlier) for Q4. Generate a pipeline coverage model showing how much total pipeline I need to source before end of Q3 to be at 3x coverage on quota — broken down by stage and by rep count."
**Why it works:** Pipeline coverage models built on actual conversion rates rather than assumed multipliers surface sourcing shortfalls six to eight weeks earlier — when there is still time to close the gap through prospecting.
**Word count:** Model in table format; sourcing shortfall in one summary sentence; per-rep target in the final row.
**Avg. score:** 86-93

---

## Prompt 10 — Forecast Variance Debrief
**Role:** Sales Manager
**Trigger:** End of quarter; actual results differ from your forecast call by more than 10%
**Structure:** Forecasted number > actual result > key deal variances > generate a debrief narrative
**Example output:** "I called $1.1M for Q3; we closed $890K — a $210K miss. Two Commit deals slipped: [Company A] delayed by procurement ($120K) and [Company B] lost to a competitor at the last minute ($90K). Generate a debrief narrative for my VP covering: what I called vs. actuals, root causes for each variance, process changes to improve forecast accuracy in Q4, and one structural change to our stage-exit criteria."
**Why it works:** A post-quarter debrief that proposes process changes (not just explanations) is what distinguishes a manager who learns from misses versus one who explains them — and it's the signal your VP uses to assess your credibility for next quarter's forecast.
**Word count:** Four-section narrative; max 300 words; process change must be specific and measurable.
**Avg. score:** 85-93
