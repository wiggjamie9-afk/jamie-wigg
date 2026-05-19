#!/usr/bin/env bash
# Renders every launch HTML file to a downloadable JPG/PNG image.
# Output lands next to the source file (e.g. thumbnail-1200x630.jpg).
# Re-run after editing any HTML to refresh the rendered image.

set -e
cd "$(dirname "$0")"

# Try to make Qt happy headless
export QT_QPA_PLATFORM=offscreen
export XDG_RUNTIME_DIR=/tmp/runtime-root
mkdir -p "$XDG_RUNTIME_DIR" && chmod 700 "$XDG_RUNTIME_DIR"

render() {
  local html="$1"; local w="$2"; local h="$3"; local out="$4"
  if [ ! -f "$html" ]; then echo "  ! missing: $html" >&2; return; fi
  echo "  → $out (${w}×${h})"
  # JPG at 92% quality — strong enough for social, ~500KB–1.5MB per image
  wkhtmltoimage --quiet \
    --enable-local-file-access \
    --javascript-delay 1200 \
    --width "$w" --height "$h" \
    --quality 92 \
    "$html" "$out" 2>/dev/null || echo "    failed"
}

echo "Rendering launch visuals to JPG…"

# Thumbnails
render thumbnail-1200x630.html         1200  630  thumbnail-1200x630.jpg
render thumbnail-tiktok-1080x1920.html 1080 1920  thumbnail-tiktok-1080x1920.jpg
render thumbnail-youtube-1280x720.html 1280  720  thumbnail-youtube-1280x720.jpg

# Front-page / hero
render hero-1920x1080.html             1920 1080  hero-1920x1080.jpg
render frontpage-1920x1080.html        1920 1080  frontpage-1920x1080.jpg

# Carousel tiles (1080×1080 square)
render tile-1-coherence-engine.html    1080 1080  tile-1-coherence-engine.jpg
render tile-2-tesla-codex.html         1080 1080  tile-2-tesla-codex.jpg
render tile-3-frequencies.html         1080 1080  tile-3-frequencies.jpg
render tile-4-lifetime.html            1080 1080  tile-4-lifetime.jpg

# People triptych (1080×1350 portrait)
render people-1-finger-on-camera.html  1080 1350  people-1-finger-on-camera.jpg
render people-2-breathing.html         1080 1350  people-2-breathing.jpg
render people-3-coherence.html         1080 1350  people-3-coherence.jpg

echo ""
echo "Done."
ls -lh *.jpg 2>/dev/null | head -20
