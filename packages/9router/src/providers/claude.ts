import Anthropic from '@anthropic-ai/sdk';
import { BaseProvider } from './base.js';
import { Message } from '../types.js';

export class ClaudeProvider extends BaseProvider {
  name = 'claude';
  private client: Anthropic;

  constructor(apiKey: string) {
    super();
    this.apiKey = apiKey;
    this.client = new Anthropic({ apiKey });
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
    try {
      const systemMessages = messages.filter((m) => m.role === 'system').map((m) => m.content);
      const otherMessages = messages.filter((m) => m.role !== 'system');

      const response = await this.client.messages.create({
        model: modelId,
        max_tokens: options?.maxTokens || 4096,
        temperature: options?.temperature || 0.7,
        system: systemMessages.length > 0 ? systemMessages.join('\n\n') : undefined,
        messages: otherMessages.map((m) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
      });

      const textContent = response.content.find((c) => c.type === 'text');
      if (!textContent || textContent.type !== 'text') {
        throw new Error('No text content in response');
      }

      return {
        text: textContent.text,
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
      };
    } catch (error) {
      throw this.parseError(error);
    }
  }
}
