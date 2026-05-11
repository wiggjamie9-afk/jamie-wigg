#!/usr/bin/env bash
# RHYTHMIX Studio — one-command demo render.
#
# Produces a 60s portrait music video at rhythmix-out/demo/final.mp4 using:
#   - a synthetic dynamic-loudness track (so structure detection has something
#     interesting to chew on)
#   - 15 synthetic gradient source clips (no API key, no internet needed)
#
# Designed for iPad + Codespaces: no flags, no questions, just one command.
# Once it finishes, download rhythmix-out/demo/final.mp4 from VS Code.
#
# For real cinematic output, set PEXELS_API_KEY and pass --source pexels
# (see QUICKSTART.txt). The engine pipeline is identical.

set -e

cd "$(dirname "$0")/.."   # repo root
mkdir -p rhythmix-out/demo

echo ""
echo "🎵 [1/3] Synthesising a 60s track with dynamic structure..."
ffmpeg -y -loglevel error \
  -f lavfi -i "sine=frequency=110:duration=60" \
  -f lavfi -i "sine=frequency=220:duration=60" \
  -f lavfi -i "sine=frequency=440:duration=60" \
  -filter_complex "\
    [0:a]volume=enable='lt(t,8)':volume=0.30,volume=enable='between(t,8,22)':volume=0.55,volume=enable='between(t,22,42)':volume=0.85,volume=enable='between(t,42,52)':volume=0.50,volume=enable='gt(t,52)':volume=0.25[a0];\
    [1:a]volume=enable='lt(t,8)':volume=0.20,volume=enable='between(t,8,42)':volume=0.50,volume=enable='gt(t,42)':volume=0.30[a1];\
    [2:a]volume=enable='between(t,22,42)':volume=0.40,volume=0[a2];\
    [a0][a1][a2]amix=inputs=3:duration=longest" \
  -ar 44100 -ac 2 -b:a 192k rhythmix-out/demo/track.mp3

echo "🎬 [2/3] Generating 15 synthetic source clips..."
mkdir -p rhythmix-out/demo/clips
for i in $(seq 0 14); do
  ffmpeg -y -loglevel error -f lavfi \
    -i "color=c=black:s=1280x720:r=30:d=8,format=yuv420p,geq=r='128+127*sin(2*PI*(X/W*cos(${i})+T/4))':g='128+127*sin(2*PI*(Y/H*sin(${i})+T/3))':b='128+127*sin(2*PI*((X+Y)/W*0.7+T/5))',gblur=sigma=20,eq=saturation=1.5:contrast=1.05" \
    -c:v libx264 -preset veryfast -pix_fmt yuv420p \
    "rhythmix-out/demo/clips/clip-$(printf "%02d" $i).mp4"
done

echo "🎥 [3/3] Rendering with rhythmix-studio v$(node -p "require('./rhythmix-studio/package.json').version")..."
node rhythmix-studio/bin/rhythmix-studio.mjs render rhythmix-out/demo/track.mp3 \
  --theme "neon midnight city, rain-slick streets, cinematic" \
  --bpm 120 --aspect 9:16 \
  --source local --clips-dir rhythmix-out/demo/clips \
  --out rhythmix-out/demo

echo ""
echo "✅ Done. Your demo video is at:"
echo "   rhythmix-out/demo/final.mp4"
echo ""
echo "From VS Code in your browser:"
echo "  → expand rhythmix-out/demo in the file explorer"
echo "  → right-tap final.mp4 → Download"
echo ""
echo "To get real cinematic visuals instead of synthetic gradients,"
echo "set PEXELS_API_KEY and re-run with --source pexels (see QUICKSTART.txt)."
