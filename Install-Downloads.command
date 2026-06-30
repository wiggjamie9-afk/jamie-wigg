#!/bin/bash
#
# Install-Downloads.command — one-click installer for the tools added to this
# repo over the last two days. Double-click in Finder, or run:  bash Install-Downloads.command
#
# Companion to DOWNLOADS-LAST-2-DAYS.md.
#
# UNATTENDED: installs everything automatically, no y/N prompts —
#   prerequisites (Homebrew, node, git) + OpenCode CLI, opens the Viral Hook
#   Generator in your browser, and (optionally) brings up the Penpot Docker stack.
# It still skips anything already installed, so it's safe to re-run.
#
# Note: the Homebrew installer itself may prompt for your password / a Return —
# that's Apple's installer, not this script. To skip the heavy step (Penpot's
# Docker stack), set SKIP_HEAVY=1 (e.g.  SKIP_HEAVY=1 bash Install-Downloads.command).

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
echo "Period: 2026-06-28 → 2026-06-30  (see DOWNLOADS-LAST-2-DAYS.md)"
[[ "$SKIP_HEAVY" == "1" ]] && warn "SKIP_HEAVY=1 — skipping the Penpot Docker stack this run."
echo

# ---------------------------------------------------------------------------
# 0. Prerequisites: Homebrew, then git + node (all automatic).
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
  for pkg in git node; do
    if have "$pkg"; then ok "$pkg present"; else
      say "Installing $pkg"; brew install "$pkg" && ok "$pkg installed" || err "$pkg install failed"
    fi
  done
else
  warn "No Homebrew — skipping git/node auto-install. Some steps may fail."
fi

# ---------------------------------------------------------------------------
# 1. OpenCode CLI  (SETUP-OPENCODE.md)
# ---------------------------------------------------------------------------
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

# ---------------------------------------------------------------------------
# 2. Viral Hook Generator (HookLab) — open in browser, nothing to install.
# ---------------------------------------------------------------------------
echo
say "Viral Hook Generator (HookLab) — free in-browser tool"
if [[ -f "tools/hook-generator/index.html" ]]; then
  open "tools/hook-generator/index.html" 2>/dev/null \
    && ok "Opened tools/hook-generator/index.html in your browser." \
    || ok "Open it yourself: tools/hook-generator/index.html (README has the 2-min setup)."
else
  warn "tools/hook-generator/index.html not found — did you 'git pull'?"
fi

# ---------------------------------------------------------------------------
# 3. Penpot self-host (infra/penpot/, SETUP-PENPOT.md) — heavy, needs Docker.
# ---------------------------------------------------------------------------
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

# ---------------------------------------------------------------------------
# 4. Import-only / hosted / already-in-repo — nothing to globally install.
# ---------------------------------------------------------------------------
echo
say "No standalone install (use these per the docs):"
cat <<'NOTES'
  • VEO3 faceless content — import automation/veo3-faceless-content-system/workflow.json
                            into your n8n instance. (its README.md)
  • Vendored skills       — already in .claude/skills/ after `git pull`; they show
                            up as /-commands in Claude Code. (SETUP-MATT-POCOCK-SKILLS.md,
                            SETUP-ANTHROPIC-SKILLS.md)
  • Palmier Pro           — macOS 26 Apple-Silicon only; install from its own
                            release when on a supported Mac. (SETUP-PALMIER-PRO.md)
NOTES

echo
echo "${green}${bold}Done.${reset} Re-run any time — it skips what's already installed."
echo
read -r -p "Press Return to close."
