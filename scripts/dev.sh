#!/bin/bash

echo "🚀 Starting all development servers..."
echo ""
echo "API will be at:       http://localhost:8000"
echo "PDF Analyzer at:      http://localhost:3000"
echo "Code Reviewer at:     http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Start API
echo "Starting API..."
cd pdf-analyzer-api
source venv/bin/activate
python main.py &
API_PID=$!
sleep 2

# Start PDF Web
echo "Starting PDF Analyzer Web..."
cd ../pdf-analyzer-web
npm run dev &
WEB_PID=$!
sleep 3

# Start Code Reviewer
echo "Starting Code Reviewer..."
cd ../code-reviewer
npm run dev &
REVIEWER_PID=$!
sleep 2

echo ""
echo "✅ All servers running!"
echo ""

# Handle shutdown
trap "kill $API_PID $WEB_PID $REVIEWER_PID 2>/dev/null" EXIT

# Wait for any process to exit
wait
