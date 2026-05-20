# Voice AI for script-to-MP3 narration — mid-2026 landscape

> Companion to `03-voice-ai-ambient-capture.md` (real-time conversational voice).
> This dossier covers BATCH TTS for script-to-MP3 narration workflow — paste text, get an MP3, drop it onto silent video clips via the `bake.sh` flow in `launch-kit/<app>/clips-60s/<name>/`.

## Executive recommendation

**Primary:** Stay on **ElevenLabs** but use the official **iOS app + Studio** flow (not the web). Multilingual v3 + Charlotte / Emma / Adam / Alice still owns the contemplative-narration top of the market in May 2026, and it's the only major provider whose mobile app does the whole *paste → generate → MP3 download* loop in under 60 seconds with no desktop step.

**Backup (if EL gets too expensive at scale):** **Hume Octave 2** (launched Oct 2025 at half Octave 1's price, ~$7.60 per 1M characters, 15-second voice cloning, 11 languages, the only TTS that *understands* the script's emotional arc rather than just reading characters). Strongest contemplative-brand fit after ElevenLabs and 4-5× cheaper at scale.

**Free fallback (in your pocket already):** **Apple Personal Voice on iOS 26** — now only needs 10 phrases (down from 150) and runs on-device. Free, private, surprisingly good in 2026. Tradeoff: no direct MP3 export, only AAC via screen-record or AVSpeechSynthesizer-to-file workarounds.

Buy nothing this month. Use the existing ElevenLabs account, ship the 8 clips, and revisit Hume in Q3 if character-budget gets tight.

---

## 1. Big TTS providers — what's actually shipping mid-2026

| Provider | Voice quality | Voice cloning | Entry cost (USD/mo) | At scale | iOS app | Mid-2026 update |
|---|---|---|---|---|---|---|
| **ElevenLabs** | 5/5 (89.6% naturalness in independent tests, 2.83% WER on clones) | Instant (5 min) + Pro (30 min) | Free 10K chars; **Starter $5** (commercial); Creator $22 | ~$0.15/min on Creator credits | **Yes** — ElevenReader + unified app shipped April 2026 | Voice Design v3 (Feb 2026) — prompt-described voices, audio tags, 68% error reduction; ElevenMusic on iOS Apr 2026 |
| **OpenAI `gpt-4o-mini-tts`** | 4/5 | No native cloning (only voice steering) | API-only — **~$0.015/min** ($0.60/M text-in, $12/M audio-out) | Cheapest mainstream TTS in the world | No first-party app — runs in any LLM client that supports it | "Instructable" voice steering since Mar 2025, 13 voices, 50+ languages |
| **Google Cloud TTS** | 4/5 Chirp 3 HD, 4.5/5 Studio | No consumer cloning | API only | **Chirp 3 HD $30/M chars**, **Studio $160/M chars** | No first-party narration app | Chirp 3 HD adds disfluencies + emotional range; 1M chars/mo free tier |
| **Azure AI Speech** | 4/5 | Custom Neural Voice (enterprise) + Personal Voice (gated) | API only | Neural HD dropped Mar 2026: **$22/M chars** (was $30); CNV $24/M synthesis + $52/compute-hr training + $4.04/endpoint-hr | No | Personal Voice is approval-gated and $600/1K profiles/mo — heavy commercial use only |
| **Amazon Polly** | 3.5/5 standard, 4/5 generative | No | API only | Neural $16/M; **Generative $30/M**; **Long-form $100/M** | No | Generative voices remain the headline; 500K chars/mo free tier first 12 months |
| **IBM Watson TTS** | 3/5 | Custom branded neural voice (1 hr of recordings) | Lite tier free | Container licensing for partners now | No | Quietly alive but not where the energy is. Skip. |

**Winner:** ElevenLabs (only one with a serious iOS app + a contemplative-grade voice library). **Loser:** IBM Watson. **Emerging:** OpenAI's gpt-4o-mini-tts is 10× cheaper than EL and quality gap on neutral narration is shrinking — but no consumer iPhone app uses it well yet, and no voice cloning.

