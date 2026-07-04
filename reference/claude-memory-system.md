# Claude Code memory: CLAUDE.md vs auto memory (reference)

Condensed from Anthropic's official Claude Code docs (pasted into the session). Two
complementary memory systems, both loaded at the start of every conversation; Claude
treats them as **context, not enforced configuration**. To *block* an action regardless
of what Claude decides, use a **PreToolUse hook**, not memory.

|  | CLAUDE.md | Auto memory |
|---|---|---|
| Who writes it | You | Claude |
| Contains | Instructions / rules | Learnings / patterns |
| Scope | Project, user, or org | Per repo, shared across worktrees |
| Loaded | Every session (in full) | Every session (first 200 lines / 25 KB of `MEMORY.md`) |
| Use for | Standards, workflows, architecture | Build commands, debugging insights, discovered prefs |

## CLAUDE.md locations (load order: broad → specific)

1. **Managed policy** — `/Library/Application Support/ClaudeCode/CLAUDE.md` (macOS),
   `/etc/claude-code/CLAUDE.md` (Linux/WSL), `C:\Program Files\ClaudeCode\CLAUDE.md`
   (Windows). Org-wide, cannot be excluded. Or inline via `claudeMd` in managed settings.
2. **User** — `~/.claude/CLAUDE.md` (all your projects).
3. **Project** — `./CLAUDE.md` or `./.claude/CLAUDE.md` (team-shared via git).
4. **Local** — `./CLAUDE.local.md` (gitignored, personal).

Files up the directory tree load in full at launch (root → cwd, so nearer files read
last). Subdirectory `CLAUDE.md` load on demand when Claude reads files there.

## Writing effective instructions

- **Size:** target **< 200 lines** per file — longer reduces adherence. Split via
  `.claude/rules/` (path-scoped) rather than one giant file. `@path` imports help
  organization but still load at launch (max 4 hops deep).
- **Specific + concrete:** "Use 2-space indentation" beats "format properly."
- **No contradictions:** conflicting rules → Claude picks arbitrarily.
- Block-level HTML comments (`<!-- … -->`) are stripped before injection — free maintainer notes.

## `.claude/rules/`

Topic files in `.claude/rules/*.md`. Optional YAML frontmatter `paths:` scopes a rule to
matching globs so it only loads when Claude touches those files:

```yaml
---
paths:
  - "src/api/**/*.{ts,tsx}"
---
```

Rules without `paths` load every session (same priority as `.claude/CLAUDE.md`).
Symlinks supported (share rules across projects). User-level: `~/.claude/rules/`.

## Auto memory

On by default (v2.1.59+). Stored at `~/.claude/projects/<project>/memory/` (per git repo,
shared across worktrees, machine-local — **not** synced to cloud). `MEMORY.md` is a
concise index (first 200 lines / 25 KB loaded each session); topic files load on demand.
Toggle with `/memory`, `autoMemoryEnabled: false`, or `CLAUDE_CODE_DISABLE_AUTO_MEMORY=1`.
Ask Claude to "remember X" → auto memory; "add X to CLAUDE.md" → CLAUDE.md.

## Large-team / monorepo controls

- **Managed CLAUDE.md** for org-wide behavioral guidance; **managed settings**
  (`permissions.deny`, `sandbox.enabled`, `env`, `forceLoginMethod`) for hard enforcement.
- **`claudeMdExcludes`** (glob list, any settings layer) skips irrelevant ancestor
  CLAUDE.md — except managed policy, which always applies.
- **AGENTS.md:** Claude reads CLAUDE.md, not AGENTS.md — `@AGENTS.md` import or symlink to
  bridge. `/init` also reads `.cursorrules`, `.windsurfrules`, `.devin/rules/`.

## Troubleshooting

- Not followed? `/memory` to confirm it's loaded; make it specific; remove conflicts; use
  a **hook** for must-run-at-a-point rules; `--append-system-prompt` for system-level.
- After `/compact`: project-root CLAUDE.md is re-read from disk; nested ones reload on next
  file read in that dir; conversation-only instructions are lost (put them in CLAUDE.md).

---

**Note for this repo:** the root `CLAUDE.md` here is *far* over the 200-line guidance
(it's a large quick-start + inventory). Per these docs that can dilute adherence. A future
cleanup could move chunks into path-scoped `.claude/rules/` (e.g. a `studio/` rule, a
`hyperframes/` rule) and keep the root file lean — ask if you want that refactor.
Source: Anthropic Claude Code docs (Memory / CLAUDE.md & auto memory).
