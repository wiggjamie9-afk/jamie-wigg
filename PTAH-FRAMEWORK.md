# Ptah Operational Framework

RHYTHMIX operational model: approved surfaces, tools, and MCPs integrated into a single decision-making and execution framework.

## Framework Overview

**Ptah** structures operational decisions around three layers:

1. **Approved Surfaces** — where decisions are recorded and visible
2. **Approved Tools** — what can execute decisions
3. **Approved MCPs** — intelligent context providers and automation interfaces

This repo uses Ptah to coordinate creative + commercial workflows (video production, launches, content distribution, checkout automation).

## 1. Approved Surfaces

### Primary (Visible to Team)

| Surface | Purpose | Sync Pattern |
|---------|---------|---|
| **GitHub Issues** | Feature requests, bugs, spec clarifications | Real-time (webhook) |
| **GitHub Discussions** | Design decisions, product strategy, RFCs | Async (weekly digest) |
| **GitHub Projects** (board) | Sprint tracking, burndown, dependencies | Real-time (Kanban automation) |
| **Notion Workspace** | Brand bible, production runbooks, launch calendars | Bidirectional (n8n automation) |
| **Hostinger VPS** | Deployed wiki (wiki.rhythmixapp.com.au), file storage | Manual (git + rsync) |

### Secondary (Internal Only)

| Surface | Purpose | Retention |
|---------|---------|---|
| `.claude/` hooks | Claude Code session entry/exit logic | Permanent (version controlled) |
| `specs/` folder | Spec-driven feature folders (requirements, design, tasks) | Permanent (git) |
| `docs/adr/` | Architecture decision records | Permanent (git) |
| `docs/agents/` | Agent operating procedures | Permanent (git) |
| `docs/security/` | Security notes, pentesting runbooks | Permanent (git, private) |

## 2. Approved Tools

### Creative Pipeline

| Tool | Purpose | Input | Output | Owner |
|------|---------|-------|--------|-------|
| **HyperFrames** | Video composition (60s promos, cuts) | Script + design | `.mp4`, `.webm` | Claude Code / local |
| **STARLIGHTMIX Studio** | Music video generation (user-facing SaaS) | Audio track + theme | `.mp4` + cover art | Next.js 15 (deployed) |
| **Ollama** | Local LLM (script gen, form parsing, reasoning) | Prompt | Text response | Local (laptop) |
| **Replicate** | Cloud generative models (image, video, music) | Seed + params | URL (asset) | MCP server |
| **Higgsfield** | Text-to-image + image-to-video (Soul + DOP) | Prompt or image | `.mp4` | MCP server |
| **Pollinations** | Free tier (FLUX image, Suno music, TTS) | Prompt | File/URL | MCP server (public API) |
| **ElevenLabs** | Voice synthesis (TTS, voice cloning) | Text + voice ID | `.wav` / `.mp3` | MCP server + CLI |
| **Step.fun Flash** | Narrative + script generation (multi-modal) | Story brief + images | Copy, scripts, act structure | MCP server |
| **Kokoro TTS** | Lightweight multilingual narration | Text + voice | `.wav` | CLI (`uv tool install kokoro-tts`) |

### Commercial / Operations

| Tool | Purpose | Input | Output | Owner |
|------|---------|-------|--------|-------|
| **Treegress + Ollama** | Checkout automation (repeat buys) | Form URL + profile | Order confirmation | MCP server (this repo) |
| **n8n** | Workflow orchestration (Notion ↔ GitHub, email, webhooks) | Trigger + steps | API call / notification | Hosted on Hostinger VPS |
| **Eva-gateway** | API gateway + edge cache (Hostinger) | HTTP request | Response + cache headers | Hostinger VPS |
| **GitHub Actions** | CI/CD (build, test, deploy) | Commit / workflow_dispatch | Artifact / deployed site | GitHub (this repo) |

### Monitoring & Analysis

