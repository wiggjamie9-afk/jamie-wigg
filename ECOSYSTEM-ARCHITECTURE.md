# Comprehensive Ecosystem Architecture

**Status:** Installation Phase 1 (Architecture Definition)  
**Date:** 2026-06-16  
**Scope:** 11 core modules + 4 existing platforms  

---

## Executive Summary

This ecosystem is a **production-grade, enterprise-scale platform** for:
- **Content creation** (video, music, images, speech)
- **App development** (mobile, web, PWA)
- **Infrastructure automation** (database provisioning, job orchestration)
- **Data processing** (distributed ETL, analytics)
- **IoT integration** (device connectivity, real-time data)
- **Learning & education** (curriculum, certifications)

**Core philosophy:** Modular, polyglot architecture with clear API boundaries and async task orchestration.

---

## System Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
│  Flutter Mobile (MVVM)  │  Next.js Web  │  HyperFrames UI  │
└─────────────────────────────────────────────────────────────┘
                              ↓↑
┌─────────────────────────────────────────────────────────────┐
│                    API GATEWAY LAYER                          │
│  Rinvex Cortex (Laravel) - Request routing, auth, validation │
└─────────────────────────────────────────────────────────────┘
                              ↓↑
┌──────────────────────────────────────────────────────────────┐
│                 SERVICE/ORCHESTRATION LAYER                   │
│  Senju (Go) - Job queue, state machine, async task tracking  │
│  DocumentDB Provisioner (Go) - Infrastructure automation     │
└──────────────────────────────────────────────────────────────┘
                              ↓↑
┌──────────────────────────────────────────────────────────────┐
│              PROCESSING & SPECIALIZATION LAYER                │
│  CODEX (Java) - Image processing                             │
│  VoxCPM2 (Python) - Text-to-speech, voice design, cloning   │
│  Higgsfield (Cloud API) - AI video generation               │
│  Spark (Scala/Python) - Distributed data processing          │
│  IoT Protocols - Device connectivity layer                   │
└──────────────────────────────────────────────────────────────┘
                              ↓↑
┌──────────────────────────────────────────────────────────────┐
│                    DATA LAYER                                 │
│  PostgreSQL - General data (Rinvex)                          │
│  DocumentDB - Cluster management state                       │
│  ClickHouse - Analytics (Plausible)                          │
│  Redis/Cache - Timer-based caching (Flutter pattern)         │
└──────────────────────────────────────────────────────────────┘
                              ↓↑
