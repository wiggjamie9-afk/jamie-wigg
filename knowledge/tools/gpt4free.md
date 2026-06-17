# GPT4Free (g4f): Multi-Provider LLM Aggregator

Community-driven project that aggregates multiple accessible LLM and media-generation providers. Provides Python client, FastAPI interface, Docker deployment, and Model Context Protocol (MCP) server support for seamless integration with AI agents.

Created by @xtekky, maintained by @hlohaus. Licensed under GPLv3. Live demo & docs: https://g4f.dev

## What GPT4Free Provides

| Component | Purpose |
|---|---|
| Python client library | Sync/async LLM access with OpenAI-compatible API |
| FastAPI server | Interference API (OpenAI-compatible REST) |
| Web GUI | Chat interface for manual interaction |
| Docker images | Full & slim containerized deployment |
| MCP server | Integration with Claude Desktop and other MCP clients |
| Image generation | Multiple provider backends (FLUX, Sana, Pollinations) |
| Web search | DuckDuckGo integration + web scraping |
| Local inference | Support for local models (Ollama, vLLM, llama.cpp) |

## Quick Installation

**Via pip (recommended):**
```bash
pip install -U g4f[all]
```

**Via Docker (full):**
```bash
docker pull hlohaus789/g4f
docker run -p 8080:8080 -p 7900:7900 \
  --shm-size="2g" \
  -v ${PWD}/har_and_cookies:/app/har_and_cookies \
  -v ${PWD}/generated_media:/app/generated_media \
  hlohaus789/g4f:latest
```

**Via Docker (slim, x64 & arm64):**
```bash
docker run -p 1337:8080 -p 8080:8080 \
  -v ${PWD}/har_and_cookies:/app/har_and_cookies \
  -v ${PWD}/generated_media:/app/generated_media \
  hlohaus789/g4f:latest-slim
```

## Python Client Usage

**Synchronous text completion:**
```python
from g4f.client import Client

client = Client()
response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": "Explain quantum computing"}],
    web_search=False
)
print(response.choices[0].message.content)
```

**Asynchronous usage:**
```python
from g4f.client import AsyncClient
import asyncio

async def main():
    client = AsyncClient()
    response = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": "Hello!"}],
    )
    print(response.choices[0].message.content)

asyncio.run(main())
```

**Image generation:**
```python
from g4f.client import Client

client = Client()
response = client.images.generate(
    model="flux",
    prompt="a white siamese cat",
    response_format="url"
)
print(f"Generated image URL: {response.data[0].url}")
```

## Supported Providers

GPT4Free integrates multiple providers including:
- **OpenAI-compatible endpoints** (local & remote)
- **PerplexityLabs** — reasoning + web search
- **Gemini** — Google's multimodal models
- **MetaAI** — Meta's open LLMs
- **Pollinations** — image, audio, video generation
- **Local inference** — Ollama, vLLM, llama.cpp

Full provider list: https://g4f.dev/docs/providers-and-models

## Interference API (OpenAI-Compatible)

Start FastAPI server with OpenAI-compatible endpoints:

```bash
python -m g4f --port 8080 --debug
```

**Swagger UI:** http://localhost:8080/docs

**Example request:**
```bash
curl -X POST http://localhost:8080/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

## Web GUI

Run interactive chat interface:

```bash
python -m g4f.cli gui --port 8080 --debug
```

Open: http://localhost:8080/chat/

Features:
- Multi-provider model selection
- Web search toggle
- File upload
- Streaming responses
- Session history

## Model Context Protocol (MCP) Server

GPT4Free includes MCP server for Claude Desktop integration.

**Stdio mode (recommended for Claude Desktop):**
```json
// claude_desktop_config.json
{
  "mcpServers": {
    "gpt4free": {
      "command": "python",
      "args": ["-m", "g4f.mcp"]
    }
  }
}
```

**HTTP mode (for remote agents):**
```bash
g4f mcp --http --port 8765
```

**Available MCP tools:**
- `web_search` — DuckDuckGo search
- `web_scrape` — Extract text from URLs
- `image_generation` — FLUX, Sana, Pollinations

**Example MCP tool call:**
```python
# Claude can now call g4f's tools directly
{
  "name": "web_search",
  "arguments": {
    "query": "latest AI research"
  }
}
```

## Configuration & Customization

**Environment variables:**
- `G4F_PROXY` — HTTP proxy for requests
- `G4F_LOG_LEVEL` — Verbosity (debug, info, warning, error)
- `G4F_PROVIDER` — Default provider selection
- `G4F_MODEL` — Default model

**Provider-specific setup:**
- Some providers require API keys (set in `.env` or `~/.g4f/config`)
- Browser automation providers need Chrome/Chromium
- Local models require runtime installation (Ollama, vLLM)

See `docs/config.md` for detailed configuration.

## Local Inference & Media

**Supported local backends:**
- Ollama (llama2, mistral, openchat, etc.)
- vLLM (OpenAI API server)
- llama.cpp (quantized models)
- Local image models (Stable Diffusion, FLUX)

**Media generation:**
- Text-to-image (FLUX, Sana, Pollinations)
- Image-to-video (video providers)
- Text-to-audio (TTS providers)

See `docs/local.md` and `docs/media.md` for setup guides.

## Integration with Nucleus

GPT4Free complements Nucleus/Mary agent architecture:

| Nucleus Component | g4f Integration |
|---|---|
| Mary LLM backbone | Use g4f client for multi-provider failover |
| Tool execution | g4f web_search/scrape tools via MCP |
| Image generation | g4f image_generation for carousel assets |
| Local inference | g4f + Ollama for offline-first mode |

**Example integration pattern:**
```python
# Nucleus orchestrator using GPT4Free
from g4f.client import AsyncClient

