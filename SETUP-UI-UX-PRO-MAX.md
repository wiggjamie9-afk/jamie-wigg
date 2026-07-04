# SETUP — UI-UX Pro Max (Design System Generator)

AI design-system reasoning engine: 161 product types, 67 UI styles, 161 palettes,
57 font pairings, 99 UX rules, BM25 search, `--design-system` generator. MIT.

## Install — Claude plugin (wired into this repo)

Declared in [`.claude/settings.json`](.claude/settings.json) — auto-loads in Claude Code:

```
/plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill
/plugin install ui-ux-pro-max@ui-ux-pro-max-skill
```

## Install — CLI (per machine, recommended for non-Claude agents)

```bash
npm install -g ui-ux-pro-max-cli
cd /path/to/project
uipro init --ai claude      # or: cursor | windsurf | codex | copilot | all
uipro init --ai claude --global   # ~/.claude/skills/
```

The npm package is `ui-ux-pro-max-cli`; it installs the `uipro` command.

## Use

```bash
# Full design system (ASCII or markdown)
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "beauty spa wellness" --design-system -p "Serenity Spa"
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "fintech banking" --design-system -f markdown

# Domain / stack scoped
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "glassmorphism" --domain style
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "form validation" --stack react

# Persist a Master + page overrides
python3 .../search.py "SaaS dashboard" --design-system --persist -p "MyApp" --page "dashboard"
```

Prereq: Python 3.x. Prompts like *"Build a landing page for my SaaS"* auto-activate the skill.

## Notes / caveats

- Older `uipro-cli` releases are stale — use `ui-ux-pro-max-cli`.
- Marketplace zip installs before v2.5.1 failed on symlinks — the CLI path avoids it.
- Fits this repo's design work (`sites/`, `rhythmix-teaser-60s/DESIGN.md`). Re-skin
  outputs to the RHYTHMIX / MindBlow tokens rather than shipping defaults.
