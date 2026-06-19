# Lore — Compounding Memory for AI Agents

**Lore** is a transparent LLM proxy that gives any AI agent shared, long-term
context across tools, projects, and providers. Instead of lossy
summarize-and-compact, it incrementally **distills** sessions (preserving file
paths, error messages, and exact decisions), curates long-term knowledge, and
exports it to a knowledge file (`AGENTS.md` / `.lore.md`).

> Status: **dormant / external runtime.** Lore runs as a gateway on your own
> machine — not in the cloud sandbox. This doc is the install reference; nothing
> here is wired into the repo's CI or MCP servers.

- Homepage: https://withlore.ai
- Packages: `@loreai/gateway` (standalone proxy), `@loreai/opencode`,
  `@loreai/pi`, `@loreai/core` (shared engine) — current: `v0.32.0`
- License: FSL-1.1-Apache-2.0

## Why it fits this stack

This repo already juggles many agents and providers (Claude Code, OpenRouter,
Groq via the `m3-think` skill, MiniMax M3 local, HyperFrames pipeline). Lore sits
*in front of* whichever LLM endpoint you point it at and keeps memory consistent
when you switch between them — so a decision made while driving a render today is
still present next session.

## Install

### Gateway (works with any Anthropic/OpenAI-compatible client)

```bash
# Installs the `lore` CLI, then auto-detects Claude Code / OpenCode / Pi / Codex
curl -fsSL https://withlore.ai/install | bash
lore run
```

Or run the gateway directly without installing the CLI:

```bash
npx @loreai/gateway
```

`lore run` starts the proxy and configures the detected agent to route its base
URL through the gateway. Point any other tool at the gateway's base URL to use it.

### OpenCode plugin

Add to your project's `opencode.json`:

```json
{ "plugin": ["@loreai/opencode"] }
```

### Pi extension

Add to `~/.pi/settings.json`, then run `pi install` once:

```json
{ "packages": ["npm:@loreai/pi@latest"] }
```

All three share one SQLite DB at `~/.local/share/lore/lore.db`, so switching
tools on the same project preserves everything.

## Configuration (`.lore.json` in project root)

All fields optional. Useful knobs:

```json
{
  "knowledge": { "enabled": true },
  "curator":   { "enabled": true, "afterTurns": 3, "maxEntries": 25 },
  "agentsFile": { "enabled": true, "path": "AGENTS.md" },
  "budget": { "distilled": 0.25, "raw": 0.4, "output": 0.25, "ltm": 0.05 }
}
```

To get conversation search only (no auto-curated long-term knowledge):

```json
{ "knowledge": { "enabled": false } }
```

## CLI quick reference

```bash
lore import                       # one-time: pull history from Claude Code/Codex/etc.
lore recall "auth decision"       # search project memory from the terminal
lore data list knowledge          # inspect curated knowledge
lore data clear --project .       # wipe memory for this project (regenerates .lore.md)
```

Web dashboard (gateway running): http://localhost:3207/ui

## Notes & cautions

- The `curl | bash` installer runs a remote script with your user permissions.
  Review it first if that matters to you; `npx @loreai/gateway` avoids the
  installer entirely.
- Memory is stored **locally** in `~/.local/share/lore/lore.db`. Nothing in this
  repo writes to or depends on it.
- If you adopt the `AGENTS.md` export, decide whether to commit it — it can be
  re-imported from git history, which may resurrect old/cleared knowledge.
