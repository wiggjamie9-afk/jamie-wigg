#!/usr/bin/env python3
"""
Z-Image-Turbo Integration Handler
Local, zero-cost text-to-image for the orchestrator — the empire's fast "eyes".

Z-Image-Turbo (Tongyi-MAI, 6B params) is a distilled diffusion transformer tuned
for 8-step generation: sub-second on enterprise GPUs, comfortable in 16GB VRAM on
a consumer card. That makes it the cheap default for stills (thumbnails, scene
plates, social cards) before escalating to the heavier ComfyUI pipeline.

It ships an MCP server exposing a `generate_image` tool. This handler talks to
that server over its HTTP transport (JSON-RPC 2.0, streamable HTTP per the MCP
spec) so the orchestrator can request images the same way it requests Ollama
text. The wire details (endpoint path, the initialize handshake, SSE framing)
shift between MCP server versions, so they're isolated in `ZImageClient._rpc`
for one-spot adjustment — and every entry point degrades gracefully, returning a
structured error dict that names the exact `run_mcp.sh` fix when the server is
down.

Deliberately dependency-free: HTTP via urllib from the stdlib, base64 from the
stdlib. Run the server with:
    cd backend && ./run_mcp.sh --http --port 8001   # -> http://localhost:8001/mcp
"""

import os
import json
import base64
import logging
import asyncio
import urllib.request
import urllib.error
from dataclasses import dataclass, field
from datetime import datetime
from typing import Dict, List, Optional, Any

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

DEFAULT_HOST = os.environ.get("ZIMAGE_HOST", "http://localhost:8001")
DEFAULT_MCP_PATH = os.environ.get("ZIMAGE_MCP_PATH", "/mcp")
# Turbo is tuned for ~8 NFEs; native fidelity up to ~2MP.
DEFAULT_STEPS = int(os.environ.get("ZIMAGE_STEPS", "8"))
DEFAULT_WIDTH = int(os.environ.get("ZIMAGE_WIDTH", "1024"))
DEFAULT_HEIGHT = int(os.environ.get("ZIMAGE_HEIGHT", "1024"))


@dataclass
class ImageResult:
    """Result of a text-to-image call."""
    prompt: str
    status: str
    images: List[str] = field(default_factory=list)   # saved file paths
    text: str = ""                                     # any text the tool returned
    error: str = ""
    created_at: str = ""

    def __post_init__(self):
        if not self.created_at:
            self.created_at = datetime.now().isoformat()

    def to_dict(self) -> Dict:
        return {
            "prompt": self.prompt, "status": self.status, "images": self.images,
            "text": self.text, "error": self.error, "created_at": self.created_at,
        }


