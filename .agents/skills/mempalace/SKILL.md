---
name: mempalace
description: MemPalace — local-first AI memory. Verbatim storage + semantic search, fully on your machine, zero API calls (96.6% R@5 raw on LongMemEval). MCP server (35 tools) for Claude Code, plus auto-save hooks that stop Claude Code sessions from being lost before context compaction. Use when you want private, offline, no-cloud memory (the local counterpart to the hosted supermemory). NOTE: runs locally via the `mempalace` CLI/Docker — install it on the machine where Claude Code runs; the MCP isn't pre-wired (it needs that local install).
---

# MemPalace (local-first memory)

Stores conversation history as **verbatim text** (no summarizing/paraphrasing) and retrieves with
semantic search. Index is structured — people/projects = *wings*, topics = *rooms*, content =
*drawers* — so searches scope rather than hit a flat corpus. Pluggable backend (ChromaDB default).
**Nothing leaves your machine unless you opt in.** MIT.

- Official sources ONLY: GitHub `MemPalace/mempalace`, PyPI `mempalace`, docs `mempalaceofficial.com`.
  ⚠️ The README warns of impostor domains distributing malware — use only those three.

## Why it matters here

Two things:
1. **Private, offline memory** — the local counterpart to the hosted Supermemory MCP already in
   `.mcp.json`. Raw 96.6% R@5 with **no API key, no cloud, no LLM**.
2. **Claude Code retention** — MemPalace ships **auto-save hooks** that save periodically and
   *before context compaction*, addressing the "Claude Code sessions expire in 30 days" problem.
   This is useful even if you don't adopt it as your primary memory store.

## Install (on the machine running Claude Code)

```bash
uv tool install mempalace        # recommended (isolated CLI on PATH); or: pipx install mempalace
mempalace init ~/projects/myapp
python -m mempalace.onboarding   # pick embedding model (~300MB; embeddinggemma-300m recommended)
```
Requires Python 3.9+. Docker image also available (persists under `/data`).

## Quickstart

```bash
mempalace mine ~/projects/myapp                    # index project files
mempalace mine ~/.claude/projects/ --mode convos   # index Claude Code sessions
mempalace search "why did we switch to GraphQL"
mempalace wake-up                                  # load context for a new session
mempalace sweep <transcript-dir>                   # per-message verbatim recall (idempotent)
```

## Wire the MCP into Claude Code (after installing locally)

Not pre-added to this repo's `.mcp.json` (it needs the local CLI/Docker present first). When
ready, add a stdio server — via the installed CLI:
```json
"mempalace": { "command": "mempalace", "args": ["mcp"] }
```
or via Docker:
```json
"mempalace": { "command": "docker", "args": ["run","-i","--rm","-v","mempalace-data:/data","mempalace"] }
```
35 MCP tools: palace reads/writes, a temporal knowledge graph (add/query/invalidate/timeline,
local SQLite), cross-wing navigation, drawer management, agent diaries.

## Auto-save hooks (do this for retention)

Wire the Claude Code + Codex hooks (mempalaceofficial.com/guide/hooks) so sessions are saved
before compaction; backfill existing transcripts with
`mempalace mine ~/.claude/projects/ --mode convos`. Start from the "Claude Code retention setup
checklist" in their docs if installing under time pressure.

## Benchmarks (reproducible, local)

LongMemEval R@5: **96.6% raw** (no LLM), 98.4% hybrid (held-out), ≥99% + LLM rerank (any model).
LoCoMo R@10 88.9% (hybrid), ConvoMem 92.9%, MemBench 80.3%. The headline raw number needs **zero
API calls**.

## Supermemory (hosted) vs MemPalace (local) — your call

| | Supermemory (wired) | MemPalace |
|---|---|---|
| Install | hosted MCP url, OAuth, instant | local CLI/Docker + embedding model |
| Data | Supermemory cloud | 100% your machine |
| API key | optional | none for core path |
| Style | auto-extract facts + RAG + connectors | verbatim store + semantic search + KG |
| Best when | easiest setup, want connectors | privacy/offline, own everything |

Pick **Supermemory** for least-effort hosted memory; **MemPalace** when data must stay local.
Don't run both as your primary store — choose one.
