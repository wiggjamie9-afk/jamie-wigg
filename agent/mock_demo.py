"""Run the self-review agent with a fake LLM. No API key required.

Demonstrates the graph flow (generate -> review -> loop or end). The responses
are canned, so the output is illustrative, not real Claude output.
"""

from __future__ import annotations

import os
import sys

os.environ.setdefault("ANTHROPIC_API_KEY", "demo-key-not-real")

# Patch ChatAnthropic before self_review_agent imports it.
import langchain_anthropic


class FakeResponse:
    def __init__(self, content: str):
        self.content = content


class FakeLLM:
    """Returns canned responses based on what the prompt looks like."""

    def __init__(self, *args, **kwargs):
        self.calls = 0

    def invoke(self, messages):
        prompt = messages[0].content
        self.calls += 1

        if "first line, reply with exactly one word" in prompt:
            if self.calls <= 2:
                return FakeResponse(
                    "REVISE\nThe draft is too terse. Add a concrete example using "
                    "a dartboard analogy and clarify why both metrics matter."
                )
            return FakeResponse("APPROVED\nClear, well-illustrated, and accurate.")

        if "previous draft received this reviewer feedback" in prompt:
            return FakeResponse(
                "Accuracy is how close a measurement is to the true value; precision "
                "is how close repeated measurements are to each other.\n\n"
                "Imagine a dartboard. Tight cluster on the bullseye = accurate AND "
                "precise. Tight cluster off-center = precise but inaccurate. Spread "
                "around the bullseye = accurate on average but imprecise. Spread "
                "off-center = neither.\n\n"
                "Both matter: precision without accuracy is a reliable wrong answer; "
                "accuracy without precision is a noisy right answer."
            )

        return FakeResponse(
            "Accuracy is closeness to the true value. "
            "Precision is closeness of repeated measurements to each other."
        )


langchain_anthropic.ChatAnthropic = FakeLLM

import self_review_agent  # noqa: E402

self_review_agent.llm = FakeLLM()

if __name__ == "__main__":
    sys.argv = ["mock_demo.py", "the difference between accuracy and precision"]
    sys.exit(self_review_agent.main())
