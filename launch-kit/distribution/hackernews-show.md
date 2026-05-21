# Show HN: RHYTHMIX – one-person AI music platform that generates, masters, distributes and pays out

## Title variants

- **Primary:** `Show HN: RHYTHMIX – one-person AI music platform that generates, masters, distributes and pays out`
- Alt A: `Show HN: RHYTHMIX – I wired four AI music tools into one pipeline so one developer ships a song`
- Alt B: `Show HN: RHYTHMIX – AU$149 lifetime AI music stack (Generate → Master → Distribute → Earn)`

Recommended: Primary. 12 words, factual, names the four-stage scope without adjectives. No "AI-powered", no "revolutionary".

---

## Body (target ~550 words)

I'm Jamie. I built RHYTHMIX solo on an iPhone over roughly a year. It's an AI music platform that takes a text idea, generates a track, masters it, ships it to ~40 streaming stores, and routes royalties + merch + an artist-identity model back to the creator. Generate, master, distribute, earn — four stages, one account, one payment.

The interesting part for HN is the pipeline plumbing, not the marketing. RHYTHMIX is a router over specialised models, not a single in-house foundation model:

- **Generation** routes between Suno-v5-class (vocal coherence), Udio-class (instrumental fidelity / inpainting), Stable Audio (sound design, looped stems), and AIVA (long-form / score) depending on prompt classification. Stem-split + section-edit are done on the routed output, not re-trained.
- **Mastering** is a LANDR-class pipeline running on the rendered WAV with a target-LUFS step keyed to the destination platform.
- **Distribution** is a single API surface in front of the standard aggregator endpoints. Track is fingerprinted before submission to keep takedown noise low.
- **Music video** (RHYTHMIX LIVE add-on) chains **Kling 2.6** for shot generation, **Hunyuan Video** for motion continuity, **Luma** for cinematic camera moves, and **MiniMax** for the lip-sync pass — beat-aligned via the track's onset envelope. The whole 60s clip is a CSS-keyframe HyperFrames composition that's then baked to MP4 on-device so the render is deterministic and reviewable as HTML before it touches a GPU.
- **Earn** is the bit that took longest: royalty splits, merch print-on-demand, optional fan-investment / royalty-token rails, and a per-artist "Artist DNA" embedding the user keeps even if they cancel.

Two sibling products share infrastructure: **RESONATE** does an on-device biometric closed-loop (HRV + EEG headband if present, otherwise camera-PPG fallback) that biases a Lyria-RealTime-style generator in ~2s windows. **HUM** measures HRV through the phone camera (rPPG over the fingertip) to score a daily humming-practice session against vagal-tone deltas. Both are in the same monorepo as RHYTHMIX and share the audio render path.

**What's not solved yet, honestly:**

- The Generate router's classifier is hand-tuned heuristics, not a learned policy. It picks the wrong engine maybe ~12% of the time on vocal-led prompts. Working on a small fine-tune.
- Commercial rights posture inherits from the upstream engines. Suno/Udio licensing is still messy in some territories; I pass through their terms and disclose the engine used per render.
- Kling 2.6 inference is currently the cost ceiling. Music video generation is gated behind the Pro tier purely because of API economics, not feature withholding.
- HRV-via-camera (HUM) is reliable in good light at rest; noisy on dark skin tones at low light. I'm collecting opt-in data to retrain the SpO2/HR demodulator.

**Why AU$149 lifetime, not subscription:** I've watched the same creator pay Suno $30/mo + LANDR $25/mo + a distributor + a merch SaaS for years and never own anything when they stop. Subscriptions made sense when the unit cost was a human engineer's salary. The unit cost here is inference + storage + a small distribution fee; it's a one-time integration job per user, not a recurring service. So I priced it like the integration it is. Lifetime forces me to keep the cost-per-user down, which keeps the architecture honest.

**Built by one person.** No co-founders, no team, no VC. Australian solo dev. The site, the renders, the pipeline orchestration, the landing pages, the brand work — all in this repo, all reviewable.

**Open question for HN:** for the Generate-engine router, is there prior art on learned model-selection policies for creative-generation pipelines that I should be reading? Most of what I've found is either bandit-style for LLM cost/quality tradeoffs (Martian, RouteLLM) or quality-only for image gen. I haven't seen anyone treat "which upstream creative model fits this prompt" as a classification problem with a reward signal that includes downstream user-edit count. Pointers welcome.

rhythmixapp.com.au

---

## Prepped reply templates (10)

These are drafted to be deployed as-is or with light edits. Tone matches the body: factual, no marketing, willing to concede points.

### 1. "This is just Suno with a marketing site."

> Fair challenge. Generation is one of four stages and RHYTHMIX routes between Suno-class, Udio-class, Stable Audio and AIVA depending on prompt — so it's a superset of Suno on the Generate side, not a wrapper. The actual product surface is what happens after the WAV exists: mastering target-LUFS per platform, distribution to ~40 stores, royalty splits, merch, and the Artist DNA embedding. Suno stops at the file. Worth a fair comparison: Suno Premier 5-year TCO is ~US$1,800 for one stage; RHYTHMIX is AU$149 once for all four. I'd be wrong to claim Suno doesn't do generation better in some cases — it does. The pitch isn't "better generator", it's "you don't have to leave the platform to release."

### 2. "Is the AI training data licensed?"

