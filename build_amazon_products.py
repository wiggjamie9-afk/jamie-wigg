#!/usr/bin/env python3
"""Assemble one Amazon-product folder per Sunny book.

To keep the git repo lean we do NOT duplicate the big binaries (covers, PDFs,
EPUBs already live elsewhere in the repo). Instead each book folder holds:

  amazon-products/book<NN>-<slug>/
    05-LISTING.txt        title / subtitle / description / keywords / price
    HOW-TO-UPLOAD.txt     step-by-step, with the exact repo path of every file

Run:  python build_amazon_products.py            # all 35 folders
"""
import pathlib
import re
import shutil

REPO = pathlib.Path(__file__).parent
OUT = REPO / "amazon-products"
OUT.mkdir(exist_ok=True)

PB = {int(re.match(r"book(\d+)-", p.name).group(1)):
      p for p in (REPO / "kdp-paperbacks").glob("book*-paperback.pdf")}


def find_epub(num: int) -> pathlib.Path | None:
    hits = list((REPO / f"book{num}" / "redesign").glob("*.epub"))
    return hits[0] if hits else None


def find_listing(num: int) -> pathlib.Path | None:
    hits = list((REPO / "kids-channel" / "amazon-kdp").glob(f"book{num:02d}-*-KDP.txt"))
    return hits[0] if hits else None


def title_from(slug: str) -> str:
    small = {"and", "the", "of", "a"}
    words = slug.split("-")
    return " ".join(w if w in small and i else w.capitalize()
                    for i, w in enumerate(words))


def rel(p: pathlib.Path | None) -> str:
    return str(p.relative_to(REPO)) if p else "(not found)"


def build(num: int) -> str:
    pb = PB[num]
    slug = re.sub(r"^book\d+-", "", pb.name[:-len("-paperback.pdf")])
    title = title_from(slug)
    folder = OUT / f"book{num:02d}-{slug}"
    folder.mkdir(exist_ok=True)

    ebook_cover = REPO / "kdp-covers" / f"book{num:02d}-kdp-cover.jpg"
    print_cover = REPO / "kids-channel" / "portrait-covers" / f"book{num:02d}.png"
    epub = find_epub(num)
    listing = find_listing(num)

    if listing:
        shutil.copy2(listing, folder / "05-LISTING.txt")

    (folder / "HOW-TO-UPLOAD.txt").write_text(
        f"""HOW TO PUT "{title}" ON AMAZON
{'=' * (len(title) + 24)}

You can sell this book on Amazon TWO ways — a Kindle eBook and a printed
Paperback. Do both for the widest reach. Every file you need is listed below
with its exact location in your project.

THE FILES FOR THIS BOOK
  Cover (eBook + front) . {rel(ebook_cover)}
  Cover art (print) ..... {rel(print_cover)}
  Paperback interior .... {rel(pb)}
  Kindle book (page-flip) {rel(epub)}
  Listing text .......... amazon-products/{folder.name}/05-LISTING.txt

--------------------------------------------------------------------
KINDLE eBOOK  (quickest — do this first)
--------------------------------------------------------------------
 1. kdp.amazon.com  ->  Create  ->  Kindle eBook
 2. Open 05-LISTING.txt; paste in Title, Subtitle, Description.
 3. Add the 7 keywords and pick the categories from 05-LISTING.txt.
 4. Age range: 1-5.  Language: English.
 5. eBook content:  upload the Kindle book  ({rel(epub)})
 6. Cover:  upload the eBook cover  ({rel(ebook_cover)})
 7. Set the price from 05-LISTING.txt.  Save & Publish.

--------------------------------------------------------------------
PAPERBACK  (same info, print version)
--------------------------------------------------------------------
 1. kdp.amazon.com  ->  Create  ->  Paperback
 2. Paste the same Title / Description / keywords from 05-LISTING.txt.
 3. Print options:
        Trim size ..... 11 x 8.5 in (landscape)
        Interior ...... Premium colour, white paper
        Bleed ......... No bleed
        Cover finish .. Glossy
 4. Interior file:  upload the paperback interior  ({rel(pb)})
 5. Cover:  KDP Cover Creator, front image = {rel(print_cover)}
 6. Preview -> Approve -> Publish.

Repeat for the next book folder.
""")
    return folder.name


def main() -> None:
    for num in sorted(PB):
        print(f"book{num:02d}: {build(num)}/")
    print(f"\n{len(PB)} product folders -> amazon-products/")


if __name__ == "__main__":
    main()
