# Neural Twin Phase 2 — Quick Test Start

## One-Command Test Suite

```bash
cd neural-twin-app/backend

# 1. Ensure .env is configured
cat .env | grep -E "DATABASE_URL|ANTHROPIC_API_KEY|JWT_SECRET"

# 2. Start backend
npm run dev &

# 3. Wait for server to be ready
sleep 5

# 4. Run all tests
bash tests/e2e-test-suite.sh
bash tests/error-scenarios.sh
bash tests/performance-benchmark.sh
```

## What Gets Tested

### ✅ 32 Endpoints (11 seconds each, ~6 minutes total)
- **1 Health** — database connectivity
- **4 Auth** — register, login, verify, oauth
- **3 Voice** — upload, list, get with emotion analysis
- **4 Decisions** — create, list, get, analyze patterns
- **5 Knowledge** — create, list, get, learning loops
- **3 Twins** — get all, interact, history
- **3 Biometrics** — log, list, get
- **3 Coherence** — get layers, history, specific
- **4 Accessibility** — scan book, TTS, settings

### ✅ Auth Flow
1. Register → JWT issued
2. Verify → Token validation
3. Login → New JWT
4. Logout (implicit token invalidation)

### ✅ Voice Processing
1. Upload audio (base64)
2. Emotion detection (7 emotions)
3. Acoustic features extracted
4. Transcript generated (Claude)
5. List/fetch with full analysis

### ✅ Decisions & Metacognition
1. Create with 4 pillars:
   - Planning clarity (1-10)
   - Monitoring comprehension (1-10)
   - Evaluation effectiveness (1-10)
   - Reflection insights (yes/no)
2. Claude analyzes decision
3. Metacognitive score calculated: `(P + M + E + R) / 4`
4. Pattern analysis shows trends

### ✅ Twin Interactions
1. Get 9 Twins (task, coach, growth, health, relationship, financial, creative, research, metacognition)
2. Send message to Twin
3. Claude generates context-aware response
4. Interaction stored with metadata
5. History retrieval (30 recent)

### ✅ 8-Layer Coherence
```
Layer 1: Heart-Brain Coherence     (from HRV)
Layer 2: Breathing Coherence       (from breathing rate)
Layer 3: Brain Coherence           (simulated)
Layer 4: Vagal Tone               (from heart rate)
Layer 5: Circadian Alignment      (from sleep data)
Layer 6: Biofield Coherence       (simulated)
Layer 7: Decision-Value Alignment (from decisions)
Layer 8: Metacognitive Coherence  (from decision metrics)

Overall = weighted average
State = coherent | transitioning | stressed
Trend = improving | stable | declining
```

### ✅ Error Scenarios
- **401** — Missing/invalid JWT
- **400** — Validation failures
- **404** — Non-existent resources
- **409** — Duplicate email
- **500** — Server errors (graceful)

### ✅ Performance
- **p50** latency (median)
- **p95** latency (95th percentile)
- **p99** latency (99th percentile)
- **avg** latency (average)

Targets:
| Type | p50 | p95 | p99 |
|------|-----|-----|-----|
| DB queries | 10-50ms | 100-200ms | 500ms |
| Auth | 100-150ms | 200-300ms | 400-500ms |
| Claude | 800-1500ms | 2000ms | 4000ms |

## Files Generated

```
neural-twin-app/backend/
├── tests/
│   ├── e2e-test-suite.sh          # Main test suite (32 endpoints)
│   ├── error-scenarios.sh          # Error case testing
│   └── performance-benchmark.sh    # Latency benchmarking
├── performance-results.json        # Benchmark output
└── TEST_QUICK_START.md            # This file
```

## Expected Output

### Success
```
[TEST] Health check
[PASS] Backend is healthy

[TEST] Register user: test@example.com
[PASS] User registered. ID: uuid-here

[TEST] Verify JWT token
[PASS] JWT token verified

...

========================================
E2E TEST SUITE COMPLETE
========================================
✅ All core endpoints tested
✅ Auth flow verified
✅ Metacognitive tracking functional
✅ Twin interactions working
✅ 8-layer coherence calculated
```

### Failure
```
[TEST] Health check
[FAIL] Health check failed: {"error":"..."}
```

## Environment Variables

```bash
# Required
export BASE_URL="http://localhost:5000"
export DATABASE_URL="postgresql://user:pass@localhost:5432/neural_twin_dev"
export ANTHROPIC_API_KEY="sk-ant-..."
export JWT_SECRET="your-secret-key"

# Optional
export NODE_ENV="development"
export CORS_ORIGIN="http://localhost:3000,http://localhost:8000"
export ITERATIONS=10  # For performance tests
```

## Troubleshooting

### ❌ "Connection refused"
```bash
# Ensure backend is running
lsof -i :5000
npm run dev &
```

### ❌ "Database connection error"
```bash
# Check PostgreSQL
psql -U postgres -d neural_twin_dev -c "SELECT 1"

# Or with Docker
docker ps | grep postgres
docker start postgres
```

### ❌ "Invalid JWT secret"
```bash
# Regenerate
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
export JWT_SECRET
```

### ❌ "Claude API key invalid"
```bash
# Verify at console.anthropic.com
echo $ANTHROPIC_API_KEY | head -c 20

# Check rate limits
curl https://api.anthropic.com/v1/auth/check \
  -H "x-api-key: $ANTHROPIC_API_KEY"
```

### ❌ "Performance tests timeout"
```bash
# Reduce iterations
export ITERATIONS=5
bash tests/performance-benchmark.sh

# Or check Claude API latency separately
time curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{...}'
```

## Success Criteria

- [ ] Health check returns `"status": "healthy"`
- [ ] Register → JWT issued (not null)
- [ ] Verify → `"valid": true`
- [ ] Login → JWT issued
- [ ] Voice upload → emotion detected
- [ ] Decision create → metacognitive score generated
- [ ] Twin interaction → Claude response received
- [ ] 8 coherence layers present with values
- [ ] Coherence trend (improving/stable/declining)
- [ ] Error scenarios return expected HTTP codes
- [ ] All latencies within targets (p99 < 5s)
- [ ] No 500 errors on valid requests
- [ ] Data isolation (users see only their data)

## Performance Targets

### By Endpoint Category

**Fast (< 100ms p99)**
- Health check
- List endpoints (voices, decisions, twins, etc.)
- Get specific resource

**Medium (< 500ms p99)**
- Auth (login, register)
- Biometrics logging
- Coherence calculation

**Slow (< 5s p99) — Claude-dependent**
- Voice upload (transcription + emotion)
- Decision analysis
- Twin interaction
- Accessibility OCR

## Running Specific Tests

```bash
# Just health + auth
curl http://localhost:5000/health
curl -X POST http://localhost:5000/api/auth/register ...

# Just voice
bash tests/e2e-test-suite.sh 2>&1 | grep -A5 "Voice"

# Just errors
bash tests/error-scenarios.sh

# Just performance
bash tests/performance-benchmark.sh

# Custom endpoint
curl -X GET http://localhost:5000/api/voice \
  -H "Authorization: Bearer $TOKEN" | jq .
```

## Next Steps

1. ✅ Run `bash tests/e2e-test-suite.sh`
2. ✅ Check all tests pass
3. ✅ Review `performance-results.json` for latency
4. ✅ Run `bash tests/error-scenarios.sh` for edge cases
5. ✅ Address any failures
6. ✅ Deploy Phase 2

---

**Total Runtime:** ~15-20 minutes  
**Success Rate Target:** 32/32 endpoints passing  
**P99 Latency Target:** < 5 seconds (except Claude endpoints which may go to 8s)
