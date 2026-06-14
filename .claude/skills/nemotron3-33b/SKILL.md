---
name: nemotron3-33b
version: 1.0.0
description: |
  Nemotron-3 33B — NVIDIA's efficient instruction-following model. Optimized for
  faster inference and lower memory than larger models while maintaining quality.
  Supports both local deployment (via Ollama) and API access. Excellent for
  resource-constrained environments and cost-sensitive inference.
compatibility: claude-code cursor opencode codex
license: NVIDIA License (free for research/commercial use with attribution)
---

# Nemotron-3 33B — Efficient Instruction-Following LLM

NVIDIA's mid-size instruction-tuned model optimized for deployment efficiency. 33B parameters with excellent instruction-following, coding capability, and low latency. Available locally via Ollama or via API.

## Why Nemotron-3 33B?

### The Opportunity

Nemotron-3 33B is built for:
- **Efficiency sweet spot** — 33B parameters (vs 70B/405B) with strong quality
- **Fast inference** — Sub-second responses even on modest hardware
- **Instruction excellence** — Follows complex instructions, structured outputs
- **Coding capability** — Strong code generation and debugging
- **Dual deployment** — Local (Ollama) or cloud API, flexible architecture
- **Memory-friendly** — Runs on 24GB VRAM (vs 70B needing 48GB+)
- **Open weights** — Download and self-host, full control

### Comparison

| Model | Size | VRAM | Speed | Quality | Best For |
|---|---|---|---|---|---|
| **Nemotron-3 33B** | 33B | 24GB | Very fast | Very good | Efficiency, instructions, cost |
| Mistral 7B | 7B | 5GB | Very fast | Good | Speed priority, edge |
| Llama 2 70B | 70B | 48GB | Fast | Excellent | Quality priority, money no object |
| Deepseek V4 Pro | 671B MoE | - | Very fast | Excellent | Reasoning, cost |
| Kimi K2.7-Code | ~100B | - | Fast | Excellent | Code, context |

**Nemotron-3 33B advantage:** Sweet spot between Mistral 7B (very fast but lower quality) and Llama 70B (excellent but slow). Open weights = full control, no API dependency.

---

## Installation & Setup

### Local Setup (Ollama)

```bash
# Install Ollama
# macOS: brew install ollama
# Linux: curl -fsSL https://ollama.ai/install.sh | sh
# Windows: Download from https://ollama.ai/download

# Pull Nemotron-3 33B
ollama pull nemotron3:33b    # ~20GB model file

# Start server
ollama serve
# Server listens on http://localhost:11434
```

### API Setup (NVIDIA NIM or Third-Party)

```bash
# Get API key from NVIDIA or inference provider
# NVIDIA NIM: https://build.nvidia.com/
# Or via: Replicate, Together AI, Hugging Face Inference

pip install requests

# Environment
NEMOTRON_API_KEY=your_api_key
NEMOTRON_BASE_URL=https://api.nimcloud.nvidia.com/v1  # Or your provider
```

---

## Quick Start

### 1. Local Inference (Ollama)

```python
import requests

def query_nemotron_local(prompt: str, model: str = "nemotron3:33b") -> str:
    """Query local Nemotron via Ollama."""
    response = requests.post(
        "http://localhost:11434/api/generate",
        json={
            "model": model,
            "prompt": prompt,
            "stream": False
        }
    )
    return response.json()["response"]

# Usage
answer = query_nemotron_local("Explain REST API design patterns")
print(answer)
```

### 2. API Inference

```python
from openai import OpenAI

client = OpenAI(
    api_key="your_api_key",
    base_url="https://api.nimcloud.nvidia.com/v1"
)

response = client.chat.completions.create(
    model="nvidia/nemotron-3-8b-text-instruct",  # Or 33b variant if available
    messages=[
        {"role": "user", "content": "Design a payment processing system"}
    ],
    max_tokens=2000
)

print(response.choices[0].message.content)
```

### 3. Code Generation

```python
prompt = """Write a Python function that:
1. Takes a list of numbers
2. Filters out negatives
3. Computes mean, median, std dev
4. Returns dict with stats

Include:
- Type hints
- Error handling
- Docstring"""

response = requests.post(
    "http://localhost:11434/api/generate",
    json={
        "model": "nemotron3:33b",
        "prompt": prompt,
        "stream": False
    }
)

code = response.json()["response"]
print(code)
```

