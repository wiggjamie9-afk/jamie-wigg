# System Architecture

Complete technical architecture of the ecosystem.

## 🏗️ High-Level Overview

```
┌─────────────────────────────────────────────────────┐
│              Client Layer (Browser)                 │
│                                                      │
│  ┌──────────────────┬────────────────────────────┐  │
│  │ PDF Analyzer Web │  Code Reviewer Web App    │  │
│  │  (http://3000)   │   (http://3001)           │  │
│  └────────┬─────────┴────────────┬───────────────┘  │
└───────────┼──────────────────────┼──────────────────┘
            │ HTTP/REST            │ Webhooks
            ↓                      ↓
┌─────────────────────────────────────────────────────┐
│            Application Layer                         │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │     FastAPI Backend (http://8000)              │ │
│  │  ┌─────────┬──────────┬────────┬────────────┐ │ │
│  │  │ /analyze│ /chat    │/extract│/webhook/gh│ │ │
│  │  └─────────┴──────────┴────────┴────────────┘ │ │
│  └────────────────┬─────────────────────────────┘ │
└───────────────────┼────────────────────────────────┘
                    │
                    ↓
┌─────────────────────────────────────────────────────┐
│         External Services Layer                      │
│                                                      │
│  ┌──────────────────┬──────────────┬──────────────┐ │
│  │   Claude API     │   DeepSeek   │  GitHub API  │ │
│  │  (Cloud AI)      │    API       │  (Webhooks)  │ │
│  └──────────────────┴──────────────┴──────────────┘ │
└─────────────────────────────────────────────────────┘
```

## 📦 Component Details

### Frontend Applications

**PDF Analyzer Web**
- Framework: Next.js 15
- Language: TypeScript
- Styling: Tailwind CSS
- State: React Hooks
- HTTP Client: Axios

**Code Reviewer**
- Framework: Next.js 15
- Language: TypeScript
- Styling: Tailwind CSS
- GitHub Integration: Octokit

Both apps share:
- Similar UI patterns
- Responsive design
- Real-time feedback
- Error handling

### Backend API

**FastAPI Application**
- Framework: FastAPI
- Language: Python 3.11
- ASGI Server: Uvicorn
- PDF Processing: PyPDF2
- AI Integration: Anthropic Claude

Endpoints:
- GET / - Health check
- POST /analyze - PDF analysis
- POST /chat - Interactive chat
- POST /extract - Text extraction
- POST /webhook/github - PR automation

### External Services

**Claude AI (Anthropic)**
- Model: claude-3-5-sonnet-20241022
- Input: PDF text, prompts
- Output: Analysis, chat responses
- Cost: ~$0.003-0.015 per 1K tokens

**DeepSeek (Optional)**
- Model: deepseek-chat
- Input: Code/PDF text
- Output: Quick reviews
- Cost: ~$0.001 per 1K tokens

**GitHub API**
- Webhooks: PR events
- REST: Comment posting
- Authentication: Personal Access Token

## 🔄 Data Flow

### PDF Analysis Flow

```
1. User uploads PDF
   └─> Frontend validates file type
   └─> Sends to /analyze endpoint

2. Backend receives PDF
   └─> Extract text with PyPDF2
   └─> Limit text length (100K chars)
   └─> Create prompt based on analysis type

3. Claude API processes
   └─> Generate analysis
   └─> Return with token count

4. Frontend displays results
   └─> Show analysis text
   └─> Display token usage
   └─> Allow download
```

### Code Review Flow

### GitHub PR Webhook Flow

```
1. PR opened on GitHub
   └─> GitHub sends webhook
   └─> Signature verified (HMAC-SHA256)

2. Webhook handler receives
   └─> Extract PR files
   └─> Get file diffs
   └─> Compile diff text

3. Claude analyzes code
   └─> Generate review
   └─> Post as PR comment

4. Developer sees review
   └─> Reads feedback
   └─> Makes improvements
   └─> Pushes new commit
```

