---
name: gemma-models
version: 1.0.0
description: |
  Run Google's Gemma models locally via Ollama. Lightweight, efficient open-source LLMs
  (2B, 7B) for edge devices, mobile, and resource-constrained environments. Fast inference,
  minimal dependencies, Apache 2.0 licensed.
compatibility: claude-code codex opencode
license: Apache 2.0 (Google Gemma)
---

# Gemma Models Suite — Google's Efficient Open LLMs

Run Google's Gemma models locally. Lightweight, fast, open-source. No API calls, no costs.

## Why Gemma?

### The Opportunity

Gemma models are built for:
- **Edge devices** (Raspberry Pi, mobile phones, IoT)
- **Resource-constrained environments** (small memory, slow CPUs)
- **Fast inference** (optimized for speed over size)
- **Privacy-first** (runs fully local, no external calls)

### Comparison

| Model | Size | VRAM | Speed | Quality | Best For |
|---|---|---|---|---|---|
| **Gemma 2B** | 2B | 4GB | Very fast | Good | Edge devices, mobile |
| **Gemma 7B** | 7B | 8GB | Fast | Very good | Local development, fallback |
| **Llama2 7B** | 7B | 6GB | Fast | Good | General purpose |
| **Mistral 7B** | 7B | 5GB | Very fast | Good | Speed-critical |
| **Qwen2 7B** | 7B | 6GB | Fast | Excellent | Best quality |

**Gemma advantage:** Smallest model size, lowest VRAM, Apache 2.0 licensed (most permissive).

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

### Pull Gemma Models

```bash
# Pull both models (one-time, ~9GB total)
ollama pull gemma:2b        # 1.5GB
ollama pull gemma:7b        # 7.5GB

# Or individually
ollama pull gemma:2b-instruct   # Instruction-tuned 2B
ollama pull gemma:7b-instruct   # Instruction-tuned 7B
```

### Start Ollama Server

```bash
# Start in background (daemon)
ollama serve

# Or run in another terminal
# Server listens on http://localhost:11434
```

---

## Quick Start

### 1. Run a Model

```bash
# Launch Gemma 2B (smallest, fastest)
ollama run gemma:2b

# Or Gemma 7B (better quality)
ollama run gemma:7b

# Type a prompt:
# > What is machine learning?
# Machine learning is...

# Exit: /bye or Ctrl+C
```

### 2. Use in Code

```python
# Python example (FastAPI)
import requests
import json

def query_gemma(model: str, prompt: str) -> str:
    """Query local Gemma model."""
    url = "http://localhost:11434/api/generate"
    payload = {
        "model": model,
        "prompt": prompt,
        "stream": False
    }
    response = requests.post(url, json=payload)
    return response.json()["response"]

# Usage
answer = query_gemma("gemma:2b", "Explain quantum computing in one sentence")
print(answer)
```

### 3. Set as Fallback

```python
# Fallback chain: Claude → Gemma 2B
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
        print(f"Claude API failed: {e}. Using local Gemma 2B...")
        # Fall back to Gemma (instant, free)
        return query_gemma("gemma:2b", prompt)
```

---

## Model Details

### Gemma 2B

**Size:** 2B parameters  
**VRAM:** 4GB (minimum viable for 7B: 8GB)  
**Speed:** Extremely fast (20-30 tokens/sec)

```bash
ollama run gemma:2b
```

**Best for:**
- Edge devices (Raspberry Pi, phones)
- Mobile deployment
- Real-time response requirements
- Resource-constrained servers

**Strengths:**
- Smallest model size
- Lowest VRAM requirement
- Very fast inference
- Apache 2.0 licensed

**Weaknesses:**
- Lower quality than 7B
- Limited reasoning capabilities
- Not great for complex tasks

---

### Gemma 7B

**Size:** 7B parameters  
**VRAM:** 8GB  
**Speed:** Fast (8-12 tokens/sec)

```bash
ollama run gemma:7b
```

**Best for:**
- Local development fallback
- General-purpose inference
- Quality + speed balance
- Offline deployment

**Strengths:**
- Good quality (competitive with Llama2 7B)
- Much smaller than Qwen2 7B with similar quality
- Very stable inference
- Apache 2.0 licensed

**Weaknesses:**
- Slightly slower than Mistral
- Larger than Gemma 2B
- More VRAM required

---

### Instruction-Tuned Variants

Both sizes have instruction-tuned versions (optimized for Q&A):

```bash
ollama run gemma:2b-instruct    # Better at following instructions
ollama run gemma:7b-instruct    # Conversational, helpful responses
```

---

## Integration with Claude Ecosystem

### Use Case 1: Edge Deployment

Use Gemma 2B for resource-constrained environments:

```python
# my-api: Edge fallback
class HybridLLMClient:
    def generate(self, prompt: str) -> dict:
        try:
            # Try Claude first
            return query_claude(prompt)
        except RateLimitError:
            # Try Qwen2 (better quality)
            return query_ollama("qwen2:7b", prompt)
        except Exception:
            # Fall back to Gemma 2B (always available)
            return query_ollama("gemma:2b", prompt)
```

### Use Case 2: Mobile/IoT