## 2. Premium / contemplative specialists

The most relevant category for FREQUENCY-brand work.

- **Hume Octave 2** — **the most interesting pick after ElevenLabs.** Launched **Oct 1, 2025**, half the price of Octave 1, **$7.60 per 1M characters**, sub-200ms latency, 11 languages, **15-second voice cloning**, phoneme-level editing, and crucially — Octave is the *only* TTS that understands semantics (it knows when to whisper vs. shout from the script alone, no markup needed). For meditation/breath-paced content this is a serious match. Web-based — no native iOS app, but the studio works in Safari on iPhone.
- **Cartesia Sonic 3** — **40ms TTS latency in real-time mode**. Built for voice agents, but the narrator voice is genuinely good. Free tier 10K credits; **Pro $4/mo billed annually** (very cheap), Startup $39/mo, Scale $239/mo. Instant cloning from a **3-second clip** (lowest sample requirement in the industry). API-first.
- **PlayHT (PlayAI) Play 3.0** — 200+ voices, Creator **$31.20/mo (annual)** for 3M chars + 10 instant clones. No iOS app — web only — so disqualified for iPhone-first workflow.
- **Murf AI** — Creator **$29/mo monthly / $19/mo annual**, 200+ voices. Web-only platform, no iPhone app. Pro V2 voices are "directional" (prompt-described tone).
- **Resemble.ai** — Creator **$30/mo**, Professional $60/mo, $0.006/sec at scale (~$0.36/min). Emotion control + rapid + Pro clones. Developer-leaning; no iOS app. Skip.
- **WellSaid Labs** — Maker $49/mo, Creative $99/mo, Team $179/mo. **Way overpriced for an indie at AU$30 lifetime price points** — built for L&D departments at Fortune 500s. Skip.
- **Descript Overdub** — Hobbyist $16, Creator $24, Business $50/mo. Free Overdub tier (1,000-word vocab limit). Cloning needs 10 minutes of audio. Desktop-first; mobile is anaemic. Use only if you already pay for Descript.
- **Speechify Studio** — **$11.58/mo billed annually**. 50+ studio voices, SIMBA voice clone model. Strong iOS app for *reading* (not for producing scripted narration). Cloning needs 20 minutes (a lot vs EL's 30 seconds or Hume's 15 seconds).
- **LOVO Genny** — Basic **$24/mo annual**, 500+ voices in 100+ languages, **30 emotion modes**. No native iOS app.
- **NaturalReader** — Plus **$20.90/mo**, Pro $25.90/mo. Pro tier exposes OpenAI + Gemini voices. **Solid iOS app with 1000+ voices**. Best for reading documents aloud, not for crafting branded narrations.
- **Fish Audio (S2)** — Indie/open-weights challenger. 10-second cloning, 80+ languages. The S2 model reportedly beats ElevenLabs in blind preference tests in 2026. **Has an iOS app**. Worth a trial if EL quotas get expensive.
- **Coqui** — Shut down December 2023 / January 2024. Skip.

**Winner:** Hume Octave 2 for quality + cost combined, ElevenLabs for iPhone workflow. **Sleeper:** Fish Audio S2.

## 3. Voice AI agencies / managed services

For Jamie this category is mostly noise — these are *human* voice talent marketplaces with bolted-on AI bits, priced for marketing agencies, not iPhone-first solo founders.

- **Voices.com** — AI Studio added; licensable AI voices from real actors. $100s per project minimum. Skip.
- **Voice123** — AI voice models *owned by the original voice actors*. Interesting ethics, prohibitive pricing.
- **Voquent** — Production-service heavy. Skip unless you want a human read.
- **BunnyStudio / VoiceBunny** — 13K human VO actors, no AI focus. Skip.
- **Bodalgo** — European VO marketplace. Skip.
- **Verbatik** — All-in-one creator platform. 1,500+ neural voices. "Murf alternative." Web-only.
- **Synthesia** — Avatar+voice, **Starter $22-29/mo, Creator $53-89/mo**. 160+ languages. Geared at corporate explainer video. Wrong tool for FREQUENCY's brand.
- **Hour One** — same category as Synthesia. Skip.

