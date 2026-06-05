#!/usr/bin/env python3
"""
Create placeholder voice WAV files for SURGE pilot testing.
When integrated with ElevenLabs TTS, replace these with real voice narration.
"""

import wave
import struct
import math

def create_voice_placeholder(filename, duration, base_freq, text_description):
    """Generate a simple sine wave with frequency modulation to simulate speech."""

    sample_rate = 44100
    num_samples = int(sample_rate * duration)

    # Create audio data
    audio_data = []

    for i in range(num_samples):
        # Modulate frequency slightly to simulate voice variation
        time = i / sample_rate
        freq_mod = math.sin(2 * math.pi * 2 * time) * 20  # ±20Hz variation
        freq = base_freq + freq_mod

        # Generate sine wave with amplitude envelope
        amplitude = 0.3  # Keep volume reasonable
        sample = amplitude * math.sin(2 * math.pi * freq * time)

        # Fade in/out to avoid clicks
        if i < 2205:  # 50ms fade-in
            sample *= i / 2205
        if i > num_samples - 2205:  # 50ms fade-out
            sample *= (num_samples - i) / 2205

        audio_data.append(sample)

    # Write WAV file
    with wave.open(filename, 'w') as wav_file:
        wav_file.setnchannels(1)  # Mono
        wav_file.setsampwidth(2)  # 16-bit
        wav_file.setframerate(sample_rate)

        for sample in audio_data:
            # Convert to 16-bit signed integer
            sample_int = int(sample * 32767)
            sample_int = max(-32768, min(32767, sample_int))  # Clamp to range
            wav_file.writeframes(struct.pack('<h', sample_int))

    print(f"  ✓ {filename}")
    print(f"    Duration: {duration}s | Base frequency: {base_freq}Hz")
    print(f"    Description: {text_description}")
    return filename

# Create voice placeholder files
print("🎤 Creating placeholder voice files (use ElevenLabs for production)...")
print()

create_voice_placeholder(
    'ziggy-voice/line-1-1-wait-what.wav',
    2.0,
    200,
    "Wait, what? What'd she say? (anxious, quick)"
)

create_voice_placeholder(
    'ziggy-voice/line-1-2-sensory.wav',
    2.5,
    220,
    "Hum... click... tap... everyone's watching... (fragmented)"
)

create_voice_placeholder(
    'ziggy-voice/line-3-1-this-is-me.wav',
    2.2,
    240,
    "This is... me. This is who I am. (warm realization)"
)

create_voice_placeholder(
    'ziggy-voice/line-3-2-never-broken.wav',
    2.5,
    260,
    "I was never broken. I was just waiting to SURGE. (confident)"
)

print()
print("✅ Placeholder voice files created")
print()
print("📝 NOTE: These are sine wave placeholders for testing only.")
print("   For production, generate real TTS via ElevenLabs:")
print("   → export ELEVENLABS_API_KEY=sk-...")
print("   → bash generate-voice.sh")
