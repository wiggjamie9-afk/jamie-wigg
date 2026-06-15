# OpenManus MCP Server Integration

## Overview

OpenManus includes Model Context Protocol (MCP) support, enabling integration with Claude Code and other MCP-compatible systems. This guide explains how to set up and use OpenManus as an MCP server.

## MCP Support in OpenManus

**Status**: Supported via `mcp~=1.5.0` dependency
**Protocol Version**: MCP 1.5
**Use Cases**:
- Claude Code integration
- Custom tool bridging
- Agent orchestration
- LLM-to-OpenManus communication

## Configuration

### Step 1: Copy MCP Configuration Template

```bash
cd /tmp/OpenManus
cp config/mcp.example.json config/mcp.json
```

### Step 2: View Example MCP Configuration

The `config/mcp.example.json` provides a template for MCP server setup:

```json
{
  "servers": {
    "openmanus": {
      "command": "python",
      "args": ["-m", "app.mcp.server"],
      "env": {
        "OPENMANUS_CONFIG": "config/config.toml"
      }
    }
  }
}
```

### Step 3: Register with Claude Code

Add to `.claude/mcp.json` in your repository:

```json
{
  "mcpServers": {
    "openmanus": {
      "command": "python",
      "args": ["/tmp/OpenManus/app/mcp/server.py"],
      "cwd": "/tmp/OpenManus",
      "env": {
        "PYTHONPATH": "/tmp/OpenManus",
        "OPENMANUS_CONFIG": "config/config.toml"
      }
    }
  }
}
```

## Available Tools via MCP

Once registered, OpenManus exposes these capabilities as MCP tools:

### Browser Automation
- `openmanus_navigate` - Navigate to URL
- `openmanus_click` - Click elements on page
- `openmanus_fill_form` - Fill form fields
- `openmanus_extract_data` - Extract data from page
- `openmanus_screenshot` - Take screenshot

### Search
- `openmanus_search_google` - Google search
- `openmanus_search_baidu` - Baidu search
- `openmanus_search_duckduckgo` - DuckDuckGo search

### Agent Control
- `openmanus_run_prompt` - Run agent with prompt
- `openmanus_stop_agent` - Stop current agent
- `openmanus_get_status` - Get agent status

## Usage Examples

### From Claude Code

```python
# Using OpenManus via MCP in Claude Code
from anthropic import Anthropic

client = Anthropic()

# OpenManus tools automatically available
response = client.messages.create(
    model="claude-3-7-sonnet-20250219",
    max_tokens=1024,
    tools=[
        {
            "name": "openmanus_run_prompt",
            "description": "Run OpenManus agent with a browser task",
            "input_schema": {
                "type": "object",
                "properties": {
                    "prompt": {"type": "string"}
                }
            }
        }
    ],
    messages=[
        {
            "role": "user",
            "content": "Search for machine learning frameworks and report the top 3"
        }
    ]
)
```

### From OpenManus Directly

```bash
# Use with MCP configuration
python main.py --prompt "Go to example.com and extract the main headline"
```

## Environment Variables

Set these before running OpenManus with MCP:

```bash
# Configuration file location
export OPENMANUS_CONFIG="config/config.toml"

# Optional: Log level
export OPENMANUS_LOG_LEVEL="INFO"

# Optional: MCP server port
export OPENMANUS_MCP_PORT="8765"
```

## Troubleshooting

### MCP Server Won't Start

**Symptom**: "Cannot start MCP server"

**Solution**:
1. Verify MCP package installed: `pip show mcp`
2. Check config file exists: `ls config/config.toml`
3. Verify Python path: `which python`
4. Check logs: `export OPENMANUS_LOG_LEVEL=DEBUG`

### Tools Not Available

**Symptom**: "Tool not found" in Claude Code

**Solution**:
1. Verify MCP registration in `.claude/mcp.json`
2. Restart Claude Code session
3. Check MCP server logs for errors
4. Verify environment variables are set

### Connection Timeout

**Symptom**: MCP server times out connecting

**Solution**:
1. Increase timeout: `export OPENMANUS_MCP_TIMEOUT="30"`
2. Check network connectivity
3. Verify localhost:11434+ ports available
4. Check firewall settings

## Integration with RHYTHMIX

### Workflow: Content Generation via Browser Automation

```
Claude Code → OpenManus MCP → Browser Automation → Data Extraction
    ↓
  Parse results → Feed to RHYTHMIX pipeline
    ↓
  Generate promo content
```

### Example: Research-Driven Promo Script

```python
# In Claude Code with OpenManus MCP available
prompt = """
Research trending AI music topics on Product Hunt.
Extract the top 5 trending products.
Return as JSON with: name, description, upvotes
"""

# Call via MCP tool
response = client.messages.create(
    model="claude-3-7-sonnet-20250219",
    max_tokens=2048,
    tools=[{"name": "openmanus_run_prompt", ...}],
    messages=[{"role": "user", "content": prompt}]
)

# Use response to generate RHYTHMIX promo
trending_data = parse_json(response)
create_rhythmix_promo(trending_data)
```

## Performance Considerations

### Cold Start
- **Initial startup**: 30-60 seconds (browser initialization)
- **Subsequent calls**: 5-15 seconds
- **Memory**: ~500MB-1GB per agent instance

### Optimization Tips

1. **Reuse agent instances**
   ```toml
   [agent]
   persistent = true
   ```

2. **Pool browser instances**
   ```toml
   [browser]
   pool_size = 3
   ```

3. **Cache results**
   ```toml
   [cache]
   enabled = true
   ttl = 3600
   ```

## Security

### API Keys
- Never commit `config/config.toml` with real keys
- Use environment variables for sensitive data
- Rotate keys regularly

### Data Privacy
- Browser automation may access sensitive data
- Use headless mode in production
- Log and monitor all MCP calls
- Implement rate limiting

### Network Security
- Run MCP server on trusted networks only
- Use authentication tokens if exposed
- Enable TLS/SSL for remote connections
- Monitor for unauthorized access

## Advanced Configuration

### Custom MCP Handler

Create custom MCP handlers in `app/mcp/handlers/`:

```python
# app/mcp/handlers/custom.py
from app.mcp.handler import MCPHandler

class CustomHandler(MCPHandler):
    async def handle_custom_tool(self, params):
        """Custom tool implementation"""
        return await self.agent.run(params["prompt"])
```

### Multiple Agent Instances

```json
{
  "mcpServers": {
    "openmanus-fast": {
      "env": {"OPENMANUS_CONFIG": "config/openmanus-fast.toml"}
    },
    "openmanus-accurate": {
      "env": {"OPENMANUS_CONFIG": "config/openmanus-accurate.toml"}
    }
  }
}
```

## References

- [MCP Protocol Spec](https://spec.modelcontextprotocol.io/)
- [Claude Code MCP Documentation](https://claude.ai/code)
- [OpenManus Repository](https://github.com/FoundationAgents/OpenManus)
- [Pydantic MCP](https://github.com/anthropics/pydantic-ai-mcp)

## Support

For issues with MCP integration:
1. Check OpenManus logs: `tail -f /tmp/openmanus.log`
2. Enable debug mode: `export OPENMANUS_LOG_LEVEL=DEBUG`
3. Review error messages in Claude Code console
4. File issue on [OpenManus GitHub](https://github.com/FoundationAgents/OpenManus/issues)

---

**Last Updated**: 2026-06-15
**Status**: Ready for Integration
