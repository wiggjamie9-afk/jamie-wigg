# Skills & Plugins Synchronization

## Overview
Skills extend Claude Code with specialized capabilities. They're tracked in:
- `.agents/skills/` — Source of truth (upstream)
- `.claude/skills/` — Mostly symlinks into .agents/
- `skills-lock.json` — Pins versions/hashes

## Available Skills

### Spec & Planning
- `/spec-quick` — Generate spec in 5 minutes
- `/spec-run` — Execute tasks in parallel waves
- `/spec-analyze` — Check for ambiguities
- `/rhythmix-spec` — RHYTHMIX campaign spec

### Video & Creative
- `/rhythmix-author` — End-to-end promo creation
- `/rhythmix-new` — 60s video from scratch
- `/rhythmix-site` — Brand-locked landing page
- `/site-build` — 4-stage site pipeline
- `/dream` — One-shot asset (image/video/music/voice)
- `/album-launch` — Fan-out 4 assets in parallel

### Code & Development
- `/verify` — Test changes work (run app, observe)
- `/code-review` — Audit code for bugs
- `/simplify` — Refactoring cleanup
- `/claude-api` — Claude API & SDK reference
- `/tdd` — Red-green-refactor cycle
- `/docker-development` — Docker workflow

### Engineering Practices
- `/grill-with-docs` — Interview & document decisions
- `/improve-codebase-architecture` — Refactoring guide
- `/finishing-a-development-branch` — Pre-merge checklist
- `/using-git-worktrees` — Parallel feature branches

### Product & Launch
- `/landing-page-generator` — Landing page builder
- `/saas-metrics-coach` — SaaS analytics
- `/competitive-teardown` — Market analysis
- `/feature-flags-architect` — Feature management

### Security & Operations
- 100+ specialized security skills (see `.agents/skills/`)

## Syncing Skills

### Check current skills
```bash
ls -la .claude/skills/ | head -20
wc -l .claude/skills/*/
```

### Update specific skill
```bash
# Remove old version
rm -rf .claude/skills/my-skill

# Clone from upstream
git clone https://github.com/path/to/skill .agents/skills/my-skill

# Create symlink
ln -s ../../.agents/skills/my-skill .claude/skills/my-skill

# Update skills-lock.json hash
```

### Full sync (automated)
```bash
# On a machine with unrestricted egress:
bash scripts/sync-skills.sh
```

## Using Skills

### In Claude Code CLI
```bash
/spec-quick My feature description
/spec-run agent-builder
/rhythmix-new 60s landscape
/dream a futuristic city
```

### In this codebase (already set up)
- `/spec-quick` — Generate specs
- `/spec-run` — Execute tasks
- `/rhythmix-new` — HyperFrames promos
- `/dream` — Asset generation

## skills-lock.json

Tracks skill versions to prevent upstream changes from breaking workflows:

```json
{
  "spec-quick": {
    "source": "https://github.com/anthropics/claude-code/skills/spec-quick",
    "hash": "abc123...",
    "version": "1.2.3",
    "pinned": true
  }
}
```

**Update when**: 
- Upstream skill version changes
- You customize a local skill
- CI breaks due to skill update

## Local Skills (Not Synced)

Custom skills in `.claude/skills/` that aren't in `.agents/`:
- `spec-run/` — Task orchestration
- `rhythmix-spec/` — RHYTHMIX variant
- (Others as added)

These don't get synced upstream, so they're project-specific.

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Skill not found | Check `.claude/skills/skill-name/` exists |
| "Skill did not run" | Check `.claude/skills/skill-name/manifest.json` |
| Symlinks broken | Run `ls -la .claude/skills/` — should show `→` arrows |
| Upstream updated | Update `.agents/` and regenerate symlinks |

## Next Steps on iMac

1. ✅ Skills already configured
2. Try: `/spec-quick my feature` to test
3. Try: `/dream a cool image` to test
4. If issues, re-symlink: `ln -s ../../.agents/skills/* .claude/skills/`

