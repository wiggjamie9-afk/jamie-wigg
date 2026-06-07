#!/bin/bash

echo "=== System Verification ==="
echo ""

# Check Go binary
if [ -x freebuff2api/freebuff2api ]; then
  echo "✓ freebuff2api binary built and ready"
else
  echo "✗ freebuff2api binary not found"
fi

# Check Node dependencies
if [ -d node_modules ]; then
  echo "✓ Root dependencies installed"
else
  echo "✗ Root dependencies missing"
fi

if [ -f freebuff2api-video/package.json ]; then
  echo "✓ freebuff2api-video configured (uses HyperFrames via npx)"
else
  echo "✗ freebuff2api-video package.json missing"
fi

if [ -d 9router/node_modules ]; then
  echo "✓ 9router dependencies installed"
else
  echo "✗ 9router dependencies missing"
fi

# Check configuration files
if [ -f .env ]; then
  echo "✓ .env configuration file exists"
else
  echo "✗ .env configuration file missing"
fi

if [ -f freebuff2api/config.json ]; then
  echo "✓ freebuff2api config.json exists"
else
  echo "✗ freebuff2api config.json missing"
fi

# Check key service files
echo ""
echo "=== Service Files ==="
echo "Chatbot files:"
ls -1 freebuff2api/chatbot*.html 2>/dev/null
echo ""
echo "Video composition:"
ls -1 freebuff2api-video/index.html 2>/dev/null
echo ""

echo "=== Ready to Start ==="
echo "Run: ./START-ALL.sh"
echo ""
