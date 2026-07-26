#!/usr/bin/env python3
"""Rebuild every book's portrait Kindle EPUB as 24 pages.

Page order (24 total), all portrait 1600x2560:
  1  Cover (real portrait cover)
  2  Title page
  3  Copyright page
  4  Dedication
  5..21  17 story pages (landscape art matted on portrait cream)
  22 The End
  23 About the Series
  24 Also in this Series

Usage: python build_kindle_epub_portrait24.py [num ...]   (default: all 35)
Overwrites book<num>/redesign/<slug>.epub
"""
import importlib.util
import pathlib
import sys
import uuid
import zipfile

from PIL import Image, ImageDraw, ImageFont

REPO = pathlib.Path(__file__).parent
FONTS = REPO / ".claude" / "skills" / "canvas-design" / "canvas-fonts"
PAGE_W, PAGE_H = 1600, 2560
PAPER = (246, 239, 224)
INK = (74, 60, 92)
GOLD = (176, 132, 55)
AUTHOR = "Jamie Wigg"
SERIES = "Sonny's Cozy Quokka Bedtime Tales"

TITLE_F = FONTS / "Gloock-Regular.ttf"
BODY_F = FONTS / "WorkSans-Regular.ttf"
BODYB_F = FONTS / "WorkSans-Bold.ttf"

# NAMES (series list) from the paperback-24 builder
_spec = importlib.util.spec_from_file_location("pb24", REPO / "build_paperback_pdf_24.py")
pb24 = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(pb24)
# CONTAINER_XML, NAV_XHTML, NCX, book_meta, find_pages from the landscape epub builder
_kspec = importlib.util.spec_from_file_location("kle", REPO / "build_kindle_epub.py")
kle = importlib.util.module_from_spec(_kspec)
_kspec.loader.exec_module(kle)

PAGE_XHTML = """<?xml version="1.0" encoding="UTF-8"?>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title>Page {page}</title>
<meta name="viewport" content="width={w}, height={h}"/>
<style>html,body{{margin:0;padding:0;width:{w}px;height:{h}px;background:#f6efe0}}
.page{{position:absolute;top:0;left:0;width:{w}px;height:{h}px}}
img{{width:{w}px;height:{h}px;display:block}}</style>
</head>
<body>
<div class="page"><img src="../images/page-{page:02d}.jpg" alt="Page {page}"/></div>
</body>
</html>
"""

OPF = """<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="BookId" xml:lang="en">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="BookId">{book_id}</dc:identifier>
    <dc:title>{title}</dc:title>
    <dc:creator>{author}</dc:creator>
    <dc:language>en</dc:language>
    <dc:publisher>{series}</dc:publisher>
    <meta property="dcterms:modified">2026-01-01T00:00:00Z</meta>
    <meta property="rendition:layout">pre-paginated</meta>
    <meta property="rendition:orientation">portrait</meta>
    <meta property="rendition:spread">none</meta>
    <meta name="fixed-layout" content="true"/>
    <meta name="original-resolution" content="{w}x{h}"/>
    <meta name="orientation-lock" content="portrait"/>
    <meta name="book-type" content="children"/>
    <meta name="RegionMagnification" content="false"/>
    <meta name="cover" content="img01"/>
  </metadata>
  <manifest>
    <item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>
    <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
{items}
  </manifest>
  <spine toc="ncx">
{spine}
  </spine>
</package>
"""


def font(p, s):
    return ImageFont.truetype(str(p), s)


def blank():
    return Image.new("RGB", (PAGE_W, PAGE_H), PAPER)


def _center(d, y, text, f, fill=INK):
    w = d.textlength(text, font=f)
    d.text(((PAGE_W - w) / 2, y), text, font=f, fill=fill)
    return y + f.size


def _wrap(d, text, f, max_w):
    words, lines, cur = text.split(), [], ""
    for w in words:
        t = (cur + " " + w).strip()
        if d.textlength(t, font=f) <= max_w:
            cur = t
        else:
            lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def p_title(title):
    img = blank()
    d = ImageDraw.Draw(img)
    d.rectangle([70, 70, PAGE_W - 70, PAGE_H - 70], outline=GOLD, width=4)
    y = int(PAGE_H * 0.28)
    y = _center(d, y, SERIES, font(BODYB_F, 42), GOLD) + 60
    for ln in _wrap(d, title, font(TITLE_F, 120), PAGE_W - 260):
        y = _center(d, y, ln, font(TITLE_F, 120)) + 14
    _center(d, y + 60, "Written by Jamie Wigg", font(BODY_F, 40))
    return img


def p_copyright(title):
    img = blank()
    d = ImageDraw.Draw(img)
    lines = [title, "", f"Part of “{SERIES}.”", "",
             "Copyright © Jamie Wigg.", "All rights reserved.", "",
             "Created with the assistance of AI tools",
             "(illustrations and text), reviewed and", "edited by the author.",
             "", "First edition."]
    y = int(PAGE_H * 0.34)
    for ln in lines:
        y = _center(d, y, ln, font(BODY_F, 34)) + 16
    return img


def p_dedication():
    img = blank()
    d = ImageDraw.Draw(img)
    y = int(PAGE_H * 0.42)
    for ln in ["For all the little ones", "drifting off to sleep."]:
        y = _center(d, y, ln, font(TITLE_F, 64), INK) + 20
    return img


