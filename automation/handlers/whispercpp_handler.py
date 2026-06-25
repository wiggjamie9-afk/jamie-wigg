#!/usr/bin/env python3
"""
whisper.cpp Integration Handler
On-device, zero-cost speech-to-text for the orchestrator.

Where the WhisperX handler is the heavy server-side path (GPU batched
transcription + word alignment + diarization), whisper.cpp is the *local*
path: a dependency-free C/C++ Whisper that runs fully offline on the user's
Mac (Metal / Core ML / ANE), iPhone, or any CPU — at zero API cost. It owns:

  1. The voice-command input layer (real-time `whisper-stream`).
  2. Cheap bulk/offline transcription with VAD (Silero) to skip silence.
  3. Word-level timestamps (`-ml 1`) and SRT/VTT/JSON output for HyperFrames.

This handler shells out to the whisper.cpp `whisper-cli` binary rather than
importing a Python lib, so it has no pip dependencies of its own. Every entry
point degrades gracefully: if the binary or model isn't found it returns a
clean error dict with the exact build/download command to fix it.
"""

import os
import re
import json
import shutil
import logging
import asyncio
from dataclasses import dataclass, field
from datetime import datetime
from typing import Dict, List, Optional, Any

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Default search locations for a whisper.cpp checkout / install.
_DEFAULT_REPO_PATHS = [
    "~/whisper.cpp",
    "~/RHYTHMIX_Empire/whisper.cpp",
    "/opt/whisper.cpp",
]
# Candidate binary names (build layout changed across versions).
_BIN_NAMES = ["whisper-cli", "main"]
# Candidate build subdirs to probe for the binary.
_BIN_SUBDIRS = ["build/bin", "build", "."]

# Models that download-ggml-model.sh knows about.
KNOWN_MODELS = [
    "tiny", "tiny.en", "base", "base.en", "small", "small.en",
    "medium", "medium.en", "large-v1", "large-v2", "large-v3",
    "large-v3-turbo",
]


@dataclass
class CppSegment:
    """A timestamped transcription segment from whisper.cpp JSON output."""
    text: str
    start: float
    end: float
    speaker_turn: bool = False


@dataclass
class CppTranscription:
    """Parsed result of a whisper-cli run."""
    audio_path: str
    model: str
    language: str
    segments: List[CppSegment] = field(default_factory=list)
    raw_json_path: Optional[str] = None
    created_at: str = ""

    def __post_init__(self):
        if not self.created_at:
            self.created_at = datetime.now().isoformat()

    @property
    def full_text(self) -> str:
        return " ".join(s.text.strip() for s in self.segments).strip()


def _expand(path: str) -> str:
    return os.path.abspath(os.path.expanduser(path))


