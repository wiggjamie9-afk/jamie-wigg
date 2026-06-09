# Design System — Production-Grade UI/UX Infrastructure

**Status:** Production Ready (v1.0)  
**Last Updated:** 2026-06-09  
**Powered by:** UI UX Pro Max + RHYTHMIX Brand System  

---

## Overview

This is a **hierarchical, brand-locked design system** for all projects in the RHYTHMIX ecosystem. Every project inherits the core RHYTHMIX brand (colors, typography, motion), with page-specific overrides for context-specific needs.

**What you get:**
- ✅ 161 industry-specific reasoning rules (AI-generated design systems)
- ✅ 67 UI styles (Glassmorphism, Claymorphism, Dark mode, etc.)
- ✅ 57 font pairings + 161 color palettes (all locked to RHYTHMIX brand)
- ✅ Production-grade components (buttons, cards, inputs, modals)
- ✅ Pre-delivery checklists (accessibility, responsive, animation, contrast)
- ✅ Hierarchical retrieval (BRAND → Project Master → Page Overrides)

---

## Quick Start

### For Designers / PMs
1. Read `design-system/RHYTHMIX-BRAND.md` — the global source of truth
2. Open any project folder (e.g., `design-system/starlightmix-studio/`)
3. Share `MASTER.md` + `pages/[page].md` with AI agents when requesting UI

### For AI Agents (Claude, Cursor, etc.)

When asked to build UI, use this retrieval prompt:

```
I am building the [Page Name] for [Project Name].

Read design-system/RHYTHMIX-BRAND.md for the global brand system
(colors, typography, motion, spacing, component baselines).

Then check design-system/[project]/pages/[page-name].md.
If that file exists, prioritize its rules. Otherwise, use MASTER.md.

Strictly follow all hex color values — no substitutions.
Use Space Grotesk for display text, JetBrains Mono for labels/mono.
All transitions 200-300ms with cubic-bezier(0.4, 0, 0.2, 1) easing (power3).
No bounce, no emojis as icons, no generic blue.

Build now.
```

### For Developers

Install and use the design system generator:

```bash
# Already installed in .claude/skills/ui-ux-pro-max/

# Generate design system for a new project
python3 .claude/skills/ui-ux-pro-max/scripts/search.py \
  "your project description" \
  --design-system \
  --persist \
  -p "Project Name" \
  --page "homepage"

# Run domain-specific searches
python3 .claude/skills/ui-ux-pro-max/scripts/search.py \
  "glassmorphism" --domain style

python3 .claude/skills/ui-ux-pro-max/scripts/search.py \
  "form validation" --stack react
```

---

## Directory Structure

```
design-system/
├── README.md                          # This file
├── RHYTHMIX-BRAND.md                  # ⭐ Global source of truth
├── starlightmix-studio/
│   ├── MASTER.md                      # Project defaults (locked to brand)
│   └── pages/
│       ├── dashboard.md               # Dashboard-specific overrides
│       ├── upload.md                  # Upload flow specifics
│       └── library.md                 # Music library layout
├── herdcheck/
│   ├── MASTER.md                      # Livestock screening app defaults
│   └── pages/
│       ├── screening.md               # Screening UI specifics
│       ├── results.md                 # Results display
│       └── history.md                 # Historical data
├── reset/
│   ├── MASTER.md                      # Recovery app defaults
│   └── pages/
│       ├── dashboard.md               # Recovery dashboard
│       ├── session.md                 # Active session UI
│       └── insights.md                # Analytics & trends
└── codex-of-reality/
    ├── MASTER.md                      # Editorial PWA defaults
    └── pages/
        ├── home.md                    # Homepage specifics
        └── app.md                     # App interface
```

---

## Retrieval Logic

When building ANY page, follow this order:

1. **Check page file:** `design-system/[project]/pages/[page-name].md`
   - If exists → Use its rules (highest priority)
   - If not → Go to step 2

2. **Use project master:** `design-system/[project]/MASTER.md`
   - All project-specific defaults (colors, patterns, components)
   - Still inherits brand from RHYTHMIX-BRAND.md

3. **Fall back to brand:** `design-system/RHYTHMIX-BRAND.md`
   - Global colors, typography, motion, spacing
   - The ultimate source of truth

**Example:**
```
Building: STARLIGHTMIX Studio homepage
├─ Check: design-system/starlightmix-studio/pages/homepage.md (doesn't exist)
├─ Use: design-system/starlightmix-studio/MASTER.md (project defaults)
└─ Inherit: design-system/RHYTHMIX-BRAND.md (brand system)
```

---

## Key Sections in Each DESIGN.md

Every design system file includes:

