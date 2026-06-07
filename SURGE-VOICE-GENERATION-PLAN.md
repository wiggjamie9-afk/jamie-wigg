# SURGE Episode 1 - Voice Generation Plan

**Goal:** Generate professional voice narration for all 6 characters using ElevenLabs TTS via creative-stack MCP server.

**Output Directory:** `/home/user/jamie-wigg/audio/`

---

## Character Voice Assignments & Key Lines

### 1. ZIGGY (Energetic, Optimistic Boy, 11-13)

**Voice Characteristics:**
- Young, bright, enthusiastic energy
- Clear articulation with vocal excitement
- Natural pacing with emphasis on key concepts

**Key Lines to Generate:**

| ID | Text | Type | Duration |
|---|---|---|---|
| `ziggy_vo_1` | "Every single day is an adventure. And every single moment, my brain is BUZZING with a thousand different things." | V.O. | 5-6s |
| `ziggy_vo_2` | "School says I have ADHD. Attention Deficit Hyperactivity Disorder. Sounds like a problem, right? Like something's wrong with me." | V.O. | 5-6s |
| `ziggy_vo_3` | "But what if... it's not a weakness? What if it's actually a SUPERPOWER?" | V.O. | 3-4s |
| `ziggy_dialogue_1` | "Mira! Did you see the reflection in that puddle? It looked like a portal to another dimension!" | Dialogue | 4-5s |
| `ziggy_dialogue_2` | "A MAGICAL puddle." | Dialogue | 1-2s |
| `ziggy_dialogue_3` | "You're not my enemy. You're just... the part of me that's scared." | Dialogue | 3-4s |
| `ziggy_vo_power` | "This is who I am. Not despite my ADHD. Because of it. Every connection my brain makes. Every idea that comes at lightning speed. Every moment of hyperfocus where I lose myself in something I love." | V.O. | 8-10s |
| `ziggy_vo_transform` | "I'm not trying to be normal. I'm going to be EXTRAORDINARY." | V.O. | 3-4s |
| `ziggy_finale` | "My name is Ziggy. I have ADHD. And I'm about to change everything." | V.O. | 4-5s |

**Output Files:**
```
audio/ZIGGY/
├── ziggy_vo_1.mp3
├── ziggy_vo_2.mp3
├── ziggy_vo_3.mp3
├── ziggy_dialogue_1.mp3
├── ziggy_dialogue_2.mp3
├── ziggy_dialogue_3.mp3
├── ziggy_vo_power.mp3
├── ziggy_vo_transform.mp3
└── ziggy_finale.mp3
```

---

### 2. MIRA (Calm, Supportive Mentor Friend, 11-13)

**Voice Characteristics:**
- Warm, patient, grounded tone
- Slightly older-sounding than Ziggy
- Reassuring and supportive energy

**Key Lines to Generate:**

| ID | Text | Type |
|---|---|---|
| `mira_1` | "There you are! You're late again." | Dialogue |
| `mira_2` | "It's a puddle, Ziggy." | Dialogue |
| `mira_3` | "Come on. Before we're both detention buddies." | Dialogue |
| `mira_4` | "You feel that?" | Dialogue |
| `mira_5` | "What's wrong?" | Dialogue |
| `mira_6` | "We're with you." | Dialogue |
| `mira_7` | "What happens now?" | Dialogue |

**Output Files:**
```
audio/MIRA/
├── mira_1.mp3
├── mira_2.mp3
├── mira_3.mp3
├── mira_4.mp3
├── mira_5.mp3
├── mira_6.mp3
└── mira_7.mp3
```

---

### 3. ECHO (Distorted Chaos Entity, Initially Mocking → Powerful)

**Voice Characteristics:**
- Distorted, chaotic energy (static-like quality)
- Mocking and menacing initially
- Gradually becomes more powerful and real
- Non-human, otherworldly quality

**Key Lines to Generate:**

| ID | Text | Type | Notes |
|---|---|---|---|
| `echo_1` | "Ziggy. Finally awake." | Dialogue | Mocking tone |
| `echo_vo_1` | "I'm the part of you that can't focus. The part that forgets. The part that gets overwhelmed. I'm everything the world says is WRONG with you." | V.O. | Harsh, accusatory |
| `echo_transform` | "Then let's see what you can do." | Dialogue | Accepting tone, less threatening |
| `echo_threat` | "You think you've won? This was just the beginning, Ziggy." | Dialogue | Powerful, threatening |

**Output Files:**
```
audio/ECHO/
├── echo_1.mp3
├── echo_vo_1.mp3
├── echo_transform.mp3
└── echo_threat.mp3
```

---

### 4. MS. CHEN (Wise, Patient Adult Mentor)

**Voice Characteristics:**
- Warm, knowing adult voice (teacher/counselor)
- Patient and encouraging
- Authoritative but compassionate
- Speaks with wisdom and experience

**Key Lines to Generate:**

