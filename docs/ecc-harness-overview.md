# ECC Harness Overview

A reference summary of **ECC** — the harness-native operator system for agentic
work — distilled into one page. ECC is an external, MIT-licensed project
(`affaan-m/ECC`); this document is a navigational overview for anyone in this
repo who needs to understand what ECC is, how it installs, and how it maps
across AI agent harnesses. It is **not** a vendored copy of ECC and pulls in no
ECC code.

> **Verified channels only.** Install ECC only from the official sources: the
> GitHub repo `affaan-m/ECC`, the npm packages `ecc-universal` and
> `ecc-agentshield`, the GitHub App, the plugin slug `ecc@ecc`, and `ecc.tools`.
> Third-party mirrors are unreviewed and may ship malware.

---

## What ECC Is

ECC is a **complete operator system** for agentic coding, not just a config
pack. It bundles:

- **Agents** — specialized subagents for delegation (planning, review, build-fix, language-specific reviewers).
- **Skills** — the primary workflow surface (domain knowledge + repeatable procedures).
- **Commands** — maintained slash entries kept for command-first workflows during the migration to skills.
- **Hooks** — trigger-based automations (session persistence, auto-format, secret detection, dev-server guards).
- **Rules** — always-follow guidelines, split into `common/` plus per-language packs.
- **MCP configs** — server definitions (opt-in, not auto-enabled on plugin installs).

It is explicitly framed (since v1.8.0) as an **agent harness performance
system** that works across Claude Code, Cursor, Codex (app + CLI), OpenCode,
Gemini, Zed, and GitHub Copilot.

---

## Three Public Identifiers (not interchangeable)

| Context | Identifier |
|---|---|
| GitHub source repo | `affaan-m/ECC` |
| Claude marketplace/plugin slug | `ecc@ecc` |
| npm package | `ecc-universal` (security auditor: `ecc-agentshield`) |

The plugin slug is kept short to satisfy strict Desktop/API validators; the npm
package name diverged intentionally. Older long marketplace identifiers are
legacy aliases.

---

## Install Paths — Pick One Only

The most common broken setup is **stacking install methods** (plugin install
*then* the full installer). Choose a single path:

1. **Recommended default** — install the Claude Code plugin, then manually copy
   only the `rules/` folders you want:
   ```
   /plugin marketplace add https://github.com/affaan-m/ECC
   /plugin install ecc@ecc
   ```
   Plugins **cannot** distribute rules, so copy `rules/common` + one language
   pack into `~/.claude/rules/ecc/` by hand.

2. **Fully manual** — `./install.sh --profile full` (or `.ps1` / `npx ecc-install`).
   If you take this path, do **not** also run `/plugin install`.

3. **Low-context / no-hooks** — `./install.sh --profile minimal --target claude`
   (excludes the hooks runtime). Add hooks later with
   `--modules hooks-runtime` if you want runtime enforcement.

**Find components first:** `npx ecc consult "security reviews" --target claude`
returns matching components, profiles, and preview/install commands.

**Reset / uninstall:** `node scripts/uninstall.js --dry-run` then
`node scripts/uninstall.js`. ECC only removes files it recorded in its
install-state. Lifecycle wrapper: `node scripts/ecc.js {list-installed,doctor,repair,uninstall}`.

---

## Repository Layout (key directories)

```
ECC/
├── .claude-plugin/      # plugin.json + marketplace.json
├── agents/              # 67 specialized subagents
├── skills/              # workflow definitions (primary surface)
├── commands/            # maintained slash-entry compatibility
├── legacy-command-shims/# opt-in archive of retired shims (/tdd, /eval, ...)
├── rules/               # common/ + typescript/python/golang/swift/php/arkts/
├── hooks/               # hooks.json + memory-persistence + strategic-compact
├── scripts/             # cross-platform Node.js hook/lib implementations
├── contexts/            # dynamic system-prompt injection (dev/review/research)
├── examples/            # real-world CLAUDE.md configs
├── mcp-configs/         # MCP server definitions
└── ecc_dashboard.py     # Tkinter desktop dashboard
```

Approximate catalog (per v2.0.0 / rc surface): ~67 agents, ~271 skills,
~92 legacy command shims.

---

## Cross-Harness Parity (at a glance)

