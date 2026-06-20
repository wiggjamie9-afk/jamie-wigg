# AI Influencer Arsenal

**Goal:** Build and manage a network of autonomous AI influencers that monitor trends, create content, and distribute across social platforms.

## Architecture

```
┌─────────────────┐
│ INTELLIGENCE    │ (follow-builders)
│ - Trending      │ Scan what top AI builders are saying
│ - Market intel  │ Track YouTube/TikTok/X engagement data
│ - Research      │ Collect sources and angles
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ CONTENT         │ (affiliate-skills)
│ - Angles        │ S1: Research & Discovery
│ - Scripts       │ S2: Content Creation (posts, videos, scripts)
│ - Posts         │ S3: Blog & SEO
│ - Landing pages │ S4: Offers & Landing Pages
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ PERSONAS        │ (AI-Influencer-Generator)
│ - Images        │ Stable Diffusion + consistent character
│ - Voice         │ gTTS + natural voiceovers
│ - Animation     │ SadTalker lip-sync
│ - Videos        │ Talking head influencer videos
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ DISTRIBUTION    │ (affiliate-skills S5)
│ - Social media  │ TikTok, YouTube, Instagram, LinkedIn
│ - Email         │ Drip sequences
│ - Landing pages │ Bio links, squeeze pages
│ - Automation    │ Schedule and repurpose
└─────────────────┘
```

## Setup Status

| Component | Status | Purpose |
|-----------|--------|---------|
| follow-builders | ✅ Installed | Industry trends + engagement data |
| affiliate-skills | ✅ Installed | Content creation + distribution |
| AI-Influencer-Generator | 📦 Cloned | Persona generation (Jupyter notebook) |
| Reelify AI | ✅ Installed | Short-form video generation (Next.js) |
| Agent orchestration | 🔧 Pending | Tie everything together |

## Installed Skills

### follow-builders
- Daily/weekly AI industry digest
- Tracks 26 top builders on X/Twitter
- Monitors 6 AI podcasts
- Fetch from official Anthropic/Claude blogs
- Available: `/follow-builders`

### affiliate-skills
**8 Stages, 52 Skills:**
- **S1:** Research & Discovery (affiliate programs, trending content, traffic analysis, angle ranking)
- **S2:** Content Creation (posts, threads, videos, infographics)
- **S3:** Blog & SEO (reviews, comparisons, tutorials, keyword clusters)
- **S4:** Offers & Landing Pages (landing pages, squeeze pages, value ladders)
- **S5:** Distribution (bio links, email sequences, social scheduling)
- **S6:** Analytics (conversion tracking, A/B testing, reports)
- **S7:** Automation (email flows, content repurposing, multi-program management)
- **S8:** Meta (skill finder, funnel planner, compliance, self-improvement)
- Available: `/affiliate-skills` or individual skill invocation

### AI-Influencer-Generator
**Tech Stack:**
- Stable Diffusion — AI image generation (consistent character)
- gTTS — Text-to-speech (voiceovers)
- SadTalker — Lip-sync animation
- Jupyter notebook — Full pipeline (designed for Google Colab)

**Location:** `/tmp/ai-influencer/AI_Influencer.ipynb`

**Setup Path:** Google Colab (recommended) or local GPU environment.

### Reelify AI
**Tech Stack:**
- Next.js 14 — Full-stack app framework
- OpenAI GPT-4 — Script generation
- Pexels API — Free stock video footage
- ElevenLabs API — Text-to-speech synthesis
- FFmpeg (WASM) — Video composition in browser

**Features:**
- Onboarding flow: topic → script → visuals → voice → export
- 9:16 vertical format (TikTok/Reels native)
- Multilingual: Arabic, English, French
- Direct MP4 export
- No server-side rendering needed

**Location:** `./reelify-ai/`

**Setup Path:** 
```bash
cd reelify-ai
cp .env.example .env.local
# Add: PEXELS_API_KEY, ELEVENLABS_API_KEY, OPENAI_API_KEY
npm run dev
# Navigate to http://localhost:3000
```

