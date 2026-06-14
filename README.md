# 🎯 Complete AI-Powered Ecosystem

A production-ready, full-stack application ecosystem for intelligent code review and PDF analysis with Claude AI.

## 📦 What's Included

### **1. Code Reviewer** 🔍
Next.js web app + GitHub automation for intelligent code review.

- ✨ Beautiful dark UI with code highlighting
- 🤖 Dual AI models (Claude Sonnet + DeepSeek)
- 🔗 GitHub PR webhook automation
- 💬 Real-time code feedback
- 📊 Token usage tracking

**Tech**: Next.js 15, TypeScript, Tailwind CSS, Octokit

### **2. PDF Analyzer API** 📄
FastAPI REST backend for PDF analysis and conversation.

- 📥 PDF text extraction (PyPDF2)
- 🤖 AI-powered analysis with Claude
- 💬 Multi-turn chat about PDFs
- 🎯 4 analysis types (summary, extraction, Q&A, general)
- 📊 Token usage monitoring
- 🐳 Docker support

**Tech**: FastAPI, Python 3.11, PyPDF2, Claude API

### **3. PDF Analyzer Web** 🌐
Beautiful Next.js frontend for PDF upload and analysis.

- ✨ Gradient dark theme UI
- 📥 Drag-and-drop file upload
- 🎯 Multiple analysis modes
- 💬 Interactive chat interface
- 📊 Results export to text
- 🔗 Seamless API integration

**Tech**: Next.js 15, TypeScript, Tailwind, Axios

---

## 🚀 Quick Start (5 minutes)

### Install All

```bash
# Clone repo and enter directory
cd your-repo

# Install all dependencies
bash scripts/install-all.sh
```

### Run All Locally

```bash
# Start all three services
bash scripts/dev.sh
```

Visit:
- **PDF Analyzer Web**: http://localhost:3000
- **Code Reviewer**: http://localhost:3001  
- **API Docs**: http://localhost:8000/docs

---

## 🏗️ Architecture

```
Frontend (Next.js)          API (FastAPI)          AI Model (Cloud)
┌─────────────────┐        ┌──────────────┐       ┌─────────────┐
│ PDF Analyzer    │───────▶│ PDF Analyzer │──────▶│ Claude API  │
│ Code Reviewer   │        │ API          │       │             │
└─────────────────┘        └──────────────┘       └─────────────┘
```

---

## 🚀 Production Deployment

### Railway + Vercel (15 minutes)

```bash
# Backend to Railway
cd pdf-analyzer-api
railway login
railway up

# Frontend to Vercel
cd ../pdf-analyzer-web
vercel --prod
```

See [DEPLOYMENT_INSTRUCTIONS.md](./DEPLOYMENT_INSTRUCTIONS.md) for complete guide.

---

## 🔑 Setup

### 1. Get API Keys
- Claude: https://console.anthropic.com/ (required)
- DeepSeek: https://platform.deepseek.com/ (optional)
- GitHub: https://github.com/settings/tokens (optional)

### 2. Configure

```bash
# API configuration
cd pdf-analyzer-api
cp .env.example .env
# Edit .env with your ANTHROPIC_API_KEY

# Frontend (optional - defaults to localhost:8000)
cd ../pdf-analyzer-web
cp .env.example .env.local
```

---

## 📊 What's Included

✅ **3 Full Applications** with docs
✅ **Complete Deployment Guide** (Railway + Vercel)
✅ **GitHub Webhook Automation** for PR reviews
✅ **API Documentation** with Swagger UI
✅ **Docker Support** for easy deployment
✅ **TypeScript + Python** for type safety
✅ **Responsive Design** for all devices
✅ **Production Ready** code

---

## 📚 Documentation

- [Code Reviewer](./code-reviewer/README.md) - Code review tool
- [PDF Analyzer API](./pdf-analyzer-api/README.md) - Backend API
- [PDF Analyzer Web](./pdf-analyzer-web/README.md) - Frontend interface
- [Deployment Guide](./DEPLOYMENT_INSTRUCTIONS.md) - Railway & Vercel
- [GitHub Webhooks](./pdf-analyzer-api/GITHUB_WEBHOOK.md) - Auto PR reviews

---

## 💰 Costs

| Service | Free Tier | Monthly |
|---------|-----------|---------|
| Railway | 512MB RAM | $5-50 |
| Vercel | 100GB bandwidth | Free |
| Claude API | — | $1-10 (per 100 reviews) |
| **Total** | **Free** | **$6-60/mo** |

---

## 🎯 Next Steps

1. **Local Testing**: Run `bash scripts/dev.sh`
2. **Deploy Backend**: Follow Railway guide
3. **Deploy Frontend**: Follow Vercel guide
4. **Test Integration**: Upload PDF and analyze
5. **GitHub Setup**: Configure webhook for PR reviews

---

**Made with ❤️ by Claude Code** 

Start: `bash scripts/dev.sh`

Deploy: [DEPLOYMENT_INSTRUCTIONS.md](./DEPLOYMENT_INSTRUCTIONS.md)
