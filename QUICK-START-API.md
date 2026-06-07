# LLM Router — Quick Start API

> Three modes. One API. Use everywhere.

---

## 🔌 The API

```typescript
import { getLLMClient } from "./lib/llm-router";

// Mode 1: Always free tier
const client = getLLMClient("free");

// Mode 2: Always Claude
const client = getLLMClient("paid");

// Mode 3: Smart fallback (free → Claude)
const client = getLLMClient("auto");

// Then use it like OpenAI SDK
const resp = await client.chat.completions.create({
  model: "auto",  // or specific model
  messages: [{ role: "user", content: "Hello" }],
});

console.log(resp.choices[0].message.content);
```

---

## 📊 Three modes explained

| Mode | Provider | Cost | When to use |
|---|---|---|---|
| `"free"` | Groq, Gemini, Mistral | $0 | Captions, metadata, summaries |
| `"paid"` | Claude | ~$0.001-0.1 | Reasoning, complex tasks |
| `"auto"` | Free first, Claude fallback | $0-0.1 | Default (smart routing) |

---

## 💡 Real examples

### Example 1: Generate captions (always free)
```typescript
const client = getLLMClient("free");
const resp = await client.chat.completions.create({
  model: "auto",
  messages: [{
    role: "user",
    content: "Generate a short caption for: upbeat music video"
  }],
});
console.log(resp.choices[0].message.content);
// Output: "🎵 High-energy vibes captured in beat..."
```

### Example 2: Complex reasoning (use Claude)
```typescript
const client = getLLMClient("paid");
const resp = await client.chat.completions.create({
  model: "claude-opus-4-8",
  messages: [{
    role: "user",
    content: "Analyze this editing instruction: Add motion blur to follow the beat"
  }],
});
```

### Example 3: Smart routing (default)
```typescript
const client = getLLMClient("auto");
const resp = await client.chat.completions.create({
  model: "auto",
  messages: [{ role: "user", content: "..." }],
});
// Morning (UTC): Uses free tier (Gemini 2.5)
// Evening (UTC): Falls back to Claude if free caps hit
// Night (UTC): Uses Claude for reliability
```

### Example 4: Streaming
```typescript
const client = getLLMClient("auto");
const stream = await client.chat.completions.create({
  model: "auto",
  messages: [{ role: "user", content: "Write a poem..." }],
  stream: true,
});

for await (const chunk of stream) {
  process.stdout.write(chunk.choices[0]?.delta?.content || "");
}
```

### Example 5: In React
```typescript
"use client"
import { getLLMClient } from "@/lib/llm-router";

export function MyComponent() {
  const [response, setResponse] = useState("");

  const handleGenerate = async () => {
    const client = getLLMClient("auto");
    const resp = await client.chat.completions.create({
      model: "auto",
      messages: [{ role: "user", content: "Generate metadata..." }],
    });
    setResponse(resp.choices[0].message.content);
  };

  return (
    <>
      <button onClick={handleGenerate}>Generate</button>
      <p>{response}</p>
    </>
  );
}
```

### Example 6: In API route
```typescript
// app/api/generate/route.ts
export async function POST(req: Request) {
  const { prompt } = await req.json();

  const client = getLLMClient("auto");
  const resp = await client.chat.completions.create({
    model: "auto",
    messages: [{ role: "user", content: prompt }],
  });

  return Response.json(resp.choices[0].message.content);
}
```

### Example 7: In server action
```typescript
// lib/actions.ts
"use server"

export async function generateCaption(description: string) {
  const client = getLLMClient("free");
  const resp = await client.chat.completions.create({
    model: "auto",
    messages: [{
      role: "user",
      content: `Create a short caption: ${description}`
    }],
  });
  return resp.choices[0].message.content;
}
```

---

## 🎯 One-liner for each mode

```typescript
// Save money
const client = getLLMClient("free");

// Maximum quality
const client = getLLMClient("paid");

// Smart routing
const client = getLLMClient("auto");
```

---

## 📋 Configuration

```bash
# In .env
LLM_MODE=auto                      # Which mode by default
FREELLM_URL=http://localhost:3001  # FreeLLMAPI location
FREELLM_API_KEY=freellmapi-xxx     # Your unified key
ANTHROPIC_API_KEY=sk-...           # Claude key (for fallback)
```

---

## ✨ Key features

✅ OpenAI SDK compatible — use any OpenAI client library  
✅ Streaming support — works with stream: true  
✅ Tool calling — pass tools and tool_choice like OpenAI  
✅ Vision support — send images with image_url blocks  
✅ Error handling — graceful fallback between providers  
✅ Typed responses — full TypeScript support  

---

## 🚀 Use it everywhere

- ✅ React components (client side)
- ✅ Server components
- ✅ Server actions
- ✅ API routes
- ✅ Background jobs
- ✅ CLI tools
- ✅ Any Node.js app

---

## 💰 Cost impact

| Scenario | "free" | "paid" | "auto" |
|---|---|---|---|
| **Morning (UTC)** | $0 | ~$0.01 | $0 |
| **Evening (UTC)** | $0 (or fails) | ~$0.01 | $0 then Claude |
| **Annual** | ~$0 | ~$200+ | ~$0-50 |

---

## 📚 Full reference

- **Setup:** `/infra/freellmapi/SETUP.md`
- **API docs:** `/FREELLMAPI.md`
- **Studio integration:** `/studio/LLM-ROUTING.md`
- **Cost analysis:** `/COST-SAVINGS.md`

---

## 🎓 That's it!

```typescript
import { getLLMClient } from "./lib/llm-router";

const client = getLLMClient("auto");  // Just use this

const resp = await client.chat.completions.create({
  model: "auto",
  messages: [{ role: "user", content: "Hello!" }],
});
```

**One API. Three modes. Infinite flexibility.** ✅
