---
name: ebook
description: >-
  Produce book-style e-books — EPUB and print-ready PDF — from Markdown chapters
  using pandoc (+ weasyprint for PDF). Use when the user wants to write, compile,
  or package a multi-chapter book, e-book, guide, or manual with a cover, table of
  contents, and chapter structure. Triggers on "ebook", "e-book", "EPUB", "make a
  book", "book PDF", "publish a book", "compile my manuscript".
---

# /ebook — Markdown → EPUB + print PDF

A repeatable book pipeline built on **pandoc** (universal engine, makes the EPUB) and
**weasyprint** (HTML/CSS → PDF via `--pdf-engine`). Optional upgrades: **Quarto**
(native multi-format book projects) and **Typst** (`--pdf-engine=typst`). The reference
implementation is [`books/campfire-quickstart/`](../../../books/campfire-quickstart/).

## First run: install the toolchain

```bash
bash scripts/setup-ebook.sh    # pandoc + weasyprint (idempotent)
```

The sandbox is ephemeral, so re-run this at the start of a session if `pandoc` is
missing. The **book source lives in git**; only the binaries need reinstalling.

## Scaffold a new book

Copy the sample's shape into `books/<slug>/`:

```
books/<slug>/
├── metadata.yml        # title, author, lang, rights, cover-image, identifier
├── chapters/           # 00-preface.md, 01-*.md, 02-*.md …  (one # H1 = one chapter)
├── epub.css            # e-reader stylesheet (conservative CSS subset)
├── print.css           # weasyprint: @page size, running headers, page numbers
├── cover.png           # 1600×2400 (2:3). Design as HTML, rasterize with Chromium
└── build.sh            # pandoc → EPUB + PDF into _out/
```

Fastest path: `cp -r books/campfire-quickstart books/<slug>`, then replace the
chapters, `metadata.yml`, and cover.

## Authoring rules

- **One `# H1` per chapter file.** `##`/`###` are sections. Build passes
  `--top-level-division=chapter` so each H1 starts a new chapter/page.
- Use `# Title {.unnumbered}` for preface/afterword.
- Enable footnotes with `--from markdown+footnotes` (already in `build.sh`).
- Keep `epub.css` conservative — e-readers support a limited CSS subset. Put the fancy
  layout (`@page`, running headers via `string-set`/`string()`, page counters) in
  `print.css`, which weasyprint honors fully.

## Build

```bash
bash books/<slug>/build.sh
# → books/<slug>/_out/<slug>.epub  and  <slug>.pdf
```

## Cover generation (no image tools needed)

Design the cover as a 1600×2400 HTML file, then rasterize with the bundled Chromium:

```bash
CHROME=/opt/pw-browsers/chromium-*/chrome-linux/chrome
"$CHROME" --headless --no-sandbox --hide-scrollbars --force-device-scale-factor=1 \
  --window-size=1600,2400 --screenshot=cover.png "file://$PWD/cover.html"
```

## Verify before declaring done

- **EPUB:** `unzip -l <slug>.epub` — confirm `mimetype` is first, `cover.png` embedded,
  `nav.xhtml` present, one `chNNN.xhtml` per chapter.
- **PDF:** render pages with `pypdfium2` (self-contained: `pip install pypdfium2`) and
  eyeball the title page, TOC, running headers, and page numbers. `poppler-utils` may be
  unavailable behind the apt mirror; pypdfium2 needs no system deps.

## Gotchas learned

- Google Fonts / GitHub release binaries are **egress-blocked** in the sandbox — use
  apt (pandoc) + pip (weasyprint, pypdfium2), which work; install Typst/Quarto only where
  egress is open.
- weasyprint warns on a couple of pandoc-injected props (`overflow-x`, `user-select`) —
  harmless, ignore.
- A stray `date:` can spill onto its own page in the print title block; hide it with
  `header#title-block-header .date{display:none}` if the year is on the cover.
