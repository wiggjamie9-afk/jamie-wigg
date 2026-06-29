# Faceless Content System — Sheets → VEO3 → TikTok / Reels / Shorts

An importable [n8n](https://n8n.io) workflow that rebuilds the "VEO3 + autoposting"
faceless content automation: a new Google Sheets row triggers an AI-written VEO3
prompt, generates an 8-second vertical video (with native audio) on **fal.ai**,
polls until it's ready, writes the result back to the sheet, then posts it to
**TikTok, Facebook, X & Threads** in one call.

> **Status:** the workflow imports and runs as a skeleton with **placeholder
> credentials**. All posting goes through [upload-post.com](https://upload-post.com)
> in a single multipart call to every connected platform (default: tiktok,
> facebook, x, threads — add `instagram`/`youtube`/`pinterest` once connected there).
> Nothing here contains secrets — you add credentials inside n8n after import.

## Stages

| Stage | Nodes | What it does |
|---|---|---|
| 1 — Trigger & Prompt | `New Row (Google Sheets)` → `Generate VEO3 Prompt (Claude)` → `Set Variables for Video` | On a new row, Claude turns the row's `Idea` into a VEO3-ready prompt (scene + camera + audio cues), and sets aspect ratio (`9:16`) + duration (`8s`). |
| 2 — Submit | `Submit to VEO3 (fal.ai)` | `POST https://queue.fal.run/fal-ai/veo3/fast` with the prompt; returns a `request_id` + `status_url` + `response_url`. |
| 3 — Monitor | `Wait 10s` → `Check Status` → `Ready?` | Polls every 10s; loops back until `status = COMPLETED`. |
| 4 — Retrieve & post | `Get Video URL` → `Download MP4` / `Update Sheet` / `Post to socials (upload-post.com)` | Fetches the final `video.url`, logs `status` + `video_url` + `prompt_used` to the sheet, downloads the MP4, and posts it to all connected platforms. |

## Import

1. In n8n: **Workflows → Import from File** → pick `workflow.json`.
2. Open each node with a red credential badge and assign a credential (below).
3. Replace the three literal placeholders (below).
4. Activate the workflow (the Google Sheets trigger needs the workflow active).

## Google Sheet layout

Create one tab (`Sheet1`) with at least these columns:

| Column | Role |
|---|---|
| `Idea` (or `Topic` / `Prompt`) | Your one-line video concept — the only thing you fill in. |
| `Style` | Optional tone/look (e.g. "documentary, moody"). |
| `status` | Written by the workflow (`done`). |
| `video_url` | Written by the workflow (the final MP4 URL). |
| `prompt_used` | Written by the workflow (the VEO3 prompt Claude generated). |

Drop a new row with an `Idea`, and the pipeline does the rest.

## Credentials to create (in n8n → Credentials)

| Node | Credential type | Value |
|---|---|---|
| `New Row (Google Sheets)`, `Update Sheet` | Google Sheets OAuth2 | Your Google account with access to the sheet. |
| `Generate VEO3 Prompt (Claude)` | **Header Auth** | Header name `x-api-key`, value = your Anthropic API key. |
| `Submit to VEO3 (fal.ai)`, `Check Status`, `Get Video URL` | **Header Auth** | Header name `Authorization`, value `Key <your_fal_key>`. |
| `Post to socials (upload-post.com)` | **Header Auth** | Header name `Authorization`, value `Apikey <your_upload-post_key>`. (Do **not** set a `content-type` header — n8n sets the multipart boundary.) |

So you create **4 credentials total**: Google Sheets OAuth, Anthropic Header Auth, fal.ai Header Auth, upload-post Header Auth. (No separate YouTube/Google OAuth — posting is all via upload-post.)

## Placeholders to replace

1. **`YOUR_GOOGLE_SHEET_ID`** — in both Google Sheets nodes (the trigger and
   `Update Sheet`). It's the long ID in your sheet's URL.
2. **upload-post `user`** — in `Post to socials`, the `user` form field is preset
   to `jamie28`. Change it only if your upload-post profile name differs. That
   profile posts to its connected platforms (here: tiktok, facebook, x, threads).
3. The model is **`fal-ai/veo3/fast`** (cheaper, fast). For full quality switch
   the URL in `Submit to VEO3 (fal.ai)` to `https://queue.fal.run/fal-ai/veo3`.

## How the fal.ai VEO3 calls work

- **Submit** → `POST https://queue.fal.run/fal-ai/veo3/fast`
  body `{ prompt, aspect_ratio, duration, generate_audio }`.
  Response includes `status_url` and `response_url`.
- **Poll** → `GET {status_url}` → `status` is `IN_QUEUE` → `IN_PROGRESS` → `COMPLETED`.
- **Result** → once `COMPLETED`, `GET {response_url}` → `{ video: { url } }`.

VEO3 generates audio natively (ambient + any dialogue you put in the prompt), so
there's no separate TTS/voiceover step. Clips are 8s — chain rows for longer cuts.

## Swapping the video provider

To use **Replicate** instead of fal.ai (the rest of this repo's stack), edit the
three fal nodes:
- `Submit to VEO3 (fal.ai)` → `POST https://api.replicate.com/v1/predictions`
  with `{ "version": "<veo-3 model version hash>", "input": { "prompt": ... } }`
  and an `Authorization: Bearer r8_...` credential.
- `Check Status` / `Get Video URL` → `GET {{ ...urls.get }}`, success on
  `status = succeeded`, video at `output`.

See the sibling [`automation/kling-social-pipeline/`](../kling-social-pipeline/)
for a worked Replicate-based example.

## Posting — all platforms via upload-post

The `Post to socials` node sends **multipart/form-data** (`user`, `title`, repeated
`platform[]`, and the MP4 **file** as `video`), taking the binary from the
`Download MP4` node — so it works regardless of how long the fal.ai URL stays live.

Default platforms: **tiktok, facebook, x, threads** (the ones connected on the
`jamie28` upload-post profile). To add or remove one, edit the `platform[]` rows
in the node — valid values include `instagram`, `youtube`, `linkedin`,
`pinterest`. Each platform must be connected on the upload-post profile first
(Users → profile → tap the platform → Authorize). Note: `pinterest` also needs a
board field, and `youtube` needs a title — add those params if you enable them.
