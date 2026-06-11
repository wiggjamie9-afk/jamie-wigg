# Agent Config Validator & Serializer Usage Guide

## Overview

The agent configuration system consists of two modules:

- **`schemas.ts`**: Zod schemas for type definitions and runtime validation
- **`agent-config.ts`**: Validation, serialization, and manipulation functions

## Basic Validation

### Create a new agent configuration

```typescript
import { validateCreateAgentConfig, completeAgentConfig } from './agent-config';
import { CreateAgentConfig } from './schemas';

const newConfig: CreateAgentConfig = {
  type: 'code-review',
  name: 'My Code Reviewer',
  description: 'Reviews code for quality and security',
  environment: {
    model: 'claude-opus-4.8',
    temperature: 0.3,
    max_tokens: 4096,
    tools: ['code_analyzer', 'security_scanner'],
    system_prompt: 'You are an expert code reviewer'
  },
  session: {
    max_duration: 3600,
    memory_type: 'conversation',
    context_window: 8192
  },
  events: ['session_start', 'message_sent', 'session_end'],
  prompts: {
    system: 'Review code for bugs and improvements',
    examples: [
      {
        input: 'Review this function',
        expected_output: 'Review findings with recommendations'
      }
    ],
    success_criteria: ['Identifies bugs', 'Suggests improvements']
  },
  tier: 'starter'
};

// Validate and complete the config (adds id and timestamps)
const result = validateCreateAgentConfig(newConfig);
if (result.valid) {
  const config = result.data; // Full AgentConfig with id, created_at, updated_at
} else {
  console.error('Validation errors:', result.errors);
  // Example error: { field: 'temperature', message: 'Number must be less than or equal to 1', code: 'too_big' }
}
```

### Validate an existing configuration

```typescript
import { validateAgentConfig } from './agent-config';

const result = validateAgentConfig(existingConfig);
if (result.valid) {
  console.log('Config is valid:', result.data);
} else {
  console.error('Validation failed:', result.errors);
}
```

## Serialization

### Convert to JSON

```typescript
import { serializeAgentConfig } from './agent-config';

const json = serializeAgentConfig(config);
// Returns: '{"id":"...","type":"code-review",...}'

const prettyJson = serializeAgentConfig(config, true);
// Returns formatted JSON with indentation
```

### Load from JSON

```typescript
import { deserializeAgentConfig } from './agent-config';

const json = '{"id":"...","type":"code-review",...}';
const config = deserializeAgentConfig(json);
// Throws error if JSON is invalid or fails validation
```

## Config Manipulation

### Update a configuration

```typescript
import { mergeAgentConfig } from './agent-config';

const updated = mergeAgentConfig(existingConfig, {
  name: 'Updated Name',
  environment: {
    ...existingConfig.environment,
    temperature: 0.5
  }
});
// Returns new config with updated_at timestamp changed
```

### Clone a configuration

```typescript
import { cloneAgentConfig } from './agent-config';

// Create an exact copy with new ID
const cloned = cloneAgentConfig(config);
// config.id !== cloned.id
// cloned.name will be "{original name} (Clone)"

// Clone with overrides
const customClone = cloneAgentConfig(config, {
  name: 'My Custom Variant',
  tier: 'pro'
});
```

### Apply template defaults

```typescript
import { applyTemplateDefaults } from './agent-config';
import { loadTemplate } from './agent-templates';

const template = loadTemplate('code-review');
const userConfig = { name: 'My Code Reviewer' };

const merged = applyTemplateDefaults(userConfig, template);
// Returns config with template defaults + user overrides
```

## Comparison & Diffs

### Show differences between configs

```typescript
import { diffAgentConfigs } from './agent-config';

const diff = diffAgentConfigs(config1, config2);
// Returns: {
//   name: { old: 'Name 1', new: 'Name 2' },
//   temperature: { old: 0.3, new: 0.5 }
// }
```

## Export & Import

### Export for external storage

```typescript
import { exportAgentConfig } from './agent-config';

const exported = exportAgentConfig(config);
// Returns:
// {
//   version: '1.0',
//   metadata: {
//     exported_at: '2026-06-10T...',
//     exported_from: 'agent-builder/v1'
//   },
//   config: { /* full config */ }
// }

const json = JSON.stringify(exported);
// Can be saved to file or database
```

### Import from external storage

```typescript
import { importAgentConfig } from './agent-config';

const exported = JSON.parse(json);
const config = importAgentConfig(exported);
// Validates version and structure before returning config
```

## Error Handling

All validation errors follow this structure:

```typescript
interface ValidationError {
  field: string;      // e.g., 'environment.temperature'
  message: string;    // Human-readable error
  code: string;       // Zod error code (e.g., 'too_big', 'invalid_enum')
}
```

Example errors:

```
temperature: Number must be less than or equal to 1
model: Invalid enum value. Expected 'claude-opus-4.8' | 'claude-sonnet-4.6' | 'claude-haiku-4.5'
name: String must contain at least 1 character(s)
success_criteria: Array must contain at least 2 element(s)
```

## Type Definitions

### AgentConfig (Full configuration)

```typescript
{
  id: string;                    // UUID
  type: AgentType;               // 'code-review' | 'document-processing' | ...
  name: string;
  description: string;
  environment: Environment;      // Model, temperature, tokens, tools, prompt
  session: Session;              // Duration, memory type, context window
  events: EventType[];           // Tracked events: 'session_start', ...
  prompts: Prompts;              // System prompt, examples, success criteria
  tier: Tier;                    // 'starter' | 'pro' | 'addon'
  created_at: string;            // ISO-8601 datetime
  updated_at: string;            // ISO-8601 datetime
}
```

### CreateAgentConfig (For creation)

Same as AgentConfig but without: `id`, `created_at`, `updated_at`

### UpdateAgentConfig (For updates)

Same as CreateAgentConfig but all fields are optional

## Testing

Run the test suite:

```bash
pnpm test
```

Tests cover:
- Valid and invalid configurations
- Serialization/deserialization roundtrips
- Merging and updates
- Template defaults
- Cloning with overrides
- Diffs and comparisons
- Export/import with metadata
- UUID generation and timestamps
