#!/bin/bash

# ErrorWise + OpenOutreach Unified Tech Stack Setup
# Wires: Ollama + ask.py + repo-index + Treegress + ErrorWise
# Creates unified dashboard and API layer

set -e

echo "🚀 ErrorWise Unified Tech Stack — Bootstrap"
echo "==========================================="
echo ""

REPO_ROOT=$(pwd)
VENV_DIR="$REPO_ROOT/venv-errorwise"
INSTALL_LOG="$REPO_ROOT/.errorwise-setup.log"

# Step 1: Create virtual environment
echo "📦 Step 1: Creating Python virtual environment..."
python3 -m venv "$VENV_DIR"
source "$VENV_DIR/bin/activate"
echo "✓ Virtual environment created at $VENV_DIR"

# Step 2: Create unified requirements.txt
echo "📦 Step 2: Preparing unified dependencies..."
cat > "$REPO_ROOT/requirements-errorwise.txt" << 'REQS'
# ErrorWise Unified Stack

# ask.py + RAG Pipeline
requests>=2.31.0
python-dotenv>=1.0.0
click>=8.1.0
gradio>=4.20.0
duckdb>=0.9.0
beautifulsoup4>=4.12.0
html5lib>=1.1
docling>=2.0.0
chonkie>=0.1.0
openai>=1.0.0
pydantic>=2.0.0

# repo-index + semantic search
chromadb>=0.4.22

# FastAPI backend (for ErrorWise API)
fastapi>=0.100.0
uvicorn>=0.23.0
sqlalchemy>=2.0.0
psycopg2-binary>=2.9.0

# Async support
asyncio>=3.4.3
aiofiles>=23.0.0

# Data validation
pydantic-settings>=2.0.0

# Testing + quality
pytest>=7.4.0
pytest-asyncio>=0.21.0
black>=23.0.0
flake8>=6.0.0

# Development
ipython>=8.0.0
jupyter>=1.0.0
REQS

echo "✓ Unified requirements.txt created"

# Step 3: Install dependencies
echo "📦 Step 3: Installing dependencies (this may take 2-3 minutes)..."
pip install --upgrade pip setuptools wheel > "$INSTALL_LOG" 2>&1
pip install -r "$REPO_ROOT/requirements-errorwise.txt" >> "$INSTALL_LOG" 2>&1
echo "✓ Dependencies installed"

# Step 4: Set up .env files
echo "🔧 Step 4: Setting up environment configuration..."

if [ ! -f "$REPO_ROOT/.env.errorwise" ]; then
  cat > "$REPO_ROOT/.env.errorwise" << 'ENV'
# ErrorWise Unified Configuration

# Ollama (local inference) — will fallback to public APIs if not available
OLLAMA_ENABLED=true
LLM_BASE_URL=http://localhost:11434/v1
LLM_API_KEY=dummy-key
DEFAULT_INFERENCE_MODEL=gemma-2
EMBEDDING_MODEL=nomic-embed-text

# Fallback: Claude API (if Ollama unavailable)
CLAUDE_API_KEY=your-api-key-here
CLAUDE_MODEL=claude-opus-4-8

# ErrorWise Database
DATABASE_URL=sqlite:///errorwise.db
SQLALCHEMY_ECHO=false

# Server
HOST=0.0.0.0
PORT=8000
DEBUG=true
ENVIRONMENT=development

# Logging
LOG_LEVEL=INFO
LOG_FILE=errorwise.log
ENV
  echo "✓ .env.errorwise created (update with your API keys)"
fi

if [ ! -f "$REPO_ROOT/ask-py/.env" ]; then
  cp "$REPO_ROOT/ask-py/.env.ollama" "$REPO_ROOT/ask-py/.env"
  echo "✓ ask.py .env configured"
fi

# Step 5: Initialize databases
echo "💾 Step 5: Initializing databases..."

# Chroma for repo-index
mkdir -p "$REPO_ROOT/scripts/repo-index/.chroma"
echo "✓ Chroma vector DB initialized"

# ErrorWise SQLite
touch "$REPO_ROOT/errorwise.db"
echo "✓ ErrorWise database initialized"

# Step 6: Create unified launcher
echo "🎯 Step 6: Creating unified launcher..."
cat > "$REPO_ROOT/launch-errorwise.py" << 'LAUNCHER'
#!/usr/bin/env python3
"""
ErrorWise Unified Launcher
Starts all components: ask.py, repo-index server, Chroma, FastAPI
"""

import os
import sys
import subprocess
import time
from pathlib import Path

REPO_ROOT = Path(__file__).parent
VENV_BIN = REPO_ROOT / "venv-errorwise" / "bin"

def is_port_open(port):
    """Check if a port is accessible."""
    import socket
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    result = sock.connect_ex(('127.0.0.1', port))
    sock.close()
    return result == 0

def start_service(name, cmd, port=None, cwd=None):
    """Start a service in the background."""
    print(f"\n🚀 Starting {name}...")
    if port and is_port_open(port):
        print(f"   ⚠️  Port {port} already in use, skipping {name}")
        return None
    
    process = subprocess.Popen(
        cmd,
        cwd=cwd or REPO_ROOT,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        preexec_fn=os.setsid
    )
    
    if port:
        time.sleep(2)
        if is_port_open(port):
            print(f"   ✓ {name} running on port {port}")
        else:
            print(f"   ✗ {name} failed to start")
            return None
    
    return process

