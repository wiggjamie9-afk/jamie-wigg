# Open Models Video Pipeline

**Goal:** Generate videos from topics using only open-source, locally-run models.

```
Topic → Ollama (LLM Script) → ComfyUI (Images) → Kokoro (TTS) → FFmpeg (Video)
```

## Components

### 1. **Ollama + Mistral** (Local LLM)
- Generates script + visual prompts in one pass
- Runs locally: `ollama serve`
- Models available: mistral, gemma4, neural-chat, etc.
- ~3-5 seconds per script generation

### 2. **ComfyUI + Flux.1-dev** (Local Image Generation)
- Converts visual prompts → images
- Install locally on your machine
- Flux.1-dev-fp8: 540×960 native (~30s per image)
- Upscale 2× in video pipeline

### 3. **Kokoro TTS** (Local Text-to-Speech)
- ✓ Already installed
- 30+ voices, multi-language
- Fast: ~5 seconds per minute of narration
- Command: `kokoro-tts --text "..." --voice af_bella -o narration.wav`

### 4. **FFmpeg** (Video Assembly)
- Ken Burns zoom effect (zoompan filter)
- Lanczos upscaling: 540×960 → 1080×1920
- ✓ Already available
- No artifacts (fixes moviepy stripe issues)

## Setup Instructions

### On Your Machine

```bash
# 1. Install Ollama
# macOS: brew install ollama
# Windows: Download from ollama.com
# Linux: curl -fsSL https://ollama.com/install.sh | sh

# Start Ollama server (background)
ollama serve &

# Pull models
ollama pull mistral
ollama pull gemma4

# 2. Install ComfyUI
git clone https://github.com/comfyui/ComfyUI.git
cd ComfyUI
pip install -r requirements.txt
python main.py
# Runs at http://localhost:8188
```

### In This Environment

- Ollama Python library: ✓ Installed
- Video pipeline scaffolding: ✓ Ready
- Services:
  - `app/services/ollama_llm.py` — LLM director script + visuals
  - `app/services/video_pipeline.py` — Complete pipeline orchestration

## Usage

```python
from app.services.video_pipeline import VideoPipeline

pipeline = VideoPipeline(
    output_dir="videos",
    llm_model="mistral",
    comfyui_url="http://localhost:8188"
)

result = pipeline.generate_video(
    topic="Street vendor's daily hustle",
    scene_count=4,
    title="vendor_story"
)
```

## Performance Notes

- **Total time per video** (4 scenes):
  - Ollama script generation: ~10s
  - ComfyUI images (4×): ~2min
  - Kokoro TTS: ~5s
  - FFmpeg assembly: ~30s
  - **Total: ~3 minutes**

- **Storage:** 
  - Ollama models (Mistral): ~5GB
  - ComfyUI models (Flux): ~15GB
  - Per video: ~50MB

- **Hardware needed:**
  - CPU: OK (slow but works)
  - GPU: Preferred (10GB+ VRAM for Flux)
  - RAM: 8GB minimum

## Next Steps

1. ✓ Install Ollama locally + pull Mistral
2. ✓ Install ComfyUI locally + download Flux.1-dev-fp8
3. Run test pipeline: `python -m app.services.video_pipeline`
4. Integrate into Studio or HyperFrames workflow
5. Scale to 100 APPS mission (batch generation)

## Models Comparison

| Model | Speed | Quality | Size | Tokens |
|-------|-------|---------|------|--------|
| Mistral | ⚡⚡⚡ | ⭐⭐⭐ | 5GB | 32K |
| Gemma 4 | ⚡⚡ | ⭐⭐⭐⭐ | 7GB | 8K |
| Neural Chat | ⚡⚡⭐ | ⭐⭐⭐ | 13GB | 8K |

**Recommendation:** Start with Mistral (fastest, great quality for scripts).

