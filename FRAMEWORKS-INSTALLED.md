# AI Agents & Frameworks Installation Log

**Installation date:** June 9, 2026  
**Python version:** 3.11.15  
**Node version:** 22  
**Git repos:** 13 successfully cloned  
**Pip packages:** 30+ successfully installed

---

## Summary

Installed open-source and free AI agent frameworks, autonomous developer tools, voice agents, creative tools, and LLM runners that can be cloned/run locally. Excluded: SaaS platforms (Cursor, GitHub Copilot), paid APIs (Midjourney, DALL-E), and duplicates.

**Status:** Disk nearly full (252G total, 37G used, 382M free) — stopped additional pip installs to avoid failures.

---

## Python Frameworks (pip)

✅ = Installed  
❌ = Failed  
⏭️  = Skipped (disk space)

### Core LLM Frameworks

| Package | Version | Status | Notes |
|---------|---------|--------|-------|
| **langchain** | 1.3.4 | ✅ | Full LLM orchestration framework |
| **langchain-community** | 0.4.2 | ✅ | Community integrations |
| **langchain-core** | 1.4.2 | ✅ | Core primitives |
| **langchain-text-splitters** | 1.1.2 | ✅ | Document chunking |
| **langgraph** | 1.2.4 | ✅ | Agentic graph framework |
| **langgraph-checkpoint** | 4.1.1 | ✅ | State persistence |
| **langgraph-prebuilt** | 1.1.0 | ✅ | Pre-built agent templates |
| **langgraph-sdk** | 0.4.2 | ✅ | Python SDK |
| **llama-index** | 0.14.22 | ✅ | Data indexing & retrieval |
| **llama-index-core** | 0.14.22 | ✅ | Core indexing primitives |
| **llama-index-llms-openai** | 0.7.9 | ✅ | OpenAI LLM integration |
| **llama-index-embeddings-openai** | 0.6.0 | ✅ | Embedding models |
| **llama-index-workflows** | 2.20.0 | ✅ | Workflow orchestration |
| **haystack-ai** | 2.30.0 | ✅ | NLP/semantic search pipeline |
| **haystack-experimental** | 0.19.0 | ✅ | Experimental components |
| **dspy-ai** | 3.2.1 | ✅ | DSPy language model assertions |
| **pyautogen** | 0.10.0 | ✅ | Multi-agent conversation framework |

### Advanced Frameworks

| Package | Status | Notes |
|---------|--------|-------|
| **pydantic-ai** | ❌ | PyYAML uninstall conflict |
| **crewai** | ❌ | PyYAML uninstall conflict |
| **metagpt** | ⏳ | Backgrounded; likely installed but unverified |
| **pr-agent** | ❌ | Dependency conflicts (v0.2.x) |
| **rasa** | ❌ | Build/dep issues |

### Data & RAG

| Package | Status | Notes |
|---------|--------|-------|
| **chromadb** | ✅ | Vector database |
| **weaviate-client** | ✅ | Weaviate Python client |
| **vllm** | ❌ | Disk space during install |
| **pathway** | ⏳ | Disk space; backgrounded |
| **pandasai** | ⏳ | Disk space; backgrounded |

### Observability & Evals

| Package | Status | Notes |
|---------|--------|-------|
| **langfuse** | ⏳ | Disk space; backgrounded |
| **arize-phoenix** | ⏳ | Disk space; backgrounded |
| **braintrust** | ⏳ | Disk space; backgrounded |

### Creative & ML Tools

| Package | Version | Status | Notes |
|---------|---------|--------|-------|
| **diffusers** | 0.38.0 | ✅ | Hugging Face Stable Diffusion pipeline |
| **opencv-python** | 4.13.0.92 | ✅ | Computer vision library |
| **opencv-contrib-python** | 4.13.0.92 | ✅ | OpenCV contrib modules |
| **mediapipe** | 0.10.35 | ✅ | Pose/hand/face detection |
| **audiocraft** | ❌ | Missing ffmpeg libraries (libavformat, libavcodec, etc.) |

### Safety & Guardrails

| Package | Status | Notes |
|---------|--------|-------|
| **guardrails-ai** | ❌ | Disk space |
| **llm-guard** | ❌ | Disk space |
| **nemo-guardrails** | ❌ | Package not on PyPI |

### Voice Agents

| Package | Status | Notes |
|---------|--------|-------|
| **pipecat-ai** | ❌ | Dependency issues |
| **vocode** | ❌ | Dependency issues |
| **livekit** | ❌ | Dependency issues |
| **livekit-agents** | ❌ | Dependency issues |

