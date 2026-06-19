# /m3-think Skill

Extended reasoning with MiniMax M3 for million-token contexts and complex analysis.

## Usage

```bash
/m3-think <query> [options]
```

## Examples

### Deep architectural analysis
```bash
/m3-think "Design a resilient payment system for RHYTHMIX Studio" --reasoning enabled
```

### Long-form document analysis
```bash
/m3-think "Summarize and analyze this 500k token codebase" --context 500k
```

### Adaptive reasoning (auto-detect)
```bash
/m3-think "What's the capital of France?" --reasoning adaptive
```

### Throughput mode (fastest)
```bash
/m3-think "Generate 100 creative prompts" --reasoning disabled
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `--provider` | enum | minimax | Backend: `minimax` (local/cloud), `openrouter`, `groq` |
| `--model` | string | provider default | Override the model id for the chosen provider |
| `--reasoning` | enum | adaptive | Mode: `enabled`, `adaptive`, `disabled` |
| `--context` | int | 32k | Context size in tokens (up to 1M) |
| `--temperature` | float | 1.0 | Reasoning consistency (0.0-2.0) |
| `--top-p` | float | 0.95 | Diversity (0.0-1.0) |
| `--top-k` | int | 40 | Token filtering (minimax/openrouter only; ignored by groq) |
| `--max-tokens` | int | 4096 | Max output tokens |
| `--timeout` | int | 60 | Timeout in seconds |

## Providers

The M3 MCP server (`.claude/mcp/minimax/server.mjs`) routes to any
OpenAI-compatible backend. The default provider is `MINIMAX_PROVIDER` (env),
falling back to `minimax`.

| Provider | Default model | Notes |
|----------|---------------|-------|
| `minimax` | `MiniMax-M3-text` | Local SGLang/vLLM or MiniMax cloud. Supports native `thinking` budget. |
| `openrouter` | `meta-llama/llama-3.3-70b-instruct:free` | Free tier, 50 req/day. Set `OPENROUTER_API_KEY`. |
| `groq` | `llama-3.3-70b-versatile` | Ultra-fast free tier. Set `GROQ_API_KEY`. `top_k` not supported. |

```bash
# Use the local MiniMax server (default)
/m3-think "Analyze this architecture" --reasoning enabled

# Route to OpenRouter's free Llama 3.3 70B
/m3-think "Summarize these release notes" --provider openrouter

# Route to Groq for fast throughput, pick a specific model
/m3-think "Draft 20 taglines" --provider groq --model openai/gpt-oss-120b --reasoning disabled
```

## Reasoning Modes

### enabled
- **Use when**: Deep analysis, architecture, complex reasoning needed
- **Output**: Extended thinking + solution
- **Latency**: 5-10 seconds
- **Cost**: Higher (includes reasoning tokens)

### adaptive
- **Use when**: General tasks, uncertain if reasoning needed
- **Output**: M3 auto-decides reasoning depth
- **Latency**: 2-5 seconds
- **Cost**: Medium (pay only for reasoning when used)

### disabled
- **Use when**: Speed matters, task is straightforward
- **Output**: Direct response, no reasoning
- **Latency**: <1 second
- **Cost**: Lower (no reasoning overhead)

## Performance Characteristics

| Task | Reasoning | Time | Tokens |
|------|-----------|------|--------|
| Simple Q&A | disabled | <1s | 100-500 |
| Code review (10k tokens) | adaptive | 3-5s | 500-2k |
| Architecture design | enabled | 8-15s | 2k-8k |
| Million-token analysis | enabled | 30-60s | 5k-10k |

## Integration with Other Skills

### With /spec-quick
```bash
/m3-think "Analyze this feature request and identify gaps" --reasoning enabled \
  | /spec-quick --from-analysis
```

### With /rhythmix-author
```bash
/m3-think "Generate a compelling RHYTHMIX promo script outline" --context 50k \
  | /rhythmix-author --from-outline
```

### With /diagnose
```bash
# Deep debugging with M3's reasoning
/m3-think "Root cause analysis for this error trace" --reasoning enabled --context 100k
```

## Sparse Attention Advantages

MiniMax M3's sparse attention means:
- ✅ **10x more efficient** than standard attention (GQA)
- ✅ **Million-token context** without memory explosion
- ✅ **Lower latency** for long documents
- ✅ **Same quality** as dense attention
- ✅ **Cost-effective** for extended analysis

## Local Deployment

### Option 1: Cloud API (Recommended for start)
```bash
# Set in .env
MINIMAX_API_KEY=sk-...
MINIMAX_API_BASE=https://api.minimaxi.com/v1
MINIMAX_REASONING=adaptive
```

### Option 2: Local SGLang (GPU required)
```bash
# Download model (40GB+ VRAM recommended)
huggingface-cli download MiniMaxAI/MiniMax-M3 --local-dir models/m3

# Start server
python -m sglang.launch_server --model-path models/m3 --port 8000

# Point to local
MINIMAX_API_BASE=http://localhost:8000/v1
```

### Option 3: Local vLLM
```bash
vllm serve MiniMaxAI/MiniMax-M3 --port 8000

# Configure
MINIMAX_API_BASE=http://localhost:8000/v1
```

## Error Handling

| Error | Cause | Solution |
|-------|-------|----------|
| `API key not configured` | Missing MINIMAX_API_KEY | Set in .env |
| `Service unavailable` | M3 endpoint down | Check API status or start local server |
| `Context too large` | Exceeds 1M tokens | Reduce --context or split input |
| `Timeout` | Request taking too long | Increase --timeout or use disabled mode |

## Technical Details

### Sparse Attention (MSA)
- **Mechanism**: Selectively attends to relevant tokens instead of all tokens
- **Efficiency**: O(n√n) vs O(n²) for dense attention
- **Memory**: Dramatically reduced, scales linearly with context
- **Quality**: Preserves model performance on long contexts

### Reasoning Process
- **enabled**: Full reasoning chain, shows work
- **adaptive**: Evaluates query complexity, reasons if beneficial
- **disabled**: Direct generation without explicit reasoning

### Token Economics
- Reasoning tokens count separately in billing
- Adaptive mode only charges for reasoning when used
- Disabled mode has lowest token cost

## See Also

- `/spec-quick` — Spec generation with M3 analysis
- `/diagnose` — Deep debugging with reasoning
- `/rhythmix-author` — Extended script generation
- `m3-reasoning-agent` — Ruflo agent for million-token tasks
- Technical report: arXiv:2606.13392

## Support

For issues or optimization:
- Contact: model@minimax.io
- Docs: https://minimax.io/docs
- Papers: https://arxiv.org/abs/2606.13392
