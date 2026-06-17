# Headroom: Local Context Compression for LLM Agents

Compresses everything heading into an LLM — prompts, tool outputs, logs, RAG chunks, files, conversation history — *before* it reaches the model. Same answers, a fraction of the tokens. Runs locally (your data stays on your machine), is reversible, and works with every major agent/framework.

`pip install headroom-ai` / `npm install headroom-ai` · Apache 2.0 · github.com/chopratejas/headroom

## Why This Is a Strong Fit Here

Unlike most of what's been catalogued, Headroom is **immediately practical** for this ecosystem with no GPU and no risk:

- **Nucleus/Mary** runs long agentic loops (carousel/video orchestration, Cognee memory recall) — exactly the workload Headroom targets (92% savings on SRE-style multi-step debugging in their benchmarks).
- This repo wires up **many MCP servers** whose tool outputs (web search, browser snapshots, file reads, knowledge-graph dumps) are token-heavy — Headroom's ContentRouter compresses JSON/AST/prose tool results inline.
- It **wraps Claude Code directly** (`headroom wrap claude`) and runs as a **drop-in proxy** (zero code changes), so it can sit in front of the whole pipeline without touching app code.
- **Reversible (CCR)** — originals are cached locally and retrievable on demand, so compression never loses information the agent might need.

⚠️ One caveat for *this* container: Headroom notes "skip it if you work in a sandboxed environment where local processes can't run." The cloud sandbox here is GPU-less and egress-gated; Headroom is best run on the **user's local machine / dev box** where Claude Code actually executes, not inside this container.

## Five Ways to Use It

| Mode | Command | Use |
|---|---|---|
| **Library** | `from headroom import compress` | inline `compress(messages)` in Python/TS |
| **Proxy** | `headroom proxy --port 8787` | zero-code, any language, OpenAI-compatible |
| **Agent wrap** | `headroom wrap claude\|codex\|cursor\|aider\|copilot` | one command |
| **MCP server** | `headroom mcp install` | `headroom_compress`, `headroom_retrieve`, `headroom_stats` |
| **Cross-agent memory** | shared store | dedup'd memory across Claude/Codex/Gemini |

## How It Works

```
Your agent → Headroom (local) → LLM provider
             CacheAligner → ContentRouter → CCR
                            ├ SmartCrusher   (JSON)
                            ├ CodeCompressor (AST)
                            └ Kompress-base  (text, HF model)
```
- **ContentRouter** — detects content type, picks the right compressor
- **SmartCrusher / CodeCompressor / Kompress-base** — compress JSON / code-AST / prose
- **CacheAligner** — stabilizes prefixes so provider KV caches actually hit
- **CCR** — stores originals locally; the LLM calls `headroom_retrieve` if it needs them (reversible within a configured TTL)

## Proof (their benchmarks)

| Workload | Before | After | Savings |
|---|---|---|---|
| Code search (100 results) | 17,765 | 1,408 | 92% |
| SRE incident debugging | 65,694 | 5,118 | 92% |
| GitHub issue triage | 54,174 | 14,761 | 73% |
| Codebase exploration | 78,502 | 41,254 | 47% |

Accuracy preserved: GSM8K ±0.000, TruthfulQA +0.030, SQuAD v2 97% @ 19% compression, BFCL (tools) 97% @ 32% compression. Reproduce: `python -m headroom.evals suite --tier 1`.

## Output Token Reduction (cut what the model writes back)

Input compression shrinks the prompt; **output shaping** trims the reply (output costs ~5× input on Opus-class models). From the proxy, no code changes:

```bash
export HEADROOM_OUTPUT_SHAPER=1     # off by default
headroom proxy --port 8787
```
- **Verbosity steering** — appends a terse "don't restate context" note to the *end* of the system prompt (so prompt cache still hits)
- **Effort routing** — dials thinking effort down when a turn is just resuming after a tool result (file read, passing test); new questions/errors keep full effort

