# OpenMono

Local LLM inference server for privacy-first, offline-capable, rate-limit-free language model inference.

## Overview

**OpenMono** provides a lightweight Express server exposing local LLMs via OpenAI-compatible APIs. Use it as:

- **Fallback for 9Router** when cloud APIs are rate-limited
- **Offline inference** for sensitive data (no external API calls)
- **Cost-free inference** for high-volume workloads
- **Development/testing** without API keys

## Quick Start

```bash
npm install openmono
npx openmono --port 5000
```

Then call it like OpenAI:

```typescript
const response = await fetch('http://localhost:5000/v1/chat/completions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'phi-2-q4',
    messages: [{ role: 'user', content: 'Hello!' }],
  }),
});
```

## Features

- **OpenAI-compatible API** — drop-in replacement for `openai` SDK
- **Multiple backends** — Ollama, Transformers.js, ONNX Runtime
- **Quantized models** — 2-8GB memory footprint (4-bit, no GPU required)
- **Streaming support** — Server-sent events for real-time output
- **Health checks** — per-model status and system metrics
- **Request limiting** — configurable max concurrent requests
- **Local-only** — no external network calls

## Supported Models

| Model | Backend | Memory | Context | Speed |
|-------|---------|--------|---------|-------|
| Phi 2 (Q4) | Ollama | 1.5 GB | 2K | Fast ✓ |
| Mistral 7B (Q4) | Ollama | 3.5 GB | 8K | Fast |
| Neural Chat 7B (Q4) | Ollama | 3.5 GB | 8K | Fast |
| Llama 2 7B (Q4) | Ollama | 3.5 GB | 4K | Medium |

## Installation

### Prerequisites

- Node.js 18+
- (Optional) Ollama for local model serving: `https://ollama.ai`

### From npm

```bash
npm install openmono
```

### From source

```bash
git clone <repo>
cd packages/openmono
npm install
npm run build
npm start
```

## API Reference

### Health

```
GET /health
→ { status, uptime, activeRequests, maxConcurrentRequests }
```

### List Models

```
GET /v1/models
→ { object: "list", data: [...] }
```

### Chat Completions (OpenAI-compatible)

```
POST /v1/chat/completions
{
  "model": "phi-2-q4",
  "messages": [{ "role": "user", "content": "..." }],
  "max_tokens": 1024,
  "temperature": 0.7,
  "stream": false
}
```

### Completions (Legacy)

```
POST /v1/completions
{
  "model": "phi-2-q4",
  "prompt": "...",
  "max_tokens": 128,
  "temperature": 0.7
}
```

## CLI Options

```bash
openmono --port 5000 --host 127.0.0.1 --log-level info
```

- `--port` — server port (default: 5000)
- `--host` — server host (default: 127.0.0.1)
- `--log-level` — debug|info|warn|error (default: info)

## Integration with 9Router

Use OpenMono as a fallback in your routing strategy:

```typescript
import { LLMRouter } from '9router';

const router = new LLMRouter({
  anthropicApiKey: process.env.ANTHROPIC_API_KEY,
  // OpenMono will be used when cloud models fail
});

const response = await router.route(messages, {
  tier: 'tier1',
  preferredProviders: ['claude', 'gemini', 'groq'],
  // Local fallback via OpenMono integration
});
```

## Performance

- **Latency**: 2-20s per response (depends on model & hardware)
- **Throughput**: 1-4 requests/sec (depends on model & CPU)
- **Memory**: 1.5-4GB per model (quantized)
- **CPU**: 4+ cores recommended

## Backends

### Ollama (Recommended)

Install: `https://ollama.ai`

Models available: `ollama pull phi`, `ollama pull mistral`, etc.

```bash
# Start Ollama server
ollama serve

# In another terminal
openmono --port 5000
```

### Transformers.js

Browser/Node.js inference without external dependencies.

```typescript
const server = new OpenMonoServer({
  defaultBackend: 'transformers',
  models: [{
    modelId: 'distilbert',
    backend: 'transformers',
    // ...
  }],
});
```

### ONNX Runtime

High-performance inference for quantized models.

## Privacy & Security

- **No external API calls** — all inference is local
- **No data logging** — requests/responses are not persisted
- **No telemetry** — full control over your data
- Use `--host 127.0.0.1` to restrict to localhost only

## Limitations

- Slower inference than cloud GPUs (~2-20s per response)
- Smaller context windows (2K-8K tokens)
- Limited model variety compared to OpenAI/Anthropic
- CPU-only (no GPU acceleration in base config)

## Roadmap

- GPU acceleration (CUDA, Metal)
- Batch inference for parallelism
- Model quantization utilities
- Web UI for model management
- Distributed inference across multiple nodes

## License

MIT
