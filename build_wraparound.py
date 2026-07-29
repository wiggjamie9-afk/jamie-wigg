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

    # ================= BACK PANEL =================
    bx = BACK_X0
    # series wordmark top
    wf = font(TITLE_F, 62)
    wln = draw.textlength(SERIES, wf)
    while wln > PANEL_W - 200 and wf.size > 40:
        wf = font(TITLE_F, wf.size - 4)
        wln = draw.textlength(SERIES, wf)
    draw.text((bx + (PANEL_W - wln) / 2, 120), SERIES, font=wf, fill=CREAM,
              stroke_width=3, stroke_fill=NAVY)

    # blurb in a soft cream panel
    pf = font(BODY_F, 52)
    inner = PANEL_W - 320
    bl = wrap(draw, blurb, pf, inner)
    blh = int(52 * 1.4)
    ptop = 320
    ph = blh * len(bl) + 130
    img = soft_panel(img, [bx + 120, ptop, bx + PANEL_W - 120, ptop + ph],
                     36, (250, 247, 238, 232))
    draw = ImageDraw.Draw(img, "RGBA")
    yy = ptop + 64
    for ln in bl:
        draw.text((bx + 170, yy), ln, font=pf, fill=INK)
        yy += blh

    # closing line
    cf = font(BODYB_F, 46)
    closing = "A cosy bedtime tale for ages 1-5."
    wln = draw.textlength(closing, cf)
    draw.text((bx + (PANEL_W - wln) / 2, ptop + ph + 70), closing, font=cf,
              fill=CREAM, stroke_width=3, stroke_fill=NAVY)

    # barcode placeholder box (KDP overlays the real barcode here)
    bw, bh2 = 620, 360
    bxx = bx + PANEL_W - bw - 110
    byy = H - bh2 - 120
    draw.rectangle([bxx, byy, bxx + bw, byy + bh2], fill=(255, 255, 255, 255))
    draw.rectangle([bxx, byy, bxx + bw, byy + bh2], outline=(150, 150, 150, 255), width=3)
    lf = font(BODY_F, 34)
    for i, t in enumerate(["ISBN / barcode", "placed here by KDP"]):
        wln = draw.textlength(t, lf)
        draw.text((bxx + (bw - wln) / 2, byy + 120 + i * 46), t, font=lf,
                  fill=(120, 120, 120, 255))

    # publisher wordmark bottom-left of back
    pf2 = font(BODYB_F, 38)
    draw.text((bx + 120, H - 130), "rhythmixapp.com.au", font=pf2, fill=CREAM,
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