**Verdict:** None of these are right for Jamie. The agency model is for clients buying a *campaign*, not a founder producing a 60-second narration tonight.

## 4. iPhone-native voice apps — the usable shortlist

1. **ElevenLabs** (iOS app, free + paid) — paste → generate → MP3 download. **The only app where you can do all of it in the same app in under 60s.**
2. **ElevenReader** (iOS, free 3 months then $9.99/mo or bundled) — 800+ voices. For *consumption*, not production.
3. **Speechify** (iOS, $11.58/mo) — strongest iOS UX, but better for *reading* documents. Voice cloning needs 20 minutes via web studio.
4. **NaturalReader** (iOS, $20.90/mo Plus, $25.90/mo Pro) — Pro unlocks Gemini + OpenAI voices.
5. **Apple Personal Voice** (iOS 26 native, free) — record 10 prompts, get *your own voice* generated on-device. Quality jumped meaningfully in iOS 26. **Most underrated option for you specifically** — your *actual* voice doing FREQUENCY narration is on-brand in a way no cloned-ElevenLabs voice can be. Caveat: export pathway is awkward.
6. **Fish Labs: AI Audio Clone TTS** (iOS, freemium) — newcomer. Worth a free trial.
7. **Voice Aloud Reader / TTS Voice Studio** (iOS, ~$5-15) — exports MP3. Voices are generic.
8. **Suno** (iOS, Pro $10/mo) — voice cloning since v5.5 but **for singing only**. Don't use for spoken narration.

## 5. Voice cloning — fastest path

| Service | Sample required | Quality | iPhone-doable | Best for |
|---|---|---|---|---|
| **Apple Personal Voice (iOS 26)** | **10 phrases (~1 min)** | Good, jumped in iOS 26 | Yes, on-device | Your *actual* voice for personal-brand work |
| **Hume Octave 2** | **15 seconds** | Excellent + emotion-aware | Yes (Safari) | Multilingual contemplative work |
| **Cartesia** | **3 seconds (Instant)** | Good (Instant), excellent (Pro) | Yes (Safari) | Lowest sample bar in industry |
| **ElevenLabs Instant Voice Clone** | 1-5 min | Very good | Yes (iOS app) | Standard workflow; Starter tier+ |
| **ElevenLabs Pro Voice Clone (PVC)** | 30 min | **Best in industry** (2.83% WER) | Yes — upload from iPhone | High-stakes brand voice |
| **Fish Audio S2** | 10 seconds | Excellent per blind tests | Yes (iOS app) | Free / cheap alternative |

If you've already cloned your voice on ElevenLabs (you hinted you may have), it's sitting on your account waiting. Worth checking before paying anywhere else.

## 6. 2026 specifics — what's new and what to watch

- **ElevenLabs Voice Design v3** (Feb 2026) — prompt-described voices ("a 40-year-old contemplative Australian woman, breathy, slow"); inline audio tags (`[whispering]`); 70+ languages; 68% error reduction vs v2.
- **ElevenMusic on iOS** (Apr 2026) — voice + music + SFX in one app.
- **Hume Octave 2** (Oct 2025) — half-price multilingual upgrade, semantic understanding.
- **Cartesia Sonic 3** — 40ms latency real-time mode.
- **Apple iOS 26** — Personal Voice setup down to 10 phrases; quality "smoother and more natural." SpeechAnalyzer (STT) replaces SFSpeechRecognizer.
- **EU AI Act — Aug 2, 2026 enforcement deadline.** Article 50 transparency obligations: AI-generated voice published in EU must be machine-readably watermarked as synthetic; "deepfake" disclosures required. Fines up to €35M or 7% of global revenue. Stay clear: clone only your own voice (or buy clearance), label content as AI-narrated, keep consent paper trail.
- **Replica Studios** — shut down.
- **Coqui** — shut down (open-source XTTS-v2 weights remain).

