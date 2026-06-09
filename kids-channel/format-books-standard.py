#!/usr/bin/env python3
"""
SUNNY'S COZY BEDTIME TALES — BOOK FORMATTING SYSTEM
Formats all 149 stories to LOCKED STANDARD for manual upload
Front cover + story pages with 2 lines text per page
"""

import json
from pathlib import Path
from datetime import datetime

OUTPUT_DIR = Path("/home/user/jamie-wigg/formatted-books")
EPISODES_DIR = Path("/home/user/jamie-wigg/kids-channel/episodes")
OUTPUT_DIR.mkdir(exist_ok=True)

# LOCKED BOOK COVER TEMPLATE
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

# LOCKED STORY PAGE TEMPLATE
STORY_PAGE_TEMPLATE = """
PAGE {page_num}
================================================================================
ILLUSTRATION: Sunny in scene with {scene_description}

TEXT (2 LINES):
{line1}
{line2}
================================================================================
"""

def load_episode_script(episode_num):
    """Load episode script from JSON"""
    episode_dir = EPISODES_DIR / f"episode-{episode_num:03d}"
    script_file = episode_dir / "script.json"

    if not script_file.exists():
        return None

    try:
        with open(script_file, 'r') as f:
            data = json.load(f)
        return data
    except Exception as e:
        print(f"  ⚠ Error loading episode {episode_num}: {e}")
        return None

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

def create_book_from_story(episode_num, story_data):
    """Create formatted book from story data"""

    if not story_data:
        return False

    story_title = story_data.get("title", f"Episode {episode_num}")
    story_text = story_data.get("story", "")

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

def generate_manifest():
    """Create manifest of all formatted books"""
    manifest = """
================================================================================
SUNNY'S COZY BEDTIME TALES — FORMATTED BOOKS MANIFEST
================================================================================

FORMAT STANDARD (LOCKED):
✓ Page 1: Book cover with title, story name, tagline
✓ Pages 2+: Story pages with Sunny illustration + 2 lines text per page
✓ Text spread evenly across pages
✓ Character: Sunny (consistent throughout)
✓ Colors: Navy + Gold + Cream
✓ Style: Professional illustrated, warm, whimsical

STRUCTURE:
- Each file is a complete formatted book
- Ready for manual input/upload
- Follow the exact format shown
- No deviations from locked standard

FILES GENERATED:
"""

    book_files = sorted(OUTPUT_DIR.glob("BOOK-*.txt"))

    for i, book_file in enumerate(book_files, 1):
        manifest += f"\n{i}. {book_file.name}"

    manifest += f"""

TOTAL BOOKS: {len(book_files)}

MANUAL UPLOAD INSTRUCTIONS:
1. Open each BOOK-XXX-*.txt file
2. Follow the format exactly as shown
3. Page 1: Book cover (title, story name, tagline, illustration description)
4. Pages 2+: Story pages (illustration + 2 lines text per page)
5. Upload to your ebook/merchandise system
6. Do NOT deviate from this format

LOCKED STANDARD - NO CHANGES
Created: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
================================================================================
"""

    manifest_file = OUTPUT_DIR / "MANIFEST.txt"
    with open(manifest_file, 'w') as f:
        f.write(manifest)

    return len(book_files)

def main():
    print("\n" + "="*80)
    print("SUNNY'S COZY BEDTIME TALES — BOOK FORMATTING SYSTEM")
    print("Formatting all 149 stories to LOCKED STANDARD")
    print("="*80 + "\n")

    successful = 0
    failed = 0

    for episode_num in range(1, 150):
        story_data = load_episode_script(episode_num)

        if story_data and create_book_from_story(episode_num, story_data):
            successful += 1
            print(f"✓ Book {episode_num:03d}: {story_data.get('title', 'Unknown')}")
        else:
            failed += 1
            print(f"⚠ Book {episode_num:03d}: Failed to create")

    # Generate manifest
    total = generate_manifest()

    print("\n" + "="*80)
    print(f"✅ FORMATTING COMPLETE")
    print("="*80)
    print(f"\nBooks created: {successful}")
    print(f"Books failed: {failed}")
    print(f"Total formatted: {total}")
    print(f"\nOutput directory: {OUTPUT_DIR}")
    print(f"\nAll books ready for manual upload")
    print(f"Format: Front cover page + Story pages (2 lines each)")
    print(f"Character: Sunny (consistent throughout)")
    print(f"Standard: LOCKED - No deviations")
    print("\n" + "="*80 + "\n")

if __name__ == "__main__":
    main()
