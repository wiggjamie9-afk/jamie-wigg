# Voiceover workflow — adding narration to the silent video clips

> Why this exists: the rendered MP4s in `launch-kit/*/clips-60s/<name>/<name>.mp4` are silent because there's no ElevenLabs API key in the remote build container. The voiceover scripts are written and timed; you generate the narration once on your iPhone (or anywhere with ElevenLabs access), drop the MP3 in, and run one command to bake it onto the video.

## What's in each clip folder

```
launch-kit/<app>/clips-60s/<name>/
├── index.html              # Source composition (deterministic, ?frame=N driven)
├── narration-script.md     # Full script with timing table + delivery notes + ElevenLabs settings
├── paste.txt               # ✨ Spoken text only — paste-ready for ElevenLabs
├── storyboard.md           # Scene-by-scene visual breakdown
├── <name>.mp4              # ✨ Rendered silent video (1080×1920, 60s)
└── bake.sh                 # ✨ Mux narration.mp3 onto the silent MP4 → <name>-voiced.mp4
```

The three ✨ files are the workflow surface. Everything else is reference.

## The flow (5 minutes per clip)

1. **Open `paste.txt`** for the clip you want to voice.
2. **Open ElevenLabs** on your iPhone (or web). Voice settings are in the script header — typically Charlotte for FREQUENCY (RESONATE / DREAMS), Adam for RHYTHMIX LIVE, Charlotte/Emma for HUM.
3. **Paste, generate, download** the MP3.
4. **Drop the MP3** into the clip folder, renamed `narration.mp3`.
5. **Run `bash bake.sh`** in that folder. It produces `<name>-voiced.mp4` next to the silent original.

## Recommended voice settings per app

| App | Voice | Style | Stability | Similarity | Notes |
|---|---|---|---|---|---|
| RESONATE | Charlotte | 0.20 | 0.42 | 0.75 | Contemplative-direct, ~150 wpm |
| DREAMS | Charlotte or Emma | 0.15 | 0.45 | 0.75 | Slower, ~145 wpm, intimate |
| LIVE | Adam | 0.35 | 0.45 | 0.75 | Confident builder, ~175 wpm |
| HUM | Charlotte | 0.20 | 0.40 | 0.75 | Slow contemplative, ~155 wpm |

Full settings + delivery notes in each clip's `narration-script.md`.

## Batch-bake all 8 clips at once

If you've generated all 8 narration MP3s and dropped them in their respective folders, run from the repo root:

```bash
for f in launch-kit/*/clips-60s/*/bake.sh; do
  echo "=== $f ==="
  bash "$f" || echo "  (skipped — narration.mp3 missing)"
done
```

## Why `bake.sh` instead of doing this in HyperFrames

`bake.sh` is just a 5-line ffmpeg mux — much faster than re-rendering through HyperFrames once the silent MP4 already exists. The ffmpeg command:

```bash
ffmpeg -y -i <silent>.mp4 -i narration.mp3 \
  -c:v copy -c:a aac -b:a 192k -t 60 \
  -map 0:v -map 1:a \
  -movflags +faststart <output>-voiced.mp4
```

- `-c:v copy` — video stream copied without re-encoding (instant)
- `-c:a aac -b:a 192k` — narration encoded to 192kbps AAC (broad iOS / Android compatibility)
- `-t 60` — forces 60s output, audio padded with silence if narration ends early
- `-movflags +faststart` — moov atom at the front so iOS plays without buffering

## What this does NOT do

- It does not auto-time scene cuts to the narration — the silent video animation already has its 5–6 scene timeline. Your narration should match (the timed table in `narration-script.md` is sized to those scenes).
- It does not music-bed the narration. If you want a music bed under the voice, mix it into the narration MP3 in ElevenLabs / GarageBand / your DAW before baking.
- It does not handle the 30s clips — those are short enough that you may want to skip narration entirely (works as a silent kinetic-typography post on social).

## When you want a music bed (RESONATE / DREAMS)

For the contemplative apps, a soft bed under the narration improves the brand feel. The recommended path:

1. Generate narration in ElevenLabs → `narration-only.mp3`
2. In GarageBand for iOS (or any DAW), load `narration-only.mp3` on track 1
3. Add a 60s loop of one of the existing FREQUENCY beds (from `/frequency.html` — solfeggio 432Hz or 528Hz) on track 2 at -18dB
4. Mix down to `narration.mp3`
5. Run `bake.sh`

For RHYTHMIX LIVE, the bed should be the actual track being demoed — but for the launch pitch, a clean voice is fine.

## Troubleshooting

- **`narration.mp3 not found`** — you forgot to drop the file in the folder, or named it wrong.
- **Output audio out of sync** — your narration is too long (>60s). Trim the narration MP3 in any audio app and re-run.
- **Output is silent** — check that the input `narration.mp3` actually plays (open it in Files / Music).
- **Want a different length** — edit `-t 60` in `bake.sh` to the duration you want, in seconds.
