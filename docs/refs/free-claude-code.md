# free-claude-code — third-party proxy (Alishahryar1)

[free-claude-code](https://github.com/Alishahryar1/free-claude-code) is a Python proxy that intercepts Claude Code's Anthropic API calls and reroutes them to a configurable backend (NVIDIA NIM, OpenRouter, DeepSeek, Wafer, Kimi, LM Studio, llama.cpp, Ollama, OpenCode Zen, Z.ai). 23.5K stars, 3.4K forks, MIT licensed, ~1 contributor.

**Status in this repo: not installed.** This is a reference note.

## What it actually does

- Python 3.14 service installed via `uv tool install --force git+https://github.com/Alishahryar1/free-claude-code.git`
- Exposes `fcc-server` (listens on `localhost:8082`, admin UI on loopback)
- Exposes `fcc-claude` (wrapper that points Claude Code at the local proxy via `ANTHROPIC_BASE_URL`)
- Configuration via repo `.env` → `~/.fcc/.env` → environment variables
- Requires Claude Code CLI installed separately (`npm install -g @anthropic-ai/claude-code`)

## Why the marketing is misleading

"Runs Claude Code completely free, no API key" is technically true and substantively false:

- The **CLI runs** without an Anthropic key because traffic goes to NVIDIA NIM / OpenRouter / your local Ollama instead.
- The **model** answering is no longer Claude — it's whatever Llama / Qwen / GLM / DeepSeek model the backend serves.
- The Claude Code harness (prompt structure, tool-use schema, agent loop) is **tuned for Claude**. Non-Claude models routed through this proxy follow tool-call conventions unreliably, drop instructions, and produce lower-quality output.
- This is the same caveat called out in [docs/security/shannon.md](../security/shannon.md) and in Anthropic's own SDK docs.

If "Claude Code, but cheaper" is the goal, you lose the "Claude" part. What you keep is the harness and ergonomics — which is real value, but a different value proposition.

## Trust footprint

The proxy sits between your editor and every backend call. It sees:

- Every prompt you send
- Every tool result, file read, and shell output
- Your repo paths
- Whatever auth token the backend requires (the proxy holds it)

Logging is off by default but `LOG_RAW_API_PAYLOADS=true` exists. Before adopting, audit the source for what the admin UI exposes, what it persists, and whether outbound network access is gated.

## When this might matter for RHYTHMIX

Rarely. The realistic scenarios:

- **Cost spike on Claude API:** if Sonnet/Opus per-token cost ever became a blocker for a high-frequency automated job (it isn't today; RHYTHMIX runs interactive sessions).
- **Offline development:** running Claude Code against a local Ollama on a flight with no Anthropic egress. The harness still works, the model is worse.
- **Model A/B-ing:** comparing Claude vs. a local Qwen3 for the same coding task — `fcc-server` makes the swap trivial.

None of these are blocking RHYTHMIX work right now.

## Why this isn't installed in this repo

Two reasons:

1. **The active workspace is iPhone-driven** (per `CLAUDE.md`: "iPhone-driven; user has no desktop"). Installing a local proxy on iOS isn't supported by the project. The Claude Code sessions are already remote-execution containers, so there's no host to install the proxy on.
2. **No backend credentials.** Even if installed, the proxy needs either an API key (NVIDIA NIM / OpenRouter / DeepSeek) or a reachable local backend (Ollama / LM Studio / llama.cpp). Neither exists in the current setup.

## If you do install it later (on a laptop)

```bash
# 1. Install Claude Code itself first
npm install -g @anthropic-ai/claude-code

# 2. Install the proxy
uv tool install --force git+https://github.com/Alishahryar1/free-claude-code.git

# 3. Configure a backend in ~/.fcc/.env (pick ONE)
# OpenRouter (cheapest broad model access)
echo 'OPENROUTER_API_KEY=sk-or-...' >> ~/.fcc/.env
echo 'FCC_MODEL=open_router/anthropic/claude-3.5-sonnet' >> ~/.fcc/.env  # ironic but supported
# OR Ollama (fully local)
echo 'OLLAMA_BASE_URL=http://localhost:11434' >> ~/.fcc/.env
echo 'FCC_MODEL=ollama/qwen2.5-coder:32b' >> ~/.fcc/.env

# 4. Start the proxy + launch Claude Code through it
fcc-server &
fcc-claude
```

Verify routing once: ask the session "what model are you running?" — if it can answer accurately, the harness is working; the answer itself confirms the backend.

## Links

- Repo: <https://github.com/Alishahryar1/free-claude-code>
- Author: Alishahryar1 (Ali Khokhar)
- Sister note on a similar trust-footprint decision: [docs/security/shannon.md](../security/shannon.md)
