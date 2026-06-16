#!/usr/bin/env python3
"""
Generate professional character design sheet for Sunny the quokka.
Creates a museum-quality reference sheet for illustrators and animators.
"""

from PIL import Image, ImageDraw, ImageFont
import math
from pathlib import Path

# Canvas dimensions: professional wide format
CANVAS_W = 2560
CANVAS_H = 1440

# Colors - Sunny's locked palette
COLOR_CANVAS = "#F9F7F3"  # Cream background
COLOR_GRID = "#E8E4DC"    # Grid lines
COLOR_TEXT = "#2A3A5C"    # Deep navy for text
COLOR_LIGHT_TEXT = "#6B7A8F"  # Medium navy for secondary text
COLOR_SUNNY_FUR_BASE = "#D4A574"  # Golden-brown fur
COLOR_SUNNY_FUR_LIGHT = "#E8D4B8"  # Cream/tan highlight
COLOR_SUNNY_FUR_DARK = "#8B6F47"   # Shadow tone
COLOR_EYE_IRIS = "#6B5344"  # Warm brown iris
COLOR_EYE_HIGHLIGHT = "#FFFFFF"  # White highlight
COLOR_EAR_INNER = "#D4A89B"  # Pink/tan inner lining
COLOR_NOSE = "#6B4423"  # Dark brown nose
COLOR_SPEC_LINE = "#2A3A5C"  # Specification lines

# Margin
MARGIN = 60
SECTION_GAP = 40
LINE_HEIGHT = 28

def draw_rounded_rect(draw, bbox, radius=20, outline=None, fill=None, width=1):
    """Draw a rounded rectangle."""
    x0, y0, x1, y1 = bbox
    r = radius

    # Draw corners as arcs and sides as lines
    draw.arc([x0, y0, x0 + 2*r, y0 + 2*r], 180, 270, fill=outline, width=width)
    draw.arc([x1 - 2*r, y0, x1, y0 + 2*r], 270, 360, fill=outline, width=width)
    draw.arc([x1 - 2*r, y1 - 2*r, x1, y1], 0, 90, fill=outline, width=width)
    draw.arc([x0, y1 - 2*r, x0 + 2*r, y1], 90, 180, fill=outline, width=width)

    # Sides
    draw.line([(x0 + r, y0), (x1 - r, y0)], fill=outline, width=width)
    draw.line([(x0, y0 + r), (x0, y1 - r)], fill=outline, width=width)
    draw.line([(x1 - r, y1), (x0 + r, y1)], fill=outline, width=width)
    draw.line([(x1, y0 + r), (x1, y1 - r)], fill=outline, width=width)

    # Fill
    if fill:
        draw.rectangle([x0 + 1, y0 + 1, x1 - 1, y1 - 1], fill=fill)

