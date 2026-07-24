#!/usr/bin/env python3
"""Rebuild every book's Kindle EPUB in PORTRAIT orientation.

The story art is landscape (1920x1080); Kindle children's eBooks read best
in portrait on phones. This composes each landscape illustration onto a
portrait 1600x2560 cream page, uses the real portrait cover as page 1, and
writes a fixed-layout EPUB3 locked to portrait.

Usage: python build_kindle_epub_portrait.py [num ...]   (default: all 35)
Overwrites book<num>/redesign/<slug>.epub
"""
import importlib.util
import pathlib
import sys
import uuid
import zipfile

from PIL import Image

REPO = pathlib.Path(__file__).parent
PAGE_W, PAGE_H = 1600, 2560          # portrait page (matches the cover)
PAPER = (246, 239, 224)              # #f6efe0 cream
AUTHOR = "Jamie Wigg"
SERIES = "Sonny's Cozy Quokka Bedtime Tales"

# reuse the title/slug lookup + page finder from the landscape builder
_spec = importlib.util.spec_from_file_location("kle", REPO / "build_kindle_epub.py")
kle = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(kle)

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


def portrait_page(art: Image.Image) -> Image.Image:
    page = Image.new("RGB", (PAGE_W, PAGE_H), PAPER)
    margin = 40
    scale = (PAGE_W - 2 * margin) / art.width
    w = PAGE_W - 2 * margin
    h = int(art.height * scale)
    page.paste(art.resize((w, h), Image.LANCZOS), (margin, (PAGE_H - h) // 2))
    return page


def cover_page() -> Image.Image:
    return Image.new("RGB", (PAGE_W, PAGE_H), PAPER)


def build(num: int) -> pathlib.Path:
    slug, title = kle.book_meta(num)
    pages_dir = REPO / f"book{num}" / "redesign" / "pages"
    out_path = REPO / f"book{num}" / "redesign" / f"{slug}.epub"
    work = REPO / f"book{num}" / "redesign" / "epub-portrait-work"
    img_dir = work / "images"
    img_dir.mkdir(parents=True, exist_ok=True)

    # page 1 = real portrait cover (already 1600x2560)
    cover_src = REPO / "kdp-covers" / f"book{num:02d}-kdp-cover.jpg"
    cov = Image.open(cover_src).convert("RGB")
    if cov.size != (PAGE_W, PAGE_H):
        cov = cov.resize((PAGE_W, PAGE_H), Image.LANCZOS)
    cov.save(img_dir / "page-01.jpg", "JPEG", quality=90, optimize=True)

    # pages 2..18 = the 17 story spreads, on portrait cream
    story = kle.find_pages(pages_dir, num)
    for i, p in enumerate(story, start=2):
        art = Image.open(p).convert("RGB")
        portrait_page(art).save(img_dir / f"page-{i:02d}.jpg",
                                "JPEG", quality=88, optimize=True)

    n_pages = 1 + len(story)            # 18
    book_id = f"urn:uuid:{uuid.uuid5(uuid.NAMESPACE_URL, f'sonnys-cozy-quokka-book-{num}-portrait')}"

    items, spine = [], []
    for i in range(1, n_pages + 1):
        props = ' properties="cover-image"' if i == 1 else ""
        items.append(f'    <item id="img{i:02d}" href="images/page-{i:02d}.jpg" '
                     f'media-type="image/jpeg"{props}/>')
        items.append(f'    <item id="page{i:02d}" href="text/page-{i:02d}.xhtml" '
                     f'media-type="application/xhtml+xml"/>')
        spine.append(f'    <itemref idref="page{i:02d}"/>')

    opf = OPF.format(book_id=book_id, title=title, author=AUTHOR, series=SERIES,
                     w=PAGE_W, h=PAGE_H,
                     items="\n".join(items), spine="\n".join(spine))

    if out_path.exists():
        out_path.unlink()
    with zipfile.ZipFile(out_path, "w") as z:
        z.writestr("mimetype", "application/epub+zip", compress_type=zipfile.ZIP_STORED)
        z.writestr("META-INF/container.xml", kle.CONTAINER_XML)
        z.writestr("OEBPS/content.opf", opf)
        z.writestr("OEBPS/nav.xhtml", kle.NAV_XHTML.format(title=title))
        z.writestr("OEBPS/toc.ncx", kle.NCX.format(book_id=book_id, title=title))
        for i in range(1, n_pages + 1):
            z.write(img_dir / f"page-{i:02d}.jpg", f"OEBPS/images/page-{i:02d}.jpg")
            z.writestr(f"OEBPS/text/page-{i:02d}.xhtml",
                       PAGE_XHTML.format(page=i, w=PAGE_W, h=PAGE_H))

    print(f"book{num:02d}: {out_path.name} ({out_path.stat().st_size // 1024}KB, {n_pages}pp portrait)")
    return out_path


def main() -> None:
    nums = [int(a) for a in sys.argv[1:]] or list(range(1, 36))
    for n in nums:
        build(n)


if __name__ == "__main__":
    main()
