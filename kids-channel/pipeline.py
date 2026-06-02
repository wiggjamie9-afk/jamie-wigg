#!/usr/bin/env python3
"""
Kids Channel Automation Pipeline
Generates a complete kids cartoon episode and uploads it to YouTube.

Usage:
  python pipeline.py --topic "A rabbit discovers a hidden waterfall"
  python pipeline.py --topic "The little owl learns to fly" --dry-run
"""

import os
import sys
import json
import time
import argparse
import requests
import subprocess
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent / ".env")

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")
HIGGSFIELD_API_KEY = os.getenv("HIGGSFIELD_API_KEY")
HIGGSFIELD_SECRET = os.getenv("HIGGSFIELD_SECRET")
YOUTUBE_CLIENT_ID = os.getenv("YOUTUBE_CLIENT_ID")
YOUTUBE_CLIENT_SECRET = os.getenv("YOUTUBE_CLIENT_SECRET")

# ── Show config (update once you have a character) ──────────────────────────
SHOW_NAME = "Sunny's Little Bedtime Stories"
CHARACTER_NAME = "Sunny"
CHARACTER_DESC = "a sweet small quokka with golden-brown fur, big warm brown eyes, tiny round ears, gentle curious expression"
VISUAL_STYLE = (
    "Soft watercolour illustration, warm gentle palette, Australian bush at night. "
    "Deep navy sky, soft moonlight, glowing fireflies. "
    "Professional children's book art quality. No text. Safe for toddlers."
)
SHOW_DESC = "Calm, magical Australian bush bedtime adventures with Sunny the 3-year-old Quokka — cozy 3D cartoon stories for toddlers at bedtime or quiet time."

# Per-scene colour palettes for the animated gradient fallback.
# Each tuple: (top_r, top_g, top_b, bot_r, bot_g, bot_b, shimmer_r, shimmer_g, shimmer_b)
SCENE_PALETTES = [
    (255, 160,  80,  140, 100, 170, 20, 10,  5),   # 1: sunset apricot → lavender
    ( 80, 110, 150,   30,  45,  75,  5,  8, 15),   # 2: twilight blue-grey
    (  5,  25,  12,   15,  70,  30, 10, 30, 10),   # 3: dark green glow
    (  8,  45,  45,   20,  80,  55, 10, 25, 15),   # 4: deep teal
    (  5,  10,  45,   12,  20,  65,  5,  5, 20),   # 5: night sky
    (  5,  18,  16,   12,  42,  30,  5, 20, 12),   # 6: moonlit dark
]
VOICE_ID = "21m00Tcm4TlvDq8ikWAM"  # ElevenLabs default calm voice; swap for custom
CHANNEL_CATEGORY = "27"            # YouTube category: Education
MADE_FOR_KIDS = True

OUTPUT_DIR = Path(__file__).parent / "episodes"
OUTPUT_DIR.mkdir(exist_ok=True)


def generate_scene_bg(scene: dict, episode_dir: Path) -> Path:
    """Render an animated gradient background for one scene using ffmpeg geq."""
    scene_id = scene["id"]
    duration = scene.get("duration", 8)
    vid_path = episode_dir / f"scene_{scene_id:02d}.mp4"
    idx = min(scene_id - 1, len(SCENE_PALETTES) - 1)
    tr, tg, tb, br, bg_val, bb, sr, sg, sb = SCENE_PALETTES[idx]
    period = 3.0
    geq = (
        f"r='clip({tr}*(1-Y/H)+{br}*(Y/H)+{sr}*sin(2*PI*T/{period}),0,255)':"
        f"g='clip({tg}*(1-Y/H)+{bg_val}*(Y/H)+{sg}*sin(2*PI*T/{period}),0,255)':"
        f"b='clip({tb}*(1-Y/H)+{bb}*(Y/H)+{sb}*sin(2*PI*T/{period}),0,255)'"
    )
    cmd = [
        "ffmpeg", "-y",
        "-f", "lavfi", "-i", f"nullsrc=size=1920x1080:rate=24",
        "-vf", f"geq={geq},format=yuv420p",
        "-t", str(duration),
        "-c:v", "libx264", "-preset", "fast", "-crf", "28",
        str(vid_path),
    ]
    result = subprocess.run(cmd, capture_output=True)
    if result.returncode == 0:
        print(f"  ✓ Scene {scene_id} background ({duration}s)")
    else:
        print(f"  ⚠ Scene {scene_id} ffmpeg error: {result.stderr.decode()[:150]}")
    return vid_path


