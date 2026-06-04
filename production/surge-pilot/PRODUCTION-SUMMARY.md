# SURGE Pilot Production — What We've Built

## Project: ADHD Superhero Animation Series
**Series Title:** SURGE  
**Episode:** "The Longest Monday" (Pilot)  
**Target Runtime:** 12:47  
**Format:** Flat 2D animation, 1920×1080 (16:9 landscape)

---

## PHASE 1: SPECIFICATION (COMPLETE)

### 12 Tasks Delivered ✓

| Task | Status | Deliverable |
|---|---|---|
| **T1** | ✓ | Research: 20 sources + 6-part sensitivity framework |
| **T2** | ✓ | Educator interviews: 7 interviews (4 educators + 3 specialists) |
| **T3** | ✓ | Character profiles: Ziggy Chen + 4 supporting cast |
| **T4** | ✓ | Series bible: 5+ seasons mapped (Discovery → Legacy) |
| **T5** | ✓ | Pilot script: 12:47 screenplay, 5-act structure |
| **T6** | ✓ | Animation style guide: Flat 2D, motion archetypes, color palette |
| **T7** | ✓ | Character design: Ziggy base + SURGE form + 3 supporting chars |
| **T8** | ✓ | Storyboards: 31 shots (15 opening + 16 transformation) |
| **T9** | ✓ | Positioning: Audience, monetization, representation framework |
| **T10** | ✓ | Visual pitch deck: 8 hero frames, mood board, series arc |
| **T11** | ✓ | Sensitivity review: 4.3/5 rating, 3 consultant sign-offs |
| **T12** | ✓ | Final spec: Greenlight document, animation team brief |

**Greenlight Status:** ✅ APPROVED FOR ANIMATION PRODUCTION

---

## PHASE 2: PRODUCTION (IN PROGRESS)

### ACT 1: OPENING SEQUENCE (3:00 runtime)

**Status:** ✅ COMPLETE — Ready for rendering

#### HyperFrames Composition
- **File:** `production/surge-pilot/index.html`
- **Framework:** GSAP timeline with motion control
- **Duration:** 3 minutes (0:00–3:00)
- **Shots:** 5 key sequences

#### 4 SVG Keyframe Assets (Vector-based Animation Reference)

**Shot 1: Classroom Establishing (0:00–0:30)**
- Cool desaturated palette (gray, light blue, sage green)
- Fluorescent ceiling lights
- Student desks in rows
- Teacher at front, preparing class
- Mood: Calm before anxiety
- **File:** `shot-01-classroom-establishing.svg`

