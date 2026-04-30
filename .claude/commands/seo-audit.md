---
description: Full-site SEO audit (19 sub-audits) — technical SEO, meta tags, schema, page speed, AI search, E-E-A-T — then applies fixes.
argument-hint: "[path-or-url] (optional, defaults to current repo)"
allowed-tools: Bash, Read, Edit, Write, Glob, Grep
---

# /seo-audit — Full Site Audit + Auto-Fix

You are running a **comprehensive SEO audit** on the user's site. The target is `$ARGUMENTS` if provided, otherwise the current working directory.

Run **all 19 sub-audits** below, then **implement fixes** for every issue you can fix locally (file edits). For issues you cannot fix automatically (need real URL, hosting access, runtime measurement), produce a clear punch-list at the end.

## Phase 0 — Discovery (do this first)

1. Detect project type by checking for: `package.json` (Node — look for next/astro/nuxt/gatsby/vite), `index.html` / `*.html` files (static), `_config.yml` (Jekyll/Hugo), `gatsby-config.js`, `astro.config.*`, `next.config.*`, WordPress files (`wp-config.php`).
2. Find all HTML files (incl. fragments): `find . -type f \( -name "*.html" -o -name "*.htm" -o -name "*.txt" \) -not -path "*/node_modules/*" -not -path "*/.git/*" -not -path "*/dist/*" -not -path "*/.next/*"`. Also look for HTML embedded in `*.tsx`/`*.jsx`/`*.vue`/`*.astro`/`*.svelte`.
3. Identify the primary site root (e.g. `public/`, `src/`, `pages/`, or the repo root).
4. Note: if the repo has only HTML fragments rather than complete documents, treat each fragment as part of the eventual page — audit accordingly and produce a recommendations doc.

State the detected stack and target files in one sentence before continuing.

## Phase 1 — Run all 19 sub-audits

For each sub-audit, output a single line: `[N/19] <name> — <PASS|FAIL|WARN> — <one-line finding>`. Then keep a running list of fixes to apply.

### Technical SEO (1–5)

1. **robots.txt** — present at site root, allows crawling, references sitemap. Fix: create/update `robots.txt`.
2. **sitemap.xml** — present, valid XML, lists all canonical URLs, references in robots. Fix: generate `sitemap.xml` from discovered routes/pages.
3. **Canonical tags** — every page has `<link rel="canonical" href="...">`. Fix: inject into `<head>`.
4. **URL hygiene** — lowercase, hyphens not underscores, no trailing index.html in links, no double slashes. Fix: rewrite offending hrefs.
5. **HTTPS & redirects** — internal links use absolute https where appropriate, no `http://` for own domain, no chains. Fix: replace `http://` with `https://` for own-domain links.

### Meta Tags & On-Page (6–10)

6. **`<title>`** — present, unique, 50–60 chars, includes primary keyword. Fix: write/trim title.
7. **`<meta name="description">`** — present, unique, 150–160 chars. Fix: write/trim description.
8. **Single H1** — exactly one `<h1>` per page, contains primary keyword. Fix: demote extras to H2.
9. **Heading hierarchy** — no skipped levels (H1→H3 without H2). Fix: re-level.
10. **Image alt text** — every `<img>` has descriptive `alt`; decorative images get `alt=""`. Fix: add alts (use surrounding context to write descriptive ones; never just put the filename).

### Structured Data & Social (11–13)

11. **JSON-LD schema** — at minimum `Organization` + `WebSite` site-wide; per-page types (`Article`, `Product`, `FAQPage`, `BreadcrumbList`) where applicable. Fix: inject `<script type="application/ld+json">` blocks.
12. **Open Graph** — `og:title`, `og:description`, `og:image` (1200×630), `og:url`, `og:type`. Fix: add to `<head>`.
13. **Twitter Card** — `twitter:card` (summary_large_image), `twitter:title`, `twitter:description`, `twitter:image`. Fix: add to `<head>`.

### Page Speed / Core Web Vitals (14–16)

14. **Image optimization** — formats (WebP/AVIF preferred), explicit `width`/`height` to prevent CLS, `loading="lazy"` on below-fold, `decoding="async"`. Fix: add attributes; recommend conversion for raster assets.
15. **Render-blocking resources** — `<script>` in `<head>` without `defer`/`async`, large CSS without critical-CSS strategy. Fix: add `defer` to non-critical scripts; flag CSS for review.
16. **Asset hints** — `<link rel="preconnect">` for third-party origins, `rel="preload"` for hero font/image, `font-display: swap` for `@font-face`. Fix: add hints; patch `@font-face` blocks.

### AI Search / LLM Optimization (17–18)

17. **llms.txt** — present at site root, summarizes site purpose + key URLs in markdown. Fix: generate `llms.txt`.
18. **Semantic HTML & extractable content** — uses `<article>`, `<section>`, `<nav>`, `<main>`, `<header>`, `<footer>`; FAQ-style content uses real `<h2>`+`<p>` (not just divs); answers are concise and quotable. Fix: rewrite divs to semantic tags where safe.

### E-E-A-T (19)

19. **Experience, Expertise, Authoritativeness, Trust** — visible author bio, About page link, contact info, last-updated date on content, external citations to authoritative sources. Fix: add author byline / updated stamp where templates allow; flag missing About/Contact.

## Phase 2 — Apply fixes

Apply every fix from Phase 1 that is a pure file edit. Group edits by file; use `Edit` for surgical changes and `Write` only when creating new files (`robots.txt`, `sitemap.xml`, `llms.txt`).

Rules:
- Never invent URLs. If you don't know the production domain, use `https://example.com` as a placeholder and flag it.
- Never invent author names, addresses, or claims. Leave a `<!-- TODO: ... -->` and add to the punch-list.
- Don't reformat unrelated code. Keep diffs minimal.
- For HTML fragments (no `<head>`), don't fabricate a `<head>` — instead, write recommendations to `SEO-AUDIT.md`.

## Phase 3 — Report

Print a final report with:
1. **Score** — `<passed>/19` and a one-line headline.
2. **What I fixed** — bullet list, grouped by file, with line numbers.
3. **Punch-list** — issues I couldn't fix automatically, each with file:line + what to do.
4. **Next steps** — runtime checks to run separately (Lighthouse, PageSpeed Insights, Search Console, schema.org validator, real Core Web Vitals).

Keep the report under 60 lines. Be specific; no fluff.

---

**Begin now.** Start with Phase 0.
