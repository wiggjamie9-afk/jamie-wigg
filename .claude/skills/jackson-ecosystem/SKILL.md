# Jackson's Ecosystem Skill

## Overview

**Jackson's Ecosystem** is a unified, fully-activated video-to-text-to-voice-to-music production pipeline. When invoked, it orchestrates:

1. **Video-to-Text**: Extract transcripts from video files
2. **Text Enhancement**: Polish with Claude AI for better narration
3. **Text-to-Voice**: Generate professional narration (Kokoro local or ElevenLabs cloud)
4. **Text-to-Music**: Create background music via Replicate MusicGen

**Zero external purchases required** — uses your existing Replicate token, Claude API, and ElevenLabs account (if configured).

---

## Usage

### Command Format

```
/jackson-ecosystem <input> [--mode <mode>] [--voice <voice>] [--music <model>] [--enhance]
```

### Modes

| Mode | Description |
|------|---|
| `text-to-voice-music` | Text → narration + background music (default) |
| `text-to-voice` | Text → narration only |
| `text-to-music` | Text → background music only |
| `video-to-text` | Video file → extract transcript |

### Voice Options

| Voice | Provider | Notes |
|-------|----------|-------|
| `Kokoro` | Local TTS | Default, lightweight, ~300ms latency (requires setup) |
| `ElevenLabs` | Cloud TTS | High quality, supports voice cloning |
| `Browser` | Web Speech API | Client-side speech synthesis (web version) |

### Music Models

- `musicgen-large` — Best quality (default)
- `musicgen-medium` — Fast + good quality
- `musicgen-small` — Quick generation

---

## Examples

### 1. Text → Voice + Music (Default)

```
/jackson-ecosystem "Create a motivational video about AI transforming healthcare"
```

**Output:**
- Enhanced narration script
- Voice narration (Kokoro)
- Background music (MusicGen)
- Manifest JSON with all outputs

### 2. Text → Voice Only

```
/jackson-ecosystem "Welcome to our product demo" --mode text-to-voice --voice ElevenLabs
```

### 3. Text → Music (No Voice)

```
/jackson-ecosystem "Upbeat, energetic EDM track for a tech startup promo" --mode text-to-music --music musicgen-large --enhance
```

**With `--enhance`**: Claude rewrites the prompt to be more musically descriptive before sending to MusicGen.

### 4. Video → Text

```
/jackson-ecosystem ./my-video.mp4 --mode video-to-text
```

**Extracts:**
- Transcript (via audio + transcription)
- Scene descriptions (via Claude Vision)
- Captions/OCR text

---

## Configuration

Jackson's Ecosystem expects `ecosystem/config.json` with:

```json
{
  "replicate_token": "sk-rd-...",
  "anthropic_api_key": "sk-ant-...",
  "elevenlabs_api_key": "sk-...",
  "kokoro_endpoint": "http://127.0.0.1:17493",
  "default_voice": "Maya",
  "default_music_model": "musicgen-large"
}
```

**Already configured?** Your Replicate token is already in `.env`. Copy it to `ecosystem/config.json`.

---

## Full Pipeline Flow

```
User Input (text/video)
    ↓
[Optional: Video-to-Text extraction]
    ↓
[Optional: Claude enhancement ("Make this more engaging")]
    ↓
[Parallel Stage A: Text-to-Voice]
[Parallel Stage B: Text-to-Music]
    ↓
[Combine outputs]
    ↓
[Save manifest → ecosystem/outputs/manifest-*.json]
    ↓
✅ Complete
```

---

## Web Dashboard

Open **`ecosystem/jackson.html`** in a browser for a visual interface:
- Select mode, voice, music model
- Paste text or upload video
- Real-time progress
- Download outputs

```bash
python3 -m http.server 8000 --bind 127.0.0.1 --directory /home/user/jamie-wigg/ecosystem
# Then open http://localhost:8000/jackson.html
```

---

## Advanced: Chaining with HyperFrames

For video output (not just voice + music), chain Jackson's output into HyperFrames:

```bash
# Generate voice + music
/jackson-ecosystem "Your script here" --mode text-to-voice-music

# This outputs voice.wav and music.wav
# Then in a HyperFrames composition (index.html):
# - Load voice.wav as narrator
# - Load music.wav as background track
# - Add visuals with GSAP
# Render to MP4
npx hyperframes@0.4.42 render
```

---

## Outputs

All outputs saved to `ecosystem/outputs/`:

```
outputs/
├── voice-1234567890.wav          # TTS voice narration
├── music-1234567890.wav          # Generated music
├── manifest-1234567890.json      # Metadata + file paths
└── ...
```

Manifest format:

```json
{
  "text": "enhanced script",
  "voice": "outputs/voice-123.wav",
  "music": {
    "prediction_id": "abc123def456",
    "output_path": "outputs/music-123.wav"
  },
  "timestamp": "2026-06-23T14:30:00Z"
}
```

---

## Troubleshooting

### Error: "Config not found"
→ Create `ecosystem/config.json` with your API keys

### Kokoro endpoint unavailable
→ Falls back to ElevenLabs automatically (or use `--voice ElevenLabs`)

### Replicate API error
→ Check your token in `ecosystem/config.json`

### Music generation takes forever
→ Replicate queues predictions. Check `prediction_id` at `https://api.replicate.com/v1/predictions/{id}`

---

## One-Command Quickstart

```bash
# 1. Create config
echo '{
  "replicate_token": "YOUR_TOKEN_HERE",
  "anthropic_api_key": "YOUR_CLAUDE_KEY",
  "elevenlabs_api_key": "YOUR_ELEVEN_KEY"
}' > ecosystem/config.json

# 2. Run pipeline
node ecosystem/jackson.js text-to-voice-music "Create a 60-second promo about AI music generation"

# 3. Outputs in ecosystem/outputs/
```

---

## What's Next?

Jackson's Ecosystem + your existing tools:

- **RHYTHMIX Studio**: Use Jackson outputs as narration/music for promos
- **HyperFrames**: Chain voice + music into video compositions
- **VoiceJournal/Heartbeat**: Integrate TTS voice generation
- **iOS Capacitor**: Deploy as native app on iPhone 7+

**Full integration example:**
```bash
# Generate voice + music script
node ecosystem/jackson.js "Emotional wellness app demo" --enhance

# Load voice + music into RHYTHMIX HyperFrames composition
# Render to MP4
# Deploy to rhythmixapp.com.au
```
