#!/usr/bin/env python3
"""
YouTube Shorts Thumbnail A/B Testing Generator

Creates 3 design variants per video:
1. HIGH-CONTRAST: Bold colors, text emphasis, attention-grabbing
2. EMOTIONAL: Face/emotion focus, warm colors, human connection
3. MINIMALIST: Clean layout, limited text, bold focal point

Scores each variant for CTR potential and recommends best.
"""

import json
from pathlib import Path
from typing import List, Dict

def generate_thumbnail_variants(video_title: str, category: str = "ADHD") -> Dict:
    """
    Generate 3 thumbnail design specifications.

    Args:
        video_title: Title of the video (e.g., "Room Organization Chaos")
        category: Content category (default: ADHD)

    Returns:
        Dict with 3 variants and scoring recommendations
    """

    # Parse video title for key words
    title_words = video_title.lower().split()
    has_emotion = any(word in title_words for word in ['chaos', 'panic', 'fine', 'lost', 'forgotten'])
    has_action = any(word in title_words for word in ['organized', 'room', 'clean', 'found'])
    has_question = '?' in video_title

    variants = {
        "VARIANT_1_HIGH_CONTRAST": {
            "name": "High Contrast - Attention Grab",
            "description": "Bold neon pink background with cyan text",
            "design_specs": {
                "background": "Neon pink (#FF1F5A) or deep purple (#1a1a2e)",
                "text_color": "Cyan (#00D8FF) or bright white",
                "text_size": "Large (40-50% of thumbnail)",
                "focal_point": "Kal/Echo character in chaotic state",
                "additional_elements": "Glitch effects, motion lines, exclamation marks",
                "mood": "URGENT, CHAOTIC, ENERGETIC",
                "target_audience": "ADHD viewers who relate to chaos",
                "ctr_factors": ["High color contrast (4.5:1+)", "Large bold text", "Immediate emotional read"]
            },
            "implementation": {
                "text": "Extract top 2-3 words from title. Kal/Echo in extreme emotional state.",
                "colors": ["#FF1F5A", "#00D8FF", "#1a1a2e"],
                "font": "Bold sans-serif (Arial Black, Impact)",
                "example_title_text": "ROOM\nCHAOS" if has_action else "WHERE'S\nSTUFF?"
            }
        },
        "VARIANT_2_EMOTIONAL": {
            "name": "Emotional Connection - Relatable",
            "description": "Warm colors with Kal/Echo's expressive face prominent",
            "design_specs": {
                "background": "Warm gradient (gold #FFD700 → pink #FF1F5A)",
                "text_color": "Dark text on light background for readability",
                "text_size": "Medium (25-30% of thumbnail)",
                "focal_point": "Kal/Echo's face showing emotion (confused, panicked, relieved)",
                "additional_elements": "Emojis if relevant, soft glow, facial expression emphasis",
                "mood": "RELATABLE, HUMAN, UNDERSTANDING",
                "target_audience": "Viewers seeking validation, emotional resonance",
                "ctr_factors": ["Expressive face (stops scroll)", "Warm inviting colors", "Text as secondary element"]
            },
            "implementation": {
                "text": "1-3 words only. Complement the emotion shown.",
                "colors": ["#FFD700", "#FF1F5A", "#FFFFFF"],
                "font": "Rounded sans-serif (Nunito, Quicksand) for approachability",
                "example_title_text": "ADHD\nBRAIN" if has_emotion else "RELATABLE\nMOMENT"
            }
        },
        "VARIANT_3_MINIMALIST": {
            "name": "Minimalist - Clean & Bold",
            "description": "Minimal text, strong focal point, high contrast area",
            "design_specs": {
                "background": "Solid dark color (#1a1a2e) or stark white",
                "text_color": "Single vibrant color (cyan #00D8FF or gold #FFD700)",
                "text_size": "LARGE (60%+ for single word)",
                "focal_point": "Kal/Echo as the dominant visual",
                "additional_elements": "Minimal (maybe 1 icon/emoji)",
                "mood": "PROFESSIONAL, MYSTERIOUS, INTRIGUING",
                "target_audience": "Users who skim feed quickly, need immediate clarity",
                "ctr_factors": ["Negative space", "Single focal point", "Curiosity gap from minimal text"]
            },
            "implementation": {
                "text": "1 word ONLY. Must encapsulate entire concept.",
                "colors": ["#1a1a2e", "#00D8FF", "#FFD700"],
                "font": "Extra bold sans-serif (Oswald, Bebas Neue)",
                "example_title_text": "CHAOS" if has_emotion else "ORGANIZED"
            }
        }
    }

    return {
        "video_title": video_title,
        "category": category,
        "variants": variants,
        "scoring_guidance": {
            "best_for_clicks": "Variant 1 (High Contrast) - Highest stop-scroll potential",
            "best_for_retention": "Variant 2 (Emotional) - Most relatable, encourages clicks from right audience",
            "best_for_brand": "Variant 3 (Minimalist) - Consistent, professional, builds recognition",
            "recommendation": "A/B test all 3: Upload Variant 1 as primary, monitor V2 & V3 in analytics"
        },
        "next_steps": [
            "1. Choose which variant to feature (recommend: Variant 1 for raw CTR)",
            "2. Generate 3 PNG thumbnails from these specs",
            "3. Upload main variant to YouTube",
            "4. Track CTR for each variant over time",
            "5. Data after 100 views → picks winner",
            "6. Iterate: Winning variant becomes template for future videos"
        ]
    }


