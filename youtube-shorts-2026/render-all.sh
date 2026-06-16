#!/bin/bash

# YouTube Shorts Production Rendering Script
# Renders all 4 videos to MP4 format
# Usage: bash render-all.sh

set -e

echo "🎬 YouTube Shorts Rendering Pipeline"
echo "===================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to render a video
render_video() {
    local html_file=$1
    local output_file=$2
    local title=$3

    echo -e "${BLUE}[Rendering]${NC} $title"
    echo "  Input:  $html_file"
    echo "  Output: $output_file"
    echo ""

    npx --yes hyperframes@0.4.42 render \
        "$html_file" \
        --output "$output_file" \
        --width 1080 \
        --height 1920 \
        --duration 60 \
        --framerate 30

    if [ -f "$output_file" ]; then
        size=$(du -h "$output_file" | cut -f1)
        echo -e "${GREEN}✓ Rendered successfully${NC} ($size)"
    else
        echo -e "${YELLOW}⚠ Render may have failed, check output above${NC}"
    fi
    echo ""
}

# Create output directories
mkdir -p business-economics/renders
mkdir -p comedy/renders
mkdir -p ahad-insights/renders

echo "📁 Output directories created"
echo ""

# Render Video 1: Netflix/Blockbuster
render_video \
    "business-economics/netflix-blockbuster.html" \
    "business-economics/renders/netflix-blockbuster.mp4" \
    "Video 1: Why Netflix Killed Blockbuster"

# Render Video 2: Starbucks
render_video \
    "business-economics/starbucks-coffee.html" \
    "business-economics/renders/starbucks-coffee.mp4" \
    "Video 2: Why Starbucks Doesn't Sell Coffee"

# Render Video 3: Fart Man
render_video \
    "comedy/fart-man-neighbourhood.html" \
    "comedy/renders/fart-man-neighbourhood.mp4" \
    "Video 3: Mr. Fart Man - The Next-Door Neighbourhood"

# Render Video 4: AHAD Insights
render_video \
    "ahad-insights/adults-vs-kids.html" \
    "ahad-insights/renders/adults-vs-kids.mp4" \
    "Video 4: Why Adults See Obstacles But Kids Don't"

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ All 4 videos rendered successfully!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "📁 Output locations:"
echo "   • business-economics/renders/netflix-blockbuster.mp4"
echo "   • business-economics/renders/starbucks-coffee.mp4"
echo "   • comedy/renders/fart-man-neighbourhood.mp4"
echo "   • ahad-insights/renders/adults-vs-kids.mp4"
echo ""
echo "📝 Next steps:"
echo "   1. Review videos (check timing, colors, text visibility)"
echo "   2. Generate voiceovers (Business econ + AHAD videos)"
echo "   3. Add SFX to Fart Man video"
echo "   4. Upload to YouTube this weekend"
echo ""
echo "🎯 Ready to upload!"
