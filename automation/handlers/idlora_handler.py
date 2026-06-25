#!/usr/bin/env python3
"""
ID-LoRA Integration Handler
Identity-preserving talking-head video for the orchestrator — the empire's
"spokesperson".

ID-LoRA (Identity-Driven In-Context LoRA, ECCV 2026) generates a talking video
from three inputs: a structured text prompt, a first-frame image (face + scene),
and a short ~5s reference audio clip (voice identity). Built on LTX-2 / LTX-2.3,
it synthesizes appearance and voice jointly in a single pass — no per-speaker
fine-tuning, zero-shot at inference. That gives the content factory an avatar /
spokesperson capability that sits alongside the HyperFrames + LTX video work.

Like whisper.cpp and Agent TARS, this is a CLI tool, not a server: it runs via
`uv run python scripts/inference_*.py ...` inside an ID-LoRA checkout. So this
handler shells out rather than importing — no pip deps of its own. Every entry
point degrades gracefully: if `uv`, the repo, or a chosen inference script isn't
found, it returns a clean error dict with the exact clone/sync/download fix.

Prompt format (the model expects all three tagged sections):
    [VISUAL]: shot type, subject appearance, clothing, setting, lighting, action
    [SPEECH]: the exact words to be spoken (a literal transcript, not a summary)
    [SOUNDS]: vocal style (tone/volume/mic distance) + ambient/background sounds

Identity / responsibility: this synthesizes a real person's likeness and voice.
Treat outputs as synthetic media — obtain consent for any identifiable person and
label generated content. The handler is a research/production tool, not a license
to impersonate.
"""

import os
import json
import shutil
import logging
import asyncio
from dataclasses import dataclass, field
from datetime import datetime
from typing import Dict, List, Optional, Any

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Default search locations for an ID-LoRA checkout.
_DEFAULT_REPO_PATHS = [
    "~/ID-LoRA",
    "~/RHYTHMIX_Empire/ID-LoRA",
    "/opt/ID-LoRA",
]

# Inference modes -> the script that runs them, per model version.
#   base  -> LTX-2 (19B):  scripts/
#   2.3   -> LTX-2.3 (22B): ID-LoRA-2.3/scripts/  (adds the HQ Res2s sampler)
_SCRIPTS = {
    "base": {
        "one_stage": "scripts/inference_one_stage.py",
        "two_stage": "scripts/inference_two_stage.py",
    },
    "2.3": {
        "one_stage": "ID-LoRA-2.3/scripts/inference_one_stage.py",
        "two_stage": "ID-LoRA-2.3/scripts/inference_two_stage.py",
        "two_stage_hq": "ID-LoRA-2.3/scripts/inference_two_stage_hq.py",
    },
}

DEFAULT_VERSION = os.environ.get("IDLORA_VERSION", "2.3")
DEFAULT_MODE = os.environ.get("IDLORA_MODE", "two_stage")


def build_prompt(visual: str, speech: str, sounds: str = "") -> str:
    """Assemble ID-LoRA's three-section tagged prompt from its parts."""
    sounds = sounds or ("The speaker has a clear, conversational tone at moderate "
                        "volume, close to the microphone.")
    return (f"[VISUAL]: {visual.strip()}\n"
            f"[SPEECH]: {speech.strip()}\n"
            f"[SOUNDS]: {sounds.strip()}")


@dataclass
class IDLoRARun:
    """Result of an ID-LoRA inference run."""
    status: str
    videos: List[str] = field(default_factory=list)
    output: str = ""
    returncode: int = 0
    created_at: str = ""

    def __post_init__(self):
        if not self.created_at:
            self.created_at = datetime.now().isoformat()

    def to_dict(self) -> Dict:
        return {"status": self.status, "videos": self.videos,
                "output": self.output, "returncode": self.returncode,
                "created_at": self.created_at}


