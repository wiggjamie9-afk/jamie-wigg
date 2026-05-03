---
description: Copy edits from .agents/skills/ (canonical) into ~/.claude/skills/ (loaded copy) so changes take effect this session
argument-hint: [skill-name]   # e.g. /sync-skills hyperframes. Omit to sync all.
---

The repo keeps skills in two places (see `.claude/CLAUDE.md`):

- `.agents/skills/<name>/` — canonical source, what gets edited
- `~/.claude/skills/<name>/` — what Claude Code actually loads

Editing the source does NOT update the loaded copy. This command syncs them.

If `$ARGUMENTS` is provided, sync only that skill:

```bash
cp -rv .agents/skills/$ARGUMENTS/. ~/.claude/skills/$ARGUMENTS/
```

If no argument, sync every skill listed in `skills-lock.json`:

```bash
for s in $(jq -r '.skills | keys[]' skills-lock.json); do
  echo "syncing $s"
  cp -r .agents/skills/$s/. ~/.claude/skills/$s/
done
```

Afterwards:
1. Note that the lock hashes in `skills-lock.json` may now mismatch — that's expected for local edits.
2. Tell me to restart the Claude Code session for the loaded skills to be re-read.
