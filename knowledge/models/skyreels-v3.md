# SkyReels V3: Unified Multimodal In-Context Video Model

Flagship SkyReels release (Jan 29, 2026), built on a **unified multimodal in-context learning framework**. Natively supports three core capabilities: **multi-subject reference-to-video**, **audio-guided talking avatars**, and **video-to-video extension**. By Skywork AI.

GitHub: https://github.com/SkyworkAI/SkyReels-V3  
API: apifree.ai. Built on Wan 2.1 + MultiTalk + xDiT + Diffusers.

Completes the trilogy — see `knowledge/models/skyreels-v1.md` (human-centric) and `knowledge/models/skyreels-v2.md` (infinite-length Diffusion Forcing).

## What's New vs V2

| | SkyReels V2 | SkyReels V3 |
|---|---|---|
| Framework | AutoRegressive Diffusion Forcing | **Unified multimodal in-context learning** |
| Headline capability | Infinite-length T2V/I2V | **Reference-to-video (1–4 refs)**, **talking avatar (audio)**, **shot-switching extension** |
| Audio | (separate SkyReels-Audio) | **Native audio-guided talking avatars** (≤200s) |
| Shot control | start/end frame | **Cinematic transitions** (Cut-In/Out, Shot/Reverse, Multi-Angle, Cut Away) |
| Aspect ratios | 540P/720P presets | **1:1, 3:4, 4:3, 16:9, 9:16** |
| Sizes | 1.3B/5B/14B | 14B (ref/extension), **19B (talking avatar)** |
| Access | open weights | open weights **+ hosted API (apifree.ai)** |

## Model Variants (Hugging Face / ModelScope)

| Task | Variant | Model ID pattern |
|---|---|---|
| Reference-to-Video | 14B-720P | `--task_type reference_to_video` |
| Video Extension | 14B-720P | `--task_type single_shot_extension` / `shot_switching_extension` |
| Talking Avatar | 19B-720P | `--task_type talking_avatar` |

## Three Capabilities

### 1. Reference-to-Video (1–4 reference images + prompt)
Synthesizes coherent video from character portraits, object images, and/or background scenes with strong identity fidelity. A cross-frame pairing data pipeline + image-editing subject extraction avoids the "copy-paste" effect. Aspect ratios 1:1/3:4/4:3/16:9/9:16. Recommended: 5s @ 720p @ 24fps.

```bash
python3 generate_video.py --task_type reference_to_video \
  --ref_imgs "ref1.png,ref2.png" \
  --prompt "..." --duration 5 --offload
# multi-GPU: torchrun --nproc_per_node=4 ... --use_usp
```

**Performance (vs closed-source SOTA):**
| Model | Ref Consistency ↑ | Instruction Following ↑ | Visual Quality ↑ |
|---|---|---|---|
| **SkyReels V3** | **0.6698** | 27.22 | **0.8119** |
| Kling 1.6 | 0.6630 | 29.23 | 0.8034 |
| PixVerse V5 | 0.6542 | 29.34 | 0.7976 |
| Vidu Q2 | 0.5961 | 27.84 | 0.7877 |

Leads on reference consistency + visual quality (slightly behind on instruction following).

### 2. Video Extension (5s → 30s, minute-level via history enhancement)
Two modes:
- **Single-shot continuation** (`single_shot_extension`, `--duration 5..30`) — seamless narrative continuation
- **Shot switching** (`shot_switching_extension`, ≤5s) — cinematic transitions via `[ZOOM_IN_CUT]`-style prompt tags (Cut-In, Cut-Out, Shot/Reverse Shot, Multi-Angle, Cut Away)

```bash
# single-shot
python3 generate_video.py --task_type single_shot_extension \
  --input_video test.mp4 --prompt "..." --duration 5 --offload
# shot switching (use an LLM to craft transition prompts)
python3 generate_video.py --task_type shot_switching_extension \
  --input_video test.mp4 --prompt "[ZOOM_IN_CUT] The scene cuts from..." --offload
```

First engine supporting **intelligent shot switching during extension** — "narrative continuation," not just frame interpolation. Unified multi-segment positional encoding + hierarchical data training; handles rapid motion, multi-person interaction, abrupt scene changes.

### 3. Talking Avatar (1 portrait + 1 audio clip, ≤200s)
Lifelike talking avatars, 720p @ 24fps, precise multilingual lip-sync (Chinese/English/Korean/singing/fast dialogue). Multi-style (real, cartoon, animal, stylized), multi-character scenes, minute-long coherent output. Keyframe-constrained generation framework structures key content then connects transitions.

```bash
python3 generate_video.py --task_type talking_avatar \
  --prompt "A woman is giving a speech. Confident, poised, joyful. Static shot." \
  --seed 42 --offload \
  --input_image "woman.JPEG" --input_audio "woman_speech.mp3"
```
- `--input_image`: jpg/jpeg, png, gif, bmp
- `--input_audio`: mp3/wav, ≤200s, one track

