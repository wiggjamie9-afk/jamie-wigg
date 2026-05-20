# RESONATE — launch kit

Everything to launch RESONATE — the closed-loop biometric music app from the RHYTHMIX FREQUENCY family — across social, Gumroad, and the landing site. Organised by surface, sized for each platform, deterministic per frame.

RESONATE is positioned **under FREQUENCY**: deep navy + gold + cream palette, italic-gold signature word, contemplative tone. It is not HUM (violet) and not RHYTHMIX core (neon). See `BRAND.md`.

## What's rendered (and what isn't yet)

| Surface | Format | Where | Status |
|---|---|---|---|
| 7 brand visuals | PNG | `visuals/` | source HTML in `visuals-src/`, not yet rendered |
| 1 vertical poster | PNG (1080×1920) | `thumbnails/poster.png` | source HTML in `thumbnails-src/poster.html` |
| 2× 3-second teasers | MP4 (1080×1920, 30fps) | `clips-3s/` | source HTML in `clips-3s-src/`, not yet rendered |
| 2× 30-second clips | MP4 (1080×1920, 30fps) | `clips-30s/` | source HTML in `clips-30s-src/`, not yet rendered |
| 2× 60-second long clips | HTML compositions | `clips-60s/<name>/index.html` | live in browser; see render note below |
| Description pack | Markdown | `copy/description.md` | done |
| Hashtag + SEO pack | Markdown | `copy/hashtags.md` | done |
| Science explainer | Markdown | `copy/science-explainer.md` | done |
| Gumroad listing | Markdown | `gumroad-listing.md` | done |

## The 7 visuals (`visuals/`)

| File | Dimensions | Surface |
|---|---|---|
| `01-hero-cover.png` | 1280×720 | og:image, YouTube thumbnail, landing-page hero |
| `02-what-is-resonate.png` | 1080×1080 | Instagram feed — "What is RESONATE?" |
| `03-how-it-works.png` | 1080×1080 | IG feed — the closed-loop diagram |
| `04-three-modes.png` | 1080×1080 | IG feed — Focus / Calm / Rest |
| `05-the-science.png` | 1080×1080 | IG feed — 0.1 Hz coherence + EEG-binaural lineage |
| `06-vs-endel.png` | 1080×1080 | competitive table (5 columns; RESONATE wins all) |
| `07-airpods-illustration.png` | 1080×1080 | AirPods + heart waveform spatial bloom |

Sources live in `visuals-src/` as self-contained HTML files. Re-render with the snippet under [Re-render anything](#re-render-anything).

## The poster (`thumbnails/`)

| File | Dimensions | Surface |
|---|---|---|
| `poster.png` | 1080×1920 | TikTok / Reels / Shorts thumbnail · YouTube Shorts thumb · "open me" frame for the 30s/60s clip uploads |

## The 2 short clips (`clips-3s/`)

| File | Length | Surface |
|---|---|---|
| `01-hook.mp4` | 3 s | TikTok / Reels / Shorts hook — orb pulse → "Resonate." |
| `02-price.mp4` | 3 s | Closing teaser — RESONATE + AU$30 + "Begin." |

Sources in `clips-3s-src/` use a `?frame=N` query-param driver (0–89 at 30fps) so each frame is deterministic.

## The 2 medium clips (`clips-30s/`)

| File | Length | Aspect | Angle |
|---|---|---|---|
| `01-pitch.mp4` | 30 s | 1080×1920 vertical | What it is + one mode |
| `02-science.mp4` | 30 s | 1080×1920 vertical | Why it works (closed-loop + 0.1 Hz) |

Sources in `clips-30s-src/` use `?frame=N` (0–899 at 30fps). 5 scenes × 6 seconds each, CSS variable timeline `--s1..--s5`.

## The 2 long clips (`clips-60s/`)

| Path | Length | Format | Aspect | Angle |
|---|---|---|---|---|
| `clips-60s/pitch/index.html` | 60 s | HTML composition | 1080×1920 vertical | Concept + experience + price |
| `clips-60s/science/index.html` | 60 s | HTML composition | 1080×1920 vertical | Closed loop + coherence + spatial |

These are **not yet rendered to MP4**. The HTML files auto-play in a browser — open them on iPhone Safari, tap once to enable the Web Speech narration, and the animation runs end-to-end.

Each folder ships with:
- `index.html` — the deterministic CSS-timeline composition.
- `narration-script.md` — second-by-second VO script (target voice: Charlotte / ElevenLabs).
- `storyboard.md` — scene-by-scene breakdown.

### Render the 60s clips

Option 1 — use the existing iPhone pipeline (same as HUM and rhythmix-overview-60s): generate the ElevenLabs narration MP3 from `narration-script.md`, then run the HTML through the HyperFrames render flow to bake the audio.

Option 2 — render locally with Chromium + ffmpeg (no audio):
```bash
CHROME=/opt/pw-browsers/chromium-1194/chrome-linux/chrome
cd launch-kit/resonate
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

## Render the deterministic clips (3s and 30s)

Same pattern, different frame budget. For a 30s clip:
```bash
CHROME=/opt/pw-browsers/chromium-1194/chrome-linux/chrome
mkdir -p /tmp/r-pitch-30
for n in $(seq 0 899); do
  t=$(printf "%04d" $n)
  $CHROME --headless=new --disable-gpu --no-sandbox --hide-scrollbars \
    --window-size=1080,1920 \
    --screenshot=/tmp/r-pitch-30/f$t.png \
    "file://$PWD/launch-kit/resonate/clips-30s-src/01-pitch.html?frame=$n"
done
ffmpeg -framerate 30 -i /tmp/r-pitch-30/f%04d.png \
  -c:v libx264 -pix_fmt yuv420p -crf 18 -movflags +faststart \
  launch-kit/resonate/clips-30s/01-pitch.mp4
```

For a 3s clip, swap the loop to `seq 0 89` and the format to `%02d`.

## Copy (`copy/`)

- `description.md` — 8 surface variants from a one-liner up to a press blurb and a full ~1,200-word Gumroad pitch.
- `hashtags.md` — SEO keywords, IG / TikTok / YouTube / LinkedIn / X / Pinterest / Threads / Facebook hashtag stacks, plus Gumroad tags. Brand-owned tags marked.
- `science-explainer.md` — ~600 words on the closed-loop mechanism, 0.1 Hz cardiac coherence, and the EEG-binaural literature. Citation-honest. Doubles as VO source for the science clip.

## Gumroad listing

`gumroad-listing.md` — copy-paste sections for the product name, summary, price, full description (markdown), tags, after-purchase message, and refund policy.

## Brand source of truth

`BRAND.md` — palette, typography, motion, dimensions, disclaimer. Any new composition reads this first.

## Fonts

`fonts/` is a symlink to `../hum/fonts` — same self-hosted woff2 files for Cormorant Garamond, Inter, and JetBrains Mono. Reuse to keep the kit lean (~600 KB).

## Re-render anything

```bash
# Start a tiny static server (run from the repo root):
python3 -m http.server 8765 --bind 127.0.0.1 &

CHROME=/opt/pw-browsers/chromium-1194/chrome-linux/chrome
COMMON="--headless=new --disable-gpu --no-sandbox --hide-scrollbars --virtual-time-budget=4000"

# Single image
$CHROME $COMMON --window-size=1080,1080 \
  --screenshot=launch-kit/resonate/visuals/02-what-is-resonate.png \
  "http://127.0.0.1:8765/launch-kit/resonate/visuals-src/02-what-is-resonate.html"
```
