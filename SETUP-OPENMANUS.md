# OpenManus Setup Guide

## Overview

OpenManus is an advanced AI agent framework that combines browser automation with LLM capabilities. It enables autonomous browser navigation, task execution, and web interaction through natural language prompts.

**Repository**: https://github.com/FoundationAgents/OpenManus

## What is OpenManus?

OpenManus is a foundation agent framework that:
- Uses LLMs (Claude, GPT-4, Ollama, etc.) to drive browser automation
- Leverages `browser-use` for intelligent web interactions
- Integrates with multiple LLM providers (Anthropic, OpenAI, Azure, Ollama, Jiekou.AI, Bedrock)
- Supports task-oriented browser automation via natural language
- Includes search capabilities (Google, Baidu, DuckDuckGo)
- Provides MCP (Model Context Protocol) support for integration

## Installation

### Prerequisites
- Python 3.10+
- Virtual environment manager (venv, conda, etc.)
- API credentials for your chosen LLM provider

### Step 1: Clone the Repository

```bash
cd /tmp
git clone https://github.com/FoundationAgents/OpenManus
cd OpenManus
```

### Step 2: Create Virtual Environment

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### Step 3: Install Dependencies

> **Known Issue**: The original `requirements.txt` has a Pillow version conflict.
> - `requirements.txt` specifies `pillow~=11.1.0`
> - But `crawl4ai~=0.6.3` requires `pillow~=10.4`
>
> **Solution Applied**: Changed to `pillow>=10.1.0` for compatibility

```bash
pip install -r requirements.txt
```

Installation may take several minutes due to the number of dependencies (browser automation, ML libraries, LLM SDKs, etc.).

### Step 4: Configure OpenManus

Copy the example configuration:

```bash
cp config/config.example.toml config/config.toml
```

Edit `config/config.toml` to add your LLM credentials:

```toml
[llm]
model = "claude-3-7-sonnet-20250219"
base_url = "https://api.anthropic.com/v1/"
api_key = "YOUR_ANTHROPIC_API_KEY"
max_tokens = 8192
temperature = 0.0
```

#### Supported LLM Configurations

**Anthropic Claude**:
```toml
[llm]
model = "claude-3-7-sonnet-20250219"
base_url = "https://api.anthropic.com/v1/"
api_key = "your-api-key"
max_tokens = 8192
temperature = 0.0
```

**OpenAI GPT**:
```toml
[llm]
api_type = "openai"
model = "gpt-4o"
base_url = "https://api.openai.com/v1"
api_key = "your-api-key"
max_tokens = 4096
```

**Ollama (Local)**:
```toml
[llm]
api_type = "ollama"
model = "llama3.2"
base_url = "http://localhost:11434/v1"
api_key = "ollama"
max_tokens = 4096
temperature = 0.0
```

**Azure OpenAI**:
```toml
[llm]
api_type = "azure"
model = "YOUR_MODEL_NAME"
base_url = "{YOUR_ENDPOINT}/openai/deployments/{DEPLOYMENT_ID}"
api_key = "YOUR_AZURE_KEY"
api_version = "2024-08-01-preview"
max_tokens = 8096
```

**Amazon Bedrock**:
```toml
[llm]
api_type = "aws"
model = "us.anthropic.claude-3-7-sonnet-20250219-v1:0"
base_url = "bedrock-runtime.us-west-2.amazonaws.com"
api_key = "bear"
max_tokens = 8192
```

## Running OpenManus

### Basic Usage

**Interactive Mode** (prompts for input):
```bash
python main.py
```

**With Prompt Argument**:
```bash
python main.py --prompt "Find the weather in New York"
```

### Configuration Tips

#### Optional Browser Settings

Add to `config.toml` under `[browser]`:

```toml
[browser]
headless = false              # Show browser window
disable_security = false      # Enable browser security
chrome_instance_path = ""     # Path to Chrome binary
wss_url = ""                  # WebSocket endpoint
cdp_url = ""                  # Chrome DevTools Protocol endpoint
```

#### Proxy Configuration

