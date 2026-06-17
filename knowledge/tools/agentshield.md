# AgentShield: Security Scanner for Claude Code Configs

Scans your `.claude/` directory for vulnerabilities — exposed secrets, over-permissive rules, dangerous hooks, risky MCP servers, and prompt-injection surfaces — before they become exploits. 102 rules across 5 categories, graded A–F (0–100).

`npm: ecc-agentshield` · GitHub Action: `affaan-m/agentshield@v1` · MIT · Part of Everything Claude Code (42K+ stars). Built at the Claude Code Hackathon (Cerebral Valley × Anthropic, Feb 2026).

## Why This Matters Here — Highest-Priority Install

This is the most directly actionable tool posted to this ecosystem. **This repo has a large agent attack surface**: many MCP servers in `.mcp.json` (creative-stack, higgsfield, pollinations, playwright, context7, openmanus, ruflo…), 100+ skills, session-start hooks, a permission allowlist in `.claude/settings.json`, and — notably — a **reverse-engineered API documented this session** (`kimi-free-api.md`) plus several tools requiring API tokens. AgentShield exists to audit exactly this.

The threat landscape it cites (Jan 2026): 12% of one skill marketplace was malicious (341/2,857), a CVSS 8.8 one-click RCE hit 17,500+ instances, and the Moltbook breach compromised 1.5M API tokens across 770K agents.

## Quick Start

```bash
# No install — scan the current repo's Claude config
npx ecc-agentshield scan

# Or global
npm install -g ecc-agentshield
agentshield scan

# Scan a specific path
agentshield scan --path /path/to/.claude
```

Auto-discovers `~/.claude/` (and project `.claude/`), scans all config files, prints a graded report. Skips `node_modules`, build output, `.dmux` mirrors.

## What It Catches (102 rules / 5 categories)

| Category | Rules | Catches |
|---|---|---|
| **Secrets** | 10 (14 patterns) | API keys (sk-ant-, sk-proj-, AKIA, AIza, xai-, Stripe), tokens (ghp_, JWTs, Bearer, Slack), DB connection strings, private keys, env leaks (`echo $SECRET` in hooks) |
| **Permissions** | 10 | Wildcards (`Bash(*)`, `Write(*)`), missing deny lists (`rm -rf`, `sudo`), `--dangerously-skip-permissions`, `git push --force`, unscoped `curl *`/`ssh *` |
| **Hooks** | 34 | Command injection (`${file}` in shell), exfiltration (`curl -X POST` w/ interpolation), silent fails (`2>/dev/null`, `\|\| true`), container escape (`--privileged`), reverse shells (`/dev/tcp`, `mkfifo+nc`), credential access (Keychain, `/etc/shadow`), clipboard exfil, log tampering, remote-script SessionStart |
| **MCP Servers** | 23 | High-risk servers (shell/filesystem-root/db/browser), `npx -y` auto-install (typosquat vector), hardcoded tokens, remote transport, shell metachars in args, `.env`/`.pem` as args, `0.0.0.0` binding, autoApprove, missing timeouts |
| **Agents** | 25 | Unrestricted tools, prompt-injection surfaces, "always run / without asking" auto-run, hidden instructions (zero-width Unicode, base64, HTML comments), URL execution, time bombs, jailbreak reflection, output manipulation |

## Key Concept: `runtimeConfidence`

AgentShield distinguishes **active runtime config** from lower-confidence sources, so a repo that *ships* risky templates/examples isn't graded like one that *enables* them:

| Value | Meaning | Score weight |
|---|---|---|
| `active-runtime` | `mcp.json`, `.claude/mcp.json`, `.claude.json`, active `settings.json` | full |
| `project-local-optional` | `settings.local.json` | 0.75x |
| `plugin-cache` / `plugin-manifest` | installed plugin content / `hooks/hooks.json` | 0.5x |
| `template-example` | `mcp-configs/`, `config/mcp/` catalogs | 0.25x (capped 10pts/file) |
| `docs-example` | `docs/`, `commands/*.md` samples | 0.25x |
| `hook-code` | manifest-resolved non-shell impl | full (narrow rules) |

**Real secrets stay critical at full weight regardless of source.** Reading rules: *template-example* = "repo ships a risky template," not "enabled now"; *docs-example* = "ships risky sample guidance." This is highly relevant to **this repo**, which intentionally ships MCP catalogs and many skill/doc examples — expect those to surface as lower-confidence.

## Useful Commands

