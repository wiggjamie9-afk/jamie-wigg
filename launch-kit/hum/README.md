# HUM — launch kit

Everything to launch HUM (the AU$30 lifetime humming app at `rhythmixapp.com.au/hum.html`) across social, Gumroad, and the landing site. Organised by surface.

## What's rendered

| Surface | Format | Where |
|---|---|---|
| 7 brand visuals | PNG | `visuals/` |
| 2× 3-second teasers | MP4 (1080×1920, 30fps, H.264) | `clips-3s/` |
| 2× 1-minute clips | HTML compositions (see "Render the 60s clips" below) | `clips-60s/<name>/index.html` |
| Description pack | Markdown | `copy/description.md` |
| Hashtag + SEO pack | Markdown | `copy/hashtags.md` |
| Origins explainer | Markdown | `copy/origins-explainer.md` |

## The 7 visuals (`visuals/`)

| File | Dimensions | Surface |
|---|---|---|
| `01-hero-cover.png` | 1280×720 | og:image, YouTube thumbnail, landing-page hero |
| `02-what-is-hum.png` | 1080×1080 | Instagram feed — "What is HUM?" |
| `03-how-to-use.png` | 1080×1080 | Instagram feed — 4-step usage |
| `04-good-for.png` | 1080×1080 | Instagram feed — benefits |
| `05-origins.png` | 1080×1080 | Instagram feed — Bhramari → vagus → 15× NO timeline |
| `06-fun-bee.png` | 1080×1080 | Fun — bee-breath illustration |
| `07-fun-frequency.png` | 1080×1080 | Fun — 130/174/220 Hz waveform stack |

Sources live in `visuals-src/` as self-contained HTML files. Re-render with the snippet under [Re-render anything](#re-render-anything).

## The 2 short clips (`clips-3s/`)

| File | Length | Surface |
|---|---|---|
| `01-hook-tease.mp4` | 3 s | TikTok / Reels / Shorts hook — dot → helix → "Coherence." |
| `02-price-tease.mp4` | 3 s | Closing teaser — HUM + AU$30 + "Begin." |

Sources in `clips-3s-src/` use a `?frame=N` query-param driver (0–89 at 30fps) so each frame is deterministic. Rendered with Chromium frame-by-frame + ffmpeg-assembled into H.264 yuv420p MP4 (plays on iPhone, Twitter, TikTok, etc.).

## The 2 long clips (`clips-60s/`)

| Path | Length | Format | Aspect |
|---|---|---|---|
| `clips-60s/howto/index.html` | 60 s | HTML composition | 1080×1920 vertical |
| `clips-60s/origins/index.html` | 60 s | HTML composition | 1080×1920 vertical |

These are **not yet rendered to MP4**. The HTML files auto-play in a browser — open them on iPhone Safari, tap once to enable the Web Speech narration, and the animation runs end-to-end. They're set up to be rendered through your existing launch pipeline (the same flow as `rhythmix-launch-60s/`):

Each folder ships with:
- `index.html` — the deterministic CSS-timeline composition.
- `narration-script.md` — second-by-second VO script (target voice: Charlotte / ElevenLabs).
- `storyboard.md` — scene-by-scene breakdown.

### Render the 60s clips

Option 1 — use your iPhone pipeline (same as previous launch videos): generate the ElevenLabs narration MP3 from `narration-script.md`, then run the HTML through your HyperFrames render flow to bake the audio.

Option 2 — render locally with Chromium + ffmpeg (no audio):
```bash
# This file ships with /opt/pw-browsers/chromium-1194 on the Claude Code env.
CHROME=/opt/pw-browsers/chromium-1194/chrome-linux/chrome
cd launch-kit/hum
mkdir -p /tmp/howto-frames
# 1800 frames at 30fps. ~10–15 min on this container.
for n in $(seq 0 1799); do
  t=$(printf "%05d" $n)
  $CHROME --headless=new --disable-gpu --no-sandbox --hide-scrollbars \
    --window-size=1080,1920 \
    --virtual-time-budget=$((n * 1000 / 30)) \
    --screenshot=/tmp/howto-frames/f$t.png \
    "file://$PWD/clips-60s/howto/index.html"
done
ffmpeg -framerate 30 -i /tmp/howto-frames/f%05d.png \
  -c:v libx264 -pix_fmt yuv420p -crf 18 -movflags +faststart \
  clips-60s/howto.mp4
```

## Copy (`copy/`)

- `description.md` — 8 surface variants from a one-liner up to a press blurb and full ~1200-word Gumroad pitch.
- `hashtags.md` — SEO keywords, IG / TikTok / YouTube / LinkedIn / X hashtag stacks, brand-owned tags.
- `origins-explainer.md` — standalone ~875-word piece on Bhramari → vagus → nitric oxide, written to double as VO source for the origins clip.

## Brand source of truth

`BRAND.md` — palette, typography, motion, dimensions. Don't drift; any new composition should read this first.

## Fonts

`fonts/` ships the self-hosted woff2 files for Cormorant Garamond, Inter, and JetBrains Mono (all referenced via `fonts/fonts.css`). The container blocks Chromium's path to Google Fonts in some renders, so every composition in this kit links to the local CSS instead. ~600 KB total.

## Re-render anything

```bash
# Start a tiny static server (run from the repo root):
python3 -m http.server 8765 --bind 127.0.0.1 &

CHROME=/opt/pw-browsers/chromium-1194/chrome-linux/chrome
COMMON="--headless=new --disable-gpu --no-sandbox --hide-scrollbars --virtual-time-budget=4000"

# Single image
$CHROME $COMMON --window-size=1080,1080 \
  --screenshot=launch-kit/hum/visuals/02-what-is-hum.png \
  "http://127.0.0.1:8765/launch-kit/hum/visuals-src/02-what-is-hum.html"
```
