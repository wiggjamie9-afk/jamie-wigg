#!/usr/bin/env python3
"""Generate channel-art.png — Higgsfield Soul paints Sonny, composited onto banner."""
import requests, random, sys, time, os
from pathlib import Path
from dotenv import load_dotenv
from PIL import Image, ImageDraw, ImageFont

load_dotenv(Path(__file__).parent.parent / ".env")

HIGGSFIELD_API_KEY = os.getenv("HIGGSFIELD_API_KEY")
HIGGSFIELD_SECRET  = os.getenv("HIGGSFIELD_SECRET")

W, H = 2560, 1440

PROMPT = (
    "Soft professional watercolour children's book illustration. "
    "Full body portrait of Sonny, a sweet small quokka with golden-brown fur, "
    "big warm expressive brown eyes, tiny round ears, gentle curious smile, "
    "sitting peacefully, paws resting in lap, looking slightly upward. "
    "Australian bush night setting, deep navy sky background, soft moonlight glow, "
    "glowing fireflies. Character centred and dominant, full body visible, "
    "loose watercolour brush strokes, warm cozy palette, no text, no watermark, "
    "dreamy bedtime storybook style, safe for toddlers, high quality art."
)


def fetch_sunny_higgsfield() -> bytes | None:
    """Generate Sonny via Higgsfield Soul (text-to-image)."""
    if not HIGGSFIELD_API_KEY or not HIGGSFIELD_SECRET:
        print("  No Higgsfield credentials — skipping")
        return None
    print("  Fetching Higgsfield token...")
    try:
        r = requests.post(
            "https://api.higgsfield.ai/v1/auth/token",
            json={"api_key": HIGGSFIELD_API_KEY, "secret": HIGGSFIELD_SECRET},
            timeout=30,
        )
        r.raise_for_status()
        token = r.json()["access_token"]

        print("  Requesting Soul image...")
        r2 = requests.post(
            "https://api.higgsfield.ai/v1/soul/generate",
            headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
            json={"prompt": PROMPT, "width": 900, "height": 1050, "num_images": 1},
            timeout=120,
        )
        r2.raise_for_status()
        data = r2.json()
        img_url = data.get("images", [{}])[0].get("url", "")
        if img_url:
            img_data = requests.get(img_url, timeout=60).content
            print(f"  Higgsfield OK — {len(img_data)//1024}KB")
            return img_data
        print(f"  Higgsfield: no image URL in response: {data}")
    except Exception as e:
        print(f"  Higgsfield failed: {e}")
    return None


def fetch_sunny_pollinations() -> bytes | None:
    """Fallback: generate Sonny via Pollinations FLUX (free)."""
    print("  Trying Pollinations FLUX fallback...")
    encoded = requests.utils.quote(PROMPT)
    url = (
        f"https://image.pollinations.ai/prompt/{encoded}"
        f"?width=900&height=1050&model=flux&nologo=true&seed=314"
    )
    try:
        r = requests.get(url, timeout=120)
        if r.status_code == 200 and len(r.content) > 10000:
            print(f"  Pollinations OK — {len(r.content)//1024}KB")
            return r.content
        print(f"  Pollinations: {r.status_code} / {len(r.content)} bytes")
    except Exception as e:
        print(f"  Pollinations failed: {e}")
    return None


# ── Fetch Sonny ──────────────────────────────────────────────────────────────────────────────
print("Generating Sonny illustration...")
img_bytes = fetch_sunny_higgsfield() or fetch_sunny_pollinations()

sunny_img = None
if img_bytes:
    sunny_path = Path(__file__).parent / "sunny-ai.png"
    sunny_path.write_bytes(img_bytes)
    sunny_img = Image.open(sunny_path).convert("RGBA")
else:
    print("  All image sources failed — using geometric fallback")

# ── Banner canvas ─────────────────────────────────────────────────────────────────────
img = Image.new("RGB", (W, H))
draw = ImageDraw.Draw(img)

for y in range(H):
    ratio = y / H
    draw.line(
        [(0, y), (W, y)],
        fill=(int(5+(18-5)*ratio), int(10+(6-10)*ratio), int(55+(28-55)*ratio))
    )

rng = random.Random(13)
for _ in range(300):
    x = rng.randint(0, W); y = rng.randint(0, int(H * 0.82))
    size = rng.choice([1,1,1,2,2,3]); br = rng.randint(140,255)
    draw.ellipse([x-size,y-size,x+size,y+size], fill=(br,br,int(br*0.88)))

# Moon with glow halo
mx, my, mr = 350, 120, 200
for halo in range(290, mr, -8):
    a = (halo - mr) / (290 - mr)
    hc = int(32 * a)
    draw.ellipse([mx-halo, my+mr-halo, mx+halo, my+mr+halo], fill=(hc, hc, int(hc*1.9)))
draw.ellipse([mx-mr, my, mx+mr, my+2*mr], fill=(255, 248, 195))
draw.ellipse([mx-mr+58, my-22, mx+mr+58, my+2*mr-22], fill=(8, 14, 46))

