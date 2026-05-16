---
description: Stage 3 of the four-stage site build. Define the visual language — colors, typography, spacing, components, motion.
argument-hint: <slug>
---

Invoke the `site-styleguide` skill on:

> sites/$ARGUMENTS/

The single most important question to ask: **brand source** — use RHYTHMIX (`rhythmix-teaser-60s/DESIGN.md`), borrow from an existing site in the repo, or fresh?

If "fresh", also ask for tone (editorial / vibrant / technical / premium) and density (spacious / standard / dense).

Output is `sites/<slug>/styleguide.md` with named tokens (CSS custom properties) for colors, typography scale, spacing scale, radii, shadows, motion defaults, and at least 3 anti-patterns. If brand source is locked to DESIGN.md, the styleguide is a thin pointer rather than a duplicate.

After it lands, suggest `/site-design <slug>` to render every page to HTML.
