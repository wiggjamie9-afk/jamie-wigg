"""API endpoint tests for PDF Analyzer"""

import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'pdf-analyzer-api'))

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health():
    """Test health check endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_analyze_missing_file():
    """Test analyze without file"""
    response = client.post("/analyze")
    assert response.status_code == 422  # Validation error

def test_extract_missing_file():
    """Test extract without file"""
    response = client.post("/extract")
    assert response.status_code == 422  # Validation error

def test_chat_missing_file():
    """Test chat without file"""
    response = client.post("/chat")
    assert response.status_code == 422  # Validation error

if __name__ == "__main__":
    test_health()
    test_analyze_missing_file()
    test_extract_missing_file()
    test_chat_missing_file()
    print("✓ All tests passed")
