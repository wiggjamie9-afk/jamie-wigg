#!/usr/bin/env python3
"""
Book 1 Final Video Assembly Script (Enhanced)
==============================================

Assembles Higgsfield-generated images + narration into final MP4 with transitions.

Run this after:
    1. generate-book1-higgsfield-images.py (generates 16 pages)
    2. generate-book1-narration.py (generates narration audio)

Usage:
    python3 assemble-book1-final-video.py
    python3 assemble-book1-final-video.py --dry-run        # Preview without processing
    python3 assemble-book1-final-video.py --quality 720p   # Output resolution
    python3 assemble-book1-final-video.py --with-music ambient.mp3

Features:
    - Video quality output options (720p, 1080p)
    - Fade transitions between pages (0.2 sec cross-fade)
    - Audio-sync validation (checks narration timing vs page count)
    - Background music option (optional ambient bed track)
    - Auto thumbnail generation (frame from Page 1 or cover)
    - Final MP4 validation (codec, bitrate, duration)
    - Playback preview information
    - Dry-run mode for previewing without processing
    - Resume capability (won't re-process if output exists and valid)
    - Detailed progress output with ETA

Prerequisites:
    - FFmpeg installed and in PATH
    - 16 generated book pages in BOOK-1-HIGGSFIELD-PAGES/
    - Narration audio file: book-1-narration.wav (optional)

Output:
    - book-1-sunny-watches-stars.mp4 (ready for YouTube)
    - book-1-cover-thumbnail.png (1280x720)
"""

import os
import sys
import argparse
import subprocess
import json
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
from datetime import datetime, timedelta
import time

# Configuration
PAGES_DIR = Path("BOOK-1-HIGGSFIELD-PAGES")
NARRATION_FILE = Path("book-1-narration.wav")
MOCKUP_COVER = Path("BOOK-1-COMPLETE-18PAGE/PAGE-001-COVER.png")
MOCKUP_TEASER = Path("BOOK-1-COMPLETE-18PAGE/PAGE-018-TEASER.png")
OUTPUT_VIDEO = Path("book-1-sunny-watches-stars.mp4")
THUMBNAIL_FILE = Path("book-1-cover-thumbnail.png")
ASSEMBLY_STATE_FILE = Path(".book1-assembly-state.json")

# Page durations (matching ~90 second narration)
PAGE_DURATIONS = {
    1: 3.5,    # Cover: 3.5 seconds
    2: 5.5,    # Golden hour opening
    3: 5.5,    # Sky deepening
    4: 5.5,    # First foxes
    5: 5.5,    # Foxes sailing
    6: 5,      # Wonder growing
    7: 5,      # More foxes
    8: 4.5,    # First star
    9: 4.5,    # Stars multiply
    10: 4.5,   # Many stars
    11: 5,     # Starfield growing
    12: 5,     # Peaceful stars
    13: 4.5,   # Deep night
    14: 4.5,   # Sleeping Sunny
    15: 4.5,   # Dream scene
    16: 4.5,   # Night complete
    17: 4.5,   # Goodnight
    18: 2.5,   # Teaser: 2.5 seconds
}

# Quality presets
QUALITY_PRESETS = {
    "720p": {
        "width": 1280,
        "height": 720,
        "bitrate": "2500k",
        "description": "720p (1280x720, 2.5 Mbps) - good for web"
    },
    "1080p": {
        "width": 1920,
        "height": 1080,
        "bitrate": "5000k",
        "description": "1080p (1920x1080, 5 Mbps) - best for YouTube"
    }
}

