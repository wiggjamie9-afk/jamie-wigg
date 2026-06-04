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

# Make OpenMontage tools importable (submodule lives at repo root)
_OM_PATH = Path(__file__).parent.parent / "OpenMontage"
if _OM_PATH.exists() and str(_OM_PATH) not in sys.path:
    sys.path.insert(0, str(_OM_PATH))

ANTHROPIC_API_KEY    = os.getenv("ANTHROPIC_API_KEY")
ELEVENLABS_API_KEY   = os.getenv("ELEVENLABS_API_KEY")
HIGGSFIELD_API_KEY   = os.getenv("HIGGSFIELD_API_KEY")
HIGGSFIELD_SECRET    = os.getenv("HIGGSFIELD_SECRET")
FAL_KEY              = os.getenv("FAL_KEY")
PEXELS_API_KEY       = os.getenv("PEXELS_API_KEY")
PIXABAY_API_KEY      = os.getenv("PIXABAY_API_KEY")
YOUTUBE_CLIENT_ID    = os.getenv("YOUTUBE_CLIENT_ID")
YOUTUBE_CLIENT_SECRET = os.getenv("YOUTUBE_CLIENT_SECRET")

PIPER_VOICE_DIR = Path(os.getenv("PIPER_VOICE_DIR", "/tmp/piper-voices"))
PIPER_VOICE     = "en_US-lessac-medium"

