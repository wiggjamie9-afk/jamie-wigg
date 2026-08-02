#!/usr/bin/env python3
"""Build a true KDP wraparound cover — back + spine + front as one image.

The wide watercolour (book<N>/redesign/art/cover.png) is laid full-bleed across
the WHOLE wrap so the illustration flows from the front, across the spine, onto
the back — a real "wrap around" like a printed picture book. Branding is then
overlaid: series banner + title + author on the front, blurb + barcode box on
the back, title on the spine.

Usage: python build_wraparound.py <num> [<num> ...]
Output: book<num>/redesign/wraparound-cover.png  (and .jpg for KDP upload)
"""
import json
import pathlib
import sys

from PIL import Image, ImageDraw, ImageFilter, ImageFont

REPO = pathlib.Path(__file__).parent
FONTS = REPO / ".claude" / "skills" / "canvas-design" / "canvas-fonts"
SERIES = "Sonny's Cozy Quokka Bedtime Tales"

# 6x9 trim, thin 24pp spine, full bleed. Match front-cover height (2560).
H = 2560
PANEL_W = 1600          # front / back trim width
SPINE_W = 120           # visible spine for a slim picture book
BLEED = 0               # art already extends; KDP bleed lives in the crop
BACK_X0 = 0
SPINE_X0 = PANEL_W
FRONT_X0 = PANEL_W + SPINE_W
W = PANEL_W * 2 + SPINE_W   # 3320

NAVY = (26, 31, 58)
GOLD = (201, 162, 74)
CREAM = (250, 247, 238)
INK = (54, 44, 74)

# Canonical titles read from the finished portrait cover art (kdp-covers/*).
# For books 10-35 these DIFFER from the stale story JSON, so the spine must use
# these to stay consistent with the printed front cover.
COVER_TITLES = {
    1: "Sunny and the Flying Fox", 2: "Sunny and the Sleepy Wombat",
    3: "Sunny and the Tawny Frogmouth", 4: "Sunny and the Sugar Glider",
    5: "Sunny and the Little Bilby", 6: "Sunny and the Kookaburra",
    7: "Sunny and the Platypus", 8: "Sunny and the Sleepy Echidna",
    9: "Sunny and the Ringtail Possum", 10: "Sunny and the Little Penguin",
    11: "Sunny and the Sleepy Koala", 12: "Sunny and the Boobook Owl",
    13: "Sunny and the Green Tree Frog", 14: "Sunny and the Pademelon",
    15: "Sunny and the Little Numbat", 16: "Sunny and the Spotted Quoll",
    17: "Sunny and the Bandicoot", 18: "Sunny and the Dingo Puppy",
    19: "Sunny and the Emu Chick", 20: "Sunny and the Blue-tongue Lizard",
    21: "Sunny and the Pink Galah", 22: "Sunny and the White Cockatoo",
    23: "Sunny and the Lyrebird", 24: "Sunny and the Sea Turtle",
    25: "Sunny and the Seal Pup", 26: "Sunny and the Willie Wagtail",
    27: "Sunny and the Glow Worms", 28: "Sunny and the Brolga",
    29: "Sunny and the Kangaroo Joey", 30: "Sunny and the Black Swan",
    31: "Sunny and the Fairy-wren", 32: "Sunny and the Barking Gecko",
    33: "Sunny and the Magpie", 34: "Sunny and the Dolphin",
    35: "Sunny and the Cassowary Chick",
}

TITLE_F = FONTS / "Gloock-Regular.ttf"
BODY_F = FONTS / "WorkSans-Regular.ttf"
BODYB_F = FONTS / "WorkSans-Bold.ttf"
SERIF_F = FONTS / "CrimsonPro-Regular.ttf"
SERIF_I = FONTS / "CrimsonPro-Italic.ttf"


def font(p, s):
    return ImageFont.truetype(str(p), s)


def wrap(d, text, f, maxw):
    out = []
    for para in text.split("\n"):
        cur = ""
        for word in para.split():
            t = (cur + " " + word).strip()
            if d.textlength(t, font=f) <= maxw:
                cur = t
            else:
                if cur:
                    out.append(cur)
                cur = word
        out.append(cur)
    return out