# ── 1. Script generation ─────────────────────────────────────────────────────

SCRIPT_PROMPT_TEMPLATE = """You are writing an episode of "{show_name}", a calm bedtime cartoon for toddlers ages 2-5.
The main character is {character_name}, {character_desc}.
The show is slow-paced, gentle, and cozy - no conflict, no shouting, no sudden drama.

Write a short episode about: {topic}

Return ONLY a valid JSON object with exactly these fields, no other text:
{{
  "title": "episode title (max 60 chars, warm and descriptive)",
  "description": "YouTube description (2-3 sentences, parent-friendly, include '{show_name}')",
  "tags": ["list", "of", "10", "youtube", "tags"],
  "narration": "Full narration text (300-400 words). Gentle, slow pace. Written for a calm voice-over.",
  "scenes": [
    {{
      "id": 1,
      "duration": 8,
      "image_prompt": "Detailed visual description for image generation. Soft watercolour style, warm palette, {character_name} {character_desc}. Scene: ...",
      "narration_segment": "The words spoken during this scene."
    }}
  ]
}}

Create 6 scenes. Each scene is 8 seconds.
Make the image prompts specific, beautiful, and consistent - {character_name} always looks the same."""


def _build_prompt(topic: str) -> str:
    return SCRIPT_PROMPT_TEMPLATE.format(
        show_name=SHOW_NAME,
        character_name=CHARACTER_NAME,
        character_desc=CHARACTER_DESC,
        topic=topic,
    )


def _extract_json(text: str) -> dict:
    start = text.find("{")
    end = text.rfind("}") + 1
    if start == -1 or end == 0:
        raise ValueError("No JSON object found in response")
    return json.loads(text[start:end])


def generate_script_via_anthropic(topic: str) -> dict:
    import anthropic
    client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
    message = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=2000,
        messages=[{"role": "user", "content": _build_prompt(topic)}]
    )
    return _extract_json(message.content[0].text)


def generate_script(topic: str) -> dict:
    print(f"[1/6] Generating script for: {topic}")
    if not ANTHROPIC_API_KEY:
        print("  ✗ ANTHROPIC_API_KEY is not set.")
        print("    Add it as a GitHub Secret: Settings → Secrets → ANTHROPIC_API_KEY")
        sys.exit(1)
    try:
        return generate_script_via_anthropic(topic)
    except Exception as e:
        err = str(e)
        if "credit balance" in err or "402" in err or "529" in err:
            print(f"  ✗ Anthropic API — out of credits.")
            print("    Top up at: console.anthropic.com → Settings → Billing")
            print(f"    (Full error: {e})")
        else:
            print(f"  ✗ Anthropic API error: {e}")
        sys.exit(1)


# ── 2. Narration audio ────────────────────────────────────────────────────────

def generate_narration(narration_text: str, episode_dir: Path) -> Path:
    print("[2/6] Generating narration audio via ElevenLabs...")
    audio_path = episode_dir / "narration.mp3"

    if not ELEVENLABS_API_KEY:
        print("  ⚠ No ELEVENLABS_API_KEY — skipping audio. Add it to .env")
        audio_path.write_bytes(b"")
        return audio_path

    url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"
    headers = {"xi-api-key": ELEVENLABS_API_KEY, "Content-Type": "application/json"}
    payload = {
        "text": narration_text,
        "model_id": "eleven_turbo_v2",
        "voice_settings": {"stability": 0.75, "similarity_boost": 0.75, "style": 0.2}
    }
    try:
        r = requests.post(url, headers=headers, json=payload, timeout=60)
        r.raise_for_status()
        audio_path.write_bytes(r.content)
        print(f"  ✓ Narration saved: {audio_path}")
    except Exception as e:
        print(f"  ⚠ ElevenLabs failed ({e}) — continuing without audio")
        print("    Check ELEVENLABS_API_KEY in GitHub Secrets")
        audio_path.write_bytes(b"")
    return audio_path


