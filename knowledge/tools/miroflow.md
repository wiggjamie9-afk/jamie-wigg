# MiroFlow: Open-Source Research Agent Framework

Official implementation of the MiroMind Research Agent Project. State-of-the-art multi-step internet research system for addressing complex challenges such as future event prediction, document analysis, and information synthesis. Ranks #1 on FutureX benchmark (11% improvement over GPT-5).

GitHub: https://github.com/MiroMindAI/MiroFlow

## MiroFlow Components

| Component | Purpose |
|---|---|
| **MiroFlow** | Research agent framework with reproducible SOTA performance |
| **MiroThinker** | Open-source model natively supporting tool-assisted reasoning |
| **MiroVerse** | 147k premium training data for research agent training |
| **Benchmarks** | FutureX, GAIA, HLE, BrowserComp, xBench-DeepSearch |

## Quick Start (5 minutes)

**Prerequisites:**
- Python 3.12+
- `uv` package manager
- Linux or macOS

**Installation:**
```bash
git clone https://github.com/MiroMindAI/MiroFlow && cd MiroFlow
uv sync

# Configure API
cp .env.template .env
# Edit .env and add OPENROUTER_API_KEY
```

**Run first agent:**
```bash
uv run main.py trace \
  --config_file_name=agent_quickstart_reading \
  --task="What is the first country listed in the XLSX file that have names starting with Co?" \
  --task_file_name="data/FSI-2023-DOWNLOAD.xlsx"
```

**Expected output:** `Congo Democratic Republic`

## Performance Benchmarks

### FutureX (Future Event Prediction) — #1 Ranking
- **MiroFlow**: 11% improvement over GPT-5's baseline
- **Date**: September 10, 2025
- **Task**: Predict future events with high accuracy

### GAIA (General AI Assistant)
- **MiroFlow**: 82.4% (pass@1)
- **Comparison**: OpenAI Deep Research (67.4%), Manus (73.3%)

### HLE (Hybrid Living Environments)
| Framework | HLE | HLE-Text-Only |
|---|---|---|
| **MiroFlow** | 27.2% | 29.5% |
| OpenAI Deep Research | 26.6% | — |
| Gemini Deep Research | 26.9% | — |
| DeepSeek v3.1 | — | 29.8% |

### BrowserComp (Browser-based Complex Tasks)
| Framework | English | Chinese |
|---|---|---|
| **MiroFlow** | 33.2% | 47.1% |
| OpenAI Deep Research | 51.5% | 42.9% |
| WebSailor-72B | 30.1% | — |

### xBench-DeepSearch (Deep Web Search)
| Framework | Score |
|---|---|
| **MiroFlow** | 72.0% |
| Kimi Researcher | 69.0% |
| DeepSeek v3.1 | 71.2% |
| Gemini Deep Research | 50%+ |
| WebSailor-72B | 55.0% |

## Architecture

### Multi-Turn Conversation
- Advanced conversation management
- Context preservation across turns
- Tool integration at each step
- Streaming response handling

### Tool Ecosystem
Supported tools:
- **Audio**: Transcription
- **Code**: Python execution
- **Files**: Reading, processing, analysis
- **Reasoning**: Chain-of-thought, planning
- **Search**: Google Search, web scraping
- **Vision**: Visual Question Answering (VQA)
- **Computation**: E2B sandbox environments

### Hierarchical Sub-Agent Orchestration
- Delegate complex tasks to specialized sub-agents
- Coordinate parallel reasoning streams
- Aggregate results from multiple agents
- Fallback mechanisms for failed tasks

### State Management
- Persistent conversation history
- Tool result caching
- Progress tracking
- Error recovery

## Supported Models & APIs

**Models:**
- OpenAI (GPT-4, GPT-5)
- Anthropic (Claude)
- Google (Gemini)
- Alibaba (Qwen)
- Open-source (MiroThinker)

**APIs:**
- OpenRouter (multi-model routing)
- Direct model endpoints
- Custom model servers

## Configuration

**Example config structure:**
```yaml
model: gpt-4
temperature: 0.7
max_tokens: 2048
tools:
  - python_executor
  - google_search
  - file_reader
  - vqa
timeout: 300
retry_policy: exponential_backoff
```

## MiroThinker: Open-Source Alternative

MiroThinker is the open-source reasoning model that powers cost-effective MiroFlow deployment:

**Key metrics:**
- Can run on single RTX 4090
- Tool-assisted reasoning native support
- Trained on 147k MiroVerse examples
- Achieves competitive performance on benchmarks

**Deployment:**
```bash
# Local inference via vLLM or similar
vllm serve miromind/mirothinker-7b
```

## Use Cases

### 1. Future Event Prediction
```
Task: "Predict the winner of the 2025 World Cup"
MiroFlow:
  1. Search recent team performance
  2. Analyze historical data
  3. Evaluate player injuries/transfers
  4. Reason over factors
  5. Return prediction with confidence
```

### 2. Document Analysis & Extraction
```
Task: "What is the first country in this Excel file starting with 'Co'?"
MiroFlow:
  1. Read file content
  2. Parse structure
  3. Filter rows
  4. Extract answer
```

### 3. Research Synthesis
```
Task: "Summarize findings from CVPR 2025 best paper and provide research advice"
MiroFlow:
  1. Search CVPR 2025 proceedings
  2. Retrieve full paper
  3. Extract key findings
  4. Synthesize insights
  5. Generate recommendations
```

