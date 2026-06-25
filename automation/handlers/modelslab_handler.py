#!/usr/bin/env python3
"""
ModelsLab Integration Handler
Hosted, cloud multi-modal generation for the orchestrator — the empire's
"no-GPU" path.

Most of the stack is local-GPU (ComfyUI, ID-LoRA, Z-Image-Turbo): zero per-asset
cost, but it needs a real GPU box. ModelsLab is the opposite trade — a hosted API
(image, video, audio, 3D, editing across 10,000+ models) that runs from anywhere,
including an iPhone with no desktop. That makes it the practical fallback for the
iPhone-driven workflow in CREATIVE-AI-STACK.md, and the scale path when the local
box is busy. Cost lives on the user's ModelsLab key, not our infra.

Like the Ollama/Z-Image handlers it's deliberately dependency-free: HTTP via
urllib from the stdlib. It degrades gracefully — every entry point returns a
structured error naming the fix when MODELSLAB_API_KEY is unset — and it handles
ModelsLab's async pattern (jobs that return status="processing" with a fetch id)
by polling the fetch endpoint until the asset is ready.

Set the key in .env at the repo root:
    MODELSLAB_API_KEY=...        # from modelslab.com/dashboard
"""

import os
import json
import logging
import asyncio
import urllib.request
import urllib.error
from dataclasses import dataclass, field
from datetime import datetime
from typing import Dict, List, Optional, Any

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

DEFAULT_BASE = os.environ.get("MODELSLAB_BASE", "https://modelslab.com/api/v6")

# Endpoint paths per modality (v6). Centralised so they're easy to adjust.
ENDPOINTS = {
    "image": "/realtime/text2img",
    "video": "/video/text2video_ultra",
    "audio": "/voice/text_to_audio",
    "fetch_image": "/realtime/fetch",
    "fetch_video": "/video/fetch",
}


@dataclass
class MLResult:
    """Result of a ModelsLab generation."""
    modality: str
    status: str
    output: List[str] = field(default_factory=list)   # asset URLs
    job_id: Optional[str] = None
    eta: Optional[float] = None
    error: str = ""
    created_at: str = ""

    def __post_init__(self):
        if not self.created_at:
            self.created_at = datetime.now().isoformat()

    def to_dict(self) -> Dict:
        return {"modality": self.modality, "status": self.status,
                "output": self.output, "job_id": self.job_id, "eta": self.eta,
                "error": self.error, "created_at": self.created_at}


class ModelsLabClient:
    """Dependency-free client for the ModelsLab v6 REST API (urllib only)."""

    def __init__(self, api_key: Optional[str] = None, base: str = DEFAULT_BASE,
                 timeout: int = 120):
        self.api_key = api_key or os.environ.get("MODELSLAB_API_KEY")
        self.base = base.rstrip("/")
        self.timeout = timeout

    def is_available(self) -> bool:
        """No network call — just whether we hold an API key to authenticate."""
        return bool(self.api_key)

    def _fix_hint(self) -> Dict:
        return {"error": "modelslab_no_api_key",
                "hint": "Set MODELSLAB_API_KEY in .env (get it from "
                        "modelslab.com/dashboard). Egress to modelslab.com is "
                        "blocked from the cloud sandbox — run on a host with "
                        "open network (e.g. the Mac)."}

    def _post(self, path: str, body: Dict) -> Dict:
        data = json.dumps(body).encode("utf-8")
        req = urllib.request.Request(
            self.base + path, data=data,
            headers={"Content-Type": "application/json"}, method="POST")
        with urllib.request.urlopen(req, timeout=self.timeout) as resp:
            return json.loads(resp.read().decode("utf-8"))

    async def _apost(self, path: str, body: Dict) -> Dict:
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(None, lambda: self._post(path, body))

    @staticmethod
    def _extract_urls(payload: Dict) -> List[str]:
        out = payload.get("output") or payload.get("future_links") or []
        if isinstance(out, str):
            return [out]
        return [u for u in out if isinstance(u, str)]

    async def _poll(self, fetch_path: str, job_id: str, eta: float,
                    max_wait: int = 300) -> MLResult:
        """Poll a ModelsLab fetch endpoint until the async job is ready."""
        waited, interval = 0.0, max(2.0, min(eta or 5.0, 10.0))
        while waited < max_wait:
            await asyncio.sleep(interval)
            waited += interval
            try:
                payload = await self._apost(f"{fetch_path}/{job_id}",
                                            {"key": self.api_key})
            except (urllib.error.URLError, OSError, ValueError) as e:
                return MLResult(modality="?", status="failed", error=str(e))
            status = payload.get("status")
            if status == "success":
                return MLResult(modality="?", status="completed",
                                output=self._extract_urls(payload), job_id=job_id)
            if status in ("failed", "error"):
                return MLResult(modality="?", status="failed", job_id=job_id,
                                error=str(payload.get("message", payload)))
        return MLResult(modality="?", status="timeout", job_id=job_id)

    async def generate(self, modality: str, body: Dict) -> MLResult:
        """Submit a generation and resolve it (handling the async fetch path)."""
        if not self.is_available():
            return MLResult(modality=modality, status="failed",
                            error=json.dumps(self._fix_hint()))
        path = ENDPOINTS.get(modality)
        if not path:
            return MLResult(modality=modality, status="failed",
                            error=f"unknown_modality:{modality}")
        body = {"key": self.api_key, **body}
        try:
            payload = await self._apost(path, body)
        except (urllib.error.URLError, OSError, ValueError) as e:
            return MLResult(modality=modality, status="failed", error=str(e))

        status = payload.get("status")
        if status == "success":
            return MLResult(modality=modality, status="completed",
                            output=self._extract_urls(payload))
        if status == "processing":
            job_id = payload.get("id") or payload.get("request_id")
            eta = payload.get("eta", 5.0)
            fetch_path = ENDPOINTS.get(f"fetch_{modality}", ENDPOINTS["fetch_image"])
            result = await self._poll(fetch_path, str(job_id), eta)
            result.modality = modality
            return result
        return MLResult(modality=modality, status="failed",
                        error=str(payload.get("message", payload)))


