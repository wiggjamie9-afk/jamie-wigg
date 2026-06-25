# NVIDIA Skills Setup Guide

## Overview

The **NVIDIA skills catalog** (`nvidia/skills`) is a published, signed set of Agent Skills for
NVIDIA products — cuOpt, cuDF, CUDA-Q, Jetson, NeMo, TAO Toolkit, Holoscan, DeepStream, Video
Search & Summarization, and more. Skills install through the standard `skills` CLI and load the
next time the agent encounters a relevant task.

> ⚠️ **Relevance check before installing:** these are **GPU / datacenter / scientific-computing**
> skills (quantum, vehicle routing, medical imaging, Jetson BSP, large-scale training). They have
> **no overlap with the RHYTHMIX creative pipeline**. Install selectively, only if you start GPU
> work — do **not** bulk-install the whole catalog into this repo's agent config.
>
> ⚠️ In this repo's **cloud sandbox the egress allowlist blocks the skills registry**, so `npx
> skills add` will fail here at runtime. Run these on a machine with unrestricted network access.

## Install (standard CLI flow)

```bash
# Interactive — prompts for skill + install destination:
npx skills add nvidia/skills

# Install one skill without prompts:
npx skills add nvidia/skills --skill cuopt-numerical-optimization-api-python --yes

# Target a specific agent:
npx skills add nvidia/skills --skill <name> --agent claude-code
#   other agents: codex | cursor | kiro-cli (repeat --agent to install into several)

# Browse the catalog without installing:
npx skills add nvidia/skills --list
```

You do **not** need to clone the repo or copy skill folders by hand.

## Catalog (high level)

GPU optimization (**cuOpt**, **cuFOLIO**), DataFrames (**cuDF**), quantum (**CUDA-Q**), NumPy/SciPy
on multi-GPU (**cuPyNumeric**), data loading (**DALI**), synthetic data (**Data Designer**), vision/
video (**DeepStream**, **Video Search & Summarization**, **TAO Toolkit**), edge (**Jetson BSP/Device**,
**Holoscan**), training/serving (**Megatron-Core**, **NeMo** family, **NeMo-RL**, **Dynamo**),
medical AI (**MONAI-based**), weather/climate (**Earth2Studio**), physics (**PhysicsNeMo**, **Physical
AI**), **RAG Blueprint**, **TileGym**, **Nemotron / Nemotron Speech**. Full list: `--list`.

## Verifying signed skills

Every published skill ships a detached OMS signature (`skill.oms.sig`), a `skill-card.md`, a
Tier-3 eval dataset, and (when available) a `BENCHMARK.md`. Verify against NVIDIA's trust anchor:

```bash
pip install model-signing
model_signing verify certificate SKILL_DIR \
  --signature SKILL_DIR/skill.oms.sig \
  --certificate_chain nv-agent-root-cert.pem \
  --ignore_unsigned_files
```

## Where it fits in this repo

Almost certainly **not needed** for RHYTHMIX. Catalogued here only because the install flow was
requested. If a future project pulls in GPU compute, install the **specific** skill (e.g.
`cuopt-*`, `cudf-*`) with `--skill ... --agent claude-code` rather than the whole catalog —
this repo's skills live in `.agents/skills/` / `.claude/skills/` and are tracked in `skills-lock.json`.
