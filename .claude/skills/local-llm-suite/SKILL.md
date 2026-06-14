---
name: local-llm-suite
version: 1.0.0
description: |
  Run local LLM inference with Ollama. Install and manage Llama2, Mistral, Qwen2,
  and Neural-Chat models. Use for API fallback, privacy-first inference, cost
  optimization, and multi-model comparison. Zero external API calls when running locally.
compatibility: claude-code cursor opencode
license: MIT
---

# Local LLM Suite — Ollama Integration for Claude Ecosystem

Run state-of-the-art open-source LLMs locally. No API calls, no costs, full control.

## Why Local LLMs?

### Use Cases

1. **API Fallback** — When Claude API is down or rate-limited, use local model
2. **Cost Optimization** — Free inference for high-volume tasks (no per-token charges)
3. **Privacy** — Keep data local, no external API calls
4. **Multi-Model Comparison** — Test same task on Llama2, Mistral, Qwen2
5. **Development** — Fast iteration without API delays
6. **Offline** — Run anywhere, no internet required

### Supported Models

| Model | Size | Speed | Quality | Use Case |
|---|---|---|---|---|
| **Llama2** | 7B/13B/70B | Fast | Good | General purpose, balanced |
| **Mistral** | 7B | Very Fast | Good | Speed-critical, small memory |
| **Qwen2** | 7B/14B | Fast | Excellent | Best quality, multilingual |
| **Neural-Chat** | 7B | Fast | Good | Dialogue-focused |

---

## Installation

### Prerequisites

```bash
# macOS
brew install ollama

# Linux
curl -fsSL https://ollama.ai/install.sh | sh

# Windows
# Download from https://ollama.ai/download/windows

# Verify
ollama --version
```

### Pull Models

```bash
# Pull all four models (one-time, ~20GB total)
ollama pull llama2           # 3.8GB
ollama pull mistral          # 4.1GB
ollama pull qwen2            # 4.9GB
ollama pull neural-chat      # 3.8GB

# Or individually:
ollama pull llama2:7b        # Smaller variant
ollama pull qwen2:13b        # Larger variant
```

### Start Ollama Server

```bash
# Start in background (daemon)
ollama serve

# Or run in another terminal while developing
# Server listens on http://localhost:11434
```

---

## Quick Start

### 1. Run a Model

```bash
# Launch Llama2
ollama run llama2

# Type a prompt:
# > What is the capital of France?
# Paris

# Type /bye to exit, or Ctrl+C
```

### 2. Use in Code

```python
# Python example (FastAPI)
import requests
import json

def query_local_llm(model: str, prompt: str) -> str:
    """Query local Ollama model."""
    url = "http://localhost:11434/api/generate"
    payload = {
        "model": model,
        "prompt": prompt,
        "stream": False
    }
    response = requests.post(url, json=payload)
    return response.json()["response"]

# Usage
answer = query_local_llm("llama2", "Explain OAuth in one sentence")
print(answer)
```

### 3. Set as Fallback

```python
# Fallback chain: Claude → Ollama
import anthropic

def get_response(prompt: str) -> str:
    try:
        # Try Claude first
        client = anthropic.Anthropic()
        response = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            messages=[{"role": "user", "content": prompt}]
        )
        return response.content[0].text
    except Exception as e:
        print(f"Claude API failed: {e}. Using local Llama2...")
        # Fall back to local Llama2
        return query_local_llm("llama2", prompt)
```

---

## Model Comparison

### Llama2 (Meta)

**Sizes:** 7B, 13B, 70B  
**Best for:** General purpose, balanced quality/speed

```bash
ollama run llama2      # 7B (default)
ollama run llama2:13b  # 13B (better quality)
```

**Strengths:**
- Wide adoption, lots of examples
- Good instruction-following
- Strong on reasoning tasks

**Weaknesses:**
- Larger than Mistral for same quality
- Not great on multilingual tasks

---

### Mistral (Mistral AI)

**Size:** 7B  
**Best for:** Speed, low memory, cost

```bash
ollama run mistral
```

**Strengths:**
- Fastest inference (2-3x faster than Llama2 7B)
- Low VRAM (~6GB)
- Excellent instruction-following
- Good on coding tasks

