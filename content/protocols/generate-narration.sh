#!/usr/bin/env bash
# Generates pre-rendered narration MP3s for every Codex protocol, stored at
# sites/codex-of-reality/audio/<slug>/<idx>.mp3. The deployed app fetches
# these at protocol-player load time and plays them as the script lines fire
# — replacing the iOS Samantha Web Speech narration with a real voice.
#
# Voice engine:
#   1. Voicebox local server (https://voicebox.sh)
#      VOICEBOX_URL=http://127.0.0.1:17493
#      VOICEBOX_PROFILE=Jamie    (clone your voice as "Jamie" in Voicebox first)
#   2. espeak-ng fallback if Voicebox isn't reachable.
#
# Source of truth: the PROTOCOLS array in sites/codex-of-reality/app.html.
# This script extracts each protocol's script lines and generates an MP3 for
# each one, ordered by playback index.

set -e

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
APP_HTML="$REPO_ROOT/sites/codex-of-reality/app.html"
OUT_ROOT="$REPO_ROOT/sites/codex-of-reality/audio"

VOICEBOX_URL="${VOICEBOX_URL:-http://127.0.0.1:17493}"
VOICEBOX_PROFILE="${VOICEBOX_PROFILE:-Jamie}"
VOICE_ENGINE="${VOICE_ENGINE:-}"

if [ -z "$VOICE_ENGINE" ]; then
  if curl -s --max-time 2 "$VOICEBOX_URL/profiles" >/dev/null 2>&1; then
    VOICE_ENGINE=voicebox
  else
    VOICE_ENGINE=espeak
  fi
fi

echo "Voice engine: $VOICE_ENGINE"
[ "$VOICE_ENGINE" = "voicebox" ] && echo "  Voicebox at $VOICEBOX_URL, profile '$VOICEBOX_PROFILE'"

# Extract the PROTOCOLS array from app.html as JSON so we can iterate.
# The array uses object literal syntax — we convert it to JSON with node.
PROTOCOLS_JSON=$(node -e "
  const fs = require('fs');
  const src = fs.readFileSync('$APP_HTML', 'utf8');
  const start = src.indexOf('const PROTOCOLS = [');
  const arrStart = src.indexOf('[', start);
  // Find matching closing bracket
  let depth = 0, i = arrStart;
  for (; i < src.length; i++) {
    if (src[i] === '[') depth++;
    else if (src[i] === ']') { depth--; if (depth === 0) break; }
  }
  const body = src.slice(arrStart, i + 1);
  // eval the literal — trusted local source
  const PROTOCOLS = eval(body);
  process.stdout.write(JSON.stringify(PROTOCOLS.map(p => ({
    slug: p.slug,
    title: p.title,
    script: p.script,
  }))));
")

gen_voicebox() {
  local out="$1"; shift
  local text="$*"
  local resp; resp=$(curl -s -X POST "$VOICEBOX_URL/generate" \
    -H "Content-Type: application/json" \
    -d "$(jq -nc --arg text "$text" --arg profile "$VOICEBOX_PROFILE" \
      '{text:$text, profile:$profile, language:"en", return_audio:true}')")
  local audio_url; audio_url=$(echo "$resp" | jq -r '.audio_url // .url // empty')
  if [ -n "$audio_url" ]; then
    curl -sL -o "/tmp/_.wav" "$VOICEBOX_URL$audio_url" || curl -sL -o "/tmp/_.wav" "$audio_url"
  else
    echo "$resp" | jq -r '.audio_b64 // .audio // empty' | base64 -d > /tmp/_.wav
  fi
  if [ ! -s /tmp/_.wav ]; then return 1; fi
  ffmpeg -y -loglevel error -i /tmp/_.wav -codec:a libmp3lame -qscale:a 4 "$out"
}

gen_espeak() {
  local out="$1"; shift
  local text="$*"
  espeak-ng -v "en-gb-x-rp+f3" -s 160 -p 55 -w "/tmp/_.wav" "$text"
  ffmpeg -y -loglevel error -i /tmp/_.wav -codec:a libmp3lame -qscale:a 4 "$out"
}

gen() {
  if [ "$VOICE_ENGINE" = "voicebox" ]; then
    if gen_voicebox "$@"; then return; fi
    echo "  (voicebox failed, fallback to espeak)"
  fi
  gen_espeak "$@"
}

# Iterate protocols and emit per-line MP3s
echo "$PROTOCOLS_JSON" | jq -c '.[]' | while read -r p; do
  slug=$(echo "$p" | jq -r '.slug')
  title=$(echo "$p" | jq -r '.title')
  count=$(echo "$p" | jq '.script | length')
  echo ""
  echo "▶ $title  ($slug, $count lines)"
  mkdir -p "$OUT_ROOT/$slug"
  for i in $(seq 0 $((count - 1))); do
    text=$(echo "$p" | jq -r ".script[$i][1]")
    out="$OUT_ROOT/$slug/$i.mp3"
    echo "    [$i] $text"
    gen "$out" "$text"
  done
done

rm -f /tmp/_.wav

echo ""
echo "Done. $(find "$OUT_ROOT" -name '*.mp3' | wc -l) MP3 files written under sites/codex-of-reality/audio/"
du -sh "$OUT_ROOT"
