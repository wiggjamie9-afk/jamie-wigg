#!/usr/bin/env python3
"""
Semantic search over the repo index built by index.py.

Usage:
    python3 scripts/repo-index/search.py "the promo where I talk about pricing"
    python3 scripts/repo-index/search.py -n 10 "kokoro narration setup"

Prereqs: same as index.py (Ollama running with the embedding model pulled).
"""

import argparse
import os
import sys

import requests

try:
    import chromadb
except ImportError:
    sys.exit(
        "chromadb not installed. Run:\n"
        "  pip install -r scripts/repo-index/requirements.txt"
    )

REPO_ROOT = os.path.abspath(
    os.environ.get("REPO_ROOT", os.path.join(os.path.dirname(__file__), "..", ".."))
)
CHROMA_DIR = os.environ.get("CHROMA_DIR", os.path.join(REPO_ROOT, ".chroma"))
OLLAMA_API_URL = os.environ.get("OLLAMA_API_URL", "http://localhost:11434")
EMBED_MODEL = os.environ.get("EMBED_MODEL", "nomic-embed-text")
COLLECTION = os.environ.get("INDEX_COLLECTION", "repo")


def embed(text: str) -> list[float]:
    resp = requests.post(
        f"{OLLAMA_API_URL}/api/embeddings",
        json={"model": EMBED_MODEL, "prompt": text},
        timeout=120,
    )
    resp.raise_for_status()
    return resp.json()["embedding"]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("query", nargs="+", help="natural-language search query")
    ap.add_argument("-n", "--num", type=int, default=5, help="results to return")
    args = ap.parse_args()
    query = " ".join(args.query)

    client = chromadb.PersistentClient(path=CHROMA_DIR)
    try:
        col = client.get_collection(COLLECTION)
    except Exception:
        sys.exit("No index found. Build it first:\n  python3 scripts/repo-index/index.py")

    res = col.query(query_embeddings=[embed(query)], n_results=args.num)

    docs = res["documents"][0]
    metas = res["metadatas"][0]
    dists = res["distances"][0]

    print(f"\nTop {len(docs)} matches for: {query!r}\n")
    for rank, (doc, meta, dist) in enumerate(zip(docs, metas, dists), 1):
        score = 1 - dist  # cosine similarity
        snippet = " ".join(doc.split())[:220]
        print(f"{rank}. {meta['path']}  (similarity {score:.3f})")
        print(f"   {snippet}…\n")


if __name__ == "__main__":
    main()
