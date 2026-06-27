---
name: memos
description: Memos (usememos/memos) — a self-hosted, Markdown-native quick-capture notes app (single Go binary, ~20MB Docker image, REST + gRPC API, SQLite/MySQL/Postgres). Use as a self-owned memory/capture backend that an agent can read/write via the Memos API or a Memos MCP server. NOTE: it's a server you self-host on your own machine/VPS — it can't run persistently in this ephemeral sandbox (no Docker), and on its own it does NOT give Claude recall; you pair it with an MCP.
---

# Memos (self-hosted capture → Claude memory backend)

Memos is an open-source (MIT), timeline-first note app: open, write, done. Notes are stored as
**Markdown**, fully portable, zero telemetry, self-hosted. One small Go binary / ~20MB Docker
image. Full **REST + gRPC API** makes it scriptable — which is what turns it into an agent
memory store.

- Repo: https://github.com/usememos/memos · Docs: https://usememos.com/docs · Demo: https://demo.usememos.com

## Where it fits the "stop re-asking" goal

Memos is the **store** half of a memory system: a durable, self-owned place to keep facts,
decisions, snippets, and context. To make Claude actually *recall* from it, you pair Memos with
an MCP server (community **Memos MCP** servers exist) or call its REST API directly. Flow:

```
You/agent capture a note  →  Memos (Markdown + DB)  →  Memos MCP  →  Claude reads/writes each session
```

Compared to the dedicated memory layers (Mem0, Zep, MemPalace): Memos is **simpler and more
"yours"** (plain Markdown you can read/edit/back up), but it does **manual capture + retrieval**,
not automatic memory *extraction*. Great if you want a self-hosted notebook Claude can see; pick
Mem0/Zep if you want auto-extracted, ranked memories.

## ⚠️ Not in this sandbox

Memos is a long-running server (port 5230) with a database. This cloud sandbox has **no Docker
and is ephemeral**, so don't run it here. Host it on **your own machine, a VPS, or a Pi** so it
persists — which is the whole point (total data ownership).

## Self-host

```bash
# Docker (recommended)
docker run -d --name memos -p 5230:5230 \
  -v ~/.memos:/var/opt/memos neosmemo/memos:stable
# → open http://localhost:5230

# Native binary
curl -fsSL https://raw.githubusercontent.com/usememos/memos/main/scripts/install.sh | sh
```

Also supports Docker Compose (production), Kubernetes/Helm, and prebuilt Linux/macOS/Windows
binaries. DB options: SQLite (default), MySQL, Postgres. Back up the data dir (`~/.memos`) — or
point it at a folder in a git repo — for durable, versioned memory.

## Wire it to Claude (the recall part)

1. Self-host Memos (above) and create an **access token** in Settings.
2. Add a **Memos MCP server** to `.mcp.json` (community servers wrap the REST API) with your
   Memos URL + token, so Claude can `create`/`search`/`list` memos.
3. Seed it with your standing context (stack, decisions, preferences) so Claude stops asking.

(For this repo's own RHYTHMIX setup, this complements — doesn't replace — `CLAUDE.md` and
`docs/MY-STACK-INVENTORY.md`, which are the always-loaded static map; Memos is the growing log.)

## License

MIT. Self-hosted, zero telemetry — your notes never leave your infrastructure.
