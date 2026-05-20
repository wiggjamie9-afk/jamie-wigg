#!/bin/bash
# Bake narration onto pitch.mp4 → pitch-voiced.mp4
# 1. Generate narration.mp3 in ElevenLabs from paste.txt (Voice: see narration-script.md)
# 2. Drop the resulting MP3 in this folder as: narration.mp3
# 3. Run: bash bake.sh
set -e
cd "$(dirname "$0")"
if [ ! -f narration.mp3 ]; then
  echo "ERROR: narration.mp3 not found. Generate it from paste.txt via ElevenLabs first."
  exit 1
fi
if [ ! -f "pitch.mp4" ]; then
  echo "ERROR: pitch.mp4 not found"
  exit 1
fi
echo "Baking narration.mp3 onto pitch.mp4 -> pitch-voiced.mp4"
ffmpeg -y -i "pitch.mp4" -i narration.mp3   -c:v copy -c:a aac -b:a 192k -t 60   -map 0:v -map 1:a   -movflags +faststart   -loglevel error   "pitch-voiced.mp4"
echo "Done: $(pwd)/pitch-voiced.mp4"
ls -la "pitch-voiced.mp4"
