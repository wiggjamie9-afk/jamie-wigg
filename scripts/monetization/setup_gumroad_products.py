#!/usr/bin/env python3
"""
Gumroad Product Automation Script
Batch-creates Gumroad products for all apps with metadata, pricing, and delivery links.
Requires: GUMROAD_TOKEN environment variable
"""

import json
import os
import sys
import requests
from pathlib import Path
from datetime import datetime
from typing import Optional

GUMROAD_API_URL = "https://api.gumroad.com/v2"
RESULTS_DIR = Path(__file__).parent.parent.parent / "results" / "gumroad"

# App metadata indexed by app name
APPS_METADATA = {
    # Buddy Apps (Motivation/Support)
    "motivation-expert": {
        "name": "Motivation Expert",
        "description": "Daily Cheerleader AI Buddy - Daily motivation, affirmations, and personalized encouragement for goal achievement.",
        "price": 2.99,
        "category": "Motivation",
        "tier": "starter",
        "delivery_format": "url",
    },
    "meditation-buddy": {
        "name": "Meditation Buddy",
        "description": "AI-guided meditation, breathing exercises, and mindfulness coaching personalized to your stress levels.",
        "price": 2.99,
        "category": "Wellness",
        "tier": "starter",
    },
    "habit-buddy": {
        "name": "Habit Builder Buddy",
        "description": "Track habits, build streaks, and get daily AI encouragement to stay consistent.",
        "price": 2.99,
        "category": "Productivity",
        "tier": "starter",
    },
    "math-helper": {
        "name": "Math Helper AI",
        "description": "Step-by-step math tutoring with AI explanations for algebra, geometry, calculus and more.",
        "price": 3.99,
        "category": "Learning",
        "tier": "starter",
    },
    "english-pocket": {
        "name": "English Pocket",
        "description": "English grammar tutor, vocabulary builder, and writing feedback from AI.",
        "price": 2.99,
        "category": "Learning",
        "tier": "starter",
    },
    "language-lens": {
        "name": "Language Lens",
        "description": "AI language translator with pronunciation guide and cultural context for 50+ languages.",
        "price": 4.99,
        "category": "Learning",
        "tier": "starter",
    },
    "period-tracker": {
        "name": "Period Tracker Pro",
        "description": "AI-powered period tracking with predictions, mood logging, and health insights.",
        "price": 1.99,
        "category": "Health",
        "tier": "starter",
    },
    "weight-tracker": {
        "name": "Weight Tracker",
        "description": "Track weight trends, log meals, and get AI coaching for sustainable weight management.",
        "price": 2.99,
        "category": "Health",
        "tier": "starter",
    },
    "calorie-counter": {
        "name": "Calorie Counter AI",
        "description": "Smart food logging with AI nutrition analysis and personalized meal suggestions.",
        "price": 3.99,
        "category": "Health",
        "tier": "starter",
    },
    "water-tracker": {
        "name": "Hydration Tracker",
        "description": "Track daily water intake with smart reminders and hydration health insights.",
        "price": 0.99,
        "category": "Health",
        "tier": "starter",
    },
    "meditation-guide": {
        "name": "Meditation Guide",
        "description": "Guided meditations with AI voice personalization and progress tracking.",
        "price": 2.99,
        "category": "Wellness",
        "tier": "starter",
    },
    "mood-journal": {
        "name": "Mood Journal AI",
        "description": "Daily mood tracking journal with AI sentiment analysis and emotional pattern insights.",
        "price": 1.99,
        "category": "Wellness",
        "tier": "starter",
    },
    "daily-planner": {
        "name": "Daily Planner",
        "description": "AI-powered task planner with smart scheduling and productivity insights.",
        "price": 2.99,
        "category": "Productivity",
        "tier": "starter",
    },
    "pomodoro-timer": {
        "name": "Pomodoro Focus Timer",
        "description": "Pomodoro timer with AI productivity coaching and break recommendations.",
        "price": 0.99,
        "category": "Productivity",
        "tier": "starter",
    },
    "fitness-coach": {
        "name": "Fitness Coach AI",
        "description": "Personalized workout plans with form feedback and progress tracking.",
        "price": 3.99,
        "category": "Fitness",
        "tier": "starter",
    },
    "goal-tracker": {
        "name": "Goal Tracker Pro",
        "description": "Set, track, and achieve goals with AI coaching and milestone celebrations.",
        "price": 2.99,
        "category": "Productivity",
        "tier": "starter",
    },
}


