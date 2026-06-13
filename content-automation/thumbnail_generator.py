#!/usr/bin/env python3
"""
Automated YouTube/Social Media Thumbnail Generator
Generates eye-catching thumbnails with text, colors, and branding
"""

import argparse
import os
from PIL import Image, ImageDraw, ImageFont
from pathlib import Path

# Default colors (customizable)
COLORS = {
    "background": "#1a1a2e",
    "accent": "#0891b2",  # Event platform cyan
    "text": "#ffffff",
    "highlight": "#a855f7",
}

FONTS = {
    "title": None,  # Use default if system font unavailable
    "subtitle": None,
}

def generate_thumbnail(
    title: str,
    subtitle: str = "",
    background_color: str = COLORS["background"],
    accent_color: str = COLORS["accent"],
    output_path: str = "thumbnail.png",
    width: int = 1280,
    height: int = 720,
):
    """Generate a YouTube-style thumbnail (1280x720)"""

    # Create image
    img = Image.new("RGB", (width, height), background_color)
    draw = ImageDraw.Draw(img)

    # Add accent bar
    bar_height = 150
    draw.rectangle(
        [(0, height - bar_height), (width, height)],
        fill=accent_color
    )

    # Try to use system fonts, fall back to default
    try:
        title_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 80)
        subtitle_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 50)
    except (IOError, OSError):
        title_font = ImageFont.load_default()
        subtitle_font = ImageFont.load_default()

    # Draw title (centered, upper area)
    title_bbox = draw.textbbox((0, 0), title, font=title_font)
    title_width = title_bbox[2] - title_bbox[0]
    title_x = (width - title_width) // 2
    title_y = (height // 2 - 100)
    draw.text((title_x, title_y), title, fill=COLORS["text"], font=title_font)

    # Draw subtitle (centered, lower area above accent bar)
    if subtitle:
        subtitle_bbox = draw.textbbox((0, 0), subtitle, font=subtitle_font)
        subtitle_width = subtitle_bbox[2] - subtitle_bbox[0]
        subtitle_x = (width - subtitle_width) // 2
        subtitle_y = height - bar_height + 30
        draw.text((subtitle_x, subtitle_y), subtitle, fill=COLORS["text"], font=subtitle_font)

    # Save
    img.save(output_path)
    print(f"✅ Thumbnail generated: {output_path}")
    return output_path

def batch_generate_thumbnails(titles: list, output_dir: str = "./thumbnails"):
    """Generate multiple thumbnails from list of titles"""
    Path(output_dir).mkdir(exist_ok=True)

    for i, title in enumerate(titles, 1):
        output_path = f"{output_dir}/thumbnail_{i:03d}.png"
        generate_thumbnail(title, output_path=output_path)

    print(f"✅ Generated {len(titles)} thumbnails in {output_dir}/")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate YouTube thumbnails")
    parser.add_argument("--title", type=str, required=True, help="Thumbnail title")
    parser.add_argument("--subtitle", type=str, default="", help="Thumbnail subtitle")
    parser.add_argument("--output", type=str, default="thumbnail.png", help="Output file path")
    parser.add_argument("--bg-color", type=str, default=COLORS["background"], help="Background color (hex)")
    parser.add_argument("--accent-color", type=str, default=COLORS["accent"], help="Accent color (hex)")

    args = parser.parse_args()

    generate_thumbnail(
        title=args.title,
        subtitle=args.subtitle,
        background_color=args.bg_color,
        accent_color=args.accent_color,
        output_path=args.output,
    )
