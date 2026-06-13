#!/usr/bin/env python3
"""
Assemble Book 1 complete video:
1. Create cover page (page 1)
2. Use story pages (pages 2-13)
3. Create teaser page (page 14+)
4. Combine with narration audio
5. Encode to MP4 with FFmpeg
"""

import subprocess
import os
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

OUTPUT_DIR = Path("BOOK-1-ILLUSTRATED-PAGES")
OUTPUT_DIR.mkdir(exist_ok=True)

# Colors for cover
NAVY = (26, 45, 92)
CREAM = (245, 241, 232)
GOLD = (210, 180, 100)
WHITE = (255, 255, 255)

def create_cover_page():
    """Create a professional cover page (Page 1)"""
    # Create a gradient cover
    img = Image.new("RGB", (1920, 1080), NAVY)
    draw = ImageDraw.Draw(img, 'RGBA')

    # Background gradient (golden to navy)
    for y in range(1080):
        progress = y / 1080
        r = int(210 - progress * 184)
        g = int(180 - progress * 135)
        b = int(100 + progress * -8)
        draw.line([(0, y), (1920, y)], fill=(r, g, b))

    # Add decorative stars
    star_positions = [(200, 150), (1750, 200), (400, 900), (1600, 850), (950, 100)]
    for sx, sy in star_positions:
        draw.ellipse([(sx-8, sy-8), (sx+8, sy+8)], fill=GOLD)

    # Add a simple Sunny illustration at bottom (using circles)
    sunny_x, sunny_y = 960, 700
    # Body
    draw.ellipse([(sunny_x-100, sunny_y-100), (sunny_x+100, sunny_y+100)], fill=GOLD)
    # Head
    draw.ellipse([(sunny_x-80, sunny_y-180), (sunny_x+80, sunny_y-40)], fill=GOLD)
    # Eyes
    draw.ellipse([(sunny_x-45, sunny_y-120), (sunny_x-20, sunny_y-85)], fill=WHITE)
    draw.ellipse([(sunny_x+20, sunny_y-120), (sunny_x+45, sunny_y-85)], fill=WHITE)

    # Title text (would need font, but use default)
    # For now, just note that title should be added

    # Save cover
    cover_path = OUTPUT_DIR / "BOOK-001-PAGE-01-COVER.png"
    img.save(cover_path, quality=95)
    print(f"✅ Created cover: {cover_path}")
    return cover_path

def create_teaser_page():
    """Create a teaser/closing page"""
    img = Image.new("RGB", (1920, 1080), (60, 50, 120))
    draw = ImageDraw.Draw(img, 'RGBA')

    # Night sky background
    for y in range(1080):
        noise = [(40, 35, 100), (50, 45, 120), (30, 25, 80)][y % 3]
        draw.line([(0, y), (1920, y)], fill=noise)

    # Stars
    for x in range(100, 1900, 150):
        for y in range(50, 500, 150):
            draw.ellipse([(x, y), (x+4, y+4)], fill=(200, 200, 200))

    # Closing message
    # "Coming next: Book 2..."
    teaser_path = OUTPUT_DIR / "BOOK-001-PAGE-14-TEASER.png"
    img.save(teaser_path, quality=95)
    print(f"✅ Created teaser: {teaser_path}")
    return teaser_path

def create_image_sequence_txt():
    """Create FFmpeg concat file listing all pages"""
    concat_file = OUTPUT_DIR / "concat_images.txt"

    # Determine all pages in order
    pages = [
        "BOOK-001-PAGE-01-COVER.png",
        "BOOK-001-PAGE-02.png",
        "BOOK-001-PAGE-03.png",
        "BOOK-001-PAGE-04.png",
        "BOOK-001-PAGE-05.png",
        "BOOK-001-PAGE-06.png",
        "BOOK-001-PAGE-07.png",
        "BOOK-001-PAGE-08.png",
        "BOOK-001-PAGE-09.png",
        "BOOK-001-PAGE-10.png",
        "BOOK-001-PAGE-11.png",
        "BOOK-001-PAGE-12.png",
        "BOOK-001-PAGE-13.png",
        "BOOK-001-PAGE-14-TEASER.png",
    ]

    with open(concat_file, "w") as f:
        for page in pages:
            page_path = OUTPUT_DIR / page
            if page_path.exists():
                # Each page displayed for 5 seconds
                f.write(f"file '{page_path.absolute()}'\n")
                f.write(f"duration 5\n")

    print(f"✅ Created concat file: {concat_file}")
    return concat_file