def p_the_end():
    img = blank()
    d = ImageDraw.Draw(img)
    _center(d, int(PAGE_H * 0.40), "The End", font(TITLE_F, 150), GOLD)
    _center(d, int(PAGE_H * 0.40) + 200, "Sweet dreams, little one.",
            font(BODY_F, 44))
    return img


def p_about():
    img = blank()
    d = ImageDraw.Draw(img)
    y = int(PAGE_H * 0.20)
    y = _center(d, y, "About the Series", font(TITLE_F, 84), GOLD) + 44
    body = ("Sonny's Cozy Quokka Bedtime Tales are gentle, rhythmic stories "
            "made to help little ones wind down and drift off to sleep. In "
            "every book, Sunny the little quokka meets a new Australian animal "
            "friend, shares a calm moment, and settles in for the night — "
            "ending, as always, with a peaceful goodnight. Perfect for nap "
            "time and bedtime with children ages 1–5.")
    for ln in _wrap(d, body, font(BODY_F, 40), PAGE_W - 220):
        y = _center(d, y, ln, font(BODY_F, 40)) + 14
    return img


def p_also(num):
    img = blank()
    d = ImageDraw.Draw(img)
    y = int(PAGE_H * 0.16)
    y = _center(d, y, "Also in this Series", font(TITLE_F, 76), GOLD) + 40
    for n in [x for x in sorted(pb24.NAMES) if x != num][:14]:
        y = _center(d, y, f"Sunny and {pb24.NAMES[n]}", font(BODY_F, 36)) + 12
    _center(d, PAGE_H - 220, "Look for all 35 cozy bedtime tales.",
            font(BODYB_F, 36), GOLD)
    return img


def story_page(art_path):
    page = blank()
    art = Image.open(art_path).convert("RGB")
    margin = 40
    scale = (PAGE_W - 2 * margin) / art.width
    w = PAGE_W - 2 * margin
    h = int(art.height * scale)
    page.paste(art.resize((w, h), Image.LANCZOS), (margin, (PAGE_H - h) // 2))
    return page


def build(num):
    slug, title = kle.book_meta(num)
    pages_dir = REPO / f"book{num}" / "redesign" / "pages"
    out_path = REPO / f"book{num}" / "redesign" / f"{slug}.epub"
    work = REPO / f"book{num}" / "redesign" / "epub-portrait-work"
    img_dir = work / "images"
    img_dir.mkdir(parents=True, exist_ok=True)

    imgs = []
    # 1 cover
    cov = Image.open(REPO / "kdp-covers" / f"book{num:02d}-kdp-cover.jpg").convert("RGB")
    if cov.size != (PAGE_W, PAGE_H):
        cov = cov.resize((PAGE_W, PAGE_H), Image.LANCZOS)
    imgs.append(cov)
    # 2-4 front matter
    imgs += [p_title(title), p_copyright(title), p_dedication()]
    # 5-21 story
    imgs += [story_page(p) for p in kle.find_pages(pages_dir, num)]
    # 22-24 back matter
    imgs += [p_the_end(), p_about(), p_also(num)]
    assert len(imgs) == 24, f"book{num}: {len(imgs)} pages"

    for i, im in enumerate(imgs, start=1):
        q = 90 if i == 1 else 88
        im.save(img_dir / f"page-{i:02d}.jpg", "JPEG", quality=q, optimize=True)

    book_id = f"urn:uuid:{uuid.uuid5(uuid.NAMESPACE_URL, f'sonnys-cozy-quokka-book-{num}-portrait24')}"
    items, spine = [], []
    for i in range(1, 25):
        props = ' properties="cover-image"' if i == 1 else ""
        items.append(f'    <item id="img{i:02d}" href="images/page-{i:02d}.jpg" '
                     f'media-type="image/jpeg"{props}/>')
        items.append(f'    <item id="page{i:02d}" href="text/page-{i:02d}.xhtml" '
                     f'media-type="application/xhtml+xml"/>')
        spine.append(f'    <itemref idref="page{i:02d}"/>')
    opf = OPF.format(book_id=book_id, title=title, author=AUTHOR, series=SERIES,
                     w=PAGE_W, h=PAGE_H, items="\n".join(items), spine="\n".join(spine))

    if out_path.exists():
        out_path.unlink()
    with zipfile.ZipFile(out_path, "w") as z:
        z.writestr("mimetype", "application/epub+zip", compress_type=zipfile.ZIP_STORED)
        z.writestr("META-INF/container.xml", kle.CONTAINER_XML)
        z.writestr("OEBPS/content.opf", opf)
        z.writestr("OEBPS/nav.xhtml", kle.NAV_XHTML.format(title=title))
        z.writestr("OEBPS/toc.ncx", kle.NCX.format(book_id=book_id, title=title))
        for i in range(1, 25):
            z.write(img_dir / f"page-{i:02d}.jpg", f"OEBPS/images/page-{i:02d}.jpg")
            z.writestr(f"OEBPS/text/page-{i:02d}.xhtml",
                       PAGE_XHTML.format(page=i, w=PAGE_W, h=PAGE_H))
    print(f"book{num:02d}: {out_path.name} ({out_path.stat().st_size // 1024}KB, 24pp portrait)")
    return out_path


def main():
    nums = [int(a) for a in sys.argv[1:]] or list(range(1, 36))
    for n in nums:
        build(n)


if __name__ == "__main__":
    main()
