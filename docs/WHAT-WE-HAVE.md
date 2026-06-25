# What We Have — A Full Inventory Lesson

*A grounded tour of the entire ecosystem: every asset class, real counts (surveyed
from the repo, not guessed), what each thing is for, and the one lesson that
matters most once you see the whole board.*

Read this with `docs/ecc-harness-overview.md` (the engine),
`docs/ecc-ecosystem-integration-strategy.md` (how to wire it), and
`docs/BUSINESS-GUIDE.md` (the business it runs). This file answers the simplest,
most important question: **what do we actually have?**

> All counts below were measured from the working tree on the
> `claude/ecc-harness-overview` branch. Repo size: **~1.2 GB**.

---

## The Lesson in One Sentence

You are not short on capability — you have a **studio-grade arsenal** (≈850
skills, ≈196 agents, ~37 live MCP integrations, 50+ shipped HTML apps, 52 video
cuts). The scarce resource is **focus and finish**, not tools. Everything in
this inventory is leverage; the job is to point a *small slice* of it at one
thing until it makes money, then repeat.

---

## Layer 0 — The Harness (how you operate)

| Asset | Count / detail | What it's for |
|---|---|---|
| **Skills** (`.claude/skills`) | **849** (source: 814 in `.agents/skills`) | Repeatable workflows + domain knowledge — your primary surface |
| **FleetView agents** (`.claude/agents`) | **196** | Specialized subagents you delegate to by role |
| **Local MCP servers** (`.mcp.json`) | 7 — stepfun, creative-stack, higgsfield, pollinations, playwright, claude-playwright, context7 | Repo-native tool integrations |
| **ECC operator layer** | documented, not yet installed | The control plane that routes/gates/remembers (see overview) |
| **Governance** | `.claude/settings.json` allowlist, session-start hook | Permissions + health check |

**Teaching point:** 849 skills is *too many to hold in context at once* — that's
fine. Skills are a library you pull from, not a thing you load wholesale. The
skill is knowing *which* one to reach for. ECC's continuous-learning is what
keeps that library curated to your real habits.

---

## Layer 1 — The Connected MCP Fleet (what you can reach)

This session alone surfaced **~30 live MCP servers** beyond the local 7. They
cluster into four capability domains:

| Domain | Servers | What it unlocks |
|---|---|---|
| **Create** | HyperFrames, Higgsfield, Canva, Gamma, Picsart, Hugging Face, Spotify, Play Sheet Music, Three.js | Video, image, audio, music, 3D, decks, models |
| **Build** | Cloudflare, Lovable, Webflow, Figma, Swagger, GraphOS/Apollo, Manufact | Apps, sites, designs, APIs, deploys |
| **Run the business** | Notion, Slack, Gmail, Google Calendar, Google Drive, Airtable, Stripe, Upwork, Zapier (9,000+ apps) | Comms, docs, scheduling, CRM, payments, automation |
| **Specialist / reference** | Lucid, Miro, Excalidraw, PDF Viewer, ICD-10, protocols.io | Diagrams, whiteboards, docs, healthcare/science data |

**Teaching point — this is the trap.** ~37 servers = *hundreds* of tools. ECC's
rule is **<10 MCPs / <80 tools per project** or your 200k context collapses to
~70k. So the fleet is a wardrobe, not an outfit: you wear the **content**,
**software**, or **ops** profile for a session (see strategy doc §1), never all
of it at once.

---

## Layer 2 — The Products (what you've shipped)

### Flagship software
| Product | Where | State |
|---|---|---|
| **STARLIGHTMIX Studio** | `studio/` (Next.js 15 static export) | Live, deployable. **3 Cloudflare Workers**: `license`, `replicate-proxy`, `avatar-proxy` |
| **Marketing site** | repo root — **36 live `.html` pages** | Serves `rhythmixapp.com.au` via GitHub Pages |

### The Buddy System (a whole product line that isn't in CLAUDE.md)
| Asset | Count | Note |
|---|---|---|
| Buddy app pages | **~59 `buddy-*.html`** + 28 named personalities | AI companion ecosystem w/ ElevenLabs voices, Claude API, local storage |
| Supporting | builder, marketplace, command-center, verifier, receipts, ecosystem-engine.js, PWA manifest+SW | A self-contained app platform with its own generator |
| Other standalone apps | NutriAI, StoryStudio, VoiceJournal, CodeMentor, + ~40 single-purpose HTML utilities | Trackers, calculators, tutors, health tools |

