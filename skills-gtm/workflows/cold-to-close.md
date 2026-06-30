---
id: gtm-workflows-cold-to-close
name: "Cold to Close"
description: "The full-funnel motion from first signal or ICP target through signed contract. Runs across SDR/BDR (top of funnel), AE (mid and late funnel), and SE (demo and technical validation)."
category: marketing
group: workflows
subcategory: workflows
risk: none
license: MIT
tags: ["go-to-market", "workflow", "workflows"]
---
# Workflow: Cold to Close

## Purpose
The full-funnel motion from first signal or ICP target through signed contract. Runs across SDR/BDR (top of funnel), AE (mid and late funnel), and SE (demo and technical validation). Each stage hands off cleanly to the next with documented exit criteria so nothing falls through the cracks. Not templates — starting points.

## Stages at a glance
1. Signal & Target → identify a high-fit, high-timing prospect
2. Cold Outreach → earn a reply and book the meeting
3. Discovery → uncover pain, impact, and decision landscape
4. Demo & Technical Validation → prove fit to the right people
5. Business Case → quantify value and build internal consensus
6. Negotiation → handle objections and align on terms
7. Close → drive a signed decision
8. Handoff → transfer context to CS without loss

---

## Stage 1 — Signal & Target
**Owner:** SDR/BDR or AE (self-sourced)
**Goal:** Build a short-list of accounts showing intent or change signals that indicate a buying window is open
**Exit criteria:** Account has a clear ICP fit score, at least one meaningful signal identified, and a named champion hypothesis
**Pull from:** `roles/sdr-bdr/cold-outreach.md`, `roles/revops/territory-design.md`

**Prompt:**
> You are building a target account list. For each account, answer:
> 1. ICP fit: Does this company match our firmographic sweet spot (industry, headcount, revenue band, tech stack)?
> 2. Signal: What event happened in the last 90 days — funding, exec hire, product launch, compliance deadline, competitor churn — that creates urgency?
> 3. Champion hypothesis: Who in this org likely owns the problem we solve? What is their probable pain?
> 4. Entry point: Who do we contact first — the champion, the economic buyer, or a coach?
>
> Output a one-row summary per account: [Company] | [Signal] | [Fit: H/M/L] | [First contact + title] | [Hypothesized pain].

**Why it works:** Forcing signal-plus-fit before any outreach prevents spray-and-pray sequences and gives reps a genuine reason to reach out rather than a generic pitch.

---

## Stage 2 — Cold Outreach
**Owner:** SDR/BDR
**Goal:** Earn a reply that converts to a booked discovery call
**Exit criteria:** Meeting confirmed on calendar with at least one decision-relevant stakeholder; pre-meeting brief sent to prospect
**Pull from:** `roles/sdr-bdr/cold-outreach.md`, `roles/sdr-bdr/objection-handling.md`

**Prompt:**
> Write a 3-touch cold outreach sequence (email, LinkedIn, email) for the following prospect.
>
> Context to inject:
> - Signal: [paste signal from Stage 1]
> - Hypothesized pain: [paste pain hypothesis]
> - One relevant proof point or customer story (same industry or same pain)
> - Our differentiator in one clause, not a feature list
>
> Constraints:
> - Email 1 subject line: under 8 words, no clickbait
> - Email 1 body: under 80 words, pattern-interrupt opener tied to their signal, one question CTA
> - LinkedIn touch: connection note or DM, under 40 words, no pitch
> - Email 3 (breakup): 3 sentences max, give them an easy out but leave a door open
>
> Finish each draft with: "What assumption am I making about their pain that could be wrong?"

**Why it works:** Building in a self-critique forces reps to stress-test their hypothesis before sending and naturally generates personalization checkpoints.

---

## Stage 3 — Discovery
**Owner:** AE (with SDR on intro call if two-step)
**Goal:** Understand the prospect's current state, desired future state, pain impact (quantified), initiative ownership, and decision process
**Exit criteria:** MEDDPICC fields populated to at least 70%; champion confirmed; a second stakeholder identified; recap email sent and acknowledged
**Pull from:** `methodologies/meddpicc.md`, `roles/account-executive/discovery-prep.md`, `roles/sdr-bdr/objection-handling.md`

