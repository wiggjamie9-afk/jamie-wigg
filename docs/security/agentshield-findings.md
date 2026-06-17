# AgentShield Scan — Triage (2026-06-17)

First AgentShield audit of `.claude/`. Tool docs: `knowledge/tools/agentshield.md`. Raw report: `agentshield-baseline-report.json`.

```
npx ecc-agentshield scan --path .claude --format json
```

## Result

**Grade D (58/100)** · 439 findings · **0 critical** · 201 high · 15 medium · 223 low · 211 files scanned.

| Category | Score |
|---|---|
| Secrets | 90 |
| Permissions | 0 |
| Hooks | 100 |
| MCP Servers | 100 |
| Agents | 0 |

Hooks and MCP scored perfect — notable given how many MCP servers this repo wires up. Secrets near-perfect. The grade is dragged down almost entirely by the `agents` category.

## Triage — most findings are NOT actionable here

| Finding group | Count | Verdict |
|---|---|---|
| `agents/*` no explicit `tools:` array (high) | 196 | **Platform-managed — do not edit.** All in `.claude/agents/` (FleetView roster). CLAUDE.md: "Do not hand-edit these — they are managed by the FleetView platform." Out of our control; the empty-tools default is FleetView's design. |
| `misconfiguration` low | 197 | Same FleetView agent files (companion low-severity). Same verdict. |
| `injection` high | 5 | **False positives.** "backward design/compatibility/planning" flagged as "reversed-text evasion"; "Find users" flagged as "environment probing." All ordinary English in FleetView agent prose. Exactly the FP class AgentShield's own `false-positive-audit.md` describes. |
| `secrets` medium | 2 | **Example IPs, not secrets.** `10.0.1.42:6379` (Redis sample) and `192.168.1.100:18789` in FleetView `log-analyzer.md` / `security-hardener.md` descriptions. Not real credentials. |
| `skills` low | 26 | Skill-md prompt text; AgentShield notes skill-md has narrower/looser coverage. Low signal. |

## The one genuinely actionable, real finding

**`misconfiguration` medium — "No PreToolUse security hooks configured" (`settings.json`).**

This is about *our* actual runtime config, not a platform file or FP. A PreToolUse hook can gate/inspect tool calls before they run (e.g. block `rm -rf`, flag exfil-shaped `curl`). Given this repo's large MCP + skill surface, adding one is the highest-value hardening step.

**Status:** not yet added — it changes runtime behavior (could block tool calls), so it's a deliberate decision for the maintainer rather than an auto-fix. Candidate: a PreToolUse hook that denies destructive Bash patterns and logs MCP tool invocations. AgentShield can scaffold a hardened baseline via `agentshield init` (never overwrites existing files), or `agentshield runtime install` adds its own PreToolUse monitor.

## Why the score is misleading (and that's the point)

AgentShield grades the *whole tree* including platform-managed FleetView agents it can't know are intentionally empty-tools. Per the tool's own guidance, `agents-*` clusters across files with consistent structure usually mean **policy review, not rule bugs** — and here the policy (empty tools on a large managed roster) is FleetView's, not ours. The actionable surface we own — secrets, permissions in our `settings.json`, hooks, MCP wiring — is clean except for the missing PreToolUse hook.

## Recommended next steps

1. **Add a PreToolUse hook** to `settings.json` (deny destructive Bash, log MCP calls) — the one real fix. Decide scope first.
2. **Add the GitHub Action** (`affaan-m/agentshield@v1`, SARIF upload) for PR-time drift detection.
3. **Baseline + gate** — this report is the baseline; future scans use `--baseline … --gate` so *new* findings (from new MCPs/skills) surface without re-litigating the FleetView noise.
4. **Re-scan after FleetView updates** — if the platform ever ships `tools:` arrays, the grade jumps without any work from us.

_Verdict: no emergency. 0 criticals; the D grade is dominated by platform-managed files and false positives. One real, deferred hardening item (PreToolUse hook)._
