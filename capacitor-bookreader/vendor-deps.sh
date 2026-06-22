#!/bin/bash

# Vendor CDN dependencies locally for offline + App Store compliance
# Run this ONCE on your Mac before building BookReader Pro
# Usage: bash vendor-deps.sh

set -e

echo "📦 Vendoring BookReader Pro dependencies..."

# Create directories
mkdir -p www/lib www/fonts

# Download tesseract.js (OCR engine)
echo "⬇️  Downloading tesseract.js..."
curl -fsSL https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js -o www/lib/tesseract.min.js
echo "✓ tesseract.js"

# Download OpenDyslexic font (accessibility)
echo "⬇️  Downloading OpenDyslexic font..."
curl -fsSL https://cdn.jsdelivr.net/npm/open-dyslexic@1.0.3/woff/OpenDyslexic-Regular.woff -o www/fonts/OpenDyslexic-Regular.woff
echo "✓ OpenDyslexic-Regular.woff"

# Update index.html to use local copies
echo "🔄 Updating index.html to reference local copies..."
sed -i '' \
  -e 's|https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js|lib/tesseract.min.js|g' \
  -e "s|url('https://cdn.jsdelivr.net/npm/open-dyslexic@1.0.3/woff/OpenDyslexic-Regular.woff')|url('fonts/OpenDyslexic-Regular.woff')|g" \
  www/index.html
echo "✓ index.html"

echo "✅ Dependencies vendored! BookReader Pro is now fully offline."
echo ""
echo "Next: cd capacitor-bookreader && npm install && npx cap sync android"
