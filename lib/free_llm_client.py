"""
Free LLM API Client (Pekpik)

Usage:
    from lib.free_llm_client import chat, generate_image, list_models

    # Chat with Claude Opus
    response = chat("Write a script for a 60s promo")

    # Generate image with DALL-E 3
    image_url = generate_image("A vinyl album cover for electronic music")

    # List available models
    models = list_models()
"""

import os
from typing import Optional, Dict, Any, List
from openai import OpenAI

PEKPIK_BASE = os.getenv("PEKPIK_BASE_URL", "https://aiapiv2.pekpik.com/v1")
PEKPIK_KEY = os.getenv("PEKPIK_API_KEY", "sk-placeholder")

MODELS = {
    "CLAUDE_OPUS": "claude-opus-4-7",
    "GPT_5_5": "openai/gpt-5.5",
    "GEMINI": "gemini-2.5-flash",
    "DEEPSEEK": "deepseek-v4-flash",
}

# Initialize client
client = OpenAI(
    base_url=PEKPIK_BASE,
    api_key=PEKPIK_KEY,
)


def chat(
    prompt: str,
    model: str = MODELS["CLAUDE_OPUS"],
    temperature: float = 0.7,
    max_tokens: int = 2000,
) -> str:
    """Chat completion with free LLM."""
    try:
        response = client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": prompt}],
            temperature=temperature,
            max_tokens=max_tokens,
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"[Pekpik] Chat failed ({model}): {e}")
        raise


def generate_image(
    prompt: str,
    size: str = "1024x1024",
    quality: str = "standard",
) -> str:
    """Generate image with DALL-E 3."""
    try:
        response = client.images.generate(
            model="dall-e-3",
            prompt=prompt,
            size=size,
            quality=quality,
            n=1,
        )
        return response.data[0].url
    except Exception as e:
        print(f"[Pekpik] Image generation failed: {e}")
        raise


def text_to_speech(
    text: str,
    voice: str = "alloy",
) -> bytes:
    """Text-to-speech with TTS-1-HD."""
    try:
        response = client.audio.speech.create(
            model="tts-1-hd",
            voice=voice,
            input=text,
        )
        return response.content
    except Exception as e:
        print(f"[Pekpik] TTS failed: {e}")
        raise


def embed(
    texts: List[str] | str,
) -> List[Dict[str, Any]]:
    """Generate embeddings with text-embedding-3-small."""
    input_texts = texts if isinstance(texts, list) else [texts]
    try:
        response = client.embeddings.create(
            model="text-embedding-3-small",
            input=input_texts,
        )
        return response.data
    except Exception as e:
        print(f"[Pekpik] Embeddings failed: {e}")
        raise


def list_models() -> Dict[str, str]:
    """List available models."""
    return MODELS.copy()
