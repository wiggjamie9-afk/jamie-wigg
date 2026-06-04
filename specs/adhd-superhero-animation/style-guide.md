# Style Guide: SURGE

**Flat 2D animation system for pilot + series production (50+ episodes, multi-team outsourcing)**

This document locks the visual language so animation teams—whether in-house or contracted—produce consistent characters, motion, and emotional beats across all episodes.

---

## Part 1: Character Linework & Design

### Base Construction Principles

**Philosophy:** Geometric modularity + soft edges. Characters are built from simple shapes (circles, rectangles, triangles) combined and positioned, NOT hand-drawn.

**Why:** Modular design scales across animators. A character designed in Figma as "head circle + body rectangle + limb cylinders" can be animated frame-by-frame by different teams and remain consistent.

### Line Weight & Stroke

- **Main character outlines:** 2.5px stroke
- **Secondary details (hair, clothing folds):** 1.5px stroke
- **UI/background elements:** 1px stroke
- **Stroke color:** Dark Charcoal #2A2A2A (not pure black #000000; warmer, less harsh in flat 2D)
- **Stroke style:** Solid, rounded line caps (no sharp points; feels friendly)
- **Anti-aliasing:** Enabled (YouTube's video codec handles it smoothly)

### Ziggy Chen — Hero Character

#### Anatomy (Front View)

```
HEAD: Circle, radius 45px (at 1920×1080 canvas)
     └─ Eyes: Two circles (15px each), always moving, pupils are smaller circles
     └─ Hair: Wispy strokes above + sides (messy, not contained), 1.5px, Charcoal
     └─ Mouth: Simple line (straight, curved up, curved down, open—varies by expression)

BODY: Rectangle (60px wide × 90px tall, tapered slightly at waist)
     └─ Color: Cream #FFFEF0 (skin base)
     └─ Clothing: Blue hoodie covers torso (#0052CC), simple hood outline

LIMBS: Cylinders (20px wide, tapered at wrist/ankle)
     └─ Arms: Two cylinders, left + right, can rotate 360° at shoulder
     └─ Legs: Two cylinders, can rotate 180° at hip (no knee bend for simplicity)
     └─ Hands/feet: Simple circles (not detailed)

FEET: Special detail—one sock UP (orange #FF8C3A), one sock DOWN (also orange)
     └─ Signals chaos, ADHD, "one sock on one off" as Ziggy's signature look
     └─ Orange socks = Friendship/Jake connection
```

#### Color Palette (Ziggy)

| Body Part | Color | Hex |
|-----------|-------|-----|
| Skin | Cream | #FFFEF0 |
| Hair | Dark brown/charcoal | #2A2A2A |
| Hoodie | Electric Blue | #0052CC |
| Hoodie zipper accent | Warm Orange | #FF8C3A |
| Socks (both) | Warm Orange | #FF8C3A |
| Eyes (iris) | Dark Charcoal | #2A2A2A |
| Eyes (pupils) | Black | #000000 |
| Eyes (highlight) | White | #FFFFFF |

#### Expression Range (3 Base States Per Character)

**Ziggy's expressions should change RAPIDLY (reflects racing mind). Blink patterns + eye direction = core emotion signal.**

##### Expression 1: Neutral/Alert

- **Eyes:** Forward, pupils center, wide-open (alert, awake, attentive but not focused)
- **Eyebrows:** Horizontal line above each eye (relaxed)
- **Mouth:** Closed, straight line or slight smile
- **Body:** Standing upright or slight bounce (restless energy, feet shift)
- **Usage:** Introductions, listening, moments between big emotions
- **Animation note:** Eyes should dart side-to-side even during "neutral" (signals racing thoughts)

##### Expression 2: Shame/Frustration

- **Eyes:** Downcast OR squeezed shut (inward, avoid), pupils shrink
- **Eyebrows:** Angled downward toward center (worry, sadness, concentration)
- **Mouth:** Downturned (frown), OR clenched (tight line), OR open in desperation
- **Body:** Curved inward, shoulders hunched, head tilted down
- **Posture:** Smaller, takes up less space (self-protective)
- **Usage:** Reading failure, peer rejection, Mrs. Henderson's disappointment, overwhelm
- **Color tint:** Scene takes on Burgundy #5D1E3B overlay (optional, for emotional weight)
- **Animation note:** Micro-jittering on shoulders (unease, fidgeting) even while inward

##### Expression 3: Joy/Hyperfocus/Surge Power

- **Eyes:** Wide, pupils dilated, locked on target OR glowing (in Surge mode)
- **Eyebrows:** Angled upward (openness, joy, excitement)
- **Mouth:** Open smile, teeth visible (unguarded happiness), OR focused intensity (mouth slightly open, tongue peeking)
- **Body:** Leaning forward, dynamic posture, animated limbs
- **Posture:** Larger, takes up more space, expansive
- **Usage:** Soccer goals, reading breakthrough, Surge transformation, moment of belonging
- **Color tint:** Scene floods with Electric Blue #0052CC + Neon Yellow #FFFF00 glow
- **Animation note:** Smooth (no jitter), deliberate movement, laser focus

---

### Supporting Characters (Brief Designs)

#### Jake (10-year-old, enthusiastic peer)

- **Build:** Slightly stockier than Ziggy, energetic posture
- **Head:** Circle (slightly larger radius, 48px)
- **Hair:** Short, spiky, dark (signals athleticism, youth)
- **Outfit:** Orange shirt (#FF8C3A—warm, approachable), blue shorts (friendship mirror of Ziggy)
- **Skin:** Cream #FFFEF0
- **Eyes:** Wide, forward, less darts than Ziggy (neurotypical, stable focus)
- **Expressions:**
  1. Friendly/enthusiastic (smile, eyes bright, forward lean)
  2. Confused/concerned (head tilt, furrowed brow, mouth open)
  3. Proud/celebrating (wide smile, fist pump, dynamic pose)

#### Mrs. Henderson (40s, teacher, tired but caring)

- **Build:** Adult proportions, composed posture (not bouncy)
- **Head:** Oval (44px × 52px, slightly longer to suggest maturity)
- **Hair:** Brown, shoulder-length, often pulled back (practical)
- **Outfit:** Sage Green #2D8A3D cardigan over neutral blouse, practical shoes
- **Skin:** Cream #FFFEF0
- **Eyes:** Smaller pupils, steady gaze (patient but weary), occasional eye-roll (human, imperfect teacher)
- **Expressions:**
  1. Neutral/professional (calm, attentive, kind)
  2. Frustrated/disappointed (downturned mouth, sigh, hand-to-forehead)
  3. Breakthrough/proud (warm smile, eyes crinkled, nod of recognition—"I see you, Ziggy")

#### Mom Sarah (40s, loving, anxious)

- **Build:** Adult, warm, slightly tense shoulders (worry)
- **Head:** Oval (44px × 52px)
- **Hair:** Brown, longer, sometimes tied back (practical + warm)
- **Outfit:** Lavender #D8B5E6 top, neutral pants, homey accessories
- **Skin:** Cream #FFFEF0
- **Eyes:** Warm, concerned (mom energy—sees everything, worries quietly)
- **Expressions:**
  1. Warm/supportive (gentle smile, eyes soft, hand on Ziggy's shoulder)
  2. Worried/anxious (slight frown, hands together, distracted gaze)
  3. Proud/loving (genuine smile, eyes crinkled, full-body hug posture)

#### Sage/Grandpa (60s, wise, gentle, fantasy mentor)

- **Build:** Elderly, slow movement, dignified posture
- **Head:** Circle (46px, slightly fuller for age)
- **Hair:** White/gray, wispy, sparse on top
- **Outfit:** Sage Green #2D8A3D (his color), warm earth tones, soft cardigan
- **Skin:** Cream #FFFEF0 (with subtle age lines, optional shading)
- **Eyes:** Warm, patient, knowing (has seen life, understands struggle)
- **Expressions:**
  1. Wise/calm (soft smile, eyes half-closed in peace, relaxed)
  2. Listening/understanding (nodding, eyes forward, hand on heart)
  3. Encouraging/revealing (eyes bright, pointing, subtle excitement—"you've got this")

---

### Character Model Sheets (Visual Reference)

Each character must have a model sheet document (Figma file or PDF) showing:
1. **Front view** (neutral expression, standing pose)
2. **3/4 view** (twisted torso, shows depth, neutral expression)
3. **Side view** (profile, neutral expression, helps animators understand ear/nose placement)
4. **Expression lineup** (one character, all 3 expressions side-by-side for quick reference)
5. **Pose library** (5–8 common poses: sitting, reaching, celebrating, crying, focusing)
6. **Costume detail** (close-up of fabric folds, zipper details, sock patterns)

**Model sheet output:** Figma file `SURGE_CHARACTER_MODELS.fig` (or exported PDF) shared with all animation contractors.

---

## Part 2: Motion Language & Animation Archetypes

**Zippy's internal state is visible through MOTION, not just expression.**

Each motion archetype represents a psychological/neurological state. Animators should apply archetypes consistently to show Ziggy's mental + emotional journey.

---

### Archetype 1: **JITTERY** (Anxiety, Overstimulation, Restless Energy)

**What it feels like:** ADHD nervous system in overdrive. Eyes moving, body can't stay still, micro-movements everywhere.

#### Characteristics

- **Tremor:** Tiny vibrations on limbs (1–2px offset, 60–100ms frequency, linear easing—no smoothing)
- **Eye movement:** Rapid, staccato pupils (left 200ms, right 200ms, forward 300ms, repeat)
- **Head movement:** Slight fidget side-to-side (20ms bobble, continuous)
- **Foot movement:** Bouncing or tapping (constant, restless)
- **Breathing:** Shallow, visible chest/shoulder rise-fall (80ms cycle)
- **Overall feel:** Unsettled, unable to settle, kinetic without purpose

#### Easing Curve

- **Linear** (no easing, staccato feels authentic to jitter)
- **Frequency:** 60–100ms per micro-jitter cycle
- **Amplitude:** 1–2px (noticeable but not chaotic)

#### Usage in SURGE

- Classroom reading time (Ziggy at desk, struggling to focus)
- Waiting to speak (hand raised, body vibrating)
- Test anxiety moment (before the shame spiral)
- Sensory overload (fluorescent lights, classroom noise)

#### Animation Notes

- **Do NOT:** Smooth out the jitter with ease-in-out (defeats the purpose)
- **Do:** Layer multiple jitters (shoulders + fingers + head) at slightly different frequencies
- **Sync with audio:** Jitter should intensify with classroom noise, tense music

---

### Archetype 2: **HYPERFOCUS** (Flow State, Surge Mode, Competence)

**What it feels like:** The moment everything clicks. Ziggy locks onto a task, and the world falls away. Smooth, deliberate, no wasted motion.

#### Characteristics

- **Movement:** Smooth, intentional, all easing curves applied (no jitter)
- **Eyes:** Laser-locked on target, pupils dilate, no darts or fidgets
- **Posture:** Aligned to task (leaning toward soccer ball, bent over book that makes sense)
- **Breathing:** Deep, slow (clear, controlled)
- **Overall feel:** Flow state, athlete in the zone, precision, mastery

#### Easing Curve

- **Ease-in-out** (smooth acceleration + deceleration, symmetric)
- **Frequency:** 400–800ms per movement (slow, deliberate, no rush)
- **Amplitude:** Full range (no micro-movements, only purposeful motion)

#### Usage in SURGE

- Soccer goal scene (tracking ball, foot kick, celebration)
- Reading breakthrough (eyes locked on text, nodding comprehension)
- Surge transformation (Ziggy aligns with power, becomes still + focused)
- Building/creating moment (hands steady, confident)

#### Animation Notes

- **Do:** Apply easing to every limb (makes flow state obvious)
- **Do:** Reduce blink rate (locked in, no distraction)
- **Avoid:** Tremor or jitter (opposite of hyperfocus)
- **Sync with audio:** Music should shift to minor key or single clear note (focus song)

---

### Archetype 3: **FLOATY** (Fantasy, Surge Superhero World, Escape, Impossible Physics)

**What it feels like:** Dream logic. Ziggy defies gravity, moves through space like swimming through air. Weightless, slow, surreal.

#### Characteristics

- **Gravity:** Nonexistent. Characters hover, drift, ascend without jumping
- **Movement:** Arcing, curved paths (no straight lines)
- **Vertical emphasis:** Characters occupy 3D space (height variation, layering)
- **Velocity:** Slow, gliding (no snappy starts/stops)
- **Particles:** Soft light, sparkles, electrical aura around Surge form
- **Background:** Softly unfocused (bokeh), dreamlike atmosphere
- **Overall feel:** Weightless, impossible, magical, safe (escape from reality)

#### Easing Curve

- **Cubic ease-in** (slow start, accelerates smoothly, then eases out at destination)
- **Timing:** 1.5–3 seconds per floating movement (slow is key)
- **Arc:** Use sine or cosine wave for vertical bobbing (natural float)

#### Usage in SURGE

- Superhero daydream transition (classroom fades, fantasy world emerges)
- Surge form flying/hovering over city
- Magical moment (Grandpa Sage appears, Ziggy's imagination takes flight)
- Escape moment (Ziggy realizes "I have superpowers, I'm not broken")
- Ending of pilot (Ziggy floating toward next episode)

#### Animation Notes

- **Do:** Use 3D perspective (characters at different depths, some small in distance, some large in foreground)
- **Do:** Particle effects (electrical sparkles, light trails, motion blur on Surge)
- **Avoid:** Realistic jump physics (too grounded for fantasy)
- **Sync with audio:** Ethereal music (pad, minor key, maybe Grandpa's voice whispering wisdom)

---

### Archetype 4: **SHARP** (Moment of Truth, Realization, Impact, Punctuation)

**What it feels like:** A sudden moment matters. Everything stops, then one thing moves FAST with NO easing. Emotional or narrative turning point.

#### Characteristics

- **Onset:** Sudden stop/start (all motion freezes, then ONE action happens instantly)
- **Movement:** 50ms or less, no easing (snappy, no smoothing)
- **Lighting:** High-contrast shift (if moment is positive: bright; if negative: shadows)
- **Sound:** Audio stinger (sync with motion—cymbal crash, sharp note)
- **Reaction:** Other characters respond instantly (crowd gasps, teacher notices, etc.)
- **Overall feel:** Punctuation mark, this matters, emotional anchor

#### Easing Curve

- **None** (instant, 50ms snap)
- **Alternative:** Ease-out for aftermath (the sharp moment is instant, then recovery is smooth)

#### Usage in SURGE

- Mrs. Henderson says "Ziggy, that's clever" (sees him clearly, recognizes something true)
- Ziggy realizes "I'm not broken" (internal lightning bolt moment)
- Surge transformation kick-off (Ziggy goes from jittery to hyperfocus to floaty, sharp transition between each)
- Shame moment peaks (Mrs. Henderson's dismissal hits)
- Soccer goal (foot contacts ball, sharp impact, then celebration floats)

#### Animation Notes

- **Do:** Freeze frame (optional, 1 frame hold before/after sharp moment for emphasis)
- **Do:** Use color shift (if shame, saturate burgundy; if joy, flash yellow)
- **Avoid:** Easing (defeats the "sharpness")
- **Coordinate with sound:** Sharp moments MUST have audio sync (dialogue punch, music stinger, sfx impact)

---

## Part 3: Motion Archetypes in Practice

### Example 1: Classroom Reading Time (Full Emotional Arc)

```
[INT. CLASSROOM, 9:05 AM]

JITTERY SETUP (0:00–0:30)
├─ Ziggy at desk
├─ Shoulders vibrating (1.5px, 80ms linear loop)
├─ Eyes dart (left 200ms, right 200ms, forward 300ms, repeat)
├─ Feet bounce under desk (continuous, 100ms)
├─ Breath visible (shallow, 80ms cycle)
├─ Mrs. Henderson: "Please read from page 47"
└─ Audio: Classroom ambient, tense triangle note (minor key)

HYPERFOCUS ATTEMPT (0:30–1:00)
├─ Ziggy locks eyes on book
├─ Jitter STOPS (abrupt, sharp transition)
├─ Easing-in movement: head tilts down (400ms ease-in-out)
├─ Pupils dilate, lock in
├─ Hands steady on book
├─ Breathing slows, deepens
└─ Audio: Tense music fades, single clear note holds

BREAKDOWN (1:00–1:30)
├─ Eyes dart across page, pupils shrink (loss of focus)
├─ JITTER RETURNS (sharp re-onset)
├─ Ziggy's body tenses, then bounces again
├─ Interior monologue appears (Caveat): "Why can't I...?"
├─ Scene tints slightly burgundy (overwhelm)
└─ Audio: Classroom ambient returns, whispers + shuffles

SHAME PEAK (1:30–2:00)
├─ Mrs. Henderson leans in: "Ziggy, are you listening?"
├─ SHARP moment: Scene desaturates, burgundy focus
├─ Ziggy freezes (instant, no easing, 50ms)
├─ Eyes downcast (shame expression)
├─ Body curves inward (self-protective)
├─ Interior monologue: "I'm broken" (burgundy, 60% opacity)
└─ Audio: Sharp string stinger, classroom goes quiet
```

### Example 2: Soccer Goal Scene (Hyperfocus + Sharp Climax + Floaty Celebration)

```
[EXT. SOCCER FIELD, AFTERNOON]

HYPERFOCUS BUILD (0:00–1:00)
├─ Ziggy tracks ball (head follows, eyes locked, ease-in-out)
├─ Breathing deepens
├─ Posture aligns with ball trajectory
├─ No jitter, smooth movements only
├─ Supporting players fade slightly (depth of field)
└─ Audio: Stadium ambient reduces, single clear instrument (flute or bell)

SHARP MOMENT: KICK (1:00–1:05)
├─ Ziggy's foot contacts ball (INSTANT, no easing, 50ms)
├─ Scene flashes white (impact clarity)
├─ Sound stinger: sharp whistle + crowd gasp
└─ Everything freezes for 2 frames (emphasis)

FLOATY CELEBRATION (1:05–3:00)
├─ Gravity disappears
├─ Ziggy ascends slowly (cubic ease-in, 1.5s upward arc)
├─ Ball curves in slow-motion arc (sine wave descent)
├─ Electric blue + yellow glow around Ziggy
├─ Electrical sparkles trail (particle effect)
├─ Jake jumps in slow-mo, reaches toward Ziggy
├─ Background music swells (minor key → major, triumphant)
├─ Ziggy hovers at apex, arms wide, eyes bright
└─ Scene tinted warm orange + yellow (joy, belonging)

RETURN TO REALITY (3:00–3:30)
├─ Fade from floaty fantasy to real soccer field
├─ Ziggy lands (gravity returns, soft landing ease)
├─ Jake hugs him (real moment, solid posture)
└─ Audio: Realistic crowd cheers
```

### Example 3: Surge Transformation (All Archetypes in Sequence)

```
[INT. ZIGGY'S IMAGINATION]

TRIGGER: SHAME → HYPERFOCUS → FLOATY → SHARP

JITTERY SHAME (0:00–0:30)
├─ Ziggy surrounded by classroom overwhelm (visual chaos)
├─ Jitter maxed out (multiple 80ms loops stacked)
├─ Eyes darting wildly
├─ Interior monologue rapid-fire: "Why can't I... I'm not smart... Everyone knows... I'm broken..."
├─ Burgundy tint intensifies
└─ Audio: Staccato strings, tense

HYPERFOCUS MOMENT: "Wait..." (0:30–1:00)
├─ SHARP transition: all jitter stops (instant)
├─ Ziggy's eyes lock onto something (imagined Grandpa Sage)
├─ Breathing slows
├─ Interior monologue shifts: "What if... what if I'm NOT broken?"
└─ Audio: Music clears, single note holds

TRANSFORMATION FLOATY (1:00–2:00)
├─ Ziggy rises (gravity gone, cubic ease-in)
├─ Body shifts to Surge form (simple costume change: cape appears, colors shift to electric blue + yellow)
├─ Electrical aura builds (particles accumulate)
├─ Background transforms (classroom fades, fantasy city emerges)
├─ Surge floats in 3D space, weightless
└─ Audio: Ethereal pad + power chord underneath

SHARP SURGE ACTIVATION (2:00–2:05)
├─ Surge's hand glows (INSTANT yellow + blue flash)
├─ Fredoka One text appears: "SURGE!" (scale-up entrance, yellow)
├─ Sound stinger: electrical whoosh + power chord
├─ All motion freezes for 2 frames
└─ [Reset for next action sequence]
```

---

## Part 4: Animation Outsourcing & Consistency Framework

This style guide is designed for **multi-team production**. When outsourcing animation (domestic or international studios), provide:

### Deliverables to Animation Contractors

1. **Character Design File**
   - Format: Figma `.fig` file (or exported PDF + SVG)
   - Content: Model sheets (front/3/4/side views), expression lineups, pose library, color swatches
   - File name: `SURGE_CHARACTER_PACK_v1.fig`

2. **Motion Reference Library**
   - Format: Figma file with animation curves documented, OR short video examples (10–15 sec clips per archetype)
   - Content: Jittery walk cycle, hyperfocus sit, floaty hover, sharp impact
   - File name: `SURGE_MOTION_ARCHETYPES_v1.mp4` (short, looping examples)

3. **Episode Storyboard + Shot List**
   - Format: PDF with timing, visual notes, motion archetype assignments
   - Content: "Shot 3: Ziggy reading (JITTERY state, 0:30–1:00)"
   - File name: `SURGE_PILOT_STORYBOARD_v1.pdf`

4. **Color Palette Swatch File**
   - Format: Adobe Color, Figma component library, or simple RGB/hex reference
   - Content: All 8 colors (primary, secondary, accent, neutral) with naming + usage rules
   - File name: `SURGE_COLOR_PALETTE_v1.ase` (Adobe Swatch Exchange) or `.fig`

5. **Typography Asset Files**
   - Format: Google Fonts links (free) + weight/size specifications
   - Content: Fredoka One, Inter, Caveat (all weights needed) + size/color rules per component
   - File name: `SURGE_TYPE_SPECS_v1.md` (this document's Part 2)

6. **Animation Playback Checklist**
   - Format: PDF checklist
   - Content: Before rendering, verify motion archetypes match specification
   - File name: `SURGE_QA_ANIMATION_CHECKLIST.pdf`

### Quality Assurance Protocol

**Before any animator's shot goes into edit:**

1. **Motion archetype match:** Shot labeled JITTERY, HYPERFOCUS, FLOATY, or SHARP?
2. **Color accuracy:** Character colors match palette hex codes (±2% tolerance in video export)?
3. **Expression logic:** If scene is shame moment, character uses Shame/Frustration expression (downcast eyes, inward posture)?
4. **Line weight consistency:** Character outlines 2.5px, secondary details 1.5px?
5. **Frame rate sync:** All motion timed to 24fps (no 30fps drift)?
6. **Audio sync:** Text entries/exits sync to dialogue within 100ms?
7. **Typography:** Fonts, sizes, colors match spec exactly?

**Failed QA:** Return shot to animator with specific notes (e.g., "Jitter needs 80ms loop, not 120ms") + reference video. 2-hour revision turnaround SLA.

---

## Part 5: Reference Boards & Mood

**Emotional anchors for the animation team (do NOT over-copy, just reference tone):**

| Reference | Why | Link |
|-----------|-----|------|
| *Craig of the Creek* | Warm, community-focused, kids as capable protagonists, neighborhood safety | [YouTube clip](https://youtube.com/watch?v=...) |
| *Infinity Train* (Season 1) | Surreal color shifts between reality + fantasy, unease + wonder balance | [YouTube clip](https://youtube.com/watch?v=...) |
| *Over the Garden Wall* | Dark + muted baseline with bright moment accents, emotional weight without cruelty | [YouTube clip](https://youtube.com/watch?v=...) |
| GSAP Animation Library | Easing curves (ease-in-out, cubic-ease, linear), timing references | [gsap.com/docs](https://gsap.com/docs/v3/Easing) |
| **SURGE-specific:** Electrical effects (Surge energy) | Lightning, neon glow, particle accumulation | [Reference GIF folder](https://figma.com/...) |

---

## Part 6: Animation Production Roadmap

### Outsourcing Strategy

**Phase 1: In-House Pilot (8–12 weeks)**
- Lead animator creates opening + transformation sequence (establish tone)
- Use this to train contractors on motion language

**Phase 2: Contractors (Episode 2+ Series)**
- Divide scenes by animator (3–5 animators per episode)
- Each animator gets scene breakdown + character pack + motion reference
- Parallel production (different animators work simultaneously)
- Weekly sync calls to flag inconsistencies

**Phase 3: Post-Production (1–2 weeks per episode)**
- Color grading (ensure palette consistency)
- Audio sync (dialogue, effects)
- Export to YouTube specifications (1920×1080, 23.976fps, H.264)

---

## Summary Checklist for Animation Teams

Before rendering ANY episode:

- [ ] **Characters:** All characters match model sheets (linework, colors, proportions)
- [ ] **Expressions:** Shame moments show downcast eyes + inward posture; joy shows wide eyes + forward lean
- [ ] **Motion archetypes:** Jittery scenes have 80ms linear vibration; hyperfocus has ease-in-out smooth; floaty has cubic ease-in arcs; sharp moments have instant 50ms snaps
- [ ] **Colors:** All hex codes match palette within 2% tolerance
- [ ] **Typography:** Fredoka One for titles + yellow moments; Inter for dialogue; Caveat for interior monologue (blue on white background)
- [ ] **Audio sync:** Text appears 100ms after dialogue starts; interior monologue appears 200ms before thought; lasts 1.5–2 sec
- [ ] **Frame rate:** 24fps throughout (no 30fps clips sneaking in)
- [ ] **Contrast:** All text meets WCAG AA (4.5:1 minimum)
- [ ] **Captions:** English CC with [SOUND] cues in all caps
- [ ] **Aspect ratio:** 1920×1080 (16:9 landscape for YouTube)

---

## Revision & Evolution

This style guide is **v1.0** for the pilot. After pilot completion:

1. **Gather feedback** from sensitivity panel, target audience (3rd–6th graders)
2. **Update palette** if colors feel off (too saturated, too muted, cultural feedback)
3. **Refine motion archetypes** based on what works (maybe jitter needs 100ms, not 80ms)
4. **Expand character library** (v1.1 adds side characters, monsters, Grandpa Sage design details)
5. **Lock final version** before Season 1 Episode 2 production (prevents mid-series style drift)

**Next document:** `SURGE_PILOT_STORYBOARD.md` (shot list, timing, motion assignments)