async def nucleus_agent():
    g4f_client = AsyncClient()
    
    # Fetch web context
    # Use MCP web_search tool
    
    # Generate response via g4f
    response = await g4f_client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[...],
        web_search=True
    )
    
    # Generate carousel images via g4f
    image = await g4f_client.images.generate(
        model="flux",
        prompt="..."
    )
    
    return {
        "text": response,
        "image": image
    }
```

## Docker Deployment Recipes

**Full image with browser login:**
```bash
docker run -p 8080:8080 -p 7900:7900 \
  --shm-size="2g" \
  -v ${PWD}/har_and_cookies:/app/har_and_cookies \
  -v ${PWD}/generated_media:/app/generated_media \
  hlohaus789/g4f:latest

# Access VNC desktop for provider login at:
# http://localhost:7900/?autoconnect=1&resize=scale&password=secret
```

**Slim image (minimal footprint):**
```bash
docker run -p 1337:8080 -p 8080:8080 \
  -v ${PWD}/har_and_cookies:/app/har_and_cookies \
  -v ${PWD}/generated_media:/app/generated_media \
  hlohaus789/g4f:latest-slim

# Auto-installs dependencies on startup
```

**Custom provider configuration:**
```bash
docker run -p 8080:8080 \
  -e G4F_PROVIDER=openai \
  -e G4F_MODEL=gpt-4 \
  -v ~/.g4f/config:/app/.g4f/config \
  hlohaus789/g4f:latest
```

## Streaming & Advanced Patterns

**Streaming completions:**
```python
from g4f.client import Client

client = Client()
stream = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Write a poem"}],
    stream=True
)

for chunk in stream:
    print(chunk.choices[0].delta.content, end="")
```

**Tool calling:**
```python
response = client.chat.completions.create(
    model="gpt-4",
    messages=[...],
    tools=[
        {
            "type": "function",
            "function": {
                "name": "search",
                "description": "Search the web",
                "parameters": {...}
            }
        }
    ],
    tool_choice="auto"
)
```

**System messages & temperature:**
```python
response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "system", "content": "You are a helpful assistant"},
        {"role": "user", "content": "Hello"}
    ],
    temperature=0.7,
    top_p=0.9,
    max_tokens=1000
)
```

## Browser JavaScript Client

Use g4f directly in the browser:

```html
<script type="module">
  import Client from 'https://g4f.dev/dist/js/client.js';

  const client = new Client();
  const result = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: 'Explain quantum computing' }]
  });
  console.log(result.choices[0].message.content);
</script>
```

## Security & Privacy

**Best practices:**
- Don't store API keys in code — use `.env` files (gitignored)
- Run behind HTTPS in production
- Restrict access with authentication + firewall rules
- Limit provider credentials to necessary scopes
- Use HAR files / cookies securely (mounted volumes, not hardcoded)

**Takedown / data privacy:**
- If your site appears in g4f's links and you want it removed, contact takedown@g4f.ai
- g4f respects robots.txt and user privacy — use responsibly

## Contributing

**Add a new provider:**
1. Implement `g4f/Provider/YourProvider.py`
2. Add tests and examples
3. Document configuration/requirements
4. Open PR to https://github.com/xtekky/gpt4free

**Report issues:**
https://github.com/xtekky/gpt4free/issues

## For One-Person Builders

GPT4Free is ideal for:
- **Multi-model fallback** — Try GPT-4, fallback to cheaper alternatives
- **Cost optimization** — Free/cheap providers for non-critical tasks
- **Local-first workflows** — Combine local inference + cloud providers
- **Offline agents** — Ollama + vLLM for edge deployment
- **Rapid prototyping** — No API keys required for many providers

Set provider preferences at runtime:
```python
# Use Claude if available; fallback to ChatGPT; final fallback to free provider
providers = ["Claude", "ChatGPT", "Blackbox"]
for provider in providers:
    try:
        response = client.chat.completions.create(
            model="gpt-4",
            provider=provider,
            ...
        )
        break
    except:
        continue
```

## Key Links

- **Website**: https://g4f.dev
- **Docs**: https://g4f.dev/docs
- **PyPI**: https://pypi.org/project/g4f
- **Docker Hub**: https://hub.docker.com/r/hlohaus789/g4f
- **GitHub**: https://github.com/xtekky/gpt4free
- **Manifesto**: https://g4f.dev/manifesto
- **Community**: Discord (support & news), Telegram (@g4f_channel)

## License

GPLv3 — freely redistributable with attribution. See https://www.gnu.org/licenses/gpl-3.0.txt

---

**Use Case for Ecosystem:** GPT4Free MCP server provides multi-provider LLM access, web search, image generation, and local inference capabilities. Integrate with Nucleus as a complementary provider aggregation layer (Kimi K2 as primary, g4f as fallback + web search + image generation). Enables cost-optimized, resilient agent pipelines with automatic provider failover.
