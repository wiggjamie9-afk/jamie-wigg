#!/usr/bin/env python3
"""Tools for OpenHands agent to interact with event platform."""

import requests
import json
from typing import Optional, Dict, Any
from dataclasses import dataclass

# Configuration
API_BASE = "http://localhost:3000/api"
DEFAULT_TIMEOUT = 30


@dataclass
class Event:
    """Event data structure."""
    title: str
    date: str
    time: str
    location: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    description: Optional[str] = None
    image_url: Optional[str] = None


def create_event(event: Event) -> Dict[str, Any]:
    """Create a new event via API."""
    payload = {
        "title": event.title,
        "date": event.date,
        "time": event.time,
        "location": event.location,
        "latitude": event.latitude,
        "longitude": event.longitude,
        "description": event.description,
        "image_url": event.image_url,
    }

    # Remove None values
    payload = {k: v for k, v in payload.items() if v is not None}

    response = requests.post(
        f"{API_BASE}/events",
        json=payload,
        timeout=DEFAULT_TIMEOUT
    )
    response.raise_for_status()
    return response.json()


def search_events(query: str, limit: int = 10) -> Dict[str, Any]:
    """Search events using semantic search."""
    payload = {
        "query": query,
        "limit": limit,
    }

    response = requests.post(
        f"{API_BASE}/search-events",
        json=payload,
        timeout=DEFAULT_TIMEOUT
    )
    response.raise_for_status()
    return response.json()


def get_events(limit: int = 50) -> Dict[str, Any]:
    """Fetch all events."""
    response = requests.get(
        f"{API_BASE}/events?limit={limit}",
        timeout=DEFAULT_TIMEOUT
    )
    response.raise_for_status()
    return response.json()


def update_event(event_id: str, updates: Dict[str, Any]) -> Dict[str, Any]:
    """Update an event."""
    response = requests.patch(
        f"{API_BASE}/events/{event_id}",
        json=updates,
        timeout=DEFAULT_TIMEOUT
    )
    response.raise_for_status()
    return response.json()


def delete_event(event_id: str) -> Dict[str, Any]:
    """Delete an event."""
    response = requests.delete(
        f"{API_BASE}/events/{event_id}",
        timeout=DEFAULT_TIMEOUT
    )
    response.raise_for_status()
    return response.json()


def generate_assets(
    title: str,
    description: str,
    generator: str = "replicate"
) -> Dict[str, Any]:
    """Generate event assets (image, script)."""
    payload = {
        "title": title,
        "description": description,
        "generator": generator,
    }

    response = requests.post(
        f"{API_BASE}/generate-event-assets",
        json=payload,
        timeout=60  # Assets can take longer
    )
    response.raise_for_status()
    return response.json()


def batch_create_events(events: list[Event]) -> list[Dict[str, Any]]:
    """Create multiple events."""
    results = []
    for event in events:
        try:
            result = create_event(event)
            results.append({
                "status": "success",
                "event": result
            })
        except Exception as e:
            results.append({
                "status": "error",
                "event": event.title,
                "error": str(e)
            })
    return results


def example_create_events():
    """Example: Create multiple events."""
    events = [
        Event(
            title="Python Workshop",
            date="2026-06-20",
            time="18:00",
            location="Downtown Park",
            description="Learn Python basics with hands-on exercises",
            latitude=40.7128,
            longitude=-74.0060
        ),
        Event(
            title="Art Exhibition Opening",
            date="2026-06-22",
            time="19:00",
            location="Central Gallery",
            description="Local artists showcase their latest work",
            latitude=40.7580,
            longitude=-73.9855
        ),
    ]

    print("Creating events...")
    results = batch_create_events(events)

    for result in results:
        print(f"\n{result['status'].upper()}: {result.get('event', {}).get('title', 'Unknown')}")
        if result['status'] == 'error':
            print(f"  Error: {result['error']}")
        else:
            print(f"  ID: {result['event'].get('id')}")


def example_search_events():
    """Example: Search for events."""
    queries = [
        "tech workshop downtown",
        "art exhibition",
        "free community events",
    ]

    for query in queries:
        print(f"\nSearching for: '{query}'")
        results = search_events(query, limit=5)

        if results.get('results'):
            for event in results['results']:
                print(f"  - {event['title']} ({event['relevanceScore']}%)")
        else:
            print("  No results found")


if __name__ == "__main__":
    print("🛠️  Event Platform API Tools")
    print("=" * 50)

    try:
        print("\n1️⃣  Creating events...")
        example_create_events()

        print("\n" + "=" * 50)
        print("\n2️⃣  Searching events...")
        example_search_events()

        print("\n" + "=" * 50)
        print("\n✅ Examples complete!")

    except requests.exceptions.ConnectionError:
        print("\n❌ Error: Cannot connect to event platform API")
        print("   Make sure the dev server is running:")
        print("   cd ~/jamie-wigg-workspace/event-platform && npm run dev")
    except Exception as e:
        print(f"\n❌ Error: {e}")
