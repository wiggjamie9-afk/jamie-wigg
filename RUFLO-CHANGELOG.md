# Ruflo CLI Changelog

Release notes for the `@claude-flow/cli`, `claude-flow`, and `ruflo` packages, tracking fixes, infrastructure improvements, and security baselines.

---

## v3.10.46

**Subject:** Stale MCP key detection + autopilot/browser/wasm-agent tool restoration

### Fixes

**#2369 — Legacy MCP key detection + Scenario A warning**

If a user's project directory had an `.mcp.json` from a pre-rename install (pre-`ruflo` rename), `writeMCPConfig` was early-returning with a generic skipped message. The user was left with an MCP server pointing to a pre-rename build, missing autopilot, browser, wasm-agent, and other current tools, with zero indication of the problem.

**Fix:** `writeMCPConfig` now parses the existing file, detects stale keys (`claude-flow@alpha`, `claude-flow@v3alpha`), and surfaces:

```
.mcp.json (existing file uses deprecated key 'claude-flow@alpha' —
autopilot/browser/wasm-agent tools will be missing; delete .mcp.json
and re-run, or re-run with --force to overwrite)
```

Also fixed Scenario B: `detectExistingRufloMCP` now recognizes both legacy keys (`claude-flow`, `claude-flow@alpha`, `claude-flow@v3alpha`) and `ruflo` in both top-level and project-scoped registration paths.

**#2370 — swarm.ts MCP-down hint**

Failure hint changed from:
```
claude mcp add claude-flow npx claude-flow@v3alpha mcp start
```

To:
```
claude mcp add claude-flow -- npx -y ruflo@latest mcp start
```

The `--` separator avoids `claude-mcp` flag ambiguity; the `-y` forces a fresh fetch so `npx` doesn't pick a stale local install.

**#2371 — ContainerWorkerPool worker spawn**

`buildWorkerCommand()` was returning `['npx', 'claude-flow@v3alpha', 'daemon', 'trigger', ...]`. Two problems: the deprecated dist-tag, and the missing `-y` meaning `npx` could silently fall back to any locally-installed `claude-flow` without fetching the published version.

**Fix:** Now returns `['npx', '-y', 'ruflo@latest', 'daemon', 'trigger', ...]`.

### Tests

- `v3/@claude-flow/cli/__tests__/stale-mcp-key-2369.test.ts` — 10 tests pinning all three runtime contracts, plus a comment-stripped sanity sweep over `cli/src/` to prevent future re-introduction of deprecated dist-tags.
- All 11 existing init-wizard-bugs tests still pass.

### Packages

| Package | Old | New |
|---------|-----|-----|
| @claude-flow/cli | 3.10.45 | 3.10.46 |
| claude-flow | 3.10.45 | 3.10.46 |
| ruflo | 3.10.45 | 3.10.46 |

---

## v3.10.45

**Subject:** hive-mind `--dangerously-skip-permissions` and `--no-auto-permissions` flag handling

### Fixes

**#2269 — Complete flag predicate**

The arg parser converts kebab-case CLI flags to camelCase and stores only the normalized key. The original predicate in `hive-mind.ts` read only the kebab form for both activation and deny halves:

- `--dangerously-skip-permissions` silently no-op'd
- `--no-auto-permissions` silently no-op'd

PR #2301 (JOhnsonKC201's branch) fixed the activation half by accepting both kebab + camelCase keys, but the deny half was incomplete: the parser does NOT produce `noAutoPermissions: true` for `--no-auto-permissions` — it uses yargs-style negation and stores `autoPermissions: false`.

**Complete fix:**

```typescript
const skipPermissions =
  (flags['dangerously-skip-permissions'] === true || flags.dangerouslySkipPermissions === true) &&
  !(flags['no-auto-permissions'] || flags.noAutoPermissions || flags.autoPermissions === false);
```

### Tests

- Parser produces `autoPermissions: false` for `--no-auto-permissions`
- Predicate denies on the parser-produced shape `{ dangerouslySkipPermissions: true, autoPermissions: false }`
- `autoPermissions: true` is NOT a deny signal (only `=== false` is)
- Test suite: 9/9 pass. Closes #2269.

### Credits

