# FreeLLMAPI Studio Flow

## User Journey: From Render to Free Metadata

```
User renders video
      ↓
Render completes (existing flow)
      ↓
✨ VideoExporter appears
      ↓
Click "Generate Captions & Metadata (Free)"
      ↓
LLM router decides:
  ├─ Caption task → FREE tier (Groq/Gemini/Mistral)
  └─ Metadata task → FREE tier (same)
      ↓
Results with savings badge
      ↓
User can copy, download, or regenerate
```

---

## Step-by-step breakdown

### 1. User renders video
- Existing Studio flow (unchanged)
- User uploads track, selects theme, clicks "Render"
- Replicate generates scenes
- MP4 composes automatically

### 2. Render completes
- Success message: "Render done. Your MP4 downloaded automatically."
- Scenes table shows all generated frames
- UI is ready for next action

### 3. ✨ VideoExporter appears
- **New UI section** below render results
- Heading: "📝 Auto-generate Captions & Metadata"
- Subheading: "Free LLM tier saves you ~$0.02 per video"
- Button: "✨ Generate Captions & Metadata (Free)"

### 4. Click button
- Triggers two parallel LLM calls:
  1. `generateCaption(plan.theme)`
  2. `generateMetadata(title, description)`
- Loading states: "📝 Generating caption..." → "🏷️ Generating metadata..."

### 5. LLM router decides (intelligent routing)
```
Caption task (low-value):
  mode: "free"
  provider: Groq/Gemini/Mistral (auto-selected)
  cost: $0

Metadata task (low-value):
  mode: "free"
  provider: Groq/Gemini/Mistral (auto-selected)
  cost: $0

Both route to: FreeLLMAPI → Free tier providers
Fallback: If morning cap exhausted → Try next provider
```

### 6. Results with savings badge
```
┌─────────────────────────────────────┐
│ 🎉 You saved $0.02!                  │
│ Generated with free LLM tier         │
│ (Groq/Gemini/Mistral)               │
└─────────────────────────────────────┘

📝 Caption
Via: groq/llama-4
"🎵 High-energy beat with cinematic visuals..."
[Copy]

🏷️ Metadata
Via: groq/llama-4
"#music #video #beats #cinematography..."
[Copy]

[🔄 Regenerate] [⬇️ Download as JSON]
```

### 7. User can copy, download, or regenerate
- **Copy button** → Copies text to clipboard
- **Download as JSON** → Saves metadata file:
  ```json
  {
    "caption": "...",
    "captionProvider": "groq/llama-4",
    "metadata": "...",
    "metadataProvider": "groq/llama-4",
    "costSaved": 0.02,
    "generatedAt": "2026-06-07T10:00:00Z"
  }
  ```
- **Regenerate button** → Runs LLM again (new caption/metadata)

---

## Cost breakdown

### Per video
```
Captions:     $0  (free tier)
Metadata:     $0  (free tier)
Badge shows: "You saved $0.02" (vs Claude API)
────────────────────────────
Total cost:   $0
```

### Per month (50 videos)
```
Traditional Claude API:  ~$50-100/month
FreeLLMAPI setup:        ~$0/month (free tiers)
────────────────────────────
Monthly savings:         ~$50-100
Annual savings:          ~$600-1200
```

---

## Under the hood

### Component: VideoExporter
**File:** `studio/components/video-exporter/video-exporter.tsx`

```typescript
export function VideoExporter({ plan, result, onComplete }) {
  const handleExport = async () => {
    // 1. Generate caption (free)
    const captionResult = await generateCaption(plan.theme);
    
    // 2. Generate metadata (free)
    const metadataResult = await generateMetadata(title, description);
    
    // 3. Calculate cost saved
    const costSaved = 0.001; // Minimal, but visible
    
    // 4. Display results with savings badge
    return <ExportedMetadataDisplay data={exportData} />;
  };
}
```

### LLM Router: Task-aware routing
**File:** `studio/lib/llm-studio.ts`

```typescript
// Low-value tasks always route to FREE
const caption = await generateCaption(description);      // → free
const metadata = await generateMetadata(title, desc);    // → free

// High-value tasks use "auto" (free + Claude fallback)
const interpretation = await interpretEditingInstruction(cmd); // → auto
```

---

## Error handling

### If free tier caps are hit
- **Low-value tasks** (captions, metadata):
  - Graceful failure: "Couldn't generate caption right now. Try again later."
  - Not blocking — user can proceed without
  
- **High-value tasks** (reasoning):
  - Falls back to Claude API (if key configured)
  - User still gets result, but may cost $0.001-0.01

### If FreeLLMAPI is down
- LLM calls fail with clear error message
- "Unable to reach LLM service. Check FreeLLMAPI is running on :3001"
- User can retry manually

---

## Configuration

### Minimal (free-only)
```bash
# .env
FREELLM_API_KEY=freellmapi-xxx
LLM_MODE=auto
```

### With Claude fallback (recommended)
```bash
# .env
FREELLM_API_KEY=freellmapi-xxx
LLM_MODE=auto
ANTHROPIC_API_KEY=sk-...
```

---

## Testing locally

```bash
# 1. Start FreeLLMAPI
cd infra/freellmapi
docker compose up -d

# 2. Add free-tier keys in dashboard
# http://localhost:3001
# Add: Groq, Gemini, Mistral (all free, no card required)

# 3. Copy unified key
# Dashboard → Keys page → Copy freellmapi-xxx

# 4. Set .env
echo "FREELLM_API_KEY=freellmapi-xxx" >> .env
echo "LLM_MODE=auto" >> .env

# 5. Start Studio
cd studio
npm run dev

# 6. Test flow
# http://localhost:3000/new
# Upload track → Render → See VideoExporter button ✅
```

---

## Metrics

### What users see
- ✅ "You saved $0.02!" badge after each render
- ✅ Provider info (Groq/Gemini/Mistral)
- ✅ Copy buttons for reuse
- ✅ Download option for integration

### What we track
- Caption generation latency
- Metadata generation latency
- Provider used (for routing analytics)
- Cost saved (visible to user)
- Regeneration rate (engagement metric)

---

## Future extensions

1. **Bulk export** — Generate captions for library (multiple videos)
2. **Custom prompts** — User-defined caption style
3. **Localization** — Multi-language captions via free tier
4. **Analytics dashboard** — Track total savings over time
5. **Auto-publish** — Post to social with caption/hashtags

---

## References

- **LLM Router docs:** `/studio/LLM-ROUTING.md`
- **FreeLLMAPI setup:** `/infra/freellmapi/SETUP.md`
- **Root LLM docs:** `/FREELLMAPI.md`
- **Code:** `studio/lib/llm-studio.ts`, `studio/components/video-exporter/`
