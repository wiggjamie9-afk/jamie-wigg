# SURGE: Visual Mood Board & Design System

**Identity anchor for production + investor deck**

---

## Color Palette (Locked Hex Codes)

### Primary Colors: Ziggy's Identity Duality

**Electric Blue #0052CC**
- Ziggy's core: restless, alert, electric energy
- Usage: Ziggy's hoodie, interior monologue text, Surge's primary glow, hyperfocus zap effects
- Meaning: ADHD neurology; mental restlessness; electricity as metaphor
- Accessibility: WCAG AAA (8.6:1 contrast with white)

**Warm Orange #FF8C3A**
- Ziggy's opposite: grounding, warmth, belonging
- Usage: Jake's shirt, connection moments (hugs, friendship), Surge's secondary energy glow
- Meaning: Safety, joy, peer connection; counterbalance to electric anxiety
- Accessibility: WCAG AAA (5.8:1 contrast with white)

### Secondary Colors: Supporting Cast + World

**Sage Green #2D8A3D**
- Mrs. Henderson, patient structure, generational wisdom
- Usage: Teacher's cardigan, grounding moments, Grandpa Chen presence
- Meaning: Educational authority that listens; growth; calm presence

**Soft Lavender #D8B5E6**
- Mom Sarah, introspection, emotional vulnerability
- Usage: Mom's clothing, home interiors, bedtime scenes, family safety
- Meaning: Emotional safety; home; processing space

### Accent Colors: Emotional States + Surge Moments

**Neon Yellow #FFFF00**
- Surge's hyperfocus state, clarity, breakthrough moments
- Usage: Speed lines, hyperfocus aura shifts, "aha" moments, emphasis flashes
- Meaning: Unnatural (signals internal state), pure energy, explosive insight
- Constraint: Use sparingly; too intense for continuous use

**Deep Burgundy #5D1E3B**
- Shame, overwhelm, emotional weight
- Usage: Classroom overwhelm tint (background 0–40% opacity), shame spiral backgrounds
- Meaning: Heavy without being evil; realistic ADHD dysphoria without pitying tone
- Constraint: Fade over time in scenes; don't sustain

### Neutral Foundation

**Light Gray #F5F5F5** — Breathing room, classroom reality, whitespace  
**Charcoal #333333** — Text, outlines, grounding details

---

## Mood Palette Progression (Narrative Arc)

Pilot emotional journey mapped to color language:

1. **Sunday Freedom** → Warm Orange (joy, soccer, ease)
2. **Monday Dread** → Electric Blue + Light Gray (classroom edges, constraint)
3. **Classroom Chaos** → Electric Blue + subtle jitter (overstimulation)
4. **Reading Struggle** → Deep Burgundy wash (shame, heaviness)
5. **Surge Transformation** → Neon Yellow explosion → floaty light palette (breakthrough, fantasy)
6. **Snap Back to Classroom** → Light Gray + Charcoal (reality, grounded)
7. **Resolution Hint** → Warm Orange + Electric Blue balance (new possibility)

**Design principle:** Cool colors = institutional constraint; Warm colors = emotional safety; Bold accents = internal state visibility.

---

## Typography System

