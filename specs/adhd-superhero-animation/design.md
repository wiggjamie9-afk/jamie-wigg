# Design: ADHD Superhero Animation

## Approach

Develop the pilot as a fully fleshed-out proof-of-concept that validates tone, character voice, and emotional arc before committing to full series production. The pilot establishes three things: (1) authentic classroom dysfunction as the emotional anchor, (2) the transformation fantasy as visual explosion and emotional release, (3) the series' thematic DNA (each season explores a different ADHD strength). This approach de-risks the greenlight by proving concept + proving team execution on a single episode. Post-pilot, the series bible scales to 50+ episodes.

**Core design choice**: Flat 2D + bold color + kinetic GSAP-style motion (references: *Craig of the Creek*, *Infinity Train*, *Over the Garden Wall*). Cheap to iterate in post; scales across outsourced animation teams; motion language can signal protagonist's inner state (jittery, hyperfocused, floaty, sharp) without dialogue.

## Components

### Protagonist Profile
- **Responsibility**: Define the lead character's ADHD, personality, relationships, and growth arc across the series.
- **Files**: `specs/adhd-superhero-animation/character-profiles.md`, storyboards for pilot emotional beats
- **Interface**: 1–2 page character bio (age, name, family, school life, ADHD manifestations, superpower metaphor, voice reference)
- **Satisfies**: R2, R3, N2

### Supporting Cast
- **Responsibility**: Build distinct voices for teacher, peer, family, and fantasy mentor so they have agency in the story, not just roles.
- **Files**: `specs/adhd-superhero-animation/cast.md`
- **Interface**: 1 paragraph per character (role, conflict with protagonist, what they want, voice/accent)
- **Satisfies**: R3

### Pilot Script
- **Responsibility**: Write 8–12 min screenplay with screenplay format (INT/EXT, action, dialogue, parentheticals). Opens in classroom realism, climaxes in superhero fantasy.
- **Files**: `specs/adhd-superhero-animation/pilot-script.md` (or .pdf for formatting)
- **Interface**: Three-act screenplay (Act 1: classroom frustration + peer conflict; Act 2: shame moment + teacher's dismissal; Act 3: transformation + first superhero act + hook for series)
- **Satisfies**: R1, R4

### Series Bible
- **Responsibility**: Map 5–10 episode arcs, overarching character growth, thematic progression. Each season/arc explores one ADHD-as-strength angle (hyperfocus, rapid-fire idea generation, emotional intensity, pattern-recognition, etc.).
- **Files**: `specs/adhd-superhero-animation/series-bible.md`
- **Interface**: 2–3 sentences per episode; season-level themes; series three-act structure (seasons 1–3 establish superpower, seasons 4–6 navigate social cost + acceptance, seasons 7+ legacy/mentorship)
- **Satisfies**: R4, R7

### Animation Style Guide
- **Responsibility**: Lock visual language (palette, typography, character model sheets, motion archetypes) for replicability across production.
- **Files**: `specs/adhd-superhero-animation/style-guide.md`, reference image boards (Figma or Pinterest links)
- **Interface**: Color palette (hex), type system (font names + sizes), character linework (stroke weight, expression range), motion language (easing curves, timing for "jitter" vs. "focus" states)
- **Satisfies**: R5, N4

### Storyboard Framework
- **Responsibility**: Provide shot-by-shot visual blueprint for animator team (not full storyboard, but key sequences for pilot opening + transformation).
- **Files**: `specs/adhd-superhero-animation/storyboards/` (placeholder frames, shot list, timing notes)
- **Interface**: Shot list with timing, visual notes, dialogue sync points, camera language (close-up for shame, wide for overwhelm, split-screen for dual reality)
- **Satisfies**: R6

### Series Positioning & Sensitivity
- **Responsibility**: Document audience, monetization, representation notes, and sensitivity review process.
- **Files**: `specs/adhd-superhero-animation/positioning.md`
- **Interface**: Target age range + demo; YouTube monetization strategy (sponsorship, Patreon, educator licensing); representation checklist (ADHD adults reviewed script; no cure narrative; no inspiration porn); content warnings if any
- **Satisfies**: R7, N1, N2

## Data

**Character data**: Protagonist age, ADHD subtype mix, family structure, school setting, superpower metaphor.  
**Episode data**: 5–10 episode loglines with act breakdowns.  
**Visual data**: Color palette (≥6 key colors), 2–3 font pairings, character line art (3 expressions minimum per character).  
**Motion data**: 3–5 easing curves (snappy, floaty, jittery, hyperfocus states).  

No external databases required for this spec phase. All data lives in structured markdown + Figma/image boards.

## Risks

- **ADHD representation authenticity**: Pilot could trivialize or romanticize. *Mitigation*: involve ADHD adults (consultants, co-writers) in script draft and review before animation greenlight. Build in 2-week feedback loop.
- **Classroom authenticity credibility**: Generic teacher-ignores-student cliché undermines emotional anchor. *Mitigation*: interview 3–5 actual K–8 teachers; capture specific frustrations (homework policies, grading, peer exclusion) not stereotypes.
- **Scaling pilot to series**: Pilot tone/budget may not scale to 50+ episodes. *Mitigation*: style guide designed with outsourced teams in mind; animation outsourcing plan locked before production greenlight.
- **Age-gating risk**: Content must be genuinely for kids 8–12, not just adults. *Mitigation*: test pilot with actual 3rd–6th graders; iterate based on feedback before series commitment.
