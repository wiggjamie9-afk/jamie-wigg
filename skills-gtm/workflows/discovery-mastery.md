---
id: gtm-workflows-discovery-mastery
name: "Discovery Mastery"
description: "A structured pre-call-through-recap process for running discovery calls that produce real MEDDPICC data rather than a polite conversation."
category: marketing
group: workflows
subcategory: workflows
risk: none
license: MIT
tags: ["go-to-market", "workflow", "workflows"]
---
# Workflow: Discovery Mastery

## Purpose
A structured pre-call-through-recap process for running discovery calls that produce real MEDDPICC data rather than a polite conversation. Owned by AEs and run on every initial and follow-on discovery call, regardless of inbound or outbound source. Built to surface pain, quantify it, identify decision dynamics, and establish a multithreaded footprint before the call ends. Not templates — starting points.

## Stages at a glance
1. Pre-call Research → know the account before you dial
2. Agenda & Up-Front Contract → set expectations and seize control of the call
3. Situation Questions → map the current state without wasting their time
4. Pain Funnel → find the hurt and let them feel it
5. Implication Questions → connect pain to business impact
6. Quantify → attach a number to the pain
7. Multithread & Recap → expand the footprint and lock the next step

---

## Stage 1 — Pre-call Research
**Owner:** AE (SDR assists if two-step)
**Goal:** Enter the call with a pain hypothesis, a stakeholder map, and one piece of relevant company context that signals you did your homework
**Exit criteria:** One-page brief completed covering: company context, likely pain hypothesis, named stakeholders, one relevant proof point to hold in reserve
**Pull from:** `roles/sdr-bdr/cold-outreach.md`, `roles/revops/territory-design.md`

**Prompt:**
> Before the call, research and complete this brief in 15 minutes or less:
>
> Company snapshot:
> - What does this company do and who do they sell to?
> - What changed recently — funding, leadership, product, market? (LinkedIn, company blog, Crunchbase, press)
>
> Stakeholder brief for each attendee:
> - Title and likely function
> - What does a person in this role typically care about? (revenue impact, team efficiency, risk, career optics)
> - What LinkedIn posts or activity signal their current priorities?
>
> Pain hypothesis (our best guess before the call):
> - "We believe this company is struggling with [X] because [signal]. If correct, the cost to them is approximately [Y]."
>
> Proof point to hold in reserve:
> - One customer story (same industry or same pain) to deploy if you need to establish credibility quickly.
>
> Red flags to watch for: any signal that this might be a research call, a competitive shop, or a low-authority stakeholder.

**Why it works:** Arriving with a hypothesis rather than a blank slate compresses the situation phase and signals to the prospect that they are not training you — you already understand their world.

---

## Stage 2 — Agenda & Up-Front Contract
**Owner:** AE
**Goal:** Set a clear agenda the prospect agrees to, establish mutual expectations for the call outcome, and give them permission to say no
**Exit criteria:** Prospect has verbally confirmed the agenda and the end-of-call ask (next step) before the discovery begins
**Pull from:** `roles/account-executive/discovery-prep.md`

**Prompt:**
> Open every discovery call with this four-part up-front contract:
>
> 1. Time check: "We have [X] minutes — does that still work for you?"
> 2. Agenda: "Here's what I was thinking: I'd love to spend the first half understanding where you are today and what's driving this conversation, then show you something relevant in the second half if it makes sense. Sound good?"
> 3. Permission to probe: "I may ask some questions that get into specifics about your team or your numbers — feel free to tell me if something is off-limits."
> 4. End-of-call contract: "If at the end we both feel like there's something here, I'd love to agree on a clear next step. And if we don't, I'd rather know that now than waste both our time. Fair enough?"
>
> Listen for: hesitation on the agenda (signals competing agendas or a passive attendee), rushed timeline (will need to cut ruthlessly), or the prospect trying to jump straight to pricing.

**Why it works:** The up-front contract flips the power dynamic — you are the one granting permission to end the call if there's no fit. Prospects who feel respected become more honest about real constraints.

---

## Stage 3 — Situation Questions
**Owner:** AE
**Goal:** Map the current state quickly — tools, team size, current process — without turning the call into an intake form
**Exit criteria:** You can describe their current process in two sentences; you have identified the gap between where they are and where they want to be
**Pull from:** `roles/account-executive/discovery-prep.md`, `methodologies/meddpicc.md`

**Prompt:**
> Use these situation questions to build a current-state map. Ask a maximum of three before pivoting to pain — you should already know most of this from research.
>
> "Walk me through how you currently handle [the process we address]. What does that look like end-to-end?"
>
> "Who else on your team is involved in that process day-to-day?"
>
> "What tools are you using today to manage that?"
>
> After each answer, listen for spontaneous complaints. When a prospect sighs, hesitates, or qualifies an answer with "but it's not perfect," that is the entry point to Stage 4.
>
> Do NOT ask situation questions you could have answered with three minutes of research. If caught doing this, you lose credibility before you've found the pain.

**Why it works:** Keeping situation questions minimal respects the prospect's time and signals preparation. Amateurs ask five situation questions; professionals ask one and pivot to pain.

---

## Stage 4 — Pain Funnel
**Owner:** AE
**Goal:** Identify the specific, felt pain — not a generic category of pain — and help the prospect articulate it in their own words
**Exit criteria:** Prospect has named at least one concrete problem in their own language; you have not suggested the pain — they surfaced it
**Pull from:** `roles/account-executive/discovery-prep.md`, `methodologies/meddpicc.md`

