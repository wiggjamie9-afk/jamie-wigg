# RHYTHMIX LIVE — launch kit

Everything to launch RHYTHMIX LIVE (the beat-synced AI music-video co-pilot for indie artists, $19/mo Pro / $49/mo Studio) across social, Gumroad, and the landing site. Organised by surface.

The pitch in one line: **made the song with Suno — now make the moment.** Drop the track, pick a mood-board, get three deliverables in one pass — 60s vertical, 15s square, 4min landscape — every cut beat-locked to the waveform by Kling 2.6. Then drop merch through Fourthwall, one click.

## What's rendered

| Surface | Format | Where |
|---|---|---|
| 7 brand visuals | PNG | `visuals/` |
| 1 video poster | PNG | `thumbnails/` |
| 2× 3-second teasers | MP4 (1080×1920, 30fps, H.264) | `clips-3s/` |
| 2× 30-second pitches | MP4 (1080×1920, 30fps) | `clips-30s/` |
| 2× 1-minute clips | HTML compositions (see "Render the 60s clips") | `clips-60s/<name>/index.html` |
| Description pack | Markdown | `copy/description.md` |
| Hashtag + SEO pack | Markdown | `copy/hashtags.md` |
| Pipeline explainer | Markdown | `copy/pipeline-explainer.md` |
| Gumroad listing | Markdown | `gumroad-listing.md` |

## The 7 visuals (`visuals/`)

| File | Dimensions | Surface |
|---|---|---|
| `01-hero-cover.png` | 1280×720 | og:image, YouTube thumbnail, landing-page hero |
| `02-what-is-live.png` | 1080×1080 | Instagram feed — "What is RHYTHMIX LIVE?" |
| `03-three-formats.png` | 1080×1080 | Instagram feed — 9:16 / 1:1 / 16:9 triptych |
| `04-the-pipeline.png` | 1080×1080 | Instagram feed — Track → Kling 2.6 → 3 cuts |
| `05-fourthwall-merch.png` | 1080×1080 | Instagram feed — release + merch drop |
| `06-vs-static.png` | 1080×1080 | LinkedIn / X — 4-column competitor table |
| `07-beat-sync-anim.png` | 1080×1080 | Fun — waveform + cut markers visual |

