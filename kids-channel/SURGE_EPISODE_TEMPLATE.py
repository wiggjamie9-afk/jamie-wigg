#!/usr/bin/env python3
"""
SURGE Episode Template & Render Pipeline
Demonstrates how to generate a complete SURGE episode using the series config.

This module orchestrates:
  1. Script generation from episode config
  2. Character design & voice assignment
  3. Scene-by-scene narration generation
  4. Scene image generation (via Higgsfield or fallback)
  5. Scene animation (image-to-video)
  6. Audio composition (narration + music + SFX)
  7. Final video assembly
  8. Thumbnail & metadata generation
  9. YouTube upload

Usage:
  # From kids-channel/
  python3 pipeline.py --series SURGE --episode 1
  python3 pipeline.py --series SURGE --episode 1 --dry-run
  python3 SURGE_EPISODE_TEMPLATE.py --episode 1 --render

Or import and use programmatically:
  from SURGE_EPISODE_TEMPLATE import SurgeEpisodeRenderer
  renderer = SurgeEpisodeRenderer(episode_number=1)
  video_path = renderer.render()
  renderer.upload_youtube()
"""

import os
import sys
import json
import time
import tempfile
import subprocess
from pathlib import Path
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass

# ── Load environment & config ──────────────────────────────────────────────────

try:
    from dotenv import load_dotenv
    load_dotenv(Path(__file__).parent.parent / ".env")
except ImportError:
    pass  # dotenv optional
from SURGE_SERIES_CONFIG import (
    SURGE_CONFIG, SURGE_EPISODES, CHARACTERS, VOICE_CONFIG, RENDER_CONFIG,
    YOUTUBE_CONFIG, get_episode_config, get_character, validate_episode_number
)

# ── API Keys ───────────────────────────────────────────────────────────────────

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")
HIGGSFIELD_API_KEY = os.getenv("HIGGSFIELD_API_KEY")
HIGGSFIELD_SECRET = os.getenv("HIGGSFIELD_SECRET")
FAL_KEY = os.getenv("FAL_KEY")
PEXELS_API_KEY = os.getenv("PEXELS_API_KEY")
PIXABAY_API_KEY = os.getenv("PIXABAY_API_KEY")
YOUTUBE_CLIENT_ID = os.getenv("YOUTUBE_CLIENT_ID")
YOUTUBE_CLIENT_SECRET = os.getenv("YOUTUBE_CLIENT_SECRET")

# ── Paths ──────────────────────────────────────────────────────────────────────

EPISODE_BASE_DIR = Path(__file__).parent / "episodes"
EPISODE_BASE_DIR.mkdir(exist_ok=True)


# ─────────────────────────────────────────────────────────────────────────────
# SURGE EPISODE RENDERER CLASS
# ─────────────────────────────────────────────────────────────────────────────

