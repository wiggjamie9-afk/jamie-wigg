#!/usr/bin/env python3
"""
Create professional character design sheet for Sunny the Quokka.
Museum-quality design suitable for production reference.
Matches the beautiful illustrated children's book style from reference images.
"""

from PIL import Image, ImageDraw, ImageFont
import math

# Create canvas: A4 equivalent at 300 DPI = 2480x3508px
# We'll do 2400x3200 for standard print-ready quality
WIDTH = 2400
HEIGHT = 3200
DPI = 300

# Create new image with cream/off-white background (like quality paper)
img = Image.new('RGB', (WIDTH, HEIGHT), color=(248, 245, 240))
draw = ImageDraw.Draw(img, 'RGBA')

# Load or create font for titles
try:
    title_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 48)
    label_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 32)
    detail_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 24)
except:
    title_font = ImageFont.load_default()
    label_font = ImageFont.load_default()
    detail_font = ImageFont.load_default()

# Color palette - locked from philosophy
WARM_GOLDEN = (184, 132, 71)  # Warm golden-brown
CREAM = (245, 241, 232)  # Cream accents
DEEP_SHADOW = (89, 62, 44)  # Deep warm shadow
SOFT_BROWN = (150, 105, 65)  # Mid-tone fur
NEUTRAL_TEXT = (26, 45, 92)  # Navy text

