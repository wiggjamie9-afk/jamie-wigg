#!/usr/bin/env bash
#
# install-palmier-mac.sh
# Downloads Palmier Pro (AI video editor) and opens the installer.
# RUN THIS ON YOUR MAC — Apple Silicon, macOS 26 (Tahoe). It cannot run in the
# cloud sandbox (that's a Linux box with no access to your Mac).
#
# Usage:  bash scripts/install-palmier-mac.sh
#
set -euo pipefail

echo "▸ Palmier Pro installer (Mac)"

# Guard: macOS + Apple Silicon
if [[ "$(uname -s)" != "Darwin" ]]; then
  echo "✗ This must run on macOS. Palmier Pro is a Mac app." >&2; exit 1
fi
if [[ "$(uname -m)" != "arm64" ]]; then
  echo "✗ Apple Silicon required (M-series). Palmier Pro doesn't support Intel." >&2; exit 1
fi

# Resolve the latest .dmg from GitHub releases (falls back to the pinned v0.4.4).
echo "▸ Finding the latest release…"
URL="$(curl -fsSL https://api.github.com/repos/palmier-io/palmier-pro/releases/latest \
        | grep -o 'https://[^"]*\.dmg' | head -1 || true)"
[[ -z "$URL" ]] && URL="https://github.com/palmier-io/palmier-pro/releases/download/v0.4.4/PalmierPro.dmg"
echo "  → $URL"

DMG="$HOME/Downloads/PalmierPro.dmg"
echo "▸ Downloading to $DMG …"
curl -L --progress-bar -o "$DMG" "$URL"

echo "▸ Opening the disk image — drag Palmier Pro into Applications."
open "$DMG"

cat <<'EOF'

✅ Next steps (manual — a few clicks):
  1. In the window that opened, drag "Palmier Pro" onto the Applications folder.
  2. Launch it from Applications (first launch: right-click → Open to clear Gatekeeper).
  3. (Optional) Let an AI drive the timeline — run ON THIS MAC, with Palmier open:
        claude mcp add --transport http palmier-pro http://127.0.0.1:19789/mcp
     …or in Palmier: Help → MCP Instructions → Install in Claude Desktop / Cursor.
  4. Editing your own footage is FREE. In-timeline AI generation needs login + subscription.
EOF
