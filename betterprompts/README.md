# BetterPrompts

A standalone AI prompt improvement tool that automatically enhances user prompts using Google Gemini (with Groq fallback). Built with Python + Gradio for a smooth, modern web UI.

## Features

- **Three Improvement Modes**:
  - **Beautify**: Polish grammar, tone, clarity, and structure
  - **Clarify**: Infer defaults, state assumptions, add constraints
  - **Translate**: Translate to target language and beautify

- **Automatic Fallback**: Try Gemini first; if it fails, automatically fall back to Groq
- **Session Configuration**: Override API keys and models from the UI settings
- **Dark Theme + Glass Morphism**: Modern, polished UI with blur effects and gradients
- **Mocked Test Suite**: ~78 tests with zero real API calls needed

## Quick Start

### Prerequisites

- Python 3.11+
- pip or uv

### Installation

```bash
# Clone or download the repository
cd betterprompts

# Create a virtual environment
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install in development mode
pip install -e ".[dev]"
```

### Configuration

Copy `.env.sample` to `.env` and fill in your API keys:

```bash
cp .env.sample .env
```

Then edit `.env`:

```env
GEMINI_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key
GEMINI_MODEL=gemini-2.5-flash-lite
GROQ_MODEL=llama-3.3-70b-versatile
BETTERPROMPTS_HOST=127.0.0.1
BETTERPROMPTS_PORT=7860
```

**Free API Keys**:
- Gemini: https://aistudio.google.com/apikey
- Groq: https://console.groq.com/keys

### Run the App

```bash
# Option 1: Via CLI
python -m betterprompts

# Option 2: With custom host/port
python -m betterprompts --host 0.0.0.0 --port 3000
```

The app will open in your browser at `http://127.0.0.1:7860` (or your configured host/port).

### Run Tests

```bash
pytest
# For verbose output:
pytest -v
# For coverage:
pytest --cov=betterprompts
```

All tests are mocked — no real API keys required.

## Architecture

### Configuration (`config.py`)

Loads settings from `.env` → environment variables → session overrides → CLI arguments, with sensible defaults.

```python
config = get_config()
config.set_session_gemini_key("my_key")  # Session-only override
```

### Prompts (`prompts.py`)

Defines system prompts for each mode. Easy to customize:

```python
from betterprompts.prompts import get_system_prompt
prompt = get_system_prompt("Beautify")
```

### Providers (`providers/`)

Each provider exposes `improve(system: str, user: str) -> str` and maps SDK exceptions to `ProviderError`/`RateLimitError`:

- **Gemini** (`gemini.py`): `google-generativeai` SDK, safety=BLOCK_NONE
- **Groq** (`groq.py`): `groq` SDK via `chat.completions.create()`

### Orchestration (`improver.py`)

```python
from betterprompts.improver import PromptImprover

improver = PromptImprover()
improved, provider = improver.improve(
    user_prompt="My rough prompt",
    mode="Beautify",
    target_language="Spanish"  # Only for Translate
)
print(f"Provider: {provider}")  # "Gemini" or "Groq"
```

Handles:
- Automatic Gemini → Groq fallback on error or rate-limit
- Missing keys (skips that provider)
- Raises `ProviderError` if both fail

### UI (`app.py`)

Gradio Blocks with:
- Input and output textboxes
- Mode dropdown (Beautify, Clarify, Translate)
- Target language field (visible only for Translate)
- Provider badge (shows which provider handled the request)
- Settings accordion (override keys/models for the session)
- Dark theme + glass morphism CSS

## CLI

```bash
python -m betterprompts --help

# Usage
python -m betterprompts --host 0.0.0.0 --port 8080
```

## Project Structure

```
betterprompts/
├── pyproject.toml          # Dependencies and metadata
├── README.md               # This file
├── .env.sample             # Template for environment variables
├── .gitignore              # Git ignore rules
├── betterprompts/
│   ├── __init__.py
│   ├── __main__.py         # CLI entry point
│   ├── config.py           # Configuration + env loading
│   ├── prompts.py          # System prompts by mode
│   ├── improver.py         # Orchestration + fallback logic
│   ├── app.py              # Gradio UI + dark theme CSS
│   └── providers/
│       ├── __init__.py
│       ├── base.py         # Provider protocol + exceptions
│       ├── gemini.py       # Gemini provider
│       └── groq.py         # Groq provider
└── tests/
    ├── __init__.py
    ├── test_config.py      # Configuration tests
    ├── test_prompts.py     # System prompt tests
    ├── test_providers.py   # Provider tests (mocked SDKs)
    ├── test_improver.py    # Orchestration tests
    ├── test_app.py         # UI handler tests
    ├── test_styles.py      # CSS regression tests
    └── test_main.py        # CLI tests
```

## Windows Packaging

Included scripts for building a standalone `.exe` (run on Windows):

```bash
# From Windows command prompt:
scripts\build_exe.bat          # → dist\BetterPrompts.exe
scripts\publish_desktop.bat    # Copy exe to Desktop
```

The `.exe` bundles Python, dependencies, and a `.env` file with your API keys.

## Dependencies

**Runtime**:
- `gradio >= 4.0.0` — Web UI
- `google-generativeai >= 0.3.0` — Gemini API
- `groq >= 0.4.0` — Groq API
- `python-dotenv >= 1.0.0` — .env loading

**Development** (`[dev]`):
- `pytest >= 7.0.0` — Test suite

## Troubleshooting

### "Both Gemini and Groq providers failed"

- Check `.env` file exists and has at least one valid API key
- Verify API keys are correct (copy-paste from provider console)
- Run tests to confirm environment is set up: `pytest`

### "No module named 'gradio'"

```bash
pip install -e ".[dev]"  # Reinstall with dev dependencies
```

### Port already in use

```bash
python -m betterprompts --port 8080
```

### Running on a remote server

```bash
python -m betterprompts --host 0.0.0.0
# Then access via http://<your-server-ip>:7860
```

## License

MIT

## Author

Part of the Gary AI ecosystem.
