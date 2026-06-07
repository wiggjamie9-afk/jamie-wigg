# Freebuff2API

An OpenAI-compatible proxy server for Freebuff. Translate standard OpenAI API requests into Freebuff's backend format, enabling seamless integration with any OpenAI-compatible client, SDK, or CLI tool.

## Features

- **OpenAI Compatible API** — Standard OpenAI endpoints; works with any compatible client out of the box
- **Stealth Request Handling** — Dynamic, randomized client fingerprints that mimic official Freebuff SDK behavior
- **Multi-Token Rotation** — Cycle through multiple auth tokens with automatic periodic rotation
- **HTTP Proxy Support** — Route all outbound traffic through a configurable upstream proxy
- **Health Checks** — Built-in `/health` endpoint for load balancers

## Getting Auth Tokens

### Method 1 — Web (Recommended)

Visit [https://freebuff.llm.pm](https://freebuff.llm.pm), log in with your Freebuff account, and copy your auth token.

### Method 2 — Freebuff CLI

```bash
npm i -g freebuff
freebuff
```

Your token will be saved to:
- **Windows**: `C:\Users\<username>\.config\manicode\credentials.json`
- **Linux/macOS**: `~/.config/manicode/credentials.json`

Extract the `authToken` value.

## Configuration

Configuration is handled via `config.json` and/or environment variables. Environment variables override JSON values.

### config.json

```json
{
  "LISTEN_ADDR": ":8080",
  "UPSTREAM_BASE_URL": "https://codebuff.com",
  "AUTH_TOKENS": ["token1", "token2"],
  "ROTATION_INTERVAL": "6h",
  "REQUEST_TIMEOUT": "15m",
  "API_KEYS": [],
  "HTTP_PROXY": ""
}
```

### Environment Variables

```bash
export AUTH_TOKENS="token1,token2"
export LISTEN_ADDR=":8080"
export UPSTREAM_BASE_URL="https://codebuff.com"
export ROTATION_INTERVAL="6h"
export REQUEST_TIMEOUT="15m"
export API_KEYS="key1,key2"
export HTTP_PROXY="http://proxy:8080"
```

## Installation & Usage

### From Source

Requirements: Go 1.23+

```bash
git clone https://github.com/Quorinex/Freebuff2API.git
cd Freebuff2API
go build -o freebuff2api .
./freebuff2api -config config.json
```

### Docker

```bash
docker run -d --name freebuff2api \
  -p 8080:8080 \
  -e AUTH_TOKENS="token1,token2" \
  ghcr.io/quorinex/freebuff2api:latest
```

### Development

```bash
make dev          # Run with hot-reload (requires entr or similar)
make test         # Run tests
make lint         # Format and lint code
make docker-build # Build Docker image
make docker-run   # Run Docker container
```

## API Endpoints

- `POST /v1/chat/completions` — Chat completion endpoint
- `POST /v1/completions` — Text completion endpoint
- `GET /v1/models` — List available models
- `GET /health` — Health check

## Example Usage

```bash
curl http://localhost:8080/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

With client API key validation:

```bash
curl http://localhost:8080/v1/chat/completions \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

## Configuration Reference

| Key | Env Var | Default | Description |
|---|---|---|---|
| LISTEN_ADDR | LISTEN_ADDR | `:8080` | Proxy listen address |
| UPSTREAM_BASE_URL | UPSTREAM_BASE_URL | `https://codebuff.com` | Freebuff backend URL |
| AUTH_TOKENS | AUTH_TOKENS | `[]` | Freebuff auth tokens (JSON array or comma-separated) |
| ROTATION_INTERVAL | ROTATION_INTERVAL | `6h` | Token rotation interval |
| REQUEST_TIMEOUT | REQUEST_TIMEOUT | `15m` | Upstream request timeout |
| API_KEYS | API_KEYS | `[]` | Client API keys for proxy auth (empty = open access) |
| HTTP_PROXY | HTTP_PROXY | `` | HTTP proxy for outbound requests |

## Links

- [Freebuff Web](https://freebuff.llm.pm)
- [Linux.do](https://linux.do)

## Disclaimer

This project has no official affiliation with OpenAI, Codebuff, or Freebuff. All related trademarks and copyrights belong to their respective owners.

All contents within this repository are provided solely for communication, experimentation, and learning, and do not constitute production-ready services or professional advice. This project is provided on an "As-Is" basis without any warranties.

## License

MIT
