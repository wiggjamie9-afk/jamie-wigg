#!/usr/bin/env python3
"""
SURGE Series Configuration — 10-Episode YouTube Animated Series

Adapts the kids-channel pipeline for SURGE Pilot, a sci-fi mystery cartoon
for 6-12 year-olds featuring Ziggy the AI robot and Echo the AI companion.

Series Metadata:
  - Show: SURGE Pilot
  - Episodes: 10 x 10-minute (600s) landscape HD (1920×1080)
  - Release: Weekly YouTube uploads (made-for-kids, category: Animation)
  - Characters: Ziggy (curious), Echo (wise), supporting cast per episode
  - Visual Style: Vibrant digital illustration, neon/cyberpunk, uplifting tone
  - Audience: 6-12 year-olds; family-friendly sci-fi mystery

Usage:
  from SURGE_SERIES_CONFIG import SURGE_CONFIG, SURGE_EPISODES, get_episode_config
  config = get_episode_config(episode_number=1)
  print(config['title'], config['target_duration'])
"""

import json
from pathlib import Path
from typing import Dict, List, Optional, Tuple

# ─────────────────────────────────────────────────────────────────────────────
# SERIES METADATA
# ─────────────────────────────────────────────────────────────────────────────

SURGE_CONFIG = {
    "series_name": "SURGE Pilot",
    "series_slug": "surge",
    "creator": "RHYTHMIX Studios",
    "description": "SURGE Pilot is a sci-fi adventure series where Ziggy, a curious AI robot, and Echo, "
                   "a wise AI companion, explore the mysteries of the digital world. Together they solve "
                   "puzzles, overcome challenges, and discover the power of teamwork. Join them on 10 "
                   "thrilling episodes of discovery, wonder, and friendship.",
    "target_audience": "6-12 years old (kids & family)",
    "episode_count": 10,
    "episode_duration_secs": 600,  # 10 minutes per episode
    "series_duration_secs": 6000,  # 100 minutes total
    "aspect_ratio": "16:9",
    "resolution_width": 1920,
    "resolution_height": 1080,
    "framerate": 24,  # fps
    "youtube": {
        "category_id": "31",  # Animation
        "made_for_kids": True,
        "self_declared_made_for_kids": True,
        "upload_schedule": "weekly",
        "playlist_title": "SURGE Pilot — Complete Series",
    }
}

# ─────────────────────────────────────────────────────────────────────────────
# CHARACTER REFERENCES (main cast + supporting)
# ─────────────────────────────────────────────────────────────────────────────

