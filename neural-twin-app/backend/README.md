# Neural Twin Backend

Production-grade API service for Neural Twin - complete AI companion ecosystem.

## Quick Start

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Setup database
npm run db:migrate

# Start development server
npm run dev
```

## Architecture

### Database Schema
- **User** — Core user account with authentication
- **Phase 1 Foundation** — Voice corpus, decisions, values, knowledge base
- **Twins** — 8 specialist Twin models (Task, Coach, Growth, Health, Relationship, Financial, Creative, Research)
- **Ecosystem Brain** — Knowledge graph with inter-Twin communication
- **Biometric Data** — Heart rate, HRV, sleep, activity, posture
- **Coherence Metrics** — 7 layers of coherence measurement
- **Fine-tuning Jobs** — Anthropic API integration for model training
- **Learning Loop** — Weekly/monthly re-training cycle

### API Routes

```
POST   /api/auth/register             — Create account
POST   /api/auth/login                — Sign in
POST   /api/auth/oauth                — Apple/Google sign-in
POST   /api/auth/verify               — Validate JWT token

POST   /api/voice                     — Upload voice recording + emotion
GET    /api/voice                     — Get voice corpus

POST   /api/decisions                 — Log a decision
GET    /api/decisions                 — Fetch decisions with pattern analysis
GET    /api/decisions/patterns        — Decision pattern summary

POST   /api/values                    — Define core values
GET    /api/values                    — Get user's values

POST   /api/knowledge                 — Add knowledge entry
GET    /api/knowledge                 — Get knowledge base

POST   /api/twins/:type/chat          — Talk to a Twin
GET    /api/twins                     — List all Twins
GET    /api/twins/:type/interactions  — Twin interaction history

POST   /api/biometrics                — Upload biometric data
GET    /api/biometrics                — Get biometric trends

POST   /api/coherence                 — Compute coherence metrics
GET    /api/coherence                 — Get coherence dashboard
```

## Development

### Available Scripts

```bash
npm run dev           # Start with hot reload (tsx watch)
npm run build         # Compile TypeScript → dist/
npm start             # Run compiled JavaScript
npm run db:migrate    # Run Prisma migrations
npm run db:studio     # Open Prisma Studio (database UI)
npm test              # Run unit tests
npm run lint          # Check code style
npm run format        # Auto-format code
```

### Project Structure

```
backend/
├── src/
│   ├── index.ts                 # Main server file
│   ├── routes/                  # API route handlers
│   │   ├── auth.ts
│   │   ├── voice.ts
│   │   ├── decisions.ts
│   │   ├── values.ts
│   │   ├── knowledge.ts
│   │   ├── twins.ts
│   │   ├── biometrics.ts
│   │   └── coherence.ts
│   ├── middleware/              # Express middleware
│   ├── services/                # Business logic
│   │   ├── twin-service.ts
│   │   ├── voice-service.ts
│   │   ├── fine-tuning-service.ts
│   │   └── coherence-service.ts
│   └── utils/                   # Helpers
├── prisma/
│   └── schema.prisma            # Database schema
├── dist/                        # Compiled output
├── .env.example                 # Environment template
├── package.json
├── tsconfig.json
└── README.md
```

## Phase Implementation Timeline

### Phase 1 (Weeks 5-16): Foundation + Voice
- Voice recording with real-time emotion analysis
- Decision logging with pattern detection
- Values and knowledge base entry
- Fine-tuning pipeline initialization

### Phase 2 (Weeks 17-28): Twin Ecosystem
- All 8 Twins active and conversing
- Knowledge graph with inter-Twin communication
- Ecosystem Brain coordination
- Weekly synthesis

### Phase 3 (Weeks 29-36): Biometric Integration
- Apple Health / Google Fit integration
- Wearable data (Oura, Withings, Apple Watch)
- Computer vision (posture, breathing)
- Biometric-aware coaching

### Phase 4 (Weeks 37-44): Coherence Layer
- 7-layer coherence metrics
- Real-time coaching based on coherence state
- Tesla resonance frequency optimization
- Entrainment coaching

### Phase 5 (Weeks 45-52): Launch
- Production optimization
- App Store submission
- Public beta release

## Authentication

- JWT tokens with 30-day expiration
- Support for email/password and OAuth (Apple, Google)
- Token refresh handled client-side

## Data Privacy

- All user data encrypted at rest
- End-to-end encryption for sync
- Local-first processing where possible
- Users can export their data anytime

## API Documentation

See `/docs/API.md` for detailed endpoint specifications (generated from code comments).

## Contributing

1. Create a feature branch: `git checkout -b feature/voice-emotion`
2. Implement with tests
3. Submit PR against `main`

## Support

Issues? Check existing GitHub issues or create a new one.

---

**Next Step:** Implement Phase 1 endpoints in `/src/routes/` and create corresponding services in `/src/services/`.
