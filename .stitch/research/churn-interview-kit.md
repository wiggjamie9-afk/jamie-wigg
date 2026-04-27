# Churn interview kit — find the #1 reason

> **Question this answers:** Why are customers actually leaving? Stated reasons in cancellation forms are surface-level. Real reasons surface in conversation.
>
> **Target:** 20 customers who churned in the last 60 days. 30 minutes each. $50 gift card. Founder runs the calls; engineer transcribes.

## Recruitment

**Email template** (founder, not founder@company):

```
Subject: 30 minutes? I'm trying to fix what we got wrong.

Hi [Name],

I'm [Founder], CEO of [Product]. I noticed you cancelled in [month] —
we screwed something up and I want to learn what.

Could we do 30 minutes on Zoom? I'll send a $50 Amazon card whether
or not you have anything nice to say. I'm not going to try to win you
back; I just want to understand.

Three slots that work this week: [Calendly link]

Thanks,
[Founder]
```

**Target response rate:** 25–40%. Send to 60 to land 20 calls.

## Pre-call prep (5 min per customer)

For each interview, pull:

- Signup date, churn date, plan, MRR
- Last login date
- Onboarding completion status
- Support tickets (count + topics)
- Any NPS / feedback responses
- What they downloaded / configured (key features used or not)

This lets you ask sharp questions instead of softball ones.

## Interview script

> Run open-ended where possible. Don't sell. Don't defend. Take notes literally — exact phrasing matters more than your interpretation. Keep to 30 minutes; cut the back half if the front half is rich.

**Opening (2 min)**

> Thanks for the time. Quick framing: I'm not going to pitch you. I'd rather you tell me what to fix than tell you what we'll do better. Mind if I record so my engineer can transcribe? (If no, take notes.)

**Discovery — what brought them in (5 min)**

1. Walk me back — what made you sign up in the first place?
2. What were you using before us?
3. What was the *one thing* you hoped we'd fix?

**The leaving — what made them go (10 min)**

4. Walk me through the last 30 days before you cancelled. What changed?
5. Was there a specific moment you decided?
6. What were we *not* doing that you needed?
7. If we'd had [specific feature/integration you suspect from data], would you have stayed?
8. Was price ever a factor — honest answer? *(Wait through silence.)*
9. How was the onboarding? *(Cross-reference with their completion data.)*
10. Did anyone on your team push back on us — assistant, hygienist, partner? Why?

**The competitor — what won (5 min)**

11. Where are you now? Why that?
12. What did they offer that we didn't?
13. Did Dentrix or anyone reach out with a winback offer?

**The wide-open (5 min)**

14. On a scale of 1–10, how disruptive was switching away from us?
15. If a colleague asked you about us tomorrow, what would you say?
16. Anything else I should know that I didn't ask?

**Close (1 min)**

> This was honestly useful, thank you. Gift card lands within 24 hours. If we ever fix the thing that pushed you out — okay if I email you?

## Coding framework

Code each interview with **1–2 primary reasons** from this list. Don't expand the taxonomy; force a fit:

| Code | Definition |
|---|---|
| `product_gap` | Specific missing feature blocked their workflow |
| `integration_gap` | Missing integration with PMS/imaging/insurance/etc. |
| `onboarding` | Never got fully set up; gave up |
| `performance` | Speed, reliability, data accuracy issues |
| `support` | Couldn't get help when stuck |
| `price` | Genuinely couldn't justify cost (not just "expensive") |
| `competitor` | Got a materially better offer / Dentrix winback |
| `practice_change` | Sold practice, retired, merged, closed — out of your control |
| `champion_left` | Champion at the practice left and replacement chose differently |
| `wrong_fit` | Practice type / size doesn't actually match product (this is the saddest — they shouldn't have signed up) |

Two engineers code each interview independently; reconcile disagreements. Inter-rater agreement <80% means the codebook needs revision.

## Decision rule

After 20 interviews, tally:

- **One code ≥ 30% of interviews** → that's the #1 reason. Fix it. Build the Q1 roadmap around it.
- **Two codes each 20–30%** → fix both, in cost-of-fix order.
- **No code above 25%** → you have a UX or onboarding problem disguised as multiple reasons. Look at the `onboarding`, `product_gap` (if scattered across many features), and `wrong_fit` codes together — that's almost certainly the real story.
- **`practice_change` ≥ 30%** → you don't have a churn problem you can solve. Re-examine ICP and acquisition (some segment of your buyers is structurally unstable).
- **`wrong_fit` ≥ 25%** → tighten qualification. You're acquiring customers who shouldn't have signed up; fix the website, demo, and onboarding gates.

## Output template

```
Sample: 20 churned customers, [date range]
Response rate: [X]/60 = [Y]%

Top reasons (≥ 30% threshold marked **):
  1. [code] — [N] interviews ([N/20]%) **
  2. [code] — [N] interviews ([N/20]%)
  3. [code] — [N] interviews ([N/20]%)

Selected quotes (verbatim):
  - "[quote]" — [persona], [practice type]
  - "[quote]" — [persona], [practice type]
  - "[quote]" — [persona], [practice type]

Decision: [what we're fixing first, why, and the expected churn impact]
```
