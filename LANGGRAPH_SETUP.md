# LangGraph — Stateful Agent Framework

LangGraph is a production-grade framework for building autonomous agents with durable execution, human oversight, persistent memory, and comprehensive debugging.

## Installation

LangGraph is already installed globally.

### On Your Mac

```bash
# Install LangGraph
pip install langgraph langsmith langgraph-cli

# Verify
python3 -c "import langgraph; print('LangGraph installed')"
```

## Quick Start

### Basic Agent with State

Create `event_agent.py`:

```python
from langgraph.graph import StateGraph, START, END
from langchain_anthropic import ChatAnthropic
from typing import TypedDict

class AgentState(TypedDict):
    event_title: str
    event_date: str
    location: str
    description: str
    status: str

def create_event_node(state: AgentState) -> AgentState:
    """Create event in database."""
    # Call your API
    state["status"] = "created"
    return state

def validate_event_node(state: AgentState) -> AgentState:
    """Validate event data."""
    if not state["event_title"]:
        state["status"] = "validation_failed"
    else:
        state["status"] = "validated"
    return state

def generate_image_node(state: AgentState) -> AgentState:
    """Generate promotional image."""
    # Call asset generation API
    state["status"] = "image_generated"
    return state

# Build the graph
builder = StateGraph(AgentState)

# Add nodes
builder.add_node("validate", validate_event_node)
builder.add_node("create", create_event_node)
builder.add_node("image", generate_image_node)

# Add edges
builder.add_edge(START, "validate")
builder.add_edge("validate", "create")
builder.add_edge("create", "image")
builder.add_edge("image", END)

# Compile
graph = builder.compile()

# Run
initial_state = {
    "event_title": "Python Workshop",
    "event_date": "2026-06-20",
    "location": "Downtown Park",
    "description": "Learn Python basics",
    "status": "pending"
}

result = graph.invoke(initial_state)
print(result)
```

Run it:

```bash
python3 event_agent.py
```

## Core Concepts

### 1. State
Shared data structure that flows through the agent:

```python
class EventState(TypedDict):
    events: list[dict]          # Main data
    errors: list[str]           # Error log
    current_step: int           # Progress
    validated: bool             # Status
```

### 2. Nodes
Functions that process state:

```python
def process_events(state: EventState) -> EventState:
    # Modify state
    state["current_step"] += 1
    return state
```

### 3. Edges
Connections between nodes:

```python
builder.add_edge("step1", "step2")          # Always go to step2
builder.add_conditional_edges("step1", ...)  # Conditional routing
```

### 4. Conditional Logic
Route based on state:

```python
def should_retry(state: EventState):
    if state["errors"]:
        return "retry"
    return "success"

builder.add_conditional_edges("process", should_retry)
```

## Complex Workflows

### Event Processing Pipeline

```python
from langgraph.graph import StateGraph, START, END
from typing import TypedDict, Literal

class EventProcessState(TypedDict):
    events: list[dict]
    processed: list[dict]
    failed: list[dict]
    current_idx: int
    total: int

def fetch_events(state: EventProcessState):
    """Fetch events from API."""
    state["total"] = len(state["events"])
    state["current_idx"] = 0
    return state

def process_event(state: EventProcessState):
    """Process single event."""
    if state["current_idx"] < state["total"]:
        event = state["events"][state["current_idx"]]
        
        try:
            # Generate image
            # Create preview
            # Validate data
            state["processed"].append(event)
        except Exception as e:
            state["failed"].append({
                "event": event,
                "error": str(e)
            })
        
        state["current_idx"] += 1
    
    return state

def should_continue(state: EventProcessState) -> Literal["process", "complete"]:
    """Check if more events to process."""
    if state["current_idx"] < state["total"]:
        return "process"
    return "complete"

def complete(state: EventProcessState):
    """Finalize processing."""
    print(f"Processed: {len(state['processed'])}")
    print(f"Failed: {len(state['failed'])}")
    return state

# Build graph
builder = StateGraph(EventProcessState)
builder.add_node("fetch", fetch_events)
builder.add_node("process", process_event)
builder.add_node("complete", complete)

builder.add_edge(START, "fetch")
builder.add_edge("fetch", "process")
builder.add_conditional_edges("process", should_continue)
builder.add_edge("complete", END)

graph = builder.compile()

# Run
initial_state = {
    "events": [...],
    "processed": [],
    "failed": [],
    "current_idx": 0,
    "total": 0
}

result = graph.invoke(initial_state)
```

## Human-in-the-Loop

Pause for user approval:

