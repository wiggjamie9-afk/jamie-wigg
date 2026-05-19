#!/usr/bin/env bash
# Generates audio for the three "talking video" trio:
#   codex-founder-60s.mp4   — Voice A · British male  (founder pitch)
#   codex-walkthrough-60s.mp4 — Voice B · American female (product tour)
#   codex-math-60s.mp4      — Voice C · British female (value math)
#
# Voice engine: Voicebox if reachable, espeak fallback.
# Same Voicebox swap pattern as generate-audio.sh / generate-voices.sh.

set -e
cd "$(dirname "$0")"

VOICEBOX_URL="${VOICEBOX_URL:-http://127.0.0.1:17493}"
VBP_A="${VOICEBOX_PROFILE_A:-${VOICEBOX_PROFILE:-Jamie}}"     # founder pitch
VBP_B="${VOICEBOX_PROFILE_B:-${VOICEBOX_PROFILE:-Jamie}}"     # walkthrough
VBP_C="${VOICEBOX_PROFILE_C:-${VOICEBOX_PROFILE:-Jamie}}"     # math
VOICE_ENGINE="${VOICE_ENGINE:-}"

# Espeak fallbacks per voice slot
ESPEAK_A="en-gb-x-rp+m4"     # British male, authoritative
ESPEAK_B="en-us+f5"          # American female, energetic
ESPEAK_C="en-gb-x-rp+f3"     # British female, calm

SPEED=160
PITCH=55

if [ -z "$VOICE_ENGINE" ]; then
  if curl -s --max-time 2 "$VOICEBOX_URL/profiles" >/dev/null 2>&1; then
    VOICE_ENGINE=voicebox
  else
    VOICE_ENGINE=espeak
  fi
fi
echo "Voice engine: $VOICE_ENGINE"

gen_voicebox() {
  local out="$1"; local profile="$2"; shift 2
  local text="$*"
  echo "  → $out  ($profile)"
  local resp; resp=$(curl -s -X POST "$VOICEBOX_URL/generate" \
    -H "Content-Type: application/json" \
    -d "$(jq -nc --arg text "$text" --arg profile "$profile" \
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
  local out="$1"; local voice="$2"; shift 2
  local text="$*"
  echo "  → $out  ($voice)"
  espeak-ng -v "$voice" -s "$SPEED" -p "$PITCH" -w "/tmp/_.wav" "$text"
  ffmpeg -y -loglevel error -i /tmp/_.wav -codec:a libmp3lame -qscale:a 4 "$out"
}
# Args: outfile, slot (A|B|C), text...
gen() {
  local out="$1"; local slot="$2"; shift 2
  local text="$*"
  local vbp_var="VBP_$slot"; local profile="${!vbp_var}"
  local es_var="ESPEAK_$slot"; local voice="${!es_var}"
  if [ "$VOICE_ENGINE" = "voicebox" ]; then
    if gen_voicebox "$out" "$profile" "$text"; then return; fi
  fi
  gen_espeak "$out" "$voice" "$text"
}

echo "=== Video 1 · Founder Pitch (Voice A) ==="
gen founder-1.mp3  A "Hi. I'm Jamie. I built the Codex of Reality."
gen founder-2.mp3  A "For a year I made videos about ancient breath protocols."
gen founder-3.mp3  A "One hundred and eighty-three thousand followers. Nine hundred and thirty-five thousand likes."
gen founder-4.mp3  A "But the protocols were just videos. You couldn't measure them."
gen founder-5.mp3  A "So I built the app that does."
gen founder-6.mp3  A "Live HRV coherence reading from your phone camera."
gen founder-7.mp3  A "Sixteen protocols. Tesla three-six-nine. The Schumann lock."
gen founder-8.mp3  A "Eight months of building. One price for life."
gen founder-9.mp3  A "Thirty Australian dollars. No subscription. No app store."
gen founder-10.mp3 A "Rhythmix app dot com dot a u, slash codex."

echo "=== Video 2 · The Walkthrough (Voice B) ==="
gen walk-1.mp3  B "You open the Codex of Reality."
gen walk-2.mp3  B "You tap any protocol."
gen walk-3.mp3  B "You place your finger on the camera lens."
gen walk-4.mp3  B "Your pulse appears in eight seconds."
gen walk-5.mp3  B "The orb begins to breathe. Five in. Five out."
gen walk-6.mp3  B "Coherence climbs as your heart syncs."
gen walk-7.mp3  B "Sixteen protocols ship today."
gen walk-8.mp3  B "Thirteen frequencies in the library."
gen walk-9.mp3  B "Audio-reactive cymatics on every session."
gen walk-10.mp3 B "Thirty Australian dollars. Lifetime. Reality has a frequency."

echo "=== Video 3 · The Math (Voice C) ==="
gen math-1.mp3  C "Let's do the math."
gen math-2.mp3  C "HeartMath Inner Balance — two hundred and forty-nine dollar sensor."
gen math-3.mp3  C "Plus ninety-nine dollars a year for the subscription."
gen math-4.mp3  C "Calm. Seventy dollars a year for guided meditations. No biofeedback."
gen math-5.mp3  C "Welltory. Eighty-nine dollars a year for HRV from your camera."
gen math-6.mp3  C "The Codex of Reality."
gen math-7.mp3  C "Camera HRV. Tesla three-six-nine. The Schumann lock. Sixteen protocols."
gen math-8.mp3  C "Thirty Australian dollars. Once. Forever."
gen math-9.mp3  C "Less than four months of Calm."
gen math-10.mp3 C "Rhythmix app dot com dot a u, slash codex."

rm -f /tmp/_.wav
echo "Done. $(ls -1 founder-*.mp3 walk-*.mp3 math-*.mp3 2>/dev/null | wc -l) cues across 3 videos."