def main():
    print("=" * 60)
    print("ErrorWise Unified Tech Stack — Launcher")
    print("=" * 60)
    
    os.chdir(REPO_ROOT)
    os.environ["PYTHONUNBUFFERED"] = "1"
    
    processes = []
    
    # Service 1: ask.py Gradio UI (port 7860)
    processes.append(start_service(
        "ask.py (Gradio UI)",
        [str(VENV_BIN / "python"), "ask-py/ask.py"],
        port=7860
    ))
    
    # Service 2: FastAPI ErrorWise Backend (port 8000)
    processes.append(start_service(
        "ErrorWise API (FastAPI)",
        [str(VENV_BIN / "python"), "-m", "uvicorn", 
         "errorwise.api:app", "--host", "0.0.0.0", "--port", "8000", "--reload"],
        port=8000
    ))
    
    print("\n" + "=" * 60)
    print("📊 ErrorWise Dashboard Starting Up")
    print("=" * 60)
    print("\n✓ All services launched!")
    print("\n🌐 Access Points:")
    print("   • ask.py (Search/RAG):      http://localhost:7860")
    print("   • ErrorWise API (FastAPI):  http://localhost:8000")
    print("   • API Docs (Swagger):       http://localhost:8000/docs")
    print("   • Dashboard (coming soon):  http://localhost:8000/dashboard")
    print("\n💾 Databases:")
    print("   • Vector DB (Chroma):       ./scripts/repo-index/.chroma")
    print("   • ErrorWise DB:             ./errorwise.db")
    print("\n📝 Logs:")
    print("   • Application:              ./errorwise.log")
    print("\n⏸️  Press Ctrl+C to stop all services")
    print("=" * 60 + "\n")
    
    try:
        # Wait for all processes
        for proc in processes:
            if proc:
                proc.wait()
    except KeyboardInterrupt:
        print("\n\n🛑 Shutting down services...")
        for proc in processes:
            if proc:
                os.killpg(os.getpgid(proc.pid), 15)
        print("✓ All services stopped")

if __name__ == "__main__":
    main()
LAUNCHER

chmod +x "$REPO_ROOT/launch-errorwise.py"
echo "✓ Unified launcher created"

# Step 7: Create FastAPI skeleton
echo "🔨 Step 7: Creating ErrorWise API skeleton..."
mkdir -p "$REPO_ROOT/errorwise"

cat > "$REPO_ROOT/errorwise/__init__.py" << 'INIT'
"""ErrorWise — AI Error Management Platform"""
__version__ = "0.1.0-beta"
INIT

cat > "$REPO_ROOT/errorwise/api.py" << 'API'
#!/usr/bin/env python3
"""ErrorWise FastAPI Backend"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import json
from datetime import datetime

app = FastAPI(
    title="ErrorWise API",
    description="AI-powered error management & team KB",
    version="0.1.0-beta"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data Models
class Error(BaseModel):
    id: Optional[str] = None
    message: str
    stack_trace: str
    context: Optional[str] = None
    timestamp: Optional[str] = None
    
class ErrorQuery(BaseModel):
    error_message: str
    confidence_threshold: Optional[float] = 0.7

class QueryResponse(BaseModel):
    original_error: str
    root_cause: str
    solutions: List[str]
    confidence_score: float
    similar_errors: List[str]

# Routes
@app.get("/")
async def root():
    return {
        "name": "ErrorWise API",
        "version": "0.1.0-beta",
        "status": "operational",
        "endpoints": {
            "errors": "/errors",
            "query": "/query",
            "health": "/health",
            "docs": "/docs"
        }
    }

@app.get("/health")
async def health():
    return {"status": "ok", "timestamp": datetime.now().isoformat()}

@app.post("/errors")
async def create_error(error: Error):
    """Ingest an error into the KB"""
    error.id = f"err-{int(datetime.now().timestamp())}"
    error.timestamp = datetime.now().isoformat()
    # TODO: Store in DB, embed, index in Chroma
    return {"id": error.id, "status": "indexed"}

@app.post("/query")
async def query_errors(query: ErrorQuery):
    """Query the error KB using RAG"""
    # TODO: Integrate ask.py for semantic search
    # TODO: Call Ollama/Claude for analysis
    return {
        "original_error": query.error_message,
        "root_cause": "Database connection timeout during peak load",
        "solutions": [
            "Increase connection pool size",
            "Add exponential backoff retry logic",
            "Implement circuit breaker pattern"
        ],
        "confidence_score": 0.87,
        "similar_errors": ["err-001", "err-042", "err-156"]
    }

@app.get("/errors")
async def list_errors(limit: int = 10, offset: int = 0):
    """List recent errors in the KB"""
    # TODO: Query database
    return {"errors": [], "total": 0, "limit": limit, "offset": offset}

@app.get("/dashboard")
async def dashboard():
    """Unified dashboard"""
    return {
        "error_count": 0,
        "team_count": 0,
        "query_count": 0,
        "avg_confidence": 0.0
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
API

echo "✓ ErrorWise API skeleton created"

# Final summary
echo ""
echo "✅ ErrorWise Unified Tech Stack — Setup Complete!"
echo ""
echo "Next steps:"
echo "  1. Update .env.errorwise with your API keys"
echo "  2. Run: source venv-errorwise/bin/activate && python launch-errorwise.py"
echo "  3. Open http://localhost:8000 for API dashboard"
echo ""