# ── Show config (update once you have a character) ──────────────────────────────
SHOW_NAME = "Sonny's Cozy Quokka Bedtime Tales"
CHARACTER_NAME = "Sonny"
CHARACTER_DESC = "a sweet small quokka with golden-brown fur, big warm brown eyes, tiny round ears, gentle curious expression"
VISUAL_STYLE = (
    "Soft watercolour illustration, warm gentle palette, Australian bush at night. "
    "Deep navy sky, soft moonlight, glowing fireflies. "
    "Professional children's book art quality. No text. Safe for toddlers."
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
    """Generate a scene image via Higgsfield Soul (text-to-image)."""
    img_path = episode_dir / f"scene_{scene_id:02d}.jpg"
    full_prompt = (
        f"{VISUAL_STYLE} "
        f"Character: {CHARACTER_NAME}, {CHARACTER_DESC}. "
        f"Scene: {prompt[:350]}"
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
        print(f"  ⏳ Scene {scene_id} — waiting for Higgsfield job {job_id}...")
        img_url = poll_higgsfield_job(job_id, token)
    else:
        img_url = data.get("images", [{}])[0].get("url", "")
    if not img_url:
        raise ValueError(f"No image URL in Higgsfield response: {data}")
    img_data = requests.get(img_url, timeout=60).content
    img_path.write_bytes(img_data)
    print(f"  ✓ Scene {scene_id} image (Higgsfield Soul, {len(img_data)//1024}KB)")
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
    if upload_r.status_code != 200:
        print(f"  ⚠ Upload failed for scene {scene_id}: {upload_r.text[:100]} — using image_to_video fallback")
        return image_to_video(img_path, duration, episode_dir, scene_id)

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
        return image_to_video(img_path, duration, episode_dir, scene_id)

    anim_data = anim_r.json()
    job_id = anim_data.get("job_id") or anim_data.get("id")
    if not job_id:
        print(f"  ⚠ No job_id in DOP response — using image_to_video fallback")
        return image_to_video(img_path, duration, episode_dir, scene_id)

    print(f"  ⏳ Scene {scene_id} — waiting for DOP animation {job_id}...")
    try:
        vid_url = poll_higgsfield_job(job_id, token, max_wait=300)
        vid_data = requests.get(vid_url, timeout=120).content
        vid_path.write_bytes(vid_data)
        print(f"  ✓ Scene {scene_id} animated ({len(vid_data)//1024}KB)")
        return vid_path
    except Exception as e:
        print(f"  ⚠ DOP animation failed: {e} — using image_to_video fallback")
        return image_to_video(img_path, duration, episode_dir, scene_id)


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
    """Generate a scene image via Pollinations FLUX when Higgsfield is unavailable."""
    img_path = episode_dir / f"scene_{scene_id:02d}.jpg"
    full_prompt = (
        f"Soft watercolour illustration, warm gentle palette, Australian bush at night, "
        f"deep navy sky, soft moonlight. Character: Sonny, {CHARACTER_DESC}. "
        f"Scene: {prompt[:350]}"
    )
    encoded = requests.utils.quote(full_prompt)
    # Pollinations free tier requires a Referer header; try two models for resilience
    headers = {
        "Referer": "https://rhythmixapp.com.au",
        "User-Agent": "SonnyBot/1.0",
    }
    for model in ("flux", "flux-realism"):
        url = (
            f"https://image.pollinations.ai/prompt/{encoded}"
            f"?width=1920&height=1080&model={model}&nologo=true&seed={scene_id * 7}"
        )
        try:
            r = requests.get(url, timeout=90, headers=headers)
            if r.status_code == 200 and len(r.content) > 5000:
                img_path.write_bytes(r.content)
                print(f"  ✓ Scene {scene_id} image (Pollinations {model})")
                return img_path
            else:
                print(f"  ⚠ Scene {scene_id} Pollinations/{model} returned {r.status_code} / {len(r.content)} bytes")
        except Exception as e:
            print(f"  ⚠ Scene {scene_id} Pollinations/{model} failed: {e}")
    return None


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
    """Generate a PDF picture book for the episode.

    Layout (portrait 800×1120):
      • Title page — navy/stars, golden title, show name
      • One page per scene — top: scene illustration, bottom: narration text
      • Closing page — 'Sweet dreams!' sign-off
    """
    from PIL import Image, ImageDraw, ImageFont
    import textwrap, random

    PW, PH = 800, 1120  # portrait page size

    # ── Font loading ──────────────────────────────────────────────────────────────
    font_paths_bold = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
        "/usr/share/fonts/truetype/freefont/FreeSansBold.ttf",
    ]
    font_paths_reg = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
        "/usr/share/fonts/truetype/freefont/FreeSans.ttf",
    ]

    def load_font(paths, size):
        for fp in paths:
            if Path(fp).exists():
                try:
                    return ImageFont.truetype(fp, size)
                except Exception:
                    continue
        return ImageFont.load_default()

    font_title  = load_font(font_paths_bold, 58)
    font_show   = load_font(font_paths_bold, 28)
    font_body   = load_font(font_paths_reg, 26)
    font_close  = load_font(font_paths_bold, 70)
    font_page   = load_font(font_paths_bold, 22)

    NAVY    = (8, 14, 46)
    GOLD    = (255, 215, 70)
    SOFT_GOLD = (240, 195, 80)
    WHITE   = (240, 240, 255)
    LAVENDER = (180, 160, 240)
    TEXT_BG = (12, 18, 55)

    def navy_page(draw, w=PW, h=PH):
        for y in range(h):
            ratio = y / h
            r = int(NAVY[0] + (15 - NAVY[0]) * ratio)
            g = int(NAVY[1] + (25 - NAVY[1]) * ratio)
            b = int(NAVY[2] + (38 - NAVY[2]) * ratio)
            draw.line([(0, y), (w, y)], fill=(r, g, b))

    def add_stars(draw, w=PW, h=PH, count=80, seed=42):
        rng = random.Random(seed)
        for _ in range(count):
            x = rng.randint(0, w)
            y = rng.randint(0, int(h * 0.85))
            sz = rng.choice([1, 1, 2])
            br = rng.randint(130, 255)
            draw.ellipse([x - sz, y - sz, x + sz, y + sz],
                         fill=(br, br, int(br * 0.9)))

    def wrap_text_centered(draw, text, font, colour, x_center, y_start, max_w, line_h):
        words = text.split()
        lines = []
        current = []
        for word in words:
            test = " ".join(current + [word])
            bbox = draw.textbbox((0, 0), test, font=font)
            if bbox[2] - bbox[0] > max_w and current:
                lines.append(" ".join(current))
                current = [word]
            else:
                current.append(word)
        if current:
            lines.append(" ".join(current))
        y = y_start
        for line in lines:
            bbox = draw.textbbox((0, 0), line, font=font)
            x = x_center - (bbox[2] - bbox[0]) // 2
            draw.text((x, y), line, font=font, fill=colour)
            y += line_h
        return y

    pages = []

    # ── Title page ───────────────────────────────────────────────────────────────
    title_page = Image.new("RGB", (PW, PH))
    draw = ImageDraw.Draw(title_page)
    navy_page(draw)
    add_stars(draw)

    title_text = script.get("title", SHOW_NAME)
    wrap_text_centered(draw, title_text, font_title, GOLD, PW // 2, 220, PW - 80, 70)

    show_bbox = draw.textbbox((0, 0), SHOW_NAME, font=font_show)
    draw.text(((PW - (show_bbox[2] - show_bbox[0])) // 2, PH - 160),
              SHOW_NAME, font=font_show, fill=WHITE)

    pages.append(title_page)

    # ── Scene pages ───────────────────────────────────────────────────────────────
    img_area_h  = int(PH * 0.55)
    text_area_y = img_area_h + 6

    for i, scene in enumerate(script.get("scenes", [])):
        narr = scene.get("narration_segment", "")
        scene_img_path_candidates = [
            episode_dir / f"scene_{scene['id']:02d}.jpg",
            episode_dir / f"scene_{scene['id']:02d}.png",
        ]
        scene_img_path = next((p for p in scene_img_path_candidates if p.exists()), None)

        page = Image.new("RGB", (PW, PH))
        draw = ImageDraw.Draw(page)

        # Top: scene illustration (or navy fallback)
        if scene_img_path:
            try:
                scene_img = Image.open(scene_img_path).convert("RGB")
                scene_img = scene_img.resize((PW, img_area_h), Image.LANCZOS)
                page.paste(scene_img, (0, 0))
            except Exception:
                draw.rectangle([0, 0, PW, img_area_h], fill=(10, 20, 60))
        else:
            # Gradient fallback using scene palettes
            pal = SCENE_PALETTES[i % len(SCENE_PALETTES)]
            for y in range(img_area_h):
                ratio = y / img_area_h
                r = int(pal[0] + (pal[3] - pal[0]) * ratio)
                g = int(pal[1] + (pal[4] - pal[1]) * ratio)
                b = int(pal[2] + (pal[5] - pal[2]) * ratio)
                draw.line([(0, y), (PW, y)], fill=(r, g, b))

        # Thin gold divider
        draw.line([(0, img_area_h), (PW, img_area_h)], fill=GOLD, width=3)

        # Bottom: navy text area
        draw.rectangle([0, text_area_y, PW, PH], fill=TEXT_BG)

        # Narration text
        padding = 28
        wrap_text_centered(draw, narr, font_body, WHITE,
                           PW // 2, text_area_y + padding,
                           PW - padding * 2, 36)

        # Page number — bottom right
        page_num = f"{i + 1}"
        bbox = draw.textbbox((0, 0), page_num, font=font_page)
        draw.text((PW - (bbox[2] - bbox[0]) - 20, PH - 36),
                  page_num, font=font_page, fill=LAVENDER)

        pages.append(page)

    # ── Closing page ───────────────────────────────────────────────────────────────
    closing = Image.new("RGB", (PW, PH))
    draw = ImageDraw.Draw(closing)
    navy_page(draw)
    add_stars(draw, seed=99)

    close_text = "Sweet dreams!"
    bbox = draw.textbbox((0, 0), close_text, font=font_close)
    draw.text(((PW - (bbox[2] - bbox[0])) // 2, PH // 2 - 80),
              close_text, font=font_close, fill=SOFT_GOLD)

    sub_text = "See you next time, little one"
    bbox = draw.textbbox((0, 0), sub_text, font=font_show)
    draw.text(((PW - (bbox[2] - bbox[0])) // 2, PH // 2 + 20),
              sub_text, font=font_show, fill=WHITE)

    show_footer = "Sonny's Cozy Quokka Bedtime Tales"
    bbox = draw.textbbox((0, 0), show_footer, font=font_page)
    draw.text(((PW - (bbox[2] - bbox[0])) // 2, PH - 70),
              show_footer, font=font_page, fill=LAVENDER)

    pages.append(closing)

    # ── Save as multi-page PDF ───────────────────────────────────────────────────────────
    ebook_path = episode_dir / "ebook.pdf"
    pages[0].save(
        str(ebook_path),
        format="PDF",
        save_all=True,
        append_images=pages[1:],
        resolution=96,
    )
    print(f"  ✓ Ebook saved: {ebook_path} ({len(pages)} pages)")
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
            try:
                creds.refresh(google.auth.transport.requests.Request())
                token_file.write_text(creds.to_json())
                print("  Token refreshed OK")
            except Exception as _refresh_err:
                print(f"  Refresh failed ({_refresh_err}) — using existing token")
                creds._expiry = None  # treat as valid so the upload proceeds
        else:
            raise RuntimeError("Token invalid and cannot be refreshed — re-run youtube_auth.py")

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
            {"id": f"scene{i+1:02d}", "duration": 8,
             "image_prompt": f"Watercolour illustration of Sonny the quokka in Australian bush, {title_lower}, soft warm bedtime colours, gentle peaceful night scene",
             "narration": chunk}
            for i, chunk in enumerate(chunks)
        ]

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
        # Try FLUX (OpenMontage/fal.ai) → stock photos (Pexels/Pixabay) → Pollinations → gradient
        if FAL_KEY:
            print("[3/6] Generating scene images via FLUX (OpenMontage)...")
        elif PEXELS_API_KEY or PIXABAY_API_KEY:
            print("[3/6] Generating scene images from stock photos (Pexels/Pixabay)...")
        else:
            print("[3/6] Generating scene images via Pollinations FLUX...")

        for scene in script["scenes"]:
            img_path = None

            # 1st choice: FLUX via OpenMontage (needs FAL_KEY, ~$0.05/image)
            if FAL_KEY:
                img_path = generate_scene_image_flux(
                    scene["image_prompt"], scene["id"], episode_dir
                )

            # 2nd choice: stock photos (Pexels/Pixabay — free API keys)
            if not img_path:
                img_path = generate_scene_image_stock(
                    scene["image_prompt"], scene["id"], episode_dir
                )

            # 3rd choice: Pollinations FLUX (free, may be rate-limited in CI)
            if not img_path:
                img_path = generate_scene_image_pollinations(
                    scene["image_prompt"], scene["id"], episode_dir
                )

            # Last resort: animated gradient (always works, no external calls)
            if img_path and img_path.exists() and img_path.stat().st_size > 5000:
                vid = image_to_video(img_path, scene.get("duration", 8), episode_dir, scene["id"])
            else:
                print(f"  ↩ Scene {scene['id']} falling back to gradient")
                vid = generate_scene_bg(scene, episode_dir)
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


if __name__ == "__main__":
    main()
