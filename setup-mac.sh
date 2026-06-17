#!/bin/bash

# Auto-sync & setup script for Mac
# Run once: bash setup-mac.sh
# Or add to crontab for automatic runs on Mac startup

set -e

echo "════════════════════════════════════════════════════════════"
echo "🔄 Wellness Apps — Mac Auto-Sync Setup"
echo "════════════════════════════════════════════════════════════"

# Define repo path (adjust if different on your Mac)
REPO_PATH="$HOME/jamie-wigg"  # Change this to your actual repo path

if [ ! -d "$REPO_PATH" ]; then
  echo "❌ Repo not found at $REPO_PATH"
  echo "   Edit this script and set REPO_PATH to your actual repo location"
  exit 1
fi

cd "$REPO_PATH"
echo "📍 Working directory: $REPO_PATH"

# Step 1: Sync from remote branch
echo ""
echo "Step 1: Syncing from git..."
git fetch origin claude/session-01wjfhumnnmaa9p8eyjmhzsfw-006tP
git pull origin claude/session-01wjfhumnnmaa9p8eyjmhzsfw-006tP
echo "✅ Git sync complete"

# Step 2: Verify .env has credentials
echo ""
echo "Step 2: Checking credentials..."
if grep -q "REPLICATE_API_TOKEN=r8_" .env; then
  echo "✅ Replicate token found"
else
  echo "⚠️  Replicate token missing — add to .env"
fi

if grep -q "HIGGSFIELD_API_KEY=" .env; then
  echo "✅ Higgsfield credentials found"
else
  echo "⚠️  Higgsfield credentials missing — add to .env"
fi

# Step 3: Install npm dependencies
echo ""
echo "Step 3: Installing dependencies..."
npm install --prefix apps
echo "✅ Dependencies installed"

# Step 4: Verify all files
echo ""
echo "Step 4: Verifying app files..."
FOOD_COUNT=$(ls -1 apps/food-buddy-*.html 2>/dev/null | wc -l)
echo "✅ Found $FOOD_COUNT food apps"

if [ -f "apps/avatar-proxy-local.mjs" ]; then
  echo "✅ Avatar proxy ready"
else
  echo "❌ Avatar proxy missing"
  exit 1
fi

if [ -d "wellness-promo-30s" ]; then
  echo "✅ Promo video ready"
else
  echo "⚠️  Promo video folder not found"
fi

# Step 5: Ready message
echo ""
echo "════════════════════════════════════════════════════════════"
echo "✅ All files synced and ready!"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "To start the avatar proxy:"
echo "  cd $REPO_PATH"
echo "  node apps/avatar-proxy-local.mjs"
echo ""
echo "Then test on iPhone:"
echo "  1. Open any app → Settings"
echo "  2. Paste ElevenLabs key"
echo "  3. Tap 'Generate All Coach Faces'"
echo ""
