#!/usr/bin/env bash
# SessionStart hook: print quick repo orientation into the model's context.

set -euo pipefail

echo "=== jamie-wigg session orientation ==="
echo "branch: $(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo 'detached')"
echo "head:   $(git log -1 --pretty=format:'%h %s' 2>/dev/null || echo 'no commits')"

if [ -d video ]; then
  echo "video/: present (run 'cd video && npm run dev' to start the studio)"
fi

dirty="$(git status --porcelain 2>/dev/null | wc -l | tr -d ' ')"
echo "dirty files: ${dirty:-0}"
echo "======================================"
exit 0
