---
name: codexguide
description: Reference to CodexGuide (freestylefly/CodexGuide, site codexguide.ai) — a community, Chinese-language practical knowledge base for OpenAI Codex (CLI / desktop App / Cloud / IDE / ChatGPT). Use when you need learning paths, entry-point comparisons, config (config.toml, MCP, Skills, Subagents), AGENTS.md rules, sandbox/approval safety, or real task recipes for OpenAI Codex. NOTE: about OpenAI Codex, not Claude Code; community-maintained, not official — verify time-sensitive facts against OpenAI's docs.
---

# CodexGuide (reference)

A community-maintained, primarily Chinese practical knowledge base for **OpenAI Codex** —
covering how to start, how to deliver real tasks, and how to turn a success into reusable team
templates/rules/cases. Built as a VuePress site; published at **https://codexguide.ai**.

- Repo: https://github.com/freestylefly/CodexGuide · English readme: `README_en.md`
- License: MIT · Community project, **not** an official OpenAI product.

> ⚠️ This is about **OpenAI Codex**, a different agent from the Claude Code stack this repo
> runs on. It's a learning/reference resource — the patterns (AGENTS.md, sandbox/approval,
> MCP, task design) are conceptually transferable, but commands and product details are
> Codex-specific. For anything time-sensitive (pricing, availability, safety policy), defer to
> OpenAI's official docs.

## Content map (docs/)

| Section | Covers |
|---|---|
| `guide/` | Onboarding → team adoption: install, login, subscription, settings, phone↔desktop, first low-risk task |
| `platform/` | Entry-point map — when to pick CLI vs desktop App vs Cloud/Web vs IDE vs ChatGPT |
| `configuration/` | CLI options, `config.toml`, MCP, Skills, Subagents, security/approval |
| `practice/` | Task design, validation, non-dev workflows, team playbook |
| `recipes/` | Real cases: PPT, Draw.io, browser, Obsidian, clinical lit review, Feishu, Figma, Notion, CI fixes |
| `reference/` | Index of OpenAI official docs, GitHub repos, key fact sources |
| `community/` | Roadmap + contribution directions |

## Recommended reading paths

- **First time:** 学习路线 → desktop App install → subscribe Plus/Pro → App overview → connect API → first task.
- **Use Codex on a real project:** CLI install & login → first code change → AGENTS.md → sandbox & approval.
- **Roll out to a team:** team playbook → config & extensions → security → troubleshooting → recipes.

## Run the site locally

Not vendored into this repo (it's a ~65 MB image-heavy off-topic docs site). To run it, clone
upstream:

```bash
git clone https://github.com/freestylefly/CodexGuide && cd CodexGuide
# Node.js >=22.12 and <25, pnpm 10.33.0
pnpm install
pnpm dev      # VuePress dev server
pnpm build    # static site
```

## Why reference-only

It's documentation for a different tool, not an installable skill/library. The useful,
low-bloat capture is this pointer + structure; the full source stays upstream. If you ever
want the whole site vendored locally anyway, it can be cloned per above.
