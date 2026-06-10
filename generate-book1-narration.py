#!/usr/bin/env python3
"""
Step 2: Generate warm, motherly voice narration for Book 1
Uses ElevenLabs for professional quality voice
"""

import os
import sys
import json
from pathlib import Path

NARRATION_TEXT = """The sky was the colour of ripe plums when Sunny first saw them. One. Then three. Then many.

Flying foxes, sailing out from their roost in the old fig tree at the edge of the bush. Their wings were wide and dark, and they moved through the air without a sound — no flap, no flutter, just a long, smooth, swooping glide.

Sunny stood very still and watched. They were so large and so quiet. She had not known something so big could move so softly.

One flew low, close enough that Sunny could see the warm dark fur of its body and its little fox-like face — neat ears, bright eyes, a pointed nose. It swooped toward a flowering tree and hovered for just a moment, drinking from a blossom.

Then it was gone again, back into the darkening sky. The others followed their own paths — long curved arcs through the air, each one different, each one beautiful.

Sunny watched until the sky turned from plum to deep navy and the stars came out, and still the flying foxes moved above her, silent and grand.

She sat down in the soft grass and looked up. The bush was full of quiet. The flying foxes were just shapes now — dark against the dark sky, moving and moving.

She breathed out a long, slow breath. And drifted off beneath the wings of night.

Her eyes grew heavy. The stars twinkled on, one by one, keeping watch through the night. And as Sunny drifted off to sleep, a tiny smile stayed on her face.

Because now she knew — even in the dark, the sky was always full of light.

Goodnight, Sunny. Goodnight, flying foxes. Goodnight, little one."""

OUTPUT_DIR = Path("/home/user/jamie-wigg/BOOK-1-NARRATION")
OUTPUT_DIR.mkdir(exist_ok=True)

def generate_with_elevenlabs(text: str, api_key: str) -> bytes:
    """Generate narration using ElevenLabs API"""
    import requests

    if not api_key:
        raise ValueError("ELEVENLABS_API_KEY not set")

    # Warm, motherly voice - "Rachel" or similar
    voice_id = "21m00Tcm4TlvDq8ikWAM"  # Rachel - warm, motherly

    headers = {
        "xi-api-key": api_key,
        "Content-Type": "application/json",
    }

    payload = {
        "text": text,
        "model_id": "eleven_monolingual_v1",
        "voice_settings": {
            "stability": 0.5,
            "similarity_boost": 0.75,
            "style": 0.0,
            "use_speaker_boost": True,
        }
    }

    print(f"Generating narration with ElevenLabs...")
    print(f"  Voice: Rachel (warm, motherly)")
    print(f"  Text length: {len(text)} characters")

    response = requests.post(
        f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}",
        json=payload,
        headers=headers,
        timeout=300
    )

    if response.status_code != 200:
        raise Exception(f"ElevenLabs API error: {response.status_code} - {response.text}")

    return response.content

def generate_with_piper(text: str) -> bytes:
    """Fallback: Generate with local Piper TTS"""
    import subprocess
    import tempfile

    print(f"Generating narration with Piper TTS (local)...")
    print(f"  Voice: en_US-lessac-medium")
    print(f"  Text length: {len(text)} characters")

    # Write text to temp file
    with tempfile.NamedTemporaryFile(mode="w", suffix=".txt", delete=False) as f:
        f.write(text)
        temp_txt = f.name

    temp_wav = temp_txt.replace(".txt", ".wav")

    try:
        # Use piper if available
        result = subprocess.run(
            ["piper", "--model", "en_US-lessac-medium", "--output_file", temp_wav],
            stdin=open(temp_txt),
            capture_output=True,
            timeout=300
        )

        if result.returncode != 0:
            raise Exception(f"Piper failed: {result.stderr.decode()}")

        with open(temp_wav, "rb") as f:
            audio_data = f.read()

        return audio_data

    finally:
        if os.path.exists(temp_txt):
            os.remove(temp_txt)
        if os.path.exists(temp_wav):
            os.remove(temp_wav)

def main():
    print("=" * 70)
    print("Generating Book 1 Narration")
    print("=" * 70)
    print()

    api_key = os.getenv("ELEVENLABS_API_KEY")

    audio_data = None

    if api_key:
        try:
            audio_data = generate_with_elevenlabs(NARRATION_TEXT, api_key)
            print("✓ ElevenLabs narration generated")
        except Exception as e:
            print(f"⚠ ElevenLabs failed: {e}")
            print("  Falling back to Piper...")

    if not audio_data:
        try:
            audio_data = generate_with_piper(NARRATION_TEXT)
            print("✓ Piper narration generated")
        except Exception as e:
            print(f"✗ Piper failed: {e}")
            return 1

    # Save audio
    output_file = OUTPUT_DIR / "narration.mp3"
    with open(output_file, "wb") as f:
        f.write(audio_data)

    print(f"\n✓ Narration saved: {output_file}")
    print(f"✓ File size: {len(audio_data) / 1024 / 1024:.1f}MB")

    # Get duration
    try:
        import subprocess
        result = subprocess.run(
            ["ffprobe", "-v", "error", "-show_entries", "format=duration",
             "-of", "default=noprint_wrappers=1:nokey=1:novalue=1", str(output_file)],
            capture_output=True,
            timeout=10
        )
        duration = float(result.stdout.decode().strip())
        print(f"✓ Duration: {duration:.1f} seconds (~{duration/60:.1f} minutes)")
    except:
        print("(Could not determine duration)")

    return 0

if __name__ == "__main__":
    sys.exit(main())
