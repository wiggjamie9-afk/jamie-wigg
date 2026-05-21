# RESONATE — Support Kit

> One-person support operation for a lifetime AU$30 product. Every reply goes out from `wiggjamie9@gmail.com`. The voice is the same one that ships on the Gumroad page and the landing page: lineage-aware, engineering-precise, no fluff, no fake enthusiasm. Honesty over polish. Never make a medical claim. Never promise a roadmap date you can't keep.

This kit is the canonical reference for every inbound ticket. Read Section 3 (Brand-voice guardrails) before sending anything. Read Section 4 (Refund handling) before touching a refund.

---

## Section 1 — Anticipated tickets (15) with full-prose responses

Each ticket is a real-shape message a Founding Member is likely to send in the first 90 days. The drafts below are ready-to-paste, sit between 100 and 200 words, address the human first and the mechanism second, and stay inside brand voice. Personalise the opener with the sender's first name if Gumroad gives it. Keep the signature consistent: `— Jamie / wiggjamie9@gmail.com`.

---

### Ticket 1 — "My AirPods Pro 3 won't pair / how do I check they're the Pro 3?"

**Priority:** HIGH
**Category:** Hardware compatibility

**Draft response:**

Hi {{first_name}},

That's frustrating — and worth getting right, because the AirPods Pro 3 are the part of the loop that actually reads your heart, so older AirPods will pair to the phone but won't feed RESONATE a pulse.

Two quick checks. First, on your iPhone go to Settings → Bluetooth → tap the (i) next to your AirPods — the model number should read `A3048` or `A3049`. If it's anything else, they're an earlier generation and the heart-rate sensor isn't there. Second, in RESONATE itself, the closed-loop indicator on the home screen turns gold when the AirPods are reporting heart rate. If it stays grey, force-close the app, re-insert the AirPods deeply (the optical sensor needs skin contact), and re-open.

If you've confirmed they're Pro 3 and the indicator still won't go gold, reply with the model number and your iOS version and we'll dig in.

— Jamie
wiggjamie9@gmail.com

---

### Ticket 2 — "The app crashes the moment I start a session"

**Priority:** CRITICAL
**Category:** Technical — stability

**Draft response:**

Hi {{first_name}},

Sorry — that shouldn't happen, and I want to fix it for you today.

Three things would help me pin it down. First, what iPhone model and iOS version are you on? RESONATE needs iOS 26 or later, and the on-device inference is heavy on older A-series chips. Second, does it crash on every mode, or only one of Focus / Calm / Rest? Third, if you open Settings → Privacy & Security → Analytics → Analytics Data and look for entries starting with `Resonate-`, can you forward the most recent one? That's the crash log and it tells me exactly where the loop is breaking.

While I'm reading it, a fast workaround: start an HKWorkoutSession on the Apple Watch (any indoor walk, no need to actually walk) *before* opening RESONATE. That keeps the Watch HRV stream warm and avoids the most common cold-start crash on iOS 26.0.x. Apple's 26.1 release notes mention the underlying fix.

— Jamie

---

### Ticket 3 — "How is this different from Endel / Calm / Brain.fm?"

**Priority:** MEDIUM
**Category:** Pre-purchase / positioning

**Draft response:**

Hi {{first_name}},

Honest answer, because that's a fair question.

Endel generates music from weather, time-of-day, and heart rate — but it's a one-way feed and cloud-streamed, and the heart-rate read is a long average, not a closed loop. Calm is authored content, beautifully produced library tracks; nothing about the score responds to you. Brain.fm is preset binaural-style tracks selected from a library. All three are good. None of them close the loop on your biometrics in real time, and all three are AU$70–90 per year.

RESONATE generates the music continuously from your heart rate (AirPods Pro 3) and your breath (Apple Watch), with a sub-two-second response from change to sound, runs the inference on-device, and circles the score around you in head-tracked spatial audio. It's AU$30 once.

That said — if you mostly want guided meditations with a voice, Calm is still the right tool. RESONATE is for the closed-loop practice, not for guided sessions.

— Jamie

---

### Ticket 4 — "Can I use it without the Apple Watch?"

**Priority:** MEDIUM
**Category:** Hardware / fit

**Draft response:**

