#!/bin/bash
# Setup script for Mac: Downloads all Episode 2 & 3 scripts and voice generation pipeline
# Run this once on your Mac to get everything ready

set -e

echo "🎙️  RHYTHMIX Episode 2 & 3 Audio Pipeline — Mac Setup"
echo "=================================================="
echo ""

# 1. Clone or pull the repository
REPO_DIR="$HOME/rhythmix-podcast-network"

if [ -d "$REPO_DIR" ]; then
    echo "1️⃣  Updating existing repository..."
    cd "$REPO_DIR"
    git fetch origin
    git checkout claude/system-prompts-leaks-2sg44g
    git pull origin claude/system-prompts-leaks-2sg44g
else
    echo "1️⃣  Cloning repository..."
    git clone --branch claude/system-prompts-leaks-2sg44g https://github.com/wiggjamie9-afk/jamie-wigg.git "$REPO_DIR"
    cd "$REPO_DIR"
fi

cd voiceover-kit

echo "✅ Repository ready at: $REPO_DIR/voiceover-kit"
echo ""

# 2. Check Python
echo "2️⃣  Checking Python..."
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 not found. Install from https://www.python.org/downloads/"
    exit 1
fi

PYTHON_VERSION=$(python3 --version | cut -d' ' -f2)
echo "✅ Python $PYTHON_VERSION found"
echo ""

# 3. Install requests library if needed
echo "3️⃣  Checking Python requests library..."
if ! python3 -c "import requests" 2>/dev/null; then
    echo "   Installing requests..."
    pip3 install requests
fi
echo "✅ requests library ready"
echo ""

# 4. Check Voicebox
echo "4️⃣  Checking Voicebox..."
if ! curl -s http://127.0.0.1:17493/profiles > /dev/null 2>&1; then
    echo "❌ Voicebox not running at http://127.0.0.1:17493"
    echo ""
    echo "   START Voicebox on your Mac:"
    echo "   1. Open the Voicebox app"
    echo "   2. Make sure it's running (you should see the Voicebox window)"
    echo "   3. Then run this script again"
    echo ""
    exit 1
fi
echo "✅ Voicebox is running"
echo ""

# 5. Show what's ready
echo "=================================================="
echo "✅ EVERYTHING IS READY!"
echo "=================================================="
echo ""
echo "Files ready:"
echo "  📄 20 Episode 2 scripts (01-20)"
echo "  📄 20 Episode 3 scripts (01-20)"
echo "  🐍 generate-all-ep2-now.py (generation script)"
echo ""
echo "Location: $REPO_DIR/voiceover-kit/"
echo ""
echo "Next step: Run the generation script"
echo "  cd $REPO_DIR/voiceover-kit"
echo "  python3 generate-all-ep2-now.py"
echo ""
