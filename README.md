# LLM Wiki

A personal knowledge base maintained by an LLM agent.

You drop sources into `raw-sources/`. The agent reads them, writes
summaries, maintains entity and concept pages, flags contradictions,
and keeps the whole thing cross-linked and coherent over time. You
browse the result in Obsidian (or any markdown viewer) while the agent
edits.

## Layout

```
raw-sources/  raw source documents — immutable, you curate these
wiki/         LLM-maintained markdown — the agent owns this
  index.md      catalog of every page, grouped by category
  log.md        chronological log of ingests, queries, lint passes
  summaries/    one page per source
  entities/     people, organisations, products, places
  concepts/     ideas, frameworks, themes
  syntheses/    comparisons, analyses, filed-back answers
CLAUDE.md     schema + workflow the agent follows
```

## Getting started — don't stare at an empty folder

This is where most people stall: they create the folders, then sit
looking at an empty directory wondering what counts as "good enough"
to ingest. Skip that. Dump everything you already have:

- Articles you saved and never re-read
- Kindle highlights, podcast notes, YouTube rabbit-hole notes
- Meeting transcripts, project docs, old decision memos
- Postmortems, retros, lessons-learned
- Screenshots of things you wanted to remember

Copy-paste into `.md` or `.txt` files in `raw-sources/`. Don't rename.
Don't clean up. Just get it in. The agent will sort it on ingest.

**No existing material?** Open a chat with the agent, talk for
~20 minutes about your work, your goals, what you're building, what
you're figuring out. Save the transcript as `raw-sources/memory.md`.
That single file is enough to make the next session feel like the
agent already knows you.

The vault doesn't need to be complete to be useful. It needs to be real.

## Usage

1. **Open this directory in Obsidian** (point Obsidian at the repo root).
   `[[wiki-links]]` and the graph view will work out of the box.
2. **Open Claude Code (or your agent of choice) alongside it.** The agent
   reads `CLAUDE.md` and follows its conventions.
3. **Drop a source into `raw-sources/`** and ask the agent to ingest it.
4. **Ask questions.** The agent reads `wiki/index.md` first, falls back
   to raw sources only when needed, and offers to file insights back.
5. **Periodically ask for a lint pass** to catch contradictions, stale
   claims, orphan pages, and gaps.

## Customising

The conventions in `CLAUDE.md` are a starting point — adapt them to your
domain (research, reading log, business intel, journaling, etc.). The
agent will help you co-evolve the schema as you learn what works.

## Optional tooling

All optional — the wiki works as plain markdown without any of this.

- **[Obsidian Web Clipper](https://obsidian.md/clipper)** — browser
  extension that converts web articles to markdown. Drop the output into
  `raw-sources/`.
- **Image attachments.** In Obsidian: *Settings → Files and links →
  Attachment folder path* set to `raw-sources/assets/`, then bind
  *Download attachments for current file* to a hotkey. Lets the agent
  load images locally instead of relying on URLs.
- **Graph view** in Obsidian — best way to see the wiki's shape, find
  hubs, and spot orphans.
- **[Marp](https://marp.app/)** — markdown-to-slide-deck. Ask the agent
  to file an analysis as a Marp deck in `wiki/syntheses/`.
- **[Dataview](https://blacksmithgu.github.io/obsidian-dataview/)** —
  Obsidian plugin that runs queries over page frontmatter. The schema's
  `type:` / `created:` / `sources:` fields are designed for this.
- **[qmd](https://github.com/tobi/qmd)** — local markdown search engine
  (BM25 + vectors + LLM rerank). Useful once the wiki gets bigger than
  the index file can comfortably catalog. Has both CLI and MCP server.

## Why this works

Maintaining a wiki by hand is bookkeeping, not thinking — and the
bookkeeping cost grows faster than the value, which is why human-run
wikis stall. LLMs don't get bored, don't forget cross-references, and
can touch fifteen pages in one pass. The wiki stays maintained because
maintenance is near-free. You curate sources and ask good questions;
the agent does the rest.
