# ManimGL Setup for Mathematical Animation Videos

This guide sets up ManimGL (3Blue1Brown's animation engine) to create mathematical explainer videos for complexity theory content.

## System Requirements

- **OS:** Ubuntu 20.04+ (or equivalent Linux)
- **Python:** 3.9+
- **Disk space:** ~5GB for dependencies + video storage

## Installation Steps

### 1. Install System Dependencies

```bash
# LaTeX for equation rendering
sudo apt update
sudo apt install -y texlive texlive-latex-extra texlive-fonts-extra texlive-science

# Graphics libraries
sudo apt install -y libcairo2-dev libpango1.0-dev libpango1.0-dev
sudo apt install -y ffmpeg

# Additional tools
sudo apt install -y libreadline-dev xdotool
```

### 2. Install ManimGL

```bash
# Via pip (recommended for latest)
pip3 install manimgl

# Or from source for cutting-edge features
git clone https://github.com/3b1b/manim.git manimgl-source
cd manimgl-source
pip3 install -e .
```

### 3. Clone 3Blue1Brown Video Repository

```bash
git clone https://github.com/3b1b/videos.git
cd videos
```

## Quick Start

### Example 1: Render a Simple Scene

```bash
# Navigate to a video folder
cd _2023/optics_puzzles

# Create a test Python file
cat > test_scene.py << 'EOF'
from manim import *

class HelloWorld(Scene):
    def construct(self):
        text = Text("Hello, Complexity Theory!", font_size=60)
        self.play(Write(text))
        self.wait()
EOF

# Render at lower quality for testing
manimgl test_scene.py -ql

# Or render HD quality (takes longer)
manimgl test_scene.py -qh
```

### Quality Flags

- `-ql` : Low quality (480p) — fast, good for testing
- `-qm` : Medium quality (720p) — balanced
- `-qh` : High quality (1080p) — slow, production
- `-qk` : 4K quality — very slow

### Render to File (Headless Mode)

For cloud/remote rendering without display:

```bash
# Render and save MP4
manimgl test_scene.py -ql --write_to_movie

# Output: ./media/videos/test_scene/480p15/HelloWorld.mp4
```

## Creating a Complexity Theory Video

### Example: Sandpile Model Animation

Create `sandpile_animation.py`:

```python
from manim import *
import numpy as np

class SandpileIntro(Scene):
    def construct(self):
        # Title
        title = Text("Self-Organized Criticality", font_size=64)
        subtitle = Text("The Sandpile Model", font_size=40).next_to(title, DOWN)
        
        self.play(Write(title))
        self.play(Write(subtitle))
        self.wait(2)
        
        # Grid visualization
        grid_size = 5
        grid = VGroup()
        for i in range(grid_size):
            for j in range(grid_size):
                cell = Square(side_length=0.4).shift(i*0.45*RIGHT + j*0.45*UP)
                grid.add(cell)
        
        grid.center()
        self.play(Create(grid))
        self.wait(2)
        
        # Add avalanche annotation
        avalanche_text = Text("Avalanche Cascade", font_size=30, color=RED)
        avalanche_text.to_edge(DOWN)
        self.play(Write(avalanche_text))
        self.wait(2)
```

Render it:

```bash
manimgl sandpile_animation.py SandpileIntro -qm --write_to_movie
```

## Common Issues & Fixes

### "Cannot connect to display" (Headless)
**Solution:** Use `--write_to_movie` flag to render to file without display

### "LaTeX not found"
**Solution:** Re-run: `sudo apt install texlive texlive-latex-extra`

### Video codec errors
**Solution:** Ensure ffmpeg is installed: `ffmpeg -version`

### Low FPS or stuttering
**Solution:** Lower quality level (`-ql` instead of `-qh`) or increase render time

## File Organization

```
~/videos/
├── _2023/
│   ├── optics_puzzles/
│   └── ...
├── sandpile_animation.py
├── fractals.py
├── power_laws.py
└── media/
    └── videos/
        ├── sandpile_animation/
        │   ├── 480p15/
        │   │   └── SandpileIntro.mp4
        │   └── ...
```

## Rendering Workflow

1. **Draft**: Develop and test scenes at `-ql` (480p)
2. **Review**: Share drafts, iterate on animations
3. **Final Render**: Render at `-qh` or `-qk` for YouTube
4. **Post-process**: Use FFmpeg/Premiere for color grading, audio, titles

## Useful ManimGL Classes for Complexity Videos

```python
# Grid systems
Grid(), AxesWithLabels()

# Mathematical objects
Mobject, VMobject, ImageMobject, Text, Tex

# Animations
Create, Write, DrawBorderThenFill, Succession, Parallel, Wait

# Graph structures
Graph, NetworkDiagram (for visualizing cellular automata)

# Shapes & colors
Circle, Square, Polygon, Polyline, Arrow

# Useful colors
RED, BLUE, GREEN, YELLOW, WHITE, BLACK, GRAY
```

## Next Steps

1. Explore 3Blue1Brown's existing videos: `cd videos && ls -la`
2. Read animation code examples: `cat _2023/optics_puzzles/e_field.py | head -50`
3. Create your first scene for complexity theory
4. Integrate with Replicate/Higgsfield for multi-modal videos

## Resources

- **Official Docs:** https://docs.manim.community/
- **3B1B Videos:** https://github.com/3b1b/videos
- **Examples:** https://github.com/3b1b/manim
- **Community:** https://www.manim.community/

## Integration with STARLIGHTMIX

Combine ManimGL with your existing tools:

- **Complexity theory explainer videos** → ManimGL
- **Music visualization** → Higgsfield image-to-video or Replicate
- **Social media clips** → `/repurpose` skill (auto-crop to 9:16)
- **Landing pages** → `/site-build` (embed rendered videos)

Example workflow:
```bash
# 1. Create mathematical animation
manimgl sandpile_animation.py -qh --write_to_movie

# 2. Extract short clips
ffmpeg -i sandpile_animation.mp4 -ss 5 -t 15 sandpile_clip_15s.mp4

# 3. Repurpose for platforms
# Use /repurpose skill to generate:
# - 9:16 vertical (TikTok/Reels)
# - Square (Instagram feed)
# - 16:9 landscape (YouTube)

# 4. Generate social posts
# Use /social-media-content-engine to schedule
```

---

**Ready to render?** Start with:
```bash
cd ~/videos && manimgl --help
```
