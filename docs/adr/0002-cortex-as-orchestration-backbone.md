# ADR-0002: Cortex as the orchestration backbone

- Status: Accepted
- Date: 2026-06-25
- Supersedes the hand-rolled `automation/orchestrator.py` as the *target* runtime
  (the Python orchestrator and `demo_local.py` remain as a reference / fallback
  until the Cortex path is running on a capable machine).

## Context

`automation/` grew a hand-built orchestration stack: a Redis-backed task queue,
a Claude dispatcher, and a fleet of `*_handler.py` integrations (Ollama,
ComfyUI, Z-Image-Turbo, HiDream-O1 via ComfyUI, ID-LoRA, WhisperX/whisper.cpp,
LLaVA, Agent TARS, ModelsLab). `demo_local.py` proved the loop works end-to-end
for free using Ollama + an in-memory queue.

That stack is, in effect, a worse version of a pattern the industry has already
converged on: multi-model routing, an agentic tool loop, entity personalization,
memory, MCP tool discovery, client-side tool callbacks, and per-agent compute
sandboxes. [Cortex](https://github.com/aj-archipelago/cortex) (MIT) is an
open-source backend that already implements all of it:

- **Model router** with provider plugins (OpenAI, Azure, Gemini, Claude/Vertex,
  Grok, Replicate, VEO, **Ollama**, local), `modelRedirects`, `modelGroups`,
  endpoint health, latency sampling, and per-request overrides.
- **`sys_entity_agent`** — a real agent harness: lazy tool discovery, MCP
  hot-loading, client-side tools, tool budgets, duplicate detection, result
  compaction, streaming progress, memory-aware context.
- **Private containerized workspaces** (Docker / Azure ACI) per entity, with
  shell/file APIs, checkpoint/restore, warm pools — something we did not have at
  all.
- **OpenAI-compatible REST** (`/v1/chat/completions`, `/v1/responses`,
  `/v1/messages`) — the stable product API we would otherwise have to build.

Our handlers overlap heavily with Cortex provider plugins, but several engines
have **no** Cortex plugin: Z-Image-Turbo, HiDream-O1, ID-LoRA, and ModelsLab.
For those, our handlers are exactly the glue needed to expose them as Cortex
tools.

## Decision

Adopt Cortex as the orchestration backbone.

1. Run Cortex (`@aj-archipelago/cortex`, installed as an npm package) as the
   runtime. Scaffold lives in `automation/cortex/`.
2. Define a single **`rhythmix` entity** that owns the content-factory tools.
3. Convert each non-Cortex engine into a **Cortex pathway** with a
   `toolDefinition`, in two shapes:
   - **Hosted HTTP** (e.g. ModelsLab): a pathway that `fetch`es the provider API.
   - **Local CLI / server** (e.g. ID-LoRA, Z-Image, ComfyUI): a pathway that
     shells out or calls the local service the Python handler already targets.
4. Use Cortex **model groups** for planning/copy so "the planner model" is a
   strategy (local Ollama for free, hosted model when quality matters) instead of
   a hardcoded string.
5. Keep `orchestrator.py` / `demo_local.py` as a documented fallback until the
   Cortex path is verified on a GPU/desktop host. Do not extend them further.

## Migration map (handler → pathway)

| Engine | Today | Under Cortex |
|---|---|---|
| Ollama | `ollama_handler.py` | **Native** Cortex Ollama provider + a model group member; no pathway needed |
| Claude / GPT / Gemini | `ClaudeDispatcher` | **Native** provider plugins + model groups |
| ModelsLab (hosted) | `modelslab_handler.py` | `pathways/modelslab_image.js` tool (scaffolded) |
| ID-LoRA (local CLI) | `idlora_handler.py` | `pathways/idlora_talking_video.js` tool (scaffolded) |
| Z-Image-Turbo (local MCP) | `zimage_handler.py` | pathway calling the local Z-Image MCP/HTTP (TODO) |
| HiDream-O1 (ComfyUI) | `comfyui_handler.py` template | pathway submitting the ComfyUI workflow (TODO) |
| Whisper / LLaVA / Agent TARS | their handlers | pathways or MCP tools (TODO) |
| Per-task isolation | (none) | Cortex **workspaces** per entity |
| Product API | (none) | Cortex OpenAI-compatible `/v1/*` |

## Consequences

- **Positive:** one stable internal API; model upgrades without client rewrites;
  a real tool loop, memory, and per-agent sandboxes for free; a clear product
  surface (`/v1/chat/completions` with `model: "cortex-agent"`).
- **Cost:** Cortex is a Node backend; it wants a real machine (and Docker for
  workspaces), so it cannot run in the iPhone-only flow — the hosted ModelsLab
  pathway is the no-GPU bridge there.
- **Sandbox limitation:** the Cortex git repo cannot be cloned from the cloud
  sandbox (external git egress is blocked, 403). The **npm package** path is
  open, so `automation/cortex/` depends on `@aj-archipelago/cortex` and is meant
  to be brought up on the Mac / a GPU host.
- **Not wasted:** the Python handlers remain the reference implementations and
  the source of truth for how to call each non-Cortex engine; pathways port that
  logic to JS.
