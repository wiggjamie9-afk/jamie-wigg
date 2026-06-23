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

# episode number -> (title, description)
EPISODES = {
    1: ("Season Premiere — Welcome to the Network", "Welcome to the STARLIGHTMIX Audio Network, where 20 distinct voices explore the stories that matter. In this season premiere, discover what sets this network apart: synchronized releases, expert insights, and narratives crafted for the curious mind. From true crime to AI, from wellness to culture—each show brings you closer to understanding the world. Join us as we launch a new era of intelligent, independent audio."),
    2: ("The Foundation", "Every network has a story. In episode 2, we explore the core philosophy behind STARLIGHTMIX: what it means to deliver fresh, focused content without compromise. We break down what listeners expect from today's audio, why quality matters more than ever, and how we're reshaping the podcast landscape. Tune in to understand the vision driving this network forward."),
    3: ("Going Deeper", "Depth over breadth. In this episode, we dive into the art of meaningful storytelling. Whether you're looking to understand a complex topic, unravel a captivating narrative, or discover new perspectives, we show you why taking time to really understand something is worth it. This is STARLIGHTMIX at its core."),
    4: ("The Power of Perspective", "Every story has multiple sides. Episode 4 explores how perspective shapes understanding. We examine real-world cases, scenarios, and situations that challenge assumptions and broaden horizons. By seeing the world through different lenses, we gain wisdom that single-viewpoint narratives simply can't deliver."),
    5: ("Connections", "Nothing exists in isolation. In this episode, we examine the threads that connect seemingly unrelated stories, ideas, and events. From cause-and-effect chains to unexpected correlations, discover how the STARLIGHTMIX network reveals the interconnected nature of the world we live in."),
    6: ("The Human Element", "Behind every story, every statistic, every breakthrough—there's a human being. Episode 6 focuses on the people who drive events, make decisions, and shape outcomes. We believe understanding the human dimension is essential to truly grasping what matters. Meet the players in the stories that define our time."),
    7: ("Challenging Assumptions", "What if everything you thought was true turned out to be incomplete? Episode 7 questions conventional wisdom and examines claims that demand scrutiny. STARLIGHTMIX is committed to critical thinking and evidence-based storytelling. Join us as we investigate assertions that shape culture, policy, and belief."),
    8: ("The Details Matter", "The devil is in the details. In this episode, we show why precision, accuracy, and careful observation separate great storytelling from mediocre content. We deep-dive into how small facts compound into larger understanding, and why STARLIGHTMIX refuses to cut corners when presenting important information."),
    9: ("Patterns and Lessons", "History doesn't repeat, but it often rhymes. Episode 9 explores recurring patterns across different domains—patterns that offer insights for today. Whether it's cycles in culture, psychology, economics, or human behavior, understanding what's happened before illuminates what happens next."),
    10: ("The Untold Story", "Some stories never make headlines. Episode 10 focuses on narratives that exist in the margins—the details omitted from mainstream coverage, the perspectives overlooked, the evidence that challenges the popular version. STARLIGHTMIX exists partly to bring these stories into the light."),
    11: ("Transformation", "Change is the only constant. In episode 11, we examine transformative moments—turning points where everything shifted. From personal breakthroughs to cultural upheaval, from technological revolution to psychological insight, we analyze the catalysts that reshape lives and societies."),
    12: ("Evidence and Truth", "In a world of information overload, how do we know what's true? Episode 12 digs into methodology, evidence, and the difference between correlation and causation. STARLIGHTMIX believes in building knowledge on solid ground, and this episode shows you how to do the same."),
    13: ("The Cost", "Every choice carries a cost. Sometimes it's obvious; often it's hidden. Episode 13 examines trade-offs—the hidden prices we pay for convenience, the consequences of shortcuts, and the real expenses behind seemingly free transactions. Understanding cost sharpens decision-making."),
    14: ("Systems and Solutions", "Individual actions matter, but systems shape outcomes. Episode 14 explores how interconnected systems work, where they break down, and how real solutions require understanding structure, not just symptoms. From health to economics to culture, systems thinking changes everything."),
    15: ("The Role of Emotion", "Reason and emotion aren't opposites—they're partners. Episode 15 explores how emotion shapes decision-making, memory, and meaning. We examine the psychology behind our choices, the power of emotional narratives, and why the best stories honor both logic and feeling."),
    16: ("Innovation and Disruption", "What happens when the old order breaks? Episode 16 examines innovation—not just the shiny new products, but the deeper ways new ideas challenge established systems. We explore what drives disruption, who benefits, and who bears the cost of radical change."),
    17: ("The Long Game", "Patience changes perspective. In episode 17, we step back and examine how things develop over years, decades, or centuries. Long-term thinking reveals patterns that short-term focus obscures. STARLIGHTMIX values the kind of storytelling that rewards sustained attention."),
    18: ("Voices and Visibility", "Who gets heard? Episode 18 examines power structures that determine whose voices carry weight, whose stories get told, and whose experiences matter. We explore how media shapes visibility and what happens when marginalized narratives finally reach audiences."),
    19: ("Futures and Possibilities", "The future isn't fixed. Episode 19 explores different possible futures—the optimistic scenarios, the cautionary tales, and the decisions that determine which future we actually get. Scenario thinking helps us prepare for what comes next."),
    20: ("Integration", "Knowledge without integration remains fragmented. Episode 20 brings threads together—examining how the insights, patterns, and lessons from earlier episodes connect across domains. Integration is where wisdom lives, and this episode models that synthesis."),
    21: ("The Counterargument", "Certainty is fragile. Episode 21 deliberately examines the strongest counterarguments to popular positions. By understanding what smart people on the other side believe, we develop more robust thinking. Intellectual honesty means grappling with opposing views seriously."),
    22: ("Measurement and Meaning", "Not everything that counts can be counted. Episode 22 explores the tension between metrics and meaning. We examine what we measure, why we measure it, and what gets lost in quantification. STARLIGHTMIX cares about stories that numbers alone can't capture."),
    23: ("Resilience and Recovery", "Systems fail. People stumble. Episode 23 examines how resilience emerges—what determines who bounces back, how communities rebuild, and what we learn from failure. Stories of recovery are among humanity's most important narratives."),
    24: ("The Ethics Question", "Right and wrong aren't always obvious. Episode 24 explores ethical dilemmas—situations where reasonable people disagree, where competing values collide, and where the stakes are real. STARLIGHTMIX believes in wrestling seriously with moral complexity."),
    25: ("Synthesis and Reflection", "Halfway through the season, it's time to pause and integrate. Episode 25 reflects on what we've learned, where the network is heading, and what you—our listeners—should take away. This is storytelling that invites you to think alongside us."),
    26: ("The Unknown", "Mystery remains. Episode 26 focuses on questions without easy answers—the frontiers of knowledge, the unsolved mysteries, and the domains where honest people still disagree. The willingness to say 'we don't know yet' is a mark of intellectual integrity that STARLIGHTMIX values deeply."),
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
def upload(podcast_id, title, description, mp3_path, published_at, publish_now):
    url = f"{BASE_URL}/{podcast_id}/episodes.json"
    headers = {
        "Authorization": f"Token token={API_KEY}",
        "User-Agent": "rhythmix-buzzsprout-uploader/1.0",
    }
    data = {
        "title": title,
        "summary": description,
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

        # Get episode title and description from EPISODES dict, fallback to generic if not defined
        ep_title, ep_desc = EPISODES.get(ep, (f"Episode {ep}", ""))

        print(f"Episode {ep} -> {when:%a %b %d %Y}  [{len(shows)}/20 shows]{flag}")
        for show in sorted(shows):
            podcast_id, name = PODCASTS[show]
            mp3 = shows[show]
            if args.dry_run:
                print(f"    DRY  {name:<20} ep{ep:<2} <- {mp3.name}")
                continue
            try:
                upload(podcast_id, ep_title, ep_desc, mp3, when, args.publish_now)
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
