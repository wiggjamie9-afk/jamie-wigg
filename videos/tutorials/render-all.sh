#!/bin/bash

# AI Tutorial Video Renderer
# Renders all tutorial compositions to MP4 using HyperFrames
# Requirements: Node.js, FFmpeg

set -e

TUTORIALS=(
  "mathtutor-pro"
  "bookreader-pro"
  "languagelens"
)

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HYPERFRAMES_VERSION="0.4.42"

echo "╔════════════════════════════════════════╗"
echo "║  AI Tutorial Video Renderer            ║"
echo "║  HyperFrames Pipeline                  ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Check for FFmpeg
if ! command -v ffmpeg &> /dev/null; then
    echo "❌ FFmpeg not found. Install it first:"
    echo "   macOS:   brew install ffmpeg"
    echo "   Linux:   sudo apt-get install ffmpeg"
    echo "   Windows: Download from https://ffmpeg.org/download.html"
    exit 1
fi

echo "✅ FFmpeg found: $(ffmpeg -version | head -1)"
echo "✅ Node.js: $(node --version)"
echo ""

# Render each tutorial
for tutorial in "${TUTORIALS[@]}"; do
    echo "────────────────────────────────────────"
    echo "🎬 Rendering: $tutorial"
    echo "────────────────────────────────────────"

    if [ ! -d "$SCRIPT_DIR/$tutorial" ]; then
        echo "❌ Directory not found: $SCRIPT_DIR/$tutorial"
        continue
    fi

    cd "$SCRIPT_DIR/$tutorial"

    # Validate composition
    echo "🔍 Validating composition..."
    if ! npx --yes hyperframes@$HYPERFRAMES_VERSION lint 2>/dev/null; then
        echo "⚠️  Composition validation warning (non-fatal)"
    fi

    # Render to MP4
    echo "📹 Rendering to MP4..."
    if npx --yes hyperframes@$HYPERFRAMES_VERSION render 2>/dev/null; then
        if [ -f "${tutorial}.mp4" ]; then
            size=$(du -h "${tutorial}.mp4" | cut -f1)
            echo "✅ Rendered: ${tutorial}.mp4 ($size)"
        else
            echo "⚠️  Render completed but MP4 not found"
        fi
    else
        echo "❌ Render failed for $tutorial"
    fi

    echo ""
done

# Summary
echo "════════════════════════════════════════"
echo "🎉 Rendering complete!"
echo "════════════════════════════════════════"
echo ""
echo "📁 Output files:"

for tutorial in "${TUTORIALS[@]}"; do
    if [ -f "$SCRIPT_DIR/$tutorial/${tutorial}.mp4" ]; then
        size=$(du -h "$SCRIPT_DIR/$tutorial/${tutorial}.mp4" | cut -f1)
        echo "   ✅ $tutorial/${tutorial}.mp4 ($size)"
    else
        echo "   ❌ $tutorial/${tutorial}.mp4 (not found)"
    fi
done

echo ""
echo "💡 Next steps:"
echo "   1. Upload to YouTube: https://youtube.com/upload"
echo "   2. Share on social media"
echo "   3. Embed in landing pages"
echo ""
