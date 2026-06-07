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
import math
import requests
import subprocess
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent / ".env")

# Make OpenMontage tools importable (submodule lives at repo root)
_OM_PATH = Path(__file__).parent.parent / "OpenMontage"
if _OM_PATH.exists() and str(_OM_PATH) not in sys.path:
    sys.path.insert(0, str(_OM_PATH))

ANTHROPIC_API_KEY     = os.getenv("ANTHROPIC_API_KEY")
ELEVENLABS_API_KEY    = os.getenv("ELEVENLABS_API_KEY")
HIGGSFIELD_API_KEY    = os.getenv("HIGGSFIELD_API_KEY")
HIGGSFIELD_SECRET     = os.getenv("HIGGSFIELD_SECRET")
REPLICATE_API_TOKEN   = os.getenv("REPLICATE_API_TOKEN")
FAL_KEY               = os.getenv("FAL_KEY")
PEXELS_API_KEY        = os.getenv("PEXELS_API_KEY")
PIXABAY_API_KEY       = os.getenv("PIXABAY_API_KEY")
YOUTUBE_CLIENT_ID     = os.getenv("YOUTUBE_CLIENT_ID")
YOUTUBE_CLIENT_SECRET = os.getenv("YOUTUBE_CLIENT_SECRET")

PIPER_VOICE_DIR = Path(os.getenv("PIPER_VOICE_DIR", "/tmp/piper-voices"))
PIPER_VOICE     = "en_US-lessac-medium"

# ── Show config (update once you have a character) ──────────────────────────────
SHOW_NAME = "Sonny's Cozy Quokka Bedtime Tales"
CHARACTER_NAME = "Sonny"
CHARACTER_DESC = "a sweet small quokka with golden-brown fur, big warm brown eyes, tiny round ears, gentle curious expression"
VISUAL_STYLE = (
    "Professional watercolour children's picture book illustration (like Beatrix Potter, Jill Barklem, Alison Friend style). "
    "Hand-painted watercolour on textured cold-press paper with visible brushstrokes, soft pigment bleeds, gentle washes. "
    "Warm earthy palette: ochres, burnt siennas, soft greens, deep blues. "
    "Australian bush at night with soft moonlight. Deep indigo-navy sky scattered with hand-dotted stars. "
    "Gum trees framing scene with loose sketchy linework. Glowing fireflies with warm golden highlights. "
    "Sonny the quokka as main character - always consistent appearance: small marsupial, soft golden-brown fur detail, "
    "large warm brown eyes, gentle curious expression, tiny round ears, cosy and safe feeling. "
    "Avoid: flat digital art, sharp clean lines, smooth gradients, glossy 3D render, airbrushed, photorealistic, "
    "plastic look, bright neon colours. No text or captions. Safe for toddlers ages 1-5."
)
SHOW_DESC = "Calm, magical Australian bush bedtime adventures with Sonny the little Quokka — cozy bedtime stories for toddlers at bedtime or quiet time."

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


# ── 1. Script generation ────────────────────────────────────────────────────────────────

SCRIPT_PROMPT_TEMPLATE = """You are writing an episode of "{show_name}", a calm bedtime cartoon for toddlers ages 2-5.
The main character is {character_name}, {character_desc}.
The show is slow-paced, gentle, and cozy - no conflict, no shouting, no sudden drama.

VISUAL STYLE FOR ALL SCENES:
Professional watercolour children's picture book illustration (Beatrix Potter / Jill Barklem style). Hand-painted on textured
cold-press paper with visible brushstrokes, soft pigment bleeds, gentle colour washes. Warm earthy palette (ochres, siennas,
soft greens, deep blues). Australian bush at night with soft moonlight, indigo-navy starry sky, gum trees with sketchy linework,
glowing fireflies. Sonny the quokka: small marsupial, soft golden-brown fur detail, large warm brown eyes, gentle expression,
tiny round ears - always exactly the same appearance in every scene. Safe and cosy.

CHARACTER CONSISTENCY RULE: {character_name} must have identical appearance in every scene image — same fur colour, same eye size
and colour, same ear shape, same body proportions. Reference the first scene image throughout.

Write a complete episode about: {topic}

Return ONLY a valid JSON object with exactly these fields, no other text:
{{
  "title": "episode title (max 60 chars, warm and descriptive)",
  "description": "YouTube description (2-3 sentences, parent-friendly, include '{show_name}')",
  "tags": ["list", "of", "10", "youtube", "tags"],
  "narration": "Full narration text (800-1000 words). Gentle, slow pace. Written for a calm voice-over. Tell a COMPLETE story with introduction, development, climax, and satisfying resolution.",
  "scenes": [
    {{
      "id": 1,
      "duration": 10,
      "image_prompt": "Professional watercolour illustration. {character_name} — small quokka with golden-brown fur, big warm brown eyes, gentle expression, tiny ears — as main subject. Setting: [specific scene]. Soft brushstrokes, visible paper texture, pigment bleeds, warm palette, Australian bush night, indigo sky with stars, glowing fireflies. Safe and cosy. No text.",
      "narration_segment": "The words spoken during this scene."
    }}
  ]
}}

Create 12 scenes. Each scene is 10 seconds (120 seconds total).

IMAGE PROMPT RULES:
1. Start EVERY image prompt with professional watercolour style descriptor
2. Always describe {character_name}'s appearance: same fur colour, eyes, ears, size — reference consistency with earlier scenes
3. Include specific Australian bush location details: gum trees, native plants, moonlight effect
4. Add artistic technique details: brushstrokes, paper texture, pigment technique for authenticity
5. Avoid: digital, vector, CGI, glossy, photorealistic, airbrushed, bright neon

IMPORTANT: Tell a COMPLETE story with clear beginning, middle, and end. Include proper story resolution and calm, cozy conclusion."""


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


# ── 2. Narration audio ─────────────────────────────────────────────────────────────

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
        "model_id": "eleven_turbo_v2_5",
        "voice_settings": {"stability": 0.72, "similarity_boost": 0.80, "style": 0.25, "use_speaker_boost": True}
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


# ── 2b. Narration via Piper TTS (free offline fallback) ───────────────────────────────

def generate_narration_piper(narration_text: str, episode_dir: Path) -> Path:
    """Generate narration using local Piper TTS — no API key required."""
    audio_path = episode_dir / "narration.mp3"
    wav_path   = episode_dir / "narration.wav"

    model_file = PIPER_VOICE_DIR / f"{PIPER_VOICE}.onnx"
    if not model_file.exists():
        print(f"  ⚠ Piper model not found at {model_file} — skipping Piper TTS")
        audio_path.write_bytes(b"")
        return audio_path

    wav_result = subprocess.run(
        ["piper", "--model", str(model_file),
         "--length-scale", "1.15",        # slightly slower = calmer bedtime pace
         "--sentence-silence", "0.4",
         "--output_file", str(wav_path)],
        input=narration_text, capture_output=True, text=True, timeout=120,
    )
    if wav_result.returncode != 0 or not wav_path.exists():
        print(f"  ⚠ Piper TTS failed: {wav_result.stderr[:120]}")
        audio_path.write_bytes(b"")
        return audio_path

    # Convert WAV → MP3 so it matches ElevenLabs output format
    mp3_result = subprocess.run(
        ["ffmpeg", "-y", "-i", str(wav_path), "-q:a", "4", str(audio_path)],
        capture_output=True,
    )
    wav_path.unlink(missing_ok=True)
    if mp3_result.returncode == 0 and audio_path.stat().st_size > 1000:
        print(f"  ✓ Narration via Piper TTS ({audio_path.stat().st_size // 1024}KB)")
    else:
        audio_path.write_bytes(b"")
        print("  ⚠ Piper WAV→MP3 conversion failed")
    return audio_path


# ── 3. Scene images via Higgsfield Soul ───────────────────────────────────────────────

def get_higgsfield_token() -> str:
    r = requests.post(
        "https://api.higgsfield.ai/v1/auth/token",
        json={"api_key": HIGGSFIELD_API_KEY, "secret": HIGGSFIELD_SECRET},
        timeout=30
    )
    r.raise_for_status()
    return r.json()["access_token"]


