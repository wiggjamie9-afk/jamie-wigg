# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

Loose HTML/CSS fragments for a marketing landing page for **RHYTHMIX**, an AI music platform. There is no build system, package manager, test suite, or framework — just raw markup stored in `.txt` files.

- `text.txt` and `text 2.txt` are near-duplicate fragments containing the page head's closing `</style></head>`, the `<nav>`, the hero section, a marquee, and a stats grid. Treat the duplication as suspicious and confirm with the user before editing both.
- `text 3.txt` continues the page with the `#features` grid (14 numbered `feat-card`s), `#testimonials`, pricing, FAQ, email capture, final CTA, and footer.
- The fragments are not standalone documents — they assume an outer `<html><head>` (with CSS variables like `--card`, `--border`, `--red`, `--purple`, `--gold`, `--text`, `--soft`, `--muted`, `--green`, `--cyan`, `--fm`, `--fs`, `--fb`) and animations (`@keyframes orbit`, `pulse`) defined upstream. Don't redefine these tokens; reference them.

## Conventions in the existing markup

- Class names are kebab-case and section-prefixed: `feat-*`, `testi-*`, `plan-*`, `pf-*` (plan feature), `lc-*` (lifetime card), `faq-*`, `hero-*`, `proof-*`, `footer-*`.
- Inline `style=""` is used liberally for per-card gradients, orb sizes, and avatar colors. Match this pattern rather than extracting one-off rules to the stylesheet.
- Responsive breakpoints are `@media(max-width:900px)` and `@media(max-width:600px)` only. Add new responsive overrides to those existing blocks, not new breakpoints.
- The `.reveal` class on elements is for an external scroll-reveal observer (not defined in these fragments) — preserve it on new cards/rows.
- Brand tone is high-contrast dark UI with red→purple gradients (`linear-gradient(135deg,var(--red),var(--purple))`) and gold accents for premium/lifetime callouts.

## Working on this codebase

- There is nothing to build, lint, or test. To preview changes, the user must paste the fragments into a host HTML page that supplies the CSS variables and keyframes.
- Before changing the hero/nav/stats area, check whether the same change needs to land in both `text.txt` and `text 2.txt`. If they should be identical, ask the user whether to deduplicate rather than maintaining two copies silently.
- The `feat-card` numbering (`01`–`14`) and the matching marquee items in `text.txt`/`text 2.txt` must stay in sync if features are added, removed, or reordered.
