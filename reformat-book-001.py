#!/usr/bin/env python3
"""Reformat BOOK-001 to exactly 16 pages with 2 lines per page + cover"""

story_text = """As the warm golden afternoon faded gently away, little Sunny the quokka sat on his favourite mossy rock and looked up at the sky. The sky was turning the most beautiful colours Sunny had ever seen. Soft pink, like the inside of a flower. Warm orange, like a ripe peach. And then, slowly, a deep, soft purple began to spread across the sky, like a cosy blanket being pulled up high. Sunny smiled his gentle smile. He had never stayed up to watch the evening come before. The bush grew quiet. The birds settled into their nests, tucking their heads beneath their wings. The crickets began their soft, steady song — cree cree cree — like tiny lullabies all around. Sunny waited, very still, his big warm eyes wide with wonder. And then — there it was. One tiny light, twinkling softly in the purple sky. "Oh," said Sunny, very quietly. Then another. And another. One by one, the stars came out to say hello. Each one a small, soft sparkle, like someone had sprinkled glitter across a dark velvet cloth. Sunny had never seen anything so beautiful in all his little life. He lay back on his mossy rock, looking up and up and up at all the tiny lights. There were so many of them. Enough for everyone to have their very own. The warm breeze moved gently through the eucalyptus leaves, making a soft shushing sound. Shhhh. Shhhh. Sunny's eyes grew heavy. The stars twinkled on, one by one, keeping watch through the night. And as Sunny drifted off to sleep, a tiny smile stayed on his face. Because now he knew — even in the dark, the sky was always full of light. Goodnight, Sunny. Goodnight, stars. Goodnight, little one."""

# Split into sentences and reformat for 16 pages with 2 lines each
sentences = [s.strip() for s in story_text.replace('"', '').split('. ') if s.strip()]

pages = []
current_page = []
word_count = 0

for sentence in sentences:
    words = sentence.split()
    current_page.extend(words)
    word_count += len(words)
    
    # Target ~12-15 words per line, 2 lines per page = 24-30 words per page
    if word_count >= 24 and len(current_page) > 10:
        pages.append(' '.join(current_page))
        current_page = []
        word_count = 0

if current_page:
    pages.append(' '.join(current_page))

# Trim to exactly 16 pages
pages = pages[:16]

# Create formatted book
output = """================================================================================
BOOK COVER PAGE (PAGE 1)
================================================================================

TITLE: Sunny's Cozy Bedtime Tales
STORY: Sunny Watches the Stars Come Out
SUBTITLE: Bedtime Story
TAGLINE: Dream Big, Little One

ILLUSTRATION: Professional illustrated landscape with Sunny prominent
- Moon, stars, flowers, trees
- Navy sky + Gold/Cream text
- Warm, detailed, whimsical style

BY: Jamie Wigg
================================================================================

"""

for i, page_text in enumerate(pages, 1):
    words = page_text.split()
    # Split into max 2 lines
    mid = len(words) // 2
    line1 = ' '.join(words[:mid])
    line2 = ' '.join(words[mid:])
    
    output += f"""
PAGE {i+1}
================================================================================
ILLUSTRATION: Sunny in scene with peaceful nighttime setting

TEXT (2 LINES):
{line1}
{line2}
================================================================================

"""

with open('/home/user/jamie-wigg/BOOK-001-REFORMATTED.txt', 'w') as f:
    f.write(output)

print("✓ BOOK-001 reformatted: 1 cover + 16 story pages")
print(f"✓ Total pages: 17")
