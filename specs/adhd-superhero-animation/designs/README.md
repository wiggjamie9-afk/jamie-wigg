# Character Design Assets — Asset Checklist & Deliverables

This folder will contain production-ready character model sheets, expression libraries, and animation reference files. This document defines what outsourced animation studios will need to produce, organized by character.

---

## Asset Delivery Strategy

Assets are delivered in **two phases**:

1. **Phase 1 (Pre-production):** SVG model sheets + expression libraries (static, no animation)
2. **Phase 2 (Production):** Animated character rigs + motion libraries (GSAP events, frame-by-frame sequences, particle effect definitions)

All assets live as vector files (SVG) or design-system definitions (Figma), not raster images. This allows animation studios to scale, modify layers, and build custom rigs without quality loss.

---

## Ziggy Chen — Protagonist

### Deliverables Checklist

#### Model Sheet (SVG)
- [ ] **File:** `ziggy-model-sheet.svg`
- [ ] **Content:**
  - Front view (standard A pose: arms at sides, feet shoulder-width apart)
  - Side view (profile: posture shows slight forward curve, restless weight shift)
  - 3/4 view (three-quarters angle: shows dimensional form, hair depth, gesture readiness)
  - All body parts labeled: head, hair, eyes, mouth, torso, arms, hands, legs, feet, hoodie layers, socks, sneakers
  - **Scale reference:** Grid overlay (e.g., 8px grid) for consistent proportional scaling across episodes
  - **Line weight demonstration:** Show 2.5px main outline, 1.5px details side-by-side
  - **Color swatches:** Electric Blue #0052CC (hoodie), Warm Orange #FF8C3A (accents), skin tone #E8D4B8

#### Expression Sheet (PNG + SVG)
- [ ] **Files:** 
  - `ziggy-expressions.png` (high-res export, 1920×1080 transparent background)
  - `ziggy-expressions.svg` (editable source for animation teams)
- [ ] **Content (3 expressions × 1 view = 3 frames):**
  1. **Neutral/Observing** — Facing forward, pupils scanning right, slight smile, posture upright with weight on one leg
  2. **Shame/Overwhelm** — Facing forward, pupils downcast or squeezed, mouth downturned, shoulders hunched, body curved inward
  3. **Hyperfocus/Joy** — Facing forward, pupils wide and locked forward, open smile reaching eyes, shoulders back, body open
