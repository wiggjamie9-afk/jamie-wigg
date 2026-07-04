# DESIGN.md — SkillUI by MindBlow Media

Drop this file in your project root and tell your AI agent *"build me a page that
looks like this."* It is the design language for the **SkillUI** landing site and
the **MindBlow Media** brand surface. Follows the Google Stitch `DESIGN.md` format.

---

## 1. Visual Theme & Atmosphere

- **Mood:** Electric, confident, "mind-blow" energy on a deep ink canvas. Premium
  dev-tool marketing — think Linear/Vercel restraint crossed with a jolt of neon.
- **Density:** Spacious. Big display type, generous section padding, one idea per band.
- **Philosophy:** The product extracts design systems, so the page must *be* a
  design system — coherent tokens, no ad-hoc values. Committed dark theme.
- **Deliberate anti-cliché:** No AI purple/pink hero gradient. Signature accent is
  an electric lime, paired with cobalt→cyan for the "extraction" gradient.

## 2. Color Palette & Roles

| Semantic name | Hex | Role |
|---|---|---|
| Ink | `#0a0c12` | Page background, text-on-spark |
| Ink 2 | `#0e111a` | Alternating band background |
| Surface | `#141826` | Cards, header, demo body |
| Surface 2 | `#1b2032` | Card hover, inset controls |
| Line | `rgba(255,255,255,.08)` | Hairline borders, dividers |
| Line 2 | `rgba(255,255,255,.14)` | Stronger borders, focus outlines |
| Text | `#f3f5fb` | Primary text, headings |
| Muted | `#9aa3bd` | Body copy, secondary text |
| Faint | `#6b7391` | Labels, meta, disabled |
| **Spark (lime)** | `#c8ff43` | **Primary CTA, brand pop, active states** |
| Cobalt | `#5b7cff` | Gradient start, links, "working" states |
| Cyan | `#35e0d6` | Gradient mid, technical accents (mono chips) |
| Coral | `#ff5c49` | Sparingly — the heart in the footer, rare emphasis |

- **Signature gradient:** `linear-gradient(120deg, #5b7cff, #35e0d6 55%, #c8ff43)`
  — used for headline emphasis text and card edge-lighting only.
- **CTA rule:** Spark lime fill + `#0a0c12` text is the single highest-priority
  action. Never use lime for body text or large fills beyond buttons/accents.

## 3. Typography Rules

System font stack (self-contained, zero web-font requests):
`ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Inter, Arial, sans-serif`.
Monospace for technical/code accents: `ui-monospace, "SF Mono", Menlo, Consolas`.

| Level | Size | Weight | Tracking | Use |
|---|---|---|---|---|
| Display (H1) | `clamp(2.4rem, 5.6vw, 4.3rem)` | 800 | -0.02em | Hero headline |
| H2 | `clamp(1.9rem, 4vw, 3rem)` | 800 | -0.02em | Section titles |
| H3 | `1.1–1.2rem` | 800 | -0.01em | Card titles |
| Lede | `clamp(1.05rem, 1.6vw, 1.28rem)` | 400 | normal | Hero subhead |
| Body | `0.92–1.08rem` | 400 | normal | Paragraphs (`--muted`) |
| Eyebrow | `0.74rem` | 700 | 0.16em, UPPERCASE | Section kickers (`--spark`) |
| Mono chip | `0.72–0.78rem` | 500 | normal | Tokens, URLs, code (`--cyan`) |

- Headlines are tight and heavy. Body is relaxed at line-height 1.55.
- Gradient-text only on 1–3 emphasis words per headline, never a whole heading.

## 4. Component Stylings

- **Buttons:** Fully rounded pills (`border-radius: 999px`), 13px×22px padding, weight 700.
  - *Primary:* Spark fill, ink text, soft lime glow shadow. Hover lifts `-2px` and
    intensifies glow.
  - *Ghost:* Transparent, `--line-2` border. Hover fills `--surface`.
  - Transitions 180ms `cubic-bezier(.22,.61,.36,1)`. `cursor: pointer` always.
- **Cards:** `--surface` fill, 1px `--line` border, `border-radius: 18px`,
  shadow `0 24px 60px -22px rgba(0,0,0,.7)`. Hover: lift `-4px`, border → `--line-2`.
