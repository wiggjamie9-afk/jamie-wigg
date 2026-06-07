#!/bin/bash

# Startup script to run all services

echo "Starting all services..."

# Start freebuff2api
echo "Starting Freebuff2API..."
cd /home/user/jamie-wigg/freebuff2api
./freebuff2api -config config.json &
FREEBUFF_PID=$!

# Start 9router (if configured)
echo "Starting 9Router..."
cd /home/user/jamie-wigg/9router
npm run dev &
ROUTER_PID=$!

# Start freebuff2api-video dev server (optional)
echo "Starting freebuff2api-video dev server (optional)..."
cd /home/user/jamie-wigg/freebuff2api-video
npm run dev &
VIDEO_PID=$!

# Start studio dev server (optional)
echo "Starting Studio dev server (optional)..."
cd /home/user/jamie-wigg
pnpm dev &
STUDIO_PID=$!

echo ""
echo "All services started:"
echo "  Freebuff2API (PID: $FREEBUFF_PID) - localhost:8080"
echo "  9Router (PID: $ROUTER_PID) - check output for port"
echo "  Video Dev (PID: $VIDEO_PID) - check output for port"
echo "  Studio (PID: $STUDIO_PID) - check output for port"
echo ""
echo "Press Ctrl+C to stop all services"

wait