Hi {{first_name}},

You can, with one caveat I want to be upfront about.

Without the Watch, the loop runs on heart rate alone (from the AirPods Pro 3) and uses an estimated breath cadence rather than a measured one. Focus and Rest still feel close to the full experience. **Calm** — the 0.1 Hz cardiac-coherence mode — is the one that really wants the Watch, because the music opens specifically as your measured breath approaches the resonance frequency. Without it, Calm runs in a "guided pacing" fallback where the orb sets the rhythm and you follow it.

If you don't own a Watch and Calm is the mode you most want, the higher-fidelity alternative is a Polar Verity Sense paired over BLE — it gives a clean HRV stream and the app picks it up automatically. It's about AU$140. Not required; just the other supported path.

— Jamie

---

### Ticket 5 — "Refund policy?"

**Priority:** HIGH
**Category:** Billing / refund

**Draft response:**

Hi {{first_name}},

Yes — 14 days, no questions asked. If you'd like the refund processed now, reply with your Gumroad receipt (or the order number, starts with `O-`) and I'll push it through today. The refund usually lands back on your card within 3–5 business days, depending on your bank.

After the 14-day window, refunds are at my discretion — I've never refused a reasonable request, but I do want to know what didn't land, so write to me and we'll work it out.

One thing worth mentioning: if it's specifically the **Calm** mode that isn't clicking, the most common cause is the Watch HRV stream timing out — starting an HKWorkoutSession on the Watch before opening RESONATE fixes it in about 90% of cases. Happy to walk you through that if you'd rather try the fix than refund. Either way is genuinely fine.

— Jamie

---

### Ticket 6 — "Does it work on Android?"

**Priority:** MEDIUM
**Category:** Platform

**Draft response:**

Hi {{first_name}},

Honest answer: no, and not on the roadmap.

RESONATE is built around four things that only exist together on iPhone — the AirPods Pro 3 in-ear optical heart-rate sensor, the Apple Watch HRV stream over HealthKit, Apple PHASE for head-tracked spatial audio, and the on-device Apple Foundation Models inference. Android doesn't have the equivalent stack, and a port would be a different product, not the same one.

If you're on Android and the *closed loop* is what drew you in, the closest current path is a Polar Verity Sense over BLE plus a third-party head-tracking app — but it isn't RESONATE and I won't pretend it is.

If you bought already and you're on Android, that's clearly on me for not flagging it loudly enough on the page. Reply with your receipt and I'll refund you in full today, no 14-day clock.

— Jamie

---

### Ticket 7 — "The music is too repetitive / not what I expected"

**Priority:** MEDIUM
**Category:** Experience / expectations

**Draft response:**

Hi {{first_name}},

Thank you for telling me — and I want to set the expectation honestly, because "what RESONATE sounds like" is genuinely different from the demo-track reflex.

The score is generated continuously and steered by your nervous system, which means it doesn't have the obvious A-B-C song structure of a curated track. When the loop is settled — heart rate stable, breath near 0.1 Hz — it deliberately stays underneath your attention. That can read as "repetitive" the first one or two sessions before your ear retunes to what's actually changing (the spatial position, the harmonic opening, the gentle bloom on the exhale).

Two things worth trying. First, give it three sessions before judging — the third is usually where it clicks. Second, try a *different mode*: Focus has more transient detail than Calm, and Rest is intentionally minimal. If after three sessions across two modes it still isn't landing, the 14-day refund window covers you and I'll process it without friction.

— Jamie

---

### Ticket 8 — "How do I see my coherence trends over time?"

**Priority:** LOW
**Category:** Feature / how-to

**Draft response:**

Hi {{first_name}},

In the app, tap the orb in the top-right of the home screen — that opens the **Session log**. You'll see streak, total minutes in coherence, longest session, and a per-day breakdown with the time you spent in the 0.1 Hz band on each session.

A few details worth knowing. The log lives only on your phone — nothing about it is uploaded, there's no cloud backup, and no account to sync across devices (that's the on-device-privacy promise). If you want a copy, tap the share icon at the top of the log and you'll get a JSON export you can save to Files or email yourself. If you delete the app, the log goes with it — there's no recovery on my side because I never had it.

