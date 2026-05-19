#!/usr/bin/env bash
# Renders codex-voices-60s.mp4 — a 60-second multi-voice "people talking
# about the description" video. Four espeak voice variants play four
# different "speakers" cycling through the product description with
# on-screen speaker tags and quoted lines.
#
# To swap in real recorded voices, re-record voices-01-v1.mp3 …
# voices-12-v4.mp3 (12 cues) in the voice/ folder using any TTS or
# real-human recordings, then re-run this script.

set -e
cd "$(dirname "$0")"

SERIF=/usr/share/fonts/truetype/liberation/LiberationSerif-Italic.ttf
MONO=/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf

INK=0x0a1628
GOLD=0xd4a843
PARCH=0xf4ecd6
DIM=0xa89e85
COH=0x5ce5e0

# Speaker accent colours — small chip in the corner cycles to identify who's talking
SPK1=0xd4a843   # V1 — gold (narrator)
SPK2=0x5ce5e0   # V2 — cyan
SPK3=0xff9b6c   # V3 — warm coral
SPK4=0x8ec5ff   # V4 — soft blue

VDIR=voice

# 1. Build the single mixed voiceover MP3 from the 12 cue files
echo "Mixing voiceover (12 cues, 4 speakers)…"
ffmpeg -y -loglevel error \
  -i $VDIR/voices-01-v1.mp3 -i $VDIR/voices-02-v2.mp3 -i $VDIR/voices-03-v3.mp3 \
  -i $VDIR/voices-04-v4.mp3 -i $VDIR/voices-05-v1.mp3 -i $VDIR/voices-06-v2.mp3 \
  -i $VDIR/voices-07-v3.mp3 -i $VDIR/voices-08-v4.mp3 -i $VDIR/voices-09-v1.mp3 \
  -i $VDIR/voices-10-v2.mp3 -i $VDIR/voices-11-v3.mp3 -i $VDIR/voices-12-v4.mp3 \
  -filter_complex "
    [0:a]adelay=500|500[c1];
    [1:a]adelay=3500|3500[c2];
    [2:a]adelay=7500|7500[c3];
    [3:a]adelay=12000|12000[c4];
    [4:a]adelay=17000|17000[c5];
    [5:a]adelay=20000|20000[c6];
    [6:a]adelay=26000|26000[c7];
    [7:a]adelay=31000|31000[c8];
    [8:a]adelay=35000|35000[c9];
    [9:a]adelay=41500|41500[c10];
    [10:a]adelay=47000|47000[c11];
    [11:a]adelay=52000|52000[c12];
    [c1][c2][c3][c4][c5][c6][c7][c8][c9][c10][c11][c12]amix=inputs=12:duration=longest:normalize=0
  " \
  -t 60 -codec:a libmp3lame -qscale:a 4 $VDIR/voiceover-voices-60s.mp3

# 2. Render the video with drawtext overlays per scene + the mixed voice track
echo "Rendering codex-voices-60s.mp4…"

# Helper: serif drawtext (the spoken line)
dt() {
  local text="$1"; local y="$2"; local size="$3"; local color="$4"; local start="$5"; local end="$6"
  echo "drawtext=fontfile=$SERIF:text='$text':x=(w-text_w)/2:y=$y:fontsize=$size:fontcolor=$color:enable='between(t,$start,$end)':line_spacing=8"
}
# Helper: mono drawtext (speaker tags)
dtm() {
  local text="$1"; local y="$2"; local size="$3"; local color="$4"; local start="$5"; local end="$6"
  echo "drawtext=fontfile=$MONO:text='$text':x=(w-text_w)/2:y=$y:fontsize=$size:fontcolor=$color:enable='between(t,$start,$end)'"
}

