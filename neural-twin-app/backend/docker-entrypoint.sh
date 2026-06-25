#!/bin/bash
set -e

echo "🧠 Neural Twin AIO Container Starting..."

# Generate secrets if not provided
if [ -z "$SESSION_SECRET" ]; then
    export SESSION_SECRET=$(openssl rand -hex 32)
    echo "✓ Generated SESSION_SECRET"
fi

if [ -z "$JWT_SECRET" ]; then
    export JWT_SECRET=$(openssl rand -hex 32)
    echo "✓ Generated JWT_SECRET"
fi

# Initialize PostgreSQL data directory if needed
if [ ! -s "$PGDATA/PG_VERSION" ]; then
    echo "📦 Initializing PostgreSQL database..."
    initdb -D "$PGDATA" --username=postgres --password=postgres
    echo "✓ PostgreSQL initialized"
fi

# Start supervisord (manages PostgreSQL and Node.js)
echo "🚀 Starting services via supervisord..."
exec "$@"
