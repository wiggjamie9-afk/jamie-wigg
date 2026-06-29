# Anthropic Agent Skills (`anthropics/skills`) — Setup & Reference

## Overview

[`anthropics/skills`](https://github.com/anthropics/skills) is Anthropic's
official repository of **Agent Skills** — folders of instructions, scripts, and
resources that Claude loads dynamically to do specialized tasks in a repeatable
way. Each skill is self-contained in its own folder with a **`SKILL.md`** file
holding the instructions + metadata Claude uses.

The repo demonstrates the breadth of what skills can do — creative
(art, music, design), technical (web-app testing, MCP server generation), and
enterprise (communications, branding) — and ships the **document creation &
editing skills** (`docx`, `pdf`, `pptx`, `xlsx`) that power Claude's document
capabilities in production.

**Licensing:** most example skills are **Apache-2.0**; the document skills
(`docx`/`pdf`/`pptx`/`xlsx`) are **source-available, not open source** — shared
as a reference for more complex, production-grade skills.

Layout:
- `./skills` — examples: Creative & Design, Development & Technical, Enterprise &
  Communication, and the Document skills.
- `./spec` — the Agent Skills specification.
- `./template` — a skill template to start from.

> ### How this fits the RHYTHMIX repo
> **This is the canonical upstream for a large chunk of this repo's vendored
> skills.** Confirmed already present in `.claude/skills/`: `docx`, `pdf`,
> `pptx`, `xlsx`, `skill-creator`, `mcp-builder`, `canvas-design`,
> `brand-guidelines`, `algorithmic-art`, `webapp-testing`. Treat
> `anthropics/skills` as the source of truth to **diff and refresh against**.
>
> **Refresh discipline** (per `CLAUDE.md`): synced skills live in
> `.agents/skills/<name>/`, symlinked into `.claude/skills/`. Don't hand-edit the
> symlinks — update the upstream source and re-record the hash in
> `skills-lock.json`. Diff before pulling a newer version so local adaptations
> aren't clobbered.
>
> **Not yet vendored** (candidate to add): `writing-great-skills`. The repo's own
> `write-a-skill` skill covers similar ground — diff the two before adding to
> avoid duplication.
>
> **Authoring new skills:** the repo conventions in `CLAUDE.md` (source in
> `.agents/skills/`, symlink into `.claude/skills/`, local-only skills edited
> directly) sit *on top of* the spec below — follow the repo conventions for
> placement, and the spec for `SKILL.md` shape.

## Install in Claude Code (plugin marketplace)

Register the repo as a Claude Code plugin marketplace:

```text
/plugin marketplace add anthropics/skills
```

Then install a skill set — either via the **Browse and install plugins** UI
(`anthropic-agent-skills` → `document-skills` or `example-skills` → **Install
now**), or directly:

```text
/plugin install document-skills@anthropic-agent-skills
/plugin install example-skills@anthropic-agent-skills
```

After install, invoke a skill by mentioning it, e.g.:
*"Use the PDF skill to extract the form fields from `path/to/some-file.pdf`."*

> **On this repo:** the document/example skills are already vendored under
> `.claude/skills/` (see above), so installing the marketplace plugin would
> **duplicate** them. Prefer the repo's sync workflow (`.agents/skills/` +
> `skills-lock.json`) over the marketplace install here; use the marketplace
> path on a fresh checkout that doesn't already carry these skills.

## Other surfaces

- **Claude.ai** — the example skills are available on paid plans; custom skills
  can be uploaded (see *Using skills in Claude*).
- **Claude API** — use Anthropic's pre-built skills or upload custom ones (see
  the Skills API Quickstart).

## Creating a basic skill

A skill is just a folder with a `SKILL.md` containing YAML frontmatter +
instructions. Start from `./template`:

```markdown
---
name: my-skill-name
description: A clear description of what this skill does and when to use it
---

# My Skill Name

[Instructions Claude follows when this skill is active]

## Examples
- Example usage 1
- Example usage 2

## Guidelines
- Guideline 1
- Guideline 2
```

Frontmatter requires only two fields:

- **`name`** — unique identifier (lowercase, hyphens for spaces).
- **`description`** — a complete description of *what* the skill does and *when*
  to use it (this is what Claude matches against when deciding to invoke it).

The markdown body holds the instructions, examples, and guidelines.

## Notes

- The upstream **repo README + `./spec` at
  [github.com/anthropics/skills](https://github.com/anthropics/skills) are the
  single source of truth** — check them before relying on specifics; this doc is
  a minimal reference snapshot.
- **Disclaimer (from upstream):** these skills are for demonstration and
  education; real Claude behavior may differ from the implementations shown.
  Test thoroughly in your own environment before relying on any skill for
  critical tasks.
- **Partner skills:** Anthropic highlights partner-authored skills (e.g. Notion's
  skills for Claude) — worth scanning if you integrate those tools.
