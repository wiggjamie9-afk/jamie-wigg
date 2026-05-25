#!/usr/bin/env python3
"""
RHYTHMIX YouTube Thumbnail — 1280×720
Neon Cosmology design philosophy:
  deep-space black/navy bg, red-to-purple neon gradient glow,
  bold RHYTHMIX wordmark, waveform across lower third, star particles.
"""

from PIL import Image, ImageDraw, ImageFilter, ImageFont
import math, random, os

FONTS = "/home/user/jamie-wigg/.claude/skills/canvas-design/canvas-fonts"
OUT   = "/home/user/jamie-wigg/sites/starlightmix/thumbnail.png"
W, H  = 1280, 720

# ── Colours ──────────────────────────────────────────────────────────────────
BG        = (11, 11, 24)          # #0b0b18
RED       = (255, 31, 90)         # #ff1f5a
PURPLE    = (124, 58, 237)        # #7c3aed
WHITE     = (255, 255, 255)
LIGHT_PURPLE = (180, 130, 255)
PINK_MID  = (220, 80, 160)

# ── Helpers ───────────────────────────────────────────────────────────────────
def lerp_color(c1, c2, t):
    return tuple(int(c1[i] + (c2[i]-c1[i])*t) for i in range(3))

def add_alpha(c, a):
    return (*c[:3], a)

# ── Canvas layers ─────────────────────────────────────────────────────────────
rng = random.Random(42)

# 1. Base background
img = Image.new("RGBA", (W, H), (*BG, 255))
draw = ImageDraw.Draw(img)

# 2. Deep radial vignette / nebula glow (multiple passes, very soft)
glow_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
gd = ImageDraw.Draw(glow_layer)

