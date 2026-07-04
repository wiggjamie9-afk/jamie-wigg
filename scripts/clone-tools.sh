#!/usr/bin/env bash
# clone-tools.sh — shallow-clone every clonable tool referenced by this repo's
# SETUP docs / TEAM-TOOLS.md into vendor/ (gitignored), grouped by purpose.
#
#   bash scripts/clone-tools.sh          # everything except the multi-GB set
#   bash scripts/clone-tools.sh --all    # also stable-diffusion-webui + freeCodeCamp
#
# vendor/ is intentionally NOT committed — clones are per-machine/per-session.
# Durable artifacts = this script + the SETUP-*.md docs. Failures are non-fatal
# (egress-blocked / moved repos are reported and skipped).
set -uo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
VENDOR="$ROOT/vendor"
mkdir -p "$VENDOR"
ALL=0; [ "${1:-}" = "--all" ] && ALL=1

# ── DESIGN — apps, webpages, UI, design systems ──────────────────────────────
DESIGN="
ui-ux-pro-max-skill|https://github.com/nextlevelbuilder/ui-ux-pro-max-skill.git
taste-skill|https://github.com/Leonxlnx/taste-skill.git
ruixen-ui|https://github.com/ruixenui/ruixen.com.git
penpot|https://github.com/penpot/penpot.git
anthropics-skills|https://github.com/anthropics/skills.git
mattpocock-skills|https://github.com/mattpocock/skills.git
superpowers|https://github.com/obra/superpowers.git
superpowers-marketplace|https://github.com/obra/superpowers-marketplace.git
"

# ── AUTOMATION — agents, browser control, orchestration ──────────────────────
AUTOMATION="
openmanus|https://github.com/FoundationAgents/OpenManus.git
browser-use|https://github.com/browser-use/browser-use.git
video-use|https://github.com/browser-use/video-use.git
ui-tars-desktop|https://github.com/bytedance/UI-TARS-desktop.git
hermes-agent|https://github.com/NousResearch/hermes-agent.git
opencode|https://github.com/anomalyco/opencode.git
gstack|https://github.com/garrytan/gstack.git
ecc|https://github.com/affaan-m/ECC.git
neels-plugins|https://github.com/indranilbanerjee/neels-plugins.git
higgsfield-mcp|https://github.com/geopopos/geo_higgsfield_ai_mcp.git
palmier-pro|https://github.com/palmier-io/palmier-pro.git
"

# ── MEDIA / REFERENCE ────────────────────────────────────────────────────────
MEDIA="
moviepy|https://github.com/Zulko/moviepy.git
deep-playground|https://github.com/tensorflow/playground.git
markitdown|https://github.com/microsoft/markitdown.git
spiralos|https://github.com/TheHeurist/SpiralOS.git
flow-trading|https://github.com/yazanobeidi/flow.git
"

# ── BIG — multi-GB / opt-in only with --all ──────────────────────────────────
BIG="
stable-diffusion-webui|https://github.com/AUTOMATIC1111/stable-diffusion-webui.git
freecodecamp|https://github.com/freeCodeCamp/freeCodeCamp.git
"

ok=0; fail=0
clone_one() {
  local name="$1" url="$2" dest="$VENDOR/$1"
  if [ -d "$dest/.git" ]; then
    printf '  ↻ %-22s updating… ' "$name"
    git -C "$dest" pull --ff-only --depth 1 >/dev/null 2>&1 && echo "ok" || echo "kept existing"
    ok=$((ok+1)); return
  fi
  printf '  + %-22s cloning… ' "$name"
  if git clone --single-branch --depth 1 "$url" "$dest" >/dev/null 2>&1; then
    echo "ok ($(du -sh "$dest" 2>/dev/null | cut -f1))"; ok=$((ok+1))
  else
    echo "FAILED (egress-blocked / moved)"; fail=$((fail+1)); rm -rf "$dest"
  fi
}
run_group() { local title="$1" list="$2"; echo "» $title"; while IFS='|' read -r n u; do [ -z "$n" ] && continue; clone_one "$n" "$u"; done <<EOF
$list
EOF
}

run_group "DESIGN"     "$DESIGN"
run_group "AUTOMATION" "$AUTOMATION"
run_group "MEDIA / REFERENCE" "$MEDIA"
if [ "$ALL" = "1" ]; then run_group "BIG (--all)" "$BIG"
else echo "» skipping BIG set (stable-diffusion-webui, freeCodeCamp) — rerun with --all"; fi

echo
echo "done: $ok ok, $fail failed"
echo "vendor/ is gitignored — clones are local to this machine/session."
