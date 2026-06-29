# The Agency (Agency Agents) — Setup & Reference

## Overview

[The Agency](https://github.com/msitarzewski/agency-agents) is a community-built,
growing collection of **meticulously crafted AI agent personalities** — **232
specialized agents across 16 divisions** (Engineering, Design, Marketing, Paid
Media, Sales, Product, Project Management, Testing, Security, Support, Finance,
Game Development, Spatial Computing, Academic, GIS, and Specialized). Each agent
is a single Markdown file with a defined identity, mission, workflow, concrete
deliverables, and success metrics — not a generic "act as a developer" prompt.

It ships **conversion + install scripts** so the same agents work across most
agentic coding tools, plus a native desktop app (macOS/Linux/Windows) that
browses the roster and installs/updates agents for you.

- **Native to Claude Code** — agents are `.md` files dropped into
  `~/.claude/agents/`, no conversion step.
- **Multi-tool** — `convert.sh` + `install.sh` target Cursor, Codex, Gemini CLI,
  OpenCode, Copilot, Aider, Windsurf, Qwen, Kimi, **OpenClaw**, **Hermes**,
  Osaurus, and more.
- **Selective install** — pick divisions/agents (`--division`, `--agent`) so you
  don't dump all 232 at once.

**Repo**: https://github.com/msitarzewski/agency-agents ·
**App (macOS)**: `brew install --cask msitarzewski/agency-agents/agency-agents` ·
License: **MIT** (attribution appreciated, not required).

> ### How this fits the RHYTHMIX repo
> **Good fit** as a supplemental subagent library for the dev/creative/marketing
> work here — but mind the directory boundary:
> - **⚠️ Do NOT install into this repo's `.claude/agents/`.** Per `CLAUDE.md`,
>   that directory holds the **FleetView-managed** roster (one `.md` per agent
>   type, loaded by the harness) and must not be hand-edited. Install The Agency
>   into the **user-global** `~/.claude/agents/` instead, so its agents are
>   available across sessions without colliding with the FleetView definitions.
> - **Complements the existing roster** — the project already exposes a large
>   FleetView agent roster via the `Agent` tool (code-reviewer, seo-writer,
>   social-media, etc.). The Agency's Engineering/Design/Marketing divisions
>   overlap conceptually; treat it as an *alternative/extra* source, not a
>   replacement, and avoid duplicating roles you already invoke.
> - **Ties into tools already documented here** — The Agency installs to both
>   **OpenClaw** (`SOUL.md`/`AGENTS.md`/`IDENTITY.md`) and **Hermes** (lazy-router
>   plugin), both of which this repo already references (`scripts/openclaw-install.sh`,
>   `SETUP-HERMES.md`). If you wire those up, The Agency is a ready-made agent
>   pack for them.
> - **Relevant divisions for this repo** — Marketing (content/social for the
>   RHYTHMIX site), Design, Engineering (the `studio/` Next app + Workers), and
>   Specialized (MCP Builder, Prompt Engineer, Document Generator).
>
> **Not** a fit for editing the FleetView `.claude/agents/` files, and not a
> video-pipeline tool — it's an agent-personality library layered on top of
> whatever coding agent you run.

## Getting started

### Option 1 — Desktop app (no clone)

Download the latest release from the repo, or on macOS:

```bash
brew install --cask msitarzewski/agency-agents/agency-agents
```

The app browses the roster and installs/updates agents into your chosen tools.

### Option 2 — Claude Code (user-global)

```bash
git clone https://github.com/msitarzewski/agency-agents
cd agency-agents

# Install all agents to your user-global Claude Code dir (NOT this repo's .claude/agents/)
./scripts/install.sh --tool claude-code

# Or copy just one division
cp engineering/*.md ~/.claude/agents/
```

Then reference an agent in a session, e.g. *"activate Frontend Developer mode and
help me build a React component."*

### Option 3 — Other tools (convert then install)

```bash
./scripts/convert.sh                 # generate integration files for all tools
./scripts/install.sh                 # interactive wizard: pick tools + divisions

# Or target one tool / a subset
./scripts/install.sh --tool cursor --agent frontend-developer,ui-designer
./scripts/install.sh --tool claude-code --division engineering,security
./scripts/install.sh --list teams    # list every team + agent count
```

## Key capabilities

| Capability | What it gives you |
|---|---|
| **232 agents / 16 divisions** | Deep, role-specific personalities with workflows + deliverables. |
| **Claude Code native** | `.md` agents drop straight into `~/.claude/agents/`. |
| **Multi-tool convert/install** | Cursor, Codex, Gemini CLI, OpenCode, Copilot, OpenClaw, Hermes, Qwen, Kimi, Osaurus, Aider, Windsurf. |
| **Selective install** | `--division` / `--agent` to install only what you need. |
| **Interactive installer** | Auto-detects installed tools; checkbox UI to pick targets. |
| **Parallel runs** | `--parallel`/`--jobs N` for faster convert/install on multi-core. |
| **Forkable + MIT** | Transparent agent files you can adapt to brand/voice. |

## Notes

- **Directory discipline (most important):** keep The Agency in **user-global**
  `~/.claude/agents/`. The repo's project-level `.claude/agents/` is
  FleetView-managed — hand-editing or dumping files there is explicitly
  disallowed in `CLAUDE.md`.
- The **upstream repo is the source of truth** for the roster, install flags, and
  per-tool paths — pin a commit and re-check before relying on specifics (agent
  counts and tool support change often).
- **OpenCode caveat (from upstream):** OpenCode's runtime registers only ~119
  agents and silently drops the rest; install a subset with `--division` to stay
  under the limit (the installer warns you).
- Avoid duplicating roles you already invoke through the FleetView roster — pick
  the divisions that add genuinely new capability (e.g. niche Marketing/Design or
  Specialized agents) rather than re-importing a code-reviewer you already have.

## License

MIT License — use freely, commercially or personally. Attribution appreciated but
not required. (Agent names/branding follow the upstream repo.)
