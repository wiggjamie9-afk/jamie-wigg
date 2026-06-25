#!/usr/bin/env python3
"""
RHYTHMIX Empire Orchestrator
Central autonomous agent that dispatches tasks, manages workflows, and coordinates AI services.
"""

import os
import json
import asyncio
import logging
from datetime import datetime
from typing import Dict, List, Optional, Any
from dataclasses import dataclass
from enum import Enum
import redis
import anthropic

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


class TaskPriority(Enum):
    """Task priority levels for queue management."""
    CRITICAL = 1
    HIGH = 2
    NORMAL = 3
    LOW = 4
    BACKGROUND = 5


class TaskType(Enum):
    """Task types the orchestrator can dispatch."""
    VIDEO_GENERATION = "video_generation"
    IMAGE_GENERATION = "image_generation"
    TEXT_GENERATION = "text_generation"
    AUDIO_GENERATION = "audio_generation"
    VOICE_CLONE = "voice_clone"
    WORKFLOW_AUTOMATION = "workflow_automation"
    DATA_PROCESSING = "data_processing"
    API_CALL = "api_call"
    PUBLISH = "publish"
    RESEARCH = "research"
    MONITOR = "monitor"


@dataclass
class Task:
    """Represents a discrete unit of work."""
    id: str
    type: TaskType
    priority: TaskPriority
    payload: Dict[str, Any]
    created_at: datetime
    depends_on: Optional[List[str]] = None
    max_retries: int = 3
    timeout_seconds: int = 3600
    metadata: Dict[str, Any] = None

    def to_dict(self) -> Dict:
        return {
            "id": self.id,
            "type": self.type.value,
            "priority": self.priority.value,
            "payload": self.payload,
            "created_at": self.created_at.isoformat(),
            "depends_on": self.depends_on or [],
            "max_retries": self.max_retries,
            "timeout_seconds": self.timeout_seconds,
            "metadata": self.metadata or {}
        }


class TaskQueue:
    """Redis-backed task queue for distributed execution."""

    def __init__(self, redis_url: str = "redis://localhost:6379"):
        self.redis_client = redis.from_url(redis_url)
        self.queue_key = "orchestrator:task_queue"
        self.active_key = "orchestrator:active_tasks"
        self.completed_key = "orchestrator:completed_tasks"

    def enqueue(self, task: Task) -> str:
        """Add task to queue, respecting priority."""
        score = task.priority.value * 1000 + int(task.created_at.timestamp())
        self.redis_client.zadd(self.queue_key, {json.dumps(task.to_dict()): score})
        logger.info(f"Enqueued task {task.id} with priority {task.priority.name}")
        return task.id

    def dequeue(self) -> Optional[Task]:
        """Pop next task from queue (lowest priority score = highest priority)."""
        result = self.redis_client.zpopmin(self.queue_key, count=1)
        if result:
            task_json, _ = result[0]
            task_dict = json.loads(task_json)
            task = Task(
                id=task_dict["id"],
                type=TaskType(task_dict["type"]),
                priority=TaskPriority(task_dict["priority"]),
                payload=task_dict["payload"],
                created_at=datetime.fromisoformat(task_dict["created_at"]),
                depends_on=task_dict.get("depends_on"),
                max_retries=task_dict.get("max_retries", 3),
                timeout_seconds=task_dict.get("timeout_seconds", 3600),
                metadata=task_dict.get("metadata")
            )
            self.redis_client.hset(self.active_key, task.id, json.dumps(task.to_dict()))
            return task
        return None

    def mark_complete(self, task_id: str, result: Dict) -> None:
        """Mark task as completed."""
        self.redis_client.hdel(self.active_key, task_id)
        completion_record = {
            "task_id": task_id,
            "completed_at": datetime.now().isoformat(),
            "result": result
        }
        self.redis_client.hset(self.completed_key, task_id, json.dumps(completion_record))
        logger.info(f"Completed task {task_id}")

    def mark_failed(self, task_id: str, error: str, retry_count: int = 0) -> Optional[Task]:
        """Mark task as failed and optionally retry."""
        task_json = self.redis_client.hget(self.active_key, task_id)
        if task_json:
            task_dict = json.loads(task_json)
            if retry_count < task_dict.get("max_retries", 3):
                task_dict["retry_count"] = retry_count + 1
                self.redis_client.zadd(
                    self.queue_key,
                    {json.dumps(task_dict): (retry_count + 2) * 1000}
                )
                logger.warning(f"Retrying task {task_id} (attempt {retry_count + 1})")
                return None
            else:
                self.redis_client.hdel(self.active_key, task_id)
                failure_record = {
                    "task_id": task_id,
                    "failed_at": datetime.now().isoformat(),
                    "error": error,
                    "final_retry": retry_count
                }
                self.redis_client.hset(
                    "orchestrator:failed_tasks",
                    task_id,
                    json.dumps(failure_record)
                )
                logger.error(f"Task {task_id} failed permanently: {error}")
                return None
        return None

    def get_queue_status(self) -> Dict:
        """Get current queue statistics."""
        return {
            "pending": self.redis_client.zcard(self.queue_key),
            "active": self.redis_client.hlen(self.active_key),
            "completed": self.redis_client.hlen(self.completed_key),
            "failed": self.redis_client.hlen("orchestrator:failed_tasks")
        }


