#!/usr/bin/env bash
# Quick-start test script for tomorrow
# Run this to spin up all three apps in parallel

set -u

GREEN=$'\e[32m'
BLUE=$'\e[34m'
RESET=$'\e[0m'

echo "${GREEN}=== RHYTHMIX App Test Suite ===${RESET}"
echo ""

# Menu
echo "${BLUE}Choose what to test:${RESET}"
echo "1. STARLIGHTMIX Studio (Next.js dev server on :3000)"
echo "2. Recovery PWA (http.server on :8000)"
echo "3. HerdCheck PWA (http.server on :8001)"
echo "4. All three in parallel"
echo ""
read -p "Enter choice [1-4]: " choice

case $choice in
  1)
    echo "${GREEN}Starting Studio dev server...${RESET}"
    cd studio && pnpm dev
    ;;
  2)
    echo "${GREEN}Starting Recovery PWA on port 8000...${RESET}"
    cd recovery && python3 -m http.server 8000 --bind 127.0.0.1
    ;;
  3)
    echo "${GREEN}Starting HerdCheck PWA on port 8001...${RESET}"
    cd livestock && python3 -m http.server 8001 --bind 127.0.0.1
    ;;
  4)
    echo "${GREEN}Starting all three apps...${RESET}"
    (
      cd studio && pnpm dev
    ) &
    STUDIO_PID=$!

    (
      cd recovery && python3 -m http.server 8000 --bind 127.0.0.1
    ) &
    RECOVERY_PID=$!

    (
      cd livestock && python3 -m http.server 8001 --bind 127.0.0.1
    ) &
    HERDCHECK_PID=$!

    echo ""
    echo "${GREEN}All apps running:${RESET}"
    echo "  Studio: http://localhost:3000 (PID: $STUDIO_PID)"
    echo "  Recovery: http://localhost:8000 (PID: $RECOVERY_PID)"
    echo "  HerdCheck: http://localhost:8001 (PID: $HERDCHECK_PID)"
    echo ""
    echo "Press Ctrl+C to stop all"

    wait
    ;;
  *)
    echo "Invalid choice"
    exit 1
    ;;
esac
