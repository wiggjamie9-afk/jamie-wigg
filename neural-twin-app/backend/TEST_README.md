# Neural Twin Phase 2 — E2E Testing Documentation

Complete end-to-end test plan for **32 API endpoints** across all Phase 2 features.

## 📋 Documentation Files

| File | Size | Purpose |
|------|------|---------|
| **E2E_TEST_PLAN.md** | 44KB | Complete specification with all endpoints, scenarios, expected outputs |
| **TEST_QUICK_START.md** | 7KB | Quick reference for running tests |
| **CURL_REFERENCE.md** | 15KB | Manual curl commands for all 32 endpoints |
| **TESTING_SUMMARY.txt** | 18KB | Executive summary of testing scope |

## 🚀 Quick Start

```bash
cd neural-twin-app/backend

# 1. Configure environment
cat .env | grep -E "DATABASE_URL|ANTHROPIC_API_KEY|JWT_SECRET"

# 2. Start backend
npm run dev &
sleep 5

# 3. Run all tests (15-20 minutes)
bash tests/e2e-test-suite.sh
bash tests/error-scenarios.sh
bash tests/performance-benchmark.sh
```

## 📊 Test Coverage

### Endpoints Tested: 32
- ✅ 1 Health check
- ✅ 4 Auth endpoints (register, login, verify, oauth)
- ✅ 3 Voice endpoints (upload, list, get)
- ✅ 4 Decision endpoints (create, list, get, analyze)
- ✅ 5 Knowledge endpoints (create, list, get, learning loops)
- ✅ 3 Twin endpoints (get all, interact, history)
- ✅ 3 Biometrics endpoints (log, list, get)
- ✅ 3 Coherence endpoints (get layers, history, specific)
- ✅ 4 Accessibility endpoints (OCR, TTS, settings)
- ✅ 2 Values endpoints (create, get)

### Features Tested
- ✅ **Auth Flow**: register → verify JWT → login → use token
- ✅ **Voice Processing**: upload audio → emotion detection → acoustic analysis
- ✅ **Decisions**: 4-pillar metacognitive tracking → Claude analysis → pattern detection
- ✅ **Twins**: 9 specialized AI assistants → Claude-powered interactions
- ✅ **8-Layer Coherence**: heart-brain → breathing → brain → vagal tone → circadian → biofield → decision alignment → metacognitive
- ✅ **Knowledge**: learning entries → pattern analysis → learning loops
- ✅ **Accessibility**: OCR image scanning → text simplification → TTS
- ✅ **Error Handling**: 401, 400, 404, 409, 500 scenarios
- ✅ **Performance**: p50/p95/p99 latency benchmarking

## 📁 Test Scripts

### `tests/e2e-test-suite.sh` (13KB)
Main test suite covering all 32 endpoints in happy-path scenarios.

```bash
bash tests/e2e-test-suite.sh
# Runtime: ~10-12 minutes (includes Claude API calls)
# Output: Color-coded pass/fail for each endpoint
```

### `tests/error-scenarios.sh` (3.5KB)
Error case testing for all HTTP error codes.

```bash
bash tests/error-scenarios.sh
# Runtime: ~2 minutes
# Tests: 401, 400, 404, 409, 500
```

### `tests/performance-benchmark.sh` (5.2KB)
Latency measurement for all endpoint categories.

```bash
bash tests/performance-benchmark.sh
# Runtime: ~3-5 minutes
# Output: performance-results.json (p50, p95, p99 latencies)
# Iterations: 10 per endpoint (configurable via $ITERATIONS)
```

## ✅ Success Criteria

All tests pass when:
- [ ] 32/32 endpoints respond correctly
- [ ] Auth flow: register → verify → login → authenticated requests work
- [ ] Voice: emotion detected (7 emotions), features extracted, transcript generated
- [ ] Decisions: metacognitive score calculated, Claude analysis provided
- [ ] Twins: 9 types available, Claude responses generated, history stored
- [ ] Coherence: 8 layers present with values, state assigned, trend calculated
- [ ] Knowledge: entries stored, patterns analyzed, learning loops created
- [ ] Accessibility: OCR working, text simplified, TTS functional
- [ ] Errors: correct HTTP codes (401, 400, 404, 409, 500)
- [ ] Performance: p99 latency < 5000ms (except Claude endpoints which may go to 8s)
- [ ] Data isolation: users can only access their own data

