---
name: higgsfield-video-production
description: Professional video production from images with motion control and effects
---

# Higgsfield Video Production Skill

Create cinematic videos from still images with advanced motion control and post-processing.

## When to use

- Converting product photos to video ads
- Creating marketing content
- Producing character animations
- Building video sequences
- Creating social media content

## Instructions

### Basic Video Creation

```bash
# Generate video from image
higgsfield video --image <url> --prompt "camera pans left" --model dop-turbo
```

### Model Selection

| Model | Speed | Quality | Best For |
|-------|-------|---------|----------|
| DOP Turbo | Very Fast | Good | Quick previews |
| DOP Standard | Normal | Excellent | Professional |
| Kling v2.1 | Fast | High | Fast turnaround |
| Seedance v1 | Normal | Excellent | Premium quality |

### Motion Prompts

**Camera movement:**
- "camera slowly pans left"
- "smooth zoom into subject"
- "rotating 360 around object"
- "fly over landscape"

**Character motion:**
- "walking from left to right"
- "turning head and smiling"
- "raising hand and waving"
- "dancing to music"

**Object movement:**
- "spinning on axis"
- "sliding across floor"
- "growing and shrinking"
- "changing colors gradually"

### Production Workflow

1. **Generate base image** (Higgsfield Soul)
   ```bash
   higgsfield generate "Product photo lighting"
   ```

2. **Create video** (DOP Standard for quality)
   ```bash
   higgsfield video --image <generated-url> --prompt "product rotating" --model dop-standard
   ```

3. **Post-process** (GIMP or professional video editor)
   ```bash
   gimp --batch process-video.scm generated_video.mp4
   ```

4. **Analyze** (Jupyter notebook)
   - Check duration and smoothness
   - Verify motion accuracy
   - Assess quality

5. **Export** for platform
   - TikTok: 1080x1920
   - YouTube: 1920x1080
   - Instagram: 1080x1080

### Advanced Techniques

**Multi-scene sequences:**
1. Generate multiple images with consistent style
2. Create video for each image
3. Compose into longer video in editor

**Character consistency:**
1. Train Soul Character from reference photo
2. Generate variations using character
3. Create videos with character

**Product showcase:**
1. Generate hero shot
2. Create rotating video
3. Add product details via GIMP
4. Compose final promo video

### Quality Control

```bash
# Check video status
higgsfield status <job-id>

# Watch generation live
higgsfield watch <job-id>

# Download when ready
higgsfield download <job-id>
```

### Optimization Tips

- Use DOP Standard for final output
- Keep motion descriptions concise
- Test with 4-6 second videos first
- Use character references for consistency
- Upscale source images before video

### Integration

- **Dashboard**: Track video generation in gallery
- **Claude**: Ask for motion prompt suggestions
- **Jupyter**: Analyze video metrics
- **GIMP**: Add effects or overlays

## Platform Requirements

| Platform | Format | Duration | Size |
|----------|--------|----------|------|
| TikTok | 1080x1920 | Up to 10m | <100MB |
| Instagram | 1080x1080 | Up to 60m | <4GB |
| YouTube | 1920x1080 | Any | <4GB |
| LinkedIn | 1920x1080 | Up to 10m | <200MB |

## Common Issues & Solutions

**Motion not visible:**
- Use clearer motion verbs
- Increase generation time
- Try different model

**Poor quality:**
- Upscale source image
- Use DOP Standard
- Check source image quality

**Slow generation:**
- Use DOP Turbo
- Shorter duration
- Simpler motion
