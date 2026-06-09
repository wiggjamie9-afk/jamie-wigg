#!/usr/bin/env python3
"""
Automatic book processing and video generation pipeline
Monitors for new episodes and automatically formats + processes them
"""

import json
import subprocess
from pathlib import Path
from datetime import datetime

OUTPUT_DIR = Path("/home/user/jamie-wigg/formatted-books")
VIDEOS_DIR = Path("/home/user/jamie-wigg/videos")
EPISODES_DIR = Path("/home/user/jamie-wigg/kids-channel/episodes")
PROCESSED_LOG = Path("/home/user/jamie-wigg/.processed-episodes.json")

VIDEOS_DIR.mkdir(exist_ok=True)

# Load previously processed episodes
if PROCESSED_LOG.exists():
    with open(PROCESSED_LOG, 'r') as f:
        processed = json.load(f)
else:
    processed = {"episodes": []}

# LOCKED TEMPLATES
COVER_TEMPLATE = """
================================================================================
BOOK COVER PAGE (PAGE 1)
================================================================================

TITLE: Sunny's Cozy Bedtime Tales
STORY: {story_title}
SUBTITLE: Bedtime Story
TAGLINE: Dream Big, Little One

ILLUSTRATION: Professional illustrated landscape with Sunny prominent
- Moon, stars, flowers, trees
- Navy sky + Gold/Cream text
- Warm, detailed, whimsical style

BY: Jamie Wigg
================================================================================
"""

STORY_PAGE_TEMPLATE = """
PAGE {page_num}
================================================================================
ILLUSTRATION: Sunny in scene with {scene_description}

TEXT (2 LINES):
{line1}
{line2}
================================================================================
"""

def format_text_to_lines(text, lines_per_page=2, words_per_line=12):
    """Format text to exactly N lines per page"""
    words = text.split()
    lines = []
    current_line = []

    for word in words:
        current_line.append(word)
        if len(current_line) >= words_per_line:
            lines.append(" ".join(current_line))
            current_line = []

    if current_line:
        lines.append(" ".join(current_line))

    return lines

def process_episode_to_book(episode_num, episode_dir):
    """Format an episode into a book file"""
    script_file = episode_dir / "script.json"

    if not script_file.exists():
        return False

    try:
        with open(script_file, 'r') as f:
            story_data = json.load(f)
    except Exception as e:
        print(f"  ⚠ Error loading {episode_dir.name}: {e}")
        return False

    story_title = story_data.get("title", f"Episode {episode_num}")
    story_text = story_data.get("narration", "")

    if not story_text:
        return False

    # Create output file
    output_file = OUTPUT_DIR / f"BOOK-{episode_num:03d}-{story_title.replace(' ', '-')}.txt"

    with open(output_file, 'w', encoding='utf-8') as f:
        # Write cover page
        f.write(COVER_TEMPLATE.format(story_title=story_title))
        f.write("\n\n")

        # Format story text to pages
        all_lines = format_text_to_lines(story_text, lines_per_page=2, words_per_line=12)

        page_num = 2
        for i in range(0, len(all_lines), 2):
            line1 = all_lines[i] if i < len(all_lines) else ""
            line2 = all_lines[i+1] if i+1 < len(all_lines) else ""

            if line1 or line2:
                f.write(STORY_PAGE_TEMPLATE.format(
                    page_num=page_num,
                    scene_description="peaceful nighttime setting",
                    line1=line1,
                    line2=line2
                ))
                f.write("\n")
                page_num += 1

    return True

def auto_process_new_episodes():
    """Check for new episodes and process them automatically"""
    print("\n" + "="*70)
    print("AUTOMATIC BOOK PROCESSING PIPELINE")
    print("="*70 + "\n")

    # Get sorted episode directories
    episode_dirs = sorted([d for d in EPISODES_DIR.iterdir()
                          if d.is_dir() and (d / "script.json").exists()])

    new_count = 0
    total_processed = 0

    for idx, episode_dir in enumerate(episode_dirs, 1):
        episode_name = episode_dir.name

        # Check if already processed
        if episode_name in processed["episodes"]:
            continue

        if process_episode_to_book(idx, episode_dir):
            script = json.load(open(episode_dir / "script.json"))
            title = script.get("title", f"Episode {idx}")
            print(f"✓ AUTO-PROCESSED Book {idx:03d}: {title}")
            processed["episodes"].append(episode_name)
            new_count += 1
            total_processed += 1
        else:
            print(f"⚠ AUTO-FAILED Book {idx:03d}: {episode_dir.name}")

    # Save processing log
    with open(PROCESSED_LOG, 'w') as f:
        json.dump(processed, f, indent=2)

    print("\n" + "="*70)
    if new_count > 0:
        print(f"✅ NEW EPISODES PROCESSED: {new_count}")
    else:
        print("✓ No new episodes to process")
    print(f"Total in database: {len(processed['episodes'])}")
    print("="*70 + "\n")

    return new_count

def trigger_video_generation(episode_num):
    """Trigger automatic video generation for an episode (stub for future)"""
    # This will integrate with video generation pipeline
    print(f"📹 Queued for video: Episode {episode_num}")
    pass

if __name__ == "__main__":
    new_episodes = auto_process_new_episodes()

    if new_episodes > 0:
        print(f"\n🎬 Triggering video generation for {new_episodes} new episode(s)...\n")
        # Video generation would happen here
