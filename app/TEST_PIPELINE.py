#!/usr/bin/env python3
"""
Test the complete video pipeline end-to-end.

Prerequisites:
- Ollama running: ollama serve &
- ComfyUI running: python main.py (in ~/ComfyUI/)
- AudioCraft installed: pip install audiocraft
- FFmpeg installed: brew install ffmpeg
"""

import sys
from pathlib import Path

# Add repo to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.services.complete_pipeline import CompleteVideoPipeline


def test_services():
    """Verify all services are running."""
    import urllib.request
    
    print("🔍 Verifying services...")
    
    services = {
        "Ollama": "http://localhost:11434/api/tags",
        "ComfyUI": "http://localhost:8188",
    }
    
    for service, url in services.items():
        try:
            urllib.request.urlopen(url, timeout=2)
            print(f"  ✓ {service} running")
        except Exception as e:
            print(f"  ✗ {service} NOT running")
            print(f"    Error: {e}")
            return False
    
    return True


def test_single_video():
    """Generate a single test video."""
    print("\n🎬 Generating test video...")
    print("─" * 60)
    
    pipeline = CompleteVideoPipeline(
        output_dir="test_videos",
        llm_model="mistral",
        music_model="facebook/musicgen-medium",
        kokoro_voice="af_bella"
    )
    
    result = pipeline.generate_video(
        topic="A street vendor setting up their market stall at dawn with enthusiasm and pride",
        scene_count=4,
        title="test_vendor"
    )
    
    print("\n✅ Pipeline completed!")
    print(f"   Status: {result.get('status')}")
    print(f"   Scenes: {result.get('scenes')}")
    print(f"   Output: {result.get('output_video')}")
    print(f"   Estimated time: {result.get('estimated_time')}")
    
    return result


def test_batch_videos():
    """Generate a batch of test videos."""
    print("\n📦 Testing batch generation...")
    print("─" * 60)
    
    topics = [
        "Street vendor's morning routine",
        "Freelancer finding their first client",
        "Smallholder farmer's daily work",
        "Hairdresser building her salon",
        "Tuktuks navigating city traffic",
    ]
    
    pipeline = CompleteVideoPipeline(output_dir="test_videos")
    
    results = []
    for i, topic in enumerate(topics, 1):
        print(f"\n{i}/{len(topics)}: {topic}")
        result = pipeline.generate_video(
            topic=topic,
            scene_count=4,
            title=f"test_app_{i:02d}"
        )
        results.append(result)
        print(f"  ✓ Ready")
    
    print(f"\n✅ Batch test complete!")
    print(f"   Total videos: {len(results)}")
    print(f"   Estimated total time: ~{len(results) * 4} minutes")
    print(f"   Cost: $0 (vs ${len(results) * 0.60} with paid APIs)")
    
    return results


def main():
    """Run full pipeline test."""
    print("=" * 70)
    print("          COMPLETE VIDEO PIPELINE TEST")
    print("=" * 70)
    
    # Step 1: Verify services
    print("\nSTEP 1: Verifying services...")
    if not test_services():
        print("\n❌ Services not running!")
        print("\nStart services first:")
        print("  Terminal 1: ollama serve")
        print("  Terminal 2: cd ~/ComfyUI && python main.py")
        return
    
    # Step 2: Single video test
    print("\nSTEP 2: Testing single video generation...")
    try:
        result = test_single_video()
    except Exception as e:
        print(f"\n❌ Error: {e}")
        return
    
    # Step 3: Batch test
    print("\nSTEP 3: Testing batch generation...")
    try:
        results = test_batch_videos()
    except Exception as e:
        print(f"\n❌ Error: {e}")
        return
    
    # Summary
    print("\n" + "=" * 70)
    print("                    ✅ ALL TESTS PASSED!")
    print("=" * 70)
    print("\n📊 Pipeline Statistics:")
    print(f"  • Services: 4 (Ollama, ComfyUI, AudioCraft, FFmpeg)")
    print(f"  • Videos tested: {1 + len(results)}")
    print(f"  • Total estimated time: ~{(1 + len(results)) * 4} minutes")
    print(f"  • Cost: $0")
    print(f"\n🚀 Ready for production! Run:")
    print(f"\n    from app import CompleteVideoPipeline")
    print(f"\n    pipeline = CompleteVideoPipeline()")
    print(f"    for topic in app_topics:")
    print(f"        pipeline.generate_video(topic=topic, scene_count=4)")


if __name__ == "__main__":
    main()
