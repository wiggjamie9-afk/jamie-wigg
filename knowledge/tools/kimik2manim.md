# KimiK2Manim: Kimi K2 → Manim Animation Pipeline

Standalone Python package for generating Manim mathematical animations using the Kimi K2 thinking model from Moonshot AI. Agents build knowledge trees, enrich them with math/visual specifications, and compose narrative prompts for animation generation.

GitHub: https://github.com/HarleyCoops/KimiK2Manim  
License: MIT

## Overview

KimiK2Manim uses Kimi K2 (via Moonshot AI's OpenAI-compatible API) through a 4-stage agent pipeline that progressively enriches a knowledge tree until it contains everything needed to generate Manim animation code.

```
User Prompt → [Agent 1] → [Agent 2] → [Agent 3] → [Agent 4] → Manim Code
              Tree        Math        Visual      Narrative
```

## Agent Pipeline (4 Sequential Stages)

### Stage 1: Prerequisite Explorer
`KimiPrerequisiteExplorer`
- **Input**: User concept string (e.g., "pythagorean theorem")
- **Output**: KnowledgeNode tree with prerequisite structure
- Recursively explores prerequisite concepts via Kimi K2 reasoning
- Each node: `concept`, `depth`, `is_foundation`, `prerequisites[]`

### Stage 2: Mathematical Enricher
`KimiMathematicalEnricher`
- **Input**: KnowledgeNode tree from Stage 1
- **Output**: Math-enriched tree
- Uses `write_mathematical_content` tool for structured data:
```json
{
  "equations": ["a²+b²=c²", "c=√(a²+b²)"],
  "definitions": {"a": "leg", "b": "leg", "c": "hypotenuse"},
  "interpretation": "Geometric relationship in right triangles",
  "examples": ["3-4-5 triangle", "5-12-13 triangle"],
  "typical_values": {"3-4-5": "classic integer triangle"}
}
```

### Stage 3: Visual Designer
`KimiVisualDesigner`
- **Input**: Math-enriched tree from Stage 2
- **Output**: Visual-enriched tree with Manim specs
- Uses `design_visual_plan` tool:
```json
{
  "visual_description": "Right triangle with squares on each side",
  "color_scheme": "Blue, green, red for sides a, b, c",
  "animation_description": "Triangle draws itself, squares build outward",
  "transitions": "Fade in triangle first",
  "camera_movement": "Wide shot then zoom in",
  "duration": 15,
  "layout": "Center triangle with equation below"
}
```

### Stage 4: Narrative Composer
`KimiNarrativeComposer`
- **Input**: Fully enriched tree (math + visuals)
- **Output**: Complete verbose narrative prompt (2000+ words)
- Orders nodes topologically (foundations first)
- Uses `compose_narrative` tool:
```json
{
  "verbose_prompt": "2000+ word narrative with LaTeX, visuals, timing...",
  "concept_order": ["foundation1", "foundation2", "target_concept"],
  "total_duration": 45,
  "scene_count": 3
}
```

## Key Components

### KimiClient
OpenAI-compatible wrapper for Moonshot AI:
```python
from kimik2manim.kimi_client import KimiClient

client = KimiClient()  # base_url: https://api.moonshot.cn/v1
response = client.chat_completion(
    messages=[{"role": "user", "content": "Hello!"}],
    max_tokens=100
)
print(client.get_text_content(response))
```

Features:
- Tool calling support (OpenAI function calling schema)
- Automatic extraction of structured responses
- Fallback to text parsing if tool calls fail
- Detailed 401 auth troubleshooting
- Built-in verbose logging

### ToolAdapter
Converts tool definitions to natural language when tool calling is unavailable:
```python
from kimik2manim.tool_adapter import ToolAdapter

adapter = ToolAdapter()
instructions = adapter.tools_to_instructions([MATHEMATICAL_CONTENT_TOOL])
```
This allows the pipeline to work even if the API doesn't support function calling.

### KimiEnrichmentPipeline
Orchestrates the 3 enrichment agents:
```python
async def run_async(self, root: KnowledgeNode) -> EnrichmentResult:
    await self.math.enrich_tree(root)      # Stage 2
    await self.visual.design_tree(root)    # Stage 3
    narrative = await self.narrative.compose_async(root)  # Stage 4
    return EnrichmentResult(enriched_tree=root, narrative=narrative)
```

## Installation

**Python 3.13+ required** (for Kosong integration).

**Using uv (recommended):**
```bash
git clone https://github.com/HarleyCoops/KimiK2Manim.git
cd KimiK2Manim
uv python install 3.13
uv sync
uv run python your_script.py
```

**From source:**
```bash
pip install -r requirements.txt
# or
pip install -e .
```

**Dependencies:**
- `kosong>=0.21.0` — Official Moonshot AI agent abstraction layer
- `openai>=1.0.0` — OpenAI-compatible API client
- `python-dotenv>=1.0.0` — Environment variables

## Configuration

`.env` file:
```bash
MOONSHOT_API_KEY=your_api_key_here
KIMI_MODEL=kimi-k2-0905-preview       # Kimi K2 model
KIMI_USE_TOOLS=true                    # Enable tool calling
KIMI_ENABLE_THINKING=heavy             # heavy/medium/light/true/false
```

## Quick Start

**Build a knowledge tree:**
```python
from kimik2manim.agents.prerequisite_explorer_kimi import KimiPrerequisiteExplorer
import asyncio, json

async def main():
    explorer = KimiPrerequisiteExplorer(max_depth=3, use_tools=True)
    tree = await explorer.explore_async("quantum field theory", verbose=True)
    tree.print_tree()
    with open("tree.json", "w") as f:
        json.dump(tree.to_dict(), f, indent=2)

asyncio.run(main())
```

**Run enrichment pipeline:**
```python
from kimik2manim.agents.enrichment_chain import KimiEnrichmentPipeline

pipeline = KimiEnrichmentPipeline()
result = await pipeline.run_async(tree)
print(f"Narrative length: {len(result.narrative.verbose_prompt)} chars")
print(f"Total duration: {result.narrative.total_duration}s")
```

**CLI:**
```bash
python examples/run_enrichment_pipeline.py path/to/tree.json
```

## Kosong Integration (New)

Kosong is the official LLM abstraction layer from Moonshot AI. Provides:
- Unified `Message` structures
- Async tool orchestration (`kosong.step()`)
- Type-safe Pydantic tool models
- Provider abstraction
- Reduced boilerplate

```python
from agents.enrichment_chain_kosong import KosongMathematicalEnricher
from kosong.chat_provider.kimi import Kimi

kimi = Kimi(
    base_url="https://api.moonshot.ai/v1",
    api_key=os.getenv("MOONSHOT_API_KEY"),
    model="kimi-k2-turbo-preview",
)
enricher = KosongMathematicalEnricher(client=kimi)
enriched_tree = await enricher.enrich_tree(tree)
```

**Migration path:** Custom KimiClient (legacy) → Kosong abstraction (new). Both available; Kosong version in `agents/enrichment_chain_kosong.py`.

## Example Renderings

### Rhombicosidodecahedron (Archimedean Solid)
- 62 faces: 20 triangles, 30 squares, 12 pentagons
- 60 vertices via golden ratio coordinates, 120 edges
- Golden ratio constants from McCooey's data:
```python
C0 = (1 + √5) / 4
C1 = (3 + √5) / 4
C2 = (1 + √5) / 2  # Golden ratio φ
C3 = (5 + √5) / 4
C4 = (2 + √5) / 2
```
```bash
manim -pqh manim_scenes/epic_rhombicosidodecahedron.py EpicRhombicosidodecahedron
```

### Slow-Fast Network (1991 ULTRA)
Schmidhuber's Unnormalized Linear Transformer — predates 2017 Transformer by 26 years, scales O(n) not O(n²):
```
W = Σ(k_i ⊗ v_i) = Σ(k_i · v_i^T)
```
SLOW hypernetwork programs FAST network weights via additive outer products of KEY/VALUE vectors.

### Brownian Motion & Einstein's Heat Equation
2-minute educational animation:
- Mean squared displacement: ⟨x²(t)⟩ = 2Dt
- Diffusion equation: ∂P/∂t = D∇²P
- Einstein's relation: D = k_B T / (6πηa)
- Three scene variants: unbounded, bounded, managed (recommended)

### Harmonic Division Theorem
45-second projective geometry demo:
```
(A,B;C,D) = (AC·BD)/(BC·AD) = -1
```

## Frame Boundary Solution (Manim Utils)

Universal Manim rendering fixes in `manim_utils/`:
- `BoundedScene` — content stays within safe frame (12.78 × 7.2 units)
- `ManagedBoundedScene` — automatic text/equation lifecycle (recommended)
- Zone-based layout (separate vertical zones prevent overlaps)
- Automatic cleanup (old content fades out)

## E2B Sandbox Environment

Self-contained sandbox in `e2b_sandbox/` for exploring KimiK2 thinking + Manim:
```bash
cd e2b_sandbox
bash setup.sh
python interactive_explorer.py
python visual_reasoning_tests.py
python demo.py --demo all
```

**Interactive explorer:**
```python
from e2b_sandbox import quick_explore

result = await quick_explore(
    concept="quantum entanglement",
    thinking_mode="heavy",
    depth=3,
    enrichment=True
)
```

**Docker/E2B deployment:**
```bash
docker build -t kimik2-sandbox -f e2b_sandbox/e2b.Dockerfile .
docker run -it \
  -e MOONSHOT_API_KEY=sk-your-key \
  -v $(pwd)/output:/home/user/kimik2/output \
  -v $(pwd)/media:/home/user/kimik2/media \
  kimik2-sandbox
```

## Architecture (Layered)

1. **Client Layer** — KimiClient (legacy) or Kosong abstraction (new)
2. **Adapter Layer** — ToolAdapter (tool calls → verbose instructions)
3. **Agent Layer** — 4 sequential agents (tree building + enrichment)
4. **Orchestrator** — KimiEnrichmentPipeline coordinates 3 enrichment agents

Each agent processes the entire tree recursively before the next stage.

## Integration with Nucleus Ecosystem

KimiK2Manim complements the RHYTHMIX video pipeline:

| Pipeline | Output | Use Case |
|---|---|---|
| **HyperFrames** | HTML/GSAP promos | RHYTHMIX marketing videos |
| **KimiK2Manim** | Manim math animations | Educational/technical explainers |
| **Nucleus/Mary** | Carousels + orchestration | Multi-modal campaigns |

**Bridge pattern (educational content):**
```python
# Generate math animation narrative via KimiK2Manim
explorer = KimiPrerequisiteExplorer(max_depth=3)
tree = await explorer.explore_async("fourier transform")
pipeline = KimiEnrichmentPipeline()
result = await pipeline.run_async(tree)

# Feed narrative to Nucleus for promo wrapping
promo = await nucleus.generate_promo(
    narrative=result.narrative.verbose_prompt,
    style="educational_tech"
)
```

This enables a **research → math animation → marketing promo** content workflow, particularly powerful for technical product explainers (e.g., explaining RHYTHMIX's audio frequency math).

## For One-Person Builders

KimiK2Manim is ideal for:
- **Educational content** — Auto-generate math/science explainer animations
- **Technical marketing** — Visualize algorithms, formulas, concepts
- **Research visualization** — Convert papers into animated explanations
- **Course material** — Generate prerequisite-ordered lesson animations

Explore concepts like: `fourier transform`, `riemann hypothesis`, `quantum entanglement`, `general relativity`, `neural network backpropagation`.

## References

- **GitHub**: https://github.com/HarleyCoops/KimiK2Manim
- **Moonshot AI Platform**: https://platform.moonshot.cn
- **Kosong** (LLM abstraction): Official Moonshot AI agent framework
- **Manim**: https://www.manim.community

---

**Use Case for Ecosystem:** KimiK2Manim adds a programmatic mathematical-animation pipeline driven by Kimi K2's thinking mode. Pairs with HyperFrames (marketing promos) and Nucleus (orchestration) to extend the video stack into educational/technical explainer content — a research → math-animation → promo workflow. Cross-references `knowledge/models/kimi-k2.md` (the underlying model) and the RHYTHMIX video conventions in CLAUDE.md.
