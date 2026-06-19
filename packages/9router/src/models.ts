import { ModelConfig } from './types.js';

export const MODEL_REGISTRY: Record<string, ModelConfig> = {
  // Tier 1: Fast, cheap, lightweight (80% of requests)
  'claude-haiku-4-5-20251001': {
    provider: 'claude',
    modelId: 'claude-haiku-4-5-20251001',
    tier: 'tier1',
    costPer1mTokens: 0.8,
    costPer1mOutputTokens: 4.0,
    maxContextTokens: 200000,
    supportsVision: true,
    supportsTools: true,
  },
  'gemini-2.0-flash-lite': {
    provider: 'gemini',
    modelId: 'gemini-2.0-flash-lite',
    tier: 'tier1',
    costPer1mTokens: 0.075,
    costPer1mOutputTokens: 0.3,
    maxContextTokens: 1000000,
    supportsVision: true,
    supportsTools: true,
  },
  'llama-3.3-70b-versatile': {
    provider: 'groq',
    modelId: 'llama-3.3-70b-versatile',
    tier: 'tier1',
    costPer1mTokens: 0.59,
    costPer1mOutputTokens: 0.79,
    maxContextTokens: 8192,
    supportsVision: false,
    supportsTools: true,
  },

  // Tier 2: Balanced capability and cost (15% of requests)
  'claude-sonnet-4-6-20250514': {
    provider: 'claude',
    modelId: 'claude-sonnet-4-6-20250514',
    tier: 'tier2',
    costPer1mTokens: 3.0,
    costPer1mOutputTokens: 15.0,
    maxContextTokens: 200000,
    supportsVision: true,
    supportsTools: true,
  },
  'gemini-2.0-flash': {
    provider: 'gemini',
    modelId: 'gemini-2.0-flash',
    tier: 'tier2',
    costPer1mTokens: 0.075,
    costPer1mOutputTokens: 0.3,
    maxContextTokens: 1000000,
    supportsVision: true,
    supportsTools: true,
  },
  'mixtral-8x7b-32768': {
    provider: 'groq',
    modelId: 'mixtral-8x7b-32768',
    tier: 'tier2',
    costPer1mTokens: 0.24,
    costPer1mOutputTokens: 0.24,
    maxContextTokens: 32768,
    supportsVision: false,
    supportsTools: true,
  },

  // Tier 3: Maximum capability, highest cost (5% of requests)
  'claude-opus-4-8-20250805': {
    provider: 'claude',
    modelId: 'claude-opus-4-8-20250805',
    tier: 'tier3',
    costPer1mTokens: 15.0,
    costPer1mOutputTokens: 75.0,
    maxContextTokens: 200000,
    supportsVision: true,
    supportsTools: true,
  },
  'gemini-2.0-pro-exp-02-05': {
    provider: 'gemini',
    modelId: 'gemini-2.0-pro-exp-02-05',
    tier: 'tier3',
    costPer1mTokens: 10.0,
    costPer1mOutputTokens: 40.0,
    maxContextTokens: 1000000,
    supportsVision: true,
    supportsTools: true,
  },

  // OpenMono (fallback, local)
  'openmono-local': {
    provider: 'openmono',
    modelId: 'openmono-local',
    tier: 'tier1',
    costPer1mTokens: 0.0,
    costPer1mOutputTokens: 0.0,
    maxContextTokens: 4096,
    supportsVision: false,
    supportsTools: true,
  },
};

export function getModelsByTier(tier: 'tier1' | 'tier2' | 'tier3'): ModelConfig[] {
  return Object.values(MODEL_REGISTRY).filter((m) => m.tier === tier);
}

export function getModelsByProvider(provider: string): ModelConfig[] {
  return Object.values(MODEL_REGISTRY).filter((m) => m.provider === provider);
}

export function getModel(modelId: string): ModelConfig | undefined {
  return MODEL_REGISTRY[modelId];
}
