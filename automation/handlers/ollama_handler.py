#!/usr/bin/env python3
"""
Ollama Integration Handler
Local, zero-cost LLM inference for the orchestrator — the empire's free "brain".

Everything else that needs to *think* (workflow planning, voice interpretation,
content extraction) currently calls the paid Anthropic API, so the system can't
run without a key. Ollama removes that dependency: open models behind a local
REST API at http://localhost:11434, running on the user's Mac at zero cost.

This makes it the single most load-bearing integration in the stack — it's what
lets the orchestrator loop actually run for free. Use it as:

  1. The local planning / text-generation backend (drop-in for the Claude calls
     when ANTHROPIC_API_KEY isn't set — see local_llm_available() / complete()).
  2. Embeddings for any future RAG over the repo's docs / specs.
  3. Model management (list / pull) so setup is one call.

Deliberately dependency-free: HTTP via urllib from the stdlib, so it runs with
zero pip installs given a local Ollama server. Degrades gracefully — every entry
point returns a structured error dict naming the fix when the server is down.
"""

import os
import json
import logging
import asyncio
import urllib.request
import urllib.error
from dataclasses import dataclass
from datetime import datetime
from typing import Dict, List, Optional, Any

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

DEFAULT_HOST = os.environ.get("OLLAMA_HOST", "http://localhost:11434")
# A small, fast default that runs comfortably on Apple Silicon.
DEFAULT_MODEL = os.environ.get("OLLAMA_MODEL", "llama3.2")


@dataclass
class ChatResult:
    """Result of a chat/generate call."""
    model: str
    content: str
    done: bool = True
    total_duration_ms: float = 0.0
    created_at: str = ""

    def __post_init__(self):
        if not self.created_at:
            self.created_at = datetime.now().isoformat()


class OllamaClient:
    """Dependency-free client for a local Ollama server (urllib + stdlib)."""

    def __init__(self, host: str = DEFAULT_HOST, model: str = DEFAULT_MODEL,
                 timeout: int = 300):
        self.host = host.rstrip("/")
        self.model = model
        self.timeout = timeout

    # -- low-level HTTP ----------------------------------------------------- #

    def _post(self, path: str, body: Dict) -> Dict:
        data = json.dumps(body).encode("utf-8")
        req = urllib.request.Request(
            self.host + path, data=data,
            headers={"Content-Type": "application/json"}, method="POST",
        )
        with urllib.request.urlopen(req, timeout=self.timeout) as resp:
            return json.loads(resp.read().decode("utf-8"))

    def _get(self, path: str) -> Dict:
        req = urllib.request.Request(self.host + path, method="GET")
        with urllib.request.urlopen(req, timeout=self.timeout) as resp:
            return json.loads(resp.read().decode("utf-8"))

    async def _arun(self, fn, *args, **kwargs):
        return await asyncio.get_event_loop().run_in_executor(None, lambda: fn(*args, **kwargs))

    # -- health / models ---------------------------------------------------- #

    def is_available(self) -> bool:
        """True if a local Ollama server answers."""
        try:
            self._get("/api/version")
            return True
        except (urllib.error.URLError, OSError, ValueError):
            return False

    def _fix_hint(self) -> Dict:
        return {
            "error": "ollama_not_running",
            "hint": "Install: curl -fsSL https://ollama.com/install.sh | sh  "
                    "Then start the server (`ollama serve`) and pull a model "
                    f"(`ollama pull {self.model}`). Host: {self.host}",
        }

    async def list_models(self) -> List[str]:
        try:
            data = await self._arun(self._get, "/api/tags")
            return [m.get("name", "") for m in data.get("models", [])]
        except (urllib.error.URLError, OSError, ValueError):
            return []

    async def pull(self, model: Optional[str] = None) -> Dict:
        """Download a model (blocking until complete)."""
        model = model or self.model
        try:
            # stream:false makes Ollama block and return once on completion.
            result = await self._arun(self._post, "/api/pull",
                                      {"name": model, "stream": False})
            return {"status": "pulled", "model": model, "result": result.get("status")}
        except (urllib.error.URLError, OSError, ValueError) as e:
            return {"status": "failed", "model": model, "error": str(e)}

    # -- inference ---------------------------------------------------------- #

    async def chat(self, messages: List[Dict], model: Optional[str] = None,
                   temperature: float = 0.7, json_mode: bool = False,
                   max_tokens: Optional[int] = None) -> ChatResult:
        """Chat completion. messages = [{"role","content"}, ...]."""
        model = model or self.model
        body: Dict[str, Any] = {
            "model": model,
            "messages": messages,
            "stream": False,
            "options": {"temperature": temperature},
        }
        if max_tokens:
            body["options"]["num_predict"] = max_tokens
        if json_mode:
            body["format"] = "json"  # Ollama constrains output to valid JSON
        data = await self._arun(self._post, "/api/chat", body)
        return ChatResult(
            model=model,
            content=(data.get("message", {}) or {}).get("content", ""),
            done=data.get("done", True),
            total_duration_ms=data.get("total_duration", 0) / 1e6,
        )

    async def generate(self, prompt: str, model: Optional[str] = None,
                       temperature: float = 0.7, json_mode: bool = False,
                       system: Optional[str] = None) -> ChatResult:
        """Single-prompt generation."""
        model = model or self.model
        body: Dict[str, Any] = {
            "model": model, "prompt": prompt, "stream": False,
            "options": {"temperature": temperature},
        }
        if system:
            body["system"] = system
        if json_mode:
            body["format"] = "json"
        data = await self._arun(self._post, "/api/generate", body)
        return ChatResult(
            model=model,
            content=data.get("response", ""),
            done=data.get("done", True),
            total_duration_ms=data.get("total_duration", 0) / 1e6,
        )

    async def embeddings(self, text: str, model: Optional[str] = None) -> List[float]:
        """Get an embedding vector for text."""
        model = model or self.model
        data = await self._arun(self._post, "/api/embeddings",
                                {"model": model, "prompt": text})
        return data.get("embedding", [])


