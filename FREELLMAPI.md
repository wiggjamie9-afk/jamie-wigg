# FreeLLMAPI Integration

**TL;DR:** Run one command to get ~1.7B free LLM tokens/month across 16+ providers.

```bash
bash scripts/freellmapi-setup.sh
```

Then use it in your code:

```typescript
import { getLLMClient } from "./lib/llm-router";

const client = getLLMClient("free");  // Or just pass "auto"
const resp = await client.chat.completions.create({
  model: "auto",
  messages: [{ role: "user", content: "Hello!" }],
});
```

---

## What is FreeLLMAPI?

An OpenAI-compatible proxy that stacks free tier APIs from 16 providers:

| Provider | Best for | Free tokens/day |
|---|---|---|
| **Groq** | Speed | 150 req/min |
| **Google Gemini** | Quality | ~600K tokens |
| **Mistral** | Reliability | ~500K tokens |
| **Cerebras** | Power | ~1M tokens |
| **SambaNova** | Latest models | ~500K tokens |
| **OpenRouter** | Variety | Multiple free routes |
| **GitHub Models** | GPT-4o | ~100 req/day |
| **Cloudflare** | Fallback | ~1M tokens |
| **Cohere** | Embeddings | Various |
| **HuggingFace** | DeepSeek/Qwen | ~1M tokens |
| **Z.ai** | GLM models | Various |
| **Ollama Cloud** | Local + cloud | ~1M tokens |

**Combined:** ~1.7 billion tokens/month

---

## Quick Start

### 1. Run the setup script

```bash
bash scripts/freellmapi-setup.sh
```

This:
- ✅ Generates an encryption key
- ✅ Starts the FreeLLMAPI Docker container on :3001
- ✅ Prints next steps

### 2. Add API keys

Open **http://localhost:3001** → **Keys page** → Add keys from providers above (all free, no credit card).

Recommended starting set:
1. **Groq** — fastest
2. **Gemini** — highest caps
3. **Mistral** — reliable fallback

### 3. Grab your unified key

**Keys page header** → Copy the `freellmapi-xxx...` key

Add to `.env`:
```bash
FREELLM_API_KEY=freellmapi-xxx
LLM_MODE=free
```

### 4. Use it

```typescript
import { completeWithLLM } from "./lib/llm-router";

const { text, provider } = await completeWithLLM(
  "What is 2+2?"
);
console.log(text);
console.log(`Routed via: ${provider}`);  // e.g., "groq/llama-4"
```

---

## Modes

### **"free"** — Use FreeLLMAPI only

```typescript
const client = getLLMClient("free");
```

**Pros:**
- No costs
- 1.7B tokens/month
- Works offline (mostly)

**Cons:**
- Weaker models than Claude
- Daily quality degradation (caps deplete)
- No SLA

### **"paid"** — Use Claude only

```typescript
const client = getLLMClient("paid");
```

**Pros:**
- Best reasoning
- Consistent quality
- Tool calling, vision, etc.

**Cons:**
- Costs money

### **"auto"** (default) — Prefer free, fallback to paid

```typescript
const client = getLLMClient("auto");
// or just: getLLMClient()
```

Intelligently picks:
- Free if available AND not rate-limited
- Claude if free is exhausted or unavailable

Set via env var:
```bash
LLM_MODE=auto    # Try free first
LLM_MODE=free    # Always free, fail if unavailable
LLM_MODE=paid    # Always Claude
```

---

## Usage Patterns

### Pattern 1: Simple completion

```typescript
const { text } = await completeWithLLM("Explain quantum computing");
```

### Pattern 2: Control temperature/tokens

```typescript
const { text, provider } = await completeWithLLM(
  "Write a haiku about trees",
  {
    temperature: 0.9,
    maxTokens: 100,
    mode: "free",
  }
);
```

### Pattern 3: Raw OpenAI SDK

```typescript
const client = getLLMClient("auto");
const stream = await client.chat.completions.create({
  model: "auto",
  messages: [{ role: "user", content: "..." }],
  stream: true,
});

for await (const chunk of stream) {
  process.stdout.write(chunk.choices[0]?.delta?.content || "");
}
```

### Pattern 4: Tool calling

```typescript
const client = getLLMClient("auto");
const resp = await client.chat.completions.create({
  model: "auto",
  messages: [{ role: "user", content: "Check the weather in London" }],
  tools: [
    {
      type: "function",
      function: {
        name: "get_weather",
        description: "Get current weather",
        parameters: { type: "object", properties: { city: { type: "string" } } },
      },
    },
  ],
});
```

Tool calling works across all providers (OpenAI-compatible ones pass through; Gemini uses `functionDeclarations`).

### Pattern 5: Vision/images

```typescript
const client = getLLMClient("auto");
const resp = await client.chat.completions.create({
  model: "auto",  // Auto-routes to vision-capable model
  messages: [
    {
      role: "user",
      content: [
        { type: "text", text: "What's in this image?" },
        {
          type: "image_url",
          image_url: { url: "data:image/png;base64,..." },
        },
      ],
    },
  ],
});
```

