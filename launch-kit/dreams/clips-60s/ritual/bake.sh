#!/bin/bash
# Bake narration onto ritual.mp4 → ritual-voiced.mp4
# 1. Generate narration.mp3 in ElevenLabs from paste.txt (Voice: see narration-script.md)
# 2. Drop the resulting MP3 in this folder as: narration.mp3
# 3. Run: bash bake.sh
set -e
cd "$(dirname "$0")"
if [ ! -f narration.mp3 ]; then
  echo "ERROR: narration.mp3 not found. Generate it from paste.txt via ElevenLabs first."
  exit 1
fi
if [ ! -f "ritual.mp4" ]; then
  echo "ERROR: ritual.mp4 not found"
  exit 1
fi
echo "Baking narration.mp3 onto ritual.mp4 -> ritual-voiced.mp4"
ffmpeg -y -i "ritual.mp4" -i narration.mp3   -c:v copy -c:a aac -b:a 192k -t 60   -map 0:v -map 1:a   -movflags +faststart   -loglevel error   "ritual-voiced.mp4"
echo "Done: $(pwd)/ritual-voiced.mp4"
ls -la "ritual-voiced.mp4"
