# Higgsfield MCP tool reference

All tools live under the `higgsfield` MCP server (see `.mcp.json`). Every
generation tool returns a **job set** — a wrapper containing one or more jobs
and a `job_set_id` that you poll with `get_job_status`.

## Common job-set response

```json
{
  "id": "job-set-uuid",
  "type": "text2image_soul",
  "created_at": "2026-05-12T11:30:00Z",
  "jobs": [{
    "id": "job-uuid",
    "status": "queued",
    "results": { "min": {...}, "raw": {...} }
  }],
  "input_params": {}
}
```

Job statuses: `queued` → `in_progress` → `completed` | `failed` | `nsfw`.

`results.raw.url` is the full-quality output. `results.min.url` is a smaller
preview. For HyperFrames compositions, download `raw`.

## generate_image_soul (text-to-image)

| Param | Required | Notes |
|---|---|---|
| `prompt` | ✅ | Full descriptive sentence. Auto-enhanced unless `enhance_prompt: false`. |
| `width_and_height` | | Default `1696x960`. Common: `2048x1152` (16:9), `1152x2048` (9:16), `2048x1536` (4:3), `2048x2048` (1:1). |
| `quality` | | `"720p"` (default) or `"1080p"`. |
| `batch_size` | | `1` (default) or `4`. |
| `enhance_prompt` | | Default `true`. |
| `style_id` | | UUID from `get_soul_styles`. |
| `style_strength` | | 0-1, default 1.0. |
| `seed` | | 1-1000000 for reproducibility. |
| `custom_reference_id` | | Character UUID — must be `completed`. |
| `custom_reference_strength` | | 0-1, default 1.0. |
| `image_reference_url` | | Public URL of a reference image (composition cue, not character). |
| `webhook_url` / `webhook_secret` | | For async notification instead of polling. |

```json
{
  "prompt": "A solitary glass piano in an empty concrete hall, single spotlight from above, cinematic 35mm",
  "width_and_height": "2048x1152",
  "quality": "1080p",
  "seed": 42
}
```

## get_soul_styles

No params. Returns `[{id, name, description, preview_url}, ...]`. Call once per
session, cache the result. Use `id` as `style_id` in `generate_image_soul`.

## generate_video_dop (image-to-video)

| Param | Required | Notes |
|---|---|---|
| `input_image_url` | ✅ | Public URL of the start frame (≥ 720p recommended). |
| `prompt` | ✅ | **Describes the motion**, not the subject. "Camera dollies forward as the figure exhales." |
| `model` | | Default `"dop-turbo"`. |
| `input_image_end_url` | | Public URL of an end frame — DOP morphs A → B. |
| `motions` | | Array of `{id, strength}`. IDs from `get_motions`. Strength 0-1. |
| `enhance_prompt` | | Default `true`. |
| `seed` | | For reproducibility. |
| `webhook_url` / `webhook_secret` | | Optional async notification. |

```json
{
  "input_image_url": "https://hf-results.example.com/abc.png",
  "prompt": "Slow push-in. Subtle parallax in the background haze.",
  "motions": [{ "id": "motion-uuid-here", "strength": 0.6 }]
}
```

Output: ~5s MP4 at the source aspect ratio.

## get_motions

No params. Returns `[{id, name, description, preview_url}, ...]`. Motions are
named camera/subject behaviors ("push-in", "head turn", "orbit left",
"slow zoom"). Cache per session.

## generate_speech_video (talking head)

| Param | Required | Notes |
|---|---|---|
| `prompt` | ✅ | Spoken text (server runs TTS) OR can be a description if using `input_audio_url`. |
| `input_image_url` | | Public URL of the face image. Required in practice. |
| `input_audio_url` | | Public URL of pre-rendered audio (overrides server TTS — use this with ElevenLabs / Kokoro). |
| `quality` | | Default `"high"`. |
| `enhance_prompt` | | Default `false` (text → speech is usually used verbatim). |
| `seed` | | For reproducibility. |
| `duration` | | Seconds — required if no audio URL. |
| `webhook_url` / `webhook_secret` | | Optional. |

```json
{
  "input_image_url": "https://example.com/face.jpg",
  "input_audio_url": "https://raw.githubusercontent.com/<user>/<repo>/<sha>/voiceover-emma.wav",
  "quality": "high"
}
```

Pair with your existing Kokoro / ElevenLabs voiceovers by passing
`input_audio_url` — that keeps the voice consistent across HyperFrames
compositions.

## create_character

| Param | Required | Notes |
|---|---|---|
| `name` | ✅ | ≤ 100 chars. Becomes the display name in your character library. |
| `image_urls` | ✅ | 1-100 public URLs. More photos = stronger ref. 5-10 is a good baseline. |

```json
{
  "name": "RHYTHMIX Founder Headshot",
  "image_urls": [
    "https://example.com/founder-1.jpg",
    "https://example.com/founder-2.jpg",
    "https://example.com/founder-3.jpg"
  ]
}
```

Returns a character object with `id`. **Status is initially `processing`** —
poll `get_character` until `completed` (30-90s typical) before using
`custom_reference_id` in Soul prompts.

## get_character

| Param | Required |
|---|---|
| `reference_id` | ✅ |

Returns the character object including current `status`. Possible statuses:
`processing`, `completed`, `failed`.

## delete_character

| Param | Required |
|---|---|
| `reference_id` | ✅ |

Removes the character from your library. Use to clean up test characters; not
needed for normal flow.

## get_job_status

| Param | Required |
|---|---|
| `job_set_id` | ✅ |

Returns the job set with current status and (when complete) result URLs.

Polling pattern: every 10-15s per outstanding job set. Bail early if any
status hits `failed` or `nsfw` and surface to the user.

## Webhook alternative

Every generation tool accepts `webhook_url` + `webhook_secret`. The webhook
payload matches the completed job set format. Useful for very long-running
batches — but for an interactive session, polling is simpler.

If using webhooks, you still want to record the `job_set_id` in `jobs.json`
so a later session can reconcile state.

## Rate limiting and error handling

Common errors:

| Status | Meaning | Action |
|---|---|---|
| 401 | Bad API key/secret | Check `.env` values |
| 422 | Invalid parameters | Read the error body, fix the call, ask user if prompt is the issue |
| 429 | Rate limited | Back off (exponential) and surface to user |
| 500 | Generation failed server-side | Retry once; if it fails again, surface |

For `nsfw` job status: do not auto-rewrite the prompt. Surface the rejection
and let the user steer.
