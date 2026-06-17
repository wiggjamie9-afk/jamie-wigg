# Kimi CLI

AI-powered coding agent and shell by Moonshot AI. Multi-modal agent with shell integration, VS Code extension, IDE integration via ACP, and MCP support.

## Key Features

**Shell Command Mode**
- Press Ctrl-X to switch between agent and shell mode
- Run shell commands without leaving Kimi CLI
- Native shell integration for terminal-first workflows

**IDE Integration**
- **VS Code Extension** — Direct integration via Kimi Code extension
- **ACP (Agent Client Protocol)** — Works with Zed, JetBrains, and any ACP-compatible editor/IDE
- Configure ACP in `~/.config/zed/settings.json` or `~/.jetbrains/acp.json`
- Command: `kimi acp` to start as ACP agent server

**Shell Integration**
- **Zsh Integration** — Install `zsh-kimi-cli` plugin to press Ctrl-X in Zsh shell
- Enables agent mode from terminal prompt

**MCP (Model Context Protocol) Support**
- Manage MCP servers with `kimi mcp` sub-command group
- Add HTTP servers: `kimi mcp add --transport http context7 https://mcp.context7.com/mcp --header "KEY: value"`
- Add OAuth servers: `kimi mcp add --transport http --auth oauth linear https://mcp.linear.app/mcp`
- Add stdio servers: `kimi mcp add --transport stdio chrome-devtools -- npx chrome-devtools-mcp@latest`
- List: `kimi mcp list`
- Remove: `kimi mcp remove <name>`
- Authorize: `kimi mcp auth <name>`
- Ad-hoc config: `kimi --mcp-config-file /path/to/mcp.json`

## Installation

```bash
git clone https://github.com/MoonshotAI/kimi-cli.git
cd kimi-cli
make prepare  # install dependencies
```

Run: `uv run kimi`

## Development Commands

```bash
uv run kimi              # Run Kimi CLI
make format              # Format code (Python)
make check               # Lint + type check
make test                # Run all tests
make test-kimi-cli       # Test Kimi CLI only
make build-web           # Build web UI (requires Node.js)
make build               # Build Python packages (auto-builds web)
make build-bin           # Build standalone binary
make help                # Show all targets
```

## MCP Configuration Examples

**Register Context7 with API key:**
```bash
kimi mcp add --transport http context7 https://mcp.context7.com/mcp --header "CONTEXT7_API_KEY: ctx7sk-..."
```

**Register Linear with OAuth:**
```bash
kimi mcp add --transport http --auth oauth linear https://mcp.linear.app/mcp
kimi mcp auth linear  # Complete OAuth flow
```

**Register Chrome DevTools stdio server:**
```bash
kimi mcp add --transport stdio chrome-devtools -- npx chrome-devtools-mcp@latest
```

**Configuration file format (mcp.json):**
```json
{
  "mcpServers": {
    "context7": {
      "url": "https://mcp.context7.com/mcp",
      "headers": {
        "CONTEXT7_API_KEY": "YOUR_API_KEY"
      }
    },
    "chrome-devtools": {
      "command": "npx",
      "args": ["-y", "chrome-devtools-mcp@latest"]
    }
  }
}
```

**Launch with config:**
```bash
kimi --mcp-config-file /path/to/mcp.json
```

## Architecture

- **Agent Core** — Multi-modal AI agent for code/shell tasks
- **Shell Mode** — Native shell environment (Ctrl-X toggle)
- **Web UI** — Browser-based interface
- **VS Code Extension** — IDE plugin for seamless editing
- **ACP Server** — IDE-agnostic protocol support
- **MCP Integration** — Tool ecosystem via Model Context Protocol

## Use Cases

1. **Terminal-First Development** — Agent mode + shell mode in same REPL
2. **IDE Agent** — Spawn Kimi as VS Code extension or Zed/JetBrains ACP agent
3. **Tool Orchestration** — MCP servers extend capabilities (Context7, Linear, Chrome DevTools, etc.)
4. **Shell Automation** — Run shell commands without context switching

## Comparison with Nucleus/Mary

| Feature | Kimi CLI | Nucleus (Mary Agent) |
|---------|----------|---------------------|
| Primary use | General coding + shell | Neuromarketing video generation |
| Shell mode | Native (Ctrl-X) | Pydantic AI runtime |
| IDE integration | VS Code + ACP | Python-only |
| MCP support | Yes (native) | Via tool registry |
| Agent runtime | Kimi's proprietary | Pydantic AI |
| Terminal shell | Full support | Limited (subprocess) |

**Potential Integration:** Kimi CLI can orchestrate Nucleus tasks via MCP (if Nucleus exposes an MCP server interface).

## Related

- **Source:** https://github.com/MoonshotAI/kimi-cli
- **Docs:** Full documentation in repo
- **VS Code Extension:** kimi-code
- **Zsh Plugin:** zsh-kimi-cli
- **Upstream:** Moonshot AI (Chinese AI research company)

## License

Kimi CLI by Moonshot AI.

---

**Use Case for Ecosystem:** Kimi CLI can serve as the primary agent/shell for general development tasks (code review, debugging, shell automation), while Nucleus/Mary specializes in neuromarketing video generation. Kimi's MCP support enables it to delegate to Nucleus tasks if exposed as an MCP server.
