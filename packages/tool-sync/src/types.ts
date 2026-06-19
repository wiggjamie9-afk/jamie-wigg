import type { ToolRegistryEntry } from './schema.js';

/**
 * In-memory registry produced by the builder. `byId` is a Map for O(1)
 * insert/lookup while building; it is serialized to a plain object (matching
 * the Zod `ToolRegistry` shape) when written to disk.
 */
export interface BuiltRegistry {
  version: string;
  lastSync: Date;
  categories: Record<string, { count: number; tools: ToolRegistryEntry[] }>;
  byId: Map<string, ToolRegistryEntry>;
}

export interface RawAPI {
  name: string;
  description: string;
  category: string;
  auth: string;
  https: boolean;
  cors: string;
}

export interface AuthConfig {
  type: 'apiKey' | 'oauth' | 'none' | 'bearer';
  header?: string;
}

export interface APIEndpointSchema {
  type: 'object';
  properties: Record<string, {
    type: string;
    description?: string;
    enum?: string[];
    default?: any;
  }>;
  required: string[];
  additionalProperties?: boolean;
}

export interface APIResponseSchema {
  type: 'object';
  properties: Record<string, any>;
}

export interface SyncOptions {
  registryPath: string;
  skipValidation?: boolean;
  sampleSize?: number;
  verbose?: boolean;
}

export interface SyncResult {
  success: boolean;
  totalAPIs: number;
  toolsGenerated: number;
  categoriesFound: number;
  validationErrors: Array<{ toolId: string; error: string }>;
  validationWarnings: Array<{ toolId: string; warning: string }>;
  registryPath: string;
  duration: number;
}