class IDLoRAClient:
    """Locate and drive an ID-LoRA checkout via `uv run`."""

    def __init__(self, repo_dir: Optional[str] = None,
                 lora_path: Optional[str] = None,
                 version: str = DEFAULT_VERSION, mode: str = DEFAULT_MODE,
                 out_dir: Optional[str] = None, timeout: int = 3600):
        self.version = version if version in _SCRIPTS else "2.3"
        self.mode = mode
        self.timeout = timeout  # generous: video diffusion is slow, model is huge
        self.repo_dir = self._discover_repo(repo_dir)
        self.lora_path = lora_path or os.environ.get("IDLORA_LORA_PATH")
        self.out_dir = out_dir or os.path.expanduser("~/RHYTHMIX_Empire/output/idlora")
        os.makedirs(self.out_dir, exist_ok=True)
        self.uv = shutil.which("uv")

    @staticmethod
    def _discover_repo(explicit: Optional[str]) -> Optional[str]:
        candidates = [explicit] if explicit else []
        candidates.append(os.environ.get("IDLORA_HOME", ""))
        candidates.extend(_DEFAULT_REPO_PATHS)
        for c in candidates:
            if not c:
                continue
            path = os.path.expanduser(c)
            # A real checkout has a pyproject.toml at its root.
            if os.path.isdir(path) and os.path.isfile(os.path.join(path, "pyproject.toml")):
                return path
        return None

    def _script_rel(self) -> Optional[str]:
        return _SCRIPTS.get(self.version, {}).get(self.mode)

    def _script_abs(self) -> Optional[str]:
        rel = self._script_rel()
        if not rel or not self.repo_dir:
            return None
        path = os.path.join(self.repo_dir, rel)
        return path if os.path.isfile(path) else None

    def is_available(self) -> bool:
        return bool(self.uv and self.repo_dir and self._script_abs()
                    and self.lora_path)

    def status(self) -> Dict:
        return {
            "has_uv": bool(self.uv),
            "repo_dir": self.repo_dir,
            "version": self.version,
            "mode": self.mode,
            "script": self._script_abs(),
            "lora_path": self.lora_path,
            "out_dir": self.out_dir,
            "available": self.is_available(),
        }

    def _fix_hint(self) -> Dict:
        if not self.uv:
            return {"error": "uv_not_installed",
                    "hint": "Install the uv package manager: "
                            "curl -LsSf https://astral.sh/uv/install.sh | sh"}
        if not self.repo_dir:
            return {"error": "idlora_repo_not_found",
                    "hint": "Clone ID-LoRA and sync: "
                            "git clone https://github.com/ID-LoRA/ID-LoRA.git "
                            "~/ID-LoRA && cd ~/ID-LoRA && uv sync --frozen  "
                            "(set IDLORA_HOME to a custom path)."}
        if not self._script_abs():
            avail = sorted(_SCRIPTS.get(self.version, {}))
            return {"error": "idlora_script_not_found",
                    "hint": f"No '{self.mode}' script for version {self.version}. "
                            f"Available modes: {avail}. For v2.3 scripts, switch "
                            "the uv workspace to ID-LoRA-2.3/packages/* and "
                            "`uv sync` (see ID-LoRA-2.3/README.md)."}
        if not self.lora_path:
            return {"error": "idlora_lora_missing",
                    "hint": "Download checkpoints (bash scripts/download_models.sh) "
                            "and set IDLORA_LORA_PATH to the .safetensors file."}
        return {"error": "idlora_unavailable"}

    def _build_command(self, prompt: str, reference_audio: str, first_frame: str,
                       extra: Optional[List[str]] = None) -> List[str]:
        """Assemble the `uv run python <script> ...` invocation."""
        cmd = [self.uv, "run", "python", self._script_abs(),
               "--lora-path", self.lora_path,
               "--reference-audio", reference_audio,
               "--first-frame", first_frame,
               "--prompt", prompt,
               "--output-dir", self.out_dir]
        if extra:
            cmd += extra
        return cmd

    async def run(self, prompt: str, reference_audio: str, first_frame: str,
                  extra: Optional[List[str]] = None) -> IDLoRARun:
        """Run a single talking-head generation to completion."""
        if not self.is_available():
            raise RuntimeError(json.dumps(self._fix_hint()))
        for label, path in (("reference_audio", reference_audio),
                            ("first_frame", first_frame)):
            if not path or not os.path.isfile(os.path.expanduser(path)):
                raise RuntimeError(json.dumps(
                    {"error": f"missing_{label}", "hint": f"{label} not found: {path}"}))

        before = self._list_videos()
        cmd = self._build_command(prompt, reference_audio, first_frame, extra)
        logger.info(f"[id-lora] $ {' '.join(cmd)}")

        proc = await asyncio.create_subprocess_exec(
            *cmd, cwd=self.repo_dir,
            stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.PIPE,
        )
        try:
            stdout, stderr = await asyncio.wait_for(proc.communicate(),
                                                    timeout=self.timeout)
        except asyncio.TimeoutError:
            proc.kill()
            return IDLoRARun(status="timeout", returncode=-1)

        out = stdout.decode("utf-8", "replace")
        err = stderr.decode("utf-8", "replace")
        new_videos = sorted(set(self._list_videos()) - set(before))
        return IDLoRARun(
            status="completed" if proc.returncode == 0 else "failed",
            videos=new_videos,
            output=(out or err)[-2000:],
            returncode=proc.returncode or 0,
        )

    def _list_videos(self) -> List[str]:
        try:
            return [os.path.join(self.out_dir, n) for n in os.listdir(self.out_dir)
                    if n.lower().endswith((".mp4", ".mov", ".webm"))]
        except OSError:
            return []


