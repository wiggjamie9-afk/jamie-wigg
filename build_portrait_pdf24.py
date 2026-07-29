#!/usr/bin/env python3
"""Assemble the finished 24-page portrait book PDF from the already-rendered
page images in book<N>/redesign/epub-portrait-work/images/page-01..24.jpg.

These images are the canonical finished book (real text, correct art, correct
cover, front/back matter). The old *.pdf in each folder is a stale 17-page
version; this replaces it with the true 24-page edition, matching the EPUB.

Usage: python build_portrait_pdf24.py <num> [<num> ...]
"""
import pathlib
import sys

from PIL import Image

REPO = pathlib.Path(__file__).parent


def build(num):
    d = REPO / f"book{num}" / "redesign"
    imgdir = d / "epub-portrait-work" / "images"
    pages = []
    for n in range(1, 25):
        p = imgdir / f"page-{n:02d}.jpg"
        if not p.exists():
            raise SystemExit(f"book{num}: missing {p}")
        pages.append(Image.open(p).convert("RGB"))
    # name the PDF from the existing finished epub so slug stays consistent
    epub = next((e for e in d.glob("*.epub") if "v2-illustrated" not in e.name), None)
    slug = epub.stem if epub else f"book{num}"
    out = d / f"{slug}.pdf"
    pages[0].save(out, "PDF", resolution=300.0, save_all=True,
                  append_images=pages[1:])
    print(f"book{num}: {out.name}  24 pages  ({out.stat().st_size//1024//1024}MB)")


if __name__ == "__main__":
    for a in sys.argv[1:]:
        build(a)
