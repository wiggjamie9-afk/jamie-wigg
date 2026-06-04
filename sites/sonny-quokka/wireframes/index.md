# Wireframe: Sonny's Cozy Quokka Bedtime Tales — Landing Page

**File:** `sites/sonny-quokka/index.html`
**Target:** Single-page mobile-first landing page
**Goal:** Drive YouTube subscriptions and same-night episode views
**Audience:** Parents of toddlers aged 1–5, browsing on phone at bedtime

---

## Component Inventory

### Typography Hierarchy

| Token | Element | Spec |
|---|---|---|
| `--t-display` | Hero H1 | 2.4rem / 700 weight / tight leading (1.1) |
| `--t-h2` | Section headings | 1.6rem / 700 weight / leading 1.2 |
| `--t-h3` | Card headings | 1.05rem / 600 weight |
| `--t-body` | Body paragraphs | 1rem / 400 weight / leading 1.65 |
| `--t-caption` | Captions, footnotes | 0.8rem / 400 weight / muted opacity |
| `--t-label` | Button labels | 1rem / 700 weight / uppercase tracking |

### Colour Tokens (to be finalised in styleguide stage)

| Token | Role | Direction |
|---|---|---|
| `--c-sky` | Hero gradient top | Deep midnight blue (`#0d1b2a`) |
| `--c-horizon` | Hero gradient bottom | Warm dusk purple (`#2d1b4e`) |
| `--c-warm` | Accent / CTA background | Amber-gold (`#f5a623`) |
| `--c-warm-hover` | CTA hover | Deeper amber (`#d4891a`) |
| `--c-surface` | Card background | Soft off-white (`#faf7f2`) |
| `--c-navy-card` | Episode thumbnail card | Dark navy (`#0f2040`) |
| `--c-text` | Body text | Charcoal (`#1a1a2e`) |
| `--c-text-muted` | Captions, subtext | Mid-grey (`#6b7280`) |
| `--c-section-warm` | Subscribe section bg | Warm cream (`#fff8ee`) |

### Buttons

**Primary CTA** (`btn-primary`)
- Background: `--c-warm`; text: `#fff`; border-radius: 9999px (pill)
- Padding: `14px 32px`; font-weight: 700; font-size: 1rem
- Hover: background `--c-warm-hover`, scale `1.02`, box-shadow lift
- Active: scale `0.98`
- Width: `100%` on mobile; `auto` (min-width 220px) on desktop
- Used in: Hero, Watch section, Subscribe section

**Secondary CTA** (`btn-secondary`)
- Background: transparent; border: 2px solid `--c-warm`; text: `--c-warm`
- Same pill shape and padding as primary
- Hover: background fills `--c-warm` at 10% opacity
- Used in: Watch an Episode section (underneath thumbnail card)

### Cards

**Trust Card** (`card-trust`)
- White background, 12px border-radius, subtle shadow (`0 2px 12px rgba(0,0,0,0.07)`)
- Padding: `24px 20px`
- Emoji icon: `2rem`, block, `margin-bottom: 12px`
- Heading: `--t-h3`
- Body: `--t-body`, `--c-text-muted`
- Mobile: full-width stack; Desktop: 3-column flex row, equal width

**Episode Thumbnail Card** (`card-episode`)
- Background: `--c-navy-card`; border-radius: 12px; `aspect-ratio: 16/9`
- Centre-aligned play button icon (white circle, triangle inside): `64px`
- Subtle inner glow on hover: `box-shadow: inset 0 0 0 2px rgba(245,166,35,0.4)`
- Caption below card: `--t-caption`, left-aligned

### Background Particle Layer (`particles-bg`)
- Hero section only
- Small CSS-animated dots (stars/fireflies): `2–4px` circles, `opacity: 0.4–0.8`
- Animation: slow fade-pulse, `animation-duration: 3–6s`, staggered delays
- Absolutely positioned, `pointer-events: none`, `z-index: 0`
- 20–30 particles placed via inline styles or a lightweight JS scatter
- Colour: white/soft-gold mix

