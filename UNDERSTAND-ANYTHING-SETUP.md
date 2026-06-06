# Understand-Anything Plugin Setup

## Status: ✅ Installed

The **Understand-Anything** plugin has been successfully installed at `~/.understand-anything/repo/`.

### What's Installed

- Full plugin source with all skills and tools
- Node dependencies (all `tree-sitter` parsers, `graphology`, etc.)
- Skills symlinked to `~/.copilot/skills/`:
  - `/understand` — main analysis command
  - `/understand-dashboard` — interactive visualization
  - `/understand-chat` — Q&A about codebase
  - `/understand-diff` — analyze impact of changes
  - `/understand-domain` — extract business flows
  - `/understand-explain` — deep-dive into files
  - `/understand-onboard` — generate onboarding guide
  - `/understand-knowledge` — analyze wiki/knowledge bases

---

## How to Use

### In Claude Code

Run the analysis from the repo root:

```
/understand
```

This will:
1. Scan all 1,731 files in `jamie-wigg/`
2. Extract structure (functions, classes, imports, exports)
3. Perform architecture analysis (identify layers)
4. Build a knowledge graph at `.understand-anything/knowledge-graph.json`
5. Generate an interactive dashboard

### View the Dashboard

```
/understand-dashboard
```

Opens an interactive web UI showing:
- Codebase structure as a directed graph
- Color-coded by architectural layer
- Click any node to see code, relationships, and plain-English explanation
- Search across all nodes

### Ask About Your Codebase

```
/understand-chat How does the payment flow work?
```

### Analyze Current Changes

```
/understand-diff
```

Shows the impact of uncommitted changes on the knowledge graph.

### Generate Onboarding Guide

```
/understand-onboard
```

Produces a markdown guide for new team members.

### Zoom into a File

```
/understand-explain src/studio/app.tsx
```

---

## Output

The knowledge graph and config live in `.understand-anything/`:

```
.understand-anything/
├── knowledge-graph.json       # The graph itself (commit to repo)
├── config.json                # Language preference & settings
├── intermediate/              # Temporary; not committed
└── diff-overlay.json          # Temporary; change tracking
```

**Commit `knowledge-graph.json` to share with your team** — teammates skip the pipeline and use the graph directly.

---

## Options

```bash
# Force a full rebuild (ignore cache)
/understand --full

# Generate content in another language (zh, ja, ko, es, fr, etc.)
/understand --language zh

# Enable automatic graph updates on every commit
/understand --auto-update

# Run a full LLM-based graph review (slower, more thorough)
/understand --review

# Analyze a subdirectory (for large monorepos)
/understand src/frontend
```

---

## Technical Details

- **Engine:** Tree-sitter + LLM hybrid  
  - Static analysis (deterministic, reproducible)  
  - LLM (semantic summaries, business domain, architecture tags)
  
- **Platforms Supported:**  
  - Claude Code (native)  
  - VS Code + GitHub Copilot  
  - Cursor  
  - Copilot CLI  
  - Codex, OpenCode, Gemini CLI, Hermes, etc.

- **Large Codebases:**  
  - Supports monorepos via `--scope` or subdirectory args  
  - Incremental updates (only re-analyzes changed files)  
  - Can track graphs with `git-lfs` for 10MB+ outputs

---

## Next Steps

1. **Run the first analysis:**
   ```
   /understand
   ```
   This will take 2–10 minutes depending on codebase size (1,731 files here).

2. **Explore the dashboard:**
   ```
   /understand-dashboard
   ```

3. **Commit the graph to version control:**
   ```
   git add .understand-anything/knowledge-graph.json .understand-anything/config.json
   git commit -m "chore: add understand-anything knowledge graph"
   ```

4. **Use the graph for onboarding, code review, and bug triage.**

---

## Resources

- **GitHub:** https://github.com/Lum1104/Understand-Anything  
- **Docs:** See `SKILL.md` files in `~/.understand-anything-plugin/skills/*/`  
- **Troubleshooting:** Check `.understand-anything/intermediate/` for logs if analysis fails
