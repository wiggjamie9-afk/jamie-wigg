# RHYTHMIX Content Engine — Kling 2.1 → Socials

A webhook-driven [n8n](https://n8n.io) pipeline plus a control dashboard in
`agent-builder`. You submit a topic; it writes a Kling-ready prompt, generates a
video on Kling 2.1 (via Replicate), polls to completion, logs status to a Google
Sheet, and posts to YouTube / TikTok / Instagram. The dashboard triggers runs and
shows live status + a video gallery.

```
agent-builder dashboard ──POST──▶ n8n Webhook
                                     │
        Normalize ▶ Append Run Row (Sheet) ▶ Claude prompt ▶ Submit Kling
                                     │
                 ┌── Wait 5s ◀── (poll loop, 10-min timeout guard) ──┐
                 ▼                                                    │
            Check Status ─ Succeeded? ─yes▶ Download ▶ Row: done ▶ YouTube/TikTok/IG
                              │no                                    ▲
                          Failed? ─yes▶ Row: failed                 │
                              │no ▶ Timed out? ─no──────────────────┘
                                          └─yes▶ Row: timeout
```

The **Google Sheet is the single source of truth** for run status; the dashboard
reads it. No app server — the dashboard is a static page.

## Files

| File | What |
|---|---|
| `workflow.json` | The n8n engine (webhook-triggered). Import into n8n. |
| `../../agent-builder/app/content-engine/page.tsx` | Dashboard route → `/content-engine`. |
| `../../agent-builder/lib/content-engine.ts` | Client helpers (trigger + read sheet). |

## 1. Google Sheet

Create a sheet with a header row containing **exactly** these columns:

```
run_id | topic | duration | aspect | vibe | status | video_url | created_at
```

Share it **"anyone with the link can view"** (the dashboard reads it via the
public gviz CSV endpoint). Copy the **Sheet ID** from its URL.

## 2. Import & configure the workflow

1. n8n → **Import from File** → `workflow.json`.
2. Replace placeholders:
   - `YOUR_GOOGLE_SHEET_ID` (4 Google Sheets nodes).
   - `REPLACE_WITH_KLING_2_1_MODEL_VERSION_HASH` in **Submit to Kling** — from the
     Kling model page on Replicate (`GET /v1/models/{owner}/{name}` →
     `latest_version.id`). Adjust the `input` fields to that model's schema.
3. Assign credentials:
   | Node(s) | Credential |
   |---|---|
   | Google Sheets nodes | Google Sheets OAuth2 |
   | Generate Kling Prompt | Header Auth — `x-api-key` = Anthropic key |
   | Submit to Kling / Check Status | Header Auth — `Authorization` = `Bearer r8_…` |
   | Upload to YouTube | YouTube OAuth2 |
4. **Enable CORS** so the browser dashboard can POST: on the **Webhook** node set
   *Allowed Origins* to your dashboard origin (or `*` for testing), or run n8n with
   the appropriate `N8N_CORS_*` env. Activate the workflow and copy the
   **Production webhook URL** (`https://<n8n>/webhook/content-engine`).

## 3. Use the dashboard

Run agent-builder (`cd agent-builder && npm install && npm run dev`) → open
`/content-engine`. In **Settings** paste the **webhook URL** + **Sheet ID** (saved
to `localStorage` only). Then **New video**: enter a topic, pick duration / aspect
/ vibe, **Generate**. Runs appear in the gallery and auto-refresh every 10s while
processing; completed videos play inline.

## Hardening already built in

- **Failure handling** — `failed`/`canceled` predictions write `status=failed`
  (with the Replicate error) and stop, instead of looping forever.
- **Timeout guard** — the poll loop bails after **10 minutes** (`status=timeout`),
  so a stuck prediction can't loop indefinitely.
- **TikTok + Instagram** nodes are wired but shipped **disabled** (they need an
  approved app + OAuth). Enable each node and assign credentials when ready:
  - TikTok — Content Posting API `…/video/init/` with `PULL_FROM_URL`.
  - Instagram — Graph API Reels (`/{ig-user-id}/media` from a public `video_url`);
    set an `IG_USER_ID` n8n variable.

## Swapping the Kling provider

Default is **Replicate** (the RHYTHMIX stack). To use a direct Kling API / PiAPI,
edit **Submit to Kling** (create-task endpoint) and **Check Status** (get-task
endpoint), and adjust the `Succeeded?`/`Failed?` conditions + the `output` field.

## Notes & caveats

- **Cost is on your tokens** — each run bills your Replicate (Kling) + Anthropic
  usage. Test on one run first.
- **CORS, two places:** the webhook POST needs the n8n webhook to allow your
  origin; the sheet read uses Google's public gviz CSV (works when the sheet is
  link-viewable). If reads fail, confirm the share setting.
- **YouTube** uploads default to `private` — change deliberately.
- Keep this on your own n8n + the feature branch; it is not part of the GitHub
  Pages or Studio deploys.
