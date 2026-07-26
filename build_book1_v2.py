#!/usr/bin/env python3
"""Assemble the redesigned Book 1 — full-bleed watercolour, 24 pages.

Pages: 1 front cover (official), 2 title, 3-22 story, 23 The End, 24 back cover.
Each generated illustration (1696x2528) gets its caption laid over a soft
translucent panel. Outputs a full-bleed portrait PDF + a 24-page Kindle EPUB.
"""
import json
import pathlib
import uuid
import zipfile

from PIL import Image, ImageDraw, ImageFont

REPO = pathlib.Path(__file__).parent
ART = REPO / "book1" / "redesign" / "art-v2"
FONTS = REPO / ".claude" / "skills" / "canvas-design" / "canvas-fonts"
OUT = REPO / "book1" / "redesign"
W, H = 1696, 2528
SERIES = "Sonny's Cozy Quokka Bedtime Tales"
TITLE = "Sunny and the Flying Fox"

TITLE_F = FONTS / "Gloock-Regular.ttf"
BODY_F = FONTS / "WorkSans-Regular.ttf"
BODYB_F = FONTS / "WorkSans-Bold.ttf"

spec = json.loads((OUT / "book1-v2-extended.json").read_text())
STORY = {p["n"]: p["text"] for p in spec["pages"]}


def font(p, s):
    return ImageFont.truetype(str(p), s)


def load(name):
    return Image.open(ART / name).convert("RGB").resize((W, H), Image.LANCZOS)


def wrap(draw, text, f, maxw):
    out = []
    for para in text.split("\n"):
        words, cur = para.split(), ""
        for w in words:
            t = (cur + " " + w).strip()
            if draw.textlength(t, font=f) <= maxw:
                cur = t
            else:
                out.append(cur); cur = w
        out.append(cur)
    return out


def caption(img, text, size=64, pos="bottom"):
    """Lay text over a soft translucent cream panel."""
    d = ImageDraw.Draw(img, "RGBA")
    f = font(BODY_F, size)
    maxw = W - 320
    lines = wrap(d, text, f, maxw)
    lh = int(size * 1.34)
    block = lh * len(lines)
    pad = 54
    panel_h = block + pad * 2
    if pos == "bottom":
        y0 = H - panel_h - 90
    elif pos == "top":
        y0 = 120
    else:  # middle
        y0 = (H - panel_h) // 2
    d.rounded_rectangle([120, y0, W - 120, y0 + panel_h], radius=44,
                        fill=(250, 247, 238, 220))
    y = y0 + pad
    for ln in lines:
        w = d.textlength(ln, font=f)
        d.text(((W - w) / 2, y), ln, font=f, fill=(60, 48, 78))
        y += lh
    return img


def title_overlay(img):
    d = ImageDraw.Draw(img, "RGBA")
    tf = font(TITLE_F, 118)
    maxw = W - 300
    lines = wrap(d, TITLE, tf, maxw)
    kf = font(BODYB_F, 44)
    lh = int(118 * 1.05)
    block = lh * len(lines) + 90
    y0 = 150
    d.rounded_rectangle([110, y0, W - 110, y0 + block + 90], radius=40,
                        fill=(250, 247, 238, 225))
    y = y0 + 46
    w = d.textlength(SERIES, font=kf)
    d.text(((W - w) / 2, y), SERIES, font=kf, fill=(176, 132, 55)); y += 78
    for ln in lines:
        w = d.textlength(ln, font=tf)
        d.text(((W - w) / 2, y), ln, font=tf, fill=(60, 48, 78)); y += lh
    return img


def build_pages():
    pages = []
    # 1 front cover (official portrait, already has title)
    cov = Image.open(OUT / "art" / "cover-official-portrait.png").convert("RGB")
    pages.append(cov.resize((W, H), Image.LANCZOS))
    # 2 title
    pages.append(title_overlay(load("page-02.png")))
    # 3-22 story
    for n in range(3, 23):
        pages.append(caption(load(f"page-{n:02d}.png"), STORY[n]))
    # 23 The End
    pages.append(caption(load("page-23.png"), spec["the_end_text"], size=72))
    # 24 back cover (blurb in upper calm sky)
    pages.append(caption(load("page-24.png"), spec["back_cover_blurb"],
                         size=52, pos="top"))
    return pages


PAGE_XHTML = """<?xml version="1.0" encoding="UTF-8"?>
<html xmlns="http://www.w3.org/1999/xhtml"><head><title>Page {p}</title>
<meta name="viewport" content="width={w}, height={h}"/>
<style>html,body{{margin:0;padding:0;width:{w}px;height:{h}px;background:#f6efe0}}
img{{width:{w}px;height:{h}px;display:block}}</style></head>
<body><img src="../images/page-{p:02d}.jpg" alt="Page {p}"/></body></html>"""

