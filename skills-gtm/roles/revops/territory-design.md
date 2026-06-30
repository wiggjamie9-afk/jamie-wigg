---
id: gtm-roles-revops-territory-design
name: "RevOps Territory Design"
description: "A collection of analytical prompts for RevOps and Sales Operations practitioners designing or redesigning sales territories."
category: marketing
group: roles
subcategory: revops
risk: none
license: MIT
tags: ["go-to-market", "role", "revops"]
---
# Reference: RevOps Territory Design Prompts

## Purpose
A collection of analytical prompts for RevOps and Sales Operations practitioners designing or redesigning sales territories. Covers TAM segmentation, account scoring, balanced book construction, ramp-adjusted quota, and named-account carve-ups. Calibrated for B2B SaaS teams moving from a single-pool model to structured territory management. Not templates — starting points.

---

## Prompt 01 — TAM Segmentation Framework
**Role:** RevOps
**Trigger:** Ahead of a new fiscal year plan, new segment launch, or GTM model change
**Structure:** Define segmentation dimensions (firmographic, technographic, behavioural) → apply to total addressable account universe → output segment sizes and estimated ACV ranges → present to CRO
**Example output:** "Segment by employee count: Enterprise (1,000+), Mid-Market (100–999), SMB (10–99). Cross-cut by industry vertical (top 5 by historical win rate: SaaS, FinTech, Healthcare, Logistics, Manufacturing). Estimate segment TAM: Enterprise = 4,200 accounts globally, avg ACV $85K; Mid-Market = 31,000 accounts, avg ACV $22K; SMB = 140,000 accounts, avg ACV $6K."
**Why it works:** Segmentation only has value if it's connected to real account counts and realistic ACV — otherwise it's just a Venn diagram. Grounding in numbers forces resource allocation decisions.
**Word count:** N/A — analysis prompt
**Avg. score:** 85-93

---

## Prompt 02 — Account Scoring Model Design
**Role:** RevOps
**Trigger:** Before assigning accounts to new reps, or after a period of scattered ICP targeting
**Structure:** List scoring dimensions → assign weights → define scoring scale per dimension → validate against historical closed-won data → deploy to CRM
**Example output:** "Score accounts 0–100 on: Industry fit (25%), Employee count match (20%), Tech stack fit (20%), Funding/growth signals (15%), Geographic priority (10%), Prior engagement (10%). Validate: does score correlate with historical close rate? Target: accounts scoring 70+ should close at 2× the rate of accounts scoring below 50. Recalibrate weights until this holds in backtesting."
**Why it works:** Equal-weighting all dimensions is a common mistake. Backtesting against real outcomes reveals which dimensions actually predict close — usually a shorter list than the original model assumes.
**Word count:** N/A — analysis prompt
**Avg. score:** 84-92

---

## Prompt 03 — Balanced Book Construction
**Role:** RevOps
**Trigger:** Territory assignment exercise, new hire onboarding, or post-reorganisation
**Structure:** Define balance criteria (account score mix, account count, estimated ARR potential, geographic density) → run optimisation → output proposed books → validate with Sales leadership before locking
**Example output:** "Each Mid-Market AE book: 120–150 accounts, mix of 15% Tier 1 (score 80+), 45% Tier 2 (score 55–79), 40% Tier 3 (score below 55). Estimated ARR potential per book: $1.8M–$2.4M. Flag any book where Tier 1 count is below 12 or above 30 — rebalance before assignment. Present to VP Sales for review; lock books two weeks before quarter start."
**Why it works:** Imbalanced books create structural unfairness that compounds over time — reps in over-weighted territories hit quota easily and leave, reps in under-weighted territories churn for performance. Balance criteria made explicit are balance criteria that can be audited.
**Word count:** N/A — analysis prompt
**Avg. score:** 83-91

---

## Prompt 04 — Ramp-Adjusted Quota Model
**Role:** RevOps
**Trigger:** Hiring plan finalisation or compensation plan design cycle
**Structure:** Define ramp schedule → calculate expected attainment by month → set full-quota month → integrate into headcount plan and revenue model
**Example output:** "New AE ramp schedule: Month 1–2 (onboarding): 0% quota. Month 3: 25% of full quota ($25K ARR). Month 4: 50% ($50K). Month 5: 75% ($75K). Month 6+: 100% ($100K). Time-to-ramp target: 5 months. In the revenue model, new AE hired in Q1 contributes $150K ARR to Q1–Q4 plan (vs $400K for a fully ramped AE). Adjust headcount plan accordingly."
**Why it works:** Most revenue models assume new AEs contribute at full quota from hire date. Ramp-adjusted modelling prevents the CRO from presenting an achievable plan to the board that quietly depends on headcount that hasn't ramped yet.
**Word count:** N/A — analysis prompt
**Avg. score:** 86-93

---

## Prompt 05 — Named Account Carve-Up
**Role:** RevOps
**Trigger:** Enterprise segment launch, strategic account program design, or CRO request
**Structure:** Define named account criteria → build nomination process → assign ownership → document carve rules for off-list inbounds → review quarterly
**Example output:** "Named account criteria: (a) ARR potential over $150K AND (b) Fortune 1000 OR industry-specific strategic list. Total named accounts: 85. Assignment: 5 Enterprise AEs × 17 accounts each. Carve rule: if an inbound comes in from a named account and no AE is assigned yet, it goes to the named account AE pool manager; pool manager assigns within 24 hours. Review list quarterly — accounts that go 12 months with no activity revert to the general pool."
**Why it works:** Named account programs fail when the off-list inbound rule isn't defined — the first disputed inbound from a Fortune 500 company becomes a political incident that poisons the whole program.
**Word count:** N/A — analysis prompt
**Avg. score:** 84-92