Sources live in `visuals-src/` as self-contained HTML files. Re-render with the snippet under [Re-render anything](#re-render-anything).

## The video poster (`thumbnails/`)

| File | Dimensions | Surface |
|---|---|---|
| `poster.png` | 1080×1920 | Video first-frame for Reels/TikTok previews and `<video poster=...>` |

Source: `thumbnails-src/poster.html`.

## The 2 short clips (`clips-3s/`)

| File | Length | Surface |
|---|---|---|
| `01-hook.mp4` | 3 s | TikTok / Reels / Shorts hook — waveform punch + "LIVE." |
| `02-price.mp4` | 3 s | Closing teaser — RHYTHMIX LIVE + $19/mo + "Now what?" |

Sources in `clips-3s-src/` use a `?frame=N` query-param driver (0–89 at 30fps) so each frame is deterministic. Rendered with Chromium frame-by-frame + ffmpeg-assembled into H.264 yuv420p MP4 (plays on iPhone, Twitter, TikTok, etc.).

## The 2 thirty-second clips (`clips-30s/`)

| File | Length | Surface |
|---|---|---|
| `01-pitch.mp4` | 30 s | Mid-funnel TikTok / Reels — full pitch in 30 |
| `02-pipeline.mp4` | 30 s | Alt cut — track → 3 cuts → merch flow |

Sources in `clips-30s-src/` use a `?frame=N` driver (0–899 at 30fps), five-scene CSS-variable timeline `--s1..--s5`.

## The 2 long clips (`clips-60s/`)

| Path | Length | Format | Aspect |
|---|---|---|---|
| `clips-60s/pitch/index.html` | 60 s | HTML composition | 1080×1920 vertical |
| `clips-60s/pipeline/index.html` | 60 s | HTML composition | 1080×1920 vertical |

Each folder ships with:
- `index.html` — deterministic CSS-timeline composition.
- `narration-script.md` — second-by-second VO script (target voice: Adam / ElevenLabs).
- `storyboard.md` — scene-by-scene breakdown.

### Render the 60s clips

Option 1 — use the iPhone pipeline (same as previous RHYTHMIX videos): generate the ElevenLabs narration MP3 from `narration-script.md` (Adam, 175 wpm), then run the HTML through HyperFrames render flow to bake the audio.

Option 2 — render locally with Chromium + ffmpeg (no audio):
```bash
CHROME=/opt/pw-browsers/chromium-1194/chrome-linux/chrome
cd launch-kit/live
mkdir -p /tmp/pitch-frames
# 1800 frames at 30fps. ~10–15 min on this container.
for n in $(seq 0 1799); do
  t=$(printf "%05d" $n)
  $CHROME --headless=new --disable-gpu --no-sandbox --hide-scrollbars \
    --window-size=1080,1920 \
    --virtual-time-budget=$((n * 1000 / 30)) \
    --screenshot=/tmp/pitch-frames/f$t.png \
    "file://$PWD/clips-60s/pitch/index.html"
done
ffmpeg -framerate 30 -i /tmp/pitch-frames/f%05d.png \
  -c:v libx264 -pix_fmt yuv420p -crf 18 -movflags +faststart \
  clips-60s/pitch.mp4
```

### Render the 30s clips

```bash
CHROME=/opt/pw-browsers/chromium-1194/chrome-linux/chrome
cd launch-kit/live
mkdir -p /tmp/pitch30-frames
# 900 frames @ 30fps.
for n in $(seq 0 899); do
  t=$(printf "%05d" $n)
  $CHROME --headless=new --disable-gpu --no-sandbox --hide-scrollbars \
    --window-size=1080,1920 \
    --screenshot=/tmp/pitch30-frames/f$t.png \
    "file://$PWD/clips-30s-src/01-pitch.html?frame=$n"
done
ffmpeg -framerate 30 -i /tmp/pitch30-frames/f%05d.png \
  -c:v libx264 -pix_fmt yuv420p -crf 18 -movflags +faststart \
  clips-30s/01-pitch.mp4
```

### Render the 3s clips

Same flow, 90 frames:
```bash
for n in $(seq 0 89); do
  t=$(printf "%05d" $n)
  $CHROME --headless=new --disable-gpu --no-sandbox --hide-scrollbars \
    --window-size=1080,1920 \
    --screenshot=/tmp/hook-frames/f$t.png \
    "file://$PWD/clips-3s-src/01-hook.html?frame=$n"
done
ffmpeg -framerate 30 -i /tmp/hook-frames/f%05d.png \
  -c:v libx264 -pix_fmt yuv420p -crf 18 -movflags +faststart \
  clips-3s/01-hook.mp4
```

## Copy (`copy/`)

- `description.md` — 8 surface variants from one-liner up to ~1,200-word Gumroad pitch.
- `hashtags.md` — SEO keywords, IG / TikTok / YouTube / LinkedIn / X / Pinterest / Threads / FB hashtag stacks, Gumroad tags, brand-owned tags.
- `pipeline-explainer.md` — ~600-word piece on Kling 2.6 beat-sync, why it matters, the three-format render, Fourthwall integration. Doubles as VO source for the pipeline 60s clip.

## Brand source of truth

`BRAND.md` — palette, typography, motion, dimensions, pricing claims. Don't drift. Any new composition reads this first.

## Fonts

`fonts/fonts.css` imports Space Grotesk + JetBrains Mono from Google Fonts. Every composition links to this local CSS rather than directly to Google Fonts, so the rendering container is consistent.

## Re-render anything

```bash
# Start a tiny static server (run from the repo root):
python3 -m http.server 8765 --bind 127.0.0.1 &

CHROME=/opt/pw-browsers/chromium-1194/chrome-linux/chrome
COMMON="--headless=new --disable-gpu --no-sandbox --hide-scrollbars --virtual-time-budget=4000"

# Single image (square)
$CHROME $COMMON --window-size=1080,1080 \
  --screenshot=launch-kit/live/visuals/02-what-is-live.png \
  "http://127.0.0.1:8765/launch-kit/live/visuals-src/02-what-is-live.html"

# Hero (landscape)
$CHROME $COMMON --window-size=1280,720 \
  --screenshot=launch-kit/live/visuals/01-hero-cover.png \
  "http://127.0.0.1:8765/launch-kit/live/visuals-src/01-hero-cover.html"

# Poster (vertical)
$CHROME $COMMON --window-size=1080,1920 \
  --screenshot=launch-kit/live/thumbnails/poster.png \
  "http://127.0.0.1:8765/launch-kit/live/thumbnails-src/poster.html"
```
