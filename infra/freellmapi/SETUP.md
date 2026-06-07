# FreeLLMAPI Setup Guide

Aggregates 16+ free LLM providers into a single OpenAI-compatible endpoint. Get ~1.7B free tokens/month.

## Prerequisites

- Docker + Docker Compose
- OpenSSL (for key generation)
- Free accounts with LLM providers (see **Step 2** below)

## Step 1: Generate encryption key & start the container

```bash
cd infra/freellmapi

# Generate a secure encryption key
ENCRYPTION_KEY="$(openssl rand -hex 32)"
printf "ENCRYPTION_KEY=%s\nPORT=3001\n" "$ENCRYPTION_KEY" > .env

# Start FreeLLMAPI
docker compose up -d

# Check logs
docker compose logs -f freellmapi
```

Open **http://localhost:3001** in your browser. You'll be prompted to create a login (email + password) on first run.

## Step 2: Get free-tier API keys

Sign up for these providers (all free, no credit card required):

| Provider | Signup link | Models | Notes |
|---|---|---|---|
| **Groq** | https://console.groq.com/keys | Llama 4, Llama 3.3, GPT-OSS | Fast inference, instant signup |
| **Google Gemini** | https://aistudio.google.com/app/apikeys | Gemini 2.5 Pro, 3.x | High daily caps |
| **Mistral** | https://console.mistral.ai/api-keys | Large 3, Medium 3.5, Codestral | Good quality |
| **Cerebras** | https://console.cerebras.ai/auth/login | Qwen 3 235B | Fast, powerful |
| **SambaNova** | https://cloud.sambanova.ai/apis | DeepSeek V3, Llama 4 | Latest models |
| **OpenRouter** | https://openrouter.ai/keys | 21 free-tier routes | Good fallback chain |
| **GitHub Models** | https://github.com/marketplace/models | GPT-4.1, GPT-4o | Requires GH account |
| **Cloudflare** | https://dash.cloudflare.com/profile/api-tokens | Kimi K2, GLM-4.7, GPT-OSS | Free AI Gateway |
| **Cohere** | https://dashboard.cohere.com/api-keys | Command R+, Command-A | Good for embeddings |
| **Hugging Face** | https://huggingface.co/settings/tokens | DeepSeek V4, Kimi K2, Qwen3 | Via serverless inference |
| **Z.ai (Zhipu)** | https://open.bigmodel.cn/usercenter/apikeys | GLM-4.5, GLM-4.7 Flash | Chinese models |
| **Ollama Cloud** | https://ollama.com/download | GLM-4.7, Kimi K2 | Run locally or cloud |

**Tip:** Start with **Groq** (fastest signup) + **Gemini** (largest caps) + **Mistral** (reliable).

## Step 3: Add keys to FreeLLMAPI dashboard

1. Open http://localhost:3001 (login with your email)
2. Go to **Keys** page
3. For each provider you signed up for:
   - Select the provider from the dropdown
   - Paste the API key
   - Click **Add Key**
4. Go to **Fallback Chain** page and reorder by priority (top = tried first)

Suggested priority order:
1. Google Gemini (highest daily cap)
2. Groq (fastest)
3. Mistral (reliable)
4. Cerebras (powerful)
5. OpenRouter (catch-all)

## Step 4: Grab your unified API key

On the **Keys** page, copy your **unified API key** (looks like `freellmapi-xxx...`). This is what your apps connect with.

## Step 5: Use it in your code

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:3001/v1",
    api_key="freellmapi-your-unified-key",
)

# Use it exactly like Claude/OpenAI API
resp = client.chat.completions.create(
    model="auto",  # Auto-picks best available
    messages=[{"role": "user", "content": "Hello!"}]
)
print(resp.choices[0].message.content)
print(f"Routed via: {resp.headers.get('x-routed-via')}")
```

## Docker commands

```bash
# Start
docker compose up -d

# Stop
docker compose down

# View logs
docker compose logs -f freellmapi

# Restart
docker compose restart freellmapi

# Remove all data (keep .env to reuse encryption key)
docker compose down -v
```

## Monitoring

- **Dashboard**: http://localhost:3001
- **API health**: `curl http://localhost:3001/v1/models`
- **Analytics**: Dashboard → Analytics tab (request volume, tokens, latency)

## Important notes

⚠️ **Free tiers can change** — providers update rate limits without notice. If you hit 429 errors, the provider may have tightened its cap.

⚠️ **Daily resets at UTC midnight** — your best models (Gemini, GPT-4o) have daily caps. Late in the day, the router falls back to smaller models.

⚠️ **Local-first only** — this is single-user. Don't expose :3001 to the internet without authentication. If you need to access from another machine on your LAN:

```bash
# Start with network exposure
docker compose down
HOST_BIND=0.0.0.0 docker compose up -d
# Now accessible at http://<your-machine-ip>:3001 (only on trusted networks!)
```

## Switching between Claude and FreeLLMAPI

In your code:

```python
import os
from openai import OpenAI

# Use environment variable to toggle
USE_FREELLM = os.getenv("USE_FREELLM", "false").lower() == "true"

if USE_FREELLM:
    client = OpenAI(
        base_url="http://localhost:3001/v1",
        api_key="freellmapi-...",
    )
else:
    client = OpenAI(api_key="sk-...")  # Your Claude/OpenAI key

# Same API from here on
resp = client.chat.completions.create(
    model="auto" if USE_FREELLM else "claude-opus-4-8",
    messages=[...],
)
```

Then run with:
```bash
USE_FREELLM=true python your_script.py  # Uses FreeLLMAPI
python your_script.py                    # Uses Claude
```

## Troubleshooting

**Q: "Connection refused" when trying to access http://localhost:3001**
- Is the container running? Check: `docker compose ps`
- Did you wait for startup? Logs should say "Server listening on :3001"

**Q: API keys not working**
- Double-check you copied the full key (no spaces at start/end)
- Health check dashboard shows status: green = healthy, red = invalid or rate-limited
- Try making a request to /v1/models to see detailed error

**Q: Getting 429 errors frequently**
- Free tiers have caps. Check the **Analytics** tab to see which provider hit the limit
- Add more keys, or reorder the Fallback Chain to deprioritize exhausted providers
- Wait until UTC midnight for daily caps to reset

**Q: Want to reset everything**
```bash
docker compose down -v  # Delete data volume
# Restart with new .env
ENCRYPTION_KEY="$(openssl rand -hex 32)"
printf "ENCRYPTION_KEY=%s\n" "$ENCRYPTION_KEY" > .env
docker compose up -d
```

## Next: Use it in the project

See `lib/llm-router.ts` (in root) for a helper that routes between Claude and FreeLLMAPI based on cost/availability.
