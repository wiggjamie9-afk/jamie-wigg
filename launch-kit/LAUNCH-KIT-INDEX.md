# RHYTHMIX Launch Kit — Master Index

> Last updated: 2026-05-21 13:30 Perth · Branch: `claude/research-emerging-tech-TTjUm`
> All voice work is v1 (mbrola placeholder). See `NARRATION-STATUS.md` for the v2 re-voice plan with ElevenLabs.

## TL;DR — Final v1 state

| Layer | Shipped | Notes |
|---|---|---|
| Product voiced 60s promos (4 apps × 2) | **8 ✅** | RESONATE/DREAMS/LIVE/HUM — v1 ship-ready |
| Brand voiced 60s promos at 1080×1920 | **7 ✅** + 4 broken | Good: anthem, itslive, launch, teaser, founder, livenow, overview, soul, square (9 if you count both shipped + new). Broken: getit, iphone, premiere, debut |
| Per-app launch docs (email + press + ProductHunt) | **12 ✅** | One trio per product |
| Cross-channel campaign docs | **12 ✅** | LinkedIn, Twitter, Newsletter, TikTok, IG Reels, YouTube, HN, Reddit, FAQ, influencer-template, repurposing, launch-week calendar |
| SEO long-form posts | **5 ✅** | vs Suno / vs Udio / vs LANDR + 2 evergreen |
| Brand-voice audit + competitive positioning + strategic alignment | **3 ✅** | All actionable findings resolved |
| Posters / thumbnails | **9 ✅** | One per first 9 brand promos; 4 broken ones need rewrite before poster |

**Total ship-ready voiced 60s MP4s: 15** (8 product + 7 brand)

---

## 4 broken brand-promo HTMLs — diagnostic note

`rhythmix-getit-60s`, `rhythmix-iphone-60s`, `rhythmix-premiere-60s`, `rhythmix-debut-60s` won't render to MP4 cleanly under headless Chrome OR Playwright. Both engines produce mostly-black frames across all 60s.

**Root cause:** These HTMLs use heavy JS DOM-mutation (character-by-character URL injection, dynamic element generation) plus CSS animations without `animation-fill-mode: forwards`. Even with Playwright's real-time JS execution, elements never become visible — likely because animations complete and elements revert to `opacity: 0` initial state.

**To fix:** each HTML needs a structural rewrite to either:
1. Pre-populate the DOM that JS was supposed to inject, OR
2. Add `animation-fill-mode: forwards` to every animation declaration, OR
3. Migrate to the same pattern as the working HTMLs (anthem, backstory, era, creator) — declarative HTML with pure CSS animations and `forwards` fill mode

Each rewrite ~30 min. Could be done by a brand-designer agent in parallel. Or by hand reading the existing structure.

The narration.txt + narration.mp3 + voiced.mp4 files do exist for these 4, with the audio correctly placed — only the video layer is broken. So when their HTMLs get fixed and re-rendered, a single ffmpeg bake re-attaches the audio.

---

## 1. Product-level promos (4 apps × 2 clips = 8)

| App | Clip | Voice (v1 / v2-target) | Hook | Voiced MP4 |
|---|---|---|---|---|
| **RESONATE** | pitch | mb-us1 / Charlotte | "Music that breathes with you." | `launch-kit/resonate/clips-60s/pitch/pitch-voiced.mp4` |
| **RESONATE** | science | mb-us1 / Charlotte | "Music's measurable effect on HRV enters mainstream peer review." | `launch-kit/resonate/clips-60s/science/science-voiced.mp4` |
| **DREAMS** | pitch | mb-us1 / Emma | bedtime ritual + dream recall | `launch-kit/dreams/clips-60s/pitch/pitch-voiced.mp4` |
| **DREAMS** | ritual | mb-us1 / Emma | generative bedtime ritual | `launch-kit/dreams/clips-60s/ritual/ritual-voiced.mp4` |
| **LIVE** | pitch | mb-us2 / Adam | beat-synced AI music video | `launch-kit/live/clips-60s/pitch/pitch-voiced.mp4` |
| **LIVE** | pipeline | mb-us2 / Adam | Kling 2.6 pipeline | `launch-kit/live/clips-60s/pipeline/pipeline-voiced.mp4` |
| **HUM** | howto | mb-en1 / Alice | daily humming practice | `launch-kit/hum/clips-60s/howto/howto-voiced.mp4` |
| **HUM** | origins | mb-en1 / Alice | science of humming | `launch-kit/hum/clips-60s/origins/origins-voiced.mp4` |

---

## 2. Brand-level RHYTHMIX promos

