#!/usr/bin/env python3
"""
Generate Professional Sunny Concept Art via Higgsfield Soul
============================================================

Generates a single museum-quality watercolor portrait of Sunny the quokka.

Run on your local machine (with network access):
    python3 generate-sunny-concept-higgsfield.py

Prerequisites:
    - pip install requests
    - HIGGSFIELD_API_KEY and HIGGSFIELD_SECRET in .env or exported as env vars
"""

import os
import json
import time
import requests
from pathlib import Path
from datetime import datetime

# Configuration
API_KEY = os.getenv("HIGGSFIELD_API_KEY", "")
SECRET = os.getenv("HIGGSFIELD_SECRET", "")
BASE_URL = "https://api.higgsfield.ai"

# Output directory
OUTPUT_DIR = Path("./SUNNY-CONCEPT-ART")
OUTPUT_DIR.mkdir(exist_ok=True)

def api_call(method, endpoint, **kwargs):
    """Make authenticated API call to Higgsfield."""
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "X-API-Secret": SECRET,
    }
    url = f"{BASE_URL}{endpoint}"
    resp = requests.request(method, url, headers=headers, **kwargs)
    resp.raise_for_status()
    return resp.json()

def generate_sunny_portrait():
    """Generate professional Sunny watercolor portrait."""

    if not API_KEY or not SECRET:
        print("❌ HIGGSFIELD_API_KEY and HIGGSFIELD_SECRET not found!")
        print("   Set them in .env or export them:")
        print("   export HIGGSFIELD_API_KEY='your-key'")
        print("   export HIGGSFIELD_SECRET='your-secret'")
        return False

    print("🎨 Generating Sunny Concept Art (Higgsfield Soul)")
    print("=" * 60)

    prompt = """
Professional watercolor portrait of Sunny the quokka character for "Sunny's Cozy Quokka Bedtime Tales."

CHARACTER DESIGN:
- Small, chubby, rounded marsupial body with teddy-bear proportions
- Golden-warm brown fur (#D4A574 honey/tan tone) — consistent, vibrant, warm
- Large, gentle warm brown eyes with peaceful, kind, intelligent expression
- Tiny round ears with soft pink/tan inner lining
- Small delicate paws with delicate proportions
- Natural peaceful smile, calm, serene expression
- Sitting peacefully in a comfortable, restful pose
- Bedtime-ready, safe, cosy, magical feeling

ILLUSTRATION STYLE:
- Professional watercolor painting in Beatrix Potter / Jill Barklem style
- Hand-painted appearance with visible, confident brushstrokes
- Soft pigment bleeds and gentle colour washes
- Warm earthy palette: ochres, burnt siennas, soft greens, deep blues
- Cold-press watercolor paper grain visible throughout
- Magical, warm, cosy, bedtime atmosphere
- Masterful character portrait — Sunny as the clear focal point
- Museum-quality, publishable children's book illustration
- Incredible attention to detail in fur texture, eye expression, and form
- Professional, timeless, enduring quality

COMPOSITION:
- Solo character portrait, Sunny centered and expressive
- 1920×1080 landscape format
- Generous negative space around character
- Soft warm background — perhaps golden hour light or peaceful setting
- Perfect balance of figure and space
- Professional, gallery-ready presentation

This portrait should be worthy of the cover of a beloved children's classic.
"""

    try:
        print("\n📤 Submitting to Higgsfield Soul...")

        response = api_call(
            "POST",
            "/v1/generation/image/soul",
            json={
                "prompt": prompt.strip(),
                "width_and_height": "1920x1080",
                "quality": "720p",
                "enhance_prompt": True,
            }
        )

        job_set_id = response.get("id")
        print(f"✓ Job submitted: {job_set_id}")
        print(f"  Polling for completion...")

        # Poll for completion
        max_polls = 120  # 20 minutes max
        poll_interval = 10  # seconds

        for attempt in range(max_polls):
            time.sleep(poll_interval)

            try:
                status_response = api_call("GET", f"/v1/generation/image/soul/{job_set_id}")
                status = status_response.get("status")

                elapsed = (attempt + 1) * poll_interval
                mins = elapsed // 60
                secs = elapsed % 60

                if status == "completed":
                    print(f"\n✅ Generation complete! ({mins}m {secs}s)")

                    # Download images
                    results = status_response.get("results", [])
                    if results:
                        img_url = results[0]
                        print(f"📥 Downloading image...")

                        img_response = requests.get(img_url)
                        img_response.raise_for_status()

                        # Save image
                        output_file = OUTPUT_DIR / "sunny-concept-art.png"
                        with open(output_file, 'wb') as f:
                            f.write(img_response.content)

                        print(f"✓ Saved: {output_file}")
                        print(f"  Size: {len(img_response.content) / 1024 / 1024:.1f} MB")
                        print(f"\n🎉 Sunny concept art ready for use!")
                        return True
                    else:
                        print("❌ No images in response")
                        return False

                elif status == "failed":
                    error = status_response.get("error", "Unknown error")
                    print(f"❌ Generation failed: {error}")
                    return False

                elif status == "in_progress":
                    pct = int((attempt / max_polls) * 100)
                    print(f"  [{pct:3d}%] {mins}m {secs}s elapsed...", end='\r')

                else:
                    print(f"  Status: {status}...", end='\r')

            except requests.exceptions.RequestException as e:
                print(f"❌ Polling error: {e}")
                return False

        print(f"\n❌ Timeout after {max_polls * poll_interval} seconds")
        return False

    except requests.exceptions.RequestException as e:
        print(f"❌ API error: {e}")
        return False

if __name__ == "__main__":
    success = generate_sunny_portrait()
    exit(0 if success else 1)
