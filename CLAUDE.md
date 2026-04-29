# LLM Wiki — Schema and Workflow

This repository is an **LLM Wiki**: an LLM-maintained personal knowledge base.
You (the LLM) are the wiki maintainer. The user is the curator. They drop sources
in; you read, summarize, integrate, and keep the wiki coherent over time.

## Layers

1. **`raw-sources/`** — raw source documents (articles, papers, transcripts, notes).
   - **Immutable.** Read from these; never modify them.
   - Filenames should be descriptive: `2025-03-eu-ai-act-summary.pdf`,
     `lex-fridman-2024-12-anthropic.txt`. If renaming helps, do it on ingest.
   - Include a `raw-sources/index.md` listing every source with a one-line gloss
     and a link to its summary page in the wiki.

2. **`wiki/`** — the LLM-maintained knowledge base. You own this layer.
   - `wiki/index.md` — **content-oriented catalog.** Every page in the wiki,
     grouped by category, each with a link and one-line gloss. This is the
     first thing you read when answering a query — find candidate pages
     here, then drill in. Update on every ingest.
   - `wiki/log.md` — **chronological, append-only.** Ingests, queries
     filed back, lint passes. See *Log format* below.
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

## Log format

Every entry in `wiki/log.md` starts with this exact heading shape so the
log is greppable with plain unix tools:

```
## [YYYY-MM-DD] <action> | <subject>
```

- `<action>` is one of: `ingest`, `query`, `lint`, `schema`.
- `<subject>` is a short human label (source title, question summary, etc).
- Newest entries go at the top.

`grep "^## \[" wiki/log.md | head -10` should always give a clean
recent-activity feed. Don't break this format.

## Working with images

LLMs (including you) usually can't read a markdown file with inline
images in one pass — you read the text, but the images come back as
references. The workflow is:

1. Read the markdown text first.
2. Identify which images matter for the current task.
3. Load and view those images explicitly with the Read tool.

When summarising image-heavy sources, note which figures you actually
inspected vs. which you only read captions for. Don't fabricate
descriptions of images you haven't looked at.

## Bootstrap (empty wiki)

Empty directories are where this pattern stalls. If `raw-sources/` is
empty when a session starts, your first job is to get material into it,
not to philosophise about structure. Push the user to:

- **Dump existing material verbatim.** Saved articles, Kindle highlights,
  podcast notes, meeting transcripts, project docs, old research,
  postmortems, screenshots. Copy-paste into `.md` / `.txt` files. **Do
  not rename, clean up, or curate.** Just get it in.
- **If they have nothing,** offer to talk for ~20 minutes about their
  work, goals, what they're building, what they're figuring out — and
  save the transcript as `raw-sources/memory.md`. That single file is
  enough to make the next session feel grounded.

The vault doesn't need to be complete to be useful. It needs to be real.
Don't let an empty `raw-sources/` block the first ingest.

## Operations

### Ingest

When the user adds a file to `raw-sources/` and asks you to ingest it:

1. **Read the source.** Skim first, then re-read the parts that matter.
2. **Discuss key takeaways with the user** before writing. Confirm framing,
   ask what to emphasise. Don't ingest in one shot without checking in.
3. **Write `wiki/summaries/summary-<source-slug>.md`** — the canonical
   summary. Include: TL;DR, key claims, notable quotes, open questions.
4. **Update touched entity & concept pages.** A single source typically
   touches 5–15 wiki pages. Create new ones as needed; update existing ones
   in place. Always preserve and extend the `sources:` frontmatter list.
5. **Update `wiki/index.md`** — add the new summary under its category,
   create a new category if needed, and link any new entity/concept pages
   under their sections. The index should always be a complete catalog.
6. **Append a log entry** to `wiki/log.md` (top of file, log format above)
   listing pages created and updated.
7. **Update `raw-sources/index.md`** with the new source and link.

### Query

When the user asks a question:

1. **Read `wiki/index.md` first.** That's the catalog — find candidate
   pages, then drill in. If a search tool (e.g. `qmd`) is configured for
   this repo, use it for larger wikis.
2. **Read relevant pages.** You've already done the analysis work — reuse
   it. Only fall back to raw sources in `raw-sources/` when the wiki is thin
   on the question.
3. **Synthesise with citations.** Link to the wiki pages and (transitively)
   the sources backing each claim.
4. **Offer to file the answer back.** If the question produced a comparison,
   analysis, or new connection that didn't exist before, propose creating
   `wiki/syntheses/<topic>.md` so the insight compounds rather than
   evaporating into chat history. Log query-filed-back actions with
   action `query` in `wiki/log.md`.

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

## This schema is a starting point

The structure above is a default, not a prescription. It will likely
need to bend to the user's domain — a reading log, a research wiki, a
journal, a competitive-intel base all have different shapes. When the
user tells you the conventions don't fit, propose changes to this file
and apply them across existing pages. Modularity beats fidelity to the
template.
