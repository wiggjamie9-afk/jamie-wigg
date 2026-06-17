#!/bin/bash
#
# setup-9router.sh — installer for 9Router
#
# 9Router (https://github.com/decolua/9router) is an open-source (MIT) local
# LLM router: one endpoint, smart 3-tier fallback (subscription -> cheap ->
# free), quota tracking, and token saving. Runs on your machine; you supply
# your own provider keys. (OmniRoute is a feature-richer fork of this — you
# only need ONE of the two running.)
#
# Run on the machine where you code (your Mac):
#   bash scripts/setup-9router.sh
#
set -euo pipefail

echo "════════════════════════════════════════════════════════════"
echo "🔀 9Router — installer"
echo "════════════════════════════════════════════════════════════"

if ! command -v node >/dev/null 2>&1; then
  echo "❌ Node.js 20+ required — install from nodejs.org, then rerun."; exit 1
fi
echo "  ✅ node $(node --version)"

echo ""
echo "Installing 9Router globally (npm)..."
npm install -g 9router

echo ""
echo "════════════════════════════════════════════════════════════"
echo "✅ 9Router installed."
echo "════════════════════════════════════════════════════════════"
echo ""
echo "Start it:        9router"
echo "Dashboard:       http://localhost:20128"
echo "API endpoint:    http://localhost:20128/v1"
echo ""
echo "Note: 9Router and OmniRoute use the same port (20128) and do the same"
echo "job — run only one at a time."
echo ""
