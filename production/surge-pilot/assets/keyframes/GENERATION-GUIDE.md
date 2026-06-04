# SURGE Pilot — Key Frame Generation Guide

**Date:** 2026-06-04  
**Task:** Generate 4 animation reference key frames for Act 1 (0–3 min opening sequence)  
**Target Output:** PNG stills at 1920×1080, flat 2D animation style  
**Tool:** Replicate FLUX 1.1 Pro (black-forest-labs/flux-1.1-pro)  
**Estimated Cost:** ~$0.15 per image (~$0.60 total)  

---

## Setup

Before generating, ensure your Replicate API token is configured:

```bash
# Copy the template and add your token
cp .claude/settings.local.json.example .claude/settings.local.json

# Edit .claude/settings.local.json and fill in:
{
  "env": {
    "REPLICATE_API_TOKEN": "r8_YOUR_ACTUAL_TOKEN_HERE",
    "ELEVENLABS_API_KEY": "sk_YOUR_KEY_IF_NEEDED"
  }
}
```

The settings.local.json file is gitignored and will not be committed.

---

## Frame 1: Classroom Establishing (Shot 1)

**Duration in sequence:** 0–15 seconds (wide establishing shot)  
**Emotional tone:** Calm, slightly anxious (cool color palette suggests reality)  
**Animation focus:** Static wide shot, subtle jitter overlay in post (80–100ms tremor)

### Visual Specification

| Aspect | Details |
|--------|---------|
| **Subject** | Elementary school classroom interior, morning light from windows |
| **Layout** | Empty desks in rows, one teacher's desk in foreground, bulletin boards on walls, ceiling with fluorescent lights |
| **Camera angle** | Medium-wide (establishes full room) |
| **Foreground** | Teacher preparing at desk (neutral pose, not anxious) |
| **Background** | Windows with soft morning light (warm-cool transition), bulletin boards with soft graphics |
| **Lighting** | Morning sunlight + fluorescent ceiling lights (dual light sources create visual tension) |
| **Color palette** | Cool desaturated: Light Gray #F5F5F5 (walls), Electric Blue #0052CC (accents), Sage Green #2D8A3D (plant, trim) |
| **Art style** | Flat 2D animation, bold black outlines (~3px), geometric shapes, zero shading |
| **Reference aesthetics** | Craig of the Creek (suburban mundanity), Infinity Train (emotional subtext through color), Over the Garden Wall (warm/cool color shifts) |
| **Resolution** | 1920×1080 (16:9 landscape) |

### Prompt for FLUX

```
Flat 2D animation style illustration of a bright elementary school classroom, morning light from windows on the left side, fluorescent ceiling lights above casting cool white-blue light, empty desks arranged in neat rows, one teacher's desk in the foreground center, bulletin boards on walls with minimal graphics, teacher standing at desk preparing for class (calm, neutral expression). 

Color palette: walls are light gray (#F5F5F5), accents are Electric Blue (#0052CC), plants and trim are Sage Green (#2D8A3D). The light from windows is warm-golden, creating a cool-warm color tension. 

Style: flat 2D animation with simple geometric shapes, bold black outlines (no gradients, no shading, no 3D depth). Inspired by Craig of the Creek and Infinity Train — minimal detail, maximum emotional clarity. The scene should feel welcoming but slightly uncanny (calm before anxiety).

Resolution: 1920x1080, landscape aspect ratio.
```

### Output

**Filename:** `shot-01-classroom-establishing.png`  
**Purpose:** Animation reference, will be traced/interpolated in HyperFrames as static establishing shot with jitter overlay added in post.

---

## Frame 2: Ziggy at Desk (Shot 3)

**Duration in sequence:** ~30–45 seconds (introduction)  
**Emotional tone:** Anxious, alert, slightly dissociated (jitter effect as visual metaphor)  
**Animation focus:** Character design lock, expression study

### Visual Specification

