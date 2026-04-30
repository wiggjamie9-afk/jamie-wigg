"""Multi-agent pipeline: research -> write -> deliver.

Three Claude calls hand off to each other:
  1. Researcher uses the server-side web_search tool to gather sources.
  2. Writer turns that into a polished short report.
  3. Delivery step saves the report locally (stand-in for Slack).
"""

from __future__ import annotations

import argparse
import datetime as dt
import pathlib
import sys

import anthropic

MODEL = "claude-opus-4-7"
OUTPUT_DIR = pathlib.Path(__file__).parent / "reports"


def extract_text(message: anthropic.types.Message) -> str:
    return "\n".join(b.text for b in message.content if b.type == "text").strip()


def research(client: anthropic.Anthropic, topic: str) -> str:
    print(f"[1/3] researcher: gathering sources on {topic!r}", file=sys.stderr)
    message = client.messages.create(
        model=MODEL,
        max_tokens=8000,
        thinking={"type": "adaptive"},
        system=(
            "You are a research analyst. Use the web_search tool to find "
            "3-5 high-quality, recent sources on the user's topic. Return "
            "concise notes: key claims, supporting numbers, and the source "
            "URL for each. No commentary, just notes."
        ),
        tools=[{"type": "web_search_20260209", "name": "web_search", "max_uses": 5}],
        messages=[{"role": "user", "content": topic}],
    )
    return extract_text(message)


def write_report(client: anthropic.Anthropic, topic: str, notes: str) -> str:
    print("[2/3] writer: drafting report", file=sys.stderr)
    message = client.messages.create(
        model=MODEL,
        max_tokens=4000,
        thinking={"type": "adaptive"},
        system=(
            "You are an editor. Turn the researcher's notes into a tight "
            "300-400 word briefing in markdown. Lead with a one-sentence "
            "TL;DR, then 3-5 bullets of key findings, then a 'Sources' "
            "section with the URLs from the notes. No fluff."
        ),
        messages=[
            {
                "role": "user",
                "content": f"Topic: {topic}\n\nResearcher notes:\n{notes}",
            }
        ],
    )
    return extract_text(message)


def deliver(topic: str, report: str) -> pathlib.Path:
    print("[3/3] delivery: writing report to disk", file=sys.stderr)
    OUTPUT_DIR.mkdir(exist_ok=True)
    stamp = dt.datetime.now().strftime("%Y%m%d-%H%M%S")
    slug = "".join(c if c.isalnum() else "-" for c in topic.lower())[:40].strip("-")
    path = OUTPUT_DIR / f"{stamp}-{slug}.md"
    path.write_text(f"# {topic}\n\n{report}\n")
    return path


def run(topic: str) -> None:
    client = anthropic.Anthropic()
    notes = research(client, topic)
    report = write_report(client, topic, notes)
    path = deliver(topic, report)
    print(f"\nDone. Report saved to: {path}")
    print("\n--- preview ---")
    print(report)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("topic", help="What the agents should research and report on.")
    args = parser.parse_args()
    run(args.topic)
