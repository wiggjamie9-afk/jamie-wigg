# Kortix Registry — Setup & Reference

## Overview

**Kortix Registry** is a catalog of AI-agent capabilities — **skills, tools,
plugins, and agents** — for the Kortix sandbox platform, installed with the
**OCX** CLI (`OpenCode Extensions`). Instead of hand-vendoring a skill, you point
OCX at the registry and pull components by name (`kortix/<component>`), or grab a
whole curated bundle (`kortix/sandbox`).

- Registry URL: `https://registry.kortix.ai`
- Installer: `ocx` (npm package, currently `2.0.11`)
- License: MIT

> ### How this fits the RHYTHMIX repo
> This repo already manages capabilities three ways: hand-synced skills under
> `.agents/skills/` (mirrored into `.claude/skills/`), MCP servers in `.mcp.json`,
> and slash-command skills. **OCX is a fourth channel** — a package manager that
> resolves components from a remote registry into an **OpenCode** project config
> (`.opencode/`). It is *additive*: it does not replace the `.agents/skills/`
> sync or the Claude Code skills. Several Kortix components overlap with skills we
> already vendor (`docx`, `xlsx`, `pdf`, `remotion`, `elevenlabs`, `image-gen`),
> so treat the registry as an **on-demand source**, not a wholesale import — pull
> the few components you actually want and avoid duplicating what's already here.

## ⚠️ Sandbox egress gate

`registry.kortix.ai` is **blocked by this cloud sandbox's egress policy** (the
proxy answers `403` to the CONNECT tunnel — same gating as `*.pollinations.ai`
and ClawHub). That means:

- The **`ocx` CLI installs fine** from npm (npmjs.org is allowlisted).
- `ocx init` and the registry config are **fully wired up** in `.opencode/`.
- `ocx add kortix/...` and `ocx search` **only resolve on a machine with open
  egress** (your local box, or once the host is added to the allowlist). In the
  sandbox they fail at the network boundary, not in config.

To run the real installs, do it on a machine with unrestricted egress, then
commit the resulting `.opencode/` component files back to the repo.

## Install the CLI

```bash
npm i -g ocx@latest      # or: bun add -g ocx
ocx --version            # 2.0.11
```

## Quick start (as published by Kortix)

```bash
ocx init                                                   # scaffold .opencode/ config
ocx registry add https://registry.kortix.ai --name kortix  # add the registry
ocx add kortix/sandbox                                     # install the full sandbox bundle
```

In this repo, `ocx init` has already been run and the `kortix` registry is
already wired into `.opencode/ocx.jsonc`, so on open egress you skip straight to
`ocx add kortix/<component>`.

## What got created here

```
.opencode/
├── ocx.jsonc        # registries + OCX settings (kortix registry pre-added)
└── opencode.jsonc   # OpenCode project config (MCP servers / tools / plugins land here)
```

`.opencode/ocx.jsonc` (the relevant part):

```jsonc
"registries": {
  "kortix": { "url": "https://registry.kortix.ai" }
}
```

Verify the wiring (works offline — reads local config):

```bash
ocx registry list        # → kortix: https://registry.kortix.ai
```

## Bundles

| Bundle | What it pulls | Command |
|---|---|---|
| `sandbox` | Full Kortix sandbox experience | `ocx add kortix/sandbox` |
| `research` | Deep research, academic papers, web search | `ocx add kortix/research` |
| `documents` | Word, Excel, PDF, presentations, legal docs | `ocx add kortix/documents` |
| `media` | Images, videos, logos, audio generation | `ocx add kortix/media` |
| `integrations` | Third-party OAuth integrations | `ocx add kortix/integrations` |

## Component catalog (highlights)

**Skills (18):** `deep-research`, `agent-browser`, `docx`, `xlsx`, `pdf`,
`presentations`, `remotion`, `legal-writer`, `paper-creator`,
`openalex-paper-search`, `logo-creator`, `email`, `elevenlabs`,
`domain-research`, `fullstack-vite-convex`, `kortix-system`,
`opencode-reference`, `woa`.

**Tools (17):** `web-search` (Tavily), `scrape-webpage` (Firecrawl), `image-gen`
(Replicate), `image-search` (Serper), `video-gen` (Replicate),
`presentation-gen`, `show`, `cron-triggers`, `woa-find`, `woa-create`, and 7
`integration-*` OAuth tools.

**Plugins (2):** `kortix-memory` (long-term memory, hybrid BM25+vector search),
`kortix-tunnel` (local-machine interaction via tunnel).

Install individually, e.g.:

```bash
ocx add kortix/deep-research kortix/web-search kortix/scrape-webpage
```

List/search what's available (open egress only):

```bash
ocx search deep-research
ocx search --installed       # what's already pulled into this project
```

## Working it into this repo's workflow

Pick the lane that matches the job:

1. **Research-heavy promo/campaign prep** — `kortix/research` overlaps with the
   repo's own `deep-research` skill and OpenManus, but adds `web-search` +
   `scrape-webpage` + `openalex-paper-search` as discrete OCX tools. Good for
   market-intelligence runs feeding `/rhythmix-spec` or `/site-build` briefs.
2. **Document deliverables** — `kortix/documents` (`docx`/`xlsx`/`pdf`/
   `presentations`/`legal-writer`) mirrors skills already vendored under
   `.agents/skills/`. **Prefer the existing vendored skills** unless you
   specifically want them inside an OpenCode project; only `legal-writer` /
   `paper-creator` are genuinely new.
3. **Media generation** — `kortix/media` (`image-gen`, `video-gen`,
   `logo-creator`, `elevenlabs`) is a Replicate/ElevenLabs-backed alternative to
   the repo's `creative-stack` MCP server and `replicate` skill. Use it on the
   OpenCode side; keep HyperFrames promos on the existing pipeline (ADR-0001).
4. **Persistent memory across runs** — `kortix/kortix-memory` is the one
   capability with **no equivalent here**; worth adding if you want long-term
   recall in OpenCode-driven sessions.

**Rule of thumb:** OCX components target the **OpenCode** runtime (`.opencode/`),
not Claude Code. If you're working inside this Claude Code harness, the vendored
`.agents/skills/` and `.mcp.json` servers remain the primary path; reach for
Kortix/OCX when you're driving the project through OpenCode, or when you want a
component this repo doesn't already carry (`kortix-memory`, `kortix-tunnel`,
`legal-writer`, `paper-creator`, `fullstack-vite-convex`).

## Notes

- Upstream registry contents and component versions can change; the lists above
  are a snapshot. `ocx search` / `ocx update` are the source of truth.
- `ocx.jsonc` has `"lockRegistries": false`. Set it to `true` (or run
  `ocx verify`) once you've pinned the components you depend on, so resolution is
  reproducible.
- Don't point OCX installs at this repo's protected branches — keep work on the
  designated feature branch and review the diff (the pulled component files land
  under `.opencode/`) before committing.
