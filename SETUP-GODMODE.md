# GodMode — Setup & Reference

## Overview

**GodMode** (smol-ai) is a small dedicated **AI chat browser** — a menubar/webview
app that pulls up ChatGPT, Claude, Perplexity, Bing, Bard, Poe, and more with a
single shortcut (**Cmd+Shift+G**). Whatever you type at the bottom is sent to
**all enabled web apps at once**, and each pane is a real webview so you can keep
exploring any one independently. The point: full launch-day features (Code
Interpreter, file upload, image gen) because it uses the **web apps, not APIs**,
plus side-by-side "mixture of experts" answers. Open source,
`github.com/smol-ai/GodMode`.

> ### How this fits the RHYTHMIX repo
> **Tangential — a productivity tool, not a pipeline dependency.** Practical use
> here: fan a single prompt across several models at once when drafting RHYTHMIX
> copy / scripts / naming and comparing outputs, without wiring up APIs. General
> Mac utility; nothing in the video pipeline depends on it.

## Install

**macOS (recommended):** download the latest **`-universal.dmg`** from the
releases page and drag the app to `/Applications`:

- Releases: `github.com/smol-ai/GodMode/releases/latest`
- Apple Silicon = `arm64`; Intel = the non-arm64 `.dmg`; the `-universal.dmg`
  picks automatically.

> **Unsigned app:** macOS may mark it "damaged/untrusted" (no notarization). Open
> `/Applications`, **right-click the app → Open → Open** the first time.

**Windows:** `.exe` · **Linux:** `.AppImage` · **Arch:** third-party AUR package
`godmode`.

**Build from source:**

```bash
git clone https://github.com/smol-ai/GodMode.git && cd GodMode
npm install --force
npm run start        # dev
npm run package      # build binaries → /release/build
```

## First run

- **Log into Google once** (logging in via **Anthropic Claude first** is currently
  the most reliable), then refresh — that signs you into most of the other
  providers. Bing: log into your Microsoft account, then refresh to reach Bing Chat.
- Optional: Settings → start GodMode automatically on login.

## Shortcuts & features

- **Cmd+Shift+G** quick open/dismiss · **Cmd+Enter** (or Enter) submit ·
  **Cmd+R** new conversation (refresh) · **Cmd+1/2/3** pop out a webview ·
  **Cmd +/-** zoom · **Cmd+P** pin always-on-top.
- **Model toggle** — enable/disable providers via the context menu (saved between
  sessions). Supports no-API models (Perplexity, Poe, Pi, You.com, HuggingChat)
  and local models via Oobabooga (`http://127.0.0.1:7860/`).
- **PromptCritic** — Llama 2-assisted prompt improvement.
- Light/dark toggle (**Cmd+Shift+L**) — per the project's own notes this is
  **currently broken in the GodMode rewrite** and pending a fix.

## Notes

- On this repo's Mac, `mac-downloads/Install-Downloads.command` downloads the
  latest universal `.dmg` from the GitHub releases API and copies the app into
  `/Applications` (skips if `GodMode.app` is already there). Because the app is
  unsigned, you may still need to **right-click → Open** it the first time. If the
  download step can't resolve an asset, grab it manually from the releases page.
- Source of truth: `github.com/smol-ai/GodMode`. Provider list and auth quirks
  change over time; check the repo README.
