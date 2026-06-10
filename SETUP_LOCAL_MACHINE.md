# Local Machine Setup Guide

**Complete these steps on your Mac/Linux/Windows to enable the video pipeline.**

---

## Step 1: Ollama + LLM Models (15 min)

### macOS
```bash
brew install ollama
ollama serve &  # Start in background
sleep 2
ollama pull mistral
ollama pull gemma4  # Optional: better quality, slower
```

### Linux
```bash
curl -fsSL https://ollama.com/install.sh | sh
ollama serve &
ollama pull mistral
```

### Windows
1. Download from https://ollama.com/download
2. Run installer
3. Open PowerShell:
```powershell
ollama serve &
ollama pull mistral
```

**Verify:**
```bash
curl http://localhost:11434/api/tags
# Should return: {"models":[{"name":"mistral:latest",...}]}
```

---

## Step 2: ComfyUI + Flux Images (30 min)

### Clone & Install
```bash
# Choose where to install
cd ~/projects  # Or wherever you want

git clone https://github.com/comfyui/ComfyUI.git
cd ComfyUI

# Install dependencies
pip install -r requirements.txt

# For GPU acceleration (recommended)
# NVIDIA:
pip install torch torchvision torchaudio --extra-index-url https://download.pytorch.org/whl/cu130

# AMD:
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/rocm5.8

# Apple Silicon (M1/M2):
# Follow: https://developer.apple.com/metal/pytorch/
```

### Download Flux Model
```bash
# Option A: Download via UI (easier)
python main.py
# Then in web UI: Manager → Install Custom Nodes → search "Flux"
# Download model when prompted

# Option B: Download manually
cd models/checkpoints
wget https://huggingface.co/black-forest-labs/FLUX.1-dev/resolve/main/flux1-dev.safetensors
# ~13GB download
```

### Run ComfyUI
```bash
python main.py
# Open: http://localhost:8188
```

**Verify:**
- ComfyUI UI loads
- Can create nodes
- Flux model shows in manager

---

## Step 3: AudioCraft + FFmpeg (10 min)

### Install FFmpeg

**macOS:**
```bash
brew install ffmpeg
```

**Linux:**
```bash
sudo apt-get install ffmpeg
# or
sudo dnf install ffmpeg
```

**Windows:**
```powershell
choco install ffmpeg
# or download from https://ffmpeg.org/download.html
```

### Install AudioCraft
```bash
pip install audiocraft

# Verify:
python -c "import audiocraft; print('✓ AudioCraft installed')"
```

---

## Step 4: Test Everything

### Test Ollama
```bash
curl -X POST http://localhost:11434/api/generate \
  -d '{"model":"mistral","prompt":"Hello","stream":false}'
```

### Test ComfyUI
```bash
curl http://localhost:8188/api/routes
# Should return a list of endpoints
```

### Test AudioCraft
```python
from audiocraft.models import MusicGen
model = MusicGen.get_pretrained('facebook/musicgen-small')
print("✓ AudioCraft loaded")
```

---

## Step 5: Verify All Services Running

```bash
# Ollama
curl -s http://localhost:11434/api/tags | grep -q mistral && echo "✓ Ollama"

# ComfyUI
curl -s http://localhost:8188 | grep -q ComfyUI && echo "✓ ComfyUI"

# AudioCraft
python -c "import audiocraft; print('✓ AudioCraft')"

# FFmpeg
ffmpeg -version | head -1

# Kokoro (from cloud environment)
kokoro-tts --help > /dev/null && echo "✓ Kokoro"
```

---

## Quick Start Script (Save as `setup.sh`)

```bash
#!/bin/bash

echo "🚀 Setting up video pipeline..."

# Ollama
echo "1️⃣  Installing Ollama..."
brew install ollama
ollama serve &
sleep 3
ollama pull mistral
echo "✓ Ollama ready at http://localhost:11434"

# ComfyUI
echo "2️⃣  Installing ComfyUI..."
cd ~/projects
git clone https://github.com/comfyui/ComfyUI.git
cd ComfyUI
pip install -r requirements.txt
python main.py &
echo "✓ ComfyUI ready at http://localhost:8188"

# AudioCraft
echo "3️⃣  Installing AudioCraft..."
brew install ffmpeg
pip install audiocraft
echo "✓ AudioCraft installed"

echo "✅ Setup complete!"
echo ""
echo "Services running:"
echo "  • Ollama: http://localhost:11434"
echo "  • ComfyUI: http://localhost:8188"
echo "  • AudioCraft: Ready"
echo ""
echo "Next: Run the video pipeline from cloud environment"
```

Save as `~/projects/setup.sh`:
```bash
chmod +x ~/projects/setup.sh
./~/projects/setup.sh
```

---

## Checklist

- [ ] Ollama installed and running (`ollama serve &`)
- [ ] Mistral model downloaded (`ollama pull mistral`)
- [ ] ComfyUI cloned and dependencies installed
- [ ] Flux model downloaded to `ComfyUI/models/checkpoints/`
- [ ] ComfyUI running (`python main.py`)
- [ ] FFmpeg installed (`ffmpeg -version`)
- [ ] AudioCraft installed (`pip install audiocraft`)
- [ ] All services verified working

---

## Troubleshooting

### Ollama won't start
```bash
# Kill any existing processes
pkill ollama
# Try again
ollama serve
```

### ComfyUI port already in use
```bash
# Find what's using port 8188
lsof -i :8188
kill -9 <PID>
# Or run on different port
python main.py --listen 0.0.0.0 --port 8189
```

### AudioCraft ffmpeg error
```bash
# Make sure ffmpeg is installed
which ffmpeg
# If not:
brew install ffmpeg
```

### GPU not detected
```bash
# For NVIDIA
python -m torch.utils.collect_env | grep "CUDA"

# For AMD (ROCm)
rocm-smi

# For Apple Silicon
python -c "import torch; print(torch.backends.mps.is_available())"
```

### Models too slow
- Use smaller models:
  - Mistral → Gemma4 (better but slower)
  - Flux → SDXL (faster but lower quality)
  - MusicGen-medium → MusicGen-small

---

## What's Next

Once all services are running on your machine:

1. **From cloud environment**, run:
```python
from app.services.complete_pipeline import CompleteVideoPipeline

pipeline = CompleteVideoPipeline()
result = pipeline.generate_video(
    topic="Street vendor's daily hustle",
    scene_count=4,
    title="vendor_story"
)
```

2. **It will automatically call:**
   - Ollama (script generation)
   - ComfyUI (image generation)
   - AudioCraft (music generation)
   - Kokoro (narration)
   - FFmpeg (video assembly)

3. **Output:** 1080×1920 MP4 in ~4 minutes

---

## Performance Notes

**First run will be slow** (models loading):
- Ollama: 1-2min (loads model into memory)
- ComfyUI: 30-60s (CUDA initialization)
- AudioCraft: 20-30s (model loading)

**Subsequent runs:** Much faster (models cached)

**GPU vs CPU:**
- With GPU (10GB+): ~4 min per video
- With CPU only: ~15-20 min per video

---

**You're ready to generate videos!** 🎬
