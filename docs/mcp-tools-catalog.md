# MCP Tools Catalog (v3.5.59)

A reference catalog of MCP tools, CLI commands, plugins, agents, and background
workers exposed by the platform, with the v3.5.59 production-grade upgrades.

## 314 MCP Tools by Category

| Category | File | Tools | Description |
| --- | --- | --- | --- |
| Hooks & Intelligence | `hooks-tools.ts` | 62 | Lifecycle hooks, intelligence trajectories, workers, sessions, coverage routing |
| Browser Automation | `browser-tools.ts` | 23 | Web interaction — click, fill, screenshot, snapshot, evaluate, navigate |
| Guidance & Discovery | `guidance-tools.ts` | 21 | Capability discovery, workflow recommendations, quickref |
| AgentDB | `agentdb-tools.ts` | 15 | ReasoningBank, hierarchical memory, semantic routing, causal edges, batch ops |
| System Health | `system-tools.ts` | 15 | Health checks, metrics, status monitoring, system info, reset |
| Claims & Authorization | `claims-tools.ts` | 12 | ADR-016 issue claims, handoffs, stealing, rebalancing, board view |
| Transfer & Registry | `transfer-tools.ts` | 11 | IPFS plugin registry, store search, PII detection, pattern transfer |
| Autopilot | `autopilot-tools.ts` | 10 | Persistent completion management, learning, prediction, progress |
| ruvLLM / WASM | `ruvllm-tools.ts` | 10 | HNSW routing, SONA adaptation, MicroLoRA, chat formatting |
| Swarm Orchestration | `swarm-tools.ts` | 10 | Swarm init, status, health, shutdown |
| Workflow | `workflow-tools.ts` | 10 | Workflow create, execute, run, pause, resume, cancel, templates |
| WASM Agents | `wasm-agent-tools.ts` | 10 | Sandboxed agents with virtual filesystem, gallery, tool exec |
| Hive-Mind Consensus | `hive-mind-tools.ts` | 9 | Queen-led Byzantine consensus, broadcast, memory, spawn |
| DAA | `daa-tools.ts` | 8 | Decentralized autonomous agents, cognitive patterns, knowledge sharing |
| Agent Lifecycle | `agent-tools.ts` | 7 | Spawn, list, status, terminate, update, pool, health |
| Coordination | `coordination-tools.ts` | 7 | Consensus, topology, load balancing, sync, node management, metrics |
| Embeddings | `embeddings-tools.ts` | 7 | Vector embeddings, Poincaré ball, ONNX neural, search, compare |
| Memory | `memory-tools.ts` | 7 | Store, retrieve, search, list, delete, stats, migrate |
| Task Management | `task-tools.ts` | 7 | Create, assign, status, complete, cancel, list, summary |
| Code Analysis | `analyze-tools.ts` | 6 | Diff analysis, risk assessment, reviewer suggestions, classification |
| Configuration | `config-tools.ts` | 6 | Get, set, list, import, export, reset |
| Neural Learning | `neural-tools.ts` | 6 | Train, status, patterns, predict, optimize, compress |
| Performance | `performance-tools.ts` | 6 | Benchmark, profile, metrics, optimize, bottleneck, report |
| Security / AIDefence | `security-tools.ts` | 6 | Scan, analyze, PII detection, learning, safety checks, stats |
| Terminal | `terminal-tools.ts` | 6 | Create, execute, close, list, history |
| GitHub Integration | `github-tools.ts` | 5 | Repo analyze, PR manage, issue track, workflow, metrics |
| Session | `session-tools.ts` | 5 | Save, restore, list, delete, info |
| Progress Tracking | `progress-tools.ts` | 4 | Check, summary, sync, watch |
| Coverage Routing | `coverage-tools.ts` | 3 | Coverage-aware routing, gap detection, suggestions |
| **TOTAL** | **29 files** | **314** | |

## 38 CLI Commands (140+ Subcommands)

