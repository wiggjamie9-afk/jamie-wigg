# Kling 2.1 → Socials — n8n workflow

An importable [n8n](https://n8n.io) workflow that mirrors the 4-stage "Sheets →
AI video → auto-post" automation: a new Google Sheets row triggers a Kling 2.1
video generation (via Replicate), polls until it's ready, writes the result back
to the sheet, and fans out to YouTube / TikTok / Instagram.

> **Status:** the workflow imports and runs as a skeleton with **placeholder
> credentials and one placeholder value** (the Kling model version). YouTube is
> wired with the native node; TikTok and Instagram are documented stubs (sticky
> notes) because they each require an approved app + OAuth that only you can set
> up. Nothing here contains secrets — you add credentials inside n8n after import.

## Stages

| Stage | Nodes | What it does |
|---|---|---|
| 1 — Trigger & Prompt | `New Row (Google Sheets)` → `Generate Kling Prompt (Claude)` → `Extract Prompt` | On a new sheet row, Claude writes a Kling-ready, RHYTHMIX-styled prompt from the row's `Topic`/`Prompt` column. |
| 2 — Submit | `Submit to Kling (Replicate)` | Creates a Replicate prediction for the Kling 2.1 model. |
| 3 — Monitor | `Wait 5s` → `Check Status` → `Ready?` | Polls every 5s; loops back until `status = succeeded`. |
| 4 — Retrieve & post | `Download MP4` / `Update Sheet` → `Upload to YouTube` (+ TikTok/Instagram stubs) | Downloads the MP4, writes `status`/`video_url` back to the sheet, uploads to socials. |

## Import

1. In n8n: **Workflows → Import from File** → pick `workflow.json`.
2. Open each node with a red credential badge and assign a credential (below).
3. Replace the two literal placeholders (below).
4. Activate the workflow (the Google Sheets trigger needs the workflow active).

## Credentials to create (in n8n → Credentials)

| Node | Credential type | Value |
|---|---|---|
| `New Row (Google Sheets)`, `Update Sheet` | Google Sheets OAuth2 | Your Google account with access to the sheet. |
| `Generate Kling Prompt (Claude)` | **Header Auth** | Header name `x-api-key`, value = your Anthropic API key. |
| `Submit to Kling (Replicate)`, `Check Status` | **Header Auth** | Header name `Authorization`, value `Bearer r8_your_replicate_token`. |
| `Upload to YouTube` | YouTube OAuth2 | Your YouTube channel. |

## Placeholders to replace

1. **`YOUR_GOOGLE_SHEET_ID`** — in both Google Sheets nodes. Your sheet should
   have at least a `Topic` (or `Prompt`) column; the workflow writes back
   `status` and `video_url` and matches rows on `row_number`.
2. **`REPLACE_WITH_KLING_2_1_MODEL_VERSION_HASH`** — in `Submit to Kling
   (Replicate)`. Get it from the model page on Replicate (e.g. a Kling 2.1
   text-to-video model), `GET /v1/models/{owner}/{name}` → `latest_version.id`.
   Adjust the `input` fields (`duration`, `aspect_ratio`, etc.) to that model's
   schema.

## Swapping the Kling provider

The default uses **Replicate** because that's already the RHYTHMIX stack. To use
a direct Kling API or another aggregator (e.g. PiAPI), edit the two HTTP nodes:
- `Submit to Kling (Replicate)` → that provider's "create video task" endpoint.
- `Check Status` → that provider's "get task" endpoint, and update `Ready?`'s
  success condition + the `output` field used downstream.

## Wiring TikTok & Instagram

These are intentionally left as sticky-note stubs — each needs an approved
developer app and OAuth that can't be bundled:

- **TikTok** — [Content Posting API](https://developers.tiktok.com/doc/content-posting-api-get-started):
  `init` (FILE_UPLOAD) → PUT the binary from `Download MP4` → poll status.
- **Instagram** — [Graph API content publishing](https://developers.facebook.com/docs/instagram-api/guides/content-publishing)
  (Reels): create media container from a public `video_url` → poll → publish.
  Needs an IG Business account + Facebook app.

Add an **HTTP Request** node for each and connect it after `Download MP4` (TikTok,
binary upload) or after `Ready?`/`Update Sheet` (Instagram, which takes a public
URL — use `Check Status`.`output`).

## Notes & caveats

- **Cost is on your tokens** — every run bills your Replicate (Kling) and
  Anthropic usage. Start with the sheet trigger polling slowly and test on one row.
- **Failure handling** — the poll loop only branches on `succeeded`. Replicate can
  also return `failed`/`canceled`; add a second `If` (or a `Switch`) on `status`
  to break the loop and flag the row, otherwise a failed job loops forever.
- **YouTube privacy** defaults to `private` in the node — change to `public`
  deliberately.
- Keep this running on the designated feature branch / your own n8n instance; it
  is not part of the GitHub Pages or Studio deploys.
- The Claude model id in the prompt node (`claude-opus-4-8`) can be swapped for
  any current Anthropic model.
