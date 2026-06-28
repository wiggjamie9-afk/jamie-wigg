# Faceless Content System — Sheets → VEO3 → TikTok / Reels / Shorts

An importable [n8n](https://n8n.io) workflow that rebuilds the "VEO3 + autoposting"
faceless content automation: a new Google Sheets row triggers an AI-written VEO3
prompt, generates an 8-second vertical video (with native audio) on **fal.ai**,
polls until it's ready, writes the result back to the sheet, then fans out to
**TikTok + Instagram Reels + YouTube Shorts**.

> **Status:** the workflow imports and runs as a skeleton with **placeholder
> credentials** and a couple of literal placeholders (sheet ID, upload-post user).
> YouTube is wired with the native node; TikTok + Instagram post through
> [upload-post.com](https://upload-post.com) in a single call (with direct-API
> alternatives documented on a sticky note). Nothing here contains secrets — you
> add credentials inside n8n after import.

## Stages

| Stage | Nodes | What it does |
|---|---|---|
| 1 — Trigger & Prompt | `New Row (Google Sheets)` → `Generate VEO3 Prompt (Claude)` → `Set Variables for Video` | On a new row, Claude turns the row's `Idea` into a VEO3-ready prompt (scene + camera + audio cues), and sets aspect ratio (`9:16`) + duration (`8s`). |
| 2 — Submit | `Submit to VEO3 (fal.ai)` | `POST https://queue.fal.run/fal-ai/veo3/fast` with the prompt; returns a `request_id` + `status_url` + `response_url`. |
| 3 — Monitor | `Wait 10s` → `Check Status` → `Ready?` | Polls every 10s; loops back until `status = COMPLETED`. |
| 4 — Retrieve & post | `Get Video URL` → `Download MP4` / `Update Sheet` / `Post to TikTok + Instagram` → `Upload to YouTube Shorts` | Fetches the final `video.url`, logs `status` + `video_url` + `prompt_used` to the sheet, and posts everywhere. |

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
| `Post to TikTok + Instagram (upload-post.com)` | **Header Auth** | Header name `Authorization`, value `Apikey <your_upload-post_key>`. |
| `Upload to YouTube Shorts` | YouTube OAuth2 | Your YouTube channel. |

## Placeholders to replace

1. **`YOUR_GOOGLE_SHEET_ID`** — in both Google Sheets nodes (the trigger and
   `Update Sheet`). It's the long ID in your sheet's URL.
2. **`REPLACE_UPLOADPOST_USER`** — in `Post to TikTok + Instagram`. The
   upload-post.com profile that has TikTok + Instagram connected.
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

## Posting — TikTok & Instagram

The primary path uses **upload-post.com**, which accepts the public fal.ai
`video.url` and posts to TikTok + Instagram Reels in one request. If you'd rather
go direct (no third party), the `Posting notes` sticky note inside the workflow
has the exact TikTok Content Posting API and Instagram Graph API call sequences —
each needs an approved app + OAuth you set up once.

> ⚠️ fal.ai result URLs are public but **temporary**. upload-post and Instagram
> fetch them immediately, so this is fine for auto-posting. If you need a durable
> link, add a step that re-hosts the MP4 (from `Download MP4`) to R2/S3 and use
> that URL instead.
