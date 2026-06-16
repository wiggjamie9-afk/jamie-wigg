# Complete Ecosystem Inventory

**Status:** Installation Phase 1  
**Total Modules:** 15 (11 new + 4 existing)  
**Languages:** 10 (Java, Go, PHP, Python, JavaScript/TypeScript, Elixir, Scala, HTML/CSS, Dart, SQL)  
**Scale:** Enterprise (10,000+ users, 1000+ concurrent jobs, 10,000+ IoT devices)

---

## Component Breakdown

### NEW MODULES (11)

#### 1. **CODEX** — Microscopy & Specialized Image Processing
- **Language:** Java
- **Purpose:** Process specialized imagery (microscopy, medical, scientific)
- **Key Features:**
  - File format support: .tif, .jpg, .png, and others
  - Virtual stack processing for large images
  - Channel renaming & metadata handling
  - Z-stack, T-series, C-channel sorting
  - Dicom ordering support
- **Input:** Image files via S3 or local filesystem
- **Output:** Processed images + metadata
- **Integration:** Senju job queue → triggered via `/job/codex` endpoint
- **Licensing:** Check source repo (likely MIT or Apache)
- **Status:** Ready for containerization

#### 2. **IoT Protocol Stack** — Device Connectivity
- **Protocols Supported:**
  - **CoAP** (Constrained Application Protocol) - UDP, excellent for LLN
  - **MQTT** (Message Queuing Telemetry Transport) - TCP, publish/subscribe, M2M
  - **XMPP** (Extensible Messaging & Presence Protocol) - TCP, presence + messaging
  - **RESTful HTTP** - TCP, traditional web API
  - **Thread** - Low-power mesh for home automation
- **Scale:** 1000s-10,000s nodes, 2G/3G/4G + LLN support
- **Deployment:**
  - CoAP: `libcoap` (C), `node-coap` (Node.js), `coap` (Python)
  - MQTT: MQTT broker (Mosquitto, HiveMQ)
  - XMPP: Ejabberd or Openfire server
  - RESTful: Standard HTTP servers
- **Integration:** Data ingestion → Senju queue → Spark ETL → ClickHouse
- **Use Cases:** Sensors, smart devices, industrial IoT, smart home
- **Status:** Protocols documented, need adapter layer

#### 3. **Flutter MVVM Mobile App** — iOS/Android Client
- **Framework:** Flutter 3.x + Dart
- **Architecture Pattern:** Clean Architecture (MVVM)
- **Key Features:**
  - **Intelligent Timer-Based Caching:** Fetch once, cache data, only refetch after timer
  - **State Rendering System:** Full-screen states + popup overlays
  - **Localization:** English, Arabic, RTL/LTR support
  - **Dependency Injection:** GetIt or similar
  - **Repository Pattern:** Data layer abstraction
  - **Either/Left-Right:** Functional error handling
  - **Stream Management:** RxDart or dart:async
  - **Asset Management:** Icons, images for iOS/Android sizes
  - **Theme System:** Consistent styling, dark mode support
- **Screens:** Dashboard, job creation, status tracking, results, settings, notifications
- **API Integration:** Calls Rinvex Cortex backend
- **Deployment:**
  - iOS: Via Capacitor wrapper → TestFlight/App Store
  - Android: Via Capacitor wrapper → Google Play
- **Status:** Architecture defined, skeleton ready for implementation
- **Caching Strategy:**
  ```
  GET /api/jobs
    → Check cache key: "jobs_list"
    → If exists + timer not expired: return cached
    → If expired or missing: fetch from API, cache with 30min timer
    → UI updates via StreamBuilder on cache stream
  ```

#### 4. **Senju** — Pipeline Orchestration & Job Queue
- **Language:** Go
- **Responsibility:** Central orchestration engine
- **Key Features:**
  - Job creation, queuing, execution, tracking
  - State machine: pending → queued → running → succeeded|failed|cancelled
  - Async task management with message channels
  - Retry logic: exponential backoff (3-10 attempts)
  - Rate limiting: configurable requests/min per client
  - Concurrent job support: 1000+ simultaneous
  - Flywheel task tracking (message channels + state checkpoints)
  - Audit logging: every transition logged with timestamp + metadata
  - Cost estimation (before execution)
  - Budget governance (per-user spend caps)
