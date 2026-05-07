# Best-in-Class Creative AI Stack — From Your iPhone

A practical playbook for orchestrating world-class creative AI work entirely from an iPhone or iPad. Every tool listed runs in the cloud (or as an iOS app), so no desktop GPU is required.

This is opinionated. For each category, the **first item is the recommended starting point**. Alternatives are listed for comparison or special cases.

---

## TL;DR — The Five Apps to Install Now

1. **Replicate** ([replicate.com](https://replicate.com)) — universal API for thousands of models. Web app works on iPhone. Pay-per-use.
2. **ElevenLabs** ([elevenlabs.io](https://elevenlabs.io)) — best voiceover and voice-cloning. iOS app available.
3. **Suno** ([suno.com](https://suno.com)) — best AI music generator with vocals and lyrics. iOS app.
4. **Midjourney** ([midjourney.com](https://midjourney.com)) — best general-purpose image generator. Web app on iPhone.
5. **CapCut** (App Store) — free pro-level video editor with built-in AI tools, runs natively on iPhone.

These five cover ~80% of creative output. Everything below is depth.

---

## 1. AI Video (Movies, Trailers, Promos)

| Rank | Tool | Best At | Where | Notes |
|---|---|---|---|---|
| ★ | **Veo 3** (Google) via [labs.google](https://labs.google) or [replicate.com/google/veo-3](https://replicate.com) | Cinematic realism, sound + dialogue | Web | Currently the gold standard. Works from iPhone Safari. |
| ★ | **Kling 2.0** (Kuaishou) via [klingai.com](https://klingai.com) or [pollo.ai](https://pollo.ai) | Realistic motion, image-to-video | Web/iOS | Strong character consistency. |
| ★ | **Runway Gen-3** ([runwayml.com](https://runwayml.com)) | Storyboarding, edit-grade output | Web/iOS app | Industry-standard for filmmakers. |
| | **Luma Dream Machine** ([lumalabs.ai](https://lumalabs.ai)) | Text-to-video, image-to-video | Web | Free tier; very fast. |
| | **Pika 2.0** ([pika.art](https://pika.art)) | Effects, transitions, lip-sync | Web | Best for stylized shorts. |
| | **HunyuanVideo** / **Wan 2.1** via Replicate | Open-source quality alternatives | Replicate API | If you want non-subscription pricing. |

**iPhone editing/finishing:** [CapCut](https://apps.apple.com/app/capcut), [LumaFusion](https://apps.apple.com/app/lumafusion), or [Final Cut Pro for iPad](https://apps.apple.com/app/final-cut-pro/id1471902002).

**Workflow tip:** Generate clips on Replicate/Kling/Runway → download to Files → import into CapCut → cut and add captions there.

---

## 2. AI Image Generation (Artwork, Posters, Album Art)

| Rank | Tool | Best At | Where | Notes |
|---|---|---|---|---|
| ★ | **Midjourney** ([midjourney.com](https://midjourney.com)) | All-purpose, aesthetic ceiling | Web (iPhone-friendly) | $10–60/mo. Highest visual quality. |
| ★ | **Flux 1.1 Pro / Pro Ultra** via [replicate.com/black-forest-labs/flux-1.1-pro](https://replicate.com) | Photorealism, prompt fidelity | API | Pay per image; tiny cost. |
| ★ | **Ideogram 2.0** ([ideogram.ai](https://ideogram.ai)) | **Text inside images, logos, posters** | Web/iOS | Best for typography. |
| | **Recraft V3** ([recraft.ai](https://recraft.ai)) | Brand assets, vector-style design | Web | Excellent for logos/brand kits. |
| | **DALL-E 3** (in ChatGPT Plus) | Conversational refinement | iOS app | Easiest UX for non-designers. |
| | **Adobe Firefly** ([firefly.adobe.com](https://firefly.adobe.com)) | Commercial-safe (trained on licensed data) | Web/iOS | Good if licensing matters. |
| | **Stable Diffusion / SDXL / FLUX** (open) via [Replicate](https://replicate.com) or [Civitai](https://civitai.com) | Style fine-tunes, NSFW, full control | API | For specialized looks. |

**iPhone-native art apps:** [Procreate](https://apps.apple.com/app/procreate) for hand drawing, [Pixelmator Pro](https://apps.apple.com/app/pixelmator-pro/id1289583905) for retouching, [Adobe Express](https://apps.apple.com/app/adobe-express/id1051937863) for layouts.

---

## 3. AI Voice (Voiceover, Cloning, Narration)

| Rank | Tool | Best At | Where | Notes |
|---|---|---|---|---|
| ★ | **ElevenLabs** ([elevenlabs.io](https://elevenlabs.io)) | Quality, voice cloning, languages | Web/iOS | Industry standard. $5/mo entry. |
| | **Cartesia Sonic** ([cartesia.ai](https://cartesia.ai)) | Lowest latency, real-time | API | Best for live use cases. |
| | **OpenAI TTS** (in ChatGPT API) | Consistent, cheap, simple | API | Good general-purpose. |
| | **Hume EVI** ([hume.ai](https://hume.ai)) | Emotional/conversational | API | Best for character work. |
| | **Kokoro-82M** (open-source) | Free, offline-capable | Self-hosted | Already used in this repo for TTS. |

**Already in this repo:** `voiceover-emma.wav`, `voiceover-adam.wav`, `voiceover-michael.wav`, `voiceover.wav`, plus the TTS pipeline via `npx hyperframes tts`.

---

## 4. AI Music (Tracks, Beats, Songs with Vocals)

| Rank | Tool | Best At | Where | Notes |
|---|---|---|---|---|
| ★ | **Suno v4** ([suno.com](https://suno.com)) | Full songs with vocals, lyrics | Web/iOS | $8–24/mo. The leader. |
| ★ | **Udio** ([udio.com](https://udio.com)) | High-fidelity production music | Web | Strong for instrumental. |
| | **ElevenLabs Music** | Tight integration with voice | Web | New, evolving fast. |
| | **AIVA** ([aiva.ai](https://aiva.ai)) | Cinematic / orchestral | Web | Composer-grade output. |
| | **Stable Audio 2** ([stableaudio.com](https://stableaudio.com)) | SFX, loops, samples | Web | Open-weights option. |

**iPhone-native:** [GarageBand](https://apps.apple.com/app/garageband) for arranging on top of generated stems.

---

## 5. AI Web Design & App Building

| Rank | Tool | Best At | Where | Notes |
|---|---|---|---|---|
| ★ | **v0 by Vercel** ([v0.dev](https://v0.dev)) | React/Next.js UI from prompts | Web | Best for production-grade web UIs. |
| ★ | **Lovable** ([lovable.dev](https://lovable.dev)) | Full-stack web apps from chat | Web (mobile-friendly) | iPhone-first authoring works. |
| ★ | **Bolt.new** ([bolt.new](https://bolt.new)) | Full-stack from prompt with hot reload | Web | StackBlitz-powered. |
| | **Webflow + AI** ([webflow.com](https://webflow.com)) | Visual-first marketing sites | Web | More designer-friendly. |
| | **Framer** ([framer.com](https://framer.com)) | Animated marketing sites with AI | Web/iOS | Great for landing pages. |
| | **Cursor Compose / Web** ([cursor.com](https://cursor.com)) | AI-pair-programming for serious code | Mac/Web | Mac-only desktop, but they're rolling out web. |
| | **Replit Agent** ([replit.com](https://replit.com)) | Full apps in browser, deployable | Web/iOS | Solid for prototypes. |

**For your specific RHYTHMIX site:** keep the static HTML approach. Use **v0** for new sections, paste output into the existing `*.html` files.

---

## 6. AI Coding Assistants (When You Need Code)

| Rank | Tool | Best At | Where | Notes |
|---|---|---|---|---|
| ★ | **Claude Code** (you're using it now) | Repo-aware engineering | CLI / web / Mac/Win desktop | Best autonomous coder today. |
| ★ | **Cursor** ([cursor.com](https://cursor.com)) | IDE-style pair programming | Mac/Win/Linux | Best for hands-on coding. |
| | **GitHub Copilot Mobile** ([github.com/mobile](https://github.com/mobile)) | iPhone code chat | iOS app | Lightweight on the phone. |
| | **ChatGPT** ([chat.openai.com](https://chat.openai.com)) | General-purpose Q&A | iOS app | Universal fallback. |
| | **Claude.ai** ([claude.ai](https://claude.ai)) | Long-form writing + coding | Web/iOS | Best for written reasoning. |

---

## 7. AI Photo / Video Editing & Restoration

| Tool | Use Case | Where |
|---|---|---|
| **Topaz Photo / Video AI** ([topazlabs.com](https://topazlabs.com)) | Upscaling, denoise, restoration | Mac/Win desktop (cloud waitlist) |
| **Magnific** ([magnific.ai](https://magnific.ai)) | AI image upscaler | Web |
| **Krea** ([krea.ai](https://krea.ai)) | Real-time gen + image enhance | Web |
| **CapCut Pro** | All-in-one mobile editor with AI cleanup | iOS app |
| **Photoroom** ([photoroom.com](https://photoroom.com)) | Background removal, product photos | iOS app |
| **Remove.bg** ([remove.bg](https://remove.bg)) | One-click bg removal | Web/iOS |

---

## 8. 3D / Avatar / Lipsync

| Tool | Use Case | Where |
|---|---|---|
| **HeyGen** ([heygen.com](https://heygen.com)) | Talking-head avatars, multi-language dubbing | Web/iOS |
| **D-ID** ([d-id.com](https://d-id.com)) | Photo → talking head | Web |
| **Synthesia** ([synthesia.io](https://synthesia.io)) | Corporate avatar videos | Web |
| **Meshy** ([meshy.ai](https://meshy.ai)) | Text/image → 3D models | Web |
| **Luma Genie** ([lumalabs.ai/genie](https://lumalabs.ai/genie)) | Text → 3D | Web |
| **Tripo** ([tripo3d.ai](https://tripo3d.ai)) | Image → 3D | Web |

---

## 9. The Universal Backbone: Replicate

If you set up *one* developer account, make it [Replicate](https://replicate.com). Why:

- One billing relationship for ~10,000 open-source models (Flux, SDXL, Wan2.1, HunyuanVideo, Whisper, Llama 3, MusicGen, etc.).
- Pay per second of compute — typically pennies per generation.
- Simple HTTP API — works from any iPhone shortcut, Apple Shortcuts app, n8n, Make.com, Zapier.
- Models we use elsewhere (HunyuanVideo, Flux Pro, Stable Audio, CogVideoX) are all available here.

**iPhone-native automation idea:** build an Apple Shortcut → "Generate album cover from prompt" → POSTs to Replicate Flux endpoint → saves to Photos. ~15 minutes to set up, used forever.

---

## 10. Workflow Glue (When You Need to Chain Things)

| Tool | When |
|---|---|
| **Apple Shortcuts** (built-in) | Simple one-tap iPhone automations using any of the APIs above. |
| **Make.com** ([make.com](https://make.com)) | Visual no-code chains; iPhone web app. |
| **Zapier** ([zapier.com](https://zapier.com)) | Same idea, more app integrations. |
| **n8n Cloud** ([n8n.io](https://n8n.io)) | Self-hosted-style automation; more flexible. |
| **Pipedream** ([pipedream.com](https://pipedream.com)) | Code-first automation with AI steps. |

---

## 11. Storage & Distribution

- **iCloud Drive** — render outputs land in Files app, sync to Mac/iPad.
- **GitHub** — what we're using now. Each render becomes a permanent versioned URL (like the one we just made for `rhythmix-overview-60s.mp4`).
- **YouTube / TikTok / Instagram** — direct upload from CapCut on iPhone.
- **rhythmixapp.com.au/downloads.html** — your existing download portal. Works on iPhone Safari today.

---

## What This Repo Already Has

| Asset | Purpose |
|---|---|
| `video/` | Remotion project (Mac dev) with vitest 100% coverage. |
| `rhythmix-*-60s/` | HyperFrames HTML video projects with rendered MP4s. |
| `rhythmix-overview-60s.mp4` | Latest 60s landscape promo with TTS narration. |
| `voiceover-*.wav` | Pre-rendered voiceover variants (Adam, Emma, Michael). |
| `downloads.html` | Public iPhone-friendly download portal. |
| `index.html`, `features.html`, `founder.html`, `rhythmix.html` | Live marketing site at rhythmixapp.com.au. |

To extend any of this from your iPhone in future sessions, paste the request to me here and I'll run it in this sandbox.

---

## Recommended Starting Spend (Monthly)

If you're picking ONE of each:

| Category | Pick | Cost |
|---|---|---|
| Video | Runway Pro | $15/mo |
| Image | Midjourney Basic | $10/mo |
| Voice | ElevenLabs Starter | $5/mo |
| Music | Suno Pro | $8/mo |
| Web design | Lovable Starter | $20/mo |
| API tier | Replicate (pay-as-you-go) | ~$10/mo typical |
| **Total** | | **≈ $68/mo** |

Or compress to **Replicate-only** + Suno + ElevenLabs for ~$25/mo if you're API-comfortable.

---

## Sandbox Status (This Linux VM)

For when we collaborate again on this repo:

| Tool | Status |
|---|---|
| Node 22.x, npm 10.x | ✅ |
| Python 3 + pip | ✅ |
| ffmpeg | ✅ |
| HyperFrames CLI | ✅ via `npx` |
| Kokoro-82M TTS | ✅ via `pip install kokoro-onnx` |
| whisper.cpp | ✅ built (model files need separate fetch from a reachable host) |
| Ollama | ✅ binary installed (model registry blocked by sandbox egress allowlist; usable when you bring your own GGUF via a reachable URL) |
| GPU | ❌ none — heavy gen happens on cloud APIs above |

**Egress allowlist** in this sandbox blocks `huggingface.co`, `ollama.com`, `cdn.jsdelivr.net`. `github.com`, `raw.githubusercontent.com`, `pypi.org`, `npmjs.org` are reachable. That's why model registries don't work here — anything we generate locally has to come from a github release or pypi package.
