#!/bin/bash

# ============================================================================
# NEURAL TWIN PERFORMANCE BENCHMARK
# ============================================================================

BASE_URL="${BASE_URL:-http://localhost:5000}"
ITERATIONS=${ITERATIONS:-10}
OUTPUT_FILE="performance-results.json"

# Colors
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo "Performance Benchmark Report" > "$OUTPUT_FILE"
echo "=============================" >> "$OUTPUT_FILE"
echo "Timestamp: $(date)" >> "$OUTPUT_FILE"
echo "Iterations: $ITERATIONS" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

benchmark_endpoint() {
  local method=$1
  local endpoint=$2
  local token=$3
  local data=$4
  local name=$5

  echo -e "${YELLOW}Benchmarking $name ($ITERATIONS iterations)${NC}"

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
        -d "$data" > /dev/null 2>&1
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

  # Ensure indices are within bounds
  [ "$p50_idx" -ge "${#sorted[@]}" ] && p50_idx=$(( ${#sorted[@]} - 1 ))
  [ "$p95_idx" -ge "${#sorted[@]}" ] && p95_idx=$(( ${#sorted[@]} - 1 ))
  [ "$p99_idx" -ge "${#sorted[@]}" ] && p99_idx=$(( ${#sorted[@]} - 1 ))

  local p50=${sorted[$p50_idx]}
  local p95=${sorted[$p95_idx]}
  local p99=${sorted[$p99_idx]}

  # Calculate average
  local sum=0
  for time in "${response_times[@]}"; do
    sum=$((sum + time))
  done
  local avg=$((sum / ITERATIONS))

  echo -e "${GREEN}✅ $name${NC}"
  echo "  avg=${avg}ms, p50=${p50}ms, p95=${p95}ms, p99=${p99}ms"
  echo "$name: avg=${avg}ms, p50=${p50}ms, p95=${p95}ms, p99=${p99}ms" >> "$OUTPUT_FILE"
}

# Get test token
echo -e "${BLUE}Obtaining JWT token...${NC}"
REGISTER=$(curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"perf-test-$(date +%s)@example.com\",
    \"name\": \"Perf Test\",
    \"password\": \"SecurePass123!\"
  }")

TOKEN=$(echo "$REGISTER" | jq -r '.token')
if [ "$TOKEN" == "null" ] || [ -z "$TOKEN" ]; then
  echo -e "${RED}Failed to get token. Response: $REGISTER${NC}"
  exit 1
fi

echo -e "${GREEN}Token obtained${NC}"
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
echo ""
cat "$OUTPUT_FILE"
