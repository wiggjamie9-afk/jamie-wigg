#!/usr/bin/env bash
# Renders the 60s and 30s videos as actual MP4 files with the voiceover baked in.
# Output: codex-60s.mp4 and codex-30s.mp4 in this folder.
# Posts directly to TikTok / Reels / Shorts — no screen recording required.

set -e
cd "$(dirname "$0")"

SERIF=/usr/share/fonts/truetype/liberation/LiberationSerif-Italic.ttf
MONO=/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf
INK=0x0a1628
GOLD=0xd4a843
PARCH=0xf4ecd6
DIM=0xa89e85
COH=0x5ce5e0

if [ ! -f "$SERIF" ] || [ ! -f "$MONO" ]; then
  echo "Required fonts not found:" >&2
  echo "  $SERIF" >&2
  echo "  $MONO" >&2
  echo "Install: sudo apt-get install -y fonts-liberation fonts-dejavu" >&2
  exit 1
fi

if [ ! -f voice/voiceover-60s.mp3 ] || [ ! -f voice/voiceover-30s.mp3 ]; then
  echo "Voiceover MP3s not found. Run: cd voice && ./generate-audio.sh" >&2
  exit 1
fi

# Helper for centered drawtext (FFmpeg syntax — escape colons in text!)
dt() {
  local text="$1"; local y="$2"; local size="$3"; local color="$4"; local start="$5"; local end="$6"
  echo "drawtext=fontfile=$SERIF:text='$text':x=(w-text_w)/2:y=$y:fontsize=$size:fontcolor=$color:enable='between(t,$start,$end)'"
}
dtm() {
  local text="$1"; local y="$2"; local size="$3"; local color="$4"; local start="$5"; local end="$6"
  echo "drawtext=fontfile=$MONO:text='$text':x=(w-text_w)/2:y=$y:fontsize=$size:fontcolor=$color:enable='between(t,$start,$end)'"
}

echo "Rendering codex-60s.mp4 …"
ffmpeg -y -loglevel error -stats \
  -f lavfi -i "color=c=$INK:s=1080x1920:d=60:r=30" \
  -i voice/voiceover-60s.mp3 \
  -vf "
    $(dtm 'CODEX  ·  OF REALITY' 140 30 $DIM 0 60),
    $(dt 'Biofeedback lived' 800 96 $PARCH 0 8.5),
    $(dt 'in a clinic.' 920 96 $GOLD 0 8.5),
    $(dt 'Teslas 3-6-9' 800 96 $GOLD 8.5 18.5),
    $(dt 'lived in a quote.' 920 96 $PARCH 8.5 18.5),
    $(dt '249 dollar sensor.' 760 88 $DIM 18.5 30.5),
    $(dt '89 a year subscription.' 880 88 $DIM 18.5 30.5),
    $(dt 'Today, that ends.' 1000 88 $GOLD 18.5 30.5),
    $(dt 'Reality' 800 116 $GOLD 30.5 42.5),
    $(dt 'has a frequency.' 940 92 $PARCH 30.5 42.5),
    $(dtm 'LIVE HRV  ·  TESLA 3-6-9  ·  SCHUMANN LOCK' 1120 26 $DIM 32 42.5),
    $(dt 'The first biofeedback' 760 76 $PARCH 42.5 52.5),
    $(dt 'platform built for the' 870 76 $PARCH 42.5 52.5),
    $(dt 'mystic.' 990 110 $GOLD 42.5 52.5),
    $(dtm 'ONE PRICE  ·  LIFETIME IN' 700 28 $DIM 52.5 60),
    $(dt 'AU 30' 850 220 $GOLD 52.5 60),
    $(dtm 'rhythmixapp.com.au/codex' 1120 30 $PARCH 52.5 60)
  " \
  -c:v libx264 -preset medium -crf 21 -pix_fmt yuv420p \
  -c:a copy -shortest \
  codex-60s.mp4

echo "Rendering codex-30s.mp4 …"
ffmpeg -y -loglevel error -stats \
  -f lavfi -i "color=c=$INK:s=1080x1920:d=30:r=30" \
  -i voice/voiceover-30s.mp3 \
  -vf "
    $(dtm 'CODEX  ·  OF REALITY' 140 30 $DIM 0 30),
    $(dt 'They said biofeedback' 820 80 $PARCH 0 5.5),
    $(dt 'needed a 249 sensor.' 920 80 $GOLD 0 5.5),
    $(dt 'The Codex reads' 760 88 $PARCH 5.5 13.5),
    $(dt 'your heart through' 860 88 $PARCH 5.5 13.5),
    $(dt 'your camera.' 960 100 $GOLD 5.5 13.5),
    $(dt 'Teslas 3-6-9' 800 100 $GOLD 13.5 20.5),
    $(dt 'breath.' 920 100 $PARCH 13.5 20.5),
    $(dt 'The Earths' 800 92 $PARCH 20.5 25.5),
    $(dt 'resonance.' 900 92 $GOLD 20.5 25.5),
    $(dt 'AU 30' 800 220 $GOLD 25.5 30),
    $(dtm 'LIFETIME  ·  rhythmixapp.com.au/codex' 1100 28 $PARCH 25.5 30)
  " \
  -c:v libx264 -preset medium -crf 21 -pix_fmt yuv420p \
  -c:a copy -shortest \
  codex-30s.mp4

ls -lh codex-*.mp4
echo "Done. Upload these directly to TikTok / Reels / Shorts."
