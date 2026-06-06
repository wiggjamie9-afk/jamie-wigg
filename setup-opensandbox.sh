#!/bin/bash
set -e

# OpenSandbox Setup Script
# Automates installation and configuration

BOLD='\033[1m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BOLD}🚀 OpenSandbox Setup Script${NC}\n"

# Check prerequisites
echo -e "${BOLD}Checking prerequisites...${NC}"

# Check Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}✗ Docker not found${NC}"
    echo "  Install Docker Desktop from: https://www.docker.com/products/docker-desktop"
    exit 1
fi
echo -e "${GREEN}✓ Docker found${NC}: $(docker --version)"

# Check Docker daemon
if ! docker ps &> /dev/null; then
    echo -e "${RED}✗ Docker daemon not running${NC}"
    echo "  Start Docker Desktop or daemon and try again"
    exit 1
fi
echo -e "${GREEN}✓ Docker daemon running${NC}"

# Check Python
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}✗ Python 3 not found${NC}"
    echo "  Install Python 3.10+ from: https://www.python.org"
    exit 1
fi
echo -e "${GREEN}✓ Python found${NC}: $(python3 --version)"

echo ""
echo -e "${BOLD}Installing OpenSandbox packages...${NC}"

# Try uv first, fall back to pip
if command -v uv &> /dev/null; then
    echo "Using uv package manager..."
    uv tool install opensandbox-cli --quiet
    uv pip install opensandbox opensandbox-server opensandbox-code-interpreter --quiet
else
    echo "Using pip package manager..."
    pip install opensandbox opensandbox-cli opensandbox-server opensandbox-code-interpreter --quiet
fi

echo -e "${GREEN}✓ Packages installed${NC}"

echo ""
echo -e "${BOLD}Initializing configuration...${NC}"

# Create config directory
mkdir -p ~/.opensandbox

# Initialize config
osb config init --force 2>/dev/null || true

# Set connection settings
osb config set connection.domain localhost:8080
osb config set connection.protocol http

echo -e "${GREEN}✓ Configuration initialized${NC}"
echo "  Config file: ~/.opensandbox/config.toml"

echo ""
echo -e "${BOLD}Initializing OpenSandbox server...${NC}"

# Initialize server config if it doesn't exist
if [ ! -f ~/.sandbox.toml ]; then
    opensandbox-server init-config ~/.sandbox.toml --example docker
    echo -e "${GREEN}✓ Server config created${NC}"
else
    echo -e "${YELLOW}⚠ Server config already exists${NC}"
fi

echo ""
echo -e "${BOLD}Setup Complete! 🎉${NC}\n"

echo -e "${BOLD}Next steps:${NC}"
echo ""
echo "1. Start the OpenSandbox server (in one terminal):"
echo -e "   ${GREEN}opensandbox-server --config ~/.sandbox.toml${NC}"
echo ""
echo "2. Run demo scripts (in another terminal):"
echo -e "   ${GREEN}python opensandbox-demo.py${NC}"
echo -e "   ${GREEN}python opensandbox-examples.py${NC}"
echo -e "   ${GREEN}python opensandbox-data-science.py${NC}"
echo ""
echo "3. Read the guide for more details:"
echo -e "   ${GREEN}cat OPENSANDBOX-GUIDE.md${NC}"
echo ""
echo -e "${BOLD}Troubleshooting:${NC}"
echo "  • If 'command not found': Install uv (pip install uv) or use pip directly"
echo "  • If Docker errors: Make sure Docker Desktop is running"
echo "  • If connection refused: Make sure server is running in another terminal"
echo ""
