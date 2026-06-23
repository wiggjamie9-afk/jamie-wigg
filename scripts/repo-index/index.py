#!/usr/bin/env python3
"""
Repo semantic indexer — embeds repo text into a local Chroma vector DB via Ollama.

Zero API cost: embeddings run on your local Ollama install (model: nomic-embed-text).
The index lives in .chroma/ at the repo root (gitignored).

Usage:
    python3 scripts/repo-index/index.py              # incremental (skips unchanged files)
    python3 scripts/repo-index/index.py --reset      # wipe and rebuild from scratch
    python3 scripts/repo-index/index.py --stats      # show index stats and exit

Prereqs:
    ollama serve
    ollama pull nomic-embed-text
"""

import argparse
import hashlib
import os
import sys
import time

import requests

try:
    import chromadb
except ImportError:
    sys.exit(
        "chromadb not installed. Run:\n"
        "  pip install -r scripts/repo-index/requirements.txt"
    )

# ---- Config (override via env) -------------------------------------------------

REPO_ROOT = os.path.abspath(
    os.environ.get("REPO_ROOT", os.path.join(os.path.dirname(__file__), "..", ".."))
)
CHROMA_DIR = os.environ.get("CHROMA_DIR", os.path.join(REPO_ROOT, ".chroma"))
OLLAMA_API_URL = os.environ.get("OLLAMA_API_URL", "http://localhost:11434")
EMBED_MODEL = os.environ.get("EMBED_MODEL", "nomic-embed-text")
COLLECTION = os.environ.get("INDEX_COLLECTION", "repo")

# What to index
INCLUDE_EXT = {
    ".md", ".txt", ".html", ".js", ".mjs", ".ts", ".tsx",
    ".json", ".css", ".py", ".sh", ".yml", ".yaml",
}
# Directories to skip entirely (matched as path segments)
EXCLUDE_DIRS = {
    "node_modules", ".git", ".chroma", "out", "dist", ".next",
    "renders", "__pycache__", ".remotion", "vendor", "cache",
    ".claude-playwright", ".playwright-mcp",
}
EXCLUDE_SUFFIXES = (".min.js", ".min.css", "-lock.json", ".lock")
MAX_FILE_BYTES = 1_000_000  # skip files larger than ~1 MB

CHUNK_CHARS = 1000
CHUNK_OVERLAP = 150


# ---- Embedding -----------------------------------------------------------------

def embed(text: str) -> list[float]:
    """Get an embedding vector from Ollama for a single string."""
    resp = requests.post(
        f"{OLLAMA_API_URL}/api/embeddings",
        json={"model": EMBED_MODEL, "prompt": text},
        timeout=120,
    )
    resp.raise_for_status()
    return resp.json()["embedding"]


def check_ollama() -> None:
    try:
        r = requests.get(f"{OLLAMA_API_URL}/api/tags", timeout=5)
        r.raise_for_status()
    except Exception:
        sys.exit(
            f"Cannot reach Ollama at {OLLAMA_API_URL}.\n"
            "  Start it with:  ollama serve\n"
            f"  Pull the model: ollama pull {EMBED_MODEL}"
        )
    models = [m.get("name", "") for m in r.json().get("models", [])]
    if not any(EMBED_MODEL in m for m in models):
        sys.exit(
            f"Embedding model '{EMBED_MODEL}' not found in Ollama.\n"
            f"  Pull it with: ollama pull {EMBED_MODEL}"
        )


# ---- File discovery + chunking -------------------------------------------------

def iter_files():
    for root, dirs, files in os.walk(REPO_ROOT):
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS and not d.startswith(".")]
        for name in files:
            ext = os.path.splitext(name)[1].lower()
            if ext not in INCLUDE_EXT:
                continue
            if name.endswith(EXCLUDE_SUFFIXES):
                continue
            path = os.path.join(root, name)
            try:
                if os.path.getsize(path) > MAX_FILE_BYTES:
                    continue
            except OSError:
                continue
            yield path


def chunk_text(text: str):
    """Yield overlapping character windows."""
    if not text.strip():
        return
    step = CHUNK_CHARS - CHUNK_OVERLAP
    for i in range(0, len(text), step):
        piece = text[i : i + CHUNK_CHARS]
        if piece.strip():
            yield i, piece


# ---- Main ----------------------------------------------------------------------

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--reset", action="store_true", help="wipe and rebuild")
    ap.add_argument("--stats", action="store_true", help="show stats and exit")
    args = ap.parse_args()

    client = chromadb.PersistentClient(path=CHROMA_DIR)

    if args.stats:
        try:
            col = client.get_collection(COLLECTION)
            print(f"Collection '{COLLECTION}': {col.count()} chunks")
        except Exception:
            print(f"No collection '{COLLECTION}' yet. Run the indexer first.")
        return

    if args.reset:
        try:
            client.delete_collection(COLLECTION)
            print(f"Reset: dropped collection '{COLLECTION}'.")
        except Exception:
            pass

    check_ollama()
    col = client.get_or_create_collection(
        name=COLLECTION, metadata={"hnsw:space": "cosine"}
    )

    # Map of file path -> stored mtime, to skip unchanged files on incremental runs.
    existing = col.get(include=["metadatas"])
    stored_mtime: dict[str, float] = {}
    for meta in existing.get("metadatas", []) or []:
        if meta and "path" in meta:
            stored_mtime[meta["path"]] = max(
                stored_mtime.get(meta["path"], 0), meta.get("mtime", 0)
            )

    t0 = time.time()
    n_files = n_chunks = n_skipped = 0

    for path in iter_files():
        rel = os.path.relpath(path, REPO_ROOT)
        mtime = os.path.getmtime(path)
        if not args.reset and stored_mtime.get(rel) == mtime:
            n_skipped += 1
            continue

        # Drop any stale chunks for this file before re-adding.
        try:
            col.delete(where={"path": rel})
        except Exception:
            pass

        try:
            with open(path, "r", encoding="utf-8", errors="ignore") as f:
                text = f.read()
        except OSError:
            continue

        ids, docs, metas, embs = [], [], [], []
        for offset, piece in chunk_text(text):
            cid = hashlib.sha1(f"{rel}:{offset}".encode()).hexdigest()
            ids.append(cid)
            docs.append(piece)
            metas.append({"path": rel, "offset": offset, "mtime": mtime})
            embs.append(embed(piece))

        if ids:
            col.upsert(ids=ids, documents=docs, metadatas=metas, embeddings=embs)
            n_files += 1
            n_chunks += len(ids)
            print(f"  indexed {rel} ({len(ids)} chunks)")

    dt = time.time() - t0
    print(
        f"\nDone in {dt:.1f}s — {n_files} files updated, "
        f"{n_chunks} chunks embedded, {n_skipped} unchanged skipped."
    )
    print(f"Index: {CHROMA_DIR}  (collection '{COLLECTION}', {col.count()} total chunks)")


if __name__ == "__main__":
    main()
