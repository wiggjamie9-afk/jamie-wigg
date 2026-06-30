---
id: gtm-roles-sales-manager-pipeline-review
name: "Sales Manager Pipeline Review"
description: "A set of prompts for Sales Managers conducting deal inspections, stage-exit audits, and at-risk deal interventions during pipeline reviews."
category: marketing
group: roles
subcategory: sales-manager
risk: none
license: MIT
tags: ["go-to-market", "role", "sales-manager"]
---
# Reference: Sales Manager Pipeline Review Prompts

## Purpose
A set of prompts for Sales Managers conducting deal inspections, stage-exit audits, and at-risk deal interventions during pipeline reviews. Calibrated for weekly one-on-one and team pipeline calls where the goal is to surface deal reality rather than accept rep-reported status at face value. Each prompt is designed to cut through optimism bias and create precise, coachable conversations. Not templates — starting points.

---

## Prompt 01 — Deal Reality Check
**Role:** Sales Manager
**Trigger:** A rep marks a deal as Commit but supporting evidence is thin
**Structure:** Deal name > stage > rep's stated rationale > generate five inspection questions
**Example output:** "[Rep Name] has [Company] in Commit at $120K, close date end of month. Rationale is 'verbal yes from champion.' Generate five deal-inspection questions I should ask in tomorrow's pipeline review that test whether this is a genuine commit or a hope — focus on economic buyer access, legal status, and internal approval steps confirmed."
**Why it works:** Asking about economic buyer access, legal status, and confirmed internal steps is not pessimism — it's the difference between a deal that closes on time and one that slips with a week's notice.
**Word count:** Five questions; one per line; each under 20 words; no compound questions.
**Avg. score:** 85-93

---

## Prompt 02 — Stage-Exit Criteria Audit
**Role:** Sales Manager
**Trigger:** A deal has been sitting in the same stage for more than 14 days
**Structure:** Stage name > exit criteria for that stage > deal context > generate an audit checklist
**Example output:** "A deal at [Company] has been in 'Evaluation' for 22 days. Our stage-exit criteria for Evaluation requires: technical validation complete, economic buyer met, champion has confirmed internal approval process. Build an audit checklist I can use in a 10-minute pipeline call to determine which criteria are genuinely met versus assumed."
**Why it works:** Pairing stage-exit criteria against deal specifics forces the rep to articulate what has actually happened versus what they believe will happen — a distinction that predicts close probability more accurately than CRM stage alone.
**Word count:** Checklist with Y/N/partial for each criterion + one follow-up question per unmet item.
**Avg. score:** 84-92

---

## Prompt 03 — Slipped Deal Diagnosis
**Role:** Sales Manager
**Trigger:** A deal has pushed close date for the second or third time
**Structure:** Number of slips > original close date > stated reasons > generate root-cause diagnosis framework
**Example output:** "A $200K deal at [Company] has slipped twice — originally Q1, then Q2, now Q3. Stated reason both times was 'internal alignment.' Generate a root-cause diagnosis I can walk through with [Rep Name] to determine whether this is a champion problem, an economic buyer gap, a product-fit issue, or a genuine external delay — with a recommended action for each diagnosis."
**Why it works:** A deal that slips twice with the same stated reason is almost never experiencing the same root cause — surfacing the real constraint early in Q3 is the only way to avoid a third slip.
**Word count:** Four diagnosis categories; two to three lines each; recommended action at the bottom of each.
**Avg. score:** 86-93

---

## Prompt 04 — At-Risk Deal Triage
**Role:** Sales Manager
**Trigger:** Reviewing the full pipeline at the start of the week; identifying deals that need intervention
**Structure:** Pipeline summary > risk signals > generate a triage matrix
**Example output:** "I have 18 deals in my team's pipeline across Q3. Risk signals I'm seeing: three deals with no activity in 10+ days, two where the champion has gone quiet, one where procurement just added three new stakeholders. Generate a triage matrix ranking these by close-date proximity and intervention urgency, with a suggested action for each risk type."
**Why it works:** A triage matrix forces prioritisation when every deal feels urgent — managers who intervene in reverse order of urgency waste their limited coaching capacity on the wrong deals.
**Word count:** Matrix with deal-type, risk signal, urgency rank, and suggested action; max 8 rows.
**Avg. score:** 84-91

---

## Prompt 05 — Commit vs. Best Case Classification
**Role:** Sales Manager
**Trigger:** Preparing the weekly forecast call with your manager or VP
**Structure:** Deal list > rep-reported categories > generate reclassification criteria
**Example output:** "My team has six deals in Commit totalling $480K and four in Best Case totalling $220K for Q3. Generate a classification framework I can apply to each deal to determine whether Commit deals truly belong there — based on: signed order form or legal in flight, verbal C-suite confirmation, no outstanding technical blockers, and close date within 30 days."
**Why it works:** Most forecast inaccuracy originates from inconsistent commit classification; a repeatable four-criteria framework removes the subjectivity that makes roll-ups unreliable.
**Word count:** Four criteria with a brief definition each; application note at the end.
**Avg. score:** 83-91

