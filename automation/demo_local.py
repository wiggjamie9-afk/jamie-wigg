#!/usr/bin/env python3
"""
RHYTHMIX — Local end-to-end loop (no Redis, no paid API).

This is the ONE thing that actually runs. It proves the orchestration loop with
only pieces that work locally and for free:

    brief (text)  ->  local Ollama plans it  ->  in-memory queue  ->
    each task executed locally  ->  results printed

Text tasks run on Ollama; image tasks run on a local Z-Image-Turbo MCP server if
one is up (otherwise they're honestly recorded as skipped). Both are local and
free — no Redis, no paid API, no per-asset cloud cost.

The production orchestrator (orchestrator.py) needs a Redis server AND a paid
ANTHROPIC_API_KEY before it can start. This demo deliberately needs neither — it
swaps the Redis queue for an in-memory deque and the Claude calls for local
Ollama. Same shape (plan -> enqueue -> execute -> complete), zero cost.

Run it:
    1. Install Ollama:   curl -fsSL https://ollama.com/install.sh | sh
    2. Pull a model:     ollama pull llama3.2
    3. Start the server: ollama serve   (usually auto-starts)
    4. Run this:         python automation/demo_local.py "Write a 3-tweet
                         launch thread for RHYTHMIX"

With no brief argument it uses a default. If Ollama isn't running it prints the
exact fix and exits cleanly — nothing else is required.
"""

import sys
import json
import asyncio
import logging
from collections import deque
from datetime import datetime

# Local handlers — dependency-free (urllib only).
from handlers.ollama_handler import OllamaOrchestrationHandler, local_llm_available
from handlers.zimage_handler import ZImageOrchestrationHandler

logging.basicConfig(level=logging.INFO, format="%(asctime)s  %(message)s")
logger = logging.getLogger("demo_local")

DEFAULT_BRIEF = "Write a punchy 3-part launch thread announcing RHYTHMIX, an AI music platform."

# Task types this local demo can execute for free, and the local engine for each:
#   text_generation  -> Ollama        (always, if the server is up)
#   image_generation -> Z-Image-Turbo (only if its MCP server is up; else skipped)
LOCAL_TEXT = {"text_generation"}
LOCAL_IMAGE = {"image_generation"}


async def run(brief: str) -> int:
    handler = OllamaOrchestrationHandler()
    image_handler = ZImageOrchestrationHandler()
    image_up = image_handler.client.is_available()

    if not local_llm_available():
        status = await handler.handle_status()
        logger.info("Ollama is not running — this loop needs a local model server.")
        logger.info(json.dumps(status, indent=2))
        logger.info("Fix: curl -fsSL https://ollama.com/install.sh | sh  &&  "
                    "ollama pull llama3.2  &&  ollama serve")
        return 1

    logger.info(f"BRIEF: {brief}")

    # 1) PLAN — local LLM turns the brief into a structured workflow.
    logger.info("── Planning (local Ollama) ─────────────────────────────")
    plan_result = await handler.handle_plan_workflow(brief)
    if plan_result.get("status") != "completed":
        logger.info(f"Planning failed: {json.dumps(plan_result, indent=2)}")
        return 1

    workflow = plan_result["workflow"]
    tasks = workflow.get("tasks", [])
    logger.info(f"Workflow: {workflow.get('workflow_name', '(unnamed)')} "
                f"— {len(tasks)} task(s), est. "
                f"{workflow.get('estimated_duration_minutes', '?')} min")
    logger.info(f"Local image engine (Z-Image-Turbo): "
                f"{'up' if image_up else 'down — image tasks will be skipped'}")

    # 2) ENQUEUE — in-memory queue stands in for Redis.
    queue = deque(tasks)
    completed, skipped = [], []

    # 3) EXECUTE — drain the queue, run what we can locally.
    logger.info("── Executing ───────────────────────────────────────────")
    while queue:
        task = queue.popleft()
        ttype = task.get("type", "text_generation")
        tid = task.get("task_id", "T?")

        prompt = _task_prompt(task, brief)

        if ttype in LOCAL_TEXT:
            logger.info(f"  [{tid}] {ttype}: generating (Ollama)…")
            result = await handler.handle_text_generation(prompt)
            if result.get("status") == "completed":
                logger.info(f"  [{tid}] done in {result.get('duration_ms', 0):.0f}ms")
                completed.append({"task_id": tid, "type": ttype,
                                  "output": result["output"]})
            else:
                logger.info(f"  [{tid}] failed: {result.get('error')}")

        elif ttype in LOCAL_IMAGE and image_up:
            logger.info(f"  [{tid}] {ttype}: rendering (Z-Image-Turbo)…")
            result = await image_handler.handle_image_generation(prompt)
            if result.get("status") == "completed":
                paths = result.get("output") or []
                logger.info(f"  [{tid}] done — {len(paths)} image(s)")
                completed.append({"task_id": tid, "type": ttype,
                                  "output": ", ".join(paths) or result.get("text", "")})
            else:
                logger.info(f"  [{tid}] failed: {result.get('error')}")

        else:
            # Needs ComfyUI/Replicate/etc., or the local image server is down —
            # out of scope for this free loop. Record it honestly, don't fake it.
            reason = ("local image server down" if ttype in LOCAL_IMAGE
                      else "needs an external service")
            logger.info(f"  [{tid}] {ttype}: skipped ({reason})")
            skipped.append({"task_id": tid, "type": ttype})
            continue

    # 4) REPORT.
    logger.info("── Results ─────────────────────────────────────────────")
    for c in completed:
        logger.info(f"\n[{c['task_id']}] {c['type']}\n{c['output']}\n")
    logger.info(f"Completed {len(completed)} locally, "
                f"skipped {len(skipped)} (need external services). "
                f"Cost: $0.00")
    return 0


def _task_prompt(task: dict, brief: str) -> str:
    """Build a concrete prompt from a planned task's input."""
    inp = task.get("input", {}) or {}
    # Prefer an explicit prompt/description from the planner; fall back to brief.
    for key in ("prompt", "description", "text", "content"):
        if inp.get(key):
            return str(inp[key])
    return f"For this overall goal: \"{brief}\" — produce the deliverable for " \
           f"the step \"{task.get('task_id', 'this step')}\"."


def main():
    brief = " ".join(sys.argv[1:]).strip() or DEFAULT_BRIEF
    rc = asyncio.run(run(brief))
    sys.exit(rc)


if __name__ == "__main__":
    main()
