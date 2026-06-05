# Tasks: Open-LLM-VTuber v2 (Personal Fork)

Tasks have stable IDs (T1, T2, ...), explicit file globs, and explicit `depends`. The `spec-run` skill builds a dependency graph from these.

---

- [ ] **T1** — Bootstrap Python backend project structure
  - **files**: `backend/__init__.py`, `backend/server.py`, `pyproject.toml`, `uv.lock`, `.python-version`
  - **depends**: —
  - **satisfies**: N2
  - **acceptance**: `uv run uvicorn backend.server:app` starts without error; `GET /health` returns `{"status":"ok"}`

- [ ] **T2** — Define plugin interfaces (ASR / Agent / TTS abstract base classes)
  - **files**: `backend/asr/base.py`, `backend/agent/base.py`, `backend/tts/base.py`, `backend/core/events.py`
  - **depends**: T1
  - **satisfies**: R5, R7, R10, N3
  - **acceptance**: All ABCs importable; mypy reports no errors on the interfaces module

- [ ] **T3** — Implement plugin loader
  - **files**: `backend/plugins/loader.py`
  - **depends**: T2
  - **satisfies**: R23, R24
  - **acceptance**: Placing a subclass of `BaseAgent` in `plugins/` causes it to appear in the plugin registry after import

- [ ] **T4** — Implement character YAML loader and schema
  - **files**: `backend/character/loader.py`, `backend/character/schema.py`, `character.yaml` (default)
  - **depends**: T2, T3
  - **satisfies**: R8, R15, R21, R22
  - **acceptance**: `CharacterLoader("character.yaml")` returns a populated `Character` dataclass; missing optional fields use defaults

- [ ] **T5** — Implement sherpa-onnx ASR backend
  - **files**: `backend/asr/sherpa_onnx.py`
  - **depends**: T2
  - **satisfies**: R5, R6
  - **acceptance**: Can transcribe a test WAV file to text using a local sherpa-onnx model with no network calls

- [ ] **T6** — Implement Faster-Whisper ASR backend
  - **files**: `backend/asr/faster_whisper.py`
  - **depends**: T2
  - **satisfies**: R5
  - **acceptance**: Can transcribe the same test WAV file; result matches ground-truth text within 2 words

- [ ] **T7** — Implement core pipeline (ASR → Agent → TTS orchestrator)
  - **files**: `backend/core/pipeline.py`
  - **depends**: T2, T4
  - **satisfies**: R1, R2, R3
  - **acceptance**: With stub ASR/Agent/TTS implementations, pipeline processes a PCM input and emits an `audio_chunk` event within 500 ms

- [ ] **T8** — Implement interruption handling and echo gate
  - **files**: `backend/core/pipeline.py`, `backend/core/echo_gate.py`
  - **depends**: T7
  - **satisfies**: R2
  - **acceptance**: When `pipeline.interrupt()` is called mid-synthesis, the TTS stream stops and a new ASR cycle begins; mic is muted during AI audio playback

- [ ] **T9** — Implement Ollama LLM backend
  - **files**: `backend/agent/ollama.py`
  - **depends**: T2
  - **satisfies**: R7
  - **acceptance**: Streaming response from local Ollama with a test prompt yields sequential `token` events; `emotion` events emitted when LLM output contains `[emotion]` tags

- [ ] **T10** — Implement OpenAI-compatible LLM backend
  - **files**: `backend/agent/openai_compat.py`
  - **depends**: T2
  - **satisfies**: R7
  - **acceptance**: Works against a local LM Studio endpoint and against the real OpenAI API; inner-thought tags handled identically to Ollama backend

- [ ] **T11** — Implement sherpa-onnx TTS backend
  - **files**: `backend/tts/sherpa_onnx.py`
  - **depends**: T2
  - **satisfies**: R10, N1
  - **acceptance**: Synthesises a test sentence to PCM bytes using a local model; no network access required

- [ ] **T12** — Implement MeloTTS backend
  - **files**: `backend/tts/melotts.py`
  - **depends**: T2
  - **satisfies**: R10, R11
  - **acceptance**: Synthesises text in a different language than input (R11 path) when `target_lang` differs from content language

- [ ] **T13** — Implement ElevenLabs TTS backend
  - **files**: `backend/tts/elevenlabs.py`
  - **depends**: T2
  - **satisfies**: R10, R12
  - **acceptance**: Streaming synthesis against ElevenLabs API; voice cloning path accepts a `reference_audio` path and registers a voice before synthesis

