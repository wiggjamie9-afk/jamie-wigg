# Stable Diffusion WebUI (AUTOMATIC1111) — Setup & Reference

## Overview

[stable-diffusion-webui](https://github.com/AUTOMATIC1111/stable-diffusion-webui)
(commonly "A1111") is the most widely used **local** web UI for Stable
Diffusion. It exposes txt2img / img2img, inpainting/outpainting, upscalers, face
restoration, LoRA / Textual Inversion / Hypernetworks, a huge extension
ecosystem, and a REST **API** — all from a browser pointed at your own machine.

**Repository**: https://github.com/AUTOMATIC1111/stable-diffusion-webui
**Wiki / docs**: https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki

> ### How this fits the RHYTHMIX stack — read first
> This repo's creative pipeline is **cloud-first and iPhone-driven** (see
> `CREATIVE-AI-STACK.md`): image gen runs through the `higgsfield` MCP server,
> Replicate (FLUX / SDXL), Midjourney, Ideogram, etc. — none of which need a
> local GPU. A1111 is the opposite: it wants a **desktop/laptop with a decent
> GPU** (NVIDIA recommended). Reach for it only when you need things the cloud
> APIs don't give you cheaply:
> - Custom LoRA / Textual Inversion fine-tunes and full ControlNet control
> - Civitai community checkpoints and styles
> - Unlimited local iteration with zero per-image cost
> - A self-hosted **API** you fully control (no rate limits, no data leaving the box)
>
> If you don't have a GPU machine, **skip local install and use the cloud path**
> (Colab / rented GPU / Replicate) in the last section. A1111 outputs are still
> drop-in compatible with the rest of this repo: PNGs feed `higgsfield-to-hyperframes`
> → HyperFrames scenes, album art, thumbnails, and the `replicate`/`dream` flows.

## Key features (from upstream)

- **txt2img & img2img**, outpainting, inpainting (incl. RunwayML dedicated
  inpainting model), color sketch, loopback, batch processing.
- **Prompt control**: attention/emphasis `(word:1.2)`, negative prompts, prompt
  editing mid-generation, prompt matrix, composable diffusion (`AND`), styles,
  no 75-token limit.
- **Upscale & restore**: SD Upscale, Highres Fix, RealESRGAN/ESRGAN/SwinIR/
  Swin2SR/LDSR upscalers, GFPGAN & CodeFormer face restoration.
- **Models & tuning**: LoRA, Textual Inversion embeddings, Hypernetworks,
  checkpoint merger, on-the-fly checkpoint reload, separate VAE, CLIP skip,
  safetensors, SD 2.0 / Alt-Diffusion / Segmind support.
- **Workflow**: X/Y/Z plot, CLIP interrogator, DeepDanbooru tags, seed
  resizing/variations, tiling, training tab, generation parameters embedded in
  output PNGs (drag a PNG back in to restore settings).
- **Performance**: `--xformers` speed-up on supported NVIDIA cards; runs on 4GB
  VRAM (reports of 2GB); `--allow-code` for arbitrary Python from the UI (off by
  default — leave it off unless you trust the source).
- **API** for headless/programmatic use (`--api`).

## Prerequisites

| Need | Detail |
|---|---|
| Python | **3.10.6** (3.10.x / 3.11 work; newer Python may break torch). "Add Python to PATH" on Windows. |
| git | For cloning + auto-updates. |
| GPU | NVIDIA recommended (CUDA). AMD (ROCm/DirectML), Intel (integrated/discrete), Apple Silicon, and Ascend NPU paths exist — see upstream wiki. |
| Disk | ~10GB+ for the app and a base checkpoint; more per extra model. |

## Installation

### Windows 10/11 + NVIDIA (release package — easiest)

