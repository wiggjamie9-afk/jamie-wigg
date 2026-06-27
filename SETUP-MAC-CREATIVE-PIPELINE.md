# Mac Creative Pipeline — Download & Run

A one-command bundle that reproduces the RHYTHMIX creative / animation pipeline
on your **Mac**. Everything in the *core* path is free and needs **no GPU and no
API key** — the AI-generation tools layer on top once you paste your keys.

## TL;DR

```bash
git clone <this-repo> jamie-wigg      # or: git pull, if you already have it
cd jamie-wigg
bash scripts/setup-mac-creative-pipeline.sh
```

The script is idempotent — re-run it any time. It finishes by **rendering a real
test MP4** so you know the pipeline actually works, not just that things
installed.

## What it sets up

| Component | What it gives you | Key needed? |
|---|---|---|
| **Homebrew** | Mac package manager (installed if missing) | — |
| **ffmpeg** | Video encode/decode — the engine under everything | — |
| **MoviePy v2** (in `.venv-creative`) | Stitch Cuts, burn captions, export GIFs, reframe 16:9 ↔ 9:16 ↔ 1:1 | — |
| **kokoro-tts** | Local narration audio for HyperFrames | — |
| **HyperFrames CLI** | Author HTML compositions → render to MP4 (runs via `npx`) | — |
| **`.env`** (scaffolded) | Higgsfield / Replicate / ElevenLabs / Step.fun keys | ✅ you paste |
| **`.claude/settings.local.json`** (scaffolded) | Replicate token for the `creative-stack` MCP | ✅ you paste |

## After it runs — what you can actually use

**Immediately, no keys:**
```bash
# Render any HyperFrames Cut to MP4
cd rhythmix-overview-60s && npx --yes hyperframes@0.4.42 render

# Post-process with MoviePy (activate the venv first)
source .venv-creative/bin/activate
python your-edit-script.py        # stitch, caption, GIF, reframe

# Generate narration
npx --yes hyperframes@0.4.42 tts
```

**Once you paste keys into `.env`:**
- **Higgsfield** — AI text-to-image (Soul), image-to-video (DOP), talking heads,
  3D meshes, avatars/portraits
- **Replicate** — FLUX images, Kling video, MusicGen audio (via the
  `creative-stack` MCP)
- **ElevenLabs** — premium voiceover / cloning

## Why a Mac unlocks more than the cloud sandbox

The cloud box this repo runs in has **no GPU and no desktop**, so three tools are
impossible there but become available on your Mac:

- **Stable Diffusion WebUI (A1111)** — runs locally on Apple-Silicon GPU (MPS).
  Custom LoRA / ControlNet, Civitai checkpoints, zero per-image cost.
  See [`SETUP-SD-WEBUI.md`](SETUP-SD-WEBUI.md).
- **Palmier Pro** — MCP-controllable NLE timeline; needs **macOS 26 + Apple
  Silicon**. Lets Claude drive a real editor. See [`SETUP-PALMIER-PRO.md`](SETUP-PALMIER-PRO.md).
- **Voicebox** — on-device voice cloning, no API cost. See [`VOICEBOX-SETUP.md`](VOICEBOX-SETUP.md).

The setup script auto-detects Apple Silicon and tells you which bonuses apply.

## Still not for a Mac

- **MiniMax-01** — the int8 quickstart assumes ~8 GPUs; it's a data-center model,
  not a laptop one. Use the hosted API instead. See [`SETUP-MINIMAX-01.md`](SETUP-MINIMAX-01.md).

## Persistence note

On the cloud sandbox, installs vanish when the container recycles. On your Mac
they're **permanent** — Homebrew, the `.venv-creative` virtualenv, and the
scaffolded `.env` all persist. `.env` and `.claude/settings.local.json` are
gitignored, so your keys never get committed.
