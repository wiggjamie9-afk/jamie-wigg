#!/bin/bash

echo "🧪 Running integration tests..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

PASSED=0
FAILED=0

# Test health checks
echo -e "${BLUE}Testing API health...${NC}"
if curl -s http://localhost:8000/ | grep -q "healthy"; then
    echo -e "${GREEN}✓ API health check passed${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ API health check failed${NC}"
    ((FAILED++))
fi

echo -e "${BLUE}Testing Web app...${NC}"
if curl -s http://localhost:3000/ | grep -q "PDF Analyzer"; then
    echo -e "${GREEN}✓ Web app is running${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ Web app check failed${NC}"
    ((FAILED++))
fi

echo -e "${BLUE}Testing API Docs...${NC}"
if curl -s http://localhost:8000/docs | grep -q "swagger"; then
    echo -e "${GREEN}✓ API docs are available${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ API docs check failed${NC}"
    ((FAILED++))
fi

echo ""
echo "Results: ${GREEN}$PASSED passed${NC}, ${RED}$FAILED failed${NC}"

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All integration tests passed!${NC}"
    exit 0
else
    echo -e "${RED}❌ Some tests failed${NC}"
    exit 1
fi
