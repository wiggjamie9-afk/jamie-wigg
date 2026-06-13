#!/usr/bin/env python3
"""
Generate 5 Sunny concept art images using free APIs (no payment required).
Falls back through multiple free services if any fail.
"""

import os
import sys
import time
import requests
import io
from pathlib import Path
from PIL import Image

OUTPUT_DIR = Path("SUNNY-CONCEPT-ART")
OUTPUT_DIR.mkdir(exist_ok=True)

SUNNY = (
    "Sunny the quokka: extremely chubby and round like a teddy bear, "
    "warm golden-brown fur with realistic detailed painted texture, "
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
    "Cozy, safe, calm bedtime mood. Masterful storybook illustration."
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
    {
        "name": "concept-4-running-joy",
        "prompt": f"{SUNNY} Running joyfully through Australian wildflowers, mid-leap with pure joy, "
                  f"soft golden light, gum trees in background, very happy expression. {STYLE}",
    },
    {
        "name": "concept-5-watching-stars",
        "prompt": f"{SUNNY} Lying on back in grass, watching stars, peaceful contentment, "
                  f"one paw reaching toward the sky, full starry night above. {STYLE}",
    },
]

def try_craiyon(prompt):
    """Free tier Craiyon/DALL-E mini (no auth, up to 9 images/day free)"""
    print(f"    Trying Craiyon (DALL-E mini)...", end=" ", flush=True)
    try:
        url = "https://api.craiyon.com/v3/generate"
        resp = requests.post(url, json={"prompt": prompt}, timeout=120)
        if resp.status_code == 200:
            data = resp.json()
            if "images" in data and len(data["images"]) > 0:
                img_b64 = data["images"][0]
                img_bytes = __import__('base64').b64decode(img_b64)
                return Image.open(io.BytesIO(img_bytes))
    except Exception as e:
        print(f"failed ({e})")
    return None

def try_huggingface_spaces(prompt):
    """Hugging Face Space inference (free, sometimes slow)"""
    print(f"    Trying Hugging Face Spaces...", end=" ", flush=True)
    try:
        # Try a free HF Space that runs Stable Diffusion
        hf_api = "https://huggingface.co/api/spaces/DGSpitzer/Prompt-travel-Turbo/run"
        # Alternative: direct model access via HF inference
        from huggingface_hub import InferenceClient
        try:
            client = InferenceClient()
            image = client.text_to_image(prompt)
            print("✓")
            return image
        except:
            pass
    except Exception as e:
        print(f"failed ({e})")
    return None

def try_pollinations_silent(prompt):
    """Pollinations with NO retries (fast fail if blocked)"""
    print(f"    Trying Pollinations (quick check)...", end=" ", flush=True)
    try:
        import urllib.parse
        encoded = urllib.parse.quote(prompt)
        url = f"https://image.pollinations.ai/prompt/{encoded}?model=flux&width=1024&height=768&nologo=true&seed={hash(prompt) % 99999}"
        resp = requests.get(url, timeout=30)
        if resp.status_code == 200:
            print("✓")
            return Image.open(io.BytesIO(resp.content))
        else:
            print(f"blocked ({resp.status_code})")
    except Exception as e:
        print(f"failed ({e})")
    return None

def generate(prompt, concept_name):
    """Try generators in order of speed/reliability"""
    print(f"  {concept_name}:")

    # Try each API in order
    for gen_func in [try_pollinations_silent, try_craiyon, try_huggingface_spaces]:
        img = gen_func(prompt)
        if img:
            return img

    return None

def main():
    print("=" * 70)
    print("Sunny Concept Art Generator (Free APIs)")
    print("=" * 70)
    print()

    successful = []
    failed = []

    for i, concept in enumerate(CONCEPTS):
        if i > 0:
            time.sleep(2)

        print(f"Concept {i+1}/5: {concept['name']}")
        try:
            image = generate(concept["prompt"], concept["name"])
            if image:
                out = OUTPUT_DIR / f"{concept['name']}.png"
                image.save(out)
                print(f"  ✓ Saved: {out.name}")
                successful.append(concept["name"])
            else:
                print(f"  ✗ All generators failed for this concept")
                failed.append(concept["name"])
        except Exception as e:
            print(f"  ✗ ERROR: {e}")
            failed.append(concept["name"])
        print()

    print("=" * 70)
    print(f"Complete: {len(successful)}/5 concepts generated")
    print("=" * 70)

    if successful:
        print(f"\n✓ Generated:\n" + "\n".join(f"  - {s}" for s in successful))
    if failed:
        print(f"\n✗ Failed:\n" + "\n".join(f"  - {f}" for f in failed))

    return 0 if not failed else 1

if __name__ == "__main__":
    sys.exit(main())