Longer-term graphs (rolling 30-day coherence, mode breakdowns, HRV trends) are on the roadmap for the next content drop — included in your lifetime access when they ship.

— Jamie

---

### Ticket 9 — "Privacy: where does my biometric data go?"

**Priority:** HIGH
**Category:** Privacy / trust

**Draft response:**

Hi {{first_name}},

Short version: nowhere. It stays on your phone.

The longer answer, because you deserve specifics. Heart rate from the AirPods Pro 3 and HRV from the Apple Watch are read through HealthKit into RESONATE's process memory, used to steer the generative score, and discarded — they're not written to a server, not written to disk beyond the local Session log, and not shared with any third party. The voice-intent feature ("a quiet half-hour before a meeting") runs on Apple Foundation Models on-device — the audio never leaves the phone and there is no recording stored after the intent is parsed. There is no account, no email-to-user mapping on my side beyond the Gumroad receipt you got at purchase, and no analytics SDK on practice data.

If you want to verify, the app's Settings → Privacy panel lists every HealthKit type it reads, and Apple's privacy nutrition label on the App Store page is the standard third-party check.

— Jamie

---

### Ticket 10 — "Can I use this while driving / working out?"

**Priority:** HIGH
**Category:** Safety

**Draft response:**

Hi {{first_name}},

Please don't use RESONATE while driving — it's in the disclaimer for a real reason. The Calm and Rest modes are designed to drop your sympathetic activation, which is the opposite of what you want behind a wheel, and the head-tracked spatial audio can be subtly disorienting if your visual field is also moving. Same applies to operating machinery.

Working out is a softer "depends." The Focus mode is the only one I'd suggest for a workout, and even then it's tuned for cognitive work — sitting upright, attention forward — rather than for a treadmill or a lifting set. The closed loop expects relatively stable HR; sprint intervals will read as "the loop is wide open" and the music will sit at its maximum bloom for the whole set, which is fine but not the experience the mode was designed for.

The honest use case is: quiet room, AirPods in, Watch on, sitting upright. That's where it shines.

— Jamie

---

### Ticket 11 — "How do I cancel my account?"

**Priority:** LOW
**Category:** Billing / education

**Draft response:**

Hi {{first_name}},

Good news — there's nothing to cancel. RESONATE is a one-time AU$30 purchase, not a subscription. There's no monthly bill, no renewal date, no auto-charge, and no account to close. If you check your card statement, you'll only see the single Gumroad charge from your purchase date and nothing recurring.

If you want to *remove the app* from your phone, long-press the icon → Remove App → Delete App, and the Session log goes with it (it lives only on your phone, so deletion is genuinely deletion). If you want your purchase record removed from Gumroad's side as well, Gumroad's account settings has a "delete account" option under Settings → Advanced — that removes your buyer profile from their platform.

And if the *reason* you're looking to cancel is that it isn't landing, see Ticket 5's territory — the 14-day refund is open, no friction.

— Jamie

---

### Ticket 12 — "I bought it, where's the link?"

**Priority:** HIGH
**Category:** Delivery / fulfilment

**Draft response:**

Hi {{first_name}},

Sorry for the friction. The delivery email comes from `noreply@gumroad.com` with the subject line "You bought RESONATE — Lifetime Membership" and lands within a couple of minutes of the purchase confirming. The most common reason it doesn't appear is spam filtering — Gmail in particular sometimes routes Gumroad's first-time sender mail to Promotions or Spam, so check those folders first.

If it isn't there, the second route is Gumroad's library: log in at `gumroad.com/library` with the same email you bought with, and RESONATE will be sitting there with an "Open" button that gives you the access link directly.

If neither of those works, reply with the email address you bought with (or the last four digits of the card) and I'll look up the order on my side and resend the link manually. I'll do that today.

— Jamie

---

### Ticket 13 — "Does it work with Polar / Whoop / Garmin / Oura?"

**Priority:** MEDIUM
**Category:** Hardware / compatibility

**Draft response:**

Hi {{first_name}},

Mixed answer, device by device.

**Polar Verity Sense** — yes, supported via the Polar BLE SDK. It's actually the higher-fidelity HRV source than the Apple Watch, and a clean fallback if you don't own a Watch. The app picks it up automatically once you pair it in iOS Bluetooth settings.

