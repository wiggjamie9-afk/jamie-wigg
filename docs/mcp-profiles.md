# MCP Profiles — Three Outfits, Not One Wardrobe

*Task T1.3. The single discipline that protects your context window.*

You can reach ~37 MCP servers. ECC's hard rule: **< 10 MCPs / < 80 tools per
project**, or your 200k context collapses toward ~70k. So you wear **one profile
per session**, matched to the lane you're working. Switch with `/mcp` (live
disables persist in `~/.claude.json`).

> Pick the profile **before** you start, not midway. The cost of an unfiltered
> fleet is paid silently — as a smaller usable window — and you won't notice
> until the agent starts forgetting.

---

## Profile: `content`  (RHYTHMIX / marketing production)

| Enable | Why |
|---|---|
| HyperFrames | render the Cut |
| Higgsfield | image/video/audio gen + `virality_predictor` gate |
| Canva / Gamma | stills, decks, social posts |
| Picsart | thumbnails, bg removal, vectorize |
| Hugging Face | model/data lookups |
| Spotify | reference / mood |

Subagents: `short-form-video`, `thumbnail-designer`, `seo-writer`,
`x-twitter-growth`. Budget ≈ 50 tools.

---

## Profile: `software`  (Studio / Workers / PWAs)

| Enable | Why |
|---|---|
| Cloudflare | Workers, KV, Pages, D1 |
| Stripe | billing surfaces (read first) |
| Figma | design → code |
| GitHub (built-in) | PRs, CI, issues |
| Context7 | **always-on here** — current library docs |
| Playwright | E2E / browser checks |

Subagents: `planner`, `architect`, `code-reviewer`, `security-reviewer`,
`typescript-reviewer`, `e2e-runner`. Budget ≈ 60 tools.

---

## Profile: `ops`  (run the business)

| Enable | Why |
|---|---|
| Notion | docs, dashboard mirror |
| Slack | comms |
| Gmail | inbox triage (drafts; sends need approval) |
| Google Calendar / Drive | schedule, files |
| Airtable | CRM / pipeline |
| Stripe (read) | revenue check |

Subagents: `chief-of-staff`, `morning-briefing`, `inbox-zero`,
`meeting-notes`. Budget ≈ 55 tools.

---

## Rules of the road

- **One profile at a time.** Never "everything on."
- **Context7** lives only in `software`.
- **Outbound is gated** in `ops` — Gmail/Slack/Stripe *writes* need explicit
  approval; reads are free.
- If ECC bundles an MCP you already run (Playwright, Context7), set
  `ECC_DISABLED_MCPS` so install/sync skips the duplicate.
- Specialist servers (Lucid, Miro, Excalidraw, ICD-10, protocols.io, Swagger,
  Upwork, Three.js, PDF) are **on-demand** — enable for the one task, then off.
```