# ── 3. Scene images via Higgsfield Soul ──────────────────────────────────────

def get_higgsfield_token() -> str:
    r = requests.post(
        "https://api.higgsfield.ai/v1/auth/token",
        json={"api_key": HIGGSFIELD_API_KEY, "secret": HIGGSFIELD_SECRET},
        timeout=30
    )
    r.raise_for_status()
    return r.json()["access_token"]


def generate_scene_image(prompt: str, scene_id: int, episode_dir: Path, token: str) -> Path:
    img_path = episode_dir / f"scene_{scene_id:02d}.jpg"
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

    full_prompt = (
        f"{VISUAL_STYLE} "
        f"Character: Sunny, {CHARACTER_DESC}. "
        f"Scene: {prompt}"
    )

    r = requests.post(
        "https://api.higgsfield.ai/v1/soul/generate",
        headers=headers,
        json={"prompt": full_prompt, "width": 1920, "height": 1080, "num_images": 1},
        timeout=120
    )
    r.raise_for_status()
    data = r.json()

    img_url = data.get("images", [{}])[0].get("url", "")
    if img_url:
        img_data = requests.get(img_url, timeout=30).content
        img_path.write_bytes(img_data)
        print(f"  ✓ Scene {scene_id} image saved")
    else:
        print(f"  ⚠ Scene {scene_id} image URL missing in response: {data}")

    return img_path


# ── 4. Scene videos via Higgsfield DOP ───────────────────────────────────────

def animate_scene(img_path: Path, scene: dict, episode_dir: Path, token: str) -> Path:
    vid_path = episode_dir / f"scene_{scene['id']:02d}.mp4"
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

    motion_prompt = f"Slow gentle camera drift. Soft breeze in leaves. Calm nature. {scene['image_prompt'][:200]}"

    with open(img_path, "rb") as f:
        img_b64 = __import__("base64").b64encode(f.read()).decode()

    r = requests.post(
        "https://api.higgsfield.ai/v1/dop/generate",
        headers=headers,
        json={
            "image": img_b64,
            "prompt": motion_prompt,
            "duration": scene.get("duration", 8),
            "fps": 24
        },
        timeout=300
    )
    r.raise_for_status()
    data = r.json()

    job_id = data.get("job_id") or data.get("id")
    if job_id:
        vid_url = poll_higgsfield_job(job_id, token)
        if vid_url:
            vid_data = requests.get(vid_url, timeout=60).content
            vid_path.write_bytes(vid_data)
            print(f"  ✓ Scene {scene['id']} video saved")
    else:
        vid_url = data.get("video_url", "")
        if vid_url:
            vid_data = requests.get(vid_url, timeout=60).content
            vid_path.write_bytes(vid_data)

    return vid_path


def poll_higgsfield_job(job_id: str, token: str, max_wait: int = 300) -> str:
    headers = {"Authorization": f"Bearer {token}"}
    start = time.time()
    while time.time() - start < max_wait:
        r = requests.get(
            f"https://api.higgsfield.ai/v1/jobs/{job_id}",
            headers=headers, timeout=30
        )
        data = r.json()
        status = data.get("status", "")
        if status == "completed":
            return data.get("output_url") or data.get("video_url", "")
        if status in ("failed", "error"):
            print(f"  ⚠ Job {job_id} failed: {data}")
            return ""
        print(f"  … job {job_id} status: {status} — waiting 10s")
        time.sleep(10)
    return ""


