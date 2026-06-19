# BetterPrompts Implementation Plan

## Architecture Overview

BetterPrompts is a three-layer system:

1. **Configuration Layer** (`config.py`)
   - Load from `.env`, environment variables, CLI args
   - Session-level overrides for API keys and models
   - Sensible defaults (host, port, models)

2. **Provider Layer** (`providers/`)
   - Gemini: `google-generativeai` SDK with safety=BLOCK_NONE
   - Groq: `groq` SDK with OpenAI-compatible chat.completions API
   - Both expose `improve(system: str, user: str) -> str`
   - Exception mapping: ResourceExhausted/quota → RateLimitError, others → ProviderError

3. **Orchestration Layer** (`improver.py`)
   - Try Gemini first → return (text, "Gemini")
   - On error/rate-limit/missing-key, try Groq → return (text, "Groq")
   - If both fail, raise ProviderError

4. **UI Layer** (`app.py`)
   - Gradio Blocks: input, mode selector, output
   - Settings accordion for session overrides
   - Provider badge showing which service handled the request
   - Dark theme + glass morphism CSS

## Modes

- **Beautify**: Polish grammar, tone, clarity, structure
- **Clarify**: Infer defaults, state assumptions inline
- **Translate**: Translate to language + beautify

## Testing (~78 tests)

All mocked; no real API calls needed:

- `test_config.py`: Env loading, defaults, CLI parsing, session overrides
- `test_prompts.py`: System prompts per mode, response parsing
- `test_providers.py`: Gemini/Groq instantiation, error mapping, SDK mocks
- `test_improver.py`: Fallback on error, fallback on rate-limit, both-fail
- `test_app.py`: UI construction, handler logic, badge HTML
- `test_styles.py`: CSS regression markers (dark theme, glass)
- `test_main.py`: CLI --host/--port parsing, app launch

## Phases

1. **Core** (done): Config, prompts, providers, improver
2. **UI** (done): Gradio app with dark theme + glass CSS
3. **Tests** (done): ~78 mocked unit tests
4. **Packaging** (todo): Windows `.exe` builder scripts
5. **Verification**: Run pytest, smoke-launch with no keys

## Why Direct APIs (not FreeLLMAPI)?

The repo's `lib/llm-router` already provides multi-model fallback. BetterPrompts is standalone because:
- Minimalist scope: only Gemini + Groq, not a 38K-LOC re-router
- No coupling to other subsystems
- Free tier keys are user-provided, not vault-stored
- Easier to distribute as a single `.exe` for Windows

## File Count

- 4 main files (config, prompts, improver, app)
- 2 provider modules (gemini, groq)
- 7 test files
- 5 documentation files
- 3 Windows batch scripts
- **Total**: 22 files
