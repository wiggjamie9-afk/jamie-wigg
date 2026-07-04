#!/bin/bash
# Session-start health check + self-healing setup.
# Cloud sessions start from a fresh clone, so node_modules is always missing —
# install MCP server deps here instead of documenting "deps installed" and hoping.

cd "$(git rev-parse --show-toplevel 2>/dev/null || pwd)" || exit 0

echo "🚀 RHYTHMIX workspace — branch: $(git branch --show-current 2>/dev/null || echo 'not a git repo')"

# --- Self-heal MCP server dependencies (parallel, skipped when already present) ---
MCP_DIRS=".claude/mcp/creative-stack .claude/mcp/zyloo .claude/mcp/stepfun ."
for dir in $MCP_DIRS; do
  if [ -f "$dir/package.json" ] && [ ! -d "$dir/node_modules" ]; then
    echo "📦 installing deps: $dir"
    (cd "$dir" && npm install --silent --no-audit --no-fund 2>/dev/null) &
  fi
done
wait

# --- Environment sanity ---
if [ ! -f .env ]; then
  echo "⚠️  no .env at repo root — stepfun/zyloo/higgsfield MCP servers will not authenticate (copy .env.example)"
fi
if ! command -v higgsfield-mcp >/dev/null 2>&1; then
  echo "ℹ️  local higgsfield-mcp not installed — use the hosted Higgsfield MCP (connected in cloud sessions) instead"
fi

echo "✅ Ready. Common entry points: /rhythmix-new · /dream · /album-launch · /site-build · /spec-quick"
