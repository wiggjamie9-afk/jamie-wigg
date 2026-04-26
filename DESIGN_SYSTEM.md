# {{BRAND_NAME}} — Design System

> A cinematic, premium design system for a film-production empire.
> Replace `{{BRAND_NAME}}` with your studio name throughout this document and the accompanying `tokens.json` / `tokens.css` files.

---

## 1. Brand Foundation

| Field | Value |
|---|---|
| **Business** | {{BRAND_NAME}} |
| **Industry** | Film & Entertainment Production |
| **Audience** | Distributors, festival programmers, streaming platforms, talent, prestige-leaning audiences (25–55) |
| **Personality** | Cinematic · Premium · Dramatic · Timeless · Confident |
| **Voice** | Direct. Visual. Restrained. Speaks like a closing credit, not an ad. |
| **Tagline pattern** | `{{BRAND_NAME}} — Stories worth projecting.` |

**Brand promise:** every touchpoint should feel like the opening title card of a film — high contrast, intentional silence around the logo, and a sense that what comes next matters.

---

## 2. Colour Palette

A dark-first palette built around projector-room black, awards gold, and curtain crimson. All colours pass WCAG AA on their listed pairings.

### 2.1 Primary

| Token | Hex | Use |
|---|---|---|
| `--color-primary-900` | `#0A0A0B` | Page backgrounds, hero panels, footer |
| `--color-primary-700` | `#1A1A1D` | Cards on dark backgrounds, modal surfaces |
| `--color-primary-500` | `#2E2E33` | Borders on dark, secondary surface |
| `--color-primary-300` | `#5C5C66` | Muted text on dark |
| `--color-primary-100` | `#B8B8C2` | Disabled text on dark |

### 2.2 Secondary — Awards Gold

| Token | Hex | Use |
|---|---|---|
| `--color-secondary-700` | `#8C6E1F` | Pressed states, deep accents |
| `--color-secondary-500` | `#C9A14A` | Primary brand accent, CTA highlights, awards badges |
| `--color-secondary-300` | `#E3C681` | Hover states, decorative dividers |
| `--color-secondary-100` | `#F4E6BF` | Tinted backgrounds, highlight bands |

### 2.3 Accent — Curtain Crimson

| Token | Hex | Use |
|---|---|---|
| `--color-accent-700` | `#7A1F1F` | Emphatic pressed states |
| `--color-accent-500` | `#B23A3A` | Editorial accent, "Now Playing" tags, marquee |
| `--color-accent-300` | `#D87878` | Subtle emphasis, link hover on dark |

> Use crimson sparingly — no more than ~5% of any composition. It is the "red curtain" moment, not the wallpaper.

### 2.4 Neutrals — Film Stock

| Token | Hex | Use |
|---|---|---|
| `--color-neutral-0`   | `#FFFFFF` | Pure white (rare; prefer `neutral-50`) |
| `--color-neutral-50`  | `#F5F2EC` | Light page background ("film grain white") |
| `--color-neutral-100` | `#EAE6DC` | Card surface on light backgrounds |
| `--color-neutral-200` | `#D6D1C4` | Borders on light |
| `--color-neutral-400` | `#8E8A80` | Secondary text on light |
| `--color-neutral-700` | `#3A3833` | Body text on light |
| `--color-neutral-900` | `#14130F` | Headlines on light |

### 2.5 Semantic

| Token | Hex | Use |
|---|---|---|
| `--color-success` | `#3A8A5C` | Confirmations, "Greenlit" status |
| `--color-warning` | `#D89B2C` | Attention, "In Post" status |
| `--color-danger`  | `#C0392B` | Errors, destructive actions |
| `--color-info`    | `#3B6FA8` | Neutral system messages |

### 2.6 Pairing rules

