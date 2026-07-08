# LitGPT — Installation & Workflows Guide

Reference guide for [Lightning-AI/litgpt](https://github.com/Lightning-AI/litgpt): 20+ LLMs
implemented from scratch with no abstractions and full control — blazing fast, minimal, and
performant at enterprise scale.

- ✅ **Enterprise ready** — Apache 2.0 for unlimited enterprise use
- ✅ **Developer friendly** — easy debugging with no abstraction layers and single-file implementations
- ✅ **Optimized performance** — models designed to maximize performance, reduce costs, and speed up training
- ✅ **Proven recipes** — highly-optimized training/finetuning recipes tested at enterprise scale

## Quick Start

Install LitGPT:

```bash
pip install 'litgpt[extra]'
```

Load and use any of the 20+ LLMs:

```python
from litgpt import LLM

llm = LLM.load("microsoft/phi-2")
text = llm.generate("Fix the spelling: Every fall, the family goes to the mountains.")
print(text)
# Corrected Sentence: Every fall, the family goes to the mountains.
```

## Supported Models (selection)

Every model is written from scratch to maximize performance and remove layers of abstraction:

| Model | Model size | Author |
|---|---|---|
| Llama 3, 3.1, 3.2, 3.3 | 1B, 3B, 8B, 70B, 405B | Meta AI |
| Code Llama | 7B, 13B, 34B, 70B | Meta AI |
| CodeGemma | 7B | Google |
| Gemma 2 | 2B, 9B, 27B | Google |
| Phi 4 | 14B | Microsoft Research |
| Qwen2.5 | 0.5B–72B | Alibaba Group |
| Qwen2.5 Coder | 0.5B–32B | Alibaba Group |
| R1 Distill Llama | 8B, 70B | DeepSeek AI |

See the upstream README for the full list of 20+ model families.

## Workflows

Finetune · Pretrain · Continued pretraining · Evaluate · Deploy · Test — all via the CLI:

```bash
# litgpt [action] [model]
litgpt serve     meta-llama/Llama-3.2-3B-Instruct
litgpt finetune  meta-llama/Llama-3.2-3B-Instruct
litgpt pretrain  meta-llama/Llama-3.2-3B-Instruct
litgpt chat      meta-llama/Llama-3.2-3B-Instruct
litgpt evaluate  meta-llama/Llama-3.2-3B-Instruct
```

### Finetune an LLM

Take a pretrained model and further train it on a smaller, specialized dataset:

```bash
# 0) Set up your dataset
curl -L https://huggingface.co/datasets/ksaw008/finance_alpaca/resolve/main/finance_alpaca.json \
  -o my_custom_dataset.json

# 1) Finetune a model (auto-downloads weights)
litgpt finetune microsoft/phi-2 \
  --data JSON \
  --data.json_path my_custom_dataset.json \
  --data.val_split_fraction 0.1 \
  --out_dir out/custom-model

# 2) Test the model
litgpt chat out/custom-model/final

# 3) Deploy the model
litgpt serve out/custom-model/final
```

### Deploy an LLM

`litgpt serve` automatically sets up a web server that can be accessed by a website or app:

```bash
# Deploy an out-of-the-box LLM
litgpt serve microsoft/phi-2

# Deploy your own trained model
litgpt serve path/to/microsoft/phi-2/checkpoint
```

### Evaluate an LLM

Test performance on standard benchmarks (MMLU, TruthfulQA, etc.):

```bash
litgpt evaluate microsoft/phi-2 --tasks 'truthfulqa_mc2,mmlu'
```

### Test an LLM interactively

```bash
litgpt chat microsoft/phi-2

# >> Prompt: What do Llamas eat?
```

### Pretrain / continued pretraining

- **Pretraining** — teach a model by exposing it to a large amount of data before task-specific finetuning.
- **Continued pretraining** — specialize an already-pretrained model by training on custom data.

See the upstream pretraining and continued-pretraining docs for full examples.

## State-of-the-Art Features

- ✅ Flash Attention v2, multi-GPU via fully-sharded data parallelism, optional CPU offloading, TPU/XLA support
- ✅ Low-precision settings: FP16, BF16, and FP16/FP32 mixed
- ✅ Quantization: 4-bit floats, 8-bit integers, and double quantization
- ✅ Parameter-efficient finetuning: LoRA, QLoRA, Adapter, and Adapter v2
- ✅ Configuration files for great out-of-the-box performance
- ✅ Exporting to other popular model weight formats
- ✅ Many popular pretraining/finetuning datasets, plus custom dataset support
- ✅ Readable, easy-to-modify code for experimenting with the latest research ideas

## Training Recipes

Validated YAML configs for training models under different conditions:

```bash
litgpt finetune \
  --config https://raw.githubusercontent.com/Lightning-AI/litgpt/main/config_hub/finetune/llama-2-7b/lora.yaml
```

Any config parameter can also be overridden directly on the CLI.

## Project Highlights

LitGPT powers projects including:

- 📊 **SAMBA** — Simple Hybrid State Space Models for Efficient Unlimited Context Language Modeling
- 🏆 **NeurIPS 2023 LLM Efficiency Challenge** — 1 LLM + 1 GPU + 1 Day
- 🦙 **TinyLlama** — an open-source small language model
- 🍪 **MicroLlama** — MicroLlama-300M
- 🔬 Pre-training small base LMs with fewer tokens

## Acknowledgments & License

Extends **Lit-LLaMA** and **nanoGPT**, powered by **Lightning Fabric** ⚡. Credits to
@karpathy (nanoGPT), @EleutherAI (GPT-NeoX, Evaluation Harness), @TimDettmers (bitsandbytes),
@Microsoft (LoRA), and @tridao (Flash Attention 2).

Released under the **Apache 2.0** license.

```bibtex
@misc{litgpt-2023,
  author       = {Lightning AI},
  title        = {LitGPT},
  howpublished = {\url{https://github.com/Lightning-AI/litgpt}},
  year         = {2023},
}
```
