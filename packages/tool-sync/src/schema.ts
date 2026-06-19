import { z } from 'zod';

export const ToolRegistryEntrySchema = z.object({
  id: z.string().min(1).describe('Unique tool identifier (slugified)'),
  name: z.string().min(1).describe('Human-readable name'),
  category: z.string().min(1).describe('Category (Weather, Finance, etc.)'),
  description: z.string().min(1),
  provider: z.enum(['public-apis', 'mcp', 'custom']).default('public-apis'),

  // Execution
  endpoint: z.string().url().describe('API endpoint URL'),
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE']).default('GET'),
  authType: z.enum(['apiKey', 'oauth', 'none', 'bearer']).default('none'),
  authHeader: z.string().optional().describe('Auth header name'),

  // JSON Schema
  inputSchema: z.object({
    type: z.literal('object'),
    properties: z.record(z.any()).default({}),
    required: z.array(z.string()).default([]),
    additionalProperties: z.boolean().default(false),
  }),
  outputSchema: z.object({
    type: z.literal('object'),
    properties: z.record(z.any()).default({}),
  }),

  // Metadata
  freetier: z.boolean().default(true),
  rateLimit: z.string().optional(),
  enabled: z.boolean().default(true),
  lastUpdated: z.coerce.date().default(() => new Date()),

  // Fallback routing
  equivalentTools: z.array(z.string()).default([]),

  // Optional
  docUrl: z.string().url().optional(),
  exampleRequest: z.string().optional(),
  exampleResponse: z.string().optional(),
  tags: z.array(z.string()).default([]),
  popularity: z.number().min(0).max(100).optional(),
  reliability: z.number().min(0).max(100).optional(),
});

export const CategoryStatsSchema = z.object({
  count: z.number().min(0),
  tools: z.array(ToolRegistryEntrySchema),
});

export const ToolRegistrySchema = z.object({
  version: z.string(),
  lastSync: z.coerce.date(),
  categories: z.record(CategoryStatsSchema),
  byId: z.record(ToolRegistryEntrySchema),
});

export type ToolRegistryEntry = z.infer<typeof ToolRegistryEntrySchema>;
export type ToolRegistry = z.infer<typeof ToolRegistrySchema>;
export type CategoryStats = z.infer<typeof CategoryStatsSchema>;

export function isValidToolEntry(entry: unknown): entry is ToolRegistryEntry {
  try {
    ToolRegistryEntrySchema.parse(entry);
    return true;
  } catch {
    return false;
  }
}

export function isValidRegistry(registry: unknown): registry is ToolRegistry {
  try {
    ToolRegistrySchema.parse(registry);
    return true;
  } catch {
    return false;
  }
}

export function validateToolEntry(entry: unknown) {
  return ToolRegistryEntrySchema.safeParse(entry);
}

export function validateRegistry(registry: unknown) {
  return ToolRegistrySchema.safeParse(registry);
}
