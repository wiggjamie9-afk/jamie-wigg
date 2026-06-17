# SkyReels V2: Infinite-Length Film Generative Model

Successor to SkyReels V1 (see `knowledge/models/skyreels-v1.md`). The first open-source video model using an **AutoRegressive Diffusion-Forcing** architecture, enabling **infinite-length** video generation with SOTA open-source performance. By Skywork AI.

GitHub: https://github.com/SkyworkAI/SkyReels-V2  
Paper: arXiv:2504.13074. Built on Wan 2.1 + Qwen 2.5.

## What's New vs V1

| | SkyReels V1 | SkyReels V2 |
|---|---|---|
| Base | HunyuanVideo fine-tune | Wan 2.1-based, Diffusion Forcing |
| Length | ~4–12s clips | **Infinite** (10s/15s/30s/60s+ via autoregression) |
| Tasks | T2V, I2V | T2V, I2V, video extension, start/end-frame control, camera director |
| Resolutions | 544×960 | 540P (544×960×97f) + **720P (720×1280×121f)** |
| Sizes | 14B | 1.3B / 5B / 14B series |
| Captioner | internal | **SkyCaptioner-V1** (open, 76.3% avg accuracy) |
| Extras | SkyReels-A1 (portrait) | + **SkyReels-A2** (elements-to-video), SkyReels-Audio (talking portraits) |

> Note: the source also references **SkyReels-V3** (released Jan 29, 2026, with an API on apifree.ai). V3 is newer still; this doc covers V2, which has open weights + inference code documented in detail.

## Model Variants (Hugging Face / ModelScope)

| Type | Variant | H×W×Frames |
|---|---|---|
| **Diffusion Forcing** | 1.3B-540P | 544×960×97f |
| | 14B-540P | 544×960×97f |
| | 14B-720P | 720×1280×121f |
| **Text-to-Video** | 14B-540P / 14B-720P | 544×960×97f / 720×1280×121f |
| **Image-to-Video** | 1.3B-540P / 14B-540P / 14B-720P | as above |
| **Camera Director** | 5B / 14B (coming) | 720P |

Model IDs follow `Skywork/SkyReels-V2-<TYPE>-<SIZE>-<RES>` (e.g. `Skywork/SkyReels-V2-DF-14B-540P`), with `-Diffusers` suffix for the Diffusers-integrated weights.

## Core Innovation: Diffusion Forcing

Each token gets an **independent noise level**, denoised on per-token schedules (a form of partial masking: zero-noise = unmasked, full-noise = masked). The model learns to "unmask" any mix of variably-noised tokens, using cleaner tokens as conditioning. This lets the **Diffusion Forcing Transformer extend video indefinitely** from the last frames of the previous segment. Synchronous full-sequence diffusion is the special case where all tokens share one noise level — so the DF model can be fine-tuned from a full-sequence diffusion model.

**Methodology stack:** MLLM-driven captioning → multi-task pretraining → Reinforcement Learning (DPO on a motion-quality reward model) → Diffusion Forcing training → two-stage high-quality SFT (540p then 720p).

## VRAM & Length

| Model | 540P peak VRAM |
|---|---|
| 1.3B | ~14.7 GB |
| 14B (DF) | ~51.2 GB |
| 14B (T2V) | ~43.4 GB |

**Length is set via `--num_frames`** (aligned to training params, not strict seconds):
- 257 → 10s, 377 → 15s, 737 → 30s, 1457 → 60s
- Lower `--base_num_frames` (e.g. 77/57) to cut peak VRAM while keeping target length.

## Quickstart

```bash
git clone https://github.com/SkyworkAI/SkyReels-V2
cd SkyReels-V2
pip install -r requirements.txt   # Python 3.10.12 tested
```

**Diffusion Forcing — synchronous 10s:**
```bash
python3 generate_video_df.py \
  --model_id Skywork/SkyReels-V2-DF-14B-540P \
  --resolution 540P --ar_step 0 \
  --base_num_frames 97 --num_frames 257 --overlap_history 17 \
  --prompt "A graceful white swan ... swimming in a serene lake at dawn ..." \
  --addnoise_condition 20 --offload --teacache --use_ret_steps --teacache_thresh 0.3
```

**Diffusion Forcing — asynchronous 30s:** add `--ar_step 5 --causal_block_size 5`, `--num_frames 737`. Async is slower but improves instruction-following + visual consistency.

**Video extension:** add `--video_path ${video}` (total = input frames + num_frames).
**Start/end frame control:** add `--image ${start}` and `--end_image ${end}`.
**Standard T2V/I2V:** `generate_video.py` with `--shift 8.0`/`--guidance_scale 6.0` (T2V) or `--shift 3.0`/`--guidance_scale 5.0` (I2V).

**Diffusers (T2V):**
```python
from diffusers import SkyReelsV2DiffusionForcingPipeline, UniPCMultistepScheduler, AutoModel
# flow_shift = 8.0 (T2V) / 5.0 (I2V); ar_step=5 async, 0 sync
# overlap_history=17 for long video; addnoise_condition=20 for consistency
```

## Key Parameters