def back_art(num):
    """A calm, text-free interior watercolour fills the BACK+SPINE region so the
    same cozy world continues behind the blurb. cover.png is avoided because for
    some books it carries baked-in title text; interior pages never do."""
    base = REPO / f"book{num}" / "redesign" / "art"
    src = None
    for name in ("p13.png", "p14.png", "p12.png", "p15.png", "p08.png", "cover.png"):
        if (base / name).exists():
            src = base / name
            break
    art = Image.open(src).convert("RGB")
    region_w = PANEL_W + SPINE_W
    scale = max(region_w / art.width, H / art.height)
    art = art.resize((round(art.width * scale), round(art.height * scale)), Image.LANCZOS)
    x = (art.width - region_w) // 2
    y = (art.height - H) // 2
    return art.crop((x, y, x + region_w, y + H))


def front_cover(num):
    """The approved, purpose-made portrait front cover fills the front panel."""
    nn = f"{int(num):02d}"
    fc = Image.open(REPO / "kdp-covers" / f"book{nn}-kdp-cover.jpg").convert("RGB")
    return fc.resize((PANEL_W, H), Image.LANCZOS)


def soft_panel(base, box, radius, fill):
    """Rounded translucent panel drawn onto a copy, returned composited."""
    overlay = Image.new("RGBA", base.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    d.rounded_rectangle(box, radius=radius, fill=fill)
    return Image.alpha_composite(base.convert("RGBA"), overlay).convert("RGB")


def build(num):
    d = REPO / f"book{num}" / "redesign"
    spec = json.loads((d / f"book{num}-v2-extended.json").read_text())
    # spine/back title comes from the canonical COVER title (matches the printed
    # front), not the stale story JSON.
    title = COVER_TITLES.get(int(num), spec["title"])
    booknum = spec.get("book_number", num)
    author = spec.get("author", "Jamie Wigg")
    blurb = spec["back_cover_blurb"]

    img = Image.new("RGBA", (W, H), (26, 31, 58, 255))
    img.paste(back_art(num), (0, 0))            # back + spine background
    img.paste(front_cover(num), (FRONT_X0, 0))  # approved portrait front cover
    draw = ImageDraw.Draw(img, "RGBA")

    # ---- gentle darkening on back + spine so text reads over busy art ----
    shade = Image.new("RGBA", img.size, (0, 0, 0, 0))
    sd = ImageDraw.Draw(shade)
    sd.rectangle([BACK_X0, 0, SPINE_X0 + SPINE_W, H], fill=(18, 22, 44, 150))
    img = Image.alpha_composite(img, shade)
    draw = ImageDraw.Draw(img, "RGBA")

    # ================= SPINE =================
    spine = Image.new("RGBA", (H, SPINE_W), (0, 0, 0, 0))
    sdd = ImageDraw.Draw(spine)
    sdd.rectangle([0, 0, H, SPINE_W], fill=(26, 31, 58, 205))
    sf = font(TITLE_F, 60)
    st = title
    wln = sdd.textlength(st, font=sf)
    while wln > H - 260 and sf.size > 34:
        sf = font(TITLE_F, sf.size - 4)
        wln = sdd.textlength(st, font=sf)
    sdd.text(((H - wln) / 2, (SPINE_W - sf.size) / 2 - 6), st, font=sf, fill=GOLD)
    af2 = font(BODYB_F, 34)
    at2 = author
    wa = sdd.textlength(at2, font=af2)
    sdd.text((H - wa - 70, (SPINE_W - 34) / 2 - 2), at2, font=af2, fill=CREAM)
    spine = spine.rotate(90, expand=True)
    img.alpha_composite(spine, (SPINE_X0, 0))

    # ================= BACK PANEL (elegant, framed to match front) =========
    bx = BACK_X0

    def ctext(s, f, cy, fill, stroke=0, sfill=NAVY):
        w = draw.textlength(s, font=f)
        draw.text((bx + (PANEL_W - w) / 2, cy), s, font=f, fill=fill,
                  stroke_width=stroke, stroke_fill=sfill)
        return w

    def flourish(cy, half=190):
        """A slim gold rule with a centred diamond — echoes the front's trim."""
        cx = bx + PANEL_W // 2
        draw.line([cx - half, cy, cx - 26, cy], fill=GOLD, width=3)
        draw.line([cx + 26, cy, cx + half, cy], fill=GOLD, width=3)
        draw.polygon([(cx, cy - 11), (cx + 15, cy), (cx, cy + 11), (cx - 15, cy)],
                     fill=GOLD)

    # gold double-keyline frame with corner ticks (mirrors the front panel)
    m = 46
    draw.rounded_rectangle([m, m, PANEL_W - m, H - m], radius=26,
                           outline=GOLD, width=6)
    draw.rounded_rectangle([m + 16, m + 16, PANEL_W - m - 16, H - m - 16],
                           radius=18, outline=(201, 162, 74, 150), width=2)

    # cream banner with the series name in gold (same identity as the front)
    bf = font(TITLE_F, 58)
    lines = wrap(draw, SERIES, bf, PANEL_W - 300)
    while len(lines) > 2 and bf.size > 40:
        bf = font(TITLE_F, bf.size - 4); lines = wrap(draw, SERIES, bf, PANEL_W - 300)
    lh = int(bf.size * 1.14)
    bh = lh * len(lines) + 60
    by0 = 132
    img = soft_panel(img, [bx + 150, by0, bx + PANEL_W - 150, by0 + bh],
                     26, (250, 247, 238, 240))
    draw = ImageDraw.Draw(img, "RGBA")
    yy = by0 + 30
    for ln in lines:
        ctext(ln, bf, yy, (176, 132, 55)); yy += lh
    flourish(by0 + bh + 60)

    # blurb — elegant serif, centred, on a warm cream card with a gold keyline
    pf = font(SERIF_F, 60)
    inner = PANEL_W - 340
    bl = wrap(draw, blurb, pf, inner)
    blh = int(60 * 1.44)
    ptop = by0 + bh + 120
    ph = blh * len(bl) + 120
    img = soft_panel(img, [bx + 130, ptop, bx + PANEL_W - 130, ptop + ph],
                     30, (250, 247, 238, 235))
    draw = ImageDraw.Draw(img, "RGBA")
    draw.rounded_rectangle([bx + 130, ptop, bx + PANEL_W - 130, ptop + ph],
                           radius=30, outline=(201, 162, 74, 170), width=3)
    yy = ptop + 58
    for ln in bl:
        ctext(ln, pf, yy, INK); yy += blh

    # closing tagline in gold serif italic
    cf = font(SERIF_I, 54)
    ctext("A cosy bedtime tale for little ones, ages 1–5.", cf,
          ptop + ph + 66, GOLD, stroke=2, sfill=NAVY)
    flourish(ptop + ph + 158)

    # barcode placeholder — tidy card with a warm keyline, bottom-right
    bw, bh2 = 560, 320
    bxx = bx + PANEL_W - bw - 130
    byy = H - bh2 - 150
    draw.rounded_rectangle([bxx, byy, bxx + bw, byy + bh2], radius=14,
                           fill=(255, 255, 255, 255), outline=(201, 162, 74, 200), width=3)
    lf = font(SERIF_I, 34)
    for i, t in enumerate(["ISBN / barcode", "placed here by KDP"]):
        w = draw.textlength(t, font=lf)
        draw.text((bxx + (bw - w) / 2, byy + 108 + i * 46), t, font=lf,
                  fill=(150, 132, 96, 255))

    # publisher wordmark, gold, bottom-left inside the frame
    pf2 = font(TITLE_F, 40)
    draw.text((bx + 130, H - 210), "rhythmixapp.com.au", font=pf2, fill=GOLD,
              stroke_width=2, stroke_fill=NAVY)

    out = img.convert("RGB")
    png = d / "wraparound-cover.png"
    jpg = d / "wraparound-cover.jpg"
    out.save(png)
    out.save(jpg, "JPEG", quality=92, optimize=True)
    print(f"book{num}: wraparound-cover.png/.jpg  {W}x{H}  ({jpg.stat().st_size//1024}KB)")


if __name__ == "__main__":
    for a in sys.argv[1:]:
        build(a)