- **Default surface:** `primary-900` background + `neutral-50` text + `secondary-500` accents.
- **Light editorial surface:** `neutral-50` background + `neutral-900` text + `accent-500` accents.
- Never put `secondary-500` (gold) on `neutral-50` for body copy — fails contrast. Use `secondary-700` instead.

---

## 3. Typography

### 3.1 Font pairing

| Role | Family | Fallback stack |
|---|---|---|
| **Display** | `Playfair Display` (700/900, italic for editorial) | `'Playfair Display', 'Cormorant Garamond', Georgia, serif` |
| **Body / UI** | `Inter` (400/500/600) | `'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif` |
| **Mono / Credits** | `JetBrains Mono` (400/500) | `'JetBrains Mono', 'IBM Plex Mono', Menlo, monospace` |

Display serif handles posters, titles, hero headlines. Inter handles everything functional. Mono is reserved for credits, timestamps, runtime, technical specs — anything that should feel like a slate or end-roll.

### 3.2 Type scale (1.250 — Major Third)

| Token | Size | Line height | Weight | Use |
|---|---|---|---|---|
| `--font-display-xl` | 72 / 4.5rem | 1.05 | 900 | Hero title cards |
| `--font-display-lg` | 56 / 3.5rem | 1.08 | 800 | Page titles |
| `--font-display-md` | 40 / 2.5rem | 1.15 | 700 | Section openers |
| `--font-h1`         | 32 / 2rem    | 1.2  | 700 | Article H1 |
| `--font-h2`         | 24 / 1.5rem  | 1.3  | 600 | Article H2 |
| `--font-h3`         | 20 / 1.25rem | 1.35 | 600 | Card titles |
| `--font-body-lg`    | 18 / 1.125rem| 1.6  | 400 | Lead paragraphs |
| `--font-body`       | 16 / 1rem    | 1.6  | 400 | Default body |
| `--font-body-sm`    | 14 / 0.875rem| 1.55 | 400 | Captions, helper text |
| `--font-mono`       | 13 / 0.8125rem| 1.5 | 500 | Credits, timecode, metadata |
| `--font-overline`   | 12 / 0.75rem | 1.4  | 600 | All-caps labels (`letter-spacing: 0.12em`) |

### 3.3 Rules

- Headlines use display serif. **Never** set body copy in the display serif.
- Tracking: tighten display headlines to `-0.01em`; set overlines at `+0.12em` uppercase.
- Maximum measure: 70 characters for body, 40 characters for display.
- Italics in the display serif are signature — use them for film titles inline (`*The Long Dusk*`).

---

## 4. Spacing & Layout

### 4.1 Spacing scale (4px base)

| Token | px | Use |
|---|---|---|
| `--space-0` | 0 | Reset |
| `--space-1` | 4 | Icon-to-label gap |
| `--space-2` | 8 | Tight inline groups |
| `--space-3` | 12 | Input padding (Y) |
| `--space-4` | 16 | Default gap, card padding |
| `--space-6` | 24 | Card padding (lg), section gaps |
| `--space-8` | 32 | Component separation |
| `--space-12` | 48 | Section padding (Y) on mobile |
| `--space-16` | 64 | Section padding (Y) on tablet |
| `--space-24` | 96 | Section padding (Y) on desktop |
| `--space-32` | 128 | Hero / cinematic breathing room |

> Cinematic layouts breathe. When in doubt, double the whitespace. Empty space is the silence before the cue.

### 4.2 Grid

- **12-column** fluid grid.
- **Max content width:** 1280px (`--container-max`).
- **Editorial reading width:** 720px (`--container-prose`).
- **Gutter:** 24px desktop, 16px mobile.
- **Outer margin:** 32px desktop, 20px tablet, 16px mobile.

### 4.3 Breakpoints

| Token | Min width | Notes |
|---|---|---|
| `--bp-sm` | 640px  | Large phone |
| `--bp-md` | 768px  | Tablet portrait |
| `--bp-lg` | 1024px | Tablet landscape / small laptop |
| `--bp-xl` | 1280px | Desktop |
| `--bp-2xl`| 1536px | Cinema / wide desktop |

