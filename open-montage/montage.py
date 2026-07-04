#!/usr/bin/env python3
"""open-montage — assemble photos/clips + music + captions into a real H.264 movie.

The hands of the "Open Montage" stack: an LLM director (OpenManus / Claude) decides
the shots; this CLI cuts the film. Pure CPU — MoviePy + a pip-bundled static ffmpeg
(imageio-ffmpeg), so it runs anywhere Python runs. No GPU, no cloud.

Usage:
  # Simplest: every image/video in a folder, alphabetical, 3s per image
  python3 montage.py --media ./shots --music bed.mp3 --title "Summer 2026" -o out.mp4

  # Full control: a manifest decides order, captions and durations
  python3 montage.py --manifest montage.json -o out.mp4

Manifest format (montage.json):
{
  "title": "Summer 2026",            // optional opening title card
  "outro": "made with open-montage", // optional closing card
  "music": "bed.mp3",                // optional audio bed (faded, cut to length)
  "size": [1280, 720],
  "fps": 24,
  "shots": [
    {"src": "shots/beach.jpg",  "caption": "Day one", "duration": 3},
    {"src": "shots/clip01.mp4", "caption": "The dive"},          // videos keep own length
    {"src": "shots/fire.jpg",   "duration": 4}
  ]
}
"""
from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path

IMG_EXT = {".jpg", ".jpeg", ".png", ".webp", ".bmp"}
VID_EXT = {".mp4", ".mov", ".webm", ".mkv", ".avi", ".m4v"}
AUD_EXT = {".mp3", ".wav", ".m4a", ".ogg", ".flac", ".aac"}


def _ffmpeg() -> None:
    """Prefer the pip-bundled static ffmpeg (has libx264+aac everywhere)."""
    try:
        import imageio_ffmpeg

        os.environ.setdefault("IMAGEIO_FFMPEG_EXE", imageio_ffmpeg.get_ffmpeg_exe())
    except ImportError:
        pass  # fall back to system ffmpeg if present


