---
name: claude-higgsfield-workflows
description: Multi-step AI workflows orchestrating Higgsfield generation, GIMP editing, and Claude analysis
---

# Claude + Higgsfield Workflow Automation Skill

Build complex, automated content creation pipelines combining Claude reasoning with Higgsfield generation.

## When to use

- Complex multi-step generation tasks
- Content that requires analysis and iteration
- Automated quality assurance pipelines
- Data-driven generation workflows
- Custom business logic generation

## Instructions

### Workflow: Generate → Analyze → Refine

```
1. Claude generates creative brief
2. Higgsfield creates images based on brief
3. Claude analyzes results
4. User refines or repeats
```

### Example: Product Photo Series

**Step 1: Generate Brief**
```
Ask Claude: "Create 5 product photo concepts for leather shoes"
Claude outputs: Concept descriptions
```

**Step 2: Generate Images**
```
For each concept:
  higgsfield generate "[concept description]"
```

**Step 3: Analyze**
```
Ask Claude: "Rank these shoes photos by quality"
Claude outputs: Ranking and feedback
```

**Step 4: Refine**
```
Ask Claude: "Suggest improvements for the lowest-ranked photo"
Regenerate with suggested improvements
```

### Workflow: Scale Content Generation

```bash
# Automated batch workflow
1. Create prompt templates
2. Claude generates variations
3. Higgsfield generates all variations
4. GIMP post-processes in parallel
5. Jupyter analyzes quality
6. Auto-upload to dashboard
```

### Workflow: Character-Based Content

```
1. User provides character reference photo
2. Claude writes character traits
3. Higgsfield trains Soul Character
4. Generate character variations
5. Claude writes captions/descriptions
6. Compose into video
7. Export as content
```

### Workflow: A/B Testing

```
1. Define hypothesis (e.g., "Serif fonts perform better")
2. Claude generates A/B variant prompts
3. Higgsfield generates both variants
4. Store with metadata
5. Track performance
6. Claude analyzes winner
7. Apply learnings to next batch
```

### Implementation with LangChain

```python
from langchain_anthropic import ChatAnthropic
from langchain.agents import AgentExecutor, create_tool_calling_agent

llm = ChatAnthropic(model="claude-opus-4-1-20250805")

tools = [
    higgsfield_generate,
    higgsfield_video,
    gimp_batch_process,
    jupyter_analyze,
    dashboard_upload
]

prompt = hub.pull("hwchase17/openai-tools-agent")
agent = create_tool_calling_agent(llm, tools, prompt)
executor = AgentExecutor(agent=agent, tools=tools)

# Execute workflow
result = executor.invoke({
    "input": "Create 10 product photos with analysis"
})
```

### Pre-built Workflows

**Workflow 1: Content Factory**
- Input: Product description
- Process: Generate → Analyze → Optimize
- Output: Gallery of best images

**Workflow 2: Video Sequence**
- Input: Story brief
- Process: Scene generation → Video creation → Composition
- Output: Finished video

**Workflow 3: Character Series**
- Input: Character description
- Process: Train character → Generate variations → Export
- Output: Character asset pack

**Workflow 4: Social Media Blitz**
- Input: Campaign theme
- Process: Generate images for 5 platforms → Optimize → Schedule
- Output: Content ready to post

## Claude Prompts for Workflows

### Generate Creative Concepts
```
"Generate 10 unique product photography concepts for [product]. 
Each should include: style, lighting, composition, mood.
Format as JSON for downstream processing."
```

### Analyze Generation Quality
```
"Analyze these 5 generated images for:
- Lighting quality (1-10)
- Composition (1-10)
- Brand alignment (1-10)
- Technical quality (1-10)
Provide specific feedback for improvement."
```

### Optimize Prompts
```
"These images scored lower than expected. Suggest 3 improved prompts
that address these issues: [issues]. Make prompts specific and detailed."
```

### Metadata Generation
```
"For each image, generate:
- Alt text
- Description
- SEO keywords
- Social media captions
Format as JSON."
```

## Monitoring & Analytics

**Track workflow metrics:**
- Generation time per image
- Success rate
- Quality scores
- Cost per result
- Time from brief to final

```python
# Jupyter analysis
import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv('workflow_metrics.csv')
df.groupby('workflow_type').agg({
    'generation_time': 'mean',
    'quality_score': 'mean',
    'success_rate': 'mean'
})
```

## Best Practices

1. **Break workflows into steps** — Each step has clear input/output
2. **Add validation gates** — Check quality before proceeding
3. **Use templates** — Consistent prompts produce consistent results
4. **Monitor costs** — Track generation credits per workflow
5. **Version control** — Save successful workflows
6. **Iterate quickly** — Test on small batches first
7. **Document learnings** — Note what works and what doesn't

## Troubleshooting

**Workflow stalls:**
- Check Claude response format
- Verify tool parameters
- Check API credentials

**Quality issues:**
- Refine prompts with Claude
- Try different models
- Add validation step

**Performance:**
- Parallelize independent steps
- Use LanGraph for optimization
- Cache intermediate results
