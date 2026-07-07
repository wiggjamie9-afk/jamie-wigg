# kb/ — LLM-maintained knowledge base (schema)

This directory is a personal knowledge base built on the "llm-wiki" pattern: the human curates
sources and asks questions; the LLM does all wiki writing, cross-referencing, and bookkeeping.
This file is the schema — the contract for how the wiki is structured and maintained. It is
co-evolved with the user: when a workflow tweak proves useful, encode it here.

## Three layers

| Layer | Path | Who writes it |
|---|---|---|
| Raw sources | `kb/raw/` | Human only. **Immutable — never edit, rename, or delete.** |
| Wiki | `kb/wiki/` | LLM only. Human reads (e.g. in Obsidian), LLM writes. |
| Schema | `kb/CLAUDE.md` | Co-evolved. Update deliberately, note changes in the log. |

## Wiki layout

```
kb/wiki/
├── index.md          # content catalog — every page, one line each, by category
├── log.md            # append-only chronological record of all operations
├── overview.md       # top-level synthesis — the evolving "what does it all mean"
├── sources/          # one summary page per ingested raw source
├── entities/         # people, products, organisations, places, tools
├── concepts/         # ideas, themes, recurring patterns, open questions
└── notes/            # filed answers: comparisons, analyses, explorations worth keeping
```

## Page conventions

- Filenames: `kebab-case.md`. One page per entity/concept — split when a section outgrows its page.
- Every page starts with YAML frontmatter (Dataview-queryable):

```yaml
---
type: source | entity | concept | note
tags: []
created: YYYY-MM-DD
updated: YYYY-MM-DD
sources: []        # raw source filenames this page draws on
---
```

- Links: standard relative markdown links (`[overview](../overview.md)`) — they work in
  Obsidian, GitHub, and editors alike. Link generously; the connections are the value.
- Citations: claims trace to a source page or raw file — `([source](../sources/x.md))`.
- Contradictions: never silently overwrite. Flag inline with a blockquote:
  `> ⚠️ **Contradiction:** source A says X (2025); source B says Y (2026). Current best read: …`
- Superseded claims: strike through with a dated note rather than deleting, until a lint pass
  confirms the old claim is safe to drop.

## Operations

### Ingest (new source dropped into `kb/raw/`)

1. Read the source in full. If it references local images (`kb/raw/assets/`), view the important ones after the text pass.
2. Discuss key takeaways with the user if they're present; otherwise proceed.
3. Write `kb/wiki/sources/<slug>.md` — summary, key claims, notable quotes, what it adds/changes.
4. Update every affected `entities/` and `concepts/` page; create pages for new entities/concepts that matter. A single ingest touching 10–15 pages is normal.
5. Revise `overview.md` if the synthesis shifted. Flag contradictions per the convention above.
6. Update `index.md` (add/update one-liners) and append to `log.md`.

### Query (question asked against the wiki)

1. Read `index.md` first, then drill into the relevant pages. Grep the wiki if the index isn't enough.
2. Answer with citations to wiki pages / raw sources.
3. If the answer is a synthesis worth keeping (comparison, analysis, discovered connection),
   file it as `kb/wiki/notes/<slug>.md`, index it, and log it. Explorations should compound.

### Lint (periodic health check)

Sweep the wiki for: contradictions between pages · stale claims newer sources supersede ·
orphan pages (no inbound links) · concepts mentioned ≥3 times without their own page ·
missing cross-references · data gaps worth a web search. Report findings, fix the mechanical
ones, propose the judgment calls to the user. Log the pass.

## index.md and log.md

- `index.md`: grouped by category; each page gets `- [Title](path) — one-line summary`.
  Updated on **every** ingest/note-filing. This is the retrieval layer — no RAG needed at this scale.
- `log.md`: append-only. Entries start `## [YYYY-MM-DD] ingest|query|lint|schema | Title` so
  `grep "^## \[" log.md | tail -5` gives recent history. Newest at the bottom.

## Repo-specific rules

- Wiki maintenance is judgment work → default model. Mechanical passes (index/log updates,
  link checks, orphan scans) → fan out to Haiku subagents per the root `CLAUDE.md` routing table.
- The `/llm-wiki` skill (`.agents/skills/llm-wiki/`) is the entry point; this file is the
  source of truth if the two ever disagree.
- The wiki is plain markdown in git — commit after each ingest/lint so history tracks the
  wiki's evolution.
