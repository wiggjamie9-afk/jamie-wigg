# FREQUENCY DREAMS — launch kit

Everything to launch FREQUENCY DREAMS (the AU$30 lifetime nightly ritual app at `rhythmixapp.com.au/dreams`) across social, Gumroad, and the landing site. Organised by surface. Follows the `launch-kit/hum/` template file-for-file with a different brand identity (DREAMS sits under FREQUENCY — deep navy/gold inherited, pushed darker toward indigo + pewter for sleep aesthetic).

## What's rendered

| Surface | Format | Where |
|---|---|---|
| 7 brand visuals | PNG | `visuals/` |
| 1 vertical video poster | PNG (1080×1920) | `thumbnails/` |
| 2× 3-second teasers | MP4 (1080×1920, 30fps, H.264) | `clips-3s/` |
| 2× 30-second clips | MP4 (1080×1920, 30fps, H.264) | `clips-30s/` |
| 2× 1-minute clips | HTML compositions (see "Render the 60s clips" below) | `clips-60s/<name>/index.html` |
| Description pack | Markdown | `copy/description.md` |
| Hashtag + SEO pack | Markdown | `copy/hashtags.md` |
| Ritual explainer | Markdown | `copy/ritual-explainer.md` |
| Gumroad listing | Markdown | `gumroad-listing.md` |

## The 7 visuals (`visuals/`)

| File | Dimensions | Surface |
|---|---|---|
| `01-hero-cover.png` | 1280×720 | og:image, YouTube thumbnail, landing-page hero, Gumroad header |
| `02-what-is-dreams.png` | 1080×1080 | Instagram feed — "What is DREAMS?" |
| `03-the-ritual.png` | 1080×1080 | Instagram feed — the four-layer ritual diagram |
| `04-bedside-flow.png` | 1080×1080 | Instagram feed — bedside → soundscape → breath → landscape → wake |
| `05-the-science.png` | 1080×1080 | Instagram feed — Upanishad → 4-7-8 → cardiac coherence → Marble lineage |
| `06-vs-calm.png` | 1080×1080 | Instagram feed — DREAMS vs Calm vs Headspace vs Endel |
| `07-marble-landscape.png` | 1080×1080 | Hero illustration — the abstract dreamscape (gradient + splat-points) |

