#!/bin/bash

# Run Supabase migrations
# Usage: bash scripts/run-migrations.sh

set -e

echo "🗄️  Running database migrations..."
echo ""

MIGRATIONS_DIR="agent-builder/migrations"

if [ ! -d "$MIGRATIONS_DIR" ]; then
  echo "❌ Migrations directory not found: $MIGRATIONS_DIR"
  exit 1
fi

# Check if Supabase is configured
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
  echo "❌ NEXT_PUBLIC_SUPABASE_URL not set in .env"
  exit 1
fi

echo "📍 Target: $NEXT_PUBLIC_SUPABASE_URL"
echo ""

# Run migrations in order
for migration in $(ls -1 "$MIGRATIONS_DIR"/[0-9]*.sql | sort); do
  echo "📝 Running: $(basename $migration)"
  
  # For local Supabase
  if [[ "$NEXT_PUBLIC_SUPABASE_URL" == *"localhost"* ]]; then
    supabase db push < "$migration" 2>/dev/null || echo "   ⚠️  Consider running: supabase db pull && supabase db push"
  else
    # For cloud Supabase, user must run in dashboard
    echo "   📌 Cloud Supabase detected"
    echo "   Steps:"
    echo "      1. Go to: https://app.supabase.com"
    echo "      2. Click 'SQL Editor' in sidebar"
    echo "      3. Paste contents of: $migration"
    echo "      4. Click 'Run'"
    echo ""
  fi
done

echo ""
echo "✅ Migrations complete!"
echo ""
echo "Next steps:"
echo "1. Test signup: cd agent-builder && npm run dev"
echo "2. Click 'Sign Up', create an account"
echo "3. Go to Dashboard, create an agent"
echo "4. Verify data in Supabase dashboard"
