#!/usr/bin/env python3
"""
Generate all 16 Book 1 story pages using Concept 2 (Sunny portrait) as locked visual reference.
Image-conditioned generation ensures Sunny is identical across all pages.
"""

import os
import sys
import time
import io
import requests
import base64
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

OUTPUT_DIR = Path("BOOK-1-ILLUSTRATED-PAGES")
OUTPUT_DIR.mkdir(exist_ok=True)

REFERENCE_IMAGE = Path("SUNNY-CONCEPT-ART/concept-2-portrait-closeup.png")

# Story pages - same as before
PAGES = [
    {
        "number": 2,
        "text": ["The sky was the colour of ripe plums when Sunny first saw them.", "One. Then three. Then many."],
        "illustration_prompt": "Sunny the quokka sitting peacefully in Australian bush as the sky turns plum colors. First flying fox silhouettes appearing above, watching moment. Warm golds, soft purples, stars emerging. Detailed watercolor illustration."
    },
    {
        "number": 3,
        "text": ["Flying foxes, sailing out from their roost in the old fig tree.", "Their wings were wide and dark, moving through the air without a sound."],
        "illustration_prompt": "Flying foxes with wide spread wings gliding from an old fig tree. Multiple foxes at different heights. Dark graceful shapes against plum-colored sky. Show the beauty and silence of their movement. Watercolor soft edges, peaceful mood."
    },
    {
        "number": 4,
        "text": ["No flap, no flutter, just a long, smooth, swooping glide.", "Sunny stood very still and watched."],
        "illustration_prompt": "Sunny standing motionless in grass, looking up in wonder. Flying foxes gracefully gliding in smooth arcs above. Her peaceful, focused expression. Hand-painted watercolor with soft brushstrokes. Palette: soft purples, warm golds."
    },
    {
        "number": 5,
        "text": ["They were so large and so quiet.", "She had not known something so big could move so softly."],
        "illustration_prompt": "Large flying foxes (closer view) gliding above Sunny. Their size apparent, but movement appears gentle and ethereal. Sunny small below, expressing wonder. Soft shadows and light. Watercolor with visible brushstrokes."
    },
    {
        "number": 6,
        "text": ["One flew low, close enough that Sunny could see", "the warm dark fur of its body and its little fox-like face."],
        "illustration_prompt": "Flying fox swooping low near Sunny. Close enough to see detail. Sunny's chubby round face shows gentle wonder and awe. Intimate, magical moment. Watercolor illustration, detailed fur texture."
    },
    {
        "number": 7,
        "text": ["Neat ears, bright eyes, a pointed nose.", "It swooped toward a flowering tree and hovered for just a moment."],
        "illustration_prompt": "Flying fox hovering gracefully near flowering branches. Flowers glow gently in twilight. Sunny visible below watching peacefully. Tender, intimate moment. Watercolor, professional storybook quality."
    },
    {
        "number": 8,
        "text": ["Drinking from a blossom.", "Then it was gone again, back into the darkening sky."],
        "illustration_prompt": "Flying fox hovering over blossoms, drawing nectar from flowers. Sky darkening (deeper purples and early blues). Sunny peaceful below. Watercolor illustration with soft detail."
    },
    {
        "number": 9,
        "text": ["The others followed their own paths —", "long curved arcs through the air, each one different."],
        "illustration_prompt": "Multiple flying foxes (3-5) tracing graceful curved paths across sky. Each arc unique and beautiful. Sunny watching below. Sky deeper purple. Watercolor with flowing brushstrokes."
    },
    {
        "number": 10,
        "text": ["Each one beautiful.", "Sunny watched until the sky turned from plum to deep navy."],
        "illustration_prompt": "Sunny watching as multiple flying foxes glide in beautiful arcs. Sky actively transitioning to deep navy. First stars appearing. Sunny's peaceful expression. Watercolor illustration, professional quality."
    },
    {
        "number": 11,
        "text": ["The stars came out, and still the flying foxes moved above her.", "Silent and grand."],
        "illustration_prompt": "Deep navy starry sky full of twinkling stars. Flying foxes visible as graceful dark shapes gliding against the stars. Sunny as peaceful focus below. Watercolor with starlight glow."
    },
    {
        "number": 12,
        "text": ["She sat down in the soft grass and looked up.", "The bush was full of quiet."],
        "illustration_prompt": "Sunny sitting peacefully in soft grass, looking upward in calm observation. Chubby golden-brown quokka with gentle expression. Starry navy sky above. Flying foxes moving silently. Watercolor illustration."
    },
    {
        "number": 13,
        "text": ["The flying foxes were just shapes now —", "dark against the dark sky, moving and moving."],
        "illustration_prompt": "Flying foxes as dark silhouettes against deep navy sky. Stars scattered throughout. Sunny peaceful in foreground. Contemplative, mysterious, magical mood. Watercolor with subtle detail."
    },
    {
        "number": 14,
        "text": ["She breathed out a long, slow breath.", "And drifted off beneath the wings of night."],
        "illustration_prompt": "Sunny's eyes gently closing, expression very peaceful and content. Golden-brown chubby quokka curled peacefully. Flying foxes gliding overhead like protective wings. Stars twinkling. Watercolor illustration."
    },
    {
        "number": 15,
        "text": ["Her eyes grew heavy.", "The stars twinkled on, keeping watch through the night."],
        "illustration_prompt": "Sunny lying in grass, deeply drowsy or falling asleep, peaceful smile on her face. Chubby golden-brown quokka curled up. Starry night sky above. Flying foxes moving gently. Watercolor illustration."
    },
    {
        "number": 16,
        "text": ["And a tiny smile stayed on her face.", "Goodnight, Sunny. Goodnight, flying foxes. Goodnight, little one."],
        "illustration_prompt": "Sunny asleep in soft grass with gentle smile. Chubby golden-brown quokka at peace. Full starry sky above, moon gently illuminating. Flying foxes gliding peacefully overhead. Ultimate bedtime image - warm, protected, peaceful. Watercolor, masterful quality."
    },
]

