#!/bin/bash

# OpenManus Setup Script
# Automates the installation and configuration of OpenManus agent framework

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
INSTALL_DIR="${1:-.}"
VENV_NAME="venv"
CONFIG_FILE="$INSTALL_DIR/config/config.toml"

echo -e "${GREEN}=== OpenManus Setup Script ===${NC}"
echo "Install directory: $INSTALL_DIR"
echo ""

# Step 1: Clone repository if needed
if [ ! -d "$INSTALL_DIR/app" ]; then
    echo -e "${YELLOW}Cloning OpenManus repository...${NC}"
    git clone https://github.com/FoundationAgents/OpenManus "$INSTALL_DIR"
    cd "$INSTALL_DIR"
else
    echo -e "${GREEN}OpenManus directory found, skipping clone${NC}"
    cd "$INSTALL_DIR"
fi

# Step 2: Create virtual environment
if [ ! -d "$VENV_NAME" ]; then
    echo -e "${YELLOW}Creating Python virtual environment...${NC}"
    python -m venv "$VENV_NAME"
    echo -e "${GREEN}Virtual environment created${NC}"
else
    echo -e "${GREEN}Virtual environment already exists${NC}"
fi

# Step 3: Activate virtual environment
echo -e "${YELLOW}Activating virtual environment...${NC}"
source "$VENV_NAME/bin/activate"

# Step 4: Fix Pillow dependency conflict
echo -e "${YELLOW}Fixing dependency conflicts...${NC}"
if grep -q "pillow~=11.1.0" requirements.txt; then
    sed -i 's/pillow~=11\.1\.0/pillow>=10.1.0/' requirements.txt
    echo -e "${GREEN}Fixed Pillow version constraint${NC}"
else
    echo -e "${GREEN}Pillow version already compatible${NC}"
fi

# Step 5: Install dependencies
echo -e "${YELLOW}Installing Python dependencies (this may take 5-10 minutes)...${NC}"
pip install --upgrade pip setuptools wheel
pip install -r requirements.txt

if [ $? -ne 0 ]; then
    echo -e "${RED}Installation failed. Check errors above.${NC}"
    exit 1
fi

echo -e "${GREEN}Dependencies installed successfully${NC}"

# Step 6: Setup configuration
if [ ! -f "$CONFIG_FILE" ]; then
    echo -e "${YELLOW}Setting up configuration...${NC}"
    cp config/config.example.toml "$CONFIG_FILE"
    echo -e "${GREEN}Configuration file created: $CONFIG_FILE${NC}"
    echo -e "${YELLOW}Please edit $CONFIG_FILE and add your API credentials${NC}"
else
    echo -e "${GREEN}Configuration file already exists${NC}"
fi

# Step 7: Setup MCP if needed
if [ ! -f "config/mcp.json" ]; then
    echo -e "${YELLOW}Setting up MCP configuration...${NC}"
    if [ -f "config/mcp.example.json" ]; then
        cp config/mcp.example.json config/mcp.json
        echo -e "${GREEN}MCP configuration created${NC}"
    fi
fi

# Step 8: Verify installation
echo ""
echo -e "${YELLOW}Verifying installation...${NC}"
if python -c "import app.agent.manus" 2>/dev/null; then
    echo -e "${GREEN}OpenManus module verified${NC}"
else
    echo -e "${RED}Warning: Could not import OpenManus modules${NC}"
fi

echo ""
echo -e "${GREEN}=== Setup Complete ===${NC}"
echo ""
echo "Next steps:"
echo "1. Edit config/config.toml with your API credentials"
echo "2. Run: source $VENV_NAME/bin/activate"
echo "3. Try: python main.py --prompt 'Hello'"
echo ""
