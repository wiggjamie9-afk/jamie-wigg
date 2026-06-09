#!/usr/bin/env python3
"""Batch create videos for all 17 remade books (same format as BOOK-001)"""

from PIL import Image, ImageDraw, ImageFont
from pathlib import Path
import subprocess
import json
import re

# Books that needed remaking (Sonny → Sunny fix)
BOOKS_TO_CREATE = [33, 34, 35, 41, 43, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 60]

FORMATTED_BOOKS_DIR = Path("/home/user/jamie-wigg/formatted-books")
VIDEOS_DIR = Path("/home/user/jamie-wigg/sunny-bedtime-videos")
VIDEOS_DIR.mkdir(exist_ok=True)

# Colors
NAVY = (25, 45, 85)
CREAM = (245, 240, 235)
GOLD = (212, 165, 116)

WIDTH, HEIGHT = 1920, 1080

def create_page_image(text, is_cover=False, title=""):
    """Create a single page image"""
    img = Image.new('RGB', (WIDTH, HEIGHT), NAVY)
    draw = ImageDraw.Draw(img)

    try:
        title_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf", 44)
        text_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf", 38)
    except:
        title_font = ImageFont.load_default()
        text_font = ImageFont.load_default()

    if is_cover:
        draw.text((WIDTH//2 - 300, 250), "SUNNY'S COZY BEDTIME TALES", fill=GOLD, font=title_font)
        title_lines = title.split('\n')
        y = 450
        for line in title_lines:
            bbox = draw.textbbox((0, 0), line, font=text_font)
            x = (WIDTH - (bbox[2] - bbox[0])) // 2
            draw.text((x, y), line, fill=CREAM, font=text_font)
            y += 70
        draw.text((WIDTH//2 - 200, 700), "Dream Big, Little One", fill=GOLD, font=title_font)
        draw.text((WIDTH//2 - 150, 900), "By Jamie Wigg", fill=CREAM, font=text_font)
    else:
        lines = text.split('\n')
        y_pos = (HEIGHT - len(lines) * 50) // 2
        for line in lines:
            bbox = draw.textbbox((0, 0), line, font=text_font)
            x = (WIDTH - (bbox[2] - bbox[0])) // 2
            draw.text((x, y_pos), line, fill=CREAM, font=text_font)
            y_pos += 60

    return img

def extract_pages_from_book(book_num, book_path):
    """Extract pages from formatted book file"""
    with open(book_path, 'r') as f:
        content = f.read()

    # Get title
    title_match = re.search(r'STORY: (.*?)(?:\n|$)', content)
    title = title_match.group(1) if title_match else f"Book {book_num}"

    # Extract pages
    pages_raw = re.findall(r'PAGE (\d+)(.*?)(?=PAGE|\Z)', content, re.DOTALL)
    pages = []
    pages.append((title, 2.5, True))  # Cover

    for page_num, page_content in pages_raw:
        text_match = re.search(r'TEXT \(2 LINES\):(.*?)(?:ILLUSTRATION:|$)', page_content, re.DOTALL)
        if text_match:
            text = text_match.group(1).strip()
            text = '\n'.join(line.strip() for line in text.split('\n') if line.strip())
            pages.append((text, 3, False))

    return title, pages

def create_video_for_book(book_num, title, pages):
    """Create video for a single book"""
    book_dir = VIDEOS_DIR / f"book-{book_num:03d}"
    book_dir.mkdir(exist_ok=True)
    frames_dir = book_dir / "frames"
    frames_dir.mkdir(exist_ok=True)

    print(f"  📹 Creating video for Book {book_num}: {title[:40]}...")

    # Create frames
    frame_num = 0
    for page_idx, (text, duration, is_cover) in enumerate(pages):
        img = create_page_image(text, is_cover, title if is_cover else "")

        # 24 fps
        for _ in range(int(duration * 24)):
            frame_path = frames_dir / f"frame_{frame_num:05d}.png"
            img.save(frame_path, quality=75)
            frame_num += 1

    # Encode video
    output_video = book_dir / f"video-{book_num:03d}.mp4"
    cmd = f"""ffmpeg -y -framerate 24 -i {frames_dir}/frame_%05d.png \
      -c:v libx264 -preset ultrafast -crf 22 \
      -vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2" \
      {output_video}"""

    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    if result.returncode == 0:
        print(f"    ✓ Book {book_num} video created")
        return output_video
    else:
        print(f"    ⚠ Book {book_num} failed")
        return None

def main():
    print("\n" + "="*70)
    print("BATCH VIDEO CREATION: 17 Remade Books")
    print("="*70 + "\n")

    created_count = 0

    for book_num in BOOKS_TO_CREATE:
        book_file = FORMATTED_BOOKS_DIR / f"BOOK-{book_num:03d}-*.txt"
        book_files = list(FORMATTED_BOOKS_DIR.glob(f"BOOK-{book_num:03d}-*.txt"))

        if not book_files:
            print(f"⚠ Book {book_num:03d}: Not found")
            continue

        book_path = book_files[0]
        try:
            title, pages = extract_pages_from_book(book_num, book_path)
            output = create_video_for_book(book_num, title, pages)
            if output:
                created_count += 1
        except Exception as e:
            print(f"  ⚠ Error processing Book {book_num}: {e}")

    print("\n" + "="*70)
    print(f"✅ CREATED {created_count}/17 VIDEOS")
    print("="*70)
    print(f"\nVideos location: {VIDEOS_DIR}/")
    print("Ready for YouTube upload!")

if __name__ == "__main__":
    main()
