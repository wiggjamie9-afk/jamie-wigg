# RHYTHMIX Empire Orchestrator

Autonomous AI-driven workflow automation system that transforms voice commands and text briefs into complete production pipelines.

## Overview

The RHYTHMIX Empire Orchestrator is a multi-layered automation system that:

- **Listens** to voice commands via Whisper
- **Plans** complex workflows using Claude
- **Executes** tasks across a distributed queue (Redis + Python)
- **Monitors** progress and handles failures
- **Publishes** results to multiple platforms

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   Voice Interface                            │
│              (Whisper + Claude Interpreter)                  │
└─────────────┬───────────────────────────────────────────────┘
              │
              ↓
┌─────────────────────────────────────────────────────────────┐
│              Claude Dispatcher / Planner                     │
│         (Workflow planning, decision-making)                 │
└─────────────┬───────────────────────────────────────────────┘
              │
              ↓
┌─────────────────────────────────────────────────────────────┐
│               Task Queue (Redis-backed)                      │
│        (Priority queue, retry logic, state tracking)         │
└─────────────┬───────────────────────────────────────────────┘
              │
              ↓
┌──────┬──────────┬──────────┬─────────┬───────────────────────┐
│      │          │          │         │                       │
↓      ↓          ↓          ↓         ↓                       ↓
Video  Image      Text      Audio     API                 Workflow
Gen    Gen        Gen       Gen       Calls               Automation
```

## Quick Start

### 1. Installation

```bash
cd /home/user/jamie-wigg
bash automation/setup.sh
```

This will:
- Create a Python virtual environment
- Install all dependencies
- Set up directories
- Create a `.env` file for API keys
- Create startup scripts

### 2. Configuration

Edit `.env` with your API keys:
```bash
ANTHROPIC_API_KEY=sk-...
REPLICATE_API_TOKEN=token-...
ELEVENLABS_API_KEY=...
```

### 3. Start Redis (if using system Redis)

```bash
redis-server --daemonize yes
```

### 4. Run the Orchestrator

```bash
source venv/bin/activate
python3 automation/orchestrator.py
```

Or use the startup script:
```bash
bash automation/start-orchestrator.sh
```

## Usage

### Via Voice Commands

Record voice input and let the orchestrator handle it:

```python
from automation.voice_interface import VoiceInterface
from automation.orchestrator import RHYTHMIXOrchestrator

orchestrator = RHYTHMIXOrchestrator()
voice = VoiceInterface(orchestrator)

# Record 10 seconds of voice input
result = await voice.listen_and_execute(duration=10)
```

Example voice commands:
- "Generate a 60-second video about AI music"
- "Create a TikTok and publish it"
- "Make a 3-part content series"
- "Analyze this topic and create a report"

### Via Text Commands

```python
from automation.orchestrator import RHYTHMIXOrchestrator, TaskPriority

orchestrator = RHYTHMIXOrchestrator()

# Submit a workflow
workflow_id = orchestrator.submit_workflow(
    brief="Create a 60-second RHYTHMIX promo video about music AI",
    priority=TaskPriority.HIGH
)

# Run the orchestrator
await orchestrator.run()
```

### Via Direct Task Submission

```python
from automation.orchestrator import Task, TaskType, TaskPriority
from datetime import datetime

task = Task(
    id="video-001",
    type=TaskType.VIDEO_GENERATION,
    priority=TaskPriority.HIGH,
    payload={
        "prompt": "60-second promo video about AI-generated music",
        "model": "hyperframes-default",
        "aspect_ratio": "16:9"
    },
    created_at=datetime.now()
)

