#!/usr/bin/env python3
"""
ElevenLabs Narration Generation Script
=======================================

Generates warm, motherly narration for Book 1 using ElevenLabs TTS.

Run this on your local machine (with network access):
    python3 generate-book1-narration.py

Prerequisites:
    - pip install elevenlabs
    - ELEVENLABS_API_KEY in .env or exported as env var

The story text is ~90 seconds of narration read in a warm, motherly tone.
Available voices: Grace, Emily, Julia (or use your own voice ID)
"""

import os
from pathlib import Path

# Configuration
API_KEY = os.getenv("ELEVENLABS_API_KEY", "")
VOICE_OPTIONS = {
    "Grace": "hHgKBksqt2OZ0k9YxZF7",   # Warm, motherly, calm
    "Emily": "eoKVQn7u4w1snyyx77NE",   # Gentle, nurturing
    "Julia": "mXrLmjqKlX7LOlEFW1LH",   # Warm and intimate
}

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

OUTPUT_FILE = Path("book-1-narration.wav")

def select_voice():
    """Let user choose which voice to use."""
    print("\n🎤 Select Narration Voice")
    print("=" * 50)
    print("\nAvailable voices (warm and motherly):")
    for i, (name, voice_id) in enumerate(VOICE_OPTIONS.items(), 1):
        print(f"  {i}. {name} ({voice_id})")

    print("\nOr provide your own ElevenLabs voice ID")
    choice = input("\nEnter voice number (1-3) or paste your voice ID: ").strip()

    if choice in ["1", "2", "3"]:
        voices = list(VOICE_OPTIONS.values())
        return voices[int(choice) - 1]
    else:
        return choice

def generate_narration(api_key, voice_id):
    """Generate narration using ElevenLabs."""
    if not api_key:
        print("\n❌ ELEVENLABS_API_KEY not found!")
        print("   Set it in your .env file or export it:")
        print("   export ELEVENLABS_API_KEY='your-api-key'")
        return False

    print(f"\n🎙️  Generating narration...")
    print(f"   Voice: {voice_id}")
    print(f"   Output: {OUTPUT_FILE}")

    try:
        from elevenlabs import ElevenLabs
        client = ElevenLabs(api_key=api_key)

        # Generate audio
        audio = client.text_to_speech.convert(
            voice_id=voice_id,
            text=STORY_TEXT,
            model_id="eleven_monolingual_v1",
            voice_settings={
                "stability": 0.5,
                "similarity_boost": 0.75,
            }
        )

        # Save to file
        with open(OUTPUT_FILE, 'wb') as f:
            for chunk in audio:
                f.write(chunk)

        print(f"✅ Narration generated: {OUTPUT_FILE}")
        return True

    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def main():
    """Main workflow."""
    print("\n🌙 SUNNY'S BEDTIME TALES - Book 1 Narration Generation")
    print("=" * 70)

    # Select voice
    voice_id = select_voice()
    print(f"\n✅ Selected voice: {voice_id}")

    # Generate narration
    success = generate_narration(API_KEY, voice_id)

    if success:
        print("\n✅ Narration complete!")
        print("\nNext step: Run assemble-book1-final-video.py to create the MP4 with narration")
    else:
        print("\n❌ Narration generation failed")
        return False

if __name__ == "__main__":
    main()