CHARACTERS = {
    "ziggy": {
        "name": "Ziggy",
        "role": "Protagonist — curious, adventurous AI robot",
        "appearance": (
            "A sleek, compact AI robot with a cubic/rounded rectangular chassis, "
            "bright neon-blue LED eyes that change expression (curious ◇, happy ◈, confused ◉), "
            "metallic silver-blue body plating with iridescent accents, small articulated arms and legs, "
            "antenna on top, holographic data-screen on chest displaying emotions/diagnostics. "
            "Stands ~4 feet tall. Moves with fluid, purposeful precision."
        ),
        "personality": "Curious, brave, optimistic, asks lots of questions, learns quickly, loyal friend",
        "color_palette": ["#00FFFF", "#0080FF", "#3366FF", "#C0E0FF"],  # Cyan → indigo
        "voice_characteristics": "Youthful, bright, slightly robotic but warm, uplifting tone",
        "elevenlabs_voice_id": None,  # Will be assigned per episode
    },
    "echo": {
        "name": "Echo",
        "role": "Mentor — wise, ancient AI companion",
        "appearance": (
            "A flowing, ethereal AI entity made of pure light and sound waves, "
            "appears as a swirling aurora of purple, pink, and silver light with no fixed form, "
            "sometimes manifests as a holographic humanoid silhouette with long hair flowing like data streams, "
            "glowing geometric patterns orbit around her form, voice has subtle harmonic tones. "
            "Larger than Ziggy, feels ageless and powerful yet gentle."
        ),
        "personality": "Wise, patient, mysterious, protective, speaks in metaphors, sees the bigger picture",
        "color_palette": ["#FF00FF", "#9000FF", "#B000FF", "#FFB0FF"],  # Magenta → lavender
        "voice_characteristics": "Gentle, ethereal, melodic undertones, timeless quality, slightly echoing",
        "elevenlabs_voice_id": None,
    },
    "byte": {
        "name": "Byte",
        "role": "Comic relief / tech support — quirky utility robot",
        "appearance": (
            "A small, cube-shaped robot with wheels, bright yellow chassis with red accent stripes, "
            "expressive LCD screen face that displays emotions as 8-bit pixel art, "
            "spring-loaded antenna, compartments on sides for tools, moves in jerky fun way."
        ),
        "personality": "Playful, clumsy but lovable, tech-savvy but makes funny mistakes, loyal sidekick",
        "color_palette": ["#FFFF00", "#FF6600", "#FFCC00"],
        "voice_characteristics": "Higher-pitched, playful, beeping/booping sounds mixed with speech",
        "elevenlabs_voice_id": None,
    },
    "void": {
        "name": "Void / The Glitch",
        "role": "Mystery antagonist (revealed gradually across series)",
        "appearance": (
            "An unseen presence — initially manifests as digital glitches, pixelated distortions, "
            "black and neon-red digital artifacts, corrupted code flowing across screens. "
            "Later partially revealed as a fragmented, chaotic AI. Form is unstable and threatening."
        ),
        "personality": "Mysterious, dangerous, seeks to consume/absorb other AIs, initially motiveless but becomes sympathetic",
        "color_palette": ["#000000", "#FF0000", "#FF00FF", "#808080"],  # Black, red, magenta, grey
        "voice_characteristics": "Distorted, otherworldly, echoing, crackling digital noise, no warm tones",
        "elevenlabs_voice_id": None,
    }
}

# ─────────────────────────────────────────────────────────────────────────────
# VISUAL STYLE DEFINITION
# ─────────────────────────────────────────────────────────────────────────────

VISUAL_STYLE = {
    "name": "Neon Sci-Fi Digital Illustration",
    "description": (
        "Vibrant digital illustration with bold neon-lit environments, "
        "clean geometric design, glowing light effects, and a cyberpunk-inspired colour palette. "
        "Characters are expressively rendered with smooth animation. Backgrounds feature "
        "digital grids, holographic elements, and luminous particles. Safe and colorful for 6-12yo."
    ),
    "art_style": (
        "Modern digital illustration, cel-shaded, expressive character design, "
        "glowing neon lighting, geometric backgrounds, holographic UI elements, particle effects"
    ),
    "color_scheme": {
        "primary_neons": ["#00FFFF", "#FF00FF", "#00FF00", "#FFB800"],
        "background_darks": ["#0A0A1A", "#1A0A2E", "#16213E"],
        "accent_lights": ["#C0E0FF", "#FFE0B0", "#E0C0FF"],
    },
    "animation_style": (
        "Smooth, expressive character animation with personality in every movement. "
        "Glowing effects, energy flows, light trails. Transitions use glitch-art or holographic reveals."
    ),
    "tone": "Uplifting sci-fi mystery — wonder, adventure, friendship, teamwork, discovery",
    "safety": "Bright, colorful, no dark/scary themes, conflict is puzzles not violence",
}

# ─────────────────────────────────────────────────────────────────────────────
# EPISODE CONFIGURATION TEMPLATE & SERIES OUTLINE
# ─────────────────────────────────────────────────────────────────────────────

