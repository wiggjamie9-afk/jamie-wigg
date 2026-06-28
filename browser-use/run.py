#!/usr/bin/env python3
"""Browser Use runner — describe a web task in plain English, an AI drives a real browser to do it.

Usage:
    browser-use/.venv/bin/python browser-use/run.py "go to example.com and tell me the main heading"

Or via the wrapper:
    ./browser-use/browser-use "go to news.ycombinator.com and list the top 3 story titles"

Requires an AI key (the "brain" that decides what to click):
    export ANTHROPIC_API_KEY=sk-ant-...

Optional overrides:
    export BROWSER_USE_MODEL=claude-sonnet-4-6        # which AI model to use
    export BROWSER_USE_HEADLESS=false                 # show the browser (needs a display; default headless)
    export BROWSER_USE_CHROMIUM=/path/to/chrome       # default: container's pre-installed Chromium
"""
import asyncio
import os
import sys

from browser_use import Agent, Browser, ChatAnthropic

CHROMIUM = os.environ.get("BROWSER_USE_CHROMIUM", "/opt/pw-browsers/chromium")
MODEL = os.environ.get("BROWSER_USE_MODEL", "claude-sonnet-4-6")
HEADLESS = os.environ.get("BROWSER_USE_HEADLESS", "true").lower() != "false"


async def main() -> int:
    task = " ".join(sys.argv[1:]).strip()
    if not task:
        print(
            'Give me a task, e.g.:\n'
            '  run.py "go to news.ycombinator.com and list the top 3 story titles"',
            file=sys.stderr,
        )
        return 2
    if not os.environ.get("ANTHROPIC_API_KEY"):
        print(
            "ANTHROPIC_API_KEY is not set.\n"
            "Get a key at https://console.anthropic.com/ then run:\n"
            "  export ANTHROPIC_API_KEY=sk-ant-...",
            file=sys.stderr,
        )
        return 2

    llm = ChatAnthropic(model=MODEL)
    browser = Browser(
        # Use the container's pre-installed Chromium if present; else let browser-use find one.
        executable_path=CHROMIUM if os.path.exists(CHROMIUM) else None,
        headless=HEADLESS,
        chromium_sandbox=False,  # required when running inside a container / as root
    )

    agent = Agent(task=task, llm=llm, browser=browser)
    history = await agent.run()

    result = history.final_result()
    print("\n=== RESULT ===")
    print(result if result else "(no text result — see the step log above)")
    return 0


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main()))
