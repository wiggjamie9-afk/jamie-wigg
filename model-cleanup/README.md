# LiteLLM Model Cleanup Toolkit

Config-driven scripts for keeping a LiteLLM `config.yaml` in sync with the live
model catalogues of many providers — validating models, updating per-token
costs, adding/removing models, and auto-populating a multi-provider model map.

## Quick Start

```bash
# Unified script (recommended) — process all providers
python cleanup_models.py --provider all --dry-run --verbose

# Process a specific provider
python cleanup_models.py --provider openrouter --dry-run

# Add new models
python cleanup_models.py --provider openrouter --add-model mistralai/mistral-medium mistralai/mistral-small

# Add the same model across all configured providers
python cleanup_models.py --provider all --add-mapped-model glm-5

# Delete models by model_name
python cleanup_models.py --provider all --delete-model "model-a" "model-b" --dry-run

# Auto-populate models.yaml by fuzzy-matching a model across all providers
python populate_models.py minimax-m3 --dry-run

# Apply changes (remove --dry-run)
python cleanup_models.py --provider all
```

## Installation

```bash
pip install -r requirements.txt
```

API keys (only where required):

```bash
export REQUESTY_API_KEY="your-requesty-api-key"
export KILO_API_KEY="your-kilo-api-key"
export OPENCODE_API_KEY="your-opencode-api-key"
```

| Needs an API key | No key required (listing only) |
|---|---|
| Requesty (`REQUESTY_API_KEY`) | OpenRouter |
| Kilo (`KILO_API_KEY`) | Vercel |
| OpenCode Zen / Go (`OPENCODE_API_KEY`) | Poe, Nvidia, Ollama, Fireworks |

## Available Scripts

| Script | Purpose |
|---|---|
| `cleanup_models.py` | Unified script — process all providers or specific ones |
| `populate_models.py` | Auto-populate `models.yaml` by fuzzy-matching a model across providers |
| `cleanup_openrouter_models.py` | OpenRouter-specific (adds `:free` twins) |
| `cleanup_requesty_models.py` | Requesty-specific |
| `cleanup_vercel_models.py` | Vercel AI Gateway-specific |
| `cleanup_poe_models.py` | Poe-specific |
| `cleanup_kilo_models.py` | Kilo-specific |
| `cleanup_nvidia_models.py` | Nvidia NIM-specific |
| `cleanup_ollama_models.py` | Ollama-specific |
| `cleanup_fireworks_models.py` | Fireworks-specific |
| `cleanup_opencode_zen_models.py` | OpenCode Zen-specific |
| `cleanup_opencode_go_models.py` | OpenCode Go-specific (prefix-routed) |

## Command-Line Options

| Option | Description |
|---|---|
| `--provider PROVIDER` | `openrouter`, `requesty`, `vercel`, `poe`, `kilo`, `nvidia`, `ollama`, `fireworks`, `opencode-zen`, `opencode-go`, or `all` |
| `--config CONFIG` | Path to config file (default: `config.yaml`) |
| `--dry-run` | Preview changes without modifying the file |
| `--verbose` | Detailed logging with cost comparison and percentage changes |
| `--add-model MODEL_ID [MODEL_ID ...]` | Add one or more models (space-separated) |
| `--delete-model NAME [NAME ...]` | Delete one or more models by `model_name` |
| `--add-mapped-model NAME` | Add a model defined in `models.yaml` across all providers |
| `--model-name NAME` | Custom name for single-model additions |

### `populate_models.py` options

| Option | Description |
|---|---|
| `MODEL_KEY` (positional) | Canonical model key to look up (e.g. `minimax-m3`, `glm-5.1`) |
| `--display-name NAME` | Display name (default: `MODEL_KEY`) |
| `--description TEXT` | Description for the entry |
| `--provider a,b,c` | Limit search to specific providers |
| `--providers-config PATH` | Path to `providers.yaml` (default: `providers.yaml`) |
| `--models-config PATH` | Path to `models.yaml` (default: `models.yaml`) |
| `--config PATH` | Path to `config.yaml` (used to instantiate cleaners) |
| `--dry-run` | Preview without writing |
| `--force` | Overwrite an existing `models.yaml` entry |
| `--skip-existing` | Don't touch a pre-existing entry |

