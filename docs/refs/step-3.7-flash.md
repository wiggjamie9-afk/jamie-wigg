# Step 3.7 Flash

- [Model Page](https://static.stepfun.com/blog/step-3.7-flash/)
- HuggingFace:
  - BF16: https://huggingface.co/stepfun-ai/Step-3.7-Flash/
  - FP8: https://huggingface.co/stepfun-ai/Step-3.7-Flash-FP8
  - NVFP4: https://huggingface.co/stepfun-ai/Step-3.7-Flash-NVFP4
  - GGUF: https://huggingface.co/stepfun-ai/Step-3.7-Flash-GGUF

## 1. Introduction

Step 3.7 Flash is a 198B-parameter sparse Mixture-of-Experts (MoE) vision-language model that combines a 196B-parameter language backbone with a 1.8B-parameter vision encoder for native image understanding. Engineered for high-frequency production workloads, it activates approximately 11B parameters per token and delivers a throughput of up to 400 tokens per second. Step 3.7 Flash supports a 256k context window and offers three selectable reasoning levels (low, medium, and high) so developers can easily balance speed, cost, and cognitive depth.

Built for developers who need to scale agentic workflows that combine perception, search, and reasoning. Designed to handle intensive tasks such as parsing massive financial reports in one pass, running multi-step search loops with cross-source verification, or operating concurrent coding agents in high-throughput pipelines.

## 2. Capabilities & Performance

### Multimodal Perception and Verification

- First place on SimpleVQA (Search): **79.2**
- Frontier parity on V* (Python): **95.3**

Accurately processes dense visual interfaces (UI wireframes, app GUIs, data charts) and maps them into structured code. Can independently identify missing data and execute lookups to verify context before returning a factually verified conclusion.

### Workflow Integrity and Tool Orchestration

- **ClawEval-1.1**: 67.1 (next competitor: 59.8)
- **Toolathlon**: 49.5
- **HLE w. Tool**: 48.1

High resistance to adversarial traps, strict adherence to system policies during multi-turn orchestration.

### Code Engineering

- **SWE-Bench PRO**: 56.3 (second place)
- **Terminal-Bench 2.1**: 59.5
- **GDPVal-AA**: 45.8

Can trace multi-file repositories, isolate bugs from raw issue reports, and generate functional patches that pass automated unit tests.

### NVFP4 + MTP

NVFP4-quantized variant for NVIDIA GPUs. Supports vLLM speculative decoding with:

```
--speculative-config '{"method": "mtp", "num_speculative_tokens": 3}'
```

Throughput gains on GB200 TP=4 (GPQA-style long-reasoning prompts):

| Concurrency | NVFP4 + MTP | NVFP4 no-MTP | Speedup |
|---|---|---|---|
| 8 | 1309 tok/s | 1155 tok/s | 1.13x |
| 32 | 4391 tok/s | 3480 tok/s | 1.26x |
| 64 | 8229 tok/s | 5667 tok/s | 1.45x |

## 3. Pricing

| Token Type | Price |
|---|---|
| Input (cache miss) | $0.20 / M tokens |
| Input (cache hit) | $0.04 / M tokens |
| Output | $1.15 / M tokens |

## 4. Availability & Ecosystem

**Hosted APIs:**
- StepFun Open Platform: `platform.stepfun.ai` (Global) / `platform.stepfun.com` (China)
- OpenRouter, NVIDIA NIM
- Coming: DeepInfra, Fireworks AI, Modal

**Local/on-prem hardware:** NVIDIA DGX Station, AMD Ryzen AI Max+ 395, Mac Studio / MacBook Pro with ≥128 GB unified memory.

**Inference backends:** vLLM, SGLang, Hugging Face Transformers, llama.cpp.

**Model development:** NVIDIA NeMo (AutoModel, Megatron Core, Megatron Bridge).

## 5. Quick Start

Pick the base URL for your region — your API key only works on the platform where it was issued:

```bash
export STEP_API_KEY="sk-..."
export STEP_BASE_URL="https://api.stepfun.ai/v1"   # China: https://api.stepfun.com/v1
```

### Chat

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["STEP_API_KEY"],
    base_url=os.environ["STEP_BASE_URL"],
)

