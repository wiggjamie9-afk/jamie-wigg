#!/usr/bin/env python3
"""
RHYTHMIX brand assets — Neon Cosmology — v2 REFINEMENT PASS
Pristine, museum-quality execution.
"""

import math
import random
import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

FONTS_DIR = "/home/user/jamie-wigg/.claude/skills/canvas-design/canvas-fonts"
OUT_DIR   = "/home/user/jamie-wigg/sites/starlightmix"

def font(name, size):
    return ImageFont.truetype(os.path.join(FONTS_DIR, name), size)

def lerp(a, b, t):
    return a + (b - a) * t

def lerp_color(c1, c2, t):
    return tuple(int(c1[i] + (c2[i] - c1[i]) * t) for i in range(3))

# Brand palette
BG       = (8,  8, 20)
BG2      = (14, 11, 30)
RED      = (255, 31, 90)
PURPLE   = (124, 58, 237)
MID      = lerp_color(RED, PURPLE, 0.5)    # ~(190, 44, 163)
WHITE    = (255, 255, 255)
DIM      = (160, 145, 210)

# ─────────────────────────────────────────────────────────────────────────────
# Primitive helpers
# ─────────────────────────────────────────────────────────────────────────────

def vertical_gradient(img, c_top, c_bottom):
    W, H = img.size
    layer = Image.new("RGBA", (W, H))
    d = ImageDraw.Draw(layer)
    for y in range(H):
        t = y / H
        c = lerp_color(c_top, c_bottom, t)
        d.line([(0, y), (W, y)], fill=(*c, 255))
    return Image.alpha_composite(img, layer)

def draw_stars(img, count=420, seed=7, max_r=2.0):
    rng = random.Random(seed)
    W, H = img.size
    layer = Image.new("RGBA", (W, H))
    d = ImageDraw.Draw(layer)
    for _ in range(count):
        x = rng.randint(0, W - 1)
        y = rng.randint(0, H - 1)
        r = rng.random() ** 2 * max_r
        a = rng.randint(55, 230)
        rb = int(200 + rng.random() * 55)
        gb = int(185 + rng.random() * 55)
        bb = int(220 + rng.random() * 35)
        if r < 0.5:
            d.point((x, y), fill=(rb, gb, bb, a))
        else:
            d.ellipse((x - r, y - r, x + r, y + r), fill=(rb, gb, bb, a))
    return Image.alpha_composite(img, layer)

def radial_glow(img, cx, cy, radius, color, peak_alpha=140, blur=40):
    W, H = img.size
    layer = Image.new("RGBA", (W, H))
    d = ImageDraw.Draw(layer)
    steps = 100
    for i in range(steps, 0, -1):
        t = i / steps
        r = int(radius * t)
        a = int(peak_alpha * (1 - t) ** 1.6)
        c = lerp_color(color, BG, 1 - t)
        d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=(*c, a))
    blurred = layer.filter(ImageFilter.GaussianBlur(radius=blur))
    return Image.alpha_composite(img, blurred)