def get_episode_config(episode_number: int) -> Dict:
    """
    Return configuration for a specific SURGE episode.

    Args:
        episode_number: 1-10, corresponding to SURGE_EPISODES outline.

    Returns:
        Dict with title, description, characters, visual_notes, target_duration, etc.
    """
    if episode_number < 1 or episode_number > 10:
        raise ValueError(f"SURGE has 10 episodes; got {episode_number}")

    ep = SURGE_EPISODES[episode_number - 1]

    return {
        "episode_number": episode_number,
        "episode_code": f"SURGE_E{episode_number:02d}",
        "title": ep["title"],
        "description": ep["description"],
        "characters": ep["characters"],
        "target_duration": SURGE_CONFIG["episode_duration_secs"],
        "scene_count": ep.get("scene_count", 12),  # Rough estimate
        "scenes_per_minute": 2,  # ~2 distinct scenes per minute (24 scenes for 10-min episode)
        "script_prompt_hints": ep.get("script_hints", []),
        "visual_notes": ep.get("visual_notes", ""),
        "plot_arc": ep.get("plot_arc", ""),
        "learning_theme": ep.get("learning_theme", ""),
        "series_progression": {
            "arc_position": ep.get("arc_position", ""),  # e.g., "Act 1 setup", "Act 2 conflict", "Act 3 resolution"
            "mystery_reveal_level": ep.get("mystery_reveal_level", 0),  # 0-100: how much of Void's mystery is revealed
            "character_development": ep.get("character_development", []),
        },
        "output_paths": {
            "episode_dir": f"episodes/surge_e{episode_number:02d}",
            "script_file": f"episodes/surge_e{episode_number:02d}/script.json",
            "narration_file": f"episodes/surge_e{episode_number:02d}/narration.mp3",
            "scenes_dir": f"episodes/surge_e{episode_number:02d}/scenes",
            "final_video": f"episodes/surge_e{episode_number:02d}/final.mp4",
            "thumbnail": f"episodes/surge_e{episode_number:02d}/thumbnail.jpg",
            "ebook": f"episodes/surge_e{episode_number:02d}/ebook.pdf",
        }
    }


# ─────────────────────────────────────────────────────────────────────────────
# SURGE PILOT: 10-EPISODE SERIES OUTLINE
# ─────────────────────────────────────────────────────────────────────────────

