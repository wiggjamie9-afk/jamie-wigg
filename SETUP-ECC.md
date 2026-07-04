# SETUP — ECC (agent-harness operating system)

Cross-harness operator system: agents, skills, hooks, rules, MCP configs, memory
persistence, and security scanning (AgentShield). Works across Claude Code, Codex,
Cursor, OpenCode, Gemini, Zed, Copilot. MIT. Source: `affaan-m/ECC`.

> ⚠️ **Install from official sources only** — the GitHub repo `affaan-m/ECC`, npm
> `ecc-universal` / `ecc-agentshield`, plugin slug `ecc@ecc`, and `ecc.tools`.
> Third-party mirrors are unreviewed.

## Install — Claude plugin (wired into this repo)

Declared in [`.claude/settings.json`](.claude/settings.json) — auto-loads in Claude Code:

```
/plugin marketplace add https://github.com/affaan-m/ECC
/plugin install ecc@ecc
```

**Pick one path only** — do not also run the full manual installer after a plugin
install (that duplicates skills/hooks). Rules are not distributed via the plugin;
copy only the ones you want:

```bash
git clone https://github.com/affaan-m/ECC.git && cd ECC
mkdir -p ~/.claude/rules/ecc
cp -r rules/common ~/.claude/rules/ecc/
cp -r rules/typescript ~/.claude/rules/ecc/   # pick your stack
```

## Low-context / no-hooks install (alternative to the plugin)

```bash
./install.sh --profile minimal --target claude     # excludes hooks-runtime
# add hooks later only if you want runtime enforcement:
./install.sh --target claude --modules hooks-runtime
```

## Reset / uninstall

```bash
node scripts/uninstall.js --dry-run    # preview
node scripts/uninstall.js              # remove ECC-managed files
```

## Security scan (AgentShield)

```bash
npx ecc-agentshield scan            # audit CLAUDE.md, settings, MCP, hooks, skills
npx ecc-agentshield scan --fix      # auto-fix safe issues
```

## Notes

- Requires Claude Code ≥ v2.1.0 (hooks auto-load from plugins).
- Token tips it recommends: `model: sonnet`, `MAX_THINKING_TOKENS: 10000`,
  `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE: 50`, keep < 10 MCPs / < 80 tools active.