---

## Prompt 06 — Champion Health Check
**Role:** Sales Manager
**Trigger:** A rep's champion has gone quiet or is no longer attending calls
**Structure:** Champion's role > recent activity drop-off > generate health-check questions for the rep
**Example output:** "[Company] deal: the champion, a VP of Sales, attended every call until two weeks ago and hasn't replied to two follow-ups. Deal is at $150K, 3 weeks to close date. Generate five questions I should ask [Rep Name] to diagnose whether the champion has lost internal support, been replaced, or is just busy — and the recovery action for each scenario."
**Why it works:** Champion disengagement is one of the highest-signal deal risks; catching it three weeks before close date is recoverable — catching it the week of close is not.
**Word count:** Five questions with a diagnostic label (e.g. "lost support," "busy period") and recovery action per scenario.
**Avg. score:** 85-92

---

## Prompt 07 — Multi-Deal Rep Pipeline Call Agenda
**Role:** Sales Manager
**Trigger:** Structuring a 30-minute weekly pipeline one-on-one with a rep carrying 8-12 deals
**Structure:** Rep's deal count > time available > generate a structured pipeline call agenda
**Example output:** "[Rep Name] has 11 active deals. We have 30 minutes. Generate a pipeline call agenda that spends no more than 3 minutes per deal, prioritises by close date and deal size, and leaves 5 minutes for coaching on the deal most likely to convert or most at risk. Include a pre-call prep prompt I can send the rep 24 hours in advance."
**Why it works:** Pre-call prep sent to the rep the day before transforms the pipeline call from a status update into a problem-solving session — the manager gets real data, not real-time CRM updates.
**Word count:** Agenda with time blocks; pre-call prep message under 60 words.
**Avg. score:** 82-89

---

## Prompt 08 — New Business vs. Expansion Mix Review
**Role:** Sales Manager
**Trigger:** Quarterly pipeline mix review; ensuring the right balance of new logos and expansion revenue
**Structure:** Current pipeline breakdown > target mix > generate review questions for the team
**Example output:** "My team's Q3 pipeline is 80% new business and 20% expansion, but our plan requires 60/40. Generate five pipeline review questions that help me understand whether this imbalance is a prospecting problem, a customer success handoff problem, or a rep prioritisation problem — and the leading indicator I should track differently for each."
**Why it works:** A pipeline mix imbalance has multiple root causes; diagnosing which one is driving the gap determines whether the fix is a prospecting push, a CS alignment conversation, or a rep coaching conversation.
**Word count:** Five questions with a root cause label and leading indicator for each.
**Avg. score:** 83-90

---

## Prompt 09 — Deal-Specific Next-Step Accountability Check
**Role:** Sales Manager
**Trigger:** Reviewing CRM notes and finding deals where the "next step" field is vague or missing a date
**Structure:** Vague next-step examples > generate accountability prompts for the pipeline call
**Example output:** "Three deals in my team's CRM have next steps logged as 'following up', 'waiting to hear back', and 'sent proposal.' Generate three prompts I can use in the pipeline call that convert each vague next step into a specific, date-anchored commitment — without making the rep feel interrogated."
**Why it works:** A next step without a date is a hope; a specific date with an owner is a commitment — and the difference shows up directly in forecast accuracy within one quarter of consistent enforcement.
**Word count:** Three prompts, one per deal type; each under 30 words; conversational tone.
**Avg. score:** 82-89

---

## Prompt 10 — Pipeline Gap vs. Quota Analysis
**Role:** Sales Manager
**Trigger:** Mid-quarter; assessing whether current pipeline coverage is sufficient to hit the team's number
**Structure:** Team quota > current pipeline total > weighted pipeline > generate coverage gap narrative
**Example output:** "My team's Q3 quota is $1.2M. Total pipeline is $3.1M but weighted pipeline (by stage probability) is $890K. Generate a coverage gap analysis that tells me: how much additional pipeline I need to source before month two ends to hit quota, broken down by rep assuming an even split, and which stage has the highest pipeline concentration risk."
**Why it works:** Weighted pipeline is the honest number; most teams manage to total pipeline and then scramble in the last two weeks — the coverage gap analysis makes the shortfall visible in time to act.
**Word count:** Gap calculation in four lines; per-rep breakdown in a short table; risk narrative under 60 words.
**Avg. score:** 87-94
