# Toolkit Inventory

This document tracks all third-party tools and libraries installed for the RHYTHMIX creative pipeline.

## Installed Tools

### 1. Graphite Editor (Vector/Raster Graphics)

**Type:** Open Source Vector/Raster Graphics Engine  
**Language:** Rust  
**Stars:** 26.2k  
**Location:** `/home/user/jamie-wigg/graphite-editor/`  
**Repository:** https://github.com/GraphiteEditor/Graphite  
**Installation Date:** 2026-06-09  
**Status:** Cloned, ready for reference/dev

**Usage:**
- Vector and raster graphics authoring engine
- Can be used standalone or integrated for motion graphics pipelines
- Reference for design system workflows

**Next Steps:**
- Build from source (Rust, see repo README) or use prebuilt binary
- Optionally symlink into project PATH or create alias

---

### 2. Cinema 3ds Manager

**Type:** Windows 3D Project Manager  
**Language:** C#/C++  
**Stars:** 76  
**Status:** SKIPPED (Windows-only)  
**Note:** This tool requires Windows. Not installed on this Linux environment.

---

### 3. Motionity (Web Motion Graphics Editor)

**Type:** Open Source Web-based Motion Graphics Editor  
**Location:** `/home/user/jamie-wigg/motionity/`  
**Repository:** https://github.com/alyssaxuu/motionity  
**Installation Date:** 2026-06-09  
**Status:** Cloned, deps not yet installed

**Usage:**
- Web-based motion graphics and animation editing
- Browser-driven interface
- Can be used as reference or development tool for RHYTHMIX promo workflows

**Next Steps:**
- Install dependencies: `cd motionity && npm install`
- Start dev server: `npm run dev` (check repo for actual command)
- Or deploy as standalone web app

---

### 4. animate.css (CSS Animation Library)

**Type:** CSS Animation Library  
**License:** Hippocratic License  
**Stars:** 82.6k  
**Version:** 4.1.1  
**Location:** `/home/user/jamie-wigg/node_modules/animate.css/`  
**Repository:** https://github.com/animate-css/animate.css  
**Installation Date:** 2026-06-09  
**Status:** Installed via npm

**Usage:**
- Pre-built CSS animation classes for immediate use
- Import: `import 'animate.css'` in JavaScript or `<link>` in HTML
- Used in RHYTHMIX promo compositions, STARLIGHTMIX Studio UI
- Classes: `animate__animated`, `animate__bounce`, `animate__fadeIn`, etc.

**Integration:**
- Already available in root `node_modules/`
- Used by HyperFrames compositions and web app components

---

### 5. LeetCode Animation (Algorithm Visualization)

**Type:** Educational Algorithm Visualization Reference  
**Language:** Java  
**Stars:** 76.6k  
**Location:** `/home/user/jamie-wigg/leetcode-animation/`  
**Repository:** https://github.com/MisterBooo/LeetCodeAnimation  
**Installation Date:** 2026-06-09  
**Status:** Cloned, educational reference only

**Usage:**
- Algorithm visualization examples (sorting, searching, graph algorithms)
- Reference material for educational content or algorithm blog posts
- Not a library to import; reference for animation patterns

**Next Steps:**
- Browse algorithms/ directory for inspiration
- Reference video tutorials and visualizations for custom animations
- Not part of production build pipeline

---

### 6. Higgsfield AI Prompt Skill (Cinematic Video Prompt Generator)

**Type:** Claude Code Skill for Higgsfield AI Integration  
**Language:** JavaScript/Node  
**License:** MIT  
**Stars:** 114  
**Location:** `~/.claude/skills/higgsfield-ai-prompt/`  
**Repository:** https://github.com/OSideMedia/higgsfield-ai-prompt-skill  
**Installation Date:** 2026-06-09  
**Status:** Installed, registered as Claude Code skill

**Usage:**
- Integrated Claude Code skill for Higgsfield AI
- Accessed via `/higgsfield-ai-prompt` command in Claude Code
- Generates optimized video/image prompts for Higgsfield AI models
- Supports model selection: Kling, Sora 2, Veo, Wan, DoP, Soul, Flux, etc.
- Character consistency via Soul IDs

**Integration:**
- Auto-loaded by Claude Code harness
- No additional setup required beyond installation
- Works with existing Higgsfield MCP server (`.mcp.json`)

---

## Environment Changes

### Updated Files

1. **`.gitignore`** — Added exclusions:
   ```
   # Graphics & animation tool installations (large repos)
   graphite-editor/
   motionity/
   leetcode-animation/
   ```

### npm Dependencies

- `animate.css@4.1.1` added to root `package.json`

---

## Next Steps / Recommendations

1. **Graphite Editor** — Build from source or download prebuilt:
   - See `graphite-editor/README.md` for build instructions
   - Consider creating an alias or PATH entry once built

2. **Motionity** — Set up dev environment:
   ```bash
   cd motionity
   npm install
   npm run dev
   ```

3. **LeetCode Animation** — Use as reference library:
   - Explore algorithm visualizations in `algorithms/` 
   - Extract animation patterns for custom content

4. **Higgsfield Skill** — Test integration:
   - Run `/higgsfield-ai-prompt "your video concept"` in Claude Code
   - Verify it routes to correct Higgsfield model

5. **animate.css** — Already integrated:
   - Import in any React/Vue/Angular component or HTML file
   - See `node_modules/animate.css/README.md` for full class list

---

## Tool Compatibility Matrix

| Tool | OS | Env | Purpose | Priority |
|---|---|---|---|---|
| Graphite | Linux/Mac/Win | CLI/UI | Graphics authoring | Med |
| Motionity | Any (web) | Browser | Motion editing | Med |
| animate.css | Any (web) | JS/CSS | Animations | High |
| LeetCode Animation | Java-capable | Reference | Algorithm viz | Low |
| Higgsfield Prompt | Any | Claude Code | Video prompts | High |

---

**Last Updated:** 2026-06-09  
**Status:** All feasible tools installed; Cinema 3ds Manager skipped (Windows-only)
