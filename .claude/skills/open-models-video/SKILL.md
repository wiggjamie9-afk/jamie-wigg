---
name: open-models-video
description: Generate videos end-to-end using open-source models (Ollama for script generation, ComfyUI for images, AudioCraft for music, Kokoro for TTS, FFmpeg for composition). Zero API costs. Use for any video generation task where you want full control and no reliance on paid services. Ideal for rapid prototyping, batch generation, and 100 APPS mission content.
metadata:
  tags: video, open-source, ollama, comfyui, audiocraft, kokoro, ffmpeg, automation
---

## When to use

User asks for:
- "Generate a video about X topic"
- "Create a video for [app concept]"
- "Make videos for the 100 APPS mission"
- Any video task where they want open-source models or zero API cost
- Batch generation of multiple videos

Do NOT use this skill if:
- User explicitly requests proprietary APIs (Replicate, ElevenLabs, etc.)
- User needs real-time interactive video editing
- User asks for Remotion-based compositions (use `hyperframes` or `remotion` instead)

## Prerequisites

Before running any video generation:

1. **Local services must be running:**
   ```bash
   # Terminal 1: Ollama
   ollama serve &
   ollama pull mistral
   
   # Terminal 2: ComfyUI
   cd /path/to/ComfyUI && python main.py
   
   # Terminal 3: Test they're accessible
   curl -s http://localhost:11434/api/tags | jq .
   curl -s http://localhost:8188/system_stats | jq .
   ```