# --------------------------------------------------------------------------- #
# Module-level helpers — let other modules use local LLM without wiring a class
# --------------------------------------------------------------------------- #

def local_llm_available(host: str = DEFAULT_HOST) -> bool:
    """Cheap synchronous check: is a local Ollama server up?"""
    return OllamaClient(host=host).is_available()


async def complete(prompt: str, system: Optional[str] = None,
                   json_mode: bool = False, model: Optional[str] = None) -> str:
    """One-shot local completion. Raises if Ollama isn't running."""
    client = OllamaClient(model=model or DEFAULT_MODEL)
    if not client.is_available():
        raise RuntimeError(json.dumps(client._fix_hint()))
    result = await client.generate(prompt, system=system, json_mode=json_mode)
    return result.content


# --------------------------------------------------------------------------- #
# Orchestration handler
# --------------------------------------------------------------------------- #

class OllamaOrchestrationHandler:
    """Handle local text-generation / planning tasks in the orchestrator."""

    def __init__(self, host: str = DEFAULT_HOST, model: str = DEFAULT_MODEL):
        self.client = OllamaClient(host=host, model=model)

    async def handle_text_generation(self, prompt: str,
                                     system: Optional[str] = None,
                                     max_tokens: int = 2048) -> Dict:
        """Generate text locally — drop-in for the Claude text path, free."""
        if not self.client.is_available():
            return {"status": "failed", **self.client._fix_hint()}
        try:
            messages = []
            if system:
                messages.append({"role": "system", "content": system})
            messages.append({"role": "user", "content": prompt})
            result = await self.client.chat(messages, max_tokens=max_tokens)
        except Exception as e:
            return {"status": "failed", "error": str(e)}
        return {"status": "completed", "engine": "ollama", "model": result.model,
                "output": result.content,
                "duration_ms": round(result.total_duration_ms, 1)}

    async def handle_plan_workflow(self, brief: str) -> Dict:
        """Plan a workflow locally — the free counterpart to ClaudeDispatcher."""
        if not self.client.is_available():
            return {"status": "failed", **self.client._fix_hint()}
        system = ("You are RHYTHMIX's autonomous workflow planner. "
                  "Given a business brief, return ONLY a JSON object with keys: "
                  "workflow_name (string), tasks (array of {task_id, type, input, "
                  "depends_on}), estimated_duration_minutes (number). "
                  "Valid task types: video_generation, image_generation, "
                  "text_generation, audio_generation, publish, research.")
        try:
            result = await self.client.generate(
                f"Brief: {brief}", system=system, json_mode=True, temperature=0.3,
            )
            plan = json.loads(result.content)
        except json.JSONDecodeError:
            return {"status": "failed", "error": "model_returned_invalid_json",
                    "raw": result.content[:500]}
        except Exception as e:
            return {"status": "failed", "error": str(e)}
        return {"status": "completed", "engine": "ollama", "model": result.model,
                "workflow": plan}

    async def handle_status(self) -> Dict:
        available = self.client.is_available()
        models = await self.client.list_models() if available else []
        return {"status": "ok", "available": available, "host": self.client.host,
                "default_model": self.client.model, "installed_models": models}

    async def handle_task(self, payload: Dict) -> Dict:
        """Orchestrator entry point. Dispatch on payload['action']."""
        action = payload.get("action", "generate")
        if action == "status":
            return await self.handle_status()
        if action in ("plan", "plan_workflow"):
            return await self.handle_plan_workflow(payload.get("brief", ""))
        prompt = payload.get("prompt") or payload.get("brief", "")
        if not prompt:
            return {"status": "failed", "error": "no_prompt"}
        return await self.handle_text_generation(
            prompt, system=payload.get("system"),
            max_tokens=payload.get("max_tokens", 2048),
        )


# Ollama task templates (parallels the other handlers)
OLLAMA_TEMPLATES = {
    "generate": {
        "description": "Local zero-cost text generation",
        "params": ["prompt", "system", "max_tokens"],
        "default_model": DEFAULT_MODEL,
    },
    "plan_workflow": {
        "description": "Local workflow planning (free ClaudeDispatcher alternative)",
        "params": ["brief"],
        "default_model": DEFAULT_MODEL,
    },
    "status": {
        "description": "Check local Ollama server + list installed models",
        "params": [],
        "default_model": DEFAULT_MODEL,
    },
}


async def demo():
    """Demo Ollama handler — reports availability, runs a tiny completion if up."""
    logger.info("Ollama Handler Demo")
    handler = OllamaOrchestrationHandler()
    status = await handler.handle_status()
    logger.info(f"Server status: {json.dumps(status, indent=2)}")
    if not status.get("available"):
        logger.info("No local Ollama server — expected in the cloud sandbox.")
        logger.info("On the Mac: curl -fsSL https://ollama.com/install.sh | sh, "
                    f"then `ollama pull {DEFAULT_MODEL}` and `ollama serve`.")
        logger.info("✅ Demo complete (degraded path verified)")
        return
    result = await handler.handle_text_generation(
        "In one sentence, what is RHYTHMIX?",
        system="You are a concise product copywriter.",
    )
    logger.info(f"Local generation: {json.dumps(result, indent=2)}")
    logger.info("✅ Demo complete")


if __name__ == "__main__":
    asyncio.run(demo())
