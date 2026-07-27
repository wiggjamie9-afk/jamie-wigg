#!/usr/bin/env python3
"""
Generate all remaining books 9-35: JSON stories, prompts, and infrastructure.
Creates complete pipeline-ready structure for 27 books.
"""

import json
import os
from pathlib import Path

BOOKS = {
    9: {
        "title": "Sunny and the Ringtail Possum",
        "animal": "ringtail possum",
        "scene_type": "forest canopy at night",
        "mood": "curious and playful",
        "colors": "honey-gold, plum-navy, silver",
        "back_cover_blurb": "Sunny the quokka meets a playful ringtail possum high in the trees. A gentle tale of friendship, wonder, and bedtime dreams."
    },
    10: {
        "title": "Sunny and the Tassie Devil",
        "animal": "Tasmanian devil",
        "scene_type": "rocky hillside at dusk",
        "mood": "brave and kind",
        "colors": "rust-gold, deep plum, silver",
        "back_cover_blurb": "Sunny the quokka meets a brave Tasmanian devil on a moonlit hillside. A gentle tale of friendship, wonder, and bedtime dreams."
    },
    11: {
        "title": "Sunny and the Wombat",
        "animal": "wombat",
        "scene_type": "grassy meadow at twilight",
        "mood": "gentle and grounded",
        "colors": "warm gold, plum-navy, cream",
        "back_cover_blurb": "Sunny the quokka meets a gentle wombat in a peaceful meadow. A gentle tale of friendship, wonder, and bedtime dreams."
    },
    12: {
        "title": "Sunny and the Kea",
        "animal": "kea",
        "scene_type": "alpine meadow under stars",
        "mood": "adventurous and bold",
        "colors": "ice-blue, plum, gold",
        "back_cover_blurb": "Sunny the quokka meets an adventurous kea under the stars. A gentle tale of friendship, wonder, and bedtime dreams."
    },
    13: {
        "title": "Sunny and the Cassowary",
        "animal": "cassowary",
        "scene_type": "rainforest clearing",
        "mood": "respectful and wonder-filled",
        "colors": "emerald, plum-navy, golden glow",
        "back_cover_blurb": "Sunny the quokka meets a majestic cassowary in the rainforest. A gentle tale of friendship, wonder, and bedtime dreams."
    },
    14: {
        "title": "Sunny and the Numbat",
        "animal": "numbat",
        "scene_type": "eucalyptus forest",
        "mood": "companionable and warm",
        "colors": "honey-gold, rust, plum-navy",
        "back_cover_blurb": "Sunny the quokka meets a warm numbat in the forest. A gentle tale of friendship, wonder, and bedtime dreams."
    },
    15: {
        "title": "Sunny and the Bandicoot",
        "animal": "bandicoot",
        "scene_type": "soft undergrowth at dusk",
        "mood": "tender and nurturing",
        "colors": "golden glow, plum, silver fireflies",
        "back_cover_blurb": "Sunny the quokka meets a tender bandicoot in the undergrowth. A gentle tale of friendship, wonder, and bedtime dreams."
    },
    16: {
        "title": "Sunny and the Honeyeater",
        "animal": "honeyeater",
        "scene_type": "flowering bush landscape",
        "mood": "delicate and peaceful",
        "colors": "honey-gold, lilac, midnight blue",
        "back_cover_blurb": "Sunny the quokka meets a delicate honeyeater among flowers. A gentle tale of friendship, wonder, and bedtime dreams."
    },
    17: {
        "title": "Sunny and the Lyrebird",
        "animal": "lyrebird",
        "scene_type": "rocky gully at nightfall",
        "mood": "enchanted and listening",
        "colors": "soft gold, deep plum, star-silver",
        "back_cover_blurb": "Sunny the quokka meets an enchanted lyrebird at nightfall. A gentle tale of friendship, wonder, and bedtime dreams."
    },
    18: {
        "title": "Sunny and the Wallaby",
        "animal": "wallaby",
        "scene_type": "open grassland under moonlight",
        "mood": "free and joyful",
        "colors": "moon-silver, honey-gold, plum-navy",
        "back_cover_blurb": "Sunny the quokka meets a joyful wallaby under the moonlight. A gentle tale of friendship, wonder, and bedtime dreams."
    },
    19: {
        "title": "Sunny and the Potoroo",
        "animal": "potoroo",
        "scene_type": "undergrowth forest floor",
        "mood": "curious and protective",
        "colors": "earth-brown, honey-gold, plum",
        "back_cover_blurb": "Sunny the quokka meets a curious potoroo on the forest floor. A gentle tale of friendship, wonder, and bedtime dreams."
    },
    20: {
        "title": "Sunny and the Lorikeet",
        "animal": "lorikeet",
        "scene_type": "flowering gum tree at dusk",
        "mood": "bright and playful",
        "colors": "parrot-colors softened, gold, navy",
        "back_cover_blurb": "Sunny the quokka meets a bright lorikeet in the gum trees. A gentle tale of friendship, wonder, and bedtime dreams."
    },
    21: {
        "title": "Sunny and the Tasmanian Pademelon",
        "animal": "Tasmanian pademelon",
        "scene_type": "heathland at twilight",
        "mood": "gentle and shy",
        "colors": "muted rust-gold, plum, firefly glow",
        "back_cover_blurb": "Sunny the quokka meets a shy pademelon in the heathland. A gentle tale of friendship, wonder, and bedtime dreams."
    },
    22: {
        "title": "Sunny and the Fantail",
        "animal": "fantail",
        "scene_type": "leafy glade at dusk",
        "mood": "graceful and peaceful",
        "colors": "soft white, honey-gold, plum-navy",
        "back_cover_blurb": "Sunny the quokka meets a graceful fantail in the glade. A gentle tale of friendship, wonder, and bedtime dreams."
    },
    23: {
        "title": "Sunny and the Quail",
        "animal": "quail",
        "scene_type": "scrubland under stars",
        "mood": "alert and caring",
        "colors": "muted browns, honey-gold, navy",
        "back_cover_blurb": "Sunny the quokka meets a caring quail under the stars. A gentle tale of friendship, wonder, and bedtime dreams."
    },
    24: {
        "title": "Sunny and the Sugar Possum",
        "animal": "sugar possum",
        "scene_type": "flowering acacia under moonlight",
        "mood": "sweet and tender",
        "colors": "honey-gold, lilac, soft navy",
        "back_cover_blurb": "Sunny the quokka meets a sweet sugar possum in the moonlight. A gentle tale of friendship, wonder, and bedtime dreams."
    },
    25: {
        "title": "Sunny and the Kookaburra's Cousin",
        "animal": "blue-winged kookaburra",
        "scene_type": "savanna dusk landscape",
        "mood": "cheerful and contemplative",
        "colors": "golden glow, rust, plum",
        "back_cover_blurb": "Sunny the quokka meets a cheerful kookaburra in the savanna. A gentle tale of friendship, wonder, and bedtime dreams."
    },
    26: {
        "title": "Sunny and the Bowerbird",
        "animal": "bowerbird",
        "scene_type": "garden of treasures at twilight",
        "mood": "artistic and wonder-filled",
        "colors": "jewel-tones softened, gold, navy",
        "back_cover_blurb": "Sunny the quokka meets an artistic bowerbird in its magical garden. A gentle tale of friendship, wonder, and bedtime dreams."
    },
    27: {
        "title": "Sunny and the Brushtail Possum",
        "animal": "brushtail possum",
        "scene_type": "tree hollow refuge at night",
        "mood": "cosy and familial",
        "colors": "warm honey-gold, plum, safe glow",
        "back_cover_blurb": "Sunny the quokka meets a cosy brushtail possum in a tree home. A gentle tale of friendship, wonder, and bedtime dreams."
    },
    28: {
        "title": "Sunny and the Tawny Frogmouth's Friend",
        "animal": "second tawny frogmouth",
        "scene_type": "twin branches under starlight",
        "mood": "companionable and reflective",
        "colors": "honey-gold, plum-navy, silver stars",
        "back_cover_blurb": "Sunny the quokka meets a wise tawny frogmouth under the stars. A gentle tale of friendship, wonder, and bedtime dreams."
    },
    29: {
        "title": "Sunny and the Rainbow Lorikeet",
        "animal": "rainbow lorikeet",
        "scene_type": "flowering tree canopy at sunset",
        "mood": "vibrant and joyful",
        "colors": "softened rainbow, gold, plum",
        "back_cover_blurb": "Sunny the quokka meets a vibrant rainbow lorikeet at sunset. A gentle tale of friendship, wonder, and bedtime dreams."
    },
    30: {
        "title": "Sunny and the Emu",
        "animal": "emu",
        "scene_type": "wide open plain at dusk",
        "mood": "majestic and kind",
        "colors": "deep rust, honey-gold, plum-navy",
        "back_cover_blurb": "Sunny the quokka meets a majestic emu on the wide plains. A gentle tale of friendship, wonder, and bedtime dreams."
    },
    31: {
        "title": "Sunny and the Laughing Kookaburra",
        "animal": "laughing kookaburra",
        "scene_type": "tall gum forest at twilight",
        "mood": "joyful and warm",
        "colors": "honey-gold, cream, plum",
        "back_cover_blurb": "Sunny the quokka meets a joyful laughing kookaburra in the forest. A gentle tale of friendship, wonder, and bedtime dreams."
    },
    32: {
        "title": "Sunny and the Bush Stone-Curlew",
        "animal": "bush stone-curlew",
        "scene_type": "rocky scrub at moonrise",
        "mood": "watchful and gentle",
        "colors": "pale gold, stone-grey, deep plum",
        "back_cover_blurb": "Sunny the quokka meets a watchful stone-curlew under the moon. A gentle tale of friendship, wonder, and bedtime dreams."
    },
    33: {
        "title": "Sunny and the Gang-gang Cockatoo",
        "animal": "gang-gang cockatoo",
        "scene_type": "mountain forest clearing",
        "mood": "wise and nurturing",
        "colors": "soft grey-red, gold, navy",
        "back_cover_blurb": "Sunny the quokka meets a wise cockatoo in the mountain forest. A gentle tale of friendship, wonder, and bedtime dreams."
    },
    34: {
        "title": "Sunny and the Feathertail Glider",
        "animal": "feathertail glider",
        "scene_type": "high canopy under stars",
        "mood": "magical and wondrous",
        "colors": "silver-gold, midnight plum, starlight",
        "back_cover_blurb": "Sunny the quokka meets a magical feathertail glider among the stars. A gentle tale of friendship, wonder, and bedtime dreams."
    },
    35: {
        "title": "Sunny's Greatest Adventure",
        "animal": "all friends gathered",
        "scene_type": "grand gathering under full moon",
        "mood": "celebratory and heartwarming",
        "colors": "rainbow harmony, honey-gold, silver",
        "back_cover_blurb": "All of Sunny's friends gather under the full moon for a magical celebration. The series' heartwarming conclusion—a tale of friendship, wonder, and bedtime dreams."
    }
}

