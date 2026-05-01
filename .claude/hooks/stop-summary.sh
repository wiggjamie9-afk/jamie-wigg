#!/usr/bin/env bash
# Stop hook: when Claude finishes a turn, surface anything still uncommitted.

set -euo pipefail

if ! git rev-parse --git-dir >/dev/null 2>&1; then
  exit 0
fi

dirty="$(git status --porcelain | wc -l | tr -d ' ')"
[ "${dirty:-0}" = "0" ] && exit 0

echo "[stop-summary] ${dirty} uncommitted change(s) on $(git rev-parse --abbrev-ref HEAD)"
git status --short | head -20
exit 0
