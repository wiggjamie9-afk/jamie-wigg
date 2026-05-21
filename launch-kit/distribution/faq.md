# RHYTHMIX — Frequently Asked Questions

> Launch-ready FAQ for `rhythmixapp.com.au`. 25 questions across 6 categories. Honest, no marketing fluff. Acknowledges limitations.

---

## Pricing & purchase

### 1. Why lifetime, not subscription?

Because the *product* — the studio interface, the beat-sync cutter, the mood-lock grading, the shot libraries, the brief generator — has no marginal cost per video you make. It's software. So we charge for software the way software used to be charged for: once, with free updates forever.

What *does* cost money per render is the AI inference itself — Kling, Hunyuan, Luma and MiniMax all bill per second of generated footage. We handle that with bundled credits at purchase and at-cost top-ups after. We make our money on the product, not on inference. That's why we can sell it once and not need you back every month.

### 2. Is AU$149 really forever?

For you, yes. The AU$149 you pay today buys lifetime access to the studio and every feature update we ship — new models, new shot libraries, new genre packs, all included on your account.

Two honest caveats. **First**, the price for *new buyers* will go up — founding members are locked in at the floor, but later cohorts will pay more. **Second**, "forever" assumes RHYTHMIX continues operating (see Q3). The AU$149 is a one-time payment with no renewal, no per-render fees on the product itself, and no escalator clauses. The only thing you'll ever pay again is generation credits if you exceed your bundled balance — and those are sold at our wholesale cost.

### 3. What happens if RHYTHMIX shuts down?

Realistic answer: it's a small indie product, and indie products carry shutdown risk. So here's the commitment.

If RHYTHMIX ever shuts down, every lifetime member gets a final 30-day export window — bulk download all your rendered videos, your project files, your brief pages, and your remaining credit balance refunded pro rata. Your music and your renders stay yours unconditionally; the platform-side artefacts (shot history, project metadata) come with you.

We won't promise the studio runs forever in a vacuum, because no one can honestly promise that. We will promise that you walk away owning everything you've made and nothing you've made gets held hostage to a shutdown.

### 4. Refunds?

