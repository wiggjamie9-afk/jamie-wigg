#!/usr/bin/env python3
"""Read-aloud video for Book 2 — Sunny and the Sleepy Wombat.

Reuses Book 1's narration/clip/mix helpers; only the pages, text, and
output path differ.
"""
import importlib.util
import pathlib
import sys

REPO = pathlib.Path(__file__).parent
sys.path.insert(0, str(REPO / "kids-channel"))

# Book 1 read-aloud module provides the reusable helpers.
spec1 = importlib.util.spec_from_file_location("ra1", REPO / "generate-book1-readaloud.py")
ra = importlib.util.module_from_spec(spec1)
sys.modules["ra1"] = ra
spec1.loader.exec_module(ra)

# Book 2 story text.
spec2 = importlib.util.spec_from_file_location("wombat", REPO / "generate-book2-wombat.py")
wb = importlib.util.module_from_spec(spec2)
sys.modules["wombat"] = wb
spec2.loader.exec_module(wb)

PAGES_DIR = REPO / "book2" / "redesign" / "pages"
WORK = REPO / "book2" / "redesign" / "readaloud-work"
OUT = REPO / "book2" / "redesign" / "sunny-and-the-sleepy-wombat-readaloud.mp4"

INTRO = ("Sunny and the Sleepy Wombat. "
         "A Sonny's Cozy Quokka Bedtime Tale. "
         "Snuggle in close, little one. Are you ready? Let's begin.")
OUTRO = ("The end. "
         "Goodnight, Sunny. Goodnight, little wombat. "
         "Sweet dreams, little one.")

import pipeline  # noqa: E402


def main() -> None:
    WORK.mkdir(parents=True, exist_ok=True)

    segments = [(PAGES_DIR / "BOOK-2-PAGE-01.png", INTRO)]
    for n, lines in wb.PAGES:
        segments.append((PAGES_DIR / f"BOOK-2-PAGE-{n:02d}.png", " ".join(lines)))
    segments.append((PAGES_DIR / "BOOK-2-PAGE-17.png", OUTRO))

    clips, total = [], 0.0
    for i, (img, text) in enumerate(segments):
        if not img.is_file():
            raise RuntimeError(f"missing page image: {img}")
        print(f"[{i + 1}/{len(segments)}] {img.name}")
        audio = ra.tts_segment(text, WORK / f"seg_{i:02d}")
        clip = WORK / f"clip_{i:02d}.mp4"
        total += ra.page_clip(img, audio, clip)
        clips.append(clip)

    import subprocess
    concat = WORK / "concat.txt"
    concat.write_text("".join(f"file '{c.absolute()}'\n" for c in clips))
    narrated = WORK / "narrated.mp4"
    r = subprocess.run(["ffmpeg", "-y", "-f", "concat", "-safe", "0",
                        "-i", str(concat), "-c", "copy", str(narrated)],
                       capture_output=True)
    if r.returncode != 0:
        raise RuntimeError("concat failed: " + r.stderr.decode()[-300:])

    music = pipeline.generate_music(int(total), WORK)
    if music.is_file() and music.stat().st_size > 1000:
        r = subprocess.run([
            "ffmpeg", "-y", "-i", str(narrated), "-i", str(music),
            "-filter_complex",
            "[0:a]volume=1.0[narr];[1:a]volume=0.18[mus];"
            "[narr][mus]amix=inputs=2:duration=first[aout]",
            "-map", "0:v", "-map", "[aout]",
            "-c:v", "copy", "-c:a", "aac", str(OUT)], capture_output=True)
        if r.returncode != 0:
            OUT.write_bytes(narrated.read_bytes())
    else:
        OUT.write_bytes(narrated.read_bytes())

    print(f"✅ Read-aloud video: {OUT} "
          f"({OUT.stat().st_size // (1024 * 1024)}MB, {total:.0f}s)")


if __name__ == "__main__":
    main()
