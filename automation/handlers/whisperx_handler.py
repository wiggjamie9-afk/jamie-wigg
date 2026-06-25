#!/usr/bin/env python3
"""
WhisperX Integration Handler
Fast, word-accurate speech-to-text for the orchestrator.

WhisperX adds three things over vanilla Whisper that the empire actually uses:
  1. Batched inference (~70x realtime on large-v2) — cheap bulk transcription.
  2. Word-level timestamps via wav2vec2 forced alignment — drives caption
     animation and narration-to-visual sync in the HyperFrames pipeline.
  3. Speaker diarization (pyannote) — turns podcasts / interviews into
     attributable transcripts ready for content repurposing.

Degrades gracefully: every entry point reports a clean error dict when
`whisperx` (and friends) aren't installed, mirroring voice_interface.py.
"""

import os
import json
import logging
import asyncio
from dataclasses import dataclass, field, asdict
from datetime import datetime
from typing import Dict, List, Optional, Any

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@dataclass
class WordTiming:
    """A single word with its start/end time and (optional) speaker."""
    word: str
    start: float
    end: float
    score: float = 0.0
    speaker: Optional[str] = None


@dataclass
class TranscriptSegment:
    """A contiguous chunk of speech (sentence-ish), optionally diarized."""
    text: str
    start: float
    end: float
    speaker: Optional[str] = None
    words: List[WordTiming] = field(default_factory=list)


@dataclass
class TranscriptionResult:
    """Full result of a transcription run."""
    audio_path: str
    language: str
    segments: List[TranscriptSegment]
    duration: float = 0.0
    model: str = ""
    diarized: bool = False
    aligned: bool = False
    created_at: str = ""

    def __post_init__(self):
        if not self.created_at:
            self.created_at = datetime.now().isoformat()

    @property
    def full_text(self) -> str:
        return " ".join(s.text.strip() for s in self.segments).strip()

    @property
    def speakers(self) -> List[str]:
        return sorted({s.speaker for s in self.segments if s.speaker})

    def word_count(self) -> int:
        return sum(len(s.words) or len(s.text.split()) for s in self.segments)

    def to_dict(self) -> Dict:
        d = asdict(self)
        d["full_text"] = self.full_text
        d["speakers"] = self.speakers
        d["word_count"] = self.word_count()
        return d


# --------------------------------------------------------------------------- #
# Subtitle / timing formatters
# --------------------------------------------------------------------------- #

def _fmt_timestamp(seconds: float, sep: str = ",") -> str:
    """Format seconds as HH:MM:SS,mmm (SRT) or HH:MM:SS.mmm (VTT)."""
    if seconds < 0:
        seconds = 0.0
    ms = int(round(seconds * 1000.0))
    h, ms = divmod(ms, 3_600_000)
    m, ms = divmod(ms, 60_000)
    s, ms = divmod(ms, 1000)
    return f"{h:02d}:{m:02d}:{s:02d}{sep}{ms:03d}"


def to_srt(result: TranscriptionResult) -> str:
    """Render segments as an SRT subtitle file."""
    lines = []
    for i, seg in enumerate(result.segments, start=1):
        speaker = f"[{seg.speaker}] " if seg.speaker else ""
        lines.append(str(i))
        lines.append(f"{_fmt_timestamp(seg.start)} --> {_fmt_timestamp(seg.end)}")
        lines.append(f"{speaker}{seg.text.strip()}")
        lines.append("")
    return "\n".join(lines)


def to_vtt(result: TranscriptionResult) -> str:
    """Render segments as a WebVTT subtitle file."""
    lines = ["WEBVTT", ""]
    for seg in result.segments:
        speaker = f"<v {seg.speaker}>" if seg.speaker else ""
        lines.append(f"{_fmt_timestamp(seg.start, '.')} --> {_fmt_timestamp(seg.end, '.')}")
        lines.append(f"{speaker}{seg.text.strip()}")
        lines.append("")
    return "\n".join(lines)


