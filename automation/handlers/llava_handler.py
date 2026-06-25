#!/usr/bin/env python3
"""
LLaVA Vision Handler
Vision-language understanding for the orchestrator — the empire's "eyes".

Everything else in the pipeline *generates* visual content (ComfyUI, Replicate)
or *narrates* it (whisper.cpp/X). Nothing looks at the result. LLaVA closes
that loop. It powers three jobs:

  1. QA / verification — does this generated image actually match the brief?
     Catch off-prompt, garbled-text, or NSFW renders before they publish.
  2. Captioning & alt-text — describe an asset for publishing metadata, SEO,
     and accessibility, in the RHYTHMIX brand voice.
  3. OCR / read-the-screen — pull text out of an image (thumbnails, slides).

Backends, tried in preference order (first that's configured wins):
  - replicate  : hosted LLaVA (yorickvp/llava-13b). No local GPU needed.
  - llamacpp   : local GGUF LLaVA via llama.cpp server (on-device, Mac-friendly).
  - transformers: local HF model (heavy; needs a GPU).

Degrades gracefully: with no backend configured, every entry point returns a
clean error dict naming what to set (REPLICATE_API_TOKEN, LLAVA_SERVER, …).
"""

import os
import json
import base64
import logging
import asyncio
from dataclasses import dataclass
from datetime import datetime
from typing import Dict, List, Optional, Any

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Default hosted model on Replicate (version-pinned at call time by the SDK).
DEFAULT_REPLICATE_MODEL = "yorickvp/llava-13b"


@dataclass
class VisionResult:
    """Result of a single vision query."""
    image: str
    prompt: str
    answer: str
    backend: str
    model: str = ""
    created_at: str = ""

    def __post_init__(self):
        if not self.created_at:
            self.created_at = datetime.now().isoformat()

    def to_dict(self) -> Dict:
        return {
            "image": self.image,
            "prompt": self.prompt,
            "answer": self.answer,
            "backend": self.backend,
            "model": self.model,
            "created_at": self.created_at,
        }


def _is_url(s: str) -> bool:
    return s.startswith("http://") or s.startswith("https://")


def _data_uri(image_path: str) -> str:
    """Encode a local image as a data URI for backends that need inline bytes."""
    ext = os.path.splitext(image_path)[1].lstrip(".").lower() or "png"
    if ext == "jpg":
        ext = "jpeg"
    with open(image_path, "rb") as f:
        b64 = base64.b64encode(f.read()).decode("ascii")
    return f"data:image/{ext};base64,{b64}"


