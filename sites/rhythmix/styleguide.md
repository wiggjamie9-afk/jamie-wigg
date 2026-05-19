# RHYTHMIX — Styleguide

Codified from `rhythmix-teaser-60s/DESIGN.md` and the AU$30 founding-member landing pattern from `sites/codex-of-reality/styleguide.md`. Same nine-section spine, RHYTHMIX brand identity.

## Tokens

### Color

| Token | Hex | Use |
|---|---|---|
| `--bg` | `#08050d` | page background (near-black with violet bias) |
| `--bg-2` | `#0f0a1a` | elevated surfaces, cards |
| `--bg-3` | `#1a1325` | borders, dividers, hairlines |
| `--magenta` | `#ff1f5a` | primary CTA, key emphasis, "play" state |
| `--magenta-dim` | `#7a1234` | hairlines that nod to magenta without shouting |
| `--purple` | `#7c3aed` | secondary accent, gradient pair with magenta |
| `--cyan` | `#00d8ff` | live preview "active" state, signal feedback |
| `--green` | `#00e887` | success, "money in" indicators |
| `--gold` | `#f5c000` | price number, "$$$" earnings receipts |
| `--pink` | `#ff6fc8` | soft accent counts, tertiary chips |
| `--text` | `#ffffff` | display text, body copy on dark |
| `--text-dim` | `#a0a0b0` | secondary text, captions |

### Typography

| Token | Stack | Use |
|---|---|---|
| `--font-display` | `'Space Grotesk', system-ui, sans-serif` | hero, large statements, wordmark, big numbers |
| `--font-ui` | `'Inter', -apple-system, BlinkMacSystemFont, sans-serif` | UI, body copy, CTAs |
| `--font-mono` | `'JetBrains Mono', 'SF Mono', Menlo, monospace` | small-caps labels, data readouts, technical chrome |

Display sizes:
- `--fs-display`: `clamp(3rem, 9vw, 6.5rem)` — hero
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
- `--shadow-magenta`: `0 0 60px -10px var(--magenta)` — on hero price + active CTA
- `--shadow-cyan`: `0 0 80px -8px var(--cyan)` — on the live preview visualiser when playing

### Motion

- **Hero orb**: 7s breathe cycle. Scale 0.96 → 1.04, drop-shadow magenta intensity 0.25 → 0.55. `cubic-bezier(0.4, 0, 0.6, 1)`.
- **Preview visualiser**: 16ms bar updates driven by `AnalyserNode.getByteFrequencyData()`. Idle drift uses 4s sine, low amplitude.
- **UI transitions**: 250ms `cubic-bezier(0.2, 0.8, 0.2, 1)`. Fast in, decisive hold, no bounce.
- **Vibe button stagger**: 60ms between cards on grid reveal.

No bouncy or elastic eases. The motion identity is "confident in, decisive hold" — every animation either informs or holds attention; nothing decorative.

## Components

### CTA button (primary)

```
bg: linear-gradient(135deg, var(--magenta), var(--purple))
text: white
font: --font-ui, 600, 1rem
padding: 1rem 2rem
radius: --r-3 (pill)
hover: translateY(-1px) + box-shadow magenta glow
disabled: opacity 0.4
```

### CTA button (ghost)

```
bg: transparent
text: var(--text)
border: 1px solid color-mix(in srgb, var(--magenta) 40%, transparent)
hover: border-color magenta, text-color magenta
```

### Chip (TikTok-style)

```
bg: var(--magenta)
text: white
font: --font-ui, 700, 0.875rem
padding: 0.3rem 0.75rem
radius: --r-1
rotation: -1.5deg
```

Variants: `.chip.gold` (gold + dark text), `.chip.success` (green + dark text).

### Mono label

```
font: --font-mono, 500, --fs-mono
letter-spacing: 0.15em
text-transform: uppercase
color: var(--text-dim)
```

### Section header pattern

```
<mono-label>SECTION 03 · POSITIONING</mono-label>
<h2 class="display">Everyone else picked one piece.</h2>
<p class="lead">Subhead in --font-ui, sets context in 1–2 sentences.</p>
```

### Vibe button (S2 unique)

```
display: grid
background: var(--bg-2)
border: 1px solid var(--bg-3)
padding: 1.25rem 1rem
radius: --r-2
font-display, 700, 1.125rem
hover: border-color color-mix(in srgb, vibe-color 60%, transparent), transform translateY(-2px)
active (playing): border-color vibe-color, box-shadow 0 0 24px -6px vibe-color
```

Each vibe carries a dedicated color: Anthem → magenta, Cinematic → cyan, Trap → gold, Lofi → purple.

### Data readout (live preview)

```
Label: mono-label
Number: --font-mono, 700, 1.75rem, --magenta (or --cyan when playing)
Unit: --font-mono, 400, 0.75rem, --text-dim, inline after number
Status line: --font-mono, 0.75rem, letter-spacing 0.1em, --text-dim
```

### Price (S7)

```
Currency prefix "AU$": --font-mono, 500, 0.45em vertical-align baseline+0.4em
Amount "30": --font-display, 600, italic-off, gradient text fill (magenta → gold)
Font-size: clamp(5rem, 14vw, 10rem)
Text-shadow: --shadow-magenta
```

## Imagery

- **No photos.** Photography breaks the dark neon synth-house feel.
- **Background grain.** Light noise (~3% opacity) layered on hero only, mix-blend-mode overlay.
- **Glows.** Radial gradients in magenta/cyan/purple. Never full-frame linear gradients (banding).
- **Visualiser.** Inline SVG, 360×360, driven by `AnalyserNode`. Bars or radial spectrum — bars by default.

## Voice + copy

- **Decisive, never hedging.** "Make the music" not "help you make music".
- **Specific, never generic.** "$7,200 from one sync placement" not "monetise your music".
- **Numbers as receipts.** Earnings, follower counts, store counts — these do the persuading.
- **No corporate-AI bromides.** Skip "unleash your creativity" / "elevate your sound" / "empower creators". Say what it does.
- **Anchored to one offer.** AU$30 lifetime. Every section either supports the ask or unlocks the proof.

## What this styleguide is not

- Not the in-studio identity. The dashboard/app may diverge (more controls, less display drama).
- Not extensible to RHYTHMIX video compositions — those live under `rhythmix-*-60s/` and use a slightly looser palette.
- Not subject to A/B tests on aesthetics. Test copy and offer. The visual identity is fixed.
