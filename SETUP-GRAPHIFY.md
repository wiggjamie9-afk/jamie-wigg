# Graphify — Setup & Reference

## Overview

**Graphify** maps an entire project — code, docs, PDFs, images, video — into a
**knowledge graph you query instead of grepping**. Run `/graphify .` in your AI
coding assistant and you get three files under `graphify-out/`:

```
graphify-out/
├── graph.html       # open in a browser — click nodes, filter, search
├── GRAPH_REPORT.md  # highlights: god-nodes, surprising connections, suggested questions
└── graph.json       # the full graph — query it without re-reading files
```

Code is extracted **locally** via tree-sitter (36 grammars, no API calls); docs /
PDFs / images go through your IDE session's model; video/audio is transcribed
locally with faster-whisper. No telemetry.

> ### How this fits the RHYTHMIX repo
> **Already in use here.** `graphify-out/` exists at the repo root (CLAUDE.md
> lists it as the "Generated knowledge-graph snapshot. Do not hand-edit.", and
> `graphify-out/cache/` is gitignored). This doc is the reference for
> **regenerating and querying** that snapshot. With 100+ folders, 50+ HyperFrames
> Cut dirs, `studio/`, the site-build output, and a wall of `SETUP-*.md` docs,
> `graphify query "…"` is a faster way to answer "where does X live / what
> connects to Y" than grepping. Commit `graphify-out/` so the whole repo starts
> with the same map.

## Install

> **Package name gotcha:** the PyPI package is **`graphifyy`** (double-y). Other
> `graphify*` packages are **not** affiliated. The CLI command is still
> `graphify`.

**Step 1 — install the package** (needs Python 3.10+ and, ideally, `uv`):

```bash
# Recommended — isolated env (avoids the pip ModuleNotFoundError footgun):
uv tool install graphifyy
#   if 'graphify' isn't found after: uv tool update-shell, then open a new terminal

# Alternatives:
pipx install graphifyy          # then: pipx ensurepath
pip install graphifyy           # may need PATH setup; prefer uv/pipx on Mac/Windows
```

macOS prerequisites via Homebrew: `brew install python@3.12 uv`.

**Step 2 — register the skill with your assistant:**

```bash
graphify install                 # user profile (Claude Code by default)
graphify install --project       # or install into the current repo (.claude/skills/graphify/)
```

Then open your assistant and type `/graphify .`

Platform notes: **Codex** uses `$graphify` (not `/graphify`) and needs
`multi_agent = true` under `[features]` in `~/.codex/config.toml`. **PowerShell**
uses `graphify .` (no leading slash — it's a path separator on Windows). Other
platforms: `graphify install --platform <codex|opencode|gemini|copilot|…>`.

**Running without installing?** Name the *package*, not the command:
`uvx --from graphifyy graphify install` (plain `uvx graphify …` fails — uv reads
the first word as the package name).

### Optional extras

```bash
uv tool install "graphifyy[pdf]"        # PDF extraction
uv tool install "graphifyy[office]"     # .docx / .xlsx
uv tool install "graphifyy[video]"      # video/audio transcription (faster-whisper + yt-dlp)
uv tool install "graphifyy[mcp]"        # MCP stdio server
uv tool install "graphifyy[anthropic]"  # Claude API backend for headless extract
uv tool install "graphifyy[all]"        # everything
```

## Everyday use

```bash
/graphify .                        # build/refresh the graph for the repo
/graphify ./docs --update          # re-extract only changed files
/graphify . --no-viz               # report + JSON only (skip the HTML)
graphify export callflow-html      # Mermaid architecture / call-flow HTML page

/graphify query "what connects the studio license worker to the KV cache?"
/graphify path "SomeThing" "OtherThing"
/graphify explain "RateLimiter"

/graphify add https://arxiv.org/abs/1706.03762    # fetch a paper and add it
/graphify add <youtube-url>                        # transcribe a video and add it
```

**Make the assistant always consult the graph** (once per repo):

```bash
graphify claude install     # writes CLAUDE.md guidance + a PreToolUse hook that
                            # nudges toward `graphify query` before grep/Read
```

## Git hook + team workflow

`graphify-out/` is meant to be **committed** so everyone starts with the map.

```bash
graphify hook install        # post-commit rebuild (AST only — no API cost) +
                             # a git merge driver so graph.json never conflicts
```

Recommended `.gitignore` additions (this repo already ignores `graphify-out/cache/`):

```
graphify-out/cost.json       # local only
# graphify-out/cache/        # optional: commit for speed, or skip to keep the repo small
```

Ignore files: create a `.graphifyignore` (same syntax as `.gitignore`, incl. `!`
negation). `.gitignore` is respected automatically; `.graphifyignore` is merged
last and can only ever exclude *more*.

## Privacy

- **Code** — tree-sitter, fully local, no API key needed for a code-only corpus.
- **Video/audio** — transcribed locally (faster-whisper).
- **Docs / PDFs / images** — sent to your IDE session's model for semantic
  extraction. Headless `graphify extract` needs a backend key (or `--backend
  ollama` for fully local). No telemetry / analytics.
- Query logging is local (`~/.cache/graphify-queries.log`); disable with
  `GRAPHIFY_QUERY_LOG_DISABLE=1`.

## Notes

- On this repo's Mac, `mac-downloads/Install-Downloads.command` installs Graphify
  via `uv tool install graphifyy` (installing `uv` first if needed) and runs
  `graphify install` to register the Claude Code skill. It skips if `graphify` is
  already present.
- Source of truth is the upstream docs; this is a minimal install/reference
  snapshot. Re-run `graphify install` after upgrading (`uv tool upgrade
  graphifyy`) to refresh the skill file, and `graphify hook install` to refresh
  the embedded interpreter path in the git hooks.