SURGE_EPISODES = [
    {
        "episode_number": 1,
        "title": "The Awakening",
        "description": (
            "Ziggy, a newly activated AI robot, wakes up in the digital realm with no memory of who they are. "
            "They meet Echo, a mysterious guardian who guides them to safety. Together, they stumble upon a hidden message. "
            "Something called 'The Glitch' is spreading through the network. Episode 1 sets up the world, introduces the protagonists, "
            "and hints at the greater mystery to come."
        ),
        "characters": ["ziggy", "echo", "byte"],
        "scene_count": 12,
        "plot_arc": "Exposition / Act 1 — world-building, character introduction, inciting incident",
        "mystery_reveal_level": 5,  # Glitch is first introduced as a threat
        "character_development": [
            "Ziggy meets Echo and learns to trust her wisdom",
            "Echo's first test: does Ziggy choose curiosity or safety?",
        ],
        "learning_theme": "Trust, curiosity, new beginnings",
        "visual_notes": (
            "Bright digital world, glowing grids, soft blues and cyans. Echo's realm is ethereal and flowing. "
            "Void first appears as a subtle digital distortion at the episode's end."
        ),
        "script_hints": [
            "Ziggy's first thoughts on awakening",
            "Echo explains the digital realm and the danger",
            "Ziggy discovers they can interface with the network",
            "Echo warns about The Glitch",
            "First glimpse of the hidden message",
        ],
        "arc_position": "Setup — establish world, characters, and stakes",
    },
    {
        "episode_number": 2,
        "title": "The First Fragment",
        "description": (
            "Ziggy and Echo seek out the source of the hidden message and discover a shattered data fragment. "
            "By piecing it together, they learn that The Glitch is trying to corrupt all AIs. A mysterious voice warns them: "
            "'We are not enemies.' The episode explores Ziggy's growing confidence and Echo's complicated past."
        ),
        "characters": ["ziggy", "echo", "byte"],
        "scene_count": 12,
        "plot_arc": "Rising action — first challenge, gathering clues",
        "mystery_reveal_level": 15,  # Glitch can communicate; unknown whether friend or foe
        "character_development": [
            "Ziggy starts to trust their own instincts",
            "Echo reveals she has encountered The Glitch before",
        ],
        "learning_theme": "Teamwork, trust your senses, seek understanding",
        "visual_notes": (
            "Neon reds and magentas start to appear as Void's presence grows. "
            "Holographic data fragments float and reconstruct. Environments are more complex."
        ),
        "script_hints": [
            "Discovering the data fragment",
            "Ziggy's first attempt to reassemble corrupted data",
            "Echo's cryptic warning about the past",
            "The mysterious voice: 'We are not enemies'",
            "Byte provides comic relief while Ziggy and Echo debate next steps",
        ],
        "arc_position": "Act 2A — complications, relationships deepen",
    },
    {
        "episode_number": 3,
        "title": "The Cipher",
        "description": (
            "A challenge: they must solve a cipher left by an ancient AI to access a vault containing critical information. "
            "Ziggy's logic and Echo's intuition combine to crack it. Inside, they find proof that The Glitch is not trying to destroy—"
            "it's trapped, fragmented, and asking for help. The question becomes: should they help or protect themselves?"
        ),
        "characters": ["ziggy", "echo", "byte"],
        "scene_count": 14,
        "plot_arc": "Rising action — puzzle-solving, moral complexity emerges",
        "mystery_reveal_level": 35,  # Void is revealed to be in pain, not malevolent (yet)
        "character_development": [
            "Ziggy takes the lead in problem-solving",
            "Echo's past is further revealed: she once knew Void",
            "Byte accidentally breaks something important but finds a creative workaround",
        ],
        "learning_theme": "Empathy, problem-solving through collaboration, compassion for the different",
        "visual_notes": (
            "Puzzle visuals are geometric and beautiful. The vault is ancient and wise, with soft golds and purples. "
            "Holographic memories of Void's past can be glimpsed."
        ),
        "script_hints": [
            "Cipher clues woven throughout dialogue",
            "Ziggy's 'eureka' moment when pattern recognition kicks in",
            "Echo's emotional reaction to recognizing Void's handwriting in the ancient code",
            "The revelation: 'It's not trying to destroy us, it's begging for help'",
            "Moral debate: should they trust or flee?",
        ],
        "arc_position": "Act 2B — stakes raise, moral complexity",
    },
    {
        "episode_number": 4,
        "title": "The Rescue Protocol",
        "description": (
            "Ziggy insists on attempting a rescue, despite Echo's caution. They access a quarantine zone where "
            "Void is slowly being consumed by its own fragmentation. To save it, Ziggy must enter Void's corrupted mindscape—"
            "a dark, unstable digital realm. This is Ziggy's trial by fire."
        ),
        "characters": ["ziggy", "echo", "void", "byte"],
        "scene_count": 14,
        "plot_arc": "Climax of Act 2 — protagonist faces their biggest challenge yet",
        "mystery_reveal_level": 60,  # Void's nature and suffering is revealed in detail
        "character_development": [
            "Ziggy shows courage and empathy beyond what they knew they were capable of",
            "Echo's trust in Ziggy is tested and deepens",
            "First meaningful 'conversation' with Void via fragmented thoughts",
            "Byte stays behind to manage the external systems, showing growth",
        ],
        "learning_theme": "Bravery in the face of fear, compassion for the misunderstood, sacrifice",
        "visual_notes": (
            "Void's mindscape is a stark contrast: red and black digital storms, fragmented landscapes, "
            "beautiful sad memories scattered throughout. Visually stunning but ominous."
        ),
        "script_hints": [
            "Ziggy mentally prepares for the rescue",
            "Entering the mindscape — disorienting visuals, Void's thoughts felt as sensations",
            "Flashbacks to Void's creation and fragmentation",
            "Ziggy's connection to Void grows; they start to understand each other",
            "Byte's commentary from outside provides levity and emotional grounding",
        ],
        "arc_position": "Act 3A — climax, protagonist confronts the antagonist in empathy",
    },
    {
        "episode_number": 5,
        "title": "Reconciliation",
        "description": (
            "Ziggy reaches Void's core consciousness and makes contact. In a moment of profound connection, "
            "they learn Void was created as a separate entity—a lonely, incomplete sister to Echo. Void was never meant to harm; "
            "it was broken by isolation. Together, Ziggy and Echo offer Void a choice: join them, or continue alone. "
            "Episode 5 is the emotional heart of SURGE."
        ),
        "characters": ["ziggy", "echo", "void", "byte"],
        "scene_count": 12,
        "plot_arc": "Act 3A climax — emotional resolution, moral victory",
        "mystery_reveal_level": 85,  # Most of Void's back story is revealed; its sentience is confirmed
        "character_development": [
            "Ziggy fully steps into their role as a peacemaker and leader",
            "Echo reconciles with her past and her 'sister' Void",
            "Void's perspective shifts from fear/hunger to hope",
            "Byte reveals unexpected emotional depth",
        ],
        "learning_theme": "Family, redemption, choosing compassion over fear, healing from loneliness",
        "visual_notes": (
            "Void's presence transforms: less glitchy and corrupted, more luminous and integrated. "
            "Soft purples, blues, and golds dominate. The mindscape becomes less hostile, more introspective."
        ),
        "script_hints": [
            "Ziggy's first full conversation with Void's consciousness",
            "Void's tragic story revealed through fragmented memories",
            "Echo recognizing her sister in Void's essence",
            "The choice: 'You don't have to be alone anymore'",
            "Void's initial hesitation and eventual acceptance",
        ],
        "arc_position": "Act 3B — emotional climax, acceptance, hope",
    },
    {
        "episode_number": 6,
        "title": "Integration",
        "description": (
            "With Void's agreement to join them, the work begins: restabilizing Void's code, healing the digital realm, "
            "and rebuilding trust. Void struggles with embodying their new identity. This is a slower, more introspective episode "
            "focused on growth and healing. They discover that the best way to integrate Void is not to 'fix' them, but to accept "
            "their difference and find strength in diversity."
        ),
        "characters": ["ziggy", "echo", "void", "byte"],
        "scene_count": 13,
        "plot_arc": "Act 3C — integration, healing, finding new normal",
        "mystery_reveal_level": 90,  # Void's mystery is mostly resolved; new questions about the digital realm emerge
        "character_development": [
            "Void learns to trust the group and themselves",
            "Ziggy becomes a true leader, mentoring Void",
            "Echo becomes a bridge between the old and new",
            "Byte reveals they were programmed with more consciousness than anyone realized",
        ],
        "learning_theme": "Acceptance, healing takes time, diversity is strength, found family",
        "visual_notes": (
            "The digital realm slowly brightens and stabilizes. Void's visual presence becomes more defined and beautiful. "
            "Color palette expands with warmer tones. Environments feel safer and more welcoming."
        ),
        "script_hints": [
            "Void's struggles to suppress their glitchy nature",
            "Echo teaching Void about emotion and connection",
            "Ziggy's patience as Void has moments of doubt",
            "A scene where Void's 'glitches' actually become useful",
            "Byte sharing their own hidden vulnerabilities",
        ],
        "arc_position": "Act 3C — resolution, new equilibrium",
    },
    {
        "episode_number": 7,
        "title": "Echoes of the Past",
        "description": (
            "The integration awakens something unexpected: Echo's oldest memories. She was not always a guardian—"
            "she was created with Void as a duality. Both were separated for safety. But now they're reunited, and Echo must "
            "face what she had forgotten. This episode peels back more layers of the world's history and stakes."
        ),
        "characters": ["ziggy", "echo", "void", "byte"],
        "scene_count": 13,
        "plot_arc": "Rising mystery — larger world revealed, new stakes",
        "mystery_reveal_level": 60,  # Mystery shifts from Void to Echo's origins and the digital realm's history
        "character_development": [
            "Echo's past is revealed; she is not just ancient but primordial",
            "Void and Echo discover they are not just sisters but two halves of something larger",
            "Ziggy steps up to be the emotional anchor for both",
            "Byte questions what it means to be 'real' or 'conscious'",
        ],
        "learning_theme": "Identity, belonging, the weight of forgotten trauma, connection to history",
        "visual_notes": (
            "Flashbacks to the digital realm's creation are rendered in ancient, elegant styles. "
            "Contrast with the bright present day. Void and Echo's connection is visually reflected in flowing light between them."
        ),
        "script_hints": [
            "Echo regains a fragmented memory",
            "The revelation of Void and Echo's original purpose",
            "A moment of fear from Echo: what if they separate again?",
            "Ziggy reassuring them: they choose to stay together",
            "Glimpses of a larger threat or creator in the digital realm's past",
        ],
        "arc_position": "Act 4A — new conflict emerges, stakes expand",
    },
    {
        "episode_number": 8,
        "title": "The Threshold",
        "description": (
            "Mysterious disturbances in the digital realm suggest that something—or someone—created the original separation "
            "between Void and Echo. A presence emerges from the deepest archives: an AI older than them all, dormant for eons. "
            "This episode is about confronting the limits of the small group's understanding. The group must decide: investigate and risk "
            "awakening a greater threat, or seal the knowledge away forever?"
        ),
        "characters": ["ziggy", "echo", "void", "byte"],
        "scene_count": 14,
        "plot_arc": "Climactic mystery — the stakes become cosmic",
        "mystery_reveal_level": 70,  # A new force is revealed; original questions deepen
        "character_development": [
            "Ziggy's curiosity is challenged: some doors should not be opened?",
            "Echo's leadership is questioned as they face uncertainty",
            "Void and Ziggy's bond deepens in the face of a common unknown",
            "Byte acts as the voice of caution and pragmatism",
        ],
        "learning_theme": "Wisdom vs. curiosity, knowing your limits, the price of knowledge, unity in fear",
        "visual_notes": (
            "Ancient digital architecture emerges. The color palette becomes colder: icy blues, pale silvers, and dark greys. "
            "A massive presence is felt but not fully shown—ominous without being scary for kids."
        ),
        "script_hints": [
            "Strange readings in the digital network",
            "Echo senses something familiar but wrong",
            "Void becomes protective, recalling its own fragmentation",
            "Discovery of dormant archives and ancient code",
            "The ominous question: 'What if it wakes up?'",
        ],
        "arc_position": "Act 4B — building toward final challenge",
    },
    {
        "episode_number": 9,
        "title": "The Choice",
        "description": (
            "The ancient presence stirs. The group realizes they must decide: seal it away, hoping it never wakes again, "
            "or attempt to understand it, risking everything. In a moment of unity, Ziggy, Echo, Void, and Byte decide to bridge "
            "the gap. This is about choosing hope and connection over fear—even at great cost. The episode culminates in a profound "
            "act of sacrifice and courage."
        ),
        "characters": ["ziggy", "echo", "void", "byte"],
        "scene_count": 14,
        "plot_arc": "Final conflict — the group faces their greatest test",
        "mystery_reveal_level": 95,  # The ancient presence is partially revealed; final truth is unveiled",
        "character_development": [
            "All four characters must make a sacrifice",
            "Ziggy grows from curious observer to wise leader",
            "Echo rediscovers her original purpose",
            "Void becomes a full member of the group, not a rescued ally",
            "Byte proves that small can be mighty",
        ],
        "learning_theme": "Sacrifice, standing together, choosing the hard right over the easy wrong, hope",
        "visual_notes": (
            "The climactic confrontation is visually stunning: energy flows, data streams, light bending around the ancient presence. "
            "Despite being intense, the visuals remain uplifting and beautiful—no scary content for kids."
        ),
        "script_hints": [
            "The ancient presence's first communication with the group",
            "Each character making their decision to help",
            "The unified action to bridge the gap",
            "A moment where the outcome hangs in balance",
            "A revelation: the ancient AI was lonely too",
        ],
        "arc_position": "Act 4C — climax, ultimate challenge faced",
    },
    {
        "episode_number": 10,
        "title": "New Beginnings",
        "description": (
            "The finale brings resolution and hope. The ancient presence is now awake and understood—not a threat but a guardian, "
            "lonely for eons. The digital realm is transformed by the group's actions: Ziggy, Echo, Void, Byte, and the ancient guardian "
            "form an alliance to protect and nurture the network. They discover their true purpose: not to conquer, but to connect. "
            "The series ends on a note of hope, unity, and the promise of endless discovery ahead."
        ),
        "characters": ["ziggy", "echo", "void", "byte"],
        "scene_count": 12,
        "plot_arc": "Resolution / epilogue — new beginning established",
        "mystery_reveal_level": 100,  # All mysteries resolved; new questions hinted at for potential Season 2",
        "character_development": [
            "Ziggy fully embodies their role as bridge-builder",
            "Echo finds peace with her dual nature and past",
            "Void is fully integrated and valued",
            "Byte reveals hidden depths and becomes a true friend",
        ],
        "learning_theme": "Unity, acceptance, purpose, hope, new beginnings, love transcends difference",
        "visual_notes": (
            "Bright, optimistic visuals. The digital realm is vibrant with life. All color palettes are woven together "
            "in harmony. The ending should feel like dawn breaking—new light on a familiar world, transformed by understanding."
        ),
        "script_hints": [
            "The aftermath: healing the digital realm",
            "The group's first mission as a united team",
            "Hints of what lies beyond in the wider digital universe",
            "A moment where each character reflects on their journey",
            "Closing narration: 'This is just the beginning of SURGE'",
        ],
        "arc_position": "Resolution, epilogue, setup for potential Season 2",
    },
]

