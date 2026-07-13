#!/usr/bin/env python3
"""Build Amazon KDP paperback interiors padded to 24 pages (KDP minimum).

Amazon requires >=24 pages for a paperback. Each book has 17 illustrated
story pages; we wrap them with proper book matter to reach 24:

  1  Title page          (title + series + author, cream)
  2  Copyright page      (© + AI disclosure + edition)
  3..19  17 story pages  (the existing illustrated spreads)
  20 "The End"           (cream)
  21 About the series    (cream)
  22 blank
  23 blank
  24 Also in this series (list)

Trim: 11 x 8.5 in landscape, 300 DPI (matches the cover + earlier interiors).
Output: kdp-paperbacks/book<NN>-<slug>-paperback.pdf  (overwrites 17-page ones)
"""
import pathlib
import re
import sys

from PIL import Image, ImageDraw, ImageFont

REPO = pathlib.Path(__file__).parent
FONTS = REPO / ".claude" / "skills" / "canvas-design" / "canvas-fonts"
OUT = REPO / "kdp-paperbacks"
OUT.mkdir(exist_ok=True)

DPI = 300
PAGE_W, PAGE_H = int(11.0 * DPI), int(8.5 * DPI)   # 3300 x 2550
PAPER = (253, 251, 249)
INK = (74, 60, 92)
GOLD = (183, 138, 58)
MARGIN = int(0.30 * DPI)

TITLE_F = FONTS / "Gloock-Regular.ttf"          # warm serif display
BODY_F = FONTS / "WorkSans-Regular.ttf"
BODYB_F = FONTS / "WorkSans-Bold.ttf"

SERIES = "Sonny's Cozy Quokka Bedtime Tales"

# book number -> spoken animal name, for the "also in this series" list
NAMES = {
    1: "the Flying Fox", 2: "the Sleepy Wombat", 3: "the Tawny Frogmouth",
    4: "the Sugar Glider", 5: "the Little Bilby", 6: "the Kookaburra",
    7: "the Platypus", 8: "the Sleepy Echidna", 9: "the Ringtail Possum",
    10: "the Little Penguin", 11: "the Sleepy Koala", 12: "the Boobook Owl",
    13: "the Green Tree Frog", 14: "the Pademelon", 15: "the Little Numbat",
    16: "the Spotted Quoll", 17: "the Bandicoot", 18: "the Dingo Puppy",
    19: "the Emu Chick", 20: "the Blue-tongue Lizard", 21: "the Pink Galah",
    22: "the White Cockatoo", 23: "the Lyrebird", 24: "the Sea Turtle",
    25: "the Seal Pup", 26: "the Willie Wagtail", 27: "the Glow-worms",
    28: "the Brolga", 29: "the Kangaroo Joey", 30: "the Black Swan",
    31: "the Fairy-wren", 32: "the Barking Gecko", 33: "the Magpie",
    34: "the Dolphin", 35: "the Cassowary Chick",
}

PB = {int(re.match(r"book(\d+)-", p.name).group(1)): p
      for p in OUT.glob("book*-paperback.pdf")}


def font(path, size):
    return ImageFont.truetype(str(path), size)


def blank():
    return Image.new("RGB", (PAGE_W, PAGE_H), PAPER)


def center_text(d, y, text, f, fill=INK):
    w = d.textlength(text, font=f)
    d.text(((PAGE_W - w) / 2, y), text, font=f, fill=fill)
    return y + f.size


def title_from(slug):
    small = {"and", "the", "of", "a"}
    return " ".join(w if w in small and i else w.capitalize()
                    for i, w in enumerate(slug.split("-")))


def page_title(title):
    img = blank()
    d = ImageDraw.Draw(img)
    d.rectangle([MARGIN, MARGIN, PAGE_W - MARGIN, PAGE_H - MARGIN],
                outline=GOLD, width=4)
    y = int(PAGE_H * 0.30)
    y = center_text(d, y, SERIES, font(BODYB_F, 46), GOLD) + 40
    for ln in _wrap(d, title, font(TITLE_F, 150), PAGE_W - 4 * MARGIN):
        y = center_text(d, y, ln, font(TITLE_F, 150)) + 16
    center_text(d, y + 40, "Written by Jamie Wigg", font(BODY_F, 42))
    return img