class LLaVAClient:
    """Backend-agnostic LLaVA client."""

    def __init__(self, backend: str = "auto",
                 replicate_model: str = DEFAULT_REPLICATE_MODEL,
                 llamacpp_server: Optional[str] = None,
                 hf_model: str = "llava-hf/llava-1.5-7b-hf"):
        self.replicate_model = replicate_model
        self.llamacpp_server = llamacpp_server or os.environ.get("LLAVA_SERVER")
        self.hf_model = hf_model
        self.backend = backend if backend != "auto" else self._auto_backend()

    def _auto_backend(self) -> Optional[str]:
        if os.environ.get("REPLICATE_API_TOKEN"):
            return "replicate"
        if self.llamacpp_server:
            return "llamacpp"
        try:
            import torch  # noqa: F401
            import transformers  # noqa: F401
            return "transformers"
        except ImportError:
            return None

    def is_available(self) -> bool:
        return self.backend is not None

    def _fix_hint(self) -> Dict:
        return {
            "error": "llava_no_backend",
            "hint": "Configure one of: REPLICATE_API_TOKEN (hosted), "
                    "LLAVA_SERVER=http://127.0.0.1:8080 (local llama.cpp GGUF LLaVA), "
                    "or install transformers+torch for a local HF model.",
        }

    async def _run(self, fn, *args, **kwargs):
        return await asyncio.get_event_loop().run_in_executor(None, lambda: fn(*args, **kwargs))

    async def query(self, image: str, prompt: str,
                    max_tokens: int = 512, temperature: float = 0.2) -> VisionResult:
        """Ask a question about an image. `image` may be a URL or local path."""
        if not self.is_available():
            raise RuntimeError(json.dumps(self._fix_hint()))

        if self.backend == "replicate":
            answer, model = await self._query_replicate(image, prompt, max_tokens, temperature)
        elif self.backend == "llamacpp":
            answer, model = await self._query_llamacpp(image, prompt, max_tokens, temperature)
        elif self.backend == "transformers":
            answer, model = await self._query_transformers(image, prompt, max_tokens, temperature)
        else:
            raise RuntimeError(json.dumps(self._fix_hint()))

        return VisionResult(image=image, prompt=prompt, answer=answer.strip(),
                            backend=self.backend, model=model)

    # -- backends ----------------------------------------------------------- #

    async def _query_replicate(self, image, prompt, max_tokens, temperature):
        import replicate
        image_input = image if _is_url(image) else _data_uri(image)

        def _call():
            output = replicate.run(
                self.replicate_model,
                input={
                    "image": image_input,
                    "prompt": prompt,
                    "max_tokens": max_tokens,
                    "temperature": temperature,
                },
            )
            # Replicate streams tokens as an iterator of strings.
            if isinstance(output, (list, tuple)):
                return "".join(str(x) for x in output)
            if hasattr(output, "__iter__") and not isinstance(output, str):
                return "".join(str(x) for x in output)
            return str(output)

        answer = await self._run(_call)
        return answer, self.replicate_model

    async def _query_llamacpp(self, image, prompt, max_tokens, temperature):
        """Query a local llama.cpp server exposing the OpenAI-compatible API."""
        import requests
        image_input = image if _is_url(image) else _data_uri(image)
        url = self.llamacpp_server.rstrip("/") + "/v1/chat/completions"
        payload = {
            "max_tokens": max_tokens,
            "temperature": temperature,
            "messages": [{
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt},
                    {"type": "image_url", "image_url": {"url": image_input}},
                ],
            }],
        }

        def _call():
            r = requests.post(url, json=payload, timeout=300)
            r.raise_for_status()
            data = r.json()
            return data["choices"][0]["message"]["content"]

        answer = await self._run(_call)
        return answer, f"llamacpp:{self.llamacpp_server}"

    async def _query_transformers(self, image, prompt, max_tokens, temperature):
        """Local HuggingFace LLaVA. Heavy — loads the model on first call."""
        def _call():
            from transformers import pipeline
            from PIL import Image
            import requests as _rq
            if _is_url(image):
                img = Image.open(_rq.get(image, stream=True, timeout=60).raw)
            else:
                img = Image.open(image)
            pipe = pipeline("image-to-text", model=self.hf_model)
            full_prompt = f"USER: <image>\n{prompt}\nASSISTANT:"
            out = pipe(img, prompt=full_prompt,
                       generate_kwargs={"max_new_tokens": max_tokens})
            text = out[0]["generated_text"] if out else ""
            return text.split("ASSISTANT:")[-1].strip()

        answer = await self._run(_call)
        return answer, self.hf_model


# --------------------------------------------------------------------------- #
# Orchestration handler
# --------------------------------------------------------------------------- #

