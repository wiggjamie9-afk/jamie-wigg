#!/bin/bash
#
# setup-antigravity-autoaccept.sh — guided setup for AntiGravity AutoAccept
#
# AntiGravity AutoAccept (by yazanbaker94) is an EXTENSION for Antigravity
# (Google's AI coding IDE). It auto-clicks Run / Accept / Allow so agent
# steps run without manual approval. It is installed *inside the IDE* as a
# .vsix — it is NOT a CLI tool, so this script can only guide + prepare the
# required debug-port launch. The .vsix install is a manual step in the IDE.
#
# ⚠️  SAFETY: this tool auto-approves terminal commands and file edits. That
#     removes the human check that normally stops a destructive command. If
#     you use it, IMMEDIATELY load its Safety Presets (Dashboard → 📊 → "Load
#     Recommended Safety Presets") so things like rm -rf, git push --force,
#     disk formatters and fork bombs are blocked from auto-running.
#
set -euo pipefail

echo "════════════════════════════════════════════════════════════"
echo "⚡ AntiGravity AutoAccept — guided setup"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "⚠️  This auto-approves terminal commands & file edits. Use the safety"
echo "    presets (step 4) before running unattended agents."
echo ""
echo "1) INSTALL THE EXTENSION (inside Antigravity, manual):"
echo "   • Download the latest .vsix from the project's GitHub Releases page"
echo "   • In Antigravity:  Ctrl/Cmd+Shift+P → 'Extensions: Install from VSIX'"
echo "   • Select the file → Reload Window"
echo ""
echo "2) LAUNCH ANTIGRAVITY WITH THE DEBUG PORT (required for it to click):"
case "$(uname -s)" in
  Darwin)
    echo '   macOS:'
    echo '   open -a Antigravity --args --remote-debugging-port=9333' ;;
  Linux)
    echo '   Linux:'
    echo '   antigravity --remote-debugging-port=9333' ;;
  *)
    echo '   Windows (PowerShell): add --remote-debugging-port=9333 to the'
    echo '   Antigravity shortcut target, or use the extension'"'"'s Auto-Fix Shortcut.' ;;
esac
echo "   (Port 9333 avoids a conflict with Antigravity'\''s own Browser Control on 9222.)"
echo ""
echo "3) TURN IT ON:  click '⚡ Auto: ON' in the status bar."
echo ""
echo "4) LOAD SAFETY PRESETS (do this!):  status bar 📊 → 'Load Recommended"
echo "   Safety Presets' to block destructive commands from auto-running."
echo ""
echo "This one can't be installed from a shell — the steps above are the"
echo "real install path. Nothing skipped: it's an IDE extension by design."
