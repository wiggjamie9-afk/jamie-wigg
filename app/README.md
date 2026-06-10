# RHYTHMIX Video Generation Suite

**Production-ready, 100% open-source video generation pipeline.**

```
Topic → Ollama (Script) → ComfyUI (Images) → AudioCraft (Music) → Kokoro (TTS) → FFmpeg (Video)
```

## Quick Start

```python
from app.services.complete_pipeline import CompleteVideoPipeline

pipeline = CompleteVideoPipeline()
result = pipeline.generate_video(
    topic="Street vendor's daily hustle",
    scene_count=4,
    title="vendor_story"
)
```

## Services

### `ollama_llm.py` — LLM Director
**Generates scripts and visual prompts using local Mistral/Gemma4.**

```python
from app.services.ollama_llm import OllamaDirector

director = OllamaDirector(model="mistral")
script = director.generate_script_with_visuals(
    topic="Your topic",
    scene_count=4
)
# Returns: {"script": "...", "scenes": [{"narration": "...", "visual_prompt": "..."}]}
```

**What it does:**
- One-pass LLM call generates full script + visual prompts
- Director persona for cinematic language
- Works offline, runs locally via Ollama

---

### `music_gen.py` — Music & Audio
**Generates background music and composes soundtracks using Meta AudioCraft.**

```python
from app.services.music_gen import MusicGenService, AudioComposer

# Single music prompt
service = MusicGenService()
music = service.generate_music(
    prompt="Uplifting orchestral theme",
    duration=30
)

# Full soundtrack composition
composer = AudioComposer()
soundtrack = composer.compose_soundtrack(script_data, narration_wav)
```

**What it does:**
- Converts narration + visuals → music prompts
- Generates 30-second background music per scene
- Composes full soundtrack with volume mixing
- Supports small/medium/large AudioCraft models

---

### `video_pipeline.py` — Basic Video Assembly
**Orchestrates image generation and Ken Burns video output.**

```python
from app.services.video_pipeline import VideoPipeline

pipeline = VideoPipeline()
result = pipeline.generate_video(
    topic="Your topic",
    scene_count=4,
    title="video_name"
)
```

**What it does:**
- Coordinates script generation → image generation
- Prepares for Kokoro TTS narration
- Stages FFmpeg assembly pipeline

---

### `complete_pipeline.py` — Full Orchestrator
**End-to-end: Topic → Video (all steps automated).**

```python
from app.services.complete_pipeline import CompleteVideoPipeline

pipeline = CompleteVideoPipeline(
    llm_model="mistral",
    music_model="facebook/musicgen-medium",
    kokoro_voice="af_bella"
)

result = pipeline.generate_video(
    topic="Your topic",
    scene_count=4,
    title="output_name",
    include_music=True,
    include_images=True,
    include_narration=True
)
```

**What it does:**
- Orchestrates all services (Ollama → ComfyUI → AudioCraft → Kokoro → FFmpeg)
- Handles errors and retries
- Generates metadata and JSON outputs
- Optional modules (music/images/narration can be toggled)

---

## Setup

### Prerequisites
- Python 3.9+
- 16GB RAM (8GB minimum)
- GPU: 10GB+ VRAM (optional but recommended)
- 30GB disk space (for models)

### Installation (On Your Machine)

```bash
# 1. Ollama + LLM models
brew install ollama  # macOS
ollama serve &
ollama pull mistral
ollama pull gemma4

# 2. ComfyUI + Flux images
git clone https://github.com/comfyui/ComfyUI.git
cd ComfyUI
pip install -r requirements.txt
python main.py

# 3. AudioCraft + music
brew install ffmpeg
pip install audiocraft

# 4. Kokoro + TTS (already installed in this environment)
pip install kokoro-tts
```

## Architecture

```
CompleteVideoPipeline
    ├── OllamaDirector (Mistral @ :11434)
    │   ├── generate_script_with_visuals()
    │   └── generate_visual_prompts()
    │
    ├── ComfyUI API (@ :8188) [external]
    │   ├── Flux.1-dev text-to-image
    │   └── 540×960 → 1080×1920 upscale
    │
    ├── AudioComposer (AudioCraft)
    │   ├── MusicGenService
    │   └── compose_soundtrack()
    │
    ├── Kokoro TTS (CLI)
    │   └── text-to-speech (30+ voices)
    │
    └── FFmpeg (CLI)
        ├── Ken Burns zoompan filter
        └── Final video composition
```

