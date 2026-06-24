# Site Build Skill — Four-Stage Site Pipeline Orchestrator

**Purpose:** Run the complete site-build pipeline end-to-end: Sitemap → Wireframe → Styleguide → Design, with parallel fan-out at the per-page stages.

**Usage:** `/site-build <site brief>`

## Four-Stage Pipeline

### Stage 1: Sitemap
- **Input:** Site brief + 2-3 clarifying questions
- **Skill:** Invoke `site-sitemap`
- **Output:** `sites/<slug>/sitemap.md` (page list, hierarchy, content outline)
- **Gating:** Confirm with user before proceeding if sitemap surfaces surprises

### Stage 2: Wireframes (Parallel)
- **Input:** Slug + sitemap
- **Skill:** Invoke `site-wireframe` skill
- **Parallelism:** One `Agent` call per page (all in parallel)
- **Output:** `sites/<slug>/wireframes/<page>.md` per page

### Stage 3: Styleguide
- **Input:** Slug
- **Skill:** Invoke `site-styleguide`
- **Decisions:** Brand source, density (compact/spacious), tone (formal/playful/technical)
- **Output:** `sites/<slug>/styleguide.md` (colors, typography, spacing, component patterns)

### Stage 4: Design (Parallel)
- **Input:** Slug + wireframes + styleguide
- **Skill:** Invoke `site-design` skill
- **Parallelism:** One `Agent` call per page (all in parallel)
- **Output:** `sites/<slug>/<page>.html` per page (self-contained HTML with inline styles)

## Routing

**RHYTHMIX Redirect:** If brief mentions RHYTHMIX, the brand, AI music, or a companion `rhythmix-*` video, redirect to `/rhythmix-site` instead. That wrapper pre-locks styleguide to `rhythmix-teaser-60s/DESIGN.md` and pre-fills brand-specific questions.

## Final Output

After Stage 4, show the user:
- Tree of `sites/<slug>/` with file structure
- Preview command: `python3 -m http.server 8000 --bind 127.0.0.1 --directory sites/<slug>`
- Any pages with placeholder copy (wireframe → design) so they know what to refine
- **Do NOT auto-commit** — wait for approval

## Dependencies

- `site-sitemap` skill
- `site-wireframe` skill
- `site-styleguide` skill
- `site-design` skill
- `rhythmix-site` skill (for RHYTHMIX-branded work)

## Notes

- Each stage **consumes the previous stage's output** — serial ordering required
- Stages 2 and 4 support **parallel per-page execution** — all pages in that stage run concurrently
- Brand source defaults to custom (ask user) but can be locked to `rhythmix-teaser-60s/DESIGN.md` via `/rhythmix-site`
