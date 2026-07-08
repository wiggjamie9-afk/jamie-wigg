#!/usr/bin/env python3
"""Build a Kindle-ready fixed-layout EPUB from a book's composed page PNGs.

Usage: python build_kindle_epub.py <num>
Reads book<num>/redesign/pages/BOOK-<num>-PAGE-01..17[-REDESIGN].png
Writes book<num>/redesign/<slug>.epub

Fixed-layout EPUB3, one full-bleed image per page — the format KDP expects
for illustrated children's picture books. Upload the .epub directly in the
KDP dashboard; KDP converts it for Kindle devices/app automatically.
"""
import pathlib
import sys
import uuid
import zipfile

from PIL import Image

REPO = pathlib.Path(__file__).parent
PAGE_W, PAGE_H = 1920, 1080
AUTHOR = "Jamie Wigg"
SERIES = "Sonny's Cozy Quokka Bedtime Tales"

BOOKS = {
    1: ("sunny-and-the-flying-fox", "Sunny and the Flying Fox"),
    2: ("sunny-and-the-sleepy-wombat", "Sunny and the Sleepy Wombat"),
    3: ("sunny-and-the-tawny-frogmouth", "Sunny and the Tawny Frogmouth"),
    4: ("sunny-and-the-sugar-glider", "Sunny and the Sugar Glider"),
    5: ("sunny-and-the-little-bilby", "Sunny and the Little Bilby"),
    6: ("sunny-and-the-kookaburra", "Sunny and the Kookaburra"),
    7: ("sunny-and-the-platypus", "Sunny and the Platypus"),
    8: ("sunny-and-the-sleepy-echidna", "Sunny and the Sleepy Echidna"),
    9: ("sunny-and-the-ringtail-possum", "Sunny and the Ringtail Possum"),
    10: ("sunny-and-the-little-penguin", "Sunny and the Little Penguin"),
    11: ("sunny-and-the-sleepy-koala", "Sunny and the Sleepy Koala"),
    12: ("sunny-and-the-boobook-owl", "Sunny and the Boobook Owl"),
    13: ("sunny-and-the-green-tree-frog", "Sunny and the Green Tree Frog"),
    14: ("sunny-and-the-pademelon", "Sunny and the Pademelon"),
}

NAV_XHTML = """<?xml version="1.0" encoding="UTF-8"?>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops">
<head><title>Navigation</title></head>
<body>
<nav epub:type="toc" id="toc">
<h1>{title}</h1>
<ol>
<li><a href="text/page-01.xhtml">Cover</a></li>
<li><a href="text/page-02.xhtml">Start Reading</a></li>
</ol>
</nav>
</body>
</html>
"""

NCX = """<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE ncx PUBLIC "-//NISO//DTD ncx 2005-1//EN" "http://www.daisy.org/z3986/2005/ncx-2005-1.dtd">
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
<head>
<meta name="dtb:uid" content="{book_id}"/>
<meta name="dtb:depth" content="1"/>
<meta name="dtb:totalPageCount" content="0"/>
<meta name="dtb:maxPageNumber" content="0"/>
</head>
<docTitle><text>{title}</text></docTitle>
<navMap>
<navPoint id="navpoint-1" playOrder="1">
<navLabel><text>Cover</text></navLabel>
<content src="text/page-01.xhtml"/>
</navPoint>
<navPoint id="navpoint-2" playOrder="2">
<navLabel><text>Start Reading</text></navLabel>
<content src="text/page-02.xhtml"/>
</navPoint>
</navMap>
</ncx>
"""

PAGE_XHTML = """<?xml version="1.0" encoding="UTF-8"?>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title>Page {page}</title>
<meta name="viewport" content="width={w}, height={h}"/>
<style>html,body{{margin:0;padding:0;background:#000}}
.page{{width:100%;height:100%}}
img{{width:100%;height:100%;object-fit:contain;display:block}}</style>
</head>
<body>
<div class="page"><img src="../images/page-{page:02d}.jpg" alt="Page {page}"/></div>
</body>
</html>
"""

CONTAINER_XML = """<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>
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
    <meta property="rendition:orientation">landscape</meta>
    <meta property="rendition:spread">none</meta>
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


def find_pages(pages_dir: pathlib.Path, num: int) -> list[pathlib.Path]:
    plain = sorted(p for p in pages_dir.glob(f"BOOK-{num}-PAGE-*.png")
                   if "-REDESIGN" not in p.name)
    pages = plain if plain else sorted(pages_dir.glob(f"BOOK-{num}-PAGE-*-REDESIGN.png"))
    if len(pages) != 17:
        raise RuntimeError(f"expected 17 pages, found {len(pages)} in {pages_dir}")
    return sorted(pages, key=lambda p: int(p.stem.split("-")[3]))


def build(num: int) -> pathlib.Path:
    slug, title = BOOKS[num]
    pages_dir = REPO / f"book{num}" / "redesign" / "pages"
    out_path = REPO / f"book{num}" / "redesign" / f"{slug}.epub"
    work = REPO / f"book{num}" / "redesign" / "epub-work"
    img_dir = work / "images"
    img_dir.mkdir(parents=True, exist_ok=True)

    pages = find_pages(pages_dir, num)
    for i, p in enumerate(pages, start=1):
        im = Image.open(p).convert("RGB")
        im.save(img_dir / f"page-{i:02d}.jpg", "JPEG", quality=88, optimize=True)

    book_id = f"urn:uuid:{uuid.uuid5(uuid.NAMESPACE_URL, f'sonnys-cozy-quokka-book-{num}')}"

    items, spine = [], []
    for i in range(1, 18):
        img_props = ' properties="cover-image"' if i == 1 else ""
        items.append(f'    <item id="img{i:02d}" href="images/page-{i:02d}.jpg" '
                     f'media-type="image/jpeg"{img_props}/>')
        items.append(f'    <item id="page{i:02d}" href="text/page-{i:02d}.xhtml" '
                     f'media-type="application/xhtml+xml"/>')
        spine.append(f'    <itemref idref="page{i:02d}"/>')

    opf = OPF.format(book_id=book_id, title=title, author=AUTHOR, series=SERIES,
                      items="\n".join(items), spine="\n".join(spine))

    if out_path.exists():
        out_path.unlink()
    with zipfile.ZipFile(out_path, "w") as z:
        z.writestr("mimetype", "application/epub+zip", compress_type=zipfile.ZIP_STORED)
        z.writestr("META-INF/container.xml", CONTAINER_XML)
        z.writestr("OEBPS/content.opf", opf)
        z.writestr("OEBPS/nav.xhtml", NAV_XHTML.format(title=title))
        z.writestr("OEBPS/toc.ncx", NCX.format(book_id=book_id, title=title))
        for i in range(1, 18):
            z.write(img_dir / f"page-{i:02d}.jpg", f"OEBPS/images/page-{i:02d}.jpg")
            z.writestr(f"OEBPS/text/page-{i:02d}.xhtml",
                       PAGE_XHTML.format(page=i, w=PAGE_W, h=PAGE_H))

    print(f"✅ {out_path} ({out_path.stat().st_size // 1024}KB)")
    return out_path


if __name__ == "__main__":
    nums = [int(a) for a in sys.argv[1:]] or list(BOOKS)
    for n in nums:
        build(n)