| Tool | Purpose | Input | Output | Owner |
|------|---------|-------|--------|-------|
| **Claude Code** | AI coding + planning (primary interface) | Natural language | Code, specs, decisions | This session |
| **Figma** | Design system, component mockups | Sketch or design brief | `.fig` component library | MCP server |
| **Context7** | Library docs (current versions) | Query | Docs excerpt | HTTP MCP |

## 3. Approved MCPs

### Registered in `.mcp.json`

| MCP | Command | Env Setup | Status |
|-----|---------|-----------|--------|
| **stepfun** | `node .claude/mcp/stepfun/server.mjs` | `STEP_API_KEY`, `STEP_BASE_URL` | ✅ Registered |
| **creative-stack** | `node .claude/mcp/creative-stack/server.mjs` | `REPLICATE_API_TOKEN`, `ELEVENLABS_API_KEY` | ✅ Registered |
| **higgsfield** | `higgsfield-mcp` (CLI) | `HIGGSFIELD_API_KEY`, `HIGGSFIELD_SECRET` | ✅ Registered |
| **pollinations** | `npx -y @pollinations/model-context-protocol` | None (anonymous tier) | ✅ Registered |
| **playwright** | `npx -y @playwright/mcp@latest` | None | ✅ Registered |
| **claude-playwright** | `node node_modules/claude-playwright/dist/mcp/server.cjs` | `BASE_URL` | ✅ Registered |
| **context7** | `https://mcp.context7.com/mcp` (HTTP) | `CONTEXT7_API_KEY` | ✅ Registered |
| **treegress-ollama** | `node .claude/mcp/treegress-ollama/server.mjs` | `OLLAMA_API_URL`, `OLLAMA_MODEL`, `CHECKOUT_PROFILES` | ✅ Registered |

## 4. Decision Matrix

### What to Use When?

#### 🎬 Creating a 60-second promo for YouTube

1. **Decision surface**: GitHub Issue (tagged `video/promo`)
2. **Tool chain**: Step.fun Flash (script) → HyperFrames (compose) → Replicate/Higgsfield (assets) → Playright (test on YouTube) → GitHub Actions (deploy)
3. **MCP chain**: `stepfun` (script brief) → `creative-stack` (music/image) → `higgsfield` (talking head) → `claude-playwright` (screenshot)
4. **Approval**: Claude Code session with manual screenshot review before publishing

#### 🎵 Launching a new album (4 creative assets)

1. **Decision surface**: GitHub Issue + Notion Launch Checklist
2. **Tool chain**: 
   - Cover art: Replicate (`flux-1.1-pro`) or Higgsfield (`Soul`)
   - Single track: Pollinations (free Suno) or Replicate (`musicgen`)
   - 60s promo video: HyperFrames + Higgsfield
   - Landing page: `/site-build` pipeline → GitHub Pages
3. **MCP chain**: Parallel agents (one per asset via `Agent` tool)
4. **Approval**: Cover art + music previewed in Claude Code; video screenshot; landing page preview in browser

#### 🛒 Automating a repeat purchase (subscription)

1. **Decision surface**: Notion "Commerce" table
2. **Tool chain**: Ollama (local LLM) → Treegress MCP (checkout automation) → approval gate → submit
3. **MCP chain**: `treegress-ollama` (form parsing + filling)
4. **Approval**: Manual confirmation before clicking "Place Order"

#### 📋 Releasing a new feature (STARLIGHTMIX Studio update)

1. **Decision surface**: GitHub Issue + ADR in `docs/adr/`
2. **Tool chain**: 
   - Design: Figma → MCP snapshot
   - Code: VS Code (local) or Claude Code (remote)
   - Tests: `pnpm test` (Vitest)
   - Build: GitHub Actions → Cloudflare Pages
   - Monitoring: Replay (if CI fails) + Claude inspection
3. **MCP chain**: `context7` (Next.js/Tailwind docs) → `claude-playwright` (preview + test interactions)
4. **Approval**: Passing CI + manual preview before production GitHub Environment approval

