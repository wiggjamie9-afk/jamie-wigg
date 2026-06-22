#!/usr/bin/env python3
"""
Quick batch generation: Episode 2 audio using Kokoro preset voices.
No profile setup needed — run and go.

Prerequisites:
- Voicebox running at http://127.0.0.1:17493
- Kokoro TTS engine available

Usage:
    python generate-ep2-kokoro-quick.py
"""

import json
import os
import time
from pathlib import Path

import requests

VOICEBOX_URL = "http://127.0.0.1:17493"

# Kokoro preset voices — swap as needed
VOICE_MAP = {
    "01-true-crime-brief": "Marcus",  # deep, cinematic
    "02-ai-briefing": "Aria",  # clear, neutral
    "03-dating-decoded": "Sage",  # calm, warm
    "04-side-hustle-school": "Will",  # energetic
    "05-dad-code": "Jackson",  # real, friendly
    "06-money-mindset": "Ember",  # calm, clear
    "07-sleep-and-calm": "Luna",  # soft, soothing
    "08-longevity-brief": "Victor",  # authoritative
    "09-history-uncovered": "Marcus",  # cinematic
    "10-unexplained": "Orion",  # mysterious
    "11-pop-culture-now": "Breeze",  # bright, energetic
    "12-stoic-minute": "Orion",  # thoughtful
    "13-focus-lab": "Will",  # sharp, modern
    "14-parenting-playbook": "Ember",  # warm, grounded
    "15-sports-unfiltered": "Jackson",  # punchy
    "16-plain-tech": "Aria",  # reassuring, clear
    "17-founders-stories": "Victor",  # narrative, engaging
    "18-calm-mind": "Luna",  # gentle, therapeutic
    "19-fifteen-minute-kitchen": "Breeze",  # warm, fun
    "20-wanderlust": "Sage",  # dreamy, evocative
}

OUTPUT_DIR = Path("./audio-ep2")


def read_script(script_path):
    """Read script, skip header."""
    with open(script_path, "r", encoding="utf-8") as f:
        lines = f.readlines()
    start_idx = next((i + 1 for i, line in enumerate(lines) if line.strip() == "---"), 0)
    return "".join(lines[start_idx:]).strip()


def main():
    # Verify Voicebox
    try:
        requests.get(f"{VOICEBOX_URL}/profiles", timeout=5)
    except:
        print("❌ Voicebox not running. Start it and try again.")
        return

    OUTPUT_DIR.mkdir(exist_ok=True)
    scripts = sorted(Path(".").glob("*-ep2.txt"))

    print(f"🎙️  Generating {len(scripts)} Episode 2 MP3s with Kokoro preset voices...\n")

    completed = 0
    for script_path in scripts:
        script_key = script_path.stem.replace("-ep2", "")
        voice = VOICE_MAP.get(script_key, "Aria")
        script_text = read_script(script_path)

        payload = {"text": script_text, "profile": voice, "engine": "kokoro"}

        try:
            print(f"{script_key:35} → {voice:12}", end=" ", flush=True)
            resp = requests.post(f"{VOICEBOX_URL}/generate", json=payload, timeout=30)

            if resp.status_code in [200, 202]:
                print("✅")
                completed += 1
            else:
                print(f"❌ ({resp.status_code})")
        except Exception as e:
            print(f"❌ ({e})")

        time.sleep(0.2)

    print(f"\n✅ Submitted {completed}/{len(scripts)} jobs.")
    print(f"📁 Check Voicebox app → Generations tab for progress.")
    print(f"💾 MP3s will be in {OUTPUT_DIR.absolute()}/")


if __name__ == "__main__":
    main()
