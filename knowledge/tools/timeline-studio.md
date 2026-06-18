# Timeline Studio — AI Video Editor (closes YouTube Gap 1)

Next-generation professional video editor with deep AI integration, built on **Tauri v2 + Next.js 15 + Rust**. Automates multi-platform content creation: one source → dozens of platform-ready versions. **Open source**, local processing, with **headless/CLI entrypoints** that make it scriptable by NEXUS — not just a GUI.

GitHub: `chatman-media/timeline-studio` · Alpha 97.5% · Open source (commercial license for business) · Primary AI: **Claude (Anthropic)**

## Why It's Relevant Here — Closes Gap 1

The NEXUS YouTube Ecosystem flagged **Gap 1: no timeline/NLE editor** — generation was covered, but timeline cutting/assembly/multicam wasn't. Timeline Studio closes it, and uniquely well for this ecosystem:

1. **Headless + CLI automation** — `timeline` (Rust CLI), `render-job`, `bot-workflow`, `bot-worker` entrypoints mean NEXUS can drive edits/renders **programmatically**, not just by hand. This is the missing automated-assembly layer.
2. **Same stack as Studio** — Next.js 15, React 19, Tailwind v4, shadcn/ui, TypeScript, XState v5. Familiar to maintain/extend; fits the repo's conventions.
3. **Claude is its primary AI** — natural fit; the 100+ AI tools reason with Claude.
4. **One upload → dozens of versions** — directly maps to the repurposing stage (TikTok/YouTube/Vimeo/Telegram direct upload), overlapping/upgrading the repurposing agents.

## What It Does

> "Create a video about my trip to Asia for all social media" → in minutes:
> dynamic TikTok shorts, atmospheric YouTube vlog, bright Instagram Stories.
> AI picks the best moments, syncs to music, adapts per platform.

| Capability | Detail |
|---|---|
| **100+ AI tools** | Full production automation, multi-provider |
| **GPU acceleration** | NVENC, QuickSync, VideoToolbox (hardware encode) |
| **Multi-platform export** | TikTok / YouTube / Vimeo / Telegram (direct upload), Instagram (manual) |
| **Plugin system** | Extend without changing core |
| **15-language UI** | Full localization incl. RTL |
| **Local processing** | Content stays private |
| **80%+ test coverage** | Production-level reliability |

## AI Tool Categories (100+)

| Category | Count | Examples |
|---|---|---|
| **Timeline Tools** | 50 | Intelligent project creation + editing |
| **Media Analysis** | 27 | Scene detection, quality analysis, content intelligence |
| **Audio Processing** | 12 | Transcription, noise removal, music sync |
| **Export Optimization** | 12 | Platform-specific adaptations |
| **Effects & Filters** | 10 | AI-powered visual enhancements |
| **+40 more** | — | Specialized tools |

**AI providers**: Claude (primary, advanced reasoning), OpenAI (GPT-4), DeepSeek (reasoning), Ollama (local/offline).

## Architecture

**Frontend** (Next.js 15 + React 19): feature-based `/src/features/`, XState v5 state, shadcn/ui + Radix + Tailwind v4, strict TypeScript.

**Backend / headless runtime**:
- **Rust workspace** (`crates/*`) — schema, render, media analysis, montage, publish + the `timeline` CLI
- **TypeScript workspaces** — `packages/core`, `domains`, `adapters`, `ui`
- **Desktop host** — Tauri v2 shell over the shared runtime
- **Headless entrypoints** — `render-job`, `bot-workflow`, `bot-worker`, Rust `timeline`

> External consumers use the **documented headless entrypoints** (not desktop
> internals). `ProjectSchema` is the supported contract. This is what NEXUS targets
> for automated editing/rendering.

## Setup (on the Mac — desktop/host)

```bash
git clone https://github.com/chatman-media/timeline-studio.git
cd timeline-studio
bun install
bun run tauri dev        # development mode
```

