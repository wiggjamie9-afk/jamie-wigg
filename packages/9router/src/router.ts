import { config } from 'dotenv';
import { BaseProvider } from './providers/base.js';
import { ClaudeProvider } from './providers/claude.js';
import { GeminiProvider } from './providers/gemini.js';
import { GroqProvider } from './providers/groq.js';
import { OpenMonoProvider } from './providers/openmono.js';
import { getModelsByTier, getModel } from './models.js';
import {
  Message,
  ModelTier,
  ProviderName,
  RouterConfig,
  RouterResponse,
  RoutingStrategy,
} from './types.js';

config();

export class LLMRouter {
  private providers: Map<ProviderName, BaseProvider> = new Map();
  private totalSpent: number = 0;
  private requestLog: Array<{
    timestamp: Date;
    model: string;
    provider: ProviderName;
    cost: number;
    duration: number;
  }> = [];

  constructor(config: RouterConfig = {}) {
    const anthropicKey = config.anthropicApiKey || process.env.ANTHROPIC_API_KEY;
    const googleKey = config.googleApiKey || process.env.GOOGLE_API_KEY;
    const groqKey = config.groqApiKey || process.env.GROQ_API_KEY;

    if (anthropicKey) {
      this.providers.set('claude', new ClaudeProvider(anthropicKey));
    }
    if (googleKey) {
      this.providers.set('gemini', new GeminiProvider(googleKey));
    }
    if (groqKey) {
      this.providers.set('groq', new GroqProvider(groqKey));
    }

    // OpenMono is the last-resort local fallback: register it whenever a URL
    // is configured (defaults to the local server). No API key required.
    const openmonoUrl = config.openmonoUrl || process.env.OPENMONO_URL;
    if (openmonoUrl) {
      this.providers.set(
        'openmono',
        new OpenMonoProvider(openmonoUrl, config.openmonoApiKey || process.env.OPENMONO_API_KEY),
      );
    }

    if (this.providers.size === 0) {
      throw new Error(
        'At least one provider required: set ANTHROPIC_API_KEY, GOOGLE_API_KEY, GROQ_API_KEY, or OPENMONO_URL',
      );
    }
  }

  async route(
    messages: Message[],
    strategy: RoutingStrategy = { tier: 'tier1' },
  ): Promise<RouterResponse> {
    const candidates = this.selectModels(strategy);
    if (candidates.length === 0) {
      throw new Error('No suitable models found for routing strategy');
    }

    let lastError: any;
    for (const candidate of candidates) {
      try {
        const modelConfig = getModel(candidate.modelId);
        if (!modelConfig) {
          continue;
        }

        const provider = this.providers.get(candidate.provider);
        if (!provider) {
          continue;
        }

        const startTime = Date.now();
        const result = await provider.call(messages, candidate.modelId, {
          maxTokens: 4096,
          temperature: 0.7,
        });
        const duration = Date.now() - startTime;

        const cost = this.calculateCost(
          modelConfig.costPer1mTokens,
          modelConfig.costPer1mOutputTokens,
          result.inputTokens,
          result.outputTokens,
        );

        this.totalSpent += cost;
        this.requestLog.push({
          timestamp: new Date(),
          model: candidate.modelId,
          provider: candidate.provider,
          cost,
          duration,
        });

        return {
          text: result.text,
          provider: candidate.provider,
          model: candidate.modelId,
          inputTokens: result.inputTokens,
          outputTokens: result.outputTokens,
          cost,
          duration,
        };
      } catch (error) {
        lastError = error;
        console.warn(
          `Provider ${candidate.provider} failed, trying next:`,
          (error as any).message,
        );
        continue;
      }
    }

    throw new Error(
      `All routing candidates failed. Last error: ${lastError?.message || 'Unknown'}`,
    );
  }

  private selectModels(strategy: RoutingStrategy): Array<{ provider: ProviderName; modelId: string }> {
    const models = getModelsByTier(strategy.tier);

    let filtered = models;

    if (strategy.requireVision) {
      filtered = filtered.filter((m) => m.supportsVision);
    }

    if (strategy.requireTools) {
      filtered = filtered.filter((m) => m.supportsTools);
    }

    if (strategy.preferredProviders && strategy.preferredProviders.length > 0) {
      filtered = filtered.sort((a, b) => {
        const aIndex = strategy.preferredProviders!.indexOf(a.provider);
        const bIndex = strategy.preferredProviders!.indexOf(b.provider);
        if (aIndex === -1 && bIndex === -1) return 0;
        if (aIndex === -1) return 1;
        if (bIndex === -1) return -1;
        return aIndex - bIndex;
      });
    }

    if (strategy.forceProvider) {
      filtered = filtered.filter((m) => m.provider === strategy.forceProvider);
    }

    return filtered
      .filter((m) => this.providers.has(m.provider))
      .map((m) => ({
        provider: m.provider,
        modelId: m.modelId,
      }));
  }

  private calculateCost(
    costPer1mInput: number,
    costPer1mOutput: number,
    inputTokens: number,
    outputTokens: number,
  ): number {
    const inputCost = (inputTokens / 1000000) * costPer1mInput;
    const outputCost = (outputTokens / 1000000) * costPer1mOutput;
    return inputCost + outputCost;
  }

  getStats() {
    return {
      totalSpent: this.totalSpent,
      requestCount: this.requestLog.length,
      averageCostPerRequest: this.requestLog.length > 0 ? this.totalSpent / this.requestLog.length : 0,
      byProvider: this.getProviderStats(),
      recentRequests: this.requestLog.slice(-10),
    };
  }

  private getProviderStats() {
    const stats: Record<ProviderName, { count: number; totalCost: number }> = {
      claude: { count: 0, totalCost: 0 },
      gemini: { count: 0, totalCost: 0 },
      groq: { count: 0, totalCost: 0 },
      openmono: { count: 0, totalCost: 0 },
    };

    for (const log of this.requestLog) {
      stats[log.provider].count += 1;
      stats[log.provider].totalCost += log.cost;
    }

    return stats;
  }
}
