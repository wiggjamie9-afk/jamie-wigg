#!/usr/bin/env python3
"""
AI Video Sound Generator — CLI

Takes a silent video, asks Gemini to describe sounds for it, generates audio
with ElevenLabs, and (optionally) muxes the audio back onto the video with
ffmpeg.

Usage:
  export GEMINI_API_KEY=...
  export ELEVENLABS_API_KEY=...
  python generate_sound.py path/to/video.mp4
  python generate_sound.py video.mp4 --prompt "rain on tin roof" --no-describe
  python generate_sound.py video.mp4 --frames 5 --duration 10 --output out.mp4
"""

from __future__ import annotations

import argparse
import base64
import json
import os
import shutil
import subprocess
import sys
import tempfile
import urllib.error
import urllib.request
from pathlib import Path


GEMINI_MODEL = "gemini-2.5-flash"
ELEVEN_URL = "https://api.elevenlabs.io/v1/sound-generation"
GEMINI_URL = (
    "https://generativelanguage.googleapis.com/v1beta/models/"
    f"{GEMINI_MODEL}:generateContent"
)


def die(msg: str, code: int = 1) -> None:
    print(f"error: {msg}", file=sys.stderr)
    sys.exit(code)


def need_ffmpeg() -> str:
    path = shutil.which("ffmpeg")
    if not path:
        die("ffmpeg not found on PATH. Install it: https://ffmpeg.org/download.html")
    return path


def probe_duration(video: Path) -> float:
    ffprobe = shutil.which("ffprobe")
    if not ffprobe:
        die("ffprobe not found on PATH (ships with ffmpeg).")
    out = subprocess.check_output(
        [
            ffprobe,
            "-v", "error",
            "-show_entries", "format=duration",
            "-of", "default=noprint_wrappers=1:nokey=1",
            str(video),
        ],
        text=True,
    ).strip()
    return float(out)


