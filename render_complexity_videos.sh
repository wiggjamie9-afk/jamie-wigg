#!/bin/bash
#
# Render script for Complexity Theory video series
# Uses ManimGL to create mathematical animations
#
# Usage: bash render_complexity_videos.sh [quality] [scene]
# Example: bash render_complexity_videos.sh qm SandpileIntro
#

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
QUALITY=${1:-"-ql"}  # Default: low quality for testing
SCENE=${2:-""}       # Scene name (optional - renders all if empty)
OUTPUT_DIR="${SCRIPT_DIR}/rendered_videos"

echo "═══════════════════════════════════════════════════════════════"
echo "  Complexity Theory Video Renderer"
echo "  ManimGL Animation Engine"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Check if manimgl is installed
if ! command -v manimgl &> /dev/null; then
    echo "❌ ManimGL not found. Install with: pip3 install manimgl"
    exit 1
fi

echo "✓ ManimGL found: $(manimgl --version 2>/dev/null || echo 'v1.7.2')"
echo "✓ Output directory: $OUTPUT_DIR"
echo ""

# Quality level mapping
case "$QUALITY" in
    -ql|ql) QUALITY_LEVEL="-ql"; QUALITY_NAME="480p (low)"; TIME_EST="2-5 min" ;;
    -qm|qm) QUALITY_LEVEL="-qm"; QUALITY_NAME="720p (medium)"; TIME_EST="10-20 min" ;;
    -qh|qh) QUALITY_LEVEL="-qh"; QUALITY_NAME="1080p (high)"; TIME_EST="30-60 min" ;;
    -qk|qk) QUALITY_LEVEL="-qk"; QUALITY_NAME="4K (max)"; TIME_EST="60-120 min" ;;
    *)      QUALITY_LEVEL="-ql"; QUALITY_NAME="480p (low)"; TIME_EST="2-5 min" ;;
esac

echo "Quality: $QUALITY_NAME (estimated time: $TIME_EST)"
echo ""

# Define scenes
declare -A SCENES=(
    ["intro"]="sandpile_animation.py:SandpileIntro"
    ["grid"]="sandpile_animation.py:SandpileGrid"
    ["topple"]="sandpile_animation.py:ToppleAnimation"
    ["avalanche"]="sandpile_animation.py:AvalancheMagnitude"
    ["fractal"]="sandpile_animation.py:FractalPattern"
    ["exponent"]="sandpile_animation.py:CriticalExponent"
)

# Function to render a scene
render_scene() {
    local scene_name=$1
    local file_and_class=$2

    IFS=':' read -r filename classname <<< "$file_and_class"

    if [ ! -f "$filename" ]; then
        echo "❌ File not found: $filename"
        return 1
    fi

    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🎬 Rendering: $scene_name ($classname)"
    echo "   File: $filename"
    echo "   Quality: $QUALITY_NAME"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    # Render with manimgl
    manimgl "$filename" "$classname" "$QUALITY_LEVEL" --write_to_movie

    if [ $? -eq 0 ]; then
        echo "✓ Successfully rendered: $scene_name"
        echo ""
    else
        echo "❌ Failed to render: $scene_name"
        echo ""
        return 1
    fi
}

# Main rendering logic
if [ -z "$SCENE" ]; then
    # Render all scenes
    echo "Rendering ALL scenes..."
    echo ""
    for scene_name in "${!SCENES[@]}"; do
        render_scene "$scene_name" "${SCENES[$scene_name]}"
    done
else
    # Render specific scene
    if [[ -v SCENES[$SCENE] ]]; then
        render_scene "$SCENE" "${SCENES[$SCENE]}"
    else
        echo "❌ Unknown scene: $SCENE"
        echo ""
        echo "Available scenes:"
        for scene_name in "${!SCENES[@]}"; do
            echo "  - $scene_name"
        done
        exit 1
    fi
fi

echo "═══════════════════════════════════════════════════════════════"
echo "✓ Rendering complete!"
echo ""
echo "Video files location:"
echo "  ./media/videos/"
echo ""
echo "Next steps:"
echo "  1. Review rendered videos"
echo "  2. Use /repurpose skill to create social media variants"
echo "  3. Combine with /social-media-content-engine for distribution"
echo "═══════════════════════════════════════════════════════════════"
