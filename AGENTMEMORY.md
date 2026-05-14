# agentmemory

Cross-session memory for AI coding agents. One server, one set of memories, shared across every agent you use.

agentmemory silently captures what an agent does in a session, compresses it into searchable memory, and injects the right context the next time you (or a different agent) start a session. It replaces the brittle pattern of hand-curating `CLAUDE.md` / `.cursorrules` / "starter prompts" and works around the 200-line practical cap that built-in memory hits before going stale.

Project site: [agent-memory.dev](https://agent-memory.dev). Package: `@agentmemory/agentmemory`.

---

## Why it matters here

This repo already accumulates context faster than any single instruction file can absorb:

- Brand / domain language in `CONTEXT.md` (Promo, Cut, Narration, Hook)
- Architecture decisions in `docs/adr/`
- Pipeline conventions in `CLAUDE.md` (HyperFrames over Remotion, where to find skills, how to publish to downloads)
- Per-skill knowledge that lives inside `.agents/skills/` and `.claude/skills/`

Every new session, the agent re-discovers the same things — which TTS voices we use, why `video/` is dormant, where `narration.wav` lives. agentmemory lets a previous session's discoveries survive into the next one without having to re-edit `CLAUDE.md` for every learning.

Concretely:

- **Session 1:** you set up the Higgsfield → HyperFrames flow for a Cut. The agent learns the prompt → poll → download wiring.
- **Session 2:** you ask for a new Cut at a different length. The agent already knows the wiring, the asset folder layout, and that we standardised on ElevenLabs for Narration — no re-explaining.

---

## Compatibility

agentmemory works with any agent that speaks MCP, REST, or supports session hooks. Reported integrations:

| Agent | Integration |
|---|---|
| Claude Code | 12 hooks + MCP + skills |
| OpenClaw | MCP + plugin |
| Hermes | MCP + plugin |
| Cursor | MCP server |
| Gemini CLI | MCP server |
| OpenCode | MCP server |
| Codex CLI | 6 hooks + MCP + skills |
| Cline | MCP server |
| Goose | MCP server |
| Kilo Code | MCP server |
| Aider | REST API |
| Claude Desktop | MCP server |
| Windsurf | MCP server |
| Roo Code | MCP server |
| Claude SDK | `AgentSDKProvider` |
| Any agent | REST API |

One memory store, one server, every agent reads/writes the same notes.

---

## Benchmarks

Numbers reproduced from the upstream `benchmark/LONGMEMEVAL.md` report (LongMemEval-S, ICLR 2025, 500-question retrieval set):

| System | R@5 | R@10 | MRR |
|---|---|---|---|
| **agentmemory** | **95.2%** | **98.6%** | **88.2%** |
| BM25-only fallback | 86.2% | 94.6% | 71.5% |

Token-cost framing (compared to alternative ways of carrying context across sessions):

| Approach | Tokens/yr | Cost/yr |
|---|---|---|
| Paste full context each session | 19.5M+ | exceeds context window |
| LLM-summarised handoffs | ~650K | ~$500 |
| **agentmemory** | **~170K** | **~$10** |
| agentmemory + local embeddings | ~170K | $0 |

Local embeddings use `all-MiniLM-L6-v2` (no API key, no cost).

---

## What's new (v0.9.0)

- Landing site at [agent-memory.dev](https://agent-memory.dev).
- Filesystem connector: `@agentmemory/fs-watcher`.
- Standalone MCP now proxies to the running server, so hooks and the viewer agree on state.
- Audit policy codified across every delete path.
- Health no longer flags `memory_critical` on small Node processes.

Full changelog upstream at `CHANGELOG.md` in the `@agentmemory/agentmemory` package.

---

## Install

One-shot, no global install:

```bash
npx @agentmemory/agentmemory
```

That command boots the memory server. From there, point your agent at it:

- **Claude Code:** add it to `.mcp.json` alongside the other servers already registered in this repo (`higgsfield`, `pollinations`, the in-repo `creative-stack`). The Claude Code integration ships 12 hooks + MCP tools + skills, so you get both passive capture and explicit `remember/recall` tools.
- **Cursor / Windsurf / Claude Desktop / Gemini CLI / OpenCode / Goose / Cline / Kilo Code / Roo Code:** register the MCP endpoint in that client's MCP config.
- **Aider / anything else:** hit the REST API.
- **Claude SDK apps:** use `AgentSDKProvider` from `@agentmemory/agentmemory` directly.

---

## Considerations for this repo

- **Don't duplicate `CONTEXT.md`.** Domain language is the source of truth here (per `docs/agents/domain.md`). agentmemory is for things that don't deserve a permanent place in `CONTEXT.md` or an ADR — session-discovered context, debugging trails, "we tried X and it broke because Y."
- **ADR conflicts still trump memory.** If a recalled note contradicts an ADR, the ADR wins. Surface the conflict (per `docs/agents/domain.md`) instead of silently going with the memory.
- **Sandbox egress.** This sandbox's allowlist blocks several model registries (see `CREATIVE-AI-STACK.md` — "Sandbox Status"). If agentmemory's default embedding model is fetched from a blocked host, switch to the local `all-MiniLM-L6-v2` path or pre-stage the model from a reachable mirror.
- **Skill changes go in `.agents/skills/`**, not the `.claude/skills/` symlinks. If you ask agentmemory to remember "where do skill edits go?", the answer is the source folder, not the symlink path.

---

## Links

- Site: [agent-memory.dev](https://agent-memory.dev)
- Package: `@agentmemory/agentmemory` on npm
- Filesystem connector: `@agentmemory/fs-watcher`
- Benchmark report: `benchmark/LONGMEMEVAL.md` in the upstream repo
