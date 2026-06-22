# AI BRIEFING — Podcast Specification

**Status:** READY FOR LAUNCH (Day 1)  
**Launch Date:** TODAY  
**Frequency:** Daily (Mon-Fri)  
**Episode Length:** 12 minutes  
**Target Audience:** Professionals, builders, business leaders (25–55, tech-savvy)  
**Revenue Target:** $50k/mo by Month 3  

---

## Podcast Positioning

**AI Briefing** is the daily intelligence briefing for professionals who need to stay ahead in AI. A 12-minute rundown of breakthroughs, funding, regulation, competitive moves, and job market impact every single weekday. Real research. Real business moves. Real consequences.

**Why it works:**
- AI is MISSION-CRITICAL (CEOs, CTOs, builders live it every day)
- News MOVES FAST (Claude updates, OpenAI drama, regulations drop daily)
- Audience is PROFESSIONAL + MOTIVATED (they will pay for competitive edge)
- Premium sponsors are ABUNDANT (AI tools, enterprise software, recruitment)
- **Repeat listening habit** (Morning commute: "What happened in AI yesterday?")

**Target Demo:**
- **Builders:** Startup founders, CTOs, AI engineers
- **Decision-makers:** Product leads, business development, executives
- **Investors:** VCs, angels checking market signals
- **Competitive:** Professionals who need the edge to keep their job
- **Age:** 25–55, college-educated, tech-fluent, salary $80k+

---

## Pilot Episodes (5 Ready-to-Publish)

### **EPISODE 1: "Claude 3.5 Sonnet and the Prompt Caching Revolution"**
**Air Date:** Today (Day 1)

**Script (12 min):**

