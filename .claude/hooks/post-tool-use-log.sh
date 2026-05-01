#!/usr/bin/env bash
# PostToolUse hook: append a one-line audit entry for every tool call.

set -euo pipefail

mkdir -p .claude/logs
input="$(cat)"

ts="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
tool_name="$(printf '%s' "$input" | sed -n 's/.*"tool_name"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p')"

printf '%s\t%s\n' "$ts" "${tool_name:-unknown}" >> .claude/logs/tool-use.log
exit 0
