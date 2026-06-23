#!/usr/bin/env python3
"""
Buzzsprout Episode Uploader
===========================
Uploads every episode in voiceover-kit/audio-ep*/ to the 20 Buzzsprout shows
and schedules them on a Monday / Wednesday / Friday cadence.

File layout it expects:
    voiceover-kit/audio-ep2/ep2-01.mp3 ... ep2-20.mp3
    voiceover-kit/audio-ep3/ep3-01.mp3 ... ep3-20.mp3
    ...
  where the number after the dash (01-20) is the SHOW, and the epN is the
  EPISODE. So "ep5-12.mp3" = episode 5 of show 12 (Stoic Minute).

All shows release their episode N on the SAME day, so subscribers across the
network get a synchronized drop.

USAGE
-----
    pip install requests
    # Dry run first (no uploads, just prints the plan):
    python3 buzzsprout_episode_uploader.py --dry-run
    # Then go live:
    python3 buzzsprout_episode_uploader.py

By default episodes are scheduled as PRIVATE with a future published_at, so
nothing goes public until its release date. Pass --publish-now to drop them
all live immediately instead.
"""

import argparse
import re
import sys
import time
from datetime import datetime, timedelta, time as dtime
from pathlib import Path

try:
    import requests
except ImportError:
    sys.exit("Missing dependency: run  pip install requests")

# --------------------------------------------------------------------------
# Configuration
# --------------------------------------------------------------------------
API_KEY = "8d981d4c93a623ce79c3fa30afd2d5dc"
BASE_URL = "https://www.buzzsprout.com/api"

# show number (zero-padded) -> (podcast_id, show name)
PODCASTS = {
    "01": (2626157, "True Crime Brief"),
    "02": (2626160, "AI Briefing"),
    "03": (2626161, "Dating Decoded"),
    "04": (2626163, "Side Hustle School"),
    "05": (2626165, "Dad Code"),
    "06": (2626167, "Money Mindset"),
    "07": (2626170, "Sleep & Calm"),
    "08": (2626171, "Longevity Brief"),
    "09": (2626172, "History Uncovered"),
    "10": (2626173, "Unexplained"),
    "11": (2626174, "Pop Culture Now"),
    "12": (2626175, "Stoic Minute"),
    "13": (2626177, "Focus Lab"),
    "14": (2626178, "Parenting Playbook"),
    "15": (2626179, "Sports Unfiltered"),
    "16": (2626180, "Plain Tech"),
    "17": (2626181, "Founders' Stories"),
    "18": (2626182, "Calm Mind"),
    "19": (2626183, "15-Minute Kitchen"),
    "20": (2626184, "Wanderlust"),
}

AUDIO_ROOT = Path("voiceover-kit")
# Time of day (local) to publish on each release day
RELEASE_HOUR = 6  # 6am
FNAME_RE = re.compile(r"ep(\d+)-(\d+)\.mp3$", re.IGNORECASE)


# --------------------------------------------------------------------------
# Discovery
# --------------------------------------------------------------------------
def discover_episodes():
    """Return {episode_number: {show_str: Path}} from the audio-ep*/ dirs."""
    episodes = {}
    for d in sorted(AUDIO_ROOT.glob("audio-ep*")):
        if not d.is_dir():
            continue
        for mp3 in sorted(d.glob("*.mp3")):
            m = FNAME_RE.search(mp3.name)
            if not m:
                print(f"  skip (bad name): {mp3}")
                continue
            ep_num = int(m.group(1))
            show = m.group(2).zfill(2)
            episodes.setdefault(ep_num, {})[show] = mp3
    return episodes


def release_dates_for(episode_numbers, start_monday):
    """Map each episode number to a Mon/Wed/Fri release datetime, in order."""
    # cadence offsets within a week: Mon=0, Wed=2, Fri=4
    cadence = [0, 2, 4]
    schedule = {}
    for i, ep in enumerate(sorted(episode_numbers)):
        week, slot = divmod(i, 3)
        day = start_monday + timedelta(weeks=week, days=cadence[slot])
        schedule[ep] = datetime.combine(day.date(), dtime(hour=RELEASE_HOUR))
    return schedule


def next_monday(today=None):
    today = today or datetime.now()
    days = (7 - today.weekday()) % 7 or 7
    return today + timedelta(days=days)


# --------------------------------------------------------------------------
# Upload
# --------------------------------------------------------------------------
def upload(podcast_id, title, mp3_path, published_at, publish_now):
    url = f"{BASE_URL}/{podcast_id}/episodes.json"
    headers = {
        "Authorization": f"Token token={API_KEY}",
        "User-Agent": "rhythmix-buzzsprout-uploader/1.0",
    }
    data = {
        "title": title,
        "private": "false" if publish_now else "true",
    }
    if not publish_now:
        # Buzzsprout accepts ISO8601 for scheduled release
        data["published_at"] = published_at.isoformat()
    with open(mp3_path, "rb") as fh:
        files = {"audio_file": (mp3_path.name, fh, "audio/mpeg")}
        resp = requests.post(url, headers=headers, data=data, files=files, timeout=300)
    resp.raise_for_status()
    return resp.json()


# --------------------------------------------------------------------------
# Main
# --------------------------------------------------------------------------
def main():
    ap = argparse.ArgumentParser(description="Upload episodes to Buzzsprout.")
    ap.add_argument("--dry-run", action="store_true", help="Print the plan, upload nothing.")
    ap.add_argument("--publish-now", action="store_true",
                    help="Publish immediately instead of scheduling future release.")
    ap.add_argument("--only-episode", type=int, default=None,
                    help="Only process a single episode number (for testing).")
    ap.add_argument("--start", type=str, default=None,
                    help="First release date YYYY-MM-DD (defaults to next Monday).")
    args = ap.parse_args()

    episodes = discover_episodes()
    if not episodes:
        sys.exit("No audio files found under voiceover-kit/audio-ep*/")

    if args.start:
        start = datetime.strptime(args.start, "%Y-%m-%d")
    else:
        start = next_monday()

    schedule = release_dates_for(episodes.keys(), start)

    total = sum(len(v) for v in episodes.values())
    print(f"Found {len(episodes)} episodes, {total} audio files total.")
    print(f"Release cadence: Mon/Wed/Fri from {start.date()} at {RELEASE_HOUR:02d}:00\n")

    ok = fail = 0
    for ep in sorted(episodes):
        if args.only_episode and ep != args.only_episode:
            continue
        when = schedule[ep]
        shows = episodes[ep]
        missing = [s for s in PODCASTS if s not in shows]
        flag = f"  (incomplete: missing shows {', '.join(missing)})" if missing else ""
        print(f"Episode {ep} -> {when:%a %b %d %Y}  [{len(shows)}/20 shows]{flag}")
        for show in sorted(shows):
            podcast_id, name = PODCASTS[show]
            title = f"Episode {ep}"
            mp3 = shows[show]
            if args.dry_run:
                print(f"    DRY  {name:<20} ep{ep:<2} <- {mp3.name}")
                continue
            try:
                upload(podcast_id, title, mp3, when, args.publish_now)
                print(f"    OK   {name:<20} ep{ep}")
                ok += 1
                time.sleep(0.5)  # be gentle on the API
            except Exception as e:
                print(f"    FAIL {name:<20} ep{ep}: {e}")
                fail += 1

    print(f"\nDone. {ok} uploaded, {fail} failed.")
    if args.dry_run:
        print("(dry run — nothing was actually uploaded)")


if __name__ == "__main__":
    main()
