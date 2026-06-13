#!/usr/bin/env python3
"""
Generate all 16 Book 1 story pages using Pollinations AI (free, no API key).
Sunny's style is based on locked Concept 2 portrait reference.
"""

import os
import sys
import time
import io
import urllib.request
import urllib.parse
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

OUTPUT_DIR = Path("BOOK-1-ILLUSTRATED-PAGES")
OUTPUT_DIR.mkdir(exist_ok=True)

# Locked Sunny description — matches Concept 2 portrait exactly
SUNNY = (
    "Sunny the quokka, extremely chubby and round like a teddy bear, "
    "warm golden-brown fur with realistic soft painted texture, "
    "large gentle warm brown eyes, small round ears with cream-colored lining, "
    "natural soft smile, peaceful expression"
)

STYLE = (
    "professional children's book watercolor illustration, "
    "warm golden moonlight, deep navy starry sky, "
    "Australian bush setting with gum trees and wildflowers, "
    "rich detailed painted backgrounds, warm golds and soft purples, "
    "cozy bedtime mood, masterful storybook quality, "
    "same consistent character in every image"
)

PAGES = [
    {
        "number": 2,
        "text": ["The sky was the colour of ripe plums when Sunny first saw them.", "One. Then three. Then many."],
        "scene": "sitting peacefully on soft grass as the sky turns deep plum purple at dusk, first flying fox silhouettes appearing in the sky above her"
    },
    {
        "number": 3,
        "text": ["Flying foxes, sailing out from their roost in the old fig tree.", "Their wings were wide and dark, moving through the air without a sound."],
        "scene": "watching in wonder as large flying foxes with wide dark wings glide silently from an old fig tree against a plum-coloured sky"
    },
    {
        "number": 4,
        "text": ["No flap, no flutter, just a long, smooth, swooping glide.", "Sunny stood very still and watched."],
        "scene": "standing perfectly still in the grass, looking upward with peaceful wonder as flying foxes glide in long smooth arcs overhead"
    },
    {
        "number": 5,
        "text": ["They were so large and so quiet.", "She had not known something so big could move so softly."],
        "scene": "looking up with gentle awe at large flying foxes passing close overhead, their size impressive but their movement silent and graceful"
    },
    {
        "number": 6,
        "text": ["One flew low, close enough that Sunny could see", "the warm dark fur of its body and its little fox-like face."],
        "scene": "a flying fox swooping low nearby, close enough to see its warm dark fur and little pointed fox face, tender magical moment"
    },
    {
        "number": 7,
        "text": ["Neat ears, bright eyes, a pointed nose.", "It swooped toward a flowering tree and hovered for just a moment."],
        "scene": "watching a flying fox hover gracefully at a flowering gum tree in bloom, soft twilight glow on the white flowers"
    },
    {
        "number": 8,
        "text": ["Drinking from a blossom.", "Then it was gone again, back into the darkening sky."],
        "scene": "watching peacefully as a flying fox drinks nectar from blossoms then lifts away into a deepening purple-blue sky"
    },
    {
        "number": 9,
        "text": ["The others followed their own paths —", "long curved arcs through the air, each one different."],
        "scene": "sitting quietly as multiple flying foxes trace beautiful curved paths across the sky, each arc unique, sky turning deep navy"
    },
    {
        "number": 10,
        "text": ["Each one beautiful.", "Sunny watched until the sky turned from plum to deep navy."],
        "scene": "looking upward with quiet joy as the sky transitions from plum to deep navy blue, first stars appearing, flying foxes still moving"
    },
    {
        "number": 11,
        "text": ["The stars came out, and still the flying foxes moved above her.", "Silent and grand."],
        "scene": "sitting under a full starry navy sky, flying foxes as graceful dark shapes gliding among the stars, moonlight beginning"
    },
    {
        "number": 12,
        "text": ["She sat down in the soft grass and looked up.", "The bush was full of quiet."],
        "scene": "sitting contentedly in soft grass, looking upward with calm peaceful expression, quiet Australian bush surrounding her under starry sky"
    },
    {
        "number": 13,
        "text": ["The flying foxes were just shapes now —", "dark against the dark sky, moving and moving."],
        "scene": "watching flying foxes as dark silhouettes against the deep navy starry sky, a contemplative and magical nighttime scene"
    },
    {
        "number": 14,
        "text": ["She breathed out a long, slow breath.", "And drifted off beneath the wings of night."],
        "scene": "eyes beginning to close gently, expression utterly peaceful and content, flying foxes gliding overhead like protective wings, stars twinkling"
    },
    {
        "number": 15,
        "text": ["Her eyes grew heavy.", "The stars twinkled on, keeping watch through the night."],
        "scene": "lying in soft grass becoming drowsy, peaceful smile, chubby golden form nestled in the grass, full starry sky above keeping watch"
    },
    {
        "number": 16,
        "text": ["And a tiny smile stayed on her face.", "Goodnight, Sunny. Goodnight, flying foxes. Goodnight, little one."],
        "scene": "asleep with a gentle smile in soft moonlit grass, flying foxes gliding peacefully overhead, full moon and stars, warm protective night"
    },
]

