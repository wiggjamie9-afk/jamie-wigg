#!/usr/bin/env bash
# Install the optional CLI tools used by this LLM Wiki:
#   - qmd       (local markdown search engine, BM25 + vectors + LLM rerank)
#   - marp-cli  (markdown → slide deck)
#
# Both are global npm installs. Re-run any time to upgrade.
#
# Prerequisites:
#   - Node.js >= 22  (or Bun >= 1.0; swap `npm` for `bun` below if you prefer)
#   - On macOS, qmd benefits from `brew install sqlite` for extension support.
#   - First `qmd` run downloads ~2GB of GGUF models to ~/.cache/qmd/models/.

set -euo pipefail

if ! command -v npm >/dev/null 2>&1; then
  echo "error: npm not found. Install Node.js >= 22 first (https://nodejs.org)." >&2
  exit 1
fi

node_major="$(node -p 'process.versions.node.split(".")[0]')"
if [ "${node_major}" -lt 22 ]; then
  echo "warning: Node ${node_major} detected; qmd requires Node >= 22." >&2
  echo "         Continuing anyway — install may fail." >&2
fi

echo "==> Installing qmd (markdown search)…"
npm install -g @tobilu/qmd

echo "==> Installing marp-cli (markdown slides)…"
npm install -g @marp-team/marp-cli

echo
echo "Done. Verify:"
echo "  qmd --help"
echo "  marp --help"
echo
if [ "$(uname -s)" = "Darwin" ] && ! command -v sqlite3 >/dev/null 2>&1; then
  echo "Tip (macOS): run 'brew install sqlite' for full qmd extension support."
fi
