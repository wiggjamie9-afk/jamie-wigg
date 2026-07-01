#!/bin/bash
#
# Install-Downloads.command — one-click installer for everything added to this
# repo over the last ~4 days. Double-click in Finder, or run:
#   bash mac-downloads/Install-Downloads.command
#
# Companion to mac-downloads/README.md.
#
# This script lives in mac-downloads/ but operates on the repo root, so it works
# whether you double-click it in Finder or run it from anywhere in the repo.
#
# UNATTENDED: installs everything automatically, no y/N prompts —
#   prerequisites (Homebrew, python3, ffmpeg, node, git)
#   + MoviePy + OpenCode CLI + SimpleX Chat CLI + Impeccable + Vercel CLI
#   + Graphify + Scrapling + Godot + GodMode, opens the Viral Hook Generator in your browser, and (optionally) the heavy
#   steps — Stable Diffusion WebUI, Deep Playground, the Penpot Docker stack,
#   the Awesome LLM Apps cookbook clone, ClawFleet, and Zenii (both build from source).
# It still skips anything already installed, so it's safe to re-run.
#
# Note: the Homebrew installer itself may prompt for your password / a Return —
# that's Apple's installer, not this script. To skip the heavy steps, set
# SKIP_HEAVY=1 (e.g.  SKIP_HEAVY=1 bash mac-downloads/Install-Downloads.command).

set -u

# This script lives in <repo>/mac-downloads/ — cd to the repo root so repo-relative
# paths (tools/, infra/) resolve whether double-clicked or run from elsewhere.
cd "$(dirname "$0")/.." || exit 1

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
echo "${bold}RHYTHMIX — Install last 4 days' tools (unattended)${reset}"
echo "Period: 2026-06-26 → 2026-06-30  (see mac-downloads/README.md)"
[[ "$SKIP_HEAVY" == "1" ]] && warn "SKIP_HEAVY=1 — skipping SD WebUI, Deep Playground, Penpot, Awesome LLM Apps, ClawFleet, and Zenii."
echo

# ===========================================================================
# 0. Prerequisites: Homebrew, then python3 + ffmpeg + node + git (all automatic).
# ===========================================================================
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
  for pkg in python ffmpeg node git; do
    bin="$pkg"; [[ "$pkg" == "python" ]] && bin="python3"
    if have "$bin"; then ok "$bin present"; else
      say "Installing $pkg"; brew install "$pkg" && ok "$pkg installed" || err "$pkg install failed"
    fi
  done
else
  warn "No Homebrew — skipping python3/ffmpeg/node/git auto-install. Some steps may fail."
fi

# ===========================================================================
# AUTO INSTALLS (light — CLIs and a pip package)
# ===========================================================================

# --- MoviePy v2 (SETUP-MOVIEPY.md) -----------------------------------------
echo
say "MoviePy v2 — Python video post-processing"
if have python3; then
  python3 -m pip install --user --upgrade "moviepy>=2.0" \
    && ok "MoviePy installed. Test: python3 -c 'import moviepy; print(moviepy.__version__)'" \
    || err "MoviePy install failed — see SETUP-MOVIEPY.md"
else
  err "python3 missing — cannot install MoviePy. See SETUP-MOVIEPY.md"
fi

# --- OpenCode CLI (SETUP-OPENCODE.md) --------------------------------------
echo
say "OpenCode — terminal AI coding-agent CLI"
if have opencode; then
  ok "OpenCode already installed ($(opencode --version 2>/dev/null | head -1))"
elif have brew; then
  brew install anomalyco/tap/opencode \
    && ok "OpenCode installed. Run: opencode  (in any project)" \
    || { warn "brew tap install failed — trying the official install script."
         curl -fsSL https://opencode.ai/install | bash \
           && ok "OpenCode installed via install script." \
           || err "OpenCode install failed — see SETUP-OPENCODE.md"; }
else
  curl -fsSL https://opencode.ai/install | bash \
    && ok "OpenCode installed via install script." \
    || err "OpenCode install failed — see SETUP-OPENCODE.md"
fi

# --- SimpleX Chat terminal CLI (SETUP-SIMPLEX.md) --------------------------
echo
say "SimpleX Chat — privacy-first messaging (terminal CLI)"
if have simplex-chat; then
  ok "SimpleX CLI already installed. Run: simplex-chat"
else
  curl -o- https://raw.githubusercontent.com/simplex-chat/simplex-chat/stable/install.sh | bash \
    && ok "SimpleX CLI installed. Run: simplex-chat  (see SETUP-SIMPLEX.md)" \
    || err "SimpleX CLI install failed — see SETUP-SIMPLEX.md"