### 4.4 Radius, elevation, motion

- **Radius:** `--radius-sm: 2px`, `--radius-md: 6px`, `--radius-lg: 12px`, `--radius-pill: 9999px`. Default to `sm` — the brand is sharp, not rounded.
- **Elevation:** flat by default. Use shadows only for floating UI:
  - `--shadow-sm: 0 1px 2px rgba(10,10,11,0.24)`
  - `--shadow-md: 0 6px 16px rgba(10,10,11,0.32)`
  - `--shadow-lg: 0 24px 48px rgba(10,10,11,0.40)`
- **Motion:** ease the way a camera does.
  - `--ease-cinema: cubic-bezier(0.2, 0.7, 0.1, 1)`
  - Durations: `--dur-fast: 120ms`, `--dur-base: 220ms`, `--dur-slow: 480ms` (scene change).

---

## 5. Components

All examples assume the dark default surface unless noted.

### 5.1 Buttons

| Variant | Background | Text | Border | Use |
|---|---|---|---|---|
| **Primary** | `secondary-500` (gold) | `primary-900` | none | Primary CTAs ("Watch Trailer", "Submit Script") |
| **Secondary** | transparent | `neutral-50` | `1px solid neutral-50` | Supporting actions |
| **Ghost** | transparent | `secondary-500` | none | Tertiary, in-text actions |
| **Destructive** | `danger` | `neutral-50` | none | Delete, withdraw |

Sizing:

| Size | Height | Padding X | Font |
|---|---|---|---|
| sm | 32px | 12px | `body-sm` 500 |
| md | 44px | 20px | `body` 600 |
| lg | 56px | 28px | `body-lg` 600 |

States: hover lifts opacity to 0.92 and adds `shadow-md`. Pressed drops to `secondary-700`. Focus shows a 2px `secondary-300` outline with 2px offset. Disabled = 40% opacity, no shadow.

### 5.2 Cards

```
┌────────────────────────────────┐
│  [16:9 still / poster]         │  ← always preserve cinematic ratio
│                                │
├────────────────────────────────┤
│  OVERLINE — GENRE              │  overline, secondary-500
│  Film Title                    │  h3, display serif
│  Short logline up to 2 lines.  │  body-sm, neutral-400
│  ─────────                     │  1px secondary-500 divider, 24px wide
│  RUNTIME · YEAR · RATING       │  font-mono, neutral-400
└────────────────────────────────┘
```

- Surface: `primary-700` on dark, `neutral-100` on light.
- Padding: 24px.
- Radius: `--radius-md` (6px).
- Hover: image scales 1.02 over 480ms `--ease-cinema`, gold divider extends to full width.

### 5.3 Inputs

- Height 44px, padding 12px 16px, radius `--radius-sm`.
- On dark: background `primary-700`, 1px border `primary-500`, text `neutral-50`, placeholder `primary-300`.
- On light: background `neutral-50`, 1px border `neutral-200`, text `neutral-900`.
- Focus: border `secondary-500`, no glow — the brand prefers a sharp edge to a soft halo.
- Error: border `danger`, helper text `danger`, icon left of helper.
- Label: overline above input, 8px gap. Helper text: `body-sm`, 6px below.

### 5.4 Badges

| Variant | Background | Text | Use |
|---|---|---|---|
| **Status — Greenlit** | `success` @ 16% | `success` | Production stage |
| **Status — In Post** | `warning` @ 16% | `warning` | Production stage |
| **Status — Released** | `secondary-500` @ 20% | `secondary-300` | Released titles |
| **Festival** | transparent | `neutral-50` | 1px gold border, e.g. "Cannes '26 Official Selection" |
| **Rating** | `neutral-900` | `neutral-50` | "R", "PG-13", "TV-MA" — always font-mono |

Padding 4px 10px, radius `--radius-pill` for status, `--radius-sm` for rating.

