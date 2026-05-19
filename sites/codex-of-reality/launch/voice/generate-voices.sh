#!/usr/bin/env bash
# Generates the multi-voice "people talking" cast for codex-voices-60s.mp4.
# Four espeak-ng voice variants stand in for four different speakers.
#
# To swap in REAL human voices later:
#   1. Have four friends record each line on their phone (Voice Memos).
#   2. Convert each recording to MP3, name it voices-NN-vM.mp3 (NN = cue
#      number 01-12, M = speaker 1-4).
#   3. Re-run ../render-voices-mp4.sh to rebuild the video with real voices.

set -e
cd "$(dirname "$0")"

V1="en-gb-x-rp+f3"   # SPEAKER 01 · British female, calm  (narrator)
V2="en-us+m4"        # SPEAKER 02 · American male, warm   (testimonial)
V3="en-au+f2"        # SPEAKER 03 · Australian female     (relatable)
V4="en-gb-x-rp+m3"   # SPEAKER 04 · British male, deep    (authority)
SPEED=158
PITCH=55

gen() {
  local out="$1"; local voice="$2"; shift 2
  local text="$*"
  echo "  → $out  ($voice)"
  espeak-ng -v "$voice" -s "$SPEED" -p "$PITCH" -w "/tmp/_.wav" "$text"
  ffmpeg -y -loglevel error -i /tmp/_.wav -codec:a libmp3lame -qscale:a 4 "$out"
}

echo "Generating multi-voice cast (12 cues, 4 speakers)…"

gen voices-01-v1.mp3 "$V1" "It started with a question."
gen voices-02-v2.mp3 "$V2" "What if biofeedback didn't have to live in a clinic?"
gen voices-03-v3.mp3 "$V3" "What if Tesla's three-six-nine wasn't just a quote?"
gen voices-04-v4.mp3 "$V4" "What if you could read your own heart, through your camera, right now?"
gen voices-05-v1.mp3 "$V1" "This is the Codex of Reality."
gen voices-06-v2.mp3 "$V2" "The first biofeedback platform built for the mystic, not the biohacker."
gen voices-07-v3.mp3 "$V3" "Live heart coherence. Tesla's three-six-nine breath."
gen voices-08-v4.mp3 "$V4" "The Schumann lock, at seven point eight three hertz."
gen voices-09-v1.mp3 "$V1" "Sixteen ancient protocols. Soft narration. Audio-reactive cymatics."
gen voices-10-v2.mp3 "$V2" "All in your browser. No subscription. No app store."
gen voices-11-v3.mp3 "$V3" "Thirty Australian dollars. One price. Lifetime in."
gen voices-12-v4.mp3 "$V4" "Rhythmix app dot com dot au, slash codex."

rm -f /tmp/_.wav
echo "Done. $(ls -1 voices-*.mp3 | wc -l) MP3 cues generated."
ls -lh voices-*.mp3
