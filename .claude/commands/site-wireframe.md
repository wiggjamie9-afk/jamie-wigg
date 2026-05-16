---
description: Stage 2 of the four-stage site build. Wireframe each page — section-by-section layout, suggested copy, component patterns. Renders multiple pages in parallel.
argument-hint: <slug> [page]
---

Invoke the `site-wireframe` skill on:

> $ARGUMENTS

Reads `sites/<slug>/sitemap.md`. If a specific page is given, wireframes only that page. Otherwise wireframes every page in the sitemap — **issue parallel `Agent` calls in a single message**, one per page, since pages are independent at this stage.

Each wireframe lives at `sites/<slug>/wireframes/<page>.md` with:
- Section-by-section layout intent
- Suggested copy (headline, subhead, CTA verb-phrase)
- Component pattern names from the library (e.g. `centered-hero`, `feature-grid-3`)

After it lands, suggest:
- `/site-styleguide <slug>` — define the visual language
- `/site-design <slug>` — render every page to HTML (after styleguide exists)
