# Kimi CLI Skill

Launch Kimi CLI (Moonshot AI's coding agent + shell) from Claude Code.

## Quick Start

```bash
/kimi-shell              # Interactive mode (Ctrl-X toggles agent ↔ shell)
/kimi-shell --acp        # ACP server mode (VS Code / Zed / JetBrains)
```

## What is Kimi CLI?

Multi-modal AI agent by Moonshot AI that operates as both:
1. **Agent** — Multi-turn coding assistant (analyze, suggest, refactor)
2. **Shell** — Full terminal shell with Ctrl-X toggle

## Features

### Shell Mode (Ctrl-X Toggle)
- Press Ctrl-X to switch between agent and shell mode
- Stay in same session (no context switching)
- Run shell commands from agent context

### IDE Integration
- **VS Code** — Install kimi-code extension, inline assistant
- **Zsh** — Install zsh-kimi-cli plugin, Ctrl-X in terminal
- **Zed / JetBrains** — Use ACP mode (`/kimi-shell --acp`)

### MCP Support (Tool Ecosystem)
Connect to 100+ tools via Model Context Protocol:

**Documentation:**
```bash
kimi mcp add --transport http context7 https://mcp.context7.com/mcp \
  --header "CONTEXT7_API_KEY: ctx7sk-..."
```

**Issue Tracking (Linear with OAuth):**
```bash
kimi mcp add --transport http --auth oauth linear https://mcp.linear.app/mcp
kimi mcp auth linear  # Complete OAuth
```

**Browser Automation (Chrome DevTools):**
```bash
kimi mcp add --transport stdio chrome-devtools -- npx chrome-devtools-mcp@latest
```

## Usage Patterns

### Terminal-First Development
```bash
/kimi-shell
# Now in Kimi:
# Type code question → Ctrl-X → run shell command → Ctrl-X → back to agent
# Perfect for: debugging, refactoring, shell automation in one flow
```

### IDE Integration
```bash
/kimi-shell --acp
# Configure in ~/.config/zed/settings.json or ~/.jetbrains/acp.json
# Now spawning Kimi agents from VS Code, Zed, or JetBrains
```

### Hybrid Workflows

**Scenario 1: Code Review + Shell Testing**
- Agent mode: Analyze PR diffs, suggest improvements
- Ctrl-X: Run tests in shell
- Ctrl-X: Back to agent, summarize results

**Scenario 2: Debugging + Docs Lookup**
- Agent mode: Debug failing code
- Agent calls MCP Context7 for API docs
- Agent suggests fix based on docs
- Ctrl-X: Run fix in shell, verify

**Scenario 3: Build Automation**
- Agent mode: Analyze build logs
- Ctrl-X: Run build commands with agent guidance
- Agent learns from output, suggests optimizations

## Configuration

### MCP Config File (~/.kimi-mcp.json)
```json
{
  "mcpServers": {
    "context7": {
      "url": "https://mcp.context7.com/mcp",
      "headers": {
        "CONTEXT7_API_KEY": "YOUR_KEY"
      }
    },
    "linear": {
      "url": "https://mcp.linear.app/mcp"
    },
    "chrome": {
      "command": "npx",
      "args": ["-y", "chrome-devtools-mcp@latest"]
    }
  }
}
```

### VS Code Setup
1. Install `kimi-code` extension
2. Set Kimi as your inline assistant
3. Ctrl-I to invoke in editor

### Zed Setup
Add to ~/.config/zed/settings.json:
```json
{
  "agent_servers": {
    "Kimi CLI": {
      "type": "custom",
      "command": "kimi",
      "args": ["acp"]
    }
  }
}
```

### JetBrains Setup
Add to ~/.jetbrains/acp.json:
```json
{
  "agent_servers": {
    "Kimi CLI": {
      "type": "custom",
      "command": "kimi",
      "args": ["acp"]
    }
  }
}
```

### Zsh Setup
```bash
# Clone plugin
git clone https://github.com/MoonshotAI/zsh-kimi-cli.git \
  ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/kimi-cli

# Add to ~/.zshrc
plugins=(... kimi-cli)

# Restart Zsh, now Ctrl-X in prompt = Kimi agent mode
```

## Integration with Ecosystem

**Kimi CLI (General Development)**
- Code analysis, review, debugging
- Shell command execution
- General-purpose AI agent

**+ Nucleus/Mary (Video Generation)**
- Specialized neuromarketing video tool
- Kimi can delegate carousel/video tasks to Nucleus
- Kimi chains results into larger workflows

**+ Carousel Generation**
- Kimi analyzes social brief
- Delegates to /carousel-generate skill
- Gets carousel assets
- Chains into social posting pipeline

**+ Knowledge Base**
- Kimi accesses MCP Context7 for docs
- References business/AI patterns from knowledge/
- Applies learnings to code suggestions

## Tips & Tricks

1. **Login First** — Run `/login` first time to authenticate with Kimi
2. **MCP Discovery** — Run `kimi mcp list` to see connected tools
3. **Config as Code** — Version control mcp.json for reproducible setups
4. **Zsh Hybrid** — Install zsh-kimi-cli plugin for Ctrl-X in shell
5. **IDE Agent** — Use ACP mode for inline VS Code/Zed/JetBrains assistance
6. **Shell Chains** — Agent ← Ctrl-X → Shell ← Ctrl-X → Agent for complex workflows

## Comparison with Alternatives

| Feature | Kimi CLI | Claude Code | Cursor |
|---------|----------|-------------|--------|
| Shell integration | Native (Ctrl-X) | Limited | Limited |
| IDE support | VS Code + ACP | CLI + extensions | IDE only |
| MCP tools | Yes (native) | Yes (via settings) | Limited |
| Term-first dev | ✓ Excellent | Good | Poor |
| Agent in shell | ✓ Yes | No | No |

## Related

- **GitHub:** https://github.com/MoonshotAI/kimi-cli
- **Docs:** Full documentation in repo
- **Creator:** Moonshot AI (Chinese AI research lab)
- **VS Code Extension:** kimi-code
- **Zsh Plugin:** zsh-kimi-cli

## Next Steps

1. Run `/kimi-shell` to launch interactive mode
2. Type `/login` to authenticate
3. Add MCP servers: `kimi mcp add ...`
4. Toggle Ctrl-X between agent ↔ shell
5. Integrate with VS Code / Zed / JetBrains via ACP
