# 🎙️ Moon Trucks — Narrator Voice

**Chosen narrator:** a warm, soft-spoken woman — gentle, motherly bedtime storyteller.
**Engine:** **Kokoro TTS** — free, local, ElevenLabs-grade quality. No Higgsfield, no
ElevenLabs, no API key, no per-episode cost. (See `KOKORO-SETUP.md`.)

## Recommended Kokoro voices (warm woman)
| Voice | Feel |
|---|---|
| **`af_heart`** ⭐ | Warmest, highest-quality American female — the default I set |
| `af_nicole` | Softest / most soothing, almost ASMR — lovely for bedtime |
| `af_bella` | Warm and a touch more expressive |
| `bf_emma` / `bf_alice` | Gentle British woman, if you want a storybook accent |

**Voice blend option** (warm + soft): `af_heart:60,af_nicole:40`

Recommended speed: **0.9** (or 0.85 for extra-slow, calmer delivery).

## It's wired into the pipeline
`pipeline.py` now has a `NARRATION_ENGINE` switch. Set it to `kokoro` and the
pipeline narrates with Kokoro (then falls back to Piper if Kokoro isn't installed).
Sunny's channel is unaffected — it keeps its default voice unless you set the env.

| Env var | Default | Purpose |
|---|---|---|
| `NARRATION_ENGINE` | `auto` | Set to `kokoro` for Moon Trucks |
| `KOKORO_VOICE` | `af_heart` | Warm-woman voice |
| `KOKORO_SPEED` | `0.9` | Slower = calmer |

## Produce the voiceover on your Mac
```bash
# One-time install (see KOKORO-SETUP.md):
uv tool install kokoro-tts
#   then download voices-v1.0.bin + kokoro-v1.0.onnx into your run dir

cd /path/to/jamie-wigg
export NARRATION_ENGINE=kokoro
export KOKORO_VOICE=af_heart        # warm soft-spoken woman
export KOKORO_SPEED=0.9
# (leave HIGGSFIELD_API_KEY unset so the art never uses Higgsfield)

python kids-channel/pipeline.py \
  --script-file kids-channel/concepts/moon-trucks/pilot-little-trucks-move-the-moon.json
```

Produces a full episode folder: `narration.mp3` (Kokoro warm-woman voiceover),
`scene_01…06.jpg`, `music.mp3`, `final.mp4`, `thumbnail.jpg`, `ebook.pdf`.

### Just want to hear the voice first (no full render)?
```bash
echo "Have you ever wondered how the Moon gets up into the sky? It's the little trucks who move the Moon." \
  | kokoro-tts - sample.wav --voice af_heart --lang en-us --speed 0.9
```
Play `sample.wav` — that's your narrator. Try `af_nicole` if you want it even softer.
