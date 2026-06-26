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

# 409 CONFLICT
# First, register a user
echo "Setting up test user for 409 conflict test..."
REGISTER=$(curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email":"duplicate-test-'"$(date +%s)"'@example.com",
    "name":"Test",
    "password":"SecurePass123!"
  }')

DUPLICATE_EMAIL=$(echo "$REGISTER" | jq -r '.user.email')

test_error \
  "Duplicate email on registration" \
  "POST" \
  "/api/auth/register" \
  "" \
  "{\"email\":\"$DUPLICATE_EMAIL\",\"name\":\"Test 2\",\"password\":\"SecurePass123!\"}" \
  "409"

# 404 NOT FOUND
TOKEN=$(echo "$REGISTER" | jq -r '.token')

test_error \
  "Non-existent voice recording" \
  "GET" \
  "/api/voice/nonexistent-id-12345" \
  "-H 'Authorization: Bearer $TOKEN'" \
  "" \
  "404"

test_error \
  "Non-existent decision" \
  "GET" \
  "/api/decisions/nonexistent-id-12345" \
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

# Malformed JSON
test_error \
  "Malformed JSON in request body" \
  "POST" \
  "/api/decisions" \
  "-H 'Authorization: Bearer $TOKEN' -H 'Content-Type: application/json'" \
  '{invalid json}' \
  "400"

echo "========================================"
echo "ERROR SCENARIO TESTS COMPLETE"
echo "========================================"
