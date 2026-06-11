#!/usr/bin/env python3
"""
Generate all 16 watercolor story pages for Book 1: Sunny and the Flying Fox
Uses image generation API to create professional watercolor illustrations
"""

import os
import sys
import json
import time
import requests
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import io

# Configuration
OUTPUT_DIR = Path("/home/user/jamie-wigg/BOOK-1-ILLUSTRATED-PAGES")
OUTPUT_DIR.mkdir(exist_ok=True)

# SUNNY CHARACTER SPECIFICATION (THE BIBLE)
# Reference: User's 3 watercolor reference images
SUNNY_CHARACTER = """
Sunny the quokka:
- BODY: Extremely chubby and round (teddy-bear-like), NOT lean
- FUR: Warm golden-brown color (never dark or grey)
- EYES: Large, gentle, warm brown eyes with kind expression
- EARS: Small, round ears, short snout
- EXPRESSION: Natural gentle smile, peaceful and calm
- POSES: Often in peaceful, restful poses (sitting, lying down, curled up)
- DETAILS: Sometimes wearing cozy details (pajamas, blankets, wrapped in warmth)
"""

VISUAL_STYLE = """
Artistic Style (THE BIBLE):
- MEDIUM: Hand-painted watercolor on textured paper
- TECHNIQUE: Visible brushstrokes, pigment bleeds, organic edges
- PALETTE: Warm earthy tones - golds, burnt siennas, soft greens, deep navy blues
- SETTING: Australian bush scenes at night (moonlit meadows, gum trees, wildflowers, gentle streams)
- MOOD: Cozy, safe, calm, bedtime-appropriate, peaceful
- COMPOSITION: Moonlit settings with stars, natural elements (flowers, water, trees, fireflies), Sunny as peaceful central focus, soft warm golden light
"""

