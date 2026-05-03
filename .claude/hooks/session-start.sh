#!/usr/bin/env bash
# Layer 3 - SessionStart hook. Prints a short repo orientation to stdout
# (which Claude reads as injected context).
set -euo pipefail

branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "no-git")

cat <<EOF
[jamie-wigg session-start]
- Repo: hyperframes/remotion video sandbox.
- Active branch: ${branch}.
- Subproject: video/ (Remotion 4). Run lint there with: cd video && npm run lint.
- Skills source: .agents/skills/ (canonical), ~/.claude/skills/ (installed).
- See .claude/CLAUDE.md for conventions and gotchas.
EOF
