#!/bin/bash
#
# Android Build Environment Verification
# Checks all prerequisites for APK building
#

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

check_success() {
  echo -e "${GREEN}[✓]${NC} $1"
}

check_warning() {
  echo -e "${YELLOW}[!]${NC} $1"
}

check_error() {
  echo -e "${RED}[✗]${NC} $1"
}

check_info() {
  echo -e "${BLUE}[i]${NC} $1"
}

echo ""
echo "========================================"
echo "Android Build Environment Verification"
echo "========================================"
echo ""

MISSING_DEPS=0

# Check Java
check_info "Checking Java..."
if command -v java &> /dev/null; then
  JAVA_VERSION=$(java -version 2>&1 | grep version | cut -d'"' -f2 | cut -d'.' -f1)
  JAVA_FULL=$(java -version 2>&1 | head -1)
  if [ "$JAVA_VERSION" -ge 11 ]; then
    check_success "Java $JAVA_FULL"
  else
    check_error "Java version too old (need 11+, have $JAVA_VERSION)"
    MISSING_DEPS=$((MISSING_DEPS + 1))
  fi
else
  check_error "Java not found (OpenJDK 11+ required)"
  MISSING_DEPS=$((MISSING_DEPS + 1))
fi

# Check Node.js
check_info "Checking Node.js..."
if command -v node &> /dev/null; then
  NODE_VERSION=$(node --version)
  NODE_MAJOR=$(echo "$NODE_VERSION" | cut -d'v' -f2 | cut -d'.' -f1)
  if [ "$NODE_MAJOR" -ge 20 ]; then
    check_success "Node.js $NODE_VERSION"
  else
    check_warning "Node.js $NODE_VERSION (recommend 20+)"
  fi
else
  check_error "Node.js not found"
  MISSING_DEPS=$((MISSING_DEPS + 1))
fi

# Check npm
check_info "Checking npm..."
if command -v npm &> /dev/null; then
  NPM_VERSION=$(npm --version)
  check_success "npm $NPM_VERSION"
else
  check_error "npm not found"
  MISSING_DEPS=$((MISSING_DEPS + 1))
fi

# Check npx
check_info "Checking npx..."
if command -v npx &> /dev/null; then
  check_success "npx installed"
else
  check_error "npx not found"
  MISSING_DEPS=$((MISSING_DEPS + 1))
fi

# Check keytool (for signing)
check_info "Checking keytool..."
if command -v keytool &> /dev/null; then
  check_success "keytool (signing) available"
else
  check_error "keytool not found (signing will fail)"
  MISSING_DEPS=$((MISSING_DEPS + 1))
fi

# Check jarsigner (for signing)
check_info "Checking jarsigner..."
if command -v jarsigner &> /dev/null; then
  check_success "jarsigner (APK signing) available"
else
  check_error "jarsigner not found (signing will fail)"
  MISSING_DEPS=$((MISSING_DEPS + 1))
fi

# Check Android SDK
echo ""
check_info "Checking Android SDK..."
if [ -n "$ANDROID_SDK_ROOT" ]; then
  if [ -d "$ANDROID_SDK_ROOT" ]; then
    check_success "ANDROID_SDK_ROOT set to: $ANDROID_SDK_ROOT"

    # Check build-tools
    if [ -d "$ANDROID_SDK_ROOT/build-tools" ]; then
      BUILD_TOOLS=$(ls -1 "$ANDROID_SDK_ROOT/build-tools/" | head -1)
      check_success "Build tools found: $BUILD_TOOLS"
    else
      check_error "Build tools not found in $ANDROID_SDK_ROOT/build-tools/"
      MISSING_DEPS=$((MISSING_DEPS + 1))
    fi

    # Check platforms
    if [ -d "$ANDROID_SDK_ROOT/platforms" ]; then
      PLATFORMS=$(ls -1 "$ANDROID_SDK_ROOT/platforms/" | wc -l)
      check_success "Android SDK platforms: $PLATFORMS installed"
    else
      check_error "Android SDK platforms not found"
      MISSING_DEPS=$((MISSING_DEPS + 1))
    fi

    # Check cmdline-tools
    if [ -d "$ANDROID_SDK_ROOT/cmdline-tools" ]; then
      check_success "Command-line tools found"
    else
      check_warning "Command-line tools not found (optional)"
    fi
  else
    check_error "ANDROID_SDK_ROOT points to non-existent directory"
    MISSING_DEPS=$((MISSING_DEPS + 1))
  fi
else
  check_error "ANDROID_SDK_ROOT not set"
  echo "  Set it with: export ANDROID_SDK_ROOT=\$HOME/Android/Sdk"
  MISSING_DEPS=$((MISSING_DEPS + 1))
fi

# Check repository files
echo ""
check_info "Checking RHYTHMIX repository..."
if [ -d "/home/user/jamie-wigg/apps" ]; then
  APP_COUNT=$(find /home/user/jamie-wigg/apps -maxdepth 1 -name "*.html" -type f | wc -l)
  check_success "Found $APP_COUNT app files in /home/user/jamie-wigg/apps/"
else
  check_error "Repository not found at /home/user/jamie-wigg"
  MISSING_DEPS=$((MISSING_DEPS + 1))
fi

if [ -f "/home/user/jamie-wigg/build-apks.sh" ]; then
  check_success "Build script found: /home/user/jamie-wigg/build-apks.sh"
else
  check_error "Build script not found"
  MISSING_DEPS=$((MISSING_DEPS + 1))
fi

# Check disk space
echo ""
check_info "Checking disk space..."
DISK_FREE=$(df -h /home/user/jamie-wigg | awk 'NR==2 {print $4}')
DISK_PERCENT=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ "$DISK_PERCENT" -lt 90 ]; then
  check_success "Disk space available: $DISK_FREE (~${DISK_PERCENT}% used)"
else
  check_error "Disk space low: ${DISK_PERCENT}% used (need <90%)"
  MISSING_DEPS=$((MISSING_DEPS + 1))
fi

# Summary
echo ""
echo "========================================"
if [ $MISSING_DEPS -eq 0 ]; then
  echo -e "${GREEN}[✓] All requirements met!${NC}"
  echo ""
  echo "You can now run:"
  echo "  cd /home/user/jamie-wigg"
  echo "  ./build-apks.sh --dry-run    # Test without building"
  echo "  ./build-apks.sh              # Build all 28 apps"
  echo "  ./build-apks.sh --only budget-tracker  # Build one app"
  echo ""
  exit 0
else
  echo -e "${RED}[✗] $MISSING_DEPS missing/invalid dependencies${NC}"
  echo ""
  echo "Next steps:"
  echo "1. Install Android SDK from: https://developer.android.com/studio"
  echo "2. Set ANDROID_SDK_ROOT environment variable"
  echo "3. Run this script again to verify"
  echo ""
  exit 1
fi
