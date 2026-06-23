# 🎬 Jackson's Ecosystem 🎵

**Unified Video-to-Text-to-Voice-to-Music Pipeline**

Fully activated. No external purchases required. One command to orchestrate video extraction, transcription, text enhancement, professional narration, and background music generation.

---

## What It Does

| Input | Process | Output |
|-------|---------|--------|
| **Text** | Claude enhancement → TTS → MusicGen | Voice narration + Background music |
| **Video** | Frame extraction + Audio transcription → Claude Vision | Transcript + Scene descriptions |
| **Any** | Custom orchestration | Fully synced audio/visual assets |

---

## Quick Start (5 minutes)

### 1. Install Dependencies

```bash
cd ecosystem
npm install
```

### 2. Verify Configuration

Edit `ecosystem/config.json`:

```json
{
  "replicate_token": "sk-rd-79a3dcf5243dfff20f164c978f439ea08694b8aa1ff0b9f1e2a466323082988f",
  "anthropic_api_key": "sk-ant-...",  // Add your Claude key
  "elevenlabs_api_key": "sk-...",      // Optional: Add if you have ElevenLabs
  "kokoro_endpoint": "http://127.0.0.1:17493"  // Local TTS (if running)
}
```

### 3. Run Your First Pipeline

```bash
# Text → Voice + Music (with Claude enhancement)
node jackson.js text-to-voice-music "Create an inspiring video about AI music generation" --enhance
```

**What happens:**
1. Claude polishes your text for narration
2. Generates voice (Kokoro if running, else ElevenLabs)
3. Generates background music
4. Saves all outputs to `ecosystem/outputs/`

---

## Modes

### Text → Voice + Music (Default)

```bash
node jackson.js text-to-voice-music "Your script here"
```

Generates professional narration + atmospheric background music.

### Text → Voice Only

```bash
node jackson.js text-to-voice "Welcome to our product" --voice ElevenLabs
```

Voice options: `Kokoro` (local), `ElevenLabs` (cloud), `Browser` (web)

### Text → Music Only

```bash
node jackson.js text-to-music "Upbeat electronic dance music for a tech startup"
```

Music models: `musicgen-large`, `musicgen-medium`, `musicgen-small`

### Video → Text

```bash
node jackson.js video-to-text ./my-video.mp4
```

Extracts transcript, scene descriptions, OCR text.

---

## Web Dashboard

Interactive visual interface:

```bash
# Terminal 1: Start web server
npm run web

# Terminal 2 (or browser):
# Open http://localhost:8000/jackson.html
```

**Features:**
- Drag-drop text input
- Real-time mode selection
- Voice/music model picker
- Progress tracking
- Download outputs

---

## Integration with Your Existing Systems

### + RHYTHMIX Studio

Use Jackson's outputs as narration/music for video promos:

```bash
# 1. Generate voice + music
node jackson.js "Your RHYTHMIX promo script" --voice ElevenLabs --enhance

# 2. In your HyperFrames composition (rhythmix-<name>-60s/index.html):
# Load the voice file as narration track
# Load music as background
# Add visuals with GSAP
# Render to MP4

npx hyperframes@0.4.42 render
```

### + HyperFrames

Jackson generates the audio, HyperFrames syncs it with visuals:

```javascript
// In your HyperFrames composition:
const narration = new Audio('path/to/voice-{timestamp}.wav');
const music = new Audio('path/to/music-{timestamp}.wav');

gsap.to(".hero", {
  duration: narration.duration,
  opacity: 1,
  // ... animate with narration timing
});

narration.play();
music.play();
```

### + VoiceJournal / Heartbeat

Integrate Jackson TTS into wellness apps:

```javascript
// In voicejournal.html or heartbeat:
const ttsVoice = 'ecosystem/outputs/voice-{timestamp}.wav';
const playback = new Audio(ttsVoice);
playback.play();
```

### + iOS Capacitor

Deploy Jackson as native iOS app:

```bash
# 1. Generate outputs
node jackson.js "Your script" --voice Kokoro

# 2. Copy outputs to Capacitor www/
cp -r ecosystem/outputs/* capacitor/www/

# 3. Build iOS
cd capacitor
pnpm build:ios

# 4. Deploy via Xcode/Codemagic
```

---

## API Reference

### `jacksonEcosystem(input, options)`

```javascript
import { jacksonEcosystem } from './jackson.js';

const result = await jacksonEcosystem(
  "Your text here",
  {
    mode: 'text-to-voice-music',  // or 'text-to-voice', 'text-to-music'
    voice: 'Kokoro',               // or 'ElevenLabs', 'Browser'
    musicModel: 'musicgen-large',
    enhance: true                  // Use Claude to enhance text first
  }
);

console.log(result);
// {
//   text: "enhanced script",
//   voice: "ecosystem/outputs/voice-123.wav",
//   music: { prediction_id: "...", output_path: "..." },
//   timestamp: "2026-06-23T14:30:00Z"
// }
```

### Modular Functions

