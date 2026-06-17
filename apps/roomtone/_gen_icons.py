"""Generate Roomtone app icons. Run once; output PNGs are committed."""
from PIL import Image, ImageDraw, ImageFilter
import os

BG = (13, 17, 23)           # #0d1117
ACCENT = (244, 169, 66)     # #f4a942
ACCENT_GLOW = (244, 169, 66, 90)

def make_icon(size, padding_ratio=0.16, rounded=False, splash=False, splash_size=None):
    if splash:
        W, H = splash_size
        img = Image.new("RGB", (W, H), BG)
        # tinted radial glow at top
        glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        gd = ImageDraw.Draw(glow)
        cx, cy = W // 2, H // 3
        r = int(min(W, H) * 0.55)
        for i in range(8, 0, -1):
            alpha = int(8 * i)
            gd.ellipse([cx - r * i/8, cy - r * i/8, cx + r * i/8, cy + r * i/8],
                       fill=(244, 169, 66, alpha))
        glow = glow.filter(ImageFilter.GaussianBlur(radius=80))
        img.paste(glow, (0, 0), glow)
        # centered mark
        icon_size = int(min(W, H) * 0.22)
        mark = _make_mark(icon_size)
        img.paste(mark, ((W - icon_size) // 2, (H - icon_size) // 2), mark)
        return img

    img = Image.new("RGB", (size, size), BG)
    mark = _make_mark(size, padding_ratio=padding_ratio)
    img.paste(mark, (0, 0), mark)
    return img


def _make_mark(size, padding_ratio=0.18):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))

    # high-res supersample for crisp edges
    s = 4
    SZ = size * s
    layer = Image.new("RGBA", (SZ, SZ), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)

    pad = int(SZ * padding_ratio)
    ring_w = int(SZ * 0.10)
    outer = pad
    inner_offset = ring_w
    # outer ring
    d.ellipse([outer, outer, SZ - outer, SZ - outer], outline=ACCENT, width=ring_w)
    # inner dot
    dot_pad = int(SZ * 0.38)
    d.ellipse([dot_pad, dot_pad, SZ - dot_pad, SZ - dot_pad], fill=ACCENT)

    # soft glow
    glow = layer.copy().filter(ImageFilter.GaussianBlur(radius=int(SZ * 0.04)))
    composed = Image.new("RGBA", (SZ, SZ), (0, 0, 0, 0))
    composed = Image.alpha_composite(composed, glow)
    composed = Image.alpha_composite(composed, layer)

    return composed.resize((size, size), Image.LANCZOS)


HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "icons")
os.makedirs(OUT, exist_ok=True)

# Standard PWA sizes + iOS apple-touch
for size in (180, 192, 256, 384, 512):
    img = make_icon(size)
    img.save(os.path.join(OUT, f"icon-{size}.png"), optimize=True)
    print(f"icon-{size}.png")

# maskable icon (extra padding so OS-applied masks don't crop the ring)
img = make_icon(512, padding_ratio=0.26)
img.save(os.path.join(OUT, "icon-maskable-512.png"), optimize=True)
print("icon-maskable-512.png")

# iOS splash screens (most common iPhone sizes)
for label, sz in [
    ("iphone-portrait", (1170, 2532)),    # iPhone 12/13/14
    ("iphone-pro-max",  (1290, 2796)),    # iPhone 14/15/16 Pro Max
    ("iphone-se",       (750, 1334)),     # iPhone SE
]:
    img = make_icon(0, splash=True, splash_size=sz)
    img.save(os.path.join(OUT, f"splash-{label}.png"), optimize=True)
    print(f"splash-{label}.png")
