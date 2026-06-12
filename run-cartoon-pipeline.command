#!/bin/bash

# 🎬 Cartoon Pipeline - Mac Launcher
# Double-click this file to start generating 3D cartoons automatically

cd "$(dirname "$0")"

echo "🎬 Starting Cartoon Pipeline..."
echo ""

# Check prerequisites
check_tool() {
  if ! command -v "$1" &> /dev/null; then
    echo "❌ $1 not found. Install with: brew install $1"
    return 1
  fi
  return 0
}

# Verify setup
echo "📋 Checking prerequisites..."
check_tool "python3" || exit 1
check_tool "blender" || exit 1
check_tool "npm" || exit 1

# Check Python packages
echo "Checking Python packages..."
python3 -c "import cv2" 2>/dev/null || {
  echo "⚠️  OpenCV not found. Installing..."
  pip install opencv-python opencv-contrib-python
}

# Run pipeline
echo ""
echo "🚀 Running pipeline for all characters..."
echo "This will take approximately 1-2 hours"
echo ""

# Get start time
START_TIME=$(date '+%s')

python3 scripts/cartoon-pipeline.py --all

# Calculate elapsed time
END_TIME=$(date '+%s')
ELAPSED=$((END_TIME - START_TIME))
MINUTES=$((ELAPSED / 60))
SECONDS=$((ELAPSED % 60))

echo ""
echo "================================"
if [ $? -eq 0 ]; then
  echo "✅ Pipeline completed successfully!"
  echo "⏱️  Total time: ${MINUTES}m ${SECONDS}s"
  echo ""
  echo "📽️  Output files:"
  echo "   • rhythmix-3d-scene-60s.mp4 (ready to share)"
  echo ""
  echo "Next steps:"
  echo "   1. Download rhythmix-3d-scene-60s.mp4"
  echo "   2. Add music/voiceover (optional)"
  echo "   3. Upload to YouTube/TikTok/Instagram"
else
  echo "❌ Pipeline failed. Check the errors above."
  echo "⏱️  Time elapsed: ${MINUTES}m ${SECONDS}s"
fi
echo "================================"

# Keep terminal open so user can see output
read -p "Press Enter to close this window..."
