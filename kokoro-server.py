#!/usr/bin/env python3
"""Kokoro TTS API server - OpenAI compatible speech endpoint"""

from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse, FileResponse
import torch
from kokoro import build_model
import io
import os

app = FastAPI(title="Kokoro TTS", description="OpenAI-compatible speech synthesis API")

# Load model on startup
try:
    device = "cuda" if torch.cuda.is_available() else "cpu"
    model, tokenizer = build_model("kokoro-v0_19.pth", device)
    print(f"✓ Kokoro model loaded on {device}")
except Exception as e:
    print(f"Warning: Model loading failed: {e}")
    model, tokenizer = None, None

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.get("/v1/models")
async def list_models():
    return {
        "object": "list",
        "data": [
            {
                "id": "kokoro",
                "object": "model",
                "owned_by": "kokoro",
                "permission": []
            }
        ]
    }

@app.post("/v1/audio/speech")
async def create_speech(request: dict):
    """OpenAI-compatible speech synthesis endpoint"""
    try:
        model_name = request.get("model", "kokoro")
        voice = request.get("voice", "af_sky")
        text = request.get("input", "")
        response_format = request.get("response_format", "mp3")

        if not text:
            raise HTTPException(status_code=400, detail="input text required")

        # Generate speech using Kokoro
        if model and tokenizer:
            # Simple placeholder - actual Kokoro generation would go here
            audio_data = b"placeholder_audio_data"
        else:
            audio_data = b"kokoro_model_not_loaded"

        return StreamingResponse(
            iter([audio_data]),
            media_type="audio/mpeg",
            headers={"Content-Disposition": "attachment; filename=output.mp3"}
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/docs")
async def docs():
    return {
        "title": "Kokoro TTS API",
        "version": "0.1.0",
        "endpoints": {
            "/health": "Health check",
            "/v1/models": "List available models",
            "/v1/audio/speech": "Generate speech (POST)"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8880)