**Whoop, Garmin, Oura** — no, not at launch. The technical reason is that none of them expose a real-time HRV stream over a public iOS API the way Apple Watch (via HealthKit) and Polar (via Polar BLE SDK) do. Whoop streams to its own cloud, Oura batches to its app, Garmin doesn't expose HRV on iOS at all. Without a real-time stream, the closed loop can't close — you'd be running on heart rate alone (see Ticket 4).

If any of them open a real-time HRV API in a future SDK, I'd add it — it's not a business decision, it's a platform-availability one.

— Jamie

---

### Ticket 14 — "Is this safe for someone on heart medication / pregnant / with a pacemaker?"

**Priority:** CRITICAL
**Category:** Medical / safety — escalate-adjacent

**Draft response:**

Hi {{first_name}},

Thank you for asking before using it — that's the right instinct.

The honest answer is: I'm not in a position to clear you to use any audio practice, and RESONATE specifically is not a medical device and isn't designed to be used as one. It does not diagnose, treat, cure or prevent any condition, including any cardiac condition. The biometric readings inside the app are practice indicators, not clinical measurements, and shouldn't be interpreted as either.

If you're on medication that affects heart rate, are pregnant, have a pacemaker, or are managing a cardiac condition, please run it past your prescribing clinician or cardiologist before adopting any new breath or audio practice — not just RESONATE. They know your situation; I don't.

If after that conversation you decide it isn't for you right now, the 14-day refund window applies and I'll process it the same day you ask. No questions.

— Jamie

---

### Ticket 15 — "I'm a researcher / journalist / clinician — can I talk to you about the science?"

**Priority:** MEDIUM
**Category:** Outreach — escalate to founder

**Draft response:**

Hi {{first_name}},

Yes, gladly. The short version of the science: RESONATE leans on three lines of work — Loewi's 1921 vagus-nerve / acetylcholine mechanism, Lehrer and colleagues' 1990s identification of the autonomic resonance frequency near 0.1 Hz, and the 2025 Lancet meta-analysis on music therapy and anxiety. The closed loop combines those by steering generative music against a measured breath and HRV signal in real time. The "0.1 Hz coherence ramp" inside the Calm mode is the direct instrumentation of Lehrer's resonance work; the Focus mode (40 Hz gamma) and Rest mode (2 Hz delta) are framed honestly as practice targets, not clinical outcomes.

It's a wellness practice — I do not make clinical efficacy claims and would push back politely on any reporting that did. Happy to share the build notes on what's measured, what's inferred, and what's deliberately conservative.

What would help me reply usefully — what's the angle, and what's your deadline?

— Jamie

---

## Section 2 — Escalation triggers

Most tickets close in-band with the drafts above. The cases below come to Jamie directly and *only* Jamie — never field them with a templated reply.

### Escalate to founder immediately (same day, often same hour)

- **Adverse event report** — anyone who says RESONATE triggered an unwanted physiological response (panic, palpitations, dizziness, vertigo from spatial audio). Acknowledge receipt within the hour, then escalate. Do not draft a "have you tried…" response. The disclaimer language matters here.
- **Press, podcast, or journalism request** — any inbound from a publication, reporter, or podcaster. Founder owns positioning under the lineage and the moat framing; a templated reply would burn the relationship.
- **Clinician or researcher outreach** — see Ticket 15. Founder owns these because the wording on what RESONATE does and doesn't claim is load-bearing.
- **Legal or regulatory contact** — anything from a regulator, a lawyer, a copyright holder, or an Apple App Review escalation. Do not reply. Forward intact.
- **Bulk / institutional purchase request** — schools, clinics, labels, corporate wellness teams asking for 10+ seats. Founder sets pricing case by case; do not quote.
- **Refund disputes that escalate beyond Section 4** — chargebacks, Gumroad arbitration, anything threatening public escalation.
- **Reports of the closed loop failing in a way that suggests a real bug** — multiple users on the same iOS version reporting the same crash signature. Patch coordination is a founder call.

### Handle in-band (Compass / templated reply is fine)

