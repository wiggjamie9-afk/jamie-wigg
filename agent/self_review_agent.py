"""Self-reviewing agent: generate -> review -> revise loop, guarded by max iterations."""

from __future__ import annotations

import os
import sys
from typing import TypedDict

from langchain_anthropic import ChatAnthropic
from langchain_core.messages import HumanMessage
from langgraph.graph import END, StateGraph

MODEL = os.environ.get("CLAUDE_MODEL", "claude-sonnet-4-6")
MAX_ITERATIONS = int(os.environ.get("MAX_ITERATIONS", "3"))

llm = ChatAnthropic(model=MODEL, max_tokens=2048)


class AgentState(TypedDict):
    topic: str
    draft: str
    feedback: str
    approved: bool
    iterations: int


def generate(state: AgentState) -> dict:
    if state.get("feedback"):
        prompt = (
            f"Topic: {state['topic']}\n\n"
            f"A previous draft received this reviewer feedback:\n{state['feedback']}\n\n"
            f"Previous draft:\n{state['draft']}\n\n"
            "Produce a revised draft that addresses the feedback. Output only the draft."
        )
    else:
        prompt = f"Write a clear, concise draft on the following topic.\n\nTopic: {state['topic']}\n\nOutput only the draft."

    response = llm.invoke([HumanMessage(content=prompt)])
    return {
        "draft": response.content,
        "iterations": state.get("iterations", 0) + 1,
    }


def review(state: AgentState) -> dict:
    prompt = (
        f"You are a strict editor reviewing a draft on the topic: {state['topic']}\n\n"
        f"Draft:\n{state['draft']}\n\n"
        "On the first line, reply with exactly one word: APPROVED or REVISE.\n"
        "On the following lines, give specific, actionable feedback. Be concise."
    )
    response = llm.invoke([HumanMessage(content=prompt)])
    text = response.content.strip()
    return {"approved": text.upper().startswith("APPROVED"), "feedback": text}


def should_continue(state: AgentState) -> str:
    if state["approved"] or state["iterations"] >= MAX_ITERATIONS:
        return "end"
    return "generate"


def build_graph():
    g = StateGraph(AgentState)
    g.add_node("generate", generate)
    g.add_node("review", review)
    g.set_entry_point("generate")
    g.add_edge("generate", "review")
    g.add_conditional_edges("review", should_continue, {"generate": "generate", "end": END})
    return g.compile()


def main() -> int:
    if not os.environ.get("ANTHROPIC_API_KEY"):
        print("error: ANTHROPIC_API_KEY is not set", file=sys.stderr)
        return 1

    topic = " ".join(sys.argv[1:]).strip()
    if not topic:
        print("usage: python self_review_agent.py <topic>", file=sys.stderr)
        return 2

    agent = build_graph()
    result = agent.invoke({"topic": topic, "iterations": 0, "draft": "", "feedback": "", "approved": False})

    status = "APPROVED" if result["approved"] else f"STOPPED at max iterations ({MAX_ITERATIONS})"
    print(f"=== {status} after {result['iterations']} iteration(s) ===\n")
    print(result["draft"])
    print(f"\n=== Reviewer's final verdict ===\n{result['feedback']}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
