# RHYTHMIX Studio

Phase 1 — engine. Turn a track into a cinematic AI music video by routing scenes
across multiple Replicate models (Kling, Hunyuan, Luma Ray, MiniMax), snapping
cuts to the beat, and stitching the result with ffmpeg.

This is the **CLI engine** that the future RHYTHMIX Studio web app will wrap.

## Status

- [x] CLI scaffold with `plan` / `render` / `render-from-plan` commands
- [x] ffprobe-based audio analyzer
- [x] Auto-BPM (aubio/bpm-tools) + loudness-driven section detection
- [x] Beat-snapping from auto-detected or user-supplied BPM
- [x] Rule-based scene planner with role routing (intro / verse / chorus / bridge / outro)
- [x] **Story mode** — 7-beat narrative arc layered onto audio structure, default ON
- [x] **Multi-aspect render** — `--aspects 16:9,9:16,1:1` produces all three from one job
- [x] **Character consistency** — `--reference-image <url>` passed to Kling as start_image
- [x] Crossfade transitions (0.25s xfade, with concat fallback for short clips)
- [x] Model registry: hunyuan-video, kling-v2, luma-ray, minimax-video
- [x] Replicate runner with prediction polling + bounded retries with checkpointing
- [x] ffmpeg compositor (per-scene trim, concat, audio mux)
- [x] Dry-run cost estimator
- [ ] LLM-based scene planner from lyrics + theme (next)
- [ ] Asset pack (cover art + Spotify Canvas + IG cover from same job)
- [ ] Whisper-based caption overlay (karaoke-style, beat-perfect)
- [ ] Lip-sync for vocal sections
- [ ] Stem-separated visual layers (Demucs → kick drives camera, vocal drives motion)
- [ ] Web app wrapper (Phase 2)

## Requirements

- Node 20+
- `ffmpeg` and `ffprobe` on PATH
- Optional: `aubio` for auto-BPM detection (`brew install aubio` / `apt install aubio-tools`)
- A Replicate API token (paid mode): https://replicate.com/account/api-tokens
- Or a free Pexels API key (free mode): https://www.pexels.com/api/

## No computer? Run it in your browser via GitHub Codespaces

iPad-only or Chromebook? You can render videos directly in the browser:

1. Open this repo in Safari/Chrome
2. Tap **Code → Codespaces → Create codespace on main**
3. Wait ~1 min for the environment to build
4. In the terminal, run: `bash rhythmix-studio/demo.sh`
5. Download `rhythmix-out/demo/final.mp4` from the file tree

Free for 60 hours/month on any GitHub account. The `.devcontainer/`
config pre-installs Node, ffmpeg, and aubio.

## Quickstart

```bash
cd rhythmix-studio

# Plan only (no API calls, no cost):
node bin/rhythmix-studio.mjs plan ../voiceover-adam.wav \
  --theme "neon-soaked midnight city, lone musician on rooftop" \
  --bpm 120 \
  --dry-run

# Render for real (calls Replicate, costs money):
export REPLICATE_API_TOKEN=r8_...
node bin/rhythmix-studio.mjs render ../my-track.mp3 \
  --theme "underwater cathedral, bioluminescent fish, gothic" \
  --bpm 92 \
  --aspect 16:9 \
  --concurrency 3
```

Output lands in `./rhythmix-out/<track-name>/`:
- `plan.json` — the scene plan
- `scenes/scene-XXX-<model>.mp4` — raw clips from each model
- `work/` — intermediate ffmpeg artifacts
- `final.mp4` — the finished video

## Commands

| Command | What it does |
|---|---|
| `plan <track>` | Analyze track, build scene plan, save `plan.json`. Use `--dry-run` to skip generation. |
| `render <track>` | Plan + generate scenes + compose final video. |
| `render-from-plan <plan.json>` | Skip planning, render from a saved/edited plan. Useful for iterating on prompts without re-planning. |

## Options

| Flag | Default | Notes |
|---|---|---|
| `--theme <text>` | required | Visual concept; gets interpolated into prompt recipes per scene role. |
| `--bpm <n>` | auto-detected | If set, overrides auto-detection. Scene cuts snap to nearest beat. |
| `--aspect <ratio>` | `16:9` | Also `9:16`, `1:1`. |
| `--aspects <list>` | none | Comma-separated multi-aspect render: `"16:9,9:16,1:1"` produces all three from one job. Overrides `--aspect`. |
| `--model <name>` | auto-routed | Force a single model: `hunyuan-video`, `kling-v2`, `luma-ray`, `minimax-video`. |
| `--reference-image <url>` | none | Subject image. Kling v2 uses it as start_image for character consistency across scenes. |
| `--no-story-mode` | off | Disable narrative-arc preamble on prompts. Default ON. |
| `--no-transitions` | off | Disable crossfade — hard cuts only. |
| `--out <dir>` | `./rhythmix-out/<name>` | Output directory. |
| `--concurrency <n>` | `2` | Parallel scene generations. |
| `--dry-run` | off | Plan + cost estimate only. |

## Architecture

```
audio file ──▶ probeAudio (ffprobe) ──▶ duration, sample-rate
                                          │
              theme + bpm  ─────────────▶ buildPlan
                                          │  (split into sections,
                                          │   route each section to a model,
                                          │   snap clip boundaries to beats,
                                          │   interpolate prompt recipes)
                                          ▼
                                       plan.json   ◀── editable
                                          │
                                          ▼
              REPLICATE_API_TOKEN  ─▶  generateAll
                                          │  (per-scene parallel calls,
                                          │   download MP4s)
                                          ▼
                                       scenes/*.mp4
                                          │
                                          ▼
                                       compose (ffmpeg)
                                          │  (trim each clip to exact
                                          │   beat-aligned duration,
                                          │   concat, mux audio)
                                          ▼
                                       final.mp4
```

## Cost notes

Estimates in `models.mjs` are approximate (USD per clip, 2026 pricing). A 60s
video typically uses 12–18 clips → roughly **$8–25 per video** depending on
which models the planner routes to. Always run `--dry-run` first.

## Editing a plan

After `plan` you can hand-edit `plan.json` — change prompts, swap models,
adjust durations — then run `render-from-plan plan.json` to render the edits.
This is the fastest iteration loop; you don't pay for re-planning, only for
generation.

## Extending

- **Add a model** → edit `src/models.mjs`, add an entry with `replicateId`,
  `maxClipSeconds`, `estimatedUsdPerClip`, `buildInput`. Update `pickModel`
  routing if you want it auto-selected.
- **New prompt recipes** → edit `PROMPT_RECIPES` in `src/plan.mjs`.
- **Custom song structure** → pass a `structure` array to `buildPlan` (CLI flag
  not yet wired; for now edit `plan.json` after running `plan`).
