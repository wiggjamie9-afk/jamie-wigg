#!/usr/bin/env python3
"""
Auto-generate captions/subtitles from video using OpenAI Whisper
Outputs SRT (SubRip) format for YouTube, TikTok, etc.
"""

import argparse
import subprocess
import sys
from pathlib import Path

def check_whisper_installed():
    """Check if whisper is installed, install if not"""
    try:
        import whisper
        return True
    except ImportError:
        print("Installing openai-whisper...")
        subprocess.run([sys.executable, "-m", "pip", "install", "openai-whisper", "-q"])
        return True

def generate_captions(
    video_path: str,
    language: str = "en",
    model: str = "base",
    output_format: str = "srt",
    translate: bool = False,
    use_vad: bool = False,
):
    """
    Generate captions from video

    Args:
        video_path: Path to video file
        language: Language code (en, zh, ja, etc.)
        model: Whisper model (tiny, base, small, medium, large)
        output_format: srt, vtt, txt, json, tsv
        translate: Translate to English
        use_vad: Use VAD filter (reduces repetition, slower)
    """

    check_whisper_installed()
    import whisper

    video_path = Path(video_path)
    if not video_path.exists():
        print(f"❌ File not found: {video_path}")
        return None

    print(f"📹 Processing: {video_path.name}")
    print(f"🎯 Model: {model} | Language: {language} | Format: {output_format}")

    try:
        # Load model and transcribe
        model_obj = whisper.load_model(model)

        options = {
            "language": language,
            "verbose": True,
        }

        if translate:
            options["task"] = "translate"

        result = model_obj.transcribe(str(video_path), **options)

        # Generate output filename
        output_name = video_path.stem + f".{output_format}"

        # Write to file based on format
        if output_format == "srt":
            _write_srt(result, output_name)
        elif output_format == "vtt":
            _write_vtt(result, output_name)
        elif output_format == "json":
            import json
            with open(output_name, "w") as f:
                json.dump(result, f, indent=2)
        else:
            # txt format (simple)
            with open(output_name, "w") as f:
                f.write(result["text"])

        print(f"✅ Captions saved: {output_name}")
        return output_name

    except Exception as e:
        print(f"❌ Error: {e}")
        return None

def _write_srt(result, output_file):
    """Write transcription to SRT format"""
    with open(output_file, "w", encoding="utf-8") as f:
        for i, segment in enumerate(result["segments"], 1):
            start = _seconds_to_srt_time(segment["start"])
            end = _seconds_to_srt_time(segment["end"])
            text = segment["text"].strip()

            f.write(f"{i}\n{start} --> {end}\n{text}\n\n")

def _write_vtt(result, output_file):
    """Write transcription to VTT format (WebVTT)"""
    with open(output_file, "w", encoding="utf-8") as f:
        f.write("WEBVTT\n\n")
        for segment in result["segments"]:
            start = _seconds_to_srt_time(segment["start"])
            end = _seconds_to_srt_time(segment["end"])
            text = segment["text"].strip()

            f.write(f"{start} --> {end}\n{text}\n\n")

def _seconds_to_srt_time(seconds):
    """Convert seconds to SRT time format (HH:MM:SS,mmm)"""
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    millis = int((seconds % 1) * 1000)

    return f"{hours:02d}:{minutes:02d}:{secs:02d},{millis:03d}"

def burn_subtitles(video_path: str, subtitle_path: str, output_path: str):
    """Burn subtitles into video using FFmpeg"""
    try:
        cmd = [
            "ffmpeg",
            "-i", video_path,
            "-vf", f"subtitles={subtitle_path}",
            "-c:a", "aac",
            "-c:v", "libx264",
            "-preset", "fast",
            output_path,
        ]

        print(f"🔥 Burning subtitles into video...")
        subprocess.run(cmd, check=True)
        print(f"✅ Video with subtitles: {output_path}")

    except subprocess.CalledProcessError:
        print("❌ FFmpeg error. Make sure FFmpeg is installed.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate captions from video")
    parser.add_argument("video", help="Video file path")
    parser.add_argument("--language", default="en", help="Language (en, zh, ja, etc.)")
    parser.add_argument("--model", default="base", help="Whisper model (tiny, base, small, medium, large)")
    parser.add_argument("--format", default="srt", help="Output format (srt, vtt, json, txt)")
    parser.add_argument("--translate", action="store_true", help="Translate to English")
    parser.add_argument("--vad", action="store_true", help="Use VAD filter (reduces repeats)")
    parser.add_argument("--burn", help="Burn subtitles into video (output path)")

    args = parser.parse_args()

    # Generate captions
    subtitle_file = generate_captions(
        args.video,
        language=args.language,
        model=args.model,
        output_format=args.format,
        translate=args.translate,
        use_vad=args.vad,
    )

    # Optionally burn into video
    if subtitle_file and args.burn:
        burn_subtitles(args.video, subtitle_file, args.burn)
