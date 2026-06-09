#!/bin/bash
#
# Android SDK Installer for RHYTHMIX APK Building
# Downloads and sets up Android SDK with necessary components
#
# Usage: bash SETUP-ANDROID-SDK.sh
#

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo "Android SDK Setup for RHYTHMIX"
echo -e "${BLUE}========================================${NC}"
echo ""

# Configuration
SDK_INSTALL_PATH="$HOME/Android/Sdk"
CMDLINE_TOOLS_VERSION="10.0"

echo -e "${YELLOW}Note: This script prepares instructions for manual Android SDK setup.${NC}"
echo -e "${YELLOW}The Android SDK is large (~10GB) and requires manual download/installation.${NC}"
echo ""

# Check OS
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
  OS="linux"
  ARCH=$(uname -m)
  if [ "$ARCH" = "x86_64" ]; then
    ARCH="x86_64"
  fi
elif [[ "$OSTYPE" == "darwin"* ]]; then
  OS="macos"
  ARCH=$(uname -m)
else
  echo -e "${RED}Unsupported OS: $OSTYPE${NC}"
  exit 1
fi

echo -e "${BLUE}[i]${NC} Detected OS: $OS ($ARCH)"
echo ""

# Generate setup instructions
cat > "$HOME/.android_sdk_setup_instructions.txt" <<'EOF'
================================================================
Android SDK Manual Setup Instructions
================================================================

The Android SDK requires manual setup due to size and licensing.
Follow these steps:

OPTION 1: Use Android Studio (Recommended for UI development)
-----------------------------------------------------------
1. Download from: https://developer.android.com/studio
2. Extract and run: ./studio.sh
3. Follow wizard:
   - Install Android SDK (default location: ~/Android/Sdk)
   - Install SDK Platform for Android 35
   - Install Build Tools 35.0.0
   - Install Android Emulator (optional)

OPTION 2: Command-line tools only (Minimal, ~500MB)
---------------------------------------------------
1. Create SDK directory:
   mkdir -p ~/Android/Sdk

2. Download cmdline-tools from:
   https://developer.android.com/studio#cmdline-tools
   (Look for "Linux" link)

3. Extract to ~/Android/Sdk/cmdline-tools/latest/
   unzip cmdline-tools-linux-*.zip
   mv cmdline-tools/* ~/Android/Sdk/cmdline-tools/latest/

4. Add to ~/.bashrc (or ~/.zshrc):
   export ANDROID_SDK_ROOT=$HOME/Android/Sdk
   export ANDROID_HOME=$ANDROID_SDK_ROOT
   export PATH=$ANDROID_SDK_ROOT/cmdline-tools/latest/bin:$PATH
   export PATH=$ANDROID_SDK_ROOT/platform-tools:$PATH

5. Reload shell:
   source ~/.bashrc

6. Install required components:
   sdkmanager --sdk_root=$ANDROID_SDK_ROOT --install \
     "platforms;android-35" \
     "build-tools;35.0.0" \
     "platform-tools"

7. Accept licenses:
   sdkmanager --sdk_root=$ANDROID_SDK_ROOT --licenses

VERIFICATION
------------
After setup, run:
   /home/user/jamie-wigg/verify-android-env.sh

Should show:
   [✓] All requirements met!

Then build APKs:
   cd /home/user/jamie-wigg
   ./build-apks.sh --dry-run
   ./build-apks.sh

TROUBLESHOOTING
---------------
Issue: "cannot find sdkmanager"
Fix:   Add to PATH: export PATH=$ANDROID_SDK_ROOT/cmdline-tools/latest/bin:$PATH

Issue: "API level X not found"
Fix:   Install missing level: sdkmanager "platforms;android-35"

Issue: "build-tools version not found"
Fix:   Install missing version: sdkmanager "build-tools;35.0.0"

For more help:
   https://developer.android.com/studio/intro/update
   https://capacitorjs.com/docs/getting-started/environment-setup
================================================================
EOF

echo -e "${GREEN}Setup instructions saved to: $HOME/.android_sdk_setup_instructions.txt${NC}"
echo ""
echo "Next steps:"
echo "1. Read the instructions:"
echo -e "   ${BLUE}cat $HOME/.android_sdk_setup_instructions.txt${NC}"
echo ""
echo "2. Download and install Android SDK (Option 1 or 2)"
echo ""
echo "3. Verify setup:"
echo -e "   ${BLUE}/home/user/jamie-wigg/verify-android-env.sh${NC}"
echo ""
echo "4. Build APKs:"
echo -e "   ${BLUE}cd /home/user/jamie-wigg${NC}"
echo -e "   ${BLUE}./build-apks.sh${NC}"
echo ""
