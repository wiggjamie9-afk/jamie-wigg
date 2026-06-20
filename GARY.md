# GARY — Master Control File

> **This is the one file you open at the start of every session.**
> Say: *"Gary, read GARY.md, then build me ___."*
> Everything you own and every command that builds something new is itemized below.

**Owner:** Jamie Wigg · **Repo:** `wiggjamie9-afk/jamie-wigg` · **Live site:** rhythmixapp.com.au
**Last full audit:** 2026-06-20

---

## 0. How to use Gary (the 10-second version)

| You want… | You say… | Gary runs… |
|---|---|---|
| A new app | "Gary, build me a [X] app" | `agent-builder` flow / buddy template → `apps/` |
| A landing page / site | "Gary, build a site for [X]" | `/site-build` (4-stage pipeline) → `sites/<slug>/` |
| A promo video | "Gary, make a 60s promo for [X]" | `/rhythmix-new` → HyperFrames folder |
| A full launch (cover+track+video+page) | "Gary, launch [X]" | `/album-launch` |
| Any single asset (image/video/music/voice) | "Gary, dream me a [X]" | `/dream <desc>` |
| A YouTube kids episode | "Gary, make a Sunny episode about [X]" | `kids-channel/pipeline.py` |
| A spec before building | "Gary, spec out [X]" | `/spec-quick` → `/spec-analyze` → `/spec-run` |
| Affiliate/marketing content | "Gary, write content for [X]" | `affiliate-skills` (52-skill flywheel) |
| AI industry intel | "Gary, what's trending?" | `/follow-builders` |

**Golden rule:** Gary should *invoke the existing skill*, not re-derive the work. The pipelines below already exist.

**Quality rule:** Every build clears `GARY-BUILD-PROTOCOL.md` — 2026, polished-MVP, brand-locked, verified with a real browser screenshot before it's called done.

---

## 1. THE ENGINE — what Claude (Gary) can do

### 1a. Slash commands (in `.claude/commands/` — 13 live)
| Command | Builds |
|---|---|
| `/dream <desc>` | One asset (image, video, music, voice, or mini-site) auto-routed |
| `/album-launch <brief>` | 4 parallel agents: cover art + track + 60s video + landing section |
| `/rhythmix-new [dur] [aspect] [angle]` | End-to-end promo: script → TTS → HyperFrames → render → downloads page |
| `/site-build <brief>` | Full site: sitemap → wireframe → styleguide → design (parallel fan-out) |
| `/site-sitemap` `/site-wireframe` `/site-styleguide` `/site-design` | Individual site stages |
| `/spec-quick <desc>` | `specs/<slug>/{requirements,design,tasks}.md` in one pass |
| `/spec-analyze <slug>` | Surfaces ambiguities/contradictions in a spec |
| `/spec-run <slug>` | Executes spec tasks in parallel waves (isolated agents) |
| `/rhythmix-site` `/rhythmix-spec` | RHYTHMIX-branded site/spec wrappers |

### 1b. Skills (capabilities Gary loads on demand)
- **Installed in `~/.claude/skills/`:** `affiliate-skills` (52 sub-skills), `follow-builders`, `affiliate-check`, `session-start-hook`
- **Available via harness (hundreds):** creative pipeline (`hyperframes`, `replicate`, `gsap`, `rhythmix-author`), site-build, spec/planning, engineering (`/tdd`, `/diagnose`, `/improve-codebase-architecture`), product/SaaS (`saas-scaffolder`, `landing`, `seo-audit`), plus 800+ security/forensics skills in `.agents/skills/`
- **Document/media builders:** `docx`, `pptx`, `xlsx`, `pdf`, `canvas-design`, `algorithmic-art`, `slack-gif-creator`, `web-artifacts-builder`

### 1c. Sub-agents (196 in `.claude/agents/` — spawn for parallel work)
Marketing (ad-copywriter, seo-writer, social-media, x-twitter-growth), creative (music-producer, thumbnail-designer, storyboard-writer, short-form-video, video-ad-creator), dev (code-reviewer, test-writer, bug-hunter, api-tester), product (product-strategist, usage-analytics), plus the full OpenClaw roster. **Routing:** Haiku for mechanical tasks, Sonnet/default for judgment/creative. Never Haiku for image/vision work.

### 1d. MCP servers (7 configured in `.mcp.json`)
| Server | Gives Gary |
|---|---|
| `creative-stack` | Replicate + ElevenLabs: image, video, music, TTS |
| `higgsfield` | Soul (text→image), DOP (image→video), talking-head avatars |
| `stepfun` | Step 3.7 Flash: script/story/episode-brief generation |
| `pollinations` | Free tier: FLUX, Nova Reel, Suno, TTS (egress-gated in sandbox) |
| `playwright` / `claude-playwright` | Browser automation, screenshots, testing |
| `context7` | Live library/API docs (always prefer over training knowledge) |

