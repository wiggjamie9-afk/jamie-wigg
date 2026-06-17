# SkyReels V1: Human-Centric Video Foundation Model

First and most advanced open-source human-centric video foundation model, by Skywork AI. Fine-tunes HunyuanVideo on ~10M high-quality film/TV clips for Text-to-Video and Image-to-Video generation with cinematic quality and expressive facial animation.

GitHub: https://github.com/SkyworkAI/SkyReels-V1  
Released: Feb 18, 2025. License: built on HunyuanVideo (check repo for terms).

## Why This Matters Here

This ecosystem's video pipeline already uses **HunyuanVideo** as a default video model via the Replicate MCP stack (see `knowledge/tools/` and the `replicate` skill in CLAUDE.md). SkyReels V1 is a **HunyuanVideo fine-tune specialized for human-centric, cinematic footage** — making it a natural upgrade path when a RHYTHMIX promo needs realistic people, expressions, and film-grade lighting rather than abstract/motion-graphics content (which stays in HyperFrames).

## Three Key Advantages

1. **Open-source SOTA** — T2V performance comparable to proprietary Kling/Hailuo; tops open-source VBench (82.43 overall).
2. **Advanced facial animation** — 33 distinct facial expressions, 400+ natural movement combinations reflecting human emotion.
3. **Cinematic aesthetics** — trained on Hollywood-level film/TV data; each frame shows cinematic composition, actor positioning, and camera angles.

## Models

| Model | Resolution | Length | FPS | Hugging Face |
|---|---|---|---|---|
| SkyReels-V1-Hunyuan-T2V | 544×960 | 97 frames | 24 | `Skywork/SkyReels-V1-Hunyuan-T2V` |
| SkyReels-V1-Hunyuan-I2V | 544×960 | 97 frames | 24 | `Skywork/SkyReels-V1-Hunyuan-I2V` |

Related: **SkyReels-A1** — open-source portrait image animation framework (also released Feb 18, 2025).

## Benchmark (VBench, open-source T2V)

| Model | Overall | Quality | Semantic | Dynamic Degree | Multiple Objects |
|---|---|---|---|---|---|
| **SkyReels V1 540P** | **82.43** | **84.62** | 73.68 | **72.5** | **71.61** |
| CogVideoX1.5-5B | 82.17 | 82.78 | 79.76 | 50.93 | 69.65 |
| VideoCrafter-2.0 VEnhancer | 82.24 | 83.54 | 77.06 | 63.89 | 68.84 |
| HunyuanVideo 540P | 81.23 | 83.49 | 72.22 | 51.67 | 70.45 |
| AnimateDiff-V2 | 80.27 | 82.90 | 69.75 | 40.83 | 36.88 |

SkyReels V1 leads on overall score, quality, dynamic degree, and multiple objects — i.e. strongest at complex, motion-rich human scenes.

## Architecture / Training

**Data pipeline** (self-developed cleaning + annotation):
- Expression classification — 33 facial expression types
- Character spatial awareness — 3D human reconstruction for film-level multi-person positioning
- Action recognition — 400+ action semantic units
- Scene understanding — cross-modal clothing/scene/plot correlation

**Multi-stage pretraining** (HunyuanVideo-inspired):
1. **Domain transfer** — adapt T2V model to human-centric video on ~10M film/TV clips
2. **I2V pretraining** — convert T2V→I2V by adjusting conv-in params, pretrain on same data
3. **High-quality fine-tuning** — fine-tune I2V on high-quality subset

## SkyReelsInfer — Inference Framework

Efficient video-gen inference built on Diffusers, non-intrusive parallel implementation:

- **Multi-GPU**: Context Parallel + CFG Parallel + VAE Parallel
- **User-level GPU**: FP8 weight-only quantization + parameter-level offload → runs on consumer cards (RTX 4090)
- **Performance**: 58.3% lower end-to-end latency vs HunyuanVideo XDiT (4-GPU RTX 4090: 293.3s vs 464.3s)
- **Optimizations**: SegaAttn attention, Torch.Compile transformer compilation

## Running Guide

```bash
git clone https://github.com/SkyworkAI/SkyReels-V1
cd skyreelsinfer
# Python 3.10, CUDA 12.2 recommended
pip install -r requirements.txt
```

**Important:** prompts must start with `"FPS-24, "` (FPS-control training method from MovieGen).

**Lossless run (ample VRAM, e.g. A800):**
```bash
python3 video_generate.py \
  --model_id Skywork/SkyReels-V1-Hunyuan-T2V \
  --task_type t2v --guidance_scale 6.0 \
  --height 544 --width 960 --num_frames 97 \
  --prompt "FPS-24, A cat wearing sunglasses and working as a lifeguard at a pool" \
  --embedded_guidance_scale 1.0
```

