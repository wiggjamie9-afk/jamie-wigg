#!/usr/bin/env python3
"""Generic Sunny book builder — compose pages + PDF from a spec JSON.

Usage: python build_book.py <spec.json>

spec.json:
{
  "num": 3, "slug": "sunny-and-the-tawny-frogmouth",
  "pages": [ {"n": 2, "text": ["line one", "line two"]}, ... 15 entries 2..16 ]
}

Art must already be fetched to book<num>/redesign/art/{cover,p02..p16}.png.
Reuses Book 1's compose helpers so the layout stays identical across books.
"""
import importlib.util
import json
import pathlib
import sys

from PIL import Image

REPO = pathlib.Path(__file__).parent
sys.path.insert(0, str(REPO / "kids-channel"))
_spec = importlib.util.spec_from_file_location("bookgen", REPO / "generate-book1-redesign.py")
bg = importlib.util.module_from_spec(_spec)
sys.modules["bookgen"] = bg
_spec.loader.exec_module(bg)


def cover_crop(path: pathlib.Path) -> Image.Image:
    W, H = 1920, 1080
    img = Image.open(path).convert("RGB")
    scale = max(W / img.width, H / img.height)
    img = img.resize((round(img.width * scale), round(img.height * scale)))
    x = (img.width - W) // 2
    y = (img.height - H) // 2
    return img.crop((x, y, x + W, y + H))


def main() -> None:
    spec = json.loads(pathlib.Path(sys.argv[1]).read_text())
    num, slug = spec["num"], spec["slug"]
    art = REPO / f"book{num}" / "redesign" / "art"
    pages_dir = REPO / f"book{num}" / "redesign" / "pages"
    pdf = REPO / f"book{num}" / "redesign" / f"{slug}.pdf"
    pages_dir.mkdir(parents=True, exist_ok=True)

    out = []
    cover = cover_crop(art / "cover.png")
    cover.save(pages_dir / f"BOOK-{num}-PAGE-01.png")
    out.append(cover)
    print("cover ok")

    for page in spec["pages"]:
        n = page["n"]
        art_file = art / f"p{n:02d}.png"
        if not art_file.is_file():
            raise RuntimeError(f"missing art: {art_file}")
        img = bg.compose_page(art_file, page["text"], n)
        img.save(pages_dir / f"BOOK-{num}-PAGE-{n:02d}.png")
        out.append(img)
        print(f"page {n} ok")

    end = bg.compose_end_page()
    end.save(pages_dir / f"BOOK-{num}-PAGE-17.png")
    out.append(end)
    print("end page ok")

    rgb = [im.convert("RGB") for im in out]
    rgb[0].save(pdf, save_all=True, append_images=rgb[1:], format="PDF", resolution=150)
    print(f"PDF: {pdf} ({pdf.stat().st_size // 1024} KB, {len(rgb)} pages)")


if __name__ == "__main__":
    main()