def draw_sunny_head_front(draw, cx, cy, size=80):
    """Draw front-facing Sunny head in clean line art."""
    # Head circle (slightly oval)
    head_w, head_h = size, size
    draw.ellipse([cx - head_w/2, cy - head_h/2, cx + head_w/2, cy + head_h/2],
                 outline=COLOR_SPEC_LINE, width=2)

    # Eyes (large, gentle, warm)
    eye_w, eye_h = size * 0.18, size * 0.25
    eye_y = cy - size * 0.1

    # Left eye
    draw.ellipse([cx - size*0.25 - eye_w/2, eye_y - eye_h/2,
                  cx - size*0.25 + eye_w/2, eye_y + eye_h/2],
                 outline=COLOR_SPEC_LINE, width=2)
    draw.ellipse([cx - size*0.25 - eye_w*0.35, eye_y - eye_h*0.3,
                  cx - size*0.25 + eye_w*0.15, eye_y + eye_h*0.1],
                 fill=COLOR_EYE_IRIS)
    draw.ellipse([cx - size*0.25 - eye_w*0.15, eye_y - eye_h*0.2,
                  cx - size*0.25 + eye_w*0.05, eye_y],
                 fill=COLOR_EYE_HIGHLIGHT)

    # Right eye
    draw.ellipse([cx + size*0.25 - eye_w/2, eye_y - eye_h/2,
                  cx + size*0.25 + eye_w/2, eye_y + eye_h/2],
                 outline=COLOR_SPEC_LINE, width=2)
    draw.ellipse([cx + size*0.25 - eye_w*0.15, eye_y - eye_h*0.3,
                  cx + size*0.25 + eye_w*0.35, eye_y + eye_h*0.1],
                 fill=COLOR_EYE_IRIS)
    draw.ellipse([cx + size*0.25 + eye_w*0.05, eye_y - eye_h*0.2,
                  cx + size*0.25 + eye_w*0.15, eye_y],
                 fill=COLOR_EYE_HIGHLIGHT)

    # Ears (small, round, soft inner lining)
    ear_w, ear_h = size * 0.15, size * 0.22
    # Left ear
    draw.ellipse([cx - size*0.32 - ear_w/2, cy - size*0.42 - ear_h/2,
                  cx - size*0.32 + ear_w/2, cy - size*0.42 + ear_h/2],
                 outline=COLOR_SPEC_LINE, width=2)
    draw.ellipse([cx - size*0.32 - ear_w*0.4, cy - size*0.42 - ear_h*0.3,
                  cx - size*0.32 + ear_w*0.4, cy - size*0.42 + ear_h*0.3],
                 fill=COLOR_EAR_INNER)

    # Right ear
    draw.ellipse([cx + size*0.32 - ear_w/2, cy - size*0.42 - ear_h/2,
                  cx + size*0.32 + ear_w/2, cy - size*0.42 + ear_h/2],
                 outline=COLOR_SPEC_LINE, width=2)
    draw.ellipse([cx + size*0.32 - ear_w*0.4, cy - size*0.42 - ear_h*0.3,
                  cx + size*0.32 + ear_w*0.4, cy - size*0.42 + ear_h*0.3],
                 fill=COLOR_EAR_INNER)

    # Nose (small, gentle point)
    nose_size = size * 0.1
    draw.polygon([
        (cx, cy + size*0.05),
        (cx - nose_size, cy + size*0.15),
        (cx + nose_size, cy + size*0.15)
    ], fill=COLOR_NOSE)

    # Mouth (gentle smile line)
    draw.arc([cx - size*0.2, cy + size*0.05, cx + size*0.2, cy + size*0.3],
             0, 180, fill=COLOR_SPEC_LINE, width=2)

def draw_sunny_sitting(draw, cx, cy, size=100):
    """Draw Sunny in sitting pose."""
    # Body (round, chubby)
    body_w, body_h = size * 0.6, size * 0.8
    draw.ellipse([cx - body_w/2, cy - body_h/2, cx + body_w/2, cy + body_h/2],
                 outline=COLOR_SPEC_LINE, width=2)

    # Head
    head_size = size * 0.45
    draw.ellipse([cx - head_size/2, cy - size*0.9 - head_size/2,
                  cx + head_size/2, cy - size*0.9 + head_size/2],
                 outline=COLOR_SPEC_LINE, width=2)

    # Eyes
    eye_w, eye_h = head_size * 0.2, head_size * 0.28
    eye_y = cy - size*0.9
    draw.ellipse([cx - head_size*0.15 - eye_w/2, eye_y - eye_h/2,
                  cx - head_size*0.15 + eye_w/2, eye_y + eye_h/2],
                 outline=COLOR_SPEC_LINE, width=2)
    draw.ellipse([cx + head_size*0.15 - eye_w/2, eye_y - eye_h/2,
                  cx + head_size*0.15 + eye_w/2, eye_y + eye_h/2],
                 outline=COLOR_SPEC_LINE, width=2)

    # Paws
    paw_size = size * 0.15
    draw.ellipse([cx - body_w*0.25 - paw_size, cy + body_h*0.35,
                  cx - body_w*0.25 + paw_size, cy + body_h*0.35 + paw_size*1.5],
                 outline=COLOR_SPEC_LINE, width=2)
    draw.ellipse([cx + body_w*0.25 - paw_size, cy + body_h*0.35,
                  cx + body_w*0.25 + paw_size, cy + body_h*0.35 + paw_size*1.5],
                 outline=COLOR_SPEC_LINE, width=2)

    # Tail
    draw.arc([cx - body_w*0.3, cy + body_h*0.2, cx + body_w*0.3, cy + body_h*0.8],
             45, 225, fill=COLOR_SPEC_LINE, width=2)

