# Zenii — Setup & Reference

## Overview

**Zenii** is a **local AI backend for agents** — a ~20 MB Rust binary that runs a
daemon at **`localhost:18981`** exposing **133 API routes / 19 tools** with
**persistent memory**. Any tool on your machine (scripts, cron, bots, other AI
agents) can call it over HTTP for shared memory, AI chat, tool execution, and
scheduling — "one shared brain." By SprklAI (`github.com/sprklai/zenii`, docs at
`docs.zenii.sprklai.com`). Current version in the paste: `0.1.8`.

Core capabilities:
- **Memory** — `POST/GET /memory`: store & recall facts, persists across restarts;
  hybrid FTS5 full-text + vector-embedding semantic search. Categories: `core`,
  `daily`, `conversation`, or custom.
- **Chat** — `POST /chat` (+ `ws://…/ws/chat` streaming): prompt an agent with
  access to all tools + memory + 6 providers (OpenAI, Anthropic, Gemini,
  OpenRouter, Vercel AI Gateway, Ollama); `delegation: true` for multi-step tool use.
- **Tools** — 18 built-ins (web_search, file_*, shell, process, patch, memory,
  scheduler, channel_send, workflows, …) via `GET /tools` + `POST /tools/{name}/execute`.
- **Scheduler / Workflows** — cron / interval / one-time jobs running autonomous
  agent turns; DAG workflows chaining tool + LLM steps.
- **Channels** — send to Telegram / Slack / Discord.

> ### How this fits the RHYTHMIX repo
> **Genuinely relevant.** This repo is MCP/agent-heavy (a long `.mcp.json`,
> FleetView subagents, several automation workflows). Zenii adds two things those
> lack: **shared persistent memory across sessions** (store a fact in one Claude
> Code session, recall it in another) and an **autonomous scheduler** (e.g. a
> nightly "did the render finish / did CI pass" agent turn that pings Telegram —
> overlapping with the SimpleX/Hermes notifier idea). It's **local and private**.
> It can also act as an **MCP server** (`zenii-mcp-server`) that you register in
> this repo's `.mcp.json` (see below).

## Install

> The paste doesn't include a one-line daemon installer. The easiest path is the
> **desktop app / prebuilt ~20 MB binary** from the project site
> (`zenii.sprklai.com` / GitHub releases). The reproducible path below builds from
> source and is what the Mac installer uses.

**Build from source** (needs the Rust toolchain + `git`):

```bash
git clone https://github.com/sprklai/zenii.git ~/zenii
cd ~/zenii
cargo build --release                       # daemon + tools
cargo build -p zenii-mcp-server --release   # the MCP server binary (rmcp v1.3, stdio)
```

Start the daemon, then health-check it:

```bash
./target/release/zenii-daemon &             # or open the desktop app
curl -s http://localhost:18981/health | jq .
# → {"status":"ok","version":"0.1.8","uptime_secs":...}
```

**Auth** is optional and off by default for local use. Set `gateway_auth_token`
in `config.toml` to require `Authorization: Bearer <token>` (WebSocket uses
`?token=<token>`).

## Quick use (HTTP)

```bash
# store / recall memory
curl -X POST localhost:18981/memory -H 'Content-Type: application/json' \
  -d '{"key":"prod-db","content":"Prod DB on port 5434","category":"core"}'
curl "localhost:18981/memory?q=database+port&limit=3" | jq .

# chat (optionally multi-step)
curl -X POST localhost:18981/chat -H 'Content-Type: application/json' \
  -d '{"prompt":"What port is prod DB on?","session_id":"ops"}'

# list / run tools
curl localhost:18981/tools | jq '.[].name'
curl -X POST localhost:18981/tools/web_search/execute -H 'Content-Type: application/json' \
  -d '{"args":{"query":"Rust async patterns 2026"}}'

# schedule an autonomous daily job
curl -X POST localhost:18981/scheduler/jobs -H 'Content-Type: application/json' \
  -d '{"name":"morning-briefing","schedule":{"Cron":{"expr":"0 9 * * *"}},"payload":{"AgentTurn":{"prompt":"Summarize system status and send to Telegram"}}}'
```

Interactive API docs: `localhost:18981/api-docs` (Scalar UI); OpenAPI spec at
`/api-docs/openapi.json`.

## Use Zenii as an MCP server (optional, for this repo)

Zenii ships `zenii-mcp-server` (stdio, `rmcp` v1.3). To let Claude Code in this
repo use Zenii's tools/memory, add to `.mcp.json` (only once the binary is on your
PATH — e.g. symlink `~/zenii/target/release/zenii-mcp-server` into `~/bin`):

```json
{
  "mcpServers": {
    "zenii": { "command": "zenii-mcp-server", "args": ["--transport", "stdio"] }
  }
}
```

Tools are exposed with a `zenii_` prefix; `SecurityPolicy` denials apply over MCP
too, and `mcp_server_exposed_tools` / `mcp_server_hidden_tools` in `config.toml`
allow/deny-list them. (I've **not** auto-edited this repo's `.mcp.json` — add the
block yourself once the binary is built, so sessions don't fail on a missing
command.)

## A2A (agent-to-agent)

Zenii defines a Google **A2A** Agent Card (served at `/.well-known/agent.json`)
advertising skills like memory-store/recall, chat, tool-execute, schedule-task,
channel-message. Per the paste, the gateway endpoint for the card and the task
lifecycle routes (`/tasks/send`, `/tasks/sendSubscribe`) are **planned for a
future release** — the card schema exists today, the serving endpoints don't yet.

## Notes

- On this repo's Mac, `mac-downloads/Install-Downloads.command` installs the Rust
  toolchain (via Homebrew if needed), clones `github.com/sprklai/zenii` to
  `~/zenii`, and `cargo build --release`s the daemon + MCP server. It's a
  heavy/optional step (Rust compile) — skip with `SKIP_HEAVY=1`. The desktop app /
  prebuilt binary from `zenii.sprklai.com` is the lighter alternative.
- Source of truth: `github.com/sprklai/zenii` + `docs.zenii.sprklai.com`. This is
  a minimal install/reference snapshot; exact routes/versions may move.
