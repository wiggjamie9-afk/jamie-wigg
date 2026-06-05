#!/bin/bash

# SURGE Pilot — Social Media Distribution Cuts
# Converts 12:47 MP4 master into platform-specific cuts
# Requirements: ffmpeg, imagemagick (optional)

set -e

SOURCE_MP4="surge-pilot-episode-01.mp4"
OUTPUT_DIR="./distribution"

if [ ! -f "$SOURCE_MP4" ]; then
  echo "❌ Source MP4 not found: $SOURCE_MP4"
  exit 1
fi

mkdir -p "$OUTPUT_DIR"

echo "📱 Creating platform-specific cuts from $SOURCE_MP4"
echo ""

# 1. YouTube (landscape, master resolution)
echo "1️⃣  YouTube (1920×1080, landscape)"
ffmpeg -i "$SOURCE_MP4" \
  -c:v libx264 -preset fast -crf 18 \
  -c:a aac -b:a 192k \
  -movflags +faststart \
  "$OUTPUT_DIR/surge-pilot-youtube-1920x1080.mp4" \
  -y 2>&1 | grep -E "progress|Duration|frame=" | tail -3

# 2. TikTok / Instagram Reels (portrait, 9:16)
echo ""
echo "2️⃣  TikTok & Instagram Reels (1080×1920, portrait)"
ffmpeg -i "$SOURCE_MP4" \
  -vf "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:black" \
  -c:v libx264 -preset fast -crf 18 \
  -c:a aac -b:a 192k \
  -movflags +faststart \
  "$OUTPUT_DIR/surge-pilot-tiktok-1080x1920.mp4" \
  -y 2>&1 | grep -E "progress|Duration|frame=" | tail -3

# 3. Instagram Feed (square, 1:1)
echo ""
echo "3️⃣  Instagram Feed (1080×1080, square)"
ffmpeg -i "$SOURCE_MP4" \
  -vf "scale=1080:1080:force_original_aspect_ratio=decrease,pad=1080:1080:(ow-iw)/2:(oh-ih)/2:black" \
  -c:v libx264 -preset fast -crf 18 \
  -c:a aac -b:a 192k \
  -movflags +faststart \
  "$OUTPUT_DIR/surge-pilot-instagram-1080x1080.mp4" \
  -y 2>&1 | grep -E "progress|Duration|frame=" | tail -3

# 4. LinkedIn (landscape, optimized)
echo ""
echo "4️⃣  LinkedIn (1200×628, landscape)"
ffmpeg -i "$SOURCE_MP4" \
  -vf "scale=1200:628:force_original_aspect_ratio=decrease,pad=1200:628:(ow-iw)/2:(oh-ih)/2:black" \
  -c:v libx264 -preset fast -crf 18 \
  -c:a aac -b:a 128k \
  -movflags +faststart \
  "$OUTPUT_DIR/surge-pilot-linkedin-1200x628.mp4" \
  -y 2>&1 | grep -E "progress|Duration|frame=" | tail -3

# 5. Twitter/X (16:9 landscape)
echo ""
echo "5️⃣  Twitter/X (1280×720, 16:9)"
ffmpeg -i "$SOURCE_MP4" \
  -vf "scale=1280:720" \
  -c:v libx264 -preset fast -crf 18 \
  -c:a aac -b:a 128k \
  -movflags +faststart \
  "$OUTPUT_DIR/surge-pilot-twitter-1280x720.mp4" \
  -y 2>&1 | grep -E "progress|Duration|frame=" | tail -3

# 6. Extract thumbnail (opening frame)
echo ""
echo "6️⃣  Extracting thumbnail (opening frame)"
ffmpeg -i "$SOURCE_MP4" \
  -ss 0 -vframes 1 -q:v 2 \
  "$OUTPUT_DIR/surge-pilot-thumbnail-1920x1080.jpg" \
  -y 2>&1 | grep -E "progress|Duration" | tail -1

echo ""
echo "✅ Distribution cuts complete!"
echo ""
echo "📊 Output files:"
ls -lh "$OUTPUT_DIR/" | tail -n +2 | awk '{printf "  %s  %-40s\n", $5, $9}'

echo ""
echo "📤 Platform-specific upload specs:"
echo "  • YouTube: 1920×1080 MP4, H.264, AAC — Upload as public/unlisted"
echo "  • TikTok: 1080×1920 MP4 — Auto-crops if needed"
echo "  • Instagram Reels: 1080×1920 MP4 — Min 15s, max 90s (12:47 cuts might need trimming)"
echo "  • LinkedIn: 1200×628 MP4 — 600MB max, captions recommended"
echo "  • Twitter/X: 1280×720 MP4 — 512MB max, GIF-friendly aspect"
echo ""