| Command | Subs | Description |
| --- | --- | --- |
| `agent` | 10 | spawn, list, status, stop, metrics, pool, health, logs, auto-scale, follow |
| `swarm` | 8 | init, start, stop, status, scale, monitor, coordinate, observe |
| `memory` | 14 | store, retrieve, search, list, delete, init, export, import, stats, cleanup, configure, migrate, compress, rebuild-index |
| `task` | 8 | create, list, status, assign, cancel, retry, logs, reset-state |
| `session` | 9 | save, restore, list, delete, export, import, activate, current, active |
| `mcp` | 11 | start, stop, status, restart, exec, config, logs, list, enable, disable, toggle |
| `hooks` | 41 | 27 hooks + 12 workers + intelligence sub-system (trajectory, patterns) |
| `init` | 8 | wizard, check, upgrade, full, minimal, skills, hooks, settings |
| `status` | 6 | status, health-check, agents, memory, tasks, watch |
| `start` | 6 | start, stop, restart, daemon, force, skip-mcp |
| `neural` | 11 | train, status, patterns, predict, optimize, export, import, benchmark, compile, verify, evaluate |
| `security` | 8 | scan, audit, cve, threats, validate, report, defend, check |
| `performance` | 7 | benchmark, profile, metrics, optimize, bottleneck, analyze, report |
| `embeddings` | 17 | embed, batch, search, init, compare, configure, models, check, cache, normalize, test, generate, export, import, status, consolidate, benchmark |
| `hive-mind` | 13 | init, join, leave, spawn, broadcast, memory, consensus, status, shutdown, optimize-memory, save-state, watch, metrics |
| `guidance` | 8 | compile, apply, optimize, ab-test, status, retrieve, gates, command |
| `autopilot` | 12 | enable, disable, status, config, learn, predict, history, reset, check, log, watch, clear |
| `config` | 9 | init, get, set, add, remove, export, import, reset, providers |
| `daemon` | 7 | start, stop, status, trigger, enable, disable, logs |
| `doctor` | 2 | doctor with `--fix` |
| `completions` | 6 | bash, zsh, fish, powershell |
| `migrate` | 7 | status, run, verify, rollback, check, dry-run, fix |
| `workflow` | 8 | create, run, list, status, validate, watch, stop, show |
| `analyze` | 13 | diff, code, ast, dependencies, complexity, boundaries, circular, imports, modules, outdated, symbols, partitions, security |
| `route` | 10 | route, list-agents, explore, suggest, feedback, export, import, stats, reset, q-learning |
| `progress` | 6 | check, summary, sync, watch, detailed, interval |
| `issues` | 12 | claim, handoff, list, steal, stealable, release, status, load, mine, board, apply, rebalance |
| `update` | 7 | check, all, history, rollback, clear-cache, dry-run, force |
| `plugins` | 11 | list, install, uninstall, enable, disable, upgrade, search, info, dev, create, featured |
| `providers` | 7 | list, add, remove, configure, test, usage, models |
| `deployment` | 9 | deploy, rollback, status, environments, history, logs, release, verify, validate |
| `claims` | 8 | check, grant, revoke, list, policies, roles, scope, action |
| `transfer-store` | 7 | search, featured, trending, info, download, publish, verify |
| `cleanup` | 2 | cleanup with `dry-run`, `force`, `keep-config` |
| `process` | 6 | monitor, logs, signals, workers, status, follow |
| `appliance` | 8 | build, run, extract, inspect, verify, profile, sign, publish |
| `agent-wasm` | 5 | wasm-status, wasm-create, wasm-prompt, wasm-gallery, tool-execute |
| `ruvector` | 8 | init, setup, import, migrate, status, benchmark, optimize, backup |

## 22 Plugins (IPFS Registry)

Distributed via IPFS (`QmXbfEAaR7D2Ujm4GAkbwcGZQMHqAMpwDoje4583uNP834`). Install
with `npx ruflo plugins install <name>`.

### Core Plugins (6)

