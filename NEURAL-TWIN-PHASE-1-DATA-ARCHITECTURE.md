# NEURAL TWIN — PHASE 1 DATA ARCHITECTURE

## Overview

Phase 1 (Months 1-4) transforms you into a quantifiable dataset. Neural Twin learns who you are by ingesting your decision patterns, values, voice, communication style, emotional rhythms, and business logic. This document specifies the data collection pipeline, storage architecture, fine-tuning strategy, and real-time learning mechanisms that power the Core Twin.

---

## PART 1: DATA COLLECTION LAYERS

### Layer 1: Voice Corpus (Foundation of Coach Twin)

**What to collect:**
- 100+ hours of unscripted voice recordings
- Mix: 1:1 coaching calls, podcast appearances, team meetings, voice memos, customer calls
- Formats: MP3, WAV, M4A (any format, normalized to 16kHz mono for analysis)
- Metadata per clip: date, duration, context (coaching / sales / team / casual), emotional tone (self-rated), outcomes

**Where to source:**
- Existing podcast episodes (if any)
- Past client recordings (with consent, anonymized)
- Personal voice memos (iOS Voice Memos app export)
- Weekly recorded reflections (10 mins, every Thursday)
- Customer/team call transcripts + audio (Otter.ai, Fireflies.ai export)

**Deliverables (Week 1-2):**
- [ ] Inventory existing voice assets (podcast, calls, recordings)
- [ ] Export from Otter.ai / Fireflies.ai / Apple Voice Memos
- [ ] Normalize to 16kHz WAV format
- [ ] Create metadata CSV: `voice_corpus.csv` (filename, duration, date, context, tone)
- [ ] Upload to secure cloud storage (AWS S3 + encryption)

**Quality threshold:** Minimum 50 hours. Target 100+ hours by end of Phase 1.

---

### Layer 2: Decision Patterns (Brain of Task Twin)

**What to collect:**
- Every significant decision you've made in the last 12 months
- Format: `{date, decision, context, options_considered, chosen_option, reasoning, outcome}`
- Scope: business decisions (pricing, feature launches, hires, partnerships), personal (investments, time allocation, learning), operational (tools, processes, hiring criteria)
- Granularity: ~50-100 decisions per month minimum

