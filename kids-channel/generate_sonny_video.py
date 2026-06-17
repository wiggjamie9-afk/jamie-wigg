#!/usr/bin/env python3
"""
Generate a complete 1-minute Sonny the Quokka bedtime cartoon.
No API keys needed. Uses PIL for illustrations + Python for everything else.
"""

import os
import json
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import random

OUTPUT_DIR = Path(__file__).parent / "sonny_episode_output"
OUTPUT_DIR.mkdir(exist_ok=True)

# Story script
EPISODE = {
    "title": "Sonny's Magical Moonlight Adventure",
    "duration_seconds": 60,
    "narration": "Follow Sonny the quokka on a cozy journey through the Australian bush.",
    "scenes": [
        {
            "id": 1,
            "duration": 8,
            "title": "Sonny Wakes Up",
            "narration": "Tonight, Sonny the quokka wakes beneath a canopy of stars.",
            "mood": "sleepy, warm",
        },
        {
            "id": 2,
            "duration": 10,
            "title": "The Glow Appears",
            "narration": "A mysterious golden glow appears in the distance, dancing through the gum trees.",
            "mood": "magical, wonder",
        },
        {
            "id": 3,
            "duration": 8,
            "title": "Fireflies Dance",
            "narration": "Hundreds of fireflies swirl around him, creating a river of light.",
            "mood": "enchanted, playful",
        },
        {
            "id": 4,
            "duration": 10,
            "title": "Moonlit Clearing",
            "narration": "Sonny steps into a moonlit clearing where wildflowers shimmer with dewdrops.",
            "mood": "peaceful, serene",
        },
        {
            "id": 5,
            "duration": 10,
            "title": "New Friends",
            "narration": "Other forest creatures gather, all drawn to the magic of this special night.",
            "mood": "joyful, connection",
        },
        {
            "id": 6,
            "duration": 9,
            "title": "Safe Rest",
            "narration": "As dawn approaches, Sonny curls up in the soft grass, dreaming of tomorrow's adventures.",
            "mood": "cozy, restful",
        },
        {
            "id": 7,
            "duration": 5,
            "title": "Goodnight Sonny",
            "narration": "The End. Goodnight, friends.",
            "mood": "tender, goodbye",
        },
    ]
}

# Scene palettes: (top_r, top_g, top_b, bot_r, bot_g, bot_b, highlight_r, highlight_g, highlight_b)
PALETTES = [
    ((255, 180, 100), (140, 100, 180), (200, 150, 80)),   # 1: sunset → lavender
    ((80, 120, 170), (30, 50, 90), (100, 150, 255)),      # 2: twilight
    ((10, 30, 60), (40, 60, 120), (150, 200, 255)),       # 3: night with stars
    ((20, 50, 80), (10, 20, 50), (100, 180, 200)),        # 4: deep night
    ((15, 25, 60), (5, 10, 40), (80, 120, 200)),          # 5: midnight
    ((40, 60, 100), (15, 25, 50), (120, 180, 220)),       # 6: pre-dawn
    ((180, 140, 200), (100, 80, 140), (255, 200, 150)),   # 7: farewell
]

