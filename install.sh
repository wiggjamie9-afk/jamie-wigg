#!/usr/bin/env bash
# OpenClaw installer 🦞
# Works everywhere. Installs everything. You're welcome.
#
# Bootstraps Claude Code (the engine) plus the OpenClaw workspace
# (~/.openclaw with agents/, skills/, memory/, logs/, bin/).
#
# Usage:
#   curl -fsSL https://openclaw.ai/install.sh | bash
#
# Environment overrides (set before piping into bash):
#   OPENCLAW_VERSION=latest        npm tag or version to install
#   OPENCLAW_PREFIX=$HOME/.openclaw  workspace directory
#   OPENCLAW_DRY_RUN=1             print steps without executing anything
#   OPENCLAW_NO_DEPS=1             skip system-dependency install
#   OPENCLAW_NO_WORKSPACE=1        skip ~/.openclaw scaffolding
#   OPENCLAW_NO_CLI=1              skip the npm install step entirely
#   OPENCLAW_NPM_REGISTRY=https://registry.npmjs.org/
#   OPENCLAW_PACKAGE=@anthropic-ai/claude-code  npm package name
#   OPENCLAW_BIN_NAME=claude       command name to print in next-steps
#   OPENCLAW_DEBUG=1               trace every command

set -euo pipefail

# ─────────────────────────────────────────────────────────────────────────────
# Config

OPENCLAW_VERSION="${OPENCLAW_VERSION:-latest}"
OPENCLAW_PREFIX="${OPENCLAW_PREFIX:-$HOME/.openclaw}"
OPENCLAW_DRY_RUN="${OPENCLAW_DRY_RUN:-0}"
OPENCLAW_NO_DEPS="${OPENCLAW_NO_DEPS:-0}"
OPENCLAW_NO_WORKSPACE="${OPENCLAW_NO_WORKSPACE:-0}"
OPENCLAW_NO_CLI="${OPENCLAW_NO_CLI:-0}"
OPENCLAW_NPM_REGISTRY="${OPENCLAW_NPM_REGISTRY:-https://registry.npmjs.org/}"
OPENCLAW_PACKAGE="${OPENCLAW_PACKAGE:-@anthropic-ai/claude-code}"
OPENCLAW_BIN_NAME="${OPENCLAW_BIN_NAME:-claude}"
MIN_NODE_MAJOR=20

[ "${OPENCLAW_DEBUG:-0}" = "1" ] && set -x

# ─────────────────────────────────────────────────────────────────────────────
# Pretty output

if [ -t 1 ] && [ -z "${NO_COLOR:-}" ]; then
  C_RESET=$'\033[0m'
  C_DIM=$'\033[2m'
  C_BOLD=$'\033[1m'
  C_RED=$'\033[31m'
  C_GREEN=$'\033[32m'
  C_YELLOW=$'\033[33m'
  C_BLUE=$'\033[34m'
  C_MAGENTA=$'\033[35m'
  C_CYAN=$'\033[36m'
else
  C_RESET=""; C_DIM=""; C_BOLD=""; C_RED=""; C_GREEN=""; C_YELLOW=""; C_BLUE=""; C_MAGENTA=""; C_CYAN=""
fi

log()     { printf '%s\n' "$*"; }
info()    { printf '%s▸%s %s\n' "$C_CYAN" "$C_RESET" "$*"; }
ok()      { printf '%s✓%s %s\n' "$C_GREEN" "$C_RESET" "$*"; }
warn()    { printf '%s!%s %s\n' "$C_YELLOW" "$C_RESET" "$*" >&2; }
err()     { printf '%s✗%s %s\n' "$C_RED" "$C_RESET" "$*" >&2; }
die()     { err "$*"; exit 1; }

run() {
  if [ "$OPENCLAW_DRY_RUN" = "1" ]; then
    printf '%s$%s %s\n' "$C_DIM" "$C_RESET" "$*"
  else
    eval "$@"
  fi
}