**Prompt:**
> Run the pain funnel using only open questions — never lead the witness.
>
> Entry point (follow a situation answer or spontaneous complaint):
> "You mentioned [X]. Tell me more about that — what specifically goes wrong?"
>
> Deepen:
> "When that happens, what does the team typically do to work around it?"
> "How often does that come up?"
> "How long has that been an issue?"
>
> Confirm:
> "So if I'm understanding correctly, the core problem is [their words, not yours]. Is that right?"
>
> Breadth check:
> "Is this mostly a [team/department/function] problem or does it affect other parts of the business too?"
>
> Warning: if the prospect says "we're pretty happy with how things work" after one question, do not push harder on the same vector. Try: "That's great — what's the one thing you would change if you could, even if it's small?" Most people have at least one.

**Why it works:** Letting the prospect name the pain in their own words means they own it. Pains you suggest are easy to dismiss; pains they articulate are real and felt.

---

## Stage 5 — Implication Questions
**Owner:** AE
**Goal:** Connect the operational pain to a business-level consequence — revenue, cost, headcount, risk, competitive position
**Exit criteria:** Prospect has connected their pain to at least one business-level metric or outcome; urgency has been introduced naturally
**Pull from:** `roles/account-executive/discovery-prep.md`, `methodologies/meddpicc.md`

**Prompt:**
> After the pain is named, move immediately to implication. Do not accept "it's frustrating" as a destination — frustration is not a business case.
>
> Direct implication:
> "When [pain they named] happens, what's the downstream effect on [revenue / team / customers / your time]?"
>
> Cascade implication:
> "And when [first implication] happens, what does that mean for [the next layer]?"
>
> Strategic implication:
> "If this continues at the same rate for another 12 months, where does that leave you?"
>
> Personal implication (use carefully, builds urgency):
> "How does this show up for you personally — is this something that lands on your plate when it goes wrong?"
>
> Validation:
> "I want to make sure I understand the full impact — is there anything else this affects that we haven't talked about?"

**Why it works:** Implication questions shift the conversation from describing a problem to feeling the cost of not solving it. The prospect convinces themselves that the status quo is more expensive than the change.

---

## Stage 6 — Quantify
**Owner:** AE
**Goal:** Attach a number — a dollar figure, time figure, or risk figure — to the pain so you have business case raw material and so the prospect feels the weight of inaction
**Exit criteria:** At least one metric is agreed on (even an estimate); prospect has confirmed or corrected your number
**Pull from:** `roles/account-executive/roi-model.md`, `methodologies/meddpicc.md`

**Prompt:**
> Move to quantification as soon as an implication is surfaced. Use anchoring if needed.
>
> Direct ask:
> "If you had to put a number on it — hours per week, deals lost, cost per incident — what would you estimate?"
>
> If they resist:
> "I'm not going to hold you to it — just a rough order of magnitude. Is it closer to [low anchor] or [high anchor]?"
>
> Build the math with them:
> "So if that happens [X times per month] and each incident costs roughly [Y hours / $Z], that's about [calculated total] per quarter. Does that feel in the right range?"
>
> If they say the number is higher than your estimate:
> "That's actually higher than I expected — what's driving that?"
> (This expands the problem and strengthens the case.)
>
> If they minimize the number:
> "I hear you — is it more of a risk issue than a cost issue? Sometimes the biggest driver is what happens if [catastrophic scenario] occurs."

**Why it works:** Numbers create commitment. A prospect who has said "this costs us $400k a year" cannot later say the problem isn't big enough to act on — they said so themselves.

---

## Stage 7 — Multithread & Recap
**Owner:** AE
**Goal:** Identify additional stakeholders, confirm decision process, send a written recap that locks the next step and creates a paper trail
**Exit criteria:** At least two stakeholders identified by name; next step scheduled (not "I'll send a calendar invite"); recap email sent within one hour
**Pull from:** `roles/account-executive/discovery-prep.md`, `methodologies/meddpicc.md`

**Prompt:**
> Close the discovery call with these five questions before ending:
>
> 1. Economic buyer: "When a decision like this moves forward, who else gets involved from a budget or approval standpoint?"
> 2. Decision process: "What does your evaluation process typically look like from here — is there a formal RFP, a security review, a procurement step?"
> 3. Timeline: "If this becomes a priority, what does the timeline look like for making a decision?"
> 4. Multithread ask: "Would it make sense to include [name from research or from their org] in the next conversation, or is it better to keep it tight at this stage?"
> 5. Next step close: "Based on what we've covered today, here's what I'd suggest as a next step — does that work for you?"
>
> Within 60 minutes, send a recap email with this structure:
> - What I heard (their pain in their words, their quantified impact)
> - What we discussed (what you showed or proposed)
> - Agreed next step (date, attendees, format)
> - One open question (to keep engagement until the next call)

**Why it works:** The written recap accomplishes three things: it proves you listened, it creates a record the champion can forward internally, and it locks a next step in writing so it cannot quietly die.

---

## Common failure modes

- **Skipping the up-front contract.** Calls without a clear agenda drift. The prospect controls the conversation, asks about pricing in the first ten minutes, and the AE never gets to pain.
- **Stopping at situation questions.** A call that maps the current state but never finds a felt pain produces no urgency, no business case, and no reason to advance. The prospect leaves thinking "that was interesting" and takes no action.
- **Suggesting the pain instead of surfacing it.** "Are you having trouble with X?" is a leading question. The prospect says yes because it's socially easy, but they don't own the pain. When the deal stalls, that borrowed pain evaporates.
- **Skipping quantification.** "This is painful" is not a business case. Without a number, the champion cannot build internal consensus and the economic buyer cannot justify budget.
- **Ending without a confirmed next step.** "I'll send something over" is not a next step. Calls that end with a vague follow-up promise have a sub-20% advance rate. Always book the next meeting before ending the current one.
