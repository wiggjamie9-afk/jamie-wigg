---
name: higgsfield-to-hyperframes
description: |
  Generate AI imagery and short clips with the Higgsfield MCP server (Soul text-to-image, DOP image-to-video, Speech-to-Video, Character references) and wire them into a HyperFrames composition. Use when: (1) the user wants AI-generated stills or short clips dropped into a HyperFrames video, (2) someone says "generate a hero shot", "animate this still", "give me AI b-roll", "consistent character across scenes", "talking-head avatar", (3) building a RHYTHMIX promo (or any HyperFrames composition) and they want photorealistic imagery instead of pure CSS/SVG, (4) chaining text → image → motion in a single pipeline. Sits between `hyperframes` / `rhythmix-author` and the raw Higgsfield API — those skills own the composition; this skill owns getting Higgsfield assets onto disk.
metadata:
  tags: higgsfield, hyperframes, ai-imagery, image-to-video, character-reference
---

# Higgsfield → HyperFrames

The Higgsfield MCP server (`.mcp.json` → `higgsfield`) generates AI imagery. The
HyperFrames skill composes HTML videos. This skill is the bridge — it covers
prompt design, async polling, asset organization, and the wire-in step.

## Preconditions

Before this skill is useful, all of the following must be true:

1. `pip install higgsfield-mcp` (or install from `geopopos/geo_higgsfield_ai_mcp`) has succeeded — the `higgsfield-mcp` binary is on PATH.
2. `.mcp.json` has the `higgsfield` server registered.
3. `HIGGSFIELD_API_KEY` and `HIGGSFIELD_SECRET` are set in `.env` at the repo root (or exported in the launching shell).
4. Claude Code has been restarted since `.mcp.json` was updated, so the `higgsfield` MCP tools are loaded.

If any of these are missing, fix them first. The user-facing entrypoint is the
README at `geopopos/geo_higgsfield_ai_mcp` — don't try to call the API by hand.

## When NOT to use this skill

- **Pure CSS / SVG / typographic scenes** — HyperFrames handles those natively and faster. Don't burn Higgsfield credits on a wordmark animation.
- **A whole RHYTHMIX video** — invoke `rhythmix-author` first. That skill owns brand identity, scene structure, and TTS. This skill is for the *imagery layer* inside that flow.
- **Editing existing footage** — Higgsfield generates, it doesn't edit. For trims/joins use ffmpeg or CapCut.

## Project layout

Place Higgsfield outputs alongside the HyperFrames composition that consumes
them:

```
<project-slug>/
├── index.html
├── meta.json
├── DESIGN.md
├── narration.wav          # from rhythmix-author / hyperframes tts
└── assets/
    └── higgsfield/
        ├── PLAN.md         # the shot plan written in Step 1
        ├── jobs.json       # {shot_id, job_set_id, kind, status, urls} — the polling ledger
        ├── characters.json # {name, reference_id, status} — character refs
        ├── shot-01-hero.png
        ├── shot-02-hero-motion.mp4
        ├── shot-03-talking-head.mp4
        └── …
```

The `jobs.json` and `characters.json` files are the source of truth for what's
in flight. Always update them after each generate / poll call. They survive a
session reset and let a later session resume polling without re-launching jobs.

## Workflow

### Step 1 — Write `assets/higgsfield/PLAN.md`

Before any generation, write a one-page shot plan. For each shot:

| Field | Example |
|---|---|
| `shot_id` | `shot-01-hero` |
| `kind` | one of `still`, `animated-still`, `morph`, `talking-head` |
| `scene` | which composition beat it feeds (e.g. "Scene 1 HOOK reveal at 0:03") |
| `prompt` | the Soul / DOP prompt — written in full, not "TBD" |
| `aspect` | `1920x1080`, `1080x1920`, `1080x1080` (must match composition `meta.json`) |
| `character_ref` | UUID if reusing a character, or `null` |
| `motion_preset` | DOP motion UUID (look up via `get_motions`) or `null` |
| `quality` | `720p` (default) or `1080p` |
| `notes` | any constraint — "must crop to safe area", "needs alpha", "loops cleanly" |

**Gate:** PLAN.md exists with one row per shot. Confirm the plan with the user
before calling any generation tools — credits are real.

### Step 2 — Register characters (if any shot has a `character_ref`)

Character refs MUST be `completed` before they can be used in Soul prompts. They
take 30-90 seconds.

1. Call `create_character` with `name` + `image_urls` (1-100 reference photos).
2. Append `{name, reference_id, status: "processing"}` to `characters.json`.
3. Poll `get_character` every ~10s until status is `completed`. Don't busy-wait
   in one Bash call — use a short polling loop or just wait between tool calls.
4. Update `characters.json` with the final status.

If a character fails, surface the error to the user before falling back —
sometimes the issue is bad reference photos and the user can re-supply.

### Step 3 — Generate stills (Soul)

For each `still` and `animated-still` shot in PLAN.md, call
`generate_image_soul` with:

```json
{
  "prompt": "<from PLAN.md>",
  "width_and_height": "<from PLAN.md aspect>",
  "quality": "<from PLAN.md quality>",
  "enhance_prompt": true,
  "custom_reference_id": "<character_ref or omitted>",
  "custom_reference_strength": 0.8,
  "seed": <stable integer if reproducibility matters>
}
```

The response is a job set. Append to `jobs.json`:
```json
{
  "shot_id": "shot-01-hero",
  "job_set_id": "<uuid>",
  "kind": "soul",
  "status": "queued",
  "submitted_at": "<iso8601>",
  "result_urls": []
}
```

