---
id: gtm-workflows-demo-to-proposal
name: "Demo to Proposal"
description: "The mid-funnel motion from demo preparation through a stakeholder-aligned proposal that the champion can carry to the economic buyer unassisted. Owned jointly by AE and SE: the AE owns narrative and qualification;"
category: marketing
group: workflows
subcategory: workflows
risk: none
license: MIT
tags: ["go-to-market", "workflow", "workflows"]
---
# Workflow: Demo to Proposal

## Purpose
The mid-funnel motion from demo preparation through a stakeholder-aligned proposal that the champion can carry to the economic buyer unassisted. Owned jointly by AE and SE: the AE owns narrative and qualification; the SE owns technical credibility and proof. Every stage is gated to prevent proposals going out before the deal is ready for them. Not templates — starting points.

## Stages at a glance
1. Demo Tee-Up → confirm pain, set agenda, earn the right to present
2. Tailored Demo → show the fix for their specific problem, not a feature tour
3. Trial Close → surface objections while you still have the room
4. Mutual Action Plan → turn verbal interest into a documented path to decision
5. Proposal & ROI → deliver a co-authored business case, not a PDF
6. Stakeholder Alignment → get all decision-relevant parties to the same page

---

## Stage 1 — Demo Tee-Up
**Owner:** AE
**Goal:** Enter the demo with a confirmed pain hypothesis, a discovery-validated audience, and an agreed agenda — so the demo does not become a cold pitch to someone who does not yet understand why they are watching
**Exit criteria:** Pain confirmed in writing (recap email or agenda doc); all relevant attendees confirmed; SE briefed on which two capabilities to lead with
**Pull from:** `roles/account-executive/discovery-prep.md`, `roles/account-executive/demo-customisation.md`

**Prompt:**
> Complete this tee-up brief 24 hours before the demo:
>
> 1. Confirmed pain: What specific problems did they name in discovery? (Use their exact words.)
> 2. Demo agenda (send to prospect): "In our session on [date], I'd like to spend about 5 minutes recapping what we discussed, then show you specifically how [Company] addresses [Pain 1] and [Pain 2]. After that I'll leave time for your questions and — if it makes sense — we'll agree on next steps. Does that work?"
> 3. SE brief:
>    - Pain 1 → which product capability addresses it → what's the "aha" moment?
>    - Pain 2 → same structure
>    - Which customer proof point matches their industry or scenario?
>    - What technical objections should we anticipate?
> 4. Audience check: Does everyone attending have context? If someone new is joining, what do they know and what do they need before walking in?

**Why it works:** A demo without a tee-up is a product tour. The tee-up brief forces the AE and SE to align on narrative before the call — reducing demo drift and ensuring the prospect sees relevance from the first minute.

---

## Stage 2 — Tailored Demo
**Owner:** SE (AE narrates context, SE handles product)
**Goal:** Prove that the product solves the specific pains uncovered in discovery — not a comprehensive feature walkthrough
**Exit criteria:** Prospect says (or implies) "this solves [problem]"; no unaddressed technical blockers remain; all three demo sections completed
**Pull from:** `roles/account-executive/demo-customisation.md`, `roles/account-executive/demo-customisation.md`

**Prompt:**
> Structure every demo in three acts:
>
> Act 1 — Before (2 min): Show their current painful reality.
> AE: "Let me set the stage for what [Company] typically sees in your situation — [describe their current friction in their words]. Sound familiar?"
>
> Act 2 — The Fix (15 min): Show only the two capabilities that directly solve their named pains. Narrate in their language, not product language.
> SE: "Here's how [product] handles [Pain 1]. Notice that [specific thing they care about] — this is what [Customer X in their industry] said saved them [metric]."
>
> Act 3 — Proof (5 min): Drop in a relevant customer result.
> AE: "A company in [their vertical] had the same problem you described. After [timeframe], they saw [specific, quantified result]. Here's what their [same title as prospect] said."
>
> At the 70% mark, pause for a trial close (see Stage 3).
>
> Close the demo with: "What you've seen today — does this match what you were hoping to see? What's missing?"
>
> Never end a demo without a live reaction question.

