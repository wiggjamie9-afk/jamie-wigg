# Brand Style — Visual Identity for AI-Generated Slides

> **DRAFT.** Lifted directly from `rhythmix-teaser-60s/DESIGN.md` so visuals match the existing video and landing-page identity. Edit if your IG / LinkedIn carousel visuals should diverge.

## Brand brief

- **Primary background:** `#08050d` — near-black with violet bias. Canvas on every slide.
- **Accent colours (max 2 per slide):** `#ff1f5a` (primary magenta — CTA, emphasis) and `#7c3aed` (secondary purple). Use cyan `#00d8ff`, signal green `#00e887`, hot gold `#f5c000` sparingly for stats and highlights.
- **Background texture / pattern:** subtle radial glow from the brand magenta at 30% opacity, anchored bottom-left or behind the main number. No full-frame linear gradients (banding). No noise overlay.
- **Style direction:** modern grotesque + photoreal-mono mix. Headlines render large in a Space Grotesk-style display sans. Numbers are heroes. Photoreal product / device mockups when needed; otherwise minimal flat with localised glow.
- **Typography:**
  - Display: `Space Grotesk` or close grotesque sans, very tight tracking, weight 700–800.
  - Mono: `JetBrains Mono` for labels, slide numbers, taglines, and microcopy.
- **Repeating visual components:**
  - **Stat slab** — a single number in display weight 800, 25–30% of slide height, with a one-line mono caption underneath.
  - **Tag pill** — small mono uppercase text in a coloured pill (magenta / cyan / green) for category labels.
  - **Comparison split** — two-column layout for "X vs Y" slides; the favoured side glows magenta, the losing side desaturated.
- **Avatar / character:** none consistently — the brand persona is the copy, not a face. [CONFIRM: do you want a recurring avatar or wordmark on cover slides?]
- **Closing element:** every slide bottom-right: handle `@theaiimpact` in mono, 10–12pt, soft white at 70% opacity. Cover slide: full RHYTHMIX wordmark, magenta-to-purple gradient.
- **Aspect ratio:** `4:5` for IG carousels (default). `1:1` for square tests. `9:16` only for TikTok stills.

## Brand block (paste at top of every Nano Banana prompt)

> Keep this under 400 characters. Counted: 388.

```
Dark near-black canvas (#08050d) with violet bias and a soft magenta radial glow bottom-left. Saturated accent magenta (#ff1f5a) and purple (#7c3aed); cyan, green, gold used sparingly. Modern grotesque sans display (Space Grotesk style) for headlines, JetBrains Mono for labels and microcopy. Numbers are largest. No full-frame gradients, no bounce. 4:5 aspect ratio. Handle "@theaiimpact" mono bottom-right.
```

## What NOT to do

- No `#3b82f6`, no `#333`, no Roboto / Arial — palette and type are fixed.
- No linear full-frame gradients (causes banding on export).
- No emoji in slide text. One icon glyph per supporting card max.
- No bouncy or elastic motion in any motion-graphics overlay.
- No headline smaller than the largest stat.
- No subhead with a `/` separator (Nano Banana parses `A / B` as repeat-A; rewrite as "First line: A. Second line: B.").
