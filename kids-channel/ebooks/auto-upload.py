#!/usr/bin/env python3
"""
Auto-upload Sonny e-books to Gumroad, Amazon KDP, and Etsy.
Requires one-time account setup and API key configuration.
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

print("=" * 80)
print("🎬 SONNY E-BOOK AUTO-UPLOAD")
print("=" * 80)

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


def upload_to_gumroad(episode: dict, description: str) -> bool:
    """Upload e-book to Gumroad."""
    if not GUMROAD_API_KEY:
        print("⚠️  GUMROAD_API_KEY not set in .env — skipping Gumroad upload")
        return False

    print(f"\n📤 Uploading to Gumroad: {episode['title']}")

    try:
        # Gumroad API for creating a product
        # Note: Gumroad API is limited; file upload may need manual steps
        # This is a placeholder for the API call structure

        with open(episode["ebook_pdf"], "rb") as f:
            files = {"file": f}
            data = {
                "title": f"Sonny's Cozy Quokka Bedtime Tales — {episode['title']}",
                "description": description,
                "price": PRICE_GUMROAD,
                "currency": "usd",
            }

            response = requests.post(
                "https://api.gumroad.com/v2/products",
                headers={"Authorization": f"Bearer {GUMROAD_API_KEY}"},
                data=data,
                files=files,
                timeout=60,
            )

        if response.status_code in (200, 201):
            result = response.json()
            print(f"  ✅ Gumroad: {result.get('product', {}).get('url', 'uploaded')}")
            return True
        else:
            print(f"  ⚠️  Gumroad upload failed: {response.status_code}")
            print(f"     (Gumroad API is limited — you may need to upload manually)")
            return False

    except Exception as e:
        print(f"  ⚠️  Gumroad error: {e}")
        return False


def upload_to_etsy(episode: dict, description: str) -> bool:
    """Upload listing to Etsy."""
    if not ETSY_API_KEY or not ETSY_SHOP_ID:
        print("⚠️  ETSY_API_KEY or ETSY_SHOP_ID not set — skipping Etsy upload")
        return False

    print(f"\n📤 Uploading to Etsy: {episode['title']}")

    try:
        # Etsy requires OAuth2 and file uploads need to be done differently
        # This is a simplified structure

        headers = {
            "Authorization": f"Bearer {ETSY_API_KEY}",
            "Content-Type": "application/json",
        }

        listing_data = {
            "title": f"Sonny's Cozy Quokka Bedtime Tales {episode['title']} - PDF Download",
            "description": description,
            "price": int(PRICE_ETSY * 100),  # Price in cents
            "quantity": 999,  # Unlimited digital downloads
            "is_digital": True,
            "file_data": episode["ebook_pdf"].name,
        }

        print(f"  ℹ️  Etsy requires manual file upload via their dashboard")
        print(f"      Use EPISODE-UPLOAD-CHECKLIST.md for step-by-step instructions")
        return False

    except Exception as e:
        print(f"  ⚠️  Etsy error: {e}")
        return False


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


def generate_youtube_description_links(episode: dict) -> str:
    """Generate links section for YouTube description."""
    print(f"\n📝 Generating YouTube description links")

    # These would be filled in manually after uploading
    links = f"""
📖 GET THE PICTURE BOOK:
• Gumroad: [INSERT-GUMROAD-LINK]
• Amazon Kindle: [INSERT-AMAZON-LINK]
• Etsy: [INSERT-ETSY-LINK]

Same story as the video, now as an illustrated picture book you can read aloud.
"""

    print(f"  👉 Copy these links to YouTube description after uploading:")
    print(links)

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
    """Main upload workflow."""

    # Find latest episode
    episode = find_latest_episode()
    if not episode:
        print("\n❌ No episode found")
        print("   Run the Sunny pipeline first: python kids-channel/pipeline.py")
        sys.exit(1)

    print(f"\n📽️  Found episode: {episode['title']}")
    print(f"   Path: {episode['slug']}")
    print(f"   PDF: {episode['ebook_pdf'].stat().st_size // 1024} KB")

    # Generate descriptions
    descriptions = generate_descriptions(episode)

    # Check if APIs are configured
    has_apis = show_setup_instructions()

    if not has_apis:
        print("\n⚠️  API keys not configured")
        print("   For now, use manual upload: kids-channel/ebooks/QUICK-START.md")
        return

    # Upload to platforms
    uploads = {
        "gumroad": upload_to_gumroad(episode, descriptions["gumroad"]),
        "amazon": False,  # Manual only
        "etsy": upload_to_etsy(episode, descriptions["etsy"]),
    }

    # Update tracking
    update_sales_tracking(episode)

    # Generate YouTube links section
    youtube_links = generate_youtube_description_links(episode)

    # Summary
    print("\n" + "=" * 80)
    print("📊 UPLOAD SUMMARY")
    print("=" * 80)
    print(f"Episode: {episode['title']}")
    print(f"Gumroad: {'✅ Uploaded' if uploads['gumroad'] else '⚠️  Manual required'}")
    print(f"Amazon KDP: ⚠️  Manual upload required")
    print(f"Etsy: ⚠️  Manual upload required")
    print("\n" + "=" * 80)
    print("NEXT STEPS:")
    print("=" * 80)
    print("""
1. If you have Gumroad API key configured, check your Gumroad dashboard
2. For Amazon KDP and Etsy, follow: kids-channel/ebooks/EPISODE-UPLOAD-CHECKLIST.md
3. Copy YouTube description links from above
4. Add links to YouTube video description
5. Update sales tracking weekly
""")


if __name__ == "__main__":
    main()
