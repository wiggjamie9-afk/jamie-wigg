#!/usr/bin/env bash
# Build this book to EPUB + print PDF with pandoc (+ weasyprint for PDF).
# Run: bash books/campfire-quickstart/build.sh   (needs scripts/setup-ebook.sh first)
set -euo pipefail
cd "$(dirname "$0")"

command -v pandoc >/dev/null || { echo "!! pandoc not found — run: bash ../../scripts/setup-ebook.sh"; exit 1; }

TITLE="The Campfire Quickstart"
SLUG="campfire-quickstart"
OUT="_out"; mkdir -p "$OUT"
CHAPTERS=(chapters/*.md)

COMMON=(--from markdown+footnotes --toc --toc-depth=2 --top-level-division=chapter)

echo "» building EPUB…"
pandoc metadata.yml "${CHAPTERS[@]}" "${COMMON[@]}" \
  --to epub3 \
  --css epub.css \
  --resource-path ".:chapters" \
  -o "$OUT/$SLUG.epub"
echo "  ✓ $OUT/$SLUG.epub"

if python3 -c "import weasyprint" 2>/dev/null; then
  echo "» building PDF (weasyprint)…"
  pandoc metadata.yml "${CHAPTERS[@]}" "${COMMON[@]}" \
    --to html5 --standalone \
    --metadata title="$TITLE" \
    --css print.css \
    --pdf-engine=weasyprint \
    -o "$OUT/$SLUG.pdf"
  echo "  ✓ $OUT/$SLUG.pdf"
else
  echo "  ⚠ weasyprint not installed — skipping PDF. Run scripts/setup-ebook.sh for PDF output."
fi

echo; echo "Done:"; ls -la "$OUT"
