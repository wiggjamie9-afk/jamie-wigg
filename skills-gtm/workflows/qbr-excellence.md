---
id: gtm-workflows-qbr-excellence
name: "QBR Excellence"
description: "A structured quarterly business review process that moves from raw usage data to an executive-aligned narrative that proves realized value, surfaces risk early, and opens the door to expansion — all within a single meeti…"
category: marketing
group: workflows
subcategory: workflows
risk: none
license: MIT
tags: ["go-to-market", "workflow", "workflows"]
---
# Workflow: QBR Excellence

## Purpose
A structured quarterly business review process that moves from raw usage data to an executive-aligned narrative that proves realized value, surfaces risk early, and opens the door to expansion — all within a single meeting. Owned by the Customer Success Manager, with support from the AE for commercial conversations and the SE for technical validation. Designed for accounts with a meaningful footprint: enterprise or growth-tier customers with an active exec sponsor. Not templates — starting points.

## Stages at a glance
1. Data Pull → extract the right metrics before building a single slide
2. Value-Realized Narrative → translate usage data into business outcomes
3. Risk Surfacing → identify and triage adoption gaps and relationship red flags
4. Exec Alignment → present to the right audience with the right framing
5. Expansion Tee-Up → create the natural transition from value proven to more scope
6. Success Plan → agree on the next 90 days in writing before the call ends

---

## Stage 1 — Data Pull
**Owner:** CSM
**Goal:** Collect the raw materials — product usage data, support history, health scores, NPS/CSAT, business metrics the customer cares about — before any narrative is built
**Exit criteria:** Data is assembled and reviewed; anomalies (spikes, drops, unused features) are flagged for interpretation; a list of open items from the last QBR (if applicable) is ready
**Pull from:** `roles/customer-success/qbr-preparation.md`, `roles/customer-success/churn-risk.md`

**Prompt:**
> Complete this data pull at least one week before the QBR:
>
> Product usage:
> - Which features are heavily used vs. underused vs. not adopted at all?
> - How does usage compare to the benchmark for similar accounts?
> - What changed quarter-over-quarter — growth, decline, or flat?
> - Which users are active? Which licensed seats are dark?
>
> Support history:
> - How many tickets were opened this quarter? What were the top categories?
> - Were there any P1/P2 incidents? Were they resolved to the customer's satisfaction?
> - Any open tickets at the time of QBR prep?
>
> Business metrics (from original deal and success plan):
> - What metrics did they say they would use to judge success?
> - What is the actual result against those metrics?
>
> Relationship health:
> - NPS or CSAT score this quarter vs. last
> - Champion engagement level (meeting cadence, responsiveness)
> - Any executive turnover or team restructuring?
>
> Red flags to investigate before the meeting:
> - Any drop in usage over 20% month-over-month
> - Champion non-responsive for more than 3 weeks
> - Ticket volume spike without resolution
> - Renewal date within 120 days with no expansion motion started

**Why it works:** Building narrative on top of unreviewed data produces surprises in the room. A week of lead time lets the CSM investigate anomalies and build answers before the customer asks the question.

---

## Stage 2 — Value-Realized Narrative
**Owner:** CSM
**Goal:** Translate raw usage data into a story about business outcomes — in the language the customer's executive used when they bought
**Exit criteria:** The QBR deck or document has a clear "value realized" section that references the customer's own success metrics, not generic product KPIs
**Pull from:** `roles/customer-success/qbr-preparation.md`, `roles/account-executive/roi-model.md`

**Prompt:**
> Build the value-realized narrative using this three-layer structure:
>
> Layer 1 — What they bought (context):
> "At the start of this engagement, [Company] identified [Pain 1] and [Pain 2] as the priorities. The goal was to [Outcome] within [Timeframe]."
>
> Layer 2 — What happened (data):
> "Here's what we've seen this quarter:
> - [Usage metric] is at [X], up/down [Y%] from last quarter.
> - [Business metric they care about] has moved from [baseline] to [current], representing [$ or % improvement].
> - [Feature] has been adopted by [X% of the team / X named users]."
>
> Layer 3 — What it means (so what):
> "Based on these results, you've [realized value X]. That translates to approximately [$ saved / revenue generated / time recovered] this quarter."
>
> If the data is mixed — some metrics up, some flat or down — do not hide it. Frame it: "Here's where we're on track, here's where we're not, and here's the plan to close the gap."
>
> Ask yourself before finalizing: "Could the customer's executive read this section and immediately understand what value they got for their money?" If the answer is no, rewrite it.