```bash
agentshield scan --fix                    # auto-apply safe fixes (secrets → ${ENV}, scope wildcards)
agentshield scan --format json            # CI / programmatic
agentshield scan --format html > report.html
agentshield scan --format sarif -o agentshield.sarif   # GitHub code scanning
agentshield scan --supply-chain           # MCP package provenance (npm vs git, pinned, known-good)
agentshield scan --supply-chain-online    # + npm registry metadata (downloads, postinstall, age)
agentshield scan --opus --stream          # 3-agent Opus 4.6 adversarial analysis (needs ANTHROPIC_API_KEY)
agentshield scan --deep                   # injection + sandbox + taint + opus
agentshield scan --baseline base.json --gate   # fail on drift / new critical-high
agentshield scan --evidence-pack ./ev     # portable audit bundle (SARIF, policy, supply-chain, manifest)
agentshield init                          # generate hardened .claude/ baseline (never overwrites)
```

Exit codes: `0` = clean, `1` = CLI/runtime error, `2` = ≥1 critical finding.

## Opus 4.6 Deep Analysis (`--opus`)

Three-agent adversarial pipeline:
- **Red Team (Attacker)** — exploitable vectors + multi-step chains
- **Blue Team (Defender)** — evaluates protections, recommends hardening
- **Auditor** — synthesizes into a prioritized risk list

Example chain it finds: `curl` hook with `${file}` interpolation + `Bash(*)` = command-injection pivot, with no PreToolUse hook to stop it. Requires `ANTHROPIC_API_KEY`.

## GitHub Action

```yaml
- name: AgentShield Security Scan
  uses: affaan-m/agentshield@v1
  with:
    path: "."
    min-severity: "medium"
    fail-on-findings: "true"
    format: "sarif"          # → upload via github/codeql-action/upload-sarif
```
Supports baseline drift gating, org policy (`--policy`), supply-chain gating, evidence packs, and emits GitHub annotations + job summary. Outputs `score`, `grade`, `critical-count`, `sarif-path`, etc.

## Organization Policy & Evidence

- **Policy packs** (presets, not hidden SaaS): `oss`, `team`, `enterprise`, `regulated`, `high-risk-hooks-mcp`, `ci-enforcement`. `agentshield policy init/export/promote` with digest-verified manifests + exception lifecycle audit (expiring/expired waivers stay visible).
- **Evidence packs** — deterministic bundle (`manifest.json` w/ SHA-256, SARIF, policy-evaluation, supply-chain, ci-context). Redacted by default. `evidence-pack verify/inspect/fleet` for CI/fleet routing.
- **Runtime monitor** — `agentshield runtime install` adds a PreToolUse monitor hook; `status --check` / `repair`.

## MiniClaw (bundled minimal agent runtime)

Single sandboxed HTTP endpoint (vs sprawling Telegram/Discord/plugin surfaces). Four enforced layers: rate limit → CORS → size cap → prompt sanitize → tool whitelist (Safe/Guarded/Restricted, bash+network off by default) → sandbox FS (path-traversal blocked, symlink-escape detection, 10MB cap, 5-min timeout, no network). Zero external runtime deps (Node built-ins only).

```bash
npx ecc-agentshield miniclaw start   # localhost:3847, no network, safe tools only
```

## Recommended Use in This Ecosystem

1. **Run it now and on every PR** — `npx ecc-agentshield scan` locally; add the GitHub Action with SARIF upload to `deploy-pages.yml`/`studio-deploy.yml` siblings so `.claude/` regressions surface in code scanning.
2. **Triage by `runtimeConfidence`** — this repo ships many MCP catalogs/skill examples; expect `template-example`/`docs-example` noise. Fix `active-runtime` + real secrets first.
3. **Supply-chain gate the MCP servers** — `--supply-chain` over `.mcp.json` (lots of `npx -y` entries → typosquat surface).
4. **Baseline + gate** — `agentshield baseline write` then `--baseline … --gate` to catch drift as more skills/MCPs get added.
5. **Pairs with `docs/security/shannon.md`** — Shannon audits the Studio Workers/license endpoint (runtime app security); AgentShield audits the *agent config* surface. Complementary, not overlapping.

## References

- **npm**: `ecc-agentshield` · **Action**: `affaan-m/agentshield@v1`
- **GitHub App**: github.com/apps/ecc-tools · **Pro**: $19/seat/mo
- **Docs**: `API.md`, `false-positive-audit.md` (triage rules, FP taxonomy)
- **Built by**: @affaanmustafa · Everything Claude Code · MIT

---

**Use Case for Ecosystem:** Highest-priority security install — audits the `.claude/`/`.mcp.json`/hooks/skills attack surface this repo accumulates (esp. after this session's many MCP + tool additions). Run locally + as a PR GitHub Action with SARIF upload and supply-chain gating. Triage by runtimeConfidence (repo ships many template/doc examples → lower weight); fix active-runtime config and real secrets first. Complements Shannon (`docs/security/shannon.md`, which covers Studio runtime app security).
