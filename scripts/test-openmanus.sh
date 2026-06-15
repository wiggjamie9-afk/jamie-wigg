#!/bin/bash

# OpenManus Test Suite (Bash version)
# Quick validation of OpenManus installation

set -e

OPENMANUS_DIR="${1:-.}"
VENV_DIR="$OPENMANUS_DIR/venv"
PYTHON="$VENV_DIR/bin/python"
PIP="$VENV_DIR/bin/pip"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

TESTS_PASSED=0
TESTS_FAILED=0

print_header() {
    echo ""
    echo "========================================"
    echo "  $1"
    echo "========================================"
    echo ""
}

print_test() {
    local test_name="$1"
    local passed="$2"
    local message="$3"

    if [ "$passed" = "true" ]; then
        echo -e "${GREEN}✓ PASS${NC}: $test_name"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}✗ FAIL${NC}: $test_name"
        if [ -n "$message" ]; then
            echo "       $message"
        fi
        ((TESTS_FAILED++))
    fi
}

# Test 1: Directory structure
print_header "Test 1: Directory Structure"

test_dir() {
    local dir="$1"
    if [ -d "$dir" ]; then
        print_test "Directory $dir exists" "true"
        return 0
    else
        print_test "Directory $dir exists" "false"
        return 1
    fi
}

test_dir "$OPENMANUS_DIR/app"
test_dir "$OPENMANUS_DIR/config"
test_dir "$VENV_DIR"

# Test 2: Virtual environment
print_header "Test 2: Virtual Environment"

if [ -f "$PYTHON" ]; then
    print_test "Python executable exists" "true"
else
    print_test "Python executable exists" "false"
fi

if [ -f "$PIP" ]; then
    print_test "Pip executable exists" "true"
else
    print_test "Pip executable exists" "false"
fi

# Test 3: Key dependencies
print_header "Test 3: Key Dependencies"

test_package() {
    local package="$1"
    if $PIP show "$package" > /dev/null 2>&1; then
        print_test "Package $package installed" "true"
        return 0
    else
        print_test "Package $package installed" "false"
        return 1
    fi
}

test_package "playwright"
test_package "browser-use"
test_package "pydantic"
test_package "anthropic"
test_package "torch"

# Test 4: Configuration
print_header "Test 4: Configuration Files"

if [ -f "$OPENMANUS_DIR/config/config.example.toml" ]; then
    print_test "Example config exists" "true"
else
    print_test "Example config exists" "false"
fi

if [ -f "$OPENMANUS_DIR/config/config.toml" ]; then
    print_test "Config file exists" "true"
else
    print_test "Config file exists" "false" "Run: cp config/config.example.toml config/config.toml"
fi

# Test 5: Module imports
print_header "Test 5: Module Imports"

test_import() {
    local module="$1"
    if $PYTHON -c "import $module" 2>/dev/null; then
        print_test "Module $module imports" "true"
        return 0
    else
        print_test "Module $module imports" "false"
        return 1
    fi
}

test_import "playwright"
test_import "pydantic"
test_import "requests"

# Test 6: Disk space
print_header "Test 6: Disk Space Usage"

if [ -d "$VENV_DIR" ]; then
    size=$(du -sh "$VENV_DIR" 2>/dev/null | cut -f1)
    print_test "Virtual environment size: $size" "true"
fi

# Test 7: Documentation
print_header "Test 7: Documentation Files"

test_doc() {
    local doc="$1"
    if [ -f "$doc" ]; then
        print_test "Documentation $(basename $doc) exists" "true"
        return 0
    else
        print_test "Documentation $(basename $doc) exists" "false"
        return 1
    fi
}

test_doc "/home/user/jamie-wigg/SETUP-OPENMANUS.md"
test_doc "/home/user/jamie-wigg/OPENMANUS-INTEGRATION-NOTES.md"
test_doc "/home/user/jamie-wigg/OPENMANUS-MCP-INTEGRATION.md"

# Test 8: Example configurations
print_header "Test 8: Example Configurations"

test_config() {
    local config="$1"
    if [ -f "/home/user/jamie-wigg/config/$config" ]; then
        print_test "Config example $config exists" "true"
        return 0
    else
        print_test "Config example $config exists" "false"
        return 1
    fi
}

test_config "openmanus-claude.toml"
test_config "openmanus-openai.toml"
test_config "openmanus-ollama.toml"
test_config "openmanus-azure.toml"

# Test 9: Environment variables
print_header "Test 9: Environment Variables"

if [ -z "$ANTHROPIC_API_KEY" ] && [ -z "$OPENAI_API_KEY" ]; then
    print_test "API key configured" "false" "Set: export ANTHROPIC_API_KEY=your_key"
else
    print_test "At least one API key configured" "true"
fi

# Summary
print_header "Test Summary"

TOTAL=$((TESTS_PASSED + TESTS_FAILED))
echo "Total Tests: $TOTAL"
echo "Passed: $TESTS_PASSED"
echo "Failed: $TESTS_FAILED"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed!${NC} OpenManus is ready to use."
    echo ""
    echo "Next steps:"
    echo "1. Set your API key: export ANTHROPIC_API_KEY=your_key"
    echo "2. Configure: cp config/config.example.toml config/config.toml"
    echo "3. Edit config with your API key"
    echo "4. Test: source venv/bin/activate"
    echo "         python main.py --prompt 'Hello'"
    exit 0
else
    echo -e "${RED}✗ $TESTS_FAILED test(s) failed.${NC} Review errors above."
    exit 1
fi