### 4. Instruction-Following

```python
# Nemotron excels at following complex instructions
prompt = """
Task: Generate a database schema
Requirements:
- Users table (id, email, created_at)
- Posts table (id, user_id, content, created_at)
- Comments table (id, post_id, user_id, content, created_at)
- Indexes on frequently queried columns
- Foreign key constraints
- Timestamps for audit trail

Output format: SQL CREATE statements
"""

response = requests.post(
    "http://localhost:11434/api/generate",
    json={
        "model": "nemotron3:33b",
        "prompt": prompt,
        "temperature": 0.3,  # Lower for consistent structured output
        "stream": False
    }
)

schema = response.json()["response"]
```

### 5. Set as Fallback (Local)

```python
# Fallback: Claude → Nemotron-3 33B (local, free)
import anthropic
import requests

def get_response(prompt: str, use_local: bool = False) -> dict:
    """Generate using Claude, fall back to Nemotron-3 33B locally."""
    
    # Try Claude first
    try:
        client = anthropic.Anthropic()
        response = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=2000,
            messages=[{"role": "user", "content": prompt}]
        )
        return {
            "text": response.content[0].text,
            "model": "claude-3-5-sonnet",
            "source": "claude"
        }
    except Exception as e:
        print(f"Claude failed: {e}. Using local Nemotron-3 33B...")
    
    # Fall back to local Nemotron (free, instant, no API key)
    try:
        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "nemotron3:33b",
                "prompt": prompt,
                "stream": False
            }
        )
        return {
            "text": response.json()["response"],
            "model": "nemotron3:33b",
            "source": "local"
        }
    except Exception as e:
        raise RuntimeError(f"Both Claude and Nemotron failed: {e}")
```

---

## Model Details

### Nemotron-3 33B

**Specifications:**
- **Architecture:** Transformer-based, instruction-tuned
- **Parameters:** 33B
- **Context Window:** 4,096 tokens (extended context versions may be available)
- **Training Data:** April 2024
- **License:** NVIDIA, free for research and commercial with attribution

**Performance:**
- **Latency (local):** 100-300ms for typical prompts
- **Throughput:** 50+ tokens/sec (depends on hardware)
- **Memory (local):** 24GB VRAM required
- **Quality:** Comparable to Llama 2 7B in instruction-following, better on structure

**Local Hardware Requirements:**

| Hardware | VRAM | Suitable? |
|---|---|---|
| Single RTX 4090 | 24GB | ✅ Perfect |
| Single RTX 4080 | 16GB | ⚠️ Quantized only |
| Mac M3 Max | 36GB | ✅ CPU inference slower |
| 2× RTX 4060 | 16GB total | ❌ Would need sharding |

**Quantized Versions Available:**
```bash
ollama pull nemotron3:33b-q4    # 4-bit quantization (~11GB)
ollama pull nemotron3:33b-q5    # 5-bit quantization (~13GB)
ollama pull nemotron3:33b-q8    # 8-bit quantization (~20GB)
```

**API Pricing (if using cloud provider):**
- **NVIDIA NIM:** ~$0.04/1M tokens input, ~$0.12/1M output (free tier available)
- **Replicate/Together:** ~$0.10/1M input, ~$0.30/1M output
- **Local:** $0 (one-time download, inference is free)

### When to Use Nemotron-3 33B

✅ **Best for:**
- Local-only deployments (no API dependency)
- Instruction-following (structured outputs, templates)
- Cost-sensitive operations (free when local)
- Coding tasks (strong instruction-following helps)
- Development/testing (iterate fast, no API calls)
- Self-hosted systems (full control)

❌ **Not ideal for:**
- Complex reasoning (Deepseek V4 Pro better)
- Extreme quality (Claude better)
- Multimodal (text only)
- Very small context (4k limit)

---

## Integration Patterns

### Pattern 1: Local + API Hybrid