#### 📸 Research for content (top TypeScript repos, competitor sites, etc.)

1. **Decision surface**: GitHub Discussion or internal note
2. **Tool chain**: Claude Code with `Agent` subagent for parallel research
3. **MCP chain**: `playwright` (screenshot) + `context7` (framework docs)
4. **Approval**: None (read-only research)

## 5. Workflow Patterns

### Pattern: Spec-Driven Feature Delivery

```
1. Create GitHub Issue (feature request)
   ↓
2. `/spec-quick <description>` → generates specs/ folder
   ↓
3. `/spec-analyze <slug>` → surface ambiguities (iterate if needed)
   ↓
4. `/spec-run <slug>` → spawn isolated Agent tasks (parallel)
   ↓
5. Each task runs in isolation; dependencies auto-resolved
   ↓
6. Merge back into `specs/<slug>/` when complete
   ↓
7. GitHub PR (with spec link) → CI runs → manual approval → deploy
```

### Pattern: Video Promo Launch

```
1. GitHub Issue → product brief
   ↓
2. `/rhythmix-spec <brief>` → generates video-specific spec questions
   ↓
3. Answer clarifying questions (aspect ratio, duration, style)
   ↓
4. `/rhythmix-author <brief>` → orchestrates end-to-end:
   - stepfun (script)
   - creative-stack (music/images)
   - HyperFrames (compose)
   - CLI render (MP4)
   ↓
5. Claude Code preview + approval
   ↓
6. Publish to YouTube + GitHub Pages + social
```

### Pattern: Checkout Automation for Subscription

```
1. Notion "Commerce" table → add repeat order row
   ↓
2. n8n workflow (triggered daily/weekly) → webhook to Claude Code
   ↓
3. Claude Code session (via hook or manual) → runs:
   - `browser_open <subscription_url>`
   - `checkout_analyze`
   - `checkout_fill_profile <saved_profile>`
   - Manual approval step (user reviews)
   - `checkout_confirm`
   ↓
4. Success → Notion row updates ("Charged ✓, next renewal in 7d")
   ↓
5. Failure → alert escalates to Slack/email (n8n)
```

## 6. Security Boundaries

### Public Surfaces (GitHub Pages, rhythmixapp.com.au)

- ✅ All `.html` files at repo root
- ✅ Content in `sites/<slug>/`
- ✅ Landing pages (no auth required)
- ✅ Public API docs (if deployed)

### Private Surfaces (Notion, Hostinger wiki, checkout profiles)

- ✅ Only Jamie (wiggjamie28) can access
- ✅ Notion workspace: private to business account
- ✅ Hostinger wiki: IP-restricted or auth-gated (configure in n8n)
- ✅ `checkout-profiles.json`: gitignored, never pushed
- ✅ `.env` secrets: never committed

### Read-Only Surfaces

- ✅ `docs/adr/`, `CONTEXT.md`, `CLAUDE.md` (decision records)
- ✅ Figma library (shared component reference)
- ✅ GitHub Discussions (visible to team, not executable)

### Execution Surfaces (Tools / MCPs)

