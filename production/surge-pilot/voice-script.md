# SURGE Pilot — Ziggy Voice Script

**Character**: Ziggy Chen, age 10, mixed ADHD, Midwest neutral
**Voice Profile**: Bright, quick, intelligent, slightly anxious (escalating in Act 1, confident in Act 3)
**Delivery**: Interior monologue — thoughts happening in real-time, slight hesitation as anxiety builds
**Tool**: ElevenLabs TTS or Replicate voice model (character voice mode recommended)

---

## Interior Monologue Lines

### ACT 1: Anxiety Spiral

**Line 1.1** (Shot 3: Ziggy at Desk | 1:00–1:10)
- **Text**: "Wait, what? What'd she say?"
- **Tone**: Confused, caught off-guard, already spiraling
- **Duration**: 1.5–2 seconds
- **Timing**: Appears 200ms after thought begins, stays on-screen for monologue duration

**Line 1.2** (Shot 4a: Sensory Hum | 1:30–2:00)
- **Text**: "Hum... click... tap... everyone's watching..."
- **Tone**: Fragmented, fast, anxious, word-stutter effect (real-time thought stream)
- **Duration**: 2.0–2.5 seconds
- **Timing**: Staggered appearance — each sound appears as Ziggy thinks it

**Line 1.3** (Shot 15: Shame Moment | 2:30–3:00)
- **Text**: [SILENCE — no dialogue, just breathing sound]
- **Tone**: Dissociation, shutdown, no voice
- **Duration**: 30 seconds (no monologue)
- **Timing**: Interior voice completely absent (dissociation indicator)

---

### ACT 3: Transformation + Empowerment

**Line 3.1** (Shot 17: SURGE Form Emergence | 6:00–6:20)
- **Text**: "This is... me. This is who I am."
- **Tone**: Realization dawning, wonder, self-discovery, slight pause between clauses
- **Duration**: 1.8–2.2 seconds
- **Timing**: Slow, deliberate, warm (contrast to Act 1 fragmentation)

**Line 3.2** (Shot 23: Snap Back to Classroom | 9:00–9:30)
- **Text**: "I was never broken. I was just waiting to SURGE."
- **Tone**: Confident, warm, resolved, empowering, slight emphasis on "SURGE"
- **Duration**: 2.0–2.5 seconds
- **Timing**: Calm, mature delivery (not child-like, but genuine kid understanding)

---

## Production Notes

### Ziggy Voice Character Profile
- **Age**: 10 years old (bright, intelligent, but age-appropriate)
- **Accent**: Midwest neutral (no heavy accent — mix of urban Midwest friendliness)
- **Energy**: Quick, engaged, but shifts to calm/resolved by Act 3
- **Anxiety Markers**: 
  - Act 1: fast speech, word hesitation ("what? what'd"), fragmentation
  - Act 3: slower, warm, deliberate pauses
- **Authenticity**: Sounds like a real 10-year-old, not a caricature

### Voice Generation Options

**Option A: ElevenLabs (Recommended)**
- Model: Use "Premade Voice" (bright, young character voice)
- Settings: 
  - Stability: 0.7 (add slight character wavering for anxiety in Act 1)
  - Similarity Boost: 0.8 (maintain consistency across lines)
- Process:
  1. Generate each line individually
  2. Adjust pitch/speed for Act 1 (faster) vs Act 3 (slower, warmer)
  3. Export as WAV (44.1kHz, mono)

**Option B: Replicate Voice Models**
- Try voice model with "child" parameter or "young character" preset
- Adjust temperature/variation for anxiety (Act 1) vs calm (Act 3)

**Option C: Manual Voice Acting**
- Record with a young voice actor (can be synthesized + human-blended)
- Layer over existing monologue system in composition

### Audio Integration
- All lines integrate with `<div class="interior-monologue">` CSS system
- CSS shows text 200ms before audio starts
- Audio duration = text on-screen duration
- Fade in/out: 200ms (smooth, not jarring)

---

## File Output Structure

```
production/surge-pilot/
├── ziggy-voice/
│   ├── line-1-1-wait-what.wav          # "Wait, what? What'd she say?" (2s)
│   ├── line-1-2-sensory.wav            # "Hum... click... tap..." (2.5s)
│   ├── line-3-1-this-is-me.wav         # "This is... me. This is who I am." (2.2s)
│   ├── line-3-2-never-broken.wav       # "I was never broken. I was just waiting to SURGE." (2.5s)
│   └── voice-credits.txt               # TTS model used, voice profile notes
```

---

## Next Steps

1. Generate TTS via ElevenLabs or Replicate (use script above)
2. Export as individual WAV files (44.1kHz, mono)
3. Place in `ziggy-voice/` folder
4. Update `index.html` `<audio>` tags to reference new files
5. Render final 12:47 MP4 with HyperFrames

**Timeline**: Voice generation typically takes 2–5 minutes per line (ElevenLabs)
