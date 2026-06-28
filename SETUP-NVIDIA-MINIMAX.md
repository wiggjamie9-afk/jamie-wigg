# NVIDIA NIM — MiniMax-M3 — Setup & Reference

## Overview

[NVIDIA NIM](https://build.nvidia.com) hosts **MiniMax-M3** behind an
OpenAI-compatible endpoint, so this cloud-first, iPhone-driven repo can use a
big MiniMax model **without renting a GPU cluster** (contrast
`SETUP-MINIMAX-01.md`, which covers the self-host path for the open weights).

- **Endpoint**: `https://integrate.api.nvidia.com/v1/chat/completions`
- **Model id**: `minimaxai/minimax-m3`
- **Auth**: `Authorization: Bearer $NVIDIA_API_KEY`
- **Multimodal**: a message's `content` may be a list of parts — `text`,
  `image_url`, and `video_url` — using either a public URL or a base64
  `data:` URI.

This is the hosted path the RHYTHMIX stack should reach for: long-context story
development across a campaign/series, plus vision critique of rendered frames,
thumbnails, and reference images.

## Setup

1. Get a key from <https://build.nvidia.com> (free trial credits per account).
2. Add it to `.env` at the repo root (gitignored — see `.env.example`):

   ```bash
   NVIDIA_API_KEY=nvapi-...
   # Optional overrides:
   NVIDIA_BASE_URL=https://integrate.api.nvidia.com/v1
   NVIDIA_MODEL=minimaxai/minimax-m3
   ```

3. Install the MCP server's deps once:

   ```bash
   cd .claude/mcp/nvidia && npm install
   ```

The server is registered in `.mcp.json` as `nvidia`. Restart Claude Code to
pick it up, then find its tools via `ToolSearch` (keyword "minimax").

## MCP tools (`.claude/mcp/nvidia/server.mjs`)

| Tool | Purpose |
|---|---|
| `minimax_chat` | Long-context, multimodal chat. Attach `image_urls` / `video_urls` to the last user message. |
| `minimax_vision` | Critique/compare images or video frames — shot selection, thumbnail review, brand-fit checks. |
| `minimax_script` | RHYTHMIX-aware script / narration / pitch-deck copy; pass scenes or brand docs as `context`. |

## Raw API reference

```python
import requests

invoke_url = "https://integrate.api.nvidia.com/v1/chat/completions"

headers = {
    "Authorization": "Bearer $NVIDIA_API_KEY",
    "Accept": "application/json",
}

payload = {
    "model": "minimaxai/minimax-m3",
    "messages": [{"role": "user", "content": "Hello!"}],
    "max_tokens": 8192,
    "temperature": 1.00,
    "top_p": 0.95,
    "stream": False,
}

# Multimodal: set a message's "content" to a list of parts.
#   payload["messages"] = [{"role": "user", "content": [
#       {"type": "text", "text": "Describe this."},
#       {"type": "image_url", "image_url": {"url": "https://example.com/image.jpg"}},
#       {"type": "video_url", "video_url": {"url": "https://example.com/video.mp4"}},
#   ]}]
# Base64 instead of a URL:
#   import base64
#   b64 = base64.b64encode(open("image.png", "rb").read()).decode()
#   {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{b64}"}}

print(requests.post(invoke_url, headers=headers, json=payload).json())
```

For streaming, set `"stream": True`, send `Accept: text/event-stream`, and read
`response.iter_lines()`.

## How this fits the RHYTHMIX stack

- **Long context** → develop a whole campaign/series arc in one call; complements
  the Step 3.7 Flash tools in `.claude/mcp/stepfun/`.
- **Vision** → critique rendered Cuts, thumbnails, and mood boards for shot
  selection and brand consistency (the practical stand-in for the VL-01 use case
  described in `SETUP-MINIMAX-01.md`).
- **Script** → draft promo narration and pitch-deck copy in RHYTHMIX voice,
  ready to feed into `/rhythmix-author` or `/site-build`.

## Notes

- Keys live only in `.env` (gitignored). Never commit `NVIDIA_API_KEY`.
- The sandbox egress allowlist may gate `integrate.api.nvidia.com` — the server
  registers fine; only runtime calls are subject to the network policy.
