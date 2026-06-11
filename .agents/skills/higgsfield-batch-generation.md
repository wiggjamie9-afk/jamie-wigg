---
name: higgsfield-batch-generation
description: Batch image generation with parameter optimization and quality control
---

# Higgsfield Batch Generation Skill

Efficiently generate multiple images with consistent parameters and quality assurance.

## When to use

- Creating sets of related images
- A/B testing prompts and models
- Scaling production generation
- Testing new models or parameters

## Instructions

### Setup Batch File
Create `prompts.txt`:
```
A serene mountain landscape at sunset
Ocean waves crashing on rocky shore
Forest path in autumn colors
Desert dunes under starlight
Urban skyline at night
```

### Run Batch Generation
```bash
higgsfield batch prompts.txt
```

### Advanced: Parameter Control
```bash
# Generate with specific model
higgsfield batch prompts.txt --model soul --quality 1080p

# Batch with upscaling
higgsfield batch prompts.txt --upscale 4k
```

### Quality Control
1. Generate batch
2. Review results: `higgsfield history`
3. Download best: `higgsfield download <ID>`
4. Tag favorites: `higgsfield favorite <ID>`
5. Analyze metrics

### Optimization Tips

**For consistency:**
- Include style descriptors in prompt
- Use same model for series
- Maintain similar prompt length

**For quality:**
- Use higher quality settings (1080p+)
- Upscale successful results
- Test with smaller batches first

**For efficiency:**
- Group similar prompts
- Reuse working prompts
- Cache successful parameters

### Monitoring

```bash
# Check batch status
higgsfield history

# Count successes
higgsfield history | wc -l

# Get stats
higgsfield credits  # Monitor usage
```

### Export Results

```bash
# Download all from batch
for ID in $(seq 1 100); do
  higgsfield download $ID
done
```

## Integration

- **Dashboard**: View batch gallery in real-time
- **Jupyter**: Analyze batch metrics with pandas
- **GIMP**: Post-process batch in parallel
- **Claude**: Ask for generation analysis

## Best Practices

1. Start small (5-10 images)
2. Monitor quality after each batch
3. Keep successful prompts in version control
4. Document parameter combinations
5. Analyze failure patterns
6. Optimize based on metrics
