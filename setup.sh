#!/bin/bash

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Detect OS
OS="$(uname -s)"
case "$OS" in
  Darwin*) OS_TYPE="macOS" ;;
  Linux*) OS_TYPE="Linux" ;;
  MINGW*|MSYS*) OS_TYPE="Windows" ;;
  *) OS_TYPE="Unknown" ;;
esac

echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}   Video Pipeline Setup (Ollama + ComfyUI + AudioCraft)${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}Detected OS: ${OS_TYPE}${NC}\n"

# ============================================
# Step 1: Install Ollama
# ============================================
echo -e "${BLUE}[Step 1/4] Installing Ollama...${NC}"

if command -v ollama &> /dev/null; then
  echo -e "${GREEN}✓ Ollama already installed${NC}"
else
  case "$OS_TYPE" in
    macOS)
      echo "Installing Ollama via Homebrew..."
      if command -v brew &> /dev/null; then
        brew install ollama
      else
        echo -e "${RED}✗ Homebrew not found. Install from https://brew.sh${NC}"
        exit 1
      fi
      ;;
    Linux)
      echo "Installing Ollama..."
      curl -fsSL https://ollama.com/install.sh | sh
      ;;
    Windows)
      echo -e "${YELLOW}⚠ Manual step: Download from https://ollama.com/download${NC}"
      ;;
  esac
fi

# Start Ollama in background
echo "Starting Ollama service..."
if pgrep -f "ollama serve" > /dev/null; then
  echo -e "${GREEN}✓ Ollama already running${NC}"
else
  nohup ollama serve > /tmp/ollama.log 2>&1 &
  sleep 3
fi

# Download models
echo "Downloading Mistral model (~4GB)..."
ollama pull mistral

echo -e "${GREEN}✓ Ollama ready at http://localhost:11434${NC}\n"

# ============================================
# Step 2: Install ComfyUI
# ============================================
echo -e "${BLUE}[Step 2/4] Setting up ComfyUI...${NC}"

COMFYUI_PATH="${HOME}/projects/ComfyUI"

if [ -d "$COMFYUI_PATH" ]; then
  echo -e "${GREEN}✓ ComfyUI already cloned at ${COMFYUI_PATH}${NC}"
else
  echo "Cloning ComfyUI repository..."
  mkdir -p "${HOME}/projects"
  cd "${HOME}/projects"
  git clone https://github.com/comfyui/ComfyUI.git
fi

cd "$COMFYUI_PATH"

# Create venv if needed
if [ ! -d "venv" ]; then
  echo "Creating Python virtual environment..."
  python3 -m venv venv
fi

source venv/bin/activate

echo "Installing ComfyUI dependencies..."
pip install -q -r requirements.txt

# GPU acceleration (optional, but recommended)
echo "Installing PyTorch with GPU support..."
case "$OS_TYPE" in
  macOS)
    echo "macOS detected - using default CPU or Apple Silicon Metal"
    pip install -q torch torchvision torchaudio
    ;;
  Linux)
    echo "Linux detected - installing NVIDIA CUDA support"
    pip install -q torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
    ;;
esac

# Download Flux model
echo "Downloading Flux.1-dev model (~13GB)..."
mkdir -p models/checkpoints

if [ ! -f "models/checkpoints/flux1-dev.safetensors" ]; then
  if command -v huggingface-cli &> /dev/null; then
    huggingface-cli download black-forest-labs/FLUX.1-dev flux1-dev.safetensors --local-dir ./models/checkpoints/
  else
    echo -e "${YELLOW}⚠ huggingface-cli not found. Install: pip install huggingface-hub${NC}"
    echo "Alternatively, download manually from:"
    echo "https://huggingface.co/black-forest-labs/FLUX.1-dev/resolve/main/flux1-dev.safetensors"
  fi
else
  echo -e "${GREEN}✓ Flux model already downloaded${NC}"
fi

echo -e "${GREEN}✓ ComfyUI ready at ${COMFYUI_PATH}${NC}\n"

# ============================================
# Step 3: Install AudioCraft + Kokoro + FFmpeg
# ============================================
echo -e "${BLUE}[Step 3/4] Installing AudioCraft, Kokoro, and FFmpeg...${NC}"