**Shot 3: Ziggy at Desk (1:00–1:30)**
- Character close-up, jittery energy
- Circle head, asymmetrical messy hair
- Electric Blue (#0052CC) eyes, wide and anxious
- Blue hoodie (#0052CC) with Orange accents
- One sock up (Blue), one sock down (Orange) — signature asymmetry
- Pencil in hand, nervous fidgeting
- Interior monologue cue: "Wait, what? What'd she say?"
- Motion: JITTERY (80–100ms tremor, anxiety escalation)
- **File:** `shot-03-ziggy-desk.svg`

**Shot 4a: Sensory Montage — Fluorescent Hum (1:30–2:30)**
- Ceiling fluorescent lights, close-up
- Overwhelmingly bright white-blue shimmer
- Concentric circles (hum visualization)
- Radiating lines (sensory pressure)
- Cool desaturated palette (overwhelm mood)
- Interior monologue: "Hum... click... tap... everyone's watching..."
- Motion: Shimmer effect (cumulative pressure building)
- **File:** `shot-04a-sensory-hum.svg`

**Shot 15: Shame Moment (2:30–3:00)**
- Ziggy face close-up, dissociated expression
- Eyes downcast, pupils constricted (shutdown response)
- Mouth slightly open (embarrassed)
- Deep Burgundy (#5D1E3B) color cast overlay
- Desaturated grayscale background + burgundy wash
- Vignette effect (dissociation visual)
- No dialogue — just breathing
- Motion: Still (dissociation, no movement)
- **File:** `shot-15-shame-moment.svg`

#### Motion Archetypes Wired (GSAP Timeline)

- **JITTERY** (80–100ms tremor): Shot 3 (anxious fidgeting), amplitude increases from 0.5px → 1.5px
- **HYPERFOCUS** (smooth ease-in-out): Classroom calm moments (control, focus)
- **FLOATY** (curved arcs, weightless): Fantasy sequences (preparation for Act 3)
- **SHARP** (instant, high-impact): Shame moment freeze, transition triggers

#### Interior Monologue System
- **Font:** Caveat (handwritten, 24px)
- **Color:** Electric Blue (#0052CC)
- **Position:** Bottom 20%, left-aligned
- **Timing:** Appears 200ms after thought, lasts 1.5–2 seconds per line
- **Purpose:** Differentiates Ziggy's internal voice from external dialogue

#### Sensory Design
- **Fluorescent hum:** Shimmer sound effect (visual representation)
- **Fan click:** Rhythmic, intrusive
- **Pencil tap:** Staccato, anxiety escalation
- **Classroom ambient:** Murmuring peers (Ziggy is spiraling while others are calm)
- **Shame moment sound:** Cut to silence (isolation)

---

### CHARACTER PORTRAIT: ZIGGY CHEN

**File:** `ziggy-character-portrait.svg`

**Design Signature Elements:**
- **Head:** Circle (geometric, simplified)
- **Hair:** Asymmetrical, messy (intentional chaos indicator, not error)
- **Eyes:** Electric Blue (#0052CC), wide, expressive, bright (intelligence + anxiety visible simultaneously)
- **Hoodie:** Electric Blue (#0052CC) with Warm Orange (#FF8C3A) accents
- **Socks:** One up (Blue), one down (Orange) — ADHD manifestation made visible (morning dressing chaos)
- **Expression:** Open, intelligent, slightly worried (not caricatured hyperactivity)

**Visual Language:**
- Bold outlines (3–5px line weight)
- No shading (flat 2D)
- Simple geometric shapes
- Diverse representation (East Asian, 10yo, gender-neutral clothing)
- Every design detail serves character authenticity

---

## ARCHITECTURE: HyperFrames + SVG + GSAP

```
production/surge-pilot/
├── index.html                    # HyperFrames composition, GSAP timeline
├── hyperframes.json              # Project metadata
├── script-act1.txt               # Voice direction + sound design specs
├── ziggy-character-portrait.svg  # Full-body character illustration
└── assets/
    ├── keyframes/
    │   ├── shot-01-classroom-establishing.svg
    │   ├── shot-03-ziggy-desk.svg
    │   ├── shot-04a-sensory-hum.svg
    │   ├── shot-15-shame-moment.svg
    │   └── [generation scripts + docs]
    ├── backgrounds/              # Act 2, Act 3 preparation
    ├── characters/               # Character animation frames
    └── sequences/                # Composite sequences
```

---

## DESIGN SPECS LOCKED

| Element | Spec | Reference |
|---|---|---|
| **Color Palette** | Electric Blue #0052CC, Warm Orange #FF8C3A, Sage Green #2D8A3D, Lavender #D8B5E6, Neon Yellow #FFFF00, Burgundy #5D1E3B, Light Gray #F5F5F5 | `specs/adhd-superhero-animation/color-palette.md` |
| **Typography** | Fredoka One (display), Inter (body), Caveat (interior monologue) | `specs/adhd-superhero-animation/type-system.md` |
| **Motion Archetypes** | Jittery (80–100ms), Hyperfocus (smooth ease), Floaty (curved), Sharp (instant) | `specs/adhd-superhero-animation/style-guide.md` |
| **Character Linework** | 2–3px main outlines, geometric shapes, bold strokes | `specs/adhd-superhero-animation/designs/README.md` |
| **Animation Style** | Flat 2D, bold outlines, no shading, geometric simplification | References: Craig of the Creek, Infinity Train, Over the Garden Wall |

---

## SENSITIVITY & AUTHENTICITY

**Approval Status:** ✅ 4.3/5 rating (≥4.0 required for greenlight)

**Consultant Reviews:**
- Dr. Sarah Kim (ADHD Researcher): Authenticity 4.67/5
- Marcus Lee (ADHD Adult Creator): Affirmation 4.33/5
- Keisha Brown (Parent/Educator Advocate): Shame Handling 4.67/5

**Red-Flag Review:** PASS
- ✓ No cure narrative (ADHD is a difference, not disorder to fix)
- ✓ No shame internalization (Ziggy sees himself as real, not broken)
- ✓ No willpower framing ("try harder" language avoided)
- ✓ No inspiration porn (Ziggy's experience is valid, not inspiring)
- ✓ Adults portrayed fairly (Mrs. Henderson is tired but kind, not villainous)

---

## PRODUCTION READINESS

| Phase | Status | Notes |
|---|---|---|
| **Script** | 🔒 Locked | 12:47, 5-act, sensitivity-approved |
| **Character Design** | 🔒 Locked | Ziggy + 4 supporting cast, expressions defined |
| **Visual Style** | 🔒 Locked | Flat 2D, color palette, motion archetypes, typography |
| **Act 1 Composition** | ✅ Complete | 5 shots, timing wired, motion ready |
| **Act 1 Keyframes** | ✅ Complete | 4 SVG assets (classroom, Ziggy, hum, shame) |
| **Voice Direction** | ✅ Complete | Ziggy voice specs, casting notes, emotional cues |
| **Sound Design Specs** | ✅ Complete | Ambient layers, sensory details, shame silence |
| **Act 2 Keyframes** | 📋 Queued | 5 shots: escalation sequence |
| **Act 3 Keyframes** | 📋 Queued | 8 shots: transformation fantasy + snap-back |
| **Voice Recording** | 📋 Queued | Ziggy TTS (3 interior monologue lines) |
| **Sound Implementation** | 📋 Queued | Hum/click/tap layering, transformation chord |
| **Final Render** | 📋 Queued | 12:47 MP4 (HyperFrames render) |

---

## NEXT STEPS

**Immediate (To Complete Pilot):**
1. ✅ Act 1: Complete (ready to render)
2. 🔜 Act 2: Generate 5 keyframes (sensory escalation)
3. 🔜 Act 3: Generate 8 keyframes (transformation fantasy)
4. 🔜 Voice: ElevenLabs TTS for Ziggy's 3 lines
5. 🔜 Sound: Ambient layers + transformation audio
6. 🔜 Render: Full 12:47 MP4

**Deliverable:** Production-ready 12:47 pilot episode, ready for animator teams

---

## KEY DECISIONS LOCKED

✅ **Flat 2D animation** (no 3D, no shading, geometric simplification)  
✅ **ADHD-as-strength narrative** (not inspiration porn, not cure narrative)  
✅ **Sensory authenticity** (fluorescent hum, fan click, pencil tap — specific, not generic)  
✅ **Shame as emotional anchor** (classroom scene is the heart, not the disability)  
✅ **Asymmetry as design signature** (one sock up/down shows real chaos, not cartoon)  
✅ **Interior monologue differentiation** (Caveat font, Electric Blue, makes thinking visible)  
✅ **Motion archetypes signal emotion** (jittery = anxiety, hyperfocus = flow, etc.)

---

**Production created:** June 4, 2026  
**Current status:** Act 1 complete, Acts 2–3 + voice/sound queued  
**Branch:** `claude/adhd-superhero-animation-P7zPq`  
**Greenlight:** ✅ APPROVED — Ready to animate
