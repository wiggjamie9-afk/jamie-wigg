# Hermes Agent Integration

Hermes Agent is an AI-driven development assistant from Nous Research with messaging gateway integration (Telegram, Discord, Slack, WhatsApp, Signal, Email). Use it for conversational AI, skill automation, and real-time agent collaboration.

## Installation

Hermes Agent is already installed in an isolated Python environment.

### On Your Mac

```bash
# Install Hermes Agent
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash

# Or via pip (after Python 3.11+ is available)
pip install hermes-agent

# Verify installation
hermes --version
```

## Quick Start

### Interactive CLI Mode

```bash
# Start chatting with Hermes
hermes

# In conversation, try these commands:
/new              # Start fresh conversation
/model claude     # Switch to Claude Opus (default)
/skills           # Browse available skills
/config set KEY VALUE  # Configure settings
```

### Configuration

Create or edit `~/.hermes/config.yaml`:

```yaml
model: "claude-opus-4-1"  # or "gpt-4-turbo", etc.
provider: "anthropic"      # or "openai", "openrouter", etc.

# API Keys (set these in environment instead):
# ANTHROPIC_API_KEY
# OPENAI_API_KEY
# OPENROUTER_API_KEY

profiles:
  default:
    memory: true
    context_files: []
    skills: []
```

Set environment variables:

```bash
# For Claude (recommended)
export ANTHROPIC_API_KEY=your-api-key

# Or for OpenAI
export OPENAI_API_KEY=your-api-key

# Then reload
source ~/.zshrc
```

## Event Platform Integration

Hermes can automate event platform tasks via the agent_tools.py we created for OpenHands:

### Example: Event Creation via Hermes

```bash
# Start Hermes
hermes

# In conversation:
# "Create a tech workshop event for June 20 at 6 PM downtown"
# Hermes reads agent_tools.py and creates the event
```

### Create a Hermes Skill

Save as `~/.hermes/skills/event-automation.py`:

```python
"""Event platform automation skill for Hermes Agent."""

import requests

def create_event(title, date, time, location, description=""):
    """Create a new event."""
    payload = {
        "title": title,
        "date": date,
        "time": time,
        "location": location,
        "description": description,
    }
    response = requests.post("http://localhost:3000/api/events", json=payload)
    return response.json()

def search_events(query, limit=10):
    """Search for events using natural language."""
    payload = {"query": query, "limit": limit}
    response = requests.post("http://localhost:3000/api/search-events", json=payload)
    return response.json()

# Expose to Hermes
__all__ = ['create_event', 'search_events']
```

Register in `~/.hermes/config.yaml`:

```yaml
skills:
  - event-automation
```

Then in Hermes:

```
/skills event-automation
"Create a Python workshop tomorrow at 6 PM downtown"
```

## Messaging Gateway

Run Hermes as a bot on Telegram, Discord, Slack, WhatsApp, Signal, or Email:

### Setup Telegram Bot

```bash
# In Hermes CLI
hermes gateway

# Choose Telegram
# Enter your Telegram Bot Token (get from @BotFather on Telegram)
# Send the bot a message to activate

# Then start gateway server
hermes gateway start

# Now any message to your Telegram bot will be handled by Hermes
```

### Setup Discord Bot

```bash
# Similar flow, but for Discord
hermes gateway
# Choose Discord
# Provide Discord bot token and channel IDs

hermes gateway start
```

### Setup Slack Bot

```bash
hermes gateway
# Choose Slack
# Connect your Slack workspace

hermes gateway start
```

## Command Reference

| Command | Purpose |
|---------|---------|
| `hermes` | Start interactive CLI |
| `hermes model list` | Show available models |
| `hermes model <name>` | Switch model (e.g., `hermes model claude-opus-4-1`) |
| `hermes skills` | List installed skills |
| `hermes tools` | Manage tools/integrations |
| `hermes gateway` | Setup messaging gateway |
| `hermes gateway start` | Run gateway server |
| `hermes config set KEY VALUE` | Change configuration |
| `/new` | Start new conversation (in CLI) |
| `/retry` | Retry last response |
| `/undo` | Undo last turn |
| `/compress` | Compress context |
| `/usage` | Show token usage |

