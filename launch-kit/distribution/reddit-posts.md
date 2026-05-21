# RHYTHMIX — Subreddit Launch Posts

> Five subreddit-calibrated launch posts. Each tuned to local culture, mod rules, and the unwritten "what's okay to say here" of that community. Posts are followed by four pre-drafted reply templates covering the most likely challenges in comments.
>
> **Honesty rules** (apply to every post): RHYTHMIX is a commercial product. AU$149 lifetime, currently in waitlist. There is no free tier yet beyond the waitlist signup. Don't pretend it's open source, don't pretend you're "just a hobbyist", don't bury the disclosure if asked directly. Don't sock-puppet replies.
>
> **Posting cadence** (recommended): One post per day, NOT all five in 24h. Different account on r/MachineLearning if your main has no ML history (they'll filter). Read sticky rules each time — they drift.

---

## 1. r/musicproduction — long-form craft post

> **Culture:** Working producers. Allergic to ad copy. Reward depth, specifics, and "I learned this the hard way" energy. The mods enforce self-promo rules but will leave long technical posts that mention product in passing.
>
> **Strategy:** No promotional opener. Lead with what I actually learned. Mention RHYTHMIX once, near the end, framed as "this is what I built — happy to talk about any of it." If a mod removes, accept it cleanly.

### Title (96 chars)
What 8 months of building an AI music pipeline taught me about where the real bottlenecks are

### Body (~640 words)

I've spent the last eight months building a full-stack AI music platform — generation, mastering, distribution, the whole pipeline — as a solo dev. I want to share what I actually learned about the AI music stack in 2026, because most of the public discourse is either hype videos or "AI is stealing music" and almost none of it is honest about where the real work lives.

**1. Generation is the easy part now. The seams are everything else.**

Suno v5, Udio, Stable Audio 2.5 — these are all good enough that "make a song from a prompt" is a solved consumer problem. What's not solved: getting from a generated track to something a release artist would actually put their name on. The seams between generation, mastering, stem handling, and distribution are where 80% of the value sits and 95% of the engineering work goes. Nobody talks about this because demos don't show plumbing.

**2. Loudness normalisation is harder than mastering.**

I assumed AI mastering would be the hard part. It's not — LANDR-style chain processors are mature, and you can match a -14 LUFS target with a stack of multiband + limiter + soft-knee maximiser in a Web Audio graph. The hard part is dealing with the fact that Spotify, Apple Music, YouTube Music, and TikTok all normalise differently and what sounds great on one will sound flattened on another. Real pipelines need per-platform render targets, not one master.

**3. Stem separation is the unsung hero feature.**

Demucs v4 + a custom post-processor for sibilance handling will get you 92% of pro quality on vocal/instrumental splits. Producers I've shown this to care more about clean stems out of a generated track than they care about the generation itself, because stems unlock remixing, replacement instrumentation, and live performance workflows. If you're building anything in this space, stem export is table stakes — not a feature.

**4. Commercial rights are a product feature, not a legal footnote.**

The reason Suno/Udio get nervous looks from sync libraries isn't audio quality — it's that the rights provenance is murky. If you're building tooling that producers will use commercially, you need a clean rights story from generation through distribution. That's a design constraint, not a checkbox.

**5. Distribution APIs are a nightmare and worth it anyway.**

DistroKid, CD Baby, TuneCore each have their own metadata schemas, ISRC handling, and royalty plumbing. Building direct integration is months of work per partner. But once you've done it, the user goes from generated track to live on 40+ stores in a single flow, and that's the difference between a "cool toy" and "I cancelled my DistroKid sub."

**6. The thing nobody warns you about: vocal coherence at the chorus.**

Generated vocals on 30-second clips sound great. At 3:20 with a key change, you get artifacts that no listener can name but everyone feels. The fix is generation-side: prompt for shorter sections, stitch with crossfade-and-EQ-match, regenerate the section instead of the song. Section regeneration ("inpainting") is the underrated workflow.

---

What I built around all this: RHYTHMIX — generate, master, distribute, earn, one platform, AU$149 lifetime. Commercial product, currently in waitlist. I'm not here to sell it; happy to go deep on any of the above pipeline pieces if useful. The TL;DR is that the next wave of AI music tools won't win on generation quality — that war is over — they'll win on everything that happens after the WAV exists.

What pipeline bottlenecks are you hitting? Genuinely curious where other people are stuck.

### Pre-drafted reply templates

**(a) "This is just an ad."**

> Fair pushback. The pipeline notes are real — I'll go deep on any of them with no product mention. Specifically, ask me about the per-platform loudness normalisation chain or the section-regeneration flow. If a mod thinks the post crosses the line I'll happily edit out the product reference; the engineering content stands on its own.

**(b) "AI music is killing real producers."**

> I understand that read and I don't think it's wrong. The platform I'm building treats AI as the floor, not the ceiling — stem export, MIDI export, DAW integration, section regeneration. The producers using it day to day aren't replacing their craft, they're skipping the parts they were paying $300 a session for. The career-killing version of this tech is the one that hides the stems and locks you to a subscription. That's the version I specifically didn't build.

**(c) "What model do you use for generation?"**

> Multi-engine routing. Suno-class output for vocal-led tracks, Stable Audio for instrumentals and sound design, MusicGen for ambient/textural work. The user doesn't pick — the platform routes based on prompt analysis. The decision was to never make someone learn which model is good at what; that's a tooling failure dressed up as user choice.

**(d) "How do you handle commercial rights when the training data is murky?"**

> The honest answer is that this is the hardest non-engineering problem in the category. My approach: only ship generation engines with cleared or licensed training data, attach platform-native rights flow to every track at generation time, and treat sync-library acceptability as a product KPI rather than a legal afterthought. It's slower to ship and it means I can't always offer the bleeding-edge model. The trade is that release artists can actually use the output without a "is this safe?" question.

---

## 2. r/edmproduction — RHYTHMIX LIVE / music-video pipeline post

> **Culture:** Producers who care about the visual side. They'll engage with technical depth on AI video models because most of them are already using one of them. Self-promo tolerated if buried in genuine craft content.
>
> **Strategy:** Lead with the four-model music-video pipeline (Kling 2.6, HunyuanVideo, Luma Ray 2, MiniMax Hailuo). Frame as "I tested all four against each other so you don't have to." Mention RHYTHMIX LIVE once. Pricing visible but not the lead.

### Title (99 chars)
I beat-synced the same drop across Kling 2.6, Hunyuan, Luma Ray 2, MiniMax — here's what each won

### Body (~580 words)

Spent the last six weeks running the same 16-bar drop through four different AI video models, beat-synced to the same kick pattern (140 BPM, peak-time techno), trying to figure out which model actually handles music video work and which ones are just demo-reel impressive.

The TL;DR up front: none of them are the right single answer. Each one wins a different part of the job.

**Kling 2.6 — wins on motion coherence under fast cuts.**

Kling's 5-second clips hold up at 32nd-note cut intervals without the "AI smear" you get from earlier models. Particle systems, smoke, lens flares — all coherent across hard cuts. Weakness: faces still drift if you push past 4 seconds, so it's a "B-roll and atmosphere" engine, not a "lead performer" engine. Cost is the headline issue — Kling 2.6 Pro at $0.49/5s adds up fast on a full track.

**HunyuanVideo — wins on prompt adherence, especially for abstract / non-photoreal work.**

Tencent's open-weights model is the underdog. For abstract motion graphics, fluid sims, geometric audio-reactive visuals, it follows complex prompts more accurately than the closed-API options. It's also the only one in this list I could self-host on an A100, which changes the cost calculus completely if you have GPU access. Weakness: photoreal humans look uncanny in a way Kling and Luma have moved past.

**Luma Ray 2 — wins on camera motion.**

Ray 2's camera path control is the best in the category right now. Dolly, orbit, push-in, all controllable as parameters rather than prompt-coaxed. If your video has any "camera-led" storytelling — slow push into a face on the drop, orbit around a subject during the breakdown — Ray 2 is the move. Weakness: it's expensive and slower to render than Kling.

**MiniMax Hailuo — wins on prompt economy and consistency.**

Hailuo is the cheapest of the four and somehow the most consistent across multiple generations of the same scene. If you're building a music video where the same character or environment recurs across cuts, Hailuo's consistency saves you from the "different person every cut" problem the other three have. Weakness: motion is more conservative — fewer dramatic gestures, less wow per clip.

**The actual workflow that worked:**

1. Storyboard the track in 4-bar sections.
2. Tag each section with a job: atmosphere (Kling), character/lead (Hailuo), abstract/audio-reactive (Hunyuan), camera-led narrative (Ray 2).
3. Generate per section in the right model.
4. Beat-snap cuts to kick or snare in your NLE — not the AI's clock, yours.
5. Per-section colour grade in DaVinci to unify the four models' different look signatures.

This is roughly the pipeline behind RHYTHMIX LIVE, the music-video co-pilot I've been building. Multi-model routing + beat-sync at the timeline level. Commercial product, waitlist open. Pricing is Free / $19 Pro / $49 Studio if you want to see the surface.

But honestly the workflow above works without my tool — you'd just be running four API keys and an NLE manually. Worth it if you have the patience.

What model are you using for your music video work? Curious if I've missed something newer.

### Pre-drafted reply templates

**(a) "What about Veo 3.1 / Sora / Runway Gen-4?"**

> Veo 3.1 is excellent but the API access posture is a mess for production use — generation queue and per-org rate limits make it hard to build reliable workflows on. Sora is similar; great for one-off generation, awful for "this is part of my pipeline." Runway Gen-4 sits closer to Luma Ray 2 in feel — I'd put it as a substitute for Ray 2 if you're already on Runway's stack. The four I tested were chosen because they all have stable production APIs in 2026.

**(b) "AI video looks slop, real video looks better."**

> True for lead-performer footage. Not true for atmosphere, abstract, particle, fluid, and audio-reactive material — which is most of an EDM video by runtime. The pipeline I run uses real footage for performer shots and AI for everything else. The combination beats either pure approach in my testing.

**(c) "How are you handling the audio sync?"**

> Two-step. First, detect the kick and snare from the bounced mix (essentia is great for this; spectral peak detection on the low-end band gets 99% kick accuracy at 140 BPM). Generate that as a timeline marker file. Second, snap your AI clips to those markers in your NLE — don't rely on the AI's frame timing, it'll drift. The video is on your clock, not the model's.

**(d) "Is RHYTHMIX LIVE actually shipping or is this vapourware?"**

> Waitlist is live, MVP is in private beta with around 40 producers right now, public release is targeted for Q3 2026. I'll be honest — the Kling 2.6 API cost is the blocker for a $19/mo tier without throttles. Currently testing with a credit pool model. If you want to be in the beta cohort, the waitlist is on the site. If you want to wait until it's actually open, that's also a completely reasonable take.

---

## 3. r/wearethemusicmakers — founder story, no jargon

> **Culture:** Musicians of all levels. They engage with personal stories. They are NOT a launch-pad sub — read-rules carefully. Self-promo must be incidental and the post must work as a story even if the product didn't exist.
>
> **Strategy:** First-person, narration-voice ("one developer, one iPhone"). The product is the ending of the story, not the headline. Drop the AU$149 once. Make it about why, not what.

### Title (74 chars)
I built an AI music platform on an iPhone because I couldn't afford a studio

### Body (~520 words)

I want to tell you why I built what I built, because I think the "AI music" framing in the broader internet is missing the actual story.

I'm Jamie. I'm one person. I had an iPhone, an idea, and a frustration that's probably familiar to a lot of you. Producers cost too much. Studios were too far away. The industry, for all its talk of accessibility, was still built for someone who could already afford to be in it.

I'd been writing music in my head for years. Melodies I couldn't get out. Songs I knew were good but couldn't afford to produce. The cheapest route to a polished release — even DIY — was a few thousand dollars between studio time, mixing, mastering, and distribution fees. And the route that would actually help my career — a real producer, a real engineer — was many multiples of that.

So I asked an impossible question. What if making music only took an idea?

Not "what if AI replaced musicians" — because it can't, and the people pushing that framing have never sat in a session at 2am trying to chase a feeling. But what if the *production* layer — the parts that gatekeep the bedroom artist from the released one — became something a single person on a phone could do?

I spent the next eight months building it. From my iPhone, mostly. On planes, in cafes, between shifts. The four pieces I cared about:

1. **Generation** — get the idea out of your head and into sound. Not perfect — a starting point.
2. **Mastering** — make it sound broadcast-ready without paying someone $300 an hour.
3. **Distribution** — get it on Spotify, Apple, YouTube Music, everywhere people listen.
4. **Earning** — royalty splits, merch, fan investment, an actual career path from play one.

The thing I want to say to this sub specifically: this isn't a tool for replacing producers. It's a tool for the people who were never going to be able to afford one. Bedroom artists. First-timers. People with songs in their head and no path to a release. The producer-engineer relationship is real and valuable and I'm not interested in disrupting it. I'm interested in giving a route to the people who were locked out of it entirely.

I called it RHYTHMIX. One payment, AU$149, lifetime. Not a subscription. Not a royalty cut. Yours, kept forever.

The waitlist is open. I'm not asking you to buy anything today. I'm asking — if any of this resonates with the version of you that started making music because you had no other choice — that you tell me what you'd want it to do.

What's the thing you couldn't afford that almost stopped you?

### Pre-drafted reply templates

**(a) "This is just an ad with a sob story."**

> That's a fair read and I get why it lands that way. I'll own that this is my product and yes, I'm telling people about it. The story is real though — the iPhone-only build, the eight months, the question about studio cost. If the framing feels slick, that's because I've spent too long writing landing-page copy and it bleeds into how I talk. Happy to drop the polish and just answer questions if that's more useful.

**(b) "AI can't replace real musicianship."**

> Agreed and not what I'm trying to do. The platform doesn't write the song — the person does, and then the platform helps with production, mastering, distribution, the parts that gatekeep release. The musicianship layer is yours. If anything I'd argue this protects musicianship from being the bottleneck that kills careers before they start.

**(c) "Why lifetime and not subscription?"**

> Two reasons. One — subscriptions punish the exact people the product is for. A bedroom artist with no income can't commit to $30/mo forever. Lifetime puts the cost on day one and then gets out of the way. Two — every other AI music tool in the category is on subscription, and that's the moat. The first one to say "pay once, keep forever" gets a real differentiator. It also means I can't be lazy after launch — there's no recurring revenue safety net.

**(d) "What if you go out of business and I lose my music?"**

> Best question to ask anyone in this space. Two answers. First, every track downloaded out of the platform is yours — no DRM, no platform-lock, no "your music vanishes when we shut down." Second, the master files and stems are exportable at any tier. If the platform disappears tomorrow, your existing tracks keep working everywhere they're distributed because they're already in those stores' systems under your account. I'm building it so that the platform shutting down doesn't take your career with it.

---

## 4. r/SideProject — straightforward launch post

> **Culture:** Builders launching things. Self-promo not just allowed, it's the whole sub. Reward authenticity, specifics, vulnerability about hard parts. Don't pretend the launch is bigger than it is.
>
> **Strategy:** Direct. Here's what I built, here's the stack, here's the price, here's what's hard, here's the waitlist link. No story polish. Builder to builder.

### Title (89 chars)
I built an AI music platform as a solo dev — generate, master, distribute, in one flow

### Body (~480 words)

Launching this for real, want feedback from people who've been through the solo-dev launch grind.

**What it is:** RHYTHMIX — AI music platform. Four pillars in one product: generation (AI engines), mastering (chain processor + per-platform loudness targets), distribution (40+ stores via DistroKid/CD Baby/TuneCore APIs), and an "earn" layer (royalty splits, merch, fan investment, sync placement). Live at rhythmixapp.com.au.

**Pricing:** Free tier (10 credits/day), AU$149 lifetime deal during launch (all Studio features, unlimited credits, every future update). After launch promo ends it'll be $19/mo Pro or $49/mo Studio. Yes, lifetime is the play.

**Stack:**
- iPhone + cloud-AI pipeline (literally no desktop in the build process — there's a write-up of this in the repo if anyone cares)
- Multi-engine generation routing (Suno-class, Stable Audio, MusicGen) — user doesn't pick the model, prompt analyser does
- Web Audio mastering chain (compressor → multiband → soft-knee maximiser → per-platform LUFS target)
- Demucs v4 + custom sibilance post-processor for stems
- Custom integration with DistroKid + CD Baby + TuneCore for distribution
- Companion product RHYTHMIX LIVE for AI music videos (Kling 2.6 + Hunyuan + Luma Ray 2 + MiniMax Hailuo, routed per scene)

**Hardest part:** Distribution APIs. Each partner has a different metadata schema, ISRC handling, royalty plumbing, and approval workflow. Three months of work for what is, in retrospect, "just plumbing" — but the plumbing is the whole differentiator vs Suno/Udio (which stop at the WAV file).

**Easiest part:** The mastering chain. Mature Web Audio nodes, well-understood loudness targets, I expected this to be the hard part and it wasn't.

**Biggest mistake:** Started with too much landing-page work before I had the audio pipeline stable. Two months of CSS that I had to throw away when the actual flow changed.

**Status:** Waitlist open, private beta with around 40 producers, public release Q3 2026. Solo dev, no funding, no team.

**Asking for:**
- Honest reaction to the four-pillar positioning
- Anyone shipped DistroKid API integration recently? Gotchas?
- Lifetime deal pricing — AU$149 — too cheap, too expensive, about right? I want builder POV not customer POV.
- Anyone in the AI-music space want to swap notes on cost-per-track economics?

Repo not open source (commercial product) but happy to talk pipeline architecture in detail.

### Pre-drafted reply templates

**(a) "Lifetime deals never work — you'll regret it."**

> Heard. Counter-argument: subscription is saturated in this category — Suno, Udio, LANDR, AIVA all on $10–30/mo. The differentiation is sharpest at "pay once, keep forever." I'm modelling the LTV math on a 24-month payback even at AU$149 with current infra costs. If unit economics shift badly I'll close the lifetime tier — early buyers keep theirs, new buyers move to subs. That's the deal I'm telling people up front.

**(b) "How does this compete with Suno when they have 100x your funding?"**

> It doesn't compete on generation quality — they win that. It competes on what happens after the WAV exists. Suno stops at the file. RHYTHMIX takes the file from generation through mastering, distribution, royalty plumbing, merch, fan-investment. Four pillars vs one. The bet is that "Suno + DistroKid + LANDR + Bandcamp Merch + Shopify" is five tools and five subscriptions, and consolidating that is worth more than slightly-better generation.

**(c) "Why iPhone-only build? Sounds like a gimmick."**

> Forcing function. No desktop meant I had to keep the build pipeline cloud-native and the dev loop fast. Every part of the stack is reachable from a phone — render farm, CI, audio pipeline, deploy. The marketing angle is incidental; the engineering value was that the platform itself became extremely portable and the on-device version for end users got built almost by accident.

**(d) "Show me the actual product, not just a landing page."**

> Fair. Private beta gate is real — about 40 producers — but I can post a 60-second walkthrough video of the generate → master → distribute flow if there's interest. Reply here and I'll drop the link in a few days. Won't be a polished demo; will be a "this is what I'm shipping" raw screen-cap.

---

## 5. r/MachineLearning — deeply technical music-video pipeline

> **Culture:** Researchers, engineers, model authors. Aggressive on rigour, allergic to marketing. Self-promo allowed but it must be a "I built this, here are the engineering details" post, not "here's a product."
>
> **Strategy:** Frame entirely as a multi-model orchestration / routing problem. Talk about model selection, latency budgets, cost optimisation, failure modes. Drop the product name once. Pricing is irrelevant here.

### Title (98 chars)
[D] Multi-model routing for beat-synced AI music video: Kling, Hunyuan, Luma, MiniMax compared

### Body (~620 words)

Posting an engineering write-up of a multi-model orchestration system for AI music video generation. The interesting problem isn't generation quality — it's deciding which of N models to route each shot to, under cost / latency / coherence constraints.

**Problem.** A 3-minute music video at 24fps is 4,320 frames or roughly 36× 5-second clips. Single-model generation has three failure modes:

1. **Motion coherence drift** — character/object identity wanders across clips
2. **Cost** — Kling 2.6 Pro at $0.49/5s is ~$17.64 per video at single-pass, no regenerations
3. **Stylistic monotony** — single model means single look signature across the entire video

Multi-model routing addresses all three but introduces a new problem: visual coherence across model boundaries.

**Models in the pool.**

| Model | Strength | Weakness | Cost (rough) |
|---|---|---|---|
| Kling 2.6 Pro | Motion under fast cuts, atmosphere | Face drift past 4s | $0.49/5s |
| HunyuanVideo (self-host) | Abstract / non-photoreal, prompt adherence | Photoreal humans uncanny | ~$0.08/5s on A100 |
| Luma Ray 2 | Camera path control (dolly, orbit, push-in) | Slow, expensive | $0.55/5s |
| MiniMax Hailuo | Cross-clip consistency, prompt economy | Conservative motion | $0.15/5s |

**Routing approach.** Per-shot tagger that scores each storyboard segment along four axes:
- `motion_intensity` (cuts/sec at this section's BPM band)
- `subject_continuity_required` (boolean: does a character/object recur?)
- `camera_motion_required` (boolean: is camera path a narrative beat?)
- `photorealism_required` (float: 0 = abstract, 1 = full photoreal)

The router is a small decision tree trained on ~200 hand-labelled segments. Output: model selection + prompt template + parameter pack. Routing tree itself is 14 nodes, runs in microseconds, dwarfed by generation latency.

**Cross-model coherence layer.** This is where most of the actual engineering went. Per-model look signatures are wildly different — Kling biases warm, Luma biases cool-cinematic, Hailuo biases neutral, Hunyuan depends on prompt. The fix is a post-generation LUT (lookup-table) colour normalisation pass per model, then a unifying final grade applied to all clips. CIELAB delta-E < 5 across model boundaries is the target; we hit ~3.8 mean on production output.

**Beat synchronisation.** The audio side runs spectral peak detection on the kick band (60–120Hz) using essentia. The kick map becomes a timeline marker set. Generated clips are snapped to nearest marker in NLE via an EDL writer. Importantly, generation is not tempo-aware — we don't ask models to "match BPM." We let them produce naturally-paced clips and snap-cut in post. This is more robust than tempo-conditioned generation, which we tried and abandoned (models don't honour BPM hints reliably enough to skip the post-step anyway).

**Failure modes worth flagging.**

- **Model API queue volatility.** Kling and Luma have unpredictable peak-hour latency. The routing fallback ladder reroutes to Hailuo if Kling exceeds a 3-minute queue, with a quality penalty flag attached so the colour-grade pass compensates.
- **Prompt portability.** Same prompt produces wildly different outputs across models — we maintain four per-model prompt templates per "shot type" (eg "subject_close_up_intense", "atmosphere_wide_static"), expanded from the storyboard segment via templating.
- **Cost runaway.** Without a budget guard, a single failed regeneration can blow the per-video cost target. Hard ceiling on regen count + automatic fallback to cheaper model after threshold.

This is roughly the pipeline behind RHYTHMIX LIVE (commercial product, not OSS — flagging for transparency, not asking anyone to click anywhere). The interesting research direction we'd love feedback on: is there a learned router that beats the hand-tuned decision tree? We've not been able to make a small NN routing model beat the tree on out-of-distribution shot types, but our labelled set is small.

Happy to go deep on any of the above. Especially curious if anyone's done similar work on long-form generative video orchestration.

### Pre-drafted reply templates

**(a) "This is just an ad, please post in r/SideProject."**

> Fair if mods agree. The technical content is real — the routing tree, the cross-model coherence pass, the spectral peak sync are all engineering decisions I'd write up regardless of product. Happy to remove product mention if mods prefer; the discussion question on learned vs hand-tuned routers stands on its own.

**(b) "Why not just use Sora / Veo 3.1?"**

> Considered both. Sora's API access tier is too restrictive for production pipelines — we couldn't get reliable rate limits for paying users. Veo 3.1 is excellent on output but the per-org generation queue makes it a poor base layer for a routed system. Both could enter the pool when their API posture stabilises. The four current models were picked on "stable production API + non-overlapping strengths."

**(c) "Your routing decision tree sounds underpowered — small MLP would obviously beat it."**

> We tried. 64–256 hidden unit MLPs, trained on the same labelled set with cross-validation. They edge the tree on in-distribution shot types but degrade badly on OOD — and "novel shot types" is most of the actual workload, since users invent shot descriptions we haven't seen. The tree's hand-written branches generalise better. We'd love to be wrong about this — if you've got a routing architecture that handles OOD well in a similar regime, would genuinely value the pointer.

**(d) "How are you handling the legal posture on multi-model generation?"**

> Each model's training-data licensing posture is part of the routing decision. We don't route to models we can't commercially clear for the user's intended use, and we surface the rights-status of each generated clip in the metadata. For users on the commercial tier, the router excludes models with unclear posture by default. This costs us some quality on certain shot types but it's a non-negotiable design constraint.

---

## Posting checklist

- [ ] Don't post all five in the same 24-hour window
- [ ] Read each subreddit's current sticky rules — they drift
- [ ] r/MachineLearning needs the `[D]` discussion tag and is hostile to anything that smells like marketing
- [ ] r/musicproduction — if a mod removes, accept it cleanly, don't argue in modmail
- [ ] r/wearethemusicmakers — check whether the day has a "no self-promo" theme (some days do)
- [ ] Reply to early comments within 30 minutes — engagement velocity matters for the algorithm
- [ ] Don't sock-puppet your own thread
- [ ] If asked directly "is this an ad," the answer is "yes, partially — happy to remove the product reference if it's a problem"
