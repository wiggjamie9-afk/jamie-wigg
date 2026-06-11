# Design: AI Agent Builder Platform

## Approach
Build a unified SaaS platform (Next.js 15 static export) that unites agent discovery, builder, documentation, and pricing under one cohesive brand. The core insight: agents are defined by their **4 core concepts** (Agent, Environment, Session, Events) and **5-step workflow** (Create → Configure → Build → Stream → Fine-tune). Use the same workflow for all 6 agent types to reduce cognitive load and maximize reusability (R1–R5). Pair with a 60s HyperFrames promo video highlighting this unified story, landing on rhythmixapp.com.au (R6–R7).

## Components

### Agent Builder Web App (`agent-builder/`)
- **Responsibility**: Next.js 15 SaaS application providing agent creation, configuration, documentation, and account management
- **Files**: `agent-builder/`, `agent-builder/app/`, `agent-builder/components/`, `agent-builder/lib/`, `agent-builder/public/`
- **Interface**: 
  - Dashboard (home page with project list)
  - Agent creation flow (6 type selector → step-by-step builder → preview → deploy)
  - API reference (REST endpoints for agent config, execution, analytics)
  - Account settings (authentication, billing, project management)
- **Satisfies**: R2, R3, R5, R9, R10

### Landing Page (`sites/agent-builder/`)
- **Responsibility**: Public-facing marketing site explaining the platform, core concepts, 6 agent types, pricing, and sign-up
- **Files**: `sites/agent-builder/index.html`, `sites/agent-builder/pricing.html`, `sites/agent-builder/agents.html`, `sites/agent-builder/docs.html`
- **Interface**: Multi-page HTML (home, pricing, agent showcase, API docs), CTA buttons linking to app sign-up
- **Satisfies**: R6, R8

### Promo Video (`rhythmix-agent-builder-60s/`)
- **Responsibility**: 60s HyperFrames composition introducing the platform and highlighting the 5-step workflow
- **Files**: `rhythmix-agent-builder-60s/index.html`, `rhythmix-agent-builder-60s/script.txt`, `rhythmix-agent-builder-60s/narration.wav`, `rhythmix-agent-builder-60s/hyperframes.json`, renders/
- **Interface**: Animated walkthrough of agent creation flow with hook, visuals for each step, call-to-action at end
- **Satisfies**: R7

### Agent Templates & Prompts (`agent-builder/templates/`)
- **Responsibility**: Pre-configured agent templates for 6 types with copy-paste Claude prompts
- **Files**: `agent-builder/templates/{code-review,document-processing,research,security-audit,data-analysis,customer-support}.json`
- **Interface**: JSON schema defining: agent type, environment defaults, session config, example prompts, success criteria
- **Satisfies**: R1, R4

### API & Deployment Docs (`specs/agent-builder/design.md` + `launch-kit/agent-builder/`)
- **Responsibility**: REST API documentation, deployment guides, example integrations
- **Files**: `specs/agent-builder/api-spec.md`, `launch-kit/agent-builder/deployment-guide.md`, `launch-kit/agent-builder/quickstart.md`
- **Interface**: Markdown docs + OpenAPI schema
- **Satisfies**: R8

### Marketing Assets (`launch-kit/agent-builder/`)
- **Responsibility**: Social media copy, email templates, blog post outlines, comparison sheets
- **Files**: `launch-kit/agent-builder/{social-posts.md,email-sequences.md,blog-outlines.md,pricing-comparison.md}`
- **Interface**: Markdown + copy-paste ready text
- **Satisfies**: R5

## Data

**Agent Configuration Schema**:
```json
{
  "id": "agent-uuid",
  "type": "code-review|document-processing|research|security-audit|data-analysis|customer-support",
  "name": "string",
  "description": "string",
  "environment": {
    "model": "claude-opus-4.8|claude-sonnet-4.6|claude-haiku-4.5",
    "temperature": 0-1,
    "max_tokens": number,
    "tools": ["string"],
    "system_prompt": "string"
  },
  "session": {
    "max_duration": number,
    "memory_type": "none|conversation|context-window",
    "context_window": number
  },
  "events": ["session_start", "message_sent", "tool_used", "session_end"],
  "prompts": {
    "system": "string",
    "examples": ["string"],
    "success_criteria": ["string"]
  },
  "tier": "starter|pro|addon",
  "created_at": "iso-8601",
  "updated_at": "iso-8601"
}
```

**User/Account Schema**:
- User table: id, email, name, created_at, updated_at
- Project table: id, user_id, agent_type, config (JSON), tier, created_at, updated_at
- Analytics table: id, project_id, event_type, timestamp, metadata

## Risks

- **Risk**: Agents in this platform are templates, not live services. Users may expect built-in execution + hosting.
  - **Mitigation**: Clear messaging on landing page: "Build and configure agents; deploy yourself or via partner APIs." Provide deployment guides for AWS Lambda, Vercel, etc.

- **Risk**: 6 agent types could cause decision paralysis in the UI.
  - **Mitigation**: Start with a guided questionnaire that recommends a type based on user's use case, then allow manual override.

- **Risk**: Copy-paste prompts may be stale or generic.
  - **Mitigation**: Version control prompts, include update dates, allow users to submit improvements via GitHub Issues or feedback form.
