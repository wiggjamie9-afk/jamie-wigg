# 🎙️ Moon Trucks — Narrator Voice

**Chosen narrator:** a warm, soft-spoken woman — gentle, motherly bedtime storyteller.
**Tool:** ElevenLabs (NOT Higgsfield).

## Recommended ElevenLabs voices (pick one)
| Voice | ElevenLabs Voice ID | Feel |
|---|---|---|
| **Matilda** ⭐ | `XrExE9yKIg1WjnnlVkGX` | Warm, soft young-adult woman — ideal storybook bedtime voice (recommended) |
| Alice | `Xb7hH8MSUJpSbSDYk0k2` | Clear, gentle British woman |
| Sarah | `EXAVITQu4vr4xnSDxMaL` | Soft, calm, soothing |
| Rachel (pipeline default) | `21m00Tcm4TlvDq8ikWAM` | Warm calm American woman |

## Recommended settings (already in `pipeline.py`)
- `model_id`: `eleven_turbo_v2_5`
- `stability`: 0.72 (steady, unhurried) — nudge to 0.80 for even calmer
- `similarity_boost`: 0.80 · `style`: 0.25 · `use_speaker_boost`: true

## How to produce the voiceover on your Mac
The pipeline now reads the voice from an env var, so Moon Trucks can use its own
narrator without changing Sunny's voice.

```bash
cd /path/to/jamie-wigg

export ELEVENLABS_API_KEY="your-elevenlabs-key"
export ELEVENLABS_VOICE_ID="XrExE9yKIg1WjnnlVkGX"   # Matilda (warm woman)
# (leave HIGGSFIELD_API_KEY unset so it never uses Higgsfield;
#  images fall back to Replicate/FAL/Pollinations/PIL)

python kids-channel/pipeline.py \
  --script-file kids-channel/concepts/moon-trucks/pilot-little-trucks-move-the-moon.json
```

This produces, in a new episode folder:
- `narration.mp3` — the warm-woman voiceover of the whole story
- `scene_01.jpg … scene_06.jpg` — the illustrations
- `music.mp3`, `final.mp4`, `thumbnail.jpg`, `ebook.pdf`

### Just want to hear the voice quickly (no full render)?
Paste the story text into the ElevenLabs app/website, pick **Matilda**, set
stability ~0.75, and export the MP3. Same voice the pipeline uses.