## Mapped Models (multi-provider additions)

Define a model once in `models.yaml`:

```yaml
models:
  glm-5:
    display_name: "zai-glm-5"
    description: "GLM-5 model by Z.ai"
    providers:
      openrouter: z-ai/glm-5
      kilo: z-ai/glm-5
      fireworks: accounts/fireworks/models/glm-5
```

Then add it everywhere in one command:

```bash
python cleanup_models.py --provider all --add-mapped-model glm-5
```

## Auto-Populating `models.yaml`

`populate_models.py` fetches every provider's catalogue and uses tiered fuzzy
matching to find the best id for a canonical key:

| Score | Tier |
|---|---|
| 1.00 | exact id match |
| 0.90 | id matches with a vendor prefix stripped (`z-ai/glm-5.1` ↔ `glm-5.1`) |
| 0.85 | normalized forms equal (case, separators, p-as-point) |
| 0.75 | normalized forms equal with one trailing suffix stripped (`:free`, `-fw`, `-el`, `-t`, `-it`) |
| 0.60 | substring fallback (only when nothing better exists) |

```bash
python populate_models.py minimax-m3 --dry-run
python populate_models.py glm-5.1
python populate_models.py minimax-m3 --provider openrouter,kilo,vercel
python populate_models.py minimax-m3 --force
```

> `populate_models.py` rewrites the entire `models.yaml` via `yaml.dump`, so
> hand-written comments are lost. A `.yaml.backup` is written before each save.

## How It Works

1. **Load** `config.yaml`.
2. **Identify** provider models by prefix or `api_base` (per `providers.yaml`).
3. **Fetch** the provider catalogue + pricing once.
4. **Validate** config models against the API; remove deprecated entries.
5. **Update** `input_cost_per_token` / `output_cost_per_token` to current pricing.
6. **Preserve** `1e-09` for free models (LiteLLM compatibility).
7. **Sort** the model list alphabetically by `model_name` then model string.
8. **Save** (unless `--dry-run`).

## Architecture

Everything is config-driven. Structural details live in `providers.yaml`; the
shared logic lives in `cleanup_base.py`:

- `BaseModelCleaner` — abstract YAML load/save/sort/validate/cost-update.
- `ConfigDrivenModelCleaner` — concrete cleaner built from a `ProviderConfig`.
- `ProviderManager` — loads `providers.yaml` into `ProviderConfig` objects.
- `UnifiedModelCleaner` — one `ConfigDrivenModelCleaner` per provider; delegates.
- `PrefixDetectionStrategy` / `ApiBaseDetectionStrategy` — model identification.

Provider scripts are thin wrappers around `run_provider_cli`. Only OpenRouter
(`:free` twins) and OpenCode Go (prefix routing) register bespoke subclasses via
`register_cleaner`.

### Tuning a provider

`providers.yaml` carries the API URL, detection strategy, `litellm_prefix`,
`api_base`, pricing field paths, and price `scale` for each provider. Because
pricing units vary, adjust `scale` (and the `input_field`/`output_field` dotted
paths) there — no code changes needed. Endpoints are best-effort defaults;
verify them against each provider's current API.

## Safety Features

- **Dry-run mode** for every operation.
- **Graceful failure** on network/YAML errors — the file is never corrupted.
- **Free-model handling** via the `1e-09` sentinel.
- Cleanup scripts create **no backup files** (use git). `populate_models.py` is
  the exception and writes a `.yaml.backup` because it rewrites the whole file.

## Dependencies

- **PyYAML** — safe YAML parsing/writing.
- **requests** — provider API calls.
