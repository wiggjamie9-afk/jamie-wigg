# RHYTHMIX Faceless YouTube Pipeline (n8n)

Import-ready n8n workflow modeled on the classic faceless-content canvas:
**idea + script → music → images → voiceover → assembled video → manual approval → YouTube (private) → Sheets log.**

Import `workflow.json` into n8n (Cloud or self-hosted) via *Workflows → Import from file*.

## Safety rail

Nothing publishes on its own. After the render finishes, the workflow emails you a preview link
and **pauses** on a Wait node. It only proceeds to the YouTube upload when you click the resume
link in the email — and even then the video is uploaded as **private** (flip to public in YouTube
Studio when happy). This mirrors the repo convention: automation reports/drafts, humans publish.

## Credentials to add after import (all show as `REPLACE_ME`)

| Credential | Type | Used by |
|---|---|---|
| Anthropic API | Header Auth — header `x-api-key`, value your Anthropic key | Generate Idea and Script |
| Replicate API | Header Auth — header `Authorization`, value `Bearer r8_…` | music + image nodes |
| ElevenLabs API | Header Auth — header `xi-api-key`, value your key | Generate Voiceover |
| Creatomate API | Header Auth — header `Authorization`, value `Bearer …` | render nodes |
| Google Drive OAuth2 | built-in | narration staging |
| Gmail OAuth2 | built-in | approval email |
| YouTube OAuth2 | built-in | upload |
| Google Sheets OAuth2 | built-in | tracking log |

Replicate + ElevenLabs keys are the same ones as `.claude/settings.local.json` / `.env` in this repo.

## Placeholders to fill

| Placeholder | Where | What |
|---|---|---|
| `MUSICGEN_VERSION_ID_PLACEHOLDER` | Start Music Generation | Replicate version hash of `meta/musicgen` (copy from the model's API page) |
| `ELEVENLABS_VOICE_ID_PLACEHOLDER` | Generate Voiceover | Your ElevenLabs voice ID |
| `GOOGLE_DRIVE_FOLDER_ID_PLACEHOLDER` | Upload Narration to Drive | Folder for narration mp3 staging |
| `YOUR_APPROVAL_EMAIL_PLACEHOLDER` | Send Approval Email | Where the approve link goes |
| `GOOGLE_SHEET_ID_PLACEHOLDER` | Log to Google Sheets | Tracking sheet with tab `Videos` |

Sheet `Videos` columns: `date`, `idea`, `youtube_title`, `youtube_video_id`, `render_url`, `status`.

## Test steps

1. Fill credentials + placeholders, then run once manually (Execute workflow) instead of waiting for the Monday 9am schedule.
2. Watch stage 1: the Claude node must return strict JSON — if it fails in Parse Script JSON, re-run (the prompt demands JSON-only output).
3. Stages 2–4 poll Replicate/Creatomate every 10–20s; a 60s track typically takes 1–3 min, FLUX images ~10s each, the render ~1–2 min.
4. Check your inbox for the approval email; open the preview URL, then the resume link.
5. Confirm the video lands in YouTube Studio as private and the Sheets row appears.

## Notes

- Validated with `node .claude/skills/n8n-workflow-generator/validate-workflow.mjs automation/rhythmix-faceless-youtube/workflow.json`.
- Scene count and pacing: 4 scenes × 15s = 60s; change `sceneSeconds` in Build Creatomate Source and the scene count in the Claude prompt together.
- Sibling examples: `automation/veo3-faceless-content-system/`, `automation/kling-social-pipeline/`.
- This is the n8n twin of the in-repo pipeline (`rhythmix-author` → `render-verify`): use n8n when you want it fully unattended on a server; use the skills when you want editable HyperFrames compositions in git.