┌──────────────────────────────────────────────────────────────┐
│                  ANALYTICS & INSIGHTS LAYER                   │
│  Plausible Analytics (Elixir/Phoenix) - Privacy-first        │
│  Event stream processing & dashboards                         │
└──────────────────────────────────────────────────────────────┘
```

---

## Core Modules (11)

### 1. **CODEX** (Image Processing)
- **Language:** Java
- **Purpose:** Microscopy & specialized image processing
- **Use Cases:** Scientific imagery, medical data visualization, technical imaging
- **Integration:** Via Senju job queue
- **API:** REST endpoint for image processing jobs
- **State:** Async processing with job tracking

### 2. **IoT Protocol Stack**
- **Protocols:** CoAP, MQTT, XMPP, RESTful HTTP, Thread
- **Purpose:** Device connectivity & real-time data ingestion
- **Scale:** 1000s of nodes
- **Platforms:** 2G/3G/4G + LLN (Low Power Wide Area Networks)
- **Integration:** Feeds into Senju job queue → Spark processing
- **Use Cases:** Sensor networks, smart home, industrial IoT

### 3. **Flutter MVVM Mobile Client**
- **Framework:** Flutter + Dart
- **Architecture:** Clean Architecture (MVVM)
- **Key Features:**
  - Timer-based intelligent caching (fetch once, cache within timer window)
  - State rendering system with popup overlays
  - Full localization (Arabic/English, RTL/LTR)
  - Dependency injection + Repository pattern
  - Either/Left-Right error handling
  - Stream-based state management
- **Targets:** iOS + Android
- **Integration:** Calls Rinvex API backend

### 4. **Senju** (Pipeline Orchestration)
- **Language:** Go
- **Purpose:** Job scheduling, state machine, async task management
- **Key Features:**
  - Create/run/status/output endpoints
  - State transitions: pending → running → succeeded|failed
  - Transition audit metadata
  - Retry logic with exponential backoff
  - Flywheel task tracking with message channels
  - Rate limiting & concurrent job management
- **API:** `/v1/jobs` endpoints
- **Integration:** Orchestrates all long-running operations (CODEX, Spark, provisioning)

### 5. **DocumentDB Provisioner** (Infrastructure Automation)
- **Language:** Go
- **Purpose:** AWS DocumentDB cluster provisioning & management
- **Features:**
  - Create/modify/delete clusters & instances
  - Subnet group management
  - Auto-scaling & backup retention
  - Tag-based org isolation
  - Async provisioning with retry logic
- **Integration:** Calls AWS SDK, integrates with Senju for async tracking
- **Use Case:** Multi-tenant database provisioning

### 6. **Rinvex Cortex** (Enterprise Backend)
- **Language:** PHP/Laravel
- **Purpose:** API gateway, request routing, business logic
- **Features:**
  - Modular architecture by domain
  - Dependency injection
  - Route management
  - Request validation & serialization
  - Extension system
- **Integration:** Fronts all downstream services (Senju, CODEX, etc.)
- **API:** RESTful endpoints with standardized response format

### 7. **Apache Spark** (Distributed Data Processing)
- **Languages:** Scala, Python, Java
- **Purpose:** Large-scale ETL, stream processing, analytics
- **Features:**
  - Distributed batch & streaming
  - ML capabilities via MLlib
  - Integration with Hadoop ecosystem
  - 1000s node support
- **Use Cases:** Processing IoT data streams, OpenMontage output processing, analytics pipelines
- **Integration:** Triggered via Senju jobs

### 8. **Plausible Analytics** (Privacy-First Analytics)
- **Language:** Elixir/Phoenix (backend), React (frontend)
- **Databases:** PostgreSQL (general), ClickHouse (analytics)
- **Features:**
  - GDPR/CCPA/PECR compliant
  - No cookies, no personal data storage
  - Real-time dashboards
  - Email/Slack reporting
  - Search Console integration
  - Public/private dashboard sharing
  - CSV + API exports
- **Purpose:** Product analytics without surveillance
- **Integration:** Via JavaScript tracker on all web/app platforms

### 9. **Higgsfield AI** (Cinematic Video Generation)
- **Language:** Cloud API (Python SDK available)
- **Purpose:** Text-to-video, image-to-video, presets
- **Features:**
  - Multiple models: Kling, Veo 3.1, WAN 2.5
  - Cinematic, UGC, commercial, documentary presets
  - Duration: 3-30 seconds
  - Resolution: 720p, 1080p, 4K
  - API-based with status polling
- **Integration:** Triggered via Senju, outputs to video storage
- **Use Cases:** Ad prototyping, storyboarding, social content automation

### 10. **VoxCPM2** (Advanced Text-to-Speech)
- **Language:** Python
- **Model:** 2B parameters, 30 languages
- **Features:**
  - Voice Design (description → custom voice)
  - Controllable Voice Cloning (style + timbre control)
  - Ultimate Cloning (reference + transcript for nuance preservation)
  - 48kHz studio-quality audio
  - Multilingual: 30 languages + 9 Chinese dialects
  - Streaming API support
  - Fine-tuning: SFT & LoRA
- **Deployment:** Local (PyTorch), Nano-vLLM (high-throughput), vLLM-Omni (OpenAI-compatible)
- **Integration:** Triggered via Senju, outputs to audio storage

### 11. **freeCodeCamp Learning Platform** (Educational Infrastructure)
- **Language:** Mixed (Node.js, React, MongoDB)
- **Purpose:** Open-source curriculum platform
- **Features:**
  - Free developer certifications (web, Python, databases, APIs, etc.)
  - Interactive coding challenges
  - Projects + exams
  - Language certifications (English, Spanish, Chinese)
  - Forum community support
  - YouTube channel integration
- **Use Case:** Building embedded learning within your platform
- **Integration:** Can be self-hosted or referenced for curriculum design

---

## Existing Platforms (Already in Repo)

### 12. **OpenMontage** (Video Production Pipeline)
- Full production workflows: research → proposal → script → assets → edit → compose
- 12 production pipelines (explainers, talking heads, documentaries, etc.)
- 52 production tools
- Reference-driven creation
- Real-footage documentary creation from free archives
- Live web research integration

### 13. **STARLIGHTMIX Studio** (AI Music Video Generation)
- Next.js 15 static export → Cloudflare Pages
- Lifetime buyers upload track, pick theme, generate AI music video
- Replicate integration for AI models
- No server-side audio storage
- Deployed at studio.starlightmix.com

### 14. **HyperFrames** (HTML/GSAP Video Composition)
- HTML/CSS/GSAP-based video compositions
- CLI: preview, lint, TTS generation, rendering, publishing
- Multiple aspect ratios (16:9, 9:16, 1:1)
- Registry support
- Used for all RHYTHMIX promos

### 15. **Web Apps & PWAs**
- HerdCheck (livestock screening PWA with offline capability)
- Reset (recovery app for team sport)
- Roomtone, dreams, hum, live, resonate, etc.
- Full offline capability with service workers

---

## Data Flow & Integration Points

### Content Creation Flow
```
User Intent (Flutter UI)
    ↓
