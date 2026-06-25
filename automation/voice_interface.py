#!/usr/bin/env python3
"""
Voice-to-Action Interface
Converts voice commands into automation tasks via Whisper and Claude interpretation.
"""

import os
import json
import logging
from datetime import datetime
from typing import Dict, Optional, Callable
import asyncio
import numpy as np

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class VoiceCommandProcessor:
    """Process voice input and convert to automation tasks."""

    def __init__(self):
        self.orchestrator = None
        self.transcription_model = "base"
        self.supported_commands = {
            "generate": self._parse_generate_command,
            "create": self._parse_create_command,
            "make": self._parse_create_command,
            "publish": self._parse_publish_command,
            "edit": self._parse_edit_command,
            "schedule": self._parse_schedule_command,
            "analyze": self._parse_analyze_command,
            "check": self._parse_check_command,
            "status": self._parse_status_command,
        }

    def set_orchestrator(self, orchestrator):
        """Link to orchestrator for task submission."""
        self.orchestrator = orchestrator

    async def process_audio_file(self, audio_path: str) -> Dict:
        """Process an audio file into tasks."""
        try:
            import whisper

            logger.info(f"Transcribing audio: {audio_path}")
            model = whisper.load_model(self.transcription_model)
            result = model.transcribe(audio_path)
            transcript = result["text"]

            logger.info(f"Transcript: {transcript}")
            return await self.parse_command(transcript)
        except ImportError:
            logger.error("Whisper not installed. Install with: pip install openai-whisper")
            return {"error": "whisper_not_available"}

    async def process_microphone_input(self, duration_seconds: int = 10) -> Dict:
        """Record from microphone and process."""
        try:
            import sounddevice
            import scipy.io.wavfile as wavfile

            logger.info(f"Recording for {duration_seconds} seconds...")
            sample_rate = 16000
            audio = sounddevice.rec(
                int(duration_seconds * sample_rate),
                samplerate=sample_rate,
                channels=1,
                dtype=np.float32
            )
            sounddevice.wait()

            # Save temporary file
            temp_path = "/tmp/voice_command.wav"
            wavfile.write(temp_path, sample_rate, (audio * 32767).astype(np.int16))

            result = await self.process_audio_file(temp_path)
            os.remove(temp_path)
            return result
        except ImportError:
            logger.error("sounddevice not installed. Install with: pip install sounddevice scipy")
            return {"error": "microphone_not_available"}

    async def parse_command(self, transcript: str) -> Dict:
        """Parse voice transcript into actionable tasks."""
        logger.info(f"Parsing command: {transcript}")

        # Normalize
        transcript_lower = transcript.lower().strip()

        # Identify command type
        for keyword, parser in self.supported_commands.items():
            if keyword in transcript_lower:
                tasks = await parser(transcript)
                return {"status": "parsed", "tasks": tasks}

        # Fallback: use Claude to interpret
        return await self._claude_interpret_command(transcript)

    async def _parse_generate_command(self, transcript: str) -> list:
        """Parse 'generate' commands."""
        # "Generate a 60-second video about..."
        tasks = []

        if "video" in transcript.lower():
            tasks.append({
                "type": "video_generation",
                "description": transcript,
                "extracted_from": "voice_command"
            })
        elif "image" in transcript.lower():
            tasks.append({
                "type": "image_generation",
                "description": transcript,
                "extracted_from": "voice_command"
            })
        elif "music" in transcript.lower() or "song" in transcript.lower():
            tasks.append({
                "type": "audio_generation",
                "description": transcript,
                "extracted_from": "voice_command"
            })
        else:
            tasks.append({
                "type": "text_generation",
                "description": transcript,
                "extracted_from": "voice_command"
            })

        return tasks

    async def _parse_create_command(self, transcript: str) -> list:
        """Parse 'create' / 'make' commands."""
        return await self._parse_generate_command(transcript)

    async def _parse_publish_command(self, transcript: str) -> list:
        """Parse 'publish' commands."""
        tasks = []

        platforms = []
        for platform in ["youtube", "tiktok", "instagram", "twitter", "linkedin", "social"]:
            if platform in transcript.lower():
                platforms.append(platform)

        tasks.append({
            "type": "publish",
            "platforms": platforms or ["all"],
            "description": transcript,
            "extracted_from": "voice_command"
        })

        return tasks

    async def _parse_edit_command(self, transcript: str) -> list:
        """Parse 'edit' commands."""
        tasks = []
        tasks.append({
            "type": "video_editing",
            "description": transcript,
            "extracted_from": "voice_command"
        })
        return tasks

    async def _parse_schedule_command(self, transcript: str) -> list:
        """Parse 'schedule' commands."""
        tasks = []
        tasks.append({
            "type": "workflow_automation",
            "action": "schedule",
            "description": transcript,
            "extracted_from": "voice_command"
        })
        return tasks

    async def _parse_analyze_command(self, transcript: str) -> list:
        """Parse 'analyze' commands."""
        tasks = []
        tasks.append({
            "type": "research",
            "action": "analyze",
            "description": transcript,
            "extracted_from": "voice_command"
        })
        return tasks

    async def _parse_check_command(self, transcript: str) -> list:
        """Parse 'check' commands."""
        tasks = []
        tasks.append({
            "type": "monitor",
            "action": "check",
            "description": transcript,
            "extracted_from": "voice_command"
        })
        return tasks

    async def _parse_status_command(self, transcript: str) -> list:
        """Parse 'status' commands."""
        if self.orchestrator:
            status = self.orchestrator.queue.get_queue_status()
            logger.info(f"Queue status: {status}")
            return []
        return []

    async def _claude_interpret_command(self, transcript: str) -> Dict:
        """Use Claude to interpret complex voice commands."""
        import anthropic

        client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))

        prompt = f"""You are RHYTHMIX's voice command interpreter. Convert this voice transcript into actionable tasks.

Transcript: "{transcript}"

Return JSON:
{{
  "interpreted_intent": "...",
  "tasks": [
    {{"type": "video_generation|image_generation|text_generation|audio_generation|workflow_automation|publish", "payload": {{}}}},
    ...
  ],
  "confidence": 0.0-1.0
}}"""

        response = client.messages.create(
            model="claude-opus-4-8",
            max_tokens=1024,
            messages=[{"role": "user", "content": prompt}]
        )

        try:
            result = json.loads(response.content[0].text)
            if self.orchestrator and result.get("confidence", 0) > 0.7:
                for task_def in result.get("tasks", []):
                    from orchestrator import Task, TaskType, TaskPriority
                    task = Task(
                        id=f"voice-{datetime.now().timestamp()}",
                        type=TaskType(task_def.get("type")),
                        priority=TaskPriority.HIGH,
                        payload=task_def.get("payload", {}),
                        created_at=datetime.now()
                    )
                    self.orchestrator.queue.enqueue(task)
            return result
        except (json.JSONDecodeError, IndexError):
            logger.error("Failed to parse Claude response")
            return {"error": "interpretation_failed"}


