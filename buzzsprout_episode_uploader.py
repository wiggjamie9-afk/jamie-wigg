#!/usr/bin/env python3
"""
Buzzsprout Episode Uploader — Upload all 240 episodes to 20 podcasts
and schedule for Monday/Wednesday/Friday release.

Usage: python3 buzzsprout_episode_uploader.py
"""

import os
import json
import requests
from datetime import datetime, timedelta
from pathlib import Path

# Configuration
API_KEY = "8d981d4c93a623ce79c3fa30afd2d5dc"
BASE_URL = "https://www.buzzsprout.com/api"

# Podcast ID mapping (show_number -> podcast_id)
PODCASTS = {
    "01": 2626157,  # True Crime Brief
    "02": 2626160,  # AI Briefing
    "03": 2626161,  # Dating Decoded
    "04": 2626163,  # Side Hustle School
    "05": 2626165,  # Dad Code
    "06": 2626167,  # Money Mindset
    "07": 2626170,  # Sleep & Calm
    "08": 2626171,  # Longevity Brief
    "09": 2626172,  # History Uncovered
    "10": 2626173,  # Unexplained
    "11": 2626174,  # Pop Culture Now
    "12": 2626175,  # Stoic Minute
    "13": 2626177,  # Focus Lab
    "14": 2626178,  # Parenting Playbook
    "15": 2626179,  # Sports Unfiltered
    "16": 2626180,  # Plain Tech
    "17": 2626181,  # Founders' Stories
    "18": 2626182,  # Calm Mind
    "19": 2626183,  # 15-Minute Kitchen
    "20": 2626184,  # Wanderlust
}

# Audio file directories
AUDIO_DIRS = [
    Path("voiceover-kit/audio-ep23"),
    Path("voiceover-kit/audio-ep24"),
]

def get_audio_files():
    """Find all audio files and map to shows."""
    episodes = {}
    for audio_dir in AUDIO_DIRS:
        if not audio_dir.exists():
            print(f"⚠️  {audio_dir} not found")
            continue
        for mp3_file in sorted(audio_dir.glob("*.mp3")):
            # Parse filename: ep23-01.mp3 or ep24-15.mp3
            # Extract show number (01-20)
            parts = mp3_file.stem.split("-")
            if len(parts) >= 2:
                show_num = parts[1].zfill(2)  # Ensure 2-digit format
                if show_num not in episodes:
                    episodes[show_num] = []
                episodes[show_num].append(mp3_file)
    return episodes

def upload_episode(podcast_id, title, audio_file, published_at):
    """Upload a single episode to Buzzsprout."""
    url = f"{BASE_URL}/{podcast_id}/episodes.json"
    headers = {
        "Authorization": f"Token token={API_KEY}",
        "Content-Type": "application/json",
        "User-Agent": "Claude-Buzzsprout-Uploader",
    }

    # Read audio file
    with open(audio_file, "rb") as f:
        audio_data = f.read()

    # Step 1: Upload audio to get remote URL
    print(f"  Uploading audio: {audio_file.name}...", end=" ", flush=True)
    # Buzzsprout expects audio upload via form data or direct file upload
    # For simplicity, we'll use the API's episode creation with audio

    payload = {
        "episode": {
            "title": title,
            "published_at": published_at.isoformat(),
            "audio_file": audio_file.name,  # Buzzsprout will fetch from URL if provided
        }
    }

    # Note: Direct audio file upload to Buzzsprout API requires multipart/form-data
    # For production, use requests with files parameter
    files = {
        "episode[audio_file]": open(audio_file, "rb"),
    }
    form_data = {
        "episode[title]": title,
        "episode[published_at]": published_at.isoformat(),
    }

    try:
        response = requests.post(
            url,
            headers={
                "Authorization": f"Token token={API_KEY}",
                "User-Agent": "Claude-Buzzsprout-Uploader",
            },
            data=form_data,
            files=files,
        )
        response.raise_for_status()
        print("✓")
        return response.json()
    except Exception as e:
        print(f"✗ Error: {e}")
        return None
    finally:
        files["episode[audio_file]"].close()

def schedule_episodes():
    """Schedule all episodes for Monday/Wednesday/Friday release."""
    print("\n📅 Scheduling episodes for release...\n")

    # Get audio files
    episodes_by_show = get_audio_files()

    if not episodes_by_show:
        print("❌ No audio files found. Check audio directories.")
        return

    # Calculate release dates (Mon/Wed/Fri, starting next Monday)
    today = datetime.now()
    days_until_monday = (7 - today.weekday()) % 7
    if days_until_monday == 0:
        days_until_monday = 7
    next_monday = today + timedelta(days=days_until_monday)

    release_cycle = [next_monday, next_monday + timedelta(days=2), next_monday + timedelta(days=4)]
    cycle_index = 0
    episode_number = 2  # Start from episode 2

    total_uploaded = 0
    failed = 0

    for show_num in sorted(PODCASTS.keys()):
        if show_num not in episodes_by_show:
            print(f"⚠️  Show {show_num}: No audio files found")
            continue

        podcast_id = PODCASTS[show_num]
        audio_files = episodes_by_show[show_num]

        print(f"📻 Show {show_num} (ID: {podcast_id}) → {len(audio_files)} episodes")

        for audio_file in audio_files:
            # Calculate release date
            release_date = release_cycle[cycle_index % 3]

            # Determine episode number from filename or sequence
            # Assume files are in order (ep2, ep3, ep4, ...)
            episode_num = episode_number
            title = f"Episode {episode_num}"

            print(f"  Episode {episode_num} → {release_date.strftime('%A, %b %d')}", end=" ")

            result = upload_episode(podcast_id, title, audio_file, release_date)
            if result:
                total_uploaded += 1
                print("✓")
            else:
                failed += 1
                print("✗")

            episode_number += 1
            cycle_index += 1

    print(f"\n✅ Upload complete: {total_uploaded} episodes uploaded, {failed} failed")
    print(f"📅 Release schedule: Monday/Wednesday/Friday, starting {release_cycle[0].strftime('%b %d')}")

if __name__ == "__main__":
    print("🚀 Buzzsprout Episode Uploader\n")
    schedule_episodes()
