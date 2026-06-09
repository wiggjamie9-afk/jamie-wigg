#!/usr/bin/env python3
"""Regenerate the 17 books that had Sonny → Sunny fix"""

import json
from pathlib import Path

OUTPUT_DIR = Path("/home/user/jamie-wigg/formatted-books")
EPISODES_DIR = Path("/home/user/jamie-wigg/kids-channel/episodes")

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

def process_episode(episode_dir):
    """Process a single episode directory"""
    script_file = episode_dir / "script.json"

    if not script_file.exists():
        return None

    try:
        with open(script_file, 'r') as f:
            data = json.load(f)
    except Exception as e:
        print(f"  ⚠ Error loading {episode_dir.name}: {e}")
        return None

    return data

# Episodes that need regeneration (with their book numbers)
episodes_to_fix = [
    (33, "sunny-and-the-flying-fox"),
    (34, "sunny-and-the-fog"),
    (35, "sunny-and-the-gentle-breeze"),
    (41, "sunny-and-the-gentle-stream"),
    (43, "sunny-and-the-gentle-thunder"),
    (46, "sunny-and-the-golden-hour"),
    (47, "sunny-and-the-gumnut-babies"),
    (48, "sunny-and-the-hidden-star"),
    (49, "sunny-and-the-honey-bee"),
    (50, "sunny-and-the-kangaroo-joey"),
    (51, "sunny-and-the-kookaburra-chick"),
    (52, "sunny-and-the-lily-pads"),
    (53, "sunny-and-the-little-gecko"),
    (54, "sunny-and-the-little-quoll"),
    (55, "sunny-and-the-little-turtle"),
    (56, "sunny-and-the-lorikeet-rainbow"),
    (60, "sunny-and-the-lyrebird"),
]

print("\n" + "="*70)
print("FIXING 17 BOOKS: Sonny → Sunny")
print("="*70 + "\n")

fixed_count = 0

for book_num, episode_dir_name in episodes_to_fix:
    episode_dir = EPISODES_DIR / episode_dir_name
    story_data = process_episode(episode_dir)

    if not story_data:
        print(f"⚠ Book {book_num:03d}: Could not load")
        continue

    story_title = story_data.get("title", f"Episode {book_num}")
    story_text = story_data.get("narration", "")

    if not story_text:
        print(f"⚠ Book {book_num:03d}: No story text")
        continue

    # Create output file
    output_file = OUTPUT_DIR / f"BOOK-{book_num:03d}-{story_title.replace(' ', '-')}.txt"

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

    print(f"✓ Book {book_num:03d}: {story_title}")
    fixed_count += 1

print("\n" + "="*70)
print(f"✅ FIXED {fixed_count} BOOKS")
print("="*70 + "\n")