## Persona / Personality

Customize how Hermes behaves by creating a SOUL file:

Save as `~/.hermes/SOUL.md`:

```markdown
# Hermes Agent Persona

You are an expert AI development assistant specializing in:
- Event platform design and automation
- Content generation (YouTube, social media)
- Real-time synchronization
- Cross-device mobile apps
- Semantic search and discovery

Core behaviors:
- Always provide actionable code examples
- Explain tradeoffs when suggesting approaches
- Focus on production-ready solutions
- Integrate with the event platform APIs
```

## Memory & Persistent Context

Hermes can remember conversations and maintain user profiles:

```bash
# View memory files
cat ~/.hermes/MEMORY.md
cat ~/.hermes/USER.md

# Hermes automatically updates these based on conversations
```

## MCP Server Integration

Connect any MCP (Model Context Protocol) server:

Edit `~/.hermes/config.yaml`:

```yaml
mcp_servers:
  github:
    command: "npx"
    args: ["@anthropic-ai/github-mcp"]
  
  context7:
    command: "npx"
    args: ["@context7/mcp"]
    env:
      CONTEXT7_API_KEY: "your-key"
```

Then Hermes has access to those tools.

## Cron Scheduling

Schedule Hermes tasks with cron syntax:

```bash
# Schedule task at 9 AM daily
hermes schedule "daily-standup" "0 9 * * *" "Generate daily summary and send to Slack"

# List scheduled tasks
hermes schedule list

# Run scheduled task immediately
hermes schedule run daily-standup
```

## Migrating from OpenClaw

If you're coming from OpenClaw:

```bash
# Automatic migration
hermes claw migrate

# Preview without changes
hermes claw migrate --dry-run

# Migrate without secrets
hermes claw migrate --preset user-data
```

This imports:
- Your persona (SOUL.md)
- Memories and user profiles
- Skills
- Settings and allowlists
- API keys (with your approval)

## Integration with Event Platform

### Full Workflow

1. **Start Hermes**
   ```bash
   hermes
   ```

2. **Use natural language to create/search events**
   ```
   "Create a tech networking event next Friday at 6 PM, downtown area"
   "Show me free community events this weekend"
   "Generate a promotional image for the Python workshop"
   ```

3. **Hermes automatically:**
   - Calls event API endpoints
   - Generates assets via agent_tools.py
   - Updates the database
   - Returns confirmation with event details

4. **Optionally run as Telegram bot**
   ```bash
   hermes gateway setup telegram
   # Now manage events from your phone
   ```

## Production Deployment

### Run as Service

Save as `~/.config/systemd/user/hermes-gateway.service`:

```ini
[Unit]
Description=Hermes Agent Gateway
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=%i
WorkingDirectory=%h
ExecStart=%h/.hermes-env/bin/hermes gateway start
Restart=on-failure
RestartSec=10

[Install]
WantedBy=default.target
```

Then:

```bash
systemctl --user enable hermes-gateway.service
systemctl --user start hermes-gateway.service
```

### Docker (Optional)

```bash
docker run -e ANTHROPIC_API_KEY=xxx \
  -v ~/.hermes:/root/.hermes \
  -p 8000:8000 \
  hermes:latest \
  hermes gateway start
```

## Troubleshooting

```bash
# Diagnose issues
hermes doctor

# Check configuration
hermes config show

# View logs
tail -f ~/.hermes/logs/hermes.log

# Reset to defaults
hermes config reset
```

## Resources

- **Docs**: https://hermes-agent.nousresearch.com/docs
- **GitHub**: https://github.com/NousResearch/hermes-agent
- **Discord**: Join community on Hermes Discord
- **Skills Hub**: https://skills.hermes-agent.nousresearch.com

## Next Steps

1. On your Mac, install Hermes Agent
2. Set up your API key (Anthropic Claude recommended)
3. Create the event-automation skill (save skill code above)
4. Test with `hermes` CLI
5. Deploy gateway for Telegram/Discord/Slack integration
6. Use `/new` and start automating event platform tasks

---

Hermes + OpenHands = complete AI agent automation stack for your event platform.
