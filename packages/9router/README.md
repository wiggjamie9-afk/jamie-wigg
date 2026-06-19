# 9Router

Multi-provider LLM router with intelligent fallback, cost optimization, and per-request model selection.

## Overview

**9Router** intelligently routes requests across multiple LLM providers (Claude, Gemini, Groq) using a three-tier cost hierarchy:

- **Tier 1 (80%)**: Fast, cheap models (Haiku, Gemini Flash, Llama 3.3)
- **Tier 2 (15%)**: Balanced capability (Sonnet, Gemini 2.0, Mixtral)
- **Tier 3 (5%)**: Maximum capability (Opus, Gemini Pro, specialized tasks)

The router automatically falls back to alternative providers on errors, rate limits, or timeouts, ensuring high availability.

## Installation

```bash
npm install 9router
```

## Usage

```typescript
import { LLMRouter } from '9router';

const router = new LLMRouter({
  anthropicApiKey: process.env.ANTHROPIC_API_KEY,
  googleApiKey: process.env.GOOGLE_API_KEY,
  groqApiKey: process.env.GROQ_API_KEY,
});

const response = await router.route(
  [
    { role: 'user', content: 'Explain quantum computing briefly' },
  ],
  { tier: 'tier1' },
);

console.log(response.text); // Response from a tier-1 model
console.log(response.cost); // Cost in USD
console.log(response.provider); // Which provider was used
```

## Features

- **Multi-provider routing**: Claude, Gemini, Groq with automatic fallback
- **Cost optimization**: Tier-based routing reduces costs by ~10x
- **Vision support**: Select models with `requireVision: true`
- **Tool calling**: Filter models with `requireTools: true`
- **Request logging**: Track costs and performance per provider
- **Smart selection**: Respects preferred providers and forced provider overrides

## Supported Models

### Tier 1 (Fast, Cheap)
- `claude-haiku-4-5-20251001`
- `gemini-2.0-flash-lite`
- `llama-3.3-70b-versatile` (Groq)

### Tier 2 (Balanced)
- `claude-sonnet-4-6-20250514`
- `gemini-2.0-flash`
- `mixtral-8x7b-32768` (Groq)

### Tier 3 (Maximum)
- `claude-opus-4-8-20250805`
- `gemini-2.0-pro-exp-02-05`

## Routing Strategies

```typescript
// Default: Use cheapest tier-1 models
await router.route(messages, { tier: 'tier1' });

// Budget-aware: Stop when budget exhausted
await router.route(messages, { tier: 'tier1', budget: 0.10 });

// Prefer specific providers
await router.route(messages, {
  tier: 'tier2',
  preferredProviders: ['claude', 'gemini'],
});

// Force a specific provider
await router.route(messages, {
  tier: 'tier3',
  forceProvider: 'claude',
  requireVision: true,
});
```

## Stats & Monitoring

```typescript
const stats = router.getStats();
console.log(`Total spent: $${stats.totalSpent.toFixed(4)}`);
console.log(`Requests: ${stats.requestCount}`);
console.log(`By provider:`, stats.byProvider);
console.log(`Recent requests:`, stats.recentRequests);
```

## Environment Variables

See `.env.example` for required API keys:
- `ANTHROPIC_API_KEY` — Claude API
- `GOOGLE_API_KEY` — Gemini API
- `GROQ_API_KEY` — Groq API

## Architecture

The router maintains three provider instances and selects models from the tier requested. On error, it automatically tries the next model in the tier with fallback to lower-cost alternatives. Costs are calculated per request and logged for billing/optimization purposes.
