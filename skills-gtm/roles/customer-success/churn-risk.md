---
id: gtm-roles-customer-success-churn-risk
name: "CSM Churn Risk"
description: "A collection of prompts for Customer Success Managers identifying, addressing, and escalating churn risk before it becomes a lost renewal."
category: marketing
group: roles
subcategory: customer-success
risk: none
license: MIT
tags: ["go-to-market", "role", "customer-success"]
---
# Reference: CSM Churn Risk Prompts

## Purpose
A collection of prompts for Customer Success Managers identifying, addressing, and escalating churn risk before it becomes a lost renewal. Covers early-warning signal interpretation, save-play outreach, sponsor-change response, low-usage re-engagement, executive escalation, and root-cause questioning. Calibrated for CSMs managing accounts where NRR and gross retention are part of their success metrics. Not templates — starting points.

---

## Prompt 01 — Early-Warning Signal Interpretation Brief
**Role:** CSM
**Trigger:** Monthly health score review or automated risk alert from the CS platform
**Structure:** Name the signal → hypothesise the root cause → categorise the risk (usage, relationship, competitive, financial) → define the first response action
**Example output:** "Signal: [Company] weekly active users dropped from 34 to 19 over 3 weeks. No support tickets, no champion contact. Root cause hypotheses: (a) key user departed, (b) competing internal project absorbing team bandwidth, (c) a workflow broke and no one reported it. Action: call champion [Name B] within 24 hours — do not email first. Goal: diagnose root cause before assuming the worst or the best."
**Why it works:** Jumping to a save-play before diagnosing the root cause is the most common CSM mistake. A single call to the champion is faster and more informative than any amount of data analysis from the outside.
**Word count:** N/A — internal brief format
**Avg. score:** 85-93

---

## Prompt 02 — Low-Usage Re-Engagement Outreach
**Role:** CSM
**Trigger:** Account falls below 40% seat utilisation for two consecutive weeks
**Structure:** Name the specific data point → connect to their stated goal → propose a concrete action, not a check-in
**Example output:** "Hi [Name], I noticed platform activity dropped significantly over the last two weeks — you're at 17 active users compared to 34 the month before. I'm not sure what's driving it, but I do know that [Goal from success plan] depends on consistent team adoption. Could we get 20 minutes on the calendar this week? I'd like to understand what's changed and see if there's something on our side we can unblock."
**Why it works:** 'Just checking in' emails get ignored. Citing a specific number — and connecting it to their own goal — signals that this is a purposeful outreach, not a routine cadence call, and raises the probability of a response.
**Word count:** 60–80 words; email
**Avg. score:** 84-92

---

## Prompt 03 — Sponsor-Change Response Protocol
**Role:** CSM
**Trigger:** Champion or economic buyer leaves the account; new hire announced or discovered via LinkedIn
**Structure:** Acknowledge the change → research the incoming person → reach out through the departing champion before they leave → re-establish the relationship from scratch
**Example output:** "Hi [Departing Champion Name], I heard you're moving on — congratulations on the new role. Before you go, could you introduce me to [New Champion Name]? I want to make sure the context of what we've built together doesn't get lost. Happy to put together a one-page transition brief you could send alongside the intro. And I'd genuinely love to stay in touch — please reach out if there's anything I can do."
**Why it works:** The departing champion is the most valuable asset in a sponsor-change situation. They can make or break the new relationship in one email. Asking for the introduction — and offering them something useful in return — maximises the probability of a warm handoff.
**Word count:** 70–90 words; email
**Avg. score:** 86-94

---

## Prompt 04 — Save-Play Outreach (Red Account)
**Role:** CSM
**Trigger:** Account health score is red; renewal is within 90 days; champion has gone quiet
**Structure:** Acknowledge the relationship gap → be direct about the concern → offer a specific action, not an open question → involve manager or AE if appropriate
**Example output:** "Hi [Name], I want to be honest with me — we haven't connected in a few weeks and your renewal is coming up in 10 weeks. I'm not sure where things stand and I'd rather have a direct conversation than guess. Can we find 30 minutes this week? I'd like to understand where we've fallen short and whether there's anything we can do to fix it before you make a decision. If email isn't the right channel, I'm happy to call."
**Why it works:** Silent accounts that receive 'just checking in' emails rarely respond. Direct acknowledgment of the gap — and explicit permission to have a hard conversation — is more likely to get a response than a gentle nudge.
**Word count:** 80–100 words; email
**Avg. score:** 87-94

---

## Prompt 05 — Executive Escalation Request (Internal)
**Role:** CSM
**Trigger:** Save-play has stalled; champion is disengaged; renewal is at material risk
**Structure:** State the account and ARR at risk → summarise the root cause → describe what's been tried → make a specific ask of the executive (one action, not a vague 'help')
**Example output:** "Internal escalation for [Company] ($120K ARR, renewal in 8 weeks). Root cause: champion [Name B] departed 6 weeks ago; new DM [Name C] has not responded to two emails and a call. We've exhausted our current relationship depth. Ask: would [VP CS or CRO Name] be willing to reach out to [Name C]'s manager, [CMO Name], for a peer-to-peer conversation? I can draft the message; I just need the relationship to send it from."
**Why it works:** Escalation requests that arrive with a specific ask — not just a problem — are acted on faster. Naming the one action needed (a peer outreach) removes the ambiguity about what the executive is being asked to do.
**Word count:** 80–100 words; Slack or internal CRM note
**Avg. score:** 84-92

