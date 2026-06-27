#!/usr/bin/env python3
"""
build_reel.py — turn ONE property listing (photos + details) into a finished
9:16 vertical reel (1080x1920) with Ken Burns motion, branded title/outro
cards, feature captions, and an optional music bed + voiceover.

Pure ffmpeg + Pillow. No API keys required for the core. Voiceover and AI
b-roll are optional plug-ins (see README).

Usage:
    python ugc/build_reel.py ugc/listings/<slug>
    python ugc/build_reel.py ugc/listings/<slug> --out ugc/out/<slug>/reel.mp4

A listing dir contains:
    listing.json   { address, suburb, price, beds, baths, cars, features[],
                     agent:{name,phone,brand}, music?(path), voiceover?(path) }
    01.jpg 02.jpg ...   (the property photos, any order)
"""
from __future__ import annotations
import argparse, json, os, subprocess, sys, tempfile, shutil
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

W, H, FPS = 1080, 1920, 30
SECS_PER_PHOTO = 3.0
CARD_SECS = 2.8
FONT_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FONT_REG = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"


def ffmpeg_bin() -> str:
    exe = shutil.which("ffmpeg")
    if exe:
        return exe
    try:
        import imageio_ffmpeg
        return imageio_ffmpeg.get_ffmpeg_exe()
    except Exception:
        sys.exit("ffmpeg not found. Install it (apt) or `pip install imageio-ffmpeg`.")


FF = ffmpeg_bin()


