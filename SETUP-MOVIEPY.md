# MoviePy — Setup & Reference (v2.0)

## Overview

[MoviePy](https://zulko.github.io/moviepy/) is a Python library for programmatic
video editing: cuts, concatenation, title/caption insertion, compositing
(non-linear editing), processing, and custom effects. It reads/writes all common
audio+video formats (incl. GIF) and runs on Windows/Mac/Linux with **Python
3.9+**. Under the hood it imports frames/audio as numpy arrays (every pixel
accessible), then re-encodes via FFmpeg.

**Docs**: https://zulko.github.io/moviepy/ · **Repo**:
https://github.com/Zulko/moviepy · MIT, by Zulko.

> ⚠️ **MoviePy v2.0 has major breaking changes** vs v1. v1 is no longer
> maintained. This repo targets **v2** — see the migration table below and pin it
> (`moviepy>=2.0`). Official migration guide:
> https://zulko.github.io/moviepy/getting_started/updating_to_v2.html

> ### How this fits the RHYTHMIX pipeline
> Promos are authored as **HyperFrames** HTML compositions and rendered to MP4
> with FFmpeg (see `CLAUDE.md` → HyperFrames Video Pipeline; ADR-0001). MoviePy
> does **not** replace that — it's a *post-processing* layer for things FFmpeg
> alone is fiddly at:
> - **Stitch Cuts into a reel** — concatenate `rhythmix-s1…s5` MP4s with crossfades.
> - **Burn captions / lower-thirds** over a rendered Cut.
> - **Aspect repurposing** — pad/crop a 1920×1080 landscape Cut into 1080×1920 portrait.
> - **GIF teasers** for social from a subclip.
> - **Mux narration** — overlay `narration.wav` onto a silent render.
>
> It's slower than raw FFmpeg (numpy round-trip) but far more approachable for
> compositing/captions. For pure transcode/concat with no compositing, stay on
> FFmpeg.

## Installation

```bash
pip install "moviepy>=2.0"          # core
# Optional extras:
pip install "moviepy[doc]"          # build docs locally
pip install -e .                    # from a local clone, for development
```

FFmpeg is fetched automatically via `imageio-ffmpeg`; to use a custom FFmpeg or
enable previewing, see the upstream install docs. **TextClip needs a font file**
(a path), and system fonts/ImageMagick are no longer required the way they were
in v1 — pass `font="/path/to/Font.ttf"`.

## Canonical v2 example (from upstream)

```python
from moviepy import VideoFileClip, TextClip, CompositeVideoClip

clip = (
    VideoFileClip("long_examples/example2.mp4")
    .subclipped(10, 20)            # v2: was .subclip()
    .with_volume_scaled(0.8)       # v2: was .volumex()
)

txt_clip = (
    TextClip(font="Arial.ttf", text="Hello there!", font_size=70, color="white")
    .with_duration(10)             # v2: was .set_duration()
    .with_position("center")       # v2: was .set_position()
)

final = CompositeVideoClip([clip, txt_clip])
final.write_videofile("result.mp4")
```

## v1 → v2 migration cheat-sheet

| v1 | v2 |
|---|---|
| `from moviepy.editor import *` | `from moviepy import *` (the `moviepy.editor` namespace is **removed**) |
| `clip.set_duration(d)` | `clip.with_duration(d)` |
| `clip.set_position(p)` | `clip.with_position(p)` |
| `clip.set_audio(a)` | `clip.with_audio(a)` |
| `clip.set_start/set_end` | `clip.with_start / with_end` |
| `clip.volumex(0.8)` | `clip.with_volume_scaled(0.8)` |
| `clip.subclip(a, b)` | `clip.subclipped(a, b)` |
| `clip.fx(vfx.something, ...)` | `clip.with_effects([vfx.Something(...)])` (effects are **classes** now) |
| `clip.resize / crop / rotate` | `clip.resized() / cropped() / rotated()` (convenience), or `vfx.Resize`, etc. |
| `TextClip(txt="...", fontsize=70)` | `TextClip(text="...", font="Font.ttf", font_size=70)` (`font` is required; `txt`→`text`, `fontsize`→`font_size`) |

The general rule: **outplace setters got a `with_` prefix**, and **effects moved
from `clip.fx(func)` to `clip.with_effects([EffectClass(...)])`**. Always confirm
against the official guide for the specific call you're porting.

## RHYTHMIX recipes

**Concatenate the S-series into one reel (with crossfades):**

```python
from moviepy import VideoFileClip, concatenate_videoclips, vfx

cuts = [VideoFileClip(f"rhythmix-s{i}-{name}/rhythmix-s{i}-{name}.mp4")
        for i, name in [(1,"overview"),(2,"money"),(3,"tools"),(4,"vs"),(5,"pricing")]]
cuts = [c.with_effects([vfx.CrossFadeIn(0.5)]) for c in cuts]
reel = concatenate_videoclips(cuts, method="compose")
reel.write_videofile("renders/rhythmix-reel.mp4", fps=30, codec="libx264")
```

**Burn a lower-third caption over a Cut:**

```python
from moviepy import VideoFileClip, TextClip, CompositeVideoClip

base = VideoFileClip("rhythmix-overview-60s/rhythmix-overview.mp4")
cap = (TextClip(font="fonts/SpaceGrotesk-Bold.ttf", text="RHYTHMIX — $149 once",
                font_size=56, color="#ffffff")
       .with_duration(base.duration)
       .with_position(("center", base.h - 140)))
CompositeVideoClip([base, cap]).write_videofile("renders/overview-captioned.mp4")
```

**Repurpose landscape → portrait (1080×1920) with blurred padding:**

```python
from moviepy import VideoFileClip, CompositeVideoClip, vfx

src = VideoFileClip("rhythmix-overview-60s/rhythmix-overview.mp4")
fg  = src.resized(width=1080)                                  # scale to width
bg  = src.resized(height=1920).cropped(width=1080, x_center=src.w/2)\
         .with_effects([vfx.MultiplyColor(0.4)])               # dim backdrop
final = CompositeVideoClip([bg, fg.with_position("center")], size=(1080, 1920))
final.write_videofile("renders/overview-portrait.mp4")
```

**GIF teaser from a subclip:**

```python
from moviepy import VideoFileClip
(VideoFileClip("rhythmix-teaser-60s/rhythmix-teaser.mp4")
 .subclipped(0, 4).resized(width=480)
 .write_gif("thumbnails/teaser.gif", fps=12))
```

**Mux narration.wav onto a silent render:**

```python
from moviepy import VideoFileClip, AudioFileClip
v = VideoFileClip("rhythmix-name-60s/render.mp4")
a = AudioFileClip("rhythmix-name-60s/narration.wav")
v.with_audio(a).write_videofile("rhythmix-name-60s/final.mp4")
```

## Where to put MoviePy scripts

Keep ad-hoc post-processing scripts in `scripts/` (alongside the existing Node
`*.mjs` helpers) or inside the relevant Cut folder. Brand assets (fonts, colors)
live in `rhythmix-teaser-60s/DESIGN.md`: display font Space Grotesk, mono
JetBrains Mono; canvas `#08050d`, magenta `#ff1f5a`, cyan `#00d8ff`. Match those
in any captions/overlays.

## Gotchas

- **Always pass a real font file path** to `TextClip` (v2 won't guess).
- `concatenate_videoclips(method="compose")` is needed when clips differ in size.
- MoviePy re-encodes through numpy → slower than raw FFmpeg; for pure
  concat/transcode with no overlays, prefer `ffmpeg` directly.
- Pin the major version (`moviepy>=2.0`) — v1 code (`moviepy.editor`, `set_*`,
  `volumex`, `subclip`) will not run on v2.

## License

MIT, originally by Zulko. See the upstream repo for the full credits and
contributing guidelines.
