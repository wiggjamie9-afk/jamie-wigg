---
name: content-section-publisher
description: Generate a new HTML content block (release announcement, case study, comparison, blog post excerpt) modeled on launch-section.html and insert it into an existing page or as a new file.
triggers:
  - "Publish a new release section for [topic]"
  - "Add a launch announcement for [feature]"
  - "Create a case-study block for [creator]"
  - "Append a comparison section about [competitor]"
---

# Content Section Publisher

Generates standalone HTML blocks that match the established RHYTHMIX visual language (see `/launch-section.html` as the canonical reference) and either inserts them into an existing page or saves them as a new fragment file.

## Inputs

- **type** (required) — `release-announcement | case-study | comparison | feature-spotlight | testimonial-block | stat-block`.
- **destination** (required) — `inline:[page.html]:after-section:[id]` to insert into an existing page, or `new:[filename.html]` to save as a standalone fragment.
- **brief** (required) — the substantive content (what's the release / who's the creator / what's the comparison / what numbers).
- **manychat_keyword** (optional) — if the section has a CTA capture, the keyword that funnels into ManyChat.

## Workflow

1. Read all four context files + `/cowork-system/context/brand-style.md` + `/rhythmix-teaser-60s/DESIGN.md`.
2. Read `/launch-section.html` as the structural reference. Note the section conventions:
   - Outer `<section class="section">` wrapper.
   - `<div class="container">` interior.
   - Eyebrow row (`<div class="eyebrow"><span class="dot"></span>LABEL</div>`).
   - `<h2 class="section-title">` with `<span class="gradient-text">` accent.
   - Card grids using `--card`, `--border`, `--fm` (mono), `--fs` (display sans).
3. Build the new block matching that pattern. Use only the established CSS variables. No new classes unless the type genuinely requires one — and if so, scope them with a unique prefix and inline the styles inside the section.
4. Apply every voice rule from `/cowork-system/context/brand-voice.md`. Both voice tests must pass.
5. For `case-study` and `testimonial-block`, **never invent creator names or numbers.** Use only what the brief provides. If the brief is missing a number, ask for it before drafting.
6. Print the full new block in chat for review.
7. Show the insertion plan:
   - For `inline:` — print the diff: where it will go, the surrounding 5 lines.
   - For `new:` — print the proposed filename and any sitemap.xml / nav-link updates needed.
8. Wait for approval.
9. On approval:
   - Inline destination: edit the target page, insert the new section after the named anchor, commit.
   - New file destination: write the new file, update `sitemap.xml` if the file is a navigable page (case-study, comparison), commit.
10. Save the brief + commit SHA to `/cowork-system/published/site-edits/[YYYY-MM-DD]-[destination-slug].md`.

## Type templates (high-level structure)

- **release-announcement** — eyebrow `NEW RELEASE`, headline with gradient-text on the version, 2-line intro, 3-card feature grid, CTA button.
- **case-study** — eyebrow `CASE STUDY`, headline featuring the creator + the headline number ($X earned, Y streams), 3-paragraph narrative, stat-block of 4 numbers, quote pulled out big.
- **comparison** — eyebrow `[COMPETITOR] VS RHYTHMIX`, headline as the contrarian claim, two-column grid (left = competitor, right = RHYTHMIX) with checkmarks, footer CTA.
- **feature-spotlight** — eyebrow `FEATURE`, headline naming the feature, demo gif/video placeholder, 3-bullet "what it does", numbered "how to use it" steps.
- **testimonial-block** — eyebrow `WHAT CREATORS SAY`, 3 testimonials in card grid, each with stars / quote / avatar / handle.
- **stat-block** — single full-width section with 4 hero numbers + mono captions, no card chrome.

## Stop conditions

- Stop and ask if the brief is missing required quantitative data for `case-study` / `stat-block` / `testimonial-block`.
- Stop and ask if the inline destination's anchor doesn't exist on the target page.
- For `comparison` blocks, refuse to publish negative claims about a competitor that aren't backed by a citable source — ask for the source first.
- Refuse to push to origin without explicit instruction.
