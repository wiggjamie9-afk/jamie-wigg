#!/bin/bash

# Session startup health check

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎯 PRIMARY GOAL — NON-NEGOTIABLE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Ship one flagship app to Google Play + Apple App Store."
echo "Stop. No other work until this is done."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🚀 Jamie Wigg Workspace - Session Started"
echo ""
echo "📁 Projects:"
ls -d */ 2>/dev/null | grep -E "agent-builder|mhdbdb|cpp-hopl4|specs|sites" | head -10
echo ""
echo "🔗 Branch:"
git branch --show-current 2>/dev/null || echo "Not a git repo"
echo ""
echo "✅ Ready to work! Try:"
echo "   /spec-quick my feature"
echo "   /dream an image"
echo "   cd agent-builder && npm run dev"
