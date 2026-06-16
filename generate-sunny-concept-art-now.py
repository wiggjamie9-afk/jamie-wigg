#!/usr/bin/env python3
"""Generate professional Sunny concept art using Higgsfield Soul."""
import requests
import os
from pathlib import Path
from dotenv import load_dotenv
from PIL import Image

# Load credentials
load_dotenv(Path(__file__).parent / ".env")
HIGGSFIELD_API_KEY = os.getenv("HIGGSFIELD_API_KEY")
HIGGSFIELD_SECRET = os.getenv("HIGGSFIELD_SECRET")

if not HIGGSFIELD_API_KEY or not HIGGSFIELD_SECRET:
    print("❌ Missing HIGGSFIELD credentials in .env")
    exit(1)

print("🎨 Generating Sunny Concept Art (Higgsfield Soul)")
print("=" * 60)

# Professional prompt
PROMPT = """
Professional museum-quality watercolor portrait of Sunny the quokka character.

CHARACTER:
- Small, chubby, rounded marsupial body with perfect teddy-bear proportions
- Golden-warm brown fur (#D4A574 honey/tan) — vibrant, consistent, masterfully rendered
- Large, gentle warm brown eyes with peaceful, kind, deeply intelligent expression
- Tiny round ears with soft pink/tan inner lining
- Small delicate paws with meticulous detail
- Natural peaceful smile, calm, serene expression
- Sitting peacefully in comfortable, restful pose
- Bedtime-ready, safe, cosy, magical feeling throughout

ILLUSTRATION STYLE:
- Professional watercolor painting (Beatrix Potter / Jill Barklem / fine art children's book level)
- Hand-painted appearance with visible, confident brushstrokes
- Soft pigment bleeds and gentle colour washes
- Warm earthy palette: ochres, burnt siennas, soft greens, deep blues
- Cold-press watercolor paper grain visible and subtle
- Magical, warm, cosy, bedtime-appropriate atmosphere
- Museum-quality character portrait — Sunny as clear focal point
- Masterful execution: fur texture, eye expression, anatomical perfection
- Professional, timeless, gallery-ready, publishable quality

COMPOSITION:
- Solo character portrait, Sunny centered and expressive
- Generous negative space around character
- Soft warm background with subtle depth (golden hour or peaceful setting)
- 1920×1080 landscape format
- Perfect balance of figure and breathing space
- Professional, exhibition-ready presentation

This is masterpiece-level children's book illustration.
"""

try:
    # Get auth token
    print("🔑 Authenticating with Higgsfield...")
    r = requests.post(
        "https://api.higgsfield.ai/v1/auth/token",
        json={"api_key": HIGGSFIELD_API_KEY, "secret": HIGGSFIELD_SECRET},
        timeout=30,
    )
    r.raise_for_status()
    token = r.json()["access_token"]
    print("✓ Authenticated")

    # Generate image
    print("🎨 Requesting Soul generation...")
    r2 = requests.post(
        "https://api.higgsfield.ai/v1/soul/generate",
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
        json={
            "prompt": PROMPT,
            "width": 1920,
            "height": 1080,
            "num_images": 1,
            "quality": "720p"
        },
        timeout=120,
    )
    r2.raise_for_status()
    data = r2.json()

    img_url = data.get("images", [{}])[0].get("url", "")
    if not img_url:
        print(f"❌ No image URL in response: {data}")
        exit(1)

    # Download image
    print("📥 Downloading image...")
    img_data = requests.get(img_url, timeout=60).content

    # Save
    output_path = Path(__file__).parent / "SUNNY-CONCEPT-ART-FINAL" / "sunny-concept-art.png"
    output_path.parent.mkdir(exist_ok=True)
    output_path.write_bytes(img_data)

    print(f"✅ SUCCESS!")
    print(f"   Size: {len(img_data) / 1024 / 1024:.1f} MB")
    print(f"   Saved: {output_path}")
    print(f"\n🎉 Professional Sunny concept art generated!")

except Exception as e:
    print(f"❌ Error: {e}")
    exit(1)