| Section | What It Contains |
|---------|-----------------|
| **Brand System Inheritance** | Link to RHYTHMIX-BRAND.md, color palette override |
| **Color Palette** | Hex values, CSS variables, usage notes |
| **Typography** | Font families, sizes, line-heights, mood |
| **Motion & Easing** | Transitions, durations, easing curves |
| **Spacing System** | Token values (xs, sm, md, lg, xl, 2xl, 3xl) |
| **Shadows & Depth** | Shadow levels (sm, md, lg, xl) for dark canvas |
| **Component Specs** | Buttons, cards, inputs, modals with CSS |
| **Anti-Patterns** | Explicit "do NOT" list (color, design, code) |
| **Pre-Delivery Checklist** | Accessibility, responsive, animation, contrast |

---

## Color System Explained

### RHYTHMIX Global Palette

All projects use this fixed palette. No substitutions allowed:

| Color | Hex | Purpose | Examples |
|-------|-----|---------|----------|
| **Canvas** | `#08050d` | Background, page base | Page background, body |
| **Primary** | `#ff1f5a` | CTAs, emphasis | Upload button, primary action |
| **Secondary** | `#7c3aed` | Accents, secondary | Border accents, link underlines |
| **Tertiary** | `#00d8ff` | Links, highlights | External links, active state |
| **Signal** | `#00e887` | Success, positive | Render complete, success message |
| **Highlight** | `#f5c000` | Money, stats | Play button, featured stat |
| **Soft** | `#ff6fc8` | Counts, secondary emphasis | Upload count, stats |
| **Display** | `#ffffff` | Headlines, UI text | All text, numbers |
| **Muted** | `#a0a0b0` | Body text, secondary info | Secondary labels, help text |
| **Surface** | `#1a1325` | Card backgrounds, depth | Card backgrounds, panels |

**Rule:** Never substitute. If a button needs a color, use primary magenta (`#ff1f5a`). Not green, not blue.

---

## Typography System

All projects use:

- **Display Font:** Space Grotesk (headlines, big numbers)
- **Body Font:** Space Grotesk (UI text, labels)
- **Mono Font:** JetBrains Mono (code, numerals, timestamps)

```css
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');

:root {
  --font-display: 'Space Grotesk', system-ui, sans-serif;
  --font-body: 'Space Grotesk', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}
```

---

## Motion & Animation

All transitions use:

| Phase | Duration | Easing | Usage |
|-------|----------|--------|-------|
| **Hover/Interaction** | 200–300ms | `power3.out` / `cubic-bezier(0.4, 0, 0.2, 1)` | Button hover, card lift |
| **Enter/Appear** | 400–700ms | `power3.out` | Page load, modal open |
| **Stagger** | 60–120ms | (same) | Grid items, list entries |
| **Exit** | 200–500ms | (same) | Fade/slide out |

**Golden Rule:** No bounce. No elastic eases. Motion is confident and decisive.

---

## Component Baseline

### Primary Button (Magenta CTA)

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

.btn-primary:focus {
  outline: 2px solid #ff1f5a;
  outline-offset: 2px;
}
```

### Card (Dark Surface + Magenta Border)

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
```

---

## Strict Anti-Patterns