## 🗄️ Data Storage

### In-Memory (No Database)

Current implementation stores nothing:
- Analysis results: Returned, not stored
- Chat history: Browser sessionStorage only
- User data: Not collected

### Optional: Add Database

For persistence, add:

```python
# PostgreSQL
pip install sqlalchemy psycopg2

# Models
class AnalysisHistory(Base):
    id: int
    user_id: int
    pdf_filename: str
    analysis_type: str
    result_text: str
    tokens_used: int
    created_at: datetime
```

## 🔐 Security Architecture

### Authentication (Not Implemented)

To add user authentication:

```python
# FastAPI + Auth0
pip install fastapi-auth0

@app.post("/analyze")
async def analyze(
    file: UploadFile,
    token: str = Depends(auth0)
):
    # Verify token
    # Associate analysis with user
```

### API Key Management

- Claude: Server-side only
- GitHub: Scope-limited token
- Users: Never have backend access

### CORS Configuration

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourdomain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 📊 Scalability Considerations

### Current Limitations

- Single process API
- No caching
- PDF text limited to 100K chars
- No rate limiting

### Scaling Up

1. **Horizontal Scaling**
   - Run multiple API instances
   - Load balancer (nginx)
   - Redis for session storage

2. **Caching**
   - Redis cache for analyses
   - CDN for frontend assets
   - Browser caching

3. **Async Processing**
   - Queue long analyses (Celery)
   - WebSocket for live updates
   - Background workers

4. **Database**
   - PostgreSQL for persistence
   - Elasticsearch for search
   - S3 for file storage

## 🚀 Deployment Architecture

### Railway (Backend)

```
┌─────────────────────┐
│   Railway.app       │
│  ┌───────────────┐  │
│  │  PDF Analyzer │  │
│  │  API Service  │  │
│  └───────────────┘  │
│   - Auto-scaling    │
│   - HTTPS           │
│   - Environment     │
│   - Logs            │
└─────────────────────┘
```

### Vercel (Frontend)

```
┌──────────────────────────┐
│   Vercel                 │
│  ┌────────────────────┐  │
│  │ PDF Analyzer Web   │  │
│  │ Code Reviewer      │  │
│  └────────────────────┘  │
│   - Edge caching        │
│   - Global CDN          │
│   - Serverless          │
│   - Auto-deployments    │
└──────────────────────────┘
```

### Docker (Local)

```
┌──────────────────────────────┐
│      Docker Compose          │
│  ┌─────────┬─────────┐       │
│  │  API    │   Web   │       │
│  └─────────┴─────────┘       │
│  - Same network              │
│  - Service discovery         │
│  - Volume mounts             │
└──────────────────────────────┘
```

## 📈 Performance Optimization

### Frontend
- Code splitting (Next.js)
- Image optimization
- Lazy loading
- Caching headers

### Backend
- Connection pooling
- Response compression
- Async operations
- Query optimization

### Network
- CDN for assets
- API response caching
- Request batching
- Compression (gzip)

## 🔍 Monitoring & Observability

### Logs
- API request/response
- Error stack traces
- Performance metrics
- Business events

### Metrics
- Request count
- Response time
- Error rate
- Token usage

### Tracing
- Request correlation ID
- End-to-end timing
- Dependency tracking
- Error traces

## 📋 Technology Stack Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js + React | Web UI |
| **Styling** | Tailwind CSS | Design |
| **HTTP** | Axios | API calls |
| **Backend** | FastAPI | REST API |
| **Processing** | PyPDF2 | PDF extraction |
| **AI** | Claude API | Intelligence |
| **Deployment** | Railway + Vercel | Hosting |
| **CI/CD** | GitHub Actions | Automation |
| **Monitoring** | Sentry | Error tracking |

---

**For implementation details, see individual README files in each application folder.**
