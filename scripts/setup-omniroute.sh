#!/bin/bash
#
# setup-omniroute.sh — installer for OmniRoute
#
# OmniRoute (https://github.com/diegosouzapw/OmniRoute) is an open-source (MIT)
# local LLM router: one endpoint, 226 providers, auto-fallback across
# subscription -> API -> cheap -> free tiers, plus token compression.
# Runs 100% on your machine; you supply your own provider keys.
#
# Run on the machine where you code (your Mac):
#   bash scripts/setup-omniroute.sh
#
set -euo pipefail

echo "════════════════════════════════════════════════════════════"
echo "🌐 OmniRoute — installer"
echo "════════════════════════════════════════════════════════════"

if ! command -v node >/dev/null 2>&1; then
  echo "❌ Node.js 22+ required — install from nodejs.org, then rerun."; exit 1
fi
if ! command -v npm >/dev/null 2>&1; then
  echo "❌ npm required (ships with Node)."; exit 1
fi
echo "  ✅ node $(node --version)"

echo ""
echo "Installing OmniRoute globally (npm)..."
npm install -g omniroute

echo ""
echo "════════════════════════════════════════════════════════════"
echo "✅ OmniRoute installed."
echo "════════════════════════════════════════════════════════════"
echo ""
echo "Start it:        omniroute"
echo "Dashboard:       http://localhost:20128"
echo "API endpoint:    http://localhost:20128/v1"
echo ""
echo "Then in the dashboard → Providers, connect a FREE provider"
echo "(Kiro, OpenCode Free, Pollinations...) and point your CLI tool at"
echo "the endpoint above with model 'auto'."
echo ""
echo "⚠️  This is a LOCALHOST service — it only answers on this Mac."
echo "   Your iPhone/web apps cannot reach localhost:20128. To use it"
echo "   from your phone you'd have to deploy it to a public HTTPS URL"
echo "   (see OmniRoute's Docker / Fly.io / VM deployment guides)."
echo ""