class ClaudeDispatcher:
    """Dispatches task planning and execution decisions to Claude."""

    def __init__(self, api_key: Optional[str] = None):
        self.client = anthropic.Anthropic(api_key=api_key or os.environ.get("ANTHROPIC_API_KEY"))
        self.model = "claude-opus-4-8"

    async def plan_workflow(self, brief: str, context: Dict = None) -> Dict:
        """Use Claude to plan a complex workflow."""
        context_str = json.dumps(context or {}, indent=2)
        prompt = f"""You are RHYTHMIX's autonomous workflow planner. Given a business brief, plan a complete workflow.

Brief: {brief}

Current Context:
{context_str}

Return a JSON object with:
{{
  "workflow_name": "...",
  "tasks": [
    {{"task_id": "T1", "type": "video_generation", "input": {{}}, "depends_on": []}},
    ...
  ],
  "estimated_duration_minutes": 0,
  "resource_requirements": {{}},
  "success_metrics": []
}}"""

        response = self.client.messages.create(
            model=self.model,
            max_tokens=2048,
            messages=[{"role": "user", "content": prompt}]
        )

        try:
            return json.loads(response.content[0].text)
        except (json.JSONDecodeError, IndexError):
            logger.error("Failed to parse Claude workflow response")
            return {}

    async def decide_next_action(self, current_state: Dict) -> Dict:
        """Use Claude to determine the next action based on current state."""
        state_str = json.dumps(current_state, indent=2)
        prompt = f"""You are RHYTHMIX's autonomous decision engine. Analyze the current state and decide the next action.

Current State:
{state_str}

Respond with JSON:
{{
  "action": "continue|wait|escalate|complete",
  "reason": "...",
  "next_task_type": "...",
  "parameters": {{}}
}}"""

        response = self.client.messages.create(
            model=self.model,
            max_tokens=1024,
            messages=[{"role": "user", "content": prompt}]
        )

        try:
            return json.loads(response.content[0].text)
        except (json.JSONDecodeError, IndexError):
            logger.error("Failed to parse Claude decision response")
            return {"action": "wait", "reason": "parsing_error"}


