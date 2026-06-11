---
name: video-pipeline-setup
description: Set up the complete open-source video generation pipeline on your local machine. Installs Ollama, ComfyUI, AudioCraft, Kokoro TTS, and FFmpeg with platform-specific configuration. Use this before attempting video generation. One-time 60-minute setup.
metadata:
  tags: setup, installation, ollama, comfyui, audiocraft, kokoro, ffmpeg, devops
---

## When to use

User asks for:
- "How do I set up the video pipeline?"
- "Install the open models video stack"
- "I'm getting connection refused errors"
- First time running video generation on a new machine

Do NOT use this skill if:
- Services are already running (check with `curl http://localhost:11434/api/tags`)
- User is debugging a specific service failure (use the service's dedicated troubleshooting steps)

## Quick start (all platforms)

Run the automated setup script:

```bash
cd /home/user/jamie-wigg
bash SETUP_LOCAL_MACHINE.md
```

This will:
1. Detect your OS (macOS / Linux / Windows WSL2)
2. Install package managers if needed (Homebrew / apt)
3. Install and start all services
4. Download required models (~20GB total)
5. Run verification tests
6. Provide next steps

Estimated time: **60 minutes** (mostly download / compilation waiting).

## Manual setup (if automated fails)

### Step 1: Install Ollama (15 minutes)

**macOS:**
```bash
brew install ollama
ollama serve &  # start in background
sleep 5
ollama pull mistral
```

**Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://ollama.ai/install.sh | sh
sudo systemctl start ollama
ollama pull mistral
```

**Windows (WSL2):**
```bash
# Inside WSL2 Ubuntu terminal:
curl -fsSL https://ollama.ai/install.sh | sh
ollama serve &
ollama pull mistral
```

**Verify:** `curl -s http://localhost:11434/api/tags | jq .`

Expected output:
```json
{
  "models": [
    {
      "name": "mistral:latest",
      ...
    }
  ]
}
```

### Step 2: Install ComfyUI (30 minutes)

**macOS (recommended: M1/M2/M3 with Metal acceleration):**
```bash
cd ~/dev  # or wherever you keep projects
git clone https://github.com/comfyanonymous/ComfyUI.git
cd ComfyUI
python3.11 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Download Flux.1-dev model (~13GB):
mkdir -p models/checkpoints
cd models/checkpoints
wget https://huggingface.co/black-forest-labs/FLUX.1-dev/resolve/main/flux1-dev.safetensors
# or use huggingface-cli:
# huggingface-cli download black-forest-labs/FLUX.1-dev flux1-dev.safetensors --local-dir ./
cd ../../..

# Start ComfyUI:
python main.py
# Should print: "To see the GUI go to http://127.0.0.1:8188"
```

**Linux (NVIDIA GPU recommended):**
```bash
git clone https://github.com/comfyanonymous/ComfyUI.git
cd ComfyUI
python3 -m venv venv
source venv/bin/activate
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
pip install -r requirements.txt

# Download Flux.1-dev:
mkdir -p models/checkpoints
huggingface-cli download black-forest-labs/FLUX.1-dev flux1-dev.safetensors --local-dir ./models/checkpoints/

# Start with CUDA:
python main.py --gpu-device 0
```

**Windows (WSL2):**
```bash
# Inside WSL2:
git clone https://github.com/comfyanonymous/ComfyUI.git
cd ComfyUI
python3 -m venv venv
source venv/bin/activate
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
pip install -r requirements.txt

# Download model (same as Linux)
mkdir -p models/checkpoints
huggingface-cli download black-forest-labs/FLUX.1-dev flux1-dev.safetensors --local-dir ./models/checkpoints/

python main.py
```

**Verify:** `curl -s http://localhost:8188/system_stats | jq .`

Expected output:
```json
{
  "devices": [...],
  "models": {...}
}
```

### Step 3: Install AudioCraft + Kokoro TTS + FFmpeg (10 minutes)

**macOS:**
```bash
brew install ffmpeg
pip install audiocraft kokoro-tts  # use your global Python or repo venv
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get update && sudo apt-get install -y ffmpeg libavformat-dev libavdevice-dev
pip install audiocraft kokoro-tts
```

**Windows (WSL2):**
```bash
sudo apt-get install -y ffmpeg libavformat-dev libavdevice-dev
pip install audiocraft kokoro-tts
```

**Verify all three:**
```bash
ffmpeg -version | head -1
python3 -c "from audiocraft.models import MusicGen; print('AudioCraft OK')"
kokoro-tts --help | head -3
```

### Step 4: Python environment for this repo

```bash
cd /home/user/jamie-wigg
python3 -m venv venv  # or use existing venv
source venv/bin/activate
pip install -r app/requirements.txt
```

## Service startup checklist

Before running any video generation, ensure all three services are running in separate terminals:

**Terminal 1 — Ollama:**
```bash
ollama serve
# Should print: "Listening on 127.0.0.1:11434"
# Keep running
```

**Terminal 2 — ComfyUI:**
```bash
cd ~/dev/ComfyUI  # adjust path
source venv/bin/activate
python main.py
# Should print: "To see the GUI go to http://127.0.0.1:8188"
# Keep running
```

**Terminal 3 — Verify both are accessible:**
```bash
curl -s http://localhost:11434/api/tags | jq '.models | length'  # should print a number
curl -s http://localhost:8188/system_stats | jq '.devices | length'  # should print a number
```

If both return numbers, you're ready to generate videos.

## Run the test suite

```bash
cd /home/user/jamie-wigg/app
python TEST_PIPELINE.py
```

This will:
1. Test Ollama connectivity and script generation
2. Test ComfyUI connectivity
3. Generate one complete test video (5 scenes)
4. Report statistics and any failures

Expected output:
```
✓ Ollama connectivity: OK
✓ Script generation: OK
✓ ComfyUI connectivity: OK
✓ Test video generation: COMPLETE
  - Generated 5 images in 120s
  - Narration: 2.3s
  - Total time: 167s
  - Output: app/outputs/test-video/test-video.mp4
```

## Troubleshooting by service

### Ollama

**"curl: command not found"**
- Install curl: `brew install curl` (macOS) or `apt-get install curl` (Linux)

**"Connection refused at localhost:11434"**
- Service not started. Run: `ollama serve &` in a new terminal
- On macOS, check System Preferences → Security & Privacy if it's blocked

**"CUDA not detected" (Linux)**
- Install nvidia-docker: `distribution=$(. /etc/os-release;echo $ID$VERSION_ID)` then follow nvidia-docker docs
- Or just use CPU (slower but works)

### ComfyUI

**"No module named torch"**
- PyTorch not installed. Run: `pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118`

**"CUDA out of memory"**
- GPU too small for Flux.1-dev (~13GB). Options:
  1. Use a machine with more VRAM
  2. Use Flux.1-schnell (faster, 4GB VRAM)
  3. Use SDXL instead (8GB VRAM)
  4. Run on CPU (very slow ~5 min per image)

**"Flux model not found"**
- Model didn't download. Run manually:
  ```bash
  cd ~/dev/ComfyUI/models/checkpoints
  huggingface-cli download black-forest-labs/FLUX.1-dev flux1-dev.safetensors --local-dir ./
  ```

### AudioCraft

**"Package libavformat was not found"**
- FFmpeg dev libraries not installed:
  - macOS: `brew install ffmpeg`
  - Linux: `sudo apt-get install libavformat-dev libavdevice-dev`

**"No module named audiocraft"**
- Package not installed. Run: `pip install audiocraft`

### Kokoro TTS

**"No module named kokoro"**
- Package not installed. Run: `pip install kokoro-tts`

**"ONNX model not downloaded"**
- First run downloads the model (~2GB). Requires ~3 minutes. Let it complete.

## Network configuration

If services are on different machines (GPU machine + CPU machine):

```python
from app import CompleteVideoPipeline

# GPU machine runs ComfyUI on 192.168.1.100:8188
# CPU machine runs Ollama on localhost:11434
pipeline = CompleteVideoPipeline(
    comfyui_url="http://192.168.1.100:8188",
    # ollama_url defaults to localhost:11434
)
```

For production, use a reverse proxy (Nginx) to expose services securely.

## Next steps after successful setup

1. **Generate a test video:** Run `python app/TEST_PIPELINE.py`
2. **Generate your first custom video:** Use the `open-models-video` skill
3. **Batch generate for 100 APPS:** Use the `batch-video-apps` skill
4. **Monitor resource usage:** Watch GPU / RAM / disk during generation

## Files to reference

- `SETUP_LOCAL_MACHINE.md` — detailed setup guide with exact commands (this file)
- `app/FULL_STACK_PIPELINE.md` — technical deep dive
- `app/README.md` — service configuration reference
- `app/TEST_PIPELINE.py` — comprehensive test script
