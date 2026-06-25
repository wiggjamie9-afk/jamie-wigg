# 🚀 RHYTHMIX Empire - 15-Minute Quick Start

Get your autonomous orchestrator running in 15 minutes.

## Step 1: Install (5 minutes)

```bash
cd /home/user/jamie-wigg
bash automation/setup.sh
```

This installs everything: Python, Redis, dependencies, configuration files.

## Step 2: Configure (3 minutes)

Edit `.env` with your API keys:

```bash
nano .env
```

Minimum required keys:
```
ANTHROPIC_API_KEY=sk-ant-...
REPLICATE_API_TOKEN=token-...
OPENAI_API_KEY=sk-...
```

(Get free/trial keys from: anthropic.com, replicate.com, openai.com)

## Step 3: Start Redis (1 minute)

```bash
redis-server --daemonize yes
```

Verify: `redis-cli ping` → should return `PONG`

## Step 4: Run Orchestrator (2 minutes)

```bash
source venv/bin/activate
python automation/orchestrator.py
```

You'll see:
```
INFO:orchestrator:Starting RHYTHMIX Orchestrator
INFO:orchestrator:Queue status: {'pending': 0, 'active': 0, 'completed': 0, 'failed': 0}
INFO:orchestrator:Orchestrator waiting for new input
```

✅ **Orchestrator is running!** Leave this terminal open.

## Step 5: Submit Your First Workflow (4 minutes)

In a new terminal:

```bash
source venv/bin/activate
python3 << 'EOF'
from automation.orchestrator import RHYTHMIXOrchestrator, TaskPriority

orchestrator = RHYTHMIXOrchestrator()

# Submit a workflow
workflow_id = orchestrator.submit_workflow(
    brief="Create a 60-second YouTube video about AI-generated music for creators",
    priority=TaskPriority.HIGH
)

print(f"✅ Workflow submitted: {workflow_id}")
print(f"📊 Queue status: {orchestrator.queue.get_queue_status()}")
EOF
```

Expected output:
```
✅ Workflow submitted: abc123
📊 Queue status: {'pending': 1, 'active': 0, 'completed': 0, 'failed': 0}
```

Watch the first terminal — you'll see the orchestrator processing your workflow.

---

## 🎙️ Advanced: Voice Commands (Optional)

```bash
python3 << 'EOF'
import asyncio
from automation.voice_interface import VoiceInterface
from automation.orchestrator import RHYTHMIXOrchestrator

async def demo():
    orchestrator = RHYTHMIXOrchestrator()
    voice = VoiceInterface(orchestrator)
    
    # Process a voice command as text
    result = await voice.interpret_text(
        "Generate a 30-second TikTok about the future of AI music"
    )
    
    print(f"Interpreted: {result}")

asyncio.run(demo())
EOF
```

---

## 📋 What Just Happened?

You now have:

1. **Orchestrator** (running in terminal 1)
   - Listens for tasks in Redis queue
   - Plans workflows with Claude
   - Executes distributed tasks
   - Monitors progress

2. **Task Queue** (Redis)
   - Stores pending tasks
   - Tracks active/completed/failed
   - Handles retries automatically

3. **Voice Interface** (available)
   - Converts speech → commands (Whisper)
   - Interprets intent (Claude)
   - Submits tasks automatically

4. **Production Services** (ready)
   - Video generation
   - Image generation
   - Text generation
   - Audio/music generation
   - Voice synthesis

---

## 🎯 Try These Commands

### Command 1: Simple Video Generation
```python
workflow_id = orchestrator.submit_workflow(
    brief="Make a 60-second promo video about digital music production"
)
```

### Command 2: Content Series
```python
workflow_id = orchestrator.submit_workflow(
    brief="Create a 5-part educational series about machine learning for beginners"
)
```

### Command 3: Social Media Batch
```python
workflow_id = orchestrator.submit_workflow(
    brief="Generate 2 weeks of daily TikTok content about AI trends"
)
```

### Command 4: Voice Command (via text)
```python
import asyncio
from automation.voice_interface import VoiceInterface

async def run():
    voice = VoiceInterface(orchestrator)
    await voice.interpret_text("Generate a landing page for a SaaS")

asyncio.run(run())
```

---

## 📊 Monitor Your Workflows

```python
# Check queue status
status = orchestrator.queue.get_queue_status()
print(f"Pending: {status['pending']}")
print(f"Active: {status['active']}")
print(f"Completed: {status['completed']}")
print(f"Failed: {status['failed']}")
```

---

## 🔧 Configuration

All settings in `automation/config.json`:

```json
{
  "orchestrator": {
    "max_concurrent_tasks": 4,        // Increase for more parallelism
    "polling_interval_seconds": 5     // How often to check queue
  },
  "services": {
    "video_generation": {
      "timeout_seconds": 1800         // Increase if videos timeout
    }
  }
}
```

---

## 🚨 If Something Breaks

**Redis not starting?**
```bash
redis-server --daemonize yes
redis-cli ping  # Should return PONG
```

**API key error?**
```bash
# Check .env file
cat .env
# Make sure ANTHROPIC_API_KEY, etc. are filled in
```

**Orchestrator hangs?**
```bash
# Stop: Ctrl+C
# Restart: python automation/orchestrator.py
```

**Task timeout?**
```bash
# Increase in automation/config.json
# services.video_generation.timeout_seconds: 1800 → 3600
```

---

## 📈 Next Steps

### Today:
- ✅ Run orchestrator
- ✅ Submit 3 workflows
- ✅ Monitor outputs

### Tomorrow:
- [ ] Set up voice input (test microphone)
- [ ] Create custom workflow templates
- [ ] Configure publishing platforms

### This Week:
- [ ] Build landing page for SaaS
- [ ] Set up payment processing (Stripe)
- [ ] Start customer outreach

### This Month:
- [ ] Deploy to cloud
- [ ] Implement monitoring dashboards
- [ ] Optimize for scale

---

## 💡 Pro Tips

1. **High Priority Tasks Run First**
   ```python
   from automation.orchestrator import TaskPriority
   orchestrator.submit_workflow(brief="...", priority=TaskPriority.CRITICAL)
   ```

2. **Batch Multiple Tasks**
   ```python
   for i in range(10):
       orchestrator.submit_workflow(brief=f"Video {i}")
   # All 10 queued, process 4 at a time
   ```

3. **Check Logs**
   ```bash
   tail -f ~/RHYTHMIX_Empire/logs/orchestrator.log
   ```

4. **Redis CLI to Monitor**
   ```bash
   redis-cli
   > KEYS orchestrator:*
   > ZRANGE orchestrator:task_queue 0 -1
   > HGETALL orchestrator:active_tasks
   ```

---

## 🎯 Your Empire is Running

You now have:
- ✅ Autonomous orchestrator
- ✅ Voice-to-action interface
- ✅ Distributed task queue
- ✅ Multi-service workflow engine
- ✅ Complete infrastructure for SaaS

**Next**: Feed it briefs. It generates assets. You sell them. 🚀

---

For detailed documentation, see:
- `EMPIRE_SETUP.md` — Complete architecture
- `automation/README.md` — API reference
- `automation/config.json` — Configuration options

Start here:
```bash
python automation/orchestrator.py
```

Then in another terminal, submit workflows:
```bash
python3 << 'EOF'
from automation.orchestrator import RHYTHMIXOrchestrator
orchestrator = RHYTHMIXOrchestrator()
orchestrator.submit_workflow("Make a 60-second promo video")
EOF
```

That's it. Your empire is running. 🎬🤖💰