CONTAINER = """<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
<rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles></container>"""

NAV = """<?xml version="1.0" encoding="UTF-8"?>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops">
<head><title>Navigation</title></head><body><nav epub:type="toc" id="toc"><h1>{t}</h1>
<ol><li><a href="text/page-01.xhtml">Cover</a></li><li><a href="text/page-03.xhtml">Start Reading</a></li></ol></nav></body></html>"""

NCX = """<?xml version="1.0" encoding="UTF-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1"><head>
<meta name="dtb:uid" content="{id}"/><meta name="dtb:depth" content="1"/>
<meta name="dtb:totalPageCount" content="0"/><meta name="dtb:maxPageNumber" content="0"/></head>
<docTitle><text>{t}</text></docTitle><navMap>
<navPoint id="n1" playOrder="1"><navLabel><text>Cover</text></navLabel><content src="text/page-01.xhtml"/></navPoint>
<navPoint id="n2" playOrder="2"><navLabel><text>Start Reading</text></navLabel><content src="text/page-03.xhtml"/></navPoint></navMap></ncx>"""

OPF = """<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="BookId" xml:lang="en">
<metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
<dc:identifier id="BookId">{id}</dc:identifier><dc:title>{t}</dc:title>
<dc:creator>Jamie Wigg</dc:creator><dc:language>en</dc:language><dc:publisher>{s}</dc:publisher>
<meta property="dcterms:modified">2026-01-01T00:00:00Z</meta>
<meta property="rendition:layout">pre-paginated</meta>
<meta property="rendition:orientation">portrait</meta>
<meta property="rendition:spread">none</meta>
<meta name="fixed-layout" content="true"/><meta name="orientation-lock" content="portrait"/>
<meta name="book-type" content="children"/><meta name="cover" content="img01"/></metadata>
<manifest><item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>
<item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
{items}</manifest><spine toc="ncx">{spine}</spine></package>"""


def main():
    pages = build_pages()
    assert len(pages) == 24, len(pages)

    pdf = OUT / "sunny-and-the-flying-fox-v2-illustrated.pdf"
    pages[0].save(pdf, "PDF", resolution=300.0, save_all=True, append_images=pages[1:])
    print(f"PDF: {pdf.name} ({pdf.stat().st_size//1024//1024}MB, 24pp)")

    work = OUT / "epub-v2-work" / "images"
    work.mkdir(parents=True, exist_ok=True)
    for i, im in enumerate(pages, 1):
        im.save(work / f"page-{i:02d}.jpg", "JPEG", quality=88, optimize=True)
    bid = f"urn:uuid:{uuid.uuid5(uuid.NAMESPACE_URL, 'sunny-flying-fox-v2')}"
    items, spine = [], []
    for i in range(1, 25):
        pr = ' properties="cover-image"' if i == 1 else ""
        items.append(f'<item id="img{i:02d}" href="images/page-{i:02d}.jpg" media-type="image/jpeg"{pr}/>')
        items.append(f'<item id="page{i:02d}" href="text/page-{i:02d}.xhtml" media-type="application/xhtml+xml"/>')
        spine.append(f'<itemref idref="page{i:02d}"/>')
    epub = OUT / "sunny-and-the-flying-fox-v2-illustrated.epub"
    if epub.exists():
        epub.unlink()
    with zipfile.ZipFile(epub, "w") as z:
        z.writestr("mimetype", "application/epub+zip", compress_type=zipfile.ZIP_STORED)
        z.writestr("META-INF/container.xml", CONTAINER)
        z.writestr("OEBPS/content.opf", OPF.format(id=bid, t=TITLE, s=SERIES,
                   items="\n".join(items), spine="\n".join(spine)))
        z.writestr("OEBPS/nav.xhtml", NAV.format(t=TITLE))
        z.writestr("OEBPS/toc.ncx", NCX.format(id=bid, t=TITLE))
        for i in range(1, 25):
            z.write(work / f"page-{i:02d}.jpg", f"OEBPS/images/page-{i:02d}.jpg")
            z.writestr(f"OEBPS/text/page-{i:02d}.xhtml", PAGE_XHTML.format(p=i, w=W, h=H))
    print(f"EPUB: {epub.name} ({epub.stat().st_size//1024//1024}MB, 24pp)")


if __name__ == "__main__":
    main()