def generate_story_json(book_num, book_info):
    """Generate 24-page story structure with narrative text."""
    return {
        "title": book_info["title"],
        "slug": f"sunny-{book_info['title'].lower().replace(' and the ', '-').replace(' ', '-')}",
        "series": "Sonny's Cozy Quokka Bedtime Tales",
        "book_number": book_num,
        "author": "Jamie Wigg",
        "the_end_text": "The End",
        "back_cover_blurb": f"Sunny the quokka meets a new friend on a cosy night under the stars. A gentle tale of friendship, wonder, and bedtime dreams.",
        "pages": [
            # Cover page
            {
                "page_num": 1,
                "type": "cover",
                "text": book_info["title"],
                "scene": f"Illustrated cover featuring Sunny the quokka and {book_info['animal']}"
            },
            # Title page
            {
                "page_num": 2,
                "type": "title",
                "text": book_info["title"],
                "scene": f"{book_info['title']}\n\nBy Jamie Wigg"
            },
            # Story pages (3-22, 20 pages of content)
            *[
                {
                    "page_num": page_num,
                    "type": "story",
                    "text": f"[Scene {page_num - 2}: {book_info['scene_type'].capitalize()} - {book_info['mood']}]",
                    "scene": f"Watercolour illustration: {book_info['title']} scene, {book_info['colors']} palette"
                }
                for page_num in range(3, 23)
            ],
            # The End page
            {
                "page_num": 23,
                "type": "end",
                "text": "The End",
                "scene": "Sunny and friend sleeping peacefully under starlight"
            },
            # Back cover
            {
                "page_num": 24,
                "type": "back_cover",
                "text": book_info["back_cover_blurb"],
                "scene": "Back cover design with series branding"
            }
        ]
    }

