# OpenHands Integration

OpenHands is an AI-driven development platform for automating tasks using language models. Integrate it with your event platform for intelligent agent-powered workflows.

## System Requirements

- **Python 3.12+** (OpenHands SDK requires Python 3.12 or newer)
- Mac, Linux, or Windows
- Claude, GPT-4, or other LLM API key

## Installation on macOS

### Step 1: Ensure Python 3.12+

```bash
# Check your Python version
python3 --version

# If you need Python 3.12, install via Homebrew
brew install python@3.12

# Verify installation
python3.12 --version
```

### Step 2: Create a Python 3.12 Virtual Environment

```bash
cd ~/jamie-wigg-workspace/event-platform
python3.12 -m venv openhands-env
source openhands-env/bin/activate
```

### Step 3: Install OpenHands SDK

```bash
pip install --upgrade pip
pip install openhands-ai
```

### Step 4: Set Up API Key

Create `.env` in `event-platform/`:

```bash
# For Claude (recommended)
ANTHROPIC_API_KEY=your-api-key-here

# Or for OpenAI
OPENAI_API_KEY=your-api-key-here
```

## Quick Start

### Example: Event Platform Agent

Create `event-platform/agent_example.py`:

```python
#!/usr/bin/env python3
"""OpenHands agent for event platform automation."""

from openhands.core.main import Agent
from openhands.core.logger import openhands_logger as logger

def run_event_agent():
    """Run an OpenHands agent to manage events."""
    
    agent = Agent(
        model_name="claude-opus-4-1",  # or "gpt-4-turbo"
        api_key=None,  # Uses ANTHROPIC_API_KEY from .env
    )
    
    # Task: Create events from natural language
    task = """
    Create 3 new community events:
    1. "Python Workshop Downtown" on June 20, 2026 at 6 PM, downtown park
    2. "Art Exhibition Opening" on June 22, 2026 at 7 PM, local gallery
    3. "Running Club Meetup" on June 21, 2026 at 7 AM, central park
    
    For each event, generate a relevant image and description using the
    asset generation tools.
    """
    
    result = agent.run(task)
    logger.info(f"Agent Result: {result}")
    return result

if __name__ == "__main__":
    run_event_agent()
```

Run it:

```bash
source openhands-env/bin/activate
python3 event-platform/agent_example.py
```

## Integration Patterns

### 1. Event Creation Agent

Automate event creation from natural language:

```python
# Task: "Create a weekend tech networking event in downtown"
# Agent: Generates title, date, location, description, poster image
```

### 2. Content Generation Agent

Automate YouTube thumbnails, captions, social media copy:

```python
# Runs your existing Python content-automation tools
# (thumbnail_generator.py, caption_generator.py, etc.)
```

### 3. Search & Recommendation Agent

Intelligent event discovery:

```python
# "Show me free tech events this weekend"
# Uses semantic search + filtering + personalization
```

## Available Tools for Agent

Once integrated, your agent has access to:

- **Event API** (`/api/events`) — Create, read, update, delete events
- **Search API** (`/api/search-events`) — Semantic event search
- **Asset Generation** (`/api/generate-event-assets`) — Create images, scripts
- **Supabase** — Direct database access for complex queries

## Running OpenHands CLI Locally

For interactive development without code:

```bash
# Install CLI (optional)
pip install openhands-cli

# Run the web interface
openhands-cli --model claude-opus-4-1
```

Then visit `http://localhost:8000` in your browser to interact with the agent.

## Production Deployment

For cloud deployment:

1. Use OpenHands Cloud (free tier at openhands.dev)
2. Self-host with Docker:
   ```bash
   docker run -e ANTHROPIC_API_KEY=xxx openhands-ai
   ```
3. Enterprise self-hosting via Kubernetes

## Debugging

Enable detailed logging:

```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

## Next Steps

1. Install Python 3.12+ on your Mac
2. Create the virtual environment
3. Install openhands-ai
4. Run the example agent
5. Customize tasks for your event platform workflows

## Resources

- **Docs**: https://docs.openhands.dev
- **GitHub**: https://github.com/All-Hands-AI/OpenHands
- **Slack**: Join the OpenHands community on Slack
