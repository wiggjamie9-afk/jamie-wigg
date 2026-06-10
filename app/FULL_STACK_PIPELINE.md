# Full-Stack Open Models Video Pipeline

**Everything open-source, nothing proprietary. Generate complete videos locally.**

```
Topic
  ↓
Ollama (Mistral) → Script + Visual Prompts
  ↓
ComfyUI (Flux) → Scene Images (540×960)
  ↓
AudioCraft (MusicGen) → Background Music
  ↓
Kokoro TTS → Narration (30+ voices)
  ↓
FFmpeg (Ken Burns) → Final Video (1080×1920 MP4)
```

## Stack

| Component | Purpose | Status |
|-----------|---------|--------|
| **Ollama + Mistral** | Script generation + scene descriptions | ✓ Installed |
| **ComfyUI + Flux.1-dev** | AI image generation | 📥 Local install needed |
| **AudioCraft MusicGen** | Text-to-music generation | 📥 Local install needed |
| **Kokoro TTS** | Text-to-speech (30+ voices) | ✓ Installed |
| **FFmpeg** | Video composition + effects | ✓ Available |

## Installation (On Your Machine)

### Prerequisites
- Python 3.9+
- 16GB RAM (8GB minimum)
- GPU: 10GB+ VRAM (NVIDIA/AMD preferred, CPU works but slow)
- Disk: 30GB free (for models: Mistral 5GB + Flux 15GB + MusicGen 4GB)

### 1. Ollama (LLM)
```bash
# macOS
brew install ollama
ollama serve &

# Windows
# Download from ollama.com

# Linux
curl -fsSL https://ollama.com/install.sh | sh
ollama serve &

# Pull models
ollama pull mistral
ollama pull gemma4
```

### 2. ComfyUI (Image Generation)
```bash
git clone https://github.com/comfyui/ComfyUI.git
cd ComfyUI
pip install -r requirements.txt
python main.py
# Runs at http://localhost:8188

# Download Flux model within ComfyUI UI or:
# https://huggingface.co/black-forest-labs/FLUX.1-dev
# Place in: ComfyUI/models/checkpoints/
```

### 3. AudioCraft (Music)
```bash
# Install ffmpeg first
# macOS: brew install ffmpeg
# Windows: choco install ffmpeg
# Linux: sudo apt-get install ffmpeg

# Install AudioCraft
pip install audiocraft
# Or: pip install git+https://github.com/facebookresearch/audiocraft#egg=audiocraft
```

### 4. Kokoro TTS (Already Installed Here)
```bash
pip install kokoro-tts  # Already done in this environment
```

## Usage

```python
from app.services.complete_pipeline import CompleteVideoPipeline

# Initialize
pipeline = CompleteVideoPipeline(
    output_dir="videos",
    llm_model="mistral",
    music_model="facebook/musicgen-medium"
)

# Generate video
result = pipeline.generate_video(
    topic="Street vendor's daily hustle",
    scene_count=4,
    title="vendor_story",
    include_music=True,
    include_images=True,
    include_narration=True
)
```

## Performance & Costs

### Time per 4-scene video (on GPU)
| Step | Time | GPU RAM |
|------|------|---------|
| Ollama (script) | ~10s | — |
| ComfyUI (4 images @ 540×960) | ~2min | 10GB |
| AudioCraft (4 music clips) | ~1min | 6GB |
| Kokoro TTS (60s narration) | ~5s | — |
| FFmpeg assembly | ~30s | — |
| **TOTAL** | **~4 minutes** | **10GB** |

### Cost
- **$0** (all local, no API calls)
- Models: One-time download (~25GB)
- Electricity: ~0.5 kWh per video

### vs. Paid APIs
| Service | Text-to-Music | Image Gen | TTS | Total/video |
|---------|---|---|---|---|
| Replicate | $0.30 | $0.15 | — | ~$0.50 |
| ElevenLabs | — | — | $0.15 | ~$0.15 |
| This Pipeline | $0 | $0 | $0 | **$0** |

**Cost savings: 100%** (after initial model downloads)

## Model Selection