2. **Python environment (in this repo's `app/`):**
   ```bash
   cd /home/user/jamie-wigg/app
   pip install -r requirements.txt  # or run setup from SETUP_LOCAL_MACHINE.md
   ```

3. **Verification:** Run `python TEST_PIPELINE.py` to confirm all services are accessible.

## Architecture

Five-stage pipeline (automatic orchestration via `CompleteVideoPipeline`):

| Stage | Tool | Input | Output | Time |
|-------|------|-------|--------|------|
| 1. Script + Visuals | Ollama (Mistral) | Topic + scene count | JSON: narration + visual prompts | ~10s |
| 2. Images | ComfyUI (Flux.1-dev) | Visual prompts | 540×960 PNGs (5 images) | ~120s |
| 3. Music | AudioCraft (MusicGen) | Script context + mood | 30s WAV background tracks | ~30s |
| 4. Narration | Kokoro TTS | Narration text + voice | 22kHz WAV | ~3s |
| 5. Video | FFmpeg (zoompan) | Images + audio | 1080×1920 MP4 | ~10s |

**Total time:** ~173s per video (under 3 minutes). **Cost:** $0.

## Usage Examples

### Single video generation

```python
from app import CompleteVideoPipeline

pipeline = CompleteVideoPipeline(
    llm_model="mistral",
    music_model="small",  # or "medium" / "large"
    comfyui_url="http://localhost:8188",
    kokoro_voice="af_bella"  # or any of 30+ Kokoro voices
)

output_path = pipeline.generate_video(
    topic="Mobile point-of-sale system for street vendors",
    scene_count=5,
    title="VendorPOS"
)
print(f"Video saved to: {output_path}")
```

### Batch generation (100 APPS mission)

```python
from app import CompleteVideoPipeline

apps = [
    {"topic": "Street vendor POS", "title": "VendorPOS"},
    {"topic": "Freelancer income tracker", "title": "GigsMaster"},
    {"topic": "Livestock health screening", "title": "HerdCheck"},
    # ... more apps
]

pipeline = CompleteVideoPipeline()
for app in apps:
    output = pipeline.generate_video(
        topic=app["topic"],
        scene_count=5,
        title=app["title"]
    )
    print(f"✓ {app['title']}: {output}")
```

### With custom configuration

```python
pipeline = CompleteVideoPipeline(
    llm_model="qwen2.5",              # Chinese script generation
    music_model="medium",              # better quality music
    comfyui_url="http://192.168.1.5:8188",  # remote GPU machine
    kokoro_voice="am_michael"          # American male narrator
)
```

## Configuration options

**LLM models** (via Ollama):
- `mistral` — balanced, English-focused (default, ~7B)
- `qwen2.5` — strong Chinese, instruction-following (~7B)
- `gemma` — efficient (~2B variant available)
- `neural-chat` — conversational, aligned (~7B)

**Music models** (AudioCraft):
- `small` — fast, acceptable quality (~300MB VRAM)
- `medium` — default balance (~1.5GB VRAM)
- `large` — highest quality (~5GB VRAM)

**Kokoro voices** (30+ options):
- `af_bella` (default) — American female, warm
- `am_michael` — American male, conversational
- `bf_emma` — British female, modern
- `bf_james` — British male, authoritative
- See `app/README.md` for full list

## Output structure

Generated video lands in `app/outputs/{title}/`:

```
outputs/VendorPOS/
├── script_output.json      # Full script + visual prompts
├── images/
│   ├── scene_0.png
│   ├── scene_1.png
│   ├── scene_2.png
│   ├── scene_3.png
│   └── scene_4.png
├── narration.wav           # TTS audio (44.1kHz)
├── background_music.wav    # Scene-specific music
├── final_mix.wav           # Balanced composite audio
└── VendorPOS.mp4          # Final output
```

## Troubleshooting

**"Connection refused at localhost:11434"**
- Ollama service not running. Start with: `ollama serve &`
- Model not downloaded. Run: `ollama pull mistral`

**"Connection refused at localhost:8188"**
- ComfyUI not running. Start ComfyUI from its directory with `python main.py`
- Check that Flux.1-dev model is installed in ComfyUI's models folder (~13GB)

**"CUDA out of memory" (ComfyUI)**
- ComfyUI image generation failed. Switch to CPU-only mode or use smaller image size (480×850 instead of 540×960)
- Reduce `music_model` from "large" to "medium"

**"JSON decode error" (script generation)**
- Ollama returned malformed output. Retry — Mistral sometimes needs 2-3 attempts on edge cases
- Increase `max_retries` in `OllamaDirector` if persistent

## Integration with HyperFrames

After video generation, composite the MP4 into a HyperFrames HTML promo:

```bash
# Option 1: Use the generated MP4 directly in a <video> clip
cd rhythmix-my-promo-60s/
echo '<video id="promo" src="/path/to/VendorPOS.mp4"></video>' >> index.html

# Option 2: Extract frames and build a custom HyperFrames composition
ffmpeg -i VendorPOS.mp4 -vf fps=30 frame_%04d.png
# Then reference frames in a custom composition
```

## Cost analysis

| Approach | Cost per video | Setup time | Quality |
|----------|---|---|---|
| **Open models (this skill)** | $0 | 1–2 hours (one-time) | 7/10 |
| Replicate + ElevenLabs | $0.60–$1.20 | 10 min | 8/10 |
| Runway Studio | $0.50–$5 | 5 min | 8.5/10 |
| Professional production | $500–$5000 | weeks | 10/10 |

For 100 videos:
- **Open models:** $0 (after setup)
- **Replicate:** $60–$120
- **Professional:** $50K–$500K

## Performance optimization

**Faster generation (trade image quality):**
```python
# Use smaller Flux model variant (if available)
# Reduce image resolution from 540×960 to 480×850
# Use "small" music model instead of "medium"
```

**Parallel batch processing** (multiple machines):
```bash
# On GPU machine 1: ComfyUI on port 8188
# On GPU machine 2: ComfyUI on port 8189
# In Python:
pipeline1 = CompleteVideoPipeline(comfyui_url="http://gpu1:8188")
pipeline2 = CompleteVideoPipeline(comfyui_url="http://gpu2:8189")
# Generate 2 videos in parallel
```

## Files to reference

- `app/README.md` — comprehensive service documentation (500 lines)
- `app/FULL_STACK_PIPELINE.md` — deep technical guide with installation
- `app/PIPELINE_FLOW.md` — ASCII diagrams and step-by-step breakdown
- `SETUP_LOCAL_MACHINE.md` — platform-specific installation (one-click setup.sh)
- `app/TEST_PIPELINE.py` — executable test suite