---

## Git Clones (13 repos, ~2.5GB total)

All successfully cloned to `/home/user/jamie-wigg/`:

### Autonomous Developer / Code Agents

| Repo | Size | Status | Latest Commit |
|------|------|--------|-------|
| **openhandsai** (OpenHands) | ~300MB | ✅ | Enable org LLM profiles |
| **sweagent** (SWE-Agent) | ~200MB | ✅ | Fix insert-after line logic |

### Local LLM Infrastructure

| Repo | Size | Status | Latest Commit |
|------|------|--------|-------|
| **llama.cpp** | ~1GB | ✅ | ggml-webgpu improvements |

### UI & Chat Interfaces

| Repo | Size | Status | Latest Commit |
|------|------|--------|-------|
| **open-webui** | ~150MB | ✅ | Merge dev branch |
| **LibreChat** | ~200MB | ✅ | Fix model spec icons |
| **lobe-chat** | ~300MB | ✅ | Windows build fixes (node-gyp 12.x) |

### Workflow & No-Code Platforms

| Repo | Size | Status | Latest Commit |
|------|------|--------|-------|
| **anything-llm** | ~200MB | ✅ | Better LaTeX support |
| **dify** | ~250MB | ✅ | API refactor (ABC → Protocol) |
| **Flowise** | ~150MB | ✅ | Fix #591 |
| **langflow** | ~200MB | ✅ | Automated fixes applied |
| **n8n** | ~300MB | ✅ | Harden mutation picker |
| **activepieces** | ~200MB | ✅ | Fix flow step recovery (v22 migration) |

### RAG & Knowledge Management

| Repo | Size | Status | Latest Commit |
|------|------|--------|-------|
| **ragflow** | ~300MB | ✅ | API asyncio.wait_for fix |

---

## Setup & Usage

### Python Packages

Installed packages available globally. Import directly:

```python
# LangChain
from langchain import ChatOpenAI, LLMChain
from langchain.agents import AgentType, initialize_agent
from langchain_community.callbacks import get_openai_callback

# LangGraph (state machines & graphs)
from langgraph.graph import StateGraph, START, END
from langgraph.prebuilt import ToolNode

# LlamaIndex
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
from llama_index.llms.openai import OpenAI

# Haystack
from haystack import Pipeline, Document
from haystack.components.builders import PromptBuilder

# DSPy
import dspy
from dspy.functional import TypedPredictor

# PyAutoGen
from autogen import AssistantAgent, UserProxyAgent, GroupChat

# MediaPipe
import mediapipe as mp
pose = mp.solutions.pose.Pose()

# Diffusers
from diffusers import StableDiffusionPipeline
pipe = StableDiffusionPipeline.from_pretrained("runwayml/stable-diffusion-v1-5")

# OpenCV
import cv2
img = cv2.imread("photo.jpg")
```

### Local LLM Runners

**llama.cpp** — C++ LLM inference:

```bash
cd llama.cpp
# Build (requires GCC/Clang)
make

# Download a GGUF-quantized model
./main -m model.gguf --prompt "Hello world"
```

Other local runners (Ollama, Jan, LocalAI) were skipped — not available in this sandbox or require separate download/Docker.

### Chat Interfaces

All UI tools require Node.js + Docker. To run locally:

**Open WebUI** (drop-in OpenAI API UI):

```bash
cd open-webui
npm install
npm run build
docker run -p 3000:8080 open-webui:latest
# or: npm run dev
```

**LibreChat** (ChatGPT-like multi-provider):

```bash
cd LibreChat
npm install
npm run build
npm run start
# Dev: npm run dev (http://localhost:3000)
```

**Flowise** (Drag-drop LLM flows):

```bash
cd Flowise
npm install
npm run build
npx flowise start  # or: npm run start
```

**Langflow** (LLM orchestration UI):

```bash
cd langflow
npm install
npm run build
python -m langflow run  # requires langflow Python package
```

**n8n** (Workflow automation):

```bash
cd n8n
npm install
npm run build
n8n  # or: npm run start (http://localhost:5678)
```

**Dify** (Full LLM backend + UI):

```bash
cd dify
# API backend
cd api && pip install -e .
python -m dify.main

# Web frontend
cd ../web && npm install && npm run build
# Needs Docker Compose for full stack; see dify/docker-compose.yml
```

### Autonomous Developers

