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
SHOW_NAME = "Little Sunny"
CHARACTER_NAME = "Sunny"
CHARACTER_DESC = "a small round fluffy quokka with a permanent gentle smile, soft golden-brown fur, big warm brown eyes, and tiny round ears"
SHOW_DESC = "Calm, gentle Australian bush adventures with Sunny the Quokka — peaceful nature stories for toddlers at bedtime or quiet time."
VOICE_ID = "21m00Tcm4TlvDq8ikWAM"  # ElevenLabs default calm voice; swap for custom
CHANNEL_CATEGORY = "27"            # YouTube category: Education
MADE_FOR_KIDS = True

OUTPUT_DIR = Path(__file__).parent / "episodes"
OUTPUT_DIR.mkdir(exist_ok=True)


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
    r = requests.post(url, headers=headers, json=payload, timeout=60)
    r.raise_for_status()
    audio_path.write_bytes(r.content)
    print(f"  ✓ Narration saved: {audio_path}")
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
        f"Soft watercolour children's book illustration. Calm, warm, cozy. "
        f"Gentle pastel palette. {prompt} "
        f"Style: Studio Ghibli meets Beatrix Potter. No text. Safe for kids."
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


# ── 5. Background music ───────────────────────────────────────────────────────

def generate_music(duration_secs: int, episode_dir: Path) -> Path:
    music_path = episode_dir / "music.mp3"
    print("[4/6] Generating background music...")

    # Pollinations free audio endpoint
    prompt = "soft ambient lullaby, gentle nature sounds, calm piano, children's bedtime music, no vocals"
    url = f"https://audio.pollinations.ai/{requests.utils.quote(prompt)}"
    try:
        r = requests.get(url, timeout=120)
        if r.status_code == 200:
            music_path.write_bytes(r.content)
            print(f"  ✓ Music saved: {music_path}")
            return music_path
    except Exception as e:
        print(f"  ⚠ Music generation failed: {e}")

    music_path.write_bytes(b"")
    return music_path


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
        return

    from google.oauth2.credentials import Credentials
    from googleapiclient.discovery import build
    from googleapiclient.http import MediaFileUpload
    import google.auth.transport.requests

    token_file = Path(__file__).parent / "token.json"
    SCOPES = ["https://www.googleapis.com/auth/youtube.upload"]

    if not token_file.exists() or not token_file.read_text().strip():
        print("  ✗ No token.json found.")
        print("    Run: python kids-channel/youtube_auth.py")
        print("    Then add the token as GitHub Secret YOUTUBE_TOKEN")
        return

    creds = Credentials.from_authorized_user_file(str(token_file), SCOPES)

    if not creds.valid:
        if creds.expired and creds.refresh_token:
            creds.refresh(google.auth.transport.requests.Request())
            token_file.write_text(creds.to_json())
        else:
            print("  ✗ Token invalid. Re-run youtube_auth.py")
            return

    youtube = build("youtube", "v3", credentials=creds)

    body = {
        "snippet": {
            "title": script["title"],
            "description": script["description"],
            "tags": script.get("tags", []),
            "categoryId": CHANNEL_CATEGORY,
        },
        "status": {
            "privacyStatus": "private",  # start private; review before publishing
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
    return video_id


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
        script = json.loads(Path(args.script_file).read_text())
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
        token = get_higgsfield_token()
        for scene in script["scenes"]:
            img = generate_scene_image(scene["image_prompt"], scene["id"],
                                       episode_dir, token)
            vid = animate_scene(img, scene, episode_dir, token)
            scene_videos.append(vid)
    else:
        print("[3/6] Skipping Higgsfield visuals (--skip-video or no API key)")

    # 4. Music
    music = generate_music(60, episode_dir)

    # 5. Assemble
    if scene_videos:
        final_video = assemble_video(scene_videos, narration, music,
                                     episode_dir, script["title"])
    else:
        print("[5/6] No videos to assemble — skipping ffmpeg step")
        final_video = episode_dir / "final.mp4"

    # 6. Upload
    if final_video.exists() and final_video.stat().st_size > 100:
        upload_to_youtube(final_video, script, dry_run=args.dry_run)
    else:
        print("[6/6] No final video to upload")

    print(f"\n✅ Done! Episode files in: {episode_dir}")


if __name__ == "__main__":
    main()
