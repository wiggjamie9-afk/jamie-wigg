#!/usr/bin/env python3
"""
Multi-provider script generation for videos, social media, and events.
Supports OpenAI, Anthropic Claude, Replicate, and local models.
"""

import argparse
import os
import sys
import subprocess
from pathlib import Path


def check_dependencies():
    """Check and install required packages"""
    try:
        import requests
        return True
    except ImportError:
        print("Installing requests...")
        subprocess.run([sys.executable, "-m", "pip", "install", "requests", "-q"])
        return True


def generate_with_openai(prompt: str, script_type: str = "narration", api_key: str = None) -> str:
    """Generate script using OpenAI GPT"""
    if not api_key:
        api_key = os.getenv("OPENAI_API_KEY")

    if not api_key:
        print("❌ OPENAI_API_KEY not set. Get one at https://platform.openai.com/")
        return None

    try:
        from openai import OpenAI

        client = OpenAI(api_key=api_key)

        # Template prompts for different script types
        templates = {
            "narration": f"Write a compelling 60-second video narration script for: {prompt}",
            "social": f"Write engaging social media captions (3 variations, <280 chars each) for: {prompt}",
            "event-description": f"Write a compelling event description (200 words) for: {prompt}",
            "video-hook": f"Write 3 viral video hooks (10-15 seconds each) for: {prompt}",
            "product-pitch": f"Write a compelling 30-second product pitch script for: {prompt}",
        }

        system_prompt = "You are a professional copywriter and video script writer. Create engaging, concise scripts optimized for the specified medium."

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": templates.get(script_type, templates["narration"])},
            ],
            temperature=0.8,
            max_tokens=500,
        )

        return response.choices[0].message.content

    except Exception as e:
        print(f"❌ OpenAI error: {e}")
        return None


def generate_with_claude(prompt: str, script_type: str = "narration", api_key: str = None) -> str:
    """Generate script using Anthropic Claude"""
    if not api_key:
        api_key = os.getenv("ANTHROPIC_API_KEY")

    if not api_key:
        print("❌ ANTHROPIC_API_KEY not set. Get one at https://console.anthropic.com/")
        return None

    try:
        import anthropic

        client = anthropic.Anthropic(api_key=api_key)

        templates = {
            "narration": f"Write a compelling 60-second video narration script for: {prompt}",
            "social": f"Write engaging social media captions (3 variations, <280 chars each) for: {prompt}",
            "event-description": f"Write a compelling event description (200 words) for: {prompt}",
            "video-hook": f"Write 3 viral video hooks (10-15 seconds each) for: {prompt}",
            "product-pitch": f"Write a compelling 30-second product pitch script for: {prompt}",
        }

        message = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=500,
            messages=[
                {
                    "role": "user",
                    "content": templates.get(script_type, templates["narration"]),
                }
            ],
        )

        return message.content[0].text

    except Exception as e:
        print(f"❌ Claude error: {e}")
        return None


def generate_with_replicate(prompt: str, script_type: str = "narration", api_key: str = None) -> str:
    """Generate script using Replicate (local models, Mistral, etc.)"""
    if not api_key:
        api_key = os.getenv("REPLICATE_API_TOKEN")

    if not api_key:
        print("❌ REPLICATE_API_TOKEN not set. Get one at https://replicate.com/")
        return None

    try:
        import replicate

        # Map script types to prompts
        templates = {
            "narration": f"Write a compelling 60-second video narration script for: {prompt}",
            "social": f"Write engaging social media captions (3 variations, <280 chars each) for: {prompt}",
            "event-description": f"Write a compelling event description (200 words) for: {prompt}",
            "video-hook": f"Write 3 viral video hooks (10-15 seconds each) for: {prompt}",
            "product-pitch": f"Write a compelling 30-second product pitch script for: {prompt}",
        }

        print(f"🎬 Generating {script_type} script with Replicate...")

        client = replicate.Client(api_token=api_key)

        output = client.run(
            "mistralai/mixtral-8x7b-instruct-v0.1",
            input={
                "prompt": templates.get(script_type, templates["narration"]),
                "max_tokens": 500,
                "temperature": 0.8,
            }
        )

        return "".join(output) if isinstance(output, list) else str(output)

    except Exception as e:
        print(f"❌ Replicate error: {e}")
        return None


def generate_script(
    prompt: str,
    script_type: str = "narration",
    provider: str = "openai",
    output_path: str = None,
) -> bool:
    """
    Generate script from prompt using specified provider

    Args:
        prompt: Event name, product description, or script subject
        script_type: narration, social, event-description, video-hook, product-pitch
        provider: openai, claude, replicate
        output_path: Where to save the script
    """

    check_dependencies()

    script_types = [
        "narration",
        "social",
        "event-description",
        "video-hook",
        "product-pitch",
    ]

    if script_type not in script_types:
        print(f"❌ Unknown script type: {script_type}")
        print(f"   Supported: {', '.join(script_types)}")
        return False

    print(f"📝 Generating {script_type} with {provider}...")

    # Generate script based on provider
    if provider.lower() == "openai":
        script = generate_with_openai(prompt, script_type)
    elif provider.lower() == "claude":
        script = generate_with_claude(prompt, script_type)
    elif provider.lower() == "replicate":
        script = generate_with_replicate(prompt, script_type)
    else:
        print(f"❌ Unknown provider: {provider}")
        print("   Supported: openai, claude, replicate")
        return False

    if not script:
        return False

    # Save to file if path provided, otherwise print
    if output_path:
        output_path = Path(output_path)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        with open(output_path, 'w') as f:
            f.write(script)
        print(f"✅ Script saved: {output_path}")
    else:
        print("\n" + "=" * 60)
        print(script)
        print("=" * 60 + "\n")

    return True


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Generate scripts for videos, social media, and events"
    )
    parser.add_argument("--prompt", required=True, help="Subject/title for script")
    parser.add_argument(
        "--type",
        default="narration",
        choices=["narration", "social", "event-description", "video-hook", "product-pitch"],
        help="Script type (default: narration)"
    )
    parser.add_argument(
        "--provider",
        default="openai",
        choices=["openai", "claude", "replicate"],
        help="AI provider (default: openai)"
    )
    parser.add_argument(
        "--output",
        help="Output script file (prints to console if not specified)"
    )

    args = parser.parse_args()

    success = generate_script(
        prompt=args.prompt,
        script_type=args.type,
        provider=args.provider,
        output_path=args.output,
    )

    sys.exit(0 if success else 1)