class IDLoRAOrchestrationHandler:
    """Handle identity-preserving talking-head video tasks in the orchestrator."""

    def __init__(self, repo_dir: Optional[str] = None,
                 lora_path: Optional[str] = None,
                 version: str = DEFAULT_VERSION, mode: str = DEFAULT_MODE,
                 out_dir: Optional[str] = None):
        self.client = IDLoRAClient(repo_dir=repo_dir, lora_path=lora_path,
                                   version=version, mode=mode, out_dir=out_dir)

    async def handle_talking_video(self, reference_audio: str, first_frame: str,
                                   visual: str = "", speech: str = "",
                                   sounds: str = "", prompt: Optional[str] = None,
                                   extra: Optional[List[str]] = None) -> Dict:
        """Generate a talking-head video. Pass either a pre-tagged `prompt` or
        the `visual`/`speech`/`sounds` parts to be assembled."""
        if not self.client.is_available():
            return {"status": "failed", **self.client._fix_hint()}
        final_prompt = prompt or build_prompt(visual, speech, sounds)
        if "[SPEECH]" not in final_prompt:
            return {"status": "failed", "error": "prompt_missing_speech",
                    "hint": "Provide `speech` (exact words) or a [SPEECH]-tagged prompt."}
        try:
            result = await self.client.run(final_prompt, reference_audio,
                                           first_frame, extra)
        except Exception as e:
            return {"status": "failed", **self._err(e)}
        return {"status": result.status, "engine": f"id-lora-ltx{self.client.version}",
                "output": result.videos, "log": result.output[-800:],
                "prompt": final_prompt}

    async def handle_status(self) -> Dict:
        return {"status": "ok", "engine": "id-lora", **self.client.status()}

    async def handle_task(self, payload: Dict) -> Dict:
        """Orchestrator entry point. Dispatch on payload['action']."""
        action = payload.get("action", "talking_video")
        if action == "status":
            return await self.handle_status()
        ref = payload.get("reference_audio") or payload.get("reference_path", "")
        frame = payload.get("first_frame") or payload.get("first_frame_path", "")
        if not ref or not frame:
            return {"status": "failed", "error": "need_reference_audio_and_first_frame"}
        return await self.handle_talking_video(
            reference_audio=ref, first_frame=frame,
            visual=payload.get("visual", ""), speech=payload.get("speech", ""),
            sounds=payload.get("sounds", ""), prompt=payload.get("prompt"),
            extra=payload.get("extra"),
        )

    def _err(self, e: Exception) -> Dict:
        msg = str(e)
        try:
            parsed = json.loads(msg)
            if isinstance(parsed, dict):
                return parsed
        except (json.JSONDecodeError, ValueError):
            pass
        return {"error": msg}


# ID-LoRA task templates (parallels the other handlers)
IDLORA_TEMPLATES = {
    "talking_video": {
        "description": "Identity-preserving talking-head video (image + voice -> video)",
        "params": ["reference_audio", "first_frame", "visual", "speech", "sounds",
                   "prompt", "extra"],
        "default_version": DEFAULT_VERSION,
        "default_mode": DEFAULT_MODE,
    },
    "status": {
        "description": "Check the local ID-LoRA install (uv + repo + checkpoint)",
        "params": [],
    },
}


async def demo():
    """Demo ID-LoRA handler — reports availability without running inference."""
    logger.info("ID-LoRA Handler Demo")
    handler = IDLoRAOrchestrationHandler()
    status = await handler.handle_status()
    logger.info(f"Install status: {json.dumps(status, indent=2)}")
    if not status.get("available"):
        logger.info("ID-LoRA not runnable here — expected in the cloud sandbox "
                    "(needs uv, the repo, a CUDA GPU with 24GB+ VRAM, and a "
                    "downloaded checkpoint).")
        logger.info("On the GPU box: git clone https://github.com/ID-LoRA/ID-LoRA.git, "
                    "uv sync --frozen, bash scripts/download_models.sh, "
                    "set IDLORA_LORA_PATH.")
        logger.info("✅ Demo complete (degraded path verified)")
        return
    logger.info("Note: outputs are synthetic media — get consent, label as AI-generated.")
    sample = build_prompt(
        visual="A medium shot of a woman with short black hair in a white blouse, "
               "speaking calmly in a modern kitchen with warm lighting.",
        speech="Welcome to RHYTHMIX — your music, reimagined.",
        sounds="Calm, conversational tone, close to the mic. Soft ambient room tone.",
    )
    logger.info(f"Example prompt that would be sent:\n{sample}")
    logger.info("✅ Demo complete")


if __name__ == "__main__":
    asyncio.run(demo())