def add_grain(img, amount=7, seed=42):
    rng = random.Random(seed)
    layer = Image.new("RGBA", img.size)
    d = ImageDraw.Draw(layer)
    W, H = img.size
    for _ in range(W * H // 5):
        x = rng.randint(0, W - 1)
        y = rng.randint(0, H - 1)
        v = rng.randint(0, amount)
        d.point((x, y), fill=(v, v, v, rng.randint(8, 30)))
    return Image.alpha_composite(img, layer)

# ─────────────────────────────────────────────────────────────────────────────
# Gradient text
# ─────────────────────────────────────────────────────────────────────────────

def gradient_text(img, text, fnt, cx, cy, c_left, c_right,
                  anchor="center"):
    """Render text with horizontal gradient fill. anchor: center | left | right"""
    d  = ImageDraw.Draw(img)
    bb = d.textbbox((0, 0), text, font=fnt, anchor="lt")
    tw = bb[2] - bb[0]
    th = bb[3] - bb[1]

    mask = Image.new("L", (tw, th), 0)
    md   = ImageDraw.Draw(mask)
    md.text((-bb[0], -bb[1]), text, font=fnt, fill=255)

    grad = Image.new("RGB", (tw, th))
    gd   = ImageDraw.Draw(grad)
    for xi in range(tw):
        t = xi / max(tw - 1, 1)
        gd.line([(xi, 0), (xi, th)], fill=lerp_color(c_left, c_right, t))

    if anchor == "center":
        px = cx - tw // 2
        py = cy - th // 2
    elif anchor == "left":
        px, py = cx, cy - th // 2
    elif anchor == "right":
        px = cx - tw
        py = cy - th // 2
    else:
        px, py = cx, cy

    img.paste(grad.convert("RGBA"), (px, py), mask)
    return (px, py, px + tw, py + th)   # bounding box

def glowing_text(img, text, fnt, cx, cy, c_left, c_right,
                 glow_blur=28, glow_alpha_scale=1.0, anchor="center"):
    """Render text with gradient fill + bloom glow underneath."""
    # glow layer
    glow_img = Image.new("RGBA", img.size, (0, 0, 0, 0))
    gradient_text(glow_img, text, fnt, cx, cy,
                  lerp_color(c_left, WHITE, 0.08),
                  lerp_color(c_right, WHITE, 0.08),
                  anchor=anchor)
    # boost glow
    r, g, b, a = glow_img.split()
    boosted_a  = a.point(lambda p: min(255, int(p * glow_alpha_scale)))
    glow_img   = Image.merge("RGBA", (r, g, b, boosted_a))
    blurred    = glow_img.filter(ImageFilter.GaussianBlur(radius=glow_blur))
    img        = Image.alpha_composite(img, blurred)
    # sharp text on top
    bbox = gradient_text(img, text, fnt, cx, cy, c_left, c_right, anchor=anchor)
    return img, bbox

# ─────────────────────────────────────────────────────────────────────────────
# Waveform
# ─────────────────────────────────────────────────────────────────────────────

def waveform_points(width, y_center, wave_height, segments=300,
                    x_offset=0, seed=12345):
    rng    = random.Random(seed)
    freqs  = [1.0, 2.3, 3.7, 5.1, 0.7]
    phases = [rng.random() * math.pi * 2 for _ in freqs]
    amps   = [0.42, 0.26, 0.16, 0.10, 0.06]
    pts    = []
    for i in range(segments + 1):
        t  = i / segments
        nx = t * 2 * math.pi
        y  = sum(a * math.sin(f * nx + p) for a, f, p in zip(amps, freqs, phases))
        x  = x_offset + int(t * width)
        yp = int(y_center + y * wave_height)
        pts.append((x, yp))
    return pts

def draw_waveform(img, width, y_center, wave_height, segments=300,
                  c_left=RED, c_right=PURPLE, crisp_alpha=235,
                  glow_radius=14, x_offset=0, seed=12345, crisp_width=2):
    """Draw a glowing waveform directly onto img."""
    pts = waveform_points(width, y_center, wave_height, segments,
                          x_offset=x_offset, seed=seed)

    W, H = img.size

    # glow layer
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gd   = ImageDraw.Draw(glow)
    for j in range(len(pts) - 1):
        t = j / len(pts)
        c = lerp_color(c_left, c_right, t)
        for thick, alpha in [(12, 30), (7, 55), (4, 80)]:
            gd.line([pts[j], pts[j + 1]], fill=(*c, alpha), width=thick)
    blurred_glow = glow.filter(ImageFilter.GaussianBlur(radius=glow_radius))
    img = Image.alpha_composite(img, blurred_glow)

    # crisp line
    d = ImageDraw.Draw(img)
    for j in range(len(pts) - 1):
        t = j / len(pts)
        c = lerp_color(c_left, c_right, t)
        d.line([pts[j], pts[j + 1]], fill=(*c, crisp_alpha), width=crisp_width)

    return img

# ─────────────────────────────────────────────────────────────────────────────
# ASSET 1: YouTube Thumbnail 1280×720
# ─────────────────────────────────────────────────────────────────────────────

def make_thumbnail():
    W, H = 1280, 720
    img  = Image.new("RGBA", (W, H), (*BG, 255))

    # ── background gradient (deep navy → near-black bottom) ──────────────────
    img = vertical_gradient(img, (14, 12, 36), (6, 6, 14))

    # ── stars ─────────────────────────────────────────────────────────────────
    img = draw_stars(img, count=430, seed=42)

    # ── dual-color center halo ────────────────────────────────────────────────
    img = radial_glow(img, W // 2 - 80, int(H * 0.40), 420, RED,    peak_alpha=130, blur=50)
    img = radial_glow(img, W // 2 + 80, int(H * 0.44), 380, PURPLE, peak_alpha=120, blur=50)
    # small bright hotspot
    img = radial_glow(img, W // 2,      int(H * 0.42), 120, MID,    peak_alpha=100, blur=18)

    # ── horizon vignette (darken edges) ──────────────────────────────────────
    vign = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    vd   = ImageDraw.Draw(vign)
    # left/right dark curtains
    for xi in range(180):
        t = (1 - xi / 180) ** 2
        a = int(t * 130)
        vd.line([(xi, 0), (xi, H)], fill=(0, 0, 0, a))
        vd.line([(W - 1 - xi, 0), (W - 1 - xi, H)], fill=(0, 0, 0, a))
    img = Image.alpha_composite(img, vign)

    # ── RHYTHMIX wordmark — large, dominant ───────────────────────────────────
    f_title = font("BigShoulders-Bold.ttf", 228)
    cy_title = int(H * 0.42)
    img, bb_title = glowing_text(img, "RHYTHMIX", f_title,
                                  W // 2, cy_title, RED, PURPLE,
                                  glow_blur=44, glow_alpha_scale=1.6)

    # ── subtle horizontal rule under wordmark ─────────────────────────────────
    rule_y  = bb_title[3] + 22
    rule_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    rd      = ImageDraw.Draw(rule_layer)
    rule_x0 = bb_title[0] + 8
    rule_x1 = bb_title[2] - 8
    for xi in range(rule_x0, rule_x1):
        t = (xi - rule_x0) / max(rule_x1 - rule_x0 - 1, 1)
        c = lerp_color(RED, PURPLE, t)
        rd.point((xi, rule_y), fill=(*c, 140))
        rd.point((xi, rule_y + 1), fill=(*c, 50))
    rule_blurred = rule_layer.filter(ImageFilter.GaussianBlur(1.5))
    img = Image.alpha_composite(img, rule_blurred)

    # ── subtitle ──────────────────────────────────────────────────────────────
    f_sub  = font("WorkSans-Regular.ttf", 38)
    sub    = "TURN ANY IDEA INTO MUSIC"
    sub_y  = rule_y + 42
    # measure for centering
    bb_sub = ImageDraw.Draw(img).textbbox((0, 0), sub, font=f_sub, anchor="lt")
    sub_tw = bb_sub[2] - bb_sub[0]
    sub_x  = W // 2 - sub_tw // 2

    # soft glow behind subtitle
    sg = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(sg).text((sub_x, sub_y), sub, font=f_sub,
                             fill=(180, 150, 255, 180))
    img = Image.alpha_composite(img, sg.filter(ImageFilter.GaussianBlur(9)))
    ImageDraw.Draw(img).text((sub_x, sub_y), sub, font=f_sub,
                              fill=(200, 185, 255, 220))

    # ── waveform lower-third ──────────────────────────────────────────────────
    wave_y = int(H * 0.80)
    img = draw_waveform(img, W, wave_y,      wave_height=52, segments=320,
                        c_left=RED, c_right=PURPLE,
                        crisp_alpha=245, glow_radius=16, crisp_width=2)
    img = draw_waveform(img, W, wave_y + 32, wave_height=26, segments=320,
                        c_left=(200, 25, 90), c_right=(100, 50, 200),
                        crisp_alpha=80, glow_radius=6, seed=99887, crisp_width=1)
    img = draw_waveform(img, W, wave_y - 28, wave_height=16, segments=320,
                        c_left=(150, 20, 70), c_right=(80, 35, 160),
                        crisp_alpha=55, glow_radius=4, seed=55443, crisp_width=1)

    # ── bottom margin — url hint ───────────────────────────────────────────────
    f_url = font("GeistMono-Regular.ttf", 20)
    url   = "starlightmix.com"
    bb_u  = ImageDraw.Draw(img).textbbox((0, 0), url, font=f_url, anchor="lt")
    uw    = bb_u[2] - bb_u[0]
    ImageDraw.Draw(img).text(
        (W // 2 - uw // 2, H - 30), url, font=f_url,
        fill=(100, 90, 140, 140),
    )

    # ── grain ─────────────────────────────────────────────────────────────────
    img = add_grain(img, amount=9, seed=42)

    out  = img.convert("RGB")
    path = os.path.join(OUT_DIR, "thumbnail.png")
    out.save(path, "PNG", optimize=True)
    print(f"Saved: {path}")
    return path


# ─────────────────────────────────────────────────────────────────────────────
# ASSET 2: OG / Social Cover 1200×630
# ─────────────────────────────────────────────────────────────────────────────

def make_og_image():
    W, H = 1200, 630
    img  = Image.new("RGBA", (W, H), (*BG, 255))

    # ── background ────────────────────────────────────────────────────────────
    img = vertical_gradient(img, (15, 12, 34), (6, 6, 14))
    img = draw_stars(img, count=320, seed=77)

    # ── left glow halo ────────────────────────────────────────────────────────
    img = radial_glow(img, 290, int(H * 0.46), 380, RED,    peak_alpha=115, blur=55)
    img = radial_glow(img, 330, int(H * 0.50), 310, PURPLE, peak_alpha=105, blur=50)
    img = radial_glow(img, 300, int(H * 0.47), 100, MID,    peak_alpha=85,  blur=14)

    # ── vertical divider with glow ────────────────────────────────────────────
    div_x     = 590
    div_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    dd        = ImageDraw.Draw(div_layer)
    for y in range(H):
        t = y / H
        c = lerp_color(RED, PURPLE, t)
        dd.point((div_x,     y), fill=(*c, 70))
        dd.point((div_x + 1, y), fill=(*c, 30))
    # soft glow around divider
    div_glow = div_layer.filter(ImageFilter.GaussianBlur(4))
    img = Image.alpha_composite(img, div_glow)
    img = Image.alpha_composite(img, div_layer)

    # ── LEFT: RHYTHMIX stacked ────────────────────────────────────────────────
    # "RHYTHM" — largest
    f_w1  = font("BigShoulders-Bold.ttf", 152)
    cx_l  = 295
    img, bb_r = glowing_text(img, "RHYTHM", f_w1, cx_l, 202,
                              RED, MID, glow_blur=32, glow_alpha_scale=1.5)

    # "IX" — offset right, same visual rhythm
    f_w2  = font("BigShoulders-Bold.ttf", 152)
    # offset to align right-edge with RHYTHM right-edge
    bb_r2 = ImageDraw.Draw(img).textbbox((0, 0), "RHYTHM", font=f_w1, anchor="lt")
    r_width = bb_r2[2] - bb_r2[0]
    bb_ix   = ImageDraw.Draw(img).textbbox((0, 0), "IX", font=f_w2, anchor="lt")
    ix_width = bb_ix[2] - bb_ix[0]
    # right-align IX under RHYTHM
    ix_left_x = (cx_l - r_width // 2) + r_width - ix_width
    ix_cx     = ix_left_x + ix_width // 2

    img, _ = glowing_text(img, "IX", f_w2, ix_cx, 360,
                           MID, PURPLE, glow_blur=32, glow_alpha_scale=1.5)

    # horizontal rule between two lines
    rule2_y = 295
    rl2 = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    rd2 = ImageDraw.Draw(rl2)
    r2_x0 = cx_l - r_width // 2 + 4
    r2_x1 = cx_l + r_width // 2 - 4
    for xi in range(r2_x0, r2_x1):
        t = (xi - r2_x0) / max(r2_x1 - r2_x0 - 1, 1)
        c = lerp_color(RED, PURPLE, t)
        rd2.point((xi, rule2_y), fill=(*c, 100))
    img = Image.alpha_composite(img, rl2.filter(ImageFilter.GaussianBlur(1.5)))

    # tagline
    f_tag = font("WorkSans-Regular.ttf", 22)
    tag   = "AI  MUSIC  PLATFORM"
    bb_t  = ImageDraw.Draw(img).textbbox((0, 0), tag, font=f_tag, anchor="lt")
    tw_t  = bb_t[2] - bb_t[0]
    tg_x  = cx_l - tw_t // 2
    tg_y  = 418

    tg_glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(tg_glow).text((tg_x, tg_y), tag, font=f_tag, fill=(160, 130, 240, 160))
    img = Image.alpha_composite(img, tg_glow.filter(ImageFilter.GaussianBlur(6)))
    ImageDraw.Draw(img).text((tg_x, tg_y), tag, font=f_tag, fill=(155, 140, 210, 205))

    # mini waveform left half
    img = draw_waveform(img, div_x, 495, wave_height=20, segments=220,
                        c_left=RED, c_right=PURPLE,
                        crisp_alpha=200, glow_radius=9, crisp_width=2)
    img = draw_waveform(img, div_x, 515, wave_height=10, segments=220,
                        c_left=(180, 20, 80), c_right=(90, 40, 180),
                        crisp_alpha=80, glow_radius=4, seed=7777, crisp_width=1)

    # ── RIGHT: feature grid 2×3 ───────────────────────────────────────────────
    features = [
        ("SPLIT",    "Stem Split"),
        ("MASTER",   "AI Master"),
        ("ROYALTY",  "Royalties"),
        ("MIDI",     "MIDI / DAW"),
        ("SYNC",     "Sync License"),
        ("VR",       "VR Concert"),
    ]

    cell_w   = 238
    cell_h   = 148
    pad_x    = 24
    grid_x0  = div_x + 40
    # vertically center grid: total grid height = 3 * cell_h
    grid_total_h = 3 * cell_h
    grid_y0  = (H - 54 - grid_total_h) // 2 + 4  # above bottom bar

    f_icon  = font("BigShoulders-Bold.ttf", 26)
    f_label = font("WorkSans-Regular.ttf", 18)

    for idx, (icon, label) in enumerate(features):
        col  = idx % 2
        row  = idx // 2
        x0_c = grid_x0 + col * (cell_w + pad_x)
        y0_c = grid_y0 + row * cell_h
        xc   = x0_c + cell_w // 2
        yc   = y0_c + cell_h // 2

        accent = lerp_color(RED, PURPLE, idx / 5)

        # card bg
        card_l = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        cd     = ImageDraw.Draw(card_l)
        cd.rounded_rectangle(
            (x0_c + 2, y0_c + 2, x0_c + cell_w - 2, y0_c + cell_h - 10),
            radius=14,
            fill=(255, 255, 255, 10),
            outline=(*accent, 65),
            width=1,
        )
        # subtle glow on card border
        img = Image.alpha_composite(img, card_l.filter(ImageFilter.GaussianBlur(3)))
        img = Image.alpha_composite(img, card_l)

        draw4 = ImageDraw.Draw(img)

        # icon — bold short label with gradient
        bb_i = draw4.textbbox((0, 0), icon, font=f_icon, anchor="lt")
        iw   = bb_i[2] - bb_i[0]
        # draw with accent gradient
        icon_img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        gradient_text(icon_img, icon, f_icon, xc, yc - 22, accent, WHITE, anchor="center")
        # glow
        icon_glow = icon_img.filter(ImageFilter.GaussianBlur(5))
        img = Image.alpha_composite(img, icon_glow)
        img = Image.alpha_composite(img, icon_img)

        # label
        draw4 = ImageDraw.Draw(img)
        bb_l = draw4.textbbox((0, 0), label, font=f_label, anchor="lt")
        lw   = bb_l[2] - bb_l[0]
        draw4.text((xc - lw // 2, yc + 14), label, font=f_label,
                   fill=(*accent, 210))

    # ── bottom bar ────────────────────────────────────────────────────────────
    bar_h  = 54
    bar_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    bd = ImageDraw.Draw(bar_layer)
    for xi in range(W):
        t = xi / W
        c = lerp_color((18, 12, 36), (10, 8, 24), t)
        bd.line([(xi, H - bar_h), (xi, H)], fill=(*c, 255))
    img = Image.alpha_composite(img, bar_layer)

    # separator line
    sep_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sd = ImageDraw.Draw(sep_layer)
    for xi in range(W):
        t = xi / W
        c = lerp_color(RED, PURPLE, t)
        sd.point((xi, H - bar_h), fill=(*c, 90))
        sd.point((xi, H - bar_h - 1), fill=(*c, 30))
    img = Image.alpha_composite(img, sep_layer.filter(ImageFilter.GaussianBlur(1)))
    img = Image.alpha_composite(img, sep_layer)

    # URL
    f_url = font("GeistMono-Regular.ttf", 20)
    url   = "starlightmix.com"
    bb_ur = ImageDraw.Draw(img).textbbox((0, 0), url, font=f_url, anchor="lt")
    uw    = bb_ur[2] - bb_ur[0]
    ImageDraw.Draw(img).text(
        (W // 2 - uw // 2, H - 33), url, font=f_url,
        fill=(130, 115, 175, 185),
    )

    # ── grain ─────────────────────────────────────────────────────────────────
    img = add_grain(img, amount=8, seed=55)

    out  = img.convert("RGB")
    path = os.path.join(OUT_DIR, "og-image.png")
    out.save(path, "PNG", optimize=True)
    print(f"Saved: {path}")
    return path


# ─────────────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    p1 = make_thumbnail()
    p2 = make_og_image()
    print("Done.")
    print(f"  Thumbnail : {p1}")
    print(f"  OG Image  : {p2}")