**Why it works:** Executives don't attend QBRs to see dashboards — they attend to validate a decision they made. A value narrative tied to their original success metrics confirms they made the right call and makes the renewal conversation easy.

---

## Stage 3 — Risk Surfacing
**Owner:** CSM
**Goal:** Identify and triage all risks — adoption gaps, relationship red flags, competitive threats, renewal friction — so they can be addressed proactively rather than reactively at renewal
**Exit criteria:** All risks scored by severity and owner; a remediation action for each high-severity risk is documented; the CSM has a plan for how (or whether) to raise each risk in the QBR meeting itself
**Pull from:** `roles/customer-success/churn-risk.md`, `roles/customer-success/churn-risk.md`

**Prompt:**
> Score each risk on two dimensions: severity (1-3) and your confidence that you can fix it (high/medium/low).
>
> Adoption risk:
> - Which licensed capabilities have less than 30% usage? Is there a reason (training gap, UX friction, wrong persona)?
> - Which user groups are not active? Is it because they haven't been onboarded or because the use case doesn't apply?
>
> Relationship risk:
> - Is your champion still in their role and engaged?
> - Do you have relationships with at least two other stakeholders who could advocate if the champion leaves?
> - Has anyone on their side mentioned a competitor, a re-evaluation, or a budget freeze?
>
> Renewal risk:
> - When does the contract renew?
> - Has budget been reconfirmed for the next term?
> - Are there open commercial disputes (billing, overage, SLA credits)?
>
> For each high-severity risk, document:
> 1. What is the risk?
> 2. What is the early signal you're seeing?
> 3. What is your remediation plan?
> 4. Will you surface this in the QBR or handle it separately?
>
> Rule: do not hide a risk from a customer executive that they will discover on their own. Surface it yourself, with a plan. Being the person who names the problem and owns the fix builds more trust than being the person who appears surprised when they raise it.

**Why it works:** Proactive risk surfacing is one of the most differentiated behaviors a CSM can demonstrate. It signals that you are running toward problems rather than away from them — which is exactly what a trusted advisor does.

---

## Stage 4 — Exec Alignment
**Owner:** CSM (with AE for commercial topics)
**Goal:** Present the QBR to the economic buyer or exec sponsor — not just the day-to-day champion — with a framing that confirms the business value and earns continued executive sponsorship
**Exit criteria:** Exec sponsor has attended or been briefed on QBR outcomes; they have acknowledged value realized; any exec-level concerns are documented
**Pull from:** `roles/customer-success/qbr-preparation.md`, `roles/account-executive/close-strategies.md`

**Prompt:**
> Prepare for the exec-level portion of the QBR by answering:
> 1. What does the exec care about most: revenue growth, cost efficiency, risk reduction, or competitive positioning?
> 2. Which data point in the QBR directly maps to that priority?
> 3. What is the one thing you want the exec to believe, commit to, or approve by the end of the meeting?
>
> Exec-focused agenda (max 30 minutes of exec time):
> - [5 min] Value realized: "Here is the impact this quarter in your terms."
> - [10 min] What's working, what's not: "Here is where we are strong and where we are working to improve."
> - [10 min] Strategic alignment: "We want to understand your priorities for the next 6-12 months so we can make sure we're focused on the right things."
> - [5 min] Forward commitments: "Here is what we are committing to next quarter."
>
> Language for the exec opening:
> "Thank you for making time. I want to keep this focused on the things that matter most to you — business impact and where we're headed. My goal today is to show you the progress this quarter, be transparent about where we're still working, and align on priorities for the next 90 days."
>
> Do not fill exec time with product demos or feature announcements unless they ask.

**Why it works:** Executives who attend QBRs and leave feeling their time was well spent become internal champions for renewal and expansion. Executives who feel they sat through a product update become obstacles.

---