Vision models: Gemini, Llama 4 Scout, GPT-4o, etc.

---

## Monitoring

### Dashboard

Open **http://localhost:3001** to see:
- ✅ **Keys page** — Provider status, health checks
- 📊 **Analytics page** — Token usage, latency, success rate
- 🎮 **Playground** — Test prompts live
- ⚙️ **Fallback Chain** — Reorder provider priority

### CLI health check

```bash
# Check if FreeLLMAPI is running
curl http://localhost:3001/v1/models -H "Authorization: Bearer freellmapi-xxx"
```

### Code-level check

```typescript
import { isFreeLLMAvailable } from "./lib/llm-router";

if (await isFreeLLMAvailable()) {
  console.log("✅ FreeLLMAPI is up");
} else {
  console.log("⚠️  FreeLLMAPI is down, will use Claude");
}
```

---

## Docker commands

```bash
# Start
docker compose -f infra/freellmapi/docker-compose.yml up -d

# Stop
docker compose -f infra/freellmapi/docker-compose.yml down

# View logs
docker compose -f infra/freellmapi/docker-compose.yml logs -f freellmapi

# Restart
docker compose -f infra/freellmapi/docker-compose.yml restart

# Full cleanup (removes data)
docker compose -f infra/freellmapi/docker-compose.yml down -v
```

Or just use the shorthand from the FreeLLMAPI directory:

```bash
cd infra/freellmapi
docker compose up -d
docker compose logs -f
```

---

## Limitations

⚠️ **Real constraints to be honest about:**

### Quality degrades as the day progresses

Top models (Gemini 2.5, GPT-4o) have the **lowest daily caps**. Once exhausted (usually 2-4 PM UTC), the router falls back to smaller models. Late-day quality drops measurably.

**Mitigation:** Run heavy reasoning tasks early in the day. Use "free" mode for:
- Summaries
- Content classification
- Code formatting
- Lightweight chat

Use "paid" mode (Claude) for:
- Hard reasoning
- Complex problem-solving
- High-stakes decisions

### Free tiers can change without notice

Providers tighten/remove free tiers regularly. If you hit 429s:
1. Check the **Dashboard → Health** — see which keys are rate-limited
2. Add more keys from other providers
3. Reorder the Fallback Chain to prioritize still-healthy ones

### No SLA, by definition

Free tiers aren't a stable production backend. For critical services, use paid APIs with contracts.

### Single-user, local-first

By design, this is single-user with no multi-tenant auth. Don't expose `:3001` to the internet without wrapping it in proper auth first.

---

## Troubleshooting

### "Connection refused" when trying to connect

```bash
# Is the container running?
docker compose -f infra/freellmapi/docker-compose.yml ps

# If not running, start it
docker compose -f infra/freellmapi/docker-compose.yml up -d

# Check logs
docker compose -f infra/freellmapi/docker-compose.yml logs -f
```

### "Invalid API key" errors

1. Double-check you copied the **unified key** from the dashboard (not a provider key)
2. Verify the key is in your `.env` as `FREELLM_API_KEY`
3. Make sure the dashboard login worked (first-run setup)

### Getting 429 errors frequently

1. Check **Dashboard → Analytics** to see which provider hit rate limits
2. Add keys from more providers
3. Wait until UTC midnight (daily caps reset at that time)

### Models feel slow

Some providers are faster than others:
- **Fast:** Groq (fastest), Cerebras
- **Moderate:** Gemini, Mistral
- **Slower:** OpenRouter, some HuggingFace routes

Reorder the **Fallback Chain** to prioritize faster ones, or just let auto-routing pick the best available at request time.

### Want to reset everything

```bash
# Stop and remove all data
docker compose -f infra/freellmapi/docker-compose.yml down -v

# Start fresh (will prompt for login again)
docker compose -f infra/freellmapi/docker-compose.yml up -d
```

---

## Full reference

- **Setup guide:** `infra/freellmapi/SETUP.md`
- **Router API:** `lib/llm-router.ts`
- **Example code:** `examples/llm-router-example.ts`
- **Docker config:** `infra/freellmapi/docker-compose.yml`
- **Env vars:** `.env.example` (copy to `.env` and fill in)

---

## Next: Integrate into STARLIGHTMIX Studio

To use FreeLLMAPI in the Studio app:

```typescript
// studio/src/lib/api.ts
import { getLLMClient } from "../../../lib/llm-router";

export async function generateCaption(prompt: string) {
  const client = getLLMClient("auto");  // Prefer free, fallback to Claude
  const resp = await client.chat.completions.create({
    model: "auto",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 500,
  });
  return resp.choices[0]?.message?.content || "";
}
```

Then the Studio will automatically use free tiers when available, falling back to Claude API only when needed.

---

**Questions?** See `infra/freellmapi/SETUP.md` or open an issue.
