# Releases

## v3.7.0-alpha.33 — 2026-05-14

Cumulative batch release closing out an issue-triage cycle. The prior bumps (`.28 → .32`) shipped their fix-sets to npm immediately but had no GitHub Release writeup; this is the consolidated changelog.

### Memory layer (8 fixes)

| Issue | Fix |
| --- | --- |
| #1947 | `vector_indexes` schema dim `768 → 384` (default model `Xenova/all-MiniLM-L6-v2` is 384-dim — schema mismatch silently made every `memory_search` return 0). |
| #1942 | Bridge search index 768 vs imported 384-dim — same root cause as #1947, observed via the Bridge import path. |
| #1952 | Windows: `memory store` ok, `search` returns 0 — same root cause as #1947, observed on a Windows install. |
| #1945 | CLI `memory store` reported success but didn't persist on non-default memory paths — `memory-bridge.ts::getDbPath()` hard-coded `<cwd>/.swarm/memory.db` and ignored `CLAUDE_FLOW_MEMORY_PATH` / `claude-flow.config.json#memory.persistPath`. |
| #1946 | `ruflo doctor` reported DB "Not initialized" on a valid DB at `data/memory/memory.db` — same hard-coded-path family as #1945. |
| #1941 | `memory_search` returned 0 for non-default namespaces — every store path now `INSERT OR IGNORE`s a per-namespace `vector_indexes` row before the entry insert. |
| #1940 | `memory_bridge_status` reported `totalEntries: 0` on DBs with hundreds of rows — used `listEntries({}).entries.length` (page-size capped at 20) instead of `.total`. |
| #1939 | Win32 `memory_import_claude({allProjects:false})` returned 0 — slug logic only replaced forward slashes, never drive-colon / backslash / whitespace. |
| #1947 RC #2 | `embeddings index -a build` required `-c` (the HNSW index is global; the flag was always informational). Now optional. |

### Hooks layer (2 fixes)

| Issue | Fix |
| --- | --- |
| #1944 | `pre-bash` printed `` TypeError: (hookInput.command `` — handler / template fell back to a bare `toolInput` (object) instead of `toolInput.command` (string). |
| #1943 | Every Bash / Edit / Session hook fired `MODULE_NOT_FOUND` on a global-install layout — paths were anchored at `${CLAUDE_PROJECT_DIR}` only. Now probes project-local first, falls back to `$HOME`. |

### UI / statusline (2 fixes)

| Issue | Fix |
| --- | --- |
| #1953 | `hooks_pretrain` reported `patternsExtracted: 0` on Markdown-heavy repos — used a separate `codeFilesScanned` budget, sorts `readdir` code-likely dirs first, widened scan window `30 → 80` lines, added `.tsx` / `.jsx` / `.mjs` / `.cjs`. |
| #1951 | Statusline showed hard-coded `RuFlo V3.5` regardless of installed version — now probes `~/.claude/plugins/marketplaces/ruflo/package.json` first. |

### Verification (1 unblock)

| Issue | Fix |
| --- | --- |
| #1949 | Federation plugin install `403` on `cookies@0.9.1` (the latest published version, but blocked by registry security policy). Added `scripts/verify-federation-plugin.sh` that pins `cookies@0.9.0` at the verification harness root — both Check 2 (exports) and Check 3 (breaker wire-up) pass. Workaround until upstream `pipenet → koa → cookies` ships a non-blocked release. |

### CI regression guards baked in

- `scripts/audit-vector-dim.mjs` — fails the build if any `vector_indexes` row's `dim ≠ 384` (#1947 guard).
- `scripts/audit-hook-handler-prompt.mjs` — fails the build if any handler / template falls back to a bare `toolInput` (object) instead of `toolInput.command` (string) (#1944 guard).

Both wired into the existing `witness-verify` and `hook-command-audit` jobs in `.github/workflows/v3-ci.yml`.

### Install

```bash
npx @claude-flow/cli@latest --version    # 3.7.0-alpha.33
npx ruflo@latest --version               # 3.7.0-alpha.33
npx claude-flow@latest --version         # 3.7.0-alpha.33
```

All three packages on `alpha`, `latest`, and `v3alpha` tags (where applicable).

### Still open (not in this release)

- **#1948** — Win32 random temp files in repo root (`0`, `toastr.error(...)`). Vague repro; needs reporter to narrow which tool path creates them.
- **#1937** — Feature request: per-file exclusion for `memory_import_claude`. Design work, not a bug.

### PRs in this release

#1956 · #1957 · #1959 · #1960 · #1961 · #1962 · #1963 · #1964 · #1965
