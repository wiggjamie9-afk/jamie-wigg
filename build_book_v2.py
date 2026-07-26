#!/usr/bin/env python3
"""Assemble any redesigned book — full-bleed watercolour, 24 pages.

Usage: python build_book_v2.py <num>
Reads book<num>/redesign/book<num>-v2-extended.json (title, pages[3..22] text,
the_end_text, back_cover_blurb) and book<num>/redesign/art-v2/page-02..24.png.
Front cover = kdp-covers/book<NN>-kdp-cover.jpg.
Outputs book<num>/redesign/<slug>-v2-illustrated.{pdf,epub}.
"""
import json
import pathlib
import sys
import uuid
import zipfile

from PIL import Image, ImageDraw, ImageFont

REPO = pathlib.Path(__file__).parent
FONTS = REPO / ".claude" / "skills" / "canvas-design" / "canvas-fonts"
W, H = 1696, 2528
SERIES = "Sonny's Cozy Quokka Bedtime Tales"
TITLE_F = FONTS / "Gloock-Regular.ttf"
BODY_F = FONTS / "WorkSans-Regular.ttf"
BODYB_F = FONTS / "WorkSans-Bold.ttf"


def font(p, s):
    return ImageFont.truetype(str(p), s)


def wrap(d, text, f, maxw):
    out = []
    for para in text.split("\n"):
        words, cur = para.split(), ""
        for w in words:
            t = (cur + " " + w).strip()
            if d.textlength(t, font=f) <= maxw:
                cur = t
            else:
                out.append(cur); cur = w
        out.append(cur)
    return out