def to_word_timings(result: TranscriptionResult) -> List[Dict]:
    """Flat list of word timings — the format HyperFrames caption animation wants."""
    words = []
    for seg in result.segments:
        if seg.words:
            for w in seg.words:
                words.append({
                    "word": w.word,
                    "start": round(w.start, 3),
                    "end": round(w.end, 3),
                    "speaker": w.speaker or seg.speaker,
                })
        else:
            # No alignment data — emit one entry per segment.
            words.append({
                "word": seg.text.strip(),
                "start": round(seg.start, 3),
                "end": round(seg.end, 3),
                "speaker": seg.speaker,
            })
    return words


# --------------------------------------------------------------------------- #
# WhisperX client
# --------------------------------------------------------------------------- #

class WhisperXClient:
    """Thin async wrapper around the whisperx library."""

    def __init__(self, model: str = "large-v2", device: str = "auto",
                 compute_type: str = "auto", batch_size: int = 16,
                 hf_token: Optional[str] = None):
        self.model_name = model
        self.batch_size = batch_size
        self.hf_token = hf_token or os.environ.get("HF_TOKEN") or os.environ.get("HUGGINGFACE_TOKEN")
        self.device, self.compute_type = self._resolve_device(device, compute_type)
        self._model = None  # lazy-loaded

    @staticmethod
    def _resolve_device(device: str, compute_type: str):
        """Pick CUDA/float16 when a GPU is present, else CPU/int8."""
        if device != "auto" and compute_type != "auto":
            return device, compute_type
        try:
            import torch
            has_cuda = torch.cuda.is_available()
        except ImportError:
            has_cuda = False
        resolved_device = device if device != "auto" else ("cuda" if has_cuda else "cpu")
        if compute_type != "auto":
            resolved_compute = compute_type
        else:
            resolved_compute = "float16" if resolved_device == "cuda" else "int8"
        return resolved_device, resolved_compute

    def _run(self, fn, *args, **kwargs):
        """Run blocking whisperx calls off the event loop."""
        return asyncio.get_event_loop().run_in_executor(None, lambda: fn(*args, **kwargs))

    async def transcribe(self, audio_path: str, language: Optional[str] = None,
                         align: bool = True, diarize: bool = False,
                         min_speakers: Optional[int] = None,
                         max_speakers: Optional[int] = None) -> TranscriptionResult:
        """Transcribe -> (optionally) align to words -> (optionally) diarize."""
        try:
            import whisperx
        except ImportError:
            logger.error("whisperx not installed. Install with: pip install whisperx")
            raise

        logger.info(f"[whisperx] loading {self.model_name} on {self.device}/{self.compute_type}")
        audio = await self._run(whisperx.load_audio, audio_path)
        duration = len(audio) / 16000.0  # whisperx loads at 16kHz

        if self._model is None:
            self._model = await self._run(
                whisperx.load_model, self.model_name, self.device,
                compute_type=self.compute_type,
            )

        logger.info(f"[whisperx] transcribing {audio_path} ({duration:.1f}s, batch={self.batch_size})")
        raw = await self._run(self._model.transcribe, audio,
                              batch_size=self.batch_size,
                              language=language)
        detected_lang = raw.get("language", language or "en")
        segments_raw = raw.get("segments", [])

        aligned = False
        if align and segments_raw:
            try:
                logger.info(f"[whisperx] aligning words (lang={detected_lang})")
                model_a, metadata = await self._run(
                    whisperx.load_align_model,
                    language_code=detected_lang, device=self.device,
                )
                aligned_result = await self._run(
                    whisperx.align, segments_raw, model_a, metadata,
                    audio, self.device, return_char_alignments=False,
                )
                segments_raw = aligned_result.get("segments", segments_raw)
                aligned = True
            except Exception as e:  # alignment is best-effort
                logger.warning(f"[whisperx] alignment skipped: {e}")

        diarized = False
        if diarize:
            try:
                logger.info("[whisperx] diarizing speakers")
                from whisperx.diarize import DiarizationPipeline
                if not self.hf_token:
                    logger.warning("[whisperx] no HF token set; diarization requires one. Skipping.")
                else:
                    diarizer = await self._run(
                        DiarizationPipeline, token=self.hf_token, device=self.device,
                    )
                    diar_segments = await self._run(
                        diarizer, audio,
                        min_speakers=min_speakers, max_speakers=max_speakers,
                    )
                    assigned = await self._run(
                        whisperx.assign_word_speakers, diar_segments,
                        {"segments": segments_raw},
                    )
                    segments_raw = assigned.get("segments", segments_raw)
                    diarized = True
            except Exception as e:  # diarization is best-effort
                logger.warning(f"[whisperx] diarization skipped: {e}")

        segments = [self._to_segment(s) for s in segments_raw]
        return TranscriptionResult(
            audio_path=audio_path,
            language=detected_lang,
            segments=segments,
            duration=duration,
            model=self.model_name,
            diarized=diarized,
            aligned=aligned,
        )

    @staticmethod
    def _to_segment(s: Dict) -> TranscriptSegment:
        words = []
        for w in s.get("words", []) or []:
            # Aligned words carry start/end; unaligned ones may not.
            if "start" not in w or "end" not in w:
                continue
            words.append(WordTiming(
                word=w.get("word", "").strip(),
                start=float(w.get("start", 0.0)),
                end=float(w.get("end", 0.0)),
                score=float(w.get("score", 0.0)),
                speaker=w.get("speaker"),
            ))
        return TranscriptSegment(
            text=s.get("text", ""),
            start=float(s.get("start", 0.0)),
            end=float(s.get("end", 0.0)),
            speaker=s.get("speaker"),
            words=words,
        )


