# Universal Build Ecosystem

A comprehensive, omni-capable monorepo architecture for building any digital project imaginable: web applications, backend services, data science, AI agents, mobile apps, desktop applications, CLI tools, and infrastructure.

## Quick Start

```bash
# Install dependencies and build everything
pnpm setup

# Start development mode
pnpm dev

# Build all projects
pnpm build

# Run all tests
pnpm test
```

## Architecture

### Domains

The ecosystem is organized into 7 specialized domains, each with its own project templates, build pipelines, and conventions.

```
domains/
├── web/              Web applications (React, Vue, Next.js, Svelte)
├── backend/          Backend services (Node.js, Python, Go, Rust)
├── data/             Data science (Jupyter, R, pandas, SQL)
├── ai/               AI agents and models (LLMs, embeddings, multimodal)
├── mobile/           Mobile apps (React Native, Flutter, Expo)
├── desktop/          Desktop apps (Electron, Tauri, PyQt)
└── infrastructure/   DevOps (Docker, Kubernetes, Terraform, GitHub Actions)
```

### Shared Packages

```
packages/
├── cli/              Universal CLI orchestrator (@ecosystem/cli)
└── shared/
    └── core/         Core types and utilities (@ecosystem/core)
```

## Using the Ecosystem

### Universal CLI

The ecosystem provides a unified CLI for common operations:

```bash
# Show all commands
ecosystem --help

# Create a new project in a domain
ecosystem new web my-app
ecosystem new backend api-server
ecosystem new ai chatbot

# Start development for a domain
ecosystem dev web
ecosystem dev backend

# Build all or specific domain
ecosystem build
ecosystem build web

# Run tests
ecosystem test
ecosystem test data

# List all projects
ecosystem list

# Show ecosystem config
ecosystem config

# Setup workspace
ecosystem setup
```

### Monorepo Scripts

Run from the root directory:

```bash
# Development
pnpm dev              # Watch and rebuild all domains
pnpm dev web          # Watch web domain only

# Building
pnpm build            # Build all domains
pnpm build:all        # Clean install + build everything

# Testing
pnpm test             # Run all tests
pnpm test:watch       # Watch mode

# Code quality
pnpm lint             # Lint all code
pnpm lint:fix         # Auto-fix linting issues
pnpm type-check       # TypeScript type checking

# Utilities
pnpm clean            # Remove all dist/ and build/ directories
```

### Domain Structure

Each domain follows a consistent structure:

```
domains/web/
├── package.json      Domain metadata and scripts
├── apps/             Standalone applications
│   ├── my-app/
│   │   ├── package.json
│   │   ├── src/
│   │   ├── tsconfig.json
│   │   └── ...
│   └── another-app/
└── libs/             Shared domain libraries
    ├── ui/
    ├── api/
    └── utils/
```

## Shared Types and Utilities

### @ecosystem/core

Common types and utilities used across all domains:

```typescript
import { logger, ProjectConfig, DomainType } from '@ecosystem/core';

logger.info('Hello, ecosystem!');
logger.warn('Be careful!');
logger.error('Something went wrong', error);
```

### @ecosystem/cli

The universal CLI for orchestrating the entire ecosystem:

```bash
ecosystem new web my-app
ecosystem dev
ecosystem build
```

## Configuration

### Root Configuration Files

- **pnpm-workspace.yaml** - Monorepo workspace definition
- **tsconfig.json** - Shared TypeScript configuration
- **eslint.config.js** - Shared ESLint rules
- **.prettierrc** - Code formatting settings
- **package.json** - Root scripts and dependencies

### MCP Integration

The ecosystem integrates with Model Context Protocol (MCP) servers for AI capabilities:

```json
{
  "mcpServers": {
    "creative-stack": { ... },
    "higgsfield": { ... },
    "pollinations": { ... },
    "ruflo": { ... }
  }
}
```

## Workflow Examples

### Creating a New Web Application

