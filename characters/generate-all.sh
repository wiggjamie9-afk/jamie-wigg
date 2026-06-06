#!/bin/bash

# SURGE Character Generation Script
# Generates all 6 characters using FLUX 1.1 Pro on Replicate

if [ -z "$REPLICATE_API_TOKEN" ]; then
  echo "❌ Error: REPLICATE_API_TOKEN not set"
  echo "Set it with: export REPLICATE_API_TOKEN=your_token_here"
  exit 1
fi

CHARACTERS=("ziggy" "echo" "mira" "ms-chen" "jordan" "kai")

echo "🎨 SURGE Character Generation"
echo "════════════════════════════════════════"
echo "Generating 6 professional character designs..."
echo ""

for char in "${CHARACTERS[@]}"; do
  if [ -f "generate-${char}.sh" ]; then
    echo "⚡ Generating $char..."
    chmod +x "generate-${char}.sh"
    "./generate-${char}.sh"
    echo ""
  else
    echo "⚠️  Script not found: generate-${char}.sh"
  fi
done

echo "════════════════════════════════════════"
echo "✅ Character generation complete!"
ls -lh *-illustrated.png 2>/dev/null || echo "No images found"
