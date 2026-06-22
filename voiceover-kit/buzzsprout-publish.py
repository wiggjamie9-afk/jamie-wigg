#!/usr/bin/env python3
"""Auto-publish generated episode MP3s to Buzzsprout, scheduled Mon/Wed/Fri.

Setup once:
  1. cp buzzsprout-config.example.json buzzsprout-config.json
  2. Fill in each show's "podcast_id" (from its Buzzsprout dashboard URL).
  3. export BUZZSPROUT_API_TOKEN="...."      (Buzzsprout > Account > API)

Run (per episode):
  EPISODE=ep2 python3 buzzsprout-publish.py            # schedule all 20
  EPISODE=ep2 python3 buzzsprout-publish.py --dry-run  # preview, no upload

Audio is read from audio-<EP>/<EP>-NN.mp3 (produced by generate-ep2-google.py).
Each episode is created as scheduled/private until its publish date.
"""
import json
import os
import re
import signal
import sys

try:  # avoid noisy tracebacks when piping to head/tail
    signal.signal(signal.SIGPIPE, signal.SIG_DFL)
except (AttributeError, ValueError):
    pass
from datetime import date, datetime, timedelta
from pathlib import Path

import requests

HERE = Path(__file__).parent
EP = os.environ.get("EPISODE", "ep2")
EP_NUM = int(re.sub(r"\D", "", EP) or "0")
TOKEN = os.environ.get("BUZZSPROUT_API_TOKEN", "")
DRY = "--dry-run" in sys.argv
CONFIG = HERE / "buzzsprout-config.json"
DOW = {"mon": 0, "tue": 1, "wed": 2, "thu": 3, "fri": 4, "sat": 5, "sun": 6}


def load_config():
    if not CONFIG.exists():
        sys.exit("buzzsprout-config.json not found. Copy the .example and fill it in.")
    return json.loads(CONFIG.read_text())


def episode_date(rel, ep_num):
    """All 20 shows release together. ep2_date anchors Episode 2; each later
    episode steps forward one Mon/Wed/Fri slot. Returns one datetime."""
    anchor = datetime.strptime(rel["ep2_date"], "%Y-%m-%d").date()
    hh, mm = (int(x) for x in rel.get("time", "06:00").split(":"))
    wanted = sorted(DOW[d.lower()] for d in rel["days"])
    slots_forward = max(0, ep_num - 2)
    d, seen = anchor, 0
    while True:
        if d.weekday() in wanted:
            if seen == slots_forward:
                return datetime(d.year, d.month, d.day, hh, mm)
            seen += 1
        d += timedelta(days=1)


def description(num):
    path = HERE / f"{_keymap()[num]}-{EP}.txt"
    lines = path.read_text(encoding="utf-8").splitlines()
    start = next((i + 1 for i, l in enumerate(lines) if l.strip() == "---"), 0)
    body = re.sub(r"[*#`]", "", "\n".join(lines[start:])).strip()
    para = next((p.strip() for p in body.split("\n\n") if p.strip()), "")
    return para[:600]


def _keymap():
    m = {}
    for f in HERE.glob(f"*-{EP}.txt"):
        num = f.name.split("-")[0]
        m[num] = f.name[: -len(f"-{EP}.txt")]
    return m


def upload(podcast_id, mp3, title, desc, publish_at):
    url = f"https://www.buzzsprout.com/api/{podcast_id}/episodes.json"
    headers = {"Authorization": f"Token token={TOKEN}"}
    data = {
        "title": title,
        "description": desc,
        "episode_number": EP_NUM,
        "published_at": publish_at.isoformat(),
        "private": "false",
    }
    with open(mp3, "rb") as fh:
        files = {"audio_file": (mp3.name, fh, "audio/mpeg")}
        r = requests.post(url, headers=headers, data=data, files=files, timeout=180)
    if r.status_code not in (200, 201):
        raise RuntimeError(f"{r.status_code}: {r.text[:200]}")
    return r.json().get("id")


def main():
    cfg = load_config()
    shows = cfg["shows"]
    when = episode_date(cfg["release"], EP_NUM)  # same date for all 20 shows
    if not DRY and not TOKEN:
        sys.exit("Set BUZZSPROUT_API_TOKEN (or use --dry-run).")

    ok = 0
    for num, show in sorted(shows.items()):
        mp3 = HERE / f"audio-{EP}" / f"{EP}-{num}.mp3"
        title = f"{show['name']} — Episode {EP_NUM}"
        if not mp3.exists():
            print(f"  SKIP {num} {show['name']}: {mp3.name} missing")
            continue
        when_s = when.strftime("%a %Y-%m-%d %H:%M")
        if DRY:
            print(f"  PLAN {num} {show['name']:22} {when_s}  ({mp3.name})")
            ok += 1
            continue
        if not show.get("podcast_id"):
            print(f"  SKIP {num} {show['name']}: no podcast_id in config")
            continue
        try:
            eid = upload(show["podcast_id"], mp3, title, description(num), when)
            print(f"  OK   {num} {show['name']:22} {when_s}  (episode {eid})")
            ok += 1
        except Exception as e:
            print(f"  FAIL {num} {show['name']}: {e}", file=sys.stderr)
    print(f"\n{'Planned' if DRY else 'Published'}: {ok}/{len(shows)} for {EP}")


if __name__ == "__main__":
    main()