**Prompt:**
> You are running a discovery call. Use the pain funnel below in sequence — do not pitch until you have answers to all four levels.
>
> Level 1 — Situation (what is):
> "Walk me through how your team currently handles [process we touch]. What does that look like day-to-day?"
>
> Level 2 — Problem (what hurts):
> "Where does that process break down? What are the moments that cost you the most time or cause the most friction?"
>
> Level 3 — Implication (why it matters):
> "When [problem they named] happens, what's the downstream effect — on revenue, headcount, customer experience, your own time?"
>
> Level 4 — Quantify (the number):
> "If you had to put a number on it — hours per week, deals lost, cost per incident — what would that be?"
>
> After each answer, reflect back what you heard and ask: "Is there anything I'm missing?"
>
> Close the call with: "Based on what you've shared, here's what I think we should do next — does that make sense to you?"

**Why it works:** The four-level funnel mirrors the Socratic method — prospects convince themselves of their own urgency rather than being told they have a problem.

---

## Stage 4 — Demo & Technical Validation
**Owner:** AE + SE
**Goal:** Show the prospect exactly how the product solves the specific pains uncovered in discovery — no generic walkthroughs
**Exit criteria:** Champion says "this solves [specific problem]"; technical objections documented; proof-of-concept scope agreed if required
**Pull from:** `roles/account-executive/demo-customisation.md`

**Prompt:**
> Before building the demo, answer these four questions:
> 1. What are the top two pains the prospect named in discovery?
> 2. Which two product capabilities directly address those pains?
> 3. What is the "before" state we will show first (their current painful reality)?
> 4. What is the single moment of "aha" we are building toward?
>
> Structure the demo as: Before → Friction → Our fix → Proof (customer result) → "Does this match what you were hoping to see?"
>
> At the 70% mark, pause and ask: "On a scale of 1-10, how well does what you've seen so far address [pain 1]? What would make it a 10?"
>
> Close with: "What would need to be true for this to move forward on your end?"

**Why it works:** The 1-10 trial close surfaces objections while you still have the prospect's attention and can address them in the room rather than in a follow-up email chain.

---

## Stage 5 — Business Case
**Owner:** AE (with champion as co-author)
**Goal:** Build a quantified ROI narrative that the champion can carry to the economic buyer without you in the room
**Exit criteria:** Economic buyer has reviewed the business case; a joint success metric is agreed; budget line identified or created
**Pull from:** `roles/account-executive/roi-model.md`, `methodologies/meddpicc.md`, `roles/account-executive/discovery-prep.md`

**Prompt:**
> Co-build a business case with your champion using this structure:
>
> 1. Current state cost:
>    "Based on what you told me — [X hours/week, Y deals lost, Z cost per incident] — the status quo is costing you approximately [$ or time figure] per [month/quarter/year]. Does that feel right?"
>
> 2. Future state value:
>    "Customers in your situation typically see [specific outcome] within [timeframe]. For you that would mean [translated to their metric]."
>
> 3. Investment:
>    "The investment is [range]. Against the cost of inaction, the payback period is roughly [X months]."
>
> 4. Risk of delay:
>    "Every quarter you stay in the current state, that's [cost of inaction per quarter]. What's the cost of a 90-day delay?"
>
> Then ask: "If you were presenting this to [economic buyer's name], what would they push back on? Let's build that answer now."

**Why it works:** Asking the champion to anticipate the EB's objections turns them into an internal coach who has already rehearsed the counter-arguments.

---

## Stage 6 — Negotiation
**Owner:** AE (with manager on significant deals)
**Goal:** Reach agreement on terms without eroding deal value or setting a bad precedent for expansion
**Exit criteria:** All redlines resolved; verbal agreement on price, timeline, and success metrics; legal/procurement process mapped
**Pull from:** `roles/account-executive/close-strategies.md`, `roles/sdr-bdr/objection-handling.md`