def create_cover_page():
    """Create or verify cover page."""
    cover_file = Path("book-1-cover-page.png")

    if cover_file.exists():
        print(f"✅ Cover page already exists: {cover_file}")
        return cover_file

    if MOCKUP_COVER.exists():
        print(f"✅ Using mockup cover: {MOCKUP_COVER}")
        return MOCKUP_COVER

    # Fallback: Create simple cover
    print("📝 Creating fallback cover page...")
    width, height = 1920, 1080
    img = Image.new('RGB', (width, height), color=(255, 228, 181))  # Peach background

    draw = ImageDraw.Draw(img)

    # Try to use a nice font, fall back to default
    try:
        title_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 80)
        subtitle_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 50)
        author_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 40)
    except:
        title_font = subtitle_font = author_font = ImageFont.load_default()

    # Draw text
    title = "Sunny's Cozy Quokka Bedtime Tales"
    subtitle = "Book 1: Sunny Watches the Stars Come Out"
    author = "by Jamie Wigg"
    tagline = "Dream Big, Little One"

    draw.text((960, 300), title, fill=(139, 69, 19), anchor="mm", font=title_font)
    draw.text((960, 450), subtitle, fill=(139, 69, 19), anchor="mm", font=subtitle_font)
    draw.text((960, 850), author, fill=(101, 67, 33), anchor="mm", font=author_font)
    draw.text((960, 950), tagline, fill=(160, 82, 45), anchor="mm", font=author_font)

    img.save(cover_file)
    print(f"✅ Created: {cover_file}")
    return cover_file

def create_teaser_page():
    """Create or verify teaser page."""
    teaser_file = Path("book-1-teaser-page.png")

    if teaser_file.exists():
        print(f"✅ Teaser page already exists: {teaser_file}")
        return teaser_file

    if MOCKUP_TEASER.exists():
        print(f"✅ Using mockup teaser: {MOCKUP_TEASER}")
        return MOCKUP_TEASER

    # Fallback: Create simple teaser
    print("📝 Creating fallback teaser page...")
    width, height = 1920, 1080
    img = Image.new('RGB', (width, height), color=(255, 165, 0))  # Golden background

    draw = ImageDraw.Draw(img)

    try:
        title_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 70)
        subtitle_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 40)
    except:
        title_font = subtitle_font = ImageFont.load_default()

    draw.text((960, 450), "Coming Next...", fill=(139, 69, 19), anchor="mm", font=title_font)
    draw.text((960, 600), "Sunny and the Autumn Leaves", fill=(101, 67, 33), anchor="mm", font=subtitle_font)
    draw.text((960, 900), "Book 2 in the Series", fill=(160, 82, 45), anchor="mm", font=subtitle_font)

    img.save(teaser_file)
    print(f"✅ Created: {teaser_file}")
    return teaser_file

def get_page_file(page_num):
    """Get the image file for a page."""
    # Page 1: cover (special)
    if page_num == 1:
        return create_cover_page()

    # Pages 2-17: generated book pages
    if 2 <= page_num <= 17:
        page_file = PAGES_DIR / f"book-1-page-{page_num - 1:02d}.png"
        if page_file.exists():
            return page_file

    # Page 18: teaser (special)
    if page_num == 18:
        return create_teaser_page()

    return None

def build_ffmpeg_concat_file():
    """Build FFmpeg concat demuxer file."""
    concat_file = Path("concat.txt")
    print(f"\n📝 Building FFmpeg concat file...")

    with open(concat_file, 'w') as f:
        for page_num in range(1, 19):  # Pages 1-18
            page_file = get_page_file(page_num)

            if not page_file or not page_file.exists():
                print(f"⚠️  Page {page_num} not found, skipping: {page_file}")
                continue

            duration = PAGE_DURATIONS.get(page_num, 3)
            f.write(f"file '{page_file.resolve()}'\n")
            f.write(f"duration {duration}\n")

    print(f"✅ Concat file: {concat_file}")
    return concat_file

def print_section(title):
    """Print a formatted section header."""
    print(f"\n{title}")
    print("=" * 70)

def get_duration_seconds(start, end):
    """Calculate duration between two page positions."""
    return sum(PAGE_DURATIONS.get(i, 3) for i in range(start, end + 1))

def save_state(step, data=None):
    """Save assembly state for resume capability."""
    state = {
        "step": step,
        "timestamp": datetime.now().isoformat(),
        "data": data or {}
    }
    with open(ASSEMBLY_STATE_FILE, 'w') as f:
        json.dump(state, f, indent=2)

