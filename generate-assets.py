#!/usr/bin/env python3
"""
Google Play Asset Generator for 28 Apps
Generates icons, feature graphics, and metadata CSV for all apps
"""

import os
import csv
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import io

# App configuration: slug, emoji, tagline, category, color
APPS = [
    # Emotional AI & Mental Health (Category color: Pink #FF6B9D)
    ('heartbeat', '❤️', 'Your AI friend who listens', 'Emotional AI', '#FF6B9D'),
    ('mood-journal', '📔', 'Track your emotional wellbeing', 'Emotional AI', '#FF6B9D'),
    ('meditation-guide', '🧘', 'Guided peace and mindfulness', 'Emotional AI', '#FF6B9D'),

    # Health & Medical (Category color: Blue #3B82F6)
    ('dreams', '💭', 'Understand your dream meanings', 'Health', '#3B82F6'),
    ('medicine-companion', '💊', 'Track your medications safely', 'Health', '#3B82F6'),
    ('blood-pressure-buddy', '🩺', 'Monitor your blood pressure', 'Health', '#3B82F6'),
    ('calorie-counter', '🍎', 'Track calories easily', 'Health', '#3B82F6'),
    ('weight-tracker', '⚖️', 'Monitor your weight progress', 'Health', '#3B82F6'),

    # Financial & Livelihood (Category color: Green #10B981)
    ('vendor-tracker', '🏪', 'Manage vendor inventory', 'Financial', '#10B981'),
    ('expense-tracker', '💰', 'Track every expense', 'Financial', '#10B981'),
    ('savings-challenge', '🎯', 'Save money with fun challenges', 'Financial', '#10B981'),
    ('loan-calculator', '📊', 'Calculate loans instantly', 'Financial', '#10B981'),
    ('goal-tracker', '🚀', 'Achieve your goals', 'Financial', '#10B981'),
    ('budget-tracker', '📈', 'Control your budget', 'Financial', '#10B981'),

    # Education & Learning (Category color: Purple #8B5CF6)
    ('english-pocket', '📚', 'Learn English on the go', 'Education', '#8B5CF6'),
    ('math-helper', '🔢', 'Master math problems', 'Education', '#8B5CF6'),
    ('study-planner', '🎓', 'Plan your study sessions', 'Education', '#8B5CF6'),
    ('trivia-quiz', '🧠', 'Test your knowledge', 'Education', '#8B5CF6'),

    # Productivity & Wellness (Category color: Cyan #06B6D4)
    ('notes', '📝', 'Quick and simple notes', 'Productivity', '#06B6D4'),
    ('tasklist', '✅', 'Organize your tasks', 'Productivity', '#06B6D4'),
    ('reminders', '🔔', 'Never forget anything', 'Productivity', '#06B6D4'),
    ('daily-planner', '📅', 'Plan your day perfectly', 'Productivity', '#06B6D4'),
    ('pomodoro-timer', '⏱️', 'Focus with pomodoro technique', 'Productivity', '#06B6D4'),
    ('workout-timer', '💪', 'Perfect workouts every time', 'Productivity', '#06B6D4'),
    ('period-tracker', '📍', 'Track your cycle precisely', 'Productivity', '#06B6D4'),

    # Lifestyle & Entertainment (Category color: Orange #F97316)
    ('quick-recipes', '🍳', 'Quick and easy recipes', 'Lifestyle', '#F97316'),
    ('voice-notes', '🎤', 'Record voice memos', 'Lifestyle', '#F97316'),
    ('habit-streak', '🔥', 'Build daily habits', 'Lifestyle', '#F97316'),

    # Tools & Assessment (Category color: Red #EF4444)
    ('lifeaudit', '🔍', 'Audit your entire life', 'Tools', '#EF4444'),
    ('water-tracker', '💧', 'Track your water intake', 'Tools', '#EF4444'),
]