@dataclass
class SurgeEpisodeRenderer:
    """
    Main orchestrator for rendering a SURGE episode.

    Handles:
      - Script generation (via Claude + SURGE config)
      - Character voice assignment
      - Scene image generation (Higgsfield → FLUX → Pollinations → gradient)
      - Scene animation (image-to-video)
      - Audio mixing (narration + music + SFX)
      - Video assembly
      - Metadata & upload
    """

    episode_number: int
    dry_run: bool = False
    skip_video: bool = False
    script_file: Optional[Path] = None

    def __post_init__(self):
        if not validate_episode_number(self.episode_number):
            raise ValueError(f"Episode must be 1-10, got {self.episode_number}")

        self.config = get_episode_config(self.episode_number)
        self.episode_dir = EPISODE_BASE_DIR / f"surge_e{self.episode_number:02d}"
        self.episode_dir.mkdir(parents=True, exist_ok=True)
        self.scenes_dir = self.episode_dir / "scenes"
        self.scenes_dir.mkdir(exist_ok=True)

        print(f"\n🎬 SURGE Pilot — Episode {self.episode_number}: {self.config['title']}")
        print(f"   Output: {self.episode_dir}\n")

    # ──────────────────────────────────────────────────────────────────────────────
    # 1. SCRIPT GENERATION
    # ──────────────────────────────────────────────────────────────────────────────

    def generate_script_via_claude(self) -> Dict:
        """
        Generate episode script using Claude Haiku + SURGE series config.

        Returns:
            dict with keys: title, description, narration, scenes (list)
        """
        import anthropic

        client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)

        # Build prompt from episode config
        ep_config = self.config
        characters_str = ", ".join([get_character(c)["name"] for c in ep_config["characters"]])

        prompt = f"""You are writing a script for SURGE Pilot, Episode {self.episode_number}: "{ep_config['title']}"

SERIES CONTEXT:
{SURGE_CONFIG['description']}

EPISODE OVERVIEW:
{ep_config['description']}

CHARACTERS IN THIS EPISODE: {characters_str}

PLOT ARC: {ep_config['plot_arc']}
LEARNING THEME: {ep_config['learning_theme']}
VISUAL NOTES: {ep_config['visual_notes']}

TARGET DURATION: {SURGE_CONFIG['episode_duration_secs']} seconds (10 minutes)
SCENE COUNT: ~{ep_config['scene_count']} scenes, each 6-12 seconds

REQUIREMENTS:
1. Write a complete episode script in valid JSON format
2. Target {SURGE_CONFIG['episode_duration_secs']} seconds total runtime
3. Create {ep_config['scene_count']} scenes (6-12 seconds each)
4. Each scene has: id, duration (secs), image_prompt (detailed visual description), dialogue (character lines)
5. Include narration (optional intro/outro narrator voice)
6. Dialogue should be age-appropriate for 6-12 year olds, educational, uplifting
7. Scene descriptions must be detailed, cinematic, and consistent with SURGE's neon sci-fi visual style
8. Match the plot arc: {ep_config['plot_arc']}
9. Incorporate the learning theme: {ep_config['learning_theme']}

SURGE VISUAL STYLE:
- Neon sci-fi digital illustration
- Bold geometric design, glowing light effects, cyberpunk colour palette
- Primary colours: cyan (#00FFFF), magenta (#FF00FF), green (#00FF00), yellow (#FFB800)
- Background darks: navy (#0A0A1A), dark blue (#1A0A2E)
- No dark/scary content — bright, colorful, safe for kids
- Clean cel-shaded or smooth digital art style

Return ONLY a valid JSON object (no preamble/explanation):
{{
  "title": "{ep_config['title']}",
  "episode_number": {self.episode_number},
  "description": "YouTube description (2-3 sentences, parent-friendly)",
  "tags": ["list", "of", "12", "youtube", "tags"],
  "narration_intro": "Optional 10-15 second intro narration",
  "scenes": [
    {{
      "id": 1,
      "duration": 10,
      "image_prompt": "Detailed visual description for image generation...",
      "dialogue": [
        {{"character": "ziggy", "line": "Dialogue line"}},
        {{"character": "echo", "line": "Response"}}
      ]
    }},
    // ... more scenes
  ],
  "narration_outro": "Optional closing narration"
}}

Generate the script now:"""

        message = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=4000,
            messages=[{"role": "user", "content": prompt}]
        )

        # Extract JSON from response
        response_text = message.content[0].text
        start = response_text.find("{")
        end = response_text.rfind("}") + 1
        if start == -1 or end == 0:
            raise ValueError("No JSON object found in Claude response")

        script = json.loads(response_text[start:end])
        return script

    def load_or_generate_script(self) -> Dict:
        """Load script from file or generate via Claude."""
        print("[1/9] Script generation...")

        if self.script_file:
            print(f"  Loading pre-written script: {self.script_file}")
            script = json.loads(Path(self.script_file).read_text())
        else:
            if not ANTHROPIC_API_KEY:
                raise RuntimeError("ANTHROPIC_API_KEY not set — cannot generate script")
            print("  Generating script via Claude...")
            script = self.generate_script_via_claude()

        # Ensure required keys exist
        if "scenes" not in script:
            script["scenes"] = []
        if "narration_intro" not in script:
            script["narration_intro"] = ""
        if "narration_outro" not in script:
            script["narration_outro"] = ""

        # Save script to episode dir
        script_path = self.episode_dir / "script.json"
        script_path.write_text(json.dumps(script, indent=2))
        print(f"  ✓ Script saved: {script_path}")
        return script

    # ──────────────────────────────────────────────────────────────────────────────
    # 2. CHARACTER DESIGN & VOICE ASSIGNMENT
    # ──────────────────────────────────────────────────────────────────────────────

    def assign_character_voices(self) -> Dict[str, str]:
        """
        Map character names to ElevenLabs voice IDs.

        Returns:
            dict: {character_name: voice_id}
        """
        voices = {}
        for char_name in self.config["characters"]:
            voice_config = VOICE_CONFIG["character_voices"].get(char_name)
            if voice_config:
                voices[char_name] = voice_config["voice_id"]

        # Save character assignments
        assignments = {
            char_name: {
                "name": get_character(char_name)["name"],
                "voice_id": voices[char_name],
                "appearance": get_character(char_name)["appearance"][:100] + "...",
            }
            for char_name in self.config["characters"]
        }

        (self.episode_dir / "character_assignments.json").write_text(
            json.dumps(assignments, indent=2)
        )
        print(f"  ✓ Character voices assigned to: {', '.join(get_character(c)['name'] for c in self.config['characters'])}")
        return voices

    # ──────────────────────────────────────────────────────────────────────────────
    # 3. NARRATION GENERATION (ElevenLabs)
    # ──────────────────────────────────────────────────────────────────────────────

    def generate_dialogue_audio(self, script: Dict) -> Path:
        """
        Generate character dialogue and narration via ElevenLabs.

        Returns:
            Path to combined dialogue MP3
        """
        print("[2/9] Generating dialogue audio...")

        if not ELEVENLABS_API_KEY:
            print("  ⚠ No ELEVENLABS_API_KEY — skipping dialogue generation")
            return Path("")

        dialogue_dir = self.episode_dir / "dialogue"
        dialogue_dir.mkdir(exist_ok=True)

        # Generate dialogue for each scene
        character_voices = self.assign_character_voices()

        dialogue_clips = []

        # Intro narration
        if script.get("narration_intro"):
            intro_path = dialogue_dir / "00_intro.mp3"
            self._generate_tts(
                script["narration_intro"],
                VOICE_CONFIG["narration"]["voice_id"],
                VOICE_CONFIG["narration"]["settings"],
                intro_path
            )
            dialogue_clips.append(intro_path)
            print(f"  ✓ Intro narration")

        # Scene dialogue
        for scene in script.get("scenes", []):
            scene_id = scene.get("id", 0)
            dialogue_list = scene.get("dialogue", [])

            for i, line in enumerate(dialogue_list):
                char_name = line.get("character", "ziggy")
                char_text = line.get("line", "")

                if not char_text:
                    continue

                clip_path = dialogue_dir / f"{scene_id:02d}_{i:02d}_{char_name}.mp3"
                voice_id = character_voices.get(char_name)
                voice_cfg = VOICE_CONFIG["character_voices"].get(char_name, {})

                if voice_id:
                    self._generate_tts(char_text, voice_id, voice_cfg.get("settings", {}), clip_path)
                    dialogue_clips.append(clip_path)

        # Outro narration
        if script.get("narration_outro"):
            outro_path = dialogue_dir / "99_outro.mp3"
            self._generate_tts(
                script["narration_outro"],
                VOICE_CONFIG["narration"]["voice_id"],
                VOICE_CONFIG["narration"]["settings"],
                outro_path
            )
            dialogue_clips.append(outro_path)
            print(f"  ✓ Outro narration")

        # Concatenate all dialogue clips
        if dialogue_clips:
            combined_path = self.episode_dir / "dialogue_combined.mp3"
            self._concat_audio(dialogue_clips, combined_path)
            print(f"  ✓ Combined dialogue: {combined_path}")
            return combined_path

        return Path("")

    def _generate_tts(self, text: str, voice_id: str, settings: Dict, output_path: Path):
        """Generate TTS audio via ElevenLabs."""
        import requests

        url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
        headers = {
            "xi-api-key": ELEVENLABS_API_KEY,
            "Content-Type": "application/json"
        }

        payload = {
            "text": text,
            "model_id": VOICE_CONFIG["character_voices"].get("ziggy", {}).get("model", "eleven_turbo_v2_5"),
            "voice_settings": settings
        }

        try:
            r = requests.post(url, headers=headers, json=payload, timeout=60)
            r.raise_for_status()
            output_path.write_bytes(r.content)
        except Exception as e:
            print(f"  ⚠ TTS failed: {e}")

    def _concat_audio(self, audio_paths: List[Path], output_path: Path):
        """Concatenate multiple audio files."""
        concat_file = self.episode_dir / "concat_audio.txt"
        with open(concat_file, "w") as f:
            for p in audio_paths:
                if p.exists():
                    f.write(f"file '{p.absolute()}'\n")

        result = subprocess.run([
            "ffmpeg", "-y", "-f", "concat", "-safe", "0",
            "-i", str(concat_file),
            "-c", "copy",
            str(output_path)
        ], capture_output=True)

        if result.returncode != 0:
            print(f"  ⚠ Audio concat failed: {result.stderr.decode()[-200:]}")

    # ──────────────────────────────────────────────────────────────────────────────
    # 4. SCENE IMAGE GENERATION
    # ──────────────────────────────────────────────────────────────────────────────

    def generate_scene_images(self, script: Dict) -> List[Path]:
        """
        Generate images for each scene.

        Priority: Higgsfield → FLUX → Stock photos → Pollinations → gradient

        Returns:
            List of image file paths
        """
        print("[3/9] Generating scene images...")

        image_paths = []
        scenes = script.get("scenes", [])

        for scene in scenes:
            scene_id = scene.get("id", 0)
            image_prompt = scene.get("image_prompt", "")

            if not image_prompt:
                print(f"  ⚠ Scene {scene_id} has no image_prompt — skipping")
                continue

            img_path = None

            # Try Higgsfield first
            if HIGGSFIELD_API_KEY and HIGGSFIELD_SECRET and not self.skip_video:
                img_path = self._generate_image_higgsfield(image_prompt, scene_id)

            # Try FLUX (OpenMontage/fal.ai)
            if not img_path and FAL_KEY:
                img_path = self._generate_image_flux(image_prompt, scene_id)

            # Try stock photos (Pexels/Pixabay)
            if not img_path:
                img_path = self._generate_image_stock(image_prompt, scene_id)

            # Try Pollinations (free)
            if not img_path:
                img_path = self._generate_image_pollinations(image_prompt, scene_id)

            # Fallback: gradient
            if not img_path:
                img_path = self._generate_gradient_fallback(scene_id)

            if img_path:
                image_paths.append(img_path)

        print(f"  ✓ Generated {len(image_paths)} scene images")
        return image_paths

    def _generate_image_higgsfield(self, prompt: str, scene_id: int) -> Optional[Path]:
        """Generate image via Higgsfield Soul."""
        try:
            import requests

            # Get Higgsfield token
            r = requests.post(
                "https://api.higgsfield.ai/v1/auth/token",
                json={"api_key": HIGGSFIELD_API_KEY, "secret": HIGGSFIELD_SECRET},
                timeout=30
            )
            r.raise_for_status()
            token = r.json()["access_token"]

            # Generate image
            full_prompt = f"{SURGE_CONFIG['description'][:200]}. Scene: {prompt[:300]}"

            r = requests.post(
                "https://api.higgsfield.ai/v1/soul/generate",
                headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
                json={
                    "prompt": full_prompt,
                    "width": SURGE_CONFIG["resolution_width"],
                    "height": SURGE_CONFIG["resolution_height"],
                    "num_images": 1
                },
                timeout=120
            )
            r.raise_for_status()

            data = r.json()
            job_id = data.get("job_id") or data.get("id")

            if job_id:
                img_url = self._poll_higgsfield_job(job_id, token)
            else:
                img_url = data.get("images", [{}])[0].get("url", "")

            if not img_url:
                return None

            img_data = requests.get(img_url, timeout=60).content
            img_path = self.scenes_dir / f"scene_{scene_id:02d}.jpg"
            img_path.write_bytes(img_data)
            print(f"  ✓ Scene {scene_id} image (Higgsfield Soul)")
            return img_path

        except Exception as e:
            print(f"  ⚠ Scene {scene_id} Higgsfield failed: {e}")
            return None

    def _poll_higgsfield_job(self, job_id: str, token: str, max_wait: int = 300) -> str:
        """Poll a Higgsfield job until complete."""
        import requests
        import time

        deadline = time.time() + max_wait
        while time.time() < deadline:
            r = requests.get(
                f"https://api.higgsfield.ai/v1/jobs/{job_id}",
                headers={"Authorization": f"Bearer {token}"},
                timeout=30
            )
            r.raise_for_status()
            data = r.json()
            status = data.get("status", "")
            if status == "completed":
                return data.get("output_url") or data.get("url") or data["outputs"][0]["url"]
            if status in ("failed", "error"):
                raise RuntimeError(f"Higgsfield job {job_id} failed: {data}")
            time.sleep(8)
        raise TimeoutError(f"Higgsfield job {job_id} timed out")

    def _generate_image_flux(self, prompt: str, scene_id: int) -> Optional[Path]:
        """Generate image via FLUX (OpenMontage/fal.ai)."""
        try:
            from tools.graphics.flux_image import FluxImage

            img_path = self.scenes_dir / f"scene_{scene_id:02d}.jpg"
            full_prompt = f"SURGE neon sci-fi digital illustration: {prompt[:300]}"

            tool = FluxImage()
            result = tool.execute({
                "prompt": full_prompt,
                "width": SURGE_CONFIG["resolution_width"],
                "height": SURGE_CONFIG["resolution_height"],
                "num_inference_steps": 28,
                "output_path": str(img_path),
            })

            if result.success and img_path.exists() and img_path.stat().st_size > 5000:
                print(f"  ✓ Scene {scene_id} image (FLUX)")
                return img_path
        except Exception as e:
            print(f"  ⚠ Scene {scene_id} FLUX failed: {e}")
        return None

    def _generate_image_stock(self, prompt: str, scene_id: int) -> Optional[Path]:
        """Generate image from stock photos (Pexels/Pixabay)."""
        import requests

        img_path = self.scenes_dir / f"scene_{scene_id:02d}.jpg"
        keywords = "digital sci-fi neon technology"

        try:
            if PEXELS_API_KEY:
                r = requests.get(
                    "https://api.pexels.com/v1/search",
                    params={"query": keywords, "per_page": 10},
                    headers={"Authorization": PEXELS_API_KEY},
                    timeout=20
                )
                photos = r.json().get("photos", [])
                if photos:
                    url = photos[0]["src"]["landscape"]
                    data = requests.get(url, timeout=30).content
                    img_path.write_bytes(data)
                    print(f"  ✓ Scene {scene_id} image (Pexels stock)")
                    return img_path
        except Exception as e:
            print(f"  ⚠ Scene {scene_id} stock photo failed: {e}")
        return None

    def _generate_image_pollinations(self, prompt: str, scene_id: int) -> Optional[Path]:
        """Generate image via Pollinations FLUX (free)."""
        import requests

        img_path = self.scenes_dir / f"scene_{scene_id:02d}.jpg"
        full_prompt = f"Neon sci-fi digital illustration, {prompt[:200]}"
        encoded = requests.utils.quote(full_prompt)

        headers = {
            "Referer": "https://rhythmixapp.com.au",
            "User-Agent": "SurgeBot/1.0",
        }

        try:
            url = (
                f"https://image.pollinations.ai/prompt/{encoded}"
                f"?width={SURGE_CONFIG['resolution_width']}&height={SURGE_CONFIG['resolution_height']}"
                f"&model=flux&nologo=true&seed={scene_id * 7}"
            )
            r = requests.get(url, timeout=90, headers=headers)
            if r.status_code == 200 and len(r.content) > 5000:
                img_path.write_bytes(r.content)
                print(f"  ✓ Scene {scene_id} image (Pollinations)")
                return img_path
        except Exception as e:
            print(f"  ⚠ Scene {scene_id} Pollinations failed: {e}")
        return None

    def _generate_gradient_fallback(self, scene_id: int) -> Path:
        """Generate gradient background fallback."""
        vid_path = self.scenes_dir / f"scene_{scene_id:02d}_gradient.jpg"

        # Simple gradient image using PIL
        try:
            from PIL import Image

            # Use SURGE neon colors
            colors = [
                (10, 10, 30, 30, 30, 60),      # navy to darker navy
                (30, 0, 60, 60, 0, 120),       # purple to darker purple
                (0, 60, 120, 0, 30, 60),       # cyan to dark blue
                (60, 0, 120, 30, 0, 60),       # magenta to dark purple
            ]

            r1, g1, b1, r2, g2, b2 = colors[scene_id % len(colors)]

            img = Image.new("RGB", (SURGE_CONFIG["resolution_width"], SURGE_CONFIG["resolution_height"]))
            pixels = img.load()

            for y in range(SURGE_CONFIG["resolution_height"]):
                ratio = y / SURGE_CONFIG["resolution_height"]
                r = int(r1 + (r2 - r1) * ratio)
                g = int(g1 + (g2 - g1) * ratio)
                b = int(b1 + (b2 - b1) * ratio)
                for x in range(SURGE_CONFIG["resolution_width"]):
                    pixels[x, y] = (r, g, b)

            img.save(str(vid_path), "JPEG", quality=85)
            print(f"  ↩ Scene {scene_id} gradient fallback")
            return vid_path
        except Exception as e:
            print(f"  ⚠ Gradient fallback failed: {e}")
            return Path("")

    # ──────────────────────────────────────────────────────────────────────────────
    # 5. SCENE ANIMATION (image-to-video)
    # ──────────────────────────────────────────────────────────────────────────────

    def animate_scenes(self, image_paths: List[Path], script: Dict) -> List[Path]:
        """
        Convert static images to animated video clips.

        Returns:
            List of video file paths (MP4)
        """
        print("[4/9] Animating scene images...")

        video_paths = []
        for i, scene in enumerate(script.get("scenes", [])):
            scene_id = scene.get("id", 0)
            duration = scene.get("duration", 10)

            if i < len(image_paths):
                img_path = image_paths[i]
            else:
                print(f"  ⚠ Scene {scene_id} has no image — skipping")
                continue

            # Try Higgsfield DOP (image-to-video) first
            video_path = self._animate_higgsfield_dop(img_path, scene, scene_id)

            # Fallback: simple image-to-video hold
            if not video_path:
                video_path = self._animate_image_to_video_hold(img_path, duration, scene_id)

            if video_path:
                video_paths.append(video_path)

        print(f"  ✓ Animated {len(video_paths)} scenes")
        return video_paths

    def _animate_higgsfield_dop(self, img_path: Path, scene: Dict, scene_id: int) -> Optional[Path]:
        """Animate image via Higgsfield DOP (image-to-video)."""
        if not HIGGSFIELD_API_KEY or not HIGGSFIELD_SECRET:
            return None

        try:
            import requests

            # Get token
            r = requests.post(
                "https://api.higgsfield.ai/v1/auth/token",
                json={"api_key": HIGGSFIELD_API_KEY, "secret": HIGGSFIELD_SECRET},
                timeout=30
            )
            token = r.json()["access_token"]

            # Upload image
            with open(img_path, "rb") as f:
                upload_r = requests.post(
                    "https://api.higgsfield.ai/v1/upload",
                    headers={"Authorization": f"Bearer {token}"},
                    files={"file": (img_path.name, f, "image/jpeg")},
                    timeout=60
                )

            if upload_r.status_code != 200:
                return None

            image_id = upload_r.json().get("id") or upload_r.json().get("asset_id")

            # Generate animation
            duration = scene.get("duration", 10)
            motion_prompt = f"Slow gentle camera pan, ambient lighting shifts, soft glow effects. {scene.get('image_prompt', '')[:150]}"

            anim_r = requests.post(
                "https://api.higgsfield.ai/v1/dop/generate",
                headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
                json={
                    "image_id": image_id,
                    "prompt": motion_prompt,
                    "duration": min(duration, 8),
                    "motion_strength": 0.3,
                },
                timeout=120
            )

            if anim_r.status_code != 200:
                return None

            anim_data = anim_r.json()
            job_id = anim_data.get("job_id") or anim_data.get("id")

            if not job_id:
                return None

            # Poll job
            vid_url = self._poll_higgsfield_job(job_id, token)
            vid_data = requests.get(vid_url, timeout=120).content

            vid_path = self.scenes_dir / f"scene_{scene_id:02d}.mp4"
            vid_path.write_bytes(vid_data)
            print(f"  ✓ Scene {scene_id} animated (Higgsfield DOP)")
            return vid_path

        except Exception as e:
            print(f"  ⚠ Scene {scene_id} DOP animation failed: {e}")
            return None

    def _animate_image_to_video_hold(self, img_path: Path, duration: float, scene_id: int) -> Path:
        """Convert static image to video (simple hold, no motion)."""
        vid_path = self.scenes_dir / f"scene_{scene_id:02d}.mp4"

        result = subprocess.run([
            "ffmpeg", "-y", "-loop", "1",
            "-i", str(img_path),
            "-t", str(duration),
            "-vf", f"scale={SURGE_CONFIG['resolution_width']}:{SURGE_CONFIG['resolution_height']}:force_original_aspect_ratio=increase,crop={SURGE_CONFIG['resolution_width']}:{SURGE_CONFIG['resolution_height']},format=yuv420p",
            "-c:v", "libx264",
            "-preset", RENDER_CONFIG["video"]["preset"],
            "-crf", str(RENDER_CONFIG["video"]["crf"]),
            str(vid_path)
        ], capture_output=True)

        if result.returncode == 0:
            print(f"  ✓ Scene {scene_id} video (image hold, {duration:.1f}s)")
        else:
            print(f"  ⚠ Scene {scene_id} image-to-video failed")

        return vid_path

    # ──────────────────────────────────────────────────────────────────────────────
    # 6. BACKGROUND MUSIC
    # ──────────────────────────────────────────────────────────────────────────────

    def generate_background_music(self, total_duration_secs: int) -> Path:
        """
        Generate background music for the episode.

        Returns:
            Path to music MP3
        """
        print("[5/9] Generating background music...")

        # Try Pixabay/OpenMontage first, fall back to ffmpeg sine tones
        music_path = self._generate_music_pixabay(total_duration_secs)

        if not music_path or not music_path.exists() or music_path.stat().st_size < 100:
            print("  ↩ Pixabay unavailable — generating with ffmpeg...")
            music_path = self._generate_music_ffmpeg(total_duration_secs)

        if music_path and music_path.exists():
            print(f"  ✓ Background music: {music_path}")
        return music_path

    def _generate_music_pixabay(self, duration_secs: int) -> Optional[Path]:
        """Download royalty-free music via Pixabay."""
        music_path = self.episode_dir / "music.mp3"

        try:
            from tools.audio.pixabay_music import PixabayMusic

            tool = PixabayMusic()
            result = tool.execute({
                "query": "sci-fi ambient futuristic electronic uplifting",
                "min_duration": max(60, duration_secs - 30),
                "max_duration": duration_secs + 120,
                "output_path": str(music_path),
            })

            if result.success and music_path.exists() and music_path.stat().st_size > 10000:
                print(f"  ✓ Music via Pixabay")
                return music_path
        except Exception as e:
            print(f"  ⚠ Pixabay music failed: {e}")

        return None

    def _generate_music_ffmpeg(self, duration_secs: int) -> Path:
        """Generate ambient music using ffmpeg sine tones."""
        music_path = self.episode_dir / "music.mp3"
        total = int(duration_secs) + 5

        # Layer 4 sine tones for sci-fi ambient feel: C3, E3, G3, C4
        result = subprocess.run([
            "ffmpeg", "-y",
            "-f", "lavfi", "-i", f"sine=frequency=130.81:duration={total}",  # C3
            "-f", "lavfi", "-i", f"sine=frequency=164.81:duration={total}",  # E3
            "-f", "lavfi", "-i", f"sine=frequency=196.00:duration={total}",  # G3
            "-f", "lavfi", "-i", f"sine=frequency=261.63:duration={total}",  # C4
            "-filter_complex",
            "[0:a]volume=0.12[a0];"
            "[1:a]volume=0.10[a1];"
            "[2:a]volume=0.08[a2];"
            "[3:a]volume=0.06[a3];"
            "[a0][a1][a2][a3]amix=inputs=4:duration=longest[aout];"
            f"[aout]lowpass=f=3000,afade=t=in:st=0:d=3,afade=t=out:st={total-4}:d=4[final]",
            "-map", "[final]",
            "-c:a", "libmp3lame", "-q:a", "4",
            str(music_path)
        ], capture_output=True)

        if result.returncode == 0 and music_path.exists() and music_path.stat().st_size > 1000:
            print(f"  ✓ Ambient music generated via ffmpeg")
        else:
            print(f"  ⚠ Music generation failed — continuing without music")
            music_path.write_bytes(b"")

        return music_path

    # ──────────────────────────────────────────────────────────────────────────────
    # 7. VIDEO ASSEMBLY
    # ──────────────────────────────────────────────────────────────────────────────

    def assemble_final_video(self, video_paths: List[Path], dialogue: Path,
                            music: Path) -> Path:
        """
        Assemble all components into final video.

        Returns:
            Path to final MP4
        """
        print("[6/9] Assembling final video...")

        output_path = self.episode_dir / "final.mp4"

        # Concatenate scene videos
        concat_file = self.episode_dir / "concat.txt"
        valid_videos = [v for v in video_paths if v.exists() and v.stat().st_size > 100]

        if not valid_videos:
            print("  ⚠ No valid scene videos — creating fallback slate")
            return self._create_color_slate_fallback()

        with open(concat_file, "w") as f:
            for v in valid_videos:
                f.write(f"file '{v.absolute()}'\n")

        # Concat videos
        raw_video = self.episode_dir / "raw.mp4"
        result = subprocess.run([
            "ffmpeg", "-y", "-f", "concat", "-safe", "0",
            "-i", str(concat_file),
            "-c", "copy",
            str(raw_video)
        ], capture_output=True)

        if result.returncode != 0:
            print(f"  ✗ ffmpeg concat failed")
            raise RuntimeError("ffmpeg concat failed")

        # Mix audio and video
        has_dialogue = dialogue.exists() and dialogue.stat().st_size > 100
        has_music = music.exists() and music.stat().st_size > 100

        if has_dialogue and has_music:
            # Mix narration + music
            result = subprocess.run([
                "ffmpeg", "-y",
                "-i", str(raw_video),
                "-i", str(dialogue),
                "-i", str(music),
                "-filter_complex",
                f"[1:a]volume={RENDER_CONFIG['composition']['narration_volume']}[narr];"
                f"[2:a]volume={RENDER_CONFIG['composition']['music_volume']}[mus];"
                f"[narr][mus]amix=inputs=2:duration=first[aout]",
                "-map", "0:v", "-map", "[aout]",
                "-c:v", "libx264",
                "-preset", RENDER_CONFIG["video"]["preset"],
                "-crf", str(RENDER_CONFIG["video"]["crf"]),
                "-c:a", "aac",
                "-shortest",
                str(output_path)
            ], capture_output=True)
        elif has_dialogue:
            # Narration only
            result = subprocess.run([
                "ffmpeg", "-y",
                "-i", str(raw_video),
                "-i", str(dialogue),
                "-map", "0:v", "-map", "1:a",
                "-c:v", "libx264",
                "-preset", RENDER_CONFIG["video"]["preset"],
                "-crf", str(RENDER_CONFIG["video"]["crf"]),
                "-c:a", "aac",
                "-shortest",
                str(output_path)
            ], capture_output=True)
        else:
            # Video only
            result = subprocess.run([
                "ffmpeg", "-y",
                "-i", str(raw_video),
                "-c:v", "libx264",
                "-preset", RENDER_CONFIG["video"]["preset"],
                "-crf", str(RENDER_CONFIG["video"]["crf"]),
                "-an",
                str(output_path)
            ], capture_output=True)

        if result.returncode == 0:
            print(f"  ✓ Final video assembled: {output_path}")
        else:
            print(f"  ✗ ffmpeg assembly failed: {result.stderr.decode()[-400:]}")
            raise RuntimeError("ffmpeg assembly failed")

        return output_path

    def _create_color_slate_fallback(self) -> Path:
        """Create a fallback video if no scenes are available."""
        output_path = self.episode_dir / "final.mp4"

        result = subprocess.run([
            "ffmpeg", "-y",
            "-f", "lavfi", "-i", "color=c=0x0a0a1e:size=1920x1080:rate=24",
            "-t", str(SURGE_CONFIG["episode_duration_secs"]),
            "-c:v", "libx264",
            "-preset", RENDER_CONFIG["video"]["preset"],
            "-crf", str(RENDER_CONFIG["video"]["crf"]),
            "-an",
            str(output_path)
        ], capture_output=True)

        if result.returncode == 0:
            print(f"  ✓ Fallback color slate created")
        else:
            print(f"  ⚠ Fallback creation failed")

        return output_path

    # ──────────────────────────────────────────────────────────────────────────────
    # 8. THUMBNAIL & METADATA
    # ──────────────────────────────────────────────────────────────────────────────

    def generate_thumbnail(self, script: Dict) -> Path:
        """Generate YouTube thumbnail (1280×720)."""
        print("[7/9] Generating thumbnail...")

        try:
            from PIL import Image, ImageDraw, ImageFont

            W, H = 1280, 720
            img = Image.new("RGB", (W, H), YOUTUBE_CONFIG["thumbnail_config"]["bg_color"])
            draw = ImageDraw.Draw(img)

            # Add gradient background
            for y in range(H):
                ratio = y / H
                r = int(10 + (30 - 10) * ratio)
                g = int(10 + (15 - 10) * ratio)
                b = int(30 + (60 - 30) * ratio)
                draw.line([(0, y), (W, y)], fill=(r, g, b))

            # Add neon accents
            draw.rectangle([10, 10, W - 10, H - 10], outline=YOUTUBE_CONFIG["thumbnail_config"]["primary_neon"], width=4)

            # Load font
            font_paths = [
                "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
                "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
            ]
            font = None
            for fp in font_paths:
                if Path(fp).exists():
                    try:
                        font = ImageFont.truetype(fp, 64)
                        break
                    except:
                        continue
            if not font:
                font = ImageFont.load_default()

            # Episode title
            title = f"Ep {self.episode_number}"
            bbox = draw.textbbox((0, 0), title, font=font)
            x = (W - (bbox[2] - bbox[0])) // 2
            draw.text((x, 100), title, font=font, fill=YOUTUBE_CONFIG["thumbnail_config"]["primary_neon"])

            # Episode name
            ep_title = self.config["title"][:30]
            if len(font_paths) > 0:
                try:
                    font_small = ImageFont.truetype(font_paths[0], 36)
                except:
                    font_small = font
            else:
                font_small = font

            bbox = draw.textbbox((0, 0), ep_title, font=font_small)
            x = (W - (bbox[2] - bbox[0])) // 2
            draw.text((x, 250), ep_title, font=font_small, fill=YOUTUBE_CONFIG["thumbnail_config"]["accent_neon"])

            # "SURGE" branding
            draw.text((50, H - 80), "SURGE PILOT", font=font_small, fill=YOUTUBE_CONFIG["thumbnail_config"]["primary_neon"])

            thumb_path = self.episode_dir / "thumbnail.jpg"
            img.save(str(thumb_path), "JPEG", quality=90)
            print(f"  ✓ Thumbnail created: {thumb_path}")
            return thumb_path

        except Exception as e:
            print(f"  ⚠ Thumbnail generation failed: {e}")
            return Path("")

    # ──────────────────────────────────────────────────────────────────────────────
    # 9. YOUTUBE UPLOAD
    # ──────────────────────────────────────────────────────────────────────────────

    def upload_to_youtube(self, video_path: Path, script: Dict) -> Optional[str]:
        """Upload episode to YouTube."""
        print("[8/9] YouTube upload...")

        if self.dry_run:
            print(f"  [DRY RUN] Would upload: {self.config['title']}")
            return None

        if not YOUTUBE_CLIENT_ID or not YOUTUBE_CLIENT_SECRET:
            print("  ⚠ No YouTube credentials — skipping upload")
            return None

        try:
            from google.oauth2.credentials import Credentials
            from googleapiclient.discovery import build
            from googleapiclient.http import MediaFileUpload

            token_file = Path(__file__).parent / "token.json"
            if not token_file.exists():
                print("  ✗ No token.json — run youtube_auth.py first")
                return None

            token_data = json.loads(token_file.read_text())

            # Refresh token
            import urllib.request
            import urllib.parse
            from datetime import datetime, timedelta

            refresh_body = urllib.parse.urlencode({
                "client_id": YOUTUBE_CLIENT_ID,
                "client_secret": YOUTUBE_CLIENT_SECRET,
                "refresh_token": token_data.get("refresh_token"),
                "grant_type": "refresh_token",
            }).encode()

            req = urllib.request.Request(
                "https://oauth2.googleapis.com/token",
                data=refresh_body,
                headers={"Content-Type": "application/x-www-form-urlencoded"},
                method="POST",
            )

            with urllib.request.urlopen(req, timeout=30) as resp:
                resp_json = json.loads(resp.read())

            fresh_token = resp_json["access_token"]
            expires_in = int(resp_json.get("expires_in", 3600))
            expiry_dt = datetime.utcnow() + timedelta(seconds=expires_in - 60)

            creds = Credentials(
                token=fresh_token,
                refresh_token=token_data.get("refresh_token"),
                token_uri="https://oauth2.googleapis.com/token",
                client_id=YOUTUBE_CLIENT_ID,
                client_secret=YOUTUBE_CLIENT_SECRET,
                scopes=["https://www.googleapis.com/auth/youtube.upload"],
                expiry=expiry_dt,
            )

            youtube = build("youtube", "v3", credentials=creds)

            # Build description
            description = YOUTUBE_CONFIG["description_template"].format(
                num=self.episode_number,
                title=self.config["title"],
                description=script.get("description", "")
            )

            body = {
                "snippet": {
                    "title": YOUTUBE_CONFIG["title_template"].format(num=self.episode_number, title=self.config["title"]),
                    "description": description,
                    "tags": YOUTUBE_CONFIG["tags"],
                    "categoryId": YOUTUBE_CONFIG["upload_settings"]["category_id"],
                },
                "status": {
                    "privacyStatus": YOUTUBE_CONFIG["upload_settings"]["privacy_status"],
                    "madeForKids": YOUTUBE_CONFIG["upload_settings"]["made_for_kids"],
                    "selfDeclaredMadeForKids": YOUTUBE_CONFIG["upload_settings"]["self_declared_made_for_kids"],
                }
            }

            media = MediaFileUpload(str(video_path), chunksize=-1, resumable=True, mimetype="video/mp4")
            request = youtube.videos().insert(part=",".join(body.keys()), body=body, media_body=media)

            response = None
            while response is None:
                status, response = request.next_chunk()
                if status:
                    print(f"  Upload {int(status.progress() * 100)}%...")

            video_id = response["id"]
            print(f"  ✓ Uploaded: https://youtube.com/watch?v={video_id}")

            # Upload thumbnail
            thumb_path = self.episode_dir / "thumbnail.jpg"
            if thumb_path.exists():
                self._upload_thumbnail_to_youtube(youtube, video_id, thumb_path)

            return video_id

        except Exception as e:
            print(f"  ⚠ YouTube upload failed: {e}")
            return None

    def _upload_thumbnail_to_youtube(self, youtube, video_id: str, thumb_path: Path):
        """Set custom thumbnail on uploaded video."""
        from googleapiclient.http import MediaFileUpload
        try:
            media = MediaFileUpload(str(thumb_path), mimetype="image/jpeg")
            youtube.thumbnails().set(videoId=video_id, media_body=media).execute()
            print(f"  ✓ Thumbnail set on video {video_id}")
        except Exception as e:
            print(f"  ⚠ Thumbnail upload failed: {e}")

    # ──────────────────────────────────────────────────────────────────────────────
    # RENDER ORCHESTRATION
    # ──────────────────────────────────────────────────────────────────────────────

    def render(self) -> Path:
        """
        Complete render pipeline: script → images → animation → audio → video.

        Returns:
            Path to final video
        """
        try:
            # 1. Script
            script = self.load_or_generate_script()

            # 2. Dialogue audio
            dialogue = self.generate_dialogue_audio(script)

            # 3. Scene images
            image_paths = self.generate_scene_images(script)

            # 4. Scene animation
            video_paths = self.animate_scenes(image_paths, script)

            # 5. Background music
            total_duration = sum(s.get("duration", 10) for s in script.get("scenes", []))
            music = self.generate_background_music(total_duration)

            # 6. Final assembly
            final_video = self.assemble_final_video(video_paths, dialogue, music)

            # 7. Thumbnail
            thumb_path = self.generate_thumbnail(script)

            # 8. YouTube upload
            print("[9/9] Finalizing...")
            video_id = self.upload_to_youtube(final_video, script)

            if video_id or self.dry_run:
                print(f"\n✅ Episode {self.episode_number} complete!")
                print(f"   Video: {final_video}")
                if video_id:
                    print(f"   YouTube: https://youtube.com/watch?v={video_id}")
            else:
                print(f"\n⚠️  Episode {self.episode_number} produced but not uploaded.")
                print(f"   Video: {final_video}")

            return final_video

        except Exception as e:
            print(f"\n✗ Render failed: {e}")
            import traceback
            traceback.print_exc()
            raise


# ─────────────────────────────────────────────────────────────────────────────
# CLI ENTRY POINT
# ─────────────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="SURGE Pilot Episode Renderer")
    parser.add_argument("--episode", type=int, required=True, help="Episode number (1-10)")
    parser.add_argument("--render", action="store_true", help="Execute full render")
    parser.add_argument("--dry-run", action="store_true", help="Skip YouTube upload")
    parser.add_argument("--skip-video", action="store_true", help="Skip Higgsfield image generation")
    parser.add_argument("--script-file", type=str, help="Load pre-written script")

    args = parser.parse_args()

    renderer = SurgeEpisodeRenderer(
        episode_number=args.episode,
        dry_run=args.dry_run,
        skip_video=args.skip_video,
        script_file=Path(args.script_file) if args.script_file else None,
    )

    if args.render:
        renderer.render()
    else:
        print(f"Configured for Episode {args.episode}: {renderer.config['title']}")
        print("Run with --render to execute the full pipeline")