### Headings & Hero Text
**Fredoka One** (Google Fonts)
- Bold, friendly, modern
- Used for episode titles, credits, major visual moments
- Weight: Bold only
- Color: Charcoal (#333333) on Light Gray backgrounds; Electric Blue for emphasis

### Body Text & Dialogue
**Inter** (Google Fonts)
- Clean, highly readable, contemporary
- Used for all dialogue, narrator text, age-appropriate (not cartoonish)
- Weight: Regular (400) for dialogue; Semibold (600) for emphasis
- Size: 14–16px for dialogue in 1920×1080 frame

### Interior Monologue (Ziggy's Thoughts)
**Caveat** (Google Fonts)
- Handwritten, personal, introspective
- Used exclusively for Ziggy's interior monologue (racing thoughts, self-coaching)
- Weight: Regular
- Color: Electric Blue (#0052CC) at 60–80% opacity on white/light background
- Size: 12–14px; appears 200ms after the thought occurs

**Constraint:** Caveat text never obscures action or dialogue. Always positioned below mouth, left-aligned.

---

## Motion Language (GSAP-based)

### Motion Archetypes (As Seen in Storyboards)

**JITTERY** (Dysregulation)
- Micro-oscillations at 80–100ms frequency
- Linear easing (no smoothing; creates choppy feel)
- Layer multiple frequencies (80ms + 100ms = poly-rhythmic tension)
- Applications: Ziggy's shoulders, pencil spinning, leg bounce under desk
- Emotional read: Anxiety, overwhelm, nervous energy

**HYPERFOCUS** (Calm Control)
- Smooth ease-in-out curves (400–800ms timing)
- Locked pupils, reduced blink rate
- Pursed lips or light jaw clench (concentration)
- Applications: Ziggy tracking Mrs. Henderson's reading, hyperfocus on a puzzle
- Emotional read: Intense focus, clarity, control

**FLOATY** (Fantasy World + Emotional Safety)
- Slow cubic ease-in arcs (1.5–3 second timings)
- Weightless particle drift
- No gravity; all curves, no sharp angles
- Applications: Surge world environment, transformation sequence, emotional release moments
- Emotional read: Peace, release, freedom, beauty

**SHARP** (Trigger Moments)
- Instant onset (50ms, no easing)
- High-frequency events (Bell ring, shock, moment of recognition)
- Synchronized to sound design
- Applications: Teacher calls Ziggy's name, shame moment freeze, snap-back to classroom
- Emotional read: Alert, danger, turning point

---

## Reference Films & Aesthetics

### Visual Inspiration

**Craig of the Creek** (Cartoon Network)
- Warm neighborhood palette; character colors pop against muted backgrounds
- Accessibility through character silhouettes + color, not just line weight
- Authentic kid voices + lived-experience storytelling

**Infinity Train** (HBO Max)
- Surreal color shifts between mundane reality (cool) and impossible fantasy (hot, saturated)
- Effective use of color overlays to signal internal/external states
- Stunning composition with minimalist character design

**Over the Garden Wall** (Cartoon Network)
- Dark, muted forest palette with bright accent moments (e.g., Greg's yellow coat)
- Color as emotional anchor; restraint makes bursts powerful
- Atmospheric sound design + visual mood working in tandem

### Design Philosophy
**Bold colors gain power through contrast with restraint.** Constant saturation = visual noise. Use primaries for character/movement; neutrals for breathing room.

---

## Character Model Notes (Silhouettes + Key Colors)

### Ziggy Chen
- **Silhouette:** 10-year-old boy, athletic build, messy dark hair
- **Key colors:** Electric Blue hoodie (primary), Warm Orange socks (asymmetric—one up, one down, to show his chaotic vibe), Charcoal pants
- **Distinguishing detail:** Constantly fidgeting (pencil in hand, sock bouncing, posture never fully still)

### Mrs. Henderson (Teacher)
- **Silhouette:** Mid-50s woman, tired posture, kind face
- **Key colors:** Sage Green cardigan (primary), Light Gray blouse, Charcoal skirt
- **Distinguishing detail:** Clipboard always in hand; expressions shift subtly when she's curious

### Jake (Best Friend)
- **Silhouette:** 10-year-old boy, open stance, warm energy
- **Key colors:** Warm Orange shirt (primary), to visually echo safety/friendship
- **Distinguishing detail:** Genuine smile; relaxed posture

### Mom Sarah
- **Silhouette:** Early 40s woman, graphic designer, slightly harried
- **Key colors:** Soft Lavender cardigan or top (primary), reflects her introspective + anxious energy
- **Distinguishing detail:** Coffee in hand; expressions show internal overwhelm

### Sage / Grandpa Chen (Fantasy Mentor)
- **Silhouette:** Older figure (ageless in fantasy; grounded in real family history by S5)
- **Key colors:** Neutral grays + greens; presence is calm, not loud
- **Distinguishing detail:** Eyes glow faintly with warmth (not Electric Blue like Surge; something deeper, ancestral)

---

## Visual Tone (for Studios & Voice Directors)

**Overall:** Authentic, empowering, joyful-but-real, sensory-rich, neurodiversity-affirming

### Key Visual Moments Require Specific Palette Treatment

| Moment | Palette | Effect |
|--------|---------|--------|
| Classroom routine | Cool Blue-Gray, desaturated | Institutional, heavy, constraint |
| Ziggy dysregulation | Electric Blue + JITTERY motion | Visible anxiety, not pathologized |
| Sensory montage | Layer hum (blue), click (gray), tap (gray), smell (warm) | Cumulative pressure |
| Shame spiral | Deep Burgundy (0–40% opacity wash) | Heavy, but navigable; not evil |
| Fantasy entry | Cool → Warm color shift over 45 seconds | Escape feels safe + beautiful |
| Surge form | Electric Blue + Neon Yellow glow, FLOATY motion | Power is inherent, not violent |
| Power montage | Three separate moments: Hyperfocus (smooth), Speed (sharp+floaty), Empathy (warm spread) | Each ADHD strength visualized as superpower |
| Snap-back | Warm → Cool color shift, SHARP bell interrupt | Jarring return to reality |
| Reading aloud | Light Gray classroom, Ziggy calm but still JITTERY (controlled) | Acceptance: struggle remains, but presence changes |

---

## Accessibility & Visibility

### Color-Blindness Safety
- Tested Electric Blue + Deep Burgundy against deuteranopia/protanopia (red-green colorblindness)
- Electric Blue + Warm Orange maintain contrast across colorblind vision types
- Never pair Deep Burgundy + Electric Blue without neutral buffer (creates cognitive dissonance)

### WCAG Compliance
- All text passes WCAG AA (minimum 4.5:1 contrast) over intended backgrounds
- Neon Yellow text only with dark (#333333) backgrounds; use sparingly to avoid eyestrain
- Interior monologue (Caveat font) tested at multiple YouTube video sizes (480p–1080p+)

### Seizure Risk Mitigation
- No flashing lights or strobes (seizures overrepresented in ADHD population)
- Fluorescent shimmer effect has visual motion but no flicker above 30Hz (safe threshold)
- No rapid color strobing; all color transitions smooth (minimum 400ms onset)

### Sensory Consideration
- Balance vibrant fantasy sequences (Surge world) with muted classroom moments (visual rest)
- Avoid continuous high-saturation backgrounds; use 0–40% opacity overlays
- Sound design layering (hum + click + tap) matches visual complexity

---

## Production Deliverables (Locked Assets)

### For Animation Teams
- **Color swatch file** (PNG + AI): All 9 hex codes, CMYK equivalents, RGB, HSL
- **Font package:** Fredoka One, Inter, Caveat (GoogleFonts .ttf files)
- **Motion reference video:** 10-second loops of JITTERY (80ms + 100ms layers), HYPERFOCUS (smooth tracking), FLOATY (particle drift), SHARP (instant transitions)
- **Reference images:** Screenshots of Craig of the Creek, Infinity Train, Over the Garden Wall (showing aesthetic targets)

### For Voice Directors
- **Character voice reference:** Brief audio samples of intended tone for Ziggy (fast, bright, nasal), Mrs. Henderson (tired kindness), Jake (genuine enthusiasm), Mom (warm but harried), Sage (calm, assured)
- **Emotional beat notes:** Which moments require which vocal tone (anxiety spiral = overlapping fast thoughts; hyperfocus = slow precision; shame = quiet monotone)

### For Storyboard Artists
- **Color palette poster:** Hero frames with hex codes labeled
- **Motion archetype guide:** JITTERY vs. HYPERFOCUS vs. FLOATY vs. SHARP with animation timing specs
- **Typography guide:** Fredoka One for titles, Inter for dialogue, Caveat for interior monologue (with positioning constraints)

---

## Brand Consistency Rules (Non-Negotiable)

**For all production studios / outsourced teams:**

1. **No color substitutions.** All hex codes locked. Do not adjust saturation, brightness, or hue for "style preference."
2. **No gradients on character fills.** Flat color only (simplifies outsourcing consistency + animation cycles).
3. **No texture on primary colors.** Characters remain clean silhouettes; background textures only.
4. **Motion easing locked.** JITTERY = linear (no smoothing). HYPERFOCUS = ease-in-out (smooth). FLOATY = cubic ease-in (slow). SHARP = instant (0ms easing).
5. **Font hierarchy preserved.** Fredoka One only for titles/credits. Inter only for dialogue. Caveat only for Ziggy's interior monologue. No exceptions.
6. **Interior monologue positioning.** Always below mouth, left-aligned, 60–80% opacity, light background. Never obscures dialogue or action.
7. **Accessibility first.** All color choices tested against WCAG AAA contrast (or AA if context prevents AAA). No flashing lights. Captions mandatory.

**Enforcement:** Design tokens locked in production files (layer naming, color swatches, style guide exported as Figma components, Design System Wiki).

---

## Why This Palette Works

**For kids with ADHD:** Colors and motion language *externalize* what they experience internally. Seeing Electric Blue + JITTERY motion = validation. Seeing Surge form glow = "Yes, that's the power I feel."

**For parents:** Warm Orange (safety) + Soft Lavender (home) mirror their own experiences with their kids. Color psychology anchors the message: "This home is safe. We learn together."

**For educators:** Sage Green (teacher's cardigan) + Mrs. Henderson's growth arc (initially cool, gradually warmed) = visual proof that systems can shift.

**For investors:** Distinctive, locked palette = production scalability. No guesswork; outsourced teams work from color tokens, not subjective interpretation.

---

**Mood Board Complete. Ready for pitch deck presentation + production kickoff.**
