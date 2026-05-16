---
description: Stage 4 of the four-stage site build. Render the actual HTML/CSS for each page using sitemap + wireframes + styleguide. Renders multiple pages in parallel.
argument-hint: <slug> [page]
---

Invoke the `site-design` skill on:

> $ARGUMENTS

Reads `sites/<slug>/sitemap.md`, every `sites/<slug>/wireframes/*.md` in scope, and `sites/<slug>/styleguide.md`. If any are missing, stop and tell the user which earlier stage to run.

If a specific page is given, renders only that page. Otherwise renders every page — **issue parallel `Agent` calls in a single message**, one per page.

Each page becomes a self-contained `<!doctype html>` file at `sites/<slug>/<page>.html`:
- Inline `<style>` using CSS custom properties from the styleguide
- Semantic landmarks, accessible heading hierarchy
- Section IDs `s<n>-<slug>` for traceability with wireframes
- `prefers-reduced-motion` guard on any animation
- No build step required to preview

After all pages render, show paths, suggest opening in browser or running `python3 -m http.server 8000 --bind 127.0.0.1 --directory sites/<slug>`. Flag any sections where the wireframe copy was still placeholder. Do not auto-commit.
