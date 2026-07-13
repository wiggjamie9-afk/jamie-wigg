#!/usr/bin/env python3
"""Build Amazon KDP paperback interior PDFs for every Sunny book.

Each book's 17 illustrated story pages (1920x1080, 16:9 landscape watercolor
spreads with baked-in text) are placed onto 8.5" x 8.5" square pages at
300 DPI — Amazon KDP's most common children's picture-book trim size.

Output: kdp-paperbacks/book<NN>-<slug>-paperback.pdf  (one PDF per book)
        kdp-paperbacks/README.txt
"""
import pathlib
import re
import sys

from PIL import Image

REPO = pathlib.Path(__file__).parent
OUT = REPO / "kdp-paperbacks"
OUT.mkdir(exist_ok=True)

DPI = 300
TRIM_W_IN = 11.0                    # 11 x 8.5 landscape trim (KDP standard)
TRIM_H_IN = 8.5
PAGE_W = int(TRIM_W_IN * DPI)       # 3300 px
PAGE_H = int(TRIM_H_IN * DPI)       # 2550 px
PAPER = (253, 251, 249)             # cream paper background sampled from art
MARGIN = int(0.30 * DPI)            # 0.30" safe margin each side (KDP min 0.25")


def page_paths(num: int) -> list[pathlib.Path]:
    d = REPO / f"book{num}" / "redesign" / "pages"
    out = []
    for n in range(1, 18):
        # book1 uses the -REDESIGN suffix; others are plain.
        cand = [d / f"BOOK-{num}-PAGE-{n:02d}.png",
                d / f"BOOK-{num}-PAGE-{n:02d}-REDESIGN.png"]
        hit = next((c for c in cand if c.is_file()), None)
        if hit is None:
            raise RuntimeError(f"book{num}: missing page {n:02d}")
        out.append(hit)
    return out


def slug_for(num: int) -> str:
    pdfs = list((REPO / f"book{num}" / "redesign").glob("sunny-and-*.pdf"))
    if pdfs:
        return pdfs[0].stem
    return f"sunny-book-{num}"


def build_page(art: Image.Image) -> Image.Image:
    """Place a 16:9 illustration centred on an 11x8.5 landscape cream page."""
    page = Image.new("RGB", (PAGE_W, PAGE_H), PAPER)
    avail_w = PAGE_W - 2 * MARGIN
    avail_h = PAGE_H - 2 * MARGIN
    scale = min(avail_w / art.width, avail_h / art.height)
    w = int(art.width * scale)
    h = int(art.height * scale)
    art_r = art.resize((w, h), Image.LANCZOS)
    x = (PAGE_W - w) // 2
    y = (PAGE_H - h) // 2
    page.paste(art_r, (x, y))
    return page


def build_book(num: int) -> pathlib.Path:
    slug = slug_for(num)
    pages = []
    for p in page_paths(num):
        with Image.open(p) as im:
            pages.append(build_page(im.convert("RGB")))
    out = OUT / f"book{num:02d}-{slug}-paperback.pdf"
    pages[0].save(out, "PDF", resolution=float(DPI), save_all=True,
                  append_images=pages[1:])
    return out


def main() -> None:
    nums = [int(a) for a in sys.argv[1:]] or list(range(1, 36))
    for num in nums:
        out = build_book(num)
        mb = out.stat().st_size / (1024 * 1024)
        print(f"book{num:02d}: {out.name}  {mb:.1f}MB  ({PAGE_W}x{PAGE_H}px @ {DPI}dpi)")


if __name__ == "__main__":
    main()