1. Download `sd.webui.zip` from the
   [`v1.0.0-pre`](https://github.com/AUTOMATIC1111/stable-diffusion-webui/releases/tag/v1.0.0-pre)
   release and extract it.
2. Run `update.bat`.
3. Run `run.bat`.

Details: [Install-and-Run-on-NVidia-GPUs](https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/Install-and-Run-on-NVidia-GPUs).

### Windows (manual / automatic from source)

1. Install **Python 3.10.6** (check "Add Python to PATH").
2. Install **git**.
3. Clone:
   ```bash
   git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui.git
   ```
4. Run `webui-user.bat` from Explorer as a **normal (non-admin)** user.

### Linux

Install dependencies for your distro:

```bash
# Debian/Ubuntu
sudo apt install wget git python3 python3-venv libgl1 libglib2.0-0
# Red Hat / Fedora
sudo dnf install wget git python3 gperftools-libs libglvnd-glx
# openSUSE
sudo zypper install wget git python3 libtcmalloc4 libglvnd
# Arch
sudo pacman -S wget git python3
```

Very new systems may need Python 3.10/3.11 explicitly and a launcher override:

```bash
# Ubuntu 24.04
sudo add-apt-repository ppa:deadsnakes/ppa && sudo apt update && sudo apt install python3.11
# Then in webui-user.sh:
python_cmd="python3.11"
```

Install and run (one-liner script, or clone manually):

```bash
wget -q https://raw.githubusercontent.com/AUTOMATIC1111/stable-diffusion-webui/master/webui.sh
# or: git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui
bash webui.sh
```

Check `webui-user.sh` for options.

### Apple Silicon (M1/M2/M3)

Follow the upstream
[Installation-on-Apple-Silicon](https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/Installation-on-Apple-Silicon)
guide. Works via MPS but is markedly slower than NVIDIA CUDA.

### Other accelerators

- **AMD GPUs**, **Intel CPUs / GPUs**, **Ascend NPUs** — see the dedicated
  external wiki pages linked from the upstream README.

## First run & models

1. On launch the UI serves at `http://127.0.0.1:7860`.
2. You need a **checkpoint** (`.safetensors`/`.ckpt`) in
   `models/Stable-diffusion/`. Grab one from
   [Hugging Face](https://huggingface.co) or [Civitai](https://civitai.com)
   (e.g. SDXL base, or a community fine-tune).
3. LoRAs → `models/Lora/`, embeddings → `embeddings/`, VAEs → `models/VAE/`.

## `webui-user` options worth setting

Edit `webui-user.bat` (Windows) / `webui-user.sh` (Linux) `COMMANDLINE_ARGS`:

| Flag | Why |
|---|---|
| `--xformers` | Big speed-up on supported NVIDIA cards. |
| `--api` | Enable the REST API (see below). |
| `--medvram` / `--lowvram` | Fit larger gens on small-VRAM cards. |
| `--listen` | Bind to LAN (⚠️ exposes the UI/API beyond localhost). |
| `--allow-code` | Enables arbitrary Python from the UI — **leave off** unless you trust everything running. |

## Using the API from this repo

Launch with `--api`, then call `http://127.0.0.1:7860/sdapi/v1/txt2img`:

```bash
curl -s http://127.0.0.1:7860/sdapi/v1/txt2img \
  -H "Content-Type: application/json" \
  -d '{"prompt":"RHYTHMIX neon album cover, electric cyan and magenta, dark canvas","steps":28,"width":1024,"height":1024}' \
  | python3 -c "import sys,json,base64;open('out.png','wb').write(base64.b64decode(json.load(sys.stdin)['images'][0]))"
```

The resulting `out.png` is a normal asset — feed it to the
`higgsfield-to-hyperframes` skill, drop it into a Cut folder, or use it as
album/thumbnail art. This is the local, zero-marginal-cost alternative to the
Replicate image step in the `replicate` / `dream` skills.

> **Security:** keep A1111 on `127.0.0.1`. Only use `--listen`/`--share` on a
> trusted network, never with `--allow-code`. Treat downloaded checkpoints and
> extensions as untrusted code.

## No desktop GPU? Use the cloud path (recommended for this repo)

Since the RHYTHMIX workflow is iPhone-driven, prefer one of these instead of a
local install:

- **Google Colab / other online services** — the upstream README links a
  [List of Online Services](https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/Online-Services)
  that run A1111 in the cloud.
- **Rented GPU** (RunPod, Vast.ai, Lambda) with an A1111 template — full UI +
  API without owning hardware.
- **Stay on the existing stack** — `higgsfield` MCP, Replicate FLUX/SDXL, the
  `dream` and `replicate` skills already cover most image needs from a phone.

## Credits / license

AUTOMATIC1111's stable-diffusion-webui is open source; per-component licenses are
listed in the app's **Settings → Licenses** screen and `html/licenses.html`. It
builds on Stable Diffusion, k-diffusion, Spandrel, GFPGAN, CodeFormer, ESRGAN,
SwinIR/Swin2SR, LDSR, xformers, and many others (see the upstream README's
Credits section).
