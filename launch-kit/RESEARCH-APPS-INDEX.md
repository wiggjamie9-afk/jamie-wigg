# Research-Apps Launch Kit Index

> Date: 2026-05-20 · Branch: `claude/research-emerging-tech-TTjUm`
> Generated from `docs/refs/emerging-tech-2026/` strategy synthesis.

Four product concepts ship-ready with full launch kits. RESONATE is the flagship; HUM, DREAMS, LIVE are the supporting three.

## Quick navigation

| App | Kit | Landing page | Brand | Price |
|---|---|---|---|---|
| **RESONATE** — closed-loop biometric × generative music × spatial audio | [`launch-kit/resonate/`](./resonate/) | [`resonate.html`](../resonate.html) | FREQUENCY (navy/gold/cream) | AU$30 lifetime |
| **FREQUENCY DREAMS** — generative bedtime ritual + dream recall | [`launch-kit/dreams/`](./dreams/) | [`dreams.html`](../dreams.html) | FREQUENCY (darker navy/indigo/pewter) | AU$30 lifetime |
| **RHYTHMIX LIVE** — beat-synced AI music video co-pilot (Kling 2.6) | [`launch-kit/live/`](./live/) | [`live.html`](../live.html) | RHYTHMIX (neon magenta/cyan/green) | Free / $19 Pro / $49 Studio |
| **HUM** — daily humming practice (already partially built) | [`launch-kit/hum/`](./hum/) | [`hum.html`](../hum.html) | HUM (noir/violet/pewter) | AU$30 lifetime |

## What's in each kit

Every kit follows the same template (mirrors `launch-kit/hum/`):

```
launch-kit/<app>/
├── BRAND.md                          # Locked palette, type, motion
├── README.md                         # Surface index + render commands
├── gumroad-listing.md                # Full Gumroad page copy
├── fonts/                            # Local woff2s + fonts.css
├── visuals-src/                      # 7 standalone HTML visuals (source)
├── visuals/                          # Rendered PNGs (1280×720 hero + 6× 1080×1080 squares)
├── thumbnails-src/poster.html        # 1080×1920 vertical video poster (source)
├── thumbnails/poster.png             # Rendered poster
├── clips-3s-src/*.html               # 2× 3s teaser source (?frame=N, 90 frames)
├── clips-3s/*.mp4                    # Rendered teasers
├── clips-30s-src/*.html              # 2× 30s pitch source (?frame=N, 900 frames)
├── clips-30s/*.mp4                   # Rendered 30s
├── clips-60s/<name>/                 # 2× 60s long compositions
│   ├── index.html                    # Time-based CSS-keyframe composition
│   ├── narration-script.md           # Timed VO script (Charlotte/Adam/Emma · ElevenLabs)
│   └── storyboard.md                 # Scene-by-scene
└── copy/
    ├── description.md                # 8 surface variants (one-liner → 1200w long pitch)
    ├── hashtags.md                   # SEO + per-platform hashtag stacks (8 platforms)
    └── <topic>-explainer.md          # 600w piece on the unique science/pipeline
```

## Render status (current container, 2026-05-20)

| Surface | Resonate | Dreams | Live | Hum |
|---|---|---|---|---|
| Visuals (PNG) | ✅ rendered | ✅ rendered | ✅ rendered | ✅ pre-existing |
| Thumbnail (PNG) | ✅ rendered | ✅ rendered | ✅ rendered | ✅ pre-existing |
| 3s teasers (MP4) | 🔄 rendering | 🔄 queued | 🔄 queued | ✅ pre-existing |
| 30s pitches (MP4) | ⏳ pending | ⏳ pending | ⏳ pending | ✅ pre-existing |
| 60s long clips (HTML) | ✅ authored | ✅ authored | ✅ authored | ✅ pre-existing |
| 60s rendered (MP4) | ⏳ render via iPhone pipeline + ElevenLabs | ⏳ same | ⏳ same | ⏳ same |
| Narration MP3s | ❌ needs ElevenLabs API (paste scripts) | ❌ same | ❌ same | partial (3s/30s baked) |
| Description / SEO / Gumroad copy | ✅ complete | ✅ complete | ✅ complete | ✅ complete |
| Landing page (rhythmixapp.com.au) | ✅ resonate.html | ✅ dreams.html | ✅ live.html | ✅ hum.html |

## Render commands (in this container)

### Frame-driven compositions (3s, 30s, posters, visuals)

All 3s and 30s clips use `?frame=N` URL-param-driven CSS variables for deterministic per-frame rendering. Render with:

```bash
# 3s clip (90 frames at 30fps)
/tmp/render-clip.sh launch-kit/<app>/clips-3s-src/<name>.html 90 launch-kit/<app>/clips-3s/<name>.mp4 1080 1920

# 30s clip (900 frames)
/tmp/render-clip.sh launch-kit/<app>/clips-30s-src/<name>.html 900 launch-kit/<app>/clips-30s/<name>.mp4 1080 1920

# Single PNG (visual or thumbnail)
/tmp/render-snapshot.sh <source.html> <output.png> <width> <height>
```

### 60s clips (CSS-keyframe + ElevenLabs narration)

The 60s clips use real-time CSS animation + tap-to-start Web Speech narration. To produce a clean MP4 with ElevenLabs voice:

1. Open the `narration-script.md` for the clip.
2. In ElevenLabs, paste the script. Voice = Charlotte (RESONATE / DREAMS) or Adam (LIVE).
3. Export the MP3.
4. Use the existing iPhone HyperFrames pipeline (same flow as `rhythmix-overview-60s`) to bake the audio onto the video.

Or render silent via the time-based approach (caveat: HUM 60s currently has a tap overlay that blocks headless rendering — needs an `--auto-start` query-param to be added to the composition for clean automated rendering).

## Strategy synthesis

The four apps were derived from a 4-stream deep-dive research bundle. See:

- `docs/refs/emerging-tech-2026/00-strategy.md` — synthesis, with RESONATE 90-day MVP plan
- `docs/refs/emerging-tech-2026/01-biometric-adaptive-media.md` — EEG/HRV/Lyria RealTime
- `docs/refs/emerging-tech-2026/02-spatial-audio-xr.md` — AirPods Pro 3, ASAF, ImmerseDiffusion
- `docs/refs/emerging-tech-2026/03-voice-ai-ambient-capture.md` — voice AI, on-device LLM, Friend.com post-mortem
- `docs/refs/emerging-tech-2026/04-generative-frontier.md` — Genie 3, Marble, Kling 2.6, Veo 3.1

## Ship order

1. **RESONATE** — flagship. 14-day closed-loop spike → 90-day MVP. Test with existing FREQUENCY Gumroad list.
2. **HUM** — already partially built; complete the rendering.
3. **FREQUENCY DREAMS** — Pro tier add-on for FREQUENCY users; ride sleep-economy growth.
4. **RHYTHMIX LIVE** — RHYTHMIX Pro upsell when Kling 2.6 API gets cheaper or self-host becomes viable.