---

## Prompt 06 — Geographic Territory Mapping
**Role:** RevOps
**Trigger:** Expanding into new regions, opening a second office, or splitting an over-loaded territory
**Structure:** Map accounts by geography → assess account density per region → define boundaries → assign AEs → document boundary edge cases
**Example output:** "Map all [Mid-Market] accounts by [Billing State/Country]. Identify density hotspots: California (18% of accounts), New York (14%), Texas (9%). Assign: CA-North + NV = Territory 1 (AE: [Name]); CA-South + AZ + NM = Territory 2; NY + NJ + CT = Territory 3; TX + remaining South = Territory 4. Edge case: accounts with HQ in one state and decision-maker in another follow the HQ state."
**Why it works:** Geographic territories without documented edge cases create disputes the moment a rep books a travel expense to a city nominally in another rep's territory. Writing the edge case rule up front eliminates the dispute category.
**Word count:** N/A — analysis prompt
**Avg. score:** 82-90

---

## Prompt 07 — Whitespace Analysis
**Role:** RevOps
**Trigger:** Pipeline generation review, SDR targeting sprint, or demand gen strategy session
**Structure:** Compare current account universe against ICP criteria → identify unworked ICP accounts → segment by score → assign to SDR campaigns or AE prospecting lists
**Example output:** "Of 4,200 Enterprise ICP accounts globally, 1,840 have never had a CRM record created (no lead, contact, or account). Of those, 420 score 75+ on our ICP model. These 420 are true whitespace — no relationship, high fit. Assign the top 100 (by score) to the SDR team as a Q3 prospecting priority. Create CRM accounts for all 420 now so SDRs can log activity against them."
**Why it works:** Whitespace that isn't in the CRM is whitespace that nobody owns — and therefore nobody prospects. Creating the records (even empty ones) is the minimal act that assigns ownership and enables tracking.
**Word count:** N/A — analysis prompt
**Avg. score:** 83-91

---

## Prompt 08 — Territory Change Impact Modelling
**Role:** RevOps
**Trigger:** Org restructure, rep departure, or territory rebalancing request
**Structure:** Model current state → model proposed change → calculate AE impact (won/lost accounts, ARR potential shift) → assess customer risk (relationship disruption) → present to Sales leadership with recommendation
**Example output:** "Proposed: move [Company A] and 14 associated accounts from AE [Name A] to AE [Name B] due to geographic consolidation. Impact on [Name A]: lose $340K ARR potential, gain 8 new whitespace accounts ($180K potential). Impact on [Name B]: add $340K potential but absorb 14 existing customer relationships mid-renewal cycle. Customer risk: 3 accounts are within 90 days of renewal. Recommend: hold the 3 renewal accounts with [Name A] through renewal, then transfer."
**Why it works:** Territory changes look clean on paper and messy in execution. Surfacing renewal timing as a specific risk — and proposing a timed exception — is more useful to a CRO than a generic 'it might disrupt customers' caveat.
**Word count:** N/A — analysis prompt
**Avg. score:** 85-92

---

## Prompt 09 — Quota-Setting Methodology Documentation
**Role:** RevOps
**Trigger:** Annual planning cycle or after a year of missed targets
**Structure:** Define inputs (historical attainment, territory potential, ramp status, market growth) → define the weighting model → show the output formula → document exceptions → present to CRO and CFO
**Example output:** "Quota inputs: (a) Bottom-up territory potential (40%), (b) Top-down company plan allocation (30%), (c) Historical attainment × growth factor (20%), (d) Market growth adjustment (10%). Formula output reviewed with each AE in advance of plan lock. Exception process: AE can request a territory potential review if they believe the scoring model materially understates their book; RevOps reviews within 5 business days."
**Why it works:** Reps accept hard quotas they don't like if the methodology is transparent and there's a fair exception process. Opaque quotas — even moderate ones — generate lasting distrust.
**Word count:** N/A — analysis prompt
**Avg. score:** 84-91

---

## Prompt 10 — Territory Review Cadence Design
**Role:** RevOps
**Trigger:** Setting up the annual RevOps operating calendar
**Structure:** Define review events → attach triggers → name owners → document outputs → set communication plan for AEs
**Example output:** "Annual: full territory redesign (Oct–Nov for Feb 1 go-live). Mid-year: light rebalance triggered if any AE book grows >25% or shrinks >25% from design assumption (RevOps reviews all books in August). Event-driven: rep departure triggers immediate temp-account redistribution (RevOps + VP Sales within 48 hours). All changes communicated to affected AEs with 2-week notice minimum except force-majeure (rep departure)."
**Why it works:** Territory design that happens once a year and never gets revisited becomes increasingly unfair as the market evolves. Embedding event-driven triggers alongside the annual cycle is what makes the design durable.
**Word count:** N/A — analysis prompt
**Avg. score:** 82-90
