# SETUP-TOOLPORT.md — Toolport (local MCP gateway, token-saving)

**Toolport** is a local MCP gateway: set up + authenticate each MCP server once, point
every AI client (Claude, Cursor, Codex, …) at Toolport, and they all share the servers.
Its headline win is **token cost** — instead of every client dumping all downstream tool
definitions into context on every request, Toolport advertises **3 meta-tools** the agent
searches on demand. MIT (open-core; the app + gateway are free forever). Product site:
`toolport.app`.

> **Status here:** documented + registered. Toolport is a **desktop app you install on
> your own machine** (it edits client config files like `~/.claude.json` and stores
> secrets in the OS keychain) — it can't run durably in this ephemeral cloud sandbox, and
> I can't verify the binaries from here. Install it locally; this doc is the pointer.

## Why it's relevant to *this* repo

This workspace registers many MCP servers (`.mcp.json`: creative-stack, zyloo, higgsfield,
pollinations, playwright, claude-playwright, context7, openmanus, stepfun) plus a large
set of session connectors. Every one dumps its full tool list into context per request.
Toolport's lazy discovery (below) is aimed squarely at that: it keeps context flat no
matter how many servers you connect.

- Claimed: up to **91% fewer total tokens** at equal task success, **97% less
  tool-definition overhead** per request, **99.6%** on a 415-tool catalog (their
  `BENCHMARK.md`). Treat as vendor numbers until you measure your own.

## How it works

Two pieces: a **desktop app** (Tauri + React) to manage servers/profiles/credentials, and
the **`toolport-gateway`** binary each client launches over stdio. The gateway reads
Toolport's `registry.json` + OS keychain, connects to the enabled downstream servers
(stdio or remote HTTP/SSE), and routes calls. Tool names are namespaced per server
(`stripe__list_charges`) so they never collide.

**Lazy discovery** (default on) advertises three meta-tools —
`toolport_status`, `toolport_search_tools`, `toolport_call_tool` — and the agent searches
+ calls on demand. Optional semantic re-ranking via any `/v1/embeddings` endpoint.

## Install (on your machine)

- **Prebuilt installers:** the Releases page. Windows + macOS are code-signed (macOS
  notarized); Linux is beta — prefer the `.deb` over the AppImage.
- **From source** (needs Node + Rust):
  ```bash
  npm install
  npm run tauri dev        # desktop app
  npm run build:gateway    # REQUIRED from source — clients spawn this binary directly
  ```
- **Wire a client:** in the app, open Clients → pick Claude Code / Codex / Cursor / … →
  Connect. It writes that client's config for you (e.g. a single `conduit` MCP entry in
  `~/.claude.json` or `~/.codex/config.toml`) and backs up the old one. 20 clients
  auto-detected.

## Useful config (per-client env on the gateway entry)

| Var | Purpose |
|---|---|
| `CONDUIT_PROFILE=<name>` | Scope a client to one profile's servers (per-agent scoping) |
| `CONDUIT_DISCOVERY=lazy\|full` | Override the global lazy/full default |
| `CONDUIT_HTTP=<port>` (+ `CONDUIT_HTTP_TOKEN`) | Run in HTTP/OpenAPI mode (Open WebUI, n8n, LibreChat). Refuses non-loopback bind without a token |
| `CONDUIT_RESULT_BUDGET=<bytes>` | Cap oversized tool results |
| `CONDUIT_SEMANTIC=on` + `CONDUIT_EMBED_*` | Blend embedding similarity into search |

## Security posture (on by default, local, detection-only)

- **Tool integrity** — fingerprints each tool on connect; flags later definition changes
  ("rug pull") or injection-like descriptions/schemas ("tool poisoning").
- **Content defense** — marks untrusted tool output (Sentry errors, web pages, issue
  bodies) as *external data, not instructions* to blunt indirect prompt injection. Never
  blocks.
- **Governance** — toggle any tool; one switch hides all destructive tools; every call
  audited with latency/error stats. Optional agent-driven enable/disable of servers is
  **off** by default; the destructive-tool switch always stays manual.

## Teams (paid, optional)

Toolport Teams syncs a shared, governed server set across a team (members' keys stay on
their own machines). Free ≤5 people; $12/seat/month beyond. Hosted (`toolport.app/teams`)
or self-hosted (`docker pull ghcr.io/tsouth89/conduit-teams`). The local app + gateway
stay MIT and free — Teams funds them.

## Caveats

- Desktop/per-machine tool; nothing durable to wire into this repo. Install locally.
- It **rewrites client config files** and stores credentials in the OS keychain — review
  before pointing production clients at it.
- Third-party binary running on your tool path; its numbers are self-reported.
- Known issue (Linux only): a glib soundness advisory (RUSTSEC-2024-0429) in the Tauri
  webview stack — a crash bug, not RCE, not affecting macOS/Windows.
