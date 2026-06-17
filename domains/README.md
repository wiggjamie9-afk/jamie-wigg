# Domains

This directory contains all project domains. Each domain is a specialized area for building different types of digital projects.

## Domain Overview

### 🌐 Web (`domains/web/`)
Frontend applications, static sites, and web frameworks.

**Technologies:** React, Next.js, Vue, Svelte, Remix, Astro, TypeScript, Tailwind CSS

**Example Projects:**
- Marketing landing pages
- SPA applications
- Next.js full-stack apps
- Micro-frontends

**Getting Started:**
```bash
ecosystem new web my-app
cd domains/web/apps/my-app
pnpm dev
```

---

### 🔧 Backend (`domains/backend/`)
Server-side services, APIs, and backend infrastructure.

**Technologies:** Node.js, Express, NestJS, Python, Go, Rust, GraphQL, REST

**Example Projects:**
- REST APIs
- GraphQL servers
- Microservices
- Real-time services with WebSockets

**Getting Started:**
```bash
ecosystem new backend api-server
cd domains/backend/apps/api-server
pnpm dev
```

---

### 📊 Data Science (`domains/data/`)
Data analysis, machine learning, and analytics.

**Technologies:** Python, R, Jupyter, pandas, scikit-learn, TensorFlow, SQL

**Example Projects:**
- ML pipelines
- Data analysis notebooks
- Statistical models
- Data visualization dashboards

**Getting Started:**
```bash
ecosystem new data ml-pipeline
cd domains/data/apps/ml-pipeline
jupyter notebook
```

---

### 🤖 AI (`domains/ai/`)
AI agents, LLMs, and intelligent applications.

**Technologies:** Claude API, LlamaIndex, LangChain, embeddings, multimodal AI

**Example Projects:**
- AI chatbots
- Autonomous agents
- RAG applications
- AI-powered tools

**Getting Started:**
```bash
ecosystem new ai chatbot
cd domains/ai/apps/chatbot
pnpm dev
```

---

### 📱 Mobile (`domains/mobile/`)
Native and cross-platform mobile applications.

**Technologies:** React Native, Flutter, Expo, TypeScript, SwiftUI

**Example Projects:**
- iOS/Android apps
- Cross-platform mobile apps
- Mobile-first PWAs

**Getting Started:**
```bash
ecosystem new mobile my-app
cd domains/mobile/apps/my-app
pnpm dev
```

---

### 🖥️ Desktop (`domains/desktop/`)
Desktop applications for macOS, Windows, and Linux.

**Technologies:** Electron, Tauri, PyQt, Gtk, SwiftUI

**Example Projects:**
- Cross-platform desktop apps
- Electron applications
- Native desktop tools

**Getting Started:**
```bash
ecosystem new desktop my-app
cd domains/desktop/apps/my-app
pnpm dev
```

---

### ⚙️ Infrastructure (`domains/infrastructure/`)
DevOps, deployment, and infrastructure configuration.

**Technologies:** Docker, Kubernetes, Terraform, GitHub Actions, CI/CD

**Example Projects:**
- Docker containerization
- Kubernetes deployments
- Infrastructure as Code
- CI/CD pipelines

**Getting Started:**
```bash
cd domains/infrastructure/apps/my-config
# Configure with Docker, Terraform, etc.
```

---

## Project Structure

Each domain follows this structure:

```
domains/web/
├── package.json
├── apps/                    # Standalone applications
│   ├── my-app/
│   │   ├── src/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── vite.config.ts
│   │   └── README.md
│   └── another-app/
└── libs/                    # Shared domain libraries
    ├── ui/
    │   ├── src/
    │   ├── package.json
    │   └── tsconfig.json
    ├── api/
    └── utils/
```

## Creating Projects

### Using the CLI

```bash
ecosystem new <domain> <name>
```

### Manual Setup

1. Create directory: `domains/<domain>/apps/<project-name>/`
2. Initialize package: `pnpm init`
3. Add dependencies: `pnpm add -D typescript @types/node`
4. Create `tsconfig.json` and `src/` directory
5. Add scripts to `package.json`

## Common Tasks

### Develop
```bash
cd domains/web/apps/my-app
pnpm dev
```

### Build
```bash
cd domains/web/apps/my-app
pnpm build
```

### Test
```bash
cd domains/web/apps/my-app
pnpm test
```

### From Monorepo Root
```bash
pnpm dev web         # Develop web domain
pnpm build backend   # Build backend domain
pnpm test            # Test all domains
```

## Best Practices

1. **Keep domains isolated** - Projects in one domain rarely depend on other domains
2. **Use shared packages** - @ecosystem/core for common utilities
3. **Consistent naming** - Use kebab-case for directory and package names
4. **TypeScript everywhere** - All new projects should use TypeScript
5. **Test coverage** - Aim for >80% code coverage
6. **Documentation** - Include README.md in each project
7. **Environment variables** - Use .env.example for required env vars

## Domain-Specific Conventions

### Web Domain
- Use Tailwind CSS for styling
- Organize components by feature
- Use TypeScript strict mode
- Test React components with Vitest/React Testing Library

### Backend Domain
- Follow REST or GraphQL conventions
- Include API documentation
- Use environment variables for config
- Include database migrations if applicable

### Data Domain
- Use Jupyter notebooks for exploration
- Document data sources and transformations
- Include environment.yml or requirements.txt
- Version datasets for reproducibility

### AI Domain
- Document prompt engineering decisions
- Track model versions
- Include cost estimates for API calls
- Test edge cases thoroughly

### Mobile Domain
- Follow platform-specific guidelines (iOS HIG, Material Design)
- Test on real devices when possible
- Optimize for mobile performance
- Include platform-specific code documentation

### Desktop Domain
- Consider native look and feel
- Test on multiple OS versions
- Document system requirements
- Include platform-specific dependencies

### Infrastructure Domain
- Version all Terraform/CloudFormation
- Document resource provisioning
- Include cost estimation
- Test disaster recovery

---

**More information:** See `ECOSYSTEM.md` for full documentation.