class RHYTHMIXOrchestrator:
    """Main orchestration engine that coordinates all autonomous operations."""

    def __init__(self, redis_url: str = "redis://localhost:6379"):
        self.queue = TaskQueue(redis_url)
        self.dispatcher = ClaudeDispatcher()
        self.config = self._load_config()
        self.running = False

    def _load_config(self) -> Dict:
        """Load configuration from environment and files."""
        config_path = os.environ.get("ORCHESTRATOR_CONFIG", "automation/config.json")
        if os.path.exists(config_path):
            with open(config_path) as f:
                return json.load(f)
        return {
            "max_concurrent_tasks": 4,
            "polling_interval_seconds": 5,
            "enable_voice_input": True,
            "video_generation_api": "replicate",
            "image_generation_api": "replicate",
            "text_generation_model": "claude-opus-4-8"
        }

    def submit_workflow(self, brief: str, priority: TaskPriority = TaskPriority.NORMAL) -> str:
        """Submit a high-level workflow brief for execution."""
        import uuid
        workflow_id = str(uuid.uuid4())[:8]

        task = Task(
            id=f"workflow-{workflow_id}",
            type=TaskType.WORKFLOW_AUTOMATION,
            priority=priority,
            payload={"brief": brief},
            created_at=datetime.now(),
            timeout_seconds=28800  # 8 hours for full workflows
        )

        self.queue.enqueue(task)
        logger.info(f"Submitted workflow {workflow_id}: {brief[:50]}...")
        return workflow_id

    async def execute_task(self, task: Task) -> Dict:
        """Execute a single task based on its type."""
        logger.info(f"Executing task {task.id} of type {task.type.name}")

        try:
            if task.type == TaskType.VIDEO_GENERATION:
                return await self._handle_video_generation(task)
            elif task.type == TaskType.IMAGE_GENERATION:
                return await self._handle_image_generation(task)
            elif task.type == TaskType.TEXT_GENERATION:
                return await self._handle_text_generation(task)
            elif task.type == TaskType.WORKFLOW_AUTOMATION:
                return await self._handle_workflow_automation(task)
            else:
                return {"status": "unknown_task_type"}
        except Exception as e:
            logger.error(f"Task execution failed: {e}")
            raise

    async def _handle_video_generation(self, task: Task) -> Dict:
        """Dispatch video generation task."""
        payload = task.payload
        logger.info(f"Video generation: {payload.get('prompt', '')[:50]}...")
        return {
            "status": "queued",
            "service": "replicate",
            "prompt": payload.get("prompt"),
            "model": payload.get("model", "hyperframes-default")
        }

    async def _handle_image_generation(self, task: Task) -> Dict:
        """Dispatch image generation task."""
        payload = task.payload
        logger.info(f"Image generation: {payload.get('prompt', '')[:50]}...")
        return {
            "status": "queued",
            "service": "replicate",
            "prompt": payload.get("prompt"),
            "model": payload.get("model", "flux-pro")
        }

    async def _handle_text_generation(self, task: Task) -> Dict:
        """Dispatch text generation to Claude."""
        payload = task.payload
        response = self.dispatcher.client.messages.create(
            model=self.config.get("text_generation_model", "claude-opus-4-8"),
            max_tokens=payload.get("max_tokens", 2048),
            messages=[{"role": "user", "content": payload.get("prompt", "")}]
        )
        return {
            "status": "completed",
            "model": self.config.get("text_generation_model"),
            "output": response.content[0].text
        }

    async def _handle_workflow_automation(self, task: Task) -> Dict:
        """Plan and execute a complete workflow."""
        brief = task.payload.get("brief", "")
        logger.info(f"Planning workflow: {brief[:100]}...")

        workflow = await self.dispatcher.plan_workflow(brief, context=self.config)

        # Enqueue sub-tasks from workflow
        for subtask_def in workflow.get("tasks", []):
            subtask = Task(
                id=subtask_def.get("task_id", f"task-{len(workflow['tasks'])}"),
                type=TaskType(subtask_def.get("type", "text_generation")),
                priority=TaskPriority.NORMAL,
                payload=subtask_def.get("input", {}),
                created_at=datetime.now(),
                depends_on=subtask_def.get("depends_on", [])
            )
            self.queue.enqueue(subtask)

        return {
            "status": "planned",
            "workflow_name": workflow.get("workflow_name"),
            "task_count": len(workflow.get("tasks", [])),
            "estimated_duration_minutes": workflow.get("estimated_duration_minutes", 0)
        }

    async def run(self):
        """Main orchestrator event loop."""
        self.running = True
        logger.info("Starting RHYTHMIX Orchestrator")

        while self.running:
            try:
                status = self.queue.get_queue_status()
                logger.info(f"Queue status: {status}")

                # Process up to max_concurrent_tasks
                max_concurrent = self.config.get("max_concurrent_tasks", 4)
                if status["active"] < max_concurrent and status["pending"] > 0:
                    task = self.queue.dequeue()
                    if task:
                        try:
                            result = await self.execute_task(task)
                            self.queue.mark_complete(task.id, result)
                        except Exception as e:
                            self.queue.mark_failed(task.id, str(e))

                # Check for decisions needed
                if status["pending"] == 0 and status["active"] == 0:
                    decision = await self.dispatcher.decide_next_action({
                        "queue_status": status,
                        "config": self.config
                    })
                    if decision.get("action") == "continue":
                        logger.info("Orchestrator waiting for new input")

                await asyncio.sleep(self.config.get("polling_interval_seconds", 5))
            except Exception as e:
                logger.error(f"Orchestrator error: {e}")
                await asyncio.sleep(10)

    def stop(self):
        """Stop the orchestrator."""
        self.running = False
        logger.info("Stopping RHYTHMIX Orchestrator")


async def main():
    """Run the orchestrator."""
    orchestrator = RHYTHMIXOrchestrator()

    # Example workflow submission
    workflow_id = orchestrator.submit_workflow(
        brief="Create a 60-second RHYTHMIX promo video about AI music generation",
        priority=TaskPriority.HIGH
    )
    logger.info(f"Submitted workflow: {workflow_id}")

    # Run orchestrator
    try:
        await orchestrator.run()
    except KeyboardInterrupt:
        orchestrator.stop()


if __name__ == "__main__":
    asyncio.run(main())
