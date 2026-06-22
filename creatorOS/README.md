# CreatorOS — All-in-One AI Platform for Creators

**Status**: MVP in development 🚀

CreatorOS is a comprehensive platform designed for creators to generate content, schedule posts, analyze performance, and monetize their audience—all powered by AI.

## 🎯 Features (MVP)

### Phase 1: Content Generation & Scheduling (Week 1-8)
- ✅ **Content Generation**: Create videos, music, and images with AI
- ✅ **Smart Scheduling**: Schedule posts across multiple platforms
- ✅ **Content Library**: Organize and manage all generated content
- ✅ **Calendar View**: Visual scheduling with calendar integration

### Phase 2: Analytics & Intelligence (Week 9-10)
- ✅ **Performance Analytics**: Track views, likes, comments, shares
- ✅ **AI Insights**: Automatic recommendations based on performance
- ✅ **Platform Comparison**: See which platforms perform best

### Phase 3: Monetization & AI Coaching (Week 11-12)
- ✅ **Multiple Revenue Streams**: Memberships, sponsorships, tips, affiliates
- ✅ **Buddy System Integration**: AI coaching for content strategy
- ✅ **Revenue Dashboard**: Track earnings and subscribers

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- pnpm 9+
- Supabase account
- Stripe account (for payments)
- API keys from: Replicate, ElevenLabs, Anthropic

### Installation

```bash
cd creatorOS
pnpm install
```

### Environment Setup

```bash
cp .env.example .env.local
# Edit .env.local with your API keys
```

### Development

```bash
pnpm dev
# Open http://localhost:3000
```

### Build & Deploy

```bash
pnpm build
pnpm start
```

## 📁 Project Structure

```
creatorOS/
├── app/
│   ├── (auth)/          # Login/Signup pages
│   ├── (dashboard)/     # Main dashboard pages
│   │   ├── dashboard/   # Home dashboard
│   │   ├── generate/    # Content generation
│   │   ├── schedule/    # Post scheduling
│   │   ├── analytics/   # Performance tracking
│   │   └── monetize/    # Monetization options
│   ├── api/             # API routes (placeholder)
│   ├── globals.css      # Tailwind styles
│   └── layout.tsx       # Root layout
├── lib/
│   ├── types.ts         # TypeScript types
│   ├── supabase.ts      # Supabase utilities
│   └── utils.ts         # Helper functions
├── components/          # Reusable React components
├── public/              # Static assets
└── package.json         # Dependencies
```

## 🔑 Key Technologies

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS v4
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: Stripe
- **Content Generation**: Replicate API
- **Voice/Audio**: ElevenLabs API
- **AI Coaching**: Anthropic Claude API
- **Hosting**: Vercel (recommended)

## 📊 Database Schema (Supabase)

### Tables to Create

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE,
  name TEXT,
  avatar TEXT,
  subscription TEXT DEFAULT 'free',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Generated Content
CREATE TABLE content (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  type TEXT, -- 'video', 'music', 'image'
  title TEXT,
  description TEXT,
  url TEXT,
  thumbnail TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Scheduled Posts
CREATE TABLE scheduled_posts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  content_id UUID REFERENCES content(id),
  caption TEXT,
  platforms TEXT[], -- ['twitter', 'instagram', ...]
  schedule_time TIMESTAMP,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Analytics
CREATE TABLE analytics (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  post_id UUID REFERENCES scheduled_posts(id),
  platform TEXT,
  views INT DEFAULT 0,
  likes INT DEFAULT 0,
  comments INT DEFAULT 0,
  shares INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Monetization Earnings
CREATE TABLE earnings (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  method TEXT, -- 'membership', 'sponsorship', 'tips', 'affiliate'
  amount DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | ✅ |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe public key | ✅ |
| `STRIPE_SECRET_KEY` | Stripe secret key | ✅ |
| `REPLICATE_API_TOKEN` | Replicate API token | ✅ |
| `ELEVENLABS_API_KEY` | ElevenLabs API key | ✅ |
| `ANTHROPIC_API_KEY` | Anthropic Claude API key | ✅ |

## 🎨 Design System

- **Brand Color**: Purple (#9333ea)
- **Accent Colors**: Blue, Green, Amber
- **Typography**: System fonts (SF Pro, Segoe UI)
- **Spacing**: 4px grid system
- **Component Library**: Lucide React Icons

## 📈 Pricing Tiers

| Tier | Price | Features |
|------|-------|----------|
| Free | $0 | 5 generations/mo, basic scheduling |
| Pro | $49/mo | Unlimited generations, analytics, support |
| Studio | $199/mo | Everything in Pro + team collab, advanced monetization |

## 🚧 Next Steps (Week 1)

When you get home:
1. Set up Supabase project and get credentials
2. Create Stripe account and get API keys
3. Create Replicate account for video generation
4. Run `pnpm install`
5. Add environment variables to `.env.local`
6. Test landing page with `pnpm dev`

## 📝 API Route Structure (To Build)

```
/api/
├── auth/
│   ├── signup
│   ├── login
│   └── logout
├── content/
│   ├── generate
│   ├── list
│   └── delete
├── posts/
│   ├── schedule
│   ├── list
│   └── update
├── analytics/
│   ├── dashboard
│   └── details
└── monetization/
    ├── earnings
    └── settings
```

## 🤝 Contributing

This is currently a solo project. Code changes should be committed to `claude/postfox-ai-tool-1mkuiq` branch.

## 📄 License

Proprietary — All rights reserved.

---

**Built with ❤️ for creators everywhere**