> Honest answer: RHYTHMIX itself doesn't train a foundation generator. It's a router over third-party engines (Suno, Udio, Stable Audio, AIVA, Kling, Hunyuan, Luma, MiniMax). Per-render the user sees which upstream engine produced the output and inherits that engine's commercial-rights posture. So "is it licensed?" reduces to "is the engine that generated this track licensed?" — and that varies. Suno and Stable Audio have public licensing positions; Udio's RIAA suit settled in some territories and not others. I pass through their terms and surface the engine on each render so the user can decide. I don't make a clean-rights claim I can't defend.

### 3. "Why not open source?"

> Two reasons, neither of them ideological. (1) Most of the value is the orchestration over commercial APIs whose terms forbid resale of bare access — open-sourcing the router would just be a key-exfil tool. (2) The mastering chain and the Artist DNA embedding are the bits I'd want to OSS first, and I haven't yet because they're entangled with the distribution-aggregator contracts. I'm planning to open-source the HyperFrames composition layer (the CSS-keyframe-to-MP4 deterministic render pipeline) separately — that one has no licensing entanglement and is genuinely useful on its own.

### 4. "$149 lifetime is a red flag — you'll run out of money and disappear."

> Reasonable scepticism. The honest version: lifetime works if the unit cost per user stays below the LTV from the lifetime fee plus the distribution + merch margin (which is recurring even on a lifetime account). Inference is the variable cost; I cap free-tier generation credits and Studio-tier features (the Kling 2.6 music video) gate behind a separate per-render meter. If inference cost spikes I can adjust the meter without revoking the lifetime grant. If I disappear, the Artist DNA model is exported by the user and the released tracks live at the streaming stores independent of RHYTHMIX — the user doesn't lose their catalogue. I'd be a hypocrite to claim zero risk; the risk is real, and I priced it knowing that.

### 5. "Suno/Udio masters are already good enough — why master at all?"

> Sometimes they are. Often they aren't, especially on long-form or instrumental output, and almost never at the per-platform LUFS targets (Spotify -14, YouTube -14, Apple Music -16, TikTok -19 reference). The mastering stage isn't trying to out-mix a human engineer; it's hitting the target curve and avoiding the limiter pumping you get when you upload a raw generator output. If you're A/B-ing two RHYTHMIX renders — one mastered, one not — and you genuinely can't tell, then the stage didn't earn its keep on that track. That's fine. It earns its keep more on dense / loud / vocal-heavy material.

### 6. "Distribution to 40 platforms is just a DistroKid wrapper."

> Partly true. The aggregator integrations sit behind a single API surface and yes, the underlying rails are the standard ones (the same ones DistroKid / TuneCore / CD Baby use). The differentiator isn't novel rails; it's that the rights metadata, ISRC assignment, and royalty-split metadata come out of the generation step and the artist profile, not a separate manual entry. The user doesn't fill in a form per release. That's a workflow win, not a technical one — happy to call it that.

### 7. "How does the biometric closed loop in RESONATE actually work?"

> Sampling loop runs at ~4Hz on-device. HRV from PPG (camera or watch), optional EEG band power if a Muse or similar is paired. Features go into a small bias vector that perturbs a Lyria-RealTime-style generator's prompt embedding every ~2s window — not a re-prompt, just a delta on the conditioning. The closed loop is: biometric → bias → generated audio → user's nervous system response → next biometric reading. No claim that it "heals" anything; it's a feedback toy with measurable HRV deltas in controlled testing. Will publish the dataset when the n is bigger than embarrassing.

### 8. "Kling 2.6 + Hunyuan + Luma + MiniMax for one music video sounds expensive and slow."

> Both. A 60s music video render is ~12-18 minutes wall time and ~$3-6 in inference depending on shot count and lip-sync seconds. That's why it's behind the Studio tier with a per-render meter rather than unlimited. The reason it's four models stacked is each one is best at exactly one job (shot generation / motion continuity / camera moves / lip-sync) and stacking them is cheaper than fine-tuning one model to do all four worse. If a single open-weights model lands that does all four credibly I'll collapse the stack the same day.

### 9. "rPPG (HRV from phone camera) doesn't work."

> It works on healthy adults in stable light at rest, against a clinical reference, with RMSE on HRV in the 8-15ms range depending on conditions. It does not work well during exercise, in low light, or on dark skin tones at low light — that last one is a documented bias in the underlying CHROM/POS demodulators and I haven't solved it. HUM uses rPPG only for the at-rest humming-practice session (controlled conditions), not for continuous tracking, which is the regime where the literature actually supports the technique. Surfaced as a known limitation in the app.

### 10. "Why iPhone-only / why solo / why Australia?"

> iPhone-only because the entire pipeline was authored and rendered on an iPhone — I don't own a desktop. That constraint forced the architecture to be cloud-orchestrated with HTML-composition-as-source-of-truth, which turned out to be the right call regardless. Solo because I couldn't find a co-founder who'd take the lifetime-pricing bet seriously, and at this scale the orchestration is one person's job. Australia because that's where I live; the AU$149 price reflects the AU GST-inclusive listing — it's roughly US$98 at current rates, which I'd just round to US$99 for the US listing. No deeper geographic strategy than that.

---

## Posting metadata

- **Window:** Tuesday 9:15am ET (historically strongest Show HN slot for solo-dev product launches).
- **First-comment seed:** Drop the "Open question for HN" as a top-level comment from the same account ~5 minutes after posting to anchor the thread on a technical discussion rather than pricing.
- **Do not:** post the AU$149 line in the title. Pricing in the title triggers the "this is an ad" reflex. Keep price in the body, third paragraph from the bottom.
- **Watch for:** dang's typical Show-HN URL-edit if the title drifts toward marketing language. Primary title above is conservative enough to survive.
