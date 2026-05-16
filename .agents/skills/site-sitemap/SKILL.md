---
name: site-sitemap
description: Stage 1 of the four-stage site build (Relume-style). Turn a brief into a sitemap — page tree plus section list per page. Output is sites/<slug>/sitemap.md, consumed by /site-wireframe. Triggered by /site-sitemap.
---

# Site Sitemap

First stage of the site build pipeline. Plans the page-and-section structure of a marketing or landing site from a one-line brief.

## When to use

- "/site-sitemap <brief>"
- "plan the structure of a site for X"
- as the first step before `/site-wireframe`

For a one-page landing site, this stage is still useful — it forces section-level planning before wireframing.

## Process

### 1. Read the brief

From `$ARGUMENTS` or current conversation context. Brief examples:
- "marketing site for an AI music platform with pricing and creator testimonials"
- "single-page launch for a beta product"
- "founder personal site, two pages"

### 2. Derive a slug

Kebab-case, ≤30 chars. Confirm with the user only if `sites/<slug>/` already exists.

### 3. Ask 2-3 clarifying questions via `AskUserQuestion`

Skip any answered by the brief. Recommended options first.

- **Audience** — who is this for? (single audience vs. multiple)
- **Primary CTA** — what's the single action you want visitors to take? (signup / purchase / download / contact / read)
- **Scope** — single page or multi-page? If multi, rough page list.
- **Conversion vs. content** — heavy on social proof + CTA repetition, or heavy on long-form content?

### 4. Generate `sites/<slug>/sitemap.md`

```markdown
# Sitemap: <Site Name>

## Audience
<one sentence>

## Primary CTA
<one sentence>

## Pages

### / (Home)
- **Purpose**: <one sentence>
- **Sections**:
  - **S1 Hero** — headline + subhead + primary CTA + supporting visual
  - **S2 Social proof** — logo strip / press / metrics
  - **S3 Features** — 3-6 feature cards
  - **S4 How it works** — 3-step or 4-step flow
  - **S5 Testimonials** — 2-4 quotes
  - **S6 Pricing** — tier comparison
  - **S7 FAQ** — 5-8 Q&A
  - **S8 Footer CTA** — final conversion push + secondary CTA

### /pricing
- **Purpose**: <one sentence>
- **Sections**: ...

### /about (or whatever)
...

## Internal nav
- Header: <pages to link>
- Footer: <pages to link>
- In-page anchors: <which homepage sections to surface as nav>

## Out of scope
- <pages explicitly NOT included>
```

Sections get **stable IDs** (S1, S2, ...). Wireframes and designs reference these IDs.

### 5. Land on the sitemap

Show the user:
- Path to `sites/<slug>/sitemap.md`
- Page count + total section count
- Next step: `/site-wireframe <slug>` (wireframes every page) or `/site-wireframe <slug> <page>` (just one)
- For RHYTHMIX-branded work, suggest `/site-styleguide <slug>` can short-circuit to use `rhythmix-teaser-60s/DESIGN.md`

## Section vocabulary

Prefer these section names when they fit — they're well-understood and the wireframe/design stages have templates for them:

- **Hero** — headline + subhead + CTA + visual
- **Stats / Metrics** — single-line numbers (users, output, time saved)
- **Features list** — grid of 3-6 cards
- **Feature deep-dive** — alternating left/right blocks, one feature each
- **How it works** — numbered steps
- **Social proof** — logos / press / counts
- **Testimonials** — quote cards
- **Pricing** — tier comparison table
- **Comparison** — vs. competitors
- **FAQ** — accordion or two-column
- **Lead capture** — email form
- **Footer CTA** — final conversion banner
- **Footer** — links + legal

If the brief needs something not in this list, use a clear new name and add a one-line note about what the section does.

## Hard rules

- **Don't write any HTML yet.** That's stage 4 (`/site-design`).
- **Don't pick colors or fonts.** That's stage 3 (`/site-styleguide`).
- **Don't write final copy.** Wireframes get suggested copy; this stage just names sections and states their purpose.
- **Section IDs are stable** — never renumber across regenerations.

## What this skill does NOT do

- Does not produce wireframes or designs.
- Does not pick a CMS or stack. Output is structural plan only.
- Does not write the actual content. The wireframe stage drafts copy.
