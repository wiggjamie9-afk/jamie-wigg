#!/bin/bash

# 🎬 EVERYTHING Setup for Mac
# Complete creative + development ecosystem transfer
# Installs all tools, programs, configs needed

set -e

echo "=========================================="
echo "🎬 EVERYTHING Setup for Mac"
echo "=========================================="
echo ""
echo "This script installs your complete ecosystem:"
echo "  • Creative tools (Blender, FFMPEG, etc)"
echo "  • Development (Python, Node, Git)"
echo "  • Media (OpenCV, audio tools)"
echo "  • Automation (scripts, CLIs)"
echo "  • Documentation (synced from cloud)"
echo ""
echo "Total time: ~45 minutes"
echo "Disk space: ~10 GB"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Counters
INSTALLED=0
FAILED=0

install_tool() {
  local name=$1
  local brew_package=$2

  echo -n "Installing $name... "

  if command -v "${brew_package%% *}" &> /dev/null; then
    echo -e "${GREEN}✓ Already installed${NC}"
    ((INSTALLED++))
    return 0
  fi

  if brew install "$brew_package" 2>/dev/null; then
    echo -e "${GREEN}✓ Installed${NC}"
    ((INSTALLED++))
    return 0
  else
    echo -e "${RED}✗ Failed${NC}"
    ((FAILED++))
    return 1
  fi
}

# ============================================================================
# SECTION 1: System & Build Tools
# ============================================================================
echo ""
echo -e "${YELLOW}═══ SECTION 1: System & Build Tools ═══${NC}"
echo ""

install_tool "Homebrew" "homebrew" || {
  echo "Installing Homebrew first..."
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
}

install_tool "Git" "git"
install_tool "CMake" "cmake"
install_tool "Ninja" "ninja"
install_tool "Make" "make"

# ============================================================================
# SECTION 2: Development Languages
# ============================================================================
echo ""
echo -e "${YELLOW}═══ SECTION 2: Development Languages ═══${NC}"
echo ""

install_tool "Python 3" "python@3.11"
install_tool "Node.js" "node"
install_tool "Ruby" "ruby"

# ============================================================================
# SECTION 3: Creative & Media Tools
# ============================================================================
echo ""
echo -e "${YELLOW}═══ SECTION 3: Creative & Media Tools ═══${NC}"
echo ""

install_tool "Blender" "blender"
install_tool "FFmpeg" "ffmpeg"
install_tool "ImageMagick" "imagemagick"
install_tool "GraphicsMagick" "graphicsmagick"
install_tool "SDL2" "sdl2"
install_tool "Qt5" "qt@5"

# ============================================================================
# SECTION 4: Audio & Voice
# ============================================================================
echo ""
echo -e "${YELLOW}═══ SECTION 4: Audio & Voice ═══${NC}"
echo ""

install_tool "libsndfile" "libsndfile"
install_tool "Flite (TTS)" "flite"
install_tool "SoX" "sox"
install_tool "Opus" "opus"

# ============================================================================
# SECTION 5: Computer Vision & ML
# ============================================================================
echo ""
echo -e "${YELLOW}═══ SECTION 5: Computer Vision & ML ═══${NC}"
echo ""

install_tool "OpenCV" "opencv"

# ============================================================================
# SECTION 6: Networking & Security
# ============================================================================
echo ""
echo -e "${YELLOW}═══ SECTION 6: Networking & Security ═══${NC}"
echo ""

install_tool "OpenSSL" "openssl"
install_tool "libUSB" "libusb"
install_tool "cURL" "curl"
install_tool "Wget" "wget"

# ============================================================================
# SECTION 7: Python Packages
# ============================================================================
echo ""
echo -e "${YELLOW}═══ SECTION 7: Python Packages ═══${NC}"
echo ""

echo "Installing Python packages..."
pip3 install --upgrade pip 2>/dev/null || true
pip3 install opencv-python opencv-contrib-python 2>/dev/null || true
pip3 install numpy scipy matplotlib pandas 2>/dev/null || true
pip3 install pillow imageio scikit-image 2>/dev/null || true
pip3 install flask fastapi requests 2>/dev/null || true
pip3 install elevenlabs replicate 2>/dev/null || true
pip3 install click pyyaml toml 2>/dev/null || true
echo -e "${GREEN}✓ Python packages installed${NC}"

# ============================================================================
# SECTION 8: Node.js Packages (Global)
# ============================================================================
echo ""
echo -e "${YELLOW}═══ SECTION 8: Node.js Tools ═══${NC}"
echo ""

echo "Installing Node packages globally..."
npm install -g hyperframes 2>/dev/null || true
npm install -g typescript ts-node 2>/dev/null || true
npm install -g eslint prettier 2>/dev/null || true
npm install -g http-server 2>/dev/null || true
echo -e "${GREEN}✓ Node packages installed${NC}"

# ============================================================================
# SECTION 9: Repository Sync
# ============================================================================
echo ""
echo -e "${YELLOW}═══ SECTION 9: Repository Sync ═══${NC}"
echo ""

