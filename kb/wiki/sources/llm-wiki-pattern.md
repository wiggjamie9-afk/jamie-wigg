---
type: source
tags: [meta, knowledge-management, llm-agents]
created: 2026-07-07
updated: 2026-07-07
sources: [llm-wiki-pattern.md]
---

# llm-wiki — a pattern for LLM-maintained personal knowledge bases

The founding document of this knowledge base — the idea file this `kb/` directory instantiates.
Raw source: [`kb/raw/llm-wiki-pattern.md`](../../raw/llm-wiki-pattern.md).

## Key claims

- **RAG rediscovers; a wiki compounds.** Standard RAG (NotebookLM, file uploads) re-derives
  answers from raw chunks on every query. The llm-wiki pattern compiles knowledge once at
  ingest and keeps it current: cross-references, flagged contradictions, and synthesis are
  already in place when a question arrives.
- **Three layers**: immutable raw sources → LLM-owned wiki of interlinked markdown → a schema
  document that turns the LLM into a disciplined maintainer. Here those are `kb/raw/`,
  `kb/wiki/`, and [`kb/CLAUDE.md`](../../CLAUDE.md).
- **Three operations**: ingest (integrate a new source across many pages), query (index →
  pages → cited answer; file keeper answers back into the wiki), lint (periodic health check
  for contradictions, staleness, orphans, gaps).
- **Index + log split**: `index.md` is the content catalog and retrieval layer (sufficient to
  ~100 sources, no embeddings needed); `log.md` is the append-only, grep-parseable timeline.
- **Why it works**: humans abandon wikis because bookkeeping grows faster than value; for an
  LLM the maintenance cost is near zero. Division of labour — human curates and asks, LLM
  does everything else.
- Lineage: Vannevar Bush's Memex (1945) — private, curated, associative trails — with the
  unsolved maintenance problem finally delegated.

## Notable details

- A single ingest touching 10–15 wiki pages is normal, not excessive.
- Answers worth keeping should be filed as wiki pages so explorations compound like sources do.
- Tooling is modular/optional: Obsidian (graph view, Web Clipper, Dataview, Marp), a search
  CLI like qmd at larger scale. The wiki being a git repo gives history and collaboration free.

## What it changes here

Established this knowledge base: layout, conventions, and the ingest/query/lint workflows now
encoded in [`kb/CLAUDE.md`](../../CLAUDE.md) and dispatched by the `/llm-wiki` skill.
