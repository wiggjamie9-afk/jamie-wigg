#!/usr/bin/env bash
# clone-tools.sh — shallow-clone every clonable tool registered in TEAM-TOOLS.md
# into vendor/ (gitignored). Idempotent: existing clones are updated, not re-cloned.
#
#   bash scripts/clone-tools.sh          # core set
#   bash scripts/clone-tools.sh --all    # also the huge ones (freeCodeCamp ~300MB+)
#
# vendor/ is intentionally NOT committed — clones are per-machine/per-session.
# The durable artifacts are this script + the SETUP-*.md docs.
set -uo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
VENDOR="$ROOT/vendor"
mkdir -p "$VENDOR"

ALL=0
[ "${1:-}" = "--all" ] && ALL=1

# name|repo-url  — core set (small/medium, all referenced in TEAM-TOOLS.md)
CORE="
gstack|https://github.com/garrytan/gstack.git
superpowers|https://github.com/obra/superpowers.git
superpowers-marketplace|https://github.com/obra/superpowers-marketplace.git
ui-ux-pro-max-skill|https://github.com/nextlevelbuilder/ui-ux-pro-max-skill.git
neels-plugins|https://github.com/indranilbanerjee/neels-plugins.git
ecc|https://github.com/affaan-m/ECC.git
markitdown|https://github.com/microsoft/markitdown.git
spiralos|https://github.com/TheHeurist/SpiralOS.git
flow-trading|https://github.com/yazanobeidi/flow.git
video-use|https://github.com/browser-use/video-use.git
taste-skill|https://github.com/Leonxlnx/taste-skill.git
higgsfield-mcp|https://github.com/geopopos/geo_higgsfield_ai_mcp.git
"

# Huge/optional (only with --all)
BIG="
freecodecamp|https://github.com/freeCodeCamp/freeCodeCamp.git
"

ok=0; fail=0; skipped=0
clone_one() {
  local name="$1" url="$2" dest
  dest="$VENDOR/$name"
  if [ -d "$dest/.git" ]; then
    printf '  ↻ %-24s updating… ' "$name"
    if git -C "$dest" pull --ff-only --depth 1 >/dev/null 2>&1; then echo "ok"; ok=$((ok+1)); else echo "pull failed (kept existing)"; ok=$((ok+1)); fi
    return
  fi
  printf '  + %-24s cloning… ' "$name"
  if git clone --single-branch --depth 1 "$url" "$dest" >/dev/null 2>&1; then
    echo "ok ($(du -sh "$dest" 2>/dev/null | cut -f1))"; ok=$((ok+1))
  else
    echo "FAILED (egress-blocked or gone)"; fail=$((fail+1)); rm -rf "$dest"
  fi
}

echo "» cloning core set into vendor/ …"
while IFS='|' read -r name url; do
  [ -z "$name" ] && continue
  clone_one "$name" "$url"
done <<EOF
$CORE
EOF

if [ "$ALL" = "1" ]; then
  echo "» cloning big set (--all) …"
  while IFS='|' read -r name url; do
    [ -z "$name" ] && continue
    clone_one "$name" "$url"
  done <<EOF
$BIG
EOF
else
  echo "» skipping big set (freeCodeCamp) — rerun with --all to include"
  skipped=1
fi

echo
echo "done: $ok ok, $fail failed, big-set skipped: $skipped"
echo "vendor/ is gitignored — clones are local to this machine/session."
