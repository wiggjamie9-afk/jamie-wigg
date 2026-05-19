#!/usr/bin/env bash
# Renders codex-descriptive-60s.mp4 — a 60-second "deep dive describing
# the app" video. Walks through every feature + the AU$30 price.
# Different angle from codex-60s.mp4 (which is the philosophical / Tesla
# version): this one is a feature tour.

set -e
cd "$(dirname "$0")"

SERIF=/usr/share/fonts/truetype/liberation/LiberationSerif-Italic.ttf
MONO=/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf

INK=0x0a1628
GOLD=0xd4a843
PARCH=0xf4ecd6
DIM=0xa89e85
COH=0x5ce5e0

VDIR=voice

# 1. Mix the 10 descriptive cues into a single 60s audio track
echo "Mixing descriptive voiceover…"
ffmpeg -y -loglevel error \
  -i $VDIR/descriptive-1.mp3 -i $VDIR/descriptive-2.mp3 -i $VDIR/descriptive-3.mp3 \
  -i $VDIR/descriptive-4.mp3 -i $VDIR/descriptive-5.mp3 -i $VDIR/descriptive-6.mp3 \
  -i $VDIR/descriptive-7.mp3 -i $VDIR/descriptive-8.mp3 -i $VDIR/descriptive-9.mp3 \
  -i $VDIR/descriptive-10.mp3 \
  -filter_complex "
    [0:a]adelay=500|500[c1];
    [1:a]adelay=3500|3500[c2];
    [2:a]adelay=10000|10000[c3];
    [3:a]adelay=16000|16000[c4];
    [4:a]adelay=22000|22000[c5];
    [5:a]adelay=28000|28000[c6];
    [6:a]adelay=34000|34000[c7];
    [7:a]adelay=38000|38000[c8];
    [8:a]adelay=45000|45000[c9];
    [9:a]adelay=50000|50000[c10];
    [c1][c2][c3][c4][c5][c6][c7][c8][c9][c10]amix=inputs=10:duration=longest:normalize=0
  " \
  -t 60 -codec:a libmp3lame -qscale:a 4 $VDIR/voiceover-descriptive-60s.mp3

# Helper macros
dt() {
  local text="$1"; local y="$2"; local size="$3"; local color="$4"; local start="$5"; local end="$6"
  echo "drawtext=fontfile=$SERIF:text='$text':x=(w-text_w)/2:y=$y:fontsize=$size:fontcolor=$color:enable='between(t,$start,$end)':line_spacing=8"
}
dtm() {
  local text="$1"; local y="$2"; local size="$3"; local color="$4"; local start="$5"; local end="$6"
  echo "drawtext=fontfile=$MONO:text='$text':x=(w-text_w)/2:y=$y:fontsize=$size:fontcolor=$color:enable='between(t,$start,$end)'"
}

# 2. Render the MP4
echo "Rendering codex-descriptive-60s.mp4…"
ffmpeg -y -loglevel error -stats \
  -f lavfi -i "color=c=$INK:s=1080x1920:d=60:r=30" \
  -i $VDIR/voiceover-descriptive-60s.mp3 \
  -vf "
    $(dtm 'CODEX  ·  OF REALITY' 130 28 $DIM 0 60),
    $(dtm 'A DEEP DIVE' 175 18 $GOLD 0 60),

    $(dtm 'CHAPTER 1' 700 22 $DIM 0.5 3.5),
    $(dt 'What is the' 820 80 $PARCH 0.5 3.5),
    $(dt 'Codex of Reality?' 940 88 $GOLD 0.5 3.5),

    $(dtm 'CHAPTER 2  ·  THE COHERENCE ENGINE' 700 22 $DIM 3.5 10),
    $(dt 'A biofeedback app' 820 72 $PARCH 3.5 10),
    $(dt 'that reads your pulse' 920 72 $PARCH 3.5 10),
    $(dt 'through your camera.' 1020 72 $GOLD 3.5 10),
    $(dtm 'NO SENSOR REQUIRED' 1150 22 $COH 3.5 10),

    $(dtm 'CHAPTER 3  ·  THE LIBRARY' 700 22 $DIM 10 16),
    $(dt 'Sixteen guided' 800 76 $PARCH 10 16),
    $(dt 'breath protocols.' 900 76 $GOLD 10 16),
    $(dt 'Soft female' 1010 76 $PARCH 10 16),
    $(dt 'narration.' 1110 76 $PARCH 10 16),

    $(dtm 'THE TESLA CODEX' 700 22 $GOLD 16 22),
    $(dt 'Teslas' 800 70 $PARCH 16 22),
    $(dt '3-6-9 Breath' 880 96 $GOLD 16 22),
    $(dt 'The Schumann Lock' 1000 60 $PARCH 16 22),
    $(dtm '7.83 HZ  ·  EARTH FUNDAMENTAL' 1090 22 $COH 16 22),

    $(dtm 'ALSO INCLUDED' 700 22 $DIM 22 28),
    $(dt 'Toroidal Breath' 830 68 $PARCH 22 28),
    $(dt 'Vagal Sigh' 920 68 $PARCH 22 28),
    $(dt 'Nadi Shodhana' 1010 68 $GOLD 22 28),
    $(dt 'The Humming Bee' 1100 68 $PARCH 22 28),

    $(dtm 'THE FREQUENCY LIBRARY' 700 22 $DIM 28 34),
    $(dt '13 Frequencies' 820 80 $GOLD 28 34),
    $(dtm 'SCHUMANN  ·  SOLFEGGIO  ·  TESLA 432 HZ' 940 22 $PARCH 28 34),

    $(dtm 'AUDIO-REACTIVE' 700 22 $DIM 34 38),
    $(dt 'Live Chladni' 800 80 $PARCH 34 38),
    $(dt 'cymatics.' 910 84 $GOLD 34 38),

    $(dtm 'THE DAILY RITUAL' 700 22 $DIM 38 45),
    $(dt 'Streak tracking.' 800 70 $PARCH 38 45),
    $(dt 'Pair a Polar' 890 70 $PARCH 38 45),
    $(dt 'or HeartMath' 980 70 $PARCH 38 45),
    $(dt 'when you want it.' 1080 70 $GOLD 38 45),

    $(dtm 'ONE PRICE  ·  LIFETIME' 700 22 $GOLD 45 50),
    $(dt 'AU 30' 800 240 $GOLD 45 50),

    $(dtm 'NO SUBSCRIPTION  ·  NO APP STORE' 800 28 $DIM 50 60),
    $(dt 'Reality has a' 900 80 $PARCH 50 60),
    $(dt 'frequency.' 1010 100 $GOLD 50 60),
    $(dtm 'rhythmixapp.com.au/codex' 1170 30 $PARCH 50 60)
  " \
  -c:v libx264 -preset medium -crf 21 -pix_fmt yuv420p \
  -c:a aac -b:a 160k \
  -t 60 \
  codex-descriptive-60s.mp4

ls -lh codex-descriptive-60s.mp4
echo "Done."
