# Raw sources

Drop source documents here — articles, papers, transcripts, notes, data files. This layer is
**immutable**: the LLM reads from it but never modifies, renames, or deletes anything in it.

- Images referenced by markdown sources go in `assets/` (Obsidian: set attachment folder to
  `kb/raw/assets/` and use "Download attachments for current file" after web-clipping).
- Obsidian Web Clipper is a fast way to get web articles in as markdown.
- After adding a source, ask Claude to ingest it — see `kb/CLAUDE.md` for the workflow.