---

## Prompt 06 — Root-Cause Questioning Framework
**Role:** CSM
**Trigger:** First call after a risk signal is flagged; save-play discovery conversation
**Structure:** Ask open questions → don't assume the cause → surface the real issue → listen for signals about relationship health, product fit, competitive activity, or internal budget pressure
**Example output:** "Questions to ask in the discovery call: 'What's changed since our last conversation?' / 'Walk me through how the team is using [Product] day-to-day right now.' / 'Is there a specific outcome you expected to see by now that hasn't materialised?' / 'When you think about the next 12 months, what does success with us look like?' / 'Is there anything on your side that's making it hard to prioritise this right now?' — Do not mention renewal, pricing, or competitors unless the customer raises them first."
**Why it works:** The root cause of churn is almost never the stated reason. Asking open questions and listening for what the customer volunteers — rather than what you ask directly — reveals the real driver.
**Word count:** N/A — question list for call prep
**Avg. score:** 83-91

---

## Prompt 07 — Budget-Pressure Churn Response
**Role:** CSM
**Trigger:** Customer cites cost concerns, mentions a budget freeze, or asks for pricing alternatives
**Structure:** Acknowledge the constraint without panic → explore the problem before proposing a solution → offer alternatives in order of ARR preservation
**Example output:** "I hear you — budget constraints are real and I don't want to dismiss that. Before I put anything in writing, can I ask: is this a question of the total spend, the timing of the payment, or whether you're getting enough value to justify renewing at all? The answer changes what I'd recommend. If it's value, that's a conversation we should have about where we've landed. If it's cash timing, there may be options on structure that I can explore with our team."
**Why it works:** Jumping to a discount before understanding the source of the budget concern is a value-destroying reflex. Diagnosing first often reveals that the issue is timing, not amount — which has a different solution.
**Word count:** 70–90 words; spoken script or email
**Avg. score:** 85-92

---

## Prompt 08 — Competitive Threat Response
**Role:** CSM
**Trigger:** Customer mentions evaluating a competitor; procurement sends an RFP; champion flags an unsolicited demo
**Structure:** Don't panic or immediately go negative on the competitor → ask what's driving the evaluation → reframe around risk of switching → arm the champion with the comparison narrative
**Example output:** "Thanks for telling me directly — I appreciate that. Can I ask what's prompting the evaluation? Is this a driven-from-above budget exercise, or is there a specific capability gap you're trying to fill? I ask because those are different conversations. If it's a capability gap, I want to know what we're missing. If it's cost-driven, let's talk about what a switch actually costs when you factor in migration and retraining. I'd rather solve the real problem than just compete on features."
**Why it works:** Treating a competitive evaluation as a diagnosis question rather than a defence posture keeps the CSM in the trusted-advisor role. Customers who feel heard are more likely to share the real driver — which is almost always solvable.
**Word count:** 80–100 words; spoken script
**Avg. score:** 84-92

---

## Prompt 09 — Churn Risk Account Plan (Internal)
**Role:** CSM
**Trigger:** Any account flagged red in the health score dashboard, or flagged in the weekly risk review
**Structure:** Account name and ARR → renewal date → root cause → what's been tried → escalation status → success criteria for a save → timeline and owner for each action
**Example output:** "Account: [Company] | ARR: $85K | Renewal: 14 Sep. Root cause: new IT Director has deprioritised the project; adoption has stalled at 31%. Tried: two check-in emails (no response), one call (voicemail). Escalation: VP CS to send peer outreach to [IT Director] by Friday. Save criteria: active users back to 40+ by 1 Aug AND success plan updated with new DM sign-off by 15 Aug. Owner: [CSM Name]. Next review: 18 Jul."
**Why it works:** Churn risk without a written plan is a conversation that repeats itself every week without progress. A one-page account plan with specific success criteria and dated actions creates accountability.
**Word count:** N/A — internal structured note
**Avg. score:** 83-91

---

## Prompt 10 — Post-Churn Loss Interview Outreach
**Role:** CSM
**Trigger:** Within 2 weeks of a customer confirming non-renewal
**Structure:** Thank for the relationship → acknowledge the outcome without defensiveness → ask for honest feedback → make the ask once and don't follow up if declined
**Example output:** "Hi [Name], I appreciate you letting us know your decision. I won't try to change it — I respect it. I would genuinely like to understand where we fell short, if you're open to a 20-minute conversation. Not to pitch, not to negotiate — just to learn. The feedback would help us improve for customers who are in a similar position to where you started. No pressure if you'd rather not; I understand completely."
**Why it works:** Post-churn interviews are the most valuable and most underutilised input in a CS function. Most CSMs skip them because they feel awkward. The tone here makes it easy for the customer to say yes — or no — without either party losing dignity.
**Word count:** 70–90 words; email
**Avg. score:** 84-91
