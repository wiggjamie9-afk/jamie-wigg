# Pixelle-Video

Just enter a **topic**, and Pixelle-Video automatically:

- ✍️ Writes the video script
- 🎨 Generates AI images / videos
- 🗣️ Synthesizes voice narration
- 🎵 Adds background music
- 🎬 Composes the final video

Zero barrier, zero editing experience — video creation in one sentence.

## Recent Updates

- **2026-01-26** — Added "Motion Transfer" module: upload reference video and image to perform motion transfer
- **2026-01-14** — Added "Digital Human Spokesperson" and "Image-to-Video" pipelines; added multilingual TTS voice support
- **2026-01-06** — Added support for RunningHub 48GB VRAM machine
- **2025-12-28** — Configurable RunningHub concurrency limits; improved LLM structured-output handling
- **2025-12-17** — ComfyUI API Key configuration; Nano Banana model support; API template custom params
- **2025-12-10** — Built-in FAQ in sidebar; locked edge-tts version to fix TTS instability
- **2025-12-08** — Fixed-script splitting (paragraph/line/sentence); template selection preview
- **2025-12-06** — Fixed video-generation API URL handling for cross-platform compatibility
- **2025-12-05** — Added Windows all-in-one bundle; improved image/video reverse-prompt workflow
- **2025-12-04** — Added "Custom Materials": upload your own photos/videos, AI auto-analyzes to generate script
- **2025-11-18** — Optimized parallel RunningHub calls; history page; batch task creation

## Feature Highlights

- ✅ **Fully automatic** — input a topic, get a finished video
- ✅ **AI script** — narration written for you
- ✅ **AI images** — every line gets a matching illustration
- ✅ **AI video** — supports models like WAN 2.1 for motion content
- ✅ **AI voice** — Edge-TTS, Index-TTS, and other mainstream TTS engines
- ✅ **Background music** — drop in BGM for atmosphere
- ✅ **Visual styles** — multiple templates
- ✅ **Flexible aspect ratios** — vertical, horizontal, etc.
- ✅ **Multiple LLMs** — GPT, Qwen, DeepSeek, Ollama, …
- ✅ **Composable atomic abilities** — built on ComfyUI, swap in FLUX for image gen, ChatTTS for TTS, etc.

## Pipeline

Modular design: **script → shot planning → per-frame processing → composition**.

Each stage is customizable: pick the LLM, the audio engine, the visual style.

## Quick Start

### Windows (recommended for Windows users)

A one-click bundle — no need to install Python, uv, or ffmpeg.

1. Download the latest Windows bundle and unzip
2. Double-click `start.bat` to launch the web UI
3. Browser opens at <http://localhost:8501>
4. In **⚙️ System Configuration**, set the LLM API and image-gen service
5. Generate

### From source (macOS / Linux / advanced users)

#### Prerequisites — `uv` and `ffmpeg`

**Install `uv`:** see the [official uv install guide](https://docs.astral.sh/uv/getting-started/installation/). Verify with `uv --version`.

**Install `ffmpeg`:**

```bash
# macOS
brew install ffmpeg

# Ubuntu / Debian
sudo apt update
sudo apt install ffmpeg

# Windows: download from https://ffmpeg.org/download.html
# extract and add the bin/ directory to PATH
```

Verify with `ffmpeg -version`.

#### 1. Clone

```bash
git clone https://github.com/AIDC-AI/Pixelle-Video.git
cd Pixelle-Video
```

#### 2. Launch

```bash
# uv handles dependency installation automatically
uv run streamlit run web/app.py
```

Browser opens at <http://localhost:8501>.

#### 3. Configure in the web UI

On first run, expand **⚙️ System Configuration** and fill in:

- **LLM**: pick a model (Qwen, GPT, etc.) and paste your API key
- **Image**: ComfyUI URL or RunningHub API key

Click **Save Configuration** — you're ready.

## How to Use

The web UI has three columns. Below covers each.

### ⚙️ System Configuration (required first time)

#### LLM (large language model)

Used to generate the script.

**Quick presets**

- Pick a preset from the dropdown (Qwen, GPT-4o, DeepSeek, …)
- `base_url` and `model` autofill
- Click **🔑 Get API Key** to register and obtain a key

**Manual config**

- `API Key` — your key
- `Base URL` — API endpoint
- `Model` — model name

#### Image

Used to generate scene images.

**Local (recommended)**

- `ComfyUI URL` — local ComfyUI service (default `http://127.0.0.1:8188`)
- Click **Test Connection**

**Cloud**

- `RunningHub API Key` — cloud image-gen service key

Click **Save Configuration**.

### 📝 Content Input (left column)

**Generation mode**

- **AI generate**: input a topic, AI writes the script. Example: "Why develop a reading habit"
- **Fixed script**: paste a complete script, skip AI authoring

**BGM**

- **None** — voice only
- **Built-in** — pick from preset music (e.g. `default.mp3`)
- **Custom** — drop MP3/WAV files into `bgm/`
- **Preview BGM** to listen

### 🎤 Voice (middle column)

**TTS workflow**

- Pick from the dropdown (Edge-TTS, Index-TTS, …)
- Workflows are auto-discovered from `workflows/`
- Custom ComfyUI workflows supported

**Reference audio (optional)**

- Upload an audio file for voice cloning (MP3/WAV/FLAC)
- Works with cloning-capable TTS workflows (e.g. Index-TTS)

**Preview**

- Type test text, click **Preview Voice**

### 🎨 Visual (middle column)

**Image generation**

Decides the illustration style.

- **ComfyUI workflow** — pick from dropdown; supports local (`selfhost`) and cloud (`RunningHub`) workflows. Default `image_flux.json`. Drop custom workflows into `workflows/`.
- **Image size** — width × height in pixels (default 1024×1024). Models have different size limits.
- **Prompt prefix** — controls overall style (English). Example: `Minimalist black-and-white matchstick figure style illustration, clean lines, simple sketch style`. Click **Preview Style** to test.

**Video template**

Decides layout and design.

- `static_*.html` — static templates (no AI media, pure text)
- `image_*.html` — image background (AI-generated)
- `video_*.html` — video background (AI-generated)

Templates are grouped by aspect ratio (vertical / horizontal / square). Drop your own HTML into `templates/`.

### 🎬 Generate (right column)

- Click **🎬 Generate Video** after configuring
- Live progress: script → images → voice → composition
- Auto-preview when done
- Output in `output/`

## FAQ

**How long does the first run take?**
Depends on shot count, network, and inference speed. Usually a few minutes.

**Unhappy with the output?**

- Try a different LLM (different writing styles)
- Adjust image size and prompt prefix
- Switch TTS workflow or upload reference audio
- Try a different template / size

**Cost?**

This project supports a **fully free** path:

- **Free**: Ollama (local) + ComfyUI (local) = $0
- **Recommended**: Qwen (very cheap) + ComfyUI (local)
- **Cloud**: OpenAI + RunningHub (higher cost, no local setup)

If you have a GPU, go fully free. Otherwise, Qwen is the best price/performance.

## Reference Projects

Pixelle-Video draws inspiration from:

- Pixelle-MCP — ComfyUI MCP server
- MoneyPrinterTurbo — video generation tool
- NarratoAI — film commentary automation
- MoneyPrinterPlus — video creation platform
- ComfyKit — ComfyUI workflow wrapper

## License

Apache 2.0. See `LICENSE`.