class WhisperCppClient:
    """Locate and drive a whisper.cpp installation."""

    def __init__(self, repo_path: Optional[str] = None, model: str = "base.en",
                 binary: Optional[str] = None, threads: Optional[int] = None,
                 use_coreml: bool = True):
        self.model = model
        self.threads = threads or max(1, (os.cpu_count() or 4))
        self.use_coreml = use_coreml
        self.repo_path = _expand(repo_path) if repo_path else self._discover_repo()
        self.binary = _expand(binary) if binary else self._discover_binary()

    # -- discovery ---------------------------------------------------------- #

    @staticmethod
    def _discover_repo() -> Optional[str]:
        env = os.environ.get("WHISPER_CPP_PATH")
        candidates = ([env] if env else []) + _DEFAULT_REPO_PATHS
        for c in candidates:
            if c and os.path.isdir(_expand(c)):
                return _expand(c)
        return None

    def _discover_binary(self) -> Optional[str]:
        # 1) explicit env var
        env_bin = os.environ.get("WHISPER_CPP_BIN")
        if env_bin and os.path.isfile(_expand(env_bin)):
            return _expand(env_bin)
        # 2) inside a discovered repo
        if self.repo_path:
            for sub in _BIN_SUBDIRS:
                for name in _BIN_NAMES:
                    cand = os.path.join(self.repo_path, sub, name)
                    if os.path.isfile(cand) and os.access(cand, os.X_OK):
                        return cand
        # 3) on PATH
        for name in _BIN_NAMES:
            found = shutil.which(name)
            if found:
                return found
        return None

    def _model_path(self) -> Optional[str]:
        """Resolve the ggml model file for self.model."""
        # Allow passing an explicit path as the model.
        if os.path.isfile(_expand(self.model)):
            return _expand(self.model)
        filename = f"ggml-{self.model}.bin"
        search = []
        if self.repo_path:
            search.append(os.path.join(self.repo_path, "models", filename))
        env_models = os.environ.get("WHISPER_CPP_MODELS")
        if env_models:
            search.append(os.path.join(_expand(env_models), filename))
        for p in search:
            if os.path.isfile(p):
                return p
        return None

    def is_available(self) -> bool:
        return bool(self.binary) and bool(self._model_path())

    def status(self) -> Dict:
        model_path = self._model_path()
        return {
            "binary": self.binary,
            "repo_path": self.repo_path,
            "model": self.model,
            "model_path": model_path,
            "available": bool(self.binary) and bool(model_path),
            "threads": self.threads,
            "coreml": self.use_coreml,
        }

    def _fix_hint(self) -> Dict:
        """Build a helpful error payload when something's missing."""
        if not self.repo_path and not self.binary:
            return {
                "error": "whispercpp_not_found",
                "hint": "Clone & build: git clone https://github.com/ggml-org/whisper.cpp "
                        "&& cd whisper.cpp && cmake -B build && cmake --build build -j --config Release",
            }
        if not self.binary:
            return {
                "error": "whispercpp_binary_not_built",
                "hint": f"Build it: cd {self.repo_path} && cmake -B build && "
                        f"cmake --build build -j --config Release",
            }
        if not self._model_path():
            return {
                "error": "whispercpp_model_missing",
                "hint": f"Download it: {self.repo_path or '.'}/models/download-ggml-model.sh {self.model}",
            }
        return {"error": "whispercpp_unavailable"}

    # -- core ops ----------------------------------------------------------- #

    async def _run_cli(self, args: List[str], timeout: int = 1800) -> Dict:
        """Run whisper-cli with the given args; capture stdout/stderr."""
        cmd = [self.binary] + args
        logger.info(f"[whisper.cpp] $ {' '.join(cmd)}")
        proc = await asyncio.create_subprocess_exec(
            *cmd,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
        )
        try:
            stdout, stderr = await asyncio.wait_for(proc.communicate(), timeout=timeout)
        except asyncio.TimeoutError:
            proc.kill()
            return {"returncode": -1, "stdout": "", "stderr": "timeout"}
        return {
            "returncode": proc.returncode,
            "stdout": stdout.decode("utf-8", "replace"),
            "stderr": stderr.decode("utf-8", "replace"),
        }

    async def transcribe(self, audio_path: str, language: Optional[str] = None,
                         output_dir: str = ".", word_timestamps: bool = False,
                         vad: bool = False, vad_model: Optional[str] = None,
                         translate: bool = False) -> CppTranscription:
        """Transcribe a 16kHz WAV file. Emits JSON + SRT next to output base.

        Note: whisper-cli wants 16-bit 16kHz mono WAV. Use ensure_wav() first
        for arbitrary inputs.
        """
        if not self.is_available():
            raise FileNotFoundError(json.dumps(self._fix_hint()))

        model_path = self._model_path()
        base = os.path.join(_expand(output_dir),
                            os.path.splitext(os.path.basename(audio_path))[0])
        os.makedirs(_expand(output_dir), exist_ok=True)

        args = [
            "-m", model_path,
            "-f", _expand(audio_path),
            "-t", str(self.threads),
            "-oj",            # output JSON (<base>.json)
            "-osrt",          # output SRT  (<base>.srt)
            "-of", base,      # output file base (no extension)
        ]
        if language:
            args += ["-l", language]
        if translate:
            args += ["-tr"]
        if word_timestamps:
            args += ["-ml", "1"]   # max 1 token/segment ≈ word-level timing
        if vad:
            args += ["--vad"]
            if vad_model:
                args += ["-vm", _expand(vad_model)]

        result = await self._run_cli(args)
        if result["returncode"] != 0:
            raise RuntimeError(f"whisper-cli failed: {result['stderr'][-500:]}")

        json_path = f"{base}.json"
        return self._parse_json(audio_path, json_path, language or "auto")

    def _parse_json(self, audio_path: str, json_path: str, language: str) -> CppTranscription:
        """Parse whisper.cpp -oj output into a CppTranscription."""
        segments: List[CppSegment] = []
        detected = language
        if os.path.isfile(json_path):
            try:
                with open(json_path) as f:
                    data = json.load(f)
                detected = (data.get("result", {}) or {}).get("language", language)
                for seg in data.get("transcription", []) or []:
                    offsets = seg.get("offsets", {})
                    start = float(offsets.get("from", 0)) / 1000.0
                    end = float(offsets.get("to", 0)) / 1000.0
                    text = seg.get("text", "")
                    segments.append(CppSegment(
                        text=text,
                        start=start,
                        end=end,
                        speaker_turn="[SPEAKER_TURN]" in text,
                    ))
            except (json.JSONDecodeError, KeyError, ValueError) as e:
                logger.warning(f"[whisper.cpp] couldn't parse JSON {json_path}: {e}")
        return CppTranscription(
            audio_path=audio_path,
            model=self.model,
            language=detected,
            segments=segments,
            raw_json_path=json_path if os.path.isfile(json_path) else None,
        )

    async def download_model(self, model: Optional[str] = None) -> Dict:
        """Run download-ggml-model.sh for the given model."""
        model = model or self.model
        if not self.repo_path:
            return self._fix_hint()
        script = os.path.join(self.repo_path, "models", "download-ggml-model.sh")
        if not os.path.isfile(script):
            return {"error": "download_script_missing", "path": script}
        result = await self._run_cli_raw(["sh", script, model])
        return {
            "status": "downloaded" if result["returncode"] == 0 else "failed",
            "model": model,
            "stderr": result["stderr"][-300:],
        }

    async def _run_cli_raw(self, cmd: List[str], timeout: int = 1800) -> Dict:
        proc = await asyncio.create_subprocess_exec(
            *cmd,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
        )
        try:
            stdout, stderr = await asyncio.wait_for(proc.communicate(), timeout=timeout)
        except asyncio.TimeoutError:
            proc.kill()
            return {"returncode": -1, "stdout": "", "stderr": "timeout"}
        return {
            "returncode": proc.returncode,
            "stdout": stdout.decode("utf-8", "replace"),
            "stderr": stderr.decode("utf-8", "replace"),
        }


