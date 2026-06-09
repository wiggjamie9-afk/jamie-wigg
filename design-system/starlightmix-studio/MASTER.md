# STARLIGHTMIX Studio — Design System Master

> **READ FIRST:** `design-system/RHYTHMIX-BRAND.md` — Global brand (colors, typography, motion).
> Then check `design-system/starlightmix-studio/pages/[page-name].md` for page-specific overrides.
> If the page file exists, its rules **override** this Master file.

---

**Project:** STARLIGHTMIX Studio (SaaS music production platform)  
**Generated:** 2026-06-09  
**Category:** Music Streaming / Creator Tools  
**Primary Stack:** Next.js 15, React 19, Tailwind v4, TypeScript  

---

## Brand System Inheritance

**All colors, typography, and motion come from `design-system/RHYTHMIX-BRAND.md`.**

### Color Palette (Locked to RHYTHMIX)

| Role | Hex | CSS Variable | Usage |
|------|-----|--------------|-------|
| Canvas | `#08050d` | `--color-canvas` | Background, page base |
| Primary | `#ff1f5a` | `--color-primary` | CTAs, emphasis, upload/render button |
| Secondary | `#7c3aed` | `--color-secondary` | Accent strokes, secondary actions |
| Tertiary | `#00d8ff` | `--color-tertiary` | Links, live indicators |
| Signal | `#00e887` | `--color-signal` | Success states, rendering progress |
| Highlight | `#f5c000` | `--color-highlight` | Play button, music waveform peaks |
| Soft Accent | `#ff6fc8` | `--color-soft` | Stats, counts, upload progress |
| Display | `#ffffff` | `--color-display` | Headlines, numbers, UI text |
| Muted | `#a0a0b0` | `--color-muted` | Body text, secondary info |
| Surface | `#1a1325` | `--color-surface` | Cards, panels, modals |

**Notes:** No substitutions. Use magenta (`#ff1f5a`) for CTAs, NOT green or blue.

### Typography (Locked to RHYTHMIX)

- **Display (Headlines, Big Numbers):** Space Grotesk
- **Body (UI, Labels):** Space Grotesk
- **Mono (Code, Numerals):** JetBrains Mono

```css
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');

:root {
  --font-display: 'Space Grotesk', system-ui, sans-serif;
  --font-body: 'Space Grotesk', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}
```

### Motion System (Locked to RHYTHMIX)

- **Entry:** 0.4–0.7s, `power3.out` / `expo.out` easing
- **Stagger:** 60–120ms across grid items (upload queue, track list)
- **Hover/Interaction:** 200–300ms, `cubic-bezier(0.4, 0, 0.2, 1)` (power3 equivalent)
- **Philosophy:** Fast, confident, no bounce—matches music production interface expectations

```css
/* GSAP easing (HyperFrames) */
gsap.timeline({ paused: true })
  .to(element, { duration: 0.5, ease: "power3.out" })
```

### Spacing System (Inherited)

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | `4px` | Hairline spacing |
| `--space-sm` | `8px` | Icon padding, gaps |
| `--space-md` | `16px` | Standard padding |
| `--space-lg` | `24px` | Component sections |
| `--space-xl` | `32px` | Section spacing |
| `--space-2xl` | `48px` | Section margins |
| `--space-3xl` | `64px` | Hero/full-width padding |

### Shadows (Dark Canvas)

| Level | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 4px 12px rgba(255, 31, 90, 0.08)` | Subtle, magenta tint |
| `--shadow-md` | `0 8px 24px rgba(0, 0, 0, 0.4)` | Cards, panels |
| `--shadow-lg` | `0 16px 48px rgba(0, 0, 0, 0.5)` | Modals, floating panels |
| `--shadow-xl` | `0 24px 64px rgba(0, 0, 0, 0.6)` | Deep modals, popovers |

---

## Component Specs

### Buttons

**Primary CTA (Upload, Render, Submit)**
```css
.btn-primary {
  background: #ff1f5a;
  color: #ffffff;
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: 600;
  font-family: var(--font-display);
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border: none;
}

.btn-primary:hover {
  background: #e01349;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(255, 31, 90, 0.3);
}

.btn-primary:active {
  transform: translateY(0);
}