ffmpeg -y -loglevel error -stats \
  -f lavfi -i "color=c=$INK:s=1080x1920:d=60:r=30" \
  -i $VDIR/voiceover-voices-60s.mp3 \
  -vf "
    $(dtm 'CODEX  ·  OF REALITY' 130 28 $DIM 0 60),
    $(dtm 'FOUR SPEAKERS  ·  ONE QUESTION' 175 18 $GOLD 0 60),

    $(dtm 'SPEAKER 01  ·  BRITAIN' 1700 22 $SPK1 0.5 3.5),
    $(dt 'It started with a' 900 84 $PARCH 0.5 3.5),
    $(dt 'question.' 1010 84 $GOLD 0.5 3.5),

    $(dtm 'SPEAKER 02  ·  AMERICA' 1700 22 $SPK2 3.5 7.5),
    $(dt 'What if biofeedback' 820 72 $PARCH 3.5 7.5),
    $(dt 'didnt have to live' 920 72 $PARCH 3.5 7.5),
    $(dt 'in a clinic?' 1020 84 $GOLD 3.5 7.5),

    $(dtm 'SPEAKER 03  ·  AUSTRALIA' 1700 22 $SPK3 7.5 12),
    $(dt 'What if Teslas' 820 80 $PARCH 7.5 12),
    $(dt '3-6-9' 920 130 $GOLD 7.5 12),
    $(dt 'wasnt just a quote?' 1080 64 $PARCH 7.5 12),

    $(dtm 'SPEAKER 04  ·  BRITAIN' 1700 22 $SPK4 12 17),
    $(dt 'What if you could' 800 76 $PARCH 12 17),
    $(dt 'read your own heart' 900 76 $PARCH 12 17),
    $(dt 'through your camera' 1000 76 $PARCH 12 17),
    $(dt 'right now?' 1110 84 $GOLD 12 17),

    $(dtm 'SPEAKER 01  ·  BRITAIN' 1700 22 $SPK1 17 20),
    $(dt 'This is the' 870 76 $PARCH 17 20),
    $(dt 'Codex of Reality.' 980 96 $GOLD 17 20),

    $(dtm 'SPEAKER 02  ·  AMERICA' 1700 22 $SPK2 20 26),
    $(dt 'The first biofeedback' 760 64 $PARCH 20 26),
    $(dt 'platform built for the' 858 64 $PARCH 20 26),
    $(dt 'mystic.' 960 92 $GOLD 20 26),
    $(dt 'Not the biohacker.' 1070 56 $DIM 20 26),

    $(dtm 'SPEAKER 03  ·  AUSTRALIA' 1700 22 $SPK3 26 31),
    $(dt 'Live heart coherence.' 850 72 $PARCH 26 31),
    $(dt 'Teslas 3-6-9 breath.' 970 72 $GOLD 26 31),

    $(dtm 'SPEAKER 04  ·  BRITAIN' 1700 22 $SPK4 31 35),
    $(dt 'The Schumann lock,' 860 76 $PARCH 31 35),
    $(dt '7.83 Hz.' 970 110 $GOLD 31 35),

    $(dtm 'SPEAKER 01  ·  BRITAIN' 1700 22 $SPK1 35 41.5),
    $(dt 'Sixteen ancient' 820 70 $PARCH 35 41.5),
    $(dt 'protocols. Soft' 920 70 $PARCH 35 41.5),
    $(dt 'narration. Live' 1020 70 $PARCH 35 41.5),
    $(dt 'cymatic visuals.' 1120 70 $GOLD 35 41.5),

    $(dtm 'SPEAKER 02  ·  AMERICA' 1700 22 $SPK2 41.5 47),
    $(dt 'All in your browser.' 870 70 $PARCH 41.5 47),
    $(dt 'No subscription.' 970 70 $GOLD 41.5 47),
    $(dt 'No app store.' 1070 70 $DIM 41.5 47),

    $(dtm 'SPEAKER 03  ·  AUSTRALIA' 1700 22 $SPK3 47 52),
    $(dt 'AU 30. One price.' 860 80 $PARCH 47 52),
    $(dt 'Lifetime in.' 970 110 $GOLD 47 52),

    $(dtm 'SPEAKER 04  ·  BRITAIN' 1700 22 $SPK4 52 60),
    $(dt 'Reality has a' 800 88 $PARCH 52 60),
    $(dt 'frequency.' 920 110 $GOLD 52 60),
    $(dtm 'rhythmixapp.com.au/codex' 1080 32 $PARCH 52 60)
  " \
  -c:v libx264 -preset medium -crf 21 -pix_fmt yuv420p \
  -c:a aac -b:a 160k \
  -t 60 \
  codex-voices-60s.mp4

ls -lh codex-voices-60s.mp4
echo "Done. Post directly to TikTok / Reels / Shorts."
