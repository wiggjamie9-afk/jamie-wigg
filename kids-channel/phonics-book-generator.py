#!/usr/bin/env python3
"""
Sunny's Phonics & Spelling Books Generator
Creates educational phonics books: Letter sounds, words, practice, sentences.

Format (4 pages per letter):
Page 1: Letter introduction + sound
Page 2: Sunny + illustrations of words starting with letter
Page 3: Writing practice (trace & write)
Page 4: Simple sentence with Sunny
"""

import json
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

# Phonics curriculum (A-Z)
PHONICS_CURRICULUM = {
    'A': {
        'letter': 'A',
        'sound': 'aaa (apple)',
        'words': ['apple', 'ant', 'arrow', 'arm', 'add'],
        'sentence': 'Sunny found an apple in the bush.'
    },
    'B': {
        'letter': 'B',
        'sound': 'bbb (ball)',
        'words': ['ball', 'bat', 'bell', 'bed', 'box'],
        'sentence': 'Sunny plays with a blue ball.'
    },
    'C': {
        'letter': 'C',
        'sound': 'ccc (cat)',
        'words': ['cat', 'can', 'car', 'cup', 'cold'],
        'sentence': 'Sunny saw a cute cat.'
    },
    'D': {
        'letter': 'D',
        'sound': 'ddd (dog)',
        'words': ['dog', 'day', 'dig', 'door', 'down'],
        'sentence': 'Sunny danced all day long.'
    },
    'E': {
        'letter': 'E',
        'sound': 'eee (egg)',
        'words': ['egg', 'eat', 'end', 'even', 'ear'],
        'sentence': 'Sunny ate an egg for dinner.'
    },
    'F': {
        'letter': 'F',
        'sound': 'fff (fish)',
        'words': ['fish', 'fun', 'fan', 'far', 'five'],
        'sentence': 'Sunny found a friendly fish.'
    },
    'G': {
        'letter': 'G',
        'sound': 'ggg (gate)',
        'words': ['gate', 'go', 'girl', 'gold', 'good'],
        'sentence': 'Sunny went through the garden gate.'
    },
    'H': {
        'letter': 'H',
        'sound': 'hhh (hat)',
        'words': ['hat', 'hand', 'happy', 'help', 'home'],
        'sentence': 'Sunny wore a happy hat.'
    },
    'I': {
        'letter': 'I',
        'sound': 'iii (igloo)',
        'words': ['igloo', 'ink', 'is', 'in', 'ice'],
        'sentence': 'Sunny is inside playing.'
    },
    'J': {
        'letter': 'J',
        'sound': 'jjj (jump)',
        'words': ['jump', 'jar', 'jam', 'joy', 'just'],
        'sentence': 'Sunny jumps with joy!'
    },
    'K': {
        'letter': 'K',
        'sound': 'kkk (kite)',
        'words': ['kite', 'king', 'kind', 'keep', 'kick'],
        'sentence': 'Sunny and the king flew a kite.'
    },
    'L': {
        'letter': 'L',
        'sound': 'lll (lion)',
        'words': ['lion', 'long', 'like', 'look', 'light'],
        'sentence': 'Sunny loves the long path.'
    },
    'M': {
        'letter': 'M',
        'sound': 'mmm (moon)',
        'words': ['moon', 'make', 'many', 'may', 'meet'],
        'sentence': 'Sunny saw the moon at night.'
    },
    'N': {
        'letter': 'N',
        'sound': 'nnn (nest)',
        'words': ['nest', 'nose', 'nice', 'new', 'not'],
        'sentence': 'Sunny found a new nest.'
    },
    'O': {
        'letter': 'O',
        'sound': 'ooo (orange)',
        'words': ['orange', 'open', 'old', 'over', 'one'],
        'sentence': 'Sunny opened an orange.'
    },
    'P': {
        'letter': 'P',
        'sound': 'ppp (pig)',
        'words': ['pig', 'play', 'panda', 'pond', 'pet'],
        'sentence': 'Sunny played by the pond.'
    },
    'Q': {
        'letter': 'Q',
        'sound': 'kwuh (queen)',
        'words': ['queen', 'quilt', 'quick', 'quit', 'quest'],
        'sentence': 'Sunny went on a quick quest.'
    },
    'R': {
        'letter': 'R',
        'sound': 'rrr (rabbit)',
        'words': ['rabbit', 'run', 'rain', 'red', 'rest'],
        'sentence': 'Sunny rested by the rain.'
    },
    'S': {
        'letter': 'S',
        'sound': 'sss (sun)',
        'words': ['sun', 'sit', 'song', 'sand', 'see'],
        'sentence': 'Sunny sat in the sun and sang.'
    },
    'T': {
        'letter': 'T',
        'sound': 'ttt (tree)',
        'words': ['tree', 'take', 'tell', 'top', 'time'],
        'sentence': 'Sunny took time under the tree.'
    },
    'U': {
        'letter': 'U',
        'sound': 'uuu (up)',
        'words': ['up', 'under', 'use', 'unit', 'upon'],
        'sentence': 'Sunny climbed up high.'
    },
    'V': {
        'letter': 'V',
        'sound': 'vvv (van)',
        'words': ['van', 'very', 'visit', 'voice', 'vine'],
        'sentence': 'Sunny visited in a van.'
    },
    'W': {
        'letter': 'W',
        'sound': 'www (water)',
        'words': ['water', 'walk', 'way', 'warm', 'wild'],
        'sentence': 'Sunny walked by the water.'
    },
    'X': {
        'letter': 'X',
        'sound': 'zzz (xylophone)',
        'words': ['xylophone', 'x-ray', 'box', 'fox', 'mix'],
        'sentence': 'Sunny played the xylophone.'
    },
    'Y': {
        'letter': 'Y',
        'sound': 'yyy (yellow)',
        'words': ['yellow', 'yes', 'you', 'year', 'yard'],
        'sentence': 'Sunny said yes to the yellow yard.'
    },
    'Z': {
        'letter': 'Z',
        'sound': 'zzz (zebra)',
        'words': ['zebra', 'zoo', 'zero', 'zone', 'zip'],
        'sentence': 'Sunny went to the zoo with a zebra.'
    }
}


