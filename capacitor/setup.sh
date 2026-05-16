#!/usr/bin/env bash
# RHYTHMIX — Capacitor scaffold setup.
# Usage:
#   bash setup.sh ios       # install + add iOS platform + sync
#   bash setup.sh android   # install + add Android platform + sync
#   bash setup.sh both      # default — both platforms
#
# Idempotent. Safe to re-run.

set -euo pipefail

PLATFORM="${1:-both}"
case "$PLATFORM" in
  ios|android|both) ;;
  *)
    echo "Usage: bash setup.sh [ios|android|both]" >&2
    exit 2
    ;;
esac

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$HERE"

require() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "✗ '$1' is required but not installed."
    echo "  Install: $2" >&2
    exit 1
  fi
}

require node "https://nodejs.org (LTS, v20+)"
require npm  "ships with node"

echo "→ Installing Capacitor dependencies..."
npm install

echo "→ Building web bundle (capacitor/www/) from repo-root HTML files..."
npm run build:www

add_platform() {
  local plat="$1"
  if [ -d "$plat" ] && [ -n "$(ls -A "$plat" 2>/dev/null || true)" ]; then
    echo "↺  $plat/ already present — skipping 'cap add $plat'"
  else
    echo "→ Adding $plat platform (this generates the native project)..."
    npm run "${plat}:add"
  fi
}

case "$PLATFORM" in
  ios)     add_platform ios ;;
  android) add_platform android ;;
  both)    add_platform ios; add_platform android ;;
esac

echo "→ Syncing web bundle + plugins into native projects..."
npx cap sync

echo ""
echo "✓ Capacitor scaffold ready in $HERE"
echo ""
echo "Next steps:"

case "$PLATFORM" in
  ios|both)
    echo "  Local iOS build (needs macOS + Xcode):"
    echo "    npm run ios:open                  # opens capacitor/ios/App.xcworkspace"
    echo "    → Product → Archive → Distribute to App Store Connect"
    echo ""
    ;;
esac

case "$PLATFORM" in
  android|both)
    echo "  Local Android build (needs Android Studio + JDK 17):"
    echo "    npm run android:open              # opens capacitor/android/ in Studio"
    echo "    → Build → Generate Signed Bundle / APK"
    echo ""
    ;;
esac

echo "  Cloud build from iPhone (Ionic Appflow):"
echo "    1. Sign up at https://ionic.io/appflow → import this repo (path: capacitor/)"
echo "    2. Copy the Appflow App ID → replace 'REPLACE_WITH_APPFLOW_APP_ID' in:"
echo "         - capacitor/ionic.config.json"
echo "         - capacitor/appflow.config.json"
echo "         - capacitor/capacitor.config.ts"
echo "    3. Upload signing credentials in the Appflow dashboard"
echo "    4. git push  →  Appflow auto-builds  →  install link in your inbox"
echo ""
echo "Full walkthrough: capacitor/README.md → 'Building from an iPhone'"
