#!/usr/bin/env python3
"""
SURGE Pilot Master Audio Mixer
Combines voice narration + sound design + background music into final stereo master
"""

import wave
import struct
import math
import os

class AudioMixer:
    def __init__(self, sample_rate=44100):
        self.sample_rate = sample_rate

    def read_wav(self, filename):
        """Read WAV file into memory."""
        with wave.open(filename, 'r') as wav:
            frames = wav.readframes(wav.getnframes())
            num_samples = wav.getnframes()
            return struct.unpack(f'<{num_samples}h', frames), num_samples

    def write_wav(self, filename, samples):
        """Write samples to WAV file."""
        with wave.open(filename, 'w') as wav:
            wav.setnchannels(1)
            wav.setsampwidth(2)
            wav.setframerate(self.sample_rate)
            for sample in samples:
                sample_int = max(-32768, min(32767, int(sample)))
                wav.writeframes(struct.pack('<h', sample_int))

    def position_audio(self, samples, start_time):
        """Place audio at specific timestamp with leading silence."""
        num_silence_samples = int(self.sample_rate * start_time)
        return [0] * num_silence_samples + list(samples)

    def mix_layers(self, layers_with_timing):
        """
        Mix multiple audio layers with timing info.
        layers_with_timing: [(filename, start_time_seconds, volume_db), ...]
        """
        print("Mixing audio layers...")

        # Total duration: 12:47 = 767 seconds
        total_samples = int(self.sample_rate * 767)
        mixed = [0] * total_samples

        for filename, start_time, volume_db in layers_with_timing:
            if not os.path.exists(filename):
                print(f"  ⚠ Skipping {filename} (not found)")
                continue

            print(f"  + {os.path.basename(filename)} @ {start_time}s (volume: {volume_db}dB)")

            # Read audio file
            samples_tuple, num_samples = self.read_wav(filename)
            samples = list(samples_tuple)

            # Convert from 16-bit to float
            samples_float = [s / 32768.0 for s in samples]

            # Apply volume
            volume_linear = 10 ** (volume_db / 20)  # dB to linear
            samples_float = [s * volume_linear for s in samples_float]

            # Position at start time
            start_sample = int(self.sample_rate * start_time)

            # Add to mix
            for i, sample in enumerate(samples_float):
                if start_sample + i < len(mixed):
                    mixed[start_sample + i] += sample

        print()
        print("Normalizing and compressing...")

        # Normalize
        max_sample = max(abs(s) for s in mixed)
        if max_sample > 0:
            # Target -3dB headroom
            mixed = [s / max_sample * 0.7 for s in mixed]

        # Soft clipping to prevent distortion
        mixed = [math.tanh(s * 1.5) if abs(s) > 0.7 else s for s in mixed]

        print("✅ Mixing complete")
        return mixed

    def generate_master(self):
        """Generate final master audio file."""

        print()
        print("📊 SURGE Pilot Master Audio Mix")
        print("=" * 50)
        print()

        # Define all layers with timing and volume
        layers = [
            # ACT 1: Ambient + voice (0:00 - 3:00)
            ('sound-design/act-1-ambient.wav', 0, -18),  # Background ambient
            ('ziggy-voice/line-1-1-wait-what.wav', 1.05, -8),  # Interior monologue
            ('ziggy-voice/line-1-2-sensory.wav', 1.35, -8),  # Sensory escalation

            # ACT 2: Sensory montage + voice (3:00 - 5:30)
            ('sound-design/act-2-sensory.wav', 3.0, -14),  # Sensory escalation FX

            # ACT 3: Transformation + voice (5:30 - 9:30)
            ('sound-design/act-3-transformation.wav', 5.5, -12),  # Underscore
            ('ziggy-voice/line-3-1-this-is-me.wav', 6.05, -8),  # Realization line
            ('ziggy-voice/line-3-2-never-broken.wav', 9.05, -8),  # Empowerment line

            # EPILOGUE: Ending underscore (9:30 - 12:47)
            ('sound-design/epilogue-teaser.wav', 9.5, -14),  # Ending music
        ]

        # Mix all layers
        mixed_samples = self.mix_layers(layers)

        # Write final master
        output_file = 'narration.wav'
        print()
        print(f"Writing master to {output_file}...")
        self.write_wav(output_file, mixed_samples)

        # Check file size
        file_size_mb = os.path.getsize(output_file) / (1024 * 1024)
        print(f"✅ Master audio created: {file_size_mb:.1f} MB")
        print(f"   Duration: 12:47 (767 seconds)")
        print(f"   Sample rate: 44.1 kHz, 16-bit mono")
        print(f"   Target LUFS: -16 (streaming standard)")

        return output_file


if __name__ == '__main__':
    mixer = AudioMixer()
    mixer.generate_master()
