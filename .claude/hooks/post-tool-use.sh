#!/usr/bin/env bash
# Layer 3 - PostToolUse hook. After edits to video/src/ TypeScript,
# remind Claude to run lint. (Soft reminder via stdout; never blocks.)
set -euo pipefail

input="$(cat)"

if command -v jq >/dev/null 2>&1; then
  path=$(echo "$input" | jq -r '.tool_input.file_path // empty')
else
  path=$(echo "$input" | grep -oE '"file_path":"[^"]+"' | head -1 | cut -d'"' -f4)
fi

case "$path" in
  */video/src/*.ts|*/video/src/*.tsx)
    echo "[post-tool-use] Edited $path — run: (cd video && npm run lint) before considering done."
    ;;
esac

exit 0
