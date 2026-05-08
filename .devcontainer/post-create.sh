#!/usr/bin/env bash
set -e

echo "Installing ffmpeg..."
sudo apt-get update -qq
sudo apt-get install -y -qq ffmpeg

chmod +x rhythmix-studio/bin/rhythmix-studio.mjs

cat <<'EOF'

=========================================
  RHYTHMIX Studio environment ready
=========================================

Quickstart (no API calls, free):
  cd rhythmix-studio
  node bin/rhythmix-studio.mjs plan ../voiceover-adam.wav \
    --theme "neon city, lone musician" --bpm 120 --dry-run

For real renders, set REPLICATE_API_TOKEN as a Codespace secret:
  https://github.com/settings/codespaces

Then run without --dry-run:
  node bin/rhythmix-studio.mjs render ../voiceover-adam.wav \
    --theme "..." --bpm 120 --model minimax-video

=========================================
EOF
