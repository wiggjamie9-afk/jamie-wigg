# AI Influencer Arsenal — Complete Installation Status

## ✅ Installed & Ready

### 1. follow-builders
**Status:** Installed to `~/.claude/skills/follow-builders/`
**Command:** `/follow-builders` (from Claude Code)
**What it does:** Monitors top AI builders on X/Twitter, tracks podcasts, fetches official blogs
**Setup needed:** Configure delivery (daily/weekly, language, channel)

### 2. affiliate-skills
**Status:** Installed to `~/.claude/skills/affiliate-skills/`
**Command:** `/affiliate-skills` or individual skill invocation
**What it does:** 52 skills across 8 stages (research → content → blog → landing pages → distribution → analytics → automation → meta)
**Setup needed:** None — tools require API keys (Pexels free, ElevenLabs free tier, OpenAI)

### 3. Reelify AI
**Status:** Cloned to `./reelify-ai/` with dependencies installed
**Command:** `cd reelify-ai && npm run dev` → http://localhost:3000
**What it does:** Generates short-form videos (script → Pexels footage → ElevenLabs voice → MP4)
**Setup needed:** `.env.local` with API keys:
```
PEXELS_API_KEY=...          (free at pexels.com/api)
ELEVENLABS_API_KEY=...      (free tier at elevenlabs.io)
OPENAI_API_KEY=...          (openai.com)
```

### 4. AI-Influencer-Generator
**Status:** Cloned to `/tmp/ai-influencer/`
**Command:** Google Colab or Jupyter: `jupyter notebook AI_Influencer.ipynb`
**What it does:** Generates persona characters (Stable Diffusion), voice (gTTS), animation (SadTalker)
**Setup needed:** GPU environment (Google Colab recommended)

### 5. MiniMax Web2API
**Status:** ⏳ Not yet installed (network blocked in sandbox)
**What it does:** OpenAI-compatible API proxy for MiniMax Agent (reverse-engineered signing)
**Setup when network available:**
```bash
git clone https://github.com/snake-aabb-wtf/MiniMax-web2api.git
cd MiniMax-web2api
pip install -r requirements.txt
python config_tool.py          # Needs HAR file from agent.minimaxi.com
python start.sh                # Runs FastAPI server on :8000
```

---

## Complete Arsenal Architecture

```
INTELLIGENCE             → CONTENT                → VIDEO                → DISTRIBUTION
├─ follow-builders       ├─ affiliate-skills S1  ├─ Reelify AI         ├─ affiliate-skills S5
│  └─ Trends/data        │  └─ Research brief    │  └─ Short videos     │  └─ Social/email
├─ MiniMax Web2API*      ├─ affiliate-skills S2  ├─ AI-Influencer-Gen  └─ MONETIZATION
│  └─ Alternative LLM    │  └─ Posts/scripts     │  └─ Talking heads       └─ Affiliate links
└─ (custom research)     └─ affiliate-skills S3  └─ (optional: combine)
                            └─ Blog/SEO

*MiniMax = alternative LLM backend (Chinese models)
```

---

## Next Steps

### Immediate (Set up now)
- [ ] Create `.env.local` for Reelify AI (add API keys)
- [ ] Test Reelify AI: `npm run dev` → http://localhost:3000
- [ ] Run first follow-builders digest: `/follow-builders`
- [ ] Define your first 3 personas in AI-INFLUENCER-PERSONAS.csv

### When network available (for MiniMax)
- [ ] Clone MiniMax Web2API repo
- [ ] Capture HAR file from agent.minimaxi.com
- [ ] Run config_tool.py to extract credentials
- [ ] Start MiniMax proxy server on :8000

### Week 1
- [ ] Generate content with Reelify AI (script → video)
- [ ] Create persona characters in AI-Influencer-Generator
- [ ] Plan first affiliate program (affiliate-skills S1)

### Week 2+
- [ ] Produce talking head videos (persona + Reelify content)
- [ ] Deploy to TikTok/YouTube
- [ ] Track analytics (affiliate-skills S6)

---

## Local Access

| Tool | Location | Start Command |
|------|----------|---|
| follow-builders | `~/.claude/skills/follow-builders/` | `/follow-builders` (Claude Code) |
| affiliate-skills | `~/.claude/skills/affiliate-skills/` | `/affiliate-skills` (Claude Code) |
| Reelify AI | `./reelify-ai/` | `cd reelify-ai && npm run dev` |
| AI-Influencer-Generator | `/tmp/ai-influencer/` | `jupyter notebook AI_Influencer.ipynb` |
| MiniMax Web2API | (not cloned yet) | `python start.sh` (after setup) |

---

## API Keys Needed

| Service | Purpose | Free Tier | Where |
|---------|---------|-----------|-------|
| OpenAI | Script generation (affiliate-skills, Reelify) | $5 credit | openai.com |
| ElevenLabs | Text-to-speech (Reelify, personas) | 10,000 chars/month | elevenlabs.io |
| Pexels | Stock videos (Reelify) | Unlimited free | pexels.com/api |
| MiniMax | Alternative LLM backend | Free trial | minimaxi.com |

---

## Quick Test Commands

```bash
# Test follow-builders
/follow-builders

# Test affiliate-skills
affiliate-check search "AI tools"

# Test Reelify AI
cd reelify-ai && npm run dev
# Open http://localhost:3000

# Test AI-Influencer-Generator
cd /tmp/ai-influencer && jupyter notebook
# Open AI_Influencer.ipynb
```

---

## Success Criteria

✅ All 5 components installed and discoverable
✅ Reelify AI runs locally with API keys
✅ First persona defined in CSV
✅ follow-builders digest flowing
✅ First short video generated via Reelify

Then scale: 3→5→10 personas, 5→20→50 pieces/week, affiliate programs tracked.
