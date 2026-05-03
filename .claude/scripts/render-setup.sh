#!/usr/bin/env bash
# Bootstrap the runtime tools needed to actually render videos in this sandbox.
# Idempotent — safe to run on fresh sessions.
#
# Installs (system-level, NOT in the repo):
#   - hyperframes CLI (npm -g)
#   - ffmpeg (apt)
#   - Chrome headless shell (downloaded by hyperframes into ~/.cache/hyperframes/)
#
# Exports the chrome path for Remotion via REMOTION_CHROME for callers that
# source this script.

set -euo pipefail

log() { echo "[render-setup] $*"; }

# 1. hyperframes CLI
if ! command -v hyperframes >/dev/null 2>&1; then
  log "installing hyperframes globally"
  npm install -g hyperframes >/dev/null
else
  log "hyperframes already installed ($(hyperframes --version))"
fi

# 2. ffmpeg
if ! command -v ffmpeg >/dev/null 2>&1; then
  log "installing ffmpeg via apt"
  apt-get update -qq >/dev/null 2>&1 || true
  apt-get install -y ffmpeg >/dev/null
else
  log "ffmpeg already installed ($(ffmpeg -version 2>&1 | head -1))"
fi

# 3. Chrome — Ubuntu 24's chromium-browser is a snap stub and won't run here.
# Remove it if present so hyperframes downloads its own.
if dpkg -s chromium-browser >/dev/null 2>&1; then
  log "removing snap-stub chromium-browser"
  apt-get -y remove chromium-browser >/dev/null
fi

log "ensuring hyperframes Chrome is downloaded"
hyperframes browser ensure >/dev/null
chrome_path=$(hyperframes browser path | tail -1 | tr -d '[:space:]')
log "chrome path: $chrome_path"

# Export for Remotion. The video/ project's render command needs:
#   npx remotion render MyComp --browser-executable="$REMOTION_CHROME" out/X.mp4
export REMOTION_CHROME="$chrome_path"
echo "$chrome_path" > /tmp/.remotion-chrome-path
log "saved chrome path to /tmp/.remotion-chrome-path"

log "done. Render commands:"
log "  HyperFrames:  cd <project> && npm run render"
log "  Remotion:     cd video && npx remotion render MyComp --browser-executable=\"\$(cat /tmp/.remotion-chrome-path)\" out/X.mp4"
