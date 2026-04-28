# RHYTHMIX Design System

The brand system already living in `landing.html` / `sections.html`. When generating new sections, components, or marketing collateral, follow this — don't invent new tokens.

## Brand identity

- **Name:** RHYTHMIX (logo: 3px letter-spacing, gradient red→purple text)
- **Tagline pattern:** "Turn any idea into music" / "World's most complete AI music platform"
- **Voice:** Confident, outcome-oriented, creator-first. Avoid jargon. Lead with the result, not the feature.
- **Audience:** Independent musicians, producers, content creators monetising their sound.

## Colors

Defined as CSS variables on `:root` (already in use throughout):

| Token | Hex | Role |
|---|---|---|
| `--red` | `#ff1f5a` | Primary brand, CTAs, urgency |
| `--purple` | `#7c3aed` | Secondary brand, gradient pair |
| `--cyan` | `#00d8ff` | Accent (tech/feature highlights) |
| `--green` | `#00e887` | Success, "included" checks |
| `--gold` | `#f5c000` | Premium/lifetime tier, ratings |
| `--pink` | `#ff6fc8` | Decorative accent only |
| `--text` | (light) | Primary copy |
| `--soft` | (mid) | Body copy, descriptions |
| `--muted` | (dim) | Captions, meta, labels |
| `--card` | (panel bg) | Card backgrounds |
| `--border` | (#2a2a48-ish) | Card/divider borders |
| `--deep` | (deeper bg) | Section backgrounds, footer |

**Brand gradient** (used everywhere — hero, CTAs, popular cards): `linear-gradient(135deg, var(--red), var(--purple))` at `135deg`.

**Tinted backgrounds** for emphasis cards: layer brand colors at 6–10% alpha:
- Featured testi: `linear-gradient(135deg, rgba(255,31,90,.06), rgba(124,58,237,.06))`
- Lifetime card: `linear-gradient(135deg, rgba(245,192,0,.08), rgba(255,31,90,.06))` with `2px` gold border at `.3` alpha.

**Glow on primary CTA hover:** `box-shadow: 0 8px 22px rgba(255,31,90,.4)`.

## Typography

| Var | Stack role | Usage |
|---|---|---|
| `--fs` | Sans display (heavy, 800 weight) | Headlines, section titles, plan names, stat numbers |
| `--fb` | Sans body | Default body text, buttons |
| `--fm` | Monospace | Eyebrow labels, meta (`feat-num`, `popular-tag`, `--fm` letter-spacing 2–3px, uppercase) |

**Type scale (observed):**
- Hero h1: `clamp(38px, 7vw, 76px)` — letter-spacing `-2px`, line-height `.95`
- Section title: ~42px display
- Card title: 13–17px, weight 600–800
- Body: 13–15px, line-height 1.6–1.75
- Eyebrow/meta: 9–11px mono, letter-spacing 2–3px, uppercase
- Stat number: 44–52px display, weight 800

## Spacing & radius

- **Border radius scale:** 7px (buttons) · 11px (faq) · 13–16px (feature/testi/price cards) · 18–22px (hero/email panels) · 100px (pills)
- **Card padding:** 18–32px (denser cards: 18–26px; featured cards: 32–36px)
- **Section vertical rhythm:** `padding: 70–110px 0` for major sections; `margin-top: 40–55px` between header and grid.
- **Grid gap:** 10–16px standard.

## Component patterns

### Cards (`.feat-card`, `.testi-card`, `.price-card`, `.faq-item`)
- `background: var(--card)`, `1px solid var(--border)`, transition `.3s`.
- **Hover:** `transform: translateY(-3 to -4px)`, border tints toward brand red at `.25–.3` alpha.
- **Featured / popular variant:** brand-tinted gradient background + brand border at `.5` alpha.

### Buttons
- `.btn-primary` / `.plan-cta.primary`: brand gradient, white text, 11–13px padding, weight 600.
- `.plan-cta.outline`: transparent bg, `1px solid #2a2a48`, soft text → text on hover.
- `.btn-gold`: gold gradient for the lifetime/limited offer.
- All: `border-radius: 7–8px`, hover `translateY(-1px)` + shadow.

### Tags / pills
- `font-family: var(--fm)`, 8–9px, letter-spacing 1–2px, uppercase, `border-radius: 100px`.
- Color-coded: cyan = tech/spec, green = inclusion, red = brand emphasis, gold = premium, purple = passive/recurring.

### Pricing
- 4-column grid → 2-col at 900px → 1-col at 600px.
- "Popular" card raised with brand-tint gradient + `popular-tag` pill at `top: -11px`, gradient bg, white text.
- Lifetime card is horizontal, gold-themed, with strikethrough was-price + animated red dot for spots-left urgency.

### FAQ
- 2-col grid → 1-col at 900px. Plus icon rotates 45° to become an X when `.open`. Animated max-height transition.

## Responsive breakpoints

- `@media (max-width: 900px)` — collapse to 2–4 col grids, stack lifetime card.
- `@media (max-width: 600px)` — single column, hide nav links, stack email form.

Mobile-first is **not** the convention here; the desktop layout is the source of truth and breakpoints scale down.

## Animations

- **`orbit`** — floating brand-color orbs in hero (radii 180–260px, 7–14s).
- **`pulse`** — `.8s infinite` on red urgency dots.
- **`reveal`** — used on most cards/items; presumably an intersection-observer fade-in (selector exists, JS not in current files).

## When generating new content

- **Copy:** lead with outcome + metric ("$2.4K avg sync placement", "4,800+ creators"). Pair every benefit with a specific number or verifiable proof. Avoid "great", "amazing", "revolutionary".
- **Markup:** match existing class naming (`feat-`, `testi-`, `price-`, `pf-`, `faq-`). Don't introduce BEM, utility classes, or framework conventions — this is hand-written CSS.
- **Colors:** never hardcode hex when a token exists. New accents should reuse the 6 brand colors, not extend the palette.
- **Before "shipping" a section:** review with three prompts — (1) does it match the brand voice above? (2) does every visual style use existing tokens? (3) does it degrade cleanly at the 900px and 600px breakpoints?