## 📈 Performance Targets

| Category | P50 | P95 | P99 |
|----------|-----|-----|-----|
| Health / DB queries | 10ms | 50ms | 200ms |
| Auth (login/register) | 100ms | 250ms | 500ms |
| List endpoints | 40ms | 100ms | 250ms |
| Biometrics logging | 80ms | 150ms | 400ms |
| Coherence calculation | 100ms | 250ms | 600ms |
| Voice upload (w/ Claude) | 800ms | 1500ms | 3000ms |
| Decision analysis (Claude) | 1200ms | 2000ms | 4000ms |
| Twin interaction (Claude) | 1500ms | 2500ms | 5000ms |
| Accessibility OCR (Claude) | 2000ms | 4000ms | 8000ms |

## 🔧 Manual Testing

All endpoints can be tested manually using curl (see CURL_REFERENCE.md):

```bash
# Set environment
export JWT="<token-from-registration>"
export BASE_URL="http://localhost:5000"

# Example: Get coherence data
curl -X GET "$BASE_URL/api/coherence" \
  -H "Authorization: Bearer $JWT" | jq .

# See CURL_REFERENCE.md for all 32 endpoint examples
```

## 🐛 Troubleshooting

### Connection refused
```bash
npm run dev &
sleep 5
```

### Database error
```bash
psql -U postgres -d neural_twin_dev -c "SELECT 1"
npm run prisma:migrate
```

### JWT token invalid
```bash
# Get fresh token
JWT=$(curl -s -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test","password":"SecurePass123!"}' \
  | jq -r '.token')
echo $JWT
```

### Claude API latency
Check API health and rate limits at https://console.anthropic.com

For full troubleshooting guide, see E2E_TEST_PLAN.md (section 9).

## 📚 Documentation Index

1. **E2E_TEST_PLAN.md** — Start here for comprehensive testing specification
   - All 32 endpoints with curl commands
   - Expected JSON responses
   - Complete error scenarios
   - Troubleshooting guide
   - Success criteria checklist

2. **TEST_QUICK_START.md** — One-page quick reference
   - Setup instructions
   - Command overview
   - Expected outputs
   - Common issues

3. **CURL_REFERENCE.md** — Complete curl command library
   - All 32 endpoints with examples
   - Error handling examples
   - Batch testing scripts
   - Performance testing with curl

4. **TESTING_SUMMARY.txt** — Executive summary
   - Scope and coverage
   - Key documents overview
   - File structure
   - Next steps after testing

## 🎯 Typical Testing Workflow

```
1. Read E2E_TEST_PLAN.md (understand scope)
   ↓
2. Follow TEST_QUICK_START.md (set up environment)
   ↓
3. Run bash tests/e2e-test-suite.sh (main tests)
   ↓
4. Run bash tests/error-scenarios.sh (edge cases)
   ↓
5. Run bash tests/performance-benchmark.sh (latency)
   ↓
6. Review performance-results.json (benchmark report)
   ↓
7. Check all success criteria boxes
   ↓
8. Deploy Phase 2 ✅
```

## 📞 Support

- **Slow tests?** Check Claude API latency
- **Connection errors?** Verify backend is running (`npm run dev`)
- **Database errors?** Check PostgreSQL and migrations
- **JWT issues?** Re-register a test user
- **General questions?** Review E2E_TEST_PLAN.md section 9 (Troubleshooting)

---

**Version:** 1.0  
**Created:** 2026-06-26  
**Test Runtime:** 15-20 minutes  
**Scope:** 32 endpoints, all Phase 2 features  
**Success Rate Target:** 32/32 (100%)