Sources live in `visuals-src/` as self-contained HTML files. Re-render with the snippet under [Re-render anything](#re-render-anything).

## The poster (`thumbnails/`)

| File | Dimensions | Surface |
|---|---|---|
| `poster.png` | 1080×1920 | Vertical video poster, story-card hero, Pinterest pin |

Source: `thumbnails-src/poster.html`.

## The 2 short clips (`clips-3s/`)

| File | Length | Surface |
|---|---|---|
| `01-hook.mp4` | 3 s | TikTok / Reels / Shorts hook — moon breathing in → "Drift." |
| `02-price.mp4` | 3 s | Closing teaser — DREAMS + AU$30 + "Begin tonight." |

Sources in `clips-3s-src/` use a `?frame=N` query-param driver (0–89 at 30fps) so each frame is deterministic. Render with Chromium frame-by-frame + ffmpeg → H.264 yuv420p MP4.

## The 2 medium clips (`clips-30s/`)

| File | Length | Surface |
|---|---|---|
| `01-pitch.mp4` | 30 s | Pitch cut — moon → bedside → breath → landscape → end card |
| `02-ritual.mp4` | 30 s | Ritual cut — the four layers as a small enumerated reveal |

Sources in `clips-30s-src/` use a `?frame=N` driver (0–899 at 30fps), with CSS variables `--s1..--s5` set by an inline script that reads the frame parameter and computes 0.8s crossfades around 6-second scene boundaries. Same deterministic pattern as `clips-3s-src/`.

## The 2 long clips (`clips-60s/`)

| Path | Length | Format | Aspect |
|---|---|---|---|
| `clips-60s/pitch/index.html` | 60 s | HTML composition | 1080×1920 vertical |
| `clips-60s/ritual/index.html` | 60 s | HTML composition | 1080×1920 vertical |

These are **not yet rendered to MP4**. The HTML files auto-play in a browser — open them on iPhone Safari, tap once to enable the Web Speech narration, and the animation runs end-to-end. They're set up to be rendered through the existing iPhone pipeline (the same flow as `launch-kit/hum/clips-60s/`).

Each folder ships with:
- `index.html` — the deterministic CSS-timeline composition.
- `narration-script.md` — second-by-second VO script (target voice: Charlotte / ElevenLabs; alternative: Emma UK).
- `storyboard.md` — scene-by-scene breakdown.

### Render the 60s clips

Option 1 — use the iPhone pipeline (same as `launch-kit/hum/clips-60s/`): generate the ElevenLabs narration MP3 from `narration-script.md`, then run the HTML through the HyperFrames render flow to bake the audio.

Option 2 — render locally with Chromium + ffmpeg (no audio):
```bash
# Chromium ships with the Claude Code env.
CHROME=/opt/pw-browsers/chromium-1194/chrome-linux/chrome
cd launch-kit/dreams
mkdir -p /tmp/dreams-pitch-frames
# 1800 frames at 30fps. ~10–15 min on this container.
for n in $(seq 0 1799); do
  t=$(printf "%05d" $n)
  $CHROME --headless=new --disable-gpu --no-sandbox --hide-scrollbars \
    --window-size=1080,1920 \
    --virtual-time-budget=$((n * 1000 / 30)) \
    --screenshot=/tmp/dreams-pitch-frames/f$t.png \
    "file://$PWD/clips-60s/pitch/index.html"
done
ffmpeg -framerate 30 -i /tmp/dreams-pitch-frames/f%05d.png \
  -c:v libx264 -pix_fmt yuv420p -crf 18 -movflags +faststart \
  clips-60s/pitch.mp4
```

The 30s clips work the same way, but loop frames 0..899 with `?frame=N` and 900 instead of 1800:
```bash
mkdir -p /tmp/dreams-30s-frames
for n in $(seq 0 899); do
  t=$(printf "%04d" $n)
  $CHROME --headless=new --disable-gpu --no-sandbox --hide-scrollbars \
    --window-size=1080,1920 \
    --screenshot=/tmp/dreams-30s-frames/f$t.png \
    "file://$PWD/clips-30s-src/01-pitch.html?frame=$n"
done
ffmpeg -framerate 30 -i /tmp/dreams-30s-frames/f%04d.png \
  -c:v libx264 -pix_fmt yuv420p -crf 18 -movflags +faststart \
  clips-30s/01-pitch.mp4
```

3-second clips (`clips-3s-src/*.html`) follow the same flow but with frames 0..89.

## Copy (`copy/`)

- `description.md` — 8 surface variants from a one-liner up to a press blurb and full ~1100-word Gumroad pitch.
- `hashtags.md` — SEO keywords, IG / TikTok / YouTube / LinkedIn / X / Pinterest / Threads / Facebook hashtag stacks, brand-owned tags.
- `ritual-explainer.md` — standalone ~620-word piece on the four-layer ritual and the lineage of bedtime practice, written to double as VO source for a longer explainer cut.

## Gumroad

`gumroad-listing.md` — the full Gumroad page: title, summary, price, long markdown description, tags, after-purchase email, image order, and the medical disclaimer in the right places.

## Brand source of truth

`BRAND.md` — palette, typography, motion, dimensions, and the lineage-mapping table showing where DREAMS sits in the FREQUENCY family. Don't drift; any new composition should read this first.

DREAMS inherits FREQUENCY's deep navy `#0A0F1F` and gold `#D4AF37` but pushes deeper: canvas is `#050816`, accents push to indigo (`#1B2042` / `#262C5E` / `#4A4F8A`) and pewter (`#8A8FA6` / `#B3B7C9` / `#5B607A`). The signature gradient is `linear-gradient(135deg, #D4AF37 0%, #B3B7C9 50%, #D4AF37 100%)` — gold-pewter-gold — used for italic emphasis on a single word per composition.

## Fonts

`fonts/fonts.css` is identical to `launch-kit/hum/fonts/fonts.css`. The `fonts/files/` directory is a symlink to `../../hum/fonts/files` — the woff2 set (Cormorant Garamond, Inter, JetBrains Mono) is the same across all launch kits in the family. ~600 KB total. Self-hosted so the container doesn't need Google Fonts egress at render time.

## Re-render anything

```bash
# Start a tiny static server (run from the repo root):
python3 -m http.server 8765 --bind 127.0.0.1 &

CHROME=/opt/pw-browsers/chromium-1194/chrome-linux/chrome
COMMON="--headless=new --disable-gpu --no-sandbox --hide-scrollbars --virtual-time-budget=4000"

# Single 1080×1080 image
$CHROME $COMMON --window-size=1080,1080 \
  --screenshot=launch-kit/dreams/visuals/02-what-is-dreams.png \
  "http://127.0.0.1:8765/launch-kit/dreams/visuals-src/02-what-is-dreams.html"

# Hero (1280×720)
$CHROME $COMMON --window-size=1280,720 \
  --screenshot=launch-kit/dreams/visuals/01-hero-cover.png \
  "http://127.0.0.1:8765/launch-kit/dreams/visuals-src/01-hero-cover.html"

# Poster (1080×1920)
$CHROME $COMMON --window-size=1080,1920 \
  --screenshot=launch-kit/dreams/thumbnails/poster.png \
  "http://127.0.0.1:8765/launch-kit/dreams/thumbnails-src/poster.html"
```

## Medical disclaimer

Every rendered surface — every clip, every Gumroad page, every long-form copy block — carries the line:

> FREQUENCY DREAMS is a wellness practice. It does not diagnose, treat, cure, or prevent any disease, including insomnia, anxiety, or any sleep disorder. Consult a qualified clinician for sleep disorders or other health concerns.

The disclaimer is mandatory in the foot of every script, the foot of the Gumroad page, and the bottom of the long description. The narration scripts include it; the storyboards include it.