14 days, no questions asked. Email `wiggjamie9@gmail.com` with your purchase receipt and we'll refund the AU$149 in full, minus any generation credits you've already consumed (those are paid upstream to the model providers the moment you render and we can't claw them back).

After 14 days, refunds are at my discretion — write to me and we'll work it out. I've never refused a reasonable request, but I'm also a one-person shop and can't promise the same response time as a billion-dollar SaaS.

### 5. Can I gift it?

Yes. At checkout, enter the recipient's email instead of yours and tick "this is a gift" — Gumroad sends them the activation link directly with a short note from you. Their account, their credits, their renders. You don't need to share any login.

If you want to gift to multiple people (a team, a label roster, a class), email me before purchase and we'll do bulk pricing rather than buying one-at-a-time.

---

## What it does

### 6. Does RHYTHMIX make my music for me?

Today, no — and I want to be straight about this. **You bring the MP3.** RHYTHMIX turns your finished track into a cinematic AI music video. The four engines (Kling, Hunyuan, Luma, MiniMax) generate *visuals*, not audio.

The Generate pillar on our positioning materials refers to a roadmap goal of full text-to-song generation inside the platform, and that work is in progress with limited beta access for founding members. At launch, the shipping product is **MP3 in → AI music video out**. If you don't have a track, we recommend pairing RHYTHMIX with Suno or Udio for the song itself, then bringing the export to us for the video.

### 7. How is the audio quality?

Same as whatever you upload — RHYTHMIX doesn't transcode your master. Drop in a 320 kbps MP3 or a 24-bit WAV and that's exactly what comes back inside the rendered MP4. We apply no compression, no EQ, no limiting, no "mastering" on top.

The video container we render to is H.264 + AAC at 320 kbps, 1080p (vertical 1080×1920 or landscape 1920×1080). If you need a higher bitrate audio track for distribution to Spotify or Apple Music, master and distribute the audio separately — RHYTHMIX is a video tool, not a mastering tool. Bring your already-mastered file.

### 8. What genres does it support?

The shot libraries cover 16 genres: electronic, hip-hop, indie rock, ambient, folk, jazz, classical, lo-fi, trap, house, drum-and-bass, country, pop, R&B, metal, and experimental. Each library has 25+ pre-tested shot prompts curated for that genre's visual vocabulary.

Realistically, the strongest output is on genres with clear beat structure (electronic, hip-hop, house, trap) because the beat-sync cutter has more to work with. Ambient, classical, and folk render beautifully too but lean on the mood-lock grading more than transient cuts. Spoken word, podcast, comedy, and field-recording content is not a fit — there's no musical structure for the cutter to lock to.

### 9. How fast does generation actually run?

A typical 3-minute track renders in about 45 minutes, upload to download. That includes waveform analysis (~30 seconds), shot dispatch across the four model APIs (the bulk — 30-40 minutes), the transient cut and colour grade (~2 minutes), and the final encode (~1 minute).

Two honest notes. **First**, that's a wall-clock estimate assuming the upstream model APIs are healthy. When Kling or Hunyuan get hammered (new model launches, peak hours), individual shots can stall and your render queues behind them — worst-case I've seen is ~90 minutes. **Second**, longer tracks scale roughly linearly: a 6-minute track is about 90 minutes; a 60-second teaser cut is about 12 minutes.

### 10. Can I edit / re-prompt mid-generation?

Not mid-generation — once you hit Render, the whole pipeline runs to completion (cancelling mid-render still consumes credits for shots already dispatched). But you can re-render with overrides as many times as your credits allow.

The override layer lets you swap individual shots after the first render: open the project, scrub to a shot you don't like, pick a different one from the shot library or write a custom prompt, and re-render just that shot — credits are billed only for the replaced section, not the whole video. So the workflow is "render → review → spot-fix" rather than "edit during render". It's not a real-time timeline like RunwayML; it's closer to how you'd direct a music video shoot — brief, shoot, then pick up the shots that didn't land.

---

## Technical

### 11. What AI models does it use?

Four frontier video models, each chosen for a different visual personality:

- **Kling** — cinematic, photoreal scenes; the closest a generation model gets to a Steadicam tracking shot.
- **Hunyuan** — motion-rich, realistic action; handles dancers, crowds, sport.
- **Luma Dream Machine** — surreal, dreamlike sequences; ambient and lo-fi territory.
- **MiniMax** — character-driven shots, lip-synced talking heads, performance close-ups.

We call them via their official APIs (Replicate for Kling/Hunyuan/MiniMax, Luma's direct API for Dream Machine). When new frontier models ship — Sora when it opens, Kling 3, Veo 3.1 — they get added to the studio and made available to lifetime members at no extra product cost. You only pay the inference cost of the new model when you use it.

### 12. Where does the AI training data come from? (be honest)

Honest answer: we don't train the models. We're a downstream consumer of four third-party model providers (Kuaishou for Kling, Tencent for Hunyuan, Luma Labs for Dream Machine, MiniMax for theirs) and each of them has their own training-data posture and disclosures.

Our read on it as of 2026-05: none of the four providers publish a fully itemised training corpus. All four claim a mix of licensed datasets, public web crawl, and synthetic data; all four have faced or are facing copyright scrutiny in different jurisdictions. We do not have inspection rights into their training data, and neither does any other downstream tool. If model-provenance is a hard requirement for your release (a label legal review, a sync placement, a brand campaign), build extra due-diligence into your workflow — don't take any AI video tool's word for it, ours included.

### 13. Is my work licensed to be used commercially?

Yes — the videos you render with RHYTHMIX are yours to use commercially without further licensing from us. No royalty share, no per-stream fee, no "we keep a slice if you go viral" clause. That's the whole point of the lifetime model.

The honest caveat is downstream: the four upstream video models each have their own commercial-use terms that we pass through to you. As of launch, Kling, Hunyuan and MiniMax allow commercial use of rendered output via their APIs; Luma allows commercial use on its paid tier (which we're on). If any of them changes terms, we'll surface it in the studio and roll forward — you won't be retroactively locked out of work you've already rendered.

### 14. Do I retain copyright?

You retain copyright on your music — that was yours before you uploaded it and nothing about using RHYTHMIX changes that.

On the rendered video itself, copyright in AI-generated visual output is legally unsettled in most jurisdictions (the US Copyright Office position as of 2025 is that purely AI-generated frames aren't copyrightable on their own, though the *arrangement* and your *creative direction* can be). What this means practically: you own and control the rendered MP4 as a finished work, you can post it, monetise it, sell it, license it for sync — but if you tried to sue someone for copying the AI-generated frames pixel-for-pixel, the legal ground is shaky. Treat it the same way you'd treat any AI-assisted creative work in 2026.

### 15. Is there an API?

Not at launch. The current shipping product is a web studio — you open it in a browser, drop in your MP3, render, download. There's no public REST endpoint, no webhook, no programmatic dispatch.

An API is on the roadmap and lifetime members will get access at no extra product cost when it ships — paying only inference credits for whatever they render through it. Realistic ETA: late 2026, gated on stability of upstream model APIs (which still change shapes frequently). If you need batch automation today, the workaround is the parallel render queue inside the studio (5 videos at once) plus the Bring-Your-Own-API-Key option for power users who want to dispatch model calls on their own accounts.

---

## Distribution & earnings

### 16. What platforms does it distribute to?

**Honest answer**: today, RHYTHMIX renders the video — distribution to streaming, social and sync libraries is on the roadmap, not at launch. You currently download the finished MP4 from your studio and upload it to wherever you want (YouTube, TikTok, Reels, Spotify Canvas, your own site).

The Distribute pillar in our competitive positioning refers to the planned integration with 40+ platforms (Spotify, Apple Music, YouTube Music, TikTok, Reels, Triller, Audius, the long tail) via partner distribution providers — that work is in progress with the goal of one-click release-from-render. Lifetime members get it free when it ships. If you need distribution today, pair RHYTHMIX with DistroKid, TuneCore, or LANDR Distribution for the audio side and YouTube/TikTok native upload for the video side.

### 17. Do you take a royalty cut?

**No. Zero.** Whatever you earn from streams, syncs, ad revenue, sync placements, NFT mints, or merch sales on a video rendered with RHYTHMIX — you keep all of it. We do not register a publishing claim, we do not insert a co-write, we do not take a percentage of streaming revenue, we do not take a backend on sync placements.

This is a deliberate counter-position to platforms like Boomy that take 20–80% of streaming income depending on tier, or any platform with "rev-share" buried in the terms. The deal is simple: you paid AU$149 once, and that's the entire economic relationship. The music and the video are yours, and the income from them is yours.

### 18. How do I get paid?

For streaming and sync royalties — through your distributor, not us. RHYTHMIX doesn't sit in your royalty pipeline at all. When you release a track to Spotify via DistroKid (or whoever), Spotify pays DistroKid pays you on whatever payout schedule you've set up. We are entirely off-platform from that flow.

For sync placements, merch sales, fan-funded releases, and NFT/royalty-token economics — those are platform integrations on the roadmap as part of the Earn pillar. None of them are billing through RHYTHMIX today. When they ship, the principle stays the same: we charge you AU$149 once for the platform; we don't take a slice of what you earn through it.

### 19. What's the rev share with the AI model providers?

Zero on revenue. The four upstream model providers (Kuaishou, Tencent, Luma Labs, MiniMax) charge per second of generated footage at the API level — that's the inference cost that flows through to your credit balance. None of them have a downstream claim on streaming royalties, sync income, or any other money you make from the rendered video.

What you pay them is metered, transparent, and capped at the credits you choose to consume. We pass their published API rates through at our wholesale cost when you top up credits. No upcharge from us on inference, no skim from them on your revenue.

### 20. Can I monetize on TikTok / Reels?

Yes. Videos rendered with RHYTHMIX are commercial-use cleared on the video side (see Q13) and you retain rights to your music (Q14), so you can monetise via TikTok Creator Rewards, Reels Play, YouTube Shorts monetisation, and any equivalent programme.

Two practical notes. **First**, TikTok and Reels both run their own AI-content detection — videos that look entirely AI-generated have historically been deprioritised in the algorithm on TikTok in particular (Reels less so). The mood-lock and beat-sync make RHYTHMIX output read as "intentionally composed" rather than "raw AI output", which seems to help, but we can't promise an algorithmic outcome. **Second**, if you're using a sample-cleared or label-controlled track, the platform's existing music-ID systems still apply on the audio side regardless of how the video was made.

---

## Comparison

### 21. Is this just Suno + LANDR + DistroKid in one?

In ambition, kind of — the long-term thesis is a four-pillar platform (Generate, Master, Distribute, Earn) that collapses what Suno, LANDR, DistroKid, and the merch/royalty layer all do separately into one purchase. That's the moat we're building toward.

**In what ships today**, no — RHYTHMIX is the music-*video* layer for tracks you've made elsewhere. Generate is roadmap (Q6), Master we don't do at all (Q7), Distribute is roadmap (Q16). What's live and working is the four-engine, beat-synced, mood-locked AI music video studio. If you're comparing tools today, the most accurate frame is "RHYTHMIX vs RunwayML / Pika / Sora for music video specifically" — not the full Suno/LANDR/DistroKid stack. The platform vision is where we're going, not where we are.

### 22. Why should I use this instead of [competitor]?

Honest, competitor by competitor:

- **vs RunwayML / Pika**: they give you a timeline and one model; you bring the editing eye. RHYTHMIX gives you four models under one beat-synced cut, no timeline, no editing. Faster for music video, weaker for everything else.
- **vs Suno**: Suno makes the song; we don't (yet). If your bottleneck is "I have no track", use Suno. If your bottleneck is "I have a track but no video budget", use RHYTHMIX.
- **vs hiring a director**: a director knows your story arc and your band; we don't. If your label can afford one, hire one. We're for the 99% of artists who can't.
- **vs $10/mo tools forever**: AU$149 once. Five-year TCO comparison is in the marketing copy and it's real — at AU$15/month, you'd pay AU$900 over five years for tools that mostly do less.

If none of those frames fit your situation, the honest answer is probably "don't buy RHYTHMIX yet" — wait until the pillars you actually need are live.

### 23. Do I need to know production?

No. The whole product is built around the assumption that you don't. Drop your MP3, hit Render, come back in 45 minutes. No DaVinci, no After Effects, no plug-ins, no timeline, no keyframes, no colour wheel.

If you *do* know production, you'll get more out of it — the shot override layer lets you direct specific shots, the mood-lock can be biased toward a reference palette, the BYO-API-key option lets you bring your own model accounts. But none of that is required. The default path (Auto shot library, default mood lock, render) is built for someone who has never opened a video editor in their life.

---

## Support & access

### 24. What if I get stuck?

Email me directly: `wiggjamie9@gmail.com`. Every lifetime member's email gets read by me personally and answered within 48 hours, usually faster. I'm a one-person team at launch, so there's no support tier above me and no support tier below — it's just me.

For self-serve, the studio has an in-app help panel with the 20 most common workflows (first render, swap a shot, change a colour grade, troubleshoot a stalled render, top up credits). The roadmap includes video tutorials, a written knowledge base, and a Discord — none of those are at full coverage at launch, but they'll grow as the member base grows. If your question is urgent and you've not heard back in 48 hours, send a second email — sometimes Gmail eats the first one.

### 25. Is there a community?

A founding-members Discord opens on launch week. Invite link comes in your delivery email alongside the studio link. It's a small, signal-heavy room — show-and-tell of renders, requests for shot prompts that worked, model-update news, and a `#feature-requests` channel I read every day.

Honest expectation-setting: this is launch — the community is small (single-digit hundreds at launch, growing from there) and there's no full-time community manager. Compared to Suno's Discord or LANDR's forums, you'll find more direct access to me and to other founding members, less depth of historical threads. If a busy community matters to you, it will be there in six months; if direct access to the builder matters to you, it's there from day one.