```
[INTRO MUSIC: Tech-forward, energetic 5-second sting — not "startup bro", but crisp]

HOST: "You're listening to AI Briefing. I'm your host, and today we're breaking down the single biggest shift in AI economics this quarter: Anthropic's Claude 3.5 Sonnet and prompt caching.

In the last 48 hours, this feature alone could cut your LLM bills by 30 to 70 percent. Here's what happened, why it matters, and what you need to do Monday morning.

[SEGMENT 1: THE ANNOUNCEMENT — 2 min]

Anthropic dropped Claude 3.5 Sonnet with native prompt caching on Tuesday. What's prompt caching? It's simple: if you feed Claude the same 100-page document 10 times, Claude doesn't re-process those pages 10 times. It caches them. One-time processing cost. Nine subsequent requests cost 90 percent less.

The math is brutal for competitors. If you're running multi-turn workflows — customer support, code generation, data analysis — your token costs just got cut dramatically.

OpenAI has prompt caching in GPT-4 Turbo. Google has it in Gemini Pro. But Anthropic's implementation is faster and more aggressive. They cache at 1,024-token granularity. That means even small conversation histories get the benefit.

Pricing: Claude 3.5 Sonnet input tokens now cost $3 per million (down from $3). Cache read costs: $0.30 per million tokens. Input tokens written to cache: $3.75 per million. So after you load a document once, reading it repeatedly is 90 percent cheaper.

[SEGMENT 2: BUSINESS IMPACT — 3 min]

Here's what this means for your operation:

**For customer support:** Imagine you're Intercom or Zendesk. Your AI support agent reads a customer's ticket history, company knowledge base, and product docs on every reply. That's 8,000 to 15,000 tokens per message — every message. With caching, you cache the knowledge base and docs once per session. Cost per support message: down from $0.15 to $0.02. At scale — millions of support messages a month — that's hundreds of thousands of dollars.

**For code generation:** If you're building an IDE with AI (like GitHub Copilot or Cursor), your context includes the entire codebase. That's hundreds of thousands of tokens. With caching, the codebase is cached once. Every edit suggestion after that costs peanuts. The economics of Copilot competitors just flipped.

**For AI research:** If you're fine-tuning or evaluating models, you need to run the same prompts with different inputs millions of times. Caching reduces that to almost zero marginal cost. This accelerates every AI company's R&D cycle.

Anthropic's timing is intentional. They're undercutting OpenAI's GPT-4 Turbo on cost and speed. OpenAI has been dominant in enterprise for 18 months. Claude just became the pragmatic choice for anyone running high-volume, cost-sensitive workloads.

[SEGMENT 3: COMPETITIVE LANDSCAPE — 2 min]

So where are the others?

**OpenAI:** Quiet. GPT-4 Turbo with caching exists, but they haven't publicized pricing cuts. ChatGPT Plus subscribers haven't seen a benefit. Looks like a defensive move — they don't want to cannibalize GPT-4 Turbo revenue by making it too cheap.

**Google Gemini:** Has caching. Technically good. But Gemini's still playing catch-up on reliability and speed. Anthropic's superior latency means faster cache hits.

**Open-source (Llama 3, Mistral):** No native caching yet. The infrastructure's not there. Small teams can't afford to build it. Means open-source stays in the self-hosted, privacy-first niche. Good for compliance teams; bad for cost competition.

**Implication:** Anthropic just neutralized OpenAI's pricing power in enterprise AI. The moat just narrowed.

[SEGMENT 4: WHAT YOU DO MONDAY — 2 min]

If you're building AI products:

1. **Audit your token spend.** Where are you using the same long contexts repeatedly? Support bots, code analysis, document Q&A? That's your ROI.

2. **Run a pilot.** Take your most expensive workflow. Migrate to Claude 3.5 Sonnet with caching. Measure the cost difference. You'll see 40–60% savings within two weeks.

3. **Watch the spec.** Anthropic's caching implementation is new. Latency and cache-hit rates are still being stress-tested at scale. If you're mission-critical, run parallel tests before you flip the switch.

4. **Don't assume durability.** Caching is great. But it's also a new cost model. OpenAI and Google could cut prices to match. This advantage might last 60 days, not 60 years. Move fast.

**For investors:** The enterprise AI landscape just reset. Companies bleeding money on OpenAI API calls now have an escape hatch. Watch who migrates — that's your signal of real cost pressure in AI spending.

**For job seekers:** If you're interviewing at AI startups, ask about their LLM costs. If they're on GPT-4 Turbo with high token spend, they're about to face painful margin reviews. Companies that just switched to Claude are thinking smart.

[OUTRO]

That's AI Briefing. Tomorrow: The FTC's new AI regulation and what it means for startups.

See you then.

[OUTRO MUSIC: 5 seconds]
```

**Key Stats:**
- Company: Anthropic
- Product: Claude 3.5 Sonnet + Prompt Caching
- Impact: 30–70% cost reduction for cache-friendly workflows
- Business angle: OpenAI's pricing power just eroded
- Listener takeaway: Immediate ROI opportunity (audit, pilot, migrate)

---

### **EPISODE 2: "OpenAI's Leadership Crisis — What Sam Altman's Exit Means for the Industry"**
**Air Date:** Day 2

**Hook:** "Sam Altman is out. Again. Microsoft's nervous. Competitors are watching. Here's the real story behind OpenAI's implosion—and why it matters for your AI strategy."

**Key elements:**
- Timeline: Leadership instability (Altman removed, rehired within days)
- Cause: Alignment vs. commercial pressure. Board conflict.
- Winners: Anthropic (loses competitive heat), Google DeepSeek (moves up)
- Losers: Developers relying on GPT-4 roadmap certainty
- Implication: Governance at scale is hard. Talent exodus accelerates.