def draw_sunny_front_view(x, y, scale=1.0):
    """Draw Sunny from front view - chubby, round, peaceful"""
    # Body - large rounded circle, chubby silhouette
    body_x, body_y = x, y
    body_w = int(180 * scale)
    body_h = int(200 * scale)

    # Draw body with gradient effect using layered circles
    draw.ellipse([body_x - body_w//2, body_y - body_h//2,
                  body_x + body_w//2, body_y + body_h//2],
                 fill=WARM_GOLDEN, outline=DEEP_SHADOW, width=2)

    # Add soft shadow on right side for depth
    shadow_ellipse = [body_x + body_w//4, body_y - body_h//2 + 20,
                      body_x + body_w//2, body_y + body_h//2 - 30]
    draw.ellipse(shadow_ellipse, fill=SOFT_BROWN)

    # Head - integrated into body, no neck segmentation
    head_y = body_y - body_h//3
    head_w = int(160 * scale)
    head_h = int(170 * scale)
    draw.ellipse([x - head_w//2, head_y - head_h//2,
                  x + head_w//2, head_y + head_h//2],
                 fill=WARM_GOLDEN, outline=DEEP_SHADOW, width=2)

    # Ears - small round ears with cream lining
    ear_size = int(35 * scale)
    # Left ear
    draw.ellipse([x - head_w//3 - ear_size, head_y - head_h//3 - ear_size,
                  x - head_w//3 + ear_size, head_y - head_h//3 + ear_size],
                 fill=WARM_GOLDEN, outline=DEEP_SHADOW, width=2)
    # Cream lining in ear
    draw.ellipse([x - head_w//3 - ear_size//2, head_y - head_h//3 - ear_size//2,
                  x - head_w//3 + ear_size//2, head_y - head_h//3 + ear_size//2],
                 fill=CREAM)

    # Right ear
    draw.ellipse([x + head_w//3 - ear_size, head_y - head_h//3 - ear_size,
                  x + head_w//3 + ear_size, head_y - head_h//3 + ear_size],
                 fill=WARM_GOLDEN, outline=DEEP_SHADOW, width=2)
    # Cream lining
    draw.ellipse([x + head_w//3 - ear_size//2, head_y - head_h//3 - ear_size//2,
                  x + head_w//3 + ear_size//2, head_y - head_h//3 + ear_size//2],
                 fill=CREAM)

    # Eyes - large, gentle, warm brown
    eye_y = head_y - int(10 * scale)
    eye_spacing = int(45 * scale)
    eye_size = int(20 * scale)

    # Left eye
    draw.ellipse([x - eye_spacing - eye_size, eye_y - eye_size,
                  x - eye_spacing + eye_size, eye_y + eye_size],
                 fill=(101, 67, 33))  # Warm brown
    # Eye shine for gentleness
    draw.ellipse([x - eye_spacing - eye_size//3, eye_y - eye_size//3,
                  x - eye_spacing + eye_size//4, eye_y + eye_size//4],
                 fill=(220, 200, 160))

    # Right eye
    draw.ellipse([x + eye_spacing - eye_size, eye_y - eye_size,
                  x + eye_spacing + eye_size, eye_y + eye_size],
                 fill=(101, 67, 33))
    draw.ellipse([x + eye_spacing - eye_size//3, eye_y - eye_size//3,
                  x + eye_spacing + eye_size//4, eye_y + eye_size//4],
                 fill=(220, 200, 160))

    # Nose - small, pointed
    nose_y = head_y + int(15 * scale)
    nose_size = int(8 * scale)
    draw.polygon([(x - nose_size, nose_y),
                  (x + nose_size, nose_y),
                  (x, nose_y + nose_size * 1.5)],
                 fill=DEEP_SHADOW)

    # Mouth - natural soft smile
    mouth_y = head_y + int(35 * scale)
    mouth_w = int(50 * scale)
    mouth_h = int(15 * scale)
    # Subtle smile curve
    draw.arc([x - mouth_w, mouth_y - mouth_h,
              x + mouth_w, mouth_y + mouth_h],
             0, 180, fill=DEEP_SHADOW, width=3)

    # Belly - cream accents
    belly_size = int(60 * scale)
    draw.ellipse([x - belly_size//2, body_y + body_h//6 - belly_size//2,
                  x + belly_size//2, body_y + body_h//6 + belly_size//2],
                 fill=CREAM)

def draw_sunny_side_view(x, y, scale=1.0):
    """Draw Sunny from side view - profile, peaceful pose"""
    # Body profile - round, weighted
    body_w = int(160 * scale)
    body_h = int(190 * scale)
    draw.ellipse([x - body_w//2, y - body_h//2,
                  x + body_w//2, y + body_h//2],
                 fill=WARM_GOLDEN, outline=DEEP_SHADOW, width=2)

    # Head - slightly elevated
    head_y = y - body_h//3
    head_w = int(140 * scale)
    head_h = int(150 * scale)
    draw.ellipse([x - head_w//2, head_y - head_h//2,
                  x + head_w//2, head_y + head_h//2],
                 fill=WARM_GOLDEN, outline=DEEP_SHADOW, width=2)

    # Ear - visible from side
    ear_size = int(30 * scale)
    ear_x = x + head_w//3
    draw.ellipse([ear_x - ear_size, head_y - head_h//3 - ear_size,
                  ear_x + ear_size, head_y - head_h//3 + ear_size],
                 fill=WARM_GOLDEN, outline=DEEP_SHADOW, width=2)
    draw.ellipse([ear_x - ear_size//2, head_y - head_h//3 - ear_size//2,
                  ear_x + ear_size//2, head_y - head_h//3 + ear_size//2],
                 fill=CREAM)

    # Eye - single from side
    eye_x = x + int(30 * scale)
    eye_y = head_y - int(5 * scale)
    eye_size = int(18 * scale)
    draw.ellipse([eye_x - eye_size, eye_y - eye_size,
                  eye_x + eye_size, eye_y + eye_size],
                 fill=(101, 67, 33))
    draw.ellipse([eye_x - eye_size//4, eye_y - eye_size//4,
                  eye_x + eye_size//4, eye_y + eye_size//4],
                 fill=(220, 200, 160))

    # Nose - pointed from side
    nose_x = x + head_w//2
    nose_y = head_y + int(10 * scale)
    draw.polygon([(nose_x - 5, nose_y - 3),
                  (nose_x + 8, nose_y),
                  (nose_x, nose_y + 8)],
                 fill=DEEP_SHADOW)

    # Mouth - gentle curve
    mouth_y = head_y + int(30 * scale)
    draw.arc([x + int(10 * scale), mouth_y - int(10 * scale),
              x + int(60 * scale), mouth_y + int(10 * scale)],
             0, 180, fill=DEEP_SHADOW, width=2)

    # Belly from side
    belly_w = int(50 * scale)
    belly_h = int(40 * scale)
    draw.ellipse([x - belly_w//4, y + body_h//6 - belly_h//2,
                  x + belly_w//2, y + body_h//6 + belly_h//2],
                 fill=CREAM)

def draw_sunny_sleeping(x, y, scale=1.0):
    """Draw Sunny in sleeping/resting position - curled peacefully"""
    # Curled body - C shape
    body_w = int(150 * scale)
    body_h = int(200 * scale)

    # Main body curve
    draw.ellipse([x - body_w//2, y - body_h//2,
                  x + body_w//2, y + body_h//2],
                 fill=WARM_GOLDEN, outline=DEEP_SHADOW, width=2)

    # Head curled down - touching body
    head_size = int(130 * scale)
    head_x = x - body_w//4
    head_y = y + body_h//3
    draw.ellipse([head_x - head_size//2, head_y - head_size//2,
                  head_x + head_size//2, head_y + head_size//2],
                 fill=WARM_GOLDEN, outline=DEEP_SHADOW, width=2)

    # Ear visible
    ear_size = int(25 * scale)
    draw.ellipse([head_x - head_size//3, head_y - head_size//3,
                  head_x - head_size//3 + ear_size, head_y - head_size//3 + ear_size],
                 fill=WARM_GOLDEN, outline=DEEP_SHADOW, width=2)
    draw.ellipse([head_x - head_size//3 + ear_size//3, head_y - head_size//3 + ear_size//3,
                  head_x - head_size//3 + ear_size*2//3, head_y - head_size//3 + ear_size*2//3],
                 fill=CREAM)

    # Closed eye
    eye_size = int(12 * scale)
    draw.ellipse([head_x + int(15 * scale) - eye_size, head_y - int(10 * scale) - eye_size//2,
                  head_x + int(15 * scale) + eye_size, head_y - int(10 * scale) + eye_size//2],
                 fill=(101, 67, 33))
    # Sleepy eyelash mark
    draw.line([(head_x + int(10 * scale), head_y - int(15 * scale)),
               (head_x + int(25 * scale), head_y - int(18 * scale))],
              fill=DEEP_SHADOW, width=2)

    # Peaceful smile
    mouth_y = head_y + int(20 * scale)
    draw.arc([head_x - int(20 * scale), mouth_y - int(8 * scale),
              head_x + int(20 * scale), mouth_y + int(8 * scale)],
             0, 180, fill=DEEP_SHADOW, width=2)

    # Belly visible
    draw.ellipse([x - int(40 * scale), y - int(30 * scale),
                  x + int(40 * scale), y + int(30 * scale)],
                 fill=CREAM)

# Layout: 3 character views on professional sheet
margin = 150
top_margin = 250

# Title
title_text = "Sunny the Quokka"
subtitle_text = "Character Design Sheet | Production Reference"

# Center and draw title
bbox = draw.textbbox((0, 0), title_text, font=title_font)
title_width = bbox[2] - bbox[0]
draw.text(((WIDTH - title_width) // 2, 80), title_text, fill=NEUTRAL_TEXT, font=title_font)

# Subtitle
bbox = draw.textbbox((0, 0), subtitle_text, font=label_font)
subtitle_width = bbox[2] - bbox[0]
draw.text(((WIDTH - subtitle_width) // 2, 160), subtitle_text, fill=DEEP_SHADOW, font=label_font)

# Draw three views
y_positions = [top_margin + 400, top_margin + 400, top_margin + 1600]
view_labels = ["Front View", "Side Profile", "Sleeping Pose"]
x_positions = [margin + 300, WIDTH // 2 + 200, margin + 300]

# Front view
draw_sunny_front_view(x_positions[0], y_positions[0], scale=0.8)
bbox = draw.textbbox((0, 0), view_labels[0], font=label_font)
label_width = bbox[2] - bbox[0]
draw.text((x_positions[0] - label_width // 2, y_positions[0] + 350),
          view_labels[0], fill=NEUTRAL_TEXT, font=label_font)

# Side profile
draw_sunny_side_view(x_positions[1], y_positions[1], scale=0.8)
bbox = draw.textbbox((0, 0), view_labels[1], font=label_font)
label_width = bbox[2] - bbox[0]
draw.text((x_positions[1] - label_width // 2, y_positions[1] + 350),
          view_labels[1], fill=NEUTRAL_TEXT, font=label_font)

# Sleeping pose
draw_sunny_sleeping(x_positions[2], y_positions[2], scale=0.8)
bbox = draw.textbbox((0, 0), view_labels[2], font=label_font)
label_width = bbox[2] - bbox[0]
draw.text((x_positions[2] - label_width // 2, y_positions[2] + 350),
          view_labels[2], fill=NEUTRAL_TEXT, font=label_font)

# Color palette reference at bottom
palette_y = HEIGHT - 350
draw.text((margin, palette_y), "Color Palette", fill=NEUTRAL_TEXT, font=label_font)

# Palette swatches with labels
palette_items = [
    ("Warm Golden-Brown", WARM_GOLDEN),
    ("Cream Accents", CREAM),
    ("Deep Shadow", DEEP_SHADOW),
    ("Soft Mid-Tone", SOFT_BROWN),
]

swatch_x = margin
swatch_y = palette_y + 60
swatch_size = 40
spacing = 450

for i, (label, color) in enumerate(palette_items):
    x = swatch_x + (i * spacing)
    # Draw swatch
    draw.rectangle([x, swatch_y, x + swatch_size, swatch_y + swatch_size],
                   fill=color, outline=NEUTRAL_TEXT, width=2)
    # Draw label
    draw.text((x, swatch_y + swatch_size + 15), label, fill=NEUTRAL_TEXT, font=detail_font)

# Character specs text
specs_y = palette_y + 200
specs_text = [
    "Proportions: Extremely chubby and round like a teddy bear",
    "Expression: Large gentle warm brown eyes, peaceful smile",
    "Details: Small round ears with cream-colored lining",
    "Style: Professional illustrated children's book illustration (detailed, warm, realistic yet friendly)",
]

for i, spec in enumerate(specs_text):
    draw.text((margin, specs_y + (i * 50)), spec, fill=NEUTRAL_TEXT, font=detail_font)

# Save as high-quality PNG
output_path = "/home/user/jamie-wigg/SUNNY-CHARACTER-DESIGN-SHEET.png"
img.save(output_path, quality=95)
print(f"✓ Character design sheet created: {output_path}")
print(f"  Resolution: {WIDTH}x{HEIGHT} pixels (print-ready)")
print(f"  Format: Professional character design reference sheet")
print(f"  Includes: Front view, side profile, sleeping pose")
print(f"  Color palette: Locked and documented")