class ZImageClient:
    """Dependency-free client for a local Z-Image-Turbo MCP server (urllib only)."""

    def __init__(self, host: str = DEFAULT_HOST, mcp_path: str = DEFAULT_MCP_PATH,
                 out_dir: Optional[str] = None, timeout: int = 600):
        self.host = host.rstrip("/")
        self.mcp_path = "/" + mcp_path.strip("/")
        self.timeout = timeout  # generous: first request may load the model (~5 min)
        self.out_dir = out_dir or os.path.expanduser("~/RHYTHMIX_Empire/output/images")
        os.makedirs(self.out_dir, exist_ok=True)
        self._session_id: Optional[str] = None
        self._rpc_id = 0

    # -- low-level MCP-over-HTTP (one spot to adjust per server version) ----- #

    def _rpc(self, method: str, params: Optional[Dict] = None,
             notify: bool = False) -> Dict:
        """One JSON-RPC 2.0 call over the MCP streamable-HTTP transport.

        Returns the parsed `result` object (empty dict for notifications). Raises
        urllib/OSError/ValueError on transport failure so callers can degrade.
        """
        body: Dict[str, Any] = {"jsonrpc": "2.0", "method": method}
        if params is not None:
            body["params"] = params
        if not notify:
            self._rpc_id += 1
            body["id"] = self._rpc_id

        headers = {
            "Content-Type": "application/json",
            # Streamable HTTP servers reply as JSON or as an SSE stream.
            "Accept": "application/json, text/event-stream",
        }
        if self._session_id:
            headers["Mcp-Session-Id"] = self._session_id

        req = urllib.request.Request(
            self.host + self.mcp_path,
            data=json.dumps(body).encode("utf-8"),
            headers=headers, method="POST",
        )
        with urllib.request.urlopen(req, timeout=self.timeout) as resp:
            # Capture a session id from the initialize response, if offered.
            sid = resp.headers.get("Mcp-Session-Id")
            if sid:
                self._session_id = sid
            raw = resp.read().decode("utf-8", "replace")

        if notify or not raw.strip():
            return {}
        payload = self._parse_body(raw)
        if "error" in payload:
            raise ValueError(f"mcp_error: {payload['error']}")
        return payload.get("result", {})

    @staticmethod
    def _parse_body(raw: str) -> Dict:
        """Parse a JSON body, or pull the last JSON object out of an SSE stream."""
        raw = raw.strip()
        try:
            return json.loads(raw)
        except json.JSONDecodeError:
            pass
        last: Dict = {}
        for line in raw.splitlines():
            line = line.strip()
            if line.startswith("data:"):
                chunk = line[len("data:"):].strip()
                try:
                    last = json.loads(chunk)
                except json.JSONDecodeError:
                    continue
        return last

    def _ensure_session(self) -> None:
        """Run the MCP initialize handshake once per client."""
        if self._session_id is not None:
            return
        self._rpc("initialize", {
            "protocolVersion": "2025-06-18",
            "capabilities": {},
            "clientInfo": {"name": "rhythmix-orchestrator", "version": "0.1.0"},
        })
        # Some servers run sessionless; mark initialized so we don't re-handshake.
        if self._session_id is None:
            self._session_id = "sessionless"
        self._rpc("notifications/initialized", notify=True)

    # -- health ------------------------------------------------------------- #

    def is_available(self) -> bool:
        """True if something answers at the host (any HTTP reply counts as up)."""
        try:
            req = urllib.request.Request(self.host + "/", method="GET")
            urllib.request.urlopen(req, timeout=5)
            return True
        except urllib.error.HTTPError:
            return True  # server reachable, just no root route
        except (urllib.error.URLError, OSError, ValueError):
            return False

    def _fix_hint(self) -> Dict:
        return {
            "error": "zimage_not_running",
            "hint": "Start the Z-Image-Turbo MCP server: "
                    "cd backend && ./run_mcp.sh --http --port 8001  "
                    f"(expected at {self.host}{self.mcp_path}). First request "
                    "may take ~5 min while the 6B model loads. Repo: "
                    "github.com/Aaryan-Kapoor/z-image-turbo",
        }

    # -- inference ---------------------------------------------------------- #

    def _save_content(self, content: List[Dict], stem: str) -> ImageResult:
        """Turn an MCP tool-result content array into saved files + text."""
        images, texts = [], []
        for i, item in enumerate(content or []):
            itype = item.get("type")
            if itype == "image" and item.get("data"):
                ext = (item.get("mimeType", "image/png").split("/")[-1] or "png")
                path = os.path.join(self.out_dir, f"{stem}_{i}.{ext}")
                with open(path, "wb") as f:
                    f.write(base64.b64decode(item["data"]))
                images.append(path)
            elif itype == "text" and item.get("text"):
                texts.append(item["text"])
            elif itype == "resource":
                res = item.get("resource", {})
                if res.get("uri"):
                    texts.append(f"resource: {res['uri']}")
        return ImageResult(prompt=stem, status="completed", images=images,
                           text="\n".join(texts))

    async def generate(self, prompt: str, width: int = DEFAULT_WIDTH,
                       height: int = DEFAULT_HEIGHT, steps: int = DEFAULT_STEPS,
                       guidance_scale: Optional[float] = None,
                       seed: Optional[int] = None) -> ImageResult:
        """Generate an image from a text prompt via the MCP generate_image tool."""
        if not self.is_available():
            return ImageResult(prompt=prompt, status="failed",
                               error=json.dumps(self._fix_hint()))

        args: Dict[str, Any] = {
            "prompt": prompt, "width": width, "height": height,
            "num_inference_steps": steps,
        }
        if guidance_scale is not None:
            args["guidance_scale"] = guidance_scale
        if seed is not None:
            args["seed"] = seed

        def _call() -> Dict:
            self._ensure_session()
            return self._rpc("tools/call",
                             {"name": "generate_image", "arguments": args})

        try:
            result = await asyncio.get_event_loop().run_in_executor(None, _call)
        except Exception as e:  # transport / protocol failure -> degrade
            return ImageResult(prompt=prompt, status="failed", error=str(e))

        if result.get("isError"):
            return ImageResult(prompt=prompt, status="failed",
                               error=str(result.get("content", "tool_error")))
        stem = "img_" + "".join(c if c.isalnum() else "_" for c in prompt[:40]).strip("_")
        out = self._save_content(result.get("content", []), stem or "img")
        out.prompt = prompt
        if not out.images and not out.text:
            out.status = "failed"
            out.error = "no_image_in_response"
        return out


