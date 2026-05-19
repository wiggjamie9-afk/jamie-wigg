# RHYTHMIX — home.html wireframe

Single scroll. Mobile-first. Working Web Audio preview embedded in S2. Same nine-section spine as `sites/codex-of-reality/home.html`, RHYTHMIX brand applied per `rhythmix-teaser-60s/DESIGN.md`.

---

## S1 — Hero

```
[mono]  RHYTHMIX · FOUNDING MEMBER

[display, white + magenta accent]
   Make the music
   your brain hears.

[lead]
   The complete AI music platform. Generate, master, release, monetise —
   in one place. No subscription. No tier traps. One AU$30 payment, yours
   for life.

[CTA primary]   ▶ Hear it now            (anchor #s2-preview)
[CTA ghost]    Claim Founding — AU$30    (anchor #s7-pricing)

[mono small]
   4,800+ CREATORS  ·  $1.4M PAID OUT  ·  22 STUDIO FEATURES
```

Background: violet-bias ink with localised magenta + cyan glows (radial, never full-frame). A pulsing waveform-orb on the right (or below on mobile) — the visual hero.

## S2 — Live preview (the unlock)

```
[mono]  LIVE PREVIEW · NO SIGNUP · NO UPLOAD

[h1]  Tap a vibe. Hear what it makes.

[two-column on desktop, stacked on mobile]

  [LEFT: vibe selector + readout]
    Four big tap targets:
       ✦ ANTHEM       (magenta)
       🎬 CINEMATIC   (cyan)
       🔥 TRAP        (gold)
       🌙 LOFI        (purple)

    Readout panel (under the buttons):
       VIBE       ___                 (mono, magenta when playing)
       TEMPO      ___ BPM             (mono)
       KEY        ___                 (mono)
       [status]   TAP A VIBE TO BEGIN

  [RIGHT: visualiser]
    A real-time waveform / spectrum SVG canvas, ~360×360.
    Responds to live audio (analyser node) — bars pulse with the
    detected energy. Idle state: a slow ambient drift.

[CTA small, mono] Stop / Pause
[fallback, dim]
   Runs entirely in your browser via Web Audio. Nothing is uploaded.
   Best on headphones — turn the volume up.
```

Notes:
- The audio is procedurally generated with `AudioContext` oscillators + filters. No external samples, no licensing concerns, no payload weight.
- Each vibe is ~8s loop, gentle decay at end, click another button to crossfade.
- Honor `prefers-reduced-motion` — visualiser stays as static waveform; audio still plays only on user gesture.

## S3 — Positioning (the "everyone else picked one piece" three-up)

```
[mono]  WHY IT'S DIFFERENT
[h1]    Everyone else picked one piece.

[three columns]

  CREATE              RELEASE             EARN
  Generate full       Distribute to       Sync licensing,
  tracks in any       Spotify, Apple      fan investment,
  genre in 30s.       Music, TikTok,      VR concerts.
  Master to radio     YouTube, 150+       Three revenue
  quality. Lyrics,    stores. We keep     pipelines that
  vocals, sync.       0% of royalties.    don't need a label.

[h2]
   Nobody else combines all three.
   RHYTHMIX does.

[comparison strip, mono small]
  Suno              create only · subscription
  Udio              create only · subscription
  LANDR             master + distro · subscription
  DistroKid         distro only · subscription
  RHYTHMIX          create + master + distro + sync + invest · AU$30 lifetime
```

## S4 — Categories

```
[mono]  THE STUDIO
[h1]    Four lanes. One deal.

[grid 2×2, each card]

  CREATE                             MASTER
  Text-to-track. Stem split.         AI mastering that hits radio
  Lyric autopilot. Voice clone.      loudness without crushing
  Eight generators inside one        dynamics. Replaces a $500/hr
  workspace.                         engineer.
  → 22 features                      → Pro-grade output

  RELEASE                            EARN
  150+ stores, automatic ISRC,       Sync match to Netflix, Apple TV+,
  TikTok-first metadata. We push     Nike briefs. Fan-investment crowdraising.
  it. You keep 100%.                 VR concert venue. Three streams,
                                     one click.
  → Same-day distribution            → $2.4K avg sync placement
```

Cards use violet card surface, magenta hairline border, mono receipt at the bottom.

## S5 — Distribution + sync

