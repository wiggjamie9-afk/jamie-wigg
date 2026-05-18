# Codex of Reality — Styleguide

Codified from the AU$30 pricing screen Jamie shared + the TikTok grid aesthetic.

## Tokens

### Color

| Token | Hex | Use |
|---|---|---|
| `--ink` | `#0a1628` | page background (deep navy, near-black) |
| `--ink-2` | `#0f1d33` | elevated surfaces, cards |
| `--ink-3` | `#152744` | borders, dividers |
| `--gold` | `#d4a843` | primary accent, CTA, key numbers |
| `--gold-dim` | `#8a6e2d` | borders that nod to gold without shouting |
| `--parchment` | `#f4ecd6` | display text, body copy on dark |
| `--parchment-dim` | `#a89e85` | secondary text, captions |
| `--coherence` | `#5ce5e0` | live coherence rising, "you're in sync" feedback |
| `--alarm` | `#ff3b6b` | TikTok-style attention chips ("Part 1", scarcity) |
| `--success` | `#7fd994` | streak met, session complete |

### Typography

| Token | Stack | Use |
|---|---|---|
| `--font-display` | `'Cormorant Garamond', 'Playfair Display', Georgia, serif` | hero, large statements, prefer italic |
| `--font-ui` | `'Inter', -apple-system, BlinkMacSystemFont, sans-serif` | UI, body copy |
| `--font-mono` | `'JetBrains Mono', 'SF Mono', Menlo, monospace` | small-caps labels, data readouts, technical chrome |

Display sizes:
- `--fs-display`: `clamp(3rem, 8vw, 6rem)` — hero
- `--fs-h1`: `clamp(2rem, 5vw, 3.5rem)` — section headlines
- `--fs-h2`: `clamp(1.5rem, 3vw, 2.25rem)` — sub-sections
- `--fs-body`: `1.0625rem`
- `--fs-small`: `0.875rem`
- `--fs-mono`: `0.75rem` — letter-spaced 0.15em, uppercase

### Spacing

| Token | Value |
|---|---|
| `--sp-1` | `0.5rem` |
| `--sp-2` | `1rem` |
| `--sp-3` | `1.5rem` |
| `--sp-4` | `2rem` |
| `--sp-5` | `3rem` |
| `--sp-6` | `5rem` |
| `--sp-7` | `8rem` |
| `--gutter` | `clamp(1.25rem, 4vw, 3rem)` |
| `--max-w` | `min(64rem, 92vw)` |

### Radius + shadow

- `--r-1`: `4px`
- `--r-2`: `12px`
- `--r-3`: `999px`
- `--shadow-glow`: `0 0 60px -10px var(--gold)`, used sparingly on hero number + active CTA
- `--shadow-coherence`: `0 0 80px -8px var(--coherence)`, on the live orb when in sync

### Motion

- **Pacer (breath orb)**: 10s cycle. 0–50% inhale: scale 0.4 → 1.0, opacity 0.4 → 1.0, blur 8px → 0, easing `cubic-bezier(0.4, 0, 0.6, 1)`. 50–100% exhale: reverse.
- **Beat (heart icon)**: keyframe driven from detected BPM. 120ms expand-and-contract per beat.
- **UI transitions**: 300ms `cubic-bezier(0.2, 0.8, 0.2, 1)`.
- **Coherence number**: smooth interpolation across 800ms when score updates.

No decorative motion. Every animation carries information.

## Components

### CTA button (primary)

```
bg: --gold
text: --ink
font: --font-ui, 600, 1rem
padding: 1rem 2rem
radius: --r-3 (pill)
hover: filter brightness(1.1) + shadow-glow
disabled: opacity 0.4
```

### Chip (TikTok-style)

```
bg: --alarm  // or --gold for "FOUNDING"
text: white  // or --ink
font: --font-ui, 700, 0.875rem
padding: 0.25rem 0.75rem
radius: --r-1
rotation: -1deg (subtle hand-placed feel)
```

### Mono label

```
font: --font-mono, 500, --fs-mono
letter-spacing: 0.15em
text-transform: uppercase
color: --parchment-dim
```

### Section header pattern

```
<mono-label>SECTION 03 · POSITIONING</mono-label>
<h2 class="font-display italic">First in the world.</h2>
<p class="lead">Subhead in --font-ui, sets context in 1–2 sentences.</p>
```

### Data readout (Coherence Engine)

```
Number: --font-mono, 700, 3rem, --gold (or --coherence when rising)
Label: mono-label below
Unit: --font-mono, 400, 0.75rem, --parchment-dim, inline after number
```

## Imagery

- **Texture.** Subtle parchment grain on hero section only, ~3% opacity. Body sections stay clean.
- **Diagrams.** Match the TikTok thumbnail vocabulary — anatomy etchings + circuit overlays + sacred-geometry frames. Inline SVG for crisp scaling.
- **Photos.** Avoid. Photographs break the "ancient codex" feel.

## Voice + copy

- **Decisive, never hedging.** "It works" not "it may work".
- **Specific, never generic.** "5 seconds in, 5 seconds out" not "deep breathing".
- **Authority, then mystery.** Open with the credentialed claim, close with the lineage hook.
- **Numbers as receipts.** "1.2M views", "AU$30", "10 minutes/day" — numbers do the persuading.

## What this styleguide is not

- Not a generic dark-mode design system. The gold + parchment is brand-specific.
- Not subject to A/B testing on aesthetics. Test copy and offer, never the visual identity.
- Not extensible to other Codex brand surfaces without re-codifying — this is the landing page's identity, the in-app identity may differ slightly.
