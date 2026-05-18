# Codex of Reality — home.html wireframe

Single scroll. Mobile-first. Working Coherence Engine demo embedded in S2.

---

## S1 — Hero

```
[mono]  THE CODEX OF REALITY
[display, italic, gold]  Reality has a frequency.
[lead, parchment]
   The first biofeedback platform built for the mystic, not the
   biohacker. Live HRV coherence. 100+ ancient protocols. One price,
   yours forever.

[CTA gold]  Try the Coherence Engine →   (anchor #demo)
[CTA ghost]  Claim Founding — AU$30      (anchor #pricing)

[mono small, parchment-dim]
   AS SEEN ON @CODEX.OF.REALITY  ·  183K FOLLOWERS  ·  935K LIKES
```

Background: deep navy. Faint parchment grain (3% opacity). No images — the typography carries it.

## S2 — Coherence Engine demo  (the unlock)

```
[mono] LIVE DEMO · NO SIGNUP

[h1, italic] Place your finger on your camera.

[two-column on desktop, stacked on mobile]

  [LEFT: Live readout]
    HEART RATE       ___ BPM       (mono, gold)
    COHERENCE        ___ / 100     (mono, coherence-cyan when rising)
    RR INTERVAL      ___ ms        (mono small)
    [status line]    SEARCHING FOR PULSE...

  [RIGHT: The Orb]
    A breathing SVG sphere. Scales 0.4→1.0 over 5s inhale, reverses
    over 5s exhale. Glows brighter when user HR oscillates in sync
    with the pacer (coherence > 60).

    Above the orb: "INHALE" / "EXHALE" text, switches on phase change.
    Below the orb: a faint pulse dot that beats per detected heartbeat.

[CTA]  ▶ Start the demo
[fallback text, parchment-dim]
   Tap to enable camera. Cover the rear camera lens with your fingertip,
   gently. Best results: bright light, still hand. No data leaves your phone.
```

Notes:
- The entire demo runs in-browser. No upload, no signup. State this clearly.
- If permission denied or no pulse after 8s: show breath-pacer-only mode with copy "Breathe with the pacer. We'll show your heart later."
- The "first in the world" claim is *demonstrated*, not asserted. By the time the visitor finishes one 10s cycle with their HR visibly syncing to the pacer, the AU$30 ask is already half-made.

## S3 — Positioning (the "first in the world" three-up)

```
[mono]  WHY IT'S DIFFERENT
[h1, italic]  Everyone else picked one side.

[three columns]
  CLINICAL          ANCIENT             OWNED
  Real-time HRV     Protocols rooted    AU$30 once.
  coherence.        in lineages older   No renewals,
  Same biofeedback  than the word       no subscription
  as HeartMath      "yoga" itself.      traps. Founding
  ($249 sensor).    Sourced. Cited.     members lock in
  In your browser.  Practiced live.     for life.

[h2, italic]
   Nobody else combines them. We do.

[comparison strip, mono small]
  HeartMath        clinical · subscription
  Welltory         clinical · subscription
  Calm / Headspace meditation only · subscription
  Wim Hof          breath only · paid app
  Othership        community · subscription
  Codex of Reality clinical + ancient + owned
```

## S4 — Protocol categories

```
[mono]  THE LIBRARY
[h1, italic]  Four ways in.

[grid 2×2, each card]

  RELEASE                              MANIFEST
  Trauma Shake. Vagus Reset.           Tortoise Breath. Alpha State.
  Fascia Bow. The muscle that          The 3-breath cycle that puts
  traps your anxiety.                  the brain into the state where
                                       reality bends.
  → Watch the original: 1.2M views     → 580K views

  REVERSE                              RECOVER
  The ancient breath patterns          The 5-minute Monk Ritual.
  ancient masters used to do           The Sleep Position that
  ... well, you've seen the videos.    activates the brain's detox.
  → 189K views                         → 247K views
```

Cards use parchment-card style on ink-2 background. Mono numbers for the view counts (these are *receipts*, not claims).

## S5 — Hardware compatibility