- [ ] **Dimensions per expression:** 400×600px (portrait orientation, readable at animation size)
- [ ] **Emotional color tints (optional, for reference):**
  - Shame: slight Deep Burgundy tint (#5D1E3B at 20% opacity) for mood reference (animators may or may not use)
  - Hyperfocus: slight Neon Yellow glow (#FFFF00 at 15% opacity) for mood reference

#### SURGE Superhero Form (SVG)
- [ ] **File:** `ziggy-surge-form.svg`
- [ ] **Content:**
  - Front view: head with standing hair, body with electricity outline, full aura (Neon Yellow glow)
  - Side view: electric pose (dynamic, ready for action)
  - 3/4 view: showing depth of aura and particle effect placement
  - **Effect demonstrations:**
    - Electrical sparkles: 2–4px circles, opacity 0.7, positioned around body perimeter (file includes sparkle positions + timing notes)
    - Aura glow: 3–5px blur, Neon Yellow #FFFF00, opacity 0.6 (shown as separate layer)
    - Lightning bolts: accent shapes on sleeves/torso (provided as SVG paths)

#### Clothing Variants (SVG Library)
- [ ] **File:** `ziggy-clothing-variants.svg`
- [ ] **Content (layer per variant):**
  1. **Base hoodie:** Full blue hoodie + orange trim (default)
  2. **Hoodie off:** T-shirt reveal (plain shirt, color TBD in consultation with design lead)
  3. **Summer shirt:** Short-sleeved shirt, color TBD (used for warm-weather episodes/flashbacks)
  4. **Sports uniform:** Soccer kit variant (if sports episode requires custom attire)
- [ ] **Instruction:** Provide as swappable layers in SVG; animators can toggle visibility per scene

#### Hair Variations (SVG Library)
- [ ] **File:** `ziggy-hair-variants.svg`
- [ ] **Content (layer per variant):**
  1. **Messy (default):** 3–4 wispy strokes, asymmetrical, morning-bedhead style
  2. **Wind-blown:** Strokes blown back/sideways, action pose reference
  3. **Wet:** Darker tone, closer to head, dripping suggestion
  4. **Bed-hair:** Extra messy, one side flattened (waking-up scene reference)
- [ ] **Animation notes:** Include 2–3 second loop suggestions for floating/drifting motion (hair moves even at rest)

#### Fidgeting Poses & Loops (SVG Library)
- [ ] **File:** `ziggy-fidget-library.svg`
- [ ] **Content (6–8 loop-able animations):**
  1. **Pencil spin:** Hand holds pencil between fingers, rotates 360°, 2–3 sec loop
  2. **Finger tap:** All fingers tap desk/surface in rhythm, 1.5–2 sec loop
  3. **Leg bounce:** Sitting, leg bounces up-down, 2 sec loop
  4. **Arm wrap:** Arms cross body, self-hug tension, gentle sway, 3 sec loop
  5. **Teeth chew:** Mouth moves (jaw clenching/release), minimal expression change, 1 sec loop
  6. **Weight shift:** Standing, weight transfers side-to-side, 2 sec loop
- [ ] **Timing notes per loop:** Start point, end point, seamless chain-ability, recommended opacity for background fidgeting (e.g., 70% opacity while dialogue plays)

---

## Mrs. Henderson — Supporting Cast

### Deliverables Checklist

#### Model Sheet (SVG)
- [ ] **File:** `mrs-henderson-model-sheet.svg`
- [ ] **Content:**
  - Front view (standard upright posture, centered weight, hands at sides)
  - Side view (slight forward curve from desk work, shows grounded stance)
  - 3/4 view (shows cardigan depth, hair texture, age-appropriate features)
  - All body parts labeled: head, hair, eyes, mouth, torso, cardigan, blouse, pants, shoes, hands
  - **Scale reference:** Grid overlay (consistent with Ziggy sheet for comparative sizing)
  - **Color swatches:** Sage Green #2D8A3D (cardigan), neutral blouse (#FFFAF0 cream or #E8E0D0 tan), Charcoal #333333 (outlines, shoes)

#### Expression Sheet (PNG + SVG)
- [ ] **Files:**
  - `mrs-henderson-expressions.png` (1920×1080 transparent)
  - `mrs-henderson-expressions.svg` (editable)
- [ ] **Content (3 expressions × 1 view):**
  1. **Professional/Routine** — Facing forward, pupils calm and forward-looking, neutral or soft smile, hands gesturing (teaching mode)
  2. **Concern/Confusion** — Facing toward Ziggy (3/4 angle), eyebrows slightly furrowed, head tilted, mouth slightly open with worry line
  3. **Recognition/Warmth** — Facing forward, eyes bright with crinkles, warm genuine smile, hand extended toward Ziggy (encouragement gesture)
- [ ] **Dimensions per expression:** 400×600px
- [ ] **Companion gestures:** Show hand positions for each expression (hand on chin for concern, hand on chest for warmth)

#### Clothing Variants (SVG Library)
- [ ] **File:** `mrs-henderson-clothing-variants.svg`
- [ ] **Content:**
  1. **Cardigan on:** Full Sage Green cardigan over blouse (default)
  2. **Cardigan off:** Blouse only (warm classroom, rolled-up sleeves optional)
  3. **Formal variant:** Blazer instead of cardigan (if special event episode)
- [ ] **Note:** Pants and shoes remain consistent across all variants

---

## Jake — Peer / Best Friend

### Deliverables Checklist

#### Model Sheet (SVG)
- [ ] **File:** `jake-model-sheet.svg`
- [ ] **Content:**
  - Front view (upright, grounded, athletic posture)
  - Side view (shows coordinated stance, relaxed shoulders)
  - 3/4 view (athletic grace, natural proportions)
  - All body parts labeled: head, hair, eyes, mouth, torso, shirt, shorts/pants, shoes, hands
  - **Scale reference:** Grid overlay (compare to Ziggy—both are 10-year-olds, similar proportions)
  - **Color swatches:** Warm Orange #FF8C3A (shirt), Electric Blue #0052CC (accents), skin tone #D4956E (warm medium), hair color #8B6F47 (warm brown—exact shade to be finalized with design lead)

#### Expression Sheet (PNG + SVG)
- [ ] **Files:**
  - `jake-expressions.png` (1920×1080 transparent)
  - `jake-expressions.svg` (editable)
- [ ] **Content (3 expressions × 1 view):**
  1. **Joy/Enthusiasm** — Facing forward, pupils bright and forward, open smile, forward-leaning posture, one arm reaching
  2. **Concern/Confusion** — Facing Ziggy, eyebrows furrowed, pupils soft but focused, head tilted, hand extended (wants to help)
  3. **Loyalty/Determination** — Facing forward or toward Ziggy, confident smile, arm around Ziggy's shoulder or reaching, grounded stance
- [ ] **Dimensions per expression:** 400×600px

#### Clothing Variants (SVG Library)
- [ ] **File:** `jake-clothing-variants.svg`
- [ ] **Content:**
  1. **School clothes:** Orange shirt + blue shorts (default)
  2. **Soccer uniform:** Team jersey variant (if soccer episode)
  3. **Casual play:** T-shirt variant (park/playground scenes)
- [ ] **Footwear:** Sneakers consistent across variants

---

## Sarah Chen — Mom

### Deliverables Checklist

#### Model Sheet (SVG)
- [ ] **File:** `sarah-chen-model-sheet.svg`
- [ ] **Content:**
  - Front view (upright, engaged posture, hands often in motion)
  - Side view (shows petite build, energetic stance with slight shoulder tension)
  - 3/4 view (shows hair length, blouse detail, hands carrying something—phone, keys, mug)
  - All body parts labeled: head, hair, eyes, mouth, torso, blouse, jeans/pants, shoes, hands with held objects
  - **Scale reference:** Grid overlay (adult height, petite build—show proportional difference from Ziggy and Jake)
  - **Color swatches:** Soft Lavender #D8B5E6 (blouse), skin tone #E8D4B8 (matches Ziggy), hair #2B1B15 (matches Ziggy), Charcoal #333333 (details)

#### Expression Sheet (PNG + SVG)
- [ ] **Files:**
  - `sarah-chen-expressions.png` (1920×1080 transparent)
  - `sarah-chen-expressions.svg` (editable)
- [ ] **Content (3 expressions × 1 view):**
  1. **Loving/Present** — Facing Ziggy, warm eyes with crinkles, open smile, hand reaching toward Ziggy (hug or reassurance)
  2. **Overwhelmed/Frustrated** — Facing forward or away, eyes strained, tight mouth line, shoulders up, hand to face (stress signal)
  3. **Recognition/Understanding** — Facing Ziggy or inward, eyes bright with emotional clarity, peaceful smile, possible tears, hand on heart
- [ ] **Dimensions per expression:** 400×600px

#### Clothing Variants (SVG Library)
- [ ] **File:** `sarah-chen-clothing-variants.svg`
- [ ] **Content:**
  1. **Home casual:** Lavender blouse + jeans (default, evening/home scenes)
  2. **Work outfit:** Blazer variant (if workplace scene)
  3. **Pajamas:** Nightwear variant (bedtime scene, vulnerable moment)
- [ ] **Accessories:** Watch, phone, keys shown in separate layers (can toggle for scene-specific props)

---

## Sage — Imagined Mentor (Optional for Pilot; Full Design for Extended Episodes)

### Deliverables Checklist

#### Model Sheet (SVG)
- [ ] **File:** `sage-model-sheet.svg`
- [ ] **Content:**
  - Front view (seated, calm posture, hands in lap or open gesture)
  - Side view (shows tall/graceful profile, flowing robe)
  - 3/4 view (shows peaceful presence, hair flowing)
  - All body parts labeled: head, hair, eyes, mouth, torso, robe, hands
  - **Scale reference:** Grid overlay (adult height, elder proportions—slightly taller than Mom)
  - **Color swatches:** Sage Green #2D8A3D (robes), skin tone #E0D0C8 (warm light), hair #C0C0C0 (silver-gray), eyes #2D8A3D (sage-colored pupils)

#### Expression Sheet (PNG + SVG)
- [ ] **Files:**
  - `sage-expressions.png` (1920×1080 transparent)
  - `sage-expressions.svg` (editable)
- [ ] **Content (1 primary expression, 1 optional variant):**
  1. **Peaceful Understanding** — Facing Ziggy or forward, calm eyes, knowing smile, hand gesture (open, receptive)
  2. **Wise Guidance (optional):** Hand raised, gentle instruction gesture, eyes closed or looking inward
- [ ] **Dimensions per expression:** 400×600px
- [ ] **Visual distinction:** Softer outlines (2px + slight blur) vs. reality characters (2.5px sharp); indicates dreamlike/imagined quality

---

## Color Reference File

### Deliverable: Design Token Swatch File
- [ ] **File:** `surge-color-palette.ase` (Illustrator) or Figma color library link
- [ ] **Content:**
  - **Primary palette:** Electric Blue #0052CC, Warm Orange #FF8C3A, Sage Green #2D8A3D, Soft Lavender #D8B5E6
  - **Accent palette:** Neon Yellow #FFFF00, Deep Burgundy #5D1E3B
  - **Neutral palette:** Light Gray #F5F5F5, Charcoal #333333
  - **Skin tones:** Warm Tan #E8D4B8, Light Tan #E0D0C8, Medium #D4956E
  - **Character primaries:** Ziggy-Blue #0052CC, Mrs-H-Green #2D8A3D, Jake-Orange #FF8C3A, Sarah-Lavender #D8B5E6, Sage-Green #2D8A3D, Hair-Dark #2B1B15, Hair-Silver #C0C0C0
- [ ] **Usage:** All animators must import this swatch file into their software before beginning work. No color substitutions.

---

## Animation Reference Notes (Included with Each Asset)

### Per-Character Animation Guidelines (Text File per Character)

#### Example: `ziggy-animation-notes.txt`
```
ZIGGY CHEN — Animation Guidelines

## Movement Archetype
- JITTERY: Restless, constant micro-motion. Hair floats, fingers tap, weight shifts.
- HYPERFOCUS: Smooth, locked on target, minimal extraneous motion. Eyes stay on goal.
- FLOATY: Fantasy mode (SURGE). Weightless, dreamy, particles drift.

## Eye Motion Rules
- **Baseline:** Pupils dart, scan, look away. NOT locked forward.
- **Concentration:** Pupils lock on target (hyperfocus state). Blink less frequent.
- **Shame/Overwhelm:** Pupils squeezed or downcast. Rapid/excessive blinking possible.
- **SURGE transformation:** Pupils glow Electric Blue + Neon Yellow aura. Maintain lock on target.

## Hair Motion
- Even at rest: Hair drifts/floats 1–2px up-down, continuous 3–4 sec cycle.
- Action: Hair stands on end (electricity effect) or blows with movement.
- Water scene: Hair darkens, clings to head, drips.

## Fidgeting Loops
- Use fidget library (pencil spin, finger tap, leg bounce, arm wrap, etc.)
- Stack fidgets: Multiple fidgets can play simultaneously at different opacity levels (e.g., leg bounce 100% + finger tap 60%)
- During dialogue: Background fidget at 70% opacity while face/mouth drive dialogue
- Seamless: All loops designed to chain infinitely without jump/reset

## Posture Transitions
- Neutral → Shame: Curve inward, 0.3–0.5 sec ease-in-quad
- Neutral → Joy: Shoulders back, 0.2 sec ease-out-quad
- Neutral → SURGE: Explosive glow/aura appear, 0.1 sec pop, hair stands immediate
```

---

## Production File Organization (Recommended)

```
designs/
├── README.md (this file)
├── color-palette/
│   ├── surge-color-palette.ase (Illustrator swatches)
│   └── figma-color-library-link.txt (or direct Figma file)
├── model-sheets/
│   ├── ziggy-model-sheet.svg
│   ├── mrs-henderson-model-sheet.svg
│   ├── jake-model-sheet.svg
│   ├── sarah-chen-model-sheet.svg
│   └── sage-model-sheet.svg
├── expression-libraries/
│   ├── ziggy-expressions.svg
│   ├── ziggy-expressions.png
│   ├── mrs-henderson-expressions.svg
│   ├── mrs-henderson-expressions.png
│   ├── jake-expressions.svg
│   ├── jake-expressions.png
│   ├── sarah-chen-expressions.svg
│   ├── sarah-chen-expressions.png
│   ├── sage-expressions.svg
│   └── sage-expressions.png
├── surge-form/
│   └── ziggy-surge-form.svg
├── clothing-variants/
│   ├── ziggy-clothing-variants.svg
│   ├── mrs-henderson-clothing-variants.svg
│   ├── jake-clothing-variants.svg
│   └── sarah-chen-clothing-variants.svg
├── hair-variants/
│   └── ziggy-hair-variants.svg
├── fidget-library/
│   └── ziggy-fidget-library.svg
└── animation-guidelines/
    ├── ziggy-animation-notes.txt
    ├── mrs-henderson-animation-notes.txt
    ├── jake-animation-notes.txt
    ├── sarah-chen-animation-notes.txt
    └── sage-animation-notes.txt
```

---

## Handoff Checklist to Animation Studio

Before sending this folder to outsourced animation teams:

- [ ] All SVG files are production-ready (no edit comments, clean layer names, no hidden layers)
- [ ] Color swatches (.ase or Figma link) are imported and accessible
- [ ] Expression sheets are exported at 1920×1080 PNG with transparent backgrounds
- [ ] Model sheets include grid overlay and scale reference (e.g., "Ziggy head height = 120px")
- [ ] Animation notes are clear and exhaustive (no assumptions about how animators will interpret poses)
- [ ] Character proportions are locked (provide pixel/unit grid so studios can match scale across episodes)
- [ ] Fidget libraries are loop-tested (animators have tested that loops chain seamlessly)
- [ ] All hex colors locked in production files (no drift, no substitution)
- [ ] File naming convention is consistent and documented (studio uses same naming for consistency)

---

## Revision & Iteration Notes

**If animation studio requests changes:**
1. Collect feedback in a single revision request (avoid back-and-forth ping-pong)
2. Document changes in `REVISION_LOG.md` (new file per revision round)
3. Re-export all affected files (e.g., if Ziggy eyes change, re-export model sheet + all expressions + SURGE form)
4. Confirm color consistency after changes (run colorblindness simulator if colors touched)
5. Re-test fidget loops if any motion-driven assets changed

---

## Questions for Design Lead / Production Before Asset Finalization

- [ ] Jake's exact ethnicity/cultural background confirmed with sensitivity panel?
- [ ] Sage's cultural/ethnic presentation finalized (currently ambiguous)?
- [ ] Sarah Chen's work outfit (blazer variant) needed for pilot episode, or defer to Season 1?
- [ ] Any additional character variants needed (seasonal clothing, sports, dream-state aesthetic)?
- [ ] Animation tool preference: will studio use Spine, Puppet Pin, frame-by-frame, GSAP? (Affects SVG layer structure)
- [ ] Are fidget loops GSAP-driven (JavaScript code) or frame-by-frame animation assets?
- [ ] Glow effects (Neon Yellow aura, Electric Blue sparkles): baked into SVG or dynamically generated via code?

---
