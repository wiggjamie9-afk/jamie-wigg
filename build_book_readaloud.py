#!/usr/bin/env python3
"""Generic Sunny read-aloud video builder.

Usage: python build_book_readaloud.py <spec.json>
Reuses Book 1's narration/clip/mix helpers. Reads pages from
book<num>/redesign/pages/BOOK-<num>-PAGE-01..17.png and text from the spec.
"""
import importlib.util
import json
import pathlib
import subprocess
import sys

REPO = pathlib.Path(__file__).parent
sys.path.insert(0, str(REPO / "kids-channel"))

_ra = importlib.util.spec_from_file_location("ra1", REPO / "generate-book1-readaloud.py")
ra = importlib.util.module_from_spec(_ra)
sys.modules["ra1"] = ra
_ra.loader.exec_module(ra)

import pipeline  # noqa: E402


def main() -> None:
    spec = json.loads(pathlib.Path(sys.argv[1]).read_text())
    num, slug, title = spec["num"], spec["slug"], spec["title"]
    pages_dir = REPO / f"book{num}" / "redesign" / "pages"
    work = REPO / f"book{num}" / "redesign" / "readaloud-work"
    out = REPO / f"book{num}" / "redesign" / f"{slug}-readaloud.mp4"
    work.mkdir(parents=True, exist_ok=True)

    intro = spec.get("intro", f"{title}. A Sonny's Cozy Quokka Bedtime Tale. "
                     "Snuggle in close, little one. Are you ready? Let's begin.")
    outro = spec.get("outro", "The end. Sweet dreams, little one. Goodnight.")

    segments = [(pages_dir / f"BOOK-{num}-PAGE-01.png", intro)]
    for page in spec["pages"]:
        n = page["n"]
        segments.append((pages_dir / f"BOOK-{num}-PAGE-{n:02d}.png", " ".join(page["text"])))
    segments.append((pages_dir / f"BOOK-{num}-PAGE-17.png", outro))

    clips, total = [], 0.0
    for i, (img, text) in enumerate(segments):
        if not img.is_file():
            raise RuntimeError(f"missing page image: {img}")
        print(f"[{i + 1}/{len(segments)}] {img.name}")
        audio = ra.tts_segment(text, work / f"seg_{i:02d}")
        clip = work / f"clip_{i:02d}.mp4"
        total += ra.page_clip(img, audio, clip)
        clips.append(clip)

    concat = work / "concat.txt"
    concat.write_text("".join(f"file '{c.absolute()}'\n" for c in clips))
    narrated = work / "narrated.mp4"
    r = subprocess.run(["ffmpeg", "-y", "-f", "concat", "-safe", "0",
                        "-i", str(concat), "-c", "copy", str(narrated)],
                       capture_output=True)
    if r.returncode != 0:
        raise RuntimeError("concat failed: " + r.stderr.decode()[-300:])

    # loudnorm lifts the mix to streaming loudness (-16 LUFS); without it the
    # narration lands around -32 LUFS, near-inaudible on phone speakers.
    LOUDNORM = "loudnorm=I=-16:TP=-1.5:LRA=11"
    music = pipeline.generate_music(int(total), work)
    if music.is_file() and music.stat().st_size > 1000:
        r = subprocess.run([
            "ffmpeg", "-y", "-i", str(narrated), "-i", str(music),
            "-filter_complex",
            "[0:a]volume=1.0[narr];[1:a]volume=0.18[mus];"
            f"[narr][mus]amix=inputs=2:duration=first,{LOUDNORM}[aout]",
            "-map", "0:v", "-map", "[aout]",
            "-c:v", "copy", "-c:a", "aac", "-b:a", "160k", "-ac", "2",
            "-movflags", "+faststart",
            str(out)], capture_output=True)
        if r.returncode != 0:
            r = subprocess.run(["ffmpeg", "-y", "-i", str(narrated),
                                "-af", LOUDNORM, "-c:v", "copy",
                                "-c:a", "aac", "-b:a", "160k", "-ac", "2",
                                "-movflags", "+faststart", str(out)], capture_output=True)
    else:
        r = subprocess.run(["ffmpeg", "-y", "-i", str(narrated),
                            "-af", LOUDNORM, "-c:v", "copy",
                            "-c:a", "aac", "-b:a", "160k", "-ac", "2",
                            "-movflags", "+faststart", str(out)], capture_output=True)

    print(f"✅ Read-aloud video: {out} "
          f"({out.stat().st_size // (1024 * 1024)}MB, {total:.0f}s)")


if __name__ == "__main__":
    main()
