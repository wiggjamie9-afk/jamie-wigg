# Full Program Audit — Clean-Slate Reference

_Snapshot for starting over. Status key:_
✅ verified working this session · 🔌 connected, not individually tested · 🔑 needs a key/credits · 📄 reference doc only (not installed) · 🚫 can't run in the cloud sandbox

---

## 1. Connected AI Programs (MCP servers)

These are live integrations available in the Claude session. ~33 servers.

### Image / Video / Creative generation
| Program | Status | Notes |
|---|---|---|
| **PicsArt** | ✅ | FLUX 2 Pro generated a real dog photo this session. Spends PicsArt credits. Strong default for images + video (Kling) + upscale/bg-removal. |
| **Higgsfield** | ✅ / 🔑 | In-session MCP generated a Soul image (account had ~49.6 credits). The **API-key path** (for CI) is on a *different* account with **no credits**. |
| **Canva** | 🔌 | Design generation, brand templates, export. |
| **Gamma** | 🔌 | AI decks / docs / webpages / social posts. |
| **Figma** | 🔌 | Design ↔ code, FigJam diagrams, design systems. |
| **Pollinations** | 🚫 | Free image/text, but the sandbox egress blocks `*.pollinations.ai` at runtime. |

### Design / Diagramming
| Program | Status |
|---|---|
| **Excalidraw, Lucid, Miro, Three.js viewer** | 🔌 diagrams, whiteboards, 3D scenes |

### Docs / Productivity / Comms
| Program | Status |
|---|---|
| **Notion, Mem, Google Drive, Gmail, Google Calendar, Slack** | 🔌 |

### Dev / Infra / Web
| Program | Status |
|---|---|
| **GitHub** | ✅ used all session (read repo, Actions, logs). Note: **cannot dispatch workflows** (integration lacks permission). |
| **Cloudflare, Webflow, Lovable, Swagger, GraphOS (Apollo), Manufact, Hugging Face** | 🔌 |

### Data / Automation / Other
| Program | Status |
|---|---|
| **Airtable, Zapier** | 🔌 data + 9,000-app automation |
| **Spotify, Play Sheet Music** | 🔌 music |
| **ICD-10 Codes, protocols.io, Upwork, PDF Viewer** | 🔌 niche |
| **Playwright** | ✅ browser automation (Chromium present) |

> ⚠️ Connected servers cycle (connect/disconnect between turns). 🔌 = available but I didn't individually auth-test it.

---

## 2. In-repo MCP servers (`.mcp.json`)

| Key | Purpose | Status |
|---|---|---|
| `stepfun` | Step 3.7 Flash — script/story gen | 🔑 needs `STEP_API_KEY` |
| `creative-stack` | Replicate + ElevenLabs (image/video/music/TTS) | 🔑 needs `REPLICATE_API_TOKEN` / `ELEVENLABS_API_KEY` |
| `higgsfield` | Soul / DOP | 🔑 keys in `.env`, but account has no credits |
| `pollinations` | free gen | 🚫 egress-blocked at runtime |
| `playwright` / `claude-playwright` | browser automation | ✅ |
| `context7` | live library docs | 🔑 needs `CONTEXT7_API_KEY` |

---

## 3. Installed & working in this sandbox

✅ Node 22 · npm · pnpm · Python 3.11 · pip · **ffmpeg 6.1.1** · **MoviePy 2.1.2** · git · **Chromium** (at `/opt/pw-browsers`) · **HyperFrames 0.4.42** (via npx)

→ This is the **local movie + render pipeline** — works with zero API keys. Proven this session (rendered MP4s + PNG mockups).

⚠️ Ephemeral: the sandbox resets. ffmpeg/moviepy must be reinstalled (the Mac setup script handles this).

---

## 4. Reference / setup docs (NOT installed — tools you *could* install)

