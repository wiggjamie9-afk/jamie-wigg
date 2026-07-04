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
| **Superpowers** — auto-triggering dev methodology (brainstorm → plan → subagent TDD → review) | `obra/superpowers-marketplace` | `superpowers@superpowers-marketplace` | [SETUP-SUPERPOWERS.md](SETUP-SUPERPOWERS.md) |

**gstack** (Garry Tan / YC) is a clone-and-`./setup` skill pack, **not** a marketplace
plugin, so it isn't in the table above. ~23 sprint-role slash commands + browser +
GBrain memory; per-machine install (needs Bun), with an opt-in team mode that edits
`CLAUDE.md`. **Documented + registered, not auto-wired** — its `required` team mode gates
the repo, which needs a human call. See [SETUP-GSTACK.md](SETUP-GSTACK.md).

**Toolport** is a local **MCP gateway** desktop app (open-core, MIT) that collapses all
your MCP servers behind 3 lazy-discovery meta-tools — big token savings when many servers
are connected (directly relevant to this repo's `.mcp.json`). Per-machine install; edits
client configs, secrets in OS keychain. **Documented + registered, not wired** (can't run
durably in the sandbox). See [SETUP-TOOLPORT.md](SETUP-TOOLPORT.md).

Verify after opening the repo in Claude Code:
```
/plugin                       # Marketplaces + installed plugins
/reload-plugins               # apply without restart
```

## CLI / skill tools (install per machine)

| Tool | Install | Docs |
|---|---|---|
| **E-book pipeline** (`/ebook`) — Markdown → EPUB + print PDF via pandoc + weasyprint | `bash scripts/setup-ebook.sh` | [SETUP-EBOOK.md](SETUP-EBOOK.md) · sample: [`books/campfire-quickstart/`](books/campfire-quickstart/) |
| **Open Montage** (`/open-montage`) — media+music+captions → real H.264 movie (MoviePy + bundled ffmpeg, CPU-only); OpenManus as AI director | `pip3 install -r open-montage/requirements.txt` | [OPEN-MONTAGE.md](OPEN-MONTAGE.md) · sample: [`open-montage/samples/`](open-montage/samples/) |
| **UI-UX Pro Max CLI** | `npm i -g ui-ux-pro-max-cli && uipro init --ai claude` | [SETUP-UI-UX-PRO-MAX.md](SETUP-UI-UX-PRO-MAX.md) |
| **video-use** — edit videos with Claude Code | `git clone https://github.com/browser-use/video-use ~/Developer/video-use` + symlink into `~/.claude/skills/`; needs **full ffmpeg** | [SETUP-VIDEO-USE.md](SETUP-VIDEO-USE.md) |
| **taste-skill** — frontend design taste | `npx skills add https://github.com/Leonxlnx/taste-skill --skill "design-taste-frontend"` | [SETUP-TASTE-SKILL.md](SETUP-TASTE-SKILL.md) |
| **the_silver_searcher** (`ag`) — fast recursive code/content grep | macOS: `brew install the_silver_searcher` · Debian/Ubuntu: `apt-get install silversearcher-ag` · from source: `ggreer/the_silver_searcher` | — |

## Clone everything locally

`bash scripts/clone-tools.sh` shallow-clones every clonable tool referenced by this
repo into a **gitignored `vendor/`**, grouped by purpose:

- **DESIGN** (apps/webpages/UI): ui-ux-pro-max-skill, taste-skill, ruixen-ui, penpot,
  anthropics-skills, mattpocock-skills, superpowers (+marketplace)
- **AUTOMATION** (agents/browser/orchestration): openmanus, browser-use, video-use,
  ui-tars-desktop, hermes-agent, opencode, gstack, ecc, neels-plugins, higgsfield-mcp,
  palmier-pro
- **MEDIA / REFERENCE**: moviepy, deep-playground, markitdown, spiralos, flow-trading
- **BIG** (`--all` only): stable-diffusion-webui, freeCodeCamp

24 repos in the core run (~2.3 GB with `--depth 1`). Idempotent — reruns fast-forward in
place; failures are non-fatal. Clones are per-machine/per-session; the script + SETUP docs
are the durable artifacts.

## Resources / references (clone or read — not "installable" as plugins)

| Item | Source | What it is |
|---|---|---|
| **Awesome DESIGN.md** | curated repo | Ready-made `DESIGN.md` files (Stitch format) extracted from real sites — drop one in a project root. See our own [`sites/skillui/DESIGN.md`](sites/skillui/DESIGN.md) for an example. |
| **SpiralOS** | `TheHeurist/SpiralOS` (MIT) | Conceptual "operating system of knowing" — epistemic framework, schemas, docs. Clone to read; not a plugin. |
| **NVIDIA audio models** | NVIDIA (mixed licenses) | Music/Audio Flamingo, ETTA, Fugatto, TangoFlux, BigVGAN-v2, etc. Model repos — relevant to the RHYTHMIX audio pipeline; licenses vary (MIT / NVIDIA non-commercial). |
| **MarkItDown** | `microsoft/markitdown` (MIT) | File → Markdown converter (`pip install 'markitdown[all]'`). Handy for feeding docs to LLMs. |
| **Flow** (RL trading) | `yazanobeidi/flow` | Q-learning HF-trading sim. Reference + install/run steps in [`reference/flow-trading/`](reference/flow-trading/). Not runnable here; not financial advice. |
| **Gold overweight playbook** | pasted research | Data-driven gold report rendered as a page → [`sites/gold-playbook/`](sites/gold-playbook/) (tables, scenario matrix, monitoring dashboard, refs). Informational only, not advice. |
| **French cyber dictionary** | M82-project | Built as a searchable page → [`sites/cyber-dictionnaire/`](sites/cyber-dictionnaire/) (section "F"). |
| **CFC notebook** | Case-Studies-Python | Implemented as [`sites/brainwave-analyzer/`](sites/brainwave-analyzer/) §5 (phase-amplitude coupling). |
| Joscha Bach notes · IVAN changelog | pasted | Persisted under [`reference/misc/`](reference/misc/) — reference only, unrelated to this repo. |
| **Awesome Go (Korean-curated)** | pasted link collection | Curated Go learning/library links → [`reference/awesome-go-korean.md`](reference/awesome-go-korean.md) (representative index + note; ask to expand verbatim or render as a searchable `sites/awesome-go/` page). |
| **freeCodeCamp.org** | `freeCodeCamp/freeCodeCamp` (BSD-3-Clause; curriculum © fCC) | Open-source learning platform + free-cert curriculum → notes in [`reference/freecodecamp.md`](reference/freecodecamp.md); **fully designed landing page** built at [`sites/freecodecamp/`](sites/freecodecamp/) ("campfire in the dark" theme). Unofficial design tribute, not affiliated. |
| **Claude Code memory docs** | Anthropic official docs | CLAUDE.md vs auto memory, `.claude/rules/` path-scoping, load order, managed policy → condensed reference at [`reference/claude-memory-system.md`](reference/claude-memory-system.md). Notes that this repo's root CLAUDE.md exceeds the 200-line guidance. |
| **Moltis TS Gateway** (fork scaffold) | pasted README (MIT) | **Runnable** TS AI gateway reimplemented from the fork spec → [`apps/moltis-ts-gateway/`](apps/moltis-ts-gateway/). WebSocket streaming chat + SQLite sessions + REST + optional Redis; boots with offline fallback, 5/5 tests. TS runtime only (no Rust workspace). |
| Marketing / ad-tech link list · internship table · Awesome VuePress · KB-ALBERT · NVIDIA audio · SpiralOS | pasted lists | Reference bookmark/README collections — not tools. Ask if you want any rendered as a page under `sites/`. |

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
