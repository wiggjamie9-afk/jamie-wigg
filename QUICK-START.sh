#!/bin/bash
# Quick Start: Generate Book 1
# Run this to generate all 16 pages, narration, and final video

set -e

echo "🌙 Sunny's Cozy Quokka Bedtime Tales - Book 1"
echo "============================================================"
echo ""
echo "This script will generate a complete, professional MP4 video"
echo "ready for YouTube. Total time: ~15 minutes"
echo ""

# Check prerequisites
echo "📋 Checking prerequisites..."
echo ""

if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 not found. Install Python 3.9+"
    exit 1
fi
echo "✅ Python 3 found"

if ! python3 -c "import requests" 2>/dev/null; then
    echo "⚠️  Installing requests..."
    pip install requests
fi
echo "✅ requests available"

if ! python3 -c "import elevenlabs" 2>/dev/null; then
    echo "⚠️  Installing elevenlabs..."
    pip install elevenlabs
fi
echo "✅ elevenlabs available"

if ! command -v ffmpeg &> /dev/null; then
    echo "❌ FFmpeg not found!"
    echo "   macOS: brew install ffmpeg"
    echo "   Linux: sudo apt-get install ffmpeg"
    exit 1
fi
echo "✅ FFmpeg found"

echo ""
echo "✅ All prerequisites met!"
echo ""
echo "============================================================"
echo "Ready to generate Book 1!"
echo "============================================================"
echo ""

# Check for API keys
if [ -f .env ]; then
    if grep -q "HIGGSFIELD_API_KEY" .env; then
        echo "✅ Higgsfield credentials found in .env"
    else
        echo "⚠️  Higgsfield credentials not in .env"
        echo "   Add HIGGSFIELD_API_KEY and HIGGSFIELD_SECRET"
    fi
fi

if [ -z "$ELEVENLABS_API_KEY" ]; then
    echo ""
    echo "⚠️  ELEVENLABS_API_KEY not set!"
    echo "   Get one from: https://elevenlabs.io"
    echo "   Then run:"
    echo "   export ELEVENLABS_API_KEY='your-key-here'"
    echo ""
fi

echo ""
echo "🚀 Starting generation workflow..."
echo ""

# Step 1
echo "=================================================="
echo "📸 Step 1: Generate 16 Professional Book Pages"
echo "=================================================="
echo "Time: ~5 minutes"
echo "Cost: ~$2-3 USD (Higgsfield credits)"
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    python3 generate-book1-higgsfield-images.py
else
    echo "Skipped"
fi

echo ""
echo "=================================================="
echo "🎤 Step 2: Generate Warm Motherly Narration"
echo "=================================================="
echo "Time: ~2 minutes"
echo "You'll choose: Grace (recommended), Emily, or Julia"
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    python3 generate-book1-narration.py
else
    echo "Skipped"
fi

echo ""
echo "=================================================="
echo "🎬 Step 3: Assemble Final Video"
echo "=================================================="
echo "Time: ~5 minutes (encoding)"
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    python3 assemble-book1-final-video.py
else
    echo "Skipped"
fi

echo ""
echo "============================================================"
echo "✅ BOOK 1 GENERATION COMPLETE!"
echo "============================================================"
echo ""
echo "Output file: book-1-sunny-watches-stars.mp4"
echo ""
echo "📤 Next steps:"
echo "   1. Preview the video: open book-1-sunny-watches-stars.mp4"
echo "   2. Upload to YouTube: python3 upload-book1-to-youtube.py"
echo ""
echo "📚 To create Book 2:"
echo "   1. Write a new story (16 pages × 2 lines)"
echo "   2. Create BOOK-2-HIGGSFIELD/assets/higgsfield/PLAN.md"
echo "   3. Run the same workflow with book-2 in all filenames"
echo ""
echo "Good luck! 🌙"