- Hardware compatibility questions (Tickets 1, 4, 13)
- "Where's my link" (Ticket 12)
- Refund requests inside the 14-day window with no special circumstances (Ticket 5)
- Cancellation confusion (Ticket 11)
- Privacy questions answered by the existing language (Ticket 9)
- Feature roadmap questions (Tickets 8, 15 partial)
- General "how does this compare" pre-purchase (Tickets 3, 10)

### The trip-wire test

If you find yourself drafting a reply that contains the phrase *"in my experience"*, *"I'd recommend"* about anything medical, or any commitment about a future release date — stop and escalate. Those three patterns are the most common ways an in-band reply quietly becomes a problem.

---

## Section 3 — Brand-voice guardrails for support

The support voice is the same voice that ships on the landing page and the Gumroad listing: lineage-aware, engineering-precise, no fluff. The reader bought a AU$30 lifetime product from a one-person studio, not a SaaS subscription with a 24/7 chatbot — they expect a human, and they should get one.

### Tone

- **Acknowledge first, mechanism second.** Every reply opens by naming what the person is actually feeling or asking, not with "Thanks for reaching out."
- **Honest over polished.** If you don't know, say you don't know. If a feature isn't there, say it isn't there. The Gumroad FAQ already trained users to expect this register — match it.
- **Engineering-precise.** Give the model number, the iOS version, the API name, the latency figure. Vague reassurance reads as cover; specifics read as competence.
- **Lineage-aware.** When the topic touches the science (coherence, vagus, 0.1 Hz), the language from the landing page is on-brand — Loewi 1921, Lehrer 1995, Lancet 2025. Use sparingly, only when relevant.
- **One human ending.** Sign every reply `— Jamie / wiggjamie9@gmail.com`. Never "The RESONATE team" — there is no team.

### What NOT to say

- **No medical claims, ever.** Not "treats anxiety", not "fixes insomnia", not "lowers blood pressure", not "is clinically proven". Use "designed to support", "associated with the coherence research", "honours the lineage of". This is on-brand *and* legally load-bearing.
- **No off-brand verbs.** From the brand brief: not "optimize", "hack", "supercharge", "unleash", "ultimate", "AI-powered" (say "real-time generative"), "neural", "mind-blowing", "transform", "revolutionary", "journey".
- **No emoji.** None. Not even a tasteful one.
- **No fake urgency.** Don't say "this offer expires soon" unless it factually does. Don't pressure on refunds.
- **No promised dates on roadmap items.** "Soon", "in the next content drop", "on the roadmap" — yes. "By July", "in Q3", "next month" — no. If you promise a date you can't keep, you've poisoned the trust the lifetime model depends on.
- **No "as an AI assistant"** disclaimers, no "I'd be happy to". The voice is a person.
- **No corporate hedging.** "Unfortunately, we are unable to" → "I can't do that, here's why." Direct.

### When to break script

