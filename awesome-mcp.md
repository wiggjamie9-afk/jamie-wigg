# Awesome MCP Servers

A curated list of MCP (Model Context Protocol) servers with real-world impact. No shelfware — only tools that actually reduce token consumption or unlock new capabilities.

---

## Developer Tools

| Name | Description | Install |
|------|-------------|---------|
| [Vibecode Cleaner Fartrun](https://github.com/ChuprinaDaria/Vibecode-Cleaner-Fartrun) | Rust-powered local code scanner. 29 MCP tools: security vulns, dead code, health checks, save points, frozen files. Zero tokens consumed — all analysis runs as compiled code, not AI. | `pip install fartrun` |

### Vibecode Cleaner Fartrun — Detailed Overview

**Not another AI reviewing AI.** A Rust-powered code scanner that actually reads your codebase locally — zero extra tokens consumed, no code leaves your machine.

#### 29 MCP tools across 6 categories:

- **Health scanning** — 9-phase project audit (dead code, tech debt, git hygiene, framework checks) with Context7 doc enrichment
- **Security** — 10 Rust sentinel modules (processes, network, secrets, supply chain, env leaks)
- **Save points** — git-based checkpoints with one-click rollback
- **Frozen files** — lock files from AI modification via CLAUDE.md
- **Code search** — grep-style keyword search across project
- **Prompt building** — structured prompts from vibe descriptions

#### Key differentiator

All analysis is compiled Rust code running locally. No API calls for scanning. No token budget impact. Results in milliseconds, not seconds.

#### Transports

- **stdio** (Claude Code, settings.json)
- **HTTP/SSE** (Cursor, Windsurf, web clients)

#### Tested accuracy

~95% across 12 real projects (Python, Go, TypeScript, Django, FastAPI, React).

#### Installation & Setup

**Via pip (stdio):**
```bash
pip install fartrun
```

Configure in `.mcp.json`:
```json
{
  "mcpServers": {
    "fartrun": {
      "command": "fartrun-mcp"
    }
  }
}
```

**Via HTTP (Cursor, Windsurf):**
```bash
fartrun mcp --http --port 3001
```

Configure in `.mcp.json`:
```json
{
  "mcpServers": {
    "fartrun": {
      "url": "http://localhost:3001/sse"
    }
  }
}
```

#### Roadmap: v2.0 (npx)

v2.0 will publish an npm package for easy updates:

```json
{
  "mcpServers": {
    "fartrun": {
      "command": "npx",
      "args": ["fartrun@latest"]
    }
  }
}
```

No manual updates needed — auto-downloads the latest version.

---

## Contributing

Want to add a server? Submit a PR with:
1. Accurate description (no hype)
2. Real installation method
3. Link to the actual repository
4. Optional: brief section on why it's different from similar tools

**Rule:** Ship only what you'd use yourself.