| Param | Rec. | Purpose |
|---|---|---|
| `--ar_step` | 0 | 0 = synchronous, >0 (e.g. 5) = asynchronous |
| `--causal_block_size` | 5 | frames/block for async (must divide frame-latent count) |
| `--base_num_frames` | 97 / 121 | base count (lower to save VRAM) |
| `--overlap_history` | 17 | frame overlap for smooth long-video transitions |
| `--addnoise_condition` | 20 | smooths long gen (≤50; too high → inconsistency) |
| `--shift` | 8.0 / 5.0 | flow-matching (T2V / I2V) |
| `--guidance_scale` | 6.0 / 5.0 | text adherence (T2V / I2V) |
| `--offload` | True | CPU offload to reduce VRAM |
| `--teacache` + `--teacache_thresh` | 0.2–0.3 | faster inference (higher = lower quality) |
| `--use_usp` | True | multi-GPU via xDiT USP (`torchrun --nproc_per_node=N`) |
| `--prompt_enhancer` | — | Qwen2.5-32B prompt expansion (needs 64G+ VRAM; not with `--use_usp`) |

## Performance (open-source SOTA)

**VBench (T2V):** SkyReels-V2 **83.9%** total / **84.7%** quality — beats HunyuanVideo-13B (82.7%) and Wan2.1-14B (83.7%).

**Human eval (T2V):** avg 3.14, leading on **instruction adherence (3.15)** and **consistency (3.35)** vs Kling-1.6, Hailuo-01, Wan2.1, HunyuanVideo.

**Human eval (I2V):** SkyReels-V2-I2V 3.29 / DF 3.24 — SOTA among open-source, comparable to proprietary Kling-1.6 (3.4) and Runway-Gen4 (3.39).

**SkyCaptioner-V1:** 76.3% avg captioning accuracy (vs Qwen2.5-VL-72B 58.7%), dramatically better on shot type/angle/position — useful as a standalone video annotation model.

## Integration with the RHYTHMIX Video Stack

| Pipeline | Best for |
|---|---|
| **HyperFrames** | Motion graphics / kinetic typography (ADR-0001 default) |
| **SkyReels V1** | Short cinematic human clips (HunyuanVideo fine-tune) |
| **SkyReels V2** | **Long-form / infinite cinematic video, video extension, start-end control** |
| **KimiK2Manim** | Math/technical explainer animation |
| **Nucleus/Mary** | Orchestration + carousel + scoring |

**Where V2 wins for RHYTHMIX:**
- **Length** — a 30s or 60s RHYTHMIX promo can be a single coherent generation (vs stitching 4s clips). 720P presets (720×1280 portrait / 1280×720 landscape) match the TikTok/Reels/YouTube conventions in CLAUDE.md.
- **Start/end-frame control** — pin a promo's opening brand frame and closing CTA frame, let V2 generate the connective motion.
- **Video extension** — extend an existing HyperFrames/SkyReels clip to fill a music bed's duration.
- **SkyCaptioner-V1** — auto-annotate the RHYTHMIX render library for searchable B-roll.

**Bridge pattern (long branded promo):**
```
1. FLUX / Higgsfield      → brand opening still + closing CTA still
2. SkyReels-V2-DF         → infinite-length cinematic body with start/end-frame control
3. SkyReels-V2 (extend)   → stretch to match narration/music duration
4. HyperFrames            → overlay kinetic RHYTHMIX typography + logo
5. Nucleus/Mary          → score variants, assemble final cut
```

**Deployment note:** 14B at 720P needs ~51GB VRAM (A800-class); 1.3B-540P fits ~14.7GB (4090-class). The cloud sandbox here has **no GPU** — run V2 on a **rented GPU / ModelScope / a Replicate-hosted endpoint**, not this container. For in-pipeline calls, keep using the Replicate-hosted video path (`replicate` skill); reserve self-hosted V2 for long-form cinematic work that justifies the GPU spend.

## References

- **GitHub**: https://github.com/SkyworkAI/SkyReels-V2
- **Paper**: https://arxiv.org/abs/2504.13074
- **Weights**: huggingface.co/Skywork (SkyReels-V2-* variants) / ModelScope
- **Base models**: Wan 2.1, Qwen 2.5; thanks to xDiT
- **Related**: SkyReels-V1 (human-centric), SkyReels-A2 (elements-to-video), SkyReels-Audio (talking portraits), SkyReels-V3 (newer, API on apifree.ai)

## Citation

```bibtex
@misc{chen2025skyreelsv2infinitelengthfilmgenerative,
  title={SkyReels-V2: Infinite-length Film Generative Model},
  author={Guibin Chen and Dixuan Lin and Jiangping Yang and others},
  year={2025}, eprint={2504.13074},
  archivePrefix={arXiv}, primaryClass={cs.CV},
  url={https://arxiv.org/abs/2504.13074}
}
```

---

**Use Case for Ecosystem:** Open-source infinite-length film model (Diffusion Forcing). The strongest open option for long-form cinematic RHYTHMIX promos — single-pass 30s/60s generation, start/end-frame control, and video extension, with 720P presets matching RHYTHMIX aspect ratios. GPU-heavy (14B/720P ≈ 51GB) — run via rented GPU/ModelScope/Replicate, not the GPU-less sandbox. Supersedes SkyReels V1 for length; complements HyperFrames (graphics) and Nucleus (orchestration). SkyCaptioner-V1 doubles as a render-library annotator.
