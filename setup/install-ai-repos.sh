#!/usr/bin/env bash
# Clones the AI/engineering reference repos cataloged in security-and-ai-tools.md
# These are reference/learning repos — no installation, just clones for browsing.

set -euo pipefail

REPOS_DIR="${HOME}/ai-repos"
mkdir -p "$REPOS_DIR"
cd "$REPOS_DIR"

log() { printf '\n\033[1;36m==>\033[0m %s\n' "$*"; }

clone_or_pull() {
    local url="$1" dir="$2"
    if [ -d "$dir/.git" ]; then
        log "Updating $dir"
        git -C "$dir" pull --ff-only || true
    else
        log "Cloning $url"
        git clone --depth=1 "$url" "$dir"
    fi
}

# 75+ open-source AI projects, including RAG implementations
clone_or_pull https://github.com/patchy631/ai-engineering-hub.git ai-engineering-hub

# Leaked system prompts collection (Cursor, Perplexity, Manus, etc.)
# Verify the exact repo name on the org page first — x1xhlol publishes several.
clone_or_pull https://github.com/x1xhlol/system-prompts-and-models-of-ai-tools.git \
              system-prompts-and-models-of-ai-tools

log "Done. Repos cloned under: $REPOS_DIR"
echo
echo "Note: AI coding tools (Opal, Stitch, Google Antigravity) are hosted web"
echo "services — sign up directly on their sites; no install needed."
