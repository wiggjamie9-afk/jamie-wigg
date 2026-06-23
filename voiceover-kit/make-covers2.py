#!/usr/bin/env python3
"""STARLIGHTMIX Audio Network — premium 3000x3000 cover generator (v2).
Photographic compositing in Pillow: gradient base + blurred light blooms +
film grain + vignette + gradient-filled display type + vector genre glyph.
Fully local (premium fonts from Google Fonts, glyphs via cairosvg). No image CDN needed.

Run:  python3 make-covers2.py [NN]
"""
import os, io, math, html
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops
import cairosvg
from importlib import import_module

HERE = os.path.dirname(__file__)
FONTS = os.path.join(HERE, "fonts")
OUT = os.path.join(HERE, "covers")
os.makedirs(OUT, exist_ok=True)
S = 3000

# reuse show definitions + glyph library from make-covers.py
mc = import_module("make_covers")
SHOWS = mc.SHOWS
glyph_svg = mc.glyph_svg

def hx(c):
    c = c.lstrip("#")
    return tuple(int(c[i:i+2], 16) for i in (0, 2, 4))

def vgrad(w, h, top, bot):
    base = Image.new("RGB", (1, h))
    for y in range(h):
        t = y / (h - 1)
        base.putpixel((0, y), tuple(int(top[i] + (bot[i] - top[i]) * t) for i in range(3)))
    return base.resize((w, h))