## Side-by-side: top 8 candidates

| Service | Voice quality | Voice count | Cloning | iPhone app | Entry cost (USD/AUD) | Best-for |
|---|---|---|---|---|---|---|
| **ElevenLabs** | 5/5 | 5,000+ in library, 70+ languages | Instant 30s + Pro 30min | **Yes, native** | $5/mo (~AU$7) Starter; Creator $22 (~AU$31); Pro $99 (~AU$139) | Production narrations — primary pick |
| **Hume Octave 2** | 5/5 (emotion-aware) | 11 languages, multilingual blends | 15s clone | Safari (works) | Free tier; **$7.60/M chars** at scale (~AU$11) — cheapest premium | Contemplative narration backup |
| **OpenAI gpt-4o-mini-tts** | 4/5 | 13 voices, 50+ langs | None | Via Shortcuts/3rd-party | **~$0.015/min** (~AU$0.02) | Highest-volume cheap reads |
| **Cartesia Sonic 3** | 4.5/5 | Curated library | 3s Instant | Safari | $4/mo annual (~AU$6) Pro | Latency-critical / on-device |
| **Speechify Studio** | 3.5-4/5 | 200+ | SIMBA, 20 min sample | **Yes, strong iOS** | $11.58/mo annual (~AU$16) | Reading flows on the go |
| **PlayHT 3.0** | 4/5 | 800+ | 10 instant clones | No native (web) | $31.20/mo Creator (~AU$44) | Multilingual scripted reads |
| **Apple Personal Voice (iOS 26)** | 3.5/5 (jumped a lot) | 1 (yours) | On-device, 10 phrases | **Yes, native** | **Free** | Personal-brand on-device narration |
| **Fish Audio S2** | 4.5/5 (claimed) | Custom + library | 10s | **Yes, native** | Freemium | Cheap challenger to ElevenLabs |

## Specific voice picks for the 4 apps

Sticking with **ElevenLabs** as primary, here are the voice IDs/names to use, with Hume Octave 2 fallbacks for when the EL credit runs out.

### RESONATE — confident, contemplative-direct ~150 wpm
- **Primary:** `Charlotte` on ElevenLabs (Multilingual v3). Settings: Stability 0.42, Similarity 0.75, Style 0.20, Speaker Boost on.
- **Hume Octave 2 fallback:** `"40-year-old contemplative female, breath-led, ~150 wpm, calm authority, no theatricality"`.
- **Free fallback:** Apple Personal Voice slowed to ~150 wpm.

### DREAMS — slower, more intimate ~145 wpm
- **Primary:** `Emma` on ElevenLabs ("calm young American female for meditation"). Settings: Stability 0.45, Similarity 0.75, Style 0.15. If `Emma` feels too young, swap to `Charlotte` at slower Style 0.10 and Stability 0.50.
- **Hume Octave 2 fallback:** `"intimate female narrator, breath-paced, just-above-whisper, slow, ~145 wpm, sleep-storytelling"`.

### LIVE — confident builder, US male, ~175 wpm
- **Primary:** `Adam` on ElevenLabs ("deep, middle-aged American voice perfect for narration"). Settings: Stability 0.45, Similarity 0.75, Style 0.35.
- **Hume Octave 2 fallback:** `"40-year-old American male, confident builder energy, ~175 wpm, slight grin, no smugness, tech-founder cadence"`.

