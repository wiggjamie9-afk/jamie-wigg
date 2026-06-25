#!/usr/bin/env python3
"""
RHYTHMIX — Engine registry & dispatcher (the wiring).

Every handler in handlers/ knows how to talk to ONE engine, but nothing knew
about all of them. This is that one place: it maps task types to engines, probes
which engines are actually up, and dispatches a task to the first available
engine for its type (local/free engines preferred, hosted as fallback).

It's deliberately resilient: each handler is imported and instantiated in its
own try/except, so one broken or dependency-heavy engine can't take down the
whole factory. Nothing here needs a running engine to import — `status` probes
live availability and reports honestly what's up and what's down.

CLI:
    python automation/registry.py status     # what have I got? probe every engine
    python automation/registry.py routes      # show task-type -> engine routing
    python automation/registry.py dispatch text_generation --prompt "hi"
"""

import sys
import json
import asyncio
import argparse
import importlib
import logging
from typing import Dict, List, Optional, Tuple, Any

logging.basicConfig(level=logging.WARNING)
logger = logging.getLogger("registry")

# engine name -> (module under handlers/, OrchestrationHandler class)
ENGINES: Dict[str, Tuple[str, str]] = {
    "ollama":     ("ollama_handler",     "OllamaOrchestrationHandler"),
    "zimage":     ("zimage_handler",     "ZImageOrchestrationHandler"),
    "comfyui":    ("comfyui_handler",    "ComfyUIOrchestrationHandler"),
    "idlora":     ("idlora_handler",     "IDLoRAOrchestrationHandler"),
    "modelslab":  ("modelslab_handler",  "ModelsLabOrchestrationHandler"),
    "whispercpp": ("whispercpp_handler", "WhisperCppOrchestrationHandler"),
    "whisperx":   ("whisperx_handler",   "WhisperXOrchestrationHandler"),
    "llava":      ("llava_handler",      "LLaVAOrchestrationHandler"),
    "agent_tars": ("agent_tars_handler", "AgentTarsOrchestrationHandler"),
}

# What each engine is, in one line (for the inventory view).
ENGINE_DESC = {
    "ollama":     "local LLM — planning & copy (free)",
    "zimage":     "local Z-Image-Turbo — fast stills (free, GPU)",
    "comfyui":    "local ComfyUI — images/video/HiDream-O1 (free, GPU)",
    "idlora":     "local ID-LoRA — talking-head video (free, GPU)",
    "modelslab":  "hosted ModelsLab — image/video/audio (no GPU, paid)",
    "whispercpp": "local whisper.cpp — transcription (free)",
    "whisperx":   "local WhisperX — transcription + diarization (free, GPU)",
    "llava":      "local LLaVA — vision / asset QA (free)",
    "agent_tars": "Agent TARS — GUI publish/QA (gated, never auto-posts)",
}

# task type -> ordered preference list of (engine, method).
# First AVAILABLE engine wins, so local/free is tried before hosted/paid.
TASK_ROUTES: Dict[str, List[Tuple[str, str]]] = {
    "plan_workflow":    [("ollama",     "handle_plan_workflow")],
    "text_generation":  [("ollama",     "handle_text_generation")],
    "image_generation": [("zimage",     "handle_image_generation"),
                         ("comfyui",    "handle_text_to_image"),
                         ("modelslab",  "handle_image")],
    "talking_video":    [("idlora",     "handle_talking_video")],
    "video_generation": [("comfyui",    "handle_video_generation"),
                         ("modelslab",  "handle_video")],
    "audio_generation": [("modelslab",  "handle_audio")],
    "transcription":    [("whispercpp", "handle_transcribe"),
                         ("whisperx",   "handle_transcribe")],
    "subtitle":         [("whisperx",   "handle_subtitle_generation")],
    "vision":           [("llava",      "handle_describe")],
    "verify_asset":     [("llava",      "handle_verify_asset")],
    "publish":          [("agent_tars", "handle_publish")],
    "research":         [("agent_tars", "handle_research")],
}


