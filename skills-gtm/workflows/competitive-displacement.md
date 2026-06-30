# Workflow: Competitive Displacement

## Purpose
The motion for replacing an incumbent vendor in an account where the prospect is already deployed on a competitor — not evaluating from a blank slate. Owned by the AE, with SE support for technical proof, and often initiated after a signal of incumbent dissatisfaction (support escalation, contract up for renewal, exec change, product miss). Every stage is designed to let the prospect talk themselves out of the status quo rather than being pushed — displacement that sticks comes from internal conviction, not external pressure. Not templates — starting points.

## Stages at a glance
1. Identify Incumbent Pain → confirm there is a real wound before applying the knife
2. Trap-Setting Questions → use questioning to expose the incumbent's structural weaknesses
3. Reframe → shift the evaluation criteria from the incumbent's strengths to yours
4. Switching-Cost & ROI Case → neutralize the "it's too hard to switch" objection with math
5. Land & Migrate Plan → make the transition feel inevitable and low-risk
6. Close & Lock → accelerate the decision before the incumbent can re-entrench

---

## Stage 1 — Identify Incumbent Pain
**Owner:** AE
**Goal:** Confirm that the account has a genuine, felt dissatisfaction with the incumbent — not just idle curiosity — before investing in a full displacement motion
**Exit criteria:** At least one specific, named pain with the incumbent surfaced; a champion identified who is actively motivated to change; timing signal confirmed (contract renewal, exec change, product miss, failed project)
**Pull from:** `roles/sdr-bdr/cold-outreach.md`, `roles/account-executive/discovery-prep.md`, `methodologies/meddpicc.md`