- @JOhnsonKC201 (original PR #2301)
- @rvrheenen (reporter who supplied the patch)

### Packages

| Package | Old | New |
|---------|-----|-----|
| @claude-flow/cli | 3.10.44 | 3.10.45 |
| claude-flow | 3.10.44 | 3.10.45 |
| ruflo | 3.10.44 | 3.10.45 |

---

## v3.10.43

**Subject:** Model parameter validation, model slug updates, daemon lifecycle, federation plugin constraints

### Fixes

**#2357 — callAnthropicMessages() temperature parameter rejection**

`callAnthropicMessages()` always sent `temperature` (default 0.7), but Fable 5, Opus 4.8, and Opus 4.7 removed `temperature` / `top_p` / `top_k`. Every request returned:

```
400 invalid_request_error: temperature: Extra inputs are not permitted
```

Invisible on Claude-Max (no key → provider check short-circuits before fetch); fatal on a raw `ANTHROPIC_API_KEY`.

**Fix:** New `modelRejectsSamplingParams(model)` predicate gates the field. Sonnet 4.6 / Haiku 4.5 / Opus ≤ 4.6 unchanged.

Credits: @HF-teamdev (first-time contributor with file:line-cited finding map).

**#2365 — OpenRouter slugs refreshed to current 4.x family**

The OpenAI-compat path still referenced Oct-2025 retired model IDs:

```
default model:     anthropic/claude-3.5-sonnet → anthropic/claude-sonnet-4-6
haiku alias:       anthropic/claude-3.5-haiku → anthropic/claude-haiku-4-5
sonnet/inherit:    anthropic/claude-3.5-sonnet → anthropic/claude-sonnet-4-6
opus alias:        anthropic/claude-3-opus → anthropic/claude-opus-4-8
```

`OPENROUTER_DEFAULT_MODEL` still wins for callers who want to pin a specific slug.

**#2361 — daemon self-terminating TTL + global status + HNSW/init footguns**

The daemon ran interval workers (audit ~30m, optimize/testgaps ~60m, …) forever, each spawning a headless `claude --print` sweep. Audited evidence traced quota burn to 6 immortal daemons (oldest 19 days) and recurrence to 17 per-project daemons (34,533 total worker runs — ~94% of token spend was background machinery).

**Fix:** Self-terminating TTL, idle shutdown, daemon `status --all` (global, not just current workspace), honest HNSW reporting, init footgun guards.

Credits: @shaal (community PR addressing @pacphi's ruflo-machine-ref investigation).

**#2364 — federation plugin: cap agentic-flow peer to <2.0.13**

Upstream `agentic-flow@2.0.13` dropped the `./transport/loader` subpath. Runtime impact was bounded — `midstream-aware-loader.ts` wraps the dynamic import in try/catch and falls back to midstream-native — but the peer range previously said `>=2.0.12-fix.8` and silently accepted 2.0.13.

**Fix:** Tightened to `>=2.0.12-fix.8 <2.0.13` so `npm install` warns about the incompat instead of hiding it behind a silent fallback.

### Still Open

**Finding B (Fable routing tier RFC, PR #2359)** — behavior-neutral, 21/21 tests green, awaiting maintainer decision before the June 22 Max-plan API-credits window.

### Packages

| Package | Old | New |
|---------|-----|-----|
| @claude-flow/cli | 3.10.42 | 3.10.43 |
| claude-flow | 3.10.42 | 3.10.43 |
| ruflo | 3.10.42 | 3.10.43 |

---

## v3.10.42

**Subject:** Windows path validation, trajectory feedback distillation, init hooks configuration

### Fixes

**#2352 — hooks post-edit: Windows paths rejected, failure printed as [OK]**

`validatePath` used the general `SHELL_META` set which includes `\`, so every absolute Windows path (`E:\Repos\…`) failed with "shell metacharacters". Claude Code hook events deliver absolute paths in `tool_input.file_path`, so every forwarded post-edit call failed silently on Windows.

The CLI action printed `[OK] Outcome recorded for …` whenever the MCP call returned at all, masking the failure.

**Fix:** Now checks `result.success`, surfaces the error, and exits non-zero. Windows paths accepted; POSIX paths, shell metacharacters, and traversal attacks still rejected.

**#2351 — trajectory-end: step-less feedback never distilled**

When `trajectory-end` is called with feedback but no recorded steps (the common LLM-agent case), the feedback was persisted with the trajectory but never embedded as a searchable pattern — `patternsExtracted` always reported 0 and pattern-search never surfaced it.

**Fix:** Routes the trimmed feedback through `bridge.bridgeStorePattern` (or store-fallback) with modest default confidence, tagged `trajectory-feedback`. New `feedbackDistilled.{patternId, controller}` field on the response.

**#2350 — init hooks: subcommand wrote no hooks block to settings.json**

The settings generator gates the `hooks` block on `components.helpers` (the hook commands point at the helper script). The `init hooks` subcommand had `helpers: false`, so the one subcommand whose purpose is "Initialize only hooks configuration" produced `settings.json` with no `hooks` key while reporting "N hooks enabled".

**Fix:** Helpers now ship with the subcommand.

### Tests

- `validate-input-path-2352.test.ts` — 22 tests pinning Windows-path acceptance, POSIX still works, all shell metacharacters and traversal still rejected.
- All existing validate-input, init-wizard-bugs, hooks-intelligence-learning, hooks-post-task tests still pass.

### Packages

| Package | Old | New |
|---------|-----|-----|
| @claude-flow/cli | 3.10.41 | 3.10.42 |
| claude-flow | 3.10.41 | 3.10.42 |
| ruflo | 3.10.41 | 3.10.42 |

---

## v3.10.41

**Subject:** Statusline CPU efficiency, process lifecycle, session file atomicity

### Fixes

**#2337 — fix(statusline): resolve installed CLI bin + bump cache TTL 10s→60s**

The statusline was calling `npx --yes @claude-flow/cli@latest hooks statusline --json` on every render — the `@latest` tag forced npm registry re-resolution per call. With ~6 concurrent sessions on a 12-core box: load average 40–65, each `npm exec` consuming 55–90% of a core.

**Fix:** New `resolveCliBin()` finds an installed `bin/cli.js` (project / monorepo / plugin marketplace / global node_modules — covers `~/.npm-global` and similar custom-prefix layouts) and invokes it via `process.execPath` directly. Falls back to `npx --prefer-offline @claude-flow/cli` (no `@latest`) when nothing's installed. Cache TTL 10s→60s. Applied to both the dogfood helper and the ruflo init generator template.

Credits: @shaal (detailed report with %CPU measurements).

**#2297 — fix(hive-mind): await spawned claude before returning**

The parent process exited immediately after `spawn`, the child claude lost its controlling terminal mid-init, and the terminal's capability-query response leaked onto the next shell prompt.

**Fix:** `spawnClaudeCodeInstance()` now awaits the child's exit (or error) before returning. The existing `claudeProcess.on('exit', …)` log lines actually print now, and the non-interactive (`-p` / `--non-interactive`) path completes only after Claude Code does.

Credits: @clement-livdeo (XTVERSION-on-prompt diagnostic that nailed the root cause).

**#2307 — fix(session): atomic writes to current.json + corrupted-file self-heal**

Per-fd-offset semantics in `writeFileSync` meant a shorter payload could overwrite the start of a longer one without shrinking the file, leaving the longer payload's tail dangling past the end (valid JSON + trailing garbage).

**Fix:** All 5 session-file writes go through a new `atomicWrite()` (temp file + rename()). `restore()` wraps `JSON.parse` in try/catch so existing corrupt files self-heal by starting a fresh session instead of throwing.

Credits: @BIWizzard (diff highlighting the same class as #1707 / #1637 which were fixed elsewhere).

### Infrastructure

**ADR-147 — Nested subagent depth=5 integration (PR #2336)**

Captures Boris Cherny's nested-subagent announcement with full empirical block, the ruflo agent files (8 new agents + 1 skill) that opt into nested spawning via `tools: [Task, …]`, P2 stage 1 (CLI flags + MCP schema for capturing `parent_agent_id` in the post-task hook), and a regression probe in `scripts/probe-nested-spawn-depth.mjs`.

**Empirically determined:** Declaring `tools: [Task]` in YAML is necessary but not sufficient in CLI 2.1.169 — the runtime applies a hardcoded denylist that strips Task at parent→child spawn time. Documented in the ADR with the spawn-tree for when the upstream denylist lifts.

**Security baseline (PR #2340)**

`docs/security/socket-baseline.md` documents every category in the Socket.dev alert page for `claude-flow@3.10.40` — what's protected by root overrides, what's not cleanly fixable from inside claude-flow (consumer-side npm overrides only apply at the dep-tree root), what's inherent to a CLI agent platform (filesystem/network/shell access etc.), and the false positives (Socket's "did you mean z-schema?" suggestion against zod). Also removes the broken `pages.yml` workflow that had failed 10+ consecutive runs.

### Still Open

- **#2305** — embedding model/dimension ignored at runtime (architectural; awaiting reporter's config-chain design as PR)
- **#2296** — 7 controllers null from version skew between @claude-flow/memory@3.0.0-alpha.19 and agentdb@3.0.0-alpha.16 (needs coordinated package republish)

### Packages

| Package | Old | New |
|---------|-----|-----|
| @claude-flow/cli | 3.10.40 | 3.10.41 |
| claude-flow | 3.10.40 | 3.10.41 |
| ruflo | 3.10.40 | 3.10.41 |

---

## v3.10.38

**Subject:** Security build integrity, Ed25519 signature verification, CI heap allocation

### Fixes

**#2311 — @claude-flow/security standalone TypeScript build**

`integrity-verifier.ts` imported `@noble/ed25519` but the dep was never declared on the package itself (root override didn't propagate — same lesson as #2112). Added directly to `v3/@claude-flow/security/package.json`. Unblocks the ToolOutputGuardrail smoke (ADR-131) job and the broader pipeline outage tracked in #2275.

**#2274 — verify.mjs crashed on @noble/ed25519 v2**

`verify.mjs:175` unconditionally assigned `ed.etc.sha512Sync`; on the v2 patch releases that freeze `etc`, this throws `TypeError: Cannot add property sha512Sync, object is not extensible` and skips every signature check.

**Fix:** Wrapped in `if (!ed.etc.sha512Sync)` plus a try/catch — `sha512Sync` is already wired internally on v2, so the shim is only needed on v1.

**Validated against macOS, Linux, and Windows manifests on this checkout:** Ed25519 signature valid: yes on all three, regressed=0 missing=0.

**#2312 — smoke-trajectory-graph-edges.mjs OOM**

TEST 2's post-task chain (intelligence.recordTrajectory → @ruvector/ruvllm SonaCoordinator) blew past the default 4 GB heap, causing exit 134.

**Fix:** Bumped `NODE_OPTIONS=--max-old-space-size=6144` on the CI step so the job completes. The underlying allocation profile in @ruvector/ruvllm is tracked as a follow-up.

### Not in This Release

- **#2286** — `npx @claude-flow/cli@alpha --version` 60s timeout is install-bandwidth + postinstall, not CLI startup. The `--version` fast-path has been in place since 3.10.33 and exits before any heavy import. Verification harness measures cold `npx -y` which includes downloading the tarball + 300+ deps — nothing to fix in code.
- **#2319** — `agentic-flow ./transport/loader` export missing is an upstream issue (ruvnet/agentic-flow#153, plus a broken `@fix` dist-tag install). Cannot be fixed from this side until upstream lands the loader export in the stable `^2` release.

### Packages

| Package | Old | New |
|---------|-----|-----|
| @claude-flow/security | 3.0.0-alpha.8 | 3.0.0-alpha.10 |
| @claude-flow/cli | 3.10.37 | 3.10.38 |
| claude-flow | 3.10.37 | 3.10.38 |
| ruflo | 3.10.37 | 3.10.38 |

Note: `@claude-flow/cli`'s `@claude-flow/security` dep now pins `^3.0.0-alpha.10` so wrapper users pick up the security fixes automatically.

---

## @claude-flow/memory v3.0.0-alpha.20

**Subject:** Entity arm + signal provenance in hybridSearch controller

### Features

**Entity-tagger extractor**

`entity-tagger.ts` — regex extractor for:
- Emails
- URLs
- File paths (POSIX + Windows)
- Quoted phrases
- Proper-noun 2-grams

Deliberately conservative: false negatives OK, false positives would dilute RRF (reciprocal rank fusion).

**hybridSearch three-arm parallel execution**

`hybridSearch` now runs in parallel:
1. Dense (vector embedding)
2. Sparse (BM25 keyword match)
3. Entity (per-token keyword scan, gated on `extractEntities(query).length > 0`)

Empty entity set drops the arm rather than passing `[]` to dilute fusion.

**Signal provenance**

`('vector' | 'bm25' | 'entity')[]` on every fused result. Computed by pre-fusion set membership; lets callers debug which arms surfaced an entry without re-running the search.

### Capability Smoke Test

Corpus: 30 generic "authentication" entries + 1 "Alice Smith" needle.  
Query: `"Alice Smith authentication"`:

```
score=0.0477  signals=["vector","bm25","entity"]  key=alice-needle      ← #1
score=0.0323  signals=["vector","bm25"]           key=generic-1
score=0.0323  signals=["vector","bm25"]           key=generic-0
score=0.0313  signals=["vector","bm25"]           key=generic-3
score=0.0301  signals=["vector","bm25"]           key=generic-2
```

Alice ranks #1 with full triplet provenance — runners-up only fire on vector + sparse. ~47% RRF score boost from the entity signal.

### Tests

- 12 new `entity-tagger.test.ts` (regex pinning — generic prose returns empty, and/or → empty, "a" over "b" → empty, single capitalized words → empty)
- 2 new `graceful-retrieval.test.ts` ADR-147 assertions (signal provenance on every fused result; needle-in-haystack)
- Full memory suite: 416/420 (4 pre-existing Windows-env failures in agent-memory-scope, auto-memory-bridge, benchmark — untouched files)

### What This Implements vs the Dream-Cycle ADR

ADR-147 split the work as P1 "wire FTS5 + RRF fusion" and P2 "entity arm + provenance". Investigation found P1 was already shipped in `controller-registry.ts:713` before the ADR was filed — `applyRRF(k=60)` + `applyMMR(λ=0.7)` over dense + sparse was already in. **This release lands the actual gap, P2.**

### Out of Scope (Follow-ups)

- **Dedicated SQL entity index** — current per-entity `searchKeyword` calls are fine for typical query entity counts (1–3); unbounded if a query mentions 20+. A future ADR can add an `entity_index` table for hard-bound latency.
- **Async writes by default (ADR-147 P3)** — orthogonal; consolidator already handles HNSW background rebuild.
- **LoCoMo benchmark publication (ADR-147 P4)** — needs harness wiring + dataset access; separate workstream.

### Packages

| Package | Old | New |
|---------|-----|-----|
| @claude-flow/memory | 3.0.0-alpha.19 | 3.0.0-alpha.20 |
| @claude-flow/cli | 3.10.38 | 3.10.39 |
| claude-flow | 3.10.38 | 3.10.39 |
| ruflo | 3.10.38 | 3.10.39 |

Note: `@claude-flow/cli`'s `@claude-flow/memory` dep pinned to `^3.0.0-alpha.20` so wrapper users get the entity arm automatically. `v3/pnpm-lock.yaml` regen included (lesson from #2311 — bumping a workspace dep without lockfile regen breaks `pnpm install --frozen-lockfile`).

---

## v3.7.0-alpha.76

**Subject:** Consolidated alpha release (alpha.72 → alpha.76, May 20–21, 2026) — init bundle reduction, GitHub stack modernization, neural-trader substrate

### Overview

Consolidated release covering 5 alpha bumps across three packages: `@claude-flow/cli`, `claude-flow` (umbrella), `ruflo` (wrapper). All available on `latest`, `alpha`, `v3alpha` dist-tags.

### Major Changes

**ADR-128 — Init bundle reduce + refactor (alpha.76)**

**Default agent count:** 98 → 17
- `agents.all` default flipped from `true` to `false`
- Domain-specific subtrees (flow-nexus/, payments/, data/) now opt-in via `--all-agents` or explicit `--agent-category`

**Default command count:** 176 → 16
- 9 truly-orphan flow-nexus/ commands deleted
- 78 ambiguous ones promoted to first-class `COMMANDS_MAP` keys

**Skill source-of-truth fix**
- The cli npm package now ships 34 SKILL.md files inside `.claude/skills/`
- Previously, fresh users got whatever was in `~/.claude/skills/` from prior installs — a stale-state trap
- `findSourceDir`'s existing guard at `executor.ts:1974` now resolves to the package's bundled skills first

**9 forked agents removed from init template** (let plugins own them)
- Largest divergence: memory-specialist.md at 1,049 diff lines vs the ruflo-rag-memory plugin copy

**New CI smoke:** `smoke-init-bundle-invariants.mjs` asserts no orphans, no plugin-init agent overlap, every skill dir has a SKILL.md.

**PRs:** #2096 (ADR), #2097 (impl) | Closes #2095

**ADR-127 — .github stack modernization (alpha.74, alpha.75)**

**Static-contract smokes for .github skills/agents/commands surface:**

- `smoke-github-safe-injection.mjs` — 10 adversarial body cases through both github-safe.js copies (backticks, `$()`, semicolons, >256KB, empty). Accepts both helper-side rejection and kernel-side E2BIG (Linux argv limit).
- `smoke-github-actions-pins.mjs` — asserts every `uses:` is SHA-pinned or in `.github/supply-chain/allowed-deps.json`.
- `smoke-deprecated-actions.mjs` — scans 5 trees; fails on `actions/checkout@v3`, `actions/setup-node@v3`, `actions/create-release@*`, `actions/upload-release-asset@*`.
- `smoke-attribution-opt-in.mjs` — no hardcoded attribution strings; opt-in template variables only.

**github-safe.js v1.0.0** — exposes `GITHUB_SAFE_VERSION`, enforces 256 KB body cap.

**Injection fix** — `swarm-pr.md` + `swarm-issue.md`: `${{ github.event.comment.body }}` now goes through `mktemp` temp-file indirection (both dogfood and init-template copies).

**Action versions upgraded** — All `actions/checkout@v3` → `@v4` across:
- 5 skills
- 13 agents
- 19 commands
- 5 init-template agents (post-publish follow-up in alpha.75)

**Supply-chain tracking** — `.github/supply-chain/allowed-deps.json` gains an `actions` block alongside the existing 5-layer npm audit.

**PRs:** #2090 (ADR), #2094 (impl), b4e177667 (alpha.75 follow-up) | Closes #2089

**ADR-126 — Neural-trader substrate integration (alpha.71 in prior release; substrate at alpha.76)**

Bench/perf/security suite shipped as PR #2081:
- 4 new benchmarks under `plugins/ruflo-neural-trader/benchmarks/`:
  - signal-generation
  - backtest-throughput
  - memory-recall
  - portfolio-cg
- 18% Neumann perf gain in `sublinear-adapter.mjs` via ping-pong Float64Array buffers
- 3-layer supply-chain + static-secret audit

### Bug Fixes

| Issue / PR | Fix |
|-----------|-----|
| #2073 (memory export returned null values) | `listEntries` and `bridgeListEntries` gain an `includeContent` flag; memory_export MCP tool now passes it. Also adds `memory retrieve --value-only` for pipe-friendly extraction. |
| #2078 (Co-Authored-By trailer added ruv@ruv.net to user repos) | settings-generator.ts now uses `ruflo-bot <ruflo-bot@users.noreply.github.com>` for opt-in attribution. |
| #2080 / Task #55 (native sublinear CG dispatch) | sublinear-adapter.ts detects MCP-tool availability via `globalThis` probe + `RUFLO_SUBLINEAR_NATIVE` env var. 40–60× speedup when native is present. |
| #2086 (ruvllm WASM bootstrap not exposed via MCP) | `loadRuvllmWasm()` now awaits `mod.initRuvllmWasm()`. `ruvllm_status` deliberately uses a separate un-init loader so it stays a pure diagnostic. New CI smoke `smoke-ruvllm-wasm-auto-init.mjs` guards 12 invariants. Closes #2086. |

### CI / Supply Chain Additions

**5 new smoke jobs gating future regressions** (all path-filtered):

1. `ruvllm-wasm-auto-init-smoke` (#2086)
2. `github-safe-injection-smoke` (#2089)
3. `github-actions-pins-smoke` (#2089)
4. `deprecated-actions-smoke` (#2089)
5. `init-bundle-invariants-smoke` (#2095)

Plus tighter scan coverage in `smoke-deprecated-actions.mjs` (5 trees instead of 3, catches both dogfood and init-template subtrees).

### Upstream Coordination

**ruvnet/neural-trader PRs #132–#138** all merged + workflow fix (PR #139) to replace deprecated `actions/{create-release,upload-release-asset}@v1` with native `gh release create` / `gh release upload`. Tagged v2.9.0 there (CI publish gated on Actions budget).

### Installation / Upgrade

```bash
npx ruflo@latest init
# default install now ships 17 agents + 16 commands + 30 skills + helpers
# (vs the 98/176/0 of alpha.71)
```

Or upgrade in place:

```bash
npm i -g ruflo@latest          # 3.7.0-alpha.76
npm i -g @claude-flow/cli@latest
```

### Out of Scope (Flagged for Follow-up)

- **General plugin-vs-plugin collision** — Two plugins both shipping agents/coder.md. ADR-128 Phase 2 shrank the init-template-vs-plugin surface but didn't solve the plugin-vs-plugin case. Needs its own ticket.
- **pull_request_target + secrets.* TOCTOU scan** (Layer 6 in supply-chain audit) — Informational-only, no hard-fail precedent yet.
- **Dependabot / Renovate for uses: refs** — Net-new automation pattern, would need its own ADR.

### Closed in This Release

Issues: #2073, #2078, #2086, #2089, #2095  
PRs: #2077, #2079, #2080, #2081, #2088, #2090, #2094, #2096, #2097

### Packages

| Package | Version |
|---------|---------|
| @claude-flow/cli | 3.7.0-alpha.76 |
| claude-flow | 3.7.0-alpha.76 |
| ruflo | 3.7.0-alpha.76 |

All available on `latest`, `alpha`, `v3alpha` dist-tags.

---

## v3.8.0

**Subject:** Full rvagent integration with MCP tools, WASM agent composability, and SOTA performance

### Features

**ADR-129 — Full rvagent integration (PR #2123)**

**16 new MCP tools** for WASM agent gallery & introspection:
- 10 CRUD operations
- 6 query operations

**wasm_agent_compose with addMcpTools bridge** unlocking all 314 MCP tools to WASM agents.

**JsModelProvider real provider routing** (replaces the echo-stub bypass).

**Plugin contract:** `rvagent` field on plugin manifest + `includePlugins` option in compose.

### Fixes

**#2120 — getBridge() bridge-disable honor**

`getBridge()` now honors `CLAUDE_FLOW_DISABLE_BRIDGE=1`, fixing the legacy-DB status backfill regression that caused ruflo memory stats to report 0 entries against pre-status-column databases.

### Performance (PR #2124 — SOTA comparator benchmarks)

**4 production speedups on wasm_agent_compose hot path** (all in `wasm-agent-tools.ts`):

1. Plugin manifest cache — 21-plugin overhead: 0.196ms → 0.001ms
2. isDestructiveTool fast-path — suffix check before 8-regex battery
3. Hoisted Buffer import — eliminates `await import('node:buffer')` microtask per call
4. Memoized loadAgentWasm() — module-level promise singleton for all 20 MCP handlers

**Cumulative compose_50_tools: 0.351ms → 0.146ms (2.4× improvement)**

#### SOTA Benchmark Matrix

Verified against LangGraph 1.2.1, AutoGen 0.4.9, CrewAI 0.80.0 on darwin-arm64 + linux-x64:

| Dimension | ruflo | AutoGen | LangGraph | CrewAI |
|-----------|-------|---------|-----------|--------|
| Cold start | 3.93ms | 185ms | 534ms | 2527ms |
| Single turn | 0.012ms | 6.13ms | 37.1ms | proxy† |
| N=10 parallel | 1.27ms | 61ms | 393ms | proxy† |
| RSS | 61.6MB | 78.7MB | 80.3MB | 265.7MB |

† CrewAI dispatch proxied (requires real LLM).

**Full methodology, Linux numbers, concurrency scale, v3.7→v3.8 delta:** https://gist.github.com/ruvnet/298f8c668c8859b369f91734a0e9cbbe

#### Benchmark Results (5-trial median, bench-rvagent.mjs)

- Provider routing: 0.025ms (fake key, router only)
- Compose 100 tools: 0.215ms
- Gallery CRUD cycle: 0.094ms
- Plugin enum (absent): 0.035ms

### Witness Manifest

ADR-129 P1–P4 fix entries registered (verification/witness-fixes.json, 117/117 verified).

### Packages

| Package | Version |
|---------|---------|
| @claude-flow/cli | 3.8.0 |
| claude-flow | 3.8.0 |
| ruflo | 3.8.0 |

All three packages available across `latest`, `alpha`, `v3alpha` dist-tags.

---

## v3.10.6

**Subject:** Silent write loss on Node 24/26, pattern store/search mismatch, route feedback, statusline version, flashAttention state

### Fixes

**🔴 #2219 — Silent write loss on Node 24/26**

`agentdb` declares `better-sqlite3` as an optional dependency at `^11.8.1`, which has no prebuilt binary for Node 24/25/26. On those runtimes the optional native build fails silently (optional deps never error), and AgentDB drops to a non-persistent backend — stores appear to succeed but never land on disk.

**Fix:** Override `better-sqlite3` → `>=12.8.0` (ships Node 20–26 prebuilds) in both the root umbrella and the ruflo wrapper (root overrides don't propagate to the published wrapper — the #2112 lesson). A new CI guard (`audit-better-sqlite3-override.mjs`) keeps the override pinned so this can't regress.

**Action for existing installs:** If you installed globally on Node 24/26 before this release: `npm i -g ruflo@latest` restores the native backend.

Credits: @pacphi (first reporter, verified against source).

**🔴 #2226 — agentdb_pattern-store / agentdb_pattern-search never agreed**

The store and search MCP tools hit disjoint backends, so a stored pattern was never returned by search. Two paths fixed:

1. **Controller present:** `bridgeSearchPatterns` now reads `LocalReasoningBank.findSimilar/getAll` — the same backend the store writes to.
2. **Controller absent** (the common case): the memory-store-fallback search now hydrates each entry's content via `getEntry` before matching — `listEntries` returns metadata only (see #2014), so the substring scan previously matched nothing.

Credits: @casparml (detailed store→search roundtrip analysis).

**🟠 #2222 — route feedback was a no-op**

Feedback applied the Q-learner update in memory, but the CLI process exits before the `autoSaveInterval` flush fires, so route-learning never persisted across invocations.

**Fix:** Explicit awaited `router.saveModel()` after feedback.

**🟡 #2221 — Statusline showed RuFlo V3.6 on global installs**

`getPkgVersion()` never probed the global npm root, so `npm i -g ruflo` fell back to the hard-coded default version.

**Fix:** Derive the global `node_modules` dir from `process.execPath` (no npm spawn — statusline renders often); covers nvm/mise and Windows layouts.

**🟡 #2215 — flashAttention reported contradictory state**

`system_info` emitted a hard-coded `flashAttention: false` while `hooks_intelligence` reported the live probe.

**Fix:** `system_info` now runs the same `getFlashAttention()` probe as the authoritative path, so the two tools can't disagree.

Credits: @HF-teamdev (identified the contradiction in parallel tool outputs).

### Tests

- New regression suite `bug-cluster-2219-2226.test.ts` — 5/5 (incl. end-to-end store→search roundtrip)
- Statusline drift guard — 8/8 (regenerated `.cjs` byte-identical to generator)
- `tsc` clean; CI 29/29 green including the new `better-sqlite3` override guard

### Packages

| Package | Old | New |
|---------|-----|-----|
| @claude-flow/cli | 3.10.38+ | 3.10.6 |
| claude-flow | 3.10.38+ | 3.10.6 |
| ruflo | 3.10.38+ | 3.10.6 |

All three packages published at **3.10.6** with `latest`/`alpha`/`v3alpha` in lockstep.

---

## Installation / Upgrade

```bash
npx ruflo@latest init
# or
npx claude-flow@latest
# or
npm install @claude-flow/cli@latest
```

All three packages available across all dist-tags (`latest`, `alpha`, `v3alpha`).
