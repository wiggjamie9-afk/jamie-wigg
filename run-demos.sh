#!/bin/bash

# OpenSandbox Demo Runner
# Runs all demo scripts sequentially

BOLD='\033[1m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BOLD}🎯 OpenSandbox Demo Runner${NC}\n"

# Check if server is running
echo -e "${BOLD}Checking OpenSandbox server...${NC}"
if ! curl -s http://localhost:8080/health > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠ Server not responding at localhost:8080${NC}"
    echo ""
    echo "Start the server in another terminal:"
    echo -e "  ${GREEN}opensandbox-server --config ~/.sandbox.toml${NC}"
    echo ""
    exit 1
fi
echo -e "${GREEN}✓ Server is running${NC}\n"

# List of demo scripts
declare -a DEMOS=(
    "opensandbox-examples.py:Three Essential Patterns"
    "opensandbox-full-workflow.py:Full Workflow (Write → Execute → Read)"
    "opensandbox-data-science.py:Data Science & Analysis"
    "opensandbox-demo.py:Comprehensive 5-Demo Suite"
    "opensandbox-code-interpreter.py:Code Interpreter SDK"
    "opensandbox-advanced-workflow.py:Advanced Workflows"
)

echo -e "${BOLD}Available demos:${NC}"
for i in "${!DEMOS[@]}"; do
    IFS=':' read -r script desc <<< "${DEMOS[$i]}"
    echo "  $((i+1)). $desc"
    echo "     ($script)"
done

echo ""
echo -e "${BOLD}Options:${NC}"
echo "  Run specific demo:     ${GREEN}./run-demos.sh 1${NC}"
echo "  Run all demos:         ${GREEN}./run-demos.sh all${NC}"
echo "  Just list demos:       ${GREEN}./run-demos.sh list${NC}"
echo ""

# Parse arguments
if [ $# -eq 0 ]; then
    echo -e "${BLUE}Running: opensandbox-examples.py (default)${NC}\n"
    python3 opensandbox-examples.py
    exit $?
fi

case "$1" in
    list)
        echo "Demo scripts available for running"
        exit 0
        ;;
    all)
        echo -e "${BOLD}Running ALL demos...${NC}\n"
        for demo in "${DEMOS[@]}"; do
            IFS=':' read -r script desc <<< "$demo"
            if [ ! -f "$script" ]; then
                echo -e "${YELLOW}⚠ Skipping $script (not found)${NC}"
                continue
            fi
            echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
            echo -e "${BLUE}Running: $desc${NC}"
            echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
            python3 "$script" || echo -e "${YELLOW}⚠ Demo failed${NC}"
            echo ""
            sleep 1
        done
        echo -e "${GREEN}✓ All demos completed${NC}\n"
        ;;
    [0-9])
        # Convert to 0-indexed
        idx=$((($1 - 1)))
        if [ $idx -lt ${#DEMOS[@]} ] && [ $idx -ge 0 ]; then
            IFS=':' read -r script desc <<< "${DEMOS[$idx]}"
            if [ -f "$script" ]; then
                echo -e "${BLUE}Running: $desc${NC}\n"
                python3 "$script"
            else
                echo -e "${YELLOW}Script not found: $script${NC}"
                exit 1
            fi
        else
            echo -e "${YELLOW}Invalid demo number: $1${NC}"
            exit 1
        fi
        ;;
    *)
        echo -e "${YELLOW}Unknown option: $1${NC}"
        echo "Usage: ./run-demos.sh [1-6|all|list]"
        exit 1
        ;;
esac
