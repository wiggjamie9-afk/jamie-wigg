# Requirements: Open-LLM-VTuber v2 (Personal Fork)

## Problem

The v1 codebase has grown organically into a tightly coupled monolith — swapping an ASR or TTS backend requires touching unrelated code, the desktop/web client is hard to extend, and there is no clean integration point for a personal AI toolchain (e.g. RHYTHMIX persona, ElevenLabs TTS, custom Live2D models). A complete rewrite with explicit module boundaries is needed.

## Goal

A cross-platform, offline-capable AI companion that runs as a personal desktop pet or browser tab, built as a Python FastAPI backend + TypeScript/React frontend, where every AI backend (LLM, ASR, TTS) is a swappable plugin and the whole system can be personalized to a custom character and voice.

---

## Functional requirements

### Core pipeline

- **R1**: The system must support a full voice conversation loop: microphone → ASR → LLM → TTS → speaker, with all steps running in under 3 seconds end-to-end on a mid-range machine.
- **R2**: The system must support voice interruption — the user can speak while the AI is talking and the AI will stop and respond to the new input, without the AI hearing its own synthesised output.
- **R3**: The system must allow proactive AI speech — the AI can initiate conversation unprompted after a configurable idle timeout.
- **R4**: Chat history must be persisted to a local SQLite database and the user must be able to resume any previous conversation session.

### Speech recognition (ASR)

- **R5**: The ASR subsystem must expose a single `Transcriber` interface that any implementation can satisfy; built-in implementations must include sherpa-onnx (offline) and Faster-Whisper (offline).
- **R6**: The system must run fully offline using only the sherpa-onnx ASR backend (no network calls required for speech recognition).

### Language model (LLM)

- **R7**: The LLM subsystem must expose a single `Agent` interface; built-in implementations must include Ollama (offline) and any OpenAI-compatible HTTP API (e.g. LM Studio, vLLM, cloud providers).
- **R8**: The system must support a configurable persona prompt that shapes the AI character's personality, name, and speaking style.
- **R9**: The `Agent` interface must support an optional inner-thought channel — text the LLM emits that is shown in the UI but not spoken aloud.

### Text-to-speech (TTS)

- **R10**: The TTS subsystem must expose a single `Synthesiser` interface; built-in implementations must include sherpa-onnx (offline), MeloTTS (offline), and ElevenLabs (cloud, matching the existing creative stack).
- **R11**: The system must support TTS-translation — the LLM can respond in one language while the TTS synthesises in a different language.
- **R12**: The system must support voice cloning by accepting a reference audio file as input to a compatible TTS backend (e.g. GPTSoVITS, ElevenLabs).

### Live2D avatar

- **R13**: The web client must render a Live2D Cubism 4 model via the `pixi-live2d-display` library.
- **R14**: The system must support expression/motion mapping — the LLM backend can emit emotion tags (e.g. `[happy]`, `[surprised]`) that trigger corresponding Live2D expressions.
- **R15**: The user must be able to load a custom `.model3.json` Live2D model by dropping it into a configured assets directory.
- **R16**: The avatar must respond to touch/click events (mouse drag to move, click zones for reactions).

### Visual perception

- **R17**: The system must support optional camera capture — at a configurable interval the camera frame is base64-encoded and injected into the LLM context as a vision input.
- **R18**: The system must support optional screen capture — a screenshot of the primary display can be injected into LLM context on demand or on a timer.

### Desktop client

- **R19**: The desktop client must support a "pet mode": transparent background, always-on-top window, mouse-click-through on non-avatar areas, and free drag positioning.
- **R20**: The desktop client must be distributable as a self-contained binary for macOS, Windows, and Linux without requiring the user to install Python or Node separately.

### Character customisation

- **R21**: All character configuration (persona prompt, voice profile, Live2D model path, expression map, TTS backend choice) must be expressible in a single `character.yaml` file.
- **R22**: The system must ship with at least one default character configuration so it works out-of-the-box without any `character.yaml`.

### Plugin / Agent interface

- **R23**: Third-party Agent integrations (e.g. HumeAI EVI, Mem0, OpenAI "Her" mode) must be implementable by subclassing `BaseAgent` and registering the class — no core code changes needed.
- **R24**: The plugin discovery mechanism must load any Python module found in a `plugins/` directory at startup without requiring edits to the main codebase.

---

## Non-functional requirements

- **N1**: All offline paths (sherpa-onnx ASR + Ollama LLM + sherpa-onnx TTS) must work with zero network access after initial model download.
- **N2**: The Python backend must be managed with `uv` and expose a single `uv run server` entry point.
- **N3**: Module boundaries must be enforced — core pipeline code must not import from any specific ASR/LLM/TTS implementation directly (only via the interface).
- **N4**: The TypeScript frontend must pass `tsc --noEmit` and ESLint with no errors.
- **N5**: End-to-end latency (microphone audio end → first TTS audio chunk playing) must be ≤ 2 s on Apple M-series or equivalent.

---

## Out of scope

- Long-term memory / vector DB (planned for a later spec; v1's memory feature was removed).
- Multi-user / streamer broadcasting features.
- Mobile client (iOS/Android).
- Distributing or hosting AI models — users supply their own.
- Any Remotion or HyperFrames video pipeline integration.

---

## Open questions

- Should the desktop shell be Electron (familiar, larger bundle) or Tauri (Rust, smaller bundle, tighter macOS GPU access)? Lean toward Tauri but needs evaluation.
- GPTSoVITS requires a separate Python inference server — confirm whether it ships as a sidecar process or requires the user to run it externally.
