#!/usr/bin/env bash
# Codespace bootstrap: media tools + Claude Code + local memory, then a "ready" banner.
# Optional installs are guarded so one failure never breaks Codespace creation.
set -u

log() { printf '\n\033[1;36m▶ %s\033[0m\n' "$1"; }
ok()  { printf '\033[1;32m  ✓ %s\033[0m\n' "$1"; }
warn(){ printf '\033[1;33m  ! %s\033[0m\n' "$1"; }

# ---------------------------------------------------------------- media tools
log "Installing ffmpeg + aubio (RHYTHMIX render pipeline)"
if sudo apt-get update -qq && sudo apt-get install -y -qq ffmpeg aubio-tools; then
  ok "ffmpeg + aubio installed"
else
  warn "apt install failed — install ffmpeg manually if you render video"
fi

chmod +x rhythmix-studio/bin/rhythmix-studio.mjs 2>/dev/null || true
chmod +x rhythmix-studio/demo.sh 2>/dev/null || true

# ---------------------------------------------------------------- Claude Code
log "Installing Claude Code CLI"
if npm install -g @anthropic-ai/claude-code >/dev/null 2>&1; then
  ok "Claude Code installed — run 'claude' and sign in on first launch"
else
  warn "Claude Code install failed — retry: npm install -g @anthropic-ai/claude-code"
fi

# ---------------------------------------------------------------- local memory (MemPalace)
# .mcp.json wires the 'mempalace' MCP at `mempalace-mcp`; install it so the server resolves.
log "Installing MemPalace (local, private memory engine)"
mkdir -p "$HOME/.local/bin"
if ! command -v uv >/dev/null 2>&1; then
  curl -LsSf https://astral.sh/uv/install.sh | sh >/dev/null 2>&1 || warn "uv install failed"
fi
export PATH="$HOME/.local/bin:$HOME/.cargo/bin:$PATH"
if command -v uv >/dev/null 2>&1 && uv tool install mempalace >/dev/null 2>&1; then
  ok "MemPalace installed ($(mempalace --version 2>/dev/null || echo ok))"
elif python3 -m pip install --user mempalace >/dev/null 2>&1; then
  ok "MemPalace installed via pip"
else
  warn "MemPalace install skipped — install later: uv tool install mempalace"
fi

# Make ~/.local/bin durable for interactive shells (so `claude` finds mempalace-mcp).
grep -q '.local/bin' "$HOME/.bashrc" 2>/dev/null || \
  echo 'export PATH="$HOME/.local/bin:$HOME/.cargo/bin:$PATH"' >> "$HOME/.bashrc"

# ---------------------------------------------------------------- repo deps (best-effort)
log "Installing root npm deps (claude-playwright MCP, etc.)"
npm install --no-audit --no-fund >/dev/null 2>&1 && ok "npm deps installed" || warn "root npm install skipped"

# ---------------------------------------------------------------- ready banner
cat <<'EOF'

==========================================================
  ✅ RHYTHMIX Codespace ready — this is your real workshop
==========================================================

START CLAUDE CODE (persistent, full network — no sandbox):
  claude                         # first run: sign in with your Claude account

MEMORY (so Claude stops re-asking):
  • Local/private  → MemPalace is installed; run once:  mempalace init .
  • Hosted/easy    → Supermemory MCP is wired; it OAuths on first use in `claude`
  → Pick ONE as primary (don't run both). See docs/COMPLETE-STACK.md.

MAKE A VIDEO (free, no key — synthetic visuals):
  bash rhythmix-studio/demo.sh   # → rhythmix-out/demo/final.mp4

API KEYS (set once, persist across Codespaces):
  https://github.com/settings/codespaces
  Useful: REPLICATE_API_TOKEN, ELEVENLABS_API_KEY, PEXELS_API_KEY

YOUR FULL INVENTORY:  docs/COMPLETE-STACK.md
==========================================================
EOF
