# Build Blueprint — Claude as Agent for Websites & Apps

End-to-end workflow for going from a one-line idea to a deployed website or app using Claude Code in this repo. Each phase says: **what to do**, **what tool to use**, **where the output goes**.

References:
- `PROMPTS.md` — paste-ready strategy/design prompts
- `CLAUDE.md` — repo conventions, video pipeline, skills
- `.claude/skills/` — installed Claude Code skills
- `.claude/mcp/creative-stack/` — image/video/music/voice MCP server

---

## Phase 0 — Setup (once per machine)

1. Ensure MCP servers are wired in `.claude/settings.json`:
   - **GitHub** — read/write the repo, PRs, comments (already configured)
   - **Vercel** — deploy previews, runtime logs (`mcp__1b581061-...__deploy_to_vercel`)
   - **Cloudflare** — D1 (DB), KV (cache), R2 (storage), Hyperdrive (`mcp__137830ca-...`)
   - **Figma** — design import (`mcp__74ed5131-...__get_design_context`)
   - **Notion** — docs/spec (`mcp__cf52cc63-...`)
2. Create the project branch: `git checkout -b <project-name>`.
3. Drop the brief into `BRIEF.md` at the project root.

---

## Phase 1 — Discover (validate the idea)

**Goal:** confirm there's a real market before writing code.

Paste these from `PROMPTS.md`, one by one, replacing `[YOUR NICHE]`:

| Prompt | What you get |
|---|---|
| #1 Market Breakdown | TAM/SAM/SOM, demand trends |
| #2 Problem Prioritization | Ranked list of expensive problems |
| #3 Competitor Weakness | Gaps the incumbents leave open |

Save Claude's output to `docs/01-discovery.md`.

**Stop and decide:** is this market real, is the problem expensive, is there a gap? If not, rewrite the brief.

---

## Phase 2 — Offer & Positioning

**Goal:** turn the validated problem into a sellable offer with copy.

| Prompt | Output |
|---|---|
| #6 Offer Creation | ICP + value prop + pricing tiers + guarantee |
| #7 Landing Page Builder | Real page copy (hero → CTA) |
| #8 Brand Voice | 3-word voice + tone-by-context + vocab rules |
| #9 Pitch Deck (optional) | 8-slide investor narrative |

Save to `docs/02-offer.md` and `docs/03-copy.md`.

---

## Phase 3 — Design

**Goal:** lock visual direction before building.

| Prompt | Output |
|---|---|
| #4 Design Blueprint | Aesthetic + colors (hex) + typography + layout |
| #5 Design Teardown | 5 competitors visually analyzed |

If you have a Figma file, use the Figma MCP instead:
```
get_design_context(fileKey, nodeId) → code + screenshot + design tokens
```

Save direction to `docs/04-design.md` (palette, fonts, spacing scale).

---

## Phase 4 — Build (Claude Code does the work)

**Goal:** ship a working app.

### Plan first
Use the **Plan agent** for anything non-trivial:
```
Agent({ subagent_type: "Plan", prompt: "Implement the landing page from docs/03-copy.md
with the design system in docs/04-design.md. Stack: Next.js 15 App Router, Tailwind v4,
deploy to Vercel. Return a step-by-step plan." })
```

### Stack defaults (adjust to project)
- **Marketing site** → Next.js 15 + Tailwind v4 + shadcn/ui, deploy to Vercel
- **Web app with auth + DB** → Next.js + Cloudflare D1 (SQLite) + KV (sessions) + R2 (uploads)
- **Promo video** → HyperFrames (use `rhythmix-author` or `hyperframes` skill); render with `hyperframes render`
- **Product demo video** → Remotion (`video/` project in this repo)

### While building
- **Track tasks** with TodoWrite — one task per discrete unit of work; mark complete as you go.
- **Search code** with the `Explore` agent before editing unfamiliar areas.
- **Run lint/typecheck** after each significant change: `npm run lint` in `video/`, or equivalent.
- **Test the UI in a browser** before saying it's done — type checks don't verify feature correctness.

### Before merging
- Run the **`simplify`** skill — reviews for reuse/quality/efficiency, fixes issues.
- Run **`/review`** or **`/ultrareview`** for a multi-agent code review (ultrareview is paid; review is local).
- Run **`/security-review`** if the change touches auth, input handling, or external APIs.

---

## Phase 5 — Deploy

| Surface | How |
|---|---|
| Next.js → Vercel | `mcp__1b581061-...__deploy_to_vercel` then `get_deployment_build_logs` |
| Cloudflare Workers | Push, Wrangler deploy (or MCP `workers_get_worker`) |
| Static HyperFrames promo | `hyperframes render` → upload mp4 to landing page |
| GitHub Pages / static | `gh-pages` branch or Vercel static |

After deploy:
- Check **runtime logs** (`get_runtime_logs`) for the first 10 minutes.
- Subscribe to Sentry alerts if configured (`mcp__40e24635-...__search_issues`).

---

## Phase 6 — Distribute & Iterate

| Prompt | Output |
|---|---|
| #10 Distribution Domination | 30-day plan to reach 1M people across 5 channels |
| #11 Viral Content Engine | 20 hooks + 10 formats + emotional triggers |

For RHYTHMIX-style promo videos, use the `rhythmix-author` skill — it already encodes the brand and renders end-to-end.

Track what works in `docs/05-distribution.md` and feed wins back into the next iteration.

---

## Phase 7 — Scale (when something works)

| Prompt | Output |
|---|---|
| #12 Scale System (short) | Automate / delegate / hire roadmap |
| #13 Scaling System (4-phase) | Week-by-week design production scale plan |

---

## Cheat Sheet — When to Use What

- **"Build me a landing page for X"** → Phase 2 (#7) → Phase 3 (#4) → Phase 4 (Plan agent + Next.js + Vercel).
- **"Make a promo video"** → `rhythmix-author` skill or `/dream <description>`.
- **"Capture a website into a video"** → `website-to-hyperframes` skill.
- **"What should I build next?"** → Phase 1 prompts against your customer list.
- **"Is this PR safe to merge?"** → `/review` + `/security-review`.
- **"Watch this PR for review comments and CI"** → `mcp__github__subscribe_pr_activity`.

---

## Anti-patterns (don't do)

- Don't skip Phase 1 — building before validating wastes weeks.
- Don't paste all 13 prompts at once — Claude does better one focused prompt at a time.
- Don't commit without running lint/typecheck.
- Don't deploy without checking runtime logs for the first 10 minutes.
- Don't write speculative abstractions or extra error handling "just in case" — see `CLAUDE.md` conventions.
