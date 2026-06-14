#!/bin/bash

set -e

echo "🚀 Installing all dependencies..."
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

# API Setup
echo -e "${BLUE}📥 Installing PDF Analyzer API...${NC}"
cd pdf-analyzer-api
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env 2>/dev/null || true
echo -e "${GREEN}✓ PDF Analyzer API installed${NC}"
echo ""

# PDF Web Setup
echo -e "${BLUE}📥 Installing PDF Analyzer Web...${NC}"
cd ../pdf-analyzer-web
npm install
cp .env.example .env.local 2>/dev/null || true
echo -e "${GREEN}✓ PDF Analyzer Web installed${NC}"
echo ""

# Code Reviewer Setup
echo -e "${BLUE}📥 Installing Code Reviewer...${NC}"
cd ../code-reviewer
npm install
cp .env.example .env.local 2>/dev/null || true
echo -e "${GREEN}✓ Code Reviewer installed${NC}"
echo ""

cd ..
echo -e "${GREEN}✅ All installations complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Add API keys to .env files"
echo "2. Run: bash scripts/dev.sh"
echo ""
