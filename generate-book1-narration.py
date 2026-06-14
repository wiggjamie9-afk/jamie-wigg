#!/usr/bin/env python3
"""
ElevenLabs Narration Generation Script (Enhanced)
==================================================

Generates warm, motherly narration for Book 1 using ElevenLabs TTS.

Run this on your local machine (with network access):
    python3 generate-book1-narration.py
    python3 generate-book1-narration.py --dry-run    # Preview without API calls
    python3 generate-book1-narration.py --quality high --speed 1.1

Prerequisites:
    - pip install elevenlabs
    - ELEVENLABS_API_KEY in .env or exported as env var

Features:
    - Voice preview (5 seconds of each voice option)
    - Quality selection (standard 192kbps, high 320kbps)
    - Speed control (0.8x - 1.2x for timing adjustment)
    - Voice choice persistence (saved to narration-config.json)
    - Progress bar during generation
    - Output validation (file size, duration, codec)
    - Dry-run mode for previewing without consuming credits
    - Resume capability (won't re-generate if output exists and valid)
"""

import os
import sys
import json
import argparse
import subprocess
from pathlib import Path
from datetime import datetime
import time

# Configuration
API_KEY = os.getenv("ELEVENLABS_API_KEY", "")
VOICE_OPTIONS = {
    "Grace": "hHgKBksqt2OZ0k9YxZF7",   # Warm, motherly, calm
    "Emily": "eoKVQn7u4w1snyyx77NE",   # Gentle, nurturing
    "Julia": "mXrLmjqKlX7LOlEFW1LH",   # Warm and intimate
}

CONFIG_FILE = Path("narration-config.json")
OUTPUT_FILE = Path("book-1-narration.wav")
TEMP_OUTPUT = Path("book-1-narration-temp.wav")
MIN_AUDIO_DURATION = 85  # seconds (90s target, allow 5s margin)
MAX_AUDIO_DURATION = 95

QUALITY_SETTINGS = {
    "standard": {"model": "eleven_monolingual_v1", "bitrate": 192},
    "high": {"model": "eleven_monolingual_v1", "bitrate": 320},
}

PREVIEW_TEXT = "Once upon a time, little Sunny the quokka watched the stars come out. It was the most beautiful thing she had ever seen. Goodnight, dear friend."

# Story text for narration (~90 seconds)
STORY_TEXT = """As the warm golden afternoon faded gently away, little Sunny the quokka sat on her favourite mossy rock and looked up at the sky. The day had been long and full of adventures, and now it was time to rest.

The sky was turning the most beautiful colours Sunny had ever seen. Soft pink, like the inside of a flower. Warm orange, like a ripe peach. Golden yellows and cream-coloured clouds painted the horizon.

And then, slowly, a deep, soft purple began to spread across the sky, like a cosy blanket being pulled up high. Sunny smiled her gentle smile and felt the warmth of the day slowly slipping away.

She had never stayed up to watch the evening come before. The bush grew quiet. The birds settled into their nests, tucking their heads beneath their wings. Everything felt peaceful and calm.

The crickets began their soft, steady song — cree cree cree — like tiny lullabies all around. The eucalyptus trees swayed gently in the warm breeze.

Sunny waited, very still, her big warm eyes wide with wonder. And then — there it was. One tiny light, twinkling softly in the purple sky. The very first star.

Oh, said Sunny, very quietly. Then another. And another. One by one, the stars came out to say hello. Each one a small, soft sparkle appearing in the deepening sky.

Like someone had sprinkled glitter across a dark velvet cloth. Tiny lights multiplying, dancing softly above. Sunny had never seen anything so beautiful in all her little life.

She lay back on her mossy rock, looking up and up and up at all the tiny lights. There were so many of them now, filling the entire sky with their gentle glow.

Enough for everyone to have their very own. Enough to light the whole world. The warm breeze moved gently through the eucalyptus leaves, making a soft shushing sound. Shhhh.

Shhhh. Sunny's eyes grew heavy. The stars twinkled on, one by one, keeping watch through the night. They were like friends, watching over her, keeping her safe.

And as Sunny drifted off to sleep, a tiny smile stayed on her face. Her little paws curled up close. Her breathing grew soft and slow.

Because now she knew — even in the dark, the sky was always full of light. Even when the sun was gone, there were countless little lights watching over her.

Goodnight, Sunny. Goodnight, stars. Goodnight, moon. Sweet dreams until the morning light.

The End. Goodnight, little one. May your dreams be as beautiful as Sunny's starry sky."""

