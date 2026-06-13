#!/usr/bin/env python3
"""
Generate 5 Sunny concept art images using PIL (local, no API calls).
Creates stylized watercolor-inspired illustrations.
"""

from PIL import Image, ImageDraw, ImageFont
import math
from pathlib import Path

OUTPUT_DIR = Path("SUNNY-CONCEPT-ART")
OUTPUT_DIR.mkdir(exist_ok=True)

WIDTH, HEIGHT = 1024, 768
GOLDEN = (210, 180, 100)
CREAM = (245, 241, 232)
NAVY = (26, 45, 92)
PURPLE = (120, 80, 140)
BROWN = (139, 90, 43)
WHITE = (255, 255, 255)

def draw_quokka(draw, x, y, size, color=GOLDEN):
    """Draw a simplified quokka body"""
    # Body (round)
    draw.ellipse([x-size, y-size, x+size, y+size], fill=color, outline=BROWN)
    # Head
    draw.ellipse([x-size//1.5, y-size//1.2, x+size//1.5, y-size//3], fill=color, outline=BROWN)
    # Eyes
    eye_y = y - size // 2
    draw.ellipse([x-size//3, eye_y-size//4, x-size//4, eye_y], fill=WHITE, outline=BROWN)
    draw.ellipse([x+size//4, eye_y-size//4, x+size//3, eye_y], fill=WHITE, outline=BROWN)
    # Pupils
    draw.ellipse([x-size//3.5, eye_y-size//5, x-size//4.5, eye_y-size//8], fill=NAVY)
    draw.ellipse([x+size//4.5, eye_y-size//5, x+size//3.5, eye_y-size//8], fill=NAVY)
    # Ears
    draw.ellipse([x-size//2.5, y-size//1.5, x-size//4, y-size//2], fill=color, outline=BROWN)
    draw.ellipse([x+size//4, y-size//1.5, x+size//2.5, y-size//2], fill=color, outline=BROWN)
    # Smile
    draw.arc([x-size//4, y-size//3, x+size//4, y+size//3], 0, 180, fill=BROWN, width=3)

def concept_1():
    """Sunny sitting in moonlit bush"""
    img = Image.new("RGB", (WIDTH, HEIGHT), CREAM)
    draw = ImageDraw.Draw(img, 'RGBA')

    # Sky gradient (plum to navy)
    for i in range(HEIGHT):
        r = int(150 - (i / HEIGHT) * 124)
        g = int(100 - (i / HEIGHT) * 55)
        b = int(170 + (i / HEIGHT) * 86)
        draw.line([(0, i), (WIDTH, i)], fill=(r, g, b))

    # Grass
    draw.rectangle([0, HEIGHT//1.5, WIDTH, HEIGHT], fill=(80, 120, 60))

    # Stars
    for i in range(40):
        sx = 100 + (i * 23) % WIDTH
        sy = 100 + (i * 17) % (HEIGHT//3)
        draw.ellipse([sx-2, sy-2, sx+2, sy+2], fill=WHITE)

    # Gum tree
    draw.rectangle([WIDTH//1.3-20, HEIGHT//2, WIDTH//1.3+20, HEIGHT], fill=BROWN)
    draw.ellipse([WIDTH//1.3-80, HEIGHT//2-60, WIDTH//1.3+80, HEIGHT//2+40], fill=(100, 150, 80))

    # Sunny sitting
    draw_quokka(draw, WIDTH//3, HEIGHT//1.5-50, 60, GOLDEN)

    # Label
    draw.text((20, HEIGHT-40), "Concept 1: Moonlit Bush", fill=NAVY)

    return img

def concept_2():
    """Sunny portrait closeup"""
    img = Image.new("RGB", (WIDTH, HEIGHT), CREAM)
    draw = ImageDraw.Draw(img, 'RGBA')

    # Soft background
    for i in range(HEIGHT):
        a = int(255 * (1 - (abs(i - HEIGHT//2) / HEIGHT)))
        draw.line([(0, i), (WIDTH, i)], fill=(240, 220, 200, a))

    # Wildflowers (blurred effect)
    import random
    random.seed(42)
    for _ in range(30):
        fx = random.randint(0, WIDTH)
        fy = random.randint(HEIGHT//1.5, HEIGHT)
        draw.ellipse([fx-15, fy-15, fx+15, fy+15], fill=(200, 100, 150, 100))

    # Large Sunny head closeup
    draw_quokka(draw, WIDTH//2, HEIGHT//2, 100, GOLDEN)

    # Rim light effect (white halo)
    for i in range(120, 130):
        draw.ellipse([WIDTH//2-i, HEIGHT//2-i, WIDTH//2+i, HEIGHT//2+i],
                    outline=(255, 255, 200, 50), width=2)

    draw.text((20, HEIGHT-40), "Concept 2: Portrait Closeup", fill=NAVY)

    return img

def concept_3():
    """Sunny curled asleep"""
    img = Image.new("RGB", (WIDTH, HEIGHT), CREAM)
    draw = ImageDraw.Draw(img, 'RGBA')

    # Night sky
    for i in range(HEIGHT):
        b = int(40 + (i / HEIGHT) * 60)
        draw.line([(0, i), (WIDTH, i)], fill=(10, 15, b))

    # Stars scattered
    for i in range(60):
        sx = (i * 37) % WIDTH
        sy = (i * 13) % HEIGHT
        draw.ellipse([sx-2, sy-2, sx+2, sy+2], fill=WHITE)

    # Grass
    draw.rectangle([0, HEIGHT//1.4, WIDTH, HEIGHT], fill=(40, 60, 30))

    # Tree
    draw.rectangle([WIDTH//5-25, HEIGHT//2, WIDTH//5+25, HEIGHT], fill=BROWN)
    draw.ellipse([WIDTH//5-100, HEIGHT//2-80, WIDTH//5+100, HEIGHT//2+20], fill=(60, 100, 40))

    # Curled Sunny (circle shape)
    sunny_x, sunny_y = WIDTH//1.5, HEIGHT//1.3
    draw.ellipse([sunny_x-80, sunny_y-80, sunny_x+80, sunny_y+80], fill=GOLDEN, outline=BROWN)
    # Head tucked
    draw.ellipse([sunny_x-40, sunny_y-120, sunny_x+40, sunny_y-40], fill=GOLDEN, outline=BROWN)

    draw.text((20, HEIGHT-40), "Concept 3: Curled Asleep", fill=(200, 200, 200))

    return img

def concept_4():
    """Sunny running with joy"""
    img = Image.new("RGB", (WIDTH, HEIGHT), CREAM)
    draw = ImageDraw.Draw(img, 'RGBA')

    # Sunny golden sky
    for i in range(HEIGHT):
        r = int(200 + (i / HEIGHT) * 55)
        g = int(180 + (i / HEIGHT) * 75)
        b = int(100 - (i / HEIGHT) * 50)
        draw.line([(0, i), (WIDTH, i)], fill=(r, g, b))

    # Wildflowers
    for i in range(0, WIDTH, 80):
        for j in range(HEIGHT//1.5, HEIGHT, 60):
            draw.ellipse([i-20, j-20, i+20, j+20], fill=(200, 80, 150))
            draw.ellipse([i-15, j-15, i+15, j+15], fill=(255, 120, 180))

    # Gum trees
    for tx in [150, WIDTH-150]:
        draw.rectangle([tx-15, HEIGHT//2-100, tx+15, HEIGHT], fill=BROWN)
        draw.ellipse([tx-60, HEIGHT//2-140, tx+60, HEIGHT//2-20], fill=(100, 150, 80))

    # Sunny mid-jump (motion)
    sunny_x, sunny_y = WIDTH//2, HEIGHT//2
    draw_quokka(draw, sunny_x, sunny_y, 70, GOLDEN)

    # Motion lines
    for offset in [40, 80, 120]:
        draw.line([(sunny_x-offset, sunny_y), (sunny_x-offset-20, sunny_y)], fill=NAVY, width=2)

    draw.text((20, HEIGHT-40), "Concept 4: Running with Joy", fill=NAVY)

    return img

def concept_5():
    """Sunny watching stars"""
    img = Image.new("RGB", (WIDTH, HEIGHT), CREAM)
    draw = ImageDraw.Draw(img, 'RGBA')

    # Deep navy starry sky
    for i in range(HEIGHT):
        b = int(60 + (i / HEIGHT) * 30)
        draw.line([(0, i), (WIDTH, i)], fill=(15, 25, b))

    # Many stars
    for i in range(100):
        sx = (i * 41) % WIDTH
        sy = (i * 23) % HEIGHT
        size = 1 + (i % 3)
        draw.ellipse([sx-size, sy-size, sx+size, sy+size], fill=WHITE)

    # Grass
    draw.rectangle([0, HEIGHT//1.3, WIDTH, HEIGHT], fill=(30, 50, 20))

    # Moon
    draw.ellipse([WIDTH-200, 100, WIDTH-50, 250], fill=(255, 250, 200))

    # Sunny lying on back
    sunny_x, sunny_y = WIDTH//3, HEIGHT//1.4
    draw.ellipse([sunny_x-70, sunny_y-70, sunny_x+70, sunny_y+70], fill=GOLDEN, outline=BROWN)

    # Paw reaching up
    draw.ellipse([sunny_x+30, sunny_y-120, sunny_x+60, sunny_y-90], fill=GOLDEN, outline=BROWN)
    draw.line([(sunny_x+45, sunny_y-70), (sunny_x+45, sunny_y-130)], fill=BROWN, width=3)

    draw.text((20, HEIGHT-40), "Concept 5: Watching Stars", fill=(200, 200, 200))

    return img

def main():
    print("=" * 70)
    print("Sunny Concept Art (Local PIL Generation)")
    print("=" * 70)
    print()

    concepts = [
        ("concept-1-sitting-moonlit-bush", concept_1),
        ("concept-2-portrait-closeup", concept_2),
        ("concept-3-curled-asleep", concept_3),
        ("concept-4-running-joy", concept_4),
        ("concept-5-watching-stars", concept_5),
    ]

    for name, func in concepts:
        print(f"Generating {name}...")
        img = func()
        out = OUTPUT_DIR / f"{name}.png"
        img.save(out)
        print(f"  ✓ Saved: {out.name} ({img.size[0]}x{img.size[1]})")

    print()
    print("=" * 70)
    print(f"✓ Generated 5/5 concept images locally")
    print("=" * 70)

if __name__ == "__main__":
    main()
