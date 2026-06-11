# Agent Builder

AI Agent Builder Platform — SaaS for building, configuring, and deploying specialized AI agents.

## Stack

- **Next.js 15** (App Router), `output: "export"` (static HTML/JS bundle)
- **React 19.2.3**, **TypeScript 5.9**, **Tailwind CSS v4**
- **Vitest** for unit tests

## Quick Start

```bash
# Install dependencies
pnpm install

# Run dev server
pnpm dev

# Build for production
pnpm build

# Lint and type-check
pnpm lint

# Run tests
pnpm test
```

Dev server runs at `http://localhost:3000`.

## Project Structure

```
agent-builder/
├── app/                 # Next.js App Router
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Home page
│   └── globals.css     # Global styles
├── components/          # React components
├── lib/                # Utility functions
├── public/             # Static assets
├── package.json        # Dependencies
├── tsconfig.json       # TypeScript config
├── tailwind.config.ts  # Tailwind CSS config
├── next.config.ts      # Next.js config
└── vitest.config.ts    # Vitest config
```

## Requirements Met

- ✅ TypeScript 5.9 strict mode
- ✅ React 19.2.3
- ✅ Tailwind CSS v4
- ✅ Next.js 15 App Router
- ✅ Static export configured (`output: "export"`)
- ✅ Scripts: dev, build, lint, test
