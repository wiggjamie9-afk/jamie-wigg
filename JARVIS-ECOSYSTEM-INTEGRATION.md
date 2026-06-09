# Jarvis — Offline AI Voice Assistant Integration

**Status:** Cloned at `/home/user/jamie-wigg/jarvis`  
**Type:** Desktop application (PyQt6) + Voice engine (Whisper) + LLM (local Ollama)  
**Python:** 3.11  
**Primary platform:** macOS (Windows/Linux supported with caveats)  
**Role in ecosystem:** Voice-first interface layer + persistent memory integration

---

## What is Jarvis?

Jarvis is a **100% private, offline AI voice assistant** that lives on your computer:

- **Voice I/O** — Speak naturally, Jarvis listens and responds with voice synthesis
- **Unlimited memory** — Remembers everything across sessions (diary, knowledge graph, nutrition tracking)
- **MCP integration** — Connect to smart home, GitHub, Slack, databases, etc.
- **Conversational awareness** — Understands context ("Jarvis, what do you think?")
- **Dictation mode** — Free, offline alternative to WisprFlow (hold hotkey → speak → paste text)
- **Always-on privacy** — No cloud, no subscriptions, automatic redaction of sensitive info

**No bland shit:** Fully functional voice assistant with unlimited memory and reasoning capability.

---

## How Jarvis Fits in the Ecosystem

```
Your TELOS (PAI) + Ideal State
        ↓
Claude Code + ECC (Development)
        ↓
Jarvis (Voice Interface) ← You speak naturally
        ↓
Memory System (Diary, Knowledge Graph, Context)
        ↓
MCP Tools (GitHub, Smart Home, Slack, etc.)
```

**Integration points:**
1. **Voice-first development** — Debug code, plan features, brainstorm with Jarvis instead of text prompts
2. **Memory + context** — Jarvis remembers your RHYTHMIX projects, design decisions, code patterns
3. **Hands-free operation** — Control systems, run scripts, check status without typing
4. **MCP bridge** — Same MCP servers that power Claude Code (GitHub, Slack, etc.) available in Jarvis

---

## Installation

### Prerequisites

1. **Ollama** — Local LLM runtime (free, no API keys needed)
   ```bash
   # macOS / Linux / Windows
   # Download from https://ollama.ai
   # Install and run: ollama serve
   ```

2. **Python 3.11+**
   ```bash
   python3 --version  # Should be 3.11 or higher
   ```

3. **System requirements**
   - **Memory:** 8GB+ (16GB+ recommended for quality models)
   - **Audio hardware:** Microphone + speakers (or headphones)
   - **Disk space:** 10–50GB (depends on which models you install)

### Install Jarvis

```bash
cd /home/user/jamie-wigg/jarvis

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run Jarvis (desktop app)
python3 -m src.desktop_app

# First run: setup wizard will guide you through:
# 1. Select/download Ollama model (e.g., gemma2:7b, mistral:7b)
# 2. Configure speech recognition (Whisper model)
# 3. Set hotkey for dictation
# 4. (Optional) Configure location detection
```

**Desktop app opens at:** Jarvis will appear in your system tray and launch setup wizard.

### Quick Test (CLI Only)

If you don't want the desktop app, test the core engine:

```bash
python3 -c "
from src.jarvis.reply import Reply
reply = Reply()
result = reply.reply('What is 2+2?', language='en')
print(result)
"
```

---

## Architecture

### Core Components

| Component | Purpose | Tech |
|---|---|---|
| **Listening** (`src/jarvis/listening/`) | Voice capture + wake word detection | Whisper (OpenAI) |
| **Reply** (`src/jarvis/reply/`) | LLM reasoning + tool routing | Local Ollama |
| **Memory** (`src/jarvis/memory/`) | Diary + knowledge graph + recall | SQLite + embeddings |
| **Dictation** (`src/jarvis/dictation/`) | Hold-to-dictate for any app | Whisper + clipboard |
| **Tools** (`src/jarvis/tools/`) | Built-in + MCP-based integrations | Web search, nutrition, etc. |
| **Desktop App** (`src/desktop_app/`) | PyQt6 UI + system tray | Auto-updates via GitHub |

### Memory Structure

- **Diary** — Timestamped entries of conversations and activities
- **Knowledge Graph** — Auto-organising topics (e.g., "Projects → RHYTHMIX → Design System")
- **Context window** — Short rolling context of current conversation

Queries like "Remember: I prefer Sonnet for complex code" auto-file into memory and resurface when relevant.

---

## Configuration

### First Launch: Setup Wizard

Jarvis guides you through:

1. **Ollama model selection** — Choose model size based on your hardware
   - `gemma4:e2b` — 7B params, 8GB VRAM (default, balanced)
   - `gemma4:e4b` — 14B params, 16GB VRAM (better quality)
   - `gpt-oss:20b` — 20B params, 24GB VRAM (high-end)

2. **Whisper (speech recognition)**
   - Auto-downloads required models
   - On Apple Silicon: uses `mlx-whisper` (much faster)

3. **Dictation hotkey**
   - Windows: `Ctrl+Win`
   - macOS: `Ctrl+Option`
   - Linux: `Ctrl+Alt`

4. **Location detection** (optional)
   - Uses local GeoLite2 database (privacy-first)
   - Jarvis knows "I'm at home" without sending location to cloud

### Settings File

Jarvis stores config at `~/.config/jarvis/config.json`:

```json
{
  "model_name": "gemma4:e2b",
  "speech_model": "medium",
  "dictation_hotkey": "ctrl+option",
  "enable_web_search": true,
  "location_aware": true,
  "auto_redact_sensitive_info": true,
  "mcp_servers": [
    {
      "name": "github",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_..." }
    }
  ]
}
```