**Prompt:**
> Before engaging in a displacement motion, answer these qualification questions:
>
> 1. Signal: What is the specific event that suggests they might be open to switching? (Renewal within 6 months, public complaint on G2/LinkedIn, exec change, competitor's product miss or outage, support ticket escalation, failed implementation?)
>
> 2. Pain specificity: Is this a general dissatisfaction ("we've had some frustrations") or a specific, named failure ("we lost [outcome] because [incumbent] couldn't [specific capability]")? General dissatisfaction rarely produces displacement; specific failures do.
>
> 3. Champion motivation: Why does the internal champion want to switch — and what is at stake for them personally? A champion who is annoyed is different from a champion whose career is on the line.
>
> 4. Switching appetite: Has anyone in the account already raised switching internally, or is this the first conversation? Prior internal discussion dramatically reduces the education burden.
>
> 5. Incumbent entrenchment: How embedded is the incumbent — integrations, data migration, contract terms, organizational habit? Score entrenchment low/medium/high before choosing how aggressive to be with the displacement motion.
>
> If you cannot confirm a specific pain and a motivated champion, pause the motion and run a light discovery sequence rather than a full displacement play. Displacement motions are expensive; only start one when the signal is real.

**Why it works:** Pursuing displacement on vague dissatisfaction burns rep time and damages relationships when the prospect ultimately renews with the incumbent. Qualifying signal before building a displacement case protects pipeline integrity.

---

## Stage 2 — Trap-Setting Questions
**Owner:** AE (with research support from SDR or competitive intelligence)
**Goal:** Use Socratic questions to surface the incumbent's structural weaknesses without naming the incumbent directly — letting the prospect articulate the gap themselves
**Exit criteria:** Prospect has named at least one specific gap or failure that is structurally tied to the incumbent's architecture, roadmap, or business model — not a one-off service issue
**Pull from:** `roles/account-executive/discovery-prep.md`, `methodologies/challenger-sale.md`

**Prompt:**
> Trap-setting questions are designed around your known competitive advantages. Map each advantage to a question that surfaces the corresponding incumbent weakness.
>
> Framework: For each of our top 3 differentiators, write a question that makes the prospect evaluate whether the incumbent delivers on that dimension — without naming the incumbent.
>
> Example format:
> - Our differentiator: [real-time data processing]
> - Trap question: "How long does it currently take for an action in [workflow] to reflect in your reports? Is that fast enough for the decisions your team needs to make?"
>
> - Our differentiator: [open API / no vendor lock-in]
> - Trap question: "How easy has it been to connect [incumbent] to your other tools? Have you ever wanted to pull your data out or integrate something they don't natively support?"
>
> - Our differentiator: [pricing model / no per-seat tax]
> - Trap question: "As your team has grown, how has the cost changed? Has pricing ever been a conversation when you've wanted to expand adoption?"
>
> Rules:
> - Never name the incumbent in a trap question.
> - Ask only questions you know the answer to from competitive intelligence.
> - After they answer, reflect back: "That's interesting — is that something you've raised with [the team / your vendor]? What response did you get?"

**Why it works:** Prospects who name the gap themselves own the dissatisfaction. It is psychologically very different from being told "your current vendor is bad at X" — the former creates internal urgency, the latter creates defensiveness.

---

## Stage 3 — Reframe
**Owner:** AE
**Goal:** Shift the evaluation criteria from the incumbent's definition of success (which they are likely winning on) to a definition of success that reflects real business outcomes — and that your product is built to deliver
**Exit criteria:** Prospect is using at least one new evaluation criterion that did not exist in their original framework for choosing the incumbent; the incumbent's incumbent strengths are now re-categorized as table stakes or irrelevant
**Pull from:** `methodologies/challenger-sale.md`, `roles/account-executive/discovery-prep.md`

**Prompt:**
> The reframe has three moves:
>
> Move 1 — Validate the original decision:
> "When you chose [category of tool / solution] a few years ago, [incumbent's strength] was probably the right priority. That made sense at the time. What's changed in your business since then that might shift what you need?"
>
> (This disarms defensiveness — you are not saying they made a bad decision, you are saying the world has changed.)
>
> Move 2 — Introduce a new lens:
> "In the conversations we have with companies at your stage, the question that matters most has shifted from [old criterion] to [new criterion that we win on]. Is that a shift you're feeling too?"
>
> Move 3 — Reanchor the RFP / evaluation:
> "If you were starting from scratch today — knowing what you know now about where your team needs to be in 18 months — how would you frame the evaluation criteria?"
>
> After the reframe, send a one-page "Evaluation Framework" that formalizes the new criteria, weighted by what they said matters most. This document becomes the scorecard — and if it reflects your strengths, you are grading on a curve you designed.

**Why it works:** Displacement deals that fight on the incumbent's home turf lose. Reframing the evaluation is the single highest-leverage move in a competitive displacement — it changes the rules of the game before the scoring starts.

---

## Stage 4 — Switching-Cost & ROI Case
**Owner:** AE (with SE for technical migration scope)
**Goal:** Quantify the cost of staying with the incumbent versus the cost of switching, and prove that the switching cost is lower and faster to recover than the prospect assumes
**Exit criteria:** A written ROI and migration cost estimate exists; the prospect has reviewed it with their champion; "it's too hard to switch" is no longer the primary objection
**Pull from:** `roles/account-executive/roi-model.md`, `roles/account-executive/roi-model.md`, `methodologies/meddpicc.md`

**Prompt:**
> Structure the switching-cost conversation in three parts:
>
> Part 1 — Cost of staying:
> "Based on what you've described, staying with [the current solution] is costing you [quantified impact from discovery: revenue missed, hours lost, incidents caused]. Over 12 months, that's approximately [total]. That's the cost of inaction."
>
> Part 2 — Cost of switching (honest, not minimized):
> "A migration like this typically involves [data migration / retraining / integration re-work]. Based on similar customers, we estimate [X weeks / $Y in internal effort]. We want to be transparent about that — it's real work."
>
> Part 3 — Payback math:
> "If the cost of inaction is [$X per quarter] and the switching cost is [$Y one-time], the payback period is [Z months]. After that, every quarter you stay on the new platform is [$X] in recovered value. Does that math make sense to you?"
>
> Migration confidence builders:
> - Name 2-3 customers who displaced the same incumbent and the timeframe it took
> - Offer a migration package (scoped by SE), a dedicated migration engineer, or a phased rollout to reduce perceived risk
> - Provide a data portability guarantee in writing if contract terms allow
>
> If the prospect says "we're locked in contractually":
> "When does your current contract expire? If it's within [X months], the question is whether to invest in another evaluation now or wait — and the cost of waiting is [cost of inaction per month]. What would need to be true to start an evaluation now even before the renewal date?"

**Why it works:** Most prospects dramatically overestimate switching costs and underestimate the ongoing cost of a mediocre incumbent. Making both sides of the math visible — and concrete — reframes "too hard to switch" into "it pays back in six months."

---

## Stage 5 — Land & Migrate Plan
**Owner:** AE + SE
**Goal:** Design a phased migration plan that reduces perceived risk by starting small, proving value quickly, and building internal momentum before the full displacement is complete
**Exit criteria:** A phased plan exists with defined milestones; the champion has approved it; a success metric for the "land" phase is agreed before the full displacement begins
**Pull from:** `roles/account-executive/roi-model.md`, `roles/customer-success/qbr-preparation.md`, `roles/account-executive/close-strategies.md`

**Prompt:**
> Build a three-phase land-and-migrate plan with the champion:
>
> Phase 1 — Land (30-60 days):
> "We run a parallel deployment with one team or one use case. No disruption to the incumbent setup. Goal: demonstrate [specific metric] within [timeframe]. If we hit it, we proceed to Phase 2."
>
> Phase 2 — Expand (60-120 days):
> "Roll out to [broader team / additional use cases]. Begin decommissioning [specific incumbent capability] as each area is validated."
>
> Phase 3 — Displace (120-180 days):
> "Full cutover. [Incumbent] contract allowed to expire or terminated at renewal."
>
> With the champion, define:
> - The success metric for Phase 1 (what does "it works" look like?)
> - The owner of migration on their side
> - Who needs to be informed vs. who needs to approve each phase
> - The incumbent's contract end date and any notice-period requirements
>
> Present this plan to the economic buyer as a risk mitigation story:
> "We are not asking you to flip a switch. We are asking you to run a structured 60-day trial alongside your current setup, with a clear go/no-go checkpoint before any migration work begins."

**Why it works:** A phased plan converts "this is a massive risk" into "this is a 60-day test." Most displacement objections are about risk, not preference — reducing perceived risk at the point of decision is what converts intent into action.

---

## Stage 6 — Close & Lock
**Owner:** AE
**Goal:** Drive a signed displacement decision before the incumbent has a chance to re-entrench through relationship renewal, executive escalation, or a last-minute competitive concession
**Exit criteria:** Contract signed; Phase 1 kickoff date confirmed; AE has briefed CSM on the incumbent relationship dynamic and any re-entrenchment risks
**Pull from:** `roles/account-executive/close-strategies.md`, `roles/account-executive/close-strategies.md`, `roles/customer-success/qbr-preparation.md`

**Prompt:**
> Displacement close is time-sensitive — incumbents fight back when they sense they are losing an account. Accelerate the close using these techniques:
>
> Create urgency tied to their timeline, not yours:
> "Your incumbent contract renews on [date]. If we want to run Phase 1 and have results before that renewal window, we need to start by [date]. What would need to happen for us to get signatures by [date - 2 weeks]?"
>
> Anticipate the incumbent's counter-move:
> "It's common for incumbents to offer a significant discount or an executive relationship escalation when they sense a displacement. How would you evaluate that if it came in? Would a pricing concession from them change the core issues you identified — [specific capability gaps from discovery]?"
>
> (This inoculates the champion against the inevitable counter-offer by framing it as a pattern, not a value signal.)
>
> Lock with a mutual action plan:
> | Step | Owner | Date |
> |---|---|---|
> | Contract review | [Their legal] | [Date] |
> | Phase 1 scope sign-off | [Their champion] | [Date] |
> | Contract execution | Both | [Target date] |
> | Phase 1 kickoff | CSM + [their team] | [Date + 5 days] |
>
> Handoff brief to CSM must include:
> - Why they left the incumbent (specific failures in their own words)
> - The incumbent relationship owners on their side who may push back during migration
> - Any commitments made during the displacement motion (migration support, pricing, timelines)

**Why it works:** Inoculating against the incumbent counter-offer is the most underused technique in displacement selling. A champion who has already thought through "what would I say if they offer me 30% off" is far less likely to be derailed by it at the last moment.

---

## Common failure modes

- **Starting a displacement motion on vague dissatisfaction.** "We've had some issues with the incumbent" is not a displacement signal — it is a negotiating posture. Prospects who are genuinely switching have a specific, named failure they can articulate. Qualify for this in Stage 1 or stop the motion.
- **Attacking the incumbent directly.** Prospects defend incumbents they secretly dislike when an outsider criticizes them. Trap-setting questions work precisely because the prospect names the gap themselves. Never badmouth a competitor by name.
- **Competing on the incumbent's terms.** If you let the incumbent define the evaluation criteria — typically ones built around their own strengths — you are playing on their home field. Stage 3 (Reframe) is the most important stage in this workflow. Skip it and you will lose to "better the devil you know."
- **Underquoting switching costs to close faster.** A prospect who discovers that migration was harder or more expensive than promised becomes a churn risk in 12 months and a reference risk for the rest of the market. Be honest about switching costs — the ROI math still works, and your credibility survives.
- **Leaving the incumbent time to counter.** Once a champion signals intent to switch, the incumbent's retention team will mobilize. Every week between "intent to switch" and "signed contract" is time for a discount, an exec escalation, or a roadmap promise to erode your position. Stage 6 is a sprint, not a stroll.