| Plugin | Version | Description |
| --- | --- | --- |
| `@claude-flow/neural` | 3.0.0-alpha.7 | Neural pattern training — WASM SIMD, MoE routing, Flash Attention |
| `@claude-flow/security` | 3.0.0-alpha.1 | Security scanning, CVE detection, compliance auditing, threat modeling |
| `@claude-flow/embeddings` | 3.0.0-alpha.1 | Vector embeddings — sql.js, document chunking, hyperbolic (Poincaré ball) |
| `@claude-flow/claims` | 3.0.0-alpha.8 | Claims-based authorization for fine-grained access control |
| `@claude-flow/performance` | 3.0.0-alpha.1 | Performance profiling, benchmarking, optimization recommendations |
| `@claude-flow/plugins` | 3.0.0-alpha.1 | Plugin SDK — create, test, and publish ruflo plugins |

### Integration Plugins (10)

| Plugin | Version | Description |
| --- | --- | --- |
| `@claude-flow/plugin-agentic-qe` | 3.5.59 | 16 MCP tools, 51 agents across 12 DDD bounded contexts |
| `@claude-flow/plugin-prime-radiant` | 0.1.5 | Sheaf cohomology, spectral graph theory, consensus verification |
| `@claude-flow/plugin-gastown-bridge` | 3.0.0-alpha.1 | Gas Town orchestrator — WASM formula parsing, Beads sync, 352x faster |
| `@claude-flow/teammate-plugin` | 1.0.0-alpha.1 | TeammateTool integration — 21 MCP tools, BMSSP topology routing |
| `@claude-flow/plugin-code-intelligence` | 0.1.0 | Semantic code analysis, architectural pattern detection, refactoring |
| `@claude-flow/plugin-test-intelligence` | 0.1.0 | Test generation, coverage analysis, mutation testing, flaky detection |
| `@claude-flow/plugin-perf-optimizer` | 0.1.0 | AI bottleneck detection, memory profiling, automated tuning |
| `@claude-flow/plugin-neural-coordination` | 0.1.0 | Multi-agent neural coordination, emergent behavior modeling |
| `@claude-flow/plugin-cognitive-kernel` | 0.1.0 | Working memory, attention mechanisms, meta-cognitive monitoring |
| `@claude-flow/plugin-quantum-optimizer` | 0.1.0 | Quantum-inspired optimization — QAOA simulation, variational circuits |

### Research Plugins (3)

| Plugin | Version | Description |
| --- | --- | --- |
| `@claude-flow/plugin-hyperbolic-reasoning` | 0.1.0 | Poincaré embeddings, geodesic attention for hierarchical reasoning |
| `@claude-flow/plugin-healthcare-clinical` | 0.1.0 | HIPAA-compliant clinical workflows, medical NLP, interoperability |
| `@claude-flow/plugin-financial-risk` | 0.1.0 | SOX/PCI-compliant risk modeling, fraud detection, audit trails |

### Domain Plugins (2)

| Plugin | Version | Description |
| --- | --- | --- |
| `@claude-flow/plugin-legal-contracts` | 0.1.0 | Privilege-aware contract analysis, clause extraction, compliance |
| `slack-integration` | 1.0.0 | Slack notifications and collaborative workflows |

### Community Plugins (1)

| Plugin | Description |
| --- | --- |
| `community-analytics` | Analytics and metrics visualization |

## 16 Agentic-QE Plugin Tools

| Category | Tools |
| --- | --- |
| Test Generation | `aqe/generate-tests`, `aqe/tdd-cycle`, `aqe/suggest-tests` |
| Coverage Analysis | `aqe/analyze-coverage`, `aqe/prioritize-gaps`, `aqe/track-trends` |
| Quality Assessment | `aqe/evaluate-quality-gate`, `aqe/assess-readiness`, `aqe/calculate-risk` |
| Defect Intelligence | `aqe/predict-defects`, `aqe/analyze-root-cause`, `aqe/find-similar-defects` |
| Security Compliance | `aqe/security-scan`, `aqe/audit-compliance`, `aqe/detect-secrets` |
| Chaos Resilience | `aqe/chaos-inject` |

