# MindSearch: Deep AI Searcher Mimicking Human Minds

Open-source deep research agent framework by InternLM that mimics human reasoning patterns for web search and information synthesis. Demonstrates how agentic search differs from naive retrieval—decomposing queries, iterating, and cross-referencing sources like a human researcher would.

GitHub: `InternLM/MindSearch` · Latest: Nov 2024 (Lagent v0.5 refactor) · License: Apache 2.0

## Why It's Relevant Here

Two angles:

1. **Research agent complement to Nucleus/Mary** — Nucleus orchestrates multi-step video pipelines; MindSearch handles the *research* sub-task (fact-checking, competitor analysis, trend discovery, script sourcing). While Nucleus chains agents to generate assets, MindSearch is the "deep researcher" agent it can delegate to. Pairs with MiroFlow (hierarchical reasoning) for complex multi-domain research.

2. **Lagent framework foundation** — MindSearch is built on **Lagent**, a lightweight LLM-agent framework now at v0.5 with refactored concurrency model. Lagent is a candidate runtime for custom agents in this ecosystem (alternative to Pydantic AI / Mary agent's current stack). AgentFLAN (training dataset for agentic behavior) and T-Eval (fine-grained tool-use benchmarking) sit alongside it.

## Architecture

### Core Components

| Component | What it does |
|---|---|
| **Query Decomposer** | Breaks a research question into sub-queries (mimics human "break down the problem" thinking) |
| **Search Agent** | Executes searches via pluggable search engines (DuckDuckGo, Bing, Brave, Google, Tencent) |
| **Iterative Synthesis** | Reads top results, identifies gaps, triggers follow-up searches (loop until confident) |
| **Response Generator** | Synthesizes findings into a coherent report with citations |

**Lagent Abstraction**: Built on top of Lagent's ActionExecutor + Tool interface. Agents are stateless; tools are pluggable (web search, calculator, knowledge retrieval, etc.).

### Multi-backend Support

| Model Backend | Use case |
|---|---|
| **InternLM2.5-7b-chat** (local) | Lightweight, optimized for Chinese + English reasoning |
| **GPT-4** | Higher reasoning power, drop-in via API |
| Custom (via `model_format` flag) | Extend to Claude, Kimi K2, others |

## Deployment

### Backend (FastAPI)

```bash
git clone https://github.com/InternLM/MindSearch
cd MindSearch
pip install -r requirements.txt

# Rename and configure .env
mv .env.example .env
# Fill in: WEB_SEARCH_API_KEY, model credentials, etc.

# Launch server (async agents for concurrency)
python -m mindsearch.app \
  --lang en \
  --model_format internlm_server \
  --search_engine DuckDuckGoSearch \
  --asy
```

Default: FastAPI on `http://127.0.0.1:8000`.

Flags:
- `--lang en` / `cn` — model language
- `--model_format` — `internlm_server` (local 7b), `gpt4`, or custom
- `--search_engine` — `DuckDuckGoSearch`, `BingSearch`, `BraveSearch`, `GoogleSearch`, `TencentSearch`
- `--asy` — async agents (recommended for concurrency)

### Frontend Options

**React** (modern UI, real-time multi-query display):
```bash
cd frontend/React
npm install
# Edit vite.config.ts to point at backend HOST:PORT (default 127.0.0.1:8002)
npm start
```

**Gradio** (lightweight, no build step):
```bash
python frontend/mindsearch_gradio.py
```

**Streamlit** (familiar to data folks):
```bash
streamlit run frontend/mindsearch_streamlit.py
```

### Direct Backend Access (No UI)

```bash
python backend_example.py  # example client script
```

Or debug in terminal:
```bash
python -m mindsearch.terminal
```

## Web Search Engine Integration

Pluggable search engine abstraction (BingBrowser / Searcher pattern in `mindsearch/agent/__init__.py`):

```python
BingBrowser(
    searcher_type='BraveSearch',  # or GoogleSearch, etc.
    topk=2,
    api_key=os.environ.get('BRAVE_API_KEY', '')
)
```

**Supported engines:**
- **DuckDuckGo** — No API key (anonymous)
- **Bing Search** — API key required
- **Brave Search** — API key required
- **Google Serper** — API key required
- **Tencent Search** — Secret ID + Secret Key required

**Recommendation for this ecosystem:** DuckDuckGo for anonymous research (zero setup), Brave Search for privacy-conscious workflows.

## Fit & Caveats

- **Stateless agent design** — Each query spawns a fresh search loop. No memory across queries. For persistent research projects (RHYTHMIX campaign research), wrap in a higher-order agent that manages state (Nucleus pattern).
- **Local vs. hosted** — InternLM2.5-7b (~14GB VRAM at fp16) runs on a single GPU. For laptop/sandbox, use GPT-4 backend or rent GPU. Puyu (InternLM's hosted platform) has a deployed version ready to try.
- **Lagent as runtime** — If building custom agents for this ecosystem, consider Lagent + custom tools instead of starting from scratch. Lighter than Pydantic AI for simple agent chains.
- **Comparison to MiroFlow** — MindSearch is *search-focused* (web + synthesis); MiroFlow is *reasoning-focused* (hierarchical decomposition + expert routing for complex multi-step problems). Use MindSearch for "find current info + synthesize", MiroFlow for "solve a hard math/design problem".

## Ecosystem Integration Patterns

### 1. Research Agent for Nucleus Pipelines

```
Nucleus orchestration loop:
├─ Task: "Generate promo video for new crypto exchange"
├─ Delegate to MindSearch: "What are top 3 exchanges launching this month?"
│  ├─ Decompose: sub-queries on launch timelines, features, regulatory
│  ├─ Search & synthesize
│  └─ Return findings + sources
├─ Pass findings to rhythmix-author (script generation)
└─ Render → publish
```

### 2. Fact-Checking for RHYTHMIX Claim Copy

Before finalizing a promo's voiceover, fact-check claims:
```
Query: "What is the longest-running DJ festival in Australia?"
→ MindSearch decompose + iterate
→ Return verified answer + sources
→ Writer updates script
```

### 3. Competitive Intelligence

```
Query: "What's Ableton Live's market share in music production software in 2024?"
→ Sub-queries: Ableton market position, competitors (FL Studio, Logic, Reaper), adoption trends
→ Synthesized report with citations
```

### 4. Lagent-based Custom Agents

Use MindSearch's Lagent underpinning to build domain-specific agents:
```python
from lagent.actions import ActionExecutor
from lagent.agents import ReActAgent

# Custom agent with MindSearch + domain-specific tools
agent = ReActAgent(
    llm=your_llm,
    tools=[search_tool, calculator_tool, custom_tool]
)
response = agent(query)
```

## Related Tools in Ecosystem

| Tool | Relationship |
|---|---|
| **Nucleus** | Orchestration layer; MindSearch = research micro-agent |
| **MiroFlow** | Hierarchical reasoning; MindSearch = specialized web-search expert within a MiroFlow tree |
| **Kimi K2** | Can power the LLM backend (alternative to InternLM/GPT-4) |
| **Lagent** | Underlying agent framework; extend for custom agents |
| **Context7** | Documentation lookup; MindSearch for cross-source fact synthesis |

## References

- **Paper**: arXiv:2407.20183 (MindSearch: Mimicking Human Minds Elicits Deep AI Searcher)
- **GitHub**: `InternLM/MindSearch`
- **Framework**: **Lagent** (lightweight LLM-agent framework, v0.5 concurrent refactor)
  - Docs: https://github.com/InternLM/Lagent
  - Related: AgentFLAN (agent training datasets, ACL 2024), T-Eval (tool-use benchmarks, ACL 2024)
- **Hosted**: Puyu platform (InternLM's deployed MindSearch)
- **License**: Apache 2.0

---

**Use Case for Ecosystem:** Deep research agent (query decomposition → iterative search → synthesis) as a micro-agent inside Nucleus orchestration loops or as a standalone fact-checking/competitive-intelligence tool. Built on Lagent (lightweight agent framework v0.5) — a candidate runtime for custom agents if moving beyond Pydantic AI. Use MindSearch for web-research tasks; pair with MiroFlow for complex multi-domain reasoning chains.
