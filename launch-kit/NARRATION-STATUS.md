# RHYTHMIX promos — narration status

All voiced MP4s on this branch were generated with **espeak-ng + mbrola voices** because the container's network policy blocks `api.elevenlabs.io`. Quality is below the brand bar — these are **v1 placeholders** so the promos can ship; you re-voice with ElevenLabs Charlotte / Emma / Adam / Alice once you're in a network-reachable env.

## V1 shipped 2026-05-20

### Product-level promos (4 apps × 2 clips each = 8)

| App / Clip            | TTS voice | Narr dur | Clip dur | Output |
|-----------------------|-----------|----------|----------|--------|
| resonate/pitch        | mb-us1    | 27s      | 60s      | `launch-kit/resonate/clips-60s/pitch/pitch-voiced.mp4` |
| resonate/science      | mb-us1    | 41s      | 60s      | `launch-kit/resonate/clips-60s/science/science-voiced.mp4` |
| dreams/pitch          | mb-us1    | 21s      | 60s      | `launch-kit/dreams/clips-60s/pitch/pitch-voiced.mp4` |
| dreams/ritual         | mb-us1    | 25s      | 60s      | `launch-kit/dreams/clips-60s/ritual/ritual-voiced.mp4` |
| live/pitch            | mb-us2    | 57s      | 60s      | `launch-kit/live/clips-60s/pitch/pitch-voiced.mp4` |
| live/pipeline         | mb-us2    | 54s      | 60s      | `launch-kit/live/clips-60s/pipeline/pipeline-voiced.mp4` |
| hum/howto             | mb-en1    | 25s      | 60s      | `launch-kit/hum/clips-60s/howto/howto-voiced.mp4` |
| hum/origins           | mb-en1    | 39s      | 60s      | `launch-kit/hum/clips-60s/origins/origins-voiced.mp4` |

### Brand-level RHYTHMIX promos (4)

| Promo    | TTS voice | Narr dur | Clip dur | Output | Angle |
|----------|-----------|----------|----------|--------|-------|
| anthem   | mb-us1    | 47s      | 60s      | `rhythmix-anthem-60s/rhythmix-anthem-60s-voiced.mp4`   | "No producer, no studio, no instrument" — democratization |
| itslive  | mb-us2    | 41s      | 60s      | `rhythmix-itslive-60s/rhythmix-itslive-60s-voiced.mp4` | "The wait is over" — launch declaration |
| launch   | mb-us2    | 43s      | 60s      | `rhythmix-launch-60s/rhythmix-launch-60s-voiced.mp4`   | "Suno makes the song. Then what?" — competitive positioning |
| teaser   | mb-us1    | 46s      | 60s      | `rhythmix-teaser-60s/rhythmix-teaser-60s-voiced.mp4`   | "What if you could make music…" — soft pre-launch hook |

## V1 known issues

- Voices sound robotic (mbrola) — not Charlotte / Emma / Adam / Alice
- Narrations are shorter than the 60s clip; visuals continue with silent audio after the narration finishes
- Line-by-line timing in `narration-script.md` (for the product clips) was NOT honored
- Brand-level promos used freshly-written narrations grounded in the on-screen text — these are new and never had a `narration-script.md` to begin with

## To produce V2 (ElevenLabs)

**Product-level (8 clips):**
1. Open `launch-kit/VOICEOVER-CHECKLIST.md` — has paste-text + voice + settings for each
2. Generate 8 MP3s in ElevenLabs iOS Studio
3. Save each as `narration.mp3` in the matching `launch-kit/<app>/clips-60s/<name>/` folder (overwrites v1)
4. Run `for f in launch-kit/*/clips-60s/*/bake.sh; do bash "$f"; done`

**Brand-level (4 promos):**
1. Open each `rhythmix-<slug>-60s/narration.txt` and paste into ElevenLabs (suggested voice: Adam for itslive + launch, Charlotte for anthem + teaser)
2. Save as `rhythmix-<slug>-60s/narration.mp3` (overwrites v1)
3. Re-bake:
   ```bash
   for slug in anthem itslive launch teaser; do
     ffmpeg -y -i rhythmix-${slug}-60s/rhythmix-${slug}-60s.mp4 \
            -i rhythmix-${slug}-60s/narration.mp3 \
            -c:v copy -c:a aac -b:a 192k -t 60 \
            -map 0:v -map 1:a -movflags +faststart \
            rhythmix-${slug}-60s/rhythmix-${slug}-60s-voiced.mp4
   done
   ```

## Why placeholder

This container's egress allowlist blocks every cloud TTS provider tested (17 hosts: ElevenLabs, OpenAI, Google, Cartesia, Murf, Deepgram, etc.). HuggingFace is also blocked, so piper neural voices are unreachable too. mbrola via apt was the highest-quality offline option.
