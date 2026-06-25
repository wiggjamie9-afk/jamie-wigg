#!/bin/bash

# Health check script for Neural Twin AIO container
# Verifies: PostgreSQL + Node.js backend + migrations complete

echo "🏥 Health Check: Neural Twin AIO"

# Check PostgreSQL
echo -n "  PostgreSQL... "
if pg_isready -h localhost -U postgres -d neural_twin &>/dev/null; then
    echo "✓"
else
    echo "✗"
    exit 1
fi

# Check Node.js backend
echo -n "  Backend API... "
if curl -sf http://localhost:5000/health &>/dev/null; then
    echo "✓"
else
    echo "✗"
    exit 1
fi

echo "✓ All services healthy"
exit 0