def run(args: list[str]):
    p = subprocess.run([FF, "-y", "-loglevel", "error", *args],
                       stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    if p.returncode != 0:
        sys.stderr.write(p.stderr.decode(errors="replace"))
        raise RuntimeError("ffmpeg failed: " + " ".join(args[:6]) + " ...")


def font(path: str, size: int) -> ImageFont.FreeTypeFont:
    try:
        return ImageFont.truetype(path, size)
    except Exception:
        return ImageFont.load_default()


def _hex(c: str, default=(20, 22, 28)):
    try:
        c = c.lstrip("#")
        return tuple(int(c[i:i + 2], 16) for i in (0, 2, 4))
    except Exception:
        return default


def title_card(png: Path, listing: dict):
    brand = _hex(listing.get("agent", {}).get("brand", "#1a73e8"))
    img = Image.new("RGB", (W, H), (15, 16, 20))
    d = ImageDraw.Draw(img)
    d.rectangle([0, 0, W, 14], fill=brand)
    d.rectangle([0, H - 14, W, H], fill=brand)
    price = str(listing.get("price", "")).strip()
    addr = listing.get("address", "")
    suburb = listing.get("suburb", "")
    specs = "  ·  ".join(s for s in [
        f"{listing.get('beds','')} bed" if listing.get("beds") else "",
        f"{listing.get('baths','')} bath" if listing.get("baths") else "",
        f"{listing.get('cars','')} car" if listing.get("cars") else "",
    ] if s)
    d.text((80, 520), "FOR SALE", font=font(FONT_BOLD, 46), fill=brand)
    d.text((80, 600), price, font=font(FONT_BOLD, 132), fill=(255, 255, 255))
    d.text((80, 770), addr, font=font(FONT_BOLD, 64), fill=(235, 235, 235))
    d.text((80, 850), suburb, font=font(FONT_REG, 52), fill=(180, 180, 185))
    if specs:
        d.text((80, 980), specs, font=font(FONT_REG, 48), fill=(210, 210, 215))
    img.save(png)


def outro_card(png: Path, listing: dict):
    brand = _hex(listing.get("agent", {}).get("brand", "#1a73e8"))
    agent = listing.get("agent", {})
    img = Image.new("RGB", (W, H), tuple(int(x * 0.4) for x in brand))
    d = ImageDraw.Draw(img)
    d.text((80, 760), "Book an inspection", font=font(FONT_BOLD, 72), fill=(255, 255, 255))
    d.text((80, 880), agent.get("name", ""), font=font(FONT_BOLD, 60), fill=(255, 255, 255))
    d.text((80, 960), agent.get("phone", ""), font=font(FONT_REG, 56), fill=(230, 230, 235))
    img.save(png)


def caption_png(png: Path, text: str, brand):
    """Transparent lower-third caption overlay (static over the moving photo)."""
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    f = font(FONT_BOLD, 56)
    tw = d.textlength(text, font=f)
    pad, bh = 40, 120
    y = H - 320
    d.rounded_rectangle([60, y, 60 + tw + pad * 2, y + bh], radius=18, fill=(*brand, 235))
    d.text((60 + pad, y + 28), text, font=f, fill=(255, 255, 255))
    img.save(png)


def seg_from_image(src: Path, dur: float, dst: Path, ken_burns: bool, caption: Path | None):
    """Encode one normalized 1080x1920 / 30fps / h264 video-only segment."""
    frames = int(dur * FPS)
    if ken_burns:
        vf = (f"scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},"
              f"scale={int(W*1.35)}:{int(H*1.35)},"
              f"zoompan=z='min(zoom+0.0011,1.25)':d={frames}:"
              f"x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s={W}x{H}:fps={FPS},"
              f"setsar=1")
    else:
        vf = f"scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},setsar=1"
    inputs = ["-loop", "1", "-t", f"{dur}", "-i", str(src)]
    if caption:
        inputs += ["-loop", "1", "-t", f"{dur}", "-i", str(caption)]
        filt = f"[0:v]{vf}[bg];[bg][1:v]overlay=0:0,format=yuv420p[v]"
        maps = ["-filter_complex", filt, "-map", "[v]"]
    else:
        maps = ["-vf", f"{vf},format=yuv420p"]
    run([*inputs, *maps, "-r", str(FPS), "-c:v", "libx264", "-pix_fmt", "yuv420p",
         "-profile:v", "high", "-preset", "ultrafast", "-an", str(dst)])


def build(listing_dir: Path, out: Path) -> Path:
    listing = json.loads((listing_dir / "listing.json").read_text())
    brand = _hex(listing.get("agent", {}).get("brand", "#1a73e8"))
    photos = sorted([p for p in listing_dir.iterdir()
                     if p.suffix.lower() in (".jpg", ".jpeg", ".png")
                     and not p.name.startswith("_")])
    if not photos:
        sys.exit(f"No photos in {listing_dir}")
    features = listing.get("features", [])
    tmp = Path(tempfile.mkdtemp(prefix="reel_"))
    segments: list[Path] = []
    try:
        # title card
        tc = tmp / "title.png"; title_card(tc, listing)
        s = tmp / "00.mp4"; seg_from_image(tc, CARD_SECS, s, ken_burns=False, caption=None)
        segments.append(s)
        # photo segments (with rotating feature captions)
        for i, ph in enumerate(photos):
            cap = None
            if i < len(features):
                cap = tmp / f"cap{i}.png"; caption_png(cap, features[i], brand)
            s = tmp / f"{i+1:02d}.mp4"
            seg_from_image(ph, SECS_PER_PHOTO, s, ken_burns=True, caption=cap)
            segments.append(s)
        # outro card
        oc = tmp / "outro.png"; outro_card(oc, listing)
        s = tmp / "zz.mp4"; seg_from_image(oc, CARD_SECS, s, ken_burns=False, caption=None)
        segments.append(s)
        # concat (identical codecs -> stream copy)
        listfile = tmp / "list.txt"
        listfile.write_text("".join(f"file '{p}'\n" for p in segments))
        silent = tmp / "concat.mp4"
        run(["-f", "concat", "-safe", "0", "-i", str(listfile), "-c", "copy", str(silent)])
        # audio: music bed + optional voiceover
        out.parent.mkdir(parents=True, exist_ok=True)
        music = listing.get("music"); voice = listing.get("voiceover")
        music_p = (listing_dir / music) if music and not os.path.isabs(music) else music
        voice_p = (listing_dir / voice) if voice and not os.path.isabs(voice) else voice
        if music_p and Path(music_p).exists() and voice_p and Path(voice_p).exists():
            run(["-i", str(silent), "-i", str(voice_p), "-stream_loop", "-1", "-i", str(music_p),
                 "-filter_complex",
                 "[1:a]volume=1.0[v];[2:a]volume=0.22[m];[v][m]amix=inputs=2:duration=first[a]",
                 "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-shortest", str(out)])
        elif music_p and Path(music_p).exists():
            run(["-i", str(silent), "-stream_loop", "-1", "-i", str(music_p),
                 "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "aac",
                 "-af", "volume=0.5", "-shortest", str(out)])
        elif voice_p and Path(voice_p).exists():
            run(["-i", str(silent), "-i", str(voice_p), "-map", "0:v", "-map", "1:a",
                 "-c:v", "copy", "-c:a", "aac", "-shortest", str(out)])
        else:
            shutil.copy(silent, out)
        return out
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


def main():
    ap = argparse.ArgumentParser(description="Build one 9:16 property reel.")
    ap.add_argument("listing_dir")
    ap.add_argument("--out", default=None)
    a = ap.parse_args()
    ld = Path(a.listing_dir)
    out = Path(a.out) if a.out else Path("ugc/out") / ld.name / "reel.mp4"
    res = build(ld, out)
    print(f"✓ {res}  ({res.stat().st_size/1e6:.1f} MB)")


if __name__ == "__main__":
    main()
