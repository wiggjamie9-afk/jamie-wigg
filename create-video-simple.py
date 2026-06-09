#!/usr/bin/env python3
"""Create bedtime story video using PIL and FFmpeg"""

from PIL import Image, ImageDraw, ImageFont
from pathlib import Path
import subprocess
import os

# Setup
VIDEO_DIR = Path("/home/user/jamie-wigg/sunny-bedtime-videos/book-001-stars")
FRAMES_DIR = VIDEO_DIR / "frames"
FRAMES_DIR.mkdir(exist_ok=True)

# Colors (Navy/Cream/Gold)
NAVY = (25, 45, 85)
CREAM = (245, 240, 235)
GOLD = (212, 165, 116)

# Dimensions
WIDTH, HEIGHT = 1920, 1080

# Pages with timing (seconds per page)
pages = [
    ("SUNNY'S COZY BEDTIME TALES\n\nSunny Watches the Stars Come Out\n\nDream Big, Little One\n\nBy Jamie Wigg", 3, True),  # Cover
    ("As the warm golden afternoon faded gently away, little Sunny the quokka sat on his favourite mossy rock and looked up at the sky.", 5, False),
    ("The sky was turning the most beautiful colours Sunny had ever seen. Soft pink, like the inside of a flower. Warm orange, like a ripe peach.", 5, False),
    ("And then, slowly, a deep, soft purple began to spread across the sky, like a cosy blanket being pulled up high. Sunny smiled his gentle smile.", 5, False),
    ("He had never stayed up to watch the evening come before. The bush grew quiet. The birds settled into their nests.", 5, False),
    ("The crickets began their soft, steady song — cree cree cree — like tiny lullabies all around.", 4, False),
    ("Sunny waited, very still, his big warm eyes wide with wonder. And then — there it was. One tiny light, twinkling in the purple sky.", 5, False),
    ("'Oh,' said Sunny, very quietly. Then another. And another. One by one, the stars came out to say hello.", 5, False),
    ("Each one a small, soft sparkle, like someone had sprinkled glitter across a dark velvet cloth. Sunny had never seen anything so beautiful.", 5, False),
    ("He lay back on his mossy rock, looking up and up at all the tiny lights. There were so many of them.", 5, False),
    ("Enough for everyone to have their very own. The warm breeze moved gently through the eucalyptus leaves. Shhhh. Shhhh.", 4, False),
    ("Sunny's eyes grew heavy. The stars twinkled on, one by one, keeping watch through the night.", 4, False),
    ("And as Sunny drifted off to sleep, a tiny smile stayed on his face. Because now he knew — even in the dark, the sky was full of light.", 5, False),
    ("Goodnight, Sunny. Goodnight, stars. Goodnight, little one.", 3, False),
]

def create_page(text, page_num, is_cover=False):
    """Create a single page image"""
    img = Image.new('RGB', (WIDTH, HEIGHT), NAVY)
    draw = ImageDraw.Draw(img)
    
    # Try to use a nice font, fall back to default
    try:
        title_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf", 48)
        text_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf", 40)
    except:
        title_font = ImageFont.load_default()
        text_font = ImageFont.load_default()
    
    if is_cover:
        # Cover page
        title_bbox = draw.textbbox((0, 0), "SUNNY'S COZY BEDTIME TALES", font=title_font)
        title_x = (WIDTH - (title_bbox[2] - title_bbox[0])) // 2
        draw.text((title_x, 200), "SUNNY'S COZY BEDTIME TALES", fill=GOLD, font=title_font)
        
        subtitle_bbox = draw.textbbox((0, 0), "Sunny Watches the Stars Come Out", font=text_font)
        subtitle_x = (WIDTH - (subtitle_bbox[2] - subtitle_bbox[0])) // 2
        draw.text((subtitle_x, 400), "Sunny Watches the Stars Come Out", fill=CREAM, font=text_font)
        
        tagline_bbox = draw.textbbox((0, 0), "Dream Big, Little One", font=text_font)
        tagline_x = (WIDTH - (tagline_bbox[2] - tagline_bbox[0])) // 2
        draw.text((tagline_x, 650), "Dream Big, Little One", fill=GOLD, font=text_font)
        
        draw.text((WIDTH//2 - 50, 850), "By Jamie Wigg", fill=CREAM, font=text_font)
    else:
        # Story page
        page_text_bbox = draw.textbbox((0, 0), str(page_num), font=text_font)
        draw.text((WIDTH - 150, 40), str(page_num), fill=GOLD, font=text_font)
        
        # Wrap text
        words = text.split()
        lines = []
        current_line = []
        for word in words:
            current_line.append(word)
            test_line = " ".join(current_line)
            bbox = draw.textbbox((0, 0), test_line, font=text_font)
            if bbox[2] - bbox[0] > 1700:
                lines.append(" ".join(current_line[:-1]))
                current_line = [word]
        if current_line:
            lines.append(" ".join(current_line))
        
        y_offset = (HEIGHT - len(lines) * 60) // 2
        for line in lines:
            bbox = draw.textbbox((0, 0), line, font=text_font)
            x = (WIDTH - (bbox[2] - bbox[0])) // 2
            draw.text((x, y_offset), line, fill=CREAM, font=text_font)
            y_offset += 70
    
    return img

print("Creating page images...")
frame_num = 0
for page_idx, (text, duration, is_cover) in enumerate(pages):
    page_num = page_idx if not is_cover else "Cover"
    img = create_page(text, page_num, is_cover)
    
    # Save frame for each second of duration
    for _ in range(duration * 30):  # 30 fps
        frame_path = FRAMES_DIR / f"frame_{frame_num:05d}.png"
        img.save(frame_path)
        frame_num += 1

print(f"✓ Created {frame_num} frames")

# Create video from frames
print("Encoding video (this takes 2-3 minutes)...")
cmd = f"""
ffmpeg -y -framerate 30 -i {FRAMES_DIR}/frame_%05d.png \
  -c:v libx264 -preset slow -crf 18 \
  -vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2" \
  {VIDEO_DIR}/sunny-bedtime-001.mp4
"""
result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
if result.returncode == 0:
    print(f"✓ Video created: {VIDEO_DIR}/sunny-bedtime-001.mp4")
else:
    print(f"Error: {result.stderr}")
