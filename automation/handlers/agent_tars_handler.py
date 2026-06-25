#!/usr/bin/env python3
"""
Agent TARS Integration Handler
GUI-agent automation for the orchestrator — the empire's "hands".

The rest of the stack generates (ComfyUI/Replicate), narrates (whisper.cpp/X),
and sees (LLaVA). Agent TARS *acts*: a vision-language GUI agent that drives a
real browser/desktop by screenshotting and clicking/typing to complete a
natural-language instruction. That fills the gap APIs can't:

  1. GUI-driven publishing — post to platforms with no usable API, the missing
     piece of the Content Automation SaaS (Option C).
  2. Cross-browser visual QA — "open studio.html in Safari, screenshot the
     pricing section" — catch layout breaks before launch.
  3. Browser research / data gathering for the RESEARCH task type.

License: Apache-2.0 — commercially clean (unlike LLaVA-Med). Best click
accuracy comes from a true VLM (Doubao / Seed-1.5-VL); Anthropic works as the
default since ANTHROPIC_API_KEY is already in this stack.

This handler shells out to the `agent-tars` CLI (or `npx @agent-tars/cli`).
The exact CLI flags shift between versions — see SETUP-AGENT-TARS.md — so the
invocation is built in one place (`_build_command`) for easy adjustment, and
every entry point degrades gracefully when Node/the CLI isn't installed.
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

DEFAULT_PROVIDER = "anthropic"
DEFAULT_MODEL = "claude-3-7-sonnet-latest"


@dataclass
class TarsRun:
    """Result of an Agent TARS run."""
    instruction: str
    status: str
    output: str = ""
    artifacts: List[str] = field(default_factory=list)
    returncode: int = 0
    created_at: str = ""

    def __post_init__(self):
        if not self.created_at:
            self.created_at = datetime.now().isoformat()

    def to_dict(self) -> Dict:
        return {
            "instruction": self.instruction,
            "status": self.status,
            "output": self.output,
            "artifacts": self.artifacts,
            "returncode": self.returncode,
            "created_at": self.created_at,
        }


class AgentTarsClient:
    """Locate and drive an Agent TARS CLI installation."""

    def __init__(self, provider: str = DEFAULT_PROVIDER, model: str = DEFAULT_MODEL,
                 api_key: Optional[str] = None, api_base_url: Optional[str] = None,
                 headless: bool = True, work_dir: Optional[str] = None):
        self.provider = provider
        self.model = model
        self.api_key = api_key or self._default_api_key(provider)
        self.api_base_url = api_base_url or os.environ.get("AGENT_TARS_BASE_URL")
        self.headless = headless
        self.work_dir = work_dir or os.path.expanduser("~/RHYTHMIX_Empire/output/tars")
        os.makedirs(self.work_dir, exist_ok=True)
        self.launcher = self._discover_launcher()

    @staticmethod
    def _default_api_key(provider: str) -> Optional[str]:
        env_map = {
            "anthropic": "ANTHROPIC_API_KEY",
            "openai": "OPENAI_API_KEY",
            "volcengine": "VOLCENGINE_API_KEY",
        }
        return os.environ.get(env_map.get(provider, ""), None)

    @staticmethod
    def _discover_launcher() -> Optional[List[str]]:
        """Prefer a globally-installed agent-tars, else fall back to npx."""
        direct = shutil.which("agent-tars")
        if direct:
            return [direct]
        if shutil.which("npx"):
            return ["npx", "-y", "@agent-tars/cli@latest"]
        return None

    def is_available(self) -> bool:
        return self.launcher is not None and bool(self.api_key)

    def status(self) -> Dict:
        return {
            "launcher": " ".join(self.launcher) if self.launcher else None,
            "provider": self.provider,
            "model": self.model,
            "has_api_key": bool(self.api_key),
            "headless": self.headless,
            "available": self.is_available(),
        }

    def _fix_hint(self) -> Dict:
        if not self.launcher:
            return {
                "error": "agent_tars_not_installed",
                "hint": "Install Node.js >= 22, then: npm install -g @agent-tars/cli@latest "
                        "(or rely on npx). See SETUP-AGENT-TARS.md.",
            }
        if not self.api_key:
            return {
                "error": "agent_tars_no_api_key",
                "hint": f"Set the API key for provider '{self.provider}' "
                        f"(e.g. ANTHROPIC_API_KEY) in .env.",
            }
        return {"error": "agent_tars_unavailable"}

    def _build_command(self, instruction: str, extra: Optional[List[str]] = None) -> List[str]:
        """Assemble the CLI invocation. Flag layout per SETUP-AGENT-TARS.md."""
        cmd = list(self.launcher)
        # `run` executes a single instruction headlessly; interactive UI is the
        # default without it. Kept here so it's the one spot to adjust per CLI.
        cmd += ["run", instruction]
        cmd += ["--provider", self.provider, "--model", self.model]
        if self.api_key:
            cmd += ["--apiKey", self.api_key]
        if self.api_base_url:
            cmd += ["--apiBaseUrl", self.api_base_url]
        if self.headless:
            cmd += ["--headless"]
        if extra:
            cmd += extra
        return cmd

    async def run(self, instruction: str, timeout: int = 1800,
                  extra: Optional[List[str]] = None) -> TarsRun:
        """Run a single natural-language instruction to completion."""
        if not self.is_available():
            raise RuntimeError(json.dumps(self._fix_hint()))

        cmd = self._build_command(instruction, extra)
        # Don't log the API key.
        safe = [("***" if c == self.api_key else c) for c in cmd]
        logger.info(f"[agent-tars] $ {' '.join(safe)}")

        proc = await asyncio.create_subprocess_exec(
            *cmd,
            cwd=self.work_dir,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
        )
        try:
            stdout, stderr = await asyncio.wait_for(proc.communicate(), timeout=timeout)
        except asyncio.TimeoutError:
            proc.kill()
            return TarsRun(instruction=instruction, status="timeout", returncode=-1)

        out = stdout.decode("utf-8", "replace")
        err = stderr.decode("utf-8", "replace")
        artifacts = self._collect_artifacts()
        return TarsRun(
            instruction=instruction,
            status="completed" if proc.returncode == 0 else "failed",
            output=out or err[-1000:],
            artifacts=artifacts,
            returncode=proc.returncode or 0,
        )

    def _collect_artifacts(self) -> List[str]:
        """List screenshot/output files TARS dropped in the work dir."""
        arts = []
        for name in os.listdir(self.work_dir):
            if name.lower().endswith((".png", ".jpg", ".jpeg", ".pdf", ".json", ".md")):
                arts.append(os.path.join(self.work_dir, name))
        return sorted(arts)


class AgentTarsOrchestrationHandler:
    """Handle GUI-automation tasks in the orchestrator."""

    def __init__(self, provider: str = DEFAULT_PROVIDER, model: str = DEFAULT_MODEL,
                 work_dir: Optional[str] = None):
        self.client = AgentTarsClient(provider=provider, model=model, work_dir=work_dir)

    async def handle_browser_task(self, instruction: str) -> Dict:
        """Run an arbitrary browser/GUI instruction."""
        try:
            result = await self.client.run(instruction)
        except Exception as e:
            return {"status": "failed", **self._err(e)}
        return {"status": result.status, "output": result.output[:4000],
                "artifacts": result.artifacts}

    async def handle_publish(self, platform: str, content: str,
                             media_path: Optional[str] = None) -> Dict:
        """GUI-driven publishing for platforms without a usable API.

        IMPORTANT: this drives a real logged-in browser session. Treat it as an
        outward-facing action — the orchestrator should gate it behind explicit
        approval, not fire it autonomously.
        """
        instruction = (
            f"Open {platform} in the browser (assume the user is already logged in). "
            f"Create a new post with this content:\n\"{content}\"\n"
        )
        if media_path:
            instruction += f"Attach the media file located at: {media_path}\n"
        instruction += ("Do NOT submit/publish yet — fill everything in, take a screenshot "
                        "of the composed post, and stop so a human can review and click publish.")
        try:
            result = await self.client.run(instruction)
        except Exception as e:
            return {"status": "failed", **self._err(e)}
        return {"status": result.status, "platform": platform,
                "review_required": True, "output": result.output[:4000],
                "artifacts": result.artifacts}

    async def handle_visual_qa(self, target: str, checks: str) -> Dict:
        """Cross-browser visual QA — screenshot and report on a page/section."""
        instruction = (
            f"Open {target} in the browser. {checks} "
            "Take screenshots of the relevant sections and describe any visual "
            "issues you notice (layout breaks, overflow, missing images, contrast)."
        )
        try:
            result = await self.client.run(instruction)
        except Exception as e:
            return {"status": "failed", **self._err(e)}
        return {"status": result.status, "target": target,
                "report": result.output[:4000], "artifacts": result.artifacts}

    async def handle_research(self, query: str) -> Dict:
        """Browser-based research for the RESEARCH task type."""
        instruction = (
            f"Research this on the web and summarize findings with sources: {query}. "
            "Save a short markdown summary to the working directory."
        )
        try:
            result = await self.client.run(instruction)
        except Exception as e:
            return {"status": "failed", **self._err(e)}
        return {"status": result.status, "query": query,
                "summary": result.output[:4000], "artifacts": result.artifacts}

    async def handle_status(self) -> Dict:
        return {"status": "ok", **self.client.status()}

    async def handle_task(self, payload: Dict) -> Dict:
        """Orchestrator entry point. Dispatch on payload['action']."""
        action = payload.get("action", "browser")
        if action == "status":
            return await self.handle_status()
        if action == "publish":
            return await self.handle_publish(
                payload.get("platform", "the target platform"),
                payload.get("content", ""),
                payload.get("media_path"),
            )
        if action in ("qa", "visual_qa"):
            return await self.handle_visual_qa(
                payload.get("target", ""), payload.get("checks", "Review the page."),
            )
        if action == "research":
            return await self.handle_research(payload.get("query", ""))
        # default: arbitrary instruction
        instruction = payload.get("instruction") or payload.get("query", "")
        if not instruction:
            return {"status": "failed", "error": "no_instruction"}
        return await self.handle_browser_task(instruction)

    def _err(self, e: Exception) -> Dict:
        msg = str(e)
        try:
            parsed = json.loads(msg)
            if isinstance(parsed, dict):
                return parsed
        except (json.JSONDecodeError, ValueError):
            pass
        return {"error": msg}


# Agent TARS task templates (parallels the other handlers)
AGENT_TARS_TEMPLATES = {
    "browser": {
        "description": "Run an arbitrary natural-language browser/GUI instruction",
        "params": ["instruction"],
        "default_provider": DEFAULT_PROVIDER,
    },
    "publish": {
        "description": "GUI-driven publishing (stops before submit for human review)",
        "params": ["platform", "content", "media_path"],
        "default_provider": DEFAULT_PROVIDER,
    },
    "visual_qa": {
        "description": "Cross-browser visual QA with screenshots",
        "params": ["target", "checks"],
        "default_provider": DEFAULT_PROVIDER,
    },
    "research": {
        "description": "Browser-based web research with sourced summary",
        "params": ["query"],
        "default_provider": DEFAULT_PROVIDER,
    },
}


async def demo():
    """Demo Agent TARS handler — reports availability without launching a browser."""
    logger.info("Agent TARS Handler Demo")
    handler = AgentTarsOrchestrationHandler()
    status = await handler.handle_status()
    logger.info(f"Install status: {json.dumps(status, indent=2)}")
    if not status.get("available"):
        logger.info("Agent TARS not runnable here — expected in the cloud sandbox "
                    "(needs Node >= 22 + a provider key, and a real display for GUI runs).")
        logger.info("On the Mac: npm install -g @agent-tars/cli@latest, set ANTHROPIC_API_KEY. "
                    "See SETUP-AGENT-TARS.md.")
    logger.info("Note: publishing runs are gated for human review — never auto-submitted.")
    logger.info("✅ Demo complete")


if __name__ == "__main__":
    asyncio.run(demo())