fi

# --- Impeccable design toolkit (SETUP-IMPECCABLE.md) -----------------------
echo
say "Impeccable — design skill + detector for AI-built frontends"
if [[ -d "$HOME/.claude/skills/impeccable" ]]; then
  ok "Impeccable already installed globally (~/.claude/skills/impeccable)."
elif have node; then
  npx --yes impeccable install --providers=claude --scope=global \
    && ok "Impeccable installed. Run /impeccable init in your AI tool; CLI: npx impeccable detect ." \
    || err "Impeccable install failed — see SETUP-IMPECCABLE.md"
else
  err "node missing — cannot install Impeccable. See SETUP-IMPECCABLE.md"
fi

# --- Vercel CLI (SETUP-VERCEL.md) ------------------------------------------
echo
say "Vercel CLI — deploy / vercel dev"
if have vercel; then
  ok "Vercel CLI already installed ($(vercel --version 2>/dev/null | head -1))"
elif have npm; then
  npm i -g vercel \
    && ok "Vercel CLI installed. Run: vercel  (native binary is opt-in — see SETUP-VERCEL.md)" \
    || err "Vercel CLI install failed — see SETUP-VERCEL.md"
else
  err "npm missing — cannot install Vercel CLI. See SETUP-VERCEL.md"
fi

# --- Graphify knowledge-graph tool (SETUP-GRAPHIFY.md) ---------------------
echo
say "Graphify — map the repo into a queryable knowledge graph"
if have graphify; then
  ok "Graphify already installed ($(graphify --version 2>/dev/null | head -1))"
else
  # uv is the recommended installer (isolated env; avoids the pip PATH footgun).
  if ! have uv && have brew; then
    say "Installing uv (Graphify's recommended installer)"; brew install uv || warn "uv install failed"
  fi
  if have uv; then
    uv tool install graphifyy \
      && uv tool update-shell >/dev/null 2>&1 || true
    if have graphify; then
      graphify install >/dev/null 2>&1 \
        && ok "Graphify installed + skill registered. Use: /graphify .  (see SETUP-GRAPHIFY.md)" \
        || ok "Graphify installed. Run 'graphify install' to register the skill (SETUP-GRAPHIFY.md)."
    else
      warn "Graphify installed to uv's bin dir but not on PATH yet — open a new terminal, then run 'graphify install'."
    fi
  elif have pipx; then
    pipx install graphifyy && pipx ensurepath >/dev/null 2>&1 \
      && ok "Graphify installed via pipx. Open a new terminal, then run 'graphify install'." \
      || err "Graphify install failed — see SETUP-GRAPHIFY.md"
  else
    err "Neither uv nor pipx available — cannot install Graphify. See SETUP-GRAPHIFY.md"
  fi
fi

# --- Scrapling (SETUP-SCRAPLING.md) — pip lib (light) + browsers (heavy) ---
echo
say "Scrapling — adaptive web-scraping framework"
if have python3; then
  python3 -m pip install --user --upgrade "scrapling[all]" \
    && ok "Scrapling library installed." \
    || err "Scrapling install failed — see SETUP-SCRAPLING.md"
  # Browser + fingerprint deps are a heavy download — gate on SKIP_HEAVY.
  if [[ "$SKIP_HEAVY" == "1" ]]; then
    warn "Skipped 'scrapling install' (browsers) — run it later: scrapling install"
  elif have scrapling; then
    scrapling install \
      && ok "Scrapling browsers installed. Try: scrapling shell" \
      || warn "'scrapling install' failed — run it manually later."
  else
    warn "scrapling CLI not on PATH yet — open a new terminal, then run 'scrapling install'."
  fi
else
  err "python3 missing — cannot install Scrapling. See SETUP-SCRAPLING.md"
fi

# --- Godot Engine (SETUP-GODOT.md) — light GUI app via Homebrew cask -------
echo
say "Godot Engine — 2D/3D game engine"
if [[ -d "/Applications/Godot.app" ]] || { have brew && brew list --cask godot >/dev/null 2>&1; }; then
  ok "Godot already installed (/Applications/Godot.app)."
elif have brew; then
  brew install --cask godot \
    && ok "Godot installed → /Applications/Godot.app" \
    || err "Godot install failed — see SETUP-GODOT.md"
else
  warn "No Homebrew — download Godot from godotengine.org. See SETUP-GODOT.md"
fi

# --- GodMode (SETUP-GODMODE.md) — download latest universal .dmg -----------
echo
say "GodMode — smol AI chat browser (Cmd+Shift+G)"
if [[ -d "/Applications/GodMode.app" ]]; then
  ok "GodMode already installed (/Applications/GodMode.app)."