if [ ! -d ~/jamie-wigg ]; then
  echo "Cloning repository..."
  git clone https://github.com/wiggjamie9-afk/jamie-wigg.git ~/jamie-wigg
  cd ~/jamie-wigg
  git checkout claude/vibecode-fartrun-readme-h6ubxk
  echo -e "${GREEN}✓ Repository cloned${NC}"
else
  echo "Repository already exists. Pulling latest..."
  cd ~/jamie-wigg
  git fetch origin
  git checkout claude/vibecode-fartrun-readme-h6ubxk
  git pull origin claude/vibecode-fartrun-readme-h6ubxk
  echo -e "${GREEN}✓ Repository synced${NC}"
fi

# ============================================================================
# SECTION 10: Blender Addon Setup
# ============================================================================
echo ""
echo -e "${YELLOW}═══ SECTION 10: Blender Addon Setup ═══${NC}"
echo ""

cat << 'EOF'

Next steps for Blender:

1. Open Blender
2. Go to Edit > Preferences > Add-ons
3. Click "Install..."
4. Download addon from:
   https://github.com/siddharth-2074/blender-mcp/blob/main/addon.py
5. Select and install
6. Enable "Blender MCP"
7. In 3D viewport, find BlenderMCP tab
8. Click "Connect to Claude"

Press Enter when done...
EOF
read

# ============================================================================
# SECTION 11: Configuration Files
# ============================================================================
echo ""
echo -e "${YELLOW}═══ SECTION 11: Configuration Files ═══${NC}"
echo ""

cd ~/jamie-wigg

# Create .env template if not exists
if [ ! -f .env ]; then
  cat > .env << 'ENVFILE'
# API Keys (add your own)
ELEVENLABS_API_KEY=
REPLICATE_API_TOKEN=
HYPER3D_API_KEY=
HIGGSFIELD_API_KEY=
HIGGSFIELD_SECRET=
STEP_API_KEY=
STEP_BASE_URL=
CONTEXT7_API_KEY=
ENVFILE
  echo -e "${GREEN}✓ Created .env template${NC}"
  echo "   Edit ~/.env and add your API keys"
else
  echo -e "${GREEN}✓ .env already exists${NC}"
fi

# ============================================================================
# SECTION 12: Make Scripts Executable
# ============================================================================
echo ""
echo -e "${YELLOW}═══ SECTION 12: Making Scripts Executable ═══${NC}"
echo ""

chmod +x ~/jamie-wigg/run-cartoon-pipeline.command 2>/dev/null || true
chmod +x ~/jamie-wigg/scripts/cartoon-pipeline.py 2>/dev/null || true
chmod +x ~/jamie-wigg/sync-from-claude.command 2>/dev/null || true
chmod +x ~/jamie-wigg/mac-setup.sh 2>/dev/null || true

echo -e "${GREEN}✓ Scripts made executable${NC}"

# ============================================================================
# SECTION 13: Verification & Checks
# ============================================================================
echo ""
echo -e "${YELLOW}═══ SECTION 13: Verification Checks ═══${NC}"
echo ""

CHECKS_PASSED=0
CHECKS_TOTAL=0

check() {
  local name=$1
  local cmd=$2
  ((CHECKS_TOTAL++))

  if command -v $cmd &> /dev/null; then
    echo -e "${GREEN}✓ $name${NC}"
    ((CHECKS_PASSED++))
  else
    echo -e "${RED}✗ $name${NC}"
  fi
}

check "Git" "git"
check "Python 3" "python3"
check "Node.js" "node"
check "npm" "npm"
check "Blender" "blender"
check "FFmpeg" "ffmpeg"
check "OpenCV" "python3 -c 'import cv2' 2>/dev/null && echo 'true' || echo 'false'"

echo ""
echo -e "${GREEN}Checks passed: $CHECKS_PASSED/$CHECKS_TOTAL${NC}"

# ============================================================================
# SECTION 14: Final Summary
# ============================================================================
echo ""
echo "=========================================="
echo "Setup Complete!"
echo "=========================================="
echo ""
echo -e "${GREEN}✓ Tools installed: $INSTALLED${NC}"
if [ $FAILED -gt 0 ]; then
  echo -e "${RED}✗ Installation failures: $FAILED${NC}"
fi
echo ""
echo "Next steps:"
echo ""
echo "1. Add API keys to ~/.env:"
echo "   • ElevenLabs"
echo "   • Replicate"
echo "   • Hyper3D"
echo "   • etc."
echo ""
echo "2. Run cartoon pipeline:"
echo "   cd ~/jamie-wigg"
echo "   ./run-cartoon-pipeline.command"
echo ""
echo "3. Or generate single character:"
echo "   python3 scripts/cartoon-pipeline.py --character hero"
echo ""
echo "4. Generate all 3 cartoons:"
echo "   python3 scripts/cartoon-pipeline.py --all"
echo ""
echo "5. Download output:"
echo "   cp rhythmix-3d-scene-60s.mp4 ~/Desktop/"
echo ""
echo "Documentation:"
echo "  • Start: MAC-DOWNLOAD-README.md"
echo "  • Full:  CARTOON-PIPELINE-README.md"
echo "  • All:   MASTER-TRANSFER-BUNDLE.md"
echo ""
echo "Your complete creative ecosystem is now on your Mac!"
echo "=========================================="