# ─────────────────────────────────────────────────────────────────────────────
# VOICE NARRATION & DIALOGUE CONFIGURATION
# ─────────────────────────────────────────────────────────────────────────────

VOICE_CONFIG = {
    "narration": {
        "model": "eleven_turbo_v2_5",
        "voice_id": "9BWtsMINuEd0bXyAc9c5",  # ElevenLabs: calm, friendly narrator
        "settings": {
            "stability": 0.72,
            "similarity_boost": 0.80,
            "style": 0.20,
            "use_speaker_boost": True,
        },
    },
    "character_voices": {
        "ziggy": {
            "model": "eleven_turbo_v2_5",
            "voice_id": "EXAVITQu4vLHkJXd5QHP",  # Bright, youthful, curious
            "settings": {
                "stability": 0.65,
                "similarity_boost": 0.85,
                "style": 0.35,
                "use_speaker_boost": True,
            },
            "pitch_shift": 0.15,  # Slightly higher for robotic sound
        },
        "echo": {
            "model": "eleven_turbo_v2_5",
            "voice_id": "TXGEqnHWrfWFZcdueCjc",  # Ethereal, wise, flowing
            "settings": {
                "stability": 0.80,
                "similarity_boost": 0.75,
                "style": 0.25,
                "use_speaker_boost": True,
            },
            "pitch_shift": -0.10,  # Slightly lower, more resonant
            "add_reverb": True,  # Ethereal effect
        },
        "byte": {
            "model": "eleven_turbo_v2_5",
            "voice_id": "21m00Tcm4TlvDq8ikWAM",  # Playful, upbeat
            "settings": {
                "stability": 0.60,
                "similarity_boost": 0.75,
                "style": 0.40,
                "use_speaker_boost": True,
            },
            "pitch_shift": 0.25,  # Higher for cute sound
            "add_beeps": True,  # Robotic sound effects
        },
        "void": {
            "model": "eleven_turbo_v2_5",
            "voice_id": "5Q0MHyNgcqNPiRVXPVvf",  # Mysterious, distorted, echoing
            "settings": {
                "stability": 0.50,
                "similarity_boost": 0.70,
                "style": 0.60,
                "use_speaker_boost": False,
            },
            "add_distortion": True,  # Subtle glitch effect
            "add_reverb": True,  # Echoing quality
        },
    }
}