| Aspect | Details |
|--------|---------|
| **Subject** | Ziggy (10-year-old boy), sitting at school desk |
| **Head design** | Perfect circle, intentionally geometric |
| **Hair** | Messy, asymmetrical dark brown/black, one side longer than the other, tousled upward |
| **Eyes** | Electric Blue #0052CC, always moving (pupils slightly constricted = anxiety), wide open, expressive |
| **Mouth** | Neutral or slightly pursed (anxious, not smiling) |
| **Clothing** | Bright blue hoodie (#0052CC, matches eye color for visual echo), long sleeves covering wrists |
| **Socks** | Left sock pulled up high (visible at ankle), right sock low/down (visual asymmetry = dysfunction) |
| **Pose** | Sitting at desk, hands on desk with pencil, shoulders slightly tensed |
| **Foreground** | Desk edge, pencil, no other objects |
| **Background** | Minimalist, desaturated (gray walls, soft blue tint), subtle jittery lines around body suggesting nervous energy |
| **Art style** | Flat 2D, bold outlines, no shading, geometric shapes (head = circle, body = rectangles) |
| **Jitter effect** | Faint tremoring lines (80–100ms) around shoulders and head periphery in the illustration suggest anxiety |
| **Color palette** | Cool desaturated: Electric Blue #0052CC (primary), Light Gray #F5F5F5 (background), Deep Burgundy #5D1E3B (shadow suggestion, minimal) |
| **Resolution** | 1920×1080 |

### Prompt for FLUX

```
Flat 2D animation style close-up of a 10-year-old boy named Ziggy with a perfectly round head, messy asymmetrical dark hair (longer on one side, tousled), bright Electric Blue eyes (#0052CC) that are wide and slightly anxious, looking directly ahead. He's wearing a bright blue hoodie (#0052CC, matching his eyes), sitting at a school desk with a pencil in hand.

Character details: Ziggy's left sock is pulled up high at the ankle, his right sock is down and loose — visual asymmetry suggesting dysfunction. His shoulders are slightly tensed. His mouth is neutral, slightly pursed (anxious, not smiling).

Background: Minimal and desaturated. Pale gray walls, soft blue-gray tone. Subtle jittery lines around Ziggy's shoulders and head periphery should suggest nervous energy and anxiety (80–100ms tremor).

Style: Flat 2D animation with bold black outlines (~3px), simple geometric shapes (head = circle, body = rectangles), zero shading or gradients. Inspired by Infinity Train and Craig of the Creek — expressive emotion through shape and color, not detail.

Color palette: Electric Blue (#0052CC) is dominant, Light Gray (#F5F5F5) background, minimal burgundy (#5D1E3B) if shadows needed.

Resolution: 1920x1080, landscape.
```

### Output

**Filename:** `shot-03-ziggy-desk.png`  
**Purpose:** Character design lock (animation reference for all future Ziggy shots), expression/emotion study, establish nervous energy.

---

## Frame 3: Sensory Montage — Fluorescent Hum (Shot 4a)

**Duration in sequence:** ~60–90 seconds (sensory overload begins)  
**Emotional tone:** Overwhelming, disorienting (sound made visual through shimmer/hum)  
**Animation focus:** Abstract sensory visualization, tight composition

### Visual Specification

| Aspect | Details |
|--------|---------|
| **Subject** | Extreme close-up of ceiling fluorescent light fixture, very bright |
| **Composition** | Centered, filling most of frame (emphasizes dominance/overwhelming quality) |
| **Light fixture** | Rectangular fluorescent tube, visible grid/diffuser below |
| **Color** | Intense white-blue light, almost blown-out (overexposed aesthetic) |
| **Hum visualization** | Wavy lines radiating from light fixture (concentric waves), shimmer/flicker effect suggested through line work |
| **Intensity** | Maximum brightness suggested, hard to look at directly |
| **Background** | Ceiling (light gray #F5F5F5), barely visible due to light dominance |
| **Art style** | Flat 2D, minimal detail, bold outlines, geometric grid pattern of light diffuser |
| **Motion hint** | Wavy lines should suggest movement/vibration (audio made visual) |
| **Color palette** | Cool desaturated: very pale blue-white (light core), Light Gray #F5F5F5 (ceiling), Electric Blue #0052CC (shadow/contrast on diffuser grid) |
| **Resolution** | 1920×1080 |

### Prompt for FLUX

```
Flat 2D animation style extreme close-up of a ceiling fluorescent light fixture, very bright and almost blown-out white-blue light. The light is the dominant element, filling most of the frame and appearing almost overwhelming to look at directly.

The fixture should show: rectangular fluorescent tube, visible geometric grid pattern of the light diffuser below, and intense white-blue luminescence.

Sensory effect: Radiating wavy lines should emanate from the light fixture in concentric waves, suggesting a shimmer, flicker, or hum made visible. The lines should create a subtle vibration effect — as if the harsh fluorescent sound has been translated into visual ripples.

The ceiling above the fixture is barely visible, light gray (#F5F5F5), dwarfed by the light's dominance.

Style: Flat 2D animation, bold black outlines, geometric grid pattern visible on the diffuser, minimal realistic detail. The overall feeling should be: overwhelming sensory input, visual discomfort, intensity.

Color palette: Very pale blue-white (light core), Light Gray (#F5F5F5) for ceiling, Electric Blue (#0052CC) for grid shadow/contrast. Cool, desaturated, intense.

Resolution: 1920x1080, landscape.
```

### Output

**Filename:** `shot-04a-sensory-hum.png`  
**Purpose:** First layer of sensory montage (sound made visual), establishes discomfort and overwhelm, will be animated with subtle shimmer/pulse in HyperFrames.

---

## Frame 4: Shame Moment (Shot 15)

**Duration in sequence:** ~2:30–3:00 (emotional peak, approaching climax)  
**Emotional tone:** Deep dissociation, shame, freeze response, emotional shutdown  
**Animation focus:** Extreme close-up expression, emotional peak visual

### Visual Specification

| Aspect | Details |
|--------|---------|
| **Subject** | Ziggy's face, extreme close-up (face fills 80% of frame) |
| **Eyes** | Downcast, pupils constricted (small, focused inward), not making eye contact |
| **Mouth** | Slightly open (O-shape), suggesting shock/shutdown, not smiling |
| **Expression** | Completely still, frozen (freeze response), zero joy or engagement |
| **Face position** | Slightly tilted down, vulnerable pose |
| **Hair** | Same asymmetrical design as shot-03, but slightly more shadowed |
| **Color cast** | Deep Burgundy #5D1E3B overlay wash across entire frame, desaturating and coloring everything |
| **Background** | Extremely desaturated/grayscale with heavy burgundy wash, creating dissociative distance |
| **Light** | Dim, cool, slightly blue-tinted (opposite of classroom warmth) |
| **Art style** | Flat 2D, bold heavy outlines, minimal line work (simplification = shutdown), zero detail or texture |
| **Emotional depth** | The burgundy color shift + downcast eyes + open mouth create clear visual narrative of shame/dissociation |
| **Color palette** | Deep Burgundy #5D1E3B (dominant), Light Gray #F5F5F5 (desaturated in wash), Electric Blue #0052CC (barely visible in eyes, almost lost) |
| **Resolution** | 1920×1080 |

### Prompt for FLUX

```
Flat 2D animation style extreme close-up of Ziggy's face (10-year-old boy with round head, asymmetrical dark hair), face filling 80% of frame. His eyes are downcast, pupils small and constricted (looking inward, dissociated). His mouth is slightly open in an O-shape (shock, shutdown, not smiling). His expression is completely frozen — the freeze response to shame.

The entire frame is washed in Deep Burgundy (#5D1E3B), desaturating and coloring the image. The background is extremely desaturated/grayscale with heavy burgundy overlay, creating visual distance and dissociation.

Emotional impact: This is an emotional peak moment — shame, shutdown, dissociation. The burgundy color cast visually represents emotional overwhelm. Ziggy's eyes (normally Electric Blue) are barely visible in the shadows. His usual asymmetrical hair design is present but shadowed.

Style: Flat 2D animation with bold, heavy black outlines. Minimize line work and detail — simplification suggests emotional shutdown. Zero shading or gradients. The heaviness of the outline and sparseness of detail reinforce the freeze/dissociation.

Color palette: Deep Burgundy (#5D1E3B) wash is dominant, Light Gray (#F5F5F5) barely visible under wash, Electric Blue (#0052CC) eyes almost lost in shadow/desaturation.

Resolution: 1920x1080, landscape. This shot prepares for the fantasy escape sequence that follows.
```

### Output

**Filename:** `shot-15-shame-moment.png`  
**Purpose:** Emotional peak before escape/fantasy sequence, visual distinctness through burgundy color cast, character expression study (dissociation/freeze), transition point to fantasy realm.

---

## Generation Workflow

### Option A: Using Replicate CLI (if installed)

```bash
cd /home/user/jamie-wigg/production/surge-pilot/assets/keyframes

# Install Replicate CLI if needed
npm install -g replicate

# Set your token
export REPLICATE_API_TOKEN="r8_YOUR_TOKEN"

# Generate each frame
replicate predict black-forest-labs/flux-1.1-pro \
  --input "prompt=<FRAME_1_PROMPT>" \
  --input "aspect_ratio=16:9" \
  --output output-frame-1.png

# Repeat for frames 2, 3, 4
```

### Option B: Using Claude Code /dream Skill

```bash
/dream "Flat 2D animation style illustration of elementary school classroom, morning light, fluorescent lights, empty desks, teacher preparing, cool color palette (light gray, Electric Blue #0052CC, Sage Green #2D8A3D), bold outlines, Craig of the Creek aesthetic, 1920x1080"
```

Then save output to the keyframes folder.

### Option C: Manual API Call

```bash
curl -X POST https://api.replicate.com/v1/predictions \
  -H "Authorization: Token $REPLICATE_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "version": "black-forest-labs/flux-1.1-pro",
    "input": {
      "prompt": "<FRAME_1_PROMPT>",
      "aspect_ratio": "16:9",
      "num_outputs": 1
    }
  }'
```

---

## Quality Checklist (Post-Generation)

After generating each frame, verify:

- [ ] **Frame 1 (Classroom):** Cool palette evident, geometric shapes visible, no photorealism, teacher at desk, windows clear
- [ ] **Frame 2 (Ziggy):** Perfect circular head, asymmetrical hair clearly visible, blue hoodie, one sock up/down, anxious eyes (Electric Blue, wide), jitter lines suggest nervous energy
- [ ] **Frame 3 (Hum):** Extreme close-up of fluorescent light, overwhelming brightness, wavy/shimmer lines around fixture, minimal background
- [ ] **Frame 4 (Shame):** Burgundy color wash visible, downcast eyes with small pupils, open mouth (O-shape), desaturated/grayscale, freeze expression clear

### If quality is insufficient:

- **Too photorealistic:** Regenerate with stronger emphasis on "flat 2D animation, zero shading, bold outlines"
- **Wrong color palette:** Regenerate with hex codes in prompt: "Electric Blue #0052CC, Sage Green #2D8A3D, Light Gray #F5F5F5"
- **Character design off (Frame 2):** Regenerate with emphasis on "perfectly round head, asymmetrical dark hair, circle-shaped"
- **Jitter not visible (Frames 1, 2):** Will be added in post via HyperFrames animation, not baked into still — OK to skip if animation layer will handle it

---

## Integration into HyperFrames

Once generated, these PNGs become animation reference frames in the HyperFrames Cut:

```html
<!-- In rhythmix-surge-pilot-60s/index.html -->
<img src="shot-01-classroom-establishing.png" alt="Classroom wide shot" />
<img src="shot-03-ziggy-desk.png" alt="Ziggy at desk" />
<img src="shot-04a-sensory-hum.png" alt="Fluorescent hum sensory" />
<img src="shot-15-shame-moment.png" alt="Shame moment emotional peak" />
```

Reference frames will be layered, traced, and interpolated in GSAP animation sequences to create the full motion sequence.

---

## Notes

- **Cost:** Expect ~$0.12–0.18 per FLUX Pro image depending on generation time and retries. Budget $1–2 for all 4 frames with iterations.
- **Generation time:** 5–15 seconds per image (FLUX Pro is fast).
- **Retries:** If first pass doesn't match the flat 2D style, regenerate with stronger emphasis on "bold outlines," "geometric shapes," "zero shading."
- **Animation layer:** The jitter/tremor effect (80–100ms) for anxiety will be added via GSAP in HyperFrames, not baked into the still. The prompts include jitter visualizations for reference, but can be skipped if animation handles it post.

---

## File Manifest

When complete, verify all 4 files exist:

```
production/surge-pilot/assets/keyframes/
├── GENERATION-GUIDE.md (this file)
├── shot-01-classroom-establishing.png (1920×1080, ~200–400 KB)
├── shot-03-ziggy-desk.png (1920×1080, ~200–400 KB)
├── shot-04a-sensory-hum.png (1920×1080, ~200–400 KB)
└── shot-15-shame-moment.png (1920×1080, ~200–400 KB)
```

**Total estimated storage:** ~1–2 MB for all 4 PNGs.

---

**Generated:** 2026-06-04  
**Generator:** Claude Code Agent  
**Task:** SURGE Pilot Production — Key Frame Asset Generation
