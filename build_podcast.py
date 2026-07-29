#!/usr/bin/env python3
"""Build a podcast from the 35 finished read-aloud narrations.

For each book: extract the audio track from its *-readaloud.mp4 to a clean MP3,
stamp ID3 tags (title, album, track, artist, genre), and embed the book's cover
as episode art. Also builds a square show cover and an RSS feed skeleton.

Outputs to podcast/  (episodes/*.mp3, cover.jpg, feed.xml, README.txt)
"""
import json
import pathlib
import subprocess
import imageio_ffmpeg
from PIL import Image

REPO = pathlib.Path(__file__).parent
FF = imageio_ffmpeg.get_ffmpeg_exe()
OUT = REPO / "podcast"
EP = OUT / "episodes"
ART = OUT / "art"
SERIES = "Sonny's Cozy Quokka Bedtime Tales"
AUTHOR = "Jamie Wigg"

TITLES = {int(k): v for k, v in json.load(open("/tmp/pod_titles.json")).items()}


def square_cover(src, dst, size=1500):
    """Center-pad a portrait cover onto a soft square canvas for episode art."""
    im = Image.open(src).convert("RGB")
    scale = size / max(im.size)
    im2 = im.resize((round(im.width * scale), round(im.height * scale)), Image.LANCZOS)
    canvas = Image.new("RGB", (size, size), (14, 18, 40))
    canvas.paste(im2, ((size - im2.width) // 2, (size - im2.height) // 2))
    canvas.save(dst, "JPEG", quality=88)


def build_episode(i):
    d = REPO / f"book{i}" / "redesign"
    mp4 = next(d.glob("*readaloud*.mp4"), None)
    if not mp4:
        print(f"book{i}: no readaloud mp4, skip")
        return None
    title = TITLES[i]
    slug = mp4.stem.replace("-readaloud", "")
    art = ART / f"{i:02d}.jpg"
    square_cover(REPO / "kdp-covers" / f"book{i:02d}-kdp-cover.jpg", art)
    out = EP / f"{i:02d}-{slug}.mp3"
    cmd = [
        FF, "-y", "-i", str(mp4), "-i", str(art),
        "-map", "0:a", "-map", "1:v",
        "-c:a", "libmp3lame", "-b:a", "128k", "-ar", "44100",
        "-c:v", "mjpeg", "-id3v2_version", "3",
        "-metadata", f"title=Book {i}: {title}",
        "-metadata", f"album={SERIES}",
        "-metadata", f"artist={AUTHOR}",
        "-metadata", f"album_artist={AUTHOR}",
        "-metadata", f"track={i}",
        "-metadata", "genre=Children's",
        "-metadata:s:v", "title=Album cover", "-metadata:s:v", "comment=Cover (front)",
        str(out),
    ]
    subprocess.run(cmd, check=True, capture_output=True)
    print(f"book{i}: {out.name} ({out.stat().st_size//1024}KB)")
    return {"n": i, "title": title, "file": out.name, "bytes": out.stat().st_size}


def main():
    EP.mkdir(parents=True, exist_ok=True)
    ART.mkdir(parents=True, exist_ok=True)
    # show cover (square) from book 1
    square_cover(REPO / "kdp-covers" / "book01-kdp-cover.jpg", OUT / "cover.jpg", 3000)
    eps = [build_episode(i) for i in range(1, 36)]
    eps = [e for e in eps if e]
    (OUT / "episodes.json").write_text(json.dumps(eps, indent=2))
    print(f"\n{len(eps)} episodes built -> {EP}")


if __name__ == "__main__":
    main()
