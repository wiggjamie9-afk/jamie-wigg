#!/usr/bin/env bash
#
# Install the OpenClaw skills this repo expects to have available on the
# user's machine. These skills install into OpenClaw's own managed
# directory (~/.openclaw/... or per-agent workspace), NOT into this
# repo's .claude/skills/, so they can't be tracked in git.
#
# Run this from any network that allows ClawHub (api.openclaw.ai). The
# cloud sandbox where Claude Code on the web executes blocks ClawHub by
# default ("403: Host not in allowlist"), so this needs to run locally.
#
# Usage:
#   bash scripts/openclaw-install.sh           # install into the cwd-inferred agent workspace
#   bash scripts/openclaw-install.sh --global  # install into the shared managed directory
#
# Inspect a slug before installing:
#   npx -y openclaw skills info <slug>

set -euo pipefail

SKILLS=(
  ai-video-editor-motion-graphics
  self-improving-agent
  voice-wake-say
  voice-ai-voices
  azure-ai-voicelive-py
  app-builder
  deploy-agent
)

EXTRA_ARGS=("$@")

for slug in "${SKILLS[@]}"; do
  echo "==> openclaw skills install ${slug}"
  npx -y openclaw skills install "${slug}" "${EXTRA_ARGS[@]}"
done

echo
echo "Done. Verify with: npx -y openclaw skills list"
