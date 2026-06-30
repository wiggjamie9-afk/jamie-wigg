# Reference: RevOps Attribution Prompts

## Purpose
A collection of analytical prompts for RevOps teams navigating channel attribution, pipeline source definitions, and marketing/sales data reconciliation. Helps establish a defensible, agreed-upon source of truth for where pipeline and revenue come from. Calibrated for teams with a marketing automation platform feeding a CRM. Not templates — starting points.

---

## Prompt 01 — First-Touch vs Multi-Touch Framing Memo
**Role:** RevOps
**Trigger:** Attribution model debate between Marketing and Sales leadership
**Structure:** State the question → define each model → list what each incentivises → recommend with rationale → get sign-off
**Example output:** "First-touch attributes 100% of pipeline credit to the initial source — good for measuring awareness spend. Multi-touch (W-shaped or linear) distributes credit across all influencing touchpoints — better for optimising the full funnel. Recommend W-shaped for pipeline reporting (40/20/40 to first, middle, last) and first-touch only for top-of-funnel channel effectiveness. Document definitions in the RevOps wiki and freeze for one fiscal year."
**Why it works:** Mixing attribution models within the same report is the most common source of Marketing vs Sales argument. A written, time-locked definition removes the recurring debate and lets both teams optimise to the same number.
**Word count:** N/A — analysis prompt
**Avg. score:** 84-92

---

## Prompt 02 — Pipeline Source Definition Audit
**Role:** RevOps
**Trigger:** Before a new fiscal year, or when 'Other' is a top pipeline source
**Structure:** Pull distinct values in [Lead Source] and [Opportunity Source] fields → identify duplicates/ambiguities → propose canonical list → get Marketing and Sales sign-off
**Example output:** "Current [Lead Source] field has 34 distinct values including 'Website', 'Web', 'web form', and 'Organic Web'. Consolidate to a canonical list of 12 values with definitions. Map legacy values to canonical equivalents. Freeze the picklist and enforce via validation rule. Document in the attribution dictionary."
**Why it works:** Source field entropy is a hidden attribution killer. When the same channel has five spellings, dashboards are meaningless and every conversation about channel ROI is contested.
**Word count:** N/A — analysis prompt
**Avg. score:** 86-93

---

## Prompt 03 — Marketing-Sourced vs Marketing-Influenced Split
**Role:** RevOps
**Trigger:** Board prep, marketing QBR, or budget planning
**Structure:** Define sourced (Marketing created) vs influenced (Marketing touched before close) → query both → report split → include in pipeline dashboard
**Example output:** "Define Marketing-Sourced as: first touch = any Marketing channel AND no prior Sales activity. Define Marketing-Influenced as: any Marketing touch between creation and close, regardless of source. Last quarter: Marketing-Sourced = $1.2M pipeline (22% of total); Marketing-Influenced = $3.4M pipeline (62% of total). Both metrics belong in the board deck — sourced for accountability, influenced for budget case."
**Why it works:** Reporting only one metric consistently under-sells or over-sells Marketing's contribution. Showing both with clear definitions gives leadership an accurate picture without the politics.
**Word count:** N/A — analysis prompt
**Avg. score:** 83-91

---

## Prompt 04 — Channel ROI Interrogation Framework
**Role:** RevOps
**Trigger:** Quarterly channel spend review or budget reallocation conversation
**Structure:** List channels → attach pipeline created and pipeline closed-won → calculate cost-per-opportunity and cost-per-dollar-won → rank → recommend cuts and increases
**Example output:** "Pull spend, pipeline created, and pipeline closed-won by channel for the last two quarters. Calculate: (a) Cost per Opportunity Created, (b) Cost per $1 Closed-Won ARR. Rank channels by (b). Flag any channel where cost per $1 closed-won exceeds $0.35 (target CAC ratio) for review. Recommend reallocating 20% of lowest-performing channel budget to the top two performers."
**Why it works:** Most channel ROI reviews stop at cost-per-lead. Tracing through to closed-won ARR (even with attribution caveats) exposes channels that generate cheap leads that never close — a pattern invisible in top-of-funnel metrics alone.
**Word count:** N/A — analysis prompt
**Avg. score:** 87-94

---

## Prompt 05 — Sales-Sourced Pipeline Accuracy Check
**Role:** RevOps
**Trigger:** When AEs are over-attributing to Outbound to hit activity KPIs
**Structure:** Sample recent Outbound-sourced opps → verify against actual first activity → recategorise misattributed deals → update source of truth
**Example output:** "Random-sample 20 opportunities marked [Source = Outbound — AE] created in the last 90 days. For each, check: Was there a prior inbound web visit, content download, or Marketing email open within 30 days before AE contact? If yes, reclassify as Marketing-Influenced — AE Outbound. Estimated misattribution rate in last sample: 28%."
**Why it works:** Self-reported source data has an inherent bias toward whichever team benefits from the attribution. Spot-checking with system-of-record data (marketing automation timestamps) provides a corrective signal without requiring a full forensic audit.
**Word count:** N/A — analysis prompt
**Avg. score:** 82-90