# Story pages data (16 pages)
PAGES = [
    {
        "number": 2,
        "text": [
            "The sky was the colour of ripe plums when Sunny first saw them.",
            "One. Then three. Then many."
        ],
        "illustration_prompt": f"{SUNNY_CHARACTER}\n{VISUAL_STYLE}\nScene: Sunny the quokka in the Australian bush as the sky turns plum colors. First flying fox silhouettes appearing above. Sunny sitting peacefully, watching moment. Hand-painted watercolor with soft brushstrokes, visible pigment bleeds. Palette: warm golds, soft purples, breathing room."
    },
    {
        "number": 3,
        "text": [
            "Flying foxes, sailing out from their roost in the old fig tree.",
            "Their wings were wide and dark, moving through the air without a sound."
        ],
        "illustration_prompt": "Soft watercolor of flying foxes with wide spread wings gliding from an old fig tree. Multiple foxes at different heights. Dark graceful shapes against plum-colored sky. Show the beauty and silence of their movement. Tree visible below. Watercolor soft edges."
    },
    {
        "number": 4,
        "text": [
            "No flap, no flutter, just a long, smooth, swooping glide.",
            "Sunny stood very still and watched."
        ],
        "illustration_prompt": f"{SUNNY_CHARACTER}\n{VISUAL_STYLE}\nScene: Sunny standing motionless in grass, looking up in wonder. Flying foxes gracefully gliding in smooth arcs above. Her peaceful, focused expression. Hand-painted watercolor with soft brushstrokes. Palette: soft purples, warm golds."
    },
    {
        "number": 5,
        "text": [
            "They were so large and so quiet.",
            "She had not known something so big could move so softly."
        ],
        "illustration_prompt": f"{SUNNY_CHARACTER}\n{VISUAL_STYLE}\nScene: Large flying foxes (closer view) gliding above Sunny. Their size apparent, but movement appears gentle and ethereal. Sunny small below, expressing wonder. Soft shadows and light. Hand-painted watercolor with visible brushstrokes."
    },
    {
        "number": 6,
        "text": [
            "One flew low, close enough that Sunny could see",
            "the warm dark fur of its body and its little fox-like face."
        ],
        "illustration_prompt": f"{SUNNY_CHARACTER}\n{VISUAL_STYLE}\nScene: Flying fox swooping low near Sunny. Close enough to see detail. Sunny's chubby round face shows gentle wonder and awe. Intimate, magical moment of connection. Hand-painted watercolor, soft warm colors."
    },
    {
        "number": 7,
        "text": [
            "Neat ears, bright eyes, a pointed nose.",
            "It swooped toward a flowering tree and hovered for just a moment."
        ],
        "illustration_prompt": f"{SUNNY_CHARACTER}\n{VISUAL_STYLE}\nScene: Flying fox hovering gracefully near flowering branches. Flowers glow gently in twilight. Sunny visible below watching peacefully. Tender, intimate moment. Hand-painted watercolor on textured paper with visible brushstrokes."
    },
    {
        "number": 8,
        "text": [
            "Drinking from a blossom.",
            "Then it was gone again, back into the darkening sky."
        ],
        "illustration_prompt": f"{SUNNY_CHARACTER}\n{VISUAL_STYLE}\nScene: Flying fox hovering over blossoms, drawing nectar from flowers. Sky darkening (deeper purples and early blues). Sunny peaceful below. Hand-painted watercolor with pigment bleeds, soft edges."
    },
    {
        "number": 9,
        "text": [
            "The others followed their own paths —",
            "long curved arcs through the air, each one different."
        ],
        "illustration_prompt": f"{SUNNY_CHARACTER}\n{VISUAL_STYLE}\nScene: Multiple flying foxes (3-5) tracing graceful curved paths across sky. Each arc unique and beautiful. Sunny watching below. Sky deeper purple. Hand-painted watercolor, warm earthy palette."
    },
    {
        "number": 10,
        "text": [
            "Each one beautiful.",
            "Sunny watched until the sky turned from plum to deep navy."
        ],
        "illustration_prompt": f"{SUNNY_CHARACTER}\n{VISUAL_STYLE}\nScene: Sunny watching as multiple flying foxes glide in beautiful arcs. Sky actively transitioning to deep navy. First stars appearing. Sunny's peaceful expression. Hand-painted watercolor with soft brushstrokes."
    },
    {
        "number": 11,
        "text": [
            "The stars came out, and still the flying foxes moved above her.",
            "Silent and grand."
        ],
        "illustration_prompt": f"{SUNNY_CHARACTER}\n{VISUAL_STYLE}\nScene: Deep navy starry sky full of twinkling stars. Flying foxes visible as graceful dark shapes gliding against the stars. Sunny as peaceful focus below. Silent and majestic. Hand-painted watercolor, everything bathed in starlight."
    },
    {
        "number": 12,
        "text": [
            "She sat down in the soft grass and looked up.",
            "The bush was full of quiet."
        ],
        "illustration_prompt": f"{SUNNY_CHARACTER}\n{VISUAL_STYLE}\nScene: Sunny sitting peacefully in soft grass, looking upward in calm observation. Chubby golden-brown quokka with gentle expression. Starry navy sky above. Flying foxes moving silently. Hand-painted watercolor, very serene."
    },
    {
        "number": 13,
        "text": [
            "The flying foxes were just shapes now —",
            "dark against the dark sky, moving and moving."
        ],
        "illustration_prompt": f"{SUNNY_CHARACTER}\n{VISUAL_STYLE}\nScene: Flying foxes as dark silhouettes against deep navy sky. Stars scattered throughout. Sunny peaceful in foreground. Contemplative, mysterious, magical mood. Hand-painted watercolor with soft edges and visible brushstrokes."
    },
    {
        "number": 14,
        "text": [
            "She breathed out a long, slow breath.",
            "And drifted off beneath the wings of night."
        ],
        "illustration_prompt": f"{SUNNY_CHARACTER}\n{VISUAL_STYLE}\nScene: Sunny's eyes gently closing, expression very peaceful and content. Golden-brown chubby quokka curled peacefully. Flying foxes gliding overhead like protective wings. Stars twinkling. Hand-painted watercolor, very soft and dreamy."
    },
    {
        "number": 15,
        "text": [
            "Her eyes grew heavy.",
            "The stars twinkled on, keeping watch through the night."
        ],
        "illustration_prompt": f"{SUNNY_CHARACTER}\n{VISUAL_STYLE}\nScene: Sunny lying in grass, deeply drowsy or falling asleep, peaceful smile on her face. Chubby golden-brown quokka curled up. Starry night sky above. Flying foxes moving gently. Hand-painted watercolor, soft and soothing."
    },
    {
        "number": 16,
        "text": [
            "And a tiny smile stayed on her face.",
            "Goodnight, Sunny. Goodnight, flying foxes. Goodnight, little one."
        ],
        "illustration_prompt": f"{SUNNY_CHARACTER}\n{VISUAL_STYLE}\nScene: Sunny asleep in soft grass with gentle smile. Chubby golden-brown quokka at peace. Full starry sky above, moon gently illuminating. Flying foxes gliding peacefully overhead. Ultimate bedtime image - warm, protected, peaceful."
    }
]

