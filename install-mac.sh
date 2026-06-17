#!/bin/bash

# Complete Mac Setup — Clone + Install + Configure
# Run once: bash install-mac.sh

set -e

echo "════════════════════════════════════════════════════════════"
echo "🔧 Wellness Apps — Complete Mac Installation"
echo "════════════════════════════════════════════════════════════"

# Step 1: Clone repo
echo ""
echo "Step 1: Cloning repository..."
cd ~
if [ -d "jamie-wigg" ]; then
  echo "⚠️  Repo already exists at ~/jamie-wigg"
  read -p "Delete and reinstall? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    rm -rf jamie-wigg
  else
    echo "Using existing directory"
  fi
fi

if [ ! -d "jamie-wigg" ]; then
  git clone https://github.com/wiggjamie9-afk/jamie-wigg.git
fi

cd jamie-wigg
echo "✅ Repo cloned"

# Step 2: Checkout branch
echo ""
echo "Step 2: Switching to your branch..."
git fetch origin claude/session-01wjfhumnnmaa9p8eyjmhzsfw-006tP
git checkout claude/session-01wjfhumnnmaa9p8eyjmhzsfw-006tP
echo "✅ Branch switched"

# Step 3: Create .env with credentials
echo ""
echo "Step 3: Setting up credentials..."
echo "Enter your API credentials (from your iPhone setup):"
echo ""

read -p "Replicate token (r8_...): " REPLICATE_TOKEN
read -sp "ElevenLabs API key (sk_...): " ELEVEN_LABS_KEY
echo ""
read -p "Higgsfield API key: " HIGGSFIELD_API_KEY
read -sp "Higgsfield secret: " HIGGSFIELD_SECRET
echo ""

# Create .env file
cat > .env << EOF
REPLICATE_API_TOKEN=$REPLICATE_TOKEN
ELEVENLABS_API_KEY=$ELEVEN_LABS_KEY
HIGGSFIELD_API_KEY=$HIGGSFIELD_API_KEY
HIGGSFIELD_SECRET=$HIGGSFIELD_SECRET
EOF

echo "✅ Credentials saved to .env"

# Step 4: Install dependencies
echo ""
echo "Step 4: Installing npm dependencies..."
npm install --prefix apps
echo "✅ Dependencies installed"

# Step 5: Verify setup
echo ""
echo "Step 5: Verifying setup..."

if [ -f ".env" ]; then
  echo "✅ .env file created"
fi

FOOD_COUNT=$(ls -1 apps/food-buddy-*.html 2>/dev/null | wc -l)
echo "✅ Found $FOOD_COUNT food apps"

if [ -f "apps/avatar-proxy-local.mjs" ]; then
  echo "✅ Avatar proxy ready"
fi

if [ -d "wellness-promo-30s" ]; then
  echo "✅ Promo video included"
fi

# Step 6: Ready!
echo ""
echo "════════════════════════════════════════════════════════════"
echo "✅ Installation Complete!"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "📍 Repo location: ~/jamie-wigg"
echo ""
echo "To start the avatar proxy:"
echo "  cd ~/jamie-wigg"
echo "  node apps/avatar-proxy-local.mjs"
echo ""
echo "Then open your iPhone and test:"
echo "  1. Open any app → Settings"
echo "  2. Tap 'Generate All Coach Faces'"
echo "  3. Watch animated coaches appear!"
echo ""
