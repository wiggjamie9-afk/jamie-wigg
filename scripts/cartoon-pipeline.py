#!/usr/bin/env python3
"""
3D Cartoon Production Pipeline Orchestrator

Chains together:
1. Blender MCP (AI-powered 3D generation)
2. Blender CLI (frame rendering)
3. OpenCV (post-processing)
4. HyperFrames (composition with music/voiceover)
5. FFmpeg (MP4 output)

Usage:
    python3 scripts/cartoon-pipeline.py --character hero
    python3 scripts/cartoon-pipeline.py --all
"""

import os
import sys
import json
import subprocess
import time
from pathlib import Path
from dataclasses import dataclass
from typing import Optional
import tempfile
import shutil

# ============================================================================
# Configuration
# ============================================================================

@dataclass
class Character:
    name: str
    description: str
    blender_script: str  # Python code to generate in Blender
    voiceover: str  # Script for narration
    color_scheme: dict  # RGB colors for branding
    music_prompt: Optional[str] = None

CHARACTERS = {
    'hero': Character(
        name='Hero',
        description='A brave warrior with glowing blue armor, heroic stance',
        blender_script='''
import bpy
# Clear default cube
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete()

# Create character base
bpy.ops.mesh.primitive_uv_sphere_add(radius=1, location=(0, 0, 1))
character = bpy.context.active_object
character.name = 'Hero'

# Add material
mat = bpy.data.materials.new(name='HeroMaterial')
mat.diffuse_color = (0.2, 0.6, 1.0, 1.0)  # Blue
mat.metallic = 0.6
mat.roughness = 0.3
character.data.materials.append(mat)

# Add armor details
for i in range(3):
    bpy.ops.mesh.primitive_cube_add(size=0.3, location=(0.5 + i*0.4, 0, 0.8))
    armor = bpy.context.active_object
    armor.data.materials.append(mat)
''',
        voiceover='Meet the Hero. Brave, bold, and ready for adventure.',
        color_scheme={'r': 0.2, 'g': 0.6, 'b': 1.0},
        music_prompt='epic orchestral hero theme'
    ),
    'villain': Character(
        name='Villain',
        description='A menacing figure with dark purple aura, spiky features',
        blender_script='''
import bpy
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete()

# Create villain base
bpy.ops.mesh.primitive_uv_sphere_add(radius=1.2, location=(0, 0, 1))
villain = bpy.context.active_object
villain.name = 'Villain'

# Add dark material
mat = bpy.data.materials.new(name='VillainMaterial')
mat.diffuse_color = (0.8, 0.2, 1.0, 1.0)  # Purple
mat.metallic = 0.8
mat.roughness = 0.2
villain.data.materials.append(mat)

# Add spikes
for angle in range(0, 360, 45):
    bpy.ops.mesh.primitive_cone_add(radius1=0.2, depth=0.4, location=(1.2, 0, 0.8))
    spike = bpy.context.active_object
    spike.data.materials.append(mat)
''',
        voiceover='But darkness rises. The Villain emerges, seeking power and conquest.',
        color_scheme={'r': 0.8, 'g': 0.2, 'b': 1.0},
        music_prompt='dark ominous villain theme'
    ),
    'sidekick': Character(
        name='Sidekick',
        description='A cheerful companion with bright yellow glow, round friendly shape',
        blender_script='''
import bpy
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete()

# Create sidekick
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.7, location=(0, 0, 0.5))
sidekick = bpy.context.active_object
sidekick.name = 'Sidekick'

# Add bright material
mat = bpy.data.materials.new(name='SidekickMaterial')
mat.diffuse_color = (1.0, 0.9, 0.2, 1.0)  # Yellow
mat.metallic = 0.4
mat.roughness = 0.6
mat.emission = (1.0, 0.8, 0.0)
mat.emission_strength = 0.5
sidekick.data.materials.append(mat)

# Add eyes
for x in [-0.2, 0.2]:
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.15, location=(x, 0.3, 0.9))
    eye = bpy.context.active_object
    eye.data.materials.append(mat)
''',
        voiceover='And there\'s the Sidekick, loyal friend and comic relief.',
        color_scheme={'r': 1.0, 'g': 0.9, 'b': 0.2},
        music_prompt='upbeat cheerful companion theme'
    )
}

# ============================================================================
# Step 1: Blender MCP - Generate 3D Model
# ============================================================================

def step1_generate_blender_model(character: Character, output_blend: Path) -> bool:
    """Generate 3D model via Blender Python API."""
    print(f"\n📍 Step 1/5: Generating Blender model for {character.name}...")

    output_blend.parent.mkdir(exist_ok=True)

    # Write Python script to temp file
    with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as f:
        f.write(character.blender_script)
        script_path = f.name

    try:
        # Run Blender in background with script
        cmd = [
            'blender',
            '-b',  # Background mode
            '--python', script_path,
            '-o', str(output_blend),
            '-F', 'BLENDER'  # Set format
        ]

        result = subprocess.run(cmd, capture_output=True, timeout=60)

        if result.returncode != 0:
            print(f"⚠️  Blender generation failed: {result.stderr.decode()}")
            return False

        print(f"✓ Generated {character.name} model")
        return True

    except Exception as e:
        print(f"✗ Error generating model: {e}")
        return False
    finally:
        os.unlink(script_path)

