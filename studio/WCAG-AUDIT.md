# WCAG 2.2 AA Accessibility Audit — STARLIGHTMIX Studio

**Auditor:** Claude (automated reasoning + manual code review)
**Date:** 2026-06-26
**Standard:** WCAG 2.2 Level AA
**Scope:** Pre-launch audit of the static-export Next.js app (`studio/`). High-traffic surfaces: landing (`/`), pricing (`/pricing`), and shared layout. Authenticated flows (`/new`, `/settings`, `/library`, `/render`, `/plan`) inherit the same `globals.css` token system; spot-checked, deep audit deferred to post-launch.

---

## 1. Discovery & Automated Baseline

Static review against axe-core / WAVE rule families (the app isn't deployed to a URL in this environment, so checks are performed by reading the rendered JSX + computed CSS tokens rather than a live DOM scan). Re-run live with `axe DevTools` + `WAVE` against the Cloudflare Pages preview before issuing the final conformance statement.

**Token foundation (already strong — keep):**
- `:focus-visible { outline: 2px solid cyan; outline-offset: 2px }` — visible focus on dark canvas ✓
- `@media (pointer: coarse)` → 44×44px minimum touch targets ✓ (meets 2.5.8 Target Size AA)
- `@media (prefers-reduced-motion: reduce)` → animations neutralised ✓ (2.3.3)
- `<html lang="en">` ✓ (3.1.1)
- `color-scheme: dark` ✓

---

## 2. Findings by POUR

Severity: 🔴 Blocker (fix before launch) · 🟠 Major · 🟡 Minor

### Perceivable

| # | Sev | Issue | WCAG | Location |
|---|---|---|---|---|
| P1 | 🔴 | `text-starlightmix-text-muted` (#6a5e8a) on bg (#08050d) = **3.45:1** — fails 4.5:1 for normal text. Affects the "Pricing" nav link and the "AI MUSIC VIDEO GENERATION" tagline. | 1.4.3 Contrast (Minimum) | `app/page.tsx:11,25` |
| P2 | 🟡 | Decorative checkmark `<svg>` in pricing features has no `aria-hidden` — screen readers may announce an empty graphic before each feature. | 1.1.1 Non-text Content | `app/pricing/page.tsx:135` |
| P3 | 🟡 | Decorative top-bar gradient `<div>` (highlighted tier) is exposed to the a11y tree. | 1.1.1 | `app/pricing/page.tsx:92` |

**Passing contrast (verified):** `slate-300` on `slate-800` = 9.85:1 ✓ · `slate-400` on `slate-800` = 5.70:1 ✓ · white on `slate-800` ✓ · `text-soft` (#c0b0e0) on bg = 10.1:1 ✓ · `text-faint` (#a0a0b0) on bg = 7.85:1 ✓

### Operable

| # | Sev | Issue | WCAG | Location |
|---|---|---|---|---|
| O1 | 🔴 | "Create Your Video", nav "Studio", and most CTAs link to **`/studio` — a route that does not exist** (real routes are `/new`, `/library`, `/settings`). Keyboard and pointer users hit a 404. | 2.4.4 Link Purpose / functional | `app/page.tsx:15,34`; `app/pricing/page.tsx:24,44,211` |
| O2 | 🟡 | No "skip to content" link — keyboard users tab through nav on every page load. | 2.4.1 Bypass Blocks | `app/layout.tsx` |

**Passing:** `<details>/<summary>` FAQ is natively keyboard-operable (Enter/Space) ✓ · focus indicators visible ✓ · no keyboard traps ✓.

### Understandable

| # | Sev | Issue | WCAG | Location |
|---|---|---|---|---|
| U1 | 🟡 | The "▼" caret in FAQ summaries is a bare glyph with no text alternative; harmless but should be `aria-hidden`. | 3.1 / 1.1.1 | `app/pricing/page.tsx:163` |

**Passing:** per-page `<title>` via metadata ✓ · consistent nav ✓ · `mailto:` link purpose clear from text ✓.

### Robust

| # | Sev | Issue | WCAG | Location |
|---|---|---|---|---|
| R1 | 🟠 | Pricing page root is a `<div>`, not `<main>` — no primary landmark for assistive tech. | 1.3.1 Info & Relationships / 4.1.2 | `app/pricing/page.tsx:68` |
| R2 | 🟡 | Home `<nav>` and the `<main>` have no `aria-label`; acceptable with single landmark each, but labelling future-proofs. | 1.3.1 | `app/page.tsx:7` |

**Passing:** heading hierarchy logical on both pages (single h1 → h2 → h3, no skips) ✓ · semantic `<ul>/<li>` for features ✓ · valid nesting ✓.

---

## 3. Remediation Plan (prioritised)

| Priority | Items | Effort | Status |
|---|---|---|---|
| **Blocker** | P1 (contrast), O1 (broken `/studio` links) | 20 min | ✅ Fixed |
| **Major** | R1 (`<main>` landmark) | 5 min | ✅ Fixed |
| **Minor** | P2, P3, U1 (aria-hidden), O2 (skip link), R2 (labels) | 15 min | ✅ Fixed |

---

## 4. Manual Testing Checklist (run against live preview before conformance statement)

- [ ] **Keyboard:** Tab through `/` and `/pricing` — every interactive element reachable, focus visible, logical order, skip link works.
- [ ] **Screen reader (NVDA + VoiceOver):** landmarks announced (main/nav), headings navigable, decorative SVGs silent, FAQ expand/collapse announced.
- [ ] **Zoom:** 200% and 400% reflow — no horizontal scroll, no clipped content (1.4.10 Reflow).
- [ ] **Contrast (live):** axe DevTools + WAVE scan on Cloudflare preview — zero contrast errors.
- [ ] **Reduced motion:** OS setting on — gradients/transitions neutralised.

---

## 5. Conformance Statement (draft — finalise after §4)

> STARLIGHTMIX Studio targets **WCAG 2.2 Level AA**. Automated and manual code review of the landing and pricing surfaces found 2 blockers and 1 major issue, all remediated (see §3). A live-preview pass (§4) is required before publishing the formal accessibility statement. Authenticated flows are scheduled for a follow-up deep audit.
