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

FREE FIRST RUN (no charges, real cinematic footage from Pexels):
  cd rhythmix-studio
  node bin/rhythmix-studio.mjs render ../voiceover-adam.wav \
    --theme "neon midnight city" --bpm 120 --source pexels

  Requires PEXELS_API_KEY as a Codespace secret.
  Free signup at https://www.pexels.com/api/

DRY RUN (free, prints plan only):
  node bin/rhythmix-studio.mjs plan ../voiceover-adam.wav \
    --theme "neon midnight city" --bpm 120 --dry-run

PAID AI RENDER (Kling, Hunyuan, etc):
  node bin/rhythmix-studio.mjs render ../voiceover-adam.wav \
    --theme "..." --bpm 120 --source replicate --model minimax-video

  Requires REPLICATE_API_TOKEN as a Codespace secret.

Set secrets at: https://github.com/settings/codespaces
=========================================
EOF
