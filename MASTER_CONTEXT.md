# Master context — jamie-wigg / RHYTHMIX promo workspace

**Purpose:** One place for humans and AI agents to capture **decisions**, **brand voice**, **rendering quirks**, and **what we learned** while producing RHYTHMIX promo videos in this repo.

This file is the agent's first stop on substantive work. Keep it small, current, and specific.

## How agents should use this file

- **At the start of substantive work:** read this file before reaching for skills or tools.
- **After meaningful changes** (new cut, new voiceover route, new render pipeline learning, brand update): append a dated entry under [Changelog](#changelog).
- **If a section is empty:** ask the user once and write the answer back here.

## Repo at a glance

- **Product being marketed:** RHYTHMIX — AI music platform (landing-page drafts in `text.txt`, `text 2.txt`, `text 3.txt`).
- **Output:** short-form promo videos for TikTok / Reels / Shorts / FB Stories / YouTube. Catalogued in `README.md` and `VIDEOS.md`.
- **Source compositions:** HyperFrames HTML in `rhythmix-*/` folders at the repo root. Remotion starter lives in `video/` but is currently a placeholder.
- **Voiceovers:** AI-generated WAVs (`voiceover-{adam,michael,emma,nova}.wav`) muxed into per-voice cuts. Script: `voiceover-script.txt`, scene-by-scene timing in `SCRIPT.md`.
- **Rendered output:** committed under `videos/` (mp4). `rhythmix-*/` folders are HyperFrames sources only.

## Brand voice — RHYTHMIX

- **Tone:** confident, modern, creator-first. Short sentences. No hype words like "revolutionize" or "game-changing".
- **Audience:** independent music creators, beatmakers, producers comparing tools like Suno / Udio / LANDR.
- **Words to use:** waitlist, creators, AI music, samples, stems, drop, ship.
- **Words to avoid:** fake metrics ("4,800+ creators", "3.2M samples"), invented testimonials, the `$149` lifetime pricing — these are unverified landing-page draft copy and **must not be re-published as fact**. README.md flags this in its first warning.

## Publishing safety rules (READ BEFORE RENDERING)

From `README.md`'s top warning:

- The **only** cut currently safe to publish is the **`teaser-coming-soon`** family (60s + 32s) — pure brand reveal, "join the waitlist", no claims.
- The promo cuts (`tiktok-reels-shorts.mp4`, `instagram-facebook.mp4`, `youtube.mp4`) embed unverified metrics and a `$149` lifetime offer pointing at a domain that may not exist. Do **not** publish without replacing those numbers and pricing with substantiated copy.
- When extending or recutting any video, preserve this distinction: brand-reveal cuts get the safe label, anything with stats/testimonials/pricing gets the warning label.

## Render specs

| Cut | Source | Aspect | Resolution | Duration |
|---|---|---|---|---|
| Teaser 32s | `rhythmix-teaser/` | 9:16 | 1080×1920 | 32s |
| Teaser 60s | `rhythmix-teaser-60s/` | 9:16 | 1080×1920 | 60s |
| Vertical promo | `rhythmix-vertical/` | 9:16 | 1080×1920 | 32s |
| Square promo | `rhythmix-square/` | 1:1 | 1080×1080 | 32s |
| YouTube promo | `rhythmix-32s/` | 16:9 | 1920×1080 | 32s |
| Freebeat ad | `rhythmix-freebeat-ad/` | _(see folder)_ | _(see folder)_ | _(see folder)_ |
| RHYTHMIX promo | `rhythmix-promo/` | _(see folder)_ | _(see folder)_ | _(see folder)_ |

Update this table when adding new cuts.

## Voiceover routing

- **Available voices** (committed WAVs at repo root): Nova (US 🇺🇸 female, warm/modern), Adam (US 🇺🇸 male, confident/friendly), Michael (US 🇺🇸 male, deeper/measured), Emma (UK 🇬🇧 female, crisp British).
- **Mux pattern:** keep the silent master cut (`teaser-coming-soon-60s.mp4`) and produce one `-{voice}.mp4` variant per voice with the audio muxed in.
- **Script of record:** `SCRIPT.md` (timed scene-by-scene). Update both `SCRIPT.md` and `voiceover-script.txt` if the copy changes.
- **TTS provider, model, default voice settings:** _(fill in next time you regenerate a voiceover — provider name, model, stability/similarity values, sample rate)._

## Tooling

- **HyperFrames CLI** (HTML video compositions, captions, audio-reactive visuals, scene transitions). Skill: `.claude/skills/hyperframes-cli/`. Use this for new cuts.
- **Remotion** (`video/`) — Remotion 4 + React 19 + Tailwind v4 starter. Currently `MyComposition` returns `null`. Use only when an HTML composition can't express what's needed.
- **Skills source-of-truth:** `.agents/skills/<name>/`. `.claude/skills/<name>/` is mostly symlinks. `skills-lock.json` records upstream commit hashes from `heygen-com/hyperframes` — do not hand-edit synced skills.

## Workspace defaults

- **Default render target for new social cuts:** 9:16 1080×1920 H.264 (matches the safe teaser family).
- **Default voice for new AI voiceover cuts:** _(fill in — Nova? Adam?)_.
- **Default project folder name when generating multi-asset batches:** _(fill in)_.

## Credit costs / API costs

This repo doesn't currently call paid APIs at the root level. If a TTS or video-generation API is wired up later, fill in the table:

| Service | Unit | Cost per unit | Notes |
|---|---|---|---|
| _(e.g. ElevenLabs TTS)_ | char | _(fill in)_ | per-voice multipliers? |
| _(e.g. Remotion Lambda render)_ | minute | _(fill in)_ | |

## API / pipeline learnings

Confirmed quirks discovered while working in this repo. Append, don't rewrite.

- _(empty — add entries here as you learn things, e.g. "muxing AAC at 192kbps onto 1080×1920 H.264 with ffmpeg's `-c:v copy -c:a aac -shortest` keeps the master video stream untouched and trims to the audio length")._

## Changelog

Append a dated entry after meaningful changes. Format:

```
### YYYY-MM-DD — short title
- **Decision:** what we decided.
- **What changed:** files / cuts / settings touched.
- **Why:** the reason, briefly.
```

### 2026-05-05 — initial MASTER_CONTEXT
- **Decision:** stand up `MASTER_CONTEXT.md` and `scripts/setup.sh` for this workspace; do **not** install the upstream Arcads skill pack scaffold (this repo is video production, not Arcads API usage).
- **What changed:** added `MASTER_CONTEXT.md` (this file) and `scripts/setup.sh`.
- **Why:** the project context loader (`/context`) expects `MASTER_CONTEXT.md` and `./scripts/setup.sh` to exist; tailoring them to RHYTHMIX/Remotion/HyperFrames matches what's actually in the repo.