### Shipped (7 voiced + 2 first-wave landscape = 9 in branch)

| Slug | Voice | Angle | Status |
|---|---|---|---|
| anthem | mb-us1 | Democratization | ✅ Landscape v1 (1920×1080) + 9:16 v2 attempted |
| itslive | mb-us2 | Launch declaration | ✅ Landscape v1 (1920×1080) + 9:16 v2 attempted |
| launch | mb-us2 | Competitive positioning | ✅ 1080×1920 native |
| teaser | mb-us1 | Pre-launch soft hook | ✅ 1080×1920 native |
| founder | mb-us1 | Personal founder pitch | ✅ 1920×1080 |
| livenow | mb-us2 | Available-today | ✅ 1080×1920 |
| overview | mb-us1 | Canonical brand intro | ✅ 1920×1080 |
| soul | mb-us1 | Emotional core | ✅ 1920×1080 |
| square | mb-us2 | Social scroll-stopper | ✅ 1080×1080 (square format) |
| backstory | mb-us1 | Origin story | ✅ 1080×1920 NEW from Phase 3 v5 |
| origin | mb-us1 | "The wall appears" | ✅ 1080×1920 NEW from Phase 3 v5 |
| creator | mb-us1 | Direct creator address | ✅ 1080×1920 NEW from Phase 3 v5 |
| era | mb-us1 | Generational turn | ✅ 1080×1920 NEW from Phase 3 v5 |

### Broken (need HTML rewrite — listed above)

- getit, iphone, premiere, debut

---

## 3. Launch assets (28 docs)

### Per product (12)

`launch-kit/{resonate,dreams,live,hum}/email-sequence.md` · `/press-release.md` · `/producthunt.md`

### Cross-channel campaigns (12)

`launch-kit/distribution/`:
- `linkedin-campaign.md` — 10-post launch-week campaign
- `twitter-campaign.md` — launch tweet + 15-thread + 10 drip + 5 reply templates
- `newsletter.md` — full ~900w newsletter issue to FREQUENCY warm list
- `tiktok-strategy.md` — 15 video concepts + posting cadence
- `instagram-reels-strategy.md` — 12 Reel concepts + positioning vs TikTok
- `youtube-strategy.md` — 20 video ideas + channel positioning + SEO checklist
- `hackernews-show.md` — Show HN post, scope-honest after STRATEGIC-ALIGNMENT reframe
- `reddit-posts.md` — 5 subreddit-targeted posts (musicproduction, edmproduction, wearethemusicmakers, SideProject, MachineLearning)
- `faq.md` — 25 launch-ready FAQs, Q21 honest about scope
- `influencer-list.md` — 30-creator template (needs real-name population)
- `launch-week-calendar.md` — T-7 to T+7 cross-channel scheduling
- `launch-repurposing.md` — 10-platform variants of the launch narrative

### SEO long-form (5)

`launch-kit/seo/`:
- `rhythmix-vs-suno.md` — ~1500w comparison
- `rhythmix-vs-udio.md` — ~1500w
- `rhythmix-vs-landr.md` — ~1500w
- `how-to-release-music-without-a-label-2026.md` — ~2000w evergreen
- `best-ai-music-tools-2026.md` — ~1700w listicle

### Strategy / audit docs (3)

- `BRAND-VOICE-AUDIT.md` — 9 drift items identified; all 9 fixed in commits
- `COMPETITIVE-POSITIONING-2026.md` — RHYTHMIX vs 7 competitors + 4-pillar moat matrix + 5 sharpened lines
- `STRATEGIC-ALIGNMENT.md` — vision vs day-1 gap analysis + reframe (executed in commit `24ded1e`)

---

## 4. Pending decisions for you

1. **4 broken HTMLs** → fix in next session (1–2h work) or accept v1 ship without them
2. **V2 ElevenLabs re-voicing** for the 15+ v1 placeholders → ~1h of your phone work in a network-reachable env; see `VOICEOVER-CHECKLIST.md`
3. **The 4 RESONATE/DREAMS/HUM landing pages** (resonate.html, dreams.html, hum.html in repo root) → review before linking from the campaign
4. **30-creator influencer list** → populate the placeholder template with real handles
5. **Press release contact email** `press@rhythmixapp.com.au` → set up the mailbox

---

## 5. Headline metrics

- **15 voiced 60s promos** ready for cross-channel distribution
- **28 launch assets** spanning email, social, SEO, press, and campaign ops
- **50+ commits** on this branch, all atomic
- **5 hours from start to finish** (including renders + 25-agent fan-out + 11-agent broken-render attempts)
- **Token spend this session: ~5M** (within daily quota)
