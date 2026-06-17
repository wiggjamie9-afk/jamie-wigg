#!/bin/bash
#
# setup-openmontage.sh — one-command installer for OpenMontage
#
# OpenMontage (https://github.com/calesthio/OpenMontage) is an open-source,
# agent-operated video production studio. It is driven by an AI coding
# assistant (Claude Code, Cursor, etc.) and uses HyperFrames + Remotion —
# the same renderers this repo already uses for RHYTHMIX promos.
#
# This script clones OpenMontage NEXT TO this repo (not inside it — it's
# AGPLv3 and has its own git history) and runs its setup.
#
# Run it on the machine where you'll actually make videos (your Mac):
#   bash scripts/setup-openmontage.sh
#
set -euo pipefail

CLONE_DIR="${OPENMONTAGE_DIR:-$HOME/OpenMontage}"
REPO_URL="https://github.com/calesthio/OpenMontage.git"

echo "════════════════════════════════════════════════════════════"
echo "🎬 OpenMontage — installer"
echo "════════════════════════════════════════════════════════════"

# ── Prerequisite checks ─────────────────────────────────────────
need() { command -v "$1" >/dev/null 2>&1; }

echo ""
echo "Checking prerequisites..."
missing=0

if need python3; then echo "  ✅ python3 ($(python3 --version 2>&1))"; else echo "  ❌ python3 (need 3.10+) — install from python.org"; missing=1; fi
if need node;    then echo "  ✅ node ($(node --version 2>&1))";       else echo "  ❌ node (need 18+) — install from nodejs.org";    missing=1; fi
if need ffmpeg;  then echo "  ✅ ffmpeg";                               else echo "  ❌ ffmpeg — 'brew install ffmpeg'";              missing=1; fi
if need git;     then echo "  ✅ git";                                  else echo "  ❌ git";                                          missing=1; fi

if [ "$missing" -ne 0 ]; then
  echo ""
  echo "⚠️  Install the missing tools above, then run this script again."
  exit 1
fi

# ── Clone (or update) ───────────────────────────────────────────
echo ""
if [ -d "$CLONE_DIR/.git" ]; then
  echo "OpenMontage already at $CLONE_DIR — updating..."
  git -C "$CLONE_DIR" pull --ff-only || echo "  (skipped update; local changes present)"
else
  echo "Cloning OpenMontage to $CLONE_DIR ..."
  git clone "$REPO_URL" "$CLONE_DIR"
fi

# ── Setup ───────────────────────────────────────────────────────
echo ""
echo "Running OpenMontage setup (Python deps + Remotion composer)..."
cd "$CLONE_DIR"
if need make; then
  make setup
else
  echo "  'make' not found — running manual setup..."
  pip install -r requirements.txt
  ( cd remotion-composer && npm install )
  pip install piper-tts
  [ -f .env ] || cp .env.example .env
fi

echo ""
echo "════════════════════════════════════════════════════════════"
echo "✅ OpenMontage installed at: $CLONE_DIR"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "It works with ZERO API keys (Piper TTS narration, free stock/archive"
echo "footage, Remotion + HyperFrames rendering). Add keys later in"
echo "$CLONE_DIR/.env to unlock more providers."
echo ""
echo "To make a video:"
echo "  1. Open $CLONE_DIR in your AI coding assistant (Claude Code, etc.)"
echo "  2. Say, e.g.:  \"Make a 45-second animated explainer about why the sky is blue\""
echo "  3. Or for RHYTHMIX promos, point it at this repo's brand:"
echo "     rhythmix-teaser-60s/DESIGN.md"
echo ""
echo "Zero-key demo videos:  cd $CLONE_DIR && make demo"
echo ""