def bloom(size, cx, cy, rad, rgb, a):
    """A soft blurred radial light, built small then upscaled for speed + smoothness."""
    sc = 4
    w = size // sc
    layer = Image.new("RGBA", (w, w), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    r = rad / sc
    d.ellipse([cx/sc - r, cy/sc - r, cx/sc + r, cy/sc + r], fill=rgb + (a,))
    layer = layer.filter(ImageFilter.GaussianBlur(r * 0.55))
    return layer.resize((size, size), Image.LANCZOS)

def grain(size, sigma=18, alpha=14):
    n = Image.effect_noise((size, size), sigma).convert("L")
    out = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    out.putalpha(n.point(lambda v: int(abs(v - 128) / 128 * alpha)))
    # tint grain neutral grey
    grey = Image.new("RGBA", (size, size), (255, 255, 255, 0))
    grey.putalpha(out.getchannel("A"))
    return grey

def vignette(size, strength=120):
    g = Image.radial_gradient("L").resize((size, size))  # 0 center -> 255 edge
    mask = g.point(lambda v: int(v / 255 * strength))
    dark = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    dark.putalpha(mask)
    return dark

FCACHE = {}
def font(name, size, wght=None):
    key = (name, size, wght)
    if key in FCACHE: return FCACHE[key]
    f = ImageFont.truetype(os.path.join(FONTS, name), size)
    if wght is not None:
        try: f.set_variation_by_axes([wght])
        except Exception:
            try: f.set_variation_by_axes([wght, 14])
            except Exception: pass
    FCACHE[key] = f
    return f

def text_w(draw, s, f, tracking=0):
    if not tracking:
        return draw.textbbox((0, 0), s, font=f)[2]
    return sum(draw.textbbox((0, 0), ch, font=f)[2] for ch in s) + tracking * (len(s) - 1)

def draw_tracked(draw, xy, s, f, fill, tracking, anchor_center=True):
    total = text_w(draw, s, f, tracking)
    x = xy[0] - total / 2 if anchor_center else xy[0]
    y = xy[1]
    for ch in s:
        draw.text((x, y), ch, font=f, fill=fill)
        x += draw.textbbox((0, 0), ch, font=f)[2] + tracking

def grad_fill(w, h, top, bot):
    return vgrad(w, h, top, bot).convert("RGBA")

def title_layer(lines, f, cx, y0, lh, accent, accent2):
    """Render title lines: line 0 white, others accent->accent2 gradient. Returns RGBA full-canvas."""
    layer = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    tmp = Image.new("L", (S, S), 0)
    td = ImageDraw.Draw(tmp)
    d2 = ImageDraw.Draw(layer)
    y = y0
    for i, ln in enumerate(lines):
        bbox = td.textbbox((0, 0), ln, font=f)
        w = bbox[2] - bbox[0]
        x = cx - w / 2 - bbox[0]
        if i == 0:
            d2.text((x, y), ln, font=f, fill=(255, 255, 255, 255))
        else:
            mask = Image.new("L", (S, S), 0)
            ImageDraw.Draw(mask).text((x, y), ln, font=f, fill=255)
            g = grad_fill(S, S, accent, accent2)
            layer = Image.composite(g, layer, mask)
            d2 = ImageDraw.Draw(layer)
        y += lh
    return layer

def glyph_img(sh, gcx, gcy, gr):
    svg = f'<svg xmlns="http://www.w3.org/2000/svg" width="{S}" height="{S}" viewBox="0 0 {S} {S}">{glyph_svg(sh["glyph"], gcx, gcy, gr, sh["accent"], sh["accent2"])}</svg>'
    png = cairosvg.svg2png(bytestring=svg.encode(), output_width=S, output_height=S)
    return Image.open(io.BytesIO(png)).convert("RGBA")

def make(num, sh):
    c1, c2 = hx(sh["c1"]), hx(sh["c2"])
    acc, acc2 = hx(sh["accent"]), hx(sh["accent2"])
    darker = tuple(int(x * 0.45) for x in c1)

    # --- background: gradient + blooms (built at quarter scale, upscaled) ---
    bg = vgrad(S, S, c2, darker).convert("RGBA")
    bg.alpha_composite(bloom(S, S * 0.5, S * 0.30, S * 0.42, acc, 150))
    bg.alpha_composite(bloom(S, S * 0.22, S * 0.12, S * 0.26, acc2, 70))
    bg.alpha_composite(bloom(S, S * 0.82, S * 0.40, S * 0.24, acc, 55))

    # glyph with soft glow
    g = glyph_img(sh, S * 0.5, S * 0.30, S * 0.150)
    glow = g.filter(ImageFilter.GaussianBlur(28))
    bg.alpha_composite(glow)
    bg.alpha_composite(g)

    # --- texture + vignette ---
    bg.alpha_composite(grain(S))
    bg.alpha_composite(vignette(S, 130))

    d = ImageDraw.Draw(bg)
    cx = S // 2

    # thin inner frame
    d.rounded_rectangle([60, 60, S - 60, S - 60], radius=64, outline=(255, 255, 255, 22), width=3)

    # category eyebrow
    draw_tracked(d, (cx, int(S * 0.452)), sh["cat"], font("SpaceMono-Bold.ttf", 56), acc + (255,), 18)

    # title (Anton, condensed display)
    lines = sh["title"]
    ts = 322 if len(lines) > 1 else 400
    tf = font("Anton-Regular.ttf", ts)
    lh = ts * 1.0
    y0 = int(S * 0.485)
    bg.alpha_composite(title_layer(lines, tf, cx, y0, lh, acc, acc2))
    d = ImageDraw.Draw(bg)

    n = len(lines)
    rule_y = int(y0 + n * lh + 78)
    d.rounded_rectangle([cx - 120, rule_y, cx + 120, rule_y + 9], radius=4, fill=acc + (255,))

    # tagline (Inter 500)
    tag_f = font("Inter.ttf", 68, 500)
    tw = d.textbbox((0, 0), sh["tag"], font=tag_f)[2]
    d.text((cx - tw / 2, rule_y + 70), sh["tag"], font=tag_f, fill=(226, 222, 232, 255))

    # footer
    draw_tracked(d, (cx, S - 230), "STARLIGHTMIX AUDIO", font("SpaceMono-Bold.ttf", 44), (168, 164, 182, 255), 14)
    draw_tracked(d, (cx, S - 150), "studio.starlightmix.com", font("SpaceMono-Regular.ttf", 38), (122, 118, 138, 255), 8)

    # number badge
    bd = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    bdd = ImageDraw.Draw(bd)
    bdd.ellipse([110, 110, 300, 300], fill=acc + (255,))
    badge_grad = grad_fill(S, S, acc, acc2)
    cmask = Image.new("L", (S, S), 0)
    ImageDraw.Draw(cmask).ellipse([110, 110, 300, 300], fill=255)
    bg = Image.composite(badge_grad, bg, cmask)
    d = ImageDraw.Draw(bg)
    nf = font("ArchivoBlack-Regular.ttf", 96)
    nb = d.textbbox((0, 0), num, font=nf)
    d.text((205 - (nb[2] - nb[0]) / 2 - nb[0], 205 - (nb[3] - nb[1]) / 2 - nb[1]), num, font=nf, fill=(16, 8, 12, 255))

    out = os.path.join(OUT, f"{num}-{sh['slug']}.jpg")
    bg.convert("RGB").save(out, "JPEG", quality=90, optimize=True, progressive=True)
    return out

if __name__ == "__main__":
    import sys
    only = sys.argv[1] if len(sys.argv) > 1 else None
    for num, sh in SHOWS.items():
        if only and num != only: continue
        print("rendered", make(num, sh))