**RTX 4090 (full VRAM optimization, peaks ~18.5G):**
```bash
python3 video_generate.py \
  --model_id Skywork/SkyReels-V1-Hunyuan-T2V \
  --task_type t2v --guidance_scale 6.0 \
  --height 544 --width 960 --num_frames 97 \
  --prompt "FPS-24, ..." --embedded_guidance_scale 1.0 \
  --quant --offload --high_cpu_memory --parameters_level
```
Flags: `--quant` (FP8 weight-only), `--offload` (model offload), `--high_cpu_memory` (pinned memory), `--parameters_level` (further VRAM reduction). For I2V switch model to `...-Hunyuan-I2V` and add `--image`.

**Multi-GPU:**
```bash
python3 video_generate.py ... --quant --offload --high_cpu_memory --gpu_num $GPU_NUM
```

**Recommended resolutions (544p):**
| Aspect | Setting |
|---|---|
| 9:16 (portrait) | 544×960×97f |
| 16:9 (landscape) | 960×544×97f |
| 1:1 (square) | 720×720×97f |

These map cleanly onto the RHYTHMIX aspect-ratio conventions (TikTok/Reels = portrait, YouTube/LinkedIn = landscape, Instagram = square) in CLAUDE.md.

## RTX 4090 Latency (544p 4s video)

| GPUs | HunyuanVideo + XDiT | SkyReelsInfer |
|---|---|---|
| 1 | OOM | 889.31s |
| 2 | OOM | 453.69s |
| 4 | 464.3s | 293.3s |
| 8 | (cannot split) | 159.43s |

Max VRAM run can produce 544×960×289f (12s) via `--sequence_batch` (~1.5h on one 4090; more GPUs cut this sharply).

## Integration with the RHYTHMIX Video Stack

| Pipeline | Best for |
|---|---|
| **HyperFrames** | Motion-graphics promos, kinetic typography (current default per ADR-0001) |
| **SkyReels V1** | Realistic human/cinematic footage (presenters, lifestyle, emotional scenes) |
| **KimiK2Manim** | Mathematical/technical explainer animations |
| **Nucleus/Mary** | Orchestration + carousel + scoring |

**Where SkyReels fits:** when a RHYTHMIX cut needs a believable human face/performer or film-grade live-action B-roll, SkyReels V1 (I2V from a generated still, or T2V from a prompt) is the strongest open-source option — and because it's a HunyuanVideo fine-tune, it slots into the existing HunyuanVideo-oriented tooling/mental model.

**Bridge pattern (hero shot → promo):**
```
1. Higgsfield Soul / FLUX  → generate a hero still (face/scene)
2. SkyReels-V1-I2V         → animate it into 4s cinematic clip (FPS-24 prompt)
3. HyperFrames             → composite clip + kinetic RHYTHMIX branding
4. Nucleus/Mary           → score variants, assemble final cut
```

**Deployment note:** This is a heavyweight GPU model (needs CUDA, ideally A800 or a well-optimized 4090). The cloud sandbox here has no GPU, so SkyReels is a **local/rented-GPU or Replicate-hosted** option, not something to run in this container. Prefer the Replicate-hosted HunyuanVideo path (`replicate` skill) for in-pipeline calls, and reserve self-hosted SkyReels for when human-centric cinematic quality justifies the GPU spend.

## References

- **GitHub**: https://github.com/SkyworkAI/SkyReels-V1
- **T2V weights**: huggingface.co/Skywork/SkyReels-V1-Hunyuan-T2V
- **I2V weights**: huggingface.co/Skywork/SkyReels-V1-Hunyuan-I2V
- **Base model**: HunyuanVideo (Tencent)
- **Also released**: SkyReels-A1 (portrait animation framework)

## Citation

```bibtex
@misc{SkyReelsV1,
  author = {SkyReels-AI},
  title = {Skyreels V1: Human-Centric Video Foundation Model},
  year = {2025},
  publisher = {GitHub},
  howpublished = {\url{https://github.com/SkyworkAI/SkyReels-V1}}
}
```

---

**Use Case for Ecosystem:** Open-source human-centric video model (HunyuanVideo fine-tune) for cinematic T2V/I2V. Strongest open option for realistic human performers and film-grade footage in RHYTHMIX promos. GPU-heavy — use via rented GPU / Replicate, not the GPU-less sandbox. Complements HyperFrames (graphics), KimiK2Manim (math animation), and Nucleus (orchestration). Resolution presets align with RHYTHMIX portrait/landscape/square conventions.
