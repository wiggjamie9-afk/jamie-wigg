# Code Reviewer 🤖

An AI-powered code review tool that uses Claude and DeepSeek APIs to provide intelligent feedback on code quality, best practices, and security.

## Features

- ✨ **Dual-Model Architecture**
  - Claude Sonnet for premium reviews (best quality)
  - DeepSeek for free reviews (fast & cheap)
  - Smart routing based on code length & user tier

- 🎯 **Comprehensive Analysis**
  - Bug and security vulnerability detection
  - Performance optimization suggestions
  - Code style and best practices review
  - Actionable improvement recommendations

- 🔗 **GitHub Integration**
  - Automatic PR reviews via webhooks
  - Comments posted directly on PRs
  - Webhook signature verification
  - Safe and secure integration

- 🌐 **Web Interface**
  - Beautiful dark-themed UI
  - Real-time code analysis
  - Multiple language support
  - Pro/Free mode toggle

- 📦 **Production Ready**
  - Vercel deployment configured
  - Environment variable management
  - TypeScript + Next.js 15
  - Tailwind CSS styling

## Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Add your API keys to .env.local
ANTHROPIC_API_KEY=sk-ant-...
DEEPSEEK_API_KEY=sk-...

# Start dev server
npm run dev
```

Visit http://localhost:3000

### Using the Web Interface

1. Paste your code in the editor
2. Select the language
3. Choose **Pro Mode** (Claude) or **Free Mode** (DeepSeek)
4. Click "Review Code"
5. Get instant feedback

## Deployment

### To Vercel (Recommended)

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

```bash
# Quick deploy
vercel --prod
```

### With GitHub Webhooks

See [GITHUB_WEBHOOK.md](./GITHUB_WEBHOOK.md) for setup.

Automatically review pull requests when they're opened!

## Architecture

### API Routes

| Endpoint | Purpose |
|----------|---------|
| `POST /api/review` | Manual code review |
| `POST /api/webhook/github` | GitHub PR webhook handler |

### Models

- **Claude Sonnet** (`claude-3-5-sonnet-20241022`) - Deep analysis
- **DeepSeek Chat** - Fast reviews
- **Fallback** - Basic pattern analysis

## Configuration

### Environment Variables

```bash
# Code Review APIs
ANTHROPIC_API_KEY=sk-ant-...      # Claude (optional)
DEEPSEEK_API_KEY=sk-...            # DeepSeek (optional)

# GitHub Integration (optional)
GITHUB_TOKEN=ghp_...               # GitHub PAT
GITHUB_WEBHOOK_SECRET=...          # Webhook signature secret

# Stripe (optional)
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

At least one API key required for reviews.

## Cost Estimates

| Service | Per Review | 100 Reviews/mo |
|---------|-----------|----------------|
| DeepSeek | ~$0.0001 | ~$0.01 |
| Claude | ~$0.01 | ~$1 |
| Vercel | Free | Free (< 100GB) |

## Documentation

- [Setup Guide](./SETUP.md) - Installation & configuration
- [Deployment Guide](./DEPLOYMENT.md) - Deploy to Vercel
- [GitHub Webhook Guide](./GITHUB_WEBHOOK.md) - Auto-review PRs

## API Documentation

### Manual Code Review

**Endpoint**: `POST /api/review`

**Request**:
```bash
curl -X POST http://localhost:3000/api/review \
  -H "Content-Type: application/json" \
  -d '{
    "code": "function hello() { console.log(\"world\"); }",
    "language": "javascript",
    "isPro": true
  }'
```

**Response**:
```json
{
  "review": "Code review feedback here..."
}
```

### GitHub Webhook

**Endpoint**: `POST /api/webhook/github`

Automatically triggered when a PR is opened. Posts review as a comment.

See [GITHUB_WEBHOOK.md](./GITHUB_WEBHOOK.md) for setup instructions.

## Development

```bash
# Install
npm install

# Dev server
npm run dev

# Build
npm run build

# Type check
npm run lint
```

## Project Structure

```
code-reviewer/
├── app/
│   ├── api/
│   │   ├── review/           # Manual review endpoint
│   │   └── webhook/github/   # GitHub webhook handler
│   ├── page.tsx              # Web interface
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Tailwind styles
├── public/                    # Static assets
├── .env.example              # Environment template
├── vercel.json               # Vercel config
├── SETUP.md                  # Setup guide
├── DEPLOYMENT.md             # Deployment guide
└── GITHUB_WEBHOOK.md         # Webhook setup
```

## Security

- ✅ GitHub webhook signature verification
- ✅ Environment variables encrypted in Vercel
- ✅ No data stored (stateless)
- ✅ HTTPS only
- ✅ Least privilege GitHub token

## License

MIT

---

**Made with ❤️ by Claude Code**

Get started: `npm install && npm run dev`