def generate_image_with_replicate(prompt: str, api_token: str) -> Image.Image:
    """Generate watercolor image using Replicate API"""

    if not api_token:
        raise ValueError("REPLICATE_API_TOKEN not provided")

    # Use a watercolor-optimized prompt
    full_prompt = f"{prompt}\n\nStyle: Professional watercolor painting, soft edges, pastel palette (soft purples, warm golds, gentle greens, cream), bedtime story illustration, children's book quality, painted not digital, breathing room, peaceful mood."

    headers = {"Authorization": f"Token {api_token}"}

    # Try FLUX 1.1 Pro (best for watercolor style)
    model = "black-forest-labs/flux-1.1-pro"

    print(f"  → Generating with {model}...")

    payload = {
        "prompt": full_prompt,
        "aspect_ratio": "16:9",
        "num_outputs": 1,
    }

    response = requests.post(
        f"https://api.replicate.com/v1/models/{model}/predictions",
        headers=headers,
        json=payload,
        timeout=300
    )

    if response.status_code != 201:
        raise Exception(f"Replicate API error: {response.status_code} - {response.text}")

    prediction = response.json()
    prediction_id = prediction["id"]

    # Poll for completion
    while True:
        response = requests.get(
            f"https://api.replicate.com/v1/predictions/{prediction_id}",
            headers=headers,
            timeout=30
        )
        prediction = response.json()

        if prediction["status"] == "succeeded":
            if prediction["output"]:
                # Download the image
                image_url = prediction["output"][0]
                img_response = requests.get(image_url, timeout=30)
                return Image.open(io.BytesIO(img_response.content))
        elif prediction["status"] == "failed":
            raise Exception(f"Image generation failed: {prediction.get('error')}")

        print(f"    ... waiting ({prediction['status']})...")
        time.sleep(5)

def add_text_to_image(image: Image.Image, text_lines: list) -> Image.Image:
    """Add story text to bottom of illustration"""

    # Ensure image is RGB
    if image.mode != "RGB":
        image = image.convert("RGB")

    # Create a new image with cream text area at bottom
    width, height = image.size
    text_area_height = 180

    final_image = Image.new("RGB", (width, height + text_area_height), color=(245, 241, 232))
    final_image.paste(image, (0, 0))

    # Add text
    draw = ImageDraw.Draw(final_image)

    # Try to load a nice font, fallback to default
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 28)
    except:
        font = ImageFont.load_default()

    # Draw text lines
    text_y = height + 30
    for line in text_lines:
        # Center the text
        bbox = draw.textbbox((0, 0), line, font=font)
        text_width = bbox[2] - bbox[0]
        text_x = (width - text_width) // 2

        draw.text((text_x, text_y), line, fill=(26, 45, 92), font=font)
        text_y += 50

    return final_image

def main():
    """Generate all 16 watercolor pages"""

    api_token = os.getenv("REPLICATE_API_TOKEN")

    if not api_token:
        print("ERROR: REPLICATE_API_TOKEN environment variable not set")
        print("\nUsage:")
        print("  export REPLICATE_API_TOKEN='your-token-here'")
        print("  python3 generate-book1-watercolor-pages.py")
        sys.exit(1)

    print("=" * 70)
    print("Generating Book 1 Watercolor Story Pages")
    print("=" * 70)
    print(f"Output directory: {OUTPUT_DIR}")
    print(f"Total pages: {len(PAGES)}")
    print()

    successful = []
    failed = []

    for page_data in PAGES:
        page_num = page_data["number"]
        print(f"Page {page_num}: {page_data['text'][0][:50]}...")

        try:
            # Generate illustration
            print(f"  Generating illustration...")
            image = generate_image_with_replicate(page_data["illustration_prompt"], api_token)

            # Add text
            print(f"  Adding text...")
            image_with_text = add_text_to_image(image, page_data["text"])

            # Save
            output_file = OUTPUT_DIR / f"BOOK-1-PAGE-{page_num:02d}-WATERCOLOR.png"
            image_with_text.save(output_file, quality=95)
            print(f"  ✓ Saved: {output_file.name}")
            successful.append(page_num)

        except Exception as e:
            print(f"  ✗ ERROR: {e}")
            failed.append((page_num, str(e)))

        print()

    # Summary
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
