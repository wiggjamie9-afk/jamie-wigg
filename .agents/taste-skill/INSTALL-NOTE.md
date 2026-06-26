# taste-skill (Leonxlnx) — installed from upstream

- **Source:** https://github.com/Leonxlnx/taste-skill (`main`)
- **Installed:** 2026-06-26 from the source tarball (same content `npx skills add` clones).
- **Contents:** 13 skills (10 code, 3 image-generation). `design-taste-frontend` is the
  **v2 (experimental)** rewrite; `design-taste-frontend-v1` preserves v1.

## Folder → install name

Skills are symlinked into `.claude/skills/` under their frontmatter `name:` (install name),
which differs from the folder name:

| folder | install name |
|---|---|
| taste-skill | design-taste-frontend (v2) |
| taste-skill-v1 | design-taste-frontend-v1 |
| gpt-tasteskill | gpt-taste |
| image-to-code-skill | image-to-code |
| redesign-skill | redesign-existing-projects |
| soft-skill | high-end-visual-design |
| output-skill | full-output-enforcement |
| minimalist-skill | minimalist-ui |
| brutalist-skill | industrial-brutalist-ui |
| stitch-skill | stitch-design-taste |
| brandkit | brandkit |
| imagegen-frontend-web | imagegen-frontend-web |
| imagegen-frontend-mobile | imagegen-frontend-mobile |

## Relationship to .agents/awesome-skills/

8 of these names also shipped (older) in `.agents/awesome-skills/`. Their
`.claude/skills/` symlinks were **repointed here** so the authoritative upstream
taste-skill versions win. The awesome-skills copies still exist on disk, just unlinked
for these names.

## Settings (taste-skill / design-taste-frontend)

Dials at the top of the SKILL.md, 1–10:
- `DESIGN_VARIANCE` — layout experimentation (low: centered/clean · high: asymmetric)
- `MOTION_INTENSITY` — animation depth (low: hover · high: scroll/magnetic)
- `VISUAL_DENSITY` — info per viewport (low: spacious · high: dense dashboards)

## Updating

```bash
npx skills add https://github.com/Leonxlnx/taste-skill --skill "design-taste-frontend"
```
