# Design System Quick Start — RHYTHMIX Brand Lock

**Installed:** 2026-06-09  
**Status:** Production Ready  
**Tool:** UI UX Pro Max (161 reasoning rules, 67 styles, 161 palettes)

---

## What Just Happened

✅ **UI UX Pro Max installed** — AI-powered design system generator  
✅ **RHYTHMIX-BRAND.md created** — Global source of truth (colors, fonts, motion)  
✅ **4 projects scaffolded** — Studio, HerdCheck, Reset + page overrides  
✅ **Pre-delivery checklists** — Accessibility, responsive, animation, contrast  

---

## The RHYTHMIX Palette (Locked Global)

Every project uses these colors. No substitutions:

| Color | Hex | Purpose |
|-------|-----|---------|
| Canvas | `#08050d` | Background |
| **Primary (Magenta)** | `#ff1f5a` | CTAs, emphasis ← **Use this for buttons** |
| Secondary (Purple) | `#7c3aed` | Accents |
| Tertiary (Cyan) | `#00d8ff` | Links, highlights |
| **Signal (Green)** | `#00e887` | Success, positive ← **Use for healthy states** |
| Highlight (Gold) | `#f5c000` | Key stats, money |
| Soft (Pink) | `#ff6fc8` | Counts, secondary |
| Display (White) | `#ffffff` | All text |
| Muted (Gray) | `#a0a0b0` | Secondary text |
| Surface | `#1a1325` | Card backgrounds |

---

## Typography (Locked Global)

- **Display:** Space Grotesk (headlines, big numbers)
- **Body:** Space Grotesk (UI text)
- **Mono:** JetBrains Mono (code, numerals)

```css
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');
```

---

## Motion (Locked Global)

- **Hover/Interaction:** 200–300ms, `cubic-bezier(0.4, 0, 0.2, 1)` (power3)
- **Enter:** 400–700ms, power3.out
- **Philosophy:** No bounce. No elastic. Confident and fast.

---

## How to Use

### 1. For AI Agents (Claude, Cursor, Codex, etc.)

When requesting UI:

```
"Build the [Page Name] for [Project Name].

Use design-system/RHYTHMIX-BRAND.md for global brand.
Check design-system/[project]/pages/[page-name].md for page overrides.

All colors locked to RHYTHMIX palette (magenta #ff1f5a for CTAs).
Typography: Space Grotesk display + JetBrains Mono mono.
Motion: 200-300ms power3.out, no bounce.
No emojis, SVG icons only (Heroicons/Lucide).

Build now."
```

### 2. For Designers / PMs

**Read in order:**
1. `design-system/README.md` — overview + structure
2. `design-system/RHYTHMIX-BRAND.md` — global brand
3. `design-system/[project]/MASTER.md` — project specifics
4. `design-system/[project]/pages/[page-name].md` — page overrides (if exists)

### 3. For Developers

**Generate a new project design system:**

```bash
python3 .claude/skills/ui-ux-pro-max/scripts/search.py \
  "your project description" \
  --design-system \
  --persist \
  -p "Project Name"

# Then lock colors to RHYTHMIX brand in the generated MASTER.md
```

**Generate style recommendations:**

```bash
python3 .claude/skills/ui-ux-pro-max/scripts/search.py \
  "glassmorphism" --domain style

python3 .claude/skills/ui-ux-pro-max/scripts/search.py \
  "form validation" --stack react
```

---

## Project Folders

| Project | Use For | Stack |
|---------|---------|-------|
| `design-system/starlightmix-studio/` | Music production SaaS | Next.js 15, React 19, Tailwind |
| `design-system/herdcheck/` | Livestock screening PWA | Offline-first, Service Worker |
| `design-system/reset/` | Recovery tracking app | iOS-style, React, Capacitor |
| `design-system/RHYTHMIX-BRAND.md` | **All projects** | Global source of truth |

---

## Key Files

| File | Purpose |
|------|---------|
| `design-system/README.md` | Full documentation (read first) |
| `design-system/RHYTHMIX-BRAND.md` | Global brand system (colors, fonts, motion) |
| `design-system/[project]/MASTER.md` | Project defaults (locked to brand) |
| `design-system/[project]/pages/[page].md` | Page-specific overrides (optional) |
| `.claude/skills/ui-ux-pro-max/` | AI design system generator (already installed) |

---

## Pre-Delivery Checklist

Before shipping any UI:

- [ ] **Colors:** All from RHYTHMIX palette (no substitutions)
- [ ] **CTAs:** Use magenta `#ff1f5a` (NOT green or blue)
- [ ] **Success:** Use signal green `#00e887`
- [ ] **Typography:** Space Grotesk (display) + JetBrains Mono (mono)
- [ ] **Motion:** 200–300ms transitions, power3.out easing, no bounce
- [ ] **Buttons:** `cursor: pointer`, visible focus states, magenta on hover
- [ ] **Inputs:** Magenta border on focus
- [ ] **Responsive:** 375px, 768px, 1024px, 1440px tested
- [ ] **Icons:** SVG only (no emojis)
- [ ] **Contrast:** 4.5:1 minimum (WCAG AA)
- [ ] **Accessibility:** Focus states visible, `prefers-reduced-motion` respected

---

## Anti-Patterns (DO NOT)

❌ **Colors:** No blue, no generic grays, no green CTAs  
❌ **Design:** No linear gradients (banding), no bouncy eases, no emoji icons  
❌ **Code:** No missing `cursor: pointer`, no instant state changes, no hidden focus  

---

## Examples

### Building a Button

```html
<!-- Magenta CTA (Primary) -->
<button class="btn-primary">Upload Track</button>

<!-- Outline (Secondary) -->
<button class="btn-secondary">Cancel</button>
```

```css
.btn-primary {
  background: #ff1f5a;
  color: #ffffff;
  padding: 12px 24px;
  border-radius: 6px;
  font-family: 'Space Grotesk', system-ui;
  font-weight: 600;
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
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

### Building a Card

```html
<div class="card">
  <h3>Your Track</h3>
  <p>Ready to render</p>
</div>
```

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

## Next Steps

1. **Read:** `design-system/README.md` (5 min)
2. **Reference:** Bookmark `design-system/RHYTHMIX-BRAND.md`
3. **Prompt agents:** Use template above when requesting UI
4. **Check:** Pre-delivery checklist before shipping

---

## Support

- **Questions about brand?** → `design-system/RHYTHMIX-BRAND.md`
- **Questions about project?** → `design-system/[project]/MASTER.md`
- **Questions about page?** → `design-system/[project]/pages/[page].md`
- **Full docs?** → `design-system/README.md`

---

**Everything you need is in `design-system/`. No more bland. No more guessing. Just ship.** 🚀