Rinvex API (validation, routing)
    ↓
Senju Job Queue (create job)
    ↓
Processing Selection:
  - Text → VoxCPM2 (TTS) → Audio file
  - Script → Higgsfield (video gen) → Video file
  - Image → CODEX (processing) → Processed image
  - Data → Spark (ETL) → Processed data
    ↓
Senju Job Tracking (state machine, retries)
    ↓
Output Storage (S3 or local)
    ↓
Plausible Analytics (track user actions)
    ↓
Flutter UI (display results, cache)
```

### Infrastructure Provisioning Flow
```
User Request (Rinvex API)
    ↓
DocumentDB Provisioner (Go)
    ↓
Senju Job Orchestration
    ↓
AWS SDK Calls (create cluster, instances, subnets)
    ↓
Async Polling (Senju task tracking)
    ↓
Success/Failure Callback
    ↓
Plausible Analytics (track provision event)
```

### IoT Data Pipeline
```
IoT Device/Sensor
    ↓
CoAP/MQTT/XMPP Protocol Handler
    ↓
Data Ingestion Layer
    ↓
Senju Queue (if batch processing needed)
    ↓
Spark ETL (stream or batch)
    ↓
ClickHouse (analytics storage)
    ↓
Plausible Dashboard (visualize)
```

---

## Technology Stack Summary

| Layer | Technologies | Purpose |
|-------|--------------|---------|
| **Presentation** | Flutter, React, Next.js, HTML/CSS/GSAP | User interfaces |
| **API Gateway** | PHP/Laravel (Rinvex Cortex) | Request routing, validation |
| **Orchestration** | Go (Senju), Flywheel library | Job scheduling, state machine |
| **Processing** | Java (CODEX), Python (VoxCPM2), Scala (Spark), Cloud APIs (Higgsfield) | Specialized processing |
| **Data** | PostgreSQL, DocumentDB, ClickHouse, Redis | Storage & caching |
| **Analytics** | Elixir/Phoenix (Plausible) | Privacy-first insights |
| **Connectivity** | CoAP, MQTT, XMPP, RESTful HTTP | IoT & device connectivity |
| **Infrastructure** | Go, AWS SDK, Docker | Automation & deployment |
| **Learning** | Node.js, React (freeCodeCamp reference) | Educational content |

---

## Design Patterns & Key Principles

### 1. **Async Task Orchestration**
- All long-running operations go through Senju job queue
- State transitions with full audit trails
- Exponential backoff retry logic
- Message channel-based task tracking (from Flywheel pattern)

### 2. **Smart Data Caching** (Flutter MVVM Pattern)
- Timer-based intelligent caching
- Fetch data once, cache it
- Only refetch after timer expires
- Eliminates redundant API calls
- Applied ecosystem-wide

### 3. **State Rendering with Popups** (Flutter UI Pattern)
- Every async operation has loading/success/error states
- Popup overlays above content (non-intrusive)
- Full-screen states for critical operations
- Applied to all client interfaces

### 4. **Clean Architecture (MVVM)**
- Separation: Data ↔ Domain ↔ Presentation
- Dependency Injection throughout
- Repository pattern for data access
- Either/Left-Right error handling
- Stream-based reactive updates

### 5. **Org-Based Resource Isolation**
- Every resource tagged with organization
- Subnet groups named by org + resource hash (MD5)
- Tag normalization for consistency
- Query filtering by org_id

### 6. **Polyglot Modularity**
- Each module owns its technology choice
- Clear API contracts between modules
- Language doesn't matter; integration contracts do
- Enables teams to pick best tool per task

### 7. **Privacy-First by Default**
- Plausible for analytics (no tracking cookies, no personal data)
- GDPR/CCPA/PECR compliance built-in
- No third-party data sharing
- Users own & control their data

---

## Deployment Architecture

```
┌─────────────────────────────────────┐
│         Load Balancer (AWS ALB)     │
└─────────────┬───────────────────────┘
              │
    ┌─────────┴──────────┬──────────────┬──────────────┐
    │                    │              │              │