### Sonny Illustration Placeholder (`sonny-hero-art`)
- Large emoji or CSS-art quokka face, centred
- Minimum size: `120px × 120px` on mobile
- Soft drop shadow, slight float animation: `translateY(-6px)` on 3s ease loop
- Golden-brown fill, big warm eyes hinted with CSS shapes (or 🦘 emoji fallback at `6rem`)
- Note: replace with illustrated SVG or PNG at design stage

---

## Section 1 — HERO `#hero`

### Purpose
Instant emotional hook. Parent sees: calm, Australian, free, tonight. Single action.

### Layout (Mobile — full viewport height, `100dvh`)

```
┌─────────────────────────────────────────┐
│  [particles-bg — stars/fireflies]        │
│                                          │
│          🦘  (Sonny art, ~120px)         │  ← centred, floats gently
│                                          │
│  "Calm bedtime stories                   │  ← H1, --t-display, white
│   your toddler will love"               │
│                                          │
│  "New episode every night. Free on       │  ← subheadline, ~1rem, white 80%
│   YouTube. Sonny the Quokka             │
│   is waiting."                          │
│                                          │
│  [ Watch Free on YouTube →  ]           │  ← btn-primary, full-width
│                                          │
│           ↓  (subtle scroll cue)         │
└─────────────────────────────────────────┘
```

### Layout (Desktop — centred column, max-width 720px)
- Sonny art scales to `180px`
- H1 becomes `3.2rem`
- CTA button `auto` width, centred
- Particle count doubles for wider viewport

### Copy

| Element | Final Copy |
|---|---|
| H1 | Calm bedtime stories your toddler will love |
| Subheadline | New episode every night. Free on YouTube. Sonny the Quokka is waiting. |
| CTA label | Watch Free on YouTube → |

### Background
- CSS gradient: `linear-gradient(160deg, #0d1b2a 0%, #2d1b4e 100%)`
- Particles layer above gradient, below content

### Interaction Notes
- Sonny art: float keyframe, `transform: translateY(0px)` → `translateY(-8px)` → back, `3s ease-in-out infinite`
- CTA: hover scale `1.02`, background deepens, transition `150ms ease`
- Scroll cue: faint animated chevron or dot at bottom, fades after first scroll event

### Accessibility
- H1 is the page's only `<h1>`
- CTA `href` links to YouTube channel (supplied at design stage)
- Particle layer: `aria-hidden="true"`

---

## Section 2 — WHAT IS THE SHOW? `#what`

### Purpose
Brief, reassuring explanation of the show for parents who landed cold. Answers: what is it, who is Sonny, is it calm, is it Australian.

### Layout (Mobile)

```
┌─────────────────────────────────────────┐
│                                          │
│  What is Sonny's Cozy Quokka            │  ← section H2, --t-h2, centred
│  Bedtime Tales?                         │
│                                          │
│  [paragraph — 3–4 sentences]            │  ← --t-body, left-aligned,
│                                          │    max-width 60ch, centred block
│                                          │
│  🌿  Australian animals and nature      │  ← feature list items, 
│  🎙️  Gentle voice-over narration        │    each on own line,
│  🌙  New episode every single day       │    icon + label inline
│                                          │
└─────────────────────────────────────────┘
```

### Layout (Desktop)
- Section max-width `700px`, horizontally centred
- Feature list: remains stacked (not a grid) — it reads as a tight vertical checklist

### Background
- White or very light warm-off-white (`#fdfaf6`)
- Generous vertical padding: `64px 0` mobile, `80px 0` desktop

### Copy