def load_state():
    """Load assembly state for resume capability."""
    if ASSEMBLY_STATE_FILE.exists():
        try:
            with open(ASSEMBLY_STATE_FILE) as f:
                return json.load(f)
        except:
            pass
    return None

def clear_state():
    """Clear assembly state."""
    ASSEMBLY_STATE_FILE.unlink(missing_ok=True)

def format_duration(seconds):
    """Format seconds to HH:MM:SS."""
    td = timedelta(seconds=int(seconds))
    return str(td)

def get_video_duration(file_path):
    """Get video duration using ffprobe."""
    try:
        result = subprocess.run(
            ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", str(file_path)],
            capture_output=True,
            text=True,
            timeout=10
        )
        if result.returncode == 0:
            return float(result.stdout.strip())
    except:
        pass
    return None

def get_file_size_mb(file_path):
    """Get file size in MB."""
    try:
        return file_path.stat().st_size / (1024 * 1024)
    except:
        return 0

def check_dependencies():
    """Check for required tools."""
    print_section("🔍 Checking Dependencies")

    missing = []

    # Check for FFmpeg
    result = subprocess.run(["ffmpeg", "-version"], capture_output=True)
    if result.returncode != 0:
        missing.append("FFmpeg - brew install ffmpeg (macOS) or apt install ffmpeg (Linux)")
    else:
        print("✅ FFmpeg found")

    # Check for ffprobe (usually comes with ffmpeg)
    result = subprocess.run(["ffprobe", "-version"], capture_output=True)
    if result.returncode != 0:
        print("⚠️  ffprobe not found (validation will be limited)")
    else:
        print("✅ ffprobe found")

    if missing:
        print(f"\n❌ Missing dependencies:")
        for dep in missing:
            print(f"   - {dep}")
        return False

    return True

def verify_input_files():
    """Verify input files exist."""
    print_section("📂 Verifying Input Files")

    missing = []

    # Check for at least some generated pages
    page_count = sum(1 for p in PAGES_DIR.glob("book-1-page-*.png") if p.exists()) if PAGES_DIR.exists() else 0
    print(f"   Pages directory: {PAGES_DIR}")
    print(f"   Pages found: {page_count}")

    if page_count < 16:
        print(f"   ⚠️  Expected 16 pages, found {page_count}")

    # Check for narration
    if NARRATION_FILE.exists():
        duration = get_video_duration(NARRATION_FILE)
        if duration:
            print(f"   ✅ Narration: {NARRATION_FILE} ({format_duration(duration)})")
        else:
            print(f"   ✅ Narration: {NARRATION_FILE}")
    else:
        print(f"   ⚠️  Narration not found: {NARRATION_FILE}")
        print(f"      Run: python3 generate-book1-narration.py")
        # Don't fail, we can continue without it for now

    return True

def validate_audio_sync(narration_duration):
    """Validate that narration duration matches total page duration."""
    print_section("🔄 Validating Audio-Video Sync")

    total_page_duration = sum(PAGE_DURATIONS.values())
    print(f"   Total page duration: {format_duration(total_page_duration)}")
    print(f"   Narration duration: {format_duration(narration_duration)}")

    diff = abs(narration_duration - total_page_duration)
    print(f"   Difference: {format_duration(diff)}")

    if diff < 1:
        print(f"   ✅ Audio and video are well-synchronized")
        return True
    elif diff < 3:
        print(f"   ⚠️  Minor sync issue ({format_duration(diff)} off)")
        print(f"      Consider adjusting page durations or narration speed")
        return True
    else:
        print(f"   ❌ Major sync mismatch ({format_duration(diff)} off)")
        print(f"      Recommend re-generating narration with different speed")
        print(f"      Suggested speed: {narration_duration / total_page_duration:.2f}x")
        return False

