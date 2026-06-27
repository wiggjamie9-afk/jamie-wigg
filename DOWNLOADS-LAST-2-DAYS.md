# Downloads — Last 2 Days

> A plain summary of everything added to the `jamie-wigg` repo over the last two days,
> so you can pull it down to your Mac in one place.
>
> **Period covered:** 2026-06-26 → 2026-06-28
> **Pull requests merged:** #106, #107
> **Generated:** 2026-06-27

---

## How to get this onto your Mac

Open Terminal on your Mac and run:

```bash
# If you already have the repo cloned:
cd path/to/jamie-wigg
git pull

# If you don't have it yet:
git clone https://github.com/wiggjamie9-afk/jamie-wigg.git
cd jamie-wigg

# This summary file:
open DOWNLOADS-LAST-2-DAYS.md
```

Or download just this one file from GitHub:
`https://github.com/wiggjamie9-afk/jamie-wigg/blob/main/DOWNLOADS-LAST-2-DAYS.md` → **Raw** → save.

---

## #106 — PageAgent copilot, tooling docs, Kling→socials workflow

### 🤖 PageAgent in-page GUI copilot (MIT)
An in-page, text-based DOM agent for RHYTHMIX web pages — no browser extension,
no headless browser, no screenshots.

| File | Lines | What it is |
|---|---:|---|
| `pageagent/pageagent-copilot.js` | 174 | Drop-in loader. Pins PageAgent v1.10.0, falls back from jsDelivr to the npmmirror CDN, exposes `window.rhythmixCopilot`. Free demo LLM by default; switches to production when model + baseURL + apiKey are supplied. |
| `pageagent.html` | 368 | Brand-locked standalone demo at the site root. Drives a "request a custom cut" form by natural language, with an offline fallback if the CDN is blocked. |
| `pageagent/README.md` | 124 | Integration, production key-handling, and API docs. |

### 📄 New setup / reference docs (`SETUP-*.md`)
Local/cloud tool references following the repo's existing `SETUP-*.md` convention.

| File | Lines | Covers |
|---|---:|---|
| `SETUP-SD-WEBUI.md` | 187 | Stable Diffusion WebUI (AUTOMATIC1111) — local/cloud image generation, `--api` workflow wired to RHYTHMIX assets. |
| `SETUP-MOVIEPY.md` | 167 | MoviePy v2 — Python post-processing over HyperFrames/FFmpeg, v1→v2 migration cheat-sheet, RHYTHMIX recipes. |
| `SETUP-MINIMAX-01.md` | 164 | MiniMax-01 (Text-01 456B MoE / VL-01) — long-context + multimodal foundation models. |
| `SETUP-RUIXEN-UI.md` | 96 | Ruixen UI — shadcn-compatible React component catalog (240+ components). |
| `SETUP-PALMIER-PRO.md` | 82 | Palmier Pro — MCP-controllable video editor (GPLv3), agent-driven NLE timeline. |
| `SETUP-DEEP-PLAYGROUND.md` | 67 | TensorFlow Deep Playground — TS + d3 neural-net visualization, teaching/demo tool. |
| `SETUP-FREEBUFF.md` | 63 | Freebuff — terminal AI coding-agent CLI reference. |

### 🎬 Kling → socials automation (n8n)
| File | Lines | What it is |
|---|---:|---|
| `automation/kling-social-pipeline/workflow.json` | 304 | n8n workflow: Kling video → social channels. |
| `automation/kling-social-pipeline/README.md` | 85 | How to import and run the workflow. |

### ✏️ Updated
- `CREATIVE-AI-STACK.md` — added an AUTOMATIC1111 row to the image-generation table.
- `CLAUDE.md` — listed all new docs under "Reference docs at root".

---

## #107 — CI fix: green up the Tests workflow

No application code changed — purely CI/infra cleanup.

- `.github/workflows/test.yml` — `npm test --if-present` (root has no test script); dropped the broken `cache: npm` reference to the uncommitted `agent-builder/package-lock.json`.
- `.github/workflows/deploy-agent-builder.yml` — removed the same broken cache reference; bumped `upload/download-artifact` v3 → v4 (v3 is sunset).
- `external-projects/mhdbdb-tei` — removed a dangling submodule gitlink that logged a fatal warning on every checkout.

Verified locally: 239 tests pass, lint clean, `next build` succeeds.

---

## At a glance

- **New files:** 12 (1 JS loader, 1 HTML demo, 8 Markdown docs, 1 n8n workflow JSON, 1 workflow README)
- **Modified files:** 5 (`CLAUDE.md`, `CREATIVE-AI-STACK.md`, 2 CI workflows, 1 submodule gitlink removed)
- **New lines of content:** ~1,880 across the new asset files
