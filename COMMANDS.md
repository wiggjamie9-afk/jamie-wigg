# Quick Commands Reference

**Save this file. Copy-paste anytime.**

## Event Platform

```bash
# Start development server
cd ~/jamie-wigg-workspace/event-platform && npm run dev
# → http://localhost:3000

# Build for production
cd ~/jamie-wigg-workspace/event-platform && npm run build

# Build iOS app (opens Xcode)
cd ~/jamie-wigg-workspace/event-platform && npm run build && npm run cap:sync && npm run cap:open:ios
```

## Content Automation Tools

```bash
# Generate thumbnail (1280×720)
python3 ~/jamie-wigg-workspace/content-automation/thumbnail_generator.py --title "My Video"

# Generate captions from video
python3 ~/jamie-wigg-workspace/content-automation/caption_generator.py video.mp4

# Generate captions + burn into video
python3 ~/jamie-wigg-workspace/content-automation/caption_generator.py video.mp4 --burn output.mp4

# Generate image (Replicate/Leonardo/Craiyon)
python3 ~/jamie-wigg-workspace/content-automation/image_generator.py --title "Event Name" --generator replicate

# Generate script (narration, social, description, etc.)
python3 ~/jamie-wigg-workspace/content-automation/script_generator.py --prompt "Event Name" --type event-description
```

## Navigation

```bash
# Go to workspace
cd ~/jamie-wigg-workspace

# Go to event platform
cd ~/jamie-wigg-workspace/event-platform

# Go to content tools
cd ~/jamie-wigg-workspace/content-automation

# Go to iOS wrapper
cd ~/jamie-wigg-workspace/event-platform
```

## Aider AI (Code Editing Pair Programmer)

```bash
# Start Aider in your project
cd ~/jamie-wigg-workspace/event-platform
~/aider

# Specific files
aider src/components/EventForm.tsx src/lib/supabase.ts

# Set model
export ANTHROPIC_API_KEY="your-key"
aider --model claude-opus-4-1

# Commands in Aider:
/help              # Show help
/exit              # Exit
/diff              # Show changes
/test              # Run tests
/run <command>     # Run shell command
/code              # View code history
```

## Hermes Agent (Conversational AI + Messaging Gateway)

```bash
# Start interactive Hermes CLI
cd ~ && bash ~/jamie-wigg-workspace/hermes
# or: ~/jamie-wigg-workspace/hermes

# Set API key first
export ANTHROPIC_API_KEY="your-key"

# Commands in Hermes CLI:
/new              # Start new conversation
/model claude     # Switch to Claude
/skills           # Browse available skills
/config set KEY VALUE  # Configure settings
/retry            # Retry last response
/undo             # Undo last turn

# Start messaging gateway (Telegram, Discord, Slack, etc.)
hermes gateway

# List what Hermes knows
hermes tools      # Show available tools
hermes skills     # Show installed skills

# Diagnose issues
hermes doctor

# View memory/context
cat ~/.hermes/MEMORY.md
```

## OpenHands (AI Agent Platform)

```bash
# Setup (one-time, requires Python 3.12+)
cd ~/jamie-wigg-workspace/event-platform
python3.12 -m venv openhands-env
source openhands-env/bin/activate
pip install openhands-ai

# Set API key
export ANTHROPIC_API_KEY="your-key"

# Run event creation agent
python3 agent_example.py --task create

# Run event search agent
python3 agent_example.py --task search

# Run OpenHands CLI web interface
openhands-cli --model claude-opus-4-1
# → http://localhost:8000
```

## gstack (AI Development Methodology)

```bash
# Install gstack (one-time, on your Mac)
git clone --single-branch --depth 1 https://github.com/garrytan/gstack.git ~/.claude/skills/gstack
cd ~/.claude/skills/gstack
./setup

# Enable for team (one-time, in repo)
(cd ~/.claude/skills/gstack && ./setup --team)
~/.claude/skills/gstack/bin/gstack-team-init required
git add .claude/ CLAUDE.md
git commit -m "Add gstack for AI-assisted development"
git push origin claude/event-platform-design-f3b0df

# Then use in your project:
/office-hours        # Plan before you code
/autoplan            # Generate implementation plan
/review              # Find bugs in code
/qa https://...      # Test your app
/ship                # Push to production
```

## Git (Branch: claude/event-platform-design-f3b0df)

```bash
# Check status
git status

# Pull latest changes
git pull origin claude/event-platform-design-f3b0df

# Commit work
git add .
git commit -m "Your message here"
git push origin claude/event-platform-design-f3b0df
```

## Environment Setup (One-time)

```bash
# Install Python dependencies
cd ~/jamie-wigg-workspace/content-automation
pip install -r requirements.txt

# Set API keys (add to ~/.zshrc or ~/.bash_profile)
export OPENAI_API_KEY="your-token"
export ANTHROPIC_API_KEY="your-key"
export REPLICATE_API_TOKEN="your-token"
export LEONARDO_API_KEY="your-key"
export HIGGSFIELD_API_KEY="your-key"

# Then reload shell
source ~/.zshrc
```

## Ports & URLs

| Service | URL |
|---------|-----|
| Event Platform (dev) | http://localhost:3000 |
| Event Platform (alt port) | `PORT=3001 npm run dev` |

---

**Bookmark this. Use daily.**
