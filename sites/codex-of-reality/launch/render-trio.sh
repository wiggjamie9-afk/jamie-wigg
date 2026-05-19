#!/usr/bin/env bash
# Renders the three "talking video" MP4s:
#   codex-founder-60s.mp4
#   codex-walkthrough-60s.mp4
#   codex-math-60s.mp4

set -e
cd "$(dirname "$0")"

SERIF=/usr/share/fonts/truetype/liberation/LiberationSerif-Italic.ttf
MONO=/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf

INK=0x0a1628
GOLD=0xd4a843
PARCH=0xf4ecd6
DIM=0xa89e85
COH=0x5ce5e0
ALARM=0xff3b6b

VDIR=voice

dt() {
  local text="$1"; local y="$2"; local size="$3"; local color="$4"; local start="$5"; local end="$6"
  echo "drawtext=fontfile=$SERIF:text='$text':x=(w-text_w)/2:y=$y:fontsize=$size:fontcolor=$color:enable='between(t,$start,$end)':line_spacing=8"
}
dtm() {
  local text="$1"; local y="$2"; local size="$3"; local color="$4"; local start="$5"; local end="$6"
  echo "drawtext=fontfile=$MONO:text='$text':x=(w-text_w)/2:y=$y:fontsize=$size:fontcolor=$color:enable='between(t,$start,$end)'"
}

###############################################################################
# VIDEO 1 · Founder Pitch
###############################################################################
echo "Mixing founder voiceover…"
ffmpeg -y -loglevel error \
  -i $VDIR/founder-1.mp3  -i $VDIR/founder-2.mp3  -i $VDIR/founder-3.mp3 \
  -i $VDIR/founder-4.mp3  -i $VDIR/founder-5.mp3  -i $VDIR/founder-6.mp3 \
  -i $VDIR/founder-7.mp3  -i $VDIR/founder-8.mp3  -i $VDIR/founder-9.mp3 \
  -i $VDIR/founder-10.mp3 \
  -filter_complex "
    [0:a]adelay=500|500[c1];
    [1:a]adelay=5500|5500[c2];
    [2:a]adelay=10000|10000[c3];
    [3:a]adelay=17500|17500[c4];
    [4:a]adelay=22500|22500[c5];
    [5:a]adelay=25500|25500[c6];
    [6:a]adelay=30000|30000[c7];
    [7:a]adelay=35500|35500[c8];
    [8:a]adelay=40000|40000[c9];
    [9:a]adelay=45500|45500[c10];
    [c1][c2][c3][c4][c5][c6][c7][c8][c9][c10]amix=inputs=10:duration=longest:normalize=0
  " -t 60 -codec:a libmp3lame -qscale:a 4 $VDIR/voiceover-founder-60s.mp3

echo "Rendering codex-founder-60s.mp4…"
ffmpeg -y -loglevel error -stats \
  -f lavfi -i "color=c=$INK:s=1080x1920:d=60:r=30" \
  -i $VDIR/voiceover-founder-60s.mp3 \
  -vf "
    $(dtm 'CODEX  ·  OF REALITY' 130 28 $DIM 0 60),
    $(dtm 'THE FOUNDER PITCH' 175 18 $GOLD 0 60),

    $(dt 'Hi. Im Jamie.' 820 84 $PARCH 0.5 5.5),
    $(dt 'I built the Codex' 940 84 $PARCH 0.5 5.5),
    $(dt 'of Reality.' 1050 84 $GOLD 0.5 5.5),

    $(dt 'For a year I made' 820 72 $PARCH 5.5 10),
    $(dt 'videos about ancient' 920 72 $PARCH 5.5 10),
    $(dt 'breath protocols.' 1020 72 $GOLD 5.5 10),

    $(dt '183 K followers' 820 90 $GOLD 10 17.5),
    $(dt '935 K likes' 950 90 $GOLD 10 17.5),
    $(dtm '@CODEX.OF.REALITY  ·  TIKTOK' 1090 22 $DIM 10 17.5),

    $(dt 'But the protocols' 820 72 $PARCH 17.5 22.5),
    $(dt 'were just videos.' 920 72 $PARCH 17.5 22.5),
    $(dt 'You couldnt measure them.' 1030 64 $GOLD 17.5 22.5),

    $(dt 'So I built' 820 80 $PARCH 22.5 25.5),
    $(dt 'the app that does.' 940 84 $GOLD 22.5 25.5),

    $(dt 'Live HRV coherence' 820 76 $PARCH 25.5 30),
    $(dt 'from your phone camera.' 930 70 $GOLD 25.5 30),

    $(dt 'Sixteen protocols.' 800 72 $PARCH 30 35.5),
    $(dt 'Tesla 3-6-9.' 900 88 $GOLD 30 35.5),
    $(dt 'The Schumann Lock.' 1020 72 $PARCH 30 35.5),

    $(dt 'Eight months building.' 820 72 $PARCH 35.5 40),
    $(dt 'One price for life.' 920 84 $GOLD 35.5 40),

    $(dt 'AU 30' 720 240 $GOLD 40 45.5),
    $(dtm 'NO SUBSCRIPTION  ·  NO APP STORE' 1020 28 $DIM 40 45.5),

    $(dtm 'rhythmixapp.com.au/codex' 1100 36 $PARCH 45.5 60),
    $(dt 'Reality has a' 880 80 $PARCH 50 60),
    $(dt 'frequency.' 1000 96 $GOLD 50 60)
  " \
  -c:v libx264 -preset medium -crf 21 -pix_fmt yuv420p \
  -c:a aac -b:a 160k -t 60 \
  codex-founder-60s.mp4

