#!/usr/bin/env python3
"""
Book 1 — "Sunny and the Flying Fox" — redesigned watercolour edition.

Rebuilds all book pages using the episode pipeline's character-consistency
machinery: the canonical seed-locked Sonny reference (kids-channel/character/
sonny-ref.jpg) painted into every page via FLUX Kontext, so the character is
identical across the whole book instead of drifting page to page.

Outputs (repo-relative, safe on GitHub runners):
  book1/redesign/pages/BOOK-1-PAGE-NN-REDESIGN.png   1920x1080 composed pages
  book1/redesign/sunny-and-the-flying-fox.pdf        full assembled book

Requires REPLICATE_API_TOKEN. Fails loudly if any illustration cannot be
generated — a sellable book must never fall back to procedural placeholder art.
"""

import sys
from pathlib import Path

REPO_ROOT = Path(__file__).parent
sys.path.insert(0, str(REPO_ROOT / "kids-channel"))
import pipeline  # noqa: E402  (reuse character ref + Kontext + FLUX helpers)

from PIL import Image, ImageDraw, ImageFont  # noqa: E402

OUT_DIR = REPO_ROOT / "book1" / "redesign"
PAGES_DIR = OUT_DIR / "pages"
WORK_DIR = OUT_DIR / "work"
PAGE_W, PAGE_H = 1920, 1080

BOOK_TITLE = "Sunny and the Flying Fox"
BOOK_SUBTITLE = "Sonny's Cozy Quokka Bedtime Tales — Book 1"

# include_character: pages that feature Sunny go through FLUX Kontext with the
# canonical reference; fox-only close-ups render without her (seed-locked).
PAGES = [
    dict(number=2, include_character=True,
         text=["The sky was the colour of ripe plums when Sunny first saw them.",
               "One. Then three. Then many."],
         scene="Sitting peacefully in the Australian bush at dusk, the sky turning ripe-plum purple, the first flying fox silhouettes appearing high above gum trees"),
    dict(number=3, include_character=False,
         text=["Flying foxes, sailing out from their roost in the old fig tree.",
               "Their wings were wide and dark, moving through the air without a sound."],
         scene="Flying foxes with wide dark wings gliding out from an old fig tree, several at different heights, graceful silent shapes against a plum-coloured dusk sky"),
    dict(number=4, include_character=True,
         text=["No flap, no flutter, just a long, smooth, swooping glide.",
               "Sunny stood very still and watched."],
         scene="Standing very still in long grass, looking up in quiet wonder as flying foxes glide in smooth arcs across the twilight sky above"),
    dict(number=5, include_character=True,
         text=["They were so large and so quiet.",
               "She had not known something so big could move so softly."],
         scene="Small in a moonlit meadow while large flying foxes pass gently overhead, their size clear but their movement soft and ethereal"),
    dict(number=6, include_character=True,
         text=["One flew low, close enough that Sunny could see",
               "the warm dark fur of its body and its little fox-like face."],
         scene="A flying fox swooping low and close, its warm dark fur and gentle fox-like face visible, while the quokka gazes up in gentle awe"),
    dict(number=7, include_character=False,
         text=["Neat ears, bright eyes, a pointed nose.",
               "It swooped toward a flowering tree and hovered for just a moment."],
         scene="Close view of a gentle flying fox with neat ears, bright eyes and a pointed nose, hovering beside softly glowing blossoms on a flowering gum tree at twilight"),
    dict(number=8, include_character=False,
         text=["Drinking from a blossom.",
               "Then it was gone again, back into the darkening sky."],
         scene="A flying fox delicately drinking nectar from a pale glowing blossom, then rising away into a deepening navy sky with early stars"),
    dict(number=9, include_character=True,
         text=["The others followed their own paths —",
               "long curved arcs through the air, each one different."],
         scene="Watching from below as many flying foxes trace long curved arcs across the sky, each path different, over the darkening bush"),
    dict(number=10, include_character=True,
         text=["Each one beautiful.",
               "Sunny watched until the sky turned from plum to deep navy."],
         scene="Sitting in soft grass watching the sky shift from plum purple to deep navy, flying-fox silhouettes still crossing above the gum trees"),
    dict(number=11, include_character=True,
         text=["The stars came out, and still the flying foxes moved above her.",
               "Silent and grand."],
         scene="Beneath a deep navy sky now filled with hand-dotted stars, flying foxes still moving silently and grandly overhead"),
    dict(number=12, include_character=True,
         text=["She sat down in the soft grass and looked up.",
               "The bush was full of quiet."],
         scene="Settled down in soft moonlit grass looking upward, the bush around her still and quiet, fireflies glowing warmly nearby"),
    dict(number=13, include_character=True,
         text=["The flying foxes were just shapes now —",
               "dark against the dark sky, moving and moving."],
         scene="Gazing sleepily as the flying foxes become faint dark shapes against the dark starry sky, still moving in slow arcs"),
    dict(number=14, include_character=True,
         text=["She breathed out a long, slow breath.",
               "And drifted off beneath the wings of night."],
         scene="Curled up cozily in the grass breathing out a slow sleepy breath, eyes half closed, beneath the star-filled night sky"),
    dict(number=15, include_character=True,
         text=["Her eyes grew heavy.",
               "The stars twinkled on, keeping watch through the night."],
         scene="Nearly asleep, curled up warm and safe in the moonlit meadow, the stars twinkling gently above and keeping watch"),
    dict(number=16, include_character=True,
         text=["And a tiny smile stayed on her face.",
               "Goodnight, Sunny. Goodnight, flying foxes. Goodnight, little one."],
         scene="Fast asleep with a tiny contented smile, curled up in soft grass under the moon and stars, a last flying fox silhouette far away in the sky"),
]