elif have curl; then
  api="https://api.github.com/repos/smol-ai/GodMode/releases/latest"
  dmg_url=$(curl -fsSL "$api" 2>/dev/null | grep -oE 'https://[^"]*universal[^"]*\.dmg' | head -1)
  [[ -z "$dmg_url" ]] && dmg_url=$(curl -fsSL "$api" 2>/dev/null | grep -oE 'https://[^"]*\.dmg' | head -1)
  if [[ -z "$dmg_url" ]]; then
    warn "Couldn't resolve a .dmg in the latest release — install from github.com/smol-ai/GodMode/releases/latest"
  else
    tmp="$(mktemp -d)"; mkdir -p "$tmp/mnt"
    if curl -fsSL "$dmg_url" -o "$tmp/GodMode.dmg"; then
      if hdiutil attach "$tmp/GodMode.dmg" -nobrowse -noautoopen -mountpoint "$tmp/mnt" >/dev/null 2>&1; then
        app=$(ls -d "$tmp/mnt"/*.app 2>/dev/null | head -1)
        if [[ -n "$app" ]]; then
          cp -R "$app" /Applications/ \
            && ok "GodMode installed → /Applications. First launch: right-click → Open (unsigned app). Then Cmd+Shift+G." \
            || warn "Copy to /Applications failed — drag it in manually from the mounted dmg."
        else
          warn "No .app found inside the dmg — install manually from the releases page."
        fi
        hdiutil detach "$tmp/mnt" >/dev/null 2>&1
      else
        warn "Failed to mount the dmg — install manually from github.com/smol-ai/GodMode/releases/latest"
      fi
    else
      warn "Download failed — get it from github.com/smol-ai/GodMode/releases/latest"
    fi
    rm -rf "$tmp"
  fi
else
  warn "curl missing — download GodMode from github.com/smol-ai/GodMode/releases/latest"
fi

# ===========================================================================
# OPEN IN BROWSER (nothing to install)
# ===========================================================================
echo
say "Viral Hook Generator (HookLab) — free in-browser tool"
if [[ -f "tools/hook-generator/index.html" ]]; then
  open "tools/hook-generator/index.html" 2>/dev/null \
    && ok "Opened tools/hook-generator/index.html in your browser." \
    || ok "Open it yourself: tools/hook-generator/index.html (README has the 2-min setup)."
else
  warn "tools/hook-generator/index.html not found — did you 'git pull'?"
fi

# ===========================================================================
# HEAVY STEPS (skipped when SKIP_HEAVY=1)
# ===========================================================================

# --- Stable Diffusion WebUI (SETUP-SD-WEBUI.md) — large clone --------------
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

# --- Deep Playground (SETUP-DEEP-PLAYGROUND.md) — TS + d3 demo -------------
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

# --- Penpot self-host (infra/penpot/, SETUP-PENPOT.md) — Docker ------------
echo
say "Penpot — self-host design platform (Docker Compose)"
if [[ "$SKIP_HEAVY" == "1" ]]; then
  warn "Skipped (SKIP_HEAVY=1)."
elif ! have docker; then
  warn "Docker not found — install Docker Desktop, then run:"
  warn "  cd infra/penpot && docker compose -p penpot up -d   (see SETUP-PENPOT.md)"
elif ! docker info >/dev/null 2>&1; then
  warn "Docker is installed but not running — start Docker Desktop, then run:"
  warn "  cd infra/penpot && docker compose -p penpot up -d"
elif [[ -f "infra/penpot/docker-compose.yaml" ]]; then
  ( cd infra/penpot && docker compose -p penpot up -d ) \
    && ok "Penpot is up → http://localhost:9001" \
    || err "Penpot failed to start — see infra/penpot/README.md"
else
  warn "infra/penpot/docker-compose.yaml not found — did you 'git pull'?"
fi

# --- Awesome LLM Apps cookbook (SETUP-AWESOME-LLM-APPS.md) — clone ---------
echo
say "Awesome LLM Apps — fork-ready LLM app templates (clone)"
if [[ "$SKIP_HEAVY" == "1" ]]; then
  warn "Skipped (SKIP_HEAVY=1)."
elif [[ -d "$HOME/awesome-llm-apps/.git" ]]; then
  ok "Already cloned at ~/awesome-llm-apps"
elif have git; then
  git clone https://github.com/Shubhamsaboo/awesome-llm-apps.git "$HOME/awesome-llm-apps" \
    && ok "Cloned. Per template: cd ~/awesome-llm-apps/<path> && pip install -r requirements.txt" \
    || err "Clone failed — see SETUP-AWESOME-LLM-APPS.md"
else
  err "git missing — cannot clone the cookbook. See SETUP-AWESOME-LLM-APPS.md"
fi

# --- ClawFleet (SETUP-CLAWFLEET.md) — clone + build; needs Docker + Go -----
echo
say "ClawFleet — manage a fleet of OpenClaw instances (Docker dashboard)"
if [[ "$SKIP_HEAVY" == "1" ]]; then
  warn "Skipped (SKIP_HEAVY=1)."
elif ! have docker; then
  warn "Docker not found — install Docker Desktop first, then re-run (ClawFleet runs instances as containers)."
elif [[ -x "$HOME/clawfleet/bin/clawfleet" ]]; then
  ok "Already built at ~/clawfleet/bin/clawfleet. Start it: cd ~/clawfleet && ./bin/clawfleet dashboard"
else
  # Go is needed to build the CLI from source (the documented build flow).
  if ! have go && have brew; then
    say "Installing go (needed to build ClawFleet)"; brew install go || warn "go install failed"
  fi
  if ! have go; then
    err "go missing — cannot build ClawFleet. See SETUP-CLAWFLEET.md"
  else
    [[ -d "$HOME/clawfleet/.git" ]] || git clone https://github.com/clawfleet/ClawFleet.git "$HOME/clawfleet"
    if [[ -d "$HOME/clawfleet/.git" ]]; then
      ( cd "$HOME/clawfleet" && go mod tidy && make build ) \
        && ok "Built ~/clawfleet/bin/clawfleet. Start the dashboard (pulls the pinned OpenClaw image, ~1.4GB): cd ~/clawfleet && ./bin/clawfleet dashboard" \
        || err "Build failed — see SETUP-CLAWFLEET.md and the repo README."
    else
      err "Clone failed — see SETUP-CLAWFLEET.md"
    fi
  fi
fi

# --- Zenii (SETUP-ZENII.md) — build from source; needs Rust ---------------
echo
say "Zenii — local AI backend / MCP memory server (build from source)"
if [[ "$SKIP_HEAVY" == "1" ]]; then
  warn "Skipped (SKIP_HEAVY=1)."
elif [[ -x "$HOME/zenii/target/release/zenii-daemon" ]]; then
  ok "Already built at ~/zenii/target/release/zenii-daemon. Start it, then: curl localhost:18981/health"
else
  if ! have cargo && have brew; then
    say "Installing rust (needed to build Zenii)"; brew install rust || warn "rust install failed"
  fi
  if ! have cargo; then
    err "cargo/rust missing — cannot build Zenii. See SETUP-ZENII.md (or use the desktop app)."
  else
    [[ -d "$HOME/zenii/.git" ]] || git clone https://github.com/sprklai/zenii.git "$HOME/zenii"
    if [[ -d "$HOME/zenii/.git" ]]; then
      ( cd "$HOME/zenii" && cargo build --release ) \
        && ok "Built ~/zenii/target/release/. Start: ~/zenii/target/release/zenii-daemon &  then curl localhost:18981/health" \
        || err "Build failed — see SETUP-ZENII.md and the repo README."
    else
      err "Clone failed — see SETUP-ZENII.md"
    fi
  fi
fi

# ===========================================================================
# POINTERS — import-only / hosted / per-project / already-in-repo
# ===========================================================================
echo
say "No standalone install (use these per the docs):"
cat <<'NOTES'
  • PageAgent copilot   — web component; embed pageagent/pageagent-copilot.js in a
                          page. Open pageagent.html to try it. (pageagent/README.md)
  • VEO3 faceless n8n   — import automation/veo3-faceless-content-system/workflow.json
                          into your n8n instance. (its README.md)
  • Kling→socials n8n   — import automation/kling-social-pipeline/workflow.json. (README)
  • Vendored skills     — already in .claude/skills/ after `git pull`; they show up
                          as /-commands. (SETUP-MATT-POCOCK-SKILLS.md, SETUP-ANTHROPIC-SKILLS.md)
  • Ruixen UI           — shadcn components added per-project with the shadcn CLI,
                          not a global install. (SETUP-RUIXEN-UI.md)
  • MiniMax-01          — hosted API / MCP, no local install. (SETUP-MINIMAX-01.md)
  • Palmier Pro         — macOS 26 Apple-Silicon only; install from its own release
                          when on a supported Mac. (SETUP-PALMIER-PRO.md)
  • Freebuff CLI        — terminal AI coding agent; install per its own README.
                          (SETUP-FREEBUFF.md)
NOTES

echo
echo "${green}${bold}Done.${reset} Re-run any time — it skips what's already installed."
echo
read -r -p "Press Return to close."
