#!/bin/bash
#
# Install-Downloads.command — one-click installer for the tools added to this
# repo over the last two days. Double-click in Finder, or run:  bash Install-Downloads.command
#
# Companion to DOWNLOADS-LAST-2-DAYS.md.
#
# UNATTENDED: installs everything automatically, no y/N prompts —
#   prerequisites (Homebrew, python3, ffmpeg, node) + MoviePy + ffmpeg
#   + Stable Diffusion WebUI + Deep Playground.
# It still skips anything already installed, so it's safe to re-run.
#
# Note: the Homebrew installer itself may prompt for your password / a Return —
# that's Apple's installer, not this script. To skip the heavy clones on a run,
# set SKIP_HEAVY=1 (e.g.  SKIP_HEAVY=1 bash Install-Downloads.command).

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

have() { command -v "$1" >/dev/null 2>&1; }

SKIP_HEAVY="${SKIP_HEAVY:-0}"

echo
echo "${bold}RHYTHMIX — Install last 2 days' tools (unattended)${reset}"
echo "Period: 2026-06-26 → 2026-06-28  (see DOWNLOADS-LAST-2-DAYS.md)"
[[ "$SKIP_HEAVY" == "1" ]] && warn "SKIP_HEAVY=1 — skipping SD WebUI + Deep Playground this run."
echo

# ---------------------------------------------------------------------------
# 0. Prerequisites: Homebrew, then ffmpeg + python3 + node (all automatic).
# ---------------------------------------------------------------------------
say "Prerequisites"

if ! have brew; then
  warn "Homebrew not found — installing (Apple's installer may ask for your password)."
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  [[ -x /opt/homebrew/bin/brew ]] && eval "$(/opt/homebrew/bin/brew shellenv)"
  [[ -x /usr/local/bin/brew ]]   && eval "$(/usr/local/bin/brew shellenv)"
else
  ok "Homebrew present ($(brew --version | head -1))"
fi

if have brew; then
  for pkg in python ffmpeg node; do
    bin="$pkg"; [[ "$pkg" == "python" ]] && bin="python3"
    if have "$bin"; then ok "$bin present"; else
      say "Installing $pkg"; brew install "$pkg" && ok "$pkg installed" || err "$pkg install failed"
    fi
  done
else
  warn "No Homebrew — skipping python3/ffmpeg/node auto-install. Some steps may fail."
fi

# ---------------------------------------------------------------------------
# 1. MoviePy v2  (SETUP-MOVIEPY.md)
# ---------------------------------------------------------------------------
echo
say "MoviePy v2 — Python video post-processing"
if have python3; then
  python3 -m pip install --user --upgrade "moviepy>=2.0" \
    && ok "MoviePy installed. Test: python3 -c 'import moviepy; print(moviepy.__version__)'" \
    || err "MoviePy install failed — see SETUP-MOVIEPY.md"
else
  err "python3 missing — cannot install MoviePy. See SETUP-MOVIEPY.md"
fi

# ---------------------------------------------------------------------------
# 2. Stable Diffusion WebUI / AUTOMATIC1111 (SETUP-SD-WEBUI.md) — heavy.
# ---------------------------------------------------------------------------
echo
say "Stable Diffusion WebUI (AUTOMATIC1111) — local image generation"
if [[ "$SKIP_HEAVY" == "1" ]]; then
  warn "Skipped (SKIP_HEAVY=1)."
elif [[ -d "$HOME/stable-diffusion-webui/.git" ]]; then
  ok "Already cloned at ~/stable-diffusion-webui"
else
  warn "Large download (~GBs); best on a GPU / Apple-Silicon Mac."
  git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui.git \
    "$HOME/stable-diffusion-webui" \
    && ok "Cloned. First run: cd ~/stable-diffusion-webui && ./webui.sh" \
    || err "Clone failed — see SETUP-SD-WEBUI.md"
fi

# ---------------------------------------------------------------------------
# 3. Deep Playground (SETUP-DEEP-PLAYGROUND.md) — TS + d3 demo.
# ---------------------------------------------------------------------------
echo
say "TensorFlow Deep Playground — neural-net visualization demo"
if [[ "$SKIP_HEAVY" == "1" ]]; then
  warn "Skipped (SKIP_HEAVY=1)."
elif [[ -d "$HOME/deep-playground/.git" ]]; then
  ok "Already cloned at ~/deep-playground"
elif have node; then
  git clone https://github.com/tensorflow/playground.git "$HOME/deep-playground" \
    && ( cd "$HOME/deep-playground" && npm install ) \
    && ok "Ready. Run: cd ~/deep-playground && npm run serve" \
    || err "Setup failed — see SETUP-DEEP-PLAYGROUND.md"
else
  err "node missing — cannot set up Deep Playground. See SETUP-DEEP-PLAYGROUND.md"
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
echo "${green}${bold}Done.${reset} Re-run any time — it skips what's already installed."
echo
read -r -p "Press Return to close."