┌───▼────┐          ┌───▼────┐    ┌───▼────┐    ┌───▼────┐
│ Flutter│          │Next.js │    │Plausible
│ Mobile │          │ Web    │    │Analytics│    │ Others │
│(iOS/Droid)        └────────┘    └────────┘    └────────┘
└────────┘
    │
    └─────────────────────────────────────────────┐
                                                  │
                          ┌───────────────────────▼────────┐
                          │  API Gateway (Rinvex Cortex)   │
                          │  - Auth & validation           │
                          │  - Request routing             │
                          └───────────────────────┬────────┘
                                                  │
                ┌─────────────────────────────────┼─────────────────────────┐
                │                                 │                         │
        ┌───────▼────────┐            ┌──────────▼──────────┐    ┌────────▼──────┐
        │ Senju Job Q    │            │ Specialized Services│    │ Data Layer    │
        │ (Go)           │            │                    │    │               │
        │ - Create job   │            │ - CODEX (Java)     │    │ PostgreSQL    │
        │ - Run pipeline │    ◄────►  │ - VoxCPM2 (Python) │ ◄──┤ DocumentDB    │
        │ - Track state  │            │ - Higgsfield (API) │    │ ClickHouse    │
        │ - Audit log    │            │ - Spark (Scala)    │    │ Redis         │
        └────────────────┘            │ - DocumentDB Prov  │    └───────────────┘
                │                     │ - IoT Handlers     │
                └─────────────────────┤                    │
                                      └────────────────────┘
                                              │
                                      ┌───────▼────────┐
                                      │ AWS Services   │
                                      │ - EC2 (Spark)  │
                                      │ - S3 (storage) │
                                      │ - DocumentDB   │
                                      │ - CloudWatch   │
                                      └────────────────┘
```

---

## Integration Checklist

- [ ] Rinvex Cortex API endpoints defined
- [ ] Senju job queue integrated with all async operations
- [ ] CODEX service containerized & callable
- [ ] VoxCPM2 service deployed (local or Nano-vLLM)
- [ ] Higgsfield API credentials configured
- [ ] DocumentDB provisioner tested
- [ ] Spark cluster running
- [ ] Plausible instance deployed (cloud or self-hosted)
- [ ] IoT protocol handlers set up
- [ ] Flutter app connected to Rinvex API
- [ ] Next.js web app deployed to Cloudflare Pages
- [ ] HyperFrames integrated with OpenMontage
- [ ] freeCodeCamp curriculum imported/referenced
- [ ] End-to-end flow tested (UI → API → Job → Processing → Analytics)

---

## Success Metrics

| Metric | Target |
|--------|--------|
| **Job completion time** | < 60s for most operations |
| **Cache hit rate** | > 80% (timer-based caching) |
| **API latency** | < 200ms (p95) |
| **Platform uptime** | 99.9% |
| **Concurrent jobs** | 1000+ |
| **IoT device scale** | 10,000+ nodes |
| **Analytics data freshness** | < 5 min |

---

## Next Phase: Implementation Roadmap

See `IMPLEMENTATION-ROADMAP.md` for phased rollout plan.
