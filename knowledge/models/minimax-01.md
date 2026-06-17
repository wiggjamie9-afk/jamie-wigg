# MiniMax-01: Lightning-Attention Long-Context Foundation Models

Two open-source models from MiniMax: **MiniMax-Text-01** (456B MoE LLM with up to **4M-token inference context**) and **MiniMax-VL-01** (multimodal vision-language variant). Notable for a hybrid Lightning + Softmax attention architecture that makes million-token context practical.

Paper: arXiv:2501.08313 · HF: `MiniMaxAI/MiniMax-Text-01`, `MiniMaxAI/MiniMax-VL-01`

## Why It's Relevant Here — Two Angles

1. **Extreme long context** — 1M-token *training* / **4M-token inference** context. For this ecosystem that means: ingest the *entire* `knowledge/` base + specs + ADRs + render scripts in one prompt for Nucleus/Mary, or whole-codebase reasoning over the monorepo without chunking. Best Ruler scores at 512K–1M of any model in their table (0.928 @ 512K, 0.910 @ 1M — beating Gemini-1.5-Pro).
2. **MiniMax MCP Server** (the practical hook) — MiniMax ships an **MCP server with video generation, image generation, speech synthesis, and voice cloning**. That maps directly onto the RHYTHMIX creative pipeline and the existing `creative-stack`/`higgsfield`/`pollinations` MCP servers — a candidate addition for `.mcp.json` (voice cloning especially complements Kokoro/ElevenLabs/Voicebox narration + SkyReels V3 talking avatars).

## MiniMax-Text-01 Architecture

| Property | Value |
|---|---|
| Total params | 456B |
| Activated/token | 45.9B |
| Layers | 80 |
| Attention | **Hybrid** — 1 softmax after every 7 lightning-attention layers |
| Attention heads | 64 (head dim 128) |
| MoE | 32 experts, hidden 9216, top-2 routing |
| Positional | RoPE (half head dim, base 10,000,000) |
| Hidden size | 6144 · Vocab 200,064 |
| Context | 1M train / **4M inference** |

Parallelism: LASP+ (Linear Attention Sequence Parallelism Plus), varlen ring attention, Expert Tensor Parallel (ETP).

**MiniMax-VL-01** adds a 303M ViT (24 layers, patch 14, hidden 1024) + 2-layer MLP projector on top of Text-01, "ViT-MLP-LLM" framework. Dynamic resolution 336×336 → 2016×2016 with a 336×336 thumbnail; images split into non-overlapping patches, encoded with the thumbnail, combined.

## Benchmarks (selected)

**Text** — MMLU 88.5, MMLU-Pro 75.7, IFEval 89.1, Arena-Hard 89.1, C-SimpleQA **67.4** (best in table), MATH 77.4, GSM8k 94.8, HumanEval 86.9. Competitive with GPT-4o / Claude-3.5-Sonnet / DeepSeek-V3 on general/long tasks; mid-pack on pure coding.

**Long context** — Ruler @512K **0.928** / @1M **0.910** (best at extreme lengths). LongBench v2 w/ CoT **56.5** (above human 53.7 and all listed models).

**Vision (VL-01)** — MMMU 68.5, ChartQA 91.7, DocVQA 96.4, OCRBench **865** (best in table), M-LongDoc **32.5** (best). Strong on document/chart/OCR + long-document multimodal.

## Quickstart (Transformers, int8)

```python
from transformers import AutoModelForCausalLM, AutoTokenizer, AutoConfig, QuantoConfig, GenerationConfig

hf_config = AutoConfig.from_pretrained("MiniMaxAI/MiniMax-Text-01", trust_remote_code=True)
quantization_config = QuantoConfig(weights="int8", modules_to_not_convert=["lm_head","embed_tokens", ...])
# multi-GPU device_map across layers (example assumes 8 GPUs)
tokenizer = AutoTokenizer.from_pretrained("MiniMaxAI/MiniMax-Text-01")
model = AutoModelForCausalLM.from_pretrained(
    "MiniMaxAI/MiniMax-Text-01", torch_dtype="bfloat16",
    device_map=device_map, quantization_config=quantization_config,
    trust_remote_code=True, offload_buffers=True)
```
VL-01 uses `AutoProcessor` + image input; same int8/multi-GPU pattern (don't quantize `vision_tower`/`multi_modal_projector`).

**Deployment:** vLLM recommended for production (throughput, paged memory, batching); Transformers path documented too. int8 recommended.

## Fit & Caveats for This Ecosystem

- **Self-hosting is heavyweight** — 456B MoE needs ~8 GPUs even at int8. This GPU-less sandbox can't run it. Use **MiniMax's hosted API / Chatbot**, or rent multi-GPU; don't attempt local inference here.
- **Best near-term value = the MCP server, not self-hosting the LLM.** Adding MiniMax's MCP (video/image/speech/voice-cloning) to `.mcp.json` is low-lift and complements the creative stack. Voice cloning + SkyReels V3 talking avatars + Kokoro/ElevenLabs gives multiple narration paths.
- **Long context as a hosted option** — when Nucleus needs whole-knowledge-base or whole-repo reasoning, MiniMax-Text-01's 4M context (via API) is a candidate alongside Kimi K2 (128K) and Claude (1M) — pick per task; it's strongest specifically at 512K–1M retrieval.
- **VL-01 for document/OCR/chart tasks** — its OCRBench/DocVQA lead suits parsing render briefs, screenshots, or chart-heavy source material feeding the carousel/site pipelines.

## Where It Sits vs Other Models Here

| Need | Model |
|---|---|
| Agentic coding / tool use | Kimi K2 / K2.6 |
| Extreme long context (512K–4M) | **MiniMax-Text-01** |
| Document/OCR/chart vision | **MiniMax-VL-01** (or Kimi for general) |
| Cinematic video | SkyReels V1/2/3 |
| Audio understanding/gen | Kimi-Audio / MiniMax MCP (speech, voice clone) |
| Math animation | KimiK2Manim |

## References

- **Paper**: arXiv:2501.08313 (MiniMax-01: Scaling Foundation Models with Lightning Attention)
- **Weights**: `MiniMaxAI/MiniMax-Text-01`, `MiniMaxAI/MiniMax-VL-01`
- **MCP Server**: MiniMax MCP (video/image/speech/voice cloning) — contact model@minimax.io
- **Serving**: vLLM (recommended) / Transformers

## Citation
```bibtex
@misc{minimax2025minimax01scalingfoundationmodels,
  title={MiniMax-01: Scaling Foundation Models with Lightning Attention},
  author={MiniMax and Aonian Li and others}, year={2025},
  eprint={2501.08313}, archivePrefix={arXiv}, primaryClass={cs.CL},
  url={https://arxiv.org/abs/2501.08313}}
```

---

**Use Case for Ecosystem:** Long-context (4M-token inference) MoE LLM + vision variant. Two hooks: (1) hosted long-context reasoning for Nucleus over the whole knowledge base/repo (SOTA at 512K–1M), and (2) the **MiniMax MCP server** (video/image/speech/voice-cloning) as a low-lift addition to `.mcp.json` complementing creative-stack/higgsfield/pollinations and the narration→talking-avatar path. Self-hosting is ~8-GPU heavyweight — use the hosted API/MCP, not this sandbox. VL-01 leads on OCR/DocVQA for parsing briefs/screenshots into the carousel/site pipelines.
