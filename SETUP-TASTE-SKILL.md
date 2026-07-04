# SETUP — taste-skill (frontend design taste)

Portable Agent Skills that upgrade AI-built UIs — stronger layout, typography, motion,
and spacing instead of boilerplate-looking output. Also ships DESIGN.md tooling and
image-generation skills for reference boards. MIT. Source: `Leonxlnx/taste-skill`.

## Install

```bash
# All skills in the repo
npx skills add https://github.com/Leonxlnx/taste-skill

# Just the default (v2) frontend-taste skill
npx skills add https://github.com/Leonxlnx/taste-skill --skill "design-taste-frontend"

# Pin to v1 if you depend on its exact behavior
npx skills add https://github.com/Leonxlnx/taste-skill --skill "design-taste-frontend-v1"
```

You can also copy any `SKILL.md` into a project or paste it into ChatGPT / Codex.

## Skills (pass the install name to `--skill`)

| Install name | Use |
|---|---|
| `design-taste-frontend` | Default (v2) — infers design language, tunes VARIANCE / MOTION / DENSITY dials |
| `gpt-taste` | Stricter GPT/Codex variant, aggressive anti-slop |
| `image-to-code` | Generate references → analyze → implement |
| `redesign-existing-projects` | Audit an existing UI, then fix layout/spacing/hierarchy |
| `high-end-visual-design` | Polished, calm, premium (soft contrast, whitespace, spring motion) |
| `minimalist-ui` / `industrial-brutalist-ui` | Editorial vs hard-mechanical directions |
| `stitch-design-taste` | Google Stitch-compatible rules incl. `DESIGN.md` export |
| `imagegen-frontend-web` / `-mobile` / `brandkit` | Image comps / flows / brand boards (no code) |

## Settings (taste-skill only)

Top-of-file 1–10 dials: `DESIGN_VARIANCE` (layout experimentation), `MOTION_INTENSITY`
(hover → scroll/magnetic), `VISUAL_DENSITY` (spacious → dense dashboards).

## Notes

- Fits this repo's UI work; pair with `ui-ux-pro-max` (tokens/patterns) for structure
  and `taste-skill` for craft. Re-skin to RHYTHMIX / MindBlow brand tokens.
