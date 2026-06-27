#!/bin/bash
#
# Install-Downloads.command — one-click installer for the tools added to this
# repo over the last two days. Double-click in Finder, or run:  bash Install-Downloads.command
#
# Companion to DOWNLOADS-LAST-2-DAYS.md. Installs the genuinely installable
# tools; for hosted / doc-only / per-project tools it prints where to go.
#
# Safe by design: nothing installs without asking, and the heavy GPU download
# (Stable Diffusion WebUI) is opt-in.

set -u

# cd to the folder this script lives in (so it works when double-clicked).
cd "$(dirname "$0")" || exit 1

bold=$(tput bold 2>/dev/null || true); reset=$(tput sgr0 2>/dev/null || true)
green=$(tput setaf 2 2>/dev/null || true); yellow=$(tput setaf 3 2>/dev/null || true)
red=$(tput setaf 1 2>/dev/null || true); blue=$(tput setaf 4 2>/dev/null || true)

say()  { echo "${blue}==>${reset} ${bold}$*${reset}"; }
ok()   { echo "${green}  ✓${reset} $*"; }
warn() { echo "${yellow}  !${reset} $*"; }
err()  { echo "${red}  ✗${reset} $*"; }

ask() { # ask "Question?" -> returns 0 for yes
  local reply
  read -r -p "${bold}$1${reset} [y/N] " reply
  [[ "$reply" =~ ^[Yy]$ ]]
}

have() { command -v "$1" >/dev/null 2>&1; }

echo
echo "${bold}RHYTHMIX — Install last 2 days' tools${reset}"
echo "Period: 2026-06-26 → 2026-06-28  (see DOWNLOADS-LAST-2-DAYS.md)"
echo

# ---------------------------------------------------------------------------
# 0. Prerequisites: Homebrew, then ffmpeg + python3 + node as needed.
# ---------------------------------------------------------------------------
say "Checking prerequisites"

if ! have brew; then
  warn "Homebrew not found."
  if ask "Install Homebrew now? (recommended on macOS)"; then
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    # Make brew available in this shell (Apple Silicon vs Intel paths).
    if [[ -x /opt/homebrew/bin/brew ]]; then eval "$(/opt/homebrew/bin/brew shellenv)"; fi
    if [[ -x /usr/local/bin/brew ]]; then eval "$(/usr/local/bin/brew shellenv)"; fi
  else
    warn "Skipping Homebrew. Some installs below may not work without it."
  fi
else
  ok "Homebrew present ($(brew --version | head -1))"
fi

if ! have python3; then
  warn "python3 not found."
  if have brew && ask "Install python3 via Homebrew?"; then brew install python; fi
else
  ok "python3 present ($(python3 --version 2>&1))"
fi

if ! have ffmpeg; then
  warn "ffmpeg not found (needed by MoviePy)."
  if have brew && ask "Install ffmpeg via Homebrew?"; then brew install ffmpeg; fi
else
  ok "ffmpeg present"
fi

# ---------------------------------------------------------------------------
# 1. MoviePy v2  (SETUP-MOVIEPY.md) — simple pip install.
# ---------------------------------------------------------------------------
echo
say "MoviePy v2 — Python video post-processing"
if have python3 && ask "Install MoviePy (>=2.0) for the current user?"; then
  python3 -m pip install --user --upgrade "moviepy>=2.0" \
    && ok "MoviePy installed. Test: python3 -c 'import moviepy; print(moviepy.__version__)'" \
    || err "MoviePy install failed — see SETUP-MOVIEPY.md"
else
  warn "Skipped MoviePy."
fi

# ---------------------------------------------------------------------------
# 2. Stable Diffusion WebUI / AUTOMATIC1111 (SETUP-SD-WEBUI.md) — heavy, opt-in.
# ---------------------------------------------------------------------------
echo
say "Stable Diffusion WebUI (AUTOMATIC1111) — local image generation"
warn "Large download (~GBs) + needs Python 3.10. Best on a GPU / Apple-Silicon Mac."
if ask "Clone Stable Diffusion WebUI into ~/stable-diffusion-webui?"; then
  if [[ -d "$HOME/stable-diffusion-webui/.git" ]]; then
    ok "Already cloned at ~/stable-diffusion-webui"
  else
    git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui.git \
      "$HOME/stable-diffusion-webui" \
      && ok "Cloned. First run: cd ~/stable-diffusion-webui && ./webui.sh" \
      || err "Clone failed — see SETUP-SD-WEBUI.md"
  fi
else
  warn "Skipped SD WebUI. (Cloud/Colab path is in SETUP-SD-WEBUI.md.)"
fi

# ---------------------------------------------------------------------------
# 3. Deep Playground (SETUP-DEEP-PLAYGROUND.md) — TS + d3 demo, opt-in.
# ---------------------------------------------------------------------------
echo
say "TensorFlow Deep Playground — neural-net visualization demo"
if ask "Clone Deep Playground into ~/deep-playground and npm install?"; then
  if ! have node; then
    warn "node not found."
    have brew && ask "Install node via Homebrew?" && brew install node
  fi
  if [[ -d "$HOME/deep-playground/.git" ]]; then
    ok "Already cloned at ~/deep-playground"
  else
    git clone https://github.com/tensorflow/playground.git "$HOME/deep-playground" \
      && ( cd "$HOME/deep-playground" && npm install ) \
      && ok "Ready. Run: cd ~/deep-playground && npm run serve" \
      || err "Setup failed — see SETUP-DEEP-PLAYGROUND.md"
  fi
else
  warn "Skipped Deep Playground."
fi

# ---------------------------------------------------------------------------
# 4. Doc-only / hosted / per-project — nothing to globally install.
# ---------------------------------------------------------------------------
echo
say "No standalone install (use these per the docs):"
cat <<'NOTES'
  • PageAgent copilot   — web component; embed pageagent/pageagent-copilot.js
                          in a page. Open pageagent.html to try it. (pageagent/README.md)
  • Ruixen UI           — shadcn components added per-project with the shadcn
                          CLI, not a global install. (SETUP-RUIXEN-UI.md)
  • MiniMax-01          — hosted API / MCP, no local install. (SETUP-MINIMAX-01.md)
  • Palmier Pro         — macOS 26 Apple-Silicon only; install from its own
                          release when on a supported Mac. (SETUP-PALMIER-PRO.md)
  • Freebuff CLI        — terminal AI coding agent; install per its own README.
                          (SETUP-FREEBUFF.md)
  • Kling→socials       — import automation/kling-social-pipeline/workflow.json
                          into your n8n instance. (automation/kling-social-pipeline/README.md)
NOTES

echo
echo "${green}${bold}Done.${reset} Re-run this script any time — it skips what's already installed."
echo
read -r -p "Press Return to close."