class LLaVAOrchestrationHandler:
    """Handle vision tasks in the orchestrator."""

    def __init__(self, backend: str = "auto", output_dir: Optional[str] = None):
        self.client = LLaVAClient(backend=backend)
        self.output_dir = output_dir or os.path.expanduser("~/RHYTHMIX_Empire/output/vision")
        os.makedirs(self.output_dir, exist_ok=True)

    async def handle_describe(self, image: str, question: Optional[str] = None) -> Dict:
        """Describe an image, or answer a specific question about it."""
        prompt = question or "Describe this image in detail."
        try:
            result = await self.client.query(image, prompt)
        except Exception as e:
            return {"status": "failed", **self._err(e)}
        return {"status": "completed", "backend": result.backend,
                "answer": result.answer}

    async def handle_verify_asset(self, image: str, brief: str) -> Dict:
        """QA loop: does this generated asset match the brief it was made for?

        Returns a structured verdict the orchestrator can branch on — e.g.
        re-generate when matches=False before the asset ever reaches publish.
        """
        prompt = (
            "You are a strict visual QA reviewer for an AI content pipeline.\n"
            f"The image was generated to match this brief:\n\"{brief}\"\n\n"
            "Answer ONLY with JSON:\n"
            '{"matches": true|false, "confidence": 0.0-1.0, '
            '"issues": ["..."], "has_garbled_text": true|false, '
            '"safe_to_publish": true|false, "notes": "one short sentence"}'
        )
        try:
            result = await self.client.query(image, prompt, temperature=0.0)
        except Exception as e:
            return {"status": "failed", **self._err(e)}

        verdict = self._extract_json(result.answer)
        if verdict is None:
            # Fall back to a permissive verdict but keep the raw answer.
            verdict = {"matches": None, "raw": result.answer}
        return {"status": "completed", "backend": result.backend,
                "image": image, "verdict": verdict}

    async def handle_caption(self, image: str, platform: str = "general") -> Dict:
        """Generate publishing metadata: caption, alt-text, tags — brand voice."""
        prompt = (
            "You are RHYTHMIX's social copywriter. Look at this image and write "
            f"publishing metadata for {platform}. Return ONLY JSON:\n"
            '{"caption": "scroll-stopping caption", '
            '"alt_text": "accessible description", '
            '"hashtags": ["..."], "title": "short title"}'
        )
        try:
            result = await self.client.query(image, prompt, temperature=0.4)
        except Exception as e:
            return {"status": "failed", **self._err(e)}

        meta = self._extract_json(result.answer) or {"caption": result.answer.strip()}
        out_path = os.path.join(
            self.output_dir,
            os.path.splitext(os.path.basename(image))[0] + ".meta.json",
        )
        try:
            with open(out_path, "w") as f:
                json.dump(meta, f, indent=2)
            saved = out_path
        except OSError:
            saved = None  # image may be a URL with an odd basename
        return {"status": "completed", "backend": result.backend,
                "metadata": meta, "saved": saved}

    async def handle_ocr(self, image: str) -> Dict:
        """Read any text visible in the image."""
        prompt = ("Read and transcribe ALL text visible in this image, exactly. "
                  "If there is no text, reply with an empty string.")
        try:
            result = await self.client.query(image, prompt, temperature=0.0)
        except Exception as e:
            return {"status": "failed", **self._err(e)}
        return {"status": "completed", "backend": result.backend,
                "text": result.answer}

    async def handle_status(self) -> Dict:
        return {"status": "ok", "backend": self.client.backend,
                "available": self.client.is_available()}

    async def handle_task(self, payload: Dict) -> Dict:
        """Orchestrator entry point. Dispatch on payload['action']."""
        action = payload.get("action", "describe")
        if action == "status":
            return await self.handle_status()
        image = payload.get("image") or payload.get("image_path")
        if not image:
            return {"status": "failed", "error": "no_image"}
        if action in ("verify", "qa", "verify_asset"):
            return await self.handle_verify_asset(image, payload.get("brief", ""))
        if action in ("caption", "metadata"):
            return await self.handle_caption(image, payload.get("platform", "general"))
        if action == "ocr":
            return await self.handle_ocr(image)
        return await self.handle_describe(image, payload.get("question"))

    # -- helpers ------------------------------------------------------------ #

    @staticmethod
    def _extract_json(text: str) -> Optional[Dict]:
        """Best-effort: pull the first JSON object out of a model reply."""
        if not text:
            return None
        start = text.find("{")
        end = text.rfind("}")
        if start == -1 or end == -1 or end < start:
            return None
        try:
            return json.loads(text[start:end + 1])
        except json.JSONDecodeError:
            return None

    def _err(self, e: Exception) -> Dict:
        msg = str(e)
        # Surface the structured hint if the client raised one.
        try:
            parsed = json.loads(msg)
            if isinstance(parsed, dict):
                return parsed
        except (json.JSONDecodeError, ValueError):
            pass
        return {"error": msg}


# LLaVA task templates (parallels the other handlers)
LLAVA_TEMPLATES = {
    "describe": {
        "description": "Describe an image or answer a question about it",
        "params": ["image", "question"],
        "default_backend": "auto",
    },
    "verify": {
        "description": "QA a generated asset against its brief before publishing",
        "params": ["image", "brief"],
        "default_backend": "auto",
    },
    "caption": {
        "description": "Generate caption / alt-text / hashtags for publishing",
        "params": ["image", "platform"],
        "default_backend": "auto",
    },
    "ocr": {
        "description": "Read text out of an image",
        "params": ["image"],
        "default_backend": "auto",
    },
}


async def demo():
    """Demo LLaVA handler — reports backend availability without a real image."""
    logger.info("LLaVA Vision Handler Demo")
    handler = LLaVAOrchestrationHandler()
    status = await handler.handle_status()
    logger.info(f"Backend status: {json.dumps(status, indent=2)}")
    if not status.get("available"):
        logger.info("No vision backend configured — expected in the bare sandbox.")
        logger.info("Fastest path: set REPLICATE_API_TOKEN to use hosted LLaVA. "
                    "On the Mac: run a llama.cpp GGUF LLaVA server and set "
                    "LLAVA_SERVER=http://127.0.0.1:8080.")
    logger.info("✅ Demo complete")


if __name__ == "__main__":
    asyncio.run(demo())
