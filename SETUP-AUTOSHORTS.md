# AutoShorts Setup Guide

## Overview

**AutoShorts** turns long-form video or audio recordings into high-impact, vertical
short-form clip candidates (9:16 portrait) with AI-powered viral-moment ranking. It is a
**desktop app** built on **Tauri 2 + React + TypeScript + Rust + SQLite**.

**Why it's here:** directly on-brand for the RHYTHMIX short-form pipeline (TikTok / Reels /
Shorts cuts). It complements the HyperFrames promo workflow — HyperFrames *authors* vertical
promos from scratch; AutoShorts *extracts* the best vertical moments out of existing long videos.

> ⚠️ AutoShorts is a **native desktop application** (macOS / Windows / Linux). It cannot run
> inside this repo's cloud sandbox or on iPhone — install it on a Mac/PC. This doc preserves
> the steps; run them on a desktop machine.

## Key features

- **Multi-LLM moment detection** — DeepSeek (default) or Claude (Anthropic) for viral-moment + hook analysis.
- **Automated pipeline** — import media → extract audio → transcribe (Deepgram) → analyze & rank moments, in one chain.
- **Local SQLite storage** — transcripts, candidates, custom names, and render data stay on-device.
- **Native project manager** — create / open / rename / delete projects from the dashboard.
- **Portrait auto-cropping** — center-crops landscape → vertical H.264 portrait clips via native ffmpeg.
- **Env warnings** — in-UI prompts when required environment variables are missing.

## Prerequisites — FFmpeg & FFprobe (on PATH)

Required for cropping, audio extraction, and dynamic captions.

```bash
# macOS (Homebrew)
brew install ffmpeg
# If drawtext/subtitles filters are missing, use the homebrew-ffmpeg tap:
brew tap homebrew-ffmpeg/ffmpeg
brew install homebrew-ffmpeg/ffmpeg/ffmpeg

# Windows (PowerShell)
winget install Gyan.FFmpeg     # or download from gyan.dev and add to PATH

# Linux
sudo apt install ffmpeg        # Debian/Ubuntu
sudo pacman -S ffmpeg          # Arch
sudo dnf install ffmpeg        # Fedora
```

## Install (prebuilt releases)

Download the package for your platform from the project's GitHub Releases.

- **macOS** — `aarch64.dmg` (Apple Silicon) or `x64.dmg` (Intel). Open the `.dmg`, drag
  AutoShorts to Applications. For unsigned local builds, right-click → Open, or
  `xattr -cr /Applications/AutoShorts.app` to clear Gatekeeper quarantine.
- **Windows** — `.msi` installer or `.exe` portable. SmartScreen (self-signed): *More info → Run anyway*.
- **Linux** — `.deb` (`sudo dpkg -i autoshorts_*.deb`) or `.AppImage`
  (`chmod +x autoshorts_*.AppImage && ./autoshorts_*.AppImage`).

## First-launch onboarding

An onboarding wizard offers two workflows:

- **Option A — fully offline:** Ollama (llama3.2 3B / qwen2.5 3B / qwen2.5 7B; auto-pulls
  weights) + local Whisper (`pip3 install openai-whisper`).
- **Option B — cloud API keys:** Deepgram (transcription), DeepSeek (recommended moment
  detection), Claude (premium hooks/copy).

Change later via the **API Settings** gear; **Reset App Configuration & Onboarding** to start over.

> Provider note: local 3B/7B models are **not** recommended for moment detection (weak at long-transcript
> reasoning + timestamp math). **DeepSeek** is recommended (≈<$0.001/transcript); **Claude** for the
> best hook copywriting (≈$0.01–$0.05/run).

## Developer build (from source)

```bash
cp .env.example .env
# Fill in:
#   DEEPGRAM_API_KEY=...
#   DEEPSEEK_API_KEY=...
#   ANTHROPIC_API_KEY=...
#   LLM_PROVIDER=deepseek      # or "claude"

npm install
npm run tauri:dev              # live-reloaded dev shell
npm run tauri:build            # native bundle → src-tauri/target/release/bundle/
```

Requires the Rust toolchain + Node, plus FFmpeg/FFprobe on PATH (see Prerequisites).

## Where it fits in this repo

Use AutoShorts to mine vertical clip candidates from long RHYTHMIX recordings, then finish/brand
the selected cuts with the HyperFrames pipeline (`rhythmix-<name>-f` portrait variants) or the
`/rhythmix-new` promo flow. Keep `ANTHROPIC_API_KEY` / `DEEPSEEK_API_KEY` / `DEEPGRAM_API_KEY`
out of git — use the app's `.env` on the desktop machine, not this repo.
