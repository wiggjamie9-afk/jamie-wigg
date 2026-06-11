#!/bin/bash

# System Setup Script for Jamie Wigg
# Verifies and installs required system tools

set -e

echo "🔧 Checking system dependencies..."
echo ""

# Node.js
echo "📦 Node.js:"
if command -v node &> /dev/null; then
  NODE_VERSION=$(node -v)
  echo "✓ Installed: $NODE_VERSION"
  if [[ $(node -v | cut -d'v' -f2 | cut -d'.' -f1) -lt 20 ]]; then
    echo "⚠️  Warning: Node 20+ recommended (you have $NODE_VERSION)"
  fi
else
  echo "✗ NOT installed - Download from https://nodejs.org (v20+)"
fi

# pnpm
echo ""
echo "📦 pnpm:"
if command -v pnpm &> /dev/null; then
  PNPM_VERSION=$(pnpm -v)
  echo "✓ Installed: v$PNPM_VERSION"
else
  echo "✗ NOT installed - Run: npm install -g pnpm"
fi

# ffmpeg
echo ""
echo "🎬 ffmpeg:"
if command -v ffmpeg &> /dev/null; then
  FFMPEG_VERSION=$(ffmpeg -version | head -1)
  echo "✓ Installed: $FFMPEG_VERSION"
else
  echo "✗ NOT installed"
  if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "  macOS: brew install ffmpeg"
  elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "  Linux: sudo apt-get install ffmpeg"
  fi
fi

# Git
echo ""
echo "🔗 Git:"
if command -v git &> /dev/null; then
  GIT_VERSION=$(git --version)
  echo "✓ Installed: $GIT_VERSION"
else
  echo "✗ NOT installed - Download from https://git-scm.com"
fi

# TypeScript
echo ""
echo "📘 TypeScript:"
if command -v tsc &> /dev/null; then
  TSC_VERSION=$(tsc --version)
  echo "✓ Installed: $TSC_VERSION"
else
  echo "✗ NOT installed - Run: npm install -g typescript"
fi

# Supabase CLI
echo ""
echo "🗄️  Supabase CLI:"
if command -v supabase &> /dev/null; then
  SUPABASE_VERSION=$(supabase --version)
  echo "✓ Installed: $SUPABASE_VERSION"
else
  echo "✗ NOT installed - Run: npm install -g supabase"
fi

echo ""
echo "✅ System check complete!"
echo ""
echo "Next steps:"
echo "1. Install any missing tools (see above)"
echo "2. Run: npm install (in agent-builder/)"
echo "3. Run: npm install (in mhdbdb-tei-only/)"
echo "4. Fill in .env file with API keys"
echo "5. Run: npm run dev"
