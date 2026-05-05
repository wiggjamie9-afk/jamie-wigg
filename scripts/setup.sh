#!/usr/bin/env bash
# First-run setup for the jamie-wigg / RHYTHMIX video workspace.
# Ensures MASTER_CONTEXT.md exists and an optional .env is in place.
# This repo is not an Arcads skill pack — there is no API auth step here.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo "=== jamie-wigg project setup ==="
echo ""

# ── Step 1: MASTER_CONTEXT.md ────────────────────────────────────────────────
if [[ ! -f "$ROOT/MASTER_CONTEXT.md" ]]; then
  if [[ -f "$ROOT/MASTER_CONTEXT.template.md" ]]; then
    cp "$ROOT/MASTER_CONTEXT.template.md" "$ROOT/MASTER_CONTEXT.md"
    echo "Created MASTER_CONTEXT.md from template."
  else
    echo "MASTER_CONTEXT.md is missing and no template was found." >&2
    echo "Re-checkout the branch or restore the file from git history." >&2
    exit 1
  fi
else
  echo "MASTER_CONTEXT.md already exists — skipping."
fi

# ── Step 2: optional .env ────────────────────────────────────────────────────
# Only created if .env.example is present. This repo does not currently
# require any API credentials at the root, so .env is opt-in.
if [[ -f "$ROOT/.env.example" && ! -f "$ROOT/.env" ]]; then
  cp "$ROOT/.env.example" "$ROOT/.env"
  chmod 600 "$ROOT/.env" 2>/dev/null || true
  echo "Created .env from .env.example (chmod 600)."
elif [[ -f "$ROOT/.env" ]]; then
  echo ".env already exists — skipping."
else
  echo "No .env.example present — skipping .env creation."
fi

echo ""
echo "Setup complete. Open this folder in Claude Code to start."
