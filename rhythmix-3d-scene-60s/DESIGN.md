# 3D Scene Design

**Inherits from:** `rhythmix-teaser-60s/DESIGN.md`

## Color Palette
- **Primary:** #64b5f6 (bright blue, character glow)
- **Secondary:** #ff1493 (magenta, rim light)
- **Background:** #0a0a14 (deep navy)
- **Accent:** #1a1a2e (mid-tone blue)

## Typography
- Headings: Use sparingly in 3D context
- Narration: ElevenLabs TTS (22 voice options)

## 3D Elements
- **Main character:** Icosahedron with emissive material
- **Orbit objects:** Octahedron geometries, HSL-varied colors
- **Lighting:** Three-point (key, rim, ambient)
- **Camera:** Dynamic circular pan with vertical bobbing

## Animation Timing
- **Duration:** 60 seconds (1800 frames @ 30fps)
- **Main rotation:** 0.5–0.7 rad/s (smooth, deliberate)
- **Pulse effect:** 2 Hz sine wave (growth/shrink)
- **Camera motion:** 0.3 rad/s circular pan
- **Lighting dynamics:** Slow intensity modulation (1–2 Hz)

## Export
- **Format:** MP4 (H.264)
- **Resolution:** 1920×1080 (landscape 16:9)
- **Framerate:** 30 fps
- **Duration:** 60 seconds

## Usage
Perfect for:
- Product reveal animations
- Music video intros
- Technical explainer sequences
- 3D branding assets

## Customization
Edit `index.html` to:
- Change character geometry (BoxGeometry, TorusGeometry, etc.)
- Modify material colors and properties
- Adjust camera path
- Add/remove orbiting objects
- Change lighting setup

---

**Created with Three.js + HyperFrames**  
**Part of the 3D Cartoon Studio ecosystem**
