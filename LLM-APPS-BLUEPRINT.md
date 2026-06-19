# LLM Apps Blueprint — awesome-llm-apps × Your Stack

**Source:** [Shubhamsaboo/awesome-llm-apps](https://github.com/Shubhamsaboo/awesome-llm-apps) — 154 runnable templates, Apache-2.0, provider-agnostic.

## Install model (ponytail: don't bulk-commit)

The cookbook is a **reference**, not a dependency. Cloning all 154 templates into this repo is bloat. Instead:

```bash
# Clone once as a sibling reference (outside this repo, NOT committed)
git clone --depth 1 https://github.com/Shubhamsaboo/awesome-llm-apps.git ~/awesome-llm-apps

# When you ship one, copy ONLY that template into the relevant app:
cp -r ~/awesome-llm-apps/starter_ai_agents/ai_music_generator_agent studio/agents/music-gen
# then: pip install -r requirements.txt && customize
```

Each template runs in 3 commands (`clone → pip install -r requirements.txt → streamlit run X.py`). All are provider-agnostic — swap Claude/Gemini/GPT/Replicate via config.

---

## Template → Your App Map

Pull only what you'll actually ship. Priority order = highest leverage first.

### 🎵 RHYTHMIX / STARLIGHTMIX Studio (music video platform)

| Template (path) | Use for |
|---|---|
| `starter_ai_agents/ai_music_generator_agent` | Core: prompt → track. Wire to your Replicate/MusicGen token in Studio. |
| `advanced_ai_agents/single_agent_apps/ai_movie_production_agent` | Promo/Cut generation — orchestrate script→scene→render (complements HyperFrames pipeline). |
| `advanced_ai_agents/multi_agent_apps/ai_news_and_podcast_agents` | Auto-generate RHYTHMIX podcast/social drops from release notes. |
| `starter_ai_agents/ai_blog_to_podcast_agent` | Turn landing-page copy into audio promos. |

### 🐄 HerdCheck (livestock vision screening)

| Template | Use for |
|---|---|
| `starter_ai_agents/ai_medical_imaging_agent` | Direct analog: phone-photo → diagnostic scoring. Adapt prompts from human→bovine (lameness, mastitis). |
| `rag_tutorials/` → Vision RAG / Multimodal Agentic RAG | Ground diagnoses in your Sprecher-scale + veterinary reference corpus. |

### 🏃 Reset (recovery app for team sport)

| Template | Use for |
|---|---|
| `advanced_ai_agents/single_agent_apps/ai_health_fitness_agent` | Recovery plan generation from athlete state. |
| `advanced_ai_agents/multi_agent_apps/ai_mental_wellbeing_agent` | Mental-recovery companion alongside physical. |
| `advanced_llm_apps` (memory tutorials) | Persist athlete state across sessions (you already use IndexedDB — mirror server-side). |

### 🌌 Codex of Reality (wellbeing PWA)

| Template | Use for |
|---|---|
| `advanced_ai_agents/multi_agent_apps/ai_mental_wellbeing_agent` | Coherence Engine reasoning backbone. |
| `voice_ai_agents/ai_audio_tour_agent` | Voice-guided morning brief (pairs with your Kokoro/Voicebox TTS). |
| `awesome_agent_skills/self-improving-agent-skills` | Let the Codex agent refine its own prompts over time. |

### 📣 Marketing site + Launch campaigns (rhythmixapp.com.au)

| Template | Use for |
|---|---|
| `advanced_ai_agents/multi_agent_apps/product_launch_intelligence_agent` | Drive `/album-launch` and `launch.html` campaigns. |
| `advanced_ai_agents/multi_agent_apps/agent_teams` (competitor intel) | Market positioning vs other AI-music tools. |
| `advanced_ai_agents/single_agent_apps/ai_journalist_agent` | Auto-draft press/blog posts. |
| `starter_ai_agents/ai_startup_trend_analysis_agent` | Feed `OpenManus` research loop. |

### 🌙 sunny-bedtime-videos (kids content)

| Template | Use for |
|---|---|
| `starter_ai_agents/ai_blog_to_podcast_agent` | Story text → narrated audio. |
| `advanced_ai_agents/single_agent_apps/ai_movie_production_agent` | Story → scene plan → frames (replaces ad-hoc frame gen). |

### 🛟 Studio support / ops

| Template | Use for |
|---|---|
| `voice_ai_agents/customer_support_voice_agent` | Lifetime-buyer support without staffing. |
| `mcp_ai_agents/` → GitHub MCP Agent | Triage issues on `wiggjamie9-afk/jamie-wigg` (you already have GitHub MCP). |

### 🛰️ Always-on (new capability)

| Template | Use for |
|---|---|
| `always_on_agents/always_on_hn_briefing_agent` | **Pattern** for an always-on RHYTHMIX trend scout: scheduled scan → filtered brief → deliver. Highest-leverage new pattern in the cookbook. |

---

## Reusable agent skills (drop-in)

`awesome_agent_skills/` ships 19 plug-in skill files. These map cleanly onto your existing skill system (`.agents/skills/`):

- `content-creator`, `editor`, `technical-writer` → RHYTHMIX copy + this repo's docs
- `self-improving-agent-skills` → meta-improve your own skills
- `data-analyst`, `visualization-expert` → Studio/FleetView analytics
- `ux-designer` → pairs with your `frontend-design` skill

**To adopt one:** copy its folder into `.agents/skills/`, register in `skills-lock.json` (same pattern as ponytail). Don't pull all 19 — pull the 3-4 you'll use.

---

## Recommended first 3 (ship these, skip the rest for now)

1. **`ai_music_generator_agent`** → STARLIGHTMIX Studio. Direct product value, you already have the Replicate token plumbing.
2. **`ai_medical_imaging_agent`** → HerdCheck. Your most differentiated app; this is the exact pattern it needs.
3. **`always_on_hn_briefing_agent`** → RHYTHMIX trend scout. New always-on capability, runs on a schedule, low cost (route to Tier 1 per `model-hierarchy`).

Everything else is on-demand: pull a template the day you build that feature, not before. (YAGNI.)

---

## Cost note

All agent loops here should route per `.agents/skills/model-hierarchy/`: routine scraping/monitoring on Tier 1 (Haiku/Gemini Flash), generation on Tier 2 (Sonnet), only escalate to Opus when a cheaper model fails. The always-on scout especially — it runs forever, so keep it on Tier 1.
