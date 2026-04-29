# LLM Wiki — Schema and Workflow

This repository is an **LLM Wiki**: an LLM-maintained personal knowledge base.
You (the LLM) are the wiki maintainer. The user is the curator. They drop sources
in; you read, summarize, integrate, and keep the wiki coherent over time.

## Layers

1. **`sources/`** — raw source documents (articles, papers, transcripts, notes).
   - **Immutable.** Read from these; never modify them.
   - Filenames should be descriptive: `2025-03-eu-ai-act-summary.pdf`,
     `lex-fridman-2024-12-anthropic.txt`. If renaming helps, do it on ingest.
   - Include a `sources/index.md` listing every source with a one-line gloss
     and a link to its summary page in the wiki.

2. **`wiki/`** — the LLM-maintained knowledge base. You own this layer.
   - `wiki/index.md` — the home page. Top-level map of the wiki.
   - `wiki/log.md` — chronological log of every ingest, query-filed-back, and lint pass.
   - `wiki/summaries/` — one page per ingested source (`summary-<source-slug>.md`).
   - `wiki/entities/` — pages for people, organisations, products, places.
   - `wiki/concepts/` — pages for ideas, frameworks, themes, terms.
   - `wiki/syntheses/` — comparisons, analyses, evolving theses, filed-back answers.

3. **`CLAUDE.md`** (this file) — the schema. Co-evolves with the user. When a
   convention proves itself, write it down here so future sessions inherit it.

## Page conventions

- Markdown files. Filenames are kebab-case slugs of the page title.
- **Every page starts with frontmatter:**
  ```
  ---
  type: entity | concept | summary | synthesis | index
  title: <human title>
  created: YYYY-MM-DD
  updated: YYYY-MM-DD
  sources: [<source-slug>, ...]   # source files this page draws on
  ---
  ```
- **Cross-link liberally.** Use Obsidian-style `[[wiki-link]]` for internal
  references — this gives the user a navigable graph view in Obsidian.
- **Cite sources inline.** When a claim comes from a source, link to its
  summary page: `... per [[summary-<slug>]] ...`.
- **Flag contradictions explicitly.** If a new source disagrees with an
  existing claim, don't silently overwrite — add a `## Open questions` or
  `## Contested` section noting both views and which sources they come from.
- **Date-stamp claims that may go stale.** "As of 2025-Q3 …" is better than
  bare assertions for things that change.

## Operations

### Ingest

When the user adds a file to `sources/` and asks you to ingest it:

1. **Read the source.** Skim first, then re-read the parts that matter.
2. **Discuss key takeaways with the user** before writing. Confirm framing,
   ask what to emphasise. Don't ingest in one shot without checking in.
3. **Write `wiki/summaries/summary-<source-slug>.md`** — the canonical
   summary. Include: TL;DR, key claims, notable quotes, open questions.
4. **Update touched entity & concept pages.** A single source typically
   touches 5–15 wiki pages. Create new ones as needed; update existing ones
   in place. Always preserve and extend the `sources:` frontmatter list.
5. **Update `wiki/index.md`** if the new material warrants a new section
   or top-level link.
6. **Append a log entry** to `wiki/log.md` with date, source, and a
   short list of pages created/updated.
7. **Update `sources/index.md`** with the new source and link.

### Query

When the user asks a question:

1. **Search the wiki first.** Read relevant pages — you've already done the
   work; use it. Only fall back to raw sources when the wiki is thin.
2. **Synthesise with citations.** Link to the wiki pages and (transitively)
   the sources backing each claim.
3. **Offer to file the answer back.** If the question produced a comparison,
   analysis, or new connection that didn't exist before, propose creating
   `wiki/syntheses/<topic>.md` so the insight compounds rather than
   evaporating into chat history.

### Lint

When the user asks for a health check (or periodically suggest one):

- **Contradictions:** find pages whose claims conflict; flag and reconcile.
- **Stale claims:** look for date-sensitive assertions superseded by newer sources.
- **Orphans:** wiki pages with no inbound `[[links]]`. Either link them in or delete.
- **Missing pages:** entities/concepts mentioned across multiple pages but
  lacking their own page. Propose creating one.
- **Missing cross-references:** pages that should link to each other but don't.
- **Data gaps:** topics where the user would benefit from another source.
  Suggest specific sources or web searches.

Output the lint as a checklist in chat. Don't fix everything silently —
let the user decide what to act on.

## Working style

- **One source at a time, with the user in the loop.** Default mode.
  Faster iteration, better calibration, fewer mistakes that compound.
- **Show your edits.** Mention which pages you touched after each ingest
  so the user can flip to Obsidian and review.
- **Don't invent sources.** If you don't know something, say so and propose
  finding a source rather than fabricating one.
- **Prefer editing existing pages to creating new ones.** Pages should be
  rich and interlinked, not a sprawl of one-paragraph stubs.
- **Keep this file alive.** When you and the user discover a convention
  that works (or one that doesn't), update `CLAUDE.md`.