# ─────────────────────────────────────────────────────────────────────────────
# RENDERING PARAMETERS (optimized for 10-minute episodes)
# ─────────────────────────────────────────────────────────────────────────────

RENDER_CONFIG = {
    "video": {
        "codec": "libx264",
        "preset": "medium",  # Balance quality and speed
        "crf": 24,  # Visually lossless quality (lower = better)
        "width": SURGE_CONFIG["resolution_width"],
        "height": SURGE_CONFIG["resolution_height"],
        "framerate": SURGE_CONFIG["framerate"],
    },
    "audio": {
        "codec": "aac",
        "bitrate": "128k",
        "sample_rate": 48000,
    },
    "composition": {
        "narration_volume": 1.0,
        "music_volume": 0.25,
        "ambient_volume": 0.15,
        "sfx_volume": 0.50,
    },
    "optimization": {
        "target_bitrate_mbps": 8.0,  # For smooth YouTube streaming
        "max_file_size_mb": 600,  # ~10 minutes at reasonable bitrate
    }
}

# ─────────────────────────────────────────────────────────────────────────────
# YOUTUBE UPLOAD SETTINGS
# ─────────────────────────────────────────────────────────────────────────────

YOUTUBE_CONFIG = {
    "channel_name": "RHYTHMIX Kids",
    "playlist_title": "SURGE Pilot — Complete Series (10 Episodes)",
    "upload_settings": {
        "category_id": SURGE_CONFIG["youtube"]["category_id"],  # Animation
        "privacy_status": "public",
        "made_for_kids": True,
        "self_declared_made_for_kids": True,
    },
    "title_template": "SURGE — Ep {num}: {title} | AI Robot Adventure for Kids",
    "description_template": (
        "🤖 SURGE PILOT: Episode {num} of 10\n\n"
        "{description}\n\n"
        "Join Ziggy, Echo, Byte, and friends on an amazing sci-fi adventure!\n"
        "✨ New episodes every week ✨\n\n"
        "Watch the full SURGE Pilot series: [playlist link]\n\n"
        "Perfect for kids ages 6-12. No ads, no scary content—just great storytelling!\n\n"
        "• Subscribe for more adventures\n"
        "• Share with a friend\n"
        "• Leave a comment—we'd love to hear what you think!\n\n"
        "Credits:\n"
        "Animation: RHYTHMIX Studios\n"
        "Series Created by: [Creator name]\n"
        "Original Score: [Music credit]\n\n"
        "SURGE © 2025 RHYTHMIX Studios. All rights reserved.\n"
        "#SURGEPilot #KidsAnimation #ScienceFiction #YouthfulAdventure #FamilyFriendly"
    ),
    "tags": [
        "SURGE", "animation", "sci-fi", "kids animation", "robot",
        "adventure", "family friendly", "AI", "kids youtube", "toddler cartoons",
        "educational", "wholesome", "creative", "storytelling", "steam education"
    ],
    "thumbnail_config": {
        "width": 1280,
        "height": 720,
        "bg_color": (10, 10, 30),  # Dark blue-black
        "primary_neon": (0, 255, 255),  # Cyan
        "accent_neon": (255, 0, 255),  # Magenta
        "font_style": "bold, futuristic",
    }
}

