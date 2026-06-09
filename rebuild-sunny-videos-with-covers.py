#!/usr/bin/env python3
"""
Rebuild all 17 Sunny's Bedtime Tales videos with:
- Page 0: Illustrated cover with "By Jamie Wigg" attribution
- Pages 1-16: Story text content
- Page 17: Teaser for next book
"""

import os
import shutil
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import subprocess
import json

# Define the 17 books and their mappings
BOOKS = [
    {"num": 33, "slug": "sunny-and-the-flying-fox", "title": "Sunny and the Flying Fox", "next": 34},
    {"num": 34, "slug": "sunny-and-the-fog", "title": "Sunny and the Fog", "next": 35},
    {"num": 35, "slug": "sunny-and-the-gentle-breeze", "title": "Sunny and the Gentle Breeze", "next": 41},
    {"num": 41, "slug": "sunny-and-the-gentle-stream", "title": "Sunny and the Gentle Stream", "next": 43},
    {"num": 43, "slug": "sunny-and-the-gentle-thunder", "title": "Sunny and the Gentle Thunder", "next": 46},
    {"num": 46, "slug": "sunny-and-the-golden-hour", "title": "Sunny and the Golden Hour", "next": 47},
    {"num": 47, "slug": "sunny-and-the-gumnut-babies", "title": "Sunny and the Gumnut Babies", "next": 48},
    {"num": 48, "slug": "sunny-and-the-hidden-star", "title": "Sunny and the Hidden Star", "next": 49},
    {"num": 49, "slug": "sunny-and-the-honey-bee", "title": "Sunny and the Honey Bee", "next": 50},
    {"num": 50, "slug": "sunny-and-the-kangaroo-joey", "title": "Sunny and the Kangaroo Joey", "next": 51},
    {"num": 51, "slug": "sunny-and-the-kookaburra-chick", "title": "Sunny and the Kookaburra Chick", "next": 52},
    {"num": 52, "slug": "sunny-and-the-lily-pads", "title": "Sunny and the Lily Pads", "next": 53},
    {"num": 53, "slug": "sunny-and-the-little-gecko", "title": "Sunny and the Little Gecko", "next": 54},
    {"num": 54, "slug": "sunny-and-the-little-quoll", "title": "Sunny and the Little Quoll", "next": 55},
    {"num": 55, "slug": "sunny-and-the-little-turtle", "title": "Sunny and the Little Turtle", "next": 56},
    {"num": 56, "slug": "sunny-and-the-lorikeet-rainbow", "title": "Sunny and the Lorikeet Rainbow", "next": 60},
    {"num": 60, "slug": "sunny-and-the-lyrebird", "title": "Sunny and the Lyrebird", "next": None},
]

BOOKS_DIR = Path("/home/user/jamie-wigg/SUNNY-17-FINAL-UPLOAD")
EPISODES_DIR = Path("/home/user/jamie-wigg/kids-channel/episodes")

def resize_and_pad_to_1080p(img):
    """Resize image to 1920x1080 maintaining aspect ratio with pillarbox/letterbox."""
    target_width, target_height = 1920, 1080
    img.thumbnail((target_width, target_height), Image.Resampling.LANCZOS)

    # Create new image with target size and white background
    new_img = Image.new("RGB", (target_width, target_height), (25, 45, 85))
    x = (target_width - img.width) // 2
    y = (target_height - img.height) // 2
    new_img.paste(img, (x, y))
    return new_img

def add_attribution_to_cover(cover_path, output_path, attribution="By Jamie Wigg"):
    """Add 'By Jamie Wigg' attribution to the cover in small text at bottom center."""
    img = Image.open(cover_path).convert("RGB")
    img = resize_and_pad_to_1080p(img)
    draw = ImageDraw.Draw(img)

    # Try to load a font, fall back to default if not available
    try:
        font_size = 28
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", font_size)
    except:
        font = ImageFont.load_default()

    # Get image dimensions
    width, height = img.size

    # Draw attribution text at bottom center
    text = attribution
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]

    x = (width - text_width) // 2
    y = height - text_height - 30  # 30 pixels from bottom

    # Draw with subtle shadow for readability
    shadow_offset = 2
    draw.text((x - shadow_offset, y), text, font=font, fill=(0, 0, 0))
    draw.text((x, y), text, font=font, fill=(255, 255, 255))

    img.save(output_path)
    print(f"✓ Added attribution to cover: {output_path}")

