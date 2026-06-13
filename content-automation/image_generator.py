#!/usr/bin/env python3
"""
Multi-provider image generation from text prompts.
Supports Leonardo AI, Replicate, Craiyon (DALL-E mini), and Higgsfield.
"""

import argparse
import os
import sys
import subprocess
import time
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


def generate_with_leonardo(prompt: str, output_path: str, api_key: str = None) -> bool:
    """Generate image using Leonardo AI"""
    if not api_key:
        api_key = os.getenv("LEONARDO_API_KEY")

    if not api_key:
        print("❌ LEONARDO_API_KEY not set. Get one at https://leonardo.ai/")
        return False

    try:
        from griptape.drivers.image_generation.leonardo import LeonardoImageGenerationDriver

        print(f"🎨 Generating with Leonardo AI: {prompt}")
        driver = LeonardoImageGenerationDriver(api_key=api_key, model="1e60896f-3c26-4296-8ecc-53e2afecc132")

        # Leonardo driver returns a list of artifacts with image data
        artifact = driver.run(prompt)

        if artifact and hasattr(artifact, 'value'):
            with open(output_path, 'wb') as f:
                f.write(artifact.value)
            print(f"✅ Generated: {output_path}")
            return True
        else:
            print("❌ Leonardo API failed to generate image")
            return False

    except Exception as e:
        print(f"❌ Leonardo error: {e}")
        return False


def generate_with_replicate(prompt: str, output_path: str, api_key: str = None, model: str = "flux") -> bool:
    """Generate image using Replicate (FLUX, Sana, etc.)"""
    if not api_key:
        api_key = os.getenv("REPLICATE_API_TOKEN")

    if not api_key:
        print("❌ REPLICATE_API_TOKEN not set. Get one at https://replicate.com/")
        return False

    try:
        import replicate

        # Map model names to Replicate model paths
        models = {
            "flux": "black-forest-labs/flux-pro",
            "flux-dev": "black-forest-labs/flux-dev",
            "sana": "weixin-hunyuan/sana",
            "hyper": "black-forest-labs/flux-1.1-pro",
        }

        model_path = models.get(model, "black-forest-labs/flux-pro")

        print(f"🎨 Generating with Replicate ({model}): {prompt}")
        client = replicate.Client(api_token=api_key)

        output = client.run(
            model_path,
            input={
                "prompt": prompt,
                "aspect_ratio": "1:1",
            }
        )

        if output and len(output) > 0:
            import requests
            img_url = output[0]
            response = requests.get(img_url)
            with open(output_path, 'wb') as f:
                f.write(response.content)
            print(f"✅ Generated: {output_path}")
            return True
        else:
            print("❌ Replicate API failed to generate image")
            return False

    except Exception as e:
        print(f"❌ Replicate error: {e}")
        return False


def generate_with_craiyon(prompt: str, output_path: str) -> bool:
    """Generate image using Craiyon (DALL-E mini)"""
    try:
        from craiyon import Craiyon

        print(f"🎨 Generating with Craiyon (DALL-E mini): {prompt}")
        generator = Craiyon()
        result = generator.generate(prompt)

        # Craiyon returns image data
        if result:
            result.save(output_path)
            print(f"✅ Generated: {output_path}")
            return True
        else:
            print("❌ Craiyon failed to generate image")
            return False

    except Exception as e:
        print(f"❌ Craiyon error: {e}")
        print("   Try: pip install craiyon")
        return False


def generate_with_higgsfield(prompt: str, output_path: str, api_key: str = None) -> bool:
    """Generate image using Higgsfield Soul (text-to-image)"""
    if not api_key:
        api_key = os.getenv("HIGGSFIELD_API_KEY")

    if not api_key:
        print("❌ HIGGSFIELD_API_KEY not set. Get one at https://higgsfield.ai/")
        return False

    try:
        import requests

        print(f"🎨 Generating with Higgsfield Soul: {prompt}")

        response = requests.post(
            "https://api.higgsfield.ai/v1/image/text-to-image",
            headers={"Authorization": f"Bearer {api_key}"},
            json={
                "prompt": prompt,
                "num_images": 1,
                "size": "1024x1024",
            },
            timeout=60
        )

        if response.status_code == 200:
            data = response.json()
            if data.get("images"):
                img_url = data["images"][0]
                img_response = requests.get(img_url)
                with open(output_path, 'wb') as f:
                    f.write(img_response.content)
                print(f"✅ Generated: {output_path}")
                return True

        print(f"❌ Higgsfield API error: {response.status_code}")
        return False

    except Exception as e:
        print(f"❌ Higgsfield error: {e}")
        return False


def generate_image(
    prompt: str,
    generator: str = "replicate",
    model: str = "flux",
    output_path: str = None,
) -> bool:
    """
    Generate image from text prompt using specified provider

    Args:
        prompt: Text description of image to generate
        generator: Provider (leonardo, replicate, craiyon, higgsfield)
        model: Model variant (for replicate: flux, flux-dev, sana, hyper)
        output_path: Where to save the image
    """

    check_dependencies()

    if not output_path:
        output_path = f"generated_{generator}.png"

    output_path = Path(output_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    if generator.lower() == "leonardo":
        return generate_with_leonardo(prompt, str(output_path))

    elif generator.lower() == "replicate":
        return generate_with_replicate(prompt, str(output_path), model=model)

    elif generator.lower() == "craiyon":
        return generate_with_craiyon(prompt, str(output_path))

    elif generator.lower() == "higgsfield":
        return generate_with_higgsfield(prompt, str(output_path))

    else:
        print(f"❌ Unknown generator: {generator}")
        print("   Supported: leonardo, replicate, craiyon, higgsfield")
        return False


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Generate images from text using multiple AI providers"
    )
    parser.add_argument("--title", required=True, help="Image description/prompt")
    parser.add_argument(
        "--generator",
        default="replicate",
        choices=["leonardo", "replicate", "craiyon", "higgsfield"],
        help="Image generation provider (default: replicate)"
    )
    parser.add_argument(
        "--model",
        default="flux",
        choices=["flux", "flux-dev", "sana", "hyper"],
        help="Model variant for Replicate (default: flux)"
    )
    parser.add_argument(
        "--output",
        help="Output image path (default: generated_<provider>.png)"
    )

    args = parser.parse_args()

    success = generate_image(
        prompt=args.title,
        generator=args.generator,
        model=args.model,
        output_path=args.output,
    )

    sys.exit(0 if success else 1)
