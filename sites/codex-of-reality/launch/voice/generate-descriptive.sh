#!/usr/bin/env bash
# Generates audio for codex-descriptive-60s.mp4 — the "deep dive describing
# the app" version. 10 cues covering features + AU$30 price.
#
# Voice engine: Voicebox if reachable, espeak fallback.

set -e
cd "$(dirname "$0")"

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

gen_voicebox() {
  local out="$1"; shift
  local text="$*"
  echo "  → $out"
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
  echo "  → $out"
  espeak-ng -v "en-gb-x-rp+f3" -s 162 -p 55 -w "/tmp/_.wav" "$text"
  ffmpeg -y -loglevel error -i /tmp/_.wav -codec:a libmp3lame -qscale:a 4 "$out"
}
gen() {
  if [ "$VOICE_ENGINE" = "voicebox" ]; then
    if gen_voicebox "$@"; then return; fi
  fi
  gen_espeak "$@"
}

echo "Generating descriptive 60-second voiceover…"
gen descriptive-1.mp3  "What is the Codex of Reality?"
gen descriptive-2.mp3  "A biofeedback app that reads your pulse through your phone camera. No sensor required."
gen descriptive-3.mp3  "Sixteen guided breath protocols. Soft female narration on every session."
gen descriptive-4.mp3  "Tesla's three-six-nine breath. The Schumann lock at seven point eight three hertz."
gen descriptive-5.mp3  "Toroidal breath. Vagal sigh. Nadi Shodhana. The humming bee."
gen descriptive-6.mp3  "A thirteen-frequency library. Schumann, Solfeggio, four-thirty-two hertz."
gen descriptive-7.mp3  "Live audio-reactive cymatics on every protocol."
gen descriptive-8.mp3  "Streak tracking. Daily ritual. Pair a Polar or HeartMath sensor when you want clinical-grade data."
gen descriptive-9.mp3  "Thirty Australian dollars. One price. Lifetime in."
gen descriptive-10.mp3 "No subscription. No app store. Rhythmix app dot com dot a u, slash codex."

rm -f /tmp/_.wav
echo "Done."
ls -lh descriptive-*.mp3
