#!/usr/bin/env python3
"""
Render the HTML creative mockups in clients/rhythmix/outputs/creatives/<YYYY-MM>/
to PNG files at native canvas dimensions.

Why this exists:
    The Node Playwright path (render-png.mjs) is the canonical renderer for desktops
    that have Chromium. This Python path is the no-browser fallback — uses WeasyPrint
    (HTML→PDF) + PyMuPDF (PDF→PNG). Visual fidelity is slightly lower (no Google Fonts
    if offline, less perfect CSS support) but it works in any sandbox.

Usage:
    pip install weasyprint pymupdf
    python3 clients/rhythmix/scripts/render-png.py 2026-05

For each .html file it:
    - parses the HTML, finds each `.canvas` element
    - reads the canvas size class (canvas-1080, canvas-1080-1350, canvas-1080-1920)
    - wraps each canvas in a standalone document with @page sized to match
    - renders that document to a single-page PDF, then to PNG via PyMuPDF
    - writes <slug>.png (single canvas) or <slug>-NN.png (carousel)
"""

import sys
import re
import os
from pathlib import Path
from html.parser import HTMLParser

# Patch fontTools before importing weasyprint — the OS/2 setUnicodeRanges
# validation rejects bit > 122 even though some fonts (especially emoji
# fallbacks) report bit 123+. Filter the offending bits silently so PDF
# generation can proceed.
from fontTools.ttLib.tables import O_S_2f_2
_original_set_uniranges = O_S_2f_2.table_O_S_2f_2.setUnicodeRanges


def _patched_set_uniranges(self, bits):
    return _original_set_uniranges(self, [b for b in bits if 0 <= b <= 122])


O_S_2f_2.table_O_S_2f_2.setUnicodeRanges = _patched_set_uniranges

from weasyprint import HTML
import fitz

CANVAS_SIZES = {
    'canvas-1080': (1080, 1080),
    'canvas-1080-1350': (1080, 1350),
    'canvas-1080-1920': (1080, 1920),
}

# Void HTML elements have no closing tag — never push them to the stack.
VOID_TAGS = {
    'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
    'link', 'meta', 'param', 'source', 'track', 'wbr',
}


class CanvasExtractor(HTMLParser):
    """Pull out top-level <div class="canvas ..."> blocks from a mockup HTML file."""

    def __init__(self):
        super().__init__()
        self.canvases = []  # list of (size_class, html_fragment)
        self._stack = []   # active <div> nesting
        self._buffer = None
        self._size_class = None

    def handle_starttag(self, tag, attrs):
        attrs_d = dict(attrs)
        if tag == 'div' and 'canvas' in attrs_d.get('class', '').split() and self._buffer is None:
            classes = attrs_d['class'].split()
            size_class = next((c for c in classes if c in CANVAS_SIZES), None)
            if size_class:
                self._size_class = size_class
                self._buffer = [self._format_tag(tag, attrs)]
                self._stack = [tag]
                return
        if self._buffer is not None:
            self._buffer.append(self._format_tag(tag, attrs))
            if tag not in VOID_TAGS:
                self._stack.append(tag)

    def handle_endtag(self, tag):
        if self._buffer is not None:
            if tag in VOID_TAGS:
                # Spurious end tag for a void element — ignore but emit.
                self._buffer.append(f'</{tag}>')
                return
            self._buffer.append(f'</{tag}>')
            if self._stack and self._stack[-1] == tag:
                self._stack.pop()
            if not self._stack:
                self.canvases.append((self._size_class, ''.join(self._buffer)))
                self._buffer = None
                self._size_class = None

    def handle_startendtag(self, tag, attrs):
        if self._buffer is not None:
            self._buffer.append(self._format_tag(tag, attrs, self_close=True))

    def handle_data(self, data):
        if self._buffer is not None:
            self._buffer.append(data)

    @staticmethod
    def _format_tag(tag, attrs, self_close=False):
        attr_str = ''.join(f' {k}="{v}"' for k, v in attrs)
        slash = '/' if self_close else ''
        return f'<{tag}{attr_str}{slash}>'


def extract_styles(html_text):
    """Pull <style> tags + the inline page-specific CSS from the original HTML."""
    style_blocks = re.findall(r'<style[^>]*>(.*?)</style>', html_text, re.DOTALL)
    return '\n'.join(style_blocks)