def generate_scene_image(prompt: str, scene_id: int, episode_dir: Path, token: str) -> Path:
    """Generate a scene image via Higgsfield Soul (text-to-image) — professional watercolour style."""
    img_path = episode_dir / f"scene_{scene_id:02d}.jpg"
    # Combine full visual style + character description + scene details for consistent professional art
    full_prompt = (
        f"{VISUAL_STYLE}\n"
        f"Main character: {CHARACTER_NAME}, {CHARACTER_DESC}.\n"
        f"Scene: {prompt[:400]}"
    )
    r = requests.post(
        "https://api.higgsfield.ai/v1/soul/generate",
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
        json={"prompt": full_prompt, "width": 1920, "height": 1080, "num_images": 1},
        timeout=120,
    )
    r.raise_for_status()
    data = r.json()
    job_id = data.get("job_id") or data.get("id")
    if job_id:
        print(f"  ⏳ Scene {scene_id} — Higgsfield Soul (professional watercolour) {job_id}...")
        img_url = poll_higgsfield_job(job_id, token)
    else:
        img_url = data.get("images", [{}])[0].get("url", "")
    if not img_url:
        raise ValueError(f"No image URL in Higgsfield response: {data}")
    img_data = requests.get(img_url, timeout=60).content
    img_path.write_bytes(img_data)
    print(f"  ✓ Scene {scene_id} (Higgsfield Soul — professional watercolour, {len(img_data)//1024}KB)")
    return img_path


def animate_scene(img_path: Path, scene: dict, episode_dir: Path, token: str) -> Path:
    """Animate a scene image via Higgsfield DOP (image-to-video)."""
    scene_id = scene["id"]
    duration = scene.get("duration", 8)
    vid_path = episode_dir / f"scene_{scene_id:02d}.mp4"

    with open(img_path, "rb") as f:
        upload_r = requests.post(
            "https://api.higgsfield.ai/v1/upload",
            headers={"Authorization": f"Bearer {token}"},
            files={"file": (img_path.name, f, "image/jpeg")},
            timeout=60,
        )
    _scene_text = scene.get("narration", "")
    if upload_r.status_code != 200:
        print(f"  ⚠ Upload failed for scene {scene_id}: {upload_r.text[:100]} — using image_to_video fallback")
        return image_to_video(img_path, duration, episode_dir, scene_id,
                              scene_text=_scene_text, page_num=scene_id)

    image_id = upload_r.json().get("id") or upload_r.json().get("asset_id")
    motion_prompt = f"Slow gentle camera drift, soft ambient motion. {scene.get('image_prompt', '')[:150]}"

    anim_r = requests.post(
        "https://api.higgsfield.ai/v1/dop/generate",
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
        json={
            "image_id": image_id,
            "prompt": motion_prompt,
            "duration": min(duration, 8),
            "motion_strength": 0.3,
        },
        timeout=120,
    )
    if anim_r.status_code != 200:
        print(f"  ⚠ DOP failed for scene {scene_id}: {anim_r.text[:100]} — using image_to_video fallback")
        return image_to_video(img_path, duration, episode_dir, scene_id,
                              scene_text=_scene_text, page_num=scene_id)

    anim_data = anim_r.json()
    job_id = anim_data.get("job_id") or anim_data.get("id")
    if not job_id:
        print(f"  ⚠ No job_id in DOP response — using image_to_video fallback")
        return image_to_video(img_path, duration, episode_dir, scene_id,
                              scene_text=_scene_text, page_num=scene_id)

    print(f"  ⏳ Scene {scene_id} — waiting for DOP animation {job_id}...")
    try:
        vid_url = poll_higgsfield_job(job_id, token, max_wait=300)
        vid_data = requests.get(vid_url, timeout=120).content
        vid_path.write_bytes(vid_data)
        print(f"  ✓ Scene {scene_id} animated ({len(vid_data)//1024}KB)")
        return vid_path
    except Exception as e:
        print(f"  ⚠ DOP animation failed: {e} — using image_to_video fallback")
        return image_to_video(img_path, duration, episode_dir, scene_id,
                              scene_text=_scene_text, page_num=scene_id)


def poll_higgsfield_job(job_id: str, token: str, max_wait: int = 300) -> str:
    """Poll a Higgsfield job until complete. Returns the output URL."""
    deadline = time.time() + max_wait
    while time.time() < deadline:
        r = requests.get(
            f"https://api.higgsfield.ai/v1/jobs/{job_id}",
            headers={"Authorization": f"Bearer {token}"},
            timeout=30,
        )
        r.raise_for_status()
        data = r.json()
        status = data.get("status", "")
        if status == "completed":
            return data.get("output_url") or data.get("url") or data["outputs"][0]["url"]
        if status in ("failed", "error"):
            raise RuntimeError(f"Higgsfield job {job_id} failed: {data}")
        time.sleep(8)
    raise TimeoutError(f"Higgsfield job {job_id} timed out after {max_wait}s")


def generate_scene_image_pollinations(prompt: str, scene_id: int, episode_dir: Path) -> Path | None:
    """Generate a scene image via Pollinations FLUX — free, no API key needed.
    Generates professional watercolour children's book style."""
    img_path = episode_dir / f"scene_{scene_id:02d}.jpg"
    # Short prompt: URL-length safe, faster to process, professional watercolor focus
    short_prompt = (
        f"Professional watercolour children's book illustration, Beatrix Potter style. "
        f"Sonny the quokka — golden-brown fur, big warm brown eyes, gentle expression. "
        f"{prompt[:150]}. Australian bush, moonlit, starry night, gum trees, fireflies, "
        f"brushstrokes, textured paper, warm palette, no text, safe for children"
    )
    encoded = requests.utils.quote(short_prompt)
    headers = {"User-Agent": "SonnyBot/1.0", "Accept": "image/*"}

    for model, timeout in (("flux", 90), ("turbo", 45)):
        seed = scene_id * 7
        url = (
            f"https://image.pollinations.ai/prompt/{encoded}"
            f"?width=1280&height=720&model={model}&nologo=true&seed={seed}"
        )
        try:
            print(f"  ⏳ Scene {scene_id} Pollinations/{model} (timeout={timeout}s)...")
            r = requests.get(url, timeout=timeout, headers=headers)
            if r.status_code == 200 and len(r.content) > 10000:
                img_path.write_bytes(r.content)
                print(f"  ✓ Scene {scene_id} image (Pollinations {model}, {len(r.content)//1024}KB)")
                return img_path
            print(f"  ⚠ Pollinations/{model}: status={r.status_code} bytes={len(r.content)}")
        except requests.exceptions.Timeout:
            print(f"  ⚠ Pollinations/{model}: timed out after {timeout}s")
        except Exception as e:
            print(f"  ⚠ Pollinations/{model}: {type(e).__name__}: {e}")
    return None


