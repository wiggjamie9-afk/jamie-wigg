# Reference Tools & Documentation

Master index of all reference tools and documentation stored in this project. Use this to quickly navigate to what you need.

## 📚 Contents

### 1. [Super Dev - AI Coding Coach System](./super-dev/README.md)
**What it is:** Workflow orchestration system for AI coding hosts (Claude Code, Cursor, etc.)
- 11-expert agent architecture
- UI design system (119 color schemes, 39 component libraries)
- Quality gates & validation rules
- Supports 26+ coding hosts (CLI, IDE, desktop)
- **Best for:** Structured development workflows, quality control, design consistency

**Quick Start:** `super-dev` command after install via `uv tool install super-dev`

---

### 2. [ReBench - Benchmark Execution Tool](./rebench/README.md)
**What it is:** Reproducible benchmark execution and documentation system
- YAML-based configuration for benchmarks
- Supports interrupting & resuming long experiments
- Performance monitoring integration
- Cross-language compiler benchmarking
- **Best for:** Performance testing, benchmarking language/app implementations, continuous monitoring

**Quick Start:** `pip install rebench` → configure `.conf` file → `rebench test.conf`

---

### 3. [YouTube Thumbnail ML - Visual Design Optimization](./youtube-ml/README.md)
**What it is:** Machine learning models for YouTube thumbnail design optimization
- Analyzes 2,303+ thumbnails across 22 categories
- Extracts color, text, composition features
- KNN-based similarity recommendations
- Mistral-7B chatbot for design feedback
- A/B testing validation (65.5% user preference for optimized designs)
- **Best for:** YouTube shorts thumbnail design, CTR optimization, design validation

**Key Insights:**
- Color brightness & hue entropy matter
- Text readability (contrast, font size) critical
- Edge contrast & saliency drive engagement
- 65.5% of users preferred ML-optimized thumbnails in A/B tests

---

### 4. [Git Branching Strategies - Multi-Environment DevOps](./git-branching/README.md)
**What it is:** Visual guides for Git branching in multi-account AWS DevOps
- Three standard models: Trunk, GitHub Flow, Gitflow
- Handles: sandbox → dev → test → staging → production
- Automation across multiple AWS environments
- **Best for:** DevOps teams, multi-environment deployments, CI/CD pipeline design

**Models Included:**
- **Trunk:** Simple, continuous deployment
- **GitHub Flow:** Feature branches with PR reviews
- **Gitflow:** Release management with hotfix branches

---

## 🔗 How to Use This Knowledge Base

1. **Quick Reference:** Each tool folder has a `README.md` with key info
2. **Deep Dive:** Full documentation available in each subfolder
3. **Integration Ideas:** See `INTEGRATION_IDEAS.md` (coming soon)
4. **Your YouTube Shorts Pipeline:** Reference `youtube-ml/` when optimizing thumbnails

---

## 💡 Recommended Reading Order

**For YouTube Shorts (your current project):**
1. Start: `youtube-ml/README.md` — understand thumbnail optimization
2. Reference: `super-dev/README.md` — optional, for workflow organization
3. Advanced: `rebench/README.md` — if you want to benchmark thumbnail performance

**For DevOps/Infrastructure:**
1. Start: `git-branching/README.md` — understand branching for multi-env
2. Deploy: `super-dev/` — workflow orchestration for your CI/CD

---

## 📝 Last Updated
Created: 2026-06-09
All documentation captured and organized for reference.

---

**Need to add more tools?** Just paste the documentation and I'll organize it here.
