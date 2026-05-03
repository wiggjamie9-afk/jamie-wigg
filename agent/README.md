# Self-reviewing agent

Generate → review → revise loop using LangGraph and Claude. A reviewer node decides on each turn whether the draft is `APPROVED` or needs `REVISE`. The loop is guarded by `MAX_ITERATIONS` so a strict reviewer can't trigger an infinite cycle.

## Setup

```bash
cd agent
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
export ANTHROPIC_API_KEY=sk-ant-...
```

## Run

```bash
python self_review_agent.py "the difference between accuracy and precision"
```

Override the model or iteration cap via env vars:

```bash
CLAUDE_MODEL=claude-opus-4-7 MAX_ITERATIONS=5 python self_review_agent.py "<topic>"
```

## Graph

```
generate ──► review ──► (approved or max iterations) ──► END
                │
                └──► generate (with reviewer feedback in context)
```
