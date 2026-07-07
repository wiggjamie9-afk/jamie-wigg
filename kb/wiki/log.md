# Log

Append-only record of wiki operations. Entry format: `## [YYYY-MM-DD] ingest|query|lint|schema | Title`.
Recent history: `grep "^## \[" kb/wiki/log.md | tail -5`.

## [2026-07-07] schema | Knowledge base initialised

Instantiated the llm-wiki pattern: `kb/raw/` (immutable sources), `kb/wiki/` (LLM-maintained
pages: sources/entities/concepts/notes + index/log/overview), schema in `kb/CLAUDE.md`,
`/llm-wiki` skill as the operational entry point. Wiki is empty pending first ingest.

## [2026-07-07] ingest | llm-wiki pattern (founding document)

Filed the pattern idea file itself as the first source: `raw/llm-wiki-pattern.md` →
`wiki/sources/llm-wiki-pattern.md`. Updated overview and index. Serves as a worked example
of the ingest workflow; no entity/concept pages yet — the KB's domain is still undecided.