def encode_image_to_base64(image_path: str) -> str:
    """Encode image to base64 for Replicate input."""
    with open(image_path, "rb") as f:
        return base64.standard_b64encode(f.read()).decode("utf-8")

def create_prediction_with_image(prompt: str, image_b64: str, headers: dict) -> dict:
    """Create FLUX prediction with image conditioning, handling 429 rate limits."""
    for attempt in range(10):
        resp = requests.post(
            "https://api.replicate.com/v1/models/black-forest-labs/flux-1.1-pro/predictions",
            headers=headers,
            json={
                "input": {
                    "prompt": prompt,
                    "image": f"data:image/png;base64,{image_b64}",
                    "aspect_ratio": "16:9",
                    "output_format": "png",
                    "output_quality": 100,
                    "prompt_upsampling": True
                }
            },
            timeout=300,
        )
        if resp.status_code == 201:
            return resp.json()
        if resp.status_code == 429:
            wait = max(int(resp.json().get("retry_after", 12)), 12)
            print(f"    rate limited, waiting {wait}s (attempt {attempt + 1}/10)...")
            time.sleep(wait)
            continue
        raise RuntimeError(f"Replicate error {resp.status_code}: {resp.text}")
    raise RuntimeError("Rate limited after 10 retries")

def generate_with_reference(prompt: str, token: str, image_b64: str) -> Image.Image:
    """Generate image conditioned on Sunny reference."""
    headers = {"Authorization": f"Token {token}"}
    pred = create_prediction_with_image(prompt, image_b64, headers)
    pred_id = pred["id"]

    while True:
        resp = requests.get(
            f"https://api.replicate.com/v1/predictions/{pred_id}",
            headers=headers, timeout=30,
        )
        pred = resp.json()

        if pred["status"] == "succeeded":
            if pred["output"]:
                url = pred["output"][0]
                img = requests.get(url, timeout=60)
                return Image.open(io.BytesIO(img.content))
        elif pred["status"] == "failed":
            raise Exception(f"Generation failed: {pred.get('error')}")

        print(f"    ... waiting ({pred['status']})...")
        time.sleep(5)

def add_text_to_image(image: Image.Image, text_lines: list) -> Image.Image:
    """Add story text to bottom of illustration."""
    if image.mode != "RGB":
        image = image.convert("RGB")

    width, height = image.size
    text_area_height = 180

    final_image = Image.new("RGB", (width, height + text_area_height), color=(245, 241, 232))
    final_image.paste(image, (0, 0))

    draw = ImageDraw.Draw(final_image)

    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 28)
    except:
        font = ImageFont.load_default()

    text_y = height + 30
    for line in text_lines:
        bbox = draw.textbbox((0, 0), line, font=font)
        text_width = bbox[2] - bbox[0]
        text_x = (width - text_width) // 2
        draw.text((text_x, text_y), line, fill=(26, 45, 92), font=font)
        text_y += 50

    return final_image

def main():
    token = os.getenv("REPLICATE_API_TOKEN")
    if not token:
        print("ERROR: REPLICATE_API_TOKEN not set")
        return 1

    if not REFERENCE_IMAGE.exists():
        print(f"ERROR: Reference image not found: {REFERENCE_IMAGE}")
        return 1

    print("=" * 70)
    print("Generating Book 1 Pages (Image-Conditioned from Sunny Reference)")
    print("=" * 70)
    print(f"Reference: {REFERENCE_IMAGE}")
    print(f"Output: {OUTPUT_DIR}")
    print()

    # Encode reference image once
    print("Encoding reference image...")
    ref_b64 = encode_image_to_base64(str(REFERENCE_IMAGE))
    print("✓ Reference encoded\n")

    successful = []
    failed = []

    for i, page_data in enumerate(PAGES):
        if i > 0:
            time.sleep(12)  # Rate limit spacing

        page_num = page_data["number"]
        print(f"Page {page_num}: {page_data['text'][0][:50]}...")

        try:
            print(f"  Generating with reference conditioning...")
            image = generate_with_reference(page_data["illustration_prompt"], token, ref_b64)

            print(f"  Adding text...")
            image_with_text = add_text_to_image(image, page_data["text"])

            output_file = OUTPUT_DIR / f"BOOK-1-PAGE-{page_num:02d}-ILLUSTRATED.png"
            image_with_text.save(output_file, quality=95)
            print(f"  ✓ Saved: {output_file.name}")
            successful.append(page_num)

        except Exception as e:
            print(f"  ✗ ERROR: {e}")
            failed.append((page_num, str(e)))

        print()

    print("=" * 70)
    print(f"COMPLETE: {len(successful)}/{len(PAGES)} pages generated")
    print("=" * 70)

    if successful:
        print(f"\n✓ Successful pages: {successful}")

    if failed:
        print(f"\n✗ Failed pages:")
        for page_num, error in failed:
            print(f"  - Page {page_num}: {error}")

    return 0 if not failed else 1

if __name__ == "__main__":
    sys.exit(main())