def hex_to_rgb(hex_color):
    """Convert hex color to RGB tuple"""
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def create_icon(emoji, color_hex, slug):
    """Create a 512x512px app icon with emoji on colored background"""
    size = 512
    img = Image.new('RGBA', (size, size), (255, 255, 255, 0))
    draw = ImageDraw.Draw(img)

    # Convert hex to RGB
    rgb = hex_to_rgb(color_hex)

    # Draw rounded square background
    # Create a slightly smaller canvas for the colored area
    color_size = 460
    color_offset = (size - color_size) // 2

    # Draw the rounded rectangle as background
    for i in range(size):
        for j in range(size):
            x, y = i - size//2, j - size//2
            dist = (x**2 + y**2)**0.5
            if dist < color_size/2 - 20:
                # Main color area
                img.putpixel((i, j), rgb + (255,))
            elif dist < color_size/2:
                # Gradient edge (soft rounding)
                alpha = int(255 * (1 - (dist - (color_size/2 - 20)) / 20))
                if alpha > 0:
                    img.putpixel((i, j), rgb + (alpha,))

    # Draw emoji in center
    try:
        # Try system fonts first
        font_size = 300
        # Try different font paths for emoji support
        font_paths = [
            '/usr/share/fonts/opentype/noto/NotoColorEmoji.ttf',
            '/usr/share/fonts/truetype/noto/NotoSans-Regular.ttf',
            '/System/Library/Fonts/Apple Color Emoji.ttc',
        ]

        font = None
        for font_path in font_paths:
            if os.path.exists(font_path):
                try:
                    font = ImageFont.truetype(font_path, font_size)
                    break
                except:
                    continue

        if font is None:
            font = ImageFont.load_default()

        # Get emoji bounding box for centering
        bbox = draw.textbbox((0, 0), emoji, font=font)
        emoji_w = bbox[2] - bbox[0]
        emoji_h = bbox[3] - bbox[1]

        x = (size - emoji_w) // 2
        y = (size - emoji_h) // 2 - 20

        draw.text((x, y), emoji, fill=(255, 255, 255, 255), font=font)
    except Exception as e:
        print(f"  ⚠️ Warning: Could not render emoji for {slug}: {e}")

    return img

def create_feature_graphic(emoji, app_name, tagline, color_hex, slug):
    """Create a 1024x500px feature graphic for Google Play"""
    width, height = 1024, 500
    img = Image.new('RGBA', (width, height), (255, 255, 255, 0))
    draw = ImageDraw.Draw(img)

    # Convert hex to RGB
    rgb = hex_to_rgb(color_hex)

    # Fill background
    draw.rectangle([0, 0, width, height], fill=rgb + (255,))

    # Add a gradient overlay (darker at edges)
    for i in range(width):
        alpha = int(200 * (1 - abs(i - width/2) / (width/2)))
        draw.rectangle([i, 0, i+1, height], fill=rgb + (alpha,))

    # Draw emoji on left side
    try:
        emoji_font_size = 200
        font_paths = [
            '/usr/share/fonts/opentype/noto/NotoColorEmoji.ttf',
            '/usr/share/fonts/truetype/noto/NotoSans-Regular.ttf',
        ]

        emoji_font = None
        for font_path in font_paths:
            if os.path.exists(font_path):
                try:
                    emoji_font = ImageFont.truetype(font_path, emoji_font_size)
                    break
                except:
                    continue

        if emoji_font is None:
            emoji_font = ImageFont.load_default()

        bbox = draw.textbbox((0, 0), emoji, font=emoji_font)
        emoji_w = bbox[2] - bbox[0]
        emoji_h = bbox[3] - bbox[1]

        emoji_x = 80 - emoji_w // 2
        emoji_y = (height - emoji_h) // 2

        draw.text((emoji_x, emoji_y), emoji, fill=(255, 255, 255, 255), font=emoji_font)
    except Exception as e:
        print(f"  ⚠️ Warning: Could not render emoji in feature graphic for {slug}: {e}")

    # Draw app name and tagline on right side
    try:
        name_font_size = 60
        tagline_font_size = 30

        font_paths_text = [
            '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',
            '/usr/share/fonts/opentype/noto/NotoSans-Bold.ttf',
            '/System/Library/Fonts/Helvetica.ttc',
        ]

        name_font = None
        for font_path in font_paths_text:
            if os.path.exists(font_path):
                try:
                    name_font = ImageFont.truetype(font_path, name_font_size)
                    break
                except:
                    continue

        if name_font is None:
            name_font = ImageFont.load_default()

        tagline_font = None
        for font_path in font_paths_text:
            if os.path.exists(font_path):
                try:
                    tagline_font = ImageFont.truetype(font_path, tagline_font_size)
                    break
                except:
                    continue

        if tagline_font is None:
            tagline_font = ImageFont.load_default()

        # Position text on right side
        text_x = 320
        text_y_name = 150
        text_y_tagline = 320

        # Draw app name
        draw.text((text_x, text_y_name), app_name, fill=(255, 255, 255, 255), font=name_font)

        # Wrap and draw tagline
        max_width = 600
        words = tagline.split()
        lines = []
        current_line = []

        for word in words:
            current_line.append(word)
            test_text = ' '.join(current_line)
            bbox = draw.textbbox((0, 0), test_text, font=tagline_font)
            if bbox[2] - bbox[0] > max_width:
                if len(current_line) > 1:
                    lines.append(' '.join(current_line[:-1]))
                    current_line = [word]
                else:
                    lines.append(test_text)
                    current_line = []

        if current_line:
            lines.append(' '.join(current_line))

        for i, line in enumerate(lines[:3]):  # Max 3 lines
            draw.text((text_x, text_y_tagline + i * 50), line, fill=(255, 255, 255, 200), font=tagline_font)
    except Exception as e:
        print(f"  ⚠️ Warning: Could not render text in feature graphic for {slug}: {e}")

    return img