- [ ] **T14** — Implement chat persistence (SQLite)
  - **files**: `backend/persistence/db.py`, `backend/persistence/models.py`
  - **depends**: T1
  - **satisfies**: R4
  - **acceptance**: `db.save_message(...)` persists to SQLite; `db.load_session(id)` returns messages in order; re-running the server against the same DB file restores history

- [ ] **T15** — Implement visual perception (camera + screen capture)
  - **files**: `backend/vision/camera.py`, `backend/vision/screen.py`
  - **depends**: T1
  - **satisfies**: R17, R18
  - **acceptance**: `capture_frame("camera")` returns a non-empty base64 PNG string; `capture_frame("screen")` returns a screenshot of the primary display

- [ ] **T16** — WebSocket gateway and REST session API
  - **files**: `backend/server.py`, `backend/api/sessions.py`
  - **depends**: T7, T14
  - **satisfies**: R1, R4
  - **acceptance**: WebSocket `/ws` accepts binary PCM frames and streams JSON events back; `GET /api/sessions` returns list of past sessions; `GET /api/sessions/:id/messages` returns messages

- [ ] **T17** — Bootstrap TypeScript/React frontend
  - **files**: `frontend/package.json`, `frontend/tsconfig.json`, `frontend/vite.config.ts`, `frontend/src/main.tsx`
  - **depends**: —
  - **satisfies**: N4
  - **acceptance**: `pnpm dev` serves the frontend at localhost:5173; `tsc --noEmit` passes

- [ ] **T18** — Implement WebSocket hook and audio playback
  - **files**: `frontend/src/hooks/useWebSocket.ts`, `frontend/src/hooks/useAudioPlayer.ts`
  - **depends**: T17
  - **satisfies**: R1
  - **acceptance**: `useWebSocket` connects to backend `/ws`; `audio_chunk` events are decoded and queued for `useAudioPlayer` which plays them in sequence without gaps

- [ ] **T19** — Implement Live2D avatar component
  - **files**: `frontend/src/components/Avatar.tsx`
  - **depends**: T17
  - **satisfies**: R13, R14, R15, R16
  - **acceptance**: Default model renders in a `<canvas>`; `expression` WebSocket events trigger correct Live2D expression/motion; click and drag on avatar emit interaction events

- [ ] **T20** — Implement chat log and inner-thought UI
  - **files**: `frontend/src/components/ChatLog.tsx`, `frontend/src/components/ThoughtBubble.tsx`
  - **depends**: T17
  - **satisfies**: R9
  - **acceptance**: `transcript` events appear in chat log; `thought` events render in a styled overlay above the avatar and auto-dismiss after 4 s

- [ ] **T21** — Implement session selector UI
  - **files**: `frontend/src/components/SessionDrawer.tsx`
  - **depends**: T18, T20
  - **satisfies**: R4
  - **acceptance**: Sidebar lists past sessions from `GET /api/sessions`; selecting one loads its messages into the chat log

- [ ] **T22** — Desktop shell (Tauri wrapper + pet mode)
  - **files**: `desktop/src-tauri/Cargo.toml`, `desktop/src-tauri/src/main.rs`, `desktop/src-tauri/tauri.conf.json`
  - **depends**: T17
  - **satisfies**: R19, R20
  - **acceptance**: `cargo tauri dev` opens a window rendering the React frontend; toggling pet mode makes the window transparent, always-on-top, and click-through outside the avatar bounding box

- [ ] **T23** — Proactive speaking scheduler
  - **files**: `backend/core/proactive.py`
  - **depends**: T7
  - **satisfies**: R3
  - **acceptance**: After idle_timeout seconds of no user input, the pipeline triggers an Agent call with a proactive speaking prompt; configurable and disable-able in `character.yaml`

- [ ] **T24** — Model setup CLI (`uv run setup`)
  - **files**: `backend/setup.py`, `scripts/download_models.py`
  - **depends**: T4
  - **satisfies**: R6, N1
  - **acceptance**: Running `uv run setup` with `character.yaml` pointing to sherpa-onnx backends downloads all required model files to `assets/models/` and verifies checksums

- [ ] **T25** — Tests
  - **files**: `tests/**/*.py`
  - **depends**: T1, T2, T3, T4, T5, T7, T8, T9, T14, T16
  - **satisfies**: R1, R2, R4, R5, R6, R7, R23, N1, N3
  - **acceptance**: `uv run pytest` passes; coverage ≥ 70% on `backend/core/`, `backend/asr/`, `backend/agent/`, `backend/persistence/`
