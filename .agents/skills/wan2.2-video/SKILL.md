---
name: wan2.2-video
description: Generate video with Alibaba's Wan2.2 open models (text-to-video, image-to-video, text-image-to-video, speech-to-video, character animation/replacement). Use when the user wants Wan2.2 b-roll, AI motion, talking-head, or character-animation clips for a RHYTHMIX Promo. Covers the model lineup, VRAM needs, exact CLI flags, and — because there is no local GPU in this workspace — how to run it hosted (Replicate/fal) instead.
---

# Wan2.2 (open video generation)

Wan2.2 is Alibaba's open video-diffusion family (Apache 2.0). The A14B models use a
two-expert MoE (27B total / 14B active per step): a high-noise expert for early layout,
a low-noise expert for late detail. The 5B TI2V model uses a high-compression VAE
(4×16×16) and runs on a single consumer GPU.

Repo: https://github.com/Wan-Video/Wan2.2 · Weights: `Wan-AI/*` on HuggingFace / ModelScope.

## ⚠️ This workspace has no GPU — read first

The user's environment is iPhone-driven with no desktop GPU (see `CREATIVE-AI-STACK.md`),
and this sandbox has no CUDA. **Do not try to run `generate.py` here.** Pick a hosted path:

1. **Replicate** — use the `replicate` skill's `replicate_run` tool with a Wan2.2 model id
   (`owner/name[:version]`). This is the default for filling an `<img>`/`<video>` slot in a Cut.
2. **fal.ai** — hosted Wan2.2 endpoints (T2V/I2V), pay-per-second; good for quick b-roll.
3. **Rented GPU** (RunPod/Vast/Lambda) — only when you need S2V, Animate, LoRA training, or
   exact local control. Use the CLI section below on that box.

Match the model to VRAM: TI2V-5B → 24 GB (RTX 4090); A14B / S2V / Animate → 80 GB.

## Model lineup

| Model        | Task                                   | Resolutions      | Min VRAM (local) |
| ------------ | -------------------------------------- | ---------------- | ---------------- |
| `T2V-A14B`   | Text → video (MoE)                     | 480P & 720P      | 80 GB            |
| `I2V-A14B`   | Image → video (MoE)                    | 480P & 720P      | 80 GB            |
| `TI2V-5B`    | Text **and** image → video (unified)   | 720P @ 24fps     | 24 GB (4090)     |
| `S2V-14B`    | Speech/audio → cinematic video         | 480P & 720P      | 80 GB            |
| `Animate-14B`| Character animation / replacement      | up to 1280×720   | 80 GB            |

`TI2V-5B` is the fast/cheap default: ~5s 720P clip in <9 min on one 4090. Its 720P size is
**`1280*704` or `704*1280`** (not 1280*720). For I2V/S2V/Animate, `--size` is the *area*;
the output aspect ratio follows the input image.

## Local install (GPU box only)

```bash
git clone https://github.com/Wan-Video/Wan2.2.git && cd Wan2.2
# torch >= 2.4.0. If flash_attn fails, install it LAST.
pip install -r requirements.txt
pip install -r requirements_s2v.txt          # only for Speech-to-Video / CosyVoice TTS

pip install "huggingface_hub[cli]"
huggingface-cli download Wan-AI/Wan2.2-TI2V-5B --local-dir ./Wan2.2-TI2V-5B
```

## CLI by task (single-GPU)

```bash
# Text→Video (A14B, 720P, 80GB)
python generate.py --task t2v-A14B --size 1280*720 --ckpt_dir ./Wan2.2-T2V-A14B \
  --offload_model True --convert_model_dtype --prompt "<prompt>"

# Image→Video (A14B)
python generate.py --task i2v-A14B --size 1280*720 --ckpt_dir ./Wan2.2-I2V-A14B \
  --offload_model True --convert_model_dtype --image in.jpg --prompt "<prompt>"

# Text-Image→Video (5B, 24GB / 4090) — note 1280*704
python generate.py --task ti2v-5B --size 1280*704 --ckpt_dir ./Wan2.2-TI2V-5B \
  --offload_model True --convert_model_dtype --t5_cpu --prompt "<prompt>"   # add --image in.jpg for I2V

# Speech→Video (14B). Length auto-fits audio unless --num_clip set.
python generate.py --task s2v-14B --size 1024*704 --ckpt_dir ./Wan2.2-S2V-14B/ \
  --offload_model True --convert_model_dtype --prompt "<prompt>" --image ref.jpg --audio talk.wav
#   + CosyVoice TTS: --enable_tts --tts_prompt_audio ref.wav --tts_prompt_text "…" --tts_text "…"
#   + pose-driven : --pose_video pose.mp4
```

**OOM flags:** `--offload_model True --convert_model_dtype --t5_cpu` cut GPU memory.
Drop them on 80 GB cards for speed.

**Multi-GPU (FSDP + DeepSpeed Ulysses):**
```bash
torchrun --nproc_per_node=8 generate.py --task t2v-A14B --size 1280*720 \
  --ckpt_dir ./Wan2.2-T2V-A14B --dit_fsdp --t5_fsdp --ulysses_size 8 --prompt "<prompt>"
```
(5B variant: `--ulysses_size 8 --offload_model True --convert_model_dtype --t5_cpu`.)

## Wan-Animate (character animation / replacement)

Two stages: preprocess the driving video + reference image, then generate.

```bash
# Preprocess (animation): retarget motion onto the character image
python ./wan/modules/animate/preprocess/preprocess_data.py \
  --ckpt_path ./Wan2.2-Animate-14B/process_checkpoint \
  --video_path video.mp4 --refer_path image.jpeg --save_path ./out \
  --resolution_area 1280 720 --retarget_flag --use_flux
# Replacement adds: --iterations 3 --k 7 --w_len 1 --h_len 1 --replace_flag

# Generate — animation mode
python generate.py --task animate-14B --ckpt_dir ./Wan2.2-Animate-14B/ \
  --src_root_path ./out/ --refert_num 1
# Replacement mode adds: --replace_flag --use_relighting_lora
```
Diffusers also exposes `WanAnimatePipeline` (`Wan-AI/Wan2.2-Animate-14B-Diffusers`),
modes `animate` / `replace`. ⚠️ Avoid Wan2.2-trained LoRAs with Wan-Animate — weight
drift causes artifacts.

## Prompt extension (quality boost, optional)

`--use_prompt_extend` enriches detail. Two methods:
- `--prompt_extend_method dashscope` (needs `DASH_API_KEY`; qwen-plus for T2V, qwen-vl-max for I2V).
  Intl site also needs `DASH_API_URL=https://dashscope-intl.aliyuncs.com/api/v1`.
- `--prompt_extend_method local_qwen` (e.g. `Qwen/Qwen2.5-7B-Instruct`, VL variants for I2V).
- `--prompt_extend_target_lang zh|en`.
For I2V you can pass an empty prompt and let extension caption the image.

## RHYTHMIX usage

For a Promo b-roll slot, prefer hosted `replicate_run` (see the `replicate` skill) over local
runs. Save outputs into the Cut folder so HyperFrames references them by relative path. Use
TI2V-5B for fast/cheap 720P; reach for A14B only when motion/semantics demand it; S2V/Animate
for talking-head or character work. Diffusers/ComfyUI integrations exist for all five tasks.

## License

Apache 2.0. You own generated content; usage must comply with the license (no unlawful,
harmful, or deceptive use).