**Environment Variables:**
- `PEXELS_API_KEY` — Free at pexels.com/api
- `ELEVENLABS_API_KEY` — Free tier at elevenlabs.io
- `OPENAI_API_KEY` — openai.com/api

## Integrated Workflow: Zero to First Influencer Video

**New simplified flow (with Reelify AI):**

```
1. follow-builders  → Detect trend (e.g., "HeyGen Series A")
                   ↓
2. Reelify AI      → Generate video (1-2 hours) OR
                   → Generate scripts + content pieces
                   ↓
3. AI-Influencer   → Persona avatar talking head
                   ↓
4. affiliate-skills → S5: Deploy across TikTok/YouTube/email
                   ↓
5. affiliate-skills → S6: Track installs, conversions, ROI
```

**Time estimate:** 3-4 hours from trend detection to published video.

---

## Workflow: Zero to First Influencer

### Phase 1: Intelligence (1-2 hours)
```bash
# Get industry trends
/follow-builders
→ "What's trending in AI video tools this week?"

# Research specific angle
/affiliate-skills → S1: trending-content-scout
→ "Scan YouTube/TikTok for AI video comparisons"

# Find affiliate programs
/affiliate-skills → S1: affiliate-program-search
→ "Best programs to promote in AI video space"
```

### Phase 2: Content (2-4 hours)
```bash
# Gather research
/affiliate-skills → S2: content-research-brief
→ "Collect sources on HeyGen, Synthesia, D-ID"

# Generate content pieces
/affiliate-skills → S2: viral-post-writer
→ "Write LinkedIn post comparing AI video tools"

/affiliate-skills → S2: tiktok-script-writer
→ "Generate 45-second TikTok script with hook"

/affiliate-skills → S2: infographic-generator
→ "Side-by-side comparison card (AI video tools)"
```

### Phase 3: Content Video Generation (1-2 hours)
```bash
# Generate trend-based short video content
Reelify AI → http://localhost:3000
→ Topic: "HeyGen vs Synthesia: Which AI video tool wins?"
→ Script auto-generated by GPT-4
→ Fetch Pexels footage (relevant to topic)
→ Generate voiceover with ElevenLabs (match persona tone)
→ FFmpeg composes: video + voice + text overlays
→ Export MP4 (9:16 vertical, TikTok-ready)
```

### Phase 4: Persona Avatar Videos (4-8 hours)
```bash
# Design persona
AI-Influencer-Generator → Design phase
→ "Tech reviewer, confident, friendly, millennial"

# Generate consistent character
Stable Diffusion (via notebook)
→ Multiple variations of same persona
→ Pick best for consistency

# Create persona-specific talking head videos
AI-Influencer-Generator + phase 3 content video
→ Use character image + voiceover from Reelify
→ Generate lip-sync talking head with SadTalker
→ Result: persona presenting the trend-based content
```

### Phase 5: Distribution (1-2 hours)
```bash
# Deploy content across channels
/affiliate-skills → S5: social-media-scheduler
→ Schedule TikTok, YouTube, LinkedIn

/affiliate-skills → S5: bio-link-deployer
→ Landing page with affiliate links

/affiliate-skills → S5: email-drip-sequence
→ Nurture sequence (interested viewers → customers)

# Track performance
/affiliate-skills → S6: conversion-tracker
→ UTM links, attribution, ROI per channel
```

## Arsenal: Multi-Influencer Setup

Create a CSV for managing multiple personas:

```csv
persona_id,name,niche,character_prompt,tone,platforms,affiliate_programs
1,TechReviewTina,AI Video Tools,"Confident tech reviewer, millenni…","Casual expert","TikTok,YouTube,LinkedIn","HeyGen,Synthesia,D-ID"
2,CodeCreatorCarlos,Web Dev Tools,"Enthusiastic educator, patient…","Encouraging","YouTube,LinkedIn,Twitter","Vercel,Supabase,GitHub"
3,DesignDavid,AI Design Tools,"Creative director, visual…","Inspirational","Instagram,TikTok,Twitter","Figma,Runway,Midjourney"
```

