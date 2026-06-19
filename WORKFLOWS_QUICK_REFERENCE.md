# Workflows Quick Reference — Choose Your Path

**How to use this**: Find your task type on the left, follow the steps on the right.

---

## 🎬 Video & Creative Tasks

### "Make a RHYTHMIX promo"
1. Decide: **60s landscape** (standard), **30s cut**, or **portrait variant**?
   - Yes → `/rhythmix-new [duration] [aspect]`
   - Or copy & edit: `rhythmix-overview-60s/` → customize → HyperFrames render
2. Need script + voiceover first?
   - Use Step 3.7 Flash MCP: `flash_script` (format: narration/dialogue/shot-list)

### "Generate one creative asset (image/video/music/voice)"
- Use `/dream <description>` — routes to the right modality (Replicate, ElevenLabs, HunyuanVideo, etc.)

### "Launch an album/single/campaign"
- Use `/album-launch <brief>` — fan-out 4 parallel agents:
  1. Cover art (image)
  2. Track (music)
  3. 60s promo video
  4. Landing page section

### "Build an animated promo site or pitch deck"
1. Create episode structure: Step 3.7 Flash `flash_episode_brief` (reasoning='high' for multi-act)
2. Pass output → `/rhythmix-site` or `/site-build` for animated landing

---

## 🌐 Web & App Development

### "Build a new consumer app"
1. Start with template: `100_APP_BUILD_TEMPLATE.md` (copy structure)
2. Create in `apps/<name>.html` or `apps/<name>/` (if PWA)
3. Add avatar tutor? → See `AVATAR-INTEGRATION-GUIDE.md`
4. Test locally: `python3 -m http.server 8000 --bind 127.0.0.1`

### "Create a landing page or microsite"
- Use `/site-build <brief>` (4-stage pipeline: sitemap → wireframe → styleguide → HTML)
- For RHYTHMIX-branded: `/rhythmix-site <brief>` (locks styleguide to brand)
- Run individual stages: `/site-sitemap`, `/site-wireframe`, `/site-styleguide`, `/site-design`