def generate_scene_illustration(scene: dict, idx: int) -> Path:
    """Generate a beautiful PIL illustration for a scene."""
    W, H = 1280, 720
    img = Image.new("RGB", (W, H))
    draw = ImageDraw.Draw(img)

    scene_id = scene["id"]
    top_col, bot_col, highlight = PALETTES[idx % len(PALETTES)]

    # Gradient sky
    for y in range(H):
        ratio = y / H
        r = int(top_col[0] + (bot_col[0] - top_col[0]) * ratio)
        g = int(top_col[1] + (bot_col[1] - top_col[1]) * ratio)
        b = int(top_col[2] + (bot_col[2] - top_col[2]) * ratio)
        draw.line([(0, y), (W, y)], fill=(r, g, b))

    # Stars
    rng = random.Random(scene_id * 42)
    for _ in range(60 + scene_id * 8):
        sx = rng.randint(0, W)
        sy = rng.randint(0, int(H * 0.6))
        sr = rng.choice([1, 1, 2])
        brightness = rng.randint(200, 255)
        draw.ellipse([sx - sr, sy - sr, sx + sr, sy + sr],
                     fill=(brightness, brightness, brightness - 30))

    # Moon
    moon_x, moon_y = int(W * 0.75), int(H * 0.2)
    for glow_r in range(80, 0, -3):
        alpha = int(40 * (1 - glow_r / 80))
        glow_col = (highlight[0] - alpha, highlight[1] - alpha // 2, highlight[2] - alpha // 3)
        draw.ellipse([moon_x - glow_r, moon_y - glow_r,
                      moon_x + glow_r, moon_y + glow_r],
                     fill=glow_col)
    draw.ellipse([moon_x - 50, moon_y - 50, moon_x + 50, moon_y + 50],
                 fill=(255, 250, 200))

    # Gum trees silhouettes
    def draw_tree(cx, base_y, trunk_h, spread):
        draw.rectangle([cx - 6, base_y - trunk_h, cx + 6, base_y],
                        fill=(20, 15, 8))
        for _ in range(6):
            bx = cx + rng.randint(-spread, spread)
            by = base_y - trunk_h + rng.randint(-30, 20)
            br = rng.randint(40, 80)
            draw.ellipse([bx - br, by - br, bx + br, by + br],
                          fill=(25 + rng.randint(0, 20),
                                40 + rng.randint(0, 25),
                                15 + rng.randint(0, 15)))

    ground_y = int(H * 0.7)
    for tx, ty, th, ts in [(100, ground_y, 200, 50),
                            (280, ground_y, 240, 60),
                            (W - 120, ground_y, 210, 55),
                            (W - 280, ground_y, 230, 50)]:
        draw_tree(tx, ty, th, ts)

    # Fireflies (more for later scenes)
    for _ in range(5 + scene_id * 3):
        fx = rng.randint(0, W)
        fy = rng.randint(int(H * 0.1), int(H * 0.6))
        for glow_size in range(15, 0, -2):
            glow_brightness = int(255 * (1 - glow_size / 15))
            glow_col = (glow_brightness, glow_brightness - 50, 50)
            draw.ellipse([fx - glow_size, fy - glow_size,
                          fx + glow_size, fy + glow_size],
                         fill=glow_col)
        draw.ellipse([fx - 2, fy - 2, fx + 2, fy + 2], fill=(255, 255, 100))

    # Sonny the quokka (center, simple silhouette)
    qx, qy = W // 2, ground_y - 30
    # Body
    draw.ellipse([qx - 35, qy - 45, qx + 35, qy + 10], fill=(80, 60, 35))
    # Head
    draw.ellipse([qx - 22, qy - 75, qx + 22, qy - 35], fill=(100, 75, 45))
    # Ears
    draw.ellipse([qx - 28, qy - 95, qx - 8, qy - 60], fill=(85, 65, 40))
    draw.ellipse([qx + 8, qy - 95, qx + 28, qy - 60], fill=(85, 65, 40))
    # Eyes (warm glow)
    draw.ellipse([qx - 10, qy - 60, qx - 3, qy - 52], fill=(220, 180, 100))
    draw.ellipse([qx + 3, qy - 60, qx + 10, qy - 52], fill=(220, 180, 100))
    # Smile
    draw.arc([qx - 8, qy - 48, qx + 8, qy - 38], 0, 180, fill=(220, 150, 80), width=2)

    # Scene title at top
    try:
        font_title = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 48)
    except:
        font_title = ImageFont.load_default()

    title_text = scene["title"]
    bbox = draw.textbbox((0, 0), title_text, font=font_title)
    title_x = (W - (bbox[2] - bbox[0])) // 2
    draw.text((title_x + 2, 25), title_text, font=font_title, fill=(0, 0, 0))
    draw.text((title_x, 22), title_text, font=font_title, fill=(255, 240, 200))

    # Narration at bottom
    try:
        font_narration = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 28)
    except:
        font_narration = ImageFont.load_default()

    narration = scene["narration"]
    wrapped_lines = []
    words = narration.split()
    current_line = []
    for word in words:
        test_line = " ".join(current_line + [word])
        bbox = draw.textbbox((0, 0), test_line, font=font_narration)
        if (bbox[2] - bbox[0]) > W - 60:
            if current_line:
                wrapped_lines.append(" ".join(current_line))
            current_line = [word]
        else:
            current_line.append(word)
    if current_line:
        wrapped_lines.append(" ".join(current_line))

    y_pos = H - 100
    for line in wrapped_lines[-3:]:  # Show last 3 lines
        bbox = draw.textbbox((0, 0), line, font=font_narration)
        x_pos = (W - (bbox[2] - bbox[0])) // 2
        draw.text((x_pos + 1, y_pos + 1), line, font=font_narration, fill=(0, 0, 0))
        draw.text((x_pos, y_pos), line, font=font_narration, fill=(255, 250, 200))
        y_pos += 40

    # Save
    img_path = OUTPUT_DIR / f"scene_{scene_id:02d}.png"
    img.save(img_path, "PNG")
    print(f"  ✓ Scene {scene_id}: {scene['title']}")
    return img_path

