#!/bin/bash

# SURGE Pilot — Ziggy Voice Generation
# Generates 4 TTS audio files for interior monologue
# Requirements: ElevenLabs API key in ELEVENLABS_API_KEY env var
# Output: WAV files in production/surge-pilot/ziggy-voice/

set -e

VOICE_ID="21m00Tcm4TlvDq8ikWAM"  # ElevenLabs "Bella" (young, bright voice)
API_KEY="${ELEVENLABS_API_KEY}"
OUTPUT_DIR="ziggy-voice"

if [ -z "$API_KEY" ]; then
  echo "ERROR: ELEVENLABS_API_KEY not set"
  echo "Set it via: export ELEVENLABS_API_KEY=sk-..."
  exit 1
fi

mkdir -p "$OUTPUT_DIR"

echo "🎤 Generating Ziggy voice narration..."

# Line 1: Anxious confusion (Act 1, Shot 3)
echo "  [1/4] Wait, what? What'd she say? (anxious, quick)"
curl -s -X POST "https://api.elevenlabs.io/v1/text-to-speech/$VOICE_ID" \
  -H "xi-api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Wait, what? What did she say?",
    "model_id": "eleven_monolingual_v1",
    "voice_settings": {
      "stability": 0.65,
      "similarity_boost": 0.80,
      "style": 0.2,
      "use_speaker_boost": true
    }
  }' > "$OUTPUT_DIR/line-1-1-wait-what.mp3"

# Convert MP3 to WAV (requires ffmpeg)
ffmpeg -i "$OUTPUT_DIR/line-1-1-wait-what.mp3" -acodec pcm_s16le -ar 44100 \
  "$OUTPUT_DIR/line-1-1-wait-what.wav" -y 2>/dev/null
rm "$OUTPUT_DIR/line-1-1-wait-what.mp3"

# Line 2: Fragmented sensory escalation (Act 1, Shot 4a)
echo "  [2/4] Hum... click... tap... everyone's watching... (fragmented, anxious)"
curl -s -X POST "https://api.elevenlabs.io/v1/text-to-speech/$VOICE_ID" \
  -H "xi-api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hum... click... tap... everyone is watching...",
    "model_id": "eleven_monolingual_v1",
    "voice_settings": {
      "stability": 0.55,
      "similarity_boost": 0.75,
      "style": 0.3,
      "use_speaker_boost": true
    }
  }' > "$OUTPUT_DIR/line-1-2-sensory.mp3"

ffmpeg -i "$OUTPUT_DIR/line-1-2-sensory.mp3" -acodec pcm_s16le -ar 44100 \
  "$OUTPUT_DIR/line-1-2-sensory.wav" -y 2>/dev/null
rm "$OUTPUT_DIR/line-1-2-sensory.mp3"

# Line 3: Realization warmth (Act 3, Shot 17)
echo "  [3/4] This is... me. This is who I am. (warm realization, slower)"
curl -s -X POST "https://api.elevenlabs.io/v1/text-to-speech/$VOICE_ID" \
  -H "xi-api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "This is... me. This is who I am.",
    "model_id": "eleven_monolingual_v1",
    "voice_settings": {
      "stability": 0.75,
      "similarity_boost": 0.85,
      "style": 0.1,
      "use_speaker_boost": true
    }
  }' > "$OUTPUT_DIR/line-3-1-this-is-me.mp3"

ffmpeg -i "$OUTPUT_DIR/line-3-1-this-is-me.mp3" -acodec pcm_s16le -ar 44100 \
  "$OUTPUT_DIR/line-3-1-this-is-me.wav" -y 2>/dev/null
rm "$OUTPUT_DIR/line-3-1-this-is-me.mp3"

# Line 4: Confident empowerment (Act 3, Shot 23)
echo "  [4/4] I was never broken. I was just waiting to SURGE. (confident, resolved)"
curl -s -X POST "https://api.elevenlabs.io/v1/text-to-speech/$VOICE_ID" \
  -H "xi-api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "I was never broken. I was just waiting to SURGE.",
    "model_id": "eleven_monolingual_v1",
    "voice_settings": {
      "stability": 0.80,
      "similarity_boost": 0.85,
      "style": 0.0,
      "use_speaker_boost": true
    }
  }' > "$OUTPUT_DIR/line-3-2-never-broken.mp3"

ffmpeg -i "$OUTPUT_DIR/line-3-2-never-broken.mp3" -acodec pcm_s16le -ar 44100 \
  "$OUTPUT_DIR/line-3-2-never-broken.wav" -y 2>/dev/null
rm "$OUTPUT_DIR/line-3-2-never-broken.mp3"

echo "✅ Voice generation complete!"
echo "Output files:"
ls -lh "$OUTPUT_DIR"/*.wav

echo ""
echo "Next: Wire audio into HyperFrames composition (index.html)"
