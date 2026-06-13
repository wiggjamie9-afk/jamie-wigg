#!/usr/bin/env python3
"""
Book 1 Final Video Assembly Script
===================================

Assembles Higgsfield-generated images + narration into final MP4.

Run this after:
    1. generate-book1-higgsfield-images.py (generates 16 pages)
    2. generate-book1-narration.py (generates narration audio)

Usage:
    python3 assemble-book1-final-video.py

Prerequisites:
    - FFmpeg installed and in PATH
    - 16 generated book pages in BOOK-1-HIGGSFIELD-PAGES/
    - Narration audio file: book-1-narration.wav

Output:
    - book-1-sunny-watches-stars.mp4 (ready for YouTube)
"""

import os
import subprocess
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

# Configuration
PAGES_DIR = Path("BOOK-1-HIGGSFIELD-PAGES")
NARRATION_FILE = Path("book-1-narration.wav")
MOCKUP_COVER = Path("BOOK-1-COMPLETE-18PAGE/PAGE-001-COVER.png")
MOCKUP_TEASER = Path("BOOK-1-COMPLETE-18PAGE/PAGE-018-TEASER.png")
OUTPUT_VIDEO = Path("book-1-sunny-watches-stars.mp4")

# Page durations (matching narration timing)
PAGE_DURATIONS = {
    1: 3,      # Cover: 3 seconds
    2: 4.5,    # Golden hour opening
    3: 4.5,    # Sky deepening
    4: 4.5,    # First foxes
    5: 4.5,    # Foxes sailing
    6: 4,      # Wonder growing
    7: 4,      # More foxes
    8: 3.5,    # First star
    9: 3.5,    # Stars multiply
    10: 3.5,   # Many stars
    11: 4,     # Starfield growing
    12: 4,     # Peaceful stars
    13: 3.5,   # Deep night
    14: 3.5,   # Sleeping Sunny
    15: 3.5,   # Dream scene
    16: 3.5,   # Night complete
    17: 3.5,   # Goodnight
    18: 2,     # Teaser: 2 seconds
}

def create_cover_page():
    """Create or verify cover page."""
    cover_file = Path("book-1-cover-page.png")

    if cover_file.exists():
        print(f"✅ Cover page already exists: {cover_file}")
        return cover_file

    if MOCKUP_COVER.exists():
        print(f"✅ Using mockup cover: {MOCKUP_COVER}")
        return MOCKUP_COVER

    # Fallback: Create simple cover
    print("📝 Creating fallback cover page...")
    width, height = 1920, 1080
    img = Image.new('RGB', (width, height), color=(255, 228, 181))  # Peach background

    draw = ImageDraw.Draw(img)

    # Try to use a nice font, fall back to default
    try:
        title_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 80)
        subtitle_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 50)
        author_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 40)
    except:
        title_font = subtitle_font = author_font = ImageFont.load_default()

    # Draw text
    title = "Sunny's Cozy Quokka Bedtime Tales"
    subtitle = "Book 1: Sunny Watches the Stars Come Out"
    author = "by Jamie Wigg"
    tagline = "Dream Big, Little One"

    draw.text((960, 300), title, fill=(139, 69, 19), anchor="mm", font=title_font)
    draw.text((960, 450), subtitle, fill=(139, 69, 19), anchor="mm", font=subtitle_font)
    draw.text((960, 850), author, fill=(101, 67, 33), anchor="mm", font=author_font)
    draw.text((960, 950), tagline, fill=(160, 82, 45), anchor="mm", font=author_font)

    img.save(cover_file)
    print(f"✅ Created: {cover_file}")
    return cover_file

def create_teaser_page():
    """Create or verify teaser page."""
    teaser_file = Path("book-1-teaser-page.png")

    if teaser_file.exists():
        print(f"✅ Teaser page already exists: {teaser_file}")
        return teaser_file

    if MOCKUP_TEASER.exists():
        print(f"✅ Using mockup teaser: {MOCKUP_TEASER}")
        return MOCKUP_TEASER

    # Fallback: Create simple teaser
    print("📝 Creating fallback teaser page...")
    width, height = 1920, 1080
    img = Image.new('RGB', (width, height), color=(255, 165, 0))  # Golden background

    draw = ImageDraw.Draw(img)

    try:
        title_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 70)
        subtitle_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 40)
    except:
        title_font = subtitle_font = ImageFont.load_default()

    draw.text((960, 450), "Coming Next...", fill=(139, 69, 19), anchor="mm", font=title_font)
    draw.text((960, 600), "Sunny and the Autumn Leaves", fill=(101, 67, 33), anchor="mm", font=subtitle_font)
    draw.text((960, 900), "Book 2 in the Series", fill=(160, 82, 45), anchor="mm", font=subtitle_font)

    img.save(teaser_file)
    print(f"✅ Created: {teaser_file}")
    return teaser_file