# ============================================================================
# Step 2: Blender CLI - Render Frame Sequence
# ============================================================================

def step2_render_frames(blend_file: Path, output_dir: Path, num_frames: int = 300) -> bool:
    """Render PNG frame sequence from Blender."""
    print(f"\n📍 Step 2/5: Rendering {num_frames} frames from Blender...")

    output_dir.mkdir(exist_ok=True)

    cmd = [
        'blender',
        '-b',
        str(blend_file),
        '-o', str(output_dir / 'frame_####.png'),
        '-s', '1',
        '-e', str(num_frames),
        '-a'  # Render all frames
    ]

    try:
        result = subprocess.run(cmd, capture_output=True, timeout=600)

        if result.returncode != 0:
            print(f"⚠️  Render failed: {result.stderr.decode()}")
            return False

        # Check output
        frames = list(output_dir.glob('frame_*.png'))
        print(f"✓ Rendered {len(frames)} frames to {output_dir}")
        return len(frames) > 0

    except Exception as e:
        print(f"✗ Error rendering: {e}")
        return False

# ============================================================================
# Step 3: OpenCV - Post-process Frames
# ============================================================================

def step3_process_with_opencv(input_dir: Path, output_dir: Path, character: Character) -> bool:
    """Apply color grading and effects via OpenCV."""
    print(f"\n📍 Step 3/5: Post-processing frames with OpenCV...")

    try:
        import cv2
        import numpy as np
    except ImportError:
        print("✗ OpenCV not installed. Run: pip install opencv-python")
        return False

    output_dir.mkdir(exist_ok=True)

    frames = sorted(input_dir.glob('frame_*.png'))
    if not frames:
        print("✗ No frames found to process")
        return False

    processed = 0
    for i, frame_path in enumerate(frames):
        try:
            img = cv2.imread(str(frame_path))
            if img is None:
                continue

            # Convert to HSV for color manipulation
            hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV).astype(np.float32)

            # Apply color scheme tinting (subtle)
            hue_shift = (character.color_scheme['r'] * 30 - 15)  # -15 to +15 degrees
            hsv[:, :, 0] = (hsv[:, :, 0] + hue_shift) % 180

            # Increase saturation
            hsv[:, :, 1] *= 1.2
            hsv[:, :, 1] = np.clip(hsv[:, :, 1], 0, 255)

            # Slight brightness boost
            hsv[:, :, 2] *= 1.05
            hsv[:, :, 2] = np.clip(hsv[:, :, 2], 0, 255)

            hsv = hsv.astype(np.uint8)
            img = cv2.cvtColor(hsv, cv2.COLOR_HSV2BGR)

            # Subtle sharpening
            kernel = np.array([[-0.5, -0.5, -0.5],
                              [-0.5,  5.0, -0.5],
                              [-0.5, -0.5, -0.5]])
            img = cv2.filter2D(img, -1, kernel / 2.5)

            # Save
            output_path = output_dir / frame_path.name
            cv2.imwrite(str(output_path), img)
            processed += 1

            if (i + 1) % 50 == 0:
                print(f"  Processed {i + 1}/{len(frames)} frames")

        except Exception as e:
            print(f"⚠️  Error processing frame {frame_path.name}: {e}")

    print(f"✓ Post-processed {processed} frames")
    return processed > 0

# ============================================================================
# Step 4: HyperFrames - Compose Scene
# ============================================================================

def step4_compose_hyperframes(char_name: str, frames_dir: Path, character: Character) -> bool:
    """Copy frames to HyperFrames folder and prepare composition."""
    print(f"\n📍 Step 4/5: Preparing HyperFrames composition...")

    hyperframes_dir = Path('rhythmix-3d-scene-60s')
    frames_dest = hyperframes_dir / 'frames'

    frames_dest.mkdir(parents=True, exist_ok=True)

    try:
        # Copy frames
        frames = sorted(frames_dir.glob('frame_*.png'))
        for frame in frames[:180]:  # Limit to 6 seconds at 30fps for demo
            shutil.copy(frame, frames_dest / frame.name)

        # Update script.txt with character narration
        script_path = hyperframes_dir / 'script.txt'
        script_path.write_text(f"""[SCENE: {character.name} appears with dramatic lighting]

{character.voiceover}

[Camera pans around character, showing details]

""")

        print(f"✓ Composed {len(list(frames_dest.glob('*.png')))} frames")
        print(f"✓ Updated script.txt with voiceover")
        return True

    except Exception as e:
        print(f"✗ Error composing: {e}")
        return False