# --------------------------------------------------------------------------- #
# Orchestration handler
# --------------------------------------------------------------------------- #

class WhisperXOrchestrationHandler:
    """Handle transcription / captioning / diarization tasks in the orchestrator."""

    def __init__(self, model: str = "large-v2", output_dir: Optional[str] = None,
                 hf_token: Optional[str] = None):
        self.client = WhisperXClient(model=model, hf_token=hf_token)
        self.output_dir = output_dir or os.path.expanduser("~/RHYTHMIX_Empire/output/transcripts")
        os.makedirs(self.output_dir, exist_ok=True)

    def _out(self, audio_path: str, ext: str) -> str:
        base = os.path.splitext(os.path.basename(audio_path))[0]
        return os.path.join(self.output_dir, f"{base}.{ext}")

    async def handle_transcribe(self, audio_path: str, language: Optional[str] = None,
                                formats: Optional[List[str]] = None) -> Dict:
        """Transcribe an audio file and write the requested output formats."""
        formats = formats or ["json", "srt", "txt"]
        try:
            result = await self.client.transcribe(audio_path, language=language, align=True)
        except ImportError:
            return {"status": "failed", "error": "whisperx_not_available"}
        except Exception as e:
            logger.error(f"Transcription failed: {e}")
            return {"status": "failed", "error": str(e)}

        outputs = self._write_formats(result, formats)
        return {
            "status": "completed",
            "language": result.language,
            "duration": round(result.duration, 1),
            "word_count": result.word_count(),
            "aligned": result.aligned,
            "outputs": outputs,
        }

    async def handle_subtitle_generation(self, audio_path: str,
                                         language: Optional[str] = None) -> Dict:
        """Generate word-timed captions for the HyperFrames video pipeline.

        Returns SRT + VTT subtitle files plus a flat word-timing JSON that
        caption-animation compositions can read directly.
        """
        try:
            result = await self.client.transcribe(audio_path, language=language, align=True)
        except ImportError:
            return {"status": "failed", "error": "whisperx_not_available"}
        except Exception as e:
            logger.error(f"Subtitle generation failed: {e}")
            return {"status": "failed", "error": str(e)}

        outputs = self._write_formats(result, ["srt", "vtt"])
        timings_path = self._out(audio_path, "words.json")
        with open(timings_path, "w") as f:
            json.dump(to_word_timings(result), f, indent=2)
        outputs["words"] = timings_path

        return {
            "status": "completed",
            "aligned": result.aligned,
            "word_count": result.word_count(),
            "outputs": outputs,
        }

    async def handle_diarized_transcription(self, audio_path: str,
                                            min_speakers: Optional[int] = None,
                                            max_speakers: Optional[int] = None,
                                            language: Optional[str] = None) -> Dict:
        """Transcribe with speaker labels — for podcasts / interviews."""
        try:
            result = await self.client.transcribe(
                audio_path, language=language, align=True, diarize=True,
                min_speakers=min_speakers, max_speakers=max_speakers,
            )
        except ImportError:
            return {"status": "failed", "error": "whisperx_not_available"}
        except Exception as e:
            logger.error(f"Diarized transcription failed: {e}")
            return {"status": "failed", "error": str(e)}

        outputs = self._write_formats(result, ["json", "srt", "txt"])
        return {
            "status": "completed",
            "diarized": result.diarized,
            "speakers": result.speakers,
            "speaker_count": len(result.speakers),
            "outputs": outputs,
        }

    async def handle_content_extraction(self, audio_path: str,
                                        language: Optional[str] = None) -> Dict:
        """Transcribe, then ask Claude to mine the transcript for repurposable content.

        Powers the Content Automation SaaS: drop in a long recording, get back
        clip-worthy quotes, hooks, and a draft caption set for short-form.
        """
        try:
            result = await self.client.transcribe(audio_path, language=language, align=True)
        except ImportError:
            return {"status": "failed", "error": "whisperx_not_available"}
        except Exception as e:
            return {"status": "failed", "error": str(e)}

        transcript = result.full_text
        if not transcript:
            return {"status": "failed", "error": "empty_transcript"}

        try:
            import anthropic
            client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))
            prompt = f"""You are RHYTHMIX's content strategist. From this transcript, extract repurposable short-form content.

Transcript:
\"\"\"{transcript[:12000]}\"\"\"

Return JSON:
{{
  "hooks": ["3-5 scroll-stopping opening lines drawn from the content"],
  "clips": [{{"quote": "...", "why": "why it works as a standalone clip"}}],
  "captions": ["2-3 ready-to-post short captions"],
  "hashtags": ["relevant tags"]
}}"""
            response = await asyncio.get_event_loop().run_in_executor(
                None,
                lambda: client.messages.create(
                    model="claude-opus-4-8",
                    max_tokens=2048,
                    messages=[{"role": "user", "content": prompt}],
                ),
            )
            ideas = json.loads(response.content[0].text)
        except Exception as e:
            logger.warning(f"Content extraction (Claude step) failed: {e}")
            ideas = {"error": str(e)}

        transcript_path = self._out(audio_path, "txt")
        with open(transcript_path, "w") as f:
            f.write(transcript)

        return {
            "status": "completed",
            "transcript": transcript_path,
            "ideas": ideas,
        }

    async def handle_task(self, payload: Dict) -> Dict:
        """Orchestrator entry point. Dispatch on payload['action']."""
        action = payload.get("action", "transcribe")
        audio_path = payload.get("audio_path") or payload.get("audio")
        if not audio_path:
            return {"status": "failed", "error": "no_audio_path"}

        if action == "transcribe":
            return await self.handle_transcribe(
                audio_path, language=payload.get("language"),
                formats=payload.get("formats"),
            )
        if action in ("subtitle", "subtitles", "captions"):
            return await self.handle_subtitle_generation(
                audio_path, language=payload.get("language"),
            )
        if action in ("diarize", "diarized"):
            return await self.handle_diarized_transcription(
                audio_path,
                min_speakers=payload.get("min_speakers"),
                max_speakers=payload.get("max_speakers"),
                language=payload.get("language"),
            )
        if action in ("content", "extract", "repurpose"):
            return await self.handle_content_extraction(
                audio_path, language=payload.get("language"),
            )
        return {"status": "failed", "error": f"unknown_action:{action}"}

    def _write_formats(self, result: TranscriptionResult, formats: List[str]) -> Dict[str, str]:
        """Write requested output formats to disk; return {format: path}."""
        writers = {
            "srt": (to_srt, "srt"),
            "vtt": (to_vtt, "vtt"),
            "txt": (lambda r: r.full_text, "txt"),
            "json": (lambda r: json.dumps(r.to_dict(), indent=2), "json"),
        }
        outputs = {}
        for fmt in formats:
            if fmt not in writers:
                logger.warning(f"Unknown output format: {fmt}")
                continue
            render, ext = writers[fmt]
            path = self._out(result.audio_path, ext)
            with open(path, "w") as f:
                f.write(render(result))
            outputs[fmt] = path
        return outputs


