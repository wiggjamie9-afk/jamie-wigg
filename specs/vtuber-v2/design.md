# Design: Open-LLM-VTuber v2 (Personal Fork)

## Approach

The backend is a Python FastAPI application that manages an event-driven pipeline: audio input arrives via WebSocket, flows through pluggable ASR → Agent → TTS stages, and audio/expression events are streamed back to the frontend over the same WebSocket connection (R1, R7, R10). The frontend is a TypeScript/React SPA that handles Live2D rendering, audio playback, and desktop-pet chrome (R13, R19). Every AI backend (ASR, LLM, TTS) is a Python ABC; implementations are registered via a lightweight plugin loader so new backends never touch core pipeline code (R23, R24). Character identity lives entirely in `character.yaml`, making persona swaps a config-file change (R21).

---

## Components

### `backend/core/pipeline.py` — Pipeline Orchestrator

- **Responsibility**: Owns the microphone→ASR→Agent→TTS event loop, manages interruption state, and routes expression/thought events to the WebSocket broadcaster.
- **Files**: `backend/core/pipeline.py`, `backend/core/events.py`
- **Interface**:
  ```python
  class Pipeline:
      async def start(self) -> None: ...
      async def handle_audio_chunk(self, pcm: bytes) -> None: ...
      async def interrupt(self) -> None: ...
  ```
- **Satisfies**: R1, R2, R3

---

### `backend/asr/` — Speech Recognition

- **Responsibility**: Transcribes raw PCM audio to text; isolates AI playback from mic input so the AI never hears its own voice (R2).
- **Files**: `backend/asr/base.py`, `backend/asr/sherpa_onnx.py`, `backend/asr/faster_whisper.py`
- **Interface**:
  ```python
  class BaseTranscriber(ABC):
      async def transcribe(self, audio: np.ndarray) -> str: ...
      async def is_speech(self, audio: np.ndarray) -> bool: ...
  ```
- **Satisfies**: R2, R5, R6

---

### `backend/agent/` — LLM Agent

- **Responsibility**: Manages conversation context, emits text tokens (stream), inner-thought tokens, and emotion tags from LLM output.
- **Files**: `backend/agent/base.py`, `backend/agent/ollama.py`, `backend/agent/openai_compat.py`
- **Interface**:
  ```python
  class BaseAgent(ABC):
      async def stream(self, messages: list[Message]) -> AsyncIterator[AgentEvent]: ...
  
  @dataclass
  class AgentEvent:
      type: Literal["token", "thought", "emotion", "done"]
      content: str
  ```
- **Satisfies**: R7, R8, R9, R23, R24

---

### `backend/tts/` — Speech Synthesis

- **Responsibility**: Converts text to PCM audio; supports streaming (sentence-by-sentence) for low latency; handles TTS-translation.
- **Files**: `backend/tts/base.py`, `backend/tts/sherpa_onnx.py`, `backend/tts/melotts.py`, `backend/tts/elevenlabs.py`
- **Interface**:
  ```python
  class BaseSynthesiser(ABC):
      async def synthesise(self, text: str, target_lang: str | None = None) -> AsyncIterator[bytes]: ...
  ```
- **Satisfies**: R10, R11, R12

---

### `backend/vision/` — Visual Perception

- **Responsibility**: Captures camera frames or screenshots at a configured interval and returns base64-encoded image data for injection into LLM context.
- **Files**: `backend/vision/camera.py`, `backend/vision/screen.py`
- **Interface**:
  ```python
  async def capture_frame(source: Literal["camera", "screen"]) -> str:  # base64 PNG
  ```
- **Satisfies**: R17, R18

---

### `backend/persistence/` — Chat Storage

- **Responsibility**: Persists all conversation sessions to SQLite; exposes list/load/save session API.
- **Files**: `backend/persistence/db.py`, `backend/persistence/models.py`
- **Interface**: SQLite via `aiosqlite`; tables: `sessions(id, created_at, character_id)`, `messages(id, session_id, role, content, timestamp)`
- **Satisfies**: R4

