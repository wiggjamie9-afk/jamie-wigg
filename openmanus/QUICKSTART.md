# OpenManus Quick Start

## Step 1: Configure API Key

Edit `config/config.toml` and replace `YOUR_API_KEY`:

```bash
cd openmanus
nano config/config.toml
# Find the line: api_key = "YOUR_API_KEY"
# Replace with your actual Anthropic Claude API key
```

## Step 2: Activate Virtual Environment

```bash
cd openmanus
source venv/bin/activate
```

## Step 3: Run OpenManus

```bash
# Interactive mode
python main.py

# Or run as MCP server
python run_mcp.py

# Or run a workflow file
python run_flow.py <workflow.yaml>
```

## Configuration Options

All providers are pre-configured in `config/`:

| File | Provider | Status |
|------|----------|--------|
| `config.example.toml` | Anthropic Claude | ✓ Default |
| `config.example-model-openai.toml` | OpenAI | Copy & configure |
| `config.example-model-azure.toml` | Azure OpenAI | Copy & configure |
| `config.example-model-ollama.toml` | Local Ollama | Copy & configure |
| `config.example-model-google.toml` | Google Gemini | Copy & configure |

To use a different provider, copy the example config:
```bash
cp config/config.example-model-openai.toml config/config.toml
# Then edit config.toml with your credentials
```

## Installed Packages (201 total)

**Core LLM/AI:**
- pydantic 2.10.6
- openai 1.66.5
- fastapi 0.115.14

**Automation & Browser:**
- playwright 1.51.0
- browser-use 0.1.40
- docker 7.1.0

**Web & Search:**
- requests 2.32.3
- beautifulsoup4 4.13.3
- duckduckgo-search 7.5.3
- googlesearch-python 1.3.0

**Data & ML:**
- numpy
- datasets 3.4.1
- huggingface-hub 0.29.2

**Other:**
- pyyaml 6.0.3
- loguru 0.7.3
- tenacity 9.0.0

## Testing

```bash
source venv/bin/activate
pytest
```

## Troubleshooting

### Config validation error on startup
This is normal if `config/config.toml` has placeholder values. Edit the file with real API credentials.

### Missing Playwright browsers
```bash
source venv/bin/activate
playwright install
```

### Dependency issues
```bash
source venv/bin/activate
pip install -r requirements.txt --force-reinstall
```

## Documentation

- **Full setup guide**: `../OPENMANUS-SETUP.md`
- **Official README**: `README.md`
- **Config examples**: `config/config.example*.toml`
- **Examples**: `examples/`
- **Tests**: `tests/`

---

**Setup Date**: 2026-06-14  
**Branch**: `claude/openmanus-setup-fsgz0w`
