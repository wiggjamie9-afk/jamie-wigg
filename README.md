# LLM Wiki

A personal knowledge base maintained by an LLM agent.

You drop sources into `sources/`. The agent reads them, writes summaries,
maintains entity and concept pages, flags contradictions, and keeps the
whole thing cross-linked and coherent over time. You browse the result
in Obsidian (or any markdown viewer) while the agent edits.

## Layout

```
sources/      raw source documents — immutable, you curate these
wiki/         LLM-maintained markdown — the agent owns this
  index.md      home page / map of the wiki
  log.md        chronological log of ingests, queries, lint passes
  summaries/    one page per source
  entities/     people, organisations, products, places
  concepts/     ideas, frameworks, themes
  syntheses/    comparisons, analyses, filed-back answers
CLAUDE.md     schema + workflow the agent follows
```

## Usage

1. **Open this directory in Obsidian** (point Obsidian at the repo root).
   `[[wiki-links]]` and the graph view will work out of the box.
2. **Open Claude Code (or your agent of choice) alongside it.** The agent
   reads `CLAUDE.md` and follows its conventions.
3. **Drop a source into `sources/`** and ask the agent to ingest it.
4. **Ask questions.** The agent searches the wiki first, falls back to
   raw sources only when needed, and offers to file insights back.
5. **Periodically ask for a lint pass** to catch contradictions, stale
   claims, orphan pages, and gaps.

## Customising

The conventions in `CLAUDE.md` are a starting point — adapt them to your
domain (research, reading log, business intel, journaling, etc.). The
agent will help you co-evolve the schema as you learn what works.