---

## Prompt 06 — Partner-Sourced vs Partner-Influenced Definition
**Role:** RevOps
**Trigger:** Launching or scaling a channel/partner program
**Structure:** Define sourced (partner introduced) vs influenced (partner engaged post-creation) → design [Partner] fields in CRM → document in partner operations playbook
**Example output:** "Partner-Sourced: [Partner Account] is populated AND partner logged a deal-reg before any direct Sales contact. Partner-Influenced: partner engaged in the deal (co-sell activity logged) but deal originated from another source. Create two separate fields — [Partner Source] and [Partner Influence] — to avoid overloading a single field and losing signal."
**Why it works:** Partners hate being categorised as 'influenced' when they believe they sourced the deal. Clean definitions set expectations up front and reduce partner disputes at commission time.
**Word count:** N/A — analysis prompt
**Avg. score:** 84-91

---

## Prompt 07 — Attribution Dictionary Template
**Role:** RevOps
**Trigger:** Onboarding a new marketing ops or RevOps hire, or after any CRM rebuild
**Structure:** One row per source value → columns: canonical name, definition, who can assign, how it's set (manual/automated), examples, examples of what it is NOT
**Example output:** "Row example — Canonical: 'Outbound — SDR'. Definition: First human contact was an SDR-initiated cold sequence (email, call, or LinkedIn). Assigned by: SDR, confirmed by RevOps automation. Set: Automatically from sequence tool → CRM sync. Examples: Outreach sequence reply, cold call booked. NOT: Reply to a nurture email the SDR forwarded manually; warm intro from an investor."
**Why it works:** Edge cases erode definitions over time. The 'NOT' column is the most valuable part — it forces the team to think through ambiguity before it becomes a dispute.
**Word count:** N/A — analysis prompt
**Avg. score:** 80-88

---

## Prompt 08 — Inbound Lead Source Reconciliation (CRM vs MAP)
**Role:** RevOps
**Trigger:** When CRM pipeline source data and marketing automation platform reports don't match
**Structure:** Pull lead source from both systems → join on email/contact ID → identify discrepancies → document root cause → fix sync logic
**Example output:** "Export lead source from [HubSpot] and [Salesforce] for all leads created in Q2. Join on email address. Flag records where source differs. Most common discrepancy: leads converted by SDRs are overwriting MAP source with 'SDR Outbound' at conversion. Fix: preserve MAP source in a separate [Original Lead Source] field on the Contact; SDR attribution goes in [Last Touch Source]."
**Why it works:** CRM and MAP systems have different moments of source capture — the discrepancy is almost always architectural, not a data entry problem. Identifying the root cause prevents recurring reconciliation work.
**Word count:** N/A — analysis prompt
**Avg. score:** 85-93

---

## Prompt 09 — Time-to-Pipeline by Source Analysis
**Role:** RevOps
**Trigger:** Demand generation strategy review or content investment decision
**Structure:** For each source, calculate median days from first touch to opportunity creation → compare across sources → use to inform nurture sequencing and SDR follow-up SLAs
**Example output:** "Median days from first touch to opportunity creation by source: Webinar — 12 days; Content Download — 31 days; Cold Outbound — 4 days; Event — 19 days; Referral — 7 days. Adjust SDR follow-up SLA accordingly: Webinar leads get a 48-hour SLA; Content leads get 5-day nurture before SDR touches."
**Why it works:** Source quality isn't just about conversion rate — it's about velocity. A source that converts at 8% but takes 90 days may be less valuable than one that converts at 4% in 10 days, depending on the business's cash position and runway.
**Word count:** N/A — analysis prompt
**Avg. score:** 83-90

---

## Prompt 10 — Attribution Reporting Cadence Design
**Role:** RevOps
**Trigger:** Building or rebuilding the RevOps reporting stack
**Structure:** Define audience → define metric set per audience → set refresh cadence → name the owner → document in RevOps wiki
**Example output:** "Weekly (Sales leadership): Pipeline created by source this week vs. last week vs. goal. Monthly (Marketing leadership): Pipeline created and pipeline closed-won by source vs. plan; CAC by channel. Quarterly (Board/CEO): Marketing-sourced % of total ARR, channel ROI ranking, source mix shift YoY. Owner: RevOps Analyst. All reports auto-refresh from [Salesforce + HubSpot]; no manual pulls."
**Why it works:** Attribution disputes are often reporting cadence problems in disguise — when different stakeholders pull data at different times using different definitions, they reach different conclusions. A single reporting schedule with a named owner collapses the surface area for disagreement.
**Word count:** N/A — analysis prompt
**Avg. score:** 82-90
