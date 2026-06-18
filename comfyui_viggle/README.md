# ComfyUI Viggle Motion Generation Suite

Integrated motion capture, character animation, and video generation workflows for RHYTHMIX ecosystem.

## Overview

Viggle is a motion generation tool that works with ComfyUI to create:
- **Character animation** from motion capture data
- **Background removal & inpainting** (LAMA-based)
- **Video animation** with AnimateDiff
- **SDXL-powered** image-to-motion synthesis

## Workflows

### 1. **workflow1_lama_inpaint.json**
- **Purpose**: Character removal with background inpainting
- **Use case**: Remove characters from reference images, generate clean backgrounds
- **Model**: LAMA (Large Mask Inpainting Model)
- **Output**: Inpainted image for use as motion target

### 2. **workflow2_animatediff.json**
- **Purpose**: Frame-by-frame animation generation
- **Use case**: Motion synthesis from static images
- **Model**: AnimateDiff (LoRA-based motion)
- **Output**: MP4 video with motion applied

### 3. **workflow3_animatediff_sdxl.json**
- **Purpose**: SDXL-powered motion generation
- **Use case**: High-quality image generation + animation
- **Model**: Stable Diffusion XL + AnimateDiff
- **Output**: Generated image + motion video

### 4. **workflow2_2_animatediff_alt.json**
- **Purpose**: Alternative AnimateDiff configuration
- **Use case**: Testing different motion parameters
- **Model**: AnimateDiff with alternative settings
- **Output**: MP4 with varied motion characteristics

## Architecture

```
comfyui_viggle/
├── workflows/          # ComfyUI JSON workflow definitions
│   ├── workflow1_lama_inpaint.json
│   ├── workflow2_animatediff.json
│   ├── workflow3_animatediff_sdxl.json
│   └── workflow2_2_animatediff_alt.json
├── configs/            # Workflow configuration files
├── models/             # Downloaded model checkpoints
├── outputs/            # Generated videos and images
├── docs/               # Documentation
└── README.md           # This file
```

## Integration Points

### With HyperFrames
- **Input**: Generated MP4 videos from Viggle workflows
- **Usage**: Layer Viggle output into HyperFrames compositions
- **Output**: Branded RHYTHMIX promo videos

### With Ruflo V3
- **Agent**: `viggle-motion-agent` (available via Ruflo)
- **Task routing**: Automated workflow selection based on input
- **Memory**: Store motion parameters, successful configs

### With RHYTHMIX Studio
- **Endpoint**: `/api/viggle/generate` (when ComfyUI service is running)
- **Input formats**: PNG, JPG, MP4
- **Output**: Animated MP4 ready for composition

## Usage

### Basic Viggle Animation (via Ruflo)

```bash
# Spawn Viggle agent for motion generation
npx @claude-flow/cli@latest agent spawn -t viggle-motion-agent

# Or use the skill directly
/viggle-animate input.png --workflow animatediff --duration 5s
```

### With HyperFrames

```bash
# Generate motion video, then compose into RHYTHMIX promo
npx hyperframes compose --input viggle-output.mp4 --template rhythmix-60s
```

### Direct ComfyUI (when service running)

```bash
# Upload workflow + input image
curl -X POST http://localhost:8188/api/viggle \
  -F workflow=workflow2_animatediff.json \
  -F image=@input.png

# Poll for output
curl http://localhost:8188/api/viggle/status/JOB_ID
```

## Models Required

Download these into `comfyui_viggle/models/`:

1. **LAMA** (inpainting)
   - ~350MB
   - Path: `models/lama/`

2. **AnimateDiff**
   - Motion LoRA modules (~100MB each)
   - Path: `models/animatediff/`

3. **Stable Diffusion / SDXL**
   - For image generation (XL: ~7GB)
   - Path: `models/checkpoints/`

## Workflow Parameters

### workflow1 (LAMA Inpainting)
```json
{
  "dilate_mask": 15,           // Expand mask area
  "inpaint_model": "lama",     // Model selector
  "cv2_morphology": "dilate"   // Dilation method
}
```

### workflow2 (AnimateDiff)
```json
{
  "motion_scale": 1.0,         // Motion intensity (0.0-2.0)
  "steps": 25,                 // Diffusion steps (16-50)
  "cfg_scale": 7.5,            // Guidance scale
  "seed": -1                   // -1 for random
}
```

### workflow3 (SDXL AnimateDiff)
```json
{
  "positive_prompt": "...",    // Generation prompt
  "negative_prompt": "...",    // Negative prompt
  "width": 1024,               // Output width
  "height": 1024,              // Output height
  "motion_lora": "default"     // Motion LoRA selection
}
```

## Output Formats

- **Images**: PNG (transparency preserved)
- **Videos**: MP4 (h264 codec, 30fps default)
- **Max resolution**: 1080p (2K on SDXL)
- **Max duration**: 10 seconds

## Error Handling

| Error | Cause | Solution |
|-------|-------|----------|
| `Model not found` | Checkpoint missing | Download to `models/` |
| `CUDA out of memory` | Batch too large | Reduce resolution or steps |
| `Invalid workflow` | JSON parsing error | Validate with `jsonlint` |
| `Timeout` | Processing stalled | Check system resources |

## Next Steps

1. **Download models** into `comfyui_viggle/models/`
2. **Start ComfyUI** (local or Docker):
   ```bash
   docker run -it --gpus all -p 8188:8188 comfyui:latest
   ```
3. **Test a workflow**:
   ```bash
   /viggle-animate sample.png --workflow animatediff
   ```
4. **Integrate with HyperFrames**:
   ```bash
   /rhythmix-viggle-promo "mystudio" --motion viggle-output.mp4
   ```

## References

- **ComfyUI**: https://github.com/comfyanonymous/ComfyUI
- **Viggle**: https://viggle.ai/
- **AnimateDiff**: https://github.com/guoyww/AnimateDiff
- **LAMA**: https://github.com/advimman/lama

## Status

- ✅ Workflows downloaded (4/4)
- ⏳ ComfyUI service integration pending
- ⏳ Ruflo agent implementation pending
- ⏳ HyperFrames skill bridge pending
