# Zyloo MCP server

Wraps the [Zyloo](https://zyloo.io) API — an OpenAI-compatible gateway that
fronts Claude and other frontier models — as MCP tools for Claude Code. Because
Zyloo speaks the OpenAI Chat Completions wire format, any model the gateway
routes to is reachable through the standard `/chat/completions` and `/models`
endpoints. Model ids are namespaced, e.g. `zyloo/claude-haiku-4-5-20251001`.

## Setup

1. Get a key at https://zyloo.io (keys start with `sk-zy-`).
2. Copy `.env.example` → `.env` at the repo root and fill in:
   ```
   ZYLOO_API_KEY=sk-zy-...
   ZYLOO_BASE_URL=https://api.zyloo.io/v1   # optional, this is the default
   ZYLOO_MODEL=zyloo/claude-haiku-4-5-20251001   # optional default model
   ```
3. Install deps (once):
   ```bash
   cd .claude/mcp/zyloo && npm install
   ```

The server is registered in `.mcp.json` as `zyloo` and starts automatically
when Claude Code loads the project.

## Tools

| Tool | What it does |
|---|---|
| `zyloo_complete` | Single-prompt completion. Pass `prompt` (+ optional `system_prompt`, `model`, `temperature`, `max_tokens`). |
| `zyloo_chat` | Multi-turn chat with the full OpenAI message array. Optional `user_images` (URLs) append vision inputs to the last user turn. |
| `zyloo_list_models` | Lists models the gateway can route to (`GET /models`). Use to discover valid `model` ids. |

## Equivalent raw call

The tools are thin wrappers over the same endpoint the OpenAI SDK hits:

```python
from openai import OpenAI

client = OpenAI(base_url="https://api.zyloo.io/v1", api_key="sk-zy-...")
resp = client.chat.completions.create(
    model="zyloo/claude-haiku-4-5-20251001",
    messages=[{"role": "user", "content": "Hello!"}],
)
print(resp.choices[0].message.content)
```
