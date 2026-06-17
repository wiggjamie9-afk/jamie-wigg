# /kimi-shell

Launch Kimi CLI in a new terminal window or agent mode. Multi-modal AI agent + shell with VS Code/ACP/Zsh integration.

## Usage

```
/kimi-shell              # Launch interactive Kimi CLI (terminal mode)
/kimi-shell --acp        # Start as ACP server for IDE integration
/kimi-shell --list-mcp   # List connected MCP servers
/kimi-shell --add-mcp <name> <url>  # Add MCP server
```

## Features

**Shell Mode (Ctrl-X)**
- Toggle between agent and shell mode in same session
- Run shell commands without context switching
- Full terminal integration

**IDE Integration**
- VS Code: Install kimi-code extension
- Zed/JetBrains: Use ACP mode (`/kimi-shell --acp`)
- Configure in ~/.config/zed/settings.json:
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

**MCP Support**
- Register tools from 100+ MCP servers
- Context7 (documentation)
- Linear (project management)
- Chrome DevTools (browser automation)
- Custom servers via stdio/HTTP

**Zsh Integration**
- Install plugin: `git clone https://github.com/MoonshotAI/zsh-kimi-cli.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/kimi-cli`
- Add to ~/.zshrc: `plugins=(... kimi-cli)`
- Press Ctrl-X in shell to switch to Kimi agent mode

## Quick Examples

```bash
# Interactive coding session
kimi
# In session: Press Ctrl-X to toggle shell mode

# Start as IDE agent (Zed/JetBrains)
kimi acp

# Add MCP tools
kimi mcp add --transport http context7 https://mcp.context7.com/mcp --header "CONTEXT7_API_KEY: ..."

# Use config file
kimi --mcp-config-file ~/kimi-mcp.json
```

## MCP Server Examples

**Context7** (documentation lookup)
```bash
kimi mcp add --transport http context7 https://mcp.context7.com/mcp \
  --header "CONTEXT7_API_KEY: ctx7sk-your-key"
```

**Linear** (issue tracking with OAuth)
```bash
kimi mcp add --transport http --auth oauth linear https://mcp.linear.app/mcp
kimi mcp auth linear
```

**Chrome DevTools** (browser automation)
```bash
kimi mcp add --transport stdio chrome-devtools -- npx chrome-devtools-mcp@latest
```

## Configuration File (mcp.json)

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
    "chrome-devtools": {
      "command": "npx",
      "args": ["-y", "chrome-devtools-mcp@latest"]
    }
  }
}
```

Then: `kimi --mcp-config-file ~/kimi-mcp.json`

## Use Cases

1. **Terminal-First Development** — Agent + shell in one REPL (Ctrl-X toggle)
2. **Code Review** — Kimi analyzes diffs, suggests improvements
3. **Shell Automation** — Chain shell commands with agent reasoning
4. **IDE Agent** — Spawn from VS Code or Zed for in-editor AI assistance
5. **Tool Orchestration** — MCP servers extend capabilities (docs, issues, browser, etc.)

## Integration with Ecosystem

**Kimi CLI + Nucleus/Mary:**
- Kimi handles general development (code review, debugging, shell tasks)
- Nucleus handles specialized neuromarketing video generation
- Potential: Kimi calls Nucleus via MCP if exposed as server

**Kimi CLI + Carousel Generation:**
- Kimi analyzes social media briefs
- Delegates carousel generation to /carousel-generate skill
- Chains results into social posting automation

## Tips

- **Hybrid workflow:** Start in agent mode, Ctrl-X to shell, Ctrl-X back to agent
- **IDE workflow:** Use ACP mode in VS Code/Zed for inline assistant
- **Tool discovery:** Run `kimi mcp list` to see connected servers
- **Config as code:** Version control mcp.json for reproducible tool setup

## Related

- **Upstream:** https://github.com/MoonshotAI/kimi-cli (Moonshot AI)
- **VS Code Extension:** Kimi Code
- **Zsh Plugin:** zsh-kimi-cli
- **Documentation:** Full docs in repo
