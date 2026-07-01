# Awesome Claude Code — Reference

## Overview

**Awesome Claude Code** (`github.com/hesreallyhim/awesome-claude-code`) is a
curated list of high-quality resources for **Claude Code** — skills, subagents,
hooks, status lines, slash-commands, agent orchestrators, plugins, and developer
tooling. It's curated with judgment (things that don't work get cut; things that
do get tagged with what they're actually for), spanning beginner → veteran, with
an emphasis on code quality, security, and originality.

> ### How this fits the RHYTHMIX repo
> **A discovery source for this repo's own agent ecosystem.** This repo is built
> around Claude Code skills/agents (`.claude/skills/`, `.agents/skills/`,
> `.claude/agents/`, a big `.mcp.json`, and the `skills-lock.json` vendoring
> pattern). Awesome Claude Code is where you'd *find* new skills/hooks/orchestrators
> worth vendoring in — exactly like the already-vendored `mattpocock/skills` and
> `anthropics/skills` (see `SETUP-MATT-POCOCK-SKILLS.md`, `SETUP-ANTHROPIC-SKILLS.md`).
> It's a **link list, not a tool** — nothing to install, so it's **not** wired into
> `mac-downloads/Install-Downloads.command`.

## How to use it with this repo

1. Browse the list for a skill / hook / agent that fits a need here.
2. Vendor it the way this repo already does: copy the skill into
   `.agents/skills/<name>/`, symlink into `.claude/skills/<name>`, and record the
   upstream + hash in `skills-lock.json` (per the repo's Skills conventions in
   `CLAUDE.md`). Don't hand-edit synced skills — update upstream and re-record.
3. For hooks/status-lines, follow the resource's own install notes; keep repo-wide
   settings in `.claude/settings.json`.

## Notes

- **The pasted intro didn't include the actual entry list** (its Table of Contents
  read "Coming soon…"), so this doc points at the list rather than cataloging
  specific picks. When you want, share the section(s) you're interested in and I'll
  pull out the few worth vendoring here — same "relevant few" approach used for the
  awesome-selfhosted picks.
- **Sibling lists** (for cross-checking): `ComposioHQ/awesome-claude-skills`,
  `travisvn/awesome-claude-skills`, `jqueryscript/awesome-claude-code`,
  `rohitg00/awesome-claude-code-toolkit`.
- Source of truth: `github.com/hesreallyhim/awesome-claude-code`.
