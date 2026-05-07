#!/usr/bin/env bash
# Session-start hook for the jamie-wigg / RHYTHMIX repo.
# Verifies the creative-AI pipeline is ready before Claude starts work,
# and auto-installs missing pieces where possible.
#
# Output goes to stderr so it shows in the session start banner.
# Exits 0 even when checks fail — never block the session.

set -u

GREEN=$'\e[32m'; YELLOW=$'\e[33m'; RED=$'\e[31m'; DIM=$'\e[2m'; RESET=$'\e[0m'
ok()    { printf "  %s✓%s %s\n" "$GREEN" "$RESET" "$1" >&2; }
warn()  { printf "  %s!%s %s\n" "$YELLOW" "$RESET" "$1" >&2; }
fail()  { printf "  %s✗%s %s\n" "$RED" "$RESET" "$1" >&2; }
note()  { printf "  %s%s%s\n" "$DIM" "$1" "$RESET" >&2; }

printf "\n%sRHYTHMIX session check%s\n" "$GREEN" "$RESET" >&2

# --- Tools we need for the video pipeline ---
need_node=false
need_ffmpeg=false
need_kokoro=false

command -v node     >/dev/null 2>&1 && ok "node $(node --version)"             || { fail "node missing";   need_node=true; }
command -v npm      >/dev/null 2>&1 && ok "npm  $(npm --version)"              || { fail "npm missing";    need_node=true; }
command -v python3  >/dev/null 2>&1 && ok "python3 $(python3 --version 2>&1 | awk '{print $2}')" || fail "python3 missing"
command -v ffmpeg   >/dev/null 2>&1 && ok "ffmpeg $(ffmpeg -version 2>&1 | head -1 | awk '{print $3}')" || { warn "ffmpeg missing — needed for renders"; need_ffmpeg=true; }
command -v ffprobe  >/dev/null 2>&1 && ok "ffprobe present"                    || warn "ffprobe missing"
command -v git      >/dev/null 2>&1 && ok "git $(git --version | awk '{print $3}')" || fail "git missing"

# Auto-install ffmpeg if missing (apt is available in this sandbox)
if $need_ffmpeg && command -v apt-get >/dev/null 2>&1; then
  note "installing ffmpeg via apt..."
  apt-get install -y --no-install-recommends ffmpeg >/dev/null 2>&1 \
    && ok "ffmpeg installed" \
    || warn "ffmpeg auto-install failed; run: apt-get install -y ffmpeg"
fi

# Kokoro TTS python packages
if python3 -c "import kokoro_onnx, soundfile" 2>/dev/null; then
  ok "kokoro-onnx + soundfile (TTS)"
else
  warn "kokoro-onnx / soundfile missing — needed for npx hyperframes tts"
  need_kokoro=true
fi

if $need_kokoro && command -v pip3 >/dev/null 2>&1; then
  note "installing kokoro-onnx + soundfile via pip..."
  pip3 install --quiet kokoro-onnx soundfile 2>/dev/null \
    && ok "kokoro-onnx installed" \
    || warn "kokoro auto-install failed; run: pip3 install kokoro-onnx soundfile"
fi

# --- Repo health ---
if [ -d .git ]; then
  branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "?")
  ahead_behind=$(git rev-list --left-right --count "@{u}...HEAD" 2>/dev/null || echo "")
  status_count=$(git status --porcelain 2>/dev/null | wc -l | awk '{print $1}')
  ok "branch: $branch"
  if [ -n "$ahead_behind" ]; then
    behind=$(echo "$ahead_behind" | awk '{print $1}')
    ahead=$(echo "$ahead_behind" | awk '{print $2}')
    [ "$behind" -gt 0 ] && warn "branch is $behind commit(s) behind upstream"
    [ "$ahead"  -gt 0 ] && note "branch is $ahead commit(s) ahead of upstream"
  fi
  [ "$status_count" -gt 0 ] && warn "$status_count uncommitted file(s)"
fi

# --- Repo summary ---
if [ -f CLAUDE.md ]; then
  vid_count=$(find . -maxdepth 2 -name 'rhythmix-*-60s' -o -name 'rhythmix-*-30s' 2>/dev/null | wc -l | awk '{print $1}')
  rendered=$(find . -maxdepth 3 -name 'rhythmix-*.mp4' -not -path '*/node_modules/*' 2>/dev/null | wc -l | awk '{print $1}')
  note "$vid_count rhythmix project(s), $rendered rendered MP4(s)"
fi

# --- Quick reminders ---
if [ -d .claude/skills/rhythmix-author ]; then
  note "rhythmix-author skill loaded — say 'make me a video' to use it"
fi
if [ -d .claude/commands ] && [ -n "$(ls .claude/commands/*.md 2>/dev/null)" ]; then
  note "slash commands: $(basename -s .md $(ls .claude/commands/*.md) | tr '\n' ' ')"
fi

printf "\n" >&2
exit 0
