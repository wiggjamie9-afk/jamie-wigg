---
name: higgsfield-supercomputer-master
description: Master control for Higgsfield AI image/video generation, GIMP editing, and Claude workflow orchestration
---

# Higgsfield Supercomputer Master Skill

Complete command center for AI-powered content creation combining Higgsfield generation, GIMP editing, Claude analysis, and automated workflows.

## When to use

- Creating AI-generated images and videos at scale
- Batch processing with GIMP
- Building complex multi-step generation workflows
- Analyzing generation metrics and optimizing results
- Orchestrating end-to-end content pipelines

## Instructions

### 1. Image Generation
```bash
# Quick image via CLI
higgsfield generate "Your prompt"

# Batch generation from file
higgsfield batch prompts.txt

# Via dashboard
open dashboard.html
```

### 2. Video Creation
- Use Higgsfield MCP: Ask Claude to create videos
- Models: DOP Turbo (fast), DOP Standard (quality), Kling, Seedance
- Format: Image URL + motion prompt

### 3. GIMP Batch Processing
```bash
# Automate image editing
gimp --batch-procedure=pdb-file-load --batch
```

### 4. Data Analysis
- Use Jupyter notebooks for metrics
- Pandas for generation logs
- Matplotlib for visualization

### 5. Workflow Orchestration
- Use LangChain agents for multi-step processes
- LanGraph for state management
- MCP Inspector for debugging

### 6. Dashboard Control
- Open `dashboard.html` for UI
- 5 generation tools built-in
- Real-time gallery and stats

## Advanced Usage

### Multi-Step Generation Pipeline
1. Generate base images with Higgsfield
2. Enhance in GIMP
3. Convert to video with Higgsfield
4. Analyze results with Jupyter
5. Iterate based on metrics

### Batch Processing
1. Create prompt file
2. Generate batch via CLI
3. Process all images in GIMP
4. Analyze output dataset
5. Export to formats

### Claude Integration
- Ask Claude: "Generate 10 variations of..."
- Use MCP tools for automation
- Build agents for complex workflows

## Key Commands

| Task | Command |
|------|---------|
| Generate image | `higgsfield generate "prompt"` |
| Check balance | `higgsfield credits` |
| View history | `higgsfield history` |
| List models | `higgsfield models` |
| Open dashboard | `open dashboard.html` |
| Start Jupyter | `jupyter lab` |
| Inspect MCP | `npx @modelcontextprotocol/inspector` |

## Tips

- Use dashboard for exploration, CLI for automation
- Batch process similar prompts together
- Cache successful prompts and parameters
- Monitor credits and generation times
- Version control your generation configs

## Resources

- Dashboard: `dashboard.html`
- Docs: `HIGGSFIELD-SETUP.md`
- Quick ref: `HIGGSFIELD-QUICKREF.md`
- Enhancements: `CLAUDE-ENHANCEMENTS.md`
