# OpenManus Setup Guide

OpenManus is an open-source agentic framework for autonomous computer use. It's integrated into this project for building agent-driven automation workflows.

## Repository Location

OpenManus is located at `/openmanus/` in the project root.

## Quick Start

### 1. Activate the Virtual Environment

```bash
cd openmanus
source venv/bin/activate
```

### 2. Configure API Keys

Edit `config/config.toml` and set your API credentials:

```toml
[llm]
model = "claude-3-7-sonnet-20250219"
base_url = "https://api.anthropic.com/v1/"
api_key = "YOUR_API_KEY"  # Replace with your Anthropic API key
max_tokens = 8192
temperature = 0.0
```

#### Supported LLM Providers

- **Anthropic** (default) - Claude models
- **Azure OpenAI** - Azure endpoints
- **OLLAMA** - Local models
- **Amazon Bedrock** - AWS managed service
- **Jiekou.AI** - Chinese AI service
- **Google** - Gemini models
- **PPIO** - PPIO inference

### 3. Run OpenManus

```bash
cd openmanus
source venv/bin/activate
python main.py
```

## Project Structure

```
openmanus/
├── config/
│   ├── config.toml              # Main configuration (create from example)
│   ├── config.example.toml      # Default Anthropic Claude config
│   ├── config.example-model-*.toml  # Alternative provider configs
│   └── mcp.example.json         # MCP server configuration
├── app/                         # Core OpenManus application
│   ├── core/                    # Core functionality
│   ├── services/                # Service layer
│   └── tools/                   # Tool implementations
├── main.py                      # Entry point
├── run_flow.py                  # Run workflow/flow
├── run_mcp.py                   # Run MCP server
├── sandbox_main.py              # Sandbox mode entry
├── examples/                    # Example workflows
├── protocol/                    # Protocol definitions
├── tests/                       # Test suite
├── workspace/                   # Working directory
└── requirements.txt             # Python dependencies
```

## Running Different Modes

### Interactive Mode

```bash
python main.py
```

Launches the main OpenManus application with interactive prompt.

### Flow/Workflow Mode

```bash
python run_flow.py <flow_file>
```

Executes a predefined workflow from a YAML/JSON file.

### MCP Server Mode

```bash
python run_mcp.py
```

or

```bash
python run_mcp_server.py
```

Runs OpenManus as an MCP (Model Context Protocol) server for integration with Claude Code or other tools.

### Sandbox Mode

```bash
python sandbox_main.py
```

Runs in isolated sandbox environment with restricted capabilities.

## Dependencies Fixed

The setup includes a fix for a Pillow version conflict:
- Changed `pillow~=11.1.0` to `pillow~=10.4` to match `crawl4ai` compatibility

If you encounter dependency issues, ensure Python 3.11+ is installed.

## Key Features

- **Multi-LLM Support** - Works with Claude, GPT-4, local models, and more
- **Computer Use** - Can interact with screen, keyboard, and mouse
- **Web Browsing** - Built-in Playwright integration for web automation
- **Docker Support** - Can spawn and manage Docker containers
- **MCP Integration** - Protocol support for model context protocol
- **Vision Capabilities** - Vision model support for screenshot analysis

## Testing

Run the test suite:

```bash
cd openmanus
source venv/bin/activate
pytest
```

## Documentation

- Main README: `openmanus/README.md`
- Config examples: `openmanus/config/config.example*.toml`
- Protocol specs: `openmanus/protocol/`
- Examples: `openmanus/examples/`

## Integration with Claude Code

To use OpenManus with Claude Code:

1. Ensure the virtual environment is activated
2. Configure your API key in `config/config.toml`
3. Run as MCP server: `python run_mcp.py`
4. Connect from Claude Code via `.mcp.json` configuration

## Troubleshooting

### Missing Dependencies

If you get import errors, reinstall dependencies:

```bash
cd openmanus
source venv/bin/activate
pip install -r requirements.txt
```

### API Key Issues

Ensure your API key is:
- Correctly set in `config/config.toml`
- Has necessary permissions
- Not expired or revoked

### Configuration Errors

Validate your TOML configuration syntax:

```bash
python -m tomli openmanus/config/config.toml
```

## Further Reading

- [OpenManus GitHub Repository](https://github.com/FoundationAgents/OpenManus)
- Project documentation in `openmanus/README.md`
- Configuration examples in `openmanus/config/`

---

**Setup Date**: 2026-06-14  
**Branch**: `claude/openmanus-setup-fsgz0w`
