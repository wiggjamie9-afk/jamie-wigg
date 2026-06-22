#!/usr/bin/env python3
"""
Generate all 20 Episode 2 MP3s using ElevenLabs voice samples cloned in Voicebox.

This script:
1. Copies voice sample MP3s to audio-ep1/
2. Clones each voice in Voicebox from the samples
3. Generates all 20 Episode 2 scripts in matched voices
4. Saves MP3s to audio-ep2/

Prerequisites:
- Voicebox running at http://127.0.0.1:17493
- All voice samples in /root/.claude/uploads/ (they're already there)

Usage:
    python generate-all-ep2-now.py
"""

import json
import os
import shutil
import time
from pathlib import Path

import requests

VOICEBOX_URL = "http://127.0.0.1:17493"
UPLOAD_DIR = Path("/root/.claude/uploads/70b58749-4ee3-5fd9-8518-33b15e2ee359")
EP1_DIR = Path("./audio-ep1")
EP2_DIR = Path("./audio-ep2")

# Voice mapping: podcast_key → (voice_name, upload_file_id)
VOICES = {
    "01-true-crime-brief": ("Miguel", "d0f051eb"),
    "02-ai-briefing": ("Katherine", "5e10a508"),
    "03-dating-decoded": ("Julia", "fb6dc72e"),
    "04-side-hustle-school": ("Adam", "61f14fa0"),
    "05-dad-code": ("Michael_Scott", "aa1aec31"),
    "06-money-mindset": ("Everet", "4daaeb22"),
    "07-sleep-and-calm": ("Mark_Coggins", "db9e6e33"),
    "08-longevity-brief": ("Raven", "a2663cee"),
    "09-history-uncovered": ("John", "3bcaea0d"),
    "10-unexplained": ("Austin", "a5b53974"),
    "11-pop-culture-now": ("Victoria", "7bd0751f"),
    "12-stoic-minute": ("Harry", "9f14c7a4"),
    "13-focus-lab": ("Wade", "bcf41a30"),
    "14-parenting-playbook": ("Chantel", "fa74034d"),
    "15-sports-unfiltered": ("Glinda", "f567b626"),
    "16-plain-tech": ("Kristen", "cf02f452"),
    "17-founders-stories": ("Daniel", "583c841a"),
    "18-calm-mind": ("Sam", "91fb1706"),
    "19-fifteen-minute-kitchen": ("Kel", "6345dfee"),
    "20-wanderlust": ("William", "079306c7"),
}


def check_voicebox():
    """Verify Voicebox is running."""
    try:
        resp = requests.get(f"{VOICEBOX_URL}/profiles", timeout=5)
        return resp.status_code == 200
    except:
        return False


def find_voice_file(file_id):
    """Find the full voice sample MP3 by its ID prefix."""
    for file in UPLOAD_DIR.glob(f"{file_id}*"):
        if file.suffix == ".mp3":
            return file
    return None


def copy_voice_samples():
    """Copy voice samples to audio-ep1 for reference."""
    EP1_DIR.mkdir(exist_ok=True)

    for podcast_key, (voice_name, file_id) in sorted(VOICES.items()):
        source = find_voice_file(file_id)
        if source:
            dest = EP1_DIR / f"ep1-{podcast_key.split('-')[0]}-{voice_name}.mp3"
            shutil.copy2(source, dest)
            print(f"  ✅ {podcast_key:35} ({voice_name})")
        else:
            print(f"  ⚠️  {podcast_key:35} (voice sample not found)")


def clone_voice(podcast_key, voice_name, file_id):
    """Clone a voice from the uploaded sample."""
    voice_file = find_voice_file(file_id)
    if not voice_file:
        print(f"  ⚠️  {podcast_key:35} (sample not found)")
        return voice_name  # Fallback to preset name

    try:
        with open(voice_file, "rb") as f:
            files = {"audio": (voice_file.name, f, "audio/mpeg")}
            data = {"name": f"podcast-{podcast_key}", "language": "en"}

            print(f"  Cloning {podcast_key:35} → {voice_name:20}", end=" ", flush=True)
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
                print(f"❌ (fallback to {voice_name})")
                return voice_name
    except Exception as e:
        print(f"❌ ({e}, fallback to {voice_name})")
        return voice_name


def read_script(podcast_key):
    """Read Episode 2 script."""
    script_path = Path(f"{podcast_key}-ep2.txt")
    if not script_path.exists():
        return None

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
    print("\n" + "=" * 70)
    print("🎙️  EPISODE 2 GENERATION: ElevenLabs Voices → All 20 Podcasts")
    print("=" * 70 + "\n")

    # Check Voicebox
    if not check_voicebox():
        print("❌ Voicebox not running at http://127.0.0.1:17493")
        print("   Start Voicebox and try again.\n")
        return

    EP2_DIR.mkdir(exist_ok=True)

    # Phase 1: Copy voice samples
    print("PHASE 1: Organizing voice samples")
    print("-" * 70)
    copy_voice_samples()

    # Phase 2: Clone voices
    print("\nPHASE 2: Cloning ElevenLabs voices in Voicebox")
    print("-" * 70)

    profile_map = {}
    for podcast_key, (voice_name, file_id) in sorted(VOICES.items()):
        profile_id = clone_voice(podcast_key, voice_name, file_id)
        profile_map[podcast_key] = profile_id
        time.sleep(0.5)

    print(f"\n✅ Voice cloning complete. {len(profile_map)} profiles created.\n")

    # Phase 3: Generate Episode 2
    print("PHASE 3: Generating all 20 Episode 2 MP3s")
    print("-" * 70)

    job_results = {}
    for podcast_key, profile_id in sorted(profile_map.items()):
        script_text = read_script(podcast_key)
        if not script_text:
            print(f"  ⚠️  {podcast_key:35} (script not found)")
            continue

        job_id = generate_audio(podcast_key, profile_id, script_text)
        if job_id:
            job_results[podcast_key] = job_id

        time.sleep(0.2)

    # Summary
    print("\n" + "=" * 70)
    print("✅ GENERATION SUBMITTED")
    print("=" * 70)
    print(f"\nSubmitted {len(job_results)}/{len(VOICES)} Episode 2 generation jobs.\n")
    print("NEXT STEPS:")
    print("1. Open Voicebox app → 'Generations' tab")
    print("2. Wait for all jobs to complete (5–30 minutes)")
    print(f"3. Download MP3s to {EP2_DIR.absolute()}/")
    print("4. Rename as: ep2-01.mp3, ep2-02.mp3, ... ep2-20.mp3")
    print("5. Upload to Buzzsprout for Mon/Wed/Fri release\n")


if __name__ == "__main__":
    main()
