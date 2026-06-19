# Aria Core

Foundation layer for autonomous agents with 10,000+ API integrations, automatic fallback routing, and tool execution.

## Overview

**Aria Core** provides the infrastructure for building autonomous agents that:

1. **Discover and execute tools** from a registry of 10,000+ public APIs (auto-synced via tool-sync)
2. **Route requests intelligently** with automatic fallback on rate limits / timeouts
3. **Reason about goals** and select appropriate tools to accomplish tasks
4. **Track execution** with detailed step-by-step logs and cost tracking

## Architecture

```
User Goal
   ↓
[AriaAgent] reasoning layer
   ↓
[ToolResolver] finds matching tools by category
   ↓
[ToolExecutor] executes HTTP requests with fallback
   ↓
[API Response] → cost tracked, duration logged
```

## Quick Start

```typescript
import { ToolResolver, ToolExecutor, AriaAgent } from 'aria-core';

// Initialize
const resolver = new ToolResolver('path/to/tool-registry.json');
const executor = new ToolExecutor(resolver, {
  'openweathermap-api': process.env.OPENWEATHERMAP_API_KEY,
});
const agent = new AriaAgent(resolver, executor);

// Execute: get current weather
const result = await agent.execute(
  'Get current weather',
  'Weather',
  { lat: 40.7128, lon: -74.0060 },
);

console.log(result.conclusion);
console.log(result.toolsUsed); // [{ toolId, category, success, duration }]
```

## Components

### 1. ToolResolver

Loads the tool registry and provides lookups:

```typescript
const resolver = new ToolResolver();

// Get primary tool for category
const tool = resolver.resolveTool('Weather');

// Get fallback chain
const chain = resolver.resolveToolChain('Weather');
// → [primary, fallback1, fallback2, ...]

// Search tools
const results = resolver.searchTools('weather api', 10);

// Get metadata
const meta = resolver.getMetadata();
// → { version, lastSync, totalTools: 10000+, totalCategories: 50+ }
```

### 2. ToolExecutor

Executes tools with automatic fallback:

```typescript
const executor = new ToolExecutor(resolver, {
  'openweathermap-api': process.env.OPENWEATHERMAP_API_KEY,
  'weatherapi': process.env.WEATHERAPI_KEY,
});

const result = await executor.executeTool('Weather', { lat: 40.7128, lon: -74.0060 });

// On rate limit → tries next tool in chain
// On timeout → tries next tool in chain
// Returns: { success, data, error, toolId, duration }
```

### 3. AriaAgent

Autonomous reasoning and tool selection:

```typescript
const agent = new AriaAgent(resolver, executor);

// Simple execution
const response = await agent.execute(
  'Get weather for NYC',
  'Weather',
  { lat: 40.7128, lon: -74.0060 },
);

// Multi-turn reasoning
const reasoning = await agent.reason(
  'What is the weather like in New York?',
);

// Response includes:
// - conclusion: final answer
// - steps: [{ type, content, toolId, toolResult }]
// - toolsUsed: tracking per tool
// - totalDuration: ms
```

## Tool Registry

The registry is auto-synced from the [public-apis repository](https://github.com/public-apis/public-apis) and contains:

**50+ Categories:**
- Weather (OpenWeatherMap, WeatherAPI, Weatherstack)
- Finance (Alpha Vantage, Finnhub, Polygon)
- News (NewsAPI, Mediastack)
- Geolocation (IPStack, Geolocation DB)
- Translation (Google Translate, Microsoft)
- Search (Google, Bing, Serpstack)
- Image (Unsplash, Pixabay, Pexels)
- Social Media (Twitter, GitHub, LinkedIn)

**Per-Tool Metadata:**
- `id` — unique tool identifier
- `name` — human-readable name
- `category` — category for discovery
- `endpoint` — API base URL
- `method` — HTTP method (GET, POST, etc.)
- `authType` — authentication type (apiKey, oauth, bearer, none)
- `inputSchema` — JSON Schema for parameters
- `outputSchema` — expected response structure
- `freetier` — free tier available
- `rateLimit` — rate limit info
- `equivalentTools` — fallback chain IDs

## Execution Flow

### Success Case

```
Goal: "Get weather for NYC"
  ↓
Infer category: "Weather"
  ↓
Resolve tool chain: [openweathermap, weatherapi, weatherstack]
  ↓
Execute openweathermap with { lat: 40.7128, lon: -74.0060 }
  ↓
Response 200 OK
  ↓
Return data, record { toolId, duration, cost }
```

### Fallback Case

```
Goal: "Get weather for NYC"
  ↓
Infer category: "Weather"
  ↓
Resolve tool chain: [openweathermap, weatherapi, weatherstack]
  ↓
Execute openweathermap → 429 (rate limit)
  ↓
Fall back: Execute weatherapi
  ↓
Response 200 OK
  ↓
Return data, record { toolId: weatherapi, duration, cost }
```

## Environment Variables

See `.env.example` for API key configuration. At minimum:

```bash
# One or more provider keys
OPENWEATHERMAP_API_KEY=...
WEATHERAPI_API_KEY=...
ALPHA_VANTAGE_API_KEY=...
```

## Extending with Custom Tools

Add tools to the registry by:

1. **Extend the ToolRegistry**: Add entries to `data/tool-registry.json`
2. **Wire in executor**: Pass API keys via `ToolExecutor` constructor
3. **Category discovery**: Agent will automatically infer category from goal

## Performance

- **Tool lookup**: O(1) by ID, O(n) search by name
- **Execution**: ~100ms avg per tool (varies by API)
- **Fallback**: Automatic on 429/timeout, respects retry delays
- **Cost tracking**: Per-request via `ExecutionResult.duration` and metadata

## Example: Multi-Tool Agent

```typescript
import { ToolResolver, ToolExecutor, AriaAgent } from 'aria-core';

const resolver = new ToolResolver();
const executor = new ToolExecutor(resolver, {
  'openweathermap-api': process.env.OPENWEATHERMAP_API_KEY,
  'newsapi': process.env.NEWSAPI_KEY,
});
const agent = new AriaAgent(resolver, executor);

// Compound goal: Get weather AND news for a location
const weatherResponse = await agent.execute(
  'Get current weather',
  'Weather',
  { lat: 40.7128, lon: -74.0060 },
);

const newsResponse = await agent.execute(
  'Get latest news about NYC',
  'News',
  { q: 'New York' },
);

console.log('Weather:', weatherResponse.conclusion);
console.log('News:', newsResponse.conclusion);
console.log('Tools used:', [...weatherResponse.toolsUsed, ...newsResponse.toolsUsed]);
```
