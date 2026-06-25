# ComfyUI + RHYTHMIX Orchestrator Integration

Connect ComfyUI's powerful node-based workflows to your autonomous orchestrator for advanced visual AI generation.

## Overview

ComfyUI becomes another production service in your orchestrator, alongside Replicate, ElevenLabs, and Claude.

```
Your Voice Command
        ↓
   Orchestrator
   (Claude Plans)
        ↓
    ComfyUI Handler
    (Queues Workflow)
        ↓
  Local ComfyUI Instance
  (Generates with full control)
        ↓
    Output Asset
   (Video/Image)
```

## Installation

### Step 1: Install ComfyUI Locally

**Option A: Desktop App (Easiest)**
```bash
# Download from https://www.comfy.org/
# Windows or macOS
# Extract and run
```

**Option B: Portable (Windows)**
```bash
# Download portable build from releases page
# Unzip to: ~/ComfyUI
# Run: ComfyUI/run_nvidia_gpu.bat (or your GPU type)
```

**Option C: Manual Install**
```bash
# Clone repository
git clone https://github.com/comfyanonymous/ComfyUI.git
cd ComfyUI

# Python 3.12 or 3.13 recommended
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows

# Install PyTorch (choose your GPU type)
# NVIDIA:
pip install torch torchvision torchaudio --extra-index-url https://download.pytorch.org/whl/cu130

# AMD:
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/rocm7.2

# Apple Silicon:
pip install torch torchvision torchaudio

# Install dependencies
pip install -r requirements.txt

# Run
python main.py
```

### Step 2: Verify ComfyUI is Running

Open browser: `http://localhost:8188`

You should see the ComfyUI UI with a blank graph.

### Step 3: Install ComfyUI Models

Create model directories:
```bash
mkdir -p ComfyUI/models/checkpoints
mkdir -p ComfyUI/models/vae
mkdir -p ComfyUI/models/loras
mkdir -p ComfyUI/models/controlnet
```

Download models:
```bash
# Checkpoints (in models/checkpoints/)
# Stable Diffusion XL: sd_xl_base_1.0.safetensors
# Flux: flux-1-dev.safetensors
# Any other .ckpt or .safetensors files

# VAEs (in models/vae/)
# vae.safetensors

# ControlNets (in models/controlnet/)
# control_canny-fp16.safetensors
# control_depth-fp16.safetensors
```

## Configuration

### Orchestrator Config

Update `automation/config.json`:

```json
{
  "services": {
    "comfyui": {
      "enabled": true,
      "api": "local",
      "server": "http://127.0.0.1:8188",
      "timeout_seconds": 1800,
      "default_model": "sd_xl_base_1.0.safetensors",
      "templates": [
        "txt2img_sdxl",
        "img2img_sd",
        "controlnet",
        "upscale",
        "video_generation"
      ]
    }
  }
}
```

### Environment Variables

Add to `.env`:

```bash
# ComfyUI
COMFYUI_SERVER=http://127.0.0.1:8188
COMFYUI_OUTPUT_PATH=~/RHYTHMIX_Empire/output/comfyui
COMFYUI_DEFAULT_MODEL=sd_xl_base_1.0.safetensors
COMFYUI_TIMEOUT=1800
```

## Usage

### Start ComfyUI Server

**Terminal 1:**
```bash
cd ~/ComfyUI
python main.py
# Server running on http://127.0.0.1:8188
```

**Terminal 2: Start Orchestrator (with ComfyUI support)**
```bash
cd /home/user/jamie-wigg
source venv/bin/activate
python automation/orchestrator.py
```

**Terminal 3: Submit Workflows**
```python
from automation.handlers.comfyui_handler import ComfyUIOrchestrationHandler
import asyncio

async def demo():
    handler = ComfyUIOrchestrationHandler()
    
    # Generate image
    result = await handler.handle_text_to_image(
        prompt="A futuristic city at night with neon lights",
        negative_prompt="blur, low quality",
        width=1024,
        height=1024,
        steps=30,
        cfg=7.5
    )
    
    print(f"✅ Generated image: {result}")

asyncio.run(demo())
```

### Via Orchestrator (Autonomous)