- **Pill/badge:** Soft gradient tint bg, `--line-2` border; inline "NEW" tag uses
  spark fill + ink text.
- **Inputs / mono fields:** Ink bg, `--line` border, 8px radius, mono font, muted text.
- **Nav links:** `--muted` → `--text` on hover, weight 600, no underline.
- **Language switch:** Pill group; active locale is spark fill + ink text.
- **Demo browser:** Gradient-lit rounded card with a masked gradient border
  (cobalt→lime), chrome bar with 3 dots + mono URL, animated stage inside.

## 5. Layout Principles

- **Container:** max-width `1140px`, gutter `clamp(20px, 5vw, 44px)`.
- **Section rhythm:** vertical padding `clamp(64px, 9vw, 120px)`; alternate
  `--ink` / `--ink-2` bands with hairline borders between.
- **Spacing scale (px):** 6 · 10 · 14 · 18 · 22 · 32 · 44 · 64 — stay on the scale.
- **Grids:** Hero is 2-col (copy / demo). Feature grid 3-col, steps 4-col, stats 4-col
  — all collapse to 2-col at 940px and 1-col at 560px.
- **Whitespace:** Let headlines breathe; never crowd the hero. One CTA cluster per band.

## 6. Depth & Elevation

- **Surface hierarchy:** ink (page) → ink-2 (band) → surface (card) → surface-2 (raised).
- **Shadows:** single elevation token `0 24px 60px -22px rgba(0,0,0,.7)` for cards
  and the demo; the spark glow `0 18px 50px -14px rgba(200,255,67,.35)` for the
  primary CTA only.
- **Ambient:** fixed radial glows (cobalt top-right, cyan top-left, lime bottom) +
  a 3.5%-opacity SVG grain overlay. Masked gradient borders imply edge-lighting.
- **Blur:** header and in-demo toasts use `backdrop-filter: blur(10–14px)`.

## 7. Do's and Don'ts

**Do**
- Use spark lime as the one loud color; keep everything else ink + muted.
- Reserve the cobalt→cyan→lime gradient for headline emphasis and edge-light.
- Keep motion smooth (150–550ms) and honor `prefers-reduced-motion`.
- Show, don't tell: the hero demo *performs* the consent-dismiss it advertises.

**Don't**
- Don't use AI purple/pink hero gradients (the exact cliché this brand avoids).
- Don't put lime on body text or as a large background fill.
- Don't introduce a second display typeface or off-scale spacing values.
- Don't ship emojis as functional icons — use inline SVG (this repo does).

## 8. Responsive Behavior

- **Breakpoints:** 940px (grids → 2-col, hero stacks), 760px (hide nav + header CTA,
  widen demo panel), 560px (grids → 1-col, full-width CTAs, footer stacks).
- **Touch targets:** ≥ 44px tall for buttons and the language switch.
- **Collapsing:** Nav hides below 760px (anchors remain reachable via footer);
  hero demo drops beneath the copy and stays interactive.
- **Fluid type/space:** `clamp()` everywhere so nothing needs per-breakpoint retuning.

## 9. Agent Prompt Guide

**Quick color reference:** ink `#0a0c12` · surface `#141826` · text `#f3f5fb` ·
muted `#9aa3bd` · **spark `#c8ff43`** · cobalt `#5b7cff` · cyan `#35e0d6` · coral `#ff5c49`.

**Ready-to-use prompt:**
> Build a dark, spacious marketing section in the MindBlow Media / SkillUI language.
> Background `#0a0c12` with faint radial cobalt/cyan/lime glows and subtle grain.
> System sans, heavy tight headlines (weight 800, -0.02em); one emphasis phrase in a
> `120deg #5b7cff → #35e0d6 → #c8ff43` gradient. Body in `#9aa3bd`. Cards are
> `#141826`, 18px radius, hairline `rgba(255,255,255,.08)` borders, lift on hover.
> One primary CTA: spark-lime pill (`#c8ff43`, ink text, soft lime glow). Secondary
> is a ghost pill. Uppercase spark eyebrows, cyan monospace chips for tokens/URLs.
> No purple/pink gradients, no emoji icons. Smooth 150–300ms transitions, respect
> `prefers-reduced-motion`, WCAG AA contrast, responsive at 375/768/1024/1440.

---

*Made with ❤ in Munich & Bangkok · MindBlow Media*
