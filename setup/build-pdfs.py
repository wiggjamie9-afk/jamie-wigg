#!/usr/bin/env python3
"""Convert all digital-product markdown files to PDFs ready for Gumroad upload."""
from pathlib import Path
import markdown
from weasyprint import HTML, CSS

REPO = Path(__file__).resolve().parent.parent
SRC = REPO / "digital-products"
OUT = SRC / "pdfs"
OUT.mkdir(exist_ok=True)

CSS_TEXT = """
@page { size: Letter; margin: 0.75in; }
body { font-family: -apple-system, "Segoe UI", "Helvetica Neue", Arial, sans-serif; font-size: 11pt; line-height: 1.5; color: #111; }
h1 { font-size: 24pt; margin-top: 0.4em; margin-bottom: 0.3em; border-bottom: 2px solid #111; padding-bottom: 6px; }
h2 { font-size: 16pt; margin-top: 1.2em; margin-bottom: 0.3em; color: #222; }
h3 { font-size: 13pt; margin-top: 1em; color: #333; }
p, li { margin: 0.4em 0; }
ul, ol { margin: 0.4em 0 0.4em 1.2em; padding-left: 0.6em; }
strong { color: #000; }
em { color: #444; }
code { background: #f4f4f4; padding: 1px 5px; border-radius: 3px; font-size: 10pt; font-family: ui-monospace, "SF Mono", Menlo, monospace; }
pre { background: #f4f4f4; padding: 10px 12px; border-radius: 4px; font-size: 9.5pt; line-height: 1.4; overflow-wrap: break-word; white-space: pre-wrap; }
blockquote { border-left: 3px solid #aaa; margin: 0.6em 0; padding: 0.2em 0 0.2em 1em; color: #444; font-style: italic; }
table { border-collapse: collapse; margin: 0.6em 0; font-size: 10pt; }
th, td { border: 1px solid #ccc; padding: 5px 8px; text-align: left; }
th { background: #f0f0f0; }
hr { border: none; border-top: 1px solid #ccc; margin: 1.2em 0; }
.footer { text-align: center; color: #888; font-size: 9pt; margin-top: 3em; }
"""

FOOTER_HTML = (
    '<div class="footer">© 2026 Jamie Wigg &middot; '
    'For personal use of the buyer &middot; '
    'wiggjamie.gumroad.com</div>'
)

PRODUCTS = [
    "01-30-day-launch-plan.md",
    "02-ai-prompt-pack.md",
    "03-notion-side-hustle-os.md",
    "04-email-templates.md",
]

md = markdown.Markdown(extensions=["extra", "sane_lists", "tables"])

for fname in PRODUCTS:
    md_path = SRC / fname
    if not md_path.exists():
        print(f"skip (missing): {fname}")
        continue
    body = md.convert(md_path.read_text())
    md.reset()
    html = (
        '<!doctype html><html><head><meta charset="utf-8"></head>'
        f"<body>{body}{FOOTER_HTML}</body></html>"
    )
    out_path = OUT / fname.replace(".md", ".pdf")
    HTML(string=html).write_pdf(str(out_path), stylesheets=[CSS(string=CSS_TEXT)])
    size_kb = out_path.stat().st_size // 1024
    print(f"ok: {out_path.name} ({size_kb} KB)")

print(f"\nAll PDFs in: {OUT}")
