# Claude Code Proxy (`free-claude-code`)

Local proxy that routes Claude Code's Anthropic Messages API traffic to alternative providers (NVIDIA NIM, Kimi, OpenRouter, DeepSeek, Z.ai, LM Studio, llama.cpp, Ollama, OpenCode Zen, Wafer). Useful when:

- you want to run Claude Code against a free/cheap upstream while keeping the CLI's UX,
- you want per-tier routing (Opus → one provider, Sonnet → another, Haiku → local),
- you want to run Claude Code against a local LM Studio / llama.cpp / Ollama model.

Upstream: <https://github.com/Alishahryar1/free-claude-code>.

## Install

Requires `uv` and Python 3.14.

```bash
uv python install 3.14
uv tool install --force --python 3.14 git+https://github.com/Alishahryar1/free-claude-code.git
```

This installs four binaries to `~/.local/bin/`: `fcc-server`, `fcc-claude`, `fcc-init`, `free-claude-code`.

### Or run from source via the vendored submodule

`vendor/free-claude-code` pins the upstream at the commit this repo was set up against. If you `git clone` this repo fresh, hydrate it with:

```bash
git submodule update --init --recursive
```

Then run from source instead of the installed tool:

```bash
cd vendor/free-claude-code
uv run uvicorn server:app --host 0.0.0.0 --port 8082
```

To bump the pin: `cd vendor/free-claude-code && git pull origin main && cd ../.. && git add vendor/free-claude-code && git commit`.

### Python 3.14 prerelease workaround

Pydantic `2.13.4` (required by `free-claude-code`) calls `typing._eval_type(..., prefer_fwd_module=True)`, a kwarg added in **Python 3.14 final**. If `uv` only ships `3.14.0rc2`, the call fails with `TypeError: _eval_type() got an unexpected keyword argument 'prefer_fwd_module'` on every `fcc-*` invocation.

Two options:

1. **Wait for `uv` to publish a 3.14 final build** (`uv self update && uv python install --reinstall 3.14`).
2. **Patch the installed pydantic file** at `~/.local/share/uv/tools/free-claude-code/lib/python3.14/site-packages/pydantic/_internal/_typing_extra.py` — wrap the `prefer_fwd_module=True` call in a `try/except TypeError:` and re-call without the kwarg in the fallback. The patch is lost on reinstall.

## First-time configuration (Admin UI)

```bash
fcc-server
```

Open the printed Admin URL (default `http://127.0.0.1:8082/admin`). It is loopback-only.

Paste a provider key (e.g. `NVIDIA_NIM_API_KEY`), set `MODEL` to a provider-prefixed slug, click **Validate and Apply**. The Admin UI restarts the server with the new config.

Common slugs:

| Provider | `MODEL` example |
|---|---|
| NVIDIA NIM (free tier) | `nvidia_nim/z-ai/glm4.7` |
| Kimi | `kimi/kimi-k2.5` |
| OpenRouter (free) | `open_router/deepseek/deepseek-r1-0528:free` |
| DeepSeek | `deepseek/deepseek-chat` |
| Z.ai (GLM Coding Plan) | `zai/glm-5.1` |
| Ollama (local) | `ollama/llama3.1` |
| LM Studio (local) | `lmstudio/<model-id-from-lm-studio>` |
| llama.cpp (local) | `llamacpp/<local-slug>` |

Override per Claude Code tier with `MODEL_OPUS`, `MODEL_SONNET`, `MODEL_HAIKU`. Blank values inherit `MODEL`.

## Connect Claude Code

```bash
fcc-claude
```

`fcc-claude` reads the running `fcc-server`'s port + auth token, sets `ANTHROPIC_BASE_URL`, `ANTHROPIC_AUTH_TOKEN`, `CLAUDE_CODE_ENABLE_GATEWAY_MODEL_DISCOVERY=1`, then `exec`s the real `claude` CLI. Keep `fcc-server` running in another shell.

### VS Code / JetBrains

Add the same three env vars to the extension's `claudeCode.environmentVariables` (VS Code) or `acp-agents/installed.json` (JetBrains). Example values when `fcc-server` is on the default port:

```json
{
  "ANTHROPIC_BASE_URL": "http://localhost:8082",
  "ANTHROPIC_AUTH_TOKEN": "freecc",
  "CLAUDE_CODE_ENABLE_GATEWAY_MODEL_DISCOVERY": "1"
}
```

Pick any value for `ANTHROPIC_AUTH_TOKEN` and use the same in the Admin UI.

## Headless config (no Admin UI)

The proxy reads env vars in this precedence:

1. `./` (current directory) `.env`
2. `~/.config/free-claude-code/.env`
3. `$FCC_ENV_FILE`

This repo already uses a root `.env` for the Higgsfield MCP server. **Do not** add `free-claude-code` keys to that file — they'll get pulled into Higgsfield's runtime. Instead, put fcc config at `~/.config/free-claude-code/.env`:

```bash
fcc-init   # scaffolds ~/.config/free-claude-code/.env
```

Then edit it with your provider keys and `MODEL`. Minimum for NVIDIA NIM:

```
NVIDIA_NIM_API_KEY=nvapi-...
MODEL=nvidia_nim/z-ai/glm4.7
ANTHROPIC_AUTH_TOKEN=freecc
```

## Sandbox / egress notes

When `fcc-server` first imports `tiktoken.get_encoding("cl100k_base")`, tiktoken downloads `cl100k_base.tiktoken` (~1.7 MB) from `openaipublic.blob.core.windows.net`. If your environment blocks that host, `fcc-server` fails to start.

Workarounds:

- Run `fcc-server` once on an unrestricted machine to populate `~/.cache/tiktoken/`, then copy the cache directory.
- Set `TIKTOKEN_CACHE_DIR=/path/to/prepopulated/cache` before starting `fcc-server`.

Provider hostnames (NIM, OpenRouter, Anthropic-compatible endpoints, etc.) also need to be reachable. Local providers (Ollama, LM Studio, llama.cpp) sidestep this entirely.

## When to use this vs. native Anthropic

Use the proxy when:

- you specifically want a non-Anthropic upstream (cost, latency, offline, model choice),
- you want different models per tier without re-running `claude`,
- you're testing local-model code workflows.

Use Claude Code natively when:

- you want Anthropic-quality routing, caching, and tool-use behavior — many proxied providers don't fully implement Anthropic's protocol surface,
- you're billed through an existing Anthropic plan and the upstream cost saving is marginal.