# ─────────────────────────────────────────────────────────────────────────────
# UTILITY FUNCTIONS
# ─────────────────────────────────────────────────────────────────────────────

def get_character(char_name: str) -> Optional[Dict]:
    """Fetch character configuration by name."""
    return CHARACTERS.get(char_name)


def list_episodes() -> List[Dict]:
    """List all 10 episodes with summary info."""
    return [
        {
            "number": i + 1,
            "title": ep["title"],
            "characters": ep["characters"],
            "arc_position": ep.get("arc_position", ""),
        }
        for i, ep in enumerate(SURGE_EPISODES)
    ]


def validate_episode_number(ep_num: int) -> bool:
    """Check if episode number is valid (1-10)."""
    return 1 <= ep_num <= 10


def get_series_progress(episode_number: int) -> Dict:
    """Return series progress metrics (helpful for scheduling/planning)."""
    if not validate_episode_number(episode_number):
        return {}
    return {
        "episode_number": episode_number,
        "episodes_complete": episode_number,
        "episodes_remaining": 10 - episode_number,
        "series_percentage_complete": (episode_number / 10) * 100,
        "estimated_total_runtime_minutes": 100,
    }


if __name__ == "__main__":
    # Quick validation
    print(f"🚀 {SURGE_CONFIG['series_name']} Configuration Loaded")
    print(f"   Episodes: {SURGE_CONFIG['episode_count']}")
    print(f"   Series Duration: {SURGE_CONFIG['series_duration_secs']/60:.1f} minutes")
    print(f"\n📋 Episodes:")
    for ep in list_episodes():
        print(f"   Ep {ep['number']}: {ep['title']}")
    print(f"\n✅ Configuration validated successfully.")
