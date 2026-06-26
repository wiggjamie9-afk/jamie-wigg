# antigravity-awesome-skills — full library (installed)

- **Source:** https://github.com/sickn33/antigravity-awesome-skills (release `v13.3.0`)
- **Installed:** 2026-06-26 via the release tarball (the `npx antigravity-awesome-skills`
  git-clone path is blocked by this environment's proxy git shim; the tarball over
  HTTPS is the same content from the same allowed host).
- **Contents:** the upstream canonical `skills/` tree — 1,589 `SKILL.md` skills.

## Why it lives here and not in `.claude/skills/`

This repo already ships a curated skill set in `.agents/skills/` (source of truth,
symlinked into `.claude/skills/`, locked via `skills-lock.json` — see root `CLAUDE.md`).
The full library is kept **isolated** in `.agents/awesome-skills/` so it does not
clobber curated skills or break the symlink/lock convention. 39 skill names here
collide with existing `.claude/skills/` entries; isolation avoids those conflicts.

These skills are **installed but not active** in Claude Code — nothing here is
symlinked into `.claude/skills/`, so it won't bloat the live skill list or context.

## Activating a specific skill

Symlink the one you want into the live skills dir:

```bash
ln -s ../../.agents/awesome-skills/<skill-name> .claude/skills/<skill-name>
```

(If the name collides with an existing skill, pick a different link name.)

## Re-running the upstream installer

On a machine/network where GitHub git access is unrestricted:

```bash
npx antigravity-awesome-skills --path .agents/awesome-skills
```
