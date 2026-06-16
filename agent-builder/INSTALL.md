# Agent Builder — Installation & Deployment

## Quick Start (Development)

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev
# → http://localhost:3000
```

## Builds & Verification

```bash
# Lint & type-check
pnpm lint

# Run test suite (239 tests)
pnpm test

# Production build (static export)
pnpm build
# → static HTML/JS in ./out/
```

## Routes

| Path | What | Mode |
|---|---|---|
| `/` | Home landing page | All |
| `/quick` | **Quick Builder** — single-page form (model, tools, prompt config + export) | All |
| `/builder` | **Agent Wizard** — 5-step guided creation flow | All |
| `/builder/prompts` | Prompt templates library | All |
| `/dashboard` | Agent management dashboard | Dev only* |
| `/settings` | Settings & API keys | Dev only* |

*`/dashboard` and `/settings` require Supabase credentials (`.env.local`) to function; static export serves the HTML but features won't work offline.

## Deployment

### Static Export (Recommended)

The app builds to a static HTML/JS bundle (`output: "export"` in `next.config.ts`). Deploy the `out/` directory to any static host:

```bash
pnpm build
# → out/ is ready for Vercel, Netlify, GitHub Pages, Cloudflare Pages, etc.
```

### Cloudflare Pages (via wrangler)

```bash
# Deploy the /out directory
wrangler pages deploy out/
```

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY pnpm-lock.yaml package.json ./
RUN corepack enable && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
FROM node:20-alpine
COPY --from=0 /app/out /app/out
EXPOSE 3000
CMD ["npx", "serve", "-l", "3000", "out/"]
```

## Environment Setup

### Optional: Supabase (for /dashboard, /settings)

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Optional: OpenAlex API (for metadata enrichment in /quick)

```env
NEXT_PUBLIC_OPENALEX_EMAIL=your-email@example.com
OPENAI_API_KEY=sk-...  # if using AI summaries
```

## Project Structure

```
agent-builder/
├── app/
│   ├── page.tsx                    # Home landing
│   ├── layout.tsx                  # Root layout
│   ├── globals.css                 # Global styles
│   ├── quick/page.tsx              # Quick Builder route
│   ├── builder/                    # Wizard routes
│   ├── dashboard/                  # Dashboard (auth-gated)
│   └── settings/                   # Settings (auth-gated)
├── components/
│   ├── AgentForm.tsx               # Quick Builder form
│   ├── ModelSelector.tsx           # Model picker
│   ├── ToolSelector.tsx            # Tool selector
│   ├── CapabilitiesDisplay.tsx     # Real-time preview
│   ├── templates.ts                # Quick-start templates
│   ├── BuilderSteps.tsx            # Wizard components
│   └── [dashboard, settings...]    # Dashboard components
├── lib/
│   ├── storage.ts                  # localStorage & Supabase
│   ├── agent-config.ts             # Type definitions
│   └── [utilities...]
├── __tests__/                       # Vitest suite (239 tests)
├── public/                          # Static assets
├── next.config.ts                  # Next.js config (static export)
├── tailwind.config.ts              # Tailwind setup
├── tsconfig.json                   # TypeScript config
├── package.json                    # Dependencies
└── pnpm-lock.yaml                  # Lock file (pnpm v9+)
```

## Tech Stack

- **Next.js 15.1.3** (App Router, static export)
- **React 19.2.3** + **TypeScript 5.9**
- **Tailwind CSS v4** (utility-first styling)
- **Supabase** (optional, for auth + database)
- **Vitest + jsdom** (testing, 239 tests)

## Key Features

### Quick Builder (`/quick`)
- Configure a single agent (name, model, tools, system prompt, temperature)
- Real-time capability preview
- JSON export + import
- localStorage persistence
- 4 pre-built templates (Research, Coding, Data, Support)

### Agent Wizard (`/builder`)
- 5-step guided flow
- Agent type selection
- Environment configuration
- Prompt customization
- Multi-agent projects

### Dashboard (`/dashboard`)
- View all saved agents
- Manage deployments
- Session history
- (Requires Supabase)

## Scripts

```bash
pnpm dev          # Start dev server
pnpm build        # Production build (static export → out/)
pnpm start        # Run production server (requires Node)
pnpm lint         # ESLint + TypeScript check
pnpm test         # Vitest suite
```

## Troubleshooting

### `pnpm: command not found`
Install pnpm globally: `npm install -g pnpm`

### Dev server won't start
```bash
# Clear cache and reinstall
rm -rf .next node_modules pnpm-lock.yaml
pnpm install
pnpm dev
```

### Build fails with TypeScript errors
```bash
pnpm lint    # See exact errors
pnpm build   # Rebuild
```

### `/dashboard` returns 404
Dashboard & Settings require Supabase auth. They work in dev but are not included in static export for public deployment. To include them, set `ssr: false` in `next.config.ts` and use a Node server instead of static export.

## Support

- **Docs:** [Next.js App Router](https://nextjs.org/docs/app), [Tailwind CSS](https://tailwindcss.com)
- **Tests:** `pnpm test` runs the full 239-test suite
- **Lint:** `pnpm lint` enforces TypeScript + ESLint rules