## 60+ Agent Types

| Category | Agents |
| --- | --- |
| Core Development | coder, reviewer, tester, planner, researcher |
| V3 Specialized | security-architect, security-auditor, memory-specialist, performance-engineer |
| Swarm Coordination | hierarchical-coordinator, mesh-coordinator, adaptive-coordinator, collective-intelligence-coordinator, swarm-memory-manager |
| Consensus | byzantine-coordinator, raft-manager, gossip-coordinator, consensus-builder, crdt-synchronizer, quorum-manager |
| GitHub | github-modes, pr-manager, code-review-swarm, issue-tracker, release-manager, workflow-automation, repo-architect |
| SPARC | sparc-coord, sparc-coder, specification, pseudocode, architecture, refinement |
| Specialized | backend-dev, mobile-dev, ml-developer, cicd-engineer, api-docs, system-architect, code-analyzer |
| Testing | tdd-london-swarm, production-validator |
| QE Plugin | 51 bounded-context agents + 7 TDD subagents across 12 domains |

## 12 Background Workers

| Worker | Priority | Function |
| --- | --- | --- |
| `ultralearn` | normal | Deep knowledge acquisition |
| `optimize` | high | Performance optimization |
| `consolidate` | low | Memory consolidation |
| `predict` | normal | Predictive preloading |
| `audit` | critical | Security analysis |
| `map` | normal | Codebase mapping |
| `preload` | low | Resource preloading |
| `deepdive` | normal | Deep code analysis |
| `document` | normal | Auto-documentation |
| `refactor` | normal | Refactoring suggestions |
| `benchmark` | normal | Performance benchmarking |
| `testgaps` | normal | Test coverage analysis |

## What Changed in v3.5.59

### 19 Tools Upgraded to Production-Grade

| Tool Category | Count | Before | After |
| --- | --- | --- | --- |
| GitHub Integration | 5 | Hardcoded JSON | Real `git`/`gh` CLI with fallback |
| Performance Monitoring | 5 | `Math.random()` | Real `process.*` OS metrics |
| Neural Learning | 6 | Fake patterns | Real file scanning + AgentDB |
| Hooks System | 3 | Empty/stub responses | Real aggregation + persistence |

### GitHub Integration — verified via `git`/`gh` CLI

| Tool | Verified Capabilities |
| --- | --- |
| `github_repo_analyze` | `git rev-list --count`, `git shortlog -sn`, `gh issue/pr list` |
| `github_pr_manage` | `gh pr list/create/view/merge/close` with JSON-store fallback |
| `github_issue_track` | `gh issue list/create/edit/close` with JSON-store fallback |
| `github_workflow` | `gh run list/view`, `gh workflow run/cancel` |
| `github_metrics` | `git log --since`, `git shortlog`, `gh release list` |

### Performance Monitoring — verified via OS metrics

| Tool | Evidence |
| --- | --- |
| `performance_metrics` | `process.memoryUsage()`, `process.cpuUsage()`, `perf_hooks` |
| `performance_benchmark` | Timed operations with `performance.now()` |
| `performance_profile` | V8 heap statistics API |
| `performance_optimize` | Real V8 flags, before/after delta |
| `performance_report` | Rolling window from `request-tracker.ts` |

### Neural Learning — verified via file analysis + AgentDB

| Tool | Evidence |
| --- | --- |
| `neural_train` | Recursive directory walk, extension counting, import extraction |
| `neural_status` | Reads from AgentDB pattern store |
| `neural_patterns` | AgentDB query, not hardcoded arrays |
| `neural_predict` | Pattern matching against trained data |
| `neural_optimize` | Deduplication, relevance scoring |
| `neural_compress` | Actual dedup with size reduction metrics |

### Hooks System — verified via persistence