| Feature | Claude Code | Cursor | Codex CLI | OpenCode | Copilot |
|---|---|---|---|---|---|
| Agents | 67 | shared (AGENTS.md) | shared | 12 | n/a |
| Hook events | 8 | 15 | none yet | 11 | none |
| Rules | 34 | 34 (YAML frontmatter) | instruction-based | 13 | 1 always-on file |
| MCP servers | 14 | shared | 7 (auto-merged) | full | n/a |
| Context file | CLAUDE.md + AGENTS.md | AGENTS.md | AGENTS.md | AGENTS.md | copilot-instructions.md |

Key architectural decisions:

- **`AGENTS.md` at root** is the universal cross-tool context file (read by
  Claude Code, Cursor, Codex, OpenCode). Copilot uses
  `.github/copilot-instructions.md` instead.
- **DRY adapter pattern** lets Cursor reuse Claude Code's hook scripts (a
  `.cursor/hooks/adapter.js` transforms Cursor's stdin JSON to Claude's format).
- **`SKILL.md`** (YAML frontmatter) works across Claude Code, Codex, OpenCode.
- Codex has no hook parity yet → enforcement is instruction-based via
  `AGENTS.md` + sandbox/approval settings.

---

## Key Runtime Controls

Environment flags tune hooks and data isolation without editing files:

| Variable | Purpose |
|---|---|
| `ECC_HOOK_PROFILE` | `minimal` / `standard` / `strict` strictness |
| `ECC_DISABLED_HOOKS` | comma-separated hook IDs to disable |
| `ECC_SESSION_START_CONTEXT=off` | disable SessionStart context injection |
| `ECC_SESSION_RETENTION_DAYS` | session-tmp retention window (0 = keep all) |
| `ECC_AGENT_DATA_HOME` | memory root; set per-harness to isolate Cursor vs Claude Code |
| `ECC_DISABLED_MCPS` | install/sync filter to skip bundled MCP servers |

**Important:** `ECC_DISABLED_MCPS` is an install/sync filter, not a live Claude
Code toggle. Use `/mcp` for runtime MCP disables (persisted in `~/.claude.json`).

---

## Token Optimization (recommended `~/.claude/settings.json`)

| Setting | Default | Recommended | Impact |
|---|---|---|---|
| `model` | opus | sonnet | ~60% cost cut; handles 80%+ of tasks |
| `MAX_THINKING_TOKENS` | 31,999 | 10,000 | ~70% less hidden thinking cost |
| `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE` | 95 | 50 | compacts earlier, better long-session quality |
| `CLAUDE_CODE_SUBAGENT_MODEL` | — | haiku | cheaper parallel subagents |

Context-window hygiene: keep **<10 MCPs** and **<80 tools** active per project —
each MCP tool description eats into the 200k window.

---

## Ecosystem Tools

- **AgentShield** (`npx ecc-agentshield scan`) — audits your *own* agent/hook/MCP/
  permission/secret surfaces. `--opus` runs a red-team / blue-team / auditor
  pipeline. Exit code 2 on critical findings for CI gates.
- **Skill Creator** — `/skill-create` (local git-history analysis) or the ECC
  Tools GitHub App for advanced features.
- **Continuous Learning v2** — instinct-based learning with confidence scoring
  (`/instinct-status`, `/instinct-import`, `/instinct-export`, `/evolve`).

---

## Gotchas

- **Never add a `"hooks"` field to `.claude-plugin/plugin.json`.** Claude Code
  v2.1+ auto-loads `hooks/hooks.json` by convention; declaring it explicitly
  causes a "Duplicate hooks file detected" error (enforced by a regression test).
- **Requires Claude Code CLI v2.1.0+.**
- **Rules are never distributed by the plugin** — always copy them manually.
- **`multi-*` commands** need the separate `ccg-workflow` runtime
  (`npx ccg-workflow`); they are not covered by the base install.
- Copy a whole language rules directory (e.g. `rules/common`), not the files
  inside it, so relative references and filenames stay intact.

---

## Reference Links

- Source: `github.com/affaan-m/ECC` · Site: `ecc.tools`
- Guides: Shorthand (start here), Longform (token/memory/evals/parallelization),
  Security (attack vectors, sandboxing, AgentShield).
- License: MIT.

*Summary compiled from the ECC project README (v2.0.0 line). Verify specifics
against the upstream repo before relying on exact counts — catalog numbers
drift between releases.*
