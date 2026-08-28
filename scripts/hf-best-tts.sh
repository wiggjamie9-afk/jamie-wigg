#!/usr/bin/env bash
#
# Find the current top text-to-speech models on Hugging Face.
#
# This is what the `huggingface-best` skill's "no benchmarks found / fall back
# to popularity" branch executes (see .agents/skills/huggingface-best/SKILL.md,
# Step 2 fallback). TTS doesn't have a stable HF-official leaderboard, so
# `trendingScore` is the best ranked signal available.
#
# The cloud sandbox (Claude Code on the web) blocks huggingface.co via egress
# allowlist, so this script is meant to be run locally — iPhone Claude Code or
# any terminal with unrestricted network.
#
# Usage:
#   bash scripts/hf-best-tts.sh                 # top 15 by trending
#   bash scripts/hf-best-tts.sh 30              # top 30
#   bash scripts/hf-best-tts.sh 15 downloads    # rank by downloads instead

set -euo pipefail

LIMIT="${1:-15}"
SORT="${2:-trendingScore}"

# Prefer hf-cli when available (the `hf-cli` skill teaches it; install: pipx install huggingface_hub[cli])
if command -v hf >/dev/null 2>&1; then
  echo "==> via hf CLI: filter=text-to-speech sort=${SORT} limit=${LIMIT}"
  hf models list \
    --filter text-to-speech \
    --sort "${SORT}" \
    --limit "${LIMIT}"
  exit 0
fi

# Fallback: raw API + jq
echo "==> via REST: filter=text-to-speech sort=${SORT} limit=${LIMIT}"
curl -s "https://huggingface.co/api/models?filter=text-to-speech&sort=${SORT}&direction=-1&limit=${LIMIT}" \
  | jq -r '.[] | [.id, .downloads, .likes, (.trendingScore // 0)] | @tsv' \
  | awk -F'\t' 'BEGIN{
      printf "%-50s  %12s  %6s  %s\n", "MODEL", "DOWNLOADS", "LIKES", "TREND"
      printf "%-50s  %12s  %6s  %s\n", "-----", "---------", "-----", "-----"
    }
    { printf "%-50s  %12s  %6s  %.1f\n", $1, $2, $3, $4 }'

cat <<'NOTE'

Next steps:
  - Pull full metadata (params, license) for the top pick:
      hf models info <model_id> --json | jq '{safetensors, tags, cardData}'
  - For a deeper comparison (params + license + on-device fit), invoke the
    `huggingface-best` skill directly — it runs this same query, enriches each
    candidate, and renders a comparison table filtered to your hardware.
NOTE