banner() {
  printf '%s' "$C_MAGENTA"
  cat <<'EOF'
   ___                  ____ _
  / _ \ _ __   ___ _ __ / ___| | __ ___      __
 | | | | '_ \ / _ \ '_ \ |   | |/ _` \ \ /\ / /
 | |_| | |_) |  __/ | | | |___| | (_| |\ V  V /
  \___/| .__/ \___|_| |_|\____|_|\__,_| \_/\_/
       |_|                                  🦞
EOF
  printf '%s%sWorks everywhere. Installs everything. You'\''re welcome.%s\n\n' "$C_DIM" "$C_BOLD" "$C_RESET"
}

# ─────────────────────────────────────────────────────────────────────────────
# Platform detection

detect_os() {
  case "$(uname -s)" in
    Darwin)               OS=macos ;;
    Linux)
      if grep -qi microsoft /proc/version 2>/dev/null; then
        OS=wsl
      else
        OS=linux
      fi
      ;;
    MINGW*|MSYS*|CYGWIN*) OS=windows ;;
    FreeBSD)              OS=freebsd ;;
    *)                    OS=unknown ;;
  esac
  case "$(uname -m)" in
    x86_64|amd64)         ARCH=x86_64 ;;
    arm64|aarch64)        ARCH=arm64 ;;
    armv7l|armv7)         ARCH=arm ;;
    *)                    ARCH="$(uname -m)" ;;
  esac
}

detect_pkg_manager() {
  PKG=""
  for candidate in brew apt-get dnf yum pacman apk zypper; do
    if command -v "$candidate" >/dev/null 2>&1; then
      PKG="$candidate"
      break
    fi
  done
}

# ─────────────────────────────────────────────────────────────────────────────
# Dependencies

# Node.js major version, or 0 if missing.
node_major() {
  if command -v node >/dev/null 2>&1; then
    node -p 'process.versions.node.split(".")[0]' 2>/dev/null || echo 0
  else
    echo 0
  fi
}

install_pkg() {
  local pkg="$1"
  case "$PKG" in
    brew)     run "brew install $pkg" ;;
    apt-get)  run "sudo apt-get install -y -qq $pkg" ;;
    dnf)      run "sudo dnf install -y $pkg" ;;
    yum)      run "sudo yum install -y $pkg" ;;
    pacman)   run "sudo pacman -S --noconfirm $pkg" ;;
    apk)      run "sudo apk add --no-cache $pkg" ;;
    zypper)   run "sudo zypper install -y $pkg" ;;
    *)        warn "No known package manager — install '$pkg' manually."; return 1 ;;
  esac
}

ensure_curl_git() {
  for tool in curl git; do
    if ! command -v "$tool" >/dev/null 2>&1; then
      info "Installing $tool"
      install_pkg "$tool" || die "Cannot install $tool automatically. Install it and re-run."
    fi
  done
}

ensure_node() {
  local current; current="$(node_major)"
  if [ "$current" -ge "$MIN_NODE_MAJOR" ]; then
    ok "node $(node -v) detected"
    return
  fi

  info "Installing Node.js >= $MIN_NODE_MAJOR (current: ${current:-none})"
  case "$OS" in
    macos)
      if [ "$PKG" = "brew" ]; then
        install_pkg "node@$MIN_NODE_MAJOR" || install_pkg node
      else
        install_via_nvm
      fi
      ;;
    linux|wsl)
      if [ "$PKG" = "apt-get" ]; then
        run "curl -fsSL https://deb.nodesource.com/setup_${MIN_NODE_MAJOR}.x | sudo -E bash -"
        install_pkg nodejs
      elif [ "$PKG" = "dnf" ] || [ "$PKG" = "yum" ]; then
        run "curl -fsSL https://rpm.nodesource.com/setup_${MIN_NODE_MAJOR}.x | sudo -E bash -"
        install_pkg nodejs
      elif [ -n "$PKG" ]; then
        install_pkg nodejs || install_via_nvm
      else
        install_via_nvm
      fi
      ;;
    *)
      install_via_nvm
      ;;
  esac
}

install_via_nvm() {
  export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
  if [ ! -s "$NVM_DIR/nvm.sh" ]; then
    info "Installing nvm (Node Version Manager)"
    run "curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash"
  fi
  # shellcheck disable=SC1091
  [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
  run "nvm install $MIN_NODE_MAJOR"
  run "nvm use $MIN_NODE_MAJOR"
}

ensure_optional() {
  for opt in ffmpeg rg; do
    if command -v "$opt" >/dev/null 2>&1; then
      ok "$opt detected (optional)"
    else
      info "Installing optional: $opt"
      case "$opt" in
        rg) install_pkg ripgrep 2>/dev/null || warn "Skipping ripgrep — install manually if you want it." ;;
        *)  install_pkg "$opt"  2>/dev/null || warn "Skipping $opt — install manually if you want it." ;;
      esac
    fi
  done
}

# ─────────────────────────────────────────────────────────────────────────────
# OpenClaw CLI

install_cli() {
  [ "$OPENCLAW_NO_CLI" = "1" ] && { info "Skipping CLI install (OPENCLAW_NO_CLI=1)"; return; }

  if ! command -v npm >/dev/null 2>&1; then
    die "npm not found after Node.js install — bailing out."
  fi

  local spec="$OPENCLAW_PACKAGE"
  [ "$OPENCLAW_VERSION" != "latest" ] && spec="${OPENCLAW_PACKAGE}@${OPENCLAW_VERSION}"

  # Skip if the target binary is already on PATH at a recent-enough version.
  if [ "$OPENCLAW_PACKAGE" = "@anthropic-ai/claude-code" ] && command -v "$OPENCLAW_BIN_NAME" >/dev/null 2>&1; then
    ok "$OPENCLAW_BIN_NAME already installed ($($OPENCLAW_BIN_NAME --version 2>/dev/null | head -1))"
    return 0
  fi

  info "Installing $spec"
  if [ "$OPENCLAW_DRY_RUN" = "1" ]; then
    run "npm install -g --registry='$OPENCLAW_NPM_REGISTRY' '$spec'"
    return 0
  fi

  if npm install -g --registry="$OPENCLAW_NPM_REGISTRY" "$spec" 2>/tmp/openclaw-npm.log; then
    ok "Installed $spec"
  else
    warn "npm install failed. Tail of npm log:"
    tail -n 12 /tmp/openclaw-npm.log >&2 || true
    cat <<EOF >&2

The package install failed. Workspace scaffolding will still run so you can
develop locally.

To retry manually:
  npm install -g $spec

To override the package or registry (e.g. install a different CLI):
  OPENCLAW_PACKAGE=@your-scope/cli \\
  OPENCLAW_BIN_NAME=your-bin \\
  OPENCLAW_NPM_REGISTRY=https://npm.pkg.github.com/ \\
  curl -fsSL https://openclaw.ai/install.sh | bash
EOF
  fi
}

# ─────────────────────────────────────────────────────────────────────────────
# Workspace

init_workspace() {
  [ "$OPENCLAW_NO_WORKSPACE" = "1" ] && { info "Skipping workspace init (OPENCLAW_NO_WORKSPACE=1)"; return; }

  info "Initializing workspace at $OPENCLAW_PREFIX"
  run "mkdir -p '$OPENCLAW_PREFIX'/{agents,skills,memory,logs,bin}"

  if [ "$OPENCLAW_DRY_RUN" = "1" ]; then
    log "${C_DIM}# would write $OPENCLAW_PREFIX/config.json${C_RESET}"
    return
  fi

  if [ ! -f "$OPENCLAW_PREFIX/config.json" ]; then
    cat >"$OPENCLAW_PREFIX/config.json" <<EOF
{
  "version": 1,
  "installedAt": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "platform": "$OS",
  "arch": "$ARCH",
  "prefix": "$OPENCLAW_PREFIX",
  "package": "$OPENCLAW_PACKAGE",
  "bin": "$OPENCLAW_BIN_NAME",
  "channel": "$OPENCLAW_VERSION"
}
EOF
    ok "Wrote $OPENCLAW_PREFIX/config.json"
  else
    ok "Existing config kept at $OPENCLAW_PREFIX/config.json"
  fi
}

# ─────────────────────────────────────────────────────────────────────────────
# Post-install summary

print_next_steps() {
  printf '\n%s%sNext steps%s\n' "$C_BOLD" "$C_GREEN" "$C_RESET"
  cat <<EOF

  1. Open a new terminal (so PATH picks up nvm / npm if just installed).
  2. Verify:    ${C_CYAN}${OPENCLAW_BIN_NAME} --version${C_RESET}
  3. Sign in:   ${C_CYAN}${OPENCLAW_BIN_NAME}${C_RESET}  (interactive — first run handles auth)
  4. Workspace: ${C_DIM}${OPENCLAW_PREFIX}${C_RESET}

  Docs:    https://openclaw.ai/docs
  Status:  https://openclaw.ai/status
  GitHub:  https://github.com/openclaw

EOF
}

# ─────────────────────────────────────────────────────────────────────────────
# Main

main() {
  banner
  detect_os
  detect_pkg_manager

  info "Detected: $C_BOLD$OS/$ARCH$C_RESET${PKG:+ via $PKG}"
  [ "$OS" = "unknown" ] && die "Unsupported OS. See https://openclaw.ai/docs/install for manual steps."

  if [ "$OS" = "windows" ]; then
    cat <<EOF >&2

This installer is for macOS, Linux, and WSL. On native Windows, run the
PowerShell installer instead:

  irm https://openclaw.ai/install.ps1 | iex

Or use WSL2 and re-run this script inside the WSL shell.
EOF
    exit 1
  fi

  if [ "$OPENCLAW_NO_DEPS" = "1" ]; then
    info "Skipping dep install (OPENCLAW_NO_DEPS=1)"
  else
    ensure_curl_git
    ensure_node
    ensure_optional
  fi

  install_cli
  init_workspace
  print_next_steps

  ok "Done. 🦞"
}

main "$@"
