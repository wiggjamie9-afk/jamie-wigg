# STARLIGHTMIX Studio — Intelligent LLM Routing

Save 80% on API costs by intelligently routing Studio tasks between free LLM tiers and Claude.

## Overview

The Studio app routes different tasks to different LLM providers:

| Task | Cost | Provider | Example |
|---|---|---|---|
| **Caption generation** | Free | Groq/Gemini/Mistral | "Create a short video caption" |
| **Narration writing** | Free | Free tiers | "Polish this narration script" |
| **Metadata/tags** | Free | Free tiers | "Generate hashtags and description" |
| **Style suggestions** | Free | Free tiers | "Suggest an edit style" |
| **Reasoning/analysis** | ~$0.001 | Claude (auto-fallback) | "Interpret this edit instruction" |
| **Creative direction** | ~$0.001 | Claude (auto-fallback) | "What's a creative angle?" |

**Strategy:**
- **Low-value tasks** → Always use free tier (saves 100% on these)
- **High-value tasks** → Use "auto" mode: free in morning (first 1.7B tokens/month), Claude after caps hit
- **Real benefit:** 70-80% of your LLM work is low-value, so 80% cost savings

## Quick Start

### 1. Import the router

```typescript
import {
  routeStudioTask,
  generateCaption,
  generateMetadata,
  interpretEditingInstruction,
} from "@/lib/llm-studio";
```

### 2. Use convenience functions

```typescript
// Generate a caption (routes to free tier)
const caption = await generateCaption("Upbeat music video about summer");
console.log(caption.text);  // "🌞 Summer vibes captured in beat 🎵"
console.log(caption.provider);  // "groq/llama-4"
```

### 3. Use custom routing for any task

```typescript
// Route a custom task
const response = await routeStudioTask({
  task: "suggestion",
  prompt: "What color palette would work well for a lo-fi hip-hop video?",
  options: {
    temperature: 0.9,
    maxTokens: 250,
  },
});
```

## Convenience Functions

### Caption Generation

```typescript
const result = await generateCaption(videoDescription, forceMode?);
// task: "caption"
// mode: always "free"
// tokens: ~50-100 output
// cost: $0
```

### Narration Generation

```typescript
const result = await generateNarration(script, forceMode?);
// task: "narration"
// mode: always "free"
// tokens: ~200-300 output
// cost: $0
```

### Metadata Generation

```typescript
const result = await generateMetadata(title, description, forceMode?);
// task: "metadata"
// mode: always "free"
// tokens: ~150-200 output
// cost: $0
// returns: hashtags + SEO description
```

### Style Suggestions

```typescript
const result = await suggestEditStyle(currentStyle, forceMode?);
// task: "suggestion"
// mode: always "free"
// tokens: ~100-150 output
// cost: $0
```

### Editing Instruction Interpretation

```typescript
const result = await interpretEditingInstruction(instruction, forceMode?);
// task: "editing" (HIGH-VALUE)
// mode: "auto" (free in morning, Claude at night)
// tokens: ~200-300 output
// cost: $0-0.002 depending on time of day
```

## Task Categories

### Low-value tasks (always free)

These tasks are:
- **Routine** — don't need complex reasoning
- **Replaceable** — if result isn't perfect, user can quickly regenerate
- **Non-blocking** — don't hold up the user's workflow

Examples:
- Captions
- Hashtags/metadata
- Narration polish
- UI suggestions

**Routing:** Always use free tier. If free tier is unavailable, fail gracefully (show "couldn't generate" message).

### High-value tasks (auto-routing)

These tasks are:
- **Critical** — wrong answer breaks the user's workflow
- **Non-repeatable** — user can't easily regenerate
- **Reasoning-heavy** — need best-in-class intelligence

Examples:
- Edit instruction interpretation
- Creative direction
- Complex analysis

**Routing:** Use "auto" mode:
- **Morning (UTC):** Free tier (saves money)
- **Evening (UTC):** Falls back to Claude (ensures quality)

### Custom routing

Force a specific mode if needed:

```typescript
// Always use free (e.g., testing, or user preference)
await generateCaption(description, "free");

// Always use Claude (e.g., user paid for premium quality)
await generateCaption(description, "paid");
```

## In a React Component

### Simple usage

```typescript
import { generateCaption } from "@/lib/llm-studio";

export function VideoCard({ video }) {
  const [caption, setCaption] = useState("");
  const [generating, setGenerating] = useState(false);

  const handleGenerateCaption = async () => {
    setGenerating(true);
    try {
      const result = await generateCaption(video.description);
      setCaption(result.text);
    } catch (error) {
      console.error("Failed to generate caption:", error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div>
      <button onClick={handleGenerateCaption} disabled={generating}>
        {generating ? "Generating..." : "Generate Caption"}
      </button>
      {caption && <p>{caption}</p>}
    </div>
  );
}
```

