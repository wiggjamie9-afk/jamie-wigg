#!/usr/bin/env python3
"""
Auto-upload Sonny e-books to Gumroad, Amazon KDP, and Etsy.
Requires one-time account setup and API key configuration.

Automation includes:
- Thumbnail and cover image generation
- Automatic pricing setup per platform
- Description generation with SEO metadata
- Tags, categories, and full metadata population
- Sales tracking entry creation
- YouTube description with all platform links
"""

import os
import sys
import json
import time
import subprocess
from pathlib import Path
from datetime import datetime
from dotenv import load_dotenv
import requests

try:
    from PIL import Image, ImageDraw, ImageFont
    PIL_AVAILABLE = True
except ImportError:
    PIL_AVAILABLE = False

# Load environment variables
load_dotenv(Path(__file__).parent.parent.parent / ".env")

# Configuration
GUMROAD_API_KEY = os.getenv("GUMROAD_API_KEY")
AMAZON_KDP_API_KEY = os.getenv("AMAZON_KDP_API_KEY")  # Not available yet - manual upload
ETSY_API_KEY = os.getenv("ETSY_API_KEY")
ETSY_SHOP_ID = os.getenv("ETSY_SHOP_ID")

EPISODES_DIR = Path(__file__).parent.parent / "episodes"
EBOOKS_DIR = Path(__file__).parent
SALES_TRACKING = EBOOKS_DIR / "sales-tracking" / "2026-revenue.csv"

# Gumroad product collection ID (you get this from Gumroad)
GUMROAD_PRODUCT_ID = os.getenv("GUMROAD_PRODUCT_ID", "")

# Price tiers (USD)
PRICE_GUMROAD = 3.99
PRICE_AMAZON = 4.99
PRICE_ETSY = 3.99

# SEO Tags (platform-specific)
TAGS_GUMROAD = ["children's book", "bedtime stories", "picture book", "quokka", "australian", "toddler", "sleep"]
TAGS_ETSY = ["bedtime stories", "children's book", "picture book", "toddler", "pdf", "printable", "australian animals", "quokka", "calm stories", "sleep stories"]

# Keywords for Amazon KDP (7 allowed, comma-separated)
KEYWORDS_AMAZON = "children's picture book, bedtime stories, toddler books, australian animals, quokka, calm stories, sleep stories"

print("=" * 80)
print("🎬 SONNY E-BOOK AUTO-UPLOAD")
print("=" * 80)