# ============================================================================
# Step 5: HyperFrames - Render to MP4
# ============================================================================

def step5_export_mp4(char_name: str) -> bool:
    """Render HyperFrames composition to MP4."""
    print(f"\n📍 Step 5/5: Rendering to MP4...")

    hyperframes_dir = Path('rhythmix-3d-scene-60s')

    try:
        cmd = [
            'npx',
            'hyperframes@latest',
            'render'
        ]

        result = subprocess.run(
            cmd,
            cwd=str(hyperframes_dir),
            capture_output=True,
            timeout=300
        )

        if result.returncode != 0:
            print(f"⚠️  Render failed: {result.stderr.decode()}")
            return False

        # Check output
        mp4_file = hyperframes_dir / 'rhythmix-3d-scene-60s.mp4'
        if mp4_file.exists():
            size_mb = mp4_file.stat().st_size / (1024 * 1024)
            print(f"✓ Exported {mp4_file.name} ({size_mb:.1f} MB)")
            return True
        else:
            print("✗ MP4 file not found after render")
            return False

    except Exception as e:
        print(f"✗ Error exporting: {e}")
        return False

# ============================================================================
# Orchestration
# ============================================================================

def run_character_pipeline(char_name: str, temp_dir: Optional[Path] = None) -> bool:
    """Run full pipeline for a single character."""

    if char_name not in CHARACTERS:
        print(f"✗ Unknown character: {char_name}")
        return False

    character = CHARACTERS[char_name]

    if temp_dir is None:
        temp_dir = Path(f'/tmp/cartoon-{char_name}-{int(time.time())}')

    print(f"\n{'='*60}")
    print(f"🎬 CARTOON PIPELINE: {character.name}")
    print(f"{'='*60}")

    try:
        # Create working directory
        temp_dir.mkdir(parents=True, exist_ok=True)
        blend_file = temp_dir / f'{char_name}.blend'
        frames_dir = temp_dir / 'frames_raw'
        processed_dir = temp_dir / 'frames_processed'

        # Step 1: Generate Blender model
        if not step1_generate_blender_model(character, blend_file):
            print("✗ Pipeline failed at Step 1 (Blender generation)")
            return False

        # Step 2: Render frames
        if not step2_render_frames(blend_file, frames_dir, num_frames=180):
            print("✗ Pipeline failed at Step 2 (Frame rendering)")
            return False

        # Step 3: Post-process with OpenCV
        if not step3_process_with_opencv(frames_dir, processed_dir, character):
            print("✗ Pipeline failed at Step 3 (OpenCV processing)")
            return False

        # Step 4: Compose HyperFrames
        if not step4_compose_hyperframes(char_name, processed_dir, character):
            print("✗ Pipeline failed at Step 4 (HyperFrames composition)")
            return False

        # Step 5: Export to MP4
        if not step5_export_mp4(char_name):
            print("✗ Pipeline failed at Step 5 (MP4 export)")
            return False

        print(f"\n✅ Pipeline complete for {character.name}!")
        print(f"📦 Working files: {temp_dir}")

        return True

    except KeyboardInterrupt:
        print("\n⚠️  Pipeline interrupted by user")
        return False
    except Exception as e:
        print(f"\n✗ Unexpected error: {e}")
        return False
    finally:
        # Optional: clean up temp files
        # shutil.rmtree(temp_dir)
        pass

# ============================================================================
# Main
# ============================================================================

def main():
    import argparse

    parser = argparse.ArgumentParser(
        description='3D Cartoon Production Pipeline',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog='''
Examples:
  python3 scripts/cartoon-pipeline.py --character hero
  python3 scripts/cartoon-pipeline.py --all
  python3 scripts/cartoon-pipeline.py --list
        '''
    )
    parser.add_argument('--character', type=str, help='Character name (hero, villain, sidekick)')
    parser.add_argument('--all', action='store_true', help='Generate all characters')
    parser.add_argument('--list', action='store_true', help='List available characters')

    args = parser.parse_args()

    if args.list:
        print("Available characters:")
        for name, char in CHARACTERS.items():
            print(f"  • {name:15} - {char.description[:50]}...")
        return

    characters_to_run = []

    if args.all:
        characters_to_run = list(CHARACTERS.keys())
    elif args.character:
        characters_to_run = [args.character]
    else:
        parser.print_help()
        return

    # Run pipeline for each character
    results = {}
    for char_name in characters_to_run:
        success = run_character_pipeline(char_name)
        results[char_name] = success

    # Summary
    print(f"\n{'='*60}")
    print("SUMMARY")
    print(f"{'='*60}")
    for char_name, success in results.items():
        status = "✅" if success else "❌"
        print(f"{status} {CHARACTERS[char_name].name}")

if __name__ == '__main__':
    main()
