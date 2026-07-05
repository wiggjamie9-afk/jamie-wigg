#!/usr/bin/env python3
"""Compose Book 2 — Sunny and the Sleepy Wombat — from Higgsfield art.

Art (cover + p02..p16) is fetched into book2/redesign/art/ beforehand.
Reuses Book 1's page-composition helpers so the layout stays identical.
"""
import importlib.util
import pathlib
import sys

from PIL import Image

REPO = pathlib.Path(__file__).parent
spec = importlib.util.spec_from_file_location("bookgen", REPO / "generate-book1-redesign.py")
bg = importlib.util.module_from_spec(spec)
sys.modules["bookgen"] = bg
# generate-book1-redesign imports pipeline (needs dotenv/requests); ensure path
sys.path.insert(0, str(REPO / "kids-channel"))
spec.loader.exec_module(bg)

TITLE = "Sunny and the Sleepy Wombat"
ART = REPO / "book2" / "redesign" / "art"
PAGES_OUT = REPO / "book2" / "redesign" / "pages"
PDF = REPO / "book2" / "redesign" / "sunny-and-the-sleepy-wombat.pdf"

PAGES = [
    (2,  ["The bush grew quiet as the sun slipped away.",
          "Sunny sat in the soft grass, watching the first stars."]),
    (3,  ["A rustle came from the tangled roots nearby.",
          "Out trundled a round little wombat, slow and sleepy."]),
    (4,  ["He had a wide flat nose and stubby little legs,",
          "and fur the colour of warm brown earth."]),
    (5,  ["“Hello,” said Sunny. “Where are you going?”",
          "“Home to my burrow,” the wombat yawned, “to sleep.”"]),
    (6,  ["He showed her a round little door,",
          "tucked snugly beneath the old gum-tree roots."]),
    (7,  ["Inside it was warm and dark and soft,",
          "lined with dry grass and fallen leaves."]),
    (8,  ["“It’s so cosy,” Sunny whispered.",
          "“The best place to close your eyes,” said the wombat."]),
    (9,  ["They sat and watched the moon climb high,",
          "round and golden over the sleepy bush."]),
    (10, ["Fireflies drifted by like tiny lanterns,",
          "blinking soft and slow in the warm night air."]),
    (11, ["The wombat gave a great big sleepy yawn.",
          "“Goodnight, little Sunny,” he said, and went inside."]),
    (12, ["Sunny found her own soft patch of grass,",
          "and curled up warm beneath the whispering leaves."]),
    (13, ["The bush breathed slow and gentle all around.",
          "Everything was still, and safe, and quiet."]),
    (14, ["Her eyes grew heavy as the stars looked down.",
          "One slow blink… then another… then one more."]),
    (15, ["And Sunny drifted off beneath the moon,",
          "as snug and safe as the wombat in his burrow."]),
    (16, ["Goodnight, Sunny. Goodnight, little wombat.",
          "Goodnight, sleepy bush. Goodnight, little one."]),
]


def cover_page() -> Image.Image:
    """Higgsfield cover already has the title baked in — cover-crop to 1920x1080."""
    W, H = 1920, 1080
    img = Image.open(ART / "cover.png").convert("RGB")
    scale = max(W / img.width, H / img.height)
    img = img.resize((round(img.width * scale), round(img.height * scale)))
    x = (img.width - W) // 2
    y = (img.height - H) // 2
    return img.crop((x, y, x + W, y + H))


def main() -> None:
    PAGES_OUT.mkdir(parents=True, exist_ok=True)
    out = []

    cover = cover_page()
    cover.save(PAGES_OUT / "BOOK-2-PAGE-01.png")
    out.append(cover)
    print("cover ok")

    for n, lines in PAGES:
        art = ART / f"p{n:02d}.png"
        if not art.is_file():
            raise RuntimeError(f"missing art: {art}")
        img = bg.compose_page(art, lines, n)
        img.save(PAGES_OUT / f"BOOK-2-PAGE-{n:02d}.png")
        out.append(img)
        print(f"page {n} ok")

    end = bg.compose_end_page()
    end.save(PAGES_OUT / "BOOK-2-PAGE-17.png")
    out.append(end)
    print("end page ok")

    rgb = [im.convert("RGB") for im in out]
    rgb[0].save(PDF, save_all=True, append_images=rgb[1:], format="PDF", resolution=150)
    print(f"PDF: {PDF} ({PDF.stat().st_size // 1024} KB, {len(rgb)} pages)")


if __name__ == "__main__":
    main()
