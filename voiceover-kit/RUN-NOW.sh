#!/bin/bash
# Run this on your Mac to generate all 20 Episode 2 MP3s with Voicebox
# Prerequisites: Voicebox running, Python 3.11+

set -e

echo "🎙️  Building 20-podcast Episode 2 audio pipeline..."
echo ""

# Check if Voicebox is running
echo "1️⃣  Checking Voicebox..."
if ! curl -s http://127.0.0.1:17493/profiles > /dev/null 2>&1; then
    echo "❌ Voicebox not running at http://127.0.0.1:17493"
    echo "   Start Voicebox and try again."
    exit 1
fi
echo "✅ Voicebox is running"
echo ""

# Create output directory
mkdir -p audio-ep2

# Check if Episode 1 MP3s exist
echo "2️⃣  Looking for Episode 1 MP3s..."
if [ ! -d "audio-ep1" ] || [ -z "$(ls -1 audio-ep1/*.mp3 2>/dev/null)" ]; then
    echo "⚠️  No Episode 1 MP3s found in audio-ep1/"
    echo ""
    echo "QUICK FIX: You have two options:"
    echo ""
    echo "Option A: Copy your Episode 1 MP3s to audio-ep1/ folder"
    echo "  mkdir -p audio-ep1"
    echo "  cp ~/Downloads/ep1-*.mp3 audio-ep1/"
    echo ""
    echo "Option B: Use preset Kokoro voices instead (no cloning needed)"
    echo "  python generate-ep2-kokoro-quick.py"
    echo ""
    exit 1
fi
echo "✅ Found Episode 1 MP3s"
echo ""

# Run the full automation
echo "3️⃣  Starting voice cloning + generation..."
echo ""
python setup-and-generate-ep2.py

echo ""
echo "✅ DONE!"
echo ""
echo "Next steps:"
echo "1. Check Voicebox app → Generations tab"
echo "2. Wait for all 20 jobs to complete"
echo "3. Download MP3s to audio-ep2/"
echo "4. Upload to Buzzsprout as ep2-01.mp3, ep2-02.mp3, ... ep2-20.mp3"
echo ""