rng2 = random.Random(99)
for _ in range(24):
    fx = rng2.randint(60, W-60); fy = rng2.randint(int(H*0.5), H-160)
    draw.ellipse([fx-4, fy-4, fx+4, fy+4], fill=(190, 255, 130))

bush_y = H - 230
rng3 = random.Random(77); xp = 0
while xp < W:
    cw = rng3.randint(60,160); ch = rng3.randint(80,220)
    draw.ellipse([xp, bush_y-ch, xp+cw, bush_y+ch//2], fill=(3,8,22))
    xp += rng3.randint(40, 120)
draw.rectangle([0, bush_y+10, W, H], fill=(3,8,22))

# ── Composite Sonny ─────────────────────────────────────────────────────────────────────────
if sunny_img:
    target_h = 820
    target_w = int(sunny_img.width * (target_h / sunny_img.height))
    sunny_resized = sunny_img.resize((target_w, target_h), Image.LANCZOS)
    paste_x = 60
    paste_y = H - target_h - 180
    img.paste(sunny_resized, (paste_x, paste_y), sunny_resized)
    print(f"  Composited Sonny at ({paste_x},{paste_y}) {target_w}x{target_h}")
else:
    # Geometric fallback
    cx, cy = 680, 820
    FUR=(198,152,74); FUR_LT=(228,192,116); EAR_IN=(228,168,148); OUT=(80,50,15)
    def ell(x1,y1,x2,y2,f,o=None,w=4): draw.ellipse([x1,y1,x2,y2],fill=f,outline=o,width=w)
    ell(cx-175,cy-90, cx+175,cy+300, FUR,OUT)
    ell(cx-105,cy-30, cx+105,cy+270, FUR_LT)
    ell(cx+140,cy+130,cx+210,cy+210, FUR,OUT,3)
    ell(cx-230,cy+10, cx-110,cy+160, FUR,OUT,3); ell(cx-245,cy+130,cx-130,cy+195,FUR_LT)
    ell(cx+110,cy+10, cx+230,cy+160, FUR,OUT,3); ell(cx+130,cy+130,cx+245,cy+195,FUR_LT)
    ell(cx-155,cy+255,cx-35, cy+320, FUR,OUT,3); ell(cx+35,cy+255,cx+155,cy+320,FUR,OUT,3)
    ell(cx-165,cy-370,cx+165,cy-60,  FUR,OUT); ell(cx-115,cy-355,cx+80,cy-140,FUR_LT)
    ell(cx-165,cy-485,cx-65,cy-330,  FUR,OUT); ell(cx-152,cy-472,cx-78,cy-345,EAR_IN)
    ell(cx+65, cy-485,cx+165,cy-330, FUR,OUT); ell(cx+78, cy-472,cx+152,cy-345,EAR_IN)
    for ex_off in [-62,62]:
        ex,ey=cx+ex_off,cy-250; re=52
        ell(ex-re,ey-re,ex+re,ey+re,(255,255,255),(80,50,15),2)
        ell(ex-40,ey-40,ex+40,ey+40,(80,45,12)); ell(ex-26,ey-26,ex+26,ey+26,(15,8,2))
        ell(ex+8,ey-26,ex+24,ey-10,(255,255,255))
    ell(cx-20,cy-168,cx+20,cy-148,(55,28,10))
    draw.arc([cx-45,cy-155,cx+45,cy-115],20,160,fill=(55,28,10),width=6)

# ── Text ──────────────────────────────────────────────────────────────────────────────────
font_paths_bold = ["/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
                   "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"]
font_paths_reg  = ["/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
                   "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"]

def load_font(paths, size):
    for fp in paths:
        if Path(fp).exists():
            try: return ImageFont.truetype(fp, size)
            except: pass
    return ImageFont.load_default()

font_huge = load_font(font_paths_bold, 148)
font_tag  = load_font(font_paths_reg, 62)
font_sub  = load_font(font_paths_reg, 40)

def draw_at(text, font, colour, y, cx=1780, shadow=True):
    bbox = draw.textbbox((0,0), text, font=font)
    x = cx - (bbox[2]-bbox[0])//2
    if shadow: draw.text((x+5,y+5), text, font=font, fill=(0,0,15))
    draw.text((x,y), text, font=font, fill=colour)

draw_at("Sonny's Cozy",            font_huge, (255,215,70),   490)
draw_at("Quokka Bedtime Tales",    font_huge, (255,215,70),   648)
draw_at("Calm Australian bush adventures for little dreamers", font_tag, (185,162,255), 835, shadow=False)
draw_at("New episodes every day  *  Perfect for ages 1-5",    font_sub, (255,232,130), 930, shadow=False)

# ── Save ───────────────────────────────────────────────────────────────────────────────────
out = Path(__file__).parent / "channel-art.png"
img.save(str(out), "PNG")
print(f"Saved: {out}")