async def ensure_wav(audio_path: str, output_path: Optional[str] = None) -> str:
    """Convert arbitrary audio to the 16kHz/mono/16-bit WAV whisper.cpp needs.

    Requires ffmpeg on PATH. Returns the path to the converted WAV (or the
    original if it's already a .wav and no conversion was requested).
    """
    if not shutil.which("ffmpeg"):
        raise FileNotFoundError("ffmpeg not found — needed to convert audio for whisper.cpp")
    output_path = output_path or os.path.splitext(audio_path)[0] + ".16k.wav"
    proc = await asyncio.create_subprocess_exec(
        "ffmpeg", "-y", "-i", _expand(audio_path),
        "-ar", "16000", "-ac", "1", "-c:a", "pcm_s16le", _expand(output_path),
        stdout=asyncio.subprocess.DEVNULL,
        stderr=asyncio.subprocess.PIPE,
    )
    _, stderr = await proc.communicate()
    if proc.returncode != 0:
        raise RuntimeError(f"ffmpeg conversion failed: {stderr.decode('utf-8', 'replace')[-300:]}")
    return _expand(output_path)


class WhisperCppOrchestrationHandler:
    """Handle on-device transcription tasks in the orchestrator."""

    def __init__(self, repo_path: Optional[str] = None, model: str = "base.en",
                 output_dir: Optional[str] = None):
        self.client = WhisperCppClient(repo_path=repo_path, model=model)
        self.output_dir = output_dir or os.path.expanduser("~/RHYTHMIX_Empire/output/transcripts")
        os.makedirs(self.output_dir, exist_ok=True)

    async def handle_transcribe(self, audio_path: str, language: Optional[str] = None,
                                word_timestamps: bool = False, vad: bool = True,
                                auto_convert: bool = True) -> Dict:
        """Transcribe locally; auto-convert non-WAV inputs via ffmpeg."""
        status = self.client.status()
        if not status["available"]:
            return {"status": "failed", **self.client._fix_hint()}

        src = audio_path
        try:
            if auto_convert and not audio_path.lower().endswith(".wav"):
                src = await ensure_wav(audio_path)
        except Exception as e:
            return {"status": "failed", "error": f"convert_failed: {e}"}

        try:
            result = await self.client.transcribe(
                src, language=language, output_dir=self.output_dir,
                word_timestamps=word_timestamps, vad=vad,
            )
        except Exception as e:
            return {"status": "failed", "error": str(e)}

        txt_path = os.path.join(
            self.output_dir,
            os.path.splitext(os.path.basename(src))[0] + ".txt",
        )
        with open(txt_path, "w") as f:
            f.write(result.full_text)

        return {
            "status": "completed",
            "engine": "whisper.cpp",
            "model": result.model,
            "language": result.language,
            "segments": len(result.segments),
            "text": result.full_text,
            "outputs": {
                "json": result.raw_json_path,
                "srt": os.path.join(
                    self.output_dir,
                    os.path.splitext(os.path.basename(src))[0] + ".srt",
                ),
                "txt": txt_path,
            },
        }

    async def handle_voice_command(self, audio_path: str) -> Dict:
        """Fast local transcription tuned for short voice commands.

        Uses VAD + word timestamps off (speed first). Returns just the text so
        the caller can hand it to VoiceCommandProcessor.parse_command().
        """
        result = await self.handle_transcribe(
            audio_path, vad=True, word_timestamps=False,
        )
        if result.get("status") != "completed":
            return result
        return {"status": "completed", "transcript": result["text"]}

    async def handle_status(self) -> Dict:
        """Report whether the local whisper.cpp install is usable."""
        return {"status": "ok", **self.client.status()}

    async def handle_task(self, payload: Dict) -> Dict:
        """Orchestrator entry point. Dispatch on payload['action']."""
        action = payload.get("action", "transcribe")
        if action == "status":
            return await self.handle_status()
        audio_path = payload.get("audio_path") or payload.get("audio")
        if not audio_path:
            return {"status": "failed", "error": "no_audio_path"}
        if action in ("voice", "command", "voice_command"):
            return await self.handle_voice_command(audio_path)
        return await self.handle_transcribe(
            audio_path,
            language=payload.get("language"),
            word_timestamps=payload.get("word_timestamps", False),
            vad=payload.get("vad", True),
        )


