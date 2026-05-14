#!/usr/bin/env bash
set -e

echo "[post-create] Installing system dependencies (ffmpeg, aubio)..."
sudo apt-get update -qq
sudo apt-get install -y -qq ffmpeg aubio-tools postgresql-client

echo "[post-create] Installing Supabase CLI..."
if ! command -v supabase >/dev/null 2>&1; then
  curl -fsSL https://github.com/supabase/cli/releases/latest/download/supabase_linux_amd64.tar.gz \
    | sudo tar -xz -C /usr/local/bin supabase
  sudo chmod +x /usr/local/bin/supabase
fi
supabase --version || true

echo "[post-create] Installing EAS + Expo CLI..."
npm install -g eas-cli expo-cli || true

echo "[post-create] Installing rhythmix-mobile dependencies..."
if [ -d rhythmix-mobile ]; then
  ( cd rhythmix-mobile && npm install --no-audit --no-fund )
fi

chmod +x rhythmix-studio/bin/rhythmix-studio.mjs 2>/dev/null || true
chmod +x rhythmix-studio/demo.sh 2>/dev/null || true
chmod +x scripts/*.sh 2>/dev/null || true

cat <<'EOF'

=========================================
  RHYTHMIX Codespace ready
=========================================

MOBILE APP + BACKEND:

  make help                  # see every target
  make deploy                # supabase db push + functions deploy (after `make link`)
  make link REF=xxxx         # link this codespace to your Supabase project
  cd rhythmix-mobile && npm start

VIDEO STUDIO (this codespace's original purpose):
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