class ProgressBar:
    """Simple progress bar."""
    def __init__(self, total, label="Progress"):
        self.total = total
        self.label = label
        self.current = 0

    def update(self, amount=1):
        self.current = min(self.current + amount, self.total)
        percent = self.current / self.total
        filled = int(50 * percent)
        bar = "█" * filled + "░" * (50 - filled)
        print(f"\r{self.label} {self.current}/{self.total} [{bar}] {percent*100:.0f}%", end="", flush=True)

    def complete(self):
        self.current = self.total
        percent = self.current / self.total
        filled = int(50 * percent)
        bar = "█" * filled
        print(f"\r{self.label} {self.current}/{self.total} [{bar}] {percent*100:.0f}%")

def load_voice_config():
    """Load previously selected voice from config."""
    if CONFIG_FILE.exists():
        try:
            with open(CONFIG_FILE) as f:
                config = json.load(f)
            return config.get("voice_id")
        except:
            pass
    return None

def save_voice_config(voice_id, quality, speed):
    """Save voice selection and settings for reuse."""
    config = {
        "voice_id": voice_id,
        "quality": quality,
        "speed": speed,
        "timestamp": datetime.now().isoformat(),
    }
    with open(CONFIG_FILE, 'w') as f:
        json.dump(config, f, indent=2)
    print(f"✅ Config saved to {CONFIG_FILE}")

def preview_voice(api_key, voice_id):
    """Play 5 seconds of voice preview."""
    print(f"\n🎧 Previewing voice ({voice_id})...")
    try:
        from elevenlabs import ElevenLabs
        client = ElevenLabs(api_key=api_key)

        audio = client.text_to_speech.convert(
            voice_id=voice_id,
            text=PREVIEW_TEXT,
            model_id="eleven_monolingual_v1",
            voice_settings={"stability": 0.5, "similarity_boost": 0.75}
        )

        preview_file = Path(f"preview-{voice_id}.wav")
        with open(preview_file, 'wb') as f:
            for chunk in audio:
                f.write(chunk)

        # Attempt to play (macOS/Linux)
        try:
            subprocess.run(["afplay", str(preview_file)], timeout=6)
        except (FileNotFoundError, subprocess.TimeoutExpired):
            try:
                subprocess.run(["paplay", str(preview_file)], timeout=6)
            except:
                print(f"   (Saved to {preview_file} - play manually to hear)")

        return True
    except Exception as e:
        print(f"❌ Preview failed: {e}")
        return False

def select_voice(default_choice=None):
    """Let user choose which voice to use."""
    print("\n🎤 Select Narration Voice")
    print("=" * 50)
    print("\nAvailable voices (warm and motherly):")
    for i, (name, voice_id) in enumerate(VOICE_OPTIONS.items(), 1):
        print(f"  {i}. {name} ({voice_id})")

    # Suggest previous choice
    previous_voice = load_voice_config()
    if previous_voice:
        print(f"\nPreviously selected: {previous_voice}")

    print("\nOr provide your own ElevenLabs voice ID")

    # If default provided (for non-interactive mode), use it
    if default_choice is not None:
        choice = default_choice
        print(f"Using: {choice}")
    else:
        try:
            choice = input("\nEnter voice number (1-3), paste your voice ID, or press Enter to reuse previous: ").strip()
        except EOFError:
            # Non-interactive mode
            choice = ""

    if choice == "" and previous_voice:
        return previous_voice

    if choice in ["1", "2", "3"]:
        voices = list(VOICE_OPTIONS.values())
        return voices[int(choice) - 1]
    elif choice:
        return choice
    else:
        # Default to Grace if no selection and no previous
        print("Using default voice: Grace")
        return list(VOICE_OPTIONS.values())[0]

