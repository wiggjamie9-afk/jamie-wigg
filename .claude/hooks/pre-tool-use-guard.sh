#!/usr/bin/env bash
# PreToolUse hook: block dangerous Bash invocations before they run.
# Reads tool input as JSON on stdin. Exit 2 to block the call.

set -euo pipefail

input="$(cat)"

# Only inspect Bash tool calls.
tool_name="$(printf '%s' "$input" | sed -n 's/.*"tool_name"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p')"
[ "$tool_name" = "Bash" ] || exit 0

cmd="$(printf '%s' "$input" | sed -n 's/.*"command"[[:space:]]*:[[:space:]]*"\(.*\)"[[:space:]]*,.*/\1/p')"

block() {
  echo "blocked by pre-tool-use-guard: $1" >&2
  exit 2
}

# Disallow obviously destructive patterns.
case "$cmd" in
  *"rm -rf /"*|*"rm -rf ~"*|*"rm -rf \$HOME"*) block "rm -rf against root/home" ;;
  *":(){ :|:& };:"*)                            block "fork bomb" ;;
  *"git push --force"*|*"git push -f "*)        block "force push — confirm with user first" ;;
  *"git reset --hard"*)                         block "destructive reset — confirm with user first" ;;
esac

# Warn on edits inside generated dirs but don't block.
case "$cmd" in
  *"graphify-out/"*|*"video/node_modules/"*|*"video/.remotion/"*)
    echo "note: command touches a generated/ignored path" >&2 ;;
esac

exit 0
