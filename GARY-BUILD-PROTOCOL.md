# GARY BUILD PROTOCOL

> The quality bar for **everything** Gary builds — apps, pages, hubs, promos.
> If a build doesn't clear every gate below, it isn't done. No exceptions, no "substandard shit."
> Referenced from `GARY.md`. Read this before building or shipping anything.

---

## The standard in one line

**2026, polished-MVP, brand-locked, offline-first, verified with my own eyes before I call it done.**

---

## 1. Brand (non-negotiable)

- Lock to **`rhythmix-teaser-60s/DESIGN.md`** — the palette and type are fixed.
  - Canvas `#08050d` · magenta `#ff1f5a` · purple `#7c3aed` · cyan `#00d8ff` · green `#00e887` · gold `#f5c000` · pink `#ff6fc8`.
  - Display **Space Grotesk**, mono **JetBrains Mono**. Never Inter/Roboto/Arial.
- **Don't:** `#3b82f6`/`#333`/default fonts · full-frame linear gradients (banding — use radial + localized glow) · bouncy/elastic eases · emoji-as-decoration (one glyph or monogram per card max).

## 2. 2026 craft (the difference between MVP and slop)

- Atmospheric depth — radial glows, grain, layered transparency. Not flat solid fills.
- One orchestrated page-load moment (staggered reveals, capped delay) beats scattered micro-animations.
- Color-code by meaning (category accents), generous negative space, intentional type scale.
- Distinctive, not generic-AI. If it looks like a default template, redo it.

## 3. MVP gates (every build must pass)

- [ ] **Works offline-first** — localStorage/IndexedDB, no required server runtime for the core flow.
- [ ] **Responsive** 375px → 1920px. Test mobile *and* desktop.
- [ ] **Accessible** — WCAG AA contrast, keyboard nav, focus-visible states, `prefers-reduced-motion`, semantic HTML + aria.
- [ ] **Zero broken** links, images, or console errors. Generated thumbnails over broken `<img>`.
- [ ] **Fast** — no heavy deps for what vanilla can do; < 100KB where feasible.
- [ ] **Self-contained** — inline or same-origin assets; degrades gracefully.

## 4. Regenerable, not dead

- Anything covering a *set* (all apps, all videos) is built by a **script**, not hand-typed.
  - Template (`scripts/*.template.html`) + build script (`scripts/build-*.py`) + generated output.
  - One command rebuilds it when the inventory changes. Example: `python3 scripts/build-apps-hub.py`.
- Curated copy for flagships; extracted/derived data for the long tail.

## 5. Verify before "done" (the gate I cannot skip)

Use the ecosystem machinery to **prove** it works — don't assert it:

1. **Render it** — real browser (playwright), desktop + mobile viewports.
2. **Look at it** — screenshot, read it back with vision. Polish judged by eye, not by hope.
3. **Click it** — exercise filters, search, empty states, primary CTA.
4. **Count it** — assert expected counts (e.g. "114 of 114", "50 buddies").
5. Only then: commit, push, report — plainly, with what was verified.

> If playwright/browser isn't available, say so and fall back to structural validation — never silently skip the look.

## 6. Use the ecosystem (don't hand-crank)

- `frontend-design` skill → anchor the aesthetic before coding.
- `playwright` → render + screenshot + interaction tests.
- Sub-agents (Haiku for mechanical, Sonnet for judgment) → fan out cataloguing, copy, variants.
- `creative-stack` / `higgsfield` / `replicate` → real imagery, video, voice when an asset is the deliverable.
- `context7` → current library docs, always over training guesses.

---

*Maintained by Gary. When the bar moves, update this file — and hold every build to it.*
