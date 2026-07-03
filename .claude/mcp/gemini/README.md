# Gemini MCP server

Wraps Google's **Gemini** models — text generation and native image
generation — as MCP tools for Claude Code, routed through the
[ZenMux](https://zenmux.ai) gateway. ZenMux fronts Vertex AI using the Google
Gen AI wire format, so the standard `generateContent` endpoint is reachable at
`{base}/v1/publishers/{provider}/models/{model}:generateContent` with a Bearer
token. Model ids are provider-namespaced slugs, e.g.
`google/gemini-3.1-flash-lite-image`.

## Setup

1. Get a key at https://zenmux.ai (keys start with `sk-`).
2. Copy `.env.example` → `.env` at the repo root and fill in:
   ```ini
   ZENMUX_API_KEY=sk-...
   ZENMUX_BASE_URL=https://zenmux.ai/api/vertex-ai   # optional, this is the default
   ZENMUX_GEMINI_MODEL=google/gemini-3.1-flash-lite-image   # optional default model
   ```
3. Install deps (once):
   ```bash
   cd .claude/mcp/gemini && npm install
   ```

The server is registered in `.mcp.json` as `gemini` and starts automatically
when Claude Code loads the project. Generated images are saved under
`creative-out/` (gitignored) by default; override with `GEMINI_OUT_DIR`.

> ⚠️ **Sandbox egress:** the cloud sandbox's network allowlist blocks
> `zenmux.ai`, so the tools register and build requests fine but calls fail at
> runtime with `403 Host not in allowlist` until `zenmux.ai` is added to the
> environment's egress settings. This works normally in environments that allow
> outbound HTTPS to ZenMux.

## Tools

| Tool | What it does |
|---|---|
| `gemini_generate` | Single-prompt text generation. Pass `prompt` (+ optional `system_instruction`, `model`, `temperature`, `max_tokens`). |
| `gemini_chat` | Multi-turn chat with the Gen AI `contents` format (`messages` as `{role: user\|model, text}`). Optional `user_images` (URLs) attach vision inputs to the last user turn. |
| `gemini_image` | Native image generation (`responseModalities: [TEXT, IMAGE]`). Decodes the returned base64 image(s) and saves them to disk; returns the file paths + any model text. |
| `zenmux_complete` | Single-prompt completion against **any** ZenMux model via the OpenAI-compatible Chat Completions endpoint (`anthropic/…`, `openai/…`, `moonshotai/…`, `bytedance/…`, etc.). Pass `prompt` (+ optional `system_prompt`, `model`, `temperature`, `max_tokens`). |
| `zenmux_chat` | Multi-turn chat against any ZenMux model using the full OpenAI `messages` array. Optional `user_images` (URLs) append vision inputs to the last user turn. |
| `gemini_list_models` | Lists models the gateway can route to (OpenAI-compatible `GET /models`). Optional `filter` substring. Use to discover valid `model` slugs for any tool. |

The `gemini_*` tools speak the Gemini-native `generateContent` format (Vertex-AI
path) and are the only ones that do image generation. The `zenmux_*` tools speak
the OpenAI Chat Completions format (`{base}/api/v1/chat/completions`) and can
route to any model on the gateway. Both share the same `ZENMUX_API_KEY`.

## Environment variables

| Var | Required | Default | Purpose |
|---|---|---|---|
| `ZENMUX_API_KEY` | yes | — | ZenMux API key (Bearer auth). |
| `ZENMUX_BASE_URL` | no | `https://zenmux.ai/api/vertex-ai` | Vertex-AI-compatible base URL. |
| `ZENMUX_API_VERSION` | no | `v1` | API version path segment. |
| `ZENMUX_GEMINI_MODEL` | no | `google/gemini-3.1-flash-lite-image` | Default model slug for the `gemini_*` tools. |
| `ZENMUX_OPENAI_BASE_URL` | no | `https://zenmux.ai/api/v1` | OpenAI-compatible base for the `zenmux_*` tools. |
| `ZENMUX_CHAT_MODEL` | no | `anthropic/claude-sonnet-5-free` | Default model slug for the `zenmux_*` tools. |
| `ZENMUX_MODELS_URL` | no | `{ZENMUX_OPENAI_BASE_URL}/models` | OpenAI-compatible models endpoint for discovery. |
| `GEMINI_OUT_DIR` | no | `./creative-out` | Where `gemini_image` writes files. |

## Equivalent raw call

The tools are thin wrappers over the same endpoint the `google-genai` SDK hits
when pointed at ZenMux:

```python
from google import genai
from google.genai import types

client = genai.Client(
    api_key="$ZENMUX_API_KEY",
    vertexai=True,
    http_options=types.HttpOptions(api_version="v1", base_url="https://zenmux.ai/api/vertex-ai"),
)

# Text
resp = client.models.generate_content(
    model="google/gemini-3.1-flash-lite-image",
    contents="How does AI work?",
)
print(resp.text)

# Image
resp = client.models.generate_content(
    model="google/gemini-3.1-flash-lite-image",
    contents=["Create a picture of a nano banana dish in a fancy restaurant"],
    config=types.GenerateContentConfig(response_modalities=["TEXT", "IMAGE"]),
)
for part in resp.parts:
    if part.inline_data is not None:
        part.as_image().save("generated_image.png")
```

Under the hood that resolves to
`POST https://zenmux.ai/api/vertex-ai/v1/publishers/google/models/gemini-3.1-flash-lite-image:generateContent`
with `Authorization: Bearer $ZENMUX_API_KEY`.

The `zenmux_*` tools wrap ZenMux's OpenAI-compatible endpoint instead, so any
routed model works with the standard OpenAI SDK:

```python
from openai import OpenAI

client = OpenAI(base_url="https://zenmux.ai/api/v1", api_key="$ZENMUX_API_KEY")
completion = client.chat.completions.create(
    model="anthropic/claude-opus-4.8",   # or openai/…, moonshotai/…, bytedance/…, google/…
    messages=[{"role": "user", "content": "What is the meaning of life?"}],
)
print(completion.choices[0].message.content)
```

That resolves to `POST https://zenmux.ai/api/v1/chat/completions` with the same
Bearer key.