For each persona:
1. Run S1 research → niche-specific trends
2. Run S2 content → platform-native variations
3. Run AI-Influencer-Generator → character video
4. Run S5 distribution → schedule across platforms
5. Run S6 analytics → measure ROI per persona per program

## Next Steps

### Immediate (Today)
- [ ] Create persona inventory CSV (define your first 3-5 personas)
- [ ] Set up follow-builders digest (configure preferences: daily/weekly, language, delivery)
- [ ] Run S1 research for your first niche

### Short-term (This Week)
- [ ] Generate content for first persona (S2 + infographics)
- [ ] Build Google Colab notebook environment for AI-Influencer-Generator
- [ ] Create first persona character set (Stable Diffusion)

### Medium-term (This Month)
- [ ] Produce 5 talking head videos per persona
- [ ] Deploy to 2-3 platforms per persona
- [ ] Set up affiliate tracking and analytics

### Long-term (3+ Months)
- [ ] Scale to 5-10 concurrent personas
- [ ] Build automated content pipelines per niche
- [ ] Optimize based on analytics (double down on what converts)
- [ ] Explore monetization: affiliate commissions, sponsorships, own products

## Key Decisions

**Persona Count:** Start with 1 (prove concept), then scale to 3-5 (diversify niches), then 10+ (enterprise scale).

**Platform Focus:** Start narrow (1-2 platforms per persona) to build momentum, then expand. TikTok + YouTube are highest ROI for video.

**Content Velocity:** Start with 2-3 pieces/week per persona. Use S7 automation to scale without burnout.

**Affiliate Strategy:** Focus on 1-2 programs per persona (deep authority) rather than promoting everything.

**Revenue Model:**
- Affiliate commissions (primary, day 1)
- Sponsorships from tools you review (month 2-3)
- Own digital products (month 4+)
- Licensing persona to brands (month 6+)

## Files & References

- **Arsenal setup:** This file (AI-INFLUENCER-ARSENAL.md)
- **Persona inventory:** AI-INFLUENCER-PERSONAS.csv (your persona definitions)
- **follow-builders skill:** `~/.claude/skills/follow-builders/` (with `/follow-builders` command)
- **affiliate-skills:** `~/.claude/skills/affiliate-skills/` (52 skills, 8 stages)
- **Reelify AI:** `./reelify-ai/` (Next.js short-form video app, `npm run dev` at port 3000)
- **AI-Influencer-Generator:** `/tmp/ai-influencer/AI_Influencer.ipynb` (Jupyter notebook, Google Colab recommended)

## Commands Quick Reference

```bash
# 1. Start trend intelligence
/follow-builders
→ Get weekly digest of what's trending

# 2. Find affiliate programs
affiliate-check search "AI video tools"
→ Commission rates, cookie days, traffic quality

# 3. Generate trend-based short video
cd reelify-ai && npm run dev
→ http://localhost:3000
→ Topic → Script → Visuals → Voice → MP4

# 4. Generate content for affiliate channel
/affiliate-skills → "Write viral post about AI video tools"
→ S2: viral-post-writer, tiktok-script-writer, infographic-generator

# 5. Create persona avatar video
AI-Influencer-Generator (Google Colab)
→ Use Reelify video content + persona character
→ Generate talking head with SadTalker

# 6. Plan full funnel
/affiliate-skills → "Plan my 5-week content funnel for AI video niche"
→ S8: funnel-planner maps research → content → pages → distribution
```

## Monitoring & Iteration

Every 2 weeks:
1. Check `/follow-builders` digest for trend shifts
2. Run `/affiliate-skills` → S6 performance-report
3. Analyze which personas + content combos are winning
4. Double down on winners, retire underperformers
5. Adjust persona mix and niche focus

---

**Status:** Arsenal framework ready. Next step: Define your first 3 personas and run Phase 1 research.
