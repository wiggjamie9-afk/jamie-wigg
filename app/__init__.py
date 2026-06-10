"""
RHYTHMIX Video Generation Suite

Full-stack open models pipeline for AI video creation:
- Ollama (LLM scripts) → ComfyUI (images) → AudioCraft (music) → Kokoro (TTS) → FFmpeg (video)

Usage:
    from app.services.complete_pipeline import CompleteVideoPipeline
    
    pipeline = CompleteVideoPipeline()
    result = pipeline.generate_video(topic="Your topic", scene_count=4)
"""

__version__ = "0.1.0"
__author__ = "Jamie Wigg"

from app.services.complete_pipeline import CompleteVideoPipeline
from app.services.ollama_llm import OllamaDirector
from app.services.music_gen import MusicGenService, AudioComposer

__all__ = [
    "CompleteVideoPipeline",
    "OllamaDirector",
    "MusicGenService",
    "AudioComposer",
]