def caption(img, text, size=64, pos="bottom"):
    d = ImageDraw.Draw(img, "RGBA")
    f = font(BODY_F, size)
    lines = wrap(d, text, f, W - 320)
    lh = int(size * 1.34)
    panel_h = lh * len(lines) + 108
    y0 = {"bottom": H - panel_h - 90, "top": 120,
          "middle": (H - panel_h) // 2}[pos]
    d.rounded_rectangle([120, y0, W - 120, y0 + panel_h], radius=44,
                        fill=(250, 247, 238, 220))
    y = y0 + 54
    for ln in lines:
        w = d.textlength(ln, font=f)
        d.text(((W - w) / 2, y), ln, font=f, fill=(60, 48, 78))
        y += lh
    return img


def title_overlay(img, title):
    d = ImageDraw.Draw(img, "RGBA")
    tf = font(TITLE_F, 118)
    lines = wrap(d, title, tf, W - 300)
    while len(lines) > 2 and tf.size > 78:
        tf = font(TITLE_F, tf.size - 8); lines = wrap(d, title, tf, W - 300)
    kf = font(BODYB_F, 44)
    lh = int(tf.size * 1.05)
    block = lh * len(lines) + 92
    y0 = 150
    d.rounded_rectangle([110, y0, W - 110, y0 + block + 78], radius=40,
                        fill=(250, 247, 238, 225))
    y = y0 + 46
    w = d.textlength(SERIES, font=kf)
    d.text(((W - w) / 2, y), SERIES, font=kf, fill=(176, 132, 55)); y += 78
    for ln in lines:
        w = d.textlength(ln, font=tf)
        d.text(((W - w) / 2, y), ln, font=tf, fill=(60, 48, 78)); y += lh
    return img


def build(num):
    d = REPO / f"book{num}" / "redesign"
    art = d / "art-v2"
    spec = json.loads((d / f"book{num}-v2-extended.json").read_text())
    title = spec["title"]
    slug = spec.get("slug") or "-".join(title.lower().replace("'", "").split())
    story = {p["n"]: p["text"] for p in spec["pages"]}

    def load(name):
        return Image.open(art / name).convert("RGB").resize((W, H), Image.LANCZOS)

    pages = []
    cov = Image.open(REPO / "kdp-covers" / f"book{int(num):02d}-kdp-cover.jpg").convert("RGB")
    pages.append(cov.resize((W, H), Image.LANCZOS))
    pages.append(title_overlay(load("page-02.png"), title))
    for n in range(3, 23):
        pages.append(caption(load(f"page-{n:02d}.png"), story[n]))
    pages.append(caption(load("page-23.png"), spec["the_end_text"], size=72))
    pages.append(caption(load("page-24.png"), spec["back_cover_blurb"], size=52, pos="top"))
    assert len(pages) == 24, len(pages)

    pdf = d / f"{slug}-v2-illustrated.pdf"
    pages[0].save(pdf, "PDF", resolution=300.0, save_all=True, append_images=pages[1:])

    work = d / "epub-v2-work" / "images"
    work.mkdir(parents=True, exist_ok=True)
    for i, im in enumerate(pages, 1):
        im.save(work / f"page-{i:02d}.jpg", "JPEG", quality=88, optimize=True)
    bid = f"urn:uuid:{uuid.uuid5(uuid.NAMESPACE_URL, f'sunny-v2-{num}')}"
    items, spine = [], []
    for i in range(1, 25):
        pr = ' properties="cover-image"' if i == 1 else ""
        items.append(f'<item id="img{i:02d}" href="images/page-{i:02d}.jpg" media-type="image/jpeg"{pr}/>')
        items.append(f'<item id="page{i:02d}" href="text/page-{i:02d}.xhtml" media-type="application/xhtml+xml"/>')
        spine.append(f'<itemref idref="page{i:02d}"/>')
    epub = d / f"{slug}-v2-illustrated.epub"
    if epub.exists():
        epub.unlink()
    px = ('<?xml version="1.0" encoding="UTF-8"?>\n<html xmlns="http://www.w3.org/1999/xhtml">'
          '<head><title>{p}</title><meta name="viewport" content="width=%d, height=%d"/>'
          '<style>html,body{{margin:0;padding:0;width:%dpx;height:%dpx;background:#f6efe0}}'
          'img{{width:%dpx;height:%dpx;display:block}}</style></head>'
          '<body><img src="../images/page-{p:02d}.jpg" alt="p{p}"/></body></html>' % (W, H, W, H, W, H))
    opf = ('<?xml version="1.0" encoding="UTF-8"?>\n<package xmlns="http://www.idpf.org/2007/opf" '
           'version="3.0" unique-identifier="BookId" xml:lang="en"><metadata '
           'xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:identifier id="BookId">%s</dc:identifier>'
           '<dc:title>%s</dc:title><dc:creator>Jamie Wigg</dc:creator><dc:language>en</dc:language>'
           '<dc:publisher>%s</dc:publisher><meta property="dcterms:modified">2026-01-01T00:00:00Z</meta>'
           '<meta property="rendition:layout">pre-paginated</meta>'
           '<meta property="rendition:orientation">portrait</meta>'
           '<meta property="rendition:spread">none</meta><meta name="fixed-layout" content="true"/>'
           '<meta name="orientation-lock" content="portrait"/><meta name="book-type" content="children"/>'
           '<meta name="cover" content="img01"/></metadata><manifest>'
           '<item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>'
           '<item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>%s</manifest>'
           '<spine toc="ncx">%s</spine></package>' % (bid, title, SERIES, "\n".join(items), "\n".join(spine)))
    nav = ('<?xml version="1.0" encoding="UTF-8"?>\n<html xmlns="http://www.w3.org/1999/xhtml" '
           'xmlns:epub="http://www.idpf.org/2007/ops"><head><title>Nav</title></head><body>'
           '<nav epub:type="toc" id="toc"><h1>%s</h1><ol>'
           '<li><a href="text/page-01.xhtml">Cover</a></li>'
           '<li><a href="text/page-03.xhtml">Start</a></li></ol></nav></body></html>' % title)
    ncx = ('<?xml version="1.0" encoding="UTF-8"?>\n<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" '
           'version="2005-1"><head><meta name="dtb:uid" content="%s"/><meta name="dtb:depth" content="1"/>'
           '<meta name="dtb:totalPageCount" content="0"/><meta name="dtb:maxPageNumber" content="0"/></head>'
           '<docTitle><text>%s</text></docTitle><navMap>'
           '<navPoint id="n1" playOrder="1"><navLabel><text>Cover</text></navLabel>'
           '<content src="text/page-01.xhtml"/></navPoint></navMap></ncx>' % (bid, title))
    with zipfile.ZipFile(epub, "w") as z:
        z.writestr("mimetype", "application/epub+zip", compress_type=zipfile.ZIP_STORED)
        z.writestr("META-INF/container.xml",
                   '<?xml version="1.0" encoding="UTF-8"?>\n<container version="1.0" '
                   'xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles>'
                   '<rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>'
                   '</rootfiles></container>')
        z.writestr("OEBPS/content.opf", opf)
        z.writestr("OEBPS/nav.xhtml", nav)
        z.writestr("OEBPS/toc.ncx", ncx)
        for i in range(1, 25):
            z.write(work / f"page-{i:02d}.jpg", f"OEBPS/images/page-{i:02d}.jpg")
            z.writestr(f"OEBPS/text/page-{i:02d}.xhtml", px.format(p=i))
    print(f"book{num}: {pdf.name} ({pdf.stat().st_size//1024//1024}MB) + {epub.name} ({epub.stat().st_size//1024//1024}MB)")


if __name__ == "__main__":
    build(sys.argv[1])