# Install FFmpeg
case "$OS_TYPE" in
  macOS)
    if command -v ffmpeg &> /dev/null; then
      echo -e "${GREEN}✓ FFmpeg already installed${NC}"
    else
      echo "Installing FFmpeg via Homebrew..."
      brew install ffmpeg
    fi
    ;;
  Linux)
    if command -v ffmpeg &> /dev/null; then
      echo -e "${GREEN}✓ FFmpeg already installed${NC}"
    else
      echo "Installing FFmpeg..."
      sudo apt-get update
      sudo apt-get install -y ffmpeg libavformat-dev libavdevice-dev
    fi
    ;;
esac

# Install Python packages
echo "Installing Python packages..."
pip install -q audiocraft kokoro-tts

echo -e "${GREEN}✓ AudioCraft, Kokoro, and FFmpeg ready${NC}\n"

# ============================================
# Step 4: Setup this repo's Python environment
# ============================================
echo -e "${BLUE}[Step 4/4] Setting up video pipeline environment...${NC}"

cd /home/user/jamie-wigg

if [ ! -d "venv" ]; then
  echo "Creating Python virtual environment for pipeline..."
  python3 -m venv venv
fi

source venv/bin/activate

if [ -f "app/requirements.txt" ]; then
  echo "Installing pipeline dependencies..."
  pip install -q -r app/requirements.txt
else
  echo "Installing base packages..."
  pip install -q requests pydantic
fi

echo -e "${GREEN}✓ Pipeline environment ready${NC}\n"

# ============================================
# Verification
# ============================================
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}                  VERIFICATION TESTS${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}\n"

# Test Ollama
echo -n "Testing Ollama... "
if curl -s http://localhost:11434/api/tags | jq . > /dev/null 2>&1; then
  echo -e "${GREEN}✓${NC}"
else
  echo -e "${RED}✗ Not responding${NC}"
fi

# Test ComfyUI
echo -n "Testing ComfyUI... "
if curl -s http://localhost:8188/system_stats | jq . > /dev/null 2>&1; then
  echo -e "${GREEN}✓${NC}"
else
  echo -e "${YELLOW}⚠ Not running (start with: cd $COMFYUI_PATH && python main.py)${NC}"
fi

# Test AudioCraft
echo -n "Testing AudioCraft... "
if python3 -c "from audiocraft.models import MusicGen; print('OK')" 2>/dev/null | grep -q OK; then
  echo -e "${GREEN}✓${NC}"
else
  echo -e "${RED}✗ Import failed${NC}"
fi

# Test Kokoro
echo -n "Testing Kokoro TTS... "
if python3 -c "import kokoro; print('OK')" 2>/dev/null | grep -q OK; then
  echo -e "${GREEN}✓${NC}"
else
  echo -e "${YELLOW}⚠ Will be lazy-loaded on first use${NC}"
fi

echo ""

# ============================================
# Next Steps
# ============================================
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}         Setup Complete! Next Steps:${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}\n"

echo "1. Start services (in separate terminals):"
echo -e "   ${YELLOW}Terminal 1:${NC} ollama serve"
echo -e "   ${YELLOW}Terminal 2:${NC} cd ${COMFYUI_PATH} && python main.py"
echo -e "   ${YELLOW}Terminal 3:${NC} (ready for your commands)\n"

echo "2. Run the test pipeline:"
echo -e "   ${YELLOW}cd /home/user/jamie-wigg${NC}"
echo -e "   ${YELLOW}python app/TEST_PIPELINE.py${NC}\n"

echo "3. Generate your first video:"
echo -e "   ${YELLOW}python -c \"from app import CompleteVideoPipeline; p = CompleteVideoPipeline(); p.generate_video('Street vendor POS', 5, 'VendorPOS')\"${NC}\n"

echo "4. Install skills in Claude Code (when available):"
echo -e "   ${YELLOW}/plugin install open-models-video@wiggjamie9-afk/jamie-wigg${NC}\n"

echo -e "${GREEN}Happy video generation! 🎬${NC}"