# ── 4b. Pollinations FLUX image fallback ─────────────────────────────────────

def generate_scene_image_pollinations(prompt: str, scene_id: int, episode_dir: Path) -> Path | None:
    """Generate a scene image via Pollinations FLUX when Higgsfield is unavailable."""
    img_path = episode_dir / f"scene_{scene_id:02d}.jpg"
    full_prompt = (
        f"Soft watercolour illustration, warm gentle palette, Australian bush at night, "
        f"deep navy sky, soft moonlight. Character: Sunny, {CHARACTER_DESC}. "
        f"Scene: {prompt[:350]}"
    )
    encoded = requests.utils.quote(full_prompt)
    url = (
        f"https://image.pollinations.ai/prompt/{encoded}"
        f"?width=1920&height=1080&model=flux&nologo=true&seed={scene_id * 7}"
    )
    try:
        r = requests.get(url, timeout=90)
        if r.status_code == 200 and len(r.content) > 5000:
            img_path.write_bytes(r.content)
            print(f"  ✓ Scene {scene_id} image (Pollinations FLUX)")
            return img_path
        else:
            print(f"  ⚠ Scene {scene_id} Pollinations returned {r.status_code} / {len(r.content)} bytes")
    except Exception as e:
        print(f"  ⚠ Scene {scene_id} Pollinations failed: {e}")
    return None


def image_to_video(img_path: Path, duration: float, episode_dir: Path, scene_id: int) -> Path:
    """Convert a static image to a video clip (simple hold, no motion)."""
    vid_path = episode_dir / f"scene_{scene_id:02d}.mp4"
    result = subprocess.run([
        "ffmpeg", "-y", "-loop", "1", "-i", str(img_path),
        "-t", str(duration),
        "-vf", "scale=1920x1080:force_original_aspect_ratio=increase,crop=1920:1080,format=yuv420p",
        "-c:v", "libx264", "-preset", "fast", "-crf", "28",
        str(vid_path)
    ], capture_output=True)
    if result.returncode == 0:
        print(f"  ✓ Scene {scene_id} video ({duration:.1f}s)")
    else:
        print(f"  ⚠ image_to_video failed scene {scene_id}: {result.stderr.decode()[:120]}")
    return vid_path


# ── 5. Background music ───────────────────────────────────────────────────────

def generate_music(duration_secs: int, episode_dir: Path) -> Path:
    music_path = episode_dir / "music.mp3"
    print("[4/6] Generating background music via ElevenLabs...")

    if not ELEVENLABS_API_KEY:
        print("  ⚠ No ELEVENLABS_API_KEY — skipping music")
        music_path.write_bytes(b"")
        return music_path

    prompt = "soft ambient lullaby, gentle nature sounds, calm piano, soothing bedtime music, no vocals"
    url = "https://api.elevenlabs.io/v1/sound-generation"
    headers = {"xi-api-key": ELEVENLABS_API_KEY, "Content-Type": "application/json"}
    payload = {"text": prompt, "duration_seconds": 22, "prompt_influence": 0.3}
    try:
        r = requests.post(url, headers=headers, json=payload, timeout=120)
        r.raise_for_status()
        chunk_path = episode_dir / "music_chunk.mp3"
        chunk_path.write_bytes(r.content)
        # Loop the 22s chunk to fill the full episode duration
        result = subprocess.run([
            "ffmpeg", "-y", "-stream_loop", "-1",
            "-i", str(chunk_path),
            "-t", str(int(duration_secs) + 5),
            "-c:a", "libmp3lame", "-q:a", "4",
            str(music_path)
        ], capture_output=True)
        if result.returncode == 0:
            print(f"  ✓ Music generated and looped to {duration_secs}s")
        else:
            chunk_path.rename(music_path)
            print(f"  ✓ Music generated (22s chunk)")
        return music_path
    except Exception as e:
        print(f"  ⚠ Music generation failed: {e}")
        music_path.write_bytes(b"")
        return music_path


