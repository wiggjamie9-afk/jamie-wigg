#!/usr/bin/env python3
"""
Step 1: Assemble 18-page Book 1
Combines: Cover + 16 story pages + Teaser page
"""

import os
import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

OUTPUT_DIR = Path("/home/user/jamie-wigg/BOOK-1-ASSEMBLED")
OUTPUT_DIR.mkdir(exist_ok=True)

PAGES_DIR = Path("/home/user/jamie-wigg/BOOK-1-ILLUSTRATED-PAGES")
EXISTING_COVER = Path("/home/user/jamie-wigg/kids-channel/episodes/sunny-and-the-flying-fox/cover.jpg")

def create_cover_page():
    """Use existing cover or create new one"""
    if EXISTING_COVER.exists():
        img = Image.open(EXISTING_COVER)
        # Resize to 1920x1080
        img = img.resize((1920, 1080), Image.Resampling.LANCZOS)
        return img
    else:
        # Create placeholder cover
        img = Image.new("RGB", (1920, 1080), color=(26, 45, 92))
        draw = ImageDraw.Draw(img)
        try:
            font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 60)
        except:
            font = ImageFont.load_default()
        draw.text((960, 540), "Sunny and the Flying Fox", fill=(245, 241, 232), font=font, anchor="mm")
        return img

def create_teaser_page():
    """Create page 18 teaser for next book"""
    img = Image.new("RGB", (1920, 1080), color=(26, 45, 92))
    draw = ImageDraw.Draw(img)

    try:
        title_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 48)
        text_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 40)
    except:
        title_font = text_font = ImageFont.load_default()

    # Title
    draw.text((960, 400), "Coming Next in Sunny's Cozy Quokka Bedtime Tales:",
              fill=(245, 241, 232), font=title_font, anchor="mm")

    # Next book
    draw.text((960, 580), "Sunny and the Fog",
              fill=(200, 180, 150), font=text_font, anchor="mm")

    return img

def main():
    print("=" * 70)
    print("Assembling Book 1: 18-Page Complete Book")
    print("=" * 70)

    pages = []

    # Page 1: Cover
    print("\nPage 1: Cover...")
    pages.append(("BOOK-1-PAGE-01-COVER.png", create_cover_page()))

    # Pages 2-17: Story pages
    for page_num in range(2, 17):
        story_page = PAGES_DIR / f"BOOK-1-PAGE-{page_num:02d}-WATERCOLOR.png"
        if story_page.exists():
            print(f"Page {page_num}: Loading story page...")
            img = Image.open(story_page)
            pages.append((f"BOOK-1-PAGE-{page_num:02d}-WATERCOLOR.png", img))
        else:
            print(f"⚠ Page {page_num}: Not found - {story_page}")

    # Page 18: Teaser
    print("Page 18: Teaser...")
    pages.append(("BOOK-1-PAGE-18-TEASER.png", create_teaser_page()))

    # Save all pages
    print(f"\nSaving {len(pages)} pages...")
    for filename, img in pages:
        output_path = OUTPUT_DIR / filename
        img.save(output_path, quality=95)
        print(f"  ✓ {filename}")

    # Create manifest
    manifest = {
        "book": "Sunny and the Flying Fox",
        "pages": len(pages),
        "page_list": [f[0] for f in pages],
        "resolution": "1920x1080",
        "total_pages": 18,
        "ready_for_video": len(pages) == 18
    }

    import json
    manifest_file = OUTPUT_DIR / "manifest.json"
    with open(manifest_file, "w") as f:
        json.dump(manifest, f, indent=2)

    print(f"\n✓ Book assembled: {OUTPUT_DIR}")
    print(f"✓ Pages ready for video assembly: {len(pages)}/18")

    return 0 if len(pages) == 18 else 1

if __name__ == "__main__":
    sys.exit(main())
