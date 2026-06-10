# Complete Pipeline Flow

## Visual Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER INPUT                                  │
│                    Topic + Scene Count                              │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    STEP 1: LLM SCRIPT                               │
│              Ollama (Mistral @ localhost:11434)                    │
├─────────────────────────────────────────────────────────────────────┤
│  Input:  Topic ("Street vendor's daily routine")                    │
│  Output: {                                                          │
│    "script": "Full narration text...",                              │
│    "scenes": [                                                      │
│      {                                                              │
│        "narration": "Vendor sets up stall at dawn...",             │
│        "visual_prompt": "Warm sunrise, market stall..."            │
│      },                                                             │
│      ...                                                            │
│    ]                                                                │
│  }                                                                  │
│                                                                     │
│  Time: ~10s (script generation)                                    │
│  Model: Mistral 7B (5GB)                                           │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                ┌──────────────┼──────────────┐
                ▼              ▼              ▼
         [Image Path]   [Music Path]  [Narration Path]
                │              │              │
                ▼              ▼              ▼
    ┌──────────────────┐ ┌──────────┐ ┌──────────────┐
    │   STEP 2: AI    │ │  STEP 3: │ │  STEP 4:    │
    │     IMAGES      │ │  MUSIC   │ │  NARRATION  │
    │   (Parallel)    │ │(Parallel)│ │ (Parallel)  │
    └────────┬─────────┘ └────┬─────┘ └──────┬──────┘
             │                │              │
             ▼                ▼              ▼
    ┌──────────────────┐ ┌──────────┐ ┌──────────────┐
    │   ComfyUI        │ │AudioCraft│ │  Kokoro TTS  │
    │ Flux.1-dev       │ │MusicGen  │ │ af_bella     │
    │ :8188            │ │ localhost│ │ localhost    │
    └────────┬─────────┘ └────┬─────┘ └──────┬──────┘
             │                │              │
    Input:   │                │              │
    Visual   │   Prompt       │   Narration  │
    Prompts  │   (music)      │   Text       │
             │                │              │
    Output:  │                │              │
    PNGs     │   WAV files    │   WAV file   │
    (4x)     │   (4x)         │   (1x)       │
             │                │              │
    Time:    │                │              │
    ~2min    │   ~1min        │   ~5s        │
    (GPU)    │   (GPU)        │   (CPU)      │
             │                │              │
             └────────┬───────┴──────────────┘
                      │
                      ▼
    ┌─────────────────────────────────────────────┐
    │      STEP 5: VIDEO ASSEMBLY (FFmpeg)        │
    │                                             │
    │  INPUT FILES:                               │
    │  • 4x PNG images (540×960 each)            │
    │  • 4x music WAV files                      │
    │  • 1x narration WAV file                   │
    │                                             │
    │  PROCESSING:                                │
    │  1. Ken Burns zoom effect (ffmpeg zoompan) │
    │  2. Lanczos upscale: 540×960 → 1080×1920  │
    │  3. Mix music (0.3 volume) + narration     │
    │  4. Encode to H.264 MP4                    │
    │                                             │
    │  OUTPUT:                                    │
    │  → final_video.mp4 (1080×1920, ~4min)     │
    │                                             │
    │  Time: ~30s (ffmpeg encoding)              │
    └──────────────┬───────────────────────────┘
                   │
                   ▼
        ┌─────────────────────────┐
        │   FINAL OUTPUT          │
        │                         │
        │  1080×1920 MP4          │
        │  30fps                  │
        │  Duration: ~4min        │
        │  File size: ~50MB       │
        │                         │
        │  Ready for:             │
        │  • YouTube              │
        │  • TikTok               │
        │  • Instagram Reels      │
        │  • LinkedIn             │
        └─────────────────────────┘
```

---

## Step-by-Step Breakdown

### **STEP 1: LLM Script Generation** (10s)
```python
OllamaDirector.generate_script_with_visuals(
    topic="Street vendor's daily routine",
    scene_count=4
)
```

**Input:** One topic string  
**Processing:** Mistral 7B generates script + visual prompts  
**Output:** JSON with narration + visual descriptions per scene  
**Example:**
```json
{
  "script": "At dawn, a street vendor sets up their stall...",
  "scenes": [
    {
      "narration": "Vendor arrives before sunrise with supplies",
      "visual_prompt": "Golden sunrise light, vendor arranging goods"
    },
    ...
  ]
}
```

---

### **STEP 2: AI Image Generation** (~2 min, parallel)
```python
ComfyUI.generate_image(
    prompt="Golden sunrise light, vendor arranging goods",
    width=540,
    height=960
)
```

**Input:** Visual prompt from script  
**Processing:** Flux.1-dev generates 540×960 PNG  
**Time per image:** ~30s  
**Batch size:** 4 scenes = ~2 minutes total  
**Output:** `scene_1.png`, `scene_2.png`, `scene_3.png`, `scene_4.png`

---

### **STEP 3: Music Generation** (~1 min, parallel)
```python
AudioCraft.generate_music(
    prompt="Uplifting market ambiance with vibrant energy",
    duration=30
)
```

**Input:** Narration + visual context  
**Processing:** MusicGen generates 30s background music  
**Time per music clip:** ~15s  
**Batch size:** 4 scenes = ~1 minute total  
**Output:** `scene_1_music.wav`, `scene_2_music.wav`, etc.

---

### **STEP 4: Text-to-Speech Narration** (~5s, parallel)
```bash
kokoro-tts \
  --text "At dawn, a street vendor sets up their stall..." \
  --voice af_bella \
  -o narration.wav