# Large purple nebula cloud center-left
for r in range(420, 0, -6):
    t = 1 - r/420
    alpha = int(t * t * 62)
    col = lerp_color(PURPLE, (11, 11, 24), 1 - t * 0.9)
    gd.ellipse([W//2 - r*1.5 - r, H//2 - r, W//2 - r*1.5 + r, H//2 + r],
               fill=(*col, alpha))

# Red nebula glow top-right
for r in range(300, 0, -5):
    t = 1 - r/300
    alpha = int(t * t * 50)
    col = lerp_color(RED, (11, 11, 24), 1 - t * 0.85)
    gd.ellipse([W - r*0.6 - r, -r*0.3, W - r*0.6 + r, -r*0.3 + r*2],
               fill=(*col, alpha))

# Soft horizontal gradient band across middle (purple fog)
fog = Image.new("RGBA", (W, H), (0,0,0,0))
fogd = ImageDraw.Draw(fog)
for y in range(H//3, 2*H//3):
    t = 1 - abs(y - H//2) / (H//6)
    t = max(0, t)
    alpha = int(t * 18)
    fogd.line([(0,y),(W,y)], fill=(*PURPLE, alpha))
img = Image.alpha_composite(img, fog)

glow_layer = glow_layer.filter(ImageFilter.GaussianBlur(80))
img = Image.alpha_composite(img, glow_layer)

# 3. Stars / particles — three populations
star_layer = Image.new("RGBA", (W, H), (0,0,0,0))
sd = ImageDraw.Draw(star_layer)

# Tiny background stars
for _ in range(340):
    x = rng.randint(0, W-1)
    y = rng.randint(0, H//2)  # concentrate in upper half
    size = rng.choice([1, 1, 1, 2])
    alpha = rng.randint(60, 180)
    col_t = rng.random()
    c = lerp_color((200,200,240), LIGHT_PURPLE, col_t)
    sd.ellipse([x-size, y-size, x+size, y+size], fill=(*c, alpha))

# Medium coloured particles scattered
for _ in range(80):
    x = rng.randint(20, W-20)
    y = rng.randint(20, H-20)
    size = rng.randint(1, 3)
    t = rng.random()
    c = lerp_color(RED, PURPLE, t)
    alpha = rng.randint(40, 130)
    sd.ellipse([x-size, y-size, x+size, y+size], fill=(*c, alpha))

# Bright sparkle crosses on a few points
sparkles = [(rng.randint(0,W-1), rng.randint(0, H*2//3)) for _ in range(12)]
for sx, sy in sparkles:
    arm = rng.randint(3, 7)
    bright = lerp_color(WHITE, LIGHT_PURPLE, rng.random()*0.4)
    alpha = rng.randint(140, 220)
    sd.line([(sx-arm, sy),(sx+arm, sy)], fill=(*bright, alpha), width=1)
    sd.line([(sx, sy-arm),(sx, sy+arm)], fill=(*bright, alpha), width=1)
    sd.ellipse([sx-1,sy-1,sx+1,sy+1], fill=(*WHITE, alpha))

img = Image.alpha_composite(img, star_layer)

# 4. Waveform visualization across lower third
wave_layer = Image.new("RGBA", (W, H), (0,0,0,0))
wd = ImageDraw.Draw(wave_layer)

# Parameters
wave_y_center = int(H * 0.765)
wave_x_start  = 60
wave_x_end    = W - 60
num_bars      = 110
bar_gap       = 3
bar_width     = max(2, (wave_x_end - wave_x_start - bar_gap * (num_bars-1)) // num_bars)

# Generate realistic audio-like amplitude envelope
# Peaks around center, quiet at edges, with spectral variation
def amp_envelope(i, n):
    x = i / n
    # bell curve centred at 0.5
    bell = math.exp(-((x - 0.5)**2) / 0.08)
    # add mid-frequency bumps
    freq1 = 0.5 + 0.45 * math.sin(i * 0.28 + 1.2)
    freq2 = 0.5 + 0.3  * math.sin(i * 0.17 + 0.6)
    noise = 0.85 + 0.15 * rng.random()
    return bell * (0.5 * freq1 + 0.5 * freq2) * noise

max_bar_h = int(H * 0.22)
min_bar_h = 4

for idx in range(num_bars):
    bx = wave_x_start + idx * (bar_width + bar_gap)
    amp = amp_envelope(idx, num_bars)
    bar_h = int(min_bar_h + amp * (max_bar_h - min_bar_h))

    # Colour: gradient left→right red→purple, brighter bars glow more
    t = idx / (num_bars - 1)
    bar_col = lerp_color(RED, PURPLE, t)

    # Draw bar (centred on wave_y_center)
    top    = wave_y_center - bar_h // 2
    bottom = wave_y_center + bar_h // 2

    # Glow: wide blurred version first
    glow_col_a = (*bar_col, 60)
    pad = 6
    wd.rectangle([bx-pad, top-pad, bx+bar_width+pad, bottom+pad], fill=glow_col_a)

    # Core bar
    wd.rectangle([bx, top, bx+bar_width, bottom], fill=(*bar_col, 230))

    # Bright highlight on top 20% of bar
    highlight_h = max(1, bar_h // 5)
    bright = lerp_color(WHITE, bar_col, 0.35)
    wd.rectangle([bx, top, bx+bar_width, top+highlight_h], fill=(*bright, 180))

# Glow blur on waveform
wave_layer = wave_layer.filter(ImageFilter.GaussianBlur(3))
img = Image.alpha_composite(img, wave_layer)

# Redraw crisp bars on top after blur
crisp_layer = Image.new("RGBA", (W, H), (0,0,0,0))
cd = ImageDraw.Draw(crisp_layer)
rng2 = random.Random(42)

def amp_envelope2(i, n):
    x = i / n
    bell = math.exp(-((x - 0.5)**2) / 0.08)
    freq1 = 0.5 + 0.45 * math.sin(i * 0.28 + 1.2)
    freq2 = 0.5 + 0.3  * math.sin(i * 0.17 + 0.6)
    noise = 0.85 + 0.15 * rng2.random()
    return bell * (0.5 * freq1 + 0.5 * freq2) * noise

for idx in range(num_bars):
    bx = wave_x_start + idx * (bar_width + bar_gap)
    amp = amp_envelope2(idx, num_bars)
    bar_h = int(min_bar_h + amp * (max_bar_h - min_bar_h))
    t = idx / (num_bars - 1)
    bar_col = lerp_color(RED, PURPLE, t)
    top    = wave_y_center - bar_h // 2
    bottom = wave_y_center + bar_h // 2
    cd.rectangle([bx, top, bx+bar_width, bottom], fill=(*bar_col, 255))
    bright = lerp_color(WHITE, bar_col, 0.3)
    highlight_h = max(1, bar_h // 5)
    cd.rectangle([bx, top, bx+bar_width, top+highlight_h], fill=(*bright, 200))

img = Image.alpha_composite(img, crisp_layer)

# 5. Wordmark glow halo behind "RHYTHMIX"
halo = Image.new("RGBA", (W, H), (0,0,0,0))
hd = ImageDraw.Draw(halo)

# Multi-layer radial glow behind the wordmark area (centred vertically ~38% down)
text_cx = W // 2
text_cy = int(H * 0.36)

for r in range(340, 0, -4):
    t = 1 - r/340
    alpha = int(t * t * t * 90)
    # shift from red (left) to purple (right)
    col = lerp_color(RED, PURPLE, 0.5 + 0.2*math.sin(r*0.05))
    hd.ellipse([text_cx - r*2.2, text_cy - r, text_cx + r*2.2, text_cy + r],
               fill=(*col, alpha))

halo = halo.filter(ImageFilter.GaussianBlur(28))
img = Image.alpha_composite(img, halo)

# 6. Typography
font_bold   = os.path.join(FONTS, "BigShoulders-Bold.ttf")
font_sub    = os.path.join(FONTS, "WorkSans-Regular.ttf")
font_label  = os.path.join(FONTS, "GeistMono-Regular.ttf")

# Load fonts at target sizes
try:
    fnt_title  = ImageFont.truetype(font_bold, 148)
    fnt_sub    = ImageFont.truetype(font_sub,  38)
    fnt_label  = ImageFont.truetype(font_label, 22)
except:
    fnt_title  = ImageFont.load_default()
    fnt_sub    = fnt_title
    fnt_label  = fnt_title

text_layer = Image.new("RGBA", (W, H), (0,0,0,0))
td = ImageDraw.Draw(text_layer)

# --- RHYTHMIX wordmark ---
title_text = "RHYTHMIX"
# Measure
bbox = td.textbbox((0,0), title_text, font=fnt_title)
tw = bbox[2] - bbox[0]
th = bbox[3] - bbox[1]
tx = (W - tw) // 2 - bbox[0]
ty = text_cy - th // 2 - bbox[1]

# Shadow / depth layers (dark offset)
for off in [(4,4),(3,3),(2,2)]:
    td.text((tx+off[0], ty+off[1]), title_text, font=fnt_title, fill=(0,0,0,120))

# Render white base
td.text((tx, ty), title_text, font=fnt_title, fill=(*WHITE, 255))

# Gradient overlay using pixel-level horizontal tint
# Create a temp title image and tint it red→purple
title_img = Image.new("RGBA", (W, H), (0,0,0,0))
tid = ImageDraw.Draw(title_img)
tid.text((tx, ty), title_text, font=fnt_title, fill=(255,255,255,255))

# Apply horizontal gradient tint
title_arr = title_img.load()
for px in range(W):
    t_px = px / W
    tint = lerp_color(RED, PURPLE, t_px)
    for py in range(H):
        r2, g2, b2, a2 = title_arr[px, py]
        if a2 > 0:
            tr, tg, tb = tint
            # blend 30% tint over white
            nr = int(r2 * 0.72 + tr * 0.28)
            ng = int(g2 * 0.72 + tg * 0.28)
            nb = int(b2 * 0.72 + tb * 0.28)
            title_arr[px, py] = (nr, ng, nb, a2)

# Soft glow duplicate blurred
title_glow = title_img.copy().filter(ImageFilter.GaussianBlur(6))
text_layer = Image.alpha_composite(text_layer, title_glow)
text_layer = Image.alpha_composite(text_layer, title_img)

# --- Subtitle ---
sub_text  = "Turn Any Idea Into Music"
bbox_s    = td.textbbox((0,0), sub_text, font=fnt_sub)
sw        = bbox_s[2] - bbox_s[0]
sx        = (W - sw) // 2 - bbox_s[0]
sy        = ty + th + 22

sub_layer = Image.new("RGBA", (W, H), (0,0,0,0))
subd = ImageDraw.Draw(sub_layer)
subd.text((sx, sy), sub_text, font=fnt_sub, fill=(*LIGHT_PURPLE, 200))
sub_glow = sub_layer.copy().filter(ImageFilter.GaussianBlur(3))
text_layer = Image.alpha_composite(text_layer, sub_glow)
text_layer = Image.alpha_composite(text_layer, sub_layer)

img = Image.alpha_composite(img, text_layer)

# 7. Final vignette — darken edges
vig = Image.new("RGBA", (W, H), (0,0,0,0))
vd = ImageDraw.Draw(vig)
for r in range(0, 420, 4):
    t = r / 420
    alpha = int((1-t)*(1-t)*160)
    vd.rectangle([0, 0, r, H], fill=(0,0,0,alpha))
    vd.rectangle([W-r, 0, W, H], fill=(0,0,0,alpha))
    vd.rectangle([0, 0, W, r//2], fill=(0,0,0,alpha))
    vd.rectangle([0, H-r//2, W, H], fill=(0,0,0,alpha))
vig = vig.filter(ImageFilter.GaussianBlur(60))
img = Image.alpha_composite(img, vig)

# 8. Subtle horizontal scan-line shimmer across waveform band
scan = Image.new("RGBA", (W, H), (0,0,0,0))
scand = ImageDraw.Draw(scan)
for y in range(wave_y_center - max_bar_h - 10, wave_y_center + max_bar_h + 10, 4):
    scand.line([(0,y),(W,y)], fill=(255,255,255, 6))
img = Image.alpha_composite(img, scan)

# 9. Save
final = img.convert("RGB")
final.save(OUT, "PNG", quality=97, optimize=False)
print(f"Saved: {OUT}  ({W}x{H})")
