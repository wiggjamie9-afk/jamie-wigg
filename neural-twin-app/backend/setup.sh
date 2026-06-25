#!/bin/bash
set -e

echo "🧠 Neural Twin Backend — Phase 2 Setup"
echo "========================================"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Install from https://nodejs.org (v20+)"
    exit 1
fi
echo "✓ Node.js $(node --version)"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found"
    exit 1
fi
echo "✓ npm $(npm --version)"

# Prompt for DATABASE_URL
echo ""
echo "📦 Database Configuration"
echo "Get DATABASE_URL from:"
echo "  • Neon: https://console.neon.tech → copy connection string"
echo "  • Supabase: https://supabase.com → Settings → Database → URI"
echo ""
read -p "Enter DATABASE_URL: " DATABASE_URL

if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL required"
    exit 1
fi

# Prompt for ANTHROPIC_API_KEY
echo ""
echo "🔑 API Keys"
read -p "Enter ANTHROPIC_API_KEY (sk-ant-...): " ANTHROPIC_API_KEY

if [ -z "$ANTHROPIC_API_KEY" ]; then
    echo "❌ ANTHROPIC_API_KEY required"
    exit 1
fi

# Generate secrets
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
SESSION_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")

# Create .env
cat > .env << ENVEOF
DATABASE_URL=$DATABASE_URL
ANTHROPIC_API_KEY=$ANTHROPIC_API_KEY
JWT_SECRET=$JWT_SECRET
SESSION_SECRET=$SESSION_SECRET
NODE_ENV=development
PORT=5000
LOG_LEVEL=debug
CORS_ORIGIN=http://localhost:3000,http://localhost:8000,http://localhost:19006,http://localhost:8081
CLAUDE_MODEL=claude-opus-4-8
ENVEOF

echo ""
echo "✓ .env created with your configuration"
echo ""
echo "📥 Installing dependencies..."
npm install

echo ""
echo "🗄️  Initializing database..."
npx prisma generate
npx prisma migrate dev --name init

echo ""
echo "🌱 Seeding test data..."
if [ -f "prisma/seed.ts" ]; then
    npm run seed 2>/dev/null || echo "⚠️  Seed script not configured (optional)"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 Start the backend:"
echo "   npm run dev"
echo ""
echo "📊 Test endpoints:"
echo "   curl http://localhost:5000/health"
echo ""
echo "📚 Documentation:"
echo "   See SETUP.md for detailed endpoint examples"