**Do not** loop over `get_job_status` synchronously inside a tool call —
Higgsfield jobs are async. Submit all stills, then poll.

### Step 4 — Generate clips (DOP)

For `animated-still` and `morph` shots, you need the source still on a public
URL first. Two options:

- **Use the URL Higgsfield returns from Step 3** — easiest; the result URL is
  publicly fetchable for the job's lifetime.
- **Upload your own image** to a public host (S3, R2, github raw, etc.).

Then call `generate_video_dop`:

```json
{
  "input_image_url": "<URL of the start frame>",
  "input_image_end_url": "<optional URL of the end frame, for morphs>",
  "prompt": "<from PLAN.md — describe the motion, not the subject>",
  "motions": [{"id": "<motion_preset>", "strength": 0.6}],
  "enhance_prompt": true,
  "model": "dop-turbo"
}
```

Update `jobs.json` the same way as Step 3.

**Prompt tip:** DOP prompts describe what *happens*, not what *is*. Good:
"camera slowly dollies forward as the figure exhales". Bad: "a woman standing
in a field".

### Step 5 — Generate talking heads (Speech-to-Video)

For each `talking-head` shot, call `generate_speech_video` with either:
- `prompt` (text to be spoken) — server runs TTS internally, OR
- `input_audio_url` — bring your own audio (e.g. an existing ElevenLabs clip)

Plus `input_image_url` for the face. Append to `jobs.json` with `kind: "speech"`.

### Step 6 — Poll until all jobs are done

For each entry in `jobs.json` with `status != "completed"`, call
`get_job_status` with the `job_set_id`. Update the row with the new status and,
when complete, the `result_urls`.

Status meanings:
- `queued` — not started, keep waiting
- `in_progress` — keep waiting
- `completed` — pull `result_urls`, move on
- `failed` — surface the error to the user; do NOT auto-retry (might be a prompt issue)
- `nsfw` — content filter tripped; surface and ask the user to rewrite the prompt

Typical job times:
- Soul 720p: 15-30s
- Soul 1080p batch=4: 60-90s
- DOP 5s clip: 60-120s
- Speech-to-Video: 30-90s

Polling cadence: every 10-15s is plenty. Don't hammer the API.

### Step 7 — Download to `assets/higgsfield/`

For each completed job, fetch the result URL(s) and save under
`assets/higgsfield/<shot_id>.<ext>`:

```bash
curl -sL "<result_url>" -o "<project>/assets/higgsfield/<shot_id>.png"
# or .mp4 for DOP / speech
```

Verify the file exists and is non-empty before declaring the shot ready.

### Step 8 — Wire into the HyperFrames composition

Now hand back to the `hyperframes` (or `rhythmix-author`) skill. The assets are
local files referenced from `index.html`:

```html
<!-- Still -->
<div class="clip" data-track-index="2" data-start="3.0" data-end="6.0">
  <img src="assets/higgsfield/shot-01-hero.png" />
</div>

<!-- DOP clip -->
<div class="clip" data-track-index="2" data-start="6.0" data-end="11.0">
  <video src="assets/higgsfield/shot-02-hero-motion.mp4" autoplay muted></video>
</div>
```

Important:
- HyperFrames `<video>` clips must not have `controls` (would show UI in the render).
- DOP outputs are typically ~5s. If you need longer hold time, render the last
  frame to PNG and follow the video with a still on the same track.
- DOP outputs do not loop cleanly by default. If you need a loop, prefer a
  Soul still with CSS animation, or use `motions` whose preset is loopable.
- Combine Higgsfield clips with HyperFrames' typography, captions, and
  audio-reactive overlays — do **not** burn DOP credits to add text on top
  of an image. HyperFrames does that better and free.

### Step 9 — Lint, validate, render

Same as the standard HyperFrames flow:

```bash
npx --yes hyperframes@0.4.42 lint
npx --yes hyperframes@0.4.42 validate
npx --yes hyperframes@0.4.42 render --quality standard --output <project>.mp4
```

Validate warnings about contrast on faded scene text are usually false
positives during transitions — verify each one falls inside a fade window.

## Tool reference

See [references/higgsfield-tools.md](references/higgsfield-tools.md) for full
parameter tables and copy-pasteable call examples for every Higgsfield tool.

## Quick decision table

| User wants… | Use | Skill chain |
|---|---|---|
| A photorealistic hero still for a RHYTHMIX scene | `generate_image_soul` | `rhythmix-author` → this skill → `hyperframes` |
| Same face appearing in 5 scenes | `create_character` + `generate_image_soul` × 5 with `custom_reference_id` | this skill |
| A still that gently animates for 5s | Soul → DOP | this skill |
| Morph from product A to product B | Soul (×2) → DOP with `input_image_end_url` | this skill |
| Spokesperson saying narration | `generate_speech_video` | this skill (replaces TTS layer for that shot) |
| Pure typography animation | None — use HyperFrames natively | `hyperframes` only |
| Edit existing footage | None — Higgsfield doesn't edit | ffmpeg / CapCut |

## Cost discipline

Higgsfield bills per generation. Defaults:

- Always confirm the shot count with the user before Step 3.
- Default to `quality: "720p"` and `batch_size: 1`. Only go 1080p / batch=4 for
  finalist shots after a 720p preview has been approved.
- Reuse `seed` values when iterating on the same shot. Changing seed = new
  composition = new credits.
- If a generation fails with `nsfw` or `failed`, surface to the user. Don't
  auto-retry with prompt tweaks unless the user says so.
