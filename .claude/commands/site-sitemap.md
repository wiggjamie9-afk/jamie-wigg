---
description: Stage 1 of the four-stage site build. Turn a brief into a sitemap — page tree + section list per page.
argument-hint: <site brief>
---

Invoke the `site-sitemap` skill to plan the structure of a site from:

> $ARGUMENTS

The skill asks 2-3 clarifying questions (audience, primary CTA, scope, content vs. conversion focus), then writes `sites/<slug>/sitemap.md` with the page tree, section list per page, and stable section IDs (S1, S2, ...).

After it lands, suggest:
- `/site-wireframe <slug>` — wireframe every page
- `/site-wireframe <slug> <page>` — wireframe one page

For RHYTHMIX work, suggest `/rhythmix-site` instead — it pre-fills brand-specific questions and locks the styleguide to `rhythmix-teaser-60s/DESIGN.md`.