### 4. Multi-step Problem Solving
Complex tasks requiring:
- Information gathering (multiple sources)
- Reasoning chains (complex logic)
- Tool orchestration (sequential execution)
- Result synthesis (aggregation)

## Integration with Nucleus

MiroFlow complements Nucleus/Mary for research-heavy tasks:

| Task Type | Agent |
|---|---|
| **Video/carousel generation** | Nucleus/Mary |
| **Multi-step research** | MiroFlow |
| **Complex reasoning** | MiroFlow → Nucleus |
| **Market analysis** | MiroFlow (research) → Nucleus (generate assets) |
| **Competitive intelligence** | MiroFlow (synthesis) |

**Example pipeline:**
```python
# Nucleus orchestrator
research_brief = await miroflow.research(
    query="Top 5 AI trends for 2025"
)

carousel_assets = await nucleus.generate_carousel(
    content=research_brief,
    style="modern_tech"
)

return carousel_assets
```

## Advanced Features

### Concurrency & Reliability
- Robust concurrency management
- Fault-tolerant design
- Rate-limited API handling
- Network unstability resilience
- Automatic retry with exponential backoff

### Cost-Effective Deployment
- Single RTX 4090 capable
- Free, open-source tool stack
- No proprietary dependencies
- Simple scaling architecture

### Reproducible Benchmarks
- Complete benchmark suite included
- Configuration files for each benchmark
- Detailed evaluation metrics
- Comparison with baseline models

## Project Structure

```
MiroFlow/
├── main.py                  # Entry point
├── .env.template            # Configuration template
├── configs/
│   ├── agent_quickstart_reading/
│   ├── future_prediction/
│   ├── gaia_validation/
│   └── ...                  # Benchmark configs
├── data/
│   ├── FSI-2023-DOWNLOAD.xlsx
│   └── ...                  # Benchmark datasets
├── src/
│   ├── agent/               # Core agent logic
│   ├── tools/               # Tool implementations
│   ├── models/              # Model integrations
│   └── utils/               # Utilities
└── benchmarks/              # Benchmark evaluation scripts
```

## Command Reference

**Trace execution (detailed step-by-step):**
```bash
uv run main.py trace \
  --config_file_name=agent_quickstart_reading \
  --task="Your task here" \
  --task_file_name="optional_file.xlsx"
```

**Batch evaluation:**
```bash
uv run main.py evaluate \
  --benchmark=gaia \
  --model=gpt-4
```

**Custom task:**
```bash
uv run main.py run \
  --model=gpt-4 \
  --task="Your research task"
```

## FAQ

**Q: What API keys do I need?**
A: OpenRouter API key (or direct model provider keys). Set in `.env`.

**Q: Can I use other models?**
A: Yes. Modify config to use Claude, Gemini, Qwen, or any OpenRouter-supported model.

**Q: How do I run locally?**
A: Use MiroThinker model via vLLM or similar local inference engine.

**Q: Is there commercial support?**
A: See GitHub discussions or contact the MiroMind team.

## Licensing & Attribution

**License**: Apache License 2.0

**Citation:**
```bibtex
@article{miromind2025mirothinker,
  title={MiroThinker: Pushing the Performance Boundaries of 
         Open-Source Research Agents via Model, Context, 
         and Interactive Scaling},
  author={MiroMind Team and Bai, Song and Bing, Lidong 
          and Chen, Carson and others},
  journal={arXiv preprint arXiv:2511.11793},
  year={2025}
}
```

## For One-Person Builders

MiroFlow is ideal for:
- **Research automation** — Automate literature reviews, market analysis
- **Complex problem-solving** — Multi-step reasoning without manual intervention
- **Future prediction** — Build forecasting agents for business intelligence
- **Data synthesis** — Extract and aggregate information from multiple sources
- **Cost-effective AI** — Run on local hardware with MiroThinker

**Quick integration pattern:**
```python
import asyncio
from miroflow import ResearchAgent

async def analyze_market():
    agent = ResearchAgent(model="gpt-4")
    
    result = await agent.research(
        query="What are the top AI funding trends in 2025?",
        max_steps=10,
        timeout=300
    )
    
    return result.synthesis
```

## Key Differences from Other Frameworks

| Feature | MiroFlow | Nucleus | Kimi |
|---|---|---|---|
| Research focus | ✓ Specialized | General orchestration | General chat |
| Benchmarked | ✓ SOTA on 5+ benchmarks | Custom metrics | Claimed SOTA |
| Open-source model | ✓ MiroThinker | Custom | Closed |
| Multi-agent orchestration | ✓ Hierarchical | Flat | Limited |
| Future prediction | ✓ #1 FutureX ranking | Not specialized | Not specialized |

## References

- **GitHub**: https://github.com/MiroMindAI/MiroFlow
- **Paper**: MiroThinker (arXiv:2511.11793)
- **Benchmarks**: FutureX, GAIA, HLE, BrowserComp, xBench-DeepSearch
- **Community**: Discord (discussions), GitHub Issues

---

**Use Case for Ecosystem:** MiroFlow provides specialized research agent framework for complex multi-step reasoning tasks. Use as specialized research backend alongside Nucleus (orchestration) and Kimi (general tasks). Pipeline: MiroFlow research → Nucleus content generation → carousel/video delivery. Enables research-to-content conversion for marketing, business intelligence, and knowledge synthesis workflows.