- ✅ Replicate token: scoped to RHYTHMIX projects only
- ✅ ElevenLabs key: scoped to voice IDs (no access to other accounts' voices)
- ✅ Ollama: runs locally (no network keys required)
- ✅ Checkout profiles: local only, never synced
- ⚠️ GitHub Actions secrets: auto-redacted in logs

## 7. Integration Examples

### Example 1: Daily Coffee Subscription Order

**Goal**: Auto-order coffee every Tuesday without manual checkout.

**Setup**:

```bash
# 1. Save profile
node scripts/checkout-demo.js https://coffee-shop.com/account default

# 2. Create n8n workflow:
#    Trigger: Cron (every Tuesday 9 AM)
#    → Call Claude Code webhook
#    → Pass URL + profile name

# 3. Claude Code session (auto-triggered by n8n):
browser_open { url: "https://coffee-shop.com/reorder" }
checkout_analyze { profile: "default" }
checkout_fill_profile { profileName: "default", autoApprove: true }
# autoApprove: true because it's a repeat, low-value order
checkout_confirm { submitButtonRefId: "ref_42" }

# 4. Confirmation → Notion row updates
```

### Example 2: Launch a New Music Video Series

**Goal**: 5 video promos + landing page + email campaign in parallel.

**Setup**:

```bash
# 1. GitHub Issue → product brief
# 2. Create specs/rhythmix-launch-vol1/
# 3. Run spec-driven launch:

/rhythmix-spec "5-part music video series, launch this Friday"

# Clarifying questions (auto-generated):
# - Duration per video? (answer: 60s landscape + 30s shorts)
# - Target audience? (answer: EDM/dance fans)
# - Brand lock? (answer: rhythmix-teaser-60s/DESIGN.md)
# - Music? (answer: provide 3 track URLs)

# 4. Spec workflow spawns 5 parallel agents:
Agent 1: Cover art (Replicate + Figma upload)
Agent 2: Track 1 promo (HyperFrames + render)
Agent 3: Track 2 promo (HyperFrames + render)
Agent 4: Track 3 promo (HyperFrames + render)
Agent 5: Landing page (/site-build pipeline)

# 5. All agents complete in ~2 hours
# 6. Claude Code review: previews + diffs
# 7. GitHub PR → CI → deploy to GitHub Pages
```

### Example 3: Security Audit (Pentesting)

**Goal**: Audit STARLIGHTMIX Studio license endpoint.

**Setup** (from `docs/security/shannon.md`):

```bash
# 1. Claude Code session with Shannon agent (specialized pentesting subagent)
# 2. Target: https://license.studio.starlightmix.com/api/license
# 3. Shannon autonomously tests:
#    - Input validation
#    - Rate limiting
#    - Token verification
#    - Cache-busting attacks
# 4. Report → GitHub Issue (private)
# 5. Fixes → GitHub PR → deploy
```

## 8. Ptah Checklist

### Before Starting Operational Work

- [ ] Is there a corresponding GitHub Issue? (link it)
- [ ] Which approved surface? (GitHub Issues / Notion / Discussions)
- [ ] Which tool chain? (creative / commercial / research)
- [ ] Which MCPs? (listed above + required env vars)
- [ ] Approval gates needed? (before irreversible actions)
- [ ] Monitoring / success criteria? (how do we know it worked)

### Before Pushing Code

- [ ] All changes in spec `/requirements.md` are implemented?
- [ ] Tests pass? (`pnpm test` for studio/)
- [ ] Linting passes? (`pnpm lint` for studio/)
- [ ] No secrets in commits? (`npm audit`, `.env` excluded)
- [ ] ADR updated? (if architectural change)
- [ ] GitHub Issue linked in PR title?

### Before Launching to Production

- [ ] CI passes (GitHub Actions)
- [ ] Manual preview in browser (for UI/video)
- [ ] Notion checklist updated
- [ ] GitHub Milestone updated (if release)
- [ ] Announce in GitHub Discussions or email?

## 9. Reference

- **CONTEXT.md** — domain language (Promo, Cut, Narration, Hook)
- **docs/adr/** — architecture decisions (ADR-0001: HyperFrames over Remotion)
- **docs/agents/** — agent operating procedures
- **CLAUDE.md** — Claude Code quick start
- **TREEGRESS-OLLAMA-SETUP.md** — checkout automation guide
- **.mcp.json** — registered MCPs
- **.claude/settings.json** — Claude Code session config
- **.claude/hooks/** — session-start / session-end scripts

---

**Last Updated**: 2026-06-23
**Framework Version**: 1.0
**Maintainer**: Jamie Wigg (@wiggjamie9)