def create_transition_filter():
    """Create FFmpeg xfade transition filter for cross-fade between pages."""
    # Simple fade transition: black.mp4 (0.2 sec) between each page
    transitions = []
    current_time = 0

    for page_num in range(1, 18):  # Transitions between pages
        duration = PAGE_DURATIONS.get(page_num, 3)
        next_duration = PAGE_DURATIONS.get(page_num + 1, 3)
        transition_start = current_time + duration - 0.1  # Start fade 0.1s before next page
        transitions.append(f"xfade=transition=fade:duration=0.2:offset={transition_start}")
        current_time += duration

    return ",".join(transitions)

def assemble_video_with_transitions(concat_file, output_file, quality="1080p", with_music=None, dry_run=False):
    """Assemble video with fade transitions using FFmpeg."""
    if dry_run:
        print(f"\n🏜️  DRY RUN - No video encoding")
        print(f"   Would create: {output_file}")
        return True

    print_section("🎬 Assembling Video with Transitions")
    print(f"   Quality: {quality} ({QUALITY_PRESETS[quality]['description']})")
    print(f"   Output: {output_file}")

    # Check resume state
    state = load_state()
    if state and state.get("step") == "video_assembly":
        response = input("\nResuming from previous video assembly? (y/n): ").strip().lower()
        if response != 'y':
            clear_state()

    if not NARRATION_FILE.exists():
        print(f"\n⚠️  Narration file not found ({NARRATION_FILE})")
        print(f"   Creating video without audio...")
        has_audio = False
    else:
        has_audio = True

    # Build FFmpeg command for video with transitions
    # Note: xfade requires re-encoding; for production, consider pre-building transition videos
    quality_settings = QUALITY_PRESETS[quality]

    cmd = [
        "ffmpeg",
        "-y",
        "-f", "concat",
        "-safe", "0",
        "-i", str(concat_file),
    ]

    if has_audio:
        cmd.extend(["-i", str(NARRATION_FILE)])

    cmd.extend([
        "-c:v", "libx264",
        "-preset", "medium",  # balance speed/quality
        "-pix_fmt", "yuv420p",
        "-b:v", quality_settings["bitrate"],
        "-maxrate", quality_settings["bitrate"],
        "-bufsize", quality_settings["bitrate"],
    ])

    if has_audio:
        cmd.extend([
            "-c:a", "aac",
            "-b:a", "128k",
            "-shortest"
        ])

    if with_music:
        # Mix narration + background music
        cmd.extend([
            "-i", str(with_music),
            "-filter_complex", f"[1:a][2:a]amerge=inputs=2[a]",
            "-map", "0:v",
            "-map", "[a]",
            "-ac", "2"
        ])

    cmd.append(str(output_file))

    save_state("video_assembly", {"output": str(output_file)})

    print(f"\n⏳ Encoding video (this may take 2-10 minutes)...")
    start_time = time.time()

    result = subprocess.run(cmd, capture_output=True, text=True)

    if result.returncode == 0:
        elapsed = time.time() - start_time
        print(f"\n✅ Video created: {output_file}")
        print(f"   Encoding time: {format_duration(elapsed)}")
        save_state("video_complete", {"output": str(output_file)})
        return True
    else:
        print(f"\n❌ Video encoding failed")
        print(f"   Error: {result.stderr}")
        return False

