# Voicebox setup — your real voice in 10 minutes

Voicebox (https://voicebox.sh) runs locally on your Mac and clones your voice from a short audio sample. Every voiceover in the Codex stack can then be regenerated in your own voice — no API keys, no per-character cost, no internet round-trip.

## 1. Install Voicebox (2 min)

1. Download the **Apple Silicon DMG** from https://voicebox.sh
2. Open the DMG, drag Voicebox to Applications
3. Launch it. First-run: it'll download the bundled models (~1–4 GB depending on which engines you enable — Kokoro 82M is the smallest and starts fastest)
4. Confirm the server is running by opening http://127.0.0.1:17493/docs in your browser — should show the API docs

## 2. Clone your voice (3 min)

1. Open Voicebox → **Voice Profiles** → **+ New Profile**
2. Name it exactly: **`Jamie`** (the scripts default to this name)
3. **From audio file** — drop in 10–30 seconds of clean TikTok narration. Just your voiceover, no music underneath. The shorter the cleaner.
4. Pick **Qwen3-TTS** or **Chatterbox Multilingual** as the engine (zero-shot cloning, good quality)
5. Save. Click **Test** in the panel and type "Reality has a frequency." — first time you hear *yourself* say something you didn't say.

## 3. Re-generate every Codex voiceover (5 min)

All three scripts auto-detect Voicebox at `http://127.0.0.1:17493`. With Voicebox running:

```bash
# 1. The launch videos (60s + 30s explainers)
cd sites/codex-of-reality/launch/voice
./generate-audio.sh

# 2. The 4-speaker "people talking" video
./generate-voices.sh

# 3. The in-app protocol narrations (16 protocols × multiple lines each)
cd ../../../../content/protocols
./generate-narration.sh
```

Each script prints `Voice engine: voicebox` at the top when Voicebox is reachable. If you see `Voice engine: espeak`, Voicebox isn't running — check http://127.0.0.1:17493/docs.

Then re-render the videos with the new audio:

```bash
cd sites/codex-of-reality/launch
./render-mp4.sh           # rebuilds codex-60s.mp4 and codex-30s.mp4
./render-voices-mp4.sh    # rebuilds codex-voices-60s.mp4
```

Commit and push. Every video, every in-app protocol now narrates in your voice.

## Voicebox config knobs

Environment variables the scripts respect:

- `VOICEBOX_URL` — default `http://127.0.0.1:17493`
- `VOICEBOX_PROFILE` — default `Jamie` (used by generate-audio.sh and generate-narration.sh)
- `VOICEBOX_PROFILE_V1` .. `V4` — for the 4-speaker video. Default to `VOICEBOX_PROFILE_DEFAULT` (Jamie) if unset.
- `VOICE_ENGINE` — force `voicebox` or `espeak`. Default auto-detects.

## Multi-speaker setup (optional)

For the 4-speaker "people talking" video, you can clone four different voices (your own in different deliveries, or grab three friends to record 10-second samples). Then:

```bash
VOICEBOX_PROFILE_V1=Jamie \
VOICEBOX_PROFILE_V2=Sarah \
VOICEBOX_PROFILE_V3=Marcus \
VOICEBOX_PROFILE_V4=Lina \
./generate-voices.sh
```

The cue-to-speaker mapping stays identical. Same composition, four different real voices.

## How the in-app voice swap works

The Codex web app (`sites/codex-of-reality/app.html`) checks `./audio/<slug>/0.mp3` on each protocol's player open. If the file is there, it plays your Voicebox-generated narration through an `<audio>` element. If not, it falls back to iOS Samantha via Web Speech API.

So you can:
1. Ship today with Samantha (already working)
2. Run `generate-narration.sh` whenever you're ready
3. Commit + push the `sites/codex-of-reality/audio/**` files
4. Every member's app starts using your voice on next pull-to-refresh — no app update needed

Service worker cache version is bumped to `v6` so phones force-fetch the new shell that knows about the audio files.

## The full upgrade flow in one block

```bash
# After installing Voicebox + cloning "Jamie" profile:
cd ~/where/you/cloned/jamie-wigg

# 1. Pre-render all voiceover audio
( cd sites/codex-of-reality/launch/voice && ./generate-audio.sh )
( cd sites/codex-of-reality/launch/voice && ./generate-voices.sh )
( cd content/protocols && ./generate-narration.sh )

# 2. Re-render the marketing videos with the new audio
( cd sites/codex-of-reality/launch && ./render-mp4.sh && ./render-voices-mp4.sh )

# 3. Ship
git add sites/codex-of-reality/audio sites/codex-of-reality/launch
git commit -m "Voice clone: re-render all narration in Jamie's voice via Voicebox"
git push origin main
```

When the deploy lands, every voice on every surface (landing videos, app narrations, multi-voice video) is yours.
