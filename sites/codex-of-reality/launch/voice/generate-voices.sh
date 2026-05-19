#!/usr/bin/env bash
# Generates the multi-voice "people talking" cast for codex-voices-60s.mp4.
#
# Voice engine — picked in this order:
#   1. Voicebox local server — each "speaker" can be a different Voicebox
#      profile. Set: $VOICEBOX_URL (default http://127.0.0.1:17493) and
#         VOICEBOX_PROFILE_V1=Jamie
#         VOICEBOX_PROFILE_V2=Friend1
#         VOICEBOX_PROFILE_V3=Friend2
#         VOICEBOX_PROFILE_V4=Friend3
#      Any unset profile falls back to $VOICEBOX_PROFILE_DEFAULT (Jamie).
#   2. espeak-ng — four built-in voice variants (British/American × M/F).

set -e
cd "$(dirname "$0")"

VOICEBOX_URL="${VOICEBOX_URL:-http://127.0.0.1:17493}"
VOICEBOX_PROFILE_DEFAULT="${VOICEBOX_PROFILE_DEFAULT:-Jamie}"
VBP_V1="${VOICEBOX_PROFILE_V1:-$VOICEBOX_PROFILE_DEFAULT}"
VBP_V2="${VOICEBOX_PROFILE_V2:-$VOICEBOX_PROFILE_DEFAULT}"
VBP_V3="${VOICEBOX_PROFILE_V3:-$VOICEBOX_PROFILE_DEFAULT}"
VBP_V4="${VOICEBOX_PROFILE_V4:-$VOICEBOX_PROFILE_DEFAULT}"
VOICE_ENGINE="${VOICE_ENGINE:-}"

# Espeak fallbacks (different voices per "speaker")
ESPEAK_V1="en-gb-x-rp+f3"   # British female, calm
ESPEAK_V2="en-us+m4"        # American male
ESPEAK_V3="en-au+f2"        # Australian female
ESPEAK_V4="en-gb-x-rp+m3"   # British male
SPEED=158
PITCH=55

if [ -z "$VOICE_ENGINE" ]; then
  if curl -s --max-time 2 "$VOICEBOX_URL/profiles" >/dev/null 2>&1; then
    VOICE_ENGINE=voicebox
  else
    VOICE_ENGINE=espeak
  fi
fi

echo "Voice engine: $VOICE_ENGINE"
[ "$VOICE_ENGINE" = "voicebox" ] && echo "  → Voicebox at $VOICEBOX_URL, profiles: V1=$VBP_V1 V2=$VBP_V2 V3=$VBP_V3 V4=$VBP_V4"

gen_voicebox() {
  local out="$1"; local profile="$2"; shift 2
  local text="$*"
  echo "  → $out  (Voicebox '$profile')"
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
  if [ ! -s /tmp/_.wav ]; then
    echo "    Voicebox returned empty audio — falling back to espeak"
    return 1
  fi
  ffmpeg -y -loglevel error -i /tmp/_.wav -codec:a libmp3lame -qscale:a 4 "$out"
}

gen_espeak() {
  local out="$1"; local voice="$2"; shift 2
  local text="$*"
  echo "  → $out  ($voice)"
  espeak-ng -v "$voice" -s "$SPEED" -p "$PITCH" -w "/tmp/_.wav" "$text"
  ffmpeg -y -loglevel error -i /tmp/_.wav -codec:a libmp3lame -qscale:a 4 "$out"
}

# Generate one cue using whichever engine is active.
# Args: outfile, voice_idx (1-4), text...
gen() {
  local out="$1"; local idx="$2"; shift 2
  local text="$*"
  if [ "$VOICE_ENGINE" = "voicebox" ]; then
    local profile_var="VBP_V${idx}"
    local profile="${!profile_var}"
    if gen_voicebox "$out" "$profile" "$text"; then return; fi
  fi
  # espeak fallback
  local espeak_var="ESPEAK_V${idx}"
  local voice="${!espeak_var}"
  gen_espeak "$out" "$voice" "$text"
}

echo "Generating multi-voice cast (12 cues, 4 speakers)…"

gen voices-01-v1.mp3 1 "It started with a question."
gen voices-02-v2.mp3 2 "What if biofeedback didn't have to live in a clinic?"
gen voices-03-v3.mp3 3 "What if Tesla's three-six-nine wasn't just a quote?"
gen voices-04-v4.mp3 4 "What if you could read your own heart, through your camera, right now?"
gen voices-05-v1.mp3 1 "This is the Codex of Reality."
gen voices-06-v2.mp3 2 "The first biofeedback platform built for the mystic, not the biohacker."
gen voices-07-v3.mp3 3 "Live heart coherence. Tesla's three-six-nine breath."
gen voices-08-v4.mp3 4 "The Schumann lock, at seven point eight three hertz."
gen voices-09-v1.mp3 1 "Sixteen ancient protocols. Soft narration. Audio-reactive cymatics."
gen voices-10-v2.mp3 2 "All in your browser. No subscription. No app store."
gen voices-11-v3.mp3 3 "Thirty Australian dollars. One price. Lifetime in."
gen voices-12-v4.mp3 4 "Rhythmix app dot com dot au, slash codex."

rm -f /tmp/_.wav
echo "Done. $(ls -1 voices-*.mp3 | wc -l) MP3 cues generated via $VOICE_ENGINE."
ls -lh voices-*.mp3