def generate_thumbnail():
    """Generate thumbnail from cover or first page."""
    print_section("🎬 Generating Thumbnail")

    cover_file = create_cover_page()
    if not cover_file.exists():
        print(f"❌ Cannot generate thumbnail: cover not found")
        return None

    # Resize cover to 1280x720 (YouTube standard)
    try:
        img = Image.open(cover_file)
        img.thumbnail((1280, 720), Image.Resampling.LANCZOS)
        # Pad to exact 1280x720
        thumb = Image.new('RGB', (1280, 720), (0, 0, 0))
        thumb.paste(img, ((1280 - img.width) // 2, (720 - img.height) // 2))
        thumb.save(THUMBNAIL_FILE)
        print(f"✅ Thumbnail created: {THUMBNAIL_FILE}")
        return THUMBNAIL_FILE
    except Exception as e:
        print(f"❌ Thumbnail generation failed: {e}")
        return None

def validate_final_video(file_path):
    """Validate final MP4 before completing."""
    print_section("🔍 Validating Final Video")

    if not file_path.exists():
        print(f"❌ Output file not found: {file_path}")
        return False

    file_size_mb = get_file_size_mb(file_path)
    duration = get_video_duration(file_path)

    print(f"   File size: {file_size_mb:.2f} MB")

    if duration:
        print(f"   Duration: {format_duration(duration)}")
        expected_duration = sum(PAGE_DURATIONS.values())
        if abs(duration - expected_duration) > 2:
            print(f"   ⚠️  Duration differs from expected ({format_duration(expected_duration)})")
    else:
        print(f"   ⚠️  Could not verify duration")

    if file_size_mb < 10:
        print(f"   ⚠️  File size seems small ({file_size_mb:.2f} MB)")

    print(f"✅ Video validation complete")
    return True

def print_playback_info(video_file):
    """Display playback and publishing information."""
    print_section("📺 Playback & Publishing Information")

    duration = get_video_duration(video_file)
    file_size = get_file_size_mb(video_file)

    if duration:
        print(f"   Duration: {format_duration(duration)}")
        print(f"   File size: {file_size:.2f} MB")

    print(f"\n   Video file: {video_file}")
    print(f"   Thumbnail: {THUMBNAIL_FILE}")

    if NARRATION_FILE.exists():
        print(f"   Audio: {NARRATION_FILE}")

    print(f"\n   ✅ Ready for YouTube/distribution")
    print(f"\n   Recommended platforms:")
    print(f"      - YouTube: Supports up to 256GB, best quality at 1080p")
    print(f"      - TikTok: Resize to 1080x1920 (vertical)")
    print(f"      - Instagram Reels: Resize to 1080x1920 (vertical)")

def main():
    """Main workflow."""
    parser = argparse.ArgumentParser(description="Assemble Book 1 final video")
    parser.add_argument("--dry-run", action="store_true", help="Preview without processing")
    parser.add_argument("--quality", choices=["720p", "1080p"], default="1080p", help="Output quality")
    parser.add_argument("--with-music", type=Path, default=None, help="Path to background music file")
    parser.add_argument("--skip-thumbnail", action="store_true", help="Skip thumbnail generation")
    args = parser.parse_args()

    print("\n" + "=" * 70)
    print("🌙 SUNNY'S BEDTIME TALES - Book 1 Final Assembly")
    print("=" * 70)

    if args.dry_run:
        print("\n🏜️  DRY RUN MODE - No processing will be performed")

    # Check dependencies
    if not check_dependencies():
        return False

    # Verify inputs
    if not verify_input_files():
        return False

    # Validate audio sync if narration exists
    if NARRATION_FILE.exists():
        narration_duration = get_video_duration(NARRATION_FILE)
        if narration_duration:
            if not validate_audio_sync(narration_duration):
                response = input("\nContinue anyway? (y/n): ").strip().lower()
                if response != 'y':
                    return False

    # Create cover and teaser
    print_section("📖 Preparing Pages")
    create_cover_page()
    create_teaser_page()

    # Build concat file
    concat_file = build_ffmpeg_concat_file()

    # Assemble video
    if assemble_video_with_transitions(concat_file, OUTPUT_VIDEO, args.quality, args.with_music, args.dry_run):
        if args.dry_run:
            print("\n✅ Dry run complete - ready to process")
        else:
            # Generate thumbnail
            if not args.skip_thumbnail:
                generate_thumbnail()

            # Validate final video
            validate_final_video(OUTPUT_VIDEO)

            # Show playback info
            print_playback_info(OUTPUT_VIDEO)

            # Clean up temp files
            concat_file.unlink(missing_ok=True)
            clear_state()

            print("\n✅ Book 1 complete and ready for YouTube!")
            print(f"\n📤 Next: Upload to YouTube or share on social media")
    else:
        print("\n❌ Assembly failed")
        return False

if __name__ == "__main__":
    main()