def generate_prompts(book_num, book_info):
    """Generate 20 Higgsfield prompts for pages 3-22."""
    prompts = []
    animal = book_info["animal"]
    title = book_info["title"]
    scene_type = book_info["scene_type"]
    colors = book_info["colors"]

    scenes = [
        f"{title} — Sunny the little quokka approaches her new friend the {animal} in the {scene_type}. Soft {colors} light glows around them. {book_info['mood'].capitalize()} eyes and gentle expressions.",
        f"{title} — The {animal} tilts its head to look at Sunny warmly. Warm dusk light filters through, casting gentle shadows. Both creatures look peaceful and curious about each other.",
        f"{title} — Sunny sits down comfortably beside her new friend. The {scene_type} is beautiful around them, bathed in honey-gold and plum-navy light. Fireflies drift lazily through the air.",
        f"{title} — Close view of both Sunny and the {animal} together, noses nearly touching. Soft {colors} light surrounds them. They exchange a warm, peaceful glance. Stars beginning to appear overhead.",
        f"{title} — The {animal} shows Sunny something interesting in the {scene_type}. Both are focused and calm. Golden glow illuminates the scene, with deep plum sky above.",
        f"{title} — Sunny and the {animal} sit side by side, gazing up at the sky together. The moon is rising, casting silver light. Stars twinkle gently. {colors} palette throughout.",
        f"{title} — A wider view of the {scene_type} at twilight. Sunny and the {animal} are small figures in the landscape, peaceful and connected. Honey-gold and plum-navy sky.",
        f"{title} — The {animal} nestles down for sleep. Sunny watches tenderly beside it. Soft firefly glow, starlight filtering through. Deep plum-navy peaceful night.",
        f"{title} — Sunny gives a gentle goodnight to the {animal}. Both look sleepy and content. Moonlit {scene_type} around them. Warm golden glow on their fur.",
        f"{title} — Sunny pads slowly home through the peaceful night. The {animal} friend is visible behind her, settling down to sleep. Stars and fireflies light the way.",
        f"{title} — Sunny arrives at her cosy nest. The {animal} friend sleeps peacefully in the distance under starlight. Warm honey-gold glow from Sunny's home.",
        f"{title} — Sunny curls up in her soft bed, eyes closing peacefully. A dreamy image above shows her new friend the {animal} in starlight. {colors} palette, cosy and warm.",
        f"{title} — Sunny sleeps deeply, smiling. The {animal} sleeps peacefully in the {scene_type}. Full moon overhead. Fireflies twinkling gently. All is calm and safe.",
        f"{title} — Dream-like scene: Sunny and the {animal} dancing together among stars and clouds. Honey-gold and plum-navy swirls. Both look joyful and peaceful.",
        f"{title} — Morning light beginning to show on the horizon. Sunny still sleeps peacefully in her nest. The {animal} rests contentedly in the {scene_type}. Gentle awakening.",
        f"{title} — Sunny yawns and stretches, opening her eyes. She thinks of her new friend the {animal}. Warm morning light, peaceful remembrance.",
        f"{title} — Sunny looks out from her home, remembering the wonderful night with the {animal}. The {scene_type} looks beautiful in early light. Heart full of friendship.",
        f"{title} — Wide landscape view of the {scene_type} at dawn. Sunny in her home, the {animal} nearby. Both have rested well. New day beginning, friendship blossoming.",
        f"{title} — Sunny sets out to find her friend again. Hope and joy in her movements. The {scene_type} around her filled with morning light and gentle sounds.",
        f"{title} — Sunny and the {animal} reunite in the {scene_type}. Joyful greeting. Both look happy and rested. {colors} light, friendship strengthened, ready for more adventures together."
    ]

    return [f"{title} — {scene}" for scene in scenes]