### Standalone PWAs / ventures
| Product | Dir | What |
|---|---|---|
| **HerdCheck** | `livestock/` | Livestock screening PWA (lameness/mastitis/calving) for smallholders |
| **Reset** | `recovery/` + `recovery-ios/` | Sport-recovery app + Capacitor iOS wrapper |
| **Studio iOS** | `capacitor/` | iOS wrapper for Studio |
| **Self-hosted wiki** | `infra/` | Wiki.js + Postgres + Caddy (Docker) |
| **Launch kits** | `launch-kit/` | Launch assets for codex / hum / rhythmix |

**Teaching point:** you have *more shipped surface than most funded teams*. The
Buddy System alone (~60 apps + builder + marketplace) is an unmonetized product
line sitting in `apps/`. The question for each is not "can we build it" — it's
**"does anyone pay for it,"** and almost none have been pointed at that test yet.

---

## Layer 3 — The Content Engine (your distribution)

| Asset | Count | Use |
|---|---|---|
| **HyperFrames video cuts** | **52** `rhythmix-*` folders | Promos in 16:9 / 9:16 / 1:1; S-series, V-series, venue sub-brands |
| **Rendered MP4s** | ~10 at root + 3 in `videos/` | teasers, announcement, manifesto, IG/FB cuts |
| **Pipeline sites** | 4 — `agent-builder`, `buddy-system`, `codex-of-reality`, `sonny-quokka` | Site-build output (sitemap→wireframe→styleguide→pages) |
| **Thumbnails** | `thumbnails/` PNGs | Series artwork |

⚠️ **Honesty gate (from `README.md`):** some rendered MP4s
(`tiktok-reels-shorts`, `instagram-facebook`, `youtube`) carry **unverified
metrics/testimonials**. Only `teaser-coming-soon*.mp4` is safe to publish as-is.
Re-cut before use. This is the one inventory item that's a *liability* until fixed.

---

## Layer 4 — Plans & Knowledge (what's written down)

| Asset | Count | What |
|---|---|---|
| **Specs** | 5 — `agent-builder`, `codex-app`, `heartbeat`, `rhythmix-app`, `roomtone` | `requirements`/`design`/`tasks` per feature |
| **ADRs** | `docs/adr/` (ADR-0001: HyperFrames over Remotion) | Durable decisions |
| **Domain/agent docs** | `CONTEXT.md`, `docs/agents/`, `docs/security/` | Language, operating procedures |
| **Setup guides** | KOKORO, VOICEBOX, HERMES, AGENT-TARS, OPENMANUS, CREATIVE-AI-STACK, etc. | Tooling onboarding |
| **This operator pack** | overview + strategy + business guide + this file | The map of the whole thing |

---

## The Whole Board, At a Glance

```
LAYER 0  HARNESS      849 skills · 196 agents · ECC control plane · 7 local MCPs
LAYER 1  MCP FLEET    ~37 live integrations → Create / Build / Run / Reference
LAYER 2  PRODUCTS     Studio (+3 Workers) · 36-page site · Buddy System (~60 apps)
                      · HerdCheck · Reset · wiki · launch kits
LAYER 3  CONTENT      52 video cuts · ~13 MP4s · 4 pipeline sites · thumbnails
LAYER 4  KNOWLEDGE    5 specs · ADRs · domain docs · this operator pack
                      ───────────────────────────────────────────────
                      ~1.2 GB · one operator · near-zero marginal COGS
```

---

## What This Inventory Tells Us To Do

1. **Capability is solved. Distribution and finish are not.** Stop adding
   surface; start finishing one.
2. **Pick the lead (Studio) and one content lane.** Everything in Layers 2–3 is
   optionality — keep it cheap, don't feed it weekly engineering.
3. **The Buddy System is the biggest untested asset.** Either point ≤1 of those
   ~60 apps at a real paying user, or formally shelve the line. Don't let it
   quietly consume disk and attention.
4. **Fix the liability:** re-cut the unverified MP4s before any push.
5. **Run the fleet by profile, never all-on** — that single discipline protects
   the context window that everything else depends on.

The arsenal is real and rare. The win condition is concentration: aim a small,
well-chosen slice of all this at one outcome until it converts — then let
continuous-learning fold what worked back into the library, and do it again.
```
