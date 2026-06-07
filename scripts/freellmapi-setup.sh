#!/bin/bash
#
# FreeLLMAPI Quick-Setup Script
# Generates encryption key, starts Docker container, and prints next steps
#
# Usage: bash scripts/freellmapi-setup.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FREELLM_DIR="$SCRIPT_DIR/infra/freellmapi"

echo "🚀 FreeLLMAPI Quick Setup"
echo "=========================="
echo ""

# Check prerequisites
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first:"
    echo "   https://docs.docker.com/get-docker/"
    exit 1
fi

if ! command -v openssl &> /dev/null; then
    echo "❌ OpenSSL is not installed. Please install it first."
    exit 1
fi

# Generate encryption key
echo "🔐 Generating encryption key..."
ENCRYPTION_KEY=$(openssl rand -hex 32)

# Create .env file
ENV_FILE="$FREELLM_DIR/.env"
printf "ENCRYPTION_KEY=%s\nPORT=3001\n" "$ENCRYPTION_KEY" > "$ENV_FILE"
echo "✅ Created $ENV_FILE"
echo ""

# Start Docker container
cd "$FREELLM_DIR"
echo "🐳 Starting FreeLLMAPI container..."
docker compose up -d

# Wait for container to be ready
echo "⏳ Waiting for container to be ready..."
for i in {1..30}; do
    if curl -s http://localhost:3001 > /dev/null 2>&1; then
        echo "✅ Container is ready!"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "⚠️  Container took longer than expected to start. Checking logs..."
        docker compose logs freellmapi | tail -20
    fi
    sleep 1
done

echo ""
echo "=========================================="
echo "✨ FreeLLMAPI is running!"
echo "=========================================="
echo ""
echo "📊 Dashboard: http://localhost:3001"
echo ""
echo "🔑 Next steps:"
echo "  1. Open http://localhost:3001 in your browser"
echo "  2. Create a login (email + password)"
echo "  3. Go to 'Keys' page and add API keys from:"
echo "     - Groq (https://console.groq.com/keys)"
echo "     - Google Gemini (https://aistudio.google.com/app/apikeys)"
echo "     - Mistral (https://console.mistral.ai/api-keys)"
echo "     - Cerebras (https://console.cerebras.ai/auth/login)"
echo "     - SambaNova (https://cloud.sambanova.ai/apis)"
echo ""
echo "  4. Reorder your 'Fallback Chain' (top = highest priority)"
echo "  5. Copy your 'Unified API Key' from the Keys page"
echo ""
echo "  6. Add to your .env file:"
echo "     FREELLM_API_KEY=freellmapi-xxx"
echo "     LLM_MODE=free"
echo ""
echo "📖 Full setup guide: infra/freellmapi/SETUP.md"
echo "💻 Example usage: examples/llm-router-example.ts"
echo ""
echo "📝 To check container status:"
echo "   docker compose -f infra/freellmapi/docker-compose.yml logs -f freellmapi"
echo ""
echo "⛔ To stop the container:"
echo "   docker compose -f infra/freellmapi/docker-compose.yml down"
echo ""