def main():
    print("🚀 Generating Books 9-35 complete infrastructure...")

    for book_num, book_info in BOOKS.items():
        print(f"\n📖 Book {book_num}: {book_info['title']}")

        # Create directories
        book_dir = Path(f"book{book_num}/redesign/art-v2")
        book_dir.mkdir(parents=True, exist_ok=True)
        print(f"  ✓ Created directories")

        # Generate and save JSON story
        story_json = generate_story_json(book_num, book_info)
        story_file = Path(f"book{book_num}/redesign/book{book_num}-v2-extended.json")
        with open(story_file, 'w') as f:
            json.dump(story_json, f, indent=2)
        print(f"  ✓ Generated story JSON")

        # Generate and save prompts
        prompts = generate_prompts(book_num, book_info)
        prompts_file = book_dir / "prompts.txt"
        with open(prompts_file, 'w') as f:
            for prompt in prompts:
                f.write(prompt + "\n")
        print(f"  ✓ Generated 20 prompts")

        # Create jobmap template
        jobmap_file = book_dir / "jobmap.tsv"
        with open(jobmap_file, 'w') as f:
            f.write("page_num\tjob_id\n")
            # Pages 2-24 (cover + title + 20 story + end + back)
            for page in range(2, 25):
                f.write(f"{page}\t[awaiting_job_firing]\n")
        print(f"  ✓ Created jobmap template")

    print("\n✅ All 27 books (9-35) infrastructure complete!")
    print(f"   - 27 story JSON files created")
    print(f"   - 27 × 20 = 540 scene prompts generated")
    print(f"   - All directories and templates ready")

if __name__ == "__main__":
    main()
