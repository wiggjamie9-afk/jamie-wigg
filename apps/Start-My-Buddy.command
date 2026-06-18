#!/bin/bash
#
# Start-My-Buddy.command  —  double-click this on your Mac in the morning.
#
# What it does, honestly and in order:
#   1. Makes sure Ollama (local AI runtime) is installed.
#   2. Starts the local model server so the browser can reach it.
#   3. Pulls your model the first time (one-time download; instant after).
#   4. Opens your private buddy. It runs entirely on your Mac. Offline. No key.
#
# Nothing in here sends your data anywhere. You can read every line.

# --- settings you can change ---
MODEL="llama3.2"                         # try qwen2.5:7b or llama3.3 once happy
APP_FILE="generated/calm-local.html"     # the buddy to open
# --------------------------------

set -u
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_PATH="$SCRIPT_DIR/$APP_FILE"

echo ""
echo "  🌙  Starting your private buddy..."
echo "  ----------------------------------"

# 1. Ensure Ollama is installed -------------------------------------------------
if ! command -v ollama >/dev/null 2>&1; then
  echo "  • Ollama isn't installed yet."
  if command -v brew >/dev/null 2>&1; then
    echo "    Installing via Homebrew (one time)..."
    brew install ollama
  else
    echo "    Opening the Ollama download page — install it, then run this again."
    open "https://ollama.com/download"
    echo ""
    echo "  Press any key to close."
    read -n 1 -s
    exit 0
  fi
fi

# 2. Start the local server with browser access allowed -------------------------
# file:// pages send a "null" origin, so we allow all origins for localhost.
export OLLAMA_ORIGINS="*"

if curl -s http://localhost:11434/api/tags >/dev/null 2>&1; then
  echo "  • Local AI server already running."
else
  echo "  • Starting local AI server..."
  # Stop any server started without browser-access, then start ours.
  pkill -x ollama >/dev/null 2>&1
  sleep 1
  OLLAMA_ORIGINS="*" nohup ollama serve >"$SCRIPT_DIR/ollama.log" 2>&1 &
  # wait up to ~20s for it to come up
  for i in $(seq 1 20); do
    if curl -s http://localhost:11434/api/tags >/dev/null 2>&1; then break; fi
    sleep 1
  done
fi

# 3. Make sure the model is present (first run downloads it) ---------------------
if ollama list 2>/dev/null | grep -q "^${MODEL}"; then
  echo "  • Model '$MODEL' ready."
else
  echo "  • Downloading model '$MODEL' (one-time, may take a few minutes)..."
  ollama pull "$MODEL"
fi

# 4. Open the buddy -------------------------------------------------------------
if [ -f "$APP_PATH" ]; then
  echo "  • Opening your buddy. Enjoy — it's all running on your Mac."
  open "$APP_PATH"
else
  echo "  ✗ Could not find $APP_PATH"
  echo "    (Generate one with: node buddy-generator.js spec.json $APP_FILE)"
fi

echo ""
echo "  Tip: turn off wifi — it still works. Nothing leaves this machine."
echo ""