```
[mono]  GEAR YOU ALREADY OWN
[h1, italic]  Or none at all.

[badge grid]
  [✓] Your phone camera        included, no setup
  [✓] HeartMath Inner Balance  pairs via HeartCloud API
  [✓] Polar H10 / Verity Sense pairs via Web Bluetooth
  [✓] Apple Watch              Health app sync (iOS app)
  [✓] WHOOP                    Whoop API
  [✓] Garmin / Oura / Fitbit   coming month 2

[caption, parchment-dim]
  Better gear gives sharper data. None of it is required.
  The Coherence Engine works with the camera in your pocket.
```

## S6 — Social proof

```
[mono]  RECEIPTS
[h1, italic]  Numbers, not promises.

[stat strip — mono, oversized]
  1.2M    580K    444K    395K    247K
  views   views   views   views   views

  Across @codex.of.reality on TikTok.
  183K followers. 935K likes. 10 months.

[testimonial slot — to be filled with real DMs / comments]
  ❝ ___ ❞                            ❝ ___ ❞
  — viewer handle                    — viewer handle
```

## S7 — Pricing  (the close)

```
[mono]  FOUNDING MEMBER · LIFETIME
[display, italic]  One price.
[display, italic]  Lifetime in.

[the number — massive, gold, --shadow-glow]
   AU$ 30

[mono]  PAY ONCE · YOURS FOREVER

[bulleted list, mono small]
  · Every frequency, protocol & program
  · The Coherence Engine · Live HRV
  · 30 months of new content
  · No subscription · No renewals

[CTA gold, oversized]  Claim Founding Membership →
[chip alarm]            42 of 500 founding spots claimed   (dynamic / placeholder)

[footnote, parchment-dim]
  Stripe checkout. Australian dollars. International accepted.
  Founding tier capped at 500 — after that, the next tier opens at AU$97.
```

## S8 — FAQ

```
[mono]  QUESTIONS
[h1, italic]  Everything you'd ask.

[accordion]
  Q: Is the camera reading accurate?
  A: Good enough for a coherence practice score, not a clinical metric.
     Pair an HRV chest strap or HeartMath sensor for medical-grade data.

  Q: Is this medical?
  A: No. The Codex is a practice instrument. It does not diagnose,
     treat, or cure. If you have a heart condition, talk to a doctor.

  Q: What does "lifetime" mean exactly?
  A: One AU$30 payment. Access for as long as the Codex exists. No
     renewal date. No price hike that affects your account.

  Q: What if I don't have a HeartMath sensor?
  A: You don't need one. Phone camera gets you 80% of the value.
     Sensor is the upgrade path, not the entry fee.

  Q: When do the next content drops arrive?
  A: Monthly. Each unlock is automatic on your account.

  Q: Refunds?
  A: 14 days, no questions. Cancel via email.
```

## S9 — Footer + email capture

```
[mono]  IF NOT NOW
[h2, italic]  Send me one free protocol.

  [email input]  your@email
  [CTA ghost]   Send it

[caption, parchment-dim]
  We'll send one starter protocol (5 minutes). No spam, no list-sale.

[divider]

[mono small grid]
  CODEX OF REALITY · 2026
  TikTok  ·  Instagram  ·  YouTube
  hello@codexofreality.com
  Privacy · Terms · Refunds
```

---

## Implementation notes for the HTML

- Single self-contained file, no build step (per `sites/README.md` convention)
- Inline `<style>` + inline `<script>`
- Section IDs: `s1-hero`, `s2-demo`, `s3-positioning`, `s4-protocols`, `s5-hardware`, `s6-social`, `s7-pricing`, `s8-faq`, `s9-footer`
- All visual tokens from `styleguide.md` defined as CSS custom properties in `:root`
- CTA buttons: `#pricing` and `#demo` anchors, plus a placeholder Stripe URL for the buy CTA
- Demo script lives at the bottom of `<body>` — `getUserMedia` + RAF loop + the algorithm described in `specs/codex-app/design.md` §Coherence Engine
- Honor `prefers-reduced-motion` — disable orb pulse, keep static circle with copy-only feedback