**Requirements**: Node.js v24+, Rust, Bun, FFmpeg.

FFmpeg:
```bash
# macOS
brew install ffmpeg
export ORT_DYLIB_PATH=/opt/homebrew/lib/libonnxruntime.dylib
# Linux
sudo apt-get install ffmpeg libavcodec-dev libavformat-dev
```

Dev/quality:
```bash
bun run test && bun run test:rust
bun run check:all        # ESLint, Stylelint, Clippy
```

## How NEXUS Uses It (automated assembly layer)

```
Within the YouTube pipeline, at the ASSEMBLE/EXPORT stages:
  → generated assets (clips, narration, music, graphics) ready
  → build a Timeline Studio ProjectSchema (Rust `timeline` CLI / render-job)
  → AI tools: scene detection, music sync, best-moment selection
  → render with GPU acceleration
  → export-optimization tools → per-platform versions
  → multi-platform publish (TikTok/YouTube/Vimeo/Telegram direct;
        Instagram manual)
```

The **bot-first / headless contract** (incl. Telegram AI review: upload → preview →
text/voice/video-note revisions → approval → publish) is a ready-made
human-in-the-loop review loop NEXUS can plug into for approve-before-publish.

## Fit & Caveats

- **Desktop/host app** — the Tauri shell runs on your **Mac**, not this GPU-less
  sandbox. NEXUS targets the **headless CLI/entrypoints** for automation; the GUI is
  for hands-on editing.
- **Alpha (97.5%)** — production-capable but pre-1.0; expect rough edges, pin versions.
- **Requires Node 24+, Rust, Bun, FFmpeg** — heavier toolchain than the web apps here.
- **Commercial license for business use** — open source for dev/non-commercial;
  **get the commercial license before monetizing channels with it**.
- **Overlaps repurposing agents** — Timeline Studio's export-optimization replaces/
  upgrades manual repurposing for video; keep agents for copy/SEO/thumbnails.
- **Privacy plus** — local processing means your footage doesn't leave the machine.

## Where It Sits vs Other Video Tools Here

| Need | Tool |
|---|---|
| **Timeline editing + multi-platform export (automated)** | **Timeline Studio** |
| Motion graphics / intros / promos | HyperFrames + GSAP |
| AI-generated footage / B-roll | SkyReels, Higgsfield, HunyuanVideo |
| Math/diagram animation | KimiK2Manim |
| Anime/cartoon | Anime/Manga model map (`anime-manga-datasets.md`) |
| Hosted programmable video projects | HeyGen HyperFrames MCP |

Timeline Studio is the **assembly + export hub**; the others are **asset generators**
that feed into it.

## References

- **GitHub**: `chatman-media/timeline-studio`
- **Docs**: 18+ sections incl. headless contracts, package boundaries, Rust architecture, plugin system, AI tools reference
- **External Headless Contracts**: supported `ProjectSchema`, `timeline`, `render-job`, `bot-workflow`, `bot-worker`, `bot-cleanup`
- **Stack**: Tauri v2, Next.js 15, React 19, Rust, XState v5, shadcn/ui, Tailwind v4, FFmpeg
- **YouTube**: @chatman-media (video tutorials)

---

**Use Case for Ecosystem:** Closes Gap 1 (timeline/NLE editing) of the NEXUS YouTube Ecosystem. Open-source AI video editor (Tauri + Next.js + Rust) with 100+ Claude-powered AI tools, GPU acceleration, and one-source→many-platform export (TikTok/YouTube/Vimeo/Telegram direct upload). Critically has headless CLI/entrypoints (`timeline`, `render-job`, `bot-workflow`) so NEXUS automates editing+rendering, not just GUI use. Shares the repo's stack; uses Claude as primary AI. Runs on the Mac (desktop/host), not this sandbox; alpha (97.5%); commercial license required for business use. Acts as the assembly+export hub that asset generators (SkyReels/HyperFrames/anime models) feed into.
