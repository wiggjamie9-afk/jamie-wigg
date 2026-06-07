# SURGE Episode 1 - Voice Generation Guide

## Overview

This directory contains professional voice narration and dialogue for all 6 characters in SURGE Episode 1: "Discover". All audio files are generated using ElevenLabs Text-to-Speech (TTS) via the creative-stack MCP server.

**Total Lines:** 32 dialogue/narration segments
**Total Characters:** 6
**Target Runtime:** 13 minutes (animated series)

---

## Directory Structure

```
audio/
├── ZIGGY/              (9 voice files)
├── MIRA/               (7 voice files)
├── ECHO/               (4 voice files)
├── MS_CHEN/            (7 voice files)
├── JORDAN/             (2 voice files)
├── KAI/                (2 voice files)
├── MANIFEST.json       (complete metadata)
├── VOICE_SETTINGS.json (character voice configs)
└── README.md           (this file)
```

---

## Character Voice Profiles

### 1. ZIGGY - Energetic Boy (11-13 years old)

**Voice Characteristics:**
- Young, bright, enthusiastic energy
- Natural delivery with vocal excitement
- Emphasizes key concepts with clear articulation
- Optimistic, forward-thinking tone

**Files Generated:** 9
```
- ziggy_vo_1.mp3         "Every single day is an adventure..."
- ziggy_vo_2.mp3         "School says I have ADHD..."
- ziggy_vo_3.mp3         "But what if it's a SUPERPOWER?"
- ziggy_dialogue_1.mp3   "Mira! Did you see the reflection..."
- ziggy_dialogue_2.mp3   "A MAGICAL puddle."
- ziggy_dialogue_3.mp3   "You're not my enemy..."
- ziggy_vo_power.mp3     "This is who I am..."
- ziggy_vo_transform.mp3 "I'm not trying to be normal..."
- ziggy_finale.mp3       "My name is Ziggy..."
```

**Key Emotional Beats:**
- Wonder and discovery (opening V.O.s)
- Realization and empowerment (dialogue with Echo)
- Confidence and transformation (power V.O.s)

---

### 2. MIRA - Supportive Friend (11-13 years old)

**Voice Characteristics:**
- Calm, warm, grounded tone
- Slightly more mature-sounding than Ziggy
- Patient and reassuring delivery
- Supportive, anchoring presence

**Files Generated:** 7
```
- mira_1.mp3     "There you are! You're late again."
- mira_2.mp3     "It's a puddle, Ziggy."
- mira_3.mp3     "Come on. Before we're both detention..."
- mira_4.mp3     "You feel that?"
- mira_5.mp3     "What's wrong?"
- mira_6.mp3     "We're with you."
- mira_7.mp3     "What happens now?"
```

**Key Emotional Beats:**
- Friendly concern (morning scenes)
- Intuitive awareness (noticing chaos)
- Loyal support (final rooftop moment)

---

### 3. ECHO - Chaos Entity

**Voice Characteristics:**
- Distorted, chaotic energy (otherworldly)
- Mocking and menacing initially
- Gradually becomes accepting and powerful
- Non-human, ethereal quality
- Lower stability settings for effect

**Files Generated:** 4
```
- echo_1.mp3          "Ziggy. Finally awake."
- echo_vo_1.mp3       "I'm the part of you that can't focus..."
- echo_transform.mp3  "Then let's see what you can do."
- echo_threat.mp3     "You think you've won?..."
```