- **API Endpoints:**
  - `POST /v1/jobs/pipeline` — create job
  - `POST /v1/jobs/{id}/run` — execute job
  - `GET /v1/jobs/{id}/status` — fetch status
  - `GET /v1/jobs/{id}/outputs` — retrieve outputs
  - `GET /v1/jobs` — list all jobs (org-scoped)
  - `DELETE /v1/jobs/{id}` — cancel job
- **Input:** Job manifest (JSON) + parameters
- **Output:** Job ID immediately, async completion callback
- **Database:** PostgreSQL for state, Redis for rate limiting
- **Integration:** Central to ALL long-running operations
- **Status:** API contract defined, Go service ready for implementation
- **Example Job Manifest:**
  ```json
  {
    "type": "tts",
    "module": "voxcpm2",
    "params": {
      "text": "Hello world",
      "voice": "design|(young woman, gentle)",
      "duration": 5,
      "format": "wav"
    },
    "budget": "$0.50",
    "notify_on_complete": "webhook_url"
  }
  ```

#### 5. **DocumentDB Provisioner** — Infrastructure Automation
- **Language:** Go
- **Responsibility:** AWS DocumentDB cluster lifecycle management
- **Key Features:**
  - Create clusters + instances (configurable count, class)
  - Modify cluster parameters (backup retention, version, security)
  - Delete clusters with optional final snapshots
  - Automatic subnet group creation (MD5-hashed by subnet IDs)
  - Backup retention: 1-35 days
  - Storage encryption: always enabled
  - VPC security group management
  - Tag-based org isolation (query only org's resources)
  - Async provisioning via Senju (typical: 3-5 min to "available")
  - Retry logic with exponential backoff
  - Health checks: poll cluster + instance status before declaring success
- **API Endpoints:**
  - `POST /v1/documentdb/clusters` — create
  - `GET /v1/documentdb/clusters` — list (org-scoped)
  - `GET /v1/documentdb/clusters/{name}` — details
  - `PATCH /v1/documentdb/clusters/{name}` — modify
  - `DELETE /v1/documentdb/clusters/{name}` — delete
- **Integration:** Via Senju for async tracking, outputs cluster connection string
- **Status:** Service structure ready, AWS SDK integration needed
- **Cost:** Variable, typically $1-5/month per cluster depending on instance class

#### 6. **Rinvex Cortex** — Modular Enterprise API Backend
- **Language:** PHP/Laravel 11+
- **Architecture:** Modular, extensible, SOLID principles
- **Key Responsibilities:**
  - Request routing to downstream services
  - Authentication/authorization (JWT, org-based)
  - Request validation & serialization
  - Response standardization (HAL-JSON format)
  - Rate limiting (per user, per API key)
  - Dependency injection container
  - Route management (RESTful conventions)
  - Middleware pipeline (auth, logging, CORS, etc.)
  - Extension system for custom modules
- **Modules (To Create):**
  - `codex` — Image processing job creation
  - `tts` — Text-to-speech job creation (VoxCPM2, Higgsfield)
  - `video` — Video generation job creation
  - `documentdb` — Database provisioning
  - `iot` — IoT device management
  - `analytics` — Analytics data export
  - `jobs` — Job management & tracking
  - `users` — User management
  - `orgs` — Organization management
- **Database:** PostgreSQL (auth, orgs, users), Redis (cache, rate limits)
- **Integration:** Front-end for Senju, CODEX, VoxCPM2, Higgsfield, DocumentDB
- **Status:** Framework setup needed, endpoints to be built
- **Response Format:**
  ```json
  {
    "data": { ... },
    "meta": {
      "timestamp": "2026-06-16T10:30:00Z",
      "version": "1.0",
      "request_id": "req_abc123"
    },
    "errors": null
  }
  ```

#### 7. **Apache Spark** — Distributed Data Processing
- **Languages:** Scala, Python, Java
- **Purpose:** ETL, stream processing, analytics at scale
- **Key Capabilities:**
  - Distributed batch processing (Spark SQL)
  - Stream processing (Spark Streaming, Structured Streaming)
  - Machine learning (MLlib)
  - Graph processing (GraphX)
  - 1000s-node cluster support
  - In-memory caching for performance
- **Deployment Options:**
  - Standalone cluster (master + workers)
  - YARN (Hadoop-compatible)
  - Mesos
  - Kubernetes
  - AWS EMR
- **Integration:**
  - Input: S3, HDFS, Kafka, IoT data streams
  - Jobs triggered via Senju (async)
  - Output: ClickHouse, S3, PostgreSQL
  - Example: `IoT data stream → Spark → aggregate → ClickHouse`
- **Use Cases:**
  - Processing 1000s of IoT device streams
  - OpenMontage output processing (video metadata extraction)
  - Analytics preprocessing
  - Time-series aggregation
- **Status:** Deployment architecture needed, job templates ready
- **Example Spark Job:**
  ```python
  # Process IoT sensor data
  df = spark.readStream.format("kafka") \
    .option("kafka.bootstrap.servers", "kafka:9092") \
    .option("subscribe", "iot_sensors") \
    .load()
  
  aggregated = df.groupBy("device_id", window("timestamp", "1 minute")) \
    .agg({"temperature": "avg", "humidity": "avg"}) \
    .writeStream \
    .format("jdbc") \
    .option("url", "jdbc:clickhouse://clickhouse:8123/analytics") \
    .option("dbtable", "sensor_metrics") \
    .start()
  ```

#### 8. **Plausible Analytics** — Privacy-First Web Analytics
- **Stack:** Elixir/Phoenix (backend), React (frontend)
- **Databases:** PostgreSQL (general), ClickHouse (analytics)
- **Key Features:**
  - GDPR/CCPA/PECR compliant (no cookies, no personal data)
  - Real-time dashboards
  - Email/Slack reporting (weekly, monthly)
  - Traffic spike/drop notifications
  - Search Console integration (Google keywords)
  - Goal tracking & conversion funnels
  - Custom events & dimensions
  - Codeless tracking (outbound links, forms, 404s)
  - Public/private dashboard sharing
  - Team members with role-based access
  - CSV + JSON exports
  - Stats API for custom integrations
- **Deployment Options:**
  - Cloud: managed.plausible.com (EU data centers only)
  - Self-hosted: Plausible Community Edition (Docker)
- **Tracking:**
  - Tiny JavaScript snippet (< 1KB)
  - Compatible with SPAs (pushState + hash routing)
  - Can send custom events via API
- **Integration Points:**
  - Flutter app: inject Plausible tracker
  - Next.js web: Plausible React SDK
  - Backend: track API calls, job completions, errors
- **Status:** Service documentation gathered, deployment config needed
- **Compliance:** Already GDPR/CCPA compliant, no extra work needed
- **Cost:** Self-hosted CE is free, managed is ~$9-20/month per site

#### 9. **Higgsfield AI** — Cinematic AI Video Generation
- **Type:** Cloud API (SaaS)
- **Purpose:** Text-to-video, image-to-video generation
- **Models Supported:**
  - Kling Video Generation
  - Veo 3.1
  - WAN 2.5 (emerging)
- **Input Types:**
  - Text prompt → video (text-to-video)
  - Image + motion description → video (image-to-video)
- **Output Specs:**
  - Durations: 3-30 seconds
  - Resolutions: 720p, 1080p, 4K
  - Frame rates: 24fps, 30fps, 60fps
- **Presets:**
  - `cinematic_default` — film-quality, dramatic lighting
  - `ugc_factory` — user-generated content style
  - `commercial` — clean, professional
  - `documentary` — natural, realistic
  - `anime` — animated style
- **API Endpoints:**
  - `POST /generate/video` — text-to-video or image-to-video
  - `GET /status/{generation_id}` — check progress
  - `GET /output/{generation_id}` — download video
  - `GET /presets` — list available presets
- **Integration:** Via Senju (polling job), outputs to S3
- **Rate Limits:** 10 req/min default, max 3 concurrent generations
- **Status:** API documented, credential setup needed, Python SDK available
- **Cost:** Per-generation credits, typically $0.50-$3.00 per video
- **Example:**
  ```bash
  POST https://api.higgsfield.ai/v1/generate/video
  {
    "prompt": "cinematic shot of cyberpunk city at night, neon rain",
    "preset": "cinematic_default",
    "duration": 5,
    "resolution": "1080p"
  }
  ```

#### 10. **VoxCPM2** — Advanced Text-to-Speech with Voice Design
- **Type:** Open-source model (Apache-2.0)
- **Model Size:** 2B parameters
- **Languages:** 30 languages + 9 Chinese dialects
- **Key Features:**
  - **Voice Design:** Natural language → custom voice (no reference audio)
  - **Controllable Voice Cloning:** Reference audio + style instructions
  - **Ultimate Cloning:** Reference audio + transcript for perfect replication
  - **Multilingual:** Auto-detect language, direct synthesis
  - **Context-Aware:** Prosody inferred from text content
  - **Streaming:** Real-time chunk delivery
  - **Fine-tuning:** SFT & LoRA with 5-10 min audio
- **Audio Quality:** 48kHz studio-quality output
- **Deployment Options:**
  - Local PyTorch inference (RTF ~0.3 on RTX 4090)
  - Nano-vLLM (RTF ~0.13, high-throughput)
  - vLLM-Omni (official, OpenAI-compatible API)
- **Input Format:**
  ```
  "(voice description)text to synthesize"
  Example: "(young woman, gentle, slightly smiling)Hello, welcome!"
  ```
- **Integration:** Via Senju (Python service), outputs .wav file
- **Status:** Model weights available on HuggingFace, deployment scripts ready
- **VRAM:** ~8GB for 2B model
- **Cost:** Free (open-source) if self-hosted, only compute costs
- **Languages Supported:**
  Arabic, Burmese, Chinese, Danish, Dutch, English, Finnish, French, German, Greek, Hebrew, Hindi, Indonesian, Italian, Japanese, Khmer, Korean, Lao, Malay, Norwegian, Polish, Portuguese, Russian, Spanish, Swahili, Swedish, Tagalog, Thai, Turkish, Vietnamese

#### 11. **freeCodeCamp Learning Platform** — Educational Infrastructure
- **Type:** Open-source learning platform
- **Languages:** Node.js (API), React (UI), MongoDB/PostgreSQL
- **Purpose:** Host curriculum, track certifications, community support
- **Key Components:**
  - Curriculum authoring system
  - Interactive code editor
  - Challenge evaluation engine
  - Project submission & review
  - Certification system with verification
  - Forum (community support)
  - YouTube integration
- **Certifications Available:**
  - Responsive Web Design
  - JavaScript
  - Front-End Development Libraries
  - Python
  - Relational Databases
  - Back-End Development & APIs
  - Language certifications (English, Spanish, Chinese)
- **Deployment:** Docker, self-hosted or managed
- **Integration:** Embed curriculum within your platform, OR reference curriculum for learning paths
- **Status:** Reference material gathered, integration approach TBD
- **Use Case:** Build learning module for users to understand your ecosystem
- **Cost:** Free (open-source)

---

### EXISTING MODULES (4)

#### 12. **OpenMontage** — Video Production Pipeline Orchestrator
- **Status:** Already deployed in repo
- **Scope:** 12 production pipelines, 52 production tools
- **Integration:** Can feed outputs to Plausible analytics, Spark processing
- **Reference:** `/home/user/jamie-wigg` (root of repo)

#### 13. **STARLIGHTMIX Studio** — AI Music Video Generation
- **Status:** Deployed at studio.starlightmix.com
- **Tech:** Next.js 15, Cloudflare Pages
- **Integration:** Outputs to S3, linked to GitHub Pages
- **Reference:** `studio/` directory

#### 14. **HyperFrames** — HTML/GSAP Video Composition
- **Status:** CLI-based, used for all RHYTHMIX promos
- **Integration:** Can be called from Senju jobs, outputs MP4s
- **Reference:** RHYTHMIX promo folders (`rhythmix-*-*/`)

#### 15. **Web Apps & PWAs**
- **Status:** Deployed at rhythmixapp.com.au
- **Included:**
  - HerdCheck (livestock PWA)
  - Reset (recovery app)
  - Roomtone, dreams, hum, live, resonate
  - All with offline capability
- **Reference:** Root `.html` files + `apps/`, `livestock/`, `recovery/` directories

---

## Technology Stack Summary

| Category | Technologies | Module(s) |
|----------|--------------|----------|
| **Presentation** | Flutter (Dart), React, Next.js, HTML/CSS/GSAP | MVVM Client, Plausible, Studio, HyperFrames, Web Apps |
| **API Gateway** | PHP/Laravel (Rinvex Cortex) | Rinvex Cortex |
| **Orchestration** | Go (Senju), Flywheel task library | Senju |
| **Image Processing** | Java, ImageJ, VirtualStack | CODEX |
| **Audio Processing** | Python (VoxCPM2), PyTorch | VoxCPM2 |
| **Video Generation** | Cloud API (Higgsfield) | Higgsfield |
| **Video Composition** | HTML/GSAP (HyperFrames), React (Remotion) | HyperFrames, OpenMontage |
| **Data Processing** | Scala/Python (Spark), SQL | Spark |
| **Analytics** | Elixir/Phoenix, ClickHouse, PostgreSQL | Plausible |
| **Infrastructure** | Go, AWS SDK, Docker | DocumentDB Provisioner |
| **Connectivity** | CoAP, MQTT, XMPP, RESTful | IoT Stack |
| **Learning** | Node.js, React, MongoDB | freeCodeCamp |
| **Data Stores** | PostgreSQL, DocumentDB, ClickHouse, Redis | Various |

---

## Scaling Metrics

| Dimension | Target | Notes |
|-----------|--------|-------|
| **Concurrent Users** | 10,000+ | Fleet of mobile + web clients |
| **Concurrent Jobs** | 1,000+ | Senju orchestration capacity |
| **IoT Devices** | 10,000+ | MQTT broker clustering, CoAP handlers |
| **API Latency (p95)** | < 200ms | Rinvex + caching strategy |
| **Job Throughput** | 100+ jobs/sec | Spark + Senju coordination |
| **Analytics Events** | 10M+/day | ClickHouse ingestion, Plausible |
| **Data Processing** | 1GB+/hour | Spark cluster capacity |
| **Uptime** | 99.9% | < 30 min downtime/month |

---

## Integration Matrix

```
          CODEX  VoxCPM2  Higgsfield  Spark  DocumentDB  IoT  Plausible
Rinvex    ✅     ✅       ✅          ✅     ✅          ✅   ✅
Senju     ✅     ✅       ✅          ✅     ✅          ✅   —
Flutter   —      —        —           —      —           —    ✅
NextJS    —      —        —           —      —           —    ✅
Spark     —      —        —           —      —           ✅   —
IO T      —      —        —           ✅     —           —    ✅
Database  —      —        —           ✅     ✅          ✅   ✅
```

**Legend:**
- ✅ = Integrated
- — = Not directly integrated (but can be via Rinvex/Senju)

---

## Critical Paths

### Content Creation Workflow
```
Flutter/Web UI
  ↓ (create job)
Rinvex API
  ↓ (validate + route)
Senju Queue
  ↓ (select processor)
┌─────────┬──────────┬──────────┐
│ CODEX   │ VoxCPM2  │Higgsfield│
└─────────┴──────────┴──────────┘
  ↓ (async processing)
S3/Storage
  ↓ (completion callback)
Plausible (track event)
  ↓ (update UI)
Cache (timer-based)
```

### Infrastructure Provisioning
```
Rinvex API (create DB)
  ↓
Senju Queue (start job)
  ↓
DocumentDB Provisioner (call AWS)
  ↓
AWS SDK (create cluster)
  ↓
Polling (wait for availability)
  ↓
Success callback → Plausible
```

### Data Processing Pipeline
```
IoT Devices
  ↓ (CoAP/MQTT)
Protocol Handlers
  ↓ (ingest)
Senju Queue (batch)
  ↓
Spark ETL
  ↓ (transform)
ClickHouse
  ↓ (write)
Plausible Dashboard
```

---

## Security & Compliance

| Requirement | Status | Implementation |
|-------------|--------|-----------------|
| **Auth** | TBD | JWT + org isolation (Rinvex) |
| **Encryption** | TBD | TLS in transit, AES at rest |
| **GDPR** | ✅ | Plausible CE handles this |
| **CCPA** | ✅ | Plausible CE handles this |
| **Data Isolation** | TBD | Org-based scoping (Rinvex, Senju) |
| **Audit Logging** | ✅ | Senju job transitions logged |
| **Rate Limiting** | TBD | Rinvex middleware |
| **API Secrets** | TBD | Environment variables, vault |

---

## Cost Breakdown (Estimated)

| Component | Monthly Cost | Notes |
|-----------|--------------|-------|
| **Compute (EC2/Lambda)** | $500-$2K | Rinvex, Senju, Spark, services |
| **DocumentDB** | $50-$300 | Per cluster, variable |
| **ClickHouse** | $100-$500 | Analytics, variable data volume |
| **PostgreSQL** | $50-$200 | RDS or self-hosted |
| **S3 Storage** | $50-$500 | Video/audio/image outputs |
| **Higgsfield API** | $100-$1K | Per-video generation costs |
| **Plausible** | Free or $100+ | CE self-hosted or managed |
| **VoxCPM2** | Free | Open-source, only compute |
| **OpenMontage** | Free | Open-source, only compute |
| **HyperFrames** | Free | Open-source, only compute |
| **CODEX** | Free | Open-source, only compute |
| **IoT Infrastructure** | $100-$500 | MQTT broker, protocol handlers |
| **Monitoring** | $50-$200 | CloudWatch, APM tools |
| **Networking** | $20-$100 | Data transfer, CDN |
| **——————** | ————————— | ————————— |
| **Total** | **$1.2K-$5.5K/mo** | Highly variable |

---

## File Structure (To Be Created)

```
jamie-wigg/
├── ECOSYSTEM-ARCHITECTURE.md (✅ created)
├── IMPLEMENTATION-ROADMAP.md (✅ created)
├── ECOSYSTEM-INVENTORY.md (✅ you are here)
├── services/
│   ├── codex/
│   │   ├── Dockerfile
│   │   ├── pom.xml
│   │   └── src/main/java/...
│   ├── senju/
│   │   ├── Dockerfile
│   │   ├── go.mod
│   │   └── main.go
│   ├── voxcpm2/
│   │   ├── Dockerfile
│   │   ├── requirements.txt
│   │   └── app.py
│   ├── documentdb-provisioner/
│   │   ├── Dockerfile
│   │   ├── go.mod
│   │   └── main.go
│   ├── iot-handlers/
│   │   ├── coap-handler/
│   │   ├── mqtt-handler/
│   │   └── xmpp-handler/
│   └── spark/
│       ├── Dockerfile
│       ├── jobs/
│       └── scripts/
├── backend/
│   ├── rinvex-cortex/
│   │   ├── app/
│   │   ├── config/
│   │   ├── routes/
│   │   └── ...
│   ├── jobs/
│   └── migrations/
├── frontend/
│   ├── flutter-app/
│   │   ├── lib/
│   │   │   ├── models/
│   │   │   ├── views/
│   │   │   ├── viewmodels/
│   │   │   └── ...
│   │   └── pubspec.yaml
│   └── nextjs-web/
│       ├── app/
│       ├── components/
│       └── ...
├── deployment/
│   ├── docker-compose.yml
│   ├── kubernetes/
│   │   ├── services/
│   │   └── deployments/
│   └── terraform/
├── docs/
│   ├── API.md
│   ├── DEPLOYMENT.md
│   └── ...
└── tests/
    ├── integration/
    └── load/
```

---

## What's Next?

**Phase 1 (Weeks 1-2):**
1. Create Rinvex Cortex project skeleton
2. Implement Senju job queue service
3. Set up PostgreSQL + Redis
4. Deploy to staging

**Then:**
- Follow IMPLEMENTATION-ROADMAP.md for Phases 2-5

---

## Questions & Clarifications

**Q: Which modules are optional?**  
A: IoT Stack, Spark, and freeCodeCamp are optional. CODEX, VoxCPM2, Higgsfield, and DocumentDB are core.

**Q: Can I deploy partially?**  
A: Yes. Phase 1 (Rinvex + Senju) is the foundation. Everything else layers on top.

**Q: What if I want to skip a module?**  
A: Remove its endpoints from Rinvex, no job types in Senju. Platform stays operational.

**Q: What about licenses?**  
A: Apache-2.0 (CODEX, VoxCPM2, OpenMontage), MIT (HyperFrames, most), AGPL-3.0 (Plausible CE). Check before production use.

