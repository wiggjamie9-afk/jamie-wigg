# books/

Book-style e-book projects — Markdown chapters compiled to **EPUB + print PDF** by the
`/ebook` pipeline. See [`SETUP-EBOOK.md`](../SETUP-EBOOK.md) and the skill at
`.claude/skills/ebook/SKILL.md`.

## Quick start

```bash
bash scripts/setup-ebook.sh                 # once per session (pandoc + weasyprint)
bash books/campfire-quickstart/build.sh     # → _out/*.epub + *.pdf
```

New book: `cp -r books/campfire-quickstart books/<slug>`, swap the chapters / metadata /
cover, then run its `build.sh`.

## Projects

| Slug | What | Outputs |
|---|---|---|
| [`campfire-quickstart/`](campfire-quickstart/) | Reference sample — a 4-part field guide ("Learning to Code Without Burning Out"). Demonstrates the full pipeline. | EPUB3 + 11-page 5.5×8.5in PDF |

## Anatomy of a book folder

```
<slug>/
├── metadata.yml     # title, author, lang, rights, cover-image, identifier
├── chapters/*.md    # one # H1 per chapter (00-preface.md, 01-…)
├── epub.css         # e-reader stylesheet (conservative CSS)
├── print.css        # weasyprint @page / running headers / page numbers
├── cover.png        # 1600×2400 (2:3)
├── build.sh         # pandoc → EPUB + PDF
└── _out/            # built artifacts
```
