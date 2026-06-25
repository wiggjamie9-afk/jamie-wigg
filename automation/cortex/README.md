# RHYTHMIX × Cortex (the backbone)

This is the orchestration backbone for the RHYTHMIX content factory, per
[ADR-0002](../../docs/adr/0002-cortex-as-orchestration-backbone.md). It runs
[Cortex](https://github.com/aj-archipelago/cortex) (MIT) as the runtime and
exposes our generation engines as Cortex **pathways/tools** behind one
`rhythmix` entity agent.

## Why this exists

We were hand-building an orchestrator (`../orchestrator.py`) + a fleet of
`../handlers/*.py`. Cortex already does the hard parts — model routing, an agent
tool loop, memory, MCP discovery, per-agent workspaces, and an OpenAI-compatible
API. So Cortex is the backbone; our handlers become pathways. The Python handlers
remain the reference implementations for how to call each engine.

## What's here

```
automation/cortex/
├── index.mjs                       # boots Cortex + the `rhythmix` entity
├── package.json                    # depends on @aj-archipelago/cortex
└── pathways/
    ├── rhythmix_plan.js            # brief -> JSON task plan (model-agnostic)
    ├── modelslab_image.js          # hosted text-to-image (no-GPU path) [tool]
    └── idlora_talking_video.js     # local talking-head video via ID-LoRA [tool]
```

Each pathway with a `toolDefinition` becomes a tool the entity agent can call.

## Run it (on a real machine, not the iPhone-only flow)

```bash
cd automation/cortex
npm install

# Pick at least one planner model provider:
export OLLAMA_URL=http://localhost:11434      # free local, or
export OPENAI_API_KEY=...                      # hosted

# Engine keys (optional, per tool you want live):
export MODELSLAB_API_KEY=...                    # hosted image tool
export IDLORA_HOME=~/ID-LoRA                     # local talking-head tool
export IDLORA_LORA_PATH=~/ID-LoRA/models/.../lora_weights.safetensors

npm start    # GraphQL :4000/graphql, REST at /v1/* and /rest/*
```

Drive the agent (OpenAI-compatible):

```bash
curl http://localhost:4000/v1/chat/completions \
  -H 'content-type: application/json' \
  -d '{"model":"cortex-agent","messages":[{"role":"user",
       "content":"Plan a 3-asset launch for RHYTHMIX and generate the cover image."}]}'
```

## Model groups (configure planning as a strategy)

Define a `rhythmix-planner` model group in your Cortex config whose members are
e.g. a local Ollama model (free) and a hosted model (quality). The pathways pick
the capability; Cortex picks the healthy/fastest member. See the Cortex docs on
`modelGroups` and `modelRedirects`.

## Status / TODO

- [x] Decision recorded (ADR-0002)
- [x] Entity + planner pathway
- [x] ModelsLab tool (hosted, no-GPU)
- [x] ID-LoRA tool (local CLI)
- [ ] Z-Image-Turbo pathway (local MCP at :8001)
- [ ] HiDream-O1 pathway (submit ComfyUI workflow at :8188)
- [ ] Whisper / LLaVA / Agent TARS as pathways or MCP tools
- [ ] `rhythmix-planner` model group config + Ollama model entry
- [ ] Verify end-to-end on a GPU host (brief -> plan -> assets)

> Sandbox note: the Cortex *git repo* can't be cloned from the cloud sandbox
> (external git egress is blocked). The **npm package** install path is open, so
> this scaffold depends on `@aj-archipelago/cortex` and is meant to be brought up
> on the Mac / a GPU box.