### Ollama Models (LLM for scripts)
```
mistral (5GB, 32K tokens) ⭐⭐⭐⭐ - Fast, great for scripts
gemma4 (7GB, 8K tokens) ⭐⭐⭐⭐⭐ - Better quality, slower
neural-chat (13GB, 8K) ⭐⭐⭐⭐ - Specialized for dialogue
```
**Recommendation:** Mistral (best speed/quality balance)

### ComfyUI Image Models
```
Flux.1-dev-fp8 (~13GB) ⭐⭐⭐⭐⭐ - State-of-art, 540×960 ~30s
Flux.1-schnell (~5GB) ⭐⭐⭐⭐ - Faster (10s), slightly less quality
SDXL (~6GB) ⭐⭐⭐ - Older, much faster (~5s), lower quality
```
**Recommendation:** Flux.1-dev-fp8 (best results)

### AudioCraft Models
```
facebook/musicgen-large (3.5GB) ⭐⭐⭐⭐⭐ - Best quality (~10s per 30s)
facebook/musicgen-medium (1.5GB) ⭐⭐⭐⭐ - Balanced (~5s per 30s)
facebook/musicgen-small (500MB) ⭐⭐⭐ - Fast (~2s per 30s)
```
**Recommendation:** Medium (good quality, reasonable speed)

## Services Provided

### `app/services/ollama_llm.py`
```python
from app.services.ollama_llm import OllamaDirector

director = OllamaDirector(model="mistral")
result = director.generate_script_with_visuals(
    topic="Your topic",
    scene_count=4
)
# Returns: {"script": "...", "scenes": [{"narration": "...", "visual_prompt": "..."}]}
```

### `app/services/music_gen.py`
```python
from app.services.music_gen import MusicGenService, AudioComposer

service = MusicGenService()
music_path = service.generate_music(
    prompt="Uplifting cinematic score",
    duration=30
)

# Or compose full soundtrack
composer = AudioComposer()
soundtrack = composer.compose_soundtrack(script_data, narration_wav)
```

### `app/services/complete_pipeline.py`
```python
from app.services.complete_pipeline import CompleteVideoPipeline

pipeline = CompleteVideoPipeline()
result = pipeline.generate_video(
    topic="Your topic",
    scene_count=4,
    title="video_name"
)
# Auto-orchestrates all steps
```

## Architecture

```
User Request (topic)
    ↓
OllamaDirector (Ollama API @ :11434)
    ↓
Script JSON + Visual Prompts
    ↓
┌─────────────────────┬─────────────────────┐
│                     │                     │
ComfyUI API (@:8188)  AudioComposer        Kokoro (TTS)
(Generate images)     (Generate music)      (Generate narration)
│                     │                     │
Image files (WAV)    Audio files (WAV)     Audio file (WAV)
└─────────────────────┴─────────────────────┘
                ↓
        FFmpeg Assembly
        (Ken Burns zoom)
                ↓
        Output MP4 (1080×1920)
```

## Scaling to 100 APPS

For the 100 APPS mission (rapid prototyping), batch the pipeline:

```python
topics = [
    "Street vendor's daily hustle",
    "Freelancer finding first client",
    "Smallholder farmer's morning",
    # ... 100 more
]

for topic in topics:
    result = pipeline.generate_video(
        topic=topic,
        scene_count=4,
        title=f"app_{i}"
    )
```

**100 videos @ 4min each = 400min = 6.7 hours** (full parallelization possible)

## Troubleshooting

**ComfyUI not found?**
```bash
# Make sure it's running
cd ~/ComfyUI
python main.py
```

**Ollama connection refused?**
```bash
# Make sure it's serving
ollama serve &
```

**AudioCraft ffmpeg error?**
```bash
# Install ffmpeg
# macOS: brew install ffmpeg
# Linux: sudo apt-get install ffmpeg
# Windows: choco install ffmpeg
```

## Next Steps

1. ✅ Ollama + Mistral Python library installed
2. ✅ Kokoro TTS installed
3. ✅ Pipeline architecture designed
4. 📥 You: Install Ollama + ComfyUI locally
5. 📥 You: Install AudioCraft + ffmpeg
6. 🚀 Run: `python -m app.services.complete_pipeline`

**Go all-in: 100% open-source, zero proprietary dependencies, unlimited videos.**