def render_canvas(canvas_html, size_class, page_styles, base_url, out_path):
    """Wrap a single canvas in a standalone HTML doc and render it to PNG."""
    width, height = CANVAS_SIZES[size_class]
    # Convert px to pt for @page (1px ~ 0.75pt in CSS, but WeasyPrint maps 1px = 1px when explicit).
    # Compensation: when Google Fonts can't load (offline render), DejaVu Sans
    # falls back which is ~15% wider than Space Grotesk. Scale hero numbers down
    # so big stats like "$14,800" still fit inside the canvas.
    standalone = f'''<!doctype html>
<html><head><meta charset="utf-8">
<link rel="stylesheet" href="brand.css">
<style>
@page {{ size: {width}px {height}px; margin: 0; }}
body {{ margin: 0; padding: 0; background: #08050d; }}
.slide-label {{ display: none; }}
.canvas {{ display: flex; }}
{page_styles}
/* Renderer-only overrides — compensate for system-font fallback width */
.hero-num {{ font-size: 220px !important; letter-spacing: -0.04em; }}
.canvas-1080-1350 .hero-num,
.canvas-1080-1920 .hero-num {{ font-size: 240px !important; }}
.close-h {{ font-size: 64px !important; }}
.cover-h {{ font-size: 56px !important; line-height: 1.05; }}
.headline {{ font-size: 50px !important; line-height: 1.1; }}
.math-now {{ font-size: 180px !important; }}
.amount {{ font-size: 140px !important; }}
.canvas {{ padding: 64px !important; }}
</style></head>
<body>{canvas_html}</body></html>'''

    # optimize_size=() disables font subsetting which trips a fontTools bug on newer Unicode ranges.
    pdf_bytes = HTML(string=standalone, base_url=str(base_url)).write_pdf(optimize_size=())
    doc = fitz.open(stream=pdf_bytes, filetype='pdf')
    if len(doc) == 0:
        return False
    # Use first page (canvas should fit on one page given the @page size).
    page = doc[0]
    # Compute scale so the output PNG is exactly width × height pixels.
    pdf_width_pt = page.rect.width
    scale = width / pdf_width_pt
    pix = page.get_pixmap(matrix=fitz.Matrix(scale, scale))
    pix.save(str(out_path))
    return True


def main(month):
    repo_root = Path(__file__).resolve().parents[3]
    creatives_dir = repo_root / 'clients' / 'rhythmix' / 'outputs' / 'creatives' / month
    if not creatives_dir.is_dir():
        print(f'No directory {creatives_dir}', file=sys.stderr)
        sys.exit(1)

    html_files = sorted(p for p in creatives_dir.glob('*.html'))
    if not html_files:
        print(f'No .html files in {creatives_dir}', file=sys.stderr)
        sys.exit(1)

    print(f'Rendering {len(html_files)} mockups in {creatives_dir}')

    for html_file in html_files:
        text = html_file.read_text()
        styles = extract_styles(text)
        extractor = CanvasExtractor()
        extractor.feed(text)
        canvases = extractor.canvases
        if not canvases:
            print(f'  ✗ {html_file.name}: no .canvas-* element found')
            continue
        slug = html_file.stem
        if len(canvases) == 1:
            size_class, canvas_html = canvases[0]
            out = creatives_dir / f'{slug}.png'
            ok = render_canvas(canvas_html, size_class, styles, creatives_dir, out)
            print(f"  {'✓' if ok else '✗'} {out.name} ({size_class})")
        else:
            for i, (size_class, canvas_html) in enumerate(canvases, start=1):
                out = creatives_dir / f'{slug}-{i:02d}.png'
                ok = render_canvas(canvas_html, size_class, styles, creatives_dir, out)
                print(f"  {'✓' if ok else '✗'} {out.name} ({size_class})")

    print('Done.')


if __name__ == '__main__':
    if len(sys.argv) != 2 or not re.match(r'^\d{4}-\d{2}$', sys.argv[1]):
        print('Usage: python3 render-png.py <YYYY-MM>', file=sys.stderr)
        sys.exit(1)
    main(sys.argv[1])
