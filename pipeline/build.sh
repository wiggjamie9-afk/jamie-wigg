#!/usr/bin/env bash
# End-to-end pipeline: prompt -> campaign -> voiceover -> rendered MP4.
# Usage: ./pipeline/build.sh "your topic here" [duration_seconds]

set -euo pipefail

TOPIC="${1:?Usage: $0 \"topic\" [duration_seconds]}"
DURATION="${2:-20}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CAMPAIGN="$ROOT/video/campaigns/active.json"
OUT="$ROOT/out/$(date +%Y%m%d-%H%M%S).mp4"

mkdir -p "$ROOT/out"

echo "==> 1/3 generating campaign for: $TOPIC"
python "$ROOT/pipeline/generate_campaign.py" "$TOPIC" --out "$CAMPAIGN" --duration "$DURATION"

if [ -n "${ELEVENLABS_API_KEY:-}" ]; then
  echo "==> 2/3 synthesizing voiceover"
  python "$ROOT/pipeline/generate_voice.py" "$CAMPAIGN"
else
  echo "==> 2/3 ELEVENLABS_API_KEY not set, skipping voiceover"
fi

echo "==> 3/3 rendering video to $OUT"
cd "$ROOT/video"
npx remotion render Campaign "$OUT"
echo "done: $OUT"