### Advanced: Custom options

```typescript
const result = await generateCaption(description, undefined, {
  temperature: 0.8,    // More creative
  maxTokens: 150,      // Longer caption
});
```

## Advanced: Custom Tasks

Route any task with full control:

```typescript
const response = await routeStudioTask({
  task: "reasoning",  // or "editing", "creative", etc.
  prompt: "Your question here",
  options: {
    temperature: 0.5,      // Lower = more consistent
    maxTokens: 500,
    forceMode: "auto",     // "free", "paid", or "auto"
  },
});

console.log(response.text);      // The response
console.log(response.provider);  // Which provider handled it
console.log(response.mode);      // "free" or "paid"
```

## Monitoring & Analytics

### Get task routing info

```typescript
import { getTaskRoutingInfo } from "@/lib/llm-studio";

const info = getTaskRoutingInfo("caption");
// {
//   task: "caption",
//   priority: "low",
//   mode: "free",
//   expectedProvider: "free"
// }
```

### Estimate task cost

```typescript
import { estimateTaskCost } from "@/lib/llm-studio";

const cost = estimateTaskCost("editing", 200, 150);
// Returns: $0 (free) or ~$0.006 (Claude)
```

### Log routing decisions

```typescript
const result = await generateMetadata(title, desc);

console.log(`✅ Generated metadata via ${result.provider} (${result.mode} tier)`);
// Output: "✅ Generated metadata via mistral/mistral-large-3 (free tier)"
```

## Cost Savings Breakdown

Assuming typical Studio usage:

```
50 caption requests/month × $0 (free) = $0
100 metadata requests/month × $0 (free) = $0
50 narration requests/month × $0 (free) = $0
20 editing interpretations × $0.001 = $0.02

Total/month: ~$0.02 (vs. ~$5-10 on Claude API)
Savings: 99%
```

## Fallback Behavior

### Low-value tasks

If free tier fails:
```typescript
try {
  const result = await generateCaption(description, "free");
} catch (error) {
  // Free tier unavailable — gracefully degrade
  // Show user: "Couldn't generate caption right now. Try again later."
}
```

### High-value tasks

If free tier fails, automatically falls back to Claude:
```typescript
const result = await interpretEditingInstruction(instruction);
// If free exhausted → automatically tries Claude
// User gets result either way, but pays for evening requests
```

## Environment Setup

1. **Start FreeLLMAPI** (see root `FREELLMAPI.md`):
   ```bash
   bash scripts/freellmapi-setup.sh
   ```

2. **Set environment variables** in `.env`:
   ```bash
   LLM_MODE=auto
   FREELLM_URL=http://localhost:3001/v1
   FREELLM_API_KEY=freellmapi-xxx
   ANTHROPIC_API_KEY=sk-...  # For fallback
   ```

3. **Test it**:
   ```bash
   cd studio
   npm run dev
   # Navigate to a component using LLM routing
   ```

## Examples

See `studio/lib/llm-studio.example.tsx` for:
- Caption generator component
- Metadata generator component
- Editing instruction helper
- Advanced custom routing
- Task routing matrix debugger

## Troubleshooting

### "Failed to generate caption"

Check if FreeLLMAPI is running:
```bash
curl http://localhost:3001/v1/models \
  -H "Authorization: Bearer freellmapi-xxx"
```

If it fails, restart FreeLLMAPI:
```bash
docker compose -f infra/freellmapi/docker-compose.yml restart
```

### Slow responses in evening (UTC)

This is expected — free tier caps hit, falling back to smaller models. You can:
- Force Claude with `forceMode: "paid"`
- Schedule heavy tasks for morning
- Add more free-tier provider keys

### All responses feel weak

Make sure your fallback keys are set up correctly:
```bash
# Check .env
cat .env | grep -E "FREELLM_|ANTHROPIC_"
```

## Integration Checklist

- [ ] FreeLLMAPI running (`bash scripts/freellmapi-setup.sh`)
- [ ] `.env` configured with `FREELLM_API_KEY` and `ANTHROPIC_API_KEY`
- [ ] Import `llm-studio` functions in components
- [ ] Test with `generateCaption()` or similar
- [ ] Monitor provider usage in FreeLLMAPI dashboard
- [ ] Log routing decisions for analytics

## Reference

- **Root LLM router:** `/lib/llm-router.ts`
- **Studio-specific router:** `/studio/lib/llm-studio.ts`
- **FreeLLMAPI docs:** `/FREELLMAPI.md`
- **Setup guide:** `/infra/freellmapi/SETUP.md`
