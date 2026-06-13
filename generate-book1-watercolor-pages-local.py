#!/usr/bin/env python3
"""
Generate 16 watercolor-style story pages for Book 1: Sunny Watches the Stars Come Out
Uses PIL only (no APIs, completely local, free)
"""

from PIL import Image, ImageDraw
import math
import random
from pathlib import Path

OUTPUT_DIR = Path("BOOK-1-ILLUSTRATED-PAGES")
OUTPUT_DIR.mkdir(exist_ok=True)

# Page dimensions (1920x1080 for YouTube)
WIDTH, HEIGHT = 1920, 1080

# Color palette that transitions: golden hour → twilight → deep night
COLOR_PALETTE = {
    "page_2_3": {
        "sky_top": (255, 180, 100),     # Golden
        "sky_bottom": (240, 140, 80),   # Orange
        "ground": (200, 180, 100),      # Warm tan
        "accent": (210, 190, 120),      # Light gold
    },
    "page_4_5": {
        "sky_top": (220, 120, 100),     # Warm red-orange
        "sky_bottom": (200, 80, 120),   # Purple-pink
        "ground": (180, 160, 100),      # Darker tan
        "accent": (150, 120, 150),      # Muted purple
    },
    "page_6_7": {
        "sky_top": (180, 100, 150),     # Purple
        "sky_bottom": (120, 80, 180),   # Deep purple
        "ground": (140, 120, 100),      # Dark tan
        "accent": (100, 80, 140),       # Deep purple-blue
    },
    "page_8_9": {
        "sky_top": (100, 80, 160),      # Deep purple-blue
        "sky_bottom": (50, 40, 100),    # Very deep blue
        "ground": (80, 70, 100),        # Dark blue-grey
        "accent": (40, 30, 80),         # Deep navy
    },
    "page_10_11": {
        "sky_top": (60, 50, 120),       # Navy
        "sky_bottom": (30, 25, 80),     # Deep navy
        "ground": (50, 45, 80),         # Dark blue-grey
        "accent": (20, 15, 60),         # Very deep blue
    },
    "page_12_13": {
        "sky_top": (40, 35, 100),       # Deep navy
        "sky_bottom": (20, 15, 60),     # Near black-blue
        "ground": (35, 30, 60),         # Very dark blue
        "accent": (15, 10, 40),         # Black-blue
    },
}

def get_colors_for_page(page_num):
    """Get color palette for a specific page"""
    if page_num in (2, 3):
        return COLOR_PALETTE["page_2_3"]
    elif page_num in (4, 5):
        return COLOR_PALETTE["page_4_5"]
    elif page_num in (6, 7):
        return COLOR_PALETTE["page_6_7"]
    elif page_num in (8, 9):
        return COLOR_PALETTE["page_8_9"]
    elif page_num in (10, 11):
        return COLOR_PALETTE["page_10_11"]
    else:  # 12, 13
        return COLOR_PALETTE["page_12_13"]

def draw_sky_gradient(draw, colors):
    """Draw a gradient sky from top to bottom"""
    top_color = colors["sky_top"]
    bottom_color = colors["sky_bottom"]

    for y in range(HEIGHT):
        progress = y / HEIGHT
        r = int(top_color[0] + (bottom_color[0] - top_color[0]) * progress)
        g = int(top_color[1] + (bottom_color[1] - top_color[1]) * progress)
        b = int(top_color[2] + (bottom_color[2] - top_color[2]) * progress)
        # Add slight watercolor noise
        noise = random.randint(-5, 5)
        r = max(0, min(255, r + noise))
        g = max(0, min(255, g + noise))
        b = max(0, min(255, b + noise))
        draw.line([(0, y), (WIDTH, y)], fill=(r, g, b))

def draw_ground(draw, colors):
    """Draw ground/grass area"""
    ground_color = colors["ground"]
    draw.rectangle([(0, int(HEIGHT * 0.65)), (WIDTH, HEIGHT)], fill=ground_color)

    # Add some grass variation
    for i in range(0, WIDTH, 20):
        var = random.randint(-10, 10)
        grass_y = int(HEIGHT * 0.65) + var
        draw.line([(i, grass_y), (i+10, grass_y+5)], fill=tuple(max(0, min(255, c-20)) for c in ground_color), width=2)

def draw_stars(draw, page_num, colors):
    """Draw stars in the sky (more stars as night falls)"""
    # Star count increases as pages progress
    star_density = min(200, (page_num - 1) * 20)

    random.seed(page_num)  # Consistent stars per page
    for _ in range(star_density):
        x = random.randint(100, WIDTH - 100)
        y = random.randint(50, int(HEIGHT * 0.65))

        star_size = random.randint(1, 3)
        brightness = random.randint(150, 255)

        # Draw star (simple dot, can be brightened for later pages)
        draw.ellipse(
            [(x - star_size, y - star_size), (x + star_size, y + star_size)],
            fill=(brightness, brightness - 20, brightness - 40)
        )

def draw_trees(draw, colors):
    """Draw silhouetted trees"""
    tree_color = tuple(max(0, c - 40) for c in colors["ground"])

    # Left tree
    trunk_x, trunk_y = 200, int(HEIGHT * 0.6)
    trunk_height = int(HEIGHT * 0.35)
    draw.rectangle([(trunk_x - 20, trunk_y), (trunk_x + 20, trunk_y + trunk_height)], fill=tree_color)
    draw.ellipse([(trunk_x - 120, trunk_y - 150), (trunk_x + 120, trunk_y)], fill=tree_color)

    # Right tree
    trunk_x2, trunk_y2 = WIDTH - 200, int(HEIGHT * 0.6)
    draw.rectangle([(trunk_x2 - 15, trunk_y2), (trunk_x2 + 15, trunk_y2 + trunk_height)], fill=tree_color)
    draw.ellipse([(trunk_x2 - 100, trunk_y2 - 120), (trunk_x2 + 100, trunk_y2)], fill=tree_color)

