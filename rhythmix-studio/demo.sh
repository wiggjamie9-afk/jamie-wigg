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
# Demo is meant to be fresh every run, not resumed — clear any cached
# scenes/work from a previous demo so updates to the script don't get
# masked by the resume-from-checkpoint behaviour.
find rhythmix-out/demo -mindepth 1 -delete 2>/dev/null || true
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
# Use ffmpeg's gradients lavfi source — generates beautiful animated colour
# fields in real time (no per-pixel math), so 15 clips finish in seconds
# instead of minutes. Each clip rotates the colour pair and shifts the
# gradient angle for visual variety.
COLOURS=("#ff1f5a:#7c3aed" "#00d8ff:#ff1f5a" "#f5c000:#7c3aed" "#7c3aed:#00d8ff" \
         "#ff1f5a:#f5c000" "#00d8ff:#7c3aed" "#7c3aed:#f5c000" "#f5c000:#00d8ff" \
         "#ff1f5a:#00d8ff" "#7c3aed:#ff1f5a" "#00d8ff:#f5c000" "#f5c000:#ff1f5a" \
         "#ff1f5a:#7c3aed" "#00d8ff:#ff1f5a" "#7c3aed:#00d8ff")
for i in $(seq 0 14); do
  pair="${COLOURS[$i]}"
  c0="${pair%%:*}"
  c1="${pair##*:}"
  # Alternate diagonal direction per clip for visual variety without ever
  # going outside the frame (no corner artifacts from rotation).
  if [ $((i % 2)) -eq 0 ]; then
    coords="x0=0:y0=0:x1=1280:y1=720"
  else
    coords="x0=1280:y0=0:x1=0:y1=720"
  fi
  ffmpeg -y -loglevel error -f lavfi \
    -i "gradients=s=1280x720:r=30:duration=8:c0=${c0}:c1=${c1}:${coords}:speed=0.15:nb_colors=2" \
    -vf "eq=saturation=1.3:contrast=1.05" \
    -t 8 -c:v libx264 -preset veryfast -pix_fmt yuv420p \
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