```python
from langgraph.graph import StateGraph
from langgraph.types import interrupt

def requires_approval(state: EventProcessState):
    """Pause for human review."""
    if state["total"] > 100:
        interrupt("Too many events. Review and approve?")
    return state

# In your code:
result = graph.invoke(initial_state)
# Returns with human_approval required

# After human approval:
result = graph.invoke(result)  # Resumes from pause point
```

## Persistent Memory

Store and restore state:

```python
import json

def save_state(state: EventProcessState, filename: str):
    """Save state to file."""
    with open(filename, 'w') as f:
        json.dump(state, f)

def load_state(filename: str) -> EventProcessState:
    """Load state from file."""
    with open(filename, 'r') as f:
        return json.load(f)

# Pause and resume
result = graph.invoke(initial_state)
save_state(result, "event_processing.json")

# Later...
resumed_state = load_state("event_processing.json")
result = graph.invoke(resumed_state)  # Continue from saved point
```

## Debugging with LangSmith

Enable debugging:

```bash
export LANGSMITH_API_KEY=your-key
export LANGSMITH_TRACING=true
export LANGSMITH_PROJECT="event-platform"
```

Then view traces at https://smith.langchain.com

Your agent execution will appear with:
- Full state history
- Node execution order
- Timing information
- Errors and exceptions
- Human interactions

```python
from langsmith import Client

client = Client()

# Your code runs with automatic tracing...
result = graph.invoke(initial_state)

# Check traces in LangSmith dashboard
```

## Comparison: OpenHands vs LangGraph

| Aspect | OpenHands | LangGraph |
|--------|-----------|-----------|
| **State Management** | Implicit | Explicit TypedDict |
| **Debugging** | Basic | Advanced (LangSmith) |
| **Human Loop** | Limited | Full support with interrupts |
| **Persistence** | Basic | Full state snapshots |
| **Complexity** | Medium | High (more control) |
| **Best For** | Quick tasks | Long-running agents |

**Use OpenHands for:** Quick autonomous workflows
**Use LangGraph for:** Complex, long-running, stateful agents

## Integration with Event Platform

### Create Advanced Event Processor

```python
# event_platform/advanced_agent.py
from langgraph.graph import StateGraph
from event_platform.agent_tools import create_event, generate_assets
import asyncio

class EventBatchState(TypedDict):
    raw_descriptions: list[str]
    events: list[dict]
    assets: dict
    summary: dict

async def parse_descriptions(state: EventBatchState):
    """Parse natural language descriptions."""
    # Use Claude to understand descriptions
    # Extract structured event data
    state["events"] = [...]
    return state

async def create_events(state: EventBatchState):
    """Bulk create events."""
    for event in state["events"]:
        result = create_event(event)
        event["id"] = result["id"]
    return state

async def generate_all_assets(state: EventBatchState):
    """Parallel asset generation."""
    tasks = []
    for event in state["events"]:
        task = generate_assets(event["title"], event["description"])
        tasks.append(task)
    
    results = await asyncio.gather(*tasks)
    state["assets"] = {
        event["id"]: asset 
        for event, asset in zip(state["events"], results)
    }
    return state

def summarize(state: EventBatchState):
    """Create summary report."""
    state["summary"] = {
        "total_events": len(state["events"]),
        "assets_generated": len(state["assets"]),
        "success_rate": "100%"
    }
    return state

# Build graph
builder = StateGraph(EventBatchState)
builder.add_node("parse", parse_descriptions)
builder.add_node("create", create_events)
builder.add_node("assets", generate_all_assets)
builder.add_node("summarize", summarize)

builder.add_edge(START, "parse")
builder.add_edge("parse", "create")
builder.add_edge("create", "assets")
builder.add_edge("assets", "summarize")
builder.add_edge("summarize", END)

graph = builder.compile()

# Run with descriptions
initial = {
    "raw_descriptions": [
        "Python workshop downtown next Friday 6 PM",
        "Art exhibition opening Saturday evening",
        "Running club meetup Sunday morning"
    ],
    "events": [],
    "assets": {},
    "summary": {}
}

result = graph.invoke(initial)
print(result["summary"])
```

## Resources

- **Docs**: https://langchain-ai.github.io/langgraph/
- **API Ref**: https://langchain-ai.github.io/langgraph/reference/
- **Tutorial**: https://langchain-ai.github.io/langgraph/tutorials/
- **LangSmith**: https://smith.langchain.com
- **Community**: https://discord.gg/langchain

## Next Steps

1. Install LangSmith for debugging:
   ```bash
   pip install langsmith
   ```

2. Set API key:
   ```bash
   export LANGSMITH_API_KEY=your-key
   ```

3. Create your first stateful agent
4. View traces in LangSmith dashboard
5. Iterate and improve based on execution traces

---

LangGraph + OpenHands + Aider + Hermes = complete agent development stack.