| Element | Final Copy |
|---|---|
| Section heading | What is Sonny's Cozy Quokka Bedtime Tales? |
| Body paragraph | Sonny's Cozy Quokka Bedtime Tales is a free YouTube channel made especially for toddlers at bedtime. Every episode follows Sonny — a golden-brown quokka with big, warm eyes — as he wanders the quiet Australian bush at night, meeting friendly animals and watching the stars come out. Stories unfold slowly and peacefully, with no loud sounds, no conflict, and no startling moments. Just soft narration, gentle music, and the calm of a sleepy bush night. |
| Feature item 1 | 🌿 Australian animals and nature |
| Feature item 2 | 🎙️ Gentle voice-over narration |
| Feature item 3 | 🌙 New episode every single day |

### Interaction Notes
- No interactive elements in this section
- Feature list items: no hover state needed; they are static text

---

## Section 3 — WHY PARENTS LOVE IT `#why`

### Purpose
Build trust with parents. Address the three core objections: Is it calm? Will we run out of content? Is it appropriate?

### Layout (Mobile — stacked cards)

```
┌─────────────────────────────────────────┐
│                                          │
│  Made for bedtime. Made for toddlers.   │  ← section H2, centred
│                                          │
│  ┌─────────────────────────────────┐    │
│  │  💤                              │    │
│  │  No conflict, no drama           │    │  ← card-trust #1
│  │  Calm stories with no startling  │    │
│  │  sounds or scenes — just peace   │    │
│  │  and gentle wonder.              │    │
│  └─────────────────────────────────┘    │
│                                          │
│  ┌─────────────────────────────────┐    │
│  │  📅                              │    │
│  │  New episode every day           │    │  ← card-trust #2
│  │  Never run out of bedtime        │    │
│  │  content — a fresh story uploads │    │
│  │  automatically every single day. │    │
│  └─────────────────────────────────┘    │
│                                          │
│  ┌─────────────────────────────────┐    │
│  │  ✅                              │    │
│  │  Safe for little eyes            │    │  ← card-trust #3
│  │  Gentle pace, soft colours,      │    │
│  │  made-for-kids certified. You    │    │
│  │  can hand over the phone.        │    │
│  └─────────────────────────────────┘    │
│                                          │
└─────────────────────────────────────────┘
```

### Layout (Desktop — 3-column row)

```
┌──────────┐  ┌──────────┐  ┌──────────┐
│  💤      │  │  📅      │  │  ✅      │
│  No      │  │  New     │  │  Safe    │
│ conflict │  │ episode  │  │  for     │
│ no drama │  │ every day│  │ little   │
│          │  │          │  │  eyes    │
└──────────┘  └──────────┘  └──────────┘
```

Cards: `display: flex; gap: 20px` on desktop. Each card `flex: 1`. Cards same height (`align-items: stretch`).

### Background
- Warm soft-grey or light sage (`#f5f2ef`) — visually separates from #what section

### Copy

| Element | Final Copy |
|---|---|
| Section heading | Made for bedtime. Made for toddlers. |
| Card 1 heading | No conflict, no drama |
| Card 1 body | Calm stories with no startling sounds, no scary moments, and no conflict of any kind — just peace and gentle wonder before sleep. |
| Card 2 heading | New episode every day |
| Card 2 body | Never run out of bedtime content. A fresh story uploads automatically every single day, so Sonny is always ready when you are. |
| Card 3 heading | Safe for little eyes |
| Card 3 body | Gentle pace, soft colours, and made-for-kids certified content. You can hand over the phone and let the bedtime routine do its work. |

### Interaction Notes
- Cards: subtle lift on hover on desktop (`transform: translateY(-3px)`, `box-shadow` deepens), `transition: 200ms ease`
- No hover state on mobile (touch)

---

## Section 4 — WATCH AN EPISODE `#watch`

### Purpose
Reduce friction — let a parent preview before committing to subscribe. Direct path to YouTube.

### Layout (Mobile)

