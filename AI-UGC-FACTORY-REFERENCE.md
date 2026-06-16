# AI UGC Factory Reference

**Source:** AI UGC Factory (1229119561weike/ai-ugc-factory — MIT License)

A reusable workflow for batch AI-generated UGC ad video production. Reference integration guide for RHYTHMIX ecosystem.

---

## What is AI UGC Factory?

**Purpose:** Systematic pipeline for turning product assets into production-ready AI-generated ad video briefs.

**Workflow:**
```
Product assets (images, webpage, specs)
     ↓
Asset manifest (inventory of all inputs)
     ↓
Video brief (structured scene-by-scene outline)
     ↓
Prompt packs (generation instructions for each scene)
     ↓
AI video generation (Kling, Hunyuan, Luma, etc.)
     ↓
QA gates (voice, pacing, visuals, product claims validation)
     ↓
Demo packaging (ready-to-ship video format)
     ↓
Performance loop (winning angles become batch templates)
```

**Why relevant to RHYTHMIX:**
- STARLIGHTMIX Studio already generates music videos from prompts
- AI UGC Factory adds *systematic structure* (asset manifest → brief → prompt pack → render)
- Solves: "How do we batch-generate 20 UGC ad variations in parallel?"

---

## RHYTHMIX Integration Points

### **Use Case 1: Auto-Generate Short-Form Ads from Track Metadata**

**Current State:**
- Studio generates full-length music videos (1-3 mins)
- No systematic way to create short-form UGC ads (15-30s) for social distribution

**With AI UGC Factory:**
```
Track uploaded to Studio
     ↓
Extract metadata (title, genre, bpm, mood, artist)
     ↓
Auto-generate UGC brief:
  Scene 1 (0-3s): Hook
    Audio: Track intro (3s)
    Visual: AI avatar reacting / motion graphics
    Text: "This track just dropped 🔥"
  
  Scene 2 (3-8s): Proof
    Audio: Track chorus (5s)
    Visual: Sample use-cases (DJ, creator, listener)
    Text: "1M+ streams, trending now"
  
  Scene 3 (8-15s): CTA
    Audio: Track outro
    Visual: Studio link + play button
    Text: "Make your own | Link in bio"
     ↓
Generate prompt pack (Kling-specific, Hunyuan-specific, etc.)
     ↓
Render in parallel (Tier 1 agent spawns 5 sub-agents for 5 video formats)
     ↓
QA gates: rhythm sync, claim validation, product link clickable
     ↓
Package for: Instagram Reels, TikTok, YouTube Shorts
```

**Implementation:**
- Create `.agents/skills/rhythmix-ugc-factory/` skill
- Wire into Studio: "Generate Social Assets" button
- Input: Track metadata from Replicate job
- Output: 5 short-form videos (15s, 30s, TikTok, Reels, Shorts formats)

**Cost:**
- AI UGC brief generation (Tier 1): $0.02 per track
- Prompt pack generation (Tier 1): $0.01 per brief
- Video rendering (existing Replicate pipeline): ~$0.50 per video
- Total per track: ~$2.50 for 5 video variants

**Timeline:** 2 weeks (adapt AI UGC Factory templates → Studio integration)

---

### **Use Case 2: Batch Campaign Launch (20 Apps → 20 UGC Kits)**

**Scenario:** You're launching 20 apps across the ecosystem (HerdCheck, Codex, sunny-bedtime-videos, etc.). Each needs 3 UGC video variants for social media.

**With AI UGC Factory Pattern:**

```
Input: App specs × 20
{
  app_name: "HerdCheck",
  category: "Agricultural",
  tagline: "Phone-camera screening for livestock",
  features: ["Lameness detection", "Mastitis screening", "Calving prediction"],
  target_audience: "Small-hold farmers",
  hero_image: "screenshot.png",
  demo_video: "demo.mp4"
}

↓

Create asset manifest (CSV):
  App | Screenshot | Demo | Testimonial | Feature Icons | Brand Kit
  HerdCheck | ✓ | ✓ | ✓ | ✓ | ✓
  Codex | ✓ | ✓ | ✓ | ✓ | ✓
  ...

↓

Generate UGC briefs × 20 (Tier 1 parallel agents)
  - Brief A: Product-first (emphasize features)
  - Brief B: Story-first (user journey)
  - Brief C: Pain-point first (problem → solution)

↓

Generate prompt packs × 60 (3 briefs × 20 apps)

↓

Render videos in parallel (Tier 1 spawns 20 sub-agents)
  - 60 videos total (3 per app)
  - Batch rendering to Replicate

↓

QA gates (Tier 1 verification):
  ✓ Logo visible in frame?
  ✓ App name mentioned?
  ✓ Feature claims accurate?
  ✓ Pacing matches audio?

↓

Output structure:
  launch-kit/
  ├── herdcheck/
  │   ├── brief-a-product-first.md
  │   ├── brief-b-story.md
  │   ├── brief-c-pain.md
  │   ├── herdcheck-a.mp4
  │   ├── herdcheck-b.mp4
  │   └── herdcheck-c.mp4
  ├── codex/
  │   ├── ...
  │   └── codex-c.mp4
  └── ...
```

