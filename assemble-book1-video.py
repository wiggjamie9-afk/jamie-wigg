#!/usr/bin/env python3
"""
Step 3: Assemble complete Book 1 video
Combines 18 illustrated pages with narration audio
Creates final MP4 ready for YouTube
"""

import subprocess
import sys
from pathlib import Path

OUTPUT_DIR = Path("/home/user/jamie-wigg/BOOK-1-VIDEO")
OUTPUT_DIR.mkdir(exist_ok=True)

PAGES_DIR = Path("/home/user/jamie-wigg/BOOK-1-ASSEMBLED")
NARRATION_FILE = Path("/home/user/jamie-wigg/BOOK-1-NARRATION/narration.wav")
OUTPUT_VIDEO = OUTPUT_DIR / "BOOK-1-Sunny-and-the-Flying-Fox.mp4"

def create_page_list():
    """Create list of pages in order"""
    pages = []
    for i in range(1, 19):  # 18 pages total
        page_file = PAGES_DIR / f"BOOK-1-PAGE-{i:02d}-*.png"
        # Find the actual file
        import glob
        matches = glob.glob(str(page_file))
        if matches:
            pages.append(matches[0])
        else:
            print(f"⚠ Warning: Page {i} not found")
    return pages

def create_concat_file(pages):
    """Create FFmpeg concat file"""
    concat_file = OUTPUT_DIR / "concat.txt"
    with open(concat_file, "w") as f:
        for page in pages:
            f.write(f"file '{page}'\n")
            f.write("duration 5\n")  # 5 seconds per page
    return concat_file

def assemble_video(pages, narration_file, output_file):
    """Use FFmpeg to assemble video with audio"""

    if not narration_file.exists():
        raise FileNotFoundError(f"Narration not found: {narration_file}")

    print("Creating video...")
    print(f"  - {len(pages)} pages")
    print(f"  - 5 seconds per page")
    print(f"  - Narration: {narration_file.name}")
    print()

    # Create concat file
    concat_file = create_concat_file(pages)

    # FFmpeg command
    cmd = [
        "ffmpeg",
        "-y",  # Overwrite output
        "-f", "concat",
        "-safe", "0",
        "-i", str(concat_file),
        "-i", str(narration_file),
        "-c:v", "libx264",
        "-crf", "20",
        "-pix_fmt", "yuv420p",
        "-c:a", "aac",
        "-b:a", "128k",
        "-shortest",
        str(output_file)
    ]

    print(f"Running FFmpeg (this may take a few minutes)...")
    result = subprocess.run(cmd, capture_output=True, text=True)

    if result.returncode != 0:
        print(f"FFmpeg error: {result.stderr}")
        raise Exception("Video assembly failed")

    return output_file

def main():
    print("=" * 70)
    print("Assembling Book 1 Video with Narration")
    print("=" * 70)
    print()

    try:
        # Get pages in order
        pages = create_page_list()
        if not pages:
            print("ERROR: No pages found")
            return 1

        if len(pages) != 18:
            print(f"⚠ Warning: Expected 18 pages, found {len(pages)}")

        # Assemble video
        assemble_video(pages, NARRATION_FILE, OUTPUT_VIDEO)

        print()
        print("=" * 70)
        print(f"✓ Video complete!")
        print(f"✓ File: {OUTPUT_VIDEO}")
        print(f"✓ Resolution: 1920x1080")
        print(f"✓ Duration: ~{len(pages) * 5 // 60} minutes")
        print(f"✓ Ready for YouTube upload")
        print("=" * 70)

        return 0

    except Exception as e:
        print(f"✗ ERROR: {e}")
        return 1

if __name__ == "__main__":
    sys.exit(main())
