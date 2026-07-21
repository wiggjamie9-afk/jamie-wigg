# OmniRoute — Overview (transcribed)

Transcribed from the OmniRoute project README (github.com/diegosouzapw/OmniRoute). Not affiliated with
RHYTHMIX or STARLIGHTMIX Studio — kept here as reference material only, in case a future project needs a
local multi-provider LLM router/gateway. Not integrated into this repo's build, MCP config, or workflows.

OmniRoute is a self-hosted, open-source AI model router/gateway: a local proxy that sits in front of 271+
LLM providers (OpenAI, Anthropic, Gemini, xAI, DeepSeek, Mistral, Qwen, Llama, Groq, and 260+ more, 90+ with
free tiers) and exposes a single OpenAI-compatible endpoint (`http://localhost:20128/v1`) to any client —
Claude Code, Codex CLI, Cline, Cursor, Aider, and 25+ other CLI/agent tools.

## Core concepts

- **Combo** — a chain of models OmniRoute routes across automatically; on quota exhaustion, provider
  failure, or cost spikes it silently slides to the next model in the chain.
- **`auto` models** — zero-config virtual combos built from connected providers, scored live:
  `auto` (balanced/LKGP), `auto/coding`, `auto/fast`, `auto/cheap`, `auto/offline`, `auto/smart`.
- **18 routing strategies** — priority, fill-first, weighted, round-robin, p2c, least-used, random,
  strict-random, cost-optimized, headroom, reset-window, reset-aware, context-relay, context-optimized,
  lkgp, auto (12-factor live scoring), fusion (panel of models + judge), pipeline (chained steps).
- **Quota-Share** — splits one subscription's time-based quota fairly across multiple keys/team members,
  with configurable allocation weight, dimensions (%, requests, tokens, $), policy (hard/soft/burst), and
  an absolute per-key cap; work-conserving (idle shares lend out to others).
- **3-layer resilience** — provider circuit breaker (whole provider, trips on 408/5xx), connection cooldown
  (one key/account, exponential backoff), model lockout (one model, e.g. local 404s). Terminal states
  (banned, expired, credits exhausted) surface to the operator rather than retrying forever.

## Compression pipeline

11 composable engines run in order (Session-Dedup, CCR, RTK, Headroom, Relevance, Caveman, LLMLingua-2,
Omniglyph, Lite, Aggressive, Ultra), claiming 15–95% token savings depending on preset (Lite ~15%,
Standard/Caveman ~30%, Aggressive ~50%, Ultra ~75%, RTK 60–90% on tool/shell output, stacked RTK→Caveman
78–95%). Code blocks, URLs, and JSON are preserved byte-perfect. Precedence for which mode applies:
per-request header > routing-combo override > named profile > adaptive dial > panel default > off.

## Running it

- `npm install -g omniroute && omniroute` — dashboard at `:20128`, API at `:20128/v1`.
- Also ships as Docker image, Electron desktop app, Termux (Android) build, and installable PWA.
- MCP (stdio + HTTP + SSE) and A2A (JSON-RPC 2.0) protocol servers expose the gateway's own tooling
  (providers, combos, cache, compression, memory) to another agent.
- Local-first: no telemetry by default, AES-256-GCM credential encryption, no account required,
  SQLite audit trail on-disk.

## Why this is here

RHYTHMIX doesn't currently route through OmniRoute — MCP/model access in this repo goes through the
servers listed in `.mcp.json` (see `docs/tools-index.md`). This note exists purely as a reference in case
multi-provider routing, quota pooling across team API keys, or the compression pipeline becomes relevant
to a future STARLIGHTMIX Studio or automation cost-optimization effort.
