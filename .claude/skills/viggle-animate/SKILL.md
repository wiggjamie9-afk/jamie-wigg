# /viggle-animate Skill

Generate motion animations from static images using ComfyUI Viggle workflows.

## Usage

```bash
/viggle-animate <image> [options]
```

## Examples

### Basic motion synthesis
```bash
/viggle-animate input.png --workflow animatediff
```

### High-quality SDXL animation
```bash
/viggle-animate input.png --workflow sdxl --prompt "elegant character motion"
```

### Remove character and animate background
```bash
/viggle-animate scene.png --workflow lama-inpaint --motion-scale 1.5
```

### Batch animation with different parameters
```bash
/viggle-animate input.png \
  --workflow animatediff \
  --motion-scale 0.8 1.0 1.2 \
  --steps 20 25 30 \
  --parallel 3
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `--workflow` | enum | animatediff | Workflow: `lama-inpaint`, `animatediff`, `animatediff-alt`, `sdxl` |
| `--motion-scale` | float | 1.0 | Motion intensity (0.5-2.0) |
| `--steps` | int | 25 | Diffusion steps (16-50) |
| `--cfg-scale` | float | 7.5 | Guidance scale (1.0-20.0) |
| `--duration` | string | 5s | Video duration (e.g., `3s`, `10s`) |
| `--fps` | int | 30 | Frames per second (24-60) |
| `--prompt` | string | "" | Motion prompt (SDXL only) |
| `--seed` | int | -1 | Random seed (-1 for random) |
| `--parallel` | int | 1 | Parallel batch jobs (1-8) |
| `--output` | string | auto | Output path (auto-generated if not specified) |

## Workflows

### lama-inpaint
- **Purpose**: Remove characters, inpaint backgrounds
- **Input**: PNG/JPG with character to remove
- **Output**: Inpainted PNG + animated background
- **GPU VRAM**: 4GB

### animatediff
- **Purpose**: Standard motion synthesis
- **Input**: PNG/JPG static image
- **Output**: MP4 with motion (1080p, 5s default)
- **GPU VRAM**: 8GB

### animatediff-alt
- **Purpose**: Alternative motion parameters
- **Input**: PNG/JPG static image
- **Output**: MP4 with varied motion characteristics
- **GPU VRAM**: 8GB

### sdxl
- **Purpose**: SDXL image generation + motion
- **Input**: Text prompt or reference image
- **Output**: Generated image + animated MP4
- **GPU VRAM**: 12GB+ (12GB minimum)

## Output

Successfully generated animations are saved to:
```
comfyui_viggle/outputs/
├── TIMESTAMP_viggle_input.png     # Input image
├── TIMESTAMP_viggle_output.mp4    # Generated video
└── TIMESTAMP_viggle_metadata.json # Generation parameters
```

URL ready for HyperFrames composition:
```
./comfyui_viggle/outputs/TIMESTAMP_viggle_output.mp4
```

## Integration with HyperFrames

```bash
# Generate animation, then composite into RHYTHMIX promo
/viggle-animate input.png --workflow animatediff \
  | /rhythmix-compose \
    --motion-video \
    --template rhythmix-teaser-60s \
    --audio narration.wav \
    --output rhythmix-promo.mp4
```

## Error Handling

| Error | Cause | Solution |
|-------|-------|----------|
| `ComfyUI not responding` | Service down | Start with `docker run -d -p 8188:8188 comfyui:latest` |
| `CUDA out of memory` | Batch too large | Reduce `--steps` or `--motion-scale` |
| `Model not found` | Missing checkpoint | Download to `comfyui_viggle/models/` |
| `Invalid prompt` | Syntax error | Quote special characters |

## Performance

| Workflow | Resolution | Time | VRAM |
|----------|------------|------|------|
| lama-inpaint | 512×512 | 30s | 4GB |
| animatediff | 512×512 | 45s | 8GB |
| animatediff | 1024×1024 | 120s | 10GB |
| sdxl | 1024×1024 | 180s | 12GB |

## Advanced Usage

### Memory optimization
```bash
# Use half-precision floating point
/viggle-animate input.png --workflow animatediff --precision fp16
```

### Queue multiple jobs
```bash
/viggle-batch \
  --inputs "input1.png input2.png input3.png" \
  --workflow animatediff \
  --parallel 3
```

### Monitor progress
```bash
npx @claude-flow/cli@latest task list --filter viggle
npx @claude-flow/cli@latest task status JOB_ID
```

## Integration with Ruflo V3

Automatically invoked by:
- `viggle-motion-agent` — Motion generation specialist
- `/rhythmix-viggle-promo` — Full RHYTHMIX promo with Viggle
- `memory-specialist` — Parameter optimization from past runs

## See Also

- `/rhythmix-author` — Full RHYTHMIX promo pipeline
- `/dream video` — One-shot video generation
- `hyperframes-cli` — Video composition framework
- `viggle-optimize` — Find best motion parameters
