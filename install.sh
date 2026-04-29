#!/usr/bin/env bash
set -euo pipefail

# Install Claude Code Router and Claude Code, then drop the local config
# into ~/.claude-code-router/config.json so `ccr code` routes through
# OpenRouter to a free model.

if ! command -v node >/dev/null 2>&1; then
  echo "node is required. Install Node.js 18+ first." >&2
  exit 1
fi

npm install -g @anthropic-ai/claude-code
npm install -g @musistudio/claude-code-router

CCR_DIR="${HOME}/.claude-code-router"
mkdir -p "${CCR_DIR}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET="${CCR_DIR}/config.json"

if [[ -f "${TARGET}" ]]; then
  cp "${TARGET}" "${TARGET}.bak.$(date +%s)"
  echo "Backed up existing config to ${TARGET}.bak.*"
fi

cp "${SCRIPT_DIR}/config.json" "${TARGET}"

if [[ -n "${OPENROUTER_API_KEY:-}" ]]; then
  python3 - <<PY
import json, os, pathlib
p = pathlib.Path(os.path.expanduser("~/.claude-code-router/config.json"))
cfg = json.loads(p.read_text())
for provider in cfg.get("Providers", []):
    if provider.get("name") == "openrouter":
        provider["api_key"] = os.environ["OPENROUTER_API_KEY"]
p.write_text(json.dumps(cfg, indent=2) + "\n")
PY
  echo "Wrote OPENROUTER_API_KEY into ${TARGET}"
else
  echo "Edit ${TARGET} and replace sk-or-v1-REPLACE_WITH_YOUR_OPENROUTER_KEY"
  echo "with your key from https://openrouter.ai/keys"
fi

echo
echo "Done. Start Claude Code via OpenRouter with:"
echo "  ccr code"
