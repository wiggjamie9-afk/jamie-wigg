#!/usr/bin/env python3
"""
Generate Sunny the Quokka concept art using Replicate FLUX 1.1 Pro.
Produces 3 concept images matching the reference illustrated style (THE BIBLE):
detailed warm children's book illustration, realistic fur, moonlit Australian bush.
"""

import os
import sys
import time
import io
import requests
from pathlib import Path
from PIL import Image

OUTPUT_DIR = Path("SUNNY-CONCEPT-ART")
OUTPUT_DIR.mkdir(exist_ok=True)

# THE BIBLE - locked character spec, identical everywhere
SUNNY = (
    "Sunny the quokka: extremely chubby and round like a teddy bear, "
    "warm golden-brown fur with realistic detailed painted texture (never dark or grey), "
    "large gentle warm brown eyes with kind peaceful expression, "
    "small round ears with cream-colored lining, "
    "natural soft smile showing gentle contentment."
)

STYLE = (
    "High-end professional children's book illustration, watercolor-painted quality "
    "with rich intricate detail. Realistic soft fur texture. Warm golden and moonlit "
    "lighting with gentle glow. Beautiful detailed background: Australian bush, gum trees, "
    "wildflowers, soft grass, stars and moon in deep navy sky. "
    "Palette: warm golds, soft purples, deep navy blues, cream, natural earth tones. "
    "Cozy, safe, calm bedtime mood. Masterful storybook illustration, like a classic "
    "hand-painted picture book by a top children's illustrator."
)

CONCEPTS = [
    {
        "name": "concept-1-sitting-moonlit-bush",
        "prompt": f"{SUNNY} Sitting peacefully on soft grass in moonlit Australian bush at twilight, "
                  f"looking up at the first stars, full body view. {STYLE}",
    },
    {
        "name": "concept-2-portrait-closeup",
        "prompt": f"{SUNNY} Close-up portrait, head and shoulders, gentle eyes looking softly at the viewer, "
                  f"wildflowers softly blurred around her, warm moonglow rim light on her fur. {STYLE}",
    },
    {
        "name": "concept-3-curled-asleep",
        "prompt": f"{SUNNY} Curled up asleep in soft grass beneath a big gum tree, eyes closed, "
                  f"tiny peaceful smile, moonlight and stars above, fireflies glowing gently. {STYLE}",
    },
]


def generate(prompt: str, token: str) -> Image.Image:
    headers = {"Authorization": f"Token {token}"}
    resp = requests.post(
        "https://api.replicate.com/v1/models/black-forest-labs/flux-1.1-pro/predictions",
        headers=headers,
        json={"input": {"prompt": prompt, "aspect_ratio": "16:9", "output_format": "png",
                        "output_quality": 100, "prompt_upsampling": True}},
        timeout=300,
    )
    if resp.status_code != 201:
        raise RuntimeError(f"Replicate error {resp.status_code}: {resp.text}")
    pred = resp.json()

    while pred["status"] not in ("succeeded", "failed", "canceled"):
        time.sleep(4)
        pred = requests.get(
            f"https://api.replicate.com/v1/predictions/{pred['id']}",
            headers=headers, timeout=30,
        ).json()

    if pred["status"] != "succeeded":
        raise RuntimeError(f"Generation failed: {pred.get('error')}")

    output = pred["output"]
    url = output[0] if isinstance(output, list) else output
    img = requests.get(url, timeout=60)
    return Image.open(io.BytesIO(img.content))


def main():
    token = os.getenv("REPLICATE_API_TOKEN")
    if not token:
        print("ERROR: REPLICATE_API_TOKEN not set")
        return 1

    failed = []
    for concept in CONCEPTS:
        print(f"Generating {concept['name']}...")
        try:
            image = generate(concept["prompt"], token)
            out = OUTPUT_DIR / f"{concept['name']}.png"
            image.save(out)
            print(f"  saved {out}")
        except Exception as e:
            print(f"  FAILED: {e}")
            failed.append(concept["name"])

    print(f"\nDone: {len(CONCEPTS) - len(failed)}/{len(CONCEPTS)} concepts generated")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
