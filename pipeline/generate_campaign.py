"""Generate a campaign JSON from a topic using Claude.

Usage:
    python pipeline/generate_campaign.py "topic here" \
        --out video/campaigns/active.json \
        --duration 30

Requires:
    pip install anthropic
    export ANTHROPIC_API_KEY=...
"""

from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path

SYSTEM_PROMPT = """You are a director scripting a short explainer video.
You output a single JSON object matching this schema and nothing else.

Schema:
{
  "title": str,
  "fps": 30,
  "width": 1920,
  "height": 1080,
  "theme": {
    "primary": hex_color,
    "accent": hex_color,
    "text": hex_color,
    "background": hex_color
  },
  "scenes": [Scene, ...]
}

Scene is one of:
  {"type": "title", "title": str, "subtitle": str, "durationInSeconds": float, "voiceover": str}
  {"type": "bullets", "heading": str, "bullets": [str, ...max 4], "durationInSeconds": float, "voiceover": str}
  {"type": "outro", "title": str, "subtitle": str, "durationInSeconds": float, "voiceover": str}

Rules:
- Every scene MUST include a voiceover string that, when spoken, fits within durationInSeconds at a natural pace (~2.5 words/sec).
- Open with "title", close with "outro", 2-4 "bullets" scenes between.
- The total of all durationInSeconds MUST equal the requested target duration.
- Choose a coherent dark color theme.
- Output ONLY the JSON, no prose, no code fences.
"""

USER_TEMPLATE = """Topic: {topic}
Target total duration: {duration} seconds.
Generate the campaign JSON now."""


def generate(topic: str, duration: int, model: str) -> dict:
    try:
        from anthropic import Anthropic
    except ImportError:
        sys.exit("Install dependencies: pip install -r pipeline/requirements.txt")

    client = Anthropic()
    msg = client.messages.create(
        model=model,
        max_tokens=4096,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": USER_TEMPLATE.format(topic=topic, duration=duration)}],
    )
    text = "".join(block.text for block in msg.content if block.type == "text").strip()
    if text.startswith("```"):
        text = text.strip("`")
        if text.startswith("json"):
            text = text[4:]
        text = text.strip()
    return json.loads(text)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("topic", help="Topic for the video")
    parser.add_argument("--out", default="video/campaigns/active.json")
    parser.add_argument("--duration", type=int, default=20, help="Target seconds")
    parser.add_argument("--model", default="claude-opus-4-7")
    args = parser.parse_args()

    if not os.environ.get("ANTHROPIC_API_KEY"):
        sys.exit("ANTHROPIC_API_KEY is not set")

    campaign = generate(args.topic, args.duration, args.model)
    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(campaign, indent=2))
    total = sum(s["durationInSeconds"] for s in campaign["scenes"])
    print(f"wrote {out} ({len(campaign['scenes'])} scenes, {total:.1f}s)")


if __name__ == "__main__":
    main()