class VoiceInterface:
    """High-level voice interface for end users."""

    def __init__(self, orchestrator):
        self.processor = VoiceCommandProcessor()
        self.processor.set_orchestrator(orchestrator)

    async def listen_and_execute(self, duration: int = 10):
        """Listen to voice input and execute resulting tasks."""
        result = await self.processor.process_microphone_input(duration)
        logger.info(f"Voice command result: {result}")
        return result

    async def process_file(self, audio_file: str):
        """Process an audio file."""
        result = await self.processor.process_audio_file(audio_file)
        logger.info(f"Audio file result: {result}")
        return result

    async def interpret_text(self, text: str):
        """Process text as if it were a voice command."""
        result = await self.processor.parse_command(text)
        logger.info(f"Text command result: {result}")
        return result


# Demo usage
async def demo():
    """Demonstrate voice interface."""
    logger.info("RHYTHMIX Voice Interface Demo")
    logger.info("Say: 'Generate a 60-second video about AI music'")
    logger.info("Or: 'Create a TikTok video and publish it'")
    logger.info("Or: 'Make a 3-part content series'")

    processor = VoiceCommandProcessor()

    # Demo with text (simulating voice input)
    commands = [
        "Generate a 60-second video about AI music generation",
        "Create a TikTok video and publish it to social media",
        "Make a 3-part content series about the future of AI",
    ]

    for cmd in commands:
        result = await processor.parse_command(cmd)
        logger.info(f"Command: {cmd}")
        logger.info(f"Result: {json.dumps(result, indent=2)}")
        logger.info("---")


if __name__ == "__main__":
    asyncio.run(demo())
