# Setting up Free Claude Code for this workspace

[Free Claude Code](https://github.com/Alishahryar1/free-claude-code) is a local proxy that sits between the Claude Code CLI and the Anthropic Messages API, re-routing traffic to 17 alternative providers — NVIDIA NIM, OpenRouter, Google AI Studio, DeepSeek, Mistral, Kimi, Cerebras, Groq, Ollama, and more — without touching Claude Code itself.

> Honest framing: this repo already runs on Claude Code with a full provider stack (`creative-stack` MCP → Replicate/ElevenLabs, `context7` for docs, Pollinations free tier). Free Claude Code is **not** a replacement for any of those — it only re-routes the *LLM inference* calls that Claude Code makes. It earns its keep here when you want free or near-zero-cost completions for the `/spec-run` parallel-agent waves, `/album-launch` fan-outs, or any session where the Anthropic API would otherwise cost real money. See [§3](#3-where-it-could-actually-help-this-repo) for fit assessment.

For the full feature list and architecture, see the upstream README: <https://github.com/Alishahryar1/free-claude-code>.

(Install commands and provider details verified against the upstream README as of **2026-06-05** — re-check before relying on them.)

---

## 1. Install

macOS / Linux / WSL2:

```bash
curl -fsSL "https://github.com/Alishahryar1/free-claude-code/blob/main/scripts/install.sh?raw=1" | sh
```

Windows PowerShell:

```powershell
irm "https://github.com/Alishahryar1/free-claude-code/blob/main/scripts/install.ps1?raw=1" | iex
```

Re-run the same command to update. To add voice-note transcription (Whisper or NVIDIA NIM Riva), append `--voice-local` or `--voice-nim` to the curl command.

## 2. Start the proxy

```bash
fcc-server
```

Uvicorn prints the bind address; the log line looks like:

```
INFO:     Admin UI: http://127.0.0.1:8082/admin (local-only)
```

Open that URL in a browser to configure providers, model routing, and the Discord/Telegram bot.

## 3. Where it could actually help this repo

| Use case | Why Free Claude Code is a good fit |
|---|---|
| Long `/spec-run` parallel-agent waves | `T1`…`T8` waves each spawn `Agent` calls; at ~50 calls per session the Anthropic bill can spike — routing Haiku-tier calls to Cerebras Llama (free, very fast) cuts that to near zero |
| `/album-launch` and `/rhythmix-spec` fan-outs | Four parallel agents (cover art, music, video, landing) all hit the LLM tier simultaneously — route to free NVIDIA NIM or OpenRouter free models |
| iPhone-driven sessions (Telegram bot) | The built-in Telegram bot lets you drive Claude Code from your phone — same workflow as Hermes (`SETUP-HERMES.md`) but no porting required since it runs the real Claude Code CLI |
| Trying new models | 17 providers with one config change; swap a model tier to test Kimi K2.5, Gemma, or Mistral Devstral without changing `.mcp.json` |
| Cost reduction on exploratory /chat sessions | Daily research and brainstorming sessions can use free-tier models; save the Anthropic quota for renders and critical edits |

For critical production video authoring (HyperFrames, TTS, render), stay on Anthropic Claude directly — the RHYTHMIX skills are tuned to its output style.

## 4. Configure a provider (Admin UI)

Open <http://127.0.0.1:8082/admin>, go to **Providers**, and paste one of these:

| Provider | Env key | Recommended free model |
|---|---|---|
| NVIDIA NIM | `NVIDIA_NIM_API_KEY` | `nvidia_nim/nvidia/nemotron-3-super-120b-a12b` |
| OpenRouter | `OPENROUTER_API_KEY` | `open_router/openrouter/free` (meta-router across free models) |
| Google AI Studio | `GEMINI_API_KEY` | `gemini/models/gemini-3.1-flash-lite` |
| Cerebras | `CEREBRAS_API_KEY` | `cerebras/llama3.1-8b` (very fast, good for Haiku tier) |
| Groq | `GROQ_API_KEY` | `groq/llama-3.3-70b-versatile` |
| DeepSeek | `DEEPSEEK_API_KEY` | `deepseek/deepseek-chat` |
| Mistral | `MISTRAL_API_KEY` | `mistral/devstral-small-latest` (code-focused) |
| Ollama (local) | *(no key)* | `ollama/llama3.1` — pull first with `ollama pull llama3.1` |

NVIDIA NIM is the best first pick: generous free tier, strong model quality, and the `nemotron-3-super-120b` is capable enough for most RHYTHMIX spec and copy tasks. Get a key at <https://build.nvidia.com/settings/api-keys>.

The repo already has `GEMINI_API_KEY` in `.env.example` for the `gemini-mcp` server (see PR #65) — you can reuse that same key here.

## 5. Per-model-tier routing

This repo routes `Agent` calls by model tier (see `CLAUDE.md` → Subagent Model Routing). Free Claude Code honours the same tiers:

| Claude Code tier | Suggested routing |
|---|---|
| **Opus** (complex reasoning, specs, design) | `nvidia_nim/moonshotai/kimi-k2.5` or `nvidia_nim/nvidia/nemotron-3-super-120b-a12b` |
| **Sonnet** (default, most tasks) | `nvidia_nim/nvidia/nemotron-3-super-120b-a12b` or `open_router/openrouter/free` |
| **Haiku** (grep, file reads, lockfile checks) | `cerebras/llama3.1-8b` (fastest) or `groq/llama-3.3-70b-versatile` |

Set `MODEL_OPUS`, `MODEL_SONNET`, `MODEL_HAIKU` individually in the Admin UI to leave any tier blank (inheriting `MODEL`) when you want it to stay on Anthropic.

## 6. Connect Claude Code to the proxy

**Recommended — use the launcher:**

```bash
fcc-claude
```

This sets `ANTHROPIC_BASE_URL`, `ANTHROPIC_AUTH_TOKEN`, `CLAUDE_CODE_ENABLE_GATEWAY_MODEL_DISCOVERY`, and `CLAUDE_CODE_AUTO_COMPACT_WINDOW=190000` then runs `claude`.

**VS Code extension** — add to `settings.json`:

```json
"claudeCode.environmentVariables": [
  { "name": "ANTHROPIC_BASE_URL",  "value": "http://localhost:8082" },
  { "name": "ANTHROPIC_AUTH_TOKEN", "value": "freecc" },
  { "name": "CLAUDE_CODE_ENABLE_GATEWAY_MODEL_DISCOVERY", "value": "1" },
  { "name": "CLAUDE_CODE_AUTO_COMPACT_WINDOW", "value": "190000" }
]
```

## 7. Telegram bot (iPhone workflow)

If you want to drive renders from your iPhone (same goal as `SETUP-HERMES.md` §3):

1. Create a bot with [@BotFather](https://t.me/BotFather), copy the token.
2. Get your numeric user ID from [@userinfobot](https://t.me/userinfobot).
3. In the Admin UI → **Messaging**, set Platform to `telegram`, paste token and user ID.
4. Set **Allowed Directory** to this repo's absolute path on the machine running the proxy.
5. Click Validate → Apply.

Commands: `/stop` cancels a running task, `/clear` resets the session, `/stats` shows state.

> Note: unlike Hermes's gateways, this bot drives the full Claude Code CLI (not a ported skill subset), so all RHYTHMIX project skills work normally.

## 8. What this does *not* affect

- **`.mcp.json`** — the `creative-stack`, `higgsfield`, `pollinations`, `context7`, and `playwright` MCP servers are unaffected. Free Claude Code only re-routes Claude Code's LLM calls.
- **`.claude/skills/`** — all RHYTHMIX skills work identically; the proxy is transparent to them.
- **`.claude/settings.json`** — permission allowlists, hooks, and other Claude Code settings are unchanged.
- **`studio/` (Cloudflare Pages deploy)** — no connection; this is a local dev tool.
- **ElevenLabs / Replicate API tokens** — still sourced from `.env` as before; the proxy doesn't touch them.
- **Anthropic API token** — when running through the proxy the `ANTHROPIC_AUTH_TOKEN` value `freecc` is the proxy's local auth, not sent to Anthropic. Your real Anthropic key is never needed by the proxy.

## 9. Troubleshooting

```bash
fcc-server          # check startup logs — provider errors appear here
# Admin UI → Providers → Validate to test a key before using it
```

- **HTTP 400 from a provider** — usually a model slug typo or an unsupported request field. Check the model ID in the Admin UI against the provider's current model list.
- **Claude Code still hitting Anthropic** — confirm `ANTHROPIC_BASE_URL` is set; `fcc-claude` sets it automatically, manual terminal sessions need it exported.
- **Slow completions** — switch `MODEL_HAIKU` to `cerebras/llama3.1-8b` (sub-second on simple tasks).

Full upstream docs: <https://github.com/Alishahryar1/free-claude-code>.
