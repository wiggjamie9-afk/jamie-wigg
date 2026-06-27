---
name: headroom
description: Headroom (chopratejas/headroom) — a local context-compression layer for AI agents that cuts token cost (input AND output) with no code changes. Run as a proxy (`headroom proxy`), wrap an agent (`headroom wrap claude`), use the library, or its MCP server. Adds cross-agent memory (Claude/Codex/Gemini) and `headroom learn` which mines failed sessions and writes corrections to CLAUDE.md/AGENTS.md. Reversible (originals cached). NOTE: runs as a LOCAL process — its own docs say skip it in a sandbox where local processes can't run; use it in a Codespace/VPS/local, not the web sandbox.
---

# Headroom (token/cost compression for agents)

Headroom shrinks everything in an agent's context — prompts, tool outputs, logs, RAG results,
files — by routing content to the right compressor (JSON / code-AST / prose), while keeping
provider KV-cache prefixes stable. Reversible: originals are cached locally (CCR) and the model
calls `headroom_retrieve` if it needs them. Apache-2.0, runs locally (your data stays on the box).

- Repo: https://github.com/chopratejas/headroom · Model: Kompress-v2-base (HuggingFace)

## Why it's worth it (for your heavy setup)

You run a big toolkit (~2,560 skills, multiple MCPs) → large contexts → real token cost. Headroom's
reported savings on agent workloads: code search 92%, SRE debugging 92%, issue triage 73%,
codebase exploration 47% — with accuracy held on GSM8K/TruthfulQA/SQuAD/BFCL. It also trims
**output** tokens (5× costlier on Opus): terse-steering + dialing down "thinking" on routine
tool-result turns (`HEADROOM_OUTPUT_SHAPER=1`).

## ⚠️ Not in the web sandbox — by its own admission

Headroom's README literally lists "skip it if you work in a sandboxed environment where local
processes can't run." It's a **local proxy/process**. So this is a **Codespace / VPS / local-machine**
tool — the same environment move discussed in the `goose` skill and the "better than sandbox"
thread. (It even ships its own `.devcontainer/`.)

## Install & modes (on a real machine)

```bash
pip install "headroom-ai[all]"     # Python 3.10+   (or: npm install headroom-ai)
# pick one:
headroom wrap claude               # wrap Claude Code (also: codex, aider, copilot, opencode)
headroom proxy --port 8787         # drop-in proxy, zero code changes, any language
headroom mcp install               # expose headroom_compress / _retrieve / _stats as MCP tools
headroom perf                      # see the savings · headroom dashboard for live view
```
Claude Code flags: `--memory · --code-graph · --1m`. Cursor → prints proxy settings to paste.

## Two features that compound with the rest of your stack

- **Cross-agent memory** — shared, auto-deduped store across Claude, Codex, Gemini. Complements
  (or overlaps) the `supermemory` / `mempalace` memory MCPs — pick a primary; don't triple-store.
- **`headroom learn`** — mines your failed sessions and **writes corrections into `CLAUDE.md` /
  `AGENTS.md`**, so the agent stops repeating mistakes. Run `headroom learn --verbosity --apply`
  to auto-tune how terse replies should be.

## Honest fit

High value once you're off the sandbox and running Claude Code in a Codespace/VPS — it directly
cuts your token bill and writes lessons back into `CLAUDE.md`. Until then it can't run. If you adopt
it, let its cross-agent memory and the dedicated memory MCP not fight: use Headroom for
compression + corrections, and one memory engine (Supermemory or MemPalace) for recall.

## License

Apache-2.0.