**Weaknesses:**
- Smaller context window (8k vs 4k)
- Less multilingual than Qwen

---

### Qwen2 (Alibaba)

**Sizes:** 7B, 14B  
**Best for:** Quality, multilingual, math/coding

```bash
ollama run qwen2       # 7B (default)
ollama run qwen2:14b   # 14B (better for complex tasks)
```

**Strengths:**
- Excellent multilingual support (100+ languages)
- Strong on math/coding
- Best instruction-following among 7B models
- Large context window (32k)

**Weaknesses:**
- Slightly slower than Mistral
- More VRAM needed than Mistral

---

### Neural-Chat (Intel)

**Size:** 7B  
**Best for:** Dialogue, conversation

```bash
ollama run neural-chat
```

**Strengths:**
- Optimized for multi-turn conversation
- Natural dialogue flow
- Lightweight

**Weaknesses:**
- Less general-purpose than Llama2
- Fewer examples online

---

## Integration with my-api

### Setup: API Fallback

```python
# src/llm/client.py

import anthropic
import requests
from typing import Optional

class HybridLLMClient:
    """Claude API with Ollama fallback."""
    
    def __init__(self, 
                 claude_model: str = "claude-3-5-sonnet-20241022",
                 fallback_model: str = "llama2",
                 ollama_url: str = "http://localhost:11434"):
        self.claude_model = claude_model
        self.fallback_model = fallback_model
        self.ollama_url = ollama_url
        self.client = anthropic.Anthropic()
    
    def generate(self, prompt: str, max_tokens: int = 1000) -> dict:
        """Generate using Claude, fall back to Ollama if needed."""
        
        # Try Claude
        try:
            response = self.client.messages.create(
                model=self.claude_model,
                max_tokens=max_tokens,
                messages=[{"role": "user", "content": prompt}]
            )
            return {
                "text": response.content[0].text,
                "model": self.claude_model,
                "source": "claude"
            }
        except Exception as e:
            print(f"Claude failed: {e}. Trying {self.fallback_model}...")
            
        # Fall back to Ollama
        try:
            response = requests.post(
                f"{self.ollama_url}/api/generate",
                json={
                    "model": self.fallback_model,
                    "prompt": prompt,
                    "stream": False,
                    "num_predict": max_tokens
                },
                timeout=60
            )
            response.raise_for_status()
            return {
                "text": response.json()["response"],
                "model": self.fallback_model,
                "source": "ollama"
            }
        except Exception as e:
            raise RuntimeError(f"Both Claude and Ollama failed: {e}")

# Usage in FastAPI
from fastapi import APIRouter

llm = HybridLLMClient()

@router.post("/api/v1/generate")
async def generate(prompt: str):
    result = llm.generate(prompt)
    return result
```

### Comparison Endpoint

```python
@router.post("/api/v1/compare")
async def compare_models(prompt: str):
    """Compare response across all local models."""
    
    models = ["llama2", "mistral", "qwen2", "neural-chat"]
    results = {}
    
    for model in models:
        try:
            response = requests.post(
                "http://localhost:11434/api/generate",
                json={
                    "model": model,
                    "prompt": prompt,
                    "stream": False
                },
                timeout=120
            )
            results[model] = response.json()["response"]
        except Exception as e:
            results[model] = f"Error: {e}"
    
    return results
```

---

## Performance Benchmarks

### Inference Speed (on M2 Mac, 7B models)

| Model | Tokens/sec | Latency (100 tokens) |
|---|---|---|
| Mistral | 12-14 | 7-8 sec |
| Llama2 | 8-10 | 10-12 sec |
| Qwen2 | 7-9 | 11-13 sec |
| Neural-Chat | 10-12 | 8-10 sec |

### Memory Usage

| Model | VRAM | RAM |
|---|---|---|
| Mistral 7B | 5GB | 4GB |
| Llama2 7B | 6GB | 5GB |
| Qwen2 7B | 6GB | 5GB |
| Neural-Chat 7B | 5GB | 4GB |

**Rule of thumb:** Allocate 1.5x the model size in VRAM.

