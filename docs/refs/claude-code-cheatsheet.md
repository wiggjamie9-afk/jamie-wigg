# Claude Code Workflow Cheatsheet (transcribed)

Reference card transcribed from a `codewithbrij` Instagram graphic. Not authoritative — anchor to [official Claude Code docs](https://docs.claude.com/en/docs/claude-code) for anything operational.

## 1. Getting Started

```bash
curl -fsSL https://claude.ai/install.sh | bash
cd your-project
claude /init
```

`/init` scans the codebase and creates a starter `CLAUDE.md` memory file.

## 2. Understanding CLAUDE.md

`CLAUDE.md` is Claude's persistent memory about your project. Loaded automatically at the start of every session.

| WHAT | WHY | HOW |
|---|---|---|
| Tech stack | Purpose of each module | Build / test / lint commands |
| Directory map | Design decisions | Workflows |
| Architecture | | Gotchas |

Example:

```markdown
# Project: MyApp
FastAPI REST API + React SPA + Postgres

## Commands
npm run dev
npm run test
npm run lint

## Architecture
/app → Next.js App Router pages
/lib → shared utilities
/prisma → DB schema & migrations
```

## 3. Memory File Hierarchy

```
~/.claude/CLAUDE.md          Global — all projects
~/CLAUDE.md                  Parent — monorepo root
./CLAUDE.md                  Project — shared on git
./frontend/CLAUDE.md         Subfolder — scoped context
```

Rules:
- Keep each <200 lines
- Subfolder files **append** context
- Never **overwrite** parent context

## 4. Best Practices for CLAUDE.md

- Run `/init` first, then refine output
- Be specific in instructions
- Add gotchas Claude cannot infer
- Reference docs with `@filename`
- Add workflow rules
- Keep memory concise
- Commit to git for team sharing

## 5. Project File Structure

```
your-project/
├── CLAUDE.md
├── .claude/
│   ├── settings.json
│   ├── settings.local.json
│   ├── skills/
│   │   ├── code-review/SKILL.md
│   │   └── testing/SKILL.md
│   ├── commands/
│   │   └── deploy.md
│   └── agents/
│       └── security-reviewer.md
└── .gitignore
```

## 6. Adding Skills

Skills are markdown guides Claude auto-invokes via natural language.

| Scope | Path |
|---|---|
| Project skill | `.claude/skills/<name>/SKILL.md` |
| Personal skill | `~/.claude/skills/<name>/SKILL.md` |

The skill's `description:` field is **critical** for auto-activation.

```markdown
---
name: testing-patterns
description: Jest testing patterns
allowed_tools: Read, Grep, Glob
---

# Testing Patterns
Use describe + it + AAA pattern.
Use factory mocks.
```

## 7. Skill Ideas for AI Engineers

- code-review
- testing-patterns
- commit-messages
- docker-deploy
- codebase-visualizer
- api-design

## 8. Setting Up Hooks

Hooks are deterministic callbacks: `PreToolUse`, `PostToolUse`, `Notification`.

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "scripts/sec.sh",
            "timeout": 5
          }
        ]
      }
    ]
  }
}
```

Exit codes: `0` → allow, `2` → block.

## 9. Permissions & Safety

```json
{
  "permissions": {
    "allow": ["Read:*", "Bash:git:*", "Write:*:*.md"],
    "deny": ["Read:env:*", "Bash:sudo:*"]
  }
}
```

## 10. The 4-Layer Architecture

| Layer | Purpose |
|---|---|
| L1 — CLAUDE.md | Persistent context and rules |
| L2 — Skills | Auto-invoked knowledge packs |
| L3 — Hooks | Safety gates and automation |
| L4 — Agents | Subagents with their own context |

## 11. Daily Workflow Pattern

```
cd project && claude
Shift+Tab + Tab → Plan Mode
Describe feature intent
Shift+Tab → Auto Accept
/compact
Esc Esc → rewind
Commit frequently
Start new session per feature
```

## 12. Quick Reference

| Command | Action |
|---|---|
| `/init` | Generate CLAUDE.md |
| `/doccat` | Check installation |
| `/compact` | Compress context |
| Shift+Tab | Change modes |
| Tab | Toggle extended thinking |
| Esc Esc | Rewind menu |

---

*Source: cheatsheet graphic by Brij Kishore Pandey (codewithbrij). Transcribed from screenshot — verify against `https://docs.claude.com/en/docs/claude-code` for current behavior.*
