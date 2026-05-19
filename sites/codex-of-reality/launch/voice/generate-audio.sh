#!/usr/bin/env bash
# Generates the voiceover audio used by video-60s.html and video-30s.html.
# Uses espeak-ng with en-gb-x-rp+f3 (British RP female). Run from this folder:
#   ./generate-audio.sh
#
# Replace with macOS `say` for higher quality on Mac:
#   say -v Samantha -o file.aiff "text"
#   ffmpeg -i file.aiff file.mp3
#
# Or with any TTS service of your choice — just match the file names.

set -e
cd "$(dirname "$0")"

VOICE="en-gb-x-rp+f3"
SPEED=160
PITCH=55

gen() {
  local out="$1"; shift
  local text="$*"
  echo "  → $out"
  espeak-ng -v "$VOICE" -s "$SPEED" -p "$PITCH" -w "/tmp/_.wav" "$text"
  ffmpeg -y -loglevel error -i /tmp/_.wav -codec:a libmp3lame -qscale:a 4 "$out"
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
echo "Done. $(ls -1 *.mp3 | wc -l) MP3 files generated."
ls -lh *.mp3