### "Update STARLIGHTMIX Studio"
1. Edit code in `studio/`
2. Run `pnpm dev` to test (http://localhost:3000)
3. Build: `pnpm build` → `studio/out/`
4. Deploy: Push to GitHub (auto-preview on non-main, manual approval for production)

### "Build a Next.js / React feature"
1. Architecture question? → `/improve-codebase-architecture` or `/grill-me`
2. Start coding → `/tdd` (red-green-refactor) or direct development
3. Need production UI? → `/frontend-design` (avoids generic AI aesthetics)
4. Verify it works: `/verify` (run the app and test manually)

---

## 📱 Mobile & Distribution

### "Prepare iOS build"
1. Read: `CAPACITOR-IOS-SETUP.md`
2. From `capacitor/` or `recovery-ios/`: `pnpm build:web && pnpm sync:web`
3. Open Xcode: `pnpm open:ios`
4. Configure signing, build, test on simulator/device

### "Create Android APK"
1. Read: `ANDROID-BUILD-SETUP.md` + `APK_BUILD_QUICKSTART.md`
2. Follow step-by-step signing and build process
3. Reference: `APK_BUILD_INDEX.md` (manifest of artifacts)

### "Prepare app store listing"
1. See: `APP_STORE_METADATA.md` (copy, images, compliance)
2. Collect screenshots, write description, set categories

---

## 📊 Planning & Specs

### "Plan a feature from scratch"
1. Rough idea: `/spec-quick <description>` → generates `specs/<slug>/{requirements,design,tasks}.md`
2. Find gaps/contradictions: `/spec-analyze <slug>` (rewrites requirements.md)
3. Execute tasks in parallel: `/spec-run <slug>` (isolated Agent contexts, sequenced by file overlap)

### "Plan a RHYTHMIX campaign (multi-video / launch series)"
- Use `/rhythmix-spec <brief>` — same flow as `/spec-quick` but with brand-specific clarifying questions

### "Convert chat into PRD / GitHub issues"
- Chat → PRD: `/to-prd`
- PRD → Issues: `/to-issues` or `/triage`

---

## 🎯 YouTube & Content Strategy

### "Plan YouTube content strategy"
1. Check schedule: `YOUTUBE_CONTENT_CALENDAR.md`
2. Review trends: `YOUTUBE_GOLDMINES_2025.md`
3. Understand monetization: `YOUTUBE_MONETIZATION_ROADMAP.md`

### "Create YouTube script + content"
1. Generate script: Step 3.7 Flash `flash_script` (format: narration/pitch-deck)
2. Create promo/thumbnail video: `/rhythmix-new` (for Shorts/Reels format)
3. Distribute: YouTube Shorts + TikTok + Reels (multi-platform syndication)

### "Audit YouTube Shorts / viral content"
- See: `YOUTUBE_SHORTS_APPS_AUDIT.md`

---

## 🚀 100 Apps Initiative

### "Launch a new app from the portfolio"
1. Review strategy: `100_APPS_MISSION.md`
2. Use template: `100_APP_BUILD_TEMPLATE.md`
3. Build & test: see "Build a new consumer app" above
4. Plan launch: `100_APP_MISSION_LAUNCH_STRATEGY.md`

### "Add avatar tutor to an app"
1. Read: `AVATAR-INTEGRATION-GUIDE.md`
2. Reference: `AVATAR-LAYOUT-GUIDE.txt` (ASCII specs)
3. See examples: StoryStudio, VoiceJournal, SmartGrocery (in `apps/`)
4. Showcase: `/avatars/index.html` (3-avatar demo)

### "Build Bedtime Stories content"
- Strategy: `BEDTIME_STORIES_MONETIZATION.md`
- Launch plan: `BEDTIME_STORIES_WEEK1_EXECUTION.md`

### "Implement Buddy System (freemium)"
1. Feature overview: `BUDDY-SYSTEM-INTEGRATION.md`
2. Implementation: `BUDDY-FREEMIUM-IMPLEMENTATION.md`
3. Test plan: `BUDDY-FREEMIUM-TEST-PLAN.md`

---

## 🛠️ Engineering & Debugging

### "Debug a complex issue"
1. Use `/diagnose` — disciplined bug/perf-regression loop

### "Refactor code or improve architecture"
1. Use `/improve-codebase-architecture` or `/zoom-out`

### "Review code or design"
1. Use `/code-review --comment` (posts findings as inline PR comments)
2. Or `/code-review --fix` (applies findings to working tree)
3. For simplification only: `/simplify`

### "Verify changes work before shipping"
1. Use `/verify` — run the app and test manually
2. Also before PR: `/finishing-a-development-branch` (lint, tests, changelog, PR)

### "Run tests / CI locally"
1. `studio/pnpm lint` (next lint + tsc)
2. `studio/pnpm test` (vitest run)
3. Check workflows: `.github/workflows/`

---

## 🔌 API & Library Lookups

### "Need library/API documentation"
- **Always use Context7** (not training knowledge)
  - `CONTEXT7_API_KEY` in `.env`
  - Covers npm, Python, Rust, Go, cloud SDKs
  - Up-to-date and reliable

### "Need specific version-dependent code"
- Context7 MCP → search, setup, code generation

---

## 📚 Research & Exploration

### "Search codebase for X"
1. Specific file: use `Glob` or `Grep` directly
2. Broad search: spawn `Explore` agent ("quick" / "medium" / "very thorough")
3. Multi-round research: spawn `general-purpose` agent

### "Need web research / autonomous browser tasks"
1. Use `openmanus` (LLM-driven browser agent) or `Playwright` MCP
2. Particularly useful for: RHYTHMIX content research, market intelligence, multi-step web workflows

---

## 🎨 Design & Figma

### "Create/edit design in Figma"
1. Use Figma MCP (create_new_file, use_figma, get_design_context, etc.)
2. Run `/figma-use` skill first (MANDATORY before use_figma)
3. For design-to-code: `/figma-generate-design`
4. For code-to-design: `use_figma` directly

---

## 🔄 Parallel & Multi-Agent Tasks

### "Run 2-5 independent tasks in parallel"
- Use `/dispatching-parallel-agents` skill
- Example: Audit 5 apps in parallel (each agent: UX + performance + compliance)
- Combine results after completion

### "Orchestrate complex multi-workstream project"
- Use `/subagent-driven-development` (coordinates multiple agents)

### "Execute a structured plan"
- First: Write plan (use `/Plan` agent if needed)
- Then: `/executing-plans` to drive it forward

---

## ✅ Before You Start Any Task

**Checklist** (takes 2 minutes):
1. Read relevant section in `CLAUDE.md` for context
2. Check `START-HERE.md` for recent projects
3. Look for existing parallels/templates
4. If spec needed: write one via `/spec-quick`
5. Identify dependencies (does this require something else first?)
6. Document decisions in `CONTEXT.md` or `docs/adr/` if new

---

## 🗺️ Navigation by Domain

| Domain | Skill/Tool | Reference Doc |
|--------|-----------|---|
| Video/Promos | `/rhythmix-new`, `/dream`, `/album-launch` | `CONTEXT.md`, `ADR-0001`, `rhythmix-overview-60s/` |
| Sites/Web | `/site-build`, `/rhythmix-site` | `sites/codex-of-reality/`, `STARLIGHTMIX-STUDIO.md` |
| Apps | `/spec-quick`, `100_APP_BUILD_TEMPLATE.md` | `100_APPS_MISSION.md`, `apps/` |
| Avatar Tutors | `AVATAR-INTEGRATION-GUIDE.md` | `AVATAR-ENHANCEMENT-SUMMARY.md` |
| YouTube | `YOUTUBE_CONTENT_CALENDAR.md` | `YOUTUBE_MONETIZATION_ROADMAP.md` |
| Mobile | `CAPACITOR-IOS-SETUP.md`, `ANDROID-BUILD-SETUP.md` | `APK_BUILD_QUICKSTART.md` |
| Specs | `/spec-quick`, `/spec-run` | `specs/rhythmix-app/` |
| Infra | `.github/workflows/`, `infra/wiki/` | `BUILD_READY.md` |

---

**Tip**: Bookmark CLAUDE.md, BUILD_READY.md, and this file. They're your map. 🗺️