# ── 5b. Thumbnail generation ─────────────────────────────────────────────────

def generate_thumbnail(script: dict, episode_dir: Path) -> Path:
    """Create a 1280×720 YouTube thumbnail: navy night sky + golden title + show name."""
    from PIL import Image, ImageDraw, ImageFont
    import random, textwrap

    W, H = 1280, 720
    img = Image.new("RGB", (W, H))
    draw = ImageDraw.Draw(img)

    # Gradient background — deep navy top to midnight purple-navy bottom
    for y in range(H):
        ratio = y / H
        r = int(6  + (15 - 6)  * ratio)
        g = int(12 + (8  - 12) * ratio)
        b = int(55 + (35 - 55) * ratio)
        draw.line([(0, y), (W, y)], fill=(r, g, b))

    # Stars
    rng = random.Random(42)
    for _ in range(120):
        x = rng.randint(0, W)
        y = rng.randint(0, int(H * 0.7))
        size = rng.choice([1, 1, 1, 2, 2, 3])
        brightness = rng.randint(160, 255)
        draw.ellipse([x - size, y - size, x + size, y + size],
                     fill=(brightness, brightness, int(brightness * 0.85)))

    # Crescent moon — top right
    moon_x, moon_y = 1050, 60
    moon_r = 90
    draw.ellipse([moon_x - moon_r, moon_y, moon_x + moon_r, moon_y + 2 * moon_r],
                 fill=(255, 245, 190))
    draw.ellipse([moon_x - moon_r + 30, moon_y - 10,
                  moon_x + moon_r + 30, moon_y + 2 * moon_r - 10],
                 fill=(r, g, b))  # cut out to form crescent using bg colour

    # Load fonts (DejaVu ships on Ubuntu)
    font_paths = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
        "/usr/share/fonts/truetype/freefont/FreeSansBold.ttf",
    ]
    font_big = font_small = None
    for fp in font_paths:
        if Path(fp).exists():
            try:
                font_big   = ImageFont.truetype(fp, 88)
                font_small = ImageFont.truetype(fp.replace("-Bold", "").replace("Bold", ""), 38)
                if not Path(font_small.path).exists():
                    font_small = ImageFont.truetype(fp, 38)
                break
            except Exception:
                continue
    if font_big is None:
        font_big = font_small = ImageFont.load_default()

    # Episode title — strip the " | Bedtime Story" suffix if present
    title = script.get("title", "Sunny's Bedtime Story")
    for suffix in [" | Bedtime Story", " | Bedtime", "| Bedtime Story"]:
        title = title.replace(suffix, "")
    title = title.strip()

    lines = textwrap.wrap(title, width=18)
    total_h = len(lines) * 100
    y_cur = (H - total_h) // 2 - 20
    for line in lines:
        bbox = draw.textbbox((0, 0), line, font=font_big)
        lw = bbox[2] - bbox[0]
        x = (W - lw) // 2
        # Shadow
        draw.text((x + 4, y_cur + 4), line, font=font_big, fill=(0, 0, 20))
        # Golden text
        draw.text((x, y_cur), line, font=font_big, fill=(255, 215, 80))
        y_cur += 100

    # Show name at bottom centre
    show = "Sunny's Little Bedtime Stories 🌙"
    bbox = draw.textbbox((0, 0), show, font=font_small)
    sw = bbox[2] - bbox[0]
    draw.text(((W - sw) // 2, H - 60), show, font=font_small, fill=(180, 160, 255))

    thumb_path = episode_dir / "thumbnail.jpg"
    img.save(str(thumb_path), "JPEG", quality=95)
    print(f"  ✓ Thumbnail saved: {thumb_path}")
    return thumb_path


# ── 5c. SEO description builder ───────────────────────────────────────────────

def build_seo_description(script: dict) -> str:
    """Return a YouTube-optimised description with keywords, channel footer and hashtags."""
    base = script.get("description", "").strip()
    footer = (
        "\n\n─────────────────────────\n"
        "🌙 Sunny's Little Bedtime Stories\n"
        "New episodes 3× every day — calm, gentle 2-minute stories for little ones.\n"
        "Perfect for ages 1–5. Great for bedtime routines, quiet time and naptime.\n"
        "Hit Subscribe so you never miss a new adventure with Sunny! 🐾\n"
        "─────────────────────────"
    )
    hashtags = (
        "\n\n#BedtimeStories #ToddlerBedtime #SunnysLittleBedtimeStories "
        "#KidsCartoon #QuokkaBedtime #AustralianAnimals #GentleStoriesForKids "
        "#CalmCartoon #ToddlerCartoon #BedtimeRoutine #KidsYouTube #SleepStories "
        "#BedtimeStoriesForKids #ToddlerSleep #NightTimeRoutine"
    )
    return base + footer + hashtags


# ── 6. Video assembly via ffmpeg ──────────────────────────────────────────────

def assemble_video(scene_videos: list, narration: Path, music: Path,
                   episode_dir: Path, title: str) -> Path:
    print("[5/6] Assembling final video with ffmpeg...")
    output_path = episode_dir / "final.mp4"

    concat_file = episode_dir / "concat.txt"
    valid_videos = [v for v in scene_videos if v.exists() and v.stat().st_size > 100]

    if not valid_videos:
        print("  ⚠ No valid scene videos found — cannot assemble")
        return output_path

    with open(concat_file, "w") as f:
        for v in valid_videos:
            f.write(f"file '{v.absolute()}'\n")

    # Concat scenes → temp video
    raw_video = episode_dir / "raw.mp4"
    subprocess.run([
        "ffmpeg", "-y", "-f", "concat", "-safe", "0",
        "-i", str(concat_file), "-c", "copy", str(raw_video)
    ], check=True, capture_output=True)

    # Mix narration + music + video
    inputs = ["-i", str(raw_video)]
    audio_filters = []

    has_narration = narration.exists() and narration.stat().st_size > 100
    has_music = music.exists() and music.stat().st_size > 100

    if has_narration and has_music:
        inputs += ["-i", str(narration), "-i", str(music)]
        # narration at full volume, music at 20%
        audio_filter = "[1:a]volume=1.0[narr];[2:a]volume=0.20[mus];[narr][mus]amix=inputs=2:duration=first[aout]"
        subprocess.run([
            "ffmpeg", "-y", *inputs,
            "-filter_complex", audio_filter,
            "-map", "0:v", "-map", "[aout]",
            "-c:v", "libx264", "-c:a", "aac", "-shortest",
            str(output_path)
        ], check=True, capture_output=True)
    elif has_narration:
        inputs += ["-i", str(narration)]
        subprocess.run([
            "ffmpeg", "-y", *inputs,
            "-map", "0:v", "-map", "1:a",
            "-c:v", "libx264", "-c:a", "aac", "-shortest",
            str(output_path)
        ], check=True, capture_output=True)
    else:
        subprocess.run([
            "ffmpeg", "-y", "-i", str(raw_video),
            "-c:v", "libx264", "-an", str(output_path)
        ], check=True, capture_output=True)

    print(f"  ✓ Final video: {output_path}")
    return output_path


# ── 7. YouTube upload ─────────────────────────────────────────────────────────

def upload_to_youtube(video_path: Path, script: dict, dry_run: bool = False):
    print("[6/6] Uploading to YouTube...")
    if dry_run:
        print("  [DRY RUN] Would upload:", script["title"])
        return None

    from google.oauth2.credentials import Credentials
    from googleapiclient.discovery import build
    from googleapiclient.http import MediaFileUpload
    import google.auth.transport.requests

    token_file = Path(__file__).parent / "token.json"
    SCOPES = ["https://www.googleapis.com/auth/youtube.upload"]

    if not token_file.exists() or not token_file.read_text().strip():
        sys.exit("  ✗ No token.json found. Add the token as GitHub Secret YOUTUBE_TOKEN")

    # Load credentials manually — from_authorized_user_file uses strptime("%Y-%m-%dT%H:%M:%SZ")
    # which can't parse "+00:00" timezone offsets. fromisoformat handles both.
    token_data = json.loads(token_file.read_text())
    print(f"  Token keys present: {list(token_data.keys())}")
    if 'token' in token_data and 'access_token' not in token_data:
        token_data['access_token'] = token_data.pop('token')

    from datetime import datetime as _dt
    expiry_dt = None
    expiry_str = token_data.get("expiry", "")
    if expiry_str:
        try:
            expiry_dt = _dt.fromisoformat(expiry_str.replace("Z", "+00:00"))
            # google-auth's utcnow() is naive; strip tzinfo to match
            if expiry_dt.tzinfo is not None:
                expiry_dt = expiry_dt.replace(tzinfo=None)
        except ValueError:
            expiry_dt = None

    creds = Credentials(
        token=token_data.get("access_token"),
        refresh_token=token_data.get("refresh_token"),
        token_uri=token_data.get("token_uri", "https://oauth2.googleapis.com/token"),
        client_id=token_data.get("client_id"),
        client_secret=token_data.get("client_secret"),
        scopes=token_data.get("scopes") or SCOPES,
        expiry=expiry_dt,
    )

    if not creds.valid:
        if creds.expired and creds.refresh_token:
            print("  Token expired — refreshing...")
            creds.refresh(google.auth.transport.requests.Request())
            token_file.write_text(creds.to_json())
            print("  Token refreshed OK")
        else:
            sys.exit("  ✗ Token invalid and cannot be refreshed. Re-run youtube_auth.py")

    youtube = build("youtube", "v3", credentials=creds)

    seo_desc = build_seo_description(script)

    body = {
        "snippet": {
            "title": script["title"],
            "description": seo_desc,
            "tags": script.get("tags", []),
            "categoryId": CHANNEL_CATEGORY,
        },
        "status": {
            "privacyStatus": "private",  # pipeline uploads private; promote manually or auto-publish
            "madeForKids": MADE_FOR_KIDS,
            "selfDeclaredMadeForKids": MADE_FOR_KIDS,
        }
    }

    media = MediaFileUpload(str(video_path), chunksize=-1, resumable=True,
                            mimetype="video/mp4")
    request = youtube.videos().insert(part=",".join(body.keys()), body=body,
                                      media_body=media)

    response = None
    while response is None:
        status, response = request.next_chunk()
        if status:
            print(f"  Upload {int(status.progress() * 100)}%...")
    video_id = response["id"]
    print(f"  ✓ Uploaded: https://youtube.com/watch?v={video_id}")
    return video_id, youtube


def upload_thumbnail_to_youtube(youtube, video_id: str, thumb_path: Path):
    """Set the custom thumbnail on an already-uploaded video."""
    from googleapiclient.http import MediaFileUpload
    try:
        media = MediaFileUpload(str(thumb_path), mimetype="image/jpeg")
        youtube.thumbnails().set(videoId=video_id, media_body=media).execute()
        print(f"  ✓ Thumbnail set on video {video_id}")
    except Exception as e:
        print(f"  ⚠ Thumbnail upload failed: {e}")


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Kids channel episode pipeline")
    parser.add_argument("--topic", required=False, help="Episode topic")
    parser.add_argument("--script-file", help="Path to pre-written script.json (skips generation)")
    parser.add_argument("--dry-run", action="store_true", help="Skip upload")
    parser.add_argument("--skip-video", action="store_true",
                        help="Skip Higgsfield (use placeholder images)")
    args = parser.parse_args()

    if not args.topic and not args.script_file:
        parser.error("Provide --topic or --script-file")

    # Derive slug from topic or script file name
    slug_source = args.topic or Path(args.script_file).stem
    slug = slug_source[:40].lower().replace(" ", "-").replace("/", "-")
    episode_dir = OUTPUT_DIR / slug
    episode_dir.mkdir(exist_ok=True)

    print(f"\n🎬 {SHOW_NAME} — Episode: {slug_source}")
    print(f"   Output: {episode_dir}\n")

    # 1. Script
    if args.script_file:
        print("[1/6] Loading pre-written script...")
        script = json.loads(Path(args.script_file.strip()).read_text())
        print(f"  ✓ Loaded: {script['title']}")
        # Save a copy into the episode dir
        (episode_dir / "script.json").write_text(json.dumps(script, indent=2))
    else:
        script = generate_script(args.topic)
        (episode_dir / "script.json").write_text(json.dumps(script, indent=2))
        print(f"  ✓ Title: {script['title']}")

    # 2. Narration
    narration = generate_narration(script["narration"], episode_dir)

    # 3. Scene images + videos
    scene_videos = []
    if not args.skip_video and HIGGSFIELD_API_KEY:
        print("[3/6] Generating scene images and animations via Higgsfield...")
        try:
            token = get_higgsfield_token()
            for scene in script["scenes"]:
                img = generate_scene_image(scene["image_prompt"], scene["id"],
                                           episode_dir, token)
                vid = animate_scene(img, scene, episode_dir, token)
                scene_videos.append(vid)
        except Exception as e:
            print(f"  ⚠ Higgsfield failed ({e}) — trying Pollinations FLUX fallback...")

    # Pollinations FLUX fallback (when Higgsfield is unavailable)
    if not scene_videos:
        print("[3/6] Generating scene images via Pollinations FLUX...")
        for scene in script["scenes"]:
            img_path = generate_scene_image_pollinations(
                scene["image_prompt"], scene["id"], episode_dir
            )
            if img_path and img_path.exists() and img_path.stat().st_size > 5000:
                vid = image_to_video(img_path, scene.get("duration", 8), episode_dir, scene["id"])
            else:
                print(f"  ↩ Scene {scene['id']} falling back to gradient")
                vid = generate_scene_bg(scene, episode_dir)
            scene_videos.append(vid)

    # 4. Music
    music = generate_music(60, episode_dir)

    # 5. Assemble
    if scene_videos:
        final_video = assemble_video(scene_videos, narration, music,
                                     episode_dir, script["title"])
    else:
        # Ultimate fallback: single-colour slate with narration
        print("[5/6] No scenes — creating colour slate fallback...")
        final_video = episode_dir / "final.mp4"
        has_narration = narration.exists() and narration.stat().st_size > 100
        cmd = ["ffmpeg", "-y", "-f", "lavfi", "-i", "color=c=0x0a1a2a:size=1920x1080:rate=24"]
        if has_narration:
            cmd += ["-i", str(narration), "-shortest", "-c:v", "libx264", "-c:a", "aac"]
        else:
            cmd += ["-t", "55", "-c:v", "libx264", "-an"]
        cmd.append(str(final_video))
        result = subprocess.run(cmd, capture_output=True)
        if result.returncode != 0:
            print(f"  ⚠ ffmpeg fallback failed: {result.stderr.decode()[:200]}")

    # 5d. Thumbnail
    print("[5d] Generating thumbnail...")
    try:
        thumb_path = generate_thumbnail(script, episode_dir)
    except Exception as e:
        print(f"  ⚠ Thumbnail generation failed: {e}")
        thumb_path = None

    # 6. Upload
    if final_video.exists() and final_video.stat().st_size > 100:
        result = upload_to_youtube(final_video, script, dry_run=args.dry_run)
        if result and not args.dry_run and thumb_path and thumb_path.exists():
            video_id, yt_client = result
            upload_thumbnail_to_youtube(yt_client, video_id, thumb_path)
    else:
        print("[6/6] No final video to upload")

    print(f"\n✅ Done! Episode files in: {episode_dir}")


if __name__ == "__main__":
    main()
