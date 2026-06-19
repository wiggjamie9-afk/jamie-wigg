export type ProviderName = 'claude' | 'gemini' | 'groq' | 'openmono';

export type ModelTier = 'tier1' | 'tier2' | 'tier3';

export interface ModelConfig {
  provider: ProviderName;
  modelId: string;
  tier: ModelTier;
  costPer1mTokens: number;
  costPer1mOutputTokens: number;
  maxContextTokens: number;
  supportsVision: boolean;
  supportsTools: boolean;
}

export interface RoutingStrategy {
  tier: ModelTier;
  budget?: number;
  preferredProviders?: ProviderName[];
  forceProvider?: ProviderName;
  requireVision?: boolean;
  requireTools?: boolean;
}

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  imageUrls?: string[];
}

export interface RouterResponse {
  text: string;
  provider: ProviderName;
  model: string;
  inputTokens: number;
  outputTokens: number;
  cost: number;
  duration: number;
  cached?: boolean;
}

export interface ProviderError {
  provider: ProviderName;
  error: string;
  retryable: boolean;
  statusCode?: number;
}

export interface RouterConfig {
  anthropicApiKey?: string;
  googleApiKey?: string;
  groqApiKey?: string;
  openmonoUrl?: string;
  openmonoApiKey?: string;
  defaultTier?: ModelTier;
  budget?: number;
}
