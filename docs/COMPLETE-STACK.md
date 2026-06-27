# Complete Stack — Everything in My Claude Setup

_The single source of truth: every skill, MCP server, project, integration, and memory tool
in this workspace. Generated 2026-06-27._

## At a glance

| | Count |
|---|---|
| Active skills (`.claude/skills/`) | **2,565** |
| MCP servers (`.mcp.json`) | **9** |
| In-repo projects (apps / sites / studio / standalone) | **35+** |
| Memory engines wired | **2** (Supermemory hosted · MemPalace local) |
| Working code integrations added | OpenAPI lint, Svelte app scaffold |

---

## 1. Skills (2,565 active)

- **Core library:** the full **antigravity-awesome-skills** set (~1,589) + **taste-skill** (13) +
  the repo's original curated skills — covering dev, design, security, SEO, SaaS, data, video,
  marketing, ops.
- **Hand-installed this session (20 commits):**
  - **Design:** `refero-design`, `svelte-animations` (+ live `apps/svelte-animations/` project)
  - **Video / creative:** `wan2.2-video`
  - **Agents / build:** `metagpt` (+ installed + `scripts/setup-metagpt.sh`), `goose`, `headroom`
  - **Memory:** `memos`, `letta`, `supermemory`, `mempalace`
  - **Reference / misc:** `mtg-ai-suite`, `codexguide`, `zhengxi-views`, `gongkao-huasheng13`,
    `baiyueguang-learning`, `insomnia`, `agent-reach`, `zephyr-rtos`
  - **Vendored source:** `vendor/Wan2.2`, `vendor/mtg-ai-suite`

## 2. MCP servers (9)

`stepfun` · `creative-stack` (Replicate+ElevenLabs) · `higgsfield` · `pollinations` ·
`playwright` · `claude-playwright` · `context7` · **`supermemory`** (memory, hosted) ·
**`mempalace`** (memory, local). Plus session-connected: github, Stripe, Figma, Notion, Slack,
Zapier, Canva, Gamma, Lovable, etc.

## 3. Memory stack (wired this session)

| Engine | Type | Status |
|---|---|---|
| **Supermemory** | hosted MCP | ✅ wired — OAuth on your machine |
| **MemPalace** | local MCP | ✅ wired — `uv tool install mempalace` on your machine |
| Letta / Memos | server/SDK | 📄 documented (need self-host/key) |

→ **Pick ONE primary.** Don't run multiple memory engines (they double-capture).

## 4. Projects in the repo

- **`studio/`** — STARLIGHTMIX Studio (Next.js 15 + Cloudflare Workers) — your main software product
- **`apps/`** — 21 app concepts incl. the new `svelte-animations/` scaffold
- **`sites/`** — 5 pipeline-built sites (codex-of-reality, etc.)
- **Standalone:** `livestock/` (HerdCheck), `recovery/` (Reset), 2 Capacitor iOS wrappers
- **Live marketing site:** repo root → `rhythmixapp.com.au`

## 5. Working integrations (real code, not just reference)

- **`studio/workers/license/openapi.yaml`** + `lint:spec` — OpenAPI spec for the license worker, lints clean
- **`apps/svelte-animations/`** — runnable SvelteKit + Tailwind project
- **MetaGPT** installed + reproducible `scripts/setup-metagpt.sh`

## 6. Reference docs

`docs/MY-STACK-INVENTORY.md` (5-goal capability map) · `docs/COMPLETE-STACK.md` (this) ·
`CREATIVE-AI-STACK.md` · `CLAUDE.md` (always-loaded project memory)

---

## Do you need anything else? — Honest answer: **No more tools. You're past saturation.**

You don't have a tooling gap. You have **2,565 skills and 9 MCP servers**. The gaps are NOT things
to install — they're things to *do*:

### The 4 real gaps (none are "buy/install a skill")
1. **A runtime environment** ⭐ — this web sandbox is ephemeral + network-limited; nothing you've
   collected actually *runs* here. **Fix: GitHub Codespace** (your `.devcontainer/` is ready) or a VPS.
2. **Connected API keys** — Replicate, ElevenLabs, Stripe, Shopify, Higgsfield. Skills are ready; they need credentials.
3. **A Mac + Xcode** (or Codemagic) — only needed for native iOS App Store builds.
4. **One memory engine chosen** — Supermemory (easy/hosted) or MemPalace (private/local). Pick, don't hoard.

### What to STOP
Collecting more tools. The last ~10 pastes (RTOS, fund-manager skill, Git bookmark list, MTG app)
added breadth you won't use, not capability you lack. More inputs ≠ more output.

### What to START (in priority order)
1. **Open a Codespace** — turn this whole repo from "captured" to "running."
2. **Sign into one memory engine** — so Claude stops re-asking.
3. **Ship ONE thing** end-to-end — pick a goal (sell / build / phone / web / YouTube) and build it
   with the skills you already have.

**Bottom line:** You have everything you need to build. The missing piece is a place to run it and
the decision to start.