```bash
# Create from template
ecosystem new web my-app

# Navigate to project
cd domains/web/apps/my-app

# Install and develop
pnpm install
pnpm dev

# Build for production
pnpm build
```

### Creating a Backend Service

```bash
ecosystem new backend api-server
cd domains/backend/apps/api-server
pnpm dev           # Start development server
pnpm test          # Run tests
pnpm build         # Build production bundle
```

### Creating a Data Science Project

```bash
ecosystem new data ml-pipeline
cd domains/data/apps/ml-pipeline

# Use Jupyter, R, or Python scripts
jupyter notebook   # Start Jupyter
python train.py    # Run training script
```

### Creating an AI Agent

```bash
ecosystem new ai chatbot
cd domains/ai/apps/chatbot

# Develop with Claude API, LlamaIndex, LangChain, etc.
pnpm dev
pnpm build
```

## Extending the Ecosystem

### Adding a New Domain

1. Create `domains/new-domain/` directory
2. Add `package.json` with domain metadata
3. Create `apps/` and `libs/` subdirectories
4. Update `pnpm-workspace.yaml`
5. Update CLI commands if needed

### Creating Shared Libraries

Place reusable code in `packages/shared/*/`:

```bash
packages/shared/ui/         # React components
packages/shared/utils/      # Utility functions
packages/shared/types/      # Shared types
```

### Adding Domain-Specific Libraries

```bash
domains/web/libs/components/   # Web component library
domains/ai/libs/models/        # Shared AI models
domains/backend/libs/database/ # Database utilities
```

## Development Guidelines

### Code Organization

- **src/** - Source code
- **dist/** or **build/** - Compiled output
- **tests/** - Test files
- **package.json** - Project dependencies

### TypeScript

All projects use TypeScript with shared configuration:

```bash
pnpm type-check    # Verify types across ecosystem
```

### Linting and Formatting

```bash
pnpm lint          # Check code quality
pnpm lint:fix      # Auto-fix issues
```

### Testing

Use Vitest for JavaScript/TypeScript projects:

```bash
pnpm test          # Run all tests
pnpm test:watch    # Watch mode
```

## Build Pipeline

### Turbo-style Caching

The monorepo uses pnpm's built-in caching for efficient builds:

```bash
pnpm build         # Only rebuilds changed packages
pnpm build --force # Force rebuild everything
```

### Dependency Management

Internal dependencies use workspace protocol:

```json
{
  "dependencies": {
    "@ecosystem/core": "workspace:*"
  }
}
```

## CI/CD Integration

The ecosystem is designed to work with GitHub Actions, GitLab CI, and other CI/CD systems:

```yaml
# Example GitHub Actions workflow
- name: Setup
  run: pnpm setup
  
- name: Test
  run: pnpm test
  
- name: Build
  run: pnpm build
```

## Troubleshooting

### Clean Installation

```bash
rm -rf node_modules
pnpm install
pnpm build
```

### TypeScript Errors

```bash
pnpm type-check     # Check all TypeScript files
pnpm clean          # Remove dist/build directories
pnpm build          # Rebuild
```

### Slow Performance

```bash
pnpm clean          # Clean artifacts
pnpm store prune    # Clean pnpm store
pnpm install        # Fresh install
```

## Resources

- **CLAUDE.md** - Claude Code integration and MCP servers
- **.mcp.json** - MCP server configuration
- **pnpm-workspace.yaml** - Monorepo structure
- **packages/cli/src/commands/** - CLI command implementations

## Next Steps

1. **Create your first project** - `ecosystem new web my-app`
2. **Explore domain templates** - Check `domains/*/apps/` for examples
3. **Use the CLI** - Run `ecosystem --help`
4. **Read CLAUDE.md** - Learn about MCP servers and skills
5. **Extend the ecosystem** - Add new domains or shared libraries

---

**Version:** 0.1.0  
**Created:** 2026-06-17  
**Maintained by:** Claude Code