```javascript
import {
  videoToText,
  textToVoice,
  textToMusic,
  enhanceText
} from './jackson.js';

// Extract text from video
const transcript = await videoToText('./my-video.mp4');

// Enhance with Claude
const enhanced = await enhanceText(transcript, 'Make this funny');

// Generate voice
const voicePath = await textToVoice(enhanced, 'ElevenLabs');

// Generate music
const musicResult = await textToMusic(enhanced, 'musicgen-large');
```

---

## Outputs

All generated files saved to `ecosystem/outputs/`:

```
outputs/
├── voice-1719136200123.wav       ← Text-to-speech narration
├── music-1719136200123.wav       ← Generated background music
├── manifest-1719136200123.json   ← Metadata + file paths
└── ...
```

**Manifest structure:**

```json
{
  "text": "The enhanced, final text that was narrated",
  "voice": "outputs/voice-1719136200123.wav",
  "music": {
    "prediction_id": "abc123def456",
    "output_path": "outputs/music-1719136200123.wav"
  },
  "timestamp": "2026-06-23T14:30:00Z"
}
```

---

## Configuration

### Environment Variables

Optional: Add to `.env` instead of `config.json`:

```bash
REPLICATE_TOKEN=sk-rd-...
ANTHROPIC_API_KEY=sk-ant-...
ELEVENLABS_API_KEY=sk-...
KOKORO_ENDPOINT=http://127.0.0.1:17493
```

### Local TTS Setup (Kokoro)

Kokoro runs locally on your machine for ultra-low latency:

```bash
# Install Kokoro TTS
uv tool install kokoro-tts
# or
pip install kokoro-tts

# Start local server (if needed)
# The endpoint defaults to http://127.0.0.1:17493
```

See `../../KOKORO-SETUP.md` for details.

### Cloud TTS (ElevenLabs)

If Kokoro is unavailable, falls back to ElevenLabs automatically:

```bash
# Add your ElevenLabs API key to ecosystem/config.json
{
  "elevenlabs_api_key": "sk-..."
}
```

---

## Troubleshooting

### "Config not found"

```bash
# Create ecosystem/config.json with your API keys
echo '{
  "replicate_token": "YOUR_TOKEN",
  "anthropic_api_key": "YOUR_KEY"
}' > ecosystem/config.json
```

### Kokoro endpoint unavailable

Kokoro TTS is optional. If it's not running, Jackson automatically falls back to ElevenLabs:

```bash
# To use Kokoro, start it first:
kokoro-tts --host 127.0.0.1 --port 17493
```

Or just use `--voice ElevenLabs` explicitly:

```bash
node jackson.js text-to-voice "Your text" --voice ElevenLabs
```

### Replicate API rate limit

Check your Replicate usage at `https://replicate.com/account/billing/overview`.

Jackson queues music generation async. Check status:

```bash
curl -H "Authorization: Token $REPLICATE_TOKEN" \
  https://api.replicate.com/v1/predictions/{prediction_id}
```

### No audio playback

- Check browser speaker settings
- Ensure audio files are at correct paths
- Test playback manually: `afplay outputs/voice-*.wav` (macOS) or `ffplay` (cross-platform)

---

## Advanced Usage

### Batch Processing

```bash
# Process multiple scripts
for script in scripts/*.txt; do
  echo "Processing $script..."
  text=$(cat "$script")
  node jackson.js "$text" --enhance
done
```

### Custom Claude Enhancement

```bash
# Enhance for different styles
node jackson.js "Your text" --enhance "Make this sound like a dramatic movie trailer"
node jackson.js "Your text" --enhance "Rewrite this as a funny comedy sketch"
node jackson.js "Your text" --enhance "Make this sound professional and corporate"
```

### Chain with Replicate

Use Jackson outputs with other Replicate models:

```bash
# Generate voice + music
node jackson.js "Script" > manifest.json

# Load manifest and pipe to FLUX for image generation
# Then compose all together in HyperFrames
```

---

## Performance

| Operation | Duration | Notes |
|-----------|----------|-------|
| Text → Voice (Kokoro local) | ~300ms | Instant, runs locally |
| Text → Voice (ElevenLabs) | ~2-5s | Cloud API, high quality |
| Text → Music (MusicGen) | ~10-30s | Cloud API, async queue |
| Video → Text (extraction) | Variable | Depends on video length + Claude Vision |

---

## What's Powered By

- **Claude API** — Text enhancement, video analysis
- **Replicate** — MusicGen, video models (your token)
- **ElevenLabs** — High-quality TTS (optional)
- **Kokoro TTS** — Lightweight local TTS
- **HyperFrames** — Video composition + rendering
- **Your existing tools** — RHYTHMIX Studio, iOS Capacitor, VoiceJournal, etc.

---

## License

MIT. Use freely, build on top, integrate anywhere.

---

## Next Steps

1. **Run the demo:**
   ```bash
   npm run demo
   ```

2. **Open the web dashboard:**
   ```bash
   npm run web
   # Then http://localhost:8000/jackson.html
   ```

3. **Integrate with RHYTHMIX:**
   - Generate voice + music
   - Load into HyperFrames composition
   - Render to MP4
   - Upload to rhythmixapp.com.au

4. **Deploy to iOS:**
   - Use Capacitor wrapper
   - Package with generated outputs
   - Submit to App Store

---

**Jackson's Ecosystem — Fully activated. One command. Infinite creative possibilities.**
