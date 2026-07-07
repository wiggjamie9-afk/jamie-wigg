---
name: llm-wiki
description: Operate the LLM-maintained knowledge base in kb/ (llm-wiki pattern - persistent, compounding wiki over raw sources instead of per-query RAG). Use when the user drops a document into kb/raw/ or says "ingest this", asks a question against the knowledge base / "ask the wiki", asks for a wiki health check / "lint the wiki", or wants an analysis filed into the knowledge base. Covers the ingest, query, and lint workflows; the schema in kb/CLAUDE.md is the source of truth.
metadata:
  tags: knowledge-base, wiki, obsidian, ingest, synthesis
---

# llm-wiki — operate the knowledge base in `kb/`

**Read `kb/CLAUDE.md` first** — it is the schema and the source of truth for layout, page
conventions, and workflow detail. This skill is the dispatch layer.

## The pattern in one paragraph

The wiki (`kb/wiki/`) is a persistent, interlinked markdown knowledge base the LLM builds and
maintains over the raw sources in `kb/raw/`. Knowledge is compiled once at ingest time and kept
current — cross-references maintained, contradictions flagged, synthesis updated — rather than
re-derived from raw documents on every question. The human curates sources and asks questions;
the LLM does every wiki edit. Raw sources are immutable.

## Dispatch

| User intent | Operation |
|---|---|
| New file in `kb/raw/`, "ingest this", "file this into the kb" | **Ingest** — summary page + update all affected entity/concept pages + overview + index + log |
| Question about accumulated knowledge, "ask the wiki" | **Query** — index → relevant pages → cited answer; file keeper answers into `kb/wiki/notes/` |
| "Lint the wiki", "health check", periodic maintenance | **Lint** — contradictions, stale claims, orphans, missing pages/cross-refs, gaps; fix mechanical, propose the rest |

Full step-by-step for each operation: `kb/CLAUDE.md` → "Operations".

## Guardrails

- Never modify anything under `kb/raw/` (immutable source of truth).
- Never silently overwrite a claim — use the contradiction/supersede conventions in the schema.
- Always update `kb/wiki/index.md` and append to `kb/wiki/log.md` on ingest/note/lint.
- Ingest and lint synthesis are judgment work (default model); mechanical sweeps (orphan-link
  scans, index consistency) can fan out to Haiku subagents.
- Commit `kb/` after each ingest or lint so git history tracks the wiki's evolution.
- Schema improvements the user agrees to → encode in `kb/CLAUDE.md` and log a `schema` entry.