COVER_SCENE = ("Sitting on a mossy rock gazing up at flying foxes gliding across a "
               "ripe-plum and deep-navy dusk sky above an old fig tree, stars "
               "beginning to appear, fireflies glowing in the foreground")


def _font(size: int, weight: str = "Regular"):
    for candidate in (f"/tmp/fonts/Quicksand-{weight}.ttf",
                      "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
                      if weight == "Bold" else
                      "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"):
        try:
            return ImageFont.truetype(candidate, size)
        except Exception:
            continue
    return ImageFont.load_default()


def generate_illustration(page_num: int, scene: str, include_character: bool,
                          ref: Path | None) -> Path:
    """Kontext with the canonical reference for character pages; seed-locked
    FLUX Dev for fox-only pages. Raises on total failure — no placeholders."""
    img = None
    if include_character and ref:
        img = pipeline.generate_scene_image_kontext(scene, page_num, WORK_DIR, ref)
    if img is None and include_character:
        img = pipeline.generate_scene_image_replicate(scene, page_num, WORK_DIR)
    if img is None and not include_character:
        prompt = (
            f"{pipeline.WATERCOLOUR_STYLE} "
            f"Scene without the quokka character: {scene}. "
            f"Textured paper grain, soft hand-painted edges, warm cosy bedtime mood. No text."
        )
        img = pipeline._replicate_flux_predict(
            prompt, WORK_DIR / f"scene_{page_num:02d}.jpg",
            seed=page_num * 17, label=f"Page {page_num}")
    if img is None:
        raise RuntimeError(f"Page {page_num}: illustration generation failed on all paths")
    return img