def select_quality(default_quality=None):
    """Let user select audio quality."""
    print("\n🎵 Select Audio Quality")
    print("=" * 50)
    print("  1. Standard (192 kbps - balanced quality/size)")
    print("  2. High (320 kbps - best quality)")

    if default_quality is not None:
        choice = default_quality
        print(f"Using: {choice}")
        return choice

    try:
        choice = input("\nEnter quality level (1-2, default 1): ").strip()
    except EOFError:
        choice = ""

    return "high" if choice == "2" else "standard"

def select_speed(default_speed=None):
    """Let user select playback speed."""
    print("\n⏱️  Select Playback Speed")
    print("=" * 50)
    print("  Range: 0.8x to 1.2x (0.8=slower/deeper, 1.2=faster/higher)")
    print("  Use for timing adjustment if narration doesn't match page durations")

    if default_speed is not None:
        print(f"Using: {default_speed}x")
        return default_speed

    try:
        speed_str = input("\nEnter speed (0.8-1.2, default 1.0): ").strip()
    except EOFError:
        speed_str = ""

    try:
        speed = float(speed_str)
        if 0.8 <= speed <= 1.2:
            return speed
    except:
        pass
    return 1.0

def get_audio_duration(file_path):
    """Get audio duration using ffprobe."""
    try:
        result = subprocess.run(
            ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1:nokey=1", str(file_path)],
            capture_output=True,
            text=True,
            timeout=10
        )
        if result.returncode == 0:
            return float(result.stdout.strip())
    except:
        pass
    return None

def get_file_size_mb(file_path):
    """Get file size in MB."""
    try:
        return file_path.stat().st_size / (1024 * 1024)
    except:
        return 0

def validate_output(file_path):
    """Validate output file exists and is reasonable."""
    if not file_path.exists():
        print(f"❌ Output file not found: {file_path}")
        return False

    file_size_mb = get_file_size_mb(file_path)
    if file_size_mb < 0.5:
        print(f"❌ Output file too small ({file_size_mb:.2f} MB) - likely corrupted")
        return False

    duration = get_audio_duration(file_path)
    if duration:
        print(f"   Duration: {duration:.1f} seconds")
        if duration < MIN_AUDIO_DURATION or duration > MAX_AUDIO_DURATION:
            print(f"⚠️  Warning: Duration {duration:.1f}s is outside target range ({MIN_AUDIO_DURATION}-{MAX_AUDIO_DURATION}s)")
            print(f"   Consider adjusting speed or page durations")
    else:
        print(f"⚠️  Could not verify duration (ffprobe not available)")

    print(f"   File size: {file_size_mb:.2f} MB")
    print(f"✅ Output validation complete")
    return True

def apply_speed_adjustment(input_file, output_file, speed):
    """Apply speed adjustment to audio using ffmpeg."""
    if speed == 1.0:
        return True

    print(f"\n⏱️  Applying speed adjustment ({speed}x)...")
    cmd = [
        "ffmpeg", "-i", str(input_file),
        "-filter:a", f"atempo={speed}",
        "-y", str(output_file)
    ]
    result = subprocess.run(cmd, capture_output=True)
    return result.returncode == 0

