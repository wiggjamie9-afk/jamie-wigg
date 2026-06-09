# RHYTHMIX Brand System — Source of Truth

> All projects inherit this brand system. Page-specific overrides live in project subdirectories.

**Last Updated:** 2026-06-09  
**Projects Using:** STARLIGHTMIX Studio, HerdCheck, Reset, Codex of Reality  

---

## Visual Identity

Dark, energetic, neon AI-music aesthetic. Deep near-black canvas with violet undertones, punctuated by saturated magenta, cyan, and electric green. Modern grotesque sans for display, mono for taglines and numerals. Motion is sharp and confident — fast eases in, decisive holds, no bounce.

---

## Color Palette (Global)

| Role | Hex | CSS Variable | Usage |
|------|-----|--------------|-------|
| Canvas | `#08050d` | `--color-canvas` | Background, cards |
| Primary | `#ff1f5a` | `--color-primary` | Magenta, CTAs, emphasis |
| Secondary | `#7c3aed` | `--color-secondary` | Purple accents |
| Tertiary | `#00d8ff` | `--color-tertiary` | Cyan highlights, links |
| Signal | `#00e887` | `--color-signal` | Green, success, positive |
| Highlight | `#f5c000` | `--color-highlight` | Gold, money, key stats |
| Soft Accent | `#ff6fc8` | `--color-soft` | Pink, count highlights |
| Display | `#ffffff` | `--color-display` | Headlines, numbers |
| Muted | `#a0a0b0` | `--color-muted` | Body text, secondary info |
| Surface | `#1a1325` | `--color-surface` | Card backgrounds, depth |

---

## Typography

- **Display (Headlines, Large Numbers):** Space Grotesk, system-ui fallback
- **Body (UI, Microcopy):** Space Grotesk or system-ui
- **Mono (Labels, Numerals, Code):** JetBrains Mono, monospace fallback

```css
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');

:root {
  --font-display: 'Space Grotesk', system-ui, sans-serif;
  --font-body: 'Space Grotesk', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}
```

---

## Spacing System

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | `4px` | Hairlines |
| `--space-sm` | `8px` | Icon gaps |
| `--space-md` | `16px` | Standard padding |
| `--space-lg` | `24px` | Section padding |
| `--space-xl` | `32px` | Large gaps |
| `--space-2xl` | `48px` | Section margins |
| `--space-3xl` | `64px` | Hero padding |

---

## Motion & Easing

- **Entry:** 0.4–0.7s, `power3.out` / `expo.out` for entrances
- **Stagger:** 60–120ms across grid items
- **Crossfade:** 0.5s between scenes
- **Hover/Interaction:** 200–300ms, no bounce/elastic eases
- **Philosophy:** Fast in, decisive holds, confident—no bounce

---

## Component Baseline

### Primary CTA
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
}

.btn-primary:hover {
  background: #e01349;
  transform: translateY(-2px);
}

.btn-primary:focus {
  outline: 2px solid #ff1f5a;
  outline-offset: 2px;
}
```

### Secondary (Outline)
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
  color: #ff1f5a;
}
```

### Card (Dark Canvas + Surface)
```css
.card {
  background: #1a1325;
  border-radius: 8px;
  padding: 24px;
  border: 1px solid rgba(255, 31, 90, 0.1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

.card:hover {
  border-color: rgba(255, 31, 90, 0.3);
  box-shadow: 0 8px 32px rgba(255, 31, 90, 0.1);
  transform: translateY(-2px);
}
```

### Form Input
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

---

## Anti-Patterns (FORBIDDEN)

❌ **Color Violations:**
- No `#3b82f6` (blue)
- No default brand blue (use magenta `#ff1f5a` or cyan `#00d8ff` instead)
- No muted grays (use canvas `#08050d` or surface `#1a1325`)

❌ **Design Violations:**
- No full-frame linear gradients (banding risk) — use radial or solid + localized glow
- No scene-internal exit animations (crossfade at transition boundaries only)
- No emoji-heavy decoration (one icon glyph per feature card maximum)
- No bouncy/elastic eases (wrong tonal register)

❌ **Code Violations:**
- No emojis as icons (use SVG: Heroicons, Lucide)
- No missing `cursor: pointer` on clickable elements
- No instant state changes (always transition 200–300ms)
- No invisible focus states (must be visible for a11y)

---

## Pre-Delivery Checklist for All Projects

- [ ] All colors from RHYTHMIX palette (canvas, primary, secondary, signal, highlight)
- [ ] Typography: Space Grotesk (display) + JetBrains Mono (mono)
- [ ] Motion uses power3.out or expo.out, no bounce
- [ ] All buttons have cursor:pointer, focus states, 200ms transitions
- [ ] All cards have subtle magenta border on hover
- [ ] Form inputs use canvas background, magenta border on focus
- [ ] Responsive: 375px, 768px, 1024px, 1440px (test all breakpoints)
- [ ] No emojis used as icons (SVG only)
- [ ] Text contrast: 4.5:1 minimum (WCAG AA)
- [ ] Focus states visible and styled (outline or glow)
- [ ] prefers-reduced-motion respected (all animations can be disabled)
- [ ] No horizontal scroll on mobile (375px viewport)
- [ ] No content hidden behind fixed navbars

---

## Project Overrides

Each project has a `pages/` subdirectory for page-specific deviations:

| Project | Master | Page Overrides |
|---------|--------|-----------------|
| STARLIGHTMIX Studio | `design-system/starlightmix-studio/MASTER.md` | `design-system/starlightmix-studio/pages/*.md` |
| HerdCheck | `design-system/herdcheck/MASTER.md` | `design-system/herdcheck/pages/*.md` |
| Reset | `design-system/reset/MASTER.md` | `design-system/reset/pages/*.md` |

**Retrieval Logic:** When building a page, check `pages/[page-name].md` first. If it exists, its rules override the Master. Otherwise, use MASTER + `RHYTHMIX-BRAND.md` as the source of truth.

---

## Usage in Prompts

When asking an AI agent to build UI:

```
Build the [Page Name] component. Use design-system/RHYTHMIX-BRAND.md
for the global brand system (colors, typography, motion). 
Check design-system/[project]/pages/[page].md for any page-specific overrides.
Strictly follow all color hex values, no substitutions.
Use Space Grotesk for display text, JetBrains Mono for labels.
All transitions 200-300ms with power3.out easing.
No bounce, no emoji icons, no generic blue.
```

---

## Tools & References

- **UI UX Pro Max:** Design system generator (installed in `.claude/skills/ui-ux-pro-max/`)
- **Heroicons / Lucide:** SVG icon libraries (no emojis)
- **Google Fonts:** Space Grotesk + JetBrains Mono
- **Tailwind v4:** CSS framework (optional, integrates with Space Grotesk)

