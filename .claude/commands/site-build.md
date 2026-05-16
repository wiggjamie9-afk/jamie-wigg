---
description: Run the full four-stage site build pipeline end-to-end. Sitemap → wireframe → styleguide → design, with parallel fan-out at the per-page stages.
argument-hint: <site brief>
---

Run the full four-stage site build pipeline for:

> $ARGUMENTS

This is the orchestrator. Run each stage sequentially (each consumes the previous stage's output), but **fan out per-page work in parallel** where the underlying skill supports it.

**Routing check first.** If the brief is RHYTHMIX-flavored (mentions RHYTHMIX, AI music, the brand, a companion `rhythmix-*` video), redirect to `/rhythmix-site` instead — that wrapper pre-locks the brand source.

**Stage 1** — invoke the `site-sitemap` skill on the brief. Ask 2-3 clarifying questions, write `sites/<slug>/sitemap.md`. Stop and confirm with the user before moving on if the sitemap surfaced anything surprising.

**Stage 2** — invoke the `site-wireframe` skill on the slug. For every page in the sitemap, issue a parallel `Agent` call in a single message. Write `sites/<slug>/wireframes/<page>.md` per page.

**Stage 3** — invoke the `site-styleguide` skill on the slug. Ask the brand-source question, then density and tone if fresh. Write `sites/<slug>/styleguide.md`.

**Stage 4** — invoke the `site-design` skill on the slug. For every page, issue a parallel `Agent` call in a single message. Write `sites/<slug>/<page>.html` per page.

After Stage 4, show the user:
- `sites/<slug>/` tree
- Preview command: `python3 -m http.server 8000 --bind 127.0.0.1 --directory sites/<slug>`
- Any sections where wireframe copy was still placeholder, so they know what to refine
- Do not auto-commit