---

### `backend/character/` — Character Loader

- **Responsibility**: Parses `character.yaml`, resolves Live2D model path, expression map, and instantiates the configured ASR/Agent/TTS from the plugin registry.
- **Files**: `backend/character/loader.py`, `backend/character/schema.py`
- **Data**:
  ```yaml
  # character.yaml
  name: "Aria"
  persona: "You are Aria, a cheerful AI companion..."
  live2d_model: "assets/live2d/aria/aria.model3.json"
  expressions:
    happy: ["happy", "smile"]
    surprised: ["surprised"]
  asr: {backend: sherpa_onnx, model: assets/models/asr/...}
  llm: {backend: ollama, model: llama3}
  tts: {backend: elevenlabs, voice_id: "abc123"}
  ```
- **Satisfies**: R8, R15, R21, R22

---

### `backend/plugins/` — Plugin Loader

- **Responsibility**: On startup, imports every `.py` file in `plugins/`; any class that subclasses `BaseAgent`, `BaseTranscriber`, or `BaseSynthesiser` is auto-registered.
- **Files**: `backend/plugins/loader.py`
- **Satisfies**: R23, R24

---

### `backend/server.py` — FastAPI + WebSocket Gateway

- **Responsibility**: Exposes `/ws` WebSocket (audio in/out + events), `/api/sessions` REST endpoints, and serves the static React build.
- **Files**: `backend/server.py`, `backend/api/sessions.py`
- **Satisfies**: R1, R4

---

### `frontend/` — React TypeScript Client

- **Responsibility**: Renders the Live2D avatar via `pixi-live2d-display`, plays TTS audio chunks, handles touch/click events on the avatar, displays inner-thought overlay, and provides session/settings UI.
- **Files**: `frontend/src/`, `frontend/src/components/Avatar.tsx`, `frontend/src/components/ChatLog.tsx`, `frontend/src/hooks/useWebSocket.ts`
- **Interface**: WebSocket messages (JSON envelope):
  ```ts
  type ServerEvent =
    | { type: "audio_chunk"; data: string }      // base64 PCM
    | { type: "expression"; name: string }
    | { type: "thought"; text: string }
    | { type: "transcript"; text: string }
  ```
- **Satisfies**: R13, R14, R16, R9

---

### `desktop/` — Desktop Shell

- **Responsibility**: Wraps the React frontend in a Tauri window; provides transparent/always-on-top/click-through pet mode; bundles Python backend as a sidecar binary via PyInstaller.
- **Files**: `desktop/src-tauri/`, `desktop/src-tauri/src/main.rs`
- **Satisfies**: R19, R20

---

## Data

- **SQLite** (`data/history.db`): sessions + messages tables; created automatically on first run.
- **`character.yaml`** at repo root (or path set via `--character` CLI flag): single source of truth for personality + backend config.
- **`assets/live2d/<model-name>/`**: Live2D model files (not committed; user supplies).
- **`assets/models/`**: ASR and TTS model weights (not committed; downloaded on first run via `uv run setup`).
- No server-side audio storage — PCM never written to disk beyond ephemeral pipeline buffers.

---

## Risks

- **Tauri + Python sidecar packaging complexity**: Tauri can bundle a PyInstaller binary as a sidecar, but this is non-trivial for platform-specific GPU drivers. *Mitigation*: ship a `python -m uvicorn backend.server:app` fallback mode; desktop shell is optional for early milestones.
- **Live2D Cubism SDK license**: The official Cubism Web SDK requires agreement with the Live2D Free Material License for non-commercial use. *Mitigation*: use `pixi-live2d-display` (open-source wrapper) and keep model assets out of the repo; document license requirements clearly.
- **Echo cancellation on Linux**: platform audio APIs vary. *Mitigation*: use the existing v1 approach (measure AI output duration, mute mic during playback); document that a headset eliminates the problem.