def generate_image(prompt: str, width: int = 1344, height: int = 768) -> Image.Image:
    """Generate image via Pollinations AI — free, no key needed."""
    encoded = urllib.parse.quote(prompt)
    url = f"https://image.pollinations.ai/prompt/{encoded}?model=flux&width={width}&height={height}&nologo=true&seed={hash(prompt) % 99999}"

    for attempt in range(5):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=120) as resp:
                return Image.open(io.BytesIO(resp.read())).convert("RGB")
        except Exception as e:
            wait = (attempt + 1) * 10
            print(f"    attempt {attempt+1} failed ({e}), retrying in {wait}s...")
            time.sleep(wait)

    raise RuntimeError(f"Failed after 5 attempts: {prompt[:60]}")

def add_text(image: Image.Image, lines: list) -> Image.Image:
    """Add story text to bottom of page."""
    w, h = image.size
    bar_h = 160
    final = Image.new("RGB", (w, h + bar_h), color=(245, 241, 232))
    final.paste(image, (0, 0))
    draw = ImageDraw.Draw(final)

    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 30)
    except Exception:
        font = ImageFont.load_default()

    y = h + 20
    for line in lines:
        bbox = draw.textbbox((0, 0), line, font=font)
        x = (w - (bbox[2] - bbox[0])) // 2
        draw.text((x, y), line, fill=(26, 45, 92), font=font)
        y += 55

    return final

def main():
    print("=" * 65)
    print("Book 1: Sunny and the Flying Fox")
    print("Image generation: Pollinations AI (free)")
    print("=" * 65)
    print()

    ok, fail = [], []

    for i, page in enumerate(PAGES):
        if i > 0:
            time.sleep(3)  # be polite to free API

        n = page["number"]
        print(f"Page {n}: {page['text'][0][:55]}...")

        prompt = f"{SUNNY}, {page['scene']}. {STYLE}"

        try:
            img = generate_image(prompt)
            img = add_text(img, page["text"])
            out = OUTPUT_DIR / f"BOOK-1-PAGE-{n:02d}.png"
            img.save(out, optimize=True)
            print(f"  ✓ {out.name}  ({img.size[0]}x{img.size[1]})")
            ok.append(n)
        except Exception as e:
            print(f"  ✗ FAILED: {e}")
            fail.append((n, str(e)))
        print()

    print("=" * 65)
    print(f"Done: {len(ok)}/{len(PAGES)} pages  |  failed: {len(fail)}")
    if fail:
        for n, e in fail:
            print(f"  page {n}: {e}")
    return 1 if fail else 0

if __name__ == "__main__":
    sys.exit(main())