orchestrator.queue.enqueue(task)
```

## Workflow Types

### Video Promo Workflow
- Script generation
- Voice synthesis (via ElevenLabs)
- Video composition (via HyperFrames)
- Effects and rendering (via Replicate)
- Upload and publishing

### Content Series Workflow
- Research and planning
- Outline creation
- Asset generation (text, images, video)
- Composition and sequencing
- Multi-platform publishing

### Social Media Batch Workflow
- Content planning
- Asset creation
- Platform-specific optimization
- Schedule and queue
- Monitoring and engagement tracking

## Task Types

| Type | Purpose | Typical Duration |
|------|---------|-----------------|
| `VIDEO_GENERATION` | Create video content | 10-60 min |
| `IMAGE_GENERATION` | Create visual assets | 1-5 min |
| `TEXT_GENERATION` | Write copy, scripts | 1-10 min |
| `AUDIO_GENERATION` | Create music, SFX | 2-10 min |
| `VOICE_CLONE` | Clone/synthesize voice | 2-5 min |
| `WORKFLOW_AUTOMATION` | Complex multi-step workflows | Variable |
| `DATA_PROCESSING` | Analysis, transformation | 1-30 min |
| `API_CALL` | External API integration | <1 min |
| `PUBLISH` | Upload to platforms | 1-5 min |
| `RESEARCH` | Information gathering | 5-30 min |
| `MONITOR` | Check status, analytics | <1 min |

## Configuration

Edit `automation/config.json` to customize:

```json
{
  "orchestrator": {
    "max_concurrent_tasks": 4,
    "polling_interval_seconds": 5,
    "enable_voice_input": true
  },
  "services": {
    "video_generation": {
      "api": "replicate",
      "default_model": "stability-ai/rave-tts-hyperframes"
    },
    "text_generation": {
      "api": "anthropic",
      "model": "claude-opus-4-8"
    }
  }
}
```

## Monitoring

Check queue status:

```python
status = orchestrator.queue.get_queue_status()
# Returns: {
#   "pending": 5,
#   "active": 2,
#   "completed": 47,
#   "failed": 1
# }
```

View logs:

```bash
tail -f ~/RHYTHMIX_Empire/logs/orchestrator.log
```

## Extensibility

### Adding Custom Task Handlers

Create a handler in `automation/handlers/`:

```python
# automation/handlers/my_handler.py
class MyCustomTaskHandler:
    async def handle(self, task):
        # Process task
        return {"status": "completed", "result": "..."}
```

Then register in the orchestrator:
```python
orchestrator.register_handler(TaskType.CUSTOM, MyCustomTaskHandler())
```

### Adding Custom Workflows

Define in `automation/workflows/`:

```python
# automation/workflows/my_workflow.py
WORKFLOW_DEFINITION = {
    "name": "My Custom Workflow",
    "stages": ["stage1", "stage2", "stage3"],
    "estimated_duration_minutes": 30
}
```

## Troubleshooting

### Redis Connection Error
```
ConnectionError: Error 111 connecting to localhost:6379
```
→ Start Redis: `redis-server --daemonize yes`

### API Key Missing
```
Error: ANTHROPIC_API_KEY not found in environment
```
→ Fill in `.env` file with your API keys

### Voice Input Not Working
```
Error: whisper_not_available
```
→ Install: `pip install openai-whisper`

### Task Timeout
→ Increase `timeout_seconds` in task definition or config

## Performance Tips

1. **Parallel Processing**: Increase `max_concurrent_tasks` for more parallelism (default: 4)
2. **Priority Queue**: Use higher priorities for time-sensitive tasks
3. **Caching**: Enable result caching to avoid re-computation
4. **Monitoring**: Monitor queue depth and adjust concurrency dynamically

## Security Considerations

- Store API keys in `.env` (never in code)
- Use environment-specific configs
- Implement rate limiting for external APIs
- Log sensitive operations
- Rotate API tokens regularly

## Advanced Usage

### Scheduled Workflows

```python
from apscheduler.schedulers.asyncio import AsyncIOScheduler

scheduler = AsyncIOScheduler()

# Run workflow daily at 9 AM
scheduler.add_job(
    orchestrator.submit_workflow,
    'cron',
    hour=9,
    kwargs={'brief': 'Daily content creation workflow'},
    id='daily_workflow'
)

scheduler.start()
```

### Custom Claude Instructions

Modify the system prompt in `orchestrator.py`:

```python
system_prompt = """You are RHYTHMIX's autonomous workflow planner.
Your tasks:
1. Break complex briefs into detailed workflows
2. Estimate resource requirements
3. Handle edge cases and failures
4. Optimize for time and quality"""
```

### External Service Integration

Hook into external services:

```python
async def on_task_complete(task_id, result):
    # Send to Slack
    # Post to database
    # Trigger webhook
    pass

orchestrator.on_complete_callback = on_task_complete
```

## FAQ

**Q: Can I use this without Redis?**
A: Currently Redis is required. Local queue support coming in v2.

**Q: How many concurrent tasks can I run?**
A: Default is 4, adjustable in config. Limited by API rate limits and compute.

**Q: Can I use local LLMs?**
A: Yes, modify the text_generation config to point to local Ollama or similar.

**Q: How do I deploy this to production?**
A: See `DEPLOYMENT.md` for containerized deployment via Docker/Kubernetes.

## Support

For issues, feature requests, or questions:
- Check existing issues in `docs/agents/`
- File an issue with logs and error messages
- Join the RHYTHMIX community Discord

## License

RHYTHMIX Empire Orchestrator - Part of the RHYTHMIX Platform