def create_phonics_page_1(letter_data: dict) -> Image.Image:
    """Page 1: Letter introduction and sound."""
    img = Image.new('RGB', (1920, 1080), 'white')
    draw = ImageDraw.Draw(img)

    try:
        # Large letter (center)
        draw.text((960, 300), letter_data['letter'], fill='#1a3a52',
                 font=None)  # Will use default, but in real code use ImageFont

        # Sound description
        draw.text((960, 600), f"says: {letter_data['sound']}", fill='#333333')

        # Instructions
        draw.text((960, 900), "Learn this letter sound", fill='#666666')

    except Exception as e:
        print(f"Error creating page 1: {e}")

    return img


def create_phonics_page_2(letter_data: dict) -> Image.Image:
    """Page 2: Sunny + words starting with letter."""
    img = Image.new('RGB', (1920, 1080), '#f5f5f5')
    draw = ImageDraw.Draw(img)

    try:
        # Title: "Words with [Letter]"
        draw.text((100, 50), f"Words that start with {letter_data['letter']}:",
                 fill='#1a3a52')

        # List words (5 per letter)
        y_pos = 250
        for word in letter_data['words']:
            draw.text((200, y_pos), f"• {word}", fill='#333333')
            y_pos += 150

        # Sunny description
        draw.text((100, 900), "Can you find these words? Draw pictures or write them!",
                 fill='#666666')

    except Exception as e:
        print(f"Error creating page 2: {e}")

    return img


def create_phonics_page_3(letter_data: dict) -> Image.Image:
    """Page 3: Writing practice (trace & write)."""
    img = Image.new('RGB', (1920, 1080), 'white')
    draw = ImageDraw.Draw(img)

    try:
        # Title
        draw.text((100, 50), f"Practice writing {letter_data['letter']}",
                 fill='#1a3a52')

        # Trace lines (faded)
        y_pos = 250
        for i in range(4):
            draw.text((200, y_pos), letter_data['letter'] * 5, fill='#cccccc')
            draw.text((200, y_pos + 100), '_______________', fill='#cccccc')
            y_pos += 200

        # Instructions
        draw.text((100, 950), "Trace the letters, then write your own!", fill='#666666')

    except Exception as e:
        print(f"Error creating page 3: {e}")

    return img


def create_phonics_page_4(letter_data: dict) -> Image.Image:
    """Page 4: Simple sentence with Sunny."""
    img = Image.new('RGB', (1920, 1080), '#f9f7f4')
    draw = ImageDraw.Draw(img)

    try:
        # Title
        draw.text((100, 50), "Read with Sunny", fill='#1a3a52')

        # Main sentence (larger)
        sentence = letter_data['sentence']
        draw.text((200, 400), sentence, fill='#333333')

        # Highlighted letter words
        draw.text((200, 650), f"Circle all the words that start with {letter_data['letter']}",
                 fill='#666666')

        # Practice line
        draw.text((200, 800), "Now write the sentence:", fill='#666666')
        draw.text((200, 900), '_' * 80, fill='#cccccc')

    except Exception as e:
        print(f"Error creating page 4: {e}")

    return img


def generate_phonics_book(letter: str, output_path: Path) -> bool:
    """Generate complete 4-page phonics book for a letter."""

    if letter.upper() not in PHONICS_CURRICULUM:
        print(f"❌ Letter {letter} not in curriculum")
        return False

    try:
        letter_data = PHONICS_CURRICULUM[letter.upper()]

        print(f"[Phonics] Generating book for letter {letter.upper()}...")

        # Create 4 pages
        pages = [
            create_phonics_page_1(letter_data),
            create_phonics_page_2(letter_data),
            create_phonics_page_3(letter_data),
            create_phonics_page_4(letter_data)
        ]

        # Save as PDF
        if pages:
            pages[0].save(
                str(output_path),
                save_all=True,
                append_images=pages[1:],
                duration=0,
                loop=0
            )
            print(f"✓ Phonics book created: {output_path.name}")
            return True
        else:
            return False

    except Exception as e:
        print(f"❌ Phonics book generation failed: {e}")
        return False


def generate_all_letters(output_dir: Path) -> int:
    """Generate phonics books for all 26 letters."""
    output_dir.mkdir(parents=True, exist_ok=True)

    print("\n" + "="*70)
    print("🎓 SUNNY'S PHONICS BOOKS GENERATOR")
    print("="*70)
    print(f"Generating 26 phonics books (A-Z)\n")

    successful = 0
    for letter in 'ABCDEFGHIJKLMNOPQRSTUVWXYZ':
        output_file = output_dir / f"Sunny's Phonics - Letter {letter}.pdf"
        if generate_phonics_book(letter, output_file):
            successful += 1

    print("\n" + "="*70)
    print(f"✅ Generated {successful}/26 phonics books")
    print("="*70)

    return successful


if __name__ == "__main__":
    output_dir = Path(__file__).parent / "phonics-books"
    generate_all_letters(output_dir)