```
┌─────────────────────────────────────────┐
│                                          │
│  See it for yourself                    │  ← section H2, centred
│                                          │
│  ┌─────────────────────────────────┐    │
│  │                                  │    │
│  │         [dark navy card]         │    │
│  │                                  │    │  ← card-episode
│  │              ▶                   │    │     16:9 aspect ratio
│  │         (play icon)              │    │
│  │                                  │    │
│  └─────────────────────────────────┘    │
│                                          │
│  Sonny the Quokka Watches the Stars     │  ← caption text, --t-caption
│  — a fan favourite                      │
│                                          │
│  [ Watch this episode free →  ]         │  ← btn-secondary, full-width
│                                          │
│  A new episode uploads automatically    │  ← note text, --t-caption,
│  every single day.                      │    centred, muted colour
│                                          │
└─────────────────────────────────────────┘
```

### Layout (Desktop)
- Card max-width `560px`, centred
- CTA button `auto` width beneath card

### Implementation Note
At design stage: prefer an `<iframe>` YouTube embed (with `loading="lazy"` and `title` attribute) over the placeholder card. If embed is not desired (to avoid YouTube autoplay or cookie consent complexity), the dark navy card with play icon links directly to the YouTube URL. Both approaches are valid — the placeholder card is the wireframe-stage representation.

### Background
- Return to white or near-white (`#ffffff`) — alternating section backgrounds aid visual rhythm

### Copy

| Element | Final Copy |
|---|---|
| Section heading | See it for yourself |
| Caption | Sonny the Quokka Watches the Stars — a fan favourite |
| CTA label | Watch this episode free → |
| Note text | A new episode uploads automatically every single day. |

### Interaction Notes
- Placeholder card: hover adds amber inner glow and slight scale `1.01` on desktop
- CTA button (secondary): hover fills background lightly, transitions `150ms`
- If using YouTube embed: standard YouTube player controls; no custom JS required

---

## Section 5 — SUBSCRIBE CTA `#subscribe`

### Purpose
Closing emotional beat. One action. Leave parents feeling warm, ready to hand the phone to their toddler.

### Layout (Mobile)

```
┌─────────────────────────────────────────┐
│                                          │
│         🌙  ✨  🌿                       │  ← decorative emoji row,
│                                          │    centred, 2rem, loose spacing
│                                          │
│  A bedtime story is waiting             │  ← H2, --t-h2, centred, 
│  for your little one tonight.           │    white or deep navy text
│                                          │
│  Subscribe free. New episode every      │  ← subtext, --t-body, centred,
│  day. Sonny can't wait to say           │    muted
│  goodnight.                             │
│                                          │
│  [ Subscribe on YouTube — it's free ]  │  ← btn-primary, full-width
│                                          │
│  ─────────────────────────────────────  │  ← thin rule, 1px, muted
│                                          │
│  Sonny's Cozy Quokka Bedtime Tales      │  ← footer note, --t-caption,
│  New episodes 7am, 1pm & 7pm AEST       │    centred, muted
│                                          │
└─────────────────────────────────────────┘
```

### Layout (Desktop)
- Section max-width `600px`, horizontally centred
- All content centred
- More generous vertical padding: `96px 0`

### Background
- Warm cream: `--c-section-warm` (`#fff8ee`) with a very faint radial glow at centre (CSS `radial-gradient`) — gives a lantern-lit warmth
- Or: reverse to the dark hero gradient (`--c-sky` → `--c-horizon`) for stronger bookend effect. Both are valid — decide at design stage. **Recommendation:** use dark gradient for visual symmetry with the hero.

### Copy

| Element | Final Copy |
|---|---|
| Decorative | 🌙 ✨ 🌿 |
| H2 | A bedtime story is waiting for your little one tonight. |
| Subtext | Subscribe free. New episode every day. Sonny can't wait to say goodnight. |
| CTA label | Subscribe on YouTube — it's free |
| Footer note | Sonny's Cozy Quokka Bedtime Tales | New episodes 7am, 1pm & 7pm AEST |

