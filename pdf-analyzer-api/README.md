# PDF Analyzer API 📄

A FastAPI-based REST API for analyzing PDF documents with AI-powered insights using Claude.

## Features

- ✨ **PDF Text Extraction** - Extract text from PDF files
- 🤖 **AI Analysis** - Comprehensive analysis with Claude Sonnet
- 💬 **Interactive Chat** - Have conversations about PDF content
- 🎯 **Multiple Analysis Types**
  - General analysis
  - Executive summary
  - Key information extraction
  - Q&A generation
- 🔐 **Secure** - Environment variable configuration
- 📊 **Token Usage Tracking** - Monitor API consumption

## Quick Start

### Prerequisites

- Python 3.9+
- Claude API key (get from https://console.anthropic.com/)

### Installation

```bash
# Create virtual environment
python -m venv venv

# Activate (Linux/Mac)
source venv/bin/activate
# Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your API key
ANTHROPIC_API_KEY=sk-ant-...
```

### Run Server

```bash
# Development
python main.py

# Production (with port configuration)
PORT=8000 python main.py

# Or with uvicorn directly
uvicorn main:app --reload --port 8000
```

Server runs at: **http://localhost:8000**

## API Endpoints

### 1. Health Check
```bash
GET /
```

Returns API status and available endpoints.

### 2. Analyze PDF
```bash
POST /analyze
Content-Type: multipart/form-data

Parameters:
- file (required): PDF file
- query (optional): Custom analysis question
- analysis_type (optional): general|summary|extraction|questions
```

**Example:**
```bash
curl -X POST "http://localhost:8000/analyze" \
  -F "file=@document.pdf" \
  -F "query=What are the main conclusions?" \
  -F "analysis_type=general"
```

**Response:**
```json
{
  "status": "success",
  "analysis": "Detailed analysis of the PDF...",
  "pages_analyzed": 10,
  "tokens_used": 2450
}
```

### 3. Chat with PDF
```bash
POST /chat
Content-Type: multipart/form-data

Parameters:
- file (required): PDF file
- messages (optional): Array of messages [{role, content}]
```

**Example:**
```bash
curl -X POST "http://localhost:8000/chat" \
  -F "file=@document.pdf" \
  -F "messages=[{\"role\":\"user\",\"content\":\"Summarize in 3 points\"}]"
```

**Response:**
```json
{
  "status": "success",
  "response": "1. Point one...\n2. Point two...\n3. Point three...",
  "pages_analyzed": 10,
  "tokens_used": 1850
}
```

### 4. Extract Text Only
```bash
POST /extract
Content-Type: multipart/form-data

Parameters:
- file (required): PDF file
```

**Response:**
```json
{
  "status": "success",
  "text": "Extracted PDF text...",
  "pages": 10,
  "characters": 45230
}
```

## Analysis Types

| Type | Purpose |
|------|---------|
| `general` | Comprehensive analysis with multiple sections |
| `summary` | Executive summary of the document |
| `extraction` | Extract and organize key information |
| `questions` | Generate Q&A based on content |

## Usage Examples

### Python Client
```python
import requests

# Upload and analyze
with open("document.pdf", "rb") as f:
    response = requests.post(
        "http://localhost:8000/analyze",
        files={"file": f},
        data={
            "query": "What are the main topics?",
            "analysis_type": "general"
        }
    )

print(response.json()["analysis"])
```

### JavaScript/Node.js
```javascript
const FormData = require('form-data');
const fs = require('fs');
const axios = require('axios');

const formData = new FormData();
formData.append('file', fs.createReadStream('document.pdf'));
formData.append('query', 'Summarize the key points');
formData.append('analysis_type', 'summary');

const response = await axios.post(
  'http://localhost:8000/analyze',
  formData,
  { headers: formData.getHeaders() }
);

console.log(response.data.analysis);
```

### cURL
```bash
# Extract text
curl -X POST "http://localhost:8000/extract" \
  -F "file=@document.pdf" | jq '.text'

# Analyze PDF
curl -X POST "http://localhost:8000/analyze" \
  -F "file=@document.pdf" \
  -F "query=What is the purpose of this document?" | jq '.analysis'

# Chat about PDF
curl -X POST "http://localhost:8000/chat" \
  -F "file=@document.pdf" \
  -F "messages=[{\"role\":\"user\",\"content\":\"Explain like I'm 5\"}]" | jq '.response'
```

## Environment Variables

```bash
# Required
ANTHROPIC_API_KEY=sk-ant-...     # Claude API key

# Optional
PORT=8000                        # Server port (default: 8000)
ENV=development                  # Environment (development/production)
STRIPE_SECRET_KEY=...           # Stripe for payments
STRIPE_PUBLISHABLE_KEY=...      # Stripe client key
```

## Performance Limits

- **Max PDF Size**: ~100MB
- **Max Text Length**: 100,000 characters (approximately 25 pages)
- **Max Tokens**: Depends on Claude model (200K for Sonnet)
- **Timeout**: 30 seconds per request

## Cost Estimation

| Operation | Tokens | Cost |
|-----------|--------|------|
| Extract text | ~10K | $0.15 |
| Quick analysis | ~20K | $0.30 |
| Full analysis | ~40K | $0.60 |
| Chat conversation | ~50K | $0.75 |

## Error Handling

| Status | Error | Solution |
|--------|-------|----------|
| 400 | "PDF extraction error" | Ensure PDF is valid and readable |
| 400 | "PDF appears to be empty" | PDF has no extractable text |
| 401 | "API key invalid" | Check ANTHROPIC_API_KEY |
| 500 | "Analysis error" | Check server logs and retry |

## Deployment

### Docker

```bash
# Build
docker build -t pdf-analyzer-api .

# Run
docker run -p 8000:8000 \
  -e ANTHROPIC_API_KEY=sk-ant-... \
  pdf-analyzer-api
```

### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod --env ANTHROPIC_API_KEY=sk-ant-...
```

### PythonAnywhere

1. Upload project files
2. Set up virtual environment
3. Configure WSGI with `main:app`
4. Add environment variables in settings
5. Reload web app

## Development

### File Structure
```
pdf-analyzer-api/
├── main.py              # FastAPI application
├── requirements.txt     # Python dependencies
├── .env.example         # Environment template
├── README.md            # This file
└── venv/                # Virtual environment
```

### Testing

```bash
# Test endpoints
curl http://localhost:8000/

# Test with sample PDF
curl -X POST "http://localhost:8000/analyze" \
  -F "file=@sample.pdf"
```

### Code Quality

```bash
# Format code
pip install black
black main.py

# Type checking
pip install mypy
mypy main.py

# Linting
pip install pylint
pylint main.py
```

## Troubleshooting

### "ModuleNotFoundError: No module named 'fastapi'"
```bash
pip install -r requirements.txt
```

### "ANTHROPIC_API_KEY not found"
```bash
# Check .env file exists and has the key
cat .env
```

### "PDF extraction error"
- Ensure PDF file is not corrupted
- Check file size (max ~100MB)
- Try opening PDF in reader first

### Server won't start
```bash
# Check port is available
lsof -i :8000

# Try different port
PORT=8001 python main.py
```

## API Documentation

Interactive API docs available at:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Roadmap

- [ ] Batch PDF processing
- [ ] PDF image extraction
- [ ] Streaming responses
- [ ] WebSocket chat support
- [ ] Database for chat history
- [ ] Rate limiting
- [ ] Authentication (API keys)
- [ ] Multi-language support
- [ ] Cost estimation endpoint

## References

- FastAPI: https://fastapi.tiangolo.com/
- Claude API: https://anthropic.com/docs
- PyPDF2: https://pypdf.readthedocs.io/

## License

MIT

---

**Made with ❤️ by Claude Code**

Get started: `pip install -r requirements.txt && python main.py`