---

## Quick Start

### 1. Launch Jarvis

```bash
cd /home/user/jamie-wigg/jarvis
source venv/bin/activate
python3 -m src.desktop_app
```

System tray icon appears → Click to open settings or say "Jarvis" to wake.

### 2. Speak Naturally

```
"Jarvis, what's the weather?"
  → Jarvis searches web, responds with current conditions

"Jarvis, remember that I love Sonnet for code reviews"
  → Stores in memory, uses in future recommendations

"Jarvis, show me my diary from last week"
  → Opens memory viewer, displays diary entries

"Jarvis, open GitHub and show me open issues"
  → Uses MCP server to control browser, lists PRs
```

### 3. Dictation Mode

```
Hold Ctrl+Option (macOS) or Ctrl+Win (Windows)
  → Red indicator shows listening
Speak naturally: "The deadline is Friday at 5pm"
Release hotkey
  → Text appears in your editor/chat/email
```

### 4. Memory Viewer

Click "Memory" in Jarvis system tray menu:
- **Diary** — View all conversations, timestamped
- **Knowledge Graph** — Browse auto-learned topics
- **Meals** — Nutrition tracking (if enabled)

---

## Integration with Your Ecosystem

### 1. Voice-Based Development

Instead of typing prompts to Claude Code:

```
🗣️ You: "Jarvis, I want to add Supervision to MoneyPrinterTurbo"
🤖 Jarvis: [Searches memory for "MoneyPrinterTurbo", "Supervision"]
           [Uses MCP to check GitHub repo]
           "You've been using langdetect for language detection.
            Supervision for frame analysis. I can help you integrate both.
            Should I create an integration guide?"
```

### 2. Context-Aware Coding

Jarvis remembers:
- Design decisions (RHYTHMIX brand system)
- Code patterns (ECC agent roles, LLM routing)
- Project structure (Studio, HerdCheck, Reset)

When you ask "What color should this button be?", it knows: **"Use magenta #ff1f5a per RHYTHMIX brand"** (from memory, not re-explaining each time).

### 3. MCP Integration — Same Tools

Configure Jarvis with the same MCP servers as Claude Code:

```json
{
  "mcp_servers": [
    {
      "name": "github",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"]
    },
    {
      "name": "playwright",
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"]
    }
  ]
}
```

Same GitHub integration, same browser control.

### 4. Hands-Free Workflow

```
Voice → Jarvis → MCP → GitHub
         ↓
    Dictation → Paste into Claude Code
    ↓
    VS Code edits
    ↓
    Git commit (voice command)
    ↓
    PR created (voice + GitHub MCP)
```

---

## Key Features for Your Use Case

### Dictation (Free WisprFlow Alternative)

```bash
# Hold Ctrl+Option, speak, release → text in ANY app
"Moneyprinterturbo should detect language before routing to TTS"
# ↓ releases hotkey
# Text appears in email/chat/editor
```

No typing, no context switching, no subscriptions.

### Memory for Design Decisions

```
"Jarvis, remember: RHYTHMIX uses power3.out easing for all motion"
"What easing does RHYTHMIX use?"
  → Jarvis: "Power3.out, 200-300ms. Used for hover, transitions, and modals."
```

Memory auto-surfaces in design conversations.

### Knowledge Graph for Projects

Jarvis auto-organizes:
```
Projects/
  ├─ RHYTHMIX
  │  ├─ Design System
  │  ├─ MoneyPrinterTurbo
  │  ├─ ECC Integration
  │  └─ Video Generation
  ├─ HerdCheck
  │  ├─ Livestock Detection
  │  └─ Health Scoring
  └─ Studio
     ├─ License System
     └─ Replicate Integration
```

Ask "Show me all RHYTHMIX projects" → Jarvis pulls relevant memory.

### Automatic Redaction

```
"Jarvis, my Anthropic API key is sk-ant-xyz123"
  → Jarvis stores memory WITHOUT the key
     Logs show "[REDACTED_API_KEY]"
     Memory recalls context ("You have a Claude API") without exposing secret
```

---

## Limitations (Transparent)

- **Primary development on macOS** — Windows/Linux support lags behind
- **Voice-only for now** — No text chat interface (issue #35 tracks this)
- **No mobile apps** — Desktop + browser only
- **"Stop" command filtering** — Sometimes echo interferes (issue #24)
- **Dictation unavailable on macOS Tahoe** — pynput incompatibility (issue #172)

See [GitHub Issues](https://github.com/isair/jarvis/issues) for latest status.

---

## Next Steps

1. **Install Ollama** — Download from https://ollama.ai
2. **Run Jarvis** — Follow Quick Start above
3. **Configure MCP servers** — Wire GitHub, Playwright, others from Claude Code
4. **Test dictation** — Use for 1 hour, see productivity gains
5. **Build muscle memory** — "Jarvis, remember..." becomes your interface

---

## Comparison: Jarvis vs. Claude Code

| Feature | Jarvis | Claude Code |
|---|---|---|
| **Interface** | Voice (100% offline) | Text (Claude models) |
| **Memory** | Unlimited (local graph) | Session context only |
| **Speed** | Always-on listening | Type prompts |
| **Reasoning** | Local Ollama | Claude Opus/Sonnet |
| **MCP Tools** | Same as Claude Code | GitHub, Playwright, Context7, etc. |
| **Use case** | Brainstorming, quick searches, hands-free | Deep reasoning, code generation |

**Best together:** Jarvis for voice + context, Claude Code for reasoning + implementation.

---

**Jarvis is cloned and ready. Install Ollama, run the setup wizard, and start using voice-first development.**
