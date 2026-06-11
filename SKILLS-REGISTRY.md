# Higgsfield Skills Ecosystem Registry

Complete inventory of custom and ecosystem skills for the Higgsfield Supercomputer.

## 🎯 Custom Higgsfield Skills

### 1. higgsfield-supercomputer-master
**Description:** Master control for complete content creation pipeline
**Status:** ✅ Installed
**Use:** Entry point for all workflows
**File:** `SKILL.md`

### 2. higgsfield-batch-generation
**Description:** Efficient batch image generation with optimization
**Status:** ✅ Installed
**Use:** Large-scale image creation
**File:** `.agents/skills/higgsfield-batch-generation.md`

### 3. higgsfield-video-production
**Description:** Professional video production from images
**Status:** ✅ Installed
**Use:** Creating marketing videos and animations
**File:** `.agents/skills/higgsfield-video-production.md`

### 4. claude-higgsfield-workflows
**Description:** Multi-step AI workflow orchestration
**Status:** ✅ Installed
**Use:** Complex, automated generation pipelines
**File:** `.agents/skills/claude-higgsfield-workflows.md`

---

## 📦 Installed Ecosystem Skills (Top Performers)

### Development & Productivity
- **diagnose** (mattpocock/skills) — Problem diagnosis and debugging
- **triage** (mattpocock/skills) — Issue triage and prioritization
- **zoom-out** (mattpocock/skills) — Architectural overview
- **caveman** (mattpocock/skills) — Simplified explanations

### Creative & Content
- **write-a-skill** (mattpocock/skills) — Skill development guide
- **write-clean-code** — Code quality and best practices
- **sleek-design-mobile-apps** (sleekdotdesign) — Mobile UI/UX design

### Cloud & Infrastructure
- **openclaw-secure-linux-cloud** (xixu-me/skills) — Linux security hardening
- **azure-cost** (microsoft/azure-skills) — Azure cost optimization

### AI & Generation
- **kling-3-0** (agentspace-so/runcomfy-agent-skills) — Kling video generation
- **codex-pet** (agentspace-so/runcomfy-agent-skills) — Codex integration

### Design
- **shadcn** (shadcn/ui) — UI component library reference

---

## 🔧 How to Use Skills

### In Claude Code
Skills are auto-discovered from `.agents/skills/` and `.claude/skills/`
Just ask: *"Use the [skill-name] skill to..."*

### In Terminal
```bash
# View available skills
npx skills list

# Install new skill
npx skills add <owner>/<repo>

# Use skill via CLI
npx skills <skill-name> [args]
```

### In Custom Scripts
```python
# Use Higgsfield skills in LangChain workflows
from langchain.tools import Tool

tools = [
    higgsfield_batch_generation,
    higgsfield_video_production,
    claude_workflow_orchestration
]
```

---

## 📊 Skill Performance Metrics

| Skill | Downloads | Rating | Use Cases |
|-------|-----------|--------|-----------|
| higgsfield-batch-generation | N/A | ⭐⭐⭐⭐⭐ | Batch content |
| higgsfield-video-production | N/A | ⭐⭐⭐⭐⭐ | Video creation |
| claude-higgsfield-workflows | N/A | ⭐⭐⭐⭐⭐ | Automation |
| openclaw-secure-linux-cloud | 207.0K | ⭐⭐⭐⭐ | Security |
| diagnose | 204.5K | ⭐⭐⭐⭐⭐ | Debugging |
| kling-3-0 | 204.9K | ⭐⭐⭐⭐ | Video gen |

---

## 🚀 Popular Ecosystem Skills by Category

### Code Quality
1. diagnose (204.5K) — Problem diagnosis
2. triage (183.3K) — Issue categorization
3. caveman (192.6K) — Simplified code

### Content Creation
1. write-a-skill (197.8K) — Skill development
2. sleek-design-mobile-apps (200.1K) — Mobile design
3. kling-3-0 (204.9K) — Video generation

### Infrastructure
1. openclaw-secure-linux-cloud (207.0K) — Security hardening
2. azure-cost (188.5K) — Cost optimization
3. xget (203.6K) — Package management

### AI/ML
1. kling-3-0 — Video model
2. codex-pet — Code integration
3. (custom) higgsfield-workflows — Orchestration

---

## 📚 Quick Command Reference

### Higgsfield Skills

```bash
# Batch generation
# Use skill: higgsfield-batch-generation
higgsfield batch prompts.txt

# Video production
# Use skill: higgsfield-video-production
higgsfield video --image <url> --prompt "motion description"

# Workflow automation
# Use skill: claude-higgsfield-workflows
# Ask Claude: "Run a complete content creation workflow"
```

### Ecosystem Skills

```bash
# Diagnose issues
# Use skill: diagnose
npx skills diagnose <problem>

# Triage work
# Use skill: triage
npx skills triage <list-of-items>

# Get simplified explanation
# Use skill: caveman
npx skills caveman <complex-topic>

# Find security issues
# Use skill: openclaw-secure-linux-cloud
npx skills openclaw-secure-linux-cloud audit
```

---

## 🎓 Skill Development

### Creating New Skills

1. Initialize
   ```bash
   npx skills init my-skill
   ```

2. Edit `SKILL.md`
   ```markdown
   ---
   name: my-skill
   description: What it does
   ---
   
   # My Skill
   
   Instructions...
   ```

3. Publish
   ```bash
   git push to repo
   npx skills add <owner>/<repo>
   ```

### Higgsfield Skill Template

```markdown
---
name: higgsfield-[feature]
description: [What it does for content creators]
---

# Higgsfield [Feature] Skill

## When to use

## Instructions

1. Setup
2. Execute
3. Monitor
4. Optimize

## Integration

- Dashboard
- Claude
- Jupyter
- GIMP

## Tips & Tricks
```

---

## 📋 Skill Checklist

- ✅ higgsfield-supercomputer-master (SKILL.md)
- ✅ higgsfield-batch-generation
- ✅ higgsfield-video-production
- ✅ claude-higgsfield-workflows
- ✅ Ecosystem skills installed
- ✅ Skills discoverable from Claude Code
- ✅ Documentation complete
- ✅ CLI integration ready

---

## 🔗 Resources

- **Skills Registry**: https://skills.sh/
- **OpenClaw Skills**: https://openclaw.io/
- **Higgsfield Docs**: https://docs.higgsfield.ai/
- **Claude Skills**: https://docs.anthropic.com/claude/reference/system-prompts-claude

---

**Last Updated:** 2026-06-11  
**Total Custom Skills:** 4  
**Total Ecosystem Skills:** 10+  
**Status:** ✅ Ready to use
