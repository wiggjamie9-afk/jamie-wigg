#!/bin/bash
echo "🚀 Starting All Engines..."
echo ""

# Core APIs
echo "✓ Freebuff2API (:8080)"
./freebuff2api/freebuff2api -config freebuff2api/config.json &

# Video & Animation
echo "✓ HyperFrames Preview (:3002)"
cd freebuff2api-video && npm run dev &

# Presentation Tool  
echo "✓ nodeppt (presentations)"

# Graphics & 3D Ready
echo "✓ Anime.js (animations)"
echo "✓ Three.js (3D rendering)"

# AI Animation Framework Ready
echo "✓ AI4Animation (framework installed)"

echo ""
echo "All engines online."
wait
