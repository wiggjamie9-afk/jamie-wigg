#!/usr/bin/env bash
#
# setup-mac-creative-pipeline.sh
# One-command setup of the RHYTHMIX creative / animation pipeline on a Mac.
#
# What it installs (all free, no GPU required for the core path):
#   - Homebrew (if missing)        package manager
#   - ffmpeg                       core video encode/decode — render + post-process
#   - Python venv (.venv-creative) isolated env so we never touch system Python
#   - moviepy >= 2.0               programmatic editing: stitch Cuts, captions, GIFs, reframe
#   - kokoro-tts                   local narration TTS for HyperFrames
#   - HyperFrames CLI check        runs via npx (no global install needed)
#   - .env / settings.local.json   scaffolded from the .example files (you paste keys)
#
# Idempotent: safe to re-run. Nothing here needs an API key — key-gated tools
# (Higgsfield, Replicate) are scaffolded but you fill the secrets in yourself.
#
# Usage:
#   bash scripts/setup-mac-creative-pipeline.sh
#
set -euo pipefail

# Resolve repo root (this script lives in <repo>/scripts/)
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

bold() { printf "\033[1m%s\033[0m\n" "$1"; }
ok()   { printf "  \033[32m✓\033[0m %s\n" "$1"; }
warn() { printf "  \033[33m!\033[0m %s\n" "$1"; }
step() { printf "\n\033[1m▸ %s\033[0m\n" "$1"; }

bold "RHYTHMIX creative pipeline — Mac setup"
echo "Repo: $REPO_ROOT"

# ── 0. Sanity: this is meant for macOS ────────────────────────────────────────
if [[ "$(uname -s)" != "Darwin" ]]; then
  warn "This script targets macOS. On Linux, use apt (ffmpeg) + pip (moviepy) instead."
fi

ARCH="$(uname -m)"   # arm64 = Apple Silicon, x86_64 = Intel

# ── 1. Homebrew ───────────────────────────────────────────────────────────────
step "Homebrew"
if command -v brew >/dev/null 2>&1; then
  ok "brew already installed ($(brew --version | head -1))"
else
  warn "Installing Homebrew (will prompt for your password)…"
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  # Make brew available on Apple Silicon for the rest of this run
  [[ -x /opt/homebrew/bin/brew ]] && eval "$(/opt/homebrew/bin/brew shellenv)"
  ok "Homebrew installed"
fi

# ── 2. ffmpeg ─────────────────────────────────────────────────────────────────
step "ffmpeg"
if command -v ffmpeg >/dev/null 2>&1; then
  ok "ffmpeg present ($(ffmpeg -version | head -1 | cut -d' ' -f1-3))"
else
  brew install ffmpeg
  ok "ffmpeg installed"
fi

# ── 3. Node (for HyperFrames CLI via npx) ─────────────────────────────────────
step "Node.js (HyperFrames CLI runs via npx)"
if command -v node >/dev/null 2>&1; then
  ok "node $(node --version)"
else
  brew install node
  ok "node installed ($(node --version))"
fi
echo "  Checking HyperFrames CLI is reachable (downloads on first use)…"
if npx --yes hyperframes@0.4.42 --version >/dev/null 2>&1; then
  ok "HyperFrames CLI reachable ($(npx --yes hyperframes@0.4.42 --version 2>/dev/null | tail -1))"
else
  warn "HyperFrames CLI not reachable yet — re-run after network is available."
fi

# ── 4. Python venv + creative deps ────────────────────────────────────────────
step "Python venv + moviepy + kokoro-tts"
PYBIN="$(command -v python3 || true)"
if [[ -z "$PYBIN" ]]; then
  brew install python@3.12
  PYBIN="$(command -v python3)"
fi
ok "python: $($PYBIN --version)"

VENV="$REPO_ROOT/.venv-creative"
if [[ ! -d "$VENV" ]]; then
  "$PYBIN" -m venv "$VENV"
  ok "created venv at .venv-creative"
fi
# shellcheck disable=SC1091
source "$VENV/bin/activate"
pip install --quiet --upgrade pip
pip install --quiet -r "$REPO_ROOT/requirements-creative.txt"
ok "installed: $(python -c 'import moviepy; print("moviepy "+moviepy.__version__)' 2>/dev/null || echo 'moviepy ?')"

# ── 5. Scaffold secrets files (never overwrite existing) ──────────────────────
step "Secrets scaffolding (you paste the keys)"
if [[ -f .env ]]; then
  ok ".env already exists — leaving it alone"
elif [[ -f .env.example ]]; then
  cp .env.example .env
  ok "created .env from .env.example — open it and paste your keys"
else
  warn ".env.example not found; skipping .env"
fi

if [[ -f .claude/settings.local.json ]]; then
  ok ".claude/settings.local.json already exists — leaving it alone"
elif [[ -f .claude/settings.local.json.example ]]; then
  cp .claude/settings.local.json.example .claude/settings.local.json
  ok "created .claude/settings.local.json — paste your Replicate token"
else
  warn ".claude/settings.local.json.example not found; skipping"
fi

# ── 6. Functional proof: render a real MP4 ────────────────────────────────────
step "Verifying the render path actually works"
TESTDIR="$(mktemp -d)"
python - "$TESTDIR" <<'PY'
import sys
from moviepy import ColorClip
out = sys.argv[1] + "/_render_test.mp4"
ColorClip(size=(320,180), color=(124,58,237), duration=1).write_videofile(out, fps=24, logger=None)
print(out)
PY
if [[ -s "$TESTDIR/_render_test.mp4" ]]; then
  ok "moviepy + ffmpeg produced a valid MP4 — pipeline is live"
  rm -rf "$TESTDIR"
else
  warn "Render test did not produce a file — check ffmpeg install"
fi

# ── 7. Summary ────────────────────────────────────────────────────────────────
cat <<EOF

$(bold "✅ Ready to use right now (no keys needed):")
  • HyperFrames render path   →  cd <cut-folder> && npx --yes hyperframes@0.4.42 render
  • MoviePy post-processing    →  source .venv-creative/bin/activate  (stitch/caption/GIF/reframe)
  • Kokoro TTS narration       →  npx --yes hyperframes@0.4.42 tts

$(bold "🔑 Add keys to switch these on:")
  • .env                       →  HIGGSFIELD_API_KEY/SECRET (AI video/image/avatars), REPLICATE_API_TOKEN, ELEVENLABS_API_KEY
  • .claude/settings.local.json →  REPLICATE_API_TOKEN (FLUX, Kling, MusicGen via creative-stack MCP)

$(bold "🖥  Mac-only bonuses now possible (impossible on the cloud box):")
EOF
if [[ "$ARCH" == "arm64" ]]; then
  echo "  • Apple Silicon detected — Stable Diffusion WebUI runs locally on the GPU (MPS). See SETUP-SD-WEBUI.md"
  echo "  • Palmier Pro (MCP-driven NLE) is installable on macOS 26 + Apple Silicon. See SETUP-PALMIER-PRO.md"
  echo "  • Voicebox local voice cloning + Kokoro run on-device, zero API cost. See VOICEBOX-SETUP.md"
else
  echo "  • Intel Mac — SD-WebUI will be slow (no MPS). Cloud APIs remain the better path."
fi
echo ""
bold "Done."
