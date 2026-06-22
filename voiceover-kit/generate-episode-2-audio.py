#!/usr/bin/env python3
"""
Batch generate Episode 2 audio files using Voicebox REST API.

Prerequisites:
1. Voicebox is running locally (http://127.0.0.1:17493)
2. All voice profiles are created in Voicebox
3. Voice profile names are filled in VOICEBOX-VOICE-PROFILES.md

Usage:
    python generate-episode-2-audio.py
"""

import json
import os
import sys
import time
from pathlib import Path

import requests

# Voicebox API endpoint
VOICEBOX_URL = "http://127.0.0.1:17493"
GENERATE_ENDPOINT = f"{VOICEBOX_URL}/generate"
STATUS_ENDPOINT = f"{VOICEBOX_URL}/job"

# Voice profile mapping — EDIT THIS with your actual profile names/IDs
VOICE_PROFILES = {
    "01-true-crime-brief": "miguel-clone",
    "02-ai-briefing": "katherine-clone",
    "03-dating-decoded": "julia-clone",
    "04-side-hustle-school": "adam-clone",
    "05-dad-code": "brian-clone",
    "06-money-mindset": "rachel-clone",
    "07-sleep-and-calm": "sarah-clone",
    "08-longevity-brief": "daniel-clone",
    "09-history-uncovered": "george-clone",
    "10-unexplained": "charlie-clone",
    "11-pop-culture-now": "jessica-clone",
    "12-stoic-minute": "daniel-clone",
    "13-focus-lab": "brian-clone",
    "14-parenting-playbook": "sarah-clone",
    "15-sports-unfiltered": "adam-clone",
    "16-plain-tech": "jessica-clone",
    "17-founders-stories": "daniel-clone",
    "18-calm-mind": "charlotte-clone",
    "19-fifteen-minute-kitchen": "jessica-clone",
    "20-wanderlust": "charlotte-clone",
}

OUTPUT_DIR = Path("./audio-ep2")


def check_voicebox_running():
    """Verify Voicebox is accessible."""
    try:
        resp = requests.get(f"{VOICEBOX_URL}/profiles", timeout=5)
        if resp.status_code == 200:
            return True
    except requests.ConnectionError:
        pass
    return False


def read_script(script_path):
    """Read script text, stripping header."""
    with open(script_path, "r", encoding="utf-8") as f:
        lines = f.readlines()

    # Skip until after the '---' separator
    start_idx = 0
    for i, line in enumerate(lines):
        if line.strip() == "---":
            start_idx = i + 1
            break

    script_text = "".join(lines[start_idx:]).strip()
    return script_text


def generate_audio(script_key, profile_name, script_text):
    """Call Voicebox /generate endpoint."""
    payload = {
        "text": script_text,
        "profile": profile_name,  # Voicebox resolves by name or ID
        "language": "en",
    }

    try:
        print(f"  Submitting {script_key} (profile: {profile_name})...", end=" ", flush=True)
        resp = requests.post(GENERATE_ENDPOINT, json=payload, timeout=30)

        if resp.status_code in [200, 202]:
            result = resp.json()
            job_id = result.get("id") or result.get("job_id")
            print(f"Job ID: {job_id}")
            return job_id
        else:
            print(f"ERROR: {resp.status_code}")
            print(f"  Response: {resp.text}")
            return None
    except requests.RequestException as e:
        print(f"ERROR: {e}")
        return None


def poll_job_status(job_id, max_wait=600):
    """Poll until job completes or times out."""
    start = time.time()

    while time.time() - start < max_wait:
        try:
            resp = requests.get(f"{STATUS_ENDPOINT}/{job_id}", timeout=10)
            if resp.status_code == 200:
                result = resp.json()
                status = result.get("status")

                if status == "completed":
                    audio_url = result.get("audio_url") or result.get("output")
                    return True, audio_url
                elif status == "failed":
                    error = result.get("error", "Unknown error")
                    return False, error
                # Still processing; wait and retry
                time.sleep(2)
            else:
                time.sleep(2)
        except requests.RequestException as e:
            print(f"    Poll error: {e}")
            time.sleep(2)

    return False, "Timeout"


def main():
    # Check prerequisites
    if not check_voicebox_running():
        print("❌ Voicebox is not running or not accessible at", VOICEBOX_URL)
        print("   Start Voicebox and try again.")
        sys.exit(1)

    # Create output directory
    OUTPUT_DIR.mkdir(exist_ok=True)
    print(f"📁 Output directory: {OUTPUT_DIR.absolute()}\n")

    # Find all EP2 scripts
    script_dir = Path(".")
    scripts = sorted(script_dir.glob("*-ep2.txt"))

    if not scripts:
        print("❌ No *-ep2.txt scripts found in current directory.")
        sys.exit(1)

    print(f"Found {len(scripts)} Episode 2 scripts.\n")

    job_results = {}

    # Submit all generation jobs
    print("=== Submitting generation jobs ===\n")
    for script_path in scripts:
        script_key = script_path.stem  # e.g., "01-true-crime-brief-ep2" → "01-true-crime-brief"
        script_key_base = "-".join(script_key.split("-")[:-1])  # Remove "-ep2" suffix

        profile_name = VOICE_PROFILES.get(script_key_base)
        if not profile_name:
            print(f"⚠️  {script_key}: No profile mapping found, skipping.")
            continue

        script_text = read_script(script_path)
        job_id = generate_audio(script_key, profile_name, script_text)

        if job_id:
            job_results[script_key] = {
                "profile": profile_name,
                "job_id": job_id,
                "status": "pending",
            }

        time.sleep(0.5)  # Small delay between submissions

    print(f"\nSubmitted {len(job_results)} jobs. Polling for completion...\n")
    print("=== Polling job status ===\n")

    # Poll all jobs
    completed = 0
    failed = 0

    for script_key, job_info in job_results.items():
        job_id = job_info["job_id"]
        profile = job_info["profile"]

        print(f"Waiting for {script_key} (job: {job_id})...", end=" ", flush=True)
        success, result = poll_job_status(job_id)

        if success:
            # Download audio from result URL or use the returned path
            output_path = OUTPUT_DIR / f"{script_key}.mp3"

            # If result is a URL, download it
            if isinstance(result, str) and result.startswith("http"):
                try:
                    audio_resp = requests.get(result, timeout=30)
                    with open(output_path, "wb") as f:
                        f.write(audio_resp.content)
                    print(f"✅ Saved to {output_path}")
                    completed += 1
                except Exception as e:
                    print(f"❌ Download failed: {e}")
                    failed += 1
            else:
                # Result is already a local path
                print(f"✅ Generated (check Voicebox app for {result})")
                completed += 1
        else:
            print(f"❌ Failed: {result}")
            failed += 1

    # Summary
    print(f"\n=== Summary ===")
    print(f"✅ Completed: {completed}")
    print(f"❌ Failed: {failed}")
    print(f"📁 Output: {OUTPUT_DIR.absolute()}")


if __name__ == "__main__":
    main()
