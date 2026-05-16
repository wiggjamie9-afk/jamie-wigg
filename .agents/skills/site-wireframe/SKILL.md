---
name: site-wireframe
description: Stage 2 of the four-stage site build. Take sites/<slug>/sitemap.md and produce per-page wireframes — section-by-section layout, suggested copy, and component types. Output is sites/<slug>/wireframes/<page>.md. Triggered by /site-wireframe.
---

# Site Wireframe

Second stage of the site build pipeline. Turns each page's section list into a wireframe — layout intent, suggested copy, and component types — without writing HTML or picking colors.

## When to use

- "/site-wireframe <slug>" — wireframe every page in the sitemap
- "/site-wireframe <slug> <page>" — wireframe one page
- after `/site-sitemap` and before `/site-design`

## Process

### 1. Read the sitemap

Read `sites/<slug>/sitemap.md`. If it doesn't exist, stop and tell the user to run `/site-sitemap` first.

### 2. Decide scope

- If a specific page is in `$ARGUMENTS`, wireframe only that page.
- Otherwise wireframe every page in the sitemap.
- For multiple pages, the calling agent SHOULD issue parallel `Agent` calls — one per page — in a single message. Each page is independent at this stage. (Same pattern as `/spec-run`.)

### 3. For each page, generate `sites/<slug>/wireframes/<page>.md`

Use page slugs that map to URL paths: `/` becomes `home.md`, `/pricing` becomes `pricing.md`, `/about` becomes `about.md`.

Format:

```markdown
# Wireframe: <Page Name> (<URL path>)

## S1 Hero

**Layout**: full-bleed, centered text, supporting visual right or below

**Suggested copy**:
- Headline (H1, ~6-10 words): "<draft headline>"
- Subhead (~15-25 words): "<draft subhead>"
- Primary CTA button: "<verb-phrase>"
- Secondary CTA (optional): "<verb-phrase or link>"

**Visual**: <type — product screenshot, illustration, animation, video, none>

**Component pattern**: centered-hero | split-hero | full-bleed-image-hero | video-hero

---

## S2 Social proof

**Layout**: logo strip below hero

**Suggested copy**:
- Eyebrow text (optional): "Trusted by"
- Logos: <count, source — placeholder or list>

**Component pattern**: logo-strip | metric-row | press-quotes

---

## S3 Features

**Layout**: 3-column grid (desktop), stacked (mobile)

**Suggested copy**:
- Section eyebrow: "<short label>"
- Section headline (H2): "<draft headline>"
- Feature 1: title (~3-5 words) + body (~20 words) + icon/glyph
- Feature 2: ...
- Feature 3: ...

**Component pattern**: feature-grid-3 | feature-grid-6 | feature-deep-dive-alternating

---

[continue for each section in the sitemap...]
```

### 4. Section pattern library

For each section type, pick a `component pattern` from this library. The design stage uses these names as templates.

| Section type | Component patterns |
|---|---|
| Hero | `centered-hero` · `split-hero` · `full-bleed-image-hero` · `video-hero` |
| Social proof | `logo-strip` · `metric-row` · `press-quotes` |
| Features | `feature-grid-3` · `feature-grid-6` · `feature-deep-dive-alternating` · `feature-tabs` |
| How it works | `numbered-steps` · `timeline` · `before-after` |
| Testimonials | `testimonial-cards` · `testimonial-carousel` · `quote-spotlight` |
| Pricing | `pricing-3-tier` · `pricing-toggle-monthly-annual` · `pricing-single` |
| Comparison | `vs-table` · `feature-checklist` |
| FAQ | `faq-accordion` · `faq-two-column` |
| Lead capture | `inline-form` · `centered-form` · `slide-in-form` |
| Footer CTA | `cta-banner` · `cta-with-visual` |
| Footer | `footer-multi-column` · `footer-minimal` |

If a section needs a pattern not listed, name it descriptively (e.g. `roadmap-quarterly-grid`) and add a one-line note about layout intent.

### 5. Suggested copy rules

- **Headlines are short** (≤10 words) and **lead with benefit, not feature**.
- **Subheads quantify or specify** (≤25 words).
- **CTA buttons are verb-phrases** (≤4 words). "Start free" beats "Sign up". "Get my plan" beats "Submit".
- **Body copy is placeholder-quality** — good enough to evaluate layout, not final.
- If the brief mentions specific copy / positioning, **use it verbatim** in the relevant section.

### 6. Land on the wireframes

Show the user:
- Paths to the new wireframe files
- Section count per page
- Next steps:
  - `/site-styleguide <slug>` — define the visual language
  - `/site-design <slug> <page>` — render one page to HTML (after styleguide exists)
  - `/site-design <slug>` — render all pages (parallelizes via Agent calls)

## Hard rules

- **No HTML yet.** Markdown-only output. The design stage writes HTML.
- **No color or font decisions.** That's the styleguide.
- **Section IDs come from the sitemap.** If you need a new section the sitemap didn't include, stop and ask the user to update `sitemap.md` first — keeping IDs stable matters for the design stage.

## What this skill does NOT do

- Does not write HTML.
- Does not pick a stack (Tailwind, vanilla CSS, etc.).
- Does not finalize copy. Suggested copy is meant to be reviewed and refined.