**Where to source:**
- Slack messages (export all #decisions or #announcements channels)
- Email (archive, grep for decision keywords)
- Notion / Airtable boards (decisions logged)
- GitHub commit messages and PRs (code decisions, refactors, prioritization)
- Calendar events + meeting notes
- Financial records (investments, tool subscriptions, hiring spend)

**Decision template (standardize to this format):**
```json
{
  "date": "2024-06-15",
  "decision": "Chose to launch Personal AI Clone feature before Enterprise AI Employee",
  "context": "Two competing priorities for Q3 roadmap",
  "options": [
    "Personal AI Clone (high velocity, small market, $10-50k/mo)",
    "Enterprise AI Employee (long sales cycle, high ACV, $50-200k/mo)"
  ],
  "chosen": "Personal AI Clone",
  "reasoning": "Market timing, founder energy, existing technology stack, can build in 2 weeks",
  "outcome": "TBD after launch",
  "category": "product_prioritization",
  "confidence": 0.7,
  "reversible": true
}
```

**Deliverables (Week 2-3):**
- [ ] Export Slack #decisions and similar channels (JSON format via Slack API)
- [ ] Export email archive, grep for "decision", "chose", "priority", "vs", "instead"
- [ ] Create `decisions_log.json` with 50+ decisions from last 12 months
- [ ] Standardize to template above
- [ ] Tag each decision: `category` (product, ops, financial, hiring, learning, personal)
- [ ] Rate confidence (0-1): how certain you were it was the right call

**Quality threshold:** 50+ decisions minimum. Target 100+ for strong pattern recognition.

---

### Layer 3: Values & Principles (Soul of Coach Twin)

**What to collect:**
- Core operating principles (what you believe about business, people, money, impact)
- Communication style (formal vs. casual, directness, humor, vulnerability)
- Decision criteria (how you actually decide between options, not how you think you decide)
- Vulnerabilities (what scares you, what you avoid, what triggers you)
- Growth edges (what you're working on, where you're limited)
- Success definition (what "winning" means to you)

**Sources:**
- Past journals / reflections
- Conversations with mentors / therapists / coaches
- Written values statements (company or personal)
- 1:1 interview with you (structured, 2-3 hours)
- Analysis of decisions (what patterns emerge?)

**Values template:**
```json
{
  "principle": "I optimize for optionality over certainty",
  "domain": "business_strategy",
  "examples": [
    "Chose to build in public rather than stealth (maintain flexibility)",
    "Hired contractors vs. full-time (easier to pivot)",
    "Invested in tools that are modular (not locked-in)"
  ],
  "contraindications": [
    "Still over-commit to multi-year visions (tension with optionality)",
    "Paralysis when too many options exist"
  ],
  "coaching_note": "This is a strength and a limitation. Coach Twin should call this out when indecision emerges."
}
```

**Deliverables (Week 3-4):**
- [ ] Schedule 3-hour structured interview with yourself or coach
- [ ] Create `values_principles.json` with 15-25 core operating principles
- [ ] For each principle: 2-3 examples from real decisions, contraindications, coaching notes
- [ ] Create `communication_style.md`: formal vs. casual spectrum, humor pattern, vulnerability level
- [ ] List 5-10 decision criteria (e.g., "I prioritize speed of iteration over perfection")
- [ ] Document vulnerabilities (what Coach Twin needs to watch for)

**Quality threshold:** 15+ principles with examples. Authentic, specific to you.

---

### Layer 4: Knowledge Base (Memory of Core Twin)

**What to collect:**
- Everything you know that someone couldn't learn in 5 minutes
- Business models you understand (SaaS unit economics, creator platforms, marketplaces)
- Technical knowledge (APIs, no-code tools, cloud architecture, AI capabilities)
- Market insights (what works for your audience, where opportunity gaps exist)
- Operational processes (how you hire, onboard, measure success, iterate)
- Personal frameworks (decision-making, planning, debugging problems)

**Sources:**
- Past writing (blog posts, emails, Notion docs, Twitter threads)
- Code repositories (github.com/wiggjamie9-afk)
- Course materials (if you've taught anything)
- Product specifications and design docs
- Customer research and feedback notes
- Personal wiki or knowledge base

**Deliverables (Week 2-4):**
- [ ] Export all past writing: blog, Medium, Twitter threads (HTML or Markdown)
- [ ] Clone GitHub repos, create indexed summaries of code decisions
- [ ] Extract from Notion: collect all `#insights`, `#frameworks`, `#lessons` pages
- [ ] Create `knowledge_base.json`: structured facts with categories (business, technical, market, personal)
- [ ] Create `frameworks.md`: decision trees, mental models, problem-solving approaches you use

**Quality threshold:** 50+ documented insights with examples. Focus on what's non-obvious.

---

### Layer 5: Interaction Patterns (Personality of Core Twin)

**What to collect:**
- How you communicate in different contexts (1:1 vs. team, customer vs. internal, crisis vs. normal)
- Your response style to common situations (rejection, confusion, success, failure)
- Tone shifts (when you're formal, sarcastic, vulnerable, pushy)
- Communication speed (response time, async vs. sync preference)
- Emoji use, phrase preferences, metaphors you repeat

**Sources:**
- Slack exports (analyze tone, response patterns, emoji use)
- Email archives (greeting style, sign-off, length, formality by recipient)
- Twitter/public writing (voice, topics, frequency)
- Voice recordings (speech patterns, filler words, pacing)
- Recorded calls (body language proxies via tone/pacing)

**Deliverables (Week 2-3):**
- [ ] Export Slack interactions (last 6 months, all channels)
- [ ] Analyze tone patterns: formal vs. casual by context
- [ ] Document communication style: "You use [metaphors/humor/data] to explain concepts"
- [ ] Extract response time patterns: "You typically respond within [X hours]"
- [ ] Create `interaction_patterns.json`: tone, formality, speed, style by context

**Quality threshold:** Detailed enough that Coach Twin can mimic your communication naturally.

---

## PART 2: DATA STORAGE & SECURITY

### Architecture

```
┌─────────────────────────────────────────┐
│ Data Collection (Personal Devices)      │
│ • Voice recordings (iPhone, computer)   │
│ • Documents (Notion, Google Drive)      │
│ • Digital artifacts (Slack, email)      │
└──────────────┬──────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────┐
│ Local Staging (Your Machine)            │
│ • Parse & normalize formats             │
│ • Add metadata & context                │
│ • Anonymize where needed                │
│ • Create standardized JSONs             │
└──────────────┬──────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────┐
│ Encrypted Cloud Storage (AWS S3)        │
│ • AES-256 encryption at rest            │
│ • HTTPS in transit                      │
│ • Versioning enabled                    │
│ • Lifecycle: never auto-delete          │
└──────────────┬──────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────┐
│ Fine-Tuning Pipeline (Anthropic API)    │
│ • Upload batch to Files API             │
│ • Trigger fine-tuning job               │
│ • Generate custom Claude model          │
│ • Test on validation set                │
└──────────────┬──────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────┐
│ Deployed Models (Core Twin)             │
│ • Task Twin (fine-tuned Claude)         │
│ • Coach Twin (fine-tuned + system)      │
│ • Voice Engine (Whisper + emotion)      │
└─────────────────────────────────────────┘
```

### Privacy & Security

**Data minimization:**
- Collect only what directly impacts Neural Twin behavior
- Anonymize customer/team names in decision logs
- Store voice corpus separately from personal PII
- Encrypt all data at rest and in transit

**Access control:**
- Only you can decrypt the master S3 bucket
- Fine-tuning API calls authenticated with your API key
- No third-party server access to raw data
- Option to store everything locally (on your laptop) instead of cloud

**Retention:**
- Voice corpus: keep indefinitely (foundation of Coach Twin)
- Decision logs: keep indefinitely (source of wisdom)
- Intermediate files (temp JSON, staging): delete after 7 days
- Model versions: keep last 10 versions, delete older

**Deletability:**
- Everything is exportable (you own all data)
- Can request permanent deletion of any data point
- Models can be re-trained without deleted data

---

## PART 3: FINE-TUNING PIPELINE

### Strategy: Dual Model Architecture

**Model 1: Task Twin (Operational Clone)**
- Fine-tuned on: decisions_log.json + communication_patterns.json
- Learns: your decision-making logic, prioritization, communication style
- Used for: writing emails, planning sprints, analyzing opportunities, content creation
- Target: 95% accuracy on "would Jamie choose this option?"

**Model 2: Coach Twin (Wisdom & Coaching)**
- Fine-tuned on: values_principles.json + frameworks.md + interaction_patterns.json + voice_emotion_data.json
- Learns: your beliefs, how you help others, how you talk about growth, your vulnerabilities
- Used for: coaching you on decisions, reflecting back patterns, offering wisdom, calling out blind spots
- Target: 90% accuracy on "is this advice something Jamie would genuinely give?"

### Fine-Tuning Process (Anthropic Batch API)

**Phase 1a: Data Preparation (Week 2)**

```bash
# Step 1: Gather raw data
- decisions_log.json (100 decisions)
- values_principles.json (20 principles)
- communication_patterns.json (interaction examples)
- frameworks.md (5-10 frameworks)
- voice_emotion_data.json (emotional metadata from 50 hrs audio)

# Step 2: Convert to Anthropic fine-tuning format
# Format: {"messages": [{"role": "user", "content": "..."}, {"role": "assistant", "content": "..."}]}

# Example for Task Twin:
{
  "messages": [
    {
      "role": "user",
      "content": "I have two choices: (1) Build Personal AI Clone (2-week sprint, $10-50k/mo market), or (2) Enterprise AI Employee (6-month sales cycle, $50-200k/mo). Resources: 1 engineer, me full-time, $50k budget. Which should I choose and why?"
    },
    {
      "role": "assistant",
      "content": "I'd choose Personal AI Clone. Here's my decision logic: (1) Optionality - I can launch faster and learn market fit before committing 6 months. (2) Speed - I have a track record of shipping fast and iterating. (3) Market timing - Creator tools are hot right now. (4) Reversibility - if it flops, I'm only 2 weeks in. Enterprise sales are hard and I'd rather nail a consumer product first. The $10-50k market might seem small, but at 500 customers × $50/mo that's $300k/mo. I'd start here."
    }
  ]
}

# Step 3: Create training / validation split
- Training: 70 examples (70 conversations)
- Validation: 30 examples (30 conversations, held out to test accuracy)
```

**Phase 1b: Task Twin Training (Week 3)**

```python
import anthropic
import json

client = anthropic.Anthropic(api_key="your-api-key")

# Upload training data
with open("task_twin_training.jsonl", "r") as f:
    training_data = f.read()

training_file = client.beta.files.upload(
    file=("task_twin_training.jsonl", training_data, "application/json"),
)

# Upload validation data
with open("task_twin_validation.jsonl", "r") as f:
    validation_data = f.read()

validation_file = client.beta.files.upload(
    file=("task_twin_validation.jsonl", validation_data, "application/json"),
)

# Trigger fine-tuning job
job = client.beta.fine_tuning.jobs.create(
    model="claude-3-5-sonnet-20241022",
    training_file=training_file.id,
    validation_file=validation_file.id,
    hyperparameters={
        "learning_rate_multiplier": 1.0,
        "batch_size": 1,
    },
    suffix="task-twin-v1",
)

print(f"Fine-tuning job {job.id} started")
# Monitor at: client.beta.fine_tuning.jobs.retrieve(job.id)
```

**Result:** Custom model `claude-3-5-sonnet-20241022:task-twin-v1` that thinks like you operationally.

**Phase 1c: Coach Twin Training (Week 4)**

Same process, but training data comes from:
- Your values, principles, and frameworks
- How you coach others (emails to mentees, coaching call examples)
- Voice emotion data (correlations between what you say and how you say it)

Example training pair:
```json
{
  "messages": [
    {
      "role": "user",
      "content": "I'm paralyzed between too many options and nothing feels right. I keep second-guessing myself."
    },
    {
      "role": "assistant",
      "content": "I notice you're in optionality-overload. When I'm here, I write down the options, add one constraint (speed, impact, fun), and 80/20 the decision. What if we name the constraint first? What's the ONE thing that matters most right now? Then let's kill 60% of the options. You don't need perfection; you need momentum."
    }
  ]
}
```

---

## PART 4: REAL-TIME LEARNING LOOP

### Every Conversation Teaches Neural Twin

**During use:**
1. You interact with Core Twin (ask for advice, brainstorm, request writing)
2. Core Twin responds using Task Twin or Coach Twin model
3. You provide feedback: "Good call" or "Not quite, here's why" or "Actually, I decided differently"
4. Feedback is logged with context: `{date, query, response, feedback, outcome}`
5. Every 100 interactions, these logs are converted to fine-tuning examples

**Weekly learning cycle:**
- Monday: Review last week's interactions
- Tuesday: Identify 5-10 examples where Core Twin was wrong or could improve
- Wednesday: Convert feedback into fine-tuning examples
- Thursday: Trigger fine-tuning job (incremental, not full re-train)
- Friday: Deploy new model version, test on examples from the week

**Monthly deep-dive:**
- Analyze patterns in feedback: what topics is Core Twin weak on?
- Interview yourself: "How have your values evolved this month?"
- Add new decision logs, frameworks, voice data
- Re-train both models with accumulated data (cumulative learning, not batch)

---

## PART 5: VOICE EMOTION RECOGNITION INTEGRATION

### Pipeline: Voice → Emotion Metadata → Coach Twin

```
┌──────────────────┐
│ Voice Input      │
│ (You speaking)   │
└────────┬─────────┘
         │
         ↓
┌──────────────────────────────────────┐
│ Whisper Speech-to-Text (OpenAI)      │
│ Input: MP3/WAV                       │
│ Output: Transcript + confidence      │
└────────┬─────────────────────────────┘
         │
         ↓
┌──────────────────────────────────────┐
│ Acoustic Feature Extraction          │
│ • Pitch (Hz, variance over time)     │
│ • Speech rate (words/minute)         │
│ • Loudness (dB relative to baseline) │
│ • Jitter/shimmer (voice stability)   │
│ • Formants (frequency bands)         │
│ • Prosody (rhythm, stress, intonation)
│ Library: librosa (Python)            │
└────────┬─────────────────────────────┘
         │
         ↓
┌──────────────────────────────────────┐
│ Emotion Classification               │
│ Model: Hugging Face wav2vec2 or      │
│ Custom fine-tuned on your voice      │
│ Output: [joy, sadness, anger, ...] % │
└────────┬─────────────────────────────┘
         │
         ↓
┌──────────────────────────────────────┐
│ Metadata Enrichment                  │
│ {                                    │
│   "timestamp": "2024-06-24T10:30:00",│
│   "transcript": "...",               │
│   "emotion": "neutral-to-stressed",  │
│   "pitch_avg": 145,                  │
│   "speech_rate_wpm": 110,            │
│   "loudness": -8,                    │
│   "confidence": 0.78                 │
│ }                                    │
└────────┬─────────────────────────────┘
         │
         ↓
┌──────────────────────────────────────┐
│ Coach Twin Context                   │
│ Text: "I'm fine"                     │
│ Voice: stressed, lower pitch, faster │
│ Coach Twin detects mismatch:         │
│ "I hear you saying you're fine, but  │
│ your voice tells a different story.  │
│ What's actually going on?"           │
└──────────────────────────────────────┘
```

### Implementation Details

**Acoustic features to extract (librosa library):**
```python
import librosa
import numpy as np

y, sr = librosa.load(audio_file, sr=16000)

# Pitch: mean fundamental frequency (Hz)
f0 = librosa.yin(y, fmin=50, fmax=300)
pitch_mean = np.nanmean(f0)
pitch_std = np.nanstd(f0)

# Speech rate: phoneme count / duration
# Use pre-trained phoneme recognizer or estimate from spectrogram
# Rough estimate: silence detection + MFCCs

# Loudness: RMS energy
S = librosa.feature.melspectrogram(y=y, sr=sr)
loudness = np.mean(librosa.feature.rms(S=S))

# Jitter: cycle-to-cycle variation in pitch
# For each voiced frame, measure pitch variation
# Jitter% = (Σ |pitch[i] - pitch[i+1]| / (2 * Σ pitch)) * 100

# Formants: peaks in power spectrum
# Use LPC (Linear Predictive Coding) or Spectral envelope analysis
D = librosa.stft(y)
S = np.abs(D) ** 2
formants = find_formant_peaks(S, sr)

# Prosody: spectral centroids, chroma features, zero-crossing rate
spectral_centroid = librosa.feature.spectral_centroid(y=y, sr=sr)
zcr = librosa.feature.zero_crossing_rate(y)
```

**Emotion classification model:**

Option A (Pre-trained): Use Hugging Face `wav2vec2-large-xlsr-53-english` + fine-tune on your voice
```python
from transformers import Wav2Vec2Processor, Wav2Vec2ForCTC
import torch

processor = Wav2Vec2Processor.from_pretrained(
    "facebook/wav2vec2-base-960h"
)
model = Wav2Vec2ForCTC.from_pretrained(
    "facebook/wav2vec2-base-960h"
)

# After fine-tuning on your emotional voice data...
# You'd have: model_emotion = load_fine_tuned_model("emotion-v1")
```

Option B (Custom): Train a small emotional classifier on acoustic features
```python
# Training data: emotion_dataset = [
#   {"pitch": 145, "rate": 110, "loudness": -8, "emotion": "stressed"},
#   {"pitch": 180, "rate": 95, "loudness": -2, "emotion": "happy"},
#   ...
# ]

from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler

X = [[f['pitch'], f['rate'], f['loudness'], ...] for f in emotion_dataset]
y = [f['emotion'] for f in emotion_dataset]

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

model = RandomForestClassifier(n_estimators=100)
model.fit(X_scaled, y)

# Accuracy: 75-82% on held-out test set (per research baseline)
```

**Cost:**
- Whisper API: $0.006 per minute (cheap)
- Emotion model: $0 if local (training), $0.01 if cloud API
- Storage: $0.02-0.05 per month (voice metadata, not raw audio)

---

## PART 6: PHASE 1 DELIVERABLES CHECKLIST

### Week 1-2: Foundation
- [ ] Voice corpus collected (50+ hours, metadata CSV)
- [ ] Decision logs created (50+ decisions, standardized format)
- [ ] Data stored securely (AWS S3, encrypted)
- [ ] Initial values/principles documented (15+ items)
- [ ] Communication patterns analyzed

### Week 2-3: Enrichment
- [ ] Knowledge base extracted (50+ insights)
- [ ] Decision categories tagged (product, ops, financial, hiring, etc.)
- [ ] Confidence scores added to decisions
- [ ] Interaction patterns documented
- [ ] Vulnerability/growth edges identified

### Week 3-4: Fine-Tuning Setup
- [ ] Training data formatted for Anthropic (70 examples × 2 models = 140 conversations)
- [ ] Validation data prepared (30 examples per model)
- [ ] Fine-tuning jobs triggered (Task Twin + Coach Twin)
- [ ] Models deployed (you can now query custom versions)
- [ ] Testing framework created (how to evaluate accuracy)

### Week 4: Real-Time Learning Infrastructure
- [ ] Feedback logging system built (every interaction tracked)
- [ ] Weekly learning cycle defined (Mon-Fri process documented)
- [ ] First 100 interactions recorded (baseline for month 2 re-training)
- [ ] Voice emotion pipeline tested (voice input → Coach Twin context)
- [ ] Privacy audit complete (data retention, access logs, deletion procedures)

### End of Phase 1: What You Have
- **Task Twin v1:** Clone of your decision-making (write emails, plan features, analyze deals like you)
- **Coach Twin v1:** Clone of your wisdom (coach you on growth, call out patterns, offer frameworks)
- **Voice Engine v1:** Can detect emotional undertones in your voice
- **Learning Loop v1:** Every conversation improves the models
- **Data Archive:** Complete backup of your digital self (encrypted, exportable)

---

## PHASE 1 TIMELINE

| Week | Task | Owner | Output |
|------|------|-------|--------|
| 1 | Voice corpus + decision logs | You | voice_corpus.csv, decisions_log.json |
| 2 | Values + knowledge base + interaction patterns | You + AI help | values_principles.json, knowledge_base.json, patterns.json |
| 3 | Format for fine-tuning + create training data | AI | task_twin_training.jsonl, coach_twin_training.jsonl |
| 4 | Fine-tune models + deploy + test | AI + You | custom Claude models v1, test results |
| 4 | Voice emotion pipeline + feedback logging | AI | voice_engine.py, feedback_log.db |

**Time commitment:** 
- You: 15-20 hours (interviews, reviewing/tagging decisions, voice memos)
- AI: 30-40 hours (data processing, fine-tuning setup, testing)
- Total: ~50-60 hours elapsed time, 4 weeks calendar time

**Cost:**
- Anthropic fine-tuning: $5-10 per model
- AWS S3 storage: <$1/month
- Voice processing (Whisper): <$5 total
- Total Phase 1 cost: <$30

---

## Success Criteria for Phase 1

✅ **Complete when:**
1. Both models (Task Twin, Coach Twin) are deployed and callable
2. You can have multi-turn conversations with them and they sound like you
3. Voice emotion detection is working (your voice input generates emotional metadata)
4. Real-time learning loop is functional (feedback → re-training on schedule)
5. You've used Core Twin for 10+ real decisions/coaching moments and seen value
6. All personal data is secured, encrypted, and backed up
7. You understand how accurate the models are and where they need improvement

---

## Appendix: Tools & APIs

| Tool | Purpose | Cost | Setup Time |
|---|---|---|---|
| Anthropic API (fine-tuning) | Train custom Claude models | $5-10/model | 5 min |
| AWS S3 | Encrypted data storage | <$1/mo | 15 min |
| OpenAI Whisper API | Speech-to-text | $0.006/min | 5 min |
| Hugging Face | Emotion model hosting | Free (local) or $0.01 (API) | 30 min |
| librosa | Audio feature extraction | Free (Python library) | 10 min |
| Otter.ai / Fireflies.ai | Call transcription export | Free (if already using) | 10 min |
| Git + GitHub | Version control for datasets | Free | 5 min |

**Python dependencies (Phase 1 tools):**
```bash
pip install anthropic librosa numpy scikit-learn soundfile matplotlib pandas
```

---

## Next: Execution

Ready to start Week 1? Your first action:

1. **Gather voice data:** Export from Otter.ai, Fireflies.ai, Voice Memos, podcast platforms
2. **Log decisions:** Write down 10 significant decisions you made in the last month (use the template)
3. **Schedule deep-dive:** Block 3 hours this week to articulate your values/principles

Once you have voice + decisions + values, we move to fine-tuning and Coach Twin goes live.