def page_copyright(title):
    img = blank()
    d = ImageDraw.Draw(img)
    lines = [
        f"{title}", "",
        f"Part of “{SERIES}.”", "",
        "Copyright © Jamie Wigg. All rights reserved.",
        "No part of this book may be reproduced without permission.", "",
        "This book was created with the assistance of AI tools",
        "(illustrations and text), reviewed and edited by the author.", "",
        "First edition.",
    ]
    y = int(PAGE_H * 0.34)
    for ln in lines:
        y = center_text(d, y, ln, font(BODY_F, 34)) + 16
    return img


def page_the_end():
    img = blank()
    d = ImageDraw.Draw(img)
    center_text(d, int(PAGE_H * 0.40), "The End", font(TITLE_F, 170), GOLD)
    center_text(d, int(PAGE_H * 0.40) + 210,
                "Sweet dreams, little one.", font(BODY_F, 48))
    return img


def page_about():
    img = blank()
    d = ImageDraw.Draw(img)
    y = int(PAGE_H * 0.22)
    y = center_text(d, y, "About the Series", font(TITLE_F, 96), GOLD) + 50
    body = ("Sonny's Cozy Quokka Bedtime Tales are gentle, rhythmic stories "
            "made to help little ones wind down and drift off to sleep. In "
            "every book, Sunny the little quokka meets a new Australian animal "
            "friend, shares a calm moment together, and settles in for the "
            "night — ending, as always, with a peaceful goodnight. With "
            "soft hand-painted watercolour art on every page and soothing "
            "read-aloud words, they are perfect for nap time and bedtime "
            "with children ages 1–5.")
    for ln in _wrap(d, body, font(BODY_F, 42), PAGE_W - 4 * MARGIN):
        y = center_text(d, y, ln, font(BODY_F, 42)) + 14
    return img


def page_also(num):
    img = blank()
    d = ImageDraw.Draw(img)
    y = int(PAGE_H * 0.16)
    y = center_text(d, y, "Also in this series", font(TITLE_F, 88), GOLD) + 44
    others = [n for n in sorted(NAMES) if n != num][:12]
    for n in others:
        y = center_text(d, y, f"Sunny and {NAMES[n]}", font(BODY_F, 40)) + 12
    center_text(d, PAGE_H - MARGIN - 60,
                "Look for all 35 cozy bedtime tales.", font(BODYB_F, 38), GOLD)
    return img


def _wrap(d, text, f, max_w):
    words, lines, cur = text.split(), [], ""
    for w in words:
        test = (cur + " " + w).strip()
        if d.textlength(test, font=f) <= max_w:
            cur = test
        else:
            lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def story_page(art_path):
    page = blank()
    with Image.open(art_path) as im:
        art = im.convert("RGB")
    aw, ah = PAGE_W - 2 * MARGIN, PAGE_H - 2 * MARGIN
    scale = min(aw / art.width, ah / art.height)
    w, h = int(art.width * scale), int(art.height * scale)
    page.paste(art.resize((w, h), Image.LANCZOS),
               ((PAGE_W - w) // 2, (PAGE_H - h) // 2))
    return page


def story_paths(num):
    d = REPO / f"book{num}" / "redesign" / "pages"
    out = []
    for n in range(1, 18):
        for cand in (d / f"BOOK-{num}-PAGE-{n:02d}.png",
                     d / f"BOOK-{num}-PAGE-{n:02d}-REDESIGN.png"):
            if cand.is_file():
                out.append(cand)
                break
        else:
            raise RuntimeError(f"book{num}: missing page {n:02d}")
    return out


def build(num):
    slug = re.sub(r"^book\d+-", "", PB[num].name[:-len("-paperback.pdf")])
    title = title_from(slug)
    pages = [page_title(title), page_copyright(title)]
    pages += [story_page(p) for p in story_paths(num)]
    pages += [page_the_end(), page_about(), blank(), blank(), page_also(num)]
    assert len(pages) == 24, f"book{num}: {len(pages)} pages"
    out = OUT / f"book{num:02d}-{slug}-paperback.pdf"
    pages[0].save(out, "PDF", resolution=float(DPI), save_all=True,
                  append_images=pages[1:])
    return out


def main():
    nums = [int(a) for a in sys.argv[1:]] or sorted(PB)
    for num in nums:
        out = build(num)
        mb = out.stat().st_size / (1024 * 1024)
        print(f"book{num:02d}: {out.name}  {mb:.1f}MB  24pp @ 11x8.5")


if __name__ == "__main__":
    main()