def main():
    """Generate all assets"""
    print("\n" + "="*70)
    print("  GOOGLE PLAY ASSET GENERATOR FOR 28 APPS")
    print("="*70 + "\n")

    assets_dir = Path('/home/user/jamie-wigg/assets')
    icons_dir = assets_dir / 'icons'
    graphics_dir = assets_dir / 'graphics'

    # Create directories if they don't exist
    icons_dir.mkdir(parents=True, exist_ok=True)
    graphics_dir.mkdir(parents=True, exist_ok=True)

    metadata = []
    icon_count = 0
    graphic_count = 0

    print(f"📁 Output directories:")
    print(f"   Icons:    {icons_dir}")
    print(f"   Graphics: {graphics_dir}\n")

    print("🎨 Generating assets for all 28 apps:\n")

    for idx, (slug, emoji, tagline, category, color) in enumerate(APPS, 1):
        package_name = f"com.rhythmix.{slug}"
        app_name = ' '.join(word.title() for word in slug.split('-'))

        print(f"[{idx:2d}/28] {app_name:30s} | {emoji} | {category:12s}", end="")

        try:
            # Generate icon
            icon = create_icon(emoji, color, slug)
            icon_path = icons_dir / f"{package_name}_icon.png"
            icon.save(icon_path, 'PNG')
            icon_count += 1
            print(" ✓", end="")
        except Exception as e:
            print(f" ✗ (icon: {str(e)[:30]})", end="")

        try:
            # Generate feature graphic
            feature = create_feature_graphic(emoji, app_name, tagline, color, slug)
            feature_path = graphics_dir / f"{package_name}_feature.png"
            feature.save(feature_path, 'PNG')
            graphic_count += 1
            print(" ✓\n", end="")
        except Exception as e:
            print(f" ✗ (feature: {str(e)[:30]})\n", end="")

        # Add to metadata
        metadata.append({
            'package_name': package_name,
            'app_name': app_name,
            'tagline': tagline,
            'category': category,
            'color': color,
            'emoji': emoji,
            'slug': slug
        })

    print()

    # Generate metadata CSV
    csv_path = assets_dir / 'app-metadata.csv'
    try:
        with open(csv_path, 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=[
                'package_name', 'app_name', 'tagline', 'category', 'color', 'emoji', 'slug'
            ])
            writer.writeheader()
            writer.writerows(metadata)
        print(f"📄 Metadata CSV: {csv_path}")
    except Exception as e:
        print(f"❌ Failed to create metadata CSV: {e}")

    # Summary
    print("\n" + "="*70)
    print(f"✅ GENERATION COMPLETE")
    print("="*70)
    print(f"  Icons generated:       {icon_count}/28")
    print(f"  Feature graphics:      {graphic_count}/28")
    print(f"  Metadata entries:      {len(metadata)}")
    print(f"\n📦 Files saved to: {assets_dir}/")
    print(f"   • {icons_dir}/ ({icon_count} PNG files)")
    print(f"   • {graphics_dir}/ ({graphic_count} PNG files)")
    print(f"   • app-metadata.csv")
    print("\n💡 Next steps for Google Play:")
    print("   1. Upload icons (512×512px) to each app's icon field")
    print("   2. Upload feature graphics (1024×500px) to marketing assets")
    print("   3. Import CSV metadata for bulk listing management")
    print("="*70 + "\n")

if __name__ == '__main__':
    main()