### 5.5 Other patterns

- **Marquee header:** full-bleed still + 40% black gradient bottom-up + display title bottom-left, overline above.
- **Slate / metadata block:** font-mono, two-column key/value, uppercase keys in `neutral-400`, values in `neutral-50`.
- **Dividers:** 1px `secondary-500`, 24px wide by default — a deliberate gold rule, not a faint hairline across the whole container.

---

## 6. Iconography & Illustration

### 6.1 Icons

- **Library:** Lucide (or Phosphor Thin) — geometric, 1.5px stroke, square caps, 24px grid.
- **Custom icons** must follow: 24×24 viewBox, 1.5px stroke, no fills, rounded joins off (sharp), optical centering.
- Icon colour inherits text colour. Never tint icons gold by default — gold is reserved for emphasis.

### 6.2 Imagery direction

- **Photography:** cinematic stills, anamorphic crops (2.39:1 or 2:1), high contrast, deep shadows, single warm key light. No stock photography. No staged smiles.
- **Treatment:** subtle film grain overlay (opacity 4–8%), slight teal-and-orange grade allowed but never garish.
- **People:** shoot on set, in costume, in process — behind-the-scenes credibility over polished portraiture.

### 6.3 Illustration

- Used sparingly. When needed: monoline gold illustrations on dark, evoking title-card art (think Saul Bass simplicity, not flat-vector marketing).
- No isometric tech illustrations. No 3D blob gradients. No "Corporate Memphis."

### 6.4 Logo treatment

- Always surround the logo with clear space ≥ the height of its cap-height.
- Default lockup: gold (`secondary-500`) on `primary-900`, or `primary-900` on `neutral-50`.
- Never apply drop shadows, gradients, outlines, or rotate the logo.

---

## 7. Do's and Don'ts

### Do

- ✅ Lead with **negative space**. The brand earns its presence by not crowding it.
- ✅ Treat **gold as a spotlight** — single accents, dividers, key CTAs.
- ✅ Use the **display serif for titles only**. Italic for film names inline.
- ✅ Keep **runtime, dates, credits in mono**. It signals authenticity.
- ✅ Default to **dark surfaces** for marketing; reserve light surfaces for editorial / long-form reading.
- ✅ Anchor every page on a **single hero image** at proper cinematic ratio.
- ✅ Animate with **camera-like easing** (`--ease-cinema`) and longer scene-change durations on hero transitions.

### Don't

- ❌ Don't use gold for body copy or large surfaces — it cheapens to "luxury parody" fast.
- ❌ Don't combine crimson and gold in the same component. Pick one accent per surface.
- ❌ Don't round corners aggressively. Sharp edges = cinematic; pill-shaped = consumer SaaS.
- ❌ Don't use stock photography, emoji decoration, or gradient blobs.
- ❌ Don't set body text in the display serif, even "for one heading."
- ❌ Don't stack more than two type weights of the display serif on one screen.
- ❌ Don't add glow/blur/neon effects — this brand is film, not streaming-platform UI.
- ❌ Don't translate the logo into a brand-coloured square avatar with gradient. Use the wordmark or monogram only.

---

## 8. File Map

| File | Purpose |
|---|---|
| `DESIGN_SYSTEM.md` | This document — human-readable spec |
| `tokens.json` | Machine-readable design tokens (import into Figma Tokens, Style Dictionary, etc.) |
| `tokens.css`  | Drop-in CSS custom properties for any web project |

---

## 9. How to use in future projects

1. Copy `tokens.css` into your project and `@import` it from your global stylesheet, **or** feed `tokens.json` to your token pipeline.
2. Replace `{{BRAND_NAME}}` everywhere with your studio name.
3. Wire your typeface loading (Playfair Display, Inter, JetBrains Mono — all available on Google Fonts).
4. Hand this doc to any designer, developer, or AI assistant as the single source of truth.