.btn-primary:focus {
  outline: 2px solid #ff1f5a;
  outline-offset: 2px;
}
```

**Secondary (Outline, Cancel, Less Prominent)**
```css
.btn-secondary {
  background: transparent;
  color: #ff1f5a;
  border: 2px solid #ff1f5a;
  padding: 10px 22px;
  border-radius: 6px;
  font-weight: 600;
  font-family: var(--font-display);
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.btn-secondary:hover {
  background: rgba(255, 31, 90, 0.1);
  border-color: #ff6fc8;
}

.btn-secondary:focus {
  outline: 2px solid #ff1f5a;
  outline-offset: 2px;
}
```

### Cards (Track, Upload Item, Result)

```css
.card {
  background: #1a1325;
  border: 1px solid rgba(255, 31, 90, 0.1);
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(255, 31, 90, 0.08);
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

.card:hover {
  border-color: rgba(255, 31, 90, 0.3);
  box-shadow: 0 12px 32px rgba(255, 31, 90, 0.12);
  transform: translateY(-2px);
}

.card.active {
  border-color: #ff1f5a;
  background: rgba(255, 31, 90, 0.05);
}
```

### Form Inputs

```css
.input {
  background: #08050d;
  color: #ffffff;
  border: 1px solid rgba(255, 31, 90, 0.2);
  padding: 12px 16px;
  border-radius: 6px;
  font-family: var(--font-body);
  font-size: 16px;
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

.input:focus {
  border-color: #ff1f5a;
  box-shadow: 0 0 0 3px rgba(255, 31, 90, 0.1);
  outline: none;
}

.input::placeholder {
  color: #a0a0b0;
}
```

### Modals & Dialogs

```css
.modal-overlay {
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  transition: opacity 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

.modal {
  background: #1a1325;
  border: 1px solid rgba(255, 31, 90, 0.2);
  border-radius: 8px;
  padding: 32px;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.6);
  max-width: 500px;
  width: 90%;
  animation: slideUp 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

## Style Guidelines

**Style:** Vibrant & Block-based

**Keywords:** Bold, energetic, playful, block layout, geometric shapes, high color contrast, duotone, modern, energetic

**Best For:** Startups, creative agencies, gaming, social media, youth-focused, entertainment, consumer

**Key Effects:** Large sections (48px+ gaps), animated patterns, bold hover (color shift), scroll-snap, large type (32px+), 200-300ms

### Page Pattern

**Pattern Name:** App Store Style Landing

- **Conversion Strategy:** Show real screenshots. Include ratings (4.5+ stars). QR code for mobile. Platform-specific CTAs.
- **CTA Placement:** Download buttons prominent (App Store + Play Store) throughout
- **Section Order:** 1. Hero with device mockup, 2. Screenshots carousel, 3. Features with icons, 4. Reviews/ratings, 5. Download CTAs

---

## Anti-Patterns (STRICTLY FORBIDDEN)

### Color Violations
- ❌ **No generic brand blue** (`#3b82f6`, `#0078d4`, etc.) — use magenta `#ff1f5a` or cyan `#00d8ff`
- ❌ **No green CTAs** — reserved for success states, not primary actions
- ❌ **No muted grays** — use canvas `#08050d` or surface `#1a1325`

### Design Violations
- ❌ **No full-frame linear gradients** — use radial or solid + localized glow (banding risk)
- ❌ **No bouncy/elastic eases** — wrong tonal register, use power3/expo only
- ❌ **No emoji-heavy decoration** — max one glyph per feature card
- ❌ **No scene-internal exit animations** — crossfades at boundaries only

### Code Violations
- ❌ **No emojis as icons** — use SVG (Heroicons, Lucide)
- ❌ **No missing `cursor: pointer`** on clickable elements
- ❌ **No instant state changes** — always transition 200–300ms
- ❌ **No invisible focus states** — must be visible (outline or glow)
- ❌ **No horizontal scroll on mobile** (375px viewport)
- ❌ **No content hidden behind fixed navbars**

---

## Pre-Delivery Checklist (STARLIGHTMIX Studio)

**Colors & Branding:**
- [ ] All colors from RHYTHMIX palette (`#08050d`, `#ff1f5a`, `#00d8ff`, `#00e887`, `#f5c000`)
- [ ] Primary CTA uses magenta (`#ff1f5a`), NOT green or blue
- [ ] Success states use signal green (`#00e887`)
- [ ] Links use tertiary cyan (`#00d8ff`)
- [ ] All text on `#08050d` canvas meets 4.5:1 contrast (WCAG AA)

**Typography & Motion:**
- [ ] Display text uses Space Grotesk (headlines, big numbers)
- [ ] Body text uses Space Grotesk
- [ ] Mono text (code, numerals) uses JetBrains Mono
- [ ] All transitions use 200–300ms cubic-bezier(0.4, 0, 0.2, 1)
- [ ] No bounce/elastic eases

**Interactive Elements:**
- [ ] All buttons have `cursor: pointer`
- [ ] All buttons have visible focus states (outline or glow)
- [ ] Hover states shift color AND shadow (not just scale)
- [ ] Cards have magenta border on hover
- [ ] Form inputs have magenta border on focus

**Responsive & Accessibility:**
- [ ] Tested at: 375px, 768px, 1024px, 1440px
- [ ] No horizontal scroll on mobile (375px)
- [ ] No emojis (SVG icons only: Heroicons, Lucide)
- [ ] Focus states visible for keyboard navigation
- [ ] `prefers-reduced-motion` respected (skip non-essential animations)
- [ ] No content hidden behind fixed navbars

**Upload/Render Specific:**
- [ ] Upload progress uses magenta (`#ff1f5a`)
- [ ] Render progress uses signal green (`#00e887`)
- [ ] Success state animates in with power3.out easing
- [ ] Error state uses magenta with clear dismiss option