```
[mono]  WHERE YOUR TRACK LANDS
[h1]    150+ stores. Six pipelines.

[badge grid]
  [✓] Spotify · Apple Music              same-day distribution
  [✓] TikTok · Instagram Reels           sound automatically registered
  [✓] YouTube · YouTube Shorts           Content ID monetisation on
  [✓] Sync placements                    Netflix · Apple TV+ · Nike
  [✓] Fan investment                     royalty splits per share
  [✓] VR concert venue                   ticketed live performance

[caption, dim]
  Distribution is included. 100% royalties stay with you.
  We don't take a cut. Ever.
```

## S6 — Receipts

```
[mono]  RECEIPTS
[h1]    Numbers, not promises.

[stat strip — mono, oversized]
  $96K     $7,200    $14.8K    31K       $2.4K
  VR       single    fan       streams   avg sync
  concert  sync      raise     month 1   placement

  4,800+ creators on the platform. $1.4M paid out. 18 months.

[testimonial strip — short pull quotes]
  ❝ Made $7,200 from one sync placement on Apple TV+. ❞     — Sam Wu
  ❝ My VR concert sold $96K in tickets. ❞                   — Nova Vance
  ❝ Raised $14,800 from 148 fans who now earn with me. ❞    — Maya Rivera
```

## S7 — Pricing (the close)

```
[mono]  FOUNDING MEMBER · LIFETIME
[display]   One price.
[display]   Lifetime in.

[the number — massive, magenta+gold gradient, glow shadow]
   AU$ 30

[mono]  PAY ONCE · YOURS FOREVER

[bulleted list, mono small]
  · All 22 studio features
  · Unlimited generations
  · 150+ store distribution
  · Sync · fan-invest · VR venue
  · Every future update included
  · No subscription · No royalties taken

[CTA primary, oversized]    Claim Founding Membership →
[chip alarm]                Founding cap: 500 · 142 claimed   (placeholder)

[footnote, dim]
  Secure checkout via Stripe. Australian dollars, international accepted.
  Founding tier capped at 500 — after that, the next tier opens at AU$149.
```

## S8 — FAQ

```
[mono]  QUESTIONS
[h1]    Everything you'd ask.

[accordion]
  Q: What's the catch with AU$30 lifetime?
  A: There isn't one. We sell founding spots to fund the next 12 months
     of platform work, then the price moves up. Your access doesn't.

  Q: What does "lifetime" actually mean?
  A: One payment. Every feature, every future update, for as long as
     RHYTHMIX exists. No renewals, no "your trial is ending" emails.

  Q: Do I need a DAW, a mic, or any gear?
  A: No. The studio is browser-based. A phone works. Pro gear unlocks
     pro polish — it's never a condition of entry.

  Q: Do you take royalties from my distributions?
  A: No. We push to Spotify, Apple Music, TikTok and 150+ stores; you
     keep 100% of streaming royalties and 100% of sync payouts.

  Q: Refunds?
  A: 14 days, no questions. Email refunds@rhythmixapp.com.au.

  Q: Will the price ever go up?
  A: For new buyers, yes — founding tier closes at 500 members and the
     next tier opens at AU$149. Your AU$30 founding price never changes.
```

## S9 — Footer + email capture

```
[mono]    IF NOT NOW
[h3]      Send me one free track.

  [email input]   your@email
  [CTA primary]   Send it

[caption, dim]
  One starter track in your chosen vibe. No spam, no list-sale.

[divider]

[mono small grid]
  RHYTHMIX · 2026
  TikTok · Instagram · YouTube
  hello@rhythmixapp.com.au
  Privacy · Terms · Refunds
```

---

## Implementation notes for the HTML

- Single self-contained file, no build step (per `sites/README.md` convention)
- Inline `<style>` + inline `<script>` — no external JS, no analytics, no fonts beyond Google Fonts CDN
- Section IDs: `s1-hero`, `s2-preview`, `s3-positioning`, `s4-categories`, `s5-distribution`, `s6-receipts`, `s7-pricing`, `s8-faq`, `s9-footer`
- All visual tokens from `styleguide.md` defined as CSS custom properties in `:root`
- CTA buttons: `#s7-pricing` and `#s2-preview` anchors. Stripe placeholder href in HTML — replace with the live Payment Link before launch.
- Web Audio demo lives at the bottom of `<body>` — `AudioContext` + 4 procedural vibe loops + `AnalyserNode` driving an SVG visualiser. Audio only starts on user gesture (browser autoplay policy).
- Honor `prefers-reduced-motion` — disable visualiser idle drift, keep the hero orb at a single static scale, keep audio gated behind the explicit tap.