Deploy Gemma 2B on mobile devices:

```python
# Raspberry Pi, mobile phone, IoT device
# Gemma 2B: 4GB VRAM, super fast
response = query_gemma("gemma:2b", "Is temperature too high?")
```

### Use Case 3: Parallel Model Testing

```python
@router.post("/api/v1/compare-edge")
async def compare_edge_models(prompt: str):
    """Compare edge-friendly models."""
    
    models = ["gemma:2b", "gemma:7b", "mistral:7b"]
    results = {}
    
    for model in models:
        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": model,
                "prompt": prompt,
                "stream": False
            },
            timeout=60
        )
        results[model] = response.json()["response"]
    
    return results
```

---

## Performance Benchmarks

### Inference Speed (on M2 Mac)

| Model | Tokens/sec | Latency (50 tokens) |
|---|---|---|
| Gemma 2B | 25-30 | 1.7-2.0 sec |
| Gemma 7B | 8-12 | 4-6 sec |
| Mistral 7B | 12-14 | 3.5-4 sec |
| Llama2 7B | 8-10 | 5-6 sec |

### Memory Usage

| Model | VRAM | RAM | Total |
|---|---|---|---|
| Gemma 2B | 4GB | 2GB | 6GB |
| Gemma 7B | 8GB | 3GB | 11GB |
| Mistral 7B | 5GB | 4GB | 9GB |
| Llama2 7B | 6GB | 5GB | 11GB |

---

## Use Cases

### 1. Offline-First Development

```bash
# Develop locally without internet
ollama run gemma:7b
# ... build features with local model ...
# ... commit, push ...
# ... deploy with Claude API in production
```

### 2. Edge AI

```python
# Raspberry Pi: Gemma 2B
# Real-time inference on device, no cloud calls
response = query_gemma("gemma:2b", "Temperature alert?")
```

### 3. Cost Optimization at Scale

```python
# Simple task → Gemma 2B (free, instant)
# Complex task → Gemma 7B (free, 6 sec)
# Critical task → Claude API (best quality)

def smart_dispatch(task: str, complexity: float):
    if complexity < 0.2:
        return query_ollama("gemma:2b", task)  # Free
    elif complexity < 0.6:
        return query_ollama("gemma:7b", task)  # Free
    else:
        return query_claude(task)  # Best quality
```

### 4. Multi-Model A/B Testing

```python
# Compare Gemma vs other models
def compare_response(prompt: str):
    gemma_2b = query_ollama("gemma:2b", prompt)
    gemma_7b = query_ollama("gemma:7b", prompt)
    mistral = query_ollama("mistral:7b", prompt)
    claude = query_claude(prompt)
    
    return {
        "gemma_2b": gemma_2b,      # Fastest
        "gemma_7b": gemma_7b,      # Best Gemma
        "mistral": mistral,        # Fast, good
        "claude": claude           # Best quality
    }
```

---

## Troubleshooting

### Out of Memory

```bash
# Gemma 2B works on 4GB systems
ollama run gemma:2b     # OK on most machines

# Gemma 7B needs 8GB+
ollama run gemma:7b     # May fail on 4GB systems
```

### Slow Inference

```bash
# Use smaller model
ollama run gemma:2b     # Instead of gemma:7b

# Or check if server is running
curl http://localhost:11434/api/tags
```

### Model Not Found

```bash
# Download first
ollama pull gemma:2b
ollama pull gemma:7b

# Then run
ollama run gemma:2b
```

---

## Commands

| Command | What it does |
|---|---|
| `ollama pull gemma:2b` | Download Gemma 2B (~1.5GB) |
| `ollama pull gemma:7b` | Download Gemma 7B (~7.5GB) |
| `ollama run gemma:2b` | Launch interactive session |
| `ollama list` | Show installed models |
| `ollama rm gemma:2b` | Delete model to free space |
| `ollama serve` | Start server (background) |

---

## License & Attribution

**Apache 2.0** — Most permissive open-source license.

- **Gemma models:** Google LLC
- **Ollama:** Jared Morgan
- **Ecosystem integration:** Claude Ecosystem

---

## Real-World Example

### Scenario: Offline IoT Alert System

```python
# Raspberry Pi: Real-time temperature monitoring
# No internet connection, no API costs

import requests
import time

def monitor_temperature():
    threshold = 75  # Fahrenheit
    
    while True:
        # Simulate temperature sensor
        current_temp = get_sensor_reading()
        
        if current_temp > threshold:
            # Alert: Use Gemma 2B (instant, on-device)
            prompt = f"Temperature is {current_temp}°F. Is this dangerous? Yes/no."
            response = query_ollama("gemma:2b", prompt)
            
            if "yes" in response.lower():
                send_alert(f"High temperature: {current_temp}°F")
        
        time.sleep(30)  # Check every 30 seconds
```

---

## Resources

- **Gemma:** https://ai.google.dev/gemma
- **Ollama:** https://ollama.ai/
- **Model Library:** https://ollama.ai/library
- **Benchmarks:** https://huggingface.co/spaces/gemma/gemma-benchmarks

---

**Gemma Models Suite:** Lightweight, efficient, open, Apache 2.0 licensed.