**Key Emotional Beats:**
- Menacing introduction (initial awakening)
- Accusatory self-doubt (chaos voice-over)
- Acceptance (responding to Ziggy's power)
- Threatening finale (cliffhanger setup)

**Voice Processing Notes:**
- Lower stability (0.5) allows more distortion
- May require post-processing for ethereal effect
- Consider pitch shifting or reverb in final mix

---

### 4. MS. CHEN - Wise Mentor (Adult)

**Voice Characteristics:**
- Warm, knowing adult voice (teacher/counselor)
- Patient and encouraging
- Authoritative yet compassionate
- Speaks from experience and wisdom

**Files Generated:** 7
```
- chen_1.mp3      "You felt it again, didn't you?..."
- chen_2.mp3      "Because I felt it too..."
- chen_3.mp3      "They call it a disorder..."
- chen_4.mp3      "ADHD isn't a flaw..."
- chen_5.mp3      "The question isn't..."
- chen_6.mp3      "Exactly like that."
- chen_pride.mp3  "Welcome, Ziggy. Welcome to your power."
```

**Key Emotional Beats:**
- Knowing recognition (understanding Ziggy's experience)
- Transformative teaching (reframing ADHD)
- Proud mentorship (final acceptance)

---

### 5. JORDAN - Quiet Observer (11-13 years old)

**Voice Characteristics:**
- Quiet but intelligent
- Thoughtful, introverted
- Clear and sincere
- Minimal dialogue, maximum impact

**Files Generated:** 2
```
- jordan_1.mp3  "See what?"
- jordan_2.mp3  "All of us."
```

**Key Emotional Beats:**
- Innocent observation (what is Ziggy seeing?)
- Quiet solidarity (group support moment)

---

### 6. KAI - Young Child (8-10 years old)

**Voice Characteristics:**
- Young, bright, playful voice
- Infectious enthusiasm and joy
- Higher pitch, energetic delivery
- Innocent wonder

**Files Generated:** 2
```
- kai_1.mp3  "Ziggy! Ziggy! Did you see..."
- kai_2.mp3  "This is SO cool!"
```

**Key Emotional Beats:**
- Excited greeting (cafeteria introduction)
- Awestruck wonder (rooftop revelation)

---

## Voice Generation Settings

| Character | Stability | Similarity Boost | Voice Profile |
|-----------|-----------|------------------|---|
| ZIGGY | 0.75 | 0.85 | Young energetic boy |
| MIRA | 0.75 | 0.75 | Warm supportive girl |
| ECHO | 0.5 | 0.65 | Distorted chaos entity |
| MS. CHEN | 0.85 | 0.8 | Wise adult mentor |
| JORDAN | 0.8 | 0.75 | Quiet observer |
| KAI | 0.7 | 0.8 | Young excited child |

**Note:** Lower stability values (ECHO) create more variation and distortion. Higher values (MS. CHEN) create more consistent, authoritative delivery.

---

## Generation Process

### Using Creative-Stack MCP

All voice files are generated using the `elevenlabs_tts` tool from the creative-stack MCP server.

**Basic Command Structure:**
```
elevenlabs_tts(
  text="<line text>",
  voice_id="<character voice_id>",
  model_id="eleven_monolingual_v1",
  output_format="mp3_44100_128",
  stability=<0.0-1.0>,
  similarity_boost=<0.0-1.0>
)
```

### Quality Checklist

- [ ] All voice files generated at professional quality (128+ kbps MP3)
- [ ] Character voices are distinct and immediately recognizable
- [ ] Narration matches script emphasis and emotional beats
- [ ] Dialogue flows naturally with appropriate pacing
- [ ] Files organized cleanly in character subdirectories
- [ ] Manifest.json created with complete metadata
- [ ] Sample compilation reel created (first 30 seconds of each character)
- [ ] No audio clipping or distortion (except intentional for ECHO)
- [ ] Consistent volume levels across all files

---

## Integration with Animation

### File Naming Convention

Each file follows this pattern:
```
<CHARACTER>_<TYPE>_<NUMBER>.mp3
```

Examples:
- `ziggy_vo_1.mp3` - Ziggy voice-over line 1
- `mira_dialogue_3.mp3` - Mira dialogue line 3
- `echo_vo_final.mp3` - Echo final voice-over

### Timecode Reference

Files can be matched to script timecodes from the master script:

```
0:00-0:45    Act 1, Scene 1 - Opening
0:45-1:45    Act 1, Scene 2 - Walk to School
1:45-2:30    Act 1, Scene 3 - School Entry
2:30-4:00    Act 2, Scene 4 - Cafeteria / Echo Introduction
4:00-4:45    Act 2, Scene 5 - Ms. Chen's Office
4:45-5:30    Act 2, Scene 6 - Realization Montage
5:30-6:45    Act 3, Scene 7 - Rooftop Awakening
6:45-7:30    Act 3, Scene 8 - First Test
7:30-8:15    Act 3, Scene 9 - Cliffhanger
8:15-8:45    Act 3, Scene 10 - Epilogue
```

### Audio Export for Animators

For animation studio integration:

**Recommended Format:**
- Format: MP3 (lossy) or WAV (lossless for final mix)
- Bitrate: 192 kbps (MP3) or 16-bit 44.1kHz (WAV)
- Sample Rate: 44.1 kHz (compatible with most animation software)
- Mono or Stereo: Mono for budget, Stereo for premium

**Directory Structure for Animators:**
```
SURGE_EP1_AUDIO/
├── RAW_VOICEOVER/
│   ├── ZIGGY/
│   ├── MIRA/
│   ├── ECHO/
│   ├── MS_CHEN/
│   ├── JORDAN/
│   └── KAI/
├── COMPILED_AUDIO/
│   ├── surge_ep1_full_VO.mp3      (all character voices mixed)
│   ├── surge_ep1_VO_isolated.mp3  (just narration)
│   └── surge_ep1_DIALOGUE.mp3     (just dialogue)
├── REFERENCE_VIDEO/
│   └── surge_ep1_script_reference.pdf
└── MANIFEST.json
```

---

## Post-Production Notes

### Audio Processing Recommendations

**For ZIGGY:**
- Add light compression (3:1 ratio) to maintain energy consistency
- EQ: Slight boost at 2-4kHz for clarity and presence
- Reverb: Minimal, 0.5-1s tail (indoor dialogue spaces)

**For MIRA:**
- Gentle EQ (reduce 1-2kHz harshness if present)
- Compression: 2:1 ratio for smooth, supportive delivery
- Reverb: Slightly more than Ziggy (slightly more mature space)

**For ECHO:**
- Heavy processing: distortion, pitch shifting, reverb
- Consider layering multiple voice takes with different effects
- Experiment with reverse reverb, granular effects
- EQ: Emphasize low-mids (200-400Hz) for chaotic quality

**For MS. CHEN:**
- Natural delivery with minimal processing
- Compression: 3:1 for authority and consistency
- EQ: Slight high-pass filter (remove sub-100Hz rumble)
- Reverb: Professional indoor space (office, 0.8s tail)

**For JORDAN:**
- Keep very natural and unprocessed
- Minimal reverb to emphasize quiet, thoughtful nature
- Slight compression to bring up quieter moments

**For KAI:**
- Preserve brightness and youthful energy
- Minimal processing (light compression only)
- Slight reverb to match cafeteria/outdoor spaces

### Mixing Strategy

1. **Dialogue vs. Narration:** Separate dialogue (Ziggy with others) from narration (V.O. segments)
2. **Emotional Arc:** Volume slight increases during power moments (particularly Ziggy's final V.O.s)
3. **Group Scenes:** Layer characters with careful panning and spacing
4. **ECHO Transitions:** Smooth transitions from menacing to accepting tone

---

## Delivery Checklist

- [ ] All 32 audio files generated and organized
- [ ] MANIFEST.json created with complete metadata
- [ ] VOICE_SETTINGS.json with voice IDs and settings
- [ ] Sample compilation reel (2-3 minutes) created
- [ ] Quality review completed (no clipping, consistent levels)
- [ ] Backup copies created
- [ ] Animator's integration guide written
- [ ] Post-production recommendations documented
- [ ] Copyright/attribution notes prepared
- [ ] Ready for animation studio handoff

---

## File Size Reference

| Character | Approx. Files | Total Duration | Est. File Size |
|-----------|---|---|---|
| ZIGGY | 9 | 35-40 seconds | ~2.5 MB |
| MIRA | 7 | 20-25 seconds | ~1.5 MB |
| ECHO | 4 | 15-20 seconds | ~1 MB |
| MS. CHEN | 7 | 30-35 seconds | ~2 MB |
| JORDAN | 2 | 3-4 seconds | ~0.3 MB |
| KAI | 2 | 5-6 seconds | ~0.4 MB |
| **TOTAL** | **31** | **~2.5 minutes** | **~7.5 MB** |

---

## Support & Troubleshooting

### Common Issues

**Issue:** Voice sounds robotic or unnatural
- **Solution:** Adjust stability/similarity_boost settings; try multiple takes

**Issue:** Lines too fast or too slow
- **Solution:** Adjust text spacing or regenerate with different voice profile

**Issue:** ECHO effect not distorted enough
- **Solution:** Post-process with audio effects (distortion, reverb, pitch shift)

**Issue:** Character voices sound too similar
- **Solution:** Use distinctly different voice IDs from ElevenLabs; test different profiles

### Performance Optimization

For large projects with many voice lines:
- Generate in batches (5-10 files per batch to avoid rate limiting)
- Cache successful voice generations
- Use consistent voice IDs across characters to ensure coherence

---

## Credits & Attribution

- **Script:** SURGE Episode 1: "Discover" Original Series
- **Voice Generation:** ElevenLabs Text-to-Speech
- **Voice Direction:** Professional character voice mapping
- **Integration:** Creative-stack MCP Server

---

## Version History

| Version | Date | Notes |
|---------|------|-------|
| 1.0 | 2026-06-07 | Initial generation; 32 voice files for all 6 characters |

---

## Next Steps

1. Generate all voice files using the creative-stack MCP server
2. Perform quality review and A/B testing with animator
3. Create sample compilation reel
4. Finalize audio mixing and mastering
5. Package for animation studio delivery
6. Begin animation production with professional voiceover

---

**Questions?** Refer to the SURGE-VOICE-GENERATION-PLAN.md document for detailed technical specifications.
