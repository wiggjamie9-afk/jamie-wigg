#!/usr/bin/env bash
# Generate a looping GIF preview + a poster JPG next to a rendered MP4.
#
# Usage:  ./tools/post-render/post-render.sh path/to/video.mp4
# Output: path/to/video-preview.gif  (3s, 360px wide, ~12fps, loops)
#         path/to/video-poster.jpg   (single frame ~30% in)

set -euo pipefail

VIDEO="${1:?usage: post-render.sh <video.mp4>}"
[[ -f "$VIDEO" ]] || { echo "not a file: $VIDEO" >&2; exit 1; }

DIR=$(dirname "$VIDEO")
NAME=$(basename "$VIDEO" .mp4)
PREVIEW="$DIR/$NAME-preview.gif"
POSTER="$DIR/$NAME-poster.jpg"

DURATION=$(ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "$VIDEO")
START=$(awk -v d="$DURATION" 'BEGIN { printf "%.2f", d * 0.30 }')

# Poster: single sharp frame ~30% in
ffmpeg -y -loglevel error \
  -ss "$START" -i "$VIDEO" \
  -frames:v 1 -q:v 3 \
  "$POSTER"

# Preview GIF: 3s clip starting ~30% in, 360px wide, 12fps, palette-optimized for size
PALETTE=$(mktemp --suffix=.png)
trap 'rm -f "$PALETTE"' EXIT

ffmpeg -y -loglevel error \
  -ss "$START" -t 3 -i "$VIDEO" \
  -vf "fps=12,scale=360:-1:flags=lanczos,palettegen=stats_mode=diff" \
  "$PALETTE"

ffmpeg -y -loglevel error \
  -ss "$START" -t 3 -i "$VIDEO" -i "$PALETTE" \
  -lavfi "fps=12,scale=360:-1:flags=lanczos[v];[v][1:v]paletteuse=dither=bayer:bayer_scale=5" \
  -loop 0 \
  "$PREVIEW"

POSTER_SIZE=$(du -h "$POSTER" | cut -f1)
PREVIEW_SIZE=$(du -h "$PREVIEW" | cut -f1)

echo "✓ poster:  $POSTER  ($POSTER_SIZE)"
echo "✓ preview: $PREVIEW ($PREVIEW_SIZE)"
