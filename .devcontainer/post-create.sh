#!/usr/bin/env bash
set -e

echo "Installing ffmpeg and aubio..."
sudo apt-get update -qq
sudo apt-get install -y -qq ffmpeg aubio-tools

chmod +x rhythmix-studio/bin/rhythmix-studio.mjs
chmod +x rhythmix-studio/demo.sh 2>/dev/null || true

cat <<'EOF'

=========================================
  RHYTHMIX Studio Codespace ready
=========================================

ONE-COMMAND DEMO (free, no API key needed — uses synthetic visuals):

  bash rhythmix-studio/demo.sh

  Produces a 60s portrait music video at:
    rhythmix-out/demo/final.mp4
  Tap the file in the VS Code explorer and "Download" to your iPad.


FREE CINEMATIC RENDER (real stock footage from Pexels):

  export PEXELS_API_KEY=...   # free at https://www.pexels.com/api/
  cd rhythmix-studio
  node bin/rhythmix-studio.mjs render path/to/your-track.mp3 \
    --theme "neon midnight city" --bpm 120 --source pexels


PAID AI RENDER (Kling, Hunyuan, Luma, MiniMax):

  export REPLICATE_API_TOKEN=...   # token at https://replicate.com/account/api-tokens
  cd rhythmix-studio
  node bin/rhythmix-studio.mjs render path/to/your-track.mp3 \
    --theme "..." --bpm 120 --source replicate


DRY RUN (preview the plan + cost estimate, no API calls):

  cd rhythmix-studio
  node bin/rhythmix-studio.mjs plan path/to/your-track.mp3 \
    --theme "..." --bpm 120 --dry-run


Set persistent secrets at:
  https://github.com/settings/codespaces
=========================================
EOF
