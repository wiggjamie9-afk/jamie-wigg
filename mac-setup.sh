#!/bin/bash

# 🎬 Creative Ecosystem Setup for Mac
# Downloads and configures: Blender, OpenCV, HyperFrames, cartoon pipeline

set -e  # Exit on error

echo "=========================================="
echo "🎬 Creative Ecosystem Setup for Mac"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check for Homebrew
if ! command -v brew &> /dev/null; then
  echo -e "${RED}❌ Homebrew not found${NC}"
  echo "Install from: https://brew.sh"
  exit 1
fi

echo -e "${YELLOW}Step 1/5: Installing Blender...${NC}"
if ! command -v blender &> /dev/null; then
  brew install blender
  echo -e "${GREEN}✓ Blender installed${NC}"
else
  echo -e "${GREEN}✓ Blender already installed${NC}"
fi

echo ""
echo -e "${YELLOW}Step 2/5: Installing Python packages...${NC}"
pip install opencv-python opencv-contrib-python 2>/dev/null || {
  echo -e "${YELLOW}Installing via pip3...${NC}"
  pip3 install opencv-python opencv-contrib-python
}
echo -e "${GREEN}✓ OpenCV installed${NC}"

echo ""
echo -e "${YELLOW}Step 3/5: Installing Node dependencies...${NC}"
if command -v npm &> /dev/null; then
  npm install hyperframes 2>/dev/null || true
  echo -e "${GREEN}✓ HyperFrames ready${NC}"
else
  echo -e "${YELLOW}⚠️  npm not found. Install Node: brew install node${NC}"
fi

echo ""
echo -e "${YELLOW}Step 4/5: Configuring Blender addon...${NC}"
cat << 'EOF'

⚠️  Manual step required:

1. Open Blender
2. Go to Edit > Preferences > Add-ons
3. Click "Install..."
4. Download from: https://github.com/siddharth-2074/blender-mcp/blob/main/addon.py
5. Select the file and install
6. Enable "Blender MCP" addon
7. In 3D viewport (press N), find BlenderMCP tab
8. Click "Connect to Claude"

Press Enter when done...
EOF
read

echo -e "${GREEN}✓ Setup complete${NC}"

echo ""
echo -e "${YELLOW}Step 5/5: Final checks...${NC}"
echo ""

# Verify installations
CHECKS_PASSED=0
CHECKS_TOTAL=4

echo "Checking Blender..."
if command -v blender &> /dev/null; then
  BLENDER_VERSION=$(blender --version | awk '{print $2}')
  echo -e "${GREEN}✓ Blender $BLENDER_VERSION${NC}"
  ((CHECKS_PASSED++))
else
  echo -e "${RED}✗ Blender not found${NC}"
fi
((CHECKS_TOTAL++))

echo "Checking OpenCV..."
if python3 -c "import cv2" 2>/dev/null; then
  echo -e "${GREEN}✓ OpenCV installed${NC}"
  ((CHECKS_PASSED++))
else
  echo -e "${RED}✗ OpenCV not found${NC}"
fi

echo "Checking npm..."
if command -v npm &> /dev/null; then
  NPM_VERSION=$(npm --version)
  echo -e "${GREEN}✓ npm $NPM_VERSION${NC}"
  ((CHECKS_PASSED++))
else
  echo -e "${YELLOW}⚠️  npm not found (optional)${NC}"
fi

echo "Checking Python..."
if command -v python3 &> /dev/null; then
  PYTHON_VERSION=$(python3 --version | awk '{print $2}')
  echo -e "${GREEN}✓ Python $PYTHON_VERSION${NC}"
  ((CHECKS_PASSED++))
else
  echo -e "${RED}✗ Python not found${NC}"
fi

echo ""
echo "=========================================="
echo "Setup Summary"
echo "=========================================="
echo "Checks passed: $CHECKS_PASSED/$CHECKS_TOTAL"
echo ""

if [ $CHECKS_PASSED -eq 4 ]; then
  echo -e "${GREEN}✅ All checks passed!${NC}"
  echo ""
  echo "Next steps:"
  echo "1. Run: ./run-cartoon-pipeline.command"
  echo "2. Wait 1-2 hours for 3D cartoons to generate"
  echo "3. Download rhythmix-3d-scene-60s.mp4 to Desktop"
  echo "4. Upload to YouTube/TikTok"
  echo ""
  echo "Docs:"
  echo "  • Quick start: DOWNLOAD-AND-RUN.md"
  echo "  • Full guide: CARTOON-PIPELINE-README.md"
  echo "  • Design system: rhythmix-teaser-60s/DESIGN.md"
else
  echo -e "${YELLOW}⚠️  Some checks failed. See above.${NC}"
  echo ""
  echo "Troubleshooting:"
  echo "  • Blender: brew install blender"
  echo "  • OpenCV: pip install opencv-python"
  echo "  • npm: brew install node"
  echo ""
  echo "Then run this script again."
fi

echo "=========================================="
