---
description: RHYTHMIX-aware wrapper around the four-stage site build. Locks styleguide to rhythmix-teaser-60s/DESIGN.md and pre-fills brand-specific clarifying questions. Use for any RHYTHMIX landing page, campaign, or microsite.
argument-hint: <site brief>
---

Invoke the `rhythmix-site` skill for:

> $ARGUMENTS

**Routing check first.** If the brief is for a non-RHYTHMIX site (rare in this repo), redirect to `/site-build` and stop.

**Step 1** — read locked context in parallel: `rhythmix-teaser-60s/DESIGN.md`, `CONTEXT.md`, `rhythmix.html`, `launch-section.html`, `text*.txt`.

**Step 2** — ask the RHYTHMIX-specific clarifying questions via `AskUserQuestion`: audience emphasis (creator / fan / venue), companion video (if any), tier emphasis (lifetime / monthly / free trial / none), page count (single / + pricing / + FAQ / custom).

**Step 3** — run `site-sitemap` with RHYTHMIX section conventions (Hero → Stats → Features four pillars → How it works → Creator testimonials → vs. Suno/Udio/LANDR → Pricing → FAQ → Footer CTA).

**Step 4** — run `site-wireframe` in parallel per page, using RHYTHMIX-preferred component patterns from the skill. Voice: confident, builder-aimed, anti-corporate. Match tone in `rhythmix.html`.

**Step 5** — run `site-styleguide` with the brand-source question pre-answered: **locked to `rhythmix-teaser-60s/DESIGN.md`**. The output styleguide is a thin pointer, not a duplicate.

**Step 6** — run `site-design` in parallel per page. If a companion video was specified, embed it in the hero with a `raw.githubusercontent.com` URL pinned to the commit hash (same convention `downloads.html` uses).

**Step 7** — land on the site. Show the `sites/<slug>/` tree, preview command, and any placeholder copy that needs refining. Do not auto-commit. Remind the user that companion-video URLs need to be re-pinned after the commit lands.