```

**Input:** Full script narration text  
**Processing:** Kokoro TTS converts to speech  
**Time:** ~5s for ~4 minutes of narration  
**Voice:** af_bella (female, warm English)  
**Output:** `narration.wav`

---

### **STEP 5: Video Assembly** (~30s)
```bash
ffmpeg -i scene_1.png -i scene_1_music.wav -i narration.wav \
  -filter_complex "[0]scale=1920:1920,zoompan=z='1.1*t':d=120:s=1080x1920[v];
                   [1]aformat=sample_rates=48000[a1];
                   [2]aformat=sample_rates=48000[a2];
                   [a1]volume=0.3[bg];
                   [a2]volume=1.0[fg];
                   [bg][fg]amix=inputs=2:duration=longest[audio]" \
  -map "[v]" -map "[audio]" -c:v libx264 -c:a aac output.mp4
```

**Input Files:**
- `scene_1.png` — 540×960 PNG from Flux
- `scene_1_music.wav` — 30s background music
- `narration.wav` — Full narration audio

**Processing:**
1. **Ken Burns Zoom:** zoompan filter creates smooth zoom effect
2. **Upscale:** 540×960 → 1080×1920 (Lanczos quality)
3. **Audio Mix:** Music (0.3 volume) + Narration (1.0 volume)
4. **Encode:** H.264 video + AAC audio → MP4

**Output:** `final_video.mp4` (1080×1920, 30fps, ~4 min duration)

---

## Timeline

```
Time    Step                    Duration    Notes
────────────────────────────────────────────────────────
0s      START

0-10s   LLM Script Generation   10s         (Ollama local)
        └─ Generate script + visual prompts

10s     PARALLEL FORK

10-130s │ STEP 2: Images        120s        4 images × 30s each
        │ (ComfyUI Flux)        (parallel)  Requires GPU
        │ └─ 4× PNG 540×960

10-70s  │ STEP 3: Music         60s         4 clips × 15s each
        │ (AudioCraft)          (parallel)  Requires GPU
        │ └─ 4× WAV 30s each

10-15s  │ STEP 4: Narration     5s          60s of speech
        │ (Kokoro TTS)          (parallel)  CPU-friendly
        │ └─ 1× WAV full script

130s    PARALLEL JOIN
        └─ All files ready

130-160s STEP 5: FFmpeg          30s         Video encoding
        └─ Assemble + encode

160s    DONE ✓
        └─ final_video.mp4 ready
```

**Critical Path:** 10s (script) + 120s (images) + 30s (ffmpeg) = **~160s = ~2.7 min**

---

## File Organization

```
videos/
├── vendor_story/
│   ├── vendor_story_script.json
│   ├── images/
│   │   ├── scene_1.png (540×960)
│   │   ├── scene_2.png
│   │   ├── scene_3.png
│   │   └── scene_4.png
│   ├── music/
│   │   ├── scene_1_music.wav
│   │   ├── scene_2_music.wav
│   │   ├── scene_3_music.wav
│   │   └── scene_4_music.wav
│   ├── narration.wav (full script)
│   └── vendor_story_final.mp4 (1080×1920, final output)
```

---

## Quality Checkpoints

| Stage | Quality Check | Pass/Fail |
|-------|---|---|
| Script | Grammar, coherence, pacing | ✓ |
| Images | Composition, lighting, style consistency | ✓ |
| Music | Tone matches narration, no artifacts | ✓ |
| Narration | Clear audio, proper pacing, no noise | ✓ |
| Video | Ken Burns smooth, no upscale artifacts, sync | ✓ |

---

## Configuration Options

```python
pipeline = CompleteVideoPipeline(
    # LLM Script
    llm_model="mistral",           # mistral | gemma4 | neural-chat
    
    # Image Generation
    image_width=540,               # Width (px)
    image_height=960,              # Height (px)
    
    # Music Generation
    music_model="facebook/musicgen-medium",  # small | medium | large
    music_duration=30,             # Seconds per scene
    
    # TTS Narration
    kokoro_voice="af_bella",       # af_bella | am_michael | etc.
    
    # Video Output
    output_video_width=1080,       # Final resolution
    output_video_height=1920,
    output_fps=30,
    
    # Endpoints
    comfyui_url="http://localhost:8188",
    ollama_url="http://localhost:11434"
)
```

---

## Scaling to 100 APPS

```
For 100 videos:

Sequential:         100 × 160s = 16,000s = 4.4 hours
Parallel (4 GPUs):  100 × 160s ÷ 4 = 1.1 hours
Optimal:            1.7 hours (with smart batching)

Cost: $0 (vs $60 with Replicate + ElevenLabs)
```

---

## Error Handling

```python
try:
    result = pipeline.generate_video(topic, scene_count)
except ComfyUIError:
    print("ComfyUI not running. Start: python main.py")
except OllamaError:
    print("Ollama not running. Start: ollama serve")
except AudioCraftError:
    print("AudioCraft error. Check ffmpeg installed")
except Exception as e:
    print(f"Pipeline error: {e}")
    # Check logs in output_dir/
```

---

## Monitoring

```bash
# Watch Ollama
tail -f ~/.ollama/logs/

# Check ComfyUI
curl http://localhost:8188/api/status

# Monitor disk space
du -sh videos/

# Check GPU usage
nvidia-smi  # NVIDIA
rocm-smi    # AMD
```

---

**Ready to run this pipeline!** 🎬