### HUM — slow contemplative
- **Primary:** `Charlotte` for Australian/American take; **`Alice`** on ElevenLabs (British, calm, contemplative) for the British-female variant. Settings: Stability 0.40, Similarity 0.75, Style 0.20.
- **Hume Octave 2 fallback:** `"British female, RP-soft, contemplative, sub-150 wpm, like a yoga teacher in her early 40s"`.

> **Voice-cloning shortcut for your own voice on the FREQUENCY apps:** the fastest path is **15 seconds into Hume Octave 2's instant clone** or **10 phrases into Apple Personal Voice on iOS 26**. Either takes under 2 minutes from cold start. The Hume clone produces an MP3 you can drop into `bake.sh` immediately.

## What to do tonight — 5-step concrete workflow

Assumes: ElevenLabs Creator account (or Starter), the existing `paste.txt` and `bake.sh` files, and an iPhone with the ElevenLabs iOS app installed.

1. **Open the ElevenLabs iOS app → Studio**. Install from App Store if needed. Confirm Charlotte, Emma, Adam, and Alice are pinned in *My Voices*. If `Alice` isn't pinned, search Voice Library, preview, add — 20 seconds.

2. **Batch-generate the 8 narrations**, in this order (least-cost first):

   1. `launch-kit/resonate/clips-60s/pitch/paste.txt` → **Charlotte** (S 0.42 / Sim 0.75 / Style 0.20)
   2. `launch-kit/resonate/clips-60s/science/paste.txt` → **Charlotte** (same)
   3. `launch-kit/hum/clips-60s/origins/paste.txt` → **Charlotte** or **Alice** (S 0.40 / Style 0.20)
   4. `launch-kit/hum/clips-60s/howto/paste.txt` → **Charlotte** or **Alice** (same)
   5. `launch-kit/dreams/clips-60s/pitch/paste.txt` → **Emma** (S 0.45 / Style 0.15)
   6. `launch-kit/dreams/clips-60s/ritual/paste.txt` → **Emma** (same)
   7. `launch-kit/live/clips-60s/pitch/paste.txt` → **Adam** (S 0.45 / Style 0.35)
   8. `launch-kit/live/clips-60s/pipeline/paste.txt` → **Adam** (same)

   For each: open `paste.txt` in Files, copy, paste into ElevenLabs Studio, set voice + settings, Generate, listen, regenerate once if prosody drifts on a single line (you can regenerate individual segments in Studio — don't re-roll the whole thing), Download → MP3.

3. **Drop each MP3 into its clip folder, renamed `narration.mp3`.** Using Files on iPhone, OR AirDrop to a Mac, OR push via Working Copy + GitHub.

4. **Bake all 8 at once.** From repo root:
   ```bash
   for f in launch-kit/*/clips-60s/*/bake.sh; do
     echo "=== $f ==="
     bash "$f" || echo "  (skipped — narration.mp3 missing)"
   done
   ```
   You'll get `<name>-voiced.mp4` next to each silent original. Each bake is an `ffmpeg -c:v copy` mux — under a second per clip.

5. **Optional polish:** for the two FREQUENCY clips (`resonate/pitch`, `dreams/ritual`) where a music bed elevates brand feel, follow `VOICEOVER-WORKFLOW.md`: load `narration-only.mp3` in GarageBand for iOS, drop a 60s loop of the 432Hz or 528Hz bed from `/frequency.html` underneath at -18dB, mix down, re-run `bake.sh` for just that clip.

**Total time estimate:** 35-45 minutes for all 8 narrations, gated by ElevenLabs generation latency (5-8s per clip) and the manual file-move step.

**Credit cost estimate:** 8 clips × ~600 chars each = ~4,800 characters. ~5% of Starter monthly allocation, ~0.5% of Creator's. Well within free re-generation budget if any line needs a re-roll.

**If ElevenLabs is unavailable / out of credits tonight:** open Hume Octave 2 in Safari on iPhone, paste each `paste.txt`, generate, download. Hume's free tier covers all 8 narrations comfortably — and Octave 2's semantic understanding means you can skip the per-line settings tuning.
