#!/usr/bin/env python3
"""OpenHands agent for event platform automation."""

import os
import sys
from pathlib import Path

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent))

try:
    from openhands.core.main import Agent
    from openhands.core.logger import openhands_logger as logger
except ImportError:
    print("Error: OpenHands SDK not installed.")
    print("Install it with: pip install openhands-ai")
    print("Note: Requires Python 3.12+")
    sys.exit(1)


def run_event_creation_agent():
    """Run an OpenHands agent to create events."""

    print("🤖 Starting Event Platform Agent...")
    print("=" * 50)

    agent = Agent(
        model_name="claude-opus-4-1",
        api_key=None,  # Uses ANTHROPIC_API_KEY from environment
    )

    # Example task: Create events from natural language description
    task = """
    I need to create 3 community events for next weekend. Please:

    1. Create a "Python Workshop" event on June 20, 2026 at 6:00 PM
       Location: Downtown Park
       Description: Learn Python basics with hands-on exercises

    2. Create an "Art Exhibition Opening" event on June 22, 2026 at 7:00 PM
       Location: Central Gallery
       Description: Local artists showcase their latest work

    3. Create a "Running Club Meetup" on June 21, 2026 at 7:00 AM
       Location: Central Park
       Description: Weekly morning run for fitness enthusiasts

    For each event, also generate a relevant promotional image and
    ensure the event is properly saved to the database.
    """

    print(f"\n📝 Task:\n{task}\n")
    print("Processing... This may take a moment.\n")

    try:
        result = agent.run(task)
        print("\n✅ Agent Task Complete")
        print("=" * 50)
        print(f"Result: {result}")
        return result
    except Exception as e:
        print(f"\n❌ Error: {e}")
        raise


def run_search_agent():
    """Run an agent to search for events using natural language."""

    print("🔍 Starting Event Search Agent...")
    print("=" * 50)

    agent = Agent(model_name="claude-opus-4-1")

    task = """
    Search for upcoming community events that match these criteria:
    - Tech-related topics (workshops, meetups, conferences)
    - Happening this weekend or next week
    - Within reasonable distance (downtown area)

    For each event found, provide:
    1. Event name and date
    2. Relevance score (0-100%)
    3. Why it matches the search criteria
    4. Recommendation if the user might like it
    """

    print(f"\n🔎 Task:\n{task}\n")
    print("Searching... This may take a moment.\n")

    try:
        result = agent.run(task)
        print("\n✅ Search Complete")
        print("=" * 50)
        print(f"Results: {result}")
        return result
    except Exception as e:
        print(f"\n❌ Error: {e}")
        raise


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(
        description="OpenHands agent for event platform automation"
    )
    parser.add_argument(
        "--task",
        choices=["create", "search"],
        default="create",
        help="Task for the agent to perform"
    )

    args = parser.parse_args()

    # Check for API key
    if not os.getenv("ANTHROPIC_API_KEY"):
        print("⚠️  ANTHROPIC_API_KEY not set in environment")
        print("   Run: export ANTHROPIC_API_KEY=your-key-here")
        sys.exit(1)

    if args.task == "create":
        run_event_creation_agent()
    elif args.task == "search":
        run_search_agent()