**Why it works:** The three-act structure mirrors storytelling: before (tension) → fix (resolution) → proof (social validation). Prospects remember stories; they forget feature lists.

---

## Stage 3 — Trial Close
**Owner:** AE
**Goal:** Surface objections — technical, commercial, political — while you still have the prospect's attention and can address them before they become email silence
**Exit criteria:** All material objections documented; prospect's interest level rated; a path to "yes" identified or disqualification triggered
**Pull from:** `roles/account-executive/close-strategies.md`, `roles/sdr-bdr/objection-handling.md`

**Prompt:**
> Run the trial close at the 70% mark of the demo (before the final proof section):
>
> Interest check:
> "On a scale of 1-10, how well does what you've seen so far address [Pain 1]? What would make it a 10?"
>
> Objection surfacing:
> "What questions or concerns do you have at this point — technical, commercial, or anything else?"
>
> Fit check:
> "If what you've seen continues to meet your needs, is there anything that would prevent this from moving forward?"
>
> After the demo ends, ask the forward question:
> "Based on today, what's your level of confidence that this could work for your team?"
>
> Categorize every objection into: (a) technical — pass to SE for follow-up, (b) commercial — price, contract, ROI — handle in the business case stage, (c) political — stakeholder, timing, competing priority — address in the mutual action plan.
>
> If the prospect scores below 7/10 after the trial close: "What's keeping this from being higher?" Do not proceed to proposal until you understand the gap.

**Why it works:** The 1-10 scoring technique is non-confrontational and elicits specific feedback. A vague "looks good" scores a 7 and immediately prompts a follow-up — forcing precision rather than politeness.

---

## Stage 4 — Mutual Action Plan
**Owner:** AE (champion co-authors)
**Goal:** Convert verbal interest into a shared, written document that maps every step between now and a signed contract — with owners, dates, and dependencies
**Exit criteria:** Champion has reviewed and agreed to the MAP; economic buyer's name and role are documented; each step has an owner and a date
**Pull from:** `roles/account-executive/close-strategies.md`, `methodologies/meddpicc.md`, `roles/account-executive/discovery-prep.md`

**Prompt:**
> Build the Mutual Action Plan with your champion — not for them.
>
> Open with: "I want to put together a simple plan that gets us from where we are today to a decision. Can we build that together?"
>
> MAP structure (fill in with champion):
>
> | Step | Owner | Target date | Dependencies |
> |---|---|---|---|
> | Internal champion review | [Their name] | [Date] | — |
> | Economic buyer intro call | [AE + EB name] | [Date] | Champion review complete |
> | Security / IT review | [Their IT contact] | [Date] | EB positive signal |
> | Legal / procurement | [Their procurement] | [Date] | Security cleared |
> | Proposal review | [AE + champion] | [Date] | — |
> | Contract execution | [Both] | [Target close date] | All above |
>
> Ask for each line item: "Who owns this on your side? What's a realistic date?"
>
> Share the MAP via a Google Doc or shared tool so both sides can see it and update it.
>
> Reference the MAP at every subsequent touchpoint: "We're on track for [step]. Are there any changes to the timeline on your end?"

**Why it works:** A MAP removes ambiguity about who does what next. Deals without MAPs die in the "we're reviewing internally" phase because no one knows whose court the ball is in.

---

## Stage 5 — Proposal & ROI
**Owner:** AE (with champion as co-author of the narrative)
**Goal:** Deliver a quantified business case — not a product brochure — that the champion can present to the economic buyer without you in the room and that makes the EB's yes easy
**Exit criteria:** Proposal includes quantified ROI; champion has reviewed and approved the narrative before it goes to the EB; proposal is not sent cold — it is presented
**Pull from:** `roles/account-executive/roi-model.md`, `roles/account-executive/roi-model.md`, `methodologies/meddpicc.md`