# WhisperX task templates (parallels COMFYUI_TEMPLATES)
WHISPERX_TEMPLATES = {
    "transcribe": {
        "description": "Fast batched transcription with word-level timestamps",
        "params": ["audio_path", "language", "formats"],
        "default_model": "large-v2",
    },
    "subtitle": {
        "description": "Word-timed SRT/VTT + caption-animation JSON for HyperFrames",
        "params": ["audio_path", "language"],
        "default_model": "large-v2",
    },
    "diarize": {
        "description": "Speaker-labelled transcription for podcasts / interviews",
        "params": ["audio_path", "min_speakers", "max_speakers", "language"],
        "default_model": "large-v2",
    },
    "content": {
        "description": "Transcribe + Claude content mining for short-form repurposing",
        "params": ["audio_path", "language"],
        "default_model": "large-v2",
    },
}


async def demo():
    """Demo WhisperX handler (no audio file needed — shows formatters)."""
    logger.info("WhisperX Handler Demo")

    # Build a fake result to exercise the formatters without a model.
    result = TranscriptionResult(
        audio_path="demo.wav",
        language="en",
        duration=4.2,
        model="large-v2",
        aligned=True,
        segments=[
            TranscriptSegment(
                text="Welcome to RHYTHMIX.", start=0.0, end=1.6, speaker="SPEAKER_00",
                words=[
                    WordTiming("Welcome", 0.0, 0.5, 0.9, "SPEAKER_00"),
                    WordTiming("to", 0.5, 0.7, 0.9, "SPEAKER_00"),
                    WordTiming("RHYTHMIX.", 0.7, 1.6, 0.9, "SPEAKER_00"),
                ],
            ),
            TranscriptSegment(
                text="Make music videos with AI.", start=1.8, end=4.2, speaker="SPEAKER_01",
                words=[
                    WordTiming("Make", 1.8, 2.1, 0.9, "SPEAKER_01"),
                    WordTiming("music", 2.1, 2.5, 0.9, "SPEAKER_01"),
                    WordTiming("videos", 2.5, 3.0, 0.9, "SPEAKER_01"),
                    WordTiming("with", 3.0, 3.3, 0.9, "SPEAKER_01"),
                    WordTiming("AI.", 3.3, 4.2, 0.9, "SPEAKER_01"),
                ],
            ),
        ],
    )

    logger.info(f"Full text: {result.full_text}")
    logger.info(f"Speakers: {result.speakers}")
    logger.info(f"Word count: {result.word_count()}")
    logger.info("\n--- SRT ---\n" + to_srt(result))
    logger.info("\n--- VTT ---\n" + to_vtt(result))
    logger.info("\n--- Word timings ---\n" + json.dumps(to_word_timings(result), indent=2))
    logger.info("✅ Demo complete")


if __name__ == "__main__":
    asyncio.run(demo())