def extract_frames(video: Path, count: int, workdir: Path) -> list[Path]:
    duration = probe_duration(video)
    frame_paths: list[Path] = []
    for i in range(count):
        t = ((i + 0.5) / count) * duration
        out = workdir / f"frame_{i:02d}.jpg"
        subprocess.run(
            [
                "ffmpeg", "-y",
                "-ss", f"{t:.3f}",
                "-i", str(video),
                "-vframes", "1",
                "-vf", "scale='min(768,iw)':-2",
                "-q:v", "3",
                str(out),
            ],
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        frame_paths.append(out)
    return frame_paths


def describe_with_gemini(frames: list[Path], api_key: str) -> str:
    parts: list[dict] = [
        {
            "text": (
                "You are designing sound effects for a short silent video. "
                "Look at these sequential frames and write ONE concise sound "
                "effects prompt (one sentence, under 30 words) describing the "
                "audio that should accompany the scene. Focus on concrete "
                "sounds — ambience, foley, mechanical or natural noises. Do "
                "NOT include music, speech, or narration. Output the prompt "
                "only, no preamble."
            )
        }
    ]
    for f in frames:
        b64 = base64.b64encode(f.read_bytes()).decode("ascii")
        parts.append({"inline_data": {"mime_type": "image/jpeg", "data": b64}})

    body = json.dumps({"contents": [{"parts": parts}]}).encode("utf-8")
    url = f"{GEMINI_URL}?key={api_key}"
    req = urllib.request.Request(
        url, data=body, headers={"Content-Type": "application/json"}, method="POST"
    )
    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            data = json.loads(resp.read())
    except urllib.error.HTTPError as e:
        die(f"Gemini error {e.code}: {e.read().decode('utf-8', 'replace')[:400]}")

    try:
        text_parts = data["candidates"][0]["content"]["parts"]
        text = " ".join(p.get("text", "") for p in text_parts).strip()
    except (KeyError, IndexError):
        die(f"Unexpected Gemini response: {json.dumps(data)[:400]}")
    if not text:
        die("Gemini returned an empty description.")
    return text


def generate_sound(prompt: str, duration: float | None, api_key: str, out: Path) -> None:
    body: dict = {"text": prompt}
    if duration is not None:
        body["duration_seconds"] = max(0.5, min(22.0, duration))
    req = urllib.request.Request(
        ELEVEN_URL,
        data=json.dumps(body).encode("utf-8"),
        headers={
            "xi-api-key": api_key,
            "Content-Type": "application/json",
            "Accept": "audio/mpeg",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=180) as resp:
            out.write_bytes(resp.read())
    except urllib.error.HTTPError as e:
        die(f"ElevenLabs error {e.code}: {e.read().decode('utf-8', 'replace')[:400]}")


def mux(video: Path, audio: Path, out: Path) -> None:
    subprocess.run(
        [
            "ffmpeg", "-y",
            "-i", str(video),
            "-i", str(audio),
            "-c:v", "copy",
            "-c:a", "aac",
            "-shortest",
            "-map", "0:v:0",
            "-map", "1:a:0",
            str(out),
        ],
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )


def main() -> None:
    ap = argparse.ArgumentParser(
        description="Generate AI sound for a silent video using Gemini + ElevenLabs."
    )
    ap.add_argument("video", type=Path, help="Path to the silent video file")
    ap.add_argument("-o", "--output", type=Path, help="Output video path (default: <video>_with_sound.mp4)")
    ap.add_argument("--audio-out", type=Path, help="Also save the raw audio to this path")
    ap.add_argument("-p", "--prompt", help="Sound description (skips Gemini if given)")
    ap.add_argument("--frames", type=int, default=5, help="Frames to send to Gemini (default 5)")
    ap.add_argument("--duration", type=float, help="Audio duration in seconds (default: video length, max 22)")
    ap.add_argument("--no-mux", action="store_true", help="Skip merging audio into the video")
    ap.add_argument("--gemini-key", default=os.getenv("GEMINI_API_KEY"), help="Gemini API key (or env GEMINI_API_KEY)")
    ap.add_argument("--eleven-key", default=os.getenv("ELEVENLABS_API_KEY"), help="ElevenLabs API key (or env ELEVENLABS_API_KEY)")
    args = ap.parse_args()

    if not args.video.exists():
        die(f"video not found: {args.video}")
    if not args.eleven_key:
        die("ElevenLabs API key required (--eleven-key or ELEVENLABS_API_KEY).")
    if not args.prompt and not args.gemini_key:
        die("Provide --prompt, or set --gemini-key / GEMINI_API_KEY for auto description.")

    need_ffmpeg()

    out_video = args.output or args.video.with_name(args.video.stem + "_with_sound.mp4")

    with tempfile.TemporaryDirectory() as tmp:
        tmp_path = Path(tmp)
        prompt = args.prompt
        if not prompt:
            print(f"[1/3] extracting {args.frames} frames…", file=sys.stderr)
            frames = extract_frames(args.video, args.frames, tmp_path)
            print("[2/3] asking Gemini for a sound description…", file=sys.stderr)
            prompt = describe_with_gemini(frames, args.gemini_key)
            print(f"      → {prompt}", file=sys.stderr)
        else:
            print(f"[1/3] using provided prompt: {prompt}", file=sys.stderr)

        duration = args.duration
        if duration is None:
            try:
                duration = min(22.0, max(1.0, probe_duration(args.video)))
            except Exception:
                duration = None

        print(f"[3/3] generating sound ({duration or 'auto'}s)…", file=sys.stderr)
        audio_path = tmp_path / "sound.mp3"
        generate_sound(prompt, duration, args.eleven_key, audio_path)

        if args.audio_out:
            args.audio_out.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(audio_path, args.audio_out)
            print(f"      audio → {args.audio_out}", file=sys.stderr)

        if args.no_mux:
            if not args.audio_out:
                fallback = args.video.with_name(args.video.stem + "_sound.mp3")
                shutil.copyfile(audio_path, fallback)
                print(f"audio saved → {fallback}")
        else:
            print(f"      muxing → {out_video}", file=sys.stderr)
            mux(args.video, audio_path, out_video)
            print(f"done → {out_video}")


if __name__ == "__main__":
    main()