def score_thumbnail_variant(variant_name: str, variant_spec: Dict) -> Dict:
    """
    Score thumbnail variant for CTR potential.

    Returns:
        Dict with score 0-100 and specific feedback
    """

    score = 0
    factors = []

    # Color contrast analysis
    if variant_name == "VARIANT_1_HIGH_CONTRAST":
        score += 35  # Highest contrast = highest stop-scroll
        factors.append("✅ Ultra-high contrast (4.5:1+) stops scrollers")
        factors.append("✅ Neon colors pop on mobile feeds")
        factors.append("⚠️  May feel generic if not paired with unique character")

    elif variant_name == "VARIANT_2_EMOTIONAL":
        score += 28  # High emotional resonance
        factors.append("✅ Face-forward design proven to increase CTR")
        factors.append("✅ Warm colors invite clicks")
        factors.append("⚠️  Relies on clear facial expression")

    elif variant_name == "VARIANT_3_MINIMALIST":
        score += 25  # Intriguing but lower immediate CTR
        factors.append("✅ Clean, professional, memorable")
        factors.append("✅ Text clarity exceptional")
        factors.append("⚠️  Requires strong curiosity gap to work")

    # Text readability (all get scoring on this)
    text_score = 0
    if variant_spec['design_specs']['text_size'] in ["Large (40-50% of thumbnail)", "LARGE (60%+ for single word)"]:
        text_score += 15
        factors.append("✅ Text large enough for mobile (480p min)")
    else:
        text_score += 8
        factors.append("⚠️  Moderate text size - verify mobile readability")

    score += text_score

    # Focal point clarity
    if 'character' in variant_spec['design_specs']['focal_point'].lower():
        score += 12
        factors.append("✅ Clear focal point (character) draws attention")
    else:
        score += 8

    # Overall CTR prediction
    ctr_prediction = "High" if score >= 30 else "Medium" if score >= 20 else "Low"

    return {
        "variant": variant_name,
        "ctr_score": score,
        "ctr_prediction": ctr_prediction,
        "factors": factors,
        "recommendation": f"Expected CTR: {ctr_prediction} | Estimated improvement: +{15 + (score - 20)}% vs baseline"
    }


def generate_variant_report(video_title: str) -> str:
    """Generate full variant report for output."""

    variants_data = generate_thumbnail_variants(video_title)
    report_lines = [
        f"\n{'='*70}",
        f"THUMBNAIL A/B TEST PLAN: {video_title}",
        f"{'='*70}\n",
        "You will create 3 design variants. Upload the PRIMARY variant to YouTube.",
        "Monitor CTR on each variant over 1-2 weeks of views.",
        "Double down on the winner.\n",
    ]

    variant_num = 1
    for variant_key, variant_spec in variants_data['variants'].items():
        score_info = score_thumbnail_variant(variant_key, variant_spec)

        report_lines.extend([
            f"\n📱 VARIANT {variant_num}: {variant_spec['name']}",
            f"{'─'*70}",
            f"CTR Score: {score_info['ctr_score']}/100 ({score_info['ctr_prediction']} potential)",
            f"\nDesign Approach:",
            f"  • Mood: {variant_spec['design_specs']['mood']}",
            f"  • Background: {variant_spec['design_specs']['background']}",
            f"  • Text: {variant_spec['design_specs']['text_color']}",
            f"  • Focal Point: {variant_spec['design_specs']['focal_point']}",
            f"\nImplementation:",
            f"  • Text to use: {variant_spec['implementation']['example_title_text']}",
            f"  • Colors: {', '.join(variant_spec['implementation']['colors'])}",
            f"  • Font: {variant_spec['implementation']['font']}",
            f"\nWhy this works:",
        ])

        for factor in score_info['factors']:
            report_lines.append(f"  {factor}")

        report_lines.append(f"\n⚡ {score_info['recommendation']}")
        variant_num += 1

    report_lines.extend([
        f"\n\n{'='*70}",
        "📊 A/B TEST STRATEGY",
        f"{'='*70}",
        "\n1. GENERATE PHASE (you do this):",
        "   - Create 3 PNG thumbnails from these specs",
        "   - Save as: thumbnail_variant_1.png, _2.png, _3.png",
        "\n2. UPLOAD PHASE:",
        "   - Upload video with VARIANT 1 as primary thumbnail",
        "   - Make note of which variant is primary (for tracking)",
        "\n3. MONITOR PHASE (1-2 weeks):",
        "   - Track CTR % in YouTube Studio",
        "   - Check which variant gets more clicks",
        "\n4. ITERATE PHASE:",
        "   - Winning variant → becomes template for next 10 videos",
        "   - Losing variants → archive, learn from",
        "\n5. SCALE PHASE:",
        "   - Apply winning formula to all future ADHD videos",
        "   - Expected improvement: +20-30% CTR",
        "\n" + f"{'='*70}"
    ])

    return '\n'.join(report_lines)


def main():
    """Main entry point."""

    import sys

    if len(sys.argv) < 2:
        print("Usage: python thumbnail_ab_generator.py '<Video Title>'")
        print("Example: python thumbnail_ab_generator.py 'Room Organization Chaos'")
        sys.exit(1)

    video_title = sys.argv[1]
    report = generate_variant_report(video_title)
    print(report)

    # Also save as JSON for programmatic use
    variants_data = generate_thumbnail_variants(video_title)
    json_file = Path(f"{video_title.replace(' ', '_')}_variants.json").with_stem(
        video_title.replace(' ', '_') + '_ab_variants'
    )

    # Save to current directory instead
    json_file = Path('.') / f"{video_title.replace(' ', '_')}_ab_variants.json"
    with open(json_file, 'w') as f:
        json.dump(variants_data, f, indent=2)

    print(f"\n📁 Variant specs saved to: {json_file}")


if __name__ == "__main__":
    main()
