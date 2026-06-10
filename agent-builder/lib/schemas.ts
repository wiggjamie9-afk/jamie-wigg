import { z } from "zod";

/**
 * Zod schemas for agent configuration validation
 */

// Core enum schemas
export const AgentTypeSchema = z.enum([
  "code-review",
  "document-processing",
  "research",
  "security-audit",
  "data-analysis",
  "customer-support",
]);

export const ModelSchema = z.enum([
  "claude-opus-4.8",
  "claude-sonnet-4.6",
  "claude-haiku-4.5",
]);

export const TierSchema = z.enum(["starter", "pro", "addon"]);

export const MemoryTypeSchema = z.enum([
  "none",
  "conversation",
  "context-window",
]);

export const EventTypeSchema = z.enum([
  "session_start",
  "message_sent",
  "tool_used",
  "session_end",
]);

// Environment schema
export const EnvironmentSchema = z.object({
  model: ModelSchema.describe("Claude model to use for agent"),
  temperature: z
    .number()
    .min(0)
    .max(1)
    .describe("Sampling temperature (0-1)"),
  max_tokens: z
    .number()
    .int()
    .positive()
    .describe("Maximum tokens per response"),
  tools: z
    .array(z.string())
    .describe("List of available tools for the agent"),
  system_prompt: z
    .string()
    .min(1)
    .describe("System prompt for the agent"),
});

export type Environment = z.infer<typeof EnvironmentSchema>;

// Session schema
export const SessionSchema = z.object({
  max_duration: z
    .number()
    .int()
    .positive()
    .describe("Maximum session duration in seconds"),
  memory_type: MemoryTypeSchema.describe("Type of memory to use"),
  context_window: z
    .number()
    .int()
    .positive()
    .describe("Context window size in tokens"),
});

export type Session = z.infer<typeof SessionSchema>;

// Events schema
export const EventsSchema = z
  .array(EventTypeSchema)
  .min(1)
  .describe("Events to track during agent sessions");

// Prompt example schema
export const PromptExampleSchema = z.object({
  input: z.string().min(1).describe("Example input"),
  expected_output: z.string().min(1).describe("Expected output for example"),
});

export type PromptExample = z.infer<typeof PromptExampleSchema>;

// Prompts schema
export const PromptsSchema = z.object({
  system: z.string().min(1).describe("System-level prompt"),
  examples: z
    .array(PromptExampleSchema)
    .min(1)
    .describe("Example prompts with expected outputs"),
  success_criteria: z
    .array(z.string().min(1))
    .min(2)
    .describe("Criteria for successful agent responses"),
});

export type Prompts = z.infer<typeof PromptsSchema>;

// Full agent config schema
export const AgentConfigSchema = z.object({
  id: z.string().uuid().describe("Unique agent identifier"),
  type: AgentTypeSchema.describe("Type of agent"),
  name: z.string().min(1).max(255).describe("Agent name"),
  description: z.string().min(1).max(1000).describe("Agent description"),
  environment: EnvironmentSchema.describe("Environment configuration"),
  session: SessionSchema.describe("Session configuration"),
  events: EventsSchema.describe("Event tracking configuration"),
  prompts: PromptsSchema.describe("Prompt configuration"),
  tier: TierSchema.describe("Pricing tier"),
  created_at: z.string().datetime().describe("Creation timestamp"),
  updated_at: z.string().datetime().describe("Last update timestamp"),
});

export type AgentConfig = z.infer<typeof AgentConfigSchema>;

// Partial config for creation (without id, created_at, updated_at)
export const CreateAgentConfigSchema = AgentConfigSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
}).extend({
  id: z.string().uuid().optional().describe("Optional pre-generated UUID"),
});

export type CreateAgentConfig = z.infer<typeof CreateAgentConfigSchema>;

// Partial config for updates
export const UpdateAgentConfigSchema = CreateAgentConfigSchema.partial();

export type UpdateAgentConfig = z.infer<typeof UpdateAgentConfigSchema>;

// Validation error response
export const ValidationErrorSchema = z.object({
  field: z.string(),
  message: z.string(),
  code: z.string(),
});

export type ValidationError = z.infer<typeof ValidationErrorSchema>;

export const ValidationResultSchema = z.object({
  valid: z.boolean(),
  errors: z.array(ValidationErrorSchema).optional(),
  data: AgentConfigSchema.optional(),
});

export type ValidationResult = z.infer<typeof ValidationResultSchema>;