def draw_sunny_sleeping(draw, cx, cy, size=100):
    """Draw Sunny curled up sleeping."""
    # Curled body (large circle)
    body_size = size * 0.75
    draw.ellipse([cx - body_size/2, cy - body_size/2, cx + body_size/2, cy + body_size/2],
                 outline=COLOR_SPEC_LINE, width=2)

    # Head tucked
    head_size = size * 0.4
    draw.ellipse([cx - head_size*0.6, cy - body_size*0.3 - head_size/2,
                  cx - head_size*0.6 + head_size, cy - body_size*0.3 + head_size/2],
                 outline=COLOR_SPEC_LINE, width=2)

    # Eyes closed (gentle lines)
    eye_y = cy - body_size*0.3
    draw.line([(cx - head_size*0.3, eye_y - head_size*0.1),
               (cx - head_size*0.1, eye_y - head_size*0.1)],
              fill=COLOR_SPEC_LINE, width=2)
    draw.line([(cx - head_size*0.3, eye_y + head_size*0.05),
               (cx - head_size*0.1, eye_y + head_size*0.05)],
              fill=COLOR_SPEC_LINE, width=2)

    # Peaceful smile
    draw.arc([cx - head_size*0.4, eye_y + head_size*0.15,
              cx, eye_y + head_size*0.4],
             0, 180, fill=COLOR_SPEC_LINE, width=2)

    # Paw curled up
    paw_size = size * 0.12
    draw.ellipse([cx + body_size*0.2, cy + body_size*0.35,
                  cx + body_size*0.2 + paw_size*2, cy + body_size*0.35 + paw_size*1.5],
                 outline=COLOR_SPEC_LINE, width=2)

def draw_color_swatch(draw, x, y, width, height, color, label, font_small):
    """Draw a color swatch with hex code."""
    # Swatch box
    draw.rectangle([x, y, x + width, y + height], fill=color, outline=COLOR_SPEC_LINE, width=2)

    # Label below
    draw.text((x, y + height + 8), label, fill=COLOR_TEXT, font=font_small)

