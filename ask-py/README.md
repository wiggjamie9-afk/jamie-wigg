# ask.py — Local Search-Extract-Summarize with Ollama

Search-extract-summarize engine using local Ollama LLM + embeddings. Zero API cost, fully local.

## Setup

```bash
# Install dependencies
pip install -r requirements.txt

# Ensure Ollama is running with required models
ollama serve

# In another terminal, pull models if you haven't
ollama pull gemma-2
ollama pull nomic-embed-text
```

## Usage

### Local file mode (CLI)

```bash
python ask.py -e .env.ollama -i local -c -q "What is this project about?"
```

Files are searched under the `data/` folder. Place any `.txt`, `.md`, or `.pdf` files there.

### Gradio UI

```bash
python ask.py -e .env.ollama
# Opens http://127.0.0.1:7860
```

### Web search mode (requires Google API keys)

```bash
# Set your Google Search API keys in .env.ollama first
export SEARCH_API_KEY="your-key"
export SEARCH_PROJECT_KEY="your-cx-key"

python ask.py -e .env.ollama -c -q "What is the latest news about AI?"
```

## Configuration

`.env.ollama` controls:
- **LLM_BASE_URL** — Ollama endpoint (default: `http://localhost:11434/v1`)
- **DEFAULT_INFERENCE_MODEL** — LLM to use (default: `gemma-2`)
- **EMBEDDING_MODEL** — Embedding model (default: `nomic-embed-text`)
- **SEARCH_API_KEY** / **SEARCH_PROJECT_KEY** — Google Search (optional)
- **SHARE_GRADIO_UI** — Public Gradio link (default: false)

## Architecture

1. **Input** — Query from CLI, Gradio UI, or file list
2. **Retrieval** — Search local files or web, extract text, chunk into ~500-char pieces
3. **Embed** — Generate embeddings via Ollama `nomic-embed-text`
4. **Augment** — Create LLM prompt with retrieved context
5. **Generate** — Get answer from Ollama `gemma-2` (or configured model)

## Roadmap

- [ ] Hybrid search (vector + BM25 full-text via DuckDB)
- [ ] Reranker support
- [ ] Extract mode (structured data extraction with Pydantic schemas)
- [ ] URL list support
- [ ] Date-restricted search
- [ ] Target-site filtering

## Reference

- **Upstream** — [ask.py by pengfeng](https://github.com/pengfeng/ask.py)
- **Related** — [Repo semantic indexer](../scripts/repo-index/) (same embeddings, different target)