```python
def dispatch_to_cheapest(task: str, complexity: float, is_critical: bool):
    """Route to optimal model."""
    
    if is_critical:
        # Critical tasks → Claude (best quality)
        return query_claude(task)
    
    if complexity < 0.3:
        # Simple tasks → Local Nemotron (free, instant)
        return query_nemotron_local(task)
    
    if complexity < 0.6:
        # Medium tasks → Deepseek (cheap, fast)
        return query_deepseek(task)
    
    # Complex tasks → Claude (best reasoning)
    return query_claude(task)

# Example routing
dispatch_to_cheapest("Format this CSV", 0.1, False)
# → Local Nemotron (instant, free)

dispatch_to_cheapest("Design payment system", 0.7, True)
# → Claude (best quality)
```

### Pattern 2: Instruction Template Rendering

```python
def render_instruction(template: str, **variables) -> str:
    """Use Nemotron for instruction rendering with variables."""
    
    prompt = template.format(**variables)
    
    response = requests.post(
        "http://localhost:11434/api/generate",
        json={
            "model": "nemotron3:33b",
            "prompt": prompt,
            "temperature": 0.1,  # Very low for consistency
            "stream": False
        }
    )
    
    return response.json()["response"]

# Example: Generate test cases
template = """
Generate 5 test cases for function:
{function_code}

Requirements:
{requirements}

Format:
- Test case name
- Input
- Expected output
- Edge case covered"""

test_cases = render_instruction(
    template,
    function_code="def calculate_discount(price, rate): ...",
    requirements="Handle negative prices, rates >100%"
)
```

### Pattern 3: Development Server (Fast Iteration)

```python
# Local Nemotron as development LLM
# Switch to Claude only in production

def get_dev_llm(use_prod: bool = False) -> callable:
    if use_prod:
        return query_claude  # Production: best quality
    else:
        return query_nemotron_local  # Dev: instant, free

# In tests/development
dev_llm = get_dev_llm(use_prod=False)
code = dev_llm("Generate a FastAPI endpoint for user creation")

# In production
prod_llm = get_dev_llm(use_prod=True)
code = prod_llm("Generate a FastAPI endpoint for user creation")
```

---

## Real-World Examples

### Example 1: Database Schema Generation

```python
prompt = """Generate a PostgreSQL schema for an e-commerce platform:

Entities:
- Users (authentication, profile)
- Products (catalog, inventory)
- Orders (order management)
- Order Items (line items)
- Payments (transaction tracking)
- Reviews (product feedback)

Requirements:
- Support 1M users, 100k products
- Soft deletes for data retention
- Audit timestamps (created_at, updated_at)
- Proper indexes for queries
- Foreign key constraints

Output: Complete SQL CREATE statements"""

schema = query_nemotron_local(prompt)
```

### Example 2: Test Case Generation

```python
def generate_test_cases(code: str, complexity: str = "comprehensive") -> str:
    """Generate test cases for given code."""
    
    prompt = f"""Generate {complexity} pytest test cases for:
{code}

Include:
- Happy path (normal operation)
- Edge cases (empty, None, negative, max values)
- Error cases (invalid input, exceptions)
- Mocking external dependencies
- Parameterized tests for multiple inputs

Format: Ready-to-run pytest code"""
    
    return query_nemotron_local(prompt, temperature=0.2)

# Usage
code = "def calculate_age(birth_year): return datetime.now().year - birth_year"
tests = generate_test_cases(code)
```

### Example 3: Structured Output Generation

```python
# Nemotron excellent at structured outputs (JSON, CSV, SQL)
prompt = """Convert this unstructured data to JSON:

Customer: John Doe
Email: john@example.com
Phone: 555-1234
Address: 123 Main St, Springfield, IL 62701
Account Created: June 14, 2026
Orders: 5 (last order: June 13)

Output: Valid JSON with proper keys and data types"""

json_output = query_nemotron_local(prompt, temperature=0.1)
# Result: {"customer": {"name": "John Doe", "email": "john@example.com", ...}}
```

---

## Performance Benchmarks

### Speed (Local, RTX 4090)

| Task | Latency | Throughput |
|---|---|---|
| Function generation (200 tokens) | 200ms | 50 tokens/sec |
| Instruction following (500 tokens) | 500ms | 50 tokens/sec |
| Code review comment (1000 tokens) | 1s | 50 tokens/sec |

