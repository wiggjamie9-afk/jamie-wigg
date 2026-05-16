---
name: site-design
description: Stage 4 of the four-stage site build. Render the actual HTML/CSS for each page using the sitemap, wireframes, and styleguide. Multiple pages can be rendered as parallel Agent calls. Output is sites/<slug>/<page>.html. Triggered by /site-design.
---

# Site Design

Final stage of the site build pipeline. Combines all prior artifacts into rendered HTML/CSS.

## When to use

- "/site-design <slug>" — render every page in parallel
- "/site-design <slug> <page>" — render one page
- after `/site-sitemap`, `/site-wireframe`, and `/site-styleguide`

## Process

### 1. Read all prior artifacts

Required:
- `sites/<slug>/sitemap.md`
- `sites/<slug>/wireframes/<page>.md` (for each page being rendered)
- `sites/<slug>/styleguide.md`

If any are missing, stop and tell the user which earlier stage to run.

Also read for codebase context:
- `CLAUDE.md` — project conventions (which CSS approach the repo uses)
- Existing HTML in the repo (`rhythmix.html`, `index.html`, `text*.txt`) for prior-art patterns
- If `styleguide.md` says "Locked to rhythmix-teaser-60s/DESIGN.md", read that file too

### 2. Decide scope and parallelism

- If a specific page is in `$ARGUMENTS`, render only that page.
- Otherwise, render every page in the sitemap **in parallel** — issue one `Agent` tool call per page in a **single message**. Same pattern as `/spec-run`.

Each per-page Agent gets:
- The page's wireframe markdown
- The styleguide
- The sitemap (for cross-page navigation)
- Instructions to write only `sites/<slug>/<page>.html`

### 3. Per-page rendering rules

Output a self-contained `<!doctype html>` document at `sites/<slug>/<page>.html`. One file per page, no build step needed to preview.

#### Stack choice

- **Default**: vanilla HTML + CSS custom properties (matches repo's `rhythmix.html`, `index.html` style).
- **If repo's `package.json` includes `tailwindcss`**: use Tailwind utility classes, drop in via CDN `<script>` if there's no build pipeline at the site level.
- **Never** introduce a JS framework (React, Vue, etc.) at this stage. If interactivity is needed, write vanilla JS in a `<script>` block.

#### Required structure

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{{ Page title }}</title>
  <meta name="description" content="{{ Page description from wireframe }}" />
  <!-- preconnect to font hosts if using web fonts -->
  <style>
    /* CSS custom properties from styleguide */
    :root {
      --bg: #...;
      --accent: #...;
      /* etc. */
    }
    /* reset + base */
    /* component classes — one per pattern used on this page */
    /* responsive breakpoints */
    @media (prefers-reduced-motion: reduce) { /* ... */ }
  </style>
</head>
<body>
  <header><!-- nav from sitemap.md "Internal nav" --></header>

  <main>
    <section id="s1-hero" class="hero centered-hero"><!-- ... --></section>
    <section id="s2-social-proof" class="logo-strip"><!-- ... --></section>
    <!-- one section per S<n> in the wireframe, with id="s<n>-<slug>" -->
  </main>

  <footer><!-- footer from sitemap.md or sitewide --></footer>

  <script>
    /* GSAP-style on-scroll reveals if styleguide specifies motion */
    /* prefers-reduced-motion guard */
  </script>
</body>
</html>
```

#### Naming + IDs

- Section element `id` = `s<n>-<slug>` (e.g. `id="s3-features"`) — matches wireframe IDs for traceability.
- Class names follow the component-pattern names from the wireframe (`centered-hero`, `feature-grid-3`, etc.). One CSS class per pattern.

#### Accessibility

- Semantic landmarks: `<header>`, `<main>`, `<footer>`, `<nav>`.
- Heading hierarchy: one `<h1>` per page (the hero headline).
- Buttons that navigate are `<a>`. Buttons that act are `<button>`.
- Alt text on every `<img>`. Decorative images get `alt=""`.
- Color contrast: body text at least 4.5:1 against background. Check accent-on-bg before shipping.
- Focus styles visible (don't `outline: none` without a replacement).

#### Performance

- Inline critical CSS in `<style>` — these are landing pages, not apps. One HTML file, no separate CSS request.
- Use `loading="lazy"` on images below the fold.
- No web fonts in the critical path unless the styleguide specifies them; system fonts are the default.

#### Animation

- Match the styleguide's default ease + duration.
- Use Intersection Observer for scroll-triggered reveals. No third-party libraries unless the styleguide specifies GSAP — in which case load it via CDN at the bottom of `<body>`.
- Guard everything with `prefers-reduced-motion: reduce`.

#### Copy

- Use the suggested copy from the wireframe verbatim unless it's obviously a placeholder. Flag any sections where copy is `<draft headline>`-style placeholder for the user to refine after the render.

### 4. After all pages render

Show the user:
- Path(s) to the generated HTML file(s)
- Suggested ways to preview: open in browser directly, or `python3 -m http.server 8000 --bind 127.0.0.1 --directory sites/<slug>` for cross-page nav testing
- Any sections where wireframe copy was still placeholder — explicit list so they know what to refine
- Suggested next steps: review in browser, iterate on copy in wireframes/styleguide and re-run /site-design, or commit

Do NOT auto-commit.

## Hard rules

- **Self-contained HTML.** No build step required to preview. Inline CSS in `<style>`. JS in `<script>`.
- **Use styleguide tokens.** Every color and size comes from a `--token` defined in `:root`. No magic hex codes mid-document.
- **Section IDs are stable.** `id="s<n>-<slug>"` matches the wireframe IDs.
- **Parallel rendering for multi-page.** When rendering N pages, issue N `Agent` calls in one message. Sequential rendering for multi-page work is a misuse of this skill.
- **Don't redesign on the fly.** If the wireframe says `feature-grid-3` and the styleguide doesn't define what that looks like, follow the conventional implementation; don't invent a new pattern. If you genuinely need a new pattern, stop and ask the user to update the styleguide.

## What this skill does NOT do

- Does not deploy. Use Netlify / Vercel / Cloudflare Pages separately.
- Does not generate images, photos, or icons. Use `/dream` or the replicate / higgsfield skills for those.
- Does not write a backend. Forms render to `<form>` elements; wiring them up is a follow-up task.
