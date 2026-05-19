#!/usr/bin/env bash
# Generates the voiceover audio used by video-60s.html and video-30s.html.
#
# Voice engine — picked in this order:
#   1. Voicebox local server (https://voicebox.sh) — set $VOICEBOX_URL and
#      $VOICEBOX_PROFILE. Default: http://127.0.0.1:17493, profile "Jamie".
#      This is the upgrade path: install Voicebox, clone your voice as
#      "Jamie", run this script, every video narrates in your own voice.
#   2. espeak-ng (fallback) — synthetic British female RP. Works without any
#      server. Used in CI / when Voicebox isn't running.
#
# Override to force one engine:
#   VOICE_ENGINE=voicebox ./generate-audio.sh
#   VOICE_ENGINE=espeak   ./generate-audio.sh

set -e
cd "$(dirname "$0")"

VOICEBOX_URL="${VOICEBOX_URL:-http://127.0.0.1:17493}"
VOICEBOX_PROFILE="${VOICEBOX_PROFILE:-Jamie}"
VOICE_ENGINE="${VOICE_ENGINE:-}"

# Auto-detect if Voicebox is reachable
if [ -z "$VOICE_ENGINE" ]; then
  if curl -s --max-time 2 "$VOICEBOX_URL/profiles" >/dev/null 2>&1; then
    VOICE_ENGINE=voicebox
  else
    VOICE_ENGINE=espeak
  fi
fi

echo "Voice engine: $VOICE_ENGINE"
if [ "$VOICE_ENGINE" = "voicebox" ]; then
  echo "  → Voicebox at $VOICEBOX_URL, profile '$VOICEBOX_PROFILE'"
fi

gen_voicebox() {
  local out="$1"; shift
  local text="$*"
  echo "  → $out"
  # Voicebox /generate returns a job id; poll until done, then download audio.
  # The simpler /speak endpoint plays through the OS speaker — not what we want
  # for file generation. Use /generate (file output) via the job API.
  local resp; resp=$(curl -s -X POST "$VOICEBOX_URL/generate" \
    -H "Content-Type: application/json" \
    -d "$(jq -nc --arg text "$text" --arg profile "$VOICEBOX_PROFILE" \
      '{text:$text, profile:$profile, language:"en", return_audio:true}')")
  if [ -z "$resp" ] || echo "$resp" | grep -qi 'error'; then
    echo "    Voicebox error — falling back to espeak"
    gen_espeak "$out" "$text"
    return
  fi
  # Extract audio_url or base64 from response; Voicebox API exposes either
  local audio_url; audio_url=$(echo "$resp" | jq -r '.audio_url // .url // empty')
  if [ -n "$audio_url" ]; then
    curl -sL -o "/tmp/_.wav" "$VOICEBOX_URL$audio_url" || curl -sL -o "/tmp/_.wav" "$audio_url"
  else
    # base64 fallback
    echo "$resp" | jq -r '.audio_b64 // .audio // empty' | base64 -d > /tmp/_.wav
  fi
  if [ ! -s /tmp/_.wav ]; then
    echo "    Voicebox returned empty audio — falling back to espeak"
    gen_espeak "$out" "$text"
    return
  fi
  ffmpeg -y -loglevel error -i /tmp/_.wav -codec:a libmp3lame -qscale:a 4 "$out"
}

gen_espeak() {
  local out="$1"; shift
  local text="$*"
  echo "  → $out"
  espeak-ng -v "en-gb-x-rp+f3" -s 160 -p 55 -w "/tmp/_.wav" "$text"
  ffmpeg -y -loglevel error -i /tmp/_.wav -codec:a libmp3lame -qscale:a 4 "$out"
}

gen() {
  if [ "$VOICE_ENGINE" = "voicebox" ]; then gen_voicebox "$@"; else gen_espeak "$@"; fi
}

echo "Generating 60-second video voiceover…"
gen 60s-1.mp3 "For a hundred years, biofeedback lived in a clinic."
gen 60s-2.mp3 "Tesla's three, six, and nine lived in a quote."
gen 60s-3.mp3 "The two hundred and forty-nine dollar sensor. The eighty-nine a year subscription. Today, that ends."
gen 60s-4.mp3 "The Codex of Reality. Reality has a frequency."
gen 60s-5.mp3 "Live heart coherence. Tesla's three-six-nine breath. The Earth's resonance."
gen 60s-6.mp3 "The first biofeedback platform built for the mystic. Not the biohacker."
gen 60s-7.mp3 "Thirty Australian dollars. One price. Lifetime in."
gen 60s-8.mp3 "Rhythmix app dot com dot au, slash codex."

echo "Generating 30-second video voiceover…"
gen 30s-1.mp3 "They said biofeedback needed a two hundred and forty-nine dollar sensor."
gen 30s-2.mp3 "The Codex reads your heart through your camera. Live HRV. In your browser."
gen 30s-3.mp3 "Tesla's three-six-nine breath. The Earth's resonance. All in one practice."
gen 30s-4.mp3 "The first biofeedback platform built for the mystic."
gen 30s-5.mp3 "Thirty Australian dollars. Lifetime. Rhythmix app dot com dot au, slash codex."

rm -f /tmp/_.wav
echo "Done. $(ls -1 *.mp3 | wc -l) MP3 files generated via $VOICE_ENGINE."
ls -lh *.mp3