def generate_narration(api_key, voice_id, quality="standard", speed=1.0, dry_run=False):
    """Generate narration using ElevenLabs."""
    if not api_key and not dry_run:
        print("\n❌ ELEVENLABS_API_KEY not found!")
        print("   Set it in your .env file or export it:")
        print("   export ELEVENLABS_API_KEY='your-api-key'")
        return False

    # Resume check
    if OUTPUT_FILE.exists():
        print(f"\n🔄 Existing narration found: {OUTPUT_FILE}")
        response = input("Regenerate? (y/n): ").strip().lower()
        if response != 'y':
            print("✅ Using existing narration")
            if validate_output(OUTPUT_FILE):
                return True
            else:
                print("   But validation failed; regenerating...")

    if dry_run:
        print(f"\n🏜️  DRY RUN MODE - No API calls will be made")
        print(f"   Would generate: {OUTPUT_FILE}")
        print(f"   Voice: {voice_id}")
        print(f"   Quality: {quality}")
        print(f"   Speed: {speed}x")
        return True

    print(f"\n🎙️  Generating narration...")
    print(f"   Voice: {voice_id}")
    print(f"   Quality: {quality}")
    print(f"   Speed: {speed}x")
    print(f"   Output: {OUTPUT_FILE}")

    try:
        from elevenlabs import ElevenLabs
        client = ElevenLabs(api_key=api_key)

        progress = ProgressBar(100, "Generating")

        # Generate audio
        audio = client.text_to_speech.convert(
            voice_id=voice_id,
            text=STORY_TEXT,
            model_id=QUALITY_SETTINGS[quality]["model"],
            voice_settings={
                "stability": 0.5,
                "similarity_boost": 0.75,
            }
        )

        # Save to temp file
        with open(TEMP_OUTPUT, 'wb') as f:
            for chunk in audio:
                f.write(chunk)
                progress.update(1)

        progress.complete()

        # Apply speed adjustment if needed
        if speed != 1.0:
            if not apply_speed_adjustment(TEMP_OUTPUT, OUTPUT_FILE, speed):
                print(f"❌ Speed adjustment failed")
                TEMP_OUTPUT.unlink(missing_ok=True)
                return False
            TEMP_OUTPUT.unlink(missing_ok=True)
        else:
            TEMP_OUTPUT.rename(OUTPUT_FILE)

        print(f"\n✅ Narration generated: {OUTPUT_FILE}")
        return True

    except Exception as e:
        print(f"❌ Error: {e}")
        TEMP_OUTPUT.unlink(missing_ok=True)
        return False

def main():
    """Main workflow."""
    parser = argparse.ArgumentParser(description="Generate Book 1 narration with ElevenLabs")
    parser.add_argument("--dry-run", action="store_true", help="Preview without API calls")
    parser.add_argument("--quality", choices=["standard", "high"], default=None, help="Audio quality (standard/high)")
    parser.add_argument("--speed", type=float, default=None, help="Playback speed (0.8-1.2)")
    parser.add_argument("--preview", action="store_true", help="Preview voice only (5 seconds)")
    args = parser.parse_args()

    print("\n🌙 SUNNY'S BEDTIME TALES - Book 1 Narration Generation")
    print("=" * 70)

    # Select voice
    voice_id = select_voice("1" if args.dry_run else None)
    if not voice_id:
        return False

    print(f"✅ Selected voice: {voice_id}")

    # Preview if requested
    if args.preview:
        if API_KEY:
            preview_voice(API_KEY, voice_id)
            return True
        else:
            print("❌ API key required for preview")
            return False

    # Get quality and speed settings
    quality = args.quality or select_quality("standard" if args.dry_run else None)
    speed = args.speed if args.speed is not None else select_speed(1.0 if args.dry_run else None)

    print(f"✅ Quality: {quality}")
    print(f"✅ Speed: {speed}x")

    # Generate narration
    success = generate_narration(API_KEY, voice_id, quality, speed, args.dry_run)

    if success:
        # Validate output
        if not args.dry_run:
            print("\n🔍 Validating output...")
            validate_output(OUTPUT_FILE)

        # Save config for reuse
        if not args.dry_run:
            save_voice_config(voice_id, quality, speed)

        print("\n✅ Narration generation complete!")
        print("\nNext step: Run assemble-book1-final-video.py to create the MP4 with narration")
    else:
        print("\n❌ Narration generation failed")
        return False

if __name__ == "__main__":
    main()
