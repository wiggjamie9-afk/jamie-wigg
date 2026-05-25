#!/usr/bin/env python3
"""
RHYTHMIX brand asset generator — Neon Cosmology design philosophy.
Produces:
  thumbnail.png  (1280×720)  YouTube thumbnail
  og-image.png   (1200×630)  Social / OG image
"""

import math
import random
import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

FONTS_DIR = "/home/user/jamie-wigg/.claude/skills/canvas-design/canvas-fonts"
OUT_DIR   = "/home/user/jamie-wigg/sites/starlightmix"

def font(name, size):
    path = os.path.join(FONTS_DIR, name)
    return ImageFont.truetype(path, size)

def lerp_color(c1, c2, t):
    return tuple(int(c1[i] + (c2[i] - c1[i]) * t) for i in range(3))

def add_noise(img, amount=6, seed=42):
    """Very subtle film-grain noise."""
    rng = random.Random(seed)
    px = img.load()
    w, h = img.size
    for _ in range(w * h // 4):
        x = rng.randint(0, w - 1)
        y = rng.randint(0, h - 1)
        r, g, b, a = px[x, y] if img.mode == "RGBA" else (*px[x, y], 255)
        d = rng.randint(-amount, amount)
        px[x, y] = (
            max(0, min(255, r + d)),
            max(0, min(255, g + d)),
            max(0, min(255, b + d)),
            a,
        )
    return img

# ─────────────────────────────────────────────────────────────────────────────
# Shared drawing helpers
# ─────────────────────────────────────────────────────────────────────────────

BG       = (11, 11, 24)       # #0b0b18
RED      = (255, 31, 90)      # #ff1f5a
PURPLE   = (124, 58, 237)     # #7c3aed
WHITE    = (255, 255, 255)
DIM_WHITE= (180, 180, 200)


def draw_stars(draw, width, height, count=320, seed=7):
    rng = random.Random(seed)
    for _ in range(count):
        x = rng.randint(0, width - 1)
        y = rng.randint(0, height - 1)
        size  = rng.random() * 1.8
        alpha = rng.randint(60, 220)
        r = int(200 + rng.random() * 55)
        g = int(190 + rng.random() * 50)
        b = int(220 + rng.random() * 35)
        if size < 0.6:
            draw.point((x, y), fill=(r, g, b, alpha))
        else:
            draw.ellipse(
                (x - size, y - size, x + size, y + size),
                fill=(r, g, b, alpha),
            )


def draw_radial_glow(layer, cx, cy, r_max, color, alpha_peak=160):
    """Soft radial glow blob on a transparent RGBA layer."""
    draw = ImageDraw.Draw(layer)
    steps = 80
    for i in range(steps, 0, -1):
        t     = i / steps
        r     = int(r_max * t)
        alpha = int(alpha_peak * (1 - t) ** 1.8)
        cr    = lerp_color(color, BG, 1 - t)
        draw.ellipse(
            (cx - r, cy - r, cx + r, cy + r),
            fill=(*cr, alpha),
        )


def horizontal_gradient_row(draw, y, x0, x1, c_left, c_right):
    w = x1 - x0
    for i in range(w):
        t = i / max(w - 1, 1)
        c = lerp_color(c_left, c_right, t)
        draw.point((x0 + i, y), fill=(*c, 255))


def draw_gradient_text(
    img, text, font_obj, cx, y, c_left, c_right, anchor="mm"
):
    """Render text with a horizontal gradient fill using a mask."""
    # 1. measure
    dummy = ImageDraw.Draw(img)
    bb    = dummy.textbbox((0, 0), text, font=font_obj, anchor="lt")
    tw    = bb[2] - bb[0]
    th    = bb[3] - bb[1]

    # 2. build text mask
    mask  = Image.new("L", (tw, th), 0)
    md    = ImageDraw.Draw(mask)
    md.text((-bb[0], -bb[1]), text, font=font_obj, fill=255)

    # 3. build gradient strip
    grad  = Image.new("RGB", (tw, th))
    gd    = ImageDraw.Draw(grad)
    for xi in range(tw):
        t = xi / max(tw - 1, 1)
        c = lerp_color(c_left, c_right, t)
        gd.line([(xi, 0), (xi, th)], fill=c)

    # 4. composite onto img
    if anchor == "mm":
        px = cx - tw // 2
        py = y  - th // 2
    elif anchor == "mt":
        px = cx - tw // 2
        py = y
    else:
        px, py = cx, y

    grad_rgba = grad.convert("RGBA")
    img.paste(grad_rgba, (px, py), mask)


def draw_waveform(draw, width, height, y_center, wave_height, segments=260,
                  color_left=RED, color_right=PURPLE, alpha=200, glow=True,
                  glow_img=None):
    """Sine-composite waveform across the canvas width.
    glow_img: an RGBA Image object to draw the glow pass onto (optional).
    """
    seed   = 12345
    rng    = random.Random(seed)
    freqs  = [1.0, 2.3, 3.7, 5.1, 0.7]
    phases = [rng.random() * math.pi * 2 for _ in freqs]
    amps   = [0.45, 0.25, 0.15, 0.10, 0.05]

    pts = []
    for i in range(segments + 1):
        t  = i / segments
        nx = t * 2 * math.pi
        y  = sum(a * math.sin(f * nx + p) for a, f, p in zip(amps, freqs, phases))
        x  = int(t * width)
        yp = int(y_center + y * wave_height)
        pts.append((x, yp))

    # glow pass — blurred copy
    if glow and glow_img is not None:
        gd = ImageDraw.Draw(glow_img)
        for j in range(len(pts) - 1):
            t = j / len(pts)
            c = lerp_color(color_left, color_right, t)
            for thick in (6, 4, 2):
                gd.line([pts[j], pts[j + 1]], fill=(*c, 60), width=thick)

    # crisp line
    for j in range(len(pts) - 1):
        t = j / len(pts)
        c = lerp_color(color_left, color_right, t)
        draw.line([pts[j], pts[j + 1]], fill=(*c, alpha), width=2)


# ─────────────────────────────────────────────────────────────────────────────
# ASSET 1: YouTube Thumbnail 1280×720
# ─────────────────────────────────────────────────────────────────────────────

def make_thumbnail():
    W, H = 1280, 720
    img  = Image.new("RGBA", (W, H), (*BG, 255))

    # ── background depth layers ──────────────────────────────────────────────
    # subtle vertical gradient from navy-deep to near-black
    bg_grad = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    bgd     = ImageDraw.Draw(bg_grad)
    for y in range(H):
        t = y / H
        c = lerp_color((14, 12, 32), (7, 7, 16), t)
        bgd.line([(0, y), (W, y)], fill=(*c, 255))
    img = Image.alpha_composite(img, bg_grad)

    # ── stars ─────────────────────────────────────────────────────────────────
    star_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw_stars(ImageDraw.Draw(star_layer), W, H, count=380, seed=42)
    img = Image.alpha_composite(img, star_layer)

    # ── central glow halo (red-purple blended) ───────────────────────────────
    halo_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    # red halo offset left
    draw_radial_glow(halo_layer, W // 2 - 60, H // 2 - 30, 340, RED, alpha_peak=110)
    # purple halo offset right
    draw_radial_glow(halo_layer, W // 2 + 60, H // 2 - 10, 300, PURPLE, alpha_peak=100)
    halo_layer = halo_layer.filter(ImageFilter.GaussianBlur(radius=28))
    img = Image.alpha_composite(img, halo_layer)

    # ── waveform glow layer ───────────────────────────────────────────────────
    wave_glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    main_draw = ImageDraw.Draw(img)

    wave_y = int(H * 0.78)   # lower-third
    draw_waveform(
        main_draw, W, H, wave_y, wave_height=44,
        color_left=RED, color_right=PURPLE, alpha=230,
        glow=True, glow_img=wave_glow,
    )
    # second, fainter echo wave
    draw_waveform(
        main_draw, W, H, wave_y + 26, wave_height=22,
        color_left=(180, 20, 80), color_right=(90, 40, 180), alpha=90,
        glow=False, glow_img=None,
    )
    wave_glow_blurred = wave_glow.filter(ImageFilter.GaussianBlur(radius=10))
    img = Image.alpha_composite(img, wave_glow_blurred)

    # ── text rendering ────────────────────────────────────────────────────────
    draw = ImageDraw.Draw(img)

    # RHYTHMIX — bold, gradient, dominant
    f_bold = font("BigShoulders-Bold.ttf", 178)
    draw_gradient_text(img, "RHYTHMIX", f_bold, W // 2, int(H * 0.44),
                       RED, PURPLE, anchor="mm")

    # white glow behind wordmark (soft aura under the letters)
    aura_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw_gradient_text(aura_layer, "RHYTHMIX", f_bold, W // 2, int(H * 0.44),
                       (255, 80, 120), (160, 80, 255), anchor="mm")
    aura_blurred = aura_layer.filter(ImageFilter.GaussianBlur(radius=22))
    img = Image.alpha_composite(img, aura_blurred)
    # re-draw sharp text on top
    draw_gradient_text(img, "RHYTHMIX", f_bold, W // 2, int(H * 0.44),
                       RED, PURPLE, anchor="mm")

    # subtitle
    f_sub  = font("WorkSans-Regular.ttf", 34)
    subtitle = "TURN ANY IDEA INTO MUSIC"
    bb = ImageDraw.Draw(img).textbbox((0, 0), subtitle, font=f_sub, anchor="lt")
    tw = bb[2] - bb[0]
    sx = W // 2 - tw // 2
    sy = int(H * 0.62)
    # subtle glow under subtitle
    sub_glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(sub_glow).text((sx, sy), subtitle, font=f_sub,
                                   fill=(200, 160, 255, 180))
    sub_glow = sub_glow.filter(ImageFilter.GaussianBlur(radius=8))
    img = Image.alpha_composite(img, sub_glow)
    # crisp subtitle
    ImageDraw.Draw(img).text((sx, sy), subtitle, font=f_sub,
                               fill=(210, 195, 255, 220))

    # ── thin horizontal separator above waveform ─────────────────────────────
    draw2 = ImageDraw.Draw(img)
    sep_y = wave_y - 36
    for xi in range(W):
        t = xi / W
        c = lerp_color(RED, PURPLE, t)
        draw2.point((xi, sep_y), fill=(*c, 60))

    # ── film grain ────────────────────────────────────────────────────────────
    img = add_noise(img, amount=8)

    out = img.convert("RGB")
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

    # ── background gradient ───────────────────────────────────────────────────
    bg_grad = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    bgd     = ImageDraw.Draw(bg_grad)
    for y in range(H):
        t = y / H
        c = lerp_color((13, 11, 28), (7, 7, 16), t)
        bgd.line([(0, y), (W, y)], fill=(*c, 255))
    img = Image.alpha_composite(img, bg_grad)

    # ── stars (sparser, left half emphasis) ──────────────────────────────────
    star_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw_stars(ImageDraw.Draw(star_layer), W, H, count=280, seed=99)
    img = Image.alpha_composite(img, star_layer)

    # ── left glow halo ────────────────────────────────────────────────────────
    halo_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw_radial_glow(halo_layer, 280, H // 2, 320, RED,    alpha_peak=90)
    draw_radial_glow(halo_layer, 320, H // 2, 260, PURPLE, alpha_peak=80)
    halo_layer = halo_layer.filter(ImageFilter.GaussianBlur(radius=30))
    img = Image.alpha_composite(img, halo_layer)

    # ── subtle vertical divider ───────────────────────────────────────────────
    divider_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    dd = ImageDraw.Draw(divider_layer)
    div_x = 600
    for y in range(H):
        t = y / H
        c = lerp_color(RED, PURPLE, t)
        dd.point((div_x, y), fill=(*c, 55))
        dd.point((div_x + 1, y), fill=(*c, 25))
    img = Image.alpha_composite(img, divider_layer)

    # ── LEFT HALF: RHYTHMIX stacked wordmark ──────────────────────────────────
    # "RHYTHM" large
    f_r1 = font("BigShoulders-Bold.ttf", 148)
    draw_gradient_text(img, "RHYTHM", f_r1, 300, 200, RED, PURPLE, anchor="mm")
    # aura
    a1 = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw_gradient_text(a1, "RHYTHM", f_r1, 300, 200, (255, 80, 120), (160, 80, 255), anchor="mm")
    img = Image.alpha_composite(img, a1.filter(ImageFilter.GaussianBlur(18)))
    draw_gradient_text(img, "RHYTHM", f_r1, 300, 200, RED, PURPLE, anchor="mm")

    # "IX" — slightly smaller, shifted right for visual rhythm
    f_r2 = font("BigShoulders-Bold.ttf", 148)
    draw_gradient_text(img, "IX", f_r2, 380, 340, PURPLE, RED, anchor="mm")
    a2 = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw_gradient_text(a2, "IX", f_r2, 380, 340, (160, 80, 255), (255, 80, 120), anchor="mm")
    img = Image.alpha_composite(img, a2.filter(ImageFilter.GaussianBlur(18)))
    draw_gradient_text(img, "IX", f_r2, 380, 340, PURPLE, RED, anchor="mm")

    # tagline under wordmark
    f_tag = font("WorkSans-Regular.ttf", 22)
    tag   = "AI MUSIC PLATFORM"
    bb    = ImageDraw.Draw(img).textbbox((0, 0), tag, font=f_tag, anchor="lt")
    tw    = bb[2] - bb[0]
    ImageDraw.Draw(img).text(
        (300 - tw // 2, 420), tag, font=f_tag, fill=(160, 140, 200, 190),
    )

    # small waveform under tagline
    wm_draw = ImageDraw.Draw(img)
    wave_glow2 = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw_waveform(
        wm_draw, 540, H, 490, wave_height=22, segments=200,
        color_left=RED, color_right=PURPLE, alpha=180,
        glow=True, glow_img=wave_glow2,
    )
    img = Image.alpha_composite(img, wave_glow2.filter(ImageFilter.GaussianBlur(7)))
    draw_waveform(
        ImageDraw.Draw(img), 540, H, 490, wave_height=22, segments=200,
        color_left=RED, color_right=PURPLE, alpha=200,
        glow=False, glow_img=None,
    )

    # ── RIGHT HALF: feature grid 2×3 ─────────────────────────────────────────
    features = [
        ("🎛", "Stem Split"),
        ("✨", "AI Master"),
        ("💸", "Royalties"),
        ("🎹", "MIDI / DAW"),
        ("🎬", "Sync License"),
        ("🥽", "VR Concert"),
    ]

    # grid layout: 2 cols × 3 rows
    cell_w   = 250
    cell_h   = 140
    grid_x0  = div_x + 55
    grid_y0  = 72

    f_icon  = font("Outfit-Regular.ttf",   36)
    f_label = font("WorkSans-Regular.ttf", 20)

    for idx, (icon, label) in enumerate(features):
        col  = idx % 2
        row  = idx // 2
        cx   = grid_x0 + col * (cell_w + 20) + cell_w // 2
        cy   = grid_y0 + row * cell_h + cell_h // 2

        # card background — very subtle
        card_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        cd = ImageDraw.Draw(card_layer)
        x0_c = grid_x0 + col * (cell_w + 20)
        y0_c = grid_y0 + row * cell_h
        cd.rounded_rectangle(
            (x0_c, y0_c, x0_c + cell_w, y0_c + cell_h - 14),
            radius=12,
            fill=(255, 255, 255, 9),
            outline=(*lerp_color(RED, PURPLE, idx / 5), 45),
            width=1,
        )
        img = Image.alpha_composite(img, card_layer)

        draw3 = ImageDraw.Draw(img)

        # icon — use Outfit for emoji fallback width
        bb_icon = draw3.textbbox((0, 0), icon, font=f_icon, anchor="lt")
        iw = bb_icon[2] - bb_icon[0]
        draw3.text(
            (cx - iw // 2, cy - 34), icon, font=f_icon, fill=(255, 255, 255, 230),
        )

        # label
        bb_lbl = draw3.textbbox((0, 0), label, font=f_label, anchor="lt")
        lw = bb_lbl[2] - bb_lbl[0]
        t_color = lerp_color(RED, PURPLE, idx / 5)
        draw3.text(
            (cx - lw // 2, cy + 8), label, font=f_label,
            fill=(*t_color, 220),
        )

    # ── bottom bar: URL ───────────────────────────────────────────────────────
    bar_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    bd = ImageDraw.Draw(bar_layer)
    for xi in range(W):
        t = xi / W
        c = lerp_color((20, 10, 35), (12, 8, 28), t)
        bd.line([(xi, H - 54), (xi, H)], fill=(*c, 255))
    img = Image.alpha_composite(img, bar_layer)

    # separator line above bar
    sep_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sd = ImageDraw.Draw(sep_layer)
    for xi in range(W):
        t = xi / W
        c = lerp_color(RED, PURPLE, t)
        sd.point((xi, H - 54), fill=(*c, 80))
    img = Image.alpha_composite(img, sep_layer)

    f_url = font("GeistMono-Regular.ttf", 20)
    url   = "starlightmix.com"
    bb_url = ImageDraw.Draw(img).textbbox((0, 0), url, font=f_url, anchor="lt")
    uw     = bb_url[2] - bb_url[0]
    ImageDraw.Draw(img).text(
        (W // 2 - uw // 2, H - 36), url, font=f_url,
        fill=(140, 120, 180, 180),
    )

    # ── film grain ────────────────────────────────────────────────────────────
    img = add_noise(img, amount=7, seed=55)

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