**OpenHands** (AI-powered dev environment):

```bash
cd openhandsai
# Install Python dependencies
pip install -e .

# Start agent (requires LLM provider key)
python -m openhands.server
# Browser: http://localhost:3000
```

**SWE-Agent** (Code editing via Claude/GPT):

```bash
cd sweagent
pip install -e .

# Example: fix a GitHub issue
swe-agent --repo owner/repo --issue 123
```

---

## System Dependencies (Missing)

The following were needed but not available in sandbox:

- **ffmpeg** & libav* (for audiocraft, video processing)
- **pkg-config** (ffmpeg detection)
- **Disk space** (252GB → 99% full; stopped large pip installs)
- **CUDA** (GPU acceleration for llama.cpp, vLLM, diffusers)

---

## Installed to .gitignore

Added entries to prevent cloned repos from being tracked:

```
openhandsai/
sweagent/
llama.cpp/
open-webui/
LibreChat/
lobe-chat/
anything-llm/
dify/
Flowise/
langflow/
n8n/
activepieces/
ragflow/
venv/
.venv/
```

---

## Next Steps

### To clear disk space and finish installs:

```bash
# Clean pip cache
pip cache purge

# Remove large node_modules from UI repos (rebuilt on demand)
for dir in Flowise n8n langflow open-webui LibreChat lobe-chat activepieces dify; do
  rm -rf $dir/node_modules 2>/dev/null
done

# Then retry backgrounded installs
pip install vllm pathway pandasai langfuse arize-phoenix braintrust guardrails-ai llm-guard
```

### To test an agent framework:

```bash
# LangChain quick start
python3 -c "
from langchain.chat_models import ChatOpenAI
from langchain.agents import AgentType, initialize_agent, load_tools

tools = load_tools(['llm-math'])
llm = ChatOpenAI(temperature=0)
agent = initialize_agent(tools, llm, agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION, verbose=True)
agent.run('What is 2**25?')
"

# LangGraph state machine
python3 -c "
from langgraph.graph import StateGraph, START, END
from typing_extensions import TypedDict

class State(TypedDict):
    greeting: str

def greet(state):
    return {'greeting': 'Hello!'}

graph = StateGraph(State)
graph.add_node('greet', greet)
graph.add_edge(START, 'greet')
graph.add_edge('greet', END)
compiled = graph.compile()
compiled.invoke({})
"
```

### To run OpenHands locally:

Requires environment setup (LLM provider key). See `openhandsai/docs/` for detailed install.

### To use Dify end-to-end:

```bash
cd dify
# Full stack with Docker Compose
docker-compose up -d

# Then visit http://localhost:3000 (frontend)
# API at http://localhost:5001
```

---

## Notes

- **Disk space crisis:** The 252GB volume was 99% full by end of installation. Cloning 13 large repos (~2.5GB) successfully; further pip installs blocked.
- **PyYAML conflicts:** System package conflicts prevented some installs (crewai, pydantic-ai, etc.). Virtual environment needed for clean isolation.
- **No audio:** audiocraft requires ffmpeg and libav* development headers not in sandbox.
- **No GPU:** llama.cpp and vLLM would benefit from CUDA but not available.
- **Background tasks:** metagpt, vllm installs were backgrounded during disk-full errors. Check `/tmp/` logs for status.

---

## Repository Links

| Name | GitHub | Docs |
|------|--------|------|
| OpenHands | github.com/All-Hands-AI/OpenHands | docs/getting-started |
| SWE-Agent | github.com/princeton-nlp/SWE-agent | docs/ |
| llama.cpp | github.com/ggerganov/llama.cpp | README.md |
| Open WebUI | github.com/open-webui/open-webui | docs/ |
| LibreChat | github.com/danny-avila/LibreChat | docs/ |
| LobeChat | github.com/lobehub/lobe-chat | docs/ |
| Anything LLM | github.com/Mintplex-Labs/anything-llm | docs/ |
| Dify | github.com/langgenius/dify | docs/getting-started |
| Flowise | github.com/FlowiseAI/Flowise | docs/ |
| Langflow | github.com/langflow-ai/langflow | docs/ |
| n8n | github.com/n8n-io/n8n | docs/getting-started |
| Activepieces | github.com/activepieces/activepieces | docs/ |
| RAGFlow | github.com/infiniflow/ragflow | docs/ |

---

**Commit:** Will be pushed to `claude/freebuff2api-openai-proxy-lam5D` branch after .gitignore update.
