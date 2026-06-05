#!/usr/bin/env python3
"""
SURGE Pilot Sound Design Generator
Creates ambient layers, SFX, and music underscore for all 12:47 runtime
"""

import wave
import struct
import math
import os

class SoundDesigner:
    def __init__(self, sample_rate=44100):
        self.sample_rate = sample_rate
        self.audio_tracks = {}

    def sine_wave(self, freq, duration, amplitude=0.2):
        """Generate sine wave."""
        num_samples = int(self.sample_rate * duration)
        data = []
        for i in range(num_samples):
            t = i / self.sample_rate
            sample = amplitude * math.sin(2 * math.pi * freq * t)
            data.append(sample)
        return data

    def square_wave(self, freq, duration, amplitude=0.2):
        """Generate square wave."""
        num_samples = int(self.sample_rate * duration)
        data = []
        for i in range(num_samples):
            t = i / self.sample_rate
            sample = amplitude * (1 if math.sin(2 * math.pi * freq * t) >= 0 else -1)
            data.append(sample)
        return data

    def noise(self, duration, amplitude=0.1):
        """Generate white noise."""
        import random
        num_samples = int(self.sample_rate * duration)
        return [amplitude * random.uniform(-1, 1) for _ in range(num_samples)]

    def apply_envelope(self, samples, attack=0.05, decay=0.05, sustain=0.8, release=0.05):
        """Apply ADSR envelope to samples."""
        duration = len(samples) / self.sample_rate
        attack_samples = int(self.sample_rate * attack)
        decay_samples = int(self.sample_rate * decay)
        release_samples = int(self.sample_rate * release)

        result = []
        for i, sample in enumerate(samples):
            if i < attack_samples:
                env = i / attack_samples
            elif i < attack_samples + decay_samples:
                env = 1 - ((i - attack_samples) / decay_samples) * (1 - sustain)
            elif i < len(samples) - release_samples:
                env = sustain
            else:
                env = sustain * (1 - (i - (len(samples) - release_samples)) / release_samples)

            result.append(sample * env)

        return result

    def mix_tracks(self, tracks, output_file, target_db=-16):
        """Mix multiple audio tracks and save to file."""
        max_length = max(len(track) for track in tracks)

        # Pad all tracks to same length
        padded = []
        for track in tracks:
            padded_track = track + [0] * (max_length - len(track))
            padded.append(padded_track)

        # Mix tracks
        mixed = []
        for i in range(max_length):
            sample = sum(track[i] for track in padded) / len(padded)
            mixed.append(sample)

        # Normalize
        max_sample = max(abs(s) for s in mixed)
        if max_sample > 0:
            mixed = [s / max_sample * 0.9 for s in mixed]

        # Write to WAV
        with wave.open(output_file, 'w') as wav_file:
            wav_file.setnchannels(1)
            wav_file.setsampwidth(2)
            wav_file.setframerate(self.sample_rate)

            for sample in mixed:
                sample_int = int(sample * 32767)
                sample_int = max(-32768, min(32767, sample_int))
                wav_file.writeframes(struct.pack('<h', sample_int))

        return output_file

    def create_act1_ambient(self):
        """Act 1: Classroom establishing (0:00-3:00) - anxiety escalation."""
        print("  [Act 1] Creating anxiety escalation ambient track...")

        # Fluorescent hum (50Hz fundamental + harmonics)
        hum = self.sine_wave(50, 3.0, amplitude=0.15)
        hum_2 = self.sine_wave(100, 3.0, amplitude=0.08)
        hum_3 = self.sine_wave(150, 3.0, amplitude=0.05)

        # Classroom murmur (broadband noise)
        murmur = self.noise(3.0, amplitude=0.08)

        # Mix
        track = []
        for i in range(len(hum)):
            sample = (hum[i] + hum_2[i] + hum_3[i] + murmur[i] * 0.3) / 3
            track.append(sample)

        # Envelope: build anxiety
        track_with_env = []
        for i, sample in enumerate(track):
            progress = i / len(track)
            intensity = 0.5 + progress * 0.5  # Grow from 50% to 100%
            track_with_env.append(sample * intensity)

        self.mix_tracks([track_with_env], 'sound-design/act-1-ambient.wav')
        print(f"    ✓ act-1-ambient.wav (3:00)")

    def create_act2_montage(self):
        """Act 2: Sensory escalation montage (3:00-5:30)."""
        print("  [Act 2] Creating sensory escalation montage...")

        # Fan click (repetitive mechanical sound)
        fan_freq = 120
        click_duration = 0.1
        click_spacing = 0.3

        fan_track = []
        for cycle in range(int(2.5 / click_spacing)):
            click = self.apply_envelope(self.square_wave(fan_freq, click_duration, 0.15), attack=0.01, release=0.05)
            silence = [0] * int(self.sample_rate * (click_spacing - click_duration))
            fan_track.extend(click + silence)

        # Hum (increasing)
        hum = self.sine_wave(50, 2.5, amplitude=0.2)

        # Pencil tap (staccato)
        tap_freq = 3000
        tap_track = []
        tap_spacing = 0.25
        for cycle in range(int(2.5 / tap_spacing)):
            tap = self.apply_envelope(self.sine_wave(tap_freq, 0.08, 0.1), attack=0.01, release=0.03)
            silence = [0] * int(self.sample_rate * (tap_spacing - 0.08))
            tap_track.extend(tap + silence)

        # Mix tracks
        tracks = []
        max_len = int(self.sample_rate * 2.5)

        hum_padded = hum + [0] * (max_len - len(hum))
        fan_padded = fan_track[:max_len] + [0] * (max_len - len(fan_track))
        tap_padded = tap_track[:max_len] + [0] * (max_len - len(tap_track))

        self.mix_tracks([hum_padded, fan_padded, tap_padded], 'sound-design/act-2-sensory.wav')
        print(f"    ✓ act-2-sensory.wav (2:30)")

    def create_act3_transformation(self):
        """Act 3: Transformation fantasy music underscore (4:00)."""
        print("  [Act 3] Creating transformation underscore...")

        # Building orchestral feel with layered sine waves (simulating strings)
        string_bass = self.sine_wave(100, 4.0, amplitude=0.1)
        string_mid = self.sine_wave(250, 4.0, amplitude=0.08)
        string_high = self.sine_wave(400, 4.0, amplitude=0.06)

        # Electric blue transformation chord (rising)
        blue_tone = []
        for i in range(int(self.sample_rate * 4.0)):
            t = i / self.sample_rate
            progress = t / 4.0
            freq = 440 + progress * 200  # Rising frequency
            sample = 0.15 * math.sin(2 * math.pi * freq * t)
            blue_tone.append(sample)

        # Mix
        mixed = []
        for i in range(len(string_bass)):
            sample = (string_bass[i] + string_mid[i] + string_high[i] + blue_tone[i]) / 4
            mixed.append(sample)

        self.mix_tracks([mixed], 'sound-design/act-3-transformation.wav')
        print(f"    ✓ act-3-transformation.wav (4:00)")

    def create_epilogue(self):
        """Epilogue: Hopeful music + series teaser (3:17)."""
        print("  [Epilogue] Creating ending underscore...")

        # Hopeful major chord progression (C-G-Am-F simulation)
        chord1 = self.sine_wave(262, 3.17, amplitude=0.15)  # C
        chord2 = self.sine_wave(330, 3.17, amplitude=0.12)  # E
        chord3 = self.sine_wave(392, 3.17, amplitude=0.10)  # G

        # Fade in at start, fade out at end
        result = []
        for i in range(len(chord1)):
            progress = i / len(chord1)
            # Fade in first 0.5s
            if progress < 0.15:
                fade = progress / 0.15
            # Fade out last 1s
            elif progress > 0.85:
                fade = (1 - progress) / 0.15
            else:
                fade = 1.0

            sample = (chord1[i] + chord2[i] + chord3[i]) / 3 * fade
            result.append(sample)

        self.mix_tracks([result], 'sound-design/epilogue-teaser.wav')
        print(f"    ✓ epilogue-teaser.wav (3:17)")

    def generate_all(self):
        """Generate all sound design layers."""
        os.makedirs('sound-design', exist_ok=True)

        print()
        print("🎵 Generating Sound Design Layers...")
        print()

        self.create_act1_ambient()
        self.create_act2_montage()
        self.create_act3_transformation()
        self.create_epilogue()

        print()
        print("✅ Sound design generation complete!")
        print()
        print("Output files:")
        import subprocess
        subprocess.run(['ls', '-lh', 'sound-design/'])


if __name__ == '__main__':
    designer = SoundDesigner()
    designer.generate_all()