def get_gumroad_token() -> str:
    """Get Gumroad API token from environment."""
    token = os.getenv("GUMROAD_TOKEN")
    if not token:
        print("❌ Error: GUMROAD_TOKEN environment variable not set")
        print("   Get your token at: https://gumroad.com/settings/creator")
        sys.exit(1)
    return token


def create_product(
    token: str,
    name: str,
    description: str,
    price: float,
    permalink: Optional[str] = None,
) -> dict:
    """Create a Gumroad product."""
    url = f"{GUMROAD_API_URL}/products"

    params = {
        "access_token": token,
        "name": name,
        "description": description,
        "price": int(price * 100),  # Gumroad uses cents
        "currency": "usd",
    }

    if permalink:
        params["url"] = permalink

    response = requests.post(url, data=params)
    response.raise_for_status()
    return response.json()


def setup_delivery(token: str, product_id: str, delivery_url: str) -> dict:
    """Set up URL delivery for a product."""
    url = f"{GUMROAD_API_URL}/products/{product_id}/properties"

    params = {
        "access_token": token,
        "file_url": delivery_url,
    }

    response = requests.post(url, data=params)
    response.raise_for_status()
    return response.json()


def batch_create_products(token: str, limit: Optional[int] = None) -> list:
    """Create all products from metadata."""
    results = []
    apps = list(APPS_METADATA.items())

    if limit:
        apps = apps[:limit]

    print(f"\n📦 Creating {len(apps)} Gumroad products...")
    print("=" * 60)

    for idx, (slug, metadata) in enumerate(apps, 1):
        try:
            print(f"\n[{idx}/{len(apps)}] Creating: {metadata['name']}")

            # Create the product
            response = create_product(
                token,
                metadata["name"],
                metadata["description"],
                metadata["price"],
                permalink=slug,
            )

            if response["success"]:
                product = response["product"]
                result = {
                    "slug": slug,
                    "name": metadata["name"],
                    "gumroad_id": product["id"],
                    "url": product["url"],
                    "share_url": f"https://gumroad.com/{product['creator']['username']}/{slug}",
                    "price": metadata["price"],
                    "category": metadata["category"],
                    "tier": metadata["tier"],
                    "created_at": datetime.now().isoformat(),
                }

                results.append(result)
                print(f"   ✅ Created: {result['share_url']}")
            else:
                print(f"   ⚠️  API error: {response.get('message', 'Unknown error')}")

        except Exception as e:
            print(f"   ❌ Error: {str(e)}")

    return results


def save_results(results: list) -> str:
    """Save results to JSON file."""
    RESULTS_DIR.mkdir(parents=True, exist_ok=True)

    output_file = RESULTS_DIR / f"products_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"

    with open(output_file, "w") as f:
        json.dump(results, f, indent=2)

    # Also update the latest link
    latest_file = RESULTS_DIR / "products_latest.json"
    with open(latest_file, "w") as f:
        json.dump(results, f, indent=2)

    return str(output_file)


def main():
    """Main entry point."""
    print("\n🚀 Gumroad Product Batch Creator")
    print("=" * 60)

    # Get token
    token = get_gumroad_token()
    print(f"✅ Token loaded")

    # Parse args
    limit = None
    if len(sys.argv) > 1:
        try:
            limit = int(sys.argv[1])
            print(f"📌 Creating first {limit} products only")
        except ValueError:
            pass

    # Create products
    results = batch_create_products(token, limit)

    # Save results
    output_file = save_results(results)

    # Summary
    print("\n" + "=" * 60)
    print(f"✅ SUCCESS: Created {len(results)} products")
    print(f"📁 Results saved to: {output_file}")
    print(f"💰 Total revenue potential: ${sum(r['price'] for r in results):.2f}/sale")
    print("\n📊 Products by category:")

    categories = {}
    for result in results:
        cat = result["category"]
        categories[cat] = categories.get(cat, 0) + 1

    for cat, count in sorted(categories.items()):
        print(f"   • {cat}: {count} products")

    print("\n💡 Next steps:")
    print("   1. Set delivery URLs in Gumroad UI for each product")
    print("   2. Create affiliate links for promotion")
    print("   3. Add products to a Gumroad collection for better UX")
    print("   4. Set up email capture (License key on purchase)")


if __name__ == "__main__":
    main()