###############################################################################
# VIDEO 2 · The Walkthrough
###############################################################################
echo "Mixing walkthrough voiceover…"
ffmpeg -y -loglevel error \
  -i $VDIR/walk-1.mp3  -i $VDIR/walk-2.mp3  -i $VDIR/walk-3.mp3 \
  -i $VDIR/walk-4.mp3  -i $VDIR/walk-5.mp3  -i $VDIR/walk-6.mp3 \
  -i $VDIR/walk-7.mp3  -i $VDIR/walk-8.mp3  -i $VDIR/walk-9.mp3 \
  -i $VDIR/walk-10.mp3 \
  -filter_complex "
    [0:a]adelay=500|500[c1];
    [1:a]adelay=4000|4000[c2];
    [2:a]adelay=7000|7000[c3];
    [3:a]adelay=11000|11000[c4];
    [4:a]adelay=15000|15000[c5];
    [5:a]adelay=21000|21000[c6];
    [6:a]adelay=26000|26000[c7];
    [7:a]adelay=31000|31000[c8];
    [8:a]adelay=36000|36000[c9];
    [9:a]adelay=42000|42000[c10];
    [c1][c2][c3][c4][c5][c6][c7][c8][c9][c10]amix=inputs=10:duration=longest:normalize=0
  " -t 60 -codec:a libmp3lame -qscale:a 4 $VDIR/voiceover-walk-60s.mp3

echo "Rendering codex-walkthrough-60s.mp4…"
ffmpeg -y -loglevel error -stats \
  -f lavfi -i "color=c=$INK:s=1080x1920:d=60:r=30" \
  -i $VDIR/voiceover-walk-60s.mp3 \
  -vf "
    $(dtm 'CODEX  ·  OF REALITY' 130 28 $DIM 0 60),
    $(dtm 'A WALKTHROUGH' 175 18 $GOLD 0 60),

    $(dt 'You open' 820 84 $PARCH 0.5 4),
    $(dt 'the Codex.' 940 100 $GOLD 0.5 4),

    $(dt 'You tap any' 820 84 $PARCH 4 7),
    $(dt 'protocol.' 940 100 $GOLD 4 7),

    $(dt 'You place your' 820 80 $PARCH 7 11),
    $(dt 'finger on the' 920 80 $PARCH 7 11),
    $(dt 'camera lens.' 1030 88 $GOLD 7 11),

    $(dt 'Your pulse appears' 820 76 $PARCH 11 15),
    $(dt 'in 8 seconds.' 930 96 $GOLD 11 15),

    $(dt 'The orb breathes.' 800 84 $PARCH 15 21),
    $(dt '5 in.' 920 110 $GOLD 15 21),
    $(dt '5 out.' 1060 110 $GOLD 15 21),

    $(dt 'Coherence climbs' 820 76 $PARCH 21 26),
    $(dt 'as your heart syncs.' 930 76 $GOLD 21 26),

    $(dt '16 protocols' 800 96 $GOLD 26 31),
    $(dt 'ship today.' 940 84 $PARCH 26 31),

    $(dt '13 frequencies' 800 96 $GOLD 31 36),
    $(dt 'in the library.' 940 84 $PARCH 31 36),

    $(dt 'Audio-reactive' 800 80 $PARCH 36 42),
    $(dt 'Chladni cymatics' 900 80 $GOLD 36 42),
    $(dt 'on every session.' 1010 72 $PARCH 36 42),

    $(dt 'AU 30' 720 240 $GOLD 42 50),
    $(dtm 'LIFETIME  ·  NO SUBSCRIPTION' 1040 28 $DIM 42 50),

    $(dt 'Reality has a' 800 88 $PARCH 50 60),
    $(dt 'frequency.' 920 110 $GOLD 50 60),
    $(dtm 'rhythmixapp.com.au/codex' 1100 32 $PARCH 50 60)
  " \
  -c:v libx264 -preset medium -crf 21 -pix_fmt yuv420p \
  -c:a aac -b:a 160k -t 60 \
  codex-walkthrough-60s.mp4