## Performance

| Step | Time | GPU RAM | Notes |
|------|------|---------|-------|
| Ollama (script) | ~10s | — | Local |
| ComfyUI (4 images) | ~2min | 10GB | Requires local GPU |
| AudioCraft (4 music) | ~1min | 6GB | Requires local GPU |
| Kokoro TTS | ~5s | — | CPU-friendly |
| FFmpeg assembly | ~30s | — | CPU-only |
| **TOTAL** | **~4min** | **10GB** | Per 4-scene video |

## Cost

- **$0 per video** (after initial model downloads)
- Models (one-time): ~25GB disk, ~30 min download
- Electricity: ~0.5 kWh per video ($0.05-0.10)

**vs. Paid APIs:** Save $0.60+ per video

## Configuration

### Default Settings
```python
pipeline = CompleteVideoPipeline(
    output_dir="output",           # Where to save outputs
    llm_model="mistral",           # Ollama model to use
    music_model="facebook/musicgen-medium",  # AudioCraft model
    comfyui_url="http://localhost:8188",    # ComfyUI API endpoint
    kokoro_voice="af_bella"        # TTS voice (30+ available)
)
```

### Kokoro Voices
- `af_bella` — Female, English (default)
- `am_michael` — Male, English
- `af_sarah` — Female, warm tone
- `en_default` — Gender-neutral
- ... and 20+ more (French, Italian, Japanese, etc.)

### Ollama Models
- `mistral` (5GB) ⭐⭐⭐⭐ — Fast, great quality
- `gemma4` (7GB) ⭐⭐⭐⭐⭐ — Best quality, slower
- `neural-chat` (13GB) ⭐⭐⭐ — Dialogue specialist

## Example: Batch Video Generation

```python
from app.services.complete_pipeline import CompleteVideoPipeline

topics = [
    "Street vendor's morning routine",
    "Freelancer finding first client",
    "Smallholder farmer's daily work",
    "Hairdresser building her salon",
    # ... 100 more
]

pipeline = CompleteVideoPipeline()

for i, topic in enumerate(topics, 1):
    result = pipeline.generate_video(
        topic=topic,
        scene_count=4,
        title=f"app_{i:03d}"
    )
    print(f"✓ {i}/100: {result['output_video']}")
```

**Time:** 100 videos @ 4min each = 400min = **6.7 hours** (parallelizable)

## Integration

### With Studio Web App
```python
# studio/app/api/generate/route.ts
import { CompleteVideoPipeline } from "app.services"

const pipeline = new CompleteVideoPipeline()
const video = await pipeline.generate_video(topic, scene_count)
```

### With HyperFrames
```bash
# Generate script first, then compose in HyperFrames
python -m app.services.complete_pipeline --topic "..." --output-script
# Copy script to rhythmix-*/script.txt
npx hyperframes@0.4.42 preview
```

## Troubleshooting

**Ollama not running?**
```bash
ollama serve &
# Check: curl http://localhost:11434/api/tags
```

**ComfyUI not found?**
```bash
cd ~/ComfyUI && python main.py
# Check: http://localhost:8188
```

**AudioCraft ffmpeg error?**
```bash
# Install ffmpeg
brew install ffmpeg  # macOS
sudo apt-get install ffmpeg  # Linux
choco install ffmpeg  # Windows
```

**Out of GPU memory?**
```python
# Use smaller models
pipeline = CompleteVideoPipeline(
    music_model="facebook/musicgen-small"  # Smaller, faster
)
```

## Next Steps

1. ✅ Install Ollama + ComfyUI locally
2. ✅ Install AudioCraft + ffmpeg
3. ✅ Run: `python -m app.services.complete_pipeline`
4. ✅ Generate 4-scene video (~4 minutes)
5. ✅ Batch generate 100 APPS videos

## References

- **OPEN_MODELS_PIPELINE.md** — Quick setup guide
- **FULL_STACK_PIPELINE.md** — Comprehensive reference & model selection
- **Ollama** — https://ollama.ai/
- **ComfyUI** — https://github.com/comfyui/ComfyUI
- **AudioCraft** — https://github.com/facebookresearch/audiocraft
- **Kokoro TTS** — https://github.com/hexgrad/kokoro

## License

MIT (code) | CC-BY-NC 4.0 (generated videos)
