#!/bin/bash
set -e

# RHYTHMIX Project Mac Setup Script
# Downloads and installs the complete toolchain for development
# Usage: chmod +x mac-setup.command && ./mac-setup.command

echo "🚀 RHYTHMIX Project Mac Toolchain Setup"
echo "========================================"
echo ""

# Check if running on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
  echo "❌ Error: This script is for macOS only"
  exit 1
fi

REPO_DIR="$(cd "$(dirname "$0")" && pwd)"
echo "📁 Repository: $REPO_DIR"
echo ""

# 1. Install Homebrew if not present
if ! command -v brew &> /dev/null; then
  echo "📦 Installing Homebrew..."
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
else
  echo "✅ Homebrew already installed"
fi

echo ""

# 2. Install ffmpeg
echo "📹 Installing ffmpeg..."
if ! command -v ffmpeg &> /dev/null; then
  brew install ffmpeg
  echo "✅ ffmpeg installed"
else
  echo "✅ ffmpeg already installed"
fi

echo ""

# 3. Install Ollama
echo "🤖 Installing Ollama..."
if ! command -v ollama &> /dev/null; then
  brew install ollama
  echo "✅ Ollama installed"
else
  echo "✅ Ollama already installed"
fi

# 4. Pull llama3.2 model
echo ""
echo "📥 Pulling llama3.2 model (this may take a few minutes)..."
if ! ollama list | grep -q "llama3.2"; then
  # Start ollama in background if not already running
  if ! pgrep -x "ollama" > /dev/null; then
    ollama serve &
    OLLAMA_PID=$!
    sleep 3
  fi
  ollama pull llama3.2
  echo "✅ llama3.2 model pulled"
else
  echo "✅ llama3.2 model already present"
fi

echo ""

# 5. Install Kokoro TTS
echo "🎵 Installing Kokoro TTS..."
if command -v uv &> /dev/null; then
  uv tool install kokoro-tts
  echo "✅ Kokoro TTS installed"
else
  echo "⚠️  uv not found, trying pip install..."
  pip3 install kokoro-tts
  echo "✅ Kokoro TTS installed"
fi

echo ""

# 6. Install pnpm
echo "📦 Installing pnpm (Node package manager)..."
if ! command -v pnpm &> /dev/null; then
  npm install -g pnpm
  echo "✅ pnpm installed"
else
  echo "✅ pnpm already installed"
fi

echo ""

# 7. Install repo dependencies
echo "📚 Installing repository dependencies..."
cd "$REPO_DIR"
pnpm install
echo "✅ Repository dependencies installed"

echo ""

# 8. Create .env template if it doesn't exist
if [ ! -f "$REPO_DIR/.env" ]; then
  echo "📝 Creating .env configuration template..."
  cat > "$REPO_DIR/.env" << 'EOF'
# API Keys for Creative Stack MCP Servers
# Fill in your actual tokens here — see CREATIVE-AI-STACK.md for details

# Replicate API token (for image/video/music generation)
# Get from: https://replicate.com/account/api-tokens
REPLICATE_API_TOKEN=your_replicate_token_here

# ElevenLabs API key (for text-to-speech)
# Get from: https://elevenlabs.io/app/billing/api
ELEVENLABS_API_KEY=your_elevenlabs_key_here

# Higgsfield API key (for AI image/video generation)
# Get from: https://www.higgsfield.ai
HIGGSFIELD_API_KEY=your_higgsfield_key_here
HIGGSFIELD_SECRET=your_higgsfield_secret_here

# Step API credentials (for Flash script generation)
# Get from: https://www.stepfun.com
STEP_API_KEY=your_step_api_key_here
STEP_BASE_URL=https://api.stepfun.com/v1

# Context7 API key (for library/API documentation)
# Get from: https://mcp.context7.com
CONTEXT7_API_KEY=your_context7_key_here

# Ollama configuration (local LLM)
# Default: http://localhost:11434
# OLLAMA_BASE_URL=http://localhost:11434

# GitHub token (optional, for Actions and API calls)
# GITHUB_TOKEN=your_github_token_here

# Development environment
NODE_ENV=development
EOF
  echo "✅ Created .env template at $REPO_DIR/.env"
  echo "   ⚠️  Please add your API keys before running the studio or tools"
else
  echo "✅ .env file already exists"
fi

echo ""
echo "🎉 Setup Complete!"
echo "========================================"
echo ""
echo "Next steps:"
echo "1. Edit .env and add your API tokens (if needed):"
echo "   - REPLICATE_API_TOKEN"
echo "   - ELEVENLABS_API_KEY"
echo "   - HIGGSFIELD_API_KEY"
echo ""
echo "2. Start Ollama (if not already running):"
echo "   ollama serve"
echo ""
echo "3. Run the project:"
echo "   cd $REPO_DIR/studio"
echo "   pnpm dev"
echo ""
echo "📖 For more details, see:"
echo "   - CLAUDE.md — feature guide"
echo "   - CREATIVE-AI-STACK.md — AI tools reference"
echo "   - KOKORO-SETUP.md — TTS configuration"
echo ""