###############################################################################
# VIDEO 3 · The Math
###############################################################################
echo "Mixing math voiceover…"
ffmpeg -y -loglevel error \
  -i $VDIR/math-1.mp3  -i $VDIR/math-2.mp3  -i $VDIR/math-3.mp3 \
  -i $VDIR/math-4.mp3  -i $VDIR/math-5.mp3  -i $VDIR/math-6.mp3 \
  -i $VDIR/math-7.mp3  -i $VDIR/math-8.mp3  -i $VDIR/math-9.mp3 \
  -i $VDIR/math-10.mp3 \
  -filter_complex "
    [0:a]adelay=500|500[c1];
    [1:a]adelay=3000|3000[c2];
    [2:a]adelay=9000|9000[c3];
    [3:a]adelay=14000|14000[c4];
    [4:a]adelay=21000|21000[c5];
    [5:a]adelay=27000|27000[c6];
    [6:a]adelay=30000|30000[c7];
    [7:a]adelay=38000|38000[c8];
    [8:a]adelay=43000|43000[c9];
    [9:a]adelay=47000|47000[c10];
    [c1][c2][c3][c4][c5][c6][c7][c8][c9][c10]amix=inputs=10:duration=longest:normalize=0
  " -t 60 -codec:a libmp3lame -qscale:a 4 $VDIR/voiceover-math-60s.mp3

echo "Rendering codex-math-60s.mp4…"
ffmpeg -y -loglevel error -stats \
  -f lavfi -i "color=c=$INK:s=1080x1920:d=60:r=30" \
  -i $VDIR/voiceover-math-60s.mp3 \
  -vf "
    $(dtm 'CODEX  ·  OF REALITY' 130 28 $DIM 0 60),
    $(dtm 'THE MATH' 175 18 $GOLD 0 60),

    $(dt 'Lets do' 820 96 $PARCH 0.5 3),
    $(dt 'the math.' 950 96 $GOLD 0.5 3),

    $(dtm 'HEARTMATH INNER BALANCE' 720 26 $DIM 3 9),
    $(dt 'USD 249' 820 130 $ALARM 3 9),
    $(dtm 'SENSOR' 970 24 $DIM 3 9),
    $(dt '+ USD 99/yr' 1030 70 $ALARM 3 9),
    $(dtm 'SUBSCRIPTION' 1110 22 $DIM 3 9),

    $(dtm 'CALM  ·  HEADSPACE' 720 26 $DIM 9 14),
    $(dt 'USD 70/yr' 820 130 $ALARM 9 14),
    $(dtm 'NO BIOFEEDBACK' 970 24 $DIM 9 14),

    $(dtm 'WELLTORY' 720 26 $DIM 14 21),
    $(dt 'USD 89/yr' 820 130 $ALARM 14 21),
    $(dtm 'CLINICAL HRV  ·  NO TESLA' 970 24 $DIM 14 21),

    $(dt 'The Codex' 800 100 $GOLD 21 27),
    $(dt 'of Reality.' 930 80 $PARCH 21 27),

    $(dt 'Camera HRV.' 800 70 $PARCH 27 30),
    $(dt 'Tesla 3-6-9.' 880 76 $GOLD 27 30),
    $(dt 'Schumann Lock.' 970 70 $PARCH 27 30),

    $(dt 'AU 30' 720 240 $GOLD 30 38),
    $(dtm 'ONCE  ·  FOREVER' 1020 30 $DIM 30 38),

    $(dt 'Less than' 800 80 $PARCH 38 43),
    $(dt '4 months of Calm.' 910 80 $GOLD 38 43),
    $(dt 'Forever.' 1030 90 $COH 38 43),

    $(dt 'Reality has a' 800 80 $PARCH 43 47),
    $(dt 'frequency.' 910 96 $GOLD 43 47),

    $(dtm 'rhythmixapp.com.au/codex' 1100 36 $PARCH 47 60),
    $(dt 'Yours.' 920 110 $GOLD 50 60)
  " \
  -c:v libx264 -preset medium -crf 21 -pix_fmt yuv420p \
  -c:a aac -b:a 160k -t 60 \
  codex-math-60s.mp4

###############################################################################
echo ""
ls -lh codex-founder-60s.mp4 codex-walkthrough-60s.mp4 codex-math-60s.mp4
echo "Done. Three videos. Post directly."
