# Bedtime Book & Channel — Complete Success Kit

The full list of **skills to add** and **products to get from GitHub** to take the
channel from "automated pipeline" to "successful book + channel business."

> **Database note:** I checked the data sources connected to your Claude (Notion,
> Airtable, Google Drive). They don't contain the bedtime project — Notion is a
> near-default workspace (Welcome page, To-Do DB, a Naval blueprint, a frequency-app
> note), Airtable has no bases, Drive has nothing on Sunny/quokka. The project's
> source of truth is this **git repo** (`kids-channel/`). So this kit is built from
> the repo + the products already connected to your Claude.

Legend: ✅ already have · ⬇️ get from GitHub · 🔌 already connected (MCP) · 🛠️ I author it · 💳 fund/credential

---

## The lifecycle (what "success" needs)

PRODUCE → POLISH → PUBLISH → PROMOTE → PROFIT. You're strong on PRODUCE.
The gaps that actually move the needle are in POLISH, PROMOTE, and PROFIT.

---

## A. Claude SKILLS you still need

### Craft (the quality unlock — I author these locally, no install)
| Status | Skill | What it fixes |
|---|---|---|
| 🛠️ | `bedtime-script` | Kills the slug-echo bug; locks calm cadence, age 1–5 vocab, refrain, no scary beats |
| 🛠️ | `storytelling-craft` | Same soothing arc + "sweet dreams" close every episode |
| 🛠️ | `watercolour-artdirection` | One reusable prompt block (paper texture, pigment bleed, palette, light) → consistent beautiful art |
| 🛠️ | `caption-generator` | Auto `.srt` subtitles (read-along + SEO + accessibility) — wraps Whisper |
| 🛠️ | `sleep-compilation` | Concatenate/loop episodes into 10–60 min sleep videos (the monetization workhorse) |
| 🛠️ | `channel-analytics-digest` | Weekly performance summary (pulls YouTube stats via Zapier) |

### Already in your library (use, don't re-acquire)
✅ `rhythmix-author`, `dream`, `album-launch`, `replicate`, `hyperframes*`,
`canvas-design`, `algorithmic-art`, `brand-guidelines`, `theme-factory`,
`pdf`/`docx`/`pptx`, `seo-audit`, `landing-page-generator`, plus agents
`storyboard-writer`, `book-writer`, `video-scripter`, `thumbnail-designer`,
`youtube-seo`, `music-producer`, `short-form-video`.

---

## B. PRODUCTS to get from GitHub

Only six are genuinely worth it. Everything else is already covered.

| Priority | Product | GitHub | Why you need it |
|---|---|---|---|
| 1 ⬇️ | **Whisper / WhisperX** | `openai/whisper` · `m-bain/whisperX` | Auto-captions/subtitles — biggest missing piece for SEO, accessibility, and read-along. Runs free locally. |
| 2 ⬇️ | **ElevenLabs MCP** | `elevenlabs/elevenlabs-mcp` | First-party narration + dubbing control (you currently hit the REST API raw). Enables multi-language later. |
| 3 ⬇️ | **Piper TTS** | `rhasspy/piper` | Free offline narration fallback (pipeline already references it — install the voice models). |
| 4 ⬇️ | **OpenMontage** (music helper) | the repo the workflow expects in `OpenMontage/` | Richer royalty-free lullaby music vs. the ffmpeg tone fallback. Currently silently skipped. |
| 5 ⬇️ | **obra/superpowers** (full) | `obra/superpowers` | Deeper writing/ideation skills beyond the few already synced. |
| 6 ⬇️ | **anthropics/skills** (pull latest) | `anthropics/skills` | You have many synced; re-pull for newest `canvas-design`, doc, and art skills. |

Optional, only if you go there:
- ⬇️ **Figma MCP** (`github.com/figma`) — designer-grade thumbnail/banner templates.
- ⬇️ **fal-ai client** (`fal-ai/fal-js`) — cheap fast FLUX images (~$0.003) if Higgsfield/Replicate get pricey.

---

## C. PRODUCTS you DON'T need from GitHub (already connected to your Claude 🔌)

Don't go shopping for these — they're already wired as MCP servers this session:

| Need | Already connected |
|---|---|
| Sell the picture books / memberships | 🔌 **Stripe** |
| Publish a landing/sales page | 🔌 **Webflow**, 🔌 **Lovable** (app builder), 🔌 **Gamma** (decks/pages) |
| Channel art, thumbnails, brand templates | 🔌 **Canva**, 🔌 **Figma**, 🔌 **PicsArt** |
| Email list + parent outreach | 🔌 **Gmail** |
| Schedule uploads / content calendar | 🔌 **Google Calendar**, 🔌 **Zapier** (→ YouTube, 9,000 apps) |
| Project/ops tracking | 🔌 **Notion**, 🔌 **Airtable** (empty — ready to fill) |
| Image/video/voice/music generation | 🔌 **Higgsfield**, 🔌 **HyperFrames**, 🔌 **Hugging Face** |
| Team comms | 🔌 **Slack** |

YouTube upload itself is **already in your pipeline** (YouTube Data API +
`youtube_auth.py`) — you don't need a YouTube product from GitHub, just refreshed
tokens. Zapier covers analytics + scheduling on top.

---

## D. The non-software must-dos (these matter more than any plugin)

| 💳 | Item | Note |
|---|---|---|
| 💳 | Refresh **YouTube OAuth tokens** | Blocker — pipeline can't upload until done (`youtube_auth.py`) |
| 💳 | Fund **ANTHROPIC_API_KEY** | Or scripts silently fall back to the weak template |
| 💳 | Fund **ELEVENLABS_API_KEY** | Premium narration vs. robotic fallback |
| 💳 | Commit `character/sonny-ref.jpg` | Locks Sonny's face across every scene/episode |
| ⚠️ | Set **"Made for Kids" / COPPA** | Legally required on a kids channel — per video |

---

## Bottom line

- **Skills to add:** 6 custom ones I can author right now (no installs). That's the
  real quality + scale unlock.
- **Products from GitHub:** realistically just **Whisper, ElevenLabs MCP, Piper,
  OpenMontage** (+ superpowers / latest anthropics-skills). Captions (Whisper) is
  the single highest-value addition.
- **Everything else** — selling, landing pages, email, scheduling, design, analytics
  — is **already connected** to your Claude. You're not missing a toolbox; you're
  missing captions, funded keys, refreshed YouTube auth, and the six craft skills.

Say the word and I'll author the six skills into `.claude/skills/` and wire the
caption + compilation steps into `pipeline.py`.