```python
from automation.orchestrator import RHYTHMIXOrchestrator, TaskType, Task
from datetime import datetime

orchestrator = RHYTHMIXOrchestrator()

# Submit ComfyUI task
task = Task(
    id="comfyui-txt2img-001",
    type=TaskType.IMAGE_GENERATION,
    priority=TaskPriority.HIGH,
    payload={
        "handler": "comfyui",
        "action": "text_to_image",
        "prompt": "A serene landscape with mountains",
        "model": "sd_xl_base_1.0.safetensors",
        "width": 1024,
        "height": 1024,
        "steps": 25,
        "cfg": 7.0
    },
    created_at=datetime.now()
)

orchestrator.queue.enqueue(task)
```

## Workflow Templates

### 1. Text-to-Image (SDXL)

```python
handler = ComfyUIOrchestrationHandler()

result = await handler.handle_text_to_image(
    prompt="A professional product photo of a luxury watch",
    negative_prompt="blur, low quality, watermark",
    model="sd_xl_base_1.0.safetensors",
    width=1024,
    height=1024,
    steps=30,
    cfg=7.5
)
```

**Parameters:**
- `prompt` (str): Text description
- `negative_prompt` (str): What to avoid
- `model` (str): Checkpoint file
- `width`, `height` (int): Output dimensions
- `steps` (int): Sampling steps (more = better quality, slower)
- `cfg` (float): Classifier-free guidance (7-12 typical)

### 2. Image-to-Image

Modify existing images:

```python
result = await handler.handle_img2img(
    image_path="input.png",
    prompt="Make it look like oil painting",
    strength=0.7,  # 0-1, how much to change
    steps=20,
    cfg=7.0
)
```

### 3. ControlNet (Guided Generation)

Use edge maps, depth maps, or poses to guide generation:

```python
result = await handler.handle_controlnet_workflow(
    image_path="edge_map.png",
    prompt="A fantasy castle in the mountains",
    controlnet_model="control_canny-fp16.safetensors",
    strength=1.0
)
```

**Available ControlNet models:**
- `control_canny` — edge detection
- `control_depth` — depth maps
- `control_pose` — human pose
- `control_tile` — tile/pattern
- `control_lineart` — line art

### 4. Image Upscaling

Increase resolution:

```python
result = await handler.handle_image_upscale(
    image_path="image.png",
    upscale_factor=4,  # 2x, 4x, etc
    model="RealESRGAN_x4"
)
```

### 5. Video Generation

Combine frames into video:

```python
result = await handler.handle_video_generation(
    frames=[
        "frame_001.png",
        "frame_002.png",
        "frame_003.png",
        ...
    ],
    fps=30,
    audio="narration.wav"  # Optional
)
```

## Advanced: Custom Workflows

### Build Workflows Programmatically

```python
from automation.handlers.comfyui_handler import ComfyUIWorkflowBuilder

builder = ComfyUIWorkflowBuilder()

# Add nodes
checkpoint = builder.add_checkpoint_loader("sd_xl_base_1.0.safetensors")
positive = builder.add_clip_text_encode("A beautiful sunset", checkpoint)
negative = builder.add_clip_text_encode("blur, low quality", checkpoint)
empty_latent = builder.add_empty_latent_image(1024, 1024)
sampler = builder.add_ksampler(checkpoint, positive, negative, empty_latent, steps=30)
vae = builder.add_checkpoint_loader("sd_xl_base_1.0.safetensors")
decode = builder.add_vae_decode(sampler, vae)
save = builder.add_save_image(decode, "my_image")

# Build and execute
workflow = builder.build("custom_txt2img")
result = await client.queue_prompt(workflow)
```

### Load Existing ComfyUI Workflows

ComfyUI saves workflows as JSON:

```python
import json

# Load ComfyUI workflow file
with open("my_workflow.json") as f:
    workflow_dict = json.load(f)

workflow = ComfyUIWorkflow("loaded_workflow", workflow_dict)
result = await client.queue_prompt(workflow)
```

## Performance Tips

### 1. Memory Management

ComfyUI can run on modest hardware with smart memory management:

```bash
# For 6GB VRAM:
python main.py --lowvram

# For 4GB VRAM:
python main.py --cpu

# Force CPU mode (slow but works):
python main.py --cpu --lowvram
```

### 2. Latent Previews

Enable high-quality previews:

```bash
# Download TAESD decoder: taesd_decoder.pth
# Place in: ComfyUI/models/vae_approx/

# Run with TAESD:
python main.py --preview-method taesd
```

### 3. Async Queuing

Don't wait for one generation to finish before queuing the next:

```python
# Queue 10 images without waiting
for i in range(10):
    result = await client.queue_prompt(workflow)
    print(f"Queued: {result['prompt_id']}")

# Check results later
for prompt_id in queued_ids:
    history = await client.get_history(prompt_id)
```

### 4. Batch Processing

Generate multiple variations efficiently:

```python
prompts = [
    "A red car",
    "A blue car",
    "A green car",
    ...  # 100 variations
]

for i, prompt in enumerate(prompts):
    workflow = builder.build_txt2img(prompt, seed=i)
    await client.queue_prompt(workflow)
```

## Integrating with Your SaaS

### Video Generation SaaS

Use ComfyUI for custom video effects:

```python
# User uploads: script + style reference
# Orchestrator:
# 1. Generate keyframes (ComfyUI text-to-image)
# 2. Create interpolated sequence (ComfyUI upscale + morph)
# 3. Combine with narration (ElevenLabs)
# 4. Render video (FFmpeg)
# → User downloads professional video
```

### Content Automation SaaS

Use ComfyUI for platform-specific assets:

```python
# For TikTok: 1080x1920 vertical videos
# For Instagram: 1080x1080 square images
# For YouTube: 1920x1080 landscape

# Orchestrator generates all variants from single brief
# Each variant optimized for platform
```

### LLM Fine-tuning SaaS

Use ComfyUI to generate training data:

```python
# Generate synthetic training images:
# "Product photo in style X"
# "Person doing activity Y"
# "Scene type Z"

# Use generated images + captions for fine-tuning
```

## Troubleshooting

### ComfyUI Server Not Responding

```bash
# Check if running
curl http://127.0.0.1:8188/api/config

# Restart server
# Ctrl+C in ComfyUI terminal
python main.py
```

### Out of Memory

```bash
# Reduce model size or batch size
# Use --lowvram flag
# Run on CPU with --cpu flag
```

### Models Not Found

```bash
# ComfyUI logs what's missing
# Download to models/checkpoints/ or models/vae/
# Restart ComfyUI server
```

### Slow Generation

```bash
# Reduce steps (20 instead of 50)
# Reduce resolution (512x512 instead of 1024x1024)
# Use faster model (SD 1.5 instead of SDXL)
# Enable --preview-method latent for faster preview
```

## ComfyUI Manager (Optional)

Easily install custom nodes:

```bash
cd ComfyUI
git clone https://github.com/ltdrdata/ComfyUI-Manager custom_nodes/manager

# Or install via pip:
pip install -r custom_nodes/manager/manager_requirements.txt

# Run with manager enabled:
python main.py --enable-manager
```

Then visit http://localhost:8188 and use the manager to install:
- Custom upscalers
- Video generation nodes
- Animation nodes
- Advanced image processing

## Performance Benchmarks

| Model | Resolution | Steps | VRAM | Time (RTX 4090) | Time (RTX 3060) |
|-------|-----------|-------|------|-----------------|-----------------|
| SDXL | 1024x1024 | 30 | 20GB | 8s | 45s |
| SD 1.5 | 512x512 | 20 | 6GB | 2s | 8s |
| Flux | 1024x1024 | 50 | 45GB | 30s | N/A |
| UPSCALE | 512→2048 | N/A | 4GB | 5s | 15s |

## Resources

- **ComfyUI Docs**: https://github.com/comfyanonymous/ComfyUI
- **Workflow Examples**: https://www.comfy.org/workflow
- **Custom Nodes**: https://github.com/topics/comfyui
- **API Docs**: ComfyUI includes built-in API documentation

## Integration Checklist

- [ ] ComfyUI installed and running locally
- [ ] Models downloaded (checkpoint + VAE)
- [ ] Handler code integrated (`automation/handlers/comfyui_handler.py`)
- [ ] Config updated (`automation/config.json`)
- [ ] Environment variables set (`.env`)
- [ ] Test single workflow manually
- [ ] Integrate into orchestrator task queue
- [ ] Wire up for SaaS product
- [ ] Deploy with production orchestrator

## Next Steps

1. **Start ComfyUI locally** (1-2 hours for setup + models)
2. **Test workflows manually** (create in UI, export to JSON)
3. **Integrate handler** (update orchestrator to dispatch ComfyUI tasks)
4. **Build SaaS feature** (expose to users: upload prompt → get image)
5. **Optimize workflow** (benchmark, cache, parallelize)

Your empire now has full visual AI generation control. 🎨✨