def _title_card(text: str, size: tuple[int, int], sub: str = "") -> "object":
    from PIL import Image, ImageDraw, ImageFont
    from moviepy import ImageClip
    import numpy as np

    W, H = size
    im = Image.new("RGB", (W, H), (10, 10, 35))
    d = ImageDraw.Draw(im)
    try:
        fb = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", max(40, W // 16))
        fs = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", max(20, W // 40))
    except OSError:
        fb = fs = ImageFont.load_default()
    w = d.textbbox((0, 0), text, font=fb)[2]
    d.text(((W - w) // 2, int(H * 0.42)), text, font=fb, fill=(241, 190, 50))
    if sub:
        w2 = d.textbbox((0, 0), sub, font=fs)[2]
        d.text(((W - w2) // 2, int(H * 0.58)), sub, font=fs, fill=(190, 190, 200))
    return ImageClip(np.array(im)).with_duration(2.5)


def _caption(clip, text: str, size: tuple[int, int]):
    """Burn a lower-third caption onto a clip."""
    from PIL import Image, ImageDraw, ImageFont
    from moviepy import ImageClip, CompositeVideoClip
    import numpy as np

    W, H = size
    band_h = max(60, H // 10)
    im = Image.new("RGBA", (W, band_h), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle([W // 40, 4, W - W // 40, band_h - 4], radius=12, fill=(10, 10, 35, 190))
    try:
        f = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", int(band_h * 0.42))
    except OSError:
        f = ImageFont.load_default()
    tw = d.textbbox((0, 0), text, font=f)[2]
    d.text(((W - tw) // 2, int(band_h * 0.22)), text, font=f, fill=(244, 239, 230, 255))
    band = (
        ImageClip(np.array(im))
        .with_duration(clip.duration)
        .with_position(("center", H - band_h - H // 24))
    )
    return CompositeVideoClip([clip, band], size=size)


def _load_shot(spec: dict, size: tuple[int, int], img_dur: float):
    from moviepy import ImageClip, VideoFileClip

    src = Path(spec["src"])
    if not src.exists():
        sys.exit(f"!! shot not found: {src}")
    ext = src.suffix.lower()
    if ext in IMG_EXT:
        clip = ImageClip(str(src)).with_duration(float(spec.get("duration", img_dur)))
    elif ext in VID_EXT:
        clip = VideoFileClip(str(src))
        if "duration" in spec:
            clip = clip.subclipped(0, min(float(spec["duration"]), clip.duration))
    else:
        sys.exit(f"!! unsupported media type: {src}")
    clip = clip.resized(height=size[1])
    if clip.w > size[0]:
        clip = clip.cropped(x_center=clip.w / 2, width=size[0])
    if spec.get("caption"):
        clip = _caption(clip, spec["caption"], size)
    return clip


def build(manifest: dict, out: str) -> str:
    _ffmpeg()
    from moviepy import concatenate_videoclips, AudioFileClip, afx
    from moviepy.video.fx import FadeIn, FadeOut

    size = tuple(manifest.get("size", [1280, 720]))
    fps = int(manifest.get("fps", 24))
    img_dur = float(manifest.get("image_duration", 3))
    xfade = float(manifest.get("fade", 0.4))

    clips = []
    if manifest.get("title"):
        clips.append(_title_card(manifest["title"], size, manifest.get("subtitle", "")))
    for spec in manifest["shots"]:
        clips.append(_load_shot(spec, size, img_dur))
    if manifest.get("outro"):
        clips.append(_title_card(manifest["outro"], size))

    clips = [c.with_effects([FadeIn(xfade), FadeOut(xfade)]) for c in clips]
    video = concatenate_videoclips(clips, method="compose")

    if manifest.get("music"):
        music = Path(manifest["music"])
        if not music.exists():
            sys.exit(f"!! music not found: {music}")
        audio = AudioFileClip(str(music)).with_effects([afx.AudioLoop(duration=video.duration)])
        audio = audio.with_effects([afx.AudioFadeIn(1.0), afx.AudioFadeOut(1.5)])
        video = video.with_audio(audio)

    video.write_videofile(out, fps=fps, codec="libx264", audio_codec="aac", logger=None)
    return out


def manifest_from_dir(media: str, music: str | None, title: str | None, img_dur: float) -> dict:
    root = Path(media)
    if not root.is_dir():
        sys.exit(f"!! --media is not a directory: {media}")
    shots = [
        {"src": str(p)}
        for p in sorted(root.iterdir())
        if p.suffix.lower() in IMG_EXT | VID_EXT
    ]
    if not shots:
        sys.exit(f"!! no images/videos found in {media}")
    m: dict = {"shots": shots, "image_duration": img_dur}
    if music:
        m["music"] = music
    if title:
        m["title"] = title
    return m


def main() -> None:
    ap = argparse.ArgumentParser(description="Assemble a montage movie from media + music.")
    ap.add_argument("--manifest", help="montage.json (full control: order, captions, durations)")
    ap.add_argument("--media", help="directory of images/videos (alphabetical order)")
    ap.add_argument("--music", help="audio bed (mp3/wav/...)")
    ap.add_argument("--title", help="opening title card text")
    ap.add_argument("--image-duration", type=float, default=3.0, help="seconds per still image")
    ap.add_argument("-o", "--out", default="montage.mp4", help="output mp4 path")
    args = ap.parse_args()

    if args.manifest:
        manifest = json.loads(Path(args.manifest).read_text())
        base = Path(args.manifest).parent
        for s in manifest["shots"]:
            s["src"] = str((base / s["src"]).resolve()) if not Path(s["src"]).is_absolute() else s["src"]
        if manifest.get("music") and not Path(manifest["music"]).is_absolute():
            manifest["music"] = str((base / manifest["music"]).resolve())
    elif args.media:
        manifest = manifest_from_dir(args.media, args.music, args.title, args.image_duration)
    else:
        ap.error("pass --manifest or --media")

    out = build(manifest, args.out)
    print(f"✓ wrote {out} ({os.path.getsize(out):,} bytes)")


if __name__ == "__main__":
    main()