def main():
    """Generate the character sheet."""
    print("🎨 Generating Sunny Character Design Sheet...")

    # Create image
    img = Image.new("RGB", (CANVAS_W, CANVAS_H), COLOR_CANVAS)
    draw = ImageDraw.Draw(img)

    # Load fonts - use system defaults with different sizes
    try:
        font_title = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 48)
        font_section = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 36)
        font_label = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 24)
        font_small = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 18)
        font_tiny = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 14)
    except:
        font_title = font_section = font_label = font_small = font_tiny = ImageFont.load_default()

    # Title
    title_x = MARGIN
    title_y = MARGIN
    draw.text((title_x, title_y), "SUNNY", fill=COLOR_TEXT, font=font_title)
    draw.text((title_x, title_y + 56), "Character Design Sheet", fill=COLOR_LIGHT_TEXT, font=font_section)

    # Subtitle
    draw.text((title_x + 800, title_y + 20), "Sunny's Cozy Quokka Bedtime Tales",
              fill=COLOR_LIGHT_TEXT, font=font_label)

    # Grid line under title
    title_line_y = MARGIN + 140
    draw.line([(MARGIN, title_line_y), (CANVAS_W - MARGIN, title_line_y)],
              fill=COLOR_GRID, width=2)

    # --- SECTION 1: CHARACTER PROFILES (Front, Side, 3/4) ---
    section_y = title_line_y + 40
    draw.text((MARGIN, section_y), "01. CHARACTER PROFILES", fill=COLOR_TEXT, font=font_section)

    profile_y = section_y + 50
    profile_h = 280

    # Front view
    profile_box_x = MARGIN
    draw_rounded_rect(draw, (profile_box_x, profile_y, profile_box_x + 380, profile_y + profile_h),
                      radius=8, outline=COLOR_GRID, width=1)
    draw.text((profile_box_x + 120, profile_y + 250), "FRONT", fill=COLOR_LIGHT_TEXT, font=font_small)
    draw_sunny_head_front(draw, profile_box_x + 190, profile_y + 100, size=100)

    # Side view (simplified)
    profile_box_x = MARGIN + 420
    draw_rounded_rect(draw, (profile_box_x, profile_y, profile_box_x + 380, profile_y + profile_h),
                      radius=8, outline=COLOR_GRID, width=1)
    draw.text((profile_box_x + 130, profile_y + 250), "SIDE", fill=COLOR_LIGHT_TEXT, font=font_small)
    # Side profile line art
    draw.ellipse([profile_box_x + 120, profile_y + 50, profile_box_x + 260, profile_y + 190],
                 outline=COLOR_SPEC_LINE, width=2)  # Head
    draw.ellipse([profile_box_x + 80, profile_y + 120, profile_box_x + 280, profile_y + 240],
                 outline=COLOR_SPEC_LINE, width=2)  # Body

    # 3/4 view
    profile_box_x = MARGIN + 840
    draw_rounded_rect(draw, (profile_box_x, profile_y, profile_box_x + 380, profile_y + profile_h),
                      radius=8, outline=COLOR_GRID, width=1)
    draw.text((profile_box_x + 110, profile_y + 250), "THREE-QUARTER", fill=COLOR_LIGHT_TEXT, font=font_small)
    draw_sunny_head_front(draw, profile_box_x + 190, profile_y + 100, size=100)

    # --- SECTION 2: EXPRESSIONS ---
    section_y = profile_y + profile_h + 60
    draw.text((MARGIN, section_y), "02. EXPRESSIONS", fill=COLOR_TEXT, font=font_section)

    expr_y = section_y + 50
    expr_box_h = 200

    expressions = [
        ("PEACEFUL", 0),
        ("CURIOUS", 1),
        ("SLEEPY", 2),
        ("GENTLE", 3),
        ("WONDERING", 4),
        ("CONTENT", 5)
    ]

    expr_col_w = (CANVAS_W - MARGIN * 2) / 6
    for idx, (expr_name, col) in enumerate(expressions):
        expr_box_x = MARGIN + (col * expr_col_w) + 20
        draw_rounded_rect(draw, (expr_box_x, expr_y, expr_box_x + expr_col_w - 40, expr_y + expr_box_h),
                          radius=8, outline=COLOR_GRID, width=1)
        draw.text((expr_box_x + 15, expr_y + expr_box_h - 30), expr_name,
                  fill=COLOR_LIGHT_TEXT, font=font_tiny)
        # Simple face circles for each expression
        draw.ellipse([expr_box_x + 20, expr_y + 20, expr_box_x + expr_col_w - 60, expr_y + 130],
                     outline=COLOR_SPEC_LINE, width=2)

    # --- SECTION 3: POSES ---
    section_y = expr_y + expr_box_h + 60
    draw.text((MARGIN, section_y), "03. POSES", fill=COLOR_TEXT, font=font_section)

    pose_y = section_y + 50
    pose_box_w = (CANVAS_W - MARGIN * 2 - 40) / 3
    pose_box_h = 240

    poses = [("SITTING", lambda: draw_sunny_sitting(draw, MARGIN + pose_box_w/2 + 40, pose_y + 100, 80)),
             ("STANDING", lambda: draw.ellipse([MARGIN + pose_box_w + 80, pose_y + 40,
                                               MARGIN + pose_box_w + 180, pose_y + 180],
                                              outline=COLOR_SPEC_LINE, width=2)),
             ("SLEEPING", lambda: draw_sunny_sleeping(draw, MARGIN + pose_box_w * 2.5 + 40, pose_y + 100, 80))]

    for idx, (pose_name, draw_func) in enumerate(poses):
        pose_box_x = MARGIN + (idx * (pose_box_w + 20)) + 20
        draw_rounded_rect(draw, (pose_box_x, pose_y, pose_box_x + pose_box_w, pose_y + pose_box_h),
                          radius=8, outline=COLOR_GRID, width=1)
        draw_func()
        draw.text((pose_box_x + 15, pose_y + pose_box_h - 25), pose_name,
                  fill=COLOR_LIGHT_TEXT, font=font_small)

    # --- SECTION 4: COLOR PALETTE ---
    section_y = pose_y + pose_box_h + 40
    draw.text((MARGIN, section_y), "04. COLOR PALETTE", fill=COLOR_TEXT, font=font_section)

    palette_y = section_y + 50
    swatch_size = 80
    swatch_x_start = MARGIN

    color_palette = [
        (COLOR_SUNNY_FUR_BASE, "#D4A574 — Fur Base"),
        (COLOR_SUNNY_FUR_LIGHT, "#E8D4B8 — Highlight"),
        (COLOR_SUNNY_FUR_DARK, "#8B6F47 — Shadow"),
        (COLOR_EYE_IRIS, "#6B5344 — Eye Iris"),
        (COLOR_EAR_INNER, "#D4A89B — Ear Lining"),
        (COLOR_NOSE, "#6B4423 — Nose"),
    ]

    for idx, (color_val, label) in enumerate(color_palette):
        swatch_x = swatch_x_start + (idx % 6) * 380
        if idx >= 6:
            palette_y += 120
            swatch_x = swatch_x_start + (idx - 6) * 380

        draw_color_swatch(draw, swatch_x, palette_y, swatch_size, swatch_size, color_val, label, font_small)

    # --- SECTION 5: DESIGN NOTES ---
    section_y = palette_y + 160
    draw.text((MARGIN, section_y), "05. DESIGN SPECIFICATIONS", fill=COLOR_TEXT, font=font_section)

    notes_y = section_y + 50
    notes = [
        "PROPORTIONS: Head-to-body ratio 1:1.2  |  Eyes 25% of head height  |  Ears 22% of head height",
        "CHARACTER TRAITS: Peaceful • Gentle • Intelligent • Safe • Trustworthy • Calm",
        "BEDTIME DESIGN: Warm, rounded forms convey safety  |  Large eyes express gentleness + awareness",
        "COLOR THEORY: Golden-brown base creates warmth  |  Blue shadows add depth without harshness",
        "CONSISTENCY RULE: Sunny must appear identical across all illustrations (same proportions, same fur color)",
        "ANIMATION: All poses must maintain locked character proportions  |  Only expression/pose changes allowed"
    ]

    for idx, note in enumerate(notes):
        draw.text((MARGIN + 30, notes_y + idx * 32), note, fill=COLOR_LIGHT_TEXT, font=font_small)

    # Footer
    footer_y = CANVAS_H - 40
    draw.text((MARGIN, footer_y), "Professional Character Sheet  •  Museum-Quality Craftsmanship  •  For Illustrators & Animators",
              fill=COLOR_LIGHT_TEXT, font=font_small)

    # Save
    output_path = Path("/home/user/jamie-wigg/SUNNY-CHARACTER-CONCEPT-SHEET.png")
    img.save(output_path, quality=95)

    print(f"✅ Character sheet saved: {output_path}")
    print(f"   Dimensions: {CANVAS_W}×{CANVAS_H}")
    print(f"   Style: Professional clean line art + color swatches")
    print(f"   Ready for: Illustrators, animators, art directors")

if __name__ == "__main__":
    main()