completion = client.chat.completions.create(
    model="step-3.7-flash",
    messages=[
        {
            "role": "system",
            "content": "You are an AI assistant provided by StepFun.",
        },
        {"role": "user", "content": "Introduce StepFun's artificial intelligence capabilities."},
    ],
)
print(completion)
```

### Text + Image

```python
completion = client.chat.completions.create(
    model="step-3.7-flash",
    messages=[
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "What is in this picture?"},
                {"type": "image_url", "image_url": {"url": "https://example.com/photo.jpg"}},
            ],
        },
    ],
)
```

## 6. Local Deployment

### vLLM

Use StepFun's prebuilt Docker image: `docker pull vllm/vllm-openai:stepfun37`

```bash
# FP8
vllm serve <MODEL_PATH_OR_HF_ID> \
  --served-model-name step3p7-flash \
  --tensor-parallel-size 8 \
  --enable-expert-parallel \
  --disable-cascade-attn \
  --reasoning-parser step3p5 \
  --enable-auto-tool-choice \
  --tool-call-parser step3p5 \
  --speculative-config '{"method": "mtp", "num_speculative_tokens": 3}' \
  --trust-remote-code
```

```bash
# NVFP4
python3 -m vllm.entrypoints.openai.api_server \
  --model stepfun-ai/Step-3.7-Flash-NVFP4 \
  --tensor-parallel-size 4 \
  --quantization modelopt \
  --kv-cache-dtype fp8 \
  --reasoning-parser step3p5 \
  --enable-auto-tool-choice \
  --tool-call-parser step3p5 \
  --speculative-config '{"method": "mtp", "num_speculative_tokens": 3}'
```

### SGLang

```bash
docker pull lmsysorg/sglang:dev-step-3.7-flash
```

```bash
# FP8
sglang serve --model-path stepfun-ai/Step-3.7-Flash-FP8 \
  --tp 8 --ep 4 \
  --reasoning-parser step3p5 \
  --tool-call-parser step3p5 \
  --enable-multimodal \
  --speculative-algorithm EAGLE \
  --speculative-num-steps 3 \
  --speculative-eagle-topk 1 \
  --speculative-num-draft-tokens 4 \
  --enable-multi-layer-eagle \
  --trust-remote-code \
  --host 0.0.0.0 --port 8000
```

### Transformers (debug/verification only)

Requires transformers 5.0+.

```python
from transformers import AutoProcessor, AutoModelForCausalLM

MODEL_PATH = "<MODEL_PATH_OR_HF_ID>"

processor = AutoProcessor.from_pretrained(MODEL_PATH, trust_remote_code=True)
model = AutoModelForCausalLM.from_pretrained(MODEL_PATH, device_map="auto", dtype="auto", trust_remote_code=True)

messages = [{"role": "user", "content": [
    {"type": "image", "url": "https://example.com/photo.jpg"},
    {"type": "text", "text": "What is in this picture?"}
]}]

inputs = processor.apply_chat_template(
    messages, tokenize=True, add_generation_prompt=True,
    return_dict=True, return_tensors="pt",
).to(model.device)

generated_ids = model.generate(**inputs, max_new_tokens=128, do_sample=False)
print(processor.decode(generated_ids[0][inputs.input_ids.shape[1]:], skip_special_tokens=True))
```

### llama.cpp

**GGUF sizes:**

| Quantization | File Size |
|---|---|
| Q4_K_S | 111.5 GB |
| IQ4_XS | 104.99 GB |
| Q3_K_L | 102.5 GB |
| Multimodal Projector (FP16) | 3.97 GB |

**Minimum memory:** 120 GB unified memory/VRAM. Recommended: 128 GB.

```bash
git clone https://github.com/stepfun-ai/llama.cpp.git
cd llama.cpp && git checkout -b step3.7 origin/step3.7

# Mac
cmake -B build-macos -S . -DCMAKE_BUILD_TYPE=Release \
  -DGGML_METAL=ON -DGGML_BLAS=ON -DGGML_BLAS_VENDOR=Apple -DGGML_NATIVE=ON
cmake --build build-macos -j8

# Run
./llama-cli -m Step3.7_Q4_K_S.gguf -b 2048 -ub 2048 -fa on --temp 1.0 -p "What's your name?"
```

## 7. Agent Platform Support

Step 3.7 Flash is available on: Hermes Agent, OpenClaw, Kilo Code.

## 8. License

Apache 2.0
