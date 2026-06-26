---
name: metagpt
description: MetaGPT — a multi-agent framework that turns a one-line requirement into a full software project (PM / architect / engineer roles running orchestrated SOPs). Use when you want to spin up a prototype repo, run the Data Interpreter for code+analysis, or reference how MetaGPT is installed/configured. Heavyweight Python framework, not a drop-in: needs an LLM API key and generates whole repos. For RHYTHMIX work it's a scaffolding/prototyping tool, separate from the HyperFrames/Studio pipelines.
---

# MetaGPT (multi-agent software company)

MetaGPT (`geekan/MetaGPT`) frames "Code = SOP(Team)": LLM-based roles (product manager,
architect, project manager, engineer) collaborate through orchestrated SOPs. Input one line →
output user stories, competitive analysis, requirements, data structures, APIs, docs, and code.
The team behind it also ships **MGX (MetaGPT X)** at [mgx.dev](https://mgx.dev), a hosted
"AI agent development team" product. Apache-style OSS; research: MetaGPT (ICLR 2024), AFlow,
SPO, AOT.

- Repo: https://github.com/geekan/MetaGPT · Docs: https://docs.deepwisdom.ai
- HF Space demo: search "MetaGPT" on Hugging Face Spaces.

## Can it run in this sandbox?

Partially. Python here is **3.11**, which satisfies MetaGPT's requirement (**>=3.9, <3.12**),
so `pip install metagpt` would work. But:
- It needs an **LLM API key** (OpenAI/Azure/Ollama/groq…) in `~/.metagpt/config2.yaml`.
- "Actual use" wants **node + pnpm** installed.
- The sandbox is **ephemeral** — anything installed/generated here is lost when the container
  is reclaimed. Generated repos must be committed to persist.
- It's unrelated to the RHYTHMIX deploy pipelines; treat it as a standalone prototyping tool.

So: don't auto-install. If you want to actually try it, ask and I'll `pip install metagpt`,
help wire a key, and generate into a scratch dir.

## Install

```bash
# Python >=3.9, <3.12 (3.11 here is fine)
conda create -n metagpt python=3.11 && conda activate metagpt   # optional
pip install --upgrade metagpt
# or: pip install --upgrade git+https://github.com/geekan/MetaGPT.git
# or editable: git clone https://github.com/geekan/MetaGPT && cd MetaGPT && pip install -e .
# install node + pnpm before real use
```

## Configure

```bash
metagpt --init-config        # writes ~/.metagpt/config2.yaml
```
```yaml
# ~/.metagpt/config2.yaml
llm:
  api_type: "openai"          # or azure / ollama / groq … (see LLMType)
  model: "gpt-4-turbo"        # or gpt-3.5-turbo
  base_url: "https://api.openai.com/v1"
  api_key: "YOUR_API_KEY"
```

## Usage

```bash
# CLI — generates a repo into ./workspace
metagpt "Create a 2048 game"
```

```python
# As a library
from metagpt.software_company import generate_repo
from metagpt.utils.project_repo import ProjectRepo
repo: ProjectRepo = generate_repo("Create a 2048 game")
print(repo)                                  # prints repo structure + files
```

```python
# Data Interpreter — code + analysis
import asyncio
from metagpt.roles.di.data_interpreter import DataInterpreter

async def main():
    di = DataInterpreter()
    await di.run("Run data analysis on sklearn Iris dataset, include a plot")

asyncio.run(main())   # or `await main()` in a notebook
```

Use cases shipped in the repo: Data Interpreter, Debate, Researcher, Receipt Assistant,
plus "Agent 101 / MultiAgent 101" build-your-own-agent guides.

## Where it fits RHYTHMIX

A way to bootstrap a *new* standalone app/prototype from a prompt (e.g. a fresh tool concept
under `apps/`), then hand the generated code to the normal workflow. It does **not** replace
the spec skills (`/spec-quick`, `/spec-run`) or the site-build pipeline for in-repo work — it's
a greenfield generator. Keep MetaGPT output in a scratch/`apps/<name>/` dir and review before
committing; generated code quality varies and needs the usual lint/test pass.
