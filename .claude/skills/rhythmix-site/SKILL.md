---
name: rhythmix-site
description: RHYTHMIX-aware wrapper around the site build pipeline. Pre-locks the styleguide stage to rhythmix-teaser-60s/DESIGN.md so every RHYTHMIX landing site inherits the same brand identity. Use for new RHYTHMIX marketing pages, launch sections, or microsites. Triggered by /rhythmix-site.
metadata:
  tags: rhythmix, site, landing, hyperframes, brand
---

# RHYTHMIX Site

Thin wrapper on top of the four-stage site build (`/site-sitemap` → `/site-wireframe` → `/site-styleguide` → `/site-design`). Locks brand identity to `rhythmix-teaser-60s/DESIGN.md` and pre-fills the styleguide question so RHYTHMIX landing work doesn't drift visually.

## When to use

- A new RHYTHMIX landing page, campaign page, or launch microsite
- A pricing / FAQ / about page paired with a RHYTHMIX promo video
- Refresh of an existing RHYTHMIX HTML page (e.g. `rhythmix.html`, `launch-section.html`) with the four-stage flow as scaffolding

For **non-RHYTHMIX sites** in this repo (rare), use the generic `/site-build` flow instead.

## Process

### 1. Read the brief

From `$ARGUMENTS` or conversation context. RHYTHMIX briefs typically include: launch theme, target audience (creator / fan / venue), tier emphasis (e.g. lifetime deal vs. monthly), companion video (if any).

### 2. Read the locked context (in parallel)

- `rhythmix-teaser-60s/DESIGN.md` — palette, typography, motion eases
- `CONTEXT.md` — Promo / Cut / Narration / Hook glossary
- `rhythmix.html` — current canonical landing page (for continuity)
- `launch-section.html`, `launch.html` — existing launch patterns
- `text.txt`, `text 2.txt`, `text 3.txt` — earlier HTML/CSS landing fragments (hero, features, pricing, testimonials, FAQ)

### 3. Run stage 1 (`/site-sitemap`) with RHYTHMIX-aware clarifying questions

Use `AskUserQuestion`. Skip any answered by the brief.

- **Audience emphasis** — creator / fan / venue / mixed
- **Companion video** — yes (which one — link to a `rhythmix-<slug>-<dur>s/*.mp4` in downloads.html) / no
- **Tier emphasis** — lifetime $149 / monthly / free trial / no pricing on this page
- **Page count** — single landing / landing + pricing / landing + pricing + FAQ / custom multi-page

Generate `sites/<slug>/sitemap.md`. Use RHYTHMIX section conventions where the brief doesn't override:

- Standard RHYTHMIX section sequence: Hero → Stats → Features (four pillars) → How it works → Creator testimonials → Comparison vs. Suno/Udio/LANDR → Pricing → FAQ → Footer CTA
- Hero visual should reference the companion video if one is specified

### 4. Run stage 2 (`/site-wireframe`)

Wireframe every page in the sitemap. Issue parallel Agent calls if multi-page.

For RHYTHMIX wireframes, prefer these component patterns:

| Section | RHYTHMIX-preferred pattern |
|---|---|
| Hero | `video-hero` if companion video, else `centered-hero` |
| Stats | `metric-row` with three counters |
| Features | `feature-grid-3` or `feature-deep-dive-alternating` for four pillars |
| How it works | `numbered-steps` (4 steps mapped to the four pillars) |
| Testimonials | `testimonial-cards` (3 quotes from creator types) |
| Comparison | `vs-table` against Suno / Udio / LANDR |
| Pricing | `pricing-3-tier` with lifetime tier highlighted |
| FAQ | `faq-accordion` |
| Footer CTA | `cta-with-visual` referencing the companion video |

Copy should use the RHYTHMIX voice: confident, builder-aimed, anti-corporate. Match tone in `rhythmix.html` and `text.txt`.

### 5. Run stage 3 (`/site-styleguide`) — pre-answered

**Do not ask the brand-source question.** Skip straight to:

```markdown
# Styleguide: <site name>

## Brand source
Locked to `rhythmix-teaser-60s/DESIGN.md`. Do not redefine palette, typography, or eases here.

## Site-specific additions
- ...
```

The only legitimate additions are component patterns or spacing density adjustments specific to this site. Never override colors or fonts.

### 6. Run stage 4 (`/site-design`)

Render every page in parallel. The HTML inherits brand tokens from `DESIGN.md` (load them as CSS custom properties in `:root` at the top of each generated HTML file — copy the relevant tokens out of DESIGN.md, do not link or import).

If a companion video was specified, embed it in the hero section using a `<video>` element pointing at the `raw.githubusercontent.com` URL pinned to the current commit (same convention `downloads.html` uses).

### 7. Land

Show the user:
- The new `sites/<slug>/` folder with all artifacts
- Preview command: `python3 -m http.server 8000 --bind 127.0.0.1 --directory sites/<slug>`
- Suggested next step: review in browser, commit, optionally deploy via Cloudflare Pages / Netlify

## Hard rules

1. **Brand source is non-negotiable.** Always `rhythmix-teaser-60s/DESIGN.md`. The wrapper exists precisely to remove the temptation to drift.
2. **Companion video URLs are pinned to commit hashes** — same convention as `downloads.html`. Update the URL after the commit lands or it will 404 on first visit.
3. **RHYTHMIX voice is consistent** — match tone in `rhythmix.html` and `text*.txt`. Don't introduce corporate / generic SaaS copy.
4. **Match existing visual tokens** — if a section type already exists in `rhythmix.html` or `launch-section.html`, lift the pattern instead of inventing a new one.

## What this skill does NOT do

- Does not replace the generic `/site-build` flow. It pre-fills its questions.
- Does not generate a new brand identity. The locked DESIGN.md is the only source.
- Does not edit `rhythmix.html` directly. New work goes into `sites/<slug>/`.
- Does not handle deploy. That's a follow-up step.
