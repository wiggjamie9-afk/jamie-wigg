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