def compose_page(illustration: Path, lines: list[str], page_num: int) -> Image.Image:
    """Full-bleed illustration with a soft darkened band carrying the story text."""
    img = Image.open(illustration).convert("RGB")
    img = img.resize((PAGE_W, PAGE_H), Image.Resampling.LANCZOS)

    band_h = 220
    overlay = Image.new("RGBA", (PAGE_W, PAGE_H), (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)
    for y in range(band_h):
        alpha = int(185 * (y / band_h) ** 0.7)
        od.line([(0, PAGE_H - band_h + y), (PAGE_W, PAGE_H - band_h + y)],
                fill=(12, 20, 45, alpha))
    img = Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")

    draw = ImageDraw.Draw(img)
    font = _font(46, "Medium")
    y = PAGE_H - band_h + 45
    for line in lines:
        w = draw.textlength(line, font=font)
        draw.text(((PAGE_W - w) / 2, y), line, font=font, fill=(255, 244, 214))
        y += 68
    draw.text((PAGE_W - 90, PAGE_H - 58), str(page_num),
              font=_font(30), fill=(255, 244, 214))
    return img


def compose_cover(illustration: Path) -> Image.Image:
    img = Image.open(illustration).convert("RGB")
    img = img.resize((PAGE_W, PAGE_H), Image.Resampling.LANCZOS)
    overlay = Image.new("RGBA", (PAGE_W, PAGE_H), (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)
    od.rectangle([(0, 60), (PAGE_W, 330)], fill=(12, 20, 45, 150))
    img = Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")
    draw = ImageDraw.Draw(img)
    title_font = _font(110, "Bold")
    sub_font = _font(42, "Medium")
    w = draw.textlength(BOOK_TITLE, font=title_font)
    draw.text(((PAGE_W - w) / 2, 100), BOOK_TITLE, font=title_font,
              fill=(255, 214, 120))
    w = draw.textlength(BOOK_SUBTITLE, font=sub_font)
    draw.text(((PAGE_W - w) / 2, 245), BOOK_SUBTITLE, font=sub_font,
              fill=(255, 244, 214))
    return img


def compose_end_page() -> Image.Image:
    img = Image.new("RGB", (PAGE_W, PAGE_H), (12, 20, 45))
    draw = ImageDraw.Draw(img)
    import random
    rnd = random.Random(7777)
    for _ in range(140):
        x, y = rnd.randint(0, PAGE_W), rnd.randint(0, PAGE_H)
        r = rnd.choice([1, 1, 2])
        draw.ellipse([x - r, y - r, x + r, y + r], fill=(255, 244, 200))
    for i, (text, size, dy, colour) in enumerate([
            ("The End", 120, 380, (255, 214, 120)),
            ("Sweet dreams, little one.", 52, 560, (255, 244, 214)),
            ("More Sonny stories every week on YouTube", 36, 680, (170, 190, 230))]):
        f = _font(size, "Bold" if i == 0 else "Medium")
        w = draw.textlength(text, font=f)
        draw.text(((PAGE_W - w) / 2, dy), text, font=f, fill=colour)
    return img


def main():
    if not pipeline.REPLICATE_API_TOKEN:
        sys.exit("REPLICATE_API_TOKEN is required — this generator has no free fallback")

    PAGES_DIR.mkdir(parents=True, exist_ok=True)
    WORK_DIR.mkdir(parents=True, exist_ok=True)

    print("[1/4] Canonical character reference...")
    ref = pipeline.get_character_ref(WORK_DIR)
    if ref is None:
        sys.exit("Could not obtain the canonical Sonny reference — aborting")

    print("[2/4] Generating illustrations...")
    book_pages = []

    cover_art = generate_illustration(1, COVER_SCENE, True, ref)
    cover = compose_cover(cover_art)
    cover_path = PAGES_DIR / "BOOK-1-PAGE-01-REDESIGN.png"
    cover.save(cover_path, quality=95)
    book_pages.append(cover)
    print("  ✓ Cover composed")

    failures = []
    for page in PAGES:
        try:
            art = generate_illustration(page["number"], page["scene"],
                                        page["include_character"], ref)
            composed = compose_page(art, page["text"], page["number"])
            out = PAGES_DIR / f"BOOK-1-PAGE-{page['number']:02d}-REDESIGN.png"
            composed.save(out, quality=95)
            book_pages.append(composed)
            print(f"  ✓ Page {page['number']} composed")
        except Exception as e:
            failures.append((page["number"], str(e)))
            print(f"  ✗ Page {page['number']}: {e}")

    print("[3/4] End page...")
    end_page = compose_end_page()
    end_path = PAGES_DIR / "BOOK-1-PAGE-18-REDESIGN.png"
    end_page.save(end_path, quality=95)
    book_pages.append(end_page)

    if failures:
        sys.exit(f"Book incomplete — {len(failures)} page(s) failed: {failures}")

    print("[4/4] Assembling PDF...")
    pdf_path = OUT_DIR / "sunny-and-the-flying-fox.pdf"
    book_pages[0].save(pdf_path, save_all=True, append_images=book_pages[1:],
                       resolution=150)
    print(f"✓ Book complete: {pdf_path} ({len(book_pages)} pages)")


if __name__ == "__main__":
    main()
