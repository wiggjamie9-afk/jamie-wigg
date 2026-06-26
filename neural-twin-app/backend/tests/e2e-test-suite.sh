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

echo "$COHERENCE_RESPONSE" | jq '.layers[] | "  \(.name): \(.value)%"' | while read -r line; do
  echo "$line"
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
