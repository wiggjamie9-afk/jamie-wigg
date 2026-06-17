#!/usr/bin/env python3
"""
Fast video assembly: scenes + generative music (no TTS dependencies).
Target: <5 minutes to complete MP4.
"""

import sys
from pathlib import Path
import json
import subprocess

try:
    import imageio.v2 as imageio
    import numpy as np
    from scipy.io import wavfile
except ImportError:
    print("Installing dependencies...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "-q", "imageio", "imageio-ffmpeg", "numpy", "scipy"])
    import imageio.v2 as imageio
    import numpy as np
    from scipy.io import wavfile

OUTPUT_DIR = Path(__file__).parent / "sonny_episode_output"
EPISODES_DIR = Path(__file__).parent / "episodes"
EPISODES_DIR.mkdir(exist_ok=True)

METADATA_FILE = OUTPUT_DIR / "episode_metadata.json"

def generate_lullaby_audio(duration_sec: int) -> tuple:
    """Generate a calm lullaby using sine waves."""
    sr = 44100
    samples = sr * duration_sec
    t = np.linspace(0, duration_sec, samples)

    # Bass foundation: C3 → G3 → C3 progression
    bass_freqs = np.array([130.81, 196.00, 130.81, 196.00])
    bass_t = np.tile(np.linspace(0, 1, sr * 4), int(duration_sec / 4) + 1)[:samples]
    bass_t_indices = (bass_t * (len(bass_freqs) - 1)).astype(int)
    bass_freqs_t = bass_freqs[np.minimum(bass_t_indices, len(bass_freqs) - 1)]
    bass = 0.2 * np.sin(2 * np.pi * bass_freqs_t * t)

    # Melody: pentatonic (C, E, G, A, C)
    melody_freqs = [261.63, 329.63, 392.00, 440.00, 523.25]
    melody = np.zeros_like(t)
    for i in range(len(melody_freqs)):
        start = int(i * sr * 8)
        end = min(start + sr * 8, len(t))
        if start < len(t):
            freq = melody_freqs[i]
            envelope = np.sin(np.pi * np.linspace(0, 1, end - start)) ** 2
            melody[start:end] += 0.1 * envelope * np.sin(2 * np.pi * freq * np.linspace(0, 8, end - start))

    # Ambient shimmer
    shimmer = np.zeros_like(t)
    shimmer_freq = 880.00  # A5
    shimmer_env = np.sin(2 * np.pi * 0.2 * t) ** 2  # Slow modulation
    shimmer = 0.08 * shimmer_env * np.sin(2 * np.pi * shimmer_freq * t)

    # Fade
    fade_in = np.linspace(0, 1, int(sr * 2))
    fade_out = np.linspace(1, 0, int(sr * 2))
    fade = np.ones_like(t)
    fade[:len(fade_in)] *= fade_in
    fade[-len(fade_out):] *= fade_out

    # Combine
    audio = (bass + melody + shimmer) * fade
    audio = audio / (np.max(np.abs(audio)) + 1e-6) * 0.4

    return audio.astype(np.float32), sr

def main():
    print("\n🎬 FAST VIDEO ASSEMBLY")
    print("=" * 70)

    with open(METADATA_FILE) as f:
        metadata = json.load(f)

    scenes = metadata["scenes"]
    total_duration = metadata["total_duration_seconds"]

    print(f"\n📊 {metadata['title']}")
    print(f"   Duration: {total_duration}s")
    print(f"   Scenes: {len(scenes)}\n")

    # [1] Load scenes
    print("[1/3] Loading scene images...")
    frames = []
    for scene in scenes:
        img_file = OUTPUT_DIR / scene["image_file"]
        img = imageio.imread(img_file)
        fps = 24
        num_frames = int(scene["duration"] * fps)
        for _ in range(num_frames):
            frames.append(img)
        print(f"  ✓ Scene {scene['id']}: {scene['title']}")

    # [2] Generate audio
    print("\n[2/3] Generating lullaby soundtrack...")
    audio, sr = generate_lullaby_audio(total_duration + 5)
    audio_file = EPISODES_DIR / "temp_lullaby.wav"
    wavfile.write(audio_file, sr, (audio * 32767).astype(np.int16))
    print(f"  ✓ Audio: {total_duration + 5}s lullaby")

    # [3] Write video
    print("\n[3/3] Writing MP4 (with audio)...")
    video_path = EPISODES_DIR / "sonny_magical_adventure.mp4"

    try:
        writer = imageio.get_writer(
            str(video_path),
            fps=24,
            codec='libx264',
            quality=7,
            pixelformat='yuv420p'
        )
        for frame in frames:
            writer.append_data(frame)
        writer.close()
        print(f"  ✓ Video: {video_path}")

        # Merge audio with ffmpeg if available
        try:
            import shutil
            if shutil.which("ffmpeg"):
                output_final = EPISODES_DIR / "sonny_magical_adventure_final.mp4"
                cmd = [
                    "ffmpeg", "-y", "-loglevel", "error",
                    "-i", str(video_path),
                    "-i", str(audio_file),
                    "-c:v", "copy", "-c:a", "aac",
                    "-shortest",
                    str(output_final)
                ]
                subprocess.run(cmd, check=True, timeout=60)
                video_path.unlink()
                audio_file.unlink()
                final_path = output_final
            else:
                audio_file.unlink()
                final_path = video_path
        except:
            audio_file.unlink()
            final_path = video_path

        size_mb = final_path.stat().st_size / (1024 * 1024)
        print(f"\n✅ DONE! Your 1-minute cartoon:")
        print(f"   📹 {final_path}")
        print(f"   Size: {size_mb:.1f}MB")
        print(f"   Ready to upload!\n")
        return True

    except Exception as e:
        print(f"  ✗ Failed: {e}")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
