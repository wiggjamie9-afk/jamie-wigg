#!/usr/bin/env python3
"""Add female TTS narration to video"""

from pathlib import Path
import subprocess
import sys

# Extract narration text
story = """As the warm golden afternoon faded gently away, little Sunny the quokka sat on his favourite mossy rock and looked up at the sky. The sky was turning the most beautiful colours Sunny had ever seen. Soft pink, like the inside of a flower. Warm orange, like a ripe peach. And then, slowly, a deep, soft purple began to spread across the sky, like a cosy blanket being pulled up high. Sunny smiled his gentle smile. He had never stayed up to watch the evening come before. The bush grew quiet. The birds settled into their nests, tucking their heads beneath their wings. The crickets began their soft, steady song. Cree cree cree. Like tiny lullabies all around. Sunny waited, very still, his big warm eyes wide with wonder. And then there it was. One tiny light, twinkling softly in the purple sky. Oh, said Sunny, very quietly. Then another. And another. One by one, the stars came out to say hello. Each one a small, soft sparkle, like someone had sprinkled glitter across a dark velvet cloth. Sunny had never seen anything so beautiful in all his little life. He lay back on his mossy rock, looking up and up and up at all the tiny lights. There were so many of them. Enough for everyone to have their very own. The warm breeze moved gently through the eucalyptus leaves, making a soft shushing sound. Sunny's eyes grew heavy. The stars twinkled on, one by one, keeping watch through the night. And as Sunny drifted off to sleep, a tiny smile stayed on his face. Because now he knew. Even in the dark, the sky was always full of light. Goodnight, Sunny. Goodnight, stars. Goodnight, little one."""

output_file = Path("/home/user/jamie-wigg/sunny-bedtime-videos/book-001-stars/narration-female.wav")

print("Generating female TTS narration...")

# Try using available TTS - use google_tts if available or create placeholder
try:
    from gtts import gTTS
    tts = gTTS(story, lang='en', slow=True)
    tts.save(str(output_file))
    print(f"✓ Narration created: {output_file}")
except ImportError:
    print("⚠ gTTS not available, using placeholder audio...")
    import wave
    import numpy as np
    
    # Create silent placeholder for now
    sample_rate = 44100
    duration_seconds = 52  # Approximate story duration
    samples = np.zeros(int(sample_rate * duration_seconds), dtype=np.int16)
    
    with wave.open(str(output_file), 'w') as wav_file:
        wav_file.setnchannels(1)
        wav_file.setsampwidth(2)
        wav_file.setframerate(sample_rate)
        wav_file.writeframes(samples.tobytes())
    
    print(f"✓ Audio placeholder: {output_file}")

print("✓ Ready to merge with video...")