```toml
[browser.proxy]
server = "http://proxy-server:port"
username = "proxy-username"
password = "proxy-password"
```

## Core Components

### Main Classes

- **Manus**: The core agent orchestrator
  - Handles LLM communication
  - Manages browser automation
  - Processes user prompts
  - Coordinates tool execution

### Dependencies Breakdown

**Browser Automation**:
- `playwright~=1.51.0` - Browser control
- `browser-use~=0.1.40` - Intelligent browser interaction
- `browsergym~=0.13.3` - Web task environments
- `crawl4ai~=0.6.3` - Web content extraction

**LLM Integration**:
- `openai~=1.66.3` - OpenAI support
- `anthropic` (via browser-use) - Anthropic Claude
- `langchain-*` - LLM framework
- `ollama` (optional) - Local model support

**Utilities**:
- `pillow>=10.1.0` - Image processing
- `pydantic~=2.10.6` - Data validation
- `loguru~=0.7.3` - Logging
- `fastapi~=0.115.11` - Web server (optional)
- `mcp~=1.5.0` - Model Context Protocol support

## Troubleshooting

### Installation Issues

**Pillow Conflict** (FIXED):
- Original: `pillow~=11.1.0` conflicted with `crawl4ai`
- Solution: Changed to `pillow>=10.1.0`

**Missing Chrome/Chromium**:
- OpenManus will download Chromium automatically with Playwright
- First run: `playwright install chromium`

**Large Dependencies**:
- Browser automation + ML libraries = ~2GB+ installation size
- Installation may take 5-10 minutes depending on network

### Runtime Issues

**"Enter your prompt"** - The agent is ready for input. Type your browser task.

**API Key Errors** - Verify credentials in `config/config.toml`

**Browser Timeout** - Increase timeout in config or simplify the task

## MCP Integration

OpenManus includes MCP (Model Context Protocol) support. Check `config/mcp.example.json` for MCP server configuration:

```bash
cp config/mcp.example.json config/mcp.json
```

## Environment Variables

Optionally set environment variables instead of config file:

```bash
export ANTHROPIC_API_KEY="your-key"
export OPENAI_API_KEY="your-key"
export AZURE_OPENAI_API_KEY="your-key"
```

## Common Tasks

**Task**: Browse and extract data
```bash
python main.py --prompt "Go to example.com and extract the main headline"
```

**Task**: Form submission
```bash
python main.py --prompt "Navigate to example.com/contact and fill the form with name='John' and email='john@example.com'"
```

**Task**: Search and report
```bash
python main.py --prompt "Search for 'machine learning frameworks' and list the top 5 results"
```

## Performance Notes

- **Cold Start**: First run takes ~30-60 seconds (browser initialization)
- **Warm Start**: Subsequent requests typically 5-15 seconds
- **Token Usage**: Monitor your LLM API usage - complex tasks may use 1000+ tokens
- **Browser Resources**: Requires ~300MB+ RAM for browser instance

## Security Considerations

- **API Keys**: Keep credentials in `config/config.toml` (in `.gitignore`)
- **Data Privacy**: Browser automation may access sensitive sites
- **Headless Mode**: Run with `headless = true` in production
- **Rate Limiting**: Implement delays for respectful web scraping

## Next Steps

1. Verify installation: `python main.py --prompt "Hello"`
2. Configure your preferred LLM provider
3. Test a simple browser task
4. Explore the codebase in `app/` directory
5. Review `app/agent/manus.py` for the core logic

## Additional Resources

- [OpenManus GitHub](https://github.com/FoundationAgents/OpenManus)
- [Browser-Use Documentation](https://github.com/browser-use/browser-use)
- [Playwright Docs](https://playwright.dev/)
- [Anthropic Claude API](https://docs.anthropic.com/)

## Notes for This Repository

This setup was performed on the `claude/openmanus-setup-ykosuu` branch to:
- Document the installation process
- Fix the Pillow dependency conflict
- Provide configuration examples
- Enable future OpenManus integration into the RHYTHMIX ecosystem

For questions about OpenManus integration with the main repository, refer back to this guide.
