import { z } from 'zod';

export const ToolRegistryEntrySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  category: z.string().min(1),
  description: z.string().min(1),
  provider: z.enum(['public-apis', 'mcp', 'custom']).default('public-apis'),

  endpoint: z.string().url(),
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE']).default('GET'),
  authType: z.enum(['apiKey', 'oauth', 'none', 'bearer']).default('none'),
  authHeader: z.string().optional(),

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

  freetier: z.boolean().default(true),
  rateLimit: z.string().optional(),
  enabled: z.boolean().default(true),
  lastUpdated: z.coerce.date().default(() => new Date()),
  equivalentTools: z.array(z.string()).default([]),

  docUrl: z.string().url().optional(),
  exampleRequest: z.string().optional(),
  exampleResponse: z.string().optional(),
  tags: z.array(z.string()).default([]),
  popularity: z.number().min(0).max(100).optional(),
  reliability: z.number().min(0).max(100).optional(),
});

export const ToolRegistrySchema = z.object({
  version: z.string(),
  lastSync: z.coerce.date(),
  categories: z.record(
    z.object({
      count: z.number().min(0),
      tools: z.array(ToolRegistryEntrySchema),
    }),
  ),
  byId: z.record(ToolRegistryEntrySchema),
});

export type ToolRegistryEntry = z.infer<typeof ToolRegistryEntrySchema>;
export type ToolRegistry = z.infer<typeof ToolRegistrySchema>;

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
