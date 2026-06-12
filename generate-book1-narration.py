#!/usr/bin/env python3
"""
Step 2: Generate warm, motherly narration for Book 1
Uses ElevenLabs API with Rachel voice (soft, warm, bedtime-appropriate)
"""

import os
import sys
from pathlib import Path
import requests

OUTPUT_DIR = Path("/home/user/jamie-wigg/BOOK-1-NARRATION")
OUTPUT_DIR.mkdir(exist_ok=True)

# Complete story text for the Flying Fox book
STORY_TEXT = """
The sky was the colour of ripe plums when Sunny first saw them. One. Then three. Then many.

Flying foxes, sailing out from their roost in the old fig tree. Their wings were wide and dark, moving through the air without a sound.

No flap, no flutter, just a long, smooth, swooping glide. Sunny stood very still and watched.

They were so large and so quiet. She had not known something so big could move so softly.

One flew low, close enough that Sunny could see the warm dark fur of its body and its little fox-like face.

Neat ears, bright eyes, a pointed nose. It swooped toward a flowering tree and hovered for just a moment.

Drinking from a blossom. Then it was gone again, back into the darkening sky.

The others followed their own paths — long curved arcs through the air, each one different.

Each one beautiful. Sunny watched until the sky turned from plum to deep navy.

The stars came out, and still the flying foxes moved above her. Silent and grand.

She sat down in the soft grass and looked up. The bush was full of quiet.

The flying foxes were just shapes now — dark against the dark sky, moving and moving.

She breathed out a long, slow breath. And drifted off beneath the wings of night.

Her eyes grew heavy. The stars twinkled on, keeping watch through the night.

And a tiny smile stayed on her face. Goodnight, Sunny. Goodnight, flying foxes. Goodnight, little one.
"""

def generate_narration_with_elevenlabs(text: str, api_key: str) -> bytes:
    """Generate warm, soft narration using ElevenLabs API"""

    if not api_key:
        raise ValueError("ELEVENLABS_API_KEY not provided")

    # Use Rachel voice (warm, motherly, soft-spoken)
    voice_id = "21m00Tcm4TlvDq8ikWAM"  # Rachel voice

    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"

    headers = {
        "xi-api-key": api_key,
        "Content-Type": "application/json"
    }

    payload = {
        "text": text,
        "model_id": "eleven_monolingual_v1",
        "voice_settings": {
            "stability": 0.5,
            "similarity_boost": 0.75
        }
    }

    print(f"Generating narration with Rachel voice (ElevenLabs)...")

    response = requests.post(url, json=payload, headers=headers, timeout=60)

    if response.status_code != 200:
        raise Exception(f"ElevenLabs API error: {response.status_code} - {response.text}")

    return response.content

def main():
    print("=" * 70)
    print("Generating Book 1 Narration")
    print("=" * 70)

    api_key = os.getenv("ELEVENLABS_API_KEY")

    if not api_key:
        print("ERROR: ELEVENLABS_API_KEY environment variable not set")
        print("\nUsage:")
        print("  export ELEVENLABS_API_KEY='your-key-here'")
        print("  python3 generate-book1-narration.py")
        sys.exit(1)

    try:
        print(f"\n✓ Generating warm, motherly narration...")
        print(f"  Voice: Rachel (soft, warm, bedtime-appropriate)")
        print(f"  Duration: ~8-10 minutes")
        print()

        # Generate narration
        audio_data = generate_narration_with_elevenlabs(STORY_TEXT, api_key)

        # Save narration
        output_file = OUTPUT_DIR / "narration.wav"
        with open(output_file, "wb") as f:
            f.write(audio_data)

        print(f"✓ Narration complete!")
        print(f"✓ Saved: {output_file}")
        print(f"✓ Ready for video assembly")

        return 0

    except Exception as e:
        print(f"✗ ERROR: {e}")
        return 1

if __name__ == "__main__":
    sys.exit(main())
