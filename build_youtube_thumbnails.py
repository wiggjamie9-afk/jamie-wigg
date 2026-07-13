#!/usr/bin/env python3
"""Build a 1280x720 YouTube thumbnail for each Sunny book.

Layout: a warm dusk gradient with soft stars + moon, the portrait cover art
floated on the right with a rounded white frame + shadow, and a big bold title
on the left plus a "Read-Aloud Bedtime Story" ribbon.

Output: youtube-thumbnails/book<NN>-<slug>-thumb.png  (1280x720)
"""
import pathlib
import re

from PIL import Image, ImageDraw, ImageFont, ImageFilter

REPO = pathlib.Path(__file__).parent
FONTS = REPO / ".claude" / "skills" / "canvas-design" / "canvas-fonts"
OUT = REPO / "youtube-thumbnails"
OUT.mkdir(exist_ok=True)

W, H = 1280, 720
TITLE_FONT = FONTS / "BricolageGrotesque-Bold.ttf"
BODY_FONT = FONTS / "WorkSans-Bold.ttf"

# cozy bedtime palette
TOP = (38, 32, 74)        # deep indigo
BOT = (120, 84, 132)      # dusk mauve
ACCENT = (255, 214, 120)  # warm gold (Sunny)
CREAM = (253, 249, 240)

PB = {int(re.match(r"book(\d+)-", p.name).group(1)): p
      for p in (REPO / "kdp-paperbacks").glob("book*-paperback.pdf")}


def title_from(slug: str) -> str:
    small = {"and", "the", "of", "a"}
    return " ".join(w if w in small and i else w.capitalize()
                    for i, w in enumerate(slug.split("-")))


def gradient(w: int, h: int) -> Image.Image:
    base = Image.new("RGB", (w, h))
    px = base.load()
    for y in range(h):
        t = y / (h - 1)
        px_row = tuple(int(TOP[i] + (BOT[i] - TOP[i]) * t) for i in range(3))
        for x in range(w):
            px[x, y] = px_row
    return base


def add_stars(img: Image.Image) -> None:
    d = ImageDraw.Draw(img, "RGBA")
    # deterministic scatter (no RNG needed) — a fixed sprinkle of soft stars
    pts = [(70, 90), (180, 60), (300, 120), (150, 200), (60, 300),
           (250, 250), (360, 180), (120, 420), (300, 380), (40, 520),
           (210, 540), (330, 470), (90, 620), (270, 640), (400, 560),
           (700, 70), (900, 110), (1120, 80), (1180, 200), (1050, 260),
           (820, 60), (980, 320), (1150, 380)]
    for i, (x, y) in enumerate(pts):
        r = 2 + (i % 3)
        a = 120 + (i * 23) % 110
        d.ellipse([x - r, y - r, x + r, y + r], fill=(255, 246, 214, a))
    # moon top-left
    d.ellipse([1090, 40, 1190, 140], fill=(255, 240, 200, 235))
    d.ellipse([1112, 34, 1200, 122], fill=TOP + (255,))


def rounded(img: Image.Image, rad: int) -> Image.Image:
    mask = Image.new("L", img.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, img.size[0], img.size[1]],
                                           radius=rad, fill=255)
    out = img.convert("RGBA")
    out.putalpha(mask)
    return out


def fit_font(draw, text, font_path, max_w, start, min_size=44):
    size = start
    while size > min_size:
        f = ImageFont.truetype(str(font_path), size)
        if draw.textlength(text, font=f) <= max_w:
            return f
        size -= 3
    return ImageFont.truetype(str(font_path), min_size)


def wrap(draw, text, font, max_w):
    words, lines, cur = text.split(), [], ""
    for w in words:
        test = (cur + " " + w).strip()
        if draw.textlength(test, font=font) <= max_w:
            cur = test
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def build(num: int) -> pathlib.Path:
    slug = re.sub(r"^book\d+-", "", PB[num].name[:-len("-paperback.pdf")])
    title = title_from(slug)
    cover_path = REPO / "kids-channel" / "portrait-covers" / f"book{num:02d}.png"

    img = gradient(W, H)
    add_stars(img)
    draw = ImageDraw.Draw(img, "RGBA")

    # ---- right: portrait cover, framed ----
    cover = Image.open(cover_path).convert("RGB")
    ch = 600
    cw = int(cover.width * ch / cover.height)
    cover = cover.resize((cw, ch), Image.LANCZOS)
    frame = Image.new("RGB", (cw + 16, ch + 16), CREAM)
    frame.paste(cover, (8, 8))
    frame_r = rounded(frame, 26)
    fx = W - frame_r.size[0] - 60
    fy = (H - frame_r.size[1]) // 2
    # soft drop shadow
    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sh_mask = Image.new("L", frame_r.size, 0)
    ImageDraw.Draw(sh_mask).rounded_rectangle(
        [0, 0, frame_r.size[0], frame_r.size[1]], radius=26, fill=150)
    shadow.paste((0, 0, 0, 150), (fx + 14, fy + 18), sh_mask)
    shadow = shadow.filter(ImageFilter.GaussianBlur(16))
    img = Image.alpha_composite(img.convert("RGBA"), shadow).convert("RGB")
    img.paste(frame_r, (fx, fy), frame_r)
    draw = ImageDraw.Draw(img, "RGBA")

    # ---- left column text ----
    left_w = fx - 90
    x0 = 60

    # top ribbon: series kicker
    kf = ImageFont.truetype(str(BODY_FONT), 30)
    kick = "🌙  BEDTIME STORY"
    # emoji may not render in this font; fall back to a star glyph drawn manually
    kick = "BEDTIME STORY  •  READ ALOUD"
    kf = fit_font(draw, kick, BODY_FONT, left_w, 30, 22)
    draw.rounded_rectangle([x0, 70, x0 + draw.textlength(kick, font=kf) + 44, 128],
                           radius=28, fill=ACCENT)
    draw.text((x0 + 22, 84), kick, font=kf, fill=(50, 38, 20))

    # big title
    tf = fit_font(draw, "Sunny and the", TITLE_FONT, left_w, 92, 60)
    # scale whole title consistently: fit the longest line
    lines = wrap(draw, title, ImageFont.truetype(str(TITLE_FONT), 96), left_w)
    tf = ImageFont.truetype(str(TITLE_FONT), 96)
    while max(draw.textlength(ln, font=tf) for ln in lines) > left_w and tf.size > 52:
        tf = ImageFont.truetype(str(TITLE_FONT), tf.size - 3)
        lines = wrap(draw, title, tf, left_w)

    y = 190
    for ln in lines:
        # shadow + gold text
        draw.text((x0 + 3, y + 3), ln, font=tf, fill=(20, 16, 40, 200))
        fill = ACCENT if ln.lower().startswith(("and", "sunny")) is False else CREAM
        draw.text((x0, y), ln, font=tf, fill=CREAM)
        y += int(tf.size * 1.05)

    # accent underline
    draw.rounded_rectangle([x0, y + 6, x0 + 180, y + 20], radius=7, fill=ACCENT)

    # footer line
    ff = ImageFont.truetype(str(BODY_FONT), 34)
    foot = "Ages 1–5  ·  Soft Watercolour Art"
    draw.text((x0, H - 90), foot, font=ff, fill=(235, 224, 250))

    out = OUT / f"book{num:02d}-{slug}-thumb.png"
    img.save(out)
    return out


def main() -> None:
    for num in sorted(PB):
        out = build(num)
        print(f"book{num:02d}: {out.name}")
    print(f"\n{len(PB)} thumbnails -> youtube-thumbnails/")


if __name__ == "__main__":
    main()
