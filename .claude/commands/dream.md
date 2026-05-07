---
description: One-shot creative generator. Routes a single description to the right modality (image, video, music, voice, video promo, web design, code) and produces it.
argument-hint: <natural language description of what you want>
---

The user wants you to generate something creative described by:

> $ARGUMENTS

**Step 1 — Classify** the request into one of these modalities. Pick the BEST match. If the request is ambiguous, ask ONE consolidated question before doing any work.

| Signal | Modality | How to fulfill |
|---|---|---|
| "video", "clip", "trailer", "promo", "movie", "scene" — short (<= 15s) | Single video clip | `replicate_video` MCP tool (HunyuanVideo). |
| "rhythmix" + video, OR a 30/60/90s promo video | Branded RHYTHMIX video | Invoke the `rhythmix-author` skill — full HyperFrames pipeline. |
| "image", "picture", "art", "poster", "cover", "illustration", "photo" | Still image | `replicate_image` MCP tool (FLUX 1.1 Pro). |
| "music", "track", "song", "beat", "loop", "instrumental" | Music | `replicate_music` MCP tool (MusicGen). For songs with vocals, tell the user Suno/Udio is better and offer to write the prompt. |
| "voice", "voiceover", "narration", "speak", "say" | Speech audio | `elevenlabs_tts`. If `elevenlabs_voices` hasn't been listed this session, list first; pick a voice that fits the requested tone. |
| "website", "landing page", "section", "component" | Web/code | Author HTML/CSS in this repo using existing brand identity from `rhythmix-teaser-60s/DESIGN.md`. |
| "story", "script", "lyrics", "copy", "tagline" | Writing | Generate the text directly. Offer to feed it into TTS or RHYTHMIX video next. |

**Step 2 — Confirm preconditions** if calling an MCP tool:
- Check that the tool is wired up. If you don't see `replicate_image`/`elevenlabs_tts` in your available tools, the MCP server isn't installed. Tell the user to follow `.claude/mcp/creative-stack/README.md` to install it (one-time, ~30 seconds).
- If the tool is wired but a request fails with `REPLICATE_API_TOKEN is not set` or similar, point at the README for env-var setup.

**Step 3 — Execute** the chosen tool. For Replicate calls, give a sensible default for unspecified parameters (e.g. aspect_ratio "16:9" for videos, "1:1" for cover art, "9:16" for social).

**Step 4 — Report** back with:
- The local file path of the artifact
- A one-sentence description of what you generated
- The next obvious follow-up (e.g. "want me to use this image as a thumbnail in a video?", "want to combine this music with the existing RHYTHMIX promo?")

**Do NOT** commit or push automatically — just generate. Wait for the user to approve.