| Tool | Evidence |
| --- | --- |
| `hooks_metrics` | Real counters populated by hook calls |
| `hooks_pretrain` | `readdirSync` + `readFileSync` file analysis |
| `hooks_post-command` | AgentDB primary, JSON-store fallback |

## Data Persistence Architecture

Every tool follows a verified 3-tier pattern with transparency:

| Tier | Backend | Indicator |
| --- | --- | --- |
| 1 | AgentDB (HNSW-indexed) | `_storedIn: 'agentdb'` |
| 2 | JSON file store | `_storedIn: 'json-store'` |
| 3 | Unavailable | `_storedIn: 'none'` |

### New: Request Tracker

`request-tracker.ts` — per-tool call counts, latencies, error rates in a
rolling 5-minute window, exposed via `performance_metrics`.

## QE Plugin Updated to v3.5.59

- Version aligned: `3.0.0-alpha.4` → `3.5.59`
- Repository URLs: `claude-flow` → `ruflo`
- `minClaudeFlowVersion: 3.5.0`
- 8 live integration tests against actual ruflo source code

## Test Evidence — 291 Tests

| Suite | Tests | What It Proves |
| --- | --- | --- |
| Feature verification | 58 | Every upgraded tool returns real data, not placeholders |
| Source-level checks | 26 | No `Math.random()` in metrics, no fake delays, no auto-pass |
| QE plugin unit tests | 225 | All 16 MCP tools handle valid input, invalid input, edge cases |
| QE live repo integration | 8 | Tools produce meaningful results against actual ruflo source |

### Verified Assertions

| Assertion | Method |
| --- | --- |
| Performance metrics from OS | `process.memoryUsage()` values > 0, not random |
| GitHub data from real CLI | `execSync('git ...')` output parsing |
| Neural patterns from files | File counts match `readdirSync` results |
| QE security scan finds real issues | `execSync` flagged in `github-tools.ts` |
| All responses include persistence metadata | `_storedIn` field on every response |
| Zero TypeScript compilation errors | `tsc --noEmit` passes across all packages |

## Issues Resolved

| Issue | Title | Resolution |
| --- | --- | --- |
| #1058 | Hook handlers don't persist data | `post-command`, `metrics`, `pretrain` now persist to AgentDB |
| #1514 | Independent audit of every tool | All flagged tools verified with test evidence |
| #1492 | AgentDB: 4 controllers unimplemented | Controllers wired and functional |
| #1457 | `terminal_execute` doesn't execute | Real `execSync` (v3.5.51) |
| #1437 | 22 stub CLI commands | Commands implemented (ADR-069) |
| #1425 | Performance tools return random metrics | Real OS metrics via `process.*` APIs |
| #1392 | Neural tools are non-functional | Real file scanning + AgentDB storage |
| #1375 | GitHub tools return hardcoded data | Real `git`/`gh` CLI integration |
| #1154 | Intelligence helper doesn't learn | Real learning pipeline with persistence |
| #1482 | Security & reliability review | Ongoing — substantially addressed |

## Release Stats

| Metric | Value |
| --- | --- |
| Files changed | 24 |
| Lines added | +1,786 |
| Lines removed | -237 |
| Commits | 6 |
| Tests passing | 291 |
| Tests failing | 0 |
| TypeScript errors | 0 |
| MCP tools (platform) | 314 |
| CLI commands | 38 |
| CLI subcommands | 140+ |
| Plugins (IPFS registry) | 22 |
| QE plugin tools | 16 |
| Agent types | 60+ |
| Background workers | 12 |

## Breaking Changes

None. All changes are additive — tools that previously returned placeholder
data now return real data in the same response format.

## Upgrade

```bash
npx @claude-flow/cli@latest --version  # 3.5.59
npx ruflo@latest --version              # 3.5.59
```

## PR

[#1539](https://github.com/wiggjamie9-afk/jamie-wigg/pull/1539) — feat:
complete feature gaps, real implementations, zero TS errors v3.5.59