**Cost:**
- Brief generation (20 apps × 3 briefs, Tier 1): $0.60
- Prompt packs (60 packs, Tier 1): $0.60
- Video rendering (60 videos × $0.50): $30
- QA validation (60 videos, Tier 1): $1.20
- **Total: ~$32 for 20 apps × 3 variants = 60 videos**

**Alternative:** Manual video production = $500-1000 per app (agency rates). AI UGC Factory: ~$1.50 per video.

**Timeline:** 1 week (20 brief→prompt→render cycle)

---

### **Use Case 3: Performance Loop (Winning Angles Become Templates)**

**The Pattern:**
```
Week 1: Generate 20 UGC briefs + render → 20 videos
Week 2: Analyze performance (CTR, watch time, saves)
Week 3: Identify "winning angles" (which brief A/B/C converted best?)
Week 4: Codify winners into reusable template prompt packs
Week 5: Generate new campaign using proven templates → higher conversion
```

**Example:**
```
Week 1 Results:
  HerdCheck Brief A (product-first): 2.3% CTR, 45s avg watch time
  HerdCheck Brief B (story-first): 3.1% CTR ← WINNER, 52s avg watch time
  HerdCheck Brief C (pain-first): 1.8% CTR, 38s watch time

Week 4 Action:
  Save Brief B template as "herdcheck-template-story-first.json"
  
Week 5 Launch (new version 2.0):
  Use Brief B template + updated screenshots/voice
  → Predicted CTR: ~3.0% (based on prior learning)
```

**Implementation:**
- Store winning briefs in `.agents/skills/rhythmix-ugc-factory/templates/`
- Track performance in AIRTABLE or GitHub Issues
- Tier 1 agent routes new campaigns through proven templates first
- Cost savings: No need to test A/B/C every time (skip to winner)

---

## File Structure for RHYTHMIX Integration

```
.agents/skills/rhythmix-ugc-factory/
├── SKILL.md                          (usage guide)
├── briefs/                           (reference UGC briefs)
│   ├── studio-track-15s.md          (music video short-form)
│   ├── studio-track-30s.md
│   ├── app-launch-product-first.md
│   ├── app-launch-story-first.md
│   └── app-launch-pain-first.md
├── asset-manifests/                  (template: what assets you need)
│   ├── music-track-manifest.csv
│   └── app-launch-manifest.csv
├── prompt-packs/                     (Kling/Hunyuan-specific)
│   ├── studio-track-kling.md
│   ├── studio-track-hunyuan.md
│   └── app-launch-luma.md
├── templates/                        (winning angle templates)
│   ├── herdcheck-story-first.json
│   ├── codex-pain-first.json
│   └── ...
└── generate-ugg-kit.js              (orchestrator)
    └── Reads brief → generates prompts → spawns render agents
```

---

## Quick Start: Two Ways to Use

### **Option A: Reference Only (Easiest)**

Just read `AI UGC Factory` docs as a pattern guide. Don't integrate code, adapt ideas into Studio manually.

**Effort:** 0 (read docs, steal ideas)

### **Option B: Full Integration (Complete)**

1. Clone awesome-llm-apps (reference)
2. Copy relevant briefs/prompts into `.agents/skills/rhythmix-ugc-factory/`
3. Create `generate-ugc-kit.js` orchestrator (reads brief → spawns render agents)
4. Wire into Studio + Marketing launch kit workflows

**Effort:** 1-2 weeks
**Payoff:** Batch-generate ad variations at scale

---

## Cost Comparison

| Approach | Cost per Video | Time per Brief | Total for 20 Apps (60 videos) |
|----------|---|---|---|
| Manual copywriting + design | $200-500 | 4 hours | $12,000-30,000 |
| AI UGC Factory (this guide) | ~$1.50 | 10 mins | ~$90 |
| Studio only (no UGC structure) | ~$0.50 | 20 mins | ~$30 (renders only) |

**Why AI UGC Factory is worth it:**
- Structured briefs reduce iteration (clear → execution)
- Reusable prompts save time (no re-inventing wheels)
- Performance loop drives conversion (data-informed template library)

---

## Recommendation

**Phase 0 (This Month):** Read AI UGC Factory docs as pattern reference. Understand the workflow (asset manifest → brief → prompt pack → QA → performance loop).

**Phase 1 (Next Month):** If needed for launch campaign, implement Option B (full integration). Otherwise, stay with Option A (reference) until you have 20+ apps to batch-launch simultaneously.

**Why not now?**
- You already have `ai_music_generator_agent` (template) to use for Studio themes
- `product_launch_intelligence_agent` covers social copy generation
- AI UGC Factory shines when you have *volume* (20+ launches) and want *systematic reuse*

**When to implement:**
- After shipping HerdCheck + Studio + Reset (5 apps)
- Before launching 2.0 versions of existing apps (reuse winning templates)
- When doing annual multi-app campaign (20+ app launch cycle)

---

## License

AI UGC Factory: **MIT** — use, fork, adapt freely. Just keep product claims truthful.

---

## References

- **GitHub:** https://github.com/1229119561Weike/ai-ugc-factory
- **Product:** https://aivideopro.io (productized version)
- **Demo videos:** https://github.com/1229119561Weike/ai-ugc-factory/releases/tag/v0.1.0

**Integration with RHYTHMIX:** Treat as pattern guide for batch UGC production, not a hard dependency.
