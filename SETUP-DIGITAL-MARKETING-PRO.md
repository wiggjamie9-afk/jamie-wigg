# SETUP — Digital Marketing Pro (neels-plugins)

Open-source AI marketing plugin: a canonical **12-Part Strategy Flow** (61 explicit
steps → Four Core Documents), 158 skills, 25 specialist agents, multi-brand/agency
state, EU AI Act Article 50 compliance, 8 live HTTP connectors. MIT. By Indranil Banerjee.

## Install — Claude plugin (wired into this repo)

Declared in [`.claude/settings.json`](.claude/settings.json) — auto-loads in Claude Code:

```
/plugin marketplace add indranilbanerjee/neels-plugins
/plugin install digital-marketing-pro@neels-plugins
```
Cowork: Plugins UI → Add marketplace → `indranilbanerjee/neels-plugins` → Install.
Also ships native manifests for Codex, Cursor 2.5+, Copilot CLI, Antigravity, Hermes,
OpenClaw, and 35+ Agent-Skills harnesses (point them at the repo's `skills/`).

## First run

```
/digital-marketing-pro:brand-setup            # voice, audience, jurisdiction, competitors
/digital-marketing-pro:engagement             # full 12-Part flow (~50–60 files, ~60 min)
# or jump to one workflow:
/digital-marketing-pro:campaign-plan | :seo-audit | :content-engine | :competitor-analysis | :check
```
Output: `~/.claude-marketing/<brand>/` (state) + `~/Documents/DigitalMarketingPro/<brand>/` (deliverables).

## Team persistence (agencies on Cowork)

Cowork's filesystem is per-session; run once so brand state survives via Google Drive MCP:
```
/digital-marketing-pro:cowork-setup
```

## Notes

- Roughly $15–40 in API spend per full engagement (source's estimate).
- Sibling plugins share brand profiles: `contentforge@neels-plugins`, `socialforge@neels-plugins`.
- Third-party plugin — runs with your agent's permissions; review before enabling for a team.