## Stage 5 — Expansion Tee-Up
**Owner:** CSM (with AE leading commercial conversation)
**Goal:** Create a natural, credibility-backed transition from "here's the value you've realized" to "here's how you could realize more" — without it feeling like an upsell ambush
**Exit criteria:** At least one expansion opportunity is documented with a named stakeholder who has expressed interest; a follow-on conversation is scheduled
**Pull from:** `roles/customer-success/expansion-plays.md`, `roles/account-executive/discovery-prep.md`

**Prompt:**
> Time the expansion conversation for after the value-realized section — never before.
>
> Natural expansion bridge:
> "Based on the results you've seen in [use case 1], I want to flag something we see often with customers at this stage. [Use case 2 or department] typically sees similar gains — and you mentioned in [previous call / onboarding] that [adjacent team or problem] was on your radar. Is that still a priority?"
>
> Expansion discovery questions:
> "What would need to be true for you to extend [the program / the scope / the team footprint]?"
> "Is there a part of the business you haven't brought us into yet where you think the same problem exists?"
> "What would the impact be if [adjacent team] had the same capability your team has today?"
>
> If they express interest:
> "Great — let's schedule a separate 30-minute conversation with [AE name] to explore that specifically. I don't want to turn the QBR into a sales call, but I also don't want that to fall off the agenda."
>
> Do not price expansion in the QBR. Surface the interest, create the conversation, and hand it to the AE.

**Why it works:** Expansion teed up on the back of proven value converts at dramatically higher rates than cold upsell motions. The customer has just said "this worked" — making "more of this" the obvious next step rather than a pitch.

---

## Stage 6 — Success Plan
**Owner:** CSM
**Goal:** Leave the QBR with a written, agreed-upon success plan for the next 90 days — with named owners, target metrics, and a milestone to review at the next QBR
**Exit criteria:** Success plan is shared with champion (and exec sponsor if present); CSM and champion have both named their commitments; next QBR date is on the calendar
**Pull from:** `roles/customer-success/qbr-preparation.md`, `roles/customer-success/qbr-preparation.md`

**Prompt:**
> Build and present the 90-day success plan in the final 10 minutes of the QBR:
>
> Structure:
>
> What we're committing to (vendor side):
> - "[CSM name] will [specific action] by [date]."
> - "[SE name] will [specific action] by [date]."
>
> What we're asking from you (customer side):
> - "[Champion name] will [specific action] by [date]."
> - "[Stakeholder] will complete [onboarding / rollout / review] by [date]."
>
> How we'll measure success next quarter:
> - Metric 1: [Name] — current: [X] — target: [Y]
> - Metric 2: [Name] — current: [X] — target: [Y]
>
> Close with:
> "If we hit these targets next quarter, what does that unlock for you — is there a decision that becomes easier, a budget case that gets stronger, or a team rollout that becomes possible?"
>
> Book the next QBR before ending the call:
> "Let's put the next one on the calendar now — that way it's protected. Does [90 days from today] work?"

**Why it works:** A written success plan with mutual commitments prevents the QBR from becoming a feel-good meeting that produces no action. The "what does hitting this unlock" question seeds the next expansion conversation before the current quarter starts.

---

## Common failure modes

- **Running the QBR off usage dashboards instead of business outcomes.** Showing feature adoption charts to an exec without translating them to revenue, cost, or risk lands as "interesting data" rather than "clear value." Always layer the "so what" on top of the numbers.
- **Hiding risks to avoid an uncomfortable conversation.** A risk hidden in Q3 becomes a churn surprise in Q4. Customers who discover a problem you already knew about lose trust instantly. Surface it early, own it, bring a plan.
- **Not having exec attendance.** A QBR attended only by the day-to-day champion does not renew the executive's commitment to the partnership. The CSM should decline to run a full QBR without at least a 20-minute exec slot and instead schedule a targeted exec check-in separately.
- **Teeing up expansion before value is established.** An expansion conversation in the first 15 minutes of a QBR signals that you care more about revenue than their success. Save it for after the value-realized section — the sequencing is the entire foundation of the ask.
- **Leaving without a written success plan and a next QBR date.** A QBR that produces no written commitments is a meeting, not a process. The success plan is what turns a good conversation into accountability.