# whisper.cpp task templates (parallels WHISPERX_TEMPLATES / COMFYUI_TEMPLATES)
WHISPERCPP_TEMPLATES = {
    "transcribe": {
        "description": "On-device offline transcription (zero API cost) with VAD",
        "params": ["audio_path", "language", "word_timestamps", "vad"],
        "default_model": "base.en",
    },
    "voice_command": {
        "description": "Fast local transcription for the voice-command input layer",
        "params": ["audio_path"],
        "default_model": "base.en",
    },
    "status": {
        "description": "Check local whisper.cpp build + model availability",
        "params": [],
        "default_model": "base.en",
    },
}


async def demo():
    """Demo whisper.cpp handler — reports install status without needing audio."""
    logger.info("whisper.cpp Handler Demo")
    handler = WhisperCppOrchestrationHandler()
    status = await handler.handle_status()
    logger.info(f"Install status: {json.dumps(status, indent=2)}")
    if not status.get("available"):
        logger.info("whisper.cpp not installed locally — that's expected in the cloud sandbox.")
        logger.info("On the Mac, build it once: "
                    "git clone https://github.com/ggml-org/whisper.cpp && "
                    "cd whisper.cpp && cmake -B build && cmake --build build -j --config Release && "
                    "sh ./models/download-ggml-model.sh base.en")
    logger.info("✅ Demo complete")


if __name__ == "__main__":
    asyncio.run(demo())