def draw_sunny(draw, x, y, size, color=(220, 190, 130)):
    """Draw Sunny the quokka (improved from concept art)"""
    brown = (139, 90, 43)
    cream = (245, 241, 232)

    # Body (round, chubby)
    draw.ellipse(
        [(x - size, y - size), (x + size, y + size)],
        fill=color,
        outline=brown,
        width=3
    )

    # Head
    head_size = int(size * 0.8)
    draw.ellipse(
        [(x - head_size, y - head_size * 1.5), (x + head_size, y - size // 2)],
        fill=color,
        outline=brown,
        width=3
    )

    # Ears
    ear_offset = int(size * 0.5)
    draw.ellipse(
        [(x - ear_offset - int(size * 0.3), y - head_size), (x - ear_offset + int(size * 0.2), y - head_size + int(size * 0.4))],
        fill=color,
        outline=brown,
        width=2
    )
    draw.ellipse(
        [(x + ear_offset - int(size * 0.2), y - head_size), (x + ear_offset + int(size * 0.3), y - head_size + int(size * 0.4))],
        fill=color,
        outline=brown,
        width=2
    )

    # Eyes (large, gentle, warm brown)
    eye_y = y - int(size * 0.8)
    eye_offset = int(size * 0.35)
    eye_size = int(size * 0.15)

    # Left eye white
    draw.ellipse(
        [(x - eye_offset - eye_size, eye_y - eye_size), (x - eye_offset + eye_size, eye_y + eye_size)],
        fill=cream,
        outline=brown,
        width=2
    )
    # Right eye white
    draw.ellipse(
        [(x + eye_offset - eye_size, eye_y - eye_size), (x + eye_offset + eye_size, eye_y + eye_size)],
        fill=cream,
        outline=brown,
        width=2
    )

    # Pupils (warm brown, kind expression)
    pupil_size = int(size * 0.07)
    pupil_color = (120, 80, 60)
    draw.ellipse(
        [(x - eye_offset - pupil_size, eye_y - pupil_size), (x - eye_offset + pupil_size, eye_y + pupil_size)],
        fill=pupil_color
    )
    draw.ellipse(
        [(x + eye_offset - pupil_size, eye_y - pupil_size), (x + eye_offset + pupil_size, eye_y + pupil_size)],
        fill=pupil_color
    )

    # Nose
    nose_y = eye_y + int(size * 0.3)
    draw.ellipse(
        [(x - int(size * 0.08), nose_y - int(size * 0.08)), (x + int(size * 0.08), nose_y + int(size * 0.08))],
        fill=brown
    )

    # Smile (gentle, peaceful)
    mouth_y = nose_y + int(size * 0.15)
    draw.arc(
        [(x - int(size * 0.25), mouth_y - int(size * 0.1)), (x + int(size * 0.25), mouth_y + int(size * 0.15))],
        0, 180,
        fill=brown,
        width=3
    )

def generate_page(page_num):
    """Generate a single watercolor page"""
    # Create image with background color
    colors = get_colors_for_page(page_num)
    img = Image.new("RGB", (WIDTH, HEIGHT), colors["sky_top"])
    draw = ImageDraw.Draw(img, 'RGBA')

    # Draw sky gradient
    draw_sky_gradient(draw, colors)

    # Draw trees (silhouettes)
    draw_trees(draw, colors)

    # Draw ground
    draw_ground(draw, colors)

    # Draw stars (increasing as night falls)
    if page_num >= 7:
        draw_stars(draw, page_num, colors)

    # Draw Sunny in different positions based on page
    sunny_color = (220, 190, 130)  # Golden-brown

    # Vary Sunny's position slightly per page for natural feel
    positions = [
        (400, 650),   # Page 2: sitting left
        (500, 700),   # Page 3: sitting center-left
        (450, 680),   # Page 4: sitting left-center
        (550, 700),   # Page 5: sitting center
        (600, 680),   # Page 6: sitting right-center
        (500, 720),   # Page 7: sitting center
        (400, 700),   # Page 8: sitting left
        (700, 740),   # Page 9: lying down right
        (600, 750),   # Page 10: lying down center-right
        (500, 760),   # Page 11: lying down center
        (550, 770),   # Page 12: lying down
        (500, 780),   # Page 13: lying down (sleeping)
    ]

    if page_num >= 2 and page_num <= 13:
        x, y = positions[page_num - 2]
        draw_sunny(draw, x, y, 80, sunny_color)

    # Save page
    output_path = OUTPUT_DIR / f"BOOK-001-PAGE-{page_num:02d}.png"
    img.save(output_path, quality=95)
    print(f"✅ Generated: {output_path}")

    return output_path

def main():
    """Generate all 16 pages"""
    print("🎨 Generating Book 1 watercolor story pages...")
    print("=" * 60)

    pages = []

    # Pages 2-13 (story content)
    for page_num in range(2, 14):
        path = generate_page(page_num)
        pages.append(path)

    # Page 1 (cover) - special
    print("✅ Cover and end pages can be created separately")

    print("=" * 60)
    print(f"✅ Generated {len(pages)} story pages in {OUTPUT_DIR}/")
    print(f"Total: 12 story pages ready for assembly")
    print(f"\nNext steps:")
    print(f"1. Review pages in {OUTPUT_DIR}/")
    print(f"2. Add cover (page 1) and teaser (page 14+)")
    print(f"3. Assemble into video with narration")
    print(f"4. Upload to YouTube")

if __name__ == "__main__":
    main()
