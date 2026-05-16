#!/usr/bin/env bash
# RHYTHMIX — Expo scaffold setup.
# Usage:
#   bash setup.sh ios       # prep for an iOS build
#   bash setup.sh android   # prep for an Android build
#   bash setup.sh both      # default — prep for both
#
# Idempotent. Safe to re-run any time.

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

echo "→ Installing Expo dependencies..."
npm install

echo "→ Aligning packages with the current Expo SDK..."
npx expo install --fix || {
  echo "  (expo install --fix had non-zero exit — usually safe to continue)"
}

if ! command -v eas >/dev/null 2>&1; then
  echo ""
  echo "ℹ  EAS CLI not found. Installing globally..."
  npm install -g eas-cli
fi

echo ""
echo "✓ Expo scaffold ready in $HERE"
echo ""
echo "Next steps:"
echo "  1. eas login                            # sign into your Expo account"
echo "  2. eas init                             # writes the EAS projectId into app.json"
echo "  3. edit app.json → replace 'owner' with your Expo username"

case "$PLATFORM" in
  ios)
    echo "  4. eas build --profile development --platform ios"
    ;;
  android)
    echo "  4. eas build --profile development --platform android"
    ;;
  both)
    echo "  4. eas build --profile development --platform all"
    ;;
esac

echo "  5. Install the resulting build on your iPhone via Expo Orbit or the build URL."
echo ""
echo "For store submission, see README.md → 'Submit to the stores'."