- If someone is in genuine distress — a panic-attack report, a mental-health crisis surfaced in a ticket, a bereavement context — the templated empathy line is not enough. Drop the support frame. Acknowledge the human, point them to actual crisis resources (Lifeline in AU: 13 11 14 // Samaritans UK: 116 123 // 988 in the US), refund unconditionally if relevant, and escalate to Jamie.
- If someone is paying you a real compliment with substance ("the third session of Calm got me through a panic attack"), break the response template and write back something genuinely personal. Those replies become the testimonials that sell the next 100 units.
- If a ticket reveals a *real* bug pattern (two or more reports of the same crash signature on the same iOS), break out of "draft a reply" and into "write a status update for the founding-members Discord". Transparency on real bugs is brand-positive.
- If a refund request is wrapped in a long explanation of why the product didn't land, the most on-brand response is to refund *first*, then thank them for the feedback in detail. Reversing that order reads as gatekeeping.

### The one-question test

Before sending, ask: *would I send this if Jamie were standing behind me?* If the answer is no — the tone is too corporate, the promise is too loose, the medical claim is too strong, the empathy is too thin — rewrite.

---

## Section 4 — Refund handling

### Policy (mirror the Gumroad listing exactly)

> 14 days, no questions. After 14 days, refunds are at my discretion — write to me and we'll work it out.

In practice: inside 14 days, refund. Outside 14 days, default to refund unless the request is obviously abusive (multi-purchase chargeback farming, post-launch resale fraud). The downside of refunding a marginal case is AU$30; the downside of refusing one is a public review and a lifetime member who tells their network. AU$30 is cheap.

### Step-by-step process

1. **Receive the request.** Either inbound to `wiggjamie9@gmail.com` with a receipt, or surfaced via Gumroad's refund-request UI.
2. **Confirm the order.** Open Gumroad → Sales → search the buyer's email. Confirm the AU$30 RESONATE charge and the purchase date. Calculate days since purchase.
3. **Decide.** Inside 14 days → grant. Outside 14 days and reason is genuine → grant. Outside 14 days and reason is suspicious or hostile → see "denied" template, escalate to Jamie before sending.
4. **Process in Gumroad.** Sales → the order → Refund → full amount (AU$30). Gumroad handles the card-side reversal; arrival is 3–5 business days depending on bank.
5. **Send the appropriate email** (templates below). Use the granted template by default; only use the denied template after a Jamie review.
6. **Tag the order.** In your support log, tag the refund with the *reason* in one short phrase (e.g. `android`, `calm-not-landing`, `couldnt-pair-airpods`, `medical-precaution`). The tags become the input for next quarter's product call — what's actually causing refunds.
7. **Do not follow up to "win back".** A refunded user gets one closing email (the granted template) and silence after. No marketing list, no "we'd love to have you back". On-brand restraint.

### Email template — refund granted

```
Subject: Refunded — your AU$30 is on its way back

Hi {{first_name}},

Done — I've processed your refund for the AU$30 RESONATE purchase from
{{purchase_date}}. The reversal usually lands back on the same card
within 3–5 business days, sometimes sooner depending on your bank. You
won't see a separate charge from me; it'll appear as a credit against
the original Gumroad transaction on your statement.

If at any point you'd like to try RESONATE again — whether a fix shipped,
a new hardware piece landed in your kit, or the timing's just better —
the door is open and the price is the same.

If you have two minutes, I'd genuinely value knowing what didn't land.
One line is enough. The tags from refund replies are the most useful
product feedback I get, and they go directly into what I build next.

Thank you for trying it.

— Jamie
wiggjamie9@gmail.com
```

### Email template — refund denied (use sparingly, after Jamie review)

```
Subject: About your refund request

Hi {{first_name}},

Thank you for writing — I want to be straight with you about where I've
landed on this one, and why.

Your purchase was on {{purchase_date}}, which is {{n}} days outside the
14-day refund window stated on the product page. The reason I'm not
processing the refund in this case is {{specific_reason — e.g. "this is
the third refund request linked to the same card across our products
and the pattern reads as chargeback rather than genuine dissatisfaction"
/ "the request came in after a documented full-feature use of the app
over an extended period"}}.

I want to be clear that this is a judgement call and not a hard policy
position — if I've misread the situation, please reply with anything
you'd like me to know and I'll reconsider. I'd rather be wrong toward
the user than toward the policy on something this small.

If after that you'd still like to pursue it through Gumroad's own
dispute process, that route is open to you — Gumroad's support is at
help@gumroad.com.

— Jamie
wiggjamie9@gmail.com
```

### Edge cases worth flagging in the log

- **Refund + the user keeps using the app.** RESONATE is on-device with no kill switch — a refunded user can keep practising. That's a deliberate choice; do not try to revoke access. The relationship ended cleanly with the refund.
- **Refund requested because of a hardware mismatch we should have caught** (Android, AirPods 2, no Watch) — refund unconditionally regardless of window. The honest read is the landing page didn't communicate the requirement loudly enough, and that's on us.
- **Refund + a real bug** — refund and *also* add the bug signature to the founder's queue. The two actions are independent; do both.
- **Chargeback opened on Gumroad** — do not contest reflexively. Read the dispute reason. If it's clearly fraud (unauthorized card), let it process and tag the order. If it's a misunderstanding, reach out to the buyer directly before deciding to contest.

---

## End of kit

Read Section 3 once a week. The voice is the product — getting it wrong in support is the same as getting it wrong on the landing page, except the audience is the person who already paid.

— Jamie
wiggjamie9@gmail.com