> Plus a large roster of **App-UI MCP tools** available this session: Canva, Figma, Gamma, Lovable, Webflow, Picsart, ElevenLabs/HeyGen video, Notion, Airtable, Slack, Cloudflare, Lucid. Gary can build *outside* the repo too (decks, designs, full-stack apps) when you ask.

---

## 2. THE INVENTORY — what you already own

### 2a. Apps — 114 HTML files in `apps/` 🟢 built
- **🟢 App Hub — `apps.html`** (live at `rhythmixapp.com.au/apps.html`) — the single front door linking all 114 apps across 10 categories, with search + category filter. Regenerable: `python3 scripts/build-apps-hub.py` (template: `scripts/apps-hub.template.html`). Rebuild it whenever `apps/` changes.
- **59 `buddy-*.html`** — AI companion apps (the "Buddy" portfolio). System docs: `apps/BUDDY_SYSTEM_GUIDE.md`, `BUDDY_BUILDER_COMPLETE_SYSTEM.md`
- **28-app launch portfolio** — heartbeat, mood-journal, meditation-guide, dreams, medicine-companion, blood-pressure-buddy, calorie-counter, weight-tracker, vendor/expense/savings/loan/goal/budget trackers, english-pocket, math-helper, study-planner, trivia-quiz, notes, tasklist, reminders, daily-planner + more. Index: `INDEX_MASTER.md`, `20_TRENDING_APPS_COMPLETE.md`, `APPS_PORTFOLIO_SUMMARY.md`
- **`apps/untapped/`** — 10 named concepts (TYMPAN/HERD/AXLE/DOCKET/LULL/PLUMB/RACK/SOLE/SPOT/STACK), each with prototype + landing + brief
- **Featured buddies:** CodeMentor, NutriAI, StoryStudio, VoiceJournal, bookreader-pro

### 2b. STARLIGHTMIX Studio — `studio/` 🟢 production
Next.js 15 static-export web app → Cloudflare Pages (`studio.starlightmix.com`). Lifetime-buyer AI music-video generator. Has its own Workers (license, replicate-proxy).

### 2c. YouTube automation — `kids-channel/` 🟢 pipeline ready
**"Sonny's Cozy Quokka Bedtime Tales"** — fully automated kids channel, 3 episodes/day. Each run → `final.mp4` + `thumbnail.jpg` + `ebook.pdf` + narration + music + 6 scene illustrations + `script.json`. Files: `pipeline.py`, `youtube_auth.py`, `SUNNY.md`, `episodes/`, `ebooks/`.

### 2d. Agent-Builder SaaS — `agent-builder/` 🟢 scaffolded
Next.js platform for building/deploying/managing AI agents. 3 pricing tiers, marketing suite. `BRIEF.md`, `migrations/`, `__tests__/`, lighthouse report.

### 2e. Standalone PWAs
- `livestock/` — **HerdCheck**: offline livestock screening (lameness/mastitis/calving) for smallholders
- `recovery/` + `recovery-ios/` — **Reset**: team-sport recovery tracker (Capacitor iOS via Codemagic)
- `apps/roomtone/` — Roomtone PWA

### 2f. Video — 52 `rhythmix-*/` folders 🟢 HyperFrames
Promo/Cut library. Canonical reference: `rhythmix-overview-60s/`. Brand: `rhythmix-teaser-60s/DESIGN.md`. Series: S1–S5 scenes, V1–V5 alt cuts, venue sub-brands, portrait `-f` variants.

### 2g. Monetization stack — `monetization/` 🟢 documented
Stripe, Gumroad, Play-Store IAP, freemium model, payout compliance, analytics setup. Plus `email-sequences/` (11 apps), `analytics/` dashboard, `avatars/` (AI tutor avatars), `launch-kit/`.

### 2h. Distribution rails
- **GitHub Pages** → `rhythmixapp.com.au` (all root `.html`, auto-deploy on push to `main`)
- **Cloudflare Pages** → Studio (preview per branch, manual prod approval)
- **Capacitor** wrappers: `capacitor-buddies/`, `capacitor-herdcheck/`, `capacitor/`, `recovery-ios/`
- **Codemagic** iOS builds (`codemagic.yaml`)

### 2i. AI-Influencer arsenal (this thread) 🟡 installed, needs keys
`follow-builders` + `affiliate-skills` (skills) · `reelify-ai/` (short-video app, needs `.env.local`) · AI-Influencer-Generator (`/tmp`, Colab). Plans: `AI-INFLUENCER-ARSENAL.md`, `AI-INFLUENCER-ECOSYSTEM-PLAN.md`, `AI-INFLUENCER-PERSONAS.csv`.

