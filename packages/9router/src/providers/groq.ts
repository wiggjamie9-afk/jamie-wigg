import Groq from 'groq-sdk';
import { BaseProvider } from './base.js';
import { Message } from '../types.js';

export class GroqProvider extends BaseProvider {
  name = 'groq';
  private client: Groq;

  constructor(apiKey: string) {
    super();
    this.apiKey = apiKey;
    this.client = new Groq({ apiKey });
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

      const response = await this.client.chat.completions.create({
        model: modelId,
        max_tokens: options?.maxTokens || 4096,
        temperature: options?.temperature || 0.7,
        system: systemMessages.length > 0 ? systemMessages.join('\n\n') : undefined,
        messages: otherMessages.map((m) => ({
          role: m.role,
          content: m.content,
        })) as any,
      });

      const textContent = response.choices[0]?.message.content;
      if (!textContent) {
        throw new Error('No text content in response');
      }

      return {
        text: textContent,
        inputTokens: response.usage?.prompt_tokens || 0,
        outputTokens: response.usage?.completion_tokens || 0,
      };
    } catch (error) {
      throw this.parseError(error);
    }
  }
}
