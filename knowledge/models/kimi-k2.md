# Kimi K2: Open Agentic Intelligence

State-of-the-art mixture-of-experts (MoE) language model by Moonshot AI with 32B activated parameters and 1T total parameters. Specifically optimized for agentic capabilities, tool use, and reasoning.

## Update: Kimi K2.6 (latest)

**Kimi K2.6** is the newest revision — an **open-source, native multimodal agentic** model built for:
- **Long-horizon coding** — complex end-to-end engineering across front-end, DevOps, performance optimization, and full-stack workflows
- **Coding-driven design** — generating UI/design from code intent
- **Swarm-based task orchestration** — coordinating large groups of specialized agents to plan → implement → test → iterate on real coding tasks

Versus the base K2 documented below (text-centric agentic LLM), K2.6 adds **native multimodality** and is explicitly tuned for **multi-agent swarm coordination** on sustained engineering work. This maps directly onto two things already in this ecosystem: the **ruflo** swarm/hive-mind MCP and the **Nucleus/Mary** multi-agent orchestration loop — K2.6 is a candidate runtime for both. Model IDs/availability evolve on Moonshot's platform (https://platform.moonshot.ai); treat the specs below as the K2 baseline and expect K2.6 to match or exceed them with added vision + swarm tuning.

K2-family lineage in this knowledge base: **K2** (agentic base, below) → **K2.5** (the model behind Kimi's production agents, see `kimi-agent-internals.md`) → **K2.6** (native multimodal + swarm). The autonomous writer (`kimi-k2-thinking`) and KimiK2Manim both ride on this family.

## Model Specifications (K2 baseline)

| Property | Value |
|----------|-------|
| Architecture | Mixture-of-Experts (MoE) |
| Total Parameters | 1T (1 trillion) |
| Activated Parameters | 32B (32 billion) |
| Layers | 61 (including 1 dense layer) |
| Attention Heads | 64 |
| Context Length | 128K tokens |
| Vocabulary Size | 160K |
| Attention Mechanism | MLA (Multi-head Latent Attention) |
| Activation | SwiGLU |
| Training | 15.5T tokens with Muon optimizer |
| Optimization | MuonClip (novel scaling technique) |

## Model Variants

**Kimi-K2-Base**
- Foundation model for fine-tuning
- Full control for researchers/builders
- Strong baseline performance

**Kimi-K2-Instruct**
- Post-trained for chat and agentic tasks
- Drop-in general-purpose chat
- Optimized for tool use

## Key Performance Metrics

### Coding Tasks
- **LiveCodeBench** — 53.7% pass@1 (vs GPT-4.1: 44.7%)
- **SWE-bench Verified** — 65.8% single attempt (agentic)
- **MultiPL-E** — 85.7% pass@1
- **OJBench** — 27.1% pass@1

### Tool Use & Reasoning
- **Tau2 (retail)** — 70.6 avg@4
- **Tau2 (airline)** — 56.5 avg@4
- **AceBench** — 76.5% accuracy

### Math & STEM
- **AIME 2024** — 69.6 avg@64
- **MATH-500** — 97.4% accuracy
- **HMMT 2025** — 38.8 avg@32
- **GPQA-Diamond** — 75.1 avg@8

### General Knowledge
- **MMLU** — 89.5% (instruction), 87.8% (base)
- **MMLU-Pro** — 81.1% (instruction)
- **IFEval** — 89.8% prompt strict

## API & Deployment

**Official Platform**
- https://platform.moonshot.ai
- OpenAI/Anthropic-compatible API
- Temperature mapping: `real_temperature = request_temperature * 0.6`

**Recommended Inference Engines**
- vLLM
- SGLang
- KTransformers
- TensorRT-LLM

**Model Format**
- Block-fp8 quantization
- Available on Hugging Face
- Optimized for efficient deployment

## Tool-Calling Capabilities

Kimi K2 has native tool-calling support:

```python
tools = [{
    "type": "function",
    "function": {
        "name": "function_name",
        "description": "What the tool does",
        "parameters": {
            "type": "object",
            "required": ["param1"],
            "properties": {...}
        }
    }
}]

# Agent auto-decides when/how to call tools
response = client.chat.completions.create(
    model="kimi-k2-instruct",
    messages=messages,
    tools=tools,
    tool_choice="auto",
    temperature=0.6
)
```

## Temperature Recommendations

- **Instruction model** — temperature = 0.6 (optimized)
- **Base model** — temperature = 1.0
- **Reasoning tasks** — temperature = 0.6
- **Creative tasks** — temperature = 0.8+

## Use Cases

1. **Code Generation & Analysis** — 65.8% on SWE-bench (beats Claude Opus 4)
2. **Tool Orchestration** — Native function calling, agentic loops
3. **Mathematical Reasoning** — 97.4% on MATH-500
4. **Multi-turn Problem Solving** — 128K context for complex tasks
5. **Multilingual Coding** — 47.3% on SWE-bench Multilingual

## Integration with Ecosystem

**Kimi K2 vs. Current Setup:**

| Feature | Kimi K2 | Current (Claude) |
|---------|---------|------------------|
| Agentic optimization | ✓ Specialized | General |
| Tool use | ✓ Native | Via JSON |
| Cost | Lower | Higher |
| SWE-bench | 65.8% | ~72% |
| Code speed | Very fast | Standard |
| Chinese support | ✓ Excellent | Good |
| MoE efficiency | ✓ 32B active | N/A |

**Recommendation:** Kimi K2 is ideal for:
- Autonomous agent loops (Mary agent alternative)
- High-volume code generation
- Cost-optimized deployments
- Tool-heavy orchestration

## References

- **Paper:** https://arxiv.org/abs/2507.20534
- **GitHub:** https://github.com/MoonshotAI/Kimi-K2
- **API Platform:** https://platform.moonshot.ai
- **Hugging Face:** Kimi K2 model weights
- **Creator:** Moonshot AI

## Citation

```bibtex
@misc{kimiteam2025kimik2openagentic,
  title={Kimi K2: Open Agentic Intelligence},
  author={Kimi Team and ...},
  year={2025},
  eprint={2507.20534},
  archivePrefix={arXiv},
  primaryClass={cs.LG}
}
```

---

**Use Case for Nucleus:** Kimi K2 can replace or augment Pydantic AI as Mary agent's runtime, providing better tool use, agentic optimization, and cost efficiency for video/carousel generation pipelines.