---

## 3. GITHUB — what you're connected to
- **Repo:** `wiggjamie9-afk/jamie-wigg` (this session's scope)
- **100+ branches** — mostly `claude/*` session branches. This is your project history; most are one-off experiments. **Recommendation:** periodically prune merged/dead branches so the repo stays navigable.
- **Active branch now:** `claude/model-cleanup-scripts-wcvdcb`
- **Other repos:** if you want Gary to work on a different repo, say so — Gary checks `list_repos` and can `add_repo` to bring it into scope.

---

## 4. WHAT TO BUILD NEXT — Gary's recommendations

You have **breadth** (100+ apps/assets). What's missing is **depth + distribution**: turning built assets into shipped, monetized, discoverable products. Priorities:

### 🥇 Priority 1 — Ship what's already built (highest ROI, lowest effort)
1. ✅ **App Hub page — SHIPPED.** `apps.html` links all 114 apps (10 categories, search + filter, brand-locked, verified). Deploys to `rhythmixapp.com.au/apps.html` on push to `main`. Rebuild: `python3 scripts/build-apps-hub.py`. → *Next: link it from `index.html` nav and wire monetization (Priority 1.2).*
2. **Wire monetization into the top 5 apps** — the Stripe/Gumroad/IAP docs exist; actually connect them to heartbeat, NutriAI, CodeMentor, StoryStudio, VoiceJournal.
3. **Submit 3–5 apps to Play Store** — APK build files already manifested (`APK_BUILD_INDEX.md`). Pick the 5 with highest "profit potential" and ship.

### 🥈 Priority 2 — Turn on the content engines
4. **Launch the kids-channel** — pipeline is ready; connect `youtube_auth.py` and let it run 3 eps/day.
5. **AI-influencer go-live** — add API keys to `reelify-ai/.env.local`, define 3 personas, generate first 5 videos. (Plan already in `AI-INFLUENCER-ECOSYSTEM-PLAN.md`.)
6. **SEO landing pages** — one per flagship app via `/site-build`, deployed to GitHub Pages for organic discovery.

### 🥉 Priority 3 — New high-leverage products
7. **Agent-Builder SaaS launch** — it's scaffolded; spec the MVP (`/spec-quick`), build the auth+billing, deploy.
8. **A digital product** — bundle the 28 apps as a "Lifetime App Pack" on Gumroad, or the kids ebooks as a series.
9. **Cross-promo network** — each app/video links to the others (you already have the avatars + email sequences to power this).

### Things genuinely missing (gaps to close)
- **A single source of truth** ← this file fixes that. Consider deleting/archiving the ~30 redundant `*COMPLETE*`/`*SUMMARY*` docs into `docs/archive/`.
- **Live analytics** — `analytics/dashboard.html` exists but isn't wired to real app events.
- **App store presence** — built APKs but (likely) not yet submitted.
- **Automated posting** — content gets made but distribution to TikTok/YT/IG is still manual.
- **Email service connection** — sequences are authored (JSON) but not connected to a sender (Mailchimp/Resend/Substack).

---

## 5. The repeatable loop (your "endlessly" engine)

```
  IDEA ─▶ /spec-quick ─▶ /spec-run ─▶ app/site/video built
    ▲                                        │
    │                                        ▼
  follow-builders                    monetization wired (Stripe/Gumroad/IAP)
  (what's trending)                          │
    ▲                                        ▼
    │                                 distribution (Pages/Play/Cloudflare)
    │                                        │
    └──────── analytics ◀── content engines (kids-channel, reelify, affiliate-skills)
```

Every loop: spot a trend → spec it → build with an existing pipeline → wire money → ship → measure → feed back.

---

## 6. Session starter prompts (copy-paste)

- *"Gary, read GARY.md. Build me an App Hub page that links all 114 apps with categories and screenshots."*
- *"Gary, read GARY.md. Wire Stripe + freemium into heartbeat, NutriAI, and CodeMentor using the monetization/ docs."*
- *"Gary, read GARY.md. Spec and build a new [niche] app, then a landing page and a 30s promo."*
- *"Gary, read GARY.md. Launch the kids-channel — verify the pipeline and generate today's 3 episodes."*
- *"Gary, read GARY.md. Make a 60s RHYTHMIX promo for [app] and a TikTok cut."*
- *"Gary, read GARY.md. What should I build today?"* → Gary re-checks §4 and proposes the highest-ROI next move.

---

*Maintained by Gary. When the inventory changes materially, update §2 and §4.*
