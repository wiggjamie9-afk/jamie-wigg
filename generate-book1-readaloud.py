#!/usr/bin/env python3
"""Build the read-aloud video for Book 1 — Sunny and the Flying Fox.

Each composed page is held on screen while the narrator reads its text
(one TTS segment per page, so page turns land exactly on the words),
with the gentle generated lullaby mixed underneath.

Runs on the GitHub runner (needs ELEVENLABS_API_KEY for the premium
voice; falls back to Piper TTS, then fails loudly if neither works).
"""
import json
import pathlib
import subprocess
import sys

REPO_ROOT = pathlib.Path(__file__).parent
sys.path.insert(0, str(REPO_ROOT / "kids-channel"))
import pipeline  # noqa: E402  (reuse TTS + music helpers and API keys)

import importlib.util  # noqa: E402

spec = importlib.util.spec_from_file_location(
    "bookgen", REPO_ROOT / "generate-book1-redesign.py")
bookgen = importlib.util.module_from_spec(spec)
sys.modules["bookgen"] = bookgen
spec.loader.exec_module(bookgen)

PAGES_DIR = REPO_ROOT / "book1" / "redesign" / "pages"
WORK = REPO_ROOT / "book1" / "redesign" / "readaloud-work"
OUT = REPO_ROOT / "book1" / "redesign" / "sunny-and-the-flying-fox-readaloud.mp4"

INTRO = ("Sunny and the Flying Fox. "
         "A Sonny's Cozy Quokka Bedtime Tale. "
         "Snuggle in close, little one. Are you ready? Let's begin.")
OUTRO = ("The end. "
         "Goodnight, Sunny. Goodnight, flying foxes. "
         "Sweet dreams, little one.")


def tts_segment(text: str, seg_dir: pathlib.Path) -> pathlib.Path:
    """Narrate one segment; ElevenLabs first, Piper fallback."""
    seg_dir.mkdir(parents=True, exist_ok=True)
    audio = pipeline.generate_narration(text, seg_dir)
    if not audio.is_file() or audio.stat().st_size < 1000:
        audio = pipeline.generate_narration_piper(text, seg_dir)
    if not audio.is_file() or audio.stat().st_size < 1000:
        raise RuntimeError(f"TTS failed for segment: {text[:60]}...")
    return audio


def duration_of(audio: pathlib.Path) -> float:
    r = subprocess.run(
        ["ffprobe", "-v", "quiet", "-print_format", "json",
         "-show_format", str(audio)],
        capture_output=True, text=True)
    return float(json.loads(r.stdout)["format"]["duration"])


def page_clip(image: pathlib.Path, audio: pathlib.Path, clip: pathlib.Path,
              pad: float = 1.6) -> float:
    """Still image + narration, padded with a beat of quiet after the words."""
    dur = duration_of(audio) + pad
    r = subprocess.run([
        "ffmpeg", "-y",
        "-loop", "1", "-i", str(image),
        "-i", str(audio),
        "-af", f"apad=pad_dur={pad}",
        "-t", f"{dur:.2f}",
        "-vf", "scale=1920:1080,format=yuv420p",
        "-r", "25", "-c:v", "libx264", "-preset", "fast", "-c:a", "aac",
        str(clip)], capture_output=True)
    if r.returncode != 0:
        raise RuntimeError(f"clip failed for {image.name}: "
                           f"{r.stderr.decode()[-300:]}")
    return dur


def main() -> None:
    WORK.mkdir(parents=True, exist_ok=True)

    # Segment list: (page image, narration text)
    segments = [(PAGES_DIR / "BOOK-1-PAGE-01-REDESIGN.png", INTRO)]
    for page in bookgen.PAGES:
        img = PAGES_DIR / f"BOOK-1-PAGE-{page['number']:02d}-REDESIGN.png"
        segments.append((img, " ".join(page["text"])))
    segments.append((PAGES_DIR / "BOOK-1-PAGE-17-REDESIGN.png", OUTRO))

    clips, total = [], 0.0
    for i, (img, text) in enumerate(segments):
        if not img.is_file():
            raise RuntimeError(f"missing page image: {img}")
        print(f"[{i + 1}/{len(segments)}] {img.name}")
        audio = tts_segment(text, WORK / f"seg_{i:02d}")
        clip = WORK / f"clip_{i:02d}.mp4"
        total += page_clip(img, audio, clip)
        clips.append(clip)

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
            "-c:v", "copy", "-c:a", "aac", "-movflags", "+faststart",
            str(OUT)], capture_output=True)
        if r.returncode != 0:
            print("music mix failed — shipping narration-only:",
                  r.stderr.decode()[-200:])
            r = subprocess.run(["ffmpeg", "-y", "-i", str(narrated), "-c", "copy",
                                "-movflags", "+faststart", str(OUT)], capture_output=True)
    else:
        r = subprocess.run(["ffmpeg", "-y", "-i", str(narrated), "-c", "copy",
                            "-movflags", "+faststart", str(OUT)], capture_output=True)

    print(f"✅ Read-aloud video: {OUT} "
          f"({OUT.stat().st_size // (1024 * 1024)}MB, {total:.0f}s)")


if __name__ == "__main__":
    main()
