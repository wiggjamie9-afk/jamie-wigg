# Agent Templates

This directory contains 6 pre-configured agent templates for the AI Agent Builder platform. Each template includes environment defaults, session configuration, system prompts, examples, and success criteria.

## Templates

### Starter Tier

- **Code Review** (`code-review.json`) - Static analysis, bug detection, security review
- **Document Processing** (`document-processing.json`) - Data extraction, summarization, validation

### Pro Tier

- **Research** (`research.json`) - Information synthesis, source evaluation, report generation
- **Security Audit** (`security-audit.json`) - Vulnerability assessment, compliance mapping, remediation
- **Data Analysis** (`data-analysis.json`) - Statistical analysis, pattern detection, business insights

### Addon Tier

- **Customer Support** (`customer-support.json`) - Issue troubleshooting, escalation routing, user support

## Template Structure

Each template JSON includes:

```json
{
  "id": "template-id",
  "name": "Display Name",
  "description": "Human-readable description",
  "tier": "starter|pro|addon",
  "environment": {
    "model": "claude-opus-4.8|claude-sonnet-4.6|claude-haiku-4.5",
    "temperature": 0.2-0.6,
    "max_tokens": 2048-8192,
    "tools": ["tool1", "tool2"],
    "system_prompt": "Role definition"
  },
  "session": {
    "max_duration": 1800-7200,
    "memory_type": "none|conversation|context-window",
    "context_window": 8192-32768
  },
  "prompts": {
    "system": "Detailed system prompt",
    "examples": [
      {
        "input": "Example input",
        "expected_output": "Expected output"
      }
    ],
    "success_criteria": [
      "Criterion 1",
      "Criterion 2",
      "Criterion 3"
    ]
  }
}
```

## Key Design Decisions

### Model Selection
- **Claude Opus 4.8** (code-review, research, security-audit): Complex reasoning, code analysis, security
- **Claude Sonnet 4.6** (document-processing, data-analysis, customer-support): Balanced cost/performance
- **Haiku** (reserved for future): Cost-optimized templates

### Temperature Settings
- **0.2-0.3** (Code Review, Security Audit, Document Processing): Precise, deterministic output
- **0.4-0.5** (Research, Data Analysis): Balanced creativity and accuracy
- **0.6** (Customer Support): Natural, conversational tone

### Context Windows
- **8K** (Code Review, Customer Support): Single request focus
- **16K** (Document Processing, Security Audit): Multi-document processing
- **32K** (Research): Long-form synthesis and citations

### Examples Strategy
- 2-3 examples per template showing:
  - Typical input patterns
  - Expected output structure
  - Quality benchmarks
  - Edge cases (e.g., escalation in support, anomalies in data analysis)

### Success Criteria
- All templates have 3 success criteria covering:
  - Output structure/completeness
  - Quality/depth of analysis
  - Business/functional requirements

## Usage

Load templates programmatically via `lib/agent-templates.ts`:

```typescript
import { loadTemplate, loadAllTemplates } from './lib/agent-templates';

// Load single template
const codeReview = loadTemplate('code-review');

// Load all templates
const allTemplates = loadAllTemplates();

// Validate templates
const validation = validateAllTemplates();
```

## Versioning

Templates are versioned by tier and date:
- Starter: v1.0 (stable)
- Pro: v1.0 (stable)
- Addon: v1.0 (beta)

Update templates in this directory; loader automatically picks up new versions.