**Prompt:**
> Before writing the proposal, answer these with your champion:
>
> 1. What metric will the EB use to judge success? (Revenue impact? Cost reduction? Risk mitigation? Time saved?)
> 2. What is the current cost of the problem? (Use the number from discovery quantification.)
> 3. What is the expected outcome and in what timeframe?
> 4. What is the investment?
> 5. What is the payback period?
>
> Proposal structure (max 4 pages or 6 slides):
>
> Page 1 — Current state: "[Prospect] today is experiencing [pain], which costs approximately [$ or time] per [quarter/year]."
> Page 2 — Future state: "With [product], [Prospect] would [specific outcome] within [timeframe], translating to [value in their metric]."
> Page 3 — Investment & ROI: "[Tier] at [$]. Against the cost of inaction, payback is [X months]. At 12 months, net benefit is [$]."
> Page 4 — Success plan: "Here is what the first 90 days look like and what we will measure."
>
> Delivery rule: never email a proposal cold. Present it live in a call. "I'd love 20 minutes to walk you through this and answer any questions." A proposal presented is reviewed; a proposal emailed is ignored.

**Why it works:** Co-authoring the ROI narrative with the champion means they own it. When they present it to the EB, they are not reciting someone else's document — they are defending their own analysis.

---

## Stage 6 — Stakeholder Alignment
**Owner:** AE (with champion facilitating internal access)
**Goal:** Ensure all decision-relevant stakeholders — champion, economic buyer, technical evaluator, procurement — have seen what they need to see and have no remaining objections before close
**Exit criteria:** EB has had a direct conversation with AE; technical sign-off documented; procurement process mapped and underway; no stakeholder is operating on outdated or incorrect information
**Pull from:** `roles/account-executive/discovery-prep.md`, `roles/account-executive/close-strategies.md`, `methodologies/meddpicc.md`

**Prompt:**
> Run a stakeholder alignment check before pushing for close:
>
> For the economic buyer:
> "I'd love to spend 20 minutes with [EB name] to make sure any questions are answered directly. Can you help me get that time?"
>
> In the EB call, lead with business impact, not product:
> "Your team identified [Pain] as costing approximately [$ or time]. Based on what [champion] and [others] have validated, here's the outcome we're confident we can deliver and the timeline. My ask is simple: if the team feels we've covered all the bases, what would it take to get your sign-off by [target date]?"
>
> For technical stakeholders:
> "Has IT/security completed their review? Is there anything outstanding I can help accelerate?"
>
> For procurement:
> "Can you walk me through the steps and timeline for contract processing once we reach an agreement? I want to make sure we don't hit any surprises at the finish line."
>
> Alignment test — ask the champion:
> "If we had a vote today, who would vote yes, who would vote no, and who is undecided? Let's make sure no one is operating on wrong information."

**Why it works:** The "vote count" question forces the champion to confront the political reality of the deal. Deals that feel aligned but have a hidden detractor die in procurement. Surfacing this in Stage 6 — not Stage 7 — leaves time to address it.

---

## Common failure modes

- **Running a generic demo after weak discovery.** Without validated pain from discovery, the demo defaults to a product tour. Prospects nod politely and don't advance. The Stage 1 tee-up brief is the firewall — if you can't complete it, you need more discovery, not a demo.
- **Skipping the trial close.** Demos that end with "any questions?" produce polite silence. Objections that don't surface in Stage 3 become ghost deals in Stage 5.
- **Building the MAP alone.** A mutual action plan the prospect didn't co-author is just a wish list. Without their input on dates and owners, it has no accountability on their side.
- **Emailing the proposal cold.** A proposal sent without a live walkthrough is read in 45 seconds and forwarded (or not) with no context. Present it; don't email it.
- **Ignoring the EB until close.** If the economic buyer sees the proposal for the first time at contract stage, you have skipped Stage 6. Every surprise at signature is a deal you didn't fully qualify.
