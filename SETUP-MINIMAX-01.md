# MiniMax-01 (Text-01 & VL-01) — Setup & Reference

## Overview

[MiniMax-01](https://arxiv.org/abs/2501.08313) is a pair of open-weight
foundation models from MiniMax (the same vendor whose **video** model RHYTHMIX
already uses alongside Kling / Hunyuan / Luma):

- **MiniMax-Text-01** — 456B total params, **45.9B activated/token** (MoE). A
  hybrid-attention LLM with a **1M-token training context** and up to **4M
  tokens at inference** — built for very-long-context work.
- **MiniMax-VL-01** — a `ViT-MLP-LLM` multimodal model: a 303M-param ViT +
  2-layer MLP projector on top of Text-01, with dynamic image resolution
  (336×336 → 2016×2016, plus a 336×336 thumbnail).

**Paper**: arXiv [2501.08313](https://arxiv.org/abs/2501.08313) ·
**Weights**: [MiniMaxAI/MiniMax-Text-01](https://huggingface.co/MiniMaxAI/MiniMax-Text-01),
[MiniMaxAI/MiniMax-VL-01](https://huggingface.co/MiniMaxAI/MiniMax-VL-01) ·
**Contact**: model@minimax.io

> ### How this fits the RHYTHMIX stack — read first
> These are **huge** models. The int8 quickstart below assumes **8 GPUs**;
> self-hosting Text-01/VL-01 is a data-center task, not something for this
> cloud-first, iPhone-driven repo. **Use the hosted path** (MiniMax API or the
> **MiniMax MCP Server** — video/image gen, speech synthesis, voice cloning)
> for anything practical here. The open weights matter to us mainly as a
> reference and a self-host option *if* you ever rent a GPU cluster.
>
> Where these specific models could earn their keep in the pipeline:
> - **Text-01's 1M–4M context** → long-context story development across an entire
>   campaign/series (complements the Step 3.7 Flash `flash_chat`/`flash_episode_brief`
>   tools already wired in `.claude/mcp/stepfun/`).
> - **VL-01** → understanding/critiquing rendered frames, thumbnails, and
>   reference images for shot selection.

## Architecture

**MiniMax-Text-01**

| Spec | Value |
|---|---|
| Total params | 456B |
| Activated / token | 45.9B |
| Layers | 80 |
| Attention | Hybrid — 1 softmax after every 7 lightning-attention layers |
| Attention heads | 64 × dim 128 |
| MoE | 32 experts, hidden 9216, top-2 routing |
| Positional | RoPE on half the head dim, base 10,000,000 |
| Hidden size | 6144 |
| Vocab | 200,064 |

**MiniMax-VL-01 — additional ViT**

| Spec | Value |
|---|---|
| Params | 303M |
| Layers | 24 · patch 14 |
| Hidden / FFN | 1024 / 4096 |
| Heads | 16 × dim 64 |

## Evaluation highlights (per the model card)

- **Text**: competitive with GPT-4o / Claude-3.5-Sonnet / DeepSeek-V3 on MMLU
  (88.5), MMLU-Pro (75.7), IFEval (89.1), Arena-Hard (89.1).
- **Long context**: leads the Ruler benchmark at long lengths (0.947@128k,
  0.910@1M) and tops **LongBench v2** (56.5 overall w/ CoT) — its standout
  strength.
- **Vision**: strong on the multimodal leaderboards — MMMU 68.5, ChartQA 91.7,
  DocVQA 96.4, OCRBench 865.

(Numbers reproduced from the model card; verify against the latest leaderboard
before quoting publicly.)

## Practical path: hosted API / MCP (recommended for this repo)

For real use from the RHYTHMIX workflow, don't self-host — use MiniMax's hosted
services:

- **MiniMax MCP Server** — video generation, image generation, speech synthesis,
  voice cloning. If/when connected, find its tools via `ToolSearch` (keyword
  "minimax"); it slots in next to the other creative MCP servers in `.mcp.json`.
- **MiniMax online API** (OpenAI-compatible) + chatbot with online search — get
  a key from MiniMax and store it in `.env` (gitignored) as e.g.
  `MINIMAX_API_KEY`, never committed.

## Self-host path: open weights (heavy — GPU cluster)

For production self-hosting, MiniMax recommends **vLLM** (throughput, paged KV
cache, batching). See their vLLM Deployment Guide. Transformers also works
directly; int8 quantization is recommended.

### Transformers quickstart — MiniMax-Text-01 (8-GPU, int8)

```python
from transformers import AutoModelForCausalLM, AutoTokenizer, AutoConfig, QuantoConfig, GenerationConfig

hf_config = AutoConfig.from_pretrained("MiniMaxAI/MiniMax-Text-01", trust_remote_code=True)

quantization_config = QuantoConfig(
    weights="int8",
    modules_to_not_convert=["lm_head", "embed_tokens"]
        + [f"model.layers.{i}.coefficient" for i in range(hf_config.num_hidden_layers)]
        + [f"model.layers.{i}.block_sparse_moe.gate" for i in range(hf_config.num_hidden_layers)],
)

# Shard 80 layers across 8 GPUs
world_size = 8
layers_per_device = hf_config.num_hidden_layers // world_size
device_map = {
    "model.embed_tokens": "cuda:0",
    "model.norm": f"cuda:{world_size - 1}",
    "lm_head": f"cuda:{world_size - 1}",
}
for i in range(world_size):
    for j in range(layers_per_device):
        device_map[f"model.layers.{i * layers_per_device + j}"] = f"cuda:{i}"

tokenizer = AutoTokenizer.from_pretrained("MiniMaxAI/MiniMax-Text-01")
messages = [
    {"role": "system", "content": [{"type": "text", "text": "You are a helpful assistant created by MiniMax based on MiniMax-Text-01 model."}]},
    {"role": "user", "content": [{"type": "text", "text": "Hello!"}]},
]
text = tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
model_inputs = tokenizer(text, return_tensors="pt").to("cuda")

model = AutoModelForCausalLM.from_pretrained(
    "MiniMaxAI/MiniMax-Text-01", torch_dtype="bfloat16",
    device_map=device_map, quantization_config=quantization_config,
    trust_remote_code=True, offload_buffers=True,
)
gen = GenerationConfig(max_new_tokens=20, eos_token_id=200020, use_cache=True)
out = model.generate(**model_inputs, generation_config=gen)
print(tokenizer.batch_decode(
    [o[len(i):] for i, o in zip(model_inputs.input_ids, out)],
    skip_special_tokens=True)[0])
```

### MiniMax-VL-01 notes

Same pattern with `AutoProcessor` instead of a tokenizer; the device map adds the
`vision_tower` / `multi_modal_projector` / `image_newline` modules (kept out of
quantization) on `cuda:0`, and inputs are built from an image + prompt:
`processor(images=[img], text=prompt, return_tensors="pt").to("cuda").to(torch.bfloat16)`.
Full script is in the upstream model card.

> **Practicality:** even at int8 these models need a multi-GPU host. If you don't
> have one, stop here and use the hosted API/MCP path above.

## Citation

```bibtex
@misc{minimax2025minimax01scalingfoundationmodels,
  title  = {MiniMax-01: Scaling Foundation Models with Lightning Attention},
  author = {MiniMax et al.},
  year   = {2025}, eprint = {2501.08313},
  archivePrefix = {arXiv}, primaryClass = {cs.CL},
  url    = {https://arxiv.org/abs/2501.08313}
}
```

## License / contact

Open-weight release by MiniMax; see the Hugging Face model cards for license
terms. Developer contact: model@minimax.io.
