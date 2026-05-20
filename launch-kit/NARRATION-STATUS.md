# RHYTHMIX 60s promos — narration status

## V1 shipped (2026-05-20) — local TTS placeholder

All 8 clips have voiced MP4s. Narration was generated with **espeak-ng + mbrola voices** because the container's network policy blocks `api.elevenlabs.io`. This is a deliberate placeholder so the promos can ship; quality is below the brand bar.

| App / Clip            | TTS voice  | Narration duration | Clip duration | Status |
|-----------------------|------------|--------------------|---------------|--------|
| resonate/pitch        | mb-us1     | 27s                | 60s           | ⚠ v1   |
| resonate/science      | mb-us1     | 41s                | 60s           | ⚠ v1   |
| dreams/pitch          | mb-us1     | 21s                | 60s           | ⚠ v1   |
| dreams/ritual         | mb-us1     | 25s                | 60s           | ⚠ v1   |
| live/pitch            | mb-us2     | 57s                | 60s           | ⚠ v1   |
| live/pipeline         | mb-us2     | 54s                | 60s           | ⚠ v1   |
| hum/howto             | mb-en1     | 25s                | 60s           | ⚠ v1   |
| hum/origins           | mb-en1     | 39s                | 60s           | ⚠ v1   |

**V1 known issues:**
- Voices sound robotic (mbrola) — not Charlotte / Emma / Adam / Alice
- Narrations run faster than the script's intended cadence, so most clips have ~10–35s of silence after the narration finishes (the visuals continue, audio is just empty)
- Line-by-line timing in `narration-script.md` was NOT honored — espeak read each `paste.txt` straight through with default sentence pauses

## To produce V2 (ElevenLabs, when in a network-reachable env)

1. Open `VOICEOVER-CHECKLIST.md` in this folder
2. Generate 8 fresh narration MP3s in ElevenLabs iOS (paste-text + voice + settings all listed)
3. Save each as `narration.mp3` in the same 8 clip folders (overwrites the v1 placeholders)
4. Run:
   ```bash
   for f in launch-kit/*/clips-60s/*/bake.sh; do bash "$f"; done
   ```
5. Push — the `*-voiced.mp4` files get regenerated with ElevenLabs voicing, ready for launch

## Why this happened

The container running these builds has a restrictive egress allowlist. Confirmed blocked:
- `api.elevenlabs.io` → 403 Host not in allowlist
- `huggingface.co` → 403 (so piper neural TTS voices unreachable too)
- 15+ other voice/TTS hosts → 403 or 000

mbrola was the highest-quality voice synthesis that runs 100% offline.
