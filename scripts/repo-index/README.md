# Repo Semantic Index (Chroma + Ollama)

Search your whole repo by *meaning*, not keywords. Embeddings run locally on
Ollama — **zero API cost**, nothing leaves your machine. The index lives in
`.chroma/` at the repo root (gitignored).

## Why

You have 50+ video folders, specs, docs, and app prototypes. Grep finds exact
strings; this finds *concepts*. Ask "the promo where I talk about pricing" or
"how narration audio is generated" and get the right files ranked by relevance.

## Setup (one time)

```bash
# 1. Ollama running with an embedding model
ollama serve
ollama pull nomic-embed-text

# 2. Python deps
pip install -r scripts/repo-index/requirements.txt
```

## Build the index

```bash
python3 scripts/repo-index/index.py          # incremental — skips unchanged files
python3 scripts/repo-index/index.py --reset  # wipe and rebuild
python3 scripts/repo-index/index.py --stats  # show how many chunks are indexed
```

Re-run anytime you add/edit files; it only re-embeds what changed (tracked by
file mtime).

## Search

```bash
python3 scripts/repo-index/search.py "kokoro narration setup"
python3 scripts/repo-index/search.py -n 10 "checkout approval gate"
```

Output is ranked by cosine similarity with a file path + snippet for each hit.

## Config (env overrides)

| Var | Default | Purpose |
|-----|---------|---------|
| `OLLAMA_API_URL` | `http://localhost:11434` | Ollama endpoint |
| `EMBED_MODEL` | `nomic-embed-text` | embedding model |
| `CHROMA_DIR` | `<repo>/.chroma` | where the index is stored |
| `INDEX_COLLECTION` | `repo` | collection name |
| `REPO_ROOT` | repo root | what to index |

## What gets indexed

Text source files (`.md .txt .html .js .mjs .ts .tsx .json .css .py .sh .yml`),
chunked into ~1000-char overlapping windows. Skips `node_modules`, build output
(`out/`, `dist/`, `.next/`), `renders/`, minified files, lockfiles, and anything
over ~1 MB.

## Notes

- `nomic-embed-text` is ~274 MB and fast on CPU. For higher quality try
  `mxbai-embed-large` (set `EMBED_MODEL=mxbai-embed-large`).
- The `.chroma/` directory is gitignored — the index is a local cache, rebuilt
  from source anytime.