Learn your preferred terseness from past sessions:
```bash
headroom learn --verbosity          # dry-run preview
headroom learn --verbosity --apply  # proxy uses it going forward
```
Honest savings estimate with CI (never a made-up number); add `HEADROOM_OUTPUT_HOLDOUT=0.1` for a measured control-group number:
```bash
headroom output-savings   # Reduction: 31.7% (95% CI 27.7%…35.7%) [estimated]
```

## headroom learn (failure mining)

Mines failed sessions and writes corrections to `CLAUDE.md` / `AGENTS.md` / `GEMINI.md` — a feedback loop that hardens agent instructions over time. Relevant here: it could auto-improve this repo's `CLAUDE.md` from real Claude Code session failures.

## Get Started

```bash
pip install "headroom-ai[all]"     # Python (everything)
npm install headroom-ai            # Node/TS
docker pull ghcr.io/chopratejas/headroom:latest

headroom wrap claude               # wrap the coding agent
# or: headroom proxy --port 8787   # drop-in proxy
headroom perf                      # see savings
```
Granular extras: `[proxy] [mcp] [ml] [code] [memory] [relevance] [image] [agno] [langchain] [evals] [pytorch-mps]`. Python 3.10+. (SSL-inspection corp networks: install Rust first or use `--only-binary`; assets fetched from `cdn.pyke.io` (ONNX) + `huggingface.co` (kompress-base) — supports offline/mirror via `HF_HUB_OFFLINE`/`HF_ENDPOINT`.)

## Agent Compatibility

Claude Code ✅ (`--memory`, `--code-graph`) · Codex ✅ (shares memory w/ Claude) · Cursor ✅ · Aider ✅ · Copilot CLI ✅ · OpenClaw ✅ (installs as ContextEngine plugin). Any OpenAI-compatible client via the proxy; MCP-native via `headroom mcp install`.

## vs Alternatives

| | Scope | Local | Reversible |
|---|---|---|---|
| **Headroom** | All context (tools, RAG, logs, files, history) | ✅ | ✅ |
| RTK | CLI command outputs | ✅ | ❌ |
| lean-ctx | CLI/MCP/editor rules | ✅ | ❌ |
| Compresr / Token Co. | text → their API | ❌ | ❌ |
| OpenAI Compaction | conversation history | provider-native | ❌ |

(Headroom ships with RTK for shell-output rewriting and can use lean-ctx as its CLI context tool via `HEADROOM_CONTEXT_TOOL=lean-ctx`.)

## Recommended Use in This Ecosystem

1. **On the user's local dev box** (where Claude Code runs), `headroom wrap claude --memory` — immediate token savings on RHYTHMIX/Studio work, no code changes.
2. **In front of Nucleus** — run the proxy and point Nucleus's LLM client at `localhost:8787`; compresses Cognee recall + MCP tool outputs in the Mary agent loop.
3. **`headroom learn`** against real session logs to auto-tighten this repo's `CLAUDE.md`.
4. **Cross-agent memory** if you use Claude + Codex/Gemini together — shared, dedup'd context.
5. **Not inside this sandbox** — it needs persistent local processes + asset fetches; run it where the agent actually executes.

## References

- **GitHub**: github.com/chopratejas/headroom
- **Model**: Kompress-v2-base (HuggingFace)
- **Docker**: ghcr.io/chopratejas/headroom:latest
- **License**: Apache 2.0

---

**Use Case for Ecosystem:** Local, reversible context-compression layer — high-value, low-risk. Cuts input *and* output tokens for Claude Code + Nucleus with zero code changes (wrap or proxy), 47–92% savings on agent workloads with accuracy preserved. Compresses the token-heavy MCP tool outputs this repo generates. `headroom learn` can auto-improve CLAUDE.md from failed sessions. Run on the user's local dev box / in front of Nucleus, NOT inside this GPU-less, egress-gated sandbox.
