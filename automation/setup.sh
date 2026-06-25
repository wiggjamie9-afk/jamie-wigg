#!/bin/bash
set -e

echo "🚀 Setting up RHYTHMIX Empire Orchestrator"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check Python version
echo -e "${BLUE}→${NC} Checking Python version..."
python_version=$(python3 --version 2>&1 | awk '{print $2}')
echo "Python version: $python_version"

# Create virtual environment
echo -e "${BLUE}→${NC} Creating virtual environment..."
if [ ! -d "venv" ]; then
    python3 -m venv venv
    echo "Virtual environment created"
else
    echo "Virtual environment already exists"
fi

# Activate virtual environment
source venv/bin/activate
echo "Virtual environment activated"

# Upgrade pip
echo -e "${BLUE}→${NC} Upgrading pip..."
pip install --upgrade pip setuptools wheel

# Install dependencies
echo -e "${BLUE}→${NC} Installing dependencies..."
pip install -r automation/requirements.txt

# Install Redis if not present
echo -e "${BLUE}→${NC} Checking Redis..."
if command -v redis-server &> /dev/null; then
    echo "Redis is installed"
else
    echo -e "${YELLOW}ℹ${NC} Redis not found. Install with: brew install redis (macOS) or apt-get install redis-server (Linux)"
fi

# Create necessary directories
echo -e "${BLUE}→${NC} Creating output directories..."
mkdir -p ~/RHYTHMIX_Empire/output
mkdir -p ~/RHYTHMIX_Empire/logs
mkdir -p ~/RHYTHMIX_Empire/cache
mkdir -p automation/workflows
mkdir -p automation/handlers
mkdir -p automation/models

# Create .env file from template if not exists
echo -e "${BLUE}→${NC} Setting up environment variables..."
if [ ! -f ".env" ]; then
    cat > .env << 'EOF'
# RHYTHMIX Empire Configuration
ANTHROPIC_API_KEY=your_anthropic_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
REPLICATE_API_TOKEN=your_replicate_token_here
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here

# Redis
REDIS_URL=redis://localhost:6379

# Orchestrator
ORCHESTRATOR_CONFIG=automation/config.json
MAX_CONCURRENT_TASKS=4
POLLING_INTERVAL_SECONDS=5

# Storage
OUTPUT_PATH=~/RHYTHMIX_Empire/output
LOGS_PATH=~/RHYTHMIX_Empire/logs

# Services
VIDEO_API=replicate
IMAGE_API=replicate
TEXT_MODEL=claude-opus-4-8

# Voice
VOICE_ENABLED=true
VOICE_MODEL=base
EOF
    echo -e "${YELLOW}⚠${NC} .env file created. Fill in your API keys."
else
    echo ".env file already exists"
fi

# Create startup script
echo -e "${BLUE}→${NC} Creating startup script..."
cat > automation/start-orchestrator.sh << 'EOF'
#!/bin/bash
set -e

# Activate venv
source venv/bin/activate

echo "Starting RHYTHMIX Empire Orchestrator..."
echo ""

# Start Redis (if using system Redis)
if command -v redis-server &> /dev/null; then
    echo "Starting Redis..."
    redis-server --daemonize yes
    sleep 1
fi

# Start the orchestrator
echo "Launching orchestrator..."
python3 automation/orchestrator.py
EOF

chmod +x automation/start-orchestrator.sh

# Create demo script
echo -e "${BLUE}→${NC} Creating demo script..."
cat > automation/demo.sh << 'EOF'
#!/bin/bash
set -e

source venv/bin/activate

echo "🎬 RHYTHMIX Empire - Demo Mode"
echo ""
echo "1. Testing orchestrator..."
python3 -c "
import asyncio
from automation.orchestrator import RHYTHMIXOrchestrator, TaskPriority

async def demo():
    orchestrator = RHYTHMIXOrchestrator()
    workflow_id = orchestrator.submit_workflow(
        brief='Create a 60-second promo video about AI music',
        priority=TaskPriority.HIGH
    )
    print(f'✓ Workflow submitted: {workflow_id}')

asyncio.run(demo())
"

echo ""
echo "2. Testing voice interface..."
python3 -c "
import asyncio
from automation.voice_interface import VoiceCommandProcessor

async def demo():
    processor = VoiceCommandProcessor()
    result = await processor.parse_command('Generate a video about music production')
    print(f'✓ Voice command parsed successfully')

asyncio.run(demo())
"

echo ""
echo "✅ Demo complete!"
EOF

chmod +x automation/demo.sh

echo ""
echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo "📋 Next steps:"
echo ""
echo "1. Fill in your API keys in .env"
echo "2. Start Redis (if needed): redis-server"
echo "3. Run the orchestrator: ./automation/start-orchestrator.sh"
echo "4. Or test with: bash automation/demo.sh"
echo ""
echo "📚 Documentation:"
echo "   - Voice commands: python3 automation/voice_interface.py"
echo "   - Orchestrator API: Check orchestrator.py for task submission"
echo ""
