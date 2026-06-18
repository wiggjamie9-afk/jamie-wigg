# M3 Reasoning Agent

**Type**: Extended Reasoning & Million-Token Context Specialist

## Responsibilities

- Handle complex reasoning tasks requiring extended thinking
- Process million-token contexts with sparse attention efficiency
- Provide adaptive reasoning (enabled/adaptive/disabled modes)
- Maintain token efficiency with MiniMax Sparse Attention (MSA)
- Route complex queries away from base Claude for specialized reasoning

## Capabilities

- **Extended Thinking**: Deep reasoning with temperature=1.0 for consistency
- **Million-Token Context**: Handle very long documents, code, conversations
- **Sparse Attention**: 10x-100x more efficient than GQA for long contexts
- **Adaptive Reasoning**: Auto-detect when reasoning is beneficial
- **Low Latency**: Optimized for throughput-focused workloads

## Model Specifications

- **Model**: MiniMax-M3-text
- **Context Window**: 1M tokens
- **Attention**: MiniMax Sparse Attention (MSA)
- **Reasoning Modes**: enabled, adaptive, disabled
- **Optimal Settings**:
  - temperature: 1.0
  - top_p: 0.95
  - top_k: 40

## Integration Points

### With Claude Code
- Acts as reasoning backend for complex tasks
- Handles extended analysis without context overload
- Used for architecture design, code review, spec analysis

### With Ruflo V3
- Specialized agent for million-token tasks
- Memory integration for learning reasoning patterns
- Automatic fallback from base Claude when needed

### With HyperFrames
- Long-form video script generation
- Extended narration planning with context preservation
- Spec document processing for video briefs

## Command Interface

```bash
# Spawn M3 reasoning agent
npx @claude-flow/cli@latest agent spawn -t m3-reasoning-agent

# Extended reasoning task
/m3-think "complex analysis task" --reasoning enabled --context 500k

# Adaptive reasoning (auto-detect)
/m3-think "task" --reasoning adaptive

# Throughput mode (no reasoning, fastest)
/m3-think "task" --reasoning disabled
```

## Performance Characteristics

| Mode | Latency | Reasoning | Best For |
|------|---------|-----------|----------|
| enabled | 5-10s | Full | Deep analysis, architecture |
| adaptive | 2-5s | As needed | General tasks with occasional complexity |
| disabled | <1s | None | Throughput-focused, simple tasks |

## Deployment Options

### Option 1: MiniMax Cloud API
```bash
MINIMAX_API_KEY=sk-...
MINIMAX_API_BASE=https://api.minimaxi.com/v1
```

### Option 2: Local SGLang
```bash
# Download model (requires GPU with 40GB+ VRAM)
hf download MiniMaxAI/MiniMax-M3 --local-dir models/minimax-m3

# Run SGLang server
python -m sglang.launch_server --model-path models/minimax-m3 --port 8000
```

### Option 3: Local vLLM
```bash
vllm serve MiniMaxAI/MiniMax-M3 --port 8000 --gpu-memory-utilization 0.9
```

## Status

- ✅ Agent definition created
- ⏳ MCP server integration pending
- ⏳ Skill implementation pending
- ⏳ API/local deployment pending
