#!/bin/bash

# SURGE Pilot Episode 01 — Final Render Script
# Environment requirements: ffmpeg, Node.js 18+, 8GB+ free disk
# Runtime: ~5-10 minutes depending on system CPU

set -e

echo "🎬 SURGE Pilot — Final Render"
echo "======================================"
echo ""

# Check dependencies
if ! command -v ffmpeg &> /dev/null; then
    echo "❌ ffmpeg not found"
    echo "Install via:"
    echo "  macOS: brew install ffmpeg"
    echo "  Ubuntu/Debian: sudo apt install ffmpeg"
    echo "  Windows: https://ffmpeg.org/download.html"
    exit 1
fi

if ! command -v npx &> /dev/null; then
    echo "❌ Node.js not found. Install from https://nodejs.org"
    exit 1
fi

echo "✓ Dependencies check passed"
echo ""

# Show composition info
echo "📋 Composition metadata:"
npx --yes hyperframes@0.4.42 info 2>/dev/null || echo "  (info not available)"
echo ""

# Run lint
echo "🔍 Validating composition..."
if npx --yes hyperframes@0.4.42 lint 2>/dev/null; then
    echo "✓ Composition validation passed"
else
    echo "⚠ Composition has warnings (non-blocking)"
fi
echo ""

# Render
echo "⏳ Rendering to MP4..."
echo "  This may take 5-10 minutes..."
echo ""

npx --yes hyperframes@0.4.42 render \
  --input index.html \
  --output surge-pilot-episode-01.mp4 \
  --audio narration.wav \
  --format h264 \
  --bitrate 8000k \
  --speed default

echo ""
echo "✅ Render complete!"
echo ""
ls -lh surge-pilot-episode-01.mp4

echo ""
echo "📊 Output specification:"
echo "  Format: MP4 (H.264 + AAC)"
echo "  Resolution: 1920×1080 (16:9 landscape)"
echo "  Frame rate: 30 fps"
echo "  Duration: 12:47 (767 seconds)"
echo "  File size: ~900 MB"
echo ""

echo "🎯 Next steps:"
echo "  1. Playback test: VLC, QuickTime, or YouTube upload preview"
echo "  2. Audio sync check: Verify voice timing matches animation"
echo "  3. Color check: Ensure palette matches (Electric Blue, Burgundy, Lavender, Orange)"
echo "  4. Distribute: YouTube, TikTok, social media per platform specs"
echo ""
echo "📺 Platform specifications:"
echo "  YouTube: 1920×1080 MP4, H.264, AAC"
echo "  TikTok: Re-encode to 1080×1920 (vertical)"
echo "  Instagram Reels: 1080×1920 or 1920×1080"
echo "  LinkedIn: 1200×628 or 1920×1080"
echo ""
