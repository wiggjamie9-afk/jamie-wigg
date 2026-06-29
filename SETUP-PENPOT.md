# Penpot — Setup & Reference

## Overview

[Penpot](https://penpot.app) is the **open-source design platform** for teams
building digital products at scale. Its core strength is **ownership**: built on
open source and designed for self-hosting, it puts you in full control of your
design infrastructure — useful for strict compliance and governance. It works
with open standards (**SVG, CSS, HTML, JSON**) in the browser or on your own
servers, with real-time collaboration on top.

Design is expressed **as code**, so designs are readable by developers — and by
AI via the **MCP server** — enabling direct design-to-code translation. Native
**Design Tokens**, **Components**, and **Variants** give a single source of truth
between design and development. **CSS Grid + Flex Layout** mean responsive
interfaces behave like real code from the start.

**Site**: https://penpot.app · **Docs**: https://help.penpot.app ·
License: **MPL 2.0** (Mozilla Public License) · © Kaleidos.

> ### How this fits the RHYTHMIX repo
> **Good fit** as the design-system source of truth for the React/Next surfaces
> here — `studio/` (Next 15 · React 19 · Tailwind v4) — and as a bridge for the
> design pipeline. Three angles matter for this repo:
> - **MCP server** — the repo already runs many MCP servers (`.mcp.json`); a
>   Penpot MCP server enables multi-directional design↔code workflows and fits
>   the AI-driven pipeline. Pairs with the `frontend-design`, `ui-design-system`,
>   and `site-styleguide` skills.
> - **Native Design Tokens** — a single source of truth that maps cleanly onto
>   the brand system in `rhythmix-teaser-60s/DESIGN.md` (canvas `#08050d`,
>   magenta `#ff1f5a`, cyan `#00d8ff`, green `#00e887`; Space Grotesk / JetBrains
>   Mono). Define tokens once, export to CSS/JSON, feed the studio + site builds.
> - **Self-hosted + open standards** — exports SVG/CSS/HTML, so it composes with
>   the hand-written marketing site (root `*.html`) and the HyperFrames Cuts.
>
> **Not** a replacement for the HyperFrames video pipeline or the site-build
> generation skills — it's the *design authoring* layer that feeds them.

## Getting started

Penpot is **deployment-agnostic** — use the hosted SaaS at
[penpot.app](https://penpot.app), or self-host anywhere.

### Hosted (SaaS)

Sign up at [penpot.app](https://penpot.app) — nothing to install.

### Self-host with Docker

The fastest self-host path. Grab the official compose file and bring it up:

```bash
# Fetch the official docker-compose and start Penpot
wget https://raw.githubusercontent.com/penpot/penpot/main/docker/images/docker-compose.yaml
docker compose -p penpot -f docker-compose.yaml up -d
```

Penpot then serves on `http://localhost:9001` by default. See the
[self-host guide](https://help.penpot.app/technical-guide/getting-started/) for
configuration (flags, email, storage, OIDC/LDAP auth).

### Other deployment options

Kubernetes, [Elestio](https://elest.io/open-source/penpot) (one-click managed),
and other targets are documented on the
[technical guide](https://help.penpot.app/technical-guide/).

## Key capabilities

| Capability | What it gives you |
|---|---|
| **Design Tokens** | Native, best-in-class tokens — single source of truth across design + dev. |
| **Components & Variants** | Reusable, consistent UI building blocks for scalable design systems. |
| **MCP server** | Multi-directional design↔code workflows; AI-readable designs. |
| **Inspect mode** | Instant SVG / CSS / HTML for any layer — ready-to-use code. |
| **Plugin system** | Extend the platform, integrate other apps, build custom solutions. |
| **Open API + access tokens** | Programmable workspace; automation and integrations. |
| **Webhooks** | Hook Penpot events into your development toolchain. |
| **CSS Grid & Flex Layout** | Responsive interfaces that behave like real code from the start. |

## Notes

- The upstream **docs at [help.penpot.app](https://help.penpot.app) are the
  single source of truth** for install flags, the API, plugins, and the MCP
  server. This doc is a deliberately minimal install/reference snapshot — check
  the docs (and pin a release tag) before relying on specifics.
- For this repo, the highest-value use is **authoring design tokens** that mirror
  `rhythmix-teaser-60s/DESIGN.md`, then exporting them to CSS/JSON to keep
  `studio/` and the site-build outputs consistent.
- If you wire up the Penpot MCP server, register it in `.mcp.json` alongside the
  existing servers and keep any tokens/secrets in `.env` (gitignored), matching
  the pattern used for the other MCP integrations.

## Community

- Community space, ambassador program, and contribution guide are linked from the
  [Penpot site](https://penpot.app) and the
  [GitHub repo](https://github.com/penpot/penpot).
- Contributors must follow the project's Code of Conduct.

## License

Mozilla Public License, v. 2.0 (MPL-2.0). Penpot is a Kaleidos open-source
project — © KALEIDOS INC.
