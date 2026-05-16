#!/usr/bin/env bash
# Copy the RHYTHMIX static site from the repo root into capacitor/www/ so
# Capacitor can bundle it into the native iOS / Android binaries.
#
# Re-run any time the site changes:
#   npm run build:www      (then `npx cap sync` to push into ios/android projects)

set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CAP_DIR="$(cd "$HERE/.." && pwd)"
ROOT_DIR="$(cd "$CAP_DIR/.." && pwd)"
WWW_DIR="$CAP_DIR/www"

echo "→ Cleaning $WWW_DIR"
rm -rf "$WWW_DIR"
mkdir -p "$WWW_DIR"

echo "→ Copying HTML pages from $ROOT_DIR"
shopt -s nullglob
for f in "$ROOT_DIR"/*.html; do
  cp "$f" "$WWW_DIR/"
done

echo "→ Copying icons / manifest / static assets"
for f in \
  "$ROOT_DIR/manifest.webmanifest" \
  "$ROOT_DIR/favicon.svg" \
  "$ROOT_DIR/apple-touch-icon.png" \
  "$ROOT_DIR/icon-192.png" \
  "$ROOT_DIR/icon-512.png" \
  "$ROOT_DIR/robots.txt" \
  "$ROOT_DIR/sitemap.xml" \
; do
  [ -f "$f" ] && cp "$f" "$WWW_DIR/"
done

# index.html is required by Capacitor — if the repo's root index.html isn't
# already there (it should be), fall back to rhythmix.html as the entry.
if [ ! -f "$WWW_DIR/index.html" ] && [ -f "$WWW_DIR/rhythmix.html" ]; then
  echo "→ No index.html found; aliasing rhythmix.html → index.html"
  cp "$WWW_DIR/rhythmix.html" "$WWW_DIR/index.html"
fi

if [ ! -f "$WWW_DIR/index.html" ]; then
  echo "✗ ERROR: capacitor/www/index.html is missing. Capacitor needs an entry point." >&2
  exit 1
fi

COUNT=$(find "$WWW_DIR" -type f | wc -l | tr -d ' ')
echo "✓ Built capacitor/www/ ($COUNT files)"
