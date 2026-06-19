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
