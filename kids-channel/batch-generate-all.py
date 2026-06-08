#!/usr/bin/env python3
"""
Batch generate all 149 Sunny episodes — ebooks only (skip YouTube).
Perfect for completing the missing episodes and testing Gumroad uploads.
"""

import subprocess
import sys
import time
from pathlib import Path

QUEUE_FILE = Path("kids-channel/queue.txt")
EPISODES_DIR = Path("kids-channel/episodes")
SCRIPTS_DIR = Path("kids-channel/scripts")

def get_script_name_from_path(script_path: str) -> str:
    """Extract script name from path like 'kids-channel/scripts/sunny-and-the-still-pond.json'."""
    return Path(script_path).stem

def check_if_episode_complete(script_name: str) -> bool:
    """Check if an episode's PDF ebook already exists."""
    episode_dir = EPISODES_DIR / script_name
    if not episode_dir.exists():
        return False
    # Look for any PDF in the episode directory
    pdfs = list(episode_dir.glob("*.pdf"))
    return len(pdfs) > 0

def main():
    if not QUEUE_FILE.exists():
        print(f"❌ Queue file not found: {QUEUE_FILE}")
        return 1

    # Read all scripts from queue
    with open(QUEUE_FILE) as f:
        scripts = [line.strip() for line in f if line.strip()]

    total = len(scripts)
    completed = 0
    skipped = 0
    failed = 0

    print(f"\n{'='*70}")
    print(f"🚀 BATCH GENERATION: {total} EPISODES (EBOOK ONLY)")
    print(f"{'='*70}")
    print(f"Total to process: {total}")
    print(f"Estimated time: ~{total * 2 // 60}-{total * 3 // 60} minutes")
    print(f"{'='*70}\n")

    start_time = time.time()

    for idx, script_path in enumerate(scripts, 1):
        script_name = get_script_name_from_path(script_path)

        # Check if already done
        if check_if_episode_complete(script_name):
            print(f"[{idx:3d}/{total}] {script_name:<50} ⏭️  (already done)")
            skipped += 1
            continue

        # Run pipeline for this episode with --ebook-only flag
        # (We'll create this flag in pipeline.py if needed)
        print(f"[{idx:3d}/{total}] {script_name:<50} ", end="", flush=True)

        try:
            # Run the pipeline but skip YouTube upload
            result = subprocess.run(
                [sys.executable, "kids-channel/pipeline.py",
                 "--script-file", script_path,
                 "--dry-run"],  # Skip YouTube
                capture_output=True,
                text=True,
                timeout=120
            )

            if result.returncode == 0:
                print("✅")
                completed += 1
            else:
                print("❌")
                print(f"   Error: {result.stderr[:200]}")
                failed += 1

        except subprocess.TimeoutExpired:
            print("⏱️  (timeout)")
            failed += 1
        except Exception as e:
            print(f"❌ ({e})")
            failed += 1

        # Show progress every 10 episodes
        if idx % 10 == 0:
            elapsed = time.time() - start_time
            per_episode = elapsed / idx
            remaining = (total - idx) * per_episode
            print(f"   [{idx}/{total}] Elapsed: {elapsed/60:.0f}m | Est. {remaining/60:.0f}m remaining\n")

    elapsed = time.time() - start_time

    print(f"\n{'='*70}")
    print(f"✅ BATCH GENERATION COMPLETE")
    print(f"{'='*70}")
    print(f"Total time: {elapsed/3600:.1f}h {(elapsed%3600)/60:.0f}m")
    print(f"Episodes processed: {total}")
    print(f"Successful: {completed}")
    print(f"Skipped (already done): {skipped}")
    print(f"Failed: {failed}")
    print(f"Success rate: {100*(completed+skipped)/total:.0f}%")
    print(f"{'='*70}\n")

    return 0 if failed == 0 else 1

if __name__ == "__main__":
    sys.exit(main())
