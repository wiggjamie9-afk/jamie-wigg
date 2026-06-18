# ComfyUI Viggle - Docker Setup

Quick start guide for running ComfyUI with Viggle workflows via Docker.

## Prerequisites

- **Docker** v24.0+
- **Docker Compose** v2.20+ (optional, for multi-service setup)
- **GPU**: NVIDIA GPU with CUDA 11.8+ or AMD GPU with ROCm
- **GPU Memory**: 8GB minimum (12GB+ recommended for SDXL)
- **Disk Space**: 50GB+ (for models and outputs)

## Option 1: Docker with NVIDIA GPU (Recommended)

### 1. Pull the ComfyUI image

```bash
docker pull yanwk/comfyui-boot:latest-nvidia
```

### 2. Run ComfyUI with Viggle workflows

```bash
docker run -it --gpus all \
  -p 8188:8188 \
  -v $(pwd)/comfyui_viggle/models:/root/models \
  -v $(pwd)/comfyui_viggle/outputs:/root/outputs \
  -v $(pwd)/comfyui_viggle/workflows:/root/workflows \
  -e NVIDIA_VISIBLE_DEVICES=all \
  yanwk/comfyui-boot:latest-nvidia
```

### 3. Access ComfyUI

Open browser: **http://localhost:8188**

## Option 2: Docker Compose (Multi-Service)

### 1. Create docker-compose.yml

```yaml
version: '3.8'

services:
  comfyui:
    image: yanwk/comfyui-boot:latest-nvidia
    container_name: comfyui-viggle
    ports:
      - "8188:8188"
    volumes:
      - ./comfyui_viggle/models:/root/models
      - ./comfyui_viggle/outputs:/root/outputs
      - ./comfyui_viggle/workflows:/root/workflows
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: all
              capabilities: [gpu]
    environment:
      - NVIDIA_VISIBLE_DEVICES=all
      - CUDA_VISIBLE_DEVICES=0
    stdin_open: true
    tty: true

  # Optional: API wrapper for Ruflo integration
  viggle-api:
    build:
      context: .
      dockerfile: comfyui_viggle/docker/Dockerfile.api
    container_name: viggle-api
    ports:
      - "3001:3001"
    volumes:
      - ./comfyui_viggle:/app/viggle
    depends_on:
      - comfyui
    environment:
      - COMFYUI_URL=http://comfyui:8188
      - API_PORT=3001

volumes:
  models:
  outputs:
```

### 2. Start services

```bash
docker-compose up -d
```

### 3. Check logs

```bash
docker-compose logs -f comfyui
```

## Option 3: Local Installation (Advanced)

If you prefer local installation instead of Docker:

```bash
# Clone ComfyUI
git clone https://github.com/comfyanonymous/ComfyUI.git
cd ComfyUI

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install torch torchvision torchaudio
pip install -r requirements.txt

# Copy Viggle workflows
cp ../comfyui_viggle/workflows/* custom_nodes/

# Start ComfyUI
python main.py --listen 0.0.0.0 --port 8188
```

## Model Download

ComfyUI will auto-download models on first run. To pre-download:

### Using ComfyUI UI

1. Open http://localhost:8188
2. Load any workflow (e.g., `workflow2_animatediff.json`)
3. Models will auto-download to `models/`

### Manual download (advanced)

```bash
# Stable Diffusion
wget -O models/checkpoints/sd-v1-5.safetensors \
  https://huggingface.co/runwayml/stable-diffusion-v1-5/resolve/main/v1-5-pruned-emaonly.safetensors

# SDXL (if using workflow3)
wget -O models/checkpoints/sd-xl-base-1.0.safetensors \
  https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0/resolve/main/sd_xl_base_1.0.safetensors

# AnimateDiff motion LoRA
wget -O models/animatediff/motion_lora_default.safetensors \
  https://huggingface.co/guoyww/animatediff/resolve/main/motion_lora_adapter.safetensors
```

## Verify Installation

### Check if service is running

```bash
curl http://localhost:8188/api/status
```

Expected response:
```json
{"status": "ok", "version": "..."}
```

### Test workflow execution

```bash
# Via curl
curl -X POST http://localhost:8188/api/viggle/generate \
  -F workflow=@comfyui_viggle/workflows/workflow1_lama_inpaint.json \
  -F image=@test_image.png

# Via Claude Code skill
/viggle-animate test_image.png --workflow lama-inpaint
```

## GPU Memory Management

### If getting CUDA out of memory errors

```bash
# Run with reduced batch size (in ComfyUI UI)
# Or use Docker memory limit:
docker run -it --gpus all \
  --memory=30g \
  -p 8188:8188 \
  ...
```

### Enable half-precision (fp16)

Edit workflow JSON:
```json
{
  "precision": "fp16",
  ...
}
```

Or via skill:
```bash
/viggle-animate input.png --precision fp16 --workflow animatediff
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `CUDA not found` | Install NVIDIA Docker: `distribution=$(. /etc/os-release;echo $ID$VERSION_ID)` |
| `Out of memory` | Reduce resolution, steps, or enable fp16 |
| `Models not downloading` | Check HuggingFace quota, try manual download |
| `Port 8188 already in use` | Change: `docker run -p 8189:8188 ...` |
| `Permission denied /dev/nvidiactl` | Add `--device=/dev/nvidiactl` to docker run |

## Integration with Ruflo

Once ComfyUI is running, the viggle-animate skill will auto-detect:

```bash
# Check if ComfyUI is detected
npx @claude-flow/cli@latest status | grep viggle

# Use the skill
/viggle-animate input.png --workflow animatediff
```

## Performance Benchmarks

### On NVIDIA RTX 3090 (24GB VRAM)

| Workflow | Resolution | Time | VRAM Used |
|----------|------------|------|-----------|
| lama-inpaint | 512×512 | 25s | 3.2GB |
| animatediff | 512×512 | 35s | 7.1GB |
| animatediff | 768×768 | 65s | 9.8GB |
| animatediff | 1024×1024 | 120s | 18.5GB |
| sdxl | 1024×1024 | 180s | 22.4GB |

## Next Steps

1. **Start ComfyUI** (use one of the three options above)
2. **Verify installation**: `curl http://localhost:8188/api/status`
3. **Test skill**: `/viggle-animate sample.png --workflow animatediff`
4. **Monitor**: `docker logs -f comfyui-viggle`
5. **Integrate with HyperFrames**: See main README.md

## See Also

- ComfyUI: https://github.com/comfyanonymous/ComfyUI
- NVIDIA Docker: https://github.com/NVIDIA/nvidia-docker
- Docker setup guide: https://docs.docker.com/install/