**Prompt:**
> You are entering negotiation. Before making any concession, work through these steps:
>
> 1. Identify the ask: "What specifically are they asking for — price, timeline, scope, terms?"
> 2. Diagnose the reason: Is this a budget constraint, a risk concern, a procurement reflex, or a test?
> 3. Trade, don't give: For every concession offered, name something you need in return (accelerated close, expanded seats, case study rights, shorter contract term for a higher rate).
>
> Use this language when pushed on price:
> "I want to get this done. Help me understand — is this a budget ceiling issue, or is it about the value you're seeing relative to the ask? Because those are two different conversations."
>
> When they ask for a discount without justification:
> "I can explore flexibility, but I need to bring something back to my team. If we move on price, can we agree to [close by X date / expand to Y seats / a public reference]?"

**Why it works:** Anchoring every concession to a reciprocal ask reframes negotiation as a trade rather than a capitulation, and preserves deal value for both sides.

---

## Stage 7 — Close
**Owner:** AE
**Goal:** Drive a signed decision — not a verbal yes that evaporates
**Exit criteria:** Contract executed; start date confirmed; kickoff call scheduled
**Pull from:** `roles/account-executive/close-strategies.md`

**Prompt:**
> You are at the close stage. Use the assumptive close sequence:
>
> 1. Summarize the agreed value: "We've aligned on [pain solved], [metric improved], and [timeline]. You've said this is a priority for Q[X]."
> 2. Remove the last friction: "What's the one thing still standing between us and getting this signed this week?"
> 3. Map the mechanics: "Walk me through what needs to happen on your side — legal review, procurement, e-sign — and let's put dates on each step."
> 4. Hold the date: "If we get you the final paperwork by [date], what's a realistic turnaround from your team?"
>
> If they stall, ask: "On a scale of 1-10, how confident are you that this moves forward? What's keeping it from a 10?"

**Why it works:** The mechanics question converts a vague "we'll move forward" into a concrete mutual action plan with named owners and dates — the single biggest predictor of close.

---

## Stage 8 — Handoff to Customer Success
**Owner:** AE → CSM
**Goal:** Transfer the full context of the deal — pain, success metrics, stakeholder map, political landscape — so CS can deliver value from day one
**Exit criteria:** CS kickoff call completed with champion; success plan drafted and shared; AE no longer primary contact
**Pull from:** `roles/customer-success/qbr-preparation.md`

**Prompt:**
> Complete this handoff brief before the internal CS handoff call:
>
> 1. Champion: [Name, title, what they care about personally]
> 2. Economic buyer: [Name, title, their stated success metric]
> 3. Why they bought: [Top 1-2 pains in their own words from discovery notes]
> 4. Agreed success metrics: [The specific numbers they will use to judge success at 90/180 days]
> 5. Land scope: [Exactly what was sold — seats, features, integrations]
> 6. Risks to watch: [Anything that could derail adoption — internal politics, competing projects, low champion authority]
> 7. Expansion signals: [What they mentioned wanting "later" that wasn't in the initial scope]
>
> In the joint AE + CSM + champion kickoff call, AE closes with: "I'm handing you to [CSM name] who is the best person to get you to [success metric]. I'll stay available, but [CSM] is your primary from here."

**Why it works:** The explicit warm introduction from the AE — naming the CSM in front of the champion — transfers trust rather than just transferring a ticket number.

---

## Common failure modes

- **Skipping Stage 1 signals and blasting ICP-fit-only lists.** Fit without timing is a cold account. Reps who skip signal research get low reply rates and book meetings with people who have no active initiative.
- **Treating Stage 3 as a features conversation.** Discovery that stays at the situation level and never reaches quantified implication gives you no business case material and no urgency to reference at close.
- **Running Stage 4 (demo) without a tee-up.** Demos presented before the prospect understands why they are watching them are product tours, not sales tools. The rep controls the narrative; the prospect controls the agenda.
- **Building the Stage 5 business case alone.** A business case the champion didn't co-author is one they cannot defend. If you write it for them, it dies in their inbox.
- **No mutual action plan in Stage 7.** A verbal close with no mechanics conversation will slip the quarter. "Let's move forward" is not a close date.
