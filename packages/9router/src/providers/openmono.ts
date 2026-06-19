import { BaseProvider } from './base.js';
import { Message } from '../types.js';

/**
 * OpenMono local-inference provider.
 *
 * Talks to a running OpenMono server (packages/openmono) over its
 * OpenAI-compatible /v1/chat/completions endpoint. Used as the final
 * fallback in a routing chain when all cloud providers are exhausted
 * (rate-limited, down, or out of budget) — inference stays local and free.
 */
export class OpenMonoProvider extends BaseProvider {
  name = 'openmono';
  private baseUrl: string;

  constructor(baseUrl = 'http://127.0.0.1:5000', apiKey?: string) {
    super();
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.apiKey = apiKey;
  }

  async call(
    messages: Message[],
    modelId: string,
    options?: {
      maxTokens?: number;
      temperature?: number;
      timeout?: number;
    },
  ): Promise<{
    text: string;
    inputTokens: number;
    outputTokens: number;
  }> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options?.timeout ?? 120000);

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (this.apiKey) {
        headers['Authorization'] = `Bearer ${this.apiKey}`;
      }

      const response = await fetch(`${this.baseUrl}/v1/chat/completions`, {
        method: 'POST',
        headers,
        signal: controller.signal,
        body: JSON.stringify({
          model: modelId,
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
          max_tokens: options?.maxTokens ?? 1024,
          temperature: options?.temperature ?? 0.7,
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenMono server returned ${response.status}`);
      }

      const data: any = await response.json();
      const text = data.choices?.[0]?.message?.content;
      if (!text) {
        throw new Error('No content in OpenMono response');
      }

      return {
        text,
        inputTokens: data.usage?.prompt_tokens ?? 0,
        outputTokens: data.usage?.completion_tokens ?? 0,
      };
    } catch (error) {
      throw this.parseError(error);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Liveness probe — lets the router skip the local fallback when the
   * OpenMono server isn't running, instead of eating a timeout.
   */
  async isAvailable(timeoutMs = 1500): Promise<boolean> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(`${this.baseUrl}/health`, { signal: controller.signal });
      return res.ok;
    } catch {
      return false;
    } finally {
      clearTimeout(timeoutId);
    }
  }
}