### Color Violations
❌ No generic brand blue (#3b82f6, #0078d4) — use magenta or cyan  
❌ No green CTAs — green is for success states only  
❌ No muted grays — use canvas or surface colors  

### Design Violations
❌ No full-frame linear gradients (banding risk)  
❌ No bouncy/elastic eases (wrong tone)  
❌ No emoji decoration (SVG icons only)  
❌ No instant state changes (always transition)  

### Code Violations
❌ No emojis as icons (use Heroicons, Lucide)  
❌ No missing `cursor: pointer`  
❌ No invisible focus states  
❌ No horizontal scroll on mobile  
❌ No content hidden behind fixed navbars  

---

## Pre-Delivery Checklist (All Projects)

Before submitting UI code:

**Colors & Branding:**
- [ ] All colors from RHYTHMIX palette (no substitutions)
- [ ] CTAs use magenta (#ff1f5a)
- [ ] Success uses signal green (#00e887)
- [ ] Text contrast: 4.5:1 minimum (WCAG AA)

**Typography & Motion:**
- [ ] Display: Space Grotesk
- [ ] Body: Space Grotesk
- [ ] Mono: JetBrains Mono
- [ ] Transitions: 200–300ms, power3.out easing
- [ ] No bounce/elastic eases

**Interactivity:**
- [ ] All buttons have `cursor: pointer`
- [ ] All buttons have visible focus states
- [ ] Hover states: color + shadow shift
- [ ] Form inputs: magenta border on focus

**Responsive & Accessibility:**
- [ ] Tested: 375px, 768px, 1024px, 1440px
- [ ] No horizontal scroll (375px viewport)
- [ ] SVG icons only (no emojis)
- [ ] Focus states visible (keyboard nav)
- [ ] `prefers-reduced-motion` respected

---

## Tools & Resources

| Tool | Purpose | Command |
|------|---------|---------|
| **UI UX Pro Max** | Design system generator | Already installed in `.claude/skills/ui-ux-pro-max/` |
| **Heroicons / Lucide** | SVG icons (no emojis) | https://heroicons.com / https://lucide.dev |
| **Google Fonts** | Space Grotesk + JetBrains Mono | https://fonts.google.com |
| **Tailwind v4** | CSS framework (optional) | Integrates with Space Grotesk |

---

## Usage Examples

### Building a New Page

```
Prompt to AI agent:

"Build the Settings page for STARLIGHTMIX Studio.
Use design-system/RHYTHMIX-BRAND.md for global brand.
Check design-system/starlightmix-studio/pages/settings.md for page-specific rules.
If no page file exists, use design-system/starlightmix-studio/MASTER.md.

Requirements:
- All buttons use magenta CTA (#ff1f5a)
- Cards have magenta border on hover
- Form inputs use magenta focus state
- Space Grotesk for all text
- 200ms transitions with power3.out easing
- Responsive: 375px, 768px, 1024px, 1440px
- No emojis, SVG icons only
- 4.5:1 text contrast (WCAG AA)

Build now."
```

### Generating a New Project Design System

```bash
# For a new app (e.g., "Analytics Dashboard")
python3 .claude/skills/ui-ux-pro-max/scripts/search.py \
  "music analytics dashboard" \
  --design-system \
  --persist \
  -p "RHYTHMIX Analytics" \
  --page "dashboard"

# Creates:
# - design-system/rhythmix-analytics/MASTER.md
# - design-system/rhythmix-analytics/pages/dashboard.md

# Then lock it to RHYTHMIX brand by replacing colors in MASTER.md
```

### AI Agent Skill Activation

The `ui-ux-pro-max` skill is now available to all AI agents:

```
/ui-ux-pro-max Build a landing page for my SaaS product
```

Or in chat:
```
"Build the Now Playing screen using DESIGN-swiftui.md for all styling."
```

---

## Contributing & Updating

### When to Update RHYTHMIX-BRAND.md

- Brand color change (rare)
- Typography system update
- Motion/easing library change
- Global component baseline update

**Process:**
1. Edit `design-system/RHYTHMIX-BRAND.md`
2. All projects inherit the change automatically
3. Commit with message: `brand: update RHYTHMIX color palette` (example)

### When to Add Page-Specific Overrides

- A specific page has unique layout (hero page vs. dashboard)
- Page requires different spacing/rhythm
- Page uses project-specific components

**Process:**
1. Create `design-system/[project]/pages/[page-name].md`
2. Copy relevant sections from MASTER.md
3. Override only what's different
4. Commit with message: `design: add [project]/[page-name] overrides`

### When to Generate New Project Design System

```bash
python3 .claude/skills/ui-ux-pro-max/scripts/search.py \
  "project description" \
  --design-system \
  --persist \
  -p "Project Name"

# Then lock to brand:
# 1. Read the generated MASTER.md
# 2. Replace all colors with RHYTHMIX palette
# 3. Replace fonts with Space Grotesk + JetBrains Mono
# 4. Update motion/easing to power3.out
# 5. Commit
```

---

## FAQ

**Q: Can I use a different color for my project?**  
A: No. The RHYTHMIX palette is locked globally. All projects must use the same colors.

**Q: Can I use a different font?**  
A: No. Space Grotesk (display/body) + JetBrains Mono (mono) are fixed.

**Q: What if my page needs a different layout?**  
A: Create a page-specific override file: `design-system/[project]/pages/[page-name].md`

**Q: How do I use this with my component library?**  
A: The CSS in each DESIGN.md file is framework-agnostic. Convert to your framework (React, Vue, Svelte, etc.) as needed.

**Q: Can I skip the pre-delivery checklist?**  
A: No. All items must be verified before shipping.

**Q: What if I need a color not in the palette?**  
A: Use one of the 10 palette colors. If truly needed, request a brand update (rare).

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-06-09 | Initial release: RHYTHMIX-BRAND.md, 4 projects (Studio, HerdCheck, Reset, Codex) |

---

## Support

- **UI UX Pro Max:** `.claude/skills/ui-ux-pro-max/`
- **Brand Questions:** See `design-system/RHYTHMIX-BRAND.md`
- **Project Questions:** See `design-system/[project]/MASTER.md`
- **Page-Specific Questions:** See `design-system/[project]/pages/[page-name].md`

