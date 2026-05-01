"""Synthesize voiceover for each scene in a campaign JSON via ElevenLabs.

Usage:
    python pipeline/generate_voice.py video/campaigns/active.json

Writes mp3s to video/public/voiceover/scene-{i}.mp3 so the Remotion
Composition can pick them up via staticFile().

Requires:
    pip install elevenlabs
    export ELEVENLABS_API_KEY=...
    export ELEVENLABS_VOICE_ID=...   # optional, defaults to Rachel
"""

from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path

DEFAULT_VOICE_ID = "21m00Tcm4TlvDq8ikWAM"  # Rachel
DEFAULT_MODEL = "eleven_multilingual_v2"


def synthesize(text: str, voice_id: str, model_id: str) -> bytes:
    try:
        from elevenlabs.client import ElevenLabs
    except ImportError:
        sys.exit("Install dependencies: pip install -r pipeline/requirements.txt")

    client = ElevenLabs(api_key=os.environ["ELEVENLABS_API_KEY"])
    audio = client.text_to_speech.convert(
        voice_id=voice_id,
        model_id=model_id,
        text=text,
        output_format="mp3_44100_128",
    )
    return b"".join(audio)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("campaign", help="Path to campaign JSON")
    parser.add_argument("--out-dir", default="video/public/voiceover")
    parser.add_argument("--voice-id", default=os.environ.get("ELEVENLABS_VOICE_ID", DEFAULT_VOICE_ID))
    parser.add_argument("--model", default=DEFAULT_MODEL)
    args = parser.parse_args()

    if not os.environ.get("ELEVENLABS_API_KEY"):
        sys.exit("ELEVENLABS_API_KEY is not set")

    campaign = json.loads(Path(args.campaign).read_text())
    out_dir = Path(args.out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    available: list[int] = []
    for i, scene in enumerate(campaign["scenes"]):
        text = scene.get("voiceover")
        if not text:
            print(f"scene {i}: no voiceover, skipping")
            continue
        path = out_dir / f"scene-{i}.mp3"
        print(f"scene {i}: synthesizing {len(text)} chars -> {path}")
        path.write_bytes(synthesize(text, args.voice_id, args.model))
        available.append(i)

    manifest = Path("video/campaigns/voiceover-manifest.json")
    manifest.parent.mkdir(parents=True, exist_ok=True)
    manifest.write_text(json.dumps({"available": available}, indent=2) + "\n")
    print(f"wrote {manifest} ({len(available)} voiceovers)")


if __name__ == "__main__":
    main()