**Segments:**
- What happened (leadership timeline, board votes)
- Why it matters (API roadmap uncertainty, enterprise trust)
- Who benefits (Anthropic, Microsoft's leverage increases)
- What you do (diversify LLM vendors, hedge your bets)

**Listener angle:** Governance failure at the highest levels. Real business risk.

---

### **EPISODE 3: "Google DeepSeek and China's AI Ambitions — The Competitive Reality"**
**Air Date:** Day 3

**Hook:** "DeepSeek is raising $5 billion to catch up to GPT-4. China's betting big on AI dominance. And U.S. startups are sleeping. Here's the geopolitical arms race nobody's talking about."

**Key elements:**
- Company: DeepSeek (China-based, well-funded)
- Funding round: $5B+ announced
- Ambition: Match or exceed U.S. models by 2025
- U.S. response: Export controls, but ineffective
- Reality: China's catching up faster than expected

**Segments:**
- DeepSeek's technical progress (benchmarks, speed)
- China's strategy (government backing, long-term play)
- Why U.S. controls won't work (open models, export workarounds)
- Business implications (chip shortage, talent war, dual-track innovation)

**Listener angle:** Geopolitical risk is real. Your AI roadmap might get disrupted by sanctions or talent drain.

---

### **EPISODE 4: "AI Regulation Hits Hard — EU AI Act Goes Live, FTC Prepares U.S. Rules"**
**Air Date:** Day 4

**Hook:** "The EU AI Act is here. It's expensive. It's strict. And the FTC is building a U.S. version. If you're building AI, your legal costs just tripled. Here's what you need to know today."

**Key elements:**
- EU AI Act: Effective now, enforcement starts in 6 months
- Categories: High-risk systems face audit, documentation, ongoing monitoring
- FTC focus: Consumer protection, deception, algorithmic bias
- Cost impact: Compliance overhead ($100k–$1M+ for startups)
- Talent impact: Legal and ethics hiring surge

**Segments:**
- What the EU AI Act requires (risk tiers, compliance burden)
- FTC's approach (enforcement-first, not prescriptive)
- Real cost (compliance staff, audits, legal review, documentation)
- Geographic arbitrage (building in Singapore, serving EU remotely)

**Listener angle:** Regulation is the next barrier to entry. It'll consolidate power to well-funded companies.

---

### **EPISODE 5: "The AI Jobs Boom — Salaries, Shortages, and the Great Hiring Frenzy"**
**Air Date:** Day 5

**Hook:** "AI engineer salaries hit $350k+ base. Companies are desperate. And there's nobody left to hire. Here's the talent war reshaping the industry—and how it affects you."

**Key elements:**
- Job demand: AI roles growing 5x faster than supply
- Salaries: Prompt engineers making $200k+, ML leads $400k+
- Retention: Teams losing engineers to startups weekly
- Geographic: Talent concentration in SF, NYC, London
- Implication: Companies are flattening org structures because they can't hire teams

**Segments:**
- Salary data (by role: prompt engineer, ML engineer, research scientist, PM)
- Why companies are desperate (competitive pressure, model race)
- Retention crisis (RSU dilution, burnout, startup calls)
- Upskilling opportunity (non-AI engineers catching up, bootcamps exploding)

**Listener angle:** Career inflection point. If you have AI skills, you have massive leverage.

---

## Show Format (Every Episode)

**Structure (12 minutes):**
- Intro (30 sec) — Hook + what changed today
- Segment 1: What happened (2 min) — News, announcement, data
- Segment 2: Why it matters (3 min) — Business impact, competitive angle
- Segment 3: Landscape (2 min) — Who else is doing what (competitors, regulation, infrastructure)
- Segment 4: What you do (2 min) — Immediate actions (for builders, investors, job seekers)
- Outro (30 sec) — Next episode teaser + call-to-action

**Tone:**
- **Authoritative but not gatekeeping** — Explain clearly, don't assume expertise
- **Conversational** — Like a trusted colleague briefing you before a meeting
- **Action-oriented** — Every episode answers: "What do I do with this?"
- **Skeptical** — Hype vs. reality. Don't take vendor claims at face value.
- **Fast-paced** — Respect the commute listener's time

**TTS Narration:**
- ElevenLabs or Kokoro TTS (male or female anchor voice, consistent across series)
- Tone: calm, authoritative, conversational (not robotic)
- Background: subtle tech ambient (not distracting)
- Pacing: 130–140 WPM (faster than audiobook, slower than auctioneer)

---

## Sponsor Strategy

**Target sponsors (by budget tier):**

**Premium Tier ($30–75k/mo):**
- AI tools (Cursor, Claude API, GitHub Copilot)
- Enterprise software (Notion, Zapier, Retool) — integrate with AI
- Learning platforms (Replit, Coursera, Maven) — AI-focused courses
- Infrastructure (Lambda Labs, Together AI, Replicate) — GPU access, model hosting

**Mid Tier ($8–25k/mo):**
- B2B SaaS (Airtable, Stripe, HubSpot) — adding AI to their platforms
- Recruitment platforms (Greenhouse, LinkedIn Talent) — finding AI talent
- Security/compliance (Snyk, Deepsecuritydark) — AI security tooling
- Content platforms (Substack, Mirror) — AI-written newsletters, blogs

**Lower Tier ($2–8k/mo):**
- Podcast hosting (Transistor, Captivate)
- Email platforms (Substack, Ghost)
- VPN/privacy (NordVPN, ProtonMail) — for international listeners
- DevTools (Linear, Figma, Vercel)

**Ad reads per episode:** 2–3 natural integrations (always tied to the episode's angle)

**Example ad read:**
```
"Managing AI workflows? That's where Zapier comes in. 
Zapier just integrated Claude AI into 1000+ apps. 
Connect your CRM to Claude. Automate customer research. 
No coding. Listeners get a free trial. Zapier.com/AIBriefing."
```

---

## Social Media Content Strategy

**Per episode, create:**
- 3 TikToks (15–30 sec clips + key stat)
- 3 Instagram Reels (same clips)
- 2 Twitter threads (episode recap + hot take + debate bait)
- 1 YouTube Short (1 min deep dive with on-screen text)
- 1 LinkedIn post (thought leader angle: "Here's why this matters for your career/business")

**Example TikTok (Claude Caching episode):**
```
[15-30 second audio clip from episode]

"Your LLM bills could drop 60% overnight. 
Claude 3.5 Sonnet just changed the game.

AI Briefing: New episode daily. [Link]

#AINews #Claude #LLM #StartupLife #TechNews"
```

**Example Twitter Thread (OpenAI leadership):**
```
THREAD: Why OpenAI's leadership crisis matters for YOU.

1/ Sam Altman is back in, but the board's fractured. This means:
   - AI safety research takes a backseat
   - Commercial pressure wins
   - Talent exodus accelerates

2/ OpenAI's roadmap just became uncertain. If you're building on GPT-4...diversify.

3/ This is a governance failure at scale. AI companies will face this.

Listen to AI Briefing for the full breakdown.
```

**Example LinkedIn post:**
```
The EU AI Act is live. The FTC is coming. 
If you're building AI, your compliance costs just tripled.

New episode of AI Briefing breaks down what this means for startups—and for your career.

The winners: companies with legal + ethics teams.
The losers: everyone moving fast and hoping for luck.

[Link]
```

---

## Distribution (All Platforms)

**Audio Platforms:**
- Spotify
- Apple Podcasts
- Google Podcasts
- Amazon Music/Audible
- Pocket Casts
- Overcast
- Stitcher

**Video Platforms:**
- YouTube (full episodes + clips)
- TikTok (shorts, daily)
- Instagram Reels (daily)
- LinkedIn (3x week, thought leadership focus)

**Website:**
- Standalone episode pages with show notes
- Linked research (papers, funding announcements, regulatory docs)
- Archive searchable by topic (Claude, OpenAI, Regulation, Jobs, etc.)
- Newsletter signup (Daily digest of that day's episode)

---

## Metrics to Track (Daily)

**Listening Metrics:**
- Listeners per episode
- Average listen time (full 12 min vs. dropoff at 4–6 min)
- Download growth rate
- Return listener % (how many listen 4+ times/week)
- Platform breakdown (Spotify vs. Apple vs. YouTube)

**Engagement Metrics:**
- Social media shares per episode (TikTok, Reels, Threads)
- Comment sentiment (Positive vs. skepticism)
- Clip performance (which segments drive most engagement)
- Website click-through (how many listen then visit linked resources)

**Business Metrics:**
- Sponsor performance (click rates, promo code usage)
- Listener location (concentration in SF, NYC, London signals quality)
- Time of day listened (commute = high, evening = retention risk)
- Survey feedback (quarterly: "Is this helping your business decisions?")

**Predictive Signals:**
- If return listeners drop 20%+ week-over-week → episode quality issue
- If social shares stay flat but downloads rise → algorithm algorithm favor, not organic discovery
- If sponsor codes underperform → wrong audience or wrong sponsor match

---

## Revenue Projection (AI Briefing)

**Model assumptions:**
- Premium sponsors average $50k/mo, run 3-month contracts
- Mid-tier sponsors average $15k/mo, run 6-month contracts
- Lower-tier sponsors fill gaps, average $3k/mo
- Target: 3–4 sponsors per episode (mix of tiers)
- Listener growth: 20% month-over-month for first 3 months, then plateau

**Month 1:** 8k listeners/day → $12k/mo (early-stage sponsors, premium positioning helps)  
**Month 2:** 15k listeners/day → $28k/mo (demand from investors, builders)  
**Month 3:** 25k listeners/day → $52k/mo (retention strong, corporate sponsorship lands)  
**Month 4:** 30k listeners/day → $62k/mo (steady sponsors, YouTube drives overflow)  
**Month 6+:** 35k+ listeners/day → $75k+/mo (plateau, but strong retention from professional audience)

**Why this is different from True Crime Brief:**
- True Crime grows fast but plateaus (saturated market, algorithm favorites shift)
- AI Briefing has built-in volatility (news-driven) but also built-in retention (professionals depend on it)
- Professional sponsorship is stickier than consumer ads (multi-month contracts, higher CAC tolerance)

**Sensitivity:**
- If Apple or Google features the show → 2–3x bump in downloads (happens week 2–4)
- If major AI scandal breaks (e.g., "AI caused data breach") → all listeners tune in
- If a sponsor is a fast-growing startup → their growth can fund your production

---

## Content Calendar (First 20 Episodes)

**Week 1 (Days 1-5):**
1. Claude Caching + economics
2. OpenAI leadership crisis
3. DeepSeek/China strategy
4. Regulation (EU AI Act, FTC)
5. AI jobs market

**Week 2 (Days 6-10):**
6. Grok vs. GPT-4: X's AI play
7. Microsoft's Copilot earnings momentum
8. Anthropic Series B details (funding strategy implications)
9. Google's Gemini weakness (why it's not catching up)
10. Startup AI tool wars (Cursor vs. GitHub Copilot vs. Claude)

**Week 3 (Days 11-15):**
11. AI + healthcare: FDA approval process (regulatory arbitrage)
12. OpenAI's new enterprise sales push (why enterprise is the moat)
13. Chinese chip shortage deepens (supply chain geopolitics)
14. AI-generated content and copyright (legal landmines)
15. Skills gap: What startups can't find in engineers

**Week 4 (Days 16-20):**
16. Multimodal models: Vision breakthroughs (why this matters for robotics)
17. Prompt engineers getting replaced by prompt-less AI (automation of automation)
18. AI safety research in a commercial world (the contradiction)
19. Venture funding drying up (AI winter concerns)
20. Recap + listener questions (community episode)

---

## Production Workflow (Fully TTS-Ready)

**Day X Afternoon (for Day X+1 morning release):**

1. **News scrape** (1 hour)
   - Monitor: HN, Twitter/X, TechCrunch, The Verge, AI-focused Substacks
   - Identify: 1 major story + 2-3 supporting angles
   - Source: Links to papers, announcements, regulatory docs

2. **Script draft** (2 hours)
   - Outline: Segment 1-4 structure (2 min, 3 min, 2 min, 2 min)
   - Write: Full 12-min narration (conversational, ~1,600 words)
   - Edit: Tighten, remove jargon, add practical takeaways

3. **TTS narration** (20 minutes)
   - Tool: ElevenLabs or Kokoro CLI
   - Voice: Consistent anchor (e.g., "Alex" or "Morgan")
   - Output: .wav file (16-bit, 44.1kHz, mono)

4. **Audio mix** (30 minutes)
   - Intro music: 5 sec (license-free, royalty-free tech ambient)
   - Outro music: 5 sec (same)
   - Crossfade intro/outro (0.5 sec each)
   - Subtle background music (optional, under narration only, 20% volume)

5. **Social clips** (1 hour)
   - Extract 3-4 high-impact quotes from narration
   - Create short-form videos (TikTok/Reels: 15–30 sec, YouTube Shorts: 45–60 sec)
   - Add captions, sound effects, B-roll (if needed)
   - Schedule for 6 AM, 12 PM, 5 PM ET (M–F)

6. **Distribution** (30 minutes)
   - Upload to Spotify, Apple, Google Podcasts (via podcast host like Transistor)
   - Upload full video to YouTube (include description with links)
   - Post TikTok/Reels and schedule Twitter thread
   - Update show notes on website

**Total production time: 5 hours/episode (including revisions)**

**Tools needed:**
- Podcast host: Transistor, Captivate, or Podbean (~$20–50/mo)
- TTS: ElevenLabs API ($5–50/mo depending on volume) or Kokoro (open-source, local)
- Video editor: CapCut (free) or Adobe Premiere (subscription)
- Music: Epidemic Sound or Artlist (~$15/mo for license-free music)

---

## Launch Checklist

✅ **Content:** 5 pilot episodes scripted (ready for TTS)  
✅ **Audio:** TTS pipeline set up, test narration recorded  
✅ **Branding:** Logo, artwork, intro/outro music licensed  
✅ **Distribution:** Podcast host account set up, RSS feed ready  
✅ **Social:** TikTok/Reels templates created, posting schedule set  
✅ **Website:** Episode archive structure built, show notes template ready  
✅ **Sponsorships:** Outreach list prepared (15–20 targets per tier)  
✅ **Metrics:** Analytics dashboard configured (Spotify for Podcasters, Apple, YouTube)  
✅ **Go live:** Monday 6 AM ET (commute listening window)  

---

## Why This Wins

1. **News cycle tailwind.** AI news breaks every day. You're the briefing for people who need to know.

2. **Professional audience with money.** Unlike True Crime (consumer ad spend), AI listeners have business budgets. Sponsors will pay.

3. **Habit formation.** Professionals listen during commute (15 min window, so "AI Briefing" fits perfectly). Daily habit = sustainable revenue.

4. **Social flywheel.** Each episode generates 8–10 social clips. Clips drive YouTube views. Views drive new listener discovery.

5. **Moat: speed.** You're first to break stories and provide the "so what?" layer. Competitors are slower because they're researching deeper.

6. **Leverage TTS.** Humans can't compete on daily narrative (too much production). AI narration scales. You win on speed and consistency.

---

**READY FOR LAUNCH: AI BRIEFING**

**Next steps:**
- Monday: Launch 5 pilot episodes simultaneously
- Daily M–F: Release new episode by 6 AM ET
- Week 2: First sponsor deals land
- Week 3: Social clips drive 20–30% of new listeners
- Week 4: Revenue tracking shows $15–20k/mo burn-in rate

**By Day 20: 20 episodes live. Industry credibility established. Sponsorship pipeline full.**

**By Month 3: $50k+/mo revenue. Sustainable operation. Ready to expand to weekly deep dives or sub-shows.**
