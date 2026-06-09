#!/usr/bin/env python3
"""Fast video creation with TTS narration"""

from PIL import Image, ImageDraw, ImageFont
from pathlib import Path
import subprocess
import os
import json

# Setup
VIDEO_DIR = Path("/home/user/jamie-wigg/sunny-bedtime-videos/book-001-stars")
FRAMES_DIR = VIDEO_DIR / "frames_v2"
FRAMES_DIR.mkdir(exist_ok=True)

# Colors
NAVY = (25, 45, 85)
CREAM = (245, 240, 235)
GOLD = (212, 165, 116)

WIDTH, HEIGHT = 1920, 1080

# Read reformatted book
with open('/home/user/jamie-wigg/BOOK-001-REFORMATTED.txt', 'r') as f:
    content = f.read()

# Parse pages
import re
pages_raw = re.findall(r'PAGE (\d+)(.*?)(?=PAGE|\Z)', content, re.DOTALL)
pages = []

# Extract cover
cover_match = re.search(r'BOOK COVER PAGE.*?BY: Jamie Wigg', content, re.DOTALL)
if cover_match:
    pages.append(("SUNNY'S COZY BEDTIME TALES\n\nSunny Watches the Stars Come Out\n\nDream Big, Little One\n\nBy Jamie Wigg", 2.5, True))

# Extract story pages
for page_num, page_content in pages_raw:
    text_match = re.search(r'TEXT \(2 LINES\):(.*?)(?:ILLUSTRATION:|$)', page_content, re.DOTALL)
    if text_match:
        text = text_match.group(1).strip()
        # Clean up text
        text = '\n'.join(line.strip() for line in text.split('\n') if line.strip())
        pages.append((text, 3, False))

print(f"✓ Parsed {len(pages)} pages")

# Create images fast (lower quality for speed)
def create_page_fast(text, is_cover=False):
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
        draw.text((WIDTH//2 - 280, 450), "Sunny Watches the Stars", fill=CREAM, font=text_font)
        draw.text((WIDTH//2 - 280, 520), "Come Out", fill=CREAM, font=text_font)
        draw.text((WIDTH//2 - 200, 700), "Dream Big, Little One", fill=GOLD, font=text_font)
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

print("Creating frames (fast mode)...")
frame_num = 0
for page_idx, (text, duration, is_cover) in enumerate(pages):
    img = create_page_fast(text, is_cover)
    
    # 24 fps (faster encoding)
    for _ in range(int(duration * 24)):
        frame_path = FRAMES_DIR / f"frame_{frame_num:05d}.png"
        img.save(frame_path, quality=75)
        frame_num += 1

print(f"✓ Created {frame_num} frames")
print("✓ Encoding video (fast)...")

cmd = f"""ffmpeg -y -framerate 24 -i {FRAMES_DIR}/frame_%05d.png \
  -c:v libx264 -preset ultrafast -crf 22 \
  -vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2" \
  {VIDEO_DIR}/sunny-bedtime-001-final.mp4"""

result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
if result.returncode == 0:
    print(f"✓ Video ready: sunny-bedtime-001-final.mp4")
else:
    print(f"Error: {result.stderr[:200]}")
