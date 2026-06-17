#!/bin/bash
#
# setup-free-claude-code.sh — installer for Free Claude Code (FCC)
#
# Free Claude Code (https://github.com/Alishahryar1/free-claude-code) is an
# open-source (MIT) LOCAL proxy that lets the Claude Code / Codex CLIs run
# against many providers (NVIDIA NIM, OpenRouter, Gemini, DeepSeek, Mistral,
# free tiers, local Ollama/LM Studio...). You supply your own provider keys
# in its Admin UI.
#
# SAFER PATTERN: the upstream README runs `curl ... | sh` (pipes an unseen
# script straight into your shell). This script instead DOWNLOADS the
# installer to a file first so you can read it, then runs it. Review the
# file when prompted before continuing.
#
# Run on the machine where you code (your Mac):
#   bash scripts/setup-free-claude-code.sh
#
set -euo pipefail

INSTALLER_URL="https://raw.githubusercontent.com/Alishahryar1/free-claude-code/main/scripts/install.sh"
TMP="$(mktemp -t fcc-install.XXXXXX.sh)"

echo "════════════════════════════════════════════════════════════"
echo "🟣 Free Claude Code — installer (download-then-review)"
echo "════════════════════════════════════════════════════════════"

if ! command -v curl >/dev/null 2>&1; then echo "❌ curl required."; exit 1; fi
if ! command -v npm  >/dev/null 2>&1; then echo "❌ npm/Node required (nodejs.org)."; exit 1; fi

echo ""
echo "Downloading installer to: $TMP"
curl -fsSL "$INSTALLER_URL" -o "$TMP"

echo ""
echo "──────── First 40 lines of the installer (review it) ────────"
head -40 "$TMP"
echo "──────────────────────────────────────────────────────────────"
echo ""
read -r -p "Run this installer now? [y/N] " ans
case "$ans" in
  [Yy]*) echo "Running..."; sh "$TMP" ;;
  *)     echo "Skipped. The script is saved at $TMP if you want to inspect it fully."; exit 0 ;;
esac

echo ""
echo "✅ Done. Start the proxy:   fcc-server"
echo "   Run Claude Code via it:  fcc-claude"
echo "   Run Codex via it:        fcc-codex"
echo "   Admin UI is local-only (127.0.0.1)."
echo ""
echo "⚠️  Keys you paste into its Admin UI flow through this proxy. Use keys"
echo "   you're comfortable routing locally; don't reuse highly sensitive ones."