def assemble_with_ffmpeg(narration_path=None):
    """Assemble video with FFmpeg"""

    # First, create image sequence video (no audio yet)
    images_video = OUTPUT_DIR / "images_sequence.mp4"

    # Create list of image files
    image_list = []
    for i in range(1, 15):
        if i == 1:
            img_path = OUTPUT_DIR / "BOOK-001-PAGE-01-COVER.png"
        elif i <= 13:
            img_path = OUTPUT_DIR / f"BOOK-001-PAGE-{i:02d}.png"
        else:
            img_path = OUTPUT_DIR / "BOOK-001-PAGE-14-TEASER.png"

        if img_path.exists():
            image_list.append(img_path)

    if not image_list:
        print("❌ No image files found!")
        return None

    # FFmpeg command to create video from images
    # Each image: 5 seconds at 30fps
    cmd = [
        "ffmpeg",
        "-y",
        "-framerate", "1/5",  # 1 frame every 5 seconds
        "-i", f"{OUTPUT_DIR}/BOOK-001-PAGE-%02d.png",  # Will need adjustment
        "-framerate", "30",
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-crf", "23",
        str(images_video)
    ]

    print(f"📹 Creating image sequence video...")
    print(f"   Using {len(image_list)} images")
    print(f"   Duration: ~{len(image_list) * 5} seconds")

    # Simpler approach: create a concat demuxer file
    concat_file = OUTPUT_DIR / "concat_list.txt"
    with open(concat_file, "w") as f:
        for img in image_list:
            f.write(f"file '{img.absolute()}'\n")
            f.write("duration 5\n")

    # Create video without audio
    cmd = [
        "ffmpeg",
        "-y",
        "-f", "concat",
        "-safe", "0",
        "-i", str(concat_file),
        "-vsync", "vfr",
        "-pix_fmt", "yuv420p",
        "-c:v", "libx264",
        "-crf", "23",
        "-preset", "medium",
        str(images_video)
    ]

    print(f"🎬 FFmpeg command: {' '.join(cmd)}")
    result = subprocess.run(cmd, capture_output=True, text=True)

    if result.returncode == 0:
        print(f"✅ Created video: {images_video}")
        return images_video
    else:
        print(f"❌ FFmpeg error: {result.stderr}")
        return None

def main():
    """Assemble complete book video"""
    print("=" * 70)
    print("📖 ASSEMBLING BOOK 1: SUNNY WATCHES THE STARS COME OUT")
    print("=" * 70)

    # Step 1: Create cover
    print("\n[1/4] Creating cover page...")
    create_cover_page()

    # Step 2: Create teaser
    print("\n[2/4] Creating teaser page...")
    create_teaser_page()

    # Step 3: Create concat file
    print("\n[3/4] Preparing image sequence...")
    create_image_sequence_txt()

    # Step 4: Assemble with FFmpeg
    print("\n[4/4] Assembling video with FFmpeg...")
    video = assemble_with_ffmpeg()

    print("\n" + "=" * 70)
    if video:
        print(f"✅ BOOK 1 VIDEO READY: {video}")
        print("\nNext steps:")
        print("1. Generate narration (ElevenLabs or use existing)")
        print("2. Merge video with audio: ffmpeg -i video.mp4 -i audio.wav -c:v copy -c:a aac output.mp4")
        print("3. Upload to YouTube")
    else:
        print("❌ Video assembly failed")
    print("=" * 70)

if __name__ == "__main__":
    main()