**Performance (vs avatar models):**
| Model | Audio-Visual Sync ↑ | Visual Quality ↑ | Character Consistency ↑ |
|---|---|---|---|
| OmniHuman 1.5 | 8.25 | 4.60 | 0.81 |
| **SkyReels V3** | 8.18 | **4.60** | 0.80 |
| KlingAvatar | 8.01 | 4.55 | 0.78 |
| HunyuanAvatar | 6.72 | 4.50 | 0.74 |

Top-tier, essentially matching OmniHuman 1.5 and ahead of Kling/Hunyuan avatars.

## Installation & VRAM

```bash
git clone https://github.com/SkyworkAI/SkyReels-V3
cd SkyReels-V3
pip install -r requirements.txt   # Python 3.12+, CUDA 12.8+
```

**Low-VRAM mode (<24GB):**
```bash
export PYTORCH_CUDA_ALLOC_CONF="expandable_segments:True"
python3 generate_video.py --low_vram --resolution 540P ...
```
`--low_vram` = FP8 weight-only quant + block offload. Lower `--resolution` (720P default → 540P/480P).

## Integration with the RHYTHMIX Video Stack

This is the **most directly useful SkyReels version for RHYTHMIX** because two of its three capabilities map onto recurring promo needs:

| Pipeline | Best for |
|---|---|
| **HyperFrames** | Motion graphics / kinetic typography (ADR-0001 default) |
| **SkyReels V1** | Short cinematic human clips |
| **SkyReels V2** | Infinite-length cinematic body / Diffusion Forcing |
| **SkyReels V3** | **Brand-consistent multi-reference shots, talking-avatar presenters, cinematic shot-switching** |
| **KimiK2Manim** | Math/technical explainer animation |
| **Nucleus/Mary** | Orchestration + carousel + scoring |

**Where V3 wins for RHYTHMIX:**
- **Talking Avatar** → a RHYTHMIX-branded presenter/spokesperson delivering narration, driven by the existing TTS/voice stack (Kokoro/ElevenLabs/Voicebox `narration.wav`). One portrait + the narration audio → a lip-synced minute-long presenter video. This is the single biggest unlock — it turns the existing narration assets into on-screen talent.
- **Reference-to-Video** → lock brand characters/products/backgrounds (1–4 refs) for consistent recurring "cast" across a campaign — directly supports the venue sub-brand series (disco/jazz/rave/rock) keeping a consistent look.
- **Shot-switching extension** → cinematic cuts (Cut-In, Reverse Shot, Multi-Angle) for dynamic promos without manual editing; pairs with an LLM to craft the `[TRANSITION]` prompts.
- **All 5 aspect ratios** cover every RHYTHMIX output target (9:16 Reels, 16:9 YouTube, 1:1 Instagram, plus 3:4/4:3).

**Bridge pattern (avatar-narrated promo):**
```
1. ElevenLabs/Kokoro/Voicebox → narration.wav (existing pipeline)
2. FLUX / Higgsfield          → brand-spokesperson portrait
3. SkyReels-V3 talking_avatar → lip-synced presenter video (≤200s, matches narration)
4. SkyReels-V3 reference_to_video → branded B-roll with consistent cast/products
5. HyperFrames               → composite presenter + B-roll + kinetic RHYTHMIX typography
6. Nucleus/Mary             → score variants, assemble final cut
```

**Deployment note:** Large models (14B/19B at 720P, Python 3.12+/CUDA 12.8+). The cloud sandbox here has **no GPU**. Three options, in order of convenience:
1. **apifree.ai hosted API** — easiest; no local GPU needed (best fit for this pipeline — call it like any other generation API from Nucleus).
2. **Rented GPU / ModelScope** — for self-hosting the open weights.
3. `--low_vram` on a ≥24GB consumer card for smaller jobs.
Prefer the **hosted API** for in-pipeline calls from this ecosystem; reserve self-hosting for volume/cost reasons.

## References

- **GitHub**: https://github.com/SkyworkAI/SkyReels-V3
- **API**: https://apifree.ai
- **Weights**: huggingface.co/Skywork (SkyReels-V3 variants) / ModelScope
- **Tech report**: SkyReels-Audio: Omni Audio-Conditioned Talking Portraits in Video Diffusion Transformers (Jun 1, 2025)
- **Base / thanks**: Wan 2.1, MultiTalk, xDiT, Diffusers
- **Related**: SkyReels V1/V2, SkyReels-A1 (portrait animation), SkyReels-A2 (elements-to-video)

---

**Use Case for Ecosystem:** Unified multimodal video model — the most RHYTHMIX-relevant SkyReels version. Talking Avatar turns existing narration.wav assets into lip-synced on-screen presenters; Reference-to-Video locks brand cast/product/background consistency across campaigns (incl. venue sub-brands); shot-switching extension adds cinematic cuts. Covers all RHYTHMIX aspect ratios. GPU-heavy (14B/19B) — prefer the apifree.ai hosted API for in-pipeline calls, or rented GPU/ModelScope/`--low_vram` for self-hosting. Completes the SkyReels V1→V2→V3 lineage in this knowledge base.
