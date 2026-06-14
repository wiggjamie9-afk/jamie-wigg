# Setup Guide - PDF Analyzer API

Get the PDF Analyzer API running locally in 5 minutes.

## Prerequisites

- Python 3.9+ (download from python.org)
- Git
- Text editor (VS Code, Sublime, etc.)

## Step 1: Clone or Download

```bash
# Clone from GitHub (if available)
git clone https://github.com/your-username/pdf-analyzer-api.git
cd pdf-analyzer-api

# Or download and extract the ZIP file
```

## Step 2: Create Virtual Environment

```bash
# On macOS/Linux
python3 -m venv venv
source venv/bin/activate

# On Windows
python -m venv venv
venv\Scripts\activate
```

You should see `(venv)` in your terminal.

## Step 3: Install Dependencies

```bash
pip install -r requirements.txt
```

This installs:
- FastAPI - Web framework
- Uvicorn - ASGI server
- PyPDF2 - PDF text extraction
- Anthropic - Claude API client
- Python-dotenv - Environment variables

## Step 4: Configure API Key

### Get Claude API Key

1. Go to https://console.anthropic.com/
2. Sign in or create account
3. Click "API keys" (left sidebar)
4. Click "Create Key"
5. Copy the key (starts with `sk-ant-`)

### Add to Project

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your editor
# Add your key: ANTHROPIC_API_KEY=sk-ant-xxxxx
```

On Windows:
```bash
copy .env.example .env
# Then open .env in Notepad and add your key
```

## Step 5: Run the Server

```bash
python main.py
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
```

## Step 6: Test the API

### In Browser
Open http://localhost:8000

You should see:
```json
{
  "status": "healthy",
  "service": "PDF Analyzer API",
  "version": "1.0.0",
  ...
}
```

### Interactive API Docs
Visit http://localhost:8000/docs

Try it out:
1. Click "Analyze PDF" endpoint
2. Click "Try it out"
3. Upload a PDF
4. Click "Execute"

### With cURL

```bash
# Test health check
curl http://localhost:8000/

# Extract text from PDF
curl -X POST "http://localhost:8000/extract" \
  -F "file=@your-document.pdf"

# Analyze PDF
curl -X POST "http://localhost:8000/analyze" \
  -F "file=@your-document.pdf" \
  -F "analysis_type=summary"
```

## Quick Examples

### Example 1: Extract Text
```bash
curl -X POST "http://localhost:8000/extract" \
  -F "file=@example.pdf" \
  | jq '.text' | head -20
```

### Example 2: Summarize Document
```bash
curl -X POST "http://localhost:8000/analyze" \
  -F "file=@research-paper.pdf" \
  -F "analysis_type=summary"
```

### Example 3: Chat About PDF
```bash
curl -X POST "http://localhost:8000/chat" \
  -F "file=@report.pdf" \
  -F "messages=[{\"role\":\"user\",\"content\":\"What are the main findings?\"}]"
```

### Example 4: Extract Key Information
```bash
curl -X POST "http://localhost:8000/analyze" \
  -F "file=@contract.pdf" \
  -F "analysis_type=extraction" \
  -F "query=Extract dates, amounts, and parties"
```

## Troubleshooting

### "ModuleNotFoundError: No module named 'fastapi'"

**Solution**: Install dependencies
```bash
pip install -r requirements.txt
```

### "ANTHROPIC_API_KEY not found"

**Solution**: 
1. Check .env file exists: `ls -la .env`
2. Check file has your key: `cat .env`
3. Restart server: `Ctrl+C` then `python main.py`

### "Port 8000 already in use"

**Solution**: Use different port
```bash
PORT=8001 python main.py
# Now access at http://localhost:8001
```

### "Invalid PDF" error

**Solution**: Ensure PDF is:
- A real PDF file (not corrupted)
- Text-based (not image-only scans)
- Less than 100MB

### Server won't start

**Solution**: Check logs
```bash
# See full error output
python main.py 2>&1 | head -50

# Or check Python version
python --version  # Should be 3.9+
```

## Next Steps

1. ✅ Read the [README.md](README.md) for API documentation
2. ✅ Try the [interactive docs](http://localhost:8000/docs)
3. ✅ Build your application
4. ✅ Deploy to production (see [DEPLOYMENT.md](DEPLOYMENT.md))

## File Structure

```
pdf-analyzer-api/
├── main.py              # FastAPI application
├── requirements.txt     # Python packages
├── .env                 # Your API keys (DO NOT COMMIT)
├── .env.example         # Template (safe to commit)
├── README.md            # API documentation
├── SETUP.md             # This file
├── DEPLOYMENT.md        # Deployment guides
├── Dockerfile           # Docker configuration
└── venv/                # Virtual environment (created)
```

## Development Tips

### Hot Reload
Changes to code auto-reload:
```bash
python main.py
# Edit main.py and save → Server reloads automatically
```

### Code Formatting
```bash
pip install black
black main.py
```

### Type Checking
```bash
pip install mypy
mypy main.py
```

### Debugging
```python
# Add to main.py for debugging
import logging
logging.basicConfig(level=logging.DEBUG)
```

## Common Tasks

### Add New Endpoint
```python
@app.post("/custom")
async def my_endpoint(file: UploadFile = File(...)):
    # Your code here
    return {"status": "success"}
```

### Change Analysis Prompt
Edit the `prompt` in `/analyze` endpoint in `main.py`

### Add Authentication
```python
from fastapi.security import APIKeyHeader
api_key_header = APIKeyHeader(name="X-API-Key")
```

### Add Database
```bash
pip install sqlalchemy psycopg2
# Add database connection code
```

## Getting Help

- **FastAPI**: https://fastapi.tiangolo.com
- **Claude API**: https://anthropic.com/docs
- **Python**: https://python.org/docs
- **Issues**: Post in GitHub issues

## Ready to Deploy?

See [DEPLOYMENT.md](DEPLOYMENT.md) for:
- Render.app (recommended, easiest)
- Docker containers
- AWS EC2
- Railway.app
- And more...

---

**That's it!** You're ready to analyze PDFs with AI. 🎉

Need help? See the README or open an issue on GitHub.
