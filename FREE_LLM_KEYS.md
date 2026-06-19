# Free LLM API Keys (Pekpik)

Daily-refreshed free API keys for Claude Opus, GPT-5.5, Gemini, DeepSeek, and more. No credit card. Updated 3-5x daily. Budget: $20-100 per key, expires in 24-48h.

**Base URL:** `https://aiapiv2.pekpik.com/v1`

## What's Available

| Model | Use Case |
|-------|----------|
| `claude-opus-4-7` | Best quality, narratives, scripts |
| `openai/gpt-5.5` | Fast reasoning, general chat |
| `gemini-2.5-flash` | Long-context, multimodal |
| `deepseek-v4-flash` | Code, technical writing |
| `dall-e-3` | Image generation |
| `tts-1-hd` | High-quality text-to-speech |
| `text-embedding-3-small` | Vector embeddings |

## Setup

Keys are already in `.env`:
```bash
PEKPIK_BASE_URL=https://aiapiv2.pekpik.com/v1
PEKPIK_API_KEY=sk-NXv1QAeu6Lm8AX1cq3tjuvyV09IDVI79SSbpe9JvizY93WlU
PEKPIK_API_KEY_GPT5=sk-o62L7euyQeAS9NixT4CMdceXmYqCyz4FqFX7ro4bkvgX4iXW
PEKPIK_API_KEY_GEMINI=sk-Em5LrhWxqFMwzPRVnn3vm2HaZ8ONYaOSHGtobMSA2mjuWQzp
PEKPIK_API_KEY_DEEPSEEK=sk-NGqRriL1XFrIuhAz0NZfkhKPKpdvX7QAiLsRxpPE2XOZLnoT
```

## Usage

### JavaScript/Node.js

```javascript
const { chat, generateImage, textToSpeech } = require('./lib/free-llm-client');

// Generate a promo script
const script = await chat(
  "Write a 60s promo script for an electronic music track",
  { model: 'claude-opus-4-7' }
);

// Generate album artwork
const imageUrl = await generateImage(
  "Vinyl record cover, electronic music, neon synthwave aesthetic"
);

// Generate narration
const audioBuffer = await textToSpeech(
  "Welcome to the ultimate music experience"
);
```

### Python

```python
from lib.free_llm_client import chat, generate_image, text_to_speech

# Generate script
script = chat(
    "Write a 60s promo script for an electronic music track",
    model="claude-opus-4-7"
)

# Generate image
image_url = generate_image(
    "Vinyl record cover, electronic music, neon synthwave aesthetic"
)

# Generate speech
audio = text_to_speech("Welcome to the ultimate music experience")
```

### cURL

```bash
curl https://aiapiv2.pekpik.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $PEKPIK_API_KEY" \
  -d '{
    "model": "claude-opus-4-7",
    "messages": [{"role": "user", "content": "Write a promo script"}]
  }'
```

## Use Cases for RHYTHMIX

1. **Script Generation** — Use Claude Opus to draft promo narration before sending to Higgsfield
2. **Copy Refinement** — Generate marketing copy for video descriptions without burning Higgsfield credits
3. **Embeddings** — Tag and search video metadata
4. **Backup LLM** — If Higgsfield rate limits, switch to GPT-5.5 or Gemini
5. **Image Generation** — Use DALL-E 3 for quick concept art (backup to Higgsfield image models)

## Monitoring

Each key has a $20-100 budget and expires in 24-48 hours. If a key fails:

1. Check the error message (usually budget exhausted or expired)
2. Switch to `PEKPIK_API_KEY_GPT5`, `PEKPIK_API_KEY_GEMINI`, or `PEKPIK_API_KEY_DEEPSEEK`
3. Update `.env` or hardcode in your script
4. Grab fresh keys from https://github.com/alistaitsacle/free-llm-api-keys (updated daily)

## Verify a Key

```bash
curl -X GET https://aiapiv2.pekpik.com/v1/models \
  -H "Authorization: Bearer sk-YOUR_KEY_HERE"
```

## Integrating with RHYTHMIX

### Example: Auto-generate promo copy

```bash
# Use free Claude to write script
node -e "
const { chat } = require('./lib/free-llm-client');
chat('Write a 60s YouTube promo for this track: [TRACK NAME]').then(console.log);
"

# Pipe into Higgsfield TTS
higgsfield generate create text2image_soul_v2 \
  --prompt \"$(node -e 'require("./lib/free-llm-client").chat(...)')\" \
  --wait
```

## Links

- **GitHub:** https://github.com/alistaitsacle/free-llm-api-keys
- **Follow Updates:** [@getkeyway on X](https://x.com/getkeyway)
- **Verify Keys:** https://freellmapikeys.com/verify

---

**Note:** Keys are shared publicly and may have budget consumed by other users. Always have backups ready. For production, use your own paid API keys.
