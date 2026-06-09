#!/usr/bin/env python3
"""Generate narration for bedtime story using Kokoro TTS"""

import subprocess
import sys
from pathlib import Path

# Read the script
script_path = Path("/home/user/jamie-wigg/sunny-bedtime-videos/book-001-stars/script.txt")
with open(script_path, 'r') as f:
    text = f.read()

# Remove title line (first line)
text_lines = text.strip().split('\n')
if text_lines[0] == "Sunny Watches the Stars Come Out":
    text = '\n'.join(text_lines[1:]).strip()

output_path = Path("/home/user/jamie-wigg/sunny-bedtime-videos/book-001-stars/narration.wav")

print(f"Generating narration for Book 001...")
print(f"Text length: {len(text)} characters")

# Use Python kokoro library to generate speech
try:
    from kokoro_onnx import Kokoro

    print("Loading Kokoro TTS model...")
    kokoro = Kokoro()

    print("Generating audio (this may take 1-2 minutes)...")
    samples, sample_rate = kokoro.synthesize(text, voice="af_heart", speed=0.9)

    # Save as WAV
    import wave
    with wave.open(str(output_path), 'w') as wav_file:
        wav_file.setnchannels(1)
        wav_file.setsampwidth(2)
        wav_file.setframerate(sample_rate)
        wav_file.writeframes(samples.tobytes())

    print(f"✓ Narration saved: {output_path}")
    print(f"✓ Audio length: {len(samples) / sample_rate:.1f} seconds")

except ImportError:
    print("⚠ Kokoro library not available, trying alternative method...")
    # Alternative: use command line
    cmd = f'echo "{text}" | kokoro-tts --voice af_heart --speed 0.9 -o "{output_path}"'
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    if result.returncode == 0:
        print(f"✓ Narration generated: {output_path}")
    else:
        print(f"⚠ Error: {result.stderr}")