def main():
    print("\n🎬 Generating Sonny's Magical Moonlight Adventure (1-minute cartoon)")
    print(f"📁 Output: {OUTPUT_DIR}\n")

    # Generate all scene illustrations
    print("🎨 Generating scene illustrations...")
    scene_files = []
    for idx, scene in enumerate(EPISODE["scenes"]):
        img_path = generate_scene_illustration(scene, idx)
        scene_files.append((scene, img_path))

    # Save episode metadata
    metadata = {
        "title": EPISODE["title"],
        "total_duration_seconds": EPISODE["duration_seconds"],
        "scenes": [
            {
                "id": s["id"],
                "title": s["title"],
                "duration": s["duration"],
                "narration": s["narration"],
                "mood": s["mood"],
                "image_file": f"scene_{s['id']:02d}.png"
            }
            for s in EPISODE["scenes"]
        ]
    }

    metadata_path = OUTPUT_DIR / "episode_metadata.json"
    with open(metadata_path, "w") as f:
        json.dump(metadata, f, indent=2)

    # Print complete narration script
    script_path = OUTPUT_DIR / "NARRATION_SCRIPT.txt"
    with open(script_path, "w") as f:
        f.write(f"EPISODE: {EPISODE['title']}\n")
        f.write(f"DURATION: {EPISODE['duration_seconds']} seconds\n")
        f.write("=" * 70 + "\n\n")

        total_time = 0
        for scene in EPISODE["scenes"]:
            f.write(f"SCENE {scene['id']} — {scene['title']} ({scene['duration']}s)\n")
            f.write(f"Mood: {scene['mood']}\n")
            f.write(f"Narration: {scene['narration']}\n")
            f.write(f"Image: scene_{scene['id']:02d}.png\n")
            f.write("-" * 70 + "\n")
            total_time += scene["duration"]

        f.write(f"\nTOTAL DURATION: {total_time} seconds\n")

    print(f"\n✅ COMPLETE! Sonny's 1-minute cartoon is ready.\n")
    print(f"📁 Files saved to: {OUTPUT_DIR}")
    print(f"\n📋 What you have:")
    print(f"   • 7 scene illustrations (PNG images)")
    print(f"   • Complete narration script (NARRATION_SCRIPT.txt)")
    print(f"   • Episode metadata (episode_metadata.json)")
    print(f"\n🎬 Next steps to make it a video:")
    print(f"   1. Use any free video editor (DaVinci, CapCut, etc.)")
    print(f"   2. Import the 7 PNG scene images in order")
    print(f"   3. Set each image's duration (listed above)")
    print(f"   4. Add narration using NARRATION_SCRIPT.txt")
    print(f"   5. Add background music (royalty-free lullaby)")
    print(f"   6. Export as MP4")
    print(f"\n   OR use our kids-channel pipeline once you have an API key")
    print(f"\n🎬 Preview: Open {OUTPUT_DIR}/scene_01.png to see the style")

if __name__ == "__main__":
    main()
