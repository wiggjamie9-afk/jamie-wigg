# SETUP-EBOOK.md — book-style e-book pipeline (EPUB + print PDF)

Turns Markdown chapters into a real **`.epub`** and a print-ready **`.pdf`** — cover,
table of contents, chapter breaks, running headers, page numbers, hyphenation. Built on
tools that install cleanly in this environment; no cloud service required.

## The toolchain

| Role | Tool | Why |
|---|---|---|
| **Engine (required)** | **pandoc** | Universal converter; makes the EPUB and drives everything |
| **PDF (required)** | **weasyprint** | HTML+CSS → PDF via `pandoc --pdf-engine=weasyprint`; real CSS Paged Media |
| PDF render/verify | **pypdfium2** | Self-contained PDF→image for QA (no system deps) |
| _Optional upgrade_ | **Quarto** (`quarto-dev/quarto-cli`) | Native multi-format **book** projects, cross-refs |
| _Optional upgrade_ | **Typst** (`typst/typst`) | Design-forward PDFs: `pandoc --pdf-engine=typst` |

Why pandoc/weasyprint over Quarto/Typst *here*: Quarto and Typst ship as GitHub-release
binaries, and GitHub releases are **egress-blocked** in this sandbox. pandoc installs via
apt and weasyprint via pip — both work. On a machine with open egress, add Quarto/Typst
for nicer output; the pipeline is designed to swap engines without changing the source.

## Install

```bash
bash scripts/setup-ebook.sh      # idempotent: pandoc + weasyprint (+ optional hints)
```

The sandbox is **ephemeral** — binaries don't persist between sessions, so re-run this
when `pandoc` is missing. The book **source** (chapters, CSS, cover, build script) lives
in git and does persist. The compiled EPUB/PDF can be rebuilt in seconds, locally or in
CI.

## Use it

```bash
cp -r books/campfire-quickstart books/<your-slug>   # scaffold
#   …edit chapters/, metadata.yml, cover…
bash books/<your-slug>/build.sh                      # → _out/<slug>.epub + .pdf
```

Or just run the skill: **`/ebook`** (`.claude/skills/ebook/SKILL.md`) walks the whole
flow — scaffold, author, build, verify.

## Worked example (built & committed)

[`books/campfire-quickstart/`](books/campfire-quickstart/) — a 4-part sample compiled to
a valid EPUB3 (cover embedded, nav TOC, one XHTML per chapter) and an 11-page trade-
paperback PDF (5.5×8.5in) with running headers, page numbers, a styled table, code block,
blockquote, and footnote. Outputs are in its `_out/`.

## CI option (durable builds)

Because binaries are ephemeral here, wire a GitHub Action that runs `setup-ebook.sh` +
`build.sh` on push and uploads the EPUB/PDF as artifacts — that gives reproducible book
builds without depending on any one machine. Ask and I'll add the workflow.

## Notes / gotchas

- Keep `epub.css` conservative (e-readers = limited CSS); put `@page`, running headers,
  and page counters in `print.css` (weasyprint honors them fully).
- weasyprint prints harmless warnings for a couple of pandoc-injected CSS props — ignore.
- Covers: design as a 1600×2400 HTML file and rasterize with the pre-installed Chromium
  (`--screenshot`), no image API needed.