class Factory:
    """Lazily instantiates handlers and routes tasks to available engines."""

    def __init__(self):
        self._handlers: Dict[str, Any] = {}
        self._load_errors: Dict[str, str] = {}

    def handler(self, engine: str) -> Optional[Any]:
        """Get (and cache) a handler instance, or None if it can't load."""
        if engine in self._handlers:
            return self._handlers[engine]
        if engine in self._load_errors:
            return None
        try:
            module_name, class_name = ENGINES[engine]
            mod = importlib.import_module(f"handlers.{module_name}")
            inst = getattr(mod, class_name)()
            self._handlers[engine] = inst
            return inst
        except Exception as e:  # broken import / heavy dep / bad init
            self._load_errors[engine] = str(e)
            return None

    async def probe(self, engine: str) -> Dict:
        """Best-effort availability check for one engine."""
        h = self.handler(engine)
        if h is None:
            return {"available": False, "loaded": False,
                    "error": self._load_errors.get(engine, "not_loaded")}
        # Prefer an explicit status method.
        for m in ("handle_status", "get_system_status"):
            fn = getattr(h, m, None)
            if fn:
                try:
                    res = await fn()
                except Exception as e:
                    return {"available": False, "loaded": True, "error": str(e)}
                avail = res.get("available")
                if avail is None:
                    avail = res.get("status") in ("ok", "running")
                return {"available": bool(avail), "loaded": True, "detail": res}
        # Fallback: a client with is_available().
        client = getattr(h, "client", None)
        if client is not None and hasattr(client, "is_available"):
            try:
                a = bool(client.is_available())
            except Exception as e:
                return {"available": False, "loaded": True, "error": str(e)}
            return {"available": a, "loaded": True}
        return {"available": None, "loaded": True, "detail": "no status probe"}

    async def status_all(self) -> Dict[str, Dict]:
        results = await asyncio.gather(*[self.probe(e) for e in ENGINES])
        return dict(zip(ENGINES, results))

    async def dispatch(self, task_type: str, **kwargs) -> Dict:
        """Run a task on the first available engine for its type."""
        routes = TASK_ROUTES.get(task_type)
        if not routes:
            return {"status": "failed", "error": f"unknown_task_type:{task_type}",
                    "known": sorted(TASK_ROUTES)}
        tried = []
        for engine, method in routes:
            probe = await self.probe(engine)
            if not probe.get("available"):
                tried.append({"engine": engine, "available": probe.get("available"),
                              "error": probe.get("error")})
                continue
            h = self.handler(engine)
            fn = getattr(h, method, None)
            if fn is None:
                tried.append({"engine": engine, "error": f"no_method:{method}"})
                continue
            try:
                result = await fn(**kwargs)
            except TypeError as e:
                return {"status": "failed", "engine": engine,
                        "error": f"bad_args_for_{engine}.{method}: {e}"}
            except Exception as e:
                return {"status": "failed", "engine": engine, "error": str(e)}
            if isinstance(result, dict):
                result.setdefault("engine", engine)
            return result
        return {"status": "failed", "error": "no_available_engine",
                "task_type": task_type, "tried": tried,
                "hint": "Start a local engine or set a hosted key; "
                        "run `python automation/registry.py status`."}


# --------------------------------------------------------------------------- #
# CLI
# --------------------------------------------------------------------------- #

def _mark(avail: Optional[bool]) -> str:
    return {True: "UP  ", False: "down", None: "?   "}[avail]


async def _cmd_status() -> int:
    factory = Factory()
    statuses = await factory.status_all()
    print("\nRHYTHMIX factory — engine status\n" + "-" * 64)
    up = 0
    for engine in ENGINES:
        s = statuses[engine]
        avail = s.get("available")
        up += 1 if avail else 0
        note = "" if s.get("loaded", True) else f"(load error: {s.get('error')})"
        if avail is False and s.get("error"):
            note = f"({s['error'][:40]})"
        print(f"  [{_mark(avail)}] {engine:<11} {ENGINE_DESC[engine]:<46}{note}")
    print("-" * 64)
    print(f"  {up}/{len(ENGINES)} engines reachable right now. "
          f"All wired; the rest light up when started on a capable host.\n")
    return 0


def _cmd_routes() -> int:
    print("\nRHYTHMIX factory — task routing (first available wins)\n" + "-" * 64)
    for task, routes in TASK_ROUTES.items():
        chain = "  ->  ".join(f"{e}.{m}" for e, m in routes)
        print(f"  {task:<18} {chain}")
    print("-" * 64 + "\n")
    return 0


async def _cmd_dispatch(task_type: str, kv: Dict[str, str]) -> int:
    factory = Factory()
    result = await factory.dispatch(task_type, **kv)
    print(json.dumps(result, indent=2, default=str))
    return 0 if result.get("status") not in ("failed",) else 1


def main():
    parser = argparse.ArgumentParser(description="RHYTHMIX engine registry")
    sub = parser.add_subparsers(dest="cmd")
    sub.add_parser("status", help="probe every engine (what have I got?)")
    sub.add_parser("routes", help="show task-type -> engine routing")
    d = sub.add_parser("dispatch", help="run a task on the first available engine")
    d.add_argument("task_type")
    d.add_argument("--prompt", default=None)
    d.add_argument("--brief", default=None)
    args, extra = parser.parse_known_args()

    if args.cmd == "routes":
        sys.exit(_cmd_routes())
    if args.cmd == "dispatch":
        kv = {}
        if args.prompt is not None:
            kv["prompt"] = args.prompt
        if args.brief is not None:
            kv["brief"] = args.brief
        sys.exit(asyncio.run(_cmd_dispatch(args.task_type, kv)))
    # default: status
    sys.exit(asyncio.run(_cmd_status()))


if __name__ == "__main__":
    main()
