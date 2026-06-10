#!/usr/bin/env python3
"""
Step 3: Assemble 18-page video with narration
Creates complete Book 1 video: pages + audio + timing
"""

import os
import sys
import json
from pathlib import Path
import subprocess

PAGES_DIR = Path("/home/user/jamie-wigg/BOOK-1-ASSEMBLED")
NARRATION_FILE = Path("/home/user/jamie-wigg/BOOK-1-NARRATION/narration.mp3")
OUTPUT_DIR = Path("/home/user/jamie-wigg/BOOK-1-VIDEO")
OUTPUT_DIR.mkdir(exist_ok=True)

# Page timing (seconds each page displays)
PAGE_TIMING = {
    1: 3,    # Cover
    2: 5, 3: 5, 4: 5, 5: 5, 6: 5, 7: 5, 8: 5,
    9: 5, 10: 5, 11: 5, 12: 5, 13: 5, 14: 5, 15: 5, 16: 5,
    17: 5,   # Last story page
    18: 5,   # Teaser
}

def get_audio_duration(audio_file: Path) -> float:
    """Get duration of audio file"""
    try:
        result = subprocess.run(
            ["ffprobe", "-v", "error", "-show_entries", "format=duration",
             "-of", "default=noprint_wrappers=1:nokey=1:novalue=1", str(audio_file)],
            capture_output=True,
            timeout=10
        )
        return float(result.stdout.decode().strip())
    except:
        return None

def create_concat_filter(pages: list) -> str:
    """Create FFmpeg concat filter for pages"""
    filters = []
    for i, page_file in enumerate(pages):
        # Load image and scale to 1920x1080
        filters.append(f"[{i}:v]scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2[v{i}]")

    return ";".join(filters)

def create_video_with_ffmpeg(pages: list, audio_file: Path, output_file: Path):
    """Create video using FFmpeg"""
    if not audio_file.exists():
        raise FileNotFoundError(f"Audio file not found: {audio_file}")

    print("Creating video with FFmpeg...")
    print(f"  Pages: {len(pages)}")
    print(f"  Audio: {audio_file.name}")

    # Get audio duration
    audio_duration = get_audio_duration(audio_file)
    print(f"  Audio duration: {audio_duration:.1f} seconds")

    # Build FFmpeg command
    cmd = ["ffmpeg", "-y"]

    # Add input pages
    for page in pages:
        if not Path(page).exists():
            raise FileNotFoundError(f"Page not found: {page}")
        cmd.extend(["-loop", "1", "-t", str(PAGE_TIMING.get(int(Path(page).stem.split("-")[-1]), 5)), "-i", page])

    # Add audio
    cmd.extend(["-i", str(audio_file)])

    # Complex filter - concat all pages with audio
    num_pages = len(pages)
    concat_video = ";".join([f"[{i}:v]scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2[v{i}]" for i in range(num_pages)])
    concat_filter = concat_video + ";" + "".join([f"[v{i}]" for i in range(num_pages)]) + f"concat=n={num_pages}:v=1:a=0[v]"

    cmd.extend([
        "-filter_complex", concat_filter,
        "-map", "[v]",
        "-map", f"{num_pages}:a",
        "-c:v", "libx264",
        "-preset", "medium",
        "-crf", "23",
        "-c:a", "aac",
        "-b:a", "128k",
        "-pix_fmt", "yuv420p",
        "-movflags", "+faststart",
        str(output_file)
    ])

    print("\nRunning FFmpeg...")
    result = subprocess.run(cmd, capture_output=True, text=True)

    if result.returncode != 0:
        print("STDERR:", result.stderr)
        raise Exception(f"FFmpeg failed: {result.returncode}")

    print(f"✓ Video created: {output_file.name}")
    return output_file

def main():
    print("=" * 70)
    print("Assembling Book 1 Video")
    print("=" * 70)
    print()

    # Check narration exists
    if not NARRATION_FILE.exists():
        print(f"✗ ERROR: Narration not found: {NARRATION_FILE}")
        print("  Run: generate-book1-narration.py first")
        return 1

    # Get pages in order
    print("Loading pages...")
    pages = []
    for page_num in range(1, 19):
        # Try watercolor version first, then fallback
        page_file = PAGES_DIR / f"BOOK-1-PAGE-{page_num:02d}-WATERCOLOR.png"
        if not page_file.exists():
            page_file = PAGES_DIR / f"BOOK-1-PAGE-{page_num:02d}-COVER.png"
        if not page_file.exists():
            page_file = PAGES_DIR / f"BOOK-1-PAGE-{page_num:02d}-TEASER.png"

        if page_file.exists():
            pages.append(str(page_file))
            print(f"  Page {page_num}: {page_file.name}")
        else:
            print(f"  ⚠ Page {page_num}: Not found")

    if len(pages) < 18:
        print(f"\n⚠ WARNING: Only {len(pages)}/18 pages found")
        print("  Some pages may be missing")

    # Create video
    output_file = OUTPUT_DIR / "BOOK-1-Sunny-and-the-Flying-Fox.mp4"

    try:
        create_video_with_ffmpeg(pages, NARRATION_FILE, output_file)
        print(f"\n✓ Video complete: {output_file}")
        print(f"✓ File size: {output_file.stat().st_size / 1024 / 1024:.1f}MB")
        return 0
    except Exception as e:
        print(f"\n✗ ERROR: {e}")
        return 1

if __name__ == "__main__":
    sys.exit(main())
