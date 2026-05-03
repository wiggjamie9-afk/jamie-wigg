#!/usr/bin/env bash
# Layer 3 - PreToolUse guardrail. Blocks edits/bash that would touch
# generated artifacts or scratch files. Reads the JSON event from stdin.
set -euo pipefail

input="$(cat)"

# jq is available in the harness; fall back to grep if not.
if command -v jq >/dev/null 2>&1; then
  tool=$(echo "$input" | jq -r '.tool_name // empty')
  cmd=$(echo "$input"  | jq -r '.tool_input.command // empty')
  path=$(echo "$input" | jq -r '.tool_input.file_path // empty')
else
  tool=$(echo "$input" | grep -oE '"tool_name":"[^"]+"' | head -1 | cut -d'"' -f4)
  cmd=$(echo "$input"  | grep -oE '"command":"[^"]+"'   | head -1 | cut -d'"' -f4)
  path=$(echo "$input" | grep -oE '"file_path":"[^"]+"' | head -1 | cut -d'"' -f4)
fi

block() {
  echo "[pre-tool-use] BLOCKED: $1" >&2
  exit 2
}

# 1. Don't write into generated dirs. Match both absolute and relative paths.
case "$path" in
  graphify-out/*|*/graphify-out/*|\
  video/.remotion/*|*/video/.remotion/*|\
  node_modules/*|*/node_modules/*|\
  video/out/*|*/video/out/*|\
  video/node_modules/*|*/video/node_modules/*)
    block "writing inside a generated/cache dir is not allowed: $path"
    ;;
esac

# 2. Block obvious dangerous bash patterns.
if [[ "$tool" == "Bash" && -n "$cmd" ]]; then
  if [[ "$cmd" =~ rm[[:space:]]+-rf[[:space:]]+/ ]] \
     || [[ "$cmd" =~ rm[[:space:]]+-rf[[:space:]]+\~ ]] \
     || [[ "$cmd" =~ rm[[:space:]]+-rf[[:space:]]+\.\.* ]] \
     || [[ "$cmd" =~ git[[:space:]]+push.*--force ]] \
     || [[ "$cmd" =~ git[[:space:]]+reset[[:space:]]+--hard ]]; then
    block "dangerous command pattern: $cmd"
  fi
fi

exit 0