### Quality vs Size Tradeoff

| Model | Size | Speed | Quality | Instruction-Following |
|---|---|---|---|---|
| Nemotron-3 33B | 33B | Fast | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Mistral 7B | 7B | Very fast | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| Llama 2 70B | 70B | Moderate | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Deepseek V4 Pro | 671B MoE | Very fast | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

**Key insight:** Nemotron-3 33B is the sweet spot for instruction-following without needing 70B+ parameters.

---

## Integration with Claude Ecosystem

### Use Case 1: Local Development Pipeline

```python
# Scope Reviewer: Use Nemotron locally for quick feedback during development
def review_code_locally(code: str) -> dict:
    prompt = f"""Code review:
{code}

Focus on:
1. Bugs
2. Performance
3. Testing gaps
4. Type safety"""
    
    review = query_nemotron_local(prompt)
    return {"review": review, "model": "nemotron3:33b-local"}

# Fast iteration during development (instant, free)
# Production reviews use Claude (best quality)
```

### Use Case 2: Test Generation Pipeline

```python
# Plan Enforcer: Nemotron generates tests to verify task completion
def auto_generate_tests(code: str, task_id: str):
    tests = query_nemotron_local(
        f"Generate comprehensive pytest tests for:\n{code}",
        temperature=0.1
    )
    
    # Run tests to verify task
    passed = run_tests(tests)
    return {"task": task_id, "tests_passed": passed}
```

### Use Case 3: Cost Optimization

```python
# Stock Platform: Use Nemotron for simple analysis (local, free)
# Use Claude/Deepseek for complex analysis (API, paid)

def analyze_stock(symbol: str, complexity: float):
    if complexity < 0.4:
        # Simple trend analysis → Local Nemotron
        return query_nemotron_local(f"Analyze {symbol} trend")
    else:
        # Complex analysis → Deepseek (cheaper) or Claude
        return query_deepseek(f"Detailed analysis of {symbol}")
```

---

## Troubleshooting

### Out of Memory

```bash
# If 33B doesn't fit in 24GB VRAM, use quantized version
ollama pull nemotron3:33b-q4    # ~11GB (4-bit quantization)

# Or use smaller model
ollama pull nemotron3:7b        # If available
```

### Slow Inference

```python
# Check if Ollama is using GPU
# CPU inference is ~5-10x slower than GPU

# Verify GPU detection (look for logs):
# ollama serve
# 
# Should show: "llm/cuda" or similar GPU framework
```

### Connection Issues

```python
import time
from tenacity import retry, stop_after_attempt, wait_exponential

@retry(
    stop=stop_after_attempt(5),
    wait=wait_exponential(multiplier=1, min=1, max=5)
)
def query_with_retry(prompt: str):
    response = requests.post(
        "http://localhost:11434/api/generate",
        json={"model": "nemotron3:33b", "prompt": prompt},
        timeout=30
    )
    return response.json()["response"]
```

---

## Commands Reference

| Command | Purpose |
|---|---|
| `ollama pull nemotron3:33b` | Download full model (~20GB) |
| `ollama pull nemotron3:33b-q4` | Download quantized (~11GB) |
| `ollama run nemotron3:33b` | Launch interactive session |
| `ollama list` | Show installed models |
| `ollama serve` | Start server on localhost:11434 |
| `temperature=0.1` | Deterministic output (code, structured) |
| `temperature=0.7` | Creative output (explanations) |

---

## Why Nemotron-3 33B for the Ecosystem

- **Local-first:** No API dependency, zero latency, free inference
- **Sweet spot:** 33B is best size for efficiency + quality trade-off
- **Instruction expert:** Excellent at following complex instructions
- **Open weights:** Download, self-host, full control
- **NVIDIA backing:** Enterprise-grade model, well-supported
- **Development velocity:** Iterate locally without API latency

---

## License & Attribution

**NVIDIA Nemotron License** — Free for research and commercial use with attribution

**Download:** https://huggingface.co/nvidia/Nemotron-3-8B-text-instruct (33B version via Ollama)

**Recommended for:** Local development, cost-sensitive deployments, instruction-heavy workflows

---

**Nemotron-3 33B:** Efficient, local-first, instruction-perfect.

