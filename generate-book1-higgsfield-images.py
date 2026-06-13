#!/usr/bin/env python3
"""
Higgsfield Book 1 Image Generation Script
==========================================

Generates 16 professional watercolor-style book pages using Higgsfield Soul
with Sunny character locked for consistency across all pages.

Run this on your local machine (with network access):
    python3 generate-book1-higgsfield-images.py

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
API_KEY = os.getenv("HIGGSFIELD_API_KEY", "5f59383f-fd82-4bd1-a4a0-21735bf3b4f5")
SECRET = os.getenv("HIGGSFIELD_SECRET", "3b307586264998fc389df2aa9ed8736225776e1b9df19fb6c8c282725c763648")
BASE_URL = "https://api.higgsfield.ai"

# Output directory
OUTPUT_DIR = Path("./BOOK-1-HIGGSFIELD-PAGES")
OUTPUT_DIR.mkdir(exist_ok=True)

# Tracking file for jobs
JOBS_FILE = OUTPUT_DIR / "jobs.json"
CHARACTERS_FILE = OUTPUT_DIR / "characters.json"

def load_json(path):
    """Load JSON file or return empty structure."""
    if path.exists():
        with open(path) as f:
            return json.load(f)
    return {} if "jobs" in str(path) else []

def save_json(path, data):
    """Save JSON file."""
    with open(path, 'w') as f:
        json.dump(data, f, indent=2)
    print(f"💾 Saved: {path}")

def api_call(method, endpoint, **kwargs):
    """Make authenticated API call to Higgsfield."""
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "X-Secret": SECRET,
        "Content-Type": "application/json"
    }
    url = f"{BASE_URL}{endpoint}"

    try:
        if method == "POST":
            response = requests.post(url, headers=headers, json=kwargs.get('json'), timeout=30)
        else:
            response = requests.get(url, headers=headers, params=kwargs.get('params'), timeout=30)

        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"❌ API Error: {e}")
        return None

def create_character_reference():
    """Create Sunny character reference (required before generating images)."""
    print("\n🎨 Step 1: Creating Sunny Character Reference")
    print("=" * 70)

    characters = load_json(CHARACTERS_FILE)

    # Check if Sunny already exists
    for char in characters:
        if char.get("name") == "Sunny" and char.get("status") == "completed":
            print(f"✅ Sunny reference already exists: {char['reference_id']}")
            return char['reference_id']

    # Create new character
    print("Creating character reference for Sunny...")

    request_data = {
        "name": "Sunny",
        "description": "A young, extremely chubby round quokka named Sunny with warm golden-brown fur (#D4A574), large gentle warm brown eyes with kind expression, peaceful natural smile, small round ears with cream-colored inner lining. Teddy-bear-like shape, calm and bedtime-ready.",
        "style": "watercolor, children's book illustration, soft realism",
    }

    result = api_call("POST", "/v1/characters", json=request_data)

    if result and "id" in result:
        char_id = result["id"]
        print(f"✅ Character reference created: {char_id}")

        # Track character
        characters.append({
            "name": "Sunny",
            "reference_id": char_id,
            "status": "processing",
            "created_at": datetime.now().isoformat()
        })
        save_json(CHARACTERS_FILE, characters)

        return char_id
    else:
        print(f"❌ Failed to create character: {result}")
        return None

def wait_for_character(char_id, max_wait=120):
    """Poll character status until ready."""
    print(f"⏳ Waiting for Sunny reference to process (max {max_wait}s)...")
    start = time.time()

    while time.time() - start < max_wait:
        result = api_call("GET", f"/v1/characters/{char_id}")

        if result and result.get("status") == "completed":
            print("✅ Character reference ready!")
            return True
        elif result and result.get("status") == "failed":
            print(f"❌ Character processing failed: {result.get('error')}")
            return False

        print(f"  ⏳ Status: {result.get('status', 'unknown')} ({int(time.time() - start)}s)")
        time.sleep(10)

    print(f"⏱️ Timeout waiting for character (>{max_wait}s). Proceeding anyway...")
    return True

def get_page_prompts():
    """Return the 16 page prompts from PLAN.md specification."""
    return [
        # Page 1: Golden Hour
        "A young quokka named Sunny sitting peacefully on a mossy rock during golden hour. The sky is warm with soft pink, ripe peach orange, and beginning purple hues as the sun descends. Eucalyptus trees and wildflowers in the Australian bush around her. Soft watercolor blending, visible brushstrokes. Sunny looks up at the sky with peaceful wonder. Watercolor illustration, professional children's book style.",

        # Page 2: Sky Deepening
        "The same scene with colors deepening. Sky now showing more purple and soft orange. A warm breeze moves gently through the eucalyptus leaves making a soft shushing sound. Sunny still sitting peacefully, watching the changing colors. Watercolor soft edges, organic blending. Warm to cool color transition.",

        # Page 3: First Flying Foxes
        "First flying fox silhouettes appear in the sky — dark graceful shapes against the purple and orange sky. One fox visible, wings spread wide. Sunny sitting below, eyes widening with wonder. The sky is now predominantly purple with hints of orange. Soft watercolor clouds.",

        # Page 4: Flying Foxes Sailing
        "Multiple flying foxes sailing gracefully through the air, their wings spread wide and dark against the beautiful purple sky. Flying foxes moving in silent, elegant arcs. Sunny watching intently from the mossy rock. More stars beginning to appear. Watercolor style with soft motion blur on the foxes.",

        # Page 5: Wonder Growing
        "Sunny's expression shows growing wonder as more flying foxes move through the dusky sky. The sky is now a deep purple with soft blue tones. Foxes moving gracefully. Wildflowers and grass in the foreground. Soft watercolor illustration. Starlight beginning to show.",

        # Page 6: More Foxes
        "One by one, more flying foxes appear and move through the increasingly dark purple and deep blue sky. Sunny sitting peacefully, watching them fly. The bush grows quiet. Stars becoming more visible. Soft watercolor painting style with organic edges.",

        # Page 7: First Star
        "One tiny light twinkles softly in the now deep purple and navy sky. The first star has appeared. Sunny watching quietly, eyes wide with delight. Flying foxes still visible as darker silhouettes. Moonlight beginning to illuminate the scene. Watercolor soft brushstrokes.",

        # Page 8: Stars Multiply
        "Several stars now visible, twinkling softly like small sparkles. Each one a soft glitter against the dark velvet cloth of the sky. Sunny still watching, peaceful. The bush is now mostly dark with starlight illuminating the scene. Watercolor painting.",

        # Page 9: Many Stars
        "Many stars visible across the sky now, a growing starfield. Sunny lying back on the mossy rock, looking up at all the tiny lights. The sky is now a deep navy blue with countless stars. Moonlight illuminating Sunny's peaceful face. Watercolor illustration.",

        # Page 10: Starfield Growing
        "The starfield continues to grow as the night deepens. Sunny lying peacefully on the mossy rock, looking up and up at all the tiny lights. Sky is now very dark navy with many stars. Cool tones dominate. Gentle moonlight. Watercolor soft edges.",

        # Page 11: Peaceful Stars
        "Sunny's eyes are heavy now, watching the stars from the mossy rock. The warm breeze moves gently through the eucalyptus leaves with a soft shushing sound. The sky is filled with stars. Deep navy and indigo tones. Moonlight soft on Sunny's fur. Watercolor painting.",

        # Page 12: Deep Night
        "Deep night now fully established. The sky is dark navy and indigo with countless stars. Sunny lying on the mossy rock, eyes growing very heavy. The star twinkle on, one by one, keeping watch through the night. Soft watercolor illustration. Peaceful and cozy.",

        # Page 13: Sleeping Sunny
        "Sunny drifts off to sleep, a tiny smile on her face. She lies peacefully on the mossy rock under the complete starfield. The sky is dark navy with many twinkling stars. Moonlight illuminates her sleeping form gently. Watercolor soft brushstrokes. Very peaceful, cozy scene.",

        # Page 14: Dream Scene
        "Dream-like scene of Sunny sleeping peacefully. Stars twinkle around her. The night sky is dark indigo and navy with countless stars. Sunny's expression is peaceful and content. The scene feels dreamlike and magical with soft watercolor blending and glow. Moonlight and starlight illuminate everything.",

        # Page 15: Night Complete
        "The night is fully established. Deep navy sky filled with countless stars creating a complete starfield. Sunny sleeping peacefully on the mossy rock. The scene is peaceful, safe, and calming. Watercolor illustration with soft brushstrokes. Everything bathed in cool starlight and moonlight.",

        # Page 16: Goodnight
        "Final closing moment: Sunny sleeping peacefully, complete starfield surrounding her. The sky is the deepest navy blue, almost black, filled completely with stars. Moonlight soft on her sleeping form. Watercolor painting with beautiful soft edges. The perfect bedtime image. Safe, cozy, magical.",
    ]

def generate_images(character_id):
    """Generate all 16 pages with Sunny character locked."""
    print("\n📸 Step 2: Generating 16 Book Pages")
    print("=" * 70)

    prompts = get_page_prompts()
    jobs = load_json(JOBS_FILE)

    for idx, prompt in enumerate(prompts, 1):
        shot_id = f"book-1-page-{idx:02d}"

        # Skip if already completed
        if any(j["shot_id"] == shot_id and j["status"] == "completed" for j in jobs):
            print(f"✅ {shot_id} already generated")
            continue

        print(f"\n📝 Generating page {idx}/16: {shot_id}")
        print(f"   Prompt: {prompt[:80]}...")

        request_data = {
            "prompt": prompt,
            "width_and_height": "1920x1080",
            "quality": "720p",
            "enhance_prompt": True,
            "custom_reference_id": character_id,
            "custom_reference_strength": 0.8,
            "model": "soul",
        }

        result = api_call("POST", "/v1/generate/image", json=request_data)

        if result and "job_set_id" in result:
            job_id = result["job_set_id"]
            print(f"   ✅ Job submitted: {job_id}")

            # Track job
            jobs.append({
                "shot_id": shot_id,
                "job_set_id": job_id,
                "kind": "soul",
                "status": "queued",
                "submitted_at": datetime.now().isoformat(),
                "result_urls": []
            })
            save_json(JOBS_FILE, jobs)
        else:
            print(f"   ❌ Failed to submit job: {result}")

def poll_and_download():
    """Poll job status and download completed images."""
    print("\n⏳ Step 3: Polling and Downloading Images")
    print("=" * 70)

    jobs = load_json(JOBS_FILE)
    max_polls = 60  # Poll for up to 10 minutes (60 × 10s)
    poll_count = 0

    while poll_count < max_polls:
        poll_count += 1
        pending = [j for j in jobs if j["status"] not in ["completed", "failed"]]

        if not pending:
            print("✅ All jobs completed!")
            break

        print(f"\n⏳ Poll {poll_count}/{max_polls}: Checking {len(pending)} pending jobs...")

        for job in pending:
            result = api_call("GET", f"/v1/jobs/{job['job_set_id']}")

            if result:
                status = result.get("status")
                print(f"  {job['shot_id']}: {status}")

                if status == "completed" and result.get("result_urls"):
                    job["status"] = "completed"
                    job["result_urls"] = result["result_urls"]

                    # Download image
                    for url in result["result_urls"]:
                        filename = OUTPUT_DIR / f"{job['shot_id']}.png"
                        try:
                            response = requests.get(url, timeout=30)
                            response.raise_for_status()
                            filename.write_bytes(response.content)
                            print(f"    ✅ Downloaded: {filename}")
                        except Exception as e:
                            print(f"    ❌ Download failed: {e}")

                elif status == "failed":
                    job["status"] = "failed"
                    print(f"    ❌ Job failed: {result.get('error')}")

        save_json(JOBS_FILE, jobs)

        if pending and poll_count < max_polls:
            print(f"  Waiting 10s before next poll...")
            time.sleep(10)

    # Summary
    completed = [j for j in jobs if j["status"] == "completed"]
    print(f"\n📊 Summary: {len(completed)}/{len(jobs)} pages generated")

def main():
    """Main workflow."""
    print("\n🌙 SUNNY'S BEDTIME TALES - Book 1 Illustration Generation")
    print("=" * 70)
    print(f"API Key: {API_KEY[:16]}...")
    print(f"Output: {OUTPUT_DIR}")

    # Step 1: Create character reference
    char_id = create_character_reference()
    if not char_id:
        print("❌ Failed to create character reference. Exiting.")
        return

    # Wait for character to be ready
    if not wait_for_character(char_id):
        print("⚠️  Proceeding anyway (character may not be ready)")

    # Step 2: Generate images
    generate_images(char_id)

    # Step 3: Poll and download
    poll_and_download()

    print("\n✅ Generation complete! Images saved to:", OUTPUT_DIR)
    print("\nNext step: Run assemble-book1-final-video.py to create the MP4 with narration")

if __name__ == "__main__":
    main()