| ID | Text | Type | Duration |
|---|---|---|---|
| `chen_1` | "You felt it again, didn't you? The chaos." | Dialogue | 2-3s |
| `chen_2` | "Because I felt it too. When I was your age." | Dialogue | 3-4s |
| `chen_3` | "They call it a disorder. A deficit. Something broken. But Ziggy... what if they're looking at it wrong?" | Dialogue | 5-6s |
| `chen_4` | "ADHD isn't a flaw. It's a different operating system. More bandwidth. More connections firing. More POWER." | Dialogue | 6-7s |
| `chen_5` | "The question isn't: 'How do I fix myself?' The question is: 'How do I master this?'" | Dialogue | 5-6s |
| `chen_6` | "Exactly like that." | Dialogue | 1-2s |
| `chen_pride` | "Welcome, Ziggy. Welcome to your power." | Dialogue | 3-4s |

**Output Files:**
```
audio/MS_CHEN/
├── chen_1.mp3
├── chen_2.mp3
├── chen_3.mp3
├── chen_4.mp3
├── chen_5.mp3
├── chen_6.mp3
└── chen_pride.mp3
```

---

### 5. JORDAN (Quiet, Thoughtful Observer, 11-13)

**Voice Characteristics:**
- Quiet but intelligent
- Thoughtful, introverted
- Clear and sincere
- Minimal dialogue, maximum impact

**Key Lines to Generate:**

| ID | Text | Type |
|---|---|---|
| `jordan_1` | "See what?" | Dialogue |
| `jordan_2` | "All of us." | Dialogue |

**Output Files:**
```
audio/JORDAN/
├── jordan_1.mp3
└── jordan_2.mp3
```

---

### 6. KAI (Young, Bright, Joyful Child, 8-10)

**Voice Characteristics:**
- Young, bright, playful voice
- Infectious enthusiasm and joy
- Higher pitch, energetic delivery
- Innocent wonder

**Key Lines to Generate:**

| ID | Text | Type |
|---|---|---|
| `kai_1` | "Ziggy! Ziggy! Did you see the new video game trailer?" | Dialogue |
| `kai_2` | "This is SO cool!" | Dialogue |

**Output Files:**
```
audio/KAI/
├── kai_1.mp3
└── kai_2.mp3
```

---

## Generation Process

### Step 1: Prepare Text Files
Create individual text files for each line to ensure clean TTS generation.

### Step 2: Use ElevenLabs TTS Tool
For each character, call `elevenlabs_tts` with:
- **Voice ID:** (from voice map)
- **Text:** (from lines list)
- **Model:** `eleven_monolingual_v1` or `eleven_multilingual_v2`
- **Output Format:** MP3
- **Stability:** (character-specific, 0.5-0.85)
- **Similarity Boost:** (character-specific, 0.65-0.85)

### Step 3: Organize Output
```
/home/user/jamie-wigg/audio/
├── ZIGGY/
│   ├── ziggy_vo_1.mp3
│   ├── ziggy_vo_2.mp3
│   └── ... (9 files total)
├── MIRA/
│   ├── mira_1.mp3
│   ├── mira_2.mp3
│   └── ... (7 files total)
├── ECHO/
│   ├── echo_1.mp3
│   └── ... (4 files total)
├── MS_CHEN/
│   ├── chen_1.mp3
│   └── ... (7 files total)
├── JORDAN/
│   ├── jordan_1.mp3
│   └── jordan_2.mp3
├── KAI/
│   ├── kai_1.mp3
│   └── kai_2.mp3
└── MANIFEST.json
```

### Step 4: Create Manifest
Generate `MANIFEST.json` with metadata for all voice files:
- Character name, age, personality
- File paths
- Duration
- Timestamps for episode use
- Voice settings used

---

## Voice Settings Summary

| Character | Stability | Similarity Boost | Voice Profile |
|---|---|---|---|
| ZIGGY | 0.75 | 0.85 | Young energetic boy |
| MIRA | 0.75 | 0.75 | Warm supportive girl |
| ECHO | 0.5 | 0.65 | Distorted chaos entity |
| MS. CHEN | 0.85 | 0.8 | Wise adult mentor |
| JORDAN | 0.8 | 0.75 | Quiet observer |
| KAI | 0.7 | 0.8 | Young excited child |

---

## Quality Checklist

- [ ] All voice files generated at professional quality (192kbps+ MP3)
- [ ] Character voices are distinct and recognizable
- [ ] Narration matches script emphasis and emotional beats
- [ ] Dialogue flows naturally with correct pacing
- [ ] Files organized in clean directory structure
- [ ] Manifest.json created with complete metadata
- [ ] README.md with usage guide for animators
- [ ] Sample compilation (first 30 seconds of each character)

---

## Next Steps

1. Generate all voice files via ElevenLabs TTS
2. Listen through for quality control and character consistency
3. Create sample compilation reel (2-3 minutes)
4. Generate comprehensive README for animation team
5. Package for delivery to animation studio