# --------------------------------------------------------------------------- #
# Orchestration handler
# --------------------------------------------------------------------------- #

class ZImageOrchestrationHandler:
    """Handle local text-to-image tasks in the orchestrator."""

    def __init__(self, host: str = DEFAULT_HOST, out_dir: Optional[str] = None):
        self.client = ZImageClient(host=host, out_dir=out_dir)

    async def handle_image_generation(self, prompt: str, **kwargs) -> Dict:
        """Generate an image locally — the cheap, fast counterpart to ComfyUI."""
        if not self.client.is_available():
            return {"status": "failed", **self.client._fix_hint()}
        result = await self.client.generate(
            prompt,
            width=kwargs.get("width", DEFAULT_WIDTH),
            height=kwargs.get("height", DEFAULT_HEIGHT),
            steps=kwargs.get("steps", DEFAULT_STEPS),
            guidance_scale=kwargs.get("guidance_scale"),
            seed=kwargs.get("seed"),
        )
        return {"status": result.status, "engine": "z-image-turbo",
                "output": result.images, "text": result.text,
                "error": result.error or None}

    async def handle_status(self) -> Dict:
        return {"status": "ok", "engine": "z-image-turbo",
                "available": self.client.is_available(),
                "host": self.client.host, "mcp_path": self.client.mcp_path,
                "out_dir": self.client.out_dir}

    async def handle_task(self, payload: Dict) -> Dict:
        """Orchestrator entry point. Dispatch on payload['action']."""
        action = payload.get("action", "generate")
        if action == "status":
            return await self.handle_status()
        prompt = payload.get("prompt") or payload.get("description", "")
        if not prompt:
            return {"status": "failed", "error": "no_prompt"}
        return await self.handle_image_generation(
            prompt, width=payload.get("width", DEFAULT_WIDTH),
            height=payload.get("height", DEFAULT_HEIGHT),
            steps=payload.get("steps", DEFAULT_STEPS),
            guidance_scale=payload.get("guidance_scale"),
            seed=payload.get("seed"),
        )


# Z-Image-Turbo task templates (parallels the other handlers)
ZIMAGE_TEMPLATES = {
    "generate": {
        "description": "Local zero-cost text-to-image (8-step Turbo)",
        "params": ["prompt", "width", "height", "steps", "guidance_scale", "seed"],
        "default_steps": DEFAULT_STEPS,
    },
    "status": {
        "description": "Check the local Z-Image-Turbo MCP server",
        "params": [],
    },
}


async def demo():
    """Demo Z-Image handler — reports availability, renders one image if up."""
    logger.info("Z-Image-Turbo Handler Demo")
    handler = ZImageOrchestrationHandler()
    status = await handler.handle_status()
    logger.info(f"Server status: {json.dumps(status, indent=2)}")
    if not status.get("available"):
        logger.info("No local Z-Image-Turbo server — expected in the cloud sandbox.")
        logger.info("On the Mac: cd backend && ./run_mcp.sh --http --port 8001")
        logger.info("✅ Demo complete (degraded path verified)")
        return
    result = await handler.handle_image_generation(
        "RHYTHMIX album cover, neon waveform, dark glassmorphism, 4k",
        width=1024, height=1024,
    )
    logger.info(f"Generation: {json.dumps(result, indent=2)}")
    logger.info("✅ Demo complete")


if __name__ == "__main__":
    asyncio.run(demo())
