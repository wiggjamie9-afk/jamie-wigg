# Claude-Mem Setup & Usage Guide

Claude-Mem is a persistent memory plugin that enables Claude to remember context across sessions without you having to repeat yourself. Once installed, it automatically captures your work patterns, project history, code decisions, and conversations.

## ✅ Installation Status

Claude-Mem v13.6.0 is **installed and running** on this system.

**Key features now active:**
- 🧠 **Persistent Memory** — context survives across Claude Code sessions
- 📊 **Progressive Disclosure** — memory is intelligently injected to avoid token waste
- 🔍 **Skill-Based Search** — query your project history with `mem-search` skill
- 🖥️ **Web Viewer UI** — real-time memory stream at `http://localhost:37777`
- 🔒 **Privacy Control** — use `<private>` tags to exclude sensitive content

## How It Works

### 5 Lifecycle Hooks

Claude-Mem operates through hooks that fire at key moments:

1. **SessionStart** — Memory from previous sessions injected at the top of your conversation
2. **UserPromptSubmit** — Your message is logged before Claude responds
3. **PostToolUse** — Tool results (files edited, code executed) are captured
4. **Stop** — Session end captured
5. **SessionEnd** — Full session summary written to memory

The worker service on port 37777 manages the SQLite database and Chroma vector search.

### What Gets Remembered

- **Code changes** — files you edit, commit messages, git operations
- **Project structure** — folders, dependencies, build steps
- **Decisions** — architectural choices, debugging insights, design patterns
- **Conversations** — task descriptions, requirements, feedback
- **Tool outputs** — test results, build logs, shell commands

### What You Control

**Exclude sensitive content** with `<private>` tags:
```
<private>
This contains API keys, passwords, or other secrets.
Claude-Mem will not store this.
</private>
```

## Usage

### First Session
Memory starts accumulating immediately. On your **second session in this project**, previous context will automatically appear in the conversation start. No manual action needed.

### Optional: Front-load Memory (Fast)
If you want memory to ingest your entire codebase at once:
```bash
# Run this skill in Claude Code
/learn-codebase
```
This takes ~5 minutes and speeds up memory retrieval later.

### Search Your Memory
Use the `mem-search` skill to query past observations:
```bash
/mem-search "authentication bug"
/mem-search type:bugfix project:studio
```

Returns compact results with observation IDs, then use:
```bash
/mem-get-observation 123 456
```
to fetch full details for specific IDs.

### View Memory Dashboard
Open your browser to **`http://localhost:37777`** to see:
- Real-time observation stream (what Claude is capturing)
- Memory search interface
- Settings and version switching
- Database health stats

## Configuration

Settings live in `~/.claude-mem/settings.json` (auto-created with defaults).

### Available Settings
```json
{
  "CLAUDE_MEM_RUNTIME": "worker",              // use worker service
  "CLAUDE_MEM_WORKER_PORT": 37777,             // worker HTTP port
  "CLAUDE_MEM_DATA_DIR": "~/.claude-mem",      // memory storage
  "CLAUDE_MEM_LOG_LEVEL": "info",              // logging: debug|info|warn|error
  "CLAUDE_MEM_DISABLE_WELCOME_HINT": false     // hide first-session message
}
```

## Data Storage

- **Location:** `~/.claude-mem/` (gitignored, on your local machine only)
- **Database:** SQLite with FTS5 full-text search + Chroma vector search
- **Size:** Grows with project history; typically 10-100MB for active projects
- **Backup:** Run backups before uninstalling if you want to preserve memory

## Privacy & Safety

✅ **All data stays local** — no uploads to cloud, no sharing with Anthropic  
✅ **Claude-Mem processes only what you type** — never reads your full codebase without permission  
✅ **Use `<private>` tags** to exclude secrets, API keys, personal data  
✅ **No automatic file scanning** — memory is built from your interactions with Claude  

## Troubleshooting

### Worker not responding
```bash
# Check if worker is running
npx claude-mem status

# Restart the worker
npx claude-mem stop
npx claude-mem start
```

### Memory not appearing in sessions
- Ensure you're in the **second session or later** in this project
- Check `http://localhost:37777` to see if observations are being captured
- Run `/learn-codebase` to front-load memory

### Clear memory (reset)
```bash
rm -rf ~/.claude-mem/
npx claude-mem install  # reinstall fresh
```

## Reference

- **Official docs:** https://claude-mem.dev/docs
- **GitHub:** https://github.com/thedotmack/claude-mem
- **Discord community:** https://discord.gg/cmem
- **X/Twitter:** @Claude_Memory

## Next Steps

1. **Keep working** — memory builds passively from your interactions
2. **Test search** — try `/mem-search` on your second session
3. **Check dashboard** — open `http://localhost:37777` to see it working
4. **Protect secrets** — wrap API keys and passwords in `<private>` tags

---

**Installed:** Sun 2026-06-14 @ 09:15 UTC  
**Version:** 13.6.0  
**Status:** ✅ Running