def get_page_file(page_num):
    """Get the image file for a page."""
    # Page 1: cover (special)
    if page_num == 1:
        return create_cover_page()

    # Pages 2-17: generated book pages
    if 2 <= page_num <= 17:
        page_file = PAGES_DIR / f"book-1-page-{page_num - 1:02d}.png"
        if page_file.exists():
            return page_file

    # Page 18: teaser (special)
    if page_num == 18:
        return create_teaser_page()

    return None

def build_ffmpeg_concat_file():
    """Build FFmpeg concat demuxer file."""
    concat_file = Path("concat.txt")
    print(f"\n📝 Building FFmpeg concat file...")

    with open(concat_file, 'w') as f:
        for page_num in range(1, 19):  # Pages 1-18
            page_file = get_page_file(page_num)

            if not page_file or not page_file.exists():
                print(f"⚠️  Page {page_num} not found, skipping: {page_file}")
                continue

            duration = PAGE_DURATIONS.get(page_num, 3)
            f.write(f"file '{page_file.resolve()}'\n")
            f.write(f"duration {duration}\n")

    print(f"✅ Concat file: {concat_file}")
    return concat_file

def check_dependencies():
    """Check for required tools."""
    print("\n🔍 Checking dependencies...")

    # Check for FFmpeg
    result = subprocess.run(["ffmpeg", "-version"], capture_output=True)
    if result.returncode != 0:
        print("❌ FFmpeg not found! Install with: brew install ffmpeg (macOS) or apt install ffmpeg (Linux)")
        return False

    print("✅ FFmpeg found")
    return True

def verify_input_files():
    """Verify input files exist."""
    print("\n📂 Verifying input files...")

    missing = []

    # Check for at least some generated pages
    page_count = sum(1 for p in PAGES_DIR.glob("book-1-page-*.png") if p.exists()) if PAGES_DIR.exists() else 0
    print(f"   Pages directory: {PAGES_DIR} ({page_count} pages)")

    # Check for narration
    if NARRATION_FILE.exists():
        print(f"   ✅ Narration: {NARRATION_FILE}")
    else:
        print(f"   ⚠️  Narration not found: {NARRATION_FILE}")
        print(f"      Run: python3 generate-book1-narration.py")
        # Don't fail, we can continue without it for now

    return True

def assemble_video():
    """Assemble video using FFmpeg."""
    print(f"\n🎬 Assembling video...")
    print(f"   Output: {OUTPUT_VIDEO}")

    concat_file = build_ffmpeg_concat_file()

    if not NARRATION_FILE.exists():
        print(f"\n⚠️  Warning: Narration file not found ({NARRATION_FILE})")
        print(f"   Creating video without audio. Add audio later with:")
        print(f"   ffmpeg -i {OUTPUT_VIDEO} -i {NARRATION_FILE} -c:v copy -c:a aac -shortest book-1-with-audio.mp4")

        # Video only
        cmd = [
            "ffmpeg",
            "-y",
            "-f", "concat",
            "-safe", "0",
            "-i", str(concat_file),
            "-c:v", "libx264",
            "-pix_fmt", "yuv420p",
            "-crf", "18",
            str(OUTPUT_VIDEO)
        ]
    else:
        # Video + audio
        cmd = [
            "ffmpeg",
            "-y",
            "-f", "concat",
            "-safe", "0",
            "-i", str(concat_file),
            "-i", str(NARRATION_FILE),
            "-c:v", "libx264",
            "-pix_fmt", "yuv420p",
            "-c:a", "aac",
            "-crf", "18",
            "-shortest",
            str(OUTPUT_VIDEO)
        ]

    print(f"\n⏳ Encoding video (this takes 2-5 minutes)...")
    result = subprocess.run(cmd, capture_output=False)

    if result.returncode == 0:
        print(f"\n✅ Video created: {OUTPUT_VIDEO}")
        return True
    else:
        print(f"\n❌ Video encoding failed")
        return False

def main():
    """Main workflow."""
    print("\n🌙 SUNNY'S BEDTIME TALES - Book 1 Final Assembly")
    print("=" * 70)

    # Check dependencies
    if not check_dependencies():
        return

    # Verify inputs
    if not verify_input_files():
        return

    # Create cover and teaser
    print("\n📖 Preparing pages...")
    create_cover_page()
    create_teaser_page()

    # Assemble video
    if assemble_video():
        print("\n✅ Book 1 complete and ready for YouTube!")
        print(f"\n📤 Next: Upload to YouTube with:")
        print(f"   python3 upload-book1-to-youtube.py")
    else:
        print("\n❌ Assembly failed")

if __name__ == "__main__":
    main()
