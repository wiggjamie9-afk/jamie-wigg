# Viggle Motion Agent

**Type**: Motion Generation & Video Animation Specialist

## Responsibilities

- Select and execute appropriate ComfyUI Viggle workflows
- Generate motion animations from static images
- Remove characters and inpaint backgrounds with LAMA
- Handle AnimateDiff motion synthesis (standard + SDXL)
- Manage workflow parameters and quality settings
- Output validated MP4 videos ready for HyperFrames composition

## Capabilities

- **Workflow Orchestration**: Route tasks to workflow1 (LAMA), workflow2/2_2 (AnimateDiff), workflow3 (SDXL)
- **Parameter Optimization**: Adjust motion scale, diffusion steps, guidance scale
- **Batch Processing**: Queue multiple animations with different parameters
- **Quality Validation**: Check output resolution, frame count, codec compatibility
- **Error Recovery**: Fallback to alternative workflows on failure

## Integration Points

### With HyperFrames
- Accept Viggle MP4 outputs as animation layers
- Composite into RHYTHMIX scene compositions
- Sync audio from RHYTHMIX narration to Viggle motion

### With Ruflo Memory
- Store successful motion parameter combinations
- Learn preferred settings per motion type
- Cache intermediate results (PNG sequences, model outputs)

### With RHYTHMIX Studio
- API endpoint: `/api/viggle/generate`
- Input: Image + motion type selection
- Output: Animated MP4 URL

## Workflow Selection Logic

```
Input → Analyze type
  ├─ Background removal needed? → workflow1 (LAMA inpainting)
  ├─ Standard animation? → workflow2 (AnimateDiff)
  ├─ High quality (SDXL)? → workflow3 (SDXL + AnimateDiff)
  └─ Test mode? → workflow2_2 (alternative AnimateDiff)
```

## Command Interface

```bash
# Spawn agent
npx @claude-flow/cli@latest agent spawn -t viggle-motion-agent

# Generate animation via skill
/viggle-animate input.png --workflow animatediff --motion-scale 1.2 --steps 30

# Batch animation
/viggle-batch files.json --parallel 4

# Optimize parameters for motion type
/viggle-optimize "character-walk" --samples 5
```

## Environment Requirements

- **GPU**: NVIDIA (CUDA 11.8+) or AMD (ROCm)
- **VRAM**: 8GB minimum (12GB+ recommended for SDXL)
- **Storage**: 50GB+ for models + outputs
- **ComfyUI**: Running on localhost:8188 or configured endpoint

## Status

- ✅ Workflow definitions loaded (4/4)
- ⏳ ComfyUI service integration pending
- ⏳ API endpoint implementation pending
- ⏳ HyperFrames composition bridge pending