| Doc | Tool | Can you install? |
|---|---|---|
| `SETUP-MOVIEPY.md` | MoviePy | ✅ done here; trivial on Mac |
| `SETUP-RUIXEN-UI.md` | 240+ shadcn components | ✅ any React project |
| `SETUP-SD-WEBUI.md` | Stable Diffusion WebUI | 🔑 needs a GPU (Apple-Silicon Mac via MPS) |
| `SETUP-PALMIER-PRO.md` | MCP video editor | 🚫 macOS 26 + Apple Silicon only |
| `SETUP-MINIMAX-01.md` | foundation model | 🚫 needs ~8 GPUs — use hosted API |
| `SETUP-OPENMANUS.md` | browser-automation agent | 🔑 needs LLM backend |
| `SETUP-AGENT-TARS.md` / `SETUP-HERMES.md` / `SETUP-FREEBUFF.md` | agent CLIs | 📄 reference |
| `SETUP-DEEP-PLAYGROUND.md` | NN teaching demo | 📄 reference |
| `VOICEBOX-SETUP.md` / `KOKORO-SETUP.md` | local/lightweight TTS | 🔑 Mac / pip |
| `SETUP-MAC-CREATIVE-PIPELINE.md` | **one-command Mac installer** (added this session) | ✅ |
| `CAPACITOR-IOS-SETUP.md` | iOS wrapper | 🔑 needs Xcode/Mac |

---

## 5. Repo projects

| Path | What it is |
|---|---|
| `studio/` | STARLIGHTMIX Studio — Next.js 15 web app → Cloudflare Pages |
| `agent-builder/` | Agent builder app (Next.js, has tests + migrations) |
| `livestock/` | HerdCheck — livestock screening PWA |
| `recovery/` + `recovery-ios/` | Reset recovery app + Capacitor iOS wrapper |
| `capacitor/` | iOS wrapper for Studio |
| `sites/` | Site-build pipeline output (codex-of-reality, rhythmix, hum, codex) |
| `apps/` | Standalone apps + `untapped/` (10 concepts) + avatar-proxy |
| `automation/` | Kling→socials n8n workflow |
| `pageagent/` | PageAgent web copilot |
| `infra/` | Wiki.js + Postgres + Caddy (Docker) |
| `video/` | Dormant Remotion starter (not used — see ADR-0001) |
| `rhythmix-*/` | **52 HyperFrames video folders** |

---

## 6. CI workflows (17)

Pages deploy, Studio deploy, agent-builder deploy, Tests, **portrait generation** (×2), book/episode pipelines (glowworm, little-sunny, book1), channel art, YouTube auth (×4).

⚠️ Portrait generation is **blocked on Higgsfield credits** (account empty). All AI-asset workflows need the relevant key/credits to actually run.

---

## 7. Skills

~849 user-invokable skills. Mostly **security/pentest** skills (hundreds), plus creative (`dream`, `album-launch`, `rhythmix-*`), site-build, spec, and engineering skills.

---

## VERDICT — what to keep when starting over

**✅ Use now, zero setup:** HyperFrames + MoviePy + ffmpeg + Chromium (local movies/graphics), PicsArt (AI images, your credits), GitHub, Playwright.

**🔑 One key away from working:** creative-stack (Replicate), Higgsfield (needs credits on the API-key account), Context7, StepFun, ElevenLabs.

**🔌 Connected, just untested:** Canva, Gamma, Figma, Notion, Drive, Slack, Airtable, Zapier, Lovable, Cloudflare, etc. — pick the few you'll actually use and verify them.

**📄 / 🚫 Prune or ignore:** SD-WebUI / Palmier / MiniMax (hardware you don't have), agent-CLI reference docs, Pollinations (blocked here), and the long tail of niche MCPs (ICD-10, protocols.io, Upwork) unless you have a specific use.

**Biggest lever for a clean restart:** decide your *image* source (PicsArt ✅ works today, or Higgsfield once credited) and your *movie* path (HyperFrames is already proven). Everything else is optional.