### Interaction Notes
- CTA button: same hover behaviour as Hero CTA (`1.02` scale, deeper amber)
- Footer note: no link, static text
- No other interactive elements

---

## Mobile Layout Notes (Global)

- **Base font size:** `16px` (browser default); no overrides that break accessibility zoom
- **Horizontal padding:** `20px` on mobile (`padding: 0 20px`); `auto` margins on desktop content columns
- **Section vertical rhythm:** `56px 0` padding per section on mobile; `80px 0` on desktop
- **Max content width:** `680px` centred on desktop for readability; hero content column `720px`
- **No horizontal scroll:** all elements `max-width: 100%`; images and cards `box-sizing: border-box`
- **Tap targets:** all interactive elements minimum `44px` tall (WCAG 2.5.5)
- **Section order on mobile = section order in HTML** — no reordering via CSS (preserves logical tab order)
- **Cards in #why:** `gap: 16px` between stacked cards on mobile

### Breakpoint
Single breakpoint at `min-width: 640px` (or `min-width: 600px`). Trust cards switch from stacked → 3-column row. No other structural layout changes — the page reads cleanly as a single column at all sizes.

---

## Interaction Notes (Global)

### CTA Colour Logic
- All primary CTAs: `--c-warm` amber background (`#f5a623`), white text
- Hover: `--c-warm-hover` (`#d4891a`), scale `1.02`, `box-shadow: 0 4px 16px rgba(245,166,35,0.35)`
- Active/pressed: scale `0.98`, shadow removed
- Focus-visible: `outline: 3px solid #f5a623; outline-offset: 3px` (keyboard accessibility)
- Transition on all states: `all 150ms ease`

### Secondary CTA Colour Logic
- Border + text: `--c-warm`
- Hover: `background: rgba(245,166,35,0.08)`, border stays, text stays
- Focus-visible: same amber outline as primary

### Scroll Behaviour
- `scroll-behavior: smooth` on `<html>` for any in-page anchor links
- No sticky header required (single page, single action)

### Reduced Motion
- All animations (Sonny float, particle pulse, card hovers) wrapped in `@media (prefers-reduced-motion: reduce)` that disables `animation` and `transition`

### Link Targets
- All YouTube CTAs: `target="_blank" rel="noopener noreferrer"`
- No other external links on the page

---

## Full Page Structure Summary

```
<body>
  <main>
    <section id="hero">        Hero — H1, subheadline, Sonny art, primary CTA
    <section id="what">        What is the show — H2, paragraph, 3-item feature list
    <section id="why">         Why parents love it — H2, 3 trust cards
    <section id="watch">       Watch an episode — H2, thumbnail card, secondary CTA
    <section id="subscribe">   Subscribe CTA — H2, subtext, primary CTA, footer note
  </main>
</body>
```

No navigation bar. No footer. No sidebar. One column, one goal.

---

## Notes for Design Stage

1. Replace `🦘` / quokka emoji placeholder in `#hero` with an illustrated SVG or PNG of Sonny — golden-brown, round body, big eyes, small friendly smile. The CSS float animation should be applied to the `<img>` or `<svg>` wrapper.
2. The YouTube channel URL is a placeholder in this wireframe — insert real channel and video URLs before publishing.
3. Episode thumbnail card in `#watch`: if a real YouTube embed is used, set `width="100%" style="aspect-ratio:16/9; border:none; border-radius:12px"` and add a `<noscript>` fallback link.
4. Made-for-kids certification language in the #why card 3 ("made-for-kids certified") should be verified for accuracy against the actual YouTube channel settings before going live.
5. Consider a `<link rel="preconnect" href="https://www.youtube.com">` in `<head>` if the YouTube embed is used, to reduce embed load latency.
6. Episode upload times in the footer note (7am, 1pm, 7pm AEST) are to be confirmed by the channel owner before publishing.