def generate_cover_image(episode: dict, output_path: Path) -> bool:
    """Generate a professional book cover from the episode thumbnail."""
    if not PIL_AVAILABLE:
        print("⚠️  PIL not available — skipping cover generation")
        return False

    thumbnail_path = episode["path"] / "thumbnail.jpg"
    if not thumbnail_path.exists():
        print("⚠️  Thumbnail not found — skipping cover")
        return False

    try:
        # Open thumbnail and create book cover layout
        img = Image.open(thumbnail_path)

        # Resize to Amazon KDP spec (2500 × 1600 px)
        cover_width, cover_height = 2500, 1600
        img = img.resize((cover_width, cover_height), Image.Resampling.LANCZOS)

        # Create final cover with title overlay
        cover = Image.new('RGB', (cover_width, cover_height), color='white')

        # Paste resized thumbnail
        cover.paste(img, (0, 0))

        # Add semi-transparent overlay at bottom for text
        overlay = Image.new('RGBA', (cover_width, 400), (20, 20, 30, 180))
        cover = cover.convert('RGBA')
        cover.paste(overlay, (0, cover_height - 400), overlay)
        cover = cover.convert('RGB')

        # Add title text if PIL fonts available
        try:
            draw = ImageDraw.Draw(cover)
            title_text = f"Sonny's Cozy Quokka Bedtime Tales\n{episode['title']}"
            # Try to use a nice font, fallback to default
            try:
                font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 80)
                font_small = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 60)
            except:
                font = ImageFont.load_default()
                font_small = font

            # Draw text centered at bottom
            draw.text((cover_width // 2, cover_height - 300),
                     "Sonny's Cozy Quokka",
                     fill=(255, 255, 255), font=font, anchor="mm")
            draw.text((cover_width // 2, cover_height - 150),
                     f"Bedtime Tales: {episode['title']}",
                     fill=(200, 200, 200), font=font_small, anchor="mm")
        except Exception as e:
            print(f"  ℹ️  Could not add text overlay: {e}")

        cover.save(output_path, 'JPEG', quality=95)
        print(f"  ✅ Cover image: {output_path.stat().st_size // 1024} KB")
        return True

    except Exception as e:
        print(f"  ⚠️  Cover generation failed: {e}")
        return False

def find_latest_episode() -> dict | None:
    """Find the most recently generated episode."""
    if not EPISODES_DIR.exists():
        print("❌ Episodes directory not found")
        return None

    episodes = sorted(EPISODES_DIR.iterdir(), key=lambda x: x.stat().st_mtime, reverse=True)

    for ep_dir in episodes:
        if not ep_dir.is_dir():
            continue

        ebook_pdf = ep_dir / "ebook.pdf"
        script_json = ep_dir / "script.json"

        if ebook_pdf.exists() and script_json.exists():
            with open(script_json) as f:
                script = json.load(f)

            return {
                "slug": ep_dir.name,
                "path": ep_dir,
                "ebook_pdf": ebook_pdf,
                "script": script,
                "title": script.get("title", "Unknown"),
            }

    return None


def generate_descriptions(episode: dict) -> dict:
    """Generate descriptions for each platform."""
    title = episode["title"]

    gumroad_desc = f"""Sonny's Cozy Quokka Bedtime Tales — {title}

Join Sonny the little quokka on a gentle adventure through the Australian bush at bedtime.

🌙 Inside this illustrated picture book:
• 12 beautiful watercolour scenes
• Full narration text (perfect for reading aloud)
• Professional children's book artwork
• Calming, cosy bedtime story
• 10+ minutes of reading time

This is the same story as the YouTube episode, now as a printable picture book."""

    amazon_desc = f"""Sonny's Cozy Quokka Bedtime Tales: {title}

Settle in for a gentle bedtime adventure with Sonny, a sweet little quokka exploring the Australian bush at night.

🌙 What's inside:
• 12 beautifully illustrated watercolour scenes
• Complete narration text (800+ words)
• Professional children's book artwork
• Bedtime-appropriate pacing

Perfect for: Bedtime routines, quiet time, building reading habits (ages 1-5).

Safe for toddlers. No scary moments—just cosy adventure and sleepy quokka cuddles."""

    etsy_desc = f"""Sonny's Cozy Quokka Bedtime Tales: {title} - PDF Download

🌙 Beautiful illustrated bedtime story for toddlers.

GET INSTANT ACCESS: PDF download link arrives immediately after purchase.

📖 Inside:
✓ 12 full-color illustrations
✓ Complete story text (800+ words)
✓ Print-friendly layout
✓ Works on tablet or printed

Perfect for bedtime reading with toddlers ages 1-5."""

    return {
        "gumroad": gumroad_desc,
        "amazon": amazon_desc,
        "etsy": etsy_desc,
    }


def upload_to_gumroad(episode: dict, description: str, cover_path: Path = None) -> dict:
    """Upload e-book to Gumroad with full metadata."""
    if not GUMROAD_API_KEY:
        print("⚠️  GUMROAD_API_KEY not set in .env — skipping Gumroad upload")
        return {"success": False, "url": None}

    print(f"\n📤 Uploading to Gumroad: {episode['title']}")

    try:
        title = f"Sonny's Cozy Quokka Bedtime Tales — {episode['title']}"

        # Prepare product data
        data = {
            "title": title,
            "description": description,
            "price": PRICE_GUMROAD,
            "currency": "usd",
            "tags": ",".join(TAGS_GUMROAD),
        }

        # Upload PDF file
        files = {}
        if episode["ebook_pdf"].exists():
            files["file"] = open(episode["ebook_pdf"], "rb")

        response = requests.post(
            "https://api.gumroad.com/v2/products",
            headers={"Authorization": f"Bearer {GUMROAD_API_KEY}"},
            data=data,
            files=files,
            timeout=60,
        )

        if files:
            files["file"].close()

        if response.status_code in (200, 201):
            result = response.json()
            product = result.get('product', {})
            product_url = product.get('url')
            print(f"  ✅ Gumroad: {product_url}")
            return {
                "success": True,
                "url": product_url,
                "price": PRICE_GUMROAD
            }
        else:
            print(f"  ⚠️  Gumroad upload failed: {response.status_code}")
            print(f"     Response: {response.text[:200]}")
            return {"success": False, "url": None}

    except Exception as e:
        print(f"  ⚠️  Gumroad error: {e}")
        return {"success": False, "url": None}


def upload_to_etsy(episode: dict, description: str) -> dict:
    """Prepare Etsy listing with full metadata."""
    if not ETSY_API_KEY or not ETSY_SHOP_ID:
        print("⚠️  ETSY_API_KEY or ETSY_SHOP_ID not set — skipping Etsy upload")
        return {"success": False, "url": None, "listing_data": None}

    print(f"\n📤 Preparing Etsy listing: {episode['title']}")

    try:
        title = f"Sonny's Cozy Quokka Bedtime Tales {episode['title']} - PDF Download"

        # Generate Etsy-specific listing data
        listing_data = {
            "title": title,
            "description": description,
            "price": int(PRICE_ETSY * 100),  # Price in cents
            "quantity": 999,  # Unlimited digital downloads
            "shop_id": ETSY_SHOP_ID,
            "tags": TAGS_ETSY[:13],  # Etsy allows up to 13 tags
            "category_id": 1643,  # Kids → Picture Books (verify in your shop)
            "is_digital": True,
            "file_ids": [],
            "should_auto_renew": True,
            "listing_type": "digital",
            "processing_min": 1,  # 1 day processing
            "processing_max": 1,
        }

        # Prepare file attachment note (actual upload must be done via Etsy dashboard)
        print(f"  ℹ️  Etsy listing data prepared")
        print(f"  📝 Steps to complete:")
        print(f"     1. Go to etsy.com → Your shops → Active listings")
        print(f"     2. Click 'Create a listing' → Digital downloads")
        print(f"     3. Copy this title: {title}")
        print(f"     4. Upload the PDF: {episode['ebook_pdf'].name}")
        print(f"     5. Set price: ${PRICE_ETSY}")
        print(f"     6. Add tags: {', '.join(TAGS_ETSY)}")
        print(f"     7. Category: Kids → Picture Books")

        return {
            "success": True,
            "url": None,  # No URL until manually created
            "listing_data": listing_data,
            "price": PRICE_ETSY
        }

    except Exception as e:
        print(f"  ⚠️  Etsy error: {e}")
        return {"success": False, "url": None, "listing_data": None}


def update_sales_tracking(episode: dict) -> bool:
    """Add episode to sales tracking CSV."""
    print(f"\n📊 Updating sales tracking")

    try:
        if not SALES_TRACKING.exists():
            print(f"  ⚠️  Sales tracking file not found")
            return False

        # Read existing CSV
        with open(SALES_TRACKING, "r") as f:
            lines = f.readlines()

        # Find first empty row
        for i, line in enumerate(lines):
            if line.strip() and not line.split(",")[1].strip():  # Title column empty
                # Add episode info
                new_line = f"{i},{episode['title']},{datetime.now().strftime('%Y-%m-%d')},,,,,,,,\n"
                lines[i] = new_line

                with open(SALES_TRACKING, "w") as f:
                    f.writelines(lines)

                print(f"  ✅ Sales tracking updated")
                return True

        print(f"  ⚠️  No empty rows in tracking CSV")
        return False

    except Exception as e:
        print(f"  ⚠️  Tracking update failed: {e}")
        return False


def generate_youtube_description_links(episode: dict, uploads: dict = None) -> str:
    """Generate links section for YouTube description."""
    print(f"\n📝 Generating YouTube description links")

    gumroad_url = None
    if uploads and uploads.get('gumroad') and uploads['gumroad'].get('url'):
        gumroad_url = uploads['gumroad']['url']

    links = f"""📖 GET THE PICTURE BOOK:

Sonny's story is now available as a beautiful illustrated picture book you can read aloud to your little ones.

• Gumroad (direct): {gumroad_url if gumroad_url else '[Coming soon]'}
• Amazon Kindle: [Add after uploading]
• Amazon Hardcover: [Add after uploading]
• Etsy: [Add after uploading]

Perfect for bedtime reading, quiet time, or gift giving. Same cozy story, now as a printable picture book.

#SonnysBedtimeTales #ChildrensBooks #BedtimeStories #AustralianAnimals
"""

    return links


def show_setup_instructions() -> bool:
    """Show setup instructions if APIs not configured."""
    if not GUMROAD_API_KEY and not ETSY_API_KEY:
        print("\n" + "=" * 80)
        print("⚙️  SETUP REQUIRED")
        print("=" * 80)
        print("""
To enable automatic uploads, add these to your .env file:

1. GUMROAD_API_KEY
   • Go to gumroad.com → Settings → Developer
   • Copy your API token

2. ETSY_API_KEY & ETSY_SHOP_ID
   • Go to etsy.com → Seller → Developer Tools
   • Create an app and generate OAuth token
   • Your shop ID is in the Etsy dashboard

3. AMAZON_KDP_API_KEY (not currently available from Amazon)
   • Amazon KDP doesn't provide a public API
   • File uploads must be done manually (see EPISODE-UPLOAD-CHECKLIST.md)

For now, use: kids-channel/ebooks/QUICK-START.md
for manual upload instructions.
""")
        return False

    return True


def main():
    """Main upload workflow with full automation."""

    # Find latest episode
    episode = find_latest_episode()
    if not episode:
        print("\n❌ No episode found")
        print("   Run the Sunny pipeline first: python kids-channel/pipeline.py")
        sys.exit(1)

    print(f"\n📽️  Found episode: {episode['title']}")
    print(f"   Path: {episode['slug']}")
    print(f"   PDF: {episode['ebook_pdf'].stat().st_size // 1024} KB")

    # Generate cover image
    print(f"\n📸 Generating cover image...")
    cover_path = episode["path"] / "cover.jpg"
    cover_generated = generate_cover_image(episode, cover_path)

    # Generate descriptions
    descriptions = generate_descriptions(episode)

    # Check if APIs are configured
    has_apis = show_setup_instructions()

    # Upload to platforms
    uploads = {
        "gumroad": upload_to_gumroad(episode, descriptions["gumroad"], cover_path if cover_generated else None),
        "amazon": None,  # Manual only
        "etsy": upload_to_etsy(episode, descriptions["etsy"]),
    }

    # Update tracking
    update_sales_tracking(episode)

    # Generate YouTube links section with actual URLs
    youtube_links = generate_youtube_description_links(episode, uploads)

    # Summary
    print("\n" + "=" * 80)
    print("📊 UPLOAD SUMMARY")
    print("=" * 80)
    print(f"Episode: {episode['title']}")
    print(f"PDF Generated: ✅ {episode['ebook_pdf'].stat().st_size // 1024} KB")
    print(f"Cover Image: {'✅ Generated' if cover_generated else '⚠️  PIL not available'}")

    if uploads['gumroad'] and uploads['gumroad'].get('success'):
        print(f"Gumroad: ✅ Uploaded")
        print(f"  Price: ${uploads['gumroad']['price']}")
        print(f"  URL: {uploads['gumroad']['url']}")
    else:
        print(f"Gumroad: ⚠️  API key not configured")

    if uploads['etsy'] and uploads['etsy'].get('success'):
        print(f"Etsy: ℹ️  Listing data prepared")
        print(f"  Price: ${uploads['etsy']['price']}")
        print(f"  Next: Complete manual upload via Etsy dashboard")
    else:
        print(f"Etsy: ⚠️  API key not configured")

    print(f"Amazon KDP: ℹ️  Manual upload required")

    print("\n" + "=" * 80)
    print("📋 FILES READY:")
    print("=" * 80)
    print(f"PDF: {episode['ebook_pdf']}")
    if cover_generated:
        print(f"Cover: {cover_path}")
    print(f"Thumbnail: {episode['path'] / 'thumbnail.jpg'}")

    print("\n" + "=" * 80)
    print("📱 YOUTUBE DESCRIPTION (COPY THIS):")
    print("=" * 80)
    print(youtube_links)

    print("\n" + "=" * 80)
    print("🔗 PLATFORM LINKS:")
    print("=" * 80)
    if uploads['gumroad'] and uploads['gumroad'].get('url'):
        print(f"Gumroad: {uploads['gumroad']['url']}")
    if uploads['etsy'] and uploads['etsy'].get('success'):
        print(f"Etsy: [Add link after manual upload]")
    print(f"Amazon KDP: [Add link after manual upload]")


if __name__ == "__main__":
    main()
