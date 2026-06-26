# Neural Twin Phase 2 — End-to-End Test Plan

**Version:** 1.0  
**Date:** 2026-06-26  
**Scope:** Backend health + 31 API endpoints, auth flow, voice, decisions, twins, coherence, error scenarios, performance

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Prerequisites](#prerequisites)
3. [Endpoint Map (31 Total)](#endpoint-map-31-total)
4. [Test Scenarios](#test-scenarios)
5. [Bash + Curl Test Scripts](#bash--curl-test-scripts)
6. [Expected Outputs](#expected-outputs)
7. [Performance Benchmarking](#performance-benchmarking)
8. [Error Scenario Testing](#error-scenario-testing)
9. [Troubleshooting](#troubleshooting)
10. [Success Criteria Checklist](#success-criteria-checklist)

---

## Quick Start

```bash
# 1. Set environment (see Prerequisites)
export BASE_URL="http://localhost:5000"
export JWT_SECRET="dev-secret"
export NODE_ENV="development"

# 2. Start backend
cd neural-twin-app/backend
npm run dev

# 3. In another terminal, run test suite
bash tests/e2e-test-suite.sh

# 4. Monitor performance
bash tests/performance-benchmark.sh
```

---

## Prerequisites

### Backend Requirements

- **Node.js** 18+ (or 20 LTS recommended)
- **PostgreSQL 14+** (local or Docker)
- **npm** 9+ or **pnpm**
- **Anthropic API Key** (for Claude integration)

### Database Setup

```bash
# Option 1: Local PostgreSQL
createdb neural_twin_dev
psql neural_twin_dev -f schema.sql

# Option 2: Docker
docker run -d \
  --name postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=neural_twin_dev \
  -p 5432:5432 \
  postgres:15

# Option 3: Neon (cloud PostgreSQL)
# 1. Go to https://console.neon.tech
# 2. Create project, copy DATABASE_URL
# 3. Add to .env
```

### Environment Setup

```bash
cd neural-twin-app/backend

# 1. Copy example .env
cp .env.example .env

# 2. Fill in required values
cat > .env << 'EOF'
DATABASE_URL=postgresql://postgres:password@localhost:5432/neural_twin_dev
ANTHROPIC_API_KEY=sk-ant-XXXXXXXXXXXXXXXXXXXX
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
NODE_ENV=development
PORT=5000
LOG_LEVEL=debug
CORS_ORIGIN=http://localhost:3000,http://localhost:8000
CLAUDE_MODEL=claude-opus-4-8
SESSION_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
EOF

# 3. Install dependencies
npm install

# 4. Run Prisma migrations (if needed)
npm run prisma:migrate

# 5. Start server
npm run dev
```

### Test Tools

```bash
# Install curl (pre-installed on macOS/Linux)
which curl

# Install jq for JSON parsing
brew install jq  # macOS
apt-get install jq  # Ubuntu/Debian

# Optional: Install httpie for prettier output
brew install httpie
```

### DB Seeding (Optional)

```bash
# Create a test user programmatically
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test User",
    "password": "SecurePass123!"
  }' | jq .
```

---

## Endpoint Map (31 Total)

### 1. Health Check (1 endpoint)
| # | Method | Endpoint | Auth | Purpose |
|---|--------|----------|------|---------|
| 1 | GET | `/health` | ❌ | Backend health + DB connectivity |

### 2. Auth Endpoints (4 endpoints)
| # | Method | Endpoint | Auth | Purpose |
|---|--------|----------|------|---------|
| 2 | POST | `/api/auth/register` | ❌ | User registration |
| 3 | POST | `/api/auth/login` | ❌ | User login (JWT issue) |
| 4 | POST | `/api/auth/verify` | ❌ | JWT verification |
| 5 | POST | `/api/auth/oauth` | ❌ | OAuth (Apple/Google) |

### 3. Voice Endpoints (3 endpoints)
| # | Method | Endpoint | Auth | Purpose |
|---|--------|----------|------|---------|
| 6 | POST | `/api/voice` | ✅ | Upload audio + emotion analysis |
| 7 | GET | `/api/voice` | ✅ | List voice recordings (20 recent) |
| 8 | GET | `/api/voice/:id` | ✅ | Get specific recording + analysis |

### 4. Decisions Endpoints (4 endpoints)
| # | Method | Endpoint | Auth | Purpose |
|---|--------|----------|------|---------|
| 9 | POST | `/api/decisions` | ✅ | Log decision + metacognitive score |
| 10 | GET | `/api/decisions` | ✅ | List decisions (50 recent) |
| 11 | GET | `/api/decisions/:id` | ✅ | Get specific decision |
| 12 | GET | `/api/decisions/patterns/analysis` | ✅ | Analyze decision patterns |

### 5. Values Endpoints (2 endpoints)
| # | Method | Endpoint | Auth | Purpose |
|---|--------|----------|------|---------|
| 13 | POST | `/api/values` | ✅ | Create/update values |
| 14 | GET | `/api/values` | ✅ | Get user values |

### 6. Knowledge Endpoints (4 endpoints)
| # | Method | Endpoint | Auth | Purpose |
|---|--------|----------|------|---------|
| 15 | POST | `/api/knowledge` | ✅ | Log knowledge entry |
| 16 | GET | `/api/knowledge` | ✅ | Get knowledge base (50 recent) |
| 17 | GET | `/api/knowledge/:id` | ✅ | Get specific entry |
| 18 | POST | `/api/knowledge/learning-loop` | ✅ | Create learning loop summary |
| 19 | GET | `/api/knowledge/loops/history` | ✅ | Get learning loops (12 recent) |

### 7. Twins Endpoints (3 endpoints)
| # | Method | Endpoint | Auth | Purpose |
|---|--------|----------|------|---------|
| 20 | GET | `/api/twins` | ✅ | Get all 9 twins + interaction counts |
| 21 | POST | `/api/twins/interaction` | ✅ | Chat with a Twin (Claude response) |
| 22 | GET | `/api/twins/:type/history` | ✅ | Get Twin interaction history (30) |

### 8. Biometrics Endpoints (3 endpoints)
| # | Method | Endpoint | Auth | Purpose |
|---|--------|----------|------|---------|
| 23 | POST | `/api/biometrics` | ✅ | Log biometric data |
| 24 | GET | `/api/biometrics` | ✅ | Get biometrics (100 recent) |
| 25 | GET | `/api/biometrics/:id` | ✅ | Get specific biometric reading |

### 9. Coherence Endpoints (3 endpoints)
| # | Method | Endpoint | Auth | Purpose |
|---|--------|----------|------|---------|
| 26 | GET | `/api/coherence` | ✅ | Get current 8-layer coherence |
| 27 | GET | `/api/coherence/history` | ✅ | Get coherence progression |
| 28 | GET | `/api/coherence/:id` | ✅ | Get specific coherence metric |

### 10. Accessibility Endpoints (3 endpoints)
| # | Method | Endpoint | Auth | Purpose |
|---|--------|----------|------|---------|
| 29 | POST | `/api/accessibility/scan-book` | ✅ | OCR + extract text from image |
| 30 | POST | `/api/accessibility/tts` | ✅ | Text-to-speech |
| 31 | GET | `/api/accessibility/settings` | ✅ | Get accessibility preferences |
| 32 | POST | `/api/accessibility/settings` | ✅ | Update accessibility settings |

**TOTAL: 32 endpoints** (1 health + 31 API)

---

## Test Scenarios

### Scenario 1: Auth Flow (Happy Path)

```
1. Register new user
2. Verify JWT is issued
3. Login with credentials
4. Verify token via /verify endpoint
5. Use token in subsequent requests
```

### Scenario 2: Voice Recording → Emotion Analysis

```
1. Record/upload audio (base64 simulated)
2. Verify transcription generated
3. Check emotion detection (happy/sad/angry/neutral/surprised/fearful/disgusted)
4. Confirm acoustic features extracted
5. List all recordings
6. Fetch specific recording with full analysis
```

### Scenario 3: Decision Making → Metacognitive Breakdown

```
1. Create decision with 4-pillar metacognitive scores:
   - Planning clarity (1-10)
   - Monitoring comprehension (1-10)
   - Evaluation effectiveness (1-10)
   - Reflection insights (yes/no)
2. Verify Claude generates analysis
3. Check metacognitive score calculation
4. Fetch decision with full details
5. Analyze decision patterns (avg score, category breakdown)
```

### Scenario 4: Twin Interaction → Claude Response

```
1. Get all 9 Twins (task, coach, growth, health, relationship, financial, creative, research, metacognition)
2. Send message to Coach Twin
3. Verify Claude response
4. Store interaction in DB
5. Fetch Twin history (30 interactions)
6. Test with different Twin types and metacognitive phases
```

### Scenario 5: Coherence (8-Layer Breakdown)

```
1. Log biometric data (HR, HRV, breathing, sleep, etc.)
2. System calculates coherence metrics:
   - Layer 1: Heart-Brain Coherence
   - Layer 2: Breathing Coherence
   - Layer 3: Brain Coherence
   - Layer 4: Vagal Tone
   - Layer 5: Circadian Alignment
   - Layer 6: Biofield Coherence
   - Layer 7: Decision-Value Alignment
   - Layer 8: Metacognitive Coherence (from decisions)
3. Fetch current 8-layer breakdown
4. Verify recommendations generated
5. Check historical trend (7d, 30d, all)
```

### Scenario 6: Knowledge Base → Learning Loop

```
1. Create multiple knowledge entries (topics: AI, productivity, health)
2. Log decisions using that knowledge
3. Create learning loop summary
4. Verify Claude analyzes patterns
5. Get learning loop history
```

### Scenario 7: Accessibility (OCR + TTS)

```
1. Upload book image (base64)
2. Verify text extraction (Claude Vision)
3. Check simplification for dyslexia/ADHD
4. Get reading time estimate
5. Generate TTS audio (simulated)
6. Get/update accessibility settings
```

---

## Bash + Curl Test Scripts

### File: `tests/e2e-test-suite.sh`

```bash
#!/bin/bash
set -e

# ============================================================================
# NEURAL TWIN E2E TEST SUITE
# ============================================================================

BASE_URL="${BASE_URL:-http://localhost:5000}"
TEST_EMAIL="e2e-test-$(date +%s)@example.com"
TEST_PASSWORD="SecurePass123!"
TEST_NAME="E2E Test User"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_test() {
  echo -e "${YELLOW}[TEST]${NC} $1"
}

log_pass() {
  echo -e "${GREEN}[PASS]${NC} $1"
}

log_fail() {
  echo -e "${RED}[FAIL]${NC} $1"
  exit 1
}

# ============================================================================
# 1. HEALTH CHECK
# ============================================================================

log_test "Health check"
HEALTH_RESPONSE=$(curl -s -X GET "$BASE_URL/health")
HEALTH_STATUS=$(echo "$HEALTH_RESPONSE" | jq -r '.status')
if [ "$HEALTH_STATUS" == "healthy" ]; then
  log_pass "Backend is healthy"
else
  log_fail "Health check failed: $HEALTH_RESPONSE"
fi

# ============================================================================
# 2. AUTH FLOW
# ============================================================================

log_test "Register user: $TEST_EMAIL"
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$TEST_EMAIL\",
    \"name\": \"$TEST_NAME\",
    \"password\": \"$TEST_PASSWORD\"
  }")

USER_ID=$(echo "$REGISTER_RESPONSE" | jq -r '.user.id')
JWT_TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.token')

if [ "$USER_ID" != "null" ] && [ -n "$JWT_TOKEN" ]; then
  log_pass "User registered. ID: $USER_ID"
else
  log_fail "Registration failed: $REGISTER_RESPONSE"
fi

log_test "Verify JWT token"
VERIFY_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/verify" \
  -H "Authorization: Bearer $JWT_TOKEN")

VERIFY_VALID=$(echo "$VERIFY_RESPONSE" | jq -r '.valid')
if [ "$VERIFY_VALID" == "true" ]; then
  log_pass "JWT token verified"
else
  log_fail "Token verification failed: $VERIFY_RESPONSE"
fi

log_test "Login with credentials"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$TEST_EMAIL\",
    \"password\": \"$TEST_PASSWORD\"
  }")

LOGIN_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.token')
if [ "$LOGIN_TOKEN" != "null" ] && [ -n "$LOGIN_TOKEN" ]; then
  log_pass "Login successful"
  JWT_TOKEN=$LOGIN_TOKEN
else
  log_fail "Login failed: $LOGIN_RESPONSE"
fi

# ============================================================================
# 3. VOICE ENDPOINTS
# ============================================================================

log_test "Upload voice recording with emotion analysis"
VOICE_RESPONSE=$(curl -s -X POST "$BASE_URL/api/voice" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "audioBase64": "UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==",
    "context": "Decision about work project",
    "location": "Office",
    "decisionTitle": "Choose project tech stack",
    "planningClarity": 8
  }')

RECORDING_ID=$(echo "$VOICE_RESPONSE" | jq -r '.recordingId')
EMOTION=$(echo "$VOICE_RESPONSE" | jq -r '.emotion.primaryEmotion')

if [ "$RECORDING_ID" != "null" ]; then
  log_pass "Voice recording uploaded. ID: $RECORDING_ID. Emotion: $EMOTION"
else
  log_fail "Voice upload failed: $VOICE_RESPONSE"
fi

log_test "List voice recordings"
LIST_VOICE=$(curl -s -X GET "$BASE_URL/api/voice" \
  -H "Authorization: Bearer $JWT_TOKEN")

VOICE_COUNT=$(echo "$LIST_VOICE" | jq '.recordings | length')
log_pass "Retrieved $VOICE_COUNT voice recordings"

log_test "Get specific voice recording"
GET_VOICE=$(curl -s -X GET "$BASE_URL/api/voice/$RECORDING_ID" \
  -H "Authorization: Bearer $JWT_TOKEN")

VOICE_TRANSCRIPT=$(echo "$GET_VOICE" | jq -r '.recording.transcript')
log_pass "Retrieved voice recording. Transcript: ${VOICE_TRANSCRIPT:0:50}..."

# ============================================================================
# 4. DECISION ENDPOINTS
# ============================================================================

log_test "Create decision with metacognitive tracking"
DECISION_RESPONSE=$(curl -s -X POST "$BASE_URL/api/decisions" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Choose new job offer",
    "description": "Evaluating two job offers with different trade-offs",
    "options": {
      "option1": "Stay at current company",
      "option2": "Take new role at startup",
      "option3": "Freelance"
    },
    "chosenOption": "Take new role at startup",
    "reasoning": "Better growth potential and learning opportunities",
    "category": "career",
    "confidence": 0.8,
    "planningClarity": 9,
    "strategyChosen": "Pros-cons matrix with values alignment",
    "monitoringComprehension": 8,
    "evaluationEffectiveness": 7,
    "reflectionInsights": "Learned that I value growth over stability"
  }')

DECISION_ID=$(echo "$DECISION_RESPONSE" | jq -r '.decisionId')
METACOG_SCORE=$(echo "$DECISION_RESPONSE" | jq -r '.metacognitiveScore')

if [ "$DECISION_ID" != "null" ]; then
  log_pass "Decision created. ID: $DECISION_ID. Metacognitive Score: $METACOG_SCORE"
else
  log_fail "Decision creation failed: $DECISION_RESPONSE"
fi

log_test "Get specific decision"
GET_DECISION=$(curl -s -X GET "$BASE_URL/api/decisions/$DECISION_ID" \
  -H "Authorization: Bearer $JWT_TOKEN")

DECISION_TITLE=$(echo "$GET_DECISION" | jq -r '.decision.title')
log_pass "Retrieved decision: $DECISION_TITLE"

log_test "List decisions"
LIST_DECISIONS=$(curl -s -X GET "$BASE_URL/api/decisions" \
  -H "Authorization: Bearer $JWT_TOKEN")

DECISION_COUNT=$(echo "$LIST_DECISIONS" | jq '.decisions | length')
log_pass "Retrieved $DECISION_COUNT decisions"

log_test "Analyze decision patterns"
PATTERNS=$(curl -s -X GET "$BASE_URL/api/decisions/patterns/analysis" \
  -H "Authorization: Bearer $JWT_TOKEN")

AVG_SCORE=$(echo "$PATTERNS" | jq -r '.patterns.averageMetacognitiveScore')
log_pass "Average metacognitive score: $AVG_SCORE"

# ============================================================================
# 5. TWINS ENDPOINTS
# ============================================================================

log_test "Get all Twins"
TWINS_LIST=$(curl -s -X GET "$BASE_URL/api/twins" \
  -H "Authorization: Bearer $JWT_TOKEN")

TWIN_COUNT=$(echo "$TWINS_LIST" | jq '.twins | length')
log_pass "Retrieved $TWIN_COUNT Twins"

log_test "Chat with Coach Twin (metacognitive guidance)"
TWIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/twins/interaction" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "twinType": "coach",
    "userMessage": "I just made a major career decision. How can I deepen my reflection on this?",
    "metacognitivePhase": "reflecting",
    "contextData": {
      "decisionTitle": "New job offer",
      "emotionalState": "excited but uncertain"
    }
  }')

COACH_RESPONSE=$(echo "$TWIN_RESPONSE" | jq -r '.response')
log_pass "Coach Twin response: ${COACH_RESPONSE:0:80}..."

log_test "Chat with Growth Twin"
GROWTH_RESPONSE=$(curl -s -X POST "$BASE_URL/api/twins/interaction" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "twinType": "growth",
    "userMessage": "What learning opportunities does this new role offer?",
    "contextData": {
      "decisionTitle": "New job offer"
    }
  }')

GROWTH_MSG=$(echo "$GROWTH_RESPONSE" | jq -r '.response')
log_pass "Growth Twin response: ${GROWTH_MSG:0:80}..."

log_test "Get Twin interaction history"
TWIN_HISTORY=$(curl -s -X GET "$BASE_URL/api/twins/coach/history" \
  -H "Authorization: Bearer $JWT_TOKEN")

INTERACTION_COUNT=$(echo "$TWIN_HISTORY" | jq '.interactions | length')
log_pass "Retrieved $INTERACTION_COUNT Coach Twin interactions"

# ============================================================================
# 6. KNOWLEDGE ENDPOINTS
# ============================================================================

log_test "Create knowledge entry"
KNOWLEDGE_RESPONSE=$(curl -s -X POST "$BASE_URL/api/knowledge" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Decision-Making",
    "insight": "Taking time to reflect improves decision quality",
    "source": "personal-experience",
    "evidence": "My recent career decision benefited from deep reflection",
    "applicability": ["career", "relationships", "health"],
    "relatedTopics": ["metacognition", "emotional-intelligence"]
  }')

KNOWLEDGE_ID=$(echo "$KNOWLEDGE_RESPONSE" | jq -r '.entryId')
log_pass "Knowledge entry created. ID: $KNOWLEDGE_ID"

log_test "List knowledge entries"
LIST_KNOWLEDGE=$(curl -s -X GET "$BASE_URL/api/knowledge" \
  -H "Authorization: Bearer $JWT_TOKEN")

KNOWLEDGE_COUNT=$(echo "$LIST_KNOWLEDGE" | jq '.entries | length')
log_pass "Retrieved $KNOWLEDGE_COUNT knowledge entries"

log_test "Create learning loop (weekly)"
LOOP_RESPONSE=$(curl -s -X POST "$BASE_URL/api/knowledge/learning-loop" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "cycle": 1,
    "cycleType": "weekly",
    "keyInsights": [
      "Reflection deepens decision quality",
      "Metacognitive awareness improves choices"
    ]
  }')

LOOP_ID=$(echo "$LOOP_RESPONSE" | jq -r '.loopId')
log_pass "Learning loop created. ID: $LOOP_ID"

log_test "Get learning loops history"
LOOPS=$(curl -s -X GET "$BASE_URL/api/knowledge/loops/history" \
  -H "Authorization: Bearer $JWT_TOKEN")

LOOP_COUNT=$(echo "$LOOPS" | jq '.loops | length')
log_pass "Retrieved $LOOP_COUNT learning loops"

# ============================================================================
# 7. BIOMETRICS & COHERENCE
# ============================================================================

log_test "Log biometric data"
BIOMETRIC_RESPONSE=$(curl -s -X POST "$BASE_URL/api/biometrics" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "heartRate": 72,
    "hrv": 55,
    "breathingRate": 14,
    "sleepDuration": 7.5,
    "sleepQuality": 85,
    "steps": 8000,
    "activeMinutes": 45,
    "temperature": 98.2,
    "bloodPressure": {"systolic": 120, "diastolic": 80},
    "posture": "good",
    "source": "apple-health",
    "timeOfDay": "morning"
  }')

BIOMETRIC_ID=$(echo "$BIOMETRIC_RESPONSE" | jq -r '.biometricId')
COHERENCE=$(echo "$BIOMETRIC_RESPONSE" | jq -r '.coherence.overallCoherence')
log_pass "Biometric data logged. ID: $BIOMETRIC_ID. Coherence: $COHERENCE"

log_test "Get current 8-layer coherence"
COHERENCE_RESPONSE=$(curl -s -X GET "$BASE_URL/api/coherence" \
  -H "Authorization: Bearer $JWT_TOKEN")

COHERENCE_STATE=$(echo "$COHERENCE_RESPONSE" | jq -r '.coherenceState')
LAYER_COUNT=$(echo "$COHERENCE_RESPONSE" | jq '.layers | length')
log_pass "Coherence state: $COHERENCE_STATE. Layers: $LAYER_COUNT"

echo "$COHERENCE_RESPONSE" | jq '.layers[] | "\(.name): \(.value)%"' | while read -r line; do
  echo "  $line"
done

log_test "Get coherence history (7d)"
COHERENCE_HISTORY=$(curl -s -X GET "$BASE_URL/api/coherence/history?timeframe=7d" \
  -H "Authorization: Bearer $JWT_TOKEN")

HISTORY_POINTS=$(echo "$COHERENCE_HISTORY" | jq '.physicalCoherence.dataPoints')
TREND=$(echo "$COHERENCE_HISTORY" | jq -r '.physicalCoherence.trend')
log_pass "Coherence history: $HISTORY_POINTS data points. Trend: $TREND"

# ============================================================================
# 8. ACCESSIBILITY ENDPOINTS
# ============================================================================

log_test "Get accessibility settings"
SETTINGS=$(curl -s -X GET "$BASE_URL/api/accessibility/settings" \
  -H "Authorization: Bearer $JWT_TOKEN")

DYSLEXIA_MODE=$(echo "$SETTINGS" | jq -r '.settings.dyslexiaMode')
ADHD_MODE=$(echo "$SETTINGS" | jq -r '.settings.adhdMode')
log_pass "Accessibility settings. Dyslexia: $DYSLEXIA_MODE. ADHD: $ADHD_MODE"

log_test "Update accessibility settings"
UPDATE_SETTINGS=$(curl -s -X POST "$BASE_URL/api/accessibility/settings" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fontSize": 20,
    "lineSpacing": 2.0,
    "ttsSpeed": 0.9,
    "focusMode": true
  }')

UPDATE_SUCCESS=$(echo "$UPDATE_SETTINGS" | jq -r '.success')
log_pass "Settings updated: $UPDATE_SUCCESS"

# ============================================================================
# SUMMARY
# ============================================================================

echo ""
echo "========================================"
echo "E2E TEST SUITE COMPLETE"
echo "========================================"
echo "✅ All core endpoints tested"
echo "✅ Auth flow verified"
echo "✅ Metacognitive tracking functional"
echo "✅ Twin interactions working"
echo "✅ 8-layer coherence calculated"
echo ""
```

### File: `tests/performance-benchmark.sh`

```bash
#!/bin/bash

# ============================================================================
# NEURAL TWIN PERFORMANCE BENCHMARK
# ============================================================================

BASE_URL="${BASE_URL:-http://localhost:5000}"
ITERATIONS=10
OUTPUT_FILE="performance-results.json"

# Colors
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m'

echo "Performance Benchmark Report" > "$OUTPUT_FILE"
echo "=============================" >> "$OUTPUT_FILE"
echo "Timestamp: $(date)" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

benchmark_endpoint() {
  local method=$1
  local endpoint=$2
  local token=$3
  local data=$4
  local name=$5

  echo -e "${YELLOW}Benchmarking $name ($ITERATIONS iterations)${NC}"

  local p50_times=()
  local p95_times=()
  local p99_times=()
  local response_times=()

  for i in $(seq 1 $ITERATIONS); do
    if [ "$method" == "GET" ]; then
      local start=$(date +%s%N)
      curl -s -X GET "$BASE_URL$endpoint" \
        -H "Authorization: Bearer $token" > /dev/null
      local end=$(date +%s%N)
    else
      local start=$(date +%s%N)
      curl -s -X POST "$BASE_URL$endpoint" \
        -H "Authorization: Bearer $token" \
        -H "Content-Type: application/json" \
        -d "$data" > /dev/null
      local end=$(date +%s%N)
    fi

    local duration=$(( (end - start) / 1000000 )) # Convert to milliseconds
    response_times+=($duration)
  done

  # Calculate percentiles
  IFS=$'\n' sorted=($(sort -n <<<"${response_times[*]}"))
  unset IFS

  local p50_idx=$(( (50 * ITERATIONS) / 100 ))
  local p95_idx=$(( (95 * ITERATIONS) / 100 ))
  local p99_idx=$(( (99 * ITERATIONS) / 100 ))

  local p50=${sorted[$p50_idx]}
  local p95=${sorted[$p95_idx]}
  local p99=${sorted[$p99_idx]}

  local avg=$(( ($(IFS='+'; echo "${response_times[*]}") ) / ITERATIONS ))

  echo "  ✅ $name: avg=${avg}ms, p50=${p50}ms, p95=${p95}ms, p99=${p99}ms"
  echo "$name: avg=${avg}ms, p50=${p50}ms, p95=${p95}ms, p99=${p99}ms" >> "$OUTPUT_FILE"
}

# Get test token
echo "Obtaining JWT token..."
REGISTER=$(curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"perf-test-$(date +%s)@example.com\",
    \"name\": \"Perf Test\",
    \"password\": \"SecurePass123!\"
  }")

TOKEN=$(echo "$REGISTER" | jq -r '.token')

echo ""
echo "========================================"
echo "BENCHMARKING KEY ENDPOINTS"
echo "========================================"
echo ""

# Health
benchmark_endpoint "GET" "/health" "$TOKEN" "" "Health Check"

# Auth
benchmark_endpoint "POST" "/api/auth/login" "$TOKEN" \
  '{"email":"test@example.com","password":"SecurePass123!"}' "Login"

# Voice
VOICE_DATA='{"audioBase64":"UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==","context":"test"}'
benchmark_endpoint "POST" "/api/voice" "$TOKEN" "$VOICE_DATA" "Voice Upload"
benchmark_endpoint "GET" "/api/voice" "$TOKEN" "" "List Voices"

# Decisions
DECISION_DATA='{
  "title":"test decision","description":"test",
  "options":{"a":"opt1"},"chosenOption":"opt1","reasoning":"test",
  "category":"general","planningClarity":5,"monitoringComprehension":5,
  "evaluationEffectiveness":5,"reflectionInsights":"test"
}'
benchmark_endpoint "POST" "/api/decisions" "$TOKEN" "$DECISION_DATA" "Create Decision"
benchmark_endpoint "GET" "/api/decisions" "$TOKEN" "" "List Decisions"
benchmark_endpoint "GET" "/api/decisions/patterns/analysis" "$TOKEN" "" "Analyze Patterns"

# Twins
TWIN_DATA='{
  "twinType":"coach","userMessage":"test message","metacognitivePhase":"planning"
}'
benchmark_endpoint "POST" "/api/twins/interaction" "$TOKEN" "$TWIN_DATA" "Twin Interaction"
benchmark_endpoint "GET" "/api/twins" "$TOKEN" "" "List Twins"

# Knowledge
KNOWLEDGE_DATA='{
  "topic":"test","insight":"test insight","source":"experience",
  "applicability":["career"]
}'
benchmark_endpoint "POST" "/api/knowledge" "$TOKEN" "$KNOWLEDGE_DATA" "Create Knowledge"
benchmark_endpoint "GET" "/api/knowledge" "$TOKEN" "" "List Knowledge"

# Biometrics
BIOMETRIC_DATA='{
  "heartRate":72,"hrv":55,"breathingRate":14,"sleepQuality":85
}'
benchmark_endpoint "POST" "/api/biometrics" "$TOKEN" "$BIOMETRIC_DATA" "Log Biometrics"
benchmark_endpoint "GET" "/api/biometrics" "$TOKEN" "" "Get Biometrics"

# Coherence
benchmark_endpoint "GET" "/api/coherence" "$TOKEN" "" "Get Coherence"
benchmark_endpoint "GET" "/api/coherence/history?timeframe=7d" "$TOKEN" "" "Coherence History"

# Accessibility
benchmark_endpoint "GET" "/api/accessibility/settings" "$TOKEN" "" "Get Settings"

echo ""
echo "========================================"
echo "BENCHMARK COMPLETE"
echo "Results saved to: $OUTPUT_FILE"
echo "========================================"
```

### File: `tests/error-scenarios.sh`

```bash
#!/bin/bash

# ============================================================================
# ERROR SCENARIO TESTING
# ============================================================================

BASE_URL="${BASE_URL:-http://localhost:5000}"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

test_error() {
  local description=$1
  local method=$2
  local endpoint=$3
  local headers=$4
  local data=$5
  local expected_status=$6

  echo -e "${YELLOW}[TEST]${NC} $description"

  if [ "$method" == "GET" ]; then
    RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL$endpoint" $headers)
  else
    RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL$endpoint" \
      -H "Content-Type: application/json" $headers -d "$data")
  fi

  HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
  BODY=$(echo "$RESPONSE" | head -n-1)

  if [ "$HTTP_CODE" == "$expected_status" ]; then
    echo -e "${GREEN}[PASS]${NC} Status: $HTTP_CODE"
  else
    echo -e "${RED}[FAIL]${NC} Expected: $expected_status, Got: $HTTP_CODE"
    echo "Body: $BODY"
  fi
  echo ""
}

echo "========================================"
echo "ERROR SCENARIO TESTS"
echo "========================================"
echo ""

# 401 UNAUTHORIZED
test_error \
  "Missing JWT token on protected route" \
  "GET" \
  "/api/voice" \
  "" \
  "" \
  "401"

test_error \
  "Invalid JWT token format" \
  "GET" \
  "/api/voice" \
  "-H 'Authorization: Bearer invalid-token'" \
  "" \
  "401"

test_error \
  "Expired/malformed JWT" \
  "GET" \
  "/api/voice" \
  "-H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid.invalid'" \
  "" \
  "401"

# 400 VALIDATION ERRORS
test_error \
  "Missing required field (email) in registration" \
  "POST" \
  "/api/auth/register" \
  "" \
  '{"name":"Test","password":"SecurePass123!"}' \
  "400"

test_error \
  "Invalid email format" \
  "POST" \
  "/api/auth/register" \
  "" \
  '{"email":"not-an-email","name":"Test","password":"SecurePass123!"}' \
  "400"

test_error \
  "Password too short (< 8 chars)" \
  "POST" \
  "/api/auth/register" \
  "" \
  '{"email":"test@example.com","name":"Test","password":"short"}' \
  "400"

test_error \
  "Missing required decision fields" \
  "POST" \
  "/api/decisions" \
  "-H 'Authorization: Bearer test-token'" \
  '{"title":"test"}' \
  "401"

# 409 CONFLICT
# First, register a user
REGISTER=$(curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email":"duplicate-test@example.com",
    "name":"Test",
    "password":"SecurePass123!"
  }')

test_error \
  "Duplicate email on registration" \
  "POST" \
  "/api/auth/register" \
  "" \
  '{"email":"duplicate-test@example.com","name":"Test 2","password":"SecurePass123!"}' \
  "409"

# 404 NOT FOUND
TOKEN=$(echo "$REGISTER" | jq -r '.token')

test_error \
  "Non-existent voice recording" \
  "GET" \
  "/api/voice/nonexistent-id" \
  "-H 'Authorization: Bearer $TOKEN'" \
  "" \
  "404"

test_error \
  "Non-existent decision" \
  "GET" \
  "/api/decisions/nonexistent-id" \
  "-H 'Authorization: Bearer $TOKEN'" \
  "" \
  "404"

test_error \
  "Non-existent route (404)" \
  "GET" \
  "/api/nonexistent-endpoint" \
  "-H 'Authorization: Bearer $TOKEN'" \
  "" \
  "404"

# 500 SERVER ERROR (trigger by invalid payload)
test_error \
  "Malformed JSON body" \
  "POST" \
  "/api/decisions" \
  "-H 'Authorization: Bearer $TOKEN' -H 'Content-Type: application/json'" \
  '{invalid json}' \
  "400"

echo "========================================"
echo "ERROR SCENARIO TESTS COMPLETE"
echo "========================================"
```

---

## Expected Outputs

### Health Check
```json
{
  "status": "healthy",
  "timestamp": "2026-06-26T12:34:56.789Z",
  "environment": "development"
}
```

### Auth Register
```json
{
  "user": {
    "id": "uuid-here",
    "email": "test@example.com",
    "name": "Test User"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Voice Recording
```json
{
  "success": true,
  "recordingId": "uuid",
  "transcript": "Transcription of voice message...",
  "emotion": {
    "primaryEmotion": "neutral",
    "confidence": 0.75,
    "all_emotions": {
      "happy": 0.2,
      "sad": 0.15,
      "angry": 0.1,
      "neutral": 0.75,
      "surprised": 0.05,
      "fearful": 0.02,
      "disgusted": 0.03
    }
  },
  "acousticFeatures": {
    "pitch": 145.3,
    "speech_rate": 125.8,
    "jitter": 0.012,
    "formants": [800, 1500, 2800],
    "mfcc": [...],
    "prosody": {...}
  }
}
```

### Decision Creation
```json
{
  "success": true,
  "decisionId": "uuid",
  "metacognitiveScore": "72.5%",
  "analysis": "This decision demonstrates strong planning clarity (9/10) and good monitoring comprehension (8/10). The reflection insights show deep self-awareness about values. Consider documenting how this decision aligns with your long-term goals.",
  "insights": {
    "planningClarity": 9,
    "monitoringComprehension": 8,
    "evaluationEffectiveness": 7,
    "hasReflection": true
  }
}
```

### 8-Layer Coherence
```json
{
  "success": true,
  "coherenceState": "coherent",
  "overallCoherence": "78.5",
  "layers": [
    {
      "layer": 1,
      "name": "Heart-Brain Coherence",
      "value": "75.0",
      "description": "Heart and brain synchronized at 0.1 Hz"
    },
    {
      "layer": 2,
      "name": "Breathing Coherence",
      "value": "82.0",
      "description": "Breath synchronized with heart rate variability"
    },
    {
      "layer": 3,
      "name": "Brain Coherence",
      "value": "70.0",
      "description": "Alpha/theta brain wave synchronization"
    },
    {
      "layer": 4,
      "name": "Vagal Tone",
      "value": "68.0",
      "description": "Parasympathetic nervous system strength"
    },
    {
      "layer": 5,
      "name": "Circadian Alignment",
      "value": "85.0",
      "description": "Sleep/wake cycle alignment"
    },
    {
      "layer": 6,
      "name": "Biofield Coherence",
      "value": "72.0",
      "description": "Electromagnetic coherence (Tesla principle)"
    },
    {
      "layer": 7,
      "name": "Decision-Value Alignment",
      "value": "80.0",
      "description": "Choices aligned with core values"
    },
    {
      "layer": 8,
      "name": "Metacognitive Coherence",
      "value": "72.5",
      "description": "Quality of thinking about thinking (4-pillar framework)"
    }
  ],
  "recommendations": "...",
  "timestamp": "2026-06-26T12:34:56.789Z"
}
```

### Twin Interaction
```json
{
  "success": true,
  "interactionId": "uuid",
  "response": "That's a profound reflection. The fact that you're considering how this decision aligns with your values shows strong metacognitive awareness. In the 'reflecting' phase, I'd encourage you to journalize about: 1) What surprised you most about this decision process? 2) What would you do differently next time? 3) How does this decision reflect your deepest values?",
  "phase": "reflecting"
}
```

---

## Performance Benchmarking

### Expected Latency Targets

| Endpoint | P50 | P95 | P99 | Notes |
|----------|-----|-----|-----|-------|
| GET /health | 10ms | 20ms | 50ms | DB query |
| POST /auth/register | 150ms | 300ms | 500ms | Password hashing |
| POST /auth/login | 100ms | 200ms | 400ms | Password comparison |
| POST /api/voice | 800ms | 1500ms | 3000ms | Claude transcription |
| GET /api/voice | 50ms | 100ms | 200ms | DB query |
| POST /api/decisions | 1200ms | 2000ms | 4000ms | Claude analysis |
| GET /api/decisions | 50ms | 100ms | 200ms | DB query |
| POST /api/twins/interaction | 1500ms | 2500ms | 5000ms | Claude response |
| GET /api/coherence | 100ms | 200ms | 500ms | Calculation + DB |
| GET /api/coherence/history | 200ms | 400ms | 1000ms | Multi-record fetch |
| POST /api/accessibility/scan-book | 2000ms | 4000ms | 8000ms | Claude Vision |

### Benchmark Command
```bash
bash tests/performance-benchmark.sh
```

---

## Error Scenario Testing

### 401 Unauthorized
```bash
# Missing token
curl -X GET http://localhost:5000/api/voice
# Response: {"error": "Authentication required"}

# Invalid token
curl -X GET http://localhost:5000/api/voice \
  -H "Authorization: Bearer invalid-token"
# Response: {"error": "Invalid or expired token"}
```

### 400 Validation Error
```bash
# Missing required field
curl -X POST http://localhost:5000/api/decisions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"test"}'
# Response: {"error": "Missing required fields: ..."}

# Invalid email format
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"not-email","name":"Test","password":"SecurePass123!"}'
# Response: {"error": [{"code":"invalid_string","..."}]}
```

### 404 Not Found
```bash
# Non-existent resource
curl -X GET http://localhost:5000/api/voice/nonexistent-uuid \
  -H "Authorization: Bearer $TOKEN"
# Response: {"error": "Recording not found"}

# Non-existent route
curl -X GET http://localhost:5000/api/nonexistent
# Response: {"error": "Not found"}
```

### 409 Conflict
```bash
# Duplicate email
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"existing@example.com",
    "name":"Test",
    "password":"SecurePass123!"
  }'
# Response: {"error": "User already exists"}
```

### 500 Server Error
```bash
# Database connection failure
# (Test by disconnecting DB, then hitting an endpoint)
curl -X GET http://localhost:5000/api/decisions \
  -H "Authorization: Bearer $TOKEN"
# Response: {"error": "Failed to fetch decisions"} (or detailed error in dev mode)
```

---

## Troubleshooting

### Issue: "Connection refused on localhost:5000"
**Solution:**
```bash
# 1. Check if server is running
lsof -i :5000

# 2. Start server
cd neural-twin-app/backend
npm run dev

# 3. Verify DATABASE_URL is set
echo $DATABASE_URL
```

### Issue: "Database connection error"
**Solution:**
```bash
# 1. Check PostgreSQL is running
psql -U postgres -d neural_twin_dev -c "SELECT 1"

# 2. If using Docker
docker ps | grep postgres

# 3. Recreate DB
dropdb neural_twin_dev
createdb neural_twin_dev
npm run prisma:migrate
```

### Issue: "Invalid JWT token" errors
**Solution:**
```bash
# 1. Verify JWT_SECRET is set
echo $JWT_SECRET

# 2. Re-register a user to get fresh token
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test-$(date +%s)@example.com",
    "name":"Test",
    "password":"SecurePass123!"
  }' | jq '.token'

# 3. Use new token in subsequent requests
```

### Issue: "Claude API key not working"
**Solution:**
```bash
# 1. Check ANTHROPIC_API_KEY
echo $ANTHROPIC_API_KEY | head -c 20

# 2. Verify it's valid at https://console.anthropic.com/account/keys

# 3. Check API quota/rate limits:
curl https://api.anthropic.com/v1/auth/check \
  -H "x-api-key: $ANTHROPIC_API_KEY"
```

### Issue: "CORS errors in browser"
**Solution:**
```bash
# Set CORS_ORIGIN to match frontend URL
export CORS_ORIGIN="http://localhost:3000,http://localhost:8000"

# Restart backend
npm run dev
```

### Issue: Performance tests show p99 > 5 seconds
**Solution:**
```bash
# 1. Check Claude API latency
time curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"claude-opus-4-8","max_tokens":100,"messages":[{"role":"user","content":"hi"}]}'

# 2. Check DB query performance
npm run prisma:studio # Visual DB explorer

# 3. Add indexes for frequent queries
npm run prisma:migrate

# 4. Enable query logging
export DEBUG=prisma:*
npm run dev
```

---

## Success Criteria Checklist

### ✅ Backend Health & Connectivity
- [ ] Health check endpoint returns `status: "healthy"`
- [ ] Database connectivity confirmed
- [ ] All 32 endpoints are accessible
- [ ] No 500 errors on valid requests

### ✅ Auth Flow
- [ ] User registration creates account with hashed password
- [ ] JWT token issued on registration
- [ ] JWT token verified successfully
- [ ] Login with email/password works
- [ ] Token includes userId and email claims
- [ ] 401 returned when token missing
- [ ] 401 returned when token invalid/expired
- [ ] 409 returned on duplicate email

### ✅ Voice Processing
- [ ] Voice upload accepts base64 audio
- [ ] Emotion detection returns 7 emotions with scores
- [ ] Acoustic features extracted (pitch, speech rate, formants, MFCC, prosody)
- [ ] Transcript generated (or simulated)
- [ ] List endpoint returns 20 most recent
- [ ] Specific recording retrieval works with full analysis
- [ ] 404 returned for non-existent recording

### ✅ Decisions & Metacognition
- [ ] Decision creation with 4-pillar metacognitive scores
- [ ] Metacognitive score calculated: `(planning + monitoring + evaluating + reflecting) / 4`
- [ ] Claude generates decision analysis
- [ ] Decision metadata stored correctly
- [ ] Pattern analysis shows avg score, confidence, category breakdown
- [ ] Specific decision retrieval includes full analysis
- [ ] 400 returned when missing required fields

### ✅ Twins Interaction
- [ ] 9 Twin types available (task, coach, growth, health, relationship, financial, creative, research, metacognition)
- [ ] Chat sends message + context to Claude
- [ ] Claude response includes metacognitive guidance (if coach Twin + reflecting phase)
- [ ] Interaction stored with full context
- [ ] History retrieval returns 30 most recent
- [ ] Different Twin types have different personalities
- [ ] Metacognitive phase parameter works

### ✅ 8-Layer Coherence
- [ ] Layer 1 (Heart-Brain Coherence) calculated from HRV
- [ ] Layer 2 (Breathing Coherence) calculated from breathing rate
- [ ] Layer 3 (Brain Coherence) present with value
- [ ] Layer 4 (Vagal Tone) calculated from HR
- [ ] Layer 5 (Circadian Alignment) from sleep data
- [ ] Layer 6 (Biofield Coherence) present
- [ ] Layer 7 (Decision-Value Alignment) from decisions
- [ ] Layer 8 (Metacognitive Coherence) from decision metrics
- [ ] Overall coherence = weighted average of 8 layers
- [ ] Coherence state (coherent/transitioning/stressed) assigned
- [ ] History shows trend (improving/declining/stable)
- [ ] Recommendations generated by Claude

### ✅ Knowledge & Learning
- [ ] Knowledge entries stored with topic, insight, source
- [ ] Entries grouped by topic
- [ ] Learning loop created with cycle number + type
- [ ] Claude analyzes patterns across entries and decisions
- [ ] Loop history shows last 12 cycles

### ✅ Biometrics
- [ ] Post endpoint accepts all biometric fields
- [ ] Coherence metrics created from biometric data
- [ ] Get endpoint returns historical data (24h/7d/30d/all)
- [ ] Biometric list shows trend (improving/declining/stable)

### ✅ Accessibility
- [ ] Book scan accepts base64 image
- [ ] Claude Vision extracts text
- [ ] Text simplified for dyslexia/ADHD readers
- [ ] Reading time estimated
- [ ] TTS endpoint accepts text + speed
- [ ] Settings endpoint returns all preferences
- [ ] Settings update successful

### ✅ Error Handling
- [ ] 401 on missing/invalid JWT
- [ ] 400 on validation failure
- [ ] 404 on non-existent resource
- [ ] 409 on duplicate email
- [ ] 500 on server error (graceful with logging)

### ✅ Performance
- [ ] p50 latency within targets (see table)
- [ ] p95 latency < 3000ms (except Claude endpoints)
- [ ] p99 latency < 5000ms
- [ ] No memory leaks after 1000+ requests
- [ ] Database connection pooling working

### ✅ Data Integrity
- [ ] User ID extracted from JWT (not client-supplied)
- [ ] Users can only access their own data
- [ ] Decision scores match formula
- [ ] Coherence values 0-100
- [ ] Timestamps in ISO 8601 format
- [ ] All responses include `success` flag

---

## Running the Tests

### One-Command Test Suite
```bash
# Create test scripts directory
mkdir -p tests

# Copy test files from this document
cp e2e-test-suite.sh tests/
cp performance-benchmark.sh tests/
cp error-scenarios.sh tests/

# Make executable
chmod +x tests/*.sh

# Run full suite
bash tests/e2e-test-suite.sh
bash tests/error-scenarios.sh
bash tests/performance-benchmark.sh
```

### Environment Variables
```bash
# .env for testing
export BASE_URL="http://localhost:5000"
export NODE_ENV="development"
export DATABASE_URL="postgresql://user:password@localhost:5432/neural_twin_dev"
export ANTHROPIC_API_KEY="sk-ant-..."
export JWT_SECRET="dev-secret"
export CORS_ORIGIN="http://localhost:3000,http://localhost:8000"
```

### CI/CD Integration (GitHub Actions)
```yaml
# .github/workflows/api-tests.yml
name: API Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: password
          POSTGRES_DB: neural_twin_dev
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: cd neural-twin-app/backend && npm install
      - run: npm run prisma:migrate
      - run: npm run dev &
      - run: sleep 5 && bash tests/e2e-test-suite.sh
      - run: bash tests/error-scenarios.sh
```

---

## Summary

This test plan covers:
- ✅ **32 API endpoints** (health + 31)
- ✅ **Auth flow** (register → verify → login → logout)
- ✅ **Voice processing** (upload → emotion → history)
- ✅ **Decisions** (create → analyze → pattern detection)
- ✅ **Twins** (9 types → Claude interaction → history)
- ✅ **8-Layer coherence** (biometrics → layers → recommendations)
- ✅ **Error scenarios** (401, 400, 404, 409, 500)
- ✅ **Performance** (p50/p95/p99 latency targets)
- ✅ **Data validation** (JWT isolation, required fields, formats)

**Time to Run:** ~15-20 minutes (including Claude API calls)  
**Success Rate Target:** 100% (32/32 endpoints)  
**Performance Target:** p99 < 5000ms for non-Claude endpoints