def generate_scene_image_pil(prompt: str, scene_id: int, episode_dir: Path) -> Path:
    """
    Generate a charming children's book illustration using PIL only — no API needed.
    Creates a warm nighttime Australian bush scene with Sonny the quokka.
    """
    from PIL import Image, ImageDraw, ImageFilter, ImageFont
    import random

    rng = random.Random(scene_id * 42)
    W, H = 1280, 720
    img = Image.new("RGB", (W, H))
    draw = ImageDraw.Draw(img)

    # Sky palettes per scene — warm, child-friendly colours
    palettes = [
        ((255, 180, 80),  (180, 100, 160)),   # 1 sunset apricot → dusty purple
        ((100, 120, 180), (30,  40,  80)),     # 2 twilight blue
        ((140, 90,  170), (40,  20,  70)),     # 3 deep violet
        ((80,  110, 160), (20,  30,  70)),     # 4 midnight blue
        ((60,  80,  140), (15,  20,  55)),     # 5 deep night
        ((40,  60,  120), (10,  10,  40)),     # 6 velvet night
    ]
    top_col, bot_col = palettes[min(scene_id - 1, len(palettes) - 1)]

    # Gradient sky
    for y in range(H):
        t = y / H
        r = int(top_col[0] + (bot_col[0] - top_col[0]) * t)
        g = int(top_col[1] + (bot_col[1] - top_col[1]) * t)
        b = int(top_col[2] + (bot_col[2] - top_col[2]) * t)
        draw.line([(0, y), (W, y)], fill=(r, g, b))

    # Stars (more for later scenes)
    n_stars = scene_id * 12
    for _ in range(n_stars):
        sx = rng.randint(0, W)
        sy = rng.randint(0, H // 2)
        sr = rng.choice([1, 1, 1, 2])
        brightness = rng.randint(180, 255)
        draw.ellipse([sx - sr, sy - sr, sx + sr, sy + sr],
                     fill=(brightness, brightness, brightness - 20))

    # Moon — soft warm circle
    moon_x, moon_y = int(W * 0.78), int(H * 0.18)
    for glow_r in range(60, 0, -1):
        alpha = int(15 * (1 - glow_r / 60))
        draw.ellipse([moon_x - glow_r, moon_y - glow_r,
                      moon_x + glow_r, moon_y + glow_r],
                     fill=(255, 240, 180))
    draw.ellipse([moon_x - 38, moon_y - 38, moon_x + 38, moon_y + 38],
                 fill=(255, 248, 210))

    # Ground — warm dark earth
    ground_y = int(H * 0.72)
    for y in range(ground_y, H):
        t = (y - ground_y) / (H - ground_y)
        r = int(30 + 20 * t)
        g = int(25 + 15 * t)
        b = int(15 + 10 * t)
        draw.line([(0, y), (W, y)], fill=(r, g, b))

    # Gum trees silhouettes
    def draw_tree(cx, base_y, trunk_h, spread):
        # Trunk
        draw.rectangle([cx - 5, base_y - trunk_h, cx + 5, base_y],
                        fill=(25, 18, 10))
        # Canopy blobs
        for _ in range(5):
            bx = cx + rng.randint(-spread, spread)
            by = base_y - trunk_h + rng.randint(-20, 20)
            br = rng.randint(30, 60)
            draw.ellipse([bx - br, by - br, bx + br, by + br],
                          fill=(20 + rng.randint(0, 15),
                                35 + rng.randint(0, 20),
                                15 + rng.randint(0, 10)))

    tree_positions = [(80, ground_y + 10, 220, 55),
                      (200, ground_y + 5,  260, 65),
                      (W - 90,  ground_y + 10, 230, 50),
                      (W - 210, ground_y + 5,  250, 60),
                      (W // 2 - 180, ground_y, 200, 45),
                      (W // 2 + 160, ground_y, 210, 50)]
    for tx, ty, th, ts in tree_positions:
        draw_tree(tx, ty, th, ts)

    # Warm path / clearing glow
    for gw in range(120, 0, -2):
        alpha = max(0, 40 - int(40 * (1 - gw / 120)))
        draw.ellipse([W // 2 - gw, ground_y - 30 - gw // 4,
                      W // 2 + gw, ground_y + gw // 4],
                     fill=(120 + alpha, 80 + alpha // 2, 30))

    # Simple quokka silhouette in the clearing
    qx, qy = W // 2, ground_y - 10
    # Body
    draw.ellipse([qx - 28, qy - 35, qx + 28, qy + 5], fill=(60, 42, 22))
    # Head
    draw.ellipse([qx - 18, qy - 60, qx + 18, qy - 28], fill=(70, 50, 25))
    # Ears
    draw.ellipse([qx - 22, qy - 78, qx - 8, qy - 55], fill=(60, 42, 22))
    draw.ellipse([qx + 8,  qy - 78, qx + 22, qy - 55], fill=(60, 42, 22))
    # Warm eye glow
    draw.ellipse([qx - 7, qy - 52, qx - 2, qy - 47], fill=(255, 200, 100))
    draw.ellipse([qx + 2, qy - 52, qx + 7,  qy - 47], fill=(255, 200, 100))

    # Soft vignette
    vig = Image.new("RGB", (W, H), (0, 0, 0))
    vdraw = ImageDraw.Draw(vig)
    for v in range(200, 0, -2):
        t = 1 - v / 200
        a = int(80 * t * t)
        vdraw.rectangle([v, v, W - v, H - v], outline=(0, 0, 0))
    img = Image.blend(img, vig, alpha=0.25)

    img_path = episode_dir / f"scene_{scene_id:02d}.jpg"
    img.save(img_path, "JPEG", quality=88)
    print(f"  ✓ Scene {scene_id} image (PIL illustration, always works)")
    return img_path


def generate_scene_image_flux(prompt: str, scene_id: int, episode_dir: Path) -> Path | None:
    """Generate a scene image via FLUX (OpenMontage tool) — needs FAL_KEY."""
    if not FAL_KEY:
        return None
    img_path = episode_dir / f"scene_{scene_id:02d}.jpg"
    full_prompt = (
        f"Soft watercolour children's book illustration, warm gentle palette, "
        f"Australian bush at dusk or night. Deep navy sky, soft moonlight, "
        f"glowing fireflies. Character: {CHARACTER_NAME}, {CHARACTER_DESC}. "
        f"Scene: {prompt[:350]}. No text. Safe for toddlers."
    )
    try:
        from tools.graphics.flux_image import FluxImage
        tool = FluxImage()
        result = tool.execute({
            "prompt": full_prompt,
            "width": 1920, "height": 1080,
            "num_inference_steps": 28,
            "output_path": str(img_path),
        })
        if result.success and img_path.exists() and img_path.stat().st_size > 5000:
            print(f"  ✓ Scene {scene_id} image (FLUX, {img_path.stat().st_size // 1024}KB)")
            return img_path
        else:
            print(f"  ⚠ Scene {scene_id} FLUX failed: {result.error}")
    except Exception as e:
        print(f"  ⚠ Scene {scene_id} FLUX error: {e}")
    return None


def generate_scene_image_fal_direct(prompt: str, scene_id: int, episode_dir: Path) -> Path | None:
    """Generate a scene image via FAL.ai FLUX Schnell — needs FAL_KEY (~$0.003/image).
    Sign up free at fal.ai, then add FAL_KEY to GitHub Secrets for AI-quality art.
    Generates professional watercolour children's book illustrations."""
    if not FAL_KEY:
        return None
    img_path = episode_dir / f"scene_{scene_id:02d}.jpg"
    os.environ.setdefault("FAL_KEY", FAL_KEY)
    full_prompt = (
        f"Professional watercolour children's picture book illustration, Beatrix Potter style. "
        f"Hand-painted on textured cold-press paper, visible brushstrokes, soft pigment bleeds. "
        f"Sonny the quokka with golden-brown fur and big warm brown eyes as main character. "
        f"Australian bush at night, deep navy indigo sky with stars, soft moonlight, glowing fireflies, gum trees. "
        f"Warm earthy palette. Scene: {prompt[:280]}. No text. Safe for toddlers."
    )
    try:
        import fal_client
        print(f"  ⏳ Scene {scene_id} FAL.ai FLUX Schnell...")
        result = fal_client.run(
            "fal-ai/flux/schnell",
            arguments={
                "prompt": full_prompt,
                "image_size": {"width": 1280, "height": 720},
                "num_inference_steps": 8,
                "num_images": 1,
                "enable_safety_checker": True,
                "seed": scene_id * 13,
            },
        )
        img_url = result["images"][0]["url"]
        img_data = requests.get(img_url, timeout=60).content
        if len(img_data) > 5000:
            img_path.write_bytes(img_data)
            print(f"  ✓ Scene {scene_id} image (FAL.ai FLUX Schnell, {len(img_data)//1024}KB)")
            return img_path
        print(f"  ⚠ Scene {scene_id} FAL.ai returned only {len(img_data)} bytes")
    except Exception as e:
        print(f"  ⚠ Scene {scene_id} FAL.ai direct failed: {e}")
    return None


def generate_scene_image_replicate(prompt: str, scene_id: int, episode_dir: Path) -> Path | None:
    """Generate a scene image via Replicate FLUX Dev — uses your existing Replicate account.
    Add REPLICATE_API_TOKEN to GitHub Secrets (same token as the creative-stack MCP server).
    Generates professional watercolour children's book illustrations."""
    if not REPLICATE_API_TOKEN:
        return None
    img_path = episode_dir / f"scene_{scene_id:02d}.jpg"
    full_prompt = (
        f"Professional watercolour children's picture book illustration, Beatrix Potter and Jill Barklem style. "
        f"Hand-painted on textured cold-press paper with visible brushstrokes, soft pigment bleeds, gentle colour washes. "
        f"Loose painterly technique, imperfect handmade edges, warm earthy palette (ochres, burnt siennas, soft greens, deep blues). "
        f"Deep indigo-navy Australian night sky scattered with tiny hand-dotted stars and gentle moonlight. "
        f"Gum trees framing scene with loose, sketchy linework. Glowing fireflies with warm golden highlights. "
        f"Sonny the quokka as main character — small golden-brown marsupial with soft detailed fur, "
        f"large warm brown eyes, gentle curious expression, tiny round ears. Consistent appearance. "
        f"Scene: {prompt[:300]}. "
        f"Textured paper grain visible throughout, soft hand-painted edges, warm cosy feeling, safe for children. "
        f"Avoid: flat vector art, digital lines, smooth gradients, 3D render, airbrushed, photorealistic, sharp crisp edges."
    )
    headers = {
        "Authorization": f"Token {REPLICATE_API_TOKEN}",
        "Content-Type": "application/json",
        "Prefer": "wait=60",
    }
    payload = {
        "input": {
            "prompt": full_prompt,
            "aspect_ratio": "16:9",
            "output_format": "jpg",
            "output_quality": 92,
            "num_inference_steps": 28,
            "guidance": 3.5,
            "num_outputs": 1,
            "seed": scene_id * 17,
        }
    }
    for attempt in range(5):
        try:
            print(f"  ⏳ Scene {scene_id} Replicate FLUX Dev{' (retry)' if attempt else ''}...")
            r = requests.post(
                "https://api.replicate.com/v1/models/black-forest-labs/flux-dev/predictions",
                headers=headers, json=payload, timeout=180,
            )
            if r.status_code == 429:
                wait = 15 * (attempt + 1)
                print(f"  ⏳ Scene {scene_id} rate-limited (429), waiting {wait}s before retry {attempt+1}/4...")
                time.sleep(wait)
                continue
            if r.status_code not in (200, 201):
                print(f"  ⚠ Replicate start failed: {r.status_code} {r.text[:200]}")
                return None
            prediction = r.json()
            if prediction.get("status") == "succeeded":
                img_url = prediction["output"]
            else:
                poll_url = prediction["urls"]["get"]
                poll_headers = {"Authorization": f"Token {REPLICATE_API_TOKEN}"}
                deadline = time.time() + 300
                img_url = None
                while time.time() < deadline:
                    time.sleep(3)
                    pr = requests.get(poll_url, headers=poll_headers, timeout=30)
                    pred = pr.json()
                    if pred.get("status") == "succeeded":
                        img_url = pred["output"]
                        break
                    if pred.get("status") in ("failed", "canceled"):
                        print(f"  ⚠ Replicate prediction {pred.get('status')}: {pred.get('error')}")
                        return None
                if not img_url:
                    print(f"  ⚠ Replicate timed out")
                    return None
            if isinstance(img_url, list):
                img_url = img_url[0]
            img_data = requests.get(img_url, timeout=60).content
            if len(img_data) > 5000:
                img_path.write_bytes(img_data)
                print(f"  ✓ Scene {scene_id} image (Replicate FLUX Dev, {len(img_data)//1024}KB)")
                return img_path
            print(f"  ⚠ Replicate image too small ({len(img_data)} bytes)")
        except Exception as e:
            print(f"  ⚠ Scene {scene_id} Replicate failed: {e}")
    return None


def generate_scene_image_stock(prompt: str, scene_id: int, episode_dir: Path) -> Path | None:
    """Search Pexels/Pixabay for a matching stock photo — needs free API key."""
    img_path = episode_dir / f"scene_{scene_id:02d}.jpg"

    # Build a simple nature search query from the scene prompt
    keywords = "australian bush night moonlight nature calm"
    headers_pexels = {"Authorization": PEXELS_API_KEY} if PEXELS_API_KEY else {}
    if PEXELS_API_KEY:
        try:
            r = requests.get(
                "https://api.pexels.com/v1/search",
                params={"query": keywords, "per_page": 10, "page": scene_id % 5 + 1,
                        "orientation": "landscape"},
                headers=headers_pexels, timeout=20,
            )
            photos = r.json().get("photos", [])
            if photos:
                url = photos[0]["src"]["landscape"]
                data = requests.get(url, timeout=30).content
                img_path.write_bytes(data)
                print(f"  ✓ Scene {scene_id} image (Pexels stock)")
                return img_path
        except Exception as e:
            print(f"  ⚠ Pexels scene {scene_id} failed: {e}")

    if PIXABAY_API_KEY:
        try:
            r = requests.get(
                "https://pixabay.com/api/",
                params={"key": PIXABAY_API_KEY, "q": keywords,
                        "image_type": "photo", "orientation": "horizontal",
                        "per_page": 10, "page": scene_id % 5 + 1},
                timeout=20,
            )
            hits = r.json().get("hits", [])
            if hits:
                url = hits[0]["largeImageURL"]
                data = requests.get(url, timeout=30).content
                img_path.write_bytes(data)
                print(f"  ✓ Scene {scene_id} image (Pixabay stock)")
                return img_path
        except Exception as e:
            print(f"  ⚠ Pixabay scene {scene_id} failed: {e}")

    return None


def generate_music_pixabay(duration_secs: int, episode_dir: Path) -> Path:
    """Download a real royalty-free lullaby track via OpenMontage's Pixabay Music tool."""
    music_path = episode_dir / "music.mp3"
    print("[4/6] Searching Pixabay for lullaby music...")
    try:
        from tools.audio.pixabay_music import PixabayMusic
        tool = PixabayMusic()
        result = tool.execute({
            "query": "lullaby calm ambient sleep gentle",
            "min_duration": max(60, duration_secs - 30),
            "max_duration": duration_secs + 120,
            "output_path": str(music_path),
        })
        if result.success and music_path.exists() and music_path.stat().st_size > 10000:
            track = result.data.get("title", "unknown")
            print(f"  ✓ Music: '{track}' from Pixabay ({music_path.stat().st_size // 1024}KB)")
            return music_path
        else:
            print(f"  ⚠ Pixabay Music failed: {result.error} — falling back to generated music")
    except Exception as e:
        print(f"  ⚠ Pixabay Music error: {e} — falling back to generated music")
    return Path("")   # signals caller to use ffmpeg fallback


def image_to_video(img_path: Path, duration: float, episode_dir: Path, scene_id: int,
                   scene_text: str = "", page_num: int = 0) -> Path:
    """Create a children's picture-book frame and convert to video.

    Layout (1920x1080):
      • Top 65% (700px) — AI-generated watercolour illustration
      • Gold divider line (4px)
      • Bottom 35% (376px) — warm cream/parchment band with story text + page number
    """
    from PIL import Image, ImageDraw, ImageFont
    import textwrap as tw

    vid_path = episode_dir / f"scene_{scene_id:02d}.mp4"
    frame_path = episode_dir / f"scene_{scene_id:02d}_frame.jpg"

    W, H = 1920, 1080
    ILLUS_H = 820          # illustration area height — 76%, picture-book style
    DIVIDER_Y = ILLUS_H
    TEXT_Y = ILLUS_H + 6   # text band starts just below divider

    # Warm parchment palette (children's book cream)
    PARCHMENT   = (250, 245, 232)
    DARK_BROWN  = (58, 34, 12)
    GOLD_LINE   = (195, 158, 72)
    PAGE_COLOUR = (160, 125, 75)

    canvas = Image.new("RGB", (W, H), PARCHMENT)
    draw = ImageDraw.Draw(canvas)

    # ── Illustration (top area) ───────────────────────────────────────────────
    try:
        illus = Image.open(img_path).convert("RGB")
        iw, ih = illus.size
        # Scale to fill full width, then center-crop height to ILLUS_H
        scale = W / iw
        new_h = int(ih * scale)
        illus = illus.resize((W, new_h), Image.LANCZOS)
        if new_h >= ILLUS_H:
            # Crop — bias slightly toward top so subject stays in frame
            top_offset = min((new_h - ILLUS_H) // 3, 60)
            illus = illus.crop((0, top_offset, W, top_offset + ILLUS_H))
        else:
            # Image shorter than area — paste centred vertically, leave parchment above/below
            paste_y = (ILLUS_H - new_h) // 2
            canvas.paste(illus, (0, paste_y))
            illus = None
        if illus is not None:
            canvas.paste(illus, (0, 0))
    except Exception as e:
        # Illustration failed — paint a soft navy gradient as fallback
        for y in range(ILLUS_H):
            ratio = y / ILLUS_H
            r = int(8  + 18  * ratio)
            g = int(14 + 24  * ratio)
            b = int(46 + 40  * ratio)
            draw.line([(0, y), (W, y)], fill=(r, g, b))

    # ── Gold divider ──────────────────────────────────────────────────────────
    draw.rectangle([(0, DIVIDER_Y), (W, DIVIDER_Y + 5)], fill=GOLD_LINE)

    # ── Story text band ───────────────────────────────────────────────────────
    # Fonts — prefer Quicksand (soft rounded children's-book sans, downloaded in CI)
    _FONT_DIR = os.environ.get("KIDS_FONT_DIR", "/tmp/fonts")
    rounded_paths = [
        f"{_FONT_DIR}/Quicksand-Medium.ttf",
        f"{_FONT_DIR}/Quicksand-Regular.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
    ]
    sans_paths = [
        f"{_FONT_DIR}/Quicksand-Regular.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
    ]

    def _font(paths, size):
        for fp in paths:
            if Path(fp).exists():
                try:
                    return ImageFont.truetype(fp, size)
                except Exception:
                    continue
        return ImageFont.load_default()

    font_body = _font(rounded_paths, 44)
    font_page = _font(sans_paths,  30)

    TEXT_AREA_H = H - TEXT_Y        # ≈ 374px
    PAD_X       = 120
    MAX_W       = W - PAD_X * 2     # 1680px

    if scene_text:
        # Measure char width at this font size to choose wrap width
        test_bbox  = draw.textbbox((0, 0), "W" * 40, font=font_body)
        char_w     = (test_bbox[2] - test_bbox[0]) / 40
        wrap_chars = max(30, int(MAX_W / char_w))

        lines = []
        for para in scene_text.replace("\n\n", "\n").split("\n"):
            para = para.strip()
            if not para:
                continue
            lines.extend(tw.wrap(para, width=wrap_chars))
            if len(lines) >= 4:
                break
        lines = lines[:4]

        LINE_H = 58
        block_h = len(lines) * LINE_H
        # Centre the text block vertically in the text band (leave room for page num)
        y = TEXT_Y + (TEXT_AREA_H - block_h) // 2 - 18
        y = max(TEXT_Y + 18, y)

        for line in lines:
            bbox = draw.textbbox((0, 0), line, font=font_body)
            x = (W - (bbox[2] - bbox[0])) // 2
            draw.text((x, y), line, font=font_body, fill=DARK_BROWN)
            y += LINE_H

    # Page number — centered at very bottom of parchment band
    if page_num > 0:
        pg = str(page_num)
        bbox = draw.textbbox((0, 0), pg, font=font_page)
        pg_x = (W - (bbox[2] - bbox[0])) // 2
        draw.text((pg_x, H - 44), pg, font=font_page, fill=PAGE_COLOUR)

    canvas.save(frame_path, "JPEG", quality=95)

    # ── Convert composited frame to video (subtle slow zoom brings it to life) ─
    fps = 25
    total_frames = int(duration * fps)
    zoom_filter = (
        f"zoompan=z='min(zoom+0.0003,1.03)'"
        f":x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'"
        f":d={total_frames}:fps={fps}:s={W}x{H},"
        "format=yuv420p"
    )
    result = subprocess.run([
        "ffmpeg", "-y", "-loop", "1", "-i", str(frame_path),
        "-t", str(duration),
        "-vf", zoom_filter,
        "-c:v", "libx264", "-preset", "fast", "-crf", "24",
        str(vid_path)
    ], capture_output=True)

    if result.returncode != 0:
        # zoompan can be slow on some machines — fall back to plain hold
        result = subprocess.run([
            "ffmpeg", "-y", "-loop", "1", "-i", str(frame_path),
            "-t", str(duration),
            "-vf", f"scale={W}:{H}:force_original_aspect_ratio=decrease,"
                   f"pad={W}:{H}:(ow-iw)/2:(oh-ih)/2:color=#FAF5E8,"
                   "format=yuv420p",
            "-c:v", "libx264", "-preset", "fast", "-crf", "26",
            str(vid_path)
        ], capture_output=True)

    if result.returncode == 0:
        print(f"  ✓ Scene {scene_id} — picture-book frame ({duration:.1f}s)")
    else:
        print(f"  ⚠ image_to_video failed scene {scene_id}: {result.stderr.decode()[:200]}")
    return vid_path


# ── 5. Background music ────────────────────────────────────────────────────────────────

def generate_music(duration_secs: int, episode_dir: Path) -> Path:
    """Generate gentle lullaby music using ffmpeg sine tones — no API needed."""
    music_path = episode_dir / "music.mp3"
    print("[4/6] Generating background music via ffmpeg...")
    total = int(duration_secs) + 5

    # Simple approach: layer 3 quiet sine tones (C4, G4, C5) for a calm hum
    result = subprocess.run([
        "ffmpeg", "-y",
        "-f", "lavfi",
        "-i", f"sine=frequency=261.63:duration={total}",
        "-f", "lavfi",
        "-i", f"sine=frequency=392.00:duration={total}",
        "-f", "lavfi",
        "-i", f"sine=frequency=523.25:duration={total}",
        "-filter_complex",
        "[0:a]volume=0.10[a0];"
        "[1:a]volume=0.07[a1];"
        "[2:a]volume=0.05[a2];"
        "[a0][a1][a2]amix=inputs=3:duration=longest[aout];"
        f"[aout]lowpass=f=2000,afade=t=in:st=0:d=3,afade=t=out:st={total-4}:d=4[final]",
        "-map", "[final]",
        "-c:a", "libmp3lame", "-q:a", "4",
        str(music_path)
    ], capture_output=True)

    if result.returncode == 0 and music_path.exists() and music_path.stat().st_size > 1000:
        print(f"  ✓ Lullaby music generated ({total}s)")
    else:
        print(f"  ⚠ Music generation failed: {result.stderr.decode()[-200:]} — continuing without music")
        music_path.write_bytes(b"")
    return music_path


# ── 5b. Thumbnail generation ───────────────────────────────────────────────────────────

def generate_thumbnail(script: dict, episode_dir: Path) -> Path:
    """Create a 1280×720 YouTube thumbnail: navy night sky + golden title + show name."""
    from PIL import Image, ImageDraw, ImageFont

    W, H = 1280, 720
    img = Image.new("RGB", (W, H))
    draw = ImageDraw.Draw(img)

    # Navy gradient background
    for y in range(H):
        ratio = y / H
        r = int(5 + (15 - 5) * ratio)
        g = int(10 + (20 - 10) * ratio)
        b = int(50 + (30 - 50) * ratio)
        draw.line([(0, y), (W, y)], fill=(r, g, b))

    # Stars
    import random
    rng = random.Random(42)
    for _ in range(200):
        x = rng.randint(0, W)
        y = rng.randint(0, int(H * 0.75))
        size = rng.choice([1, 1, 1, 2])
        brightness = rng.randint(150, 255)
        draw.ellipse([x - size, y - size, x + size, y + size],
                     fill=(brightness, brightness, int(brightness * 0.9)))

    # Font loading
    font_paths_bold = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
    ]
    font_paths_reg = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
    ]

    def load_font(paths, size):
        for fp in paths:
            if Path(fp).exists():
                try:
                    return ImageFont.truetype(fp, size)
                except Exception:
                    continue
        return ImageFont.load_default()

    font_title = load_font(font_paths_bold, 72)
    font_show  = load_font(font_paths_reg, 36)

    title = script.get("title", SHOW_NAME)
    if len(title) > 40:
        # Split into two lines
        words = title.split()
        mid = len(words) // 2
        line1 = " ".join(words[:mid])
        line2 = " ".join(words[mid:])
    else:
        line1, line2 = title, ""

    GOLD = (255, 215, 70)
    WHITE = (240, 240, 255)

    def centred(text, font, colour, y):
        bbox = draw.textbbox((0, 0), text, font=font)
        x = (W - (bbox[2] - bbox[0])) // 2
        draw.text((x + 3, y + 3), text, font=font, fill=(0, 0, 15))
        draw.text((x, y), text, font=font, fill=colour)

    if line2:
        centred(line1, font_title, GOLD, 200)
        centred(line2, font_title, GOLD, 290)
    else:
        centred(line1, font_title, GOLD, 240)

    centred(SHOW_NAME, font_show, WHITE, 440)

    thumb_path = episode_dir / "thumbnail.jpg"
    img.save(str(thumb_path), "JPEG", quality=90)
    print(f"  ✓ Thumbnail: {thumb_path}")
    return thumb_path


# ── 5c. SEO description builder ─────────────────────────────────────────────────────────────

def build_seo_description(script: dict) -> str:
    """Return a YouTube-optimised description with keywords, channel footer and hashtags."""
    base = script.get("description", "").strip()
    footer = (
        "\n\n🌿 Sonny's Cozy Quokka Bedtime Tales — calm Australian bush adventures for toddlers.\n"
        "New episodes every day. Perfect for ages 1-5 at bedtime or quiet time.\n\n"
        "Subscribe so you never miss a story! 🌙✨\n\n"
        "#BedtimeStories #ToddlerCartoon #KidsYouTube #CalmCartoon #SonnyTheQuokka "
        "#BedtimeRoutine #AustralianAnimals #SleepStories #SonnyQuokka #QuokkaCartoon\n\n"
        "👶 Made for kids | 🇦🇺 Australian characters | 😴 Perfect for bedtime"
    )
    return base + footer


# ── 5d. Ebook (PDF picture book) ───────────────────────────────────────────────────────────

def generate_ebook(script: dict, episode_dir: Path) -> Path:
    """Generate a PDF picture book matching the video booklet style.

    Layout (portrait 800×1120 — standard children's book page):
      • Cover page  — first scene illustration + title + 'By Jamie Wigg'
      • Scene pages — illustration top 60% / gold divider / cream text band bottom 40%
      • Closing page — cream, 'Sweet dreams!' in warm gold, show name
    """
    from PIL import Image, ImageDraw, ImageFont
    import textwrap as tw

    PW, PH = 800, 1120
    ILLUS_H   = int(PH * 0.80)     # 896px — illustration fills 80% (picture-book style)
    DIVIDER_Y = ILLUS_H
    TEXT_Y    = ILLUS_H + 5

    # ── Palette (matches video booklet exactly) ───────────────────────────────
    PARCHMENT  = (250, 245, 232)
    DARK_BROWN = (58,  34,  12)
    GOLD_LINE  = (195, 158, 72)
    GOLD_TEXT  = (180, 138, 40)
    PAGE_COL   = (160, 125, 75)
    MID_BROWN  = (110,  72,  28)

    # ── Fonts ─────────────────────────────────────────────────────────────────
    _FONT_DIR = os.environ.get("KIDS_FONT_DIR", "/tmp/fonts")
    serif_bold = [
        f"{_FONT_DIR}/Quicksand-Bold.ttf",
        f"{_FONT_DIR}/Quicksand-Medium.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
    ]
    serif_reg = [
        f"{_FONT_DIR}/Quicksand-Medium.ttf",
        f"{_FONT_DIR}/Quicksand-Regular.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
    ]
    sans_reg = [
        f"{_FONT_DIR}/Quicksand-Regular.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
    ]

    def _font(paths, size):
        for fp in paths:
            if Path(fp).exists():
                try:
                    return ImageFont.truetype(fp, size)
                except Exception:
                    continue
        return ImageFont.load_default()

    font_title = _font(serif_bold, 52)
    font_by    = _font(serif_reg,  26)
    font_body  = _font(serif_reg,  28)
    font_close = _font(serif_bold, 64)
    font_page  = _font(sans_reg,   20)

    # ── Helpers ───────────────────────────────────────────────────────────────
    def parchment_page():
        img = Image.new("RGB", (PW, PH), PARCHMENT)
        return img, ImageDraw.Draw(img)

    def paste_illustration(page, img_path, area_h):
        """Paste scene image into top area, scaled to fill width."""
        try:
            src = Image.open(img_path).convert("RGB")
            iw, ih = src.size
            scale = PW / iw
            new_h = int(ih * scale)
            src = src.resize((PW, new_h), Image.LANCZOS)
            if new_h >= area_h:
                offset = min((new_h - area_h) // 3, 30)
                src = src.crop((0, offset, PW, offset + area_h))
            page.paste(src, (0, 0))
        except Exception:
            d = ImageDraw.Draw(page)
            for y in range(area_h):
                ratio = y / area_h
                r = int(8 + 20 * ratio); g = int(14 + 28 * ratio); b = int(46 + 35 * ratio)
                d.line([(0, y), (PW, y)], fill=(r, g, b))

    def draw_gold_divider(draw):
        draw.rectangle([(0, DIVIDER_Y), (PW, DIVIDER_Y + 4)], fill=GOLD_LINE)

    def draw_text_band(draw, text, page_num=0):
        """Centre-aligned story text + page number in parchment band."""
        PAD = 48
        MAX_W = PW - PAD * 2
        test_bbox = draw.textbbox((0, 0), "W" * 30, font=font_body)
        char_w = (test_bbox[2] - test_bbox[0]) / 30
        wrap_chars = max(16, int(MAX_W / char_w))

        lines = []
        for para in text.replace("\n\n", "\n").split("\n"):
            para = para.strip()
            if para:
                lines.extend(tw.wrap(para, width=wrap_chars))
            if len(lines) >= 4:
                break
        lines = lines[:4]

        LINE_H = 44
        TEXT_AREA_H = PH - TEXT_Y
        block_h = len(lines) * LINE_H
        y = TEXT_Y + (TEXT_AREA_H - block_h) // 2 - 10
        y = max(TEXT_Y + 12, y)

        for line in lines:
            bbox = draw.textbbox((0, 0), line, font=font_body)
            x = (PW - (bbox[2] - bbox[0])) // 2
            draw.text((x, y), line, font=font_body, fill=DARK_BROWN)
            y += LINE_H

        if page_num > 0:
            pg = str(page_num)
            bbox = draw.textbbox((0, 0), pg, font=font_page)
            draw.text(((PW - (bbox[2] - bbox[0])) // 2, PH - 36),
                      pg, font=font_page, fill=PAGE_COL)

    def centred_text(draw, text, font, colour, y):
        bbox = draw.textbbox((0, 0), text, font=font)
        draw.text(((PW - (bbox[2] - bbox[0])) // 2, y), text, font=font, fill=colour)

    pages = []

    # ── Cover page ────────────────────────────────────────────────────────────
    cover, draw = parchment_page()
    # Try to use first scene image as cover illustration (top half)
    cover_illus_h = int(PH * 0.58)
    cover_candidates = [
        episode_dir / "scene_01.jpg",
        episode_dir / "scene_01.png",
        episode_dir / "thumbnail.jpg",
    ]
    cover_img = next((p for p in cover_candidates if p.exists()), None)
    if cover_img:
        paste_illustration(cover, cover_img, cover_illus_h)
    else:
        # Navy starry gradient when no image yet
        for y in range(cover_illus_h):
            ratio = y / cover_illus_h
            r = int(8 + 20 * ratio); g = int(14 + 28 * ratio); b = int(46 + 35 * ratio)
            draw.line([(0, y), (PW, y)], fill=(r, g, b))

    # Gold rule below illustration
    draw.rectangle([(0, cover_illus_h), (PW, cover_illus_h + 4)], fill=GOLD_LINE)

    # Title block on parchment
    title_text = script.get("title", SHOW_NAME)
    title_y = cover_illus_h + 30
    # Wrap title
    test_bbox = draw.textbbox((0, 0), "W" * 18, font=font_title)
    char_w = (test_bbox[2] - test_bbox[0]) / 18
    title_lines = tw.wrap(title_text, width=max(10, int((PW - 80) / char_w)))[:3]
    for tl in title_lines:
        centred_text(draw, tl, font_title, DARK_BROWN, title_y)
        bbox = draw.textbbox((0, 0), tl, font=font_title)
        title_y += (bbox[3] - bbox[1]) + 8

    # Gold decorative rule
    rule_y = title_y + 14
    draw.rectangle([(PW//4, rule_y), (3*PW//4, rule_y + 2)], fill=GOLD_LINE)

    # Show name + author
    centred_text(draw, SHOW_NAME, font_by, MID_BROWN, rule_y + 18)
    centred_text(draw, "By Jamie Wigg", font_by, GOLD_TEXT, rule_y + 52)

    pages.append(cover)

    # ── Scene pages ───────────────────────────────────────────────────────────
    for i, scene in enumerate(script.get("scenes", [])):
        narr = scene.get("narration", scene.get("narration_segment", ""))
        candidates = [
            episode_dir / f"scene_{scene['id']:02d}.jpg",
            episode_dir / f"scene_{scene['id']:02d}.png",
        ]
        img_path = next((p for p in candidates if p.exists()), None)

        page, draw = parchment_page()
        if img_path:
            paste_illustration(page, img_path, ILLUS_H)
        else:
            for y in range(ILLUS_H):
                ratio = y / ILLUS_H
                r = int(8 + 20 * ratio); g = int(14 + 28 * ratio); b = int(46 + 35 * ratio)
                draw.line([(0, y), (PW, y)], fill=(r, g, b))

        draw_gold_divider(draw)
        draw_text_band(draw, narr, page_num=i + 1)
        pages.append(page)

    # ── Closing page ──────────────────────────────────────────────────────────
    closing, draw = parchment_page()

    # Soft gold decorative circle
    cx, cy = PW // 2, int(PH * 0.35)
    for radius in [130, 110, 90]:
        brightness = 255 - (130 - radius)
        draw.ellipse([cx-radius, cy-radius, cx+radius, cy+radius],
                     fill=(brightness, int(brightness*0.88), int(brightness*0.55)))

    # Moon crescent suggestion
    draw.ellipse([cx-60, cy-60, cx+60, cy+60], fill=(255, 245, 190))

    centred_text(draw, "Sweet dreams!", font_close, DARK_BROWN, int(PH * 0.52))
    centred_text(draw, "See you next time, little one ✨", font_by, MID_BROWN, int(PH * 0.64))

    # Gold rule
    rule_y2 = int(PH * 0.70)
    draw.rectangle([(PW//4, rule_y2), (3*PW//4, rule_y2 + 2)], fill=GOLD_LINE)

    centred_text(draw, SHOW_NAME, font_by, MID_BROWN, rule_y2 + 18)
    centred_text(draw, "By Jamie Wigg", font_page, GOLD_TEXT, rule_y2 + 52)
    pages.append(closing)

    # ── Save PDF ──────────────────────────────────────────────────────────────
    _raw = script.get("title", "Episode").split("|")[0]  # drop " | Bedtime Story" suffix
    safe_title = _raw.replace("/", "-").replace(":", "-").replace("\\", "-").strip()[:60]
    ebook_path = episode_dir / f"Sunny the Quokka - {safe_title}.pdf"
    pages[0].save(
        str(ebook_path),
        format="PDF",
        save_all=True,
        append_images=pages[1:],
        resolution=150,
    )
    print(f"  ✓ Ebook saved: {ebook_path} ({len(pages)} pages, cream parchment style)")
    return ebook_path


# ── 6. Assemble video ────────────────────────────────────────────────────────────────

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
    r = subprocess.run([
        "ffmpeg", "-y", "-f", "concat", "-safe", "0",
        "-i", str(concat_file), "-c", "copy", str(raw_video)
    ], capture_output=True)
    if r.returncode != 0:
        print(f"  ✗ ffmpeg concat failed:\n{r.stderr.decode()[-800:]}")
        raise RuntimeError("ffmpeg concat failed")

    # Mix narration + music + video — try increasingly simple approaches
    has_narration = narration.exists() and narration.stat().st_size > 100
    has_music = music.exists() and music.stat().st_size > 100

    def _try(cmd):
        return subprocess.run(cmd, capture_output=True)

    r = None
    if has_narration and has_music:
        r = _try([
            "ffmpeg", "-y",
            "-i", str(raw_video),
            "-i", str(narration),
            "-i", str(music),
            "-filter_complex",
            "[1:a]volume=1.0[narr];[2:a]volume=0.20[mus];[narr][mus]amix=inputs=2:duration=first[aout]",
            "-map", "0:v", "-map", "[aout]",
            "-c:v", "libx264", "-c:a", "aac", "-shortest",
            str(output_path)
        ])
        if r.returncode != 0:
            print(f"  ⚠ Full mix failed ({r.stderr.decode()[-200:]}) — trying narration only...")
            r = None

    if r is None and has_narration:
        r = _try([
            "ffmpeg", "-y",
            "-i", str(raw_video),
            "-i", str(narration),
            "-map", "0:v", "-map", "1:a",
            "-c:v", "libx264", "-c:a", "aac", "-shortest",
            str(output_path)
        ])
        if r.returncode != 0:
            print(f"  ⚠ Narration-only mix failed — trying music only...")
            r = None

    if r is None and has_music:
        r = _try([
            "ffmpeg", "-y",
            "-i", str(raw_video),
            "-i", str(music),
            "-map", "0:v", "-map", "1:a",
            "-c:v", "libx264", "-c:a", "aac", "-shortest",
            str(output_path)
        ])
        if r.returncode != 0:
            print(f"  ⚠ Music-only mix failed — falling back to silent video...")
            r = None

    if r is None:
        r = _try([
            "ffmpeg", "-y",
            "-i", str(raw_video),
            "-c:v", "libx264", "-an",
            str(output_path)
        ])

    if r.returncode != 0:
        print(f"  ✗ All ffmpeg attempts failed:\n{r.stderr.decode()[-400:]}")
        # Last resort: just copy raw video as final
        import shutil
        shutil.copy2(str(raw_video), str(output_path))
        print("  ↩ Copied raw video as final (no audio)")

    print(f"  ✓ Final video: {output_path}")
    return output_path


# ── 7. YouTube upload ────────────────────────────────────────────────────────────────

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
        raise RuntimeError("No token.json — add YOUTUBE_ACCESS_TOKEN + YOUTUBE_REFRESH_TOKEN to GitHub Secrets and re-run youtube_auth.py")

    token_data = json.loads(token_file.read_text())
    print(f"  Token keys present: {list(token_data.keys())}")
    if 'token' in token_data and 'access_token' not in token_data:
        token_data['access_token'] = token_data.pop('token')

    # Always force-refresh the access token via a direct HTTP call to the token endpoint.
    # This bypasses google-auth's reauth module (added in v2.22+) which fails in server
    # contexts because it requires interactive user prompts.
    import urllib.request as _urllib_req
    import urllib.parse as _urllib_parse
    from datetime import datetime as _dt, timedelta as _td

    print("  Refreshing access token...")
    _refresh_body = _urllib_parse.urlencode({
        "client_id": token_data["client_id"],
        "client_secret": token_data["client_secret"],
        "refresh_token": token_data["refresh_token"],
        "grant_type": "refresh_token",
    }).encode()
    _req = _urllib_req.Request(
        "https://oauth2.googleapis.com/token",
        data=_refresh_body,
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        method="POST",
    )
    try:
        with _urllib_req.urlopen(_req, timeout=30) as _resp:
            _resp_json = json.loads(_resp.read())
    except _urllib_req.HTTPError as _http_err:
        try:
            _err_body = json.loads(_http_err.read())
        except Exception:
            _err_body = {}
        _err_code = _err_body.get("error", "unknown")
        _err_desc = _err_body.get("error_description", str(_http_err))
        raise RuntimeError(
            f"YouTube token refresh failed — OAuth tokens are invalid.\n"
            f"  Google says: {_err_code}: {_err_desc}\n"
            f"  Redo OAuth Playground at rhythmixapp.com.au/kids-channel/token-fix.html\n"
            f"  then update all 4 YOUTUBE_* secrets in GitHub."
        )
    except Exception as _http_err:
        raise RuntimeError(f"HTTP error contacting token endpoint: {_http_err}")

    if "error" in _resp_json:
        raise RuntimeError(
            f"YouTube token refresh failed — OAuth tokens are invalid or expired.\n"
            f"  Error: {_resp_json.get('error')}: {_resp_json.get('error_description')}\n"
            f"  Redo OAuth Playground at rhythmixapp.com.au/kids-channel/token-fix.html\n"
            f"  then update all 4 YOUTUBE_* secrets in GitHub."
        )

    fresh_token = _resp_json["access_token"]
    expires_in = int(_resp_json.get("expires_in", 3600))
    expiry_dt = _dt.utcnow() + _td(seconds=expires_in - 60)
    print("  ✓ Access token refreshed OK")

    creds = Credentials(
        token=fresh_token,
        refresh_token=token_data.get("refresh_token"),
        token_uri=token_data.get("token_uri", "https://oauth2.googleapis.com/token"),
        client_id=token_data.get("client_id"),
        client_secret=token_data.get("client_secret"),
        scopes=token_data.get("scopes") or SCOPES,
        expiry=expiry_dt,
    )

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
            "privacyStatus": "public",
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


# ── Main ─────────────────────────────────────────────────────────────────────────────────

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

    # 2. Narration — ElevenLabs first, Piper TTS free fallback
    narration = generate_narration(script["narration"], episode_dir)
    if not narration.exists() or narration.stat().st_size < 100:
        print("  ↩ ElevenLabs unavailable — trying Piper TTS (free offline)...")
        narration = generate_narration_piper(script["narration"], episode_dir)

    # Probe actual narration length so scene durations can be matched to it —
    # otherwise the assembled video gets truncated mid-sentence by `-shortest`
    # whenever the fixed per-scene durations (default 8s) sum to less than
    # the real narration audio (which varies with word count and TTS pace).
    narration_secs = 0.0
    if narration.exists() and narration.stat().st_size > 100:
        try:
            pr = subprocess.run([
                "ffprobe", "-v", "error", "-show_entries", "format=duration",
                "-of", "default=noprint_wrappers=1:nokey=1", str(narration)
            ], capture_output=True, text=True, timeout=30)
            narration_secs = float(pr.stdout.strip())
            print(f"  ℹ Narration length: {narration_secs:.1f}s")
        except Exception:
            pass

    # Auto-generate scenes if the script doesn't have them (older format scripts)
    if not script.get("scenes"):
        print("  ℹ Script has no scenes key — auto-generating 6 scenes from narration...")
        narration_text = script.get("narration", "")
        title_lower = script.get("title", "a peaceful bedtime story").lower()
        sentences = [s.strip() for s in narration_text.replace("...", ".").split(".") if s.strip()]
        if not sentences:
            sentences = [narration_text]
        chunk_size = max(1, len(sentences) // 6)
        chunks = [". ".join(sentences[i:i+chunk_size]) for i in range(0, len(sentences), chunk_size)][:6]
        while len(chunks) < 6:
            chunks.append(chunks[-1] if chunks else title_lower)
        script["scenes"] = [
            {"id": i + 1, "duration": 8,
             "image_prompt": f"Watercolour illustration of Sonny the quokka in Australian bush, {title_lower}, soft warm bedtime colours, gentle peaceful night scene",
             "narration": chunk}
            for i, chunk in enumerate(chunks)
        ]

    # Rescale scene durations so the concatenated scene videos cover the full
    # narration — keeps each scene's relative weight, just stretches/shrinks
    # to fit the real audio length (plus a small tail so the last word lands
    # before the cut).
    if narration_secs > 1 and script.get("scenes"):
        scene_total = sum(s.get("duration", 8) for s in script["scenes"])
        target = narration_secs + 2
        if scene_total > 0 and abs(target / scene_total - 1.0) > 0.08:
            scale = target / scene_total
            for s in script["scenes"]:
                s["duration"] = round(max(3.0, s.get("duration", 8) * scale), 1)
            new_total = sum(s["duration"] for s in script["scenes"])
            print(f"  ℹ Rescaled scene durations {scene_total}s → {new_total:.1f}s to match narration")

    # 3. Scene images + videos
    # Priority: Higgsfield → FLUX (OpenMontage) → Stock photos → Pollinations → gradient
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
            print(f"  ⚠ Higgsfield failed ({e}) — falling through to next image source...")

    if not scene_videos:
        # Diagnostic — always print token status so we can see it in the logs
        _tok_len = len(REPLICATE_API_TOKEN) if REPLICATE_API_TOKEN else 0
        print(f"  🔑 REPLICATE_API_TOKEN: {'set (' + str(_tok_len) + ' chars)' if _tok_len else 'NOT SET — will use fallback'}")
        if REPLICATE_API_TOKEN:
            print("[3/6] Generating scene images via Replicate FLUX Schnell...")
        elif FAL_KEY:
            print("[3/6] Generating scene images via FAL.ai FLUX...")
        else:
            print("[3/6] Generating scene images via Pollinations FLUX (free)...")
            print("  ℹ  For AI-quality art: add REPLICATE_API_TOKEN to GitHub Secrets")

        for scene in script["scenes"]:
            img_path = None

            # 1st choice: Replicate FLUX Schnell — your existing Replicate account
            if REPLICATE_API_TOKEN:
                img_path = generate_scene_image_replicate(
                    scene["image_prompt"], scene["id"], episode_dir
                )

            # 2nd choice: FAL.ai FLUX Schnell (needs FAL_KEY)
            if not img_path and FAL_KEY:
                img_path = generate_scene_image_fal_direct(
                    scene["image_prompt"], scene["id"], episode_dir
                )

            # 3rd choice: Pollinations FLUX — free, no key, may timeout on shared runners
            if not img_path:
                img_path = generate_scene_image_pollinations(
                    scene["image_prompt"], scene["id"], episode_dir
                )

            # 4th choice: stock photos (Pexels/Pixabay — free API keys)
            if not img_path:
                img_path = generate_scene_image_stock(
                    scene["image_prompt"], scene["id"], episode_dir
                )

            # Last resort: PIL illustration (always works, no external calls)
            if not (img_path and img_path.exists() and img_path.stat().st_size > 5000):
                print(f"  ↩ Scene {scene['id']} — PIL fallback (add REPLICATE_API_TOKEN secret for AI art)")
                img_path = generate_scene_image_pil(
                    scene["image_prompt"], scene["id"], episode_dir
                )
            vid = image_to_video(
                img_path, scene.get("duration", 8), episode_dir, scene["id"],
                scene_text=scene.get("narration", ""),
                page_num=scene["id"],
            )
            scene_videos.append(vid)

    # 4. Music — Pixabay royalty-free (OpenMontage) first, ffmpeg tones fallback
    total_secs = sum(s.get("duration", 8) for s in script.get("scenes", [])) + 15
    music = generate_music_pixabay(total_secs, episode_dir)
    if not music.exists() or music.stat().st_size < 100:
        music = generate_music(total_secs, episode_dir)

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

    # 5e. Ebook (PDF picture book)
    print("[5e] Generating ebook (PDF picture book)...")
    try:
        generate_ebook(script, episode_dir)
    except Exception as e:
        print(f"  ⚠ Ebook generation failed: {e}")

    # 6. Upload
    upload_ok = False
    if final_video.exists() and final_video.stat().st_size > 100:
        try:
            result = upload_to_youtube(final_video, script, dry_run=args.dry_run)
            if result and not args.dry_run and thumb_path and thumb_path.exists():
                video_id, yt_client = result
                upload_thumbnail_to_youtube(yt_client, video_id, thumb_path)
            upload_ok = True
        except Exception as e:
            import traceback
            print(f"\n⚠️  YouTube upload failed — episode was produced but NOT uploaded.")
            print(f"   Error: {e}")
            if "invalid_client" in str(e):
                print(
                    "\n   ── FIX: OAuth client not found ──────────────────────────────────\n"
                    "   Your YOUTUBE_CLIENT_ID / YOUTUBE_CLIENT_SECRET secrets don't match\n"
                    "   the OAuth app that created the refresh token.  Steps to fix:\n"
                    "   1. Google Cloud Console → APIs & Services → Credentials\n"
                    "      Confirm the OAuth 2.0 client still exists; note its Client ID\n"
                    "      and Client Secret.\n"
                    "   2. Update GitHub Secrets YOUTUBE_CLIENT_ID + YOUTUBE_CLIENT_SECRET\n"
                    "      to match.\n"
                    "   3. Run  python kids-channel/youtube_auth.py  locally to get fresh\n"
                    "      access + refresh tokens.\n"
                    "   4. Paste the new tokens into GitHub Secrets:\n"
                    "        YOUTUBE_ACCESS_TOKEN   (access_token field)\n"
                    "        YOUTUBE_REFRESH_TOKEN  (refresh_token field)\n"
                    "   ─────────────────────────────────────────────────────────────────"
                )
            else:
                traceback.print_exc()
            print(f"\n   Episode files saved to: {episode_dir}")
            print(f"   Re-upload manually once OAuth is fixed.")
    else:
        print("[6/6] No final video to upload")

    if upload_ok or args.dry_run:
        print(f"\n✅ Done! Episode files in: {episode_dir}")
    else:
        print(f"\n⚠️  Episode produced but not uploaded. Fix OAuth then re-trigger workflow.")
        sys.exit(1)  # non-zero so the workflow's Advance queue step is skipped


if __name__ == "__main__":
    main()