def create_teaser_page(book_num, next_book_num, next_book_title, output_path):
    """Create Page 17: teaser for next book."""
    if next_book_num is None:
        # Last book - create a closing page
        img = Image.new("RGB", (1920, 1080), color=(25, 45, 85))
        draw = ImageDraw.Draw(img)

        try:
            title_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 72)
            text_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 48)
        except:
            title_font = text_font = ImageFont.load_default()

        # Closing message
        draw.text((960, 450), "Thank you for joining Sunny!", font=title_font, fill=(255, 255, 255), anchor="mm")
        draw.text((960, 600), "Sweet dreams", font=text_font, fill=(200, 200, 255), anchor="mm")
    else:
        # Next book teaser
        img = Image.new("RGB", (1920, 1080), color=(25, 45, 85))
        draw = ImageDraw.Draw(img)

        try:
            title_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 64)
            text_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 48)
        except:
            title_font = text_font = ImageFont.load_default()

        # Teaser text
        draw.text((960, 350), "Coming next...", font=text_font, fill=(200, 200, 255), anchor="mm")
        draw.text((960, 550), next_book_title, font=title_font, fill=(255, 255, 255), anchor="mm")
        draw.text((960, 750), f"Book {next_book_num}", font=text_font, fill=(150, 200, 255), anchor="mm")

    img.save(output_path)
    print(f"✓ Created teaser page: {output_path}")

def rebuild_book_video(book_info):
    """Rebuild a single book's video with illustrated cover."""
    book_num = book_info["num"]
    book_slug = book_info["slug"]
    book_title = book_info["title"]
    next_num = book_info["next"]
    next_title = None

    # Find next book's title
    if next_num:
        for b in BOOKS:
            if b["num"] == next_num:
                next_title = b["title"]
                break

    book_dir = BOOKS_DIR / f"book-{book_num:03d}"
    pages_dir = book_dir / "pages"
    episodes_dir = EPISODES_DIR / book_slug

    print(f"\n📖 Processing Book {book_num}: {book_title}")

    # Step 1: Add cover with attribution
    if episodes_dir.exists() and (episodes_dir / "cover.jpg").exists():
        cover_with_attr = pages_dir / "page-00.png"
        add_attribution_to_cover(episodes_dir / "cover.jpg", cover_with_attr)
    else:
        print(f"⚠️  Cover not found for {book_slug}")
        return False

    # Step 2: Resize existing story pages (pages 1-16) to 1920x1080
    for i in range(1, 17):
        page_file = pages_dir / f"page-{i:02d}.png"
        if page_file.exists():
            img = Image.open(page_file).convert("RGB")
            img_resized = resize_and_pad_to_1080p(img)
            img_resized.save(page_file)

    # Step 3: Create teaser page (page-17)
    teaser_path = pages_dir / "page-17.png"
    create_teaser_page(book_num, next_num, next_title, teaser_path)

    # Step 4: Regenerate video with all 18 pages
    video_path = book_dir / f"BOOK-{book_num:03d}-UPLOAD.mp4"

    try:
        # Create concat.txt for FFmpeg
        concat_file = book_dir / "concat_new.txt"
        with open(concat_file, "w") as f:
            # Each page for 8.8 seconds (18 pages × 8.8s = 158.4s ≈ 2m 38s)
            for i in range(18):
                page_file = pages_dir / f"page-{i:02d}.png"
                if page_file.exists():
                    f.write(f"file '{page_file}'\n")
                    f.write("duration 8.8\n")

        # Generate video using ffmpeg with proper 1920x1080 settings
        cmd = [
            "ffmpeg", "-y",
            "-f", "concat",
            "-safe", "0",
            "-i", str(concat_file),
            "-fps_mode", "vfr",
            "-vf", "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2",
            "-pix_fmt", "yuv420p",
            "-c:v", "libx264",
            "-crf", "23",
            str(video_path)
        ]

        result = subprocess.run(cmd, capture_output=True, text=True, timeout=300)
        if result.returncode == 0:
            print(f"✓ Video regenerated: {video_path}")
            # Clean up temp concat file
            concat_file.unlink()
            return True
        else:
            print(f"✗ FFmpeg error: {result.stderr[-500:]}")  # Last 500 chars
            return False
    except subprocess.TimeoutExpired:
        print(f"✗ FFmpeg timeout (video generation taking too long)")
        return False
    except Exception as e:
        print(f"✗ Error rebuilding video: {e}")
        return False

def main():
    print("🎬 REBUILDING 17 SUNNY VIDEOS WITH ILLUSTRATED COVERS\n")
    print(f"Source: {BOOKS_DIR}")
    print(f"Episodes: {EPISODES_DIR}")

    success_count = 0
    failed_books = []

    for book_info in BOOKS:
        if rebuild_book_video(book_info):
            success_count += 1
        else:
            failed_books.append(book_info["num"])

    print(f"\n{'='*60}")
    print(f"✅ Rebuilt {success_count}/{len(BOOKS)} videos successfully")
    if failed_books:
        print(f"⚠️  Failed books: {failed_books}")
    print(f"{'='*60}")

if __name__ == "__main__":
    main()
