# TEAM-TOOLS.md — installed & referenced agent tooling

Single registry of the tools, plugins, and skills we've pulled into this repo so
the whole team gets the same setup. "Installed for us" here means **wired into the
repo so it travels via git** — not installed onto any one machine.

> **How the "install" actually works**
> - **Plugin marketplaces** are declared in [`.claude/settings.json`](.claude/settings.json)
>   under `extraKnownMarketplaces` + `enabledPlugins`. When anyone opens this repo in
>   **Claude Code**, those plugins auto-load. No per-person `/plugin` typing needed.
> - `/plugin` slash commands only run in a person's own Claude Code / Cowork client —
>   an agent can't run them for you, and a remote sandbox is ephemeral, so the repo
>   config is the durable way to share plugins.
> - If a marketplace repo can't be resolved, Claude Code just skips that plugin
>   (non-fatal) — remove the entry from `enabledPlugins` to silence it.
> - **CLI/skill tools** (video-use, taste-skill, ui-ux-pro-max CLI) install per-machine
>   via their own commands — see the linked `SETUP-*.md`.

## Plugins wired into the repo (auto-load in Claude Code)

| Tool | Marketplace (repo) | Plugin id | Docs |
|---|---|---|---|
| **UI-UX Pro Max** — design-system generator (161 product types, 67 styles, palettes, type) | `nextlevelbuilder/ui-ux-pro-max-skill` | `ui-ux-pro-max@ui-ux-pro-max-skill` | [SETUP-UI-UX-PRO-MAX.md](SETUP-UI-UX-PRO-MAX.md) |
| **Digital Marketing Pro** — 12-Part engagement methodology, 158 skills, 25 agents | `indranilbanerjee/neels-plugins` | `digital-marketing-pro@neels-plugins` | [SETUP-DIGITAL-MARKETING-PRO.md](SETUP-DIGITAL-MARKETING-PRO.md) |
| **ECC** — agent-harness operating system (skills, agents, hooks, rules) | `affaan-m/ECC` | `ecc@ecc` | [SETUP-ECC.md](SETUP-ECC.md) |

Verify after opening the repo in Claude Code:
```
/plugin                       # Marketplaces + installed plugins
/reload-plugins               # apply without restart
```

## CLI / skill tools (install per machine)

| Tool | Install | Docs |
|---|---|---|
| **UI-UX Pro Max CLI** | `npm i -g ui-ux-pro-max-cli && uipro init --ai claude` | [SETUP-UI-UX-PRO-MAX.md](SETUP-UI-UX-PRO-MAX.md) |
| **video-use** — edit videos with Claude Code | `git clone https://github.com/browser-use/video-use ~/Developer/video-use` + symlink into `~/.claude/skills/`; needs **full ffmpeg** | [SETUP-VIDEO-USE.md](SETUP-VIDEO-USE.md) |
| **taste-skill** — frontend design taste | `npx skills add https://github.com/Leonxlnx/taste-skill --skill "design-taste-frontend"` | [SETUP-TASTE-SKILL.md](SETUP-TASTE-SKILL.md) |

## Resources / references (clone or read — not "installable" as plugins)

| Item | Source | What it is |
|---|---|---|
| **Awesome DESIGN.md** | curated repo | Ready-made `DESIGN.md` files (Stitch format) extracted from real sites — drop one in a project root. See our own [`sites/skillui/DESIGN.md`](sites/skillui/DESIGN.md) for an example. |
| **SpiralOS** | `TheHeurist/SpiralOS` (MIT) | Conceptual "operating system of knowing" — epistemic framework, schemas, docs. Clone to read; not a plugin. |
| **NVIDIA audio models** | NVIDIA (mixed licenses) | Music/Audio Flamingo, ETTA, Fugatto, TangoFlux, BigVGAN-v2, etc. Model repos — relevant to the RHYTHMIX audio pipeline; licenses vary (MIT / NVIDIA non-commercial). |
| **MarkItDown** | `microsoft/markitdown` (MIT) | File → Markdown converter (`pip install 'markitdown[all]'`). Handy for feeding docs to LLMs. |
| Marketing / ad-tech link list · internship table · Awesome VuePress · KB-ALBERT | pasted lists | Reference bookmark collections — not tools. Ask if you want any rendered as a page under `sites/`. |

## Caveats (read once)

- These entries come from pasted READMEs; **I could not verify from this sandbox that
  every external repo/marketplace exists or is safe.** Treat third-party plugins as
  third-party code — they run with your agent's permissions.
- Model names / versions in some source docs (e.g. "Claude Opus 4.8", future dates)
  are as-pasted; don't rely on them as ground truth.
- Two MCP servers in this workspace need OAuth and can't be authorized from a
  non-interactive session — authorize them in your own claude.ai connector settings
  or via `/mcp` in an interactive Claude Code session.

_Last updated by the team-tools install pass on the `claude/design-system-generator-v2` branch._