---

## Use Cases in Ecosystem

### 1. Stock Platform Fallback

```python
# StockRecommendationPlatform with local LLM fallback
def generate_recommendation(symbol: str) -> str:
    try:
        # Try Claude API
        return claude_recommendation(symbol)
    except RateLimitError:
        # Fall back to Llama2 (still good for analysis)
        return ollama_recommendation(symbol)
```

### 2. Multi-Model A/B Testing

```python
# /scope-reviewer uses both models for independent analysis
def review_code(code: str) -> dict:
    claude_review = llm.generate(f"Code review: {code}", model="claude")
    ollama_review = llm.generate(f"Code review: {code}", model="qwen2")
    
    return {
        "claude": claude_review,
        "ollama": ollama_review,
        "consensus": synthesize_reviews(claude_review, ollama_review)
    }
```

### 3. Cost Optimization

```python
# Use local model for simple tasks, Claude for complex ones
def smart_dispatch(task: str, complexity: float) -> str:
    if complexity < 0.3:
        # Simple task → use local Mistral (free, fast)
        return query_local_llm("mistral", task)
    else:
        # Complex task → use Claude (better quality)
        return query_claude(task)
```

### 4. Offline Development

```bash
# Develop features locally without internet
# Use local LLM for testing, deploy with Claude API
ollama run qwen2
# ... develop with local model ...
# ... test, commit ...
# ... deploy, switch to Claude API in production
```

---

## Commands

| Command | What it does |
|---|---|
| `ollama pull <model>` | Download model (~4-5GB each) |
| `ollama run <model>` | Launch interactive session |
| `ollama list` | Show installed models |
| `ollama rm <model>` | Delete model to free space |
| `ollama serve` | Start server (background) |
| `curl http://localhost:11434/api/generate -d '{"model":"llama2","prompt":"hi"}'` | Query via curl |

---

## Troubleshooting

### Port Already in Use

```bash
# Ollama defaults to port 11434
# If in use, specify different port:
OLLAMA_HOST=127.0.0.1:11435 ollama serve
```

### Out of Memory

```bash
# Reduce model size or enable memory limits
# For 8GB system:
ollama run mistral:7b     # Works
ollama run llama2:13b     # Might not work
ollama run qwen2:14b      # Unlikely to work

# Or use quantized models (smaller):
ollama run mistral:7b-q4  # Quantized (faster, less VRAM)
```

### Slow Inference

```bash
# 1. Check if server is running
curl http://localhost:11434/api/tags

# 2. Use faster model
ollama run mistral  # Instead of llama2

# 3. Enable GPU acceleration
# Ollama auto-detects and uses GPU if available
# Check logs for "GPU layers"
```

---

## Ecosystem Integration Path

### Phase 1: Setup (Day 1)

```bash
ollama pull llama2 mistral qwen2 neural-chat
ollama serve
# Server running on localhost:11434
```

### Phase 2: Development (Day 2-3)

```python
# Add to my-api
# src/llm/client.py (as shown above)
# Implement fallback in FastAPI endpoints
```

### Phase 3: Testing (Day 4)

```bash
/scope-reviewer (uses local models for independent analysis)
/code-review (can use Ollama for comparison)
```

### Phase 4: Production (Day 5+)

```
Claude API: Primary (in cloud)
Ollama: Fallback + offline development (local machine)
```

---

## Cost Savings

**Example: 10,000 API requests/month**

- **Claude API (Sonnet):** ~$10-20/month
- **Ollama (local):** $0 (free, one-time ~20GB download)

**Break-even:** If running >500 inference calls/day locally, Ollama pays for itself in electricity (<$1/month).

---

## License

MIT — Ollama is open-source, models have various licenses (Llama: Meta Community License, Mistral/Qwen: Apache 2.0, etc.)

---

## Resources

- **Ollama:** https://ollama.ai/
- **Model Library:** https://ollama.ai/library
- **GitHub:** https://github.com/jmorganca/ollama
- **Benchmarks:** https://huggingface.co/spaces/ollama/ollama-benchmark

---

**Local LLM Suite:** Free, offline, always available.