class ModelsLabOrchestrationHandler:
    """Handle hosted ModelsLab generation tasks in the orchestrator."""

    def __init__(self, api_key: Optional[str] = None):
        self.client = ModelsLabClient(api_key=api_key)

    async def handle_image(self, prompt: str, width: int = 1024, height: int = 1024,
                           samples: int = 1, model_id: Optional[str] = None,
                           negative_prompt: str = "") -> Dict:
        body: Dict[str, Any] = {"prompt": prompt, "width": str(width),
                                "height": str(height), "samples": str(samples),
                                "negative_prompt": negative_prompt}
        if model_id:
            body["model_id"] = model_id
        return (await self.client.generate("image", body)).to_dict()

    async def handle_video(self, prompt: str, negative_prompt: str = "",
                           model_id: Optional[str] = None) -> Dict:
        body: Dict[str, Any] = {"prompt": prompt, "negative_prompt": negative_prompt}
        if model_id:
            body["model_id"] = model_id
        return (await self.client.generate("video", body)).to_dict()

    async def handle_audio(self, prompt: str, voice_id: Optional[str] = None) -> Dict:
        body: Dict[str, Any] = {"prompt": prompt}
        if voice_id:
            body["voice_id"] = voice_id
        return (await self.client.generate("audio", body)).to_dict()

    async def handle_status(self) -> Dict:
        return {"status": "ok", "engine": "modelslab",
                "available": self.client.is_available(),
                "base": self.client.base,
                "has_api_key": bool(self.client.api_key)}

    async def handle_task(self, payload: Dict) -> Dict:
        """Orchestrator entry point. Dispatch on payload['action']."""
        action = payload.get("action", "image")
        if action == "status":
            return await self.handle_status()
        prompt = payload.get("prompt", "")
        if action in ("video", "text2video"):
            return await self.handle_video(prompt, payload.get("negative_prompt", ""),
                                           payload.get("model_id"))
        if action in ("audio", "tts", "music"):
            return await self.handle_audio(prompt, payload.get("voice_id"))
        if not prompt:
            return {"status": "failed", "error": "no_prompt"}
        return await self.handle_image(
            prompt, width=payload.get("width", 1024),
            height=payload.get("height", 1024),
            samples=payload.get("samples", 1), model_id=payload.get("model_id"),
            negative_prompt=payload.get("negative_prompt", ""))


# ModelsLab task templates (parallels the other handlers)
MODELSLAB_TEMPLATES = {
    "image": {"description": "Hosted text-to-image (10,000+ models incl. FLUX)",
              "params": ["prompt", "width", "height", "samples", "model_id",
                         "negative_prompt"]},
    "video": {"description": "Hosted text-to-video",
              "params": ["prompt", "negative_prompt", "model_id"]},
    "audio": {"description": "Hosted text-to-audio / TTS / voice clone",
              "params": ["prompt", "voice_id"]},
    "status": {"description": "Check ModelsLab key presence", "params": []},
}


async def demo():
    """Demo ModelsLab handler — reports key presence without spending credits."""
    logger.info("ModelsLab Handler Demo")
    handler = ModelsLabOrchestrationHandler()
    status = await handler.handle_status()
    logger.info(f"Status: {json.dumps(status, indent=2)}")
    if not status.get("available"):
        logger.info("No MODELSLAB_API_KEY — set it in .env. Note: modelslab.com "
                    "egress is blocked from the cloud sandbox; run on the Mac.")
        logger.info("✅ Demo complete (degraded path verified)")
        return
    logger.info("Key present — a real call would spend ModelsLab credits; skipping.")
    logger.info("✅ Demo complete")


if __name__ == "__main__":
    asyncio.run(demo())
